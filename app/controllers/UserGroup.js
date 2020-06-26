/**
 * UserGroup controller
 */
const UserGroupService = require('../services/UserGroup')

/**
 * search groups
 * @param req the request
 * @param res the response
 */
async function search(req, res) {
  res.json(await UserGroupService.search(req.user, req.query))
}

/**
 * create group
 * @param req the request
 * @param res the response
 */
async function create(req, res) {
  res.json(await UserGroupService.create(req.user, req.body))
}

/**
 * update update
 * @param req the request
 * @param res the response
 */
async function update(req, res) {
  res.json(await UserGroupService.update(req.user, req.params.id, req.body))
}

/**
 * remove group
 * @param req the request
 * @param res the response
 */
async function remove(req, res) {
  res.json(await UserGroupService.remove(req.user, req.params.id))
}

module.exports = {
  search,
  create,
  update,
  remove,
}
