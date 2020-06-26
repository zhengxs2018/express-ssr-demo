import { LOAD_ADMIN_USERS } from '../actions/adminUsersActions'

const defaultState = {
  items: null,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case LOAD_ADMIN_USERS:
      return {
        ...state,
        ...action.data,
      }
    default:
      return state
  }
}
