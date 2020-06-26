const config = require('config')

const { Schema, SchemaTypes } = require('mongoose')

const { fieldEncryption } = require('mongoose-field-encryption')

const defineModel = require('../../database/model')

/**
 * the delete request
 */
const schema = new Schema({
  createdBy: String,
  createdByName: String,
  confirmedBy: String,
  confirmedByName: String,
  uid: String,
  file: SchemaTypes.Mixed,
  status: String,
  patientId: String,
  patientName: String,
  backup: SchemaTypes.Mixed,
})

schema.plugin(fieldEncryption, {
  fields: Object.keys(schema.obj),
  secret: config.get('ENCRYPTION_SECRET_KEY'),
  saltGenerator: secret => secret.slice(0, 16),
})

schema.plugin(fieldEncryption, {
  fields: Object.keys(schema.obj),
  secret: config.get('ENCRYPTION_SECRET_KEY'),
  saltGenerator: secret => secret.slice(0, 16),
})

module.exports = defineModel('DeleteRequest', schema)
