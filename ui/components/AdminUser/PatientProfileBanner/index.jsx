import React, { Component } from 'react'
import PT from 'prop-types'
import './styles.scss'

/**
 * PatientProfileBanner component
 */
export default class PatientProfileBanner extends Component {
  render() {
    const { data } = this.props

    return (
      <div className="left-patient-profile">
        <div className="top-area">
          <a href="javascript:;" className="icons icon-edit" />
          <div className="top-photo">
            <img src={data.photoUrl} alt="img" />
          </div>
          <div className="name">{data.name}</div>
          <div className="sleep-txt">{data.category}</div>
          <div className="time-txt">
            {data.treatment}
            <div className="days-txt">{data.daysLeft} days into treatment</div>
          </div>
        </div>
        <div className="bottom-gray">
          <div className="items">
            <i className="icons icon-home" />
            <span className="txt">{data.address}</span>
          </div>
          <div className="items">
            <i className="icons icon-mail" />
            <span className="txt">{data.email}</span>
          </div>
          <div className="items">
            <i className="icons icon-phone" />
            <span className="txt">{data.phone}</span>
          </div>
        </div>
      </div>
    )
  }
}

PatientProfileBanner.propTypes = {
  data: PT.object,
}
