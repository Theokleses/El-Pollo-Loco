let buttontoPush = "";
let isMuted = false;
function addButtonListener() {
  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
    if (
      mouseX >= buttontoPush.x &&
      mouseX <= buttontoPush.x + buttontoPush.width &&
      mouseY >= buttontoPush.y &&
      mouseY <= buttontoPush.y + buttontoPush.height
    ) {
      if (gameState == "Start") {
        startGame();
      } else if (gameState == "Lose") {
        world.resetGame();
      } else if (gameState == "Win") {
        world.resetGame();
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const muteButtons = document.querySelectorAll(".mute-button");
  muteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      world.toggleMute();
    });
  });

  const toggleButtons = document.querySelectorAll(".toggle-button");
  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.classList.contains("guide-button")) {
        const controlsContainer = document.querySelector(".controls-container");
        controlsContainer.classList.toggle("d_none");

        const guideIconMain = document.getElementById("guide-icon-main");
        const guideIconOverlay = document.getElementById("guide-icon-overlay");

        if (controlsContainer.classList.contains("d_none")) {
          guideIconMain.src = "img/icons/controller3.png";
          guideIconOverlay.src = "img/icons/controller3.png";
        } else {
          guideIconMain.src = "img/icons/aktive-controller3.png";
          guideIconOverlay.src = "img/icons/aktive-controller3.png";
        }
      } else if (button.classList.contains("mute-button")) {
        isMuted = !isMuted;
        console.log(isMuted ? "Sound is muted" : "Sound is unmuted");
        const muteIconMain = document.getElementById("mute-icon-main");
        const muteIconOverlay = document.getElementById("mute-icon-overlay");
        if (isMuted) {
          muteIconMain.src = "img/icons/mute.png";
          muteIconOverlay.src = "img/icons/mute.png";
        } else {
          muteIconMain.src = "img/icons/sound.png";
          muteIconOverlay.src = "img/icons/sound.png";
        }
      }
    });
  });
});

