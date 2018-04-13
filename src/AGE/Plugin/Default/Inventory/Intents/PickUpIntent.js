'use strict';

const BaseIntent = require('../../Rooms/Intents/BaseIntent');
const Response = require('../../../../Response/Response');

class PickUpIntent extends BaseIntent {
    constructor (config, plugins) {
        super(config, plugins);
    }

    getName () {
        return 'PickUp';
    }

    processSlots (rooms, slots) {
        const itemName = this.getSlotValue(slots.ItemOrObjectA);
        const state = this.getConfig().getState();

        // item has to be in the current room
        const roomItems = rooms.getItemsByName(itemName);
        if (Object.keys(roomItems).length === 0) {
            this.setResponse(this.__returnFailedResponse(itemName, state));

            return;
        }
        const itemKey = Object.keys(roomItems)[0];

        // item has to not be in the inventory already
        const inventoryPlugin = require('../../Inventory');
        const inventory = this.getPlugin(inventoryPlugin.name());
        if (inventory.hasItem(itemKey)) {
            this.setResponse(this.__returnAlreadyHaveResponse(itemName, state));

            return;
        }

        return {'item_or_object': roomItems};
    }

    __returnFailedResponse(itemName, state) {
        const response = new Response();

        const failed = this.getConfig().getBaseConfig('default_responses').pickup.failed;

        if (failed && failed.description) {
            response.setText(failed.description.replace(':itemName', itemName), state);
        }

        if (failed && failed.image) {
            response.setText(failed.image);
        }

        if (failed && failed.repeat) {
            response.setRepeat(failed.repeat.replace(':itemName', itemName));
        }

        return response;
    }

    __returnAlreadyHaveResponse(itemName, state) {
        const response = new Response();

        const already = this.getConfig().getBaseConfig('default_responses').pickup.already;

        if (already && already.description) {
            response.setText(already.description.replace(':itemName', itemName), state);
        }

        if (already && already.image) {
            response.setImage(already.image);
        }

        if (already && already.repeat) {
            response.setRepeat(already.repeat.replace(':itemName', itemName));
        }

        return response;
    }
}

module.exports = PickUpIntent;
