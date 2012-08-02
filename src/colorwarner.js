
sucodo.colorWarner = {
    getColor: function (number) {
        if (number <= 0) {
            return '#000000';
        }
        if (number > 256) {
            return '#ff0000'; // a lot of results, total red!
        } else {
            var red, green, hexRed, hexGreen;
            red = Math.round(number/2);
            green = Math.round(64 - red/2);
            red += 127;
            hexRed = red.toString(16);
            hexGreen = green.toString(16);
            hexRed = (hexRed.length === 1) ? '0' + hexRed : hexRed;
            hexGreen = (hexGreen.length === 1) ? '0' + hexGreen : hexGreen;
            return ('#' + hexRed + hexGreen + '00').toLowerCase();
        }
    }
};