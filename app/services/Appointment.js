/**
 * This service provides functions for appointments management
 */
const fs = require('fs')
const path = require('path')
const util = require('util')

const config = require('config')
const Joi = require('joi')

const MomentRange = require('moment-range')

const includes = require('lodash/includes')
const pick = require('lodash/pick')
const isNil = require('lodash/isNil')

const { BadRequest, NotFound, Forbidden } = require('http-errors')

const { UserRoles } = require('../../constants/access')
const { AppointmentFields, CalendarEventFields } = require('../../constants/forms')
const { AppointmentTypes } = require('../../constants/enums')

const searchEntities = require('../../database/helpers/searchEntities')

const logger = require('../lib/logger')
const { checkNullOrEmptyArray, getUserName, sendEmail } = require('../lib/helpers')

const User = require('../models/User')
const Appointment = require('../models/Appointment')

const NylasService = require('./Nylas')
const ReturnDocumentService = require('./ReturningDocument')

const moment = MomentRange.extendMoment(require('moment-timezone'))

/**
 * This private function creates an calendar event for a given user.
 *
 * @param {Object} user The user for whom to create the event
 * @param {Array} participants The array of the event participants
 * @param {Object} when The object holding the event start_time and end_time
 * @param {String} guestName The event guest name
 * @param {Object} user the user
 * @returns {Object} The created event
 */
async function _createEventForUser(user, participants, when, guestName) {
  // Check if user is bound to Nylas
  await NylasService.isUserBoundToNylas(user)

  // Get the calendarId
  const calendarId = await NylasService.getOgnomyCalendarId(user.nylasAccessToken, user.email, user)

  // Create the event for the user in Nylas API
  return NylasService.createEvent(
    user.nylasAccessToken,
    util.format(config.MEETING_TITLE_TEMPLATE, getUserName(user), guestName),
    util.format(config.MEETING_DESCRIPTION_TEMPLATE, getUserName(user), guestName),
    calendarId,
    participants,
    when
  )
}

/**
 * check time conflict
 * @param provider the provider
 * @param patient the patient
 * @param data the request data
 */
async function checkAppointConflict(provider, patient, data) {
  let appointments = await searchEntities(Appointment, { providerId: provider.id })
  for (let i = 0; i < appointments.length; i++) {
    const when = appointments[i]
    const r1 = moment.range(moment(when.startTime), moment(when.endTime))
    if (r1.overlaps(moment.range(moment(data.startTime), moment(data.endTime)))) {
      throw new BadRequest('Sorry, this time just got booked, please pick another time.')
    }
  }
  // allow only one upcoming appointment, patients cannot schedule another one until it is finished or canceled.
  appointments = await searchEntities(Appointment, { patientId: patient.id })
  for (let i = 0; i < appointments.length; i++) {
    const appointment = await extendAppointment(appointments[i], provider)
    if ([AppointmentTypes.Ongoing, AppointmentTypes.Upcoming].includes(appointment.status)) {
      throw new BadRequest(
        `You can only schedule one appointment at a time. Please cancel an appointment to re-schedule, or call the office at ${config.TEL_PHONE} for assistance`
      )
    }
  }
}

async function sendNewAppointmentEmail(provider, patient, data) {
  // send email
  const emailContent = util.format(
    config.APPOINTMENT_CONFIRM_EMAIL,
    getUserName(patient),
    data.on,
    data.at,
    getUserName(provider)
  )
  await sendEmail(config.APPOINTMENT_CONFIRM_SUBJECT, emailContent, [patient.email], null)
}

async function sendFollowUpAppointmentEmail(provider, patient, data) {
  // send email
  const emailContent = util.format(
    config.APPOINTMENT_FOLLOW_UP_EMAIL,
    getUserName(patient),
    data.on,
    data.at,
    getUserName(provider)
  )
  const documentsPath = path.join(config.PATIENT_EMAIL_FILES, '..', 'returning-documents')
  let attachments = fs.readdirSync(documentsPath).map(filename => ({
    filename,
    path: path.join(documentsPath, filename),
  }))
  attachments = attachments.filter(attachment => !includes(['metadata.json', '.DS_Store'], attachment.filename))
  await sendEmail(config.get('APPOINTMENT_FOLLOW_UP_SUBJECT'), emailContent, [patient.email], null, attachments)
}

/**
 * Creates an appointment using the specified data.
 *
 * @param authUser auth user
 * @param {Object} data The appointment data to create
 * @returns {Object} an object with the id of the created appointment
 */
