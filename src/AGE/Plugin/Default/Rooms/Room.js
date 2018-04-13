'use strict';

class Room {
    constructor(config, data, roomChecks, roomDescriptionChecks, state) {
        this.config = config;
        this.data = data;
        this.roomChecks = roomChecks;
        this.roomDescriptionChecks = roomDescriptionChecks;
        this.state = state;
    }

    getIntentActions(intent, slotData) {
        const links = this.data.links;

        for (let i = 0; i < links.length; i ++) {
            if (this.__validateRoomLink(links[i].checks, this.state, intent, slotData)) {
                return links[i].actions;
            }
        }

        return null;
    }

    updateResponseWithDescription(response) {
        if (this.data.description) {
            response.setText(this.data.description, this.getState());
        }

        if (this.data.image) {
            response.setImage(this.data.image);
        }

        if (this.config.getBaseConfig('default_responses').room_repeat) {
            response.setRepeat(this.config.getBaseConfig('default_responses').room_repeat);
        }

        if (this.data.repeat) {
            response.setRepeat(this.data.repeat);
        }

        if (this.data.descriptions) {
            const count = this.data.descriptions.length;
            for (let i = count - 1; i >= 0; i --) {
                const descriptionData = this.data.descriptions[i];
                if (this.__isValidDescription(descriptionData)) {
                    if (descriptionData.description) {
                        response.setText(descriptionData.description, this.getState());
                    }

                    if (descriptionData.image) {
                        response.setImage(descriptionData.image);
                    }

                    if (descriptionData.repeat) {
                        response.setRepeat(descriptionData.repeat);
                    }

                    break;
                }
            }
        }

        if (this.data.is_game_over === true) {
            response.setIsQuestion(false);
        }

        return response;
    }

    getRoomItems() {
        const roomItems = {};
        const allItems = this.config.get('items');

        const items = this.data.items || {};
        Object.keys(items).forEach(key => {
            if (typeof (items[key].name) !== 'undefined') {
                roomItems[key] = items[key];
            }
            else if (key % 1 === 0 && typeof allItems[items[key]] !== 'undefined') {
                roomItems[items[key]] = allItems[items[key]];
            }
        });

        return roomItems;
    }

    getRoomObjects() {
        const roomObjs = [];

        const objs = this.data.objects;
        Object.keys(objs).forEach(key => {
            if (typeof (objs[key].name) !== 'undefined') {
                roomObjs[key] = objs[key];
            }
        });

        return roomObjs;
    }

    getState() {
        return this.state;
    }

    getRoomData() {
        return this.data;
    }

    getForceLinkActions() {
        return this.data.force_link || null;
    }

    __validateRoomLink(linkData, state, intent, slotData) {
        let isValid = true;

        Object.keys(linkData).forEach(field => {
            if (!this.roomChecks[field]) {
                throw Error("Room check '" + field + "' doesn't exist");
            }

            if (!this.roomChecks[field].check(linkData[field], state, intent, slotData)) {
                isValid = false;
            }
        });

        return isValid;
    }

    __isValidDescription(data) {
        let isValid = true;

        Object.keys(data).forEach(key => {
            if (key === 'description' || key === 'image' || key === 'repeat') {
                return;
            }

            if (!this.roomDescriptionChecks[key]) {
                throw Error("Missing room description '" + key + "'");
            }

            if (!this.roomDescriptionChecks[key].check(data[key], this.state)) {
                isValid = false;
            }
        });

        return isValid;
    }
}

module.exports = Room;