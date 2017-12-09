'use strict';

const BaseIntent = require('./BaseIntent');
const Response = require('../../../../Response/Response');

class MoveIntent extends BaseIntent {
    constructor (config, plugins) {
        super(config, plugins);
    }

    getName () {
        return 'Move';
    }

    processSlots (rooms, slots) {
        const direction = slots.Direction && slots.Direction.value ? slots.Direction.value.toLowerCase() : '';

        return {'direction': direction};
    }
}

module.exports = MoveIntent;
