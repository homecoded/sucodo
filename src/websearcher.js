var webSearcher = (function () {

    function search(phrase, callback) {
        callback(phrase, 0);  
    }

    return {
        search : search
    }
}());