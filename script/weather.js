var Weather = {
    init: function(options) {
        this.options = $.extend(
			this.options,
			options
		);

        //subscribe to stateUpdates
		$.Dispatch('stateUpdate').subscribe(Weather.handleStateUpdates);
    },

    handleStateUpdates: function(e) {
        if (e.category == 'weather') {
            switch ($SM.get('weather')) {
                case 'sunny': 
                    Weather.startSunny();
                    break;
                case 'cloudy':
                    Weather.startCloudy();
                    break;
                case 'rainy':
                    Weather.startRainy();
                    break;
                default:
            }
        }
    },

    _lastWeather: 'sunny',

    startSunny: function() {
        Notifications.notify(null, "The sun begins to shine.");
        // TODO: CSS change to animate background color and add an animation somewhere for sun
        Weather._lastWeather = 'sunny';
        $('body').animate({backgroundColor: '#FFFFFF'}, 'slow');
    },

    startCloudy: function() {
        if (Weather._lastWeather == 'sunny') {
            Notifications.notify(null, "Clouds roll in, obscuring the sun.");
        } else if (Weather._lastWeather == 'rainy') {
            Notifications.notify(null, "The rain breaks, but the clouds remain.")
        }
        // TODO: CSS change to animate background color and add an animation somewhere for clouds 
        $('body').animate({backgroundColor: '#8B8786'}, 'slow');
        Weather._lastWeather = 'cloudy';
    },

    startRainy: function() {
        if (Weather._lastWeather == 'sunny') {
            Notifications.notify(null, "The wind suddenly picks up. Clouds roll in, heavy with rain, and raindrops fall soon after.");
        } else if (Weather._lastWeather == 'cloudy') {
            Notifications.notify(null, "The clouds that were previously content to hang overhead let loose a moderate downpour.")
        }
        
        // TODO: CSS change to animate background color and add an animation somewhere for rain
        $('body').animate({backgroundColor: '#6D6968'}, 'slow');
        Weather._lastWeather = 'rainy';
    },

    _location: '',

    initiateWeather: function(availableWeather, location) {
        console.log("initiating weather for " + location);
        if (Weather._location == '') Weather._location = location;
        // if in new location, end without triggering a new weather initiation, 
        // leaving the new location's initiateWeather callback to do its thing
        else if (Weather._location != location) return; 

        var chosenWeather = 'none';
        //get our random from 0 to 1
        var rnd = Math.random();
  
        //initialise our cumulative percentage
        var cumulativeChance = 0;
        for (var i in availableWeather) {
            cumulativeChance += availableWeather[i];
            
            if (rnd < cumulativeChance) {
                chosenWeather = i;
                break;
            }
        }

        if (chosenWeather != $SM.get('weather')) $SM.set('weather', chosenWeather);
        Engine.setTimeout(() => {
            this.initiateWeather(availableWeather, 'room');
        }, 60 * 1000);
    }
}