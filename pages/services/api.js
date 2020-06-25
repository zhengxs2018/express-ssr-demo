import axios from 'axios'
import nprogress from 'nprogress'
import _ from 'lodash'
import { SERVER_URL } from '../config'

/**
 * new http/s request instance
 */
const apiInstance = axios.create({
  baseURL: SERVER_URL,
})

/**
 * inject token
 */
apiInstance.interceptors.request.use(
  config => {
    nprogress.start()
    const authService = require('../services/authService').default
    const token = config.headers.token
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${authService.getJwtToken() || token}`
    return config
  },
  () => {
    nprogress.done()
    return Promise.reject(new Error('Api request create failed'))
  }
)

/**
 * interceptor errors
 */
apiInstance.interceptors.response.use(
  rsp => {
    nprogress.done()
    return rsp.data
  },
  error => {
    nprogress.done()
    let errMsg = 'Cannot request to api server'
    if (error.response && error.response.data && error.response.data.message) {
      const message = error.response.data.message
      if (_.isArray(message)) {
        errMsg = message[0].message
      } else {
        errMsg = error.response.data.message
      }

      // goto 401 if not login
      if (error.response.status === 401 && window.location.pathname !== '/') {
        const authService = require('../services/authService').default
        authService.cleanAuth()
        window.location = '/'
        return Promise.resolve()
      }
    }
    return Promise.reject(new Error(errMsg))
  }
)

export const Api = apiInstance
