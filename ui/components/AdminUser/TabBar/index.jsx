import React, { Component } from 'react'
import PT from 'prop-types'
import './styles.scss'

/**
 * tab bar component
 */
export default class TabBar extends Component {
  render() {
    const { tabsList, shownTab } = this.props

    return (
      <div className="tab-navs">
        <ul className="flex">
          {tabsList.map((item, index) => (
            <li key={index}>
              <a
                href="javascript:;"
                className={`tab-itmes ${shownTab === item ? 'current' : ''}`}
                onClick={() => this.props.selectTab(item)}>
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

TabBar.propTypes = {
  tabsList: PT.array,
  shownTab: PT.string,
}
