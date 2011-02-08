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
            var text = text.replace(/</g, '&lt');
            text = text.replace(/>/g, '&gt');
            return text;
        }

        if (wordGroupLen <= 0 || typeof wordGroupLen != 'number') {
            alert('textBreaker_break: _wordGroupLen must be > 0 and a number but was ' + wordGroupLen + '/' + typeof wordGroupLen);
        }

        var text = sanitizeString(text);
        if (text === null) {
            return null;
        }
        
        var paragraphs = text.split('\n');
        var wordGroups = [];
        var result = [];

        var num_paragraphs = paragraphs.length;

        for (var i = 0; i < num_paragraphs; i++) {
            var paragraph = paragraphs[i];
            var parWords = paragraph.split(' ');
            var numWords = parWords.length;
            var group;
            var parWrdGroupd = [];

            for (var j = 0; j < numWords; j+=wordGroupLen)
            {
                group = parWords.splice(0, wordGroupLen);
                parWrdGroupd.push(group.join(" "));
            }
            result.push(parWrdGroupd);
        }
        return result;
    }
};
