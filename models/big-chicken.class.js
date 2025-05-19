class BigChicken extends MovableObject {
  y = 340;
  height = 90;
  width = 70;
  energy = 1;

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGE_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.x = 600 + Math.random() * 900;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGE_DEAD);
    this.speed = 0.15 + Math.random() * 0.7;
    this.deathSoundPlayed = false;
    this.isMuted = localStorage.getItem("isMuted") === "true";
    this.animate();
  }

  /**
   * Starts the animations of the chicken (movement and image switching).
   */
    animate() {
      setInterval(() => {
        if (!this.isDead()) {
          this.moveLeft();
        }
      }, 1000 / 60);

      setInterval(() => {
        if (this.isDead()) {
          this.playDeadAnimation(this.IMAGE_DEAD);
        } else {
          this.playAnimation(this.IMAGES_WALKING);
        }
      }, 100);
    }

  /**
   * Plays the death animation with adjusted y-position.
   */
    playDeadAnimation() {
      if (!this.deathSoundPlayed) {
        world.soundManager.playSound('chicken-dead', this.isMuted);
        this.deathSoundPlayed = true;
      }
      this.playAnimation(this.IMAGE_DEAD);
      this.y = 380;
      this.height = 65;
  }

  /**
    * Toggled the sound for chicken.
    */
    toggleMute() {
      this.isMuted = !this.isMuted;
    }
}
