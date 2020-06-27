'use strict'

const { UserRoles } = require('../../constants/access')

module.exports = {
  prefix: '',
  endpoints: {
    '/providers/:id/schedules': {
      get: {
        handle: 'Availability:getSchedule',
        roles: [UserRoles.Physician, UserRoles.Admin, UserRoles.Secretary],
      },
      put: {
        handle: 'Availability:updateSchedule',
        roles: [UserRoles.Physician, UserRoles.Admin, UserRoles.Secretary],
      },
    },
    '/availability': {
      get: {
        handle: 'Availability:getProviderSchedule',
        roles: [UserRoles.Patient, UserRoles.Physician],
      },
    },
  },
}
