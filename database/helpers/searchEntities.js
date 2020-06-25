const each = require('lodash/each')

/**
 * Searches the entities in the database using the specified criteria
 *
 * @param {Object} Model The model in which to search
 * @param {Object} criteria The search criteria
 * @param onlyOne only return one
 * @returns the list of Model entities matching the given criteria
 */
async function searchEntities(Model, criteria, onlyOne) {
  // create a Model instance with encrypted fields
  const exampleModel = new Model(criteria)
  exampleModel.encryptFieldsSync()

  // construct the encrypted search criteria
  const encryptedCriteria = {}

  each(Object.keys(criteria), key => {
    encryptedCriteria[key] = exampleModel[key]
  })

  if (onlyOne) {
    return Model.findOne(encryptedCriteria)
  }
  // search the entities matching the given criteria
  return Model.find(encryptedCriteria)
}

module.exports = searchEntities
