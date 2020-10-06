import PageFrame from "../../components/PageFrame/index.js";

const TOTAL_BUCKET_SIZE = 26955
const FIXED_LENGTH = String(TOTAL_BUCKET_SIZE).length

function convertNumToFixedLengthString (number) {
  return String(number).padStart(FIXED_LENGTH, '0')
}

export default class Search {

  constructor(reRender) {
    this.reRender = reRender
    this.cdnDirectory = ['https://image-enhancement.s3.ap-south-1.amazonaws.com/original/', 'https://image-enhancement.s3.ap-south-1.amazonaws.com/enhanced/']

    this.selectedCount = TOTAL_BUCKET_SIZE
    this.shownImagesArr = []
  }

  findNextImageToShow () {
    if (!this.selectedCount) {
      this.selectedIndex = null
      return
    }

    let index = Math.floor(Math.random() * this.selectedCount)

    this.selectedIndex = null
    let count = -1

    for (let i =0; i < TOTAL_BUCKET_SIZE; i++) {
      if (!this.shownImagesArr[i]) {
        count++
      }
      if (index === count) {
        this.shownImagesArr[i] = true
        this.selectedIndex = i + 1
        break
      }
    }

    this.selectedCount--
    
    if (Math.floor(Math.random() * 2)) {
      this.toggleView = true
    } else {
      this.toggleView = false
    }
  }

  getPageContent() {
    this.findNextImageToShow()
    if (!this.selectedIndex) {
      return`
        <div class='thanks-text'>Thank you for your feedback!!!</div>
      `
    }

    const indexes = this.toggleView ? [1, 0] : [0, 1]
    const imageSerialNumber = convertNumToFixedLengthString(this.selectedIndex)

    return `
      <div class='img-container'>
        <img class='img-style' data-serialno=${indexes[0]} src='${this.cdnDirectory[indexes[0]]}${imageSerialNumber}.jpg' />
        <img class='img-style' data-serialno=${indexes[1]} src='${this.cdnDirectory[indexes[1]]}${imageSerialNumber}.jpg' />
      </div>
    `;
  }
  render() {
    const pageFrame = new PageFrame("Please select the image you feel is more visually appealing", this.getPageContent(), true);
    return pageFrame.render();
  }

  submitPreference (selectedImage) {
    const data = {
      id: this.selectedIndex,
      selected_version: selectedImage ? 'ML' : 'default'
    }
    return fetch('https://leads.housing.com/api/v0/create-pyr?source=image_comparison', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  }

  attachListener () {
    const containerDiv = document.getElementById("app")

    containerDiv.onclick = event => {
      let className = event.target.className

      if (className === 'img-style') {
        this.submitPreference(Number(event.target.dataset['serialno']))
          .finally(() => {
            this.reRender()
          })
      }
    }
  }
}