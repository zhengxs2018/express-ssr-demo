/**
 * Controller for payment endpoints.
 * It provides a single function which handles the provider listing request.
 */
const StripeService = require('../services/Stripe')

/**
 * create payments
 *
 * @param {Object} req The http request
 * @param {Object} res The http response
 */
async function create(req, res) {
  res.send(await StripeService.doPayment(req.user.id, req.body))
}

/**
 * search payment history
 * @param req the request
 * @param res the response
 */
async function search(req, res) {
  res.json(await StripeService.search(req.user.id, req.query))
}

module.exports = {
  search,
  create,
}
