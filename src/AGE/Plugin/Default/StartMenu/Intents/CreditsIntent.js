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
        const credits = this.config.get('start_menu').credits;

        return new Response()
            .setText(credits.description, this.config.getState())
            .setRepeat(credits.repeat);
    }
}

module.exports = CreditsIntent;
