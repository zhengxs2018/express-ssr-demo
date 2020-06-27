import React from 'react'
import PT from 'prop-types'
import Link from 'next/link'
import './styles.scss'

/**
 * physicians recently view component
 */
const PhysiciansRecentlyView = ({ type, data }) => {
  return (
    <div className="panel-list physicians-list">
      <div className="list-title flex-grid ">
        5 {type !== 'Secretary' ? type : 'Secretarie'}s
        <div className="drop-area hide">
          <a href="javascript:;" className="drop-btn">
            Sort by Name
            <i className="icons icon-drop" />
          </a>
        </div>
      </div>
      <div className="five-panel flex-grid  recently-view">
        {data.map((item, index) => (
          <div className="items" key={index}>
            <div className="hover-blue">
              {type === 'Patient' && (
                <Link href="/adminPatientProfile">
                  <a className="btn btn-border">View Profile</a>
                </Link>
              )}
              {type !== 'Patient' && (
                <Link href={`/adminPhysicianProfile/${type}`}>
                  <a className="btn btn-border">View Profile</a>
                </Link>
              )}
              <div className="bottom-tools">
                <a
                  href="javascript:;"
                  className="icons icon-edit"
                  onClick={() => this.props.clickEditProfile(true, item)}
                />
                <a href="javascript:;" className="icons icon-trash" onClick={() => this.props.deleteItem(index)} />
              </div>
            </div>
            <div className="top-area flex-grid">
              <div className="names">{item.name}</div>
              <div className="right-img">
                <a href="javascript:;">
                  <img src={item.photoUrl} alt="img" />
                </a>
              </div>
            </div>
            <div className="txt">
              <div className="normal-txt">{item.title}</div>
              <a href="javascript:;" className="email-link">
                {item.email}
              </a>
              <div className="normal-txt">{item.phone}</div>
              {item.expire <= 30 && item.expire > 0 && (
                <div className="orange-txt">Password expiring in {item.expire} days</div>
              )}
              {item.expire === 0 && <div className="red-txt">Password expired</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

PhysiciansRecentlyView.propTypes = {
  type: PT.string,
  data: PT.array,
}

export default PhysiciansRecentlyView
