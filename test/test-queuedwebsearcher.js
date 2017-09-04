const queuedWebsearcher = require('../lib/queued_websearcher');

const assert = require('assert');
const timeOut = 10000;
const delay = 1500;

describe('Queued Websearcher',
    function () {
        describe('#search()',
            function () {
                it(
                    'should run web searches delayed',
                    function (done) {
                        this.timeout(timeOut);
                        let webSearcher = queuedWebsearcher.create();
                        webSearcher.setDelay(delay, delay);
                        let searchCompleted = [];
                        let searchTerms = [
                            'Die Würde des Menschen ist unantastbar.',
                            'Sie zu achten und zu schützen ist Verpflichtung aller staatlichen Gewalt.',
                            'Alle Menschen sind vor dem Gesetz gleich.',
                            'Männer und Frauen sind gleichberechtigt.'
                        ];
                        for (let i = 0; i < searchTerms.length; i++) {
                            webSearcher.search(
                                searchTerms[i],
                                function (term, results) {
                                    assert.equal(results.length, 10, 'Not expected number of results');
                                    searchCompleted.push(term);
                                }
                            );
                        }

                        assert.equal(searchCompleted.length, 0, 'Results are available too early.');

                        setTimeout(
                            function () {
                                assert.equal(searchCompleted.length, 1, 'Results count did not match 1');
                            },
                            delay
                        );
                        setTimeout(
                            function () {
                                assert.equal(searchCompleted.length, 2, 'Results count did not match 2');
                            },
                            2 * delay
                        );
                        setTimeout(
                            function () {
                                assert.equal(searchCompleted.length, 3, 'Results count did not match 3' );
                            },
                            3 * delay
                        );
                        setTimeout(
                            function () {
                                assert.equal(searchCompleted.length, 4, 'Results count did not match 4');
                                done();
                            },
                            4 * delay
                        );
                    }
                );
            }
        );
    }
);
