import * as types from '../constants/actionTypes'

const defaultState = {
  db: {},
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case types.LOAD_DATA:
      return {
        ...state,
        db: action.data,
      }
    default:
      return state
  }
}
