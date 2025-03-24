const BUTTON_CONFIG = {
  x: 0.375, y: 0.09375, width: 0.25, height: 0.1042, 
};

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
  isMuted = false;
  isMusicPlaying = false;
  throwing_sound = new Audio("audio/throwing.mp3");
  background_sound = new Audio("audio/background-sound.mp3");
  coin_sound = new Audio("audio/coin.mp3");
  bottle_sound = new Audio("audio/bottle.mp3");
  mouseX = 0;
  mouseY = 0;
  lastThrowTime = 0;
  throwDelay = 750;
  endbossStartX;
  permanentBottle;
  bottleTimer;
  runInterval; 
  intervals = []

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.mouseX = 0;
    this.mouseY = 0;
    this.keyboard = keyboard;
    this.character.world = this;
    this.background_sound.loop = true;
    this.level = null;
    this.trackMousePosition();
    this.draw();
  }

  run() {
    this.runInterval = setInterval(() => {
        this.checkCollisions();
        this.checkThrowObjects();
        this.checkCharacterPosition();
        this.checkEndbossDistance();
        this.checkPermanentBottleCollision();
    }, 100);
    this.intervals.push(this.runInterval); 
}

stopAllIntervals() {
  this.intervals.forEach(interval => clearInterval(interval));
  this.intervals = [];
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
    // setLocalSound();
    this.level = level1;
    this.endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
    this.endbossStartX = this.endboss.x;
    this.permanentBottle = new PermanentBottle(2000, 100);
    this.permanentBottle.y = 100;
    const storedMute = localStorage.getItem('isMuted');
    this.isMuted = storedMute === 'true' ? true : false;
    this.toggleWorldSounds();
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
    this.isMuted = !this.isMuted;
    localStorage.setItem('isMuted', this.isMuted);
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.toggleMute();
      }
    });
    this.character.toggleMute();
    this.toggleWorldSounds();
    console.log('toggleMute called, isMuted:', this.isMuted);
  }

  toggleWorldSounds() {
    this.background_sound.muted = this.isMuted;
    this.throwing_sound.muted = this.isMuted;
    this.coin_sound.muted = this.isMuted;
    this.bottle_sound.muted = this.isMuted;
  }
  
  checkThrowObjects() {
    if (this.keyboard.D && this.character.availableBottles > 0) {
      const currentTime = Date.now();
      if (currentTime - this.lastThrowTime >= this.throwDelay) {
        let bottle = new ThrowableObject(this.character.x + 100,this.character.y + 100);
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

  checkCharacterPosition() {
    if (this.character.x > 2000) {
      this.reachEndBoss = true;
    }
  }

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
      if (!this.bottleTimer) {
          this.bottleTimer = setInterval(() => {
              this.character.addBottle();
              this.bottleBar.setBottlePercentage(this.character.energyBottle);
              this.bottle_sound.play();
          }, 100);
      }
  } else {

      if (this.bottleTimer) {
          clearInterval(this.bottleTimer);
          this.bottleTimer = null;
      }
  }
}

  checkCollisions() {
    if (this.character.energy <= 0) return;
    this.checkEnemyCollisions();
    this.checkCoinCollisions();
    this.checkBottleCollisions();
    this.checkThrowableCharacterCollisions();
    this.checkThrowableEnemyCollisions();
  }

  checkEnemyCollisions() {
    for (let i = this.level.enemies.length - 1; i >= 0; i--) {
      const enemy = this.level.enemies[i];
      if (this.character.isColliding(enemy) && enemy.energy > 0) {
        if (enemy instanceof Endboss) enemy.changeSpeed(5);
        if (!this.character.collisionCooldown) {
          this.character.collisionCooldown = true;
          this.character.hit(); // Nur Schaden vom Gegner
          this.statusBar.setPercentage(this.character.energy);
          this.character.resetCollisionCooldown();
        }
      } else if (enemy instanceof Endboss) enemy.changeSpeed(60);
    }
  }

  checkCoinCollisions() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.character.addCoin();
        this.coinBar.setCoinPercentage(this.character.energyCoin);
        this.level.coins.splice(index, 1);
        this.coin_sound.play();
      }
    });
  }

  checkBottleCollisions() {
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.character.addBottle();
        this.bottleBar.setBottlePercentage(this.character.energyBottle);
        this.level.bottles.splice(index, 1);
        this.bottle_sound.play();
      }
    });
  }

  checkThrowableCharacterCollisions() {
    this.throwableObjects.forEach((bottle, bottleIndex) => {
      if (bottle.hasHitGround && this.character.isColliding(bottle)) {
        this.character.addBottle();
        this.bottleBar.setBottlePercentage(this.character.energyBottle);
        this.throwableObjects.splice(bottleIndex, 1);
      }
    });
  }

  checkThrowableEnemyCollisions() {
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
            if (enemy.energy <= 0) setTimeout(() => this.level.enemies.splice(j, 1), 250);
          }
          setTimeout(() => this.throwableObjects.splice(bottleIndex, 1), 80);
        }
      }
    });
  }

