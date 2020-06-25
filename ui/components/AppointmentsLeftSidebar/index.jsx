import React, { Component } from 'react'
import './styles.scss'
import { withRouter } from 'react-router-dom'
import UserHead from '../UserHead'
import AuthService from '../../services/authService'

class AppointmentsLeftSidebar extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {}

  onLogout() {
    AuthService.cleanAuth()
    window.location = '/'
  }

  goto(url) {
    this.props.history.push(url)
  }

  render() {
    const { user } = AuthService.getAuth()
    const name = `${user.firstName} ${user.lastName}`
    const isActive = key => {
      const p = this.props.location.pathname
      return p.indexOf(key) >= 0
    }

    const activeClass = key => `btn-items ${isActive(key) ? 'current' : ''}`
    return (
      <div className="left-nav">
        <div className="navs">
          <ul>
            <li>
              <a href="javascript:;" onClick={() => this.goto('/appointments')} className={activeClass('appointments')}>
                <i className="icons icon-home" />
                <span className="txt">Home</span>
              </a>
            </li>
            <li>
              <a href="javascript:;" className={activeClass('patients')} onClick={() => this.goto('/patients')}>
                <i className="icons icon-patients" />
                <span className="txt">Patients</span>
              </a>
            </li>
            <li>
              <a href="javascript:;" className="btn-items">
                <i className="icons icon-calender" />
                <span className="txt">Calender</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="user-btn">
          <UserHead color="blue" name={name} url={user.headImg} />
        </div>
        <div className="logout" onClick={() => this.onLogout()}>
          Log out
        </div>
      </div>
    )
  }
}

AppointmentsLeftSidebar.propTypes = {}

export default withRouter(AppointmentsLeftSidebar)
