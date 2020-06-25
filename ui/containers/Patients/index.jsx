import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'
import patientActions from '../../actions/patientActions'
import AppointmentsLeftSidebar from '../../components/AppointmentsLeftSidebar'
import AppointmentsRightSidebar from '../../components/AppointmentsRightSidebar'
import appointmentActions from '../../actions/appointmentActions'
import './styles.scss'
import '../Appointments/styles.scss'
import PatientCard from '../../components/PatientCard'
import Dropdown from '../../components/Dropdown'
import { DEFAULT_PATIENT_PAGE_SIZE } from '../../config'
import PatientService from '../../services/patientService'

const PATIENT_PAGE_SIZE = DEFAULT_PATIENT_PAGE_SIZE

const RECENTLY_PAGE_SIZE = 5
const ORDER_ITEMS = [
  { label: 'Name', value: 'firstName' },
  { label: 'ID', value: 'uid' },
  {
    label: ' Registration time',
    value: 'createdAt',
  },
]

class Patients extends Component {
  constructor(props) {
    super(props)

    this.state = {
      patientPerPage: PATIENT_PAGE_SIZE,
      sortBy: ORDER_ITEMS[0],
      recentlyPageNum: 1,
      showSearch: false,
      sortOrder: 'asc',
      searchText: '',
    }
  }

  componentDidMount() {
    this.props.patientActions.clearPatients()
    this.props.appointmentActions.mockData()
    this.props.patientActions.getRecentlyViewed()
    this.searchPatients()
  }

  /**
   * filter changed
   * @param key the key
   * @param v the value
   */
  onFilterChange(key, v) {
    const state = _.clone(this.state)
    state[key] = v
    if (key === 'searchText') {
      state.patientPerPage = PATIENT_PAGE_SIZE
    }
    this.setState(state, () => this.searchPatients())
  }

  /**
   * load more
   */
  loadMore() {
    this.setState({ patientPerPage: this.state.patientPerPage + PATIENT_PAGE_SIZE }, () => this.searchPatients())
  }

  /**
   * search patients
   * @param pageNum
   */
  searchPatients(pageNum = 1) {
    const { patientPerPage, sortBy, searchText } = this.state
    const params = { pageNum, perPage: patientPerPage }
    params.sortBy = sortBy.value
    params.sortOrder = this.state.sortOrder

    if ((searchText || '') !== '') {
      params.keyword = searchText
    }
    this.props.patientActions.searchPatients(params)
  }

  /**
   * close search
   */
  closeSearch() {
    this.setState({ showSearch: false })
  }

  /**
   * page update
   */
  recentlyPageUpdate(offset) {
    const { recently } = this.props
    const total = (recently || []).length
    const { recentlyPageNum } = this.state

    if (offset < 0 && recentlyPageNum + offset <= 0) {
      return
    }

    if (offset > 0 && recentlyPageNum * RECENTLY_PAGE_SIZE >= total) {
      return
    }
    this.setState({ recentlyPageNum: recentlyPageNum + offset })
  }

  onUserClick(user) {
    this.props.history.push(`/patients/${user.id}`)
  }

  openSearch() {
    this.setState({ showSearch: true }, () => this.searchInputRef.focus())
  }

  downloadAudit() {
    PatientService.downloadAuditLog()
  }

  render() {
    const { appointmentsData, recently, patientPage } = this.props
    const { sortBy, showSearch, recentlyPageNum } = this.state

    const loadingMore = patientPage && patientPage.total > patientPage.pageNum * patientPage.perPage

    const recentLeftEnabled = recentlyPageNum > 1
    const recentRightEnabled = (recently || []).length > recentlyPageNum * RECENTLY_PAGE_SIZE
    return (
      <React.Fragment>
        <AppointmentsLeftSidebar />

        <div className="contents appointments patient-root">
          <div className="paddings">
            <div className="top-bar flex-grid">
              <div className="lefts">Patients</div>
              <div className="rights flex">
                {showSearch && (
                  <div className="search-contain">
                    <input
                      className="search-input"
                      placeholder="enter some keyword ..."
                      ref={r => {
                        this.searchInputRef = r
                      }}
                      value={this.state.searchText}
                      onChange={e => this.onFilterChange('searchText', e.target.value)}
                    />
                    <div className="close-btn" onClick={() => this.closeSearch()}>
                      <img src="/add.svg" />
                    </div>
                  </div>
                )}
                {!showSearch && (
                  <a href="javascript:;" onClick={() => this.openSearch()} className="icons btn-search" />
                )}
                <div className="info-module">
                  <a href="javascript:;" className="icons btn-bell">
                    <i className="red-point" />
                  </a>
                </div>

                <div className="export-btn" onClick={() => this.downloadAudit()}>
                  EXPORT AUDIT LOGS
                </div>
              </div>
            </div>
          </div>

          <div className="p-view-container">
            <div className="line">
              <div className="title">Recently Viewed</div>
              <div
                className={`arrow left ${recentLeftEnabled ? '' : 'disabled'}`}
                onClick={() => this.recentlyPageUpdate(-1)}>
                <img src="/patient-assets/arrow-right.svg" alt="arrow" />
              </div>
              <div
                className={`arrow ${recentRightEnabled ? '' : 'disabled'}`}
                onClick={() => this.recentlyPageUpdate(1)}>
                <img src="/patient-assets/arrow-right.svg" alt="arrow" />
              </div>
            </div>

            {!recently && <div className="tip">Loading...</div>}
            {recently && recently.length <= 0 && <div className="tip">No records</div>}
            {recently && (
              <div className="patient-container">
                {_.map(
                  recently.slice((recentlyPageNum - 1) * RECENTLY_PAGE_SIZE, recentlyPageNum * RECENTLY_PAGE_SIZE),
                  item => (
                    <div className="item-container" key={item.id}>
                      <PatientCard user={item} onClick={() => this.onUserClick(item)} />
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div className="p-view-container all">
            <div className="line">
              <div className="title">All Patients</div>
              <Dropdown
                title={`Sort By ${sortBy.label}`}
                items={ORDER_ITEMS}
                onSelect={item => this.onFilterChange('sortBy', item)}
              />
              <div
                className={`icon ${this.state.sortOrder}`}
                onClick={() => this.onFilterChange('sortOrder', this.state.sortOrder === 'asc' ? 'desc' : 'asc')}>
                <img src="/patient-assets/arrow-right.svg" />
              </div>
            </div>

            {!patientPage && <div className="tip">Loading...</div>}
            {patientPage && patientPage.items.length <= 0 && <div className="tip">No records</div>}
            {patientPage && (
              <div className="patient-container">
                {_.map(patientPage.items, item => (
                  <div className="item-container" key={item.id}>
                    <PatientCard user={item} onClick={() => this.onUserClick(item)} />
                  </div>
                ))}
              </div>
            )}
            {loadingMore && (
              <div className="load-more" onClick={() => this.loadMore()}>
                load more ...
              </div>
            )}
          </div>
        </div>

        {appointmentsData && (
          <AppointmentsRightSidebar
            tasksAndReminders={appointmentsData.tasksAndReminders}
            messages={appointmentsData.messages}
          />
        )}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state.patientReducer, ...state.appointmentReducer })

const matchDispatchToProps = dispatch => ({
  patientActions: bindActionCreators({ ...patientActions }, dispatch),
  appointmentActions: bindActionCreators({ ...appointmentActions }, dispatch),
})

export default connect(mapStateToProps, matchDispatchToProps)(withRouter(Patients))
