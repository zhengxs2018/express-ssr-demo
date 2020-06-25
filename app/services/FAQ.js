const { NotFound } = require('http-errors')

const extend = require('lodash/extend')

const searchEntities = require('../../database/helpers/searchEntities')

const FAQ = require('../models/FAQ')

/**
 * search FAQ items
 * @return {Promise<*>}
 */
async function search() {
  return searchEntities(FAQ, {})
}

/**
 * get FAQ
 * @param id the FAQ id
 * @return {Promise<void>}
 */
async function get(id) {
  const entity = await FAQ.findById(id)
  if (entity) return entity

  throw new NotFound('cannot find FAQ where id = ' + id)
}

/**
 * update FAQ
 * @param id the FAQ id
 * @param entity the FAQ entity
 * @return {Promise<void>}
 */
async function update(id, entity) {
  const dbEntity = await get(id)
  extend(dbEntity, entity)
  await dbEntity.save()
  return get(id)
}

/**
 * remove FAQ
 * @param id the FAQ id
 * @return {Promise<void>}
 */
async function remove(id) {
  const entity = await get(id)
  await entity.remove()
}

/**
 * create FAQ
 * @param entity the FAQ entity
 * @return {Promise<entity>}
 */
async function create(entity) {
  const item = await FAQ.create(entity)
  return get(item.id)
}

module.exports = { search, get, update, remove, create }
