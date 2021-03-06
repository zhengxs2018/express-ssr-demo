'use strict'

const { join } = require('path')
const { parse } = require('url')

const next = require('next')

const { createApp, runApp } = require('./app/main')
const connectDB = require('./database/connect')

const ssr = next({
  dev: process.env.NODE_ENV !== 'production',
})

function renderer() {
  const handle = ssr.getRequestHandler()
  return (req, res) => handle(req, res, parse(req.url, true))
}

connectDB()
  .then(() => Promise.all([ssr.prepare(), runApp(createApp(renderer))]))
  .catch(e => {
    console.error('[core] Error', e.stack || e.message)
    process.exit(1)
  })
