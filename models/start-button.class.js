class StartButton extends DrawableObject{
    x = 270;
    y = 60;
    width = 180;
    height = 50;
}

// class StartButton extends DrawableObject {
//     x = 270;  // Standard-Position
//     y = 60;
//     width = 180;
//     height = 50;

//     constructor() {
//         super();
//         this.updatePosition();  // Position beim ersten Laden der Seite anpassen
//     }

//     updatePosition() {
//         const windowWidth = window.innerWidth;

//         // Wenn die Fensterbreite kleiner als 600px ist, verschiebe den Button nach links
//         if (windowWidth <= 600) {
//             // Berechne die Verschiebung auf der X-Achse basierend auf der Fenstergröße
//             this.x = 270 - (600 - windowWidth) * 0.5;  // Der Faktor 0.5 steuert, wie stark der Button verschoben wird
//         } else {
//             this.x = 270;  // Standard-Position für größere Fenster
//         }
//     }
// }