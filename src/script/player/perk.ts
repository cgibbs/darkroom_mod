// generic perk parameters, for reference
import { _ } from "../../lib/translate";
import { $SM } from "../state_manager";
var perk = {
    name: 'perk name',
    text: _('a tooltip description of the perk'),
    fullText: [
        _('This is a more in-depth description of the perk.'),
        _('It gives you the possibility of using multiple lines.')],
    isActive: function(extraParams) { },
    statBonuses: {
        'Speed': 0,
		'Perception': 0,
		'Resilience': 0,
		'Ingenuity': 0,
		'Toughness': 0
    },
    // -1 for non-time-constrained effect
    timeLeft: -1
}

// example perks; it's a good idea to define these in one unified location, I think,
// but these ones aren't meant to be used

// acquired from listening to that one Eddie Rabbitt song
// also used for non-stat stuff by Events in Road to Outpost, Vampire Den, and Goth IHOP
var rainyNight = {
    name: "Love a Rainy Night",
    text: _("You feel at home in the rain and the dark"),
    isActive: function(extraParams) {
        return ($SM.get('weather.rainy') && $SM.get('timeOfDay.night'));
    },
    // can be flat values OR functions
    statBonuses: {
        'Speed': 0,
		'Perception': 1,
		'Resilience': 0,
		'Ingenuity': function(rawStats) { return (Math.round(rawStats['Perception'] * .2) || 1 ); },
		'Toughness': 0
    },
    timeLeft: -1
}

// acquired from using a Glowing Permanent Marker
// no stats, used as flag for lucky events and for entering 
var markedByDestiny = {
    name: "Marked by Destiny",
    text: _("Destiny did this to you"),
    fullText: [
        _("You have been marked as something special by the universe."),
        _("It seems to be a temporary mark, though, so you'd better hurry up and do something cool.")
    ],
    isActive: function(extraParams) {
        return true; // can also just do isActive: true, but this is good practice
    },
    statBonuses: {
        'Speed': 0,
		'Perception': 0,
		'Resilience': 0,
		'Ingenuity': 0,
		'Toughness': 0
    },
    timeLeft: 20
}