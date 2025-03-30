class RenderManager {
    constructor(ctx, world) {
        this.ctx = ctx;
        this.world = world;
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
}