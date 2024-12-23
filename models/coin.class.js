class Coins extends DrawableObject{
    y = 335;
    height = 70;
    width = 70;
   
    constructor() {
        super().loadImage("img/8_coin/coin_1.png");
        this.x = 400 + Math.random() * 800; 
    }

    
    
}