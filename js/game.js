let canvas;
let world;
let keyboard = new Keyboard();
let gameState = "Start";

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);

    console.log('My Charachter is', world.character);
}

function startGame() {
   gameState = "Game";
   world.setWorld();
   
}

window.addEventListener('keydown', (event) =>{
   console.log(event.keyCode);
   
     if(event.keyCode == 39) {
        keyboard.RIGHT = true;
     }
     if(event.keyCode == 37) {
        keyboard.LEFT = true;
     }
     if(event.keyCode == 38) {
        keyboard.UP = true;
     }
     if(event.keyCode == 40) {
        keyboard.DOWN = true;
     }
     if(event.keyCode == 32) {
        keyboard.SPACE = true;
     }
     if (event.keyCode == 68) {
         keyboard.D = true;
     }

});

window.addEventListener('keyup', (event) =>{
    if(event.keyCode == 39) {
       keyboard.RIGHT = false;
    }
    if(event.keyCode == 37) {
       keyboard.LEFT = false;
    }
    if(event.keyCode == 38) {
       keyboard.UP = false;
    }
    if(event.keyCode == 40) {
       keyboard.DOWN = false;
    }
    if(event.keyCode == 32) {
       keyboard.SPACE = false;
    }
    if (event.keyCode == 68) {
       keyboard.D = false;
  }

});