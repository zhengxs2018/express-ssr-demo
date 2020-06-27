import React from 'react'

import { UserRoles } from '../constants/access'

import ClientOnly from '../ui/components/ClientOnly'
import Authorized from '../ui/components/Authorized'

import AdminDeleteRequest from '../ui/containers/AdminDeleteRequest'

const AdminDeleteRequestPage = () => {
  return (
    <ClientOnly>
      <Authorized roles={[UserRoles.Admin]} >
        <AdminDeleteRequest></AdminDeleteRequest>
      </Authorized>
    </ClientOnly>
  )
}

export default AdminDeleteRequestPage
