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
        const command = this.getSlotValue(slots.Command);

        return {'command': command};
    }
}

module.exports = SayIntent;
