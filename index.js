"use strict";
var APP_ID = "amzn1.ask.skill.39e0b78f-145f-4f85-83c3-43afe76179b7";  // TODO replace with your app ID (OPTIONAL).


var Alexa = require("alexa-sdk");
var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).
var deviceId;

exports.handler = function(event, context, callback) {
    deviceId = event.context.System.device.deviceId;
    console.log("Device ID: " + deviceId);

    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageString;
    alexa.registerHandlers(newSessionHandlers, startStateHandlers, triviaStateHandlers, helpStateHandlers);
    alexa.execute();
};

var story = require("./story_1");
var sm = require("./sm/state")(story);
var Memcached = require("memcached");
var memcached = new Memcached('127.0.0.1:11211');

var newSessionHandlers = {
    "LaunchRequest": function () {
        // memcached.gets(getSessionKey(), function (err, data) {
            // sm.importState(data);
            sm.reset();
            var speechOutput = sm.getOutput();
            this.emit(":ask", speechOutput, speechOutput);   
        // });
        
    },
    "Unhandled": function () {
        var that = this;
        // memcached.gets(getSessionKey(), function (err, data) {
            console.log("Request: ", that.event.request);
            // console.log("SessionData", data);

            // sm.importState(data);
            var speechOutput = "";
            do {
                var res = sm.handleIntent(that.event.request.intent);
                speechOutput += sm.getOutput();
            } while (res == sm.STATES.AUTO);
            
            if (res == sm.STATES.DEFAULT) {
                // writeSession(sm.exportState(data));
                that.emit(":ask", speechOutput, speechOutput);
            } else if (res === sm.STATES.QUIT ){
                // writeSession(null);
                that.emit(":tell", speechOutput, speechOutput);
            }
            
        // });
    }
};

function writeSession(state) {
    memcached.set(getSessionKey(), state, 0, function (err) { 
        console.log(err);
    });
}

function getSessionKey() {
    return "session_" + deviceId;
}