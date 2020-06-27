/**
 * Conversation controller
 */
const ConversationService = require('../services/Conversation')

/**
 * search conversations
 * @param req the request
 * @param res the response
 */
async function search(req, res) {
  res.json(await ConversationService.search(req.user, req.query))
}

/**
 * create conversation
 * @param req the request
 * @param res the response
 */
async function create(req, res) {
  res.json(await ConversationService.create(req.user, req.body))
}

/**
 * update conversations
 * @param req the request
 * @param res the response
 */
async function update(req, res) {
  res.json(await ConversationService.update(req.user, req.body))
}

/**
 * get conversation
 * @param req the request
 * @param res the response
 */
async function get(req, res) {
  res.json(await ConversationService.get(req.user, req.params.id))
}

/**
 * reply conversation
 * @param req the request
 * @param res the response
 */
async function reply(req, res) {
  res.json(await ConversationService.reply(req.user, req.params.id, req.body))
}

/**
 * forward conversation
 * @param req the request
 * @param res the response
 */
async function forward(req, res) {
  res.json(await ConversationService.forward(req.user, req.params.id, req.body))
}

module.exports = {
  search,
  create,
  reply,
  forward,
  get,
  update,
}
