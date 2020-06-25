import AdminPhysicianProfileService from '../services/adminPhysicianProfileService'

/**
 * load appointment event
 * @type {string}
 */
export const LOAD_ADMIN_PHYSICIAN_PROFILE = 'LOAD_ADMIN_PHYSICIAN_PROFILE'

/**
 * mock Teleconsult data
 * @returns {function(...[*]=)}
 */
const mockData = () => dispatch => {
  dispatch({ type: LOAD_ADMIN_PHYSICIAN_PROFILE, data: AdminPhysicianProfileService.mockData() })
}
export default {
  mockData,
}
