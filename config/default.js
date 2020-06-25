'use strict'

const toInteger = require('lodash/toInteger')

module.exports = {
  // The data encryption key
  ENCRYPTION_SECRET_KEY: process.env.ENCRYPTION_SECRET_KEY || 'TIME_SLOT_OUTPUT_TIME_FORMAT',

  // it is configured to be empty currently, but may add prefix like '/api/v1'
  API_PREFIX: process.env.API_PREFIX || '',

  // json web token
  JWT_SECRET: process.env.JWT_SECRET || 's3cret',

  // Database settings
  DATABASE: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ognomy',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  LOGGING: {
    level: process.env.LOG_LEVEL || 'debug',
  },

  // https
  SSL: {
    enable: false,
  },

  LISTEN: {
    host: process.env.HOST || '0.0.0.0',
    port: toInteger(process.env.PORT || 8080),
  },
}
