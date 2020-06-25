import React, { Component } from 'react'
import PT from 'prop-types'
import { NavLink } from 'react-router-dom'
import './styles.scss'

/**
 * overview component
 */
export default class Overview extends Component {
  render() {
    const { data } = this.props

    return (
      <div className="five-panel flex-grid">
        <div className="items">
          <div className="top-icon">
            <i className="icons icon-physicians" />
          </div>
          <div className="num">{data.physicians}</div>
          <div className="txt">
            <div className="normal-txt">Physicians</div>
          </div>
        </div>
        <div className="items">
          <div className="top-icon">
            <i className="icons icon-band-aids" />
          </div>
          <div className="num">{data.patients}</div>
          <div className="txt">
            <div className="normal-txt">Patients</div>
          </div>
        </div>
        <div className="items">
          <div className="top-icon">
            <i className="icons icon-parents-add" />
          </div>
          <div className="num">{data.newPatients}</div>
          <div className="txt">
            <div className="normal-txt">New Patients</div>
            <div className="little-txt">(This month)</div>
          </div>
        </div>
        <div className="items">
          <div className="top-icon">
            <i className="icons icon-chart-parent" />
          </div>
          <div className="num orange">{data.patientsWithPendingItems}%</div>
          <div className="txt">
            <div className="normal-txt">Patients</div>
            <div className="little-txt">(With pending items)</div>
          </div>
        </div>
        <NavLink className="items" to="/adminDeleteRequest">
          <div className="top-icon">
            <i className="icons icon-del-file" />
          </div>
          <div className="num">{data.deleteRequests}</div>
          <div className="txt">
            <div className="normal-txt">Delete Requests</div>
          </div>
        </NavLink>
      </div>
    )
  }
}

Overview.propTypes = {
  data: PT.object,
}
