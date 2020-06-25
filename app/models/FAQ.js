const config = require('config')

const { Schema } = require('mongoose')

const { fieldEncryption } = require('mongoose-field-encryption')

const defineModel = require('../../database/model')

/**
 * The FAQ
 */
const schema = new Schema({
  title: String,
  content: String,
})

schema.plugin(fieldEncryption, {
  fields: Object.keys(schema.obj),
  secret: config.get('ENCRYPTION_SECRET_KEY'),
  saltGenerator: secret => secret.slice(0, 16),
})

module.exports = defineModel('FAQ', schema)
