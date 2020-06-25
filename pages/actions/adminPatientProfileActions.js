import AdminPatientProfileService from '../services/adminPatientProfileService'

/**
 * load appointment event
 * @type {string}
 */
export const LOAD_ADMIN_PATIENT_PROFILE = 'LOAD_ADMIN_PATIENT_PROFILE'

/**
 * mock Teleconsult data
 * @returns {function(...[*]=)}
 */
const mockData = params => dispatch => {
  dispatch({ type: LOAD_ADMIN_PATIENT_PROFILE, data: AdminPatientProfileService.mockData(params) })
}
export default {
  mockData,
}
