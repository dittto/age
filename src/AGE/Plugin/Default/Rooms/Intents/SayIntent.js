'use strict';

const BaseIntent = require('./BaseIntent');
const Response = require('../../../../Response/Response');

class SayIntent extends BaseIntent {
    constructor (config, plugins) {
        super(config, plugins);
    }

    getName () {
        return 'Say';
    }

    processSlots (rooms, slots) {
        const command = slots.Command && slots.Command.value ? slots.Command.value.toLowerCase() : '';

        return {'command': command};
    }
}

module.exports = SayIntent;
