/**
 * appointment api service
 */
import _ from 'lodash'
import { saveAs } from 'file-saver'
import { toast } from 'react-toastify'
import { Api } from './api'
import { LStorage } from './utils'
import { AUTH_KEY } from './authService'

const RECENTLY_KEY = 'recentlyViewedPatients'
export default class PatientService {
  /**
   * get recent view
   * @return Promise<object>
   */
  static getRecentlyPatients() {
    const auth = LStorage.getItem(AUTH_KEY, true)
    const items = LStorage.getItem(RECENTLY_KEY + auth.user.id, true, [])
    return new Promise(resolve => resolve(items))
  }

  /**
   * add recently viewed patient
   * @param patient the patient
   * @return Promise<object>
   */
  static addRecentlyPatient(patient) {
    const auth = LStorage.getItem(AUTH_KEY, true)
    const key = RECENTLY_KEY + auth.user.id
    let items = LStorage.getItem(key, true, []) || []
    const index = _.findIndex(items, i => i.id === patient.id)
    if (index >= 0) {
      items.splice(index, 1)
    }
    items = [patient].concat(items)
    LStorage.setItem(key, items)
    return new Promise(resolve => resolve(items))
  }

  static searchPatients(params) {
    return Api.get('/patients', { params })
  }

  /**
   * create meeting
   * @param patientId the patient id
   */
  static getPatient(patientId) {
    return Api.get(`/users/${patientId}`)
  }

  /**
   * update form
   * @param documentId the document id
   * @param body the body
   */
  static updateForm(documentId, body) {
    return Api.put(`/forms/${documentId}`, body)
  }

  /**
   * update profile
   * @param id the user id
   * @param profile the profile
   */
  static updateProfile(id, profile) {
    return Api.put(`/users/${id}`, profile)
  }

  /**
   * upload file
   * @param body the body
   */
  static uploadFile(body) {
    return Api.post('/files', body)
  }

  /**
   * create log
   * @param entity the entity
   */
  static createAuditLog(entity) {
    return Api.post('/auditLogs', entity)
  }

  /**
   * download audit log
   */
  static downloadAuditLog() {
    Api.get('/auditLogs/download')
      .then(rsp => {
        const blob = new Blob([rsp], { type: 'text/plain;charset=utf-8' })
        saveAs(blob, `ognomy-audit-logs-${new Date().toISOString()}.csv`)
      })
      .catch(e => {
        toast.error(e.message)
      })
  }
}
