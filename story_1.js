'use strict';

function random(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function solution(session) {
    return session.number1 + "" + session.number2  + "" + session.number3;
}

module.exports = {
    "states": {
        "getContact": {
            "text": "Ist da jemand? Kannst du mich hören?",
            "expect": "booleanInput",
            "next": {
                "ja" : "intro",
                "nein": "joke"
            }
        },
        "joke": {
            "text": "Verarsch mich nicht <say-as interpret-as=\"expletive\">Mother Fucker</say-as>! Ich höre dich doch!!",
            "expect": "*",
            "next": "intro"
        },
        "intro": {
            "text": "Ich bin Börgi du bist die einzige Person die mir helfen kann. Wie heißt du?",
            "expect": "nameInput",
            "next": "story"
        },
        "story": {
            "text": function(session) {
                return "<say-as interpret-as=\"interjection\">" + session.name + "?</say-as> Gut das du da bist!!! Mir wurde ein Verbrechen angehängt. <break time=\"0.5s\"/> Jetzt sitze ich unschuldig im Gefängnis. Ich muss hier unbedingt raus. Ich konnte das Handy eines Wärters klauen und... Warte mal <break time=\"0.5s\"/> <amazon:effect name=\"whispered\"> Da kommt jemand, soll ich mich verstecken oder soll ich weglaufen? </amazon:effect>"
                // return "Hallo " + session.name + ". Story Story Story... Weglaufen oder Verstecken?";
            },
            "expect": "hideOrRunInput",
            "next": {
                "verstecken": "chooseRoom",
                "weglaufen": "endGame",
                "lauf weg": "endGame"
            }
        },
        "endGame": {
            "text": "Ok, ich lauf den Gang entlang und versuche nicht erwischt zu werden <break time=\"0.5s\"/> <emphasis level=\"strong\">Oh nein</emphasis>, der Wärter hat mich gesehen. Er kommt auf mich zu."
        },
        "chooseRoom": {
            "text": "Wähle Raum",
            "expect": "chooseRoomInput",
            "next": {
                "besenkammer": "guard",
                "heizungsraum": "guard",
                "wäschekorb": "endGame1"
            }
        },
        "endGame1": {
            "text": "<amazon:effect name=\"whispered\"> Hey!"  + return session.name +  "Ich glaube ich werde geschoben. <break time=\“1s\"/> </amazon:effect> Ich glaube die Luft ist rein. Oh nein! Der Wärter ist noch da. Er kommt auf mich zu!",
        },
        "guard": {
            "entryAction": function(session) {
                session.number1 = random(1, 10);
            },
            "text": function(session) {
                return "Du siehst die <say-as interpret-as=\"number\">" + session.number1 + "</say-as>. Willst du links oder rechts lang?";
            },
            "expect": "directionInput",
            "next": {
                "links": "talk",
                "rechts": "talk"
            }
        },
        "talk": {
            "text": "Möchtest du lauschen?",
            "expect": ["listenOrRunInput", "booleanInput"],
            "next": {
                "weitergehen": "story2",
                "gehe weiter": "story2",
                "nein": "story2",
                "lauschen": "listen",
                "horchen": "listen",
                "ja": "listen",
            }
        },
        "listen": {
            "entryAction": function(session) {
                session.number2 = random(0, 10);
            },
            "text": function(session) {
                return "Du belauschst die " + session.number2 + "... laufen";
            },
            "expect": "*",
            "next": "door"
        },
        "story2": {
            "entryAction": function(session) {session.number2 = 1;},
            "text": "Story... laufen",
            "expect": "*",
            "next": "door"
        },
        "door": {
            "entryAction": function (session) {
                if (typeof session.number3 === 'undefined') {
                    session.number3 = random(0, 10);
                }

                if (!session.try) {
                    session.try = 1;
                } else {
                    session.try++;
                }
            },
            "text": function (session) {
                return "Pinaufforderung ";
            },
            "expect": "pinInput",
            "next": {
                "true": "win",
                "false": "door",
                "dead": "lose"
            }
        },
        "win": {
            "text": "Herzlichen Glückwunsch"
        },
        "lose": {
            "text": function(session) {
                return "Verloren. Richtig wäre die " + solution(session) + " gewesen";
            },
        }
    },
    "intents": {
        "nameInput": function (intent, session) {
            session.name = intent.slots.name.value;
            return intent.slots.name.value.toLowerCase();
        },
        "booleanInput": function (intent, session) {
            return intent.slots.boolean.value.toLowerCase();
        },
        "hideOrRunInput": function(intent, session) {
            return intent.slots.hideOrRun.value.toLowerCase();
        },
        "directionInput": function(intent, session) {
            return intent.slots.direction.value.toLowerCase();
        },
        "chooseRoomInput": function(intent, session) {
            return intent.slots.chooseRoom.value.toLowerCase();
        },
        "listenOrRunInput": function(intent, session) {
            return intent.slots.listenOrRun.value.toLowerCase();
        },
        "pinInput": function (intent, session) {
            var guess = intent.slots.pin.value;
            var correct = solution(session);
            console.log(guess, correct);

            if (correct == guess) {
                return true;
            } else {
                if (session.try >= 3) {
                    return "dead";
                }
                return false;
            }
        }

    }

};