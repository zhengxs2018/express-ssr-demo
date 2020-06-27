import React from 'react'

import { UserRoles } from '../../constants/access'

import ClientOnly from '../../ui/components/ClientOnly'
import Authorized from '../../ui/components/Authorized'

import AdminPhysicianProfile from '../../ui/containers/AdminPhysicianProfile'

const AdminPhysicianProfilePage = () => {
  return (
    <ClientOnly>
      <Authorized roles={[UserRoles.Admin]} >
        <AdminPhysicianProfile></AdminPhysicianProfile>
      </Authorized>
    </ClientOnly>
  )
}

export default AdminPhysicianProfilePage
