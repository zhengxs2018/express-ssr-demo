'use strict'

const { AllWebRoles } = require('../../constants/access')

module.exports = {
  prefix: '/conversations',
  endpoints: {
    '': {
      get: {
        handle: 'Conversation:search',
        roles: AllWebRoles,
      },
      post: {
        handle: 'Conversation:create',
        roles: AllWebRoles,
      },
      put: {
        handle: 'Conversation:update',
        roles: AllWebRoles,
      },
    },
    '/:id': {
      put: {
        handle: 'Conversation:get',
        roles: AllWebRoles,
      },
    },
    '/:id/reply': {
      put: {
        handle: 'Conversation:reply',
        roles: AllWebRoles,
      },
    },
    '/:id/forward': {
      put: {
        handle: 'Conversation:forward',
        roles: AllWebRoles,
      },
    },
  },
}
