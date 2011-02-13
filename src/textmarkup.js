var textMarkup = (function () {

    var id;
    var phraseDict;
    var phraseMap;
    var allowMouseOverSelect = true;

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
        phraseMap = phraseCountMap;

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

    function updateMouseInteractivity() {
        var phrase;
        var phraseIds;
        var i;
        var resultCount;
        var span;

        for (phrase in phraseDict) {
            phraseIds = phraseDict[phrase];
            for (i = 0; i < phraseIds.length; i++) {
                span = $('#phrase' + phraseIds[i]);
                resultCount = phraseMap[phrase];
                if (resultCount > 0) {
                    span.mouseout(function () {
                        $(this).css('background-color', '');
                    });
                    span.mouseover(function () {
                        var currPhrase = phrase;
                        var currCount = resultCount;
                        return function () {
                            $(this).css('background-color', '#eee');

                            if (!allowMouseOverSelect) {
                                return;
                            }
                            $('#resultinfo_count').html(currCount);
                            $('#resultinfo_phrase').html(currPhrase);
                            $('#resultinfo').fadeIn();
                            $('#resultinfo_controls').hide();
                        }
                    }());
                    span.click(function () {
                        var currPhrase = phrase;
                        var currCount = resultCount;
                        return function () {
                            $('#resultinfo_count').html(currCount);
                            $('#resultinfo_phrase').html(currPhrase);
                            $('#resultinfo').fadeIn();
                            $('#resultinfo_controls').fadeIn();
                            allowMouseOverSelect = false;
                        }
                    }());
                    span.dblclick(function () {
                        showSearchResults();
                    });
                }
            }
        }
    }

    function closeDetails(closeInfoCompletely) {
        allowMouseOverSelect = true;
        $('#resultinfo_controls').fadeOut();
        if (closeInfoCompletely) {
            $('#resultinfo').fadeOut();
        }
    }

    function showSearchResults () {
        var query = '"' + $('#resultinfo_phrase').html() + '"';
        var wind = window.open('http://www.bing.com/search?q=' + query,'Results','');
    }

    return {
        markup : markup,
        updateMouseInteractivity: updateMouseInteractivity,
        closeDetails : closeDetails,
        showSearchResults : showSearchResults
    }
}());