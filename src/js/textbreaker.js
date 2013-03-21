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

Sucodo.TextBreaker = {
    /*
     Breaks up the string according to specified parameters
     */
    breakUp: function (text, wordGroupLen)
    {
        function sanitizeString(text)
        {
            if (typeof(text) !== 'string' ) {
                return null;
            }
            var newtext = text.replace(/</g, '&lt');
            newtext = newtext.replace(/>/g, '&gt');
            return newtext;
        }

        if (wordGroupLen <= 0 || typeof wordGroupLen !== 'number') {
            alert('textBreaker_break: _wordGroupLen must be > 0 and a number but was ' + wordGroupLen + '/' + typeof wordGroupLen);
        }

        text = sanitizeString(text);
        if (text === null) {
            return null;
        }
        
        var paragraphs = text.split('\n'),
            result = [],
            i, j,
            num_paragraphs = paragraphs.length,
            paragraph, parWords, numWords, group, parWrdGroupd;

        for (i = 0; i < num_paragraphs; i++) {
            paragraph = paragraphs[i];
            parWords = paragraph.split(' ');
            numWords = parWords.length;
            parWrdGroupd = [];

            for (j = 0; j < numWords; j+=wordGroupLen)
            {
                group = parWords.splice(0, wordGroupLen);
                parWrdGroupd.push(group.join(" "));
            }
            result.push(parWrdGroupd);
        }
        return result;
    }
};
