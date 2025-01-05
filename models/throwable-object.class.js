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
        this.hasCollided = false; // Kollisionsstatus
        this.hasHitGround = false; // Bodenstatus
        this.flaschenPositionen = [];
        this.trow();
        this.animate();
    }

trow() {
    this.speedY = 30;
    this.applyGravaty();
    let interval = setInterval(() => {
        if (this.isAboveGround()) {
            this.x += 3 + Math.random() * 15; // Bewegung nach rechts bleibt konstant
        } else {
            clearInterval(interval); // Stoppe die horizontale Bewegung
        }
    }, 25);
}

    
    // trow() {
    //     this.speedY = 30;
    //     this.applyGravaty();
    //     setInterval(() => {
    //         this.x += 10;
    //     }, 25);
    // }
    
    animate() {
        setInterval(() => {
            if (this.hasCollided) {
                // Zeige Splash-Animation
                this.currentImageIndex = (this.currentImageIndex + 1) % this.BOTTLE_SPLASH.length;
                this.loadImage(this.BOTTLE_SPLASH[this.currentImageIndex]);
            } else if (!this.isAboveGround()) {
                // Zeige Boden-Animation, wenn die Flasche den Boden erreicht
                this.loadImage(this.BOTTLE_GROUND[0]);
                this.hasHitGround = true;
            } else {
                // Zeige Rotations-Animation
                this.currentImageIndex = (this.currentImageIndex + 1) % this.BOTTLE_ROTATE.length;
                this.loadImage(this.BOTTLE_ROTATE[this.currentImageIndex]);
            }
        }, 100);
    }
}
