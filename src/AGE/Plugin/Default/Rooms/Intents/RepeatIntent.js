'use strict';

const BaseIntent = require('./BaseIntent');
const Response = require('../../../../Response/Response');

class RepeatIntent extends BaseIntent {
    constructor (config, plugins) {
        super(config, plugins);
    }

    getName () {
        return 'Repeat';
    }

    process (slots) {
        return this.getRoomsPlugin()
            .getRoom()
            .updateResponseWithDescription(new Response());
    }
}

module.exports = RepeatIntent;
