import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './styles.scss'
import '../AppointmentsRightSidebar/styles.scss'
import moment from 'moment'

class PatientDetailsRightSidebar extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const { notes } = this.props

    return (
      <div className="right-aside right-aside-patient">
        <div className="add-items borders">
          <div className="title-bar flex-grid">
            <div className="left-title">Notes</div>
            <a href="javascript:;" className="icons icon-add" />
          </div>
          <div className="note-list">
            {notes.map((item, index) => (
              <div className="line-items" key={index}>
                <div className="left-part">
                  <div className="text">{item.content}</div>
                  <div className="date">{moment(item.createdAt).format('MMM DD YYYY')}</div>
                </div>
                <div className="right-part">
                  <img src="/patient-assets/more-vertical.svg" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="second-part">
          <img src="/patient-assets/chart-demo-img.png" />
        </div>
      </div>
    )
  }
}

PatientDetailsRightSidebar.propTypes = {
  notes: PropTypes.array,
}

export default PatientDetailsRightSidebar
