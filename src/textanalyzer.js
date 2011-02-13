var textAnalyzer = (function () {

    var instance;

    function createInstance() {
        var phrases;
        var webSearcher;
        var callback;
        var plagiarismCountMap;

        function setWebSearcher(searcher) {
            webSearcher = searcher;
        }

        function go (newText, wordgrouplen, cb) {
            callback = cb;
            phrases = [];
            plagiarismCountMap = [];
            var paragraphs = textBreaker.breakUp(newText, wordgrouplen);
            var i;
            for (i = 0; i < paragraphs.length; i++ ) {
                if (paragraphs[i].constructor === Array)
                {
                    var paragraph = paragraphs[i];
                    for (var j = 0; j < paragraph.length; j++) {
                        phrases.push(paragraph[j]);
                        plagiarismCountMap[paragraph[j]] = 0;
                    }
                } else {
                    phrases.push(paragraphs[i]);
                    plagiarismCountMap[paragraphs[i]] = 0;
                }
            }

            // randomize the orde in which phrases are searched
            var randPhrases = phrases.slice(0);
            randPhrases.sort(function (a,b) {
                return (Math.random() >= 0.5) ? 1 : -1;
            });

            for (i = 0; i < randPhrases.length; i++) {
                if (randPhrases[i] !== '') {
                    webSearcher.search(randPhrases[i], onNewResultReceived)
                }
            }

            // count the search on sucodo.de
            var reg = new Image();
            reg.src='http://sucodo.de/reg.php'; 

            return paragraphs;
        }

        function stop() {
            webSearcher.stop();
            callback = null;
            phrases = [];
        }

        function onNewResultReceived(phrase, count) {
            plagiarismCountMap[phrase] = count;
            if (callback) {
                callback();
            }
        }

        function getResult() {
            return plagiarismCountMap;
        }

        return {
            createInstance: createInstance,
            go: go,
            stop: stop,
            getResult: getResult,
            setWebSearcher : setWebSearcher,
            timeLeft: function () {
                return webSearcher.timeLeft();
            }
        }

    }
    instance = createInstance();
    return instance;
}());