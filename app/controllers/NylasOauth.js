/**
 * This controller handles the Oauth requests for authenticating users with Nylas
 */
const NylasOauthService = require('../services/NylasOauth')

const authCallbackMap = {}

/**
 * Handles the request to get the url to be used for authenticating a user with Nylas
 *
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function getAuthenticationUrl(req, res) {
  authCallbackMap[req.query.id] = req.query.callback
  res.send(await NylasOauthService.getAuthenticationUrl(`${req.protocol}://${req.headers.host}`, req.query.id))
}

/**
 * Handles the request to exchange the Nylas code for an access token.
 * It is the callback of the authentication url retrieval.
 *
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function exchangeCodeForToken(req, res) {
  const rsp = await NylasOauthService.exchangeCodeForToken(req.query.code, req.query.state)
  res.redirect(`${authCallbackMap[req.query.state]}?result=${rsp.result}&message=${rsp.message}`)
  delete authCallbackMap[req.query.state]
}

module.exports = {
  getAuthenticationUrl,
  exchangeCodeForToken,
}
