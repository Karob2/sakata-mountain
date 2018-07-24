"use strict"

var title_overlay;
var logo;
function initialize_menu() {
    title_overlay = new PIXI.Container();
    levelScene.addChild(title_overlay);

    logo = new PIXI.Sprite(logoAtlas["logo"]);
    logo.x = gameProperties.width / 2 - 294 / 2;
    logo.y = gameProperties.height / 4 - 115 / 2;
    title_overlay.addChild(logo);
    //fullscreen_object.push(logo);

    var logoBottom = logo.y + 115;
    var menuCenter = (gameProperties.height + logoBottom) / 2;
    var o;
    o = createText("Start", gameProperties.width / 2,
        menuCenter - 12, startLevel, play_title);
    title_overlay.addChild(o);
    o = createText("Options", gameProperties.width / 2,
        menuCenter + 12, showConfig, play_title);
    title_overlay.addChild(o);
    o = createText("Credits", gameProperties.width / 2,
        menuCenter + 36, showCredits, play_title);
    title_overlay.addChild(o);

    o = createText(
        "v0.01",
        10,
        gameProperties.height - 10
    );
    o.font.size = 16;
    o.anchor.set(0, 1);
    title_overlay.addChild(o);
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
    start_stage("level", 1);
    delayedStartDialog(dlg_intro);
    //substate = 1;
    //state = play;
}

function showConfig() {
    PIXI.sound.play('sfx_menu');

    var box = createPopup(levelScene, play_credits, gameProperties.preferred_width - 64, gameProperties.preferred_height - 64)//, 32, 32, gameProperties.width - 64, gameProperties.height - 64);
    var lineHeight = 20;
    var colWidth = 100;

    var o;
    o = createText("Fullscreen", 0, -lineHeight*4);
    //o.font.size = 16;
    o.font.tint = "0x000000";
    box.addChild(o);

    o = createText("fit", -colWidth, -lineHeight*3, () => aspectMode("fit"), play_credits);
    o.font.size = 16;
    box.addChild(o);

    o = createText("crop", 0, -lineHeight*3, () => aspectMode("crop"), play_credits);
    o.font.size = 16;
    box.addChild(o);

    o = createText("stretch", colWidth, -lineHeight*3, () => aspectMode("stretch"), play_credits);
    o.font.size = 16;
    box.addChild(o);

    o = createText("Music", 0, -lineHeight*1);
    //o.font.size = 16;
    o.font.tint = "0x000000";
    box.addChild(o);

    o = createBar(controls.music, -100, -lineHeight*0 - lineHeight / 2, 200, lineHeight);
    box.addChild(o);

    o = createText("Sound Effects", 0, lineHeight*2);
    //o.font.size = 16;
    o.font.tint = "0x000000";
    box.addChild(o);

    o = createBar(controls.sfx, -100, lineHeight*3 - lineHeight / 2, 200, lineHeight);
    box.addChild(o);

    //o = createText("Okay", 140, 90, closePopup, play_credits);
    o = createText("Okay", 100 - 20,
        (gameProperties.preferred_height - 64) / 2 - 20 - 8, () => {closePopup(true)}, play_credits);
    //o.anchor.set(1, 1);
    box.addChild(o);
}

function showCredits() {
    PIXI.sound.play('sfx_menu');

    var box = createPopup(levelScene, play_credits, gameProperties.preferred_width * 3 / 4, gameProperties.preferred_height - 64)//, 32, 32, gameProperties.width - 64, gameProperties.height - 64);
    var o;

    o = createText("Sakata Mountain by Karob\nCreated with PixiJS\n\nMusic: Karob\nOriginal: ZUN\n\nCricket sfx by RHumphries under CC BY 3.0\n\nFont: Pixellari by Zacchary Dempsey-Plante", -(gameProperties.preferred_width * 3 / 4) / 2 + 20, -(gameProperties.preferred_height - 64) / 2 + 20);
    o.anchor.set(0, 0);
    o.font.size = 16;
    o.font.tint = "0x000000";
    box.addChild(o);

    o = createText("Okay", 100 - 20,
        (gameProperties.preferred_height - 64) / 2 - 20 - 8, () => {closePopup(true)}, play_credits);
    //o.anchor.set(1, 1);
    box.addChild(o);
}

