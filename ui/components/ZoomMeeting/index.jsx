/* eslint-disable no-console */
import React from 'react'
import PT from 'prop-types'
import './styles.scss'
import { toast } from 'react-toastify'
import AppointmentService from '../../services/appointmentService'
import AuthService from '../../services/authService'
import { LS_ACTIVE_APPOINTMENT, LStorage, randomStr } from '../../services/utils'
import ZoomSDk from '../../services/zoomSDK'

const CREATE_MSG = 'Creating meeting, please wait ...'
const JOIN_MSG = 'Joining meeting, please wait ...'

export default class ZoomMeeting extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      message: '',
      joined: false,
      showEnd: false,
    }
    this.openAudioTimeHandler = null
  }

  componentDidMount() {
    this.init()
  }

  componentWillUnmount() {
    this.clearAudioHandler()
    AppointmentService.joinOrLeave(this.props.appointment.id, 'leave')
      .then(() => {})
      .catch(e => console.error(e))
  }

  clearAudioHandler() {
    if (this.openAudioTimeHandler) {
      clearInterval(this.openAudioTimeHandler)
    }
    this.openAudioTimeHandler = null
  }

  join(appointment) {
    ZoomSDk.getInfo()
      .then(info => {
        const params = {
          id: appointment.raw.meetingId,
          password: appointment.raw.meetingPassword,
          key: info.apiKey,
          secret: info.apiSecret,
        }
        this.setState({ message: JOIN_MSG })
        this.loadZoom(params)
      })
      .catch(err => {
        this.setState({ message: err.message })
      })
  }

  init() {
    const { appointment } = this.props
    if (appointment.raw.meetingId && appointment.raw.meetingPassword) {
      this.join(appointment)
    } else {
      this.setState({ message: CREATE_MSG })
      AppointmentService.createMeeting(appointment.id, {
        topic: `appointment Meeting (${appointment.id})`,
        password: randomStr(8),
      })
        .then(rsp => {
          appointment.raw.meetingId = rsp.id
          appointment.raw.meetingPassword = rsp.password
          LStorage.setItem(LS_ACTIVE_APPOINTMENT, appointment)
          this.join(appointment)
        })
        .catch(err => {
          toast.error(err.message)
          this.setState({ message: err.message })
        })
    }
  }

  openAudioAndVideo() {
    const { appointment } = this.props
    AppointmentService.joinOrLeave(appointment.id, 'join')
      .then(() => console.log('notify server successful'))
      .catch(e => console.error(e))

    // this.openAudioTimeHandler = setInterval(() => {
    //   const joinByAudio = document.querySelector(
    //     '#dialog-join > div:nth-child(4) > div > div > div:nth-child(1) > button'
    //   )
    //   if (!joinByAudio || joinByAudio.classList.contains('zm-btn--disabled')) {
    //     return
    //   }
    //   joinByAudio.click()
    //   this.clearAudioHandler()
    // }, 100)
  }

  loadZoom(params) {
    const { ZoomMtg } = require('@zoomus/websdk')
    ZoomMtg.setZoomJSLib('https://dmogdx0jrul3u.cloudfront.net/1.7.8/lib', '/av')
    ZoomMtg.preLoadWasm()
    ZoomMtg.prepareJssdk()
    ZoomMtg.showJoinAudioFunction({
      show: false,
    })
    const { id, password, key, secret } = params
    const { user } = AuthService.getAuth()
    const that = this
    ZoomMtg.generateSignature({
      meetingNumber: id,
      apiKey: key,
      apiSecret: secret,
      role: 1, // host
      success(res) {
        ZoomMtg.init({
          leaveUrl: '/appointments',
          isSupportAV: true,
          disableJoinAudio: true,
          success() {
            ZoomMtg.join({
              meetingNumber: id,
              userName: `${user.firstName} ${user.lastName}`,
              signature: res.result,
              apiKey: key,
              userEmail: user.email,
              passWord: password,
              success() {
                that.openAudioAndVideo()
                that.setState({ message: 'join meeting successful', joined: true })
              },
              error(r2) {
                that.setState({ message: r2.errorMessage })
              },
            })
          },
          error(r3) {
            that.setState({ message: r3.errorMessage })
          },
        })
      },
    })

    this.ZoomMtg = ZoomMtg
  }

  hideDialog() {
    this.setState({ showEnd: false })
  }

  endMeeting() {
    AppointmentService.endAppointment(this.props.appointment.id)
      .then(() => {
        this.ZoomMtg.endMeeting({})
      })
      .catch(e => toast.error(e.message))
  }

  leaveMeeting() {
    AppointmentService.joinOrLeave(this.props.appointment.id, 'leave')
      .then(() => {
        console.log('notify leave meeting to server successful')
        this.ZoomMtg.leaveMeeting({})
      })
      .catch(e => console.error(e))
  }

  render() {
    const getRoomInfo = () => (
      <span>{`meeting ID:${this.props.appointment.raw.meetingId} password:${this.props.appointment.raw.meetingPassword}`}</span>
    )
    return (
      <div className="meeting-message-container">
        {this.state.joined && <div className="room-info">{getRoomInfo()}</div>}
        <div>{this.state.message}</div>

        {this.state.joined && (
          <div className="leave-button" onClick={() => this.setState({ showEnd: true })}>
            Leave Meeting
          </div>
        )}

        {this.state.showEnd && (
          <div className="dialog-bg">
            <div className="dialog-container end-meeting-dialog">
              <div className="title">End this meeting</div>
              <div className="description">
                Are you sure you want to end this meeting now? <br />
                Everyone on the call will be disconnected and meeting will be over.
              </div>
              <div className="buttons">
                <a href="javascript:;" className="btn btn-blue btn-sure" onClick={() => this.endMeeting()}>
                  End Meeting
                </a>
                <a href="javascript:;" className="btn btn-blue btn-sure" onClick={() => this.leaveMeeting()}>
                  Leave Meeting
                </a>
                <a href="javascript:;" className="btn btn-blue btn-cancel" onClick={() => this.hideDialog()}>
                  Cancel
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

ZoomMeeting.propTypes = {
  appointment: PT.object,
}
