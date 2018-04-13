'use strict';

const Response = require('../../../../Response/Response');

class Unhandled {
    constructor (config, plugins) {
        this.config = config;
        this.plugins = plugins;
    }

    getName () {
        return 'Unhandled';
    }

    getNameSuffix() {
        return '';
    }

    process (slots) {
        const Rooms = require('../../Rooms');
        const rooms = this.plugins.get(Rooms.name());
        const room = rooms.getRoom();
        const state = room.getState();

        let response = new Response();
        response.setText('That request was not understood. Please try again', state);
        response.setRepeat('If you need any help, say "help"');

        const defaultResponses = this.config.getBaseConfig('default_responses') || {};
        if (!!defaultResponses.unhandled) {
            if (defaultResponses.unhandled.description) {
                response.setText(defaultResponses.unhandled.description, state);
            }

            if (defaultResponses.unhandled.image) {
                response.setImage(defaultResponses.unhandled.image);
            }

            if (defaultResponses.unhandled.repeat) {
                response.setRepeat(defaultResponses.unhandled.repeat);
            }
        }

        const data = room.getRoomData();
        if (!!data.unhandled) {
            if (data.unhandled.description) {
                response.setText(data.unhandled.description, state);
            }

            if (data.unhandled.image) {
                response.setText(data.unhandled.image);
            }

            if (data.unhandled.repeat) {
                response.setRepeat(data.unhandled.repeat);
            }
        }

        return response;
    }
}

module.exports = Unhandled;
