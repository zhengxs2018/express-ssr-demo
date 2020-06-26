import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PT from 'prop-types'
import Dropdown from '../../Dropdown'
import './styles.scss'

const SORT_ITEMS = [
  {
    label: 'Newest First',
    value: 'Newest First',
  },
  {
    label: 'Oldest First',
    value: 'Oldest First',
  },
  {
    label: 'Alphabetical (ascending)',
    value: 'Alphabetical (ascending)',
  },
  {
    label: 'Alphabetic (descending)',
    value: 'Alphabetic (descending)',
  },
]

/**
 * Patient forms right sidebar component
 */
export default class PatientFormsRightSidebar extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      data: this.props.data,
      fileSortBy: SORT_ITEMS[0],
      showAddBy: false,
      shownTipsIndex: -1,
    }

    this.handleOutsideClickHandler = this.handleOutsideClickHandler.bind(this)
  }

  componentDidMount() {
    // document.addEventListener('click', this.handleOutsideClickHandler, false)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data,
    })
  }

  componentWillUnmount() {
    // document.removeEventListener('click', this.handleOutsideClickHandler, false)
  }

  handleFileChange(event) {
    this.state.data.push({
      fileType: 'pdf',
      fileName: event.target.files[0].name,
      addedBy: 'Dr.Sleepest',
      addedTime: new Date().toGMTString(),
      requestedToDelete: false,
    })

    this.setState({
      data: this.state.data,
    })
  }

  // handleOutsideClick
  handleOutsideClickHandler(event) {
    if (!ReactDOM.findDOMNode(this).contains(event.target)) {
      this.setState({
        shownTipsIndex: -1,
        showAddBy: false,
      })
    }
  }

  // handle checkbox change
  handleCheckboxChange = index => event => {
    const data = this.state.data
    data.forEach((fileItem, fileIndex) => {
      if (index === fileIndex) {
        fileItem.checked = event.target.checked
      }
    })
    this.setState({ data })
  }

  unselectFiles() {
    this.state.data.forEach(fileItem => {
      fileItem.checked = false
    })

    this.setState({ data: this.state.data })
  }

  selectedFiles() {
    const newArray = []
    this.state.data.forEach(fileItem => {
      if (fileItem.checked) {
        newArray.push(fileItem)
      }
    })

    return newArray
  }

  render() {
    const { data, fileSortBy, showAddBy, shownTipsIndex } = this.state

    return (
      <div className="right-aside">
        <a href="javascript:;" className="icons resize-btn" onClick={() => this.props.selectPatientForms(false)} />
        <div className="inner">
          <div className="titles flex-grid ">
            Patient Forms
            <div className="rights haveclose">
              <a href="javascript:;" className="icons btn-add">
                <input type="file" onChange={event => this.handleFileChange(event)} />
              </a>
              <a href="javascript:;" className="icons top-close" onClick={() => this.props.selectPatientForms(false)} />
            </div>
          </div>
          <div className="two-drop flex-grid">
            <div className="lefts">
              <div className={`drop-wrap ${showAddBy ? 'open' : ''}`}>
                <a
                  href="javascript:;"
                  className="drop-btn"
                  onClick={() => this.setState({ showAddBy: !showAddBy, shownTipsIndex: -1 })}>
                  Added by
                  <i className="icons icon-drop" />
                </a>
                <div className="drop-panel">
                  <ul>
                    <li>
                      <div className="checkbox-wrap">
                        <input type="checkbox" id="Name1" />
                        <label htmlFor="Name1">Name 1</label>
                      </div>
                    </li>
                    <li>
                      <div className="checkbox-wrap">
                        <input type="checkbox" id="Name2" />
                        <label htmlFor="Name2">Name 2</label>
                      </div>
                    </li>
                    <li>
                      <div className="checkbox-wrap">
                        <input type="checkbox" id="Name3" />
                        <label htmlFor="Name3">Name 3</label>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="rights flex" onClick={() => this.setState({ showAddBy: false })}>
              <Dropdown
                title={`${fileSortBy.label}`}
                items={SORT_ITEMS}
                onSelect={item => {
                  this.setState({
                    fileSortBy: item,
                  })
                  this.props.onFileSortChange(item.label)
                }}
              />
              <div className="icon desc">
                <img src="/patient-assets/arrow-right.svg" />
              </div>
            </div>
          </div>
          <div className="gray-box-list">
            <ul>
              {this.selectedFiles().length > 0 && (
                <li>
                  <div className="blue-box">
                    <div className="white-title">{this.selectedFiles().length} files selected</div>
                    <a href="javascript:;" className="icons btn-close" onClick={() => this.unselectFiles()} />
                    <div className="tools">
                      <a href="javascript:;" className="icons icon-download" />
                      <a
                        href="javascript:;"
                        className={`icons icon-print ${this.selectedFiles().length > 1 ? 'disabled' : ''}`}
                      />
                      <a href="javascript:;" className="icons icon-send" />
                      <a
                        href="javascript:;"
                        className="icons icon-trash"
                        onClick={() => this.props.clickFileDelete(this.selectedFiles())}
                      />
                    </div>
                  </div>
                </li>
              )}
              {data.map((item, index) => (
                <li key={index}>
                  <div className="gray-box">
                    <div className="checkbox-wrap">
                      <input
                        type="checkbox"
                        id={`check-${index}`}
                        checked={item.checked === true}
                        onChange={this.handleCheckboxChange(index)}
                      />
                      <label htmlFor={`check-${index}`} />
                    </div>
                    <div className={`top-tips ${shownTipsIndex === index ? 'open' : ''}`}>
                      <a
                        href="javascript:;"
                        className="icons btn-more"
                        onClick={() => this.setState({ shownTipsIndex: index })}
                      />
                      <div className="tip-panel">
                        <ul>
                          <li>
                            <a href="javascript:;" className="icon-link">
                              <i className="icons icon-download" />
                              <span className="txt">Download</span>
                            </a>
                          </li>
                          <li>
                            <a href="javascript:;" className="icon-link">
                              <i className="icons icon-print" />
                              <span className="txt">Print</span>
                            </a>
                          </li>
                          <li>
                            <a href="javascript:;" className="icon-link">
                              <i className="icons icon-send" />
                              <span className="txt">Send to</span>
                            </a>
                          </li>
                          <li>
                            <a
                              href="javascript:;"
                              className="icon-link"
                              onClick={() => {
                                this.props.clickFileDelete([item])
                                this.setState({
                                  shownTipsIndex: -1,
                                })
                              }}>
                              <i className="icons icon-trash" />
                              <span className="txt">Delete</span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="center-txt">
                      <div className="blue-title">
                        <i className={`icons icon-${item.fileType}`} />
                        <a href="javascript:;" className="blue-link">
                          {item.fileName}
                        </a>
                      </div>
                      <div className="gray-txts">
                        <div className="txt">Added by {item.addedBy}</div>
                        <div className="txt">{item.addedTime}</div>
                      </div>
                    </div>
                  </div>
                  {item.requestedToDelete && (
                    <div className="gray-bottom flex">
                      <i className="icons icon-red-trash" />
                      <div className="txt">Requested to delete</div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

PatientFormsRightSidebar.propTypes = {
  data: PT.array,
}
