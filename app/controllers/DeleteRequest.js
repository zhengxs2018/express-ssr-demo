/**
 * delete request controller
 */

const DeleteRequestService = require('../services/DeleteRequest')

/**
 * get patient files
 *
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function getPatientFiles(req, res) {
  res.json(await DeleteRequestService.getPatientFiles(req.params.id))
}

/**
 * download patient files
 *
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function downloadPatientFiles(req, res) {
  const { metadata, buffer } = await DeleteRequestService.downloadPatientFiles(req.body)
  res.writeHead(200, {
    'Content-Type': metadata.mimetype,
    'Content-disposition': 'attachment;filename=' + metadata.filename,
    fileName: metadata.filename,
    'Access-Control-Expose-Headers': 'Content-Type, Location, fileName',
    'Content-Length': buffer.length,
  })
  res.end(buffer)
}

/**
 * create delete request
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function create(req, res) {
  res.json(await DeleteRequestService.create(req.user, req.body))
}

/**
 * update delete request
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function update(req, res) {
  res.json(await DeleteRequestService.update(req.user, req.body))
}

/**
 * return delete requests
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function search(req, res) {
  res.json(await DeleteRequestService.search(req.query))
}

/**
 * remove delete requests
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function remove(req, res) {
  res.json(await DeleteRequestService.remove(req.params.id))
}

module.exports = {
  getPatientFiles,
  downloadPatientFiles,
  search,
  create,
  update,
  remove,
}
