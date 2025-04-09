import { Boundary } from "./boundary.js";
const states = {
  IDLE: 0,
  WALK: 1,
  RUN: 2,
  MINE: 3,
  ATTACK: 4,
};
const coolectibleStates = {
  OBJECTIDLE: 0,
  ALIVE: 1,
  DEAD: 2,
};
class State {
  constructor(state) {
    this.state = state;
  }
}
//player states
export class Idle extends State {
  constructor(player) {
    super("IDLE");
    this.player = player;
  }
  enter() {
    for (let x in this.player.keysPressed) {
      this.player.keysPressed[x] = false;
    }
    this.player.frameY =
      this.player.animations[this.player.direction][
        this.player.currentState.state
      ][0].y;
  }
  handleInput(input) {
    if (!input) {
      // falsy value only for idle
      this.player.setState(states.IDLE);
      this.player.currentState.state =
        this.player.currentState.state.toLowerCase();
    } else {
      if (input === "click") {
        this.player.setState(states.MINE);
        return;
      }
      if (input.length == 1 && input[0] == "Shift") return; // only shift -> no change of state
      switch (input[input.length - 1]) {
        case "w":
          this.player.direction = "up";
          break;
        case "a":
          this.player.direction = "left";
          break;
        case "s":
          this.player.direction = "down";
          break;
        case "d":
          this.player.direction = "right";
          break;
      }

      this.player.setState(states.WALK);
    }
  }
}

export class Walk extends State {
  constructor(player) {
    super("WALK");
    this.player = player;
  }
  enter() {
    for (let x in this.player.keysPressed) {
      this.player.keysPressed[x] = false;
    }
    for (let x of this.player.game.input.lastKeys) {
      this.player.keysPressed[x] = true;
    }

    this.player.frameY =
      this.player.animations[this.player.direction][
        this.player.currentState.state
      ][0].y;
  }
  handleInput(input) {
    if (!input) {
      this.player.setState(states.IDLE);
      this.player.currentState.state =
        this.player.currentState.state.toLowerCase();
    } else {
      if (input === "click") {
        this.player.setState(states.MINE);
        return;
      }
      if (input.length == 2 && !input.includes("Shift")) {
        // two w a s d keys pressed
        this.player.speed = this.player.twoWayVelocity;
      } else this.player.speed = this.player.basicVelocity;
      if (input.length == 1 && input[0] == "Shift") return;
      switch (input[input.length - 1]) {
        case "w":
          this.player.direction = "up";
          break;
        case "a":
          this.player.direction = "left";
          break;
        case "s":
          this.player.direction = "down";
          break;
        case "d":
          this.player.direction = "right";
          break;
      }
      if (
        input.includes("Shift") &&
        !this.player.running.cooldown &&
        !this.player.running.active
      ) {
        this.player.running.active = true;
        this.player.running.cooldown = false;
        this.player.setState(states.RUN);
        return;
      }
      this.player.setState(states.WALK);
    }
  }
}

export class Run extends State {
  constructor(player) {
    super("RUN");
    this.player = player;
  }
  enter() {
    if (
      this.player.running.progress < this.player.running.stamina &&
      !this.player.running.cooldown
    ) {
      this.player.running.progress++;
      this.player.running.active = true;
      this.player.running.barOpacity = 100;
    }

    for (let x in this.player.keysPressed) {
      this.player.keysPressed[x] = false;
    }
    for (let x of this.player.game.input.lastKeys) {
      this.player.keysPressed[x] = true;
    }
    this.player.frameY =
      this.player.animations[this.player.direction][
        this.player.currentState.state
      ][0].y;
  }
  handleInput(input) {
    if (!input) {
      this.player.setState(states.IDLE);
      this.player.currentState.state =
        this.player.currentState.state.toLowerCase();
    } else {
      if (input === "click") {
        this.player.setState(states.MINE);
        return;
      }
      if (
        this.player.running.progress == this.player.running.stamina &&
        !this.player.running.cooldown
      ) {
        this.player.running.cooldown = true;
        this.player.running.active = false;
        this.player.setState(states.WALK);
        return;
      }
      if (input.length >= 1 && !input.includes("Shift")) {
        this.player.running.active = false;
        this.player.running.cooldown = true;
        this.player.setState(states.WALK);
        return;
      }
      if (input.length == 3) {
        // two w a s d keys pressed
        this.player.speed = this.player.twoWayVelocity;
      } else this.player.speed = this.player.basicVelocity;
      this.player.speed *= 1.5;

      switch (input[input.length - 1]) {
        case "w":
          this.player.direction = "up";
          break;
        case "a":
          this.player.direction = "left";
          break;
        case "s":
          this.player.direction = "down";
          break;
        case "d":
          this.player.direction = "right";
          break;
      }

      this.player.setState(states.RUN);
    }
  }
}

