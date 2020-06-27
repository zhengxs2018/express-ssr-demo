const { parse } = require('json2csv')

const AuditLogService = require('../services/AuditLog')
/**
 * search audit logs
 *
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function search(req, res) {
  res.send(await AuditLogService.search(req.query))
}

/**
 * download audit logs
 *
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function download(req, res) {
  const results = await AuditLogService.search(req.query)
  const fields = [
    { label: 'Operator (User ID)', value: 'operator' },
    { label: 'Action', value: 'action' },
    { label: 'Patient ID', value: 'patientId' },
    { label: 'User role', value: 'operatorRole' },
    { label: 'Date & time', value: 'createdAt' },
    { label: 'Change Details', value: 'changeDetails' },
  ]
  res.status(200).send(parse(results, { fields }))
}

/**
 * create audit log
 *
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function create(req, res) {
  res.send(await AuditLogService.create(req.body))
}

module.exports = {
  search,
  create,
  download,
}
