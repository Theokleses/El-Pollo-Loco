function startGameListener(button) {
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;
        if (
           mouseX >= button.x &&
           mouseX <= button.x + button.width &&
           mouseY >= button.y &&
           mouseY <= button.y + button.height 
       ){
        if(gameState == "Start"){
        startGame();
        }
       }
      });
}