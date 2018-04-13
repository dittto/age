'use strict';

const Response = require('../../../../Response/Response');

class CreditsMoreIntent {
    constructor (config, plugins) {
        this.config = config;
        this.plugins = plugins;
    }

    getName () {
        return 'CreditsMore';
    }

    process (slots) {
        const credits = this.config.get('start_menu').credits.list;
        const people = credits.people;
        const suffix = credits.suffix;
        const repeat = credits.repeat;
        const unmatched = credits.unmatched;
        const lowerCasePeople = JSON.parse(JSON.stringify(people).toLowerCase());
        const lowerCaseCredit = this.getSlotValue(slots.Credit);

        if (!!lowerCasePeople[lowerCaseCredit]) {
            const response = new Response()
                .setText(lowerCasePeople[lowerCaseCredit].description + ' ' + suffix, this.config.getState())
                .setRepeat(repeat);

            if (lowerCasePeople[lowerCaseCredit].image) {
                response.setImage(lowerCasePeople[lowerCaseCredit].image);
            }

            return response;
        }

        return new Response()
            .setText(unmatched, this.config.getState())
            .setRepeat(repeat);
    }

    getSlotValue(slotData) {
        if (slotData && slotData.resolutions && slotData.resolutions.resolutionsPerAuthority) {
            let result = null;
            slotData.resolutions.resolutionsPerAuthority.forEach(res => {
                if (res.values && res.values.length > 0) {
                    result = res.values[0].value.name.toLowerCase();
                }
            });
            return result;
        }

        if (slotData && slotData.value) {
            return slotData.value.toLowerCase();
        }

        return '';
    }
}

module.exports = CreditsMoreIntent;
