export class ForegroundLayer {
  constructor(
    game,
    ctx,
    relPosX,
    relPosY,
    width,
    height,
    spriteWidth,
    spriteHeight,
    source,
    position
  ) {
    this.game = game;
    this.ctx = ctx;
    this.height = height;
    this.width = width;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.relPosX = relPosX;
    this.relPosY = relPosY;
    this.posX = position.x;
    this.posY = position.y;
    this.img = new Image();
    this.img.src = source;
    this.frameX = 0;
    this.frameY = 0;
  }
  draw() {
    this.ctx.drawImage(
      this.img,
      this.frameX,
      this.frameY,
      this.spriteWidth,
      this.spriteHeight / 2,
      this.posX,
      this.posY,
      this.width,
      this.height / 2
    );
  }
}
