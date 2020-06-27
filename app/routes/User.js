'use strict'

const { UserRoles, AllWebRoles } = require('../../constants/access')

module.exports = {
  prefix: '',
  endpoints: {
    '/me': {
      get: {
        handle: 'User:me',
        roles: [UserRoles.Patient, UserRoles.Physician],
      },
    },
    '/adminDashboard': {
      get: {
        handle: 'User:adminDashboard',
        roles: [UserRoles.Admin],
      },
    },
    '/systemStatus': {
      get: 'User:systemStatus',
    },
    '/updatePassword': {
      put: 'User:updatePassword',
    },
    '/newUser': {
      post: {
        handle: 'User:newUser',
        roles: [UserRoles.Admin],
      },
    },
    '/users/:id/newPassword': {
      put: {
        handle: 'User:newPassword',
        roles: [UserRoles.Admin],
      },
    },
    '/myProgress': {
      get: {
        handle: 'User:myProgress',
        roles: [UserRoles.Patient, UserRoles.Physician],
      },
    },
    '/users': {
      get: {
        handle: 'User:searchUser',
        roles: AllWebRoles,
      },
    },
    '/users/:id': {
      put: {
        handle: 'User:updateProfile',
        roles: [UserRoles.Patient, UserRoles.Physician],
      },
      get: {
        handle: 'User:get',
        roles: [UserRoles.Physician],
      },
      delete: {
        handle: 'User:removeUser',
        roles: [UserRoles.Admin],
      },
    },
    '/files': {
      post: {
        handle: 'User:createFiles',
        roles: AllWebRoles,
      },
    },
    '/files/:id': {
      get: {
        handle: 'User:getFile',
        public: true,
      },
    },
    '/providers': {
      get: {
        handle: 'User:listAllProviders',
        roles: [UserRoles.Patient, UserRoles.Physician],
      },
    },
    '/patients': {
      get: {
        handle: 'User:listAllPatients',
        roles: [UserRoles.Physician],
      },
    },
  },
}
