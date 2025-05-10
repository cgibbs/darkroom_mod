import { Events } from "../events"
import { $SM } from "../state_manager"
import { _ } from "../../lib/translate"
import { Character } from "../player/character"

export const Captain = {
	talkToCaptain: function() {
		Events.startEvent({
			title: _('The Captain\'s Tent'),
			scenes: {
				start: {
                    seenFlag: () => $SM.get('outpost.captain.haveMet'),
					nextScene: 'main',
					onLoad: () => $SM.set('outpost.captain.haveMet', 1),
					text: [
                        _('You enter the fanciest-looking tent in the Outpost. A large man with a toothbrush mustache and a severe frown looks up from his desk.'),
                        _('"Sir, you have entered the tent of Captain Finneas. What business do you have here?"')
                    ],
                    buttons: {
                        'askAboutSupplies': {
                            text: _('Ask About Supplies'),
                            nextScene: {1: 'askAboutSupplies'}
                        },
                        'askAboutCaptain': {
                            text: _('Ask About Captain'),
                            nextScene: {1: 'captainRamble'}
                        },
                        'leave': {
                            text: _('Leave'),
                            nextScene: 'end'
                        }
                    }
                },
                'main': {
                    text: [
                        _('The Captain greets you warmly.'),
                        _('"Ahh, yes, welcome back. What can I do for you?"')
                    ],
                    buttons: {
                        'askAboutSupplies': {
                            text: _('Ask About Supplies'),
                            nextScene: {1:'askAboutSupplies'},
                            onChoose: Captain.handleSupplies,
                            available: () => !$SM.get('outpost.captain.askedAboutSupplies')
                        },
                        'askAboutCaptain': {
                            text: _('Ask About Captain'),
                            nextScene: {1:'captainRamble'}
                        },
                        'leave': {
                            text: _('Leave'),
                            nextScene: 'end'
                        }
                    }
                },
                'captainRamble': {
                    text: [
                        _('The Captain\'s eyes gleam at the opportunity to run down his list of achievements.'),
                        _('"Why, I\'ll have you know that you stand in the presence of none other than Finneas J. Fobsley, Captain of the Royal Army\'s Fifth Division, the finest Division in His Majesty\'s service."'),
                        _('He puffs out his chest, drawing attention to his many medals.'),
                        _('"I have campaigned on behalf of Our Lordship across many lands, including The Far West, the northern borders of Umbershire and Pelingal, New Bellisia, and each of the Five Isles of the Pirrhian Sea."'),
                        _('He pauses for a moment, perhaps to see if you are suitably impressed, then continues.'),
                        _('"As Captain of the Fifth Division, I had the esteemed privilege of ensuring the safety of these lands for our fair citizens. I have been awarded many times over for my bravery in the face of utmost peril. For instance, during the Sea Campaign on Thyppe, Third of the Five Isles, we were ambushed while disembarking from our ship. Thinking quickly, I..."'),
                        _('The captain continues to ramble like this for several more minutes, giving you time to become much more familiar with the dirt under your fingernails.'),
                        _('"... and THAT, my good adventurer, is why I always keep fresh basil on hand."')
                    ],
                    buttons: {
                        'fascinating': {
                            text: _('Fascinating'),
                            nextScene: {1:'mainContinued'}
                        }
                    }
                },
                'mainContinued': {
                    text: [
                        _('The Captain shuffles his papers in a somewhat performative way.'),
                        _('"Was there something else you needed?"')
                    ],
                    buttons: {
                        'askAboutSupplies': {
                            text: _('Ask About Supplies'),
                            nextScene: {1:'askAboutSupplies'},
                            available: () => !$SM.get('outpost.captain.askedAboutSupplies')
                        },
                        'askAboutCaptain': {
                            text: _('Ask About Captain'),
                            nextScene: {1:'captainRamble'}
                        },
                        'leave': {
                            text: _('Leave'),
                            nextScene: 'end'
                        }
                    }
                },
                'askAboutSupplies': {
                    text: [
                        _('The Captain\'s eyes gleam with a mixture of realization and guilt.'),
                        _('"Ahh, yes, right, the supplies. I suppose the Mayor is still waiting for those. Have a look in that chest over there, it should have everything you need."'),
                        _('He indicates to a chest at the back of the room. You open the lid, revealing the supplies within.'),
                        _('You take the supplies.')
                    ],
                    buttons: {
                        'okay': {
                            text: _('Aite'),
                            nextScene: 'end'
                        }
                    }
                }
            }
        })
    },

    handleSupplies: function() {
        console.log('handling supplies');
        $SM.set('outpost.captain.askedAboutSupplies', 1);
        Character.addToInventory("Captain.supplies");
        // Character.setQuestStatus("mayorSupplies", 2);
        Character.checkQuestStatus("mayorSupplies");
    }
}