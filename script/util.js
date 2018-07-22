"use strict"

function playMusic(mtitle) {
    stopMusic();
    PIXI.sound.play(mtitle, {loop:true});
}

function stopMusic() {
    PIXI.sound.stop('bgm_menu');
    PIXI.sound.stop('bgm_level');
    PIXI.sound.stop('bgm_boss');
}

function createText (text, x, y, buttonCall, stateCheck) {
    var message = new PIXI.extras.BitmapText(text, {font: '20px Pixellari', align: 'left', tint: '0xffffff'});
    message.x = x;
    message.y = y;
    message.stateCheck = stateCheck;
    message.anchor.set(0.5);
    if (buttonCall != null) {
        message.hitArea = new PIXI.Rectangle(-40, -10, 80, 20);
        message.interactive = true;
        //message.cursor = 'text';
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

function createBar (control, x, y, width, height) {
    var bar = new PIXI.Container();
    var o;

    o = new PIXI.Graphics();
    o.beginFill(0x000000);
    o.drawRect(0, 0, width, 1);
    o.drawRect(0, height - 1, width, 1);
    o.drawRect(0, 0, 1, height);
    o.drawRect(width - 1, 0, 1, height);
    o.endFill();
    o.x = x;
    o.y = y;
    bar.addChild(o);

    o.maxWidth = width - 4;
    o.control = control;
    o.hitArea = new PIXI.Rectangle(2, 2, width - 4, height - 4);
    o.interactive = true;
    o.buttonMode = true;
    o.on('pointerdown', bar_down);

    o = new PIXI.Graphics();
    o.beginFill(0x000000);
    o.drawRect(0, 0, 1, 1);
    o.endFill();
    o.x = x + 2;
    o.y = y + 2;
    o.width = (width - 4) * 0.95;
    o.height = height - 4;
    bar.addChild(o);

    o.width = (width - 4) * 0.9 * control.val + (width - 4) * 0.05;

    o = new PIXI.Graphics();
    o.beginFill(0xffffff);
    o.drawRect(0, 0, 1, height - 4);
    o.endFill();
    o.x = x + 2 + (width - 4) * 0.05;
    o.y = y + 2;
    bar.addChild(o);

    o = new PIXI.Graphics();
    o.beginFill(0xffffff);
    o.drawRect(0, 0, 1, height - 4);
    o.endFill();
    o.x = x + 2 + (width - 4) * 0.95;
    o.y = y + 2;
    bar.addChild(o);

    return bar;
}
function bar_down(e) {
    var clickPos = e.data.getLocalPosition(this);
    this.parent.children[1].width = Math.min(Math.max(clickPos.x, this.maxWidth * 0.05), this.maxWidth * 0.95);
    var adjust = (clickPos.x / this.maxWidth) / 0.9 - 0.05 / 0.9;
    this.control.val = Math.min(Math.max(adjust, 0), 1);
    this.control.callback();
}

function menu_over() {
    if (this.stateCheck != state) return;
    this.isHover = true;
    menu_updateColor(this);
    //this.style.fill = "yellow";
}
function menu_out() {
    if (this.stateCheck != state) return;
    this.isHover = false;
    menu_updateColor(this);
    //this.style.fill = "white";
}
function menu_down() {
    if (this.stateCheck != state) return;
    this.isPress = true;
    menu_updateColor(this);
    //this.style.fill = "blue";
}
function menu_up() {
    if (this.stateCheck != state) return;
    var doAction = this.isPress;
    this.isPress = false;
    menu_updateColor(this);
    //this.style.fill = "white";
    if (this.clickAction && doAction) {
        this.isHover = false;
        this.font.tint = "0xffffff";
        this.updateText();
        this.clickAction(this.stateCheck);
    }
}
function menu_upoutside() {
    if (this.stateCheck != state) return;
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

var universalPopup = [];
function createPopup(parent, newState, x, y, width, height) {
    var box = new PIXI.Container();
    var o = new PIXI.Sprite(parchmentAtlas["parchment"]);
    /*
    var o = new PIXI.Graphics();
    o.beginFill(0x000000);
    o.drawRect(0, 0, width, height);
    o.endFill();
    o.x = x;
    o.y = y;
    //o.width = width;
    //o.height = height;
    */
    universalPopup.push({obj: box, prevState: state});
    parent.addChild(box);
    box.addChild(o);
    state = newState;
    return box;
}
function closePopup() {
    var o = universalPopup[universalPopup.length - 1];
    o.obj.parent.removeChild(o);
    o.obj.destroy();
    state = o.prevState;
    universalPopup.pop();
}
function closeAllPopups() {
    for (var i = universalPopup.length - 1; i >= 0; i--) {
        closePopup(i);
    }
}

function saveData(key, val) {
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem(key, val);
        return true;
    } else {
        return false;
    }
}

function loadData(key, def) {
    if (typeof(Storage) !== "undefined") {
        return localStorage.getItem(key);
    } else {
        return def;
    }
}
