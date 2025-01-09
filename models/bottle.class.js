class Bottles extends DrawableObject {
    y = 135;
    height = 70;
    width = 70;

    constructor(x) {
        super().loadImage("img/6_salsa_bottle/salsa_bottle.png");
        this.x = x;
        this.y = 200 + Math.random() * 200;
    }
}
