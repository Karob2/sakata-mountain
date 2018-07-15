"use strict";

var levelProperties;
var levelScene;
var spriteAtlas, tileAtlas;
var camera;
var objects;
var player, fairies, bullets_1, bullets_2, waves, slashFx, checkpoints, health;
var walls;
var levelMap, graphicMap;
var playerAnimations;
var tileType;
var waveTimer;
var lastCheckpoint = {};
// DEBUG:
var gx, gy;
var godMode = false;

function initialize_level() {
    levelProperties = {
        width: 0,
        height: 0,
        grid: 64,
        gridWidth: 96,
        gridHeight: 32
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
    playerAnimations.knife = [];
    for (var i = 1; i <= 5; i++) {
        playerAnimations.knife.push(PIXI.Texture.fromFrame('player knife f' + i));
    }
    playerAnimations.run = [];
    for (var i = 1; i <= 6; i++) {
        playerAnimations.run.push(PIXI.Texture.fromFrame('player run f' + i));
    }

    tileType = {};
    tileType.air = {coll: 0, name: "air", grow: true};
    tileType.backdrop = {coll: 0, name: "backdrop"};
    tileType.wall = {coll: 1, name: "wall", block: true, grass: true};
    tileType.wall_grass = {coll: 1, name: "wall_grass", block: true, grass: true};
    tileType.ramp_l = {coll: 4, name: "ramp_l", block: true, grass: true};
    tileType.ramp_r = {coll: 5, name: "ramp_r", block: true, grass: true};
    tileType.cap_lr = {coll: 0, name: "cap_lr", grow: true};
    tileType.cap = {coll: 0, name: "cap", grow: true};
    tileType.cap_l = {coll: 0, name: "cap_l", grow: true};
    tileType.cap_r = {coll: 0, name: "cap_r", grow: true};
    tileType.rampcap_l = {coll: 0, name: "rampcap_l", grow: true};
    tileType.rampcap_r = {coll: 0, name: "rampcap_r", grow: true};
    tileType.crate = {coll: 2, name: "crate", block: true};
    tileType.crate_top = {coll: 0, name: "crate_top"};
    tileType.leaf = {coll: 3, name: "leaf"};
    tileType.wall_bottom_l = {coll: 1, name: "wall_bottom_l"};
    tileType.wall_bottom_r = {coll: 1, name: "wall_bottom_r"};
    tileType.hard_air = {coll: 0, name: "hard_air"};
    //tileType.checkpoint_active = {coll: 0, name: "checkpoint_active"};
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

/*
    levelMap = [];
    var levelMapRow;
    for (var i = 0; i < levelProperties.gridWidth; i++) {
        levelMapRow = [];
        for (var j = 0; j < levelProperties.gridHeight; j++) {
            if (i == 0 || i == levelProperties.gridWidth - 1 || j == 0 || j == levelProperties.gridHeight - 1 || Math.random() < 0.065)
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
                    if (j < levelProperties.gridHeight - 1 && levelMap[i][j + 1] == tileType.air.id && j > 0 && (levelMap[i][j - 1] == tileType.air.id || levelMap[i][j - 1] == tileType.leaf.id)) {
                        levelMap[i][j] = tileType.leaf.id;
                    }
                }
                if (j < levelProperties.gridHeight - 1 && levelMap[i][j + 1] == tileType.wall.id) {
                    if (Math.random() < 0.4) {
                        levelMap[i][j] = tileType.crate.id;
                        if (j > 0 && levelMap[i][j - 1] != tileType.wall.id) {
                            levelMap[i][j - 1] = tileType.crate_top.id;
                        }
                    }
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

    var center = Math.floor(levelProperties.gridWidth / 2);
    var bottom = levelProperties.gridHeight - 2;
    levelMap[center][bottom + 1] = tileType.wall_grass.id;
    levelMap[center][bottom] = tileType.cap.id;
    levelMap[center + 1][bottom] = tileType.ramp_l.id;
    levelMap[center + 1][bottom - 1] = tileType.rampcap_l.id;
    levelMap[center + 2][bottom] = tileType.wall_grass.id;
    levelMap[center + 2][bottom - 1] = tileType.cap.id;
    for (var i = 0; i < 7; i++) {
        levelMap[center + 2 + i][bottom - 1 - i] = tileType.ramp_l.id;
        levelMap[center + 2 + i][bottom - 1 - i - 1] = tileType.rampcap_l.id;
    }
    levelMap[center + 9][bottom - 7] = tileType.wall_grass.id;
    levelMap[center + 9][bottom - 8] = tileType.cap.id;
    for (var i = 0; i < 4; i++) {
        levelMap[center + 2 + 8 + i][bottom - 1 - 6 + i] = tileType.ramp_r.id;
        levelMap[center + 2 + 8 + i][bottom - 1 - 6 + i - 1] = tileType.rampcap_r.id;
    }
    */

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

    checkpoints = new PIXI.Container();
    objects.addChild(checkpoints);

    //player = new PIXI.Sprite(spriteAtlas["frame 1"]);
    player = new PIXI.extras.AnimatedSprite(playerAnimations.idle);
    /*
    player.px = (Math.floor(levelProperties.gridWidth / 2) + 0.5) * levelProperties.grid;
    player.py = (Math.floor(levelProperties.gridHeight / 2) + 0.5) * levelProperties.grid;
    */
    player.px = levelProperties.grid * 1.5;
    player.py = levelProperties.height - levelProperties.grid - 1;
    player.vx = 0.5;
    player.vy = 0;
    player.anchor.set(0.5, 1.0);
    /*
    player.animationSpeed = 0.1;
    player.play();
    */
    player.cooldown = 0;
    objects.addChild(player);
    player.direction = 1;
    player.hasJumped = false;
    player.hasSlashed = false;
    player.invuln = 0;
    //player.shake = 0;

    var o;

    fairies = new PIXI.Container();
    objects.addChild(fairies);
    //fairyHearts = new PIXI.Container();
    //objects.addChild(fairyHearts);
    for (var i = 0; i < 30; i++) {
        o = new PIXI.Sprite(spriteAtlas["fairy"]);
        o.anchor.set(0.5, 0.5);
        o.hauntX = Math.floor(Math.random() * (levelProperties.gridWidth - 2) + 1) * levelProperties.grid;
        o.hauntY = Math.floor(Math.random() * (levelProperties.gridHeight - 2) + 1) * levelProperties.grid;
        o.x = o.hauntX;
        o.y = o.hauntY;
        o.vx = 0;
        o.vy = 0;
        o.vvx = 0;
        o.vvy = 0;
        o.hx = o.hauntX;
        o.hy = o.hauntY;
        o.cooldown_1 = 0;
        o.cooldown_2 = 4;
        o.super = false;
        fairies.addChild(o);
        o.heart = new PIXI.Sprite(spriteAtlas["fairy_heart"]);
        o.heart.anchor.set(0.5, 0.5);
        o.heart.x = o.x;
        o.heart.y = o.y;
        objects.addChild(o.heart);
    }

    bullets_1 = [];
    for (var i = 0; i < 30; i++) {
        o = new PIXI.Sprite(spriteAtlas["bullet 1"]);
        o.visible = false;
        o.anchor.set(0.5, 0.5);
        bullets_1.push({sprite: o, age: 0, active: false});
        objects.addChild(o);
    }

    bullets_2 = [];
    for (var i = 0; i < 30; i++) {
        o = new PIXI.Sprite(spriteAtlas["wave 1"]);
        o.visible = false;
        o.anchor.set(0.5, 0.5);
        bullets_2.push({sprite: o, age: 0, active: false});
        objects.addChild(o);
    }

    slashFx = new PIXI.Container();
    objects.addChild(slashFx);
    o = new PIXI.Sprite(spriteAtlas["wave 1"]);
    o.visible = false;
    o.anchor.set(0.5, 0.5);
    slashFx.addChild(o);
    o = new PIXI.Sprite(spriteAtlas["wave 1"]);
    o.visible = false;
    o.anchor.set(0.5, 0.5);
    o.scale.x = -1;
    slashFx.addChild(o);

    var wave_animation = [];
    for (var i = 1; i <= 2; i++) {
        wave_animation.push(PIXI.Texture.fromFrame('wave 2 f' + i));
    }
    waves = [];
    for (var i = 0; i < 5; i++) {
        o = new PIXI.extras.AnimatedSprite(wave_animation);
        o.visible = false;
        o.anchor.set(0.5, 0.5);
        o.animationSpeed = 0.2;
        o.loop = true;
        o.play();
        waves.push({sprite: o, age: 0, active: false});
        objects.addChild(o);
    }

    camera = {};
    camera.x = player.px;
    camera.y = player.py;
    camera.px = 0;
    camera.py = 0;
    //camera.shake = 0;

    waveTimer = 10;

    lastCheckpoint.x = player.px;
    lastCheckpoint.y = player.py;
    o = new PIXI.Sprite(tileAtlas["checkpoint"]);
    o.x = Math.floor(player.px / levelProperties.grid) * levelProperties.grid;
    o.y = Math.floor(player.py / levelProperties.grid) * levelProperties.grid;
    o.active = false;
    checkpoints.addChild(o);

    health = new PIXI.Container();
    health.x = 10;
    health.y = 6;
    health.maxLives = 6;
    health.lives = health.maxLives;
    levelScene.addChild(health);
    for (var n = 0; n < health.maxLives; n++) {
        o = new PIXI.Sprite(spriteAtlas["life"]);
        o.x = n * 32;
        o.y = 0;
        health.addChild(o);
    }
    styleHealth();

    importLevelMap();
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
        var cw = tileType.index[levelMap[ii][jj]].coll;
        if (cw == 2) {
            if (y - jj * levelProperties.grid < 1) {
                return 2;
            }
            return 0;
        } else if (cw == 3) {
            var ty = y - jj * levelProperties.grid;
            var cy = levelProperties.grid * 3 / 4;
            if (Math.abs(ty - cy) < 0.6) {
                return 2;
            }
            return 0;
        } else if (cw == 4) {
            var tx = x - ii * levelProperties.grid;
            var ty = y - jj * levelProperties.grid;
            if (ty > levelProperties.grid - tx - 1) {
                return 4;
            }
            return 0;
        } else if (cw == 5) {
            var tx = x - ii * levelProperties.grid;
            var ty = y - jj * levelProperties.grid;
            if (ty > tx - 1) {
                return 5;
            }
            return 0;
        } else {
            return cw;
        }
    }
    if (jj < 0) return 0;
    return 1;
}

