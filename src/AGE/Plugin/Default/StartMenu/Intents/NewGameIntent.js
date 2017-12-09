'use strict';

const Response = require('../../../../Response/Response');

class NewGameIntent {
    constructor (config, plugins) {
        this.config = config;
        this.plugins = plugins;
    }

    getName () {
        return 'NewGame';
    }

    process (slots) {
        const response = new Response()
            .setText(this.config.get('start_menu').new_game_prefix, this.config.getState());

        this.config.setState(this.config.get('default_room'));

        return response;
    }
}

module.exports = NewGameIntent;
