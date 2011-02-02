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
        navi.highlight(id);
        navi.showContent(id);
        navi.execute(id);
    },
    highlight: function (id) {
        var activeElementId = "#nav" + id;
        $("#navigation").children().each(
                function (_i, _element) {
                    if ($(this).is(activeElementId) && !$(this).hasClass('active')) {
                        $(this).addClass('active');
                    } else if ($(this).hasClass('active')) {
                        $(this).removeClass('active');
                    }
                }
                );
    },
    showContent: function (id)	{
        var activeElementId = "#content"+id;
        $("#content").children().each(
                function (_i, _element)	{
                    if ($(this).is(activeElementId)) {
                        $(this).css("display", "block");
                    } else {
                        $(this).css("display", "none");
                    }
                }
                );
    },
	execute: function (id) {
	     switch (id)
	     {
		 	case 2:
                var text = $('#plagtext').val();
		 		textanalyzer.go(text);
		 		break;
		 }
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