var webSearcherTable = (webSearcherTable) ? webSearcherTable : {maxsize : 0};

var webSearcher = (function () {

    var instance;
    var apikey = '4914B80205C02BE6B582183BC63D515125EAF4A7',
        callbacks = {},
        phraseQueue = [],
        scripts = [],
        intervalId = null,
        INTERVAL_WAIT_TIME = 1000,
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

        function searchDone(results) {
            var phrase = results.SearchResponse.Query.SearchTerms,
                result = {},
                cbs, i,
                numCallbacks;

            phrase = phrase.substring(1, phrase.length - 1);
            if (!results.SearchResponse.Web) {
                return;
            }
            result.count = results.SearchResponse.Web.Total;
            result.webResultCount = results.SearchResponse.Web.Total;
            result.sources = results.SearchResponse.Web.Results;

            cbs = callbacks[phrase];
            if (cbs) {
                numCallbacks = cbs.length;
                for (i = 0; i < numCallbacks; i++) {
                    cbs[i](phrase, result);
                }
            }
        }

        function contains(haystack, needle) {
            var trimmedHaystack = haystack
                .toLocaleLowerCase()
                .replace(/<(?:.|\n)*?>/gm, '')
                .replace(/[^\w\s]/gi, '')
                ;
            var trimmedNeedle = needle
                    .toLocaleLowerCase()
                    .replace(/<(?:.|\n)*?>/gm, '')
                    .replace(/[^\w\s]/gi, '')
                ;
            return trimmedHaystack.indexOf(trimmedNeedle) >= 0;
        }

        function doSearch(phrase) {
            $.ajax({
                url:'http://blekko.com/ws/?q="'+phrase+'"+/web+/json+/ps=64',
                dataType: 'jsonp',
                data: { },
                success: function( data ){
                    var phrase = data.noslash_q,
                        result = {},
                        cbs, i,
                        numCallbacks;

                    phrase = phrase.substring(1, phrase.length - 1);
                    result.sources = [];
                    for (var i in data.RESULT) {
                        var blekkoResult = data.RESULT[i];
                        if (contains(blekkoResult.snippet, phrase) >= 0) {
                            result.sources.push({
                                Url : blekkoResult.url
                            });
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
            delete webSearcherTable[getSearcherTableId()];
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
        wsId = webSearcherTable.maxsize;
        webSearcherTable[getSearcherTableId()] = ws;
        webSearcherTable.maxsize++;

        return ws;
    }
    instance = createInstance();
    return instance;
}());

