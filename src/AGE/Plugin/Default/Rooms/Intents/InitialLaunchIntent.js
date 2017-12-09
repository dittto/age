'use strict';

const BaseIntent = require('./BaseIntent');
const Response = require('../../../../Response/Response');

class InitialLaunchIntent extends BaseIntent {
    constructor (config, plugins) {
        super(config, plugins);
    }

    getName () {
        return 'LaunchRequest';
    }

    getNameSuffix() {
        return '';
    }

    process (slots) {
        const room = this.getRoomsPlugin().getRoom();

        let response = new Response();

        const defaultResponses = this.config.getBaseConfig('default_responses') || {};
        if (!!defaultResponses.load_game) {
            if (defaultResponses.load_game.description) {
                response.setText(defaultResponses.load_game.description, room.getState());
            }

            if (defaultResponses.load_game.repeat) {
                response.setRepeat(defaultResponses.load_game.repeat);
            }
        }

        const data = room.getRoomData();
        if (!!data.load_game) {
            if (data.load_game.description) {
                response.setText(data.load_game.description, room.getState());
            }

            if (data.load_game.repeat) {
                response.setRepeat(data.load_game.repeat);
            }
        }

        return response;
    }
}

module.exports = InitialLaunchIntent;
