const omit = require('lodash/omit')

const UserRoles = {
  Physician: 'Physician',
  Patient: 'Patient',
  Technician: 'Technician',
  Secretary: 'Secretary',
  Admin: 'Admin',
}

module.exports = {
  UserRoles,
  AllRoles: Object.values(UserRoles),
  AllWebRoles: Object.values(omit(UserRoles, 'Patient')),
}
