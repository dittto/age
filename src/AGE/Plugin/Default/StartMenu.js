'use strict';

const Response = require('../../Response/Response');
const Intents = require('./StartMenu/Intents');

class StartMenu {
    /**
     * The constructor for this plugin
     *
     * @param {Config} config   The config object
     */
    constructor(config) {
        this.config = config;
        this.plugins = null;
    }

    /**
     * The name of the plugin
     *
     * @returns {string}
     */
    getName() {
        return StartMenu.name();
    }

    /**
     * The name of the plugin
     *
     * @returns {string}
     */
    static name() {
        return 'startMenu';
    }

    /**
     * Stores the plugin object here for easy access into other plugins
     *
     * @param {Plugins} plugins     The plugins object
     */
    setPlugins(plugins) {
        this.plugins = plugins;
    }

    /**
     * Gets a list of the possible states for the Start Menu
     *
     * @returns {Object}
     */
    getStates() {
        const creditsIntent = new Intents.Credits(this.config, this.plugins);
        const creditsMoreIntent = new Intents.CreditsMore(this.config, this.plugins);
        const helpIntent = new Intents.Help(this.config, this.plugins);
        const initialLaunchIntent = new Intents.InitialLaunch(this.config, this.plugins);
        const mainMenuIntent = new Intents.MainMenu(this.config, this.plugins);
        const newGameIntent = new Intents.NewGame(this.config, this.plugins);
        const unhandledIntent = new Intents.Unhandled(this.config, this.plugins);

        return {
            '': {
                'LaunchRequest': initialLaunchIntent,
            },
            'MainMenu': {
                'LaunchRequest': mainMenuIntent,
                'MainMenuIntent': mainMenuIntent,
                'NewGameIntent': newGameIntent,
                'CreditsIntent': creditsIntent,
                'HelpIntent': helpIntent,
                'Unhandled': unhandledIntent
            },
            'Credits': {
                'LaunchRequest': creditsIntent,
                'CreditsIntent': creditsIntent,
                'CreditsMoreIntent': creditsMoreIntent,
                'MainMenuIntent': mainMenuIntent,
                'HelpIntent': helpIntent,
                'Unhandled': unhandledIntent
            }
        };
    }


    processResponse(response, state) {
        if (state === "" && this.config.hasChangedState()) {
            response = new Intents.MainMenu(this.config, this.plugins).process({});
        } else {
            this.config.setState(state);
        }

        return response;
    }
}
module.exports = StartMenu;
