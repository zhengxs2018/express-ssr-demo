/**
 * This controllers handles the appointment related endpoints
 */
const HttpStatus = require('http-status-codes')

const AppointmentService = require('../services/Appointment')
const ReturningDocumentService = require('../services/ReturningDocument')

/**
 * Handles the create appointment request.
 *
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function createAppointment(req, res) {
  res.status(HttpStatus.CREATED).json(await AppointmentService.createAppointment(req.user, req.body))
}

/**
 * Handles the request for getting the appointment of a given user.
 *
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function getAppointments(req, res) {
  res.send(await AppointmentService.getAppointments(req.user, req.query))
}

/**
 * Handles the request for updating an appointment.
 *
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function updateAppointment(req, res) {
  await AppointmentService.updateAppointment(req.user, req.params.appointmentId, req.body)
  res.end()
}

/**
 * mark appointment status to end
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function completedAppointment(req, res) {
  await AppointmentService.completedAppointment(req.user.id, req.params.appointmentId)
  res.end()
}

/**
 * join or leave meeting
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function joinOrLeave(req, res) {
  await AppointmentService.joinOrLeave(req.user.id, req.params.appointmentId, req.query)
  res.end()
}

/**
 * get appointment
 * @param req the request
 * @param res the response
 * @returns {Promise<void>}
 */
async function getAppointment(req, res) {
  res.json(await AppointmentService.getAppointment(req.params.appointmentId))
}
/**
 * delete appointment by id
 * @param req the request
 * @param res the response
 * @returns {Promise<void>}
 */
async function deleteAppointment(req, res) {
  res.json(await AppointmentService.deleteAppointment(req.user.id, req.params.appointmentId))
}

/**
 * upload Return DocumentPage
 * @param req the request
 * @param res the response
 * @returns {Promise<void>}
 */
async function uploadReturnDocumentPage(req, res) {
  res.json(await ReturningDocumentService.uploadReturnDocumentPage(req.user.id, req.params.appointmentId, req.body))
}

/**
 * update Return DocumentPage
 * @param req the request
 * @param res the response
 * @returns {Promise<void>}
 */
async function updateReturnDocumentPage(req, res) {
  res.json(await ReturningDocumentService.updateReturnDocumentPage(req.user.id, req.params.appointmentId, req.body))
}

/**
 * get follow up
 * @param req the request
 * @param res the response
 * @returns {Promise<void>}
 */
async function getFollowUpAppointments(req, res) {
  res.json(await ReturningDocumentService.getFollowUpAppointments(req.user.id, req.query.patientId))
}

module.exports = {
  createAppointment,
  getAppointments,
  getAppointment,
  uploadReturnDocumentPage,
  updateReturnDocumentPage,
  getFollowUpAppointments,
  updateAppointment,
  completedAppointment,
  deleteAppointment,
  joinOrLeave,
}
