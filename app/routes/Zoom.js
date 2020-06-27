'use strict'

const { UserRoles } = require('../../constants/access')

module.exports = {
  prefix: '',
  endpoints: {
    '/meetings': {
      post: {
        handle: 'Zoom:createMeeting',
        roles: [UserRoles.Physician],
      },
    },
    '/bindZoom': {
      get: {
        handle: 'Zoom:bindZoom',
        roles: [UserRoles.Physician],
      },
    },
    '/zoomSdkInfo': {
      get: {
        handle: 'Zoom:getZoomSdkInfo',
        roles: [UserRoles.Physician, UserRoles.Patient],
      },
    },
  },
}
