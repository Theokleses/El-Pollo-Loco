let canvas;
let world;
let keyboard = new Keyboard();
let gameState = "Start";

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  localStorage.setItem('isMuted', 'false');
  addButtonListener();
  console.log("My Charachter is", world.character);
}
function setLocalSound() {
  localStorage.setItem("isMuted", false);
}
function startGame() {
  gameState = "Game";
  world.setWorld();
}

function deleteWorld() {
  world = null;
}

function checkSoundMuted() {
  return localStorage.getItem("isMuted") == "true" ? true : false;
}

function startNewGame() {
  if (world) {
    world.stopAllIntervals(); 
  }
  deleteWorld();
  world = new World(canvas, keyboard); 
  gameState = "Game";
  world.setWorld();
}
