/* globals sucodoInterface, sucodoEmitter */

/**
 * Event observer of "sample text" event
 */

const fs = require('fs');

function run() {
    sucodoEmitter.on(
        'onclick_sample_text',
        () => {
            fs.readFile('assets/text/sample_short.txt', 'utf8', function (err, data) {
                if (err) throw err;
                sucodoInterface.updateElement('sucodo_textinput', data);
            });
        }
    );
}

module.exports = {
    inject: require('../../lib/dependencyInjection').getInjector(global),
    run: run
};