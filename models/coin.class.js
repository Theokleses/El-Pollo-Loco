// class Coins extends DrawableObject {

//     static existingPositionsCoins = []; // Nur für Coins

//     y = 335;
//     height = 70;
//     width = 70;

//     constructor() {
//         super().loadImage("img/8_coin/coin_1.png");
//         this.x = this.createDistance2();
//     }

//     createDistance2() {
//         const minDistance = 100; // Mindestabstand zwischen den Coins
//         let newPosition;

//         do {
//             newPosition = 200 + Math.random() * 600;
//         } while (Coins.existingPositionsCoins.some(pos => Math.abs(pos - newPosition) < minDistance));

//         Coins.existingPositionsCoins.push(newPosition);
//         return newPosition;
//     }
// }



// class Coins extends DrawableObject {
//     y = 335;
//     height = 70;
//     width = 70;
   
//     constructor(index, startX, maxX, numBottles) {
//         super().loadImage("img/8_coin/coin_1.png") 

//             // Mindestabstand sicherstellen
//             const spacing = 100; // Mindestabstand
//             const segmentWidth = (maxX - startX) / numBottles;
//             this.x = startX + index * segmentWidth + Math.random() * (segmentWidth - spacing);
//         }
// }


// class Coins extends DrawableObject {
//     y = 335;
//     height = 70;
//     width = 70;


//     constructor(index, minX, maxX, gap) {
//         super().loadImage("img/8_coin/coin_1.png");
//         this.x = minX + index * gap; // Abstand basierend auf Index und Gap
//     }
// }


class Coins extends DrawableObject {
    y = 335;
    height = 70;
    width = 70;

    constructor(index, minX, maxX, gap) {
        super().loadImage("img/8_coin/coin_1.png");
        this.x = minX + index * gap + Math.random() * (gap / 2) - (gap / 4); // Zufällige Position direkt berechnet
    }
}


