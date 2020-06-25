import { Api } from './api'

export default class ZoomSDk {
  /**
   * get sdk info
   */
  static getInfo() {
    return Api.get('zoomSdkInfo')
  }
}
