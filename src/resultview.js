var resultview = (function () {

    var maxOpacity = 0.9;
    var resultView = null;
    // ---------------------------------------------
    function init() {
        // init opacity
        resultView = $('#resultview');
        resultView.fadeOut(0);

        // close link
        var closeFunction = function () {
            resultView.fadeOut();
        };
        $('#link_results_close').click(closeFunction);
    }

    // ---------------------------------------------
    function show() {
        resultView.fadeTo(200, maxOpacity);
    }

    // ---------------------------------------------
    return {
        init: init,
        show: show
    };
})();