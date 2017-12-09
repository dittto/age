'use strict';

class CheckHasFlags {
    constructor (config, plugins, sharedHasFlags) {
        this.config = config;
        this.plugins = plugins;
        this.sharedHasFlags = sharedHasFlags;
    }

    /**
     * Gets the name of the check modifier
     *
     * @returns {string}
     */
    getName() {
        return this.sharedHasFlags.getName();
    }

    /**
     * Searches through every check looking for a matching check name and slots.
     *
     * @param {Array} linkData      A list of valid flags to check, either just the names, or with additional comparison information, e.g. [open_door, brass_key] or {room_feelings: {condition: less_than, value: 0}}
     * @param {String} stateName    The name of the state the game is in
     * @param {String} intentName   The name of the intent to map, e.g. use
     * @param {Array} slots         A map of slot data to compare against, e.g {object: door, direction: west}
     * @returns {boolean}
     */
    check (linkData, stateName, intentName, slots) {
        return this.sharedHasFlags.check(linkData, stateName);
    }
}

module.exports = CheckHasFlags;