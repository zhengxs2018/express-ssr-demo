/**
 * Authentication and authorization middleware
 */
const config = require('config')
const jwt = require('jsonwebtoken')
const { Unauthorized } = require('http-errors')

const intersection = require('lodash/intersection')

const User = require('../models/User')

const JWT_SECRET = config.get('JWT_SECRET')

/**
 * Check if the request is authenticated/authorized.
 * @param {Array} roles the allowed roles, optional
 */
function auth(roles) {
  return function authMiddleware(req, res, next) {
    // Parse the token from request header
    let token
    if (req.headers.authorization) {
      const authHeaderParts = req.headers.authorization.split(' ')
      if (authHeaderParts.length === 2 && authHeaderParts[0] === 'Bearer') {
        token = authHeaderParts[1]
      }
    }

    if (!token) {
      throw new Unauthorized('Action is not allowed for anonymous user')
    }

    let user
    try {
      user = jwt.verify(token, JWT_SECRET)
    } catch (e) {
      throw new Unauthorized('Login has expired, please try to log in again')
    }

    // check authorization
    if (roles && roles.length > 0 && intersection(user.roles, roles).length === 0) {
      throw new Unauthorized('You are not allowed to perform this action')
    }

    // get user
    User.findById(user.id)
      .then(u => {
        if (!u) {
          return next(new Unauthorized('User is not found'))
        }

        if (u.deleted) {
          throw next(new Unauthorized('User has been deleted, invalid token'))
        }

        // set user to the request
        req.user = u
        return next()
      })
      .catch(e => next(e))
  }
}

module.exports = auth
