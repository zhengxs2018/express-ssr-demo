import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PT from 'prop-types'
import _ from 'lodash'
import ModalWindowConfirm from '../ModalWindowConfirm'
import './styles.scss'

const WEEK_ARRAY = [
  {
    label: 'M',
    fullLabel: 'Monday',
    checked: false,
  },
  {
    label: 'T',
    fullLabel: 'Tuesday',
    checked: false,
  },
  {
    label: 'W',
    fullLabel: 'Wednesday',
    checked: false,
  },
  {
    label: 'T',
    fullLabel: 'Thursday',
    checked: false,
  },
  {
    label: 'F',
    fullLabel: 'Friday',
    checked: false,
  },
  {
    label: 'S',
    fullLabel: 'Saturday',
    checked: false,
  },
  {
    label: 'S',
    fullLabel: 'Sunday',
    checked: false,
  },
]

const TIME_ARRAY = [
  {
    label: '8: 30 AM',
    index: 0,
  },
  {
    label: '9: 00 AM',
    index: 1,
  },
  {
    label: '9: 30 AM',
    index: 2,
  },
  {
    label: '10: 00 AM',
    index: 3,
  },
  {
    label: '10: 30 AM',
    index: 4,
  },
  {
    label: '11: 00 AM',
    index: 5,
  },
  {
    label: '11: 30 AM',
    index: 6,
  },
  {
    label: '12: 00 PM',
    index: 7,
  },
  {
    label: '12: 30 PM',
    index: 8,
  },
  {
    label: '1: 00 PM',
    index: 9,
  },
  {
    label: '1: 30 PM',
    index: 10,
  },
  {
    label: '2: 00 PM',
    index: 11,
  },
  {
    label: '2: 30 PM',
    index: 12,
  },
  {
    label: '3: 00 PM',
    index: 13,
  },
  {
    label: '3: 30 PM',
    index: 14,
  },
  {
    label: '4: 00 PM',
    index: 15,
  },
  {
    label: '4: 30 PM',
    index: 16,
  },
]

/**
 * physician availability right sidebar component
 */
