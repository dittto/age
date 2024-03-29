'use strict';

const BaseIntent = require('./BaseIntent');
const Response = require('../../../../Response/Response');

class PullIntent extends BaseIntent {
    constructor (config, plugins) {
        super(config, plugins);
    }

    getName () {
        return 'Pull';
    }

    processSlots (rooms, slots) {
        const obj = slots.Object && slots.Object.value ? slots.Object.value.toLowerCase() : '';

        return {'object': rooms.getObjectsByName([obj])};
    }
}

module.exports = PullIntent;
