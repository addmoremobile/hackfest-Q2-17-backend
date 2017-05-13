"use strict";

var story = require("./story_1");

var sm = require("./sm/state")(story);

var scenario = require("./scenario")["first"];

console.log(sm.getOutput());

// alexa request
// session id> asdklfja;klsdjf;kalj
// state: memache <- sessoin id
// sm.importState(state)
// handleIntnet(REQUEST.intent)
// output
// memcache <- exportState
// response(output)

for (var i in scenario) {
    var intent = scenario[i];

    do {
        // Intent aus dem Alexa Request an die SM weiterreichen

        var result = sm.handleIntent(intent);
        // Was soll Alexa sagen?
        console.log(sm.getOutput());
        // Sonderregelung. Wenn keine Benutzerinteraktion erwartet wird,
        // müssen wir den State Übergang selbst machen. Wir machen so lange
        // alleine weiter, bis wieder eine Interkation erwartet wird.
        // STATES.DEFAULT signalisiert Interatkion
        // STATES.QUIT signalisiert das Ende des Spiels
        intent = "*";
    } while (result == sm.STATES.AUTO);
}