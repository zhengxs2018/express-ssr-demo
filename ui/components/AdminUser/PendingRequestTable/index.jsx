import React, { Component } from 'react'
import PT from 'prop-types'
import Link from 'next/link'
import ModalWindowConfirm from '../ModalWindowConfirm'
import './styles.scss'

/**
 * pending request table component
 */
export default class PendingRequestTable extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      showApproveModal: false,
      showRejectModal: false,
      shownRowNumber: 5,
    }
  }

  viewMore() {
    this.setState({
      shownRowNumber: this.props.data.length,
    })
  }

  // click Confirm Approve
  clickConfirmApprove(isConfirmed) {
    if (isConfirmed) {
      this.setState({
        showApproveModal: false,
      })
    } else {
      this.setState({
        showApproveModal: false,
      })
    }
  }

  // click Confirm Reject
  clickConfirmReject(isConfirmed) {
    if (isConfirmed) {
      this.setState({
        showRejectModal: false,
      })
    } else {
      this.setState({
        showRejectModal: false,
      })
    }
  }

  render() {
    const { data, sortData } = this.props

    const { showApproveModal, showRejectModal, shownRowNumber } = this.state

    return (
      <div className="table-area">
        <div className="table-data pending-request-table">
          {showApproveModal && (
            <ModalWindowConfirm
              title="Approve"
              description="Are you sure you want to approve the request?"
              showTextarea={false}
              clickConfirm={isConfirmed => this.clickConfirmApprove(isConfirmed)}
            />
          )}

          {showRejectModal && (
            <ModalWindowConfirm
              title="Reject"
              description="Are you sure you want to reject the request?"
              showTextarea
              clickConfirm={isConfirmed => this.clickConfirmReject(isConfirmed)}
            />
          )}

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
              <div className="spacing" />
            </div>
          </div>

          {data.slice(0, shownRowNumber).map((item, index) => (
            <div className="row-td" key={index}>
              <div className="col-td">
                <Link href="/adminPatientProfile">
                  <a className="spacing">{item.name}</a>
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
                <div className="spacing flex">
                  <a
                    href="javascript:;"
                    className="btn btn-blue"
                    onClick={() => this.setState({ showApproveModal: true })}>
                    Approve
                  </a>

                  <a
                    href="javascript:;"
                    className="btn btn-blue"
                    onClick={() => this.setState({ showRejectModal: true })}>
                    Reject
                  </a>
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

PendingRequestTable.propTypes = {
  data: PT.array,
  sortData: PT.object,
}
