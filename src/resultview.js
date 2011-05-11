var resultview = (function () {

    var resultView = null;
    var resultsPos = -1;

    // ---------------------------------------------
    function reset() {
        resultView.fadeOut(0);
    }

    // ---------------------------------------------
    function init() {
        // init opacity
        resultView = $('#resultview_container');
        reset();
    }

    // ---------------------------------------------
    function show() {
        resultView.fadeIn(1000);

        var numPhrases = 0,
                numSuspiciousPhrases = 0,
                resultMap = textAnalyzer.getResult(),
                resultPercent, i, phraseData, url, numSourcesToShow, sourcesView, sourceShort,
                sourceMap = {}, sourceArray = [];

        for(var phrase in resultMap) {
            if(resultMap.hasOwnProperty(phrase)) {
                numPhrases+=1;
                phraseData = resultMap[phrase];
                if (phraseData.count > 0) {
                    numSuspiciousPhrases+=1;
                    for (i = phraseData.sources.length - 1; i >= 0; i-=1 ) {
                        url = phraseData.sources[i].Url;
                        if (!sourceMap[url]) {
                            sourceMap[url] = 1;
                        } else {
                            sourceMap[url] += 1;
                        }
                    }
                }
            }
        }

        for(url in sourceMap) {
            if(sourceMap.hasOwnProperty(url)) {
                sourceArray.push( { url: url, count: sourceMap[url]} );
            }
        }

        sourceArray.sort(function (a,b) {
            return (b.count - a.count);
        });

        resultPercent = Math.round(numSuspiciousPhrases / numPhrases * 100);
        loca.setVariable('#percent_suspicious#', '<span class="resultPercent">'+resultPercent+'%</span>');
        loca.updateVariables('txt_percent_suspicious');

        numSourcesToShow = (sourceArray.length > 10) ? 10 : sourceArray.length;
        sourcesView = $('#most_used_sources');
        sourcesView.hide();
        sourcesView.html('');

        for (i = 0; i < numSourcesToShow; i++) {
            url = sourceArray[i].url;
            sourceShort = (url.length > 75) ? url.substring(0, 43) + '...' : url;
            sourcesView.append('<a href="'+url+'" class="resultSource">'+sourceShort+'</a><br>');
        }

        if (numSourcesToShow > 0) {
            sourcesView.show();
            $('#result_positive').show();
            $('#result_negative').hide();
            $('#most_used_sources_container').show();
        } else {
            $('#result_positive').hide();
            $('#result_negative').show();
            $('#most_used_sources_container').hide();
        }

        var viewPos = $("#resultview_container").offset().top;
        var containerPos = $("#scrollable_container").scrollTop();

        resultsPos = $('#scrollable_container').scrollTop() + $("#resultview_container").offset().top;
    }

    function scrollToResults() {
       $('#scrollable_container').animate({
            scrollTop: resultsPos + 'px'
        }, 1000);
    }

    // ---------------------------------------------
    return {
        init: init,
        show: show,
        reset: reset,
        scrollToResults: scrollToResults
    };
})();