/**
 * This service provides functions for availability management.
 */
const config = require('config')
const MomentRange = require('moment-range')

const joi = require('joi')

const isNil = require('lodash/isNil')
const each = require('lodash/each')
const includes = require('lodash/includes')
const filter = require('lodash/filter')

const { BadRequest } = require('http-errors')

const { UserRoles } = require('../../constants/access')

const { checkNullOrEmptyArray } = require('../lib/helpers')

const logger = require('../lib/logger')

const User = require('../models/User')

const NylasService = require('./Nylas')

const moment = MomentRange.extendMoment(require('moment-timezone'))

const SHORT_DATE_FORMAT = 'YYYY-MM-DD'

/**
 * get provider by email
 * @param email the email
 * @returns {Promise<*>}
 */
async function getProvider(email) {
  // Get the user  by email
  const exampleUser = new User({ email })
  exampleUser.encryptFieldsSync()

  const providers = await User.find({ email: exampleUser.email })

  await checkNullOrEmptyArray(providers, `User with email ${email} does not exist`)

  if (!includes(providers[0].roles, UserRoles.Physician)) {
    throw new BadRequest(`The email ${email} is not a valid provider email`)
  }
  return providers[0]
}

/**
 * Gets the availability of the provider identified by the given email.
 *
 * @param {String} date The date in format 'YYYY-MM-DD' for which to check the availability
 * @param {Array} events current events
 * @param currentTime current time
 * @param timeZone the timeZone
 * @param weekDay the week day
 * @param workDays the work days
 * @returns {Array} The array of free time slots of the provider in the given day
 */
function getProviderSchedule(date, events, currentTime, timeZone, weekDay, workDays) {
  // get all slots in this day
  let daySlots = []
  const ranges = workDays || config.get('WORK_DAY_TIME_RANGE')
  const workTimes = ranges[weekDay]
  if (isNil(workTimes)) {
    return []
  }
  const slotInterval = config.get('TIME_SLOT_LENGTH_MINUTES') * constants.MinToSecondsConversionFactor

  each(workTimes, workTime => {
    const startWorkTS = moment.tz(`${date} ${workTime.start}`, timeZone).unix()
    const endWorkTS = moment.tz(`${date} ${workTime.end}`, timeZone).unix()
    for (let i = startWorkTS; i < endWorkTS; i += slotInterval) {
      if (i <= currentTime.unix()) {
        continue
      }
      daySlots.push({
        start: moment.unix(i),
        end: moment.unix(Math.min(i + slotInterval, endWorkTS)),
      })
    }
  })

  filter(events, e => {
    if (daySlots.length <= 0) {
      return false
    }
    const when = e.when
    const r1 = moment.range(moment.unix(when.start_time), moment.unix(when.end_time))
    const inToday = r1.overlaps(moment.range(daySlots[0].start, daySlots[daySlots.length - 1].end))
    if (inToday) {
      each(daySlots, slot => {
        const r2 = moment.range(slot.start, slot.end)
        if (r1.overlaps(r2)) {
          slot.delete = true
        }
      })
      daySlots = filter(daySlots, slot => !slot.delete)
    }
    return inToday
  })

  return daySlots
    .map(v => ({
      start: moment(v.start),
      end: moment(v.end),
    }))
    .filter(v => v.end.diff(v.start, 'minutes') >= config.TIME_SLOT_LENGTH_MINUTES)
}

getProviderSchedule.schema = {
  email: joi.email(),
  date: joi.string(),
}

/**
 * This function counts the available time slots for the provider identified by the specified email for a given month.
 *
 * @param {String} email The email of the provider for whom to count the available time slots.
 * @param {String} startMonth The start month for which to count the available time slots in format 'YYYY-MM'
 * @param {String} endMonth The end month for which to count the available time slots in format 'YYYY-MM'
 */
async function countAvailableTimeSlots(email, startMonth, endMonth) {
  const provider = await getProvider(email)
  const timeZone = provider.providerInfo.timeZone

  const currentTime = moment.tz(moment(), timeZone)
  const start = moment().startOf('days')
  const end = moment().add('days', config.APPOINTMENT_MAX_DAY)
  const schedules = await getSchedule({ roles: [UserRoles.Admin] }, provider._id)
  const workDays = {}
  each(schedules, sch => {
    workDays[sch.key] = sch.slots
  })
  await NylasService.isUserBoundToNylas(provider)
  const allEvents = await NylasService.listUserEvents(
    provider.nylasAccessToken,
    provider.email,
    {
      starts_after: start.unix(),
      ends_before: end.unix(),
    },
    provider
  )

  // push local events to avoid nylas api cache problem
  const appointments = await helper.searchEntities(models.Appointment, { providerId: provider.id })
  for (let i = 0; i < appointments.length; i++) {
    const when = appointments[i]
    allEvents.push({ when: { start_time: moment(when.startTime).unix, end_time: moment(when.endTime).unix } })
  }

  const result = {}

  const getEventsByDate = date => {
    return allEvents
      .filter(e => e.when && e.when.start_time && e.when.end_time)
      .filter(e => {
        const sTs = moment.max(date.startOf('days'), moment(currentTime)).unix()
        const eTs = date.endOf('days').unix()
        return e.when.start_time >= sTs && e.when.end_time <= eTs
      })
  }
  const getFreeSlotByDay = date => {
    const events = getEventsByDate(date)
    const key = date.tz(timeZone).format(SHORT_DATE_FORMAT)
    const weekDay = date.tz(timeZone).format('dddd')
    const slots = getProviderSchedule(key, events, currentTime, timeZone, weekDay, workDays)
    if (slots && slots.length > 0) {
      result[key] = { slots }
    }
  }

  let dates = [moment(start)]
  while (start.add(1, 'days').diff(end) <= 0) {
    dates.push(moment(start))
  }
  each(dates, (date, i) => {
    // next week -- NOTE: temporarily changed to 2 days
    if (i < 2) {
      return
    }
    getFreeSlotByDay(date)
  })
  return result
}

