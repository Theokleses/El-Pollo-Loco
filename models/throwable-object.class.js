class ThrowableObject extends MovableObject{

    constructor(x, y) {
        super().loadImage("img/6_salsa_bottle/salsa_bottle.png");
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 70;
        this.trow();
    }

    trow() { 
        this.speedY = 30;
        this.applyGravaty();   
        setInterval(() => {
            this.x += 10;
        }, 25);   
    }
    
}