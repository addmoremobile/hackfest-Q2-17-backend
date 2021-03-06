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
            "text": "Verarsch mich nicht du <say-as interpret-as=\"expletive\">Mother Fucker</say-as>! Ich höre dich doch!!",
            "expect": "*",
            "next": "intro"
        },
        "intro": {
            "text": "Ich bin Bony. Du bist die einzige Person die mir helfen kann. Wie heißt du?",
            "expect": "nameInput",
            "next": "story"
        },
        "story": {
            "text": function(session) {
                return "<say-as interpret-as=\"interjection\">" + session.name + "?</say-as> Gut das du da bist!!! Mir wurde ein Verbrechen angehängt. <break time=\"0.5s\"/> Jetzt sitze ich unschuldig im Gefängnis. Ich muss hier unbedingt raus. Zum Glück konnte ich das Handy eines Wärters klauen und... Warte mal <break time=\"0.5s\"/> <amazon:effect name=\"whispered\"> Da kommt jemand, soll ich mich verstecken oder soll ich weglaufen? </amazon:effect>"
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
            "text": "Ok, ich lauf den Gang entlang und versuche nicht erwischt zu werden <break time=\"0.5s\"/> <emphasis level=\"strong\">Oh nein</emphasis>, der Wärter hat mich gesehen. Er kommt auf mich zu.",
            "expect": "*",
            "next": "statelessLose"
        },
        "chooseRoom": {
            "text": "<amazon:effect name=\"whispered\">Wo soll ich mich verstecken? Hier steht ein Wäschewagen. Da vorne ist eine Tür die in eine Besenkammer führt und weiter hinten ist ein Heizungsraum.</amazon:effect>",
            "expect": "chooseRoomInput",
            "next": {
                "besenkammer": "guard",
                "heizungsraum": "guard",
                "wäschekorb": "endGame1"
            }
        },
        "endGame1": {
            "text": function (session) {
                return "<amazon:effect name=\"whispered\"> Hey!"  + session.name +  "Ich glaube ich werde geschoben. <break time=\"0.5s\"/> </amazon:effect> Ich glaube die Luft ist rein. Oh nein! Der Wärter ist noch da. Er kommt auf mich zu!";
            },
            "expect": "*",
            "next": "statelessLose"
        },
        "guard": {
            "entryAction": function(session) {
                session.number1 = random(1, 10);
            },
            "text": function(session) {
                return "Ok der Wärter ist vorbeigegangen. Er öffnet eine Tür mit einem Code. Ich konnte sehen wie er die erste Nummer des Pins eingegeben hat. Es war die Ziffer: " + session.number1 + ". <break time=\"0.5s\"/> Ok, ich gehe dann weiter <break time=\"1s\"/> Hier gabelt sich der Weg " + session.name + ", soll ich links oder rechts weitergehen?";
            },
            "expect": "directionInput",
            "next": {
                "links": "talk",
                "rechts": "talk"
            }
        },
        "talk": {
            "entryAction": function(session) {
                session.number2 = random(0, 10);
            },
            "text": "Jetzt bin ich in der Nähe des Wärter Pausenraumes. Ich höre zwei Wärter. Soll ich einfach weitergehen oder lauschen was sie sagen?",
            "expect": ["listenOrRunInput", "booleanInput"],
            "next": {
                "weitergehen": "idletime",
                "gehe weiter": "idletime",
                "nein": "idletime",
                "lauschen": "listen",
                "horchen": "listen",
                "ja": "listen",
            }
        },
        "listen": {
            "text": function(session) {
                return "Ich höre den Wärtern zu. Sie reden über ihren letzten Campingausflug. Der eine Wärter fragt den anderen nach dem neuen Code. Ich habe nur die Zahl <say-as interpret-as=\"number\">" + session.number2 + "</say-as>. gehört. Ich weiß aber nicht an welcher Position des Codes sie steht.";
            },
            "expect": "*",
            "next": "story2"
        },
        "idletime": {
            "text": "Ok ich bin an den Wärtern vorbei gekommen.",
            "expect": "*",
            "next": "story2"
        },
        "story2": {
            "entryAction": function(session) {
                session.number3 = random(0, 10);
            },
            "text": function (session) {
                return "Ich gehe weiter. Da vorne ist die Tür durch die ich gekommen bin als ich hier eingesperrt wurde. Da muss ich durch, dann bin ich frei. <break time=\"1s\"/> Um hier raus zu kommen muss ich einen dreistelligen Code eingeben. Auf der <say-as interpret-as=\"number\">" + session.number3 + "</say-as>. ist ein Ketchup Fleck. Einer der Wärter muss die Taste nach dem Mittagessen beschmiert haben . Jetzt muss ich den Code eingeben.";
            },
            "expect": "*",
            "next": "door"
        },
        "door": {
            "entryAction": function (session) {
                if (!session.try) {
                    session.try = 1;
                } else {
                    session.try++;
                }
            },
            "text": function (session) {
                if (session.try == 1) { 
                    return "Welchen Code soll ich eingeben?";
                } else if (session.try == 2) {
                    return "Verdammt, das war falsch!";
                } else if (session.try == 3) {
                    return "Mist, wieder falsch. Letzter Versuch! Gib dir Mühe!";
                }
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
        },
        "statelessLose": {
            "text": function(session) {
                return "Das Spiel ist aus. Bony wurde erwischt!";
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
            if (guess.length == 3) {
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
            } else {
                return 3;
            }
        }

    }

};