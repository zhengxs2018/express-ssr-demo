const orderBy = require('lodash/orderBy')

const AuditLog = require('../models/AuditLog')
/**
 * search logs
 * @param query  the query
 * @return {Promise<*>}
 */
async function search(query) {
  return orderBy(await AuditLog.find({}), ['createdAt'], ['desc'])
}

/**
 * create new audit log
 * @param body the body
 * @return {Promise<body>}
 */
async function create(body) {
  return AuditLog.create(body)
}

module.exports = {
  search,
  create,
}
