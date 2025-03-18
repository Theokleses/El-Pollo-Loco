class PermanentBottle extends MovableObject {
    BOTTLE_ROTATE = [
        "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png"
    ];

    constructor(x, y) {
        super().loadImage(this.BOTTLE_ROTATE[0]); 
        this.loadImages(this.BOTTLE_ROTATE); 
        this.x = x;
        this.y = y;
        this.height = 90; 
        this.width = 90;
        this.currentImageIndex = 0;
        this.animate(); 
    }

    animate() {
        setInterval(() => {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.BOTTLE_ROTATE.length;
            this.loadImage(this.BOTTLE_ROTATE[this.currentImageIndex]);
        }, 100); 
    }
}