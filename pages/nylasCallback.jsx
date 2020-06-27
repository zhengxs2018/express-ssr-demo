import React from 'react'

import { UserRoles } from '../constants/access'

import ClientOnly from '../ui/components/ClientOnly'
import Authorized from '../ui/components/Authorized'

import NylasCallback from '../ui/containers/NylasCallback'

const NylasCallbackPage = () => {
  return (
    <ClientOnly>
      <Authorized roles={[UserRoles.Physician]}>
        <NylasCallback></NylasCallback>
      </Authorized>
    </ClientOnly>
  )
}

export default NylasCallbackPage
