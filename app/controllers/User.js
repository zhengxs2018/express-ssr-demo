/**
 * Controller for users endpoints.
 * It provides a single function which handles the provider listing request.
 */
const UserService = require('../services/User')
const AdminCommonService = require('../services/admin/AdminCommon')

/**
 * Handles the request to list all providers available.
 *
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function listAllProviders(req, res) {
  res.send(await UserService.listAllProviders(req.query))
}

/**
 * Handles the request to list all patients available.
 *
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function listAllPatients(req, res) {
  res.send(await UserService.listAllPatients(req.query))
}

/**
 * get me information
 * @param req the request
 * @param res the response
 */
async function me(req, res) {
  res.json(await UserService.me(req.user.id))
}

/**
 * update profile
 * @param req the request
 * @param res the response
 */
async function updateProfile(req, res) {
  res.json(await UserService.updateProfile(req.user.id, req.body, req.params.id))
}

/**
 * create file
 * @param req the request
 * @param res the response
 */
async function createFiles(req, res) {
  res.json(await UserService.createFiles(req.files, req.query))
}

/**
 * get file
 * @param req the request
 * @param res the response
 * @return {Promise<void>}
 */
async function getFile(req, res) {
  const { buffer, length, mimeType, fileName } = await UserService.getFile(req.params.id)
  res.writeHead(200, {
    'Content-Type': mimeType,
    'Content-disposition': 'attachment;filename=' + fileName,
    fileName: fileName,
    'Access-Control-Expose-Headers': 'Content-Type, Location, fileName',
    'Content-Length': length,
  })
  res.end(buffer)
}

/**
 * get my progress
 * @param req the request
 * @param res the response
 */
async function myProgress(req, res) {
  res.json(await UserService.myProgress(req.user.id))
}

/**
 * get user by id
 * @param req the request
 * @param res the response
 */
async function get(req, res) {
  res.json(await UserService.getUser(req.params.id))
}

/**
 * update password
 * @param req the request
 * @param res the response
 */
async function updatePassword(req, res) {
  res.json(await UserService.updatePassword(req.user.id, req.body))
}

/**
 * update password
 * @param req the request
 * @param res the response
 */
async function newPassword(req, res) {
  res.json(await UserService.newPassword(req.params.id))
}

/**
 * create new User
 * @param req the request
 * @param res the response
 */
async function newUser(req, res) {
  res.json(await UserService.newUser(req.user.id, req.body))
}

/**
 * delete user
 * @param req the request
 * @param res the response
 */
async function removeUser(req, res) {
  res.json(await UserService.removeUser(req.params.id))
}

/**
 * admin user dashboard
 * @param req the request
 * @param res the response
 */
async function adminDashboard(req, res) {
  res.json(await AdminCommonService.dashboard())
}

/**
 * get systems status
 * @param req the request
 * @param res the response
 */
async function systemStatus(req, res) {
  res.json(await AdminCommonService.systemStatus(`${req.protocol}://${req.headers.host}`))
}

/**
 * search user
 */
async function searchUser(req, res) {
  res.json(await UserService.searchUser(req.query))
}

module.exports = {
  listAllProviders,
  updateProfile,
  createFiles,
  getFile,
  myProgress,
  me,
  get,
  updatePassword,
  newPassword,
  newUser,
  removeUser,
  listAllPatients,
  adminDashboard,
  systemStatus,
  searchUser,
}
