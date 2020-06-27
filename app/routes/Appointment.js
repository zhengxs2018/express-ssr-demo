'use strict'

const { UserRoles } = require('../../constants/access')

module.exports = {
  prefix: '/appointments',
  endpoints: {
    '': {
      post: {
        handle: 'Appointment:createAppointment',
        roles: [UserRoles.Patient, UserRoles.Physician, UserRoles.Admin, UserRoles.Physician],
      },
      get: {
        handle: 'Appointment:getAppointments',
        roles: [UserRoles.Patient, UserRoles.Physician, UserRoles.Admin, UserRoles.Physician],
      },
    },
    '/followUp': {
      get: {
        handle: 'Appointment:getFollowUpAppointments',
        roles: [UserRoles.Physician],
      },
    },
    '/:appointmentId': {
      get: {
        handle: 'Appointment:getAppointment',
        roles: [UserRoles.Patient, UserRoles.Physician, UserRoles.Admin, UserRoles.Physician],
      },
      delete: {
        handle: 'Appointment:deleteAppointment',
        roles: [UserRoles.Patient, UserRoles.Physician, UserRoles.Admin, UserRoles.Physician],
      },
      put: {
        handle: 'Appointment:updateAppointment',
        roles: [UserRoles.Patient, UserRoles.Physician, UserRoles.Admin, UserRoles.Physician],
      },
    },
    '/:appointmentId/updateReturnDocumentPage': {
      put: {
        handle: 'Appointment:updateReturnDocumentPage',
        roles: [UserRoles.Patient, UserRoles.Physician],
      },
    },
    '/:appointmentId/uploadReturnDocumentPage': {
      post: {
        handle: 'Appointment:uploadReturnDocumentPage',
        roles: [UserRoles.Patient, UserRoles.Physician],
      },
    },
    '/:appointmentId/complete': {
      put: {
        handle: 'Appointment:completedAppointment',
        roles: [UserRoles.Physician],
      },
    },
    '/:appointmentId/joinOrLeave': {
      put: {
        handle: 'Appointment:joinOrLeave',
        roles: [UserRoles.Physician],
      },
    },
  },
}
