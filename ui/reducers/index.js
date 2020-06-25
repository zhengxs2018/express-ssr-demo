import { combineReducers } from 'redux'
import appointmentReducer from './appointmentReducer'
import patientReducer from './patientReducer'
import adminHomeReducer from './adminHomeReducer'
import adminDeleteRequestReducer from './adminDeleteRequestReducer'
import adminUsersReducer from './adminUsersReducer'
import adminPatientProfileReducer from './adminPatientProfileReducer'
import adminPhysicianProfileReducer from './adminPhysicianProfileReducer'

const allReducers = combineReducers({
  appointmentReducer,
  patientReducer,
  adminHomeReducer,
  adminDeleteRequestReducer,
  adminUsersReducer,
  adminPatientProfileReducer,
  adminPhysicianProfileReducer,
})

export default allReducers
