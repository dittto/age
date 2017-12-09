'use strict';

class AddToInventoryAction {
    constructor (config, plugins, inventoryPlugin) {
        this.config = config;
        this.plugins = plugins;
        this.inventoryPlugin = inventoryPlugin;
    }

    /**
     * Gets the name of the action
     *
     * @returns {string}
     */
    getName() {
        return 'add_to_inventory';
    }

    /**
     * Runs the action, updating the response as required
     *
     * @param {Response} response   The response to update
     * @param {Array} actionData    A single item key, or a list of item keys
     * @returns {Response}
     */
    run (response, actionData) {
        const items = Array.isArray(actionData) ? actionData : [actionData];

        items.forEach(item => {
            this.inventoryPlugin.addItem(item);
        });

        return response;
    }
}

module.exports = AddToInventoryAction;