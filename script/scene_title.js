"use strict"

var title_overlay, menu_first, menu_difficulty, menu_verbose;
var logo;
var titlemenu = [];
var activeTitlemenu = 0;
var configTitlemenu, creditsTitlemenu, pauseTitlemenu, restartTitlemenu; //, resultsTitlemenu;
var fullscreenSelector;
var musicControl, sfxControl;
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
    var newTitlemenu;
    var o;

    menu_first = new PIXI.Container();
    menu_first.x = gameProperties.width / 2;
    menu_first.y = menuCenter + 12;
    title_overlay.addChild(menu_first);
    newTitlemenu = {menu: [], active: 0, container: menu_first, state: play_title};
    o = createText("Start", 0, -24, chooseDifficulty, play_title);
    menu_first.addChild(o);
    newTitlemenu.menu.push({name: "Start", display: o, action: chooseDifficulty});
    o = createText("Options", 0, 0, showConfig, play_title);
    menu_first.addChild(o);
    newTitlemenu.menu.push({name: "Options", display: o, action: showConfig});
    o = createText("Credits", 0, 24, showCredits, play_title);
    menu_first.addChild(o);
    newTitlemenu.menu.push({name: "Credits", display: o, action: showCredits});
    titlemenu.push(newTitlemenu);

    menu_difficulty = new PIXI.Container();
    menu_difficulty.x = gameProperties.width / 2;
    menu_difficulty.y = menuCenter + 12;
    title_overlay.addChild(menu_difficulty);
    newTitlemenu = {menu: [], active: 1, container: menu_difficulty, state: play_difficulty};
    o = createText("Easy", 0, -36, () => {difficultyChosen(0)}, play_difficulty);
    menu_difficulty.addChild(o);
    newTitlemenu.menu.push({name: "Easy", display: o, action: () => {difficultyChosen(0)}});
    o = createText("Normal", 0, -12, () => {difficultyChosen(1)}, play_difficulty);
    menu_difficulty.addChild(o);
    newTitlemenu.menu.push({name: "Normal", display: o, action: () => {difficultyChosen(1)}});
    o = createText("Hard", 0, 12, () => {difficultyChosen(2)}, play_difficulty);
    menu_difficulty.addChild(o);
    newTitlemenu.menu.push({name: "Hard", display: o, action: () => {difficultyChosen(2)}});
    o = createText("Lunatic", 0, 36, () => {difficultyChosen(3)}, play_difficulty);
    menu_difficulty.addChild(o);
    newTitlemenu.menu.push({name: "Lunatic", display: o, action: () => {difficultyChosen(3)}});
    titlemenu.push(newTitlemenu);
    menu_difficulty.visible = false;

    difficulty = loadRangedInt("difficulty", 1, 0, 3);
    newTitlemenu.active = difficulty;

    menu_verbose = new PIXI.Container();
    menu_verbose.x = gameProperties.width / 2;
    menu_verbose.y = menuCenter + 12;
    title_overlay.addChild(menu_verbose);
    newTitlemenu = {menu: [], active: 0, container: menu_verbose, state: play_verbose};
    o = createText("Show Dialog", 0, -12, () => {verboseChosen(1)}, play_verbose);
    menu_verbose.addChild(o);
    newTitlemenu.menu.push({name: "Show Dialog", display: o, action: () => {verboseChosen(1)}});
    o = createText("Skip Dialog", 0, 12, () => {verboseChosen(0)}, play_verbose);
    menu_verbose.addChild(o);
    newTitlemenu.menu.push({name: "Skip Dialog", display: o, action: () => {verboseChosen(0)}});
    titlemenu.push(newTitlemenu);
    menu_verbose.visible = false;

    verbose = loadRangedInt("verbose", 1, 0, 1);
    newTitlemenu.active = (1 - verbose);

    configTitlemenu = titlemenu.length;
    titlemenu.push({menu: [], active: 0});
    creditsTitlemenu = titlemenu.length;
    titlemenu.push({menu: [], active: 0});
    pauseTitlemenu = titlemenu.length;
    titlemenu.push({menu: [], active: 0});
    restartTitlemenu = titlemenu.length;
    titlemenu.push({menu: [], active: 0});
    //resultsTitlemenu = titlemenu.length;
    //titlemenu.push({menu: [], active: 0});
    activateTitlemenu(0, 0);
    /*
    o = new PIXI.Sprite(spriteAtlas["bullet 1"]);
    o.anchor.set(0.5, 0.5);
    o.x = gameProperties.width / 2 - 40;
    o.y = menuCenter - 12;
    title_overlay.addChild(o);
    */

    o = createText(
        version_number,
        10,
        gameProperties.height - 10
    );
    o.font.size = 16;
    o.anchor.set(0, 1);
    title_overlay.addChild(o);
}

