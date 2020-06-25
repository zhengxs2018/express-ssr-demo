import * as types from '../constants/actionTypes'
import dataSvc from '../services/dataSvc'

// loads Data
export function loadData(data) {
  return { type: types.LOAD_DATA, data }
}

// get Teleconsult data
export function getTeleconsultData() {
  return function func(dispatch) {
    // fetches remote data
    dataSvc
      .getTeleconsultData()
      .then(data => {
        // load data
        dispatch(loadData(data))
      })
      .catch(error => {
        throw error
      })
  }
}

export default {
  getTeleconsultData,
}
