import { Boundary } from "./boundary.js";
import { ForegroundLayer } from "./foreground layer.js";
export class Base {
  constructor(game, ctx) {
    this.game = game;
    this.ctx = ctx;
    this.base = 1200;
    this.width = this.game.map.tileSize * 3;
    this.height = this.game.map.tileSize * 4;
    this.spriteWidth = 96;
    this.spriteHeight = 128;
    this.relPosX = this.game.map.width / 2 - this.width / 2;
    this.relPosY = this.game.map.height / 2 - this.height / 2 - 90;
    this.posY = this.game.height / 2 - this.height / 2 - 90;
    this.posX = this.game.width / 2 - this.width / 2;
    this.img = new Image();
    this.img.src = "./images/enviorment/decorations/tent.png";
    this.foreground = new ForegroundLayer(
      this.game,
      this.ctx,
      this.relPosX,
      this.relPosY,
      this.width,
      this.height,
      this.spriteWidth,
      this.spriteHeight,
      this.img.src,
      { x: this.posX, y: this.posY }
    );
    /*******CODE*********/

    /****PUSHING ITEM 174 INTO BOUNDARY ARRAY****/

    for (let i = 1; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.game.map.collisionsMap[Math.floor(this.relPosY / 32) + i][
          Math.floor(this.relPosX / 32) + j
        ] = 391;
      }
    }
    this.game.map.boundaries.push(
      new Boundary(
        this.game,
        this.ctx,
        this.relPosX,
        this.relPosY + 20,
        this.width,
        this.height - 40
      )
    );
  }
  update() {}
  draw() {
    this.ctx.drawImage(
      this.img,
      0,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.posX,
      this.posY,
      this.width,
      this.height
    );
  }
}
