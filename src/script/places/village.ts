/**
 * Module that registers the simple room functionality
 */
import { Engine } from "../engine";
import { $SM } from "../state_manager";
import { Button } from "../Button";
import { Notifications } from "../notifications";
import { Weather } from "../weather";
import { _ } from "../../lib/translate";
import { Header } from "../header";
import { Liz } from "../characters/liz";
import { Mayor } from "../characters/mayor";
import { Events } from "../events";

export const Village = {
	// times in (minutes * seconds * milliseconds)
	_FIRE_COOL_DELAY: 5 * 60 * 1000, // time after a stoke before the fire cools
	_ROOM_WARM_DELAY: 30 * 1000, // time between room temperature updates
	_BUILDER_STATE_DELAY: 0.5 * 60 * 1000, // time between builder state updates
	_STOKE_COOLDOWN: 10, // cooldown to stoke the fire
	_NEED_WOOD_DELAY: 15 * 1000, // from when the stranger shows up, to when you need wood
	
	buttons:{},
	
	changed: false,

	description: [
		_("Nestled in the woods, this village is scarcely more than a hamlet, " 
			+ "despite you thinking those two words are synonyms. They're not, " 
			+ "go google 'hamlet' right now if you don't believe me."),
		_("The village is quiet at the moment; there aren't enough hands for anyone to remain idle for long.")
	],
	
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

		var desc = $('<div>').attr('id', 'description').appendTo(this.panel);

		for(var i in this.description) {
			$('<div>').text(this.description[i]).appendTo(desc);
		}
		
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

		var lizButton = $('#lizButton.button');
		lizButton.hide();
		
		// Create the stores container
		$('<div>').attr('id', 'storesContainer').appendTo('div#villagePanel');
		
		//subscribe to stateUpdates
		// @ts-ignore
		$.Dispatch('stateUpdate').subscribe(Village.handleStateUpdates);
		
		Village.updateButton();
	},
	
	options: {}, // Nothing for now

	availableWeather: {
		'sunny': 0.4,
		'cloudy': 0.3,
		'rainy': 0.3
	},
	
	onArrival: function(transition_diff) {
		Village.setTitle();
		if($SM.get('game.builder.level') == 3) {
			$SM.add('game.builder.level', 1);
			$SM.setIncome('builder', {
				delay: 10,
				stores: {'wood' : 2 }
			});
			Notifications.notify(Village, _("the stranger is standing by the fire. she says she can help. says she builds things."));
		}

		Engine.moveStoresView(null, transition_diff);

		Weather.initiateWeather(Village.availableWeather, 'village');
	},
	
	TempEnum: {
		fromInt: function(value) {
			for(var k in this) {
				if(typeof this[k].value != 'undefined' && this[k].value == value) {
					return this[k];
				}
			}
			return null;
		},
		Freezing: { value: 0, text: _('freezing') },
		Cold: { value: 1, text: _('cold') },
		Mild: { value: 2, text: _('mild') },
		Warm: { value: 3, text: _('warm') },
		Hot: { value: 4, text: _('hot') }
	},
	
	FireEnum: {
		fromInt: function(value) {
			for(var k in this) {
				if(typeof this[k].value != 'undefined' && this[k].value == value) {
					return this[k];
				}
			}
			return null;
		},
		Dead: { value: 0, text: _('dead') },
		Smoldering: { value: 1, text: _('smoldering') },
		Flickering: { value: 2, text: _('flickering') },
		Burning: { value: 3, text: _('burning') },
		Roaring: { value: 4, text: _('roaring') }
	},
	
	setTitle: function() {
		var title = _("The Village");
		if(Engine.activeModule == this) {
			document.title = title;
		}
		$('div#location_village').text(title);
	},
	
	updateButton: function() {
		var light = $('#lightButton.button');
		var stoke = $('#stokeButton.button');
		if($SM.get('game.fire.value') == Village.FireEnum.Dead.value && stoke.css('display') != 'none') {
			stoke.hide();
			light.show();
			if(stoke.hasClass('disabled')) {
				Button.cooldown(light);
			}
		} else if(light.css('display') != 'none') {
			stoke.show();
			light.hide();
			if(light.hasClass('disabled')) {
				Button.cooldown(stoke);
			}
		}
		
		if(!$SM.get('stores.wood')) {
			light.addClass('free');
			stoke.addClass('free');
		} else {
			light.removeClass('free');
			stoke.removeClass('free');
		}

		var lizButton = $('#lizButton.button');
		if($SM.get('village.lizActive')) lizButton.show();
		var buildingButton = $('#newBuildingButton.button');
		if($SM.get('village.mayor.haveGivenSupplies')) buildingButton.show();
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
							nextScene: 'main',
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
			}
};
