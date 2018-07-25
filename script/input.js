"use strict";

var keys = {
    up: {
        // Up, W
        bindings: [38, 87]
    },
    down: {
        // Down, S
        bindings: [40, 83]
    },
    left: {
        // Left, A
        bindings: [37, 65]
    },
    right: {
        // Right, D
        bindings: [39, 68]
    },
    // Attack
    a: {
        // J, Z, 4, Enter
        bindings: [74, 90, 52, 13]
    },
    // Jump
    b: { // K, X, 3, Backspace
        bindings: [75, 88, 51, 8]
    },
    // ?
    c: {
        bindings: [76, 67, 50]
    },
    // Skip text
    d: {
        bindings: [59, 86, 49]
    },
    respawn: { //r
        bindings: [82]
    },
    menu: { //escape, p
        bindings: [27, 80]
    }
}
var keyskeys = Object.keys(keys);
function checkKey(key, k, state) {
    var found = false;
    for (var i = 0; i < key.bindings.length; i++) {
        if (k.which == key.bindings[i]) {
            found = true;
            break;
        }
    }
    if (!found) return;
    //k.preventDefault();
    if (key.held != state) key.toggled = true;
    key.held = state
}
document.onkeydown = function(k) {
    //console.log(k.which);
    k.preventDefault();
    for (var i = 0; i < keyskeys.length; i++ ) {
        checkKey(keys[keyskeys[i]], k, true);
    }
}
document.onkeyup = function(k) {
    k.preventDefault();
    for (var i = 0; i < keyskeys.length; i++ ) {
        checkKey(keys[keyskeys[i]], k, false);
    }
}
