import { LOAD_PATIENTS, LOAD_RECENTLY_PATIENTS } from '../actions/patientActions'

const defaultState = {
  patientPage: null,
  recently: null,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case LOAD_PATIENTS:
      return {
        ...state,
        patientPage: action.data,
      }
    case LOAD_RECENTLY_PATIENTS:
      return { ...state, recently: action.data }
    default:
      return state
  }
}
