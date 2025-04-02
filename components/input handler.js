export class InputHandler {
  constructor(game) {
    this.game = game;
    this.lastKeys = [];
    this.click = false;
    this.holdTimeout;
    this.isHolding = false;
    window.addEventListener("keydown", (e) => {
      if (!this.lastKeys.includes(e.key)) {
        switch (e.key) {
          case "w":
          case "a":
          case "s":
          case "d":
          case "Shift":
            if (this.lastKeys.length == 3 && this.lastKeys.includes("Shift")) {
              break;
            }
            this.lastKeys.push(e.key);
            break;
        }
      }

      // console.log("keydown", this.lastKeys);
    });

    window.addEventListener("keyup", (e) => {
      this.lastKeys.splice(this.lastKeys.indexOf(e.key), 1);
      //  console.log("keyup", this.lastKeys);
    });

    window.addEventListener("mousedown", (e) => {
      if (!game.player.isAttacking) {
        game.player.isAttacking = true;
        this.isHolding = true;
        this.click = true;
        game.player.update([], this.click); // Pass the correct click value
        this.holdTimeout = setTimeout(() => {
          if (this.isHolding) {
            console.log("hold action");
          }
        }, 500);
      }
    });

    window.addEventListener("mouseup", (e) => {
      clearTimeout(this.holdTimeout);
      if (game.player.isAttacking) {
        game.player.isAttacking = false;
        this.isHolding = false;
        this.click = false;
      }
    });

    window.addEventListener("mouseleave", (e) => {
      clearTimeout(this.holdTimeout);
      if (game.player.isAttacking) {
        game.player.isAttacking = false;
        this.isHolding = false;
        this.click = false;
      }
    });

    window.addEventListener("click", (e) => {
      if (!game.player.isAttacking) {
        game.player.isAttacking = true;
        this.click = true;
        game.player.update([], this.click); // Ensure click is passed
      }
    });
  }
}
