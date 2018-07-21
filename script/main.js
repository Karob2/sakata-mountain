"use strict";

var textureList = [
    "img/logo.json",
    "img/parchment.json",
    "img/sprites.json",
    "img/tiles.json"
    ]
var soundList = [
    ["env_crickets", "sfx/crickets.mp3"],
    ["bgm_menu", "sfx/bells.mp3"],
    ["bgm_level", "sfx/mountain_wind.mp3"],
    ["bgm_boss", "sfx/mountain_boss.mp3"],
    ["sfx_kill", "sfx/mischit.wav"],
    ["sfx_checkpoint", "sfx/block2.wav"],
    ["sfx_respawn", "sfx/die.wav"],
    ["sfx_slash", "sfx/hit1.wav"],
    ["sfx_block", "sfx/hit2.wav"],
    ["sfx_bullet1", "sfx/fireball.wav"],
    ["sfx_bullet2", "sfx/ender.wav"],
    ["sfx_bullet3", "sfx/mortar.wav"],
    ["sfx_pain", "sfx/hitcrit.wav"],
    ["sfx_menu", "sfx/tri.wav"]
    ]
var fontList = [
    //["Pixellari", "font/pixellari.fnt"]
]

var spriteAtlas, tileAtlas, logoAtlas, parchmentAtlas;
function initialize() {
    spriteAtlas = PIXI.loader.resources["img/sprites.json"].textures;
    tileAtlas = PIXI.loader.resources["img/tiles.json"].textures;
    logoAtlas = PIXI.loader.resources["img/logo.json"].textures;
    parchmentAtlas = PIXI.loader.resources["img/parchment.json"].textures;

    //initialize_menu();
    initialize_level();
    //initialize_end();

    start_stage("title", 1);

    app.ticker.add(delta => gameLoop(delta));
}

var state;
var substate;
var currentStage;
function start_stage(stageType, stageNumber) {
    substate = stageNumber;
    /*
    if (stageType == "menu") {
        //PIXI.sound.stop('bgm_level');
        //PIXI.sound.play('bgm_menu', {loop:true});
        menuScene.visible = true;
        levelScene.visible = false;
        //endScene.visible = false;
        state = menu;
        sceneResizeHook = menuResize;
        return;
    }
    */
    app.renderer.backgroundColor = 0x201030;
    levelScene.visible = true;
    sceneResizeHook = levelResize;
    if (stageType == "title") {
        if (currentStage != stageType) {
            playMusic('bgm_menu');
            gui_overlay.visible = false;
            title_overlay.visible = true;
            state = play_title;
        }
        currentStage = stageType;
        return;
    }
    if (stageType == "level") {
        if (currentStage != stageType) {
            playMusic('bgm_level');
            gui_overlay.visible = true;
            title_overlay.visible = false;
            state = play;
        }
        currentStage = stageType;
        return;
    }
    /*
    if (stageType == "end") {
        PIXI.sound.stop('bgm_level');
        //PIXI.sound.play('bgm_menu', {loop:true});
        endScene.visible = true;
        menuScene.visible = false;
        levelScene.visible = false;
        state = end;
        sceneResizeHook = endResize;
        return;
    }
    */
}

function gameLoop(delta) {
    state(delta);
}

