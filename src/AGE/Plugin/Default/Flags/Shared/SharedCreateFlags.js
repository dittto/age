'use strict';

class SharedCreateFlags {
    constructor(config, plugins, flagsPlugin) {
        this.config = config;
        this.plugins = plugins;
        this.flagsPlugin = flagsPlugin;
    }

    createFlagData(flagData) {
        const result = {};

        if (typeof flagData === 'string') {
            result[flagData] = {set: 0};

            return result;
        }

        if (Array.isArray(flagData)) {
            flagData.forEach(flagName => {
                result[flagName] = {set: 0};
            });

            return result;
        }

        return flagData;
    }

    updateFlags(flagData, stateName = null) {
        Object.keys(flagData).forEach(flagName => {
            if (typeof flagData[flagName].set !== 'undefined') {
                this.flagsPlugin.addFlag(flagName, flagData[flagName].set, stateName);
            }
            if (typeof flagData[flagName].increment !== 'undefined') {
                this.flagsPlugin.updateFlag(flagName, flagData[flagName].increment, stateName);
            }
            if (typeof flagData[flagName].decrement !== 'undefined') {
                this.flagsPlugin.updateFlag(flagName, flagData[flagName].decrement * -1, stateName);
            }
        });
    }
}

module.exports = SharedCreateFlags;