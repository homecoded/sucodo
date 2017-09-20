/*
 Copyright 2017 Manuel Ruelke, homecoded.com

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

/**
 * factory function to inject objects into the global scope of a module
 *
 * @param {object} context
 * @returns {function} injector function
 */
function getInjector(context) {
    return function inject(dependencies) {
        Object.keys(dependencies).forEach(
            function(depName) {
                context[depName] = dependencies[depName];
            }
        );
    }
}

module.exports = {
    getInjector: getInjector
};
