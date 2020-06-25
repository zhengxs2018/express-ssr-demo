const config = require('config')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

mongoose.set('useCreateIndex', true)

module.exports = function connect() {
  const uri = config.get('DATABASE.uri')
  const options = config.get('DATABASE.options')
  return mongoose.connect(uri, options)
}
