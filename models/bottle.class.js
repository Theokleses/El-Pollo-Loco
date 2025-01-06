// class Bottles extends DrawableObject {
//     y = 135;
//     height = 70;
//     width = 70;
   
//     constructor() {
//         super().loadImage("img/6_salsa_bottle/salsa_bottle.png");
//         this.x = 400 + Math.random() * 800; 
//     }
// }


// class Bottles extends DrawableObject {
//     static existingPositions = []; // Speichert die Positionen aller Bottles
    
//     y = 135;
//     height = 70;
//     width = 70;

  

//     constructor() {
//         super().loadImage("img/6_salsa_bottle/salsa_bottle.png");
//         this.x = this.createDistance(); // Generiere eine Position mit Mindestabstand
//     }

//     createDistance() {
//         const minDistance = 100; // Mindestabstand zwischen den Bottles
//         let newPosition;

//         do {
//             newPosition = 400 + Math.random() * 800; // Zufällige Position
//         } while (Bottles.existingPositions.some(pos => Math.abs(pos - newPosition) < minDistance)); // Überprüfen, ob die Position ausreichend Abstand hat
//         Bottles.existingPositions.push(newPosition); // Position in das bestehende Array pushen
//         return newPosition; // Gebe die gültige Position zurück
//     }
// }

// class Bottles extends DrawableObject {
//     static existingPositions = []; // Speichert die Positionen aller Bottles

//     y = 135;
//     height = 70;
//     width = 70;

//     constructor() {
//         super().loadImage("img/6_salsa_bottle/salsa_bottle.png");

//         const totalBottles = 5; // Gesamtanzahl der Bottles
//         const minDistance = 30; // Mindestabstand zwischen den Bottles
//         const rangeStart = 400; // Start des Bereichs
//         const rangeEnd = 1200; // Ende des Bereichs

//         // Berechne die maximal mögliche Spanne für eine Bottle
//         const step = (rangeEnd - rangeStart - (totalBottles - 1) * minDistance) / totalBottles;

//         // Zufällige Platzierung innerhalb der erlaubten Abschnitte
//         const index = Bottles.existingPositions.length; // Aktueller Bottle-Index
//         const basePosition = rangeStart + index * (step + minDistance); // Basisposition
//         this.x = basePosition + Math.random() * step; // Zufällige Verschiebung innerhalb des Schritts

//         Bottles.existingPositions.push(this.x); // Speichere die Position
//     }
// }

// class Bottles extends DrawableObject {
//     y = 135;
//     height = 70;
//     width = 70;

//     constructor(index, startX, maxX, numBottles) {
//         super().loadImage("img/6_salsa_bottle/salsa_bottle.png");

//         // Mindestabstand sicherstellen
//         const spacing = 100; // Mindestabstand
//         const segmentWidth = (maxX - startX) / numBottles;
//         this.x = startX + index * segmentWidth + Math.random() * (segmentWidth - spacing);
//     }
// }

// class Bottles extends DrawableObject {
//     y = 135;
//     height = 70;
//     width = 70;

//     constructor(index, minX, maxX, gap) {
//         super().loadImage("img/6_salsa_bottle/salsa_bottle.png");
//         this.x = minX + index * gap; // Abstand basierend auf Index und Gap
//     }
// }


// class Bottles extends DrawableObject {
//     y = 135;
//     height = 70;
//     width = 70;

//     constructor(index, minX, maxX, gap) {
//         super().loadImage("img/6_salsa_bottle/salsa_bottle.png");
//         const baseX = minX + index * gap; // Grundposition basierend auf Index und Gap
//         const randomOffset = Math.random() * (gap / 2) - (gap / 4); // Zufällige Verschiebung innerhalb von +/- gap/4
//         this.x = baseX + randomOffset; // Zufällige Position hinzufügen
//     }
// }

class Bottles extends DrawableObject {
    y = 135;
    height = 70;
    width = 70;

    constructor(x) {
        super().loadImage("img/6_salsa_bottle/salsa_bottle.png");
        this.x = x;
        this.y = 200 + Math.random() * 200;
        // this.x = minX + index * gap + Math.random() * (gap / 2) - (gap / 4); // Zufällige Position direkt berechnet
    }
}
