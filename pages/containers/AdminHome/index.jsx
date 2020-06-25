import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import nprogress from 'nprogress'
import adminHomeActions from '../../actions/adminHomeActions'
import appointmentActions from '../../actions/appointmentActions'
import AdminLeftSidebar from '../../components/AdminLeftSidebar'
import ExpiringMsgBar from '../../components/AdminUser/ExpiringMsgBar'
import Overview from '../../components/AdminUser/Overview'
import BarChart from '../../components/AdminUser/BarChart'
import SystemStatus from '../../components/AdminUser/SystemStatus'
import AppointmentsRightSidebar from '../../components/AppointmentsRightSidebar'
import './styles.scss'

class AdminHome extends Component {
  constructor(props, context) {
    super(props, context)
    nprogress.start()
    this.state = {
      adminHomeData: this.props.adminHomeData,
      expiringDays: 15,
    }
  }

  componentWillMount() {
    this.props.adminHomeActions.mockData()
    this.props.appointmentActions.mockData()
  }

  componentWillUnmount() {
    nprogress.done()
  }

  componentWillReceiveProps(nextProps) {
    nprogress.done()
    this.setState({
      adminHomeData: nextProps.adminHomeData,
    })
  }

  goto(url) {
    this.props.history.push(url)
  }

  render() {
    const { appointmentsData } = this.props

    const { adminHomeData } = this.state

    return (
      <React.Fragment>
        <React.Fragment>
          <AdminLeftSidebar />

          <ExpiringMsgBar expiringDays={this.state.expiringDays} />

          <div className="contents appointments">
            <div className="paddings">
              <div className="top-bar flex-grid">
                <div className="lefts">
                  <i className="icons icon-logo" />
                  OGNOMY
                </div>
                <div className="rights flex">
                  <a href="javascript:;" className="icons btn-search" />
                  <div className="info-module">
                    <a href="javascript:;" className="icons btn-bell">
                      <i className="red-point" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="titles">Good Morning, Emma</div>

              {adminHomeData && (
                <React.Fragment>
                  <div className="panel-list">
                    <div className="titles">Overview</div>

                    <Overview data={adminHomeData.overview} />
                  </div>
                  <div className="wrap-boxs flex-grid">
                    <BarChart data={adminHomeData.barChart} />

                    <SystemStatus data={adminHomeData.systemStatus} />
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>

          {appointmentsData && (
            <AppointmentsRightSidebar
              tasksAndReminders={appointmentsData.tasksAndReminders}
              messages={appointmentsData.messages}
            />
          )}
        </React.Fragment>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state.adminHomeReducer, ...state.appointmentReducer })

const matchDispatchToProps = dispatch => ({
  adminHomeActions: bindActionCreators({ ...adminHomeActions }, dispatch),
  appointmentActions: bindActionCreators({ ...appointmentActions }, dispatch),
})

export default connect(mapStateToProps, matchDispatchToProps)(withRouter(AdminHome))
