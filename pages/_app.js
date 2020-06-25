import 'babel-polyfill'
import 'whatwg-fetch'
import React from 'react'
import Head from 'next/head'
import App from 'next/app'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { Route, BrowserRouter, Redirect } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import _ from 'lodash'
import allReducers from '../ui/reducers'
import routes from '../ui/routes'
import AuthService from '../ui/services/authService'

import '../ui/styles/styles.scss'
import 'react-toastify/dist/ReactToastify.css'
import 'nprogress/nprogress.css'

const middlewares = [thunk]
// Only use the redux-logger middleware in development
if (process.env.NODE_ENV === 'development') {
  middlewares.push(createLogger())
}
const store = createStore(allReducers, applyMiddleware(...middlewares))

// Helpe function that reders single route
const renderRoute = (route, props) => {
  const auth = AuthService.getAuth()
  if (route.isRequiredLogin && (_.isEmpty(auth) || _.isNil(auth) || _.isNil(auth.token))) {
    return <Redirect {...props} to={{ pathname: '/' }} />
  }
  window.scrollTo(0, 0) // Reset scroll to top

  return <route.component routeParams={props.match.params} />
}

// Helper function that create all routes
const createRoutes = () =>
  routes.map(route => <Route exact key={route.path} path={route.path} component={props => renderRoute(route, props)} />)

window.addEventListener('popstate', event => {
  // clear zoom when click back
  // if (!event.state && window.document.getElementById('zmmtg-root')) {
  //   window.document.body.style.display = 'none'
  //   window.location.reload()
  // }
})

class MyApp extends App {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <React.Fragment>
            {createRoutes()}
            <ToastContainer position="top-right" />
          </React.Fragment>
        </BrowserRouter>
      </Provider>
    )
  }
}

export default MyApp
