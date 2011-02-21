var helpControl = (function () {

    var ID_HELP_PREFIX = "txt_help";

    function updateControls() {
        var spans = document.getElementsByTagName('span');
        if (!spans) {
            return;
        }

        for (i = spans.length - 1; i >= 0; i--) {
            if (spans[i].id.indexOf(ID_HELP_PREFIX) === 0) {
                spans[i].innerHTML = '[i]';
            }
        }

    }

    return {
        updateControls: updateControls
    }
}());
