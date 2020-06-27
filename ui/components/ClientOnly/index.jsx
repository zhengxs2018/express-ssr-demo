import React  from 'react'

import { IS_CLIENT } from '../../services/utils'

const ClientOnly = ({ children }) => {
  if (IS_CLIENT) {
    return (<>{children}</>)
  }

  return null
}


export default ClientOnly
