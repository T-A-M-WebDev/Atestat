import { Player } from "./player.js";
export const states = {
  PATROL: 0,
  CHASE: 1,
  ATTACK: 2,
  EVADE: 3,
  DEAD: 4,
};
export const actions = {
  IDLE: "idle",
  RUN: "run",
  ATTACK: "attack",
  DEAD: "death",
};
class State {
  constructor(state) {
    this.stateName = state;
  }
}
export class Patrol extends State {
  constructor(enemy) {
    super("PATROL");
    this.enemy = enemy;
    this.lastTargetTime = 0;
    this.changeInterval = 2000; // milliseconds
    this.targetPos = { x: enemy.relPosX, y: enemy.relPosY };
  }

  enter() {
    this.enemy.currentAction = actions.RUN;
  }

  handleInput(input) {
    // Check for death
    if (this.enemy.health <= 0) {
      this.enemy.isDead = true;
      this.enemy.setNewAnimation();

      this.enemy.setState(states.DEAD);
      return;
    }

    // Check for player in LOS
    const distanceToPlayer = this.getDistanceToPlayer();
    this.enemy.LOS.obstructed = distanceToPlayer > this.enemy.LOS.range * 32;

    if (!this.enemy.LOS.obstructed) {
      this.enemy.setNewAnimation();
      this.enemy.setState(states.CHASE);
      return;
    }

    // Change patrol target every interval
    const now = this.enemy.game.time.timestamp;
    if (now - this.lastTargetTime > this.changeInterval) {
      this.targetPos = this.getRandomWalkableTile();
      this.lastTargetTime = now;
    }

    // Move to current patrol target
    this.moveTo(this.targetPos.x, this.targetPos.y);
  }

  moveTo(x, y) {
    const dx = x - this.enemy.relPosX;
    const dy = y - this.enemy.relPosY;

    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
      this.enemy.currentAction = actions.IDLE;
      return;
    }

    const distance = Math.sqrt(dx * dx + dy * dy);
    const normX = dx / distance;
    const normY = dy / distance;

    this.enemy.relPosX += normX * this.enemy.speed;
    this.enemy.relPosY += normY * this.enemy.speed;

    this.updateDirection(dx, dy);
    this.enemy.currentAction = actions.RUN;
  }

  updateDirection(dx, dy) {
    if (Math.abs(dx) > Math.abs(dy)) {
      this.enemy.direction = dx > 0 ? "right" : "left";
    } else {
      this.enemy.direction = dy > 0 ? "down" : "up";
    }
  }

  getDistanceToPlayer() {
    const dx = this.enemy.LOS.endX - this.enemy.LOS.startX;
    const dy = this.enemy.LOS.endY - this.enemy.LOS.startY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  getRandomWalkableTile() {
    const tiles = this.checkForCollisions(
      this.enemy.relPosX,
      this.enemy.relPosY,
      5
    );
    const walkable = tiles.filter((t) => t.value === 0);

    if (walkable.length > 0) {
      const tile = walkable[Math.floor(Math.random() * walkable.length)];
      return { x: tile.y * 32, y: tile.x * 32 };
    }
    return { x: this.enemy.relPosX, y: this.enemy.relPosY };
  }

  checkForCollisions(x, y, range = 6) {
    const tileSize = 32;
    const xTile = Math.floor(x / tileSize);
    const yTile = Math.floor(y / tileSize);
    const map = this.enemy.game.map.collisionsMap;
    const result = [];

    for (let dy = -range; dy <= range; dy++) {
      for (let dx = -range; dx <= range; dx++) {
        const checkX = xTile + dx;
        const checkY = yTile + dy;
        const tileValue = map[checkY]?.[checkX] ?? 391; // 391 = non-walkable fallback
        result.push({ x: checkY, y: checkX, value: tileValue });
      }
    }
    return result;
  }
}

export class Chase extends State {
  constructor(enemy) {
    super("CHASE");
    this.enemy = enemy;
  }

  enter() {
    this.enemy.currentAction = actions.RUN;
  }

  handleInput(input) {
    if (this.enemy.health <= 0) {
      this.enemy.isDead = true;
      this.enemy.setNewAnimation();
      this.enemy.setState(states.DEAD);
      return;
    }

    const target = this.enemy.target;
    const dx = target.relPosX - this.enemy.relPosX;
    const dy = target.relPosY - this.enemy.relPosY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const losDistance = this.getLOS();
    this.enemy.LOS.obstructed = losDistance > this.enemy.LOS.range * 32;

    if (this.enemy.LOS.obstructed) {
      this.enemy.setNewAnimation();
      this.enemy.setState(states.PATROL);
      return;
    }

    const now = Date.now();
    if (
      distance <= this.enemy.attackRange &&
      now - this.enemy.lastAttackTime > this.enemy.attackCooldown
    ) {
      this.enemy.lastAttackTime = now;
      this.enemy.setNewAnimation();
      this.enemy.setState(states.ATTACK);
      return;
    }

    this.moveToPlayer(dx, dy, distance);
  }

