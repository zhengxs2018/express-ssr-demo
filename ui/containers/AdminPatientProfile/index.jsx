import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Link from 'next/link'
import nprogress from 'nprogress'
import adminPatientProfileActions from '../../actions/adminPatientProfileActions'
import AdminLeftSidebar from '../../components/AdminLeftSidebar'
import PatientProfileBanner from '../../components/AdminUser/PatientProfileBanner'
import PatientTiles from '../../components/AdminUser/PatientTiles'
import QuickLinks from '../../components/AdminUser/QuickLinks'
import NoteRightSidebar from '../../components/AdminUser/NoteRightSidebar'
import PatientFormsRightSidebar from '../../components/AdminUser/PatientFormsRightSidebar'
import ModalWindowDeleteFiles from '../../components/AdminUser/ModalWindowDeleteFiles'
import TopInfoBar from '../../components/AdminUser/TopInfoBar'
import './styles.scss'

class AdminPatientProfile extends Component {
  constructor(props, context) {
    super(props, context)
    nprogress.start()
    this.state = {
      adminPatientProfileData: this.props.adminPatientProfileData,
      shownSidebar: 'Notes', // 'Notes', 'Patient Forms'
      fileDeletedTimeCount: 0,
      showDeleteFilesModal: false,
      deletedFileList: [],
    }
  }

  componentWillMount() {
    this.props.adminPatientProfileActions.mockData({
      fileSortBy: this.state.fileSortBy,
    })
  }

  componentWillUnmount() {
    nprogress.done()
  }

  componentWillReceiveProps(nextProps) {
    nprogress.done()
    this.setState({
      adminPatientProfileData: nextProps.adminPatientProfileData,
    })
  }

  // select Patient Files
  selectPatientForms(item) {
    this.setState({
      shownSidebar: item ? 'Patient Forms' : 'Notes',
    })
  }

  // on File Sort Change
  onFileSortChange(sortByLabel) {
    console.log(sortByLabel)

    this.props.adminPatientProfileActions.mockData({
      fileSortBy: sortByLabel,
    })
  }

  // on Click File Delete
  onClickFileDelete(item) {
    this.setState({
      deletedFileList: item,
      showDeleteFilesModal: true,
    })
  }

  // confirm File Delete
  confirmFileDelete(isConfirmed) {
    if (isConfirmed) {
      this.setState({
        fileDeletedTimeCount: 5,
        showDeleteFilesModal: false,
      })

      const newArray = []
      this.state.adminPatientProfileData.patientForms.forEach(item => {
        if (this.state.deletedFileList.indexOf(item) === -1) {
          newArray.push(item)
        }
      })

      this.state.adminPatientProfileData.patientForms = newArray

      this.setState({
        adminPatientProfileData: this.state.adminPatientProfileData,
      })

      const interval = setInterval(() => {
        if (this.state.fileDeletedTimeCount > 0) {
          this.setState({
            fileDeletedTimeCount: this.state.fileDeletedTimeCount - 1,
          })
        } else {
          clearInterval(interval)
        }
      }, 1000)
    } else {
      this.setState({
        showDeleteFilesModal: false,
      })
    }
  }

  // clear Count
  clearCount() {
    this.setState({
      fileDeletedTimeCount: 0,
    })
  }

  render() {
    const { adminPatientProfileData, fileDeletedTimeCount, showDeleteFilesModal, deletedFileList } = this.state

    return (
      <React.Fragment>
        <React.Fragment>
          <AdminLeftSidebar />

          {adminPatientProfileData && (
            <div className="contents appointments">
              {showDeleteFilesModal && (
                <ModalWindowDeleteFiles
                  deletedFileList={deletedFileList}
                  confirmFileDelete={isConfirmed => this.confirmFileDelete(isConfirmed)}
                />
              )}

              {fileDeletedTimeCount > 0 && (
                <TopInfoBar
                  type="delete"
                  title={`${deletedFileList.length} files deleted`}
                  subTitle=""
                  timeCount={fileDeletedTimeCount}
                  clearCount={() => this.clearCount()}
                />
              )}

              <div className="paddings">
                <div className="all-patients ">
                  <div className="top-bar flex-grid">
                    <div className="left-back">
                      <Link href="/adminUsers">
                        <a className="icons icon-back"></a>
                      </Link>
                      <span className="txt">All Patients</span>
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
                  <div className="top-bar ">
                    <div className="lefts">Patient Profile</div>
                  </div>
                  <div className="profile-area flex-grid">
                    <PatientProfileBanner data={adminPatientProfileData.profileBanner} />

                    <PatientTiles />
                  </div>

                  <QuickLinks
                    data={adminPatientProfileData.quickLinks}
                    patientFormsSelected={this.state.shownSidebar === 'Patient Forms'}
                    selectPatientForms={item => this.selectPatientForms(item)}
                  />

                  {this.state.shownSidebar === 'Notes' && <NoteRightSidebar notes={adminPatientProfileData.notes} />}

                  {this.state.shownSidebar === 'Patient Forms' && (
                    <PatientFormsRightSidebar
                      data={adminPatientProfileData.patientForms}
                      selectPatientForms={item => this.selectPatientForms(item)}
                      onFileSortChange={sortByLabel => this.onFileSortChange(sortByLabel)}
                      clickFileDelete={item => this.onClickFileDelete(item)}
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

const mapStateToProps = state => ({ ...state.adminPatientProfileReducer })

const matchDispatchToProps = dispatch => ({
  adminPatientProfileActions: bindActionCreators({ ...adminPatientProfileActions }, dispatch),
})

export default connect(mapStateToProps, matchDispatchToProps)(AdminPatientProfile)
