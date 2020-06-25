'use strict'

const { existsSync, statSync } = require('fs')

function isString(value) {
  return typeof value === 'string'
}

function isFile(value) {
  return isString(value) && existsSync(value) && statSync(value).isFile()
}

function isNodeModule(value) {
  try {
    return isString(value) && isString(require.resolve(value))
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') return false
    throw e
  }
}

function isNpmPackage(value) {
  // Only module names are supported
  return isNodeModule(value) && isNodeModule(`${value}/package.json`)
}

module.exports = {
  isString,
  isFile,
  isNodeModule,
  isNpmPackage,
}
