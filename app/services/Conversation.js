/**
 * user group service
 */
const joi = require('joi')

const pick = require('lodash/pick')
const map = require('lodash/map')
const uniq = require('lodash/uniq')
const extend = require('lodash/extend')
const includes = require('lodash/includes')
const filter = require('lodash/filter')

const { NotFound, BadRequest, Forbidden } = require('http-errors')

const { UserRoles } = require('../../constants/access')
const { ConversationType } = require('../../constants/enums')
const { ShortUserFields } = require('../../constants/forms')

const searchEntities = require('../../database/helpers/searchEntities')

const { objectMatch, orderAndPage, makeSureAllExist } = require('../lib/helpers')

const logger = require('../lib/logger')

const User = require('../models/User')
const UserConversation = require('../models/UserConversation')
const PatientProgressNote = require('../models/PatientProgressNote')
const Message = require('../models/Message')

/**
 * search conversations
 */
async function search(user, query) {
  let entities = map(
    await searchEntities(UserConversation, {
      type: query.type,
      userId: user.id,
    })
  )

  if (query.keyword) {
    entities = entities.filter(e =>
      objectMatch(
        e,
        [
          'message.subject',
          'message.content',
          'from.firstName',
          'from.lastName',
          'patient.firstName',
          'patient.lastName',
          'weight',
        ],
        query.keyword
      )
    )
  }

  if (query.unread === true) {
    entities = entities.filter(e => e.unread)
  }
  return orderAndPage(entities, query)
}

search.schema = {
  user: joi.object(),
  query: joi.object().keys({
    type: joi
      .string()
      .valid(Object.values(ConversationType))
      .required(),
    sortBy: joi.string().valid('from.firstName', 'patient.firstName', 'message.subject', 'message.createdAt', 'weight'),
    sortOrder: joi
      .string()
      .valid('asc', 'desc')
      .default('asc'),
    keyword: joi.string(),
    unread: joi.boolean(),
    pageNum: joi
      .number()
      .min(1)
      .default(1),
    perPage: joi
      .number()
      .min(0)
      .default(10),
  }),
}

/**
 * create or update user conversation
 */
async function createOrUpdateUC(sendUser, recipeUserId, conversation, message, type, unread, hasAttachments, patient) {
  const entity = {}
  entity.userId = recipeUserId
  entity.conversationId = conversation._id.toString()
  entity.type = type
  entity.from = pick(sendUser, ShortUserFields)
  entity.patient = patient ? pick(patient, ShortUserFields) : null
  entity.message = message
  entity.weight = conversation.weight
  entity.unread = unread
  if (hasAttachments) {
    entity.hasAttachments = hasAttachments
  }
  entity.message = message

  let dbEntity = await searchEntities(
    UserConversation,
    {
      userId: recipeUserId,
      conversationId: conversation._id.toString(),
      type,
    },
    true
  )
  if (!dbEntity) {
    await UserConversation.create(entity)
  } else {
    extend(dbEntity, entity)
    await dbEntity.save()
  }
}

/**
 * process user conversation
 * @param message the message
 * @param user the auth user
 * @param conversation the conversation
 * @param body the request body
 * @param patient the attached patient
 * @param to the to users
 * @return {Promise<void>}
 */
async function processUserConversion(message, user, conversation, body, patient, to) {
  message.decryptFieldsSync()
  message = pick(message.toJSON(), ...Object.keys(message.toJSON()).filter(key => key.indexOf('__') < 0))
  // sent inbox
  await createOrUpdateUC(
    user,
    user.id,
    conversation,
    message,
    ConversationType.sent,
    false,
    body.attachments && body.attachments.length > 0,
    patient
  )

  for (let i = 0; i < to.length; i++) {
    await createOrUpdateUC(
      user,
      to[i],
      conversation,
      message,
      ConversationType.inbox,
      true,
      body.attachments && body.attachments.length > 0,
      patient
    )
  }
}

/**
 * create conversation
 */
async function create(user, body) {
  const members = uniq((body.to || []).concat(body.cc || []).concat(user.id))
  await makeSureAllExist(User, members)

  let patient
  if (body.patientId) {
    patient = await User.findById(body.patientId)
    if (!patient) {
      throw new NotFound('patient not found')
    }
    if (!includes(patient.roles, UserRoles.Patient)) {
      throw new NotFound('invalid patient id')
    }
    patient = patient.toJSON()
  }

  const to = filter(members, m => m !== user.id)
  const messageBody = {
    createdAt: new Date(),
    ...pick(body, 'subject', 'content', 'attachments'),
    sendUserId: user.id,
    to,
  }

  if (body.patientId) {
    await PatientProgressNote.create({
      userId: body.patientId,
      subject: messageBody.subject,
      content: messageBody.content,
      createdBy: user.id,
      createdAt: new Date(),
    })
  }

  let message = await Message.create(messageBody)

  const conversation = await Conversation.create({
    members,
    ...pick(body, 'patientId', 'weight'),
    messages: [message._id],
    hasAttachments: body.attachments && body.attachments.length > 0,
  })
  await processUserConversion(message, user, { _id: conversation.id, weight: body.weight }, body, patient, to)
  return { id: conversation._id }
}