function activateTitlemenu(n, selected) {
    if (n == null) n = activeTitlemenu;
    if (selected != null) titlemenu[n].active = selected;
    updateTitlemenu(n);
    activeTitlemenu = n;
    titlemenu[0].container.visible = false;
    titlemenu[1].container.visible = false;
    titlemenu[2].container.visible = false;
    titlemenu[n].container.visible = true;
    state = titlemenu[n].state;
}
function initTitlemenu(n, selected) {
    if (selected != null) titlemenu[n].active = selected;
    updateTitlemenu(n);
}
function runTitlemenu(n, delta) {
    var tm = titlemenu[n];
    if (delta != null) {
        tm.active = Math.min(Math.max(tm.active + delta, 0), tm.menu.length - 1);
        updateTitlemenu(n);
    }
    if (keys.up.held && keys.up.toggled) {
        keys.up.toggled = false;
        if (tm.active > 0) {
            tm.active--;
        } else {
            tm.active = tm.menu.length - 1;
        }
        PIXI.sound.play('sfx_menu');
        updateTitlemenu(n);
    }
    if (keys.down.held && keys.down.toggled) {
        keys.down.toggled = false;
        if (tm.active < tm.menu.length - 1) {
            tm.active++;
        } else {
            tm.active = 0;
        }
        PIXI.sound.play('sfx_menu');
        updateTitlemenu(n);
    }
    if (keys.a.held && keys.a.toggled && tm.menu[tm.active].action != null) {
        keys.a.toggled = false;
        tm.menu[tm.active].action();
    }
    if (keys.left.held && keys.left.toggled && tm.menu[tm.active].leftAction != null) {
        keys.left.toggled = false;
        tm.menu[tm.active].leftAction();
    }
    if (keys.right.held && keys.right.toggled && tm.menu[tm.active].rightAction != null) {
        keys.right.toggled = false;
        tm.menu[tm.active].rightAction();
    }
}

var elapsed = 0;
var titleCamera = {x: 0, y: 0, hx: 0, hy: 0, vx: 0, vy: 0, vvx: 0, vvy: 0, timer: 9999, ticker: 0};
function previousTitlemenu() {
    activeTitlemenu--;
    if (activeTitlemenu < 0) activeTitlemenu = 0;
    activateTitlemenu();
}
function chooseDifficulty() {
    activateTitlemenu(1);
}
function difficultyChosen(val) {
    difficulty = val;
    saveData("difficulty", val);
    if (difficulty == 0) {
        health.maxLives = 6;
    } else if (difficulty == 1) {
        health.maxLives = 3;
    } else if (difficulty == 2) {
        health.maxLives = 3;
    } else {
        health.maxLives = 0;
    }
    health.lives = health.maxLives;
    styleHealth();
    chooseVerbose();
}
function chooseVerbose() {
    activateTitlemenu(2);
}
function verboseChosen(val) {
    verbose = val;
    saveData("verbose", val);
    startLevel();
}
function play_difficulty(delta) {
    play_title(delta);
    if (keys.b.held && keys.b.toggled) {
        keys.b.toggled = false;
        previousTitlemenu();
    } else if (keys.menu.held && keys.menu.toggled) {
        keys.menu.toggled = false;
        previousTitlemenu();
    }
}
function play_verbose(delta) {
    play_difficulty(delta);
}
function play_title(delta) {
    var dist, tx, ty;

    elapsed += delta;
    titleCamera.x = Math.cos(elapsed / 200) * 6 + 6;
    titleCamera.y = Math.sin(elapsed / 100) * 10 + 10;

    gui_overlay.visible = false;
    title_overlay.visible = true;
    /*
    if (keys.a.held && keys.a.toggled) {
        keys.a.toggled = false;
        startLevel();
        return;
    }
    */
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

    runTitlemenu(activeTitlemenu);
}

function startLevel() {
    hideCursor();
    PIXI.sound.play('sfx_menu');
    start_stage("level", 1);
    delayedStartDialog(dlg_intro);
    //substate = 1;
    //state = play;
}