var sceneResizeHook;
function setGameSize() {
    app.view.style.position = "absolute";
    app.view.style.top = "0px";
    app.view.style.left = "0px";
    var wWidth = window.innerWidth;
    var wHeight = window.innerHeight;
//#ifdef debug
/*
    app.view.style.top = "20px";
    app.view.style.left = "20px";
    wWidth = 512 * 2;
    wHeight = 384 * 2;
    document.body.style.backgroundColor = "#222"
*/
//#endif
    app.renderer.resize(wWidth, wHeight);
    var ratioW = wWidth / gameProperties.preferred_width;
    var ratioH = wHeight / gameProperties.preferred_height;
    var scale;
    if (ratioW < ratioH) {
        /*
        gameProperties.width = gameProperties.preferred_height * wWidth / wHeight;
        gameProperties.height = gameProperties.preferred_height;
        gameScene.scale.x = wWidth / gameProperties.width;
        gameScene.scale.y = gameScene.scale.x;
        */
        //gameProperties.frame_height = gameProperties.preferred_width * wHeight / wWidth;
        //gameProperties.frame_width = gameProperties.preferred_width;
        scale = wWidth / gameProperties.preferred_width;
        gameScene.scale.x = scale;
        gameScene.scale.y = scale;

        frameScene.children[1].width = wWidth;
        frameScene.children[1].height = (wHeight - gameProperties.preferred_height * scale) / 2;
        frameScene.children[2].x = 0;
        frameScene.children[2].y = wHeight - frameScene.children[1].height;
        frameScene.children[2].width = frameScene.children[1].width;
        frameScene.children[2].height = frameScene.children[1].height;
    } else {
        /*
        gameProperties.height = gameProperties.preferred_width * wHeight / wWidth;
        gameProperties.width = gameProperties.preferred_width;
        gameScene.scale.x = wWidth / gameProperties.width;
        gameScene.scale.y = gameScene.scale.x;
        */
        //gameProperties.frame_width = gameProperties.preferred_height * wWidth / wHeight;
        //gameProperties.frame_height = gameProperties.preferred_height;
        scale = wHeight / gameProperties.preferred_height;
        gameScene.scale.x = scale;
        gameScene.scale.y = scale;

        frameScene.children[1].width = (wWidth - gameProperties.preferred_width * scale) / 2;
        frameScene.children[1].height = wHeight;
        frameScene.children[2].x = wWidth - frameScene.children[1].width;
        frameScene.children[2].y = 0;
        frameScene.children[2].width = frameScene.children[1].width;
        frameScene.children[2].height = frameScene.children[1].height;
    }
    gameProperties.width = gameProperties.preferred_width;
    gameProperties.height = gameProperties.preferred_height;
    gameScene.x = wWidth / 2 - gameProperties.preferred_width * scale / 2;
    gameScene.y = wHeight / 2 - gameProperties.preferred_height * scale / 2;
    //frameScene.children[1].visible = false;
    //frameScene.children[2].visible = false;
    if (sceneResizeHook != null) sceneResizeHook();
}
/*
function setGameSize() {
    app.view.style.position = "absolute";
    app.view.style.top = "0px";
    app.view.style.left = "0px";
    app.renderer.resize(window.innerWidth, window.innerHeight);
    var ratioW = window.innerWidth / gameProperties.preferred_width;
    var ratioH = window.innerHeight / gameProperties.preferred_height;
    if (ratioW > ratioH) {
        gameProperties.width = gameProperties.preferred_height * window.innerWidth / window.innerHeight;
        if (gameProperties.width < gameProperties.preferred_width * 1.5) {
            gameProperties.height = gameProperties.preferred_height;
        } else {
            gameProperties.width = gameProperties.preferred_width * 1.5;
            gameProperties.height = gameProperties.width * window.innerHeight / window.innerWidth;
        }
        gameScene.scale.x = window.innerWidth / gameProperties.width;
        gameScene.scale.y = gameScene.scale.x;
    } else {
        gameProperties.height = gameProperties.preferred_width * window.innerHeight / window.innerWidth;
        if (gameProperties.height < gameProperties.preferred_height * 1.5) {
            gameProperties.width = gameProperties.preferred_width;
        } else {
            gameProperties.height = gameProperties.preferred_height * 1.5;
            gameProperties.width = gameProperties.height * window.innerWidth / window.innerHeight;
        }
        gameScene.scale.x = window.innerWidth / gameProperties.width;
        gameScene.scale.y = gameScene.scale.x;
    }

    if (sceneResizeHook != null) sceneResizeHook();
}
*/

// Output PixiJS version and which renderer is active to the console.
var type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
  type = "Canvas"
}
PIXI.utils.sayHello(type)

var gameProperties = {
    preferred_width: 640,
    preferred_height: 360,
    //width: 512,
    //height: 384,
    //scale: 2,
    texturePreload: true, // "false" causes errors
    soundPreload: true
}

var app = new PIXI.Application({ 
    width: gameProperties.width,
    height: gameProperties.height,
    antialiasing: true,
    transparent: false,
    resolution: 1,
    backgroundColor: 0x000000
});
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
app.renderer.plugins.interaction.cursorStyles.default = "default";
app.renderer.plugins.interaction.cursorStyles.hover = "default";
app.renderer.plugins.interaction.cursorStyles.pointer = "default";

var frameScene = new PIXI.Container();
app.stage.addChild(frameScene);
var gameScene = new PIXI.Container();
frameScene.addChild(gameScene);
var o = new PIXI.Graphics();
o.beginFill(0x000000);
o.drawRect(0, 0, 1, 1);
o.endFill();
o.x = 0;
o.y = 0;
o.width = 100;
o.height = 100;
frameScene.addChild(o);
var o = new PIXI.Graphics();
o.beginFill(0x000000);
o.drawRect(0, 0, 1, 1);
o.endFill();
o.x = 0;
o.y = 0;
o.width = 100;
o.height = 100;
frameScene.addChild(o);
/*
document.getElementById("gamebox").appendChild(app.view);

setGameSize();
//window.onresize = resize;

load(0);
*/

document.body.appendChild(app.view);
setGameSize();
window.onresize = setGameSize;

PIXI.loader
    .add("Pixellari", "font/pixellari.fnt")
    .load(function(){load(0)});
//load(0);
