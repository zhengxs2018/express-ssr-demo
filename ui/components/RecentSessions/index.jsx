import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './styles.scss'
import UserHead from '../UserHead'
import { getName, getUid } from '../../services/utils'

/**
 * max item
 * @type {number}
 */
const MAX_ITEM = 4

class RecentSessions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pageIndex: 0,
    }
  }

  showMore() {
    this.setState({ pageIndex: this.state.pageIndex + 1 })
  }

  render() {
    const { sessions } = this.props

    const { pageIndex } = this.state

    const name = e => getName(e.patient)
    const url = e => e.patient.headUrl

    const isShowMore = () => (sessions || []).length > MAX_ITEM * (pageIndex + 1)
    return (
      <div className="section recent-section">
        <div className="section-title">Recent Sessions</div>
        {!sessions && <div className="tips">Loading ...</div>}
        {sessions && sessions.length <= 0 && <div className="tips">No Recent sessions</div>}
        {sessions && sessions.length > 0 && (
          <div className="list-recent">
            <ul className="flex-grid list-recent-grid recent-root">
              {sessions.slice(0, MAX_ITEM * (pageIndex + 1)).map((item, index) => (
                <li key={index}>
                  <div className="panel-white blue panel-recent">
                    <a href="javascript:;" className="user-photo">
                      <UserHead url={url(item)} name={name(item)} color="blue" />
                    </a>
                    <a href="javascript:;" className="blue-name">
                      {name(item)}
                    </a>
                    <div className="r-txt uid">{getUid(item.patient.uid)}</div>
                    <div className="r-txt email">{item.patient.email}</div>
                    <a href="javascript:;" className="bottom-txt">
                      Session Summary
                    </a>
                  </div>
                </li>
              ))}
              {isShowMore() && (
                <li className="show-more">
                  <div className="panel-white flex history">
                    <a href="javascript:;" className="btn-show" onClick={() => this.showMore()}>
                      <i className="icons icon-history" />
                      <span className="txt">Show More</span>
                    </a>
                  </div>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    )
  }
}

RecentSessions.propTypes = {
  sessions: PropTypes.array,
}

export default RecentSessions
