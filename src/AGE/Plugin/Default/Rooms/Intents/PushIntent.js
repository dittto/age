'use strict';

const BaseIntent = require('./BaseIntent');
const Response = require('../../../../Response/Response');

class PushIntent extends BaseIntent {
    constructor (config, plugins) {
        super(config, plugins);
    }

    getName () {
        return 'Push';
    }

    processSlots (rooms, slots) {
        const obj = this.getSlotValue(slots.Object);

        return {'object': rooms.getObjectsByName([obj])};
    }
}

module.exports = PushIntent;
