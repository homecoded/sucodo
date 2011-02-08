var webSearcher = (function () {

    // TODO remove api key and insert a warning
    var apikey = '4914B80205C02BE6B582183BC63D515125EAF4A7';
    var callbacks = {};
    var phrases = [];
    var scripts = [];
    var allowUpdates = true;
    var intervalId = null;

    function search(phrase, cb) {
        if (cb) {
            if (!callbacks[phrase]) {
                callbacks[phrase] = [];
                callbacks[phrase].push(cb);
            }
        }
        phrases.push(phrase);
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
        script.src = 'http://api.search.live.net/json.aspx?JsonType=callback&JsonCallback=webSearcher.searchDone&sources=web&Appid=' + apikey
                + '&query="' + phrase + '"';
        scripts.push(script);
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    function update() {
        if (phrases.length > 0) {
            var phrase = phrases.pop();
            doSearch(phrase);
        }
    }

    function stopScripts() {
        callbacks = {};
        phrases = [];
        var numToRemove = scripts.length;
        for (var i = 0; i < numToRemove; i++) {
            document.getElementsByTagName('head')[0].removeChild(scripts[i]);
        }
        scripts = [];
    }

    function startThread() {
        if (!intervalId) {
            intervalId = setInterval(update, 250);
        }
    }

    function stopThread() {
        if (intervalId) {
            clearInterval(intervalId);
        }
    }

    return {
        search : search,
        searchDone : searchDone,
        stopScripts: stopScripts
    }
}());
