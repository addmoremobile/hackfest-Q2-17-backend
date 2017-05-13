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
            "text": "Haha, du Witzbold. Ich kann dich doch hören.",
            "expect": "*",
            "next": "intro"
        },
        "intro": {
            "text": "Handy geklaut... Pause... Nummer gespeichert. Wie ist dein Name?",
            "expect": "nameInput",
            "next": "story"
        },
        "story": {
            "text": function(session) {
                return session.name + ", Mir wurde ein Verbrechen angehängt. <break time=\"1s\"/> Jetzt sitze ich unschuldig im Gefängnis. Ich muss hier unbedingt raus. Ich konnte das Handy eines Wärter <amazon:effect name=\"whispered\">Warte da kommt jemand, soll ich mich Verstecken oder soll ich weglaufen? </amazon:effect>";
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
            "text": "Spiel zuende",
        },
        "chooseRoom": {
            "text": "Wähle Raum",
            "expect": "chooseRoomInput",
            "next": {
                "besenkammer": "guard",
                "heizungsraum": "guard",
                "wäschekorb": "endGame"
            }
        },
        "guard": {
            "entryAction": function(session) {
                session.number1 = random(0, 10);
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
            "expect": "listenOrRunInput",
            "next": {
                "weitergehen": "story2",
                "gehe weiter": "story2",
                "lauschen": "listen",
                "horchen": "listen",
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