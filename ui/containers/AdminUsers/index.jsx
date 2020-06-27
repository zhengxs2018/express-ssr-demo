import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'
import nprogress from 'nprogress'
import adminUsersActions from '../../actions/adminUsersActions'
import AdminLeftSidebar from '../../components/AdminLeftSidebar'
import TabBar from '../../components/AdminUser/TabBar'
import PatientsRecentlyView from '../../components/AdminUser/PatientsRecentlyView'
import PatientsTable from '../../components/AdminUser/PatientsTable'
import PhysiciansRecentlyView from '../../components/AdminUser/PhysiciansRecentlyView'
import AddUserRightSidebar from '../../components/AdminUser/AddUserRightSidebar'
import PhysicianEditProfile from '../../components/AdminUser/PhysicianEditProfile'
import TopInfoBar from '../../components/AdminUser/TopInfoBar'
import ModalWindowConfirm from '../../components/AdminUser/ModalWindowConfirm'

import './styles.scss'

class AdminUsers extends Component {
  constructor(props, context) {
    super(props, context)
    nprogress.start()
    this.state = {
      adminUsersData: this.props.adminUsersData,
      profileDataPrevious: null,
      shownTab: 'patients',
      shownSidebar: 'AddUser', // 'AddUser', 'EditProfile',
      tabsList: ['patients', 'physicians', 'technicians', 'secretaries', 'admins'],
      deleteInfo: {
        userType: '',
        source: '', // 'top', 'table'
        index: '',
      },
      showDeleteModal: false,
      sortData: {
        patients: {
          sortColumn: '',
          sortOrder: '', // 'asc', 'desc'
        },
        physicians: {
          sortColumn: '',
          sortOrder: '', // 'asc', 'desc'
        },
        technicians: {
          sortColumn: '',
          sortOrder: '', // 'asc', 'desc'
        },
        secretaries: {
          sortColumn: '',
          sortOrder: '', // 'asc', 'desc'
        },
        admins: {
          sortColumn: '',
          sortOrder: '', // 'asc', 'desc'
        },
      },
      resetedPasswordTimeCount: 0,
    }
  }

  componentWillMount() {
    this.props.adminUsersActions.mockData()
  }

  componentWillUnmount() {
    nprogress.done()
  }

  componentWillReceiveProps(nextProps) {
    nprogress.done()
    this.setState({
      adminUsersData: nextProps.adminUsersData,
    })
  }

  // click Edit Profile
  clickEditProfile(isOpen, data) {
    if (isOpen) {
      this.setState({
        profileDataPrevious: _.cloneDeep(data),
      })
    }

    this.setState({
      shownSidebar: isOpen ? 'EditProfile' : 'AddUser',
    })
  }

  // on Save User
  onSaveUser(data, isSave) {
    if (isSave) {
      // save the data
    }

    this.setState({
      shownSidebar: 'AddUser',
    })
  }

