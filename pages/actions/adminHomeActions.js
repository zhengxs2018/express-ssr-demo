import AdminHomeService from '../services/adminHomeService'

/**
 * load appointment event
 * @type {string}
 */
export const LOAD_ADMIN_HOME = 'LOAD_ADMIN_HOME'

/**
 * mock Teleconsult data
 * @returns {function(...[*]=)}
 */
const mockData = () => dispatch => {
  dispatch({ type: LOAD_ADMIN_HOME, data: AdminHomeService.mockData() })
}
export default {
  mockData,
}
