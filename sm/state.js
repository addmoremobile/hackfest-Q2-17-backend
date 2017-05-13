'use strict';

module.exports = function (config) {
    return {
        STATES: {
            DEFAULT: 0,
            QUIT: 1,
            AUTO: 2
        },
        states: config.states,
        intents: config.intents,
        session: {},
        currentState: Object.keys(config.states)[0],
        reset: function() {
            this.session = {};
            this.currentState = Object.keys(config.states)[0];
            // this.currentState = "listen";
            // this.session = {number1: 0, number2: 5, number3 : 7, name: "krabat"};
        },
        getOutput: function () {
            var current = this.states[this.currentState];

            if (typeof current.text === "string") {
                return current.text;
            } else if (typeof current.text === "function") {
                return current.text(this.session);
            }

        },
        handleIntent: function (intent) {
            console.log(intent);
            var current = this.states[this.currentState];

            if (typeof current.expect === "string") {
                current.expect = [current.expect];
            }
            //console.log(current);
            for (var i in current.expect) {
                var expect = current.expect[i];

                if (expect === intent.name || expect === "*") {
                    //console.log(expect);
                    if (this.intents[intent.name]) {
                        console.log("IntentSlots", intent.slots);

                        var next = this.intents[intent.name](intent, this.session);

                        if (typeof current.next === "string") {
                            this.currentState = current.next;
                        } else if (typeof current.next === "object") {
                            this.currentState = current.next[next];
                        }

                        if (this.states[this.currentState].entryAction) {
                            this.states[this.currentState].entryAction(this.session);
                        }
                    } else if (intent == "*") {
                        this.currentState = current.next;
                        if (this.states[this.currentState].entryAction) {
                            this.states[this.currentState].entryAction(this.session);
                        }
                    }

                    if (this.states[this.currentState].expect == "*") {
                        return this.STATES.AUTO;
                    }
                    if (this.states[this.currentState].next) {
                        return this.STATES.DEFAULT;
                    }
                }
            }
            if (!this.states[this.currentState].next) {
                return this.STATES.QUIT;
            }
        }
    }
};