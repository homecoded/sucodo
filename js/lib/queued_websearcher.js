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

/**
 * Queued Web Searcher, combines queue and web searcher.
 */

/*jshint esversion: 6 */
"use strict";

const queue = require("./queue");
const websearch = require("./websearch");

const MIN_DELAY = 300;
const MAX_DELAY = 700;
const NUMBER_OF_RESULTS = 10;

function create() {

    let searchQueue = queue.create();
    let searchResults = {};

    /**
     * @param {number} minDelay
     * @param {number}maxDelay
     */
    function setDelay(minDelay, maxDelay) {
        searchQueue.setMinDelay(minDelay);
        searchQueue.setMaxDelay(maxDelay);
    }

    /**
     * @param {string} term
     * @param {function} callback
     */
    function search(term, callback) {
        //noinspection JSLint
        if (typeof searchResults[term] !== "undefined") {
            callback(searchResults[term]);
        }

        searchQueue.add(
            function () {
                websearch.search(
                    term,
                    function (results) {
                        searchResults[term] = results;
                        callback(term, results);
                    },
                    NUMBER_OF_RESULTS
                );
            }
        );

        searchQueue.run();
    }

    setDelay(MIN_DELAY, MAX_DELAY);

    return {
        search: search,
        setDelay: setDelay
    };

}

module.exports = {
    create: create
};
