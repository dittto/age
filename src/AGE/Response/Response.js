'use strict';

class Response {

    constructor() {
        this.private = {
            autoStateRedirect: '',
            isQuestion: true,
            image: null,
            text: '',
            textByState: {},
            ignoreTextForState: [],
            repeat: '',
            statementType: ':tell',
            questionType: ':ask'
        };
    }

    setAutoStateRedirect(state) {
        this.private.autoStateRedirect = state;

        return this;
    }

    getAutoStateRedirect() {
        return this.private.autoStateRedirect;
    }

    setText(text, state = null) {
        this.private.text = text;

        if (state === null) {
            state = '';
        }
        this.private.textByState[state] = text;

        return this;
    }

    getText() {
        let text = '';

        Object.keys(this.private.textByState).forEach(state => {
            if (this.private.ignoreTextForState.indexOf(state) === -1) {
                text += this.private.textByState[state] + ' ';
            }
        });

        return text;
    }

    setRepeat(repeat) {
        this.private.repeat = repeat;

        return this;
    }

    getRepeat() {
        return this.private.repeat;
    }

    setIsQuestion(isQuestion) {
        this.private.isQuestion = isQuestion;
    }

    getIsQuestion() {
        return this.private.isQuestion;
    }

    setIgnoreTextForState(state) {
        this.private.ignoreTextForState.push(state);
    }

    setImage(imageName) {
        this.private.image = imageName;

        return this;
    }

    getImage() {
        return this.private.image;
    }

    hasImage() {
        return this.private.image !== null;
    }
}

module.exports = Response;