'use strict';

module.exports.age = function (event, context, callback) {
    const AGE = require('./AGE'),
        Alexa = require('alexa-sdk'),
        SharedVars = require('serverless-shared-vars').get();

    // init alexa
    const alexaHandler = Alexa.handler(event, context);

    // load config and plugins
    const config = new AGE.Config('./config/');
    const plugins = new AGE.Plugins(config)
        .loadPlugins()
        .buildStates();

    // register handlers
    const main = new AGE.Main(Alexa, config, plugins);
    main.getHandlers().forEach(function (handler) {
        alexaHandler.registerHandlers(handler);
    });

    alexaHandler.dynamoDBTableName = SharedVars.dynamodb_table;
    alexaHandler.execute();
};
