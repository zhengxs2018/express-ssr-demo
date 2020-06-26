/**
 * Controller for security endpoints
 */
const { CREATED, NO_CONTENT } = require('http-status-codes')

const Security = require('../services/Security')

/**
 * Handles the signup request.
 *
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function signup(req, res) {
  await Security.signup(req.body)
  res.status(CREATED).end()
}

/**
 * Handles the login request.
 *
 * @param req the http request
 * @param res the http response
 */
async function login(req, res) {
  res.send(await Security.login(req.body))
}

/**
 * Handles the request for sending the verification code to a user.
 *
 * @param req the http request
 * @param res the http response
 */
async function sendVerificationCode(req, res) {
  await Security.sendVerificationCode(req.query)
  res.end()
}

/**
 * Handles the forgot password request.
 *
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function forgotPassword(req, res) {
  await Security.forgotPassword(req.body)
  res.status(NO_CONTENT).end()
}

/**
 * ping
 *
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function ping(req, res) {
  res.json({ message: 'pong' })
}

module.exports = {
  login,
  signup,
  forgotPassword,
  sendVerificationCode,
  ping,
}
