import { Api } from './api'
import { LStorage } from './utils'

export const AUTH_KEY = 'O_AUTH_KEY'

export const ROLES = {
  Physician: 'Physician',
}
/**
 * auth service, include cache user
 */
export default class AuthService {
  /**
   * login api
   */
  static login(entity) {
    return Api.post('/login', entity).then(rsp => {
      if (rsp.user?.roles.includes(ROLES.Physician)) {
        return rsp
      }
      throw new Error('Only physicians (providers) can login to the web portal')
    })
  }

  /**
   * get jwt token
   * @returns {Object.value|CancelToken}
   */
  static getJwtToken() {
    return this.getAuth().token
  }

  /**
   * clear auth
   */
  static cleanAuth() {
    LStorage.removeItem(AUTH_KEY)
  }

  /**
   * get auth object
   * @returns {string|any|{}}
   */
  static getAuth() {
    return LStorage.getItem(AUTH_KEY, true)
  }

  /**
   * get nylas url
   * @param userId the user id
   * @param token the token
   */
  static getNylasUrl(userId, token) {
    return Api.get(`nylas/authenticationUrl?id=${userId}&callback=${window.location}nylasCallback`, {
      headers: { token },
    })
  }

  /**
   * bind zoom
   * @param token the token
   */
  static bindZoom(token) {
    return Api.get('bindZoom', {
      headers: { token },
    })
  }
}
