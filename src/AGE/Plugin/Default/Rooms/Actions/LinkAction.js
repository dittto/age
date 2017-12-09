'use strict';

class LinkAction {
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
        return 'link';
    }

    /**
     * Runs the action, updating the response as required
     *
     * @param {Response} response           The response to update
     * @param {String|Object} actionData    The data stored against the action
     * @returns {Response}
     */
    run (response, actionData) {
        if (typeof actionData === 'string') {
            actionData = {
                state: actionData
            };
        }

        this.config.setState(actionData.state);

        if (typeof actionData.ignore_description !== 'undefined' && actionData.ignore_description) {
            response.setIgnoreTextForState(actionData.state);
        }

        return response;
    }
}

module.exports = LinkAction;