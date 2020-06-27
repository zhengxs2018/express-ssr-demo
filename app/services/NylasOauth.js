/**
 * Provides functions for handling the user authentication with Nylas API
 */
const config = require('config')
const Joi = require('joi')
const Nylas = require('nylas')

const { NotFound } = require('http-errors')

const { NylasAuthScopes } = require('../../constants/enums')

const searchEntities = require('../../database/helpers/searchEntities')

const User = require('../models/User')

const logger = require('../lib/logger')

Nylas.config({
  // appId: config.get('NYLAS_APPLICATION_ID'),
  // appSecret: config.get('NYLAS_APPLICATION_SECRET'),

  clientId: config.get('NYLAS_APPLICATION_CLIENT_ID'),
  clientSecret: config.get('NYLAS_APPLICATION_CLIENT_SECRET'),
})

/**
 * Gets the url to be used for authenticating with Nylas API
 *
 * @param {String} baseUrl The base Url
 * @param {String} id The user id for whom to get the Url
 * @returns {String} The url to be used by the user to authenticate with Nylas API
 */
async function getAuthenticationUrl(baseUrl, id) {
  // Check if the email exists.
  const users = await searchEntities(User, { _id: id })
  if (!users || users.length === 0) {
    throw new NotFound(`User with id ${id} does not exist`)
  }

  const options = {
    loginHint: users[0].email,
    state: id,
    redirectURI: `${baseUrl}/nylas/oauth/callback`,
    scopes: [NylasAuthScopes.Calendar],
  }

  return { url: Nylas.urlForAuthentication(options) }
}

getAuthenticationUrl.schema = {
  baseUrl: Joi.string()
    .uri()
    .required(),
  id: Joi.string(),
}

/**
 * Handles the callback of the user authentication with Nylas.
 * It exchanges the recieved code with a valid Nylas token.
 *
 * @param {String} code The code received from Nylas that will be exchanged for an access token
 * @param {String} userId the user id
 */
async function exchangeCodeForToken(code, userId) {
  try {
    const token = await Nylas.exchangeCodeForToken(code)

    // Get the user from the database
    const users = await searchEntities(User, { _id: userId })
    if (!users || users.length === 0) {
      throw new NotFound(`User with id = ${userId} does not exist`)
    }

    // Email is unique in the database, then there will be only one user
    // Set the user nylas access token in the user entity
    users[0].nylasAccessToken = token

    // Save the user with the nylas access token set into the database
    await users[0].save()
  } catch (e) {
    return { message: e.message, result: false }
  }
  return { result: true }
}

exchangeCodeForToken.schema = {
  code: Joi.string().required(),
  userId: Joi.string(),
}

module.exports = {
  getAuthenticationUrl,
  exchangeCodeForToken,
}

logger.buildService(module.exports)