function showConfig() {
    PIXI.sound.play('sfx_menu');

    var box = createPopup(levelScene, play_config, gameProperties.preferred_width - 64, gameProperties.preferred_height - 64)//, 32, 32, gameProperties.width - 64, gameProperties.height - 64);
    var lineHeight = 20;
    var colWidth = 100;

    var newTitlemenu = {menu: [], active: 0};

    var o;
    o = createText("Fullscreen", 0, -lineHeight*4);
    //o.font.size = 16;
    o.font.tint = "0x000000";
    box.addChild(o);
    newTitlemenu.menu.push({name: "Fullscreen", display: o, leftAction: () => aspectMode(-1), rightAction: () => aspectMode(-2)});

    o = createText("fit", -colWidth, -lineHeight*3, () => aspectMode(0), play_config);
    o.font.size = 16;
    box.addChild(o);

    o = createText("crop", 0, -lineHeight*3, () => aspectMode(1), play_config);
    o.font.size = 16;
    box.addChild(o);

    o = createText("stretch", colWidth, -lineHeight*3, () => aspectMode(2), play_config);
    o.font.size = 16;
    box.addChild(o);

    /*
    o = new PIXI.Sprite(spriteAtlas["bullet 1"]);
    o.anchor.set(0.5, 0.5);
    o.x = -colWidth;
    o.y = -lineHeight*3 + 16;
    box.addChild(o);
    */
    o = new PIXI.Graphics();
    o.beginFill(0xffffff);
    o.drawRect(0, 0, 64, 1);
    o.drawRect(0, 19, 64, 1);
    o.drawRect(0, 0, 1, 20);
    o.drawRect(63, 0, 1, 20);
    o.endFill();
    //o.x = -colWidth - 32;
    o.x = (aspect_mode - 1) * 100 - 32;
    o.y = -lineHeight*3 - 11;
    box.addChild(o);
    fullscreenSelector = o;

    o = createText("Music", 0, -lineHeight*1);
    //o.font.size = 16;
    o.font.tint = "0x000000";
    box.addChild(o);
    newTitlemenu.menu.push({name: "Music", display: o, leftAction: musicVolumeDown, rightAction: musicVolumeUp});

    o = createBar(controls.music, -100, -lineHeight*0 - lineHeight / 2, 200, lineHeight);
    box.addChild(o);
    musicControl = o;

    o = createText("Sound Effects", 0, lineHeight*2);
    //o.font.size = 16;
    o.font.tint = "0x000000";
    box.addChild(o);
    newTitlemenu.menu.push({name: "Sound Effects", display: o, leftAction: sfxVolumeDown, rightAction: sfxVolumeUp});

    o = createBar(controls.sfx, -100, lineHeight*3 - lineHeight / 2, 200, lineHeight);
    box.addChild(o);
    sfxControl = o;

    //o = createText("Okay", 140, 90, closePopup, play_config);
    o = createText("Okay", 100 - 20,
        (gameProperties.preferred_height - 64) / 2 - 20 - 8, () => {closePopup(true)}, play_config);
    //o.anchor.set(1, 1);
    box.addChild(o);
    newTitlemenu.menu.push({name: "Okay", display: o, action: () => {closePopup(true)}});

    titlemenu[configTitlemenu] = newTitlemenu;
    initTitlemenu(configTitlemenu, 0);
}

function showCredits() {
    PIXI.sound.play('sfx_menu');

    var box = createPopup(levelScene, play_credits, gameProperties.preferred_width * 3 / 4, gameProperties.preferred_height - 64)//, 32, 32, gameProperties.width - 64, gameProperties.height - 64);
    var o;

    var newTitlemenu = {menu: [], active: 0};

    o = createText("Sakata Mountain by Karob\nPowered by PixiJS\n\nMusic: Karob\nOriginal: ZUN\n\nCricket sfx by RHumphries under CC BY 3.0\n\nFont: Pixellari by Zacchary Dempsey-Plante", -(gameProperties.preferred_width * 3 / 4) / 2 + 20, -(gameProperties.preferred_height - 64) / 2 + 20);
    o.anchor.set(0, 0);
    o.font.size = 16;
    o.font.tint = "0x000000";
    box.addChild(o);

    o = createText("Okay", 100 - 20,
        (gameProperties.preferred_height - 64) / 2 - 20 - 8, () => {closePopup(true)}, play_credits);
    //o.anchor.set(1, 1);
    box.addChild(o);
    newTitlemenu.menu.push({name: "Okay", display: o, action: () => {closePopup(true)}});

    titlemenu[creditsTitlemenu] = newTitlemenu;
    initTitlemenu(creditsTitlemenu, 0);
}

