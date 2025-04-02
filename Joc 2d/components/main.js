import { Map } from "./map.js";
import { Player } from "./player.js";
import { Base } from "./base.js";
import { Fire } from "./fire.js";
import { Scenery } from "./scenery generator.js";
import { natureCollectibles } from "./nature collectibles.js";
import { InputHandler } from "./input handler.js";
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const tileSize = 32;
canvas.width = tileSize * 20; // 640
canvas.height = tileSize * 15; // 480
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;
/***********IMPORTS************/
/***************GAME****************/
class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.lastFrameTime = 0;
    this.fps = 0;
    this.ctx = ctx;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.offsetX = 2880;
    this.offsetY = 2960;
    this.map = new Map(this, this.ctx);
    this.player = new Player(this, this.ctx);
    this.base = new Base(this, this.ctx);
    this.fire = new Fire(this, this.ctx);
    this.scenery = new Scenery(this, this.ctx);
    this.collectibles = new natureCollectibles(this, this.ctx);
    this.input = new InputHandler(this);
    this.time = {
      lastTime: 0,
      frameDuration: 16.67, // ms for 60fps
      delta: 0,
      timestamp: 0,
      fps: 0,
      frameCount: 0,
      fpsLastTime: performance.now(),
    };
    this.foregroundLayers = [this.base.foreground, this.fire.foreground];
    this.lastLayer = [this.player.running];
    this.moveables = [
      ...this.map.boundaries,
      this.base,
      this.fire,
      ...this.collectibles.trees.greenTree,
      ...this.collectibles.trees.orangeTree,
      ...this.collectibles.rocks.stone,
      ...this.scenery.interactables,
    ];
    /*********FUCNTION UTILITIES***********/
    this.drawRect = (x, y, width, height, color) => {
      this.ctx.beginPath();
      this.ctx.rect(x, y, width, height);
      this.ctx.strokeStyle = color;
      this.ctx.stroke();
      this.ctx.closePath();
    };
  }
  draw() {
    this.map.draw();
    this.moveables.forEach((item, index) => {
      if (index >= this.moveables.length - 1 - 324) return; //interactables on top layer skipping -- always last in array
      item.draw();
    });
    /***PLAYER***/
    this.player.draw();

    this.scenery.interactables.forEach((item, index) => {
      if (index >= 173) {
        item.draw();
      }
    });
    this.foregroundLayers.forEach((item, index) => {
      if (index == 1) {
        item.draw(this.fire.position * this.fire.spriteWidth);
      } else item.draw();
    }); //on top of everything layer
    this.lastLayer.forEach((item) => {
      if (
        item === this.player.running &&
        !this.player.running.active &&
        this.player.running.barOpacity === 0
      ) {
        return;
      } else if (this.player.running.barOpacity > 0) {
        let barPosX =
          this.player.posX - item.barWidth / 2 + this.player.playerWidth / 2; ///running bar
        let barPosY = this.player.posY - this.player.playerHeight / 2;
        item.draw(barPosX, barPosY);
      }
      item.draw();
    });
  }
  update() {
    this.player.update(this.input.lastKeys, this.input.click);
  }

  displayFPS() {
    this.ctx.fillStyle = "white";
    this.ctx.font = "20px Arial";
    this.ctx.fillText(`FPS: ${this.time.fps}`, 10, 30);
  }
}
const game = new Game(canvas, context);
/***************GAME-ANIMATIONS/FUNCTIONALITY****************/
function animate(timestamp) {
  game.time.timestamp = timestamp;
  if (!game.time.lastTime) game.time.lastTime = game.time.timestamp;
  game.time.delta = game.time.timestamp - game.time.lastTime;
  game.time.lastTime = game.time.timestamp;
  //fps count
  game.time.frameCount++;
  if (game.time.timestamp - game.time.fpsLastTime >= 1000) {
    // Every 1 second
    game.time.fps = game.time.frameCount;
    game.time.frameCount = 0;
    game.time.fpsLastTime = game.time.timestamp;
  }
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  if (game.player.keysPressed.w == true) {
    game.player.posY -= game.player.speed;
    game.player.relPosY -= game.player.speed;
    if (game.player.relPosY <= 0) game.player.relPosY = 0;

    /***COL***/
    for (let i = 0; i < game.map.boundaries.length; i++) {
      const boundary = game.map.boundaries[i];
      if (
        game.player.relPosX + game.player.playerWidth >= boundary.relPosX && //d side
        game.player.relPosX <= boundary.relPosX + boundary.width && //a side
        game.player.relPosY + game.player.playerHeight >= boundary.relPosY && //s side
        game.player.relPosY <= boundary.relPosY + boundary.height
      ) {
        //w side
        game.player.posY += game.player.speed;
        game.player.relPosY += game.player.speed;
        break;
      }
    }
  }
  if (game.player.keysPressed.s == true) {
    game.player.posY += game.player.speed;
    game.player.relPosY += game.player.speed;
    if (game.player.relPosY <= 0) game.player.relPosY = 0;

    /***COL***/
    for (let i = 0; i < game.map.boundaries.length; i++) {
      const boundary = game.map.boundaries[i];

      if (
        game.player.relPosX + game.player.playerWidth >= boundary.relPosX && //d side
        game.player.relPosX <= boundary.relPosX + boundary.width && //a side
        game.player.relPosY + game.player.playerHeight >= boundary.relPosY && //s side
        game.player.relPosY <= boundary.relPosY + boundary.height
      ) {
        //s side
        game.player.posY -= game.player.speed;
        game.player.relPosY -= game.player.speed;
        break;
      }
    }
  }
  if (game.player.keysPressed.a == true) {
    game.player.posX -= game.player.speed;
    game.player.relPosX -= game.player.speed;
    if (game.player.relPosX <= 0) game.player.relPosX = 0;

    /***COL***/
    for (let i = 0; i < game.map.boundaries.length; i++) {
      const boundary = game.map.boundaries[i];
      if (
        game.player.relPosX + game.player.playerWidth >= boundary.relPosX && //d side
        game.player.relPosX <= boundary.relPosX + boundary.width && //a side
        game.player.relPosY + game.player.playerHeight >= boundary.relPosY && //s side
        game.player.relPosY <= boundary.relPosY + boundary.height
      ) {
        //a side
        game.player.posX += game.player.speed;
        game.player.relPosX += game.player.speed;
        break;
      }
    }
  }
  if (game.player.keysPressed.d == true) {
    game.player.posX += game.player.speed;
    game.player.relPosX += game.player.speed;
    if (game.player.relPosX <= 0) game.player.relPosX = 0;

    /***COL***/
    for (let i = 0; i < game.map.boundaries.length; i++) {
      const boundary = game.map.boundaries[i];
      if (
        game.player.relPosX + game.player.playerWidth >= boundary.relPosX && //d side
        game.player.relPosX <= boundary.relPosX + boundary.width && //a side
        game.player.relPosY + game.player.playerHeight >= boundary.relPosY && //s side
        game.player.relPosY <= boundary.relPosY + boundary.height
      ) {
        //d side

        game.player.posX -= game.player.speed;
        game.player.relPosX -= game.player.speed;

        break;
      }
    }
  }
  /*INTERACT*/

  for (let i = 0; i < game.scenery.interactables.length; i++) {
    const item = game.scenery.interactables[i];

    if (
      game.player.relPosX + 8 + game.player.hitbox.width >= item.relPosX && //d side  //IMPROVEMENT -- hitbox collision logic
      game.player.relPosX + 8 <= item.relPosX + item.spriteWidth && //a side
      game.player.relPosY + 10 + game.player.playerHeight >=
        item.relPosY + item.spriteHeight / 2 && //s side --the hitbox of the item should be somewhere around the bottom half of the item adn the interact relposY with 10px off
      game.player.relPosY <= item.relPosY + item.spriteHeight
    ) {
      item.previousColliding = true;

      if (
        game.player.relPosX + game.player.playerWidth / 2 <=
        item.relPosX + item.spriteWidth / 2
      ) {
        /*         console.log("COLLIDING", "right", i); */
        item.colliding.val = true;
        item.colliding.index = i;
        item.collidingDirection = "right";
      } else {
        /*         console.log("COLLIDING", "left", i); */
        item.colliding.val = true;
        item.colliding.index = i;
        item.collidingDirection = "left";
      }
    } else {
      item.colliding.val = false;
      item.colliding.index = -1;
      item.collidingDirection = "";
    }
    if (item.previousColliding && !item.colliding.val) {
      item.colliding.index = i;
      item.collidingDirection = "";
      item.colliding.val = false;
      item.previousColliding = true;
    }
  }
  game.update();
  game.draw();
  game.displayFPS();

  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

/***************MOUSE-CONTROLS****************/
/***************MOUSE-CONTROLS****************/
/* let holdTimeout;
let isHolding = false;

window.addEventListener("mousedown", (e) => {
  if (!game.player.isAttacking) {
    game.player.isAttacking = true;
    isHolding = true;

    game.player.update();
    holdTimeout = setTimeout(() => {
      if (isHolding) {
        console.log("hold action");

        // Perform the hold action here
      }
    }, 500); // Adjust the hold duration as needed
  }
});

window.addEventListener("mouseup", (e) => {
  clearTimeout(holdTimeout);
  if (game.player.isAttacking) {
    game.player.isAttacking = false;
    isHolding = false;
  }
});

window.addEventListener("mouseleave", (e) => {
  clearTimeout(holdTimeout);
  if (game.player.isAttacking) {
    game.player.isAttacking = false;
    isHolding = false;
  }
});

window.addEventListener("click", (e) => {
  if (!game.player.isAttacking) {
    game.player.isAttacking = true;

    setTimeout(() => {
      if (game.player.isAttacking) game.player.isAttacking = false;
    }, 1400); // Adjust the cooldown duration as needed
  }
}); */
