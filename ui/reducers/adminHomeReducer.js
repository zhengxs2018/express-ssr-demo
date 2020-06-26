import { LOAD_ADMIN_HOME } from '../actions/adminHomeActions'

const defaultState = {
  items: null,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case LOAD_ADMIN_HOME:
      return {
        ...state,
        ...action.data,
      }
    default:
      return state
  }
}
