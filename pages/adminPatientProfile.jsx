import React from 'react'

import { UserRoles } from '../constants/access'

import ClientOnly from '../ui/components/ClientOnly'
import Authorized from '../ui/components/Authorized'

import AdminPatientProfile from '../ui/containers/AdminPatientProfile'

const AdminPatientProfilePage = () => {
  return (
    <ClientOnly>
      <Authorized roles={[UserRoles.Admin]}>
        <AdminPatientProfile></AdminPatientProfile>
      </Authorized>
    </ClientOnly>
  )
}

export default AdminPatientProfilePage
