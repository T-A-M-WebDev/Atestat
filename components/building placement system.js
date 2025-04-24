import { Boundary } from "./boundary.js";
class wall {
  constructor(game, ctx, relPosX, relPosY) {
    this.game = game;
    this.ctx = ctx;
    this.relPosX = relPosX;
    this.relPosY = relPosY;
    this.posX = this.relPosX - this.game.map.relPosX;
    this.posY = this.relPosY - this.game.map.relPosY;
    this.health = 200;
    this.currentUpgrade = "wood";
    this.img = new Image();
    this.img.src = "./images/enviorment/decorations/buildings/wood fence.png";
    this.upgrades = {
      wood: {
        health: 200,
        width: 32,
        height: 32,
        spriteWidth: 32,
        spriteHeight: 32,
        boundary: { width: 32, height: 32 },
        joints: {
          "no-connection": { x: 0, y: 3 * 32 },
          "one-connection-down": { x: 0, y: 0 },
          "one-connection-up": { x: 0, y: 2 * 32 },
          "two-connection-up-down": { x: 0, y: 32 },
          "two-connection-right-down": { x: 32, y: 0 },
          "three-connection-down-up-right": { x: 32, y: 32 },
          "two-connection-up-right": { x: 32, y: 2 * 32 },
          "one-connection-right": { x: 32, y: 3 * 32 },
          "three-connection-right-left-down": { x: 2 * 32, y: 0 },
          "all-connection": { x: 2 * 32, y: 32 },
          "three-connection-left-right-up": { x: 2 * 32, y: 2 * 32 },
          "two-connection-left-right": { x: 2 * 32, y: 3 * 32 },
          "two-connection-left-down": { x: 32 * 3, y: 0 },
          "three-connection-down-left-up": { x: 32 * 3, y: 32 },
          "two-connection-up-left": { x: 32 * 3, y: 2 * 32 },
          "one-connection-up-down": { x: 32 * 3, y: 3 * 32 },
        },
      },
      stone: {},
    };
    this.spriteWidth = 32;
    this.spriteHeight = 32;
  }
  draw() {
    this.ctx.drawImage(
      this.img,
      this.upgrades[this.currentUpgrade].joints["no-connection"].x,
      this.upgrades[this.currentUpgrade].joints["no-connection"].y,
      this.spriteWidth,
      this.spriteHeight,
      this.posX,
      this.posY,
      this.upgrades[this.currentUpgrade].width,
      this.upgrades[this.currentUpgrade].height
    );
  }
  update() {}
}
class archerTower {
  constructor(game, ctx, posX, posY) {
    this.game = game;
    this.ctx = ctx;
    this.posX = posX;
    this.posY = posY;
    this.health = 200;
    this.currentUpgrade = "wood";
    this.img = new Image();
    this.img.src = "./enviorment/decorations/buildings/wood tower";
  }
  draw() {}
}
export class System {
  constructor(game, ctx) {
    this.game = game;
    this.ctx = ctx;
    this.entities = [];
    this.placementMap = Array.from({ length: 400 }, () => Array(200).fill(0));
    this.placementAvailableCode = 10;

    window.addEventListener("click", (e) => {
      // this.game.input.click = false;
      const rect = this.game.canvas.getBoundingClientRect();
      const x =
        Math.floor((e.clientX - rect.left + this.game.map.relPosX) / 32) * 32;
      const y =
        Math.floor((e.clientY - rect.top + this.game.map.relPosY) / 32) * 32;
      let entityExists = false;
      this.entities.forEach((entity) => {
        if (entity.relPosX === x && entity.relPosY === y) {
          entityExists = true;
        }
      });
      /*    if (
        // this.placementMap[y / 32][x / 32] != 10 &&
        this.game.map.collisionsMap[y / 32][x / 32] == 391
      ) */
      console.log(this.game.map.collisionsMap);
      console.log(
        y / 32,
        x / 32,
        this.placementMap[y / 32][x / 32],
        this.game.map.collisionsMap[y / 32][x / 32]
      );
      if (
        entityExists ||
        this.placementMap[y / 32][x / 32] != 10 ||
        this.game.map.collisionsMap[y / 32][x / 32] == 391
      ) {
        return;
      }
      this.placeBuilding(x, y, "wall");
      const entity = this.entities[this.entities.length - 1];
      this.game.moveables.push(entity);
      this.addBoundaries(
        entity.upgrades[entity.currentUpgrade].boundary.width,
        entity.upgrades[entity.currentUpgrade].boundary.height,
        x,
        y
      );
    });
  }
  draw() {
    const basePosX = 99;
    const basePosY = 99;
    const radius = 8;
    this.setPlacement(basePosX, basePosY, radius);
    //  this.drawAvailableArea(basePosX, basePosY, radius);
    if (this.entities.length != 0) {
      this.entities.forEach((item) => {
        item.draw();
      });
    }
  }
  update() {}
  placeBuilding(x, y, entity) {
    switch (entity) {
      case "wall":
        if (!this.entities.includes())
          this.entities.push(new wall(this.game, this.ctx, x, y));
        break;
      case "archerTower":
        this.entities.push(new archerTower(this.game, this.ctx, x, y));
        break;
      default:
        break;
    }
  }
  addBoundaries(width, height, relPosX, relPosY) {
    this.game.map.collisionsMap[Math.floor(relPosY / 32)][relPosX / 32] = 391;

    let boundary = new Boundary(
      this.game,
      this.ctx,
      relPosX - this.game.map.relPosX + this.game.offsetX,
      relPosY - this.game.map.relPosY + this.game.offsetY,
      width,
      height
    );
    this.game.map.boundaries.push(boundary);
    this.game.moveables.unshift(boundary);
  }
  setPlacement(x, y, radius) {
    this.placementMap[y][x] = this.placementAvailableCode;
    for (let i = 0; i <= radius; i++) {
      for (let j = 0; j <= radius - i; j++) {
        this.placementMap[y - i][x - j] = this.placementAvailableCode;
        this.placementMap[y - i][x + j] = this.placementAvailableCode;
        this.placementMap[y + i][x - j] = this.placementAvailableCode;
        this.placementMap[y + i][x + j] = this.placementAvailableCode;
      }
    }
  }
  drawAvailableArea(basePosX, basePosY, radius) {
    const x = basePosX * 32;
    const y = basePosY * 32;
    for (let i = 0; i <= radius; i++) {
      for (let j = 0; j <= radius - i; j++) {
        this.game.drawRect(
          x - j * 32 - this.game.map.relPosX,
          y - i * 32 - this.game.map.relPosY,
          32,
          32,
          "green"
        );

        this.game.drawRect(
          x + j * 32 - this.game.map.relPosX,
          y - i * 32 - this.game.map.relPosY,
          32,
          32,
          "green"
        );
        this.game.drawRect(
          x - j * 32 - this.game.map.relPosX,
          y + i * 32 - this.game.map.relPosY,
          32,
          32,
          "green"
        );
        this.game.drawRect(
          x + j * 32 - this.game.map.relPosX,
          y + i * 32 - this.game.map.relPosY,
          32,
          32,
          "green"
        );
      }
    }
  }
}
