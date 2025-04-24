export class Boundary {
  constructor(game, ctx, relPosX, relPosY, width, height) {
    this.ctx = ctx;
    this.game = game;
    this.relPosX = relPosX;
    this.relPosY = relPosY;
    this.posX = this.relPosX - this.game.offsetX;
    this.posY = this.relPosY - this.game.offsetY;
    this.width = width;
    this.height = height;
  }
  draw() {
    this.game.drawRect(this.posX, this.posY, this.width, this.height, "yellow");
  }
}
