const config = require('config')

const { Schema } = require('mongoose')

const { fieldEncryption } = require('mongoose-field-encryption')

/**
 * message conversation
 */
const schema = new Schema({
  members: [String],
  messages: [String],
  patientId: String,
  hasAttachments: { type: Boolean, default: false },
  weight: Number,
})

schema.plugin(fieldEncryption, {
  fields: Object.keys(schema.obj),
  secret: config.get('ENCRYPTION_SECRET_KEY'),
  saltGenerator: secret => secret.slice(0, 16),
})

module.exports = defineModel('Conversation', schema)
