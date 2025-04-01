let buttontoPush = { x: 0.4, y: 0.5, width: 0.2, height: 0.1 };
let isMuted = false;
let mouseX, mouseY;

/**
 * Adds an event listener to the canvas to handle mouse clicks on buttons.
 */
function addButtonListener() {
  const canvas = document.getElementById("canvas");
  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width; 
    const scaleY = canvas.height / rect.height; 
    const mouseX = (event.clientX - rect.left) * scaleX; 
    const mouseY = (event.clientY - rect.top) * scaleY; 
    const buttonX = buttontoPush.x * canvas.width;
    const buttonY = buttontoPush.y * canvas.height;
    const buttonWidth = buttontoPush.width * canvas.width;
    const buttonHeight = buttontoPush.height * canvas.height;

    handleButtonClick(mouseX, mouseY, buttonX, buttonY, buttonWidth, buttonHeight);
  });
}

/**
 * Checks if a mouse click is within a button and performs the corresponding action.
 */
function handleButtonClick(mouseX, mouseY, buttonX, buttonY, buttonWidth, buttonHeight) {
  if (
    mouseX >= buttonX &&
    mouseX <= buttonX + buttonWidth &&
    mouseY >= buttonY &&
    mouseY <= buttonY + buttonHeight
  ) {
    if (gameState === "Start") {
      startGame();
    } else if (gameState === "Lose" || gameState === "Win") {
      world.resetGame();
    }
  }
}

/**
 * Initializes mute buttons and syncs state
 */
document.addEventListener("DOMContentLoaded", () => {
  isMuted = localStorage.getItem("isMuted") === "true" || false;
  updateMuteIcons();

  document.querySelectorAll(".mute-button").forEach(button => {
    button.onclick = () => {
      world.toggleMute();
      isMuted = !isMuted; 
      localStorage.setItem("isMuted", isMuted);
      updateMuteIcons(); 
    };
  });
  document.querySelectorAll(".guide-button").forEach(button => {
    button.onclick = toggleGuideControls;
  });
});

/**
 * Updates all mute icons based on the current isMuted state.
 */
function updateMuteIcons() {
  const iconPath = isMuted ? "img/icons/mute.png" : "img/icons/sound.png";
  document.getElementById("mute-icon-main").src = iconPath;
  const overlayIcon = document.getElementById("mute-icon-overlay");
  if (overlayIcon) overlayIcon.src = iconPath;
}

/**
 * Toggles the visibility of the controls container and updates the icons.
 */
function toggleGuideControls() {
  const controlsContainer = document.querySelector(".controls-container");
  controlsContainer.classList.toggle("d_none");
  const guideIconMain = document.getElementById("guide-icon-main");
  const guideIconOverlay = document.getElementById("guide-icon-overlay");
  const isHidden = controlsContainer.classList.contains("d_none");
  guideIconMain.src = isHidden ? "img/icons/controller3.png" : "img/icons/aktive-controller3.png";
  guideIconOverlay.src = guideIconMain.src;
}

/**
 * Toggles the mute status, updates the mute icons, and saves to localStorage.
 */
function toggleMuteState() {
  isMuted = !isMuted;
  localStorage.setItem("isMuted", isMuted); 
  updateMuteIcons(); 
}