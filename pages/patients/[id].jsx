import React from 'react'

import { UserRoles } from '../../constants/access'

import ClientOnly from '../../ui/components/ClientOnly'
import Authorized from '../../ui/components/Authorized'

import PatientDetails from '../../ui/containers/Patients/details'

const PatientDetailsPage = () => {
  return (
    <ClientOnly>
      <Authorized roles={[UserRoles.Physician]}>
        <PatientDetails></PatientDetails>
      </Authorized>
    </ClientOnly>
  )
}

export default PatientDetailsPage
