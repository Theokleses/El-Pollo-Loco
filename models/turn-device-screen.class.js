class TurnDeviceScreen extends DrawableObject {
    IMAGES_IDLE_LONG = [
      "img/2_character_pepe/1_idle/long_idle/I-11.png",
      "img/2_character_pepe/1_idle/long_idle/I-12.png",
      "img/2_character_pepe/1_idle/long_idle/I-13.png",
      "img/2_character_pepe/1_idle/long_idle/I-14.png",
      "img/2_character_pepe/1_idle/long_idle/I-15.png",
      "img/2_character_pepe/1_idle/long_idle/I-16.png",
      "img/2_character_pepe/1_idle/long_idle/I-17.png",
      "img/2_character_pepe/1_idle/long_idle/I-18.png",
      "img/2_character_pepe/1_idle/long_idle/I-19.png",
      "img/2_character_pepe/1_idle/long_idle/I-20.png",
    ];
  
    constructor() {
      super();
      this.loadImages(this.IMAGES_IDLE_LONG); 
      this.currentImageIndex = 0;
      this.element = document.querySelector(".turn-device-screen"); 
      this.animate(); 
    }
  
    animate() {
      setInterval(() => {
        this.element.style.backgroundImage = `url(${this.IMAGES_IDLE_LONG[this.currentImageIndex]})`;
        this.element.style.backgroundSize = "contain";
        this.element.style.backgroundRepeat = "no-repeat"; 
        this.element.style.backgroundPosition = "center";
        this.currentImageIndex = (this.currentImageIndex + 1) % this.IMAGES_IDLE_LONG.length; 
      }, 125);
    }
  }