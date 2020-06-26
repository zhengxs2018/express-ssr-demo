const config = require('config')

const { Schema } = require('mongoose')

const { fieldEncryption } = require('mongoose-field-encryption')

const omit = require('lodash/omit')

const defineModel = require('../../database/model')

/**
 * The Audit log
 */
const schema = new Schema(
  {
    operator: String,
    action: String,
    patientId: String,
    operatorRole: String,
    changeDetails: String,
  },
  { timestamps: true }
)

schema.plugin(fieldEncryption, {
  fields: Object.keys(schema.obj),
  secret: config.get('ENCRYPTION_SECRET_KEY'),
  saltGenerator: secret => secret.slice(0, 16),
})

schema.final = ret => omit(ret, 'id', 'updatedAt')

module.exports = defineModel('AuditLog', schema)
