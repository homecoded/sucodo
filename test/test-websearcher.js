const websearch = require('../lib/websearch');
const assert = require('assert');
const sleep = require('sleep');

const snippet = 'We hold these truths to be self-evident, that all men are created equal';
const quotedSnippet = 'All that we are is the result of what we have thought.';
const quotedSnippetAppendix = ' Buddha';
const numberOfResults = 10;
const timeOut = 10000;

//noinspection ES6ModulesDependencies
/**
 * Note: the sleeps between tests are for stayking below a annoyance threshold for the search engine.
 * Contacting it too often might trigger an IP ban.
 */

describe('Websearcher',
    function () {
        describe('#search()',
            function () {
                //noinspection ES6ModulesDependencies
                it(
                    'should return results for a snippet of the Declaration of Independence',
                    function (done) {
                        this.timeout(timeOut);
                        sleep.msleep(1000);
                        websearch.search(
                            snippet,
                            (results) => {
                                assert(results.length > 0, 'No results returned for the snippet. Websearch does not work.');
                                done();
                            }
                        )
                    }
                );
                sleep.msleep(2000);
                it(
                    'should return ' + numberOfResults + ' results for a snippet of the Declaration of Independence, if num specified',
                    function (done) {
                        this.timeout(timeOut);
                        sleep.msleep(1000);
                        websearch.search(
                            snippet,
                            (results) => {
                                assert.equal(results.length, numberOfResults, 'The number of expected results did not match.');
                                done();
                            },
                            numberOfResults
                        )
                    }
                );
                sleep.msleep(2000);

                it(
                    'should contain specified snippet text in caption',
                    function () {
                        this.timeout(timeOut);
                        sleep.msleep(1000);
                        websearch.search(
                            snippet,
                            (results) => {
                                let numberOfCaptionsContainingSnippet = 0;
                                for (let result of results) {
                                    if (result.caption.indexOf(snippet)) {
                                        numberOfCaptionsContainingSnippet++;
                                    }
                                }
                                assert(numberOfCaptionsContainingSnippet > 0, 'No caption contained the snippet');
                            },
                            numberOfResults
                        )
                    }
                );
                sleep.msleep(2000);

                it(
                    'should correctly search for terms that contain quotation marks.',
                    function () {
                        this.timeout(timeOut);
                        sleep.msleep(1000);
                        websearch.search(
                            '"' + quotedSnippet + '"' + quotedSnippetAppendix,
                            (results) => {
                                let numberOfCaptionsContainingSnippet = 0;
                                for (let result of results) {
                                    if (result.caption.indexOf(quotedSnippet)) {
                                        numberOfCaptionsContainingSnippet++;
                                    }
                                }
                                assert.equal(numberOfCaptionsContainingSnippet, numberOfResults, 'Not all results contained the quoted snippet');
                            },
                            numberOfResults
                        )
                    }
                );
            }
        );
    }
);