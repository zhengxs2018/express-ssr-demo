import React, { Component } from 'react'
import './styles.scss'

/**
 * tab bar component
 */
export default class LoginBanner extends Component {
  render() {
    return (
      <div>
        {this.props.openLoginBanner && (
          <div className="login-banner">
            <div className="descript-mains">
              <div className="title">Notice</div>

              <div className="description">
                Warning: This system is restricted to authorized users for business/medical purposes only. Unauthorized
                access or use is a violation of company policy and the law. This system may be monitored for
                administrative and security reasons;
              </div>

              <div className="sub-title">By proceeding, you acknowledge that:</div>

              <ul>
                <li>1.You have read and understand this notice</li>
                <li>2.You consent to the system monitoring</li>
              </ul>

              <a href="javascript:;" className="btn btn-blue" onClick={this.props.clickClose}>
                I acknowledge
              </a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

LoginBanner.propTypes = {}
