
const joi = require('joi')
const { BadRequest, NotFound, Forbidden } = require('http-errors')

const each = require('lodash/each')
const find = require('lodash/find')
const orderBy = require('lodash/orderBy')

const metadata = require('../../assets/returning-documents/metadata')

const { FormFileStatus } = require('../../constants/enums')
const searchEntities = require('../../database/helpers/searchEntities')

const logger = require('../lib/logger')

const Appointment = require('../models/Appointment')

/**
 * create returning patient document for follow up appointments
 * @param appointment the appointment
 * @return {Promise<void>}
 */
async function createReturningDocument (appointment) {
  const documents = []
  each(metadata, item => {
    documents.push({
      id: item.id,
      numberOfPage: item.numberOfPage,
      pages: [],
      name: item.name,
      status: FormFileStatus.missing
    })
  })
  appointment.followUp = true
  appointment.returnDocuments = documents
}

async function checkAppointment (userId, id) {
  const appointment = await Appointment.findById(id)
  if (!appointment) {
    throw new NotFound(`cannot find appointment where id = ${id}`)
  }
  if (appointment.providerId !== userId && appointment.patientId !== userId) {
    throw new Forbidden(`you cannot update this`)
  }
  return appointment
}

/**
 * delete appointment
 * @param userId the user id
 * @param id the appointment
 * @param entity the request entity
 * @return {Promise<void>}
 */
async function uploadReturnDocumentPage (userId, id, entity) {
  const appointment = await checkAppointment(userId, id)
  const document = find(appointment.returnDocuments, d => d.id === entity.id)
  if (!document) {
    throw new BadRequest('cannot find document where id = ' + entity.id)
  }
  if (document.status === FormFileStatus.rejected) {
    document.pages = []
    document.status = FormFileStatus.missing
  }
  if (document.pages.length < document.numberOfPage) {
    document.pages.push(entity.resourceKey)
  }
  if (document.pages.length >= document.numberOfPage) {
    document.status = FormFileStatus.pendingReview
  }
  document.uploadedAt = new Date()
  await appointment.save()
  return checkAppointment(userId, id)
}

/**
 * delete appointment
 * @param userId the user id
 * @param id the appointment
 * @param entity the request entity
 * @return {Promise<void>}
 */
async function updateReturnDocumentPage (userId, id, entity) {
  const appointment = await checkAppointment(userId, id)
  const document = find(appointment.returnDocuments, d => d.id === entity.id)
  if (!document) {
    throw new BadRequest('cannot find document where id = ' + entity.id)
  }
  document.status = entity.status
  document.reason = entity.reason
  document.uploadedAt = new Date()
  await appointment.save()
  return checkAppointment(userId, id)
}

updateReturnDocumentPage.schema = {
  userId: joi.string(),
  id: joi.string(),
  entity: joi.object().keys({
    id: joi.string().required(),
    status: joi.string().valid(Object.values(FormFileStatus)).required(),
    reason: joi.string()
  }).required()
}

/**
 * get not past follow up appointment
 * @param providerId the provider id
 * @param patientId the patient id
 * @return {Promise<Array>}
 */
async function getFollowUpAppointments (providerId, patientId) {
  const appointments = await searchEntities(models.Appointment, { providerId, patientId, followUp: true })
  return orderBy(appointments, ['endTime'], ['desc'])
}

module.exports = {
  createReturningDocument,
  uploadReturnDocumentPage,
  updateReturnDocumentPage,
  getFollowUpAppointments
}

logger.buildService(module.exports)
