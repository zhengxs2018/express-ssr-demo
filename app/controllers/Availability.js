/**
 * This controller handles the requests related to provider availability
 */
const AvailabilityService = require('../services/Availability')

/**
 * Handles the request for getting the availability of a given provider.
 *
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function getProviderSchedule(req, res) {
  res.send(
    await AvailabilityService.countAvailableTimeSlots(req.query.providerEmail, req.query.startMonth, req.query.endMonth)
  )
}

/**
 * update schedules
 *
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function updateSchedule(req, res) {
  res.json(await AvailabilityService.updateSchedule(req.user, req.params.id, req.body))
}

/**
 * get schedules
 *
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function getSchedule(req, res) {
  res.json(await AvailabilityService.getSchedule(req.user, req.params.id))
}
module.exports = {
  getProviderSchedule,
  getSchedule,
  updateSchedule,
}
