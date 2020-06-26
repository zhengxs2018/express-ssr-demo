const config = require('config')

const omit = require('lodash/omit')

const { model } = require('mongoose')

/**
 * define model
 * @param modelName the model name
 * @returns {*}
 */
module.exports = function defineModel(modelName, schema) {
  const Model = model(modelName, schema)

  Model.schema.options.minimize = false

  Model.schema.options.toJSON = {
    transform: (doc, ret) => {
      if (ret._id) {
        ret.id = String(ret._id)
        delete ret._id
      }
      const final = omit(
        ret,
        Object.keys(ret).filter(k => k.indexOf('__') === 0)
      )
      return schema.final ? schema.final(final) : final
    },
  }

  return Model
}
