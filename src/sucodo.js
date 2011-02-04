/********************************************************************************************
 * entry point of app
 */
$(document).ready(function () {
    // setup callbacks
    var numLinks = $('#navlinks').children().length;
    for (var i = 1; i <= numLinks; i++) {
        $('#nav' + i).click(function () {
            var id = i;
            return function () {
                navi.goto(id);
            };
        }());
    }
    $('#btn_analyze').click(function () {
        navi.goto(2);
    });
    // run tests
    tests.runTests();
    // init language
    loca.dict = loca__dictionary;
    sucodoLoca.createLinks();
    sucodoLoca.setLang(sucodoLoca.lang);
    // go to first site
    navi.goto(1);
});

/********************************************************************************************
 * Navi
 */
var navi = {
    goto: function (id) {
        var success = navi.execute(id);
        if (success) {
            navi.highlight(id);
            navi.showContent(id);
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
            case 2:
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
                    textAnalyzer.setWebSearcher(webSearcher);
                    textAnalyzer.go(text, wordGroupLen, function () {
                        var resultText = text;
                        var result = textAnalyzer.getResult();
                        for (var phrase in result) {
                            if (result.hasOwnProperty(phrase)) {
                                if (result[phrase] > 0 ) {
                                    resultText.replace(phrase, '<span style="color:#f00;">' + phrase + '</span>');
                                }
                            }
                        }
                        resultText = resultText.replace( /\n/gi, '<br>');
                        $('#textview').html(resultText);
                    });
                }

                break;
        }
        return true;
    }
};

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
    },
    createLinks: function () {
        var lang_select = $('#lang_select');
        var htmlCode = loca.getLocaData('txt_lang_select', sucodoLoca.lang) +  	" ";

        for (var i = 0; i < NUM_LANGUAGES; i++)
        {
            htmlCode += '<a href="#" onclick="sucodoLoca.setLang('+i+')" '
                    + 'class="lang_link">'
                    + loca.getLocaData('txt_lang_name', i)
                    + '</a>';
        }
        document.getElementById('lang_select').innerHTML = htmlCode;
    }
}