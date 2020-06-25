import React from 'react'
import './styles.scss'
import PropTypes from 'prop-types'
import _ from 'lodash'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import Dropzone from 'react-dropzone'
import { toast } from 'react-toastify'
import PatientService from '../../services/patientService'

export default class Form extends React.Component {
  uploadFile(files, item) {
    const body = new FormData()
    body.append('1', files[0])
    PatientService.uploadFile(body)
      .then(rsp => {
        this.props.onChange(rsp['1'], item.key)
      })
      .catch(e => {
        toast.error(e.message)
      })
  }

  render() {
    const { fields, value, errors, onChange } = this.props

    const getFileName = v => {
      if (!v) {
        return 'Drag drop some image here, or click to select image'
      }
      return v
        .split('?')[0]
        .split('/')
        .pop()
    }

    const renderItem = (item, i) => {
      const type = item.type || 'input'
      if (type === 'space') {
        return <div key={`form-item-${i}`} className="space" />
      }

      if (type === 'dropdown') {
        return (
          <div className={`input-item ${errors[item.key] ? 'error' : ''}`} key={`form-item-${i}`}>
            <div className="input-label">{item.label}:</div>
            <select
              className="input"
              value={_.get(value, item.key) || ''}
              onChange={e => onChange(e.target.value, item.key)}>
              <option value="" />
              {(item.enum || _.get(value, `config.${item.options}`)).map((op, i2) => (
                <option key={`${op}-${i2}`} value={op}>
                  {op}
                </option>
              ))}
            </select>
            <span className="error-msg">{errors[item.key]}</span>
          </div>
        )
      }
      if (type === 'photo') {
        return (
          <div className={`input-item ${errors[item.key] ? 'error' : ''}`} key={`form-item-${i}`}>
            <div className="input-label">{item.label}:</div>
            <div className="input-warp">
              <Dropzone
                accept={['image/jpeg', 'image/png', 'image/jpg']}
                onDrop={acceptedFiles => this.uploadFile(acceptedFiles, item)}>
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()} className="drag-container">
                      <input {...getInputProps()} />
                      <p>{getFileName(_.get(value, item.key))}</p>
                    </div>
                  </section>
                )}
              </Dropzone>
            </div>
          </div>
        )
      }
      if (type === 'date') {
        const selected = _.get(value, item.key) ? moment(_.get(value, item.key)).toDate() : null
        return (
          <div className={`input-item ${errors[item.key] ? 'error' : ''}`} key={`form-item-${i}`}>
            <div className="input-label">{item.label}:</div>
            <DatePicker selected={selected} onChange={date => onChange(moment(date).format(item.format), item.key)} />
            <span className="error-msg">{errors[item.key]}</span>
          </div>
        )
      }
      if (type === 'input') {
        const v = _.get(value, item.key)
        return (
          <div className={`input-item ${errors[item.key] ? 'error' : ''}`} key={`form-item-${i}`}>
            <div className="input-label">{item.label}:</div>
            <input
              className="input"
              value={_.isNil(v) ? '' : v}
              placeholder={item.placeholder || item.label}
              onChange={e => onChange(e.target.value, item.key)}
              type={item.inputType || 'text'}
            />
            <span className="error-msg">{errors[item.key]}</span>
          </div>
        )
      }

      return (
        <div key={`form-item-${i}`} className="input-item">
          Unsupported input
        </div>
      )
    }
    return <div className="form-root">{fields.map((field, i) => renderItem(field, i))}</div>
  }
}

Form.propTypes = {
  fields: PropTypes.array,
  value: PropTypes.object,
  errors: PropTypes.object,
  onChange: PropTypes.func,
}
