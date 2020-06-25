import React, { Component } from 'react'
import PT from 'prop-types'
import './styles.scss'

/**
 * physician about component
 */
export default class PhysicianAbout extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: this.props.data,
      editStatus: false,
      previousValue: '',
    }
    this.handleTextareaChange = this.handleTextareaChange.bind(this)
  }

  handleTextareaChange(event) {
    const target = event.target
    const value = target.value

    this.state.data.content = value
    this.setState({
      data: this.state.data,
    })
  }

  render() {
    const { data, editStatus, previousValue } = this.state

    return (
      <div className="right-white-panel">
        <div className={`text-wrap ${editStatus ? 'edit-status' : ''}`}>
          <a
            href="javascript:;"
            className="btn-edit"
            onClick={() => this.setState({ editStatus: true, previousValue: data.content })}
          />
          <div className="title">About</div>
          <div className="txt-box" dangerouslySetInnerHTML={{ __html: data.content.replace(/\n/g, '<br/>') }} />
          <div className="textareas">
            <textarea value={data.content} onChange={this.handleTextareaChange} />
          </div>
          <div className="bottom-btn">
            <a
              href="javascript:;"
              className="btn btn-blue-border"
              onClick={() => this.setState({ editStatus: false, data: { content: previousValue } })}>
              Cancel
            </a>
            <a href="javascript:;" className="btn btn-blue" onClick={() => this.setState({ editStatus: false })}>
              Submit
            </a>
          </div>
        </div>
      </div>
    )
  }
}

PhysicianAbout.propTypes = {
  data: PT.object,
}
