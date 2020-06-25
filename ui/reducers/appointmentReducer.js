import { LOAD_APPOINTMENTS } from '../actions/appointmentActions'

const defaultState = {
  items: null,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case LOAD_APPOINTMENTS:
      return {
        ...state,
        ...action.data,
      }
    default:
      return state
  }
}
