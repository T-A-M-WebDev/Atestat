export class ForegroundLayer {
  constructor(
    game,
    ctx,
    relPosX,
    relPosy,
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
    this.relPosy = relPosy;
    this.posX = position.x;
    this.posY = position.y;
    this.img = new Image();
    this.img.src = source;
  }
  draw(frameX = 0, frameY = 0) {
    this.ctx.drawImage(
      this.img,
      frameX,
      frameY,
      this.spriteWidth,
      this.spriteHeight / 2,
      this.posX,
      this.posY,
      this.width,
      this.height / 2
    );
  }
}
