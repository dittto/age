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
        const singleCredits = this.config.get('start_menu').single_credit;
        const suffix = this.config.get('start_menu').single_credit_suffix;
        const repeat = this.config.get('start_menu').single_credit_repeat;
        const unmatched = this.config.get('start_menu').unmatched_single_credit;

        if (!!singleCredits[slots.Credit.value]) {
            return new Response()
                .setText(singleCredits[slots.Credit.value] + ' ' + suffix, this.config.getState())
                .setRepeat(repeat);
        }

        return new Response()
            .setText(unmatched, this.config.getState())
            .setRepeat(repeat);
    }
}

module.exports = CreditsMoreIntent;
