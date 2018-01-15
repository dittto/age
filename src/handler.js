'use strict';

module.exports.age = function (event, context, callback) {
    const AGE = require('./AGE'),
        AWS = require('aws-sdk'),
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

    if (SharedVars.use_local_db) {
        alexaHandler.dynamoDBClient = new AWS.DynamoDB({
            endpoint: new AWS.Endpoint('http://' + SharedVars.local_db_host + ':' + SharedVars.local_db_port)
        });
    }

    alexaHandler.dynamoDBTableName = SharedVars.dynamodb_table;
    alexaHandler.execute();
};
