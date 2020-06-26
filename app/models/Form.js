const config = require('config')

const { Schema } = require('mongoose')

const { fieldEncryption } = require('mongoose-field-encryption')

const { signUrl } = require('../services/AWS')
const defineModel = require('../../database/model')

/**
 * The Form schema.
 */
const schema = new Schema(
  {
    userId: String,
    type: String,
    forms: [
      {
        name: String,
        id: String,
        numberOfPage: Number,
        pages: [String],
        status: String,
        reason: String,
        uploadedAt: Date,
        updatedAt: Date,
      },
    ],
  },
  { timestamps: true }
)

schema.plugin(fieldEncryption, {
  fields: Object.keys(schema.obj),
  secret: config.get('ENCRYPTION_SECRET_KEY'),
  saltGenerator: secret => secret.slice(0, 16),
})

schema.final = ret => {
  const forms = ret.forms || []
  if (forms.length === 0) return ret

  forms.forEach(f => {
    const pages = f.pages || []
    console.log(pages)
    // f.pages = pages.map(p => signUrl(p))
  })

  return ret
}

module.exports = defineModel('Form', schema)
