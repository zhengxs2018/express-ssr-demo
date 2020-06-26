'use strict'

const { UserRoles } = require('../../constants/access')

module.exports = {
  prefix: '',
  endpoints: {
    '/payments': {
      post: {
        handle: 'Payment:create',
        roles: [UserRoles.Patient, UserRoles.Physician],
      },
      get: {
        handle: 'Payment:search',
        roles: [UserRoles.Patient, UserRoles.Physician],
      },
    },
  },
}
