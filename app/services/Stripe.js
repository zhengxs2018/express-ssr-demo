const { BadRequest } = require('http-errors')

const Stripe = require('stripe')
const config = require('config')
const moment = require('moment')

const logger = require('../lib/logger')

const stripe = new Stripe(config.get('STRIPE_SECRET_KEY'))

/**
 * check response
 * @param rsp the response
 * @param action the action
 * @returns {*}
 */
function checkRsp(rsp, action) {
  if (rsp.status !== 'succeeded') {
    throw new BadRequest('invalid credit card, charge failed')
  }
  return rsp
}

/**
 * create payment method
 * @param number the card number
 * @param expired the expired date
 * @param cvc the cvc code
 */
async function createPaymentMethod(number, expired, cvc) {
  const expiredDate = moment(expired, 'MM/YY')
  return stripe.paymentMethods.create({
    type: 'card',
    card: {
      number: number,
      exp_month: expiredDate.get('months') + 1,
      exp_year: expiredDate.get('years'),
      cvc,
    },
  })
}

/**
 * create payment intent
 * @param amount the amount
 * @param unit the unit
 * @param description the description
 * @param customerId the customer id
 */
async function createPaymentIntent(amount, unit, description, customerId) {
  return stripe.paymentIntents.create({
    amount: amount,
    currency: unit,
    description: description || '',
    payment_method_types: ['card'],
    customer: customerId,
  })
}

/**
 * confirm payment
 * @param id the id
 * @param paymentMethod the payment method
 */
async function confirmPayment(id, paymentMethod) {
  const rsp = await stripe.paymentIntents.confirm(id, {
    payment_method: paymentMethod,
  })
  return checkRsp(rsp, 'confirm payment intent')
}

/**
 * refund payment
 * @param id the payment intent id
 */
// eslint-disable-next-line no-unused-vars
async function refund(id) {
  const rsp = await stripe.refunds.create({ payment_intent: id })
  return checkRsp(rsp, 'refund')
}

/**
 * create payment method
 * @param user user object
 * @param number the card number
 * @param expired the expired date
 * @param cvc the cvc code
 */
async function checkCard(user, number, expired, cvc) {
  if (!user.paymentCustomerId) {
    const customers = await stripe.customers.list({ email: user.email, limit: 1 })
    if (customers && customers.data.length > 0) {
      logger.info('fount customer by email ' + user.email)
      user.paymentCustomerId = customers.data[0].id
    } else {
      logger.info('create new customer ..')
      const name = [user.firstName, user.lastName].filter(v => (v || '').trim().length > 0).join(' ')
      const rsp = await stripe.customers.create({
        description: `ognomy user ${name}(${user.email})`,
        email: user.email,
        name: name,
        phone: user.phone,
      })
      user.paymentCustomerId = rsp.id
    }
  }
  const method = await createPaymentMethod(number, expired, cvc)
  logger.info('payment method created ...')
  await stripe.paymentMethods.attach(method.id, { customer: user.paymentCustomerId })
  logger.info('attach customer..')

  // skip payment and refund in add card
  // const intent = await createPaymentIntent(config.CHECK_CARD_PRICE, config.STRIPE_MONTY_FORMAT,
  //   'check credit card', user.paymentCustomerId)
  // logger.info('payment intent created ...')
  //
  // await confirmPayment(intent.id, method.id, user.paymentCustomerId)
  // logger.info('payment intent confirmed ...')
  // await refund(intent.id)
  // logger.info('payment refund ...')
  return { pmId: method.id, customerId: user.paymentCustomerId }
}

/**
 * payment directly
 * @param userId the user id
 * @param entity the payment entity
 * {
 *    amount: the amount
 *    paymentMethod: the payment method
 *    description: the description
 * }
 * @returns {Promise<void>}
 */
async function doPayment(userId, entity) {
  const { amount, paymentMethod, description } = entity

  // check permission
  const user = await models.User.findById(userId)
  console.log(user.creditCards, amount, paymentMethod, description)
  const card = await _.find(user.creditCards, card => card.paymentMethod === paymentMethod)
  if (!card) {
    throw new BadRequest('credit card not found in your wallet, please check again')
  }

  const intent = await createPaymentIntent(amount, config.STRIPE_MONTY_FORMAT, description, user.paymentCustomerId)

  logger.info('payment intent created ...')
  const rsp = await confirmPayment(intent.id, paymentMethod)

  logger.info('start try to invoke callback')
  if (entity.type === 'appointment') {
    const appointment = await models.Appointment.findById(entity.entityId)
    appointment.patientPaid = true
    await appointment.save()
  }
  await models.PaymentHistory.create({
    amount,
    number: card.number,
    reason: description,
    createdBy: userId,
    type: entity.type,
    cardType: card.type,
    entityId: entity.entityId,
    format: config.STRIPE_MONTY_FORMAT,
    paymentRawObj: rsp,
  })
  logger.info('payment history created ...')
}

/**
 * search payment history
 * @param userId the user id
 * @param query the search query
 */
async function search(userId, query) {
  const records = await helper.searchEntities(models.PaymentHistory, _.extend({}, { createdBy: userId }, query))
  return _.orderBy(records, ['createdAt'], ['desc'])
}

module.exports = {
  doPayment,
  checkCard,
  search,
}
