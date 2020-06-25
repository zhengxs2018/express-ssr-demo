'use strict'

const { UserRoles } = require('../../constants/access')

module.exports = {
  prefix: '/FAQs',
  endpoints: {
    '': {
      get: {
        handle: 'FAQ:search',
        roles: [UserRoles.Patient, UserRoles.Physician],
      },
      post: {
        handle: 'FAQ:create',
        roles: [UserRoles.Physician],
      },
    },
    '/:id': {
      get: {
        handle: 'FAQ:get',
        roles: [UserRoles.Patient, UserRoles.Physician],
      },
      put: {
        handle: 'FAQ:update',
        roles: [UserRoles.Physician],
      },
      delete: {
        handle: 'FAQ:remove',
        roles: [UserRoles.Physician],
      },
    },
  },
}
