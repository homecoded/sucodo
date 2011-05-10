/********************************************************************************************
 * Navi
 */
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

                        } else {
                            $('#textview').css('background-color', '#FFFFFF');
                            $('#infobar_analyze_done').show();
                            $('#infobar_analyze_progress').hide();
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
        $('#btn_results').click(function () {
            resultview.show();
        });

        textAnalyzer.setWebSearcher(webSearcher);
    }
};

var colorWarner = {
    getColor: function (number) {
        if (number <= 0) {
            return '#000000';
        }
        if (number > 256) {
            return '#ff0000'; // a lot of results, total red!
        } else {
            var red, green, hexRed, hexGreen;
            red = Math.round(number/2);
            green = Math.round(64 - red/2);
            red += 127;
            hexRed = red.toString(16);
            hexGreen = green.toString(16);
            hexRed = (hexRed.length === 1) ? '0' + hexRed : hexRed;
            hexGreen = (hexGreen.length === 1) ? '0' + hexGreen : hexGreen;
            return ('#' + hexRed + hexGreen + '00').toLowerCase();
        }
    }
};

/********************************************************************************************
 * sucodo loca
 */
var sucodoLoca = {
    lang: LOCA_ENG,
    setLang: function (id) {
        sucodoLoca.lang = id;
        loca.applyLocalization(id);

        // update the options in the select boxes
        $.each($("#grouplen").children(), function () {
            $(this).text(loca.getLocaData(this.id, id));
        });

        sucodoLoca.createLinks();

        // update the current page in case there were
        // any language specific settings
        navi.init(navi.currentPageId);
    },
    createLinks: function () {
        var lang_select = $('#lang_select'),
                htmlCode = loca.getLocaData('txt_lang_select', sucodoLoca.lang) + "<br>",
                i;

        for (i = 0; i < NUM_LANGUAGES; i++)
        {
            htmlCode += '<a href="javascript:void(0)" onclick="sucodoLoca.setLang('+i+')" '
                    + 'class="lang_link">'
                    + loca.getLocaData('txt_lang_name', i)
                    + '</a>';
        }
        lang_select.html(htmlCode);
    },
    initialize: function () {
        sucodoLoca.createLinks();
        var lang = sucodoLoca.getParameterByName("lang");
        if (lang === "de") {
            sucodoLoca.lang = LOCA_GER;
        } else {
            sucodoLoca.lang = LOCA_ENG;
        }

    },
    getParameterByName: function (name)
    {
        name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
        var regexS = "[\\?&]"+name+"=([^&#]*)",
                regex = new RegExp( regexS ),
                results = regex.exec( window.location.href );
        if( results === null ) {
            return "";
        } else {
            return decodeURIComponent(results[1].replace(/\+/g, " "));
        }
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
    loca.dict = loca__dictionary;
    loca.buttonDict = null;
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