function playerCheckWall(x, y) {
    var c1 = checkWall(x - 14, y);
    var c2 = checkWall(x + 14, y);
    var c3 = checkWall(x - 14, y - 60);
    var c4 = checkWall(x + 14, y - 60);
    //var cm = checkWall(x, y);
    if (c1 == 1 || c2 == 1 || c3 == 1 || c4 == 1) {
        return 1;
    }
    if (c1 == 2 || c2 == 2) {
        return 2;
    }
    if (c2 == 4) {
        return 4;
    }
    if (c1 == 5) {
        return 5;
    }
    return 0;
}

function play(delta) {

    // Move Player:

    player.vy += 0.5 * delta
    player.vx *= Math.pow(0.9, delta);
    player.vy *= Math.pow(0.99, delta);

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
            var cw = playerCheckWall(tx, ty);
            if (cw == 1 || player.vy > 0 && cw == 2 && !(keys.down.held && keys.b.held) || cw == 4 || cw == 5) {
                ty -= tddy;
                vhit = true;
                if (player.vy >= 0) {
                    grounded = true;
                    player.vy = 1;
                    if (cw == 4 || cw == 5) player.vy = 10; //cheap hack to keep the player on the ramp going downhill
                } else {
                    player.vy = 0;
                }
            }
        }
        if (!hhit) {
            tx += tddx;
            var cw = playerCheckWall(tx, ty);
            if (cw == 1) {
                tx -= tddx;
                hhit = true;
                player.vx = 0;
            } else if (cw == 4) {
                var ttx = levelProperties.grid - 1 - (tx + 14) % levelProperties.grid;
                var tty = ty % levelProperties.grid;
                if (tty > ttx) {
                    ty -= tty - ttx;
                }
            } else if (cw == 5) {
                var ttx = (tx - 14) % levelProperties.grid - 1;
                var tty = ty % levelProperties.grid;
                if (tty > ttx) {
                    ty -= tty - ttx;
                }
            }
        }
    }
    player.px = tx;
    player.py = ty;
    if (grounded && !keys.left.held && !keys.right.held) {
        player.vx = 0;
    }

    player.x = player.px;
    player.y = player.py;
    /*
    if (player.shake > 0) {
        player.x += Math.floor(Math.sin(player.shake) * player.shake / 10);
        player.y += Math.floor(Math.cos(player.shake) * player.shake / 10);
        player.shake -= delta;
    }
    */

    player.cx = player.px;
    player.cy = player.py - levelProperties.grid / 2;

    // DEBUG:
    gx = Math.floor(player.cx / levelProperties.grid);
    gy = Math.floor(player.cy / levelProperties.grid);

    // Jump and run.

    if (!keys.a.held) player.hasSlashed = false;
    if (!keys.b.held) player.hasJumped = false;

    if (!player.hasJumped && grounded && keys.b.held && player.vy >= -1) {
        player.vy = -10;
        player.hasJumped = true;
    }
    //if (keys.down.held) player.vy += 0.5 * delta;
    if (keys.left.held) player.vx -= 0.5 * delta;
    if (keys.right.held) player.vx += 0.5 * delta;

    // Set player animation.

    if (player.cooldown > 0) player.cooldown -= delta;
    if (player.textures != playerAnimations.knife || player.currentFrame == player.totalFrames - 1) {
        if (!player.hasSlashed && keys.a.held && player.cooldown < 1) {
            player.hasSlashed = true;
            player.cooldown = 40;
            player.textures = playerAnimations.knife;
            player.animationSpeed = 0.4;
            player.loop = false;
            player.play();
            slashFx.children[0].x = player.cx - 48;
            slashFx.children[0].y = player.cy;
            slashFx.children[0].visible = true;
            slashFx.children[0].cooldown = 5;
            /*
            slashFx.children[1].x = player.cx + 48;
            slashFx.children[1].y = player.cy;
            slashFx.children[1].visible = true;
            slashFx.children[1].cooldown = 5;
            */
            fireWave(player.cx, player.cy, 8 * player.scale.x, 0);
        } else {
            if (!grounded) {
                player.textures = playerAnimations.jump;
            } else if (keys.left.held || keys.right.held) {
                if (player.textures != playerAnimations.run) {
                    player.textures = playerAnimations.run;
                    player.animationSpeed = 0.4;
                    player.loop = true;
                    player.play();
                }
            } else {
                player.textures = playerAnimations.idle;
            }
        }
    }

    for (var i = 0; i < slashFx.children.length; i++) {
        if (slashFx.children[i].visible) {
            slashFx.children[i].cooldown -= delta;
            if (slashFx.children[i].cooldown < 1) {
                slashFx.children[i].visible = false;
                if (i == 0) {
                    slashFx.children[1].x = player.cx + 48;
                    slashFx.children[1].y = player.cy;
                    slashFx.children[1].visible = true;
                    slashFx.children[1].cooldown = 5;
                }
            }
        }
    }

    if (player.invuln > 0) {
        player.invuln -= delta;
        player.alpha = 0.5;
    } else {
        player.alpha = 1;
    }

    // DEBUG:
    if (keys.d.held && keys.d.toggled) {
        keys.d.toggled = false;
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

    /*
    if (keys.b.held && keys.b.toggled) {
        keys.b.toggled = false;
        var tx = Math.floor(player.px / levelProperties.grid);
        var ty = Math.floor(player.py / levelProperties.grid) + 1;
        if (tx >= 0 && tx < levelProperties.gridWidth && ty >= 0 && ty < levelProperties.gridHeight) {
            levelMap[tx][ty] = 1;
        }
    }
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
    */

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

    // Move camera:

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

    /*
    if (camera.shake > 0) {
        camera.dx += Math.floor(Math.sin(camera.shake) * camera.shake / 5);
        //camera.dy += Math.floor(Math.cos(camera.shake) * camera.shake / 10);
        camera.shake -= delta;
    }
    */

    objects.x = -camera.dx;
    objects.y = -camera.dy;

    // Check checkpoints:

    for (var n = 0; n < checkpoints.children.length; n++) {
        var cp = checkpoints.children[n];
        if (Math.abs(player.px - cp.x - levelProperties.grid / 2) < 48 && Math.abs(player.py - cp.y - levelProperties.grid / 2) < 80) {
            fullHealth();
            playerInvuln();
            if (cp.active == true) continue;
            if (lastCheckpoint.sprite != null) {
                lastCheckpoint.sprite.texture = PIXI.utils.TextureCache["checkpoint"];
                lastCheckpoint.sprite.active = false;
            }
            cp.active = true;
            cp.texture = PIXI.utils.TextureCache["checkpoint_active"];
            lastCheckpoint.x = cp.x + levelProperties.grid / 2;
            lastCheckpoint.y = cp.y + levelProperties.grid - 1;
            lastCheckpoint.sprite = cp;
            break;
        }
    }
    // Move enemies:

    for (var i = 0; i < fairies.children.length; i++) {
        var dist, tx, ty;

        var fairy = fairies.children[i];

        if (!fairy.visible) continue;

        // Check if fairy is attacked.
        if (player.cooldown > 35) {
            if (Math.abs(player.cx - fairy.heart.x) < 72 && Math.abs(player.cy - fairy.heart.y) < 62) {
                fairy.visible = false;
                fairy.heart.visible = false;
            }
        }

        fairy.vvx += (Math.random() - 0.5) * delta * 0.1;
        fairy.vvy += (Math.random() - 0.5) * delta * 0.1;
        dist = Math.sqrt(Math.pow(fairy.vvx, 2) + Math.pow(fairy.vvy, 2));
        if (dist > 2) {
            fairy.vvx *= 2 / dist;
            fairy.vvy *= 2 / dist;
        }

        fairy.vx += fairy.vvx * delta;
        fairy.vy += fairy.vvy * delta;

        fairy.vx += (Math.random() - 0.5) * delta * 0.1;
        fairy.vy += (Math.random() - 0.5) * delta * 0.1;
        dist = Math.sqrt(Math.pow(fairy.vx, 2) + Math.pow(fairy.vy, 2));
        if (dist > 2) {
            fairy.vx *= 2 / dist;
            fairy.vy *= 2 / dist;
        }
        fairy.hx += fairy.vx * delta;
        fairy.hy += fairy.vy * delta;

        tx = fairy.hx - fairy.hauntX;
        ty = fairy.hy - fairy.hauntY;
        dist = Math.sqrt(Math.pow(tx, 2) + Math.pow(ty, 2));
        if (dist > 64) {
            tx *= 64 / dist;
            ty *= 64 / dist;
            fairy.hx = fairy.hauntX + tx;
            fairy.hy = fairy.hauntY + ty;
        }

        // TODO: This and the player camera equivalent are supposed to be affected by delta.
        fairy.x = (fairy.x * 49 + fairy.hx) / 50;
        fairy.y = (fairy.y * 49 + fairy.hy) / 50;

        if (fairy.cooldown_1 > 0) {
            fairy.cooldown_1 -= delta;
        }

        dist = Math.sqrt(Math.pow(player.cx - fairy.x, 2) + Math.pow(player.cy - fairy.y, 2));
        if (!fairy.super && dist < 128 && fairy.cooldown_2 >= 2) {
            fairy.texture = PIXI.utils.TextureCache["fairy_charge 3"];
            fairy.super = true;
        }
        if ((dist < 256 || fairy.cooldown_2 < 2 || fairy.super == true) && dist > 0) { //added >0 to avoid potential divide by zero
            if (fairy.cooldown_1 < 1) {
                fairy.cooldown_1 = 100 * (Math.random() + 0.5);
                if (fairy.super) {
                    for (var j = 0; j < 12; j++) {
                        fireBullet_1(
                            fairy.x,
                            fairy.y,
                            Math.sin(Math.PI * j * 2 / 12) * 5,
                            Math.cos(Math.PI * j * 2 / 12) * 5,
                            "bullet 3",
                            1
                        );
                    }
                } else {
                    fairy.cooldown_2--;
                    fireBullet_1(
                        fairy.x,
                        fairy.y,
                        (player.cx - fairy.x) / dist * 3,
                        (player.cy - fairy.y) / dist * 3,
                        "bullet 1",
                        0
                    );
                    if (fairy.cooldown_2 < 1) {
                        fairy.cooldown_2 = 4 + Math.random() * 2.5;
                        fireBullet_1(
                            fairy.x,
                            fairy.y,
                            (player.cx - fairy.x) / dist * 7,
                            (player.cy - fairy.y) / dist * 7,
                            "bullet 2",
                            0
                        );
                        fairy.texture = PIXI.utils.TextureCache["fairy"];
                    }
                }
                fairy.super = false;
                if (fairy.cooldown_2 < 2) {
                    fairy.texture = PIXI.utils.TextureCache["fairy_charge 2"];
                } else {
                    fairy.texture = PIXI.utils.TextureCache["fairy"];
                }
            }
        }
    }

    for (var i = 0; i < bullets_1.length; i++) {
        if (bullets_1[i].active) {
            // Check if bullet is attacked.
            if (bullets_1[i].type == 1) {
                if (player.cooldown > 35) {
                    if (Math.abs(player.cx - bullets_1[i].sprite.x) < 72 && Math.abs(player.cy - bullets_1[i].sprite.y) < 62) {
                        //bullets_1[i].sprite.scale.x *= -1;
                        //bullets_1[i].vx *= -1;
                        //bullets_1[i].age = 0;
                        bullets_1[i].active = false;
                        bullets_1[i].sprite.visible = false;
                    }
                }
                for (var n = 0; n < waves.length; n++) {
                    if (waves[n].active && Math.abs(bullets_1[i].sprite.x - waves[n].sprite.x) < 64 && Math.abs(bullets_1[i].sprite.y - waves[n].sprite.y) < 64) {
                        bullets_1[i].active = false;
                        bullets_1[i].sprite.visible = false;
                    }
                }
            }
            // Check if player is attacked.
            if (Math.abs(player.cx - bullets_1[i].sprite.x) < 32 && Math.abs(player.cy - bullets_1[i].sprite.y) < 48) {
                loseHealth();
                /*
                if (health.lives <= 0) {
                    playerCheckpoint();
                    fullHealth();
                } else {
                    if (player.invuln < 1) loseHealth();
                    playerInvuln();
                }
                */
                bullets_1[i].active = false;
                bullets_1[i].sprite.visible = false;
                continue;
            }
            bullets_1[i].sprite.x += bullets_1[i].vx * delta;
            bullets_1[i].sprite.y += bullets_1[i].vy * delta;
            bullets_1[i].age += delta;
            if (bullets_1[i].age > 400) {
                bullets_1[i].active = false;
                bullets_1[i].sprite.visible = false;
            }
        }
    }

    for (var i = 0; i < bullets_2.length; i++) {
        if (bullets_2[i].active) {
            bullets_2[i].sprite.x += bullets_2[i].vx * delta;
            bullets_2[i].sprite.y += bullets_2[i].vy * delta;
            bullets_2[i].age -= delta;
            if (bullets_2[i].age < 1) {
                bullets_2[i].active = false;
                bullets_2[i].sprite.visible = false;
            }
        }
    }

    for (var i = 0; i < waves.length; i++) {
        if (waves[i].active) {
            waves[i].sprite.x += waves[i].vx * delta;
            waves[i].sprite.y += waves[i].vy * delta;
            waves[i].age += delta;
            if (waves[i].age > 400) {
                waves[i].active = false;
                waves[i].sprite.visible = false;
            } else {
                var ii = Math.floor(waves[i].sprite.x / levelProperties.grid);
                var jj = Math.floor(waves[i].sprite.y / levelProperties.grid);
                if (ii >= 0 && ii < levelProperties.gridWidth && jj >= 0 && jj < levelProperties.gridHeight) {
                    if (tileType.index[levelMap[ii][jj]].coll == 1) {
                        //waves[i].sprite.visible = true;
                    } else {
                        //waves[i].sprite.visible = false;
                    }
                }
            }
        }
    }

    if (player.cx >= 38 * levelProperties.grid && player.cx < 62 * levelProperties.grid) {
        waveTimer -= delta;
        if (waveTimer < 1) {
            waveTimer = 100;
            //var dir = Math.floor(Math.random() * 2) * 2 - 1;
            var dir = -1;
            var off = Math.floor(player.cy / levelProperties.grid) + Math.floor(Math.random() * 3) - 1;
            //fireWave(player.cx - 7 * levelProperties.grid * dir, levelProperties.grid * (off + 0.5), 8 * dir, 0);
            fireBullet_1(player.cx - 7 * levelProperties.grid * dir, levelProperties.grid * (off + 0.5), 8 * dir, 0, "wave 3 f1", 1);
        }
    }

    // Arrange tiles:

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
            if (jj < levelProperties.tileDisplayY / 2) {
                n = tileType.air.id;
            } else {
                n = tileType.wall.id;
            }
            var iii = Math.min(Math.max(ii, 0), levelProperties.gridWidth - 1);
            var jjj = Math.min(Math.max(jj, 0), levelProperties.gridHeight - 1);
            //if (ii >= 0 && ii < levelProperties.gridWidth && jj >= 0 && jj < levelProperties.gridHeight)
            if (jj < levelProperties.gridHeight)
                n = levelMap[iii][jjj];
            if (n >= 0 && n < tileType.index.length) {
                graphicMap[i][j].texture = PIXI.utils.TextureCache[tileType.index[n].name];
            } else {
                graphicMap[i][j].texture = PIXI.utils.TextureCache["backdrop"];
            }
        }
    }
}

