const config = require('config')

const { Schema } = require('mongoose')

const { fieldEncryption } = require('mongoose-field-encryption')
const { isEmail } = require('validator')

const defineModel = require('../../database/model')

/**
 * The verification code schema.
 * It contains the user email and verification code value along with its expiry date.
 */
const schema = new Schema({
  value: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
    unique: true,
    validate: {
      validator: isEmail,
      message: 'email is invalid',
      isAsync: false,
    },
  },
  type: String,
  expiryDate: {
    required: true,
    type: Date,
  },
})

schema.plugin(fieldEncryption, {
  fields: Object.keys(schema.obj),
  secret: config.get('ENCRYPTION_SECRET_KEY'),
  saltGenerator: secret => secret.slice(0, 16),
})

module.exports = defineModel('VerificationCode', schema)