async function createAppointment(authUser, data) {
  const { email } = authUser
  // Get the logged-in user entity from the database (The user who creates the appointment)
  let users = await searchEntities(User, { email })
  const loggedInUser = users[0]
  // detect who is the provider (logged-in user or invitee)
  let provider
  let patient

  if (includes(loggedInUser.roles, UserRoles.Admin) || includes(loggedInUser.roles, UserRoles.Secretary)) {
    provider = await User.findById(data.providerId)
    patient = await User.findById(data.patientId)
    if (!provider) {
      throw new NotFound('provider not found')
    }
    if (!patient) {
      throw new NotFound('patient not found')
    }
  } else {
    if (data.patientId || data.providerId) {
      throw new BadRequest('you are not allow create with providerId or patientId')
    }

    // Get the invitee entity from the database
    users = await searchEntities(User, { email: data.inviteeEmail })
    if (!users || users.length === 0) {
      throw new NotFound(`User with email ${data.inviteeEmail} does not exist`)
    }
    const invitee = users[0]
    if (includes(loggedInUser.roles, UserRoles.Physician) && includes(invitee.roles, UserRoles.Physician)) {
      // Both the logged in user and the invitee are providers
      throw new BadRequest(`A provider is not allowed to schedule an appointment with another provider`)
    }
    if (includes(loggedInUser.roles, UserRoles.Patient) && includes(invitee.roles, UserRoles.Patient)) {
      throw new BadRequest(`A patient is not allowed to schedule an appointment with another patient`)
    }

    if (includes(loggedInUser.roles, UserRoles.Physician)) {
      // The logged-in user is the provider
      provider = loggedInUser
      patient = invitee
    } else {
      // The logged-in user is the patient
      provider = invitee
      patient = loggedInUser
    }
  }

  await checkAppointConflict(provider, patient, data)

  const patientName = getUserName(patient)
  const participants = []

  // Construct the when parameter (with start/end times)
  const when = {
    start_time: moment(data.startTime).unix(),
    end_time: moment(data.endTime).unix(),
  }

  // Create the event for the Provider in Nylas
  const event = await _createEventForUser(provider, participants, when, patientName)
  const createBody = {
    eventId: event.id,
    providerId: provider.id,
    patientId: patient.id,
    status: AppointmentTypes.Upcoming,
    description: data.description || 'CONSULTATION',
    startTime: moment.unix(when.start_time).toDate(),
    endTime: moment.unix(when.end_time).toDate(),
  }
  // check is first appointment or follow up
  // because of patient only have one appointment in one time, so just need check the appointment count
  let appointments = await searchEntities(Appointment, {
    providerId: provider.id,
    patientId: patient.id,
  })
  if (appointments.length > 0) {
    await sendFollowUpAppointmentEmail(provider, patient, data)
    await ReturnDocumentService.createReturningDocument(createBody)
  } else {
    await sendNewAppointmentEmail(provider, patient, data)
  }
  // Save the Appointment into the database
  const appointment = new Appointment(createBody)
  await appointment.save()
  return { appointmentId: appointment.id }
}

