function playMusic(mtitle) {
    stopMusic();
    PIXI.sound.play(mtitle, {loop:true});
}

function stopMusic() {
    PIXI.sound.stop('bgm_menu');
    PIXI.sound.stop('bgm_level');
    PIXI.sound.stop('bgm_boss');
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
