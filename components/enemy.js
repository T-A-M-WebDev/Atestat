import {
  states,
  actions,
  Patrol,
  Chase,
  Attack,
  Evade,
  Dead,
} from "./enemy states.js";
import { Player } from "./player.js";
export class Enemy {
  constructor(game, ctx, src, relPosX, relPosY) {
    this.game = game;
    this.ctx = ctx;
    this.img = new Image();
    this.img.src = src;
    this.relPosX = relPosX;
    this.relPosY = relPosY;
    this.frameX = 0;
    this.frameY = 0;
    this.gameFrames = 0;
    this.staggerFrames = this.game.player.staggerFrames;
    this.position = 0;
    this.direction = "down";
    this.currentState = new Patrol(this);
    this.currentAction = actions.IDLE;
    this.states = [];
    this.posX = this.relPosX - this.game.map.relPosX;
    this.posY = this.relPosY - this.game.map.relPosY;
  }
}
export class Skeleton extends Enemy {
  constructor(game, ctx, src, relPosX, relPosY) {
    super(game, ctx, src, relPosX, relPosY);
    this.type = "skeleton";
    this.health = 80;
    this.spriteWidth = 67;
    this.spriteHeight = 52;
    this.width = 67 * 1.5;
    this.height = 52 * 1.5;
    this.possibleDirection = ["down", "right", "left", "up"];
    this.states = [
      new Patrol(this),
      new Chase(this),
      new Attack(this),
      new Evade(this),
      new Dead(this),
    ];
    this.target = this.game.player;
    this.attackRange = 32;
    this.damage = 40;
    this.isAttacking = false;
    this.lastAttackTime = 0;
    this.attackCooldown = 1000; // ms

    this.isDead = false;
    this.currentState = this.states[states.PATROL];
    this.animations = {
      down: {
        idle: [],
        run: [],
        attack: [],
        death: [],
      },
      right: {
        idle: [],
        run: [],
        attack: [],
        death: [],
      },
      left: {
        idle: [],
        run: [],
        attack: [],
        death: [],
      },
      up: {
        idle: [],
        run: [],
        attack: [],
        death: [],
      },
    };
    this.animationStates = [
      {
        name: "idle",
        frames: 4,
      },
      {
        name: "run",
        frames: 6,
      },
      {
        name: "attack",
        frames: 5,
      },
      {
        name: "death",
        frames: 9,
      },
    ];
    let x = 0;
    let y = 0;
    this.animationStates.forEach((state) => {
      for (let i = 0; i < this.possibleDirection.length; i++) {
        for (let j = 0; j < state.frames; j++) {
          this.animations[this.possibleDirection[i]][state.name].push({
            x: x,
            y: y,
          });
          x += this.spriteWidth;
          if (x == this.spriteWidth * 9) {
            x = 0;
            y += this.spriteHeight;
          }
        }
      }
    });
    this.moveInterval = 3000;
    this.speed = 1;
    this.lastMoveTime = 0;
    this.LOS = {
      range: 6,
      obstructed: false,
      draw: (x, y, endX, endY) => {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = 5;
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        this.ctx.restore();
      },
    };

    this.LOS.startX = this.posX + this.width / 2;
    this.LOS.startY = this.posY + this.height / 2;
    this.LOS.endX = this.LOS.startX + this.LOS.range * this.game.map.tileSize;
    this.LOS.endY = this.LOS.startY + this.LOS.range * this.game.map.tileSize;
    this.entitiesWithinRange = [];
  }

  draw() {
    if (
      this.currentAction !== actions.DEAD ||
      !this.currentState.animationComplete
    ) {
      this.position =
        Math.floor(this.gameFrames / this.staggerFrames) %
        this.animations[this.direction][this.currentAction].length;

      this.frameX =
        this.animations[this.direction][this.currentAction][this.position].x;
      this.frameY =
        this.animations[this.direction][this.currentAction][this.position].y;

      this.gameFrames++;
    }
    // this.game.drawRect(this.posX, this.posY, this.width, this.height, "red");
    this.ctx.drawImage(
      this.img,
      this.frameX,
      this.frameY,
      this.spriteWidth,
      this.spriteHeight,
      this.posX,
      this.posY,
      this.width,
      this.height
    );
    /* if (!this.LOS.obstructed)
       this.LOS.draw(
        this.LOS.startX,
        this.LOS.startY,
        this.LOS.endX,
        this.LOS.endY
      ); */
  }

  update(input = [], click = false) {
    this.speed = this.game.player.speed * 1.1;
    this.posX = this.relPosX - this.game.map.relPosX;
    this.posY = this.relPosY - this.game.map.relPosY;
    this.entitiesWithinRange.push(this.game.player);
    //LOS
    this.LOS.startX = this.posX + this.width / 2;
    this.LOS.startY = this.posY + this.height / 2;
    let width =
      this.entitiesWithinRange[0] instanceof Player
        ? this.game.player.playerWidth
        : this.entitiesWithinRange[0].width;
    let height =
      this.entitiesWithinRange[0] instanceof Player
        ? this.game.player.playerHeight
        : this.entitiesWithinRange[0].height;
    this.LOS.endX = this.game.player.posX + width / 2;
    this.LOS.endY = this.game.player.posY + height / 2;

    let data = input.length === 0 ? null : input; //no keys pressed - state idle or keys
    if (click) data = "click";
    this.currentState.handleInput(this.game.input);
  }
  setState(state) {
    this.currentState = this.states[state];
    this.currentState.stateName = this.currentState.stateName.toLowerCase();
    this.currentState.enter();
  }
  setNewAnimation() {
    this.position = 0;
    this.gameFrames = 0;
  }
}
