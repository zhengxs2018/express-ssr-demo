/**
 * Production configuration file
 */

module.exports = {
  LOGGING: {
    level: process.env.LOG_LEVEL || 'error',
  },
}
