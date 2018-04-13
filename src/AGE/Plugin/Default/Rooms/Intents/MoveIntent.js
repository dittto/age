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
        const direction = this.getSlotValue(slots.Direction);

        return {'direction': direction};
    }
}

module.exports = MoveIntent;
