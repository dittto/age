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

        if (!!people[slots.Credit.value]) {
            return new Response()
                .setText(people[slots.Credit.value] + ' ' + suffix, this.config.getState())
                .setRepeat(repeat);
        }

        return new Response()
            .setText(unmatched, this.config.getState())
            .setRepeat(repeat);
    }
}

module.exports = CreditsMoreIntent;
