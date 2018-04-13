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

        const response = new Response()
            .setText(mainMenuConfig.description, this.config.getState())
            .setRepeat(mainMenuConfig.repeat);

        if (mainMenuConfig.image) {
            response.setImage(mainMenuConfig.image);
        }

        return response;
    }
}

module.exports = MainMenuIntent;
