const jsonDiff = require('json-diff')
const _ = require('lodash')

const { UserRoles } = require('../../constants/access')

/**
 Audit changes to any of the following 16 fields, we need to save both the old value and new values in the audit log:

 Names
 Geo code - Zip code, city, county
 All dates - admission, discharge, birth date
 Phone Numbers
 Fax Numbers
 Electronic mail addresses
 Social Security numbers
 Medical record numbers
 Health plan beneficiary numbers
 Account Numbers
 Certificate/License numbers
 Vehicle identifiers and serial numbers including license plate numbers
 Web Universal Resource Locators (URLs)
 Biometric Identifiers including finger and voiceprints
 Full face photographic images
 Any other unique identifying number, characteristic
 */

const auditFields = [
  // Names
  'firstName',
  'lastName',

  // All dates - admission, discharge, birth date
  // TODO admission, discharge,
  'dateOfBirth',

  //  Geo code - Zip code, city, county
  'zipcode',
  'city',
  'state',
  'address',

  // Phone Numbers
  'phone',

  // Fax Numbers
  // TODO

  // Electronic mail addresses
  'email',

  // Social Security numbers
  // TODO

  // Medical record numbers
  // TODO

  // Health plan beneficiary numbers
  'insuranceCards.$.planNumber',

  // Account Numbers
  // TODO

  // Certificate/License numbers
  // TODO

  // Vehicle identifiers and serial numbers including license plate numbers
  // TODO

  // Web Universal Resource Locators (URLs)
  // TODO

  // Biometric Identifiers including finger and voiceprints
  // TODO

  // Full face photographic images
  'headUrl',

  // Any other unique identifying number, characteristic
  // TODO,

  'deleted',
]

function paths() {
  return auditFields
}

/**
 * get actions
 */
function getDetailsAndAction(v, op) {
  let details = null
  let action = null
  const update = _.get(v, op)
  const add = _.get(v, op + '__added')
  const remove = _.get(v, op + '__removed')
  if (update) {
    details = `${update.__old || ''} / ${update.__new}`
    action = 'Update'
  } else if (add) {
    details = '/ ' + add
    action = 'Add'
  } else if (remove) {
    details = 'N/A'
    action = 'Remove'
  }
  return { details, action }
}

/**
 * pad 0
 * @param num the number
 * @param size the length
 */
const pad = (num, size) => {
  let s = _.isNil(num) ? '' : `${num}`
  while (s.length < (size || 2)) {
    s = `0${s}`
  }
  return s
}

/**
 * get user id
 * @param uid
 * @return {string|string}
 */
const getUid = uid => pad(uid, 9)

/**
 * preSave to save audit log
 * @param target the save target
 * @param modelName the model name
 * @return {Promise<void>}
 */
async function preSave(target, modelName) {
  if (modelName !== 'User') {
    return
  }
  const models = require('../models')
  const Model = models[modelName]
  const newObj = new Model(target)
  newObj.decryptFieldsSync()
  const obj = newObj.toJSON()

  const getPatientId = user => {
    if (_.includes(user.roles, UserRoles.Patient)) {
      return user.uid ? getUid(user.uid) : 'N/A'
    }
    return 'N/A'
  }
  const dbOrigin = await Model.findById(target._id)
  if (!dbOrigin) {
    // new
    const pathArr = paths(obj)
    for (let i = 0; i < pathArr.length; i++) {
      const p = pathArr[i]
      const v = _.get(obj, p)
      if (!v) {
        continue
      }
      const auditEntity = {
        operator: `${obj.email}(${obj.id})`,
        action: `Create ${p}`,
        patientId: getPatientId(obj),
        operatorRole: obj.roles.join(', '),
        changeDetails: ` / ${v}`,
      }
      await models.AuditLog.create(auditEntity)
    }
  } else {
    // update
    const origin = dbOrigin.toJSON()
    obj.insuranceCards = obj.insuranceCards || []
    const diff = jsonDiff.diff(origin, obj)
    if (!diff || _.isEmpty(diff)) {
      // no diff
      return
    }
    const pathArr = paths(obj)
    for (let i = 0; i < pathArr.length; i++) {
      const p = pathArr[i]

      const operator = await models.User.findById(obj.updatedBy || obj.id)
      const auditEntity = {
        operator: `${operator.email}(${operator._id})`,
        patientId: getPatientId(obj),
        operatorRole: operator.roles.join(', '),
      }
      if (p.indexOf('$') > 0) {
        // array item
        const parts = p.split('.$.')
        const ap = parts.shift()
        const op = parts[0]
        const rows = _.get(diff, ap)
        if (!rows || rows.length <= 0) {
          continue
        }
        for (let j = 0; j < rows.length; j++) {
          const row = rows[j]
          const diffAction = row[0]
          const v = row[1]
          let action = { '~': 'Update', '+': 'Create', '-': 'Remove' }[diffAction]
          let { details } = getDetailsAndAction(v, op)
          if (!details) {
            continue
          }
          const newAuditLog = _.clone(auditEntity)
          newAuditLog.action = `${action} ${ap}.${j}.${op}`
          newAuditLog.changeDetails = action === 'Remove' ? '' : details
          await models.AuditLog.create(newAuditLog)
        }
      } else {
        // raw item
        const { details, action } = getDetailsAndAction(diff, p)
        if (!details) {
          continue
        }
        auditEntity.action = `${action} ${p}`
        auditEntity.changeDetails = details
        await models.AuditLog.create(auditEntity)
      }
    }
  }
}

module.exports = {
  preSave,
}
