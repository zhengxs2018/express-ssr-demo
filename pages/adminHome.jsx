import React from 'react'

import Router from 'next/router'

import { UserRoles } from '../constants/access'

import ClientOnly from '../ui/components/ClientOnly'
import Authorized from '../ui/components/Authorized'

import AdminHome from '../ui/containers/AdminHome'

const AdminHomePage = () => {
  return (
    <ClientOnly>
      <Authorized roles={[UserRoles.Admin]}>
        <AdminHome></AdminHome>
      </Authorized>
    </ClientOnly>
  )
}


export default AdminHomePage
