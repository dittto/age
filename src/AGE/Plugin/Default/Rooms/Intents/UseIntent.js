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
        if (slots.ItemOrObject1 && slots.ItemOrObject1.value) {
            itemOrObjects.push(slots.ItemOrObject1.value);
        }
        if (slots.ItemOrObject2 && slots.ItemOrObject2.value) {
            itemOrObjects.push(slots.ItemOrObject2.value);
        }

        return {'item_or_object': rooms.getItemsOrObjectsByName(itemOrObjects)};
    }
}

module.exports = UseIntent;
