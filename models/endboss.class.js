class Endboss extends MovableObject{
    height = 500;
    width = 300;
    y = - 40;
    energy = 100;


    IMAGES_WALK = [
        "img/4_enemie_boss_chicken/1_walk/G1.png",
        "img/4_enemie_boss_chicken/1_walk/G2.png",
        "img/4_enemie_boss_chicken/1_walk/G3.png",
        "img/4_enemie_boss_chicken/1_walk/G4.png"
    ];

    IMAGES_ALERT = [
        "img/4_enemie_boss_chicken/2_alert/G5.png",
        "img/4_enemie_boss_chicken/2_alert/G6.png",
        "img/4_enemie_boss_chicken/2_alert/G7.png",
        "img/4_enemie_boss_chicken/2_alert/G8.png",
        "img/4_enemie_boss_chicken/2_alert/G9.png",
        "img/4_enemie_boss_chicken/2_alert/G10.png",
        "img/4_enemie_boss_chicken/2_alert/G11.png",
        "img/4_enemie_boss_chicken/2_alert/G12.png"
        
    ];

    IMAGES_ATTACK = [
        "img/4_enemie_boss_chicken/3_attack/G13.png",
        "img/4_enemie_boss_chicken/3_attack/G14.png",
        "img/4_enemie_boss_chicken/3_attack/G15.png",
        "img/4_enemie_boss_chicken/3_attack/G16.png",
        "img/4_enemie_boss_chicken/3_attack/G17.png",
        "img/4_enemie_boss_chicken/3_attack/G18.png",
        "img/4_enemie_boss_chicken/3_attack/G19.png",
        "img/4_enemie_boss_chicken/3_attack/G20.png"
    ];

    IMAGES_HURT = [
        "img/4_enemie_boss_chicken/4_hurt/G21.png",
        "img/4_enemie_boss_chicken/4_hurt/G22.png",
        "img/4_enemie_boss_chicken/4_hurt/G23.png"
    ];

    IMAGES_DEAD = [
        "img/4_enemie_boss_chicken/5_dead/G24.png",
        "img/4_enemie_boss_chicken/5_dead/G25.png",
        "img/4_enemie_boss_chicken/5_dead/G26.png"
    ];

    constructor(){
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2500;
        this.stateAlert = true;
        this.animate();

    }

    changeSpeed(speed) {
        this.speed = speed;
        
    }
    

    animate() {
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.changeSpeed(20);
                this.stateAlert = false; // Endboss ist nicht mehr im Alert-Zustand
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.stateAlert) {
                this.playAnimation(this.IMAGES_ALERT);
            } else {
                this.moveLeft();
                // Walk- und Attack-Animation nacheinander abspielen
                this.playAnimation(this.IMAGES_WALK); // Erst Walk
                setTimeout(() => {
                    this.playAnimation(this.IMAGES_ATTACK); // Dann Attack
                }, 50); // 500ms Verzögerung (nach Walk)
            }
        }, 200); // Einheitliche Taktung
    }    

}







// animate() {
    //     setInterval(() =>{
    //         this.playAnimation(this.IMAGES_ALERT);
    //         if (this.isHurt()) {
    //         this.playAnimation(this.IMAGES_HURT) && this.playAnimation(this.IMAGES_WALK);;  
    //         }else if(this.isDead()){
    //         this.playAnimation(this.IMAGES_DEAD);    
    //         }
    //     }, 200);
    //   }
    
    // animate() {
    //     setInterval(() => {
    //         if (this.isDead()) {
    //             this.playAnimation(this.IMAGES_DEAD);
    //         } else if (this.isHurt()) {
    //             this.stateAlert = false; // Endboss ist nicht mehr im Alert-Zustand
    //             this.playAnimation(this.IMAGES_HURT);
    //         } else if (this.stateAlert) {
    //             this.playAnimation(this.IMAGES_ALERT);
    //         } else {
    //             setInterval(() => {
    //                 this.moveLeft(); 
                
    //             }, 1000 / 60);
    //             this.playAnimation(this.IMAGES_WALK);
    //             this.playAnimation(this.IMAGES_ATTACK);
    //         }
    //     }, 200); // Einheitliche Taktung
    // }
    




