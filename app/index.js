/**
 *    _____ __
 *   / ___// /_  _____
 *   \__ \/ / / / / _ \
 *  ___/ / / /_/ /  __/
 * /____/_/\__, /\___/
 *       /____/
 *       Copyright 2017 Slye Development Team. All Rights Reserved.
 *       Licence: MIT License
 */

import electron from 'electron'
import './window.css'

// import plugins & templates
import './plugins/Text'
import './templates/blank@slye'

// load application
import './src'

const remote = electron.remote;

function init() {
    document.getElementById("min-btn").addEventListener("click", function (e) {
        const window = remote.getCurrentWindow();
        window.minimize();
    });

    document.getElementById("max-btn").addEventListener("click", function (e) {
        const window = remote.getCurrentWindow();
        if (!window.isMaximized()) {
            window.maximize();
        } else {
            window.unmaximize();
        }
    });

    document.getElementById("close-btn").addEventListener("click", function (e) {
        const window = remote.getCurrentWindow();
        window.close();
    });
}

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        init();
    }
}
