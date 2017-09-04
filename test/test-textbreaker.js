const textBreaker = require('../lib/textbreaker');
const assert = require('assert');

const text = 'word1 word2 word3 word4. word5 word6 word7 word8 word9. Word10!';
const text2 = 'Maecenas eros ex, dignissim dignissim arcu eu, pulvinar blandit mauris. ' +
    'nunc elementum scelerisque auctor. Sed aliquet lorem faucibus rutrum iaculis. Nunc ' +
    'nunc dui, egestas eget finibus at, tempor quis est.\n' +
    '\n' +
    'Nam at fringilla massa. Donec sed odio vitae metus vulputate accumsan et quis ante. ' +
    'Maecenas scelerisque neque sit amet massa egestas mattis. Praesent nec purus vel metus ' +
    'porttitor dignissim eget non erat. \n' +
    '\n' +
    'Integer volutpat erat eget lacus eleifend ultrices. Praesent id condimentum nulla. ' +
    'Curabitur mauris sapien, aliquam vitae arcu eget, porttitor pretium leo. Vestibulum ' +
    'pretium orci neque. Praesent semper risus ut ipsum accumsan, et vestibulum arcu eleifend. ' +
    'Vestibulum tincidunt lobortis mattis. Nunc congue congue sem at vehicula.';

//noinspection NodeModulesDependencies,ES6ModulesDependencies
describe('Textbreaker',
    function () {
        describe('#Textbreaker()',
            function () {
                //noinspection NodeModulesDependencies,ES6ModulesDependencies
                it(
                    'should break paragraph into word groups of length 2',
                    function () {
                        let splitText = textBreaker.breakText(text, 2);
                        let i = 0;
                        assert.equal(splitText[0][i++].text, 'word1 word2');
                        assert.equal(splitText[0][i++].text, 'word3 word4.');
                        assert.equal(splitText[0][i++].text, 'word5 word6');
                        assert.equal(splitText[0][i++].text, 'word7 word8');
                        assert.equal(splitText[0][i].text, 'word9. Word10!');
                    }
                );

                it(
                    'should break paragraph into word groups of length 3',
                    function () {
                        let splitText = textBreaker.breakText(text, 3);
                        let i = 0;
                        assert.equal(splitText[0][i++].text, 'word1 word2 word3');
                        assert.equal(splitText[0][i++].text, 'word4. word5 word6');
                        assert.equal(splitText[0][i++].text, 'word7 word8 word9.');
                        assert.equal(splitText[0][i].text, 'Word10!');
                    }
                );

                it(
                    'should break paragraph into word groups of length 4',
                    function () {
                        let splitText = textBreaker.breakText(text, 4);
                        let i = 0;
                        assert.equal(splitText[0][i++].text, 'word1 word2 word3 word4.');
                        assert.equal(splitText[0][i++].text, 'word5 word6 word7 word8');
                        assert.equal(splitText[0][i].text, 'word9. Word10!');
                    }
                );

                it(
                    'should break paragraph into word groups of length 9',
                    function () {
                        let splitText = textBreaker.breakText(text, 9);
                        let i = 0;
                        assert.equal(splitText[0][i++].text, 'word1 word2 word3 word4. word5 word6 word7 word8 word9.');
                        assert.equal(splitText[0][i].text, 'Word10!');
                    }
                );

                it(
                    'should break larget text into word groups',
                    function () {
                        let splitText = textBreaker.breakText(text2, 9);
                        let i = 0;
                        assert.equal(splitText[0][i++].text, 'Maecenas eros ex, dignissim dignissim arcu eu, pulvinar blandit');
                        assert.equal(splitText[0][i++].text, 'mauris. nunc elementum scelerisque auctor. Sed aliquet lorem faucibus');
                        assert.equal(splitText[0][i++].text, 'rutrum iaculis. Nunc nunc dui, egestas eget finibus at,');
                        assert.equal(splitText[0][i].text, 'tempor quis est.');
                        i = 0;
                        assert.equal(splitText[2][i++].text, 'Nam at fringilla massa. Donec sed odio vitae metus');
                        assert.equal(splitText[2][i++].text, 'vulputate accumsan et quis ante. Maecenas scelerisque neque sit');
                        assert.equal(splitText[2][i++].text, 'amet massa egestas mattis. Praesent nec purus vel metus');
                        assert.equal(splitText[2][i].text, 'porttitor dignissim eget non erat.');
                        i = 0;
                        assert.equal(splitText[4][i++].text, 'Integer volutpat erat eget lacus eleifend ultrices. Praesent id');
                        assert.equal(splitText[4][i++].text, 'condimentum nulla. Curabitur mauris sapien, aliquam vitae arcu eget,');
                        assert.equal(splitText[4][i++].text, 'porttitor pretium leo. Vestibulum pretium orci neque. Praesent semper');
                        assert.equal(splitText[4][i++].text, 'risus ut ipsum accumsan, et vestibulum arcu eleifend. Vestibulum');
                        assert.equal(splitText[4][i].text, 'tincidunt lobortis mattis. Nunc congue congue sem at vehicula.');
                    }
                );

            }
        );
    }
);