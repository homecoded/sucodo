var textMarkup = (function () {

    var id;
    var phraseDict;
    var oldPhrases;

    function createPhraseMarkup (text, count) {
        id += 1;
        if (!phraseDict[text]) {
            phraseDict[text] = [];
        }
        phraseDict[text].push(id);

        return '<span id="phrase'+id
                +'" style="color:' + colorWarner.getColor(count) + '">'
                + text + '</span>';
    }

    function createMarkup(phrases, phraseCountMap) {
        var resultText = '';
        var entry;
        var numElements = phrases.length;
        var numPhrases;
        var searchCount;
        id = -1;
        phraseDict = {};

        for (var i = 0; i < numElements; i++) {
            entry = phrases[i];
            if (entry instanceof Array) {
                numPhrases = entry.length;
                for (var j = 0; j < numPhrases; j++) {
                    searchCount = (phraseCountMap) ? phraseCountMap[entry[j]] : 0;
                    resultText += createPhraseMarkup(entry[j], searchCount) + ' ';
                }
                resultText += '\n';
            } else {
                searchCount = (phraseCountMap) ? phraseCountMap[entry] : 0;
                resultText += createPhraseMarkup(entry, searchCount) + ' \n';
            }
        }
        resultText = resultText.replace( /\n/gi, '<br>\n');
        return resultText;
    }

    function markup (phrases, phraseCountMap) {
        var result;
        result = createMarkup(phrases, phraseCountMap);
        return result;
    }

    return {
        markup : markup
    }
}());