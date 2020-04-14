import React from 'react';
import Letter from './Letter'
import '../css/loading.css'

export default class StudyHelp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: this.props.data,
    }
  }

  componentDidMount() {
    this.updateState()
  }

  updateState = () => {
    if (this.props.data === undefined || this.props.data.length < 25) {
      setTimeout(this.updateState, 50)
    } else {
      this.setState({
        data: this.props.data,
        currentLetter: this.props.currentLetter
      })
    }
  }

  render() {
    return (
      <div className="body">
        {
          this.state.currentLetter === undefined || this.state.data.length < 25 ?
            <span className="filler"/>
          :
            <>
              {
                this.state.currentLetter.length === undefined ?
                  <Letter className="letter" letter={ this.state.currentLetter }/>
                :
                  <>
                    {
                      this.state.currentLetter.map(letter =>
                        <Letter key={ letter.title } className="letter" letter={ letter }/>
                      )
                    }
                  </>
              }
            </>
        }
      </div>
    )
  }
}
