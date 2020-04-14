/* -----------------------------------------------------------------------------
 ____  _____ ____  _____ _   _ ____  _____ _   _  ____ ___ _____ ____
|  _ \| ____|  _ \| ____| \ | |  _ \| ____| \ | |/ ___|_ _| ____/ ___|
| | | |  _| | |_) |  _| |  \| | | | |  _| |  \| | |    | ||  _| \___ \
| |_| | |___|  __/| |___| |\  | |_| | |___| |\  | |___ | || |___ ___) |
|____/|_____|_|   |_____|_| \_|____/|_____|_| \_|\____|___|_____|____/
 ---------------------------------------------------------------------------- */
import React from 'react';
import $ from 'jquery';
import StudyHelp from './components/StudyHelp';
import './css/App.css'



/* -----------------------------------------------------------------------------
    _    ____  ____        ____ ___  __  __ ____   ___  _   _ _____ _   _ _____
   / \  |  _ \|  _ \      / ___/ _ \|  \/  |  _ \ / _ \| \ | | ____| \ | |_   _|
  / _ \ | |_) | |_) |    | |  | | | | |\/| | |_) | | | |  \| |  _| |  \| | | |
 / ___ \|  __/|  __/     | |__| |_| | |  | |  __/| |_| | |\  | |___| |\  | | |
/_/   \_\_|   |_|         \____\___/|_|  |_|_|    \___/|_| \_|_____|_| \_| |_|
 ---------------------------------------------------------------------------- */
export default class App extends React.Component {
  // +-+-+-+-+-+-+-+-+-+-+-+
  // |C|O|N|S|T|R|U|C|T|O|R|
  // +-+-+-+-+-+-+-+-+-+-+-+
  constructor() {
    super()

    this.state = {
      allData: [],
      showGs: false,
      showTg: false,
      showBd: false,
      showItc: false,
      showAll: true
    }

    this.switchStudyHelp = this.switchStudyHelp.bind(this)
    this.switchLetter = this.switchLetter.bind(this)
  }


  // +-+-+-+-+-+-+-+
  // |M|E|T|H|O|D|S|
  // +-+-+-+-+-+-+-+
  componentDidMount() {
    this.getData("scripture_guides")
    this.getData("topical_guides")
    this.getData("bible_dictionaries")
    this.getData("indices")
    this.combineData()
  }

