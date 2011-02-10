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
            asyncTestsRun = 0;
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
                txt_test3 : ['test3_1', 'test3_2']
            };
            // create the spans
            $('#testresults').append('<div id="test_remove_me">'
                    + '<span id="txt_test1"></span>'
                    + '<p><span id="txt_test2"></span></p>'
                    + '<p><div><span id="txt_test3"></span></div></p>'
                    + '<div><p><div><span id="txt_test1"></span></div></p></div>'
                    + '</div>'
                    );

            // init the loca
            loca.dict = dict;
        },
        tearDown: function () {
            loca.dict = null;
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
        }
    }

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
    }

    var searcherTest =  {
        _testSearch : function () {
            var asyncCallback = impunit.asyncCallback(function (phrase, numResults) {
                impunit.assertTrue(numResults > 0);
                impunit.assertEqual('test', phrase);
                ws.destroy();
            });
            var ws = webSearcher.createInstance();
            ws.search('test', asyncCallback);
        },
        multSearchWs:webSearcher.createInstance(),
        multiSearchTerms: ['Hausfrau', 'Mutter', 'Hund', 'Haus'],
        _testMultiSearch : function () {
            var asyncCallback = impunit.asyncCallback(function (phrase, numResults) {
                impunit.assertTrue(numResults > 0);
                var index = searcherTest.multiSearchTerms.indexOf(phrase);
                impunit.assertTrue(index >= 0);
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
                if (textAnalyzerTest.callbackCount == 4) {
                    impunit.assertEqual(4, resultCount, "The number of results returned by the textanalyzer did not match");
                    impunit.assertEqual(3, results['Ich bin ein']);
                    impunit.assertEqual(8, results['Berliner.']);
                    impunit.assertEqual(2, results['Ich bin zwei']);
                    impunit.assertEqual(1, results['Hamburger.']);
                }
            });
            var checkTextFinishedCallback = impunit.asyncCallback(function () {
                impunit.assertEqual(4, textAnalyzerTest.callbackCount, "Not all test results were properly returned!");

            })
            setTimeout(checkTextFinishedCallback, 2000);
            ta.go(text, 3, asyncCallback);
        },

        resetHasBeenCalled: false,
        
        _testAnalyzerStop: function () {
            var callback = impunit.asyncCallback(function () {
                // do another test
                var ws = webSearcher.createInstance();
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
        }
    };

    var colorWarnerTest = {
        _testColorHighValues: function () {
            impunit.assertEqual('#ff0000', colorWarner.getColor(257));
            impunit.assertEqual('#ff0000', colorWarner.getColor(1000));
            impunit.assertEqual('#ff0000', colorWarner.getColor(1000000000));
        },
        _testColorMediumValues : function () {
            impunit.assertEqual('#800000', colorWarner.getColor(256));
            impunit.assertEqual('#800100', colorWarner.getColor(255));
            impunit.assertEqual('#800100', colorWarner.getColor(254));
            impunit.assertEqual('#804000', colorWarner.getColor(128));
        },
        _testColorSmallValues : function () {
            impunit.assertEqual('#000000', colorWarner.getColor(0));
            impunit.assertEqual('#000000', colorWarner.getColor(-1));
            impunit.assertEqual('#808000', colorWarner.getColor(1));
            impunit.assertEqual('#807f00', colorWarner.getColor(2));
        }
    };

    var webSearcherCleanUpTest = {
        _testAllWebSearchersDestroyed : function () {

            var checkCleanupCallback = impunit.asyncCallback(function () {
                impunit.assertTrue(webSearcherTable[0] !== null, "The main websearcher does not exist");
                for (var i = 1; i < webSearcherTable.length; i++) {
                    impunit.assertTrue(webSearcherTable[i] === null, "A test websearcher still exists at " + i);
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
                colorWarnerTest, webSearcherCleanUpTest, textMarkupTest];
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