function showPause() {
    showCursor();
    pauseStopwatch();
    PIXI.sound.pause('bgm_level');
    PIXI.sound.pause('bgm_boss');
    PIXI.sound.pause('bgm_result');

    var box = createPopup(levelScene, play_pause, gameProperties.preferred_width / 2, gameProperties.preferred_height * 3 / 5);
    var lineHeight = 20;
    var colWidth = 100;

    var newTitlemenu = {menu: [], active: 0};

    var o;
    o = createText("Paused", 0, lineHeight*-3);
    //o.font.size = 16;
    o.font.tint = "0x000000";
    box.addChild(o);

    o = createText("Options", 0, lineHeight*-1, () => showConfig(), play_pause);
    //o.font.size = 16;
    box.addChild(o);
    newTitlemenu.menu.push({name: "Options", display: o, action: showConfig});

    o = createText("Main Menu", 0, lineHeight*0.5, () => showRestart(), play_pause);
    //o.font.size = 16;
    box.addChild(o);
    newTitlemenu.menu.push({name: "Main Menu", display: o, action: showRestart});

    o = createText("Resume", 0, lineHeight*2.5, () => unPause(), play_pause);
    //o.font.size = 16;
    box.addChild(o);
    newTitlemenu.menu.push({name: "Resume", display: o, action: unPause});

    titlemenu[pauseTitlemenu] = newTitlemenu;
    initTitlemenu(pauseTitlemenu, 0);
}
function showRestart() {
    PIXI.sound.play('sfx_menu');

    var box = createPopup(levelScene, play_restart, gameProperties.preferred_width * 3 / 5, gameProperties.preferred_height / 2);
    var lineHeight = 20;
    var colWidth = 100;

    var newTitlemenu = {menu: [], active: 0};

    var o;
    o = createText("Are you sure you want to restart?", 0, lineHeight*-1);
    //o.font.size = 16;
    o.font.tint = "0x000000";
    box.addChild(o);

    o = createText("Yes", -colWidth / 2, lineHeight*1, () => restartGame(), play_restart);
    box.addChild(o);
    newTitlemenu.menu.push({name: "Yes", display: o, action: restartGame, rightAction: () => {runTitlemenu(restartTitlemenu, 1)}});

    o = createText("No", colWidth / 2, lineHeight*1, () => closePopup(true), play_restart);
    box.addChild(o);
    newTitlemenu.menu.push({name: "No", display: o, action: () => closePopup(true), leftAction: () => {runTitlemenu(restartTitlemenu, -1)}});

    titlemenu[restartTitlemenu] = newTitlemenu;
    initTitlemenu(restartTitlemenu, 1); //select "No" by default
}
function unPause() {
    if (bossState != 5) hideCursor();
    player.hasJumped = true; //prevent unintentional jump after unpause
    player.hasSlashed = true;
    unpauseStopwatch();
    PIXI.sound.resume('bgm_level');
    PIXI.sound.resume('bgm_boss');
    PIXI.sound.resume('bgm_result');
    closePopup(true);
}
function play_pause() {
    runTitlemenu(pauseTitlemenu);
    if (keys.menu.held && keys.menu.toggled) {
        keys.menu.toggled = false;
        unPause();
    } else if (keys.b.held && keys.b.toggled) {
        keys.b.toggled = false;
        unPause();
    }
}
function play_restart() {
    runTitlemenu(restartTitlemenu);
    if (keys.menu.held && keys.menu.toggled) {
        keys.menu.toggled = false;
        unPause();
    } else if (keys.b.held && keys.b.toggled) {
        keys.b.toggled = false;
        unPause();
    }
}
function restartGame() {
    PIXI.sound.play('sfx_menu');
    closeAllPopups();
    activateTitlemenu(0, 0);

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
    hina.children[0].texture = PIXI.utils.TextureCache["hina"];
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
    painCounter = 0;

    resetStopwatch();

    for (var i = 0; i < dialog.firstKeys.length; i++) {
        dialog.first[dialog.firstKeys[i]] = false;
    }
    gui_overlay.visible = false;
    dialog.overlay.visible = false;
    results.overlay.visible = false;
    bossState = 0;
    walls.alpha = 1;

    importLevelMap();
    start_stage("title", 1);
}

