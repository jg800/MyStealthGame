/**********
    My To Do 
          1) Actual Fire
    My Can Do
          1) Better Player Collision
          2) Better Sight
          3) Better easyStar
          
    Your To Do
        1) Make Some Tiled Maps (ensure each wall is as thick as 2 tiles (width and height) and ensure the walls dont allow the player ...
           ... to get 2 tiles from the edge of the screen and make the walkable tile index type = 30)
        2) Add animations/sprites to the player and guard.
        3) Make something which calls the nextLevel() method, like a door or something. Also make that method load the next tile map (look at build world).
        4) Add sound affects to stuff you can think of like fire, player death, background music, guard knockout.
        5) Whatever you think is good.
    
    Notes: Basically set max guards as the maximum number of guards there are going to be in any one level.
           Set end level num as the number the game ends.
           The player start locations are the xy locations of the starting player.
           The start locaions are the xy starting loactions of the guards.
           Patrol loactions are the tile refrences of the locations the guards will travel too.
           The ifLoop will state whether a guard loops back to its first patrol location (true) or the one just previoulsy visited (false). 
**********/
var play = true;
var endTitleWord = "End";
var ROWS = 20;
var COLUMNS = 30;
var TILEWIDTH = 32;
var GAMEWIDTH = COLUMNS*TILEWIDTH;
var GAMEHEIGHT = ROWS*TILEWIDTH;
var cursors;
var player;
var door;
var maxGuards = 5;
var levelNum = 0;
var endLevelNum = 2;
var playerStartLocation = [ 
                            [[96],[128]],
                            [[800],[96]]
                          ];
var startLoaction   = [ 
                        [ // Start location of guard1 in level one
                            [800,96] ,
                            // Start location of guard2 in level one
                            [352,352]
                        ] , 
                        [ // Start location of guard1 in level two
                            [50,96] ,
                            // Start location of guard2 in level one
                            [250,250]
                        ]
                      ];
var patrolLoactions = [ 
                        [ 
                            // Patrol locations of guard1 in level 1
                            [[26,15],[19,4],[17,16],[13,4]], 
                            // Patrol locations of guard2 in level 1
                            [[7,5],[3,16], [13,3], [11,16]],
                        ] ,
                        [ 
                            // Patrol locations of guard1 in level 1
                            [[26,15],[19,4],[17,16],[13,4]], 
                            // Patrol locations of guard2 in level 1
                            [[7,5],[3,16], [13,3], [11,16]],
                        ]
                      ];
var ifLoop          = [ 
                        [ [true],
                          [false],
                          //[true]
                        ] , 
                        [ [true],
                          [false],
                        ] 
                      ];


var doorLoctions = [[832,64],[96,64]]

var world = {
    map: null,
    groundLayer: null,
    wallLayer: null,
    visionLayer: null,
    walkables: null,
    guard_spr: {},
};


var game = new Phaser.Game(GAMEWIDTH, GAMEHEIGHT, Phaser.AUTO, 'phaser-diy-tile-example', {
    preload: preload,
    create: create,
    update: update
});

