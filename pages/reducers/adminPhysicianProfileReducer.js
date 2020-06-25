import { LOAD_ADMIN_PHYSICIAN_PROFILE } from '../actions/adminPhysicianProfileActions'

const defaultState = {
  items: null,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case LOAD_ADMIN_PHYSICIAN_PROFILE:
      return {
        ...state,
        ...action.data,
      }
    default:
      return state
  }
}