countAvailableTimeSlots.schema = {
  email: joi.email(),
  startMonth: joi.string(),
  endMonth: joi.string(),
}

/**
 * update Schedule
 * @param authUser the auth user
 * @param providerId the provider id
 * @param entity the request body
 * @return {Promise<*>}
 */
async function updateSchedule(authUser, providerId, entity) {
  if (entity.length <= 0) {
    throw new BadRequest('request cannot be empty')
  }
  if (
    !includes(authUser.roles, UserRoles.Admin) &&
    !includes(authUser.roles, UserRoles.Secretary) &&
    authUser.id !== providerId
  ) {
    throw new errors.ForbiddenError('cannot update this')
  }
  const provider = await models.User.findById(providerId)
  const timeZone = provider.providerInfo.timeZone
  const appointments = await helper.searchEntities(models.Appointment, { providerId })
  const dateMap = {}

  each(appointments, app => {
    const key = moment(app.startTime)
      .tz(timeZone)
      .format('dddd')
    dateMap[key] = dateMap[key] || []
    dateMap[key].push(app)
  })
  for (let i = 0; i < entity.length; i++) {
    const e = entity[i]
    if (!includes(constants.ScheduleKey, e.key)) {
      throw new BadRequest(`key can only be ${constants.ScheduleKey}`)
    }
    if (e.slots.length <= 0) {
      throw new BadRequest(`slots cannot be empty for ${e.key}`)
    }

    let items = dateMap[e.key] || []
    let passedCheck = true
    if (items.length > 0) {
      for (let j = 0; j < e.slots.length; j++) {
        const slot = e.slots[j]
        items = items.filter(item => {
          const d = moment(item.startTime)
            .tz(timeZone)
            .format(SHORT_DATE_FORMAT)
          const s = moment.tz(d + ' ' + slot.start, timeZone)
          const t = moment.tz(d + ' ' + slot.end, timeZone)
          const r1 = moment.range(item.startTime, item.endTime)
          const r2 = moment.range(s, t)
          return !r2.contains(r1)
        })
      }
      if (items.length > 0) {
        passedCheck = false
      }
    }

    if (!passedCheck) {
      throw new errors.ConflictError(`need cancel all appointments on ${e.key}`)
    }

    const sch = await helper.searchEntities(models.Schedule, { userId: providerId, key: e.key }, true)
    if (sch) {
      sch.slots = e.slots
      await sch.save()
    } else {
      await models.Schedule.create({
        userId: providerId,
        key: e.key,
        slots: e.slots,
      })
    }
  }
  return getSchedule(authUser, providerId)
}

updateSchedule.schema = {
  authUser: joi.object(),
  providerId: joi.string(),
  entity: joi
    .array()
    .items(joi.object())
    .default([]),
}

/**
 * get Schedule
 * @param authUser the auth user
 * @param providerId the provider id
 * @return {Promise<*>}
 */
async function getSchedule(authUser, providerId) {
  if (
    !includes(authUser.roles, UserRoles.Admin) &&
    !includes(authUser.roles, UserRoles.Secretary) &&
    authUser.id !== providerId
  ) {
    throw new errors.ForbiddenError('cannot read this schedule')
  }

  const schedules = await helper.searchEntities(models.Schedule, { userId: providerId })
  if (schedules.length <= 0) {
    const defaultSlot = config.WORK_DAY_TIME_RANGE
    const keys = Object.keys(defaultSlot)
    for (let i = 0; i < keys.length; i++) {
      await models.Schedule.create({
        userId: providerId,
        key: keys[i],
        slots: defaultSlot[keys[i]],
      })
    }
    return helper.searchEntities(models.Schedule, { userId: providerId })
  } else {
    return schedules
  }
}

module.exports = {
  getProviderSchedule,
  countAvailableTimeSlots,
  getSchedule,
  updateSchedule,
}

logger.buildService(module.exports)
