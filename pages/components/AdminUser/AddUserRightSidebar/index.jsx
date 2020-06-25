import React, { Component } from 'react'
import './styles.scss'

/**
 * add user right sidebar component
 */
export default class AddUserRightSidebar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fullName: '',
      email: '',
      role: '',
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
  }

  handleInputChange(fieldName, event) {
    const target = event.target
    const value = target.value

    this.state[fieldName] = value
    this.setState({
      fieldName: this.state[fieldName],
    })
  }

  handleSelectChange(event) {
    const target = event.target
    const value = target.value

    this.state.role = value
    this.setState({
      role: value,
    })
  }

  emailValid() {
    const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    return filter.test(this.state.email)
  }

  // is form Valid
  formValid() {
    if (
      this.state.fullName.trim() !== '' &&
      this.state.email.trim() !== '' &&
      this.emailValid() &&
      this.state.role !== ''
    ) {
      return true
    }
    return false
  }

  // click Submit
  clickSubmit() {
    this.setState({
      fullName: '',
      email: '',
      role: '',
    })
  }

  render() {
    const { fullName, email, role } = this.state

    return (
      <div className="right-aside">
        <div className="inner">
          <div className="titles">Add User</div>
          <div className="form-box">
            <div className="row-line">
              <div className="label-txt">Full Name</div>
              <div className="input-area">
                <div className="inputs">
                  <input type="text" value={fullName} onChange={event => this.handleInputChange('fullName', event)} />
                </div>
              </div>
            </div>
            <div className="row-line">
              <div className="label-txt">Email</div>
              <div className="input-area">
                <div className={`inputs ${email.trim() !== '' ? (this.emailValid() ? '' : 'error') : ''}`}>
                  <input type="text" value={email} onChange={event => this.handleInputChange('email', event)} />
                </div>
              </div>
            </div>
            <div className="row-line">
              <div className="label-txt">Role</div>
              <div className="input-area">
                <a href="javascript:;" className="sel_mask">
                  <span>{role === '' ? 'Select Role' : role}</span>
                  <img src="/drop-arrow.svg" />
                  <select className="sel" value={role} onChange={this.handleSelectChange}>
                    <option value="">Select Role</option>
                    <option value="Physician">Physician</option>
                    <option value="Technician">Technician</option>
                    <option value="Secretary">Secretary</option>
                    <option value="Admin">Admin</option>
                  </select>
                </a>
              </div>
            </div>
            <div className="bottom-btn">
              <a
                href="javascript:;"
                className={`btn btn-blue ${this.formValid() ? '' : 'disabled'}`}
                onClick={() => {
                  this.clickSubmit()
                  this.props.addUser(role)
                }}>
                Submit
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

AddUserRightSidebar.propTypes = {}
