import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import { toast } from 'react-toastify'
import { withRouter } from 'react-router-dom'
import appointmentActions from '../../actions/appointmentActions'
import AppointmentsLeftSidebar from '../../components/AppointmentsLeftSidebar'
import UpcomingSession from '../../components/UpcomingSession'
import RecentSessions from '../../components/RecentSessions'
import AppointmentsRightSidebar from '../../components/AppointmentsRightSidebar'
import './styles.scss'
import AuthService from '../../services/authService'
import { getName } from '../../services/utils'
import AppointmentService from '../../services/appointmentService'

class Appointments extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      showConfirm: false,
      requesting: false,
    }
  }

  componentWillMount() {
    this.props.appointmentActions.mockData()
    this.fetchAppointments()
  }

  /**
   * fetch appointments
   */
  fetchAppointments() {
    this.props.appointmentActions.getAppointments()
  }

  goto(url) {
    this.props.history.push(url)
  }

  /**
   * delete appointment
   */
  deleteAppointment() {
    if (this.state.requesting) {
      return
    }
    this.setState({ requesting: true })
    AppointmentService.deleteAppointment(this.deleteId)
      .then(() => {
        this.props.appointmentActions.getAppointments({}, () => {
          this.setState({ showConfirm: false })
        })
      })
      .catch(e => toast.error(e.message))
      .finally(() => {
        this.setState({ requesting: false })
      })
  }

  onDelete(id) {
    this.deleteId = id
    this.setState({ showConfirm: true })
  }

  render() {
    const { items, appointmentsData } = this.props

    let events = null
    if (items) {
      events = items.filter(item => item.status === 'upcoming' || item.status === 'ongoing')
    }
    const getTodaySN = () => {
      if (!events) {
        return ''
      }
      return (events || []).filter(e => moment(e.startTime).diff(moment(), 'days') === 0).length
    }

    const renderConfirm = () => (
      <div className="dialog-root">
        <div className="dialog-container">
          <div className="title">Cancel Appointment</div>
          <div className="description">Are you sure you want to cancel this appointment?</div>
          <div className="buttons">
            <a href="javascript:;" className="btn btn-blue btn-sure" onClick={() => this.deleteAppointment()}>
              Yes
            </a>
            <a
              href="javascript:;"
              className="btn btn-blue btn-cancel"
              onClick={() => {
                this.setState({ showConfirm: false })
              }}>
              No
            </a>
          </div>
        </div>
      </div>
    )

    return (
      <React.Fragment>
        <React.Fragment>
          <AppointmentsLeftSidebar />

          <div className="contents appointments">
            <div className="paddings">
              <div className="top-bar flex-grid">
                <div className="lefts">OGNOMY</div>
                <div className="rights flex">
                  <a href="javascript:;" onClick={() => this.goto('/adminHome')}>
                    Admin page
                  </a>
                  <a href="javascript:;" className="icons btn-search" />
                  <div className="info-module">
                    <a href="javascript:;" className="icons btn-bell">
                      <i className="red-point" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="titles">Good Morning, Dr.{getName(AuthService.getAuth().user)}</div>

              <div className="section-time">You have {getTodaySN()} sessions today</div>

              <UpcomingSession upcoming={events} onDelete={id => this.onDelete(id)} />

              <RecentSessions sessions={items ? items.filter(item => item.status === 'past') : null} />
            </div>
          </div>

          {appointmentsData && (
            <AppointmentsRightSidebar
              tasksAndReminders={appointmentsData.tasksAndReminders}
              messages={appointmentsData.messages}
            />
          )}
          {this.state.showConfirm && renderConfirm()}
        </React.Fragment>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state.appointmentReducer })

const matchDispatchToProps = dispatch => ({
  appointmentActions: bindActionCreators({ ...appointmentActions }, dispatch),
})

export default connect(mapStateToProps, matchDispatchToProps)(withRouter(Appointments))
