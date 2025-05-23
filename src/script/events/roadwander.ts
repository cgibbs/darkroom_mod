/**
 * Events that can occur when the Road module is active
 **/
import { Engine } from "../engine";
import { $SM } from "../state_manager";
import { _ } from "../../lib/translate";
import { Character } from "../player/character";
import { Outpost } from "../places/outpost";
import { Road } from "../places/road";
import { ADREvent } from "../events";

export const EventsRoadWander: Array<ADREvent> = [
    // Stranger bearing gifts
    {
        title: _('A Stranger Beckons'),
        isAvailable: function() {
            return Engine.activeModule == Road;
        },
        scenes: {
            'start': {
                text: [
                    _('As you wander along the road, a hooded stranger gestures to you. He doesn\'t seem interested in hurting you.'),
                    _('What do you do?')
                ],
                buttons: {
                    'closer': {
                        text: _('Draw Closer'),
                        nextScene: {1: 'closer'}
                    },
                    'leave': {
                        text: _('Get Outta There'),
                        nextScene: {1: 'leave'}
                    }
                }
            },
            'closer': {
                text: [
                    _('You move toward him a bit and stop. He continues to beckon.'),
                    _('What do you do?')
                ],
                buttons: {
                    'evenCloser': {
                        text: _('Draw Even Closer'),
                        nextScene: {1: 'evenCloser'}
                    },
                    'leave': {
                        text: _('Nah, This is Too Spooky'),
                        nextScene: {1: 'leave'}
                    }
                }
            },
            'evenCloser': {
                text: [
                    _('You hesitantly walk closer.'),
                    _('As soon as you get within arms\' reach, he grabs your hand with alarming speed.'),
                    _('He quickly places an object in your hand, then leaves wordlessly.')
                ],
                onLoad: function() {
                    // maybe some logic to make repeats less likely?
                    const possibleItems = [
                        'Stranger.smoothStone',
                        'Stranger.wrappedKnife',
                        'Stranger.clothBundle',
                        'Stranger.coin'
                    ];
                    const item = possibleItems[Math.floor(Math.random() * possibleItems.length)];
                    Character.addToInventory(item);
                },
                buttons: {
                    'okay': {
                        text: _('Thanks, I guess?'),
                        nextScene: 'end'
                    }
                }
            },
            'leave': {
                text: [
                    _('Your gut clenches, and you feel the sudden urge to leave.'),
                    _('As you walk away, you can feel the old man\'s gaze on your back.')
                ],
                buttons: {
                    'okay': {
                        text: _('Weird.'),
                        nextScene: 'end'
                    }
                }
            }
        }
    },
    // Old lady in carriage, shortcut to Outpost
    {
        title: _('The Stomping of Hooves and Creaking of Wood'),
        isAvailable: function() {
            return Engine.activeModule == Road;
        },
        scenes: {
            'start': {
                text: [
                    _('A carriage pulls up alongside you, and the voice of an elderly woman croaks out from within.'),
                    _('"My, but you look tired from your journey. If it\'s the Outpost you seek, '
                         + 'I\'m on my way there now; would you like to join me?"'),
                    _('What do you do?')
                ],
                buttons: {
                    'accept': {
                        text: _('Accept her offer'),
                        nextScene: {1: 'accept'}
                    },
                    'leave': {
                        text: _('Politely Decline'),
                        nextScene: {1: 'leave'}
                    }
                }
            },
            'accept': {
                text: [
                    _('You hop in the carriage with the old woman.'),
                    _('She turns out to be pretty cool, and gives you one of those hard candies that ' 
                        + 'every grandparent seems to have on the end table next to their sofa.'),
                    _('Before long, you reach the Outpost. You hop out and thank the old woman for the ride.')
                ],
                buttons: {
                    'okay': {
                        text: _('What a nice old lady'),
                        nextScene: 'end',
                        onChoose: function() {
                            if ($SM.get('Outpost.open') === undefined) {
                                Outpost.init();
                                $SM.set('superlikely.outpostUnlock', 1);
                                // Character.setQuestStatus("mayorSupplies", 1);
                                Character.checkQuestStatus("mayorSupplies");
                                Engine.travelTo(Outpost)
                            }
                            Character.addToInventory('oldLady.Candy');
                        }
                    }
                }
            },
            'leave': {
                text: [
                    _('It\'s too early in the game to be trusting weird old people, man. You politely ' 
                        + 'decline, and the woman chuckles softly as the carriage rolls off into the distance.'),
                    _('That soft chuckle tells me everything I need to know about whether you made the '
                        + 'right call. That had "turned into gingerbread" written all over it.')
                ],
                buttons: {
                    'okay': {
                        text: _('Yeah it did'),
                        nextScene: 'end'
                    }
                }
            }
        }
    },
    // Organ trauma
    {
        title: _('This Guy Seems Friendly'),
        isAvailable: function() {
            return (Engine.activeModule === Road
                && $SM.get('Road.gotPunched') === undefined);
        },
        scenes: {
            'start': {
                text: [
                    _('A man walks up to you with a big grin on his face, and before you can greet him he swiftly socks you in the stomach.'),
                    _('He walks off whistling while you gasp for breath in the dirt.'),
                    _('... Man, what a dick.')
                ],
                buttons: {
                    'okay': {
                        text: _('Fuck me, I guess'),
                        nextScene: 'end',
                        onChoose: () => {
                            Character.grantPerk('tummyPain');
                            $SM.set('Road.gotPunched', 1);
                        }
                    }
                }
            }
        }
    },
    // An apology for organ trauma
    {
        title: _('This Fucking Guy Again'),
        isAvailable: function() {
            return (Engine.activeModule === Road
                && ($SM.get('Road.gotPunched') !== undefined));
        },
        scenes: {
            'start': {
                text: [
                    _('A man walks up to you with a big grin on his face, and before you can greet him he swiftly... apologizes.'),
                    _('"Hey, I\'m really sorry about punching you in the stomach before. I thought you were someone else. I HATE that guy."'),
                    _('You\'re not sure this is a good enough reason to not kick this guy\'s ass. Seeing the look on your face, he hastily continues.'),
                    _('"Anyway, as a token of my apology, please accept this healing tonic, as well as a coupon for a secret item from the store in the village."'),
                    _('You somewhat awkwardly accept both of these items, though you don\'t think there\'s a store in the vi-'),
                    _('"Oh, and I\'m the owner of the store in the village. I opened it back up after punching you. You know, to celebrate."'),
                    _('The man walks off, still grinning.')
                ],
                buttons: {
                    'okay': {
                        text: _('... Alright'),
                        nextScene: 'end',
                        onChoose: () => {
                            // give healing tonic
                            // give coupon
                            // unlock store button
                            $SM.set('Road.gotApologized', 1);
                        }
                    }
                }
            }
        }
    },
    // Unlock Outpost
    {
        title: _('A Way Forward Makes Itself Known'),
        isAvailable: function() {
            return (
                (Engine.activeModule === Road)
                && ($SM.get('Road.counter') as number > 3) // can't happen TOO early
                && ($SM.get('superlikely.outpostUnlock') == undefined
                    || $SM.get('superlikely.outpostUnlock') as number < 1) // can't happen twice
            );
        },
        isSuperLikely: function() {
            return ((( $SM.get('superlikely.outpostUnlock') === undefined)
                        || $SM.get('superlikely.outpostUnlock') as number < 1)) 
                    && ($SM.get('Road.counter') as number > 7);
        },
        scenes: {
            'start': {
                text: [
                    _('Smoke curls upwards from behind a hill. You climb higher to investigate.'),
                    _('From your elevated position, you can see down into the outpost that the mayor spoke of before.'),
                    _('The Outpost is now open to you.')
                ],
                buttons: {
                    'okay': {
                        text: _('A little dramatic, but cool'),
                        nextScene: 'end',
                        onChoose: function() {
                            Outpost.init();
                            $SM.set('superlikely.outpostUnlock', 1);
                            // Character.setQuestStatus("mayorSupplies", 1);
                            Character.checkQuestStatus("mayorSupplies");
                        }
                    }
                }
            }
        }
    },
];

