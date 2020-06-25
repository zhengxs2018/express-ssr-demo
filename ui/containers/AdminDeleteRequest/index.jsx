import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import nprogress from 'nprogress'
import adminDeleteRequestActions from '../../actions/adminDeleteRequestActions'
import appointmentActions from '../../actions/appointmentActions'
import AdminLeftSidebar from '../../components/AdminLeftSidebar'
import TabBar from '../../components/AdminUser/TabBar'
import PendingRequestTable from '../../components/AdminUser/PendingRequestTable'
import DeleteHistoryTable from '../../components/AdminUser/DeleteHistoryTable'
import AppointmentsRightSidebar from '../../components/AppointmentsRightSidebar'
import './styles.scss'

class AdminDeleteRequest extends Component {
  constructor(props, context) {
    super(props, context)
    nprogress.start()
    this.state = {
      adminDeleteRequestData: this.props.adminDeleteRequestData,
      shownTab: 'Pending Requests',
      tabsList: ['Pending Requests', 'Delete History'],
      sortData: {
        pendingRequestTable: {
          sortColumn: '',
          sortOrder: '', // 'asc', 'desc'
        },
        deleteHistoryTable: {
          sortColumn: '',
          sortOrder: '', // 'asc', 'desc'
        },
      },
    }
  }

  componentWillMount() {
    this.props.adminDeleteRequestActions.mockData()
    this.props.appointmentActions.mockData()
  }

  componentWillUnmount() {
    nprogress.done()
  }

  componentWillReceiveProps(nextProps) {
    nprogress.done()
    this.setState({
      adminDeleteRequestData: nextProps.adminDeleteRequestData,
    })
  }

  // select Tab
  selectTab(item) {
    this.setState({
      shownTab: item,
      sortData: {
        pendingRequestTable: {
          sortColumn: '',
          sortOrder: '', // 'asc', 'desc'
        },
        deleteHistoryTable: {
          sortColumn: '',
          sortOrder: '', // 'asc', 'desc'
        },
      },
    })
  }

  // change Sort
  clickSort(tableName, columnName) {
    if (this.state.sortData[tableName].sortColumn !== columnName) {
      // click un-sorted column
      this.state.sortData[tableName].sortColumn = columnName
      this.state.sortData[tableName].sortOrder = 'asc'
    } else if (this.state.sortData[tableName].sortOrder === 'asc') {
      this.state.sortData[tableName].sortOrder = 'desc'
    } else {
      this.state.sortData[tableName].sortOrder = 'asc'
    }

    this.setState({
      sortData: this.state.sortData,
    })

    this.state.adminDeleteRequestData[tableName].sort((a, b) => {
      switch (columnName) {
        case 'name':
        case 'fileName':
        case 'requestedBy':
        case 'status':
          if (this.state.sortData[tableName].sortOrder === 'asc') {
            return a[columnName].localeCompare(b[columnName])
          }
          return b[columnName].localeCompare(a[columnName])
        case 'requestedDate':
        case 'processedDate':
          if (this.state.sortData[tableName].sortOrder === 'asc') {
            return new Date(a[columnName]) - new Date(b[columnName])
          }
          return new Date(b[columnName]) - new Date(a[columnName])
        default:
          return 1
      }
    })
  }

  render() {
    const { appointmentsData } = this.props

    const { adminDeleteRequestData } = this.state

    return (
      <React.Fragment>
        <React.Fragment>
          <AdminLeftSidebar />

          <div className="contents appointments">
            <div className="paddings">
              <div className="top-bar flex-grid">
                <div className="lefts">Delete Requests</div>
                <div className="rights flex">
                  <a href="javascript:;" className="icons btn-search" />
                  <div className="info-module">
                    <a href="javascript:;" className="icons btn-bell">
                      <i className="red-point" />
                    </a>
                  </div>
                </div>
              </div>

              <TabBar
                tabsList={this.state.tabsList}
                shownTab={this.state.shownTab}
                selectTab={item => this.selectTab(item)}
              />

              {adminDeleteRequestData && this.state.shownTab === 'Pending Requests' && (
                <PendingRequestTable
                  data={adminDeleteRequestData.pendingRequestTable}
                  sortData={this.state.sortData.pendingRequestTable}
                  clickSort={columnName => this.clickSort('pendingRequestTable', columnName)}
                />
              )}

              {adminDeleteRequestData && this.state.shownTab === 'Delete History' && (
                <DeleteHistoryTable
                  data={adminDeleteRequestData.deleteHistoryTable}
                  sortData={this.state.sortData.deleteHistoryTable}
                  clickSort={columnName => this.clickSort('deleteHistoryTable', columnName)}
                />
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

const mapStateToProps = state => ({ ...state.adminDeleteRequestReducer, ...state.appointmentReducer })

const matchDispatchToProps = dispatch => ({
  adminDeleteRequestActions: bindActionCreators({ ...adminDeleteRequestActions }, dispatch),
  appointmentActions: bindActionCreators({ ...appointmentActions }, dispatch),
})

export default connect(mapStateToProps, matchDispatchToProps)(AdminDeleteRequest)
