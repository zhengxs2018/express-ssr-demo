import React from 'react'

import { UserRoles } from '../constants/access'

import ClientOnly from '../ui/components/ClientOnly'
import Authorized from '../ui/components/Authorized'

import AdminUsers from '../ui/containers/AdminUsers'

const AdminUsersPage = () => {
  return (
    <ClientOnly>
      <Authorized roles={[UserRoles.Admin]}>
        <AdminUsers></AdminUsers>
      </Authorized>
    </ClientOnly>
  )
}

export default AdminUsersPage
