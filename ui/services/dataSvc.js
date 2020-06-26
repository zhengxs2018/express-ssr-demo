// data service
export default class DataSvc {
  static getTeleconsultData() {
    return new Promise(resolve => {
      const data = require('../data/dataTeleconsult.json')
      resolve(data)
    })
  }
}