export class Mine extends State {
  constructor(player) {
    super("MINE");
    this.player = player;
    this.img = new Image();
    this.toolImg = new Image();
    this.toolActive = false; // Flag to check if the tool is active
    this.toolType = "axe"; // Type of tool
    this.itemsInRange = []; // Array to store items in range
    this.toolPositions = {
      down: [],
      up: [],
      right: [],
      left: [],
    };
    this.imageDirection = 1; //1 for positive and -1 for negative
    this.toolCorectionDirectionPos = 1; //var for correcting handle pos
    this.loadImage(); // Load tool positions when the state is initialized
  }

  loadImage() {
    this.img.src = "./images/characters/mine base.png";
    this.toolImg.src = "./images/characters/axe-right.png";
    const frameSize = 32;
    const totalFrames = 5;
    const canvas = document.createElement("canvas");
    canvas.width = this.img.width;
    canvas.height = this.img.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(this.img, 0, 0);
    const imageData = ctx.getImageData(0, 0, this.img.width, this.img.height);
    const data = imageData.data;

    const targetColor = [91, 255, 0, 255]; // RGB for #5BFF00
    this.toolPositions = { down: [], up: [], right: [], left: [] };
    // Loop through animation frames
    for (let frame = 0; frame < totalFrames; frame++) {
      let frameStartX = frame * frameSize;

      for (let y = 0; y < frameSize; y++) {
        for (let x = 0; x < frameSize; x++) {
          let pixelX = frameStartX + x;
          let index = (y * this.img.width + pixelX) * 4; // Get pixel index

          let r = data[index],
            g = data[index + 1],
            b = data[index + 2],
            a = data[index + 3];

          // If the green marker is found, store tool position relative to the player
          if (
            r === targetColor[0] &&
            g === targetColor[1] &&
            b === targetColor[2] &&
            a === targetColor[3]
          ) {
            let offsetX = x;
            let offsetY = y;
            if (this.player.direction === "down")
              switch (frame) {
                case 0:
                  offsetX = x + 14;

                  break;
                case 1:
                  offsetX = x + 14;

                  break;
                case 2:
                  offsetX = x + 14;

                case 3:
                  offsetX = x + 20;
                  break;
                case 4:
                  offsetX = x + 14;
                  break;
              }
            if (this.player.direction === "left")
              switch (frame) {
                case 0:
                  offsetX += 2;
                  offsetY -= 3;
                  break;
                case 1:
                  offsetX += 8;
                  offsetY -= 6;
                  break;
                case 2:
                  offsetX += 0;
                  offsetY -= 2;
                case 3:
                  offsetX += 14;
                  break;
                case 4:
                  offsetX += 40;
                  break;
              }

            if (this.player.direction === "right")
              switch (frame) {
                case 0:
                  offsetX += 10;
                  offsetY -= 8;
                  break;
                case 1:
                  offsetX += 8;

                  break;
                case 2:
                  offsetX += 14;
                  offsetY -= 8;
                case 3:
                  offsetX += 14;
                  offsetY -= 2;
                  break;
                case 4:
                  offsetX += 16;
                  offsetY += 3;
                  break;
              }
            if (this.player.direction === "up")
              switch (frame) {
                case 0:
                  offsetX += 7;
                  offsetY -= 2;
                  break;
                case 1:
                  offsetX += 4;
                  offsetY += 10;
                  break;
                case 2:
                  offsetX += 4;
                  offsetY += 14;
                  break;
                case 3:
                  offsetX += 8;
                  offsetY += 8;
                  break;
                case 4:
                  offsetX += 4;
                  break;
              }
            // console.log(frame);

            // Store offset based on direction
            this.toolPositions[this.player.direction].push({
              frame,
              offsetX,
              offsetY,
            });
            this.lastFrame = frame;
          }
        }
      }
    }
    this.updateToolImage();
  }