function fireBullet_1(x, y, vx, vy, texture, type) {
    var maxAge = -1;
    var maxId = 0;
    for (var i = 0; i < bullets_1.length; i++) {
        if (!bullets_1[i].active) {
            bullets_1[i].active = true;
            bullets_1[i].sprite.visible = true;
            bullets_1[i].sprite.x = x;
            bullets_1[i].sprite.y = y;
            bullets_1[i].vx = vx;
            bullets_1[i].vy = vy;
            bullets_1[i].age = 0;
            bullets_1[i].sprite.texture = PIXI.utils.TextureCache[texture];
            bullets_1[i].type = type;
            if (vx != 0) bullets_1[i].sprite.scale.x = -Math.sign(vx);
            return;
        }
        if (bullets_1[i].age > maxAge) {
            maxAge = bullets_1[i].age;
            maxId = i;
        }
    }
    bullets_1[maxId].sprite.x = x;
    bullets_1[maxId].sprite.y = y;
    bullets_1[maxId].vx = vx;
    bullets_1[maxId].vy = vy;
    bullets_1[maxId].age = 0;
    bullets_1[maxId].sprite.texture = PIXI.utils.TextureCache[texture];
    bullets_1[maxId].type = type;
    if (vx != 0) bullets_1[maxId].sprite.scale.x = -Math.sign(vx);
}

