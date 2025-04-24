import { Boundary } from "./boundary.js";
import { ForegroundLayer } from "./foreground layer.js";
export class Fire {
  constructor(game, ctx) {
    this.game = game;
    this.ctx = ctx;
    this.img = new Image();
    this.img.src = "./images/enviorment/decorations/lit-fire.png";
    this.width = this.game.map.tileSize;
    this.height = this.game.map.tileSize * 2;
    this.spriteWidth = 32;
    this.spriteHeight = 64;
    this.posX = this.game.width / 2 - this.width / 2;
    this.posY = this.game.height / 2 - this.height / 2 + 70;
    this.relPosX = this.game.map.width / 2 - this.width / 2;
    this.relPosY = this.game.map.height / 2 - this.height / 2 + 70;
    /***ANIMATIONS***/
    this.frameX = 0;
    this.gameFrames = 0;
    this.staggerFrames = 15;
    this.position = 0;
    this.firsRender = true;
    /****FOREGROUND LAYERS*****/
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

    /****PUSHING ITEM 175 INTO BOUNDARY ARRAY****/
    this.game.map.boundaries.push(
      new Boundary(
        this.game,
        this.ctx,
        this.relPosX,
        this.relPosY + 30,
        this.width,
        this.height - 40
      )
    );

    this.game.map.collisionsMap[Math.floor(this.relPosY / 32) + 1][
      Math.floor(this.relPosX / 32)
    ] = 391;
    this.game.map.collisionsMap[Math.floor(this.relPosY / 32) + 1][
      Math.floor(this.relPosX / 32) + 1
    ] = 391;
  }
  update() {}
  draw() {
    this.position = (Math.floor(this.gameFrames / this.staggerFrames) % 5) + 2;
    if (this.firsRender === true) {
      this.game.sound.families["BG"]["fire"].volume = 1;
      this.staggerFrames = 30;
      this.position = Math.floor(this.gameFrames / this.staggerFrames) % 5;
    }
    if (this.position >= 2) this.staggerFrames = 10;
    if (this.position > 4) this.position -= 2;
    this.frameX = this.position * this.spriteWidth;
    this.gameFrames++;
    this.ctx.drawImage(
      this.img,
      this.frameX,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.posX,
      this.posY,
      this.width,
      this.height
    );
    this.game.sound.addSoundArea(this.posX, this.posY, "BG", "fire");
    if (this.position === 4 && this.firsRender) {
      this.firsRender = false;
      this.game.sound.families["BG"]["fire"].currentTime = 0;
      this.game.sound.families["BG"]["fire"].src =
        "./assets/sounds/campfire.mp3";
    }
  }
}
