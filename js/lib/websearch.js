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

/*jshint esversion: 6 */
"use strict";

const https = require("https");
const cheerio = require("cheerio");
const sanitizeHtml = require("sanitize-html");

/**
 * @param {string} query
 * @param {function} callback, returns array containing elements like { title: string, link: string, caption: string}
 * @param {number} count number of max expected results
 */
function scrapeBingHTML(query, callback, count) {
    const options = {
        hostname: "www.bing.com",
        path: `/search?q="${encodeURIComponent(query)}"&count=${count}`,
        port: 443
    };

    let request = https.request(options, function (res) {

        let data = "";

        res.on("data", function (chunk) {
            data += chunk;
        });

        res.on("end", function () {
            callback(data);
        });

        res.on("error", function (info) {
            throw new Error(info);
        });
    });

    request.end();
}

/**
 *
 * @param {string} term
 * @param {function} callback
 * @param {number} count number of max expected results
 */
function search(term, callback, count = 30) {

    scrapeBingHTML(
        term,
        (html) => {
            const $ = cheerio.load(sanitizeHtml(
                html, {
                    allowedTags: false,
                    allowedAttributes: false
                })
            );

            let results = [];

            $("#b_results").find(".b_algo").each(function () {

                const $this = $(this);
                const $link = $this.find($("h2 a"));
                const $text = $this.find($(".b_caption p"));

                results.push({
                    title: $link.text(),
                    link: $link.attr("href"),
                    caption: $text.text()
                });
            });

            callback(results);
        },
        count
    );
}

module.exports = {
    search: search
};