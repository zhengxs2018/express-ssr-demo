import React  from 'react'

const ClientOnly = ({ children }) => {
  if (typeof window === 'object') {

    console.log(children)
    return (<>{children}</>)
  }

  return null
}


export default ClientOnly
