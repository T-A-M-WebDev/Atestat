import { objectIdle, Dead, Alive } from "./states.js";
export class natureCollectibles {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.objectMapMainLayer = [];
    this.objectMapOnTopLayer = [];
    this.windDirection = "left";
    this.trees = {
      greenTree: [],
      orangeTree: [],
    };
    this.rocks = {
      stone: [],
    };
    this.collectibleCodes = {
      // CODES FOR DRAWING ITEM ON MAP
      greenTree: {
        top_left: 131,
        top_mid: 132,
        top_right: 133,
        middle_top_left: 157,
        middle_top_mid: 158,
        middle_top_right: 159,
        middle_bottom_left: 183,
        middle_bottom_mid: 184,
        middle_bottom_right: 185,
        bottom_left: 209,
        bottom_mid: 210,
        bottom_right: 211,
      },
      orangeTree: {
        top_left: 134,
        top_mid: 135,
        top_right: 136,
        middle_top_left: 160,
        middle_top_mid: 161,
        middle_top_right: 162,
        middle_bottom_left: 186,
        middle_bottom_mid: 187,
        middle_bottom_right: 188,
        bottom_left: 212,
        bottom_mid: 213,
        bottom_right: 214,
      },
      stone: {
        top_left: 59,
        top_right: 60,
        bottom_left: 85,
        bottom_right: 86,
      },
    };

    this.update();
  }

  update() {
    this.objectMapMainLayer = [];
    this.objectMapOnTopLayer = []; //first green trees then orange
    this.trees = {
      greenTree: [],
      orangeTree: [],
    };
    this.rocks = {
      stone: [],
    };
    for (let i = 0; i < greenTrees[0].length; i += 200) {
      //rendering trees

      this.objectMapMainLayer.push(greenTrees[0].slice(i, i + 200));
      this.objectMapOnTopLayer.push(greenTrees[1].slice(i, i + 200));
    }
    for (let i = 0; i < orangeTrees[0].length; i += 200) {
      //rendering trees
      this.objectMapMainLayer.push(orangeTrees[0].slice(i, i + 200));
      this.objectMapOnTopLayer.push(orangeTrees[1].slice(i, i + 200)); //format 0 and 1 for part of array for main and onTop layer
    }
    for (let i = 0; i < stone.length; i += 200) {
      //stone

      this.objectMapMainLayer.push(stone.slice(i, i + 200));
    }

    this.objectMapMainLayer.forEach((row, i) => {
      row.forEach((symbol, j) => {
        let tile = this.game.map.tileSize;
        let obj;

        switch (symbol) {
          case this.collectibleCodes.greenTree.top_left:
            this.trees.greenTree.push(
              new tree(
                this.game,
                this.ctx,
                j * tile,
                (i % 200) * tile,
                tile * 3,
                tile * 4,
                "greenTree"
              )
            );
            obj = "tree";
            break;
          case this.collectibleCodes.orangeTree.top_left:
            this.trees.orangeTree.push(
              new tree(
                this.game,
                this.ctx,
                j * tile,
                (i % 200) * tile,
                tile * 3,
                tile * 4,
                "orangeTree"
              )
            );
            obj = "tree";
            break;
          case this.collectibleCodes.stone.top_left:
            this.rocks.stone.push(
              new rock(
                this.game,
                this.ctx,
                j * tile,
                (i % 200) * tile,
                tile * 2,
                tile * 2,
                "stone"
              )
            );
            obj = "rock";
            break;
        }
        if (obj === "tree") {
          for (let x = 0; x < 3; x++)
            for (let y = 0; y < 3; y++) {
              this.game.map.collisionsMap[(i % 200) + x][j + y] = 391;
            }
        }
        if (obj === "rock") {
          for (let x = 0; x < 2; x++)
            for (let y = 0; y < 2; y++)
              this.game.map.collisionsMap[(i % 200) + x][j + y] = 391;
        }
      });
    });
    this.objectMapOnTopLayer.forEach((row, i) => {
      row.forEach((symbol, j) => {
        let tile = this.game.map.tileSize;
        let obj;
        switch (symbol) {
          case this.collectibleCodes.greenTree.top_left:
            this.trees.greenTree.push(
              new tree(
                this.game,
                this.ctx,
                j * tile,
                (i % 200) * tile,
                tile * 3,
                tile * 4,
                "greenTree"
              )
            );
            obj = "tree";
            break;
          case this.collectibleCodes.orangeTree.top_left:
            this.trees.orangeTree.push(
              new tree(
                this.game,
                this.ctx,
                j * tile,
                (i % 200) * tile,
                tile * 3,
                tile * 4,
                "orangeTree"
              )
            );
            obj = "tree";
            break;
          case this.collectibleCodes.stone.top_left:
            this.rocks.stone.push(
              new rock(
                this.game,
                this.ctx,
                j * tile,
                (i % 200) * tile,
                tile * 2,
                tile * 2,
                "stone"
              )
            );
            obj = "rock";
            break;
        }
        if (obj === "tree") {
          for (let x = 0; x < 3; x++)
            for (let y = 0; y < 3; y++)
              this.game.map.collisionsMap[(i % 200) + x][j + y] = 391;
        }
        if (obj === "rock") {
          for (let x = 0; x < 2; x++)
            for (let y = 0; y < 2; y++)
              this.game.map.collisionsMap[(i % 200) + x][j + y] = 391;
        }
      });
    });
    this.game.map.setCollisions();
    this.game.map.setBoundaries();
  }
  draw() {}
}

