'use strict'
/**
 * Processing before application startup
 */
const { join } = require('path')
const { writeFileSync } = require('fs')

// hack: support promise middleware
require('express-async-errors')

const mkdirp = require('mkdirp')

const Joi = require('joi')

Joi.id = () => Joi.optionalId().required()

// email is case insensitive, so lowercase it
Joi.email = () =>
  Joi.string()
    .email()
    .lowercase()

const env = process.env.NODE_ENV || 'development'

// dirs
const rootDir = __dirname

const runDir = join(rootDir, './run')
const logDir = join(rootDir, './run/logs')

const publicDir = join(rootDir, './public')
const uploadDir = join(publicDir, './uploads')

// Override
process.env.ROOT_DIR = rootDir
process.env.RUN_DIR = runDir
process.env.LOG_DIR = logDir
process.env.PUBLIC_DIR = publicDir
process.env.UPLOAD_DIR = uploadDir
// process.env.NODE_CONFIG_DIR = join(rootDir, 'node/config')

// Make dirs
mkdirp.sync(runDir)
mkdirp.sync(logDir)
mkdirp.sync(publicDir)
mkdirp.sync(uploadDir)

// Save config data
writeFileSync(join(runDir, 'application_config.json'), JSON.stringify(require('config'), null, 2), 'utf8')

const configMeta = { env }
writeFileSync(join(runDir, 'application_config_meta.json'), JSON.stringify(configMeta, null, 2), 'utf8')
