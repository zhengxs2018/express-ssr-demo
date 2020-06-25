'use strict'

const { readFileSync } = require('fs')

const config = require('config')
const debug = require('debug')('server')

module.exports = {
  createServer,
  createHttpsServer,
}

function isEnableSSL() {
  return config.has('SSL.enable') && config.get('SSL.enable')
}

function createServer(requestListener) {
  const server = isEnableSSL() ? createHttpsServer(requestListener) : require('http').createServer(requestListener)

  server.on('listening', onListening)
  server.on('error', onError)

  return server
}

function createHttpsServer(requestListener) {
  const options = {
    cert: readFileSync(config.get('SSL.certificate')),
    key: readFileSync(config.get('SSL.certificateKey')),
  }
  return require('https').createServer(options, requestListener)
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = this.address()
  if (typeof addr === 'string') {
    console.log('Listening on pipe' + addr)
  } else {
    console.log(`Listen on http${isEnableSSL() ? 's' : ''}://127.0.0.1:${addr.port}`)
  }
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}
