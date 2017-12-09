'use strict';

class RepeatAction {
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
        return 'repeat';
    }

    /**
     * Runs the action, updating the response as required
     *
     * @param {Response} response   The response to update
     * @param {Array} actionData    The data stored against the action
     * @returns {Response}
     */
    run (response, actionData) {
        response.setRepeat(actionData, this.config.getState());

        return response;
    }
}

module.exports = RepeatAction;