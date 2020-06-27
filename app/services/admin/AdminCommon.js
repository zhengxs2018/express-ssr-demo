'use strict'

const config = require('config')

const moment = require('moment')

const includes = require('lodash/includes')

const searchEntities = require('../../../database/helpers/searchEntities')

const PWDRecord = require('../../models/PWDRecord')

/**
 * check password and send waring
 * @param userId
 */
async function checkPwd(userId) {
  const record = await searchEntities(PWDRecord, { userId }, true)
  const ret = { passwordDays: 0, isNeedChangePassword: false, isNeedWarnPassword: false }

  if (!record) {
    // await PWDRecord.create({ userId, createdAt: new Date() })
    return ret
  }

  const days = moment().diff(moment(record.createdAt), 'days')
  ret.passwordDays = days
  const leftDays = config.get('FORCE_UPDATE_PWD') - days
  if (includes(config.get('SEND_WARNING'), leftDays)) {
    ret.isNeedWarnPassword = true
  }
  if (days >= config.get('FORCE_UPDATE_PWD')) {
    ret.isNeedChangePassword = true
  }
  return ret
}

module.exports = {
  checkPwd,
}
