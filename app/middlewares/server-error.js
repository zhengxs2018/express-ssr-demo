const logger = require('../lib/logger')

module.exports = function errorHandler() {
  if (process.env.NODE_ENV === 'development') {
    return function(err, req, res, next) {
      console.error(err.stack || err.message)
      logger.error(`[${req.method}] ${req.url} ${err.message}`)
      res.status(500).send(err.stack || err.message)
    }
  }

  return function(err, req, res, next) {
    logger.error(`[${req.method}] ${req.url} ${err.message}`)
    res.status(500).send('Internal server error')
  }
}
