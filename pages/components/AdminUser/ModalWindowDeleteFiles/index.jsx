import React, { Component } from 'react'
import PT from 'prop-types'
import './styles.scss'

/**
 * modal window delete files component
 */
export default class ModalWindowDeleteFiles extends Component {
  render() {
    const { deletedFileList } = this.props

    return (
      <div className="modal-detele">
        <div className="modal-content">
          <div className="title">Delete Files</div>
          <p className="txt">Are you sure you want to delete these files?</p>
          <ul className="list">
            {deletedFileList.map((item, index) => (
              <li key={index}>
                <i className={`icon icon-${item.fileType}`} />
                <a href="javascript:;">{item.fileName}</a>
              </li>
            ))}
          </ul>
          <div className="bot-btn">
            <a href="javascript:;" className="btn-delete" onClick={() => this.props.confirmFileDelete(true)}>
              Delete
            </a>
            <a href="javascript:;" className="btn-cancel" onClick={() => this.props.confirmFileDelete(false)}>
              Cancel
            </a>
          </div>
        </div>
      </div>
    )
  }
}

ModalWindowDeleteFiles.propTypes = {
  deletedFileList: PT.array,
}
