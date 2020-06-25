'use strict'

const { resolve, extname } = require('path')
const { readdirSync } = require('fs')

const config = require('config')
const { isNil } = require('lodash')

const debug = require('debug')('router')

const { createModuleExportsLoader } = require('./lib/loaders')
const auth = require('./middlewares/auth')

const { AllRoles } = require('../constants/access')

const API_PREFIX = config.has('API_PREFIX') ? config.get('API_PREFIX') : ''

const viewFunc = createModuleExportsLoader(resolve(__dirname, './controllers'))

function createRouter(app) {
  for (const { prefix = '', endpoints } of findRoutesConfig()) {
    for (const [path, methods] of Object.entries(endpoints)) {
      for (const [method, handle] of Object.entries(methods)) {
        const route = {
          path: `${API_PREFIX}${prefix}${path}`.trim(),
          verb: method.toLowerCase(),
          public: false,
          roles: [],
        }

        // { get: 'FAQ:search' } | { get: (req, res) => void }
        if (typeof handle === 'string' || typeof handle === 'function') {
          route.handle = typeof handle === 'function' ? handle : viewFunc(handle)
          route.public = true
          route.roles = ['anonymous']
        } else if (handle !== null && typeof handle === 'object') {
          const roles = handle.roles || AllRoles

          route.roles = roles
          route.handle = viewFunc(handle.handle)
          route.public = isNil(handle.public) ? roles.length === 0 : handle.public
        }

        if (typeof route.handle !== 'function') {
          throw new Error(`No controller defined for route ${route.path}`)
        }

        // Add url rule
        if (route.public) {
          app[route.verb](route.path, route.handle)
        } else {
          const controllerName = route.handle.name
          const signature = (req, res, next) => {
            req.signature = `${controllerName}#${method}`
            return next()
          }

          app[route.verb](route.path, signature, auth(route.roles), route.handle)
        }

        debug(`endpoint: ${route.verb} [${route.roles}] - ${route.path}`)
      }
    }
  }
}

function* findRoutesConfig() {
  const baseDir = resolve(__dirname, './routes')

  for (const filename of readdirSync(baseDir)) {
    // Skip ".back" files.
    if (filename.indexOf('_') === 0 || extname(filename) === '.back') {
      continue
    }

    yield require(resolve(baseDir, filename))
  }
}

module.exports = { createRouter }
