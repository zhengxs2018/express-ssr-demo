import React, { Component } from 'react'
import PT from 'prop-types'
import './styles.scss'

/**
 * system status component
 */
export default class SystemStatus extends Component {
  render() {
    const { data } = this.props

    return (
      <div className="white-panel rights">
        <div className="top-area">
          <div className="titles">System status</div>
          <a href="javascript:;" className="btn btn-green">
            All Systems Operational
          </a>
          <div className="list-done">
            {data.map((item, index) => (
              <div className="txt-area" key={index}>
                <i className="icons icon-done" />
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

SystemStatus.propTypes = {
  data: PT.array,
}
