class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 4;
  energy = 100;
  lastHit = 0;
  walking_sound = new Audio("audio/running.mp3");
  jumping_sound = new Audio("audio/jumping.mp3");

  constructor() {
    super();
    this.isMuted = localStorage.getItem("isMuted") === "true";
    this.walking_sound.volume = 0.4;
  }

  /**
   * Applies gravity to the object, affecting its vertical position.
   */
  applyGravaty() {
    setInterval(() => {
        if (this.isDead()) {
            if (this instanceof Character || this instanceof Endboss) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
                return;
            }
        }
    
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        } else if (!this.isAboveGround() && this.speedY <= 0) {
            if (this instanceof ThrowableObject) {
                this.speedY = 0;
                this.acceleration = 0;
                this.y = 370;
            } else {
                this.y = 200;
                this.speedY = 0;
            }
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
          if (!this.isMuted) {world.soundManager.playSound('lose', this.isMuted); this.deathSoundPlayed = true;}
          gameState = "Lose";
        }, 1000);
      }
      if (this instanceof Endboss) {
        setTimeout(() => {world.soundManager.playSound('win', this.isMuted); this.deathSoundPlayed = false;
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
      } else if (isCurrentlyHurt && !this.isPlayingHurtSound) {world.soundManager.playSound('hurt', this.isMuted); this.isPlayingHurtSound = true;
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
    const feetWidth = this.collisionWidth; 
    const feetX = this.collisionX; 

    return (
        feetX + feetWidth > mo.x - offset &&      
        legsY + legsHeight > mo.y - offset &&     
        feetX < mo.x + mo.width + offset &&       
        legsY < mo.y + mo.height + offset   
    );
  }
}
