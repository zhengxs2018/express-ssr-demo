import React, { Component } from 'react'
import PT from 'prop-types'
import './styles.scss'

/**
 * physician profile banner component
 */
export default class PhysicianProfileBanner extends Component {
  render() {
    const { data } = this.props

    return (
      <div className="left-physician-profile">
        <div className="top-area">
          <a href="javascript:;" className="icons icon-edit" onClick={() => this.props.clickEditProfile(true)} />
          <div className="top-photo">
            <img src={data.photoUrl} alt="img" />
          </div>
          <div className="name">{data.name}</div>
          <div className="sleep-txt">{data.title}</div>
        </div>
        <div className="bottom-gray">
          <div className="items">
            <i className="icons icon-mail" />
            <span className="txt">{data.email}</span>
          </div>
          <div className="items">
            <i className="icons icon-phone" />
            <span className="txt">{data.phone}</span>
          </div>
        </div>
      </div>
    )
  }
}

PhysicianProfileBanner.propTypes = {
  data: PT.object,
}
