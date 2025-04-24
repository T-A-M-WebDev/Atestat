export class AudioPlayer {
  constructor(game) {
    this.game = game;
    this.baseVolume = 1;
    this.soundsInQueue = [];
    this.families = {
      BG: {
        wind: new Audio("./assets/sounds/wind.mp3"),
        fire: new Audio("./assets/sounds/fire_start.wav"),
      },
      SFX: {
        walk: new Audio("./assets/sounds/grass_walk.wav"),
        run: new Audio("./assets/sounds/grass_run.wav"),
        rock_hit: new Audio("./assets/sounds/rock_hit_3.mp3"),
        wood_hit: new Audio("./assets/sounds/axe_hit_wood.wav"),
        rock_collect: new Audio("./assets/sounds/rock_collect.mp3"),
        wood_collect: new Audio("./assets/sounds/wood_collect.mp3"),
        grass: new Audio("./assets/sounds/grass.mp3"),
      },
      EVENTS: { nightStart: new Audio("./assets/sounds/start_night.mp3") },
    };
    this.families.BG.wind.addEventListener("ended", () => {
      this.families.BG.wind.currentTime = 0;
      this.families.BG.wind.play();
    });

    this.families.BG.fire.addEventListener("ended", () => {
      this.families.BG.fire.currentTime = 0;
      this.families.BG.fire.play();
    });
    this.soundsInQueue.push(
      this.families["BG"]["wind"],
      this.families["BG"]["fire"]
    );
  }
  play() {
    this.setVolumeStandard();
    this.soundsInQueue.forEach((sound) => {
      if (sound.currentTime == 0 || sound.ended) sound.play();
    });
  }
  stop() {
    this.soundsInQueue.forEach((sound) => sound.pause());
    this.soundsInQueue = [];
    this.soundsInQueue.forEach((sound) => (sound.currentTime = 0));
  }
  addSoundArea(posX, posY, family, instance) {
    let sound = this.families[family][instance];

    // Check if the position is within bounds
    if (
      posX >= 0 &&
      posX <= this.game.width &&
      posY >= 0 &&
      posY <= this.game.height
    ) {
      // Add the sound to the queue if it's not already there
      if (!this.soundsInQueue.includes(sound)) {
        this.soundsInQueue.push(sound);
      }
    } else {
      // If out of bounds, remove only the specific sound
      if (this.soundsInQueue.includes(sound)) {
        sound.pause();
        sound.currentTime = 0;
        this.soundsInQueue.splice(this.soundsInQueue.indexOf(sound), 1);
      }
    }
  }

  setVolumeStandard() {
    Object.values(this.families.BG).forEach((item) => {
      item.volume = this.baseVolume * 0.3;
    });
    Object.values(this.families.SFX).forEach((item) => {
      item.volume = this.baseVolume * 0.6;
    });
    Object.values(this.families.EVENTS).forEach((item) => {
      item.volume = this.baseVolume * 0.8;
    });
  }
}
