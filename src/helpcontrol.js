var helpControl = (function () {

    var ID_HELP_PREFIX = 'tooltip_help',
        INFO_HTML = '<img src="data:image/gif;base64,R0lGODlhDwAPALMAAAAAACEtNTVKWUpoflJrhFJ3jFJ7lFp7lFp7nFqEnGiMoqCxvd7n597n7////////yH5BAEAAA8ALAAAAAAPAA8AAARM8MmXjrVp6ssYudpzHZ3wWdN4EII5UqMjD8WoqIrsqmMhBwOe6hcUXojGowM4SlQuOYegaFGIlLraISO5sAKBXchSIAwGhAI3dLNpIgA7" width="15" height="15">',
        TOOLTIP_OFFSET = 5;
    
    function closeHelpTooltip() {
        $('#help_tooltip').fadeOut();
    }

	function openHelpTooltip(id, e) {
		$('#help_tooltip').html('<div id="help_tooltip_content">' + loca.getLocaData('txt_' + id, sucodoLoca.lang) + '</div>');
        $('#help_tooltip').fadeIn();

        // calc offsets
        var offsetX = 0,
            offsetY = 0;

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
	}

    function updateControls() {
        var spans = document.getElementsByTagName('span'),
                span;
        if (!spans) {
            return;
        }

        for (i = spans.length - 1; i >= 0; i--) {
            if (spans[i].id.indexOf(ID_HELP_PREFIX) === 0) {
                spans[i].innerHTML = INFO_HTML;
                $('#' + spans[i].id).mousemove((function (e) {
                    span = spans[i];
                    return function (e) {
						openHelpTooltip(span.id, e);
                    };
                }()));
                $('#' + spans[i].id).mouseleave(closeHelpTooltip);
            }
        }

    }

    return {
        infoHtml: function () { return INFO_HTML; },
        updateControls: updateControls
    };
}());
