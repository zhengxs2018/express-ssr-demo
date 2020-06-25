const FAQService = require('../services/FAQ')

/**
 * search FAQ
 * @param req the http request
 * @param res the http response
 */
async function search(req, res) {
  res.json(await FAQService.search())
}

/**
 * get FAQ by id
 * @param req the http request
 * @param res the http response
 */
async function get(req, res) {
  res.json(await FAQService.get(req.params.id))
}

/**
 * update FAQ by id
 * @param req the http request
 * @param res the http response
 */
async function update(req, res) {
  res.json(await FAQService.update(req.params.id, req.body))
}

/**
 * remove FAQ by id
 * @param req the http request
 * @param res the http response
 */
async function remove(req, res) {
  res.json(await FAQService.remove(req.params.id))
}

/**
 * create FAQ
 * @param req the http request
 * @param res the http response
 */
async function create(req, res) {
  res.json(await FAQService.create(req.body))
}

module.exports = { search, get, update, remove, create }
