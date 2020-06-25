import React, { Component } from 'react'
import PT from 'prop-types'
import './styles.scss'

/**
 * quick links component
 */
export default class QuickLinks extends Component {
  render() {
    const { data, patientFormsSelected } = this.props

    return (
      <div className="quick-link-section">
        <div className="section-title">Quick Links</div>
        <div className="links-list flex">
          <div className="gray-items">
            <i className="icons icon-required" />
            <div className="bottom-txt">
              <div className="blue-txt">Required Items</div>
              {data.pendingNumber !== 0 && <div className="red-txt">{data.pendingNumber} Pending</div>}
            </div>
          </div>
          <div className="gray-items">
            <i className="icons icon-patient-edu" />
            <div className="bottom-txt">
              <div className="blue-txt">Patient Education</div>
            </div>
          </div>
          <div className="gray-items">
            <i className="icons icon-push" />
            <div className="bottom-txt">
              <div className="blue-txt">Push Notifications</div>
            </div>
          </div>
          <div className="gray-items">
            <i className="icons icon-insurance" />
            <div className="bottom-txt">
              <div className="blue-txt">Insurance & Billing</div>
            </div>
          </div>
          <div className="gray-items">
            <i className="icons icon-audio" />
            <div className="bottom-txt">
              <div className="blue-txt">Audio Archive</div>
            </div>
          </div>
          <div
            className={`gray-items ${patientFormsSelected ? 'current' : ''}`}
            onClick={() => this.props.selectPatientForms(true)}>
            <i className="icons icon-patient" />
            <div className="bottom-txt">
              <div className="blue-txt">Patient Forms</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

QuickLinks.propTypes = {
  data: PT.object,
}
