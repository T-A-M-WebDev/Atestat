import { Skeleton } from "./enemy.js";

export class enemySystem {
  constructor(game, ctx) {
    this.enemies = [];
    this.game = game;
    this.ctx = ctx;

    const map = this.game.map.collisionsMap;
    const tileSize = 32;
    const enemyCount = Math.floor(Math.random() * 11) + 30; // 30–40
    const enemyWidth = 67 * 1.5; // from Skeleton class
    const enemyHeight = 52 * 1.5;

    const mapHeight = map.length;
    const mapWidth = map[0].length;

    let attempts = 0;
    let maxAttempts = 1000;

    while (this.enemies.length < enemyCount && attempts < maxAttempts) {
      const xTile = Math.floor(Math.random() * mapWidth);
      const yTile = Math.floor(Math.random() * mapHeight);

      // Top-left pixel position
      const relX = xTile * tileSize;
      const relY = yTile * tileSize;

      // Check the tile area occupied by the enemy
      const tilesWide = Math.ceil(enemyWidth / tileSize);
      const tilesHigh = Math.ceil(enemyHeight / tileSize);

      let valid = true;
      for (let dy = 0; dy < tilesHigh; dy++) {
        for (let dx = 0; dx < tilesWide; dx++) {
          const tx = xTile + dx;
          const ty = yTile + dy;
          if (ty >= mapHeight || tx >= mapWidth || map[ty][tx] === 391) {
            valid = false;
            break;
          }
        }
        if (!valid) break;
      }

      if (
        valid &&
        relX < this.game.base.relPosX - 1200 &&
        relY < this.game.base.relPosY - 1200 &&
        relX > this.game.base.relPosX + 1200 &&
        relY > this.game.base.relPosY + 1200
      ) {
        this.enemies.push(
          new Skeleton(
            this.game,
            this.ctx,
            "./images/characters/Skeleton Warrior Sprite Sheet.png",
            relX,
            relY
          )
        );
      }

      attempts++;
    }
    this.enemies.push(
      new Skeleton(
        this.game,
        this.ctx,
        "./images/characters/Skeleton Warrior Sprite Sheet.png",
        this.game.player.relPosX + 100,
        this.game.player.relPosY
      )
    );
  }

  draw() {
    if (this.enemies.length !== 0) {
      this.enemies.forEach((enemy) => {
        enemy.draw();
      });
    }
  }

  update() {}
}
