import React, { Component } from 'react'
import PT from 'prop-types'
import ModalWindowConfirm from '../ModalWindowConfirm'
import './styles.scss'

/**
 * physician edit profile component
 */
export default class PhysicianEditProfile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: this.props.data,
      changePassword: false,
      showResetPasswordModal: false,
    }
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data,
    })
  }

  handleInputChange(fieldName, event) {
    const target = event.target
    const value = target.value

    this.state.data[fieldName] = value
    this.setState({
      data: this.state.data,
    })
  }

  handleFileChange(event) {
    this.state.data.photoUrl = URL.createObjectURL(event.target.files[0])

    this.setState({
      data: this.state.data,
    })
  }

  clickConfirmResetPassword(isConfirmed) {
    if (isConfirmed) {
      this.setState({
        showResetPasswordModal: false,
      })
      this.props.clickConfirm()
    } else {
      this.setState({
        showResetPasswordModal: false,
      })
    }
  }

  // is form Valid
  formValid() {
    if (
      this.state.data.name.trim() !== '' &&
      this.state.data.title.trim() !== '' &&
      this.state.data.phone.trim() !== ''
    ) {
      return true
    }
    return false
  }

  render() {
    const { data, changePassword, showResetPasswordModal } = this.state

    return (
      <div className="right-aside">
        {showResetPasswordModal && (
          <ModalWindowConfirm
            title="Reset Password"
            description="Are you sure you want to reset password for this user?"
            showTextarea={false}
            clickConfirm={isConfirmed => this.clickConfirmResetPassword(isConfirmed)}
          />
        )}
        <div className="inner">
          <div className="titles">Edit Profile</div>
          <a href="javascript:;" className="btn-close" onClick={() => this.props.saveUser(data, false)} />
          <div className="photo">
            <img src={data.photoUrl} alt="img" />
            <a href="javascript:;" className="file-photo">
              <input type="file" accept=".png,.jpg" onChange={event => this.handleFileChange(event)} />
            </a>
          </div>
          <div className="form-box">
            <div className="row-line">
              <div className="label-txt">Full Name</div>
              <div className="input-area">
                <div className="inputs">
                  <input type="text" value={data.name} onChange={event => this.handleInputChange('name', event)} />
                </div>
              </div>
            </div>
            <div className="row-line">
              <div className="label-txt">Title</div>
              <div className="input-area">
                <div className="inputs">
                  <input type="text" value={data.title} onChange={event => this.handleInputChange('title', event)} />
                </div>
              </div>
            </div>
            <div className="row-line">
              <div className="label-txt">Email</div>
              <div className="input-area">
                <div className="inputs">
                  <input
                    type="text"
                    disabled
                    value={data.email}
                    onChange={event => this.handleInputChange('email', event)}
                  />
                </div>
              </div>
            </div>
            <div className="row-line">
              <div className="label-txt">Phone</div>
              <div className="input-area">
                <div className="inputs">
                  <input type="text" value={data.phone} onChange={event => this.handleInputChange('phone', event)} />
                </div>
              </div>
            </div>
            {changePassword && (
              <div className="row-line">
                <div className="label-txt">Enter New Password</div>
                <div className="input-area">
                  <div className="inputs">
                    <input
                      type="password"
                      value={data.password}
                      onChange={event => this.handleInputChange('password', event)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          {!changePassword && (
            <ul className="list-links">
              <li>
                <span>Password</span>
              </li>
              <li>
                <a href="javascript:;" className="color-blue" onClick={() => this.setState({ changePassword: true })}>
                  Change Password
                </a>
              </li>
              <li>
                <a
                  href="javascript:;"
                  className="color-blue"
                  onClick={() => this.setState({ showResetPasswordModal: true })}>
                  Reset Password
                </a>
              </li>
            </ul>
          )}
          <div className="bottom-btn">
            <a
              href="javascript:;"
              className={`btn btn-blue ${this.formValid() ? '' : 'disabled'}`}
              onClick={() => this.props.saveUser(data, true)}>
              Submit
            </a>
            <a href="javascript:;" className="btn btn-blue-border" onClick={() => this.props.saveUser(data, false)}>
              Cancel
            </a>
          </div>
        </div>
      </div>
    )
  }
}

PhysicianEditProfile.propTypes = {
  data: PT.object,
}
