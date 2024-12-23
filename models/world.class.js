class World {
  character = new Character();
  canvas;
  ctx;
  keyboard;
  level;
  camera_x = 0;
  statusBar = new StatusBar();
  coinBar = new CoinBar();
  coins = new Coins();
  bottleBar = new BottleBar();
  throwableObjects = [];
  startscreen = new StartScreen();


  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.character.world = this;
    this.draw();
  }

  setWorld() {
    this.level = level1;
    this.run();
  }
  
  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObejects();
    }, 200);
  }

  checkThrowObejects() {
       if(this.keyboard.D){
        let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
        this.throwableObjects.push(bottle);
       } 
  }

  checkCollisions() {
      // Check collisions
      this.level.enemies.forEach((enemy) => {
        if (this.character.isColliding(enemy)) {
          this.character.hit();
          this.statusBar.setPercentage(this.character.energy);
        }
    });

    //  this.level.coin;
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        console.log('Coin collected!', this.character.energyCoin);
        this.character.add();
        this.coinBar.setCoinPercentage(this.character.energyCoin);
        this.level.coins.splice(index, 1); // Entfernt den Coin aus dem Array
      }
    });
 
  }


  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if(gameState == "Start"){
      this.addToMap(this.startscreen); // Start-Screen
      this.startscreen.drawButton(this.ctx, 270, 60, 180, 50, "Start Game");
      }
     
    if(gameState == "Game"){
    this.ctx.translate(this.camera_x, 0);
    this.addObjectToMap(this.level.backgroundObjects);

    this.ctx.translate(-this.camera_x, 0);
    // ------ Space for fixed objects -----
    this.addToMap(this.statusBar);
    this.addToMap(this.coinBar);
    this.addToMap(this.bottleBar);
    this.ctx.translate(this.camera_x, 0);

    this.addToMap(this.character);
    this.addObjectToMap(this.level.coins);
    this.addObjectToMap(this.level.clouds);
    this.addObjectToMap(this.level.enemies);
    this.addObjectToMap(this.throwableObjects);

    this.ctx.translate(-this.camera_x, 0);
    }
  
    //Draw() wird immer wieder aufgerufen
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
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
