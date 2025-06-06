// all items go here, so that nothing silly happens in the event that they get put in Local Storage
// as part of the state management code; please save item names to the inventory, and then refer to 
// the item list via the item name
import { Events } from "../events";
import { Character } from "./character";
import { _ } from "../../lib/translate";
import { $SM } from "../state_manager";
import { Notifications } from "../notifications";
import { Item } from "./item";

// Details for all in-game items; the Character inventory only holds item IDs
// and amounts
export const ItemList: {[id: string]: Item} = {
    "Liz.weirdBook": {
        name: 'Weird Book',
        pluralName: 'Weird Books',
        text: _('A book you found at Liz\'s place. Supposedly has information about Chadtopia.'),
        onUse: function() { 
            Events.startEvent({
                title:  _("A Brief History of Chadtopia"),
                scenes: {
                    start: {
                        text: [
                            _('This book is pretty boring, but you manage to learn a bit more in spite of your short attention span.'),
                            _('For example, you learn that "Chadtopia" doesn\'t have a capital \'T\'. That\'s pretty cool, huh?'),
                            _('... What were you doing again?')
                        ],
                        buttons: {
                            'okay': {
                                text: _('Something cooler than reading, probably'),
                                onChoose: () => Character.addToInventory("Liz.boringBook"),
                                nextScene: 'end'
                            }
                        }
                    }
                }
            })
        },
        destroyOnUse: true,
        destroyable: false
    },

    "Liz.boringBook": {
        name: '"A Brief History of Chadtopia"',
        pluralName: 'Multiple copies of "A Brief History of Chadtopia"',
        text: _('Man, this book is boring.'),
        onUse: function() {
            Events.startEvent({
                title: _("A Brief Summary of a Brief History of Chadtopia"),
                scenes: {
                    start: {
                        text: [_('It\'s still just as boring as when you last tried to read it.')],
                        buttons: {
                            'okay': {
                                text: _('Dang.'),
                                nextScene: 'end'
                            }
                        }
                    }
                }
            })
        },
        destroyOnUse: false,
        destroyable: false
    },
    "Stranger.smoothStone": {
        name: 'a smooth black stone',
        pluralName: 'smooth black stones',
        text: _('It\'s weirdly eerie'),
        onUse: function() {
            if (!$SM.get('knowledge.Stranger.smoothStone')) {
                Notifications.notify(null, 'You have no idea what to do with this thing.');
                return;
            }
            Events.startEvent({
                title: _("A smooth black stone"),
                scenes: {
                    start: {
                        text: [_("I'm genuinely not sure how you got to this event, but please let me know via GitHub issue, you little stinker.")],
                        buttons: {
                            'okay': {
                                text: _('I swear to do this, as a responsible citizen of Earth'),
                                nextScene: 'end'
                            }
                        }
                    }
                }
            })
        },
        destroyOnUse: false,
        destroyable: false
    },
    "Stranger.wrappedKnife": {
        name: 'a knife wrapped in cloth',
        pluralName: 'Knives wrapped in separate cloths',
        text: _('Man, I hope it\'s not all like, bloody on the blade and stuff.'),
        onUse: function() {
            Events.startEvent({
                title: _("A knife wrapped in cloth"),
                scenes: {
                    start: {
                        text: [_("You unwrap the knife carefully. It seems to be highly ornamented, and you could probably do some crimes with it.")],
                        buttons: {
                            'okay': {
                                text: _('Hell yeah, Adolf Loos style'),
                                onChoose: () => Character.addToInventory("Stranger.silverKnife"),
                                nextScene: 'end'
                            }
                        }
                    }
                }
            })
        },
        destroyOnUse: true,
        destroyable: false
    },
    "Stranger.silverKnife": {
        name: 'a silver knife',
        pluralName: 'silver knives',
        text: _('Highly ornamented'),
        onUse: function() {
            Events.startEvent({
                title: _("A silver knife"),
                scenes: {
                    start: {
                        text: [
                            _("One day you'll be able to equip this, but right now that functionality isn't present."),
                            _("Please politely leave the premises without acknowledging this missing feature.")
                        ],
                        buttons: {
                            'okay': {
                                text: _('You got it, chief'),
                                nextScene: 'end'
                            }
                        }
                    }
                }
            })
        },
        destroyOnUse: false,
        destroyable: false
    },
    "Stranger.clothBundle": {
        name: 'a bundle of cloth',
        pluralName: 'bundles of cloth',
        text: _('What lies within?'),
        onUse: function() {
            Events.startEvent({
                title: _("A bundle of cloth"),
                scenes: {
                    start: {
                        text: [
                            _("One day you'll be able to use this item, but right now that functionality isn't present."),
                            _("Please politely leave the premises without acknowledging this missing feature.")
                        ],
                        buttons: {
                            'okay': {
                                text: _('You got it, chief'),
                                nextScene: 'end'
                            }
                        }
                    }
                }
            })
        },
        destroyOnUse: false,
        destroyable: false
    },
    "Stranger.coin": {
        name: 'A strange coin',
        pluralName: 'strange coins',
        text: _('Both sides depict the same image'),
        onUse: function() {
            Events.startEvent({
                title: _("A strange coin"),
                scenes: {
                    start: {
                        text: [
                            _("One day you'll be able to use this item, but right now that functionality isn't present."),
                            _("Please politely leave the premises without acknowledging this missing feature.")
                        ],
                        buttons: {
                            'okay': {
                                text: _('You got it, chief'),
                                nextScene: 'end'
                            }
                        }
                    }
                }
            })
        },
        destroyOnUse: false,
        destroyable: false
    },
    "Captain.supplies": {
        name: 'Supplies for the Mayor',
        text: 'They\'re heavy, but not in a way that impacts gameplay',
        onUse: function() {
            Events.startEvent({
                title: _("Supplies for the Mayor"),
                scenes: {
                    start: {
                        text: [
                            _("A big box of stuff for the village. Looks like raw materials, mostly."),
                            _("I should really take this back to the Mayor.")
                        ],
                        buttons: {
                            'okay': {
                                text: _('Okay'),
                                nextScene: 'end'
                            }
                        }
                    }
                }
            })
        },
        destroyOnUse: false,
        destroyable: false
    },
    "oldLady.Candy": {
        name: 'a piece of hard candy',
        pluralName: 'pieces of hard candy',
        text: 'Given to you by a nice old woman in a carriage',
        onUse: function() {
            Notifications.notify(null, 'You pop the hard candy into your mouth. A few minutes ' 
                + 'later, it\'s gone, leaving behind only a mild sense of guilt about not ' 
                + 'calling your grandma more often.')
        },
        destroyOnUse: true,
        destroyable: true
    },
    "gambler.Prize": {
        name: 'true name of the gambler',
        text: 'You won this in a dice game',
        onUse: function() {
            Notifications.notify(null, 'This item has great value, but not here and now.')
        },
        destroyOnUse: false,
        destroyable: false
    }
}
