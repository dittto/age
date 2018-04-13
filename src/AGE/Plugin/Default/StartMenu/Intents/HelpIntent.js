'use strict';

const Response = require('../../../../Response/Response');

class HelpIntent {
    constructor (config, plugins) {
        this.config = config;
        this.plugins = plugins;
    }

    getName () {
        return 'Help';
    }

    process (slots) {
        const help = this.config.get('start_menu').help;
        let state = this.config.getState();

        if (state === '') {
            state = 'MainMenu';
        }

        const response = new Response()
            .setText(help[state].description, this.config.getState())
            .setRepeat(help[state].repeat);

        if (help[state].image) {
            response.setImage(help[state].image);
        }

        return response;
    }
}

module.exports = HelpIntent;
