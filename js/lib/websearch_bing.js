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
 * Websearch module. It will perform a simple web search by calling the Bing (Microsoft) website via https
 * and scraping the results from the html.
 *
 * Bing ToS (https://www.bing.com/partners/termsofuse) do not explicitly forbid such behavior. However,
 * excessive use may result in being blocked access to search results. Microsoft may start show captchas if too many
 * access attempts have been made from a single machine.
 */

/* globals nw */
/*jshint esversion: 6 */
"use strict";

const cheerio = require("cheerio");
const sanitizeHtml = require("sanitize-html");

let emergencyBreak = false;

/**
 *
 * @param {string} term
 * @param {function} callback
 * @param {number} count number of max expected results
 */
function search(term, callback, count = 30) {

    if (emergencyBreak) {
        setTimeout(
            function () {
                search(term, callback, count);
            },
            8000
        );
        return;
    }

    nw.Window.open("https://www.bing.com/search?q=%22" + term + "%22",
        {
            width: 600 + Math.floor(200 * Math.random()),
            height: 450 + Math.floor(200 * Math.random()),
            position: "center"

        },
        function (win) {
            const searchWin = win;
            searchWin.on("loaded", () => {
                setTimeout(
                    function () {
                        const $ = cheerio.load(sanitizeHtml(
                            searchWin.window.document.body.innerHTML, {
                                allowedTags: false,
                                allowedAttributes: false
                            })
                        );

                        let results = [];

                        $("#b_results").find(".b_algo").each(function () {

                            const $this = $(this);
                            const $link = $this.find($("a"));
                            const $text = $this.find($(".b_caption"));

                            results.push({
                                title: $link.text(),
                                link: $link.attr("href"),
                                caption: $text.text()
                            });
                        });

                        if (searchWin.window.document.body.innerHTML.toLowerCase().indexOf("too many requests") < 0) {
                            searchWin.close(true);
                            emergencyBreak = false;
                        } else {
                            console.log("!!!! ERMERGENCY BREAK !!!!");
                            emergencyBreak = true;
                            return;
                        }

                        results = uniqBy(results, "link");
                        callback(results);
                    },
                    1500
                );
            }
            );
        }
    );
}

function uniqBy(a, key) {
    let seen = {};
    return a.filter(function (item) {
        const val = item[key];
        let isAlreadyThere = false;
        if (val) {
            if (seen[val]) {
                isAlreadyThere = true;
            }
            seen[val] = true;
        }

        return isAlreadyThere === false;
    });
}

module.exports = {
    search: search
};
