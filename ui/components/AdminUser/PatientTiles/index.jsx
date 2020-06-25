import React, { Component } from 'react'
import './styles.scss'

/**
 * patient tiles component
 */
export default class PatientTiles extends Component {
  render() {
    return (
      <div className="right-some-panel flex-grid">
        <a href="javascript:;" className="items">
          <i className="icons icon-progress" />
          <span className="blue-txt">Progress Notes</span>
        </a>
        <a href="javascript:;" className="items">
          <i className="icons icon-problem" />
          <span className="blue-txt">Problem List</span>
        </a>
        <a href="javascript:;" className="items">
          <i className="icons icon-medical" />
          <span className="blue-txt">Past Medical History</span>
        </a>
        <a href="javascript:;" className="items">
          <i className="icons icon-surgical" />
          <span className="blue-txt">Past Surgical History</span>
        </a>
        <a href="javascript:;" className="items">
          <i className="icons icon-medications" />
          <span className="blue-txt">Medications/ Allergies</span>
        </a>
        <a href="javascript:;" className="items">
          <i className="icons icon-family" />
          <span className="blue-txt">Family History</span>
        </a>
        <a href="javascript:;" className="items">
          <i className="icons icon-social" />
          <span className="blue-txt">Social History</span>
        </a>
        <a href="javascript:;" className="items">
          <i className="icons icon-vitals" />
          <span className="blue-txt">Vitals/ Physical Exam</span>
        </a>
        <a href="javascript:;" className="items">
          <i className="icons icon-sleep" />
          <span className="blue-txt">Sleep Studies</span>
        </a>
        <a href="javascript:;" className="items">
          <i className="icons icon-other-lab" />
          <span className="blue-txt">Other Labs & Tests</span>
        </a>
        <a href="javascript:;" className="items">
          <i className="icons icon-home-care" />
          <span className="blue-txt">Home Care Vendor Info</span>
        </a>
        <a href="javascript:;" className="items">
          <i className="icons icon-pap" />
          <span className="blue-txt">PAP Compliance</span>
        </a>
      </div>
    )
  }
}
