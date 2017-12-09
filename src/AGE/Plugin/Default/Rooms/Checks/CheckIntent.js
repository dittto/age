'use strict';

class CheckIntent {
    constructor (config, plugins) {
        this.config = config;
        this.plugins = plugins;
    }

    /**
     * Gets the name of the check modifier
     *
     * @returns {string}
     */
    getName() {
        return 'intents';
    }

    /**
     * Searches through every intent check looking for a matching intent name and slots.
     *
     * @param {Array} linkData      A list of valid intents, e.g. [{name: use, object: door}, {name: move, direction: east}]
     * @param {String} stateName    The name of the state the game is in
     * @param {String} intentName   The name of the intent to map, e.g. use
     * @param {Array} slotData      A map of slot data to compare against, e.g {object: door, direction: west}
     * @returns {boolean}
     */
    check (linkData, stateName, intentName, slotData) {
        for (let i = 0; i < linkData.length; i ++) {

            let isValid = true;
            const intentData = linkData[i];

            Object.keys(intentData).forEach(fieldName => {
                if (fieldName === 'name') {
                    if (intentData[fieldName] !== intentName) {
                        isValid = false;
                    }
                } else if (intentData[fieldName] !== slotData[fieldName]) {

                    const intentValues = (Array.isArray(intentData[fieldName]) ? intentData[fieldName] : [intentData[fieldName]]).sort().toString();
                    const slotValues = (typeof slotData[fieldName] !== 'undefined' ? Object.keys(slotData[fieldName]) : []).sort().toString();

                    if (intentValues !== slotValues) {
                        isValid = false;
                    }
                }
            });

            if (isValid) {
                return true;
            }
        }

        return false;
    }
}

module.exports = CheckIntent;