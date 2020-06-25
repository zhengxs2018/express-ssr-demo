'use strict'

const { join } = require('path')
const { createWriteStream } = require('fs')

const config = require('config')

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const multer = require('multer')

const clientErrorHandler = require('./middlewares/client-error')
const errorHandler = require('./middlewares/server-error')

const { createServer } = require('./lib/http')

const { createRouter } = require('./router')

function createApp(fallback) {
  const app = express()
  const upload = multer({
    storage: process.env.uploadDir,
    limits: { fieldSize: 25 * 1024 * 1024 },
  })

  const logger = morgan('common', {
    stream: createWriteStream(join(process.env.LOG_DIR, 'access.log'), { flags: 'a' }),
    skip: (_, res) => res.statusCode < 400,
  })

  app.use(cors())
  app.use(logger)
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(upload.any())

  // Add routes
  createRouter(app)

  // ssr render
  app.get('*', fallback(app))

  // error handler
  app.use(clientErrorHandler())
  app.use(errorHandler())

  return app
}

function runApp(app) {
  createServer(app).listen(config.get('LISTEN'))
}

module.exports = {
  createApp,
  runApp,
}