function fireBullet_2(x, y, vx, vy, texture, lifespan) {
    var maxAge = -1;
    var maxId = 0;
    for (var i = 0; i < bullets_2.length; i++) {
        if (!bullets_2[i].active) {
            bullets_2[i].active = true;
            bullets_2[i].sprite.visible = true;
            bullets_2[i].sprite.x = x;
            bullets_2[i].sprite.y = y;
            bullets_2[i].vx = vx;
            bullets_2[i].vy = vy;
            bullets_2[i].age = lifespan;
            bullets_2[i].sprite.texture = PIXI.utils.TextureCache[texture];
            if (vx != 0) bullets_2[i].sprite.scale.x = -Math.sign(vx);
            return;
        }
        if (bullets_2[i].age > maxAge) {
            maxAge = bullets_2[i].age;
            maxId = i;
        }
    }
    bullets_2[maxId].sprite.x = x;
    bullets_2[maxId].sprite.y = y;
    bullets_2[maxId].vx = vx;
    bullets_2[maxId].vy = vy;
    bullets_2[maxId].age = lifespan;
    bullets_2[maxId].sprite.texture = PIXI.utils.TextureCache[texture];
    if (vx != 0) bullets_2[maxId].sprite.scale.x = -Math.sign(vx);
}

function fireWave(x, y, vx, vy) {
    var maxAge = -1;
    var maxId = 0;
    for (var i = 0; i < waves.length; i++) {
        if (!waves[i].active) {
            waves[i].active = true;
            waves[i].sprite.visible = true;
            waves[i].sprite.x = x;
            waves[i].sprite.y = y;
            waves[i].vx = vx;
            waves[i].vy = vy;
            waves[i].age = 0;
            waves[i].sprite.scale.x = -Math.sign(vx);
            return;
        }
        if (waves[i].age > maxAge) {
            maxAge = waves[i].age;
            maxId = i;
        }
    }
    waves[maxId].sprite.x = x;
    waves[maxId].sprite.y = y;
    waves[maxId].vx = vx;
    waves[maxId].vy = vy;
    waves[maxId].age = 0;
    waves[maxId].sprite.scale.x = -Math.sign(vx);
}

