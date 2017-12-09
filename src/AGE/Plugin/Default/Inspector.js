'use strict';

const Response = require('../../Response/Response');
const Intents = require('./Inspector/Intents');

const Rooms = require('./Rooms');

class Inspector {
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
        return Inspector.name();
    }

    /**
     * The name of the plugin
     *
     * @returns {string}
     */
    static name() {
        return 'inspector';
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
        const rooms = this.plugins.get(Rooms.name());
        rooms.addGenericIntent(new Intents.Inspect(this.config, this.plugins, this.additionalItems));
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

    /**
     * Adds additional items to be inspected by the InspectIntent
     *
     * @param {Object} additionalItems  The additional items to be inspected
     */
    addAdditionalInspectItems(additionalItems) {
        const items = {};

        Object.keys(this.additionalItems).forEach(name => {
            items[name] = this.additionalItems[name];
        });

        Object.keys(additionalItems).forEach(name => {
            items[name] = additionalItems[name];
        });

        this.additionalItems = items;
    }
}

module.exports = Inspector;
