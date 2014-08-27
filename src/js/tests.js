/*
 Copyright 2011 Manuel Rülke, http://homecoded.com

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 Check https://github.com/homecoded/impunit for documentation
 */

var impunit = (function () {

    function createInstance() {
        var impunit = {}, messages = '', asyncMessages = '', isTestFailed,
            testsRun = -1, testsFailed = -1, asyncTestsFailed = [],
            silent = true, testName, currentTestContext, asyncTestTeardown = {}, isAsyncTest,
            asyncTestsRun = [], asyncCb = null, asyncTestsInProgress = {},
            uniqueId = 0;

        // private function to report an error
        function reportError(msg, asyncTestName) {
            isTestFailed = true;
            if (asyncTestName) {
                asyncMessages += 'ASYNC TEST (' + asyncTestName + '):\n' + msg + '\n\n';
                if (asyncTestsFailed.indexOf(asyncTestName) < 0) {
                    asyncTestsFailed.push(asyncTestName);
                }
                if (asyncCb) {
                    asyncCb();
                }
            } else {
                messages += msg + '\n\n';
            }
            if (!silent) {
                alert(msg);
            }
        }

        // run the tests in a test container
        impunit.runTests = function (testSuites) {
            if (!testSuites) {
                reportError('ERROR: No Test Suite specified.');
            }

            if (!(testSuites instanceof Array)) {
                testSuites = [testSuites];
            }

            var test;
            testsRun = 0; testsFailed = 0; asyncTestsFailed = []; asyncTestsRun = 0;
            asyncTestsRun = []; asyncTestTeardown = {}; messages = '';

            var numTestSuites = testSuites.length;
            for (i = 0; i < numTestSuites; i++) {
                var testSuite = testSuites[i];
                var setupMethod = (testSuite['_setup']) ? testSuite['_setup'] : function () {};
                var teardownMethod = (testSuite['_teardown']) ? testSuite['_teardown'] : function () {};

                for (test in testSuite) {
                    if (testSuite.hasOwnProperty(test)) {
                        testName = test;
                        try {
                            if (typeof (testSuite[testName]) === 'function' && testName.indexOf('_test') === 0) {
                                uniqueId++;
                                isTestFailed = false;
                                testsRun += 1;
                                currentTestContext = testSuite;
                                isAsyncTest = false;
                                setupMethod.call(currentTestContext);
                                testSuite[testName].call(currentTestContext);
                                if (isAsyncTest) {
                                    asyncTestTeardown[testName+uniqueId] = teardownMethod;
                                } else {
                                    teardownMethod.call(currentTestContext);
                                }
                                if (isTestFailed) {
                                    testsFailed += 1;
                                }
                            }
                        } catch (e) {
                            testsFailed += 1;
                            reportError('TEST FAILED\nTest Name: ' + testName + '\nError: ' + e);
                            if (teardownMethod) {
                                teardownMethod.call(currentTestContext);
                            }
                        }
                    }
                }
            }
        };

        function assert(expr, testIdent, msg, asyncTestName) {
            if (expr === false) {
                reportError('TEST FAILED\nTest Name: ' + testName + '\n' + testIdent + ': ' + msg,
                    asyncTestName);
            }
            if (asyncTestName && asyncCb) {
                if (asyncTestsRun.indexOf(asyncTestName) < 0 ) {
                    asyncTestsRun.push(asyncTestName);
                }
                asyncCb();
            }
        }

        impunit.assertTrue = function (boolExpr, msg) {
            assert(boolExpr, 'assertTrue', msg, impunit.assertTrue.caller.testName);
        };

        impunit.assertEqual = function (exp1, exp2, msg) {
            assert(exp1 === exp2, 'assertEqual (' + exp1 + ') != (' + exp2 + ')', msg, impunit.assertEqual.caller.testName);
        };

        impunit.messages = function () { return messages; };
        impunit.asyncMessages = function () { return asyncMessages; };
        impunit.testsFailed = function () { return testsFailed; };
        impunit.asyncTestsFailed = function () { return asyncTestsFailed.length; };
        impunit.testsRun = function () { return testsRun; };
        impunit.asyncTestsRun = function () { return asyncTestsRun.length; };

        impunit.silent = function (value) {
            if (arguments.length > 0) {
                silent = (value) ? true : false;
            }
            return silent;
        };

        impunit.onAsyncTestFailed = function (callback) {
            if (arguments.length > 0 && typeof callback === 'function') {
                asyncCb = callback;
            }
            return asyncCb;
        };

        impunit.asyncCallback = function (callback) {
            isAsyncTest = true;
            var context = currentTestContext;
            callback.testName = testName;
            callback.id = uniqueId;

            var callbackWrapper = function () {
                var testName = callback.testName;
                if (asyncTestsInProgress[testName + callback.id]) {
                    var index = asyncTestsInProgress[testName + callback.id].indexOf(callback);
                    asyncTestsInProgress[testName + callback.id].splice(index, 1)
                }
                callback.apply(context, arguments);
                if (!asyncTestsInProgress[testName + callback.id]
                    || asyncTestsInProgress[testName + callback.id].length == 0) {
                    if (asyncTestTeardown[testName+callback.id]) {
                        asyncTestTeardown[testName+callback.id].call(context);
                    }
                }
            }
            if (!asyncTestsInProgress[testName+callback.id]) {
                asyncTestsInProgress[testName+callback.id] = [];
            }
            asyncTestsInProgress[testName+callback.id].push(callback);
            return callbackWrapper;
        };

        return impunit;
    }

    var impunit = createInstance();
    impunit.createInstance = createInstance;
    return impunit;
}());




















