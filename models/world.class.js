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
  sounds = []; 
  isMuted = false;
  throwing_sound = new Audio("audio/throwing.mp3");
   

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.character.world = this;
    this.sounds = [this.throwing_sound];
    this.level = null;
    this.draw();
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObejects();
      this.checkCharacterPosition();
      this.checkEndbossDistance();
    }, 100);
    
  }

  setWorld() {
    firstLevel();
    this.level = level1;
    this.endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    this.Spawner();
    this.run();
  }

  Spawner() {
    this.spawnCoin();
    this.spawnBottle();
  }

  spawnCoin() {
    if (this.level.coins.length >= 5) {
      return;
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
      return; 
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

  toggleMute() {
    this.level.enemies.forEach(enemy =>{
      if(enemy instanceof Endboss){
        enemy.toggleMute();
      }
    });
    this.character.toggleMute();
    this.isMuted = !this.isMuted;
    this.sounds.forEach(sounds => sounds.muted = this.isMuted);
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
      this.throwing_sound.play();

      this.character.availableBottles--;
      this.character.energyBottle = this.character.availableBottles * 20; 
      this.bottleBar.setBottlePercentage(this.character.energyBottle);
  }
 }

 checkEndbossDistance() {
  const endbossDistance = 500; 
  if (Math.abs(this.character.x - this.endboss.x) < endbossDistance) {
      this.endboss.stateAlert = false; 
  } else {
      this.endboss.stateAlert = true;
  }
}

checkCollisions() {
  // Prüfen, ob der Charakter "tot" ist, und die Funktion beenden
  if (this.character.energy <= 0) {
    return;
  }

  // Kollision mit Feinden prüfen
  for (let i = this.level.enemies.length - 1; i >= 0; i--) {
    const enemy = this.level.enemies[i];
    if (this.character.isColliding(enemy) && enemy.energy > 0) {
      if (enemy instanceof Endboss) {
        enemy.changeSpeed(0); // Endboss anhalten, solange Kollision besteht
      }
      if (!this.character.collisionCooldown) {
        this.character.collisionCooldown = true;
        if (this.character.speedY < 0 && this.character.isAboveGround() && this.character.isLegsColliding(enemy)) {
          enemy.energy--;
          if (enemy.energy <= 0) {
            setTimeout(() => {
              this.level.enemies.splice(i, 1); 
            }, 250);
          }
        } else {
          this.character.hit(); 
          this.statusBar.setPercentage(this.character.energy); 
        }
        this.character.resetCollisionCooldown(); 
      }
    } else if (enemy instanceof Endboss) {
      enemy.changeSpeed(60); // Endboss wieder bewegen, wenn keine Kollision mehr
    }
  }

  // Kollision mit Münzen prüfen
  this.level.coins.forEach((coin, index) => {
    if (this.character.isColliding(coin)) {
      this.character.addCoin();
      this.coinBar.setCoinPercentage(this.character.energyCoin);
      this.level.coins.splice(index, 1);
    }
  });

  // Kollision mit Flaschen prüfen
  this.level.bottles.forEach((bottle, index) => {
    if (this.character.isColliding(bottle)) {
      this.character.addBottle();
      this.bottleBar.setBottlePercentage(this.character.energyBottle);
      this.level.bottles.splice(index, 1);
    }
  });

  // Kollision von geworfenen Objekten mit dem Charakter prüfen
  this.throwableObjects.forEach((bottle, bottleIndex) => {
    if (bottle.hasHitGround && this.character.isColliding(bottle)) {
      this.character.addBottle();
      this.bottleBar.setBottlePercentage(this.character.energyBottle);
      this.throwableObjects.splice(bottleIndex, 1);
    }
  });

  // Kollision von geworfenen Objekten mit Feinden prüfen
  this.throwableObjects.forEach((bottle, bottleIndex) => {
    for (let j = this.level.enemies.length - 1; j >= 0; j--) {
      const enemy = this.level.enemies[j];
      if (bottle.isColliding(enemy) && enemy.energy > 0) {
        bottle.hasCollided = true;  
        if (enemy instanceof Endboss) {
          enemy.hit();
          this.endbossBar.setBossPercentage(enemy.energy);
        } else {
          enemy.energy--;
          if (enemy.energy <= 0) {
            setTimeout(() => {
              this.level.enemies.splice(j, 1);
            }, 250);
          }
        }
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
        buttontoPush = this.startscreen.startGameButton;


    }    if (gameState == "Lose") {
        this.addToMap(this.losescreen); 
        this.losescreen.drawButton(this.ctx, 270, 60, 180, 50, "New Game");
        buttontoPush = this.losescreen.startGameButton;
  }

        if (gameState == "Win") {
        this.addToMap(this.winscreen); 
        this.winscreen.drawButton(this.ctx, 270, 60, 180, 50, "New Game");
        buttontoPush = this.winscreen.startGameButton;
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
    let self = this;
    requestAnimationFrame(function () {
        self.draw();
    });
}


  resetGame(){
    this.character.energy = 100;
    this.level = level1;
    this.character.x = 120;
    // this.character.lastHit = null; // Letzten Treffer zurücksetzen
    damiLevel();
    startNewGame();
  }

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