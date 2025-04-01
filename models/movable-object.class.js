class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  win_sound = new Audio("audio/win.mp3");
  lose_sound = new Audio("audio/lose.mp3");
  walking_sound = new Audio("audio/running.mp3");
  jumping_sound = new Audio("audio/jumping.mp3");
  hurt_sound = new Audio("audio/hurt.mp3");
  sounds = [
    this.win_sound,
    this.lose_sound,
    this.walking_sound,
    this.jumping_sound,
    this.hurt_sound
  ];

  constructor() {
    super();
    this.isMuted = localStorage.getItem("isMuted") === "true";
    this.sounds.forEach((sound) => (sound.muted = this.isMuted));
    this.walking_sound.volume = 0.4;
    this.hurt_sound.volume = 0.3;
    this.jumping_sound.volume = 0.3;
  }

  /**
   * Applies gravity to the object, affecting its vertical position.
   */
  applyGravaty() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Checks if the object is above the ground level.
   */  
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return this.y < 350;
    } else {
      return this.y < 180;
    }
  }

  /**
   * Plays an animation by cycling through the provided images.
   */  
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Moves the object to the right based on its speed.
   */  
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left based on its speed.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Reduces the object's energy and handles death states.
   */  
  hit() {
    let damage = this instanceof Endboss ? 20 : 5;
    this.energy -= damage;
    if (this.energy <= 0) {
      this.energy = 0;
      if (this instanceof Character) {
        setTimeout(() => {
          if (!this.isMuted) {this.lose_sound.currentTime = 0; this.lose_sound.play();}
          gameState = "Lose";
        }, 1000);
      }
      if (this instanceof Endboss) {
        setTimeout(() => {this.win_sound.currentTime = 0; this.win_sound.play();
          gameState = "Win";
        }, 1000);
      }
    }
    this.lastHit = new Date().getTime();
  }

  /**
   * Toggles the mute state of all sounds associated with the object.
   */
  toggleMute() {
    this.isMuted = checkSoundMuted();
    this.sounds.forEach((sounds) => (sounds.muted = this.isMuted));
  }

  /**
   * Mutes all sounds by setting their volume to zero.
   */
  muteAllSounds() {
    this.sounds.forEach((sounds) => (sounds.volume = 0));
  }

  /**
   * Determines if the object is currently hurt based on recent damage.
   */  
  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    let isCurrentlyHurt = timePassed < 250;
    if (this instanceof Character) {
      if (this.isDead()) {
        if (this.isPlayingHurtSound) {this.hurt_sound.pause(); this.isPlayingHurtSound = false;}
      } else if (isCurrentlyHurt && !this.isPlayingHurtSound) {this.hurt_sound.play(); this.isPlayingHurtSound = true;
      } else if (!isCurrentlyHurt && this.isPlayingHurtSound) {this.isPlayingHurtSound = false;}
    }
    return isCurrentlyHurt;
  }

  /**
   * Checks if the object is dead based on its energy level.
   */
  isDead() {
    return this.energy === 0;
  }

  /**
   * Checks if this object collides with another object.
   */  
  isColliding(mo) {
    const thisCollisionX = this.collisionX || this.x;
    const thisCollisionWidth = this.collisionWidth || this.width;
    const thisCollisionHeight = this.collisionHeight || this.height;
    const thisCollisionY = this.collisionY || this.y;
    
    const moCollisionX = mo.collisionX || mo.x;
    const moCollisionWidth = mo.collisionWidth || mo.width;
    const moCollisionHeight = mo.collisionHeight || mo.height;
    const moCollisionY = mo.collisionY || mo.y;
    
    return (
        thisCollisionX + thisCollisionWidth > moCollisionX &&
        thisCollisionY + thisCollisionHeight > moCollisionY &&
        thisCollisionX < moCollisionX + moCollisionWidth &&
        thisCollisionY < moCollisionY + moCollisionHeight
    );
  }


  /**
   * Checks if the legs of this object collide with another object.
   */  
  isLegsColliding(mo) {
    const offset = 1;
    const legsY = this.collisionY + this.collisionHeight * 0.7;
    const legsHeight = this.collisionHeight * 0.3;
    const feetWidth = this.collisionWidth; // Volle Breite der Kollisionsbox
    const feetX = this.collisionX; // Keine Zentrierung nötig

    return (
        feetX + feetWidth > mo.x - offset &&      
        legsY + legsHeight > mo.y - offset &&     
        feetX < mo.x + mo.width + offset &&       
        legsY < mo.y + mo.height + offset   
    );
  }
}
