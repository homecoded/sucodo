var textMarkup = (function () {

    var id,
        phraseDict,
        phraseMap,
        allowMouseOverSelect = true,
        currentPhraseText,
        highlightedPhrase,
        isGlobalListenerInitialized;

    function unhighlightPhrase() {
        if (highlightedPhrase) {
            highlightedPhrase.css('background-color', '');
            highlightedPhrase = null;
        }
    }

    function createPhraseMarkup (text, count) {
        id += 1;
        if (!phraseDict[text]) {
            phraseDict[text] = [];
        }
        phraseDict[text].push(id);

        return '<span id="phrase'+id
                +'" style="color:' + sucodo.colorWarner.getColor(count) + '">'
                + text + '</span>';
    }

    function createMarkup(phrases, phraseInfoMap) {
        var resultText = '',
            entry,
            numElements = phrases.length,
            numPhrases,
            phraseData,
            searchCount,
            phrase,
            i, j;
        
        id = -1;
        phraseDict = {};
        phraseMap = phraseInfoMap;

        for (i = 0; i < numElements; i++) {
            entry = phrases[i];
            if (entry instanceof Array) {
                numPhrases = entry.length;
                for (j = 0; j < numPhrases; j++) {
                    if (phraseInfoMap) {
                        phrase = entry[j];
                        phraseData = phraseInfoMap[phrase];
                        if (phraseData) {
                            searchCount = phraseData.count;
                        } else {
                            searchCount = 0;
                        }
                    } else {
                        searchCount = 0;
                    }
                    resultText += createPhraseMarkup(entry[j], searchCount) + ' ';
                }
                resultText += '\n';
            } else {
                searchCount = (phraseInfoMap) ? phraseInfoMap[entry].count : 0;
                resultText += createPhraseMarkup(entry, searchCount) + ' \n';
            }
        }
        resultText = resultText.replace( /\n/gi, '<br>\n');
        return resultText;
    }

    function markup (phrases, phraseCountMap) {
        return createMarkup(phrases, phraseCountMap);
    }

    function createLink(url) {
        if (!url) {
            return "";
        }
        var urlName = url.replace("http://", "");
        if (urlName.length > 35) {
            urlName = urlName.substring(0, 35) + '...';
        }
        return '<a href="' + url + '" target="_blank">' + urlName + "</a>";
    }
    
    function getMostLikelySourceUrl(sources) {
        var i, url, firstValidSource;

        for (i = 0; i < sources.length; i++) {
            if (sources[i].ignored) {
                continue;
            }
            url = sources[i].Url;
            if (!firstValidSource) {
                firstValidSource = url;
            }
            if (url.indexOf('wikipedia') >= 0) {
                return createLink(url);
            }
        }

        return createLink(firstValidSource);
    }

    function updateMouseInteractivity() {
        var phrase,
            phraseIds,
            i,
            resultCount,
            sources,
            span;

        if (!isGlobalListenerInitialized) {
            isGlobalListenerInitialized = true;
            $('body').click( function () {
                if (allowMouseOverSelect) {
                    return;
                }
                closeDetails(false);
            });
        }

        // standard: hint and button is shown
        $('#infobar_analyze_hint').show();
        $('#btn_results').fadeIn(2000);

        for (phrase in phraseDict) {
            if (phraseDict.hasOwnProperty(phrase) || true) {
                phraseIds = phraseDict[phrase];
                for (i = 0; i < phraseIds.length; i++) {
                    span = $('#phrase' + phraseIds[i]);
                    resultCount = phraseMap[phrase].count;
                    sources = phraseMap[phrase].sources;
                    if (resultCount > 0) {
                        span.mouseout(function () {
                            if (!highlightedPhrase
                                    || (highlightedPhrase.attr('id') !== $(this).attr('id'))) {
                                $(this).css('background-color', '');
                            }
                            if (!allowMouseOverSelect) {
                                return;
                            }
                            unhighlightPhrase();
                            $('#infobar_analyze_hint').show();
                            $('#resultinfo_data').hide();
                        });
                        span.mouseover(function () {
                            var currCount = resultCount,
                                mostLikelySource = getMostLikelySourceUrl(sources);
                            return function () {
                                if (!highlightedPhrase
                                        || (highlightedPhrase.attr('id') !== $(this).attr('id'))) {
                                    $(this).css('background-color', '#ffda8b');
                                }
                                if (!allowMouseOverSelect) {
                                    return;
                                }
                                $('#resultinfo_count').html(currCount);
                                $('#link_most_likely_source').html(mostLikelySource);
                                $('#resultinfo_controls').hide();
                                $('#infobar_analyze_hint').hide();
                                $('#resultinfo_data').show();
                            };
                        }());
                        span.click(function () {
                            var currPhrase = phrase,
                                currCount = resultCount,
                                mostLikelySource = getMostLikelySourceUrl(sources);
                            return function (event) {

                                if (highlightedPhrase && highlightedPhrase.attr('id') === $(this).attr('id')) {
                                    closeDetails(false);
                                } else {
                                    $('#resultinfo').fadeIn();
                                    $('#resultinfo_controls').fadeIn();
                                    $(this).css('background-color', '#FFF');
                                    $('#textview').css('background-color', '#ddd');
                                    $('#resultinfo_count').html(currCount);
                                    $('#link_most_likely_source').html(mostLikelySource);
                                    allowMouseOverSelect = false;
                                    unhighlightPhrase($(this));
                                    highlightedPhrase = $(this);
                                    currentPhraseText = currPhrase;
                                }
                                event.stopPropagation();
                            };
                        }());
                        span.dblclick(function () {
                            showSearchResults();
                        });
                    }
                }
            }
        }
    }

    function closeDetails(closeInfoCompletely) {
        allowMouseOverSelect = true;
        $('#resultinfo_controls').hide();
        if (closeInfoCompletely) {
            $('#resultinfo').fadeOut();
        }
        unhighlightPhrase();
        $('#textview').css('background-color', '#FFFFFF');
    }

    function showSearchResults () {
        var query = '"' + currentPhraseText + '"';
        window.open('http://blekko.com/ws/' + query);
    }

    return {
        markup : markup,
        updateMouseInteractivity: updateMouseInteractivity,
        closeDetails : closeDetails,
        showSearchResults : showSearchResults
    };
}());