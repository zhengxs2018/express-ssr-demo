import React, { Component } from 'react'

import PT from 'prop-types'

import Link from 'next/link'

import './styles.scss'

/**
 * delete history table component
 */
export default class DeleteHistoryTable extends Component {
  constructor(props) {
    super(props)

    this.state = {
      shownRowNumber: 5,
    }
  }

  viewMore() {
    this.setState({
      shownRowNumber: this.props.data.length,
    })
  }

  render() {
    const { data, sortData } = this.props

    const { shownRowNumber } = this.state

    return (
      <div className="table-area">
        <div className="table-data">
          <div className="row-th">
            <div className="col-th">
              <a href="javascript:;" className="spacing" onClick={() => this.props.clickSort('name')}>
                PATIENT
                <span
                  className={`icons icon-sort ${
                    sortData.sortColumn === 'name' && sortData.sortOrder === 'asc' ? 'asc' : ''
                  }
                                       ${
                                         sortData.sortColumn === 'name' && sortData.sortOrder === 'desc' ? 'desc' : ''
                                       }`}
                />
              </a>
            </div>
            <div className="col-th">
              <a href="javascript:;" className="spacing" onClick={() => this.props.clickSort('fileName')}>
                FILE NAME
                <span
                  className={`icons icon-sort ${
                    sortData.sortColumn === 'fileName' && sortData.sortOrder === 'asc' ? 'asc' : ''
                  }
                                       ${
                                         sortData.sortColumn === 'fileName' && sortData.sortOrder === 'desc'
                                           ? 'desc'
                                           : ''
                                       }`}
                />
              </a>
            </div>
            <div className="col-th">
              <a href="javascript:;" className="spacing" onClick={() => this.props.clickSort('requestedBy')}>
                REQUESTED BY
                <span
                  className={`icons icon-sort ${
                    sortData.sortColumn === 'requestedBy' && sortData.sortOrder === 'asc' ? 'asc' : ''
                  }
                                       ${
                                         sortData.sortColumn === 'requestedBy' && sortData.sortOrder === 'desc'
                                           ? 'desc'
                                           : ''
                                       }`}
                />
              </a>
            </div>
            <div className="col-th">
              <a href="javascript:;" className="spacing" onClick={() => this.props.clickSort('requestedDate')}>
                REQUESTED DATE
                <span
                  className={`icons icon-sort ${
                    sortData.sortColumn === 'requestedDate' && sortData.sortOrder === 'asc' ? 'asc' : ''
                  }
                                       ${
                                         sortData.sortColumn === 'requestedDate' && sortData.sortOrder === 'desc'
                                           ? 'desc'
                                           : ''
                                       }`}
                />
              </a>
            </div>
            <div className="col-th">
              <a href="javascript:;" className="spacing" onClick={() => this.props.clickSort('processedDate')}>
                PROCESSED DATE
                <span
                  className={`icons icon-sort ${
                    sortData.sortColumn === 'processedDate' && sortData.sortOrder === 'asc' ? 'asc' : ''
                  }
                                       ${
                                         sortData.sortColumn === 'processedDate' && sortData.sortOrder === 'desc'
                                           ? 'desc'
                                           : ''
                                       }`}
                />
              </a>
            </div>
            <div className="col-th">
              <a href="javascript:;" className="spacing" onClick={() => this.props.clickSort('status')}>
                STATUS
                <span
                  className={`icons icon-sort ${
                    sortData.sortColumn === 'status' && sortData.sortOrder === 'asc' ? 'asc' : ''
                  }
                                       ${
                                         sortData.sortColumn === 'status' && sortData.sortOrder === 'desc' ? 'desc' : ''
                                       }`}
                />
              </a>
            </div>
          </div>

          {data.slice(0, shownRowNumber).map((item, index) => (
            <div className="row-td" key={index}>
              <div className="col-td">
                <Link href="/adminPatientProfile">
                  <a className="spacing" >
                    {item.name}
                  </a>
                </Link>
              </div>
              <div className="col-td">
                <div className="spacing">
                  <a href="javascript:;" className="blue-links">
                    {item.fileName}
                  </a>
                </div>
              </div>
              <div className="col-td">
                <div className="spacing">{item.requestedBy}</div>
              </div>
              <div className="col-td">
                <div className="spacing">{item.requestedDate}</div>
              </div>
              <div className="col-td">
                <div className="spacing">{item.processedDate}</div>
              </div>
              <div className="col-td">
                <div className="spacing">{item.status}</div>
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

DeleteHistoryTable.propTypes = {
  data: PT.array,
  sortData: PT.object,
}
