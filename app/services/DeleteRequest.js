/**
 * delete request file
 */
const path = require('path')
const fs = require('fs')

const config = require('config')
const AdmZip = require('adm-zip')
const Joi = require('joi')
const { NotFound, BadRequest } = require('http-errors')

const find = require('lodash/find')
const each = require('lodash/each')
const omit = require('lodash/omit')

const { FileType, DELRequestStatus } = require('../../constants/enums')
const searchEntities = require('../../database/helpers/searchEntities')

const logger = require('../lib/logger')
const { getUserName } = require('../lib/helpers')

const User = require('../models/User')
const Form = require('../models/Form')
const DeleteRequest = require('../models/DeleteRequest')
const Appointment = require('../models/Appointment')

const AwsService = require('./AWS')

/**
 * get patient files
 * @param patientId the patient ud
 * @return {Promise<[]>}
 */
async function getPatientFiles(patientId) {
  const newForms = await searchEntities(Form, { userId: patientId })
  const result = []
  each(newForms, document => {
    each(document.forms, form => {
      if (form.pages.length > 0) {
        result.push({
          type: FileType.newForms,
          parentId: document.id,
          ...omit(form.toJSON(), '_id', 'pages'),
        })
      }
    })
  })
  const appointments = await searchEntities(Appointment, { patientId })
  each(appointments, apt => {
    each(apt.returnDocuments, form => {
      if (form.pages.length > 0) {
        result.push({
          type: FileType.returnDocuments,
          parentId: apt.id,
          ...omit(form.toJSON(), '_id', 'pages'),
        })
      }
    })
  })

  const requests = await searchEntities(DeleteRequest, { patientId })
  each(requests, r => {
    const item = find(result, i => i.type === r.file.type && i.parentId === r.file.parentId)
    if (item) {
      item.requestDelete = true
    }
  })
  return result
}

/**
 * download patient files
 */
async function downloadPatientFiles(items) {
  const newDocuments = {}
  const zip = new AdmZip(null)

  const addIntoZip = async (rootPath, item, form) => {
    const template = path.join(rootPath, item.id)
    const templateBuffer = fs.readFileSync(template)
    zip.addFile(item.id, templateBuffer, item.id, null)
    logger.info(`add file ${template} successful`)
    for (let i = 0; i < form.pages.length; i++) {
      const url = await AwsService.signUrl(form.pages[i])
      try {
        const buffer = await axios
          .get(url, {
            responseType: 'arraybuffer',
          })
          .then(response => Buffer.from(response.data, 'binary'))
        zip.addFile(`${form.name}-page-${i + 1}.jpeg`, buffer, `${form.name} pages`, null)
        logger.info(`file ${url} download successful!`)
      } catch (e) {
        logger.error(`download page from ${url} failed`)
      }
    }
  }
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.type === FileType.newForms) {
      const document = newDocuments[item.parentId] || (await Form.findById(item.parentId))
      newDocuments[item.parentId] = document.toJSON()
      const form = document.forms.find(f => f.id === item.id)
      if (form) {
        await addIntoZip(config.get('PATIENT_EMAIL_FILES'), item, form)
      }
    } else if (item.type === FileType.returnDocuments) {
      const document = await Appointment.findById(item.parentId)
      const form = document.returnDocuments.find(f => f.id === item.id)
      if (form) {
        await addIntoZip(path.join(config.get('PATIENT_EMAIL_FILES'), '..', 'returning-documents'), item, form)
      }
    }
  }
  return {
    metadata: {
      mimetype: 'application/zip',
      filename: `patient-files-${Date.now()}.zip`,
    },
    buffer: zip.toBuffer(),
  }
}

downloadPatientFiles.schema = {
  items: Joi.array()
    .items(
      Joi.object().keys({
        type: Joi.string()
          .valid(Object.values(FileType))
          .required(),
        parentId: Joi.string().required(),
        id: Joi.string().required(),
      })
    )
    .required(),
}

/**
 * create delete request
 * @return {Promise<void>}
 */
async function create(authUser, items) {
  const findAndGetUserName = async userId => {
    const user = await User.findById(userId)
    if (!user) {
      throw new NotFound(`user ${userId} not found`)
    }
    return getUserName(user)
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i].file
    const uid = `${item.parentId}-${item.type}-${item.id}`
    const request = await searchEntities(DeleteRequest, { uid }, true)
    if (request) {
      throw new NotFound(`delete request for file ${uid} already exist`)
    }
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const file = items[i].file
    const uid = `${file.parentId}-${file.type}-${file.id}`
    await DeleteRequest.create({
      createdBy: authUser._id,
      createdByName: findAndGetUserName(authUser),
      file: item.file,
      uid,
      status: DELRequestStatus.pending,
      patientId: item.patientId,
      patientName: await findAndGetUserName(item.patientId),
    })
  }
}

create.schema = {
  authUser: Joi.object(),
  items: Joi.array()
    .items(
      Joi.object().keys({
        patientId: Joi.string(),
        file: Joi.object()
          .keys({
            type: Joi.string()
              .valid(Object.values(FileType))
              .required(),
            parentId: Joi.string().required(),
            id: Joi.string().required(),
          })
          .required(),
      })
    )
    .required(),
}

/**
 * update delete request
 * @return {Promise<void>}
 */
async function update(authUser, body) {
  const { ids } = body
  const requests = []
  for (let i = 0; i < ids.length; i++) {
    const request = await DeleteRequest.findById(ids[i])
    if (!requests) {
      throw new NotFound(`request not found ${ids[i]}`)
    }
    if (request.status === DELRequestStatus.confirmed) {
      throw new BadRequest(`request ${ids[i]} already confirmed`)
    }
    requests.push(request)
  }

  for (let i = 0; i < requests.length; i++) {
    const request = requests[i]
    const item = request.file
    request.status = DELRequestStatus.confirmed
    request.confirmedBy = authUser._id
    request.confirmedByName = getUserName(authUser)
    if (item.type === FileType.newForms) {
      const document = await Form.findById(item.parentId)
      const form = document.forms.find(f => f.id === item.id)
      if (form) {
        document.forms = document.forms.filter(f => f.id !== item.id)
        request.backup = form
        await document.save()
      }
    } else if (item.type === FileType.returnDocuments) {
      const document = await Appointment.findById(item.parentId)
      const form = document.returnDocuments.find(f => f.id === item.id)
      if (form) {
        document.returnDocuments = document.returnDocuments.filter(f => f.id !== item.id)
        request.backup = form
        await document.save()
      }
    }
    await request.save()
  }
}

update.schema = {
  authUser: Joi.object(),
  body: Joi.object()
    .keys({
      ids: Joi.array()
        .items(Joi.string())
        .required(),
    })
    .required(),
}

/**
 * return delete requests
 * @return {Promise<void>}
 */
async function search(query) {
  return searchEntities(DeleteRequest, query)
}

search.schema = {
  query: Joi.object()
    .keys({
      status: Joi.string()
        .valid(...Object.values(DELRequestStatus))
        .required(),
    })
    .required(),
}

/**
 * get pending delete request
 * @return {Promise<*>}
 */
async function countPendingRequests() {
  return (await searchEntities(DeleteRequest, { status: DELRequestStatus.pending })).length
}

/**
 * remove request
 * @param id the request id
 */
async function remove(id) {
  const request = await DeleteRequest.findById(id)
  if (request) {
    await request.remove()
  }
}

module.exports = {
  getPatientFiles,
  downloadPatientFiles,
  search,
  countPendingRequests,
  create,
  update,
  remove,
}
logger.buildService(module.exports)
