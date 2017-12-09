'use strict';

const Response = require('../../../../Response/Response');
const Unhandled = require('./Unhandled');

class BaseIntent {
    constructor (config, plugins) {
        this.config = config;
        this.plugins = plugins;
        this.response = null;
    }

    getName () {
        throw Error("The getName() method should be overridden");
    }

    getNameSuffix() {
        return 'Intent';
    }

    process (slots) {
        const rooms = this.getRoomsPlugin();
        const room = rooms.getRoom();
        const processedSlots = this.processSlots(rooms, slots);

        if (this.hasResponse()) {
            return this.getResponse();
        }

        const actions = this.preRunActions(
            room.getIntentActions(this.getName(), processedSlots)
        );

        if (this.hasResponse()) {
            return this.getResponse();
        }

        if (actions === null) {
            return new Unhandled(this.config, this.plugins).process(slots);
        }

        this.setResponse(
            this.postRunActions(
                rooms.runActions(new Response(), actions)
            )
        );

        return this.getResponse();
    }

    getConfig() {
        return this.config;
    }

    getRoomsPlugin() {
        const Rooms = require('../../Rooms');
        return this.getPlugin(Rooms.name());
    }

    getPlugin(pluginName) {
        return this.plugins.get(pluginName);
    }

    setResponse(response) {
        this.response = response;
    }

    getResponse() {
        return this.response;
    }

    hasResponse() {
        return this.response !== null;
    }

    processSlots(slots) {
        return slots;
    }

    preRunActions(actions) {
        return actions;
    }

    postRunActions(response) {
        return response;
    }
}

module.exports = BaseIntent;