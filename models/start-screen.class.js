class StartScreen extends DrawableObject{
    y = 0;
    x = 0;
    width = 720;
    height = 480;
    startGameButton = new StartButton();


    constructor() {
        super().loadImage("img/9_intro_outro_screens/start/startscreen_1.png");
        startGameListener(this.startGameButton);
        
    }

    
}