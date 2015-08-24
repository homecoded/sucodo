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

Sucodo.TextAnalyzer = (function () {

    var instance;

    function createInstance() {
        var phrases,
            webSearcher,
            callback,
            plagiarismCountMap,
            ignoredSources = {},
            paragraphs
            ;

        function setWebSearcher(searcher) {
            webSearcher = searcher;
        }

        function go (newText, wordgrouplen, cb) {

            callback = cb;
            phrases = [];
            plagiarismCountMap = [];
            paragraphs = Sucodo.TextBreaker.breakUp(newText, wordgrouplen);
            var i, j,
                randPhrases, sortRule,
                reg,
                paragraph,
                phrase;

            for (i = 0; i < paragraphs.length; i++ ) {
                if (paragraphs[i].constructor === Array)
                {
                    paragraph = paragraphs[i];
                    for (j = 0; j < paragraph.length; j++) {
                        phrases.push(paragraph[j]);
                        plagiarismCountMap[paragraph[j]] = 0;
                    }
                } else {
                    phrases.push(paragraphs[i]);
                    plagiarismCountMap[paragraphs[i]] = 0;
                }
            }

            // randomize the order in which phrases are searched
            randPhrases = phrases.slice(0);
            sortRule = function (a,b) {
                return (Math.random() >= 0.5) ? (a/a) : -(b/b);
            };
            // make sure it really is random
            randPhrases.sort(sortRule);
            randPhrases.sort(sortRule);

            for (i = 0; i < randPhrases.length; i++) {
                phrase = randPhrases[i];
                if (phrase !== '' && ((phrase.split(' ').length == wordgrouplen) || (randPhrases.length == 1))) {
                    webSearcher.search(phrase, onNewResultReceived);
                }
            }

            // count the search on sucodo.de
            reg = new Image();
            reg.src='http://sucodo.de/reg.php?num=' + randPhrases.length;
            return paragraphs;
        }

        function stop() {
            webSearcher.stop();
            callback = null;
            phrases = [];
        }

        function flagIgnoredSources(phraseData) {
            var i, source, sourceCount;
            if (phraseData.sources) {
                sourceCount = 0;
                for (i = 0; i < phraseData.sources.length; i++) {
                    source = phraseData.sources[i];
                    if (ignoredSources[source.Url]) {
                        if (!source.ignored) {
                            source.ignored = true;
                        }
                    } else {
                        if (source.ignored) {
                            source.ignored = false;
                        }
                        sourceCount++;
                    }
                }
                phraseData.count = sourceCount;
            }
            return phraseData;
        }

        function onNewResultReceived(phrase, phraseData) {
            plagiarismCountMap[phrase] = flagIgnoredSources(phraseData);
            if (callback) {
                callback();
            }
        }

        function getResult() {
            return plagiarismCountMap;
        }

        function toggleIgnoreUrl(url) {
            if (ignoredSources[url]) {
                delete ignoredSources[url];
            } else {
                ignoredSources[url] = true;
            }

            var phrase, data;

            for (phrase in plagiarismCountMap) {
                if (plagiarismCountMap.hasOwnProperty(phrase)) {
                    data = plagiarismCountMap[phrase];
                    if (data && data.sources) {
                        plagiarismCountMap[phrase] = flagIgnoredSources(data);
                    }
                }
            }
            return ignoredSources[url];
        }

        function isIgnoredSource(url) {
            return ignoredSources[url];
        }


        return {
            createInstance: createInstance,
            go: go,
            stop: stop,
            getResult: getResult,
            setWebSearcher : setWebSearcher,
            toggleIgnoreUrl: toggleIgnoreUrl,
            isIgnoredSource: isIgnoredSource,
            timeLeft: function () {
                return webSearcher.timeLeft();
            },
            getPhrases: function () {
                return paragraphs;
            }
        };

    }
    instance = createInstance();
    return instance;
}());