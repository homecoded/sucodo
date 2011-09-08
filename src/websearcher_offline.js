var webSearcherTable = (webSearcherTable) ? webSearcherTable : [];

var webSearcherOffline = (function () {

    var instance;


    function createInstance()  {
        // TODO remove api key and insert a warning
        var apikey = '4914B80205C02BE6B582183BC63D515125EAF4A7',
            callbacks = {},
            phraseQueue = [],
            scripts = [],
            intervalId = null,
            INTERVAL_WAIT_TIME = 250,
            wsId,
            ws,
            words = ['google', 'alpaka', 'homecoded', 'flaregames', 'sucodo', 'friendly',
                    'dango', 'gulliver', 'kindergarden', 'frail', 'structure', 'farrazi', 'finkelstein',
                    'underthehood', 'abc', 'yellowman', 'freedom', 'foo', 'fellow', 'fiends', 'fundle', 'snafu',
                    'gooya', 'bear', 'nean', 'bean', 'booky', 'apikey', 'destroy', 'fangora', 'fizz', 'fuzz', 'fooz'],
            domains = ['.com', '.de', '.co.uk', '.net', 'org', '.to'],
            urls;

        function search(phrase, cb) {

            var sources = [],
                numSources = Math.floor(Math.random() * 12),
                i;


            if (!urls) {
                urls = [];
                for (i = 0; i < 32; i++) {
                    urls.push(
                        {
                            Url : 'http://www.' + words[Math.floor(Math.random()*words.length)]
                            + domains[Math.floor(Math.random()*domains.length)]
                            + '/' + words[Math.floor(Math.random()*words.length)]
                            + '/' + words[Math.floor(Math.random()*words.length)]
                            + '.html'
                        }
                    );
                }
            }

            for (i=0; i < numSources; i++ ) {
                sources.push(urls[Math.floor(Math.random() * urls.length)]);
            }


            setTimeout( function () {
                    cb(phrase, {
                        count : numSources,
                        sources : sources
                    });
                }, 100);
        }

        function timeLeft() {
            return 0;
        }

        function destroy () {
            webSearcherTable[wsId] = null;
        }

        ws =  {
            createInstance: createInstance,
            destroy: destroy,
            search : search,
            stop: function () {},
            timeLeft: timeLeft
        };
        wsId = webSearcherTable.length;
        webSearcherTable.push(ws);

        return ws;
    }
    instance = createInstance();
    return instance;
}());
