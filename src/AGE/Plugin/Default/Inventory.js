'use strict';

const AddToInventoryAction = require('./Inventory/Actions/AddToInventoryAction');
const Intents = require('./Inventory/Intents');
const RemoveFromInventoryAction = require('./Inventory/Actions/RemoveFromInventoryAction');
const Response = require('../../Response/Response');

class Inventory {
    /**
     * The constructor for this plugin
     *
     * @param {Config} config   The config object
     */
    constructor(config) {
        this.config = config;
        this.plugins = null;
        this.additionalItems = {};
    }

    /**
     * The name of the plugin
     *
     * @returns {string}
     */
    getName() {
        return Inventory.name();
    }

    /**
     * The name of the plugin
     *
     * @returns {string}
     */
    static name() {
        return 'inventory';
    }

    /**
     * Stores the plugin object here for easy access into other plugins
     *
     * @param {Plugins} plugins     The plugins object
     */
    setPlugins(plugins) {
        this.plugins = plugins;
    }

    /**
     * Runs before getStates() and updates any changes in other plugins
     */
    preGetStates() {
        const roomPlugin = require('./Rooms');
        const rooms = this.plugins.get(roomPlugin.name());

        rooms.addGenericIntent(new Intents.PickUp(this.config, this.plugins));
        rooms.addRoomAction(new AddToInventoryAction(this.config, this.plugins, this));
        rooms.addRoomAction(new RemoveFromInventoryAction(this.config, this.plugins, this));

        rooms.addResetCallback(() => {
            this.__setInventory({});
        });

        const self = this;
        rooms.addItemCallback((itemKey, state) => {
            const result = {};
            result[itemKey] = self.getItem(itemKey);

            return result;
        });
    }

    /**
     * There are no states for the Inspector
     *
     * @returns {Object}
     */
    getStates() {
        return {};
    }


    processResponse(response, state) {
        return response;
    }

    hasItemName(itemName) {
        const rooms = this.plugins.get(require('./Rooms').name());
        const item = rooms.getItemKeyByName(itemName);

        return this.hasItem(item);
    }

    hasItem(itemKey) {
        const inventory = this.__getInventory();

        return typeof inventory[itemKey] !== 'undefined';
    }

    addItem(itemKey, count = 1) {
        const flagPlugin = require('./Flags');
        this.plugins.get(flagPlugin.name()).addFlag('inventory_' + itemKey);

        const inventory = this.__getInventory();
        inventory[itemKey] = typeof inventory[itemKey] === 'undefined' ? 0 : inventory[itemKey];
        inventory[itemKey] += count;
        this.__setInventory(inventory);
    }

    removeItem(itemKey, count = 1) {
        const inventory = this.__getInventory();
        inventory[itemKey] = typeof inventory[itemKey] === 'undefined' ? 0 : inventory[itemKey];
        inventory[itemKey] -= count;

        if (inventory[itemKey] <= 0) {
            delete inventory[itemKey];
        }

        this.__setInventory(inventory);
    }

    getItem(itemKey) {
        if (!this.hasItem(itemKey)) {
            return null;
        }

        const allItems = this.config.get('items');

        return typeof(allItems[itemKey]) !== 'undefined' ? allItems[itemKey] : null;
    }

    __getInventory() {
        return this.config.getAttributes('inventory');
    }

    __setInventory(config) {
        this.config.updateAttribute('inventory', config);
    }
}

module.exports = Inventory;
