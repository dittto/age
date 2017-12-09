'use strict';

const Response = require('../../../../Response/Response');

class InitialLaunchIntent {
    constructor (config, plugins) {
        this.config = config;
        this.plugins = plugins;
    }

    getName () {
        return 'InitialLaunch';
    }

    process (slots) {
        this.config.setState('MainMenu');

        return new Response()
            .setAutoStateRedirect('LaunchRequest');
    }
}

module.exports = InitialLaunchIntent;
