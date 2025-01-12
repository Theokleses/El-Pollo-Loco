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
  sounds = []; 
  isMuted = false;


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

  hit() {
    console.log("Schaden wird zugefügt:", this.constructor.name, "Energie:", this.energy);
    let damage = this instanceof Endboss ? 20 : 5; 
    this.energy -= damage;
  
    if (this.energy <= 0) {
        this.energy = 0;
  
        if (this instanceof Character) {
            setTimeout(() => {
                this.lose_sound.play();
                gameState = "Lose"; 
            }, 1000); 
        }
  
        if (this instanceof Endboss) {
            setTimeout(() => {
                this.win_sound.play();
                gameState = "Win";     
            }, 1000); 
        }
    }
    this.lastHit = new Date().getTime();
}

toggleMute() {
  this.isMuted = !this.isMuted;
  this.sounds.forEach(sounds => sounds.muted = this.isMuted);
  console.log(this, this.isMuted, this.sounds);
}

  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    return timePassed < 250; 
  }
  isDead() {
    return this.energy === 0;
  }

   isColliding(mo) {
    return this.x + this.width > mo.x &&
      this.y + this.height > mo.y &&
      this.x < mo.x &&
      this.y < mo.y + mo.height;
  }

   isLegsColliding(mo) {
    const offset = 10; 
    const legsY = this.y + this.height * 0.7;
    const legsHeight = this.height * 0.3;

    return this.x + this.width > mo.x - offset &&
      legsY + legsHeight > mo.y - offset &&
      this.x < mo.x + mo.width + offset &&
      legsY < mo.y + mo.height + offset;
  }

}