const config = require('config')

const { Schema } = require('mongoose')
const { fieldEncryption } = require('mongoose-field-encryption')

const defineModel = require('../../database/model')

/**
 * Patient progress note
 */
const schema = new Schema({
  userId: String,
  conversationId: String,
  type: String,
  from: { type: Schema.Types.Mixed },
  patient: { type: Schema.Types.Mixed },
  unread: { type: Boolean, default: false },
  hasAttachments: { type: Boolean, default: false },
  message: { type: Schema.Types.Mixed },
  weight: Number,
})

schema.index({ userId: 1, conversationId: 1, type: 1 }, { unique: true })

schema.plugin(fieldEncryption, {
  fields: Object.keys(schema.obj),
  secret: config.get('ENCRYPTION_SECRET_KEY'),
  saltGenerator: secret => secret.slice(0, 16),
})

module.exports = defineModel('UserConversation', schema)
