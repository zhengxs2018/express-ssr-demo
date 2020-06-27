/**
 * user group service
 */
const joi = require('joi')

const { NotFound, Forbidden } = require('http-errors')

const pick = require('lodash/pick')
const map = require('lodash/map')
const extend = require('lodash/extend')

const searchEntities = require('../../database/helpers/searchEntities')

const logger = require('../lib/logger')
const { objectMatch } = require('../lib/helpers')

const User = require('../models/User')
const UserGroup = require('../models/UserGroup')

async function create(user, entity) {
  await UserGroup.create({ ...entity, userId: user.id })
}

create.schema = {
  user: joi.object(),
  entity: joi.object().keys({
    name: joi.string().required(),
    ids: joi
      .array()
      .items(joi.string().required())
      .required(),
  }),
}

async function permissioCheck(user, id) {
  const entity = await UserGroup.findById(id)
  if (!entity) {
    throw new NotFound('cannot found user group')
  }
  if (entity.userId.toString() !== user.id.toString()) {
    throw new Forbidden('no permission')
  }
  return entity
}

/**
 * update group
 * @param user the auth user
 * @param id the group id
 * @param entity the new entity
 * @return {Promise<void>}
 */
async function update(user, id, entity) {
  return extend(await permissioCheck(user, id), entity).save()
}

update.schema = {
  user: joi.object(),
  id: joi.string(),
  entity: joi.object().keys({
    name: joi.string(),
    ids: joi
      .array()
      .items(joi.string().required())
      .required(),
  }),
}

/**
 * remove group
 * @param user the user
 * @param id the group id
 * @return {Promise<void>}
 */
async function remove(user, id) {
  const entity = await permissioCheck(user, id)
  await entity.remove()
}

remove.schema = {
  user: joi.object(),
  id: joi.string(),
}

/**
 * search groups
 * @param user the auth user
 * @param query the request query
 * @return {Promise<Array>}
 */
async function search(user, query) {
  let groups = map(await searchEntities(UserGroup, { userId: user.id }), i => i.toJSON())

  if (query.name) {
    groups = groups.filter(e => objectMatch(e, ['name'], query.name))
  }

  for (let i = 0; i < groups.length; i++) {
    const users = []
    for (let j = 0; j < groups[i].ids.length; j++) {
      const id = groups[i].ids[j]
      const user = await User.findById(id)
      if (user) {
        users.push(pick(user.toJSON(), 'id', 'email', 'firstName', 'lastName', 'headUrl'))
      }
    }
    groups[i].users = users
  }
  return groups
}

search.schema = {
  user: joi.object(),
  query: joi.object().keys({
    name: joi.string(),
  }),
}

module.exports = {
  create,
  search,
  update,
  remove,
}

logger.buildService(module.exports)
