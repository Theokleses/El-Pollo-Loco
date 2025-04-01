class Character extends MovableObject {
  y = 85;
  height = 235;
  width = 120;
  collisionHeight = 150;
  collisionWidth = 50;
  speed = 10;
  availableBottles = 0;
  energyBottle = 0;
  availableCoins = 0;
  energyCoin = 0;
  idleCounter = 0;
  idleSleepTimer = 450;
  isStanding = false;
  jumpDamageCooldown = false;
  currentJumpFrame = 0;
  isJumping = false;
  jumpAnimationCompleted = false;
  jumpAnimationSpeed = 90; 

  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    // "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
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
    this.applyGravaty();
    this.updateCollisionBox();
  }

/**
 * Starts the animation of the character.
 */
startAnimation() {
  this.animate();
}

/**
 * Defines the animations of the character.
 */
animate() {
  setInterval(() => {
    this.walking_sound.pause();
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) this.handleMoveRight();
    if (this.world.keyboard.LEFT && this.x > 0) this.handleMoveLeft();
    if (this.world.keyboard.UP && !this.isAboveGround()) this.handleJump();
    if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && !this.isAboveGround()) this.handleIdle();
    this.world.camera_x = -this.x + 50;
    this.updateCollisionBox();
    this.checkDamageOnJump();
  }, 1000 / 60);

  setInterval(() => {
    this.updateAnimation();
  }, 50);
}

/**
 * Handles movement to the right
 */
handleMoveRight() {
  this.moveRight();
  this.idleCounter = 0;
  this.walking_sound.play();
  this.otherDirection = false;
}

/**
 * Handles movement to the left.
 */
handleMoveLeft() {
  this.moveLeft();
  this.idleCounter = 0;
  this.walking_sound.play();
  this.otherDirection = true;
}

/**
 * Handles the character's jump.
 */
handleJump() {
  if (!this.isAboveGround() && !this.isJumping) {  
    this.jump();
    this.idleCounter = 0;
    if (!this.isMuted) {this.jumping_sound.currentTime = 0; this.jumping_sound.play();}
    this.currentJumpFrame = 0;
    this.isJumping = true;
    this.jumpAnimationCompleted = false;
    this.lastAnimationTime = Date.now();
    this.img = this.imageCache[this.IMAGES_JUMPING[0]];
    this.currentJumpFrame = 1;
  }
}

/**
 * Handles the idle state of the character.
 */
handleIdle() {
  this.idleState();
  this.idleCounter++;
}

/**
 * Updates the animation based on the character's state.
 */
updateAnimation() {
  if (this.isDead()) {
    this.playAnimation(this.IMAGES_DEAD);
  } else if (this.isHurt()) {
    this.playAnimation(this.IMAGES_HURT);
  } else if (this.isAboveGround()) {
    if (!this.jumpAnimationCompleted) {
      this.playJumpAnimationOnce();
    } else {this.img = this.imageCache[this.IMAGES_JUMPING[this.IMAGES_JUMPING.length - 1]];

    }
  } else {
    this.isJumping = false;
    this.jumpAnimationCompleted = false;
    if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) { this.playAnimation(this.IMAGES_WALKING);
    } else {
      this.handleIdle();
    }
  }
}

  /**
   * Plays the jump animation once (instead of looping).
   */
playJumpAnimationOnce() {
  const now = Date.now();
  if (now - this.lastAnimationTime >= this.jumpAnimationSpeed) {
    if (this.currentJumpFrame < this.IMAGES_JUMPING.length) {
      let path = this.IMAGES_JUMPING[this.currentJumpFrame];
      this.img = this.imageCache[path];
      this.currentJumpFrame++;
      this.lastAnimationTime = now;
    } else {
      this.jumpAnimationCompleted = true;
    }
  }
}

/**
 * Updates the Y-position of the character's collision box.
 */
updateCollisionBox() {
  this.collisionY = this.y + 85;
  this.collisionX = this.x + (this.width - this.collisionWidth) / 2;
}

/**
 * Manages the idle state and corresponding animations.
 */
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

/**
 * Makes the character jump and checks for damage.
 */
jump() {
  this.speedY = 30;
  this.checkDamageOnJump();
  this.jumpDamageCooldown = false;
}

/**
 * Checks and applies damage during jump collisions with enemies.
 */
checkDamageOnJump() {
  if (!this.isAboveGround() || this.speedY >= 0 || this.jumpDamageCooldown) return;
  let hitEnemies = [];
  this.world.level.enemies.forEach((enemy, index) => {
    if (this.isLegsColliding(enemy) && enemy.energy > 0) {enemy.energy--;
      if (enemy.energy <= 0) hitEnemies.push(index);}
  });
  if (
    hitEnemies.length > 0 || this.world.level.enemies.some((enemy) => this.isLegsColliding(enemy))
  ) {
    this.jumpDamageCooldown = true;}
  for (let i = hitEnemies.length - 1; i >= 0; i--) {
    setTimeout(() => {
      if (this.world.level.enemies[hitEnemies[i]]) {this.world.level.enemies.splice(hitEnemies[i], 1);
      }
    }, 250);
  }
}

/**
 * Adds a bottle to the inventory and updates the display.
 */
addBottle() {
  this.availableBottles = Math.min(this.availableBottles + 1, 5);
  this.energyBottle = this.availableBottles * 20;
  this.world.bottleBar.setBottlePercentage(this.energyBottle);
}

/**
 * Adds a coin to the inventory and updates the display.
 */
addCoin() {
  this.availableCoins = Math.min(this.availableCoins + 1, 5);
  this.energyCoin = this.availableCoins * 20;
  this.world.coinBar.setCoinPercentage(this.energyCoin);
}

/**
 * Resets the collision cooldown.
 */
resetCollisionCooldown() {
  setTimeout(() => {
    this.collisionCooldown = false;
  }, 200);
}

/**
 * Resets the character's properties to their default values.
 */
resetCharacter() {
  this.energy = 100;
  this.x = 120;
  this.y = 185;
  this.speed = 10;
  this.availableBottles = 0;
  this.availableCoins = 0; 
  this.coins = 0;
  this.otherDirection = false; 
}
}




