type SignalStrength = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15
type RedstoneShape = 0 | 1 | 2 | 3

class Redstone {
  ctx: CanvasRenderingContext2D | null
  signal: SignalStrength
  shape: RedstoneShape
  constructor(ctx: CanvasRenderingContext2D | null) {
    this.ctx = ctx
    this.signal = 0
    this.shape = 0
  }

  draw(x: number, y: number, shape: RedstoneShape) {
    this.ctx?.beginPath()
    if (this.ctx != null) this.ctx.fillStyle = '#850000'
    switch(shape) {
      case 0:
        this.ctx?.arc(x,y, 8, 0, Math.PI * 2)
        this.ctx?.fill()
        break
      case 1:
        this.ctx?.fillRect(x, y, 18, 4)
        break
      case 2:
        this.ctx?.fillRect(x, y, 4, 18)
        break
      case 3:
        this.ctx?.fillRect(x, y+8, 19, 4)
        this.ctx?.fillRect(x+8, y, 4, 19)
        break
    }
    this.ctx?.closePath()
    this.shape = shape
  }
}

export default Redstone
export type {
  SignalStrength,
  RedstoneShape
}