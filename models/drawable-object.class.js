class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x; 
  y;
  height;
  width;

/**
 * Loads an image from the specified path.
 */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

/**
 * Draws the object's image on the canvas.
 */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

/**
 * Draws a frame around the object for debugging (currently commented out).
 */
  drawFrame(ctx) {
    // if (this instanceof Character || this instanceof Chicken || this instanceof Coins || this instanceof Bottles || this instanceof Endboss) {
    //   ctx.beginPath();
    //   ctx.lineWidth = "1";
    //   ctx.strokeStyle = "blue";
    //   ctx.rect(this.x, this.collisionY || this.y, this.width, this.collisionHeight || this.height);
    //   ctx.stroke();
  
    //   // Bein-Zone visualisieren
    //   if (this instanceof Character) {
    //     const legsY = (this.collisionY || this.y) + (this.collisionHeight || this.height) * 0.8;
    //     const legsHeight = (this.collisionHeight || this.height) * 0.2;
    //     ctx.beginPath();
    //     ctx.strokeStyle = "green"; 
    //     ctx.rect(this.x, legsY, this.width, legsHeight);
    //     ctx.stroke();
    //   }
    // }
  }

 /**
 * Loads multiple images into the image cache.
 */ 
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
  
/**
 * Draws a button on the canvas with hover effects.
 */
drawButton(ctx, x, y, width, height, text, style = {}, isHovered = false) {
  const canvasWidth = ctx.canvas.width, canvasHeight = ctx.canvas.height;
  this.x = x * canvasWidth; this.y = y * canvasHeight;
  this.width = width * canvasWidth; this.height = height * canvasHeight;
  ctx.fillStyle = isHovered ? style.hoverBackgroundColor || "#CC7A00" : style.backgroundColor || "#FFCC00";
  if (isHovered) this.applyHoverEffect(ctx, this.x, this.y, this.width, this.height);
  this.drawButtonShape(ctx);
  this.drawButtonText(ctx, text, style, isHovered);
  if (isHovered) ctx.restore();
}

/**
 * Draws the button shape with border.
 */
drawButtonShape(ctx) {
  ctx.beginPath();
  ctx.roundRect(this.x, this.y, this.width, this.height, 10);
  ctx.fill();
  ctx.strokeStyle = "#CC7A00";
  ctx.lineWidth = 5;
  ctx.stroke();
}

/**
 * Draws the button text with styling.
 */
drawButtonText(ctx, text, style, isHovered) {
  ctx.fillStyle = style.textColor || "white";
  ctx.font = style.font || "30px Bangers";
  ctx.textAlign = "center";
  ctx.fillText(text, this.x + this.width / 2, this.y + this.height / 2 + (isHovered ? 11.3 : 10));
}
/**
 * Applies a hover effect to the canvas context.
 */
  applyHoverEffect(ctx, x, y, width, height) {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    ctx.scale(1.1, 1.1);
    ctx.translate(-(x + width / 2), -(y + height / 2));
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
  }
/**
 * Checks if the mouse is over the button area.
 */
  isMouseOverButton(mouseX, mouseY, buttonX, buttonY, buttonWidth, buttonHeight) {
    return (
      mouseX >= buttonX &&
      mouseX <= buttonX + buttonWidth &&
      mouseY >= buttonY &&
      mouseY <= buttonY + buttonHeight
    );
  }
}