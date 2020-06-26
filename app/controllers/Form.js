/**
 * Controller for form endpoints.
 * It provides a single function which handles the provider listing request.
 */
const FormService = require('../services/Form')

/**
 * get user form
 *
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function get(req, res) {
  res.send(await FormService.get(req.user.id))
}

/**
 * upload page
 * @param req the request
 * @param res the response
 */
async function uploadPage(req, res) {
  res.json(await FormService.uploadPage(req.user.id, req.params.formId, req.body))
}

/**
 * update form
 * @param req the request
 * @param res the response
 */
async function update(req, res) {
  res.json(await FormService.update(req.params.formId, req.body))
}

module.exports = {
  uploadPage,
  get,
  update,
}
