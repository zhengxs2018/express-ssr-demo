import React, { Component } from 'react'
import PT from 'prop-types'
import Link from 'next/link'
import './styles.scss'

/**
 * patients recently view component
 */
class PatientsRecentlyView extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      numberPerPage: 5,
      shownPageIndex: 0,
    }
  }

  // click Left Arrow
  clickLeftArrow() {
    this.setState({
      shownPageIndex: this.state.shownPageIndex - 1,
    })
  }

  // click Right Arrow
  clickRightArrow() {
    this.setState({
      shownPageIndex: this.state.shownPageIndex + 1,
    })
  }

  render() {
    const { data } = this.props

    const { numberPerPage, shownPageIndex } = this.state

    return (
      <div>
        <div className="titles flex-grid">
          Recently View
          <div className="right-pages">
            <a
              href="javascript:;"
              className={`icons icon-prev ${shownPageIndex === 0 ? 'disabled' : ''}`}
              onClick={() => this.clickLeftArrow()}
            />
            <a
              href="javascript:;"
              className={`icons icon-next ${numberPerPage * (shownPageIndex + 1) >= data.length ? 'disabled' : ''}`}
              onClick={() => this.clickRightArrow()}
            />
          </div>
        </div>
        <div className="panel-list">
          <div className="five-panel flex-grid recently-view">
            {data.slice(numberPerPage * shownPageIndex, numberPerPage * (shownPageIndex + 1)).map((item, index) => (
              <div className="items" key={index}>
                <div className="hover-blue">
                  <Link href="/adminPatientProfile">
                    <a className="btn btn-border">
                    View Profile
                    </a>
                  </Link>
                  <div className="bottom-tools">
                    <a href="javascript:;" className="icons icon-edit" />
                    <a href="javascript:;" className="icons icon-trash" onClick={() => this.props.deleteItem(index)} />
                  </div>
                </div>
                <div className="top-area flex-grid">
                  <div className="names">{item.name}</div>
                  <div className="right-img">
                    <a href="javascript:;">
                      <img src={item.photoUrl} alt="img" />
                    </a>
                  </div>
                </div>
                <div className="txt">
                  <div className="normal-txt">Current Progress</div>
                  <div className="little-txt">{item.currentProgress}</div>
                  <a href="javascript:;" className="email-link">
                    {item.email}
                  </a>
                  <div className="little-txt">{item.phone}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

PatientsRecentlyView.propTypes = {
  data: PT.array,
}

export default PatientsRecentlyView
