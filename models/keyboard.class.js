class Keyboard {
  LEFT = false;
  RIGHT = false;
  UP = false;
  DOWN = false;
  SPACE = false;
  D = false;

  constructor() {
    this.bindKeyPressEvents();
    this.bindBtsPressEvents();
  }

  /**
   * Binds key press events to the keyboard object for game controls.
   */
    bindKeyPressEvents() {
        window.addEventListener("keydown", (event) => {
          if (event.keyCode == 39) {keyboard.RIGHT = true;}
          if (event.keyCode == 37) {keyboard.LEFT = true;}
          if (event.keyCode == 38) {keyboard.UP = true;}
          if (event.keyCode == 40) {keyboard.DOWN = true;}
          if (event.keyCode == 32) {keyboard.SPACE = true;}
          if (event.keyCode == 68) {keyboard.D = true;}
        });
    
        window.addEventListener("keyup", (event) => {
          if (event.keyCode == 39) {keyboard.RIGHT = false;}
          if (event.keyCode == 37) {keyboard.LEFT = false;}
          if (event.keyCode == 38) {keyboard.UP = false;}
          if (event.keyCode == 40) {keyboard.DOWN = false;}
          if (event.keyCode == 32) {keyboard.SPACE = false;}
          if (event.keyCode == 68) {keyboard.D = false;}
        });
      }

  /**
   * Binds touch events to on-screen buttons for mobile controls.
   */
  bindBtsPressEvents() {
    const btnLeft = document.getElementById("btnLeft");
    const btnRight = document.getElementById("btnRight");
    const btnJump = document.getElementById("btnJump");
    const btnThrow = document.getElementById("btnThrow");

    if (btnLeft) {
      btnLeft.addEventListener("touchstart", (event) => {event.preventDefault();this.LEFT = true;});
      btnLeft.addEventListener("touchend", (event) => {event.preventDefault();this.LEFT = false;});
    }

    if (btnRight) {
      btnRight.addEventListener("touchstart", (event) => {event.preventDefault();this.RIGHT = true;});
      btnRight.addEventListener("touchend", (event) => {event.preventDefault();this.RIGHT = false;});
    }

    if (btnJump) {
      btnJump.addEventListener("touchstart", (event) => {event.preventDefault();this.UP = true;});
      btnJump.addEventListener("touchend", (event) => {event.preventDefault();this.UP = false;});
    }

    if (btnThrow) {
      btnThrow.addEventListener("touchstart", (event) => {event.preventDefault();this.D = true;});
      btnThrow.addEventListener("touchend", (event) => {event.preventDefault();this.D = false;});
    }
  }
}
