'use strict'

const { promisify } = require('util')

const config = require('config')
const { createTransport } = require('nodemailer')
const { NotFound } = require('http-errors')

const isNil = require('lodash/isNil')
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

function checkNullOrEmptyArray(arr, errorMessage) {
  if (isNil(arr) || arr.length === 0) {
    throw new NotFound(errorMessage)
  }
}

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
async function removeAll(Model, criteria) {
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
function objectMatch(object, fields, value) {
  for (let i = 0; i < fields.length; i++) {
    const f = fields[i]
    if (
      (get(object, f) || '')
        .toString()
        .toLowerCase()
        .indexOf(value.toString().toLowerCase()) >= 0
    ) {
      return true
    }
  }
  return false
}

/**
 * get user full name
 * @param user the user
 */
function getUserName(user) {
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
function randomStr(len, chars) {
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
function orderAndPage(entities, query) {
  let all = entities
  if (query.sortBy && query.sortOrder) {
    all = orderBy(entities, [query.sortBy], [query.sortOrder])
  }
  return {
    pageNum: query.pageNum,
    perPage: query.perPage,
    total: all.length,
    items: all.slice((query.pageNum - 1) * query.perPage, query.pageNum * query.perPage),
  }
}

/**
 * make sure all exist
 * @param Model the model
 * @param ids the id arr
 * @return {Promise<[]>}
 */
async function makeSureAllExist(Model, ids) {
  const results = []
  for (let i = 0; i < ids.length; i++) {
    const e = await Model.findById(ids[i])
    if (!e) {
      throw new errors.NotFoundError('resource not found, id = ' + ids[i])
    }
    results.push(e)
  }
  return results
}

/**
 * check contains emoji
 * @param str the str
 * @return {boolean}
 */
function containsEmoji(str) {
  // eslint-disable-next-line
  return /\u{1F3F4}\u{E0067}\u{E0062}(?:\u{E0077}\u{E006C}\u{E0073}|\u{E0073}\u{E0063}\u{E0074}|\u{E0065}\u{E006E}\u{E0067})\u{E007F}|(?:\u{1F9D1}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F9D1}|\u{1F469}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F469})\u{1F3FB}|\u{1F468}(?:\u{1F3FC}\u200D(?:\u{1F91D}\u200D\u{1F468}\u{1F3FB}|[\u{1F33E}\u{1F373}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|\u{1F3FF}\u200D(?:\u{1F91D}\u200D\u{1F468}[\u{1F3FB}-\u{1F3FE}]|[\u{1F33E}\u{1F373}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|\u{1F3FE}\u200D(?:\u{1F91D}\u200D\u{1F468}[\u{1F3FB}-\u{1F3FD}]|[\u{1F33E}\u{1F373}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|\u{1F3FD}\u200D(?:\u{1F91D}\u200D\u{1F468}[\u{1F3FB}\u{1F3FC}]|[\u{1F33E}\u{1F373}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|\u200D(?:\u2764\uFE0F\u200D(?:\u{1F48B}\u200D)?\u{1F468}|[\u{1F468}\u{1F469}]\u200D(?:\u{1F466}\u200D\u{1F466}|\u{1F467}\u200D[\u{1F466}\u{1F467}])|\u{1F466}\u200D\u{1F466}|\u{1F467}\u200D[\u{1F466}\u{1F467}]|[\u{1F468}\u{1F469}]\u200D[\u{1F466}\u{1F467}]|[\u2695\u2696\u2708]\uFE0F|[\u{1F466}\u{1F467}]|[\u{1F33E}\u{1F373}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|(?:\u{1F3FB}\u200D[\u2695\u2696\u2708]|\u{1F3FF}\u200D[\u2695\u2696\u2708]|\u{1F3FE}\u200D[\u2695\u2696\u2708]|\u{1F3FD}\u200D[\u2695\u2696\u2708]|\u{1F3FC}\u200D[\u2695\u2696\u2708])\uFE0F|\u{1F3FB}\u200D[\u{1F33E}\u{1F373}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}]|[\u{1F3FB}-\u{1F3FF}])|\u{1F9D1}(?:\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F9D1}[\u{1F3FB}-\u{1F3FF}]|\u200D\u{1F91D}\u200D\u{1F9D1})|\u{1F469}(?:\u{1F3FE}\u200D(?:\u{1F91D}\u200D\u{1F468}[\u{1F3FB}-\u{1F3FD}\u{1F3FF}]|[\u{1F33E}\u{1F373}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|\u{1F3FD}\u200D(?:\u{1F91D}\u200D\u{1F468}[\u{1F3FB}\u{1F3FC}\u{1F3FE}\u{1F3FF}]|[\u{1F33E}\u{1F373}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|\u{1F3FC}\u200D(?:\u{1F91D}\u200D\u{1F468}[\u{1F3FB}\u{1F3FD}-\u{1F3FF}]|[\u{1F33E}\u{1F373}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|\u{1F3FB}\u200D(?:\u{1F91D}\u200D\u{1F468}[\u{1F3FC}-\u{1F3FF}]|[\u{1F33E}\u{1F373}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|\u200D(?:\u2764\uFE0F\u200D(?:\u{1F48B}\u200D[\u{1F468}\u{1F469}]|[\u{1F468}\u{1F469}])|[\u{1F33E}\u{1F373}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|\u{1F3FF}\u200D[\u{1F33E}\u{1F373}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|(?:\u{1F9D1}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F9D1}|\u{1F469}\u{1F3FF}\u200D\u{1F91D}\u200D[\u{1F468}\u{1F469}])[\u{1F3FB}-\u{1F3FE}]|(?:\u{1F9D1}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F9D1}|\u{1F469}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F469})[\u{1F3FB}-\u{1F3FD}]|(?:\u{1F9D1}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F9D1}|\u{1F469}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F469})[\u{1F3FB}\u{1F3FC}]|\u{1F469}\u200D\u{1F469}\u200D(?:\u{1F466}\u200D\u{1F466}|\u{1F467}\u200D[\u{1F466}\u{1F467}])|\u{1F469}\u200D\u{1F466}\u200D\u{1F466}|\u{1F469}\u200D\u{1F469}\u200D[\u{1F466}\u{1F467}]|(?:\u{1F441}\uFE0F\u200D\u{1F5E8}|\u{1F469}(?:\u{1F3FF}\u200D[\u2695\u2696\u2708]|\u{1F3FE}\u200D[\u2695\u2696\u2708]|\u{1F3FD}\u200D[\u2695\u2696\u2708]|\u{1F3FC}\u200D[\u2695\u2696\u2708]|\u{1F3FB}\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|[\u{1F3C3}\u{1F3C4}\u{1F3CA}\u{1F46E}\u{1F471}\u{1F473}\u{1F477}\u{1F481}\u{1F482}\u{1F486}\u{1F487}\u{1F645}-\u{1F647}\u{1F64B}\u{1F64D}\u{1F64E}\u{1F6A3}\u{1F6B4}-\u{1F6B6}\u{1F926}\u{1F937}-\u{1F939}\u{1F93D}\u{1F93E}\u{1F9B8}\u{1F9B9}\u{1F9CD}-\u{1F9CF}\u{1F9D6}-\u{1F9DD}][\u{1F3FB}-\u{1F3FF}]\u200D[\u2640\u2642]|[\u26F9\u{1F3CB}\u{1F3CC}\u{1F575}](?:\uFE0F\u200D[\u2640\u2642]|[\u{1F3FB}-\u{1F3FF}]\u200D[\u2640\u2642])|\u{1F3F4}\u200D\u2620|[\u{1F3C3}\u{1F3C4}\u{1F3CA}\u{1F46E}\u{1F46F}\u{1F471}\u{1F473}\u{1F477}\u{1F481}\u{1F482}\u{1F486}\u{1F487}\u{1F645}-\u{1F647}\u{1F64B}\u{1F64D}\u{1F64E}\u{1F6A3}\u{1F6B4}-\u{1F6B6}\u{1F926}\u{1F937}-\u{1F939}\u{1F93C}-\u{1F93E}\u{1F9B8}\u{1F9B9}\u{1F9CD}-\u{1F9CF}\u{1F9D6}-\u{1F9DF}]\u200D[\u2640\u2642])\uFE0F|\u{1F469}\u200D\u{1F467}\u200D[\u{1F466}\u{1F467}]|\u{1F3F3}\uFE0F\u200D\u{1F308}|\u{1F469}\u200D\u{1F467}|\u{1F469}\u200D\u{1F466}|\u{1F415}\u200D\u{1F9BA}|\u{1F1FD}\u{1F1F0}|\u{1F1F6}\u{1F1E6}|\u{1F1F4}\u{1F1F2}|\u{1F9D1}[\u{1F3FB}-\u{1F3FF}]|\u{1F469}[\u{1F3FB}-\u{1F3FF}]|\u{1F1FF}[\u{1F1E6}\u{1F1F2}\u{1F1FC}]|\u{1F1FE}[\u{1F1EA}\u{1F1F9}]|\u{1F1FC}[\u{1F1EB}\u{1F1F8}]|\u{1F1FB}[\u{1F1E6}\u{1F1E8}\u{1F1EA}\u{1F1EC}\u{1F1EE}\u{1F1F3}\u{1F1FA}]|\u{1F1FA}[\u{1F1E6}\u{1F1EC}\u{1F1F2}\u{1F1F3}\u{1F1F8}\u{1F1FE}\u{1F1FF}]|\u{1F1F9}[\u{1F1E6}\u{1F1E8}\u{1F1E9}\u{1F1EB}-\u{1F1ED}\u{1F1EF}-\u{1F1F4}\u{1F1F7}\u{1F1F9}\u{1F1FB}\u{1F1FC}\u{1F1FF}]|\u{1F1F8}[\u{1F1E6}-\u{1F1EA}\u{1F1EC}-\u{1F1F4}\u{1F1F7}-\u{1F1F9}\u{1F1FB}\u{1F1FD}-\u{1F1FF}]|\u{1F1F7}[\u{1F1EA}\u{1F1F4}\u{1F1F8}\u{1F1FA}\u{1F1FC}]|\u{1F1F5}[\u{1F1E6}\u{1F1EA}-\u{1F1ED}\u{1F1F0}-\u{1F1F3}\u{1F1F7}-\u{1F1F9}\u{1F1FC}\u{1F1FE}]|\u{1F1F3}[\u{1F1E6}\u{1F1E8}\u{1F1EA}-\u{1F1EC}\u{1F1EE}\u{1F1F1}\u{1F1F4}\u{1F1F5}\u{1F1F7}\u{1F1FA}\u{1F1FF}]|\u{1F1F2}[\u{1F1E6}\u{1F1E8}-\u{1F1ED}\u{1F1F0}-\u{1F1FF}]|\u{1F1F1}[\u{1F1E6}-\u{1F1E8}\u{1F1EE}\u{1F1F0}\u{1F1F7}-\u{1F1FB}\u{1F1FE}]|\u{1F1F0}[\u{1F1EA}\u{1F1EC}-\u{1F1EE}\u{1F1F2}\u{1F1F3}\u{1F1F5}\u{1F1F7}\u{1F1FC}\u{1F1FE}\u{1F1FF}]|\u{1F1EF}[\u{1F1EA}\u{1F1F2}\u{1F1F4}\u{1F1F5}]|\u{1F1EE}[\u{1F1E8}-\u{1F1EA}\u{1F1F1}-\u{1F1F4}\u{1F1F6}-\u{1F1F9}]|\u{1F1ED}[\u{1F1F0}\u{1F1F2}\u{1F1F3}\u{1F1F7}\u{1F1F9}\u{1F1FA}]|\u{1F1EC}[\u{1F1E6}\u{1F1E7}\u{1F1E9}-\u{1F1EE}\u{1F1F1}-\u{1F1F3}\u{1F1F5}-\u{1F1FA}\u{1F1FC}\u{1F1FE}]|\u{1F1EB}[\u{1F1EE}-\u{1F1F0}\u{1F1F2}\u{1F1F4}\u{1F1F7}]|\u{1F1EA}[\u{1F1E6}\u{1F1E8}\u{1F1EA}\u{1F1EC}\u{1F1ED}\u{1F1F7}-\u{1F1FA}]|\u{1F1E9}[\u{1F1EA}\u{1F1EC}\u{1F1EF}\u{1F1F0}\u{1F1F2}\u{1F1F4}\u{1F1FF}]|\u{1F1E8}[\u{1F1E6}\u{1F1E8}\u{1F1E9}\u{1F1EB}-\u{1F1EE}\u{1F1F0}-\u{1F1F5}\u{1F1F7}\u{1F1FA}-\u{1F1FF}]|\u{1F1E7}[\u{1F1E6}\u{1F1E7}\u{1F1E9}-\u{1F1EF}\u{1F1F1}-\u{1F1F4}\u{1F1F6}-\u{1F1F9}\u{1F1FB}\u{1F1FC}\u{1F1FE}\u{1F1FF}]|\u{1F1E6}[\u{1F1E8}-\u{1F1EC}\u{1F1EE}\u{1F1F1}\u{1F1F2}\u{1F1F4}\u{1F1F6}-\u{1F1FA}\u{1F1FC}\u{1F1FD}\u{1F1FF}]|[#\*0-9]\uFE0F\u20E3|[\u{1F3C3}\u{1F3C4}\u{1F3CA}\u{1F46E}\u{1F471}\u{1F473}\u{1F477}\u{1F481}\u{1F482}\u{1F486}\u{1F487}\u{1F645}-\u{1F647}\u{1F64B}\u{1F64D}\u{1F64E}\u{1F6A3}\u{1F6B4}-\u{1F6B6}\u{1F926}\u{1F937}-\u{1F939}\u{1F93D}\u{1F93E}\u{1F9B8}\u{1F9B9}\u{1F9CD}-\u{1F9CF}\u{1F9D6}-\u{1F9DD}][\u{1F3FB}-\u{1F3FF}]|[\u26F9\u{1F3CB}\u{1F3CC}\u{1F575}][\u{1F3FB}-\u{1F3FF}]|[\u261D\u270A-\u270D\u{1F385}\u{1F3C2}\u{1F3C7}\u{1F442}\u{1F443}\u{1F446}-\u{1F450}\u{1F466}\u{1F467}\u{1F46B}-\u{1F46D}\u{1F470}\u{1F472}\u{1F474}-\u{1F476}\u{1F478}\u{1F47C}\u{1F483}\u{1F485}\u{1F4AA}\u{1F574}\u{1F57A}\u{1F590}\u{1F595}\u{1F596}\u{1F64C}\u{1F64F}\u{1F6C0}\u{1F6CC}\u{1F90F}\u{1F918}-\u{1F91C}\u{1F91E}\u{1F91F}\u{1F930}-\u{1F936}\u{1F9B5}\u{1F9B6}\u{1F9BB}\u{1F9D2}-\u{1F9D5}][\u{1F3FB}-\u{1F3FF}]|[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55\u{1F004}\u{1F0CF}\u{1F18E}\u{1F191}-\u{1F19A}\u{1F1E6}-\u{1F1FF}\u{1F201}\u{1F21A}\u{1F22F}\u{1F232}-\u{1F236}\u{1F238}-\u{1F23A}\u{1F250}\u{1F251}\u{1F300}-\u{1F320}\u{1F32D}-\u{1F335}\u{1F337}-\u{1F37C}\u{1F37E}-\u{1F393}\u{1F3A0}-\u{1F3CA}\u{1F3CF}-\u{1F3D3}\u{1F3E0}-\u{1F3F0}\u{1F3F4}\u{1F3F8}-\u{1F43E}\u{1F440}\u{1F442}-\u{1F4FC}\u{1F4FF}-\u{1F53D}\u{1F54B}-\u{1F54E}\u{1F550}-\u{1F567}\u{1F57A}\u{1F595}\u{1F596}\u{1F5A4}\u{1F5FB}-\u{1F64F}\u{1F680}-\u{1F6C5}\u{1F6CC}\u{1F6D0}-\u{1F6D2}\u{1F6D5}\u{1F6EB}\u{1F6EC}\u{1F6F4}-\u{1F6FA}\u{1F7E0}-\u{1F7EB}\u{1F90D}-\u{1F93A}\u{1F93C}-\u{1F945}\u{1F947}-\u{1F971}\u{1F973}-\u{1F976}\u{1F97A}-\u{1F9A2}\u{1F9A5}-\u{1F9AA}\u{1F9AE}-\u{1F9CA}\u{1F9CD}-\u{1F9FF}\u{1FA70}-\u{1FA73}\u{1FA78}-\u{1FA7A}\u{1FA80}-\u{1FA82}\u{1FA90}-\u{1FA95}]|[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299\u{1F004}\u{1F0CF}\u{1F170}\u{1F171}\u{1F17E}\u{1F17F}\u{1F18E}\u{1F191}-\u{1F19A}\u{1F1E6}-\u{1F1FF}\u{1F201}\u{1F202}\u{1F21A}\u{1F22F}\u{1F232}-\u{1F23A}\u{1F250}\u{1F251}\u{1F300}-\u{1F321}\u{1F324}-\u{1F393}\u{1F396}\u{1F397}\u{1F399}-\u{1F39B}\u{1F39E}-\u{1F3F0}\u{1F3F3}-\u{1F3F5}\u{1F3F7}-\u{1F4FD}\u{1F4FF}-\u{1F53D}\u{1F549}-\u{1F54E}\u{1F550}-\u{1F567}\u{1F56F}\u{1F570}\u{1F573}-\u{1F57A}\u{1F587}\u{1F58A}-\u{1F58D}\u{1F590}\u{1F595}\u{1F596}\u{1F5A4}\u{1F5A5}\u{1F5A8}\u{1F5B1}\u{1F5B2}\u{1F5BC}\u{1F5C2}-\u{1F5C4}\u{1F5D1}-\u{1F5D3}\u{1F5DC}-\u{1F5DE}\u{1F5E1}\u{1F5E3}\u{1F5E8}\u{1F5EF}\u{1F5F3}\u{1F5FA}-\u{1F64F}\u{1F680}-\u{1F6C5}\u{1F6CB}-\u{1F6D2}\u{1F6D5}\u{1F6E0}-\u{1F6E5}\u{1F6E9}\u{1F6EB}\u{1F6EC}\u{1F6F0}\u{1F6F3}-\u{1F6FA}\u{1F7E0}-\u{1F7EB}\u{1F90D}-\u{1F93A}\u{1F93C}-\u{1F945}\u{1F947}-\u{1F971}\u{1F973}-\u{1F976}\u{1F97A}-\u{1F9A2}\u{1F9A5}-\u{1F9AA}\u{1F9AE}-\u{1F9CA}\u{1F9CD}-\u{1F9FF}\u{1FA70}-\u{1FA73}\u{1FA78}-\u{1FA7A}\u{1FA80}-\u{1FA82}\u{1FA90}-\u{1FA95}]\uFE0F|[\u261D\u26F9\u270A-\u270D\u{1F385}\u{1F3C2}-\u{1F3C4}\u{1F3C7}\u{1F3CA}-\u{1F3CC}\u{1F442}\u{1F443}\u{1F446}-\u{1F450}\u{1F466}-\u{1F478}\u{1F47C}\u{1F481}-\u{1F483}\u{1F485}-\u{1F487}\u{1F48F}\u{1F491}\u{1F4AA}\u{1F574}\u{1F575}\u{1F57A}\u{1F590}\u{1F595}\u{1F596}\u{1F645}-\u{1F647}\u{1F64B}-\u{1F64F}\u{1F6A3}\u{1F6B4}-\u{1F6B6}\u{1F6C0}\u{1F6CC}\u{1F90F}\u{1F918}-\u{1F91F}\u{1F926}\u{1F930}-\u{1F939}\u{1F93C}-\u{1F93E}\u{1F9B5}\u{1F9B6}\u{1F9B8}\u{1F9B9}\u{1F9BB}\u{1F9CD}-\u{1F9CF}\u{1F9D1}-\u{1F9DD}]/gu.test(
    str
  )
}

module.exports = {
  sendEmail,
  objectMatch,
  removeAll,
  getUserName,
  randomStr,
  orderAndPage,
  makeSureAllExist,
  containsEmoji,
  checkNullOrEmptyArray,
}
