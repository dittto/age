'use strict';

class DescriptionAction {
    constructor (config, plugins) {
        this.config = config;
        this.plugins = plugins;
    }

    /**
     * Gets the name of the action
     *
     * @returns {string}
     */
    getName() {
        return 'description';
    }

    /**
     * Runs the action, updating the response as required
     *
     * @param {Response} response   The response to update
     * @param {Array} actionData    The data stored against the action
     * @returns {Response}
     */
    run (response, actionData) {
        response.setText(actionData, this.config.getState());

        const roomDefaults = this.config.getBaseConfig('default_responses').room;
        if (!!roomDefaults && !!roomDefaults.repeat) {
            response.setRepeat(roomDefaults.repeat);
        }

        return response;
    }
}

module.exports = DescriptionAction;