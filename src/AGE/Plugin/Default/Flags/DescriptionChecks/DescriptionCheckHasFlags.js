'use strict';

class DescriptionCheckHasFlags {
    constructor (config, plugins, sharedHasFlags) {
        this.config = config;
        this.plugins = plugins;
        this.sharedHasFlags = sharedHasFlags;
    }

    /**
     * Gets the name of the description check modifier
     *
     * @returns {string}
     */
    getName() {
        return this.sharedHasFlags.getName();
    }

    /**
     * Searches through every description check looking for a matching name. Description checks only have access to a state as no intent has been chosen yet.
     *
     * @param {Array} linkData      A list of valid flags to check, either just the names, or with additional comparison information, e.g. [open_door, brass_key] or {room_feelings: {condition: less_than, value: 0}}
     * @param {String} stateName    The name of the state the game is in
     * @returns {boolean}
     */
    check (linkData, stateName) {
        return this.sharedHasFlags.check(linkData, stateName);
    }
}

module.exports = DescriptionCheckHasFlags;