/*
 The MIT License (MIT)

 Copyright (c) 2014 Manuel Ruelke, homecoded

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */
/* global console */
var loca = (function () {
    var dict, currentLng = -1,
        varMap = {};

    /*
     Sets the current loca dictionary
     */
    function setDict(newDict) {
        dict = newDict;
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
            if (loca.debug) {
                console.log('Warning! Could not find index in translation' + id);
            }
            return null;
        }
        if (!dict[id][langId]) {
            if (loca.debug) {
                console.log('Warning! Could not find translation for ' + id + '. Using standard language.');
            }
            return dict[id][0];
        }
        if (loca.debug) {
            console.log(id,  dict[id][langId]);
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
        for (var prop in varMap) {
            if (varMap.hasOwnProperty(prop)) {
                varKey = prop;
                varData = varMap[varKey];
                regex = new RegExp(varKey, 'g');
                locaData = locaData.replace(regex, varData);
            }
        }
        return locaData;
    }

    /**
     * Get a list of html elements by list of tag names
     *
     * @param {Array<string>} tagNames
     * @returns {Array<HTMLElement>}
     */
    function getElementsByTagNames(tagNames) {
        var htmlElements = [],
            collection
            ;

        for (var i = 0; i < tagNames.length; i++) {
            collection = document.getElementsByTagName(tagNames[i]);
            htmlElements = htmlElements.concat([].slice.call(collection));
        }
        return htmlElements;
    }

    /**
     * Filter: Only items that have a translations data-attribute
     *
     * @param {Array<HTMLElement>} htmlElements
     * @returns {Array<HTMLElement>}
     */
    function filterTranslatableElements(htmlElements) {
        var translationId,
            translatableHtmlElements = []
            ;
        for (var i = 0; i < htmlElements.length; i++) {
            translationId = htmlElements[i].getAttribute('data-loca-id');
            if (translationId) {
                translatableHtmlElements.push(htmlElements[i]);
            }
        }
        return translatableHtmlElements;
    }

    /*
     Applies all loca keys to the texts
     */
    function applyLocalization(langId) {
        currentLng = langId;

        var htmlElements = getElementsByTagNames(['span', 'button', 'div']),
            htmlElement,
            inputs, input,
            locaId,
            locaValue, i
            ;

        htmlElements = filterTranslatableElements(htmlElements);


        for (i = htmlElements.length - 1; i >= 0; i--) {
            htmlElement = htmlElements[i];
            locaId = htmlElement.getAttribute('data-loca-id');
            locaValue = loca.getProcessedLocaData(locaId, langId);
            if (locaValue !== null) {
                htmlElements[i].innerHTML = locaValue;
            }
        }

        // create a list of all inputs and their respective text-id
        inputs = getElementsByTagNames(['input']);
        inputs = filterTranslatableElements(inputs);

        // update all inputs
        for (i = inputs.length - 1; i >= 0; i--) {
            input = inputs[i];
            locaId = input.getAttribute('data-loca-id');
            input.value = getProcessedLocaData(locaId, langId);
        }
    }

    /*
     Updates the text in specified object with variables
     */
    function updateVariables() {
        applyLocalization(currentLng);
    }

    /*
     Sets a loca-variable, that can later be replaces in a loca-entry
     */
    function setVariable(key, value) {
        varMap[key] = value;
    }

    return {
        setDict: setDict,
        applyLocalization: applyLocalization,
        setVariable: setVariable,
        getLocaData: getLocaData,
        getProcessedLocaData: getProcessedLocaData,
        updateVariables: updateVariables,
        getLanguage: function () {
            return currentLng;
        },
        getVariable: function (key) {
            return varMap[key];
        }
    };
})();