function preload() {
    game.load.tilemap('mansion', 'assets/TestMap.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('bullet', 'assets/Bullet.png');
    game.load.image('tiles', 'assets/city_inside.png');
    game.load.image('tiles1', 'assets/Inside_B.png');
    //-------------------------------------------------------------------------------
    //replace player and zombie with
    game.load.spritesheet('guard', 'assets/bartender.png', 32, 32, 20); //from: https://opengameart.org/content/48-animated-old-school-rpg-characters-16x16
    game.load.spritesheet('player', 'assets/Albert.png',32,32,20);//from: https://opengameart.org/content/48-animated-old-school-rpg-characters-16x16
	game.load.audio('footstep', 'assets/footstep.wav');//from: https://freesound.org/people/LittleRobotSoundFactory/sounds/270414/
	game.load.audio('shot', 'assets/gun_shot.wav');//from: https://freesound.org/people/Bird_man/sounds/275151/
	game.load.audio('punch', 'assets/punch.wav');//from: https://freesound.org/people/kretopi/sounds/406457/
    game.load.audio('hit_wall', 'assets/hit_wall.wav');//from: https://freesound.org/people/DasDeer/sounds/167308/
    //-------------------------------------------------------------------------------
    game.load.spritesheet('sights', 'assets/sightSheet.png', 96, 96, 4);
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    buildWorld(game, world);
    //keys = game.input.keyboard.createCursorKeys();
    cursors = game.input.keyboard.createCursorKeys();
    game.time.events.loop(400, walk, this);//from: https://phaser.io/examples/v2/time/basic-looped-eventhttps://phaser.io/examples/v2/time/basic-looped-event
    //-------------------------------------------------------------------------------
    player = game.add.existing(new Player(game, cursors));
    door = game.add.existing(new Block(game));
    for(var x = 0; x < maxGuards; x++){
        world.guard_spr[x] = new Guard(world, game, 'guard');
        world.visionLayer.addChild(world.guard_spr[x]);
    }
    game.pathfinder = game.plugins.add(Phaser.Plugin.PathFinderPlugin);   
    game.pathfinder.setGrid(world.map.layers[world.groundLayer.index].data, world.walkables);
    endTitleText = game.add.text((GAMEWIDTH/2), (GAMEHEIGHT/2), '', {font: '96px Arial', fill: '#FF0000'})
    endTitleText.anchor.setTo(0.5, 0.5);
    startLevel();
}

function buildWorld(game, world) {
    // Initialise the tilemap
    world.map = game.add.tilemap('mansion');
    const tiles  = world.map.addTilesetImage('Assets', 'tiles');
    const tiles1 = world.map.addTilesetImage('Assets2', 'tiles1');
    // set up the tilemap layers
    world.groundLayer = world.map.createLayer('GroundLayer');
    world.visionLayer = world.map.createLayer('VisionLayer');
    world.wallLayer =   world.map.createLayer('WallLayer');
    world.walkables = [36];
    //game.input.onDown.add(pointerClick, this);

}

function startLevel(){
    console.log(levelNum+" ayay");
    if(levelNum == 0){
        play = true;
        endTitleText.text = "";
    }
    player.restart(playerStartLocation[levelNum][0],playerStartLocation[levelNum][1]);
    for(var i = 0; i < startLoaction[levelNum].length; i++){
        world.guard_spr[i].restart(startLoaction[levelNum][i][0], startLoaction[levelNum][i][1], patrolLoactions[levelNum][i], ifLoop[levelNum][i]);
    }
    door.restart(doorLoctions[levelNum][0],doorLoctions[levelNum][1]);
}

function nextLevel() {
    for(var i = 0; i < startLoaction[levelNum].length; i++){
        world.guard_spr[i].myKill();
    }
    player.kill();
    levelNum++;
    if(levelNum >= endLevelNum){
        console.log('End Level');
        gameOver();
    } else {
        startLevel();
    }
}

function update() {
    if(play){
        for(var i = 0; i < startLoaction[levelNum].length; i++){
            if(world.guard_spr[i].exists){
                world.guard_spr[i].update();
            }
        }
        player.updateMe();
        door.checkHit();
    }
}

function gameOver() {
    play = false;
    endTitleText.text = endTitleWord;
    player.kill();
    for(var i = 0; i < startLoaction[1].length; i++){
        world.guard_spr[i].myKill();
    }
    levelNum = 0;
    game.input.onTap.add(startLevel, this);
}

function checkCol(a_spr, b_spr) {
    var collided = false;
    if (a_spr.x < b_spr.x + b_spr.width && a_spr.y < b_spr.y + b_spr.height &&
        a_spr.x + a_spr.width > b_spr.x && a_spr.y + a_spr.height> b_spr.y) {
           collided = true;
    }
    return collided;
}