'use strict';

const Response = require('../../../../Response/Response');

class MainMenuIntent {
    constructor (config, plugins) {
        this.config = config;
        this.plugins = plugins;
    }

    getName () {
        return 'MainMenu';
    }

    process (slots) {
        const mainMenuConfig = this.config.get('start_menu').main_menu;

        this.config.setState('MainMenu');

        return new Response()
            .setText(mainMenuConfig.description, this.config.getState())
            .setRepeat(mainMenuConfig.repeat);
    }
}

module.exports = MainMenuIntent;
