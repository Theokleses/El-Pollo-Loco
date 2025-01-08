
class Character extends MovableObject {
  y = 85;
  height = 235;
  width = 120;
  speed = 10;
  availableBottles = 0; // Neue Variable für verfügbare Flaschen
  energyBottle = 0; // Bestehende Variable für die Statusleiste
  availableCoins = 0;
  energyCoin = 0;
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_DEAD = [
      "img/2_character_pepe/5_dead/D-51.png",
      "img/2_character_pepe/5_dead/D-52.png",
      "img/2_character_pepe/5_dead/D-53.png",
      "img/2_character_pepe/5_dead/D-54.png",
      "img/2_character_pepe/5_dead/D-55.png",
      "img/2_character_pepe/5_dead/D-56.png",
      "img/2_character_pepe/5_dead/D-57.png"
  ];

  IMAGES_HURT = [
        "img/2_character_pepe/4_hurt/H-41.png",
        "img/2_character_pepe/4_hurt/H-42.png",
        "img/2_character_pepe/4_hurt/H-43.png"
  ];

  world;
  walking_sound = new Audio("audio/running.mp3");
  jumping_sound = new Audio("audio/jumping.mp3");
  sounds = []; 
  isMuted = false;

  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png"),
      this.loadImages(this.IMAGES_WALKING);
      this.loadImages(this.IMAGES_JUMPING);
      this.loadImages(this.IMAGES_DEAD);
      this.loadImages(this.IMAGES_HURT);
      this.collisionCooldown = false;
      this.sounds = [this.walking_sound, this.jumping_sound];
      this.animate();
      this.applyGravaty();
  }

  toggleMute() {
    this.isMuted = true;
    this.sounds.forEach(sounds => sounds.muted = this.isMuted);
}

  addBottle() {
    this.availableBottles = Math.min(this.availableBottles + 1, 5); // Maximal 5 Flaschen
    this.energyBottle = this.availableBottles * 20; // Prozentwert anpassen
    this.world.bottleBar.setBottlePercentage(this.energyBottle); // Bar aktualisieren
}
  addCoin() {
    this.availableCoins = Math.min(this.availableCoins + 1, 5); // Maximal 5 Flaschen
    this.energyCoin = this.availableCoins * 20; // Prozentwert anpassen
    this.world.coinBar.setCoinPercentage(this.energyCoin); // Bar aktualisieren
  }
  animate() {
    setInterval(() => { 
      this.walking_sound.pause();
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
          this.moveRight();
          this.walking_sound.play();
          this.otherDirection = false;
      }

      if (this.world.keyboard.LEFT && this.x > 0) {
          this.moveLeft();
          this.walking_sound.play();
          this.otherDirection = true;
      }
     else if( world.keyboard.SPACE && !this.isAboveGround() ){
        this.jump();
        this.jumping_sound.play();
    }

      this.world.camera_x = -this.x + 50;
    }, 1000 / 60);

    setInterval(() => {
        
        if (this.isDead()){
            this.playAnimation(this.IMAGES_DEAD)
        } else if(this.isHurt()){
            this.playAnimation(this.IMAGES_HURT)
        } else if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING);
        } else {
            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
              // Walk animation
                this.playAnimation(this.IMAGES_WALKING);
        }
      }
    }, 50);

  }
  jump() {
    this.speedY = 30; // Charakter springt
    this.checkDamageOnJump(); // Überprüfe, ob Gegner getroffen werden
  }

  checkDamageOnJump() {
    this.world.level.enemies.forEach((enemy) => {
      if (this.isColliding(enemy) && this.isAboveGround()) {
        enemy.energy = 0; // Gegner stirbt sofort
        this.world.level.enemies = this.world.level.enemies.filter(e => e.energy > 0); // Entferne tote Gegner
      }
    });
  }


  resetCollisionCooldown() {
    setTimeout(() => {
      this.collisionCooldown = false; // Cooldown nach 200ms zurücksetzen
    }, 200);
  }

}
