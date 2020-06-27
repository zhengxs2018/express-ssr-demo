const config = require('config')

const { Schema } = require('mongoose')
const { fieldEncryption } = require('mongoose-field-encryption')

const defineModel = require('../../database/model')

/**
 * Patient progress note
 */
const schema = new Schema({
  userId: String,
  subject: String,
  content: String,
  createdBy: String,
  createdAt: Date,
  updatedAt: String,
  updatedBy: Date,
})

schema.plugin(fieldEncryption, {
  fields: Object.keys(schema.obj),
  secret: config.get('ENCRYPTION_SECRET_KEY'),
  saltGenerator: secret => secret.slice(0, 16),
})

module.exports = defineModel('PatientProgressNote', schema)
