class DrawableObject{
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
 
    drawButton(ctx, x, y, width, height, text, style = {}) {
      ctx.fillStyle = style.backgroundColor || "rgba(0, 0, 0, 0.8)";
      ctx.fillRect(x, y, width, height);
      ctx.fillStyle = style.textColor || "white";
      ctx.font = style.font || "20px Arial";
      ctx.textAlign = "center";
      ctx.fillText(text, x + width / 2, y + height / 2 + 7);
    }

}
