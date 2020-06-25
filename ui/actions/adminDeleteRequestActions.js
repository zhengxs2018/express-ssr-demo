import AdminDeleteRequestService from '../../ui/services/adminDeleteRequestService'

/**
 * load appointment event
 * @type {string}
 */
export const LOAD_ADMIN_DELETE_REQUEST = 'LOAD_ADMIN_DELETE_REQUEST'

/**
 * mock Teleconsult data
 * @returns {function(...[*]=)}
 */
const mockData = () => dispatch => {
  dispatch({ type: LOAD_ADMIN_DELETE_REQUEST, data: AdminDeleteRequestService.mockData() })
}
export default {
  mockData,
}
