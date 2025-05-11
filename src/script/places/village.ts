/**
 * Module that registers the simple room functionality
 */
import { Engine } from "../engine";
import { $SM } from "../state_manager";
import { Button } from "../Button";
import { Weather } from "../weather";
import { _ } from "../../lib/translate";
import { Header } from "../header";
import { Liz } from "../characters/liz";
import { Mayor } from "../characters/mayor";
import { Events } from "../events";
import { _tb } from "../../lib/textBuilder";
import { Character } from "../player/character";

export const Village = {

	buttons:{},
	
	changed: false,

	description: [],
	descriptionPanel: null,
	
	name: _("Village"),
	init: function(options?) {
		this.options = $.extend(
			this.options,
			options
		);
		
		if(Engine._debug) {
			this._ROOM_WARM_DELAY = 5000;
			this._BUILDER_STATE_DELAY = 5000;
			this._STOKE_COOLDOWN = 0;
			this._NEED_WOOD_DELAY = 5000;
		}
		
		// Create the Village tab
		this.tab = Header.addLocation(_("A Chill Village"), "village", Village);
		
		// Create the Village panel
		this.panel = $('<div>')
			.attr('id', "villagePanel")
			.addClass('location')
			.appendTo('div#locationSlider');

		this.descriptionPanel = $('<div>').attr('id', 'description').appendTo(this.panel);
		this.updateDescription();

		Engine.updateSlider();

		Button.Button({
			id: 'talkButton',
			text: _('Talk to the Mayor'),
			click: Mayor.talkToMayor,
			width: '80px',
			cost: {}
		})
		.addClass('locationButton')
		.appendTo('div#villagePanel');

		Button.Button({
			id: 'lizButton',
			text: _('Talk to Liz'),
			click: Liz.talkToLiz,
			width: '80px',
			cost: {}
		})
		.addClass('locationButton')
		.appendTo('div#villagePanel');

		Button.Button({
			id: 'newBuildingButton',
			text: _('Check out the new building'),
			click: Village.tempBuildingMessage,
			width: '80px',
			cost: {}
		})
		.addClass('locationButton')
		.appendTo('div#villagePanel');

		var buildingButton = $('#newBuildingButton.button');
		buildingButton.hide();

		Button.Button({
			id: 'storeButton',
			text: _('Go to the Store'),
			click: Village.openStore,
			width: '80px',
			cost: {}
		})
		.addClass('locationButton')
		.appendTo('div#villagePanel');

		Button.Button({
			id: 'diceButton',
			text: _('Play a Game'),
			click: Village.playDiceGame,
			width: '80px',
			cost: {}
		})
		.addClass('locationButton')
		.appendTo('div#villagePanel');

		var storeButton = $('#storeButton.button');
		storeButton.hide();

		var lizButton = $('#lizButton.button');
		lizButton.hide();
		
		// Create the stores container
		$('<div>').attr('id', 'storesContainer').appendTo('div#villagePanel');
		
		//subscribe to stateUpdates
		// @ts-ignore
		$.Dispatch('stateUpdate').subscribe(Village.handleStateUpdates);
		
		Village.updateButton();
	},

	updateDescription: function() {
		this.descriptionPanel.empty();
		this.description = _tb([
			_("Nestled in the woods, this village is scarcely more than a hamlet, " 
				+ "despite you thinking those two words are synonyms. They're not, " 
				+ "go google 'hamlet' right now if you don't believe me."),
			_("The village is quiet at the moment; there aren't enough hands for anyone to remain idle for long."),
			{
				text: _("A storefront, staffed entirely by a single grinning jackass, stands proudly in the main square."),
				isVisible: () => {
					return $SM.get('Road.gotApologized') !== undefined;
				}
			}
		]);

		for(var i in this.description) {
			$('<div>').text(this.description[i]).appendTo(this.descriptionPanel);
		}
	},
	
	options: {}, // Nothing for now

	availableWeather: {
		'sunny': 0.4,
		'cloudy': 0.3,
		'rainy': 0.3
	},
	
	onArrival: function(transition_diff) {
		Village.setTitle();

		this.updateDescription();

		Weather.initiateWeather(Village.availableWeather, 'village');
	},
	
	setTitle: function() {
		var title = _("The Village");
		if(Engine.activeModule == this) {
			document.title = title;
		}
		$('div#location_village').text(title);
	},
	
	updateButton: function() {
		var lizButton = $('#lizButton.button');
		if($SM.get('village.lizActive')) lizButton.show();
		var buildingButton = $('#newBuildingButton.button');
		if($SM.get('village.mayor.haveGivenSupplies')) buildingButton.show();
		var storeButton = $('#storeButton.button');
		if($SM.get('Road.gotApologized')) storeButton.show();
	},
	
	
	handleStateUpdates: function(e){
		if(e.category == 'stores'){
			// Village.updateBuildButtons();
		} else if(e.category == 'income'){
		} else if(e.stateName.indexOf('game.buildings') === 0){
		}
	},

	tempBuildingMessage: function() {
		Events.startEvent({
			title: _('A New Building'),
			scenes: {
				start: {
					text: [
						_('This is a new building. There should be stuff in it, but this is a placeholder for now.'),
					],
					buttons: {
						'leave': {
							text: _('Lame'),
							nextScene: 'end'
						}
					}
				}
			}
		});
	},

	openStore: function() {
		Events.startEvent({
			title: _('The Store'),
			scenes: {
				start: {
					text: [
						_("This is the store. There's nothing here yet, though."),
						_("You find a dusty pair of dice in the corner and throw them, just to see what happens.")
					],
					dice: {
						amount: 2,
						dieFaces: {
							1: 'skull'
						},
						handler: (vals) => {
							const returnText = [];
							if ((vals[0] == vals[1]) && vals[0] == 1) {
								returnText.push("Snake eyes! I feel a mild sense of dread.");
							} else if (vals[0] == vals[1]) {
								returnText.push("Wow, doubles. That seems lucky.");
							} else if ((vals[0] + vals[1]) == 7) {
								returnText.push("Oh, nice. Do I win something?");
							} else {
								returnText.push("I rolled a " + (vals[0] + vals[1]).toString() + ". That doesn't seem especially noteworthy.");
							}
							return returnText;
						}
					},
					buttons:  {
						roll: {
							text: _('Roll \'em again'),
							nextScene: {1: 'start'}
						},
						leave: {
							text: _('Lame'),
							nextScene: 'end'
						}
					}
				}
			}
		});
	},

	playDiceGame: function() {
		Events.startEvent({
			title: _('A Game of Chance'),
			scenes: {
				start: {
					text: [
						_('You walk into a shady alley, and a man in a wide-brimmed hat gestures to you with dice in his hand.'),
						_('"Hey, buddy, wanna play a game? There\'s a prize if you win!"'),
						_('What do you do?')
					],
					buttons: {
						'play': {
							text: _('I like prizes'),
							nextScene: {1: 'gameStart'}
						},
						'leave': {
							text: _('No thanks'),
							nextScene: 'end'
						}
					}
				},
				'gameStart': {
					text: [
						_('The man reveals a toothy grin and begins to explain the rules.'),
						_('"It\'s very simple, you just choose whether you want to try to roll '
							 + 'higher or lower than me, and then I roll, and then you roll. ' 
							 + 'If you call it right, you win."'),
						_('"So, what\'ll it be?')
					],
					buttons: {
						'high': {
							text: _('High'),
							nextScene: {1: 'heRolls'},
							onChoose: () => $SM.set('diceGame.high', 1)
						},
						'low': {
							text: _('Low'),
							nextScene: {1: 'heRolls'},
							onChoose: () => $SM.set('diceGame.low', 1)
						}
					}
				},
				'heRolls': {
					text: [
						_('The mans hat tips low as he drops the dice to the ground.'),
					],
					dice: {
						amount: 2,
						handler: (vals) => {
							const returnText = [];
							let diceVal = 0;
							for (var i in vals) {
								diceVal += vals[i]
							}

							$SM.set('diceGame.hisRoll', diceVal);

							if (($SM.get('diceGame.high') !== undefined) && diceVal < 5) {
								returnText.push(_('The stranger grimaces.'));
							} else if (($SM.get('diceGame.high') !== undefined) && diceVal > 8) {
								returnText.push(_('The stranger grins wickedly.'));
							} else if (($SM.get('diceGame.low') !== undefined) && diceVal > 8) {
								returnText.push(_('The stranger grimaces.'));
							} else if (($SM.get('diceGame.low') !== undefined) && diceVal < 5) {
								returnText.push(_('The stranger grins wickedly.'));
							}

							returnText.push(_('He picks up the dice and holds them out to you.'))
							returnText.push(_('"Your roll."'))
							return returnText;
						}
					},
					buttons: {
						'okay': {
							text: _('Roll \'em'),
							nextScene: {1: 'youRoll'}
						}
					}
				},
				'youRoll': {
					text: [
						_('You briefly jostle the dice, then let them fall where they may.')
					],
					dice: {
						amount: 2,
						handler: (vals) => {
							const returnText = [];

							let diceVal = 0;
							for (var i in vals) {
								diceVal += vals[i]
							}

							if ($SM.get('diceGame.high') && diceVal < ($SM.get('diceGame.hisRoll') as number)) {
								returnText.push('Your feel a rush of disappointment.');
							} else if ($SM.get('diceGame.high') && diceVal > ($SM.get('diceGame.hisRoll') as number)) {
								returnText.push('Your feel a rush of excitement.');
								$SM.set('diceGame.win', 1);
							} else if ($SM.get('diceGame.low') && diceVal > ($SM.get('diceGame.hisRoll') as number)) {
								returnText.push('Your feel a rush of disappointment.');
							} else if ($SM.get('diceGame.low') && diceVal < ($SM.get('diceGame.hisRoll') as number)) {
								returnText.push('Your feel a rush of excitement.');
								$SM.set('diceGame.win', 1);
							}

							return returnText;
						}
					},
					buttons: {
						'results': {
							text: () => ($SM.get('diceGame.win') !== undefined) ? _('Oh, nice') : _('Aww, shoot'),
							nextScene: {1: 'results'}
						}
					}
				},
				'results': {
					text: () => ($SM.get('diceGame.win') !== undefined) ? [
						_('The gambler curses under his breath, then hands you something and quickly walks away.')
					]: [_('The gambler\'s face splits into a wide grin before disappearing beneath the brim.'),
						_('"Better luck next time stranger."'),
						_('He sinks back into the shadows of the alley, and his words reverberate off of the parallel walls long after you lose sight of him.')
					],
					onLoad: () => {
						if ($SM.get('diceGame.win') !== undefined) {
							Character.addToInventory('gambler.Prize');
						}
					},
					buttons: {
						'okay': {
							text: _('That was fun, I guess'),
							nextScene: 'end',
							onChoose: () => $SM.remove('diceGame')
						}
					}
				}
			}
		})
	}
}
