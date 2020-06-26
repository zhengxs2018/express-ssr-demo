const joi = require('joi')

const { BadRequest, NotFound, Forbidden } = require('http-errors')

const map = require('lodash/map')
const filter = require('lodash/filter')
const findIndex = require('lodash/findIndex')

const { FormFileStatus } = require('../../constants/enums')
const searchEntities = require('../../database/helpers/searchEntities')

const logger = require('../lib/logger')
const { objectMatch } = require('../lib/helpers')

const User = require('../models/User')
const Form = require('../models/Form')

/**
 * get user form
 * @param userId the user id
 */
async function get(userId) {
  let form = await searchEntities(Form, { userId }, true)
  const newForm = f => ({ ...f, pages: [], status: FormFileStatus.missing })
  if (!form) {
    const forms = map(formMetadata, f => newForm(f))
    form = await Form.create({ type: 'newForms', userId, forms })
    return getByFormId(form.id)
  } else {
    const addForms = filter(formMetadata, fm => findIndex(form.forms, ff => ff.id === fm.id) < 0)
    const newForms = form.forms.filter(f => findIndex(formMetadata, fm => fm.id === f.id) >= 0)
    form.forms = newForms.concat(map(addForms, f => newForm(f)))
    await form.save()
    return getByFormId(form.id)
  }
}

/**
 * upload page
 * @param userId the user id
 * @param formId the form id
 * @param entity the request entity
 */
async function uploadPage(userId, formId, entity) {
  let form = await searchEntities(Form, { userId }, true)
  if (!form) {
    throw new NotFound(`cannot find Form where id = ${formId}`)
  }
  if (form.userId !== userId) {
    throw new Forbidden(`cannot upload form page, not belongs to you`)
  }
  const file = form.forms.find(f => f.id === entity.id)
  if (!file) {
    throw new NotFound('cannot find file where id = ' + entity.id)
  }
  if (file.status === FormFileStatus.rejected) {
    file.pages = []
    file.status = FormFileStatus.missing
  }

  file.pages.push(entity.resourceKey)
  file.uploadedAt = new Date()
  file.updatedAt = new Date()

  if (file.pages.length >= file.numberOfPage) {
    file.status = FormFileStatus.pendingReview
  }
  await form.save()
  return getByFormId(formId)
}

uploadPage.schema = {
  userId: joi.string(),
  formId: joi.string(),
  entity: joi
    .object()
    .keys({
      id: joi.string().required(),
      resourceKey: joi.string().required(),
    })
    .required(),
}

/**
 * get by form id
 * @param formId the form id
 */
async function getByFormId(formId) {
  return Form.findById(formId)
}

/**
 * update form
 * @param formId the form id
 * @param entity the update entity
 */
async function update(formId, entity) {
  let form = await Form.findById(formId)
  if (!form) {
    throw new NotFound(`cannot find Form where id = ${formId}`)
  }

  if (entity.status === FormFileStatus.rejected && !entity.reason) {
    return new BadRequest('reason is required')
  }
  const file = form.forms.find(f => f.id === entity.id)
  if (!file) {
    throw new NotFound('cannot find file where id = ' + entity.id)
  }
  file.status = entity.status
  file.reason = entity.reason || ''
  file.updatedAt = new Date()
  await form.save()
  return getByFormId(formId)
}

update.schema = {
  formId: joi.string(),
  entity: joi
    .object()
    .keys({
      id: joi.string().required(),
      status: joi
        .string()
        .valid(Object.values(FormFileStatus))
        .required(),
      reason: joi.string(),
    })
    .required(),
}

module.exports = {
  get,
  update,
  uploadPage,
}

logger.buildService(module.exports)
