const config = require('config')
const { Schema } = require('mongoose')

const { fieldEncryption } = require('mongoose-field-encryption')

const defineModel = require('../../database/model')

/**
 * the user Schedule
 * this used to record
 */
const schema = new Schema({
  userId: String,
  key: String,
  slots: [{ start: String, end: String }],
})

schema.plugin(fieldEncryption, {
  fields: Object.keys(schema.obj),
  secret: config.get('ENCRYPTION_SECRET_KEY'),
  saltGenerator: secret => secret.slice(0, 16),
})

module.exports = defineModel('Schedule', schema)
