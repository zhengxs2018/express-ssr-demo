import React, { Component } from 'react'
import PT from 'prop-types'
import './styles.scss'

/**
 * user head component
 */
export default class UserHead extends Component {
  render() {
    const { url, name, color, fontSize } = this.props
    const text = name.substr(0, 2)
    const style = {}
    if (fontSize) {
      style.fontSize = fontSize
    }
    return (
      <div className={`user-header-container ${color}`} style={style}>
        {text}
        {url && <img src={url} className="user-head-img" alt="user-head" />}
      </div>
    )
  }
}

UserHead.propTypes = {
  url: PT.string,
  name: PT.string,
  color: PT.string,
  fontSize: PT.number,
}
