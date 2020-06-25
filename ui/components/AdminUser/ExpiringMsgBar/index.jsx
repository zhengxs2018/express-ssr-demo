import React, { Component } from 'react'
import PT from 'prop-types'
import './styles.scss'

/**
 * expiring msg bar component
 */
export default class ExpiringMsgBar extends Component {
  render() {
    const { expiringDays } = this.props

    return (
      <div className="expiring-msg-bar">
        <div className="txt">
          Your password is expiring in {expiringDays} days, please update your password now or you won't be able to
          login once it expires.
        </div>
      </div>
    )
  }
}

ExpiringMsgBar.propTypes = {
  expiringDays: PT.number,
}
