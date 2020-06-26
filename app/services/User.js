/**
 * This service provides operations of users
 */
const get = require('lodash/get')
const size = require('lodash/size')
const orderBy = require('lodash/orderBy')

const { UserRoles } = require('../../constants/access')

const searchEntities = require('../../database/helpers/searchEntities')

const logger = require('../lib/logger')

const User = require('../models/User')


/**
 * get uid
 */
async function getUID() {
  const users = await searchEntities(User, {})
  if (size(users) === 0) return 0

  const patients = users.filter(({ roles }) => (roles || []).includes(UserRoles.Patient))
  return get(orderBy(patients, ['uid'], 'desc'), '0.uid', 0)
}

module.exports = {
  getUID,
}

logger.buildService(module.exports)
