/********************************************************************************************
* sucodo loca
*/
Sucodo.Loca = {
    lang: Sucodo.LOCA_ENG,
    setLang: function (id) {
        Sucodo.Loca.lang = id;
        loca.applyLocalization(id);

        // update the options in the select boxes
        $.each($("#grouplen").children(), function () {
            $(this).text(loca.getLocaData(this.id, id));
        });

        Sucodo.Loca.createLinks();

        // update the current page in case there were
        // any language specific settings
        Sucodo.Navi.init(Sucodo.Navi.currentPageId);
    },
    createLinks: function () {
        var lang_select = $('#lang_select'),
            htmlCode = loca.getLocaData('txt_lang_select', Sucodo.Loca.lang) + "<br>",
            i;

        for (i = 0; i < Sucodo.NUM_LANGUAGES; i++) {
            htmlCode += '<a href="javascript:void(0)" onclick="Sucodo.Loca.setLang('+i+');" '
                + 'class="lang_link">'
                + loca.getLocaData('txt_lang_name', i)
                + '</a>';
        }
        lang_select.html(htmlCode);
    },
    initialize: function () {
        Sucodo.Loca.createLinks();
        var lang = Sucodo.Loca.getParameterByName("lang");
        if (lang === "de") {
            Sucodo.Loca.lang = Sucodo.LOCA_GER;
        } else {
            Sucodo.Loca.lang = Sucodo.LOCA_ENG;
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