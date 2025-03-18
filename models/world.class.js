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
  mouseX = 0;
  mouseY = 0;
  lastThrowTime = 0;
  throwDelay = 750;
  endbossStartX;
  permanentBottle; // Neue feste Flasche bei x = 2000
  bottleTimer;
  runInterval; // Speichert das run-Intervall
  intervals = []

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.character.world = this;
    this.sounds = [this.throwing_sound];
    this.level = null;
    this.trackMousePosition();
    this.draw();
  }

  // run() {
  //   setInterval(() => {
  //     this.checkCollisions();
  //     this.checkThrowObjects();
  //     this.checkCharacterPosition();
  //     this.checkEndbossDistance();
  //     this.checkPermanentBottleCollision();
  //   }, 100);
  // }

  run() {
    this.runInterval = setInterval(() => {
        this.checkCollisions();
        this.checkThrowObjects();
        this.checkCharacterPosition();
        this.checkEndbossDistance();
        this.checkPermanentBottleCollision();
    }, 100);
    this.intervals.push(this.runInterval); // Speichere das Intervall
}

stopAllIntervals() {
  // Stoppe alle gespeicherten Intervalle
  this.intervals.forEach(interval => clearInterval(interval));
  this.intervals = [];
  // Stoppe Intervalle in Unterobjekten
  if (this.character && this.character.animateInterval) {
      clearInterval(this.character.animateInterval);
  }
  if (this.endboss && this.endboss.animateInterval) {
      clearInterval(this.endboss.animateInterval);
  }
  if (this.permanentBottle && this.permanentBottle.animateInterval) {
      clearInterval(this.permanentBottle.animateInterval);
  }
  if (this.bottleTimer) {
      clearInterval(this.bottleTimer);
      this.bottleTimer = null;
  }
}

  setWorld() {
    firstLevel();
    this.level = level1;
    this.endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
    this.endbossStartX = this.endboss.x;
    this.permanentBottle = new PermanentBottle(2000, 100);// Feste Flasche bei x = 2000
    this.permanentBottle.y = 100;
    this.Spawner();
    this.run();
  }

  Spawner() {
    this.spawnCoin();
    this.spawnBottle();
  }

  trackMousePosition() {
    this.canvas.addEventListener("mousemove", (event) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = event.clientX - rect.left;
      this.mouseY = event.clientY - rect.top;
    });
  }

  spawnCoin() {
    if (this.level.coins.length >= 5) {
      return;
    }
    let newCoin = new Coins(this.coinsGap);
    this.coinsGap += 70 + Math.random() * 70;
    this.level.coins.push(newCoin);
    setTimeout(() => {
      if (this.coinsGap <= 2000) {
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
      if (this.coinsGap <= 2000) {
        this.spawnBottle();
      }
    }, 100);
  }

  toggleMute() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.toggleMute();
      }
    });
    this.character.toggleMute();
    this.isMuted = !this.isMuted;
    this.sounds.forEach((sounds) => (sounds.muted = this.isMuted));
  }

  checkCharacterPosition() {
    if (this.character.x > 2000) {
      this.reachEndBoss = true;
    }
  }

  // checkThrowObejects() {
  //   if (this.keyboard.D && this.character.availableBottles > 0) {
  //       // this.character.throwBottle();
  //       let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
  //       this.throwableObjects.push(bottle);
  //       this.throwing_sound.play();

  //       this.character.availableBottles--;
  //       this.character.energyBottle = this.character.availableBottles * 20;
  //       this.bottleBar.setBottlePercentage(this.character.energyBottle);
  //   }
  //  }
  checkThrowObjects() {
    if (this.keyboard.D && this.character.availableBottles > 0) {
      const currentTime = Date.now();
      if (currentTime - this.lastThrowTime >= this.throwDelay) {
        let bottle = new ThrowableObject(
          this.character.x + 100,
          this.character.y + 100
        );
        this.throwableObjects.push(bottle);
        bottle.throw();
        this.throwing_sound.play();
        this.character.availableBottles--;
        this.character.energyBottle = this.character.availableBottles * 20;
        this.bottleBar.setBottlePercentage(this.character.energyBottle);
        this.lastThrowTime = currentTime;
      }
    }
  }

  // checkEndbossDistance() {
  //   const endbossDistance = 500;
  //   if (Math.abs(this.character.x - this.endboss.x) < endbossDistance) {
  //     this.endboss.stateAlert = false;
  //   } else {
  //     this.endboss.stateAlert = true;
  //   }
  // }

  checkEndbossDistance() {
    const endbossDistance = 500; 
    const distanceToCharacter = Math.abs(this.character.x - this.endboss.x);
    if (distanceToCharacter < endbossDistance) {
        this.endboss.stateAlert = false; 
    } else {
        this.endboss.stateAlert = true; 
    }
    if (this.endboss.x < this.character.x) { 
        this.endboss.x = this.endbossStartX; 
        this.endboss.changeSpeed(0); 
        this.endboss.stateAlert = true;
    }
}

