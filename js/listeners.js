// function startGameListener(button) {
//     canvas.addEventListener('click', (event) => {
//         const rect = canvas.getBoundingClientRect();
//         mouseX = event.clientX - rect.left;
//         mouseY = event.clientY - rect.top;
//         if (
//            mouseX >= button.x &&
//            mouseX <= button.x + button.width &&
//            mouseY >= button.y &&
//            mouseY <= button.y + button.height 
//        ){
//         if(gameState == "Start"){
//         startGame();
//         }
//        }
//       });
// }

// function startGameListener(button) {
//     canvas.addEventListener('click', (event) => {
//         const rect = canvas.getBoundingClientRect();
//         const mouseX = event.clientX - rect.left;
//         const mouseY = event.clientY - rect.top;

//         if (
//             mouseX >= button.x &&
//             mouseX <= button.x + button.width &&
//             mouseY >= button.y &&
//             mouseY <= button.y + button.height
//         ) {
//             if (gameState == "Start") {
//                 startGame();
//             } else if (gameState == "Game" && world.character.energy == 0) {
//                 resetGame();
//             }
//         }
//     });
// }


function addButtonClickListener(button, callback) {
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (
            mouseX >= button.x &&
            mouseX <= button.x + button.width &&
            mouseY >= button.y &&
            mouseY <= button.y + button.height
        ) {
            callback(); // Führt die übergebene Callback-Funktion aus
        }
    });
}

function startGameListener(button) {
    addButtonClickListener(button, () => {
        if (gameState == "Start") {
            startGame(); 
        }
    });
}

function newGameListener(button) {
    addButtonClickListener(button, () => {
        if (gameState == "Game" && world.character.energy == 0) {
            resetGame(); 
        }
    });
}


