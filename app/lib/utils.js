'use strict'

const { existsSync, statSync } = require('fs')

const config = require('config')

const { hash, compare } = require('bcryptjs')

/**
 * This function is responsible of hashing the password test.
 *
 * @param {String} text the text to hash
 * @returns {String} the hashed string
 */
function hashPassword(text) {
  return hash(text, config.get('PASSWORD_HASH_SALT_LENGTH'))
}

/**
 * Validate that the hash is actually the hashed value of plain text
 *
 * @param {String} password   the password to validate
 * @param {String} hash   the hash to validate
 * @returns {Boolean} whether the password hash is valid
 */
async function validatePasswordHash(password, hash) {
  return compare(password, hash)
}

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

function isZoomBusiness() {
  return config.get('ZOOM_BUSINESS_LICENSE')
}

module.exports = {
  hashPassword,
  validatePasswordHash,

  isString,
  isFile,
  isNodeModule,
  isNpmPackage,
  isZoomBusiness,
}