checkPermanentBottleCollision() {
  if (this.character.isColliding(this.permanentBottle)) {
      // Starte Timer, wenn noch nicht aktiv
      if (!this.bottleTimer) {
          this.bottleTimer = setInterval(() => {
              this.character.addBottle(); // Flasche pro Sekunde hinzufügen
              this.bottleBar.setBottlePercentage(this.character.energyBottle);
          }, 100); // 1000 ms = 1 Sekunde
      }
  } else {
      // Stoppe Timer, wenn keine Kollision mehr
      if (this.bottleTimer) {
          clearInterval(this.bottleTimer);
          this.bottleTimer = null;
      }
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
          if (
            this.character.speedY < 0 &&
            this.character.isAboveGround() &&
            this.character.isLegsColliding(enemy)
          ) {
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
    this.canvas.style.cursor = "default";
    if (gameState == "Start") {
      this.addToMap(this.startscreen);
      this.startscreen.drawButton(this.ctx, 270, 60, 180, 50, "Start Game");
      buttontoPush = this.startscreen.startGameButton;

      if (
        this.startscreen.isMouseOverButton(
          this.mouseX,
          this.mouseY,
          270,
          60,
          180,
          50
        )
      ) {
        this.canvas.style.cursor = "pointer";
      }
    }

    if (gameState == "Lose") {
      this.addToMap(this.losescreen);
      this.losescreen.drawButton(this.ctx, 270, 60, 180, 50, "New Game");
      buttontoPush = this.losescreen.startGameButton;

      if (
        this.losescreen.isMouseOverButton(
          this.mouseX,
          this.mouseY,
          270,
          60,
          180,
          50
        )
      ) {
        this.canvas.style.cursor = "pointer";
      }
    }

    if (gameState == "Win") {
      this.addToMap(this.winscreen);
      this.winscreen.drawButton(this.ctx, 270, 60, 180, 50, "New Game");
      buttontoPush = this.winscreen.startGameButton;

      if (
        this.winscreen.isMouseOverButton(this.mouseX,this.mouseY,270,60,180,50)
      ) {
        this.canvas.style.cursor = "pointer";
      }
    }

    if (gameState == "Game") {
      this.canvas.style.cursor = "default";
      this.ctx.translate(this.camera_x, 0);
      this.addObjectToMap(this.level.backgroundObjects);

      this.ctx.translate(-this.camera_x, 0);
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
      this.addToMap(this.permanentBottle);
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
  // resetGame() {
  //   this.character.energy = 100;
  //   this.level = level1;
  //   this.character.x = 120;
  //   this.character.lastHit = null; // Letzten Treffer zurücksetzen
  //   // damiLevel();
  //   startNewGame();
  // }
  resetGame() {
    this.stopAllIntervals(); // Stoppe alle Intervalle vor dem Zurücksetzen
    this.character.energy = 100;
    this.character.lastHit = null; // Letzten Treffer zurücksetzen
    this.character.collisionCooldown = false; // Kollisions-Cooldown zurücksetzen
    this.character.x = 120;
    this.level = level1;
    this.statusBar.setPercentage(100); // Lebensleiste explizit auf 100 setzen
    this.reachEndBoss = false; // Endboss-Zustand zurücksetzen
    startNewGame(); // Neues Spiel starten
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
