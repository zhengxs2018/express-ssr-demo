const config = require('config')

const { Schema } = require('mongoose')

const { fieldEncryption } = require('mongoose-field-encryption')

const omit = require('lodash/omit')

const defineModel = require('../../database/model')

const AWSService = require('../services/AWS')

/**
 * The Appointment schema.
 */
const schema = new Schema(
  {
    eventId: {
      required: true,
      type: String,
      unique: true,
    },
    providerId: {
      required: true,
      type: String,
    },
    patientId: {
      required: true,
      type: String,
    },
    meetingId: {
      required: false,
      type: Number,
    },
    meetingPassword: {
      required: false,
      type: String,
    },
    patientPaid: { type: Boolean, default: false },
    startTime: { type: Date },
    description: { type: String },
    endTime: { type: Date },
    status: { type: String },
    hostJoined: { type: Boolean, default: false },
    followUp: { type: Boolean, default: false },
    returnDocuments: [
      {
        id: String,
        numberOfPage: Number,
        pages: [String],
        status: String,
        name: String,
        reason: String,
        uploadedAt: Date,
      },
    ],
  },
  { timestamps: true }
)

schema.plugin(fieldEncryption, {
  fields: [
    'eventId',
    'providerId',
    'patientId',
    'meetingId',
    'meetingPassword',
    'createdAt',
    'updatedAt',
    'startTime',
    'endTime',
    'description',
    'patientPaid',
    'status',
    'hostJoined',
    'followUp',
    'returnDocuments',
  ],
  secret: config.get('ENCRYPTION_SECRET_KEY'),
  saltGenerator: secret => secret.slice(0, 16),
})

schema.final = ret => {
  const docs = ret.returnDocuments || []
  if (docs.length === 0) return ret

  docs.forEach(f => {
    const pages = f.pages || []
    f.pages = pages.map(p => AWSService.signUrl(p))
  })

  return ret
}
module.exports = defineModel('Appointment', schema)
