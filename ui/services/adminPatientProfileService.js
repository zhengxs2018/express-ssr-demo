/**
 * appointment api service
 */

export default class AdminPatientProfileServiceService {
  // mock
  static mockData(params) {
    console.log(params)
    return require('../data/dataAdminPatientProfile')
  }
}
