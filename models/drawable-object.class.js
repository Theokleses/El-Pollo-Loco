class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 120;
  y = 200;
  height = 150;
  width = 100;

  // loadImage('img/test.pgn');
  loadImage(path) {
    this.img = new Image(); // this.img = document.getElementById('image') <img id="image" src>
    this.img.src = path;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    //   if(this instanceof Character || this instanceof Chicken || this instanceof Coins || this instanceof Bottles) {
    //   ctx.beginPath();
    //   ctx.lineWidth = "1";
    //   ctx.strokeStyle = "blue";
    //   ctx.rect(this.x, this.y, this.width, this.height);
    //   ctx.stroke();
    // }
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  // drawButton(ctx, x, y, width, height, text, style = {}) {
  //   ctx.fillStyle = style.backgroundColor || "rgba(0, 0, 0, 0.8)";
  //   ctx.fillRect(x, y, width, height);
  //   ctx.fillStyle = style.textColor || "white";
  //   ctx.font = style.font || "20px Arial";
  //   ctx.textAlign = "center";
  //   ctx.fillText(text, x + width / 2, y + height / 2 + 7);
  // }
  //   drawButton(ctx, x, y, width, height, text, style = {}) {
  //     ctx.fillStyle = style.backgroundColor || "#FFCC00"; // Gelb des "O"
  //     ctx.beginPath();
  //     ctx.roundRect(x, y, width, height, 10); // 10 ist der Border-Radius
  //     ctx.fill();
  //     ctx.fillStyle = style.textColor || "white";
  //     ctx.font = style.font || "20px Arial";
  //     ctx.textAlign = "center";
  //     ctx.fillText(text, x + width / 2, y + height / 2 + 7);
  // }

  drawButton(ctx, x, y, width, height, text, style = {}, isHovered = false) {
    ctx.fillStyle = isHovered
      ? style.hoverBackgroundColor || "#CC7A00"
      : style.backgroundColor || "#FFCC00";
    if (isHovered) {this.applyHoverEffect(ctx, x, y, width, height);}
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 10);
    ctx.fill();
    ctx.strokeStyle = "#CC7A00"; 
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.fillStyle = style.textColor || "white";
    ctx.font = style.font || "30px Bangers";
    ctx.textAlign = "center";
    const textOffset = isHovered ? 11.3 : 10;
    ctx.fillText(text, x + width / 2, y + height / 2 + textOffset);
    if (isHovered) {ctx.restore();}
  }

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

  isMouseOverButton(
    mouseX,
    mouseY,
    buttonX,
    buttonY,
    buttonWidth,
    buttonHeight
  ) {
    return (
      mouseX >= buttonX &&
      mouseX <= buttonX + buttonWidth &&
      mouseY >= buttonY &&
      mouseY <= buttonY + buttonHeight
    );
  }
}
