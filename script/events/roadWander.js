/**
 * Events that can occur when the Road module is active
 **/
Events.RoadWander = [
    // {
    //     title: _('The Nomad'),
	// 	isAvailable: function() {
	// 		return Engine.activeModule == Room && $SM.get('stores.fur', true) > 0;
	// 	},
	// 	scenes: {
	// 		'start': {
	// 			text: [
	// 				_('a nomad shuffles into view, laden with makeshift bags bound with rough twine.'),
	// 				_("won't say from where he came, but it's clear that he's not staying.")
	// 			],
	// 			notification: _('a nomad arrives, looking to trade'),
	// 			blink: true,
	// 			buttons: {
	// 				'buyScales': {
	// 					text: _('buy scales'),
	// 					cost: { 'fur': 100 },
	// 					reward: { 'scales': 1 }
	// 				}
    //             }
    //         }
    //     }
    // }
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
                    possibleItems = [
                        'A smooth black stone',
                        'A knife wrapped in cloth',
                        'A bundle of cloth',
                        'A strange coin'
                    ];
                    const item = possibleItems[Math.floor(Math.random() * possibleItems.length)];
                    $SM.add('stores.' + item, 1);
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
    }
];

