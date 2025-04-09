import { sceneryObject } from "./scenery object.js";

export class Scenery {
  constructor(game, ctx) {
    this.game = game;
    this.ctx = ctx;
    this.interactablesCodes = {
      // CODES FOR DRAWING INTERACTABLES ON MAP
      grass: { bottom: 63, top: 37 },
      sunflower: { bottom: 40, top: 14 },
      cattail: { bottom: 292, top: 266 },
    };

    this.primaryLayerMap = [];
    this.onTopLayerMap = [];
    this.interactables = [];

    // For every block, create 2D array representation
    for (let i = 0; i < interactablesLayer.length; i += 200) {
      this.primaryLayerMap.push(interactablesLayer.slice(i, i + 200));
      this.onTopLayerMap.push(interactablesOnTopLayer.slice(i, i + 200));
    }
    // Loading interactables into primaryLayerMap
    this.primaryLayerMap.forEach((row, i) => {
      row.forEach((symbol, j) => {
        let image;
        switch (symbol) {
          case 63:
            image = "./images/enviorment/decorations/grass.png";
            break;
          case 40:
            image = "./images/enviorment/decorations/sunflower.png";
            break;
          case 292:
            image = "./images/enviorment/decorations/cattail.png";
            break;
          default:
            image = undefined;
        }

        // If image is found, add to interactables
        if (image != undefined) {
          this.interactables.push(
            new sceneryObject(
              this.game,
              this.ctx,
              j * this.game.map.tileSize,
              i * this.game.map.tileSize,
              this.game.map.tileSize,
              this.game.map.tileSize * 2,
              image
            )
          );
        }
      });
    });

    // Loading interactables into onTopLayerMap
    this.onTopLayerMap.forEach((row, i) => {
      row.forEach((symbol, j) => {
        let image;
        switch (symbol) {
          case 63:
            image = "./images/enviorment/decorations/grass.png";
            break;
          case 40:
            image = "./images/enviorment/decorations/sunflower.png";
            break;
          case 292:
            image = "./images/enviorment/decorations/cattail.png";
            break;
          default:
            image = undefined;
        }

        // If image is found, add to interactables
        if (image != undefined) {
          this.interactables.push(
            new sceneryObject(
              this.game,
              this.ctx,
              j * this.game.map.tileSize,
              i * this.game.map.tileSize,
              this.game.map.tileSize,
              this.game.map.tileSize * 2,
              image
            )
          );
        }
      });
    });
  }

  draw() {}
}
