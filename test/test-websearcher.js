const websearch = require('../lib/websearch');
const assert = require('assert');
const sleep = require('sleep');

const snippet = 'We hold these truths to be self-evident, that all men are created equal';
const numberOfResults = 10;

describe('Websearcher',
    function () {
        describe('#search()',
            function () {
                it(
                    'should return results for a snippet of the Declaration of Independence',
                    function () {
                        sleep.sleep(1);
                        websearch.search(
                            snippet,
                            (results) => {
                                assert(results.length > 0, 'No results returned for the snippet. Websearch does not work.');
                            }
                        )
                    }
                );
                sleep.sleep(2);
                it(
                    'should return ' + numberOfResults +' results for a snippet of the Declaration of Independence, if num specified',
                    function () {
                        sleep.sleep(1);
                        websearch.search(
                            snippet,
                            (results) => {
                                assert.equal(results.length, numberOfResults, 'The number of expected results did not match.')
                            },
                            numberOfResults
                        )
                    }
                );
                sleep.sleep(2);
                it(
                    'should contain specified snippet text in caption',
                    function () {
                        sleep.sleep(1);
                        websearch.search(
                            snippet,
                            (results) => {
                                let numberOfCaptionsContainingSnippet = 0;
                                for (let result of results) {
                                    if (result.caption.indexOf(snippet)) {
                                        numberOfCaptionsContainingSnippet++;
                                    }
                                }
                                assert(numberOfCaptionsContainingSnippet > 0, 'No caption contained a snippet');
                            },
                            numberOfResults
                        )
                    }
                );
            }
        );
    }
);