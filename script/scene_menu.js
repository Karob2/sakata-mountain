"use strict";

var menuScene;
function initialize_menu() {
    menuScene = new PIXI.Container();
    gameScene.addChild(menuScene);

    var style = new PIXI.TextStyle({fontFamily: "serif", fontSize: 64, fill: "white"});
    var message = new PIXI.Text("Sakata Mountain", style);
    message.x = gameProperties.width / 2;
    message.y = gameProperties.height / 4;
    message.anchor.set(0.5);
    menuScene.addChild(message);

    style = new PIXI.TextStyle({fontFamily: "serif", fontSize: 32, fill: "white"});
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
    message.clickAction = function(){start_stage("level", 1)};
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
        o.style.fill = "blue";
        return;
    }
    if (o.isHover) {
        o.style.fill = "yellow";
        return;
    }
    o.style.fill = "white";
}

function menu(delta) {

}
