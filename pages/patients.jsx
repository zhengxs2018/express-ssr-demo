import React from 'react'

import { UserRoles } from '../constants/access'

import ClientOnly from '../ui/components/ClientOnly'
import Authorized from '../ui/components/Authorized'

import Patients from '../ui/containers/Patients'

const PatientsPage = () => {
  return (
    <ClientOnly>
      <Authorized roles={[UserRoles.Physician]} >
        <Patients></Patients>
      </Authorized>
    </ClientOnly>
  )
}

export default PatientsPage
