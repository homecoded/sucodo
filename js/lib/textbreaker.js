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
 * Text Breaker
 *
 * Break a text into word groups
 */

/*jshint esversion: 6 */
"use strict";

/**
 *
 * @param {Array} array
 * @param {number} chunkSize
 * @returns {Array}
 */
function chunkArray(array, chunkSize) {
    let result = [],
        i,
        len = array.length
        ;
    for (i = 0; i < len; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
}

/**
 *
 * @param {string} paragraphText
 * @param {number} wordGroupSize
 * @returns {Array}
 */
function breakParagraph(paragraphText, wordGroupSize) {
    let paragraph = [];
    let words = paragraphText.split(" ");
    let chunks = chunkArray(words, wordGroupSize);
    for (let wordGroup of chunks) {
        paragraph.push({
            text: wordGroup.join(" ").trim()
        });
    }
    return paragraph;
}
/**
 * @param {string} text
 * @param {number} wordGroupSize
 * @returns {Array}
 */
function breakText(text, wordGroupSize) {
    let paragraphs = text.split("\n");
    let results = [];

    for (let paragraphText of paragraphs) {
        let paragraph = breakParagraph(paragraphText, wordGroupSize);
        results.push(paragraph);
    }
    return results;
}

module.exports = {
    breakText: breakText
};