var tests = (function () {
    var textBreakerTest = {
        _testTextBreaker: function () {
            // one paragraph
            var text = "I am a text. I am a text. I am a text.";

            var paragraphs = Sucodo.TextBreaker.breakUp(text, 3);
            impunit.assertEqual("I am a", paragraphs[0][0]);
            impunit.assertEqual("text. I am", paragraphs[0][1]);
            impunit.assertEqual("a text. I", paragraphs[0][2]);
            impunit.assertEqual("am a text.", paragraphs[0][3]);

            paragraphs = Sucodo.TextBreaker.breakUp(text, 4);
            impunit.assertEqual("I am a text.", paragraphs[0][0]);
            impunit.assertEqual("I am a text.", paragraphs[0][1]);
            impunit.assertEqual("I am a text.", paragraphs[0][2]);

            paragraphs = Sucodo.TextBreaker.breakUp(text, 5);
            impunit.assertEqual("I am a text. I", paragraphs[0][0]);
            impunit.assertEqual("am a text. I am", paragraphs[0][1]);
            impunit.assertEqual("a text.", paragraphs[0][2]);
        },
        _testTextBreakerOnParagraph: function () {
            // more than one paragraph
            var text = "I am a text. I am a text.\nI am 2nd paragraph. I am 2nd paragraph.";
            paragraphs = Sucodo.TextBreaker.breakUp(text, 3);
            impunit.assertEqual(2, paragraphs.length);
            impunit.assertEqual("I am a", paragraphs[0][0]);
            impunit.assertEqual("text. I am", paragraphs[0][1]);
            impunit.assertEqual("a text.", paragraphs[0][2]);
            impunit.assertEqual("I am 2nd", paragraphs[1][0]);
            impunit.assertEqual("paragraph. I am", paragraphs[1][1]);
            impunit.assertEqual("2nd paragraph.", paragraphs[1][2]);
        },
        _testTextBreakerInvalidInput : function () {
            var undef;
            impunit.assertEqual(null, Sucodo.TextBreaker.breakUp(null, 3));
            impunit.assertEqual(null, Sucodo.TextBreaker.breakUp(undef, 3));
        }
    };

    var searcherTest =  {
        _testSearch : function () {
            var asyncCallback = impunit.asyncCallback(function (phrase, phraseData) {
                impunit.assertTrue(phraseData.count > 0);
                impunit.assertEqual('test', phrase);
                ws.destroy();
            });
            var ws = Sucodo.WebSearcherOffline.createInstance("_testSearch");
            ws.search('test', asyncCallback);
            ws.destroy();
        },
        multSearchWs:Sucodo.WebSearcherOffline.createInstance("multSearchWs"),
        multiSearchTerms: ['Hausfrau', 'Mutter', 'Hund', 'Haus'],
        _testMultiSearch : function () {
            var asyncCallback = impunit.asyncCallback(function (phrase, phraseData) {
                impunit.assertTrue(phraseData.count > 0, 'phraseData count is 0 for phrase ' + phrase);
                var index = searcherTest.multiSearchTerms.indexOf(phrase);
                impunit.assertTrue(index >= 0, 'Index is littler than 0');
                searcherTest.multiSearchTerms[index] = null;
            });
            for (var i = 0; i < searcherTest.multiSearchTerms.length; i++) {
                searcherTest.multSearchWs.search(searcherTest.multiSearchTerms[i], asyncCallback);
            }
        },
        _testAllMultiSearchesCompleted : function () {
            var asyncCallback = impunit.asyncCallback(function () {
                for (var i = 0; i < searcherTest.multiSearchTerms.length; i++) {
                    impunit.assertEqual(searcherTest.multiSearchTerms[i], null, 'The search term "'
                            + searcherTest.multiSearchTerms[i] + '" has not been processed properly!');
                }
                searcherTest.multSearchWs.destroy();
            });
            // after 3s the results should be there
            setTimeout(asyncCallback, 3000);
        }
    };

    var textAnalyzerTest =  {
        mockSearcher : {
            search: function (phrase, cb) {
                var count = -1;
                if (phrase === 'Ich bin ein')   count = 3;
                if (phrase === 'Berliner.')     count = 8;
                if (phrase === 'Ich bin zwei')  count = 2;
                if (phrase === 'Hamburger.')    count = 1;

                if (count > 0) {
                    cb(phrase, count);
                } else {
                    impunit.assertTrue(false, "Unexpected search term");
                }
            }
        },
        callbackCount: 0,

        _testAnalyzer : function () {
            var ta = Sucodo.TextAnalyzer.createInstance();
            var text = "Ich bin ein Berliner.\nIch bin zwei Hamburger.";
            ta.setWebSearcher(textAnalyzerTest.mockSearcher);

            var asyncCallback = impunit.asyncCallback(function () {
                var results = ta.getResult();
                var resultCount = 0;
                for (var phrase in results) {
                    if (results.hasOwnProperty(phrase)) {
                        resultCount+=1;
                    }
                }
                textAnalyzerTest.callbackCount++;
                if (textAnalyzerTest.callbackCount == 2) {
                    impunit.assertEqual(4, resultCount, "The number of results returned by the textanalyzer did not match");
                    impunit.assertEqual(3, results['Ich bin ein']);
                    impunit.assertEqual(0, results['Berliner.']);  // not enough words
                    impunit.assertEqual(2, results['Ich bin zwei']);
                    impunit.assertEqual(0, results['Hamburger.']); // not enough words
                }
            });
            var checkTextFinishedCallback = impunit.asyncCallback(function () {
                impunit.assertEqual(2, textAnalyzerTest.callbackCount, "Not all test results were properly returned!");

            });
            setTimeout(checkTextFinishedCallback, 2000);
            ta.go(text, 3, asyncCallback);
        },

        resetHasBeenCalled: false,

        _testAnalyzerStop: function () {
            var callback = impunit.asyncCallback(function () {
                // do another test
                var ws = Sucodo.WebSearcherOffline.createInstance("_testAnalyzerStop");
                var ta = Sucodo.TextAnalyzer.createInstance();
                ta.setWebSearcher(ws);
                var text1 = "Test Test Test Test Test Test Test Test Test Test Test ";
                var text2 = "Mood Mood Mood Mood Mood Mood Mood Mood Mood Mood Mood ";
                textAnalyzerTest.resetHasBeenCalled = false;

                var testCallback = impunit.asyncCallback(function () {
                    var results = ta.getResult();
                    for (var phrase in results) {
                        if (results.hasOwnProperty(phrase)) {
                            impunit.assertTrue(phrase.indexOf("Test") < 0, "Old phrase returned after reset: " + phrase);
                            impunit.assertTrue(phrase.indexOf("Mood") >= 0, "New phrase not returned after reset: " + phrase);
                        }
                    }
                    ws.destroy();
                });

                var resetCallCallback = impunit.asyncCallback(function () {
                    if (textAnalyzerTest.resetHasBeenCalled) {
                        impunit.assertTrue(false, "The reset of analyzer did not work!");
                        ta.stop();
                        return;
                    }
                    textAnalyzerTest.resetHasBeenCalled = true;
                    ta.stop();
                    ta.go(text2, 3, testCallback);
                });
                ta.go(text1, 3, resetCallCallback);
            });
            setTimeout(callback, 3000);
        },

        mockSearcher2 : {
            search: function (phrase, cb) {
                var result = {
                    sources : [
                        { Url: 'http://www.funny.com'},
                        { Url: 'http://www.fake.com'},
                        { Url: 'http://www.fun.com'},
                        { Url: 'http://www.funeral.com'},
                        { Url: 'http://www.finger.com'}
                    ],
                    count: 5
                };
                cb(phrase, result);
            }
        },

        _testAnalyzerIgnoredSources: function () {
            var ta = Sucodo.TextAnalyzer.createInstance();
            var text = "Ich bin ein Berliner.";
            ta.setWebSearcher(textAnalyzerTest.mockSearcher2);
            ta.toggleIgnoreUrl('http://www.fun.com');
            ta.toggleIgnoreUrl('http://www.finger.com');

            var callback = function () {
                var results = ta.getResult();
                for (var phrase in results) {
                    var data = results[phrase];
                    if (data) {
                        for (var i in data.sources) {
                            if (data.sources[i].Url == 'http://www.fun.com' && !data.sources[i].ignored
                                || data.sources[i].Url == 'http://www.finger.com' && !data.sources[i].ignored)
                            {
                                impunit.assertTrue(false, 'Not all ignored URLs were ignored ' + data.sources[i].Url);
                            }
                        }
                        impunit.assertEqual(data.count, 3);
                    }
                }
            };
            ta.go(text, 3, callback);
        },

        _testAnalyzerRemoveIgnoredSourcesFromResult: function () {
            var ta = Sucodo.TextAnalyzer.createInstance();
            var text = "Ich bin ein Berliner.";
            ta.setWebSearcher(textAnalyzerTest.mockSearcher2);
            ta.go(text, 3);
            ta.toggleIgnoreUrl('http://www.fun.com');
            ta.toggleIgnoreUrl('http://www.finger.com');
            var result = ta.getResult();
            for (var phrase in result) {
                var data = result[phrase];
                if (data) {
                    for (var i in data.sources) {
                        if (!data.sources[i]) {
                            impunit.assertTrue(false, 'No result at all!');
                        }
                        if (data.sources[i].Url == 'http://www.fun.com' && !data.sources[i].ignored
                            || data.sources[i].Url == 'http://www.finger.com' && !data.sources[i].ignored) {
                            impunit.assertTrue(false, 'The ignored source is still in the result!');
                        }
                    }
                    impunit.assertEqual(data.count, 3);
                }
            }
        },

        _testAnalyzerRemoveAndAddIgnoredSourcesFromResult: function () {
            var ta = Sucodo.TextAnalyzer.createInstance();
            var text = "Ich bin ein Berliner.";
            ta.setWebSearcher(textAnalyzerTest.mockSearcher2);
            ta.go(text, 4);
            // disable
            ta.toggleIgnoreUrl('http://www.fun.com');
            // enable
            ta.toggleIgnoreUrl('http://www.fun.com');
            var result = ta.getResult();
            for (var phrase in result) {
                var data = result[phrase];
                if (data.sources) {
                    for (var i in data.sources) {
                        if (!data.sources[i]) {
                            impunit.assertTrue(false, 'No result at all!');
                        }
                        if (data.sources[i].Url == 'http://www.fun.com'){
                            impunit.assertTrue(data.sources[i].ignored === false, 'The source has not been correctly re-enabled');
                        }
                    }
                    impunit.assertEqual(data.count, 5);
                } else {
                    impunit.assertTrue(false, 'result is invalid');
                }

            }
        }

    };

    var colorWarnerTest = {
        _testColorHighValues: function () {
            impunit.assertEqual('#ff0000', Sucodo.ColorWarner.getColor(257));
            impunit.assertEqual('#ff0000', Sucodo.ColorWarner.getColor(1000));
            impunit.assertEqual('#ff0000', Sucodo.ColorWarner.getColor(1000000000));
        },
        _testColorMediumValues : function () {
            impunit.assertEqual('#ff0000', Sucodo.ColorWarner.getColor(256), "256");
            impunit.assertEqual('#ff0000', Sucodo.ColorWarner.getColor(255), "255");
            impunit.assertEqual('#fe0100', Sucodo.ColorWarner.getColor(254), "254");
            impunit.assertEqual('#bf2000', Sucodo.ColorWarner.getColor(128), "128");
        },
        _testColorSmallValues : function () {
            impunit.assertEqual('#000000', Sucodo.ColorWarner.getColor(0), "0");
            impunit.assertEqual('#000000', Sucodo.ColorWarner.getColor(-1), "-1");
            impunit.assertEqual('#804000', Sucodo.ColorWarner.getColor(1), "1");
            impunit.assertEqual('#804000', Sucodo.ColorWarner.getColor(2), "2");
            impunit.assertEqual('#813f00', Sucodo.ColorWarner.getColor(3), "3");
            impunit.assertEqual('#813f00', Sucodo.ColorWarner.getColor(4), "4");
        }
    };

    var webSearcherCleanUpTest = {
        _testAllWebSearchersDestroyed : function () {

            var checkCleanupCallback = impunit.asyncCallback(function () {
                var webSearcherCount = 0, j;
                if (Sucodo.WebSearcher) webSearcherCount++;
                if (Sucodo.WebSearcherOffline) webSearcherCount++;

                for (j = 0; j < webSearcherCount; j++) {
                    impunit.assertTrue(Sucodo.WebSearcherTable[Sucodo.WebSearcherTable['tb' + j]] !== null, "Main websearcher does not exist");
                }

                for (j = webSearcherCount; j < Sucodo.WebSearcherTable.size; j++) {
                    impunit.assertTrue(Sucodo.WebSearcherTable['tb' + j] === null, "A test websearcher still exists at " + j);
                }
            });
            setTimeout(checkCleanupCallback, 6000);
        }
    };

    var textMarkupTest = {
        _testMarkup : function () {
            var text = ["bla"];
            var result = Sucodo.TextMarkup.markup(text);
            impunit.assertEqual('<span id="phrase0" style="color:#000000">bla</span> <br>\n', result);
        },
        _testMarkupParagraphs : function () {
            var text = ["bla", "blub"];
            var result = Sucodo.TextMarkup.markup(text);
            var expected = '<span id="phrase0" style="color:#000000">bla</span> <br>\n'
                    + '<span id="phrase1" style="color:#000000">blub</span> <br>\n';
            impunit.assertEqual(expected, result);
        },
        _testMarkupParagraphs3 : function () {
            var text = ["bla", "blub", "honk"];
            var result = Sucodo.TextMarkup.markup(text);
            var expected = '<span id="phrase0" style="color:#000000">bla</span> <br>\n'
                    + '<span id="phrase1" style="color:#000000">blub</span> <br>\n'
                    + '<span id="phrase2" style="color:#000000">honk</span> <br>\n';
            impunit.assertEqual(expected, result);
        },
        _testMarkupParagraphsArray : function () {
            var text = [["bla", "blub"]];
            var result = Sucodo.TextMarkup.markup(text);
            var expected = '<span id="phrase0" style="color:#000000">bla</span> '
                    + '<span id="phrase1" style="color:#000000">blub</span> <br>\n';
            impunit.assertEqual(expected, result);
        },
        _testMarkupParagraphsArray3 : function () {
            var text = [["bla", "blub"], ["bla", "blub"], ["bla", "blub"]];
            var result = Sucodo.TextMarkup.markup(text);
            var expected = '<span id="phrase0" style="color:#000000">bla</span> '
                    + '<span id="phrase1" style="color:#000000">blub</span> <br>\n'
                    + '<span id="phrase2" style="color:#000000">bla</span> '
                    + '<span id="phrase3" style="color:#000000">blub</span> <br>\n'
                    + '<span id="phrase4" style="color:#000000">bla</span> '
                    + '<span id="phrase5" style="color:#000000">blub</span> <br>\n';
            impunit.assertEqual(expected, result);
        }
    };

    var storageTest = {
        _testGetSetIntKey : function () {
            var key = 2234,
                value = 'this is test',
                storage = Sucodo.Storage.getInstance()
            ;
            storage.set(key, value);
            impunit.assertEqual(storage.get(key), value);
        },
        _testGetSetStringKey : function () {
            var key = '2234',
                value = 'this is also test',
                storage = Sucodo.Storage.getInstance()
                ;
            storage.set(key, value);
            impunit.assertEqual(storage.get(key), value);
        },
        _testGetSetObjectKey : function () {
            var key = { id : '2234' },
                value = 'this is also test',
                storage = Sucodo.Storage.getInstance()
                ;
            storage.set(key, value);
            impunit.assertEqual(storage.get(key), value);
        },
        _testGetSetMulti : function () {
            var key = '2234',
                key2 = 'test',
                key3 = '32)(/)(/()',
                value = 'this is also test',
                value2 = 12345,
                value3 = { test : 'blue' },
                storage = Sucodo.Storage.getInstance()
            ;
            storage.set(key, value);
            storage.set(key2, value2);
            storage.set(key3, value3);
            impunit.assertEqual(storage.get(key), value);
            impunit.assertEqual(storage.get(key2), value2);
            impunit.assertEqual(storage.get(key3), value3);
        },
        _testGetSetOverwrite : function () {
            var key = '2234',
                key2 = 'test',
                key3 = '32)(/)(/()',
                value = 'this is also test',
                value2 = 12345,
                value3 = { test : 'blue' },
                storage = Sucodo.Storage.getInstance()
            ;

            storage.set(key, value);
            impunit.assertEqual(storage.get(key), value);
            storage.set(key, value2);
            impunit.assertEqual(storage.get(key), value2);

            storage.set(key2, value2);
            storage.set(key2, value3);
            impunit.assertEqual(storage.get(key2), value3);

            storage.set(key, value3);
            impunit.assertEqual(storage.get(key), value3);
        },
        _testDelete : function () {
            var storage = Sucodo.Storage.getInstance();
            storage.set('6554', 55344354387681);
            impunit.assertEqual(storage.get('6554'), 55344354387681);

            storage.set('6554', null);
            impunit.assertEqual(storage.get('6554'), null);
        },
        _testUndefined : function () {
            var storage = Sucodo.Storage.getInstance()
            impunit.assertEqual(storage.get('undefined'), null);
        }
        ,
        _testClear : function () {
            var storage = Sucodo.Storage.getInstance();
            storage.set(12368, 'my value 1');
            storage.set(12367, 'my value 2');
            impunit.assertEqual(storage.get(12368), 'my value 1');
            impunit.assertEqual(storage.get(12367), 'my value 2');
            storage.clear();
            impunit.assertEqual(storage.get(12368), null);
            impunit.assertEqual(storage.get(12367), null);
        },
        _testPermanentStorageLoadSave: function () {
            var storage = Sucodo.Storage.getInstance();
            if (storage.isPermanentStorageAvailable() == false) {
                return;
            }
            // not yet initialized
            storage.load('sucodo_test');
            impunit.assertEqual(storage.get('test'), null);

            // set and save
            storage.set('test', '54321');
            storage.save();
            impunit.assertEqual(storage.get('test'), '54321');

            // clear
            storage.clear();
            impunit.assertEqual(storage.get('test'), null);

            // load again
            storage.load('sucodo_test');
            impunit.assertEqual(storage.get('test'), '54321');
        },
        _testPermanentStorageDelete: function () {
            var storage = Sucodo.Storage.getInstance();
            if (storage.isPermanentStorageAvailable() == false) {
                return;
            }

            storage.load('sucodo_test');
            impunit.assertEqual(storage.get('test'), null);
            // set and save
            storage.set('test', '54321');
            storage.save();

            // delete
            storage.discard();
            impunit.assertEqual(storage.get('test'), null);

            // not loadable
            storage.load('sucodo_test');
            impunit.assertEqual(storage.get('test'), null);
        },
        _testMethodChainingLoad: function () {
            var storage = Sucodo.Storage.getInstance();
            storage.load('sucodo_test').set('__5252__', 'keller');
            impunit.assertEqual(storage.get('__5252__'), 'keller');
        },
        _testMethodChainingSave: function () {
            var storage = Sucodo.Storage.getInstance();
            storage.load('sucodo_test').save().set('__5352__', 'koller');
            impunit.assertEqual(storage.get('__5352__'), 'koller');
        },
        _testMethodChainingSet: function () {
            var storage = Sucodo.Storage.getInstance();
            impunit.assertEqual(storage.set('__5452__', 'kollur').get('__5452__'), 'kollur');
        },
        _testTimeout: function () {
            var storage = Sucodo.Storage.getInstance(),
                mockTimer  = (function (){
                    var time = 0;
                    function setTime(value) { time = value; }
                    function getTime() {return time; }
                    return {
                        setTime: setTime,
                        getTime: getTime
                    }
                })();

            storage.setTimer(mockTimer);
            storage.set('value', 'yeah');
            mockTimer.setTime(Sucodo.Storage.LIFE_TIME/2);
            impunit.assertEqual(storage.get('value'), 'yeah');
            mockTimer.setTime(Sucodo.Storage.LIFE_TIME);
            impunit.assertEqual(storage.get('value'), 'yeah');
            mockTimer.setTime(Sucodo.Storage.LIFE_TIME + 1);
            impunit.assertEqual(storage.get('value'), null);
        },

        _teardown : function () {
            var storage = Sucodo.Storage.getInstance();
            storage.load('sucodo_test');
            storage.discard();
        }
    };

    return {
        runTests: function () {
            var tests = [textBreakerTest, searcherTest, textAnalyzerTest,
                colorWarnerTest, webSearcherCleanUpTest, textMarkupTest, storageTest
                ];
            var testRun = 0, testsFailed = 0, messages = "";

            impunit.onAsyncTestFailed(function () {
                $('#asynctestresults').html('<pre>Asynchronous Tests run: '
                        + impunit.asyncTestsRun() + '\n'
                        + 'Asynchronous Tests failed:  '
                        + impunit.asyncTestsFailed() + '</pre>'
                        + '<pre>' + impunit.asyncMessages() + '</pre>');
            });

            for (var i = 0; i < tests.length; i++) {
                impunit.runTests(tests[i]);
                testRun += impunit.testsRun();
                testsFailed += impunit.testsFailed();
                messages += impunit.messages();
            }

            if (testRun > 0 && testsFailed == 0) {
                $('#testresults').html('TESTS: OK (' + testRun + ' tests)');
            }
            else {
                $('#testresults').html('TESTS: FAILED'
                        + '<br>tests run: ' + testRun
                        + '<br>tests failed: ' + testsFailed
                        + '<br>messages <pre>: ' + messages
                        + '</pre>');
            }
        }
    }
}());
