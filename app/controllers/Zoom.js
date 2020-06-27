/**
 * Controller for Zoom related endpoints.
 */
const ZoomService = require('../services/Zoom')

/**
 * Handles the request to create a Zoom meeting for a given appointment
 *
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function createMeeting(req, res) {
  res.send(await ZoomService.createMeeting(req.user.email, req.query.appointmentId, req.body))
}

/**
 * Handles the request to get the Zoom SDK information ( Api Key and secret)
 *
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function getZoomSdkInfo(req, res) {
  res.send(await ZoomService.getZoomSdkInfo())
}

/**
 * bind zoom
 *
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function bindZoom(req, res) {
  res.json(await ZoomService.bindZoom(req.user.email))
}

module.exports = {
  createMeeting,
  bindZoom,
  getZoomSdkInfo,
}