  moveToPlayer(dx, dy, distance) {
    const normX = dx / distance;
    const normY = dy / distance;

    this.enemy.relPosX += normX * this.enemy.speed;
    this.enemy.relPosY += normY * this.enemy.speed;

    this.updateDirection(dx, dy);
    this.enemy.currentAction = actions.RUN;
  }

  updateDirection(dx, dy) {
    if (Math.abs(dx) > Math.abs(dy)) {
      this.enemy.direction = dx > 0 ? "right" : "left";
    } else {
      this.enemy.direction = dy > 0 ? "down" : "up";
    }
  }

  getLOS() {
    const dx = this.enemy.LOS.endX - this.enemy.LOS.startX;
    const dy = this.enemy.LOS.endY - this.enemy.LOS.startY;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

export class Attack extends State {
  constructor(enemy) {
    super("ATTACK");
    this.enemy = enemy;
  }

  enter() {
    this.enemy.currentAction = actions.ATTACK;
  }

  handleInput(input) {
    const target = this.enemy.target;

    const dx = target.relPosX - this.enemy.relPosX;
    const dy = target.relPosY - this.enemy.relPosY;

    const distance = Math.sqrt(dx * dx + dy * dy);
    if (this.enemy.position != 4) this.enemy.isAttacking = true;
    // If close enough, switch to ATTACK state
    if (
      this.enemy.position == 4 &&
      distance <= this.enemy.attackRange &&
      this.enemy.isAttacking
    ) {
      this.enemy.target.health -= this.enemy.damage;
      this.enemy.isAttacking = false;
      if (!this.enemy.isDead) this.enemy.setState(states.ATTACK);
      else this.enemy.setState(states.DEAD);
      return;
    }
    if (distance > this.enemy.attackRange) {
      // small grace time to avoid flapping
      const now = Date.now();
      if (now - this.enemy.lastAttackTime < this.enemy.attackCooldown / 2) {
        return;
      }
      this.enemy.setState(states.CHASE);
      return;
    }
  }

  updateDirection(dx, dy) {
    if (Math.abs(dx) > Math.abs(dy)) {
      // Moving more horizontally
      if (dx > 0) {
        this.enemy.direction = "right";
      } else {
        this.enemy.direction = "left";
      }
    } else {
      // Moving more vertically
      if (dy > 0) {
        this.enemy.direction = "down";
      } else {
        this.enemy.direction = "up";
      }
    }
  }
  checkTargetColissions(target) {
    let width;
    let height;
    if (target instanceof Player) {
      width = target.playerWidth;
      height = target.playerHeight;
    } else {
      width = target.width;
      height = target.height;
    }
    if (
      this.enemy.posX >= target.posX &&
      this.enemy.posY >= target.posY &&
      target.posX + width <= this.enemy.posX + this.enemy.width &&
      target.posY + height <= this.enemy.posY + this.enemy.height
    )
      return true;
    return false;
  }
}

export class Evade extends State {
  constructor(enemy) {
    super("EVADE");
    this.enemy = enemy;
  }
  enter() {}
  handleInput() {}
}
export class Dead extends State {
  constructor(enemy) {
    super("DEAD");
    this.enemy = enemy;
    this.animationComplete = false;
  }

  enter() {
    this.enemy.currentAction = actions.DEAD;
  }

  handleInput() {
    const frames =
      this.enemy.animations[this.enemy.direction][this.enemy.currentAction];
    const lastFrame = frames.length - 1;

    if (this.enemy.position >= lastFrame) {
      this.animationComplete = true;

      this.enemy.frameX = frames[lastFrame].x;
      this.enemy.frameY = frames[lastFrame].y;
      this.enemy.position = lastFrame;

      if (this.enemy.isDead) {
        setTimeout(() => {
          const index = this.enemy.game.enemyGenerator.enemies.indexOf(
            this.enemy
          );
          if (index > -1) {
            this.enemy.game.enemyGenerator.enemies.splice(index, 1);
          }
        }, 10000);
      }

      return;
    }

    // Allow animation to keep progressing toward the final frame
    this.enemy.setState(states.DEAD);
  }
}
