class Endboss extends MovableObject {
  height = 500;
  width = 300;
  y = -40;
  energy = 100;

  IMAGES_WALK = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  constructor() {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_WALK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.acceleration = 0; 
    this.speedY = 0; 
    this.isFalling = false;       
    this.x = 2800;
    this.speed = 0;
    this.stateAlert = true;
    this.returningToStart = false;
    this.deathSound = new Audio('audio/endboss.mp3');
    this.sounds.push(this.deathSound);
    this.isMuted = localStorage.getItem("isMuted") === "true";
    this.deathSound.muted = this.isMuted;
    this.deathSoundPlayed = false;
    this.updateSoundMuteState();
    this.animate();
  }

  /**
   * Starts the animations of the boss based on its state.
   */
  animate() {
    setInterval(() => {
      if (this.isDead()) {
        this.handleDeath();
      } else if (this.isHurt()) {
        this.changeSpeed(20);
        this.stateAlert = false;
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.stateAlert) {
        this.playAnimation(this.IMAGES_ALERT);
      } else {
        this.moveLeft();
        this.playAnimation(this.IMAGES_WALK);
        setTimeout(() => {
          this.playAnimation(this.IMAGES_ATTACK);
        }, 50);
      }
    }, 200);
  }

  /**
   * Handles the death animation with sound effect.
   */
    handleDeath() {
      if (!this.deathSoundPlayed) {
        this.deathSound.play();
        this.deathSoundPlayed = true;
      }
      this.playAnimation(this.IMAGES_DEAD);
      setInterval(() => {
        if (!this.isFalling) {
          this.startFalling();
        }
      }, 500);
    }

  /**
   * Changes the movement speed of the boss.
   */
  changeSpeed(speed) {
    this.speed = speed;
  }

  /**
   * Updates the Mute state of the boss.
   */
  updateSoundMuteState() {
    this.sounds.forEach(sound => sound.muted = this.isMuted);
  }

  /**
   * Makes the object fall downward continuously when dead.
   */
  startFalling() {
    this.isFalling = true;
    this.acceleration = 4;
    this.speedY = 0;
  
    const fallInterval = setInterval(() => {
      this.y -= this.speedY;
      this.speedY -= this.acceleration;

      const canvasHeight = this.world?.canvas?.height || 720;
      if (this.y > canvasHeight + 100) {
        clearInterval(fallInterval);
        this.y = -1000;
      }
    }, 1000 / 60);
  }
}
