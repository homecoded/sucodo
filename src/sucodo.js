/********************************************************************************************
 * Navi
 */
var navi = {
    PAGE_ENTER_TEXT: 1,
    PAGE_ANALYZE: 2,
    PAGE_HELP: 3,

    goto: function (id) {
        var success = navi.execute(id);
        if (success) {
            navi.highlight(id);
            navi.showContent(id);
        } else {
            if (id === navi.PAGE_ANALYZE) {
                // attempt to go to analyze screen but no text was entered
                // then go to enter text screen
                navi.goto(navi.PAGE_ENTER_TEXT);
            }
        }
    },
    /*
     Highlights the active link
     */
    highlight: function (id) {
        var activeElementId = "#nav" + id;
        $("#navlinks").children().each(
                function (_i, _element) {
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
    showContent: function (id)	{
        var activeElementId = "#content"+id;
        $("#content").children().each(
                function (_i, _element)	{
                    if ($(this).is(activeElementId)) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                }
                );
    },
    /*
     Runs the code necessary for a state
     */
    execute: function (id) {
        switch (id)
        {
            case navi.PAGE_ENTER_TEXT:
                    textAnalyzer.stop();
                    break;
            case navi.PAGE_ANALYZE:
                var plagtext = $('#plagtext');
                var text = plagtext.val();
                if (text.length === 0) {
                    plagtext.css('border', '5px solid #f00');
                    plagtext.css('background-color', '#fcc');
                    setTimeout(function () {
                        plagtext.css('border', '');
                        plagtext.css('background-color', '');
                    }, 1500);
                    return false;
                } else {
                    var wordGroupLen = parseInt($('#grouplen').val());
                    textAnalyzer.stop();
                    var phrases = textAnalyzer.go(text, wordGroupLen, function () {
                        var timeLeft = Math.round(textAnalyzer.timeLeft() / 1000);
                        if (timeLeft > 0) {
                            $('#analyze_time_left').fadeIn();
                            $('#analyze_progress').fadeIn();
                            $('#analyze_time').html(timeLeft);
                        } else {
                            $('#analyze_time_left').fadeOut();
                            $('#analyze_progress').fadeOut();
                        }

                        var resultText = textMarkup.markup(phrases, textAnalyzer.getResult());
                        $('#textview').html(resultText);
                        textMarkup.updateMouseInteractivity();
                    });
                }
                textMarkup.closeDetails(true);
                break;
        }
        return true;
    },
    /*
        Setup callbacks
     */
    setup: function (id) {
        // global navi
        var numLinks = $('#navlinks').children().length;
        for (var i = 1; i <= numLinks; i++) {
            $('#nav' + i).click(function () {
                var id = i;
                return function () {
                    navi.goto(id);
                };
            }());
        }

        // Enter Text Screen
        $('#btn_analyze').click(function () {
            navi.goto(navi.PAGE_ANALYZE);
        });

        // Analyze Screen
        $('#grouplen').change(function () {
            navi.goto(navi.PAGE_ANALYZE);
        });
        $('#resultinfo_close').click(textMarkup.closeDetails);
        $('#resultinfo_inspect').click(textMarkup.showSearchResults);
        $('#btn_edit').click(function () {
            navi.goto(navi.PAGE_ENTER_TEXT);
        });

        textAnalyzer.setWebSearcher(webSearcher);
    }
};

var colorWarner = {
    getColor: function (number) {
        if (number <= 0)
            return '#000000';
        if (number > 256) {
            return '#ff0000'; // a lot of results, total red!
        } else {
            var green = Math.round((256 - number) / 2); // the less results the more yellow it gets
            var hex = green.toString(16);
            hex = (hex.length === 1) ? '0' + hex : hex;
            return ('#80' + hex + '00').toLowerCase();
        }
    }
}

/********************************************************************************************
 * sucodo loca
 */
var sucodoLoca = {
    lang: LOCA_ENG,
    setLang: function (id) {
        var oldLoca = sucodoLoca.lang;
        sucodoLoca.lang = id;
        loca.applyLocalization(id);

        // update the options in the select boxes
        $.each($("#grouplen").children(), function () {
            $(this).text(loca.getLocaData(this.id, id));
        });

        sucodoLoca.createLinks();
    },
    createLinks: function () {
        var lang_select = $('#lang_select');
        var htmlCode = loca.getLocaData('txt_lang_select', sucodoLoca.lang) +  	" ";

        for (var i = 0; i < NUM_LANGUAGES; i++)
        {
            htmlCode += '<a href="javascript:void(0)" onclick="sucodoLoca.setLang('+i+')" '
                    + 'class="lang_link">'
                    + loca.getLocaData('txt_lang_name', i)
                    + '</a>';
        }
        document.getElementById('lang_select').innerHTML = htmlCode;
    }
}

/********************************************************************************************
 * entry point of app
 */
$(document).ready(function () {
    // setup callbacks
    navi.setup();
    // run tests
    tests.runTests();
    // init language
    loca.dict = loca__dictionary;
    loca.buttonDict = null;
    sucodoLoca.createLinks();
    sucodoLoca.setLang(sucodoLoca.lang);
    // go to first site
    navi.goto(navi.PAGE_ENTER_TEXT);
});

/********************************************************************************************
 * IE fix
 */
if (!Array.indexOf) {
  Array.prototype.indexOf = function (obj, start) {
    for (var i = (start || 0); i < this.length; i++) {
      if (this[i] === obj) {
        return i;
      }
    }
    return -1;
  }
}