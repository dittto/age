'use strict';

const Response = require('../../Response/Response');
const Room = require('./Rooms/Room');

const CheckIntent = require('./Rooms/Checks/CheckIntent');
const DescriptionAction = require('./Rooms/Actions/DescriptionAction');
const ImageAction = require('./Rooms/Actions/ImageAction');
const LinkAction = require('./Rooms/Actions/LinkAction');
const Intents = require('./Rooms/Intents');

class Rooms {
    /**
     * The constructor for this plugin
     *
     * @param {Config} config   The config object
     */
    constructor(config) {
        this.config = config;
        this.rooms = this.config.get('rooms');
        this.roomChecks = {};
        this.roomActions = {};
        this.roomDescriptionChecks = {};

        this.genericIntents = [];
        this.itemCallbacks = [];
        this.objectCallbacks = [];
        this.resetCallbacks = [];
    }

    /**
     * The name of the plugin
     *
     * @returns {string}
     */
    getName() {
        return Rooms.name();
    }

    /**
     * The name of the plugin
     *
     * @returns {string}
     */
    static name() {
        return 'rooms';
    }

    /**
     * Stores the plugin object here for easy access into other plugins
     *
     * @param {Plugins} plugins     The plugins object
     */
    setPlugins(plugins) {
        this.plugins = plugins;

        this.addRoomCheck(new CheckIntent(this.config, this.plugins));

        this.addRoomAction(new DescriptionAction(this.config, this.plugins));
        this.addRoomAction(new ImageAction(this.config, this.plugins));
        this.addRoomAction(new LinkAction(this.config, this.plugins));

        this.addGenericIntent(new Intents.Continue(this.config, this.plugins));
        this.addGenericIntent(new Intents.Help(this.config, this.plugins));
        this.addGenericIntent(new Intents.InitialLaunch(this.config, this.plugins));
        this.addGenericIntent(new Intents.Repeat(this.config, this.plugins));
        this.addGenericIntent(new Intents.Unhandled(this.config, this.plugins));
    }

    getStates() {
        const states = {};

        Object.keys(this.rooms).forEach(state => {
            const stateIntents = {};
            this.genericIntents.forEach(intent => {
                stateIntents[intent.getName() + intent.getNameSuffix()] = intent;
            });

            const links = this.rooms[state].links || [];
            links.forEach(link => {
                const intents = link.checks && link.checks.intents || [];
                intents.forEach(intent => {
                    if (typeof Intents[intent.intent] !== 'undefined') {
                        stateIntents[intent.intent + "Intent"] = new Intents[intent.intent](this.config, this.plugins);
                    }

                    if (typeof stateIntents[intent.intent + "Intent"] === 'undefined') {
                        throw Error('Cannot find intent "' + intent.intent + '"');
                    }
                });
            });

            states[state] = stateIntents;
        });

        return states;
    }

    getRoom() {
        return this.__buildRoom(this.config.getState());
    }

    runActions(response, actions) {
        return this.__runActions(response, actions);
    }

    /**
     * Adds a room check to the store. These are used by links[x].checks to confirm a link is valid.
     *
     * @param {Object} check    An object that conforms to the Rooms.Checks.* objects
     */
    addRoomCheck(check) {
        this.roomChecks[check.getName()] = check;
    }

    addRoomAction(action) {
        this.roomActions[action.getName()] = action;
    }

    addRoomDescriptionCheck(check) {
        this.roomDescriptionChecks[check.getName()] = check;
    }

    addItemCallback(callback) {
        this.itemCallbacks.push(callback);
    }

    addObjectCallback(callback) {
        this.objectCallbacks.push(callback);
    }

    addResetCallback(callback) {
        this.resetCallbacks.push(callback);
    }

    addGenericIntent(intent) {
        this.genericIntents.push(intent);
    }

    getItemsOrObjectsByName(names) {
        return Object.assign({}, this.getItemsByName(names), this.getObjectsByName(names));
    }

    getItemsByName(names) {
        const room = this.getRoom();
        const allowedRoomItems = room.getRoomItems();
        let allowedData = {};

        names = Array.isArray(names) ? names : [names];

        for (let i = 0; i < names.length; i++) {
            const itemKey = this.getItemKeyByName(names[i]);

            if (itemKey === null) {
                continue;
            }

            if (typeof allowedRoomItems[itemKey] !== 'undefined') {
                allowedData[itemKey] = allowedRoomItems[itemKey];
                continue;
            }

            this.itemCallbacks.forEach(callback => {
                const callbackResult = callback(itemKey, room.getState());
                if (Object.keys(callbackResult).length > 0) {
                    allowedData = Object.assign({}, allowedData, callbackResult);
                }
            });
        }

        return allowedData;
    }

    getObjectsByName(names) {
        const room = this.getRoom();
        const allowedRoomObjects = room.getRoomObjects();
        let allowedData = {};

        names = Array.isArray(names) ? names : [names];

        for (let i = 0; i < names.length; i++) {
            let isAllowed = false;

            Object.keys(allowedRoomObjects).forEach(itemKey => {
                if (allowedRoomObjects[itemKey].name.toLowerCase() === names[i].toLowerCase()) {
                    isAllowed = true;
                    allowedData[itemKey] = allowedRoomObjects[itemKey];
                }
            });

            if (!isAllowed) {
                this.objectCallbacks.forEach(callback => {
                    const callbackResult = callback(names[i], room.getState());
                    if (Object.keys(callbackResult).length > 0) {
                        allowedData = Object.assign({}, allowedData, callbackResult);
                    }
                });
            }
        }

        return allowedData;
    }

    getItemKeyByName(itemName) {
        const roomItems = this.getRoom().getRoomItems();
        let key = null;

        Object.keys(roomItems).forEach(itemKey => {
            if (roomItems[itemKey].name.toLowerCase() === itemName.toLowerCase()) {
                key = itemKey;
            }
        });

        return key;
    }

    processResponse(response, state) {
        const room = this.__buildRoom(state);
        response = room.updateResponseWithDescription(response);

        // reset the state so unless force link triggers, there are no more state changes
        this.config.setState(state);

        if (room.getForceLinkActions() !== null) {
            response = this.runActions(response, room.getForceLinkActions());
        }

        if (!response.getIsQuestion()) {
            // trigger twice so state isn't flagged as changed
            this.config.setState('');
            this.config.setState('');
            const rooms = this.plugins.get(Rooms.name());
            rooms.reset();

            response.setText(this.config.getGameOverText());
        }

        return response;
    }

    reset() {
        this.resetCallbacks.forEach(callback => {
            callback();
        });
    }

    getItem(itemKey) {
        const roomItems = this.getRoom().getRoomItems();

        return typeof roomItems[itemKey] !== 'undefined' ? roomItems[itemKey] : null;
    }

    /**
     * Builds a room by matching the supplied state to the config for the rooms
     *
     * @param {String} state    The name of the state to build a room for, e.g. 501
     * @returns {Room}
     */
    __buildRoom(state) {
        if (!this.rooms[state]) {
            throw Error("Room '" + state + "' not found");
        }

        return new Room(this.config, this.rooms[state], this.roomChecks, this.roomDescriptionChecks, state, this.config.default_responses || {});
    }

    __runActions(response, actions) {
        Object.keys(actions).forEach(action => {
            if (!this.roomActions[action]) {
                throw Error("Room action '" + action + "' not found");
            }
            response = this.roomActions[action].run(response, actions[action]);
        });

        return response;
    }
}

module.exports = Rooms;
