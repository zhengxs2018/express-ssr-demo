import React, { Component } from 'react'
import PT from 'prop-types'
import './styles.scss'

/**
 * modal window confirm component
 */
export default class ModalWindowConfirm extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      textareaInput: '',
    }

    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.value

    this.setState({
      textareaInput: value,
    })
  }

  render() {
    const { title, description, confirmButtonText, showTextarea, showPassword } = this.props

    return (
      <div className="modal-confirm">
        <div className="modal-content">
          <div className="title">{title}</div>
          <p className="txt" dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br/>') }} />
          {showTextarea && (
            <textarea value={this.state.textareaInput} onChange={event => this.handleInputChange(event)} />
          )}
          {showPassword && (
            <input
              autoFocus
              type="password"
              value={this.state.textareaInput}
              onChange={event => this.handleInputChange(event)}
            />
          )}
          <div className="bottom-btn">
            <a
              href="javascript:;"
              className={`btn-yes ${
                showTextarea || showPassword ? (this.state.textareaInput === '' ? 'disabled' : '') : ''
              }`}
              onClick={() => this.props.clickConfirm(true)}>
              {confirmButtonText || 'Yes'}
            </a>
            <a href="javascript:;" className="btn-cancel" onClick={() => this.props.clickConfirm(false)}>
              Cancel
            </a>
          </div>
        </div>
      </div>
    )
  }
}

ModalWindowConfirm.propTypes = {
  title: PT.string,
  description: PT.string,
  confirmButtonText: PT.string,
}
