"use strict";

var levelProperties;
var levelScene;
var spriteAtlas, tileAtlas;
var camera;
var objects;
var player, pickups;
var walls;
var levelMap, graphicMap;
var playerAnimations;
var tileType; //, tileKeys;
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

    playerAnimations = {};
    playerAnimations.idle = [];
    for (var i = 1; i <= 1; i++) {
        playerAnimations.idle.push(PIXI.Texture.fromFrame('player f' + i));
    }
    playerAnimations.jump = [];
    for (var i = 1; i <= 1; i++) {
        playerAnimations.jump.push(PIXI.Texture.fromFrame('player jump f' + i));
    }
    playerAnimations.run = [];
    for (var i = 1; i <= 6; i++) {
        playerAnimations.run.push(PIXI.Texture.fromFrame('player run f' + i));
    }

    tileType = {};
    tileType.air = {coll: 0, name: "air", grow: true};
    tileType.abyss = {coll: 0, name: "abyss"};
    tileType.wall = {coll: 1, name: "wall", block: true, grass: true};
    tileType.wall_grass = {coll: 1, name: "wall_grass", block: true, grass: true};
    tileType.cap_lr = {coll: 0, name: "cap_lr", grow: true};
    tileType.cap = {coll: 0, name: "cap", grow: true};
    tileType.cap_l = {coll: 0, name: "cap_l", grow: true};
    tileType.cap_r = {coll: 0, name: "cap_r", grow: true};
    tileType.crate = {coll: 2, name: "crate", block: true};
    tileType.crate_top = {coll: 0, name: "crate_top"};
    tileType.leaf = {coll: 2, name: "leaf"};
    var tileKeys = Object.keys(tileType);
    tileType.index = [];
    for (var i = 0; i < tileKeys.length; i++) {
        tileType[tileKeys[i]].id = i;
        tileType.index.push({
            coll: tileType[tileKeys[i]].coll,
            name: tileType[tileKeys[i]].name,
            block: tileType[tileKeys[i]].block,
            grass: tileType[tileKeys[i]].grass,
            grow: tileType[tileKeys[i]].grow
        });
    }

    levelMap = [];
    var levelMapRow;
    for (var i = 0; i < levelProperties.gridWidth; i++) {
        levelMapRow = [];
        for (var j = 0; j < levelProperties.gridHeight; j++) {
            if (i == 0 || i == levelProperties.gridWidth - 1 || j == 0 || j == levelProperties.gridHeight - 1 || Math.random() < 0.1)
                levelMapRow.push(tileType.wall.id);
            else
                levelMapRow.push(tileType.air.id);
        }
        levelMap.push(levelMapRow);
    }
    for (var i = 0; i < levelProperties.gridWidth; i++) {
        for (var j = 0; j < levelProperties.gridHeight; j++) {
            if (levelMap[i][j] == tileType.air.id) {
                if (i > 0 && levelMap[i - 1][j] == tileType.wall.id || i < levelProperties.gridWidth - 1 && levelMap[i + 1][j] == tileType.wall.id) {
                    levelMap[i][j] = tileType.leaf.id;
                }
                if (j < levelProperties.gridHeight - 1 && levelMap[i][j + 1] == tileType.wall.id) {
                    if (Math.random() < 0.1) levelMap[i][j] = tileType.crate.id;
                }
            }
        }
    }
    for (var i = 0; i < levelProperties.gridWidth; i++) {
        for (var j = 0; j < levelProperties.gridHeight - 1; j++) {
            if (levelMap[i][j] == tileType.air.id && levelMap[i][j + 1] == tileType.wall.id) {
                levelMap[i][j + 1] = tileType.wall_grass.id;
                if (i > 0 && tileType.index[levelMap[i - 1][j + 1]].grass && tileType.index[levelMap[i - 1][j]].grow || tileType.index[levelMap[i - 1][j]].block) {
                    if (i < levelProperties.gridWidth - 1 && tileType.index[levelMap[i + 1][j + 1]].grass && tileType.index[levelMap[i + 1][j]].grow || tileType.index[levelMap[i + 1][j]].block) {
                        levelMap[i][j] = tileType.cap.id;
                    } else {
                        levelMap[i][j] = tileType.cap_r.id;
                    }
                } else {
                    if (i < levelProperties.gridWidth - 1 && tileType.index[levelMap[i + 1][j + 1]].grass && tileType.index[levelMap[i + 1][j]].grow || tileType.index[levelMap[i + 1][j]].block) {
                        levelMap[i][j] = tileType.cap_l.id;
                    } else {
                        levelMap[i][j] = tileType.cap_lr.id;
                    }
                }
            }
        }
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
    player = new PIXI.extras.AnimatedSprite(playerAnimations.run);
    player.px = 128;
    player.py = 128;
    player.vx = 0.5;
    player.vy = 0;
    player.anchor.set(0.5, 1.0);
    player.animationSpeed = 0.1;
    player.play();
    objects.addChild(player);
    player.direction = 1;

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
    camera.px = 0;
    camera.py = 0;
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

/*
function getGridIntersections(start, end) {
    //start[0] = start[0] / levelProperties.grid;
    var m = (start[1] - end[1]) / (start[0] - end[0]);
    var tsx, tex;
    if (start[0] < end[0]) {
        tsx = start[0];
        tex = end[0];
    } else {
        tsx = end[0];
        tex = start[0];
    }

    var n = (start[0] - end[0]) / (start[1] - end[1]);
    if (start[1] < end[1]) {
        tsx = start[1];
        tex = end[1];
    } else {
        tsx = end[1];
        tex = start[1];
    }
    for (var i = Math.
}
*/

function checkWall(x, y) {
    var ii = Math.floor(x / levelProperties.grid);
    var jj = Math.floor(y / levelProperties.grid);
    if (ii >= 0 && ii < levelProperties.gridWidth && jj >= 0 && jj < levelProperties.gridHeight) {
        if (tileType.index[levelMap[ii][jj]].coll == 1) return true;
    }
    return false;
}

function playerCheckWall(x, y) {
    if (checkWall(x - 14, y)) return true;
    if (checkWall(x + 14, y)) return true;
    if (checkWall(x - 14, y - 60)) return true;
    if (checkWall(x + 14, y - 60)) return true;
    return false;
}

function play(delta) {
    player.vy += 0.5 * delta
    player.vx *= Math.pow(0.9, delta);
    player.vy *= Math.pow(0.99, delta);

/*
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
    */

    var tx = player.px;
    var ty = player.py;
    var tdx = player.vx * delta;
    var tdy = player.vy * delta;
    var dd = Math.sqrt(Math.pow(player.vx, 2) + Math.pow(player.vy, 2)) * delta;
    var tddx = tdx / dd;
    var tddy = tdy / dd;
    var grounded = false;
    var vhit = false;
    var hhit = false;
    for (var i = 0; i <= dd; i++) {
        if (!vhit) {
            ty += tddy;
            if (playerCheckWall(tx, ty)) {
                ty -= tddy;
                vhit = true;
                if (player.vy > 0) {
                    grounded = true;
                    player.vy = 1;
                } else {
                    player.vy = 0;
                }
            }
        }
        if (!hhit) {
            tx += tddx;
            if (playerCheckWall(tx, ty)) {
                tx -= tddx;
                hhit = true;
                player.vx = 0;
            }
        }
    }
    player.px = tx;
    player.py = ty;
    if (grounded && !keys.left.held && !keys.right.held) {
        player.vx = 0;
    }

    if (grounded && keys.b.held && player.vy >= -1) player.vy = -10;
    //if (keys.down.held) player.vy += 0.5 * delta;
    if (keys.left.held) player.vx -= 0.5 * delta;
    if (keys.right.held) player.vx += 0.5 * delta;

    if (keys.a.held && keys.a.toggled) {
        keys.a.toggled = false;
        var tx = Math.floor(player.px / levelProperties.grid) - 1;
        for (var i = 0; i < 3; i++) {
            var ty = Math.floor(player.py / levelProperties.grid) - 1;
            for (var j = 0; j < 3; j++) {
                if (tx >= 0 && tx < levelProperties.gridWidth && ty >= 0 && ty < levelProperties.gridHeight) {
                    levelMap[tx][ty] = 0;
                }
                ty++;
            }
            tx++;
        }
    }

    if (!grounded) {
        player.textures = playerAnimations.jump;
    } else if (keys.left.held || keys.right.held) {
        if (player.textures != playerAnimations.run) {
            player.textures = playerAnimations.run;
            player.animationSpeed = 0.4;
            player.play();
        }

    } else {
        player.textures = playerAnimations.idle;
    }
    /*
    if (keys.b.held && keys.b.toggled) {
        keys.b.toggled = false;
        var tx = Math.floor(player.px / levelProperties.grid);
        var ty = Math.floor(player.py / levelProperties.grid) + 1;
        if (tx >= 0 && tx < levelProperties.gridWidth && ty >= 0 && ty < levelProperties.gridHeight) {
            levelMap[tx][ty] = 1;
        }
    }
    */
    if (keys.c.held && keys.c.toggled) {
        keys.c.toggled = false;
        var tx = Math.floor(player.px / levelProperties.grid) - 1;
        var ty = Math.floor(player.py / levelProperties.grid);
        if (tx >= 0 && tx < levelProperties.gridWidth && ty >= 0 && ty < levelProperties.gridHeight) {
            levelMap[tx][ty] = 1;
        }
    }
    if (keys.d.held && keys.d.toggled) {
        keys.d.toggled = false;
        var tx = Math.floor(player.px / levelProperties.grid) + 1;
        var ty = Math.floor(player.py / levelProperties.grid);
        if (tx >= 0 && tx < levelProperties.gridWidth && ty >= 0 && ty < levelProperties.gridHeight) {
            levelMap[tx][ty] = 1;
        }
    }


    player.x = player.px;
    player.y = player.py;

    if (keys.left.held) {
        player.direction = -1;
        player.scale.x = -1;
    }
    if (keys.right.held) {
        player.direction = 1;
        player.scale.x = 1;
    }
    if (keys.up.held) {
        player.look = -1;
    } else if (keys.down.held) {
        player.look = 1;
    /*
    } else if (!grounded) {
        player.look = Math.min(-1 + Math.max((player.vy - 10) / 1, 0), 1.5);
    */
    } else {
        player.look = -1;
    }
    var camera_fx = player.direction * 64;
    var camera_fy = player.look * 64;
    var cdist = Math.sqrt(Math.pow(camera.px - camera_fx, 2) + Math.pow(camera.py - camera_fy, 2));
    if (cdist < 8) {
        camera.px = camera_fx;
        camera.py = camera_fy;
    } else {
        camera.px += (camera_fx - camera.px) / cdist * 8;
        camera.py += (camera_fy - camera.py) / cdist * 8;
    }
    //var dist = Math.sqrt(Math.pow(camera.x - player_fx, 2) + Math.pow(camera.y - player.py, 2)) - 64;
    /*
    var mincamdist = 13;
    var maxcamdist = 256;
    var xdist = Math.min(Math.abs(camera.x - camera.px) + mincamdist, maxcamdist - mincamdist);
    var ydist = Math.min(Math.abs(camera.y - camera.py) + mincamdist, maxcamdist - mincamdist);
    camera.x = (camera.x * xdist + camera.px * mincamdist) / (xdist + mincamdist);
    camera.y = (camera.y * ydist + camera.py * mincamdist) / (ydist + mincamdist);
    */

    camera_fx = player.px + camera.px;
    camera_fy = player.py + camera.py;
    camera.x = (camera.x * 9 + camera_fx) / 10;
    camera.y = (camera.y * 9 + camera_fy) / 10;
    //camera.x = camera_fx;
    //camera.y = camera_fy;

    cdist = Math.sqrt(Math.pow(camera.x - camera_fx, 2) + Math.pow(camera.y - camera_fy, 2));
    if (cdist > 80) {
        camera.x += (camera_fx - camera.x) * (cdist - 80) / cdist;
        camera.y += (camera_fy - camera.y) * (cdist - 80) / cdist;
    }

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
            var n = -99;
            if (ii >= 0 && ii < levelProperties.gridWidth && jj >= 0 && jj < levelProperties.gridHeight)
                n = levelMap[ii][jj];
            if (n >= 0 && n < tileType.index.length) {
                graphicMap[i][j].texture = PIXI.utils.TextureCache[tileType.index[n].name];
            } else {
                graphicMap[i][j].texture = PIXI.utils.TextureCache["abyss"];
            }
            /*
            switch(n) {
                case 0:
                    graphicMap[i][j].texture = PIXI.utils.TextureCache["air"];
                    break;
                case 1:
                    graphicMap[i][j].texture = PIXI.utils.TextureCache["wall"];
                    break;
                case 2:
                    graphicMap[i][j].texture = PIXI.utils.TextureCache["wall_grass"];
                    break;
                case 3:
                    graphicMap[i][j].texture = PIXI.utils.TextureCache["crate"];
                    break;
                case 4:
                    graphicMap[i][j].texture = PIXI.utils.TextureCache["crate_top"];
                    break;
                case 5:
                    graphicMap[i][j].texture = PIXI.utils.TextureCache["leaf"];
                    break;
                case -1:
                    graphicMap[i][j].texture = PIXI.utils.TextureCache["cap_lr"];
                    break;
                case -2:
                    graphicMap[i][j].texture = PIXI.utils.TextureCache["cap"];
                    break;
                case -3:
                    graphicMap[i][j].texture = PIXI.utils.TextureCache["cap_l"];
                    break;
                case -4:
                    graphicMap[i][j].texture = PIXI.utils.TextureCache["cap_r"];
                    break;
                default:
                    graphicMap[i][j].texture = PIXI.utils.TextureCache["abyss"];
                    break;
            }
            */
        }
    }
}
