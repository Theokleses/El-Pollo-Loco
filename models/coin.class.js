class Coins extends DrawableObject {
    y = 335;
    height = 100;
    width = 100;

    COIN_ANIMATE = [
        "img/8_coin/coin_1.png",
        "img/8_coin/coin_2.png"
    ];

    constructor(x) {
        super().loadImage("img/8_coin/coin_1.png");
        this.x = x;
        this.y = 100 + Math.random() * 200;
        this.currentImageIndex = 0;
        this.animate(); 
    }

    animate() {
        setInterval(() => {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.COIN_ANIMATE.length;
            this.loadImage(this.COIN_ANIMATE[this.currentImageIndex]);
        }, 200);
    }
}