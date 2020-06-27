import React from 'react'

import Router from 'next/router'

import AuthService from '../ui/services/authService'
import ClientOnly from '../ui/components/ClientOnly'
import Authorized from '../ui/components/Authorized'

import { UserRoles } from '../constants/access'

function Home() {
  const user = AuthService.getUser()
  if (user.roles.includes(UserRoles.Admin)) {
    Router.replace('/adminHome')
  } else {
    Router.replace('/appointments')
  }

  return <div>Loading..</div>
}

function Welcome() {
  return (
    <ClientOnly>
      <Authorized roles={[UserRoles.Admin, UserRoles.Physician]}>
        <Home></Home>
      </Authorized>
    </ClientOnly>
  )
}

export default Welcome
