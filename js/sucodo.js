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
 * Entry point of the app
 * All modules and objects that need to be shared across the app will be instantiated here
 **/

/* global nw_gui, $ */
/*jshint esversion: 6 */
"use strict";

const EventEmitter = require("events");
class SucodoEmitter extends EventEmitter {}
const sucodoEmitter = new SucodoEmitter();


let sucodoModules = [];

function initApp() {

    let sucodoInterface = initModule("./interface/userinterface", {
        "$": $,
        "Window": nw_gui.Window,
        "sucodoEmitter": sucodoEmitter
    });

    initModule("./interface/event/sampletext", {
        "sucodoInterface": sucodoInterface,
        "sucodoEmitter": sucodoEmitter
    });

    initModule("./interface/event/analyze", {
        "sucodoInterface": sucodoInterface,
        "sucodoEmitter": sucodoEmitter,
        "$": $,
        "Window": nw_gui.Window,
    });
}

/**
 *
 * @param {string} moduleSrc path to the module source relative to current file
 * @param {object} dependencies contains all depending modules and objects that will be injected in the global scope of
 *                  the module
 * @returns {module}
 */
function initModule(moduleSrc, dependencies) {
    let module = require(moduleSrc);
    module.inject(dependencies);
    sucodoModules.push(module);
    return module;
}

function run() {
    initApp();
    for (let sucodoModule of sucodoModules) {
        sucodoModule.run();
    }
}

module.exports = {
    inject: require("./lib/dependencyInjection").getInjector(global),
    run: run
};
