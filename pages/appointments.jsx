import React from 'react'

import { UserRoles } from '../constants/access'

import ClientOnly from '../ui/components/ClientOnly'
import Authorized from '../ui/components/Authorized'

import Appointments from '../ui/containers/Appointments'

const AppointmentsPage = () => {
  return (
    <ClientOnly>
      <Authorized roles={[UserRoles.Physician]} >
        <Appointments></Appointments>
      </Authorized>
    </ClientOnly>
  )
}

export default AppointmentsPage
