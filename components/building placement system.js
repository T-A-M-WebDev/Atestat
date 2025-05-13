import { Boundary } from "./boundary.js";
import { ForegroundLayer } from "./foreground layer.js";

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
    this.resourceCost = {
      wood: { wood: 40, stone: 0 },
      stone: { wood: 20, stone: 50 },
    };
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
        radius: 3,
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
          "one-connection-left": { x: 32 * 3, y: 3 * 32 },
        },
      },
      stone: {
        health: 500,
        width: 32,
        height: 32,
        spriteWidth: 16,
        spriteHeight: 24,
        boundary: { width: 32, height: 32 },
        radius: 3,
        joints: {
          "no-connection": { x: 0, y: 8 * 7 },
          "all-connection": { x: 0, y: 8 * 7 },
          "one-connection-down": { x: 0, y: 8 },
          "one-connection-up": { x: 0, y: 8 * 7 },
          "one-connection-left": { x: 8 * 6, y: 8 * 7 },
          "one-connection-right": { x: 8 * 2, y: 8 * 7 },
          "two-connection-up-down": { x: 2 * 8, y: 8 },
          "two-connection-right-down": { x: 9 * 8, y: 8 },
          "two-connection-up-right": { x: 9 * 8, y: 8 * 7 },
          "two-connection-left-right": { x: 4 * 8, y: 8 * 7 },
          "two-connection-left-down": { x: 13 * 8, y: 8 },
          "two-connection-up-left": { x: 13 * 8, y: 8 * 7 },
          "three-connection-left-right-up": { x: 4 * 8, y: 8 * 7 },
          "three-connection-right-left-down": { x: 4 * 8, y: 8 * 7 },
          "three-connection-down-up-right": { x: 2 * 8, y: 8 },
          "three-connection-down-left-up": { x: 2 * 8, y: 8 },
        },
      },
    };
    this.upgradeContainer = document.createElement("div");
    this.upgradeContainer.classList.add("upgrade-button");
    const img = document.createElement("img");
    img.src = "./assets/upgrade.png";
    this.upgradeContainer.appendChild(img);
    this.hovering = false;
    this.upgradeContainer.addEventListener("click", (e) => {
      this.upgrade();
    });
    window.addEventListener("mousemove", (e) => {
      const rect = this.game.canvas.getBoundingClientRect();
      const x = Math.floor(e.clientX - rect.left);
      const y = Math.floor(e.clientY - rect.top);
      const hovering =
        x >= this.posX &&
        x <= this.posX + this.upgrades[this.currentUpgrade].width &&
        y >= this.posY &&
        y <= this.posY + this.upgrades[this.currentUpgrade].height;

      if (hovering && !this.hovering) {
        this.hovering = true;

        // Correctly position the upgrade container
        this.upgradeContainer.style.left =
          this.posX +
          this.upgrades[this.currentUpgrade].width / 2 -
          this.game.map.tileSize / 2 +
          "px";
        this.upgradeContainer.style.top =
          this.posY +
          this.upgrades[this.currentUpgrade].height / 2 -
          this.game.map.tileSize / 2 +
          "px";

        if (!document.querySelector(".UI ").contains(this.upgradeContainer)) {
          document
            .querySelector(".container")
            .appendChild(this.upgradeContainer);
        }
      } else if (!hovering && this.hovering) {
        // If hovering ends, remove the upgrade container
        this.hovering = false;
        if (
          document.querySelector(".container").contains(this.upgradeContainer)
        ) {
          document
            .querySelector(".container")
            .removeChild(this.upgradeContainer);
        }
      }
    });
  }
  draw() {
    if (this.currentUpgrade == "stone") {
      this.ctx.drawImage(
        this.img,
        this.upgrades[this.currentUpgrade].joints[
          this.game.buildingSystem.searchArea(
            this.relPosX / 32,
            this.relPosY / 32,
            "wall"
          )
        ].x,
        this.upgrades[this.currentUpgrade].joints[
          this.game.buildingSystem.searchArea(
            this.relPosX / 32,
            this.relPosY / 32,
            "wall"
          )
        ].y,
        this.upgrades[this.currentUpgrade].spriteWidth,
        this.upgrades[this.currentUpgrade].spriteHeight,
        this.posX,
        this.posY - this.upgrades[this.currentUpgrade].height + 32,
        this.upgrades[this.currentUpgrade].width,
        this.upgrades[this.currentUpgrade].height
      );
    }
    this.ctx.drawImage(
      this.img,
      this.upgrades[this.currentUpgrade].joints[
        this.game.buildingSystem.searchArea(
          this.relPosX / 32,
          this.relPosY / 32,
          "wall"
        )
      ].x,
      this.upgrades[this.currentUpgrade].joints[
        this.game.buildingSystem.searchArea(
          this.relPosX / 32,
          this.relPosY / 32,
          "wall"
        )
      ].y,
      this.upgrades[this.currentUpgrade].spriteWidth,
      this.upgrades[this.currentUpgrade].spriteHeight,
      this.posX,
      this.posY - this.upgrades[this.currentUpgrade].height + 32,
      this.upgrades[this.currentUpgrade].width,
      this.upgrades[this.currentUpgrade].height
    );
    this.upgradeContainer.style.left =
      this.posX +
      this.upgrades[this.currentUpgrade].width / 2 -
      this.game.map.tileSize / 2 +
      "px";
    this.upgradeContainer.style.top =
      this.posY +
      this.upgrades[this.currentUpgrade].height / 2 -
      this.game.map.tileSize / 2 +
      "px";
    if (
      document.querySelector(".UI ").contains(this.upgradeContainer) &&
      !this.hovering
    ) {
      document.querySelector(".UI ").removeChild(this.upgradeContainer);
    }
  }
  upgrade() {
    if (this.currentUpgrade == "stone") {
      document.querySelector(".alert-messages p").innerText =
        "Already upgraded to stone";
      document.querySelector(".alert-messages p").style.opacity = 1;
      const timer = setInterval(() => {
        document.querySelector(".alert-messages p").style.opacity -= 0.005;
      }, 10);
      setTimeout(() => {
        document.querySelector(".alert-messages p").style.opacity = 0;
        clearInterval(timer);
      }, 2000);
      setTimeout(() => {
        document.querySelector(".alert-messages p").style.opacity = 0;
      }, 2000);
      return;
    }
    this.currentUpgrade = "stone";
    this.img.src =
      "./images/enviorment/decorations/buildings/stone fence (2).png";
    this.health = this.upgrades[this.currentUpgrade].health;
    this.spriteWidth = this.upgrades[this.currentUpgrade].spriteWidth;
    this.spriteHeight = this.upgrades[this.currentUpgrade].spriteHeight;
    this.width = this.upgrades[this.currentUpgrade].width;
    this.height = this.upgrades[this.currentUpgrade].height;
    this.game.player.resources.resourceObj["wood"].quantity -=
      this.resourceCost[this.currentUpgrade].wood;
    this.game.player.resources.resourceObj["stone"].quantity -=
      this.resourceCost[this.currentUpgrade].stone;
  }
  update() {}
}
class gate {
  constructor(game, ctx, relPosX, relPosY) {
    this.game = game;
    this.ctx = ctx;
    this.relPosX = relPosX;
    this.relPosY = relPosY;
    this.posX = this.relPosX - this.game.map.relPosX;
    this.posY = this.relPosY - this.game.map.relPosY;
    this.health = 200;
    this.resourceCost = {
      wood: { wood: 20, stone: 0 },
      stone: { wood: 20, stone: 20 },
    };
    this.currentUpgrade = "wood";
    this.img = new Image();
    this.img.src = "./images/enviorment/decorations/buildings/wood gate.png";
    this.upgrades = {
      wood: {
        health: 200,
        width: 32,
        height: 32,
        spriteWidth: 32,
        spriteHeight: 32,
        boundary: { width: 32, height: 32 },
        joints: {
          "up-down": { x: 0, y: 0 },
          "left-right": { x: 32, y: 0 },
        },
      },
      stone: {
        health: 200,
        width: 32,
        height: 32,
        spriteWidth: 32,
        spriteHeight: 32,
        boundary: { width: 32, height: 32 },
        joints: {
          "up-down": { x: 0, y: 0 },
          "left-right": { x: 0, y: 32 },
        },
      },
    };
    this.spriteWidth = 32;
    this.spriteHeight = 32;
    this.upgradeContainer = document.createElement("div");
    this.upgradeContainer.classList.add("upgrade-button");
    const img = document.createElement("img");
    img.src = "./assets/upgrade.png";
    this.upgradeContainer.appendChild(img);
    this.hovering = false;
    this.upgradeContainer.addEventListener("click", (e) => {
      this.upgrade();
    });
    window.addEventListener("mousemove", (e) => {
      const rect = this.game.canvas.getBoundingClientRect();
      const x = Math.floor(e.clientX - rect.left);
      const y = Math.floor(e.clientY - rect.top);
      const hovering =
        x >= this.posX &&
        x <= this.posX + this.upgrades[this.currentUpgrade].width &&
        y >= this.posY &&
        y <= this.posY + this.upgrades[this.currentUpgrade].height;

      if (hovering && !this.hovering) {
        this.hovering = true;

        // Correctly position the upgrade container
        this.upgradeContainer.style.left =
          this.posX +
          this.upgrades[this.currentUpgrade].width / 2 -
          this.game.map.tileSize / 2 +
          "px";
        this.upgradeContainer.style.top =
          this.posY +
          this.upgrades[this.currentUpgrade].height / 2 -
          this.game.map.tileSize / 2 +
          "px";

        if (!document.querySelector(".UI ").contains(this.upgradeContainer)) {
          document
            .querySelector(".container")
            .appendChild(this.upgradeContainer);
        }
      } else if (!hovering && this.hovering) {
        // If hovering ends, remove the upgrade container
        this.hovering = false;
        if (
          document.querySelector(".container").contains(this.upgradeContainer)
        ) {
          document
            .querySelector(".container")
            .removeChild(this.upgradeContainer);
        }
      }
    });
  }
  draw() {
    this.ctx.drawImage(
      this.img,
      this.upgrades[this.currentUpgrade].joints[
        this.game.buildingSystem.searchArea(
          this.relPosX / 32,
          this.relPosY / 32,
          "gate"
        )
      ].x,
      this.upgrades[this.currentUpgrade].joints[
        this.game.buildingSystem.searchArea(
          this.relPosX / 32,
          this.relPosY / 32,
          "gate"
        )
      ].y,
      this.spriteWidth,
      this.spriteHeight,
      this.posX,
      this.posY,
      this.upgrades[this.currentUpgrade].width,
      this.upgrades[this.currentUpgrade].height
    );
    this.upgradeContainer.style.left =
      this.posX +
      this.upgrades[this.currentUpgrade].width / 2 -
      this.game.map.tileSize / 2 +
      "px";
    this.upgradeContainer.style.top =
      this.posY +
      this.upgrades[this.currentUpgrade].height / 2 -
      this.game.map.tileSize / 2 +
      "px";
  }
  upgrade() {
    if (this.currentUpgrade == "stone") {
      document.querySelector(".alert-messages p").innerText =
        "Already upgraded to stone";
      document.querySelector(".alert-messages p").style.opacity = 1;
      const timer = setInterval(() => {
        document.querySelector(".alert-messages p").style.opacity -= 0.005;
      }, 10);
      setTimeout(() => {
        document.querySelector(".alert-messages p").style.opacity = 0;
        clearInterval(timer);
      }, 2000);
      setTimeout(() => {
        document.querySelector(".alert-messages p").style.opacity = 0;
      }, 2000);
      return;
    }
    this.currentUpgrade = "stone";
    this.img.src = "./images/enviorment/decorations/buildings/stone gate.png";
    this.health = this.upgrades[this.currentUpgrade].health;
    this.spriteWidth = this.upgrades[this.currentUpgrade].spriteWidth;
    this.spriteHeight = this.upgrades[this.currentUpgrade].spriteHeight;
    this.width = this.upgrades[this.currentUpgrade].width;
    this.height = this.upgrades[this.currentUpgrade].height;
    this.game.player.resources.resourceObj["wood"].quantity -=
      this.resourceCost[this.currentUpgrade].wood;
    this.game.player.resources.resourceObj["stone"].quantity -=
      this.resourceCost[this.currentUpgrade].stone;
  }
}
class archerTower {
  constructor(game, ctx, relPosX, relPosY) {
    this.game = game;
    this.ctx = ctx;
    this.relPosX = relPosX;
    this.relPosY = relPosY;
    this.posX = this.relPosX - this.game.map.relPosX;
    this.posY = this.relPosY - this.game.map.relPosY;
    this.health = 200;
    this.spriteWidth = 70;
    this.spriteHeight = 100;
    this.width = 96;
    this.height = 160;
    this.frameX = 0;
    this.gameFrames = 0;
    this.staggerFrames = 12;
    this.position = 0;
    this.currentUpgrade = "wood";
    this.img = new Image();
    this.img.src = "./images/enviorment/decorations/buildings/wood tower1.png";
    this.resourceCost = {
      wood: { wood: 140, stone: 20 },
      stone: { wood: 100, stone: 50 },
    };
    this.upgrades = {
      wood: {
        health: 200,
        width: this.width,
        height: this.height,
        spriteWidth: this.spriteWidth,
        spriteHeight: this.spriteHeight,
        boundary: { width: 96, height: 64 },
      },
      stone: {
        health: 200,
        width: this.width,
        height: this.height + 30,
        spriteWidth: this.spriteWidth,
        spriteHeight: this.spriteHeight + 30,
        boundary: { width: 96, height: 64 },
      },
    };
    this.foreground = new ForegroundLayer(
      this.game,
      this.ctx,
      this.relPosX,
      this.relPosY,
      this.width,
      this.height + 40,
      this.spriteWidth,
      this.spriteHeight + 40,
      this.img.src,
      { x: this.posX, y: this.posY + 50 }
    );
    this.game.foregroundLayers.push(this.foreground);
    this.upgradeContainer = document.createElement("div");
    this.upgradeContainer.classList.add("upgrade-button");
    const img = document.createElement("img");
    img.src = "./assets/upgrade.png";
    this.upgradeContainer.appendChild(img);
    this.hovering = false;
    this.upgradeContainer.addEventListener("click", (e) => {
      this.upgrade();
    });
    window.addEventListener("mousemove", (e) => {
      const rect = this.game.canvas.getBoundingClientRect();
      const x = Math.floor(e.clientX - rect.left);
      const y = Math.floor(e.clientY - rect.top);
      const hovering =
        x >= this.posX &&
        x <= this.posX + this.upgrades[this.currentUpgrade].width &&
        y >= this.posY - this.upgrades[this.currentUpgrade].height / 2 &&
        y <= this.posY;

      if (hovering && !this.hovering) {
        this.hovering = true;

        // Correctly position the upgrade container
        this.upgradeContainer.style.left =
          this.posX + this.upgrades[this.currentUpgrade].width / 2 - 16 + "px";
        this.upgradeContainer.style.top =
          this.posY - this.upgrades[this.currentUpgrade].height / 2 + "px";

        if (!document.querySelector(".UI ").contains(this.upgradeContainer)) {
          document
            .querySelector(".container")
            .appendChild(this.upgradeContainer);
        }
      } else if (!hovering && this.hovering) {
        // If hovering ends, remove the upgrade container
        this.hovering = false;
        if (
          document.querySelector(".container").contains(this.upgradeContainer)
        ) {
          document
            .querySelector(".container")
            .removeChild(this.upgradeContainer);
        }
      }
    });
  }
  draw() {
    this.position = Math.floor(this.gameFrames / this.staggerFrames) % 5;
    this.frameX = this.position * this.spriteWidth;
    this.gameFrames++;
    this.ctx.drawImage(
      this.img,
      this.frameX,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.posX,
      this.posY - this.height + 32,
      this.width,
      this.height
    );
    this.foreground.frameX = this.frameX;
    this.foreground.frameY = 0;
    this.foreground.posX = this.posX;
    this.foreground.posY = this.posY - this.height + 32 + 2;
    this.upgradeContainer.style.left =
      this.posX + this.upgrades[this.currentUpgrade].width / 2 - 16 + "px";
    this.upgradeContainer.style.top =
      this.posY - this.upgrades[this.currentUpgrade].height / 2 + "px";
  }
  upgrade() {
    if (this.currentUpgrade == "stone") {
      document.querySelector(".alert-messages p").innerText =
        "Already upgraded to stone";
      document.querySelector(".alert-messages p").style.opacity = 1;
      const timer = setInterval(() => {
        document.querySelector(".alert-messages p").style.opacity -= 0.005;
      }, 10);
      setTimeout(() => {
        document.querySelector(".alert-messages p").style.opacity = 0;
        clearInterval(timer);
      }, 2000);
      setTimeout(() => {
        document.querySelector(".alert-messages p").style.opacity = 0;
      }, 2000);
      return;
    }
    this.currentUpgrade = "stone";
    this.img.src = "./images/enviorment/decorations/buildings/stone tower.png";
    this.foreground.img.src = this.img.src; //make all necesarry changes for foreground
    this.foreground.height = this.upgrades[this.currentUpgrade].height + 50;
    this.foreground.spriteHeight =
      this.upgrades[this.currentUpgrade].spriteHeight + 50;
    this.foreground.width = this.upgrades[this.currentUpgrade].width;
    this.foreground.spriteWidth =
      this.upgrades[this.currentUpgrade].spriteWidth;
    this.foreground.posX = this.posX;
    this.foreground.posY = this.posY - this.height + 32 + 2;
    this.foreground.frameX = this.frameX;
    this.foreground.frameY = 0;
    this.health = this.upgrades[this.currentUpgrade].health;
    this.spriteWidth = this.upgrades[this.currentUpgrade].spriteWidth;
    this.spriteHeight = this.upgrades[this.currentUpgrade].spriteHeight;
    this.width = this.upgrades[this.currentUpgrade].width;
    this.height = this.upgrades[this.currentUpgrade].height;
    this.game.player.resources.resourceObj["wood"].quantity -=
      this.resourceCost[this.currentUpgrade].wood;
    this.game.player.resources.resourceObj["stone"].quantity -=
      this.resourceCost[this.currentUpgrade].stone;
  }
}
export class System {
  constructor(game, ctx) {
    this.game = game;
    this.ctx = ctx;
    this.open = false;
    this.entities = [];
    this.entityType = "wall";
    this.activeState = false;
    this.placementMap = Array.from({ length: 400 }, () => Array(200).fill(0));
    this.placementAvailableCode = 10;
    this.buttons = document.querySelectorAll(
      ".BUILDING-UI.wrapper .options .option"
    );
    this.container = document.querySelector(".BUILDING-UI.wrapper ");
    this.container
      .querySelector("span.label")
      .addEventListener("click", (e) => {
        console.log("yyyyyyyy");
        if (this.activeState) {
          this.activeState = false;
          this.trackingMouse = false;
        }
      });
    this.buttons.forEach((item) => {
      item.addEventListener("click", (e) => {
        if (!this.activeState) this.activeState = true;
        if (e.target.innerText == "Wall") {
          console.log("wall");
          this.entityType = "wall";
        } else if (e.target.innerText == "Gate") {
          this.entityType = "gate";
        } else if (e.target.innerText == "Archer Tower") {
          this.entityType = "archerTower";
        }
        //toggle tracking on click
        if (this.trackingMouse) {
          this.trackingMouse = false;
          this.activeState = false;
          this.game.input.click = false;
        } else {
          this.trackingMouse = true;
          this.activeState = true;
        }
      });
    });
    /*BUTTONS FOR ADDING BUILDINGS*/
    this.trackingMouse = false;
    this.mouseEvent = null;
    this.basePosX = 99;
    this.basePosY = 99;
    this.baseRadius = 9;
    this.placementRadius = 4;
    this.setPlacement(this.basePosX, this.basePosY, this.baseRadius);
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        this.placementMap[Math.floor(this.game.base.relPosY / 32) + i - 1][
          Math.floor(this.game.base.relPosX / 32) + j - 1
        ] = this.placementAvailableCode - 1;
      }
    }
    // Track mouse position
    window.addEventListener("mousemove", (e) => {
      this.mouseEvent = e;
    });

    this.trackMouseContinuously();

    window.addEventListener("click", (e) => {
      if (!this.activeState && e.target != this.container) {
        this.trackingMouse = false;
        return;
      }
      this.game.input.click = false;
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
      if (
        entityExists ||
        this.placementMap[y / 32][x / 32] != 10 ||
        this.game.map.collisionsMap[y / 32][x / 32] == 391
      ) {
        document.querySelector(".alert-messages p").innerText =
          "Tile occupied or out of bounds";
        document.querySelector(".alert-messages p").style.opacity = 1;
        const timer = setInterval(() => {
          document.querySelector(".alert-messages p").style.opacity -= 0.005;
        }, 10);
        setTimeout(() => {
          document.querySelector(".alert-messages p").style.opacity = 0;
          clearInterval(timer);
        }, 2000);
        return;
      }
      /*       if (
        this.game.player.resources.resourceObj["wood"].quantity -
          new wall(this.game, this.ctx, 0, 0).resourceCost["wood"].wood < //verify resource costs
          0 ||
        this.game.player.resources.resourceObj["wood"].quantity -
          new wall(this.game, this.ctx, 0, 0).resourceCost["wood"].stone <
          0
      ) {        document.querySelector(".alert-messages p").style.opacity = 1;

        document.querySelector(".alert-messages p").innerText =
          "Not enough resources";            document.querySelector(".alert-messages p").style.opacity = 1;
        const timer = setInterval(() => {
          document.querySelector(".alert-messages p").style.opacity -= 0.005;
        }, 10);
        setTimeout(() => {
          document.querySelector(".alert-messages p").style.opacity = 0;
          clearInterval(timer);
        },2000);setTimeout(() => {
          document.querySelector(".alert-messages p").style.opacity = 0;
        }, 2000);
        return;
      } */
      if (
        e.clientX - rect.left >= Math.floor(this.game.player.posX / 32) * 32 &&
        e.clientX - rect.left <=
          Math.floor(this.game.player.posX / 32) * 32 +
            this.game.player.playerWidth +
            16 &&
        e.clientY - rect.top >=
          Math.floor(this.game.player.posY / 32) * 32 - 16 &&
        e.clientY - rect.top <=
          Math.floor(this.game.player.posY / 32) * 32 +
            this.game.player.playerHeight +
            32
      ) {
        document.querySelector(".alert-messages p").innerText =
          "Can't place near player";
        document.querySelector(".alert-messages p").style.opacity = 1;
        const timer = setInterval(() => {
          document.querySelector(".alert-messages p").style.opacity -= 0.005;
        }, 10);
        setTimeout(() => {
          document.querySelector(".alert-messages p").style.opacity = 0;
          clearInterval(timer);
        }, 2000);
        setTimeout(() => {
          document.querySelector(".alert-messages p").style.opacity = 0;
        }, 2000);
        return;
      }
      if (
        (e.clientX - rect.left >= this.container.offsetLeft &&
          e.clientX - rect.left <= this.container.offsetLeft + 200 &&
          e.clientY - rect.top >= this.container.offsetTop &&
          e.clientY - rect.top <= this.container.offsetTop + 200) ||
        (e.clientX - rect.left >= this.game.player.posX &&
          e.clientX - rect.left <= this.game.player.posX + 32 &&
          e.clientY - rect.top >= this.game.player.posY &&
          e.clientY - rect.top <= this.game.player.posY + 32) ||
        (e.clientX - rect.left >= this.game.base.posX &&
          e.clientX - rect.left <= this.game.base.posX + 32 &&
          e.clientY - rect.top >= this.game.base.posY &&
          e.clientY - rect.top <= this.game.base.posY + 32) ||
        (e.clientX - rect.left >= this.game.map.relPosX &&
          e.clientX - rect.left <= this.game.map.relPosX + 32 &&
          e.clientY - rect.top >= this.game.map.relPosY &&
          e.clientY - rect.top <= this.game.map.relPosY + 32)
      ) {
        document.querySelector(".alert-messages p").innerText =
          "Placement obstructed";
        document.querySelector(".alert-messages p").style.opacity = 1;
        const timer = setInterval(() => {
          document.querySelector(".alert-messages p").style.opacity -= 0.005;
        }, 10);
        setTimeout(() => {
          document.querySelector(".alert-messages p").style.opacity = 0;
          clearInterval(timer);
        }, 2000);
        setTimeout(() => {
          document.querySelector(".alert-messages p").style.opacity = 0;
        }, 2000);
        return;
      }
      if (this.entityType == "wall") {
        this.setPlacement(x / 32, y / 32, this.placementRadius);
        this.placeBuilding(x, y, this.entityType);
        const entity = this.entities[this.entities.length - 1];

        this.game.moveables.push(entity);
        this.placementMap[y / 32][x / 32] = this.placementAvailableCode - 1;
        /*       const sound = this.game.sound.families["SFX"]["build"];

        if (!this.game.sound.soundsInQueue.includes(sound)) {
          sound.volume = 1;
          this.game.sound.soundsInQueue.push(sound);
        } */
        //wall finalising construction
        this.game.player.resources.resourceObj["wood"].quantity -= new wall(
          this.game,
          this.ctx,
          0,
          0
        ).resourceCost["wood"].wood;
        this.game.player.resources.resourceObj["stone"].quantity -= new wall(
          this.game,
          this.ctx,
          0,
          0
        ).resourceCost["stone"].stone;

        this.addBoundaries(
          entity.upgrades[entity.currentUpgrade].boundary.width,
          entity.upgrades[entity.currentUpgrade].boundary.height,
          x,
          y
        );
      }
      if (this.entityType == "gate") {
        this.setPlacement(x / 32, y / 32, this.placementRadius);
        this.placeBuilding(x, y, this.entityType);
        const entity = this.entities[this.entities.length - 1];

        this.game.moveables.push(entity);
        this.placementMap[y / 32][x / 32] = this.placementAvailableCode - 1;
        this.game.player.resources.resourceObj["wood"].quantity -= new gate(
          this.game,
          this.ctx,
          0,
          0
        ).resourceCost["wood"].wood;
        this.game.player.resources.resourceObj["stone"].quantity -= new gate(
          this.game,
          this.ctx,
          0,
          0
        ).resourceCost["stone"].stone;
      }
      if (this.entityType == "archerTower") {
        for (let i = 0; i < 3; i++)
          for (let j = 0; j < 5; j++) {
            this.placementMap[y / 32 - i][x / 32 - j - 1] =
              this.placementAvailableCode - 1;
            this.placementMap[y / 32 - i][x / 32 + j - 1] =
              this.placementAvailableCode - 1;
            this.placementMap[y / 32 + i][x / 32 - j - 1] =
              this.placementAvailableCode - 1;
            this.placementMap[y / 32 + i][x / 32 + j - 1] =
              this.placementAvailableCode - 1;
            this.setPlacement(x / 32 - j, y / 32 - i, this.placementRadius * 2);
            this.setPlacement(x / 32 + j, y / 32 - i, this.placementRadius * 2);
            console.log(
              this.placementMap[y / 32 - i][x / 32 - j - 1],
              this.placementMap[y / 32 - i][x / 32 + j - 1]
            );
          }

        this.placeBuilding(x, y, this.entityType);
        const entity = this.entities[this.entities.length - 1];
        this.game.moveables.push(entity);
        this.game.player.resources.resourceObj["wood"].quantity -=
          new archerTower(this.game, this.ctx, 0, 0).resourceCost["wood"].wood;
        this.game.player.resources.resourceObj["stone"].quantity -=
          new archerTower(this.game, this.ctx, 0, 0).resourceCost[
            "stone"
          ].stone;
        this.addBoundaries(
          entity.upgrades[entity.currentUpgrade].boundary.width,
          entity.upgrades[entity.currentUpgrade].boundary.height,
          x - this.game.map.tileSize,
          y
        );
      }
    });
  }
  draw() {
    // Draw hover tile if tracking
    if (this.trackingMouse && this.mouseEvent) {
      // Draw static placement area (e.g. around base)
      this.drawAvailableArea(
        this.basePosX,
        this.basePosY,
        this.baseRadius,
        "orange"
      );
      const rect = this.game.canvas.getBoundingClientRect();
      const x = Math.floor(
        (this.mouseEvent.clientX - rect.left + this.game.map.relPosX) / 32
      );
      const y = Math.floor(
        (this.mouseEvent.clientY - rect.top + this.game.map.relPosY) / 32
      );

      this.entities.forEach((item) => {
        this.drawAvailableArea(
          item.relPosX / 32,
          item.relPosY / 32,
          this.placementRadius,
          "orange"
        );
      });
      this.drawAvailableArea(x, y, this.placementRadius, "blue");
    }

    // Draw buildings
    this.entities.forEach((item) => {
      item.draw();
    });
  }

  update() {}
  trackMouseContinuously() {
    const loop = () => {
      if (this.trackingMouse && this.mouseEvent) {
        const rect = this.game.canvas.getBoundingClientRect();
        const x =
          Math.floor(
            (this.mouseEvent.clientX - rect.left + this.game.map.relPosX) / 32
          ) * 32;
        const y =
          Math.floor(
            (this.mouseEvent.clientY - rect.top + this.game.map.relPosY) / 32
          ) * 32;
        this.drawAvailableArea(x / 32, y / 32, 3, "blue");
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
  placeBuilding(x, y, entity) {
    switch (entity) {
      case "wall":
        this.entities.push(new wall(this.game, this.ctx, x, y));
        break;
      case "gate":
        this.entities.push(new gate(this.game, this.ctx, x, y));
        break;
      case "archerTower":
        this.entities.push(
          new archerTower(this.game, this.ctx, x - this.game.map.tileSize, y)
        ); //-32 for middle positioning
        break;
      default:
        break;
    }
  }
  addBoundaries(width, height, relPosX, relPosY) {
    const rect = this.game.canvas.getBoundingClientRect();
    for (let i = 0; i < height / 32; i++)
      for (let j = 0; j < width / 32; j++) {
        this.game.map.collisionsMap[Math.floor(relPosY / 32) - i][
          relPosX / 32 - j
        ] = 391;
        this.game.map.collisionsMap[relPosY / 32 - i][relPosX / 32 + j] = 391;
      }
    let boundary = new Boundary(
      this.game,
      this.ctx,
      relPosX,
      relPosY - height + 32,
      width,
      height
    );
    console.log;
    boundary.posX = relPosX - this.game.map.relPosX;
    boundary.posY = relPosY - this.game.map.relPosY - height + 32;
    this.game.map.boundaries.push(boundary);
    this.game.moveables.unshift(boundary);
  }
  setPlacement(x, y, radius) {
    for (let i = 0; i <= radius; i++) {
      for (let j = 0; j <= radius - i; j++) {
        if (this.placementMap[y - i][x - j] == 0)
          this.placementMap[y - i][x - j] = this.placementAvailableCode;
        if (this.placementMap[y - i][x + j] == 0)
          this.placementMap[y - i][x + j] = this.placementAvailableCode;
        if (this.placementMap[y + i][x - j] == 0)
          this.placementMap[y + i][x - j] = this.placementAvailableCode;
        if (this.placementMap[y + i][x + j] == 0)
          this.placementMap[y + i][x + j] = this.placementAvailableCode;
      }
    }
  }
  drawAvailableArea(basePosX, basePosY, radius, color) {
    const x = basePosX * 32;
    const y = basePosY * 32;

    for (let i = 0; i <= radius; i++) {
      for (let j = 0; j <= radius - i; j++) {
        this.game.drawRect(
          x - j * 32 - this.game.map.relPosX,
          y - i * 32 - this.game.map.relPosY,
          32,
          32,
          color
        );

        this.game.drawRect(
          x + j * 32 - this.game.map.relPosX,
          y - i * 32 - this.game.map.relPosY,
          32,
          32,
          color
        );
        this.game.drawRect(
          x - j * 32 - this.game.map.relPosX,
          y + i * 32 - this.game.map.relPosY,
          32,
          32,
          color
        );
        this.game.drawRect(
          x + j * 32 - this.game.map.relPosX,
          y + i * 32 - this.game.map.relPosY,
          32,
          32,
          color
        );
      }
    }
  }
  searchArea(x, y, type) {
    let img = type == "wall" ? [] : "";
    if (typeof img == "object") {
      if (
        this.placementMap[y - 1][x] != this.placementAvailableCode &&
        this.game.map.collisionsMap[y - 1][x] == 391
      )
        img.push("up");
      if (
        this.placementMap[y + 1][x] != this.placementAvailableCode &&
        this.game.map.collisionsMap[y + 1][x] == 391
      )
        img.push("down");
      if (
        this.placementMap[y][x - 1] != this.placementAvailableCode &&
        this.game.map.collisionsMap[y][x - 1] == 391
      )
        img.push("left");
      if (
        this.placementMap[y][x + 1] != this.placementAvailableCode &&
        this.game.map.collisionsMap[y][x + 1] == 391
      )
        img.push("right");
      if (img.length == 0) return "no-connection"; //walls
      if (img.length == 1) {
        if (img[0] === "up") return "one-connection-up";
        if (img[0] === "down") return "one-connection-down";
        if (img[0] === "left") return "one-connection-left";
        if (img[0] === "right") return "one-connection-right";
      }
      if (img.length == 2) {
        if (img.includes("up") && img.includes("down"))
          return "two-connection-up-down";
        if (img.includes("left") && img.includes("right"))
          return "two-connection-left-right";
        if (img.includes("up") && img.includes("left"))
          return "two-connection-up-left";
        if (img.includes("up") && img.includes("right"))
          return "two-connection-up-right";
        if (img.includes("down") && img.includes("left"))
          return "two-connection-left-down";
        if (img.includes("down") && img.includes("right"))
          return "two-connection-right-down";
      }
      if (img.length == 3) {
        if (img.includes("up") && img.includes("down") && img.includes("left"))
          return "three-connection-down-left-up";
        if (img.includes("up") && img.includes("down") && img.includes("right"))
          return "three-connection-down-up-right";
        if (img.includes("left") && img.includes("right") && img.includes("up"))
          return "three-connection-left-right-up";
        if (
          img.includes("left") &&
          img.includes("right") &&
          img.includes("down")
        )
          return "three-connection-right-left-down";
      }
      if (img.length == 4) return "all-connection";
      return "no-connection";
    }
    if (typeof img == "string") {
      if (
        this.placementMap[y - 1][x] != this.placementAvailableCode ||
        this.placementMap[y + 1][x] != this.placementAvailableCode
      )
        return "up-down";
      if (
        this.placementMap[y][x - 1] != this.placementAvailableCode ||
        this.placementMap[y][x + 1] != this.placementAvailableCode
      )
        return "left-right";
      return "left-right";
    }
    //gate
  }
}
