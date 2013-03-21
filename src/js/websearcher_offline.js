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

Sucodo.WebSearcherOffline = (function () {

    var instance;


    function createInstance(id)  {
        var callbacks = {},
            phraseQueue = [],
            scripts = [],
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

                    var link = 'http://www.' + words[Math.floor(Math.random()*words.length)]
                            + domains[Math.floor(Math.random()*domains.length)];
                    var len = Math.random()*9;
                    for (var j = 0; j < len; j++) {
                        link += '/' + words[Math.floor(Math.random()*words.length)];
                    }
                    link += '.html';

                    urls.push(
                        {
                            Url : link
                        }
                    );
                }
            }

            for (i=0; i < numSources; i++ ) {
                sources.push(urls[Math.floor(Math.random() * urls.length)]);
            }

            scripts.push(function () {
                    cb(phrase, {
                        count : numSources,
                        sources : sources
                    });
                });
            setInterval(runScripts, 100);
        }

        function timeLeft() {
            return 0;
        }

        function runScripts() {
            if (scripts.length > 0) {
                var script = scripts.pop();
                script();
                setInterval(runScripts, 100);
            }
        }

        function destroy () {
            delete Sucodo.WebSearcherTable['tb' + wsId];
        }

        function stop() {
            callbacks = {};
            phraseQueue = [];
            scripts = [];

        }

        ws =  {
            createInstance: createInstance,
            destroy: destroy,
            search : search,
            stop: stop,
            timeLeft: timeLeft,
            id: id
        };
        wsId = Sucodo.WebSearcherTable.maxsize;
        Sucodo.WebSearcherTable['tb' + wsId] = ws;
        Sucodo.WebSearcherTable.maxsize++;

        return ws;
    }
    instance = createInstance();
    return instance;
}());
