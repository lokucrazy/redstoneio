import Redstone from "./redstone"

class Block {
  x: number
  x1: number
  y: number
  y1: number
  ctx: CanvasRenderingContext2D | null
  redstone: Redstone | null
  neighborsX: Array<Block>
  neighborsY: Array<Block>
  shape: string
  constructor(ctx: CanvasRenderingContext2D | null ,x: number, y: number) {
    this.x = x
    this.x1 = x + 20
    this.y = y
    this.y1 = y + 20
    this.ctx = ctx
    this.redstone = null
    this.neighborsX = new Array<Block>(2)
    this.neighborsY = new Array<Block>(2)
    this.shape = 'none'
  }

  onHit(mouseX: number, mouseY: number) {
    if ((mouseX < this.x1 && mouseX > this.x) && (mouseY < this.y1 && mouseY > this.y)) {
      return true
    }
    return false
  }

  draw() {
    this.ctx?.strokeRect(this.x,this.y,20,20)
  }

  onClick() {
    if (this.redstone == null) {
      this.applyRedstone()
    } else {
      this.removeRedstone()
    }
  }

  update() {
    console.log('updating...')
    if (this.redstone != null) this.applyRedstone()
  }

  private applyRedstone() {
    this.redstone = new Redstone(this.ctx)
    let newShape = this.checkNeighbors()
    if (newShape != this.shape) {
      console.log('new shape, updating neighbors...')
      this.addShape(newShape)
      this.updateNeighbors()
    } else {
      this.addShape(this.shape)
    }
  }

  private removeRedstone() {
    this.clearShape()
    this.redstone = null
    this.updateNeighbors()
  }

  private addShape(shape: string) {
    switch(shape) {
      case 'none':
        this.clearShape()
        this.redstone?.draw(this.x + 10, this.y + 10, 0)
        break
      case 'x':
        this.clearShape()
        this.redstone?.draw(this.x + 1, this.y + 8, 1)
        break
      case 'y':
        this.clearShape()
        this.redstone?.draw(this.x + 8, this.y + 1, 2)
        break
      case 'xy':
        this.clearShape()
        this.redstone?.draw(this.x, this.y, 3)
        break
    }
    this.shape = shape
  }

  private clearShape() {
    this.ctx?.beginPath()
    this.ctx?.clearRect(this.x+1,this.y+1, 18, 18)
    this.ctx?.closePath()
  }

  private checkNeighbors(): string {
    let val = ''
    if (this.neighborsX[0]?.redstone || this.neighborsX[1]?.redstone) {
      val += 'x'
    }
    if (this.neighborsY[0]?.redstone || this.neighborsY[1]?.redstone) {
      val += 'y'
    }
    return val || 'none'
  }

  private updateNeighbors() {
    console.log('updating neighbors', this.neighborsX, this.neighborsY)
    this.neighborsX.forEach(neighbor => neighbor.update())
    this.neighborsY.forEach(neighbor => neighbor.update())
  }
}

export default Block