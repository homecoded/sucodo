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

/**
 * Sucodo.Storage
 * is a key value store
 */
Sucodo.Storage = (function () {

    /**
     * returns an instance of storage
     */
    function getInstance() {
        /**
         * Storage object
         * @type {Object}
         */
        var storage = {},
            id = null
        ;

        /**
         * get an entry in the storage
         * @param id to be used as index in the storage (key)
         * @return object or value associated with the key, or null if the element was deleted or cleared
         */
        function get(id) {
            console.log('get ' + id +  ' = ', storage[id]);
            if (storage[id]) {
                return storage[id];
            }
            return null;
        }

        /**
         * set an entry in the storage
         * @param id to be used as index in the storage (key)
         * @param value object or value to be associated with the key
         * @return object itself, for method chaining
         */
        function set(id, value) {
            storage[id] = value;
            return this;
        }

        /**
         * Clear the complete storage
         * @return object itself, for method chaining
         */
        function clear() {
            storage = {};
            return this;
        }

        /**
         *  Initializes the storage from local storage
         *  @param loadId storage id
         *  @return object itself, for method chaining
         */
        function load(loadId) {
            if (isPermanentStorageAvailable() == false) {
                return this ;
            }
            id = loadId;
            var serializedStorage = localStorage.getItem(id);
            storage = JSON.parse(serializedStorage);
            if (!storage) {
                storage = {};
            }
            return this;
        }

        /**
         * Saves the storage to local storage
         * @return object itself, for method chaining
         */
        function save() {
            if (isPermanentStorageAvailable() == false || id === null) {
                return this;
            }
            var storageObject = storage,
                serializedStorage = JSON.stringify(storageObject);
            localStorage.setItem(id, serializedStorage);
            return this;
        }

        /**
         * Deletes a storage
         * @return object itself, for method chaining
         */
        function discard() {
            if (isPermanentStorageAvailable() == false || id === null) {
                return this;
            }
            localStorage.removeItem(id);
            clear();
        }

        /**
         * Determine if permanent storage can be used
         * @return Boolean
         */
        function isPermanentStorageAvailable() {
            return (typeof localStorage !== 'undefined');
        }


        return {
            get: get,
            set: set,
            clear: clear,
            load: load,
            save: save,
            discard: discard,
            isPermanentStorageAvailable : isPermanentStorageAvailable
        }
    };

    /**
     * public interface
     */
    return {
        getInstance: getInstance
    }
})();
