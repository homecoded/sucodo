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
 * Queue module
 *
 * Add tasks to a queue and they will be executed in the order they are added.
 * You can specify a delay to wait between runs.
 * The delay can be a range. If so, a random delay between min and max is chosen.
 */

/*jshint esversion: 6 */
/*jshint latedef:false */
"use strict";

function create() {

    let tasks,
        timeOutId,
        minDelay,
        maxDelay,
        isRunning;

    function reset() {
        if (timeOutId > 0) {
            clearTimeout(timeOutId);
        }
        tasks = [];
        timeOutId = -1;
        minDelay = 0;
        maxDelay = 0;
        isRunning = false;
    }

    /**
     *
     * @param {function} taskFunction
     */
    function add(taskFunction) {
        tasks.push(taskFunction);
    }

    function next() {
        let delayRange = maxDelay - minDelay;
        if (tasks.length > 0) {
            let task = tasks.shift();
            if (maxDelay > 0 && isRunning === true) {
                timeOutId = setTimeout(
                    function () {
                        timeOutId = -1;
                        task();
                        setTimeout(next, minDelay + Math.floor(Math.random() * delayRange));
                    },
                    minDelay + Math.floor(Math.random() * delayRange)
                );
            } else {
                task();
                setTimeout(next, minDelay + Math.floor(Math.random() * delayRange));
            }
            isRunning = true;
        }
    }

    /**
     * @returns {boolean} if successfully started. It returns false if already started.
     */
    function run() {
        if (isRunning) {
            return false;
        }

        next();
        return true;
    }


    /**
     * @param {number} newMinDelay
     */
    function setMinDelay(newMinDelay) {
        if (newMinDelay >= 0) {
            minDelay = newMinDelay;
        }
        if (maxDelay < minDelay) {
            newMinDelay = maxDelay;
            maxDelay = minDelay;
            minDelay = newMinDelay;
        }
    }

    /**
     * @param {number} newMaxDelay
     */
    function setMaxDelay(newMaxDelay) {
        if (newMaxDelay >= 0) {
            minDelay = newMaxDelay;
        }
        if (maxDelay < minDelay) {
            newMaxDelay = minDelay;
            minDelay = maxDelay;
            maxDelay = newMaxDelay;
        }
    }

    // init the object automatically
    reset();

    return {
        reset: reset,
        add: add,
        run: run,
        setMaxDelay: setMaxDelay,
        setMinDelay: setMinDelay,
        getMinDelay: () => minDelay,
        getMaxDelay: () => maxDelay
    };
}

module.exports = {
    create: create
};