  enter() {
    this.loadImage(); // Reload tool offsets when entering MINE state
    if (this.player.direction == "left") this.imageDirection = -1;
    else this.imageDirection = 1;

    for (let x in this.player.keysPressed) {
      this.player.keysPressed[x] = false;
    }
    this.player.running.active = false;
    this.player.frameY =
      this.player.animations[this.player.direction][
        this.player.currentState.state
      ][0].y;
    this.toolActive = true; // Set tool active flag to true
    this.itemsInRange = []; // Reset items in range
    this.player.game.collectibles.trees.orangeTree.forEach((tree) => {
      if (
        tree.posX >= 0 &&
        tree.posX <= this.player.game.width &&
        tree.posY >= 0 &&
        tree.posY <= this.player.game.height
      ) {
        if (
          this.toolActive &&
          this.toolType == "axe" &&
          this.player.attackBox.posX >= tree.posX &&
          this.player.attackBox.posX + this.player.attackBox.width <=
            tree.posX + tree.width &&
          this.player.attackBox.posY >= tree.posY &&
          this.player.attackBox.posY + this.player.attackBox.height <=
            tree.posY + tree.height
        ) {
          // Check if the tool is active and the player is in range of the tree
          this.itemsInRange.push(tree); // Add the tree to the items in range
        }
      }
    });
    this.player.game.collectibles.trees.greenTree.forEach((tree) => {
      if (
        tree.posX >= 0 &&
        tree.posX <= this.player.game.width &&
        tree.posY >= 0 &&
        tree.posY <= this.player.game.height
      ) {
        if (
          this.toolActive &&
          this.toolType == "axe" &&
          this.player.attackBox.posX >= tree.posX &&
          this.player.attackBox.posX + this.player.attackBox.width <=
            tree.posX + tree.width &&
          this.player.attackBox.posY >= tree.posY &&
          this.player.attackBox.posY + this.player.attackBox.height <=
            tree.posY + tree.height
        ) {
          // Check if the tool is active and the player is in range of the tree
          this.itemsInRange.push(tree); // Add the tree to the items in range
        }
      }
    });
    this.player.game.collectibles.rocks.stone.forEach((rock) => {
      if (
        rock.posX >= 0 &&
        rock.posX <= this.player.game.width &&
        rock.posY >= 0 &&
        rock.posY <= this.player.game.height
      ) {
        if (
          this.toolActive &&
          this.toolType == "axe" &&
          this.player.attackBox.posX >= rock.posX &&
          this.player.attackBox.posX + this.player.attackBox.width <=
            rock.posX + rock.width &&
          this.player.attackBox.posY >= rock.posY &&
          this.player.attackBox.posY + this.player.attackBox.height <=
            rock.posY + rock.height
        ) {
          // Check if the tool is active and the player is in range of the rock
          this.itemsInRange.push(rock); // Add the rock to the items in range
        }
      }
    });
  }

  handleInput(input) {
    if (input === "click") {
      if (this.player.position == 4) {
        this.player.isAttacking = false;
        this.player.game.input.click = false;
      }
      this.player.setState(states.MINE);
    } else {
      this.toolActive = false; // Set tool active flag to false
      this.player.running.active = false;
      this.player.setState(states.IDLE);
      this.player.currentState.state =
        this.player.currentState.state.toLowerCase();
    }
  }

  updateToolImage() {
    // Set correct tool image based on direction
    if (
      this.player.direction === "up" ||
      this.player.direction === "down" ||
      this.player.direction === "right"
    ) {
      this.toolImg.src = "./images/characters/axe-right.png";
    } else {
      this.toolImg.src = "./images/characters/axe-left.png";
    }
    if (this.player.direction != "left") {
      this.imageDirection = 1;
    } else {
      this.imageDirection = -1;
    }
    if (this.player.direction === "up" || this.player.direction === "right") {
      this.toolCorectionDirectionPos = -1;
    } else {
      this.toolCorectionDirectionPos = 1;
    }
  }
}

