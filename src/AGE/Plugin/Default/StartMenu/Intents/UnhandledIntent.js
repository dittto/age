'use strict';

const Response = require('../../../../Response/Response');

class UnhandledIntent {
    constructor (config, plugins) {
        this.config = config;
        this.plugins = plugins;
    }

    getName () {
        return 'Unhandled';
    }

    process (slots) {
        const unhandledConfig = this.config.get('start_menu').unhandled;

        return new Response()
            .setText(unhandledConfig.description, this.config.getState())
            .setRepeat(unhandledConfig.repeat);
    }
}

module.exports = UnhandledIntent;
