import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './styles.scss'
import UserHead from '../UserHead'

class ConsultationRightSidebar extends Component {
  render() {
    const { appointment } = this.props
    return (
      <div className="right-area">
        <div className="user-top">
          <div className="user-photo">
            <UserHead url={appointment.raw.patient.headUrl} name={appointment.name} color="blue" fontSize={24} />
          </div>
          <a href="javascript:;" className="user-name">
            {appointment.name}
          </a>
          <p className="txt bold">{appointment.raw.description || 'treatment'}</p>
        </div>
        <div className="four-panel">
          <a href="javascript:;" className="items">
            <i className="icons icon-discharge" />
            <span className="txt">Discharge Summary</span>
          </a>
          <a href="javascript:;" className="items">
            <i className="icons icon-patient" />
            <span className="txt">Patient Forms</span>
          </a>
          <a href="javascript:;" className="items">
            <i className="icons icon-take" />
            <span className="txt">Take Notes</span>
          </a>
          <a href="javascript:;" className="items">
            <i className="icons icon-prescribe" />
            <span className="txt">Prescribe</span>
          </a>
        </div>
        <a href="javascript:;" className="btn btn-blue">
          ORDERS
        </a>
        <div className="right-bottom flex-grid">
          <div className="left-txt">Having technical issues?</div>
          <a href="javascript:;" className="blue-links">
            Get Help
          </a>
        </div>
      </div>
    )
  }
}

ConsultationRightSidebar.propTypes = {
  appointment: PropTypes.object,
}

export default ConsultationRightSidebar
