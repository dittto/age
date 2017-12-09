'use strict';

class Main {
    constructor(alexa, config, plugins) {
        this.alexa = alexa;
        this.config = config;
        this.plugins = plugins;
    }

    getHandlers() {
        const handlers = [];

        this.plugins.getStateNames().forEach(state => {
            handlers.push(
                this.alexa.CreateStateHandler(
                    state,
                    this.plugins.getIntentsForState(state, (alexaContext, intent, response) => {
                        this.__getIntentStrategy(alexaContext, intent, response);
                    })
                )
            );
        });

        return handlers;
    }

    __getIntentStrategy(alexaContext, intent, response) {
        if (!response) {
            throw Error("No valid response was found by Main.getIntentStrategy()");
        }

        response = this.__getStateResponse(response);

        alexaContext.handler.state = this.config.getState();

        if (response.getAutoStateRedirect() !== '') {
            alexaContext.emitWithState(response.getAutoStateRedirect());

            return;
        }

        alexaContext.response.speak(response.getText());
        if (response.getIsQuestion()) {
            alexaContext.response.listen(response.getRepeat());
        }

        alexaContext.emit(':saveState', true);
        // alexaContext.emit(':responseReady');
    }

    __getStateResponse(response) {
        if (this.config.hasChangedState()) {
            response = this.plugins
                .getPluginByState(this.config.getState())
                .processResponse(response, this.config.getState());

            response = this.__getStateResponse(response);
        }

        return response;
    }
}

module.exports = Main;