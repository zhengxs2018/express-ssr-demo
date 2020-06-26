'use strict'

const { AllWebRoles } = require('../../constants/access')

module.exports = {
  prefix: '/patientProgressNotes',
  endpoints: {
    '': {
      get: {
        handle: 'PatientProgressNote:search',
        roles: AllWebRoles,
      },
      post: {
        handle: 'PatientProgressNote:create',
        roles: AllWebRoles,
      },
    },
    '/:id': {
      put: {
        handle: 'PatientProgressNote:update',
        roles: AllWebRoles,
      },
      delete: {
        handle: 'PatientProgressNote:remove',
        roles: AllWebRoles,
      },
    },
  },
}
