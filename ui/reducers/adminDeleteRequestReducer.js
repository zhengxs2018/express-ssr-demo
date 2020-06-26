import { LOAD_ADMIN_DELETE_REQUEST } from '../actions/adminDeleteRequestActions'

const defaultState = {
  items: null,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case LOAD_ADMIN_DELETE_REQUEST:
      return {
        ...state,
        ...action.data,
      }
    default:
      return state
  }
}
