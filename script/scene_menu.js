"use strict";

var menuScene;
function initialize_menu() {
    menuScene = new PIXI.Container();
    gameScene.addChild(menuScene);

    var style = new PIXI.TextStyle({fontFamily: "Verdana", fontSize: 40, fill: "white"});
    var message = new PIXI.Text("Sakata Mountain v0.1", style);
    message.x = gameProperties.width / 2;
    message.y = gameProperties.height / 4;
    message.anchor.set(0.5);
    menuScene.addChild(message);

    style = new PIXI.TextStyle({fontFamily: "Verdana", fontSize: 32, fill: "white"});
    message = new PIXI.Text("Start", style);
    message.x = gameProperties.width / 2;
    message.y = gameProperties.height * 3 / 4;
    message.anchor.set(0.5);
    message.interactive = true;
    message.buttonMode = true;
    message.on('pointerover', menu_over);
    message.on('pointerout', menu_out);
    message.on('pointerup', menu_up);
    message.on('pointerupoutside', menu_upoutside);
    message.on('pointerdown', menu_down);
    message.clickAction = function(){showStory()};
    menuScene.addChild(message);

    var o = new PIXI.Sprite(spriteAtlas["player f1"]);
    o.x = gameProperties.width * 1 / 6;
    o.y = gameProperties.height * 3 / 4 - 10;
    o.anchor.set(0.5, 0.5);
    menuScene.addChild(o);

    o = new PIXI.Sprite(spriteAtlas["fairy"]);
    o.x = gameProperties.width * 5 / 6;
    o.y = gameProperties.height * 3 / 4;
    o.anchor.set(0.5, 0.5);
    menuScene.addChild(o);
}

function menuResize() {
    menuScene.children[0].x = gameProperties.width / 2;
    menuScene.children[0].y = gameProperties.height / 4;
    menuScene.children[1].x = gameProperties.width / 2;
    menuScene.children[1].y = gameProperties.height * 3 / 5;
    menuScene.children[2].x = gameProperties.width * 1 / 6;
    menuScene.children[2].y = gameProperties.height * 3 / 4 - 10;
    menuScene.children[3].x = gameProperties.width * 5 / 6;
    menuScene.children[3].y = gameProperties.height * 3 / 4;
}

function menu_over() {
    this.isHover = true;
    menu_updateColor(this);
    //this.style.fill = "yellow";
}
function menu_out() {
    this.isHover = false;
    menu_updateColor(this);
    //this.style.fill = "white";
}
function menu_down() {
    this.isPress = true;
    menu_updateColor(this);
    //this.style.fill = "blue";
}
function menu_up() {
    var doAction = this.isPress;
    this.isPress = false;
    menu_updateColor(this);
    //this.style.fill = "white";
    if (this.clickAction && doAction) this.clickAction();
}
function menu_upoutside() {
    this.isPress = false;
    menu_updateColor(this);
    //this.style.fill = "white";
}
function menu_updateColor(o) {
    if (o.isPress) {
        //o.style.fill = "blue";
        o.font.tint = "0x0000ff";
        o.updateText();
        return;
    }
    if (o.isHover) {
        o.font.tint = "0xffff00";
        o.updateText();
        return;
    }
    o.font.tint = "0xffffff";
    o.updateText();
}

function menu(delta) {
    if (keys.a.held && keys.a.toggled) {
        keys.a.toggled = false;
        showStory();
    }
    start_stage("level", 0);
}

var storyPage;
var storyScene;
function showStory() {
    state = story;
    PIXI.sound.play('sfx_menu');

    storyScene = new PIXI.Container();
    menuScene.addChild(storyScene);
    storyPage = 0;

    var o;
    o = new PIXI.Graphics();
    o.beginFill(0x000000);
    o.drawRect(0, 0, gameProperties.width, gameProperties.height);
    o.endFill();
    o.x = 0;
    o.y = 0;
    storyScene.addChild(o);

    var style = new PIXI.TextStyle({fontFamily: "serif", fontSize: 20, fill: "white", wordWrap: true, wordWrapWidth: gameProperties.width - 96});
    var text = "When Nemuno left her house to go foraging for vegetables, she sensed something wrong with the mountain. Soon, she was attacked by strange corrupted spirits and winds trying to keep her away. So, she began her adventure further into the mountain to discover who was behind this incident.\n\n(Press the action key to continue.)";
    var message = new PIXI.Text(text, style);
    message.x = 48;
    message.y = 48;
    storyScene.addChild(message);
}

function story() {
    if (keys.a.held && keys.a.toggled) {
        keys.a.toggled = false;
        start_stage("level", 1);
        PIXI.sound.play('sfx_menu');
    }
}