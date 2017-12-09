'use strict';

class Config {
    constructor(configPath) {
        this.config = {};
        this.currentState = '';
        this.oldState = null;
        this.attributes = {};
        this.__loadFiles(configPath);
    }

    get(type) {
        return this.config[type];
    }

    getBaseConfig(type) {
        return this.config.config[type] || [];
    }

    getPlugins() {
        return this.getBaseConfig('plugins');
    }

    setState(state) {
        this.oldState = this.oldState === null ? state : this.currentState;
        this.currentState = state;

        return this;
    }

    getState() {
        return this.currentState;
    }

    hasChangedState() {
        return this.currentState !== this.oldState;
    }

    setAttributes(attributes) {
        this.attributes = attributes;

        return this;
    }

    getAttributes(namespace) {
        return this.attributes[namespace] || {};
    }

    getDefaultSameStateQuestion() {
        return this.getBaseConfig('default_responses') ? this.getBaseConfig('default_responses').same_state_question : '';
    }

    updateAttribute(namespace, values) {

        this.attributes[namespace] = values;

        return this;
    }

    setLocale(locale) {
        return this;
    }

    getText() {
        return[];
    }

    __loadFiles(path) {
        const yaml = require('yamljs'),
            fs = require('fs'),
            merge = require('deepmerge');

        fs.readdirSync(path).forEach(file => {
            this.config = merge(yaml.load(path + file), this.config);
        });
    }
}

module.exports = Config;