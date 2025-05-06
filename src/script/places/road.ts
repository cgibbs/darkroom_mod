import { Header } from "../header";
import { Engine } from "../engine";
import { Button } from "../Button";
import { $SM } from "../state_manager";
import { _ } from "../../lib/translate";
import { Weather } from "../weather";
import { Events } from "../events";

export const Road = {
    init: function(options?) {
        this.options = $.extend(
			this.options,
			options
		);

        // Create the Road tab
        this.tab = Header.addLocation(_("Road to the Outpost"), "road", Road);

        // Create the Road panel
		this.panel = $('<div>')
        .attr('id', "roadPanel")
        .addClass('location')
        .appendTo('div#locationSlider');

        Engine.updateSlider();

        //new 
		Button.Button({
			id: 'wanderButton',
			text: _('Wander Around'),
			click: Road.wanderEvent,
			width: '80px',
			cost: {} // TODO: make there be a cost to doing stuff?
		}).appendTo('div#roadPanel');

        Road.updateButton();

        // setting this separately so that quest status can't accidentally break it later
        $SM.set('road.open', 1); 
    },

    availableWeather: {
		'sunny': 0.4,
		'cloudy': 0.3,
		'rainy': 0.3
	},

    onArrival: function(transition_diff) {
        Road.setTitle();

		Engine.moveStoresView(null, transition_diff);

        Weather.initiateWeather(Road.availableWeather, 'road');
    },

    setTitle: function() {
		var title = _("Road to the Outpost");
		if(Engine.activeModule == this) {
			document.title = title;
		}
		$('div#location_road').text(title);
	},

    updateButton: function() {
		// conditionals for updating buttons
	},

	wanderEvent: function() {
		Events.triggerLocationEvent('RoadWander');
		$SM.add('Road.counter', 1);
	}
}