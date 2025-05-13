import { states } from "./states.js";
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
          case "1":
            this.game.player.states[states.MINE].toolType = "pickaxe";
            this.setToolType("pickaxe");
            break;
          case "2":
            this.game.player.states[states.MINE].toolType = "axe";
            this.setToolType("axe");
            break;
          case "3":
            this.game.player.states[states.MINE].toolType = "sword";
            this.setToolType("sword");
            break;
        }
      }
    });
    window.addEventListener("keyup", (e) => {
      this.lastKeys.splice(this.lastKeys.indexOf(e.key), 1);
    });
    document
      .querySelectorAll(".tools-container .tools .tool")
      .forEach((element) => {
        element.addEventListener("click", () => {
          // Remove the "active" class from all sibling elements
          element.parentNode.querySelectorAll(".tool").forEach((sibling) => {
            sibling.classList.remove("active");
          });

          // Add the "active" class to the clicked element
          element.classList.add("active");

          // Update the tool type in the player's state
          this.game.player.states[states.MINE].toolType = element.id;
        });
      });

    window.addEventListener("mousedown", (e) => {
      if (!this.game.player.isAttacking) {
        this.game.player.isAttacking = true;
        this.isHolding = true;
        this.click = true;

        // Trigger the initial update
        this.game.player.update([], this.click);

        // Set an interval to handle the "holding" state
        this.holdInterval = setInterval(() => {
          if (this.isHolding) {
            console.log("Holding...");
            this.game.player.isAttacking = true;
            this.isHolding = true;
            this.click = true; // Trigger update while holding
          }
        }, 300); // Repeat every 300ms
      }
    });

    window.addEventListener("mouseup", (e) => {
      // Clear the hold interval and reset states
      clearInterval(this.holdInterval);
      if (this.game.player.isAttacking) {
        this.game.player.isAttacking = false;
        this.isHolding = false;
        this.click = false;
      }
    });

    window.addEventListener("mouseleave", (e) => {
      // Clear the hold interval and reset states
      clearInterval(this.holdInterval);
      if (this.game.player.isAttacking) {
        this.game.player.isAttacking = false;
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
  setToolType(tool) {
    document
      .querySelectorAll(".tools-container .tools .tool")
      .forEach((element) => {
        element.classList.toggle("active", element.id === tool);
      });
  }
}
