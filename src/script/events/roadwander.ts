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
    // Unlock Outpost
    {
        title: _('A Way Forward Makes Itself Known'),
        isAvailable: function() {
            return (
                (Engine.activeModule == Road)
                && ($SM.get('Road.counter') as number > 6) // can't happen TOO early
                && ($SM.get('superlikely.outpostUnlock') == undefined
                    || $SM.get('superlikely.outpostUnlock') as number < 1) // can't happen twice
            );
        },
        isSuperLikely: function() {
            return ((( $SM.get('superlikely.outpostUnlock') === undefined)
                        || $SM.get('superlikely.outpostUnlock') as number < 1)) 
                    && ($SM.get('Road.counter') as number > 10);
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

