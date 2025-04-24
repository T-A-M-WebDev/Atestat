import { Idle, Walk, Run, Mine, Attack } from "./states.js";
import { Resources } from "./resources.js";
export class Player {
  constructor(game, ctx) {
    this.game = game;
    this.ctx = ctx;
    this.playerImg = new Image();
    /*****ELEMENTS-SIZES*****/
    this.boxWidth = 400;
    this.boxHeight = 300;
    this.boxPos = {
      x:
        this.game.width - this.boxWidth - (this.game.width - this.boxWidth) / 2,
      y:
        this.game.height -
        this.boxHeight -
        (this.game.height - this.boxHeight) / 2,
    };
    this.boundaryIsSet = true;
    this.spriteWidth = 32;
    this.spriteHeight = 32;
    this.playerWidth = 48;
    this.playerHeight = 48;
    this.relPosX = this.game.map.width / 2 - this.playerWidth / 2;
    this.relPosY = this.game.map.height / 2 - this.playerHeight / 2;
    this.posX = this.game.width / 2 - this.playerWidth / 2;
    this.posY = this.game.height / 2 - this.playerHeight / 2;
    this.hitbox = {
      x: this.posX + 8,
      y: this.posY,
      width: this.spriteWidth,
      height: this.playerHeight,
    };

    this.basicVelocity = 1.5;
    this.biDirectionalPercentageStagger =
      ((Math.sqrt(this.basicVelocity * this.basicVelocity * 2) /
        this.basicVelocity) *
        100 -
        this.basicVelocity * 100) /
      100; //when holding a+w or a+s, the player moves at a staggered speed
    this.twoWayVelocity =
      this.basicVelocity -
      this.basicVelocity * this.biDirectionalPercentageStagger;
    this.speed = this.basicVelocity;
    /*****KEYS*****/
    this.keysPressed = {
      w: false,
      a: false,
      s: false,
      d: false,
      Shift: false,
    };
    /*********ANIMATIONS/MECHANSIM**********/
    this.states = [
      new Idle(this),
      new Walk(this),
      new Run(this),
      new Mine(this),
      new Attack(this),
    ];
    this.currentState = this.states[0];
    this.currentState.state = this.currentState.state.toLowerCase();
    this.frameX = 0;
    this.frameY = 0;
    this.gameFrames = 0;
    this.staggerFrames = 5;
    this.position = 0;
    this.possibleDirection = ["down", "up", "right", "left"];
    this.direction = "down";
    this.lastDirection = "down";
    this.attackBox = new attackBox(
      this.game,
      this.ctx,
      this.posX,
      this.posY + this.playerHeight,
      this.playerWidth,
      this.playerHeight,
      this.direction
    );
    this.isAttacking = false;
    this.resources = new Resources(this.game, this.ctx, 200, 200);
    this.animations = {
      down: {
        idle: [],
        walk: [],
        run: [],
        death: [],
        crossbow: [],
        mine: [],
      },
      up: {
        idle: [],
        walk: [],
        run: [],
        death: [],
        crossbow: [],
        mine: [],
        mine: [],
      },
      right: {
        idle: [],
        walk: [],
        run: [],
        death: [],
        crossbow: [],
        mine: [],
      },
      left: {
        idle: [],
        walk: [],
        run: [],
        death: [],
        crossbow: [],
        mine: [],
      },
    };
    this.animationStates = [
      {
        name: "idle",
        frames: 2,
      },
      {
        name: "walk",
        frames: 4,
      },
      {
        name: "run",
        frames: 4,
      },
      {
        name: "death",
        frames: 4,
      },

      {
        name: "crossbow",
        frames: 6,
      },

      {
        name: "mine",
        frames: 5,
      },
    ];
    this.playerImg.src = "./images/characters/sprite_sheet.png";
    //"./images/characters/sprite_sheet.png"; //Base64 URI

    /**RUNINNG BAR**/
    this.running = {
      barWidth: 100,
      barHeight: 20,
      barColor: "yellow",
      barOpacity: 0,
      progress: 0,
      stamina: 200,
      active: false,
      cooldown: false,
      draw: (barPosX, barPosY) => {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.globalAlpha = this.running.barOpacity / 100;
        this.ctx.rect(
          barPosX,
          barPosY,
          this.running.barWidth + 2,
          this.running.barHeight
        );
        this.ctx.strokeStyle = "black";
        this.ctx.stroke();
        this.ctx.fillStyle = this.running.barColor;
        this.ctx.fillRect(
          barPosX + this.running.barWidth / 2 + 1,
          barPosY + 1, //dimensons for the bar being contained inside black box
          this.running.progress / (this.running.stamina / 100) / 2,
          this.running.barHeight - 2 //dimensons for the bar being contained inside black box
        );
        this.ctx.fillRect(
          barPosX +
            this.running.barWidth / 2 -
            this.running.progress / (this.running.stamina / 100) / 2 +
            1,
          barPosY + 1,
          this.running.progress / (this.running.stamina / 100) / 2,
          this.running.barHeight - 2
        );

        this.ctx.closePath();
        this.ctx.restore();
      },
    };
    /*********CODE**********/

    this.animationStates.forEach((state, index) => {
      if (index >= 2) index--; // same spritesheet row for running animation
      for (let j = 0; j < state.frames; j++) {
        let positionX = j * this.spriteWidth;
        for (let i = 0; i < this.possibleDirection.length; i++) {
          let positionY = i * this.spriteHeight + index * this.spriteHeight * 4; //each 4 directions the animation y changes

          this.animations[this.possibleDirection[i]][state.name].push({
            x: positionX,
            y: positionY,
          });
        }
      }
    });
    this.animationStates.forEach((state, index) => {
      if (state.name == "mine") {
        for (let j = 0; j < state.frames; j++) {
          let positionX = j * this.spriteWidth;
          for (let i = 0; i < this.possibleDirection.length; i++) {
            let positionY =
              i * this.spriteHeight +
              index * this.spriteHeight * 4 +
              this.spriteHeight * 4; //each 4 directions the animation y changes

            this.animations[this.possibleDirection[i]][state.name].push({
              x: positionX,
              y: positionY,
            });
          }
        }
      }
    });
    if (
      this.animations[this.direction][this.currentState.state].length - 1 <=
      3
    )
      this.staggerFrames *= 4;
    else this.staggerFrames = 5;
    this.buildBox = () => {
      this.boxWidth = 400;
      this.boxHeight = 300;
      this.boxPos = {
        x:
          this.game.width -
          this.boxWidth -
          (this.game.width - this.boxWidth) / 2,
        y:
          this.game.height -
          this.boxHeight -
          (this.game.height - this.boxHeight) / 2,
      };
    };
    this.collapseBox = () => {
      this.boxPos.x = 0;
      this.boxPos.y = 0;
      this.boxWidth = this.game.width;
      this.boxHeight = this.game.height;
    };
    this.drawBox = () => {
      this.ctx.beginPath();
      this.ctx.rect(
        this.boxPos.x,
        this.boxPos.y,
        this.boxWidth,
        this.boxHeight
      );
      this.ctx.strokeStyle = "red";
      this.ctx.stroke();
      this.ctx.closePath();
    };
  }
  draw() {
    this.animationEnd = false; //start of drawing
    this.hitbox.x = this.posX + 8;
    this.hitbox.y = this.posY; //hitbox position
    /***BOX-COLLISION***/
    if (this.posX - this.speed < this.boxPos.x) {
      this.posX += this.speed;
      this.game.map.relPosX -= this.speed;
      this.game.moveables.forEach((item) => {
        item.posX += this.speed;
      });
      this.buildBox();
      this.game.foregroundLayers.forEach((item) => {
        item.posX += this.speed;
      });
    }
    if (
      this.posX + this.speed + this.playerWidth >
      this.boxPos.x + this.boxWidth
    ) {
      this.posX -= this.speed;
      this.game.map.relPosX += this.speed;
      this.game.moveables.forEach((item) => {
        item.posX -= this.speed;
      });
      this.buildBox();
      this.game.foregroundLayers.forEach((item) => {
        item.posX -= this.speed;
      });
    }
    if (this.posY - this.speed < this.boxPos.y) {
      this.posY += this.speed;
      this.game.map.relPosY -= this.speed;
      this.game.moveables.forEach((item) => {
        item.posY += this.speed;
      });
      this.buildBox();
      this.game.foregroundLayers.forEach((item) => {
        item.posY += this.speed;
      });
    }
    if (
      this.posY + this.speed + this.playerHeight >
      this.boxPos.y + this.boxHeight
    ) {
      this.posY -= this.speed;
      this.game.map.relPosY += this.speed;
      this.game.moveables.forEach((item) => {
        item.posY -= this.speed;
      });
      this.buildBox();
      this.game.foregroundLayers.forEach((item) => {
        item.posY -= this.speed;
      });
    }
    /***BOX-BREAK + MAP-CONTROL***/
    if (this.game.map.relPosX - this.speed < 0) {
      this.game.map.relPosX += this.speed;
      this.collapseBox();
    }
    if (
      this.game.map.relPosX + this.game.width + this.speed >
      this.game.map.width
    ) {
      this.game.map.relPosX -= this.speed;
      this.collapseBox();
    }
    if (this.game.map.relPosY - this.speed < 0) {
      this.game.map.relPosY += this.speed;
      this.collapseBox();
    }
    if (
      this.game.map.relPosY + this.game.height + this.speed >
      this.game.map.height
    ) {
      this.game.map.relPosY -= this.speed;
      this.collapseBox();
    }
    /***PLAYER-ANIMATIONS***/
    /***************ANIMATION SPEED*************/
    //shift pressed
    if (!this.isAttacking) this.staggerFrames = this.running.active ? 10 : 20;
    this.position =
      Math.floor(this.gameFrames / this.staggerFrames) %
      this.animations[this.direction][this.currentState.state].length;
    this.frameX = this.position * this.spriteWidth;

    this.gameFrames++;
    this.game.time.lastTime = this.game.time.timestamp;
    this.drawBox();
    /*     this.ctx.beginPath();
    this.ctx.rect(this.posX, this.posY, this.playerWidth, this.playerHeight);
    this.ctx.rect(
      this.hitbox.x,
      this.hitbox.y,
      this.hitbox.width,
      this.hitbox.height
    );
    this.ctx.fillStyle = "red";
    this.ctx.strokeStyle = "red";
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.closePath(); */
    if (this.currentState instanceof Mine) this.frameY += this.spriteHeight * 4;

    this.ctx.drawImage(
      this.playerImg,
      this.frameX,
      this.frameY + 1,
      this.spriteWidth,
      this.spriteHeight,
      this.posX,
      this.posY,
      this.playerWidth,
      this.playerHeight
    );

    if (this.currentState instanceof Mine) {
      let toolOffsets = this.currentState.toolPositions[this.direction];

      let toolOffset = toolOffsets.find(
        (offset) => offset.frame === this.position
      );

      if (toolOffset) {
        let toolX = this.posX; // 4px handle width
        let toolY = this.posY;

        this.staggerFrames = 20; // Reset stagger frames for the tool animation

        // Save the context state for transformations
        this.ctx.save();
        // Apply translation for positioning the tool
        if (this.direction == "left")
          this.ctx.translate(
            toolX + toolOffset.offsetX * this.currentState.imageDirection + 50,
            toolY + toolOffset.offsetY + 8
          );
        else
          this.ctx.translate(
            toolX + toolOffset.offsetX * this.currentState.imageDirection - 2,
            toolY + toolOffset.offsetY + 8
          );
        let endSwingMultiplier = this.direction == "up" ? 0.1 : 0.175;

        let swingRotation =
          Math.sin(Math.log(toolOffset.frame + 1) / Math.log(2)) *
            Math.PI *
            (0.25 + toolOffset.frame * endSwingMultiplier) *
            this.currentState.imageDirection +
          0.1 * Math.PI; // Adjust the rotation angle as needed
        this.ctx.rotate(swingRotation);
        // Special case for when direction is "left"
        /*       this.game.drawRect(
          0,
          0,
          123, // values for expecting weapon
          123,
          "yellow"
        ); */
        // Draw the rectangle (for debugging or collision detection)
        /*         this.game.drawRect(
          -this.currentState.toolImg.width / 2 +
            toolOffset.offsetX -
            this.currentState.toolImg.width,
          (-3 * this.currentState.toolImg.height) / 5,
          32, // values for expecting weapon
          32,
          "red"
        ); */
        let offPos;
        // Draw the image of the tool
        if (this.direction == "left")
          offPos = -this.currentState.toolImg.width / 2 - 4;
        else
          offPos =
            -this.currentState.toolImg.width +
            toolOffset.offsetX -
            this.currentState.toolImg.width / 2 -
            4 +
            4;

        this.ctx.drawImage(
          this.currentState.toolImg,
          offPos,
          (-3 * this.currentState.toolImg.height) / 5,
          32, // values for expecting weapon
          32
        );

        // Restore the context to its original state
        this.ctx.restore();
        if (this.direction == "up")
          this.ctx.drawImage(
            this.playerImg,
            this.frameX,
            this.frameY + 1, //cover for pivot points of weapon
            this.spriteWidth,
            this.spriteHeight,
            this.posX,
            this.posY,
            this.playerWidth,
            this.playerHeight
          );
      }
    }
    //running bar
    if (!this.running.active && this.running.progress > 0)
      this.running.progress--;
    if (!this.running.active && this.running.barOpacity > 0) {
      this.running.barOpacity--;
    }
    if (this.running.cooldown && this.running.progress === 0) {
      this.running.cooldown = false;
    }

    //player attack box management
    let posX;
    let posY;
    if (this.direction == "down") {
      posX = this.posX;
      posY = this.posY + this.playerHeight;
      this.attackBox.animationPosDir = 1;
    }
    if (this.direction == "right") {
      posX = this.posX + this.playerWidth;
      posY = this.posY;
      this.attackBox.animationPosDir = -1;
    }

    if (this.direction == "up") {
      posX = this.posX;
      posY = this.posY - this.attackBox.height;
      this.attackBox.animationPosDir = 1;
    }
    if (this.direction == "left") {
      posX = this.posX - this.attackBox.width;
      posY = this.posY;
      this.attackBox.animationPosDir = -1;
    }

    this.attackBox.update(posX, posY);
    if (
      this.currentState.state.toLowerCase() == "mine" &&
      this.attackBox.animationPosDir == 1
    ) {
      this.attackBox.height = 20;
      this.attackBox.width = this.attackBox.baseWidth;
    } else if (
      this.currentState.state.toLowerCase() == "mine" &&
      this.attackBox.animationPosDir == -1
    ) {
      this.attackBox.width = 20;
      this.attackBox.height = this.attackBox.baseHeight;
    }
    if (this.currentState.state.toLowerCase() != "mine") {
      this.attackBox.resetBoxSize();
    }
    if (!this.running.active) this.attackBox.draw();

    if (
      this.frameX ===
      (this.animations[this.direction][this.currentState.state.toLowerCase()]
        .length -
        1) *
        this.spriteWidth
    )
      this.animationEnd = true; //end of drawing
    else this.animationEnd = false;

    this.ctx.beginPath();
    /*     this.ctx.rect(
      this.hitbox.x,
      this.hitbox.y,
      this.hitbox.width,
      this.hitbox.height
    ); */
    this.ctx.fillStyle = "yellow";
    this.ctx.strokeStyle = "yellow";
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.closePath();
    this.game.drawRect(
      this.posX,
      this.posY,
      this.playerWidth,
      this.playerHeight,
      "black"
    );
  }
  update(input = [], click = false) {
    let data = input.length === 0 ? null : input; //no keys pressed - state idle or keys
    if (click) data = "click";

    this.currentState.handleInput(data);

    //checking direction of animation with switch case
    /*  if (this.animationEnd) {
      this.gameFrames = 0;
      this.lastDirection = this.direction;
      switch (true) {
        case this.keysPressed.w:
          this.direction = "up";
          break;
        case this.keysPressed.s:
          this.direction = "down";
          break;
        case this.keysPressed.a:
          this.direction = "left";
          break;
        case this.keysPressed.d:
          this.direction = "right";
          break;
        case this.keysPressed.w && this.keysPressed.a:
          this.direction = "left";
          break;
        case this.keysPressed.w && this.keysPressed.d:
          this.direction = "right";
          break;
        case this.keysPressed.s && this.keysPressed.a:
          this.direction = "down";
          break;
        case this.keysPressed.s && this.keysPressed.d:
          this.direction = "up";
          break;
        default:
          this.direction = this.direction;
      }
    } */
  }
  setState(state) {
    if (this.currentState.state !== this.states[state].state.toLowerCase()) {
      this.frameX = 0;
      this.gameFrames = 0;
    }
    this.currentState = this.states[state];
    this.currentState.state = this.currentState.state.toLowerCase();
    this.currentState.enter();
  }
}
class attackBox {
  constructor(game, ctx, posX, posY, width, height, direction) {
    this.game = game;
    this.ctx = ctx;
    this.posX = posX;
    this.posY = posY;
    this.width = width;
    this.height = height;
    this.baseWidth = width;
    this.baseHeight = height;
    this.direction = direction;
    this.animationPosDir = 1;
  }
  draw() {
    this.game.drawRect(this.posX, this.posY, this.width, this.height, "red");
  }
  update(posX, posY) {
    switch (this.game.player.direction) {
      case "right":
        this.posX = posX + 2;
        this.posY = posY;
        break;
      case "down":
        this.posY = posY + 2;
        this.posX = posX;
        break;
      case "left":
        this.posX = posX - 2;
        this.posY = posY;
        break;
      case "up":
        this.posY = posY - 2;
        this.posX = posX;
        break;
      default:
        this.posX = posX;
        this.posY = posY;
    }
  }
  resetBoxSize() {
    this.width = this.baseWidth;
    this.height = this.baseHeight;
  }
}