export class tree {
  constructor(
    game,
    ctx,
    relPosX,
    relPosY,
    spriteWidth,
    spriteHeight,
    treeType
  ) {
    this.ctx = ctx;
    this.game = game;
    this.relPosX = relPosX;
    this.relPosY = relPosY; // Offset by 1 tile
    this.posX = this.relPosX - this.game.offsetX;
    this.posY = this.relPosY - this.game.offsetY;
    this.basePosX = this.relPosX - this.game.offsetX;
    this.basePosY = this.relPosY - this.game.offsetY;
    this.collisionMapPositions = [
      [this.relPosY / 32, this.relPosX / 32],
      [this.relPosY / 32, this.relPosX / 32 + 1],
      [this.relPosY / 32, this.relPosX / 32 + 2],
      [this.relPosY / 32 + 1, this.relPosX / 32],
      [this.relPosY / 32 + 1, this.relPosX / 32 + 1],
      [this.relPosY / 32 + 1, this.relPosX / 32 + 2],
      [this.relPosY / 32 + 2, this.relPosX / 32],
      [this.relPosY / 32 + 2, this.relPosX / 32 + 2],
    ];
    this.treeType = treeType;
    this.health = 200;
    this.damageTaken = 30;
    this.resourceType = "wood";
    this.resourceQuantity = 120;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.width = spriteWidth;
    this.height = spriteHeight;
    this.treeType = treeType;
    this.collisionBoundaryBreak = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.gameFrames = 0;
    this.staggerFrames = 10;
    this.position = 0;
    this.totalFrames = 5;
    this.img = new Image();
    this.img.src =
      this.treeType === "greenTree"
        ? "./images/enviorment/decorations/sprite_sheet_1.png"
        : "./images/enviorment/decorations/sprite_sheet_2.png";
    this.states = [new objectIdle(this), new Alive(this), new Dead(this)];
    this.currentState = this.states[0];
  }
  update(click = false) {
    this.currentState.handleInput(click);
  }
  draw() {
    this.ctx.drawImage(
      this.img,
      this.frameX,
      this.frameY - 2,
      this.spriteWidth,
      this.spriteHeight,
      this.posX,
      this.posY,
      this.spriteWidth,
      this.spriteHeight
    );
  }
  setState(state) {
    this.currentState = this.states[state];
    this.currentState.state = this.currentState.state.toLowerCase();
    this.currentState.enter();
  }
}
export class rock {
  constructor(
    game,
    ctx,
    relPosX,
    relPosY,
    spriteWidth,
    spriteHeight,
    rockType
  ) {
    this.ctx = ctx;
    this.game = game;
    this.relPosX = relPosX;
    this.relPosY = relPosY; // Offset by 1 tile
    this.basePosX = this.relPosX - this.game.offsetX;
    this.basePosY = this.relPosY - this.game.offsetY;
    this.posX = Math.floor(this.relPosX - this.game.offsetX);
    this.posY = Math.floor(this.relPosY - this.game.offsetY);

    this.collisionMapPositions = [
      [this.relPosY / 32, this.relPosX / 32],
      [this.relPosY / 32, this.relPosX / 32 + 1],
      [this.relPosY / 32 + 1, this.relPosX / 32],
      [this.relPosY / 32 + 1, this.relPosX / 32 + 1],
    ];
    this.rockType = rockType;
    this.health = 120;
    this.damageTaken = 30;
    this.resourceType = "stone";
    this.resourceQuantity = 10;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.width = spriteWidth;
    this.height = spriteHeight;
    this.frameY = 0;
    this.img = new Image();
    this.img.src = "./images/enviorment/decorations/sprite_sheet_3.png";
    this.states = [new objectIdle(this), new Alive(this), new Dead(this)];
    this.currentState = this.states[0];
  }
  update(click = false) {
    this.currentState.handleInput(click);
  }
  draw() {
    this.ctx.drawImage(
      this.img,
      0,
      this.frameY,
      this.spriteWidth,
      this.spriteHeight,
      this.posX,
      this.posY,
      this.spriteWidth,
      this.spriteHeight
    );
  }
  setState(state) {
    this.currentState = this.states[state];
    this.currentState.state = this.currentState.state.toLowerCase();
    this.currentState.enter();
  }
}
