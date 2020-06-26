import React, { Component } from 'react'
import PT from 'prop-types'
import './styles.scss'

/**
 * bar chart component
 */
export default class BarChart extends Component {
  // max Bar Value
  maxBarValue() {
    let maxValue = 0
    this.props.data.barList.forEach(item => {
      if (item.completed + item.upcoming > maxValue) {
        maxValue = item.completed + item.upcoming
      }
    })

    return maxValue
  }

  render() {
    const { data } = this.props

    return (
      <div className="white-panel lefts">
        <div className="top-bar flex-grid">
          <i className="icons icon-calender" />
          <div className="right-info flex-grid">
            <div className="total-chart flex">
              <img src="circle-chart.png" alt="img" />
              <div className="txt-area">
                <div className="number">{data.totalAppointments}</div>
                <div className="txt">Total Appointments</div>
              </div>
            </div>
            <div className="item-info">
              <div className="number green">{data.completed}</div>
              <div className="txt">Completed</div>
            </div>
            <div className="item-info">
              <div className="number blue">{data.upcoming}</div>
              <div className="txt">Upcoming</div>
            </div>
          </div>
        </div>
        <div className="chart-area">
          <ul className="flex-grid">
            {data.barList.map((item, index) => (
              <li key={index}>
                <div className="color-bar bottom-line">
                  <div
                    className="color-wrap"
                    style={{ height: `${((item.completed + item.upcoming) / this.maxBarValue()) * 100}%` }}>
                    <div
                      className={`blue-height bottom-line ${item.completed === 0 ? 'height-full' : ''}`}
                      style={{ height: `${(item.upcoming / (item.completed + item.upcoming)) * 100}%` }}
                    />
                    <span className="num">{item.total !== 0 ? item.total : ''}</span>
                  </div>
                </div>
                <span className="txt">{item.month}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

BarChart.propTypes = {
  data: PT.object,
}
