"use strict";

var textureList = [
    "img/sprites.json",
    "img/tiles.json"
    ]
var soundList = [
    /*
    ["bgm_menu", "sfx/menu.mp3"],
    ["bgm_level", "sfx/level.mp3"],
    ["sfx_block", "sfx/block2.wav"]
    */
    ]
var loadingScene;
function load(n) {
    if (n == 0) {
        loadingScene = new PIXI.Container();
        gameScene.addChild(loadingScene);

        var style = new PIXI.TextStyle({fontFamily: "serif", fontSize: 32, fill: "white"});
        var o;

        o = new PIXI.Text("loading", style);
        o.x = gameProperties.width / 2;
        o.y = gameProperties.height / 2 - 24;
        o.anchor.set(0.5);
        loadingScene.addChild(o);

        var tw = gameProperties.width / 2 - 1;
        var th = 32 - 1;

        o = new PIXI.Graphics();
        o.beginFill(0xFFFFFF);
        o.drawRect(0, 0, tw, th);
        o.endFill();
        o.x = gameProperties.width / 2 - tw / 2;
        o.y = gameProperties.height / 2 - th / 2 + 24;
        loadingScene.addChild(o);

        o = new PIXI.Graphics();
        o.beginFill(0x000000);
        o.drawRect(0, 0, 1, 1);
        o.endFill();
        o.x = gameProperties.width / 2 - tw / 2 + 1;
        o.y = gameProperties.height / 2 - th / 2 + 24 + 1;
        o.width = tw - 2;
        o.height = th - 2;
        loadingScene.addChild(o);

    } else {
        var ttw = gameProperties.width / 2 - 1 - 2;
        var thw = gameProperties.width / 2 - ttw / 2;
        var loadPercent = n / (textureList.length + soundList.length);
        loadingScene.children[0].text = Math.floor(100 * loadPercent) + "%";
        loadingScene.children[2].width = (1 - loadPercent) * ttw;
        loadingScene.children[2].x = thw + loadPercent * ttw;
    }

    if (n < textureList.length) {
        if (gameProperties.texturePreload) {
            PIXI.loader.add(textureList[n]).load(function(){load(n+1)});
        } else {
            PIXI.loader.add(textureList[n]);
            load(n+1);
        }
        return;
    }
    var nn = n - textureList.length;
    if (nn < soundList.length) {
        if (gameProperties.soundPreload) {
            PIXI.sound.add(soundList[nn][0], {url: soundList[nn][1], preload:true, loaded:function(){load(n+1)}});
        } else {
            PIXI.sound.add(soundList[nn][0], soundList[nn][1]);
            load(n+1);
        }
        return;
    }

    gameScene.removeChild(loadingScene);
    initialize();
}

var state;
function initialize() {
    initialize_menu();
    initialize_level();

    start_stage("menu");

    app.ticker.add(delta => gameLoop(delta));
}

function start_stage(stageType, stageNumber) {
    if (stageType == "menu") {
        //PIXI.sound.stop('bgm_level');
        //PIXI.sound.play('bgm_menu', {loop:true});
        menuScene.visible = true;
        levelScene.visible = false;
        state = menu;
        sceneResizeHook = menuResize;
        return;
    }
    if (stageType == "level") {
        //PIXI.sound.stop('bgm_menu');
        //PIXI.sound.play('bgm_level', {loop:true});
        menuScene.visible = false;
        levelScene.visible = true;
        state = play;
        //sceneResizeHook = levelResize;
        sceneResizeHook = null;
        return;
    }
}

function gameLoop(delta) {
    state(delta);
}

var sceneResizeHook;
function setGameSize() {
    app.view.style.position = "absolute";
    app.view.style.top = "0px";
    app.view.style.left = "0px";
    app.renderer.resize(window.innerWidth, window.innerHeight);
    var ratioW = window.innerWidth / gameProperties.preferred_width;
    var ratioH = window.innerHeight / gameProperties.preferred_height;
    if (ratioW < ratioH) {
        gameProperties.width = gameProperties.preferred_height * window.innerWidth / window.innerHeight;
        gameProperties.height = gameProperties.preferred_height;
        gameScene.scale.x = window.innerWidth / gameProperties.width;
        gameScene.scale.y = gameScene.scale.x;
    } else {
        gameProperties.height = gameProperties.preferred_width * window.innerHeight / window.innerWidth;
        gameProperties.width = gameProperties.preferred_width;
        gameScene.scale.x = window.innerWidth / gameProperties.width;
        gameScene.scale.y = gameScene.scale.x;
    }
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
    preferred_width: 512,
    preferred_height: 384,
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
var gameScene = new PIXI.Container();
app.stage.addChild(gameScene);
/*
document.getElementById("gamebox").appendChild(app.view);

setGameSize();
//window.onresize = resize;

load(0);
*/