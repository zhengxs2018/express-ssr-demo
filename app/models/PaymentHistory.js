const config = require('config')

const { Schema } = require('mongoose')
const omit = require('lodash/omit')

const { fieldEncryption } = require('mongoose-field-encryption')

const defineModel = require('../../database/model')

/**
 * The User schema.
 */
const schema = new Schema({
  amount: Number,
  number: String,
  reason: String,
  createdBy: String,
  format: String,
  paymentRawObj: { type: Schema.Types.Mixed },
  type: String,
  cardType: String,
  entityId: String
}, { timestamps: true })

schema.plugin(fieldEncryption, {
  fields: Object.keys(schema.obj),
  secret: config.get('ENCRYPTION_SECRET_KEY'),
  saltGenerator: secret => secret.slice(0, 16),
})

schema.final = (ret) => omit(ret, 'paymentRawObj')

module.exports = defineModel('PaymentHistory', schema)
