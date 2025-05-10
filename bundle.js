(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
// (function() {
Object.defineProperty(exports, "__esModule", { value: true });
exports._ = void 0;
// 	var translate = function(text)
// 	{
// 		var xlate = translateLookup(text);
// 		if (typeof xlate == "function")
// 		{
// 			xlate = xlate.apply(this, arguments);
// 		}
// 		else if (arguments.length > 1)
// 		{
// 			var aps = Array.prototype.slice;
// 			var args = aps.call( arguments, 1 );
// 			xlate = formatter(xlate, args);
// 		}
// 		return xlate;
// 	};
// 	// I want it available explicity as well as via the object
// 	translate.translate = translate;
// 	//from https://gist.github.com/776196 via http://davedash.com/2010/11/19/pythonic-string-formatting-in-javascript/ 
// 	var defaultFormatter = (function() {
// 		var re = /\{([^}]+)\}/g;
// 		return function(s, args) {
// 			return s.replace(re, function(_, match){ return args[match]; });
// 		};
// 	}());
// 	var formatter = defaultFormatter;
// 	translate.setFormatter = function(newFormatter)
// 	{
// 		formatter = newFormatter;
// 	};
// 	translate.format = function()
// 	{
// 		var aps = Array.prototype.slice;
// 		var s = arguments[0];
// 		var args = aps.call( arguments, 1 );
// 		return formatter(s, args);
// 	};
// 	var dynoTrans = null;
// 	translate.setDynamicTranslator = function(newDynoTrans)
// 	{
// 		dynoTrans = newDynoTrans;
// 	};
// 	var translation = null;
// 	translate.setTranslation = function(newTranslation)
// 	{
// 		translation = newTranslation;
// 	};
// 	function translateLookup(target)
// 	{
// 		if (translation == null || target == null)
// 		{
// 			return target;
// 		}
// 		if (target in translation == false)
// 		{
// 			if (dynoTrans != null)
// 			{
// 				return dynoTrans(target);
// 			}
// 			return target;
// 		}
// 		var result = translation[target];
// 		if (result == null)
// 		{
// 			return target;
// 		}
// 		return result;
// 	};
// 	window._ = translate;
// })();
// export const _ = window._;
var _ = function (s) { return s; };
exports._ = _;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
var engine_1 = require("./engine");
var translate_1 = require("../lib/translate");
exports.Button = {
    Button: function (options) {
        if (typeof options.cooldown == 'number') {
            this.data_cooldown = options.cooldown;
        }
        this.data_remaining = 0;
        if (typeof options.click == 'function') {
            this.data_handler = options.click;
        }
        var el = $('<div>')
            .attr('id', typeof (options.id) != 'undefined' ? options.id : "BTN_" + engine_1.Engine.getGuid())
            .addClass('button')
            .text(typeof (options.text) != 'undefined' ? options.text : "button")
            .click(function () {
            if (!$(this).hasClass('disabled')) {
                exports.Button.cooldown($(this));
                $(this).data("handler")($(this));
            }
        })
            .data("handler", typeof options.click == 'function' ? options.click : function () { engine_1.Engine.log("click"); })
            .data("remaining", 0)
            .data("cooldown", typeof options.cooldown == 'number' ? options.cooldown : 0);
        if (typeof (options.image) !== "undefined") {
            el.attr("style", "background-image: url(\"" + options.image + "\"); background-repeat: no-repeat; background-size: cover; height: 170px; color: white;text-shadow: 0px 0px 2px black");
        }
        el.append($("<div>").addClass('cooldown'));
        if (options.cost) {
            var ttPos = options.ttPos ? options.ttPos : "bottom right";
            var costTooltip = $('<div>').addClass('tooltip ' + ttPos);
            for (var k in options.cost) {
                $("<div>").addClass('row_key').text((0, translate_1._)(k)).appendTo(costTooltip);
                $("<div>").addClass('row_val').text(options.cost[k]).appendTo(costTooltip);
            }
            if (costTooltip.children().length > 0) {
                costTooltip.appendTo(el);
            }
        }
        if (options.width) {
            el.css('width', options.width);
        }
        return el;
    },
    setDisabled: function (btn, disabled) {
        if (btn) {
            if (!disabled && !btn.data('onCooldown')) {
                btn.removeClass('disabled');
            }
            else if (disabled) {
                btn.addClass('disabled');
            }
            btn.data('disabled', disabled);
        }
    },
    isDisabled: function (btn) {
        if (btn) {
            return btn.data('disabled') === true;
        }
        return false;
    },
    cooldown: function (btn) {
        var cd = btn.data("cooldown");
        if (cd > 0) {
            $('div.cooldown', btn).stop(true, true).width("100%").animate({ width: '0%' }, cd * 1000, 'linear', function () {
                var b = $(this).closest('.button');
                b.data('onCooldown', false);
                if (!b.data('disabled')) {
                    b.removeClass('disabled');
                }
            });
            btn.addClass('disabled');
            btn.data('onCooldown', true);
        }
    },
    clearCooldown: function (btn) {
        $('div.cooldown', btn).stop(true, true);
        btn.data('onCooldown', false);
        if (!btn.data('disabled')) {
            btn.removeClass('disabled');
        }
    }
};

},{"../lib/translate":1,"./engine":6}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Captain = void 0;
var events_1 = require("../events");
var state_manager_1 = require("../state_manager");
var translate_1 = require("../../lib/translate");
var character_1 = require("../player/character");
exports.Captain = {
    talkToCaptain: function () {
        events_1.Events.startEvent({
            title: (0, translate_1._)('The Captain\'s Tent'),
            scenes: {
                start: {
                    seenFlag: function () { return state_manager_1.$SM.get('outpost.captain.haveMet'); },
                    nextScene: 'main',
                    onLoad: function () { return state_manager_1.$SM.set('outpost.captain.haveMet', 1); },
                    text: [
                        (0, translate_1._)('You enter the fanciest-looking tent in the Outpost. A large man with a toothbrush mustache and a severe frown looks up from his desk.'),
                        (0, translate_1._)('"Sir, you have entered the tent of Captain Finneas. What business do you have here?"')
                    ],
                    buttons: {
                        'askAboutSupplies': {
                            text: (0, translate_1._)('Ask About Supplies'),
                            nextScene: { 1: 'askAboutSupplies' }
                        },
                        'askAboutCaptain': {
                            text: (0, translate_1._)('Ask About Captain'),
                            nextScene: { 1: 'captainRamble' }
                        },
                        'leave': {
                            text: (0, translate_1._)('Leave'),
                            nextScene: 'end'
                        }
                    }
                },
                'main': {
                    text: [
                        (0, translate_1._)('The Captain greets you warmly.'),
                        (0, translate_1._)('"Ahh, yes, welcome back. What can I do for you?"')
                    ],
                    buttons: {
                        'askAboutSupplies': {
                            text: (0, translate_1._)('Ask About Supplies'),
                            nextScene: { 1: 'askAboutSupplies' },
                            onChoose: exports.Captain.handleSupplies,
                            available: function () { return !state_manager_1.$SM.get('outpost.captain.askedAboutSupplies'); }
                        },
                        'askAboutCaptain': {
                            text: (0, translate_1._)('Ask About Captain'),
                            nextScene: { 1: 'captainRamble' }
                        },
                        'leave': {
                            text: (0, translate_1._)('Leave'),
                            nextScene: 'end'
                        }
                    }
                },
                'captainRamble': {
                    text: [
                        (0, translate_1._)('The Captain\'s eyes gleam at the opportunity to run down his list of achievements.'),
                        (0, translate_1._)('"Why, I\'ll have you know that you stand in the presence of none other than Finneas J. Fobsley, Captain of the Royal Army\'s Fifth Division, the finest Division in His Majesty\'s service."'),
                        (0, translate_1._)('He puffs out his chest, drawing attention to his many medals.'),
                        (0, translate_1._)('"I have campaigned on behalf of Our Lordship across many lands, including The Far West, the northern borders of Umbershire and Pelingal, New Bellisia, and each of the Five Isles of the Pirrhian Sea."'),
                        (0, translate_1._)('He pauses for a moment, perhaps to see if you are suitably impressed, then continues.'),
                        (0, translate_1._)('"As Captain of the Fifth Division, I had the esteemed privilege of ensuring the safety of these lands for our fair citizens. I have been awarded many times over for my bravery in the face of utmost peril. For instance, during the Sea Campaign on Thyppe, Third of the Five Isles, we were ambushed while disembarking from our ship. Thinking quickly, I..."'),
                        (0, translate_1._)('The captain continues to ramble like this for several more minutes, giving you time to become much more familiar with the dirt under your fingernails.'),
                        (0, translate_1._)('"... and THAT, my good adventurer, is why I always keep fresh basil on hand."')
                    ],
                    buttons: {
                        'fascinating': {
                            text: (0, translate_1._)('Fascinating'),
                            nextScene: { 1: 'mainContinued' }
                        }
                    }
                },
                'mainContinued': {
                    text: [
                        (0, translate_1._)('The Captain shuffles his papers in a somewhat performative way.'),
                        (0, translate_1._)('"Was there something else you needed?"')
                    ],
                    buttons: {
                        'askAboutSupplies': {
                            text: (0, translate_1._)('Ask About Supplies'),
                            nextScene: { 1: 'askAboutSupplies' },
                            available: function () { return !state_manager_1.$SM.get('outpost.captain.askedAboutSupplies'); }
                        },
                        'askAboutCaptain': {
                            text: (0, translate_1._)('Ask About Captain'),
                            nextScene: { 1: 'captainRamble' }
                        },
                        'leave': {
                            text: (0, translate_1._)('Leave'),
                            nextScene: 'end'
                        }
                    }
                },
                'askAboutSupplies': {
                    text: [
                        (0, translate_1._)('The Captain\'s eyes gleam with a mixture of realization and guilt.'),
                        (0, translate_1._)('"Ahh, yes, right, the supplies. I suppose the Mayor is still waiting for those. Have a look in that chest over there, it should have everything you need."'),
                        (0, translate_1._)('He indicates to a chest at the back of the room. You open the lid, revealing the supplies within.'),
                        (0, translate_1._)('You take the supplies.')
                    ],
                    buttons: {
                        'okay': {
                            text: (0, translate_1._)('Aite'),
                            nextScene: 'end'
                        }
                    }
                }
            }
        });
    },
    handleSupplies: function () {
        console.log('handling supplies');
        state_manager_1.$SM.set('outpost.captain.askedAboutSupplies', 1);
        character_1.Character.addToInventory("Captain.supplies");
        // Character.setQuestStatus("mayorSupplies", 2);
        character_1.Character.checkQuestStatus("mayorSupplies");
    }
};

},{"../../lib/translate":1,"../events":7,"../player/character":15,"../state_manager":18}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Liz = void 0;
var events_1 = require("../events");
var state_manager_1 = require("../state_manager");
var translate_1 = require("../../lib/translate");
var room_1 = require("../places/room");
var character_1 = require("../player/character");
exports.Liz = {
    setLizActive: function () {
        state_manager_1.$SM.set('village.lizActive', 1);
        state_manager_1.$SM.set('village.liz.canFindBook', 0);
        state_manager_1.$SM.set('village.liz.hasBook', 1);
        room_1.Room.updateButton();
    },
    talkToLiz: function () {
        events_1.Events.startEvent({
            title: (0, translate_1._)('Liz\'s house, at the edge of town'),
            scenes: {
                start: {
                    seenFlag: function () { return state_manager_1.$SM.get('village.liz.haveMet'); },
                    nextScene: 'main',
                    onLoad: function () { return state_manager_1.$SM.set('village.liz.haveMet', 1); },
                    text: [
                        (0, translate_1._)('You enter the building and are immediately plunged into a labyrinth of shelves haphazardly filled with books of all kinds. After a bit of searching, you find a side room where a woman with mousy hair and glasses is sitting at a writing desk. She\'s reading a large book that appears to include diagrams of some sort of plant. She looks up as you enter the room.'),
                        (0, translate_1._)('"Who the hell are you?"')
                    ],
                    buttons: {
                        'askAboutTown': {
                            text: (0, translate_1._)('Ask about Chadtopia'),
                            nextScene: { 1: 'chadtopiaRamble' }
                        },
                        'quest': {
                            text: (0, translate_1._)('Ask for a quest'),
                            nextScene: { 1: 'questRequest' }
                        },
                        'leave': {
                            text: (0, translate_1._)('Leave'),
                            nextScene: 'end'
                        }
                    }
                },
                'chadtopiaRamble': {
                    text: [
                        (0, translate_1._)('Liz looks at you for a moment before returning her gaze to the book in front of her.'),
                        (0, translate_1._)('"There\'s a book in here somewhere about the founding of Chadtopia. If you can find it, you\'re free to borrow it."')
                    ],
                    buttons: {
                        'okay': {
                            text: (0, translate_1._)('Okay, then.'),
                            nextScene: { 1: 'main' },
                            onChoose: function () { return state_manager_1.$SM.set('village.liz.canFindBook', true); }
                        }
                    }
                },
                'main': {
                    text: [(0, translate_1._)('Liz seems determined not to pay attention to you.')],
                    buttons: {
                        'askAboutTown': {
                            text: (0, translate_1._)('Ask about Chadtopia'),
                            nextScene: { 1: 'chadtopiaRamble' },
                            available: function () { return !state_manager_1.$SM.get('village.liz.canFindBook'); }
                        },
                        'quest': {
                            text: (0, translate_1._)('Ask for a quest'),
                            nextScene: { 1: 'questRequest' }
                        },
                        'findBook': {
                            text: (0, translate_1._)('Try to find the book'),
                            nextScene: { 1: 'findBook' },
                            // TODO: a "visible" flag would be good here, for situations where an option
                            //   isn't yet known to the player
                            visible: function () { return state_manager_1.$SM.get('village.liz.canFindBook'); },
                            available: function () { return (state_manager_1.$SM.get('village.liz.canFindBook') > 0) && (state_manager_1.$SM.get('village.liz.hasBook')); }
                        },
                        'leave': {
                            text: (0, translate_1._)('Leave'),
                            nextScene: 'end'
                        }
                    }
                },
                'findBook': {
                    text: [
                        (0, translate_1._)('Leaving Liz to her business, you wander around amidst the books, wondering how you\'ll ever manage to find what you\'re looking for in all this unorganized mess.'),
                        (0, translate_1._)('Fortunately, the creator of this game doesn\'t feel like it\'d be very interesting to make this into a puzzle, so you spot the book on a nearby shelf and grab it.')
                    ],
                    buttons: {
                        'sick': {
                            text: (0, translate_1._)('Oh, sick'),
                            nextScene: 'end',
                            onChoose: function () {
                                // $SM.set('stores.Weird Book', 1);
                                character_1.Character.addToInventory("Liz.weirdBook");
                                state_manager_1.$SM.set('village.liz.hasBook', 0);
                            }
                        }
                    }
                },
                'questRequest': {
                    text: [
                        (0, translate_1._)('Liz lets out an annoyed sigh.'),
                        (0, translate_1._)('"Oh brave adventurer, I seem to have lost my patience. When last I saw it, it was somewhere outside of this building. Wouldst thou recover that which has been stolen from me?"')
                    ],
                    buttons: {
                        'okay': {
                            text: (0, translate_1._)('Okay, jeez, I get it'),
                            nextScene: { 1: 'main' }
                        }
                    }
                }
            }
        });
    }
};

},{"../../lib/translate":1,"../events":7,"../places/room":14,"../player/character":15,"../state_manager":18}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mayor = void 0;
var events_1 = require("../events");
var state_manager_1 = require("../state_manager");
var translate_1 = require("../../lib/translate");
var liz_1 = require("./liz");
var road_1 = require("../places/road");
var character_1 = require("../player/character");
exports.Mayor = {
    talkToMayor: function () {
        events_1.Events.startEvent({
            title: (0, translate_1._)('Meet the Mayor'),
            scenes: {
                start: {
                    seenFlag: function () { return state_manager_1.$SM.get('village.mayor.haveMet'); },
                    nextScene: 'main',
                    onLoad: function () { return state_manager_1.$SM.set('village.mayor.haveMet', 1); },
                    text: [
                        (0, translate_1._)('The mayor smiles at you and says:'),
                        (0, translate_1._)('"Welcome to Chadtopia, I\'m the mayor of these here parts. What can I do you for?"')
                    ],
                    buttons: {
                        'askAboutTown': {
                            text: (0, translate_1._)('Ask about Chadtopia'),
                            nextScene: { 1: 'chadtopiaRamble' }
                        },
                        'quest': {
                            text: (0, translate_1._)('Ask for a quest'),
                            nextScene: { 1: 'quest' }
                        },
                        'leave': {
                            text: (0, translate_1._)('Leave'),
                            nextScene: 'end'
                        }
                    }
                },
                'chadtopiaRamble': {
                    text: [
                        (0, translate_1._)('The mayor pushes the brim of his hat up.'),
                        (0, translate_1._)('"Well, we\'ve always been here, long as I can remember. I took over after the last mayor died, but he would have been the only person with any historical knowledge of this village."'),
                        (0, translate_1._)('He pauses for a moment and tousles some of the wispy hairs that have poked out from under the raised hat.'),
                        (0, translate_1._)('"Actually, you might ask Liz, she has a bunch of her mother\'s books from way back when. She lives at the edge of town."')
                    ],
                    buttons: {
                        'okay': {
                            text: (0, translate_1._)('Okay, then.'),
                            nextScene: { 1: 'main' },
                            onChoose: liz_1.Liz.setLizActive
                        }
                    }
                },
                'main': {
                    text: [
                        (0, translate_1._)('The mayor says:'),
                        (0, translate_1._)('"Anyway, what ELSE can I do you for?"'),
                        (0, translate_1._)('He chuckles at his clever use of language.')
                    ],
                    buttons: {
                        'askAboutTown': {
                            text: (0, translate_1._)('Ask about Chadtopia'),
                            nextScene: { 1: 'chadtopiaRamble' },
                            // image: "assets/cards/little_wolf.png"
                        },
                        'quest': {
                            text: (0, translate_1._)('Ask for a quest'),
                            nextScene: { 1: 'quest' },
                            available: function () {
                                // not available if mayorSupplies is in-progress
                                return (character_1.Character.questStatus["mayorSupplies"] == "undefined");
                            }
                            // re-add this condition later, we need to send them to a different
                            //   quest dialog if they already did the first quest
                            // || (Character.questStatus["mayorSupplies"] == -1)
                            // image: "assets/cards/joker.png"
                        },
                        'giveSupplies': {
                            text: (0, translate_1._)('Hand over the supplies'),
                            nextScene: { 1: 'giveSupplies' },
                            available: function () {
                                return (typeof (state_manager_1.$SM.get('village.mayor.haveGivenSupplies')) == "undefined")
                                    && (character_1.Character.questStatus["mayorSupplies"] !== "undefined")
                                    && character_1.Character.inventory["Captain.supplies"];
                            },
                            visible: function () {
                                return (character_1.Character.questStatus["mayorSupplies"] !== "undefined");
                            },
                            onChoose: function () {
                                character_1.Character.removeFromInventory("Captain.supplies");
                                state_manager_1.$SM.set('village.mayor.haveGivenSupplies', 1);
                                character_1.Character.checkQuestStatus("mayorSupplies");
                            }
                        },
                        'leave': {
                            text: (0, translate_1._)('Leave'),
                            nextScene: 'end',
                            // image: "assets/cards/raven.png"
                        }
                    }
                },
                'quest': {
                    text: [
                        (0, translate_1._)('The mayor thinks for a moment.'),
                        (0, translate_1._)('"You know, it\'s been a while since our last shipment of supplies arrived from the outpost. Mind looking into that for us?"'),
                        (0, translate_1._)('"You can ask about it at the outpost, or just wander around on the road and see if you find any clues. Either way, it\'s time to hit the road, adventurer!"')
                    ],
                    buttons: {
                        'alrighty': {
                            text: (0, translate_1._)('Alrighty'),
                            nextScene: { 1: 'main' },
                            onChoose: exports.Mayor.startSuppliesQuest
                        }
                    }
                },
                'giveSupplies': {
                    text: [
                        (0, translate_1._)('The mayor smiles, and the edges of his eyes crinkle.'),
                        (0, translate_1._)('"Thank you, brave adventurer! With these supplies, the village can once again thrive."'),
                        (0, translate_1._)('He takes them from you graciously, and promptly hands them off to some workers, who quickly erect a building that gives you a new button to click')
                    ],
                    buttons: {
                        'impressive': {
                            text: (0, translate_1._)('Impressive!'),
                            nextScene: 'end'
                        }
                    }
                }
            }
        });
    },
    startSuppliesQuest: function () {
        // if (!$SM.get('quest.supplies')) {
        // 	// 1 = started, 2 = next step, etc. until completed
        // 	$SM.set('quest.supplies', 1);
        // 	Road.init();
        // }
        if (typeof (character_1.Character.questStatus["mayorSupplies"]) == "undefined") {
            character_1.Character.setQuestStatus("mayorSupplies", 0);
            road_1.Road.init();
        }
    }
};

},{"../../lib/translate":1,"../events":7,"../places/road":13,"../player/character":15,"../state_manager":18,"./liz":4}],6:[function(require,module,exports){
"use strict";
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = void 0;
var translate_1 = require("../lib/translate");
var state_manager_1 = require("./state_manager");
var notifications_1 = require("./notifications");
var events_1 = require("./events");
var room_1 = require("./places/room");
var character_1 = require("./player/character");
var weather_1 = require("./weather");
var road_1 = require("./places/road");
var outpost_1 = require("./places/outpost");
exports.Engine = window.Engine = {
    SITE_URL: encodeURIComponent("http://adarkroom.doublespeakgames.com"),
    VERSION: 1.3,
    MAX_STORE: 99999999999999,
    SAVE_DISPLAY: 30 * 1000,
    GAME_OVER: false,
    //object event types
    topics: {},
    Perks: {
        'boxer': {
            name: (0, translate_1._)('boxer'),
            desc: (0, translate_1._)('punches do more damage'),
            /// TRANSLATORS : means with more force.
            notify: (0, translate_1._)('learned to throw punches with purpose')
        },
        'martial artist': {
            name: (0, translate_1._)('martial artist'),
            desc: (0, translate_1._)('punches do even more damage.'),
            notify: (0, translate_1._)('learned to fight quite effectively without weapons')
        },
        'unarmed master': {
            /// TRANSLATORS : master of unarmed combat
            name: (0, translate_1._)('unarmed master'),
            desc: (0, translate_1._)('punch twice as fast, and with even more force'),
            notify: (0, translate_1._)('learned to strike faster without weapons')
        },
        'barbarian': {
            name: (0, translate_1._)('barbarian'),
            desc: (0, translate_1._)('melee weapons deal more damage'),
            notify: (0, translate_1._)('learned to swing weapons with force')
        },
        'slow metabolism': {
            name: (0, translate_1._)('slow metabolism'),
            desc: (0, translate_1._)('go twice as far without eating'),
            notify: (0, translate_1._)('learned how to ignore the hunger')
        },
        'desert rat': {
            name: (0, translate_1._)('desert rat'),
            desc: (0, translate_1._)('go twice as far without drinking'),
            notify: (0, translate_1._)('learned to love the dry air')
        },
        'evasive': {
            name: (0, translate_1._)('evasive'),
            desc: (0, translate_1._)('dodge attacks more effectively'),
            notify: (0, translate_1._)("learned to be where they're not")
        },
        'precise': {
            name: (0, translate_1._)('precise'),
            desc: (0, translate_1._)('land blows more often'),
            notify: (0, translate_1._)('learned to predict their movement')
        },
        'scout': {
            name: (0, translate_1._)('scout'),
            desc: (0, translate_1._)('see farther'),
            notify: (0, translate_1._)('learned to look ahead')
        },
        'stealthy': {
            name: (0, translate_1._)('stealthy'),
            desc: (0, translate_1._)('better avoid conflict in the wild'),
            notify: (0, translate_1._)('learned how not to be seen')
        },
        'gastronome': {
            name: (0, translate_1._)('gastronome'),
            desc: (0, translate_1._)('restore more health when eating'),
            notify: (0, translate_1._)('learned to make the most of food')
        }
    },
    options: {
        state: null,
        debug: true,
        log: true,
        dropbox: false,
        doubleTime: false
    },
    _debug: false,
    init: function (options) {
        this.options = $.extend(this.options, options);
        this._debug = this.options.debug;
        this._log = this.options.log;
        // Check for HTML5 support
        if (!exports.Engine.browserValid()) {
            window.location = 'browserWarning.html';
        }
        // Check for mobile
        if (exports.Engine.isMobile()) {
            window.location = 'mobileWarning.html';
        }
        exports.Engine.disableSelection();
        if (this.options.state != null) {
            window.State = this.options.state;
        }
        else {
            exports.Engine.loadGame();
        }
        $('<div>').attr('id', 'locationSlider').appendTo('#main');
        var menu = $('<div>')
            .addClass('menu')
            .appendTo('body');
        if (typeof langs != 'undefined') {
            var customSelect = $('<span>')
                .addClass('customSelect')
                .addClass('menuBtn')
                .appendTo(menu);
            var selectOptions = $('<span>')
                .addClass('customSelectOptions')
                .appendTo(customSelect);
            var optionsList = $('<ul>')
                .appendTo(selectOptions);
            $('<li>')
                .text("language.")
                .appendTo(optionsList);
            $.each(langs, function (name, display) {
                $('<li>')
                    .text(display)
                    .attr('data-language', name)
                    .on("click", function () { exports.Engine.switchLanguage(this); })
                    .appendTo(optionsList);
            });
        }
        $('<span>')
            .addClass('lightsOff menuBtn')
            .text((0, translate_1._)('lights off.'))
            .click(exports.Engine.turnLightsOff)
            .appendTo(menu);
        $('<span>')
            .addClass('menuBtn')
            .text((0, translate_1._)('hyper.'))
            .click(function () {
            exports.Engine.options.doubleTime = !exports.Engine.options.doubleTime;
            if (exports.Engine.options.doubleTime)
                $(this).text((0, translate_1._)('classic.'));
            else
                $(this).text((0, translate_1._)('hyper.'));
        })
            .appendTo(menu);
        $('<span>')
            .addClass('menuBtn')
            .text((0, translate_1._)('restart.'))
            .click(exports.Engine.confirmDelete)
            .appendTo(menu);
        $('<span>')
            .addClass('menuBtn')
            .text((0, translate_1._)('share.'))
            .click(exports.Engine.share)
            .appendTo(menu);
        $('<span>')
            .addClass('menuBtn')
            .text((0, translate_1._)('save.'))
            .click(exports.Engine.exportImport)
            .appendTo(menu);
        $('<span>')
            .addClass('menuBtn')
            .text((0, translate_1._)('app store.'))
            .click(function () { window.open('https://itunes.apple.com/us/app/a-dark-room/id736683061'); })
            .appendTo(menu);
        $('<span>')
            .addClass('menuBtn')
            .text((0, translate_1._)('github.'))
            .click(function () { window.open('https://github.com/Continuities/adarkroom'); })
            .appendTo(menu);
        // subscribe to stateUpdates
        $.Dispatch('stateUpdate').subscribe(exports.Engine.handleStateUpdates);
        state_manager_1.$SM.init();
        notifications_1.Notifications.init();
        events_1.Events.init();
        room_1.Room.init();
        character_1.Character.init();
        weather_1.Weather.init();
        if (state_manager_1.$SM.get('road.open')) {
            road_1.Road.init();
        }
        if (state_manager_1.$SM.get('outpost.open')) {
            outpost_1.Outpost.init();
        }
        exports.Engine.saveLanguage();
        exports.Engine.travelTo(room_1.Room);
    },
    browserValid: function () {
        return (location.search.indexOf('ignorebrowser=true') >= 0 || (typeof Storage != 'undefined' && !oldIE));
    },
    isMobile: function () {
        return (location.search.indexOf('ignorebrowser=true') < 0 && /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent));
    },
    saveGame: function () {
        if (typeof Storage != 'undefined' && localStorage) {
            if (exports.Engine._saveTimer != null) {
                clearTimeout(exports.Engine._saveTimer);
            }
            if (typeof exports.Engine._lastNotify == 'undefined' || Date.now() - exports.Engine._lastNotify > exports.Engine.SAVE_DISPLAY) {
                $('#saveNotify').css('opacity', 1).animate({ opacity: 0 }, 1000, 'linear');
                exports.Engine._lastNotify = Date.now();
            }
            localStorage.gameState = JSON.stringify(State);
        }
    },
    loadGame: function () {
        try {
            var savedState = JSON.parse(localStorage.gameState);
            if (savedState) {
                window.State = savedState;
                exports.Engine.log("loaded save!");
            }
        }
        catch (e) {
            exports.Engine.log(e);
            window.State = {};
            state_manager_1.$SM.set('version', exports.Engine.VERSION);
            exports.Engine.event('progress', 'new game');
        }
    },
    exportImport: function () {
        events_1.Events.startEvent({
            title: (0, translate_1._)('Export / Import'),
            scenes: {
                start: {
                    text: [
                        (0, translate_1._)('export or import save data, for backing up'),
                        (0, translate_1._)('or migrating computers')
                    ],
                    buttons: {
                        'export': {
                            text: (0, translate_1._)('export'),
                            onChoose: exports.Engine.export64
                        },
                        'import': {
                            text: (0, translate_1._)('import'),
                            nextScene: { 1: 'confirm' }
                        },
                        'cancel': {
                            text: (0, translate_1._)('cancel'),
                            nextScene: 'end'
                        }
                    }
                },
                'confirm': {
                    text: [
                        (0, translate_1._)('are you sure?'),
                        (0, translate_1._)('if the code is invalid, all data will be lost.'),
                        (0, translate_1._)('this is irreversible.')
                    ],
                    buttons: {
                        'yes': {
                            text: (0, translate_1._)('yes'),
                            nextScene: { 1: 'inputImport' },
                            onChoose: exports.Engine.enableSelection
                        },
                        'no': {
                            text: (0, translate_1._)('no'),
                            nextScene: 'end'
                        }
                    }
                },
                'inputImport': {
                    text: [(0, translate_1._)('put the save code here.')],
                    textarea: '',
                    buttons: {
                        'okay': {
                            text: (0, translate_1._)('import'),
                            nextScene: 'end',
                            onChoose: exports.Engine.import64
                        },
                        'cancel': {
                            text: (0, translate_1._)('cancel'),
                            nextScene: 'end'
                        }
                    }
                }
            }
        });
    },
    generateExport64: function () {
        var string64 = Base64.encode(localStorage.gameState);
        string64 = string64.replace(/\s/g, '');
        string64 = string64.replace(/\./g, '');
        string64 = string64.replace(/\n/g, '');
        return string64;
    },
    export64: function () {
        exports.Engine.saveGame();
        var string64 = exports.Engine.generateExport64();
        exports.Engine.enableSelection();
        events_1.Events.startEvent({
            title: (0, translate_1._)('Export'),
            scenes: {
                start: {
                    text: [(0, translate_1._)('save this.')],
                    textarea: string64,
                    readonly: true,
                    buttons: {
                        'done': {
                            text: (0, translate_1._)('got it'),
                            nextScene: 'end',
                            onChoose: exports.Engine.disableSelection
                        }
                    }
                }
            }
        });
        exports.Engine.autoSelect('#description textarea');
    },
    import64: function (string64) {
        exports.Engine.disableSelection();
        string64 = string64.replace(/\s/g, '');
        string64 = string64.replace(/\./g, '');
        string64 = string64.replace(/\n/g, '');
        var decodedSave = Base64.decode(string64);
        localStorage.gameState = decodedSave;
        location.reload();
    },
    event: function (cat, act) {
        if (typeof ga === 'function') {
            ga('send', 'event', cat, act);
        }
    },
    confirmDelete: function () {
        events_1.Events.startEvent({
            title: (0, translate_1._)('Restart?'),
            scenes: {
                start: {
                    text: [(0, translate_1._)('restart the game?')],
                    buttons: {
                        'yes': {
                            text: (0, translate_1._)('yes'),
                            nextScene: 'end',
                            onChoose: exports.Engine.deleteSave
                        },
                        'no': {
                            text: (0, translate_1._)('no'),
                            nextScene: 'end'
                        }
                    }
                }
            }
        });
    },
    deleteSave: function (noReload) {
        if (typeof Storage != 'undefined' && localStorage) {
            window.State = {};
            localStorage.clear();
        }
        if (!noReload) {
            location.reload();
        }
    },
    share: function () {
        events_1.Events.startEvent({
            title: (0, translate_1._)('Share'),
            scenes: {
                start: {
                    text: [(0, translate_1._)('bring your friends.')],
                    buttons: {
                        'facebook': {
                            text: (0, translate_1._)('facebook'),
                            nextScene: 'end',
                            onChoose: function () {
                                window.open('https://www.facebook.com/sharer/sharer.php?u=' + exports.Engine.SITE_URL, 'sharer', 'width=626,height=436,location=no,menubar=no,resizable=no,scrollbars=no,status=no,toolbar=no');
                            }
                        },
                        'google': {
                            text: (0, translate_1._)('google+'),
                            nextScene: 'end',
                            onChoose: function () {
                                window.open('https://plus.google.com/share?url=' + exports.Engine.SITE_URL, 'sharer', 'width=480,height=436,location=no,menubar=no,resizable=no,scrollbars=no,status=no,toolbar=no');
                            }
                        },
                        'twitter': {
                            text: (0, translate_1._)('twitter'),
                            nextScene: 'end',
                            onChoose: function () {
                                window.open('https://twitter.com/intent/tweet?text=A%20Dark%20Room&url=' + exports.Engine.SITE_URL, 'sharer', 'width=660,height=260,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');
                            }
                        },
                        'reddit': {
                            text: (0, translate_1._)('reddit'),
                            nextScene: 'end',
                            onChoose: function () {
                                window.open('http://www.reddit.com/submit?url=' + exports.Engine.SITE_URL, 'sharer', 'width=960,height=700,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');
                            }
                        },
                        'close': {
                            text: (0, translate_1._)('close'),
                            nextScene: 'end'
                        }
                    }
                }
            }
        }, {
            width: '400px'
        });
    },
    findStylesheet: function (title) {
        for (var i = 0; i < document.styleSheets.length; i++) {
            var sheet = document.styleSheets[i];
            if (sheet.title == title) {
                return sheet;
            }
        }
        return null;
    },
    isLightsOff: function () {
        var darkCss = exports.Engine.findStylesheet('darkenLights');
        if (darkCss != null && !darkCss.disabled) {
            return true;
        }
        return false;
    },
    turnLightsOff: function () {
        var darkCss = exports.Engine.findStylesheet('darkenLights');
        if (darkCss == null) {
            $('head').append('<link rel="stylesheet" href="css/dark.css" type="text/css" title="darkenLights" />');
            $('.lightsOff').text((0, translate_1._)('lights on.'));
        }
        else if (darkCss.disabled) {
            darkCss.disabled = false;
            $('.lightsOff').text((0, translate_1._)('lights on.'));
        }
        else {
            $("#darkenLights").attr("disabled", "disabled");
            darkCss.disabled = true;
            $('.lightsOff').text((0, translate_1._)('lights off.'));
        }
    },
    // Gets a guid
    getGuid: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    activeModule: null,
    travelTo: function (module) {
        if (exports.Engine.activeModule != module) {
            var currentIndex = exports.Engine.activeModule ? $('.location').index(exports.Engine.activeModule.panel) : 1;
            $('div.headerButton').removeClass('selected');
            module.tab.addClass('selected');
            var slider = $('#locationSlider');
            var stores = $('#storesContainer');
            var panelIndex = $('.location').index(module.panel);
            var diff = Math.abs(panelIndex - currentIndex);
            slider.animate({ left: -(panelIndex * 700) + 'px' }, 300 * diff);
            if (state_manager_1.$SM.get('stores.wood') !== undefined) {
                // FIXME Why does this work if there's an animation queue...?
                stores.animate({ right: -(panelIndex * 700) + 'px' }, 300 * diff);
            }
            exports.Engine.activeModule = module;
            module.onArrival(diff);
            if (exports.Engine.activeModule == room_1.Room
            //  || Engine.activeModule == Path
            ) {
                // Don't fade out the weapons if we're switching to a module
                // where we're going to keep showing them anyway.
                if (module != room_1.Room
                // && module != Path
                ) {
                    $('div#weapons').animate({ opacity: 0 }, 300);
                }
            }
            if (module == room_1.Room
            //  || module == Path
            ) {
                $('div#weapons').animate({ opacity: 1 }, 300);
            }
            notifications_1.Notifications.printQueue(module);
        }
    },
    /* Move the stores panel beneath top_container (or to top: 0px if top_container
        * either hasn't been filled in or is null) using transition_diff to sync with
        * the animation in Engine.travelTo().
        */
    moveStoresView: function (top_container, transition_diff) {
        var stores = $('#storesContainer');
        // If we don't have a storesContainer yet, leave.
        if (typeof (stores) === 'undefined')
            return;
        if (typeof (transition_diff) === 'undefined')
            transition_diff = 1;
        if (top_container === null) {
            stores.animate({ top: '0px' }, { queue: false, duration: 300 * transition_diff });
        }
        else if (!top_container.length) {
            stores.animate({ top: '0px' }, { queue: false, duration: 300 * transition_diff });
        }
        else {
            stores.animate({
                top: top_container.height() + 26 + 'px'
            }, {
                queue: false,
                duration: 300 * transition_diff
            });
        }
    },
    log: function (msg) {
        if (this._log) {
            console.log(msg);
        }
    },
    updateSlider: function () {
        var slider = $('#locationSlider');
        slider.width((slider.children().length * 700) + 'px');
    },
    updateOuterSlider: function () {
        var slider = $('#outerSlider');
        slider.width((slider.children().length * 700) + 'px');
    },
    getIncomeMsg: function (num, delay) {
        return (0, translate_1._)("{0} per {1}s", (num > 0 ? "+" : "") + num, delay);
    },
    swipeLeft: function (e) {
        if (exports.Engine.activeModule.swipeLeft) {
            exports.Engine.activeModule.swipeLeft(e);
        }
    },
    swipeRight: function (e) {
        if (exports.Engine.activeModule.swipeRight) {
            exports.Engine.activeModule.swipeRight(e);
        }
    },
    swipeUp: function (e) {
        if (exports.Engine.activeModule.swipeUp) {
            exports.Engine.activeModule.swipeUp(e);
        }
    },
    swipeDown: function (e) {
        if (exports.Engine.activeModule.swipeDown) {
            exports.Engine.activeModule.swipeDown(e);
        }
    },
    disableSelection: function () {
        document.onselectstart = eventNullifier; // this is for IE
        document.onmousedown = eventNullifier; // this is for the rest
    },
    enableSelection: function () {
        document.onselectstart = eventPassthrough;
        document.onmousedown = eventPassthrough;
    },
    autoSelect: function (selector) {
        $(selector).focus().select();
    },
    handleStateUpdates: function (e) {
    },
    switchLanguage: function (dom) {
        var lang = $(dom).data("language");
        if (document.location.href.search(/[\?\&]lang=[a-z_]+/) != -1) {
            document.location.href = document.location.href.replace(/([\?\&]lang=)([a-z_]+)/gi, "$1" + lang);
        }
        else {
            document.location.href = document.location.href + ((document.location.href.search(/\?/) != -1) ? "&" : "?") + "lang=" + lang;
        }
    },
    saveLanguage: function () {
        var lang = decodeURIComponent((new RegExp('[?|&]lang=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
        if (lang && typeof Storage != 'undefined' && localStorage) {
            localStorage.lang = lang;
        }
    },
    setTimeout: function (callback, timeout, skipDouble) {
        if (exports.Engine.options.doubleTime && !skipDouble) {
            exports.Engine.log('Double time, cutting timeout in half');
            timeout /= 2;
        }
        return setTimeout(callback, timeout);
    }
};
function eventNullifier(e) {
    return $(e.target).hasClass('menuBtn');
}
function eventPassthrough(e) {
    return true;
}
function inView(dir, elem) {
    var scTop = $('#main').offset().top;
    var scBot = scTop + $('#main').height();
    var elTop = elem.offset().top;
    var elBot = elTop + elem.height();
    if (dir == 'up') {
        // STOP MOVING IF BOTTOM OF ELEMENT IS VISIBLE IN SCREEN
        return (elBot < scBot);
    }
    else if (dir == 'down') {
        return (elTop > scTop);
    }
    else {
        return ((elBot <= scBot) && (elTop >= scTop));
    }
}
function scrollByX(elem, x) {
    var elTop = parseInt(elem.css('top'), 10);
    elem.css('top', (elTop + x) + "px");
}
//create jQuery Callbacks() to handle object events 
$.Dispatch = function (id) {
    var callbacks, topic = id && exports.Engine.topics[id];
    if (!topic) {
        callbacks = jQuery.Callbacks();
        topic = {
            publish: callbacks.fire,
            subscribe: callbacks.add,
            unsubscribe: callbacks.remove
        };
        if (id) {
            exports.Engine.topics[id] = topic;
        }
    }
    return topic;
};
$(function () {
    exports.Engine.init();
});

},{"../lib/translate":1,"./events":7,"./notifications":11,"./places/outpost":12,"./places/road":13,"./places/room":14,"./player/character":15,"./state_manager":18,"./weather":19}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
/**
 * Module that handles the random event system
 */
var roadwander_1 = require("./events/roadwander");
var room_1 = require("./events/room");
var engine_1 = require("./engine");
var translate_1 = require("../lib/translate");
var state_manager_1 = require("./state_manager");
var notifications_1 = require("./notifications");
var Button_1 = require("./Button");
exports.Events = {
    _EVENT_TIME_RANGE: [3, 6], // range, in minutes
    _PANEL_FADE: 200,
    _FIGHT_SPEED: 100,
    _EAT_COOLDOWN: 5,
    _MEDS_COOLDOWN: 7,
    _LEAVE_COOLDOWN: 1,
    STUN_DURATION: 4000,
    BLINK_INTERVAL: false,
    EventPool: [],
    eventStack: [],
    _eventTimeout: 0,
    Locations: {},
    init: function (options) {
        this.options = $.extend(this.options, options);
        // Build the Event Pool
        exports.Events.EventPool = [].concat(room_1.EventsRoom, roadwander_1.EventsRoadWander);
        this.Locations["Room"] = room_1.EventsRoom;
        this.Locations["RoadWander"] = roadwander_1.EventsRoadWander;
        exports.Events.eventStack = [];
        //subscribe to stateUpdates
        // @ts-ignore
        $.Dispatch('stateUpdate').subscribe(exports.Events.handleStateUpdates);
    },
    options: {}, // Nothing for now
    activeScene: '',
    loadScene: function (name) {
        var _a;
        engine_1.Engine.log('loading scene: ' + name);
        exports.Events.activeScene = name;
        var scene = (_a = exports.Events.activeEvent()) === null || _a === void 0 ? void 0 : _a.scenes[name];
        // handles one-time scenes, such as introductions
        // maybe I can make a more explicit "introduction" logical flow to make this
        // a little more elegant, given that there will always be an "introduction" scene
        // that's only meant to be run a single time.
        if (scene.seenFlag && scene.seenFlag()) {
            exports.Events.loadScene(scene.nextScene);
            return;
        }
        // Scene reward
        if (scene.reward) {
            state_manager_1.$SM.addM('stores', scene.reward);
        }
        // onLoad
        if (scene.onLoad) {
            scene.onLoad();
        }
        // Notify the scene change
        if (scene.notification) {
            notifications_1.Notifications.notify(null, scene.notification);
        }
        $('#description', exports.Events.eventPanel()).empty();
        $('#buttons', exports.Events.eventPanel()).empty();
        exports.Events.startStory(scene);
    },
    drawFloatText: function (text, parent) {
        $('<div>').text(text).addClass('damageText').appendTo(parent).animate({
            'bottom': '50px',
            'opacity': '0'
        }, 300, 'linear', function () {
            $(this).remove();
        });
    },
    startStory: function (scene) {
        // Write the text
        var desc = $('#description', exports.Events.eventPanel());
        for (var i in scene.text) {
            $('<div>').text(scene.text[i]).appendTo(desc);
        }
        if (scene.textarea != null) {
            var ta = $('<textarea>').val(scene.textarea).appendTo(desc);
            if (scene.readonly) {
                // @ts-ignore
                ta.attr('readonly', true);
            }
        }
        // Draw the buttons
        exports.Events.drawButtons(scene);
    },
    drawButtons: function (scene) {
        var btns = $('#buttons', exports.Events.eventPanel());
        for (var id in scene.buttons) {
            var info = scene.buttons[id];
            var b = 
            //new 
            Button_1.Button.Button({
                id: id,
                text: info.text,
                cost: info.cost,
                click: exports.Events.buttonClick,
                cooldown: info.cooldown,
                image: info.image
            }).appendTo(btns);
            if (typeof info.available == 'function' && !info.available()) {
                Button_1.Button.setDisabled(b, true);
            }
            if (typeof info.visible == 'function' && !info.visible()) {
                b.hide();
            }
            if (typeof info.cooldown == 'number') {
                Button_1.Button.cooldown(b);
            }
        }
        exports.Events.updateButtons();
    },
    updateButtons: function () {
        var _a;
        var btns = (_a = exports.Events.activeEvent()) === null || _a === void 0 ? void 0 : _a.scenes[exports.Events.activeScene].buttons;
        for (var bId in btns) {
            var b = btns[bId];
            var btnEl = $('#' + bId, exports.Events.eventPanel());
            if (typeof b.available == 'function' && !b.available()) {
                Button_1.Button.setDisabled(btnEl, true);
            }
        }
    },
    buttonClick: function (btn) {
        var _a;
        var info = (_a = exports.Events.activeEvent()) === null || _a === void 0 ? void 0 : _a.scenes[exports.Events.activeScene].buttons[btn.attr('id')];
        if (typeof info.onChoose == 'function') {
            var textarea = exports.Events.eventPanel().find('textarea');
            info.onChoose(textarea.length > 0 ? textarea.val() : null);
        }
        // Reward
        if (info.reward) {
            state_manager_1.$SM.addM('stores', info.reward);
        }
        exports.Events.updateButtons();
        // Notification
        if (info.notification) {
            notifications_1.Notifications.notify(null, info.notification);
        }
        // Next Scene
        if (info.nextScene) {
            if (info.nextScene == 'end') {
                exports.Events.endEvent();
            }
            else {
                var r = Math.random();
                var lowestMatch = null;
                for (var i in info.nextScene) {
                    if (r < i && (lowestMatch == null || i < lowestMatch)) {
                        lowestMatch = i;
                    }
                }
                if (lowestMatch != null) {
                    exports.Events.loadScene(info.nextScene[lowestMatch]);
                    return;
                }
                engine_1.Engine.log('ERROR: no suitable scene found');
                exports.Events.endEvent();
            }
        }
    },
    // blinks the browser window title
    blinkTitle: function () {
        var title = document.title;
        // every 3 seconds change title to '*** EVENT ***', then 1.5 seconds later, change it back to the original title.
        // @ts-ignore
        exports.Events.BLINK_INTERVAL = setInterval(function () {
            document.title = (0, translate_1._)('*** EVENT ***');
            engine_1.Engine.setTimeout(function () { document.title = title; }, 1500, true);
        }, 3000);
    },
    stopTitleBlink: function () {
        // @ts-ignore
        clearInterval(exports.Events.BLINK_INTERVAL);
        exports.Events.BLINK_INTERVAL = false;
    },
    // Makes an event happen!
    triggerEvent: function () {
        if (exports.Events.activeEvent() == null) {
            var possibleEvents = [];
            for (var i in exports.Events.EventPool) {
                var event = exports.Events.EventPool[i];
                if (event.isAvailable()) {
                    // @ts-ignore
                    possibleEvents.push(event);
                }
            }
            if (possibleEvents.length === 0) {
                exports.Events.scheduleNextEvent(0.5);
                return;
            }
            else {
                var r = Math.floor(Math.random() * (possibleEvents.length));
                exports.Events.startEvent(possibleEvents[r]);
            }
        }
        exports.Events.scheduleNextEvent();
    },
    // not scheduled, this is for stuff like location-based random events on a button click
    triggerLocationEvent: function (location) {
        if (this.Locations[location]) {
            if (exports.Events.activeEvent() == null) {
                var possibleEvents = [];
                for (var i in this.Locations[location]) {
                    var event = this.Locations[location][i];
                    if (event.isAvailable()) {
                        if (typeof (event.isSuperLikely) == 'function' && event.isSuperLikely()) {
                            // SuperLikely event, do this and skip the random choice
                            engine_1.Engine.log('superLikely detected');
                            exports.Events.startEvent(event);
                            return;
                        }
                        possibleEvents.push(event);
                    }
                }
                if (possibleEvents.length === 0) {
                    // Events.scheduleNextEvent(0.5);
                    return;
                }
                else {
                    var r = Math.floor(Math.random() * (possibleEvents.length));
                    exports.Events.startEvent(possibleEvents[r]);
                }
            }
        }
    },
    activeEvent: function () {
        if (exports.Events.eventStack && exports.Events.eventStack.length > 0) {
            return exports.Events.eventStack[0];
        }
        return null;
    },
    eventPanel: function () {
        var _a;
        return (_a = exports.Events.activeEvent()) === null || _a === void 0 ? void 0 : _a.eventPanel;
    },
    startEvent: function (event, options) {
        var _a, _b;
        if (event) {
            engine_1.Engine.event('game event', 'event');
            exports.Events.eventStack.unshift(event);
            event.eventPanel = $('<div>').attr('id', 'event').addClass('eventPanel').css('opacity', '0');
            if (options != null && options.width != null) {
                exports.Events.eventPanel().css('width', options.width);
            }
            $('<div>').addClass('eventTitle').text((_a = exports.Events.activeEvent()) === null || _a === void 0 ? void 0 : _a.title).appendTo(exports.Events.eventPanel());
            $('<div>').attr('id', 'description').appendTo(exports.Events.eventPanel());
            $('<div>').attr('id', 'buttons').appendTo(exports.Events.eventPanel());
            exports.Events.loadScene('start');
            $('div#wrapper').append(exports.Events.eventPanel());
            exports.Events.eventPanel().animate({ opacity: 1 }, exports.Events._PANEL_FADE, 'linear');
            var currentSceneInformation = (_b = exports.Events.activeEvent()) === null || _b === void 0 ? void 0 : _b.scenes[exports.Events.activeScene];
            if (currentSceneInformation.blink) {
                exports.Events.blinkTitle();
            }
        }
    },
    scheduleNextEvent: function (scale) {
        var nextEvent = Math.floor(Math.random() * (exports.Events._EVENT_TIME_RANGE[1] - exports.Events._EVENT_TIME_RANGE[0])) + exports.Events._EVENT_TIME_RANGE[0];
        if (scale > 0) {
            nextEvent *= scale;
        }
        engine_1.Engine.log('next event scheduled in ' + nextEvent + ' minutes');
        exports.Events._eventTimeout = engine_1.Engine.setTimeout(exports.Events.triggerEvent, nextEvent * 60 * 1000);
    },
    endEvent: function () {
        exports.Events.eventPanel().animate({ opacity: 0 }, exports.Events._PANEL_FADE, 'linear', function () {
            exports.Events.eventPanel().remove();
            var activeEvent = exports.Events.activeEvent();
            if (activeEvent !== null)
                activeEvent.eventPanel = null;
            exports.Events.eventStack.shift();
            engine_1.Engine.log(exports.Events.eventStack.length + ' events remaining');
            if (exports.Events.BLINK_INTERVAL) {
                exports.Events.stopTitleBlink();
            }
            // Force refocus on the body. I hate you, IE.
            $('body').focus();
        });
    },
    handleStateUpdates: function (e) {
        if ((e.category == 'stores' || e.category == 'income') && exports.Events.activeEvent() != null) {
            exports.Events.updateButtons();
        }
    }
};

},{"../lib/translate":1,"./Button":2,"./engine":6,"./events/roadwander":8,"./events/room":9,"./notifications":11,"./state_manager":18}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsRoadWander = void 0;
/**
 * Events that can occur when the Road module is active
 **/
var engine_1 = require("../engine");
var state_manager_1 = require("../state_manager");
var translate_1 = require("../../lib/translate");
var character_1 = require("../player/character");
var outpost_1 = require("../places/outpost");
var road_1 = require("../places/road");
exports.EventsRoadWander = [
    // Stranger bearing gifts
    {
        title: (0, translate_1._)('A Stranger Beckons'),
        isAvailable: function () {
            return engine_1.Engine.activeModule == road_1.Road;
        },
        scenes: {
            'start': {
                text: [
                    (0, translate_1._)('As you wander along the road, a hooded stranger gestures to you. He doesn\'t seem interested in hurting you.'),
                    (0, translate_1._)('What do you do?')
                ],
                buttons: {
                    'closer': {
                        text: (0, translate_1._)('Draw Closer'),
                        nextScene: { 1: 'closer' }
                    },
                    'leave': {
                        text: (0, translate_1._)('Get Outta There'),
                        nextScene: { 1: 'leave' }
                    }
                }
            },
            'closer': {
                text: [
                    (0, translate_1._)('You move toward him a bit and stop. He continues to beckon.'),
                    (0, translate_1._)('What do you do?')
                ],
                buttons: {
                    'evenCloser': {
                        text: (0, translate_1._)('Draw Even Closer'),
                        nextScene: { 1: 'evenCloser' }
                    },
                    'leave': {
                        text: (0, translate_1._)('Nah, This is Too Spooky'),
                        nextScene: { 1: 'leave' }
                    }
                }
            },
            'evenCloser': {
                text: [
                    (0, translate_1._)('You hesitantly walk closer.'),
                    (0, translate_1._)('As soon as you get within arms\' reach, he grabs your hand with alarming speed.'),
                    (0, translate_1._)('He quickly places an object in your hand, then leaves wordlessly.')
                ],
                onLoad: function () {
                    // maybe some logic to make repeats less likely?
                    var possibleItems = [
                        'Stranger.smoothStone',
                        'Stranger.wrappedKnife',
                        'Stranger.clothBundle',
                        'Stranger.coin'
                    ];
                    var item = possibleItems[Math.floor(Math.random() * possibleItems.length)];
                    character_1.Character.addToInventory(item);
                },
                buttons: {
                    'okay': {
                        text: (0, translate_1._)('Thanks, I guess?'),
                        nextScene: 'end'
                    }
                }
            },
            'leave': {
                text: [
                    (0, translate_1._)('Your gut clenches, and you feel the sudden urge to leave.'),
                    (0, translate_1._)('As you walk away, you can feel the old man\'s gaze on your back.')
                ],
                buttons: {
                    'okay': {
                        text: (0, translate_1._)('Weird.'),
                        nextScene: 'end'
                    }
                }
            }
        }
    },
    // Unlock Outpost
    {
        title: (0, translate_1._)('A Way Forward Makes Itself Known'),
        isAvailable: function () {
            return ((engine_1.Engine.activeModule == road_1.Road)
                && (state_manager_1.$SM.get('Road.counter') > 6) // can't happen TOO early
                && (typeof (state_manager_1.$SM.get('superlikely.outpostUnlock')) == "undefined"
                    || state_manager_1.$SM.get('superlikely.outpostUnlock') < 1) // can't happen twice
            );
        },
        isSuperLikely: function () {
            return (state_manager_1.$SM.get('superlikely.outpostUnlock') < 1) && (state_manager_1.$SM.get('Road.counter') > 10);
        },
        scenes: {
            'start': {
                text: [
                    (0, translate_1._)('Smoke curls upwards from behind a hill. You climb higher to investigate.'),
                    (0, translate_1._)('From your elevated position, you can see down into the outpost that the mayor spoke of before.'),
                    (0, translate_1._)('The Outpost is now open to you.')
                ],
                buttons: {
                    'okay': {
                        text: (0, translate_1._)('A little dramatic, but cool'),
                        nextScene: 'end',
                        onChoose: function () {
                            outpost_1.Outpost.init();
                            state_manager_1.$SM.set('superlikely.outpostUnlock', 1);
                            // Character.setQuestStatus("mayorSupplies", 1);
                            character_1.Character.checkQuestStatus("mayorSupplies");
                        }
                    }
                }
            }
        }
    },
];

},{"../../lib/translate":1,"../engine":6,"../places/outpost":12,"../places/road":13,"../player/character":15,"../state_manager":18}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsRoom = void 0;
/**
 * Events that can occur when the Room module is active
 **/
var engine_1 = require("../engine");
var state_manager_1 = require("../state_manager");
var room_1 = require("../places/room");
var translate_1 = require("../../lib/translate");
exports.EventsRoom = [
    {
        title: (0, translate_1._)('The Nomad'),
        isAvailable: function () {
            return engine_1.Engine.activeModule == room_1.Room && state_manager_1.$SM.get('stores.fur', true) > 0;
        },
        scenes: {
            'start': {
                text: [
                    (0, translate_1._)('a nomad shuffles into view, laden with makeshift bags bound with rough twine.'),
                    (0, translate_1._)("won't say from where he came, but it's clear that he's not staying.")
                ],
                notification: (0, translate_1._)('a nomad arrives, looking to trade'),
                blink: true,
                buttons: {
                    'buyScales': {
                        text: (0, translate_1._)('buy scales'),
                        cost: { 'fur': 100 },
                        reward: { 'scales': 1 }
                    },
                    'buyTeeth': {
                        text: (0, translate_1._)('buy teeth'),
                        cost: { 'fur': 200 },
                        reward: { 'teeth': 1 }
                    },
                    'buyBait': {
                        text: (0, translate_1._)('buy bait'),
                        cost: { 'fur': 5 },
                        reward: { 'bait': 1 },
                        notification: (0, translate_1._)('traps are more effective with bait.')
                    },
                    'goodbye': {
                        text: (0, translate_1._)('say goodbye'),
                        nextScene: 'end'
                    }
                }
            }
        }
    },
    {
        title: (0, translate_1._)('Noises'),
        isAvailable: function () {
            return engine_1.Engine.activeModule == room_1.Room && state_manager_1.$SM.get('stores.wood');
        },
        scenes: {
            'start': {
                text: [
                    (0, translate_1._)('through the walls, shuffling noises can be heard.'),
                    (0, translate_1._)("can't tell what they're up to.")
                ],
                notification: (0, translate_1._)('strange noises can be heard through the walls'),
                blink: true,
                buttons: {
                    'investigate': {
                        text: (0, translate_1._)('investigate'),
                        nextScene: { 0.3: 'stuff', 1: 'nothing' }
                    },
                    'ignore': {
                        text: (0, translate_1._)('ignore them'),
                        nextScene: 'end'
                    }
                }
            },
            'nothing': {
                text: [
                    (0, translate_1._)('vague shapes move, just out of sight.'),
                    (0, translate_1._)('the sounds stop.')
                ],
                buttons: {
                    'backinside': {
                        text: (0, translate_1._)('go back inside'),
                        nextScene: 'end'
                    }
                }
            },
            'stuff': {
                reward: { wood: 100, fur: 10 },
                text: [
                    (0, translate_1._)('a bundle of sticks lies just beyond the threshold, wrapped in coarse furs.'),
                    (0, translate_1._)('the night is silent.')
                ],
                buttons: {
                    'backinside': {
                        text: (0, translate_1._)('go back inside'),
                        nextScene: 'end'
                    }
                }
            }
        }
    },
    {
        title: (0, translate_1._)('The Beggar'),
        isAvailable: function () {
            return engine_1.Engine.activeModule == room_1.Room && state_manager_1.$SM.get('stores.fur');
        },
        scenes: {
            start: {
                text: [
                    (0, translate_1._)('a beggar arrives.'),
                    (0, translate_1._)('asks for any spare furs to keep him warm at night.')
                ],
                notification: (0, translate_1._)('a beggar arrives'),
                blink: true,
                buttons: {
                    '50furs': {
                        text: (0, translate_1._)('give 50'),
                        cost: { fur: 50 },
                        nextScene: { 0.5: 'scales', 0.8: 'teeth', 1: 'cloth' }
                    },
                    '100furs': {
                        text: (0, translate_1._)('give 100'),
                        cost: { fur: 100 },
                        nextScene: { 0.5: 'teeth', 0.8: 'scales', 1: 'cloth' }
                    },
                    'deny': {
                        text: (0, translate_1._)('turn him away'),
                        nextScene: 'end'
                    }
                }
            },
            scales: {
                reward: { scales: 20 },
                text: [
                    (0, translate_1._)('the beggar expresses his thanks.'),
                    (0, translate_1._)('leaves a pile of small scales behind.')
                ],
                buttons: {
                    'leave': {
                        text: (0, translate_1._)('say goodbye'),
                        nextScene: 'end'
                    }
                }
            },
            teeth: {
                reward: { teeth: 20 },
                text: [
                    (0, translate_1._)('the beggar expresses his thanks.'),
                    (0, translate_1._)('leaves a pile of small teeth behind.')
                ],
                buttons: {
                    'leave': {
                        text: (0, translate_1._)('say goodbye'),
                        nextScene: 'end'
                    }
                }
            },
            cloth: {
                reward: { cloth: 20 },
                text: [
                    (0, translate_1._)('the beggar expresses his thanks.'),
                    (0, translate_1._)('leaves some scraps of cloth behind.')
                ],
                buttons: {
                    'leave': {
                        text: (0, translate_1._)('say goodbye'),
                        nextScene: 'end'
                    }
                }
            }
        }
    },
    {
        title: (0, translate_1._)('The Scout'),
        isAvailable: function () {
            return engine_1.Engine.activeModule == room_1.Room && state_manager_1.$SM.get('features.location.world');
        },
        scenes: {
            'start': {
                text: [
                    (0, translate_1._)("the scout says she's been all over."),
                    (0, translate_1._)("willing to talk about it, for a price.")
                ],
                notification: (0, translate_1._)('a scout stops for the night'),
                blink: true,
                buttons: {
                    'buyMap': {
                        text: (0, translate_1._)('buy map'),
                        cost: { 'fur': 200, 'scales': 10 },
                        notification: (0, translate_1._)('the map uncovers a bit of the world'),
                        // onChoose: World.applyMap
                    },
                    'learn': {
                        text: (0, translate_1._)('learn scouting'),
                        cost: { 'fur': 1000, 'scales': 50, 'teeth': 20 },
                        available: function () {
                            return !state_manager_1.$SM.hasPerk('scout');
                        },
                        onChoose: function () {
                            state_manager_1.$SM.addPerk('scout');
                        }
                    },
                    'leave': {
                        text: (0, translate_1._)('say goodbye'),
                        nextScene: 'end'
                    }
                }
            }
        }
    },
    {
        title: (0, translate_1._)('The Master'),
        isAvailable: function () {
            return engine_1.Engine.activeModule == room_1.Room && state_manager_1.$SM.get('features.location.world');
        },
        scenes: {
            'start': {
                text: [
                    (0, translate_1._)('an old wanderer arrives.'),
                    (0, translate_1._)('he smiles warmly and asks for lodgings for the night.')
                ],
                notification: (0, translate_1._)('an old wanderer arrives'),
                blink: true,
                buttons: {
                    'agree': {
                        text: (0, translate_1._)('agree'),
                        cost: {
                            'cured meat': 100,
                            'fur': 100,
                            'torch': 1
                        },
                        nextScene: { 1: 'agree' }
                    },
                    'deny': {
                        text: (0, translate_1._)('turn him away'),
                        nextScene: 'end'
                    }
                }
            },
            'agree': {
                text: [
                    (0, translate_1._)('in exchange, the wanderer offers his wisdom.')
                ],
                buttons: {
                    'evasion': {
                        text: (0, translate_1._)('evasion'),
                        available: function () {
                            return !state_manager_1.$SM.hasPerk('evasive');
                        },
                        onChoose: function () {
                            state_manager_1.$SM.addPerk('evasive');
                        },
                        nextScene: 'end'
                    },
                    'precision': {
                        text: (0, translate_1._)('precision'),
                        available: function () {
                            return !state_manager_1.$SM.hasPerk('precise');
                        },
                        onChoose: function () {
                            state_manager_1.$SM.addPerk('precise');
                        },
                        nextScene: 'end'
                    },
                    'force': {
                        text: (0, translate_1._)('force'),
                        available: function () {
                            return !state_manager_1.$SM.hasPerk('barbarian');
                        },
                        onChoose: function () {
                            state_manager_1.$SM.addPerk('barbarian');
                        },
                        nextScene: 'end'
                    },
                    'nothing': {
                        text: (0, translate_1._)('nothing'),
                        nextScene: 'end'
                    }
                }
            }
        }
    }
];

},{"../../lib/translate":1,"../engine":6,"../places/room":14,"../state_manager":18}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = void 0;
/**
 * Module that takes care of header buttons
 */
var engine_1 = require("./engine");
exports.Header = {
    init: function (options) {
        this.options = $.extend(this.options, options);
    },
    options: {}, // Nothing for now
    canTravel: function () {
        return $('div#header div.headerButton').length > 1;
    },
    addLocation: function (text, id, module) {
        return $('<div>').attr('id', "location_" + id)
            .addClass('headerButton')
            .text(text).click(function () {
            if (exports.Header.canTravel()) {
                engine_1.Engine.travelTo(module);
            }
        }).appendTo($('div#header'));
    }
};

},{"./engine":6}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notifications = void 0;
/**
 * Module that registers the notification box and handles messages
 */
var engine_1 = require("./engine");
exports.Notifications = {
    init: function (options) {
        this.options = $.extend(this.options, options);
        // Create the notifications box
        var elem = $('<div>').attr({
            id: 'notifications',
            className: 'notifications'
        });
        // Create the transparency gradient
        $('<div>').attr('id', 'notifyGradient').appendTo(elem);
        elem.appendTo('div#wrapper');
    },
    options: {}, // Nothing for now
    elem: null,
    notifyQueue: {},
    // Allow notification to the player
    notify: function (module, text, noQueue) {
        if (typeof text == 'undefined')
            return;
        // I don't need you punctuating for me, function.
        // if(text.slice(-1) != ".") text += ".";
        if (module != null && engine_1.Engine.activeModule != module) {
            if (!noQueue) {
                if (typeof this.notifyQueue[module] == 'undefined') {
                    this.notifyQueue[module] = [];
                }
                this.notifyQueue[module].push(text);
            }
        }
        else {
            exports.Notifications.printMessage(text);
        }
        engine_1.Engine.saveGame();
    },
    clearHidden: function () {
        // To fix some memory usage issues, we clear notifications that have been hidden.
        // We use position().top here, because we know that the parent will be the same, so the position will be the same.
        // @ts-ignore
        var bottom = $('#notifyGradient').position().top + $('#notifyGradient').outerHeight(true);
        $('.notification').each(function () {
            if ($(this).position().top > bottom) {
                $(this).remove();
            }
        });
    },
    printMessage: function (t) {
        var text = $('<div>').addClass('notification').css('opacity', '0').text(t).prependTo('div#notifications');
        text.animate({ opacity: 1 }, 500, 'linear', function () {
            // Do this every time we add a new message, this way we never have a large backlog to iterate through. Keeps things faster.
            exports.Notifications.clearHidden();
        });
    },
    printQueue: function (module) {
        if (typeof this.notifyQueue[module] != 'undefined') {
            while (this.notifyQueue[module].length > 0) {
                exports.Notifications.printMessage(this.notifyQueue[module].shift());
            }
        }
    }
};

},{"./engine":6}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Outpost = void 0;
var engine_1 = require("../engine");
var state_manager_1 = require("../state_manager");
var weather_1 = require("../weather");
var Button_1 = require("../Button");
var captain_1 = require("../characters/captain");
var header_1 = require("../header");
var translate_1 = require("../../lib/translate");
exports.Outpost = {
    init: function (options) {
        this.options = $.extend(this.options, options);
        // Create the Outpost tab
        this.tab = header_1.Header.addLocation((0, translate_1._)("The Outpost"), "outpost", exports.Outpost);
        // Create the Outpost panel
        this.panel = $('<div>')
            .attr('id', "outpostPanel")
            .addClass('location')
            .appendTo('div#locationSlider');
        engine_1.Engine.updateSlider();
        // new 
        Button_1.Button.Button({
            id: 'captainButton',
            text: (0, translate_1._)('Speak with The Captain'),
            click: captain_1.Captain.talkToCaptain,
            width: '80px'
        }).appendTo('div#outpostPanel');
        exports.Outpost.updateButton();
        // setting this separately so that quest status can't accidentally break it later
        state_manager_1.$SM.set('outpost.open', 1);
    },
    availableWeather: {
        'sunny': 0.4,
        'cloudy': 0.3,
        'rainy': 0.3
    },
    onArrival: function (transition_diff) {
        exports.Outpost.setTitle();
        engine_1.Engine.moveStoresView(null, transition_diff);
        weather_1.Weather.initiateWeather(exports.Outpost.availableWeather, 'outpost');
    },
    setTitle: function () {
        var title = (0, translate_1._)("The Outpost");
        if (engine_1.Engine.activeModule == this) {
            document.title = title;
        }
        $('div#location_outpost').text(title);
    },
    updateButton: function () {
        // conditionals for updating buttons
    },
    // don't need this yet (or maybe ever)
    // wanderEvent: function() {
    // 	Events.triggerLocationEvent('OutpostWander');
    // 	$SM.add('Outpost.counter', 1);
    // }
};

},{"../../lib/translate":1,"../Button":2,"../characters/captain":3,"../engine":6,"../header":10,"../state_manager":18,"../weather":19}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Road = void 0;
var header_1 = require("../header");
var engine_1 = require("../engine");
var Button_1 = require("../Button");
var state_manager_1 = require("../state_manager");
var translate_1 = require("../../lib/translate");
var weather_1 = require("../weather");
var events_1 = require("../events");
exports.Road = {
    init: function (options) {
        this.options = $.extend(this.options, options);
        // Create the Road tab
        this.tab = header_1.Header.addLocation((0, translate_1._)("Road to the Outpost"), "road", exports.Road);
        // Create the Road panel
        this.panel = $('<div>')
            .attr('id', "roadPanel")
            .addClass('location')
            .appendTo('div#locationSlider');
        engine_1.Engine.updateSlider();
        //new 
        Button_1.Button.Button({
            id: 'wanderButton',
            text: (0, translate_1._)('Wander Around'),
            click: exports.Road.wanderEvent,
            width: '80px',
            cost: {} // TODO: make there be a cost to doing stuff?
        }).appendTo('div#roadPanel');
        exports.Road.updateButton();
        // setting this separately so that quest status can't accidentally break it later
        state_manager_1.$SM.set('road.open', 1);
    },
    availableWeather: {
        'sunny': 0.4,
        'cloudy': 0.3,
        'rainy': 0.3
    },
    onArrival: function (transition_diff) {
        exports.Road.setTitle();
        engine_1.Engine.moveStoresView(null, transition_diff);
        weather_1.Weather.initiateWeather(exports.Road.availableWeather, 'road');
    },
    setTitle: function () {
        var title = (0, translate_1._)("Road to the Outpost");
        if (engine_1.Engine.activeModule == this) {
            document.title = title;
        }
        $('div#location_road').text(title);
    },
    updateButton: function () {
        // conditionals for updating buttons
    },
    wanderEvent: function () {
        events_1.Events.triggerLocationEvent('RoadWander');
        state_manager_1.$SM.add('Road.counter', 1);
    }
};

},{"../../lib/translate":1,"../Button":2,"../engine":6,"../events":7,"../header":10,"../state_manager":18,"../weather":19}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
/**
 * Module that registers the simple room functionality
 */
var engine_1 = require("../engine");
var state_manager_1 = require("../state_manager");
var Button_1 = require("../Button");
var notifications_1 = require("../notifications");
var weather_1 = require("../weather");
var translate_1 = require("../../lib/translate");
var header_1 = require("../header");
var liz_1 = require("../characters/liz");
var mayor_1 = require("../characters/mayor");
var events_1 = require("../events");
exports.Room = {
    // times in (minutes * seconds * milliseconds)
    _FIRE_COOL_DELAY: 5 * 60 * 1000, // time after a stoke before the fire cools
    _ROOM_WARM_DELAY: 30 * 1000, // time between room temperature updates
    _BUILDER_STATE_DELAY: 0.5 * 60 * 1000, // time between builder state updates
    _STOKE_COOLDOWN: 10, // cooldown to stoke the fire
    _NEED_WOOD_DELAY: 15 * 1000, // from when the stranger shows up, to when you need wood
    buttons: {},
    changed: false,
    name: (0, translate_1._)("Room"),
    init: function (options) {
        this.options = $.extend(this.options, options);
        if (engine_1.Engine._debug) {
            this._ROOM_WARM_DELAY = 5000;
            this._BUILDER_STATE_DELAY = 5000;
            this._STOKE_COOLDOWN = 0;
            this._NEED_WOOD_DELAY = 5000;
        }
        // Create the room tab
        this.tab = header_1.Header.addLocation((0, translate_1._)("A Chill Village"), "room", exports.Room);
        // Create the Room panel
        this.panel = $('<div>')
            .attr('id', "roomPanel")
            .addClass('location')
            .appendTo('div#locationSlider');
        engine_1.Engine.updateSlider();
        Button_1.Button.Button({
            id: 'talkButton',
            text: (0, translate_1._)('Talk to the Mayor'),
            click: mayor_1.Mayor.talkToMayor,
            width: '80px',
            cost: {}
        }).appendTo('div#roomPanel');
        Button_1.Button.Button({
            id: 'lizButton',
            text: (0, translate_1._)('Talk to Liz'),
            click: liz_1.Liz.talkToLiz,
            width: '80px',
            cost: {}
        }).appendTo('div#roomPanel');
        Button_1.Button.Button({
            id: 'newBuildingButton',
            text: (0, translate_1._)('Check out the new building'),
            click: exports.Room.tempBuildingMessage,
            width: '80px',
            cost: {}
        }).appendTo('div#roomPanel');
        var buildingButton = $('#newBuildingButton.button');
        buildingButton.hide();
        var lizButton = $('#lizButton.button');
        lizButton.hide();
        // Create the stores container
        $('<div>').attr('id', 'storesContainer').appendTo('div#roomPanel');
        //subscribe to stateUpdates
        // @ts-ignore
        $.Dispatch('stateUpdate').subscribe(exports.Room.handleStateUpdates);
        exports.Room.updateButton();
    },
    options: {}, // Nothing for now
    availableWeather: {
        'sunny': 0.4,
        'cloudy': 0.3,
        'rainy': 0.3
    },
    onArrival: function (transition_diff) {
        exports.Room.setTitle();
        if (state_manager_1.$SM.get('game.builder.level') == 3) {
            state_manager_1.$SM.add('game.builder.level', 1);
            state_manager_1.$SM.setIncome('builder', {
                delay: 10,
                stores: { 'wood': 2 }
            });
            notifications_1.Notifications.notify(exports.Room, (0, translate_1._)("the stranger is standing by the fire. she says she can help. says she builds things."));
        }
        engine_1.Engine.moveStoresView(null, transition_diff);
        weather_1.Weather.initiateWeather(exports.Room.availableWeather, 'room');
    },
    TempEnum: {
        fromInt: function (value) {
            for (var k in this) {
                if (typeof this[k].value != 'undefined' && this[k].value == value) {
                    return this[k];
                }
            }
            return null;
        },
        Freezing: { value: 0, text: (0, translate_1._)('freezing') },
        Cold: { value: 1, text: (0, translate_1._)('cold') },
        Mild: { value: 2, text: (0, translate_1._)('mild') },
        Warm: { value: 3, text: (0, translate_1._)('warm') },
        Hot: { value: 4, text: (0, translate_1._)('hot') }
    },
    FireEnum: {
        fromInt: function (value) {
            for (var k in this) {
                if (typeof this[k].value != 'undefined' && this[k].value == value) {
                    return this[k];
                }
            }
            return null;
        },
        Dead: { value: 0, text: (0, translate_1._)('dead') },
        Smoldering: { value: 1, text: (0, translate_1._)('smoldering') },
        Flickering: { value: 2, text: (0, translate_1._)('flickering') },
        Burning: { value: 3, text: (0, translate_1._)('burning') },
        Roaring: { value: 4, text: (0, translate_1._)('roaring') }
    },
    setTitle: function () {
        var title = (0, translate_1._)("The Village");
        if (engine_1.Engine.activeModule == this) {
            document.title = title;
        }
        $('div#location_room').text(title);
    },
    updateButton: function () {
        var light = $('#lightButton.button');
        var stoke = $('#stokeButton.button');
        if (state_manager_1.$SM.get('game.fire.value') == exports.Room.FireEnum.Dead.value && stoke.css('display') != 'none') {
            stoke.hide();
            light.show();
            if (stoke.hasClass('disabled')) {
                Button_1.Button.cooldown(light);
            }
        }
        else if (light.css('display') != 'none') {
            stoke.show();
            light.hide();
            if (light.hasClass('disabled')) {
                Button_1.Button.cooldown(stoke);
            }
        }
        if (!state_manager_1.$SM.get('stores.wood')) {
            light.addClass('free');
            stoke.addClass('free');
        }
        else {
            light.removeClass('free');
            stoke.removeClass('free');
        }
        var lizButton = $('#lizButton.button');
        if (state_manager_1.$SM.get('village.lizActive'))
            lizButton.show();
        var buildingButton = $('#newBuildingButton.button');
        if (state_manager_1.$SM.get('village.mayor.haveGivenSupplies'))
            buildingButton.show();
    },
    handleStateUpdates: function (e) {
        if (e.category == 'stores') {
            // Room.updateBuildButtons();
        }
        else if (e.category == 'income') {
        }
        else if (e.stateName.indexOf('game.buildings') === 0) {
        }
    },
    tempBuildingMessage: function () {
        events_1.Events.startEvent({
            title: (0, translate_1._)('A New Building'),
            scenes: {
                start: {
                    nextScene: 'main',
                    text: [
                        (0, translate_1._)('This is a new building. There should be stuff in it, but this is a placeholder for now.'),
                    ],
                    buttons: {
                        'leave': {
                            text: (0, translate_1._)('Lame'),
                            nextScene: 'end'
                        }
                    }
                }
            }
        });
    }
};

},{"../../lib/translate":1,"../Button":2,"../characters/liz":4,"../characters/mayor":5,"../engine":6,"../events":7,"../header":10,"../notifications":11,"../state_manager":18,"../weather":19}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Character = void 0;
var state_manager_1 = require("../state_manager");
var Button_1 = require("../Button");
var itemList_1 = require("./itemList");
var events_1 = require("../events");
var notifications_1 = require("../notifications");
var translate_1 = require("../../lib/translate");
var questLog_1 = require("./questLog");
exports.Character = {
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
    perks: {},
    init: function (options) {
        this.options = $.extend(this.options, options);
        // create the character box
        var elem = $('<div>').attr({
            id: 'character',
            className: 'character'
        });
        elem.appendTo('div#wrapper');
        // write rawStats to $SM
        // NOTE: never write derived stats to $SM, and never access raw stats directly!
        // doing so will introduce opportunities to mess up stats PERMANENTLY
        if (!state_manager_1.$SM.get('character.rawstats')) {
            state_manager_1.$SM.set('character.rawstats', exports.Character.rawStats);
        }
        else {
            exports.Character.rawStats = state_manager_1.$SM.get('character.rawStats');
        }
        if (!state_manager_1.$SM.get('character.perks')) {
            state_manager_1.$SM.set('character.perks', exports.Character.perks);
        }
        else {
            exports.Character.perks = state_manager_1.$SM.get('character.perks');
        }
        if (!state_manager_1.$SM.get('character.inventory')) {
            state_manager_1.$SM.set('character.inventory', exports.Character.inventory);
        }
        else {
            exports.Character.inventory = state_manager_1.$SM.get('character.inventory');
        }
        if (!state_manager_1.$SM.get('character.equippedItems')) {
            state_manager_1.$SM.set('character.equippedItems', exports.Character.equippedItems);
        }
        else {
            exports.Character.equippedItems = state_manager_1.$SM.get('character.equippedItems');
        }
        if (!state_manager_1.$SM.get('character.questStatus')) {
            state_manager_1.$SM.set('character.questStatus', exports.Character.questStatus);
        }
        else {
            exports.Character.questStatus = state_manager_1.$SM.get('character.questStatus');
        }
        $('<div>').text('Character').attr('id', 'title').appendTo('div#character');
        // TODO: replace this with derived stats
        for (var stat in state_manager_1.$SM.get('character.rawstats')) {
            $('<div>').text(stat + ': ' + state_manager_1.$SM.get('character.rawstats.' + stat)).appendTo('div#character');
        }
        $('<div>').attr('id', 'buttons').css("margin-top", "20px").appendTo('div#character');
        var inventoryButton = Button_1.Button.Button({
            id: "inventory",
            text: "Inventory",
            click: exports.Character.openInventory
        }).appendTo($('#buttons', 'div#character'));
        var questLogButton = Button_1.Button.Button({
            id: "questLog",
            text: "Quest Log",
            click: exports.Character.openQuestLog
        }).appendTo($('#buttons', 'div#character'));
        // @ts-ignore
        window.Character = this;
    },
    options: {}, // Nothing for now
    elem: null,
    inventoryDisplay: null,
    questLogDisplay: null,
    openInventory: function () {
        // creating a handle for later access, such as closing inventory
        exports.Character.inventoryDisplay = $('<div>').attr('id', 'inventory').addClass('eventPanel').css('opacity', '0');
        var inventoryDisplay = exports.Character.inventoryDisplay;
        exports.Character.inventoryDisplay
            // set up click and hover handlers for inventory items
            .on("click", "#item", function () {
            exports.Character.useInventoryItem($(this).data("name"));
            exports.Character.closeInventory();
        }).on("mouseenter", "#item", function () {
            var tooltip = $("<div id='tooltip' class='tooltip'>" + itemList_1.ItemList[$(this).data("name")].text + "</div>")
                .attr('data-name', item);
            tooltip.appendTo($(this));
        }).on("mouseleave", "#item", function () {
            $("#tooltip", "#" + $(this).data("name")).fadeOut().remove();
        });
        $('<div>').addClass('eventTitle').text('Inventory').appendTo(inventoryDisplay);
        var inventoryDesc = $('<div>').text("Click things in the list to use them.")
            .hover(function () {
            var tooltip = $("<div id='tooltip' class='tooltip'>" + "Not this, though." + "</div>");
            tooltip.appendTo(inventoryDesc);
        }, function () {
            $("#tooltip").fadeOut().remove();
        })
            .on("click", function () {
            notifications_1.Notifications.notify(null, (0, translate_1._)("I bet you think you're pretty funny, huh? Clicking the thing I said wasn't clickable?"));
        })
            .css("margin-bottom", "20px")
            .appendTo(inventoryDisplay);
        for (var item in exports.Character.inventory) {
            // make the inventory count look a bit nicer
            var inventoryElem = $('<div>')
                .attr('id', 'item')
                .attr('data-name', item)
                .text(itemList_1.ItemList[item].name + '  (x' + exports.Character.inventory[item].toString() + ')')
                .appendTo(inventoryDisplay);
        }
        // TODO: make this CSS an actual class somewhere, I'm sure I'll need it again
        $('<div>').attr('id', 'buttons').css("margin-top", "20px").appendTo(inventoryDisplay);
        var b = 
        //new 
        Button_1.Button.Button({
            id: "closeInventory",
            text: "Close",
            click: exports.Character.closeInventory
        }).appendTo($('#buttons', inventoryDisplay));
        $('div#wrapper').append(inventoryDisplay);
        inventoryDisplay.animate({ opacity: 1 }, events_1.Events._PANEL_FADE, 'linear');
    },
    closeInventory: function () {
        exports.Character.inventoryDisplay.empty();
        exports.Character.inventoryDisplay.remove();
    },
    addToInventory: function (item, amount) {
        if (amount === void 0) { amount = 1; }
        if (exports.Character.inventory[item]) {
            exports.Character.inventory[item] += amount;
        }
        else {
            exports.Character.inventory[item] = amount;
        }
        notifications_1.Notifications.notify(null, "Added " + itemList_1.ItemList[item].name + " to inventory.");
        state_manager_1.$SM.set('inventory', exports.Character.inventory);
    },
    removeFromInventory: function (item, amount) {
        if (amount === void 0) { amount = 1; }
        if (exports.Character.inventory[item])
            exports.Character.inventory[item] -= amount;
        if (exports.Character.inventory[item] < 1) {
            delete exports.Character.inventory[item];
        }
        notifications_1.Notifications.notify(null, "Removed " + itemList_1.ItemList[item].name + " from inventory.");
        state_manager_1.$SM.set('inventory', exports.Character.inventory);
    },
    useInventoryItem: function (item) {
        if (exports.Character.inventory[item] && exports.Character.inventory[item] > 0) {
            // use the effect in the inventory; just in case a name matches but the effect
            // does not, assume the inventory item is the source of truth
            itemList_1.ItemList[item].onUse();
            if (typeof (itemList_1.ItemList[item].destroyOnUse) == "function" && itemList_1.ItemList[item].destroyOnUse()) {
                exports.Character.removeFromInventory(item);
            }
            else if (itemList_1.ItemList[item].destroyOnUse) {
                exports.Character.removeFromInventory(item);
            }
        }
        state_manager_1.$SM.set('inventory', exports.Character.inventory);
    },
    equipItem: function (item) {
        if (itemList_1.ItemList[item].slot && typeof (exports.Character.equippedItems[itemList_1.ItemList[item].slot]) !== "undefined") {
            exports.Character.addToInventory(exports.Character.equippedItems[itemList_1.ItemList[item].slot]);
            exports.Character.equippedItems[itemList_1.ItemList[item].slot] = item;
            if (itemList_1.ItemList[item].onEquip) {
                itemList_1.ItemList[item].onEquip();
            }
            exports.Character.applyEquipmentEffects();
        }
        state_manager_1.$SM.set('equippedItems', exports.Character.equippedItems);
        state_manager_1.$SM.set('inventory', exports.Character.inventory);
    },
    grantPerk: function (perk) {
        if (exports.Character.perks[perk.name]) {
            if (perk.timeLeft > 0) {
                exports.Character.perks[perk.name] += perk.timeLeft;
            }
        }
        else {
            exports.Character.perks[perk.name] = perk;
        }
        state_manager_1.$SM.set('perks', exports.Character.perks);
    },
    openQuestLog: function () {
        // creating a handle for later access, such as closing quest log
        exports.Character.questLogDisplay = $('<div>').attr('id', 'quest').addClass('eventPanel').css('opacity', '0');
        var questLogDisplay = exports.Character.questLogDisplay;
        exports.Character.questLogDisplay
            // set up click and hover handlers for quests
            .on("click", "#quest", function () {
            exports.Character.displayQuest($(this).data("name"));
        }).on("mouseenter", "#quest", function () {
            // description shouldn't be on a tooltip, obvs, but fix this later
            var tooltip = $("<div id='tooltip' class='tooltip'>" + questLog_1.QuestLog[$(this).data("name")].logDescription + "</div>")
                .attr('data-name', quest);
            tooltip.appendTo($(this));
        }).on("mouseleave", "#quest", function () {
            $("#tooltip", "#" + $(this).data("name")).fadeOut().remove();
        });
        $('<div>').addClass('eventTitle').text('Quest Log').appendTo(questLogDisplay);
        var questLogDesc = $('<div>').text("Click quest names to see more info.")
            .css("margin-bottom", "20px")
            .appendTo(questLogDisplay);
        for (var quest in exports.Character.questStatus) {
            var questElem = $('<div>')
                .attr('id', "quest")
                .attr('data-name', quest)
                .text(questLog_1.QuestLog[quest].name)
                .appendTo(questLogDisplay);
            if (exports.Character.questStatus[quest] == -1) {
                questElem
                    // I want this to be not struck through, but that's too annoying to worry
                    // about right now
                    // .prepend("DONE ")
                    .wrap("<strike>");
            }
        }
        // TODO: make this CSS an actual class somewhere, I'm sure I'll need it again
        $('<div>').attr('id', 'buttons').css("margin-top", "20px").appendTo(questLogDisplay);
        var b = Button_1.Button.Button({
            id: "closeQuestLog",
            text: "Close",
            click: exports.Character.closeQuestLog
        }).appendTo($('#buttons', questLogDisplay));
        $('div#wrapper').append(questLogDisplay);
        questLogDisplay.animate({ opacity: 1 }, events_1.Events._PANEL_FADE, 'linear');
    },
    displayQuest: function (quest) {
        var questLogDisplay = exports.Character.questLogDisplay;
        questLogDisplay.empty();
        var currentQuest = questLog_1.QuestLog[quest];
        $('<div>').attr('id', 'quest').addClass('eventPanel').css('opacity', '0');
        $('<div>').addClass('eventTitle').text(currentQuest.name).appendTo(questLogDisplay);
        var questLogDesc = $('<div>').text(currentQuest.logDescription)
            .css("margin-bottom", "20px")
            .appendTo(questLogDisplay);
        if (exports.Character.questStatus[quest] == -1) {
            var phaseDesc = $('<div>').text("This quest is complete!")
                .css("margin-bottom", "10px")
                .appendTo(questLogDisplay);
        }
        for (var i = 0; i <= exports.Character.questStatus[quest]; i++) {
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
                if (!currentQuest.phases[i].requirements[j].isComplete())
                    complete = false;
            }
            if (complete) {
                phaseDesc.wrap("<strike>");
            }
        }
        // TODO: make this CSS an actual class somewhere, I'm sure I'll need it again
        $('<div>').attr('id', 'buttons').css("margin-top", "20px").appendTo(questLogDisplay);
        var b = Button_1.Button.Button({
            id: "backToQuestLog",
            text: "Back to Quest Log",
            click: exports.Character.backToQuestLog
        }).appendTo($('#buttons', questLogDisplay));
        var b = Button_1.Button.Button({
            id: "closeQuestLog",
            text: "Close",
            click: exports.Character.closeQuestLog
        }).appendTo($('#buttons', questLogDisplay));
    },
    closeQuestLog: function () {
        exports.Character.questLogDisplay.empty();
        exports.Character.questLogDisplay.remove();
    },
    backToQuestLog: function () {
        exports.Character.closeQuestLog();
        exports.Character.openQuestLog();
    },
    setQuestStatus: function (quest, phase) {
        // might be a good idea to check for linear quest progression here?
        if (typeof (questLog_1.QuestLog[quest]) !== "undefined") {
            exports.Character.questStatus[quest] = phase;
            notifications_1.Notifications.notify(null, "Quest Log updated.");
            state_manager_1.$SM.set('questStatus', exports.Character.questStatus);
        }
    },
    checkQuestStatus: function (quest) {
        var currentPhase = questLog_1.QuestLog[quest].phases[exports.Character.questStatus[quest]];
        var complete = true;
        for (var i = 0; i < Object.keys(currentPhase.requirements).length; i++) {
            if (!currentPhase.requirements[i].isComplete())
                complete = false;
        }
        // if there is a next phase, set questStatus to it
        if (typeof (questLog_1.QuestLog[quest].phases[exports.Character.questStatus[quest] + 1]) !== "undefined") {
            exports.Character.questStatus[quest] += 1;
        }
        else { // else set it to complete
            exports.Character.questStatus[quest] = -1;
        }
        notifications_1.Notifications.notify(null, "Quest Log updated.");
        state_manager_1.$SM.set('questStatus', exports.Character.questStatus);
    },
    // apply equipment effects, which should all check against $SM state variables;
    // this should be called on basically every player action where a piece of gear
    // would do something or change an outcome; give extraParams to the effect being 
    // applied for anything that's relevant to the effect but not handled by $SM
    applyEquipmentEffects: function (extraParams) {
        for (var item in exports.Character.equippedItems) {
            if (itemList_1.ItemList[item].effects) {
                for (var effect in itemList_1.ItemList[item].effects) {
                    // NOTE: currently this is good for applying perks and Notifying;
                    // are there other situations where we'd want to apply effects,
                    // or can we cover basically every case via those things?
                    // @ts-ignore
                    if (effect.isActive && effect.isActive(extraParams))
                        effect.apply(extraParams);
                }
            }
        }
    },
    // get stats after applying all equipment bonuses, perks, etc.
    getDerivedStats: function () {
        var derivedStats = structuredClone(exports.Character.rawStats);
        for (var item in exports.Character.equippedItems) {
            if (itemList_1.ItemList[item].statBonuses) {
                for (var stat in Object.keys(itemList_1.ItemList[item].statBonuses)) {
                    if (typeof (itemList_1.ItemList[item].statBonuses[stat] == "function")) {
                        derivedStats[stat] += itemList_1.ItemList[item].statBonuses[stat]();
                    }
                    else {
                        derivedStats[stat] += itemList_1.ItemList[item].statBonuses[stat];
                    }
                }
            }
        }
        for (var perk in exports.Character.perks) {
            // @ts-ignore
            if (perk.statBonuses) {
                // @ts-ignore
                for (var stat in Object.keys(perk.statBonuses)) {
                    // @ts-ignore
                    if (typeof (perk.statBonuses[stat] == "function")) {
                        // @ts-ignore
                        derivedStats[stat] += perk.statBonuses[stat]();
                    }
                    else {
                        // @ts-ignore
                        derivedStats[stat] += perk.statBonuses[stat];
                    }
                }
            }
        }
        return derivedStats;
    }
};

},{"../../lib/translate":1,"../Button":2,"../events":7,"../notifications":11,"../state_manager":18,"./itemList":16,"./questLog":17}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemList = void 0;
// all items go here, so that nothing silly happens in the event that they get put in Local Storage
// as part of the state management code; please save item names to the inventory, and then refer to 
// the item list via the item name
var events_1 = require("../events");
var character_1 = require("./character");
var translate_1 = require("../../lib/translate");
var state_manager_1 = require("../state_manager");
var notifications_1 = require("../notifications");
// Details for all in-game items; the Character inventory only holds item IDs
// and amounts
exports.ItemList = {
    "Liz.weirdBook": {
        name: 'Weird Book',
        pluralName: 'Weird Books',
        text: (0, translate_1._)('A book you found at Liz\'s place. Supposedly has information about Chadtopia.'),
        onUse: function () {
            events_1.Events.startEvent({
                title: (0, translate_1._)("A Brief History of Chadtopia"),
                scenes: {
                    start: {
                        text: [
                            (0, translate_1._)('This book is pretty boring, but you manage to learn a bit more in spite of your poor attention span.'),
                            (0, translate_1._)('For example, you learn that "Chadtopia" doesn\'t have a capital \'T\'. That\'s pretty cool, huh?'),
                            (0, translate_1._)('... What were you doing again?')
                        ],
                        buttons: {
                            'okay': {
                                text: (0, translate_1._)('Something cooler than reading, probably'),
                                onChoose: character_1.Character.addToInventory("Liz.boringBook"),
                                nextScene: 'end'
                            }
                        }
                    }
                }
            });
        },
        destroyOnUse: true,
        destroyable: false
    },
    "Liz.boringBook": {
        name: '"A Brief History of Chadtopia"',
        pluralName: 'Multiple copies of "A Brief History of Chadtopia"',
        text: (0, translate_1._)('Man, this book is boring.'),
        onUse: function () {
            events_1.Events.startEvent({
                title: (0, translate_1._)("A Brief Summary of a Brief History of Chadtopia"),
                scenes: {
                    start: {
                        text: [(0, translate_1._)('It\'s still just as boring as when you last tried to read it.')],
                        buttons: {
                            'okay': {
                                text: (0, translate_1._)('Dang.'),
                                nextScene: 'end'
                            }
                        }
                    }
                }
            });
        },
        destroyOnUse: false,
        destroyable: false
    },
    "Stranger.smoothStone": {
        name: 'a smooth black stone',
        pluralName: 'smooth black stones',
        text: (0, translate_1._)('It\'s weirdly eerie'),
        onUse: function () {
            if (!state_manager_1.$SM.get('knowledge.Stranger.smoothStone')) {
                notifications_1.Notifications.notify(null, 'You have no idea what to do with this thing.');
                return;
            }
            events_1.Events.startEvent({
                title: (0, translate_1._)("A smooth black stone"),
                scenes: {
                    start: {
                        text: [(0, translate_1._)("I'm genuinely not sure how you got to this event, but please let me know via GitHub issue, you little stinker.")],
                        buttons: {
                            'okay': {
                                text: (0, translate_1._)('I swear to do this, as a responsible citizen of Earth'),
                                nextScene: 'end'
                            }
                        }
                    }
                }
            });
        },
        destroyOnUse: false,
        destroyable: false
    },
    "Stranger.wrappedKnife": {
        name: 'a knife wrapped in cloth',
        pluralName: 'Knives wrapped in separate cloths',
        text: (0, translate_1._)('Man, I hope it\'s not all like, bloody on the blade and stuff.'),
        onUse: function () {
            events_1.Events.startEvent({
                title: (0, translate_1._)("A knife wrapped in cloth"),
                scenes: {
                    start: {
                        text: [(0, translate_1._)("You unwrap the knife carefully. It seems to be highly ornamented, and you could probably do some crimes with it.")],
                        buttons: {
                            'okay': {
                                text: (0, translate_1._)('Hell yeah, Adolf Loos style'),
                                onChoose: character_1.Character.addToInventory("Stranger.silverKnife"),
                                nextScene: 'end'
                            }
                        }
                    }
                }
            });
        },
        destroyOnUse: true,
        destroyable: false
    },
    "Stranger.silverKnife": {
        name: 'a silver knife',
        pluralName: 'silver knives',
        text: (0, translate_1._)('Highly ornamented'),
        onUse: function () {
            events_1.Events.startEvent({
                title: (0, translate_1._)("A silver knife"),
                scenes: {
                    start: {
                        text: [
                            (0, translate_1._)("One day you'll be able to equip this, but right now that functionality isn't present."),
                            (0, translate_1._)("Please politely leave the premises without acknowledging this missing feature.")
                        ],
                        buttons: {
                            'okay': {
                                text: (0, translate_1._)('You got it, chief'),
                                nextScene: 'end'
                            }
                        }
                    }
                }
            });
        },
        destroyOnUse: false,
        destroyable: false
    },
    "Stranger.clothBundle": {
        name: 'a bundle of cloth',
        pluralName: 'bundles of cloth',
        text: (0, translate_1._)('What lies within?'),
        onUse: function () {
            events_1.Events.startEvent({
                title: (0, translate_1._)("A bundle of cloth"),
                scenes: {
                    start: {
                        text: [
                            (0, translate_1._)("One day you'll be able to use this item, but right now that functionality isn't present."),
                            (0, translate_1._)("Please politely leave the premises without acknowledging this missing feature.")
                        ],
                        buttons: {
                            'okay': {
                                text: (0, translate_1._)('You got it, chief'),
                                nextScene: 'end'
                            }
                        }
                    }
                }
            });
        },
        destroyOnUse: false,
        destroyable: false
    },
    "Stranger.coin": {
        name: 'A strange coin',
        pluralName: 'strange coins',
        text: (0, translate_1._)('Both sides depict the same image'),
        onUse: function () {
            events_1.Events.startEvent({
                title: (0, translate_1._)("A strange coin"),
                scenes: {
                    start: {
                        text: [
                            (0, translate_1._)("One day you'll be able to use this item, but right now that functionality isn't present."),
                            (0, translate_1._)("Please politely leave the premises without acknowledging this missing feature.")
                        ],
                        buttons: {
                            'okay': {
                                text: (0, translate_1._)('You got it, chief'),
                                nextScene: 'end'
                            }
                        }
                    }
                }
            });
        },
        destroyOnUse: false,
        destroyable: false
    },
    "Captain.supplies": {
        name: 'Supplies for the Mayor',
        text: 'They\'re heavy, but not in a way that impacts gameplay',
        onUse: function () {
            events_1.Events.startEvent({
                title: (0, translate_1._)("Supplies for the Mayor"),
                scenes: {
                    start: {
                        text: [
                            (0, translate_1._)("A big box of stuff for the village. Looks like raw materials, mostly."),
                            (0, translate_1._)("I should really take this back to the Mayor.")
                        ],
                        buttons: {
                            'okay': {
                                text: (0, translate_1._)('Okay'),
                                nextScene: 'end'
                            }
                        }
                    }
                }
            });
        },
        destroyOnUse: false,
        destroyable: false
    }
};

},{"../../lib/translate":1,"../events":7,"../notifications":11,"../state_manager":18,"./character":15}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestLog = void 0;
var state_manager_1 = require("../state_manager");
var character_1 = require("./character");
exports.QuestLog = {
    "mayorSupplies": {
        name: "Supplies for the Mayor",
        logDescription: "The mayor has asked you to get some supplies for him from the outpost.",
        phases: {
            0: {
                description: "Go check out the Road to the Outpost to see if you can find out more",
                requirements: {
                    0: {
                        renderRequirement: function () {
                            if (state_manager_1.$SM.get('road.open')
                                && typeof (state_manager_1.$SM.get('Road.counter')) == "undefined")
                                return "I should go check out the Road to the Outpost";
                            else if (state_manager_1.$SM.get('road.open')
                                && typeof (state_manager_1.$SM.get('Road.counter')) !== "undefined"
                                && typeof (state_manager_1.$SM.get('superlikely.outpostUnlock')) == "undefined")
                                return "I should keep exploring the Road to the Outpost";
                            else if (state_manager_1.$SM.get('road.open')
                                && typeof (state_manager_1.$SM.get('superlikely.outpostUnlock')) !== "undefined"
                                && state_manager_1.$SM.get('superlikely.outpostUnlock') > 0)
                                return "I've found the way to the Outpost";
                        },
                        isComplete: function () {
                            return (state_manager_1.$SM.get('road.open')
                                && typeof (state_manager_1.$SM.get('superlikely.outpostUnlock')) !== "undefined"
                                && state_manager_1.$SM.get('superlikely.outpostUnlock') > 0);
                        }
                    },
                }
            },
            1: {
                description: "Ask the Captain of the Outpost about the supplies",
                requirements: {
                    0: {
                        renderRequirement: function () {
                            if (state_manager_1.$SM.get('superlikely.outpostUnlock') > 0
                                && typeof (state_manager_1.$SM.get('outpost.captain.haveMet')) == "undefined")
                                return "I should try talking to the Captain of the Outpost";
                            else if (state_manager_1.$SM.get('superlikely.outpostUnlock') > 0
                                && typeof (state_manager_1.$SM.get('outpost.captain.haveMet')) !== "undefined"
                                && state_manager_1.$SM.get('outpost.captain.haveMet') > 0
                                && typeof (character_1.Character.inventory["Captain.supplies"]) == "undefined")
                                return "I should ask the Captain about the missing supplies";
                            else if (state_manager_1.$SM.get('superlikely.outpostUnlock') > 0
                                && typeof (state_manager_1.$SM.get('outpost.captain.haveMet')) !== "undefined"
                                && state_manager_1.$SM.get('outpost.captain.haveMet') > 0
                                && typeof (character_1.Character.inventory["Captain.supplies"]) !== "undefined")
                                return "I've gotten the supplies from the Captain";
                        },
                        isComplete: function () {
                            return (state_manager_1.$SM.get('superlikely.outpostUnlock') > 0
                                && typeof (state_manager_1.$SM.get('outpost.captain.haveMet') !== "undefined")
                                && state_manager_1.$SM.get('outpost.captain.haveMet') > 0
                                && typeof (character_1.Character.inventory["Captain.supplies"]) !== "undefined");
                        }
                    }
                }
            },
            2: {
                description: "Return the supplies to the Mayor",
                requirements: {
                    0: {
                        renderRequirement: function () {
                            if (typeof (state_manager_1.$SM.get('village.mayor.haveGivenSupplies')) == "undefined")
                                return "I should hand these supplies over to the Mayor";
                            else if (typeof (state_manager_1.$SM.get('village.mayor.haveGivenSupplies')) == "undefined"
                                && state_manager_1.$SM.get('village.mayor.haveGivenSupplies') > 0)
                                return "I've handed over the supplies to the Mayor";
                        },
                        isComplete: function () {
                            return (typeof (state_manager_1.$SM.get('village.mayor.haveGivenSupplies')) == "undefined"
                                && state_manager_1.$SM.get('village.mayor.haveGivenSupplies') > 0);
                        }
                    }
                }
            }
        }
    }
};

},{"../state_manager":18,"./character":15}],18:[function(require,module,exports){
"use strict";
/*
 * Module for handling States
 *
 * All states should be get and set through the StateManager ($SM).
 *
 * The manager is intended to handle all needed checks and error catching.
 * This includes creating the parents of layered/deep states so undefined states
 * do not need to be tested for and created beforehand.
 *
 * When a state is changed, an update event is sent out containing the name of the state
 * changed or in the case of multiple changes (.setM, .addM) the parent class changed.
 * Event: type: 'stateUpdate', stateName: <path of state or parent state>
 *
 * Original file created by: Michael Galusha
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.$SM = void 0;
var engine_1 = require("./engine");
var notifications_1 = require("./notifications");
var StateManager = {
    MAX_STORE: 99999999999999,
    options: {},
    init: function (options) {
        this.options = $.extend(this.options, options);
        //create categories
        var cats = [
            'features', //big features like buildings, location availability, unlocks, etc
            'stores', //little stuff, items, weapons, etc
            'character', //this is for player's character stats such as perks
            'income',
            'timers',
            'game', //mostly location related: fire temp, workers, population, world map, etc
            'playStats', //anything play related: play time, loads, etc
            'previous', // prestige, score, trophies (in future), achievements (again, not yet), etc
            'outfit' // used to temporarily store the items to be taken on the path
        ];
        for (var which in cats) {
            if (!exports.$SM.get(cats[which]))
                exports.$SM.set(cats[which], {});
        }
        //subscribe to stateUpdates
        // @ts-ignore
        $.Dispatch('stateUpdate').subscribe(exports.$SM.handleStateUpdates);
        // @ts-ignore
        window.$SM = this;
    },
    //create all parents and then set state
    createState: function (stateName, value) {
        var words = stateName.split(/[.\[\]'"]+/);
        //for some reason there are sometimes empty strings
        for (var i = 0; i < words.length; i++) {
            if (words[i] === '') {
                words.splice(i, 1);
                i--;
            }
        }
        // IMPORTANT: State refers to window.State, which I had to initialize manually
        //    in Engine.ts; please don't forget this and mess with anything named
        //    "State" or "window.State", this stuff is weirdly precarious after typescripting
        //    this codebase, and I don't have the sanity points to figure out why
        // @ts-ignore
        var obj = State;
        var w = null;
        for (var i = 0, len = words.length - 1; i < len; i++) {
            w = words[i];
            if (obj[w] === undefined)
                obj[w] = {};
            obj = obj[w];
        }
        obj[words[i]] = value;
        return obj;
    },
    //set single state
    //if noEvent is true, the update event won't trigger, useful for setting multiple states first
    set: function (stateName, value, noEvent) {
        var fullPath = exports.$SM.buildPath(stateName);
        //make sure the value isn't over the engine maximum
        if (typeof value == 'number' && value > exports.$SM.MAX_STORE)
            value = exports.$SM.MAX_STORE;
        try {
            eval('(' + fullPath + ') = value');
        }
        catch (e) {
            //parent doesn't exist, so make parent
            exports.$SM.createState(stateName, value);
        }
        //stores values can not be negative
        // @ts-ignore
        if (stateName.indexOf('stores') === 0 && exports.$SM.get(stateName, true) < 0) {
            eval('(' + fullPath + ') = 0');
            engine_1.Engine.log('WARNING: state:' + stateName + ' can not be a negative value. Set to 0 instead.');
        }
        engine_1.Engine.log(stateName + ' ' + value);
        if (typeof (noEvent) == "undefined" || noEvent == true) {
            engine_1.Engine.saveGame();
            exports.$SM.fireUpdate(stateName);
        }
    },
    //sets a list of states
    setM: function (parentName, list, noEvent) {
        exports.$SM.buildPath(parentName);
        //make sure the state exists to avoid errors,
        if (exports.$SM.get(parentName) === undefined)
            exports.$SM.set(parentName, {}, true);
        for (var k in list) {
            exports.$SM.set(parentName + '["' + k + '"]', list[k], true);
        }
        if (!noEvent) {
            engine_1.Engine.saveGame();
            exports.$SM.fireUpdate(parentName);
        }
    },
    //shortcut for altering number values, return 1 if state wasn't a number
    add: function (stateName, value, noEvent) {
        var err = 0;
        //0 if undefined, null (but not {}) should allow adding to new objects
        //could also add in a true = 1 thing, to have something go from existing (true)
        //to be a count, but that might be unwanted behavior (add with loose eval probably will happen anyways)
        var old = exports.$SM.get(stateName, true);
        //check for NaN (old != old) and non number values
        if (old != old) {
            engine_1.Engine.log('WARNING: ' + stateName + ' was corrupted (NaN). Resetting to 0.');
            old = 0;
            exports.$SM.set(stateName, old + value, noEvent);
        }
        else if (typeof old != 'number' || typeof value != 'number') {
            engine_1.Engine.log('WARNING: Can not do math with state:' + stateName + ' or value:' + value + ' because at least one is not a number.');
            err = 1;
        }
        else {
            exports.$SM.set(stateName, old + value, noEvent); //setState handles event and save
        }
        return err;
    },
    //alters multiple number values, return number of fails
    addM: function (parentName, list, noEvent) {
        var err = 0;
        //make sure the parent exists to avoid errors
        if (exports.$SM.get(parentName) === undefined)
            exports.$SM.set(parentName, {}, true);
        for (var k in list) {
            if (exports.$SM.add(parentName + '["' + k + '"]', list[k], true))
                err++;
        }
        if (!noEvent) {
            engine_1.Engine.saveGame();
            exports.$SM.fireUpdate(parentName);
        }
        return err;
    },
    //return state, undefined or 0
    get: function (stateName, requestZero) {
        var whichState = null;
        var fullPath = exports.$SM.buildPath(stateName);
        //catch errors if parent of state doesn't exist
        try {
            eval('whichState = (' + fullPath + ')');
        }
        catch (e) {
            whichState = undefined;
        }
        //prevents repeated if undefined, null, false or {}, then x = 0 situations
        if ((!whichState
        //  || whichState == {}
        ) && requestZero)
            return 0;
        else
            return whichState;
    },
    //mainly for local copy use, add(M) can fail so we can't shortcut them
    //since set does not fail, we know state exists and can simply return the object
    setget: function (stateName, value, noEvent) {
        exports.$SM.set(stateName, value, noEvent);
        return eval('(' + exports.$SM.buildPath(stateName) + ')');
    },
    remove: function (stateName, noEvent) {
        var whichState = exports.$SM.buildPath(stateName);
        try {
            eval('(delete ' + whichState + ')');
        }
        catch (e) {
            //it didn't exist in the first place
            engine_1.Engine.log('WARNING: Tried to remove non-existant state \'' + stateName + '\'.');
        }
        if (!noEvent) {
            engine_1.Engine.saveGame();
            exports.$SM.fireUpdate(stateName);
        }
    },
    //creates full reference from input
    //hopefully this won't ever need to be more complicated
    buildPath: function (input) {
        var dot = (input.charAt(0) == '[') ? '' : '.'; //if it starts with [foo] no dot to join
        return 'State' + dot + input;
    },
    fireUpdate: function (stateName, save) {
        var category = exports.$SM.getCategory(stateName);
        if (stateName == undefined)
            stateName = category = 'all'; //best if this doesn't happen as it will trigger more stuff
        // @ts-ignore
        $.Dispatch('stateUpdate').publish({ 'category': category, 'stateName': stateName });
        if (save)
            engine_1.Engine.saveGame();
    },
    getCategory: function (stateName) {
        var firstOB = stateName.indexOf('[');
        var firstDot = stateName.indexOf('.');
        var cutoff = null;
        if (firstOB == -1 || firstDot == -1) {
            cutoff = firstOB > firstDot ? firstOB : firstDot;
        }
        else {
            cutoff = firstOB < firstDot ? firstOB : firstDot;
        }
        if (cutoff == -1) {
            return stateName;
        }
        else {
            return stateName.substr(0, cutoff);
        }
    },
    /******************************************************************
     * Start of specific state functions
     ******************************************************************/
    //PERKS
    addPerk: function (name) {
        exports.$SM.set('character.perks["' + name + '"]', true);
        notifications_1.Notifications.notify(null, engine_1.Engine.Perks[name].notify);
    },
    hasPerk: function (name) {
        return exports.$SM.get('character.perks["' + name + '"]');
    },
    //INCOME
    setIncome: function (source, options) {
        var existing = exports.$SM.get('income["' + source + '"]');
        if (typeof existing != 'undefined') {
            options.timeLeft = existing === null || existing === void 0 ? void 0 : existing.timeLeft;
        }
        exports.$SM.set('income["' + source + '"]', options);
    },
    getIncome: function (source) {
        var existing = exports.$SM.get('income["' + source + '"]');
        if (typeof existing != 'undefined') {
            return existing;
        }
        return {};
    },
    //Misc
    num: function (name, craftable) {
        switch (craftable.type) {
            case 'good':
            case 'tool':
            case 'weapon':
            case 'upgrade':
                return exports.$SM.get('stores["' + name + '"]', true);
            case 'building':
                return exports.$SM.get('game.buildings["' + name + '"]', true);
        }
    },
    handleStateUpdates: function (e) {
    }
};
//alias
exports.$SM = StateManager;

},{"./engine":6,"./notifications":11}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weather = void 0;
var notifications_1 = require("./notifications");
var state_manager_1 = require("./state_manager");
var engine_1 = require("./engine");
exports.Weather = {
    init: function (options) {
        this.options = $.extend(this.options, options);
        //subscribe to stateUpdates
        // @ts-ignore
        $.Dispatch('stateUpdate').subscribe(exports.Weather.handleStateUpdates);
    },
    handleStateUpdates: function (e) {
        if (e.category == 'weather') {
            switch (state_manager_1.$SM.get('weather')) {
                case 'sunny':
                    exports.Weather.startSunny();
                    break;
                case 'cloudy':
                    exports.Weather.startCloudy();
                    break;
                case 'rainy':
                    exports.Weather.startRainy();
                    break;
                default:
            }
        }
    },
    _lastWeather: 'sunny',
    startSunny: function () {
        notifications_1.Notifications.notify(null, "The sun begins to shine.");
        exports.Weather._lastWeather = 'sunny';
        $('body').animate({ backgroundColor: '#FFFFFF' }, 'slow');
        $('div#stores::before').animate({ backgroundColor: '#FFFFFF' }, 'slow');
        exports.Weather.makeRainStop();
    },
    startCloudy: function () {
        if (exports.Weather._lastWeather == 'sunny') {
            notifications_1.Notifications.notify(null, "Clouds roll in, obscuring the sun.");
        }
        else if (exports.Weather._lastWeather == 'rainy') {
            notifications_1.Notifications.notify(null, "The rain breaks, but the clouds remain.");
        }
        $('body').animate({ backgroundColor: '#8B8786' }, 'slow');
        $('div#stores::before').animate({ backgroundColor: '#8B8786' }, 'slow');
        exports.Weather._lastWeather = 'cloudy';
        exports.Weather.makeRainStop();
    },
    startRainy: function () {
        if (exports.Weather._lastWeather == 'sunny') {
            notifications_1.Notifications.notify(null, "The wind suddenly picks up. Clouds roll in, heavy with rain, and raindrops fall soon after.");
        }
        else if (exports.Weather._lastWeather == 'cloudy') {
            notifications_1.Notifications.notify(null, "The clouds that were previously content to hang overhead let loose a moderate downpour.");
        }
        $('body').animate({ backgroundColor: '#6D6968' }, 'slow');
        $('div#stores::before').animate({ backgroundColor: '#6D6968' }, 'slow');
        exports.Weather._lastWeather = 'rainy';
        exports.Weather.makeItRain();
    },
    _location: '',
    initiateWeather: function (availableWeather, location) {
        var _this = this;
        if (exports.Weather._location == '')
            exports.Weather._location = location;
        // if in new location, end without triggering a new weather initiation, 
        // leaving the new location's initiateWeather callback to do its thing
        else if (exports.Weather._location != location)
            return;
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
        if (chosenWeather != state_manager_1.$SM.get('weather'))
            state_manager_1.$SM.set('weather', chosenWeather);
        engine_1.Engine.setTimeout(function () {
            _this.initiateWeather(availableWeather, location);
        }, 3 * 60 * 1000);
    },
    makeItRain: function () {
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
    makeRainStop: function () {
        $('.rain').empty();
    }
};

},{"./engine":6,"./notifications":11,"./state_manager":18}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL3RyYW5zbGF0ZS50cyIsInNyYy9zY3JpcHQvQnV0dG9uLnRzIiwic3JjL3NjcmlwdC9jaGFyYWN0ZXJzL2NhcHRhaW4udHMiLCJzcmMvc2NyaXB0L2NoYXJhY3RlcnMvbGl6LnRzIiwic3JjL3NjcmlwdC9jaGFyYWN0ZXJzL21heW9yLnRzIiwic3JjL3NjcmlwdC9lbmdpbmUudHMiLCJzcmMvc2NyaXB0L2V2ZW50cy50cyIsInNyYy9zY3JpcHQvZXZlbnRzL3JvYWR3YW5kZXIudHMiLCJzcmMvc2NyaXB0L2V2ZW50cy9yb29tLnRzIiwic3JjL3NjcmlwdC9oZWFkZXIudHMiLCJzcmMvc2NyaXB0L25vdGlmaWNhdGlvbnMudHMiLCJzcmMvc2NyaXB0L3BsYWNlcy9vdXRwb3N0LnRzIiwic3JjL3NjcmlwdC9wbGFjZXMvcm9hZC50cyIsInNyYy9zY3JpcHQvcGxhY2VzL3Jvb20udHMiLCJzcmMvc2NyaXB0L3BsYXllci9jaGFyYWN0ZXIudHMiLCJzcmMvc2NyaXB0L3BsYXllci9pdGVtTGlzdC50cyIsInNyYy9zY3JpcHQvcGxheWVyL3F1ZXN0TG9nLnRzIiwic3JjL3NjcmlwdC9zdGF0ZV9tYW5hZ2VyLnRzIiwic3JjL3NjcmlwdC93ZWF0aGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLGdCQUFnQjs7O0FBRWhCLGtDQUFrQztBQUNsQyxLQUFLO0FBQ0wsdUNBQXVDO0FBRXZDLG9DQUFvQztBQUNwQyxNQUFNO0FBQ04sMkNBQTJDO0FBQzNDLE1BQU07QUFDTixtQ0FBbUM7QUFDbkMsTUFBTTtBQUNOLHNDQUFzQztBQUN0QywwQ0FBMEM7QUFFMUMscUNBQXFDO0FBQ3JDLE1BQU07QUFFTixrQkFBa0I7QUFDbEIsTUFBTTtBQUVOLDhEQUE4RDtBQUM5RCxvQ0FBb0M7QUFFcEMsdUhBQXVIO0FBQ3ZILHdDQUF3QztBQUN4Qyw2QkFBNkI7QUFDN0Is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QVUsR0FBRyw0QkFBNEIsR0FBRyxVQUFVLEdBQUcsa0JBQWtCLENBQUM7WUFDemIsU0FBUyxJQUFJLGtDQUFrQyxHQUFHLFNBQVMsR0FBRyxhQUFhLEdBQUcsQ0FBQyxVQUFVLEdBQUcsVUFBVSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyx3QkFBd0IsR0FBRyxVQUFVLEdBQUcsNEJBQTRCLEdBQUcsVUFBVSxHQUFHLGtEQUFrRCxHQUFHLFVBQVUsR0FBRyw0QkFBNEIsR0FBRyxVQUFVLEdBQUcseURBQXlELEdBQUcsVUFBVSxHQUFHLDRCQUE0QixHQUFHLFVBQVUsR0FBRyxrQkFBa0IsQ0FBQztRQUNoYyxDQUFDO1FBRUQsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsWUFBWSxFQUFFO1FBQ1YsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3ZCLENBQUM7Q0FDSixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gKGZ1bmN0aW9uKCkge1xyXG5cclxuLy8gXHR2YXIgdHJhbnNsYXRlID0gZnVuY3Rpb24odGV4dClcclxuLy8gXHR7XHJcbi8vIFx0XHR2YXIgeGxhdGUgPSB0cmFuc2xhdGVMb29rdXAodGV4dCk7XHJcblx0XHRcclxuLy8gXHRcdGlmICh0eXBlb2YgeGxhdGUgPT0gXCJmdW5jdGlvblwiKVxyXG4vLyBcdFx0e1xyXG4vLyBcdFx0XHR4bGF0ZSA9IHhsYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbi8vIFx0XHR9XHJcbi8vIFx0XHRlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSlcclxuLy8gXHRcdHtcclxuLy8gXHRcdFx0dmFyIGFwcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcclxuLy8gXHRcdFx0dmFyIGFyZ3MgPSBhcHMuY2FsbCggYXJndW1lbnRzLCAxICk7XHJcbiAgXHJcbi8vIFx0XHRcdHhsYXRlID0gZm9ybWF0dGVyKHhsYXRlLCBhcmdzKTtcclxuLy8gXHRcdH1cclxuXHRcdFxyXG4vLyBcdFx0cmV0dXJuIHhsYXRlO1xyXG4vLyBcdH07XHJcblx0XHJcbi8vIFx0Ly8gSSB3YW50IGl0IGF2YWlsYWJsZSBleHBsaWNpdHkgYXMgd2VsbCBhcyB2aWEgdGhlIG9iamVjdFxyXG4vLyBcdHRyYW5zbGF0ZS50cmFuc2xhdGUgPSB0cmFuc2xhdGU7XHJcblx0XHJcbi8vIFx0Ly9mcm9tIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tLzc3NjE5NiB2aWEgaHR0cDovL2RhdmVkYXNoLmNvbS8yMDEwLzExLzE5L3B5dGhvbmljLXN0cmluZy1mb3JtYXR0aW5nLWluLWphdmFzY3JpcHQvIFxyXG4vLyBcdHZhciBkZWZhdWx0Rm9ybWF0dGVyID0gKGZ1bmN0aW9uKCkge1xyXG4vLyBcdFx0dmFyIHJlID0gL1xceyhbXn1dKylcXH0vZztcclxuLy8gXHRcdHJldHVybiBmdW5jdGlvbihzLCBhcmdzKSB7XHJcbi8vIFx0XHRcdHJldHVybiBzLnJlcGxhY2UocmUsIGZ1bmN0aW9uKF8sIG1hdGNoKXsgcmV0dXJuIGFyZ3NbbWF0Y2hdOyB9KTtcclxuLy8gXHRcdH07XHJcbi8vIFx0fSgpKTtcclxuLy8gXHR2YXIgZm9ybWF0dGVyID0gZGVmYXVsdEZvcm1hdHRlcjtcclxuLy8gXHR0cmFuc2xhdGUuc2V0Rm9ybWF0dGVyID0gZnVuY3Rpb24obmV3Rm9ybWF0dGVyKVxyXG4vLyBcdHtcclxuLy8gXHRcdGZvcm1hdHRlciA9IG5ld0Zvcm1hdHRlcjtcclxuLy8gXHR9O1xyXG5cdFxyXG4vLyBcdHRyYW5zbGF0ZS5mb3JtYXQgPSBmdW5jdGlvbigpXHJcbi8vIFx0e1xyXG4vLyBcdFx0dmFyIGFwcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcclxuLy8gXHRcdHZhciBzID0gYXJndW1lbnRzWzBdO1xyXG4vLyBcdFx0dmFyIGFyZ3MgPSBhcHMuY2FsbCggYXJndW1lbnRzLCAxICk7XHJcbiAgXHJcbi8vIFx0XHRyZXR1cm4gZm9ybWF0dGVyKHMsIGFyZ3MpO1xyXG4vLyBcdH07XHJcblxyXG4vLyBcdHZhciBkeW5vVHJhbnMgPSBudWxsO1xyXG4vLyBcdHRyYW5zbGF0ZS5zZXREeW5hbWljVHJhbnNsYXRvciA9IGZ1bmN0aW9uKG5ld0R5bm9UcmFucylcclxuLy8gXHR7XHJcbi8vIFx0XHRkeW5vVHJhbnMgPSBuZXdEeW5vVHJhbnM7XHJcbi8vIFx0fTtcclxuXHJcbi8vIFx0dmFyIHRyYW5zbGF0aW9uID0gbnVsbDtcclxuLy8gXHR0cmFuc2xhdGUuc2V0VHJhbnNsYXRpb24gPSBmdW5jdGlvbihuZXdUcmFuc2xhdGlvbilcclxuLy8gXHR7XHJcbi8vIFx0XHR0cmFuc2xhdGlvbiA9IG5ld1RyYW5zbGF0aW9uO1xyXG4vLyBcdH07XHJcblx0XHJcbi8vIFx0ZnVuY3Rpb24gdHJhbnNsYXRlTG9va3VwKHRhcmdldClcclxuLy8gXHR7XHJcbi8vIFx0XHRpZiAodHJhbnNsYXRpb24gPT0gbnVsbCB8fCB0YXJnZXQgPT0gbnVsbClcclxuLy8gXHRcdHtcclxuLy8gXHRcdFx0cmV0dXJuIHRhcmdldDtcclxuLy8gXHRcdH1cclxuXHRcdFxyXG4vLyBcdFx0aWYgKHRhcmdldCBpbiB0cmFuc2xhdGlvbiA9PSBmYWxzZSlcclxuLy8gXHRcdHtcclxuLy8gXHRcdFx0aWYgKGR5bm9UcmFucyAhPSBudWxsKVxyXG4vLyBcdFx0XHR7XHJcbi8vIFx0XHRcdFx0cmV0dXJuIGR5bm9UcmFucyh0YXJnZXQpO1xyXG4vLyBcdFx0XHR9XHJcbi8vIFx0XHRcdHJldHVybiB0YXJnZXQ7XHJcbi8vIFx0XHR9XHJcblx0XHRcclxuLy8gXHRcdHZhciByZXN1bHQgPSB0cmFuc2xhdGlvblt0YXJnZXRdO1xyXG4vLyBcdFx0aWYgKHJlc3VsdCA9PSBudWxsKVxyXG4vLyBcdFx0e1xyXG4vLyBcdFx0XHRyZXR1cm4gdGFyZ2V0O1xyXG4vLyBcdFx0fVxyXG5cdFx0XHJcbi8vIFx0XHRyZXR1cm4gcmVzdWx0O1xyXG4vLyBcdH07XHJcblx0XHJcbi8vIFx0d2luZG93Ll8gPSB0cmFuc2xhdGU7XHJcblxyXG4vLyB9KSgpO1xyXG5cclxuLy8gZXhwb3J0IGNvbnN0IF8gPSB3aW5kb3cuXztcclxuXHJcbmV4cG9ydCBjb25zdCBfID0gZnVuY3Rpb24ocykgeyByZXR1cm4gczsgfSIsImltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uL2xpYi90cmFuc2xhdGVcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBCdXR0b24gPSB7XHJcblx0QnV0dG9uOiBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0XHRpZih0eXBlb2Ygb3B0aW9ucy5jb29sZG93biA9PSAnbnVtYmVyJykge1xyXG5cdFx0XHR0aGlzLmRhdGFfY29vbGRvd24gPSBvcHRpb25zLmNvb2xkb3duO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5kYXRhX3JlbWFpbmluZyA9IDA7XHJcblx0XHRpZih0eXBlb2Ygb3B0aW9ucy5jbGljayA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdHRoaXMuZGF0YV9oYW5kbGVyID0gb3B0aW9ucy5jbGljaztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dmFyIGVsID0gJCgnPGRpdj4nKVxyXG5cdFx0XHQuYXR0cignaWQnLCB0eXBlb2Yob3B0aW9ucy5pZCkgIT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmlkIDogXCJCVE5fXCIgKyBFbmdpbmUuZ2V0R3VpZCgpKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2J1dHRvbicpXHJcblx0XHRcdC50ZXh0KHR5cGVvZihvcHRpb25zLnRleHQpICE9ICd1bmRlZmluZWQnID8gb3B0aW9ucy50ZXh0IDogXCJidXR0b25cIilcclxuXHRcdFx0LmNsaWNrKGZ1bmN0aW9uKCkgeyBcclxuXHRcdFx0XHRpZighJCh0aGlzKS5oYXNDbGFzcygnZGlzYWJsZWQnKSkge1xyXG5cdFx0XHRcdFx0QnV0dG9uLmNvb2xkb3duKCQodGhpcykpO1xyXG5cdFx0XHRcdFx0JCh0aGlzKS5kYXRhKFwiaGFuZGxlclwiKSgkKHRoaXMpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHRcdC5kYXRhKFwiaGFuZGxlclwiLCAgdHlwZW9mIG9wdGlvbnMuY2xpY2sgPT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnMuY2xpY2sgOiBmdW5jdGlvbigpIHsgRW5naW5lLmxvZyhcImNsaWNrXCIpOyB9KVxyXG5cdFx0XHQuZGF0YShcInJlbWFpbmluZ1wiLCAwKVxyXG5cdFx0XHQuZGF0YShcImNvb2xkb3duXCIsIHR5cGVvZiBvcHRpb25zLmNvb2xkb3duID09ICdudW1iZXInID8gb3B0aW9ucy5jb29sZG93biA6IDApO1xyXG5cdFx0aWYgKHR5cGVvZihvcHRpb25zLmltYWdlKSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG5cdFx0XHRlbC5hdHRyKFwic3R5bGVcIiwgXCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXFxcIlwiICsgb3B0aW9ucy5pbWFnZSArIFwiXFxcIik7IGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7IGJhY2tncm91bmQtc2l6ZTogY292ZXI7IGhlaWdodDogMTcwcHg7IGNvbG9yOiB3aGl0ZTt0ZXh0LXNoYWRvdzogMHB4IDBweCAycHggYmxhY2tcIilcclxuXHRcdH1cclxuXHRcdGVsLmFwcGVuZCgkKFwiPGRpdj5cIikuYWRkQ2xhc3MoJ2Nvb2xkb3duJykpO1xyXG5cdFx0XHJcblx0XHRpZihvcHRpb25zLmNvc3QpIHtcclxuXHRcdFx0dmFyIHR0UG9zID0gb3B0aW9ucy50dFBvcyA/IG9wdGlvbnMudHRQb3MgOiBcImJvdHRvbSByaWdodFwiO1xyXG5cdFx0XHR2YXIgY29zdFRvb2x0aXAgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCd0b29sdGlwICcgKyB0dFBvcyk7XHJcblx0XHRcdGZvcih2YXIgayBpbiBvcHRpb25zLmNvc3QpIHtcclxuXHRcdFx0XHQkKFwiPGRpdj5cIikuYWRkQ2xhc3MoJ3Jvd19rZXknKS50ZXh0KF8oaykpLmFwcGVuZFRvKGNvc3RUb29sdGlwKTtcclxuXHRcdFx0XHQkKFwiPGRpdj5cIikuYWRkQ2xhc3MoJ3Jvd192YWwnKS50ZXh0KG9wdGlvbnMuY29zdFtrXSkuYXBwZW5kVG8oY29zdFRvb2x0aXApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNvc3RUb29sdGlwLmNoaWxkcmVuKCkubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdGNvc3RUb29sdGlwLmFwcGVuZFRvKGVsKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZihvcHRpb25zLndpZHRoKSB7XHJcblx0XHRcdGVsLmNzcygnd2lkdGgnLCBvcHRpb25zLndpZHRoKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGVsO1xyXG5cdH0sXHJcblx0XHJcblx0c2V0RGlzYWJsZWQ6IGZ1bmN0aW9uKGJ0biwgZGlzYWJsZWQpIHtcclxuXHRcdGlmKGJ0bikge1xyXG5cdFx0XHRpZighZGlzYWJsZWQgJiYgIWJ0bi5kYXRhKCdvbkNvb2xkb3duJykpIHtcclxuXHRcdFx0XHRidG4ucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdH0gZWxzZSBpZihkaXNhYmxlZCkge1xyXG5cdFx0XHRcdGJ0bi5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRidG4uZGF0YSgnZGlzYWJsZWQnLCBkaXNhYmxlZCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRpc0Rpc2FibGVkOiBmdW5jdGlvbihidG4pIHtcclxuXHRcdGlmKGJ0bikge1xyXG5cdFx0XHRyZXR1cm4gYnRuLmRhdGEoJ2Rpc2FibGVkJykgPT09IHRydWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHRcclxuXHRjb29sZG93bjogZnVuY3Rpb24oYnRuKSB7XHJcblx0XHR2YXIgY2QgPSBidG4uZGF0YShcImNvb2xkb3duXCIpO1xyXG5cdFx0aWYoY2QgPiAwKSB7XHJcblx0XHRcdCQoJ2Rpdi5jb29sZG93bicsIGJ0bikuc3RvcCh0cnVlLCB0cnVlKS53aWR0aChcIjEwMCVcIikuYW5pbWF0ZSh7d2lkdGg6ICcwJSd9LCBjZCAqIDEwMDAsICdsaW5lYXInLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgYiA9ICQodGhpcykuY2xvc2VzdCgnLmJ1dHRvbicpO1xyXG5cdFx0XHRcdGIuZGF0YSgnb25Db29sZG93bicsIGZhbHNlKTtcclxuXHRcdFx0XHRpZighYi5kYXRhKCdkaXNhYmxlZCcpKSB7XHJcblx0XHRcdFx0XHRiLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdGJ0bi5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdFx0YnRuLmRhdGEoJ29uQ29vbGRvd24nLCB0cnVlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGNsZWFyQ29vbGRvd246IGZ1bmN0aW9uKGJ0bikge1xyXG5cdFx0JCgnZGl2LmNvb2xkb3duJywgYnRuKS5zdG9wKHRydWUsIHRydWUpO1xyXG5cdFx0YnRuLmRhdGEoJ29uQ29vbGRvd24nLCBmYWxzZSk7XHJcblx0XHRpZighYnRuLmRhdGEoJ2Rpc2FibGVkJykpIHtcclxuXHRcdFx0YnRuLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0fVxyXG5cdH1cclxufTsiLCJpbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCJcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIlxyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIlxyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tIFwiLi4vcGxheWVyL2NoYXJhY3RlclwiXHJcblxyXG5leHBvcnQgY29uc3QgQ2FwdGFpbiA9IHtcclxuXHR0YWxrVG9DYXB0YWluOiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ1RoZSBDYXB0YWluXFwncyBUZW50JyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VlbkZsYWc6ICgpID0+ICRTTS5nZXQoJ291dHBvc3QuY2FwdGFpbi5oYXZlTWV0JyksXHJcblx0XHRcdFx0XHRuZXh0U2NlbmU6ICdtYWluJyxcclxuXHRcdFx0XHRcdG9uTG9hZDogKCkgPT4gJFNNLnNldCgnb3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnLCAxKSxcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnWW91IGVudGVyIHRoZSBmYW5jaWVzdC1sb29raW5nIHRlbnQgaW4gdGhlIE91dHBvc3QuIEEgbGFyZ2UgbWFuIHdpdGggYSB0b290aGJydXNoIG11c3RhY2hlIGFuZCBhIHNldmVyZSBmcm93biBsb29rcyB1cCBmcm9tIGhpcyBkZXNrLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIlNpciwgeW91IGhhdmUgZW50ZXJlZCB0aGUgdGVudCBvZiBDYXB0YWluIEZpbm5lYXMuIFdoYXQgYnVzaW5lc3MgZG8geW91IGhhdmUgaGVyZT9cIicpXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhc2tBYm91dFN1cHBsaWVzJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnQXNrIEFib3V0IFN1cHBsaWVzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOiAnYXNrQWJvdXRTdXBwbGllcyd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhc2tBYm91dENhcHRhaW4nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBc2sgQWJvdXQgQ2FwdGFpbicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTogJ2NhcHRhaW5SYW1ibGUnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnbGVhdmUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdMZWF2ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICdtYWluJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnVGhlIENhcHRhaW4gZ3JlZXRzIHlvdSB3YXJtbHkuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiQWhoLCB5ZXMsIHdlbGNvbWUgYmFjay4gV2hhdCBjYW4gSSBkbyBmb3IgeW91P1wiJylcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Fza0Fib3V0U3VwcGxpZXMnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBc2sgQWJvdXQgU3VwcGxpZXMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6J2Fza0Fib3V0U3VwcGxpZXMnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiBDYXB0YWluLmhhbmRsZVN1cHBsaWVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlOiAoKSA9PiAhJFNNLmdldCgnb3V0cG9zdC5jYXB0YWluLmFza2VkQWJvdXRTdXBwbGllcycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhc2tBYm91dENhcHRhaW4nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBc2sgQWJvdXQgQ2FwdGFpbicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTonY2FwdGFpblJhbWJsZSd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0xlYXZlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgJ2NhcHRhaW5SYW1ibGUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdUaGUgQ2FwdGFpblxcJ3MgZXllcyBnbGVhbSBhdCB0aGUgb3Bwb3J0dW5pdHkgdG8gcnVuIGRvd24gaGlzIGxpc3Qgb2YgYWNoaWV2ZW1lbnRzLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIldoeSwgSVxcJ2xsIGhhdmUgeW91IGtub3cgdGhhdCB5b3Ugc3RhbmQgaW4gdGhlIHByZXNlbmNlIG9mIG5vbmUgb3RoZXIgdGhhbiBGaW5uZWFzIEouIEZvYnNsZXksIENhcHRhaW4gb2YgdGhlIFJveWFsIEFybXlcXCdzIEZpZnRoIERpdmlzaW9uLCB0aGUgZmluZXN0IERpdmlzaW9uIGluIEhpcyBNYWplc3R5XFwncyBzZXJ2aWNlLlwiJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ0hlIHB1ZmZzIG91dCBoaXMgY2hlc3QsIGRyYXdpbmcgYXR0ZW50aW9uIHRvIGhpcyBtYW55IG1lZGFscy4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCJJIGhhdmUgY2FtcGFpZ25lZCBvbiBiZWhhbGYgb2YgT3VyIExvcmRzaGlwIGFjcm9zcyBtYW55IGxhbmRzLCBpbmNsdWRpbmcgVGhlIEZhciBXZXN0LCB0aGUgbm9ydGhlcm4gYm9yZGVycyBvZiBVbWJlcnNoaXJlIGFuZCBQZWxpbmdhbCwgTmV3IEJlbGxpc2lhLCBhbmQgZWFjaCBvZiB0aGUgRml2ZSBJc2xlcyBvZiB0aGUgUGlycmhpYW4gU2VhLlwiJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ0hlIHBhdXNlcyBmb3IgYSBtb21lbnQsIHBlcmhhcHMgdG8gc2VlIGlmIHlvdSBhcmUgc3VpdGFibHkgaW1wcmVzc2VkLCB0aGVuIGNvbnRpbnVlcy4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCJBcyBDYXB0YWluIG9mIHRoZSBGaWZ0aCBEaXZpc2lvbiwgSSBoYWQgdGhlIGVzdGVlbWVkIHByaXZpbGVnZSBvZiBlbnN1cmluZyB0aGUgc2FmZXR5IG9mIHRoZXNlIGxhbmRzIGZvciBvdXIgZmFpciBjaXRpemVucy4gSSBoYXZlIGJlZW4gYXdhcmRlZCBtYW55IHRpbWVzIG92ZXIgZm9yIG15IGJyYXZlcnkgaW4gdGhlIGZhY2Ugb2YgdXRtb3N0IHBlcmlsLiBGb3IgaW5zdGFuY2UsIGR1cmluZyB0aGUgU2VhIENhbXBhaWduIG9uIFRoeXBwZSwgVGhpcmQgb2YgdGhlIEZpdmUgSXNsZXMsIHdlIHdlcmUgYW1idXNoZWQgd2hpbGUgZGlzZW1iYXJraW5nIGZyb20gb3VyIHNoaXAuIFRoaW5raW5nIHF1aWNrbHksIEkuLi5cIicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdUaGUgY2FwdGFpbiBjb250aW51ZXMgdG8gcmFtYmxlIGxpa2UgdGhpcyBmb3Igc2V2ZXJhbCBtb3JlIG1pbnV0ZXMsIGdpdmluZyB5b3UgdGltZSB0byBiZWNvbWUgbXVjaCBtb3JlIGZhbWlsaWFyIHdpdGggdGhlIGRpcnQgdW5kZXIgeW91ciBmaW5nZXJuYWlscy4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCIuLi4gYW5kIFRIQVQsIG15IGdvb2QgYWR2ZW50dXJlciwgaXMgd2h5IEkgYWx3YXlzIGtlZXAgZnJlc2ggYmFzaWwgb24gaGFuZC5cIicpXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdmYXNjaW5hdGluZyc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0Zhc2NpbmF0aW5nJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOidtYWluQ29udGludWVkJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAnbWFpbkNvbnRpbnVlZCc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1RoZSBDYXB0YWluIHNodWZmbGVzIGhpcyBwYXBlcnMgaW4gYSBzb21ld2hhdCBwZXJmb3JtYXRpdmUgd2F5LicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIldhcyB0aGVyZSBzb21ldGhpbmcgZWxzZSB5b3UgbmVlZGVkP1wiJylcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Fza0Fib3V0U3VwcGxpZXMnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBc2sgQWJvdXQgU3VwcGxpZXMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6J2Fza0Fib3V0U3VwcGxpZXMnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZTogKCkgPT4gISRTTS5nZXQoJ291dHBvc3QuY2FwdGFpbi5hc2tlZEFib3V0U3VwcGxpZXMnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXNrQWJvdXRDYXB0YWluJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnQXNrIEFib3V0IENhcHRhaW4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6J2NhcHRhaW5SYW1ibGUnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnbGVhdmUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdMZWF2ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICdhc2tBYm91dFN1cHBsaWVzJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnVGhlIENhcHRhaW5cXCdzIGV5ZXMgZ2xlYW0gd2l0aCBhIG1peHR1cmUgb2YgcmVhbGl6YXRpb24gYW5kIGd1aWx0LicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIkFoaCwgeWVzLCByaWdodCwgdGhlIHN1cHBsaWVzLiBJIHN1cHBvc2UgdGhlIE1heW9yIGlzIHN0aWxsIHdhaXRpbmcgZm9yIHRob3NlLiBIYXZlIGEgbG9vayBpbiB0aGF0IGNoZXN0IG92ZXIgdGhlcmUsIGl0IHNob3VsZCBoYXZlIGV2ZXJ5dGhpbmcgeW91IG5lZWQuXCInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnSGUgaW5kaWNhdGVzIHRvIGEgY2hlc3QgYXQgdGhlIGJhY2sgb2YgdGhlIHJvb20uIFlvdSBvcGVuIHRoZSBsaWQsIHJldmVhbGluZyB0aGUgc3VwcGxpZXMgd2l0aGluLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdZb3UgdGFrZSB0aGUgc3VwcGxpZXMuJylcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBaXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfSxcclxuXHJcbiAgICBoYW5kbGVTdXBwbGllczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2hhbmRsaW5nIHN1cHBsaWVzJyk7XHJcbiAgICAgICAgJFNNLnNldCgnb3V0cG9zdC5jYXB0YWluLmFza2VkQWJvdXRTdXBwbGllcycsIDEpO1xyXG4gICAgICAgIENoYXJhY3Rlci5hZGRUb0ludmVudG9yeShcIkNhcHRhaW4uc3VwcGxpZXNcIik7XHJcbiAgICAgICAgLy8gQ2hhcmFjdGVyLnNldFF1ZXN0U3RhdHVzKFwibWF5b3JTdXBwbGllc1wiLCAyKTtcclxuICAgICAgICBDaGFyYWN0ZXIuY2hlY2tRdWVzdFN0YXR1cyhcIm1heW9yU3VwcGxpZXNcIik7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyBSb29tIH0gZnJvbSBcIi4uL3BsYWNlcy9yb29tXCI7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuLi9wbGF5ZXIvY2hhcmFjdGVyXCI7XHJcblxyXG5leHBvcnQgY29uc3QgTGl6ID0ge1xyXG4gICAgc2V0TGl6QWN0aXZlOiBmdW5jdGlvbigpIHtcclxuXHRcdCRTTS5zZXQoJ3ZpbGxhZ2UubGl6QWN0aXZlJywgMSk7XHJcblx0XHQkU00uc2V0KCd2aWxsYWdlLmxpei5jYW5GaW5kQm9vaycsIDApO1xyXG5cdFx0JFNNLnNldCgndmlsbGFnZS5saXouaGFzQm9vaycsIDEpO1xyXG5cdFx0Um9vbS51cGRhdGVCdXR0b24oKTtcclxuXHR9LFxyXG5cclxuXHR0YWxrVG9MaXo6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnTGl6XFwncyBob3VzZSwgYXQgdGhlIGVkZ2Ugb2YgdG93bicpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0c2VlbkZsYWc6ICgpID0+ICRTTS5nZXQoJ3ZpbGxhZ2UubGl6LmhhdmVNZXQnKSxcclxuXHRcdFx0XHRcdG5leHRTY2VuZTogJ21haW4nLFxyXG5cdFx0XHRcdFx0b25Mb2FkOiAoKSA9PiAkU00uc2V0KCd2aWxsYWdlLmxpei5oYXZlTWV0JywgMSksXHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1lvdSBlbnRlciB0aGUgYnVpbGRpbmcgYW5kIGFyZSBpbW1lZGlhdGVseSBwbHVuZ2VkIGludG8gYSBsYWJ5cmludGggb2Ygc2hlbHZlcyBoYXBoYXphcmRseSBmaWxsZWQgd2l0aCBib29rcyBvZiBhbGwga2luZHMuIEFmdGVyIGEgYml0IG9mIHNlYXJjaGluZywgeW91IGZpbmQgYSBzaWRlIHJvb20gd2hlcmUgYSB3b21hbiB3aXRoIG1vdXN5IGhhaXIgYW5kIGdsYXNzZXMgaXMgc2l0dGluZyBhdCBhIHdyaXRpbmcgZGVzay4gU2hlXFwncyByZWFkaW5nIGEgbGFyZ2UgYm9vayB0aGF0IGFwcGVhcnMgdG8gaW5jbHVkZSBkaWFncmFtcyBvZiBzb21lIHNvcnQgb2YgcGxhbnQuIFNoZSBsb29rcyB1cCBhcyB5b3UgZW50ZXIgdGhlIHJvb20uJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiV2hvIHRoZSBoZWxsIGFyZSB5b3U/XCInKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2Fza0Fib3V0VG93bic6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgYWJvdXQgQ2hhZHRvcGlhJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2NoYWR0b3BpYVJhbWJsZSd9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdxdWVzdCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgZm9yIGEgcXVlc3QnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAncXVlc3RSZXF1ZXN0J31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0xlYXZlJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnY2hhZHRvcGlhUmFtYmxlJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdMaXogbG9va3MgYXQgeW91IGZvciBhIG1vbWVudCBiZWZvcmUgcmV0dXJuaW5nIGhlciBnYXplIHRvIHRoZSBib29rIGluIGZyb250IG9mIGhlci4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJUaGVyZVxcJ3MgYSBib29rIGluIGhlcmUgc29tZXdoZXJlIGFib3V0IHRoZSBmb3VuZGluZyBvZiBDaGFkdG9waWEuIElmIHlvdSBjYW4gZmluZCBpdCwgeW91XFwncmUgZnJlZSB0byBib3Jyb3cgaXQuXCInKV0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdva2F5Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ09rYXksIHRoZW4uJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ21haW4nfSxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogKCkgPT4gJFNNLnNldCgndmlsbGFnZS5saXouY2FuRmluZEJvb2snLCB0cnVlKVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHJcblx0XHRcdFx0J21haW4nOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXygnTGl6IHNlZW1zIGRldGVybWluZWQgbm90IHRvIHBheSBhdHRlbnRpb24gdG8geW91LicpXSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2Fza0Fib3V0VG93bic6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgYWJvdXQgQ2hhZHRvcGlhJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2NoYWR0b3BpYVJhbWJsZSd9LFxyXG5cdFx0XHRcdFx0XHRcdGF2YWlsYWJsZTogKCkgPT4gISRTTS5nZXQoJ3ZpbGxhZ2UubGl6LmNhbkZpbmRCb29rJylcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J3F1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBmb3IgYSBxdWVzdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdxdWVzdFJlcXVlc3QnfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnZmluZEJvb2snOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnVHJ5IHRvIGZpbmQgdGhlIGJvb2snKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnZmluZEJvb2snfSxcclxuXHRcdFx0XHRcdFx0XHQvLyBUT0RPOiBhIFwidmlzaWJsZVwiIGZsYWcgd291bGQgYmUgZ29vZCBoZXJlLCBmb3Igc2l0dWF0aW9ucyB3aGVyZSBhbiBvcHRpb25cclxuXHRcdFx0XHRcdFx0XHQvLyAgIGlzbid0IHlldCBrbm93biB0byB0aGUgcGxheWVyXHJcblx0XHRcdFx0XHRcdFx0dmlzaWJsZTogKCkgPT4gJFNNLmdldCgndmlsbGFnZS5saXouY2FuRmluZEJvb2snKSxcclxuXHRcdFx0XHRcdFx0XHRhdmFpbGFibGU6ICgpID0+ICgkU00uZ2V0KCd2aWxsYWdlLmxpei5jYW5GaW5kQm9vaycpIGFzIG51bWJlciA+IDApICYmICgkU00uZ2V0KCd2aWxsYWdlLmxpei5oYXNCb29rJykpXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdsZWF2ZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdMZWF2ZScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J2ZpbmRCb29rJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdMZWF2aW5nIExpeiB0byBoZXIgYnVzaW5lc3MsIHlvdSB3YW5kZXIgYXJvdW5kIGFtaWRzdCB0aGUgYm9va3MsIHdvbmRlcmluZyBob3cgeW91XFwnbGwgZXZlciBtYW5hZ2UgdG8gZmluZCB3aGF0IHlvdVxcJ3JlIGxvb2tpbmcgZm9yIGluIGFsbCB0aGlzIHVub3JnYW5pemVkIG1lc3MuJyksXHJcblx0XHRcdFx0XHRcdF8oJ0ZvcnR1bmF0ZWx5LCB0aGUgY3JlYXRvciBvZiB0aGlzIGdhbWUgZG9lc25cXCd0IGZlZWwgbGlrZSBpdFxcJ2QgYmUgdmVyeSBpbnRlcmVzdGluZyB0byBtYWtlIHRoaXMgaW50byBhIHB1enpsZSwgc28geW91IHNwb3QgdGhlIGJvb2sgb24gYSBuZWFyYnkgc2hlbGYgYW5kIGdyYWIgaXQuJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdzaWNrJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ09oLCBzaWNrJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gJFNNLnNldCgnc3RvcmVzLldlaXJkIEJvb2snLCAxKTtcclxuXHRcdFx0XHRcdFx0XHRcdENoYXJhY3Rlci5hZGRUb0ludmVudG9yeShcIkxpei53ZWlyZEJvb2tcIik7XHJcblx0XHRcdFx0XHRcdFx0XHQkU00uc2V0KCd2aWxsYWdlLmxpei5oYXNCb29rJywgMCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQncXVlc3RSZXF1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdMaXogbGV0cyBvdXQgYW4gYW5ub3llZCBzaWdoLicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIk9oIGJyYXZlIGFkdmVudHVyZXIsIEkgc2VlbSB0byBoYXZlIGxvc3QgbXkgcGF0aWVuY2UuIFdoZW4gbGFzdCBJIHNhdyBpdCwgaXQgd2FzIHNvbWV3aGVyZSBvdXRzaWRlIG9mIHRoaXMgYnVpbGRpbmcuIFdvdWxkc3QgdGhvdSByZWNvdmVyIHRoYXQgd2hpY2ggaGFzIGJlZW4gc3RvbGVuIGZyb20gbWU/XCInKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J29rYXknOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnT2theSwgamVleiwgSSBnZXQgaXQnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnbWFpbid9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxufSIsImltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IExpeiB9IGZyb20gXCIuL2xpelwiO1xyXG5pbXBvcnQgeyBSb2FkIH0gZnJvbSBcIi4uL3BsYWNlcy9yb2FkXCI7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuLi9wbGF5ZXIvY2hhcmFjdGVyXCI7XHJcblxyXG5leHBvcnQgY29uc3QgTWF5b3IgPSB7XHJcbiAgICB0YWxrVG9NYXlvcjogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdNZWV0IHRoZSBNYXlvcicpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0c2VlbkZsYWc6ICgpID0+ICRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZU1ldCcpLFxyXG5cdFx0XHRcdFx0bmV4dFNjZW5lOiAnbWFpbicsXHJcblx0XHRcdFx0XHRvbkxvYWQ6ICgpID0+ICRTTS5zZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZU1ldCcsIDEpLFxyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdUaGUgbWF5b3Igc21pbGVzIGF0IHlvdSBhbmQgc2F5czonKSxcclxuXHRcdFx0XHRcdFx0XygnXCJXZWxjb21lIHRvIENoYWR0b3BpYSwgSVxcJ20gdGhlIG1heW9yIG9mIHRoZXNlIGhlcmUgcGFydHMuIFdoYXQgY2FuIEkgZG8geW91IGZvcj9cIicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnYXNrQWJvdXRUb3duJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBhYm91dCBDaGFkdG9waWEnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnY2hhZHRvcGlhUmFtYmxlJ31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J3F1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBmb3IgYSBxdWVzdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdxdWVzdCd9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdsZWF2ZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdMZWF2ZScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J2NoYWR0b3BpYVJhbWJsZSc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnVGhlIG1heW9yIHB1c2hlcyB0aGUgYnJpbSBvZiBoaXMgaGF0IHVwLicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIldlbGwsIHdlXFwndmUgYWx3YXlzIGJlZW4gaGVyZSwgbG9uZyBhcyBJIGNhbiByZW1lbWJlci4gSSB0b29rIG92ZXIgYWZ0ZXIgdGhlIGxhc3QgbWF5b3IgZGllZCwgYnV0IGhlIHdvdWxkIGhhdmUgYmVlbiB0aGUgb25seSBwZXJzb24gd2l0aCBhbnkgaGlzdG9yaWNhbCBrbm93bGVkZ2Ugb2YgdGhpcyB2aWxsYWdlLlwiJyksXHJcblx0XHRcdFx0XHRcdF8oJ0hlIHBhdXNlcyBmb3IgYSBtb21lbnQgYW5kIHRvdXNsZXMgc29tZSBvZiB0aGUgd2lzcHkgaGFpcnMgdGhhdCBoYXZlIHBva2VkIG91dCBmcm9tIHVuZGVyIHRoZSByYWlzZWQgaGF0LicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIkFjdHVhbGx5LCB5b3UgbWlnaHQgYXNrIExpeiwgc2hlIGhhcyBhIGJ1bmNoIG9mIGhlciBtb3RoZXJcXCdzIGJvb2tzIGZyb20gd2F5IGJhY2sgd2hlbi4gU2hlIGxpdmVzIGF0IHRoZSBlZGdlIG9mIHRvd24uXCInKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J29rYXknOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnT2theSwgdGhlbi4nKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnbWFpbid9LFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBMaXouc2V0TGl6QWN0aXZlXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdtYWluJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdUaGUgbWF5b3Igc2F5czonKSxcclxuXHRcdFx0XHRcdFx0XygnXCJBbnl3YXksIHdoYXQgRUxTRSBjYW4gSSBkbyB5b3UgZm9yP1wiJyksXHJcblx0XHRcdFx0XHRcdF8oJ0hlIGNodWNrbGVzIGF0IGhpcyBjbGV2ZXIgdXNlIG9mIGxhbmd1YWdlLicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnYXNrQWJvdXRUb3duJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBhYm91dCBDaGFkdG9waWEnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnY2hhZHRvcGlhUmFtYmxlJ30sXHJcblx0XHRcdFx0XHRcdFx0Ly8gaW1hZ2U6IFwiYXNzZXRzL2NhcmRzL2xpdHRsZV93b2xmLnBuZ1wiXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdxdWVzdCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgZm9yIGEgcXVlc3QnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAncXVlc3QnfSxcclxuXHRcdFx0XHRcdFx0XHRhdmFpbGFibGU6ICgpID0+XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBub3QgYXZhaWxhYmxlIGlmIG1heW9yU3VwcGxpZXMgaXMgaW4tcHJvZ3Jlc3NcclxuXHRcdFx0XHRcdFx0XHRcdChDaGFyYWN0ZXIucXVlc3RTdGF0dXNbXCJtYXlvclN1cHBsaWVzXCJdID09IFwidW5kZWZpbmVkXCIpXHJcblx0XHRcdFx0XHRcdFx0XHQvLyByZS1hZGQgdGhpcyBjb25kaXRpb24gbGF0ZXIsIHdlIG5lZWQgdG8gc2VuZCB0aGVtIHRvIGEgZGlmZmVyZW50XHJcblx0XHRcdFx0XHRcdFx0XHQvLyAgIHF1ZXN0IGRpYWxvZyBpZiB0aGV5IGFscmVhZHkgZGlkIHRoZSBmaXJzdCBxdWVzdFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gfHwgKENoYXJhY3Rlci5xdWVzdFN0YXR1c1tcIm1heW9yU3VwcGxpZXNcIl0gPT0gLTEpXHJcblx0XHRcdFx0XHRcdFx0Ly8gaW1hZ2U6IFwiYXNzZXRzL2NhcmRzL2pva2VyLnBuZ1wiXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdnaXZlU3VwcGxpZXMnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnSGFuZCBvdmVyIHRoZSBzdXBwbGllcycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdnaXZlU3VwcGxpZXMnfSxcclxuXHRcdFx0XHRcdFx0XHRhdmFpbGFibGU6ICgpID0+IFxyXG5cdFx0XHRcdFx0XHRcdFx0KHR5cGVvZigkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykpID09IFwidW5kZWZpbmVkXCIpIFxyXG5cdFx0XHRcdFx0XHRcdFx0JiYgKENoYXJhY3Rlci5xdWVzdFN0YXR1c1tcIm1heW9yU3VwcGxpZXNcIl0gIT09IFwidW5kZWZpbmVkXCIpXHJcblx0XHRcdFx0XHRcdFx0XHQmJiBDaGFyYWN0ZXIuaW52ZW50b3J5W1wiQ2FwdGFpbi5zdXBwbGllc1wiXSxcclxuXHRcdFx0XHRcdFx0XHR2aXNpYmxlOiAoKSA9PlxyXG5cdFx0XHRcdFx0XHRcdFx0KENoYXJhY3Rlci5xdWVzdFN0YXR1c1tcIm1heW9yU3VwcGxpZXNcIl0gIT09IFwidW5kZWZpbmVkXCIpLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiAoKSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0XHRDaGFyYWN0ZXIucmVtb3ZlRnJvbUludmVudG9yeShcIkNhcHRhaW4uc3VwcGxpZXNcIik7XHJcblx0XHRcdFx0XHRcdFx0XHQkU00uc2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJywgMSk7XHJcblx0XHRcdFx0XHRcdFx0XHRDaGFyYWN0ZXIuY2hlY2tRdWVzdFN0YXR1cyhcIm1heW9yU3VwcGxpZXNcIik7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnbGVhdmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnTGVhdmUnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdC8vIGltYWdlOiBcImFzc2V0cy9jYXJkcy9yYXZlbi5wbmdcIlxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQncXVlc3QnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1RoZSBtYXlvciB0aGlua3MgZm9yIGEgbW9tZW50LicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIllvdSBrbm93LCBpdFxcJ3MgYmVlbiBhIHdoaWxlIHNpbmNlIG91ciBsYXN0IHNoaXBtZW50IG9mIHN1cHBsaWVzIGFycml2ZWQgZnJvbSB0aGUgb3V0cG9zdC4gTWluZCBsb29raW5nIGludG8gdGhhdCBmb3IgdXM/XCInKSxcclxuXHRcdFx0XHRcdFx0XygnXCJZb3UgY2FuIGFzayBhYm91dCBpdCBhdCB0aGUgb3V0cG9zdCwgb3IganVzdCB3YW5kZXIgYXJvdW5kIG9uIHRoZSByb2FkIGFuZCBzZWUgaWYgeW91IGZpbmQgYW55IGNsdWVzLiBFaXRoZXIgd2F5LCBpdFxcJ3MgdGltZSB0byBoaXQgdGhlIHJvYWQsIGFkdmVudHVyZXIhXCInKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2FscmlnaHR5Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FscmlnaHR5JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ21haW4nfSxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogTWF5b3Iuc3RhcnRTdXBwbGllc1F1ZXN0XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdnaXZlU3VwcGxpZXMnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1RoZSBtYXlvciBzbWlsZXMsIGFuZCB0aGUgZWRnZXMgb2YgaGlzIGV5ZXMgY3JpbmtsZS4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJUaGFuayB5b3UsIGJyYXZlIGFkdmVudHVyZXIhIFdpdGggdGhlc2Ugc3VwcGxpZXMsIHRoZSB2aWxsYWdlIGNhbiBvbmNlIGFnYWluIHRocml2ZS5cIicpLFxyXG5cdFx0XHRcdFx0XHRfKCdIZSB0YWtlcyB0aGVtIGZyb20geW91IGdyYWNpb3VzbHksIGFuZCBwcm9tcHRseSBoYW5kcyB0aGVtIG9mZiB0byBzb21lIHdvcmtlcnMsIHdobyBxdWlja2x5IGVyZWN0IGEgYnVpbGRpbmcgdGhhdCBnaXZlcyB5b3UgYSBuZXcgYnV0dG9uIHRvIGNsaWNrJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdpbXByZXNzaXZlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0ltcHJlc3NpdmUhJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdHN0YXJ0U3VwcGxpZXNRdWVzdDogZnVuY3Rpb24gKCkge1xyXG5cdFx0Ly8gaWYgKCEkU00uZ2V0KCdxdWVzdC5zdXBwbGllcycpKSB7XHJcblx0XHQvLyBcdC8vIDEgPSBzdGFydGVkLCAyID0gbmV4dCBzdGVwLCBldGMuIHVudGlsIGNvbXBsZXRlZFxyXG5cdFx0Ly8gXHQkU00uc2V0KCdxdWVzdC5zdXBwbGllcycsIDEpO1xyXG5cdFx0Ly8gXHRSb2FkLmluaXQoKTtcclxuXHRcdC8vIH1cclxuXHRcdGlmICh0eXBlb2YoQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW1wibWF5b3JTdXBwbGllc1wiXSkgPT0gXCJ1bmRlZmluZWRcIikge1xyXG5cdFx0XHRDaGFyYWN0ZXIuc2V0UXVlc3RTdGF0dXMoXCJtYXlvclN1cHBsaWVzXCIsIDApO1xyXG5cdFx0XHRSb2FkLmluaXQoKTtcclxuXHRcdH1cclxuXHR9XHJcbn0iLCIvLyBAdHMtbm9jaGVja1xyXG5cclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgTm90aWZpY2F0aW9ucyB9IGZyb20gXCIuL25vdGlmaWNhdGlvbnNcIjtcclxuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4vZXZlbnRzXCI7XHJcbmltcG9ydCB7IFJvb20gfSBmcm9tIFwiLi9wbGFjZXMvcm9vbVwiO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tIFwiLi9wbGF5ZXIvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCB7IFdlYXRoZXIgfSBmcm9tIFwiLi93ZWF0aGVyXCI7XHJcbmltcG9ydCB7IFJvYWQgfSBmcm9tIFwiLi9wbGFjZXMvcm9hZFwiO1xyXG5pbXBvcnQgeyBPdXRwb3N0IH0gZnJvbSBcIi4vcGxhY2VzL291dHBvc3RcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBFbmdpbmUgPSB3aW5kb3cuRW5naW5lID0ge1xyXG5cdFxyXG5cdFNJVEVfVVJMOiBlbmNvZGVVUklDb21wb25lbnQoXCJodHRwOi8vYWRhcmtyb29tLmRvdWJsZXNwZWFrZ2FtZXMuY29tXCIpLFxyXG5cdFZFUlNJT046IDEuMyxcclxuXHRNQVhfU1RPUkU6IDk5OTk5OTk5OTk5OTk5LFxyXG5cdFNBVkVfRElTUExBWTogMzAgKiAxMDAwLFxyXG5cdEdBTUVfT1ZFUjogZmFsc2UsXHJcblx0XHJcblx0Ly9vYmplY3QgZXZlbnQgdHlwZXNcclxuXHR0b3BpY3M6IHt9LFxyXG5cdFx0XHJcblx0UGVya3M6IHtcclxuXHRcdCdib3hlcic6IHtcclxuXHRcdFx0bmFtZTogXygnYm94ZXInKSxcclxuXHRcdFx0ZGVzYzogXygncHVuY2hlcyBkbyBtb3JlIGRhbWFnZScpLFxyXG5cdFx0XHQvLy8gVFJBTlNMQVRPUlMgOiBtZWFucyB3aXRoIG1vcmUgZm9yY2UuXHJcblx0XHRcdG5vdGlmeTogXygnbGVhcm5lZCB0byB0aHJvdyBwdW5jaGVzIHdpdGggcHVycG9zZScpXHJcblx0XHR9LFxyXG5cdFx0J21hcnRpYWwgYXJ0aXN0Jzoge1xyXG5cdFx0XHRuYW1lOiBfKCdtYXJ0aWFsIGFydGlzdCcpLFxyXG5cdFx0XHRkZXNjOiBfKCdwdW5jaGVzIGRvIGV2ZW4gbW9yZSBkYW1hZ2UuJyksXHJcblx0XHRcdG5vdGlmeTogXygnbGVhcm5lZCB0byBmaWdodCBxdWl0ZSBlZmZlY3RpdmVseSB3aXRob3V0IHdlYXBvbnMnKVxyXG5cdFx0fSxcclxuXHRcdCd1bmFybWVkIG1hc3Rlcic6IHtcclxuXHRcdFx0Ly8vIFRSQU5TTEFUT1JTIDogbWFzdGVyIG9mIHVuYXJtZWQgY29tYmF0XHJcblx0XHRcdG5hbWU6IF8oJ3VuYXJtZWQgbWFzdGVyJyksXHJcblx0XHRcdGRlc2M6IF8oJ3B1bmNoIHR3aWNlIGFzIGZhc3QsIGFuZCB3aXRoIGV2ZW4gbW9yZSBmb3JjZScpLFxyXG5cdFx0XHRub3RpZnk6IF8oJ2xlYXJuZWQgdG8gc3RyaWtlIGZhc3RlciB3aXRob3V0IHdlYXBvbnMnKVxyXG5cdFx0fSxcclxuXHRcdCdiYXJiYXJpYW4nOiB7XHJcblx0XHRcdG5hbWU6IF8oJ2JhcmJhcmlhbicpLFxyXG5cdFx0XHRkZXNjOiBfKCdtZWxlZSB3ZWFwb25zIGRlYWwgbW9yZSBkYW1hZ2UnKSxcclxuXHRcdFx0bm90aWZ5OiBfKCdsZWFybmVkIHRvIHN3aW5nIHdlYXBvbnMgd2l0aCBmb3JjZScpXHJcblx0XHR9LFxyXG5cdFx0J3Nsb3cgbWV0YWJvbGlzbSc6IHtcclxuXHRcdFx0bmFtZTogXygnc2xvdyBtZXRhYm9saXNtJyksXHJcblx0XHRcdGRlc2M6IF8oJ2dvIHR3aWNlIGFzIGZhciB3aXRob3V0IGVhdGluZycpLFxyXG5cdFx0XHRub3RpZnk6IF8oJ2xlYXJuZWQgaG93IHRvIGlnbm9yZSB0aGUgaHVuZ2VyJylcclxuXHRcdH0sXHJcblx0XHQnZGVzZXJ0IHJhdCc6IHtcclxuXHRcdFx0bmFtZTogXygnZGVzZXJ0IHJhdCcpLFxyXG5cdFx0XHRkZXNjOiBfKCdnbyB0d2ljZSBhcyBmYXIgd2l0aG91dCBkcmlua2luZycpLFxyXG5cdFx0XHRub3RpZnk6IF8oJ2xlYXJuZWQgdG8gbG92ZSB0aGUgZHJ5IGFpcicpXHJcblx0XHR9LFxyXG5cdFx0J2V2YXNpdmUnOiB7XHJcblx0XHRcdG5hbWU6IF8oJ2V2YXNpdmUnKSxcclxuXHRcdFx0ZGVzYzogXygnZG9kZ2UgYXR0YWNrcyBtb3JlIGVmZmVjdGl2ZWx5JyksXHJcblx0XHRcdG5vdGlmeTogXyhcImxlYXJuZWQgdG8gYmUgd2hlcmUgdGhleSdyZSBub3RcIilcclxuXHRcdH0sXHJcblx0XHQncHJlY2lzZSc6IHtcclxuXHRcdFx0bmFtZTogXygncHJlY2lzZScpLFxyXG5cdFx0XHRkZXNjOiBfKCdsYW5kIGJsb3dzIG1vcmUgb2Z0ZW4nKSxcclxuXHRcdFx0bm90aWZ5OiBfKCdsZWFybmVkIHRvIHByZWRpY3QgdGhlaXIgbW92ZW1lbnQnKVxyXG5cdFx0fSxcclxuXHRcdCdzY291dCc6IHtcclxuXHRcdFx0bmFtZTogXygnc2NvdXQnKSxcclxuXHRcdFx0ZGVzYzogXygnc2VlIGZhcnRoZXInKSxcclxuXHRcdFx0bm90aWZ5OiBfKCdsZWFybmVkIHRvIGxvb2sgYWhlYWQnKVxyXG5cdFx0fSxcclxuXHRcdCdzdGVhbHRoeSc6IHtcclxuXHRcdFx0bmFtZTogXygnc3RlYWx0aHknKSxcclxuXHRcdFx0ZGVzYzogXygnYmV0dGVyIGF2b2lkIGNvbmZsaWN0IGluIHRoZSB3aWxkJyksXHJcblx0XHRcdG5vdGlmeTogXygnbGVhcm5lZCBob3cgbm90IHRvIGJlIHNlZW4nKVxyXG5cdFx0fSxcclxuXHRcdCdnYXN0cm9ub21lJzoge1xyXG5cdFx0XHRuYW1lOiBfKCdnYXN0cm9ub21lJyksXHJcblx0XHRcdGRlc2M6IF8oJ3Jlc3RvcmUgbW9yZSBoZWFsdGggd2hlbiBlYXRpbmcnKSxcclxuXHRcdFx0bm90aWZ5OiBfKCdsZWFybmVkIHRvIG1ha2UgdGhlIG1vc3Qgb2YgZm9vZCcpXHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRvcHRpb25zOiB7XHJcblx0XHRzdGF0ZTogbnVsbCxcclxuXHRcdGRlYnVnOiB0cnVlLFxyXG5cdFx0bG9nOiB0cnVlLFxyXG5cdFx0ZHJvcGJveDogZmFsc2UsXHJcblx0XHRkb3VibGVUaW1lOiBmYWxzZVxyXG5cdH0sXHJcblxyXG5cdF9kZWJ1ZzogZmFsc2UsXHJcblx0XHRcclxuXHRpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHRcdHRoaXMuX2RlYnVnID0gdGhpcy5vcHRpb25zLmRlYnVnO1xyXG5cdFx0dGhpcy5fbG9nID0gdGhpcy5vcHRpb25zLmxvZztcclxuXHRcdFxyXG5cdFx0Ly8gQ2hlY2sgZm9yIEhUTUw1IHN1cHBvcnRcclxuXHRcdGlmKCFFbmdpbmUuYnJvd3NlclZhbGlkKCkpIHtcclxuXHRcdFx0d2luZG93LmxvY2F0aW9uID0gJ2Jyb3dzZXJXYXJuaW5nLmh0bWwnO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBDaGVjayBmb3IgbW9iaWxlXHJcblx0XHRpZihFbmdpbmUuaXNNb2JpbGUoKSkge1xyXG5cdFx0XHR3aW5kb3cubG9jYXRpb24gPSAnbW9iaWxlV2FybmluZy5odG1sJztcclxuXHRcdH1cclxuXHJcblx0XHRFbmdpbmUuZGlzYWJsZVNlbGVjdGlvbigpO1xyXG5cdFx0XHJcblx0XHRpZih0aGlzLm9wdGlvbnMuc3RhdGUgIT0gbnVsbCkge1xyXG5cdFx0XHR3aW5kb3cuU3RhdGUgPSB0aGlzLm9wdGlvbnMuc3RhdGU7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRFbmdpbmUubG9hZEdhbWUoKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdsb2NhdGlvblNsaWRlcicpLmFwcGVuZFRvKCcjbWFpbicpO1xyXG5cclxuXHRcdHZhciBtZW51ID0gJCgnPGRpdj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21lbnUnKVxyXG5cdFx0XHQuYXBwZW5kVG8oJ2JvZHknKTtcclxuXHJcblx0XHRpZih0eXBlb2YgbGFuZ3MgIT0gJ3VuZGVmaW5lZCcpe1xyXG5cdFx0XHR2YXIgY3VzdG9tU2VsZWN0ID0gJCgnPHNwYW4+JylcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ2N1c3RvbVNlbGVjdCcpXHJcblx0XHRcdFx0LmFkZENsYXNzKCdtZW51QnRuJylcclxuXHRcdFx0XHQuYXBwZW5kVG8obWVudSk7XHJcblx0XHRcdHZhciBzZWxlY3RPcHRpb25zID0gJCgnPHNwYW4+JylcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ2N1c3RvbVNlbGVjdE9wdGlvbnMnKVxyXG5cdFx0XHRcdC5hcHBlbmRUbyhjdXN0b21TZWxlY3QpO1xyXG5cdFx0XHR2YXIgb3B0aW9uc0xpc3QgPSAkKCc8dWw+JylcclxuXHRcdFx0XHQuYXBwZW5kVG8oc2VsZWN0T3B0aW9ucyk7XHJcblx0XHRcdCQoJzxsaT4nKVxyXG5cdFx0XHRcdC50ZXh0KFwibGFuZ3VhZ2UuXCIpXHJcblx0XHRcdFx0LmFwcGVuZFRvKG9wdGlvbnNMaXN0KTtcclxuXHRcdFx0XHJcblx0XHRcdCQuZWFjaChsYW5ncywgZnVuY3Rpb24obmFtZSxkaXNwbGF5KXtcclxuXHRcdFx0XHQkKCc8bGk+JylcclxuXHRcdFx0XHRcdC50ZXh0KGRpc3BsYXkpXHJcblx0XHRcdFx0XHQuYXR0cignZGF0YS1sYW5ndWFnZScsIG5hbWUpXHJcblx0XHRcdFx0XHQub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHsgRW5naW5lLnN3aXRjaExhbmd1YWdlKHRoaXMpOyB9KVxyXG5cdFx0XHRcdFx0LmFwcGVuZFRvKG9wdGlvbnNMaXN0KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0JCgnPHNwYW4+JylcclxuXHRcdFx0LmFkZENsYXNzKCdsaWdodHNPZmYgbWVudUJ0bicpXHJcblx0XHRcdC50ZXh0KF8oJ2xpZ2h0cyBvZmYuJykpXHJcblx0XHRcdC5jbGljayhFbmdpbmUudHVybkxpZ2h0c09mZilcclxuXHRcdFx0LmFwcGVuZFRvKG1lbnUpO1xyXG5cclxuXHRcdCQoJzxzcGFuPicpXHJcblx0XHRcdC5hZGRDbGFzcygnbWVudUJ0bicpXHJcblx0XHRcdC50ZXh0KF8oJ2h5cGVyLicpKVxyXG5cdFx0XHQuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRFbmdpbmUub3B0aW9ucy5kb3VibGVUaW1lID0gIUVuZ2luZS5vcHRpb25zLmRvdWJsZVRpbWU7XHJcblx0XHRcdFx0aWYoRW5naW5lLm9wdGlvbnMuZG91YmxlVGltZSlcclxuXHRcdFx0XHRcdCQodGhpcykudGV4dChfKCdjbGFzc2ljLicpKTtcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHQkKHRoaXMpLnRleHQoXygnaHlwZXIuJykpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQuYXBwZW5kVG8obWVudSk7XHJcblxyXG5cdFx0JCgnPHNwYW4+JylcclxuXHRcdFx0LmFkZENsYXNzKCdtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygncmVzdGFydC4nKSlcclxuXHRcdFx0LmNsaWNrKEVuZ2luZS5jb25maXJtRGVsZXRlKVxyXG5cdFx0XHQuYXBwZW5kVG8obWVudSk7XHJcblx0XHRcclxuXHRcdCQoJzxzcGFuPicpXHJcblx0XHRcdC5hZGRDbGFzcygnbWVudUJ0bicpXHJcblx0XHRcdC50ZXh0KF8oJ3NoYXJlLicpKVxyXG5cdFx0XHQuY2xpY2soRW5naW5lLnNoYXJlKVxyXG5cdFx0XHQuYXBwZW5kVG8obWVudSk7XHJcblxyXG5cdFx0JCgnPHNwYW4+JylcclxuXHRcdFx0LmFkZENsYXNzKCdtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygnc2F2ZS4nKSlcclxuXHRcdFx0LmNsaWNrKEVuZ2luZS5leHBvcnRJbXBvcnQpXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHRcdFxyXG5cdFx0JCgnPHNwYW4+JylcclxuXHRcdFx0LmFkZENsYXNzKCdtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygnYXBwIHN0b3JlLicpKVxyXG5cdFx0XHQuY2xpY2soZnVuY3Rpb24oKSB7IHdpbmRvdy5vcGVuKCdodHRwczovL2l0dW5lcy5hcHBsZS5jb20vdXMvYXBwL2EtZGFyay1yb29tL2lkNzM2NjgzMDYxJyk7IH0pXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHQudGV4dChfKCdnaXRodWIuJykpXHJcblx0XHRcdC5jbGljayhmdW5jdGlvbigpIHsgd2luZG93Lm9wZW4oJ2h0dHBzOi8vZ2l0aHViLmNvbS9Db250aW51aXRpZXMvYWRhcmtyb29tJyk7IH0pXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHRcclxuXHRcdC8vIHN1YnNjcmliZSB0byBzdGF0ZVVwZGF0ZXNcclxuXHRcdCQuRGlzcGF0Y2goJ3N0YXRlVXBkYXRlJykuc3Vic2NyaWJlKEVuZ2luZS5oYW5kbGVTdGF0ZVVwZGF0ZXMpO1xyXG5cclxuXHRcdCRTTS5pbml0KCk7XHJcblx0XHROb3RpZmljYXRpb25zLmluaXQoKTtcclxuXHRcdEV2ZW50cy5pbml0KCk7XHJcblx0XHRSb29tLmluaXQoKTtcclxuXHRcdENoYXJhY3Rlci5pbml0KCk7XHJcblx0XHRXZWF0aGVyLmluaXQoKTtcclxuXHRcdGlmKCRTTS5nZXQoJ3JvYWQub3BlbicpKSB7XHJcblx0XHRcdFJvYWQuaW5pdCgpO1xyXG5cdFx0fVxyXG5cdFx0aWYoJFNNLmdldCgnb3V0cG9zdC5vcGVuJykpIHtcclxuXHRcdFx0T3V0cG9zdC5pbml0KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0RW5naW5lLnNhdmVMYW5ndWFnZSgpO1xyXG5cdFx0RW5naW5lLnRyYXZlbFRvKFJvb20pO1xyXG5cclxuXHR9LFxyXG5cdFxyXG5cdGJyb3dzZXJWYWxpZDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKCBsb2NhdGlvbi5zZWFyY2guaW5kZXhPZiggJ2lnbm9yZWJyb3dzZXI9dHJ1ZScgKSA+PSAwIHx8ICggdHlwZW9mIFN0b3JhZ2UgIT0gJ3VuZGVmaW5lZCcgJiYgIW9sZElFICkgKTtcclxuXHR9LFxyXG5cdFxyXG5cdGlzTW9iaWxlOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAoIGxvY2F0aW9uLnNlYXJjaC5pbmRleE9mKCAnaWdub3JlYnJvd3Nlcj10cnVlJyApIDwgMCAmJiAvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnkvaS50ZXN0KCBuYXZpZ2F0b3IudXNlckFnZW50ICkgKTtcclxuXHR9LFxyXG5cdFxyXG5cdHNhdmVHYW1lOiBmdW5jdGlvbigpIHtcclxuXHRcdGlmKHR5cGVvZiBTdG9yYWdlICE9ICd1bmRlZmluZWQnICYmIGxvY2FsU3RvcmFnZSkge1xyXG5cdFx0XHRpZihFbmdpbmUuX3NhdmVUaW1lciAhPSBudWxsKSB7XHJcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KEVuZ2luZS5fc2F2ZVRpbWVyKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih0eXBlb2YgRW5naW5lLl9sYXN0Tm90aWZ5ID09ICd1bmRlZmluZWQnIHx8IERhdGUubm93KCkgLSBFbmdpbmUuX2xhc3ROb3RpZnkgPiBFbmdpbmUuU0FWRV9ESVNQTEFZKXtcclxuXHRcdFx0XHQkKCcjc2F2ZU5vdGlmeScpLmNzcygnb3BhY2l0eScsIDEpLmFuaW1hdGUoe29wYWNpdHk6IDB9LCAxMDAwLCAnbGluZWFyJyk7XHJcblx0XHRcdFx0RW5naW5lLl9sYXN0Tm90aWZ5ID0gRGF0ZS5ub3coKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRsb2NhbFN0b3JhZ2UuZ2FtZVN0YXRlID0gSlNPTi5zdHJpbmdpZnkoU3RhdGUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0bG9hZEdhbWU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dmFyIHNhdmVkU3RhdGUgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nYW1lU3RhdGUpO1xyXG5cdFx0XHRpZihzYXZlZFN0YXRlKSB7XHJcblx0XHRcdFx0d2luZG93LlN0YXRlID0gc2F2ZWRTdGF0ZTtcclxuXHRcdFx0XHRFbmdpbmUubG9nKFwibG9hZGVkIHNhdmUhXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGNhdGNoKGUpIHtcclxuXHRcdFx0RW5naW5lLmxvZyhlKTtcclxuXHRcdFx0d2luZG93LlN0YXRlID0ge307XHJcblx0XHRcdCRTTS5zZXQoJ3ZlcnNpb24nLCBFbmdpbmUuVkVSU0lPTik7XHJcblx0XHRcdEVuZ2luZS5ldmVudCgncHJvZ3Jlc3MnLCAnbmV3IGdhbWUnKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGV4cG9ydEltcG9ydDogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdFeHBvcnQgLyBJbXBvcnQnKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnZXhwb3J0IG9yIGltcG9ydCBzYXZlIGRhdGEsIGZvciBiYWNraW5nIHVwJyksXHJcblx0XHRcdFx0XHRcdF8oJ29yIG1pZ3JhdGluZyBjb21wdXRlcnMnKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2V4cG9ydCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdleHBvcnQnKSxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogRW5naW5lLmV4cG9ydDY0XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdpbXBvcnQnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnaW1wb3J0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2NvbmZpcm0nfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnY2FuY2VsJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2NhbmNlbCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J2NvbmZpcm0nOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ2FyZSB5b3Ugc3VyZT8nKSxcclxuXHRcdFx0XHRcdFx0XygnaWYgdGhlIGNvZGUgaXMgaW52YWxpZCwgYWxsIGRhdGEgd2lsbCBiZSBsb3N0LicpLFxyXG5cdFx0XHRcdFx0XHRfKCd0aGlzIGlzIGlycmV2ZXJzaWJsZS4nKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J3llcyc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCd5ZXMnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnaW5wdXRJbXBvcnQnfSxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogRW5naW5lLmVuYWJsZVNlbGVjdGlvblxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnbm8nOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnbm8nKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdpbnB1dEltcG9ydCc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtfKCdwdXQgdGhlIHNhdmUgY29kZSBoZXJlLicpXSxcclxuXHRcdFx0XHRcdHRleHRhcmVhOiAnJyxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J29rYXknOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnaW1wb3J0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogRW5naW5lLmltcG9ydDY0XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdjYW5jZWwnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnY2FuY2VsJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRnZW5lcmF0ZUV4cG9ydDY0OiBmdW5jdGlvbigpe1xyXG5cdFx0dmFyIHN0cmluZzY0ID0gQmFzZTY0LmVuY29kZShsb2NhbFN0b3JhZ2UuZ2FtZVN0YXRlKTtcclxuXHRcdHN0cmluZzY0ID0gc3RyaW5nNjQucmVwbGFjZSgvXFxzL2csICcnKTtcclxuXHRcdHN0cmluZzY0ID0gc3RyaW5nNjQucmVwbGFjZSgvXFwuL2csICcnKTtcclxuXHRcdHN0cmluZzY0ID0gc3RyaW5nNjQucmVwbGFjZSgvXFxuL2csICcnKTtcclxuXHJcblx0XHRyZXR1cm4gc3RyaW5nNjQ7XHJcblx0fSxcclxuXHJcblx0ZXhwb3J0NjQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RW5naW5lLnNhdmVHYW1lKCk7XHJcblx0XHR2YXIgc3RyaW5nNjQgPSBFbmdpbmUuZ2VuZXJhdGVFeHBvcnQ2NCgpO1xyXG5cdFx0RW5naW5lLmVuYWJsZVNlbGVjdGlvbigpO1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnRXhwb3J0JyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXygnc2F2ZSB0aGlzLicpXSxcclxuXHRcdFx0XHRcdHRleHRhcmVhOiBzdHJpbmc2NCxcclxuXHRcdFx0XHRcdHJlYWRvbmx5OiB0cnVlLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnZG9uZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdnb3QgaXQnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBFbmdpbmUuZGlzYWJsZVNlbGVjdGlvblxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdEVuZ2luZS5hdXRvU2VsZWN0KCcjZGVzY3JpcHRpb24gdGV4dGFyZWEnKTtcclxuXHR9LFxyXG5cclxuXHRpbXBvcnQ2NDogZnVuY3Rpb24oc3RyaW5nNjQpIHtcclxuXHRcdEVuZ2luZS5kaXNhYmxlU2VsZWN0aW9uKCk7XHJcblx0XHRzdHJpbmc2NCA9IHN0cmluZzY0LnJlcGxhY2UoL1xccy9nLCAnJyk7XHJcblx0XHRzdHJpbmc2NCA9IHN0cmluZzY0LnJlcGxhY2UoL1xcLi9nLCAnJyk7XHJcblx0XHRzdHJpbmc2NCA9IHN0cmluZzY0LnJlcGxhY2UoL1xcbi9nLCAnJyk7XHJcblx0XHR2YXIgZGVjb2RlZFNhdmUgPSBCYXNlNjQuZGVjb2RlKHN0cmluZzY0KTtcclxuXHRcdGxvY2FsU3RvcmFnZS5nYW1lU3RhdGUgPSBkZWNvZGVkU2F2ZTtcclxuXHRcdGxvY2F0aW9uLnJlbG9hZCgpO1xyXG5cdH0sXHJcblxyXG5cdGV2ZW50OiBmdW5jdGlvbihjYXQsIGFjdCkge1xyXG5cdFx0aWYodHlwZW9mIGdhID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdGdhKCdzZW5kJywgJ2V2ZW50JywgY2F0LCBhY3QpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdGNvbmZpcm1EZWxldGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnUmVzdGFydD8nKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtfKCdyZXN0YXJ0IHRoZSBnYW1lPycpXSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J3llcyc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCd5ZXMnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBFbmdpbmUuZGVsZXRlU2F2ZVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnbm8nOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnbm8nKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGRlbGV0ZVNhdmU6IGZ1bmN0aW9uKG5vUmVsb2FkKSB7XHJcblx0XHRpZih0eXBlb2YgU3RvcmFnZSAhPSAndW5kZWZpbmVkJyAmJiBsb2NhbFN0b3JhZ2UpIHtcclxuXHRcdFx0d2luZG93LlN0YXRlID0ge307XHJcblx0XHRcdGxvY2FsU3RvcmFnZS5jbGVhcigpO1xyXG5cdFx0fVxyXG5cdFx0aWYoIW5vUmVsb2FkKSB7XHJcblx0XHRcdGxvY2F0aW9uLnJlbG9hZCgpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHNoYXJlOiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ1NoYXJlJyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXygnYnJpbmcgeW91ciBmcmllbmRzLicpXSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2ZhY2Vib29rJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2ZhY2Vib29rJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR3aW5kb3cub3BlbignaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL3NoYXJlci9zaGFyZXIucGhwP3U9JyArIEVuZ2luZS5TSVRFX1VSTCwgJ3NoYXJlcicsICd3aWR0aD02MjYsaGVpZ2h0PTQzNixsb2NhdGlvbj1ubyxtZW51YmFyPW5vLHJlc2l6YWJsZT1ubyxzY3JvbGxiYXJzPW5vLHN0YXR1cz1ubyx0b29sYmFyPW5vJyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnZ29vZ2xlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6XygnZ29vZ2xlKycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0d2luZG93Lm9wZW4oJ2h0dHBzOi8vcGx1cy5nb29nbGUuY29tL3NoYXJlP3VybD0nICsgRW5naW5lLlNJVEVfVVJMLCAnc2hhcmVyJywgJ3dpZHRoPTQ4MCxoZWlnaHQ9NDM2LGxvY2F0aW9uPW5vLG1lbnViYXI9bm8scmVzaXphYmxlPW5vLHNjcm9sbGJhcnM9bm8sc3RhdHVzPW5vLHRvb2xiYXI9bm8nKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCd0d2l0dGVyJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ3R3aXR0ZXInKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5vcGVuKCdodHRwczovL3R3aXR0ZXIuY29tL2ludGVudC90d2VldD90ZXh0PUElMjBEYXJrJTIwUm9vbSZ1cmw9JyArIEVuZ2luZS5TSVRFX1VSTCwgJ3NoYXJlcicsICd3aWR0aD02NjAsaGVpZ2h0PTI2MCxsb2NhdGlvbj1ubyxtZW51YmFyPW5vLHJlc2l6YWJsZT1ubyxzY3JvbGxiYXJzPXllcyxzdGF0dXM9bm8sdG9vbGJhcj1ubycpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J3JlZGRpdCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdyZWRkaXQnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5vcGVuKCdodHRwOi8vd3d3LnJlZGRpdC5jb20vc3VibWl0P3VybD0nICsgRW5naW5lLlNJVEVfVVJMLCAnc2hhcmVyJywgJ3dpZHRoPTk2MCxoZWlnaHQ9NzAwLGxvY2F0aW9uPW5vLG1lbnViYXI9bm8scmVzaXphYmxlPW5vLHNjcm9sbGJhcnM9eWVzLHN0YXR1cz1ubyx0b29sYmFyPW5vJyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnY2xvc2UnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnY2xvc2UnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdHdpZHRoOiAnNDAwcHgnXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRmaW5kU3R5bGVzaGVldDogZnVuY3Rpb24odGl0bGUpIHtcclxuXHRcdGZvcih2YXIgaT0wOyBpPGRvY3VtZW50LnN0eWxlU2hlZXRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBzaGVldCA9IGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldO1xyXG5cdFx0XHRpZihzaGVldC50aXRsZSA9PSB0aXRsZSkge1xyXG5cdFx0XHRcdHJldHVybiBzaGVldDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fSxcclxuXHJcblx0aXNMaWdodHNPZmY6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGRhcmtDc3MgPSBFbmdpbmUuZmluZFN0eWxlc2hlZXQoJ2RhcmtlbkxpZ2h0cycpO1xyXG5cdFx0aWYgKCBkYXJrQ3NzICE9IG51bGwgJiYgIWRhcmtDc3MuZGlzYWJsZWQgKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0sXHJcblxyXG5cdHR1cm5MaWdodHNPZmY6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGRhcmtDc3MgPSBFbmdpbmUuZmluZFN0eWxlc2hlZXQoJ2RhcmtlbkxpZ2h0cycpO1xyXG5cdFx0aWYgKGRhcmtDc3MgPT0gbnVsbCkge1xyXG5cdFx0XHQkKCdoZWFkJykuYXBwZW5kKCc8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cImNzcy9kYXJrLmNzc1wiIHR5cGU9XCJ0ZXh0L2Nzc1wiIHRpdGxlPVwiZGFya2VuTGlnaHRzXCIgLz4nKTtcclxuXHRcdFx0JCgnLmxpZ2h0c09mZicpLnRleHQoXygnbGlnaHRzIG9uLicpKTtcclxuXHRcdH0gZWxzZSBpZiAoZGFya0Nzcy5kaXNhYmxlZCkge1xyXG5cdFx0XHRkYXJrQ3NzLmRpc2FibGVkID0gZmFsc2U7XHJcblx0XHRcdCQoJy5saWdodHNPZmYnKS50ZXh0KF8oJ2xpZ2h0cyBvbi4nKSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKFwiI2RhcmtlbkxpZ2h0c1wiKS5hdHRyKFwiZGlzYWJsZWRcIiwgXCJkaXNhYmxlZFwiKTtcclxuXHRcdFx0ZGFya0Nzcy5kaXNhYmxlZCA9IHRydWU7XHJcblx0XHRcdCQoJy5saWdodHNPZmYnKS50ZXh0KF8oJ2xpZ2h0cyBvZmYuJykpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8vIEdldHMgYSBndWlkXHJcblx0Z2V0R3VpZDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbihjKSB7XHJcblx0XHRcdHZhciByID0gTWF0aC5yYW5kb20oKSoxNnwwLCB2ID0gYyA9PSAneCcgPyByIDogKHImMHgzfDB4OCk7XHJcblx0XHRcdHJldHVybiB2LnRvU3RyaW5nKDE2KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGFjdGl2ZU1vZHVsZTogbnVsbCxcclxuXHJcblx0dHJhdmVsVG86IGZ1bmN0aW9uKG1vZHVsZSkge1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZSAhPSBtb2R1bGUpIHtcclxuXHRcdFx0dmFyIGN1cnJlbnRJbmRleCA9IEVuZ2luZS5hY3RpdmVNb2R1bGUgPyAkKCcubG9jYXRpb24nKS5pbmRleChFbmdpbmUuYWN0aXZlTW9kdWxlLnBhbmVsKSA6IDE7XHJcblx0XHRcdCQoJ2Rpdi5oZWFkZXJCdXR0b24nKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcclxuXHRcdFx0bW9kdWxlLnRhYi5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcclxuXHJcblx0XHRcdHZhciBzbGlkZXIgPSAkKCcjbG9jYXRpb25TbGlkZXInKTtcclxuXHRcdFx0dmFyIHN0b3JlcyA9ICQoJyNzdG9yZXNDb250YWluZXInKTtcclxuXHRcdFx0dmFyIHBhbmVsSW5kZXggPSAkKCcubG9jYXRpb24nKS5pbmRleChtb2R1bGUucGFuZWwpO1xyXG5cdFx0XHR2YXIgZGlmZiA9IE1hdGguYWJzKHBhbmVsSW5kZXggLSBjdXJyZW50SW5kZXgpO1xyXG5cdFx0XHRzbGlkZXIuYW5pbWF0ZSh7bGVmdDogLShwYW5lbEluZGV4ICogNzAwKSArICdweCd9LCAzMDAgKiBkaWZmKTtcclxuXHJcblx0XHRcdGlmKCRTTS5nZXQoJ3N0b3Jlcy53b29kJykgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHQvLyBGSVhNRSBXaHkgZG9lcyB0aGlzIHdvcmsgaWYgdGhlcmUncyBhbiBhbmltYXRpb24gcXVldWUuLi4/XHJcblx0XHRcdFx0c3RvcmVzLmFuaW1hdGUoe3JpZ2h0OiAtKHBhbmVsSW5kZXggKiA3MDApICsgJ3B4J30sIDMwMCAqIGRpZmYpO1xyXG5cdFx0XHR9XHJcblx0XHRcclxuXHRcdFx0RW5naW5lLmFjdGl2ZU1vZHVsZSA9IG1vZHVsZTtcclxuXHJcblx0XHRcdG1vZHVsZS5vbkFycml2YWwoZGlmZik7XHJcblxyXG5cdFx0XHRpZihFbmdpbmUuYWN0aXZlTW9kdWxlID09IFJvb21cclxuXHRcdFx0XHQvLyAgfHwgRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSBQYXRoXHJcblx0XHRcdFx0KSB7XHJcblx0XHRcdFx0Ly8gRG9uJ3QgZmFkZSBvdXQgdGhlIHdlYXBvbnMgaWYgd2UncmUgc3dpdGNoaW5nIHRvIGEgbW9kdWxlXHJcblx0XHRcdFx0Ly8gd2hlcmUgd2UncmUgZ29pbmcgdG8ga2VlcCBzaG93aW5nIHRoZW0gYW55d2F5LlxyXG5cdFx0XHRcdGlmIChtb2R1bGUgIT0gUm9vbSBcclxuXHRcdFx0XHRcdC8vICYmIG1vZHVsZSAhPSBQYXRoXHJcblx0XHRcdFx0KSB7XHJcblx0XHRcdFx0XHQkKCdkaXYjd2VhcG9ucycpLmFuaW1hdGUoe29wYWNpdHk6IDB9LCAzMDApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYobW9kdWxlID09IFJvb21cclxuXHRcdFx0XHQvLyAgfHwgbW9kdWxlID09IFBhdGhcclxuXHRcdFx0XHQpIHtcclxuXHRcdFx0XHQkKCdkaXYjd2VhcG9ucycpLmFuaW1hdGUoe29wYWNpdHk6IDF9LCAzMDApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHROb3RpZmljYXRpb25zLnByaW50UXVldWUobW9kdWxlKTtcclxuXHRcdFxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8qIE1vdmUgdGhlIHN0b3JlcyBwYW5lbCBiZW5lYXRoIHRvcF9jb250YWluZXIgKG9yIHRvIHRvcDogMHB4IGlmIHRvcF9jb250YWluZXJcclxuXHRcdCogZWl0aGVyIGhhc24ndCBiZWVuIGZpbGxlZCBpbiBvciBpcyBudWxsKSB1c2luZyB0cmFuc2l0aW9uX2RpZmYgdG8gc3luYyB3aXRoXHJcblx0XHQqIHRoZSBhbmltYXRpb24gaW4gRW5naW5lLnRyYXZlbFRvKCkuXHJcblx0XHQqL1xyXG5cdG1vdmVTdG9yZXNWaWV3OiBmdW5jdGlvbih0b3BfY29udGFpbmVyLCB0cmFuc2l0aW9uX2RpZmYpIHtcclxuXHRcdHZhciBzdG9yZXMgPSAkKCcjc3RvcmVzQ29udGFpbmVyJyk7XHJcblxyXG5cdFx0Ly8gSWYgd2UgZG9uJ3QgaGF2ZSBhIHN0b3Jlc0NvbnRhaW5lciB5ZXQsIGxlYXZlLlxyXG5cdFx0aWYodHlwZW9mKHN0b3JlcykgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XHJcblxyXG5cdFx0aWYodHlwZW9mKHRyYW5zaXRpb25fZGlmZikgPT09ICd1bmRlZmluZWQnKSB0cmFuc2l0aW9uX2RpZmYgPSAxO1xyXG5cclxuXHRcdGlmKHRvcF9jb250YWluZXIgPT09IG51bGwpIHtcclxuXHRcdFx0c3RvcmVzLmFuaW1hdGUoe3RvcDogJzBweCd9LCB7cXVldWU6IGZhbHNlLCBkdXJhdGlvbjogMzAwICogdHJhbnNpdGlvbl9kaWZmfSk7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmKCF0b3BfY29udGFpbmVyLmxlbmd0aCkge1xyXG5cdFx0XHRzdG9yZXMuYW5pbWF0ZSh7dG9wOiAnMHB4J30sIHtxdWV1ZTogZmFsc2UsIGR1cmF0aW9uOiAzMDAgKiB0cmFuc2l0aW9uX2RpZmZ9KTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRzdG9yZXMuYW5pbWF0ZSh7XHJcblx0XHRcdFx0XHR0b3A6IHRvcF9jb250YWluZXIuaGVpZ2h0KCkgKyAyNiArICdweCdcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHF1ZXVlOiBmYWxzZSwgXHJcblx0XHRcdFx0XHRkdXJhdGlvbjogMzAwICogdHJhbnNpdGlvbl9kaWZmXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdGxvZzogZnVuY3Rpb24obXNnKSB7XHJcblx0XHRpZih0aGlzLl9sb2cpIHtcclxuXHRcdFx0Y29uc29sZS5sb2cobXNnKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHR1cGRhdGVTbGlkZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHNsaWRlciA9ICQoJyNsb2NhdGlvblNsaWRlcicpO1xyXG5cdFx0c2xpZGVyLndpZHRoKChzbGlkZXIuY2hpbGRyZW4oKS5sZW5ndGggKiA3MDApICsgJ3B4Jyk7XHJcblx0fSxcclxuXHJcblx0dXBkYXRlT3V0ZXJTbGlkZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHNsaWRlciA9ICQoJyNvdXRlclNsaWRlcicpO1xyXG5cdFx0c2xpZGVyLndpZHRoKChzbGlkZXIuY2hpbGRyZW4oKS5sZW5ndGggKiA3MDApICsgJ3B4Jyk7XHJcblx0fSxcclxuXHJcblx0Z2V0SW5jb21lTXNnOiBmdW5jdGlvbihudW0sIGRlbGF5KSB7XHJcblx0XHRyZXR1cm4gXyhcInswfSBwZXIgezF9c1wiLCAobnVtID4gMCA/IFwiK1wiIDogXCJcIikgKyBudW0sIGRlbGF5KTtcclxuXHR9LFxyXG5cclxuXHRzd2lwZUxlZnQ6IGZ1bmN0aW9uKGUpIHtcclxuXHRcdGlmKEVuZ2luZS5hY3RpdmVNb2R1bGUuc3dpcGVMZWZ0KSB7XHJcblx0XHRcdEVuZ2luZS5hY3RpdmVNb2R1bGUuc3dpcGVMZWZ0KGUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHN3aXBlUmlnaHQ6IGZ1bmN0aW9uKGUpIHtcclxuXHRcdGlmKEVuZ2luZS5hY3RpdmVNb2R1bGUuc3dpcGVSaWdodCkge1xyXG5cdFx0XHRFbmdpbmUuYWN0aXZlTW9kdWxlLnN3aXBlUmlnaHQoZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0c3dpcGVVcDogZnVuY3Rpb24oZSkge1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZS5zd2lwZVVwKSB7XHJcblx0XHRcdEVuZ2luZS5hY3RpdmVNb2R1bGUuc3dpcGVVcChlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRzd2lwZURvd246IGZ1bmN0aW9uKGUpIHtcclxuXHRcdGlmKEVuZ2luZS5hY3RpdmVNb2R1bGUuc3dpcGVEb3duKSB7XHJcblx0XHRcdEVuZ2luZS5hY3RpdmVNb2R1bGUuc3dpcGVEb3duKGUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdGRpc2FibGVTZWxlY3Rpb246IGZ1bmN0aW9uKCkge1xyXG5cdFx0ZG9jdW1lbnQub25zZWxlY3RzdGFydCA9IGV2ZW50TnVsbGlmaWVyOyAvLyB0aGlzIGlzIGZvciBJRVxyXG5cdFx0ZG9jdW1lbnQub25tb3VzZWRvd24gPSBldmVudE51bGxpZmllcjsgLy8gdGhpcyBpcyBmb3IgdGhlIHJlc3RcclxuXHR9LFxyXG5cclxuXHRlbmFibGVTZWxlY3Rpb246IGZ1bmN0aW9uKCkge1xyXG5cdFx0ZG9jdW1lbnQub25zZWxlY3RzdGFydCA9IGV2ZW50UGFzc3Rocm91Z2g7XHJcblx0XHRkb2N1bWVudC5vbm1vdXNlZG93biA9IGV2ZW50UGFzc3Rocm91Z2g7XHJcblx0fSxcclxuXHJcblx0YXV0b1NlbGVjdDogZnVuY3Rpb24oc2VsZWN0b3IpIHtcclxuXHRcdCQoc2VsZWN0b3IpLmZvY3VzKCkuc2VsZWN0KCk7XHJcblx0fSxcclxuXHJcblx0aGFuZGxlU3RhdGVVcGRhdGVzOiBmdW5jdGlvbihlKXtcclxuXHRcclxuXHR9LFxyXG5cclxuXHRzd2l0Y2hMYW5ndWFnZTogZnVuY3Rpb24oZG9tKXtcclxuXHRcdHZhciBsYW5nID0gJChkb20pLmRhdGEoXCJsYW5ndWFnZVwiKTtcclxuXHRcdGlmKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYuc2VhcmNoKC9bXFw/XFwmXWxhbmc9W2Etel9dKy8pICE9IC0xKXtcclxuXHRcdFx0ZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IGRvY3VtZW50LmxvY2F0aW9uLmhyZWYucmVwbGFjZSggLyhbXFw/XFwmXWxhbmc9KShbYS16X10rKS9naSAsIFwiJDFcIitsYW5nICk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0ZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgKyAoIChkb2N1bWVudC5sb2NhdGlvbi5ocmVmLnNlYXJjaCgvXFw/LykgIT0gLTEgKT9cIiZcIjpcIj9cIikgKyBcImxhbmc9XCIrbGFuZztcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRzYXZlTGFuZ3VhZ2U6IGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgbGFuZyA9IGRlY29kZVVSSUNvbXBvbmVudCgobmV3IFJlZ0V4cCgnWz98Jl1sYW5nPScgKyAnKFteJjtdKz8pKCZ8I3w7fCQpJykuZXhlYyhsb2NhdGlvbi5zZWFyY2gpfHxbLFwiXCJdKVsxXS5yZXBsYWNlKC9cXCsvZywgJyUyMCcpKXx8bnVsbDtcdFxyXG5cdFx0aWYobGFuZyAmJiB0eXBlb2YgU3RvcmFnZSAhPSAndW5kZWZpbmVkJyAmJiBsb2NhbFN0b3JhZ2UpIHtcclxuXHRcdFx0bG9jYWxTdG9yYWdlLmxhbmcgPSBsYW5nO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHNldFRpbWVvdXQ6IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aW1lb3V0LCBza2lwRG91YmxlPyl7XHJcblxyXG5cdFx0aWYoIEVuZ2luZS5vcHRpb25zLmRvdWJsZVRpbWUgJiYgIXNraXBEb3VibGUgKXtcclxuXHRcdFx0RW5naW5lLmxvZygnRG91YmxlIHRpbWUsIGN1dHRpbmcgdGltZW91dCBpbiBoYWxmJyk7XHJcblx0XHRcdHRpbWVvdXQgLz0gMjtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gc2V0VGltZW91dChjYWxsYmFjaywgdGltZW91dCk7XHJcblxyXG5cdH1cclxuXHJcbn07XHJcblxyXG5mdW5jdGlvbiBldmVudE51bGxpZmllcihlKSB7XHJcblx0cmV0dXJuICQoZS50YXJnZXQpLmhhc0NsYXNzKCdtZW51QnRuJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGV2ZW50UGFzc3Rocm91Z2goZSkge1xyXG5cdHJldHVybiB0cnVlO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gaW5WaWV3KGRpciwgZWxlbSl7XHJcblxyXG4gICAgICAgIHZhciBzY1RvcCA9ICQoJyNtYWluJykub2Zmc2V0KCkudG9wO1xyXG4gICAgICAgIHZhciBzY0JvdCA9IHNjVG9wICsgJCgnI21haW4nKS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgdmFyIGVsVG9wID0gZWxlbS5vZmZzZXQoKS50b3A7XHJcbiAgICAgICAgdmFyIGVsQm90ID0gZWxUb3AgKyBlbGVtLmhlaWdodCgpO1xyXG5cclxuICAgICAgICBpZiggZGlyID09ICd1cCcgKXtcclxuICAgICAgICAgICAgICAgIC8vIFNUT1AgTU9WSU5HIElGIEJPVFRPTSBPRiBFTEVNRU5UIElTIFZJU0lCTEUgSU4gU0NSRUVOXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKCBlbEJvdCA8IHNjQm90ICk7XHJcbiAgICAgICAgfWVsc2UgaWYoIGRpciA9PSAnZG93bicgKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoIGVsVG9wID4gc2NUb3AgKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoICggZWxCb3QgPD0gc2NCb3QgKSAmJiAoIGVsVG9wID49IHNjVG9wICkgKTtcclxuICAgICAgICB9XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBzY3JvbGxCeVgoZWxlbSwgeCl7XHJcblxyXG4gICAgICAgIHZhciBlbFRvcCA9IHBhcnNlSW50KCBlbGVtLmNzcygndG9wJyksIDEwICk7XHJcbiAgICAgICAgZWxlbS5jc3MoICd0b3AnLCAoIGVsVG9wICsgeCApICsgXCJweFwiICk7XHJcblxyXG59XHJcblxyXG5cclxuLy9jcmVhdGUgalF1ZXJ5IENhbGxiYWNrcygpIHRvIGhhbmRsZSBvYmplY3QgZXZlbnRzIFxyXG4kLkRpc3BhdGNoID0gZnVuY3Rpb24oIGlkICkge1xyXG5cdHZhciBjYWxsYmFja3MsIHRvcGljID0gaWQgJiYgRW5naW5lLnRvcGljc1sgaWQgXTtcclxuXHRpZiAoICF0b3BpYyApIHtcclxuXHRcdGNhbGxiYWNrcyA9IGpRdWVyeS5DYWxsYmFja3MoKTtcclxuXHRcdHRvcGljID0ge1xyXG5cdFx0XHRcdHB1Ymxpc2g6IGNhbGxiYWNrcy5maXJlLFxyXG5cdFx0XHRcdHN1YnNjcmliZTogY2FsbGJhY2tzLmFkZCxcclxuXHRcdFx0XHR1bnN1YnNjcmliZTogY2FsbGJhY2tzLnJlbW92ZVxyXG5cdFx0fTtcclxuXHRcdGlmICggaWQgKSB7XHJcblx0XHRcdEVuZ2luZS50b3BpY3NbIGlkIF0gPSB0b3BpYztcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIHRvcGljO1xyXG59O1xyXG5cclxuJChmdW5jdGlvbigpIHtcclxuXHRFbmdpbmUuaW5pdCgpO1xyXG59KTtcclxuXHJcbiIsIi8qKlxyXG4gKiBNb2R1bGUgdGhhdCBoYW5kbGVzIHRoZSByYW5kb20gZXZlbnQgc3lzdGVtXHJcbiAqL1xyXG5pbXBvcnQgeyBFdmVudHNSb2FkV2FuZGVyIH0gZnJvbSBcIi4vZXZlbnRzL3JvYWR3YW5kZXJcIjtcclxuaW1wb3J0IHsgRXZlbnRzUm9vbSB9IGZyb20gXCIuL2V2ZW50cy9yb29tXCI7XHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBOb3RpZmljYXRpb25zIH0gZnJvbSBcIi4vbm90aWZpY2F0aW9uc1wiO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi9CdXR0b25cIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQURSRXZlbnQge1xyXG5cdHRpdGxlOiBzdHJpbmcsXHJcblx0aXNBdmFpbGFibGU/OiBGdW5jdGlvbixcclxuXHRpc1N1cGVyTGlrZWx5PzogRnVuY3Rpb24sXHJcblx0c2NlbmVzOiB7XHJcblx0XHQvLyB0eXBlIHRoaXMgb3V0IGJldHRlciB1c2luZyBJbmRleCBTaWduYXR1cmVzXHJcblx0fSxcclxuXHRldmVudFBhbmVsPzogYW55XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU2NlbmUge1xyXG5cdHNlZW5GbGFnOiBGdW5jdGlvbixcclxuXHRuZXh0U2NlbmU6IHN0cmluZyxcclxuXHRvbkxvYWQ6IEZ1bmN0aW9uLFxyXG5cdHRleHQ6IEFycmF5PHN0cmluZz4sXHJcblx0YnV0dG9uczoge1xyXG5cdFx0W2lkOiBzdHJpbmddOiBFdmVudEJ1dHRvblxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBFdmVudEJ1dHRvbiB7XHJcblx0dGV4dDogc3RyaW5nLFxyXG5cdG5leHRTY2VuZToge1xyXG5cdFx0W2lkOiBudW1iZXJdOiBzdHJpbmdcclxuXHR9LFxyXG5cdG9uQ2hvb3NlOiBGdW5jdGlvblxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgRXZlbnRzID0ge1xyXG5cdFx0XHJcblx0X0VWRU5UX1RJTUVfUkFOR0U6IFszLCA2XSwgLy8gcmFuZ2UsIGluIG1pbnV0ZXNcclxuXHRfUEFORUxfRkFERTogMjAwLFxyXG5cdF9GSUdIVF9TUEVFRDogMTAwLFxyXG5cdF9FQVRfQ09PTERPV046IDUsXHJcblx0X01FRFNfQ09PTERPV046IDcsXHJcblx0X0xFQVZFX0NPT0xET1dOOiAxLFxyXG5cdFNUVU5fRFVSQVRJT046IDQwMDAsXHJcblx0QkxJTktfSU5URVJWQUw6IGZhbHNlLFxyXG5cclxuXHRFdmVudFBvb2w6IDxhbnk+W10sXHJcblx0ZXZlbnRTdGFjazogPGFueT5bXSxcclxuXHRfZXZlbnRUaW1lb3V0OiAwLFxyXG5cclxuXHRMb2NhdGlvbnM6IHt9LFxyXG5cclxuXHRpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHRcdFxyXG5cdFx0Ly8gQnVpbGQgdGhlIEV2ZW50IFBvb2xcclxuXHRcdEV2ZW50cy5FdmVudFBvb2wgPSBbXS5jb25jYXQoXHJcblx0XHRcdEV2ZW50c1Jvb20gYXMgYW55LFxyXG5cdFx0XHRFdmVudHNSb2FkV2FuZGVyIGFzIGFueVxyXG5cdFx0KTtcclxuXHJcblx0XHR0aGlzLkxvY2F0aW9uc1tcIlJvb21cIl0gPSBFdmVudHNSb29tO1xyXG5cdFx0dGhpcy5Mb2NhdGlvbnNbXCJSb2FkV2FuZGVyXCJdID0gRXZlbnRzUm9hZFdhbmRlcjtcclxuXHRcdFxyXG5cdFx0RXZlbnRzLmV2ZW50U3RhY2sgPSBbXTtcclxuXHRcdFxyXG5cdFx0Ly9zdWJzY3JpYmUgdG8gc3RhdGVVcGRhdGVzXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHQkLkRpc3BhdGNoKCdzdGF0ZVVwZGF0ZScpLnN1YnNjcmliZShFdmVudHMuaGFuZGxlU3RhdGVVcGRhdGVzKTtcclxuXHR9LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHt9LCAvLyBOb3RoaW5nIGZvciBub3dcclxuICAgIFxyXG5cdGFjdGl2ZVNjZW5lOiAnJyxcclxuICAgIFxyXG5cdGxvYWRTY2VuZTogZnVuY3Rpb24obmFtZSkge1xyXG5cdFx0RW5naW5lLmxvZygnbG9hZGluZyBzY2VuZTogJyArIG5hbWUpO1xyXG5cdFx0RXZlbnRzLmFjdGl2ZVNjZW5lID0gbmFtZTtcclxuXHRcdHZhciBzY2VuZSA9IEV2ZW50cy5hY3RpdmVFdmVudCgpPy5zY2VuZXNbbmFtZV07XHJcblx0XHRcclxuXHRcdC8vIGhhbmRsZXMgb25lLXRpbWUgc2NlbmVzLCBzdWNoIGFzIGludHJvZHVjdGlvbnNcclxuXHRcdC8vIG1heWJlIEkgY2FuIG1ha2UgYSBtb3JlIGV4cGxpY2l0IFwiaW50cm9kdWN0aW9uXCIgbG9naWNhbCBmbG93IHRvIG1ha2UgdGhpc1xyXG5cdFx0Ly8gYSBsaXR0bGUgbW9yZSBlbGVnYW50LCBnaXZlbiB0aGF0IHRoZXJlIHdpbGwgYWx3YXlzIGJlIGFuIFwiaW50cm9kdWN0aW9uXCIgc2NlbmVcclxuXHRcdC8vIHRoYXQncyBvbmx5IG1lYW50IHRvIGJlIHJ1biBhIHNpbmdsZSB0aW1lLlxyXG5cdFx0aWYgKHNjZW5lLnNlZW5GbGFnICYmIHNjZW5lLnNlZW5GbGFnKCkpIHtcclxuXHRcdFx0RXZlbnRzLmxvYWRTY2VuZShzY2VuZS5uZXh0U2NlbmUpXHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBTY2VuZSByZXdhcmRcclxuXHRcdGlmKHNjZW5lLnJld2FyZCkge1xyXG5cdFx0XHQkU00uYWRkTSgnc3RvcmVzJywgc2NlbmUucmV3YXJkKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gb25Mb2FkXHJcblx0XHRpZihzY2VuZS5vbkxvYWQpIHtcclxuXHRcdFx0c2NlbmUub25Mb2FkKCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIE5vdGlmeSB0aGUgc2NlbmUgY2hhbmdlXHJcblx0XHRpZihzY2VuZS5ub3RpZmljYXRpb24pIHtcclxuXHRcdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgc2NlbmUubm90aWZpY2F0aW9uKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0JCgnI2Rlc2NyaXB0aW9uJywgRXZlbnRzLmV2ZW50UGFuZWwoKSkuZW1wdHkoKTtcclxuXHRcdCQoJyNidXR0b25zJywgRXZlbnRzLmV2ZW50UGFuZWwoKSkuZW1wdHkoKTtcclxuXHRcdEV2ZW50cy5zdGFydFN0b3J5KHNjZW5lKTtcclxuXHR9LFxyXG5cdFxyXG5cdGRyYXdGbG9hdFRleHQ6IGZ1bmN0aW9uKHRleHQsIHBhcmVudCkge1xyXG5cdFx0JCgnPGRpdj4nKS50ZXh0KHRleHQpLmFkZENsYXNzKCdkYW1hZ2VUZXh0JykuYXBwZW5kVG8ocGFyZW50KS5hbmltYXRlKHtcclxuXHRcdFx0J2JvdHRvbSc6ICc1MHB4JyxcclxuXHRcdFx0J29wYWNpdHknOiAnMCdcclxuXHRcdH0sXHJcblx0XHQzMDAsXHJcblx0XHQnbGluZWFyJyxcclxuXHRcdGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZSgpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRcclxuXHRzdGFydFN0b3J5OiBmdW5jdGlvbihzY2VuZSkge1xyXG5cdFx0Ly8gV3JpdGUgdGhlIHRleHRcclxuXHRcdHZhciBkZXNjID0gJCgnI2Rlc2NyaXB0aW9uJywgRXZlbnRzLmV2ZW50UGFuZWwoKSk7XHJcblx0XHRmb3IodmFyIGkgaW4gc2NlbmUudGV4dCkge1xyXG5cdFx0XHQkKCc8ZGl2PicpLnRleHQoc2NlbmUudGV4dFtpXSkuYXBwZW5kVG8oZGVzYyk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmKHNjZW5lLnRleHRhcmVhICE9IG51bGwpIHtcclxuXHRcdFx0dmFyIHRhID0gJCgnPHRleHRhcmVhPicpLnZhbChzY2VuZS50ZXh0YXJlYSkuYXBwZW5kVG8oZGVzYyk7XHJcblx0XHRcdGlmKHNjZW5lLnJlYWRvbmx5KSB7XHJcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdHRhLmF0dHIoJ3JlYWRvbmx5JywgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gRHJhdyB0aGUgYnV0dG9uc1xyXG5cdFx0RXZlbnRzLmRyYXdCdXR0b25zKHNjZW5lKTtcclxuXHR9LFxyXG5cdFxyXG5cdGRyYXdCdXR0b25zOiBmdW5jdGlvbihzY2VuZSkge1xyXG5cdFx0dmFyIGJ0bnMgPSAkKCcjYnV0dG9ucycsIEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0Zm9yKHZhciBpZCBpbiBzY2VuZS5idXR0b25zKSB7XHJcblx0XHRcdHZhciBpbmZvID0gc2NlbmUuYnV0dG9uc1tpZF07XHJcblx0XHRcdFx0dmFyIGIgPSBcclxuXHRcdFx0XHQvL25ldyBcclxuXHRcdFx0XHRCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0XHRcdGlkOiBpZCxcclxuXHRcdFx0XHRcdHRleHQ6IGluZm8udGV4dCxcclxuXHRcdFx0XHRcdGNvc3Q6IGluZm8uY29zdCxcclxuXHRcdFx0XHRcdGNsaWNrOiBFdmVudHMuYnV0dG9uQ2xpY2ssXHJcblx0XHRcdFx0XHRjb29sZG93bjogaW5mby5jb29sZG93bixcclxuXHRcdFx0XHRcdGltYWdlOiBpbmZvLmltYWdlXHJcblx0XHRcdFx0fSkuYXBwZW5kVG8oYnRucyk7XHJcblx0XHRcdGlmKHR5cGVvZiBpbmZvLmF2YWlsYWJsZSA9PSAnZnVuY3Rpb24nICYmICFpbmZvLmF2YWlsYWJsZSgpKSB7XHJcblx0XHRcdFx0QnV0dG9uLnNldERpc2FibGVkKGIsIHRydWUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHR5cGVvZiBpbmZvLnZpc2libGUgPT0gJ2Z1bmN0aW9uJyAmJiAhaW5mby52aXNpYmxlKCkpIHtcclxuXHRcdFx0XHRiLmhpZGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih0eXBlb2YgaW5mby5jb29sZG93biA9PSAnbnVtYmVyJykge1xyXG5cdFx0XHRcdEJ1dHRvbi5jb29sZG93bihiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRFdmVudHMudXBkYXRlQnV0dG9ucygpO1xyXG5cdH0sXHJcblx0XHJcblx0dXBkYXRlQnV0dG9uczogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgYnRucyA9IEV2ZW50cy5hY3RpdmVFdmVudCgpPy5zY2VuZXNbRXZlbnRzLmFjdGl2ZVNjZW5lXS5idXR0b25zO1xyXG5cdFx0Zm9yKHZhciBiSWQgaW4gYnRucykge1xyXG5cdFx0XHR2YXIgYiA9IGJ0bnNbYklkXTtcclxuXHRcdFx0dmFyIGJ0bkVsID0gJCgnIycrYklkLCBFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdFx0aWYodHlwZW9mIGIuYXZhaWxhYmxlID09ICdmdW5jdGlvbicgJiYgIWIuYXZhaWxhYmxlKCkpIHtcclxuXHRcdFx0XHRCdXR0b24uc2V0RGlzYWJsZWQoYnRuRWwsIHRydWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRidXR0b25DbGljazogZnVuY3Rpb24oYnRuKSB7XHJcblx0XHR2YXIgaW5mbyA9IEV2ZW50cy5hY3RpdmVFdmVudCgpPy5zY2VuZXNbRXZlbnRzLmFjdGl2ZVNjZW5lXS5idXR0b25zW2J0bi5hdHRyKCdpZCcpXTtcclxuXHJcblx0XHRpZih0eXBlb2YgaW5mby5vbkNob29zZSA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdHZhciB0ZXh0YXJlYSA9IEV2ZW50cy5ldmVudFBhbmVsKCkuZmluZCgndGV4dGFyZWEnKTtcclxuXHRcdFx0aW5mby5vbkNob29zZSh0ZXh0YXJlYS5sZW5ndGggPiAwID8gdGV4dGFyZWEudmFsKCkgOiBudWxsKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gUmV3YXJkXHJcblx0XHRpZihpbmZvLnJld2FyZCkge1xyXG5cdFx0XHQkU00uYWRkTSgnc3RvcmVzJywgaW5mby5yZXdhcmQpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRFdmVudHMudXBkYXRlQnV0dG9ucygpO1xyXG5cdFx0XHJcblx0XHQvLyBOb3RpZmljYXRpb25cclxuXHRcdGlmKGluZm8ubm90aWZpY2F0aW9uKSB7XHJcblx0XHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIGluZm8ubm90aWZpY2F0aW9uKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gTmV4dCBTY2VuZVxyXG5cdFx0aWYoaW5mby5uZXh0U2NlbmUpIHtcclxuXHRcdFx0aWYoaW5mby5uZXh0U2NlbmUgPT0gJ2VuZCcpIHtcclxuXHRcdFx0XHRFdmVudHMuZW5kRXZlbnQoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR2YXIgciA9IE1hdGgucmFuZG9tKCk7XHJcblx0XHRcdFx0dmFyIGxvd2VzdE1hdGNoOiBudWxsIHwgc3RyaW5nID0gbnVsbDtcclxuXHRcdFx0XHRmb3IodmFyIGkgaW4gaW5mby5uZXh0U2NlbmUpIHtcclxuXHRcdFx0XHRcdGlmKHIgPCAoaSBhcyB1bmtub3duIGFzIG51bWJlcikgJiYgKGxvd2VzdE1hdGNoID09IG51bGwgfHwgaSA8IGxvd2VzdE1hdGNoKSkge1xyXG5cdFx0XHRcdFx0XHRsb3dlc3RNYXRjaCA9IGk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGxvd2VzdE1hdGNoICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdEV2ZW50cy5sb2FkU2NlbmUoaW5mby5uZXh0U2NlbmVbbG93ZXN0TWF0Y2hdKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0RW5naW5lLmxvZygnRVJST1I6IG5vIHN1aXRhYmxlIHNjZW5lIGZvdW5kJyk7XHJcblx0XHRcdFx0RXZlbnRzLmVuZEV2ZW50KCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHQvLyBibGlua3MgdGhlIGJyb3dzZXIgd2luZG93IHRpdGxlXHJcblx0YmxpbmtUaXRsZTogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdGl0bGUgPSBkb2N1bWVudC50aXRsZTtcclxuXHJcblx0XHQvLyBldmVyeSAzIHNlY29uZHMgY2hhbmdlIHRpdGxlIHRvICcqKiogRVZFTlQgKioqJywgdGhlbiAxLjUgc2Vjb25kcyBsYXRlciwgY2hhbmdlIGl0IGJhY2sgdG8gdGhlIG9yaWdpbmFsIHRpdGxlLlxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0RXZlbnRzLkJMSU5LX0lOVEVSVkFMID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdGRvY3VtZW50LnRpdGxlID0gXygnKioqIEVWRU5UICoqKicpO1xyXG5cdFx0XHRFbmdpbmUuc2V0VGltZW91dChmdW5jdGlvbigpIHtkb2N1bWVudC50aXRsZSA9IHRpdGxlO30sIDE1MDAsIHRydWUpOyBcclxuXHRcdH0sIDMwMDApO1xyXG5cdH0sXHJcblxyXG5cdHN0b3BUaXRsZUJsaW5rOiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdGNsZWFySW50ZXJ2YWwoRXZlbnRzLkJMSU5LX0lOVEVSVkFMKTtcclxuXHRcdEV2ZW50cy5CTElOS19JTlRFUlZBTCA9IGZhbHNlO1xyXG5cdH0sXHJcblx0XHJcblx0Ly8gTWFrZXMgYW4gZXZlbnQgaGFwcGVuIVxyXG5cdHRyaWdnZXJFdmVudDogZnVuY3Rpb24oKSB7XHJcblx0XHRpZihFdmVudHMuYWN0aXZlRXZlbnQoKSA9PSBudWxsKSB7XHJcblx0XHRcdHZhciBwb3NzaWJsZUV2ZW50cyA9IFtdO1xyXG5cdFx0XHRmb3IodmFyIGkgaW4gRXZlbnRzLkV2ZW50UG9vbCkge1xyXG5cdFx0XHRcdHZhciBldmVudCA9IEV2ZW50cy5FdmVudFBvb2xbaV07XHJcblx0XHRcdFx0aWYoZXZlbnQuaXNBdmFpbGFibGUoKSkge1xyXG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdFx0cG9zc2libGVFdmVudHMucHVzaChldmVudCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZihwb3NzaWJsZUV2ZW50cy5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHRFdmVudHMuc2NoZWR1bGVOZXh0RXZlbnQoMC41KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFyIHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqKHBvc3NpYmxlRXZlbnRzLmxlbmd0aCkpO1xyXG5cdFx0XHRcdEV2ZW50cy5zdGFydEV2ZW50KHBvc3NpYmxlRXZlbnRzW3JdKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdEV2ZW50cy5zY2hlZHVsZU5leHRFdmVudCgpO1xyXG5cdH0sXHJcblxyXG5cdC8vIG5vdCBzY2hlZHVsZWQsIHRoaXMgaXMgZm9yIHN0dWZmIGxpa2UgbG9jYXRpb24tYmFzZWQgcmFuZG9tIGV2ZW50cyBvbiBhIGJ1dHRvbiBjbGlja1xyXG5cdHRyaWdnZXJMb2NhdGlvbkV2ZW50OiBmdW5jdGlvbihsb2NhdGlvbikge1xyXG5cdFx0aWYgKHRoaXMuTG9jYXRpb25zW2xvY2F0aW9uXSkge1xyXG5cdFx0XHRpZihFdmVudHMuYWN0aXZlRXZlbnQoKSA9PSBudWxsKSB7XHJcblx0XHRcdFx0dmFyIHBvc3NpYmxlRXZlbnRzOiBBcnJheTxhbnk+ID0gW107XHJcblx0XHRcdFx0Zm9yKHZhciBpIGluIHRoaXMuTG9jYXRpb25zW2xvY2F0aW9uXSkge1xyXG5cdFx0XHRcdFx0dmFyIGV2ZW50ID0gdGhpcy5Mb2NhdGlvbnNbbG9jYXRpb25dW2ldO1xyXG5cdFx0XHRcdFx0aWYoZXZlbnQuaXNBdmFpbGFibGUoKSkge1xyXG5cdFx0XHRcdFx0XHRpZih0eXBlb2YoZXZlbnQuaXNTdXBlckxpa2VseSkgPT0gJ2Z1bmN0aW9uJyAmJiBldmVudC5pc1N1cGVyTGlrZWx5KCkpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBTdXBlckxpa2VseSBldmVudCwgZG8gdGhpcyBhbmQgc2tpcCB0aGUgcmFuZG9tIGNob2ljZVxyXG5cdFx0XHRcdFx0XHRcdEVuZ2luZS5sb2coJ3N1cGVyTGlrZWx5IGRldGVjdGVkJyk7XHJcblx0XHRcdFx0XHRcdFx0RXZlbnRzLnN0YXJ0RXZlbnQoZXZlbnQpO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRwb3NzaWJsZUV2ZW50cy5wdXNoKGV2ZW50KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHJcblx0XHRcdFx0aWYocG9zc2libGVFdmVudHMubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdFx0XHQvLyBFdmVudHMuc2NoZWR1bGVOZXh0RXZlbnQoMC41KTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dmFyIHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqKHBvc3NpYmxlRXZlbnRzLmxlbmd0aCkpO1xyXG5cdFx0XHRcdFx0RXZlbnRzLnN0YXJ0RXZlbnQocG9zc2libGVFdmVudHNbcl0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0YWN0aXZlRXZlbnQ6IGZ1bmN0aW9uKCk6IEFEUkV2ZW50IHwgbnVsbCB7XHJcblx0XHRpZihFdmVudHMuZXZlbnRTdGFjayAmJiBFdmVudHMuZXZlbnRTdGFjay5sZW5ndGggPiAwKSB7XHJcblx0XHRcdHJldHVybiBFdmVudHMuZXZlbnRTdGFja1swXTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH0sXHJcblx0XHJcblx0ZXZlbnRQYW5lbDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LmV2ZW50UGFuZWw7XHJcblx0fSxcclxuXHJcblx0c3RhcnRFdmVudDogZnVuY3Rpb24oZXZlbnQ6IEFEUkV2ZW50LCBvcHRpb25zPykge1xyXG5cdFx0aWYoZXZlbnQpIHtcclxuXHRcdFx0RW5naW5lLmV2ZW50KCdnYW1lIGV2ZW50JywgJ2V2ZW50Jyk7XHJcblx0XHRcdEV2ZW50cy5ldmVudFN0YWNrLnVuc2hpZnQoZXZlbnQpO1xyXG5cdFx0XHRldmVudC5ldmVudFBhbmVsID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdldmVudCcpLmFkZENsYXNzKCdldmVudFBhbmVsJykuY3NzKCdvcGFjaXR5JywgJzAnKTtcclxuXHRcdFx0aWYob3B0aW9ucyAhPSBudWxsICYmIG9wdGlvbnMud2lkdGggIT0gbnVsbCkge1xyXG5cdFx0XHRcdEV2ZW50cy5ldmVudFBhbmVsKCkuY3NzKCd3aWR0aCcsIG9wdGlvbnMud2lkdGgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoJzxkaXY+JykuYWRkQ2xhc3MoJ2V2ZW50VGl0bGUnKS50ZXh0KEV2ZW50cy5hY3RpdmVFdmVudCgpPy50aXRsZSBhcyBzdHJpbmcpLmFwcGVuZFRvKEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2Rlc2NyaXB0aW9uJykuYXBwZW5kVG8oRXZlbnRzLmV2ZW50UGFuZWwoKSk7XHJcblx0XHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnYnV0dG9ucycpLmFwcGVuZFRvKEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0XHRFdmVudHMubG9hZFNjZW5lKCdzdGFydCcpO1xyXG5cdFx0XHQkKCdkaXYjd3JhcHBlcicpLmFwcGVuZChFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdFx0RXZlbnRzLmV2ZW50UGFuZWwoKS5hbmltYXRlKHtvcGFjaXR5OiAxfSwgRXZlbnRzLl9QQU5FTF9GQURFLCAnbGluZWFyJyk7XHJcblx0XHRcdHZhciBjdXJyZW50U2NlbmVJbmZvcm1hdGlvbiA9IEV2ZW50cy5hY3RpdmVFdmVudCgpPy5zY2VuZXNbRXZlbnRzLmFjdGl2ZVNjZW5lXTtcclxuXHRcdFx0aWYgKGN1cnJlbnRTY2VuZUluZm9ybWF0aW9uLmJsaW5rKSB7XHJcblx0XHRcdFx0RXZlbnRzLmJsaW5rVGl0bGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHNjaGVkdWxlTmV4dEV2ZW50OiBmdW5jdGlvbihzY2FsZT8pIHtcclxuXHRcdHZhciBuZXh0RXZlbnQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqKEV2ZW50cy5fRVZFTlRfVElNRV9SQU5HRVsxXSAtIEV2ZW50cy5fRVZFTlRfVElNRV9SQU5HRVswXSkpICsgRXZlbnRzLl9FVkVOVF9USU1FX1JBTkdFWzBdO1xyXG5cdFx0aWYoc2NhbGUgPiAwKSB7IG5leHRFdmVudCAqPSBzY2FsZTsgfVxyXG5cdFx0RW5naW5lLmxvZygnbmV4dCBldmVudCBzY2hlZHVsZWQgaW4gJyArIG5leHRFdmVudCArICcgbWludXRlcycpO1xyXG5cdFx0RXZlbnRzLl9ldmVudFRpbWVvdXQgPSBFbmdpbmUuc2V0VGltZW91dChFdmVudHMudHJpZ2dlckV2ZW50LCBuZXh0RXZlbnQgKiA2MCAqIDEwMDApO1xyXG5cdH0sXHJcblxyXG5cdGVuZEV2ZW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5ldmVudFBhbmVsKCkuYW5pbWF0ZSh7b3BhY2l0eTowfSwgRXZlbnRzLl9QQU5FTF9GQURFLCAnbGluZWFyJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdEV2ZW50cy5ldmVudFBhbmVsKCkucmVtb3ZlKCk7XHJcblx0XHRcdGNvbnN0IGFjdGl2ZUV2ZW50ID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk7XHJcblx0XHRcdGlmIChhY3RpdmVFdmVudCAhPT0gbnVsbCkgYWN0aXZlRXZlbnQuZXZlbnRQYW5lbCA9IG51bGw7XHJcblx0XHRcdEV2ZW50cy5ldmVudFN0YWNrLnNoaWZ0KCk7XHJcblx0XHRcdEVuZ2luZS5sb2coRXZlbnRzLmV2ZW50U3RhY2subGVuZ3RoICsgJyBldmVudHMgcmVtYWluaW5nJyk7XHJcblx0XHRcdGlmIChFdmVudHMuQkxJTktfSU5URVJWQUwpIHtcclxuXHRcdFx0XHRFdmVudHMuc3RvcFRpdGxlQmxpbmsoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBGb3JjZSByZWZvY3VzIG9uIHRoZSBib2R5LiBJIGhhdGUgeW91LCBJRS5cclxuXHRcdFx0JCgnYm9keScpLmZvY3VzKCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRoYW5kbGVTdGF0ZVVwZGF0ZXM6IGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYoKGUuY2F0ZWdvcnkgPT0gJ3N0b3JlcycgfHwgZS5jYXRlZ29yeSA9PSAnaW5jb21lJykgJiYgRXZlbnRzLmFjdGl2ZUV2ZW50KCkgIT0gbnVsbCl7XHJcblx0XHRcdEV2ZW50cy51cGRhdGVCdXR0b25zKCk7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG4iLCIvKipcclxuICogRXZlbnRzIHRoYXQgY2FuIG9jY3VyIHdoZW4gdGhlIFJvYWQgbW9kdWxlIGlzIGFjdGl2ZVxyXG4gKiovXHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuLi9lbmdpbmVcIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuLi9wbGF5ZXIvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCB7IE91dHBvc3QgfSBmcm9tIFwiLi4vcGxhY2VzL291dHBvc3RcIjtcclxuaW1wb3J0IHsgUm9hZCB9IGZyb20gXCIuLi9wbGFjZXMvcm9hZFwiO1xyXG5pbXBvcnQgeyBBRFJFdmVudCB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBFdmVudHNSb2FkV2FuZGVyOiBBcnJheTxBRFJFdmVudD4gPSBbXHJcbiAgICAvLyBTdHJhbmdlciBiZWFyaW5nIGdpZnRzXHJcbiAgICB7XHJcbiAgICAgICAgdGl0bGU6IF8oJ0EgU3RyYW5nZXIgQmVja29ucycpLFxyXG4gICAgICAgIGlzQXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gUm9hZDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAnc3RhcnQnOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgXygnQXMgeW91IHdhbmRlciBhbG9uZyB0aGUgcm9hZCwgYSBob29kZWQgc3RyYW5nZXIgZ2VzdHVyZXMgdG8geW91LiBIZSBkb2VzblxcJ3Qgc2VlbSBpbnRlcmVzdGVkIGluIGh1cnRpbmcgeW91LicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1doYXQgZG8geW91IGRvPycpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdjbG9zZXInOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0RyYXcgQ2xvc2VyJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6ICdjbG9zZXInfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdHZXQgT3V0dGEgVGhlcmUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTogJ2xlYXZlJ31cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdjbG9zZXInOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgXygnWW91IG1vdmUgdG93YXJkIGhpbSBhIGJpdCBhbmQgc3RvcC4gSGUgY29udGludWVzIHRvIGJlY2tvbi4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdXaGF0IGRvIHlvdSBkbz8nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnZXZlbkNsb3Nlcic6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnRHJhdyBFdmVuIENsb3NlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOiAnZXZlbkNsb3Nlcid9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAnbGVhdmUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ05haCwgVGhpcyBpcyBUb28gU3Bvb2t5JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6ICdsZWF2ZSd9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnZXZlbkNsb3Nlcic6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdZb3UgaGVzaXRhbnRseSB3YWxrIGNsb3Nlci4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdBcyBzb29uIGFzIHlvdSBnZXQgd2l0aGluIGFybXNcXCcgcmVhY2gsIGhlIGdyYWJzIHlvdXIgaGFuZCB3aXRoIGFsYXJtaW5nIHNwZWVkLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0hlIHF1aWNrbHkgcGxhY2VzIGFuIG9iamVjdCBpbiB5b3VyIGhhbmQsIHRoZW4gbGVhdmVzIHdvcmRsZXNzbHkuJylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBvbkxvYWQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG1heWJlIHNvbWUgbG9naWMgdG8gbWFrZSByZXBlYXRzIGxlc3MgbGlrZWx5P1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvc3NpYmxlSXRlbXMgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdTdHJhbmdlci5zbW9vdGhTdG9uZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdTdHJhbmdlci53cmFwcGVkS25pZmUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnU3RyYW5nZXIuY2xvdGhCdW5kbGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnU3RyYW5nZXIuY29pbidcclxuICAgICAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBwb3NzaWJsZUl0ZW1zW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBvc3NpYmxlSXRlbXMubGVuZ3RoKV07XHJcbiAgICAgICAgICAgICAgICAgICAgQ2hhcmFjdGVyLmFkZFRvSW52ZW50b3J5KGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnVGhhbmtzLCBJIGd1ZXNzPycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnbGVhdmUnOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgXygnWW91ciBndXQgY2xlbmNoZXMsIGFuZCB5b3UgZmVlbCB0aGUgc3VkZGVuIHVyZ2UgdG8gbGVhdmUuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnQXMgeW91IHdhbGsgYXdheSwgeW91IGNhbiBmZWVsIHRoZSBvbGQgbWFuXFwncyBnYXplIG9uIHlvdXIgYmFjay4nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnV2VpcmQuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gVW5sb2NrIE91dHBvc3RcclxuICAgIHtcclxuICAgICAgICB0aXRsZTogXygnQSBXYXkgRm9yd2FyZCBNYWtlcyBJdHNlbGYgS25vd24nKSxcclxuICAgICAgICBpc0F2YWlsYWJsZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAoRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSBSb2FkKVxyXG4gICAgICAgICAgICAgICAgJiYgKCRTTS5nZXQoJ1JvYWQuY291bnRlcicpIGFzIG51bWJlciA+IDYpIC8vIGNhbid0IGhhcHBlbiBUT08gZWFybHlcclxuICAgICAgICAgICAgICAgICYmICh0eXBlb2YoJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpKSA9PSBcInVuZGVmaW5lZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgfHwgJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpIGFzIG51bWJlciA8IDEpIC8vIGNhbid0IGhhcHBlbiB0d2ljZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaXNTdXBlckxpa2VseTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpIGFzIG51bWJlciA8IDEpICYmICgkU00uZ2V0KCdSb2FkLmNvdW50ZXInKSBhcyBudW1iZXIgPiAxMCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgJ3N0YXJ0Jzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1Ntb2tlIGN1cmxzIHVwd2FyZHMgZnJvbSBiZWhpbmQgYSBoaWxsLiBZb3UgY2xpbWIgaGlnaGVyIHRvIGludmVzdGlnYXRlLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0Zyb20geW91ciBlbGV2YXRlZCBwb3NpdGlvbiwgeW91IGNhbiBzZWUgZG93biBpbnRvIHRoZSBvdXRwb3N0IHRoYXQgdGhlIG1heW9yIHNwb2tlIG9mIGJlZm9yZS4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdUaGUgT3V0cG9zdCBpcyBub3cgb3BlbiB0byB5b3UuJylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0EgbGl0dGxlIGRyYW1hdGljLCBidXQgY29vbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBPdXRwb3N0LmluaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRTTS5zZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENoYXJhY3Rlci5zZXRRdWVzdFN0YXR1cyhcIm1heW9yU3VwcGxpZXNcIiwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDaGFyYWN0ZXIuY2hlY2tRdWVzdFN0YXR1cyhcIm1heW9yU3VwcGxpZXNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5dO1xyXG5cclxuIiwiLyoqXHJcbiAqIEV2ZW50cyB0aGF0IGNhbiBvY2N1ciB3aGVuIHRoZSBSb29tIG1vZHVsZSBpcyBhY3RpdmVcclxuICoqL1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi4vZW5naW5lXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IFJvb20gfSBmcm9tICcuLi9wbGFjZXMvcm9vbSc7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyBBRFJFdmVudCB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBFdmVudHNSb29tOiBBcnJheTxBRFJFdmVudD4gPSBbXHJcblx0eyAvKiBUaGUgTm9tYWQgIC0tICBNZXJjaGFudCAqL1xyXG5cdFx0dGl0bGU6IF8oJ1RoZSBOb21hZCcpLFxyXG5cdFx0aXNBdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSBSb29tICYmICRTTS5nZXQoJ3N0b3Jlcy5mdXInLCB0cnVlKSBhcyBudW1iZXIgPiAwO1xyXG5cdFx0fSxcclxuXHRcdHNjZW5lczoge1xyXG5cdFx0XHQnc3RhcnQnOiB7XHJcblx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XygnYSBub21hZCBzaHVmZmxlcyBpbnRvIHZpZXcsIGxhZGVuIHdpdGggbWFrZXNoaWZ0IGJhZ3MgYm91bmQgd2l0aCByb3VnaCB0d2luZS4nKSxcclxuXHRcdFx0XHRcdF8oXCJ3b24ndCBzYXkgZnJvbSB3aGVyZSBoZSBjYW1lLCBidXQgaXQncyBjbGVhciB0aGF0IGhlJ3Mgbm90IHN0YXlpbmcuXCIpXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRub3RpZmljYXRpb246IF8oJ2Egbm9tYWQgYXJyaXZlcywgbG9va2luZyB0byB0cmFkZScpLFxyXG5cdFx0XHRcdGJsaW5rOiB0cnVlLFxyXG5cdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdCdidXlTY2FsZXMnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ2J1eSBzY2FsZXMnKSxcclxuXHRcdFx0XHRcdFx0Y29zdDogeyAnZnVyJzogMTAwIH0sXHJcblx0XHRcdFx0XHRcdHJld2FyZDogeyAnc2NhbGVzJzogMSB9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J2J1eVRlZXRoJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdidXkgdGVldGgnKSxcclxuXHRcdFx0XHRcdFx0Y29zdDogeyAnZnVyJzogMjAwIH0sXHJcblx0XHRcdFx0XHRcdHJld2FyZDogeyAndGVldGgnOiAxIH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnYnV5QmFpdCc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnYnV5IGJhaXQnKSxcclxuXHRcdFx0XHRcdFx0Y29zdDogeyAnZnVyJzogNSB9LFxyXG5cdFx0XHRcdFx0XHRyZXdhcmQ6IHsgJ2JhaXQnOiAxIH0sXHJcblx0XHRcdFx0XHRcdG5vdGlmaWNhdGlvbjogXygndHJhcHMgYXJlIG1vcmUgZWZmZWN0aXZlIHdpdGggYmFpdC4nKVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCdnb29kYnllJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdzYXkgZ29vZGJ5ZScpLFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSwgXHJcblx0eyAvKiBOb2lzZXMgT3V0c2lkZSAgLS0gIGdhaW4gd29vZC9mdXIgKi9cclxuXHRcdHRpdGxlOiBfKCdOb2lzZXMnKSxcclxuXHRcdGlzQXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gUm9vbSAmJiAkU00uZ2V0KCdzdG9yZXMud29vZCcpO1xyXG5cdFx0fSxcclxuXHRcdHNjZW5lczoge1xyXG5cdFx0XHQnc3RhcnQnOiB7XHJcblx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XygndGhyb3VnaCB0aGUgd2FsbHMsIHNodWZmbGluZyBub2lzZXMgY2FuIGJlIGhlYXJkLicpLFxyXG5cdFx0XHRcdFx0XyhcImNhbid0IHRlbGwgd2hhdCB0aGV5J3JlIHVwIHRvLlwiKVxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdFx0bm90aWZpY2F0aW9uOiBfKCdzdHJhbmdlIG5vaXNlcyBjYW4gYmUgaGVhcmQgdGhyb3VnaCB0aGUgd2FsbHMnKSxcclxuXHRcdFx0XHRibGluazogdHJ1ZSxcclxuXHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHQnaW52ZXN0aWdhdGUnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ2ludmVzdGlnYXRlJyksXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogeyAwLjM6ICdzdHVmZicsIDE6ICdub3RoaW5nJyB9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J2lnbm9yZSc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnaWdub3JlIHRoZW0nKSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0J25vdGhpbmcnOiB7XHJcblx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XygndmFndWUgc2hhcGVzIG1vdmUsIGp1c3Qgb3V0IG9mIHNpZ2h0LicpLFxyXG5cdFx0XHRcdFx0XygndGhlIHNvdW5kcyBzdG9wLicpXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHQnYmFja2luc2lkZSc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnZ28gYmFjayBpbnNpZGUnKSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0J3N0dWZmJzoge1xyXG5cdFx0XHRcdHJld2FyZDogeyB3b29kOiAxMDAsIGZ1cjogMTAgfSxcclxuXHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRfKCdhIGJ1bmRsZSBvZiBzdGlja3MgbGllcyBqdXN0IGJleW9uZCB0aGUgdGhyZXNob2xkLCB3cmFwcGVkIGluIGNvYXJzZSBmdXJzLicpLFxyXG5cdFx0XHRcdFx0XygndGhlIG5pZ2h0IGlzIHNpbGVudC4nKVxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0J2JhY2tpbnNpZGUnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ2dvIGJhY2sgaW5zaWRlJyksXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdHsgLyogVGhlIEJlZ2dhciAgLS0gIHRyYWRlIGZ1ciBmb3IgYmV0dGVyIGdvb2QgKi9cclxuXHRcdHRpdGxlOiBfKCdUaGUgQmVnZ2FyJyksXHJcblx0XHRpc0F2YWlsYWJsZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiBFbmdpbmUuYWN0aXZlTW9kdWxlID09IFJvb20gJiYgJFNNLmdldCgnc3RvcmVzLmZ1cicpO1xyXG5cdFx0fSxcclxuXHRcdHNjZW5lczoge1xyXG5cdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdF8oJ2EgYmVnZ2FyIGFycml2ZXMuJyksXHJcblx0XHRcdFx0XHRfKCdhc2tzIGZvciBhbnkgc3BhcmUgZnVycyB0byBrZWVwIGhpbSB3YXJtIGF0IG5pZ2h0LicpXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRub3RpZmljYXRpb246IF8oJ2EgYmVnZ2FyIGFycml2ZXMnKSxcclxuXHRcdFx0XHRibGluazogdHJ1ZSxcclxuXHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHQnNTBmdXJzJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdnaXZlIDUwJyksXHJcblx0XHRcdFx0XHRcdGNvc3Q6IHtmdXI6IDUwfSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7IDAuNTogJ3NjYWxlcycsIDAuODogJ3RlZXRoJywgMTogJ2Nsb3RoJyB9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0JzEwMGZ1cnMnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ2dpdmUgMTAwJyksXHJcblx0XHRcdFx0XHRcdGNvc3Q6IHtmdXI6IDEwMH0sXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogeyAwLjU6ICd0ZWV0aCcsIDAuODogJ3NjYWxlcycsIDE6ICdjbG90aCcgfVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCdkZW55Jzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCd0dXJuIGhpbSBhd2F5JyksXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHNjYWxlczoge1xyXG5cdFx0XHRcdHJld2FyZDogeyBzY2FsZXM6IDIwIH0sXHJcblx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XygndGhlIGJlZ2dhciBleHByZXNzZXMgaGlzIHRoYW5rcy4nKSxcclxuXHRcdFx0XHRcdF8oJ2xlYXZlcyBhIHBpbGUgb2Ygc21hbGwgc2NhbGVzIGJlaGluZC4nKVxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdzYXkgZ29vZGJ5ZScpLFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR0ZWV0aDoge1xyXG5cdFx0XHRcdHJld2FyZDogeyB0ZWV0aDogMjAgfSxcclxuXHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRfKCd0aGUgYmVnZ2FyIGV4cHJlc3NlcyBoaXMgdGhhbmtzLicpLFxyXG5cdFx0XHRcdFx0XygnbGVhdmVzIGEgcGlsZSBvZiBzbWFsbCB0ZWV0aCBiZWhpbmQuJylcclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdCdsZWF2ZSc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnc2F5IGdvb2RieWUnKSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0Y2xvdGg6IHtcclxuXHRcdFx0XHRyZXdhcmQ6IHsgY2xvdGg6IDIwIH0sXHJcblx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XygndGhlIGJlZ2dhciBleHByZXNzZXMgaGlzIHRoYW5rcy4nKSxcclxuXHRcdFx0XHRcdF8oJ2xlYXZlcyBzb21lIHNjcmFwcyBvZiBjbG90aCBiZWhpbmQuJylcclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdCdsZWF2ZSc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnc2F5IGdvb2RieWUnKSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0eyAvKiBUaGUgU2NvdXQgIC0tICBNYXAgTWVyY2hhbnQgKi9cclxuXHRcdHRpdGxlOiBfKCdUaGUgU2NvdXQnKSxcclxuXHRcdGlzQXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gUm9vbSAmJiAkU00uZ2V0KCdmZWF0dXJlcy5sb2NhdGlvbi53b3JsZCcpO1xyXG5cdFx0fSxcclxuXHRcdHNjZW5lczoge1xyXG5cdFx0XHQnc3RhcnQnOiB7XHJcblx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XyhcInRoZSBzY291dCBzYXlzIHNoZSdzIGJlZW4gYWxsIG92ZXIuXCIpLFxyXG5cdFx0XHRcdFx0XyhcIndpbGxpbmcgdG8gdGFsayBhYm91dCBpdCwgZm9yIGEgcHJpY2UuXCIpXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRub3RpZmljYXRpb246IF8oJ2Egc2NvdXQgc3RvcHMgZm9yIHRoZSBuaWdodCcpLFxyXG5cdFx0XHRcdGJsaW5rOiB0cnVlLFxyXG5cdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdCdidXlNYXAnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ2J1eSBtYXAnKSxcclxuXHRcdFx0XHRcdFx0Y29zdDogeyAnZnVyJzogMjAwLCAnc2NhbGVzJzogMTAgfSxcclxuXHRcdFx0XHRcdFx0bm90aWZpY2F0aW9uOiBfKCd0aGUgbWFwIHVuY292ZXJzIGEgYml0IG9mIHRoZSB3b3JsZCcpLFxyXG5cdFx0XHRcdFx0XHQvLyBvbkNob29zZTogV29ybGQuYXBwbHlNYXBcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnbGVhcm4nOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ2xlYXJuIHNjb3V0aW5nJyksXHJcblx0XHRcdFx0XHRcdGNvc3Q6IHsgJ2Z1cic6IDEwMDAsICdzY2FsZXMnOiA1MCwgJ3RlZXRoJzogMjAgfSxcclxuXHRcdFx0XHRcdFx0YXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gISRTTS5oYXNQZXJrKCdzY291dCcpO1xyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0JFNNLmFkZFBlcmsoJ3Njb3V0Jyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnbGVhdmUnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ3NheSBnb29kYnllJyksXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdHsgLyogVGhlIFdhbmRlcmluZyBNYXN0ZXIgKi9cclxuXHRcdHRpdGxlOiBfKCdUaGUgTWFzdGVyJyksXHJcblx0XHRpc0F2YWlsYWJsZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiBFbmdpbmUuYWN0aXZlTW9kdWxlID09IFJvb20gJiYgJFNNLmdldCgnZmVhdHVyZXMubG9jYXRpb24ud29ybGQnKTtcclxuXHRcdH0sXHJcblx0XHRzY2VuZXM6IHtcclxuXHRcdFx0J3N0YXJ0Jzoge1xyXG5cdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdF8oJ2FuIG9sZCB3YW5kZXJlciBhcnJpdmVzLicpLFxyXG5cdFx0XHRcdFx0XygnaGUgc21pbGVzIHdhcm1seSBhbmQgYXNrcyBmb3IgbG9kZ2luZ3MgZm9yIHRoZSBuaWdodC4nKVxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdFx0bm90aWZpY2F0aW9uOiBfKCdhbiBvbGQgd2FuZGVyZXIgYXJyaXZlcycpLFxyXG5cdFx0XHRcdGJsaW5rOiB0cnVlLFxyXG5cdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdCdhZ3JlZSc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnYWdyZWUnKSxcclxuXHRcdFx0XHRcdFx0Y29zdDoge1xyXG5cdFx0XHRcdFx0XHRcdCdjdXJlZCBtZWF0JzogMTAwLFxyXG5cdFx0XHRcdFx0XHRcdCdmdXInOiAxMDAsXHJcblx0XHRcdFx0XHRcdFx0J3RvcmNoJzogMVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnYWdyZWUnfVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCdkZW55Jzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCd0dXJuIGhpbSBhd2F5JyksXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdCdhZ3JlZSc6IHtcclxuXHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRfKCdpbiBleGNoYW5nZSwgdGhlIHdhbmRlcmVyIG9mZmVycyBoaXMgd2lzZG9tLicpXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHQnZXZhc2lvbic6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnZXZhc2lvbicpLFxyXG5cdFx0XHRcdFx0XHRhdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiAhJFNNLmhhc1BlcmsoJ2V2YXNpdmUnKTtcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0b25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdCRTTS5hZGRQZXJrKCdldmFzaXZlJyk7XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQncHJlY2lzaW9uJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdwcmVjaXNpb24nKSxcclxuXHRcdFx0XHRcdFx0YXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gISRTTS5oYXNQZXJrKCdwcmVjaXNlJyk7XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHQkU00uYWRkUGVyaygncHJlY2lzZScpO1xyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J2ZvcmNlJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdmb3JjZScpLFxyXG5cdFx0XHRcdFx0XHRhdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiAhJFNNLmhhc1BlcmsoJ2JhcmJhcmlhbicpO1xyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0JFNNLmFkZFBlcmsoJ2JhcmJhcmlhbicpO1xyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J25vdGhpbmcnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ25vdGhpbmcnKSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXTtcclxuIiwiLyoqXHJcbiAqIE1vZHVsZSB0aGF0IHRha2VzIGNhcmUgb2YgaGVhZGVyIGJ1dHRvbnNcclxuICovXHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuL2VuZ2luZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEhlYWRlciA9IHtcclxuXHRcclxuXHRpbml0OiBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdH0sXHJcblx0XHJcblx0b3B0aW9uczoge30sIC8vIE5vdGhpbmcgZm9yIG5vd1xyXG5cdFxyXG5cdGNhblRyYXZlbDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gJCgnZGl2I2hlYWRlciBkaXYuaGVhZGVyQnV0dG9uJykubGVuZ3RoID4gMTtcclxuXHR9LFxyXG5cdFxyXG5cdGFkZExvY2F0aW9uOiBmdW5jdGlvbih0ZXh0LCBpZCwgbW9kdWxlKSB7XHJcblx0XHRyZXR1cm4gJCgnPGRpdj4nKS5hdHRyKCdpZCcsIFwibG9jYXRpb25fXCIgKyBpZClcclxuXHRcdFx0LmFkZENsYXNzKCdoZWFkZXJCdXR0b24nKVxyXG5cdFx0XHQudGV4dCh0ZXh0KS5jbGljayhmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZihIZWFkZXIuY2FuVHJhdmVsKCkpIHtcclxuXHRcdFx0XHRcdEVuZ2luZS50cmF2ZWxUbyhtb2R1bGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSkuYXBwZW5kVG8oJCgnZGl2I2hlYWRlcicpKTtcclxuXHR9XHJcbn07IiwiLyoqXHJcbiAqIE1vZHVsZSB0aGF0IHJlZ2lzdGVycyB0aGUgbm90aWZpY2F0aW9uIGJveCBhbmQgaGFuZGxlcyBtZXNzYWdlc1xyXG4gKi9cclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4vZW5naW5lXCI7XHJcblxyXG5leHBvcnQgY29uc3QgTm90aWZpY2F0aW9ucyA9IHtcclxuXHRcdFxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdFx0XHJcblx0XHQvLyBDcmVhdGUgdGhlIG5vdGlmaWNhdGlvbnMgYm94XHJcblx0XHRjb25zdCBlbGVtID0gJCgnPGRpdj4nKS5hdHRyKHtcclxuXHRcdFx0aWQ6ICdub3RpZmljYXRpb25zJyxcclxuXHRcdFx0Y2xhc3NOYW1lOiAnbm90aWZpY2F0aW9ucydcclxuXHRcdH0pO1xyXG5cdFx0Ly8gQ3JlYXRlIHRoZSB0cmFuc3BhcmVuY3kgZ3JhZGllbnRcclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnbm90aWZ5R3JhZGllbnQnKS5hcHBlbmRUbyhlbGVtKTtcclxuXHRcdFxyXG5cdFx0ZWxlbS5hcHBlbmRUbygnZGl2I3dyYXBwZXInKTtcclxuXHR9LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHt9LCAvLyBOb3RoaW5nIGZvciBub3dcclxuXHRcclxuXHRlbGVtOiBudWxsLFxyXG5cdFxyXG5cdG5vdGlmeVF1ZXVlOiB7fSxcclxuXHRcclxuXHQvLyBBbGxvdyBub3RpZmljYXRpb24gdG8gdGhlIHBsYXllclxyXG5cdG5vdGlmeTogZnVuY3Rpb24obW9kdWxlLCB0ZXh0LCBub1F1ZXVlPykge1xyXG5cdFx0aWYodHlwZW9mIHRleHQgPT0gJ3VuZGVmaW5lZCcpIHJldHVybjtcclxuXHRcdC8vIEkgZG9uJ3QgbmVlZCB5b3UgcHVuY3R1YXRpbmcgZm9yIG1lLCBmdW5jdGlvbi5cclxuXHRcdC8vIGlmKHRleHQuc2xpY2UoLTEpICE9IFwiLlwiKSB0ZXh0ICs9IFwiLlwiO1xyXG5cdFx0aWYobW9kdWxlICE9IG51bGwgJiYgRW5naW5lLmFjdGl2ZU1vZHVsZSAhPSBtb2R1bGUpIHtcclxuXHRcdFx0aWYoIW5vUXVldWUpIHtcclxuXHRcdFx0XHRpZih0eXBlb2YgdGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdID09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0XHR0aGlzLm5vdGlmeVF1ZXVlW21vZHVsZV0gPSBbXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdLnB1c2godGV4dCk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdE5vdGlmaWNhdGlvbnMucHJpbnRNZXNzYWdlKHRleHQpO1xyXG5cdFx0fVxyXG5cdFx0RW5naW5lLnNhdmVHYW1lKCk7XHJcblx0fSxcclxuXHRcclxuXHRjbGVhckhpZGRlbjogZnVuY3Rpb24oKSB7XHJcblx0XHJcblx0XHQvLyBUbyBmaXggc29tZSBtZW1vcnkgdXNhZ2UgaXNzdWVzLCB3ZSBjbGVhciBub3RpZmljYXRpb25zIHRoYXQgaGF2ZSBiZWVuIGhpZGRlbi5cclxuXHRcdFxyXG5cdFx0Ly8gV2UgdXNlIHBvc2l0aW9uKCkudG9wIGhlcmUsIGJlY2F1c2Ugd2Uga25vdyB0aGF0IHRoZSBwYXJlbnQgd2lsbCBiZSB0aGUgc2FtZSwgc28gdGhlIHBvc2l0aW9uIHdpbGwgYmUgdGhlIHNhbWUuXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHR2YXIgYm90dG9tID0gJCgnI25vdGlmeUdyYWRpZW50JykucG9zaXRpb24oKS50b3AgKyAkKCcjbm90aWZ5R3JhZGllbnQnKS5vdXRlckhlaWdodCh0cnVlKTtcclxuXHRcdFxyXG5cdFx0JCgnLm5vdGlmaWNhdGlvbicpLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcclxuXHRcdFx0aWYoJCh0aGlzKS5wb3NpdGlvbigpLnRvcCA+IGJvdHRvbSl7XHJcblx0XHRcdFx0JCh0aGlzKS5yZW1vdmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdH0sXHJcblx0XHJcblx0cHJpbnRNZXNzYWdlOiBmdW5jdGlvbih0KSB7XHJcblx0XHR2YXIgdGV4dCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ25vdGlmaWNhdGlvbicpLmNzcygnb3BhY2l0eScsICcwJykudGV4dCh0KS5wcmVwZW5kVG8oJ2RpdiNub3RpZmljYXRpb25zJyk7XHJcblx0XHR0ZXh0LmFuaW1hdGUoe29wYWNpdHk6IDF9LCA1MDAsICdsaW5lYXInLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly8gRG8gdGhpcyBldmVyeSB0aW1lIHdlIGFkZCBhIG5ldyBtZXNzYWdlLCB0aGlzIHdheSB3ZSBuZXZlciBoYXZlIGEgbGFyZ2UgYmFja2xvZyB0byBpdGVyYXRlIHRocm91Z2guIEtlZXBzIHRoaW5ncyBmYXN0ZXIuXHJcblx0XHRcdE5vdGlmaWNhdGlvbnMuY2xlYXJIaWRkZW4oKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0XHJcblx0cHJpbnRRdWV1ZTogZnVuY3Rpb24obW9kdWxlKSB7XHJcblx0XHRpZih0eXBlb2YgdGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdICE9ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdHdoaWxlKHRoaXMubm90aWZ5UXVldWVbbW9kdWxlXS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9ucy5wcmludE1lc3NhZ2UodGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdLnNoaWZ0KCkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCB7IEVuZ2luZSB9IGZyb20gJy4uL2VuZ2luZSc7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gJy4uL3N0YXRlX21hbmFnZXInO1xyXG5pbXBvcnQgeyBXZWF0aGVyIH0gZnJvbSAnLi4vd2VhdGhlcic7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCB7IENhcHRhaW4gfSBmcm9tICcuLi9jaGFyYWN0ZXJzL2NhcHRhaW4nO1xyXG5pbXBvcnQgeyBIZWFkZXIgfSBmcm9tICcuLi9oZWFkZXInO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSAnLi4vLi4vbGliL3RyYW5zbGF0ZSc7XHJcblxyXG5leHBvcnQgY29uc3QgT3V0cG9zdCA9IHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBPdXRwb3N0IHRhYlxyXG4gICAgICAgIHRoaXMudGFiID0gSGVhZGVyLmFkZExvY2F0aW9uKF8oXCJUaGUgT3V0cG9zdFwiKSwgXCJvdXRwb3N0XCIsIE91dHBvc3QpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgdGhlIE91dHBvc3QgcGFuZWxcclxuXHRcdHRoaXMucGFuZWwgPSAkKCc8ZGl2PicpXHJcbiAgICAgICAgLmF0dHIoJ2lkJywgXCJvdXRwb3N0UGFuZWxcIilcclxuICAgICAgICAuYWRkQ2xhc3MoJ2xvY2F0aW9uJylcclxuICAgICAgICAuYXBwZW5kVG8oJ2RpdiNsb2NhdGlvblNsaWRlcicpO1xyXG5cclxuICAgICAgICBFbmdpbmUudXBkYXRlU2xpZGVyKCk7XHJcblxyXG4gICAgICAgIC8vIG5ldyBcclxuXHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogJ2NhcHRhaW5CdXR0b24nLFxyXG5cdFx0XHR0ZXh0OiBfKCdTcGVhayB3aXRoIFRoZSBDYXB0YWluJyksXHJcblx0XHRcdGNsaWNrOiBDYXB0YWluLnRhbGtUb0NhcHRhaW4sXHJcblx0XHRcdHdpZHRoOiAnODBweCdcclxuXHRcdH0pLmFwcGVuZFRvKCdkaXYjb3V0cG9zdFBhbmVsJyk7XHJcblxyXG4gICAgICAgIE91dHBvc3QudXBkYXRlQnV0dG9uKCk7XHJcblxyXG4gICAgICAgIC8vIHNldHRpbmcgdGhpcyBzZXBhcmF0ZWx5IHNvIHRoYXQgcXVlc3Qgc3RhdHVzIGNhbid0IGFjY2lkZW50YWxseSBicmVhayBpdCBsYXRlclxyXG4gICAgICAgICRTTS5zZXQoJ291dHBvc3Qub3BlbicsIDEpOyBcclxuICAgIH0sXHJcblxyXG4gICAgYXZhaWxhYmxlV2VhdGhlcjoge1xyXG5cdFx0J3N1bm55JzogMC40LFxyXG5cdFx0J2Nsb3VkeSc6IDAuMyxcclxuXHRcdCdyYWlueSc6IDAuM1xyXG5cdH0sXHJcblxyXG4gICAgb25BcnJpdmFsOiBmdW5jdGlvbih0cmFuc2l0aW9uX2RpZmYpIHtcclxuICAgICAgICBPdXRwb3N0LnNldFRpdGxlKCk7XHJcblxyXG5cdFx0RW5naW5lLm1vdmVTdG9yZXNWaWV3KG51bGwsIHRyYW5zaXRpb25fZGlmZik7XHJcblxyXG4gICAgICAgIFdlYXRoZXIuaW5pdGlhdGVXZWF0aGVyKE91dHBvc3QuYXZhaWxhYmxlV2VhdGhlciwgJ291dHBvc3QnKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0VGl0bGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRpdGxlID0gXyhcIlRoZSBPdXRwb3N0XCIpO1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSB0aGlzKSB7XHJcblx0XHRcdGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XHJcblx0XHR9XHJcblx0XHQkKCdkaXYjbG9jYXRpb25fb3V0cG9zdCcpLnRleHQodGl0bGUpO1xyXG5cdH0sXHJcblxyXG4gICAgdXBkYXRlQnV0dG9uOiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIGNvbmRpdGlvbmFscyBmb3IgdXBkYXRpbmcgYnV0dG9uc1xyXG5cdH0sXHJcblxyXG4gICAgLy8gZG9uJ3QgbmVlZCB0aGlzIHlldCAob3IgbWF5YmUgZXZlcilcclxuXHQvLyB3YW5kZXJFdmVudDogZnVuY3Rpb24oKSB7XHJcblx0Ly8gXHRFdmVudHMudHJpZ2dlckxvY2F0aW9uRXZlbnQoJ091dHBvc3RXYW5kZXInKTtcclxuXHQvLyBcdCRTTS5hZGQoJ091dHBvc3QuY291bnRlcicsIDEpO1xyXG5cdC8vIH1cclxufSIsImltcG9ydCB7IEhlYWRlciB9IGZyb20gXCIuLi9oZWFkZXJcIjtcclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4uL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi4vQnV0dG9uXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyBXZWF0aGVyIH0gZnJvbSBcIi4uL3dlYXRoZXJcIjtcclxuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IFJvYWQgPSB7XHJcbiAgICBpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgUm9hZCB0YWJcclxuICAgICAgICB0aGlzLnRhYiA9IEhlYWRlci5hZGRMb2NhdGlvbihfKFwiUm9hZCB0byB0aGUgT3V0cG9zdFwiKSwgXCJyb2FkXCIsIFJvYWQpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgdGhlIFJvYWQgcGFuZWxcclxuXHRcdHRoaXMucGFuZWwgPSAkKCc8ZGl2PicpXHJcbiAgICAgICAgLmF0dHIoJ2lkJywgXCJyb2FkUGFuZWxcIilcclxuICAgICAgICAuYWRkQ2xhc3MoJ2xvY2F0aW9uJylcclxuICAgICAgICAuYXBwZW5kVG8oJ2RpdiNsb2NhdGlvblNsaWRlcicpO1xyXG5cclxuICAgICAgICBFbmdpbmUudXBkYXRlU2xpZGVyKCk7XHJcblxyXG4gICAgICAgIC8vbmV3IFxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAnd2FuZGVyQnV0dG9uJyxcclxuXHRcdFx0dGV4dDogXygnV2FuZGVyIEFyb3VuZCcpLFxyXG5cdFx0XHRjbGljazogUm9hZC53YW5kZXJFdmVudCxcclxuXHRcdFx0d2lkdGg6ICc4MHB4JyxcclxuXHRcdFx0Y29zdDoge30gLy8gVE9ETzogbWFrZSB0aGVyZSBiZSBhIGNvc3QgdG8gZG9pbmcgc3R1ZmY/XHJcblx0XHR9KS5hcHBlbmRUbygnZGl2I3JvYWRQYW5lbCcpO1xyXG5cclxuICAgICAgICBSb2FkLnVwZGF0ZUJ1dHRvbigpO1xyXG5cclxuICAgICAgICAvLyBzZXR0aW5nIHRoaXMgc2VwYXJhdGVseSBzbyB0aGF0IHF1ZXN0IHN0YXR1cyBjYW4ndCBhY2NpZGVudGFsbHkgYnJlYWsgaXQgbGF0ZXJcclxuICAgICAgICAkU00uc2V0KCdyb2FkLm9wZW4nLCAxKTsgXHJcbiAgICB9LFxyXG5cclxuICAgIGF2YWlsYWJsZVdlYXRoZXI6IHtcclxuXHRcdCdzdW5ueSc6IDAuNCxcclxuXHRcdCdjbG91ZHknOiAwLjMsXHJcblx0XHQncmFpbnknOiAwLjNcclxuXHR9LFxyXG5cclxuICAgIG9uQXJyaXZhbDogZnVuY3Rpb24odHJhbnNpdGlvbl9kaWZmKSB7XHJcbiAgICAgICAgUm9hZC5zZXRUaXRsZSgpO1xyXG5cclxuXHRcdEVuZ2luZS5tb3ZlU3RvcmVzVmlldyhudWxsLCB0cmFuc2l0aW9uX2RpZmYpO1xyXG5cclxuICAgICAgICBXZWF0aGVyLmluaXRpYXRlV2VhdGhlcihSb2FkLmF2YWlsYWJsZVdlYXRoZXIsICdyb2FkJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldFRpdGxlOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0aXRsZSA9IF8oXCJSb2FkIHRvIHRoZSBPdXRwb3N0XCIpO1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSB0aGlzKSB7XHJcblx0XHRcdGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XHJcblx0XHR9XHJcblx0XHQkKCdkaXYjbG9jYXRpb25fcm9hZCcpLnRleHQodGl0bGUpO1xyXG5cdH0sXHJcblxyXG4gICAgdXBkYXRlQnV0dG9uOiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIGNvbmRpdGlvbmFscyBmb3IgdXBkYXRpbmcgYnV0dG9uc1xyXG5cdH0sXHJcblxyXG5cdHdhbmRlckV2ZW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy50cmlnZ2VyTG9jYXRpb25FdmVudCgnUm9hZFdhbmRlcicpO1xyXG5cdFx0JFNNLmFkZCgnUm9hZC5jb3VudGVyJywgMSk7XHJcblx0fVxyXG59IiwiLyoqXHJcbiAqIE1vZHVsZSB0aGF0IHJlZ2lzdGVycyB0aGUgc2ltcGxlIHJvb20gZnVuY3Rpb25hbGl0eVxyXG4gKi9cclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4uL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi4vQnV0dG9uXCI7XHJcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tIFwiLi4vbm90aWZpY2F0aW9uc1wiO1xyXG5pbXBvcnQgeyBXZWF0aGVyIH0gZnJvbSBcIi4uL3dlYXRoZXJcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IEhlYWRlciB9IGZyb20gXCIuLi9oZWFkZXJcIjtcclxuaW1wb3J0IHsgTGl6IH0gZnJvbSBcIi4uL2NoYXJhY3RlcnMvbGl6XCI7XHJcbmltcG9ydCB7IE1heW9yIH0gZnJvbSBcIi4uL2NoYXJhY3RlcnMvbWF5b3JcIjtcclxuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IFJvb20gPSB7XHJcblx0Ly8gdGltZXMgaW4gKG1pbnV0ZXMgKiBzZWNvbmRzICogbWlsbGlzZWNvbmRzKVxyXG5cdF9GSVJFX0NPT0xfREVMQVk6IDUgKiA2MCAqIDEwMDAsIC8vIHRpbWUgYWZ0ZXIgYSBzdG9rZSBiZWZvcmUgdGhlIGZpcmUgY29vbHNcclxuXHRfUk9PTV9XQVJNX0RFTEFZOiAzMCAqIDEwMDAsIC8vIHRpbWUgYmV0d2VlbiByb29tIHRlbXBlcmF0dXJlIHVwZGF0ZXNcclxuXHRfQlVJTERFUl9TVEFURV9ERUxBWTogMC41ICogNjAgKiAxMDAwLCAvLyB0aW1lIGJldHdlZW4gYnVpbGRlciBzdGF0ZSB1cGRhdGVzXHJcblx0X1NUT0tFX0NPT0xET1dOOiAxMCwgLy8gY29vbGRvd24gdG8gc3Rva2UgdGhlIGZpcmVcclxuXHRfTkVFRF9XT09EX0RFTEFZOiAxNSAqIDEwMDAsIC8vIGZyb20gd2hlbiB0aGUgc3RyYW5nZXIgc2hvd3MgdXAsIHRvIHdoZW4geW91IG5lZWQgd29vZFxyXG5cdFxyXG5cdGJ1dHRvbnM6e30sXHJcblx0XHJcblx0Y2hhbmdlZDogZmFsc2UsXHJcblx0XHJcblx0bmFtZTogXyhcIlJvb21cIiksXHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblx0XHRcclxuXHRcdGlmKEVuZ2luZS5fZGVidWcpIHtcclxuXHRcdFx0dGhpcy5fUk9PTV9XQVJNX0RFTEFZID0gNTAwMDtcclxuXHRcdFx0dGhpcy5fQlVJTERFUl9TVEFURV9ERUxBWSA9IDUwMDA7XHJcblx0XHRcdHRoaXMuX1NUT0tFX0NPT0xET1dOID0gMDtcclxuXHRcdFx0dGhpcy5fTkVFRF9XT09EX0RFTEFZID0gNTAwMDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gQ3JlYXRlIHRoZSByb29tIHRhYlxyXG5cdFx0dGhpcy50YWIgPSBIZWFkZXIuYWRkTG9jYXRpb24oXyhcIkEgQ2hpbGwgVmlsbGFnZVwiKSwgXCJyb29tXCIsIFJvb20pO1xyXG5cdFx0XHJcblx0XHQvLyBDcmVhdGUgdGhlIFJvb20gcGFuZWxcclxuXHRcdHRoaXMucGFuZWwgPSAkKCc8ZGl2PicpXHJcblx0XHRcdC5hdHRyKCdpZCcsIFwicm9vbVBhbmVsXCIpXHJcblx0XHRcdC5hZGRDbGFzcygnbG9jYXRpb24nKVxyXG5cdFx0XHQuYXBwZW5kVG8oJ2RpdiNsb2NhdGlvblNsaWRlcicpO1xyXG5cdFx0XHJcblx0XHRFbmdpbmUudXBkYXRlU2xpZGVyKCk7XHJcblxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAndGFsa0J1dHRvbicsXHJcblx0XHRcdHRleHQ6IF8oJ1RhbGsgdG8gdGhlIE1heW9yJyksXHJcblx0XHRcdGNsaWNrOiBNYXlvci50YWxrVG9NYXlvcixcclxuXHRcdFx0d2lkdGg6ICc4MHB4JyxcclxuXHRcdFx0Y29zdDoge31cclxuXHRcdH0pLmFwcGVuZFRvKCdkaXYjcm9vbVBhbmVsJyk7XHJcblxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAnbGl6QnV0dG9uJyxcclxuXHRcdFx0dGV4dDogXygnVGFsayB0byBMaXonKSxcclxuXHRcdFx0Y2xpY2s6IExpei50YWxrVG9MaXosXHJcblx0XHRcdHdpZHRoOiAnODBweCcsXHJcblx0XHRcdGNvc3Q6IHt9XHJcblx0XHR9KS5hcHBlbmRUbygnZGl2I3Jvb21QYW5lbCcpO1xyXG5cclxuXHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogJ25ld0J1aWxkaW5nQnV0dG9uJyxcclxuXHRcdFx0dGV4dDogXygnQ2hlY2sgb3V0IHRoZSBuZXcgYnVpbGRpbmcnKSxcclxuXHRcdFx0Y2xpY2s6IFJvb20udGVtcEJ1aWxkaW5nTWVzc2FnZSxcclxuXHRcdFx0d2lkdGg6ICc4MHB4JyxcclxuXHRcdFx0Y29zdDoge31cclxuXHRcdH0pLmFwcGVuZFRvKCdkaXYjcm9vbVBhbmVsJyk7XHJcblxyXG5cdFx0dmFyIGJ1aWxkaW5nQnV0dG9uID0gJCgnI25ld0J1aWxkaW5nQnV0dG9uLmJ1dHRvbicpO1xyXG5cdFx0YnVpbGRpbmdCdXR0b24uaGlkZSgpO1xyXG5cclxuXHRcdHZhciBsaXpCdXR0b24gPSAkKCcjbGl6QnV0dG9uLmJ1dHRvbicpO1xyXG5cdFx0bGl6QnV0dG9uLmhpZGUoKTtcclxuXHRcdFxyXG5cdFx0Ly8gQ3JlYXRlIHRoZSBzdG9yZXMgY29udGFpbmVyXHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ3N0b3Jlc0NvbnRhaW5lcicpLmFwcGVuZFRvKCdkaXYjcm9vbVBhbmVsJyk7XHJcblx0XHRcclxuXHRcdC8vc3Vic2NyaWJlIHRvIHN0YXRlVXBkYXRlc1xyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5zdWJzY3JpYmUoUm9vbS5oYW5kbGVTdGF0ZVVwZGF0ZXMpO1xyXG5cdFx0XHJcblx0XHRSb29tLnVwZGF0ZUJ1dHRvbigpO1xyXG5cdH0sXHJcblx0XHJcblx0b3B0aW9uczoge30sIC8vIE5vdGhpbmcgZm9yIG5vd1xyXG5cclxuXHRhdmFpbGFibGVXZWF0aGVyOiB7XHJcblx0XHQnc3VubnknOiAwLjQsXHJcblx0XHQnY2xvdWR5JzogMC4zLFxyXG5cdFx0J3JhaW55JzogMC4zXHJcblx0fSxcclxuXHRcclxuXHRvbkFycml2YWw6IGZ1bmN0aW9uKHRyYW5zaXRpb25fZGlmZikge1xyXG5cdFx0Um9vbS5zZXRUaXRsZSgpO1xyXG5cdFx0aWYoJFNNLmdldCgnZ2FtZS5idWlsZGVyLmxldmVsJykgPT0gMykge1xyXG5cdFx0XHQkU00uYWRkKCdnYW1lLmJ1aWxkZXIubGV2ZWwnLCAxKTtcclxuXHRcdFx0JFNNLnNldEluY29tZSgnYnVpbGRlcicsIHtcclxuXHRcdFx0XHRkZWxheTogMTAsXHJcblx0XHRcdFx0c3RvcmVzOiB7J3dvb2QnIDogMiB9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHROb3RpZmljYXRpb25zLm5vdGlmeShSb29tLCBfKFwidGhlIHN0cmFuZ2VyIGlzIHN0YW5kaW5nIGJ5IHRoZSBmaXJlLiBzaGUgc2F5cyBzaGUgY2FuIGhlbHAuIHNheXMgc2hlIGJ1aWxkcyB0aGluZ3MuXCIpKTtcclxuXHRcdH1cclxuXHJcblx0XHRFbmdpbmUubW92ZVN0b3Jlc1ZpZXcobnVsbCwgdHJhbnNpdGlvbl9kaWZmKTtcclxuXHJcblx0XHRXZWF0aGVyLmluaXRpYXRlV2VhdGhlcihSb29tLmF2YWlsYWJsZVdlYXRoZXIsICdyb29tJyk7XHJcblx0fSxcclxuXHRcclxuXHRUZW1wRW51bToge1xyXG5cdFx0ZnJvbUludDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdFx0Zm9yKHZhciBrIGluIHRoaXMpIHtcclxuXHRcdFx0XHRpZih0eXBlb2YgdGhpc1trXS52YWx1ZSAhPSAndW5kZWZpbmVkJyAmJiB0aGlzW2tdLnZhbHVlID09IHZhbHVlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpc1trXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9LFxyXG5cdFx0RnJlZXppbmc6IHsgdmFsdWU6IDAsIHRleHQ6IF8oJ2ZyZWV6aW5nJykgfSxcclxuXHRcdENvbGQ6IHsgdmFsdWU6IDEsIHRleHQ6IF8oJ2NvbGQnKSB9LFxyXG5cdFx0TWlsZDogeyB2YWx1ZTogMiwgdGV4dDogXygnbWlsZCcpIH0sXHJcblx0XHRXYXJtOiB7IHZhbHVlOiAzLCB0ZXh0OiBfKCd3YXJtJykgfSxcclxuXHRcdEhvdDogeyB2YWx1ZTogNCwgdGV4dDogXygnaG90JykgfVxyXG5cdH0sXHJcblx0XHJcblx0RmlyZUVudW06IHtcclxuXHRcdGZyb21JbnQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRcdGZvcih2YXIgayBpbiB0aGlzKSB7XHJcblx0XHRcdFx0aWYodHlwZW9mIHRoaXNba10udmFsdWUgIT0gJ3VuZGVmaW5lZCcgJiYgdGhpc1trXS52YWx1ZSA9PSB2YWx1ZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXNba107XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fSxcclxuXHRcdERlYWQ6IHsgdmFsdWU6IDAsIHRleHQ6IF8oJ2RlYWQnKSB9LFxyXG5cdFx0U21vbGRlcmluZzogeyB2YWx1ZTogMSwgdGV4dDogXygnc21vbGRlcmluZycpIH0sXHJcblx0XHRGbGlja2VyaW5nOiB7IHZhbHVlOiAyLCB0ZXh0OiBfKCdmbGlja2VyaW5nJykgfSxcclxuXHRcdEJ1cm5pbmc6IHsgdmFsdWU6IDMsIHRleHQ6IF8oJ2J1cm5pbmcnKSB9LFxyXG5cdFx0Um9hcmluZzogeyB2YWx1ZTogNCwgdGV4dDogXygncm9hcmluZycpIH1cclxuXHR9LFxyXG5cdFxyXG5cdHNldFRpdGxlOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0aXRsZSA9IF8oXCJUaGUgVmlsbGFnZVwiKTtcclxuXHRcdGlmKEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gdGhpcykge1xyXG5cdFx0XHRkb2N1bWVudC50aXRsZSA9IHRpdGxlO1xyXG5cdFx0fVxyXG5cdFx0JCgnZGl2I2xvY2F0aW9uX3Jvb20nKS50ZXh0KHRpdGxlKTtcclxuXHR9LFxyXG5cdFxyXG5cdHVwZGF0ZUJ1dHRvbjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgbGlnaHQgPSAkKCcjbGlnaHRCdXR0b24uYnV0dG9uJyk7XHJcblx0XHR2YXIgc3Rva2UgPSAkKCcjc3Rva2VCdXR0b24uYnV0dG9uJyk7XHJcblx0XHRpZigkU00uZ2V0KCdnYW1lLmZpcmUudmFsdWUnKSA9PSBSb29tLkZpcmVFbnVtLkRlYWQudmFsdWUgJiYgc3Rva2UuY3NzKCdkaXNwbGF5JykgIT0gJ25vbmUnKSB7XHJcblx0XHRcdHN0b2tlLmhpZGUoKTtcclxuXHRcdFx0bGlnaHQuc2hvdygpO1xyXG5cdFx0XHRpZihzdG9rZS5oYXNDbGFzcygnZGlzYWJsZWQnKSkge1xyXG5cdFx0XHRcdEJ1dHRvbi5jb29sZG93bihsaWdodCk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZihsaWdodC5jc3MoJ2Rpc3BsYXknKSAhPSAnbm9uZScpIHtcclxuXHRcdFx0c3Rva2Uuc2hvdygpO1xyXG5cdFx0XHRsaWdodC5oaWRlKCk7XHJcblx0XHRcdGlmKGxpZ2h0Lmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XHJcblx0XHRcdFx0QnV0dG9uLmNvb2xkb3duKHN0b2tlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZighJFNNLmdldCgnc3RvcmVzLndvb2QnKSkge1xyXG5cdFx0XHRsaWdodC5hZGRDbGFzcygnZnJlZScpO1xyXG5cdFx0XHRzdG9rZS5hZGRDbGFzcygnZnJlZScpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bGlnaHQucmVtb3ZlQ2xhc3MoJ2ZyZWUnKTtcclxuXHRcdFx0c3Rva2UucmVtb3ZlQ2xhc3MoJ2ZyZWUnKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgbGl6QnV0dG9uID0gJCgnI2xpekJ1dHRvbi5idXR0b24nKTtcclxuXHRcdGlmKCRTTS5nZXQoJ3ZpbGxhZ2UubGl6QWN0aXZlJykpIGxpekJ1dHRvbi5zaG93KCk7XHJcblx0XHR2YXIgYnVpbGRpbmdCdXR0b24gPSAkKCcjbmV3QnVpbGRpbmdCdXR0b24uYnV0dG9uJyk7XHJcblx0XHRpZigkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykpIGJ1aWxkaW5nQnV0dG9uLnNob3coKTtcclxuXHR9LFxyXG5cdFxyXG5cdFxyXG5cdGhhbmRsZVN0YXRlVXBkYXRlczogZnVuY3Rpb24oZSl7XHJcblx0XHRpZihlLmNhdGVnb3J5ID09ICdzdG9yZXMnKXtcclxuXHRcdFx0Ly8gUm9vbS51cGRhdGVCdWlsZEJ1dHRvbnMoKTtcclxuXHRcdH0gZWxzZSBpZihlLmNhdGVnb3J5ID09ICdpbmNvbWUnKXtcclxuXHRcdH0gZWxzZSBpZihlLnN0YXRlTmFtZS5pbmRleE9mKCdnYW1lLmJ1aWxkaW5ncycpID09PSAwKXtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHR0ZW1wQnVpbGRpbmdNZXNzYWdlOiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0XHRcdHRpdGxlOiBfKCdBIE5ldyBCdWlsZGluZycpLFxyXG5cdFx0XHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnbWFpbicsXHJcblx0XHRcdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRcdFx0XygnVGhpcyBpcyBhIG5ldyBidWlsZGluZy4gVGhlcmUgc2hvdWxkIGJlIHN0dWZmIGluIGl0LCBidXQgdGhpcyBpcyBhIHBsYWNlaG9sZGVyIGZvciBub3cuJyksXHJcblx0XHRcdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdFx0XHQnbGVhdmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0xhbWUnKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcbn07XHJcbiIsImltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi9CdXR0b25cIjtcclxuaW1wb3J0IHsgSXRlbUxpc3QgfSBmcm9tIFwiLi9pdGVtTGlzdFwiO1xyXG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tIFwiLi4vbm90aWZpY2F0aW9uc1wiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgUXVlc3RMb2cgfSBmcm9tIFwiLi9xdWVzdExvZ1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IENoYXJhY3RlciA9IHtcclxuXHRpbnZlbnRvcnk6IHt9LCAvLyBkaWN0aW9uYXJ5IHVzaW5nIGl0ZW0gbmFtZSBhcyBrZXlcclxuXHRxdWVzdFN0YXR1czoge30sIC8vIGRpY3Rpb25hcnkgdXNpbmcgcXVlc3QgbmFtZSBhcyBrZXksIGFuZCBpbnRlZ2VyIHF1ZXN0IHBoYXNlIGFzIHZhbHVlXHJcblx0ZXF1aXBwZWRJdGVtczoge1xyXG5cdFx0Ly8gc3RlYWxpbmcgdGhlIEtvTCBzdHlsZSBmb3Igbm93LCB3ZSdsbCBzZWUgaWYgSSBuZWVkIHNvbWV0aGluZ1xyXG5cdFx0Ly8gdGhhdCBmaXRzIHRoZSBnYW1lIGJldHRlciBhcyB3ZSBnb1xyXG5cdFx0aGVhZDogbnVsbCxcclxuXHRcdHRvcnNvOiBudWxsLFxyXG5cdFx0cGFudHM6IG51bGwsXHJcblx0XHQvLyBubyB3ZWFwb24sIHRyeSB0byBzZWUgaG93IGZhciB3ZSBjYW4gZ2V0IGluIHRoaXMgZ2FtZSB3aXRob3V0IGZvY3VzaW5nIG9uIGNvbWJhdFxyXG5cdFx0YWNjZXNzb3J5MTogbnVsbCxcclxuXHRcdGFjY2Vzc29yeTI6IG51bGwsXHJcblx0XHRhY2Nlc3NvcnkzOiBudWxsLFxyXG5cdH0sXHJcblxyXG5cdC8vIHN0YXRzIGJlZm9yZSBhbnkgbW9kaWZpZXJzIGZyb20gZ2VhciBvciB3aGF0ZXZlciBlbHNlIGFyZSBhcHBsaWVkXHJcblx0cmF3U3RhdHM6IHtcclxuXHRcdCdTcGVlZCc6IDUsXHJcblx0XHQnUGVyY2VwdGlvbic6IDUsXHJcblx0XHQnUmVzaWxpZW5jZSc6IDUsXHJcblx0XHQnSW5nZW51aXR5JzogNSxcclxuXHRcdCdUb3VnaG5lc3MnOiA1XHJcblx0fSxcclxuXHJcblx0Ly8gcGVya3MgZ2l2ZW4gYnkgaXRlbXMsIGNoYXJhY3RlciBjaG9pY2VzLCBkaXZpbmUgcHJvdmVuYW5jZSwgZXRjLlxyXG5cdHBlcmtzOiB7IH0sXHJcblx0XHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblx0XHRcclxuXHRcdC8vIGNyZWF0ZSB0aGUgY2hhcmFjdGVyIGJveFxyXG5cdFx0Y29uc3QgZWxlbSA9ICQoJzxkaXY+JykuYXR0cih7XHJcblx0XHRcdGlkOiAnY2hhcmFjdGVyJyxcclxuXHRcdFx0Y2xhc3NOYW1lOiAnY2hhcmFjdGVyJ1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdGVsZW0uYXBwZW5kVG8oJ2RpdiN3cmFwcGVyJyk7XHJcblxyXG5cdFx0Ly8gd3JpdGUgcmF3U3RhdHMgdG8gJFNNXHJcblx0XHQvLyBOT1RFOiBuZXZlciB3cml0ZSBkZXJpdmVkIHN0YXRzIHRvICRTTSwgYW5kIG5ldmVyIGFjY2VzcyByYXcgc3RhdHMgZGlyZWN0bHkhXHJcblx0XHQvLyBkb2luZyBzbyB3aWxsIGludHJvZHVjZSBvcHBvcnR1bml0aWVzIHRvIG1lc3MgdXAgc3RhdHMgUEVSTUFORU5UTFlcclxuICAgICAgICBpZiAoISRTTS5nZXQoJ2NoYXJhY3Rlci5yYXdzdGF0cycpKSB7XHJcbiAgICAgICAgICAgICRTTS5zZXQoJ2NoYXJhY3Rlci5yYXdzdGF0cycsIENoYXJhY3Rlci5yYXdTdGF0cyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHRcdFx0Q2hhcmFjdGVyLnJhd1N0YXRzID0gJFNNLmdldCgnY2hhcmFjdGVyLnJhd1N0YXRzJykgYXMgYW55O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghJFNNLmdldCgnY2hhcmFjdGVyLnBlcmtzJykpIHtcclxuICAgICAgICAgICAgJFNNLnNldCgnY2hhcmFjdGVyLnBlcmtzJywgQ2hhcmFjdGVyLnBlcmtzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cdFx0XHRDaGFyYWN0ZXIucGVya3MgPSAkU00uZ2V0KCdjaGFyYWN0ZXIucGVya3MnKSBhcyBhbnk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCEkU00uZ2V0KCdjaGFyYWN0ZXIuaW52ZW50b3J5JykpIHtcclxuICAgICAgICAgICAgJFNNLnNldCgnY2hhcmFjdGVyLmludmVudG9yeScsIENoYXJhY3Rlci5pbnZlbnRvcnkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5pbnZlbnRvcnkgPSAkU00uZ2V0KCdjaGFyYWN0ZXIuaW52ZW50b3J5JykgYXMgYW55O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghJFNNLmdldCgnY2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMnKSkge1xyXG4gICAgICAgICAgICAkU00uc2V0KCdjaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcycsIENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cdFx0XHRDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcyA9ICRTTS5nZXQoJ2NoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zJykgYXMgYW55O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghJFNNLmdldCgnY2hhcmFjdGVyLnF1ZXN0U3RhdHVzJykpIHtcclxuICAgICAgICAgICAgJFNNLnNldCgnY2hhcmFjdGVyLnF1ZXN0U3RhdHVzJywgQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cdFx0XHRDaGFyYWN0ZXIucXVlc3RTdGF0dXMgPSAkU00uZ2V0KCdjaGFyYWN0ZXIucXVlc3RTdGF0dXMnKSBhcyBhbnk7XHJcblx0XHR9XHJcblxyXG4gICAgICAgICQoJzxkaXY+JykudGV4dCgnQ2hhcmFjdGVyJykuYXR0cignaWQnLCAndGl0bGUnKS5hcHBlbmRUbygnZGl2I2NoYXJhY3RlcicpO1xyXG5cclxuXHRcdC8vIFRPRE86IHJlcGxhY2UgdGhpcyB3aXRoIGRlcml2ZWQgc3RhdHNcclxuICAgICAgICBmb3IodmFyIHN0YXQgaW4gJFNNLmdldCgnY2hhcmFjdGVyLnJhd3N0YXRzJykgYXMgYW55KSB7XHJcbiAgICAgICAgICAgICQoJzxkaXY+JykudGV4dChzdGF0ICsgJzogJyArICRTTS5nZXQoJ2NoYXJhY3Rlci5yYXdzdGF0cy4nICsgc3RhdCkpLmFwcGVuZFRvKCdkaXYjY2hhcmFjdGVyJyk7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnYnV0dG9ucycpLmNzcyhcIm1hcmdpbi10b3BcIiwgXCIyMHB4XCIpLmFwcGVuZFRvKCdkaXYjY2hhcmFjdGVyJyk7XHJcblx0XHR2YXIgaW52ZW50b3J5QnV0dG9uID0gQnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiBcImludmVudG9yeVwiLFxyXG5cdFx0XHR0ZXh0OiBcIkludmVudG9yeVwiLFxyXG5cdFx0XHRjbGljazogQ2hhcmFjdGVyLm9wZW5JbnZlbnRvcnlcclxuXHRcdH0pLmFwcGVuZFRvKCQoJyNidXR0b25zJywgJ2RpdiNjaGFyYWN0ZXInKSk7XHJcblx0XHRcclxuXHRcdHZhciBxdWVzdExvZ0J1dHRvbiA9IEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogXCJxdWVzdExvZ1wiLFxyXG5cdFx0XHR0ZXh0OiBcIlF1ZXN0IExvZ1wiLFxyXG5cdFx0XHRjbGljazogQ2hhcmFjdGVyLm9wZW5RdWVzdExvZ1xyXG5cdFx0fSkuYXBwZW5kVG8oJCgnI2J1dHRvbnMnLCAnZGl2I2NoYXJhY3RlcicpKTtcclxuXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHR3aW5kb3cuQ2hhcmFjdGVyID0gdGhpcztcclxuXHR9LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHt9LCAvLyBOb3RoaW5nIGZvciBub3dcclxuXHRcclxuXHRlbGVtOiBudWxsLFxyXG5cclxuXHRpbnZlbnRvcnlEaXNwbGF5OiBudWxsIGFzIGFueSxcclxuXHRxdWVzdExvZ0Rpc3BsYXk6IG51bGwgYXMgYW55LFxyXG5cclxuXHRvcGVuSW52ZW50b3J5OiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIGNyZWF0aW5nIGEgaGFuZGxlIGZvciBsYXRlciBhY2Nlc3MsIHN1Y2ggYXMgY2xvc2luZyBpbnZlbnRvcnlcclxuXHRcdENoYXJhY3Rlci5pbnZlbnRvcnlEaXNwbGF5ID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdpbnZlbnRvcnknKS5hZGRDbGFzcygnZXZlbnRQYW5lbCcpLmNzcygnb3BhY2l0eScsICcwJyk7XHJcblx0XHR2YXIgaW52ZW50b3J5RGlzcGxheSA9IENoYXJhY3Rlci5pbnZlbnRvcnlEaXNwbGF5O1xyXG5cdFx0Q2hhcmFjdGVyLmludmVudG9yeURpc3BsYXlcclxuXHRcdC8vIHNldCB1cCBjbGljayBhbmQgaG92ZXIgaGFuZGxlcnMgZm9yIGludmVudG9yeSBpdGVtc1xyXG5cdFx0Lm9uKFwiY2xpY2tcIiwgXCIjaXRlbVwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0Q2hhcmFjdGVyLnVzZUludmVudG9yeUl0ZW0oJCh0aGlzKS5kYXRhKFwibmFtZVwiKSk7XHJcblx0XHRcdENoYXJhY3Rlci5jbG9zZUludmVudG9yeSgpO1xyXG5cdFx0fSkub24oXCJtb3VzZWVudGVyXCIsIFwiI2l0ZW1cIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciB0b29sdGlwID0gJChcIjxkaXYgaWQ9J3Rvb2x0aXAnIGNsYXNzPSd0b29sdGlwJz5cIiArIEl0ZW1MaXN0WyQodGhpcykuZGF0YShcIm5hbWVcIildLnRleHQgKyBcIjwvZGl2PlwiKVxyXG5cdFx0XHQuYXR0cignZGF0YS1uYW1lJywgaXRlbSk7XHJcblx0XHRcdHRvb2x0aXAuYXBwZW5kVG8oJCh0aGlzKSk7XHJcblx0XHR9KS5vbihcIm1vdXNlbGVhdmVcIiwgXCIjaXRlbVwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0JChcIiN0b29sdGlwXCIsIFwiI1wiICsgJCh0aGlzKS5kYXRhKFwibmFtZVwiKSkuZmFkZU91dCgpLnJlbW92ZSgpO1xyXG5cdFx0fSk7XHJcblx0XHQkKCc8ZGl2PicpLmFkZENsYXNzKCdldmVudFRpdGxlJykudGV4dCgnSW52ZW50b3J5JykuYXBwZW5kVG8oaW52ZW50b3J5RGlzcGxheSk7XHJcblx0XHR2YXIgaW52ZW50b3J5RGVzYyA9ICQoJzxkaXY+JykudGV4dChcIkNsaWNrIHRoaW5ncyBpbiB0aGUgbGlzdCB0byB1c2UgdGhlbS5cIilcclxuXHRcdFx0LmhvdmVyKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciB0b29sdGlwID0gJChcIjxkaXYgaWQ9J3Rvb2x0aXAnIGNsYXNzPSd0b29sdGlwJz5cIiArIFwiTm90IHRoaXMsIHRob3VnaC5cIiArIFwiPC9kaXY+XCIpO1xyXG4gICAgXHRcdFx0dG9vbHRpcC5hcHBlbmRUbyhpbnZlbnRvcnlEZXNjKTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JChcIiN0b29sdGlwXCIpLmZhZGVPdXQoKS5yZW1vdmUoKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0Lm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXyhcIkkgYmV0IHlvdSB0aGluayB5b3UncmUgcHJldHR5IGZ1bm55LCBodWg/IENsaWNraW5nIHRoZSB0aGluZyBJIHNhaWQgd2Fzbid0IGNsaWNrYWJsZT9cIikpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQuY3NzKFwibWFyZ2luLWJvdHRvbVwiLCBcIjIwcHhcIilcclxuXHRcdFx0LmFwcGVuZFRvKGludmVudG9yeURpc3BsYXkpO1xyXG5cdFx0XHJcblx0XHRmb3IodmFyIGl0ZW0gaW4gQ2hhcmFjdGVyLmludmVudG9yeSkge1xyXG5cdFx0XHQvLyBtYWtlIHRoZSBpbnZlbnRvcnkgY291bnQgbG9vayBhIGJpdCBuaWNlclxyXG5cdFx0XHR2YXIgaW52ZW50b3J5RWxlbSA9ICQoJzxkaXY+JylcclxuXHRcdFx0LmF0dHIoJ2lkJywgJ2l0ZW0nKVxyXG5cdFx0XHQuYXR0cignZGF0YS1uYW1lJywgaXRlbSlcclxuXHRcdFx0LnRleHQoSXRlbUxpc3RbaXRlbV0ubmFtZSAgKyAnICAoeCcgKyBDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dLnRvU3RyaW5nKCkgKyAnKScpXHJcblx0XHRcdC5hcHBlbmRUbyhpbnZlbnRvcnlEaXNwbGF5KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBUT0RPOiBtYWtlIHRoaXMgQ1NTIGFuIGFjdHVhbCBjbGFzcyBzb21ld2hlcmUsIEknbSBzdXJlIEknbGwgbmVlZCBpdCBhZ2FpblxyXG5cdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdidXR0b25zJykuY3NzKFwibWFyZ2luLXRvcFwiLCBcIjIwcHhcIikuYXBwZW5kVG8oaW52ZW50b3J5RGlzcGxheSk7XHJcblx0XHR2YXIgYiA9IFxyXG5cdFx0Ly9uZXcgXHJcblx0XHRCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6IFwiY2xvc2VJbnZlbnRvcnlcIixcclxuXHRcdFx0dGV4dDogXCJDbG9zZVwiLFxyXG5cdFx0XHRjbGljazogQ2hhcmFjdGVyLmNsb3NlSW52ZW50b3J5XHJcblx0XHR9KS5hcHBlbmRUbygkKCcjYnV0dG9ucycsIGludmVudG9yeURpc3BsYXkpKTtcclxuXHRcdCQoJ2RpdiN3cmFwcGVyJykuYXBwZW5kKGludmVudG9yeURpc3BsYXkpO1xyXG5cdFx0aW52ZW50b3J5RGlzcGxheS5hbmltYXRlKHtvcGFjaXR5OiAxfSwgRXZlbnRzLl9QQU5FTF9GQURFLCAnbGluZWFyJyk7XHJcblx0fSxcclxuXHJcblx0Y2xvc2VJbnZlbnRvcnk6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Q2hhcmFjdGVyLmludmVudG9yeURpc3BsYXkuZW1wdHkoKTtcclxuXHRcdENoYXJhY3Rlci5pbnZlbnRvcnlEaXNwbGF5LnJlbW92ZSgpO1xyXG5cdH0sXHJcblxyXG5cdGFkZFRvSW52ZW50b3J5OiBmdW5jdGlvbihpdGVtLCBhbW91bnQ9MSkge1xyXG5cdFx0aWYgKENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0pIHtcclxuXHRcdFx0Q2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSArPSBhbW91bnQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dID0gYW1vdW50O1xyXG5cdFx0fVxyXG5cclxuXHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiQWRkZWQgXCIgKyBJdGVtTGlzdFtpdGVtXS5uYW1lICsgXCIgdG8gaW52ZW50b3J5LlwiKVxyXG5cdFx0JFNNLnNldCgnaW52ZW50b3J5JywgQ2hhcmFjdGVyLmludmVudG9yeSk7XHJcblx0fSxcclxuXHJcblxyXG5cdHJlbW92ZUZyb21JbnZlbnRvcnk6IGZ1bmN0aW9uKGl0ZW0sIGFtb3VudD0xKSB7XHJcblx0XHRpZiAoQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSkgQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSAtPSBhbW91bnQ7XHJcblx0XHRpZiAoQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSA8IDEpIHtcclxuXHRcdFx0ZGVsZXRlIENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV07XHJcblx0XHR9XHJcblxyXG5cdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJSZW1vdmVkIFwiICsgSXRlbUxpc3RbaXRlbV0ubmFtZSArIFwiIGZyb20gaW52ZW50b3J5LlwiKVxyXG5cdFx0JFNNLnNldCgnaW52ZW50b3J5JywgQ2hhcmFjdGVyLmludmVudG9yeSk7XHJcblx0fSxcclxuXHJcblx0dXNlSW52ZW50b3J5SXRlbTogZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0aWYgKENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0gJiYgQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSA+IDApIHtcclxuXHRcdFx0Ly8gdXNlIHRoZSBlZmZlY3QgaW4gdGhlIGludmVudG9yeTsganVzdCBpbiBjYXNlIGEgbmFtZSBtYXRjaGVzIGJ1dCB0aGUgZWZmZWN0XHJcblx0XHRcdC8vIGRvZXMgbm90LCBhc3N1bWUgdGhlIGludmVudG9yeSBpdGVtIGlzIHRoZSBzb3VyY2Ugb2YgdHJ1dGhcclxuXHRcdFx0SXRlbUxpc3RbaXRlbV0ub25Vc2UoKTtcclxuXHRcdFx0aWYgKHR5cGVvZihJdGVtTGlzdFtpdGVtXS5kZXN0cm95T25Vc2UpID09IFwiZnVuY3Rpb25cIiAmJiBJdGVtTGlzdFtpdGVtXS5kZXN0cm95T25Vc2UoKSkge1xyXG5cdFx0XHRcdENoYXJhY3Rlci5yZW1vdmVGcm9tSW52ZW50b3J5KGl0ZW0pO1xyXG5cdFx0XHR9IGVsc2UgaWYgKEl0ZW1MaXN0W2l0ZW1dLmRlc3Ryb3lPblVzZSkge1xyXG5cdFx0XHRcdENoYXJhY3Rlci5yZW1vdmVGcm9tSW52ZW50b3J5KGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0JFNNLnNldCgnaW52ZW50b3J5JywgQ2hhcmFjdGVyLmludmVudG9yeSk7XHJcblx0fSxcclxuXHJcblx0ZXF1aXBJdGVtOiBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRpZiAoSXRlbUxpc3RbaXRlbV0uc2xvdCAmJiB0eXBlb2YoQ2hhcmFjdGVyLmVxdWlwcGVkSXRlbXNbSXRlbUxpc3RbaXRlbV0uc2xvdF0pICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcblx0XHRcdENoYXJhY3Rlci5hZGRUb0ludmVudG9yeShDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtc1tJdGVtTGlzdFtpdGVtXS5zbG90XSk7XHJcblx0XHRcdENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zW0l0ZW1MaXN0W2l0ZW1dLnNsb3RdID0gaXRlbTtcclxuXHRcdFx0aWYgKEl0ZW1MaXN0W2l0ZW1dLm9uRXF1aXApIHtcclxuXHRcdFx0XHRJdGVtTGlzdFtpdGVtXS5vbkVxdWlwKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Q2hhcmFjdGVyLmFwcGx5RXF1aXBtZW50RWZmZWN0cygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdCRTTS5zZXQoJ2VxdWlwcGVkSXRlbXMnLCBDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcyk7XHJcblx0XHQkU00uc2V0KCdpbnZlbnRvcnknLCBDaGFyYWN0ZXIuaW52ZW50b3J5KTtcclxuXHR9LFxyXG5cclxuXHRncmFudFBlcms6IGZ1bmN0aW9uKHBlcmspIHtcclxuXHRcdGlmIChDaGFyYWN0ZXIucGVya3NbcGVyay5uYW1lXSkge1xyXG5cdFx0XHRpZihwZXJrLnRpbWVMZWZ0ID4gMCkge1xyXG5cdFx0XHRcdENoYXJhY3Rlci5wZXJrc1twZXJrLm5hbWVdICs9IHBlcmsudGltZUxlZnQ7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5wZXJrc1twZXJrLm5hbWVdID0gcGVyaztcclxuXHRcdH1cclxuXHJcblx0XHRcclxuXHRcdCRTTS5zZXQoJ3BlcmtzJywgQ2hhcmFjdGVyLnBlcmtzKVxyXG5cdH0sXHJcblxyXG5cdG9wZW5RdWVzdExvZzogZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBjcmVhdGluZyBhIGhhbmRsZSBmb3IgbGF0ZXIgYWNjZXNzLCBzdWNoIGFzIGNsb3NpbmcgcXVlc3QgbG9nXHJcblx0XHRDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5ID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdxdWVzdCcpLmFkZENsYXNzKCdldmVudFBhbmVsJykuY3NzKCdvcGFjaXR5JywgJzAnKTtcclxuXHRcdHZhciBxdWVzdExvZ0Rpc3BsYXkgPSBDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5O1xyXG5cdFx0Q2hhcmFjdGVyLnF1ZXN0TG9nRGlzcGxheVxyXG5cdFx0Ly8gc2V0IHVwIGNsaWNrIGFuZCBob3ZlciBoYW5kbGVycyBmb3IgcXVlc3RzXHJcblx0XHQub24oXCJjbGlja1wiLCBcIiNxdWVzdFwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0Q2hhcmFjdGVyLmRpc3BsYXlRdWVzdCgkKHRoaXMpLmRhdGEoXCJuYW1lXCIpKTtcclxuXHRcdH0pLm9uKFwibW91c2VlbnRlclwiLCBcIiNxdWVzdFwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly8gZGVzY3JpcHRpb24gc2hvdWxkbid0IGJlIG9uIGEgdG9vbHRpcCwgb2J2cywgYnV0IGZpeCB0aGlzIGxhdGVyXHJcblx0XHRcdHZhciB0b29sdGlwID0gJChcIjxkaXYgaWQ9J3Rvb2x0aXAnIGNsYXNzPSd0b29sdGlwJz5cIiArIFF1ZXN0TG9nWyQodGhpcykuZGF0YShcIm5hbWVcIildLmxvZ0Rlc2NyaXB0aW9uICsgXCI8L2Rpdj5cIilcclxuXHRcdFx0LmF0dHIoJ2RhdGEtbmFtZScsIHF1ZXN0KTtcclxuXHRcdFx0dG9vbHRpcC5hcHBlbmRUbygkKHRoaXMpKTtcclxuXHRcdH0pLm9uKFwibW91c2VsZWF2ZVwiLCBcIiNxdWVzdFwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0JChcIiN0b29sdGlwXCIsIFwiI1wiICsgJCh0aGlzKS5kYXRhKFwibmFtZVwiKSkuZmFkZU91dCgpLnJlbW92ZSgpO1xyXG5cdFx0fSk7XHJcblx0XHQkKCc8ZGl2PicpLmFkZENsYXNzKCdldmVudFRpdGxlJykudGV4dCgnUXVlc3QgTG9nJykuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHRcdHZhciBxdWVzdExvZ0Rlc2MgPSAkKCc8ZGl2PicpLnRleHQoXCJDbGljayBxdWVzdCBuYW1lcyB0byBzZWUgbW9yZSBpbmZvLlwiKVxyXG5cdFx0XHQuY3NzKFwibWFyZ2luLWJvdHRvbVwiLCBcIjIwcHhcIilcclxuXHRcdFx0LmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHRcclxuXHRcdGZvcih2YXIgcXVlc3QgaW4gQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzKSB7XHJcblx0XHRcdHZhciBxdWVzdEVsZW0gPSAkKCc8ZGl2PicpXHJcblx0XHRcdC5hdHRyKCdpZCcsIFwicXVlc3RcIilcclxuXHRcdFx0LmF0dHIoJ2RhdGEtbmFtZScsIHF1ZXN0KVxyXG5cdFx0XHQudGV4dChRdWVzdExvZ1txdWVzdF0ubmFtZSlcclxuXHRcdFx0LmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHRcdGlmIChDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdID09IC0xKSB7XHJcblx0XHRcdFx0cXVlc3RFbGVtXHJcblx0XHRcdFx0Ly8gSSB3YW50IHRoaXMgdG8gYmUgbm90IHN0cnVjayB0aHJvdWdoLCBidXQgdGhhdCdzIHRvbyBhbm5veWluZyB0byB3b3JyeVxyXG5cdFx0XHRcdC8vIGFib3V0IHJpZ2h0IG5vd1xyXG5cdFx0XHRcdC8vIC5wcmVwZW5kKFwiRE9ORSBcIilcclxuXHRcdFx0XHQud3JhcChcIjxzdHJpa2U+XCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVE9ETzogbWFrZSB0aGlzIENTUyBhbiBhY3R1YWwgY2xhc3Mgc29tZXdoZXJlLCBJJ20gc3VyZSBJJ2xsIG5lZWQgaXQgYWdhaW5cclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnYnV0dG9ucycpLmNzcyhcIm1hcmdpbi10b3BcIiwgXCIyMHB4XCIpLmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHR2YXIgYiA9IEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogXCJjbG9zZVF1ZXN0TG9nXCIsXHJcblx0XHRcdHRleHQ6IFwiQ2xvc2VcIixcclxuXHRcdFx0Y2xpY2s6IENoYXJhY3Rlci5jbG9zZVF1ZXN0TG9nXHJcblx0XHR9KS5hcHBlbmRUbygkKCcjYnV0dG9ucycsIHF1ZXN0TG9nRGlzcGxheSkpO1xyXG5cdFx0JCgnZGl2I3dyYXBwZXInKS5hcHBlbmQocXVlc3RMb2dEaXNwbGF5KTtcclxuXHRcdHF1ZXN0TG9nRGlzcGxheS5hbmltYXRlKHtvcGFjaXR5OiAxfSwgRXZlbnRzLl9QQU5FTF9GQURFLCAnbGluZWFyJyk7XHJcblx0fSxcclxuXHJcblx0ZGlzcGxheVF1ZXN0OiBmdW5jdGlvbihxdWVzdDogc3RyaW5nKSB7XHJcblx0XHRjb25zdCBxdWVzdExvZ0Rpc3BsYXkgPSBDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5O1xyXG5cdFx0cXVlc3RMb2dEaXNwbGF5LmVtcHR5KCk7XHJcblx0XHRjb25zdCBjdXJyZW50UXVlc3QgPSBRdWVzdExvZ1txdWVzdF07XHJcblxyXG5cdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdxdWVzdCcpLmFkZENsYXNzKCdldmVudFBhbmVsJykuY3NzKCdvcGFjaXR5JywgJzAnKTtcclxuXHRcdCQoJzxkaXY+JykuYWRkQ2xhc3MoJ2V2ZW50VGl0bGUnKS50ZXh0KGN1cnJlbnRRdWVzdC5uYW1lKS5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cclxuXHRcdHZhciBxdWVzdExvZ0Rlc2MgPSAkKCc8ZGl2PicpLnRleHQoY3VycmVudFF1ZXN0LmxvZ0Rlc2NyaXB0aW9uKVxyXG5cdFx0XHQuY3NzKFwibWFyZ2luLWJvdHRvbVwiLCBcIjIwcHhcIilcclxuXHRcdFx0LmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblxyXG5cdFx0aWYgKENoYXJhY3Rlci5xdWVzdFN0YXR1c1txdWVzdF0gYXMgbnVtYmVyID09IC0xKSB7XHJcblx0XHRcdHZhciBwaGFzZURlc2MgPSAkKCc8ZGl2PicpLnRleHQoXCJUaGlzIHF1ZXN0IGlzIGNvbXBsZXRlIVwiKVxyXG5cdFx0XHQuY3NzKFwibWFyZ2luLWJvdHRvbVwiLCBcIjEwcHhcIilcclxuXHRcdFx0LmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPD0gKENoYXJhY3Rlci5xdWVzdFN0YXR1c1txdWVzdF0gYXMgbnVtYmVyKTsgaSsrKSB7XHJcblx0XHRcdHZhciBwaGFzZURlc2MgPSAkKCc8ZGl2PicpLnRleHQoY3VycmVudFF1ZXN0LnBoYXNlc1tpXS5kZXNjcmlwdGlvbilcclxuXHRcdFx0LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCIxMHB4XCIpXHJcblx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0XHR2YXIgY29tcGxldGUgPSB0cnVlO1xyXG5cdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IE9iamVjdC5rZXlzKGN1cnJlbnRRdWVzdC5waGFzZXNbaV0ucmVxdWlyZW1lbnRzKS5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdHZhciByZXF1aXJlbWVudHNEZXNjID0gJCgnPGRpdj4nKS50ZXh0KGN1cnJlbnRRdWVzdC5waGFzZXNbaV0ucmVxdWlyZW1lbnRzW2pdLnJlbmRlclJlcXVpcmVtZW50KCkpXHJcblx0XHRcdFx0XHQuY3NzKFwibWFyZ2luLWJvdHRvbVwiLCBcIjIwcHhcIilcclxuXHRcdFx0XHRcdC5jc3MoXCJtYXJnaW4tbGVmdFwiLCBcIjIwcHhcIilcclxuXHRcdFx0XHRcdC5jc3MoJ2ZvbnQtc3R5bGUnLCAnaXRhbGljJylcclxuXHRcdFx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0XHRcdGlmICghY3VycmVudFF1ZXN0LnBoYXNlc1tpXS5yZXF1aXJlbWVudHNbal0uaXNDb21wbGV0ZSgpKSBjb21wbGV0ZSA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChjb21wbGV0ZSkge1xyXG5cdFx0XHRcdHBoYXNlRGVzYy53cmFwKFwiPHN0cmlrZT5cIik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBUT0RPOiBtYWtlIHRoaXMgQ1NTIGFuIGFjdHVhbCBjbGFzcyBzb21ld2hlcmUsIEknbSBzdXJlIEknbGwgbmVlZCBpdCBhZ2FpblxyXG5cdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdidXR0b25zJykuY3NzKFwibWFyZ2luLXRvcFwiLCBcIjIwcHhcIikuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHJcblx0XHR2YXIgYiA9IEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogXCJiYWNrVG9RdWVzdExvZ1wiLFxyXG5cdFx0XHR0ZXh0OiBcIkJhY2sgdG8gUXVlc3QgTG9nXCIsXHJcblx0XHRcdGNsaWNrOiBDaGFyYWN0ZXIuYmFja1RvUXVlc3RMb2dcclxuXHRcdH0pLmFwcGVuZFRvKCQoJyNidXR0b25zJywgcXVlc3RMb2dEaXNwbGF5KSk7XHJcblxyXG5cdFx0dmFyIGIgPSBCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6IFwiY2xvc2VRdWVzdExvZ1wiLFxyXG5cdFx0XHR0ZXh0OiBcIkNsb3NlXCIsXHJcblx0XHRcdGNsaWNrOiBDaGFyYWN0ZXIuY2xvc2VRdWVzdExvZ1xyXG5cdFx0fSkuYXBwZW5kVG8oJCgnI2J1dHRvbnMnLCBxdWVzdExvZ0Rpc3BsYXkpKTtcclxuXHR9LFxyXG5cclxuXHRjbG9zZVF1ZXN0TG9nOiBmdW5jdGlvbigpIHtcclxuXHRcdENoYXJhY3Rlci5xdWVzdExvZ0Rpc3BsYXkuZW1wdHkoKTtcclxuXHRcdENoYXJhY3Rlci5xdWVzdExvZ0Rpc3BsYXkucmVtb3ZlKCk7XHJcblx0fSxcclxuXHJcblx0YmFja1RvUXVlc3RMb2c6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Q2hhcmFjdGVyLmNsb3NlUXVlc3RMb2coKTtcclxuXHRcdENoYXJhY3Rlci5vcGVuUXVlc3RMb2coKTtcclxuXHR9LFxyXG5cclxuXHRzZXRRdWVzdFN0YXR1czogZnVuY3Rpb24ocXVlc3QsIHBoYXNlKSB7XHJcblx0XHQvLyBtaWdodCBiZSBhIGdvb2QgaWRlYSB0byBjaGVjayBmb3IgbGluZWFyIHF1ZXN0IHByb2dyZXNzaW9uIGhlcmU/XHJcblx0XHRpZiAodHlwZW9mKFF1ZXN0TG9nW3F1ZXN0XSkgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuXHRcdFx0Q2hhcmFjdGVyLnF1ZXN0U3RhdHVzW3F1ZXN0XSA9IHBoYXNlO1xyXG5cclxuXHRcdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJRdWVzdCBMb2cgdXBkYXRlZC5cIik7XHJcblx0XHRcdCRTTS5zZXQoJ3F1ZXN0U3RhdHVzJywgQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRjaGVja1F1ZXN0U3RhdHVzOiBmdW5jdGlvbihxdWVzdCkge1xyXG5cdFx0Y29uc3QgY3VycmVudFBoYXNlID0gUXVlc3RMb2dbcXVlc3RdLnBoYXNlc1tDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdXTtcclxuXHJcblx0XHR2YXIgY29tcGxldGUgPSB0cnVlO1xyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBPYmplY3Qua2V5cyhjdXJyZW50UGhhc2UucmVxdWlyZW1lbnRzKS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAoIWN1cnJlbnRQaGFzZS5yZXF1aXJlbWVudHNbaV0uaXNDb21wbGV0ZSgpKVxyXG5cdFx0XHRcdGNvbXBsZXRlID0gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gaWYgdGhlcmUgaXMgYSBuZXh0IHBoYXNlLCBzZXQgcXVlc3RTdGF0dXMgdG8gaXRcclxuXHRcdGlmICh0eXBlb2YoUXVlc3RMb2dbcXVlc3RdLnBoYXNlc1tDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdICsgMV0pICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcblx0XHRcdENoYXJhY3Rlci5xdWVzdFN0YXR1c1txdWVzdF0gKz0gMTtcclxuXHRcdH0gZWxzZSB7IC8vIGVsc2Ugc2V0IGl0IHRvIGNvbXBsZXRlXHJcblx0XHRcdENoYXJhY3Rlci5xdWVzdFN0YXR1c1txdWVzdF0gPSAtMTtcclxuXHRcdH1cclxuXHJcblx0XHROb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIlF1ZXN0IExvZyB1cGRhdGVkLlwiKTtcclxuXHRcdCRTTS5zZXQoJ3F1ZXN0U3RhdHVzJywgQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzKTtcclxuXHR9LFxyXG5cclxuXHQvLyBhcHBseSBlcXVpcG1lbnQgZWZmZWN0cywgd2hpY2ggc2hvdWxkIGFsbCBjaGVjayBhZ2FpbnN0ICRTTSBzdGF0ZSB2YXJpYWJsZXM7XHJcblx0Ly8gdGhpcyBzaG91bGQgYmUgY2FsbGVkIG9uIGJhc2ljYWxseSBldmVyeSBwbGF5ZXIgYWN0aW9uIHdoZXJlIGEgcGllY2Ugb2YgZ2VhclxyXG5cdC8vIHdvdWxkIGRvIHNvbWV0aGluZyBvciBjaGFuZ2UgYW4gb3V0Y29tZTsgZ2l2ZSBleHRyYVBhcmFtcyB0byB0aGUgZWZmZWN0IGJlaW5nIFxyXG5cdC8vIGFwcGxpZWQgZm9yIGFueXRoaW5nIHRoYXQncyByZWxldmFudCB0byB0aGUgZWZmZWN0IGJ1dCBub3QgaGFuZGxlZCBieSAkU01cclxuXHRhcHBseUVxdWlwbWVudEVmZmVjdHM6IGZ1bmN0aW9uKGV4dHJhUGFyYW1zPykge1xyXG5cdFx0Zm9yIChjb25zdCBpdGVtIGluIENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zKSB7XHJcblx0XHRcdGlmIChJdGVtTGlzdFtpdGVtXS5lZmZlY3RzKSB7XHJcblx0XHRcdFx0Zm9yIChjb25zdCBlZmZlY3QgaW4gSXRlbUxpc3RbaXRlbV0uZWZmZWN0cykge1xyXG5cdFx0XHRcdFx0Ly8gTk9URTogY3VycmVudGx5IHRoaXMgaXMgZ29vZCBmb3IgYXBwbHlpbmcgcGVya3MgYW5kIE5vdGlmeWluZztcclxuXHRcdFx0XHRcdC8vIGFyZSB0aGVyZSBvdGhlciBzaXR1YXRpb25zIHdoZXJlIHdlJ2Qgd2FudCB0byBhcHBseSBlZmZlY3RzLFxyXG5cdFx0XHRcdFx0Ly8gb3IgY2FuIHdlIGNvdmVyIGJhc2ljYWxseSBldmVyeSBjYXNlIHZpYSB0aG9zZSB0aGluZ3M/XHJcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0XHRpZiAoZWZmZWN0LmlzQWN0aXZlICYmIGVmZmVjdC5pc0FjdGl2ZShleHRyYVBhcmFtcykpIGVmZmVjdC5hcHBseShleHRyYVBhcmFtcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Ly8gZ2V0IHN0YXRzIGFmdGVyIGFwcGx5aW5nIGFsbCBlcXVpcG1lbnQgYm9udXNlcywgcGVya3MsIGV0Yy5cclxuXHRnZXREZXJpdmVkU3RhdHM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Y29uc3QgZGVyaXZlZFN0YXRzID0gc3RydWN0dXJlZENsb25lKENoYXJhY3Rlci5yYXdTdGF0cyk7XHJcblx0XHRmb3IgKGNvbnN0IGl0ZW0gaW4gQ2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMpIHtcclxuXHRcdFx0aWYgKEl0ZW1MaXN0W2l0ZW1dLnN0YXRCb251c2VzKSB7XHJcblx0XHRcdFx0Zm9yIChjb25zdCBzdGF0IGluIE9iamVjdC5rZXlzKEl0ZW1MaXN0W2l0ZW1dLnN0YXRCb251c2VzKSkge1xyXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiAoSXRlbUxpc3RbaXRlbV0uc3RhdEJvbnVzZXNbc3RhdF0gPT0gXCJmdW5jdGlvblwiKSkge1xyXG5cdFx0XHRcdFx0XHRkZXJpdmVkU3RhdHNbc3RhdF0gKz0gSXRlbUxpc3RbaXRlbV0uc3RhdEJvbnVzZXNbc3RhdF0oKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGRlcml2ZWRTdGF0c1tzdGF0XSArPSBJdGVtTGlzdFtpdGVtXS5zdGF0Qm9udXNlc1tzdGF0XTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGNvbnN0IHBlcmsgaW4gQ2hhcmFjdGVyLnBlcmtzKSB7XHJcblx0XHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdFx0aWYgKHBlcmsuc3RhdEJvbnVzZXMpIHtcclxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0Zm9yIChjb25zdCBzdGF0IGluIE9iamVjdC5rZXlzKHBlcmsuc3RhdEJvbnVzZXMpKSB7XHJcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0XHRpZiAodHlwZW9mIChwZXJrLnN0YXRCb251c2VzW3N0YXRdID09IFwiZnVuY3Rpb25cIikpIHtcclxuXHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdFx0XHRkZXJpdmVkU3RhdHNbc3RhdF0gKz0gcGVyay5zdGF0Qm9udXNlc1tzdGF0XSgpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdFx0XHRkZXJpdmVkU3RhdHNbc3RhdF0gKz0gcGVyay5zdGF0Qm9udXNlc1tzdGF0XTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZGVyaXZlZFN0YXRzO1xyXG5cdH1cclxufSIsIi8vIGFsbCBpdGVtcyBnbyBoZXJlLCBzbyB0aGF0IG5vdGhpbmcgc2lsbHkgaGFwcGVucyBpbiB0aGUgZXZlbnQgdGhhdCB0aGV5IGdldCBwdXQgaW4gTG9jYWwgU3RvcmFnZVxyXG4vLyBhcyBwYXJ0IG9mIHRoZSBzdGF0ZSBtYW5hZ2VtZW50IGNvZGU7IHBsZWFzZSBzYXZlIGl0ZW0gbmFtZXMgdG8gdGhlIGludmVudG9yeSwgYW5kIHRoZW4gcmVmZXIgdG8gXHJcbi8vIHRoZSBpdGVtIGxpc3QgdmlhIHRoZSBpdGVtIG5hbWVcclxuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tIFwiLi9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tIFwiLi4vbm90aWZpY2F0aW9uc1wiO1xyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSBcIi4vaXRlbVwiO1xyXG5cclxuLy8gRGV0YWlscyBmb3IgYWxsIGluLWdhbWUgaXRlbXM7IHRoZSBDaGFyYWN0ZXIgaW52ZW50b3J5IG9ubHkgaG9sZHMgaXRlbSBJRHNcclxuLy8gYW5kIGFtb3VudHNcclxuZXhwb3J0IGNvbnN0IEl0ZW1MaXN0OiB7W2lkOiBzdHJpbmddOiBJdGVtfSA9IHtcclxuICAgIFwiTGl6LndlaXJkQm9va1wiOiB7XHJcbiAgICAgICAgbmFtZTogJ1dlaXJkIEJvb2snLFxyXG4gICAgICAgIHBsdXJhbE5hbWU6ICdXZWlyZCBCb29rcycsXHJcbiAgICAgICAgdGV4dDogXygnQSBib29rIHlvdSBmb3VuZCBhdCBMaXpcXCdzIHBsYWNlLiBTdXBwb3NlZGx5IGhhcyBpbmZvcm1hdGlvbiBhYm91dCBDaGFkdG9waWEuJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkgeyBcclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICBfKFwiQSBCcmllZiBIaXN0b3J5IG9mIENoYWR0b3BpYVwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1RoaXMgYm9vayBpcyBwcmV0dHkgYm9yaW5nLCBidXQgeW91IG1hbmFnZSB0byBsZWFybiBhIGJpdCBtb3JlIGluIHNwaXRlIG9mIHlvdXIgcG9vciBhdHRlbnRpb24gc3Bhbi4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oJ0ZvciBleGFtcGxlLCB5b3UgbGVhcm4gdGhhdCBcIkNoYWR0b3BpYVwiIGRvZXNuXFwndCBoYXZlIGEgY2FwaXRhbCBcXCdUXFwnLiBUaGF0XFwncyBwcmV0dHkgY29vbCwgaHVoPycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXygnLi4uIFdoYXQgd2VyZSB5b3UgZG9pbmcgYWdhaW4/JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnU29tZXRoaW5nIGNvb2xlciB0aGFuIHJlYWRpbmcsIHByb2JhYmx5JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6IENoYXJhY3Rlci5hZGRUb0ludmVudG9yeShcIkxpei5ib3JpbmdCb29rXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogdHJ1ZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH0sXHJcblxyXG4gICAgXCJMaXouYm9yaW5nQm9va1wiOiB7XHJcbiAgICAgICAgbmFtZTogJ1wiQSBCcmllZiBIaXN0b3J5IG9mIENoYWR0b3BpYVwiJyxcclxuICAgICAgICBwbHVyYWxOYW1lOiAnTXVsdGlwbGUgY29waWVzIG9mIFwiQSBCcmllZiBIaXN0b3J5IG9mIENoYWR0b3BpYVwiJyxcclxuICAgICAgICB0ZXh0OiBfKCdNYW4sIHRoaXMgYm9vayBpcyBib3JpbmcuJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEgQnJpZWYgU3VtbWFyeSBvZiBhIEJyaWVmIEhpc3Rvcnkgb2YgQ2hhZHRvcGlhXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW18oJ0l0XFwncyBzdGlsbCBqdXN0IGFzIGJvcmluZyBhcyB3aGVuIHlvdSBsYXN0IHRyaWVkIHRvIHJlYWQgaXQuJyldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdEYW5nLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogZmFsc2UsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgXCJTdHJhbmdlci5zbW9vdGhTdG9uZVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ2Egc21vb3RoIGJsYWNrIHN0b25lJyxcclxuICAgICAgICBwbHVyYWxOYW1lOiAnc21vb3RoIGJsYWNrIHN0b25lcycsXHJcbiAgICAgICAgdGV4dDogXygnSXRcXCdzIHdlaXJkbHkgZWVyaWUnKSxcclxuICAgICAgICBvblVzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmICghJFNNLmdldCgna25vd2xlZGdlLlN0cmFuZ2VyLnNtb290aFN0b25lJykpIHtcclxuICAgICAgICAgICAgICAgIE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsICdZb3UgaGF2ZSBubyBpZGVhIHdoYXQgdG8gZG8gd2l0aCB0aGlzIHRoaW5nLicpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBfKFwiQSBzbW9vdGggYmxhY2sgc3RvbmVcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXyhcIkknbSBnZW51aW5lbHkgbm90IHN1cmUgaG93IHlvdSBnb3QgdG8gdGhpcyBldmVudCwgYnV0IHBsZWFzZSBsZXQgbWUga25vdyB2aWEgR2l0SHViIGlzc3VlLCB5b3UgbGl0dGxlIHN0aW5rZXIuXCIpXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnSSBzd2VhciB0byBkbyB0aGlzLCBhcyBhIHJlc3BvbnNpYmxlIGNpdGl6ZW4gb2YgRWFydGgnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIFwiU3RyYW5nZXIud3JhcHBlZEtuaWZlXCI6IHtcclxuICAgICAgICBuYW1lOiAnYSBrbmlmZSB3cmFwcGVkIGluIGNsb3RoJyxcclxuICAgICAgICBwbHVyYWxOYW1lOiAnS25pdmVzIHdyYXBwZWQgaW4gc2VwYXJhdGUgY2xvdGhzJyxcclxuICAgICAgICB0ZXh0OiBfKCdNYW4sIEkgaG9wZSBpdFxcJ3Mgbm90IGFsbCBsaWtlLCBibG9vZHkgb24gdGhlIGJsYWRlIGFuZCBzdHVmZi4nKSxcclxuICAgICAgICBvblVzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBfKFwiQSBrbmlmZSB3cmFwcGVkIGluIGNsb3RoXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW18oXCJZb3UgdW53cmFwIHRoZSBrbmlmZSBjYXJlZnVsbHkuIEl0IHNlZW1zIHRvIGJlIGhpZ2hseSBvcm5hbWVudGVkLCBhbmQgeW91IGNvdWxkIHByb2JhYmx5IGRvIHNvbWUgY3JpbWVzIHdpdGggaXQuXCIpXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnSGVsbCB5ZWFoLCBBZG9sZiBMb29zIHN0eWxlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6IENoYXJhY3Rlci5hZGRUb0ludmVudG9yeShcIlN0cmFuZ2VyLnNpbHZlcktuaWZlXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogdHJ1ZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH0sXHJcbiAgICBcIlN0cmFuZ2VyLnNpbHZlcktuaWZlXCI6IHtcclxuICAgICAgICBuYW1lOiAnYSBzaWx2ZXIga25pZmUnLFxyXG4gICAgICAgIHBsdXJhbE5hbWU6ICdzaWx2ZXIga25pdmVzJyxcclxuICAgICAgICB0ZXh0OiBfKCdIaWdobHkgb3JuYW1lbnRlZCcpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IF8oXCJBIHNpbHZlciBrbmlmZVwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJPbmUgZGF5IHlvdSdsbCBiZSBhYmxlIHRvIGVxdWlwIHRoaXMsIGJ1dCByaWdodCBub3cgdGhhdCBmdW5jdGlvbmFsaXR5IGlzbid0IHByZXNlbnQuXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIlBsZWFzZSBwb2xpdGVseSBsZWF2ZSB0aGUgcHJlbWlzZXMgd2l0aG91dCBhY2tub3dsZWRnaW5nIHRoaXMgbWlzc2luZyBmZWF0dXJlLlwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdZb3UgZ290IGl0LCBjaGllZicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogZmFsc2UsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgXCJTdHJhbmdlci5jbG90aEJ1bmRsZVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ2EgYnVuZGxlIG9mIGNsb3RoJyxcclxuICAgICAgICBwbHVyYWxOYW1lOiAnYnVuZGxlcyBvZiBjbG90aCcsXHJcbiAgICAgICAgdGV4dDogXygnV2hhdCBsaWVzIHdpdGhpbj8nKSxcclxuICAgICAgICBvblVzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBfKFwiQSBidW5kbGUgb2YgY2xvdGhcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiT25lIGRheSB5b3UnbGwgYmUgYWJsZSB0byB1c2UgdGhpcyBpdGVtLCBidXQgcmlnaHQgbm93IHRoYXQgZnVuY3Rpb25hbGl0eSBpc24ndCBwcmVzZW50LlwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJQbGVhc2UgcG9saXRlbHkgbGVhdmUgdGhlIHByZW1pc2VzIHdpdGhvdXQgYWNrbm93bGVkZ2luZyB0aGlzIG1pc3NpbmcgZmVhdHVyZS5cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnWW91IGdvdCBpdCwgY2hpZWYnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIFwiU3RyYW5nZXIuY29pblwiOiB7XHJcbiAgICAgICAgbmFtZTogJ0Egc3RyYW5nZSBjb2luJyxcclxuICAgICAgICBwbHVyYWxOYW1lOiAnc3RyYW5nZSBjb2lucycsXHJcbiAgICAgICAgdGV4dDogXygnQm90aCBzaWRlcyBkZXBpY3QgdGhlIHNhbWUgaW1hZ2UnKSxcclxuICAgICAgICBvblVzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBfKFwiQSBzdHJhbmdlIGNvaW5cIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiT25lIGRheSB5b3UnbGwgYmUgYWJsZSB0byB1c2UgdGhpcyBpdGVtLCBidXQgcmlnaHQgbm93IHRoYXQgZnVuY3Rpb25hbGl0eSBpc24ndCBwcmVzZW50LlwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJQbGVhc2UgcG9saXRlbHkgbGVhdmUgdGhlIHByZW1pc2VzIHdpdGhvdXQgYWNrbm93bGVkZ2luZyB0aGlzIG1pc3NpbmcgZmVhdHVyZS5cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnWW91IGdvdCBpdCwgY2hpZWYnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIFwiQ2FwdGFpbi5zdXBwbGllc1wiOiB7XHJcbiAgICAgICAgbmFtZTogJ1N1cHBsaWVzIGZvciB0aGUgTWF5b3InLFxyXG4gICAgICAgIHRleHQ6ICdUaGV5XFwncmUgaGVhdnksIGJ1dCBub3QgaW4gYSB3YXkgdGhhdCBpbXBhY3RzIGdhbWVwbGF5JyxcclxuICAgICAgICBvblVzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBfKFwiU3VwcGxpZXMgZm9yIHRoZSBNYXlvclwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJBIGJpZyBib3ggb2Ygc3R1ZmYgZm9yIHRoZSB2aWxsYWdlLiBMb29rcyBsaWtlIHJhdyBtYXRlcmlhbHMsIG1vc3RseS5cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiSSBzaG91bGQgcmVhbGx5IHRha2UgdGhpcyBiYWNrIHRvIHRoZSBNYXlvci5cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnT2theScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogZmFsc2UsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4vY2hhcmFjdGVyXCI7XHJcbmltcG9ydCB7IFF1ZXN0IH0gZnJvbSBcIi4vcXVlc3RcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBRdWVzdExvZzoge1tpZDogc3RyaW5nXTogUXVlc3R9ID0ge1xyXG4gICAgXCJtYXlvclN1cHBsaWVzXCI6IHtcclxuICAgICAgICBuYW1lOiBcIlN1cHBsaWVzIGZvciB0aGUgTWF5b3JcIixcclxuICAgICAgICBsb2dEZXNjcmlwdGlvbjogXCJUaGUgbWF5b3IgaGFzIGFza2VkIHlvdSB0byBnZXQgc29tZSBzdXBwbGllcyBmb3IgaGltIGZyb20gdGhlIG91dHBvc3QuXCIsXHJcbiAgICAgICAgcGhhc2VzOiB7XHJcbiAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkdvIGNoZWNrIG91dCB0aGUgUm9hZCB0byB0aGUgT3V0cG9zdCB0byBzZWUgaWYgeW91IGNhbiBmaW5kIG91dCBtb3JlXCIsXHJcbiAgICAgICAgICAgICAgICByZXF1aXJlbWVudHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlclJlcXVpcmVtZW50OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkU00uZ2V0KCdyb2FkLm9wZW4nKSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0eXBlb2YoJFNNLmdldCgnUm9hZC5jb3VudGVyJykpID09IFwidW5kZWZpbmVkXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiSSBzaG91bGQgZ28gY2hlY2sgb3V0IHRoZSBSb2FkIHRvIHRoZSBPdXRwb3N0XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgkU00uZ2V0KCdyb2FkLm9wZW4nKSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0eXBlb2YoJFNNLmdldCgnUm9hZC5jb3VudGVyJykpICE9PSBcInVuZGVmaW5lZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdHlwZW9mKCRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSkgPT0gXCJ1bmRlZmluZWRcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJJIHNob3VsZCBrZWVwIGV4cGxvcmluZyB0aGUgUm9hZCB0byB0aGUgT3V0cG9zdFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoJFNNLmdldCgncm9hZC5vcGVuJykgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdHlwZW9mKCRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSkgIT09IFwidW5kZWZpbmVkXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyID4gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJJJ3ZlIGZvdW5kIHRoZSB3YXkgdG8gdGhlIE91dHBvc3RcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCRTTS5nZXQoJ3JvYWQub3BlbicpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdHlwZW9mKCRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSkgIT09IFwidW5kZWZpbmVkXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPiAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIDE6IHtcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkFzayB0aGUgQ2FwdGFpbiBvZiB0aGUgT3V0cG9zdCBhYm91dCB0aGUgc3VwcGxpZXNcIixcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVtZW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyUmVxdWlyZW1lbnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdHlwZW9mKCRTTS5nZXQoJ291dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykpID09IFwidW5kZWZpbmVkXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiSSBzaG91bGQgdHJ5IHRhbGtpbmcgdG8gdGhlIENhcHRhaW4gb2YgdGhlIE91dHBvc3RcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdHlwZW9mKCRTTS5nZXQoJ291dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykpICE9PSBcInVuZGVmaW5lZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnb3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnKSBhcyBudW1iZXIgPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdHlwZW9mKENoYXJhY3Rlci5pbnZlbnRvcnlbXCJDYXB0YWluLnN1cHBsaWVzXCJdKSA9PSBcInVuZGVmaW5lZFwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkkgc2hvdWxkIGFzayB0aGUgQ2FwdGFpbiBhYm91dCB0aGUgbWlzc2luZyBzdXBwbGllc1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpIGFzIG51bWJlciA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0eXBlb2YoJFNNLmdldCgnb3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnKSkgIT09IFwidW5kZWZpbmVkXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdvdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcpIGFzIG51bWJlciA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0eXBlb2YoQ2hhcmFjdGVyLmludmVudG9yeVtcIkNhcHRhaW4uc3VwcGxpZXNcIl0pICE9PSBcInVuZGVmaW5lZFwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkkndmUgZ290dGVuIHRoZSBzdXBwbGllcyBmcm9tIHRoZSBDYXB0YWluXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdHlwZW9mKCRTTS5nZXQoJ291dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykgIT09IFwidW5kZWZpbmVkXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdvdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcpIGFzIG51bWJlciA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHR5cGVvZihDaGFyYWN0ZXIuaW52ZW50b3J5W1wiQ2FwdGFpbi5zdXBwbGllc1wiXSkgIT09IFwidW5kZWZpbmVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAyOiB7XHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJSZXR1cm4gdGhlIHN1cHBsaWVzIHRvIHRoZSBNYXlvclwiLFxyXG4gICAgICAgICAgICAgICAgcmVxdWlyZW1lbnRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJSZXF1aXJlbWVudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mKCRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnKSkgPT0gXCJ1bmRlZmluZWRcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gIFwiSSBzaG91bGQgaGFuZCB0aGVzZSBzdXBwbGllcyBvdmVyIHRvIHRoZSBNYXlvclwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mKCRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnKSkgPT0gXCJ1bmRlZmluZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnKSBhcyBudW1iZXIgPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkkndmUgaGFuZGVkIG92ZXIgdGhlIHN1cHBsaWVzIHRvIHRoZSBNYXlvclwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0NvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAodHlwZW9mKCRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnKSkgPT0gXCJ1bmRlZmluZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgndmlsbGFnZS5tYXlvci5oYXZlR2l2ZW5TdXBwbGllcycpIGFzIG51bWJlciA+IDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLypcclxuICogTW9kdWxlIGZvciBoYW5kbGluZyBTdGF0ZXNcclxuICogXHJcbiAqIEFsbCBzdGF0ZXMgc2hvdWxkIGJlIGdldCBhbmQgc2V0IHRocm91Z2ggdGhlIFN0YXRlTWFuYWdlciAoJFNNKS5cclxuICogXHJcbiAqIFRoZSBtYW5hZ2VyIGlzIGludGVuZGVkIHRvIGhhbmRsZSBhbGwgbmVlZGVkIGNoZWNrcyBhbmQgZXJyb3IgY2F0Y2hpbmcuXHJcbiAqIFRoaXMgaW5jbHVkZXMgY3JlYXRpbmcgdGhlIHBhcmVudHMgb2YgbGF5ZXJlZC9kZWVwIHN0YXRlcyBzbyB1bmRlZmluZWQgc3RhdGVzXHJcbiAqIGRvIG5vdCBuZWVkIHRvIGJlIHRlc3RlZCBmb3IgYW5kIGNyZWF0ZWQgYmVmb3JlaGFuZC5cclxuICogXHJcbiAqIFdoZW4gYSBzdGF0ZSBpcyBjaGFuZ2VkLCBhbiB1cGRhdGUgZXZlbnQgaXMgc2VudCBvdXQgY29udGFpbmluZyB0aGUgbmFtZSBvZiB0aGUgc3RhdGVcclxuICogY2hhbmdlZCBvciBpbiB0aGUgY2FzZSBvZiBtdWx0aXBsZSBjaGFuZ2VzICguc2V0TSwgLmFkZE0pIHRoZSBwYXJlbnQgY2xhc3MgY2hhbmdlZC5cclxuICogRXZlbnQ6IHR5cGU6ICdzdGF0ZVVwZGF0ZScsIHN0YXRlTmFtZTogPHBhdGggb2Ygc3RhdGUgb3IgcGFyZW50IHN0YXRlPlxyXG4gKiBcclxuICogT3JpZ2luYWwgZmlsZSBjcmVhdGVkIGJ5OiBNaWNoYWVsIEdhbHVzaGFcclxuICovXHJcblxyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi9lbmdpbmVcIjtcclxuaW1wb3J0IHsgTm90aWZpY2F0aW9ucyB9IGZyb20gXCIuL25vdGlmaWNhdGlvbnNcIjtcclxuXHJcbnZhciBTdGF0ZU1hbmFnZXIgPSB7XHJcblx0XHRcclxuXHRNQVhfU1RPUkU6IDk5OTk5OTk5OTk5OTk5LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHt9LFxyXG5cdFxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHRcdFxyXG5cdFx0Ly9jcmVhdGUgY2F0ZWdvcmllc1xyXG5cdFx0dmFyIGNhdHMgPSBbXHJcblx0XHRcdCdmZWF0dXJlcycsXHRcdC8vYmlnIGZlYXR1cmVzIGxpa2UgYnVpbGRpbmdzLCBsb2NhdGlvbiBhdmFpbGFiaWxpdHksIHVubG9ja3MsIGV0Y1xyXG5cdFx0XHQnc3RvcmVzJywgXHRcdC8vbGl0dGxlIHN0dWZmLCBpdGVtcywgd2VhcG9ucywgZXRjXHJcblx0XHRcdCdjaGFyYWN0ZXInLCBcdC8vdGhpcyBpcyBmb3IgcGxheWVyJ3MgY2hhcmFjdGVyIHN0YXRzIHN1Y2ggYXMgcGVya3NcclxuXHRcdFx0J2luY29tZScsXHJcblx0XHRcdCd0aW1lcnMnLFxyXG5cdFx0XHQnZ2FtZScsIFx0XHQvL21vc3RseSBsb2NhdGlvbiByZWxhdGVkOiBmaXJlIHRlbXAsIHdvcmtlcnMsIHBvcHVsYXRpb24sIHdvcmxkIG1hcCwgZXRjXHJcblx0XHRcdCdwbGF5U3RhdHMnLFx0Ly9hbnl0aGluZyBwbGF5IHJlbGF0ZWQ6IHBsYXkgdGltZSwgbG9hZHMsIGV0Y1xyXG5cdFx0XHQncHJldmlvdXMnLFx0XHQvLyBwcmVzdGlnZSwgc2NvcmUsIHRyb3BoaWVzIChpbiBmdXR1cmUpLCBhY2hpZXZlbWVudHMgKGFnYWluLCBub3QgeWV0KSwgZXRjXHJcblx0XHRcdCdvdXRmaXQnXHRcdFx0Ly8gdXNlZCB0byB0ZW1wb3JhcmlseSBzdG9yZSB0aGUgaXRlbXMgdG8gYmUgdGFrZW4gb24gdGhlIHBhdGhcclxuXHRcdF07XHJcblx0XHRcclxuXHRcdGZvcih2YXIgd2hpY2ggaW4gY2F0cykge1xyXG5cdFx0XHRpZighJFNNLmdldChjYXRzW3doaWNoXSkpICRTTS5zZXQoY2F0c1t3aGljaF0sIHt9KTsgXHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vc3Vic2NyaWJlIHRvIHN0YXRlVXBkYXRlc1xyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5zdWJzY3JpYmUoJFNNLmhhbmRsZVN0YXRlVXBkYXRlcyk7XHJcblxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0d2luZG93LiRTTSA9IHRoaXM7XHJcblx0fSxcclxuXHRcclxuXHQvL2NyZWF0ZSBhbGwgcGFyZW50cyBhbmQgdGhlbiBzZXQgc3RhdGVcclxuXHRjcmVhdGVTdGF0ZTogZnVuY3Rpb24oc3RhdGVOYW1lLCB2YWx1ZSkge1xyXG5cdFx0dmFyIHdvcmRzID0gc3RhdGVOYW1lLnNwbGl0KC9bLlxcW1xcXSdcIl0rLyk7XHJcblx0XHQvL2ZvciBzb21lIHJlYXNvbiB0aGVyZSBhcmUgc29tZXRpbWVzIGVtcHR5IHN0cmluZ3NcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgd29yZHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKHdvcmRzW2ldID09PSAnJykge1xyXG5cdFx0XHRcdHdvcmRzLnNwbGljZShpLCAxKTtcclxuXHRcdFx0XHRpLS07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vIElNUE9SVEFOVDogU3RhdGUgcmVmZXJzIHRvIHdpbmRvdy5TdGF0ZSwgd2hpY2ggSSBoYWQgdG8gaW5pdGlhbGl6ZSBtYW51YWxseVxyXG5cdFx0Ly8gICAgaW4gRW5naW5lLnRzOyBwbGVhc2UgZG9uJ3QgZm9yZ2V0IHRoaXMgYW5kIG1lc3Mgd2l0aCBhbnl0aGluZyBuYW1lZFxyXG5cdFx0Ly8gICAgXCJTdGF0ZVwiIG9yIFwid2luZG93LlN0YXRlXCIsIHRoaXMgc3R1ZmYgaXMgd2VpcmRseSBwcmVjYXJpb3VzIGFmdGVyIHR5cGVzY3JpcHRpbmdcclxuXHRcdC8vICAgIHRoaXMgY29kZWJhc2UsIGFuZCBJIGRvbid0IGhhdmUgdGhlIHNhbml0eSBwb2ludHMgdG8gZmlndXJlIG91dCB3aHlcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdHZhciBvYmogPSBTdGF0ZTtcclxuXHRcdHZhciB3ID0gbnVsbDtcclxuXHRcdGZvcih2YXIgaT0wLCBsZW49d29yZHMubGVuZ3RoLTE7aTxsZW47aSsrKXtcclxuXHRcdFx0dyA9IHdvcmRzW2ldO1xyXG5cdFx0XHRpZihvYmpbd10gPT09IHVuZGVmaW5lZCApIG9ialt3XSA9IHt9O1xyXG5cdFx0XHRvYmogPSBvYmpbd107XHJcblx0XHR9XHJcblx0XHRvYmpbd29yZHNbaV1dID0gdmFsdWU7XHJcblx0XHRyZXR1cm4gb2JqO1xyXG5cdH0sXHJcblx0XHJcblx0Ly9zZXQgc2luZ2xlIHN0YXRlXHJcblx0Ly9pZiBub0V2ZW50IGlzIHRydWUsIHRoZSB1cGRhdGUgZXZlbnQgd29uJ3QgdHJpZ2dlciwgdXNlZnVsIGZvciBzZXR0aW5nIG11bHRpcGxlIHN0YXRlcyBmaXJzdFxyXG5cdHNldDogZnVuY3Rpb24oc3RhdGVOYW1lLCB2YWx1ZSwgbm9FdmVudD8pIHtcclxuXHRcdHZhciBmdWxsUGF0aCA9ICRTTS5idWlsZFBhdGgoc3RhdGVOYW1lKTtcclxuXHRcdFxyXG5cdFx0Ly9tYWtlIHN1cmUgdGhlIHZhbHVlIGlzbid0IG92ZXIgdGhlIGVuZ2luZSBtYXhpbXVtXHJcblx0XHRpZih0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiYgdmFsdWUgPiAkU00uTUFYX1NUT1JFKSB2YWx1ZSA9ICRTTS5NQVhfU1RPUkU7XHJcblx0XHRcclxuXHRcdHRyeXtcclxuXHRcdFx0ZXZhbCgnKCcrZnVsbFBhdGgrJykgPSB2YWx1ZScpO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHQvL3BhcmVudCBkb2Vzbid0IGV4aXN0LCBzbyBtYWtlIHBhcmVudFxyXG5cdFx0XHQkU00uY3JlYXRlU3RhdGUoc3RhdGVOYW1lLCB2YWx1ZSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vc3RvcmVzIHZhbHVlcyBjYW4gbm90IGJlIG5lZ2F0aXZlXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRpZihzdGF0ZU5hbWUuaW5kZXhPZignc3RvcmVzJykgPT09IDAgJiYgJFNNLmdldChzdGF0ZU5hbWUsIHRydWUpIDwgMCkge1xyXG5cdFx0XHRldmFsKCcoJytmdWxsUGF0aCsnKSA9IDAnKTtcclxuXHRcdFx0RW5naW5lLmxvZygnV0FSTklORzogc3RhdGU6JyArIHN0YXRlTmFtZSArICcgY2FuIG5vdCBiZSBhIG5lZ2F0aXZlIHZhbHVlLiBTZXQgdG8gMCBpbnN0ZWFkLicpO1xyXG5cdFx0fVxyXG5cclxuXHRcdEVuZ2luZS5sb2coc3RhdGVOYW1lICsgJyAnICsgdmFsdWUpO1xyXG5cdFx0XHJcblx0XHRpZiAodHlwZW9mKG5vRXZlbnQpID09IFwidW5kZWZpbmVkXCIgfHwgbm9FdmVudCA9PSB0cnVlKSB7XHJcblx0XHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0XHQkU00uZmlyZVVwZGF0ZShzdGF0ZU5hbWUpO1xyXG5cdFx0fVx0XHRcclxuXHR9LFxyXG5cdFxyXG5cdC8vc2V0cyBhIGxpc3Qgb2Ygc3RhdGVzXHJcblx0c2V0TTogZnVuY3Rpb24ocGFyZW50TmFtZSwgbGlzdCwgbm9FdmVudD8pIHtcclxuXHRcdCRTTS5idWlsZFBhdGgocGFyZW50TmFtZSk7XHJcblx0XHRcclxuXHRcdC8vbWFrZSBzdXJlIHRoZSBzdGF0ZSBleGlzdHMgdG8gYXZvaWQgZXJyb3JzLFxyXG5cdFx0aWYoJFNNLmdldChwYXJlbnROYW1lKSA9PT0gdW5kZWZpbmVkKSAkU00uc2V0KHBhcmVudE5hbWUsIHt9LCB0cnVlKTtcclxuXHRcdFxyXG5cdFx0Zm9yKHZhciBrIGluIGxpc3Qpe1xyXG5cdFx0XHQkU00uc2V0KHBhcmVudE5hbWUrJ1tcIicraysnXCJdJywgbGlzdFtrXSwgdHJ1ZSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmKCFub0V2ZW50KSB7XHJcblx0XHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0XHQkU00uZmlyZVVwZGF0ZShwYXJlbnROYW1lKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdC8vc2hvcnRjdXQgZm9yIGFsdGVyaW5nIG51bWJlciB2YWx1ZXMsIHJldHVybiAxIGlmIHN0YXRlIHdhc24ndCBhIG51bWJlclxyXG5cdGFkZDogZnVuY3Rpb24oc3RhdGVOYW1lLCB2YWx1ZSwgbm9FdmVudD8pIHtcclxuXHRcdHZhciBlcnIgPSAwO1xyXG5cdFx0Ly8wIGlmIHVuZGVmaW5lZCwgbnVsbCAoYnV0IG5vdCB7fSkgc2hvdWxkIGFsbG93IGFkZGluZyB0byBuZXcgb2JqZWN0c1xyXG5cdFx0Ly9jb3VsZCBhbHNvIGFkZCBpbiBhIHRydWUgPSAxIHRoaW5nLCB0byBoYXZlIHNvbWV0aGluZyBnbyBmcm9tIGV4aXN0aW5nICh0cnVlKVxyXG5cdFx0Ly90byBiZSBhIGNvdW50LCBidXQgdGhhdCBtaWdodCBiZSB1bndhbnRlZCBiZWhhdmlvciAoYWRkIHdpdGggbG9vc2UgZXZhbCBwcm9iYWJseSB3aWxsIGhhcHBlbiBhbnl3YXlzKVxyXG5cdFx0dmFyIG9sZCA9ICRTTS5nZXQoc3RhdGVOYW1lLCB0cnVlKTtcclxuXHRcdFxyXG5cdFx0Ly9jaGVjayBmb3IgTmFOIChvbGQgIT0gb2xkKSBhbmQgbm9uIG51bWJlciB2YWx1ZXNcclxuXHRcdGlmKG9sZCAhPSBvbGQpe1xyXG5cdFx0XHRFbmdpbmUubG9nKCdXQVJOSU5HOiAnK3N0YXRlTmFtZSsnIHdhcyBjb3JydXB0ZWQgKE5hTikuIFJlc2V0dGluZyB0byAwLicpO1xyXG5cdFx0XHRvbGQgPSAwO1xyXG5cdFx0XHQkU00uc2V0KHN0YXRlTmFtZSwgb2xkICsgdmFsdWUsIG5vRXZlbnQpO1xyXG5cdFx0fSBlbHNlIGlmKHR5cGVvZiBvbGQgIT0gJ251bWJlcicgfHwgdHlwZW9mIHZhbHVlICE9ICdudW1iZXInKXtcclxuXHRcdFx0RW5naW5lLmxvZygnV0FSTklORzogQ2FuIG5vdCBkbyBtYXRoIHdpdGggc3RhdGU6JytzdGF0ZU5hbWUrJyBvciB2YWx1ZTonK3ZhbHVlKycgYmVjYXVzZSBhdCBsZWFzdCBvbmUgaXMgbm90IGEgbnVtYmVyLicpO1xyXG5cdFx0XHRlcnIgPSAxO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JFNNLnNldChzdGF0ZU5hbWUsIG9sZCArIHZhbHVlLCBub0V2ZW50KTsgLy9zZXRTdGF0ZSBoYW5kbGVzIGV2ZW50IGFuZCBzYXZlXHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBlcnI7XHJcblx0fSxcclxuXHRcclxuXHQvL2FsdGVycyBtdWx0aXBsZSBudW1iZXIgdmFsdWVzLCByZXR1cm4gbnVtYmVyIG9mIGZhaWxzXHJcblx0YWRkTTogZnVuY3Rpb24ocGFyZW50TmFtZSwgbGlzdCwgbm9FdmVudD8pIHtcclxuXHRcdHZhciBlcnIgPSAwO1xyXG5cdFx0XHJcblx0XHQvL21ha2Ugc3VyZSB0aGUgcGFyZW50IGV4aXN0cyB0byBhdm9pZCBlcnJvcnNcclxuXHRcdGlmKCRTTS5nZXQocGFyZW50TmFtZSkgPT09IHVuZGVmaW5lZCkgJFNNLnNldChwYXJlbnROYW1lLCB7fSwgdHJ1ZSk7XHJcblx0XHRcclxuXHRcdGZvcih2YXIgayBpbiBsaXN0KXtcclxuXHRcdFx0aWYoJFNNLmFkZChwYXJlbnROYW1lKydbXCInK2srJ1wiXScsIGxpc3Rba10sIHRydWUpKSBlcnIrKztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYoIW5vRXZlbnQpIHtcclxuXHRcdFx0RW5naW5lLnNhdmVHYW1lKCk7XHJcblx0XHRcdCRTTS5maXJlVXBkYXRlKHBhcmVudE5hbWUpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGVycjtcclxuXHR9LFxyXG5cdFxyXG5cdC8vcmV0dXJuIHN0YXRlLCB1bmRlZmluZWQgb3IgMFxyXG5cdGdldDogZnVuY3Rpb24oc3RhdGVOYW1lLCByZXF1ZXN0WmVybz8pOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBOdW1iZXIgfCBudWxsIHwgQm9vbGVhbiB7XHJcblx0XHR2YXIgd2hpY2hTdGF0ZTogdW5kZWZpbmVkIHwgbnVsbCB8IE51bWJlciB8IHN0cmluZyA9IG51bGw7XHJcblx0XHR2YXIgZnVsbFBhdGggPSAkU00uYnVpbGRQYXRoKHN0YXRlTmFtZSk7XHJcblx0XHRcclxuXHRcdC8vY2F0Y2ggZXJyb3JzIGlmIHBhcmVudCBvZiBzdGF0ZSBkb2Vzbid0IGV4aXN0XHJcblx0XHR0cnl7XHJcblx0XHRcdGV2YWwoJ3doaWNoU3RhdGUgPSAoJytmdWxsUGF0aCsnKScpO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHR3aGljaFN0YXRlID0gdW5kZWZpbmVkO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvL3ByZXZlbnRzIHJlcGVhdGVkIGlmIHVuZGVmaW5lZCwgbnVsbCwgZmFsc2Ugb3Ige30sIHRoZW4geCA9IDAgc2l0dWF0aW9uc1xyXG5cdFx0aWYoKCF3aGljaFN0YXRlXHJcblx0XHRcdC8vICB8fCB3aGljaFN0YXRlID09IHt9XHJcblx0XHRcdCkgJiYgcmVxdWVzdFplcm8pIHJldHVybiAwO1xyXG5cdFx0ZWxzZSByZXR1cm4gd2hpY2hTdGF0ZTtcclxuXHR9LFxyXG5cdFxyXG5cdC8vbWFpbmx5IGZvciBsb2NhbCBjb3B5IHVzZSwgYWRkKE0pIGNhbiBmYWlsIHNvIHdlIGNhbid0IHNob3J0Y3V0IHRoZW1cclxuXHQvL3NpbmNlIHNldCBkb2VzIG5vdCBmYWlsLCB3ZSBrbm93IHN0YXRlIGV4aXN0cyBhbmQgY2FuIHNpbXBseSByZXR1cm4gdGhlIG9iamVjdFxyXG5cdHNldGdldDogZnVuY3Rpb24oc3RhdGVOYW1lLCB2YWx1ZSwgbm9FdmVudD8pe1xyXG5cdFx0JFNNLnNldChzdGF0ZU5hbWUsIHZhbHVlLCBub0V2ZW50KTtcclxuXHRcdHJldHVybiBldmFsKCcoJyskU00uYnVpbGRQYXRoKHN0YXRlTmFtZSkrJyknKTtcclxuXHR9LFxyXG5cdFxyXG5cdHJlbW92ZTogZnVuY3Rpb24oc3RhdGVOYW1lLCBub0V2ZW50Pykge1xyXG5cdFx0dmFyIHdoaWNoU3RhdGUgPSAkU00uYnVpbGRQYXRoKHN0YXRlTmFtZSk7XHJcblx0XHR0cnl7XHJcblx0XHRcdGV2YWwoJyhkZWxldGUgJyt3aGljaFN0YXRlKycpJyk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdC8vaXQgZGlkbid0IGV4aXN0IGluIHRoZSBmaXJzdCBwbGFjZVxyXG5cdFx0XHRFbmdpbmUubG9nKCdXQVJOSU5HOiBUcmllZCB0byByZW1vdmUgbm9uLWV4aXN0YW50IHN0YXRlIFxcJycrc3RhdGVOYW1lKydcXCcuJyk7XHJcblx0XHR9XHJcblx0XHRpZighbm9FdmVudCl7XHJcblx0XHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0XHQkU00uZmlyZVVwZGF0ZShzdGF0ZU5hbWUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0Ly9jcmVhdGVzIGZ1bGwgcmVmZXJlbmNlIGZyb20gaW5wdXRcclxuXHQvL2hvcGVmdWxseSB0aGlzIHdvbid0IGV2ZXIgbmVlZCB0byBiZSBtb3JlIGNvbXBsaWNhdGVkXHJcblx0YnVpbGRQYXRoOiBmdW5jdGlvbihpbnB1dCl7XHJcblx0XHR2YXIgZG90ID0gKGlucHV0LmNoYXJBdCgwKSA9PSAnWycpPyAnJyA6ICcuJzsgLy9pZiBpdCBzdGFydHMgd2l0aCBbZm9vXSBubyBkb3QgdG8gam9pblxyXG5cdFx0cmV0dXJuICdTdGF0ZScgKyBkb3QgKyBpbnB1dDtcclxuXHR9LFxyXG5cdFxyXG5cdGZpcmVVcGRhdGU6IGZ1bmN0aW9uKHN0YXRlTmFtZSwgc2F2ZT8pe1xyXG5cdFx0dmFyIGNhdGVnb3J5ID0gJFNNLmdldENhdGVnb3J5KHN0YXRlTmFtZSk7XHJcblx0XHRpZihzdGF0ZU5hbWUgPT0gdW5kZWZpbmVkKSBzdGF0ZU5hbWUgPSBjYXRlZ29yeSA9ICdhbGwnOyAvL2Jlc3QgaWYgdGhpcyBkb2Vzbid0IGhhcHBlbiBhcyBpdCB3aWxsIHRyaWdnZXIgbW9yZSBzdHVmZlxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5wdWJsaXNoKHsnY2F0ZWdvcnknOiBjYXRlZ29yeSwgJ3N0YXRlTmFtZSc6c3RhdGVOYW1lfSk7XHJcblx0XHRpZihzYXZlKSBFbmdpbmUuc2F2ZUdhbWUoKTtcclxuXHR9LFxyXG5cdFxyXG5cdGdldENhdGVnb3J5OiBmdW5jdGlvbihzdGF0ZU5hbWUpe1xyXG5cdFx0dmFyIGZpcnN0T0IgPSBzdGF0ZU5hbWUuaW5kZXhPZignWycpO1xyXG5cdFx0dmFyIGZpcnN0RG90ID0gc3RhdGVOYW1lLmluZGV4T2YoJy4nKTtcclxuXHRcdHZhciBjdXRvZmYgPSBudWxsO1xyXG5cdFx0aWYoZmlyc3RPQiA9PSAtMSB8fCBmaXJzdERvdCA9PSAtMSl7XHJcblx0XHRcdGN1dG9mZiA9IGZpcnN0T0IgPiBmaXJzdERvdCA/IGZpcnN0T0IgOiBmaXJzdERvdDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGN1dG9mZiA9IGZpcnN0T0IgPCBmaXJzdERvdCA/IGZpcnN0T0IgOiBmaXJzdERvdDtcclxuXHRcdH1cclxuXHRcdGlmIChjdXRvZmYgPT0gLTEpe1xyXG5cdFx0XHRyZXR1cm4gc3RhdGVOYW1lO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHN0YXRlTmFtZS5zdWJzdHIoMCxjdXRvZmYpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cdCAqIFN0YXJ0IG9mIHNwZWNpZmljIHN0YXRlIGZ1bmN0aW9uc1xyXG5cdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblx0Ly9QRVJLU1xyXG5cdGFkZFBlcms6IGZ1bmN0aW9uKG5hbWUpIHtcclxuXHRcdCRTTS5zZXQoJ2NoYXJhY3Rlci5wZXJrc1tcIicrbmFtZSsnXCJdJywgdHJ1ZSk7XHJcblx0XHROb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBFbmdpbmUuUGVya3NbbmFtZV0ubm90aWZ5KTtcclxuXHR9LFxyXG5cdFxyXG5cdGhhc1Blcms6IGZ1bmN0aW9uKG5hbWUpIHtcclxuXHRcdHJldHVybiAkU00uZ2V0KCdjaGFyYWN0ZXIucGVya3NbXCInK25hbWUrJ1wiXScpO1xyXG5cdH0sXHJcblx0XHJcblx0Ly9JTkNPTUVcclxuXHRzZXRJbmNvbWU6IGZ1bmN0aW9uKHNvdXJjZSwgb3B0aW9ucykge1xyXG5cdFx0dmFyIGV4aXN0aW5nID0gJFNNLmdldCgnaW5jb21lW1wiJytzb3VyY2UrJ1wiXScpO1xyXG5cdFx0aWYodHlwZW9mIGV4aXN0aW5nICE9ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdG9wdGlvbnMudGltZUxlZnQgPSAoZXhpc3RpbmcgYXMgYW55KT8udGltZUxlZnQ7XHJcblx0XHR9XHJcblx0XHQkU00uc2V0KCdpbmNvbWVbXCInK3NvdXJjZSsnXCJdJywgb3B0aW9ucyk7XHJcblx0fSxcclxuXHRcclxuXHRnZXRJbmNvbWU6IGZ1bmN0aW9uKHNvdXJjZSkge1xyXG5cdFx0dmFyIGV4aXN0aW5nID0gJFNNLmdldCgnaW5jb21lW1wiJytzb3VyY2UrJ1wiXScpO1xyXG5cdFx0aWYodHlwZW9mIGV4aXN0aW5nICE9ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdHJldHVybiBleGlzdGluZztcclxuXHRcdH1cclxuXHRcdHJldHVybiB7fTtcclxuXHR9LFx0XHJcblx0XHJcblx0Ly9NaXNjXHJcblx0bnVtOiBmdW5jdGlvbihuYW1lLCBjcmFmdGFibGUpIHtcclxuXHRcdHN3aXRjaChjcmFmdGFibGUudHlwZSkge1xyXG5cdFx0Y2FzZSAnZ29vZCc6XHJcblx0XHRjYXNlICd0b29sJzpcclxuXHRcdGNhc2UgJ3dlYXBvbic6XHJcblx0XHRjYXNlICd1cGdyYWRlJzpcclxuXHRcdFx0cmV0dXJuICRTTS5nZXQoJ3N0b3Jlc1tcIicrbmFtZSsnXCJdJywgdHJ1ZSk7XHJcblx0XHRjYXNlICdidWlsZGluZyc6XHJcblx0XHRcdHJldHVybiAkU00uZ2V0KCdnYW1lLmJ1aWxkaW5nc1tcIicrbmFtZSsnXCJdJywgdHJ1ZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRoYW5kbGVTdGF0ZVVwZGF0ZXM6IGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHJcblx0fVx0XHJcbn07XHJcblxyXG4vL2FsaWFzXHJcbmV4cG9ydCBjb25zdCAkU00gPSBTdGF0ZU1hbmFnZXI7XHJcbiIsImltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tICcuL25vdGlmaWNhdGlvbnMnO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tICcuL3N0YXRlX21hbmFnZXInO1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tICcuL2VuZ2luZSc7XHJcblxyXG5leHBvcnQgY29uc3QgV2VhdGhlciA9IHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHJcbiAgICAgICAgLy9zdWJzY3JpYmUgdG8gc3RhdGVVcGRhdGVzXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5zdWJzY3JpYmUoV2VhdGhlci5oYW5kbGVTdGF0ZVVwZGF0ZXMpO1xyXG4gICAgfSxcclxuXHJcbiAgICBoYW5kbGVTdGF0ZVVwZGF0ZXM6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBpZiAoZS5jYXRlZ29yeSA9PSAnd2VhdGhlcicpIHtcclxuICAgICAgICAgICAgc3dpdGNoICgkU00uZ2V0KCd3ZWF0aGVyJykpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3N1bm55JzogXHJcbiAgICAgICAgICAgICAgICAgICAgV2VhdGhlci5zdGFydFN1bm55KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdjbG91ZHknOlxyXG4gICAgICAgICAgICAgICAgICAgIFdlYXRoZXIuc3RhcnRDbG91ZHkoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3JhaW55JzpcclxuICAgICAgICAgICAgICAgICAgICBXZWF0aGVyLnN0YXJ0UmFpbnkoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9sYXN0V2VhdGhlcjogJ3N1bm55JyxcclxuXHJcbiAgICBzdGFydFN1bm55OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIlRoZSBzdW4gYmVnaW5zIHRvIHNoaW5lLlwiKTtcclxuICAgICAgICBXZWF0aGVyLl9sYXN0V2VhdGhlciA9ICdzdW5ueSc7XHJcbiAgICAgICAgJCgnYm9keScpLmFuaW1hdGUoe2JhY2tncm91bmRDb2xvcjogJyNGRkZGRkYnfSwgJ3Nsb3cnKTtcclxuICAgICAgICAkKCdkaXYjc3RvcmVzOjpiZWZvcmUnKS5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6ICcjRkZGRkZGJ30sICdzbG93Jyk7XHJcbiAgICAgICAgV2VhdGhlci5tYWtlUmFpblN0b3AoKTtcclxuICAgIH0sXHJcblxyXG4gICAgc3RhcnRDbG91ZHk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmIChXZWF0aGVyLl9sYXN0V2VhdGhlciA9PSAnc3VubnknKSB7XHJcbiAgICAgICAgICAgIE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiQ2xvdWRzIHJvbGwgaW4sIG9ic2N1cmluZyB0aGUgc3VuLlwiKTtcclxuICAgICAgICB9IGVsc2UgaWYgKFdlYXRoZXIuX2xhc3RXZWF0aGVyID09ICdyYWlueScpIHtcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJUaGUgcmFpbiBicmVha3MsIGJ1dCB0aGUgY2xvdWRzIHJlbWFpbi5cIilcclxuICAgICAgICB9XHJcbiAgICAgICAgJCgnYm9keScpLmFuaW1hdGUoe2JhY2tncm91bmRDb2xvcjogJyM4Qjg3ODYnfSwgJ3Nsb3cnKTtcclxuICAgICAgICAkKCdkaXYjc3RvcmVzOjpiZWZvcmUnKS5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6ICcjOEI4Nzg2J30sICdzbG93Jyk7XHJcbiAgICAgICAgV2VhdGhlci5fbGFzdFdlYXRoZXIgPSAnY2xvdWR5JztcclxuICAgICAgICBXZWF0aGVyLm1ha2VSYWluU3RvcCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzdGFydFJhaW55OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoV2VhdGhlci5fbGFzdFdlYXRoZXIgPT0gJ3N1bm55Jykge1xyXG4gICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIlRoZSB3aW5kIHN1ZGRlbmx5IHBpY2tzIHVwLiBDbG91ZHMgcm9sbCBpbiwgaGVhdnkgd2l0aCByYWluLCBhbmQgcmFpbmRyb3BzIGZhbGwgc29vbiBhZnRlci5cIik7XHJcbiAgICAgICAgfSBlbHNlIGlmIChXZWF0aGVyLl9sYXN0V2VhdGhlciA9PSAnY2xvdWR5Jykge1xyXG4gICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIlRoZSBjbG91ZHMgdGhhdCB3ZXJlIHByZXZpb3VzbHkgY29udGVudCB0byBoYW5nIG92ZXJoZWFkIGxldCBsb29zZSBhIG1vZGVyYXRlIGRvd25wb3VyLlwiKVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAkKCdib2R5JykuYW5pbWF0ZSh7YmFja2dyb3VuZENvbG9yOiAnIzZENjk2OCd9LCAnc2xvdycpO1xyXG4gICAgICAgICQoJ2RpdiNzdG9yZXM6OmJlZm9yZScpLmFuaW1hdGUoe2JhY2tncm91bmRDb2xvcjogJyM2RDY5NjgnfSwgJ3Nsb3cnKTtcclxuICAgICAgICBXZWF0aGVyLl9sYXN0V2VhdGhlciA9ICdyYWlueSc7XHJcbiAgICAgICAgV2VhdGhlci5tYWtlSXRSYWluKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIF9sb2NhdGlvbjogJycsXHJcblxyXG4gICAgaW5pdGlhdGVXZWF0aGVyOiBmdW5jdGlvbihhdmFpbGFibGVXZWF0aGVyLCBsb2NhdGlvbikge1xyXG4gICAgICAgIGlmIChXZWF0aGVyLl9sb2NhdGlvbiA9PSAnJykgV2VhdGhlci5fbG9jYXRpb24gPSBsb2NhdGlvbjtcclxuICAgICAgICAvLyBpZiBpbiBuZXcgbG9jYXRpb24sIGVuZCB3aXRob3V0IHRyaWdnZXJpbmcgYSBuZXcgd2VhdGhlciBpbml0aWF0aW9uLCBcclxuICAgICAgICAvLyBsZWF2aW5nIHRoZSBuZXcgbG9jYXRpb24ncyBpbml0aWF0ZVdlYXRoZXIgY2FsbGJhY2sgdG8gZG8gaXRzIHRoaW5nXHJcbiAgICAgICAgZWxzZSBpZiAoV2VhdGhlci5fbG9jYXRpb24gIT0gbG9jYXRpb24pIHJldHVybjsgXHJcblxyXG4gICAgICAgIHZhciBjaG9zZW5XZWF0aGVyID0gJ25vbmUnO1xyXG4gICAgICAgIC8vZ2V0IG91ciByYW5kb20gZnJvbSAwIHRvIDFcclxuICAgICAgICB2YXIgcm5kID0gTWF0aC5yYW5kb20oKTtcclxuICBcclxuICAgICAgICAvL2luaXRpYWxpc2Ugb3VyIGN1bXVsYXRpdmUgcGVyY2VudGFnZVxyXG4gICAgICAgIHZhciBjdW11bGF0aXZlQ2hhbmNlID0gMDtcclxuICAgICAgICBmb3IgKHZhciBpIGluIGF2YWlsYWJsZVdlYXRoZXIpIHtcclxuICAgICAgICAgICAgY3VtdWxhdGl2ZUNoYW5jZSArPSBhdmFpbGFibGVXZWF0aGVyW2ldO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHJuZCA8IGN1bXVsYXRpdmVDaGFuY2UpIHtcclxuICAgICAgICAgICAgICAgIGNob3NlbldlYXRoZXIgPSBpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjaG9zZW5XZWF0aGVyICE9ICRTTS5nZXQoJ3dlYXRoZXInKSkgJFNNLnNldCgnd2VhdGhlcicsIGNob3NlbldlYXRoZXIpO1xyXG4gICAgICAgIEVuZ2luZS5zZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pbml0aWF0ZVdlYXRoZXIoYXZhaWxhYmxlV2VhdGhlciwgbG9jYXRpb24pO1xyXG4gICAgICAgIH0sIDMgKiA2MCAqIDEwMDApO1xyXG4gICAgfSxcclxuXHJcbiAgICBtYWtlSXRSYWluOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBodHRwczovL2NvZGVwZW4uaW8vYXJpY2tsZS9wZW4vWEtqTVpZXHJcbiAgICAgICAgLy9jbGVhciBvdXQgZXZlcnl0aGluZ1xyXG4gICAgICAgICQoJy5yYWluJykuZW1wdHkoKTtcclxuICAgICAgXHJcbiAgICAgICAgdmFyIGluY3JlbWVudCA9IDA7XHJcbiAgICAgICAgdmFyIGRyb3BzID0gXCJcIjtcclxuICAgICAgICB2YXIgYmFja0Ryb3BzID0gXCJcIjtcclxuICAgICAgXHJcbiAgICAgICAgd2hpbGUgKGluY3JlbWVudCA8IDEwMCkge1xyXG4gICAgICAgICAgLy9jb3VwbGUgcmFuZG9tIG51bWJlcnMgdG8gdXNlIGZvciB2YXJpb3VzIHJhbmRvbWl6YXRpb25zXHJcbiAgICAgICAgICAvL3JhbmRvbSBudW1iZXIgYmV0d2VlbiA5OCBhbmQgMVxyXG4gICAgICAgICAgdmFyIHJhbmRvSHVuZG8gPSAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDk4IC0gMSArIDEpICsgMSkpO1xyXG4gICAgICAgICAgLy9yYW5kb20gbnVtYmVyIGJldHdlZW4gNSBhbmQgMlxyXG4gICAgICAgICAgdmFyIHJhbmRvRml2ZXIgPSAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDUgLSAyICsgMSkgKyAyKSk7XHJcbiAgICAgICAgICAvL2luY3JlbWVudFxyXG4gICAgICAgICAgaW5jcmVtZW50ICs9IHJhbmRvRml2ZXI7XHJcbiAgICAgICAgICAvL2FkZCBpbiBhIG5ldyByYWluZHJvcCB3aXRoIHZhcmlvdXMgcmFuZG9taXphdGlvbnMgdG8gY2VydGFpbiBDU1MgcHJvcGVydGllc1xyXG4gICAgICAgICAgZHJvcHMgKz0gJzxkaXYgY2xhc3M9XCJkcm9wXCIgc3R5bGU9XCJsZWZ0OiAnICsgaW5jcmVtZW50ICsgJyU7IGJvdHRvbTogJyArIChyYW5kb0ZpdmVyICsgcmFuZG9GaXZlciAtIDEgKyAxMDApICsgJyU7IGFuaW1hdGlvbi1kZWxheTogMC4nICsgcmFuZG9IdW5kbyArICdzOyBhbmltYXRpb24tZHVyYXRpb246IDAuNScgKyByYW5kb0h1bmRvICsgJ3M7XCI+PGRpdiBjbGFzcz1cInN0ZW1cIiBzdHlsZT1cImFuaW1hdGlvbi1kZWxheTogMC4nICsgcmFuZG9IdW5kbyArICdzOyBhbmltYXRpb24tZHVyYXRpb246IDAuNScgKyByYW5kb0h1bmRvICsgJ3M7XCI+PC9kaXY+PGRpdiBjbGFzcz1cInNwbGF0XCIgc3R5bGU9XCJhbmltYXRpb24tZGVsYXk6IDAuJyArIHJhbmRvSHVuZG8gKyAnczsgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjUnICsgcmFuZG9IdW5kbyArICdzO1wiPjwvZGl2PjwvZGl2Pic7XHJcbiAgICAgICAgICBiYWNrRHJvcHMgKz0gJzxkaXYgY2xhc3M9XCJkcm9wXCIgc3R5bGU9XCJyaWdodDogJyArIGluY3JlbWVudCArICclOyBib3R0b206ICcgKyAocmFuZG9GaXZlciArIHJhbmRvRml2ZXIgLSAxICsgMTAwKSArICclOyBhbmltYXRpb24tZGVsYXk6IDAuJyArIHJhbmRvSHVuZG8gKyAnczsgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjUnICsgcmFuZG9IdW5kbyArICdzO1wiPjxkaXYgY2xhc3M9XCJzdGVtXCIgc3R5bGU9XCJhbmltYXRpb24tZGVsYXk6IDAuJyArIHJhbmRvSHVuZG8gKyAnczsgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjUnICsgcmFuZG9IdW5kbyArICdzO1wiPjwvZGl2PjxkaXYgY2xhc3M9XCJzcGxhdFwiIHN0eWxlPVwiYW5pbWF0aW9uLWRlbGF5OiAwLicgKyByYW5kb0h1bmRvICsgJ3M7IGFuaW1hdGlvbi1kdXJhdGlvbjogMC41JyArIHJhbmRvSHVuZG8gKyAncztcIj48L2Rpdj48L2Rpdj4nO1xyXG4gICAgICAgIH1cclxuICAgICAgXHJcbiAgICAgICAgJCgnLnJhaW4uZnJvbnQtcm93JykuYXBwZW5kKGRyb3BzKTtcclxuICAgICAgICAkKCcucmFpbi5iYWNrLXJvdycpLmFwcGVuZChiYWNrRHJvcHMpO1xyXG4gICAgfSxcclxuXHJcbiAgICBtYWtlUmFpblN0b3A6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQoJy5yYWluJykuZW1wdHkoKTtcclxuICAgIH1cclxufSJdfQ==
