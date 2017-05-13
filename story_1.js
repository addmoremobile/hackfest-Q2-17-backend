'use strict';

function random(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function solution(session) {
    return session.number1 + "" + session.number2  + "" + session.number3;
}

module.exports = {
    "states": {
        "intro": {
            "text": "Handy geklaut... Pause... Nummer gespeichert. Wie ist dein Name?",
            "expect": "nameInput",
            "next": "story"
        },
        "story": {
            "text": function(session) {
                return "Hallo " + session.name + ". Story Story Story... Weglaufen oder Verstecken?";
            },
            "expect": "hideOrRunInput",
            "next": {
                "verstecken": "chooseRoom",
                "weglaufen": "endGame",
                "lauf weg": "endGame"
            }
        },
        "endGame": {
            "text": "Spiel zuende",
        },
        "chooseRoom": {
            "text": "Wähle Raum",
            "expect": "chooseRoomInput",
            "next": {
                "Besenraum": "guard",
                "Heizungsraum": "guard",
                "Wäschewagen": "endGame"
            }
        },
        "guard": {
            "entryAction": function(session) {
                session.number1 = random(0, 10);
            },
            "text": function(session) {
                return "Du siehst die " + session.number1;
            },
            "expect": "directionInput",
            "next": {
                "links": "talk",
                "rechts": "talk"
            }
        },
        "talk": {
            "text": "Möchtest du lauschen?",
            "expect": "listenOrRunInput",
            "next": {
                "listen": "listen",
                "run": "story2"
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
                session.number3 = random(0, 10);
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
            return intent.slots.name.value;
        },
        "hideOrRunInput": function(intent, session) {
            return intent.slots.hideOrRun.value;
        },
        "directionInput": function(intent, session) {
            return intent.slots.direction.value;
        },
        "chooseRoomInput": function(intent, session) {
            return intent.slots.chooseRoom.value;
        },
        "listenOrRunInput": function(intent, session) {
            return intent.slots.listenOrRun.value;
        },
        "pinInput": function (intent, session) {
            var guess = intent.slots.pin.value;
            var correct = solution(session);
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