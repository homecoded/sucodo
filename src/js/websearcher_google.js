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

Sucodo.WebSearcherGoogle = (function () {

    var instance, callbacks = {},
        phraseQueue = [],
        scripts = [],
        intervalId = null,
        INTERVAL_WAIT_TIME = 800,
        wsId,
        storage,
        ws
        ;

    function createInstance()  {

        var searchControl;

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

        function doSearch(phrase) {

            searchControl.setSearchCompleteCallback(
                this,
                function () {
                    var results = {};
                    results.count = searchControl.results.length;
                    results.webResultCount = searchControl.results.length;
                    results.sources = [];

                    for (var result in searchControl.results) {
                        results.sources.push({
                            Url : searchControl.results[result].url
                        });
                    }
                    onResultReceived(phrase, results);
                },
                null
            );
            searchControl.execute('"' + phrase + '"');

        }

        function onResultReceived(phrase, result) {
            cbs = callbacks[phrase];
            if (cbs) {
                numCallbacks = cbs.length;
                for (i = 0; i < numCallbacks; i++) {
                    cbs[i](phrase, result);
                }
            }

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
        storage = Sucodo.Storage.getInstance().load('websearcher' + wsId);

        // basic loading of google api
        if (typeof google == 'undefined' || typeof google.load == 'undefined') {
            $.getScript('http://www.google.com/jsapi', function () {
                google.load(
                    "search",
                    "1",
                    {
                        callback: function () {
                            searchControl = new google.search.WebSearch();
                            searchControl.setNoHtmlGeneration();
                        }
                    }
                );
            });
        } else {
            searchControl = new google.search.WebSearch();
            searchControl.setNoHtmlGeneration();
            searchControl.setResultSetSize(google.search.Search.LARGE_RESULTSET);
        }

        return ws;
    }
    instance = createInstance();
    return instance;
}());

