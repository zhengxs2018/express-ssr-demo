import _ from 'lodash'
import moment from 'moment'

import isNil from 'lodash/isNil'

import { BOD_FORMAT } from '../config'

/**
 * active appointment key
 */
export const LS_ACTIVE_APPOINTMENT = 'LS_ACTIVE_APPOINTMENT'

export const NYLAS_RESULT = 'NYLAS_RESULT'

export const IS_CLIENT = typeof window === 'object'

const store = {
  get(key) {},
  set(key, value){},
  remove(key){}
}

if (IS_CLIENT && window.localStorage) {
  const localStorage = window.localStorage

  store.get = key => localStorage.getItem(key)
  store.set = (key, value) => localStorage.setItem(key, value)
  store.remove = (key) => localStorage.removeItem(key)
}

/**
 * local storage warp
 */
export class LStorage {
  /**
   * set item
   * @param key the key
   * @param value the value
   */
  static setItem(key, value) {
    if (isNil(value)) return store.remove(key)
    return void store.set(key, JSON.stringify(value))
  }

  /**
   * get item by key
   * @param key the key
   * @param isObject is object value
   * @param defaultValue the default value
   * @returns {string|any|{}}
   */
  static getItem(key, isObject = false, defaultValue = {}) {
    const value = store.get(key)
    if (isObject) {
      try {
        return JSON.parse(value.trim()) || defaultValue
      } catch (e) {
        return defaultValue
      }
    }

    return v
  }

  /**
   * remove item
   * @param key the key
   */
  static removeItem(key) {
    return void store.remove(key)
  }
}

/**
 * pad 0
 * @param num the number
 * @param size the length
 */
export const pad = (num, size) => {
  let s = _.isNil(num) ? '' : `${num}`
  while (s.length < (size || 2)) {
    s = `0${s}`
  }
  return s
}

/**
 * get user name
 * @param user the user name
 * @return {string|*}
 */
export const getName = user => {
  const name = _.filter([user?.firstName, user?.lastName], v => (v || '').trim().length > 0).join(' ')
  if ((name || '').trim().length === 0) {
    return user?.email
  }
  return name
}

/**
 * get user id
 * @param uid
 * @return {string|string}
 */
export const getUid = uid => pad(uid, 9)

/**
 * get full address
 * @param user the user
 */
export const getFullAdd = user =>
  [user?.address, user?.city, user?.state, user?.zipcode]
    .filter(v => (v || '').toString().trim().length > 0)
    .join(', ') || 'N/A'

/**
 * get gender and age
 * @param user the user
 */
export const getGenderAndAge = user => {
  let age = null
  if (user?.dateOfBirth) {
    age = `${-moment(user?.dateOfBirth, BOD_FORMAT).diff(moment(), 'years')} years old`
  }

  return [user?.gender, age].filter(v => (v || '').trim().length > 0).join(', ') || 'N/A'
}

/**
 * get gender and date of birth
 * @param user the user
 */
export const getGenderAndDoB = user =>
  [user?.gender, user?.dateOfBirth].filter(v => (v || '').trim().length > 0).join(', ') || 'N/A'

/**
 * get card type
 * @param card the card obj
 */
export const getCreditCardIcon = card => {
  const type = card.type
  switch (type) {
    case 'Visa':
      return '/patient-assets/visa@3x.png'
    case 'Mastercard':
      return '/patient-assets/mc@3x.png'
    case 'American Express':
      return '/patient-assets/ae@3x.png'
    case 'Discover':
      return '/patient-assets/discover@3x.png'
    default:
      return null
  }
}

/**
 * get hide card number
 * @param n the number
 * @return {string}
 */
export const getHideCardNumber = n => `XXXX-XXXX-XXXX-${n.substr(n.length - 4, 4)}`

/**
 * get random string
 * @param len the length
 * @param chars the chars
 * @return {string}
 */
export const randomStr = (len, chars) => {
  const newLen = len || 32
  const $chars = chars || 'abcdefhijkmnprstwxyz0123456789'
  const maxPos = $chars.length
  let pwd = ''
  for (let i = 0; i < newLen; i += 1) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

/**
 * check appointment is cancelable
 * @param e the appointment
 * @return {boolean}
 */
export const checkIsCanCancel = e => {
  // paid cannot cancel
  if (e.patientPaid) {
    return false
  }
  // already going, cannot cancel
  return e.status === 'upcoming'
}