create.schema = {
  user: joi.object(),
  body: joi
    .object()
    .keys({
      to: joi
        .array()
        .items(joi.string().required())
        .required(),
      cc: joi.array().items(joi.string().required()),
      weight: joi
        .number()
        .min(1)
        .max(9)
        .required(),
      patientId: joi.string(),
      subject: joi.string().required(),
      content: joi.string().required(),
      attachments: joi.array().items(
        joi.object().keys({
          fileName: joi.string().required(),
          mimeType: joi.string().required(),
          url: joi.string().required(),
        })
      ),
    })
    .required(),
}

/**
 * check permission
 * @param user the user
 * @param id the conversation id
 * @return {Promise<*>}
 */
async function permissionCheck(user, id) {
  const conversion = await Conversation.findById(id)
  if (!conversion) {
    throw new NotFound('conversation not found')
  }

  if (!includes(conversion.members, user.id)) {
    throw new Forbidden('no permission')
  }
  return conversion
}

/**
 * get conversation
 */
async function get(user, id) {
  const conversation = (await permissionCheck(user, id)).toJSON()
  conversation.members = map(await makeSureAllExist(User, conversation.members), i => pick(i.toJSON(), ShortUserFields))
  conversation.messages = await makeSureAllExist(Message, conversation.messages)
  return conversation
}

/**
 * reply conversation
 */
async function reply(user, id, body) {
  const conversation = await permissionCheck(user, id)
  const previousMessage = await Message.findById(conversation.messages[0])
  if (!previousMessage) {
    throw new BadRequest('invalid conversation, no previous message found')
  }
  const to = filter(conversation.members, m => m !== user.id)
  let patient
  if (conversation.patientId) {
    patient = await User.findById(conversation.patientId)
  }
  const messageBody = {
    createdAt: new Date(),
    subject: previousMessage.subject,
    ...body,
    sendUserId: user.id,
    to,
  }
  if (conversation.patientId) {
    await PatientProgressNote.create({
      userId: conversation.patientId,
      subject: messageBody.subject,
      content: messageBody.content,
      createdBy: user.id,
      createdAt: new Date(),
    })
  }
  const message = await Message.create(messageBody)
  conversation.messages = [message._id].concat(conversation.messages)
  if (body.attachments && body.attachments.length > 0) {
    conversation.hasAttachments = true
  }
  const cv = {
    _id: conversation._id,
    weight: conversation.weight,
  }
  await conversation.save()
  await processUserConversion(message, user, cv, body, patient, to)
}

reply.schema = {
  user: joi.object(),
  id: joi.string(),
  body: joi
    .object()
    .keys({
      content: joi.string().required(),
      attachments: joi.array().items(
        joi.object().keys({
          fileName: joi.string().required(),
          mimeType: joi.string().required(),
          url: joi.string().required(),
        })
      ),
    })
    .required(),
}

/**
 * forward conversation
 */
async function forward(user, id, body) {
  const ids = uniq(body.userIds)
  await makeSureAllExist(User, ids)

  const conversation = await permissionCheck(user, id)
  const previousMessage = await Message.findById(conversation.messages[0])
  if (!previousMessage) {
    throw new BadRequest('invalid conversation, no previous message found')
  }
  let patient
  if (conversation.patientId) {
    patient = await User.findById(conversation.patientId)
  }

  conversation.members = ids.concat(conversation.members)
  const cv = {
    _id: conversation._id,
    weight: conversation.weight,
  }
  await conversation.save()

  for (let i = 0; i < ids.length; i++) {
    await createOrUpdateUC(
      user,
      ids[i],
      cv,
      previousMessage.toJSON(),
      ConversationType.inbox,
      true,
      conversation.hasAttachments,
      patient
    )
  }
}

forward.schema = {
  user: joi.object(),
  id: joi.string(),
  body: joi
    .object()
    .keys({
      userIds: joi
        .array()
        .items(joi.string())
        .required(),
    })
    .required(),
}

/**
 * update conversation
 * @param user the user
 * @param body the body
 * @return {Promise<void>}
 */
async function update(user, body) {
  for (let i = 0; i < body.ids.length; i++) {
    const conversationId = body.ids[i]
    const uc = await searchEntities(
      UserConversation,
      {
        userId: user.id,
        conversationId,
      },
      true
    )
    if (!uc) {
      throw NotFound('conversation not found')
    }
    if (body.operation === 'read') {
      uc.unread = false
      await uc.save()
    } else {
      let dbEntity = await searchEntities(
        UserConversation,
        {
          userId: user.id,
          conversationId,
          type: body.operation,
        },
        true
      )
      if (dbEntity) {
        await dbEntity.remove()
      }
      uc.type = body.operation
      uc.unread = false
      await uc.save()
    }
  }
}

update.schema = {
  user: joi.object(),
  id: joi.string(),
  body: joi
    .object()
    .keys({
      ids: joi
        .array()
        .items(joi.string())
        .required(), // conversation id array
      operation: joi
        .string()
        .valid('delete', 'archived', 'read')
        .required(),
    })
    .required(),
}

module.exports = {
  search,
  create,
  reply,
  forward,
  get,
  update,
}

logger.buildService(module.exports)
