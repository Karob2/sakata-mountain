"use strict";

var logo;
var gui_overlay;
var title_overlay;

var levelProperties;
var levelScene;
var camera;
var objects;
var player, fairies, bullets_1, bullets_2, waves, slashFx, checkpoints, health, hina, hinaballs;
var walls;
var levelMap, graphicMap;
var playerAnimations;
var tileType;
var waveTimer;
var lastCheckpoint = {};
// DEBUG:
//var gx, gy;
var godMode = false;
var killCounter;
var stopwatch = {};
//var fullscreen_object = [];

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
    player.hasSlashed = true;
    player.invuln = 0;
    //player.shake = 0;

    // DEBUG:
    //player.px = levelProperties.width - levelProperties.grid * 11.5;
    //player.py = levelProperties.height - levelProperties.grid - 1;


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
        o.heart = new PIXI.Sprite(spriteAtlas["heart_new"]);
        o.heart.anchor.set(0.5, 0.5);
        o.heart.x = o.x;
        o.heart.y = o.y;
        o.heart.new = true;
        objects.addChild(o.heart);
    }

    hina = new PIXI.Container();
    hina.x = levelProperties.width - levelProperties.grid * 2.5;
    hina.y = levelProperties.height - levelProperties.grid * 3.75 - 1;
    objects.addChild(hina);
    o = new PIXI.Sprite(spriteAtlas["hina"]);
    o.anchor.set(0.5, 0.5);
    o.scale.x = -1;
    hina.addChild(o);
    hina.cooldown = 0;
    hina.chain = 0;

    hinaballs = new PIXI.Container();
    hinaballs.layer1 = 6;
    hinaballs.layer2 = 6;
    hinaballs.layer3 = 6;
    hinaballs.layer4 = 6;
    hina.addChild(hinaballs);
    for (var i = 0; i < hinaballs.layer1 + hinaballs.layer2 + hinaballs.layer3 + hinaballs.layer4; i++) {
        o = new PIXI.Sprite(spriteAtlas["hinaball"]);
        o.anchor.set(0.5, 0.5);
        o.x = Math.sin(i * 2 * Math.PI / 30) * i * 6;
        o.y = Math.cos(i * 2 * Math.PI / 30) * i * 6;
        o.blink = 0;
        hinaballs.addChild(o);
    }
    hinaballs.delta = 0;

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

    /*
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
    */

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

    gui_overlay = new PIXI.Container();
    levelScene.addChild(gui_overlay);

    health = new PIXI.Container();
    health.x = 10;
    health.y = 6;
    health.maxLives = 6;
    health.lives = health.maxLives;
    gui_overlay.addChild(health);
    for (var n = 0; n < health.maxLives; n++) {
        o = new PIXI.Sprite(spriteAtlas["life"]);
        o.x = n * 32;
        o.y = 0;
        health.addChild(o);
    }
    styleHealth();

    killCounter = {};
    o = new PIXI.Sprite(spriteAtlas["heart_new"]);
    //fullscreen_object.push(o);
    o.x = gameProperties.width - 32 - 10;
    o.y = 6;
    gui_overlay.addChild(o);
    killCounter.sprite = o;
    killCounter.kills = 0;
    //var style = new PIXI.TextStyle({fontFamily: "serif", fontSize: 20, fill: "white"});
    //var message = new PIXI.Text("0", style);
    var message = new PIXI.extras.BitmapText("0", {font: '20px Pixellari', align: 'right', tint: '0xffffff'});
    message.x = o.x - 4;
    message.y = o.y + 5;
    message.anchor.set(1, 0);
    //fullscreen_object.push(message);
    killCounter.num = message;
    gui_overlay.addChild(message);    

    stopwatch.started = false;
    stopwatch.start = Date.now();
    //style = new PIXI.TextStyle({fontFamily: "Lucida Console", fontSize: 20, fill: "white"});
    //message = new PIXI.Text("0", style);
    message = new PIXI.extras.BitmapText("0", {font: '20px Pixellari', align: 'left', tint: '0xffffff'});
    message.x = 10;
    message.y = gameProperties.height - 30;
    //fullscreen_object.push(message);
    stopwatch.message = message;
    gui_overlay.addChild(message);

    title_overlay = new PIXI.Container();
    levelScene.addChild(title_overlay);

    logo = new PIXI.Sprite(logoAtlas["logo"]);
    logo.x = gameProperties.width / 2 - 294 / 2;
    logo.y = gameProperties.height / 4 - 115 / 2;
    title_overlay.addChild(logo);
    //fullscreen_object.push(logo);

    var logoBottom = logo.y + 115;
    var menuCenter = (gameProperties.height + logoBottom) / 2;
    message = createText("Start", gameProperties.width / 2,
        menuCenter - 12, startLevel);
    title_overlay.addChild(message);
    message = createText("Credits", gameProperties.width / 2,
        menuCenter + 12, startLevel);
    title_overlay.addChild(message);

    message = createText(
        "v0.01",
        10,
        gameProperties.height - 10
    );
    message.font.size = 16;
    message.anchor.set(0, 1);
    title_overlay.addChild(message);

    gui_overlay.visible = false;
    title_overlay.visible = true;

    importLevelMap();
}

