'use strict';

const BaseIntent = require('./BaseIntent');
const Response = require('../../../../Response/Response');

class HelpIntent extends BaseIntent {
    constructor (config, plugins) {
        super(config, plugins);
    }

    getName () {
        return 'Help';
    }

    process (slots) {
        const room = this.getRoomsPlugin().getRoom();

        let response = new Response();

        const defaultResponses = this.config.getBaseConfig('default_responses') || {};
        if (!!defaultResponses.room && !!defaultResponses.room.help) {
            if (defaultResponses.room.help.description) {
                response.setText(defaultResponses.room.help.description, room.getState());
            }

            if (defaultResponses.room.help.repeat) {
                response.setRepeat(defaultResponses.room.help.repeat);
            }
        }

        const data = room.getRoomData();
        if (!!data.help) {
            if (data.help.description) {
                response.setText(data.help.description, room.getState());
            }

            if (data.help.repeat) {
                response.setRepeat(data.help.repeat);
            }
        }

        return response;
    }
}

module.exports = HelpIntent;
