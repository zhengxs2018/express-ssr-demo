import React from 'react'

import Router from 'next/router'

import ClientOnly from '../ui/components/ClientOnly'
import Authorized from '../ui/components/Authorized'

import AdminHome from '../ui/containers/AdminHome'

import { UserRoles } from '../constants/access'

const AdminHomePage = () => {
  const fallback = (isLogged) => {
    if (!isLogged) Router.replace('/login')
  }

  return (
    <ClientOnly>
      <Authorized roles={[UserRoles.Admin]} fallback={fallback}>
        <AdminHome></AdminHome>
      </Authorized>
    </ClientOnly>
  )
}


export default AdminHomePage
