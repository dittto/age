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
        const itemA = this.getSlotValue(slots.ItemOrObjectA);
        if (itemA) {
            itemOrObjects.push(itemA);
        }

        const itemB = this.getSlotValue(slots.ItemOrObjectB);
        if (itemB) {
            itemOrObjects.push(itemB);
        }

        return {'item_or_object': rooms.getItemsOrObjectsByName(itemOrObjects)};
    }

    processUnhandledError(originalSlots, processedSlots, response) {
        let itemOrObjects = [];
        const itemA = this.getSlotValue(originalSlots.ItemOrObjectA);
        if (itemA) {
            itemOrObjects.push(itemA);
        }

        const itemB = this.getSlotValue(originalSlots.ItemOrObjectB);
        if (itemB) {
            itemOrObjects.push(itemB);
        }

        const defaultResponses = this.config.getBaseConfig('default_responses').use || {};
        if (itemOrObjects.length === 1 && !!defaultResponses.failed && !!defaultResponses.failed.solo) {
            response.setText(defaultResponses.failed.solo.replace(/:itemNameA/, itemOrObjects[0]));
        }
        if (itemOrObjects.length === 2 && !!defaultResponses.failed && !!defaultResponses.failed.dual) {
            response.setText(defaultResponses.failed.dual.replace(/:itemNameA/, itemOrObjects[0]).replace(/:itemNameB/, itemOrObjects[1]));
        }

        return response;
    }
}

module.exports = UseIntent;
