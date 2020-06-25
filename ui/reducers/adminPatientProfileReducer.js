import { LOAD_ADMIN_PATIENT_PROFILE } from '../actions/adminPatientProfileActions'

const defaultState = {
  items: null,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case LOAD_ADMIN_PATIENT_PROFILE:
      return {
        ...state,
        ...action.data,
      }
    default:
      return state
  }
}
