'use strict';

class RemoveRoomFlagsAction {
    constructor (config, plugins, flagsPlugin) {
        this.config = config;
        this.plugins = plugins;
        this.flagsPlugin = flagsPlugin;
    }

    /**
     * Gets the name of the action
     *
     * @returns {string}
     */
    getName() {
        return 'remove_room_flags';
    }

    /**
     * Runs the action, updating the response as required
     *
     * @param {Response} response   The response to update
     * @param {Array} actionData    A single flag, or a list of flags, or an object of flags with instructions
     * @returns {Response}
     */
    run (response, actionData) {
        const stateName = this.config.getState();

        const flagNames = Array.isArray(actionData) ? actionData : [actionData];
        flagNames.forEach(flagName => {
            this.flagsPlugin.removeFlag(flagName, stateName);
        });

        return response;
    }
}

module.exports = RemoveRoomFlagsAction;