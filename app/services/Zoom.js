/**
 * This services provides functions for interacting with Zoom (https://zoom.us/)
 */
const jwt = require('jsonwebtoken')
const config = require('config')
const ms = require('ms')
const request = require('superagent')
const Joi = require('joi')

const isNil = require('lodash/isNil')
const pick = require('lodash/pick')

const { NotFound } = require('http-errors')

const { MeetingTypes } = require('../../constants/enums')
const { MeetingFields } = require('../../constants/forms')
const searchEntities = require('../../database/helpers/searchEntities')

const { isZoomBusiness } = require('../lib/helpers')

const logger = require('../lib/logger')

const Appointment = require('../models/Appointment')

let zoomAccessToken

/**
 * This private function generates the access token to be used for accessing Zoom API
 */
function _getZoomAccessToken() {
  // check if the token has not expired
  try {
    jwt.verify(zoomAccessToken, config.get('ZOOM_API_SECRET'))
  } catch (e) {
    // The token is invalid or expired, we generate a new one
    const payload = {
      iss: config.ZOOM_API_KEY,
      exp: new Date().getTime() + ms(config.get('ZOOM_ACCESS_TOKEN_LIFETIME')) / 1000,
    }
    zoomAccessToken = jwt.sign(payload, config.get('ZOOM_API_SECRET'))
  }
  return zoomAccessToken
}

/**
 * get zoom user
 * @param email the provider email
 * @returns {Promise<Object>}
 */
async function getZoomUser(email) {
  // get provider
  const providers = await searchEntities(models.User, { email })
  const provider = providers[0]

  if (isZoomBusiness() && provider.zoomUserId) {
    return {
      zoomUser: { id: provider.zoomUserId },
      isNew: false,
    }
  }
  // Get the access token to be used for querying Zoom API
  const accessToken = await _getZoomAccessToken()
  try {
    // Get the list of users from Zoom
    const response = await request
      .get(`${config.get('ZOOM_BASE_URL')}/users/${email}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Content-Type', 'application/json')
    return { zoomUser: response.body, isNew: false }
  } catch (e) {
    if (e.response && e.response.status === 404) {
      const body = {
        action: 'create',
        user_info: {
          email,
          type: 1,
          first_name: provider.firstName,
          last_name: provider.lastName,
        },
      }
      // Get the list of users from Zoom
      const createRsp = await request
        .post(`${config.get('ZOOM_BASE_URL')}/users`)
        .send(body)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Content-Type', 'application/json')
      return { zoomUser: createRsp.body, isNew: true }
    }
    throw e
  }
}
/**
 * Creates a Zoom meeting for the given user, appointment id with the given input data.
 *
 * @param {String} email The email of the logged in provider
 * @param {String} appointmentId The id of the appointment for which to create the meeting
 * @param {Object} data The Zoom meeting data https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingcreate
 */
async function createMeeting(email, appointmentId, data) {
  // Get the appointment from the database
  const appointment = await Appointment.findById(appointmentId)

  if (isNil(appointment)) {
    throw new NotFound(`Appointment with id ${appointmentId} does not exist`)
  }

  // Get the access token to be used for querying Zoom API
  const accessToken = await _getZoomAccessToken()

  const { zoomUser } = await getZoomUser(isZoomBusiness() ? email : config.get('ZOOM_ACCOUNT_EMAIL'))

  // Create the meeting in Zoom
  const createMeetingResponse = await request
    .post(`${config.get('ZOOM_BASE_URL')}/users/${zoomUser.id}/meetings`)
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Content-Type', 'application/json')
    .send(data)

  // Update the appointment meetingId and password in the database
  appointment.meetingId = createMeetingResponse.body.id
  appointment.meetingPassword = createMeetingResponse.body.password
  await appointment.save()

  return pick(createMeetingResponse.body, MeetingFields)
}

createMeeting.schema = {
  email: Joi.email(),
  appointmentId: Joi.string().required(),
  data: Joi.object()
    .keys({
      topic: Joi.string(),
      type: Joi.number().valid(Object.values(MeetingTypes)),
      start_time: Joi.string(),
      duration: Joi.number().positive(),
      timezone: Joi.string(),
      password: Joi.string().max(10),
      agenda: Joi.string(),
    })
    .unknown(true),
}

/**
 * Return the Zoom Sdk api key and api secret.
 * The api key/secret are read from the configuration (environment variables)
 *
 * @returns {Object} and object with apiKey and apiSecret keys with the corresponding values.
 */
async function getZoomSdkInfo() {
  return {
    apiKey: config.ZOOM_API_KEY,
    apiSecret: config.ZOOM_API_SECRET,
    sdkKey: config.ZOOM_SDK_KEY,
    sdkSecret: config.ZOOM_SDK_SECRET,
  }
}

/**
 * bind zoom
 * @param email the provider email
 * @returns {Promise<Object>}
 */
async function bindZoom(email) {
  const { zoomUser, isNew } = await getZoomUser(email)
  const provider = (await searchEntities(models.User, { email }))[0]

  if (!isNew) {
    provider.zoomUserId = zoomUser.id
    await provider.save()
  }
  return { isNew }
}
module.exports = {
  createMeeting,
  getZoomSdkInfo,
  bindZoom,
  getZoomUser,
}

logger.buildService(module.exports)
