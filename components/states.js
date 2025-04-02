import { toDataURL } from "./utils.js";
const states = {
  IDLE: 0,
  WALK: 1,
  RUN: 2,
  MINE: 3,
  ATTACK: 4,
};

class State {
  constructor(state) {
    this.state = state;
  }
}

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
    this.toolImg.src = "./images/characters/stick.png";
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
            if (this.player.direction === "down") offsetX = x + 13;
            if (
              this.player.direction === "left" ||
              this.player.direction === "right"
            )
              switch (frame) {
                case 0:
                  offsetX = 18;
                  break;
                case 1:
                  offsetX = 27;
                  break;
                case 2:
                  offsetX = 31;
                case 3:
                  offsetX = 33;
                  break;
                case 4:
                  offsetX = 17;
                  break;
              }
            if (this.player.direction === "up")
              switch (frame) {
                case 0:
                  offsetX = 15;
                  break;
                case 1:
                  offsetX = 20;
                  break;
                case 2:
                  offsetX = 23;
                  break;
                case 3:
                  offsetX = 29;
                  break;
                case 4:
                  console.log("frame 4");
                  offsetX = 15;
                  break;
              }
            // console.log(frame);

            let offsetY = y;
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
    if (this.player.direction == "left") this.imageDirection = 0;
    else this.imageDirection = 1;
    console.log(this.imageDirection);
    for (let x in this.player.keysPressed) {
      this.player.keysPressed[x] = false;
    }
    this.player.running.active = false;
    this.player.frameY =
      this.player.animations[this.player.direction][
        this.player.currentState.state
      ][0].y;
  }

  handleInput(input) {
    if (input === "click") {
      if (this.player.position == 4) {
        this.player.isAttacking = false;
        this.player.game.input.click = false;
      }
      this.player.setState(states.MINE);
    } else {
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
      this.toolImg.src = "./images/characters/stick.png";
    } else {
      this.toolImg.src = "./images/characters/stick.png";
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
