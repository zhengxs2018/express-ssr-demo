'use strict'

const { AllWebRoles } = require('../../constants/access')

module.exports = {
  prefix: '/userGroups',
  endpoints: {
    '': {
      get: {
        handle: 'UserGroup:search',
        roles: AllWebRoles,
      },
      post: {
        handle: 'UserGroup:create',
        roles: AllWebRoles,
      },
    },
    '/:id': {
      put: {
        handle: 'UserGroup:update',
        roles: AllWebRoles,
      },
      delete: {
        handle: 'UserGroup:remove',
        roles: AllWebRoles,
      },
    },
  },
}
