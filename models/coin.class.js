class Coins extends DrawableObject {
    y = 335;
    height = 70;
    width = 70;

    constructor(x) {
        super().loadImage("img/8_coin/coin_1.png");
        this.x = x;
        this.y = 100 + Math.random() * 200;
    }
}


