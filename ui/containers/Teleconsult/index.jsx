import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import appointmentActions from '../../actions/appointmentActions'
import Questionnaire from '../../components/Questionnaire'
import ConsultationRightSidebar from '../../components/ConsultationRightSidebar'
import ConsultationBottomBar from '../../components/ConsultationBottomBar'
import ZoomMeeting from '../../components/ZoomMeeting'
import './styles.scss'
import { LS_ACTIVE_APPOINTMENT, LStorage } from '../../services/utils'

class Teleconsult extends Component {
  constructor(props) {
    super(props)
    this.state = {
      appointment: LStorage.getItem(LS_ACTIVE_APPOINTMENT, true),
    }
  }

  componentWillMount() {
    this.props.appointmentActions.getTeleconsultData()
  }

  render() {
    const { teleconsultData } = this.props
    return (
      <React.Fragment>
        {!!teleconsultData && (
          <React.Fragment>
            <div className="section three-grid">
              <Questionnaire questionnaire={teleconsultData.questionnaire} />
              <ZoomMeeting appointment={this.state.appointment} />
              <ConsultationRightSidebar appointment={this.state.appointment} />
            </div>
            <ConsultationBottomBar />
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state.appointmentReducer })

const matchDispatchToProps = dispatch => ({
  appointmentActions: bindActionCreators({ ...appointmentActions }, dispatch),
})

export default connect(mapStateToProps, matchDispatchToProps)(withRouter(Teleconsult))
