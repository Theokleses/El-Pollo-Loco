// const level1 = new Level(
  
//     [
//     new Chicken(),
//     new Chicken(),
//     new Chicken(),
//     new Endboss()
//     ],
//     [
//         new Cloud()
//     ],
//     [
//         new BackgroundObject('img/5_background/layers/air.png', -719),
//         new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
//         new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
//         new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),

//         new BackgroundObject('img/5_background/layers/air.png', 0),
//         new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
//         new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
//         new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),
//         new BackgroundObject('img/5_background/layers/air.png', 719),
//         new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
//         new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
//         new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),

//         new BackgroundObject('img/5_background/layers/air.png', 719*2),
//         new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719*2),
//         new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719*2),
//         new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719*2),

//         new BackgroundObject('img/5_background/layers/air.png', 719*3),
//         new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719*3),
//         new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719*3),
//         new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719*3),
//     ],
//     [
//         new Coins(), 
//         new Coins(), 
//         new Coins(), 
//         new Coins(), 
//         new Coins()
//     ],
//     [
//         new Bottles(),
//         new Bottles(),
//         new Bottles(),
//         new Bottles(),
//         new Bottles()
//     ]
// );

const createGroup = (numItems, minX, maxX, gap, classType) => {
    const group = [];
    for (let i = 0; i < numItems; i++) {
        group.push(new classType(i, minX, maxX, gap));
    }
    return group;
};

const bottlesGroup1 = createGroup(3, 750, 3000, 200, Bottles); // 3 Bottles in der ersten Gruppe
const bottlesGroup2 = createGroup(2, 2000, 3000, 200, Bottles); // 2 Bottles in der zweiten Gruppe

const coinsGroup1 = createGroup(3, 500, 1500, 150, Coins); // 3 Coins in der ersten Gruppe
const coinsGroup2 = createGroup(2, 1600, 2500, 150, Coins); // 2 Coins in der zweiten Gruppe

// Alle Coins und Bottles zusammenführen
const allCoins = [...coinsGroup1, ...coinsGroup2];
const allBottles = [...bottlesGroup1, ...bottlesGroup2];



const level1 = new Level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new BigChicken(),
        new BigChicken(),
        new Endboss()
    ],
    [
        new Cloud()
    ],
    [
        new BackgroundObject('img/5_background/layers/air.png', -719),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),

        new BackgroundObject('img/5_background/layers/air.png', 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/air.png', 719),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),

        new BackgroundObject('img/5_background/layers/air.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 2),

        new BackgroundObject('img/5_background/layers/air.png', 719 * 3),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719 * 3),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719 * 3),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719 * 3),
    ],
    allCoins, // Coins korrekt einfügen
    allBottles // Bottles korrekt einfügen
);
