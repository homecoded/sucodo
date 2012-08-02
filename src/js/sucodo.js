/********************************************************************************************
 * Navi
 */
var sucodo_isOfflineMode = false;

var navi = {
    PAGE_ENTER_TEXT: 1,
    PAGE_ANALYZE: 2,
    PAGE_HELP: 3,

    currentPageId : -1,
    openPage: function (id) {
        var success = navi.execute(id);
        if (success) {
            navi.highlight(id);
            navi.showContent(id);
        } else {
            if (id === navi.PAGE_ANALYZE) {
                // attempt to go to analyze screen but no text was entered
                // then go to enter text screen
                navi.openPage(navi.PAGE_ENTER_TEXT);
            }
        }
    },
    /*
     Highlights the active link
     */
    "highlight": function (id) {
        var activeElementId = "#nav" + id;
        $("#navlinks_inner").children().each(
                function () {
                    if ($(this).is(activeElementId)) {
                        if (!$(this).hasClass('active')) {
                            $(this).addClass('active');
                        }
                    } else if ($(this).hasClass('active')) {
                        $(this).removeClass('active');
                    }
                }
                );
    },
    /*
     Shows the correct main screen
     */
    "showContent": function (id)	{
        var activeElementId = "#content"+id;
        $("#content").children().each(
                function ()	{
                    if ($(this).is(activeElementId)) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                }
                );
    },
    /*
        Initialize a screen
     */
    "init": function (id) {

        function showInfobarContents(id) {
            $.each($("#infobar").children(), function () {
                $(this).hide();
            });
            $(id).show();
        }

        switch (id)
        {
            case navi.PAGE_ENTER_TEXT:
                showInfobarContents("#infobar_edit");

                // update the add sample text link
                $('#link_sample_text').click(function () {
                    var value = $('#plagtext').val(),
                            sampletext = loca.getLocaData('txt_sample_text', sucodoLoca.lang);
                    if (value.indexOf(sampletext) < 0) {
                        $('#plagtext').val( value + sampletext);
                    }
                });
                break;
            case navi.PAGE_ANALYZE:
                showInfobarContents("#infobar_analyze");
                var plagtext = $('#plagtext'),
                        text = plagtext.val(),
                        wordGroupLen, phrases, timeLeft, resultText;
                $('#resultinfo').hide();
                resultview.reset();
                if (text.length === 0) {
                    plagtext.css('border', '5px solid #f00');
                    plagtext.css('background-color', '#fcc');
                    setTimeout(function () {
                        plagtext.css('border', '');
                        plagtext.css('background-color', '');
                    }, 1500);
                    return false;
                } else {
                    wordGroupLen = parseInt($('#grouplen').val(), 10);
                    textAnalyzer.stop();
                    phrases = textAnalyzer.go(text, wordGroupLen, function () {
                        resultText = textMarkup.markup(phrases, textAnalyzer.getResult());
                        $('#textview').html(resultText);
                        timeLeft = Math.round(textAnalyzer.timeLeft() / 1000);
                        if (timeLeft > 0) {
                            $('#analyze_time').html(timeLeft);
                            $('#textview').css('background-color', '#AAAAAA');
                            $('#infobar_analyze_done').hide();
                            $('#infobar_analyze_progress').fadeIn();
                            resultview.reset();
                        } else {
                            $('#textview').css('background-color', '#FFFFFF');
                            $('#infobar_analyze_done').show();
                            $('#infobar_analyze_progress').hide();
                            resultview.show();
                            textMarkup.updateMouseInteractivity();
                        }
                    });
                }
                textMarkup.closeDetails(true);
                break;
        }
        return true;
    },
    /*
     Runs the code necessary for a state
     */
    "execute": function (id) {

        if (!navi.init(id)) {
            return false;
        }
        navi.currentPageId = id;
        return true;
    },
    /*
     Setup callbacks
     */
    setup: function () {
        // global navi
        var numLinks = $('#navlinks_inner').children().length,
                i;
        for (i = 1; i <= numLinks; i++) {
            $('#nav' + i).click((function () {
                var id = i;
                return function () {
                    navi.openPage(id);
                };
            })());
        }

        // settings
        $('#settings_background').fadeTo(0, 0.5);

        var oldTestGroupLength = -1;
        function closeSettings() {
            $('#settings').fadeOut(100);
            if (navi.currentPageId === navi.PAGE_ANALYZE
                    && oldTestGroupLength !== $('#grouplen').val()) {
                navi.openPage(navi.PAGE_ANALYZE);
            }
        }

        $('#link_settings_close').click(closeSettings);
        $('#link_settings_text_close').click(closeSettings);

        $('#link_settings').click(function () {
            $('#settings').fadeIn(100);
            oldTestGroupLength = $('#grouplen').val();
        });

        // Enter Text Screen
        $('#btn_analyze').click(function () {
            navi.openPage(navi.PAGE_ANALYZE);
        });

        // Analyze Screen
        $('#resultinfo_inspect').click(textMarkup.showSearchResults);
        $('#btn_edit').click(function () {
            navi.openPage(navi.PAGE_ENTER_TEXT);
        });

        resultview.init();
        $('#btn_results').click((function () {
           resultview.scrollToResults();
        }));

        if (sucodo_isOfflineMode == true) {
            textAnalyzer.setWebSearcher(webSearcherOffline);
        } else {
            textAnalyzer.setWebSearcher(webSearcher);
        }

    },

    toggleIgnoreUrl: function (url) {
            var isIgnored = textAnalyzer.toggleIgnoreUrl(url);
            var resultText = textMarkup.markup(textAnalyzer.getPhrases(), textAnalyzer.getResult());
            $('#textview').html(resultText);
            textMarkup.updateMouseInteractivity();
            resultview.show(resultview.areAllSourcesShown());
            return isIgnored;
        }
};



/********************************************************************************************
 * entry point of app
 */
$(document).ready(function () {
    // run tests
    if (typeof tests !== 'undefined') {
        tests.runTests();
    }
    // init language
    loca.setDict(sucodo.loca_dictionary);
    loca.setButtonDict(null);
    sucodoLoca.initialize();
    sucodoLoca.setLang(sucodoLoca.lang);
    // setup callbacks
    navi.setup();

    // go to first site
    navi.openPage(navi.PAGE_ENTER_TEXT);

    // fade in infobar
    $('#infobar').fadeTo(2000, 0.9);
    $('#infobar').mouseenter(function () {
        $('#infobar').fadeTo(200, 1);
    });
    $('#infobar').mouseleave(function () {
        $('#infobar').fadeTo(200, 0.9);
    });
});

/********************************************************************************************
 * IE fix
 */
if (!Array.indexOf) {
    Array.prototype.indexOf = function (obj, start) {
        var i;
        for (i = (start || 0); i < this.length; i++) {
            if (this[i] === obj) {
                return i;
            }
        }
        return -1;
    };
}