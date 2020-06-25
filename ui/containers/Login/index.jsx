import React, { Component } from 'react'
import LoginForm from '../../components/LoginForm'
import LoginBanner from '../../components/LoginBanner'
import './styles.scss'

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      openLoginBanner: true,
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="login-boxs">
          <div className="login-top">
            <div className="login-img">
              <img src="icon-logo.png" alt="img" />
            </div>
          </div>
          <LoginForm />

          <LoginBanner
            openLoginBanner={this.state.openLoginBanner}
            clickClose={() => this.setState({ openLoginBanner: false })}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default Login
