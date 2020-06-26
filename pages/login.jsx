
import ClientOnly from '../ui/components/ClientOnly'

import Login from '../ui/containers/Login/index'

const LoginPage = () => {
  return (
    <ClientOnly>
      <Login></Login>
    </ClientOnly>
  )
}

export default LoginPage
