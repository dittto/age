'use strict';

const BaseIntent = require('./BaseIntent');
const Response = require('../../../../Response/Response');

class UseIntent extends BaseIntent {
    constructor (config, plugins) {
        super(config, plugins);
    }

    getName () {
        return 'Use';
    }

    processSlots (rooms, slots) {
        let itemOrObjects = [];
        if (slots.ItemOrObjectA && slots.ItemOrObjectA.value) {
            itemOrObjects.push(slots.ItemOrObjectA.value);
        }
        if (slots.ItemOrObjectB && slots.ItemOrObjectB.value) {
            itemOrObjects.push(slots.ItemOrObjectB.value);
        }

        return {'item_or_object': rooms.getItemsOrObjectsByName(itemOrObjects)};
    }
}

module.exports = UseIntent;
