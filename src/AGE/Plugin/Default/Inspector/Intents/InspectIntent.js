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
        const itemOrObjectName = this.getSlotValue(slots.ItemOrObjectA);
        const inspectorDefaults = this.getConfig().getBaseConfig('default_responses').inspector;

        let response = new Response();
        if (!!inspectorDefaults && !!inspectorDefaults.image) {
            response.setImage(inspectorDefaults.image);
        }
        if (!!inspectorDefaults && !!inspectorDefaults.repeat) {
            response.setRepeat(inspectorDefaults.repeat);
        }

        const matchedItems = rooms.getItemsByName(itemOrObjectName);
        if (Object.keys(matchedItems).length > 0) {
            response = response.setText(matchedItems[Object.keys(matchedItems)[0]].description, state);
            if (matchedItems[Object.keys(matchedItems)[0]].image) {
                response.setImage(matchedItems[Object.keys(matchedItems)[0]].image);
            }
            if (matchedItems[Object.keys(matchedItems)[0]].repeat) {
                response.setRepeat(matchedItems[Object.keys(matchedItems)[0]].repeat);
            }
            this.setResponse(response);

            return;
        }

        const matchedObjects = rooms.getObjectsByName(itemOrObjectName);
        if (Object.keys(matchedObjects).length > 0) {
            response = response.setText(matchedObjects[Object.keys(matchedObjects)[0]].description, state);
            if (matchedObjects[Object.keys(matchedObjects)[0]].image) {
                response.setImage(matchedObjects[Object.keys(matchedObjects)[0]].image);
            }
            if (matchedObjects[Object.keys(matchedObjects)[0]].repeat) {
                response.setRepeat(matchedObjects[Object.keys(matchedObjects)[0]].repeat);
            }
            this.setResponse(response);

            return;
        }

        const items = rooms.getRoom().getRoomItems();
        const additionalItems = this.additionalItems;
        let isSet = false;
        Object.keys(additionalItems).forEach(itemName => {
            if (itemName.toLowerCase() === itemOrObjectName) {
                response = response.setText(items[itemName].description, state);
                if (items[itemName].image) {
                    response.setImage(items[itemName].image);
                }
                if (items[itemName].repeat) {
                    response.setRepeat(items[itemName].repeat);
                }
                this.setResponse(response);
                isSet = true;
            }
        });
        if (isSet) {
            return;
        }

        this.setResponse(response.setText(inspectorDefaults.failed, state));
    }
}

module.exports = InspectIntent;
