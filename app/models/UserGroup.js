const config = require('config')
const { Schema } = require('mongoose')
const { fieldEncryption } = require('mongoose-field-encryption')

const defineModel = require('../../database/model')

/**
 * User Group
 */
const schema = new Schema({
  name: String,
  userId: String,
  ids: [String],
})

schema.plugin(fieldEncryption, {
  fields: Object.keys(schema.obj),
  secret: config.get('ENCRYPTION_SECRET_KEY'),
  saltGenerator: secret => secret.slice(0, 16),
})

module.exports = defineModel('UserGroup', schema)
