var loca = {
    dict: null,
    buttonDict: null,
    /*
     returns the loca data for a specific text id
     @id: text id
     @langId: language id
     */
    getLocaData: function (id, langId)
    {
        if (!langId) {
            langId = 0;
        }
        if (!loca.dict || !loca.dict[id]) {
            return null;
        }
        if (!loca.dict[id][langId]) {
            return loca.dict[id][0];
        }
        return loca.dict[id][langId];
    },
    /*
     Applies all loca keys to the texts
     */
    applyLocalization: function (langId)
    {
        var textSpans = document.getElementsByTagName("span"),
            buttons, button,
            locaValue, i, locaId;

        if (!textSpans) {
            return;
        }
        for (i = textSpans.length - 1; i >= 0; i--) {
            locaValue = loca.getLocaData(textSpans[i].id, langId);
            if (locaValue !== null) {
                textSpans[i].innerHTML = locaValue;
            }
        }

        // create a list of all button and their respective text-id
        buttons = document.getElementsByTagName("input");
        button;
        if (!loca.buttonDict && loca.dict) {
            loca.buttonDict = {};
            for (i = buttons.length - 1; i >= 0; i--) {
                button = buttons[i];
                locaValue = loca.getLocaData(button.value, langId);
                if (locaValue !== null) {
                    loca.buttonDict[button.id] = button.value;
                }
            }
        }

        // update all buttons
        for (i = buttons.length - 1; i >= 0; i--) {
            button = buttons[i];
            locaId = loca.buttonDict[button.id];
            if (locaId && button.value) {
                button.value = loca.getLocaData(locaId, langId);
            }
        }
    }
};