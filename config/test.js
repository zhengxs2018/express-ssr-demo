/**
 * Configuration file used during tests
 */
module.exports = {
  LOGGING: {
    level: 'debug',
  },

  // Database settings
  DATABASE: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ognomy-test',
  },
}
