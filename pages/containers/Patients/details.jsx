import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { toast } from 'react-toastify'
import _ from 'lodash'
import moment from 'moment'
import Viewer from 'react-viewer'
import validator from 'validator'
import patientActions from '../../actions/patientActions'
import AppointmentsLeftSidebar from '../../components/AppointmentsLeftSidebar'
import appointmentActions from '../../actions/appointmentActions'
import '../Appointments/styles.scss'
import './details.styles.scss'
import PatientDetailsRightSidebar from '../../components/PatientDetailsRightSidebar'
import PatientService from '../../services/patientService'
import {
  getCreditCardIcon,
  getFullAdd,
  getGenderAndDoB,
  getHideCardNumber,
  getName,
  getUid,
} from '../../services/utils'
import UserHead from '../../components/UserHead'
import Form from '../../components/Form'
import AppointmentService from '../../services/appointmentService'
import AuthService from '../../services/authService'

const EDIT_FIELDS = [
  {
    label: 'First Name',
    key: 'firstName',
    validate: ['required'],
  },
  {
    label: 'Last Name',
    key: 'lastName',
    validate: ['required'],
  },
  {
    key: 'phone',
    label: 'Phone',
    placeholder: 'Numbers only please',
    validate: ['required', 'phone'],
  },
  { type: 'space' },
  {
    label: 'Address',
    key: 'address',
    validate: ['required'],
  },
  {
    label: 'City',
    key: 'city',
    validate: ['required'],
  },
  {
    label: 'State',
    key: 'state',
    type: 'dropdown',
    options: 'SUPPORTED_STATE_LIST',
    validate: ['required'],
  },
  {
    label: 'Zip Code',
    key: 'zipcode',
    inputType: 'number',
    validate: ['required', 'number', 'zipcode'],
  },
  { type: 'space' },
  {
    label: 'Copay',
    key: 'appointmentFee',
    inputType: 'number',
    validate: ['required', 'fee'],
  },
]

const InsuranceFields = [
  {
    key: 'insuranceCarrier',
    label: 'Insurance carrier',
    validate: ['required'],
  },
  {
    key: 'planNumber',
    validate: ['required'],
    label: 'Plan number',
  },
  {
    key: 'insuredName',
    validate: ['required'],
    maxLen: 64,
    label: "Insured's name",
  },
  {
    key: 'insuredID',
    validate: ['required', 'number'],
    label: "Insured's identification number",
  },
  {
    key: 'effectiveDate',
    type: 'date',
    format: 'MM/DD/YYYY',
    validate: ['required'],
    label: 'Effective date of coverage(MM/DD/YYYY)',
  },
  {
    key: 'frontPhoto',
    type: 'photo',
    label: 'Card front photo',
    placeholder: 'Please take/choose photo',
  },
  {
    key: 'backPhoto',
    type: 'photo',
    label: 'Card back photo',
    placeholder: 'Please take/choose photo',
  },
  {
    key: 'relationship',
    type: 'dropdown',
    validate: ['required'],
    enum: ['Parent', 'Self', 'Child', 'Spouse', 'Other'],
    label: "Patient's relationship to the insured",
  },
]

class PatientDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userId: this.props.match.params.id,
      title: 'loading...',
      user: null,

      showRejectDialog: false,
      reason: '',
      images: [],
      showImages: false,
      editUser: null,
      personEditorErrors: {},
      personEditor: false,
      cardEditor: false,
      printMode: false,
      followUp: null,
      cardEditorErrors: {},
    }
  }

  componentDidMount() {
    this.props.appointmentActions.mockData()
    this.fetch()
    this.fetchFollowUp()
  }

  fetchFollowUp() {
    AppointmentService.getFollowUp(this.state.userId)
      .then(followUp => {
        this.setState({ followUp })
      })
      .catch(e => {
        toast.error(e.message)
      })
  }

  fetch() {
    PatientService.getPatient(this.state.userId)
      .then(user => {
        this.props.patientActions.addRecentlyViewPatient(user)
        this.setState({ user, title: getName(user) })
      })
      .catch(e => {
        this.setState({ title: e.message })
        toast.error(e.message)
      })
  }

  getICardImages(card) {
    return ['front', 'back']
      .filter(photo => !!card[`${photo}Photo`])
      .map(p => ({ src: card[`${p}Photo`], alt: `Insurance card ${p} photo` }))
  }

  /**
   * approve form
   * @param form the document-form
   * @param params the additional params
   */
  approveForm(form, params) {
    const entity = { status: 'approved', id: form.id, reason: 'clear sign' }
    if (params && params.type === 'returning') {
      this.updateReturningDocument(entity, 'approve', params.appointmentId, params.index)
    } else {
      this.updateForm(entity, 'approve')
    }
  }

  checkValue(item) {
    const value = _.get(this.state.editUser, item.key)
    if (!item.key) {
      return null
    }
    let errorMsg = null
    for (let i = 0; i < (item.validate || []).length; i += 1) {
      const rule = item.validate[i]
      switch (rule) {
        case 'required': {
          errorMsg = (_.isNil(value) ? '' : value).toString().trim().length <= 0 ? `${item.label} is required.` : null
          break
        }
        case 'phone':
          errorMsg = validator.isMobilePhone(value, ['en-US']) ? null : `${value} is invalid phone number`
          break
        case 'zipcode':
          errorMsg = validator.isPostalCode(value, 'US') ? null : `${value} is invalid zip code`
          break
        case 'number':
          errorMsg = validator.isNumeric(value, { no_symbols: true }) ? null : `${value} is invalid digits`
          break
        case 'fee':
          errorMsg = value < 0 ? 'Fee cannot be negative value' : null
          break
        default:
          errorMsg = `unsupported validate ${rule}`
      }
      if (errorMsg) {
        break
      }
    }
    return errorMsg
  }

  updateForm(entity, type) {
    const documentId = this.state.user.document.id
    PatientService.updateForm(documentId, entity)
      .then(document => {
        toast.success(`Form ${entity.id} has been ${type} successful`)
        const user = _.cloneDeep(this.state.user)
        user.document = document
        this.setState({ user, showRejectDialog: false })
      })
      .catch(e => {
        toast.error(e.message)
      })
  }

  updateReturningDocument(entity, type, appointmentId, index) {
    AppointmentService.updateReturnDocumentPage(appointmentId, entity)
      .then(rsp => {
        toast.success(`Returning document ${entity.id} has been ${type} successful`)
        const followUp = _.cloneDeep(this.state.followUp)
        followUp[index] = rsp
        this.setState({ followUp, showRejectDialog: false })
      })
      .catch(e => {
        toast.error(e.message)
      })
  }

  showRejectDialog = (form, params) => {
    this.setState({ showRejectDialog: true, reason: '' }, () => this.reasonInputRef.focus())
    this.tmpForm = form
    this.tmpParams = params
  }

  rejectForm() {
    if (this.state.reason.trim().length <= 0) {
      return
    }
    const entity = { status: 'rejected', id: this.tmpForm.id, reason: this.state.reason }
    if (this.tmpParams.type === 'returning') {
      this.updateReturningDocument(entity, 'reject', this.tmpParams.appointmentId, this.tmpParams.index)
    } else {
      this.updateForm(entity, 'reject')
    }
  }

  onInputChange(v, k, id) {
    const editUser = _.cloneDeep(this.state.editUser)
    _.set(editUser, k, v)
    this.setState({ editUser }, () => this.onSubmit(false, id, k))
  }

  addCard(key) {
    const editUser = _.cloneDeep(this.state.editUser)
    const cards = editUser[key]
    cards.push({})
    editUser[key] = cards
    this.setState({ editUser })
  }

  removeCard(key, index) {
    const editUser = _.cloneDeep(this.state.editUser)
    const cards = editUser[key]
    cards.splice(index, 1)
    this.setState({ editUser })
  }

  toggleEditor(key) {
    const v = this.state[key]
    const user = this.state.user
    if (v) {
      this.onSubmit(true, key)
    } else {
      this.setState({
        [key]: true,
        editUser: {
          ..._.cloneDeep(user),
          appointmentFee: user.appointmentFee / 100,
          state: (user.state || '').toUpperCase(),
        },
      })
    }
  }

  onSubmit(doSave, id, fieldKey) {
    const { editUser } = this.state

    const errorsKey = `${id}Errors`
    const errors = _.clone(this.state[errorsKey])
    let fields = []
    if (id === 'personEditor') {
      fields = EDIT_FIELDS
    } else {
      for (let i = 0; i < editUser.insuranceCards.length; i += 1) {
        fields = fields.concat(this.wrapCardFields(i))
      }
    }
    _.each(fields, item => {
      if (fieldKey && item.key !== fieldKey) {
        return
      }
      const error = this.checkValue(item)
      if (error) {
        errors[item.key] = error
      } else {
        delete errors[item.key]
      }
    })
    if (_.isEmpty(errors)) {
      this.setState({ [errorsKey]: {} })
      if (doSave) {
        const requestBody =
          id === 'personEditor'
            ? _.pick(
                editUser,
                _.map(fields, f => f.key)
              )
            : _.pick(editUser, 'insuranceCards')
        if (requestBody.appointmentFee) {
          requestBody.appointmentFee = Math.ceil(requestBody.appointmentFee * 100)
        }
        PatientService.updateProfile(this.state.editUser.id, requestBody)
          .then(() => {
            this.fetch()
            this.setState({ [id]: false })
          })
          .catch(e => {
            toast.error(e.message)
          })
      }
      // do save
    } else {
      this.setState({ [errorsKey]: errors })
    }
  }

  wrapCardFields(i) {
    return InsuranceFields.map(f => ({ ...f, key: `insuranceCards.${i}.${f.key}` }))
  }

  print() {
    const { user } = AuthService.getAuth()
    PatientService.createAuditLog({
      operator: `${user.email} (${user.id})`,
      action: 'Print',
      patientId: this.state.userId,
      operatorRole: user.roles.join(', '),
      changeDetails: 'print patient details page',
    })
      .then(() => {
        window.print()
      })
      .catch(e => toast.error(e.message))
  }

  getReviewForms(user) {
    return user.document.forms.filter(f => f.status === 'pending review')
  }

  render() {
    const { appointmentsData } = this.props

    const {
      title,
      user,
      personEditor,
      editUser,
      personEditorErrors,
      cardEditor,
      cardEditorErrors,
      printMode,
      followUp,
    } = this.state
    const getFileIcon = id =>
      id.toLowerCase().indexOf('.pdf') > 0 ? '/patient-assets/pdf-icon.svg' : '/patient-assets/other-file-icon.svg'
    const getIcon = key => {
      let completed

      if (key === 'forms') {
        completed = _.filter((user.document || {}).forms, f => f.status !== 'approved').length === 0
      } else if (key === 'Payment Setup') {
        completed = user.creditCards.length > 0
      } else {
        const items = _.get(user, 'onboarding.0.items')
        const item = _.find(items, i => i.title === key)
        completed = item && item.progress >= 100
      }
      return completed ? '/patient-assets/completed.svg' : '/patient-assets/uncompleted.svg'
    }

    const getFormMsg = form => {
      if (form.status === 'pending review') {
        return 'Waiting for review'
      }
      if (form.status === 'missing') {
        return 'Patient not yet uploaded'
      }
      if (form.status === 'approved') {
        return 'You approved this form'
      }
      if (form.status === 'rejected') {
        return 'You rejected this document, waiting patient re-upload'
      }
    }

    const getImages = form => _.map(form.pages, (p, i) => ({ src: p, alt: `${form.id} - page ${i + 1} ` }))
    const renderDocument = (documents, key, params) => (
      <div key={key} className="content content-line">
        {_.map(documents, form => (
          <div className="form" key={form.id}>
            <div className="name">
              <img className="file-icon" src={getFileIcon(form.id)} />
              {form.id}
            </div>
            <div className="status">{getFormMsg(form)}</div>
            {form.status === 'rejected' && <div className="reason">{form.reason}</div>}
            {form.uploadedAt && <div className="status">{moment(form.uploadedAt).format('MMM DD, YYYY hh:mm A')}</div>}
            {getImages(form).length > 0 && (
              <div
                className="view-images"
                onClick={() => {
                  this.setState({ showImages: true, images: getImages(form) })
                }}>
                Click here to see patient upload
              </div>
            )}
            {form.status === 'pending review' && (
              <div className="buttons">
                <div className="btn" onClick={() => this.approveForm(form, params)}>
                  Approve
                </div>
                <div className="btn reject" onClick={() => this.showRejectDialog(form, params)}>
                  Reject
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )
    return (
      <React.Fragment>
        {user && printMode && (
          <div className="print-root">
            <div className="header">
              <div className="flex1" />
              <div className="print-btn" onClick={() => this.print()}>
                PRINT
              </div>
              <div className="print-btn" onClick={() => this.setState({ printMode: false })}>
                CLOSE
              </div>
            </div>
            <div className="user-name">
              {getName(user)} ({getUid(user.uid)})
            </div>

            <div className="part-container">
              <div className="title">Insurance Cards</div>
              {user.insuranceCards.length <= 0 && <div className="coming-soon">No Records</div>}
              {user.insuranceCards.length > 0 &&
                _.map(user.insuranceCards, (card, i) => (
                  <div className="card" key={`i-card-${i}`}>
                    <div className="row head">
                      <div>Insurance Carrier</div>
                      <div>Plan Number</div>
                      <div>Insured Name</div>
                      <div>Insured ID</div>
                      <div>Relationship</div>
                      <div>Effective Date</div>
                    </div>
                    <div className="row">
                      <div>{card.insuranceCarrier}</div>
                      <div>{card.planNumber}</div>
                      <div>{card.insuredName}</div>
                      <div>{card.insuredID}</div>
                      <div>{card.relationship}</div>
                      <div>{card.effectiveDate}</div>
                    </div>

                    {this.getICardImages(card).length <= 0 ? (
                      <div>No pictures</div>
                    ) : (
                      this.getICardImages(card).map((img, i2) => (
                        <div className="img" key={`card-i-${i2}`}>
                          <img src={img.src} alt={img.alt} />
                        </div>
                      ))
                    )}
                  </div>
                ))}
            </div>

            <div className="part-container">
              <div className="title">Documents that need to be approved</div>
              {this.getReviewForms(user).length <= 0 ? (
                <div>No Documents</div>
              ) : (
                this.getReviewForms(user).map((form, i) => (
                  <div className="form" key={`form-i-${i}`}>
                    <div className="file-name">{form.id}</div>
                    {(!form.pages || form.pages.length <= 0) && <div>No pages</div>}
                    {form.pages &&
                      form.pages.length > 0 &&
                      form.pages.map((p, i2) => (
                        <div className="img-root">
                          <img src={p} alt={`${i2}`} />
                          <div>
                            {form.name} - Page {i2 + 1}
                          </div>
                        </div>
                      ))}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        {!printMode && (
          <React.Fragment>
            <AppointmentsLeftSidebar />
            <div className="contents appointments patient-detail-root">
              <div className="return-container" onClick={() => this.props.history.goBack()}>
                <img src="/patient-assets/return-btn.svg" />
                <span>Back</span>
              </div>
              <div className="paddings user-big-name ">
                <div className="top-bar flex-grid">
                  <div className="lefts">{title}</div>

                  {user && (
                    <div className="print-btn" onClick={() => this.setState({ printMode: true })}>
                      PRINT
                    </div>
                  )}
                </div>
              </div>

              {user && (
                <div className="content-root">
                  <div className="card-root">
                    <div className="first-part">
                      <img src={getIcon('Personal Information')} alt="icon" />
                      <div className="title">Person information</div>
                      <div className="flex1" />
                      <div className="edit-btn" onClick={() => this.toggleEditor('personEditor')}>
                        {personEditor ? 'SAVE' : 'EDIT'}
                      </div>
                      {personEditor && (
                        <div className="edit-btn" onClick={() => this.setState({ personEditor: false })}>
                          CANCEL
                        </div>
                      )}
                    </div>
                    {!personEditor && (
                      <div className="content content-line">
                        <div className="person-item">
                          <div className="user-head">
                            <UserHead url={user.headUrl} name={getName(user)} color="blue" />
                          </div>
                          <div className="col-item">
                            <div className="header">{getName(user)}</div>
                            <div className="text">{getGenderAndDoB(user)}</div>
                          </div>
                        </div>

                        <div className="col-item">
                          <div className="header">Address</div>
                          <div className="text">{getFullAdd(user)}</div>
                        </div>
                        <div className="col-item">
                          <div className="header">Email</div>
                          <a href={`mailto:${user.email}`} className="text email">
                            {user.email}
                          </a>
                        </div>

                        <div className="col-item">
                          <div className="header">Phone</div>
                          <div className="text">{user.phone || 'N/A'}</div>
                        </div>
                        <div className="col-item">
                          <div className="header">Copay</div>
                          <div className="text">$ {(user.appointmentFee || 0) / 100}</div>
                        </div>
                      </div>
                    )}
                    {personEditor && (
                      <Form
                        fields={EDIT_FIELDS}
                        onChange={(v, k) => this.onInputChange(v, k, 'personEditor')}
                        value={editUser}
                        errors={personEditorErrors}
                      />
                    )}
                  </div>
                  <div className="card-root">
                    <div className="first-part">
                      <img src={getIcon('Insurance Information')} />
                      <div className="title">Insurance Information</div>
                      <div className="flex1" />
                      <div className="edit-btn" onClick={() => this.toggleEditor('cardEditor')}>
                        {cardEditor ? 'SAVE' : 'EDIT'}
                      </div>
                      {cardEditor && (
                        <div className="edit-btn" onClick={() => this.setState({ cardEditor: false })}>
                          CANCEL
                        </div>
                      )}
                    </div>

                    {!cardEditor && (
                      <div className="content card">
                        {user.insuranceCards.length <= 0 && <div className="coming-soon">No Records</div>}
                        {user.insuranceCards.length > 0 &&
                          _.map(user.insuranceCards, (card, i) => (
                            <div className="card" key={`i-card-${i}`}>
                              <div className="header">
                                <span>{card.insuranceCarrier}</span> <span>{card.planNumber}</span>
                              </div>
                              <div className="sub-header">
                                {card.insuredName} <span>{card.insuredID}</span>
                                <span>{card.relationship}</span>
                                {this.getICardImages(card).length > 0 && (
                                  <span
                                    className="view-images"
                                    onClick={() =>
                                      this.setState({
                                        showImages: true,
                                        images: this.getICardImages(card),
                                      })
                                    }>
                                    view card images
                                  </span>
                                )}
                              </div>
                              <div className="date">{card.effectiveDate}</div>
                            </div>
                          ))}
                      </div>
                    )}

                    {cardEditor && (
                      <div className="content card">
                        {editUser.insuranceCards.length <= 0 && <div className="coming-soon">No Records</div>}
                        {editUser.insuranceCards.map((card, index) => (
                          <div className="edit-card-root" key={`i-card-${index}`}>
                            <div className="add-new-btn" onClick={() => this.removeCard('insuranceCards', index)}>
                              Remove
                            </div>
                            <Form
                              value={editUser}
                              fields={this.wrapCardFields(index)}
                              errors={cardEditorErrors}
                              onChange={(v, k) => this.onInputChange(v, k, 'cardEditor')}
                            />
                          </div>
                        ))}
                        <div className="add-new-btn" onClick={() => this.addCard('insuranceCards')}>
                          Add Insurance Card
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="card-root">
                    <div className="first-part">
                      <img src={getIcon('Payment Setup')} />
                      <div className="title">Payment</div>
                    </div>

                    <div className="content card">
                      {user.creditCards.length <= 0 && <div className="coming-soon">No Records</div>}
                      {user.creditCards.length > 0 &&
                        _.map(user.creditCards, (card, i) => (
                          <div className="card" key={`i-card-${i}`}>
                            <div className="header">
                              {getCreditCardIcon(card) && <img className="card-icon" src={getCreditCardIcon(card)} />}
                              {getHideCardNumber(card.number)}
                            </div>
                            <div className="date">EXP {card.expired}</div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="card-root">
                    <div className="first-part">
                      <img src={getIcon('Medical Questionnaire')} />
                      <div className="title">Medical Questionnaire</div>
                    </div>
                    <div className="content">
                      <div className="coming-soon">Coming soon</div>
                    </div>
                  </div>

                  <div className="card-root">
                    <div className="first-part">
                      <img src={getIcon('forms')} />
                      <div className="title">Patient Form</div>
                    </div>
                    {renderDocument((user.document || {}).forms, 'forms', {})}
                  </div>

                  {followUp && (
                    <div className="card-root">
                      <div className="first-part">
                        <img src={getIcon('followUp')} />
                        <div className="title">Returning Patient Document</div>
                      </div>
                      {followUp.length <= 0 && (
                        <div className="content">
                          <div className="coming-soon">No documents</div>
                        </div>
                      )}
                      {followUp.map((app, i) =>
                        renderDocument(app.returnDocuments || [], app.id, {
                          type: 'returning',
                          index: i,
                          appointmentId: app.id,
                        })
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {appointmentsData && <PatientDetailsRightSidebar notes={appointmentsData.notes} />}

            <Viewer
              visible={this.state.showImages}
              zIndex={10000}
              onClose={() => {
                this.setState({ showImages: false })
              }}
              scalable={false}
              images={this.state.images}
            />

            {this.state.showRejectDialog && (
              <div className="dialog-root">
                <div className="dialog-container reason-dialog">
                  <div className="title">Reason</div>
                  <div className="description">
                    Please enter a reason why reject this, so that patient can re-upload again
                  </div>
                  <textarea
                    className="reason-box"
                    ref={r => {
                      this.reasonInputRef = r
                    }}
                    value={this.state.reason}
                    onChange={e => this.setState({ reason: e.target.value })}
                  />
                  <div className="buttons">
                    <a
                      href="javascript:;"
                      className={`btn btn-blue btn-sure btn-reject ${
                        this.state.reason.trim().length === 0 ? 'disabled' : ''
                      }`}
                      onClick={() => this.rejectForm()}>
                      Reject
                    </a>
                    <a
                      href="javascript:;"
                      className="btn btn-blue btn-cancel"
                      onClick={() => {
                        this.setState({ showRejectDialog: false, reason: '' })
                        this.tmpForm = null
                      }}>
                      Cancel
                    </a>
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
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

export default connect(mapStateToProps, matchDispatchToProps)(withRouter(PatientDetails))
