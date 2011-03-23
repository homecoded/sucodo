var textBreaker = {
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
        
        var paragraphs = text.split('\n');
        var result = [];
        var i, j;

        var num_paragraphs = paragraphs.length;

        for (i = 0; i < num_paragraphs; i++) {
            var paragraph = paragraphs[i];
            var parWords = paragraph.split(' ');
            var numWords = parWords.length;
            var group;
            var parWrdGroupd = [];

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
