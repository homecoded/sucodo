/********************************************************************************************
* sucodo loca
*/
var sucodoLoca = {
    lang: Sucodo.LOCA_ENG,
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

        for (i = 0; i < Sucodo.NUM_LANGUAGES; i++)
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
            sucodoLoca.lang = Sucodo.LOCA_GER;
        } else {
            sucodoLoca.lang = Sucodo.LOCA_ENG;
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