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
  sounds = [this.win_sound, this.lose_sound, this.walking_sound, this.jumping_sound,this.hurt_sound];

  
  constructor() {
    super();
    this.isMuted = localStorage.getItem('isMuted') === 'true'; 
    this.sounds.forEach((sound) => (sound.muted = !this.isMuted));
  }

  applyGravaty() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }
  
  isAboveGround() {
    if(this instanceof ThrowableObject){
      return this.y < 350;
    } else {
      return this.y < 180;
    }
  }

  playAnimation(images) {
    let i = this.currentImage % images.length; 
    let path = images[i];
    this.img = this.imageCache[path]; 
    this.currentImage++;
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

//   hit() {
//     console.log("Schaden wird zugefügt:", this.constructor.name, "Energie:", this.energy);
//     let damage = this instanceof Endboss ? 20 : 5; 
//     this.energy -= damage;
  
//     if (this.energy <= 0) {
//         this.energy = 0;
  
//         if (this instanceof Character) {
//             setTimeout(() => {
//                 this.lose_sound.play();
//                 gameState = "Lose"; 
//             }, 1000); 
//         }
  
//         if (this instanceof Endboss) {
//             setTimeout(() => {
//                 this.win_sound.play();
//                 gameState = "Win";     
//             }, 1000); 
//         }
//     }
//     this.lastHit = new Date().getTime();
// }
hit() {
  console.log("Schaden wird zugefügt:", this.constructor.name, "Energie vor Schaden:", this.energy);
  let damage = this instanceof Endboss ? 20 : 5;
  this.energy -= damage;

  if (this.energy <= 0) {
    this.energy = 0;

    if (this instanceof Character) {
      setTimeout(() => {
        if (!this.isMuted) {
          this.lose_sound.currentTime = 0;
          this.lose_sound.play();
        }
        gameState = "Lose";
      }, 1000);
    }

    if (this instanceof Endboss) {
      setTimeout(() => {
        this.win_sound.muted = false;
        this.win_sound.currentTime = 0;
        this.win_sound.play();
        gameState = "Win";
      }, 1000);
    }
  }
  this.lastHit = new Date().getTime();
}

toggleMute() {
  this.isMuted = checkSoundMuted();
  this.sounds.forEach(sounds => sounds.muted = this.isMuted);
  console.log("toggleMute aufgerufen, isMuted:", this.isMuted);
}
muteAllSounds () {
  this.sounds.forEach(sounds => sounds.volume = 0);
  console.log("muteAllSounds aufgerufen");
}

  // isHurt() {
  //   let timePassed = new Date().getTime() - this.lastHit;
  //   return timePassed < 250; 
  // }
  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    let isCurrentlyHurt = timePassed < 250;

    if (this instanceof Character) { // Nur für Character-Instanzen
      if (this.isDead()) { // Wenn tot, Sound stoppen
        if (this.isPlayingHurtSound) {
          this.hurt_sound.pause();
          this.isPlayingHurtSound = false;
        }
      } else if (isCurrentlyHurt && !this.isPlayingHurtSound) {
        this.hurt_sound.currentTime = 0;
        this.hurt_sound.play();
        this.isPlayingHurtSound = true;
      } else if (!isCurrentlyHurt && this.isPlayingHurtSound) {
        // this.hurt_sound.pause();
        this.isPlayingHurtSound = false;
      }
    }

    return isCurrentlyHurt;
  }
  isDead() {
    return this.energy === 0;
  }

  //  isColliding(mo) {
  //   return this.x + this.width > mo.x &&
  //     this.y + this.height > mo.y &&
  //     this.x < mo.x &&
  //     this.y < mo.y + mo.height;
  // }
  isColliding(mo) {
    const thisCollisionHeight = this.collisionHeight || this.height; // Fallback auf height, falls collisionHeight nicht definiert
    const thisCollisionY = this.collisionY || this.y; // Fallback auf y
    const moCollisionHeight = mo.collisionHeight || mo.height;
    const moCollisionY = mo.collisionY || mo.y;

    return this.x + this.width > mo.x &&
      thisCollisionY + thisCollisionHeight > moCollisionY &&
      this.x < mo.x + mo.width &&
      thisCollisionY < moCollisionY + moCollisionHeight;
  }

   isLegsColliding(mo) {
    const offset = 1; 
    const legsY = this.y + this.height * 0.7;
    const legsHeight = this.height * 0.3;

    return this.x + this.width > mo.x - offset &&
      legsY + legsHeight > mo.y - offset &&
      this.x < mo.x + mo.width + offset &&
      legsY < mo.y + mo.height + offset;
  }

}