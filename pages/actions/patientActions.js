import { toast } from 'react-toastify'
import PatientService from '../services/patientService'

/**
 * load patients
 * @type {string}
 */
export const LOAD_PATIENTS = 'LOAD_PATIENTS'
export const LOAD_RECENTLY_PATIENTS = 'LOAD_RECENTLY_PATIENTS'

/**
 * get patients
 * @param params the query params
 * @returns {function(...[*]=)}
 */
const searchPatients = params => dispatch => {
  PatientService.searchPatients(params)
    .then(page => {
      dispatch({ type: LOAD_PATIENTS, data: page })
    })
    .catch(e => toast.error(e.message))
}

/**
 * clear page
 */
const clearPatients = () => dispatch => {
  dispatch({ type: LOAD_PATIENTS, data: null })
}

/**
 * add recently view patient
 * @param patient the patient
 * @return {function(...[*]=)}
 */
const addRecentlyViewPatient = patient => dispatch => {
  PatientService.addRecentlyPatient(patient)
    .then(items => {
      dispatch({ type: LOAD_RECENTLY_PATIENTS, data: items })
    })
    .catch(e => toast.error(e.message))
}

/**
 * get recently viewed patients
 * @return {function(...[*]=)}
 */
const getRecentlyViewed = () => dispatch => {
  PatientService.getRecentlyPatients()
    .then(items => {
      dispatch({ type: LOAD_RECENTLY_PATIENTS, data: items })
    })
    .catch(e => toast.error(e.message))
}
export default {
  searchPatients,
  addRecentlyViewPatient,
  getRecentlyViewed,
  clearPatients,
}
