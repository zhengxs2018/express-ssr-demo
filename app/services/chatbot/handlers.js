const logger = require('../../common/logger')
const models = require('../../models')
const config = require('config')
const fs = require('fs')
const path = require('path')
const helper = require('../../common/helper')
const stripeService = require('../StripeService')
const util = require('util')
const _ = require('lodash')

/**
 * Allow users to finish onboarding if users can't provide correct credit card after 3 tries
 */
const MAX_CREDIT_TRY_TIMES = 3
const creditTryTimes = {}

/**
 * update database or other actions when user answer
 * @param userId the user id
 * @param question the chatbot question
 * @param files the upload files
 * @param body the answer body
 * @returns {Promise}
 */
async function handlerAnswer(userId, question, files, body) {
  const { content } = body
  const processUser = async parts => {
    const user = await models.User.findById(userId)
    switch (parts[0]) {
      case 'name': {
        const names = content.split(' ')
        user.firstName = names[0]
        names.shift()
        user.lastName = names.join(' ')
        await user.save()
        break
      }
      case 'insuranceCards':
      case 'creditCards':
        user[parts[0]] = user[parts[0]] && user[parts[0]].length > 0 ? user[parts[0]] : [{}]
        user[parts[0]][0][parts[1]] = content
        if (parts[0] === 'creditCards') {
          user[parts[0]][0].name = [user.firstName, user.lastName].filter(v => (v || '').trim().length > 0).join(' ')
          // check
          if (parts[1] === 'ccv') {
            const card = user[parts[0]][0]
            try {
              const { pmId, customerId } = await stripeService.checkCard(user, card.number, card.expired, content)
              user[parts[0]][0].paymentMethod = pmId
              user.customerId = customerId
            } catch (e) {
              creditTryTimes[userId] = (creditTryTimes[userId] || 0) + 1
              let result = {}
              if (creditTryTimes[userId] >= MAX_CREDIT_TRY_TIMES) {
                result = {
                  next: 20,
                  code: 400,
                  message: "I can't seem to get that right! We'll move on and we can complete that later.",
                }
              } else {
                result = { next: 17, code: 400, message: 'We try to check your credit card, but failed' }
              }
              logger.info('retry times = ' + creditTryTimes[userId])
              logger.logFullError(e, 'check credit card')
              user[parts[0]] = [] // clean
              await user.save()
              return result
            }
            card.type = helper.getCreditCardType(card.number)
            card.number = helper.getHideCardNumber(card)
          }
        }
        await user.save()
        break
      case 'sendForm': {
        let attachments = fs.readdirSync(config.PATIENT_EMAIL_FILES).map(filename => ({
          filename,
          path: path.join(config.PATIENT_EMAIL_FILES, filename),
        }))
        attachments = attachments.filter(attachment => !_.includes(['metadata.json', '.DS_Store'], attachment.filename))
        await helper.sendEmail(
          config.PATIENT_EMAIL_SUBJECT,
          util.format(config.PATIENT_EMAIL_CONTENT, helper.getUserName(user)),
          [user.email],
          null,
          attachments
        )
        break
      }
      default:
        user[parts[0]] = content
        await user.save()
        break
    }
  }
  const process = async handlerName => {
    const hParts = handlerName.split('.')
    const model = hParts[0]
    hParts.shift()
    if (model === 'user') {
      return processUser(hParts)
    } else {
      logger.error('unexpected chat bot answer handler ' + handlerName)
      return {}
    }
  }
  const results = []
  for (let i = 0; i < (question.handler || []).length; i++) {
    results.push(await process(question.handler[i]))
  }
  return results
}

module.exports = {
  handlerAnswer,
}
