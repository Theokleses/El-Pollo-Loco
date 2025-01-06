class World {
  character = new Character();
  canvas;
  ctx;
  keyboard;
  level;
  camera_x = 0;
  statusBar = new StatusBar();
  coinBar = new CoinBar();
  coinsGap = 600;
  bottleBar = new BottleBar();
  bottles = new Bottles();
  throwableObjects = [];
  startscreen = new StartScreen();
  losescreen = new LoseScreen();
  winscreen = new WinScreen();
  reachEndBoss = false;
  endbossBar = new EndbossBar();
  endboss = new Endboss();

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.character.world = this;
    this.level = null;
    this.draw();
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObejects();
      this.checkCharacterPosition();
    }, 100);
    
  }
  setWorld() {
    firstLevel();
    this.level = level1;
    this.Spawner();
    this.run();
  }

  Spawner() {
    this.spawnCoin();
    this.spawnBottle();
  }
  spawnCoin() {
    if (this.level.coins.length >= 5) {
      return; // Stop spawning if there are already 5 coins
    }
    let newCoin = new Coins(this.coinsGap);
    this.coinsGap += 70 + Math.random() * 70;
    this.level.coins.push(newCoin);
    setTimeout(() => {
      if(this.coinsGap <= 2000){
      this.spawnCoin();
      }
    }, 100);
  
  }

  spawnBottle() {
    if (this.level.bottles.length >= 5) {
      return; // Stop spawning if there are already 5 coins
    }
    let newBottle = new Bottles(this.coinsGap);
    this.coinsGap += 70 + Math.random() * 70;
    this.level.bottles.push(newBottle);
    setTimeout(() => {
      if(this.coinsGap <= 2000){
      this.spawnBottle();
      }
    }, 100);
  }

  checkCharacterPosition(){
    if(this.character.x > 2000){
      this.reachEndBoss = true;
    } 
  }

checkThrowObejects() {
  if (this.keyboard.D && this.character.availableBottles > 0) {
      let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
      this.throwableObjects.push(bottle);

      this.character.availableBottles--; // Eine Flasche weniger
      this.character.energyBottle = this.character.availableBottles * 20; // Prozentwert aktualisieren
      this.bottleBar.setBottlePercentage(this.character.energyBottle);  // Aktualisiere die Bar
  }
  
 }
 
  checkCollisions() {
    // Check collisions with enemies (Chickens)

    for (let i = this.level.enemies.length - 1; i >= 0; i--) {
      const enemy = this.level.enemies[i];
      if (this.character.isColliding(enemy) && enemy.energy > 0) {
        if (!this.character.collisionCooldown) { // Verhindert Mehrfachkollisionen
          this.character.collisionCooldown = true;
  
          if (this.character.speedY < 0 && this.character.isAboveGround() && this.character.isLegsColliding(enemy)) {
            enemy.energy--;
            if (enemy.energy <= 0) {
              setTimeout(() => {
                this.level.enemies.splice(i, 1); // Entferne das Huhn aus dem Level
              }, 250);
            }
          } else {
            this.character.hit(); // Schaden an Charakter
            this.statusBar.setPercentage(this.character.energy); // Statusbar aktualisieren
          }
        
          this.character.resetCollisionCooldown(); // Cooldown zurücksetzen
      
         }
      }
    }
  
    // Check collisions with coins
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        console.log("Coin collected!", this.character.energyCoin);
        this.character.addCoin();
        this.coinBar.setCoinPercentage(this.character.energyCoin);
        this.level.coins.splice(index, 1); // Entferne die Münze aus dem Level
        console.log('Coin collected', level1);
        
      }
    });
  
    // Check collisions with bottles (level.bottles)
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        console.log("Bottle collected!", this.character.energyBottle);
        this.character.addBottle();
        this.bottleBar.setBottlePercentage(this.character.energyBottle);
        this.level.bottles.splice(index, 1); // Entferne die Flasche aus dem Level
      }
    });
  
    // Check if throwable objects that hit the ground can be collected
    this.throwableObjects.forEach((bottle, bottleIndex) => {
      if (bottle.hasHitGround && this.character.isColliding(bottle)) {
        console.log("Grounded bottle collected!");
        this.character.addBottle();
        this.bottleBar.setBottlePercentage(this.character.energyBottle);
        this.throwableObjects.splice(bottleIndex, 1); // Entferne die Flasche aus den Wurfobjekten
      }
    });
  
    // Check collisions with throwable objects and enemies
    this.throwableObjects.forEach((bottle, bottleIndex) => {
      for (let j = this.level.enemies.length - 1; j >= 0; j--) {
        const enemy = this.level.enemies[j];
  
        if (bottle.isColliding(enemy) && enemy.energy > 0) {
          // Trigger splash animation on bottle
          bottle.hasCollided = true;
  
          if (enemy instanceof Endboss) {
            console.log('Endboss hit with throwable object');
            enemy.hit();
            this.endbossBar.setBossPercentage(enemy.energy);
          } else {
            enemy.energy--; // Reduziere die Energie des Huhns
            if (enemy.energy <= 0) {
              setTimeout(() => {
                this.level.enemies.splice(j, 1); // Entferne das Huhn aus dem Level
              }, 250);
            }
            console.log('Throwable object hit a regular enemy');
            console.log('Endboss hit with throwable object');
            console.log(`Enemy hit by throwable object! Remaining energy: ${enemy.energy}`);
          }
  
          // Entferne die Flasche nach der Splash-Animation
          setTimeout(() => {
            this.throwableObjects.splice(bottleIndex, 1);
          }, 80);
        }
      }
    });
  } 
 
draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (gameState == "Start") {
        this.addToMap(this.startscreen);
        this.startscreen.drawButton(this.ctx, 270, 60, 180, 50, "Start Game");
        startGameListener(this.startscreen); 


    }    if (gameState == "Lose") {
        this.addToMap(this.losescreen); 
        this.losescreen.drawButton(this.ctx, 270, 60, 180, 50, "New Game");
        startGameListener(this.losescreen); 
  }

        if (gameState == "Win") {
        this.addToMap(this.winscreen); 
        this.winscreen.drawButton(this.ctx, 270, 60, 180, 50, "New Game");
        startGameListener(this.winscreen); 
}
    if (gameState == "Game") {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectToMap(this.level.backgroundObjects);

        this.ctx.translate(-this.camera_x, 0);
        // ------ Space for fixed objects -----
        this.addToMap(this.statusBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);
        if (this.reachEndBoss == true) {
            this.addToMap(this.endbossBar);
        }

        this.ctx.translate(this.camera_x, 0);

        this.addToMap(this.character);
        this.addObjectToMap(this.level.coins);
        this.addObjectToMap(this.level.bottles);
        this.addObjectToMap(this.level.clouds);
        this.addObjectToMap(this.level.enemies);
        this.addObjectToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0);
      
    }

    // Draw() wird immer wieder aufgerufen
    let self = this;
    requestAnimationFrame(function () {
        self.draw();
    });
}

resetGame(){
  this.character.energy = 100;
  // this.level = level1;
  this.character.x = 120;
  // this.coinsGap = 600;
  // this.level.coins = [];
  damiLevel();
  startNewGame();
} 

  // draw() {
  //   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  //   if (gameState == "Start") {
  //     this.addToMap(this.startscreen); // Start-Screen
  //     this.startscreen.drawButton(this.ctx, 270, 60, 180, 50, "Start Game");
  //   }

  //   if (gameState == "Game") {
  //     this.ctx.translate(this.camera_x, 0);
  //     this.addObjectToMap(this.level.backgroundObjects);

  //     this.ctx.translate(-this.camera_x, 0);
  //     // ------ Space for fixed objects -----
  //     this.addToMap(this.statusBar);
  //     this.addToMap(this.coinBar);
  //     this.addToMap(this.bottleBar);
  //     if (this.reachEndBoss == true) {
  //       this.addToMap(this.endbossBar);     
  //     }
   

  //     this.ctx.translate(this.camera_x, 0);

  //     this.addToMap(this.character);
  //     this.addObjectToMap(this.level.coins);
  //     this.addObjectToMap(this.level.bottles);
  //     this.addObjectToMap(this.level.clouds);
  //     this.addObjectToMap(this.level.enemies);
  //     this.addObjectToMap(this.throwableObjects);

  //     this.ctx.translate(-this.camera_x, 0);
  //   }

  //   //Draw() wird immer wieder aufgerufen
  //   let self = this;
  //   requestAnimationFrame(function () {
  //     self.draw();
  //   });
  // }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  addObjectToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }
}