/**
 * Patient progress note controller
 */
const service = require('../services/PatientProgressNote')

/**
 * search notes
 * @param req the request
 * @param res the response
 */
async function search(req, res) {
  res.json(await PatientProgressNoteService.search(req.user, req.query))
}

/**
 * create note
 * @param req the request
 * @param res the response
 */
async function create(req, res) {
  res.json(await PatientProgressNoteService.create(req.user, req.body))
}

/**
 * update note
 * @param req the request
 * @param res the response
 */
async function update(req, res) {
  res.json(await PatientProgressNoteService.update(req.user, req.params.id, req.body))
}

/**
 * remove note
 * @param req the request
 * @param res the response
 */
async function remove(req, res) {
  res.json(await PatientProgressNoteService.remove(req.user, req.params.id))
}

module.exports = {
  search,
  create,
  update,
  remove,
}
