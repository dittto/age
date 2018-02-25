'use strict';

function purgeDB(client, tableName)
{
    client.scan({
        TableName: tableName,
    }, (err, data) => {
        if (!err) {
            data.Items.forEach(obj => {
                const params = {
                    TableName: tableName,
                    Key: {'userId': {'S': obj['userId']['S']}}
                };

                client.deleteItem(params, (err, data) => {});
            });
        }
    });
}

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

    if (SharedVars.use_local_db == '1') {
        alexaHandler.dynamoDBClient = new AWS.DynamoDB({
            endpoint: new AWS.Endpoint('http://' + SharedVars.local_db_host + ':' + SharedVars.local_db_port)
        });

        if (SharedVars.purge_local_db == '1') {
            purgeDB(alexaHandler.dynamoDBClient, SharedVars.dynamodb_table);
        }
    }

    setTimeout(() => {
        alexaHandler.dynamoDBTableName = SharedVars.dynamodb_table;
        alexaHandler.execute();
    }, (SharedVars.use_local_db == '1' && SharedVars.purge_local_db == '1') ? 100 : 0);
};
