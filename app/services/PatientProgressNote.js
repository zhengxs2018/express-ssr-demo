/**
 * patient progress note service
 */
const joi = require('joi')

const { NotFound } = require('http-errors')

const map = require('lodash/map')
const includes = require('lodash/includes')

const { UserRoles } = require('../../constants/access')
const searchEntities = require('../../database/helpers/searchEntities')

const logger = require('../lib/logger')
const { objectMatch } = require('../lib/helpers')

const User = require('../models/User')
const PatientProgressNote = require('../models/PatientProgressNote')

/**
 * make sure user is patient
 * @param body the body
 * @return {Promise<*>}
 */
async function makeSurePatient(body) {
  if (body.userId) {
    const patient = await User.findById(body.userId)
    if (!patient) {
      throw new NotFound('patient not found')
    }
    if (!includes(patient.roles, UserRoles.Patient)) {
      throw new NotFound('invalid patient id')
    }
    return patient
  }
}

/**
 * create note
 * @param user auth user
 * @param entity the request entity
 * @return {Promise<void>}
 */
async function create(user, entity) {
  await makeSurePatient(entity)
  await PatientProgressNote.create({
    ...entity,
    createdAt: new Date(),
    createdBy: user.id,
  })
}

create.schema = {
  user: joi.object(),
  entity: joi.object().keys({
    userId: joi.string().required(),
    subject: joi.string().required(),
    content: joi.string().required(),
  }),
}

async function getNote(user, id) {
  const entity = await PatientProgressNote.findById(id)
  if (!entity) {
    throw new NotFound('cannot found user group')
  }
  return entity
}

/**
 * update note
 * @param user the auth user
 * @param id the note id
 * @param entity the new entity
 * @return {Promise<void>}
 */
async function update(user, id, entity) {
  const dbEntity = await getNote(user, id)
  await makeSurePatient(entity)
  extend(dbEntity, entity)
  await dbEntity.save()
}

update.schema = {
  user: joi.object(),
  id: joi.string(),
  entity: joi.object().keys({
    userId: joi.string(),
    subject: joi.string(),
    content: joi.string(),
  }),
}

/**
 * remove note
 * @param user the user
 * @param id the note id
 * @return {Promise<void>}
 */
async function remove(user, id) {
  const entity = await getNote(user, id)
  await entity.remove()
}

/**
 * search notes
 * @param user the auth user
 * @param query the request query
 */
async function search(user, query) {
  let entities = map(await searchEntities(PatientProgressNote, { userId: query.userId }), i => i.toJSON())

  if (query.keyword) {
    entities = entities.filter(e => objectMatch(e, ['subject', 'content'], query.keyword))
  }
  return orderAndPage(entities, query)
}

search.schema = {
  user: joi.object(),
  query: joi.object().keys({
    keyword: joi.string(),
    userId: joi.string().required(),
    sortBy: joi.string().valid('subject', 'content', 'createdAt', 'updatedAt'),
    sortOrder: joi
      .string()
      .valid('asc', 'desc')
      .default('asc'),
    pageNum: joi
      .number()
      .min(1)
      .default(1),
    perPage: joi
      .number()
      .min(1)
      .default(10),
  }),
}

module.exports = {
  create,
  search,
  update,
  remove,
}

logger.buildService(module.exports)
