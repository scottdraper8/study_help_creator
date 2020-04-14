import React from 'react'
import $ from 'jquery'
import "../css/Letter.css"
import "../css/button.css"

export default class Letter extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      links: this.props.letter.links
    }

    this.editCard = this.editCard.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  // componentDidMount() {
  //   for (let i = 0; i < this.state.links.length; i++) {
  //     this.state.links[i]
  //   }
  // }
  handleDelete(element) {
    const confirm = window.confirm("Are you sure you'd like to delete this?")
    if (confirm) {
      $(element).remove()
    }
  }

  handleSubmit(event) {
    console.log(event.target.value);
  }

  editCard(id, event) {
    if (event.target.innerText === "EDIT") {
      event.target.innerText = "SUBMIT"

      event.preventDefault()

      $(`<button><div></div><a href=#>MERGE</a></button>`)
      .addClass("merge")
      .width($(`#card-${id} .control-panel button`)[0].offsetWidth)
      .appendTo(`#card-${id} .control-panel`)

      $("<button><div></div><a href=#>DELETE</a></button>")
      .addClass("delete")
      .on('click', this.handleDelete.bind(this, `#card-${id}`))
      .appendTo(`#card-${id} .control-panel`)

      let x = 0
      for (let i = 0; i < $(`#${id} p`).length; i++) {
        let text = $(`#${id} p`)[i].innerText
        $(`#${id} p`)[i].innerText = ""

        $(
          `<div id=${id}-div${i}>
            <textarea id=${id}-textarea${i}>${text}</textarea>
            <button id=${id}-button${i}>✖</button>
          </div>`
        ).addClass("textarea").appendTo(`#${id}`)

        // Delete button function
        $(`#${id}-button${i}`).on('click', this.handleDelete.bind(this, `#${id}-div${i}`))

        // Formatting the textareas
        let width = $(".topic")[0].offsetWidth
        $(`#${id}-div${i}`).width((.75 * width) + "px")
        // Formatting the textareas
        let height = $(`#${id}-textarea${i}`)[0].scrollHeight + "px"
        $(`#${id}-textarea${i}`).height(height)

        // Dynamically formatting the div
        setTimeout(() => {
          $(`#card-${id}`).css({ 'width': 'fit-content', 'min-width': '75vw' })
        }, 50)

        x++
      }

      // Add new paragraph button
      setTimeout(() => {
          $(`<button><div></div><a href=#>ADD NEW PARAGRAPH</a></button>`)
          .on('click', (event) => {
            event.preventDefault()
            $(
              `<div id=${id}-div${x + 1}>
                <textarea id=${id}-textarea${x + 1}></textarea>
                <button id=${id}-button${x + 1}>✖</button>
              </div>`
            ).addClass("textarea").insertBefore(event.target.parentElement)
          })
          .addClass("addNewP").appendTo(`#${id}`)
        }, 50)
    } else {
      event.preventDefault()

      $(`#card-${id} .control-panel button`)[0].innerText = "EDIT"

      $(`#card-${id} .control-panel .merge`).remove()
      $(`#card-${id} .control-panel .delete`).remove()

      for (let i = 0; i < $(`#${id} .textarea`).length; i) {
        console.log($(`#${id} textarea`)[i].value);
        let x = 0

        let text = $(`#${id} textarea`)[i].value
        $(`#${id} .textarea`)[i].remove()

        $(`<p id=${id}-p${x}>${text}</p>`).appendTo(`#${id}`)
        x++
      }
      $(`#${id} .addNewP`).remove()

      setTimeout(() => {
        $(`#card-${id}`).css('width', '75vw')
      }, 50)
    }
  }

  render() {
    return(
      <div className="letter">
        {
          this.props.letter.topic === undefined ?
            <span className="filler"/>
          :
            this.props.letter.topic.map(
              (topic, i) => {
                const id = (i.toString() + topic)
                .split(" ")
                .join()
                .replace(/,/g, "")

                return (
                    <div key={ id } id={ `card-${id}` } className="card">
                      <div className="topic">
                        <div>
                          <p className="topic-header">{ topic }</p>

                          <div id={ id } className="content">
                            {
                              this.props.letter.content[i] === undefined || this.props.letter.content[i] === null ?
                                <span className="filler"/>
                              :
                                this.props.letter.content[i]
                                .split('*NEW-<LI>-ON-PAGE*')
                                .map(
                                  (p, x) =>
                                    <p key={ x } id= { x }>{ p }</p>
                                )
                            }
                          </div>
                        </div>
                        <div className="control-panel">
                          <button onClick={this.editCard.bind(this, id) }>
                            <div/>
                            <a href="#">EDIT</a>
                          </button>
                        </div>
                      </div>
                    </div>
                )
              }
            )
          }
      </div>
    )
  }
}
