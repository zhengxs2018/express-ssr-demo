/**
 * update patient new forms
 */
const logger = require('../app/lib/logger')

const connectDB = require('../database/connect')
const searchEntities = require('../database/helpers/searchEntities')

const metadata = require('../assets/patient-forms/metadata.json')

async function updatePatientNewForms() {
  const Form = require('../app/models/Form')

  const documents = await searchEntities(Form, {})

  logger.info('start update patients new form, count = ' + documents.length)

  for (let i = 0; i < documents.length; i++) {
    const document = documents[i]
    if (document.type && document.type !== 'newForms') {
      continue
    }

    let forms = document.forms
    forms = forms.filter(f => _.findIndex(metadata, i => i.id === f.id) >= 0)
    for (let j = 0; j < metadata.length; j++) {
      const item = metadata[j]
      const form = forms.find(f => f.id === item.id)
      if (!form) {
        forms.push({ ...item, pages: [], status: constants.FormFileStatus.missing })
      } else {
        form.numberOfPage = item.numberOfPage
        form.name = item.name
      }
    }
    await document.save()
  }
}

connectDB()
  .then(updatePatientNewForms)
  .then(() => {
    logger.info('update patients forms finished')
    process.exit()
  })
  .catch(e => {
    logger.logFullError(e)
    process.exit(1)
  })
