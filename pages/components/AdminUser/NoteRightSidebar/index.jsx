import React, { Component } from 'react'
import PT from 'prop-types'
import './styles.scss'

/**
 * note right sidebar component
 */
export default class NoteRightSidebar extends Component {
  render() {
    const { notes } = this.props

    return (
      <div className="right-aside note-right-aside">
        <div className="inner">
          <div className="titles flex-grid">
            Notes
            <div className="rights">
              <a href="javascript:;" className="icons btn-add" />
            </div>
          </div>
          <div className="note-list">
            <ul>
              {notes.map((item, index) => (
                <li key={index}>
                  <div className="items">
                    <a href="javascript:;" className="icons btn-more" />
                    <div className="txt">{item.description}</div>
                    <div className="date">{item.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bottom-img">
          <img src="patient-assets/chart-demo-img.png" alt="img" />
        </div>
      </div>
    )
  }
}

NoteRightSidebar.propTypes = {
  notes: PT.array,
}
