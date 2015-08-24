/*
 Copyright 2012 Manuel Rülke, homecoded.com

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/********************************************************************************************
 * Navi
 */
Sucodo.sucodo_isOfflineMode = false;

Sucodo.Navi = {
    PAGE_ENTER_TEXT: 1,
    PAGE_ANALYZE: 2,
    PAGE_HELP: 3,

    currentPageId : -1,
    "openPage": function (id) {
        var success = Sucodo.Navi.execute(id);
        if (success) {
            Sucodo.Navi.highlight(id);
            Sucodo.Navi.showContent(id);
        } else {
            if (id === Sucodo.Navi.PAGE_ANALYZE) {
                // attempt to go to analyze screen but no text was entered
                // then go to enter text screen
                Sucodo.Navi.openPage(Sucodo.Navi.PAGE_ENTER_TEXT);
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
            case Sucodo.Navi.PAGE_ENTER_TEXT:
                showInfobarContents("#infobar_edit");

                // update the add sample text link
                $('#link_sample_text').click(function () {
                    var value = $('#plagtext').val(),
                            sampletext = loca.getLocaData('txt_sample_text', Sucodo.Loca.lang);
                    if (value.indexOf(sampletext) < 0) {
                        $('#plagtext').val( value + sampletext);
                    }
                });
                break;
            case Sucodo.Navi.PAGE_ANALYZE:
                showInfobarContents("#infobar_analyze");
                var plagtext = $('#plagtext'),
                        text = plagtext.val(),
                        wordGroupLen, phrases, timeLeft, resultText;
                $('#resultinfo').hide();
                Sucodo.ResultView.reset();
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
                    Sucodo.TextAnalyzer.stop();
                    phrases = Sucodo.TextAnalyzer.go(text, wordGroupLen, function () {
                        resultText = Sucodo.TextMarkup.markup(phrases, Sucodo.TextAnalyzer.getResult());
                        $('#textview').html(resultText);
                        timeLeft = Math.round(Sucodo.TextAnalyzer.timeLeft() / 1000);
                        if (timeLeft > 0) {
                            $('#analyze_time').html(timeLeft);
                            $('#textview').css('background-color', '#AAAAAA');
                            $('#infobar_analyze_done').hide();
                            $('#infobar_analyze_progress').fadeIn();
                            Sucodo.ResultView.reset();
                        } else {
                            $('#textview').css('background-color', '#FFFFFF');
                            $('#infobar_analyze_done').show();
                            $('#infobar_analyze_progress').hide();
                            Sucodo.ResultView.show();
                            Sucodo.TextMarkup.updateMouseInteractivity();
                        }
                    });
                }
                Sucodo.TextMarkup.closeDetails(true);
                break;
        }
        return true;
    },
    /*
     Runs the code necessary for a state
     */
    "execute": function (id) {

        if (!Sucodo.Navi.init(id)) {
            return false;
        }
        Sucodo.Navi.currentPageId = id;
        return true;
    },
    /*
     Setup callbacks
     */
    setup: function () {
        // global navi
        var numLinks = $('#navlinks_inner').children().length,
            i, oldTestGroupLength;
        for (i = 1; i <= numLinks; i++) {
            $('#nav' + i).click((function () {
                var id = i;
                return function () {
                    Sucodo.Navi.openPage(id);
                };
            })());
        }

        // settings
        $('#settings_background').fadeTo(0, 0.5);

        oldTestGroupLength = -1;
        function closeSettings() {
            $('#settings').fadeOut(100);
            if (Sucodo.Navi.currentPageId === Sucodo.Navi.PAGE_ANALYZE
                    && oldTestGroupLength !== $('#grouplen').val()) {
                Sucodo.Navi.openPage(Sucodo.Navi.PAGE_ANALYZE);
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
            Sucodo.Navi.openPage(Sucodo.Navi.PAGE_ANALYZE);
        });

        // Analyze Screen
        $('#resultinfo_inspect').click(Sucodo.TextMarkup.showSearchResults);
        $('#btn_edit').click(function () {
            Sucodo.Navi.openPage(Sucodo.Navi.PAGE_ENTER_TEXT);
        });

        Sucodo.ResultView.init();
        $('#btn_results').click((function () {
            Sucodo.ResultView.scrollToResults();
        }));

        if (Sucodo.sucodo_isOfflineMode == true) {
            Sucodo.TextAnalyzer.setWebSearcher(Sucodo.WebSearcherOffline);
        } else {
            Sucodo.TextAnalyzer.setWebSearcher(Sucodo.WebSearcherGoogle);
        }

    },

    toggleIgnoreUrl: function (url) {
            var isIgnored = Sucodo.TextAnalyzer.toggleIgnoreUrl(url),
                resultText = Sucodo.TextMarkup.markup(Sucodo.TextAnalyzer.getPhrases(), Sucodo.TextAnalyzer.getResult());
            $('#textview').html(resultText);
            Sucodo.TextMarkup.updateMouseInteractivity();
            Sucodo.ResultView.show(Sucodo.ResultView.areAllSourcesShown());
            return isIgnored;
        }
};



/********************************************************************************************
 * entry point of app
 */
$(document).ready(function () {

    $body = $('body');

    $body.load('html/sucodo.html', function onHTMLReady() {

        $body.addClass('bglight textFont darkText');
        // run tests
        if (typeof tests !== 'undefined') {
            tests.runTests();
        }
        // init language
        loca.setDict(Sucodo.loca_dictionary);
        loca.setButtonDict(null);
        Sucodo.Loca.initialize();
        Sucodo.Loca.setLang(Sucodo.Loca.lang);
        // setup callbacks
        Sucodo.Navi.setup();

        // go to first site
        Sucodo.Navi.openPage(Sucodo.Navi.PAGE_ENTER_TEXT);

        // fade in infobar
        $('#infobar').fadeTo(2000, 0.9);
        $('#infobar').mouseenter(function () {
            $('#infobar').fadeTo(200, 1);
        });
        $('#infobar').mouseleave(function () {
            $('#infobar').fadeTo(200, 0.9);
        });
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