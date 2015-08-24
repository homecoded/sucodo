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

        var storage = {},
            id = null,
            timer = null,
            LIFE_TIME = Sucodo.Storage.LIFE_TIME = 3 * 24 * 60 * 60 * 1000 // 3 days of cache lifetime
        ;

        /**
         * get an entry in the storage
         * @param id to be used as index in the storage (key)
         * @return object or value associated with the key, or null if the element was deleted or cleared
         */
        function get(id) {
            _removeExpiredEntries(storage);
            if (storage[id]) {
                return storage[id].value
            }
            return null;
        }

        /**
         * set an entry in the storage
         * @param id to be used as index in the storage (key)
         * @param newValue object or value to be associated with the key
         * @return object itself, for method chaining
         */
        function set(id, newValue) {
            var currentTimer = _getTimer();
            if (newValue == null) {
                storage[id] = null;
            } else {
                storage[id] = {
                    value : newValue,
                    expirationTime : currentTimer.getTime() + LIFE_TIME
                };
            }
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
            var serializedStorage = JSON.stringify(storage);
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
            // try if it's possible to use
            try {
                localStorage.setItem('sucodo_test_localstorage', 'test');
                localStorage.removeItem('sucodo_test_localstorage');
            } catch (e) {
                return false;
            }
            return true;
        }

        /**
         * Sets an external timer (for testing)
         * @param externalTimer timer object that has method getTime()
         */
        function setTimer(externalTimer) {
            if (externalTimer && typeof externalTimer.getTime == 'function') {
                timer = externalTimer;
            } else {
                throw 'timer object has no getTime function!';
            }
        }

        /**
         * Return a timer object
         */
        function _getTimer() {
            if (timer == null) {
                timer  = (function (){
                    function getTime() { return (new Date()).getTime(); }
                    return {
                        getTime: getTime
                    }
                })();
            }
            return timer;
        }

        /**
         * Removes all the entries from a storage that have expired
         * @param storage storage object collection
         */
        function _removeExpiredEntries(storage) {
            var time = _getTimer().getTime(),
                storageObject;

            for (var id in storage) {
                if (storage.hasOwnProperty(id)) {
                    storageObject = storage[id];
                    if (storageObject != null && storageObject.expirationTime < time) {
                        set(id, null);
                    }
                }
            }
        }

        return {
            get: get,
            set: set,
            clear: clear,
            load: load,
            save: save,
            discard: discard,
            isPermanentStorageAvailable : isPermanentStorageAvailable,
            setTimer: setTimer
        }
    }

    /**
     * public interface
     */
    return {
        getInstance: getInstance
    }
})();
