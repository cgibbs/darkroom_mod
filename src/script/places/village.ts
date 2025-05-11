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
			title: _('A New Building'),
			scenes: {
				start: {
					text: [
						_("This is the store. There's nothing here yet, though."),
						_("You find a dusty pair of dice in the corner and throw them, just to see what happens.")
					],
					dice: 2,
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
	}
};
