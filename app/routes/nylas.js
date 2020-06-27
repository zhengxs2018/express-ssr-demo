'use strict'

const { UserRoles } = require('../../constants/access')

module.exports = {
  prefix: '/nylas',
  endpoints: {
    '/authenticationUrl': {
      get: {
        handle: 'NylasOauth:getAuthenticationUrl',
        roles: [UserRoles.Physician],
      },
    },
    '/oauth/callback': {
      get: 'NylasOauth:exchangeCodeForToken',
    },
  },
}
