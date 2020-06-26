import React, { Component } from 'react'
import PT from 'prop-types'
import './styles.scss'

/**
 * physician upcoming appointment component
 */
export default class PhysicianUpcomingAppointment extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      shownUpcomingAppointmentNumber: 4,
    }
  }

  viewMore() {
    this.setState({
      shownUpcomingAppointmentNumber: this.props.data.length,
    })
  }

  render() {
    const { data } = this.props

    const { shownUpcomingAppointmentNumber } = this.state

    return (
      <div className="panel-list upcomimg-list">
        <div className="section-title flex-grid">
          Upcoming Appointment
          <a href="javascript:;" className="blue-link">
            View Calendar
          </a>
        </div>
        <div className="five-panel flex-grid recently-view">
          {this.props.data.slice(0, shownUpcomingAppointmentNumber).map((item, index) => (
            <div className="item-wrap" key={index}>
              <div className="items">
                <div className="top-area flex-grid">
                  <div className="names">{item.name}</div>
                  <div className="right-img">
                    <a href="javascript:;">
                      <img src={item.photoUrl} alt="img" />
                    </a>
                  </div>
                </div>
                <div className="txt">
                  <div className="today-txt">{item.date}</div>
                  <div className="time">{item.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {shownUpcomingAppointmentNumber < data.length && (
          <div className="bottom-link">
            <a href="javascript:;" className="blue-link" onClick={() => this.viewMore()}>
              View More
            </a>
          </div>
        )}
      </div>
    )
  }
}

PhysicianUpcomingAppointment.propTypes = {
  data: PT.array,
}
