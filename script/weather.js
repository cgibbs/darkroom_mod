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
        Weather._lastWeather = 'sunny';
        $('body').animate({backgroundColor: '#FFFFFF'}, 'slow');
        $('div#stores::before').animate({backgroundColor: '#FFFFFF'}, 'slow');
        Weather.makeRainStop();
    },

    startCloudy: function() {
        if (Weather._lastWeather == 'sunny') {
            Notifications.notify(null, "Clouds roll in, obscuring the sun.");
        } else if (Weather._lastWeather == 'rainy') {
            Notifications.notify(null, "The rain breaks, but the clouds remain.")
        }
        $('body').animate({backgroundColor: '#8B8786'}, 'slow');
        $('div#stores::before').animate({backgroundColor: '#8B8786'}, 'slow');
        Weather._lastWeather = 'cloudy';
        Weather.makeRainStop();
    },

    startRainy: function() {
        if (Weather._lastWeather == 'sunny') {
            Notifications.notify(null, "The wind suddenly picks up. Clouds roll in, heavy with rain, and raindrops fall soon after.");
        } else if (Weather._lastWeather == 'cloudy') {
            Notifications.notify(null, "The clouds that were previously content to hang overhead let loose a moderate downpour.")
        }
        
        $('body').animate({backgroundColor: '#6D6968'}, 'slow');
        $('div#stores::before').animate({backgroundColor: '#6D6968'}, 'slow');
        Weather._lastWeather = 'rainy';
        Weather.makeItRain();
    },

    _location: '',

    initiateWeather: function(availableWeather, location) {
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
            this.initiateWeather(availableWeather, location);
        }, 3 * 60 * 1000);
    },

    makeItRain: function() {
        // https://codepen.io/arickle/pen/XKjMZY
        //clear out everything
        $('.rain').empty();
      
        var increment = 0;
        var drops = "";
        var backDrops = "";
      
        while (increment < 100) {
          //couple random numbers to use for various randomizations
          //random number between 98 and 1
          var randoHundo = (Math.floor(Math.random() * (98 - 1 + 1) + 1));
          //random number between 5 and 2
          var randoFiver = (Math.floor(Math.random() * (5 - 2 + 1) + 2));
          //increment
          increment += randoFiver;
          //add in a new raindrop with various randomizations to certain CSS properties
          drops += '<div class="drop" style="left: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
          backDrops += '<div class="drop" style="right: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
        }
      
        $('.rain.front-row').append(drops);
        $('.rain.back-row').append(backDrops);
    },

    makeRainStop: function() {
        $('.rain').empty();
    }
}