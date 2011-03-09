var helpControl = (function () {

    var ID_HELP_PREFIX = 'tooltip_help';
    var INFO_HTML = '<span class="info_link"><a href="javascript:void(0)">i</a></span>';
    var TOOLTIP_OFFSET = 5;

    function updateControls() {
        var spans = document.getElementsByTagName('span');
        if (!spans) {
            return;
        }

        for (i = spans.length - 1; i >= 0; i--) {
            if (spans[i].id.indexOf(ID_HELP_PREFIX) === 0) {
                spans[i].innerHTML = INFO_HTML;
                $('#' + spans[i].id).mouseover(function (e) {
                    var span = spans[i];
                    return function (e) {

                        $('#help_tooltip').html('<div id="help_tooltip_content">' + loca.getLocaData('txt_' + span.id, sucodoLoca.lang) + '</div>');
                        $('#help_tooltip').fadeIn();

                        // calc offsets
                        var offsetX = 0;
                        var offsetY = 0;

                        if (($(document).width() / 2) < e.pageX) {
                            // move tooltip left of cursor
                            offsetX = - $('#help_tooltip').width() - TOOLTIP_OFFSET;
                        } else {
                            offsetX = TOOLTIP_OFFSET;
                        }
                        if (($(document).height() / 2) < e.pageY) {
                            // move tooltip left of cursor
                            offsetY = - $('#help_tooltip').height() - TOOLTIP_OFFSET;
                        } else {
                            offsetY = TOOLTIP_OFFSET;
                        }
                        $('#help_tooltip').offset( { left:e.pageX + offsetX, top: e.pageY + offsetY});

                    };
                }());
                $('#' + spans[i].id).mouseleave(function () {
                    $('#help_tooltip').fadeOut();
                });
            }
        }

    }

    return {
        infoHtml: function () { return INFO_HTML; },
        updateControls: updateControls
    }
}());
