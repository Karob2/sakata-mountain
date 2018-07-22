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
    //substate = 1;
    //state = play;
}

function showConfig() {
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
        (gameProperties.preferred_height - 64) / 2 - 20 - 8, closePopup, play_credits);
    //o.anchor.set(1, 1);
    box.addChild(o);
}

function showCredits() {
    var box = createPopup(levelScene, play_credits, gameProperties.preferred_width * 3 / 4, gameProperties.preferred_height - 64)//, 32, 32, gameProperties.width - 64, gameProperties.height - 64);
    var o;

    o = createText("Sakata Mountain by Karob\nCreated with PixiJS\n\nMusic: Karob\nOriginal: ZUN\n\nCricket sfx by RHumphries under CC BY 3.0\n\nFont: Pixellari by Zacchary Dempsey-Plante", -(gameProperties.preferred_width * 3 / 4) / 2 + 20, -(gameProperties.preferred_height - 64) / 2 + 20);
    o.anchor.set(0, 0);
    o.font.size = 16;
    o.font.tint = "0x000000";
    box.addChild(o);

    o = createText("Okay", 100 - 20,
        (gameProperties.preferred_height - 64) / 2 - 20 - 8, closePopup, play_credits);
    //o.anchor.set(1, 1);
    box.addChild(o);
}

function showPause() {
    stopwatch.pause = Date.now();

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
    var box = createPopup(levelScene, play_pause, gameProperties.preferred_width * 3 / 5, gameProperties.preferred_height / 2);
    var lineHeight = 20;
    var colWidth = 100;

    var o;
    o = createText("Are you sure you want to restart?", 0, lineHeight*-1);
    //o.font.size = 16;
    o.font.tint = "0x000000";
    box.addChild(o);

    o = createText("Yes", -colWidth / 2, lineHeight*1, () => closePopup(), play_pause);
    box.addChild(o);

    o = createText("No", colWidth / 2, lineHeight*1, () => closePopup(), play_pause);
    box.addChild(o);
}
function unPause() {
    if (stopwatch.started) {
        stopwatch.start += Date.now() - stopwatch.pause;
        stopwatch.message.text = Math.floor((Date.now() - stopwatch.start) / 1000);
    }
    closePopup();
}
function play_pause() {
    if (keys.menu.held && keys.menu.toggled) {
        keys.menu.toggled = false;
        unPause();
    }
}

function play_credits() {
    if (keys.menu.held && keys.menu.toggled) {
        keys.menu.toggled = false;
        closePopup();
    }
}