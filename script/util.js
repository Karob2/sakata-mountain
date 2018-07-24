"use strict"

function playMusic(mtitle) {
    var snd = PIXI.sound.find(mtitle);
    if (!snd.isPlaying) {
        stopMusic();
        PIXI.sound.play(mtitle, {loop:true});
    }
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
        o.font.tint = "0x000000";
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
function createPopup(parent, newState, width, height) {//, x, y, width, height) {
    var o;
    var box = new PIXI.Container();
    box.x = gameProperties.width / 2;
    box.y = gameProperties.height / 2;
    parent.addChild(box);

    //o = new PIXI.Sprite(parchmentAtlas["parchment"]);
    //o.anchor.set(0.5);

    o = new PIXI.extras.TilingSprite(parchmentAtlas["parchment"], width, height);
    o.anchor.set(0.5);
    box.addChild(o);

    o = new PIXI.Graphics();
    o.beginFill(0x000000);
    o.drawRect(0, 0, width, 1);
    o.drawRect(0, height - 1, width, 1);
    o.drawRect(0, 0, 1, height);
    o.drawRect(width - 1, 0, 1, height);
    o.endFill();
    o.pivot.set(width / 2, height / 2);
    box.addChild(o);

    universalPopup.push({obj: box, prevState: state});
    
    //box.pivot.set(o.width / 2, o.height / 2);

    state = newState;
    return box;
}
function closePopup(playSound) {
    if (playSound) PIXI.sound.play('sfx_close');

    var o = universalPopup[universalPopup.length - 1];
    o.obj.parent.removeChild(o);
    o.obj.destroy();
    state = o.prevState;
    universalPopup.pop();
}
function closeAllPopups() {
    for (var i = universalPopup.length - 1; i >= 0; i--) {
        closePopup(false);
    }
}

function saveData(key, val) {
    /*
    if (typeof(Storage) !== "undefined") {
        try {
            localStorage.setItem("karob:sakata-mountain-" + key, val);
        } catch(error) {
            console.error(error);
            return false;
        }
        return true;
    } else {
        return false;
    }
    */
    setCookie(key, val, 64); //expire after two months
}

function loadData(key, def) {
    /*
    if (typeof(Storage) !== "undefined") {
        var val = localStorage.getItem("karob:sakata-mountain-" + key);
        if (val == null) return def;
        else return val;
    } else {
        return def;
    }
    */
    var val = getCookie(key);
    if (val == null) return def;
    else return val;
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}
