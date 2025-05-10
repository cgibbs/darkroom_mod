import { Engine } from '../engine';
import { $SM } from '../state_manager';
import { Weather } from '../weather';
import { Button } from '../Button';
import { Captain } from '../characters/captain';
import { Header } from '../header';
import { _ } from '../../lib/translate';

export const Outpost = {
	description: [
		_("You're in a small but bustling military outpost. Various members " 
			+ "of the rank-and-file go about their business, paying you little mind."),
		_("One tent stands out from the rest; the finely-embroidered details and " + 
			"golden icon above the entrance mark it as the commanding officer's quarters.")
	],

    init: function(options?) {
        this.options = $.extend(
			this.options,
			options
		);

        // Create the Outpost tab
        this.tab = Header.addLocation(_("The Outpost"), "outpost", Outpost);

        // Create the Outpost panel
		this.panel = $('<div>')
        .attr('id', "outpostPanel")
        .addClass('location')
        .appendTo('div#locationSlider');

		// Create the description text
		var desc = $('<div>').attr('id', 'description').appendTo(this.panel);

		for(var i in this.description) {
			$('<div>').text(this.description[i]).appendTo(desc);
		}

        Engine.updateSlider();

        // new 
		Button.Button({
			id: 'captainButton',
			text: _('Speak with The Captain'),
			click: Captain.talkToCaptain,
			width: '80px'
		})
		.addClass('locationButton')
		.appendTo('div#outpostPanel');

        Outpost.updateButton();

        // setting this separately so that quest status can't accidentally break it later
        $SM.set('outpost.open', 1); 
    },

    availableWeather: {
		'sunny': 0.4,
		'cloudy': 0.3,
		'rainy': 0.3
	},

    onArrival: function(transition_diff) {
        Outpost.setTitle();

		Engine.moveStoresView(null, transition_diff);

        Weather.initiateWeather(Outpost.availableWeather, 'outpost');
    },

    setTitle: function() {
		var title = _("The Outpost");
		if(Engine.activeModule == this) {
			document.title = title;
		}
		$('div#location_outpost').text(title);
	},

    updateButton: function() {
		// conditionals for updating buttons
	},

    // don't need this yet (or maybe ever)
	// wanderEvent: function() {
	// 	Events.triggerLocationEvent('OutpostWander');
	// 	$SM.add('Outpost.counter', 1);
	// }
}