let buttontoPush = "";
function addButtonListener() {
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
         mouseX = event.clientX - rect.left;
         mouseY = event.clientY - rect.top;
        if (
            mouseX >= buttontoPush.x &&
            mouseX <= buttontoPush.x  + buttontoPush.width && 
            mouseY >= buttontoPush.y  &&
            mouseY <= buttontoPush.y  + buttontoPush.height 
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
    const muteButton = document.getElementById("muteButton");
    muteButton.addEventListener("click", () => {
        world.toggleMute();
    });
 });


document.addEventListener('DOMContentLoaded', () => {
    const toggleButtons = document.querySelectorAll('.toggle-button');
    toggleButtons.forEach(button => {
      button.addEventListener('click', () => {
        if (button.textContent === 'Guide') {
          document.getElementById('game-controls').classList.toggle('d_none');
          document.getElementById('instruction-details').classList.toggle('d_none');
        } else if (button.textContent === 'Sound') {
          isMuted = !isMuted;
          console.log(isMuted ? "Sound is muted" : "Sound is unmuted");
        }
      });
    });
  });
  

