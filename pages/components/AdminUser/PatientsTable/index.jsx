import React, { Component } from 'react'
import PT from 'prop-types'
import { NavLink } from 'react-router-dom'
import Dropdown from '../../Dropdown'
import './styles.scss'

const SORT_ITEMS = [
  {
    label: 'Last name',
    value: 'Last name',
  },
  {
    label: 'First name',
    value: 'First name',
  },
  {
    label: 'Date Added (ascending) ',
    value: 'Date Added (ascending) ',
  },
  {
    label: 'Date Added (descending)',
    value: 'Date Added (descending)',
  },
]

/**
 * patients table component
 */
export default class PatientsTable extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sortBy: SORT_ITEMS[0],
      isFocused: false,
      searchStr: '',
      shownRowNumber: 5,
    }
  }

  viewMore() {
    this.setState({
      shownRowNumber: this.props.data.length,
    })
  }

  render() {
    const { type, data, sortData } = this.props

    const { sortBy, isFocused, searchStr, shownRowNumber } = this.state

    return (
      <div className="table-area ">
        <div className="table-tops flex-grid">
          <div className="left-title">All {type !== 'Secretary' ? type : 'Secretarie'}s</div>
          <div className="right-main flex">
            <div className="drop-link">
              <Dropdown
                title={`${sortBy.label}`}
                items={SORT_ITEMS}
                onSelect={item => {
                  this.setState({
                    sortBy: item,
                  })

                  this.props.changeSortAndSearch(type, item.label, searchStr)
                }}
              />
              <div className="icon desc">
                <img src="/patient-assets/arrow-right.svg" />
              </div>
            </div>

            <div className="serach-module">
              <div className="inputs">
                <a href="javascript:;" className="serach-icons" />
                <input
                  type="text"
                  placeholder="Quick search..."
                  value={searchStr}
                  onFocus={() => this.setState({ isFocused: true })}
                  onBlur={() => this.setState({ isFocused: false })}
                  onChange={event => {
                    this.setState({ searchStr: event.target.value })
                    this.props.changeSortAndSearch(type, sortBy.label, event.target.value)
                  }}
                />
                {searchStr.trim() !== '' && (
                  <a
                    href="javascript:;"
                    className="icons icon-close"
                    onClick={() => {
                      this.setState({ searchStr: '' })
                      this.props.changeSortAndSearch(type, sortBy.label, '')
                    }}
                  />
                )}
              </div>
              {isFocused && searchStr.trim() === '' && (
                <div className="search-panel">
                  <div className="txt">Start typing name, dob, progress status, provider or ID</div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="table-data">
          <div className="row-th">
            <div className="col-th">
              <a href="javascript:;" className="spacing" onClick={() => this.props.clickSort('name')}>
                NAME
                <span
                  className={`icons icon-sort ${
                    sortData.sortColumn === 'name' && sortData.sortOrder === 'asc' ? 'asc' : ''
                  }
                                 ${sortData.sortColumn === 'name' && sortData.sortOrder === 'desc' ? 'desc' : ''}`}
                />
              </a>
            </div>
            <div className="col-th">
              <a href="javascript:;" className="spacing" onClick={() => this.props.clickSort('dob')}>
                DOB
                <span
                  className={`icons icon-sort ${
                    sortData.sortColumn === 'dob' && sortData.sortOrder === 'asc' ? 'asc' : ''
                  }
                                 ${sortData.sortColumn === 'dob' && sortData.sortOrder === 'desc' ? 'desc' : ''}`}
                />
              </a>
            </div>
            <div className="col-th">
              <a href="javascript:;" className="spacing" onClick={() => this.props.clickSort('progressStatus')}>
                PROGRESS STATUS
                <span
                  className={`icons icon-sort ${
                    sortData.sortColumn === 'progressStatus' && sortData.sortOrder === 'asc' ? 'asc' : ''
                  }
                                 ${
                                   sortData.sortColumn === 'progressStatus' && sortData.sortOrder === 'desc'
                                     ? 'desc'
                                     : ''
                                 }`}
                />
              </a>
            </div>
            <div className="col-th">
              <a href="javascript:;" className="spacing" onClick={() => this.props.clickSort('lastSeen')}>
                LAST SEEN
                <span
                  className={`icons icon-sort ${
                    sortData.sortColumn === 'lastSeen' && sortData.sortOrder === 'asc' ? 'asc' : ''
                  }
                                 ${sortData.sortColumn === 'lastSeen' && sortData.sortOrder === 'desc' ? 'desc' : ''}`}
                />
              </a>
            </div>
            <div className="col-th">
              <a href="javascript:;" className="spacing" onClick={() => this.props.clickSort('provided')}>
                PROVIDER
                <span
                  className={`icons icon-sort ${
                    sortData.sortColumn === 'provided' && sortData.sortOrder === 'asc' ? 'asc' : ''
                  }
                                 ${sortData.sortColumn === 'provided' && sortData.sortOrder === 'desc' ? 'desc' : ''}`}
                />
              </a>
            </div>
            <div className="col-th">
              <a href="javascript:;" className="spacing" onClick={() => this.props.clickSort('id')}>
                ID
                <span
                  className={`icons icon-sort ${
                    sortData.sortColumn === 'id' && sortData.sortOrder === 'asc' ? 'asc' : ''
                  }
                                 ${sortData.sortColumn === 'id' && sortData.sortOrder === 'desc' ? 'desc' : ''}`}
                />
              </a>
            </div>
            {type !== 'Patient' && (
              <div className="col-th">
                <a href="javascript:;" className="spacing" onClick={() => this.props.clickSort('expire')}>
                  EXPIRE TIME
                  <span
                    className={`icons icon-sort ${
                      sortData.sortColumn === 'expire' && sortData.sortOrder === 'asc' ? 'asc' : ''
                    }
                                     ${
                                       sortData.sortColumn === 'expire' && sortData.sortOrder === 'desc' ? 'desc' : ''
                                     }`}
                  />
                </a>
              </div>
            )}
            <div className="col-th">
              <div className="spacing" />
            </div>
          </div>
          {data.slice(0, shownRowNumber).map((item, index) => (
            <div className="row-td" key={index}>
              <div className="col-td">
                <div className="spacing">
                  {type === 'Patient' && (
                    <NavLink to="/adminPatientProfile" className="blue-links">
                      {item.name}
                    </NavLink>
                  )}
                  {type !== 'Patient' && (
                    <NavLink to={`/adminPhysicianProfile/${type}`} className="blue-links">
                      {item.name}
                    </NavLink>
                  )}
                </div>
              </div>
              <div className="col-td">
                <div className="spacing">{item.dob}</div>
              </div>
              <div className="col-td">
                <div className="spacing">{item.progressStatus}</div>
              </div>
              <div className="col-td">
                <div className="spacing">{item.lastSeen}</div>
              </div>
              <div className="col-td">
                <div className="spacing">{item.provided}</div>
              </div>
              <div className="col-td">
                <div className="spacing">{item.id}</div>
              </div>
              {type !== 'Patient' && (
                <div className="col-td">
                  {item.expire <= 30 && item.expire > 0 && (
                    <div className="spacing orange-txt">Password expiring in {item.expire} days</div>
                  )}
                  {item.expire === 0 && <div className="spacing red-txt">Password expired</div>}
                </div>
              )}
              <div className="col-td">
                <div className="spacing">
                  {type === 'Patient' && <a href="javascript:;" className="icons icon-edit" />}
                  {type !== 'Patient' && (
                    <a
                      href="javascript:;"
                      className="icons icon-edit"
                      onClick={() => this.props.clickEditProfile(true, item)}
                    />
                  )}
                  <a href="javascript:;" className="icons icon-trash" onClick={() => this.props.deleteItem(index)} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {shownRowNumber < data.length && (
          <div className="bottom-link">
            <a href="javascript:;" className="blue-link" onClick={() => this.viewMore()}>
              View More
            </a>
          </div>
        )}
      </div>
    )
  }
}

PatientsTable.propTypes = {
  type: PT.string,
  data: PT.array,
  sortData: PT.object,
}
