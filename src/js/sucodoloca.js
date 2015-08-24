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
* sucodo loca
*/
Sucodo.Loca = {
    lang: Sucodo.LOCA_ENG,
    setLang: function (id) {
        Sucodo.Loca.lang = id;
        loca.applyLocalization(id);

        // update the options in the select boxes
        $.each($("#grouplen").children(), function () {
            $(this).text(loca.getLocaData(this.getAttribute('data-loca-id'), id));
        });

        Sucodo.Loca.createLinks();

        // update the current page in case there were
        // any language specific settings
        Sucodo.Navi.init(Sucodo.Navi.currentPageId);

        // update the license
        $('.license').hide();
        $('.license-' + id).show();
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