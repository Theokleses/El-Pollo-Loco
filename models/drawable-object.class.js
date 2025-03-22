// class DrawableObject {
//   img;
//   imageCache = {};
//   currentImage = 0;
//   x = 120;
//   y = 200;
//   height = 150;
//   width = 100;

//   // loadImage('img/test.pgn');
//   loadImage(path) {
//     this.img = new Image(); // this.img = document.getElementById('image') <img id="image" src>
//     this.img.src = path;
//   }

//   draw(ctx) {
//     ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
//   }

//   drawFrame(ctx) {
//     //   if(this instanceof Character || this instanceof Chicken || this instanceof Coins || this instanceof Bottles) {
//     //   ctx.beginPath();
//     //   ctx.lineWidth = "1";
//     //   ctx.strokeStyle = "blue";
//     //   ctx.rect(this.x, this.y, this.width, this.height);
//     //   ctx.stroke();
//     // }
//   }

//   loadImages(arr) {
//     arr.forEach((path) => {
//       let img = new Image();
//       img.src = path;
//       this.imageCache[path] = img;
//     });
//   }

//   // drawButton(ctx, x, y, width, height, text, style = {}) {
//   //   ctx.fillStyle = style.backgroundColor || "rgba(0, 0, 0, 0.8)";
//   //   ctx.fillRect(x, y, width, height);
//   //   ctx.fillStyle = style.textColor || "white";
//   //   ctx.font = style.font || "20px Arial";
//   //   ctx.textAlign = "center";
//   //   ctx.fillText(text, x + width / 2, y + height / 2 + 7);
//   // }
//   //   drawButton(ctx, x, y, width, height, text, style = {}) {
//   //     ctx.fillStyle = style.backgroundColor || "#FFCC00"; // Gelb des "O"
//   //     ctx.beginPath();
//   //     ctx.roundRect(x, y, width, height, 10); // 10 ist der Border-Radius
//   //     ctx.fill();
//   //     ctx.fillStyle = style.textColor || "white";
//   //     ctx.font = style.font || "20px Arial";
//   //     ctx.textAlign = "center";
//   //     ctx.fillText(text, x + width / 2, y + height / 2 + 7);
//   // }

//   drawButton(ctx, x, y, width, height, text, style = {}, isHovered = false) {
//     ctx.fillStyle = isHovered
//       ? style.hoverBackgroundColor || "#CC7A00"
//       : style.backgroundColor || "#FFCC00";
//     if (isHovered) {this.applyHoverEffect(ctx, x, y, width, height);}
//     ctx.beginPath();
//     ctx.roundRect(x, y, width, height, 10);
//     ctx.fill();
//     ctx.strokeStyle = "#CC7A00"; 
//     ctx.lineWidth = 5;
//     ctx.stroke();

//     ctx.fillStyle = style.textColor || "white";
//     ctx.font = style.font || "30px Bangers";
//     ctx.textAlign = "center";
//     const textOffset = isHovered ? 11.3 : 10;
//     ctx.fillText(text, x + width / 2, y + height / 2 + textOffset);
//     if (isHovered) {ctx.restore();}
//   }

//   applyHoverEffect(ctx, x, y, width, height) {
//     ctx.save();
//     ctx.translate(x + width / 2, y + height / 2); 
//     ctx.scale(1.1, 1.1); 
//     ctx.translate(-(x + width / 2), -(y + height / 2)); 
//     ctx.shadowColor = "rgba(0, 0, 0, 0.5)"; 
//     ctx.shadowBlur = 10; 
//     ctx.shadowOffsetX = 5; 
//     ctx.shadowOffsetY = 5; 
//   }

//   isMouseOverButton(
//     mouseX,
//     mouseY,
//     buttonX,
//     buttonY,
//     buttonWidth,
//     buttonHeight
//   ) {
//     return (
//       mouseX >= buttonX &&
//       mouseX <= buttonX + buttonWidth &&
//       mouseY >= buttonY &&
//       mouseY <= buttonY + buttonHeight
//     );
//   }
// }


class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  // Entferne feste Werte für x, y, width, height - diese setzen wir jetzt dynamisch
  x; // Wird später gesetzt
  y;
  height;
  width;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    // Dein bestehender Code bleibt unverändert
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  drawButton(ctx, x, y, width, height, text, style = {}, isHovered = false) {
    // Dynamische Position und Größe relativ zur Canvas-Größe
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    this.x = x * canvasWidth; // z. B. x = 0.4 bedeutet 40% der Breite
    this.y = y * canvasHeight; // z. B. y = 0.5 bedeutet 50% der Höhe
    this.width = width * canvasWidth; // z. B. width = 0.2 bedeutet 20% der Breite
    this.height = height * canvasHeight; // z. B. height = 0.1 bedeutet 10% der Höhe

    ctx.fillStyle = isHovered
      ? style.hoverBackgroundColor || "#CC7A00"
      : style.backgroundColor || "#FFCC00";
    if (isHovered) {
      this.applyHoverEffect(ctx, this.x, this.y, this.width, this.height);
    }
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, 10);
    ctx.fill();
    ctx.strokeStyle = "#CC7A00";
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.fillStyle = style.textColor || "white";
    ctx.font = style.font || "30px Bangers";
    ctx.textAlign = "center";
    const textOffset = isHovered ? 11.3 : 10;
    ctx.fillText(text, this.x + this.width / 2, this.y + this.height / 2 + textOffset);
    if (isHovered) {
      ctx.restore();
    }
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

  isMouseOverButton(mouseX, mouseY, buttonX, buttonY, buttonWidth, buttonHeight) {
    return (
      mouseX >= buttonX &&
      mouseX <= buttonX + buttonWidth &&
      mouseY >= buttonY &&
      mouseY <= buttonY + buttonHeight
    );
  }
}