/*
 Copyright 2012 Manuel Rülke, homecoded.com

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

Sucodo.WebSearcherTable = (Sucodo.WebSearcherTable) ? Sucodo.WebSearcherTable : {maxsize : 0};

Sucodo.WebSearcher = (function () {

    var instance, callbacks = {},
        phraseQueue = [],
        scripts = [],
        intervalId = null,
        INTERVAL_WAIT_TIME = 1100,
        wsId,
        ws
        ;

    function createInstance()  {

        function search(phrase, cb) {
            if (cb) {
                if (!callbacks[phrase]) {
                    callbacks[phrase] = [];
                }
                // only add the callback if it's not already in
                if (callbacks[phrase].indexOf(cb) < 0) {
                    callbacks[phrase].push(cb);
                }
            }
            // stop here if the phrase is already in the queue
            if (phraseQueue.indexOf(phrase) >= 0) {
                return;
            }
            phraseQueue.push(phrase);
            startThread();
        }

        function contains(haystack, needle) {
            var trimmedHaystack = haystack
                .toLocaleLowerCase()
                .replace(/<(?:.|\n)*?>/gm, '')
                .replace(/[^\w\s]/gi, '')
                ,
                trimmedNeedle = needle
                    .toLocaleLowerCase()
                    .replace(/<(?:.|\n)*?>/gm, '')
                    .replace(/[^\w\s]/gi, '')
                ;
            return trimmedHaystack.indexOf(trimmedNeedle) >= 0;
        }

        function doSearch(phrase) {
            var apiAuth = '';
            if (Sucodo.blekkoApiKey) {
                apiAuth = '&auth=' + Sucodo.blekkoApiKey;
            }

            $.ajax({
                url:'http://blekko.com/ws/?q="'+phrase+'"+/json' + apiAuth,
                dataType: 'jsonp',
                data: { },
                success: function( data ){
                    var phrase = data.noslash_q,
                        result = {},
                        cbs, i,
                        numCallbacks,
                        blekkoResult;

                    phrase = phrase.substring(1, phrase.length - 1);
                    result.sources = [];
                    if (data.RESULT) {
                        for (i = 0; i < data.RESULT.length; i++) {
                            blekkoResult = data.RESULT[i];
                            if (contains(blekkoResult.snippet, phrase) === true) {
                                result.sources.push({
                                    Url : blekkoResult.url
                                });
                            }
                        }
                    }
                    result.count = result.sources.length;
                    result.webResultCount = result.sources.length;
                    cbs = callbacks[phrase];
                    if (cbs) {
                        numCallbacks = cbs.length;
                        for (i = 0; i < numCallbacks; i++) {
                            cbs[i](phrase, result);
                        }
                    }
                }
            });
        }

        function update() {
            if (phraseQueue.length > 0) {
                var phrase = phraseQueue.pop();
                doSearch(phrase);
            }
        }

        function stopScripts() {
            callbacks = {};
            phraseQueue = [];
            var i,
                numToRemove = scripts.length;
            for (i = 0; i < numToRemove; i++) {
                document.getElementsByTagName('head')[0].removeChild(scripts[i]);
            }
            scripts = [];
        }

        function startThread() {
            if (!intervalId) {
                intervalId = setInterval(update, INTERVAL_WAIT_TIME);
            }
        }

        function stopThread() {
            if (intervalId) {
                clearInterval(intervalId);
            }
        }

        function timeLeft() {
            return phraseQueue.length * INTERVAL_WAIT_TIME;
        }

        function destroy () {
            stopThread();
            delete Sucodo.WebSearcherTable[getSearcherTableId()];
        }

        function getSearcherTableId() {
            return 'tb' + wsId;
        }

        ws =  {
            createInstance: createInstance,
            destroy: destroy,
            search : search,
            stop: stopScripts,
            timeLeft: timeLeft
        };
        wsId = Sucodo.WebSearcherTable.maxsize;
        Sucodo.WebSearcherTable[getSearcherTableId()] = ws;
        Sucodo.WebSearcherTable.maxsize++;

        return ws;
    }
    instance = createInstance();
    return instance;
}());

