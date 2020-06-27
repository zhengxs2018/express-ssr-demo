import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import _ from 'lodash'
import nprogress from 'nprogress'
import Link from 'next/link'
import adminPhysicianProfileActions from '../../actions/adminPhysicianProfileActions'
import AdminLeftSidebar from '../../components/AdminLeftSidebar'
import PhysicianProfileBanner from '../../components/AdminUser/PhysicianProfileBanner'
import PhysicianAbout from '../../components/AdminUser/PhysicianAbout'
import PhysicianUpcomingAppointment from '../../components/AdminUser/PhysicianUpcomingAppointment'
import PhysicianAvailabilityRightSidebar from '../../components/AdminUser/PhysicianAvailabilityRightSidebar'
import PhysicianEditProfile from '../../components/AdminUser/PhysicianEditProfile'
import TopInfoBar from '../../components/AdminUser/TopInfoBar'
import './styles.scss'

class AdminPhysicianProfile extends Component {
  constructor(props, context) {
    super(props, context)
    nprogress.start()

    this.state = {
      adminPhysicianProfileData: this.props.adminPhysicianProfileData,
      profileDataPrevious: null,
      shownSidebar: 'Availability', // 'Availability', 'EditProfile',
      resetedPasswordTimeCount: 0,
      userType: this.props.router.query.type,
    }
  }

  componentWillMount() {
    this.props.adminPhysicianProfileActions.mockData()
  }

  componentWillUnmount() {
    nprogress.done()
  }

  componentWillReceiveProps(nextProps) {
    nprogress.done()
    this.setState({
      adminPhysicianProfileData: nextProps.adminPhysicianProfileData,
    })
  }

  // click Edit Profile
  clickEditProfile(isOpen) {
    if (isOpen) {
      this.setState({
        profileDataPrevious: _.cloneDeep(this.state.adminPhysicianProfileData.profileBanner),
      })
    }

    this.setState({
      shownSidebar: isOpen ? 'EditProfile' : 'Availability',
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

  // on Save User
  onSaveUser(data, isSave) {
    if (isSave) {
      this.state.adminPhysicianProfileData.profileBanner = _.cloneDeep(this.state.profileDataPrevious)
      this.setState({
        adminPhysicianProfileData: this.state.adminPhysicianProfileData,
      })
    }

    this.setState({
      shownSidebar: 'Availability',
    })
  }

  render() {
    const {
      adminPhysicianProfileData,
      profileDataPrevious,
      shownSidebar,
      resetedPasswordTimeCount,
      userType,
    } = this.state

    return (
      <>
        <AdminLeftSidebar />

        {adminPhysicianProfileData && (
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
              <div className="top-bar flex-grid">
                <div className="left-back">
                  <Link href="/adminUsers">
                    <a className="icons icon-back"></a>
                  </Link>
                  <span className="txt">All {userType !== 'Secretary' ? userType : 'Secretarie'}s</span>
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
              <div className="top-bar">
                <div className="lefts">{userType} Profile</div>
              </div>
              <div className="profile-area flex-grid">
                <PhysicianProfileBanner
                  data={adminPhysicianProfileData.profileBanner}
                  clickEditProfile={isOpen => this.clickEditProfile(isOpen)}
                />

                <PhysicianAbout data={adminPhysicianProfileData.aboutBanner} />
              </div>

              <PhysicianUpcomingAppointment data={adminPhysicianProfileData.upcomingAppointment} />

              {shownSidebar === 'Availability' && (
                <PhysicianAvailabilityRightSidebar data={adminPhysicianProfileData.availability} />
              )}

              {shownSidebar === 'EditProfile' && (
                <PhysicianEditProfile
                  data={profileDataPrevious}
                  clickConfirm={() => this.clickConfirmResetPassword()}
                  saveUser={(data, isSave) => this.onSaveUser(data, isSave)}
                />
              )}
            </div>
          </div>
        )}
      </>
    )
  }
}

const mapStateToProps = state => ({ ...state.adminPhysicianProfileReducer })

const matchDispatchToProps = dispatch => ({
  adminPhysicianProfileActions: bindActionCreators({ ...adminPhysicianProfileActions }, dispatch),
})

export default connect(mapStateToProps, matchDispatchToProps)(withRouter(AdminPhysicianProfile))
