'use strict';

class ImageAction {
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
        return 'image';
    }

    /**
     * Runs the action, updating the response as required
     *
     * @param {Response} response   The response to update
     * @param {Array} actionData    The data stored against the action
     * @returns {Response}
     */
    run (response, actionData) {
        response.setImage(actionData);

        return response;
    }
}

module.exports = ImageAction;