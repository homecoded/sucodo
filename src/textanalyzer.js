var textAnalyzer = (function () {

    var phrases;
    var text;

    function go (newtext, wordgrouplen) {
        text = newtext;
        phrases = textBreaker.breakUp(text, wordgrouplen);
    }

    function getResult() {
        var resulttext = text;
        resulttext = text.replace( /\n/g, '<br>' );
        var color = '#800';
        for (var i = 0; i < phrases.length; i++ ) {
            //resulttext += '<span ="phrase'+i+'" style="color:'+color+'">' + phrases[i] + '</a>';
        }
        return resulttext;
    }


    return {
        go: go,
        getResult: getResult        
    }
}());