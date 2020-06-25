/**
 * appointment api service
 */
import { Api } from './api'

export default class AppointmentService {
  static getAppointments(params) {
    return Api.get('/appointments', { params })
  }

  /**
   * create meeting
   * @param appointmentId the appointment id
   * @param entity the post entity
   */
  static createMeeting(appointmentId, entity) {
    return Api.post(`/meetings?appointmentId=${appointmentId}`, entity)
  }

  /**
   * end appointment
   * @param appointmentId the appointment
   */
  static endAppointment(appointmentId) {
    return Api.put(`appointments/${appointmentId}/complete`)
  }

  /**
   * join or leave zoom
   * @param appointmentId the appointment id
   * @param type the type
   */
  static joinOrLeave(appointmentId, type) {
    return Api.put(`appointments/${appointmentId}/joinOrLeave?type=${type}`)
  }

  /**
   * delete appointment
   * @param id the appointment id
   */
  static deleteAppointment(id) {
    return Api.delete(`appointments/${id}`)
  }

  /**
   * get follow up appointments
   * @param patientId the patient id
   */
  static getFollowUp(patientId) {
    return Api.get(`/appointments/followUp?patientId=${patientId}`)
  }

  /**
   * update returning document
   * @param appointmentId the appointment id
   * @param entity the entity
   */
  static updateReturnDocumentPage(appointmentId, entity) {
    return Api.put(`appointments/${appointmentId}/updateReturnDocumentPage`, entity)
  }

  // mock
  static mockData() {
    return require('../data/dataAppointments')
  }

  // mock
  static mockTeleconsultData() {
    return require('../data/dataTeleconsult')
  }
}
