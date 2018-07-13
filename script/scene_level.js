"use strict";

var levelProperties;
var levelScene;
var spriteAtlas, tileAtlas;
var camera;
var objects;
var player, pickups;
var walls;
var levelMap, graphicMap;
function initialize_level() {
    levelProperties = {
        width: 0,
        height: 0,
        grid: 64,
        gridWidth: 32,
        gridHeight: 16
    }
    levelProperties.width = levelProperties.gridWidth * levelProperties.grid;
    levelProperties.height = levelProperties.gridHeight * levelProperties.grid;
    /*
    levelProperties.tileDisplayX = Math.ceil(gameProperties.width / levelProperties.grid) + 1;
    levelProperties.tileDisplayY = Math.ceil(gameProperties.height / levelProperties.grid) + 1;
    */
    levelProperties.tileDisplayX = Math.ceil(gameProperties.preferred_width / levelProperties.grid) + 1;
    levelProperties.tileDisplayY = Math.ceil(gameProperties.preferred_height / levelProperties.grid) + 1;

    levelScene = new PIXI.Container();
    gameScene.addChild(levelScene);

    spriteAtlas = PIXI.loader.resources["img/sprites.json"].textures;
    tileAtlas = PIXI.loader.resources["img/tiles.json"].textures;

    var playerFrames = [];
    for (var i = 1; i <= 1; i++) {
        playerFrames.push(PIXI.Texture.fromFrame('player f' + i));
    }


    levelMap = [];
    var levelMapRow;
    for (var i = 0; i < levelProperties.gridWidth; i++) {
        levelMapRow = [];
        for (var j = 0; j < levelProperties.gridHeight; j++) {
            if (i == 0 || i == levelProperties.gridWidth - 1 || j == 0 || j == levelProperties.gridHeight - 1 || Math.random() < 0.1)
                levelMapRow.push(1);
            else
                levelMapRow.push(0);
        }
        levelMap.push(levelMapRow);
    }

    walls = new PIXI.Container();
    //walls.position.set(0, 0);
    levelScene.addChild(walls);
    graphicMap = [];
    var graphicMapRow;
    var wall;
    for (var i = 0; i < levelProperties.tileDisplayX; i++) {
        graphicMapRow = [];
        for (var j = 0; j < levelProperties.tileDisplayY; j++) {
            wall = new PIXI.Sprite();
            wall.position.set(i * levelProperties.grid, j * levelProperties.grid);
            graphicMapRow.push(wall);
            walls.addChild(wall);
        }
        graphicMap.push(graphicMapRow);
    }

    objects = new PIXI.Container();
    levelScene.addChild(objects);

    //player = new PIXI.Sprite(spriteAtlas["frame 1"]);
    player = new PIXI.extras.AnimatedSprite(playerFrames);
    player.px = 128;
    player.py = 128;
    player.vx = 0.5;
    player.vy = 0;
    player.anchor.set(0.5, 1.0);
    player.animationSpeed = 0.1;
    player.play();
    objects.addChild(player);

    pickups = new PIXI.Container();
    objects.addChild(pickups);
    var o;
 
    for (var i = 0; i < 5; i++) {
        o = new PIXI.Sprite(spriteAtlas["food"]);
        o.position.set(Math.floor(Math.random() * (levelProperties.gridWidth - 2) + 1) * levelProperties.grid, Math.floor(Math.random() * (levelProperties.gridHeight - 2) + 1) * levelProperties.grid);
        pickups.addChild(o);
    }

    camera = {};
    camera.x = player.px;
    camera.y = player.py;
}

/*
function levelResize() {
    levelProperties.tileDisplayX = Math.ceil(gameProperties.width / levelProperties.grid) + 1;
    levelProperties.tileDisplayY = Math.ceil(gameProperties.height / levelProperties.grid) + 1;

    for (var i = walls.children.length - 1; i >= 0; i++) {
        walls.removeChild(walls.children[i]);
        console.log(1);
    }
    graphicMap = [];
    var graphicMapRow;
    var wall;
    for (var i = 0; i < levelProperties.tileDisplayX; i++) {
        graphicMapRow = [];
        console.log(2);
        for (var j = 0; j < levelProperties.tileDisplayY; j++) {
            wall = new PIXI.Sprite();
            wall.position.set(i * levelProperties.grid, j * levelProperties.grid);
            graphicMapRow.push(wall);
            walls.addChild(wall);
            console.log(3);
        }
        graphicMap.push(graphicMapRow);
        console.log(4);
    }
}
*/

function play(delta) {
    player.vy += 0.5 * delta
    if (keys.up.held) player.vy = -10;
    if (keys.down.held) player.vy += 0.5 * delta;
    if (keys.left.held) player.vx -= 0.5 * delta;
    if (keys.right.held) player.vx += 0.5 * delta;
    player.vx *= Math.pow(0.9, delta);
    player.vy *= Math.pow(0.99, delta);


    player.px += player.vx * delta;
    player.py += player.vy * delta;
    var ii = Math.floor(player.px / levelProperties.grid);
    var jj = Math.floor(player.py / levelProperties.grid);
    if (ii >= 0 && ii < levelProperties.gridWidth && jj >= 0 && jj < levelProperties.gridHeight) {
        if (levelMap[ii][jj] == 1) {
            player.px -= player.vx * delta;
            player.py -= player.vy * delta;
            player.vx = -player.vx;
            player.vy = 0;
            //PIXI.sound.stop('sfx_block');
            //PIXI.sound.play('sfx_block');
        }
    }
    /*
    if (player.px >= 511) {
        player.px = 511;
        player.vx = -player.vx;
    }
    if (player.px < 0) {
        player.px = 0;
        player.vx = -player.vx;
    }
    if (player.py > 511) {
        player.py = 511;
        player.vy = -player.vy;
    }
    if (player.py < 0) {
        player.py = 0;
        player.vy = -player.vy;
    }
    */
    //player.rotation += delta * 0.04;

    player.x = player.px;
    player.y = player.py;

    var dist = Math.sqrt(Math.pow(camera.x - player.px, 2) + Math.pow(camera.y - player.py, 2)) - 64;
    if (dist > 0) {
    }
    camera.x = (camera.x * 9 + player.px) / 10;
    camera.y = (camera.y * 9 + player.py) / 10;

    camera.dx = Math.round(camera.x) - gameProperties.width / 2;
    camera.dy = Math.round(camera.y) - gameProperties.height / 2;

    objects.x = -camera.dx;
    objects.y = -camera.dy;

    var tx = camera.dx;
    var ty = camera.dy;
    var tileX = Math.floor(tx / levelProperties.grid);
    var tileY = Math.floor(ty / levelProperties.grid);
    var tileOffsetX = tx - tileX * levelProperties.grid;
    var tileOffsetY = ty - tileY * levelProperties.grid;
    walls.position.set(-tileOffsetX, -tileOffsetY);
    for (var i = 0; i < levelProperties.tileDisplayX; i++) {
        var ii = i + tileX;
        for (var j = 0; j < levelProperties.tileDisplayY; j++) {
            var jj = j + tileY;
            var n = -1;
            if (ii >= 0 && ii < levelProperties.gridWidth && jj >= 0 && jj < levelProperties.gridHeight)
                n = levelMap[ii][jj];
            switch(n) {
                case 0:
                    graphicMap[i][j].texture = PIXI.utils.TextureCache["floor"];
                    break;
                case 1:
                    graphicMap[i][j].texture = PIXI.utils.TextureCache["wall"];
                    break;
                default:
                    graphicMap[i][j].texture = PIXI.utils.TextureCache["abyss"];
                    break;
            }
        }
    }
}
