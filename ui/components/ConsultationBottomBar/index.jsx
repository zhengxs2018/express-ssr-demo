import React, { Component } from 'react'
import './styles.scss'

class ConsultationBottomBar extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <div className="bottom-navs">
        <ul>
          <li>
            <a href="javascript:;" className="btn-items">
              <i className="icons icon-progress" />
              <span className="txt">Progress Notes</span>
            </a>
          </li>
          <li>
            <a href="javascript:;" className="btn-items">
              <i className="icons icon-problem" />
              <span className="txt">Problem List</span>
            </a>
          </li>
          <li>
            <a href="javascript:;" className="btn-items">
              <i className="icons icon-medical" />
              <span className="txt">Past Medical History</span>
            </a>
          </li>
          <li>
            <a href="javascript:;" className="btn-items">
              <i className="icons icon-surgical" />
              <span className="txt">Past Surgical History</span>
            </a>
          </li>
          <li>
            <a href="javascript:;" className="btn-items">
              <i className="icons icon-medications" />
              <span className="txt">Medications/ Allergies</span>
            </a>
          </li>
          <li>
            <a href="javascript:;" className="btn-items">
              <i className="icons icon-fhistory" />
              <span className="txt">Family History</span>
            </a>
          </li>
          <li>
            <a href="javascript:;" className="btn-items">
              <i className="icons icon-social" />
              <span className="txt">Social History</span>
            </a>
          </li>
          <li>
            <a href="javascript:;" className="btn-items">
              <i className="icons icon-vitals" />
              <span className="txt">Vitals/ Physical Exam</span>
            </a>
          </li>
          <li>
            <a href="javascript:;" className="btn-items">
              <i className="icons icon-sleep" />
              <span className="txt">Sleep Studies</span>
            </a>
          </li>
          <li>
            <a href="javascript:;" className="btn-items">
              <i className="icons icon-other-labs" />
              <span className="txt">Other Labs & Tests</span>
            </a>
          </li>
          <li>
            <a href="javascript:;" className="btn-items">
              <i className="icons icon-home-care" />
              <span className="txt">Home Care Vendor Info</span>
            </a>
          </li>
          <li>
            <a href="javascript:;" className="btn-items">
              <i className="icons icon-pap" />
              <span className="txt">PAP Compliance</span>
            </a>
          </li>
        </ul>
      </div>
    )
  }
}

export default ConsultationBottomBar
