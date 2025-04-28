var Character = {
	inventory: {}, // dictionary using item name as key
	equippedItems: {
		// stealing the KoL style for now, we'll see if I need something
		// that fits the game better as we go
		head: null,
		torso: null,
		pants: null,
		// no weapon, try to see how far we can get in this game without focusing on combat
		accessory1: null,
		accessory2: null,
		accessory3: null,
	},

	// stats before any modifiers from gear or whatever else are applied
	rawStats: {
		'Speed': 5,
		'Perception': 5,
		'Resilience': 5,
		'Ingenuity': 5,
		'Toughness': 5
	},

	// perks given by items, character choices, divine provenance, etc.
	perks: { },
	
	init: function(options) {
		this.options = $.extend(
			this.options,
			options
		);
		
		// create the character box
		elem = $('<div>').attr({
			id: 'character',
			className: 'character'
		});
		
		elem.appendTo('div#wrapper');

		// write rawStats to $SM
		// NOTE: never write derived stats to $SM, and never access raw stats directly!
		// doing so will introduce opportunities to mess up stats PERMANENTLY
        if (!$SM.get('character.rawstats')) {
            $SM.set('character.rawstats', Character.rawStats);
        }

        $('<div>').text('Character').attr('id', 'title').appendTo('div#character');

		// TODO: replace this with derived stats
        for(var stat in $SM.get('character.rawstats')) {
            $('<div>').text(stat + ': ' + $SM.get('character.stats.' + stat)).appendTo('div#character');
        }
	},
	
	options: {}, // Nothing for now
	
	elem: null,

	addToInventory: function(item) {
		//0 if undefined, null (but not {}) should allow adding to new objects
		//could also add in a true = 1 thing, to have something go from existing (true)
		//to be a count, but that might be unwanted behavior (add with loose eval probably will happen anyways)
		var old = Character.inventory[item.name].count;
		
		//check for NaN (old != old) and non number values
		if(old != old){
			Character.inventory[item.name] = item;
		}
		else {
			Character.inventory[item.name].count += item.count;
		}

		// TODO: write to $SM
	},


	removeFromInventory: function(item) {
		var old = Character.inventory[item.name].count;

		if (old != old) {
			return;
		} else {
			if (Character.inventory[item.name].count > 0) {
				Character.inventory[item.name].count -= item.count;
			}
			else {
				delete Character.inventory[item.name];
			}
		}

		// TODO: write to $SM
	},

	useInventoryItem: function(item) {
		if (Character.inventory[item.name] && Character.inventory[item.name].count > 0) {
			// use the effect in the inventory; just in case a name matches but the effect
			// does not, assume the inventory item is the source of truth
			Character.inventory[item.name].onUse();
			// please don't make this unreadable nonsense in a future refactor, just
			// let it be this way
			if (typeof(item.destroyOnUse) == "function" && item.destroyOnUse()) {
				Character.removeFromInventory(item);
			} else if (typeof(item.destroyOnUse) == "boolean" && item.destroyOnUse) {
				Character.removeFromInventory(item);
			}
		}

		// TODO: write to $SM
	},

	equipItem: function(item) {
		if (item.slot && typeof(Character.equippedItems[item.slot]) !== "undefined") {
			Character.addToInventory(Character.equippedItems[item.slot]);
			Character.equippedItems[item.slot] = item;
			if (item.onEquip) {
				item.onEquip();
			}
			Character.checkEquipmentEffects();
		}

		// TODO: write to $SM
	},

	grantPerk: function(perk) {
		if (Character.perks[perk.name]) {
			if(perk.timeLeft > 0) {
				Character.perks[perk.name] += perk.timeLeft;
			}
		} else {
			Character.perks[perk.name] = perk;
		}

		// TODO: write to $SM
	},

	// apply equipment effects, which should all check against $SM state variables;
	// this should be called on basically every player action where a piece of gear
	// would do something or change an outcome; give extraParams to the effect being 
	// applied for anything that's relevant to the effect but not handled by $SM
	applyEquipmentEffects: function(extraParams) {
		for (const item in Character.equippedItems) {
			if (item.effects) {
				for (const effect in item.effects) {
					// NOTE: currently this is good for applying perks and Notifying;
					// are there other situations where we'd want to apply effects,
					// or can we cover basically every case via those things?
					if (effect.isActive && effect.isActive(extraParams)) effect.apply(extraParams);
				}
			}
		}
	},

	// get stats after applying all equipment bonuses, perks, etc.
	getDerivedStats: function() {
		const derivedStats = structuredClone(Character.rawStats);
		for (const item in Character.equippedItems) {
			if (item.statBonuses) {
				for (const stat in Object.keys(item.statBonuses)) {
					if (typeof (item.statBonuses[stat] == "function")) {
						derivedStats[stat] += item.statBonuses[stat]();
					} else {
						derivedStats[stat] += item.statBonuses[stat];
					}
				}
			}
		}

		for (const perk in Character.perks) {
			if (perk.statBonuses) {
				for (const stat in Object.keys(perk.statBonuses)) {
					if (typeof (perk.statBonuses[stat] == "function")) {
						derivedStats[stat] += perk.statBonuses[stat]();
					} else {
						derivedStats[stat] += perk.statBonuses[stat];
					}
				}
			}
		}

		return derivedStats;
	}
}