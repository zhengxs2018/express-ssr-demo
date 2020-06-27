import React from 'react'
import Router from 'next/router'

import size from 'lodash/size'
import isNil from 'lodash/isNil'
import isFunction from 'lodash/isFunction'
import intersection from 'lodash/intersection'

import AuthService from '../../services/authService'

const Unauthorized = ({ message }) => {
  return <div>{message}</div>
}

const Authorized = ({ children, roles, fallback }) => {
  const user = AuthService.getUser()

  if (isNil(user)) {
    const content = isFunction(fallback) && fallback(false)

    if (!content) {
      Router.replace({
        pathname: '/login',
        query: { next: location.href },
      })
    }
    return content || <Unauthorized message="Current is not allowed for anonymous user" />
  }

  if (size(roles) > 0 && intersection(user.roles || [], roles).length > 0) {
    return <>{children}</>
  }

  return (
    (isFunction(fallback) && fallback(true, user)) || (
      <Unauthorized message="You do not have permission to view this content." />
    )
  )
}

export default Authorized
