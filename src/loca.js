var loca = {
    dict: {},
    /*
     returns the loca data for a specific text id
     @id: text id
     @langId: language id
     */
    getLocaData: function (id, langId)
    {
        var s;
        if (loca.dict == null || loca.dict[id] == s)
            return null;
        if (loca.dict[id][langId] == null)
            return loca.dict[id][0];
        return loca.dict[id][langId];
    },
    /*
     Applies all loca keys to the texts
     */
    applyLocalization: function (langId)
    {
        var textSpans = document.getElementsByTagName("span");
        if (textSpans == null)
            return;
        var locaValue;
        for (var i = textSpans.length - 1; i >= 0; i--) {
            locaValue = loca.getLocaData(textSpans[i].id, langId);
            if (locaValue != null) {
                textSpans[i].innerHTML = locaValue;
            }
        }
    }
}