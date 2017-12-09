'use strict';

class CreateWorldFlagsAction {
    constructor (config, plugins, sharedCreateFlags, flagsPlugin) {
        this.config = config;
        this.plugins = plugins;
        this.sharedCreateFlags = sharedCreateFlags;
        this.flagsPlugin = flagsPlugin;
    }

    /**
     * Gets the name of the action
     *
     * @returns {string}
     */
    getName() {
        return 'create_world_flags';
    }

    /**
     * Runs the action, updating the response as required
     *
     * @param {Response} response   The response to update
     * @param {Array} actionData    A single flag, or a list of flags, or an object of flags with instructions
     * @returns {Response}
     */
    run (response, actionData) {
        const flagData = this.sharedCreateFlags.createFlagData(actionData);

        this.sharedCreateFlags.updateFlags(flagData);

        return response;
    }
}

module.exports = CreateWorldFlagsAction;