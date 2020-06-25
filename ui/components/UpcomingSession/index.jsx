import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PT from 'prop-types'
import './styles.scss'
import moment from 'moment'
import UserHead from '../UserHead'
import { ENABLE_MEETING_TIME } from '../../config'
import { checkIsCanCancel, getName, getUid, LS_ACTIVE_APPOINTMENT, LStorage } from '../../services/utils'

/**
 * momen../../../ui/services/utils
 * @type {string}
 */
const H_FORMAT = 'hh:mm a'

class UpcomingSession extends Component {
  /**
   * get hum readable text
   * @param endTime the end time
   * @param current the current time
   * @returns {string}
   */
  getHumText(endTime, current) {
    const diffDay = moment(endTime).diff(moment(current), 'days')
    switch (diffDay) {
      case 1:
        return 'tomorrow'
      case 0:
        return 'Today'
      case -1:
        return 'Yesterday'
      default:
        return moment(endTime).fromNow()
    }
  }

  /**
   * convert backend entity to frontend
   * @param e the backend entity
   */
  convert(e) {
    return {
      id: e.id,
      name: getName(e.patient),
      patientId: e.patient.id,
      smallTitle: e.patient.email,
      daysIntoTreatment: e.description,
      followUp: e.event.title,
      time: `${moment(e.startTime).format(H_FORMAT)} - ${moment(e.endTime).format(H_FORMAT)}`,
      url: e.patient.headUrl,
      when: e.event.when,
      humTime: this.getHumText(e.startTime, e.current),
      startIn: e.status === 'ongoing' ? 'Started' : moment(e.startTime).format('MM/DD/YYYY'),
      raw: e,
    }
  }

  /**
   * goto zoom meeting page
   * @param e the appointment
   */
  gotoVideo(e) {
    LStorage.setItem(LS_ACTIVE_APPOINTMENT, e)
    const url = `/teleconsult/${e.id}`
    this.props.history.push(url)
  }

  /**
   * goto patient details
   * @param id
   */
  gotoPatientDetail(id) {
    this.props.history.push(`/patients/${id}`)
  }

  render() {
    const { upcoming } = this.props

    const rightEvents = upcoming && upcoming.length > 1 ? upcoming.slice(1).map(v => this.convert(v)) : []
    const current = upcoming && upcoming.length >= 1 ? this.convert(upcoming[0]) : {}

    const videoEnable = e => moment(e.startTime).diff(moment(e.current), 'minutes') <= ENABLE_MEETING_TIME
    return (
      <div className="section">
        <div className="section-title">Upcoming Session</div>

        {!upcoming && <div className="tips">Loading ...</div>}
        {upcoming && upcoming.length <= 0 && <div className="tips">No upcoming sessions.</div>}
        {upcoming && upcoming.length > 0 && (
          <div className="user-lists">
            <div className="items">
              <div className="left-blue">
                <div className="blue-light">
                  <a href="javascript:;" className="user-photo">
                    <UserHead url={current.url} name={current.name} />
                  </a>
                  <a
                    href="javascript:;"
                    onClick={() => this.gotoPatientDetail(current.patientId)}
                    className="user-name">
                    {current.name}
                  </a>
                  <div className="txt uid">{getUid(current.raw.patient.uid)}</div>
                  <div className="txt little">{current.smallTitle}</div>
                  <div className="txt cpap">{current.treatment}</div>
                  <div className="txt temp">{current.daysIntoTreatment}</div>
                  {checkIsCanCancel(current.raw) && (
                    <div className="txt cancel" onClick={() => this.props.onDelete(current.id)}>
                      Cancel this appointment
                    </div>
                  )}
                </div>
                <div className="bottom-blue">
                  <div className="left-txt">
                    <div className="bold-txt">{current.followUp}</div>
                    <div className="time">{current.time}</div>
                    <div className="green-txt">{current.startIn}</div>
                  </div>
                  <div
                    onClick={() => this.gotoVideo(current)}
                    className={`btn-video ${!videoEnable(current) ? 'disabled' : ''}`}
                  />
                </div>
              </div>
            </div>
            {rightEvents.length > 0 && (
              <div className="right-list">
                <ul>
                  {rightEvents.map((item, index) => (
                    <li key={index}>
                      <div className="panel-white">
                        <a href="javascript:;" className="user-photo">
                          <UserHead color="blue" url={item.url} name={item.name} />
                        </a>
                        <a
                          href="javascript:;"
                          onClick={() => this.gotoPatientDetail(item.patientId)}
                          className="blue-name">
                          {item.name}
                        </a>
                        <div className="r-txt uid">{getUid(item.raw.patient.uid)}</div>
                        <div className="r-txt email">{item.raw.patient.email}</div>
                        <div className="bottom-txt">
                          {checkIsCanCancel(item.raw) && (
                            <div className="cancel-link" onClick={() => this.props.onDelete(item.id)}>
                              Cancel this appointment
                            </div>
                          )}
                          <div className="gray-txt">{item.startIn}</div>
                          <div className="time">
                            {item.time} <span className="flex1" />
                            {videoEnable(item) && (
                              <span className="start-link" onClick={() => this.gotoVideo(item)}>
                                START
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
}

UpcomingSession.propTypes = {
  upcoming: PT.array,
}

export default withRouter(UpcomingSession)
