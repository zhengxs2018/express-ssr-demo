import React, { Component } from 'react'
import Router, { withRouter } from 'next/router'

import UserHead from '../UserHead'

import AuthService from '../../services/authService'

import './styles.scss'

class AdminLeftSidebar extends Component {
  constructor(props) {
    super(props)

    const user = AuthService.getUser()

    this.state = {
      name: `${user?.firstName} ${user?.lastName}`,
      user,
    }
  }

  onLogout() {
    AuthService.cleanAuth()
    window.location = '/'
  }

  goto(url) {
    Router.push(url)
  }

  render() {
    const { name, user } = this.state
    const isActive = key => {
      const p = this.props.router.pathname
      return p.indexOf(key) >= 0
    }
    const activeClass = key => `btn-items ${isActive(key) ? 'current' : ''}`
    return (
      <div className="left-nav">
        <div className="navs">
          <ul>
            <li>
              <a href="javascript:;" onClick={() => this.goto('/adminHome')} className={activeClass('adminHome')}>
                <i className="icons icon-home" />
                <span className="txt">Home</span>
              </a>
            </li>
            <li>
              <a href="javascript:;" className={activeClass('adminUsers')} onClick={() => this.goto('/adminUsers')}>
                <i className="icons icon-users" />
                <span className="txt">Users</span>
              </a>
            </li>
            <li>
              <a href="javascript:;" className="btn-items">
                <i className="icons icon-calender" />
                <span className="txt">Calender</span>
              </a>
            </li>
            <li>
              <a href="javascript:;" className="btn-items">
                <i className="icons icon-tracking" />
                <span className="txt">Tracking</span>
              </a>
            </li>
            <li>
              <a href="javascript:;" className="btn-items">
                <i className="icons icon-settings" />
                <span className="txt">Settings</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="user-btn">
          <UserHead color="blue" name={name} url={user?.headImg} />
        </div>
        <div className="logout" onClick={() => this.onLogout()}>
          Log out
        </div>
      </div>
    )
  }
}

AdminLeftSidebar.propTypes = {}

export default withRouter(AdminLeftSidebar)
