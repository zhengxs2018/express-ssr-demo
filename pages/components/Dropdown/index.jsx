import React, { Component } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import './styles.scss'

/**
 * user head component
 */
export default class Dropdown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
    }
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick)
  }

  /**
   * on select item
   * @param item
   */
  onSelect(item) {
    this.props.onSelect(item)
    this.toggle()
  }

  handleClick(e) {
    if (this.clickNode.contains(e.target)) {
      return
    }
    if (this.popupNode && !this.popupNode.contains(e.target)) {
      this.toggle()
    }
  }

  /**
   * toggle item
   */
  toggle() {
    this.setState({ expanded: !this.state.expanded })
  }

  render() {
    const { items, title } = this.props
    return (
      <div
        className="dropdown-container"
        ref={r => {
          this.clickNode = r
        }}>
        <div className="click-txt" title={title} onClick={() => this.toggle()}>
          {title}
        </div>
        {this.state.expanded && (
          <div
            className="popup"
            ref={r => {
              this.popupNode = r
            }}>
            {_.map(items, item => (
              <div className="item" onClick={() => this.onSelect(item)} key={item.value}>
                {item.label}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
}

Dropdown.propTypes = {
  items: PT.array,
  title: PT.string,
  onSelect: PT.func,
}
