class EndbossBar extends DrawableObject {
  IMAGES = [
    "img/7_statusbars/2_statusbar_endboss/green/green0.png",
    "img/7_statusbars/2_statusbar_endboss/green/green20.png",
    "img/7_statusbars/2_statusbar_endboss/green/green40.png",
    "img/7_statusbars/2_statusbar_endboss/green/green60.png",
    "img/7_statusbars/2_statusbar_endboss/green/green80.png",
    "img/7_statusbars/2_statusbar_endboss/green/green100.png",
  ];

  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.width = 200;
    this.height = 60;
    this.x = 470;
    this.y = 0;
    this.setBossPercentage(100);
  }
  
  /**
   * Sets the boss health percentage and updates the displayed image.
   */
  setBossPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Determines the image index based on the current boss health percentage.
   */
  // resolveImageIndex() {
  //   if (this.percentage == 100) {
  //     return 5;
  //   } else if (this.percentage >= 80) {
  //     return 4;
  //   } else if (this.percentage >= 60) {
  //     return 3;
  //   } else if (this.percentage >= 40) {
  //     return 2;
  //   } else if (this.percentage >= 20) {
  //     return 1;
  //   } else {
  //     return 0;
  //   }
  // }
}
