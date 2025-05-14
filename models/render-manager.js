class RenderManager {
    constructor(ctx, world) {
        this.ctx = ctx;
        this.world = world;
        this.canvas = world.canvas
    }

    /**
     * Draws background elements and status bars
     */
    drawBackgroundAndBars() {
        this.ctx.translate(this.world.camera_x, 0);
        this.world.addObjectToMap(this.world.level.backgroundObjects);
        this.ctx.translate(-this.world.camera_x, 0);
        this.world.addObjectToMap(this.world.level.clouds);
        this.world.addToMap(this.world.statusBar);
        this.world.addToMap(this.world.coinBar);
        this.world.addToMap(this.world.bottleBar);
        if (this.world.reachEndBoss && this.world.endboss) {
            this.world.addToMap(this.world.endbossBar);
        }
    }

    /**
     * Draws all interactive game objects
     */
    drawInteractiveObjects() {
        this.ctx.translate(this.world.camera_x, 0);
        
        if (this.world.character) {
            Object.assign(this.world.character, {x: this.world.character.x || 1, y: this.world.character.y || 85, width: this.world.character.width || 120, height: this.world.character.height || 235, world: this.world
            });
            
            if (!this.world.character.animationStarted) {
                this.world.character.startAnimation();
                this.world.character.animationStarted = true;
            }
            this.world.addToMap(this.world.character);
        }
        this.world.addObjectToMap(this.world.level.coins);
        this.world.addObjectToMap(this.world.level.bottles);
        this.world.addToMap(this.world.permanentBottle);
        this.world.permanentBottle.drawText(this.ctx);
        this.world.addObjectToMap(this.world.level.enemies);
        this.world.addObjectToMap(this.world.throwableObjects);
        this.ctx.translate(-this.world.camera_x, 0);
    }

    /**
     * Draws all interactive game objects
     */
    renderFullscreenButton(mouseX, mouseY) {  
        if (this.isMobileOrTablet()) {
        return false; // Kein Hover, Button wird nicht angezeigt
        }

        const { x, y, width, height } = FULLSCREEN_BUTTON_CONFIG;
        const absX = x * this.canvas.width;
        const absY = y * this.canvas.height;
        const absW = width * this.canvas.width;
        const absH = height * this.canvas.height;
        
        // Use the same calculation as in isFullscreenButtonClicked()
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const adjustedX = mouseX * scaleX;
        const adjustedY = mouseY * scaleY;
        
        const hovered = adjustedX >= absX && adjustedX <= absX + absW &&
                        adjustedY >= absY && adjustedY <= absY + absH;
        
        // Rest of the drawing code remains exactly the same...
        this.ctx.fillStyle = hovered ? '#CC7A00' : 'rgba(255, 255, 255, 0.4)';
        this.ctx.strokeStyle = '#FFCC00';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.roundRect(absX, absY, absW, absH, 5);
        this.ctx.fill();
        this.ctx.stroke();
        
        const iconSize = Math.min(absW, absH) * 0.5;
        const iconX = absX + absW / 2;
        const iconY = absY + absH / 2;
        
        this.ctx.strokeStyle = '#FFCC00';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(iconX - iconSize/2, iconY - iconSize/2, iconSize, iconSize);
        
        const arrowSize = iconSize * 0.2;
        const drawArrow = (x, y, dirX, dirY) => {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + dirX * arrowSize, y + dirY * arrowSize);
        this.ctx.stroke();
        };
        
        drawArrow(iconX - iconSize/2, iconY - iconSize/2, -1, -1);
        drawArrow(iconX + iconSize/2, iconY - iconSize/2, 1, -1);
        drawArrow(iconX - iconSize/2, iconY + iconSize/2, -1, 1);
        drawArrow(iconX + iconSize/2, iconY + iconSize/2, 1, 1);
        
        return hovered;
    }

    /** 
     * Checks if device is mobile/tablet based on orientation or screen width
     */
    isMobileOrTablet() {
        if (isMobileOrTablet()) { return false; }
    }

    /** 
     * Helper method to adjust mouse coordinates for canvas scaling 
     */
    getAdjustedMouseCoords() {
        return this.world.getAdjustedMouseCoords();
    }
}
