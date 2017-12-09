'use strict';

const conditions = {
    GREATER_THAN: 'greater_than',
    GREATER_THAN_EQUAL: 'greater_than_equal',
    LESS_THAN: 'less_than',
    LESS_THAN_EQUAL: 'less_than_equal',
    EQUAL: 'equal'
};

class SharedHasFlags {
    constructor (config, plugins, hasFlagCallbacks) {
        this.config = config;
        this.plugins = plugins;
        this.hasFlagCallbacks = hasFlagCallbacks;
    }

    /**
     * Gets the name of the description check modifier
     *
     * @returns {string}
     */
    getName() {
        return 'has_flags';
    }

    /**
     * Searches through every description check looking for a matching name. Description checks only have access to a state as no intent has been chosen yet.
     *
     * @param {Array} linkData      A list of valid flags to check, either just the names, or with additional comparison information, e.g. [open_door, brass_key] or {room_feelings: {condition: less_than, value: 0}}
     * @param {String} stateName    The name of the state the game is in
     * @returns {boolean}
     */
    check (linkData, stateName) {
        let isValid = true;

        Object.keys(linkData).forEach(key => {
            if (key % 1 === 0 && !this.__hasFlag(linkData[key], stateName)) {
                isValid = false;
            }

            if (key % 1 !== 0 && !this.__compareFlag(key, linkData[key].condition, linkData[key].value, stateName)) {
                isValid = false;
            }
        });

        return isValid;
    }

    __getFlag(flagName, stateName = null) {
        const flags = this.config.getAttributes('flags');

        if (flags.world && typeof(flags.world[flagName]) !== 'undefined') {
            return flags.world[flagName];
        }

        if (stateName !== null && flags.state && flags.state[stateName] && typeof(flags.state[stateName][flagName]) !== 'undefined') {
            return flags.state[stateName][flagName];
        }

        this.hasFlagCallbacks.forEach(callback => {
            const callbackResult = callback(flagName, stateName);
            if (callbackResult !== null) {
                return callbackResult;
            }
        });

        return null;
    }

    __hasFlag(flagName, stateName = null) {
        return this.__getFlag(flagName, stateName) !== null;
    }

    __compareFlag(flagName, condition, comparisonValue, stateName = null) {
        let currentValue = this.__getFlag(flagName, stateName);
        if (currentValue === null) {
            return false;
        }

        switch (condition) {
            case conditions.GREATER_THAN:
                return currentValue > comparisonValue;
            case conditions.GREATER_THAN_EQUAL:
                return currentValue > comparisonValue;
            case conditions.LESS_THAN:
                return currentValue > comparisonValue;
            case conditions.LESS_THAN_EQUAL:
                return currentValue > comparisonValue;
            case conditions.EQUAL:
                return currentValue > comparisonValue;
            default:
                throw Error("Flag comparison condition '" + condition + "' not found");
        }
    }
}

module.exports = SharedHasFlags;