  async getData(route) { // This method takes 1 argument so that a seperate GET request method doesn't have to be wrritten for each API
    try {
      const response = await fetch(`http://study-help-creator-1960844092.us-west-1.elb.amazonaws.com/${route}`, ()=>'json')
      const data = await response.json()

      const sort = data.map(letter => letter.title).sort()
      for (let i = 0; i < data.length; i++) {
        if (data[i].title !== sort[i]) {
          const index = data.findIndex(letter => letter.title === sort[i])
          data.splice(index, 0, data.splice(i, 1)[0])
        }
      }

      for (let i = 0; i < data.length; i++) {
          data[i].links = data[i].links
          .filter(contentLinks => contentLinks !== null)
          .map(contentLinks => {
            const obj = contentLinks
            .split("*NEW-LINK-ON-PAGE*")
            .map(link =>
              link.replace(/"|{|}/g, "").replace(/,text/, "%&%text")
              .split("%&%")
            )
            return obj.map(array =>
              Object.fromEntries(array.map(linkProps => linkProps.split(":"))))
          })
        }

        this.setState({
          [route]: data,
          alphabet: data.map(item => item.title),
          currentStudyHelp: "allData"
        })


    } catch (e) {
      console.error(e)
    }
  }


  combineData = () => { // This method will allow me to create a conglomerate array with 25 titles with each corresponding topic and content from each of the four main arrays
    const gs  = this.state.scripture_guides
    const tg  = this.state.topical_guides
    const bd  = this.state.bible_dictionaries
    const itc = this.state.indices

    if (
      gs  !== undefined &&
      tg  !== undefined &&
      bd  !== undefined &&
      itc !== undefined
    ) {
      const allData = [...gs]

      const concat = (i, key) => { // This method will concat all the topic, content, and links arrays from each of the four main arrays
        const keyValue = (
          allData[i][key].concat(
            tg[i][key],
            bd[i][key],
            itc[i][key]
          )
        )
        allData[i][key] = keyValue;
        this.setState({ allData: allData })
        if (this.state.allData.length === 25) {
          this.setState({ currentLetter: this.state.allData[0] })
        }
        this.getData("scripture_guides")
      }

      for (let i = 0; i < 25; i++) { // The concat method is invoked 25 times, once for each title, thus creating a conglomerate array
        concat(i, "topic")
        concat(i, "content")
        concat(i, "links")
      }

    } else {
      setTimeout(this.combineData, 50)
    }
  }

  switchStudyHelp(event) {
    $('header h1').text(event.target.innerText)

    const name = event.target.name

    if (name === "showGs") {
      this.setState({ currentStudyHelp: "scripture_guides" })
    } else if (name === "showTg") {
      this.setState({ currentStudyHelp: "topical_guides" })
    } else if (name === "showBd") {
      this.setState({ currentStudyHelp: "bible_dictionaries" })
    } else if (name === "showItc") {
      this.setState({ currentStudyHelp: "indices" })
    } else {
      this.setState({ currentStudyHelp: "allData" })
    }

    setTimeout(() => {
      if (this.state.currentLetter.length === undefined) {
        const index = this.state.alphabet.findIndex(letter => letter === this.state.currentLetter.title)
        this.setState({
          currentLetter: this.state[this.state.currentStudyHelp][index],
          showGs: false,
          showTg: false,
          showBd: false,
          showItc: false,
          showAll: false,
          [name]: true
        })

      } else {
        this.setState({
          currentLetter: this.state[this.state.currentStudyHelp],
          showGs: false,
          showTg: false,
          showBd: false,
          showItc: false,
          showAll: false,
          [name]: true
        })
      }
    }, 30)
  }

  switchLetter(event) {
    if (event.target.innerText === "A-Z") {
      this.setState({
        currentLetter: this.state[this.state.currentStudyHelp]
      })
    } else {
      const index = this.state.alphabet.findIndex(letter => letter === event.target.innerText)
      this.setState({
        currentLetter: this.state[this.state.currentStudyHelp][index]
      })
    }
    const currentStudyHelp = Object.keys(this.state).find(key => this.state[key] === true)
    this.setState({ [currentStudyHelp]: false })
    setTimeout(()=>{ this.setState({ [currentStudyHelp]: true }) }, 5)
  }

  render() {
    return (
      <>
        {
          this.state.currentLetter === undefined ?
            <h1 className="loading">
              <span>.</span>
              <span>.</span>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </h1>
          :
            <div className="body">
              <header>
                <h1>All Entries</h1>

                <nav>
                  <button name="showGs" id="btn-left" onClick={ this.switchStudyHelp }>
                    Guide to the Scriptures
                  </button>
                  <button name="showTg" onClick={ this.switchStudyHelp }>
                    Topical Guide
                  </button>
                  <button name="showBd" onClick={ this.switchStudyHelp }>
                    Bible Dictionary
                  </button>
                  <button name="showItc" onClick={ this.switchStudyHelp }>
                    Index to the Triple Combination
                  </button>
                  <button name="showAll" id="btn-right" onClick={ this.switchStudyHelp }>
                    All Entries
                  </button>
                </nav>
              </header>


              <div className="container">
                <aside>
                  <button className="select-letter" onClick={ this.switchLetter }>A-Z</button>
                  {
                    this.state.alphabet.map(letter =>
                      <button key={ letter } className="select-letter" onClick={ this.switchLetter }>
                        { letter }
                      </button>
                    )
                  }
                </aside>

                <main>
                  {
                    this.state.showGs ?
                      <StudyHelp className="studyHelp" data={ this.state.scripture_guides } currentLetter={ this.state.currentLetter }/>
                    :
                      <span className="filler"/>
                  }

                  {
                    this.state.showTg ?
                      <StudyHelp data={ this.state.topical_guides } currentLetter={ this.state.currentLetter }/>
                    :
                      <span className="filler"/>
                  }

                  {
                    this.state.showBd ?
                      <StudyHelp data={ this.state.bible_dictionaries } currentLetter={ this.state.currentLetter }/>
                    :
                      <span className="filler"/>
                  }

                  {
                    this.state.showItc ?
                      <StudyHelp data={ this.state.indices } currentLetter={ this.state.currentLetter }/>
                    :
                      <span className="filler"/>
                  }

                  {
                    this.state.showAll ?
                      <StudyHelp data={ this.state.allData } currentLetter={ this.state.currentLetter }/>
                    :
                      <span className="filler"/>
                  }
                </main>
              </div>
            </div>
        }
      </>
    )
  }
}