export class Attack extends State {
  constructor(player) {
    super("ATTACK");
    this.player = player;
  }
  enter() {
    this.player.frameY =
      this.player.animations[this.player.direction][
        this.player.currentState.state
      ][0].y;
  }
  handleInput(input) {
    if (input) {
      console.log("Attack");

      this.player.setState(states.ATTACK);
    }
  }
}
//Object states
export class objectIdle extends State {
  constructor(object) {
    super("OBJECTIDLE");
    this.object = object;
  }
  enter() {
    if (this.object.game.collectibles.windDirection == "right") {
      this.object.frameY = 1 * this.object.spriteHeight;
    } else if (this.object.game.collectibles.windDirection == "left") {
      this.object.frameY = 0 * this.object.spriteHeight;
    } else {
      this.object.frameY = 2 * this.object.spriteHeight;
    }
    this.object.position =
      (Math.floor(this.object.gameFrames / this.object.staggerFrames) % 5) + 2;
    this.object.frameX = this.object.position * this.object.spriteWidth;
    if (this.object.position <= 1 && this.object.position >= 4)
      this.object.gameFrames++;
    else this.object.gameFrames += 0.5;
    if (this.object.position >= this.object.totalFrames) this.object.frameX = 0;
  }
  handleInput(input = null) {
    if (input && this.object.health > 0) {
      this.object.currentState.state =
        this.object.currentState.state.toLowerCase();
      this.object.setState(coolectibleStates.ALIVE);
    } else if (input && this.object.health <= 0) {
      this.object.currentState.state =
        this.object.currentState.state.toLowerCase();
      this.object.setState(coolectibleStates.DEAD);
    } else {
      this.object.currentState.state =
        this.object.currentState.state.toLowerCase();
      this.object.setState(coolectibleStates.OBJECTIDLE);
    }
  }
}
export class Alive extends State {
  constructor(object) {
    super("ALIVE");
    this.object = object;
  }
  enter() {
    this.object.health -= this.object.damageTaken;
    this.gameFrames = 0;
    this.staggerFrames = 15;
    this.position = 0;
    this.object.frameX = 0;
    this.object.frameY = 2 * this.object.spriteHeight;
    console.log(this.object.health);
  }
  handleInput(input = null) {
    if (input && this.object.health <= 0) {
      this.object.currentState.state =
        this.object.currentState.state.toLowerCase();
      this.object.setState(coolectibleStates.DEAD);
    } else if (!input && this.object.health > 0) {
      this.object.currentState.state =
        this.object.currentState.state.toLowerCase();
      this.object.setState(coolectibleStates.OBJECTIDLE);
    }
  }
}
export class Dead extends State {
  constructor(object) {
    super("DEAD");
    this.object = object;
  }
  enter() {
    this.object.frameY = 3 * this.object.spriteHeight;
    this.object.posY += 2 * this.object.game.map.tileSize;

    this.object.game.map.collisionsMap[this.object.relPosY / 32][
      this.object.relPosX / 32
    ] = 0; // Remove the object from the collision map
    this.object.game.map.boundaries.splice();
    this.object.game.map.collisionsMap[this.object.relPosY / 32][
      this.object.relPosX / 32 + 1
    ] = 0;
    this.object.game.map.collisionsMap[this.object.relPosY / 32][
      this.object.relPosX / 32 + 2
    ] = 0;
    this.object.game.map.collisionsMap[this.object.relPosY / 32 + 1][
      this.object.relPosX / 32
    ] = 0; // Remove the object from the collision map
    this.object.game.map.collisionsMap[this.object.relPosY / 32 + 1][
      this.object.relPosX / 32 + 1
    ] = 0;
    this.object.game.map.collisionsMap[this.object.relPosY / 32 + 1][
      this.object.relPosX / 32 + 2
    ] = 0;
    this.object.game.map.collisionsMap[this.object.relPosY / 32 + 2][
      this.object.relPosX / 32
    ] = 0; // Remove the object from the collision map
    this.object.game.map.collisionsMap[this.object.relPosY / 32 + 2][
      this.object.relPosX / 32 + 2
    ] = 0;
    function removeObjectAt(
      relPosX,
      relPosY,
      widthInTiles = 3,
      heightInTiles = 3
    ) {
      const tileX = Math.floor(relPosX / this.tileSize);
      const tileY = Math.floor(relPosY / this.tileSize);

      for (let y = 0; y < heightInTiles; y++) {
        for (let x = 0; x < widthInTiles; x++) {
          const mapY = tileY + y;
          const mapX = tileX + x;

          // Remove from collisions map
          if (
            this.collisionsMap[mapY] &&
            typeof this.collisionsMap[mapY][mapX] !== "undefined"
          ) {
            this.collisionsMap[mapY][mapX] = 0;
          }

          // Remove from boundaries
          const boundaryIndex = this.boundaries.findIndex(
            (b) =>
              b.position.x === mapX * this.tileSize &&
              b.position.y === mapY * this.tileSize
          );
          if (boundaryIndex !== -1) {
            this.boundaries.splice(boundaryIndex, 1);
          }

          // Remove from movables (if you have such an array)
          if (this.movables) {
            const movableIndex = this.movables.findIndex(
              (m) =>
                m.position.x === mapX * this.tileSize &&
                m.position.y === mapY * this.tileSize
            );
            if (movableIndex !== -1) {
              this.movables.splice(movableIndex, 1);
            }
          }
        }
      }
    }
  }
  handleInput(input = null) {
    console.log("dead");
  }
}
