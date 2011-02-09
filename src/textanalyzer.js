var textAnalyzer = (function () {

    var phrases;
    var webSearcher;
    var callback;
    var plagiarismCount;

    function setWebSearcher(searcher) {
        webSearcher = searcher;
    }

    function go (newText, wordgrouplen, cb) {
        callback = cb;
        phrases = [];
        plagiarismCount = [];
        var paragraphs = textBreaker.breakUp(newText, wordgrouplen);
        var i;
        for (i = 0; i < paragraphs.length; i++ ) {
            if (paragraphs[i].constructor === Array)
            {
                var paragraph = paragraphs[i];
                for (var j = 0; j < paragraph.length; j++) {
                    phrases.push(paragraph[j]);
                    plagiarismCount[paragraph[j]] = 0;
                }
            } else {
                phrases.push(paragraphs[i]);
                plagiarismCount[paragraphs[i]] = 0;
            }
        }

        for (i = 0; i < phrases.length; i++) {
            if (phrases[i] !== '') {
                webSearcher.search(phrases[i], onNewResultReceived)
            }
        }
    }

    function stop() {
        webSearcher.stopScripts();
        callback = null;
        phrases = [];
    }

    function onNewResultReceived(phrase, count) {
        plagiarismCount[phrase] = count;
        if (callback) {
            callback();
        }
    }

    function getResult() {
        return plagiarismCount;
    }

    return {
        go: go,
        stop: stop,
        getResult: getResult,
        setWebSearcher : setWebSearcher,
        timeLeft: function () {
            return webSearcher.timeLeft();
        }
    }
}());