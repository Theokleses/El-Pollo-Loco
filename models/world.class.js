const BUTTON_CONFIG = { x: 0.375, y: 0.09375, width: 0.25, height: 0.1042 };
const BACK_BUTTON_CONFIG = {x: 0.375, y: 0.25, width: 0.25, height: 0.1042};

class World {
  character = new Character(); canvas; ctx; keyboard; level; camera_x = 0;
  statusBar = new StatusBar(); coinBar = new CoinBar(); coinsGap = 600;
  bottleBar = new BottleBar(); bottles = new Bottles(); throwableObjects = [];
  startscreen = new StartScreen(); losescreen = new LoseScreen(); winscreen = new WinScreen();
  reachEndBoss = false; endbossBar = new EndbossBar(); isMuted = false; isMusicPlaying = false;
  throwing_sound = new Audio("audio/throwing.mp3"); background_sound = new Audio("audio/background-sound.mp3");
  coin_sound = new Audio("audio/coin.mp3"); bottle_sound = new Audio("audio/bottle.mp3");
  mouseX = 0; mouseY = 0; lastThrowTime = 0; throwDelay = 750; endbossStartX; permanentBottle; bottleTimer;
  runInterval; intervals = [];

  /** Initializes the game world with canvas and keyboard. */
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
    this.canvas.addEventListener("click", (event) => this.handleCanvasClick(event));
    this.draw();
  }

  /** Starts the main game loop. */
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

  /** Stops all active intervals in the world. */
  stopAllIntervals() { 
    this.intervals.forEach(interval => clearInterval(interval)); 
    this.intervals = [];
    if (this.character && this.character.animateInterval) clearInterval(this.character.animateInterval);
    if (this.endboss && this.endboss.animateInterval) clearInterval(this.endboss.animateInterval);
    if (this.permanentBottle && this.permanentBottle.animateInterval) clearInterval(this.permanentBottle.animateInterval);
    if (this.bottleTimer) { 
      clearInterval(this.bottleTimer); 
      this.bottleTimer = null; 
    }
  }

  /** Sets up the world with level and initial settings. */
  setWorld() { 
    firstLevel(); 
    this.level = level1; 
    this.endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    this.endbossStartX = this.endboss.x; 
    this.permanentBottle = new PermanentBottle(2000, 100); 
    this.permanentBottle.y = 100;
    this.reachEndBoss = false;
    const storedMute = localStorage.getItem('isMuted'); 
    this.isMuted = storedMute === 'true'; 
    this.toggleWorldSounds();
    this.coinsGap = 600; 
    this.Spawner(); 
    this.run();
  }

  /** Spawns coins and bottles in the level. */
  Spawner() { 
    this.spawnCoin(); 
    this.spawnBottle(); 
  }

  /** Tracks the mouse position on the canvas. */
  trackMousePosition() { 
    this.canvas.addEventListener("mousemove", (event) => { 
      const rect = this.canvas.getBoundingClientRect(); 
      this.mouseX = event.clientX - rect.left; 
      this.mouseY = event.clientY - rect.top; 
    }); 
  }

  /** Spawns a new coin if the limit is not reached. */
  spawnCoin() { 
    if (this.level.coins.length >= 5) return; 
    let newCoin = new Coins(this.coinsGap); 
    this.coinsGap += 70 + Math.random() * 70; 
    this.level.coins.push(newCoin); 
    setTimeout(() => { 
      if (this.coinsGap <= 2000) this.spawnCoin(); 
    }, 100); 
  }

  /** Spawns a new bottle if the limit is not reached. */
  spawnBottle() { 
    if (this.level.bottles.length >= 5) return; 
    let newBottle = new Bottles(this.coinsGap); 
    this.coinsGap += 70 + Math.random() * 70; 
    this.level.bottles.push(newBottle); 
    setTimeout(() => { 
      if (this.coinsGap <= 2000) this.spawnBottle(); 
    }, 100); 
  }

  /** Toggles the mute state of all sounds. */
  toggleMute() { 
    this.isMuted = !this.isMuted; 
    localStorage.setItem('isMuted', this.isMuted); 
    this.level.enemies.forEach(enemy => { 
      if (enemy instanceof Endboss) enemy.toggleMute(); 
    }); 
    this.character.toggleMute(); 
    this.toggleWorldSounds(); 
  }

  /** Toggles muting of world-specific sounds. */
  toggleWorldSounds() { 
    this.background_sound.muted = this.isMuted; 
    this.throwing_sound.muted = this.isMuted; 
    this.coin_sound.muted = this.isMuted; 
    this.bottle_sound.muted = this.isMuted; 
  }

  /** Checks and handles throwing of bottles. */
  checkThrowObjects() {
    if (this.keyboard.D && this.character.availableBottles > 0) {
        const currentTime = Date.now();
        if (currentTime - this.lastThrowTime >= this.throwDelay) {
            let bottleX = this.character.otherDirection ? this.character.x + 0 : this.character.x + 100;
            let bottle = new ThrowableObject(bottleX, this.character.y + 100);
            this.throwableObjects.push(bottle);
            bottle.throw(this.character.otherDirection); 
            this.throwing_sound.play();
            this.character.availableBottles--;
            this.character.energyBottle = this.character.availableBottles * 20;
            this.bottleBar.setBottlePercentage(this.character.energyBottle);
            this.lastThrowTime = currentTime;
          }
      }
    }

  /** Checks if the character has reached the endboss area. */
  checkCharacterPosition() { 
    if (this.character.x > 2000) this.reachEndBoss = true; 
  }

  /** Updates the endboss state based on distance to the character. */
  checkEndbossDistance() { 
    const endbossDistance = 500, distanceToCharacter = Math.abs(this.character.x - this.endboss.x); 
    if (distanceToCharacter < endbossDistance) this.endboss.stateAlert = false; 
    else this.endboss.stateAlert = true; 
    if (this.endboss.x < this.character.x) { 
      this.endboss.x = this.endbossStartX; 
      this.endboss.changeSpeed(0); 
      this.endboss.stateAlert = true; 
    } 
  }

  /** Checks collision with the permanent bottle and fills bottles. */
  checkPermanentBottleCollision() { 
    if (this.character.isColliding(this.permanentBottle)) { 
      if (!this.bottleTimer) this.bottleTimer = setInterval(() => { 
        this.character.addBottle(); 
        this.bottleBar.setBottlePercentage(this.character.energyBottle); 
        this.bottle_sound.play(); 
      }, 100); 
    } else if (this.bottleTimer) { 
      clearInterval(this.bottleTimer); 
      this.bottleTimer = null; 
    } 
  }

  /** Checks all collisions in the game world. */
  checkCollisions() { 
    if (this.character.energy <= 0) return; 
    this.checkEnemyCollisions(); 
    this.checkCoinCollisions(); 
    this.checkBottleCollisions(); 
    this.checkThrowableCharacterCollisions(); 
    this.checkThrowableEnemyCollisions(); 
  }

  /** Checks collisions between the character and enemies. */
  checkEnemyCollisions() { 
    for (let i = this.level.enemies.length - 1; i >= 0; i--) { 
      const enemy = this.level.enemies[i]; 
      if (this.character.isColliding(enemy) && enemy.energy > 0) { 
        if (enemy instanceof Endboss) enemy.changeSpeed(5); 
        if (!this.character.collisionCooldown) { 
          this.character.collisionCooldown = true; 
          this.character.hit(); 
          this.statusBar.setPercentage(this.character.energy); 
          this.character.resetCollisionCooldown(); 
        } 
      } else if (enemy instanceof Endboss) enemy.changeSpeed(60); 
    } 
  }    

  /** Checks collisions between the character and coins. */
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

  /** Checks collisions between the character and bottles. */
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

  /** Checks collisions between the character and grounded bottles. */
  checkThrowableCharacterCollisions() { 
    this.throwableObjects.forEach((bottle, bottleIndex) => { 
      if (bottle.hasHitGround && this.character.isColliding(bottle)) { 
        this.character.addBottle(); 
        this.bottleBar.setBottlePercentage(this.character.energyBottle); 
        this.throwableObjects.splice(bottleIndex, 1); 
      } 
    }); 
  }

  /** Checks collisions between thrown bottles and enemies. */
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

  /** Returns the absolute coordinates of the button. */
  getButtonCoordinates() { 
    return [
      BUTTON_CONFIG.x * this.canvas.width, 
      BUTTON_CONFIG.y * this.canvas.height, 
      BUTTON_CONFIG.width * this.canvas.width, 
      BUTTON_CONFIG.height * this.canvas.height
    ]; 
  }

  /** Checks if the mouse is over the button. */
  isButtonHovered(screen, absX, absY, absW, absH) { 
    return screen.isMouseOverButton(this.mouseX, this.mouseY, absX, absY, absW, absH); 
  }

  /** Renders the button on the screen. */
  renderButton(screen, buttonText, absX, absY, absW, absH) { 
    const isHovered = this.isButtonHovered(screen, absX, absY, absW, absH); 
    screen.drawButton(this.ctx, BUTTON_CONFIG.x, BUTTON_CONFIG.y, BUTTON_CONFIG.width, BUTTON_CONFIG.height, buttonText, {}, isHovered); 
    buttontoPush = { ...BUTTON_CONFIG }; 
    return isHovered; 
  }

  /** Draws the screen with a button. */
  drawScreenWithButton(screen, buttonText) { 
    if (screen) this.addToMap(Object.assign(screen, { x: 0, y: 0, width: this.canvas.width, height: this.canvas.height })); 
    const [absX, absY, absW, absH] = this.getButtonCoordinates(); 
    const isHovered = this.renderButton(screen, buttonText, absX, absY, absW, absH); 
    let isBackHovered = false;
    if (gameState === "Lose" || gameState === "Win") {isBackHovered = this.renderBackButton(screen, "Back to Start");}
    if (isHovered || isBackHovered) {this.canvas.style.cursor = 'pointer';}
    if (this.isMusicPlaying) { this.background_sound.pause(); this.isMusicPlaying = false;} 
    document.getElementById("muteButton").classList.add("d_none"); 
    document.getElementById("muteButtonOverlay").classList.add("d_none"); 
  }

  /** Renders the back button on the screen and checks hover state. */
  renderBackButton(screen, buttonText) {
    const absX = BACK_BUTTON_CONFIG.x * this.canvas.width;
    const absY = BACK_BUTTON_CONFIG.y * this.canvas.height;
    const absW = BACK_BUTTON_CONFIG.width * this.canvas.width;
    const absH = BACK_BUTTON_CONFIG.height * this.canvas.height; 
    const isHovered = this.isButtonHovered(screen, absX, absY, absW, absH);
    screen.drawButton(this.ctx, BACK_BUTTON_CONFIG.x, BACK_BUTTON_CONFIG.y, BACK_BUTTON_CONFIG.width, BACK_BUTTON_CONFIG.height, buttonText, 
      {}, 
      isHovered
    );
    return isHovered;
  }
  /** Checks if the main button is clicked based on mouse position. */
  isMainButtonClicked() {
    const [absX, absY, absW, absH] = this.getButtonCoordinates();
    return this.mouseX >= absX && this.mouseX <= absX + absW && this.mouseY >= absY && this.mouseY <= absY + absH;
  }

  /** Resets the game to the start screen state. */
  goBackToStart() {
    this.stopAllIntervals();
    this.background_sound.pause();
    this.isMusicPlaying = false;
    gameState = "Start";
    this.character.resetCharacter();
    this.statusBar.setPercentage(100);
    this.coinBar.setCoinPercentage(0);
    this.bottleBar.setBottlePercentage(0);
    this.spawnCoin();
    this.coinsGap = 600;
  }

  /** Handles canvas click events based on game state. */
  handleCanvasClick = (event) => { 
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;

    if (gameState === "Lose" || gameState === "Win") {
      if (this.isBackButtonClicked()) {this.goBackToStart();
        return;
      }

      if (this.isMainButtonClicked()) {this.resetGame();
        return;
      }
    } else if (gameState === "Start") {
      if (this.isMainButtonClicked()) {gameState = "Game";this.setWorld();
        return;
      }
    }
  }

  /** Checks if the back button is clicked based on mouse position. */
  isBackButtonClicked() {
    const absX = BACK_BUTTON_CONFIG.x * this.canvas.width;
    const absY = BACK_BUTTON_CONFIG.y * this.canvas.height;
    const absW = BACK_BUTTON_CONFIG.width * this.canvas.width;
    const absH = BACK_BUTTON_CONFIG.height * this.canvas.height;
    return this.mouseX >= absX && this.mouseX <= absX + absW && this.mouseY >= absY && this.mouseY <= absY + absH;
  }

  /** Main drawing loop for the game world. */
  draw() { 
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); 
    this.canvas.style.cursor = 'default'; 
    this.drawScreenState(); 
    this.drawGameState(); 
    requestAnimationFrame(() => this.draw()); 
  }

  /** Draws the current screen state (start, lose, win). */
  drawScreenState() { 
    if (gameState == "Start") this.drawScreenWithButton(this.startscreen, "Start Game"); 
    else if (gameState == "Lose") this.drawScreenWithButton(this.losescreen, "New Game"); 
    else if (gameState == "Win") this.drawScreenWithButton(this.winscreen, "New Game"); 
  }

  /** Draws the game state when active. */
  drawGameState() { 
    if (gameState != "Game") return; 
    if (!this.isMusicPlaying) { 
      this.background_sound.play().catch(error => console.error('Error playing background music:', error)); 
      this.isMusicPlaying = true;  
    } 
    document.getElementById("muteButton").classList.remove("d_none"); 
    document.getElementById("muteButtonOverlay").classList.remove("d_none"); 
    this.canvas.style.cursor = 'default'; 
    this.drawBackgroundAndBars(); 
    this.drawInteractiveObjects(); 
  }

  /** Draws background and status bars. */
  drawBackgroundAndBars() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectToMap(this.level.backgroundObjects);
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.addToMap(this.coinBar);
    this.addToMap(this.bottleBar);
    if (this.reachEndBoss && this.endboss) {this.addToMap(this.endbossBar);}
  }

  /** Draws interactive game objects. */
  drawInteractiveObjects() { 
    this.ctx.translate(this.camera_x, 0); 
    if (this.character) { 
      Object.assign(this.character, { 
        x: this.character.x || 1, y: this.character.y || 85, width: this.character.width || 120, height: this.character.height || 235, world: this}); 
      if (!this.character.animationStarted) { this.character.startAnimation(); this.character.animationStarted = true; 
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

  /** Resets the game to its initial state. */
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

  /** Adds a single object to the map with optional flipping. */
  addToMap(mo) { 
    if (mo.otherDirection) this.flipImage(mo); 
    mo.draw(this.ctx); 
    mo.drawFrame(this.ctx); 
    if (mo.otherDirection) this.flipImageBack(mo); 
  }

  /** Flips the image horizontally for drawing. */
  flipImage(mo) { 
    this.ctx.save(); 
    this.ctx.translate(mo.width, 0); 
    this.ctx.scale(-1, 1); 
    mo.x = mo.x * -1; 
  }

  /** Restores the flipped image to its original state. */
  flipImageBack(mo) { 
    mo.x = mo.x * -1; 
    this.ctx.restore(); 
  }

  /** Adds multiple objects to the map. */
  addObjectToMap(objects) { 
    objects.forEach(o => this.addToMap(o)); 
  }
}
