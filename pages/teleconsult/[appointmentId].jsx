import React from 'react'

import { UserRoles } from '../../constants/access'

import ClientOnly from '../../ui/components/ClientOnly'
import Authorized from '../../ui/components/Authorized'

import Teleconsult from '../../ui/containers/Teleconsult'

const TeleconsultPage = () => {
  return (
    <ClientOnly>
      <Authorized roles={[UserRoles.Physician]} >
        <Teleconsult></Teleconsult>
      </Authorized>
    </ClientOnly>
  )
}

export default TeleconsultPage
