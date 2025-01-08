// class MovableObject extends DrawableObject {
//   speed = 0.15;
//   otherDirection = false;
//   speedY = 0;
//   acceleration = 2.5;
//   energy = 100;
//   lastHit = 0;


//   applyGravaty() {
//     setInterval(() => {
//       if (this.isAboveGround() || this.speedY > 0) {
//         this.y -= this.speedY;
//         this.speedY -= this.acceleration;
//       }
//     }, 1000 / 25);
//   }

//   isAboveGround() {
//     if(this instanceof ThrowableObject){ // Throable objects should always fall
//           return true;
//     } else {
//         return this.y < 180;
//     }
//   }
  
//   playAnimation(images) {
//     let i = this.currentImage % images.length; // let i = 7 % 6; => 1, Rest 1 , i = 0, 1, 2, 3, 4, 5, 0 (fängt wieder bei 0 an)
//     let path = images[i];
//     this.img = this.imageCache[path];
//     this.currentImage++;
//   }

//   moveRight() {
//     this.x += this.speed;
//   }

//   moveLeft() {
//     this.x -= this.speed;
//   }
//   // jump() {
//   //   this.speedY = 30;
//   // }

//   hit() {
//     this.energy -= 5;
//       if(this.energy < 0) {
//         this.energy = 0;
//       } else {
//         this.lastHit =  new Date().getTime();
//     }
//   }

//   isHurt() {
//       let timepassed = new Date().getTime() - this.lastHit; // Difference in ms
//       timepassed = timepassed / 1000; // Difference in s
//       return timepassed < 1;

//   }

//   isDead() {
//       return this.energy == 0;
    
//   }

//   // character.isColliding(chicken);
//   isColliding(mo) {
//     return this.x + this.width > mo.x &&
//         this.y + this.height > mo.y &&
//         this.x < mo.x &&
//         this.y < mo.y + mo.height;
//   }

//   isLegsColliding(mo) {
//     const offset = 10; // 5 Pixel Versatz
//     const legsY = this.y + this.height * 0.7;
//     const legsHeight = this.height * 0.3;

//     return this.x + this.width > mo.x - offset &&
//           legsY + legsHeight > mo.y - offset &&
//           this.x < mo.x + mo.width + offset &&
//           legsY < mo.y + mo.height + offset;
//   }


// }

class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  // currentImage = 0;

  applyGravaty() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }
  

  isAboveGround() {
    if(this instanceof ThrowableObject){ // Throwable objects should always fall
      return this.y < 350;
    } else {
      return this.y < 180;
    }
  }

  playAnimation(images) {
    let i = this.currentImage % images.length; // Rotating through images
    let path = images[i];
    this.img = this.imageCache[path]; // Assuming imageCache is defined
    this.currentImage++;
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  // Hit method: Trigger hurt animation and decrease energy
//   hit() {
//     let damage = this instanceof Endboss ? 20 : 5; // Endboss erhält 25 Schaden, andere 5
//     this.energy -= damage;
//     if (this.energy <= 0) {
//         this.energy = 0;
//        if(this instanceof Character) {
//           gameState = "Lose";
//         } if(this instanceof Endboss) {
//           gameState = "Win";
//         }
//     }
//     this.lastHit = new Date().getTime(); // Zeitpunkt des Treffers setzen
// }


// hit() {
//   let damage = this instanceof Endboss ? 20 : 5; // Endboss erhält 20 Schaden, andere 5
//   this.energy -= damage;

//   if (this.energy <= 0) {
//       this.energy = 0;

//       if (this instanceof Character) {
//           setTimeout(() => {
//               gameState = "Lose"; // Verzögert den Wechsel zum Lose-Screen
//           }, 1000); // 1000ms (1 Sekunde) Verzögerung für die Dead-Animation
//       }

//       if (this instanceof Endboss) {
//           setTimeout(() => {
//               gameState = "Win"; // Verzögert den Wechsel zum Win-Screen
//           }, 1000); // 1000ms (1 Sekunde) Verzögerung für die Dead-Animation
//       }
//   }

//   this.lastHit = new Date().getTime(); // Zeitpunkt des Treffers setzen
// }
hit() {
  let damage = this instanceof Endboss ? 20 : 5; // Endboss erhält 20 Schaden, andere 5
  this.energy -= damage;

  if (this.energy <= 0) {
      this.energy = 0;

      // Überprüfen, ob es der Character oder der Endboss ist, und passenden GameState setzen
      const nextGameState = this instanceof Character ? "Lose" : "Win";
      setTimeout(() => {
          gameState = nextGameState; // Nach 1 Sekunde den GameState ändern
      }, 1000);
  }

  this.lastHit = new Date().getTime(); // Zeitpunkt des Treffers setzen
}



  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit; // Zeitdifferenz in ms
    return timePassed < 250; // Hurt-Animation für 1 Sekunde nach Treffer
  }
  isDead() {
    return this.energy === 0;
  }

   // Collision detection
   isColliding(mo) {
    return this.x + this.width > mo.x &&
      this.y + this.height > mo.y &&
      this.x < mo.x &&
      this.y < mo.y + mo.height;
  }

   isLegsColliding(mo) {
    const offset = 10; // 5 Pixel offset
    const legsY = this.y + this.height * 0.7;
    const legsHeight = this.height * 0.3;

    return this.x + this.width > mo.x - offset &&
      legsY + legsHeight > mo.y - offset &&
      this.x < mo.x + mo.width + offset &&
      legsY < mo.y + mo.height + offset;
  }

}