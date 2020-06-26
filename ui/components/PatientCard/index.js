import React, { Component } from 'react'
import PT from 'prop-types'
import './styles.scss'
import { getName, getUid } from '../../services/utils'
import UserHead from '../UserHead'

/**
 * user head component
 */
export default class PatientCard extends Component {
  render() {
    const { user, onClick } = this.props
    return (
      <div className="patient-card">
        <div className="first-line">
          <div className="user-name" onClick={() => onClick(user)}>
            {getName(user)}
          </div>
          <div className="user-head">
            <UserHead name={getName(user)} color="blue" url={user?.headUrl} />
          </div>
        </div>
        <div className="flex1" />
        <div className="uid">{getUid(user?.uid)}</div>
        <div className="t-tip">{user?.treatmentTip}</div>
      </div>
    )
  }
}

PatientCard.propTypes = {
  user: PT.any,
  onClick: PT.func,
}
