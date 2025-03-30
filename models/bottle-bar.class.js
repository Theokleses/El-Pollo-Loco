class BottleBar extends DrawableObject {
  IMAGES = [
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png",
  ];

  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.width = 200;
    this.height = 60;
    this.x = 40;
    this.y = 50;
    this.setBottlePercentage(0);
  }

  /**
   * Sets the percentage of the bottle and updates the displayed image.
   */
  setBottlePercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }
}
