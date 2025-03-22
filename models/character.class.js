class Character extends MovableObject {
  y = 85;
  height = 235;
  width = 120;
  speed = 10;
  availableBottles = 0;
  energyBottle = 0;
  availableCoins = 0;
  energyCoin = 0;
  idleCounter = 0;
  idleSleepTimer = 450;
  isStanding = false;

  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
  ];

  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];
  IMAGES_IDLE_LONG = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png"),
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_IDLE_LONG);
    this.collisionCooldown = false;
    this.isMuted = localStorage.getItem("isMuted") === "true";
    this.sounds.forEach((sound) => (sound.muted = this.isMuted));
    this.animate();
    this.applyGravaty();
  }

  addBottle() {
    this.availableBottles = Math.min(this.availableBottles + 1, 5);
    this.energyBottle = this.availableBottles * 20;
    this.world.bottleBar.setBottlePercentage(this.energyBottle);
  }
  addCoin() {
    this.availableCoins = Math.min(this.availableCoins + 1, 5);
    this.energyCoin = this.availableCoins * 20;
    this.world.coinBar.setCoinPercentage(this.energyCoin);
  }

  animate() {
    setInterval(() => {
      this.walking_sound.pause();
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.moveRight();
        this.idleCounter = 0;
        this.walking_sound.play();
        this.otherDirection = false;
      }
      if (this.world.keyboard.LEFT && this.x > 0) {
        this.moveLeft();
        this.idleCounter = 0;
        this.walking_sound.play();
        this.otherDirection = true;
      } else if (world.keyboard.UP && !this.isAboveGround()) {
        this.jump();
        this.idleCounter = 0;
        this.jumping_sound.play();
      } else {
        this.idleState();
        this.idleCounter++;
      }

      this.world.camera_x = -this.x + 50;
    }, 1000 / 60);

    setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
          this.playAnimation(this.IMAGES_WALKING);
        }
      }
    }, 50);
  }

  idleState() {
    if (!this.isStanding) {
      this.isStanding = true;

      if (this.idleCounter < this.idleSleepTimer) {
        this.playAnimation(this.IMAGES_IDLE);
      } else {
        this.playAnimation(this.IMAGES_IDLE_LONG);
      }
      setTimeout(() => {
        this.isStanding = false;
      }, 125);
    }
  }

  jump() {
    this.speedY = 30;
    this.checkDamageOnJump();
  }

  checkDamageOnJump() {
    this.world.level.enemies.forEach((enemy) => {
      if (this.isColliding(enemy) && this.isAboveGround()) {
        enemy.energy = 0;
        this.world.level.enemies = this.world.level.enemies.filter(
          (e) => e.energy > 0
        );
      }
    });
  }

  resetCollisionCooldown() {
    setTimeout(() => {
      this.collisionCooldown = false;
    }, 200);
  }
}
