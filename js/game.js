let canvas;
let world;
let keyboard = new Keyboard();
let gameState = "Start";

/**
 * Initializes the game by retrieving the canvas element and creating a new world.
 */
function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  addButtonListener();
  turnDeviceScreen = new TurnDeviceScreen();
}

/**
 * Sets the local sound status to unmuted.
 */
function setLocalSound() {
  localStorage.setItem("isMuted", false);
}

/**
 * Starts the game and sets the game state to "Game".
 */
function startGame() {
  gameState = "Game";
  world.setWorld();
}

/**
 * Deletes the current game world by setting it to null
 */
function deleteWorld() {
  world = null;
}

/**
 * Checks if the sound is muted.
 * @returns {boolean} True if the sound is muted, otherwise false
 */
function checkSoundMuted() {
  return localStorage.getItem("isMuted") == "true" ? true : false;
}

/**
 * Starts a new game by deleting the old world and creating a new one.
 */
function startNewGame() {
  if (world) {
    world.stopAllIntervals(); 
  }
  deleteWorld();
  world = new World(canvas, keyboard); 
  gameState = "Game";
  world.setWorld();
}