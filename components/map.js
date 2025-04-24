/**************MAP****************/
import { Boundary } from "./boundary.js";
export class Map {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.width = 6400;
    this.height = 6400;
    this.game = game;
    this.img = new Image();
    this.img.src = "./images/enviorment/background/map.png";
    this.relPosX = this.width / 2 - this.game.width / 2;
    this.relPosY = this.height / 2 - this.game.height / 2;
    this.tileSize = 32;
    /******RESOURCES*******/
    /*****COLLISIONS*****/
    this.collisionsMap = [];
    this.boundaries = [];
    /*CODE*/
    this.setCollisions();
    this.setBoundaries();
  }
  setBoundaries() {
    this.collisionsMap.forEach((row, i) => {
      row.forEach((symbol, j) => {
        if (symbol === 391)
          this.boundaries.push(
            new Boundary(
              this.game,
              this.ctx,
              j * this.tileSize,
              i * this.tileSize,
              this.tileSize,
              this.tileSize
            )
          );
      });
    });
  }
  setCollisions() {
    for (let i = 0; i < collisions.length; i += 200) {
      //COLLISIONS ARE 200(blocks width of map) PIXELS APART -> 2 dimensional array
      this.collisionsMap.push(collisions.slice(i, i + 200));
    }
  }
  update() {}
  draw() {
    this.ctx.drawImage(
      this.img,
      this.relPosX,
      this.relPosY,
      this.game.width,
      this.game.height,
      0,
      0,
      this.game.width,
      this.game.height
    );
  }
}
