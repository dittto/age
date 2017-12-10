'use strict';

const BaseIntent = require('../../Rooms/Intents/BaseIntent');
const Response = require('../../../../Response/Response');

class InspectIntent extends BaseIntent {
    constructor (config, plugins, additionalItems) {
        super(config, plugins);
        this.additionalItems = additionalItems;
    }

    getName () {
        return 'Inspect';
    }

    processSlots (rooms, slots) {
        const state = this.getConfig().getState();
        const itemOrObjectName = slots.ItemOrObjectA.value.toLowerCase();

        let response = new Response();
        if (this.getConfig().getBaseConfig('default_responses').inspector_repeat) {
            response.setRepeat(this.getConfig().getBaseConfig('default_responses').inspector_repeat);
        }

        const matchedItems = rooms.getItemsByName(itemOrObjectName);
        if (Object.keys(matchedItems).length > 0) {
            response = response.setText(matchedItems[Object.keys(matchedItems)[0]].description, state);
            if (matchedItems[Object.keys(matchedItems)[0]].repeat) {
                response.setText(matchedItems[Object.keys(matchedItems)[0]].repeat, state);
            }
            this.setResponse(response);

            return;
        }

        const matchedObjects = rooms.getObjectsByName(itemOrObjectName);
        if (Object.keys(matchedObjects).length > 0) {
            response = response.setText(matchedObjects[Object.keys(matchedObjects)[0]].description, state);
            if (matchedObjects[Object.keys(matchedObjects)[0]].repeat) {
                response.setText(matchedObjects[Object.keys(matchedObjects)[0]].repeat, state);
            }
            this.setResponse(response);

            return;
        }

        const items = rooms.getRoom().getRoomItems();
        const additionalItems = this.additionalItems;
        Object.keys(additionalItems).forEach(itemName => {
            if (itemName.toLowerCase() === itemOrObjectName) {
                response = response.setText(items[itemName].description, state);
                if (items[itemName].repeat) {
                    response.setText(items[itemName].repeat, state);
                }
                this.setResponse(response);
            }
        });

        this.setResponse(response.setText(this.getConfig().getBaseConfig('default_responses').failed_inspect, state));
    }
}

module.exports = InspectIntent;