export default class PhysicianAvailabilityRightSidebar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: this.props.data,
      shownTipsIndex: -1,
      showForm: 'List', // 'List', 'Add', 'Edit',
      addEditFormData: null,
      showMaxRangeError: false,
      showRangeConflictError: false,
      showDeleteConfirmModal: false,
      deleteFromListData: {},
    }

    this.handleOutsideClickHandler = this.handleOutsideClickHandler.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
  }

  componentDidMount() {
    document.addEventListener('click', this.handleOutsideClickHandler, false)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClickHandler, false)
  }

  // handleOutsideClick
  handleOutsideClickHandler(event) {
    if (!ReactDOM.findDOMNode(this).contains(event.target)) {
      this.setState({
        shownTipsIndex: -1,
      })
    }
  }

  clickConfirmDelete(isConfirmed) {
    if (isConfirmed) {
      this.setState({
        showDeleteConfirmModal: false,
      })

      this.state.data[this.state.deleteFromListData.weekDayIndex].timeList.splice(
        this.state.deleteFromListData.timeIndex,
        1
      )

      this.setState({
        data: this.state.data,
      })
    } else {
      this.setState({
        showDeleteConfirmModal: false,
      })
    }
  }

  // click Add
  clickAdd(isOpen) {
    if (isOpen) {
      this.setState({
        addEditFormData: {
          weekArray: _.cloneDeep(WEEK_ARRAY),
          timeList: [
            {
              start: '',
              end: '',
            },
          ],
        },
        showMaxRangeError: false,
      })
    }

    this.setState({
      showForm: isOpen ? 'Add' : 'List',
    })
  }

  // click Save Add
  clickSaveAdd() {
    const weekArrayPrevious = _.cloneDeep(this.state.data)
    let conflictGlobal = false

    this.state.addEditFormData.weekArray.forEach(weekItem => {
      if (weekItem.checked) {
        this.state.data.forEach((item, index) => {
          if (weekItem.fullLabel === item.weekDay) {
            this.state.addEditFormData.timeList.forEach((timeItem, timeIndex) => {
              let conflict = false

              item.timeList.forEach((listItem, listIndex) => {
                if (
                  this.getStartOptionIndex('addEdit', null, timeIndex, 'start') >=
                    this.getStartOptionIndex('list', index, listIndex, 'end') ||
                  this.getStartOptionIndex('addEdit', null, timeIndex, 'end') <=
                    this.getStartOptionIndex('list', index, listIndex, 'start')
                ) {
                  // no conflict
                } else {
                  conflict = true
                  conflictGlobal = true
                }
              })

              if (!conflict) {
                item.timeList.push(timeItem)
              }
            })
          }
        })
      }
    })

    if (!conflictGlobal) {
      this.setState({
        data: this.state.data,
        showForm: 'List',
        showRangeConflictError: false,
      })
    } else {
      this.setState({
        data: weekArrayPrevious,
        showRangeConflictError: true,
      })
    }
  }

  // click Edit
  clickEdit(isOpen, weekDay, timeItem) {
    if (isOpen) {
      const weekArrayData = _.cloneDeep(WEEK_ARRAY)
      weekArrayData.forEach(item => {
        if (item.fullLabel === weekDay) {
          item.checked = true
        }
      })

      this.setState({
        addEditFormData: {
          weekArray: weekArrayData,
          timeList: [timeItem],
        },
        showMaxRangeError: false,
      })
    }

    this.setState({
      showForm: isOpen ? 'Edit' : 'List',
    })
  }

  // check Weekday
  checkWeekday(index) {
    this.state.addEditFormData.weekArray[index].checked = !this.state.addEditFormData.weekArray[index].checked

    this.setState({
      addEditFormData: this.state.addEditFormData,
    })
  }

  // click Delete from Add Edit form
  clickDeleteFromAddEdit(timeIndex) {
    this.state.addEditFormData.timeList.splice(timeIndex, 1)

    this.setState({
      data: this.state.data,
      showMaxRangeError: false,
    })
  }

  // click Add Time Range
  clickAddTimeRange() {
    if (this.state.addEditFormData.timeList.length < 4) {
      this.state.addEditFormData.timeList.push({
        start: '',
        end: '',
      })

      this.setState({
        data: this.state.data,
        showMaxRangeError: false,
      })
    } else {
      this.setState({
        showMaxRangeError: true,
      })
    }
  }

  handleSelectChange(value, index, startEndType) {
    this.state.role = value
    this.state.addEditFormData.timeList[index][startEndType] = value

    this.setState({
      data: this.state.data,
    })
  }

  // get Start Option Index
  getStartOptionIndex(source, weekIndex, timeIndex, dayType) {
    let startOptionLabel = ''
    if (source === 'addEdit') {
      startOptionLabel = this.state.addEditFormData.timeList[timeIndex][dayType]
        ? this.state.addEditFormData.timeList[timeIndex][dayType]
        : ''
    } else if (source === 'list') {
      startOptionLabel = this.state.data[weekIndex].timeList[timeIndex][dayType]
        ? this.state.data[weekIndex].timeList[timeIndex][dayType]
        : ''
    }

    let startOptionIndex = -1
    TIME_ARRAY.forEach(item => {
      if (item.label === startOptionLabel) {
        startOptionIndex = item.index
      }
    })

    return startOptionIndex
  }

  // get week day selected list
  getWeekdaySelectedList() {
    let str = ''
    let matchedNumber = 0
    this.state.addEditFormData.weekArray.forEach(item => {
      if (item.checked) {
        str += (matchedNumber === 0 ? '' : ', ') + item.fullLabel
        matchedNumber += 1
      }
    })

    return str
  }

  isFormValid() {
    let weekArrayValid = false
    let timeListValid = true

    this.state.addEditFormData.weekArray.forEach(item => {
      if (item.checked) {
        weekArrayValid = true
      }
    })

    this.state.addEditFormData.timeList.forEach(item => {
      if (item.start === '' || item.end === '') {
        timeListValid = false
      }
    })

    return weekArrayValid && timeListValid
  }

  render() {
    const {
      data,
      shownTipsIndex,
      showForm,
      addEditFormData,
      showMaxRangeError,
      showRangeConflictError,
      showDeleteConfirmModal,
    } = this.state

    return (
      <div className="right-aside">
        {showDeleteConfirmModal && (
          <ModalWindowConfirm
            title="Warning!"
            description={
              'You are about to delete this physician&acute;s time slot \
                           and cancel all future appointments in these time slots. \
                           Make sure any appointments during this time have been rescheduled.<br/>\
                           Enter your Admin Password to confirm'
            }
            confirmButtonText="Confirm"
            showPassword
            clickConfirm={isConfirmed => this.clickConfirmDelete(isConfirmed)}
          />
        )}
        {showForm === 'List' && (
          <div className="inner">
            <div className="titles">Availability </div>
            <a href="javascript:;" className="btn-add" onClick={() => this.clickAdd(true)} />
            <div className="time-box">
              {data.map((item, index) => (
                <div className={`group ${item.timeList.length === 0 ? 'hide' : ''}`} key={index}>
                  <div className="sm-title">{item.weekDay}</div>
                  {item.timeList.map((timeItem, timeIndex) => (
                    <div className="time-div" key={timeIndex}>
                      <span className="time">
                        {timeItem.start} - {timeItem.end}
                      </span>
                      <a
                        href="javascript:;"
                        className="btn-more"
                        onClick={() => this.setState({ shownTipsIndex: index * 10000 + timeIndex })}
                      />
                      <ul className={`tool ${shownTipsIndex === index * 10000 + timeIndex ? '' : 'hide'}`}>
                        <li>
                          <i className="icon icon-edit" />
                          <a
                            href="javascript:;"
                            className="name"
                            onClick={() => this.clickEdit(true, item.weekDay, timeItem)}>
                            Edit
                          </a>
                        </li>
                        <li>
                          <i className="icon icon-delete" />
                          <a
                            href="javascript:;"
                            className="name"
                            // onClick={() => this.clickDeleteFromList(index, timeIndex)}
                            onClick={() => {
                              this.setState({
                                deleteFromListData: {
                                  weekDayIndex: index,
                                  timeIndex,
                                },
                              })
                              this.setState({ shownTipsIndex: -1, showDeleteConfirmModal: true })
                            }}>
                            Delete
                          </a>
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {(showForm === 'Add' || showForm === 'Edit') && (
          <div className="inner">
            <div className="titles">{showForm} Availability </div>
            <a href="javascript:;" className="btn-close" onClick={() => this.clickAdd(false)} />
            <div className="add-box">
              <div className="add-group">
                <div className="tit">Select Day(s)</div>
                <div className="day-box">
                  {addEditFormData.weekArray.map((item, index) => (
                    <a
                      href="javascript:;"
                      key={index}
                      className={`${item.checked ? 'active' : ''}`}
                      onClick={() => this.checkWeekday(index)}>
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
              <div className="add-group">
                <div className="tit">Time Range</div>
                {addEditFormData.timeList.map((timeItem, timeIndex) => (
                  <div className="row-line" key={timeIndex}>
                    <div className="input-area w-100">
                      <a href="javascript:;" className="sel_mask">
                        <span>{timeItem.start === '' ? 'From' : timeItem.start} </span>
                        <img src="/drop-arrow.svg" />
                        <select
                          className="sel"
                          value={timeItem.start}
                          onChange={event => {
                            this.handleSelectChange(event.target.value, timeIndex, 'start')
                            this.handleSelectChange('', timeIndex, 'end')
                          }}>
                          {TIME_ARRAY.map((optionItem, optionIndex) => (
                            <option key={optionIndex}>{optionItem.label}</option>
                          ))}
                        </select>
                      </a>
                    </div>
                    <span className="txt">-</span>
                    <div className="input-area w-100">
                      <a href="javascript:;" className="sel_mask">
                        <span>{timeItem.end === '' ? 'To' : timeItem.end} </span>
                        <img src="/drop-arrow.svg" />
                        <select
                          className="sel"
                          value={timeItem.end}
                          onChange={event => this.handleSelectChange(event.target.value, timeIndex, 'end')}>
                          {TIME_ARRAY.map((optionItem, optionIndex) => (
                            <option
                              key={optionIndex}
                              className={`${
                                optionItem.index <= this.getStartOptionIndex('addEdit', null, timeIndex, 'start')
                                  ? 'hide'
                                  : ''
                              }`}>
                              {optionItem.label}
                            </option>
                          ))}
                        </select>
                      </a>
                    </div>
                    {timeIndex > 0 && (
                      <a
                        href="javascript:;"
                        className="btn-delete"
                        onClick={() => this.clickDeleteFromAddEdit(timeIndex)}
                      />
                    )}
                  </div>
                ))}
                {showMaxRangeError && <span className="error-txt">You cannot add more than 4 time ranges per day</span>}

                {showRangeConflictError && <span className="error-txt">Time range is conflict.</span>}

                <div className="btn-rowmore">
                  <a href="javascript:;" onClick={() => this.clickAddTimeRange()}>
                    Add Time Range
                  </a>
                </div>
              </div>

              <div className="bot-btn">
                <a
                  href="javascript:;"
                  className={`btn-blue ${this.isFormValid() ? '' : 'disabled'}`}
                  onClick={() => this.clickSaveAdd()}>
                  Submit
                </a>
                <a href="javascript:;" className="btn-cancel" onClick={() => this.clickAdd(false)}>
                  Cancel
                </a>
              </div>

              <div className="bot-txt">
                <p>Selected time ranges will be applied for {this.getWeekdaySelectedList()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

PhysicianAvailabilityRightSidebar.propTypes = {
  data: PT.array,
}
