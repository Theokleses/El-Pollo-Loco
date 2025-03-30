class UIHelper {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
    }

    /**
    * Draws a circular button base with hover effects using canvas context.
    */
    drawButtonBase(cx, cy, r, hovered) {
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r + 2, 0, Math.PI*2);
        this.ctx.strokeStyle = '#CC7A00';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, 0, Math.PI*2);
        this.ctx.fillStyle = hovered ? '#CC7A00' : '#FFCC00';
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r - 1.5, 0, Math.PI*2);
        this.ctx.strokeStyle = hovered ? '#FF9900' : '#FFE066';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      }

    /**
    * Draws a house icon with roof, window, door, and doorknob using canvas context.
    * Adjusts colors and sizes dynamically based on canvas and hover state.
    */  
    drawHouseIcon(cx, cy, hovered) {
        const iconSize = this.canvas.width * BACK_BUTTON_CONFIG.iconSize * 1.5;
        const houseWidth = iconSize * 0.8;
        const houseHeight = iconSize * 0.6;
        const verticalOffset = iconSize * 0.1;
        const houseBottom = cy + houseHeight/2 + verticalOffset;
      
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy-iconSize/2 + verticalOffset);
        this.ctx.lineTo(cx+iconSize/2, cy-iconSize/6 + verticalOffset);
        this.ctx.lineTo(cx-iconSize/2, cy-iconSize/6 + verticalOffset);
        this.ctx.closePath();
        this.ctx.fill(); 
        this.ctx.fillRect(cx+iconSize/6, cy-iconSize/2 + verticalOffset, iconSize/8, iconSize/6);
        this.ctx.fillRect(cx-houseWidth/2, cy-houseHeight/2 + verticalOffset, houseWidth, houseHeight); 
        this.ctx.fillStyle = '#A0D8FF';
        this.ctx.fillRect(cx-houseWidth/3, cy-houseHeight/4 + verticalOffset, houseWidth/4, houseWidth/4); 
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(cx+houseWidth/8, houseBottom-houseHeight/1.8, houseWidth/6, houseHeight/1.8); 
        this.ctx.fillStyle = 'gold';
        this.ctx.beginPath();
        this.ctx.arc(cx+houseWidth/5.5, houseBottom-houseHeight/3.6, iconSize/25, 0, Math.PI*2);
        this.ctx.fill();
      }

    /**
    * Checks if the mouse position is within a rectangular area.
    * Returns true if the mouse is over the specified region, false otherwise.
    */  
    isMouseOver(mouseX, mouseY, x, y, width, height) {
        return mouseX >= x && mouseX <= x + width && mouseY >= y && mouseY <= y + height;
    }

    /**
    * Calculates the center coordinates and radius of a button based on config and canvas size.
    * Returns an object with cx (x-center), cy (y-center), and r (radius).
    */
    getButtonCenter(config) {
        return {
            cx: this.canvas.width * (config.x + config.width/2),
            cy: this.canvas.height * (config.y + config.height/2),
            r: this.canvas.width * config.width/2
        };
    }

    /**
    * Checks if a mouse click is within a circular button area based on config.
    */
    isButtonClicked(mouseX, mouseY, config) {
        const center = this.getButtonCenter(config);
        const distance = Math.sqrt(Math.pow(mouseX - center.cx, 2) + Math.pow(mouseY - center.cy, 2));
        return distance <= center.r;
    }

    /**
    * Renders a rectangular button with text and hover state on the canvas.
    */
    renderButton(screen, config, buttonText, style = {}, mouseX, mouseY) {
        const absX = config.x * this.canvas.width;
        const absY = config.y * this.canvas.height;
        const isHovered = this.isMouseOver(mouseX, mouseY, absX, absY, config.width * this.canvas.width, config.height * this.canvas.height);
        screen.drawButton(this.ctx, config.x, config.y, config.width, config.height, buttonText, style, isHovered);
        return isHovered;
    }
}