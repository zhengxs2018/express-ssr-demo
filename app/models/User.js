const config = require('config')

const { Schema } = require('mongoose')

const { fieldEncryption } = require('mongoose-field-encryption')
const { isEmail } = require('validator')

const omit = require('lodash/omit')

const defineModel = require('../../database/model')

/**
 * The User schema.
 */
const schema = new Schema(
  {
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
    firstName: {
      required: false,
      type: String,
    },
    headUrl: { type: String },
    phone: { type: String },
    gender: { type: String },
    dateOfBirth: { type: String },
    uid: Number,
    lastName: {
      required: false,
      type: String,
    },
    passwordHash: {
      required: true,
      type: String,
    },
    nylasAccessToken: {
      required: false,
      type: String,
    },
    nylasCalendarId: { type: String },
    address: String,
    city: String,
    state: String,
    zipcode: String,
    zoomUserId: { type: String },
    appointmentFee: { type: Number, default: 0 },
    providerInfo: {
      timeZone: { type: String, default: 'America/New_York' },
      qualifications: {
        required: false,
        type: [String],
      },
      biography: {
        required: false,
        type: String,
      },
    },
    chatbotProgress: {
      sheepa: { type: Number },
      sheepaFinished: { type: Boolean },
      sheepaTime: { type: Date },
    },
    creditCards: [
      {
        number: { type: String },
        expired: { type: String },
        name: { type: String },
        type: { type: String },
        paymentMethod: { type: String },
      },
    ],
    insuranceCards: [
      {
        insuranceCarrier: { type: String },
        planNumber: { type: String },
        insuredName: { type: String },
        insuredID: { type: String },
        effectiveDate: { type: String },
        relationship: { type: String },
        dateOfBirth: { type: String },
        frontPhoto: { type: String },
        backPhoto: { type: String },
      },
    ],
    roles: {
      required: true,
      type: [String],
    },
    // String value for isProvider is used for providers searching
    isProvider: {
      required: true,
      type: String,
      default: false,
    },
    paymentCustomerId: String,
    deleted: Boolean,
    createdBy: String,
    updatedBy: String,
  },
  { timestamps: true }
)

schema.index({ email: 1 })
schema.index({ role: 1 })

schema.plugin(fieldEncryption, {
  fields: Object.keys(schema.obj),
  secret: config.get('ENCRYPTION_SECRET_KEY'),
  saltGenerator: secret => secret.slice(0, 16),
})

schema.final = ret => {
  const awsService = require('../services/AWS')
  ret.headUrl = awsService.signUrl(ret.headUrl)
  ret.insuranceCards = (ret.insuranceCards || []).map(v => {
    v.frontPhoto = awsService.signUrl(v.frontPhoto)
    v.backPhoto = awsService.signUrl(v.backPhoto)
    return v
  })
  ret.appointmentFee = Math.ceil(ret.appointmentFee || 0)
  return omit(ret, 'passwordHash')
}

module.exports = defineModel('User', schema)
