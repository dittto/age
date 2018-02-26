'use strict';

const CheckDescriptionHasFlags = require('./Flags/DescriptionChecks/DescriptionCheckHasFlags');
const CheckHasFlags = require('./Flags/Checks/CheckHasFlags');
const CreateRoomFlagsAction = require('./Flags/Actions/CreateRoomFlagsAction');
const CreateWorldFlagsAction = require('./Flags/Actions/CreateWorldFlagsAction');
const RemoveRoomFlagsAction = require('./Flags/Actions/RemoveRoomFlagsAction');
const RemoveWorldFlagsAction = require('./Flags/Actions/RemoveWorldFlagsAction');
const SharedCreateFlags = require('./Flags/Shared/SharedCreateFlags');
const SharedHasFlags = require('./Flags/Shared/SharedHasFlags');

class Flags {
    /**
     * The constructor for this plugin
     *
     * @param {Config} config   The config object
     */
    constructor(config) {
        this.config = config;
        this.plugins = null;
        this.hasFlagCallbacks = [];
    }

    /**
     * The name of the plugin
     *
     * @returns {string}
     */
    getName() {
        return Flags.name();
    }

    /**
     * The name of the plugin
     *
     * @returns {string}
     */
    static name() {
        return 'flags';
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
        if (!rooms) {
            throw Error("'" + roomPlugin.name() + "' plugin is required for the 'flags' plugin");
        }

        const hasFlags = new SharedHasFlags(this.config, this.plugins, this.hasFlagCallbacks);
        rooms.addRoomCheck(new CheckHasFlags(this.config, this.plugins, hasFlags));
        rooms.addRoomDescriptionCheck(new CheckDescriptionHasFlags(this.config, this.plugins, hasFlags));

        const createFlags = new SharedCreateFlags(this.config, this.plugins, this);
        rooms.addRoomAction(new CreateRoomFlagsAction(this.config, this.plugins, createFlags));
        rooms.addRoomAction(new CreateWorldFlagsAction(this.config, this.plugins, createFlags));
        rooms.addRoomAction(new RemoveRoomFlagsAction(this.config, this.plugins, this));
        rooms.addRoomAction(new RemoveWorldFlagsAction(this.config, this.plugins, this));

        rooms.addResetCallback(() => {
            this.__setFlags({});
        });
    }

    getStates() {
        return {};
    }

    getFlagsForState(stateName) {
        const config = this.__getFlags();
        let foundFlags = [];

        if (config.state && typeof(config.state[stateName]) !== 'undefined') {
            foundFlags += Object.keys(config.state[stateName]);
        }

        if (config.world) {
            foundFlags += Object.keys(config.world);
        }

        return foundFlags;
    }

    addFlag(flagName, valueModifier = 0, stateName = null) {
        const config = this.__getFlags();

        if (stateName !== null) {
            config.state = typeof config.state === 'undefined' ? {} : config.state;
            config.state[stateName] = typeof config.state[stateName] === 'undefined' ? {} : config.state[stateName];
            config.state[stateName][flagName] = valueModifier;
        }
        else {
            config.world = typeof config.world === 'undefined' ? {} : config.world;
            config.world[flagName] = valueModifier;
        }

        this.__setFlags(config);
    }

    updateFlag(flagName, valueModifier = 0, stateName = null) {
        const config = this.__getFlags();

        if (stateName !== null) {
            config.state = typeof config.state === 'undefined' ? {} : config.state;
            config.state[stateName] = typeof config.state[stateName] === 'undefined' ? {} : config.state[stateName];
            config.state[stateName][flagName] = typeof config.state[stateName][flagName] === 'undefined' ? 0 : config.state[stateName][flagName];
            config.state[stateName][flagName] += valueModifier;
        }
        else {
            config.world = typeof config.world === 'undefined' ? {} : config.world;
            config.world[flagName] = typeof config.world[flagName] === 'undefined' ? 0 : config.world[flagName];
            config.world[flagName] += valueModifier;
        }

        this.__setFlags(config);
    }

    removeFlag(flagName, stateName = null) {
        const config = this.__getFlags();

        if (stateName !== null) {
            if (typeof config[stateName] !== 'undefined') {
                delete config[stateName][flagName];
            }
        }
        else if (typeof config.world !== 'undefined') {
            delete config.world[flagName];
        }

        this.__setFlags(config);
    }

    addHasFlagCallback(callback) {
        this.hasFlagCallbacks.push(callback);
    }

    __getFlags() {
        return this.config.getAttributes('flags');
    }

    __setFlags(config) {
        this.config.updateAttribute('flags', config);
    }
}

module.exports = Flags;