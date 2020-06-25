import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './styles.scss'

class Questionnaire extends Component {
  constructor(props) {
    super(props)

    this.state = {
      questionnaire: this.props.questionnaire,
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.clickQuestion = this.clickQuestion.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  // handle input change
  handleInputChange = questionIndex => event => {
    this.state.questionnaire.forEach((item, index) => {
      if (questionIndex === index) {
        item.answer = event.target.value
      }
    })

    this.setState({
      questionnaire: this.state.questionnaire,
    })
  }

  // click Question
  clickQuestion = questionIndex => () => {
    this.state.questionnaire.forEach((item, index) => {
      if (questionIndex === index) {
        item.status = 'typing'
      } else if (item.answer.trim() !== '') {
        item.status = 'answered'
      } else {
        item.status = ''
      }
    })

    this.setState({
      questionnaire: this.state.questionnaire,
    })
  }

  // handle Key Down
  handleKeyDown = questionIndex => event => {
    if (event.key === 'Enter') {
      this.state.questionnaire.forEach((item, index) => {
        if (questionIndex === index) {
          if (item.answer.trim() !== '') {
            item.status = 'answered'
          } else {
            item.status = ''
          }
        }
      })

      this.setState({
        questionnaire: this.state.questionnaire,
      })
    }
  }

  render() {
    return (
      <div className="left-area">
        <a className="back-btn" href="/appointments">
          {'< Back To Appointments'}
        </a>
        <h4 className="question-title">Questionnaire</h4>
        <div className="question-list">
          {this.state.questionnaire.map((item, index) => (
            <div
              className={`list-panel ${item.status === 'typing' ? 'current' : ''} ${
                item.status === 'answered' ? 'current green' : ''
              }`}
              key={index}
              onClick={this.clickQuestion(index)}>
              <div className="question-txt">{item.question}</div>
              <div className="inputs">
                <input
                  type="text"
                  placeholder="Capturing answer..."
                  value={item.answer}
                  onChange={this.handleInputChange(index)}
                  onKeyDown={this.handleKeyDown(index)}
                />
              </div>
              <div className="bold-txt">{item.answer}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

Questionnaire.propTypes = {
  questionnaire: PropTypes.array,
}

export default Questionnaire