getButtonCoordinates() {
  return [
    BUTTON_CONFIG.x * this.canvas.width,
    BUTTON_CONFIG.y * this.canvas.height,
    BUTTON_CONFIG.width * this.canvas.width,
    BUTTON_CONFIG.height * this.canvas.height
  ];
}

isButtonHovered(screen, absX, absY, absW, absH) {
  return screen.isMouseOverButton(this.mouseX, this.mouseY, absX, absY, absW, absH);
}

renderButton(screen, buttonText, absX, absY, absW, absH) {
  const isHovered = this.isButtonHovered(screen, absX, absY, absW, absH);
  screen.drawButton(this.ctx, BUTTON_CONFIG.x, BUTTON_CONFIG.y, BUTTON_CONFIG.width, BUTTON_CONFIG.height, buttonText, {}, isHovered);
  buttontoPush = { ...BUTTON_CONFIG };
  return isHovered;
}

drawScreenWithButton(screen, buttonText) {
  if (screen) this.addToMap(Object.assign(screen, { x: 0, y: 0, width: this.canvas.width, height: this.canvas.height }));
  const [absX, absY, absW, absH] = this.getButtonCoordinates();
  const isHovered = this.renderButton(screen, buttonText, absX, absY, absW, absH);
  if (isHovered) this.canvas.style.cursor = 'pointer';
  if (this.isMusicPlaying) {
    this.background_sound.pause();
    this.isMusicPlaying = false;
    console.log(`Background music paused in ${gameState} screen`);
  }
  document.getElementById("muteButton").classList.add("d_none");
  document.getElementById("muteButtonOverlay").classList.add("d_none");
}

draw() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.canvas.style.cursor = 'default';
  this.drawScreenState();
  this.drawGameState();
  requestAnimationFrame(() => this.draw());
}

drawScreenState() {
  if (gameState == "Start") this.drawScreenWithButton(this.startscreen, "Start Game");
  else if (gameState == "Lose") this.drawScreenWithButton(this.losescreen, "New Game");
  else if (gameState == "Win") this.drawScreenWithButton(this.winscreen, "New Game");
}

drawGameState() {
  if (gameState != "Game") return;
  if (!this.isMusicPlaying) {
    this.background_sound.play().catch(error => console.error('Error playing background music:', error));
    this.isMusicPlaying = true;
    console.log('Background music started');
  }
  document.getElementById("muteButton").classList.remove("d_none");
  document.getElementById("muteButtonOverlay").classList.remove("d_none");
  this.canvas.style.cursor = 'default';
  this.drawBackgroundAndBars();
  this.drawInteractiveObjects();
}

drawBackgroundAndBars() {
  this.ctx.translate(this.camera_x, 0);
  this.addObjectToMap(this.level.backgroundObjects);
  this.ctx.translate(-this.camera_x, 0);
  this.addToMap(this.statusBar);
  this.addToMap(this.coinBar);
  this.addToMap(this.bottleBar);
  if (this.reachEndBoss) this.addToMap(this.endbossBar);
}

drawInteractiveObjects() {
  this.ctx.translate(this.camera_x, 0);
  if (this.character) {
    Object.assign(this.character, { x: this.character.x || 1, y: this.character.y || 85, width: this.character.width || 120, height: this.character.height || 235, world: this });
    if (!this.character.animationStarted) {
      this.character.startAnimation();
      this.character.animationStarted = true;
    }
    this.addToMap(this.character);
  }
  this.addObjectToMap(this.level.coins);
  this.addObjectToMap(this.level.bottles);
  this.addToMap(this.permanentBottle);
  this.permanentBottle.drawText(this.ctx);
  this.addObjectToMap(this.level.clouds);
  this.addObjectToMap(this.level.enemies);
  this.addObjectToMap(this.throwableObjects);
  this.ctx.translate(-this.camera_x, 0);
}

  resetGame() {
    this.background_sound.volume = 0;
    this.throwing_sound.volume = 0;
    this.stopAllIntervals(); 
    this.character.energy = 100;
    this.character.lastHit = null; 
    this.character.collisionCooldown = false; 
    this.character.x = 120;
    this.level = level1;
    this.statusBar.setPercentage(100); 
    this.reachEndBoss = false; 
    this.character.muteAllSounds();
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
