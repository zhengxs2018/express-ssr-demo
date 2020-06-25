import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './styles.scss'

class AppointmentsRightSidebar extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const { tasksAndReminders, messages } = this.props

    return (
      <div className="right-aside">
        <div className="add-items borders">
          <div className="title-bar flex-grid">
            <div className="left-title">18 Tasks & Reminders</div>
            <a href="javascript:;" className="icons icon-add" />
          </div>
          <div className="list">
            {tasksAndReminders.map((item, index) => (
              <div className="line-items" key={index}>
                {item.readed === true && <i className="icons icon-done" />}
                <div className="right-txt">
                  <div className="black-txt">{item.title}</div>
                  <div className="date">{item.date}</div>
                </div>
              </div>
            ))}
            <a href="javascript:;" className="blue-links view-all">
              View All
            </a>
          </div>
        </div>
        <div className="add-items message-items">
          <div className="title-bar flex-grid">
            <div className="left-title">Messages</div>
            <a href="javascript:;" className="icons icon-add" />
          </div>
          <div className="list">
            {messages.map((item, index) => (
              <div className="line-items user" key={index}>
                <a href="javascript:;" className="user-photo">
                  <img src={item.photoUrl} alt="img" />
                </a>
                <div className="right-txt">
                  <a href="javascript:;" className="blue-links">
                    {item.userName}
                  </a>
                  <div
                    className={`txt ${!item.readed ? 'bold' : ''}`}
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                  <div className="bold txt hide">
                    <a href="javascript:;" className="blue-links">
                      David Banes
                    </a>{' '}
                    has requested CPAP Supply.
                  </div>
                </div>
                <span className="top-txt">{item.time}</span>
              </div>
            ))}
            <a href="javascript:;" className="blue-links view-all ml34">
              View All
            </a>
          </div>
        </div>
      </div>
    )
  }
}

AppointmentsRightSidebar.propTypes = {
  tasksAndReminders: PropTypes.array,
  messages: PropTypes.array,
}

export default AppointmentsRightSidebar
