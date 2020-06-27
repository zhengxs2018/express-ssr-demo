'use strict'

const { UserRoles } = require('../../constants/access')

module.exports = {
  prefix: '/forms',
  endpoints: {
    '': {
      get: {
        handle: 'Form:get',
        roles: [UserRoles.Patient],
      },
    },
    '/:formId': {
      put: {
        handle: 'Form:update',
        roles: [UserRoles.Physician],
      },
    },
    '/:formId/uploadPage': {
      post: {
        handle: 'Form:uploadPage',
        roles: [UserRoles.Patient],
      },
    },
  },
}
