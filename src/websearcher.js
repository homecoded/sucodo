var webSearcher = (function () {

    // get your own api key! do not use this one
    var apikey = '4914B80205C02BE6B582183BC63D515125EAF4A7';
    var callback = null;

    function search(phrase, cb) {
        callback = cb;
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.src = 'http://api.search.live.net/json.aspx?JsonType=callback&JsonCallback=webSearcher.searchDone&sources=web&Appid=' + apikey
                + '&query="' + phrase + '"';
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    function searchDone(results) {
        var phrase = results.SearchResponse.Query.SearchTerms
        phrase = phrase.substring(1, phrase.length - 1);
        callback(phrase, results.SearchResponse.Web.Total);
    }

    return {
        search : search,
        searchDone : searchDone

    }
}());
