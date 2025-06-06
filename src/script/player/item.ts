import { _ } from "../../lib/translate";

export interface Item {
    name: string,
    pluralName?: string,
    text: string,
    fullText?: Array<string>,
    slot?: string,
    onEquip?: Function, 
    onUnequip?: Function,
    effects?: Array<Effect>,
    statBonuses?: Object,
    onUse: Function,
    destroyOnUse: Function | Boolean,
    destroyable: Boolean
}

export interface Effect {
    name: string,
    text: string,
    isVisible: Function,
    isActive: Function,
    apply: Function
}

// empty item for easy copy-pasting in future development
var emptyItem = {
    name: '',
    text: _(''),
    fullText: [
        _(''),
        _('')],
    slot: '',
    onEquip: function() { }, 
    onUnequip: function() { },
    effects: [ ],
    statBonuses: {
        'Speed': 0,
		'Perception': 0,
		'Resilience': 0,
		'Ingenuity': 0,
		'Toughness': 0
    },
    onUse: function() { },
    destroyOnUse: function() { },
    destroyable: false
}

// empty effect for easy copy-pasting in future development
var emptyEffect = {
    name: '',
    text: _(''),
    isVisible: function() { },
    isActive: function(extraParams) { },
    apply: function(extraParams) { }
}

// generic item parameters, for reference
var item = {
    name: 'item name',
    text: _('a tooltip description of the item'),
    fullText: [
        _('This is a more in-depth description of the item.'),
        _('It gives you the possibility of using multiple lines.')],
    // for gear only! having a slot marks an item as gear, so don't put it on non-equippables!
    slot: 'head',
    // for gear only! anything that happens outside of normal equipping stuff, 
    // e.g. curses, state changes, etc.
    onEquip: function() { }, 
    onUnequip: function() { },
    // for gear only! things that happen because the wearer is wearing them; this is checked for all
    // equipped items at various points via Character.checkEquipmentEffects()
    effects: [
        {
            name: 'effect name',
            text: _('an effect of some description'),
            // for hidden effects that are revealed with new player knowledge,
            // e.g. Sting glows when orcs are near; the first time that effect pops,
            // $SM.set('playerKnowledge.stingEffect'), or maybe something structured
            // better than that
            isVisible: function() { },
            // for effects that are conditional, e.g. if (encounterType == 'orc') 
            isActive: function(extraParams) { },
            // the actual effect, e.g. { notify('Sting glows blue'); }
            apply: function(extraParams) { }
        }
    ],
    // will be added to stats via Character.getDerivedStats();
    // can be flat values OR functions
    statBonuses: {
        'Speed': 0,
		'Perception': function(rawStats) { return (Math.round(rawStats['Perception'] * .2) || 1 ); },
		'Resilience': 0,
		'Ingenuity': 0,
		'Toughness': 0
    },
    // can be on gear items, but mainly for non-gear items; what happens when this item is used;
    // 
    onUse: function() { },
    // items being "used up" when used is common enough to not have it be a part of onUse 
    // for every single consumable item; check that in the Inventory function for using items 
    // and decrement the count there.
    // making this a function for stuff that has conditional destruction, such as an item with 
    // limited number of uses or an item that has a percentage chance to break
    destroyOnUse: function() { },
    // can the player discard the item? should default to false if not present
    destroyable: false
}