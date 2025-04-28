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
        } else {
			Character.rawStats = $SM.get('character.rawStats');
		}

		if (!$SM.get('character.perks')) {
            $SM.set('character.perks', Character.perks);
        } else {
			Character.perks = $SM.get('character.perks');
		}

		if (!$SM.get('character.inventory')) {
            $SM.set('character.inventory', Character.inventory);
        } else {
			Character.inventory = $SM.get('character.inventory');
		}

		if (!$SM.get('character.equippedItems')) {
            $SM.set('character.equippedItems', Character.equippedItems);
        } else {
			Character.equippedItems = $SM.get('character.equippedItems');
		}

        $('<div>').text('Character').attr('id', 'title').appendTo('div#character');

		// TODO: replace this with derived stats
        for(var stat in $SM.get('character.rawstats')) {
            $('<div>').text(stat + ': ' + $SM.get('character.rawstats.' + stat)).appendTo('div#character');
        }

		$('<div>').attr('id', 'buttons').css("margin-top", "20px").appendTo('div#character');
		var b = new Button.Button({
			id: "inventory",
			text: "Inventory",
			click: Character.openInventory
		}).appendTo($('#buttons', 'div#character'));
	},
	
	options: {}, // Nothing for now
	
	elem: null,

	inventoryDisplay: null,

	openInventory: function() {
		// creating a handle for later access, such as closing inventory
		Character.inventoryDisplay = $('<div>').attr('id', 'event').addClass('eventPanel').css('opacity', '0');
		var inventoryDisplay = Character.inventoryDisplay;
		$('<div>').addClass('eventTitle').text('Inventory').appendTo(inventoryDisplay);
		
		for(var item in Character.inventory) {
			console.log(item);
			$('<div>').text(Character.inventory[item].name).appendTo(inventoryDisplay);
			// add the stuff to make these clickable and hoverable and stuff
		}

		// TODO: make this CSS an actual class somewhere, I'm sure I'll need it again
		$('<div>').attr('id', 'buttons').css("margin-top", "20px").appendTo(inventoryDisplay);
		var b = new Button.Button({
			id: "closeInventory",
			text: "Close",
			click: Character.closeInventory
		}).appendTo($('#buttons', inventoryDisplay));
		$('div#wrapper').append(inventoryDisplay);
		inventoryDisplay.animate({opacity: 1}, Events._PANEL_FADE, 'linear');
	},

	closeInventory: function() {
		Character.inventoryDisplay.remove();
	},

	addToInventory: function(item) {
		if (Character.inventory[item.name]) {
			Character.inventory[item.name].count += item.count;
		} else {
			Character.inventory[item.name] = item;
		}

		// TODO: write to $SM
		$SM.set('inventory', Character.inventory);
	},


	removeFromInventory: function(item) {
		if (Character.inventory[item.name].count > 0) {
			Character.inventory[item.name].count -= item.count;
		}
		else {
			delete Character.inventory[item.name];
		}

		// TODO: write to $SM
		$SM.set('inventory', Character.inventory);
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
		$SM.set('inventory', Character.inventory);
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
		$SM.set('equippedItems', Character.equippedItems);
		$SM.set('inventory', Character.inventory);
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
		$SM.set('perks', Character.perks)
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