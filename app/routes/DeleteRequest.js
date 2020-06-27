'use strict'

const { UserRoles, AllWebRoles } = require('../../constants/access')

module.exports = {
  prefix: '',
  endpoints: {
    '/patients/:id/files': {
      get: {
        handle: 'DeleteRequest:getPatientFiles',
        roles: [UserRoles.Admin, UserRoles.Secretary, UserRoles.Physician],
      },
    },
    '/patients/:id/downloadFiles': {
      get: {
        handle: 'DeleteRequest:downloadPatientFiles',
        roles: [UserRoles.Admin, UserRoles.Secretary, UserRoles.Physician],
      },
    },
    '/deleteRequests': {
      get: {
        handle: 'DeleteRequest:search',
        roles: [UserRoles.Admin],
      },
      post: {
        handle: 'DeleteRequest:create',
        roles: [UserRoles.Admin, UserRoles.Secretary, UserRoles.Physician],
      },
      put: {
        handle: 'DeleteRequest:update',
        roles: [UserRoles.Admin],
      },
    },
    '/deleteRequests/:id': {
      delete: {
        handle: 'DeleteRequest:remove',
        roles: [UserRoles.Admin],
      },
    },
  },
}
