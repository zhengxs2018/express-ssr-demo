import { META } from './config'
import Login from './containers/Login'
import Appointments from './containers/Appointments'
import Teleconsult from './containers/Teleconsult'
import NylasCallback from './containers/NylasCallback'
import Patients from './containers/Patients'
import PatientDetails from './containers/Patients/details'

import AdminHome from './containers/AdminHome'
import AdminUsers from './containers/AdminUsers'
import AdminPatientProfile from './containers/AdminPatientProfile'
import AdminPhysicianProfile from './containers/AdminPhysicianProfile'
import AdminDeleteRequest from './containers/AdminDeleteRequest'

/**
 * Generate an object with all necessary fields to render a page.
 * @param {string} path - The page path
 * @param {string} title - THe page title (for SEO)
 * @param {Function} component - The component to be rendered. Containers can also be used
 * @param {string} description - The page description (for SEO) [OPTIONAL]
 * @param {string} keywords - The comma separated page keywords (for SEO) [OPTIONAL]
 * @param {boolean} isRequiredLogin is required login
 * @returns {object}
 */
const createPage = (path, title, component, description = '', keywords = '', isRequiredLogin = true) => ({
  path,
  title: `${title} | ${META.PAGE_TITLE_SUFFIX}`,
  description: description || META.PAGE_DESCRIPTION,
  keywords: keywords || META.PAGE_KEYWORDS,
  component,
  isRequiredLogin,
})

export default [
  createPage('/', 'Login', Login, 'Login', 'Ognomy login', false),
  createPage('/appointments', 'Appointments', Appointments),
  createPage('/patients/:id', 'Appointments', PatientDetails),
  createPage('/patients', 'Patients', Patients),
  createPage('/nylasCallback', 'NylasCallback', NylasCallback),
  createPage('/teleconsult/:appointmentId', 'Teleconsult', Teleconsult),

  createPage('/adminHome', 'AdminHome', AdminHome),
  createPage('/adminUsers', 'AdminUsers', AdminUsers),
  createPage('/adminPatientProfile', 'AdminPatientProfile', AdminPatientProfile),
  createPage('/adminPhysicianProfile/:type', 'AdminPhysicianProfile', AdminPhysicianProfile),
  createPage('/adminDeleteRequest', 'AdminDeleteRequest', AdminDeleteRequest),
]
