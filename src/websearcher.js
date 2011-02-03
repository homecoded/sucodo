var webSearcher = (function () {

    function search(phrase, callback) {
        setTimeout(function () {
            callback(phrase, 0);
        }, 200);
    }

    return {
        search : search
    }
}());