var loca = (function () {
    var dict, buttonDict,
        varMap = {};

    /*
        Sets the currect loca dictionary
     */
    function setDict(newDict) {
        dict = newDict;
    }

    function setButtonDict(newDict) {
        buttonDict = newDict;
    }

    /*
     returns the loca data for a specific text id
     @id: text id
     @langId: language id
     */
    function getLocaData(id, langId) {
        if (!langId) {
            langId = 0;
        }
        if (!dict || !dict[id]) {
            return null;
        }
        if (!dict[id][langId]) {
            return dict[id][0];
        }
        return dict[id][langId];
    }

    /*
     returns the loca date for a specific text id but processes (replacing contained variables)
     */

    function getProcessedLocaData(id, langId) {
        var locaData = getLocaData(id, langId),
                varKey, varData, regex;

        if (!locaData) {
            return null;
        }

        // does it contain variables?
        var entry = dict[id];
        var options = entry[entry.length - 1];
        if (!options.containsVariables) {
            return locaData;
        }

        // replace all the variables
        for(var prop in varMap) {
            if(varMap.hasOwnProperty(prop)) {
                varKey = prop;
                varData = varMap[varKey];
                regex = new RegExp(varKey, 'g');
                locaData = locaData.replace(regex, varData);
            }
        }
        return locaData;
    }

    /*
     Applies all loca keys to the texts
     */
    function applyLocalization(langId, variableUpdatesOnly)
    {
        var textSpans = document.getElementsByTagName("span"),
            buttons, button,
            locaValue, i, locaId;

        if (!textSpans) {
            return;
        }
        for (i = textSpans.length - 1; i >= 0; i--) {
            locaValue = loca.getProcessedLocaData(textSpans[i].id, langId);
            if (locaValue !== null) {
                textSpans[i].innerHTML = locaValue;
            }
        }

        // create a list of all button and their respective text-id
        buttons = document.getElementsByTagName("input");
        if (!buttonDict && dict) {
            buttonDict = {};
            for (i = buttons.length - 1; i >= 0; i--) {
                button = buttons[i];
                locaValue = getProcessedLocaData(button.value, langId);
                if (locaValue !== null) {
                    buttonDict[button.id] = button.value;
                }
            }
        }

        // update all buttons
        for (i = buttons.length - 1; i >= 0; i--) {
            button = buttons[i];
            locaId = buttonDict[button.id];
            if (locaId && button.value) {
                button.value = getProcessedLocaData(locaId, langId);
            }
        }
    }

    /*
        Updates the text in specified object with variables
     */
    function updateVariables(objid, langId) {
        var obj = document.getElementById(objid), locaId;
        if (!obj) {
            return;
        }
        if (obj.tagName === 'SPAN') {
            obj.innerHTML = getProcessedLocaData(objid, langId);
        } else if (obj.tagName === 'INPUT') {
           locaId = buttonDict[obj.id];
           obj.value = getProcessedLocaData(locaId, langId);;
        }
    }

    /*
        Sets a loca-variable, that can later be replaces in a loca-entry
    */
    function setVariable(key, value) {
        varMap[key] = value;
    }

    return {
        setDict: setDict,
        setButtonDict:setButtonDict,
        getLocaData: getLocaData,
        applyLocalization: applyLocalization,
        setVariable: setVariable,
        getProcessedLocaData: getProcessedLocaData,
        updateVariables: updateVariables
    };
})();
