var loadingScene;

function initialize_loadingscene() {
    loadingScene = new PIXI.Container();
    gameScene.addChild(loadingScene);

    //var style = new PIXI.TextStyle({fontFamily: "serif", fontSize: 32, fill: "white"});
    var o;

    //o = new PIXI.Text("loading", style);
    o = new PIXI.extras.BitmapText("loading", {font: '32px Pixellari', align: 'right', tint: '0xffffff'});
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
}

function update_loadingscene(loadPercent) {
    var ttw = gameProperties.width / 2 - 1 - 2;
    var thw = gameProperties.width / 2 - ttw / 2;
    loadingScene.children[0].text = Math.floor(100 * loadPercent) + "%";
    loadingScene.children[2].width = (1 - loadPercent) * ttw;
    loadingScene.children[2].x = thw + loadPercent * ttw;
}

function load(n) {
    if (n == 0) {
        initialize_loadingscene();
    } else {
        var loadPercent = n / (textureList.length + soundList.length + fontList.length);
        update_loadingscene(loadPercent);
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
    nn = n - textureList.length - soundList.length;
    if (nn < fontList.length) {
        PIXI.loader
            .add(fontList[nn][0], fontList[nn][1])
            .load(function(){load(n+1)});
        return;
    }

    gameScene.removeChild(loadingScene);
    initialize();
}
