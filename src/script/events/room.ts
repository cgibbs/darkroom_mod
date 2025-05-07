/**
 * Events that can occur when the Room module is active
 **/
import { Engine } from "../engine";
import { $SM } from "../state_manager";
import { Room } from '../places/room';
import { _ } from "../../lib/translate";
import { ADREvent } from "../events";

export const EventsRoom: Array<ADREvent> = [
	{ /* The Nomad  --  Merchant */
		title: _('The Nomad'),
		isAvailable: function() {
			return Engine.activeModule == Room && $SM.get('stores.fur', true) as number > 0;
		},
		scenes: {
			'start': {
				text: [
					_('a nomad shuffles into view, laden with makeshift bags bound with rough twine.'),
					_("won't say from where he came, but it's clear that he's not staying.")
				],
				notification: _('a nomad arrives, looking to trade'),
				blink: true,
				buttons: {
					'buyScales': {
						text: _('buy scales'),
						cost: { 'fur': 100 },
						reward: { 'scales': 1 }
					},
					'buyTeeth': {
						text: _('buy teeth'),
						cost: { 'fur': 200 },
						reward: { 'teeth': 1 }
					},
					'buyBait': {
						text: _('buy bait'),
						cost: { 'fur': 5 },
						reward: { 'bait': 1 },
						notification: _('traps are more effective with bait.')
					},
					'goodbye': {
						text: _('say goodbye'),
						nextScene: 'end'
					}
				}
			}
		}
	}, 
	{ /* Noises Outside  --  gain wood/fur */
		title: _('Noises'),
		isAvailable: function() {
			return Engine.activeModule == Room && $SM.get('stores.wood');
		},
		scenes: {
			'start': {
				text: [
					_('through the walls, shuffling noises can be heard.'),
					_("can't tell what they're up to.")
				],
				notification: _('strange noises can be heard through the walls'),
				blink: true,
				buttons: {
					'investigate': {
						text: _('investigate'),
						nextScene: { 0.3: 'stuff', 1: 'nothing' }
					},
					'ignore': {
						text: _('ignore them'),
						nextScene: 'end'
					}
				}
			},
			'nothing': {
				text: [
					_('vague shapes move, just out of sight.'),
					_('the sounds stop.')
				],
				buttons: {
					'backinside': {
						text: _('go back inside'),
						nextScene: 'end'
					}
				}
			},
			'stuff': {
				reward: { wood: 100, fur: 10 },
				text: [
					_('a bundle of sticks lies just beyond the threshold, wrapped in coarse furs.'),
					_('the night is silent.')
				],
				buttons: {
					'backinside': {
						text: _('go back inside'),
						nextScene: 'end'
					}
				}
			}
		}
	},
	{ /* The Beggar  --  trade fur for better good */
		title: _('The Beggar'),
		isAvailable: function() {
			return Engine.activeModule == Room && $SM.get('stores.fur');
		},
		scenes: {
			start: {
				text: [
					_('a beggar arrives.'),
					_('asks for any spare furs to keep him warm at night.')
				],
				notification: _('a beggar arrives'),
				blink: true,
				buttons: {
					'50furs': {
						text: _('give 50'),
						cost: {fur: 50},
						nextScene: { 0.5: 'scales', 0.8: 'teeth', 1: 'cloth' }
					},
					'100furs': {
						text: _('give 100'),
						cost: {fur: 100},
						nextScene: { 0.5: 'teeth', 0.8: 'scales', 1: 'cloth' }
					},
					'deny': {
						text: _('turn him away'),
						nextScene: 'end'
					}
				}
			},
			scales: {
				reward: { scales: 20 },
				text: [
					_('the beggar expresses his thanks.'),
					_('leaves a pile of small scales behind.')
				],
				buttons: {
					'leave': {
						text: _('say goodbye'),
						nextScene: 'end'
					}
				}
			},
			teeth: {
				reward: { teeth: 20 },
				text: [
					_('the beggar expresses his thanks.'),
					_('leaves a pile of small teeth behind.')
				],
				buttons: {
					'leave': {
						text: _('say goodbye'),
						nextScene: 'end'
					}
				}
			},
			cloth: {
				reward: { cloth: 20 },
				text: [
					_('the beggar expresses his thanks.'),
					_('leaves some scraps of cloth behind.')
				],
				buttons: {
					'leave': {
						text: _('say goodbye'),
						nextScene: 'end'
					}
				}
			}
		}
	},
	{ /* The Scout  --  Map Merchant */
		title: _('The Scout'),
		isAvailable: function() {
			return Engine.activeModule == Room && $SM.get('features.location.world');
		},
		scenes: {
			'start': {
				text: [
					_("the scout says she's been all over."),
					_("willing to talk about it, for a price.")
				],
				notification: _('a scout stops for the night'),
				blink: true,
				buttons: {
					'buyMap': {
						text: _('buy map'),
						cost: { 'fur': 200, 'scales': 10 },
						notification: _('the map uncovers a bit of the world'),
						// onChoose: World.applyMap
					},
					'learn': {
						text: _('learn scouting'),
						cost: { 'fur': 1000, 'scales': 50, 'teeth': 20 },
						available: function() {
							return !$SM.hasPerk('scout');
						},
						onChoose: function() {
							$SM.addPerk('scout');
						}
					},
					'leave': {
						text: _('say goodbye'),
						nextScene: 'end'
					}
				}
			}
		}
	},
	
	{ /* The Wandering Master */
		title: _('The Master'),
		isAvailable: function() {
			return Engine.activeModule == Room && $SM.get('features.location.world');
		},
		scenes: {
			'start': {
				text: [
					_('an old wanderer arrives.'),
					_('he smiles warmly and asks for lodgings for the night.')
				],
				notification: _('an old wanderer arrives'),
				blink: true,
				buttons: {
					'agree': {
						text: _('agree'),
						cost: {
							'cured meat': 100,
							'fur': 100,
							'torch': 1
						},
						nextScene: {1: 'agree'}
					},
					'deny': {
						text: _('turn him away'),
						nextScene: 'end'
					}
				}
			},
			'agree': {
				text: [
					_('in exchange, the wanderer offers his wisdom.')
				],
				buttons: {
					'evasion': {
						text: _('evasion'),
						available: function() {
							return !$SM.hasPerk('evasive');
						},
						onChoose: function() {
							$SM.addPerk('evasive');
						},
						nextScene: 'end'
					},
					'precision': {
						text: _('precision'),
						available: function() {
							return !$SM.hasPerk('precise');
						},
						onChoose: function() {
							$SM.addPerk('precise');
						},
						nextScene: 'end'
					},
					'force': {
						text: _('force'),
						available: function() {
							return !$SM.hasPerk('barbarian');
						},
						onChoose: function() {
							$SM.addPerk('barbarian');
						},
						nextScene: 'end'
					},
					'nothing': {
						text: _('nothing'),
						nextScene: 'end'
					}
				}
			}
		}
	}
];
