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
        var s;
        if (loca.dict === null || loca.dict[id] === s) {
            return null;
        }
        if (loca.dict[id][langId] === null) {
            return loca.dict[id][0];
        }
        return loca.dict[id][langId];
    },
    /*
     Applies all loca keys to the texts
     */
    applyLocalization: function (langId)
    {
        var textSpans = document.getElementsByTagName("span");
        if (!textSpans) {
            return;
        }
        var locaValue, i;
        for (i = textSpans.length - 1; i >= 0; i--) {
            locaValue = loca.getLocaData(textSpans[i].id, langId);
            if (locaValue !== null) {
                textSpans[i].innerHTML = locaValue;
            }
        }

        // create a list of all button and their respective text-id
        var buttons = document.getElementsByTagName("input");
        var button;
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
        var locaId;
        for (i = buttons.length - 1; i >= 0; i--) {
            button = buttons[i];
            locaId = loca.buttonDict[button.id];
            if (locaId && button.value) {
                button.value = loca.getLocaData(locaId, langId);
            }
        }
    }
};