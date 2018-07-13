"use strict";

var keys = {
    up: {
        bindings: [38, 87]
    },
    down: {
        bindings: [40, 83]
    },
    left: {
        bindings: [37, 65]
    },
    right: {
        bindings: [39, 68]
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
    k.preventDefault();
    if (key.held != state) key.toggled = true;
    key.held = state
}
document.onkeydown = function(k) {
    for (var i = 0; i < keyskeys.length; i++ ) {
        checkKey(keys[keyskeys[i]], k, true);
    }
}
document.onkeyup = function(k) {
    for (var i = 0; i < keyskeys.length; i++ ) {
        checkKey(keys[keyskeys[i]], k, false);
    }
}
