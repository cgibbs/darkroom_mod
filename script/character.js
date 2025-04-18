var Character = {
	
	init: function(options) {
		this.options = $.extend(
			this.options,
			options
		);
		
		// Create the character box
		elem = $('<div>').attr({
			id: 'character',
			className: 'character'
		});
		
		elem.appendTo('div#wrapper');

        if (!$SM.get('character.stats')) {
            $SM.set('character.stats', {
                'Speed': 5,
                'Perception': 5,
                'Resilience': 5,
                'Ingenuity': 5,
                'Toughness': 5
            })
        }

        $('<div>').text('Character').attr('id', 'title').appendTo('div#character');

        for(var stat in $SM.get('character.stats')) {
            $('<div>').text(stat + ': ' + $SM.get('character.stats.' + stat)).appendTo('div#character');
        }
	},
	
	options: {}, // Nothing for now
	
	elem: null,
}