import Block from "./blocks"

class RedstoneIO extends HTMLDivElement {
  shadow: ShadowRoot
  grid: HTMLCanvasElement
  header: HTMLHeadingElement
  blocks: Array<Array<Block>>
  gridX: number
  gridY: number
  constructor() {
    super()
    this.blocks = new Array<Array<Block>>(25)
    this.shadow = this.attachShadow({mode: 'open'})
    this.grid = document.createElement('canvas')
    this.grid.id = 'redstone-grid'
    this.grid.setAttribute('width', "500")
    this.grid.setAttribute('height', "500")
    this.header = document.createElement('h3')
    this.header.innerText = 'Welcome to redstone io!'
    this.shadow.appendChild(this.header)
    this.shadow.appendChild(this.grid)
    this.drawGrid()
    this.grid.addEventListener('click', e => this.onClick(e))
    
    this.gridX = this.grid.getBoundingClientRect().x
    this.gridY = this.grid.getBoundingClientRect().y
  }

  drawGrid() {
    let ctx = this.grid.getContext('2d')
    for (let x = 0; x < 25; x++) {
      this.blocks[x] = new Array<Block>(25)
      for (let y = 0; y < 25; y++) {
        this.blocks[x][y] = new Block(ctx, x*20, y*20)
        this.blocks[x][y].draw()
      }
    }
    this.addNeighbors()
  }

  addNeighbors() {
    this.blocks.forEach((blockColumn, x) => {
      blockColumn.forEach((block, y) => {
        if (x != 0) {
          block.neighborsX.push(this.blocks[x-1][y])
        } else if (x != this.blocks.length - 1) {
          block.neighborsX.push(this.blocks[x+1][y])
        }
        block.neighborsX = block.neighborsX.filter(Boolean)

        if (y != 0) {
          block.neighborsY.push(blockColumn[y-1])
        } else if (y != blockColumn.length - 1) {
          block.neighborsY.push(blockColumn[y+1])
        }
        block.neighborsY = block.neighborsY.filter(Boolean)

      })
    })
  }

  onClick(event: MouseEvent) {
    let mouseX = event.clientX - this.gridX
    let mouseY = event.clientY - this.gridY
    console.log({mouseX, mouseY})
    this.blocks.forEach((blockColumn, i) => {
      blockColumn.forEach((block, index) => {
        if (block.onHit(mouseX, mouseY)) {
          console.log(`hit block ${index + (i*25)}`)
          block.onClick()
        }
      })
    })
  }
}

window.customElements.define('redstone-io', RedstoneIO, {extends: 'div'})
