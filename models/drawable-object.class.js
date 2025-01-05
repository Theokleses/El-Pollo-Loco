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
  
    // drawFrame(ctx) {
    //     if(this instanceof Character || this instanceof Chicken || this instanceof Coins || this instanceof Bottles) {
    //     ctx.beginPath();
    //     ctx.lineWidth = "1";  
    //     ctx.strokeStyle = "blue";
    //     ctx.rect(this.x, this.y, this.width, this.height);
    //     ctx.stroke();
    //   }
    // }
  
    drawFrame(ctx) {
      if (this instanceof Character || this instanceof Chicken || this instanceof BigChicken || this instanceof Coins || this instanceof Bottles || this instanceof ThrowableObject || this instanceof Endboss) {
        ctx.beginPath();
        ctx.lineWidth = "1";  
        ctx.strokeStyle = this.isCollidingWithAny() ? "red" : "blue";  // Rot, wenn eine Kollision vorliegt, sonst Blau
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
      }
    }
    
    // Neue Methode, die prüft, ob eine Kollision vorliegt
    isCollidingWithAny() {
      // Hier kannst du die Kollisionslogik einfügen, um zu prüfen, ob das Objekt mit einem anderen kollidiert
      // Zum Beispiel, überprüfe, ob das Objekt mit einem Chicken kollidiert:
      if (this instanceof Character) {
        return this.world.level.enemies.some(enemy => this.isColliding(enemy));
      }
      return false;
    }
    

    loadImages(arr) {
        arr.forEach((path) => {
        let img = new Image();
        img.src = path;
        this.imageCache[path] = img;
        });
    }
 
    drawButton(ctx, x, y, width, height, text, style = {}) {
      // Button-Hintergrund zeichnen
      ctx.fillStyle = style.backgroundColor || "rgba(0, 0, 0, 0.8)";
      ctx.fillRect(x, y, width, height);

      // Button-Text zeichnen
      ctx.fillStyle = style.textColor || "white";
      ctx.font = style.font || "20px Arial";
      ctx.textAlign = "center";
      ctx.fillText(text, x + width / 2, y + height / 2 + 7);
    }

}
