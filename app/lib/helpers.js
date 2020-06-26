'use strict'

const { promisify } = require('util')

const config = require('config')
const { createTransport } = require('nodemailer')

const size = require('lodash/size')
const extend = require('lodash/extend')
const get = require('lodash/get')
const orderBy = require('lodash/orderBy')

const transporter = createTransport(
  extend(config.get('EMAIL'), {
    logger: console,
  })
)

const sendMailAsync = promisify(transporter.sendMail.bind(transporter))

/**
 * This function sends an email to the specified recipients
 *
 * @param {String} subject the subject
 * @param {String} textBody the email body html
 * @param {Array} recipients the email recipients
 * @param {String} fromEmail the from email, if not provided, then configured from email is used
 * @param attachments the attachments
 */
async function sendEmail(subject, textBody, recipients, fromEmail = null, attachments = []) {
  const req = {
    from: fromEmail || config.get('FROM_EMAIL'),
    to: recipients.join(','),
    subject,
    html: textBody,
  }

  if (size(attachments) > 0) {
    req.attachments = attachments
  }

  return sendMailAsync(req)
}


/**
 * remove all
 * @param Model the model
 * @param criteria the search query
 * @return {Promise<*>}
 */
async function removeAll (Model, criteria) {
  // create a Model instance with encrypted fields
  const exampleModel = new Model(criteria)
  exampleModel.encryptFieldsSync()

  // construct the encrypted search criteria
  const encryptedCriteria = {}

  Object.keys(criteria).forEach(key => {
    encryptedCriteria[key] = exampleModel[key]
  })

  // search the entities matching the given criteria
  return Model.remove(encryptedCriteria)
}

/**
 * object match
 * @param object
 * @param fields
 * @param value
 * @return {boolean}
 */
function objectMatch (object, fields, value) {
  for (let i = 0; i < fields.length; i++) {
    const f = fields[i]
    if ((get(object, f) || '').toString().toLowerCase().indexOf(value.toString().toLowerCase()) >= 0) {
      return true
    }
  }
  return false
}


/**
 * get user full name
 * @param user the user
 */
function getUserName (user) {
  if (!user) {
    return null
  }
  const name = [user.firstName, user.lastName].filter(v => (v || '').trim().length > 0).join(' ')
  return name || user.email
}

/**
 * get random string
 * @param len the length
 * @param chars the chars
 * @return {string}
 */
function randomStr (len, chars) {
  const newLen = len || 32
  const $chars = chars || 'abcdefhijkmnprstwxyz0123456789'
  const maxPos = $chars.length
  let pwd = ''
  for (let i = 0; i < newLen; i += 1) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

/**
 * order and page
 * @param entities
 * @param query
 */
function orderAndPage (entities, query) {
  let all = entities
  if (query.sortBy && query.sortOrder) {
    all = orderBy(entities, [query.sortBy], [query.sortOrder])
  }
  return { pageNum: query.pageNum,
    perPage: query.perPage,
    total: all.length,
    items: all.slice((query.pageNum - 1) * query.perPage, query.pageNum * query.perPage) }
}

module.exports = {
  sendEmail,
  objectMatch,
  removeAll,
  getUserName,
  randomStr,
  orderAndPage
}
