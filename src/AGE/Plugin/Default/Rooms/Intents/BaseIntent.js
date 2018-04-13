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
            const response = new Unhandled(this.config, this.plugins).process(slots);
            return this.processUnhandledError(slots, processedSlots, response);
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

    processUnhandledError(originalSlots, processedSlots, response) {
        return response;
    }

    preRunActions(actions) {
        return actions;
    }

    postRunActions(response) {
        return response;
    }

    getSlotValue(slotData) {
        if (slotData && slotData.resolutions && slotData.resolutions.resolutionsPerAuthority) {
            let result = null;
            slotData.resolutions.resolutionsPerAuthority.forEach(res => {
                if (res.values && res.values.length > 0) {
                    result = res.values[0].value.name.toLowerCase();
                }
            });
            return result;
        }

        if (slotData && slotData.value) {
            return slotData.value.toLowerCase();
        }

        return '';
    }
}

module.exports = BaseIntent;