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
 * Event observer of analyze text interaction event
 */

/* globals sucodoInterface, sucodoEmitter */
/*jshint esversion: 6 */
"use strict";

const textBreaker = require("../../lib/textbreaker");
const webSearcher = require("../../lib/queued_websearcher");

let searcher = webSearcher.create();
searcher.setDelay(5000, 9000);

let resultText = "";

function run() {
    sucodoEmitter.on(
        "onclick_analyze",
        () => {
            let text = sucodoInterface.getElementValue("sucodo_textinput");
            let paragraphs = textBreaker.breakText(text, 7);
            resultText = "";

            for (let paragraph of paragraphs) {
                analyzeParagraph(paragraph);
            }
        }
    );
}

/**
 * @param {array} paragraph
 */
function analyzeParagraph(paragraph) {
    for (let wordGroup of paragraph) {
        // skip small word groups
        if (wordGroup.text.split(" ").length < 4) {
            handler(wordGroup.text, []);
            continue;
        }
        searcher.search(
            wordGroup.text,
            handler
        );
    }
}

/**
 * @param {string} term
 * @param {array} result
 * @param {number} result.length
 */
function handler(term, result) {
    if (!result) {
        return;
    }
    resultText += term + "(" + result.length + ") <br/>";
    for (var i = 0; i < result.length; i++){
        var link = result[i].link;
        resultText += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href=\"" + link + "\">" + link + "</a><br/>";
    }
    sucodoInterface.updateElement("sucodo_results", resultText);
}

module.exports = {
    inject: require("../../lib/dependencyInjection").getInjector(global),
    run: run
};
