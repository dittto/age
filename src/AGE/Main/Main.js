'use strict';

class Main {
    constructor(alexa, config, plugins, s3Path) {
        this.alexa = alexa;
        this.config = config;
        this.plugins = plugins;
        this.s3Path = s3Path;
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
        if (alexaContext.handler.state === '') {
            delete alexaContext.attributes['STATE'];
        }

        if (response.getAutoStateRedirect() !== '') {
            alexaContext.emitWithState(response.getAutoStateRedirect());

            return;
        }

        alexaContext.response.speak(response.getText());
        if (response.getIsQuestion()) {
            alexaContext.response.listen(response.getRepeat());
        }

        if (response.hasImage()) {
            const builder = new this.alexa.templateBuilders.BodyTemplate7Builder();
            const template = builder.setBackgroundImage(this.alexa.utils.ImageUtils.makeImage(this.s3Path + response.getImage()))
                .setBackButtonBehavior('HIDDEN')
                .build();
            alexaContext.response.renderTemplate(template);
        }

        alexaContext.emit(':saveState', true);
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