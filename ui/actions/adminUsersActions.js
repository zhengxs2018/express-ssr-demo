import AdminUsersService from '../../ui/services/adminUsersService'

/**
 * load appointment event
 * @type {string}
 */
export const LOAD_ADMIN_USERS = 'LOAD_ADMIN_USERS'

/**
 * mock Teleconsult data
 * @returns {function(...[*]=)}
 */
const mockData = () => dispatch => {
  dispatch({ type: LOAD_ADMIN_USERS, data: AdminUsersService.mockData() })
}
export default {
  mockData,
}
