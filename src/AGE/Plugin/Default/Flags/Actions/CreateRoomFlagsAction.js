'use strict';

class CreateRoomFlagsAction {
    constructor (config, plugins, sharedCreateFlags) {
        this.config = config;
        this.plugins = plugins;
        this.sharedCreateFlags = sharedCreateFlags;
    }

    /**
     * Gets the name of the action
     *
     * @returns {string}
     */
    getName() {
        return 'create_room_flags';
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
        const flagData = this.sharedCreateFlags.createFlagData(actionData);

        this.sharedCreateFlags.updateFlags(flagData, stateName);

        return response;
    }
}

module.exports = CreateRoomFlagsAction;