function play_config() {
    runTitlemenu(configTitlemenu);
    if (keys.menu.held && keys.menu.toggled) {
        keys.menu.toggled = false;
        closePopup(true);
    } else if (keys.b.held && keys.b.toggled) {
        keys.b.toggled = false;
        closePopup(true);
    }
}
function play_credits() {
    runTitlemenu(creditsTitlemenu);
    if (keys.menu.held && keys.menu.toggled) {
        keys.menu.toggled = false;
        closePopup(true);
    } else if (keys.b.held && keys.b.toggled) {
        keys.b.toggled = false;
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
var dlg_goodend = [
    { message: "Oww...", face: 2},
    { message: "Now tell me what you did to my mountain.", face: 1},
    { message: "It's not safe.\nYou should go back home.", face: 2},
    { message: "Tell me what these orbs are.", face: 1},
    { message: "Oh, you've collected quite a lot. Those are unlucky orbs. They sometimes form when too much misfortune coalesces.", face: 2},
    { message: "You seem capable. Can you help me collect the rest?", face: 2},
    { message: "Nemuno spent the rest of the day restoring peace on the mountainside.", face: 0}
]
var dlg_badend = [
    { message: "Oww...", face: 2},
    { message: "What's going on around here?", face: 1},
    { message: "The mountain is too dangerous for you right now.", face: 2},
    { message: "So it wasn't your fault?", face: 1},
    { message: "It wasn't.", face: 2},
    { message: "Ah. Sorry.", face: 1},
    { message: "After apologizing, Nemuno went home hungry.", face: 0}
]
var dlg_soupend = [
    { message: "Oww...", face: 2},
    { message: "You deserved it.", face: 1},
    { message: "I was only trying to keep you away from danger.\nIt's gotten awfully quiet, though.", face: 2},
    { message: "That's because I already defeated all those things.", face: 1},
    { message: "...!", face: 2},
    { message: "After finally gathering her vegetables in peace, Nemuno shared a pot of soup with Hina.", face: 0}
]
var dlg_kappaend = [
    { message: "Oww...", face: 2},
    { message: "Kappa.", face: 1},
    { message: "Kappa?", face: 2},
    { message: "KAPPA KAPPA KAPPA.", face: 1},
    { message: "I don't understand.", face: 2},
    { message: "KAPPA KAPPA KAPPA.", face: 1}
    //{ message: "[KAPPA END]", face: 0}
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
    if (verbose == 1) dialog.overlay.visible = true;
    showDialog();
}
function showDialog() {
    var message = dialog.chain[dialog.chainstep].message;
    var face = dialog.chain[dialog.chainstep].face;
    dialog.text = message.split(" ");
    dialog.textBuild = "";
    dialog.step = 0;
    dialog.message.text = "";
    if (face == 0) {
        dialog.face.visible = false;
        dialog.message.x = 15;
    } else {
        dialog.face.visible = true;
        dialog.message.x = 88;
    }
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
    if (verbose == 0) {
        dialog.timer = 0;
        if (bossState == 2) bossTimer = 500;
        if (bossState == 4) {
            showCursor();
            playMusic('bgm_result');
            bossState = 5;
        }
        keys.a.toggled = false;
        return;
    }
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
                    dialog.timer = 150 + dialog.text.length * 13;
                else
                    dialog.timer = 200 + dialog.text.length * 13;
            }
            dialog.overlay.visible = true;
        } else {
            if (dialog.chainstep < dialog.chain.length - 1) {
                dialog.chainstep++;
                dialog.timer = 10;
                showDialog();
            } else {
                dialog.overlay.visible = false;
                if (bossState == 2) bossTimer = 500;
                if (bossState == 4) {
                    showCursor();
                    playMusic('bgm_result');
                    bossState = 5;
                }
            }
        }
    }
}

function updateTitlemenu(n) {
    var tm = titlemenu[n];
    for (var i = 0; i < tm.menu.length; i++) {
        if (i == tm.active) {
            tm.menu[i].display.text = "> " + tm.menu[i].name + " <";
        } else {
            tm.menu[i].display.text = tm.menu[i].name;
        }
    }
}