function createText (text, x, y, buttonCall) {
    var message = new PIXI.extras.BitmapText(text, {font: '20px Pixellari', align: 'left', tint: '0xffffff'});
    message.x = x;
    message.y = y;
    message.anchor.set(0.5);
    if (buttonCall != null) {
        message.hitArea = new PIXI.Rectangle(-40, -10, 80, 20);
        message.interactive = true;
        message.buttonMode = true;
        message.on('pointerover', menu_over);
        message.on('pointerout', menu_out);
        message.on('pointerup', menu_up);
        message.on('pointerupoutside', menu_upoutside);
        message.on('pointerdown', menu_down);
        message.clickAction = buttonCall;
    }
    return message;
}

function levelResize() {
    killCounter.sprite.x = gameProperties.width - 32 - 10;
    killCounter.num.x = killCounter.sprite.x - 4;
    stopwatch.message.y = gameProperties.height - 30;
    logo.x = gameProperties.width / 2 - 294 / 2;
    logo.y = gameProperties.height / 4 - 115 / 2;
    var logoBottom = logo.y + 115;
    var menuCenter = (gameProperties.height + logoBottom) / 2;
    title_overlay.children[1].x = gameProperties.width / 2;
    title_overlay.children[1].y = menuCenter - 12;

    title_overlay.children[2].x = gameProperties.width / 2;
    title_overlay.children[2].y = menuCenter + 12;

    title_overlay.children[3].y = gameProperties.height - 10;
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
    if (ii < 0) return 1;
    if (ii > levelProperties.gridWidth - 1) return 1;
    if (jj > levelProperties.gridHeight - 1) return 1;
    return 0;
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

var elapsed = 0;
var titleCamera = {x: 0, y: 0, hx: 0, hy: 0, vx: 0, vy: 0, vvx: 0, vvy: 0, timer: 9999, ticker: 0};
function play_title(delta) {
    var dist, tx, ty;

    /*
    titleCamera.timer += delta;
    if (titleCamera.timer > 400) {
        titleCamera.timer = 0;
        //var tdir = Math.random() * 2 * Math.PI;
        //titleCamera.hx = Math.sin(tdir) * 6;
        //titleCamera.hy = Math.cos(tdir) * 6;
        titleCamera.ticker++;
        if (titleCamera.ticker >= 4) titleCamera.ticker = 0;
        dist = 10;
        titleCamera.hx = dist;
        if (titleCamera.ticker < 2) titleCamera.hx = -dist;
        titleCamera.hy = dist;
        if (titleCamera.ticker % 2) titleCamera.hy = -dist;
    }
    */

    /*
    tx = titleCamera.hx - titleCamera.x;
    ty = titleCamera.hy - titleCamera.y;
    //dist = Math.sqrt(Math.pow(tx, 2) + Math.pow(ty, 2));
    //var damp = Math.min(dist, 5) / 5;
    titleCamera.vvx = tx / 1000;
    titleCamera.vvy = ty / 1000;

    titleCamera.vx += titleCamera.vvx * delta / 10;
    titleCamera.vy += titleCamera.vvy * delta / 10;

    titleCamera.x += titleCamera.vx * delta;
    titleCamera.y += titleCamera.vy * delta;

    dist = Math.sqrt(Math.pow(titleCamera.x, 2) + Math.pow(titleCamera.y, 2));
    titleCamera.vx /= 1 + (dist / 1000);
    titleCamera.vy /= 1 + (dist / 1000);
    */

    elapsed += delta;
    titleCamera.x = Math.cos(elapsed / 200) * 6 + 6;
    titleCamera.y = Math.sin(elapsed / 100) * 10 + 10;

    gui_overlay.visible = false;
    title_overlay.visible = true;
    if (keys.a.held && keys.a.toggled) {
        keys.a.toggled = false;
        startLevel();
        return;
    }
    camera.px = gameProperties.width * 1 / 3;
    camera.py = -gameProperties.height * 1 / 3 + 2;
    camera.px += titleCamera.x;
    camera.py += titleCamera.y;
    camera.x = player.px + camera.px;
    camera.y = player.py + camera.py;
    camera.dx = Math.round(camera.x) - gameProperties.width / 2;
    camera.dy = Math.round(camera.y) - gameProperties.height / 2;
    player.x = player.px;
    player.y = player.py;
    arrangeTiles();
}
function startLevel() {
    PIXI.sound.play('sfx_menu');
    gui_overlay.visible = true;
    title_overlay.visible = false;
    start_stage("level", 1);

    //substate = 1;
    //state = play;
}

function play(delta) {
    // Move Player:

    player.vy += 0.5 * delta
    player.vx *= Math.pow(0.9, delta);
    player.vy *= Math.pow(0.99, delta);
    if (player.cx >= 5632 && player.cy > 1088) {
        player.vx *= Math.pow(0.85, delta);
    }

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
    /*
    gx = Math.floor(player.cx / levelProperties.grid);
    gy = Math.floor(player.cy / levelProperties.grid);
    */

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
            PIXI.sound.play('sfx_slash');
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
            //fireWave(player.cx, player.cy, 8 * player.scale.x, 0);
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
    /*
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
    */

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
        player.look = -2;
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
    camera.dy = Math.round(camera.y) - gameProperties.height / 2 - 2;

    /*
    if (camera.shake > 0) {
        camera.dx += Math.floor(Math.sin(camera.shake) * camera.shake / 5);
        //camera.dy += Math.floor(Math.cos(camera.shake) * camera.shake / 10);
        camera.shake -= delta;
    }
    */

    // Check checkpoints:

    for (var n = 0; n < checkpoints.children.length; n++) {
        var cp = checkpoints.children[n];
        if (Math.abs(player.px - cp.x - levelProperties.grid / 2) < 48 && Math.abs(player.py - cp.y - levelProperties.grid / 2) < 80) {
            var doSfx;
            if (health.lives == health.maxLives) {
                doSfx = true;
            } else {
                PIXI.sound.play('sfx_checkpoint');
                doSfx = false;
            }
            fullHealth();
            playerInvuln();
            if (cp.active == true) continue;
            if (lastCheckpoint.sprite != null) {
                lastCheckpoint.sprite.texture = PIXI.utils.TextureCache["checkpoint"];
                lastCheckpoint.sprite.active = false;
            }
            if (doSfx) PIXI.sound.play('sfx_checkpoint');
            if (n == checkpoints.children.length - 1) {
                playMusic('bgm_boss');
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
                PIXI.sound.play('sfx_kill');
                fairy.visible = false;
                fairy.heart.visible = false;
                if (fairy.heart.new) {
                    fairy.heart.new = false;
                    fairy.heart.texture = PIXI.utils.TextureCache["heart_old"];
                    fireBullet_2(fairy.heart.x, fairy.heart.y, 0, -1, "heart_new", 50);
                    killCounter.kills++;
                    killCounter.num.text = killCounter.kills + "/" + fairies.children.length;
                }
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
                    PIXI.sound.play('sfx_bullet3');
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
                    PIXI.sound.play('sfx_bullet1');
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
                        PIXI.sound.play('sfx_bullet2');
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
                        PIXI.sound.play('sfx_block');
                        bullets_1[i].active = false;
                        bullets_1[i].sprite.visible = false;
                    }
                }
                /*
                for (var n = 0; n < waves.length; n++) {
                    if (waves[n].active && Math.abs(bullets_1[i].sprite.x - waves[n].sprite.x) < 64 && Math.abs(bullets_1[i].sprite.y - waves[n].sprite.y) < 64) {
                        bullets_1[i].active = false;
                        bullets_1[i].sprite.visible = false;
                    }
                }
                */
            }
            // Check if player is attacked.
            if (Math.abs(player.cx - bullets_1[i].sprite.x) < 20 && Math.abs(player.cy - bullets_1[i].sprite.y) < 48) {
                if (loseHealth(bullets_1[i].vx, player.vy / 2)) {
                    //player.vx = bullets_1[i].vx;
                    //player.vy /= 2;
                    //player.vy += bullets_1[i].vy;
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

/*
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
*/

    // Check if hina is attacked.
    if (player.cooldown > 35) {
        if (Math.abs(player.cx - hina.x) < 72 && Math.abs(player.cy - hina.y) < 62) {
            PIXI.sound.play('sfx_kill');
            hina.visible = false;
            //start_stage("end");
            showResults();
        }
    }

    hinaballs.delta += delta / 30;
    var hcl = hinaballs.children.length;
    for (var i = 0; i < hcl; i++) {
        var o;
        o = hinaballs.children[i];
        //o.x = -Math.sin(i * 2 * Math.PI / hcl + hinaballs.delta*0) * i / hcl * 200 * hinaballs.delta/20;
        //o.y = -Math.cos(i * 2 * Math.PI / hcl + hinaballs.delta*0) * i / hcl * 200 * hinaballs.delta/20;
        /*
        if (i < hinaballs.layer1) {
            o.x = Math.sin(i * 2 * Math.PI / hinaballs.layer1 + hinaballs.delta*1.0) * 64;
            o.y = Math.cos(i * 2 * Math.PI / hinaballs.layer1 + hinaballs.delta*1.0) * 64;
        } else if (i < hinaballs.layer1 + hinaballs.layer2) {
            o.x = Math.sin(i * 2 * Math.PI / hinaballs.layer2 + hinaballs.delta*0.8) * 114;
            o.y = Math.cos(i * 2 * Math.PI / hinaballs.layer2 + hinaballs.delta*0.8) * 114;
        } else if (i < hinaballs.layer1 + hinaballs.layer2 + hinaballs.layer3) {
            o.x = Math.sin(i * 2 * Math.PI / hinaballs.layer3 + hinaballs.delta*0.6) * 164;
            o.y = Math.cos(i * 2 * Math.PI / hinaballs.layer3 + hinaballs.delta*0.6) * 164;
        } else {
            o.x = Math.sin(i * 2 * Math.PI / hinaballs.layer4 + hinaballs.delta*0.4) * 214;
            o.y = Math.cos(i * 2 * Math.PI / hinaballs.layer4 + hinaballs.delta*0.4) * 214;
        }
        */
        if (i < hinaballs.layer1) {
            o.x = Math.sin(i * 2 * Math.PI / hinaballs.layer1 + hinaballs.delta*0.4 + Math.PI/2) * 214 + 320;
            o.y = Math.cos(i * 2 * Math.PI / hinaballs.layer1 + hinaballs.delta*0.4 + Math.PI/2) * 214;
        } else if (i < hinaballs.layer1 + hinaballs.layer2) {
            o.x = Math.sin(i * 2 * Math.PI / hinaballs.layer2 + hinaballs.delta*0.4) * 214 + 160;
            o.y = Math.cos(i * 2 * Math.PI / hinaballs.layer2 + hinaballs.delta*0.4) * 214;
        } else if (i < hinaballs.layer1 + hinaballs.layer2 + hinaballs.layer3) {
            o.x = Math.sin(i * 2 * Math.PI / hinaballs.layer3 + hinaballs.delta*0.4 + Math.PI/2) * 214 + 0;
            o.y = Math.cos(i * 2 * Math.PI / hinaballs.layer3 + hinaballs.delta*0.4 + Math.PI/2) * 214;
        } else {
            o.x = Math.sin(i * 2 * Math.PI / hinaballs.layer4 + hinaballs.delta*0.4) * 214 - 160;
            o.y = Math.cos(i * 2 * Math.PI / hinaballs.layer4 + hinaballs.delta*0.4) * 214;
        }

        // Check if player is attacked.
        //o.visible = false; // DEBUG
        if (o.blink > 0) {
            o.blink--;
        } else if (o.visible) {
            o.alpha = 1;
            if (Math.abs(player.cx - o.x - hina.x) < 30 && Math.abs(player.cy - o.y - hina.y) < 48) {
                if (loseHealth(-2, -2)) {
                    o.blink = 50;
                    o.alpha = 0.5;
                    continue;
                }
            }
        }
    }

    if (player.cx >= 5632 && player.cy > 1088) {

        waveTimer -= delta;
        if (waveTimer < 1) {
            waveTimer = 100;
            var dir = -1;
            for (var n = -2; n <= 2; n++) {
                fireBullet_1(player.cx - 7 * levelProperties.grid * dir, hina.y + n * levelProperties.grid, 8 * dir, 0, "wave 3 f1", 1);
            }
            PIXI.sound.play('sfx_bullet1');
        }


        dist = Math.sqrt(Math.pow(player.cx - hina.x, 2) + Math.pow(player.cy - hina.y, 2));

        if (hina.cooldown > 0) {
            hina.cooldown -= delta;
        }
        if (hina.cooldown < 1) {
            if (hina.chain < 1) {
                hina.cooldown = 10;
                hina.chain++;
            } else {
                hina.cooldown = 200;
                hina.chain = 0;
            }
            
            fireBullet_1(
                hina.x,
                hina.y,
                (player.cx - hina.x) / dist * 3,
                (player.cy - hina.y) / dist * 3,
                "hinadoll",
                0
            );
            
            //PIXI.sound.play('sfx_bullet2');
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
            PIXI.sound.play('sfx_bullet1');
        }
    }

    // Arrange tiles:
    arrangeTiles();

    if (!stopwatch.started) {
        stopwatch.start = Date.now();
        if (keys.up.held || keys.down.held || keys.left.held || keys.right.held || keys.b.held) {
            stopwatch.started = true;
            //playMusic('bgm_level');
        }
    }
    stopwatch.message.text = Math.floor((Date.now() - stopwatch.start) / 1000);
}
function arrangeTiles() {
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

function loseHealth(vx, vy) {
    /*
    if (player.invuln < 1 | player.cx >= 5632 && player.cy > 1088) {
        player.vx = vx;
        player.vy = vy;
    }
    */
    if (player.invuln >= 1) return false;
    player.vx = vx;
    player.vy = vy;
    if (health.lives <= 0 || player.cx >= 5632 - 64 && player.cy > 1088) {
        if (!godMode) playerCheckpoint();
        PIXI.sound.play('sfx_respawn');
        fullHealth();
        playerInvuln();
        return true;
    }
    PIXI.sound.play('sfx_pain');
    health.lives--;
    health.children[health.lives].visible = false;
    styleHealth();
    //camera.shake = 10;
    //player.shake = 20;
    fireBullet_2(player.cx, player.cy, 0, -1, "life", 50);
    if (!(player.cx >= 5632 && player.cy > 1088)) playerInvuln();
    return true;
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
    waveTimer = 3;
    hina.cooldown = 3;
    hina.chain = 0;
    for (var i = 0; i < bullets_1.length; i++) {
        bullets_1[i].active = false;
        bullets_1[i].sprite.visible = false;
    }
}

var resultsPage;
var resultsScene;
function showResults() {
    state = results;

    resultsScene = new PIXI.Container();
    levelScene.addChild(resultsScene);
    resultsPage = 0;

    var o;
    o = new PIXI.Graphics();
    o.beginFill(0x000000);
    o.drawRect(0, 0, gameProperties.width - 64, gameProperties.height - 64);
    o.endFill();
    o.x = 32;
    o.y = 32;
    resultsScene.addChild(o);

    var style = new PIXI.TextStyle({fontFamily: "serif", fontSize: 20, fill: "white", wordWrap: true, wordWrapWidth: gameProperties.width - 96});
    var text = "Defeated, Hina explained that misfortune had spread over the mountain side, and that she was trying to contain it.";
    if (killCounter.kills <= 18) {
        text = text + " \"You defeated me, but the mountain is still covered in misfortune!\" Hina scolded.\n\nNemuno realized that it was too dangerous to go foraging right now.\n\n[BAD END]";
    } else if (killCounter.kills < 35) {
        text = text + " \"I see now that you've cleared away most of the misfortune,\" Hina praised. \"I was wrong to doubt you.\"\n\nThe two then teamed up to resolve the incident.\n\n[GOOD END]";
    } else {
        text = text + " \"Wait, where did the misfortune go?\" Hina asked. Nemuno explained that she had defeated all of it.\n\nShe then made a big pot of soup and shared it with Hina.\n\n[PERFECT END]";
    }
    var message = new PIXI.Text(text, style);
    message.x = 48;
    message.y = 48;
    //message.anchor.set(0.5);
    resultsScene.addChild(message);
}

/*
function showResults2() {
    var style = new PIXI.TextStyle({fontFamily: "serif", fontSize: 32, fill: "white"});
    var message = new PIXI.Text(killCounter.kills + "out of " + fairies.children.length + " enemies defeated.", style);
    message.x = gameProperties.width / 2;
    message.y = gameProperties.height / 4;
    message.anchor.set(0.5);
    resultsScene.addChild(message);
}
*/

function results(delta) {
    /*
    if (keys.a.held && keys.a.toggled) {
        keys.a.toggled = false;
        for (var i = gameScene.children.length - 1; i >= 0; i++) {
            gameScene.removeChild(gameScene.children[i]);
            console.log(1);
        }
        setGameSize();
        initialize();
    }
    */
}
