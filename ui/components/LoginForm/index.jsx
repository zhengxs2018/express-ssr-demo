import React, { Component } from 'react'
import './styles.scss'
import { toast } from 'react-toastify'
import AuthService, { AUTH_KEY } from '../../services/authService'
import { LStorage, NYLAS_RESULT } from '../../services/utils'

class LoginForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showErrorText: false,
      showEmailError: false,
      showPasswordError: false,
      selectedValue: {
        emailAddress: '',
        password: '',
      },
      errorMsg: '',
      showDialog: false,
      dialogMode: 'nylas',
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.clickLogin = this.clickLogin.bind(this)
    this.tickerHandler = null
  }

  componentWillUnmount() {
    this.clearTicker()
  }

  // handle input change
  handleInputChange = name => event => {
    this.state.selectedValue[name] = event.target.value
    this.setState({
      selectedValue: this.state.selectedValue,
    })
  }

  gotobindNylas() {
    this.setState({ showDialog: true, dialogMode: 'nylas' })
  }

  openBindPage() {
    const auth = this.auth
    AuthService.getNylasUrl(auth.user?.id, auth.token)
      .then(rsp => {
        LStorage.removeItem(NYLAS_RESULT)
        window.open(rsp.url)
        this.nylasTicker()
      })
      .catch(e => toast.error(e.message))
  }

  nylasTicker() {
    this.clearTicker()
    this.tickerHandler = setInterval(() => {
      // nylas callback
      if (LStorage.getItem(NYLAS_RESULT) === 'true') {
        this.clearTicker()
        this.setState({ showDialog: false })
        LStorage.removeItem(NYLAS_RESULT)
        this.clickLogin()
      }
    }, 200)
  }

  clearTicker() {
    if (this.tickerHandler) {
      clearInterval(this.tickerHandler)
    }
    this.tickerHandler = null
  }

  gotoBindZoom() {
    AuthService.bindZoom(this.auth.token)
      .then(rsp => {
        if (!rsp.isNew) {
          this.clickLogin()
        } else {
          if (this.showMessageNext) {
            toast.error('You did not finish bind for zoom meeting.')
            this.showMessageNext = false
          }
          if (this.showResendMsgNext) {
            toast.success('Resend email successful')
            this.showResendMsgNext = false
          }
          this.setState({ showDialog: true, dialogMode: 'zoom' })
        }
      })
      .catch(e => toast.error(e.message))
  }

  checkUserStatus(rsp) {
    this.auth = rsp
    if (!rsp?.user?.bindNylas) {
      this.gotobindNylas(rsp)
      return false
    }

    if (!rsp?.user?.bindZoom && rsp?.user?.isZoomBusiness) {
      this.gotoBindZoom()
      return false
    }
    return true
  }

  // click Login
  clickLogin() {
    let pass = true

    if (
      this.state.selectedValue.emailAddress.trim() === '' ||
      !this.checkMail(this.state.selectedValue.emailAddress.trim())
    ) {
      pass = false

      this.setState({
        showErrorText: false,
        showEmailError: true,
      })
    } else {
      this.setState({
        showErrorText: false,
        showEmailError: false,
      })
    }

    if (this.state.selectedValue.password.trim() === '') {
      pass = false

      this.setState({
        showErrorText: false,
        showPasswordError: true,
      })
    } else {
      this.setState({
        showErrorText: false,
        showPasswordError: false,
      })
    }

    if (pass) {
      AuthService.login({
        email: this.state.selectedValue.emailAddress,
        password: this.state.selectedValue.password,
      })
        .then(rsp => {
          if (!this.checkUserStatus(rsp)) {
            return
          }
          LStorage.setItem(AUTH_KEY, rsp)
          this.setState({
            showErrorText: false,
            showEmailError: false,
            showPasswordError: false,
          })
          this.props.history.push('/appointments')
        })
        .catch(err => {
          this.setState({
            errorMsg: err.message,
            showErrorText: true,
            showEmailError: true,
            showPasswordError: true,
          })
        })
    }
  }

  checkMail(mail) {
    const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    if (filter.test(mail)) return true

    return false
  }

  render() {
    const { dialogMode } = this.state
    const onKeyDown = e => e.key === 'Enter' && this.clickLogin()

    const renderNylas = () => (
      <div className="dialog-container">
        {/* eslint-disable-next-line no-undef */}
        <div className="title">Bind Nylas</div>
        <div className="description">We need access to your calendar, do you want to bind Nylas api now?</div>
        <div className="buttons">
          <a href="javascript:;" className="btn btn-blue btn-sure" onClick={() => this.openBindPage()}>
            Sure
          </a>
          <a
            href="javascript:;"
            className="btn btn-blue btn-cancel"
            onClick={() => {
              this.setState({ showDialog: false })
              AuthService.cleanAuth()
            }}>
            No, I don't want
          </a>
        </div>
      </div>
    )

    const renderZoom = () => (
      <div className="dialog-container">
        {/* eslint-disable-next-line no-undef */}
        <div className="title">Bind Zoom Meeting</div>
        <div className="description">We already send an email to you, please follow guide bind zoom meeting.</div>
        <div className="buttons">
          <a
            href="javascript:;"
            className="btn btn-blue btn-sure"
            onClick={() => {
              this.showMessageNext = true
              this.clickLogin()
            }}>
            I completed bind
          </a>
          <a
            href="javascript:;"
            className="btn btn-blue btn-cancel"
            onClick={() => {
              this.showResendMsgNext = true
              this.gotoBindZoom()
            }}>
            Resend
          </a>
        </div>
      </div>
    )

    return (
      <div className="login-form">
        {!!this.state.showErrorText && <div className="error-txt">{this.state.errorMsg}</div>}
        <div className={`inputs icon-lefts ${this.state.showEmailError ? 'error' : ''}`}>
          <i className="icons icon-email" />
          <input
            type="email"
            placeholder="Email Address"
            value={this.state.selectedValue.emailAddress}
            onKeyDown={onKeyDown}
            onChange={this.handleInputChange('emailAddress')}
          />
        </div>
        <div className={`inputs icon-lefts mb11 ${this.state.showPasswordError ? 'error' : ''}`}>
          <i className="icons icon-password" />
          <input
            type="password"
            placeholder="Password"
            onKeyDown={onKeyDown}
            value={this.state.selectedValue.password}
            onChange={this.handleInputChange('password')}
          />
        </div>
        <a className="btn btn-blue" onClick={this.clickLogin}>
          Log in
        </a>

        {this.state.showDialog && (dialogMode === 'zoom' ? renderZoom() : renderNylas())}
      </div>
    )
  }
}

export default LoginForm
