import React, { Component } from 'react'
import PT from 'prop-types'
import './styles.scss'

/**
 * top info bar component
 */
export default class TopInfoBar extends Component {
  render() {
    const { type, title, subTitle, timeCount } = this.props

    return (
      <div className={`top-info-bar flex-grid ${type === 'done' ? 'reset-password' : ''}`}>
        <div className="lefts">
          <i className="icons icon-white-trash" />
          <i className="icons icon-done" />
          <span className="txt reset-password">
            {title}
            <span className="thin">{subTitle}</span>
          </span>
        </div>
        <div className="rights">
          <span className="line-txt">
            <span className="txt">{timeCount}s</span>
          </span>
          <a href="javascript:;" className="icons btn-close" onClick={() => this.props.clearCount()} />
        </div>
      </div>
    )
  }
}

TopInfoBar.propTypes = {
  type: PT.string,
  title: PT.string,
  subTitle: PT.string,
  timeCount: PT.number,
}
