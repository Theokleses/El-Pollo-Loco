let canvas;
let world;
let keyboard = new Keyboard();
let gameState = "Start";

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    addButtonListener();
    console.log('My Charachter is', world.character);
}

function startGame() {
   gameState = "Game";
   world.setWorld();
}
// function startNewGame() {
//    // world = null;
//    world = new World(canvas, keyboard);
//    gameState = "Game";
//    world.setWorld();
// }
function startNewGame() {
   if (world) {
       world.stopAllIntervals(); // Stoppe alle Intervalle im alten world
   }
   world = new World(canvas, keyboard); // Neues World-Objekt
   gameState = "Game";
   world.setWorld();
}