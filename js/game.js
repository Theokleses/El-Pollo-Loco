let canvas;
let world;
let keyboard = new Keyboard();
let gameState = "Start";
let isFullScreen = false;
/**
 * Initializes the game by retrieving the canvas element and creating a new world.
 */
function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  addButtonListener();
  turnDeviceScreen = new TurnDeviceScreen();
   handleFullscreenChange();
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

/** 
 * Toggles fullscreen mode
 */
function toggleFullscreen() {
  const fullscreenElement = document.getElementById("fullscreen");
  if (!isFullScreen) {
      document.getElementById("canvas").classList.add("fullscreen");
      enterFullscreen(fullscreenElement);
  } else {
        exitFullscreen();
  }
}

/** 
 * Enter fullscreen mode
 */
function enterFullscreen(element) {
  if (element.requestFullscreen) {
      element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
  }
  isFullScreen = true;
}

/** 
 * Exit fullscreen mode
 */
function exitFullscreen() {
  if (document.exitFullscreen) {
      document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
  }
  isFullScreen = false;
}

/** 
 * Handles fullscreen change
 */
function handleFullscreenChange(callback) {
  document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
          document.getElementById("canvas").classList.remove("fullscreen");
          if (callback) callback();
      }
  });
}

/** 
 * Checks if device is mobile/tablet based on orientation or screen width
 */
function isMobileOrTablet() {
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;
    const isSmallScreen = window.innerWidth <= 1370;
    return isPortrait || isSmallScreen;
}

