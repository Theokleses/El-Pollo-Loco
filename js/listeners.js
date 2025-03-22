// let buttontoPush = "";
// let isMuted = false;
// function addButtonListener() {
//   canvas.addEventListener("click", (event) => {
//     const rect = canvas.getBoundingClientRect();
//     mouseX = event.clientX - rect.left;
//     mouseY = event.clientY - rect.top;
//     if (
//       mouseX >= buttontoPush.x &&
//       mouseX <= buttontoPush.x + buttontoPush.width &&
//       mouseY >= buttontoPush.y &&
//       mouseY <= buttontoPush.y + buttontoPush.height
//     ) {
//       if (gameState == "Start") {
//         startGame();
//       } else if (gameState == "Lose") {
//         world.resetGame();
//       } else if (gameState == "Win") {
//         world.resetGame();
//       }
//     }
//   });
// }
let buttontoPush = {
  x: 0.4, // 40% der Canvas-Breite
  y: 0.5, // 50% der Canvas-Höhe
  width: 0.2, // 20% der Breite
  height: 0.1, // 10% der Höhe
};
let isMuted = false;
let mouseX, mouseY;

function addButtonListener() {
  const canvas = document.getElementById("canvas");
  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    // Skaliere die Mauskoordinaten basierend auf der tatsächlichen Canvas-Größe
    const scaleX = canvas.width / rect.width; // Verhältnis interne Breite zu sichtbarer Breite
    const scaleY = canvas.height / rect.height; // Verhältnis interne Höhe zu sichtbarer Höhe
    mouseX = (event.clientX - rect.left) * scaleX; // Angepasste X-Koordinate
    mouseY = (event.clientY - rect.top) * scaleY; // Angepasste Y-Koordinate

    // Berechne die absoluten Button-Koordinaten basierend auf der Canvas-Größe
    const buttonX = buttontoPush.x * canvas.width;
    const buttonY = buttontoPush.y * canvas.height;
    const buttonWidth = buttontoPush.width * canvas.width;
    const buttonHeight = buttontoPush.height * canvas.height;

    if (
      mouseX >= buttonX &&
      mouseX <= buttonX + buttonWidth &&
      mouseY >= buttonY &&
      mouseY <= buttonY + buttonHeight
    ) {
      if (gameState === "Start") {
        startGame();
      } else if (gameState === "Lose") {
        world.resetGame();
      } else if (gameState === "Win") {
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

