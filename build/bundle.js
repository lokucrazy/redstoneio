(() => {
  let __hasOwnProperty = Object.hasOwnProperty;
  let __modules = {};
  let __commonjs;
  let __require = (id) => {
    let module = __modules[id];
    if (!module) {
      module = __modules[id] = {
        exports: {}
      };
      __commonjs[id](module.exports, module);
    }
    return module.exports;
  };
  let __toModule = (module) => {
    if (module && module.__esModule) {
      return module;
    }
    let result = {};
    for (let key in module) {
      if (__hasOwnProperty.call(module, key)) {
        result[key] = module[key];
      }
    }
    result.default = module;
    return result;
  };
  let __import = (id) => {
    return __toModule(__require(id));
  };
  __commonjs = {
    2() {
      // src\redstone.ts
      class Redstone {
        constructor(ctx) {
          this.ctx = ctx;
          this.signal = 0;
        }
        draw(x, y, shape) {
          var _a, _b, _c, _d, _e, _f, _g, _h;
          (_a = this.ctx) == null ? void 0 : _a.beginPath();
          if (this.ctx != null)
            this.ctx.fillStyle = "#850000";
          switch (shape) {
            case 0:
              (_b = this.ctx) == null ? void 0 : _b.arc(x, y, 8, 0, Math.PI * 2);
              (_c = this.ctx) == null ? void 0 : _c.fill();
              break;
            case 1:
              (_d = this.ctx) == null ? void 0 : _d.fillRect(x, y, 18, 4);
              break;
            case 2:
              (_e = this.ctx) == null ? void 0 : _e.fillRect(x, y, 4, 18);
              break;
            case 3:
              (_f = this.ctx) == null ? void 0 : _f.fillRect(x, y + 8, 18, 4);
              (_g = this.ctx) == null ? void 0 : _g.fillRect(x + 8, y, 4, 18);
              break;
          }
          (_h = this.ctx) == null ? void 0 : _h.closePath();
        }
      }
      const default2 = Redstone;

      // src\blocks.ts
      class Block {
        constructor(ctx, x, y) {
          this.x = x;
          this.x1 = x + 20;
          this.y = y;
          this.y1 = y + 20;
          this.ctx = ctx;
          this.redstone = null;
          this.neighborsX = new Array(2);
          this.neighborsY = new Array(2);
          this.shape = "none";
        }
        onHit(mouseX, mouseY) {
          if (mouseX < this.x1 && mouseX > this.x && (mouseY < this.y1 && mouseY > this.y)) {
            return true;
          }
          return false;
        }
        draw() {
          var _a;
          (_a = this.ctx) == null ? void 0 : _a.strokeRect(this.x, this.y, 20, 20);
        }
        onClick() {
          if (this.redstone == null) {
            this.applyRedstone();
          } else {
            this.removeRedstone();
          }
        }
        update() {
          console.log("updating...");
          if (this.redstone != null)
            this.applyRedstone();
        }
        applyRedstone() {
          this.redstone = new default2(this.ctx);
          let newShape = this.checkNeighbors();
          if (newShape != this.shape) {
            console.log("new shape, updating neighbors...");
            this.addShape(newShape);
            this.updateNeighbors();
          } else {
            this.addShape(this.shape);
          }
        }
        removeRedstone() {
          this.clearShape();
          this.redstone = null;
          this.updateNeighbors();
        }
        addShape(shape) {
          var _a, _b, _c, _d;
          switch (shape) {
            case "none":
              this.clearShape();
              (_a = this.redstone) == null ? void 0 : _a.draw(this.x + 10, this.y + 10, 0);
              break;
            case "x":
              this.clearShape();
              (_b = this.redstone) == null ? void 0 : _b.draw(this.x + 1, this.y + 8, 1);
              break;
            case "y":
              this.clearShape();
              (_c = this.redstone) == null ? void 0 : _c.draw(this.x + 8, this.y + 1, 2);
              break;
            case "xy":
              this.clearShape();
              (_d = this.redstone) == null ? void 0 : _d.draw(this.x, this.y, 3);
              break;
          }
          this.shape = shape;
        }
        clearShape() {
          var _a, _b, _c;
          (_a = this.ctx) == null ? void 0 : _a.beginPath();
          (_b = this.ctx) == null ? void 0 : _b.clearRect(this.x + 1, this.y + 1, 18, 18);
          (_c = this.ctx) == null ? void 0 : _c.closePath();
        }
        checkNeighbors() {
          var _a, _b, _c, _d;
          let val = "";
          if (((_a = this.neighborsX[0]) == null ? void 0 : _a.redstone) || ((_b = this.neighborsX[1]) == null ? void 0 : _b.redstone)) {
            val += "x";
          }
          if (((_c = this.neighborsY[0]) == null ? void 0 : _c.redstone) || ((_d = this.neighborsY[1]) == null ? void 0 : _d.redstone)) {
            val += "y";
          }
          return val || "none";
        }
        updateNeighbors() {
          console.log("updating neighbors", this.neighborsX, this.neighborsY);
          this.neighborsX.forEach((neighbor) => neighbor.update());
          this.neighborsY.forEach((neighbor) => neighbor.update());
        }
      }
      const default3 = Block;

      // src\index.ts
      class RedstoneIO extends HTMLDivElement {
        constructor() {
          super();
          this.blocks = new Array(25);
          this.shadow = this.attachShadow({
            mode: "open"
          });
          this.grid = document.createElement("canvas");
          this.grid.id = "redstone-grid";
          this.grid.setAttribute("width", "500");
          this.grid.setAttribute("height", "500");
          this.header = document.createElement("h3");
          this.header.innerText = "Welcome to redstone io!";
          this.shadow.appendChild(this.header);
          this.shadow.appendChild(this.grid);
          this.drawGrid();
          this.grid.addEventListener("click", (e) => this.onClick(e));
          this.gridX = this.grid.getBoundingClientRect().x;
          this.gridY = this.grid.getBoundingClientRect().y;
        }
        drawGrid() {
          let ctx = this.grid.getContext("2d");
          for (let x = 0; x < 25; x++) {
            this.blocks[x] = new Array(25);
            for (let y = 0; y < 25; y++) {
              this.blocks[x][y] = new default3(ctx, x * 20, y * 20);
              this.blocks[x][y].draw();
            }
          }
          this.addNeighbors();
        }
        addNeighbors() {
          this.blocks.forEach((blockColumn, x) => {
            blockColumn.forEach((block, y) => {
              if (x != 0) {
                block.neighborsX.push(this.blocks[x - 1][y]);
              } else if (x != this.blocks.length - 1) {
                block.neighborsX.push(this.blocks[x + 1][y]);
              }
              block.neighborsX = block.neighborsX.filter(Boolean);
              if (y != 0) {
                block.neighborsY.push(blockColumn[y - 1]);
              } else if (y != blockColumn.length - 1) {
                block.neighborsY.push(blockColumn[y + 1]);
              }
              block.neighborsY = block.neighborsY.filter(Boolean);
            });
          });
        }
        onClick(event) {
          let mouseX = event.clientX - this.gridX;
          let mouseY = event.clientY - this.gridY;
          console.log({
            mouseX,
            mouseY
          });
          this.blocks.forEach((blockColumn, i) => {
            blockColumn.forEach((block, index) => {
              if (block.onHit(mouseX, mouseY)) {
                console.log(`hit block ${index + i * 25}`);
                block.onClick();
              }
            });
          });
        }
      }
      window.customElements.define("redstone-io", RedstoneIO, {
        extends: "div"
      });
    }
  };
  return __require(2);
})();
