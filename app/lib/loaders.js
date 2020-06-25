'use strict'

const { resolve } = require('path')

const get = require('lodash/get')

const { isNodeModule } = require('./utils')

/** Get module exports
 *
 * @param {String} base  module base path
 *
 * @example
 *
 * const controllerLoader = controllerLoader('controller', app)
 *
 * const me = controllerLoader('user/me:*')
 *
 * const getMe = controllerLoader('user/me:getMe')
 */
function createModuleExportsLoader(dir, seq = ':') {
  const base = resolve(__dirname, '..', dir)

  return value => {
    const [path, methodName = '*'] = value.split(seq)
    const target = isNodeModule(path) ? require(path) : require(resolve(base, path))

    if (methodName === '*') {
      // todo: Compatible with ES module?
      return target.__esModule && target.default ? target.default : target
    }

    return get(target, methodName)
  }
}

module.exports = {
  createModuleExportsLoader,
}
