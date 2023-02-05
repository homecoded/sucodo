/*
 Copyright 2017 Manuel Ruelke, homecoded.com

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 * facade for the user interface of the app
 * Everything that the user sees is controlled here:
 *
 * - window size
 * - interactions with DOM elements like buttons
 */

/* globals $, Window, sucodoEmitter, sucodoTracker */
/*jshint esversion: 6 */
"use strict";

function run() {
    maximizeWin();
    initButtons();
}

function initButtons() {
    $("#analyze").click(
        () => {
            sucodoEmitter.emit("onclick_analyze");
        }
    );

    $("#sample_text").click(
        () => {
            sucodoEmitter.emit("onclick_sample_text");
        }
    );
}

function maximizeWin() {
    Window.get().maximize();
}

/**
 * Updates the content/value of a HTML DOM element
 *
 * @param {string} name of the element (id tag)
 * @param {string} value new content
 */
function updateElement(name, value) {
    let $element = $("#" + name);
    if ($element.prop("tagName") === "DIV") {
        $element.html(value);
    } else {
        $element.val(value);
    }
}

/**
 * Returns the content/value of an element
 *
 * @param name name of the element (id tag)
 * @returns {string}
 */
function getElementValue(name) {
    return $("#" + name).val();
}

module.exports = {
    inject: require("../lib/dependencyInjection").getInjector(global),
    run: run,
    updateElement: updateElement,
    getElementValue: getElementValue
};