  // select Tab
  selectTab(item) {
    this.setState({
      shownTab: item,
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

    this.state.adminUsersData[tableName].table.sort((a, b) => {
      switch (columnName) {
        case 'name':
        case 'progressStatus':
        case 'lastSeen':
        case 'provided':
        case 'id':
          if (this.state.sortData[tableName].sortOrder === 'asc') {
            return a[columnName].localeCompare(b[columnName])
          }
          return b[columnName].localeCompare(a[columnName])
        case 'expire':
          if (this.state.sortData[tableName].sortOrder === 'asc') {
            return a[columnName] - b[columnName]
          }
          return b[columnName] - a[columnName]
        case 'dob':
          if (this.state.sortData[tableName].sortOrder === 'asc') {
            return new Date(a[columnName]) - new Date(b[columnName])
          }
          return new Date(b[columnName]) - new Date(a[columnName])
        default:
          return 1
      }
    })
  }

  // on Delete Item Top
  onDeleteItemTop(userType, index) {
    this.setState({
      deleteInfo: {
        userType,
        source: 'top',
        index,
      },
      showDeleteModal: true,
    })
  }

  // on Delete Item Table
  onDeleteItemTable(userType, index) {
    this.setState({
      deleteInfo: {
        userType,
        source: 'table',
        index,
      },
      showDeleteModal: true,
    })
  }

  // click Confirm Delete
  clickConfirmDelete(isConfirmed) {
    if (isConfirmed) {
      if (this.state.deleteInfo.source === 'top') {
        this.state.adminUsersData[this.state.deleteInfo.userType].topList.splice(this.state.deleteInfo.index, 1)
      }

      if (this.state.deleteInfo.source === 'table') {
        this.state.adminUsersData[this.state.deleteInfo.userType].table.splice(this.state.deleteInfo.index, 1)
      }

      this.setState({
        adminUsersData: this.state.adminUsersData,
        showDeleteModal: false,
      })

      this.setState({
        showDeleteModal: false,
      })
    } else {
      this.setState({
        showDeleteModal: false,
      })
    }
  }

  // on Change Search
  onChangeSearch(type, sortByLabel, searchStr) {
    console.log(`${type}:${sortByLabel}&${searchStr}`)
  }

  // on Add User
  onAddUser(role) {
    let tabName = ''
    switch (role) {
      case 'Physician':
        tabName = 'physicians'
        break
      case 'Technician':
        tabName = 'technicians'
        break
      case 'Secretary':
        tabName = 'secretaries'
        break
      case 'Admin':
        tabName = 'admins'
        break
      default:
        break
    }

    this.setState({
      shownTab: tabName,
    })
  }

  // click Confirm Reset Password
  clickConfirmResetPassword() {
    this.setState({
      resetedPasswordTimeCount: 5,
    })

    const interval = setInterval(() => {
      if (this.state.resetedPasswordTimeCount > 0) {
        this.setState({
          resetedPasswordTimeCount: this.state.resetedPasswordTimeCount - 1,
        })
      } else {
        clearInterval(interval)
      }
    }, 1000)
  }

  // clear Count
  clearCount() {
    this.setState({
      resetedPasswordTimeCount: 0,
    })
  }

  render() {
    const {
      adminUsersData,
      shownTab,
      tabsList,
      shownSidebar,
      showDeleteModal,
      profileDataPrevious,
      resetedPasswordTimeCount,
    } = this.state

    return (
      <React.Fragment>
        <React.Fragment>
          <AdminLeftSidebar />
          {showDeleteModal && (
            <ModalWindowConfirm
              title="Delete"
              description="Are you sure you want to delete this user?"
              showTextarea={false}
              clickConfirm={isConfirmed => this.clickConfirmDelete(isConfirmed)}
            />
          )}

          {adminUsersData && (
            <div className="contents appointments">
              {resetedPasswordTimeCount > 0 && (
                <TopInfoBar
                  type="done"
                  title="Password has been reset."
                  subTitle="Instruction email has been sent to suer"
                  timeCount={resetedPasswordTimeCount}
                  clearCount={() => this.clearCount()}
                />
              )}
              <div className="paddings">
                <div className="main-user">
                  <div className="top-bar flex-grid">
                    <div className="lefts">Users</div>
                    <div className="rights flex">
                      <a href="javascript:;" className="icons btn-search" />
                      <div className="info-module">
                        <a href="javascript:;" className="icons btn-bell">
                          <i className="red-point" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <TabBar tabsList={tabsList} shownTab={shownTab} selectTab={item => this.selectTab(item)} />

                  {adminUsersData && shownTab === 'patients' && (
                    <React.Fragment>
                      <PatientsRecentlyView
                        data={adminUsersData[shownTab].topList}
                        deleteItem={index => this.onDeleteItemTop(shownTab, index)}
                      />

                      <PatientsTable
                        type="Patient"
                        data={adminUsersData[shownTab].table}
                        deleteItem={index => this.onDeleteItemTable(shownTab, index)}
                        sortData={this.state.sortData[shownTab]}
                        changeSortAndSearch={(type, sortByLabel, searchStr) =>
                          this.onChangeSearch(type, sortByLabel, searchStr)
                        }
                        clickSort={columnName => this.clickSort('patients', columnName)}
                      />
                    </React.Fragment>
                  )}

                  {adminUsersData && shownTab === 'physicians' && (
                    <React.Fragment>
                      <PhysiciansRecentlyView
                        type="Physician"
                        data={adminUsersData[shownTab].topList}
                        deleteItem={index => this.onDeleteItemTop(shownTab, index)}
                        clickEditProfile={(isOpen, data) => this.clickEditProfile(isOpen, data)}
                      />

                      <PatientsTable
                        type="Physician"
                        data={adminUsersData[shownTab].table}
                        deleteItem={index => this.onDeleteItemTable(shownTab, index)}
                        sortData={this.state.sortData[shownTab]}
                        changeSortAndSearch={(type, sortByLabel, searchStr) =>
                          this.onChangeSearch(type, sortByLabel, searchStr)
                        }
                        clickSort={columnName => this.clickSort('physicians', columnName)}
                        clickEditProfile={(isOpen, data) => this.clickEditProfile(isOpen, data)}
                      />
                    </React.Fragment>
                  )}

                  {adminUsersData && shownTab === 'technicians' && (
                    <React.Fragment>
                      <PhysiciansRecentlyView
                        type="Technician"
                        data={adminUsersData[shownTab].topList}
                        deleteItem={index => this.onDeleteItemTop(shownTab, index)}
                        clickEditProfile={(isOpen, data) => this.clickEditProfile(isOpen, data)}
                      />

                      <PatientsTable
                        type="Technician"
                        data={adminUsersData[shownTab].table}
                        deleteItem={index => this.onDeleteItemTable(shownTab, index)}
                        sortData={this.state.sortData[shownTab]}
                        changeSortAndSearch={(type, sortByLabel, searchStr) =>
                          this.onChangeSearch(type, sortByLabel, searchStr)
                        }
                        clickSort={columnName => this.clickSort('technicians', columnName)}
                        clickEditProfile={(isOpen, data) => this.clickEditProfile(isOpen, data)}
                      />
                    </React.Fragment>
                  )}

                  {adminUsersData && shownTab === 'secretaries' && (
                    <React.Fragment>
                      <PhysiciansRecentlyView
                        type="Secretary"
                        data={adminUsersData[shownTab].topList}
                        deleteItem={index => this.onDeleteItemTop(shownTab, index)}
                        clickEditProfile={(isOpen, data) => this.clickEditProfile(isOpen, data)}
                      />

                      <PatientsTable
                        type="Secretary"
                        data={adminUsersData[shownTab].table}
                        deleteItem={index => this.onDeleteItemTable(shownTab, index)}
                        sortData={this.state.sortData[shownTab]}
                        changeSortAndSearch={(type, sortByLabel, searchStr) =>
                          this.onChangeSearch(type, sortByLabel, searchStr)
                        }
                        clickSort={columnName => this.clickSort('secretaries', columnName)}
                        clickEditProfile={(isOpen, data) => this.clickEditProfile(isOpen, data)}
                      />
                    </React.Fragment>
                  )}

                  {adminUsersData && shownTab === 'admins' && (
                    <React.Fragment>
                      <PhysiciansRecentlyView
                        type="Admin"
                        data={adminUsersData[shownTab].topList}
                        deleteItem={index => this.onDeleteItemTop(shownTab, index)}
                        clickEditProfile={(isOpen, data) => this.clickEditProfile(isOpen, data)}
                      />

                      <PatientsTable
                        type="Admin"
                        data={adminUsersData[shownTab].table}
                        deleteItem={index => this.onDeleteItemTable(shownTab, index)}
                        sortData={this.state.sortData[shownTab]}
                        changeSortAndSearch={(type, sortByLabel, searchStr) =>
                          this.onChangeSearch(type, sortByLabel, searchStr)
                        }
                        clickSort={columnName => this.clickSort('admins', columnName)}
                        clickEditProfile={(isOpen, data) => this.clickEditProfile(isOpen, data)}
                      />
                    </React.Fragment>
                  )}

                  {shownSidebar === 'AddUser' && <AddUserRightSidebar addUser={role => this.onAddUser(role)} />}

                  {shownSidebar === 'EditProfile' && (
                    <PhysicianEditProfile
                      data={profileDataPrevious}
                      clickConfirm={() => this.clickConfirmResetPassword()}
                      saveUser={(data, isSave) => this.onSaveUser(data, isSave)}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </React.Fragment>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state.adminUsersReducer })

const matchDispatchToProps = dispatch => ({
  adminUsersActions: bindActionCreators({ ...adminUsersActions }, dispatch),
})

export default connect(mapStateToProps, matchDispatchToProps)(AdminUsers)