function fullHealth() {
    health.lives = health.maxLives;
    for (var n = 0; n < health.maxLives; n++) {
        health.children[n].visible = true;
    }
    styleHealth();
    for (var n = 0; n < fairies.children.length; n++) {
        var fairy = fairies.children[n];
        fairy.visible = true;
        fairy.heart.visible = true;
        fairy.texture = PIXI.utils.TextureCache["fairy"];
        fairy.cooldown_1 = 100;
        fairy.cooldown_2 = 4;
        fairy.super = false;
    }
}

function loseHealth() {
    if (player.invuln >= 1) return;
    if (health.lives <= 0) {
        if (!godMode) playerCheckpoint();
        fullHealth();
        playerInvuln();
        return;
    }
    health.lives--;
    health.children[health.lives].visible = false;
    styleHealth();
    //camera.shake = 10;
    //player.shake = 20;
    fireBullet_2(player.cx, player.cy, 0, -1, "life", 50);
    playerInvuln();
}

function styleHealth() {
    for (var n = 0; n < health.maxLives; n++) {
        if (n < health.lives) {
            health.children[n].visible = true;
            health.children[n].y = Math.floor(Math.sin(n * 4 * health.maxLives / health.lives) * 5);
        } else {
            health.children[n].visible = false;
        }
    }
}

function playerInvuln() {
    player.invuln = 20;
}

function playerCheckpoint() {
    player.px = lastCheckpoint.x;
    player.py = lastCheckpoint.y;
    player.vx = 0;
    player.vy = 0;
}
