'use strict';

class Plugins {
    constructor(config) {
        this.config = config;
        this.plugins = {};
        this.defaultPluginPath = './';
        this.states = null;
        this.hasPreGetStates = false;
    }

    get(name) {
        return this.plugins[name];
    }

    loadPlugins() {
        this.__loadPlugins();

        return this;
    }

    getPluginPaths() {
        return this.__getPluginPaths();
    }

    getPluginByState(state) {
        const plugins = {};

        Object.keys(this.plugins).forEach(pluginName => {
            this.__preGetStates();
            const intents = this.plugins[pluginName].getStates();

            Object.keys(intents).forEach(intentName => {
                plugins[intentName] = pluginName;
            });
        });

        if (!plugins[state]) {
            throw Error("Cannot find plugin for state '" + state + "'");
        }

        return this.plugins[plugins[state]];
    }

    buildStates() {
        const merge = require('deepmerge');
        let states = {};

        Object.keys(this.plugins).forEach(pluginName => {
            this.__preGetStates();
            states = merge(states, this.plugins[pluginName].getStates());
        });

        this.states = states;

        return this;
    }

    getStateNames() {
        return Object.keys(this.states);
    }

    getIntentsForState(state, intentCallback) {
        const stateIntents = this.states[state];
        if (!stateIntents) {
            throw Error("No intents found for state '" + state + "'");
        }

        const results = {};

        const self = this;
        Object.keys(stateIntents).forEach(function (intentName) {
            results[intentName] = function () {
                const alexaContext = this;

                self.config.setState(alexaContext.handler.state);
                self.config.setAttributes(alexaContext.attributes);

                const slots = alexaContext.event.request.intent && alexaContext.event.request.intent.slots ? alexaContext.event.request.intent.slots : {};

                if (typeof stateIntents[intentName].process !== 'function') {
                    throw Error('The intent "' + intentName + '" is missing a process() function');
                }

                const response = stateIntents[intentName].process(slots);

                intentCallback(alexaContext, intentName, response);
            }
        });

        return results;
    }

    __getPluginPaths() {
        const paths = [];

        this.config.getPlugins().forEach(path => {
            try {
                require(this.defaultPluginPath + path);
                paths.push(this.defaultPluginPath + path);
            } catch (e) {
                if (e.code !== 'MODULE_NOT_FOUND') {
                    throw e;
                }
                require(path);
                paths.push(path);
            }
        });

        return paths;
    }

    __loadPlugins() {
        this.config.getPlugins().forEach(path => {
            let plugin = null;
            try {
                plugin = require(this.defaultPluginPath + path);
            } catch (e) {
                if (e.code !== 'MODULE_NOT_FOUND') {
                    throw e;
                }
                plugin = require(path);
            }

            const pluginObj = new plugin(this.config);
            this.plugins[pluginObj.getName()] = pluginObj;
            pluginObj.setPlugins(this);
        });
    }

    __preGetStates() {
        if (this.hasPreGetStates) {
            return;
        }

        Object.keys(this.plugins).forEach(pluginName => {
            if (typeof this.plugins[pluginName].preGetStates === 'function') {
                this.plugins[pluginName].preGetStates();
            }
        });

        this.hasPreGetStates = true;
    }
}

module.exports = Plugins;