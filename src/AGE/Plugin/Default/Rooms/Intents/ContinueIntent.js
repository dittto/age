'use strict';

const Response = require('../../../../Response/Response');

class ContinueIntent {
    constructor (config, plugins) {
        this.config = config;
        this.plugins = plugins;
    }

    getName () {
        return 'Continue';
    }

    getNameSuffix() {
        return 'Intent';
    }

    process (slots) {
        const Rooms = require('../../Rooms');
        const rooms = this.plugins.get(Rooms.name());
        const room = rooms.getRoom();
        const state = room.getState();

        if (slots.ContinueCommand.value === 'yes') {
            this.config.setState('fake_state');
            this.config.setState(state);
        } else {
            rooms.reset();
            this.config.setState('');
        }

        return new Response();
    }
}

module.exports = ContinueIntent;
