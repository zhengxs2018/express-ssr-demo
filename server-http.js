'use strict'

const connectDB = require('./database/connect')

const { createApp, runApp } = require('./app/main')

connectDB()
  .then(() => runApp(createApp((req, res) => res.status(404).send('not found!'))))
  .catch(e => {
    console.error('[core] Error', e.stack || e.message)
    process.exit(1)
  })
