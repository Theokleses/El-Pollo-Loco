class ThrowableObject extends MovableObject {
    BOTTLE_ROTATE = [
        "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png"
    ];

    BOTTLE_SPLASH = [
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png"
    ];

    BOTTLE_GROUND = [
        "img/6_salsa_bottle/2_salsa_bottle_on_ground.png"
    ];

    constructor(x, y) {
        super().loadImage("img/6_salsa_bottle/salsa_bottle.png");
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 70;
        this.currentImageIndex = 0;
        this.hasCollided = false;
        this.hasHitGround = false;
        this.splashSoundPlayed = false;
        this.isMuted = localStorage.getItem("isMuted") === "true";
        this.animate();
    }
    
    /**
     * Throws the bottle with an initial upward speed and horizontal movement based on direction.
     */
    throw(throwLeft) {
        this.speedY = 30;
        this.applyGravaty();
        let interval = setInterval(() => {
            if (this.isAboveGround()) {
                if (throwLeft) {
                    this.x -= 3 + Math.random() * 15; 
                } else {
                    this.x += 3 + Math.random() * 15;
                }
            } else {
                clearInterval(interval); 
            }
        }, 25);
    }

    /**
     * Starts the animation of the bottle based on its state.
     */
    animate() {
        setInterval(() => {
            if (this.hasCollided) {
                if (!this.splashSoundPlayed) {
                    world.soundManager.playSound('bottle-splash', this.isMuted);
                    this.splashSoundPlayed = true;
                }
                this.currentImageIndex = (this.currentImageIndex + 1) % this.BOTTLE_SPLASH.length;
                this.loadImage(this.BOTTLE_SPLASH[this.currentImageIndex]);
            } else if (!this.isAboveGround()) {
                this.loadImage(this.BOTTLE_GROUND[0]);
                this.hasHitGround = true;
            } else {
                this.currentImageIndex = (this.currentImageIndex + 1) % this.BOTTLE_ROTATE.length;
                this.loadImage(this.BOTTLE_ROTATE[this.currentImageIndex]);
            }
        }, 100);
    }
}