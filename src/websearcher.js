var webSearcherTable = [];

var webSearcher = (function () {

    var instance;

    function createInstance()  {
        // TODO remove api key and insert a warning
        var apikey = '4914B80205C02BE6B582183BC63D515125EAF4A7';
        var callbacks = {};
        var phraseQueue = [];
        var scripts = [];
        var allowUpdates = true;
        var intervalId = null;
        var INTERVAL_WAIT_TIME = 250;
        var wsId;

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
            var phrase = results.SearchResponse.Query.SearchTerms;
            phrase = phrase.substring(1, phrase.length - 1);
            if (!results.SearchResponse.Web) {
                return;
            }
            var numResults = results.SearchResponse.Web.Total;

            var cbs = callbacks[phrase];
            if (cbs) {
                var numCallbacks = cbs.length;
                for (var i = 0; i < numCallbacks; i++) {
                    cbs[i](phrase, numResults);
                }
            }
        }

        function doSearch(phrase) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = 'http://api.search.live.net/json.aspx?JsonType=callback&JsonCallback=webSearcherTable['+wsId+'].searchDone&sources=web&Appid=' + apikey
                    + '&query="' + phrase + '"';
            scripts.push(script);
            document.getElementsByTagName('head')[0].appendChild(script);
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
            var numToRemove = scripts.length;
            for (var i = 0; i < numToRemove; i++) {
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
            webSearcherTable[wsId] = null;
        }

        var ws =  {
            createInstance: createInstance,
            destroy: destroy,
            search : search,
            searchDone : searchDone,
            stop: stopScripts,
            timeLeft: timeLeft
        };
        wsId = webSearcherTable.length;
        webSearcherTable.push(ws);

        return ws;
    }
    instance = createInstance();
    return instance;
}());
