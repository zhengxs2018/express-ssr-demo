'use strict'

const { UserRoles } = require('../../constants/access')

module.exports = {
  prefix: '/auditLogs',
  endpoints: {
    '': {
      get: {
        handle: 'AuditLog:search',
        roles: [UserRoles.Admin],
      },
      post: {
        handle: 'AuditLog:create',
        roles: [UserRoles.Admin, UserRoles.Physician],
      },
    },
    '/download': {
      get: {
        handle: 'AuditLog:download',
        roles: [UserRoles.Admin],
      },
    },
  },
}
