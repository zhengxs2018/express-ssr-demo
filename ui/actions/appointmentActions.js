import { toast } from 'react-toastify'
import AppointmentService from '../../ui/services/appointmentService'

/**
 * load appointment event
 * @type {string}
 */
export const LOAD_APPOINTMENTS = 'LOAD_APPOINTMENTS'

/**
 * get appointments
 * @param params the query params
 * @param callback the callback
 * @returns {function(...[*]=)}
 */
const getAppointments = (params, callback) => dispatch => {
  AppointmentService.getAppointments(params || {})
    .then(items => {
      dispatch({ type: LOAD_APPOINTMENTS, data: { items } })
      if (callback) {
        callback()
      }
    })
    .catch(e => toast.error(e.message))
}

/**
 * mock data
 * @returns {function(...[*]=)}
 */
const mockData = () => dispatch => {
  dispatch({ type: LOAD_APPOINTMENTS, data: AppointmentService.mockData() })
}

/**
 * mock Teleconsult data
 * @returns {function(...[*]=)}
 */
const getTeleconsultData = () => dispatch => {
  dispatch({ type: LOAD_APPOINTMENTS, data: AppointmentService.mockTeleconsultData() })
}
export default {
  mockData,
  getTeleconsultData,
  getAppointments,
}
