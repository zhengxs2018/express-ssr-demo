/**
 * This service handles all the interactions with Nylas API
 */
const config = require('config')
const Nylas = require('nylas')

const { UNAUTHORIZED } = require('http-status-codes')
const { NotFound, BadRequest, Forbidden } = require('http-errors')

const isNil = require('lodash/isNil')

const logger = require('../lib/logger')

Nylas.config({
  clientId: config.NYLAS_APPLICATION_CLIENT_ID,
  clientSecret: config.NYLAS_APPLICATION_CLIENT_SECRET,
})

/**
 * Creates a calendar event in Nylas API
 *
 * @param {String} accessToken The nylas access token to use
 * @param {String} title The event title
 * @param {String} description The event description
 * @param {String} calendarId The id of the calendar in which to create the event
 * @param {array} participants an array of participants in the event
 * @param {Object} when an object holding the start_time/end_time of the event
 * @returns {Object} The created event
 */
async function createEvent(accessToken, title, description, calendarId, participants, when) {
  const nylas = Nylas.with(accessToken)
  try {
    const event = nylas.events.build()

    // set event data
    event.title = title
    event.description = description
    event.busy = true
    event.calendarId = calendarId
    event.participants = participants
    event.when = when
    event.location = config.get('NYLAS_EVENT_LOCATION')

    // save the event
    await event.save()
    return event
  } catch (e) {
    await _checkNylasAuthenticationError(e)
    throw e
  }
}

/**
 * remove event
 * @param accessToken the token
 * @param eventId the event id
 */
async function removeEvent(accessToken, eventId) {
  const nylas = Nylas.with(accessToken)
  try {
    await nylas.events.delete(eventId)
  } catch (e) {
    await _checkNylasAuthenticationError(e)
    throw e
  }
}

/**
 * Gets the id of the calendar supposed to hold all Ognomy events.
 *
 * @param {String} accessToken The access token to use to get the calendar from Nylas API
 * @param {String} email The user email for whom to get the calendar id
 * @param {Object} user the user
 * @returns {String} The id of the calendar
 */
async function getOgnomyCalendarId(accessToken, email, user) {
  const nylas = Nylas.with(accessToken)

  let calendarId = user.nylasCalendarId
  if (calendarId) {
    return calendarId
  }

  try {
    const calendars = await nylas.calendars.list()

    // Check if the user has a calendar specific to Ognomy meeting using the configured calendar name
    const ognomyCalendar = calendars.find(c => c.name === config.get('OGNOMY_CALENDAR_NAME'))
    if (isNil(ognomyCalendar)) {
      throw new NotFound(`Calendar with name ${config.get('OGNOMY_CALENDAR_NAME')} does not exist for ${email}`)
    }
    user.nylasCalendarId = ognomyCalendar.id
    await user.save()
    return ognomyCalendar.id
  } catch (e) {
    await _checkNylasAuthenticationError(e)
    throw e
  }
}

/**
 * Gets an account from Nylas API using the specified access token
 *
 * @param {String} accessToken The access token to use.
 * @returns {Object} The retrieved account object
 */
async function getAccount(accessToken) {
  const nylas = Nylas.with(accessToken)
  let account
  try {
    account = await nylas.account.get()
  } catch (e) {
    await _checkNylasAuthenticationError(e)
    throw e
  }
  return account
}

/**
 * Gets the list of events for the specified email and criteria.
 *
 * @param {String} accessToken The access token to use
 * @param {String} email The user email
 * @param {Object} criteria The search criteria
 * @param {Object} user the user
 */
async function listUserEvents(accessToken, email, criteria, user) {
  const nylas = Nylas.with(accessToken)
  let events = []
  try {
    // add the calendar filter to events retrieval criteria
    criteria.calendar_id = await getOgnomyCalendarId(accessToken, email, user)

    // Get the events
    events = await nylas.events.list(criteria)
  } catch (e) {
    await _checkNylasAuthenticationError(e)
    throw e
  }
  return events
}

/**
 * Gets an event by id from Nylas API
 *
 * @param {String} accessToken The access token to use.
 * @param {String} eventId The event id to get
 * @returns {Object} The retrieved event
 */
async function findEventById(accessToken, eventId) {
  const nylas = Nylas.with(accessToken)
  try {
    const event = await nylas.events.find(eventId)
    if (isNil(event)) {
      throw new NotFound(`Event with id eventId is not found`)
    }

    return event
  } catch (e) {
    await _checkNylasAuthenticationError(e)
    throw e
  }
}

/**
 * Checks whether there is an authentication error with Nylas API.
 *
 * @param {Object} e The error object to check
 */
function _checkNylasAuthenticationError(e) {
  if (e.statusCode === UNAUTHORIZED) {
    throw new Forbidden(`Invalid Nylas authentication, the account should be re-authenticated`)
  }
}

/**
 * Checks whether the user is bound with Nylas
 *
 * @param {Object} user The user to check
 */
function isUserBoundToNylas(user) {
  if (isNil(user.nylasAccessToken) || user.nylasAccessToken.trim().length === 0) {
    throw new BadRequest(`The user with email ${user.email} is not bound to Nylas`)
  }
}

module.exports = {
  createEvent,
  getOgnomyCalendarId,
  getAccount,
  removeEvent,
  listUserEvents,
  isUserBoundToNylas,
  findEventById,
}

logger.buildService(module.exports)
