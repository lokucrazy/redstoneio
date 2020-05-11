import Redstone from "./redstone"
import type { RedstoneShape } from "./redstone"

class Block {
  id: number
  x: number
  x1: number
  y: number
  y1: number
  ctx: CanvasRenderingContext2D | null
  redstone: Redstone | null
  neighborsX: Array<Block>
  neighborsY: Array<Block>
  constructor(ctx: CanvasRenderingContext2D | null , x: number, y: number, id: number) {
    this.id = id
    this.x = x
    this.x1 = x + 20
    this.y = y
    this.y1 = y + 20
    this.ctx = ctx
    this.redstone = null
    this.neighborsX = new Array<Block>(2)
    this.neighborsY = new Array<Block>(2)
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
    if (this.redstone != null) this.applyRedstone()
  }

  private applyRedstone() {
    this.redstone = new Redstone(this.ctx)
    let newShape = this.checkNeighbors()
    if (newShape != this.redstone.shape) {
      this.addShape(newShape)
      this.updateNeighbors()
    } else {
      this.addShape(this.redstone.shape)
    }
  }

  private removeRedstone() {
    this.clearShape()
    this.redstone = null
    this.updateNeighbors()
  }

  private addShape(shape: RedstoneShape) {
    let drawX = this.x
    let drawY = this.y
    switch(shape) {
      case 0:
        drawX += 10
        drawY += 10
        break
      case 1:
        drawX += 1
        drawY += 8
        break
      case 2:
        drawX += 8
        drawY += 1
        break
      case 3:
        break
    }
    this.clearShape()
    this.redstone?.draw(drawX, drawY, shape)
  }

  private clearShape() {
    this.ctx?.beginPath()
    this.ctx?.clearRect(this.x+1,this.y+1, 18, 18)
    this.ctx?.closePath()
  }

  private checkNeighbors(): RedstoneShape {
    let val = 0
    if (this.neighborsX[0]?.redstone || this.neighborsX[1]?.redstone) {
      val += 1
    }
    if (this.neighborsY[0]?.redstone || this.neighborsY[1]?.redstone) {
      val += 2
    }
    return val as RedstoneShape
  }

  private updateNeighbors() {
    this.neighborsX.forEach(neighbor => neighbor.update())
    this.neighborsY.forEach(neighbor => neighbor.update())
  }
}

export default Block