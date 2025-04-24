import { getRandomNumber } from "./utils.js";

export class sceneryObject {
  constructor(game, ctx, relPosX, relPosY, spriteWidth, spriteHeight, images) {
    this.game = game;
    this.ctx = ctx;
    this.relPosX = relPosX;
    this.relPosY = relPosY - this.game.map.tileSize; // Offset by 1 tile
    this.posX = this.relPosX - this.game.offsetX;
    this.posY = this.relPosY - this.game.offsetY;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.colliding = { val: false, index: -1 };
    this.collidingDirection = "";
    this.previousColliding = false;
    this.swaying = false; // Track sway animation state
    this.img = new Image();
    this.img.src = images;
    this.sound = this.game.sound.families["SFX"]["grass"];
    // Store animation data for each image
    this.animations = {
      swaySpeed: 0.05,
      angle: Math.random() * getRandomNumber(0, 5), // Randomize initial angle
      swayMaxAngle: (60 * Math.PI) / 180, // 60 degrees in radians
      damping: 1, // Initial damping factor, will be updated dynamically
    };
    /**PARTICLE FOR COLLIDING ANIMATION**/
    // Initialize particles
    this.particle = [];
    this.particleCount = 7;
    this.particleColor = ["#228b22", "#008000", "#3cb371", "#3cb371"];
    /*********CODE**********/
    this.createParticles = () => {
      for (let i = 0; i < this.particleCount; i++) {
        let size = getRandomNumber(3, 5); // Randomize particle size
        this.particle.push({
          x: this.posX + this.spriteWidth / 2,
          y: this.posY + this.spriteHeight,
          width: size, // Randomize particle size
          height: size,
          color:
            this.particleColor[
              getRandomNumber(0, this.particleColor.length - 1)
            ], // Randomize color
          velocity: {
            x: (Math.random() - 0.5) * 2, // Horizontal velocity
            y: -Math.random() * 2, // Initial upward velocity
          },
        });
      }
    };
    this.createParticles();
  }

  /**ANIMATIONS**/
  // Update damping factor based on calculated FPS
  updateDamping() {
    this.animations.damping = Math.pow(0.01, 1 / (3 * this.game.time.fps));
  }

  particleSpreadAnimation() {
    if (this.animations.swayMaxAngle < 0.1 && this.previousColliding) {
      this.animations.swayMaxAngle = (60 * Math.PI) / 180;
      return;
    }
    // Update particle positions
    this.particle.forEach((item, i) => {
      item.velocity.y += 0.05; // Reduced gravity effect
      // Apply damping to horizontal velocity
      item.velocity.x *= this.animations.damping;

      // Update position
      item.x += item.velocity.x;

      /* if (this.animations.swayMaxAngle < 0.2) item.y -= item.velocity.y;
      else */ item.y += item.velocity.y;
      // Check if particle is out of bounds
      if (
        item.y >
        this.posY + this.spriteHeight + 10
        //random  numberswhich determinate the bounds
      ) {
        this.particle.splice(i, 1); // Remove particle if out of bounds
      }

      // Draw particle
      this.ctx.beginPath();
      this.ctx.rect(item.x, item.y, item.width, item.height);
      this.ctx.strokeStyle = item.color;
      this.ctx.stroke();
      this.ctx.fillStyle = item.color;
      this.ctx.fill();
      this.ctx.closePath();
    });

    // Apply damping to gradually reduce the sway if the swaying animation is not active
    if (this.swaying) {
      this.animations.swayMaxAngle *= this.animations.damping;
    }
  }