createAppointment.schema = {
  authUser: Joi.object(),
  data: Joi.object().keys({
    inviteeEmail: Joi.email(),
    description: Joi.string(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    providerId: Joi.string(),
    patientId: Joi.string(),
    at: Joi.string(),
    on: Joi.string(),
  }),
}

/**
 * Gets the appointments for the user identified by the given email.
 * The appointments are filtered by the specified type (past, upcoming or ongoing)
 *
 * @param {String} authUser the auth user
 * @param {String} query The appointment types to get, should be one of 'past', 'upcoming' or 'ongoing'
 */
async function getAppointments(authUser, query) {
  const email = authUser.email
  const { type, physicianId, patientId } = query

  // Get the user from the database.
  const users = await searchEntities(User, { email })
  await checkNullOrEmptyArray(users, `User with email ${email} does not exist`)
  const user = users[0]

  let searchCriteria
  const currentTimestamp = moment().unix()
  switch (type) {
    case AppointmentTypes.Upcoming:
      // get upcoming events
      searchCriteria = { starts_after: currentTimestamp }
      break
    case AppointmentTypes.Past:
      searchCriteria = { ends_before: currentTimestamp }
      break
    case AppointmentTypes.Ongoing:
      searchCriteria = {
        starts_before: currentTimestamp,
        ends_after: currentTimestamp,
      }
      break
    default:
      searchCriteria = {}
  }
  if (includes(user.roles, UserRoles.Admin) || includes(user.roles, UserRoles.Secretary)) {
    const newSearchCriteria = {}
    if (patientId) {
      newSearchCriteria.patientId = patientId
    }
    if (physicianId) {
      newSearchCriteria.providerId = physicianId
    }
    return _getPatientAppointments(newSearchCriteria, query)
  } else {
    if (patientId || physicianId) {
      throw new BadRequest('you are not allow search by physicianId or patientId')
    }
  }

  // check the user role
  const isProvider = includes(users[0].roles, UserRoles.Physician)
  // check if the provider is bound to Nylas
  if (isProvider) {
    await NylasService.isUserBoundToNylas(users[0])
  }

  if (isProvider) {
    const events = await NylasService.listUserEvents(users[0].nylasAccessToken, users[0].email, searchCriteria, user)
    return _formatProviderAppointments(events, user)
  } else {
    return _getPatientAppointments({ patientId: users[0].id }, query)
  }
}

getAppointments.schema = {
  authUser: Joi.object(),
  query: Joi.object().keys({
    physicianId: Joi.string(),
    patientId: Joi.string(),
    type: Joi.string(),
    limit: Joi.number(),
  }),
}

async function extendAppointment(appointment, provider) {
  const extendDescription = () => {
    let description = appointment.description
    if (
      appointment.description.toLowerCase().indexOf('upcoming') === 0 ||
      appointment.description.toLowerCase().indexOf('past') === 0 ||
      appointment.description.toLowerCase().indexOf('ongoing') === 0
    ) {
      const parts = appointment.description.split(' ')
      parts.shift()
      description = parts.join(' ')
    }
    description = appointment.status.toUpperCase() + ' ' + description
    appointment.description = description
  }
  if (appointment.status === AppointmentTypes.Past) {
    extendDescription()
    return appointment
  }

  const timeZone = provider.providerInfo.timeZone
  const current = moment.tz(moment(), timeZone).unix()

  const s = moment(appointment.startTime).unix()
  const e = moment(appointment.endTime).unix()

  if (e <= current) {
    appointment.status = AppointmentTypes.Past
  } else if (e > current && s <= current) {
    appointment.status = AppointmentTypes.Ongoing
  } else {
    appointment.status = AppointmentTypes.Upcoming
  }
  extendDescription()
  return appointment
}

/**
 * This private function lists the patient appointments for the Nylas events that match the given search criteria
 * @param {Object} searchCriteria The events search criteria
 * @param query the query params
 */
async function _getPatientAppointments(searchCriteria, query) {
  // Get the list of the patient appointments from the database
  const dbAppointments = await searchEntities(Appointment, searchCriteria)
  const result = []

  for (const appointment of dbAppointments) {
    const provider = await User.findById(appointment.providerId)

    let ap = await extendAppointment(appointment, provider)
    result.push({
      ...pick(ap, AppointmentFields),
      provider: { ...pick(provider, constants.ProviderFields) },
    })
  }
  if (query.limit) {
    return result.splice(0, query.limit)
  }
  return result
}

/**
 * This private function gets and properly formats the provider appointments using the specified events
 *
 * @param {Object} events the events for which to populate the corresponding appointments.
 * @param user the provider user
 * @returns an array of the user appointments with the corresponding calendar events
 */
async function _formatProviderAppointments(events, user) {
  const appointments = []
  const localPatientMap = {}
  for (const event of events) {
    const res = pick(event, CalendarEventFields)

    res.when = {}
    res.when.startTime = moment.tz(event.when.start_time * 1000, user.providerInfo.timeZone).toISOString()
    res.when.endTime = moment.tz(event.when.end_time * 1000, user.providerInfo.timeZone).toISOString()

    const dbAppointments = await searchEntities(Appointment, { eventId: event.id, providerId: user.id })

    // Ignore the events that do not have corresponding Appointment in the database
    if (dbAppointments.length === 0) {
      continue
    }

    const appointment = await extendAppointment(dbAppointments[0], user)
    const patientId = appointment.patientId
    const patient = localPatientMap[patientId] || (await User.findById(patientId))
    localPatientMap[patientId] = patient
    appointments.push({
      ...pick(appointment, AppointmentFields),
      patient: pick(patient.toJSON(), 'firstName', 'lastName', 'email', 'id', 'uid', 'headUrl'),
      current: moment.tz(moment(), user.providerInfo.timeZone),
      ...{ event: res },
    })
  }
  return appointments
}

/**
 * completed appointment
 * @param userId the user id
 * @param appointmentId the appointment id
 * @returns {Promise<void>}
 */
async function completedAppointment(userId, appointmentId) {
  const appointment = await _checkAppointmentOwnership(appointmentId, userId, true)
  appointment.status = AppointmentTypes.Past
  await appointment.save()
}

/**
 * host join or leave meeting
 * @param userId the user id
 * @param appointmentId the appointment id
 * @param query the request query
 * @returns {Promise<void>}
 */
async function joinOrLeave(userId, appointmentId, query) {
  const appointment = await _checkAppointmentOwnership(appointmentId, userId, true)
  appointment.hostJoined = query.type === 'join'
  await appointment.save()
}

/**
 * Updates an appointment identified by the given appointment id using the specified data.
 *
 * @param {String} authUser the user for whom to update the appointment
 * @param {String} appointmentId The id of the appointment to update
 * @param {Object} data The data to use for updating the appointment
 */
async function updateAppointment(authUser, appointmentId, data) {
  const { userId } = authUser
  const user = await User.findById(userId)

  // Check if the logged-in user is a provider
  const isProvider = includes(user.roles, UserRoles.Physician)

  // If the loggedIn user is a provider, we check the linking with Nylas
  if (isProvider) {
    await NylasService.isUserBoundToNylas(user)
  }

  // Check if the user has permissions to update the appointment and get the appointment entity
  const appointment = await _checkAppointmentOwnership(appointmentId, userId, isProvider)

  let providerNylasToken
  if (isProvider) {
    providerNylasToken = user.nylasAccessToken
  } else {
    // The user is a patient, both roles are exclusive
    // Get the provider to get its token
    const provider = await User.findById(appointment.providerId)
    providerNylasToken = provider.nylasAccessToken
  }

  // Get the event from Nylas
  const event = await NylasService.findEventById(providerNylasToken, appointment.eventId)

  // Construct the when parameter (with start/end times)
  const when = {
    start_time: moment(data.startTime, moment.ISO_8601).unix(),
    end_time: moment(data.endTime, moment.ISO_8601).unix(),
  }

  // Set the updated dates
  event.when = when

  // update the busy flag for the event
  if (data.markAsCompleted) {
    event.busy = false
    appointment.status = AppointmentTypes.Past
  }

  // we update the title/description for the event
  event.title = data.title
  event.description = data.description

  if (isProvider) {
    if (!isNil(data.meetingId)) {
      appointment.meetingId = data.meetingId
    }
    if (!isNil(data.meetingPassword)) {
      appointment.meetingPassword = data.meetingPassword
    }
  } else {
    // The user is a patient
    if (!isNil(data.meetingId) || !isNil(data.meetingPassword)) {
      throw new Forbidden(
        `You are not allowed to update appointment meetingId/meeting password, Only providers can do it`
      )
    }
  }

  // save the event in nylas
  await event.save()

  // Save the appointment to the database
  await appointment.save()
}

updateAppointment.schema = {
  userId: Joi.string().required(),
  appointmentId: Joi.string().required(),
  data: Joi.object().keys({
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    markAsCompleted: Joi.boolean(),
    title: Joi.string(),
    description: Joi.string(),
    meetingId: Joi.number(),
    meetingPassword: Joi.string(),
  }),
}

/**
 * This private function checks whether the user identified by the given userId has update permissions on the appointment
 *
 * @param {String} appointmentId The id of the appointment for which to check the ownership
 * @param {String} userId The id of the user to for whom to check the ownership
 * @param {Boolean} isProvider The flag indicating whether the user is a provider or no
 */
async function _checkAppointmentOwnership(appointmentId, userId, isProvider) {
  // Find the appointment
  const appointment = await Appointment.findById(appointmentId)
  if (isNil(appointment)) {
    throw new NotFound(`Appointment with id ${appointmentId} does not exist`)
  }

  const user = await User.findById(userId)
  if (includes(user.roles, UserRoles.Admin) || includes(user.roles, UserRoles.Secretary)) {
    return appointment
  }

  // provider and patient roles are exclusive
  if ((isProvider && appointment.providerId !== userId) || (!isProvider && appointment.patientId !== userId)) {
    throw new Forbidden(`You are not allowed to update this appointment`)
  }
  return appointment
}

/**
 * get appoint by id
 * @param id the id
 * @returns {Promise<void>}
 */
async function getAppointment(id) {
  const appointment = await Appointment.findById(id)
  if (!appointment) {
    throw new NotFound(`cannot find appointment where id = ${id}`)
  }
  const provider = await User.findById(appointment.providerId)
  return extendAppointment(appointment, provider)
}

/**
 * delete appointment
 * @param userId the user id
 * @param id the appointment
 * @return {Promise<void>}
 */
async function deleteAppointment(userId, id) {
  const appointment = await Appointment.findById(id)
  if (!appointment) {
    throw new NotFound(`cannot find appointment where id = ${id}`)
  }

  if (appointment.patientPaid || !isNil(appointment.meetingId) || !isNil(appointment.meetingPassword)) {
    throw new BadRequest(`cannot delete this appointment`)
  }

  if (appointment.providerId !== userId && appointment.patientId !== userId) {
    throw new Forbidden(`you cannot delete this`)
  }

  const provider = await User.findById(appointment.providerId)
  // remove event from nylas
  if (provider && provider.nylasAccessToken && provider.nylasCalendarId) {
    await NylasService.removeEvent(provider.nylasAccessToken, appointment.eventId)
  }
  await appointment.delete()
}
module.exports = {
  createAppointment,
  getAppointments,
  updateAppointment,
  completedAppointment,
  extendAppointment,
  getAppointment,
  deleteAppointment,
  joinOrLeave,
}

logger.buildService(module.exports)
