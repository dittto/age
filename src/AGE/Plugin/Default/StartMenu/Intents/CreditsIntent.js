'use strict';

const Response = require('../../../../Response/Response');

class CreditsIntent {
    constructor (config, plugins) {
        this.config = config;
        this.plugins = plugins;
    }

    getName () {
        return 'Credits';
    }

    process (slots) {
        this.config.setState('Credits');

        return new Response()
            .setText(this.config.get('start_menu').credits, this.config.getState());
    }
}

module.exports = CreditsIntent;
