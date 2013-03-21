/*
 Copyright 2012 Manuel Rülke, http://homecoded.com

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

Sucodo.ColorWarner = {
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