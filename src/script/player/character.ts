import { $SM } from "../state_manager";
import { Button } from "../Button";
import { ItemList } from "./itemList";
import { Events } from "../events";
import { Notifications } from "../notifications";
import { _ } from "../../lib/translate";
import { QuestLog } from "./questLog";

export const Character = {
	inventory: {}, // dictionary using item name as key
	questStatus: {}, // dictionary using quest name as key, and integer quest phase as value
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
	
	init: function(options?) {
		this.options = $.extend(
			this.options,
			options
		);
		
		// create the character box
		const elem = $('<div>').attr({
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
			Character.rawStats = $SM.get('character.rawStats') as any;
		}

		if (!$SM.get('character.perks')) {
            $SM.set('character.perks', Character.perks);
        } else {
			Character.perks = $SM.get('character.perks') as any;
		}

		if (!$SM.get('character.inventory')) {
            $SM.set('character.inventory', Character.inventory);
        } else {
			Character.inventory = $SM.get('character.inventory') as any;
		}

		if (!$SM.get('character.equippedItems')) {
            $SM.set('character.equippedItems', Character.equippedItems);
        } else {
			Character.equippedItems = $SM.get('character.equippedItems') as any;
		}

		if (!$SM.get('character.questStatus')) {
            $SM.set('character.questStatus', Character.questStatus);
        } else {
			Character.questStatus = $SM.get('character.questStatus') as any;
		}

        $('<div>').text('Character').attr('id', 'title').appendTo('div#character');

		// TODO: replace this with derived stats
        for(var stat in $SM.get('character.rawstats') as any) {
            $('<div>').text(stat + ': ' + $SM.get('character.rawstats.' + stat)).appendTo('div#character');
        }

		$('<div>').attr('id', 'buttons').css("margin-top", "20px").appendTo('div#character');
		var inventoryButton = Button.Button({
			id: "inventory",
			text: "Inventory",
			click: Character.openInventory
		}).appendTo($('#buttons', 'div#character'));
		
		var questLogButton = Button.Button({
			id: "questLog",
			text: "Quest Log",
			click: Character.openQuestLog
		}).appendTo($('#buttons', 'div#character'));

		// @ts-ignore
		window.Character = this;
	},
	
	options: {}, // Nothing for now
	
	elem: null,

	inventoryDisplay: null as any,
	questLogDisplay: null as any,

	openInventory: function() {
		// creating a handle for later access, such as closing inventory
		Character.inventoryDisplay = $('<div>').attr('id', 'inventory').addClass('eventPanel').css('opacity', '0');
		var inventoryDisplay = Character.inventoryDisplay;
		Character.inventoryDisplay
		// set up click and hover handlers for inventory items
		.on("click", "#item", function() {
			Character.useInventoryItem($(this).data("name"));
			Character.closeInventory();
		}).on("mouseenter", "#item", function() {
			var tooltip = $("<div id='tooltip' class='tooltip'>" + ItemList[$(this).data("name")].text + "</div>")
			.attr('data-name', item);
			tooltip.appendTo($(this));
		}).on("mouseleave", "#item", function() {
			$("#tooltip", "#" + $(this).data("name")).fadeOut().remove();
		});
		$('<div>').addClass('eventTitle').text('Inventory').appendTo(inventoryDisplay);
		var inventoryDesc = $('<div>').text("Click things in the list to use them.")
			.hover(function() {
				var tooltip = $("<div id='tooltip' class='tooltip'>" + "Not this, though." + "</div>");
    			tooltip.appendTo(inventoryDesc);
			}, function() {
				$("#tooltip").fadeOut().remove();
			})
			.on("click", function() {
				Notifications.notify(null, _("I bet you think you're pretty funny, huh? Clicking the thing I said wasn't clickable?"));
			})
			.css("margin-bottom", "20px")
			.appendTo(inventoryDisplay);
		
		for(var item in Character.inventory) {
			// make the inventory count look a bit nicer
			var inventoryElem = $('<div>')
			.attr('id', 'item')
			.attr('data-name', item)
			.text(ItemList[item].name  + '  (x' + Character.inventory[item].toString() + ')')
			.appendTo(inventoryDisplay);
		}

		// TODO: make this CSS an actual class somewhere, I'm sure I'll need it again
		$('<div>').attr('id', 'buttons').css("margin-top", "20px").appendTo(inventoryDisplay);
		var b = 
		//new 
		Button.Button({
			id: "closeInventory",
			text: "Close",
			click: Character.closeInventory
		}).appendTo($('#buttons', inventoryDisplay));
		$('div#wrapper').append(inventoryDisplay);
		inventoryDisplay.animate({opacity: 1}, Events._PANEL_FADE, 'linear');
	},

	closeInventory: function() {
		Character.inventoryDisplay.empty();
		Character.inventoryDisplay.remove();
	},

	addToInventory: function(item, amount=1) {
		if (Character.inventory[item]) {
			Character.inventory[item] += amount;
		} else {
			Character.inventory[item] = amount;
		}

		Notifications.notify(null, "Added " + ItemList[item].name + " to inventory.")
		$SM.set('inventory', Character.inventory);
	},


	removeFromInventory: function(item, amount=1) {
		if (Character.inventory[item]) Character.inventory[item] -= amount;
		if (Character.inventory[item] < 1) {
			delete Character.inventory[item];
		}

		Notifications.notify(null, "Removed " + ItemList[item].name + " from inventory.")
		$SM.set('inventory', Character.inventory);
	},

	useInventoryItem: function(item) {
		if (Character.inventory[item] && Character.inventory[item] > 0) {
			// use the effect in the inventory; just in case a name matches but the effect
			// does not, assume the inventory item is the source of truth
			ItemList[item].onUse();
			if (typeof(ItemList[item].destroyOnUse) == "function" && ItemList[item].destroyOnUse()) {
				Character.removeFromInventory(item);
			} else if (ItemList[item].destroyOnUse) {
				Character.removeFromInventory(item);
			}
		}

		$SM.set('inventory', Character.inventory);
	},

	equipItem: function(item) {
		if (ItemList[item].slot && Character.equippedItems[ItemList[item].slot] !== undefined) {
			Character.addToInventory(Character.equippedItems[ItemList[item].slot]);
			Character.equippedItems[ItemList[item].slot] = item;
			if (ItemList[item].onEquip) {
				ItemList[item].onEquip();
			}
			Character.applyEquipmentEffects();
		}

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

		
		$SM.set('perks', Character.perks)
	},

	openQuestLog: function() {
		// creating a handle for later access, such as closing quest log
		Character.questLogDisplay = $('<div>').attr('id', 'quest').addClass('eventPanel').css('opacity', '0');
		var questLogDisplay = Character.questLogDisplay;
		Character.questLogDisplay
		// set up click and hover handlers for quests
		.on("click", "#quest", function() {
			Character.displayQuest($(this).data("name"));
		});
		$('<div>').addClass('eventTitle').text('Quest Log').appendTo(questLogDisplay);
		var questLogDesc = $('<div>').text("Click quest names to see more info.")
			.css("margin-bottom", "20px")
			.appendTo(questLogDisplay);
		
		for(var quest in Character.questStatus) {
			var questElem = $('<div>')
			.attr('id', "quest")
			.attr('data-name', quest)
			.text(QuestLog[quest].name)
			.appendTo(questLogDisplay);
			if (Character.questStatus[quest] == -1) {
				questElem
				// I want this to be not struck through, but that's too annoying to worry
				// about right now
				// .prepend("DONE ")
				.wrap("<strike>");
			}
		}

		// TODO: make this CSS an actual class somewhere, I'm sure I'll need it again
		$('<div>').attr('id', 'buttons').css("margin-top", "20px").appendTo(questLogDisplay);
		var b = Button.Button({
			id: "closeQuestLog",
			text: "Close",
			click: Character.closeQuestLog
		}).appendTo($('#buttons', questLogDisplay));
		$('div#wrapper').append(questLogDisplay);
		questLogDisplay.animate({opacity: 1}, Events._PANEL_FADE, 'linear');
	},

	displayQuest: function(quest: string) {
		const questLogDisplay = Character.questLogDisplay;
		questLogDisplay.empty();
		const currentQuest = QuestLog[quest];

		$('<div>').attr('id', 'quest').addClass('eventPanel').css('opacity', '0');
		$('<div>').addClass('eventTitle').text(currentQuest.name).appendTo(questLogDisplay);

		var questLogDesc = $('<div>').text(currentQuest.logDescription)
			.css("margin-bottom", "20px")
			.appendTo(questLogDisplay);

		if (Character.questStatus[quest] as number == -1) {
			var phaseDesc = $('<div>').text("This quest is complete!")
			.css("margin-bottom", "10px")
			.appendTo(questLogDisplay);
		}

		for (var i = 0; i <= (Character.questStatus[quest] as number); i++) {
			var phaseDesc = $('<div>').text(currentQuest.phases[i].description)
			.css("margin-bottom", "10px")
			.appendTo(questLogDisplay);
			var complete = true;
			for (var j = 0; j < Object.keys(currentQuest.phases[i].requirements).length; j++) {
				var requirementsDesc = $('<div>').text(currentQuest.phases[i].requirements[j].renderRequirement())
					.css("margin-bottom", "20px")
					.css("margin-left", "20px")
					.css('font-style', 'italic')
					.appendTo(questLogDisplay);
				if (!currentQuest.phases[i].requirements[j].isComplete()) complete = false;
			}
			if (complete) {
				phaseDesc.wrap("<strike>");
			}
		}

		// TODO: make this CSS an actual class somewhere, I'm sure I'll need it again
		$('<div>').attr('id', 'buttons').css("margin-top", "20px").appendTo(questLogDisplay);

		var b = Button.Button({
			id: "backToQuestLog",
			text: "Back to Quest Log",
			click: Character.backToQuestLog
		}).appendTo($('#buttons', questLogDisplay));

		var b = Button.Button({
			id: "closeQuestLog",
			text: "Close",
			click: Character.closeQuestLog
		}).appendTo($('#buttons', questLogDisplay));
	},

	closeQuestLog: function() {
		Character.questLogDisplay.empty();
		Character.questLogDisplay.remove();
	},

	backToQuestLog: function() {
		Character.closeQuestLog();
		Character.openQuestLog();
	},

	setQuestStatus: function(quest, phase) {
		// might be a good idea to check for linear quest progression here?
		if (QuestLog[quest] !== undefined) {
			Character.questStatus[quest] = phase;

			Notifications.notify(null, "Quest Log updated.");
			$SM.set('questStatus', Character.questStatus);
		}
	},

	checkQuestStatus: function(quest) {
		const currentPhase = QuestLog[quest].phases[Character.questStatus[quest]];

		if (currentPhase === undefined) return;

		var complete = true;
		for (var i = 0; i < Object.keys(currentPhase.requirements).length; i++) {
			if (!currentPhase.requirements[i].isComplete())
				complete = false;
		}

		// if there is a next phase, set questStatus to it
		if (QuestLog[quest].phases[Character.questStatus[quest] + 1] !== undefined) {
			Character.questStatus[quest] += 1;
		} else { // else set it to complete
			Character.questStatus[quest] = -1;
		}

		Notifications.notify(null, "Quest Log updated.");
		$SM.set('questStatus', Character.questStatus);
	},

	// apply equipment effects, which should all check against $SM state variables;
	// this should be called on basically every player action where a piece of gear
	// would do something or change an outcome; give extraParams to the effect being 
	// applied for anything that's relevant to the effect but not handled by $SM
	applyEquipmentEffects: function(extraParams?) {
		for (const item in Character.equippedItems) {
			if (ItemList[item].effects) {
				for (const effect in ItemList[item].effects) {
					// NOTE: currently this is good for applying perks and Notifying;
					// are there other situations where we'd want to apply effects,
					// or can we cover basically every case via those things?
					// @ts-ignore
					if (effect.isActive && effect.isActive(extraParams)) effect.apply(extraParams);
				}
			}
		}
	},

	// get stats after applying all equipment bonuses, perks, etc.
	getDerivedStats: function() {
		const derivedStats = structuredClone(Character.rawStats);
		for (const item in Character.equippedItems) {
			if (ItemList[item].statBonuses) {
				for (const stat in Object.keys(ItemList[item].statBonuses)) {
					if (typeof (ItemList[item].statBonuses[stat] == "function")) {
						derivedStats[stat] += ItemList[item].statBonuses[stat]();
					} else {
						derivedStats[stat] += ItemList[item].statBonuses[stat];
					}
				}
			}
		}

		for (const perk in Character.perks) {
			// @ts-ignore
			if (perk.statBonuses) {
				// @ts-ignore
				for (const stat in Object.keys(perk.statBonuses)) {
					// @ts-ignore
					if (typeof (perk.statBonuses[stat] == "function")) {
						// @ts-ignore
						derivedStats[stat] += perk.statBonuses[stat]();
					} else {
						// @ts-ignore
						derivedStats[stat] += perk.statBonuses[stat];
					}
				}
			}
		}

		return derivedStats;
	}
}