function showPause() {
    stopwatch.pause = Date.now();
    PIXI.sound.pause('bgm_level');
    PIXI.sound.pause('bgm_boss');

    var box = createPopup(levelScene, play_pause, gameProperties.preferred_width / 2, gameProperties.preferred_height * 3 / 5);
    var lineHeight = 20;
    var colWidth = 100;

    var o;
    o = createText("Paused", 0, lineHeight*-3);
    //o.font.size = 16;
    o.font.tint = "0x000000";
    box.addChild(o);

    o = createText("Options", 0, lineHeight*-1, () => showConfig(), play_pause);
    //o.font.size = 16;
    box.addChild(o);

    o = createText("Main Menu", 0, lineHeight*0.5, () => showRestart(), play_pause);
    //o.font.size = 16;
    box.addChild(o);

    o = createText("Resume", 0, lineHeight*2.5, () => unPause(), play_pause);
    //o.font.size = 16;
    box.addChild(o);
}
function showRestart() {
    PIXI.sound.play('sfx_menu');

    var box = createPopup(levelScene, play_pause, gameProperties.preferred_width * 3 / 5, gameProperties.preferred_height / 2);
    var lineHeight = 20;
    var colWidth = 100;

    var o;
    o = createText("Are you sure you want to restart?", 0, lineHeight*-1);
    //o.font.size = 16;
    o.font.tint = "0x000000";
    box.addChild(o);

    o = createText("Yes", -colWidth / 2, lineHeight*1, () => restartGame(), play_pause);
    box.addChild(o);

    o = createText("No", colWidth / 2, lineHeight*1, () => closePopup(true), play_pause);
    box.addChild(o);
}
function unPause() {
    if (stopwatch.started) {
        stopwatch.start += Date.now() - stopwatch.pause;
        stopwatch.message.text = Math.floor((Date.now() - stopwatch.start) / 1000);
    }
    PIXI.sound.resume('bgm_level');
    PIXI.sound.resume('bgm_boss');
    closePopup(true);
}
function play_pause() {
    if (keys.menu.held && keys.menu.toggled) {
        keys.menu.toggled = false;
        unPause();
    }
}
function restartGame() {
    PIXI.sound.play('sfx_menu');
    closeAllPopups();

    player.textures = playerAnimations.idle;
    player.px = levelProperties.grid * 1.5;
    player.py = levelProperties.height - levelProperties.grid - 1;
    player.vx = 0.5;
    player.vy = 0;
    player.cooldown = 0;
    player.direction = 1;
    player.hasJumped = false;
    player.hasSlashed = true;
    player.invuln = 0;

    //hina.visible = true;
    hina.cooldown = 0;
    hina.chain = 0;
    hinaballs.delta = 0;
    for (var i = 0; i < hinaballs.children.length; i++) {
        hinaballs.children[i].visible = false;
    }

    for (var i = 0; i < bullets_1.length; i++) {
        bullets_1[i].active = false;
        bullets_1[i].sprite.visible = false;
    }
    for (var i = 0; i < bullets_2.length; i++) {
        bullets_2[i].active = false;
        bullets_2[i].sprite.visible = false;
    }
    slashFx.children[0].visible = false;
    slashFx.children[1].visible = false;

    waveTimer = 10;

    lastCheckpoint.x = player.px;
    lastCheckpoint.y = player.py;

    health.lives = health.maxLives;
    styleHealth();

    killCounter.kills = 0;
    killCounter.num.text = "0";

    stopwatch.started = false;
    stopwatch.start = Date.now();
    stopwatch.message.text = "0";

    for (var i = 0; i < dialog.firstKeys.length; i++) {
        dialog.first[i] = false;
    }
    gui_overlay.visible = false;
    dialog.overlay.visible = false;
    bossState = 0;

    importLevelMap();
    start_stage("title", 1);
}

function play_credits() {
    if (keys.menu.held && keys.menu.toggled) {
        keys.menu.toggled = false;
        closePopup(true);
    }
}

var dlg_intro = [
    { message: "I wanted to gather some vegetables, but something is wrong on the mountain." }
]
var dlg_firstkill = [
    { message: "Whatever that was, it dropped a small orb.\nIt feels cold to the touch and distinctly unlucky." }
]
var dlg_firstwind = [
    { message: "This forest is usually quite serene, but something has agitated it." }
]
var dlg_firstclimb = [
    { message: "I can't climb any higher here..." }
]
var dlg_mtncalm = [
    { message: "The mountain feels a lot calmer now, but I still feel a strong presence to the east." }
]
var dlg_tunnel = [
    { message: "The kappa smuggle goods through this tunnel." }
]
var dlg_relief = [
    { message: "I'm glad that's over." }
]
var dlg_barrier = [
    { message: "Whoever set up those barriers doesn't want anybody getting through.\nI don't know why, but these orbs dispel them." }
]
var dlg_junction = [
    { message: "This is the sort of mess a kappa would leave behind." }
]
var dlg_boss = [
    { message: "You're not a kappa." },
    { message: "Neither are you.", face: 2 }
]

function delayedStartDialog(chain) {
    dialog.chain = chain;
    dialog.chainstep = 0;
    dialog.timer = 50;
    showDialog();
}
function startDialog(chain) {
    dialog.chain = chain;
    dialog.chainstep = 0;
    dialog.timer = 1;
    dialog.overlay.visible = true;
    showDialog();
}
function showDialog() {
    var message = dialog.chain[dialog.chainstep].message;
    var face = dialog.chain[dialog.chainstep].face;
    dialog.text = message.split(" ");
    dialog.textBuild = "";
    dialog.step = 0;
    dialog.message.text = "";
    if (face == null || face == 1) {
        /*
        dialog.face.visible = true;
        dialog.face2.visible = false;
        dialog.message.x = 88;
        */
        dialog.face.texture = PIXI.utils.TextureCache["player f1"];
    } else {
        /*
        dialog.face.visible = false;
        dialog.face2.visible = true;
        dialog.message.x = 15;
        */
        dialog.face.texture = PIXI.utils.TextureCache["hina"];
    }
    /*
    if (dialog.text.length > 0) {
        dialog.message.text = dialog.text[0];
    } else {
        dialog.message.text = "";
    }
    */
    //dialog.overlay.visible = true;
}
function ageDialog(delta) {
    dialog.timer -= delta;
    if (dialog.timer <= 0) {
        if (dialog.step < dialog.text.length) {
            if (dialog.step > 0) dialog.textBuild += " ";
            dialog.textBuild += dialog.text[dialog.step];
            dialog.message.text = dialog.textBuild;
            dialog.step++;
            dialog.timer = 3;
            if (dialog.step == dialog.text.length) {
                if (dialog.chainstep < dialog.chain.length - 1)
                    dialog.timer = 150;
                else
                    dialog.timer = 400;
            }
            dialog.overlay.visible = true;
        } else {
            if (dialog.chainstep < dialog.chain.length - 1) {
                dialog.chainstep++;
                dialog.timer = 10;
                showDialog();
            } else {
                dialog.overlay.visible = false;
                bossTimer = 500;
            }
        }
    }
}
