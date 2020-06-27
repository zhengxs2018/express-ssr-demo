const path = require('path')
const fs = require('fs')

const config = require('config')
const joi = require('joi')
const { BadRequest } = require('http-errors')

const includes = require('lodash/includes')

const logger = require('../../lib/logger')
const { containsEmoji } = require('../../lib/helpers')

const User = require('../../models/User')

const AwsService = require('../AWS')

const questions = {}

/**
 * load question into memory
 */
function loadQuestions() {
  const jsonFolder = path.join(__dirname, 'questions')
  const questionMap = {}
  fs.readdirSync(jsonFolder).forEach(jsonFile => {
    const type = jsonFile.split('.')[0]
    questions[type] = JSON.parse(fs.readFileSync(path.join(jsonFolder, jsonFile)).toString())
    questions[type].forEach(q => {
      questionMap[q.id] = (questionMap[q.id] || 0) + 1
    })
    logger.info(`loaded chat bot question ${jsonFile}`)
  })

  if (Object.values(questionMap).filter(count => count > 1).length > 0) {
    throw new BadRequest('found same id in chat bot questions')
  }
}

// preload questions
loadQuestions()

/**
 * get chatbot questions
 * @param userId the user id
 * @param query the chat bot type
 * @returns {Promise<*>}
 */
async function getChatbotQuestions(userId, query) {
  const user = await User.findById(userId)
  return {
    progress: (user.chatbotProgress || {})[query.type],
    finished: (user.chatbotProgress || {})[`${query.type}Finished`],
    time: (user.chatbotProgress || {})[`${query.type}Time`],
    items: questions[query.type],
  }
}

getChatbotQuestions.schema = {
  userId: joi.string().required(),
  query: {
    type: joi
      .string()
      .valid(Object.keys(questions))
      .required(),
  },
}

/**
 * check value
 * @param question the question entity
 * @param files the upload files
 * @param body the request body
 */
async function checkValue(question, files, body) {
  if (!question.validate) {
    return
  }
  let content = body.content
  for (let i = 0; i < question.validate.length; i++) {
    const rule = question.validate[i]
    switch (rule) {
      case 'file': {
        if (files.length <= 0) {
          return 'Please provide a photo'
        }
        body.content = await AwsService.uploadToS3(files[0])
        break
      }
      case 'required': {
        if ((content || '').trim().length <= 0) {
          return 'Answer is required'
        }
        break
      }
      case 'creditCard': {
        if (!validator.isCreditCard(content)) {
          return 'Invalid credit card number'
        }
        break
      }
      case 'zipcode': {
        if (!validator.isPostalCode(content, 'US')) {
          return 'Invalid zip code'
        }
        break
      }
      case 'state': {
        content = (content || '').trim().toUpperCase()
        if (!includes(config.get('SUPPORTED_STATE_LIST'), content)) {
          return 'Invalid state'
        }
        break
      }
      case 'MM/DD/YYYY-DOB':
      case 'MM/DD/YYYY':
      case 'MM/YY-EXP':
      case 'MM/YY': {
        const format = rule.split('-')[0]
        const m = moment(content, format, true)
        if (!m || !m.isValid()) {
          return 'Invalid date, format must be ' + format
        }
        if (rule.indexOf('DOB') > 0 && m.unix() > moment().unix()) {
          return 'Invalid date, future date is not acceptable'
        }
        if (rule.indexOf('EXP') > 0 && m.unix() <= moment().unix()) {
          return 'Invalid date, past date is not acceptable'
        }
        break
      }
      case 'number': {
        if (!validator.isNumeric(content, { no_symbols: true })) {
          return `"${content}" are invalid digits`
        }
        break
      }
      case 'phone': {
        if (!validator.isMobilePhone(content, ['en-US'])) {
          return `"${content}" is invalid phone number`
        }
      }
    }
  }
  if (question.validate.length === 1 && question.validate[0] === 'required') {
    if (containsEmoji(content)) {
      return 'Invalid characters'
    }
  }

  if (question.len && content.length !== question.len) {
    return `Should be ${question.len} ${question.inputType || 'digits'} in length`
  }

  if (question.minLen && content.length < question.minLen) {
    return `Should be at least ${question.minLen} ${question.inputType || 'digits'} in length`
  }

  if (question.enum && !includes(question.enum, content)) {
    return `I can't understand what you mean`
  }
}

/**
 * build response
 * @param code the code
 * @param message the message
 * @param next the next question
 */
function buildRsp(code, message, next) {
  return { code, message, next }
}

function checkIsFinished(type, next) {
  const items = questions[type] || []
  let lastQuestion = null
  do {
    lastQuestion = items.find(q => q.id === next)
    next = lastQuestion.next
  } while (lastQuestion && lastQuestion.skipAnswer)
  return lastQuestion && lastQuestion.last
}
/**
 * answer
 * @returns {Promise}
 */
async function answer(userId, files, body) {
  const question = questions[body.type].find(q => q.id === body.id)
  if (!question) {
    return buildRsp(404, 'Context error, cannot find this question that your answered')
  }
  const err = await checkValue(question, files, body)
  if (err) {
    return buildRsp(400, err)
  }

  const results = await handlerAnswer(userId, question, files, body)
  let next = body.next
  let message = 'OK'
  let code = 200
  let failedNext
  if (results) {
    const ret = results[0] || {}
    message = ret.message || message
    code = ret.code || code
    next = ret.next || next
    failedNext = ret.next
  }
  const user = await User.findById(userId)
  user.chatbotProgress = user.chatbotProgress || {}
  user.chatbotProgress[body.type] = next
  user.chatbotProgress[`${body.type}Finished`] = !!checkIsFinished(body.type, next)
  user.chatbotProgress[`${body.type}Time`] = new Date()
  await user.save()
  return buildRsp(code, message, failedNext)
}

answer.schema = {
  userId: joi.string(),
  files: joi.any(),
  body: {
    id: joi
      .number()
      .integer()
      .required(),
    type: joi
      .string()
      .valid(Object.keys(questions))
      .required(),
    next: joi.number(),
    content: joi.string(),
  },
}

module.exports = {
  getChatbotQuestions,
  answer,
}

logger.buildService(module.exports)
