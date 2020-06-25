import React, { Component } from 'react'
import './styles.scss'
import { LStorage, NYLAS_RESULT } from '../../services/utils'

class NylasCallback extends Component {
  render() {
    const params = new URLSearchParams(window.location.search)
    const result = params.get('result') === 'true'
    const message = result
      ? 'Nylas bind successful, this page will close in 3 seconds.'
      : `${params.get('message')}, please close this page, and retry again.`

    LStorage.setItem(NYLAS_RESULT, result)

    if (result) {
      setTimeout(() => {
        window.close()
      }, 3000)
    }
    return (
      <React.Fragment>
        <div className="dialog-container end-meeting-dialog">
          <div className="title">Nylas bind {`${result ? 'successful' : 'failed'}`}</div>
          <div className={`description ${result ? '' : 'error-text'}`}>{message}</div>
          <div className="buttons">
            <a href="javascript:;" className="btn btn-blue btn-sure" onClick={() => window.close()}>
              Close Now
            </a>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default NylasCallback