  // Sway animation for this image
  swayAnimation() {
    // Update damping factor based on current FPS
    this.updateDamping();
    // Sway calculation based on sine wave with damping
    let swayAmount =
      Math.sin(this.animations.angle) * this.animations.swayMaxAngle;
    this.ctx.save(); // Save the canvas state before rotating

    // Apply rotation around the bottom center
    this.ctx.translate(
      this.posX + this.spriteWidth / 2,
      this.posY + this.spriteHeight
    );
    this.ctx.rotate(swayAmount);

    // Draw the image centered at (x, y)
    this.ctx.drawImage(
      this.img,
      -this.spriteWidth / 2,
      -this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight
    );

    this.ctx.restore(); // Restore the canvas state to remove rotation

    // Increment the angle to animate the sway for this image
    this.animations.angle += this.animations.swaySpeed;
    // Apply damping to gradually reduce the sway
    this.animations.swayMaxAngle *= this.animations.damping;

    // Check if the sway animation should stop
    if (this.animations.swayMaxAngle < 0.01) {
      this.swaying = false; // Stop the sway animation
      this.animations.angle = 0; // Reset sway angle
      this.animations.swayMaxAngle = (60 * Math.PI) / 180; // Reset sway max angle
      for (let i = 0; i < this.particle.length; i++) {
        this.particle.pop();
      }

      this.createParticles();
    }
  }

  // Draw method to render the image
  draw() {
    this.ctx.save(); // Save the current state
    this.updateDamping();
    // Rotate based on the colliding direction
    if (this.colliding.val) {
      if (!this.game.sound.soundsInQueue.includes(this.sound)) {
        this.game.sound.soundsInQueue.push(this.sound);
      }
      console.log(this.sound.ended);
      this.ctx.save(); // Save the state before rotating
      this.ctx.translate(
        this.posX + this.spriteWidth / 2,
        this.posY + this.spriteHeight
      );

      if (this.collidingDirection === "right") {
        this.ctx.rotate(Math.PI / 9); // Rotate 20 degrees to the right
      } else if (this.collidingDirection === "left") {
        this.ctx.rotate(-Math.PI / 9); // Rotate 20 degrees to the left
      }
      this.ctx.drawImage(
        this.img,
        -this.spriteWidth / 2,
        -this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight
      );
      this.ctx.restore(); // Restore the state
      // Trigger particle spread animation during the first collision
      this.particleSpreadAnimation();
    } else if (this.swaying) {
      // Continue sway animation if active
      this.swayAnimation();
      this.particleSpreadAnimation();
    } else {
      this.animations.swayMaxAngle = (5 * Math.PI) / 180; // Reset sway max angle
      let swayAmount =
        Math.sin(this.animations.angle) * this.animations.swayMaxAngle;

      this.ctx.save(); // Save the canvas state before rotating

      // Apply rotation around the bottom center
      this.ctx.translate(
        this.posX + this.spriteWidth / 2,
        this.posY + this.spriteHeight
      );
      this.ctx.rotate(swayAmount);

      // Draw the image centered at (x, y)
      this.ctx.drawImage(
        this.img,
        -this.spriteWidth / 2,
        -this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight
      );

      this.ctx.restore(); // Restore the canvas state to remove rotation

      // Increment the angle to animate the sway for this image
      this.animations.angle += this.animations.swaySpeed;
      // Apply damping to gradually reduce the sway

      for (let i = 0; i < this.particle.length; i++) {
        this.particle[i].x = this.posX + this.spriteWidth / 2;
        this.particle[i].y = this.posY + this.spriteHeight;
      }
    }

    this.ctx.restore(); // Restore the state

    // Update previous collision state
    if (this.previousColliding && !this.colliding.val) {
      //check if we are no longer colliding
      this.swaying = true; // Start sway animation when leaving collision area
      this.animations.angle = 0; // Reset sway angle
      this.animations.swayMaxAngle = (60 * Math.PI) / 180; // Reset sway max angle
      if (this.game.sound.soundsInQueue.indexOf(this.sound) != -1) {
        this.game.sound.soundsInQueue.splice(
          this.game.sound.soundsInQueue.indexOf(this.sound),
          1
        );
        this.sound.pause();
        this.sound.currentTime = 0;
      }
    }
    this.previousColliding = this.colliding.val;
  }
}

export default sceneryObject;
