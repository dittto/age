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

    processUnhandledError(originalSlots, processedSlots, response) {
        let itemOrObjects = [];
        if (originalSlots.ItemOrObjectA && originalSlots.ItemOrObjectA.value) {
            itemOrObjects.push(originalSlots.ItemOrObjectA.value);
        }
        if (originalSlots.ItemOrObjectB && originalSlots.ItemOrObjectB.value) {
            itemOrObjects.push(originalSlots.ItemOrObjectB.value);
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
