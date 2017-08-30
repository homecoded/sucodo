/*
 Copyright 2017 Manuel Rülke, homecoded.com

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

function create() {

    let tasks,
        timeOutId,
        minDelay,
        maxDelay;

    function reset() {
        if (timeOutId > 0) {
            clearTimeout(timeOutId);
        }
        tasks = [];
        timeOutId = -1;
        minDelay = 0;
        maxDelay = 0;
    }

    function add(taskFunction) {
        tasks.push(taskFunction);
    }

    function run() {
        if (tasks.length > 0) {
            let task = tasks.shift();
            if (maxDelay > 0) {
                let delayRange = maxDelay - minDelay;
                timeOutId = setTimeout(function () {
                    task();
                    run();
                }, minDelay + Math.floor(Math.random() * delayRange));
            } else {
                task();
                setTimeout(run, 0);
            }
        }
    }

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

    reset();

    return {
        reset: reset,
        add: add,
        run: run,
        setMaxDelay: setMaxDelay,
        setMinDelay: setMinDelay,
        getMinDelay: () => {
            return minDelay;
        },
        getMaxDelay: () => {
            return maxDelay;
        }
    }
}

module.exports = {
    create: create
}