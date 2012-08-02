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
 */

var impunit = (function () {

    function createInstance() {
        var impunit = {}, messages = '', asyncMessages = '', isTestFailed,
                testsRun = -1, testsFailed = -1, asyncTestsFailed = [],
                silent = true, testName,
                asyncTestsRun = [], asyncCb = null;

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
        impunit.runTests = function (testSuite) {
            if (!testSuite) {
                reportError('ERROR: No Test Suite specified.');
            }

            var test;
            testsRun = 0;
            testsFailed = 0;
            asyncTestsFailed = [];
            asyncTestsRun = [];
            messages = '';

            for (test in testSuite) {
                if (testSuite.hasOwnProperty(test)) {
                    testName = test;
                    try {
                        if (typeof (testSuite[testName]) === 'function' && testName.indexOf('_test') === 0) {
                            isTestFailed = false;
                            testsRun += 1;
                            testSuite[testName]();
                            if (isTestFailed) {
                                testsFailed += 1;
                            }
                        }
                    } catch (e) {
                        testsFailed += 1;
                        reportError('TEST FAILED\nTest Name: ' + testName + '\nError: ' + e);
                    }
                }
            }
        };

        function assert(expr, testIdent, msg, asyncTestName) {
            if (expr === false) {
                testIdent = testIdent.replace(/</gi, '&lt;');
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
            assert(exp1 === exp2, 'assertEqual [' + exp1 + '] != [' + exp2 + ']', msg, impunit.assertEqual.caller.testName);
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
            callback.testName = testName;
            return callback;
        };

        return impunit;
    }

    var impunit = createInstance();
    impunit.createInstance = createInstance;
    return impunit;
}());





















var tests = (function () {
    // test loca
    var locatest = {
        setup: function () {
            // craete a dict
            var dict = {
                txt_test1 : ['test1_1', 'test1_2'],
                txt_test2 : ['test2_1', 'test2_2'],
                txt_test3 : ['test3_1', 'test3_2'],
                txt_test4 : ['#var# test', '#var# test2', { containsVariables: true}],
                txt_text5: ['#var# test #var#', '#var# test2 #var#', { containsVariables: true}],
                txt_text6: ['#var# test #var2#', '#var# test2 #var2#', { containsVariables: true}],
                txt_text7: ['#var# test #var2#', '#var# test2 #var2#']
            };
            // create the spans
            $('#testresults').append('<div id="test_remove_me">'
                    + '<span id="txt_test1"></span>'
                    + '<p><span id="txt_test2"></span></p>'
                    + '<p><div><span id="txt_test3"></span></div></p>'
                    + '<p><div><span id="txt_test4"></span></div></p>'
                    + '<div><p><div><span id="txt_test1"></span></div></p></div>'
                    + '<input type="button" id="btn_1" value="txt_test1" >'
                    + '<input type="button" id="btn_2" value="txt_test2" >'
                    + '<input type="button" id="btn_3" value="txt_text5" >'
                    + '</div>'
                    );

            // init the loca
            loca.setDict(dict);
        },
        tearDown: function () {
            loca.setDict(null);
            loca.setButtonDict(null);
            // remove the test elements
            $('#test_remove_me').remove();
        },
        _testLoca : function () {
            locatest.setup();
            impunit.assertEqual('test1_1', loca.getLocaData('txt_test1'));
            impunit.assertEqual('test1_1', loca.getLocaData('txt_test1', 0));
            impunit.assertEqual('test1_2', loca.getLocaData('txt_test1', 1));
            locatest.tearDown();
        },
        _testLocaReplace: function () {
            locatest.setup();
            loca.applyLocalization(0);
            impunit.assertEqual('test1_1', $('#txt_test1').html());
            impunit.assertEqual('test2_1', $('#txt_test2').html());
            impunit.assertEqual('test3_1', $('#txt_test3').html());
            locatest.tearDown();
        },
        _testLocaChange: function () {
            locatest.setup();
            loca.applyLocalization(0);
            loca.applyLocalization(1);
            impunit.assertEqual('test1_2', $('#txt_test1').html());
            impunit.assertEqual('test2_2', $('#txt_test2').html());
            impunit.assertEqual('test3_2', $('#txt_test3').html());
            locatest.tearDown();
        },
        _testLocaButtons: function () {
            locatest.setup();
            loca.applyLocalization(0);
            impunit.assertEqual('test1_1', $('#btn_1').val(), "Button 1 was not localized correctly");
            impunit.assertEqual('test2_1', $('#btn_2').val(), "Button 2 was not localized correctly");
            locatest.tearDown();
        },
        _testLocaButtonChange: function () {
            locatest.setup();
            loca.applyLocalization(0);
            loca.applyLocalization(1);
            impunit.assertEqual('test1_2', $('#btn_1').val(), "Button 1 was not localized correctly");
            impunit.assertEqual('test2_2', $('#btn_2').val(), "Button 2 was not localized correctly");
            locatest.tearDown();
        },
        _testLocaProcessed: function () {
            locatest.setup();
            var processedText;
            loca.setVariable('#var#', 66);
            processedText = loca.getProcessedLocaData("txt_test4", 0);
            impunit.assertEqual("66 test", processedText);

            loca.setVariable('#var#', "my");
            processedText = loca.getProcessedLocaData("txt_test4", 1);
            impunit.assertEqual("my test2", processedText);
            locatest.tearDown();
        },
        _testLocaProcessedMultiSameVar: function () {
            locatest.setup();
            var processedText;
            loca.setVariable('#var#', 66);
            processedText = loca.getProcessedLocaData("txt_text5", 0);
            impunit.assertEqual("66 test 66", processedText);

            loca.setVariable('#var#', "my");
            processedText = loca.getProcessedLocaData("txt_text5", 1);
            impunit.assertEqual("my test2 my", processedText);
            locatest.tearDown();
        },
        _testLocaProcessedMultiDiffVar: function () {
            locatest.setup();
            var processedText;
            loca.setVariable('#var#', 66);
            loca.setVariable('#var2#', 'wood');
            processedText = loca.getProcessedLocaData("txt_text6", 0);
            impunit.assertEqual("66 test wood", processedText);

            loca.setVariable('#var#', "my");
            loca.setVariable('#var2#', "88");
            processedText = loca.getProcessedLocaData("txt_text6", 1);
            impunit.assertEqual("my test2 88", processedText);
            locatest.tearDown();
        },
        _testLocaProcessedMultiDiffVarDisabled: function () {
            locatest.setup();
            var processedText;
            loca.setVariable('#var#', 66);
            loca.setVariable('#var2#', 'wood');
            processedText = loca.getProcessedLocaData("txt_text7", 0);
            impunit.assertEqual("#var# test #var2#", processedText);

            loca.setVariable('#var#', "my");
            loca.setVariable('#var2#', "88");
            processedText = loca.getProcessedLocaData("txt_text7", 1);
            impunit.assertEqual("#var# test2 #var2#", processedText);
            locatest.tearDown();
        },
        _testLocaProcessedButton: function () {
            locatest.setup();
            loca.applyLocalization(0);
            loca.setVariable('#var#', 66);
            loca.updateVariables('btn_3', 0);
            impunit.assertEqual('66 test 66', $('#btn_3').val(), "Button 3 was not localized correctly");

            loca.updateVariables('btn_3', 1);
            impunit.assertEqual('66 test2 66', $('#btn_3').val(), "Button 3 was not localized correctly");
            locatest.tearDown();
        },
        _testLocaProcessedSpan: function () {
            locatest.setup();
            loca.applyLocalization(0);
            loca.setVariable('#var#', 66);
            loca.updateVariables('txt_test4', 0);
            impunit.assertEqual('66 test', $('#txt_test4').html());

            loca.updateVariables('txt_test4', 1);
            impunit.assertEqual('66 test2', $('#txt_test4').html());
            locatest.tearDown();
        }
    };

    var textBreakerTest = {
        _testTextBreaker: function () {
            // one paragraph
            var text = "I am a text. I am a text. I am a text.";

            var paragraphs = textBreaker.breakUp(text, 3);
            impunit.assertEqual("I am a", paragraphs[0][0]);
            impunit.assertEqual("text. I am", paragraphs[0][1]);
            impunit.assertEqual("a text. I", paragraphs[0][2]);
            impunit.assertEqual("am a text.", paragraphs[0][3]);

            paragraphs = textBreaker.breakUp(text, 4);
            impunit.assertEqual("I am a text.", paragraphs[0][0]);
            impunit.assertEqual("I am a text.", paragraphs[0][1]);
            impunit.assertEqual("I am a text.", paragraphs[0][2]);

            paragraphs = textBreaker.breakUp(text, 5);
            impunit.assertEqual("I am a text. I", paragraphs[0][0]);
            impunit.assertEqual("am a text. I am", paragraphs[0][1]);
            impunit.assertEqual("a text.", paragraphs[0][2]);
        },
        _testTextBreakerOnParagraph: function () {
            // more than one paragraph
            var text = "I am a text. I am a text.\nI am 2nd paragraph. I am 2nd paragraph.";
            paragraphs = textBreaker.breakUp(text, 3);
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
            impunit.assertEqual(null, textBreaker.breakUp(null, 3));
            impunit.assertEqual(null, textBreaker.breakUp(undef, 3));
        }
    };

    var searcherTest =  {
        _testSearch : function () {
            var asyncCallback = impunit.asyncCallback(function (phrase, phraseData) {
                impunit.assertTrue(phraseData.count > 0);
                impunit.assertEqual('test', phrase);
                ws.destroy();
            });
            var ws = webSearcherOffline.createInstance("_testSearch");
            ws.search('test', asyncCallback);
            ws.destroy();
        },
        multSearchWs:webSearcherOffline.createInstance("multSearchWs"),
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
            var ta = textAnalyzer.createInstance();
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
                var ws = webSearcherOffline.createInstance("_testAnalyzerStop");
                var ta = textAnalyzer.createInstance();
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
            var ta = textAnalyzer.createInstance();
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
            var ta = textAnalyzer.createInstance();
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
            var ta = textAnalyzer.createInstance();
            var text = "Ich bin ein Berliner.";
            ta.setWebSearcher(textAnalyzerTest.mockSearcher2);
            ta.go(text, 4);
            ta.toggleIgnoreUrl('http://www.fun.com');
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
            impunit.assertEqual('#ff0000', sucodo.colorWarner.getColor(257));
            impunit.assertEqual('#ff0000', sucodo.colorWarner.getColor(1000));
            impunit.assertEqual('#ff0000', sucodo.colorWarner.getColor(1000000000));
        },
        _testColorMediumValues : function () {
            impunit.assertEqual('#ff0000', sucodo.colorWarner.getColor(256), "256");
            impunit.assertEqual('#ff0000', sucodo.colorWarner.getColor(255), "255");
            impunit.assertEqual('#fe0100', sucodo.colorWarner.getColor(254), "254");
            impunit.assertEqual('#bf2000', sucodo.colorWarner.getColor(128), "128");
        },
        _testColorSmallValues : function () {
            impunit.assertEqual('#000000', sucodo.colorWarner.getColor(0), "0");
            impunit.assertEqual('#000000', sucodo.colorWarner.getColor(-1), "-1");
            impunit.assertEqual('#804000', sucodo.colorWarner.getColor(1), "1");
            impunit.assertEqual('#804000', sucodo.colorWarner.getColor(2), "2");
            impunit.assertEqual('#813f00', sucodo.colorWarner.getColor(3), "3");
            impunit.assertEqual('#813f00', sucodo.colorWarner.getColor(4), "4");
        }
    };

    var webSearcherCleanUpTest = {
        _testAllWebSearchersDestroyed : function () {

            var checkCleanupCallback = impunit.asyncCallback(function () {
                var webSearcherCount = 0, j;
                if (webSearcher) webSearcherCount++;
                if (webSearcherOffline) webSearcherCount++;

                for (j = 0; j < webSearcherCount; j++) {
                    impunit.assertTrue(webSearcherTable[webSearcherTable['tb' + j]] !== null, "Main websearcher does not exist");
                }

                for (j = webSearcherCount; j < webSearcherTable.size; j++) {
                    impunit.assertTrue(webSearcherTable['tb' + j] === null, "A test websearcher still exists at " + j);
                }
            });
            setTimeout(checkCleanupCallback, 6000);
        }
    };

    var textMarkupTest = {
        _testMarkup : function () {
            var text = ["bla"];
            var result = textMarkup.markup(text);
            impunit.assertEqual('<span id="phrase0" style="color:#000000">bla</span> <br>\n', result);
        },
        _testMarkupParagraphs : function () {
            var text = ["bla", "blub"];
            var result = textMarkup.markup(text);
            var expected = '<span id="phrase0" style="color:#000000">bla</span> <br>\n'
                    + '<span id="phrase1" style="color:#000000">blub</span> <br>\n';
            impunit.assertEqual(expected, result);
        },
        _testMarkupParagraphs3 : function () {
            var text = ["bla", "blub", "honk"];
            var result = textMarkup.markup(text);
            var expected = '<span id="phrase0" style="color:#000000">bla</span> <br>\n'
                    + '<span id="phrase1" style="color:#000000">blub</span> <br>\n'
                    + '<span id="phrase2" style="color:#000000">honk</span> <br>\n';
            impunit.assertEqual(expected, result);
        },
        _testMarkupParagraphsArray : function () {
            var text = [["bla", "blub"]];
            var result = textMarkup.markup(text);
            var expected = '<span id="phrase0" style="color:#000000">bla</span> '
                    + '<span id="phrase1" style="color:#000000">blub</span> <br>\n';
            impunit.assertEqual(expected, result);
        },
        _testMarkupParagraphsArray3 : function () {
            var text = [["bla", "blub"], ["bla", "blub"], ["bla", "blub"]];
            var result = textMarkup.markup(text);
            var expected = '<span id="phrase0" style="color:#000000">bla</span> '
                    + '<span id="phrase1" style="color:#000000">blub</span> <br>\n'
                    + '<span id="phrase2" style="color:#000000">bla</span> '
                    + '<span id="phrase3" style="color:#000000">blub</span> <br>\n'
                    + '<span id="phrase4" style="color:#000000">bla</span> '
                    + '<span id="phrase5" style="color:#000000">blub</span> <br>\n';
            impunit.assertEqual(expected, result);
        }
    };

    return {
        runTests: function () {
            var tests = [locatest, textBreakerTest, searcherTest, textAnalyzerTest,
                colorWarnerTest, webSearcherCleanUpTest, textMarkupTest
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
