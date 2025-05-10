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
        state_manager_1.$SM.set('inventory', exports.Character.inventory);
    },
    removeFromInventory: function (item, amount) {
        if (amount === void 0) { amount = 1; }
        if (exports.Character.inventory[item])
            exports.Character.inventory[item] -= amount;
        if (exports.Character.inventory[item] < 1) {
            delete exports.Character.inventory[item];
        }
        state_manager_1.$SM.set('inventory', exports.Character.inventory);
    },
    useInventoryItem: function (item) {
        if (exports.Character.inventory[item] && exports.Character.inventory[item] > 0) {
            // use the effect in the inventory; just in case a name matches but the effect
            // does not, assume the inventory item is the source of truth
            itemList_1.ItemList[item].onUse();
            // please don't make this unreadable nonsense in a future refactor, just
            // let it be this way
            if (typeof (itemList_1.ItemList[item].destroyOnUse) == "function" && itemList_1.ItemList[item].destroyOnUse()) {
                exports.Character.removeFromInventory(item);
            }
            else if (itemList_1.ItemList[item].destroyOnUse) {
                exports.Character.removeFromInventory(item);
            }
        }
        // TODO: write to $SM
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
        // TODO: write to $SM
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
        // TODO: write to $SM
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
        name: 'A Brief History of Chadtopia',
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
        name: 'A smooth black stone',
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
        name: 'A knife wrapped in cloth',
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
        name: 'A silver knife',
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
        name: 'A bundle of cloth',
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
        if (!noEvent) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL3RyYW5zbGF0ZS50cyIsInNyYy9zY3JpcHQvQnV0dG9uLnRzIiwic3JjL3NjcmlwdC9jaGFyYWN0ZXJzL2NhcHRhaW4udHMiLCJzcmMvc2NyaXB0L2NoYXJhY3RlcnMvbGl6LnRzIiwic3JjL3NjcmlwdC9jaGFyYWN0ZXJzL21heW9yLnRzIiwic3JjL3NjcmlwdC9lbmdpbmUudHMiLCJzcmMvc2NyaXB0L2V2ZW50cy50cyIsInNyYy9zY3JpcHQvZXZlbnRzL3JvYWR3YW5kZXIudHMiLCJzcmMvc2NyaXB0L2V2ZW50cy9yb29tLnRzIiwic3JjL3NjcmlwdC9oZWFkZXIudHMiLCJzcmMvc2NyaXB0L25vdGlmaWNhdGlvbnMudHMiLCJzcmMvc2NyaXB0L3BsYWNlcy9vdXRwb3N0LnRzIiwic3JjL3NjcmlwdC9wbGFjZXMvcm9hZC50cyIsInNyYy9zY3JpcHQvcGxhY2VzL3Jvb20udHMiLCJzcmMvc2NyaXB0L3BsYXllci9jaGFyYWN0ZXIudHMiLCJzcmMvc2NyaXB0L3BsYXllci9pdGVtTGlzdC50cyIsInNyYy9zY3JpcHQvcGxheWVyL3F1ZXN0TG9nLnRzIiwic3JjL3NjcmlwdC9zdGF0ZV9tYW5hZ2VyLnRzIiwic3JjL3NjcmlwdC93ZWF0aGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLGdCQUFnQjs7O0FBRWhCLGtDQUFrQztBQUNsQyxLQUFLO0FBQ0wsdUNBQXVDO0FBRXZDLG9DQUFvQztBQUNwQyxNQUFNO0FBQ04sMkNBQTJDO0FBQzNDLE1BQU07QUFDTixtQ0FBbUM7QUFDbkMsTUFBTTtBQUNOLHNDQUFzQztBQUN0QywwQ0FBMEM7QUFFMUMscUNBQXFDO0FBQ3JDLE1BQU07QUFFTixrQkFBa0I7QUFDbEIsTUFBTTtBQUVOLDhEQUE4RDtBQUM5RCxvQ0FBb0M7QUFFcEMsdUhBQXVIO0FBQ3ZILHdDQUF3QztBQUN4Qyw2QkFBNkI7QUFDN0Is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VixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDdkIsQ0FBQztDQUNKLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyAoZnVuY3Rpb24oKSB7XHJcblxyXG4vLyBcdHZhciB0cmFuc2xhdGUgPSBmdW5jdGlvbih0ZXh0KVxyXG4vLyBcdHtcclxuLy8gXHRcdHZhciB4bGF0ZSA9IHRyYW5zbGF0ZUxvb2t1cCh0ZXh0KTtcclxuXHRcdFxyXG4vLyBcdFx0aWYgKHR5cGVvZiB4bGF0ZSA9PSBcImZ1bmN0aW9uXCIpXHJcbi8vIFx0XHR7XHJcbi8vIFx0XHRcdHhsYXRlID0geGxhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuLy8gXHRcdH1cclxuLy8gXHRcdGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKVxyXG4vLyBcdFx0e1xyXG4vLyBcdFx0XHR2YXIgYXBzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xyXG4vLyBcdFx0XHR2YXIgYXJncyA9IGFwcy5jYWxsKCBhcmd1bWVudHMsIDEgKTtcclxuICBcclxuLy8gXHRcdFx0eGxhdGUgPSBmb3JtYXR0ZXIoeGxhdGUsIGFyZ3MpO1xyXG4vLyBcdFx0fVxyXG5cdFx0XHJcbi8vIFx0XHRyZXR1cm4geGxhdGU7XHJcbi8vIFx0fTtcclxuXHRcclxuLy8gXHQvLyBJIHdhbnQgaXQgYXZhaWxhYmxlIGV4cGxpY2l0eSBhcyB3ZWxsIGFzIHZpYSB0aGUgb2JqZWN0XHJcbi8vIFx0dHJhbnNsYXRlLnRyYW5zbGF0ZSA9IHRyYW5zbGF0ZTtcclxuXHRcclxuLy8gXHQvL2Zyb20gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vNzc2MTk2IHZpYSBodHRwOi8vZGF2ZWRhc2guY29tLzIwMTAvMTEvMTkvcHl0aG9uaWMtc3RyaW5nLWZvcm1hdHRpbmctaW4tamF2YXNjcmlwdC8gXHJcbi8vIFx0dmFyIGRlZmF1bHRGb3JtYXR0ZXIgPSAoZnVuY3Rpb24oKSB7XHJcbi8vIFx0XHR2YXIgcmUgPSAvXFx7KFtefV0rKVxcfS9nO1xyXG4vLyBcdFx0cmV0dXJuIGZ1bmN0aW9uKHMsIGFyZ3MpIHtcclxuLy8gXHRcdFx0cmV0dXJuIHMucmVwbGFjZShyZSwgZnVuY3Rpb24oXywgbWF0Y2gpeyByZXR1cm4gYXJnc1ttYXRjaF07IH0pO1xyXG4vLyBcdFx0fTtcclxuLy8gXHR9KCkpO1xyXG4vLyBcdHZhciBmb3JtYXR0ZXIgPSBkZWZhdWx0Rm9ybWF0dGVyO1xyXG4vLyBcdHRyYW5zbGF0ZS5zZXRGb3JtYXR0ZXIgPSBmdW5jdGlvbihuZXdGb3JtYXR0ZXIpXHJcbi8vIFx0e1xyXG4vLyBcdFx0Zm9ybWF0dGVyID0gbmV3Rm9ybWF0dGVyO1xyXG4vLyBcdH07XHJcblx0XHJcbi8vIFx0dHJhbnNsYXRlLmZvcm1hdCA9IGZ1bmN0aW9uKClcclxuLy8gXHR7XHJcbi8vIFx0XHR2YXIgYXBzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xyXG4vLyBcdFx0dmFyIHMgPSBhcmd1bWVudHNbMF07XHJcbi8vIFx0XHR2YXIgYXJncyA9IGFwcy5jYWxsKCBhcmd1bWVudHMsIDEgKTtcclxuICBcclxuLy8gXHRcdHJldHVybiBmb3JtYXR0ZXIocywgYXJncyk7XHJcbi8vIFx0fTtcclxuXHJcbi8vIFx0dmFyIGR5bm9UcmFucyA9IG51bGw7XHJcbi8vIFx0dHJhbnNsYXRlLnNldER5bmFtaWNUcmFuc2xhdG9yID0gZnVuY3Rpb24obmV3RHlub1RyYW5zKVxyXG4vLyBcdHtcclxuLy8gXHRcdGR5bm9UcmFucyA9IG5ld0R5bm9UcmFucztcclxuLy8gXHR9O1xyXG5cclxuLy8gXHR2YXIgdHJhbnNsYXRpb24gPSBudWxsO1xyXG4vLyBcdHRyYW5zbGF0ZS5zZXRUcmFuc2xhdGlvbiA9IGZ1bmN0aW9uKG5ld1RyYW5zbGF0aW9uKVxyXG4vLyBcdHtcclxuLy8gXHRcdHRyYW5zbGF0aW9uID0gbmV3VHJhbnNsYXRpb247XHJcbi8vIFx0fTtcclxuXHRcclxuLy8gXHRmdW5jdGlvbiB0cmFuc2xhdGVMb29rdXAodGFyZ2V0KVxyXG4vLyBcdHtcclxuLy8gXHRcdGlmICh0cmFuc2xhdGlvbiA9PSBudWxsIHx8IHRhcmdldCA9PSBudWxsKVxyXG4vLyBcdFx0e1xyXG4vLyBcdFx0XHRyZXR1cm4gdGFyZ2V0O1xyXG4vLyBcdFx0fVxyXG5cdFx0XHJcbi8vIFx0XHRpZiAodGFyZ2V0IGluIHRyYW5zbGF0aW9uID09IGZhbHNlKVxyXG4vLyBcdFx0e1xyXG4vLyBcdFx0XHRpZiAoZHlub1RyYW5zICE9IG51bGwpXHJcbi8vIFx0XHRcdHtcclxuLy8gXHRcdFx0XHRyZXR1cm4gZHlub1RyYW5zKHRhcmdldCk7XHJcbi8vIFx0XHRcdH1cclxuLy8gXHRcdFx0cmV0dXJuIHRhcmdldDtcclxuLy8gXHRcdH1cclxuXHRcdFxyXG4vLyBcdFx0dmFyIHJlc3VsdCA9IHRyYW5zbGF0aW9uW3RhcmdldF07XHJcbi8vIFx0XHRpZiAocmVzdWx0ID09IG51bGwpXHJcbi8vIFx0XHR7XHJcbi8vIFx0XHRcdHJldHVybiB0YXJnZXQ7XHJcbi8vIFx0XHR9XHJcblx0XHRcclxuLy8gXHRcdHJldHVybiByZXN1bHQ7XHJcbi8vIFx0fTtcclxuXHRcclxuLy8gXHR3aW5kb3cuXyA9IHRyYW5zbGF0ZTtcclxuXHJcbi8vIH0pKCk7XHJcblxyXG4vLyBleHBvcnQgY29uc3QgXyA9IHdpbmRvdy5fO1xyXG5cclxuZXhwb3J0IGNvbnN0IF8gPSBmdW5jdGlvbihzKSB7IHJldHVybiBzOyB9IiwiaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4vZW5naW5lXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEJ1dHRvbiA9IHtcclxuXHRCdXR0b246IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHRcdGlmKHR5cGVvZiBvcHRpb25zLmNvb2xkb3duID09ICdudW1iZXInKSB7XHJcblx0XHRcdHRoaXMuZGF0YV9jb29sZG93biA9IG9wdGlvbnMuY29vbGRvd247XHJcblx0XHR9XHJcblx0XHR0aGlzLmRhdGFfcmVtYWluaW5nID0gMDtcclxuXHRcdGlmKHR5cGVvZiBvcHRpb25zLmNsaWNrID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0dGhpcy5kYXRhX2hhbmRsZXIgPSBvcHRpb25zLmNsaWNrO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR2YXIgZWwgPSAkKCc8ZGl2PicpXHJcblx0XHRcdC5hdHRyKCdpZCcsIHR5cGVvZihvcHRpb25zLmlkKSAhPSAndW5kZWZpbmVkJyA/IG9wdGlvbnMuaWQgOiBcIkJUTl9cIiArIEVuZ2luZS5nZXRHdWlkKCkpXHJcblx0XHRcdC5hZGRDbGFzcygnYnV0dG9uJylcclxuXHRcdFx0LnRleHQodHlwZW9mKG9wdGlvbnMudGV4dCkgIT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLnRleHQgOiBcImJ1dHRvblwiKVxyXG5cdFx0XHQuY2xpY2soZnVuY3Rpb24oKSB7IFxyXG5cdFx0XHRcdGlmKCEkKHRoaXMpLmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XHJcblx0XHRcdFx0XHRCdXR0b24uY29vbGRvd24oJCh0aGlzKSk7XHJcblx0XHRcdFx0XHQkKHRoaXMpLmRhdGEoXCJoYW5kbGVyXCIpKCQodGhpcykpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0LmRhdGEoXCJoYW5kbGVyXCIsICB0eXBlb2Ygb3B0aW9ucy5jbGljayA9PSAnZnVuY3Rpb24nID8gb3B0aW9ucy5jbGljayA6IGZ1bmN0aW9uKCkgeyBFbmdpbmUubG9nKFwiY2xpY2tcIik7IH0pXHJcblx0XHRcdC5kYXRhKFwicmVtYWluaW5nXCIsIDApXHJcblx0XHRcdC5kYXRhKFwiY29vbGRvd25cIiwgdHlwZW9mIG9wdGlvbnMuY29vbGRvd24gPT0gJ251bWJlcicgPyBvcHRpb25zLmNvb2xkb3duIDogMCk7XHJcblx0XHRpZiAodHlwZW9mKG9wdGlvbnMuaW1hZ2UpICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcblx0XHRcdGVsLmF0dHIoXCJzdHlsZVwiLCBcImJhY2tncm91bmQtaW1hZ2U6IHVybChcXFwiXCIgKyBvcHRpb25zLmltYWdlICsgXCJcXFwiKTsgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDsgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjsgaGVpZ2h0OiAxNzBweDsgY29sb3I6IHdoaXRlO3RleHQtc2hhZG93OiAwcHggMHB4IDJweCBibGFja1wiKVxyXG5cdFx0fVxyXG5cdFx0ZWwuYXBwZW5kKCQoXCI8ZGl2PlwiKS5hZGRDbGFzcygnY29vbGRvd24nKSk7XHJcblx0XHRcclxuXHRcdGlmKG9wdGlvbnMuY29zdCkge1xyXG5cdFx0XHR2YXIgdHRQb3MgPSBvcHRpb25zLnR0UG9zID8gb3B0aW9ucy50dFBvcyA6IFwiYm90dG9tIHJpZ2h0XCI7XHJcblx0XHRcdHZhciBjb3N0VG9vbHRpcCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ3Rvb2x0aXAgJyArIHR0UG9zKTtcclxuXHRcdFx0Zm9yKHZhciBrIGluIG9wdGlvbnMuY29zdCkge1xyXG5cdFx0XHRcdCQoXCI8ZGl2PlwiKS5hZGRDbGFzcygncm93X2tleScpLnRleHQoXyhrKSkuYXBwZW5kVG8oY29zdFRvb2x0aXApO1xyXG5cdFx0XHRcdCQoXCI8ZGl2PlwiKS5hZGRDbGFzcygncm93X3ZhbCcpLnRleHQob3B0aW9ucy5jb3N0W2tdKS5hcHBlbmRUbyhjb3N0VG9vbHRpcCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY29zdFRvb2x0aXAuY2hpbGRyZW4oKS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0Y29zdFRvb2x0aXAuYXBwZW5kVG8oZWwpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmKG9wdGlvbnMud2lkdGgpIHtcclxuXHRcdFx0ZWwuY3NzKCd3aWR0aCcsIG9wdGlvbnMud2lkdGgpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gZWw7XHJcblx0fSxcclxuXHRcclxuXHRzZXREaXNhYmxlZDogZnVuY3Rpb24oYnRuLCBkaXNhYmxlZCkge1xyXG5cdFx0aWYoYnRuKSB7XHJcblx0XHRcdGlmKCFkaXNhYmxlZCAmJiAhYnRuLmRhdGEoJ29uQ29vbGRvd24nKSkge1xyXG5cdFx0XHRcdGJ0bi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdFx0fSBlbHNlIGlmKGRpc2FibGVkKSB7XHJcblx0XHRcdFx0YnRuLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGJ0bi5kYXRhKCdkaXNhYmxlZCcsIGRpc2FibGVkKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGlzRGlzYWJsZWQ6IGZ1bmN0aW9uKGJ0bikge1xyXG5cdFx0aWYoYnRuKSB7XHJcblx0XHRcdHJldHVybiBidG4uZGF0YSgnZGlzYWJsZWQnKSA9PT0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cdFxyXG5cdGNvb2xkb3duOiBmdW5jdGlvbihidG4pIHtcclxuXHRcdHZhciBjZCA9IGJ0bi5kYXRhKFwiY29vbGRvd25cIik7XHJcblx0XHRpZihjZCA+IDApIHtcclxuXHRcdFx0JCgnZGl2LmNvb2xkb3duJywgYnRuKS5zdG9wKHRydWUsIHRydWUpLndpZHRoKFwiMTAwJVwiKS5hbmltYXRlKHt3aWR0aDogJzAlJ30sIGNkICogMTAwMCwgJ2xpbmVhcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBiID0gJCh0aGlzKS5jbG9zZXN0KCcuYnV0dG9uJyk7XHJcblx0XHRcdFx0Yi5kYXRhKCdvbkNvb2xkb3duJywgZmFsc2UpO1xyXG5cdFx0XHRcdGlmKCFiLmRhdGEoJ2Rpc2FibGVkJykpIHtcclxuXHRcdFx0XHRcdGIucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0YnRuLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHRidG4uZGF0YSgnb25Db29sZG93bicsIHRydWUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0Y2xlYXJDb29sZG93bjogZnVuY3Rpb24oYnRuKSB7XHJcblx0XHQkKCdkaXYuY29vbGRvd24nLCBidG4pLnN0b3AodHJ1ZSwgdHJ1ZSk7XHJcblx0XHRidG4uZGF0YSgnb25Db29sZG93bicsIGZhbHNlKTtcclxuXHRcdGlmKCFidG4uZGF0YSgnZGlzYWJsZWQnKSkge1xyXG5cdFx0XHRidG4ucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHR9XHJcblx0fVxyXG59OyIsImltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIlxyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiXHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiXHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuLi9wbGF5ZXIvY2hhcmFjdGVyXCJcclxuXHJcbmV4cG9ydCBjb25zdCBDYXB0YWluID0ge1xyXG5cdHRhbGtUb0NhcHRhaW46IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnVGhlIENhcHRhaW5cXCdzIFRlbnQnKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICBzZWVuRmxhZzogKCkgPT4gJFNNLmdldCgnb3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnKSxcclxuXHRcdFx0XHRcdG5leHRTY2VuZTogJ21haW4nLFxyXG5cdFx0XHRcdFx0b25Mb2FkOiAoKSA9PiAkU00uc2V0KCdvdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcsIDEpLFxyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdZb3UgZW50ZXIgdGhlIGZhbmNpZXN0LWxvb2tpbmcgdGVudCBpbiB0aGUgT3V0cG9zdC4gQSBsYXJnZSBtYW4gd2l0aCBhIHRvb3RoYnJ1c2ggbXVzdGFjaGUgYW5kIGEgc2V2ZXJlIGZyb3duIGxvb2tzIHVwIGZyb20gaGlzIGRlc2suJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiU2lyLCB5b3UgaGF2ZSBlbnRlcmVkIHRoZSB0ZW50IG9mIENhcHRhaW4gRmlubmVhcy4gV2hhdCBidXNpbmVzcyBkbyB5b3UgaGF2ZSBoZXJlP1wiJylcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Fza0Fib3V0U3VwcGxpZXMnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBc2sgQWJvdXQgU3VwcGxpZXMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6ICdhc2tBYm91dFN1cHBsaWVzJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Fza0Fib3V0Q2FwdGFpbic6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FzayBBYm91dCBDYXB0YWluJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOiAnY2FwdGFpblJhbWJsZSd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0xlYXZlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgJ21haW4nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdUaGUgQ2FwdGFpbiBncmVldHMgeW91IHdhcm1seS4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCJBaGgsIHllcywgd2VsY29tZSBiYWNrLiBXaGF0IGNhbiBJIGRvIGZvciB5b3U/XCInKVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXNrQWJvdXRTdXBwbGllcyc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FzayBBYm91dCBTdXBwbGllcycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTonYXNrQWJvdXRTdXBwbGllcyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6IENhcHRhaW4uaGFuZGxlU3VwcGxpZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGU6ICgpID0+ICEkU00uZ2V0KCdvdXRwb3N0LmNhcHRhaW4uYXNrZWRBYm91dFN1cHBsaWVzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Fza0Fib3V0Q2FwdGFpbic6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FzayBBYm91dCBDYXB0YWluJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOidjYXB0YWluUmFtYmxlJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnTGVhdmUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAnY2FwdGFpblJhbWJsZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1RoZSBDYXB0YWluXFwncyBleWVzIGdsZWFtIGF0IHRoZSBvcHBvcnR1bml0eSB0byBydW4gZG93biBoaXMgbGlzdCBvZiBhY2hpZXZlbWVudHMuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiV2h5LCBJXFwnbGwgaGF2ZSB5b3Uga25vdyB0aGF0IHlvdSBzdGFuZCBpbiB0aGUgcHJlc2VuY2Ugb2Ygbm9uZSBvdGhlciB0aGFuIEZpbm5lYXMgSi4gRm9ic2xleSwgQ2FwdGFpbiBvZiB0aGUgUm95YWwgQXJteVxcJ3MgRmlmdGggRGl2aXNpb24sIHRoZSBmaW5lc3QgRGl2aXNpb24gaW4gSGlzIE1hamVzdHlcXCdzIHNlcnZpY2UuXCInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnSGUgcHVmZnMgb3V0IGhpcyBjaGVzdCwgZHJhd2luZyBhdHRlbnRpb24gdG8gaGlzIG1hbnkgbWVkYWxzLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIkkgaGF2ZSBjYW1wYWlnbmVkIG9uIGJlaGFsZiBvZiBPdXIgTG9yZHNoaXAgYWNyb3NzIG1hbnkgbGFuZHMsIGluY2x1ZGluZyBUaGUgRmFyIFdlc3QsIHRoZSBub3J0aGVybiBib3JkZXJzIG9mIFVtYmVyc2hpcmUgYW5kIFBlbGluZ2FsLCBOZXcgQmVsbGlzaWEsIGFuZCBlYWNoIG9mIHRoZSBGaXZlIElzbGVzIG9mIHRoZSBQaXJyaGlhbiBTZWEuXCInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnSGUgcGF1c2VzIGZvciBhIG1vbWVudCwgcGVyaGFwcyB0byBzZWUgaWYgeW91IGFyZSBzdWl0YWJseSBpbXByZXNzZWQsIHRoZW4gY29udGludWVzLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIkFzIENhcHRhaW4gb2YgdGhlIEZpZnRoIERpdmlzaW9uLCBJIGhhZCB0aGUgZXN0ZWVtZWQgcHJpdmlsZWdlIG9mIGVuc3VyaW5nIHRoZSBzYWZldHkgb2YgdGhlc2UgbGFuZHMgZm9yIG91ciBmYWlyIGNpdGl6ZW5zLiBJIGhhdmUgYmVlbiBhd2FyZGVkIG1hbnkgdGltZXMgb3ZlciBmb3IgbXkgYnJhdmVyeSBpbiB0aGUgZmFjZSBvZiB1dG1vc3QgcGVyaWwuIEZvciBpbnN0YW5jZSwgZHVyaW5nIHRoZSBTZWEgQ2FtcGFpZ24gb24gVGh5cHBlLCBUaGlyZCBvZiB0aGUgRml2ZSBJc2xlcywgd2Ugd2VyZSBhbWJ1c2hlZCB3aGlsZSBkaXNlbWJhcmtpbmcgZnJvbSBvdXIgc2hpcC4gVGhpbmtpbmcgcXVpY2tseSwgSS4uLlwiJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1RoZSBjYXB0YWluIGNvbnRpbnVlcyB0byByYW1ibGUgbGlrZSB0aGlzIGZvciBzZXZlcmFsIG1vcmUgbWludXRlcywgZ2l2aW5nIHlvdSB0aW1lIHRvIGJlY29tZSBtdWNoIG1vcmUgZmFtaWxpYXIgd2l0aCB0aGUgZGlydCB1bmRlciB5b3VyIGZpbmdlcm5haWxzLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIi4uLiBhbmQgVEhBVCwgbXkgZ29vZCBhZHZlbnR1cmVyLCBpcyB3aHkgSSBhbHdheXMga2VlcCBmcmVzaCBiYXNpbCBvbiBoYW5kLlwiJylcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Zhc2NpbmF0aW5nJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnRmFzY2luYXRpbmcnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6J21haW5Db250aW51ZWQnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICdtYWluQ29udGludWVkJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnVGhlIENhcHRhaW4gc2h1ZmZsZXMgaGlzIHBhcGVycyBpbiBhIHNvbWV3aGF0IHBlcmZvcm1hdGl2ZSB3YXkuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiV2FzIHRoZXJlIHNvbWV0aGluZyBlbHNlIHlvdSBuZWVkZWQ/XCInKVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXNrQWJvdXRTdXBwbGllcyc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FzayBBYm91dCBTdXBwbGllcycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTonYXNrQWJvdXRTdXBwbGllcyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlOiAoKSA9PiAhJFNNLmdldCgnb3V0cG9zdC5jYXB0YWluLmFza2VkQWJvdXRTdXBwbGllcycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhc2tBYm91dENhcHRhaW4nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBc2sgQWJvdXQgQ2FwdGFpbicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTonY2FwdGFpblJhbWJsZSd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0xlYXZlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgJ2Fza0Fib3V0U3VwcGxpZXMnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdUaGUgQ2FwdGFpblxcJ3MgZXllcyBnbGVhbSB3aXRoIGEgbWl4dHVyZSBvZiByZWFsaXphdGlvbiBhbmQgZ3VpbHQuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiQWhoLCB5ZXMsIHJpZ2h0LCB0aGUgc3VwcGxpZXMuIEkgc3VwcG9zZSB0aGUgTWF5b3IgaXMgc3RpbGwgd2FpdGluZyBmb3IgdGhvc2UuIEhhdmUgYSBsb29rIGluIHRoYXQgY2hlc3Qgb3ZlciB0aGVyZSwgaXQgc2hvdWxkIGhhdmUgZXZlcnl0aGluZyB5b3UgbmVlZC5cIicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdIZSBpbmRpY2F0ZXMgdG8gYSBjaGVzdCBhdCB0aGUgYmFjayBvZiB0aGUgcm9vbS4gWW91IG9wZW4gdGhlIGxpZCwgcmV2ZWFsaW5nIHRoZSBzdXBwbGllcyB3aXRoaW4uJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1lvdSB0YWtlIHRoZSBzdXBwbGllcy4nKVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FpdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG5cclxuICAgIGhhbmRsZVN1cHBsaWVzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnaGFuZGxpbmcgc3VwcGxpZXMnKTtcclxuICAgICAgICAkU00uc2V0KCdvdXRwb3N0LmNhcHRhaW4uYXNrZWRBYm91dFN1cHBsaWVzJywgMSk7XHJcbiAgICAgICAgQ2hhcmFjdGVyLmFkZFRvSW52ZW50b3J5KFwiQ2FwdGFpbi5zdXBwbGllc1wiKTtcclxuICAgICAgICAvLyBDaGFyYWN0ZXIuc2V0UXVlc3RTdGF0dXMoXCJtYXlvclN1cHBsaWVzXCIsIDIpO1xyXG4gICAgICAgIENoYXJhY3Rlci5jaGVja1F1ZXN0U3RhdHVzKFwibWF5b3JTdXBwbGllc1wiKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IFJvb20gfSBmcm9tIFwiLi4vcGxhY2VzL3Jvb21cIjtcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4uL3BsYXllci9jaGFyYWN0ZXJcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBMaXogPSB7XHJcbiAgICBzZXRMaXpBY3RpdmU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0JFNNLnNldCgndmlsbGFnZS5saXpBY3RpdmUnLCAxKTtcclxuXHRcdCRTTS5zZXQoJ3ZpbGxhZ2UubGl6LmNhbkZpbmRCb29rJywgMCk7XHJcblx0XHQkU00uc2V0KCd2aWxsYWdlLmxpei5oYXNCb29rJywgMSk7XHJcblx0XHRSb29tLnVwZGF0ZUJ1dHRvbigpO1xyXG5cdH0sXHJcblxyXG5cdHRhbGtUb0xpejogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdMaXpcXCdzIGhvdXNlLCBhdCB0aGUgZWRnZSBvZiB0b3duJyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHRzZWVuRmxhZzogKCkgPT4gJFNNLmdldCgndmlsbGFnZS5saXouaGF2ZU1ldCcpLFxyXG5cdFx0XHRcdFx0bmV4dFNjZW5lOiAnbWFpbicsXHJcblx0XHRcdFx0XHRvbkxvYWQ6ICgpID0+ICRTTS5zZXQoJ3ZpbGxhZ2UubGl6LmhhdmVNZXQnLCAxKSxcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnWW91IGVudGVyIHRoZSBidWlsZGluZyBhbmQgYXJlIGltbWVkaWF0ZWx5IHBsdW5nZWQgaW50byBhIGxhYnlyaW50aCBvZiBzaGVsdmVzIGhhcGhhemFyZGx5IGZpbGxlZCB3aXRoIGJvb2tzIG9mIGFsbCBraW5kcy4gQWZ0ZXIgYSBiaXQgb2Ygc2VhcmNoaW5nLCB5b3UgZmluZCBhIHNpZGUgcm9vbSB3aGVyZSBhIHdvbWFuIHdpdGggbW91c3kgaGFpciBhbmQgZ2xhc3NlcyBpcyBzaXR0aW5nIGF0IGEgd3JpdGluZyBkZXNrLiBTaGVcXCdzIHJlYWRpbmcgYSBsYXJnZSBib29rIHRoYXQgYXBwZWFycyB0byBpbmNsdWRlIGRpYWdyYW1zIG9mIHNvbWUgc29ydCBvZiBwbGFudC4gU2hlIGxvb2tzIHVwIGFzIHlvdSBlbnRlciB0aGUgcm9vbS4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJXaG8gdGhlIGhlbGwgYXJlIHlvdT9cIicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnYXNrQWJvdXRUb3duJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBhYm91dCBDaGFkdG9waWEnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnY2hhZHRvcGlhUmFtYmxlJ31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J3F1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBmb3IgYSBxdWVzdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdxdWVzdFJlcXVlc3QnfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnbGVhdmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnTGVhdmUnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdjaGFkdG9waWFSYW1ibGUnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ0xpeiBsb29rcyBhdCB5b3UgZm9yIGEgbW9tZW50IGJlZm9yZSByZXR1cm5pbmcgaGVyIGdhemUgdG8gdGhlIGJvb2sgaW4gZnJvbnQgb2YgaGVyLicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIlRoZXJlXFwncyBhIGJvb2sgaW4gaGVyZSBzb21ld2hlcmUgYWJvdXQgdGhlIGZvdW5kaW5nIG9mIENoYWR0b3BpYS4gSWYgeW91IGNhbiBmaW5kIGl0LCB5b3VcXCdyZSBmcmVlIHRvIGJvcnJvdyBpdC5cIicpXSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J29rYXknOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnT2theSwgdGhlbi4nKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnbWFpbid9LFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiAoKSA9PiAkU00uc2V0KCd2aWxsYWdlLmxpei5jYW5GaW5kQm9vaycsIHRydWUpXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cclxuXHRcdFx0XHQnbWFpbic6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtfKCdMaXogc2VlbXMgZGV0ZXJtaW5lZCBub3QgdG8gcGF5IGF0dGVudGlvbiB0byB5b3UuJyldLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnYXNrQWJvdXRUb3duJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBhYm91dCBDaGFkdG9waWEnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnY2hhZHRvcGlhUmFtYmxlJ30sXHJcblx0XHRcdFx0XHRcdFx0YXZhaWxhYmxlOiAoKSA9PiAhJFNNLmdldCgndmlsbGFnZS5saXouY2FuRmluZEJvb2snKVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQncXVlc3QnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGZvciBhIHF1ZXN0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ3F1ZXN0UmVxdWVzdCd9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdmaW5kQm9vayc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdUcnkgdG8gZmluZCB0aGUgYm9vaycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdmaW5kQm9vayd9LFxyXG5cdFx0XHRcdFx0XHRcdC8vIFRPRE86IGEgXCJ2aXNpYmxlXCIgZmxhZyB3b3VsZCBiZSBnb29kIGhlcmUsIGZvciBzaXR1YXRpb25zIHdoZXJlIGFuIG9wdGlvblxyXG5cdFx0XHRcdFx0XHRcdC8vICAgaXNuJ3QgeWV0IGtub3duIHRvIHRoZSBwbGF5ZXJcclxuXHRcdFx0XHRcdFx0XHR2aXNpYmxlOiAoKSA9PiAkU00uZ2V0KCd2aWxsYWdlLmxpei5jYW5GaW5kQm9vaycpLFxyXG5cdFx0XHRcdFx0XHRcdGF2YWlsYWJsZTogKCkgPT4gKCRTTS5nZXQoJ3ZpbGxhZ2UubGl6LmNhbkZpbmRCb29rJykgYXMgbnVtYmVyID4gMCkgJiYgKCRTTS5nZXQoJ3ZpbGxhZ2UubGl6Lmhhc0Jvb2snKSlcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0xlYXZlJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnZmluZEJvb2snOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ0xlYXZpbmcgTGl6IHRvIGhlciBidXNpbmVzcywgeW91IHdhbmRlciBhcm91bmQgYW1pZHN0IHRoZSBib29rcywgd29uZGVyaW5nIGhvdyB5b3VcXCdsbCBldmVyIG1hbmFnZSB0byBmaW5kIHdoYXQgeW91XFwncmUgbG9va2luZyBmb3IgaW4gYWxsIHRoaXMgdW5vcmdhbml6ZWQgbWVzcy4nKSxcclxuXHRcdFx0XHRcdFx0XygnRm9ydHVuYXRlbHksIHRoZSBjcmVhdG9yIG9mIHRoaXMgZ2FtZSBkb2VzblxcJ3QgZmVlbCBsaWtlIGl0XFwnZCBiZSB2ZXJ5IGludGVyZXN0aW5nIHRvIG1ha2UgdGhpcyBpbnRvIGEgcHV6emxlLCBzbyB5b3Ugc3BvdCB0aGUgYm9vayBvbiBhIG5lYXJieSBzaGVsZiBhbmQgZ3JhYiBpdC4nKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J3NpY2snOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnT2gsIHNpY2snKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiAoKSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyAkU00uc2V0KCdzdG9yZXMuV2VpcmQgQm9vaycsIDEpO1xyXG5cdFx0XHRcdFx0XHRcdFx0Q2hhcmFjdGVyLmFkZFRvSW52ZW50b3J5KFwiTGl6LndlaXJkQm9va1wiKTtcclxuXHRcdFx0XHRcdFx0XHRcdCRTTS5zZXQoJ3ZpbGxhZ2UubGl6Lmhhc0Jvb2snLCAwKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdxdWVzdFJlcXVlc3QnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ0xpeiBsZXRzIG91dCBhbiBhbm5veWVkIHNpZ2guJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiT2ggYnJhdmUgYWR2ZW50dXJlciwgSSBzZWVtIHRvIGhhdmUgbG9zdCBteSBwYXRpZW5jZS4gV2hlbiBsYXN0IEkgc2F3IGl0LCBpdCB3YXMgc29tZXdoZXJlIG91dHNpZGUgb2YgdGhpcyBidWlsZGluZy4gV291bGRzdCB0aG91IHJlY292ZXIgdGhhdCB3aGljaCBoYXMgYmVlbiBzdG9sZW4gZnJvbSBtZT9cIicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnb2theSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdPa2F5LCBqZWV6LCBJIGdldCBpdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdtYWluJ31cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG59IiwiaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgTGl6IH0gZnJvbSBcIi4vbGl6XCI7XHJcbmltcG9ydCB7IFJvYWQgfSBmcm9tIFwiLi4vcGxhY2VzL3JvYWRcIjtcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4uL3BsYXllci9jaGFyYWN0ZXJcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBNYXlvciA9IHtcclxuICAgIHRhbGtUb01heW9yOiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ01lZXQgdGhlIE1heW9yJyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHRzZWVuRmxhZzogKCkgPT4gJFNNLmdldCgndmlsbGFnZS5tYXlvci5oYXZlTWV0JyksXHJcblx0XHRcdFx0XHRuZXh0U2NlbmU6ICdtYWluJyxcclxuXHRcdFx0XHRcdG9uTG9hZDogKCkgPT4gJFNNLnNldCgndmlsbGFnZS5tYXlvci5oYXZlTWV0JywgMSksXHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1RoZSBtYXlvciBzbWlsZXMgYXQgeW91IGFuZCBzYXlzOicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIldlbGNvbWUgdG8gQ2hhZHRvcGlhLCBJXFwnbSB0aGUgbWF5b3Igb2YgdGhlc2UgaGVyZSBwYXJ0cy4gV2hhdCBjYW4gSSBkbyB5b3UgZm9yP1wiJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdhc2tBYm91dFRvd24nOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGFib3V0IENoYWR0b3BpYScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdjaGFkdG9waWFSYW1ibGUnfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQncXVlc3QnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGZvciBhIHF1ZXN0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ3F1ZXN0J31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0xlYXZlJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnY2hhZHRvcGlhUmFtYmxlJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdUaGUgbWF5b3IgcHVzaGVzIHRoZSBicmltIG9mIGhpcyBoYXQgdXAuJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiV2VsbCwgd2VcXCd2ZSBhbHdheXMgYmVlbiBoZXJlLCBsb25nIGFzIEkgY2FuIHJlbWVtYmVyLiBJIHRvb2sgb3ZlciBhZnRlciB0aGUgbGFzdCBtYXlvciBkaWVkLCBidXQgaGUgd291bGQgaGF2ZSBiZWVuIHRoZSBvbmx5IHBlcnNvbiB3aXRoIGFueSBoaXN0b3JpY2FsIGtub3dsZWRnZSBvZiB0aGlzIHZpbGxhZ2UuXCInKSxcclxuXHRcdFx0XHRcdFx0XygnSGUgcGF1c2VzIGZvciBhIG1vbWVudCBhbmQgdG91c2xlcyBzb21lIG9mIHRoZSB3aXNweSBoYWlycyB0aGF0IGhhdmUgcG9rZWQgb3V0IGZyb20gdW5kZXIgdGhlIHJhaXNlZCBoYXQuJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiQWN0dWFsbHksIHlvdSBtaWdodCBhc2sgTGl6LCBzaGUgaGFzIGEgYnVuY2ggb2YgaGVyIG1vdGhlclxcJ3MgYm9va3MgZnJvbSB3YXkgYmFjayB3aGVuLiBTaGUgbGl2ZXMgYXQgdGhlIGVkZ2Ugb2YgdG93bi5cIicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnb2theSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdPa2F5LCB0aGVuLicpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdtYWluJ30sXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IExpei5zZXRMaXpBY3RpdmVcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J21haW4nOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1RoZSBtYXlvciBzYXlzOicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIkFueXdheSwgd2hhdCBFTFNFIGNhbiBJIGRvIHlvdSBmb3I/XCInKSxcclxuXHRcdFx0XHRcdFx0XygnSGUgY2h1Y2tsZXMgYXQgaGlzIGNsZXZlciB1c2Ugb2YgbGFuZ3VhZ2UuJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdhc2tBYm91dFRvd24nOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGFib3V0IENoYWR0b3BpYScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdjaGFkdG9waWFSYW1ibGUnfSxcclxuXHRcdFx0XHRcdFx0XHQvLyBpbWFnZTogXCJhc3NldHMvY2FyZHMvbGl0dGxlX3dvbGYucG5nXCJcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J3F1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBmb3IgYSBxdWVzdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdxdWVzdCd9LFxyXG5cdFx0XHRcdFx0XHRcdGF2YWlsYWJsZTogKCkgPT5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIG5vdCBhdmFpbGFibGUgaWYgbWF5b3JTdXBwbGllcyBpcyBpbi1wcm9ncmVzc1xyXG5cdFx0XHRcdFx0XHRcdFx0KENoYXJhY3Rlci5xdWVzdFN0YXR1c1tcIm1heW9yU3VwcGxpZXNcIl0gPT0gXCJ1bmRlZmluZWRcIilcclxuXHRcdFx0XHRcdFx0XHRcdC8vIHJlLWFkZCB0aGlzIGNvbmRpdGlvbiBsYXRlciwgd2UgbmVlZCB0byBzZW5kIHRoZW0gdG8gYSBkaWZmZXJlbnRcclxuXHRcdFx0XHRcdFx0XHRcdC8vICAgcXVlc3QgZGlhbG9nIGlmIHRoZXkgYWxyZWFkeSBkaWQgdGhlIGZpcnN0IHF1ZXN0XHJcblx0XHRcdFx0XHRcdFx0XHQvLyB8fCAoQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW1wibWF5b3JTdXBwbGllc1wiXSA9PSAtMSlcclxuXHRcdFx0XHRcdFx0XHQvLyBpbWFnZTogXCJhc3NldHMvY2FyZHMvam9rZXIucG5nXCJcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2dpdmVTdXBwbGllcyc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdIYW5kIG92ZXIgdGhlIHN1cHBsaWVzJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2dpdmVTdXBwbGllcyd9LFxyXG5cdFx0XHRcdFx0XHRcdGF2YWlsYWJsZTogKCkgPT4gXHJcblx0XHRcdFx0XHRcdFx0XHQodHlwZW9mKCRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnKSkgPT0gXCJ1bmRlZmluZWRcIikgXHJcblx0XHRcdFx0XHRcdFx0XHQmJiAoQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW1wibWF5b3JTdXBwbGllc1wiXSAhPT0gXCJ1bmRlZmluZWRcIilcclxuXHRcdFx0XHRcdFx0XHRcdCYmIENoYXJhY3Rlci5pbnZlbnRvcnlbXCJDYXB0YWluLnN1cHBsaWVzXCJdLFxyXG5cdFx0XHRcdFx0XHRcdHZpc2libGU6ICgpID0+XHJcblx0XHRcdFx0XHRcdFx0XHQoQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW1wibWF5b3JTdXBwbGllc1wiXSAhPT0gXCJ1bmRlZmluZWRcIiksXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6ICgpID0+IHtcclxuXHRcdFx0XHRcdFx0XHRcdENoYXJhY3Rlci5yZW1vdmVGcm9tSW52ZW50b3J5KFwiQ2FwdGFpbi5zdXBwbGllc1wiKTtcclxuXHRcdFx0XHRcdFx0XHRcdCRTTS5zZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnLCAxKTtcclxuXHRcdFx0XHRcdFx0XHRcdENoYXJhY3Rlci5jaGVja1F1ZXN0U3RhdHVzKFwibWF5b3JTdXBwbGllc1wiKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdsZWF2ZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdMZWF2ZScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0Ly8gaW1hZ2U6IFwiYXNzZXRzL2NhcmRzL3JhdmVuLnBuZ1wiXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdxdWVzdCc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnVGhlIG1heW9yIHRoaW5rcyBmb3IgYSBtb21lbnQuJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiWW91IGtub3csIGl0XFwncyBiZWVuIGEgd2hpbGUgc2luY2Ugb3VyIGxhc3Qgc2hpcG1lbnQgb2Ygc3VwcGxpZXMgYXJyaXZlZCBmcm9tIHRoZSBvdXRwb3N0LiBNaW5kIGxvb2tpbmcgaW50byB0aGF0IGZvciB1cz9cIicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIllvdSBjYW4gYXNrIGFib3V0IGl0IGF0IHRoZSBvdXRwb3N0LCBvciBqdXN0IHdhbmRlciBhcm91bmQgb24gdGhlIHJvYWQgYW5kIHNlZSBpZiB5b3UgZmluZCBhbnkgY2x1ZXMuIEVpdGhlciB3YXksIGl0XFwncyB0aW1lIHRvIGhpdCB0aGUgcm9hZCwgYWR2ZW50dXJlciFcIicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnYWxyaWdodHknOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQWxyaWdodHknKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnbWFpbid9LFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBNYXlvci5zdGFydFN1cHBsaWVzUXVlc3RcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J2dpdmVTdXBwbGllcyc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnVGhlIG1heW9yIHNtaWxlcywgYW5kIHRoZSBlZGdlcyBvZiBoaXMgZXllcyBjcmlua2xlLicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIlRoYW5rIHlvdSwgYnJhdmUgYWR2ZW50dXJlciEgV2l0aCB0aGVzZSBzdXBwbGllcywgdGhlIHZpbGxhZ2UgY2FuIG9uY2UgYWdhaW4gdGhyaXZlLlwiJyksXHJcblx0XHRcdFx0XHRcdF8oJ0hlIHRha2VzIHRoZW0gZnJvbSB5b3UgZ3JhY2lvdXNseSwgYW5kIHByb21wdGx5IGhhbmRzIHRoZW0gb2ZmIHRvIHNvbWUgd29ya2Vycywgd2hvIHF1aWNrbHkgZXJlY3QgYSBidWlsZGluZyB0aGF0IGdpdmVzIHlvdSBhIG5ldyBidXR0b24gdG8gY2xpY2snKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2ltcHJlc3NpdmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnSW1wcmVzc2l2ZSEnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0c3RhcnRTdXBwbGllc1F1ZXN0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHQvLyBpZiAoISRTTS5nZXQoJ3F1ZXN0LnN1cHBsaWVzJykpIHtcclxuXHRcdC8vIFx0Ly8gMSA9IHN0YXJ0ZWQsIDIgPSBuZXh0IHN0ZXAsIGV0Yy4gdW50aWwgY29tcGxldGVkXHJcblx0XHQvLyBcdCRTTS5zZXQoJ3F1ZXN0LnN1cHBsaWVzJywgMSk7XHJcblx0XHQvLyBcdFJvYWQuaW5pdCgpO1xyXG5cdFx0Ly8gfVxyXG5cdFx0aWYgKHR5cGVvZihDaGFyYWN0ZXIucXVlc3RTdGF0dXNbXCJtYXlvclN1cHBsaWVzXCJdKSA9PSBcInVuZGVmaW5lZFwiKSB7XHJcblx0XHRcdENoYXJhY3Rlci5zZXRRdWVzdFN0YXR1cyhcIm1heW9yU3VwcGxpZXNcIiwgMCk7XHJcblx0XHRcdFJvYWQuaW5pdCgpO1xyXG5cdFx0fVxyXG5cdH1cclxufSIsIi8vIEB0cy1ub2NoZWNrXHJcblxyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBOb3RpZmljYXRpb25zIH0gZnJvbSBcIi4vbm90aWZpY2F0aW9uc1wiO1xyXG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgUm9vbSB9IGZyb20gXCIuL3BsYWNlcy9yb29tXCI7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuL3BsYXllci9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IHsgV2VhdGhlciB9IGZyb20gXCIuL3dlYXRoZXJcIjtcclxuaW1wb3J0IHsgUm9hZCB9IGZyb20gXCIuL3BsYWNlcy9yb2FkXCI7XHJcbmltcG9ydCB7IE91dHBvc3QgfSBmcm9tIFwiLi9wbGFjZXMvb3V0cG9zdFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEVuZ2luZSA9IHdpbmRvdy5FbmdpbmUgPSB7XHJcblx0XHJcblx0U0lURV9VUkw6IGVuY29kZVVSSUNvbXBvbmVudChcImh0dHA6Ly9hZGFya3Jvb20uZG91Ymxlc3BlYWtnYW1lcy5jb21cIiksXHJcblx0VkVSU0lPTjogMS4zLFxyXG5cdE1BWF9TVE9SRTogOTk5OTk5OTk5OTk5OTksXHJcblx0U0FWRV9ESVNQTEFZOiAzMCAqIDEwMDAsXHJcblx0R0FNRV9PVkVSOiBmYWxzZSxcclxuXHRcclxuXHQvL29iamVjdCBldmVudCB0eXBlc1xyXG5cdHRvcGljczoge30sXHJcblx0XHRcclxuXHRQZXJrczoge1xyXG5cdFx0J2JveGVyJzoge1xyXG5cdFx0XHRuYW1lOiBfKCdib3hlcicpLFxyXG5cdFx0XHRkZXNjOiBfKCdwdW5jaGVzIGRvIG1vcmUgZGFtYWdlJyksXHJcblx0XHRcdC8vLyBUUkFOU0xBVE9SUyA6IG1lYW5zIHdpdGggbW9yZSBmb3JjZS5cclxuXHRcdFx0bm90aWZ5OiBfKCdsZWFybmVkIHRvIHRocm93IHB1bmNoZXMgd2l0aCBwdXJwb3NlJylcclxuXHRcdH0sXHJcblx0XHQnbWFydGlhbCBhcnRpc3QnOiB7XHJcblx0XHRcdG5hbWU6IF8oJ21hcnRpYWwgYXJ0aXN0JyksXHJcblx0XHRcdGRlc2M6IF8oJ3B1bmNoZXMgZG8gZXZlbiBtb3JlIGRhbWFnZS4nKSxcclxuXHRcdFx0bm90aWZ5OiBfKCdsZWFybmVkIHRvIGZpZ2h0IHF1aXRlIGVmZmVjdGl2ZWx5IHdpdGhvdXQgd2VhcG9ucycpXHJcblx0XHR9LFxyXG5cdFx0J3VuYXJtZWQgbWFzdGVyJzoge1xyXG5cdFx0XHQvLy8gVFJBTlNMQVRPUlMgOiBtYXN0ZXIgb2YgdW5hcm1lZCBjb21iYXRcclxuXHRcdFx0bmFtZTogXygndW5hcm1lZCBtYXN0ZXInKSxcclxuXHRcdFx0ZGVzYzogXygncHVuY2ggdHdpY2UgYXMgZmFzdCwgYW5kIHdpdGggZXZlbiBtb3JlIGZvcmNlJyksXHJcblx0XHRcdG5vdGlmeTogXygnbGVhcm5lZCB0byBzdHJpa2UgZmFzdGVyIHdpdGhvdXQgd2VhcG9ucycpXHJcblx0XHR9LFxyXG5cdFx0J2JhcmJhcmlhbic6IHtcclxuXHRcdFx0bmFtZTogXygnYmFyYmFyaWFuJyksXHJcblx0XHRcdGRlc2M6IF8oJ21lbGVlIHdlYXBvbnMgZGVhbCBtb3JlIGRhbWFnZScpLFxyXG5cdFx0XHRub3RpZnk6IF8oJ2xlYXJuZWQgdG8gc3dpbmcgd2VhcG9ucyB3aXRoIGZvcmNlJylcclxuXHRcdH0sXHJcblx0XHQnc2xvdyBtZXRhYm9saXNtJzoge1xyXG5cdFx0XHRuYW1lOiBfKCdzbG93IG1ldGFib2xpc20nKSxcclxuXHRcdFx0ZGVzYzogXygnZ28gdHdpY2UgYXMgZmFyIHdpdGhvdXQgZWF0aW5nJyksXHJcblx0XHRcdG5vdGlmeTogXygnbGVhcm5lZCBob3cgdG8gaWdub3JlIHRoZSBodW5nZXInKVxyXG5cdFx0fSxcclxuXHRcdCdkZXNlcnQgcmF0Jzoge1xyXG5cdFx0XHRuYW1lOiBfKCdkZXNlcnQgcmF0JyksXHJcblx0XHRcdGRlc2M6IF8oJ2dvIHR3aWNlIGFzIGZhciB3aXRob3V0IGRyaW5raW5nJyksXHJcblx0XHRcdG5vdGlmeTogXygnbGVhcm5lZCB0byBsb3ZlIHRoZSBkcnkgYWlyJylcclxuXHRcdH0sXHJcblx0XHQnZXZhc2l2ZSc6IHtcclxuXHRcdFx0bmFtZTogXygnZXZhc2l2ZScpLFxyXG5cdFx0XHRkZXNjOiBfKCdkb2RnZSBhdHRhY2tzIG1vcmUgZWZmZWN0aXZlbHknKSxcclxuXHRcdFx0bm90aWZ5OiBfKFwibGVhcm5lZCB0byBiZSB3aGVyZSB0aGV5J3JlIG5vdFwiKVxyXG5cdFx0fSxcclxuXHRcdCdwcmVjaXNlJzoge1xyXG5cdFx0XHRuYW1lOiBfKCdwcmVjaXNlJyksXHJcblx0XHRcdGRlc2M6IF8oJ2xhbmQgYmxvd3MgbW9yZSBvZnRlbicpLFxyXG5cdFx0XHRub3RpZnk6IF8oJ2xlYXJuZWQgdG8gcHJlZGljdCB0aGVpciBtb3ZlbWVudCcpXHJcblx0XHR9LFxyXG5cdFx0J3Njb3V0Jzoge1xyXG5cdFx0XHRuYW1lOiBfKCdzY291dCcpLFxyXG5cdFx0XHRkZXNjOiBfKCdzZWUgZmFydGhlcicpLFxyXG5cdFx0XHRub3RpZnk6IF8oJ2xlYXJuZWQgdG8gbG9vayBhaGVhZCcpXHJcblx0XHR9LFxyXG5cdFx0J3N0ZWFsdGh5Jzoge1xyXG5cdFx0XHRuYW1lOiBfKCdzdGVhbHRoeScpLFxyXG5cdFx0XHRkZXNjOiBfKCdiZXR0ZXIgYXZvaWQgY29uZmxpY3QgaW4gdGhlIHdpbGQnKSxcclxuXHRcdFx0bm90aWZ5OiBfKCdsZWFybmVkIGhvdyBub3QgdG8gYmUgc2VlbicpXHJcblx0XHR9LFxyXG5cdFx0J2dhc3Ryb25vbWUnOiB7XHJcblx0XHRcdG5hbWU6IF8oJ2dhc3Ryb25vbWUnKSxcclxuXHRcdFx0ZGVzYzogXygncmVzdG9yZSBtb3JlIGhlYWx0aCB3aGVuIGVhdGluZycpLFxyXG5cdFx0XHRub3RpZnk6IF8oJ2xlYXJuZWQgdG8gbWFrZSB0aGUgbW9zdCBvZiBmb29kJylcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHtcclxuXHRcdHN0YXRlOiBudWxsLFxyXG5cdFx0ZGVidWc6IHRydWUsXHJcblx0XHRsb2c6IHRydWUsXHJcblx0XHRkcm9wYm94OiBmYWxzZSxcclxuXHRcdGRvdWJsZVRpbWU6IGZhbHNlXHJcblx0fSxcclxuXHJcblx0X2RlYnVnOiBmYWxzZSxcclxuXHRcdFxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdFx0dGhpcy5fZGVidWcgPSB0aGlzLm9wdGlvbnMuZGVidWc7XHJcblx0XHR0aGlzLl9sb2cgPSB0aGlzLm9wdGlvbnMubG9nO1xyXG5cdFx0XHJcblx0XHQvLyBDaGVjayBmb3IgSFRNTDUgc3VwcG9ydFxyXG5cdFx0aWYoIUVuZ2luZS5icm93c2VyVmFsaWQoKSkge1xyXG5cdFx0XHR3aW5kb3cubG9jYXRpb24gPSAnYnJvd3Nlcldhcm5pbmcuaHRtbCc7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIENoZWNrIGZvciBtb2JpbGVcclxuXHRcdGlmKEVuZ2luZS5pc01vYmlsZSgpKSB7XHJcblx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9ICdtb2JpbGVXYXJuaW5nLmh0bWwnO1xyXG5cdFx0fVxyXG5cclxuXHRcdEVuZ2luZS5kaXNhYmxlU2VsZWN0aW9uKCk7XHJcblx0XHRcclxuXHRcdGlmKHRoaXMub3B0aW9ucy5zdGF0ZSAhPSBudWxsKSB7XHJcblx0XHRcdHdpbmRvdy5TdGF0ZSA9IHRoaXMub3B0aW9ucy5zdGF0ZTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEVuZ2luZS5sb2FkR2FtZSgpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2xvY2F0aW9uU2xpZGVyJykuYXBwZW5kVG8oJyNtYWluJyk7XHJcblxyXG5cdFx0dmFyIG1lbnUgPSAkKCc8ZGl2PicpXHJcblx0XHRcdC5hZGRDbGFzcygnbWVudScpXHJcblx0XHRcdC5hcHBlbmRUbygnYm9keScpO1xyXG5cclxuXHRcdGlmKHR5cGVvZiBsYW5ncyAhPSAndW5kZWZpbmVkJyl7XHJcblx0XHRcdHZhciBjdXN0b21TZWxlY3QgPSAkKCc8c3Bhbj4nKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnY3VzdG9tU2VsZWN0JylcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHRcdFx0dmFyIHNlbGVjdE9wdGlvbnMgPSAkKCc8c3Bhbj4nKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnY3VzdG9tU2VsZWN0T3B0aW9ucycpXHJcblx0XHRcdFx0LmFwcGVuZFRvKGN1c3RvbVNlbGVjdCk7XHJcblx0XHRcdHZhciBvcHRpb25zTGlzdCA9ICQoJzx1bD4nKVxyXG5cdFx0XHRcdC5hcHBlbmRUbyhzZWxlY3RPcHRpb25zKTtcclxuXHRcdFx0JCgnPGxpPicpXHJcblx0XHRcdFx0LnRleHQoXCJsYW5ndWFnZS5cIilcclxuXHRcdFx0XHQuYXBwZW5kVG8ob3B0aW9uc0xpc3QpO1xyXG5cdFx0XHRcclxuXHRcdFx0JC5lYWNoKGxhbmdzLCBmdW5jdGlvbihuYW1lLGRpc3BsYXkpe1xyXG5cdFx0XHRcdCQoJzxsaT4nKVxyXG5cdFx0XHRcdFx0LnRleHQoZGlzcGxheSlcclxuXHRcdFx0XHRcdC5hdHRyKCdkYXRhLWxhbmd1YWdlJywgbmFtZSlcclxuXHRcdFx0XHRcdC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkgeyBFbmdpbmUuc3dpdGNoTGFuZ3VhZ2UodGhpcyk7IH0pXHJcblx0XHRcdFx0XHQuYXBwZW5kVG8ob3B0aW9uc0xpc3QpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2xpZ2h0c09mZiBtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygnbGlnaHRzIG9mZi4nKSlcclxuXHRcdFx0LmNsaWNrKEVuZ2luZS50dXJuTGlnaHRzT2ZmKVxyXG5cdFx0XHQuYXBwZW5kVG8obWVudSk7XHJcblxyXG5cdFx0JCgnPHNwYW4+JylcclxuXHRcdFx0LmFkZENsYXNzKCdtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygnaHlwZXIuJykpXHJcblx0XHRcdC5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0XHRcdEVuZ2luZS5vcHRpb25zLmRvdWJsZVRpbWUgPSAhRW5naW5lLm9wdGlvbnMuZG91YmxlVGltZTtcclxuXHRcdFx0XHRpZihFbmdpbmUub3B0aW9ucy5kb3VibGVUaW1lKVxyXG5cdFx0XHRcdFx0JCh0aGlzKS50ZXh0KF8oJ2NsYXNzaWMuJykpO1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdCQodGhpcykudGV4dChfKCdoeXBlci4nKSk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHQudGV4dChfKCdyZXN0YXJ0LicpKVxyXG5cdFx0XHQuY2xpY2soRW5naW5lLmNvbmZpcm1EZWxldGUpXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHRcdFxyXG5cdFx0JCgnPHNwYW4+JylcclxuXHRcdFx0LmFkZENsYXNzKCdtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygnc2hhcmUuJykpXHJcblx0XHRcdC5jbGljayhFbmdpbmUuc2hhcmUpXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHQudGV4dChfKCdzYXZlLicpKVxyXG5cdFx0XHQuY2xpY2soRW5naW5lLmV4cG9ydEltcG9ydClcclxuXHRcdFx0LmFwcGVuZFRvKG1lbnUpO1xyXG5cdFx0XHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHQudGV4dChfKCdhcHAgc3RvcmUuJykpXHJcblx0XHRcdC5jbGljayhmdW5jdGlvbigpIHsgd2luZG93Lm9wZW4oJ2h0dHBzOi8vaXR1bmVzLmFwcGxlLmNvbS91cy9hcHAvYS1kYXJrLXJvb20vaWQ3MzY2ODMwNjEnKTsgfSlcclxuXHRcdFx0LmFwcGVuZFRvKG1lbnUpO1xyXG5cclxuXHRcdCQoJzxzcGFuPicpXHJcblx0XHRcdC5hZGRDbGFzcygnbWVudUJ0bicpXHJcblx0XHRcdC50ZXh0KF8oJ2dpdGh1Yi4nKSlcclxuXHRcdFx0LmNsaWNrKGZ1bmN0aW9uKCkgeyB3aW5kb3cub3BlbignaHR0cHM6Ly9naXRodWIuY29tL0NvbnRpbnVpdGllcy9hZGFya3Jvb20nKTsgfSlcclxuXHRcdFx0LmFwcGVuZFRvKG1lbnUpO1xyXG5cdFxyXG5cdFx0Ly8gc3Vic2NyaWJlIHRvIHN0YXRlVXBkYXRlc1xyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5zdWJzY3JpYmUoRW5naW5lLmhhbmRsZVN0YXRlVXBkYXRlcyk7XHJcblxyXG5cdFx0JFNNLmluaXQoKTtcclxuXHRcdE5vdGlmaWNhdGlvbnMuaW5pdCgpO1xyXG5cdFx0RXZlbnRzLmluaXQoKTtcclxuXHRcdFJvb20uaW5pdCgpO1xyXG5cdFx0Q2hhcmFjdGVyLmluaXQoKTtcclxuXHRcdFdlYXRoZXIuaW5pdCgpO1xyXG5cdFx0aWYoJFNNLmdldCgncm9hZC5vcGVuJykpIHtcclxuXHRcdFx0Um9hZC5pbml0KCk7XHJcblx0XHR9XHJcblx0XHRpZigkU00uZ2V0KCdvdXRwb3N0Lm9wZW4nKSkge1xyXG5cdFx0XHRPdXRwb3N0LmluaXQoKTtcclxuXHRcdH1cclxuXHJcblx0XHRFbmdpbmUuc2F2ZUxhbmd1YWdlKCk7XHJcblx0XHRFbmdpbmUudHJhdmVsVG8oUm9vbSk7XHJcblxyXG5cdH0sXHJcblx0XHJcblx0YnJvd3NlclZhbGlkOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAoIGxvY2F0aW9uLnNlYXJjaC5pbmRleE9mKCAnaWdub3JlYnJvd3Nlcj10cnVlJyApID49IDAgfHwgKCB0eXBlb2YgU3RvcmFnZSAhPSAndW5kZWZpbmVkJyAmJiAhb2xkSUUgKSApO1xyXG5cdH0sXHJcblx0XHJcblx0aXNNb2JpbGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuICggbG9jYXRpb24uc2VhcmNoLmluZGV4T2YoICdpZ25vcmVicm93c2VyPXRydWUnICkgPCAwICYmIC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeS9pLnRlc3QoIG5hdmlnYXRvci51c2VyQWdlbnQgKSApO1xyXG5cdH0sXHJcblx0XHJcblx0c2F2ZUdhbWU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYodHlwZW9mIFN0b3JhZ2UgIT0gJ3VuZGVmaW5lZCcgJiYgbG9jYWxTdG9yYWdlKSB7XHJcblx0XHRcdGlmKEVuZ2luZS5fc2F2ZVRpbWVyICE9IG51bGwpIHtcclxuXHRcdFx0XHRjbGVhclRpbWVvdXQoRW5naW5lLl9zYXZlVGltZXIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHR5cGVvZiBFbmdpbmUuX2xhc3ROb3RpZnkgPT0gJ3VuZGVmaW5lZCcgfHwgRGF0ZS5ub3coKSAtIEVuZ2luZS5fbGFzdE5vdGlmeSA+IEVuZ2luZS5TQVZFX0RJU1BMQVkpe1xyXG5cdFx0XHRcdCQoJyNzYXZlTm90aWZ5JykuY3NzKCdvcGFjaXR5JywgMSkuYW5pbWF0ZSh7b3BhY2l0eTogMH0sIDEwMDAsICdsaW5lYXInKTtcclxuXHRcdFx0XHRFbmdpbmUuX2xhc3ROb3RpZnkgPSBEYXRlLm5vdygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxvY2FsU3RvcmFnZS5nYW1lU3RhdGUgPSBKU09OLnN0cmluZ2lmeShTdGF0ZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRsb2FkR2FtZTogZnVuY3Rpb24oKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR2YXIgc2F2ZWRTdGF0ZSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdhbWVTdGF0ZSk7XHJcblx0XHRcdGlmKHNhdmVkU3RhdGUpIHtcclxuXHRcdFx0XHR3aW5kb3cuU3RhdGUgPSBzYXZlZFN0YXRlO1xyXG5cdFx0XHRcdEVuZ2luZS5sb2coXCJsb2FkZWQgc2F2ZSFcIik7XHJcblx0XHRcdH1cclxuXHRcdH0gY2F0Y2goZSkge1xyXG5cdFx0XHRFbmdpbmUubG9nKGUpO1xyXG5cdFx0XHR3aW5kb3cuU3RhdGUgPSB7fTtcclxuXHRcdFx0JFNNLnNldCgndmVyc2lvbicsIEVuZ2luZS5WRVJTSU9OKTtcclxuXHRcdFx0RW5naW5lLmV2ZW50KCdwcm9ncmVzcycsICduZXcgZ2FtZScpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0ZXhwb3J0SW1wb3J0OiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ0V4cG9ydCAvIEltcG9ydCcpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdleHBvcnQgb3IgaW1wb3J0IHNhdmUgZGF0YSwgZm9yIGJhY2tpbmcgdXAnKSxcclxuXHRcdFx0XHRcdFx0Xygnb3IgbWlncmF0aW5nIGNvbXB1dGVycycpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnZXhwb3J0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2V4cG9ydCcpLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBFbmdpbmUuZXhwb3J0NjRcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2ltcG9ydCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdpbXBvcnQnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnY29uZmlybSd9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdjYW5jZWwnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnY2FuY2VsJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnY29uZmlybSc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnYXJlIHlvdSBzdXJlPycpLFxyXG5cdFx0XHRcdFx0XHRfKCdpZiB0aGUgY29kZSBpcyBpbnZhbGlkLCBhbGwgZGF0YSB3aWxsIGJlIGxvc3QuJyksXHJcblx0XHRcdFx0XHRcdF8oJ3RoaXMgaXMgaXJyZXZlcnNpYmxlLicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQneWVzJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ3llcycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdpbnB1dEltcG9ydCd9LFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBFbmdpbmUuZW5hYmxlU2VsZWN0aW9uXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdubyc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdubycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J2lucHV0SW1wb3J0Jzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW18oJ3B1dCB0aGUgc2F2ZSBjb2RlIGhlcmUuJyldLFxyXG5cdFx0XHRcdFx0dGV4dGFyZWE6ICcnLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnb2theSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdpbXBvcnQnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBFbmdpbmUuaW1wb3J0NjRcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2NhbmNlbCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdjYW5jZWwnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGdlbmVyYXRlRXhwb3J0NjQ6IGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgc3RyaW5nNjQgPSBCYXNlNjQuZW5jb2RlKGxvY2FsU3RvcmFnZS5nYW1lU3RhdGUpO1xyXG5cdFx0c3RyaW5nNjQgPSBzdHJpbmc2NC5yZXBsYWNlKC9cXHMvZywgJycpO1xyXG5cdFx0c3RyaW5nNjQgPSBzdHJpbmc2NC5yZXBsYWNlKC9cXC4vZywgJycpO1xyXG5cdFx0c3RyaW5nNjQgPSBzdHJpbmc2NC5yZXBsYWNlKC9cXG4vZywgJycpO1xyXG5cclxuXHRcdHJldHVybiBzdHJpbmc2NDtcclxuXHR9LFxyXG5cclxuXHRleHBvcnQ2NDogZnVuY3Rpb24oKSB7XHJcblx0XHRFbmdpbmUuc2F2ZUdhbWUoKTtcclxuXHRcdHZhciBzdHJpbmc2NCA9IEVuZ2luZS5nZW5lcmF0ZUV4cG9ydDY0KCk7XHJcblx0XHRFbmdpbmUuZW5hYmxlU2VsZWN0aW9uKCk7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdFeHBvcnQnKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtfKCdzYXZlIHRoaXMuJyldLFxyXG5cdFx0XHRcdFx0dGV4dGFyZWE6IHN0cmluZzY0LFxyXG5cdFx0XHRcdFx0cmVhZG9ubHk6IHRydWUsXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdkb25lJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2dvdCBpdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IEVuZ2luZS5kaXNhYmxlU2VsZWN0aW9uXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0RW5naW5lLmF1dG9TZWxlY3QoJyNkZXNjcmlwdGlvbiB0ZXh0YXJlYScpO1xyXG5cdH0sXHJcblxyXG5cdGltcG9ydDY0OiBmdW5jdGlvbihzdHJpbmc2NCkge1xyXG5cdFx0RW5naW5lLmRpc2FibGVTZWxlY3Rpb24oKTtcclxuXHRcdHN0cmluZzY0ID0gc3RyaW5nNjQucmVwbGFjZSgvXFxzL2csICcnKTtcclxuXHRcdHN0cmluZzY0ID0gc3RyaW5nNjQucmVwbGFjZSgvXFwuL2csICcnKTtcclxuXHRcdHN0cmluZzY0ID0gc3RyaW5nNjQucmVwbGFjZSgvXFxuL2csICcnKTtcclxuXHRcdHZhciBkZWNvZGVkU2F2ZSA9IEJhc2U2NC5kZWNvZGUoc3RyaW5nNjQpO1xyXG5cdFx0bG9jYWxTdG9yYWdlLmdhbWVTdGF0ZSA9IGRlY29kZWRTYXZlO1xyXG5cdFx0bG9jYXRpb24ucmVsb2FkKCk7XHJcblx0fSxcclxuXHJcblx0ZXZlbnQ6IGZ1bmN0aW9uKGNhdCwgYWN0KSB7XHJcblx0XHRpZih0eXBlb2YgZ2EgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCBjYXQsIGFjdCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Y29uZmlybURlbGV0ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdSZXN0YXJ0PycpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0dGV4dDogW18oJ3Jlc3RhcnQgdGhlIGdhbWU/JyldLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQneWVzJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ3llcycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IEVuZ2luZS5kZWxldGVTYXZlXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdubyc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdubycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0ZGVsZXRlU2F2ZTogZnVuY3Rpb24obm9SZWxvYWQpIHtcclxuXHRcdGlmKHR5cGVvZiBTdG9yYWdlICE9ICd1bmRlZmluZWQnICYmIGxvY2FsU3RvcmFnZSkge1xyXG5cdFx0XHR3aW5kb3cuU3RhdGUgPSB7fTtcclxuXHRcdFx0bG9jYWxTdG9yYWdlLmNsZWFyKCk7XHJcblx0XHR9XHJcblx0XHRpZighbm9SZWxvYWQpIHtcclxuXHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0c2hhcmU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnU2hhcmUnKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtfKCdicmluZyB5b3VyIGZyaWVuZHMuJyldLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnZmFjZWJvb2snOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnZmFjZWJvb2snKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5vcGVuKCdodHRwczovL3d3dy5mYWNlYm9vay5jb20vc2hhcmVyL3NoYXJlci5waHA/dT0nICsgRW5naW5lLlNJVEVfVVJMLCAnc2hhcmVyJywgJ3dpZHRoPTYyNixoZWlnaHQ9NDM2LGxvY2F0aW9uPW5vLG1lbnViYXI9bm8scmVzaXphYmxlPW5vLHNjcm9sbGJhcnM9bm8sc3RhdHVzPW5vLHRvb2xiYXI9bm8nKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdnb29nbGUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDpfKCdnb29nbGUrJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR3aW5kb3cub3BlbignaHR0cHM6Ly9wbHVzLmdvb2dsZS5jb20vc2hhcmU/dXJsPScgKyBFbmdpbmUuU0lURV9VUkwsICdzaGFyZXInLCAnd2lkdGg9NDgwLGhlaWdodD00MzYsbG9jYXRpb249bm8sbWVudWJhcj1ubyxyZXNpemFibGU9bm8sc2Nyb2xsYmFycz1ubyxzdGF0dXM9bm8sdG9vbGJhcj1ubycpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J3R3aXR0ZXInOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygndHdpdHRlcicpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0d2luZG93Lm9wZW4oJ2h0dHBzOi8vdHdpdHRlci5jb20vaW50ZW50L3R3ZWV0P3RleHQ9QSUyMERhcmslMjBSb29tJnVybD0nICsgRW5naW5lLlNJVEVfVVJMLCAnc2hhcmVyJywgJ3dpZHRoPTY2MCxoZWlnaHQ9MjYwLGxvY2F0aW9uPW5vLG1lbnViYXI9bm8scmVzaXphYmxlPW5vLHNjcm9sbGJhcnM9eWVzLHN0YXR1cz1ubyx0b29sYmFyPW5vJyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQncmVkZGl0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ3JlZGRpdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0d2luZG93Lm9wZW4oJ2h0dHA6Ly93d3cucmVkZGl0LmNvbS9zdWJtaXQ/dXJsPScgKyBFbmdpbmUuU0lURV9VUkwsICdzaGFyZXInLCAnd2lkdGg9OTYwLGhlaWdodD03MDAsbG9jYXRpb249bm8sbWVudWJhcj1ubyxyZXNpemFibGU9bm8sc2Nyb2xsYmFycz15ZXMsc3RhdHVzPW5vLHRvb2xiYXI9bm8nKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdjbG9zZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdjbG9zZScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0d2lkdGg6ICc0MDBweCdcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGZpbmRTdHlsZXNoZWV0OiBmdW5jdGlvbih0aXRsZSkge1xyXG5cdFx0Zm9yKHZhciBpPTA7IGk8ZG9jdW1lbnQuc3R5bGVTaGVldHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIHNoZWV0ID0gZG9jdW1lbnQuc3R5bGVTaGVldHNbaV07XHJcblx0XHRcdGlmKHNoZWV0LnRpdGxlID09IHRpdGxlKSB7XHJcblx0XHRcdFx0cmV0dXJuIHNoZWV0O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9LFxyXG5cclxuXHRpc0xpZ2h0c09mZjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgZGFya0NzcyA9IEVuZ2luZS5maW5kU3R5bGVzaGVldCgnZGFya2VuTGlnaHRzJyk7XHJcblx0XHRpZiAoIGRhcmtDc3MgIT0gbnVsbCAmJiAhZGFya0Nzcy5kaXNhYmxlZCApIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHJcblx0dHVybkxpZ2h0c09mZjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgZGFya0NzcyA9IEVuZ2luZS5maW5kU3R5bGVzaGVldCgnZGFya2VuTGlnaHRzJyk7XHJcblx0XHRpZiAoZGFya0NzcyA9PSBudWxsKSB7XHJcblx0XHRcdCQoJ2hlYWQnKS5hcHBlbmQoJzxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiY3NzL2RhcmsuY3NzXCIgdHlwZT1cInRleHQvY3NzXCIgdGl0bGU9XCJkYXJrZW5MaWdodHNcIiAvPicpO1xyXG5cdFx0XHQkKCcubGlnaHRzT2ZmJykudGV4dChfKCdsaWdodHMgb24uJykpO1xyXG5cdFx0fSBlbHNlIGlmIChkYXJrQ3NzLmRpc2FibGVkKSB7XHJcblx0XHRcdGRhcmtDc3MuZGlzYWJsZWQgPSBmYWxzZTtcclxuXHRcdFx0JCgnLmxpZ2h0c09mZicpLnRleHQoXygnbGlnaHRzIG9uLicpKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQoXCIjZGFya2VuTGlnaHRzXCIpLmF0dHIoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpO1xyXG5cdFx0XHRkYXJrQ3NzLmRpc2FibGVkID0gdHJ1ZTtcclxuXHRcdFx0JCgnLmxpZ2h0c09mZicpLnRleHQoXygnbGlnaHRzIG9mZi4nKSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Ly8gR2V0cyBhIGd1aWRcclxuXHRnZXRHdWlkOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uKGMpIHtcclxuXHRcdFx0dmFyIHIgPSBNYXRoLnJhbmRvbSgpKjE2fDAsIHYgPSBjID09ICd4JyA/IHIgOiAociYweDN8MHg4KTtcclxuXHRcdFx0cmV0dXJuIHYudG9TdHJpbmcoMTYpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0YWN0aXZlTW9kdWxlOiBudWxsLFxyXG5cclxuXHR0cmF2ZWxUbzogZnVuY3Rpb24obW9kdWxlKSB7XHJcblx0XHRpZihFbmdpbmUuYWN0aXZlTW9kdWxlICE9IG1vZHVsZSkge1xyXG5cdFx0XHR2YXIgY3VycmVudEluZGV4ID0gRW5naW5lLmFjdGl2ZU1vZHVsZSA/ICQoJy5sb2NhdGlvbicpLmluZGV4KEVuZ2luZS5hY3RpdmVNb2R1bGUucGFuZWwpIDogMTtcclxuXHRcdFx0JCgnZGl2LmhlYWRlckJ1dHRvbicpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xyXG5cdFx0XHRtb2R1bGUudGFiLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xyXG5cclxuXHRcdFx0dmFyIHNsaWRlciA9ICQoJyNsb2NhdGlvblNsaWRlcicpO1xyXG5cdFx0XHR2YXIgc3RvcmVzID0gJCgnI3N0b3Jlc0NvbnRhaW5lcicpO1xyXG5cdFx0XHR2YXIgcGFuZWxJbmRleCA9ICQoJy5sb2NhdGlvbicpLmluZGV4KG1vZHVsZS5wYW5lbCk7XHJcblx0XHRcdHZhciBkaWZmID0gTWF0aC5hYnMocGFuZWxJbmRleCAtIGN1cnJlbnRJbmRleCk7XHJcblx0XHRcdHNsaWRlci5hbmltYXRlKHtsZWZ0OiAtKHBhbmVsSW5kZXggKiA3MDApICsgJ3B4J30sIDMwMCAqIGRpZmYpO1xyXG5cclxuXHRcdFx0aWYoJFNNLmdldCgnc3RvcmVzLndvb2QnKSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdC8vIEZJWE1FIFdoeSBkb2VzIHRoaXMgd29yayBpZiB0aGVyZSdzIGFuIGFuaW1hdGlvbiBxdWV1ZS4uLj9cclxuXHRcdFx0XHRzdG9yZXMuYW5pbWF0ZSh7cmlnaHQ6IC0ocGFuZWxJbmRleCAqIDcwMCkgKyAncHgnfSwgMzAwICogZGlmZik7XHJcblx0XHRcdH1cclxuXHRcdFxyXG5cdFx0XHRFbmdpbmUuYWN0aXZlTW9kdWxlID0gbW9kdWxlO1xyXG5cclxuXHRcdFx0bW9kdWxlLm9uQXJyaXZhbChkaWZmKTtcclxuXHJcblx0XHRcdGlmKEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gUm9vbVxyXG5cdFx0XHRcdC8vICB8fCBFbmdpbmUuYWN0aXZlTW9kdWxlID09IFBhdGhcclxuXHRcdFx0XHQpIHtcclxuXHRcdFx0XHQvLyBEb24ndCBmYWRlIG91dCB0aGUgd2VhcG9ucyBpZiB3ZSdyZSBzd2l0Y2hpbmcgdG8gYSBtb2R1bGVcclxuXHRcdFx0XHQvLyB3aGVyZSB3ZSdyZSBnb2luZyB0byBrZWVwIHNob3dpbmcgdGhlbSBhbnl3YXkuXHJcblx0XHRcdFx0aWYgKG1vZHVsZSAhPSBSb29tIFxyXG5cdFx0XHRcdFx0Ly8gJiYgbW9kdWxlICE9IFBhdGhcclxuXHRcdFx0XHQpIHtcclxuXHRcdFx0XHRcdCQoJ2RpdiN3ZWFwb25zJykuYW5pbWF0ZSh7b3BhY2l0eTogMH0sIDMwMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZihtb2R1bGUgPT0gUm9vbVxyXG5cdFx0XHRcdC8vICB8fCBtb2R1bGUgPT0gUGF0aFxyXG5cdFx0XHRcdCkge1xyXG5cdFx0XHRcdCQoJ2RpdiN3ZWFwb25zJykuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIDMwMCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdE5vdGlmaWNhdGlvbnMucHJpbnRRdWV1ZShtb2R1bGUpO1xyXG5cdFx0XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0LyogTW92ZSB0aGUgc3RvcmVzIHBhbmVsIGJlbmVhdGggdG9wX2NvbnRhaW5lciAob3IgdG8gdG9wOiAwcHggaWYgdG9wX2NvbnRhaW5lclxyXG5cdFx0KiBlaXRoZXIgaGFzbid0IGJlZW4gZmlsbGVkIGluIG9yIGlzIG51bGwpIHVzaW5nIHRyYW5zaXRpb25fZGlmZiB0byBzeW5jIHdpdGhcclxuXHRcdCogdGhlIGFuaW1hdGlvbiBpbiBFbmdpbmUudHJhdmVsVG8oKS5cclxuXHRcdCovXHJcblx0bW92ZVN0b3Jlc1ZpZXc6IGZ1bmN0aW9uKHRvcF9jb250YWluZXIsIHRyYW5zaXRpb25fZGlmZikge1xyXG5cdFx0dmFyIHN0b3JlcyA9ICQoJyNzdG9yZXNDb250YWluZXInKTtcclxuXHJcblx0XHQvLyBJZiB3ZSBkb24ndCBoYXZlIGEgc3RvcmVzQ29udGFpbmVyIHlldCwgbGVhdmUuXHJcblx0XHRpZih0eXBlb2Yoc3RvcmVzKSA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybjtcclxuXHJcblx0XHRpZih0eXBlb2YodHJhbnNpdGlvbl9kaWZmKSA9PT0gJ3VuZGVmaW5lZCcpIHRyYW5zaXRpb25fZGlmZiA9IDE7XHJcblxyXG5cdFx0aWYodG9wX2NvbnRhaW5lciA9PT0gbnVsbCkge1xyXG5cdFx0XHRzdG9yZXMuYW5pbWF0ZSh7dG9wOiAnMHB4J30sIHtxdWV1ZTogZmFsc2UsIGR1cmF0aW9uOiAzMDAgKiB0cmFuc2l0aW9uX2RpZmZ9KTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYoIXRvcF9jb250YWluZXIubGVuZ3RoKSB7XHJcblx0XHRcdHN0b3Jlcy5hbmltYXRlKHt0b3A6ICcwcHgnfSwge3F1ZXVlOiBmYWxzZSwgZHVyYXRpb246IDMwMCAqIHRyYW5zaXRpb25fZGlmZn0pO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHN0b3Jlcy5hbmltYXRlKHtcclxuXHRcdFx0XHRcdHRvcDogdG9wX2NvbnRhaW5lci5oZWlnaHQoKSArIDI2ICsgJ3B4J1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0cXVldWU6IGZhbHNlLCBcclxuXHRcdFx0XHRcdGR1cmF0aW9uOiAzMDAgKiB0cmFuc2l0aW9uX2RpZmZcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0bG9nOiBmdW5jdGlvbihtc2cpIHtcclxuXHRcdGlmKHRoaXMuX2xvZykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhtc2cpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHVwZGF0ZVNsaWRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgc2xpZGVyID0gJCgnI2xvY2F0aW9uU2xpZGVyJyk7XHJcblx0XHRzbGlkZXIud2lkdGgoKHNsaWRlci5jaGlsZHJlbigpLmxlbmd0aCAqIDcwMCkgKyAncHgnKTtcclxuXHR9LFxyXG5cclxuXHR1cGRhdGVPdXRlclNsaWRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgc2xpZGVyID0gJCgnI291dGVyU2xpZGVyJyk7XHJcblx0XHRzbGlkZXIud2lkdGgoKHNsaWRlci5jaGlsZHJlbigpLmxlbmd0aCAqIDcwMCkgKyAncHgnKTtcclxuXHR9LFxyXG5cclxuXHRnZXRJbmNvbWVNc2c6IGZ1bmN0aW9uKG51bSwgZGVsYXkpIHtcclxuXHRcdHJldHVybiBfKFwiezB9IHBlciB7MX1zXCIsIChudW0gPiAwID8gXCIrXCIgOiBcIlwiKSArIG51bSwgZGVsYXkpO1xyXG5cdH0sXHJcblxyXG5cdHN3aXBlTGVmdDogZnVuY3Rpb24oZSkge1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZS5zd2lwZUxlZnQpIHtcclxuXHRcdFx0RW5naW5lLmFjdGl2ZU1vZHVsZS5zd2lwZUxlZnQoZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0c3dpcGVSaWdodDogZnVuY3Rpb24oZSkge1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZS5zd2lwZVJpZ2h0KSB7XHJcblx0XHRcdEVuZ2luZS5hY3RpdmVNb2R1bGUuc3dpcGVSaWdodChlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRzd2lwZVVwOiBmdW5jdGlvbihlKSB7XHJcblx0XHRpZihFbmdpbmUuYWN0aXZlTW9kdWxlLnN3aXBlVXApIHtcclxuXHRcdFx0RW5naW5lLmFjdGl2ZU1vZHVsZS5zd2lwZVVwKGUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHN3aXBlRG93bjogZnVuY3Rpb24oZSkge1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZS5zd2lwZURvd24pIHtcclxuXHRcdFx0RW5naW5lLmFjdGl2ZU1vZHVsZS5zd2lwZURvd24oZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0ZGlzYWJsZVNlbGVjdGlvbjogZnVuY3Rpb24oKSB7XHJcblx0XHRkb2N1bWVudC5vbnNlbGVjdHN0YXJ0ID0gZXZlbnROdWxsaWZpZXI7IC8vIHRoaXMgaXMgZm9yIElFXHJcblx0XHRkb2N1bWVudC5vbm1vdXNlZG93biA9IGV2ZW50TnVsbGlmaWVyOyAvLyB0aGlzIGlzIGZvciB0aGUgcmVzdFxyXG5cdH0sXHJcblxyXG5cdGVuYWJsZVNlbGVjdGlvbjogZnVuY3Rpb24oKSB7XHJcblx0XHRkb2N1bWVudC5vbnNlbGVjdHN0YXJ0ID0gZXZlbnRQYXNzdGhyb3VnaDtcclxuXHRcdGRvY3VtZW50Lm9ubW91c2Vkb3duID0gZXZlbnRQYXNzdGhyb3VnaDtcclxuXHR9LFxyXG5cclxuXHRhdXRvU2VsZWN0OiBmdW5jdGlvbihzZWxlY3Rvcikge1xyXG5cdFx0JChzZWxlY3RvcikuZm9jdXMoKS5zZWxlY3QoKTtcclxuXHR9LFxyXG5cclxuXHRoYW5kbGVTdGF0ZVVwZGF0ZXM6IGZ1bmN0aW9uKGUpe1xyXG5cdFxyXG5cdH0sXHJcblxyXG5cdHN3aXRjaExhbmd1YWdlOiBmdW5jdGlvbihkb20pe1xyXG5cdFx0dmFyIGxhbmcgPSAkKGRvbSkuZGF0YShcImxhbmd1YWdlXCIpO1xyXG5cdFx0aWYoZG9jdW1lbnQubG9jYXRpb24uaHJlZi5zZWFyY2goL1tcXD9cXCZdbGFuZz1bYS16X10rLykgIT0gLTEpe1xyXG5cdFx0XHRkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gZG9jdW1lbnQubG9jYXRpb24uaHJlZi5yZXBsYWNlKCAvKFtcXD9cXCZdbGFuZz0pKFthLXpfXSspL2dpICwgXCIkMVwiK2xhbmcgKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gZG9jdW1lbnQubG9jYXRpb24uaHJlZiArICggKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYuc2VhcmNoKC9cXD8vKSAhPSAtMSApP1wiJlwiOlwiP1wiKSArIFwibGFuZz1cIitsYW5nO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHNhdmVMYW5ndWFnZTogZnVuY3Rpb24oKXtcclxuXHRcdHZhciBsYW5nID0gZGVjb2RlVVJJQ29tcG9uZW50KChuZXcgUmVnRXhwKCdbP3wmXWxhbmc9JyArICcoW14mO10rPykoJnwjfDt8JCknKS5leGVjKGxvY2F0aW9uLnNlYXJjaCl8fFssXCJcIl0pWzFdLnJlcGxhY2UoL1xcKy9nLCAnJTIwJykpfHxudWxsO1x0XHJcblx0XHRpZihsYW5nICYmIHR5cGVvZiBTdG9yYWdlICE9ICd1bmRlZmluZWQnICYmIGxvY2FsU3RvcmFnZSkge1xyXG5cdFx0XHRsb2NhbFN0b3JhZ2UubGFuZyA9IGxhbmc7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0c2V0VGltZW91dDogZnVuY3Rpb24oY2FsbGJhY2ssIHRpbWVvdXQsIHNraXBEb3VibGU/KXtcclxuXHJcblx0XHRpZiggRW5naW5lLm9wdGlvbnMuZG91YmxlVGltZSAmJiAhc2tpcERvdWJsZSApe1xyXG5cdFx0XHRFbmdpbmUubG9nKCdEb3VibGUgdGltZSwgY3V0dGluZyB0aW1lb3V0IGluIGhhbGYnKTtcclxuXHRcdFx0dGltZW91dCAvPSAyO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBzZXRUaW1lb3V0KGNhbGxiYWNrLCB0aW1lb3V0KTtcclxuXHJcblx0fVxyXG5cclxufTtcclxuXHJcbmZ1bmN0aW9uIGV2ZW50TnVsbGlmaWVyKGUpIHtcclxuXHRyZXR1cm4gJChlLnRhcmdldCkuaGFzQ2xhc3MoJ21lbnVCdG4nKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZXZlbnRQYXNzdGhyb3VnaChlKSB7XHJcblx0cmV0dXJuIHRydWU7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBpblZpZXcoZGlyLCBlbGVtKXtcclxuXHJcbiAgICAgICAgdmFyIHNjVG9wID0gJCgnI21haW4nKS5vZmZzZXQoKS50b3A7XHJcbiAgICAgICAgdmFyIHNjQm90ID0gc2NUb3AgKyAkKCcjbWFpbicpLmhlaWdodCgpO1xyXG5cclxuICAgICAgICB2YXIgZWxUb3AgPSBlbGVtLm9mZnNldCgpLnRvcDtcclxuICAgICAgICB2YXIgZWxCb3QgPSBlbFRvcCArIGVsZW0uaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIGlmKCBkaXIgPT0gJ3VwJyApe1xyXG4gICAgICAgICAgICAgICAgLy8gU1RPUCBNT1ZJTkcgSUYgQk9UVE9NIE9GIEVMRU1FTlQgSVMgVklTSUJMRSBJTiBTQ1JFRU5cclxuICAgICAgICAgICAgICAgIHJldHVybiAoIGVsQm90IDwgc2NCb3QgKTtcclxuICAgICAgICB9ZWxzZSBpZiggZGlyID09ICdkb3duJyApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICggZWxUb3AgPiBzY1RvcCApO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICggKCBlbEJvdCA8PSBzY0JvdCApICYmICggZWxUb3AgPj0gc2NUb3AgKSApO1xyXG4gICAgICAgIH1cclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNjcm9sbEJ5WChlbGVtLCB4KXtcclxuXHJcbiAgICAgICAgdmFyIGVsVG9wID0gcGFyc2VJbnQoIGVsZW0uY3NzKCd0b3AnKSwgMTAgKTtcclxuICAgICAgICBlbGVtLmNzcyggJ3RvcCcsICggZWxUb3AgKyB4ICkgKyBcInB4XCIgKTtcclxuXHJcbn1cclxuXHJcblxyXG4vL2NyZWF0ZSBqUXVlcnkgQ2FsbGJhY2tzKCkgdG8gaGFuZGxlIG9iamVjdCBldmVudHMgXHJcbiQuRGlzcGF0Y2ggPSBmdW5jdGlvbiggaWQgKSB7XHJcblx0dmFyIGNhbGxiYWNrcywgdG9waWMgPSBpZCAmJiBFbmdpbmUudG9waWNzWyBpZCBdO1xyXG5cdGlmICggIXRvcGljICkge1xyXG5cdFx0Y2FsbGJhY2tzID0galF1ZXJ5LkNhbGxiYWNrcygpO1xyXG5cdFx0dG9waWMgPSB7XHJcblx0XHRcdFx0cHVibGlzaDogY2FsbGJhY2tzLmZpcmUsXHJcblx0XHRcdFx0c3Vic2NyaWJlOiBjYWxsYmFja3MuYWRkLFxyXG5cdFx0XHRcdHVuc3Vic2NyaWJlOiBjYWxsYmFja3MucmVtb3ZlXHJcblx0XHR9O1xyXG5cdFx0aWYgKCBpZCApIHtcclxuXHRcdFx0RW5naW5lLnRvcGljc1sgaWQgXSA9IHRvcGljO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gdG9waWM7XHJcbn07XHJcblxyXG4kKGZ1bmN0aW9uKCkge1xyXG5cdEVuZ2luZS5pbml0KCk7XHJcbn0pO1xyXG5cclxuIiwiLyoqXHJcbiAqIE1vZHVsZSB0aGF0IGhhbmRsZXMgdGhlIHJhbmRvbSBldmVudCBzeXN0ZW1cclxuICovXHJcbmltcG9ydCB7IEV2ZW50c1JvYWRXYW5kZXIgfSBmcm9tIFwiLi9ldmVudHMvcm9hZHdhbmRlclwiO1xyXG5pbXBvcnQgeyBFdmVudHNSb29tIH0gZnJvbSBcIi4vZXZlbnRzL3Jvb21cIjtcclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4vZW5naW5lXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tIFwiLi9ub3RpZmljYXRpb25zXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuL0J1dHRvblwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBRFJFdmVudCB7XHJcblx0dGl0bGU6IHN0cmluZyxcclxuXHRpc0F2YWlsYWJsZT86IEZ1bmN0aW9uLFxyXG5cdGlzU3VwZXJMaWtlbHk/OiBGdW5jdGlvbixcclxuXHRzY2VuZXM6IHtcclxuXHRcdC8vIHR5cGUgdGhpcyBvdXQgYmV0dGVyIHVzaW5nIEluZGV4IFNpZ25hdHVyZXNcclxuXHR9LFxyXG5cdGV2ZW50UGFuZWw/OiBhbnlcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTY2VuZSB7XHJcblx0c2VlbkZsYWc6IEZ1bmN0aW9uLFxyXG5cdG5leHRTY2VuZTogc3RyaW5nLFxyXG5cdG9uTG9hZDogRnVuY3Rpb24sXHJcblx0dGV4dDogQXJyYXk8c3RyaW5nPixcclxuXHRidXR0b25zOiB7XHJcblx0XHRbaWQ6IHN0cmluZ106IEV2ZW50QnV0dG9uXHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50QnV0dG9uIHtcclxuXHR0ZXh0OiBzdHJpbmcsXHJcblx0bmV4dFNjZW5lOiB7XHJcblx0XHRbaWQ6IG51bWJlcl06IHN0cmluZ1xyXG5cdH0sXHJcblx0b25DaG9vc2U6IEZ1bmN0aW9uXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBFdmVudHMgPSB7XHJcblx0XHRcclxuXHRfRVZFTlRfVElNRV9SQU5HRTogWzMsIDZdLCAvLyByYW5nZSwgaW4gbWludXRlc1xyXG5cdF9QQU5FTF9GQURFOiAyMDAsXHJcblx0X0ZJR0hUX1NQRUVEOiAxMDAsXHJcblx0X0VBVF9DT09MRE9XTjogNSxcclxuXHRfTUVEU19DT09MRE9XTjogNyxcclxuXHRfTEVBVkVfQ09PTERPV046IDEsXHJcblx0U1RVTl9EVVJBVElPTjogNDAwMCxcclxuXHRCTElOS19JTlRFUlZBTDogZmFsc2UsXHJcblxyXG5cdEV2ZW50UG9vbDogPGFueT5bXSxcclxuXHRldmVudFN0YWNrOiA8YW55PltdLFxyXG5cdF9ldmVudFRpbWVvdXQ6IDAsXHJcblxyXG5cdExvY2F0aW9uczoge30sXHJcblxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdFx0XHJcblx0XHQvLyBCdWlsZCB0aGUgRXZlbnQgUG9vbFxyXG5cdFx0RXZlbnRzLkV2ZW50UG9vbCA9IFtdLmNvbmNhdChcclxuXHRcdFx0RXZlbnRzUm9vbSBhcyBhbnksXHJcblx0XHRcdEV2ZW50c1JvYWRXYW5kZXIgYXMgYW55XHJcblx0XHQpO1xyXG5cclxuXHRcdHRoaXMuTG9jYXRpb25zW1wiUm9vbVwiXSA9IEV2ZW50c1Jvb207XHJcblx0XHR0aGlzLkxvY2F0aW9uc1tcIlJvYWRXYW5kZXJcIl0gPSBFdmVudHNSb2FkV2FuZGVyO1xyXG5cdFx0XHJcblx0XHRFdmVudHMuZXZlbnRTdGFjayA9IFtdO1xyXG5cdFx0XHJcblx0XHQvL3N1YnNjcmliZSB0byBzdGF0ZVVwZGF0ZXNcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdCQuRGlzcGF0Y2goJ3N0YXRlVXBkYXRlJykuc3Vic2NyaWJlKEV2ZW50cy5oYW5kbGVTdGF0ZVVwZGF0ZXMpO1xyXG5cdH0sXHJcblx0XHJcblx0b3B0aW9uczoge30sIC8vIE5vdGhpbmcgZm9yIG5vd1xyXG4gICAgXHJcblx0YWN0aXZlU2NlbmU6ICcnLFxyXG4gICAgXHJcblx0bG9hZFNjZW5lOiBmdW5jdGlvbihuYW1lKSB7XHJcblx0XHRFbmdpbmUubG9nKCdsb2FkaW5nIHNjZW5lOiAnICsgbmFtZSk7XHJcblx0XHRFdmVudHMuYWN0aXZlU2NlbmUgPSBuYW1lO1xyXG5cdFx0dmFyIHNjZW5lID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnNjZW5lc1tuYW1lXTtcclxuXHRcdFxyXG5cdFx0Ly8gaGFuZGxlcyBvbmUtdGltZSBzY2VuZXMsIHN1Y2ggYXMgaW50cm9kdWN0aW9uc1xyXG5cdFx0Ly8gbWF5YmUgSSBjYW4gbWFrZSBhIG1vcmUgZXhwbGljaXQgXCJpbnRyb2R1Y3Rpb25cIiBsb2dpY2FsIGZsb3cgdG8gbWFrZSB0aGlzXHJcblx0XHQvLyBhIGxpdHRsZSBtb3JlIGVsZWdhbnQsIGdpdmVuIHRoYXQgdGhlcmUgd2lsbCBhbHdheXMgYmUgYW4gXCJpbnRyb2R1Y3Rpb25cIiBzY2VuZVxyXG5cdFx0Ly8gdGhhdCdzIG9ubHkgbWVhbnQgdG8gYmUgcnVuIGEgc2luZ2xlIHRpbWUuXHJcblx0XHRpZiAoc2NlbmUuc2VlbkZsYWcgJiYgc2NlbmUuc2VlbkZsYWcoKSkge1xyXG5cdFx0XHRFdmVudHMubG9hZFNjZW5lKHNjZW5lLm5leHRTY2VuZSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNjZW5lIHJld2FyZFxyXG5cdFx0aWYoc2NlbmUucmV3YXJkKSB7XHJcblx0XHRcdCRTTS5hZGRNKCdzdG9yZXMnLCBzY2VuZS5yZXdhcmQpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBvbkxvYWRcclxuXHRcdGlmKHNjZW5lLm9uTG9hZCkge1xyXG5cdFx0XHRzY2VuZS5vbkxvYWQoKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gTm90aWZ5IHRoZSBzY2VuZSBjaGFuZ2VcclxuXHRcdGlmKHNjZW5lLm5vdGlmaWNhdGlvbikge1xyXG5cdFx0XHROb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBzY2VuZS5ub3RpZmljYXRpb24pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQkKCcjZGVzY3JpcHRpb24nLCBFdmVudHMuZXZlbnRQYW5lbCgpKS5lbXB0eSgpO1xyXG5cdFx0JCgnI2J1dHRvbnMnLCBFdmVudHMuZXZlbnRQYW5lbCgpKS5lbXB0eSgpO1xyXG5cdFx0RXZlbnRzLnN0YXJ0U3Rvcnkoc2NlbmUpO1xyXG5cdH0sXHJcblx0XHJcblx0ZHJhd0Zsb2F0VGV4dDogZnVuY3Rpb24odGV4dCwgcGFyZW50KSB7XHJcblx0XHQkKCc8ZGl2PicpLnRleHQodGV4dCkuYWRkQ2xhc3MoJ2RhbWFnZVRleHQnKS5hcHBlbmRUbyhwYXJlbnQpLmFuaW1hdGUoe1xyXG5cdFx0XHQnYm90dG9tJzogJzUwcHgnLFxyXG5cdFx0XHQnb3BhY2l0eSc6ICcwJ1xyXG5cdFx0fSxcclxuXHRcdDMwMCxcclxuXHRcdCdsaW5lYXInLFxyXG5cdFx0ZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlKCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdFxyXG5cdHN0YXJ0U3Rvcnk6IGZ1bmN0aW9uKHNjZW5lKSB7XHJcblx0XHQvLyBXcml0ZSB0aGUgdGV4dFxyXG5cdFx0dmFyIGRlc2MgPSAkKCcjZGVzY3JpcHRpb24nLCBFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdGZvcih2YXIgaSBpbiBzY2VuZS50ZXh0KSB7XHJcblx0XHRcdCQoJzxkaXY+JykudGV4dChzY2VuZS50ZXh0W2ldKS5hcHBlbmRUbyhkZXNjKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYoc2NlbmUudGV4dGFyZWEgIT0gbnVsbCkge1xyXG5cdFx0XHR2YXIgdGEgPSAkKCc8dGV4dGFyZWE+JykudmFsKHNjZW5lLnRleHRhcmVhKS5hcHBlbmRUbyhkZXNjKTtcclxuXHRcdFx0aWYoc2NlbmUucmVhZG9ubHkpIHtcclxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0dGEuYXR0cigncmVhZG9ubHknLCB0cnVlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBEcmF3IHRoZSBidXR0b25zXHJcblx0XHRFdmVudHMuZHJhd0J1dHRvbnMoc2NlbmUpO1xyXG5cdH0sXHJcblx0XHJcblx0ZHJhd0J1dHRvbnM6IGZ1bmN0aW9uKHNjZW5lKSB7XHJcblx0XHR2YXIgYnRucyA9ICQoJyNidXR0b25zJywgRXZlbnRzLmV2ZW50UGFuZWwoKSk7XHJcblx0XHRmb3IodmFyIGlkIGluIHNjZW5lLmJ1dHRvbnMpIHtcclxuXHRcdFx0dmFyIGluZm8gPSBzY2VuZS5idXR0b25zW2lkXTtcclxuXHRcdFx0XHR2YXIgYiA9IFxyXG5cdFx0XHRcdC8vbmV3IFxyXG5cdFx0XHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRcdFx0aWQ6IGlkLFxyXG5cdFx0XHRcdFx0dGV4dDogaW5mby50ZXh0LFxyXG5cdFx0XHRcdFx0Y29zdDogaW5mby5jb3N0LFxyXG5cdFx0XHRcdFx0Y2xpY2s6IEV2ZW50cy5idXR0b25DbGljayxcclxuXHRcdFx0XHRcdGNvb2xkb3duOiBpbmZvLmNvb2xkb3duLFxyXG5cdFx0XHRcdFx0aW1hZ2U6IGluZm8uaW1hZ2VcclxuXHRcdFx0XHR9KS5hcHBlbmRUbyhidG5zKTtcclxuXHRcdFx0aWYodHlwZW9mIGluZm8uYXZhaWxhYmxlID09ICdmdW5jdGlvbicgJiYgIWluZm8uYXZhaWxhYmxlKCkpIHtcclxuXHRcdFx0XHRCdXR0b24uc2V0RGlzYWJsZWQoYiwgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYodHlwZW9mIGluZm8udmlzaWJsZSA9PSAnZnVuY3Rpb24nICYmICFpbmZvLnZpc2libGUoKSkge1xyXG5cdFx0XHRcdGIuaGlkZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHR5cGVvZiBpbmZvLmNvb2xkb3duID09ICdudW1iZXInKSB7XHJcblx0XHRcdFx0QnV0dG9uLmNvb2xkb3duKGIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdEV2ZW50cy51cGRhdGVCdXR0b25zKCk7XHJcblx0fSxcclxuXHRcclxuXHR1cGRhdGVCdXR0b25zOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBidG5zID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnNjZW5lc1tFdmVudHMuYWN0aXZlU2NlbmVdLmJ1dHRvbnM7XHJcblx0XHRmb3IodmFyIGJJZCBpbiBidG5zKSB7XHJcblx0XHRcdHZhciBiID0gYnRuc1tiSWRdO1xyXG5cdFx0XHR2YXIgYnRuRWwgPSAkKCcjJytiSWQsIEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0XHRpZih0eXBlb2YgYi5hdmFpbGFibGUgPT0gJ2Z1bmN0aW9uJyAmJiAhYi5hdmFpbGFibGUoKSkge1xyXG5cdFx0XHRcdEJ1dHRvbi5zZXREaXNhYmxlZChidG5FbCwgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGJ1dHRvbkNsaWNrOiBmdW5jdGlvbihidG4pIHtcclxuXHRcdHZhciBpbmZvID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnNjZW5lc1tFdmVudHMuYWN0aXZlU2NlbmVdLmJ1dHRvbnNbYnRuLmF0dHIoJ2lkJyldO1xyXG5cclxuXHRcdGlmKHR5cGVvZiBpbmZvLm9uQ2hvb3NlID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0dmFyIHRleHRhcmVhID0gRXZlbnRzLmV2ZW50UGFuZWwoKS5maW5kKCd0ZXh0YXJlYScpO1xyXG5cdFx0XHRpbmZvLm9uQ2hvb3NlKHRleHRhcmVhLmxlbmd0aCA+IDAgPyB0ZXh0YXJlYS52YWwoKSA6IG51bGwpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBSZXdhcmRcclxuXHRcdGlmKGluZm8ucmV3YXJkKSB7XHJcblx0XHRcdCRTTS5hZGRNKCdzdG9yZXMnLCBpbmZvLnJld2FyZCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdEV2ZW50cy51cGRhdGVCdXR0b25zKCk7XHJcblx0XHRcclxuXHRcdC8vIE5vdGlmaWNhdGlvblxyXG5cdFx0aWYoaW5mby5ub3RpZmljYXRpb24pIHtcclxuXHRcdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgaW5mby5ub3RpZmljYXRpb24pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBOZXh0IFNjZW5lXHJcblx0XHRpZihpbmZvLm5leHRTY2VuZSkge1xyXG5cdFx0XHRpZihpbmZvLm5leHRTY2VuZSA9PSAnZW5kJykge1xyXG5cdFx0XHRcdEV2ZW50cy5lbmRFdmVudCgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHZhciByID0gTWF0aC5yYW5kb20oKTtcclxuXHRcdFx0XHR2YXIgbG93ZXN0TWF0Y2g6IG51bGwgfCBzdHJpbmcgPSBudWxsO1xyXG5cdFx0XHRcdGZvcih2YXIgaSBpbiBpbmZvLm5leHRTY2VuZSkge1xyXG5cdFx0XHRcdFx0aWYociA8IChpIGFzIHVua25vd24gYXMgbnVtYmVyKSAmJiAobG93ZXN0TWF0Y2ggPT0gbnVsbCB8fCBpIDwgbG93ZXN0TWF0Y2gpKSB7XHJcblx0XHRcdFx0XHRcdGxvd2VzdE1hdGNoID0gaTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYobG93ZXN0TWF0Y2ggIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0RXZlbnRzLmxvYWRTY2VuZShpbmZvLm5leHRTY2VuZVtsb3dlc3RNYXRjaF0pO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRFbmdpbmUubG9nKCdFUlJPUjogbm8gc3VpdGFibGUgc2NlbmUgZm91bmQnKTtcclxuXHRcdFx0XHRFdmVudHMuZW5kRXZlbnQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8vIGJsaW5rcyB0aGUgYnJvd3NlciB3aW5kb3cgdGl0bGVcclxuXHRibGlua1RpdGxlOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0aXRsZSA9IGRvY3VtZW50LnRpdGxlO1xyXG5cclxuXHRcdC8vIGV2ZXJ5IDMgc2Vjb25kcyBjaGFuZ2UgdGl0bGUgdG8gJyoqKiBFVkVOVCAqKionLCB0aGVuIDEuNSBzZWNvbmRzIGxhdGVyLCBjaGFuZ2UgaXQgYmFjayB0byB0aGUgb3JpZ2luYWwgdGl0bGUuXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRFdmVudHMuQkxJTktfSU5URVJWQUwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuXHRcdFx0ZG9jdW1lbnQudGl0bGUgPSBfKCcqKiogRVZFTlQgKioqJyk7XHJcblx0XHRcdEVuZ2luZS5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge2RvY3VtZW50LnRpdGxlID0gdGl0bGU7fSwgMTUwMCwgdHJ1ZSk7IFxyXG5cdFx0fSwgMzAwMCk7XHJcblx0fSxcclxuXHJcblx0c3RvcFRpdGxlQmxpbms6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0Y2xlYXJJbnRlcnZhbChFdmVudHMuQkxJTktfSU5URVJWQUwpO1xyXG5cdFx0RXZlbnRzLkJMSU5LX0lOVEVSVkFMID0gZmFsc2U7XHJcblx0fSxcclxuXHRcclxuXHQvLyBNYWtlcyBhbiBldmVudCBoYXBwZW4hXHJcblx0dHJpZ2dlckV2ZW50OiBmdW5jdGlvbigpIHtcclxuXHRcdGlmKEV2ZW50cy5hY3RpdmVFdmVudCgpID09IG51bGwpIHtcclxuXHRcdFx0dmFyIHBvc3NpYmxlRXZlbnRzID0gW107XHJcblx0XHRcdGZvcih2YXIgaSBpbiBFdmVudHMuRXZlbnRQb29sKSB7XHJcblx0XHRcdFx0dmFyIGV2ZW50ID0gRXZlbnRzLkV2ZW50UG9vbFtpXTtcclxuXHRcdFx0XHRpZihldmVudC5pc0F2YWlsYWJsZSgpKSB7XHJcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0XHRwb3NzaWJsZUV2ZW50cy5wdXNoKGV2ZW50KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKHBvc3NpYmxlRXZlbnRzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRcdEV2ZW50cy5zY2hlZHVsZU5leHRFdmVudCgwLjUpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR2YXIgciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoocG9zc2libGVFdmVudHMubGVuZ3RoKSk7XHJcblx0XHRcdFx0RXZlbnRzLnN0YXJ0RXZlbnQocG9zc2libGVFdmVudHNbcl0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0RXZlbnRzLnNjaGVkdWxlTmV4dEV2ZW50KCk7XHJcblx0fSxcclxuXHJcblx0Ly8gbm90IHNjaGVkdWxlZCwgdGhpcyBpcyBmb3Igc3R1ZmYgbGlrZSBsb2NhdGlvbi1iYXNlZCByYW5kb20gZXZlbnRzIG9uIGEgYnV0dG9uIGNsaWNrXHJcblx0dHJpZ2dlckxvY2F0aW9uRXZlbnQ6IGZ1bmN0aW9uKGxvY2F0aW9uKSB7XHJcblx0XHRpZiAodGhpcy5Mb2NhdGlvbnNbbG9jYXRpb25dKSB7XHJcblx0XHRcdGlmKEV2ZW50cy5hY3RpdmVFdmVudCgpID09IG51bGwpIHtcclxuXHRcdFx0XHR2YXIgcG9zc2libGVFdmVudHM6IEFycmF5PGFueT4gPSBbXTtcclxuXHRcdFx0XHRmb3IodmFyIGkgaW4gdGhpcy5Mb2NhdGlvbnNbbG9jYXRpb25dKSB7XHJcblx0XHRcdFx0XHR2YXIgZXZlbnQgPSB0aGlzLkxvY2F0aW9uc1tsb2NhdGlvbl1baV07XHJcblx0XHRcdFx0XHRpZihldmVudC5pc0F2YWlsYWJsZSgpKSB7XHJcblx0XHRcdFx0XHRcdGlmKHR5cGVvZihldmVudC5pc1N1cGVyTGlrZWx5KSA9PSAnZnVuY3Rpb24nICYmIGV2ZW50LmlzU3VwZXJMaWtlbHkoKSkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFN1cGVyTGlrZWx5IGV2ZW50LCBkbyB0aGlzIGFuZCBza2lwIHRoZSByYW5kb20gY2hvaWNlXHJcblx0XHRcdFx0XHRcdFx0RW5naW5lLmxvZygnc3VwZXJMaWtlbHkgZGV0ZWN0ZWQnKTtcclxuXHRcdFx0XHRcdFx0XHRFdmVudHMuc3RhcnRFdmVudChldmVudCk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHBvc3NpYmxlRXZlbnRzLnB1c2goZXZlbnQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcclxuXHRcdFx0XHRpZihwb3NzaWJsZUV2ZW50cy5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHRcdC8vIEV2ZW50cy5zY2hlZHVsZU5leHRFdmVudCgwLjUpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR2YXIgciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoocG9zc2libGVFdmVudHMubGVuZ3RoKSk7XHJcblx0XHRcdFx0XHRFdmVudHMuc3RhcnRFdmVudChwb3NzaWJsZUV2ZW50c1tyXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRhY3RpdmVFdmVudDogZnVuY3Rpb24oKTogQURSRXZlbnQgfCBudWxsIHtcclxuXHRcdGlmKEV2ZW50cy5ldmVudFN0YWNrICYmIEV2ZW50cy5ldmVudFN0YWNrLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0cmV0dXJuIEV2ZW50cy5ldmVudFN0YWNrWzBdO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fSxcclxuXHRcclxuXHRldmVudFBhbmVsOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBFdmVudHMuYWN0aXZlRXZlbnQoKT8uZXZlbnRQYW5lbDtcclxuXHR9LFxyXG5cclxuXHRzdGFydEV2ZW50OiBmdW5jdGlvbihldmVudDogQURSRXZlbnQsIG9wdGlvbnM/KSB7XHJcblx0XHRpZihldmVudCkge1xyXG5cdFx0XHRFbmdpbmUuZXZlbnQoJ2dhbWUgZXZlbnQnLCAnZXZlbnQnKTtcclxuXHRcdFx0RXZlbnRzLmV2ZW50U3RhY2sudW5zaGlmdChldmVudCk7XHJcblx0XHRcdGV2ZW50LmV2ZW50UGFuZWwgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2V2ZW50JykuYWRkQ2xhc3MoJ2V2ZW50UGFuZWwnKS5jc3MoJ29wYWNpdHknLCAnMCcpO1xyXG5cdFx0XHRpZihvcHRpb25zICE9IG51bGwgJiYgb3B0aW9ucy53aWR0aCAhPSBudWxsKSB7XHJcblx0XHRcdFx0RXZlbnRzLmV2ZW50UGFuZWwoKS5jc3MoJ3dpZHRoJywgb3B0aW9ucy53aWR0aCk7XHJcblx0XHRcdH1cclxuXHRcdFx0JCgnPGRpdj4nKS5hZGRDbGFzcygnZXZlbnRUaXRsZScpLnRleHQoRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnRpdGxlIGFzIHN0cmluZykuYXBwZW5kVG8oRXZlbnRzLmV2ZW50UGFuZWwoKSk7XHJcblx0XHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnZGVzY3JpcHRpb24nKS5hcHBlbmRUbyhFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdidXR0b25zJykuYXBwZW5kVG8oRXZlbnRzLmV2ZW50UGFuZWwoKSk7XHJcblx0XHRcdEV2ZW50cy5sb2FkU2NlbmUoJ3N0YXJ0Jyk7XHJcblx0XHRcdCQoJ2RpdiN3cmFwcGVyJykuYXBwZW5kKEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0XHRFdmVudHMuZXZlbnRQYW5lbCgpLmFuaW1hdGUoe29wYWNpdHk6IDF9LCBFdmVudHMuX1BBTkVMX0ZBREUsICdsaW5lYXInKTtcclxuXHRcdFx0dmFyIGN1cnJlbnRTY2VuZUluZm9ybWF0aW9uID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnNjZW5lc1tFdmVudHMuYWN0aXZlU2NlbmVdO1xyXG5cdFx0XHRpZiAoY3VycmVudFNjZW5lSW5mb3JtYXRpb24uYmxpbmspIHtcclxuXHRcdFx0XHRFdmVudHMuYmxpbmtUaXRsZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0c2NoZWR1bGVOZXh0RXZlbnQ6IGZ1bmN0aW9uKHNjYWxlPykge1xyXG5cdFx0dmFyIG5leHRFdmVudCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSooRXZlbnRzLl9FVkVOVF9USU1FX1JBTkdFWzFdIC0gRXZlbnRzLl9FVkVOVF9USU1FX1JBTkdFWzBdKSkgKyBFdmVudHMuX0VWRU5UX1RJTUVfUkFOR0VbMF07XHJcblx0XHRpZihzY2FsZSA+IDApIHsgbmV4dEV2ZW50ICo9IHNjYWxlOyB9XHJcblx0XHRFbmdpbmUubG9nKCduZXh0IGV2ZW50IHNjaGVkdWxlZCBpbiAnICsgbmV4dEV2ZW50ICsgJyBtaW51dGVzJyk7XHJcblx0XHRFdmVudHMuX2V2ZW50VGltZW91dCA9IEVuZ2luZS5zZXRUaW1lb3V0KEV2ZW50cy50cmlnZ2VyRXZlbnQsIG5leHRFdmVudCAqIDYwICogMTAwMCk7XHJcblx0fSxcclxuXHJcblx0ZW5kRXZlbnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLmV2ZW50UGFuZWwoKS5hbmltYXRlKHtvcGFjaXR5OjB9LCBFdmVudHMuX1BBTkVMX0ZBREUsICdsaW5lYXInLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0RXZlbnRzLmV2ZW50UGFuZWwoKS5yZW1vdmUoKTtcclxuXHRcdFx0Y29uc3QgYWN0aXZlRXZlbnQgPSBFdmVudHMuYWN0aXZlRXZlbnQoKTtcclxuXHRcdFx0aWYgKGFjdGl2ZUV2ZW50ICE9PSBudWxsKSBhY3RpdmVFdmVudC5ldmVudFBhbmVsID0gbnVsbDtcclxuXHRcdFx0RXZlbnRzLmV2ZW50U3RhY2suc2hpZnQoKTtcclxuXHRcdFx0RW5naW5lLmxvZyhFdmVudHMuZXZlbnRTdGFjay5sZW5ndGggKyAnIGV2ZW50cyByZW1haW5pbmcnKTtcclxuXHRcdFx0aWYgKEV2ZW50cy5CTElOS19JTlRFUlZBTCkge1xyXG5cdFx0XHRcdEV2ZW50cy5zdG9wVGl0bGVCbGluaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIEZvcmNlIHJlZm9jdXMgb24gdGhlIGJvZHkuIEkgaGF0ZSB5b3UsIElFLlxyXG5cdFx0XHQkKCdib2R5JykuZm9jdXMoKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGhhbmRsZVN0YXRlVXBkYXRlczogZnVuY3Rpb24oZSl7XHJcblx0XHRpZigoZS5jYXRlZ29yeSA9PSAnc3RvcmVzJyB8fCBlLmNhdGVnb3J5ID09ICdpbmNvbWUnKSAmJiBFdmVudHMuYWN0aXZlRXZlbnQoKSAhPSBudWxsKXtcclxuXHRcdFx0RXZlbnRzLnVwZGF0ZUJ1dHRvbnMoKTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcbiIsIi8qKlxyXG4gKiBFdmVudHMgdGhhdCBjYW4gb2NjdXIgd2hlbiB0aGUgUm9hZCBtb2R1bGUgaXMgYWN0aXZlXHJcbiAqKi9cclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4uL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4uL3BsYXllci9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IHsgT3V0cG9zdCB9IGZyb20gXCIuLi9wbGFjZXMvb3V0cG9zdFwiO1xyXG5pbXBvcnQgeyBSb2FkIH0gZnJvbSBcIi4uL3BsYWNlcy9yb2FkXCI7XHJcbmltcG9ydCB7IEFEUkV2ZW50IH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEV2ZW50c1JvYWRXYW5kZXI6IEFycmF5PEFEUkV2ZW50PiA9IFtcclxuICAgIC8vIFN0cmFuZ2VyIGJlYXJpbmcgZ2lmdHNcclxuICAgIHtcclxuICAgICAgICB0aXRsZTogXygnQSBTdHJhbmdlciBCZWNrb25zJyksXHJcbiAgICAgICAgaXNBdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSBSb2FkO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICdzdGFydCc6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdBcyB5b3Ugd2FuZGVyIGFsb25nIHRoZSByb2FkLCBhIGhvb2RlZCBzdHJhbmdlciBnZXN0dXJlcyB0byB5b3UuIEhlIGRvZXNuXFwndCBzZWVtIGludGVyZXN0ZWQgaW4gaHVydGluZyB5b3UuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnV2hhdCBkbyB5b3UgZG8/JylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2Nsb3Nlcic6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnRHJhdyBDbG9zZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTogJ2Nsb3Nlcid9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAnbGVhdmUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0dldCBPdXR0YSBUaGVyZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOiAnbGVhdmUnfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2Nsb3Nlcic6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdZb3UgbW92ZSB0b3dhcmQgaGltIGEgYml0IGFuZCBzdG9wLiBIZSBjb250aW51ZXMgdG8gYmVja29uLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1doYXQgZG8geW91IGRvPycpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdldmVuQ2xvc2VyJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdEcmF3IEV2ZW4gQ2xvc2VyJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6ICdldmVuQ2xvc2VyJ31cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnTmFoLCBUaGlzIGlzIFRvbyBTcG9va3knKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTogJ2xlYXZlJ31cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdldmVuQ2xvc2VyJzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1lvdSBoZXNpdGFudGx5IHdhbGsgY2xvc2VyLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0FzIHNvb24gYXMgeW91IGdldCB3aXRoaW4gYXJtc1xcJyByZWFjaCwgaGUgZ3JhYnMgeW91ciBoYW5kIHdpdGggYWxhcm1pbmcgc3BlZWQuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnSGUgcXVpY2tseSBwbGFjZXMgYW4gb2JqZWN0IGluIHlvdXIgaGFuZCwgdGhlbiBsZWF2ZXMgd29yZGxlc3NseS4nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIG9uTG9hZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbWF5YmUgc29tZSBsb2dpYyB0byBtYWtlIHJlcGVhdHMgbGVzcyBsaWtlbHk/XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9zc2libGVJdGVtcyA9IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ1N0cmFuZ2VyLnNtb290aFN0b25lJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ1N0cmFuZ2VyLndyYXBwZWRLbmlmZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdTdHJhbmdlci5jbG90aEJ1bmRsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdTdHJhbmdlci5jb2luJ1xyXG4gICAgICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IHBvc3NpYmxlSXRlbXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcG9zc2libGVJdGVtcy5sZW5ndGgpXTtcclxuICAgICAgICAgICAgICAgICAgICBDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdUaGFua3MsIEkgZ3Vlc3M/JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdZb3VyIGd1dCBjbGVuY2hlcywgYW5kIHlvdSBmZWVsIHRoZSBzdWRkZW4gdXJnZSB0byBsZWF2ZS4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdBcyB5b3Ugd2FsayBhd2F5LCB5b3UgY2FuIGZlZWwgdGhlIG9sZCBtYW5cXCdzIGdhemUgb24geW91ciBiYWNrLicpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdXZWlyZC4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBVbmxvY2sgT3V0cG9zdFxyXG4gICAge1xyXG4gICAgICAgIHRpdGxlOiBfKCdBIFdheSBGb3J3YXJkIE1ha2VzIEl0c2VsZiBLbm93bicpLFxyXG4gICAgICAgIGlzQXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIChFbmdpbmUuYWN0aXZlTW9kdWxlID09IFJvYWQpXHJcbiAgICAgICAgICAgICAgICAmJiAoJFNNLmdldCgnUm9hZC5jb3VudGVyJykgYXMgbnVtYmVyID4gNikgLy8gY2FuJ3QgaGFwcGVuIFRPTyBlYXJseVxyXG4gICAgICAgICAgICAgICAgJiYgKHR5cGVvZigkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykpID09IFwidW5kZWZpbmVkXCJcclxuICAgICAgICAgICAgICAgICAgICB8fCAkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyIDwgMSkgLy8gY2FuJ3QgaGFwcGVuIHR3aWNlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpc1N1cGVyTGlrZWx5OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuICgkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyIDwgMSkgJiYgKCRTTS5nZXQoJ1JvYWQuY291bnRlcicpIGFzIG51bWJlciA+IDEwKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAnc3RhcnQnOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgXygnU21va2UgY3VybHMgdXB3YXJkcyBmcm9tIGJlaGluZCBhIGhpbGwuIFlvdSBjbGltYiBoaWdoZXIgdG8gaW52ZXN0aWdhdGUuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnRnJvbSB5b3VyIGVsZXZhdGVkIHBvc2l0aW9uLCB5b3UgY2FuIHNlZSBkb3duIGludG8gdGhlIG91dHBvc3QgdGhhdCB0aGUgbWF5b3Igc3Bva2Ugb2YgYmVmb3JlLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1RoZSBPdXRwb3N0IGlzIG5vdyBvcGVuIHRvIHlvdS4nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnQSBsaXR0bGUgZHJhbWF0aWMsIGJ1dCBjb29sJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE91dHBvc3QuaW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJFNNLnNldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hhcmFjdGVyLnNldFF1ZXN0U3RhdHVzKFwibWF5b3JTdXBwbGllc1wiLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENoYXJhY3Rlci5jaGVja1F1ZXN0U3RhdHVzKFwibWF5b3JTdXBwbGllc1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbl07XHJcblxyXG4iLCIvKipcclxuICogRXZlbnRzIHRoYXQgY2FuIG9jY3VyIHdoZW4gdGhlIFJvb20gbW9kdWxlIGlzIGFjdGl2ZVxyXG4gKiovXHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuLi9lbmdpbmVcIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgUm9vbSB9IGZyb20gJy4uL3BsYWNlcy9yb29tJztcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IEFEUkV2ZW50IH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEV2ZW50c1Jvb206IEFycmF5PEFEUkV2ZW50PiA9IFtcclxuXHR7IC8qIFRoZSBOb21hZCAgLS0gIE1lcmNoYW50ICovXHJcblx0XHR0aXRsZTogXygnVGhlIE5vbWFkJyksXHJcblx0XHRpc0F2YWlsYWJsZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiBFbmdpbmUuYWN0aXZlTW9kdWxlID09IFJvb20gJiYgJFNNLmdldCgnc3RvcmVzLmZ1cicsIHRydWUpIGFzIG51bWJlciA+IDA7XHJcblx0XHR9LFxyXG5cdFx0c2NlbmVzOiB7XHJcblx0XHRcdCdzdGFydCc6IHtcclxuXHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRfKCdhIG5vbWFkIHNodWZmbGVzIGludG8gdmlldywgbGFkZW4gd2l0aCBtYWtlc2hpZnQgYmFncyBib3VuZCB3aXRoIHJvdWdoIHR3aW5lLicpLFxyXG5cdFx0XHRcdFx0XyhcIndvbid0IHNheSBmcm9tIHdoZXJlIGhlIGNhbWUsIGJ1dCBpdCdzIGNsZWFyIHRoYXQgaGUncyBub3Qgc3RheWluZy5cIilcclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdG5vdGlmaWNhdGlvbjogXygnYSBub21hZCBhcnJpdmVzLCBsb29raW5nIHRvIHRyYWRlJyksXHJcblx0XHRcdFx0Ymxpbms6IHRydWUsXHJcblx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0J2J1eVNjYWxlcyc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnYnV5IHNjYWxlcycpLFxyXG5cdFx0XHRcdFx0XHRjb3N0OiB7ICdmdXInOiAxMDAgfSxcclxuXHRcdFx0XHRcdFx0cmV3YXJkOiB7ICdzY2FsZXMnOiAxIH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnYnV5VGVldGgnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ2J1eSB0ZWV0aCcpLFxyXG5cdFx0XHRcdFx0XHRjb3N0OiB7ICdmdXInOiAyMDAgfSxcclxuXHRcdFx0XHRcdFx0cmV3YXJkOiB7ICd0ZWV0aCc6IDEgfVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCdidXlCYWl0Jzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdidXkgYmFpdCcpLFxyXG5cdFx0XHRcdFx0XHRjb3N0OiB7ICdmdXInOiA1IH0sXHJcblx0XHRcdFx0XHRcdHJld2FyZDogeyAnYmFpdCc6IDEgfSxcclxuXHRcdFx0XHRcdFx0bm90aWZpY2F0aW9uOiBfKCd0cmFwcyBhcmUgbW9yZSBlZmZlY3RpdmUgd2l0aCBiYWl0LicpXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J2dvb2RieWUnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ3NheSBnb29kYnllJyksXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LCBcclxuXHR7IC8qIE5vaXNlcyBPdXRzaWRlICAtLSAgZ2FpbiB3b29kL2Z1ciAqL1xyXG5cdFx0dGl0bGU6IF8oJ05vaXNlcycpLFxyXG5cdFx0aXNBdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSBSb29tICYmICRTTS5nZXQoJ3N0b3Jlcy53b29kJyk7XHJcblx0XHR9LFxyXG5cdFx0c2NlbmVzOiB7XHJcblx0XHRcdCdzdGFydCc6IHtcclxuXHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRfKCd0aHJvdWdoIHRoZSB3YWxscywgc2h1ZmZsaW5nIG5vaXNlcyBjYW4gYmUgaGVhcmQuJyksXHJcblx0XHRcdFx0XHRfKFwiY2FuJ3QgdGVsbCB3aGF0IHRoZXkncmUgdXAgdG8uXCIpXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRub3RpZmljYXRpb246IF8oJ3N0cmFuZ2Ugbm9pc2VzIGNhbiBiZSBoZWFyZCB0aHJvdWdoIHRoZSB3YWxscycpLFxyXG5cdFx0XHRcdGJsaW5rOiB0cnVlLFxyXG5cdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdCdpbnZlc3RpZ2F0ZSc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnaW52ZXN0aWdhdGUnKSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7IDAuMzogJ3N0dWZmJywgMTogJ25vdGhpbmcnIH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnaWdub3JlJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdpZ25vcmUgdGhlbScpLFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHQnbm90aGluZyc6IHtcclxuXHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRfKCd2YWd1ZSBzaGFwZXMgbW92ZSwganVzdCBvdXQgb2Ygc2lnaHQuJyksXHJcblx0XHRcdFx0XHRfKCd0aGUgc291bmRzIHN0b3AuJylcclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdCdiYWNraW5zaWRlJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdnbyBiYWNrIGluc2lkZScpLFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHQnc3R1ZmYnOiB7XHJcblx0XHRcdFx0cmV3YXJkOiB7IHdvb2Q6IDEwMCwgZnVyOiAxMCB9LFxyXG5cdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdF8oJ2EgYnVuZGxlIG9mIHN0aWNrcyBsaWVzIGp1c3QgYmV5b25kIHRoZSB0aHJlc2hvbGQsIHdyYXBwZWQgaW4gY29hcnNlIGZ1cnMuJyksXHJcblx0XHRcdFx0XHRfKCd0aGUgbmlnaHQgaXMgc2lsZW50LicpXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHQnYmFja2luc2lkZSc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnZ28gYmFjayBpbnNpZGUnKSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0eyAvKiBUaGUgQmVnZ2FyICAtLSAgdHJhZGUgZnVyIGZvciBiZXR0ZXIgZ29vZCAqL1xyXG5cdFx0dGl0bGU6IF8oJ1RoZSBCZWdnYXInKSxcclxuXHRcdGlzQXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gUm9vbSAmJiAkU00uZ2V0KCdzdG9yZXMuZnVyJyk7XHJcblx0XHR9LFxyXG5cdFx0c2NlbmVzOiB7XHJcblx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XygnYSBiZWdnYXIgYXJyaXZlcy4nKSxcclxuXHRcdFx0XHRcdF8oJ2Fza3MgZm9yIGFueSBzcGFyZSBmdXJzIHRvIGtlZXAgaGltIHdhcm0gYXQgbmlnaHQuJylcclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdG5vdGlmaWNhdGlvbjogXygnYSBiZWdnYXIgYXJyaXZlcycpLFxyXG5cdFx0XHRcdGJsaW5rOiB0cnVlLFxyXG5cdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdCc1MGZ1cnMnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ2dpdmUgNTAnKSxcclxuXHRcdFx0XHRcdFx0Y29zdDoge2Z1cjogNTB9LFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsgMC41OiAnc2NhbGVzJywgMC44OiAndGVldGgnLCAxOiAnY2xvdGgnIH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnMTAwZnVycyc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnZ2l2ZSAxMDAnKSxcclxuXHRcdFx0XHRcdFx0Y29zdDoge2Z1cjogMTAwfSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7IDAuNTogJ3RlZXRoJywgMC44OiAnc2NhbGVzJywgMTogJ2Nsb3RoJyB9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J2RlbnknOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ3R1cm4gaGltIGF3YXknKSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0c2NhbGVzOiB7XHJcblx0XHRcdFx0cmV3YXJkOiB7IHNjYWxlczogMjAgfSxcclxuXHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRfKCd0aGUgYmVnZ2FyIGV4cHJlc3NlcyBoaXMgdGhhbmtzLicpLFxyXG5cdFx0XHRcdFx0XygnbGVhdmVzIGEgcGlsZSBvZiBzbWFsbCBzY2FsZXMgYmVoaW5kLicpXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHQnbGVhdmUnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ3NheSBnb29kYnllJyksXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHRlZXRoOiB7XHJcblx0XHRcdFx0cmV3YXJkOiB7IHRlZXRoOiAyMCB9LFxyXG5cdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdF8oJ3RoZSBiZWdnYXIgZXhwcmVzc2VzIGhpcyB0aGFua3MuJyksXHJcblx0XHRcdFx0XHRfKCdsZWF2ZXMgYSBwaWxlIG9mIHNtYWxsIHRlZXRoIGJlaGluZC4nKVxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdzYXkgZ29vZGJ5ZScpLFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRjbG90aDoge1xyXG5cdFx0XHRcdHJld2FyZDogeyBjbG90aDogMjAgfSxcclxuXHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRfKCd0aGUgYmVnZ2FyIGV4cHJlc3NlcyBoaXMgdGhhbmtzLicpLFxyXG5cdFx0XHRcdFx0XygnbGVhdmVzIHNvbWUgc2NyYXBzIG9mIGNsb3RoIGJlaGluZC4nKVxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdzYXkgZ29vZGJ5ZScpLFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHR7IC8qIFRoZSBTY291dCAgLS0gIE1hcCBNZXJjaGFudCAqL1xyXG5cdFx0dGl0bGU6IF8oJ1RoZSBTY291dCcpLFxyXG5cdFx0aXNBdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSBSb29tICYmICRTTS5nZXQoJ2ZlYXR1cmVzLmxvY2F0aW9uLndvcmxkJyk7XHJcblx0XHR9LFxyXG5cdFx0c2NlbmVzOiB7XHJcblx0XHRcdCdzdGFydCc6IHtcclxuXHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRfKFwidGhlIHNjb3V0IHNheXMgc2hlJ3MgYmVlbiBhbGwgb3Zlci5cIiksXHJcblx0XHRcdFx0XHRfKFwid2lsbGluZyB0byB0YWxrIGFib3V0IGl0LCBmb3IgYSBwcmljZS5cIilcclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdG5vdGlmaWNhdGlvbjogXygnYSBzY291dCBzdG9wcyBmb3IgdGhlIG5pZ2h0JyksXHJcblx0XHRcdFx0Ymxpbms6IHRydWUsXHJcblx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0J2J1eU1hcCc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnYnV5IG1hcCcpLFxyXG5cdFx0XHRcdFx0XHRjb3N0OiB7ICdmdXInOiAyMDAsICdzY2FsZXMnOiAxMCB9LFxyXG5cdFx0XHRcdFx0XHRub3RpZmljYXRpb246IF8oJ3RoZSBtYXAgdW5jb3ZlcnMgYSBiaXQgb2YgdGhlIHdvcmxkJyksXHJcblx0XHRcdFx0XHRcdC8vIG9uQ2hvb3NlOiBXb3JsZC5hcHBseU1hcFxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCdsZWFybic6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnbGVhcm4gc2NvdXRpbmcnKSxcclxuXHRcdFx0XHRcdFx0Y29zdDogeyAnZnVyJzogMTAwMCwgJ3NjYWxlcyc6IDUwLCAndGVldGgnOiAyMCB9LFxyXG5cdFx0XHRcdFx0XHRhdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiAhJFNNLmhhc1BlcmsoJ3Njb3V0Jyk7XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHQkU00uYWRkUGVyaygnc2NvdXQnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCdsZWF2ZSc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnc2F5IGdvb2RieWUnKSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0eyAvKiBUaGUgV2FuZGVyaW5nIE1hc3RlciAqL1xyXG5cdFx0dGl0bGU6IF8oJ1RoZSBNYXN0ZXInKSxcclxuXHRcdGlzQXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gUm9vbSAmJiAkU00uZ2V0KCdmZWF0dXJlcy5sb2NhdGlvbi53b3JsZCcpO1xyXG5cdFx0fSxcclxuXHRcdHNjZW5lczoge1xyXG5cdFx0XHQnc3RhcnQnOiB7XHJcblx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XygnYW4gb2xkIHdhbmRlcmVyIGFycml2ZXMuJyksXHJcblx0XHRcdFx0XHRfKCdoZSBzbWlsZXMgd2FybWx5IGFuZCBhc2tzIGZvciBsb2RnaW5ncyBmb3IgdGhlIG5pZ2h0LicpXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRub3RpZmljYXRpb246IF8oJ2FuIG9sZCB3YW5kZXJlciBhcnJpdmVzJyksXHJcblx0XHRcdFx0Ymxpbms6IHRydWUsXHJcblx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0J2FncmVlJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdhZ3JlZScpLFxyXG5cdFx0XHRcdFx0XHRjb3N0OiB7XHJcblx0XHRcdFx0XHRcdFx0J2N1cmVkIG1lYXQnOiAxMDAsXHJcblx0XHRcdFx0XHRcdFx0J2Z1cic6IDEwMCxcclxuXHRcdFx0XHRcdFx0XHQndG9yY2gnOiAxXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdhZ3JlZSd9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J2RlbnknOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ3R1cm4gaGltIGF3YXknKSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0J2FncmVlJzoge1xyXG5cdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdF8oJ2luIGV4Y2hhbmdlLCB0aGUgd2FuZGVyZXIgb2ZmZXJzIGhpcyB3aXNkb20uJylcclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdCdldmFzaW9uJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdldmFzaW9uJyksXHJcblx0XHRcdFx0XHRcdGF2YWlsYWJsZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuICEkU00uaGFzUGVyaygnZXZhc2l2ZScpO1xyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0JFNNLmFkZFBlcmsoJ2V2YXNpdmUnKTtcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCdwcmVjaXNpb24nOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ3ByZWNpc2lvbicpLFxyXG5cdFx0XHRcdFx0XHRhdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiAhJFNNLmhhc1BlcmsoJ3ByZWNpc2UnKTtcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0b25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdCRTTS5hZGRQZXJrKCdwcmVjaXNlJyk7XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnZm9yY2UnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ2ZvcmNlJyksXHJcblx0XHRcdFx0XHRcdGF2YWlsYWJsZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuICEkU00uaGFzUGVyaygnYmFyYmFyaWFuJyk7XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHQkU00uYWRkUGVyaygnYmFyYmFyaWFuJyk7XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnbm90aGluZyc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnbm90aGluZycpLFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5dO1xyXG4iLCIvKipcclxuICogTW9kdWxlIHRoYXQgdGFrZXMgY2FyZSBvZiBoZWFkZXIgYnV0dG9uc1xyXG4gKi9cclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4vZW5naW5lXCI7XHJcblxyXG5leHBvcnQgY29uc3QgSGVhZGVyID0ge1xyXG5cdFxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblx0fSxcclxuXHRcclxuXHRvcHRpb25zOiB7fSwgLy8gTm90aGluZyBmb3Igbm93XHJcblx0XHJcblx0Y2FuVHJhdmVsOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAkKCdkaXYjaGVhZGVyIGRpdi5oZWFkZXJCdXR0b24nKS5sZW5ndGggPiAxO1xyXG5cdH0sXHJcblx0XHJcblx0YWRkTG9jYXRpb246IGZ1bmN0aW9uKHRleHQsIGlkLCBtb2R1bGUpIHtcclxuXHRcdHJldHVybiAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgXCJsb2NhdGlvbl9cIiArIGlkKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2hlYWRlckJ1dHRvbicpXHJcblx0XHRcdC50ZXh0KHRleHQpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGlmKEhlYWRlci5jYW5UcmF2ZWwoKSkge1xyXG5cdFx0XHRcdFx0RW5naW5lLnRyYXZlbFRvKG1vZHVsZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KS5hcHBlbmRUbygkKCdkaXYjaGVhZGVyJykpO1xyXG5cdH1cclxufTsiLCIvKipcclxuICogTW9kdWxlIHRoYXQgcmVnaXN0ZXJzIHRoZSBub3RpZmljYXRpb24gYm94IGFuZCBoYW5kbGVzIG1lc3NhZ2VzXHJcbiAqL1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi9lbmdpbmVcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBOb3RpZmljYXRpb25zID0ge1xyXG5cdFx0XHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblx0XHRcclxuXHRcdC8vIENyZWF0ZSB0aGUgbm90aWZpY2F0aW9ucyBib3hcclxuXHRcdGNvbnN0IGVsZW0gPSAkKCc8ZGl2PicpLmF0dHIoe1xyXG5cdFx0XHRpZDogJ25vdGlmaWNhdGlvbnMnLFxyXG5cdFx0XHRjbGFzc05hbWU6ICdub3RpZmljYXRpb25zJ1xyXG5cdFx0fSk7XHJcblx0XHQvLyBDcmVhdGUgdGhlIHRyYW5zcGFyZW5jeSBncmFkaWVudFxyXG5cdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdub3RpZnlHcmFkaWVudCcpLmFwcGVuZFRvKGVsZW0pO1xyXG5cdFx0XHJcblx0XHRlbGVtLmFwcGVuZFRvKCdkaXYjd3JhcHBlcicpO1xyXG5cdH0sXHJcblx0XHJcblx0b3B0aW9uczoge30sIC8vIE5vdGhpbmcgZm9yIG5vd1xyXG5cdFxyXG5cdGVsZW06IG51bGwsXHJcblx0XHJcblx0bm90aWZ5UXVldWU6IHt9LFxyXG5cdFxyXG5cdC8vIEFsbG93IG5vdGlmaWNhdGlvbiB0byB0aGUgcGxheWVyXHJcblx0bm90aWZ5OiBmdW5jdGlvbihtb2R1bGUsIHRleHQsIG5vUXVldWU/KSB7XHJcblx0XHRpZih0eXBlb2YgdGV4dCA9PSAndW5kZWZpbmVkJykgcmV0dXJuO1xyXG5cdFx0Ly8gSSBkb24ndCBuZWVkIHlvdSBwdW5jdHVhdGluZyBmb3IgbWUsIGZ1bmN0aW9uLlxyXG5cdFx0Ly8gaWYodGV4dC5zbGljZSgtMSkgIT0gXCIuXCIpIHRleHQgKz0gXCIuXCI7XHJcblx0XHRpZihtb2R1bGUgIT0gbnVsbCAmJiBFbmdpbmUuYWN0aXZlTW9kdWxlICE9IG1vZHVsZSkge1xyXG5cdFx0XHRpZighbm9RdWV1ZSkge1xyXG5cdFx0XHRcdGlmKHR5cGVvZiB0aGlzLm5vdGlmeVF1ZXVlW21vZHVsZV0gPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0XHRcdHRoaXMubm90aWZ5UXVldWVbbW9kdWxlXSA9IFtdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLm5vdGlmeVF1ZXVlW21vZHVsZV0ucHVzaCh0ZXh0KTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Tm90aWZpY2F0aW9ucy5wcmludE1lc3NhZ2UodGV4dCk7XHJcblx0XHR9XHJcblx0XHRFbmdpbmUuc2F2ZUdhbWUoKTtcclxuXHR9LFxyXG5cdFxyXG5cdGNsZWFySGlkZGVuOiBmdW5jdGlvbigpIHtcclxuXHRcclxuXHRcdC8vIFRvIGZpeCBzb21lIG1lbW9yeSB1c2FnZSBpc3N1ZXMsIHdlIGNsZWFyIG5vdGlmaWNhdGlvbnMgdGhhdCBoYXZlIGJlZW4gaGlkZGVuLlxyXG5cdFx0XHJcblx0XHQvLyBXZSB1c2UgcG9zaXRpb24oKS50b3AgaGVyZSwgYmVjYXVzZSB3ZSBrbm93IHRoYXQgdGhlIHBhcmVudCB3aWxsIGJlIHRoZSBzYW1lLCBzbyB0aGUgcG9zaXRpb24gd2lsbCBiZSB0aGUgc2FtZS5cclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdHZhciBib3R0b20gPSAkKCcjbm90aWZ5R3JhZGllbnQnKS5wb3NpdGlvbigpLnRvcCArICQoJyNub3RpZnlHcmFkaWVudCcpLm91dGVySGVpZ2h0KHRydWUpO1xyXG5cdFx0XHJcblx0XHQkKCcubm90aWZpY2F0aW9uJykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFxyXG5cdFx0XHRpZigkKHRoaXMpLnBvc2l0aW9uKCkudG9wID4gYm90dG9tKXtcclxuXHRcdFx0XHQkKHRoaXMpLnJlbW92ZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0fSxcclxuXHRcclxuXHRwcmludE1lc3NhZ2U6IGZ1bmN0aW9uKHQpIHtcclxuXHRcdHZhciB0ZXh0ID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnbm90aWZpY2F0aW9uJykuY3NzKCdvcGFjaXR5JywgJzAnKS50ZXh0KHQpLnByZXBlbmRUbygnZGl2I25vdGlmaWNhdGlvbnMnKTtcclxuXHRcdHRleHQuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIDUwMCwgJ2xpbmVhcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQvLyBEbyB0aGlzIGV2ZXJ5IHRpbWUgd2UgYWRkIGEgbmV3IG1lc3NhZ2UsIHRoaXMgd2F5IHdlIG5ldmVyIGhhdmUgYSBsYXJnZSBiYWNrbG9nIHRvIGl0ZXJhdGUgdGhyb3VnaC4gS2VlcHMgdGhpbmdzIGZhc3Rlci5cclxuXHRcdFx0Tm90aWZpY2F0aW9ucy5jbGVhckhpZGRlbigpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRcclxuXHRwcmludFF1ZXVlOiBmdW5jdGlvbihtb2R1bGUpIHtcclxuXHRcdGlmKHR5cGVvZiB0aGlzLm5vdGlmeVF1ZXVlW21vZHVsZV0gIT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0d2hpbGUodGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHROb3RpZmljYXRpb25zLnByaW50TWVzc2FnZSh0aGlzLm5vdGlmeVF1ZXVlW21vZHVsZV0uc2hpZnQoKSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IHsgRW5naW5lIH0gZnJvbSAnLi4vZW5naW5lJztcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSAnLi4vc3RhdGVfbWFuYWdlcic7XHJcbmltcG9ydCB7IFdlYXRoZXIgfSBmcm9tICcuLi93ZWF0aGVyJztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vQnV0dG9uJztcclxuaW1wb3J0IHsgQ2FwdGFpbiB9IGZyb20gJy4uL2NoYXJhY3RlcnMvY2FwdGFpbic7XHJcbmltcG9ydCB7IEhlYWRlciB9IGZyb20gJy4uL2hlYWRlcic7XHJcbmltcG9ydCB7IF8gfSBmcm9tICcuLi8uLi9saWIvdHJhbnNsYXRlJztcclxuXHJcbmV4cG9ydCBjb25zdCBPdXRwb3N0ID0ge1xyXG4gICAgaW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgdGhlIE91dHBvc3QgdGFiXHJcbiAgICAgICAgdGhpcy50YWIgPSBIZWFkZXIuYWRkTG9jYXRpb24oXyhcIlRoZSBPdXRwb3N0XCIpLCBcIm91dHBvc3RcIiwgT3V0cG9zdCk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgT3V0cG9zdCBwYW5lbFxyXG5cdFx0dGhpcy5wYW5lbCA9ICQoJzxkaXY+JylcclxuICAgICAgICAuYXR0cignaWQnLCBcIm91dHBvc3RQYW5lbFwiKVxyXG4gICAgICAgIC5hZGRDbGFzcygnbG9jYXRpb24nKVxyXG4gICAgICAgIC5hcHBlbmRUbygnZGl2I2xvY2F0aW9uU2xpZGVyJyk7XHJcblxyXG4gICAgICAgIEVuZ2luZS51cGRhdGVTbGlkZXIoKTtcclxuXHJcbiAgICAgICAgLy8gbmV3IFxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAnY2FwdGFpbkJ1dHRvbicsXHJcblx0XHRcdHRleHQ6IF8oJ1NwZWFrIHdpdGggVGhlIENhcHRhaW4nKSxcclxuXHRcdFx0Y2xpY2s6IENhcHRhaW4udGFsa1RvQ2FwdGFpbixcclxuXHRcdFx0d2lkdGg6ICc4MHB4J1xyXG5cdFx0fSkuYXBwZW5kVG8oJ2RpdiNvdXRwb3N0UGFuZWwnKTtcclxuXHJcbiAgICAgICAgT3V0cG9zdC51cGRhdGVCdXR0b24oKTtcclxuXHJcbiAgICAgICAgLy8gc2V0dGluZyB0aGlzIHNlcGFyYXRlbHkgc28gdGhhdCBxdWVzdCBzdGF0dXMgY2FuJ3QgYWNjaWRlbnRhbGx5IGJyZWFrIGl0IGxhdGVyXHJcbiAgICAgICAgJFNNLnNldCgnb3V0cG9zdC5vcGVuJywgMSk7IFxyXG4gICAgfSxcclxuXHJcbiAgICBhdmFpbGFibGVXZWF0aGVyOiB7XHJcblx0XHQnc3VubnknOiAwLjQsXHJcblx0XHQnY2xvdWR5JzogMC4zLFxyXG5cdFx0J3JhaW55JzogMC4zXHJcblx0fSxcclxuXHJcbiAgICBvbkFycml2YWw6IGZ1bmN0aW9uKHRyYW5zaXRpb25fZGlmZikge1xyXG4gICAgICAgIE91dHBvc3Quc2V0VGl0bGUoKTtcclxuXHJcblx0XHRFbmdpbmUubW92ZVN0b3Jlc1ZpZXcobnVsbCwgdHJhbnNpdGlvbl9kaWZmKTtcclxuXHJcbiAgICAgICAgV2VhdGhlci5pbml0aWF0ZVdlYXRoZXIoT3V0cG9zdC5hdmFpbGFibGVXZWF0aGVyLCAnb3V0cG9zdCcpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRUaXRsZTogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdGl0bGUgPSBfKFwiVGhlIE91dHBvc3RcIik7XHJcblx0XHRpZihFbmdpbmUuYWN0aXZlTW9kdWxlID09IHRoaXMpIHtcclxuXHRcdFx0ZG9jdW1lbnQudGl0bGUgPSB0aXRsZTtcclxuXHRcdH1cclxuXHRcdCQoJ2RpdiNsb2NhdGlvbl9vdXRwb3N0JykudGV4dCh0aXRsZSk7XHJcblx0fSxcclxuXHJcbiAgICB1cGRhdGVCdXR0b246IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gY29uZGl0aW9uYWxzIGZvciB1cGRhdGluZyBidXR0b25zXHJcblx0fSxcclxuXHJcbiAgICAvLyBkb24ndCBuZWVkIHRoaXMgeWV0IChvciBtYXliZSBldmVyKVxyXG5cdC8vIHdhbmRlckV2ZW50OiBmdW5jdGlvbigpIHtcclxuXHQvLyBcdEV2ZW50cy50cmlnZ2VyTG9jYXRpb25FdmVudCgnT3V0cG9zdFdhbmRlcicpO1xyXG5cdC8vIFx0JFNNLmFkZCgnT3V0cG9zdC5jb3VudGVyJywgMSk7XHJcblx0Ly8gfVxyXG59IiwiaW1wb3J0IHsgSGVhZGVyIH0gZnJvbSBcIi4uL2hlYWRlclwiO1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi4vZW5naW5lXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi9CdXR0b25cIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IFdlYXRoZXIgfSBmcm9tIFwiLi4vd2VhdGhlclwiO1xyXG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgUm9hZCA9IHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBSb2FkIHRhYlxyXG4gICAgICAgIHRoaXMudGFiID0gSGVhZGVyLmFkZExvY2F0aW9uKF8oXCJSb2FkIHRvIHRoZSBPdXRwb3N0XCIpLCBcInJvYWRcIiwgUm9hZCk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgUm9hZCBwYW5lbFxyXG5cdFx0dGhpcy5wYW5lbCA9ICQoJzxkaXY+JylcclxuICAgICAgICAuYXR0cignaWQnLCBcInJvYWRQYW5lbFwiKVxyXG4gICAgICAgIC5hZGRDbGFzcygnbG9jYXRpb24nKVxyXG4gICAgICAgIC5hcHBlbmRUbygnZGl2I2xvY2F0aW9uU2xpZGVyJyk7XHJcblxyXG4gICAgICAgIEVuZ2luZS51cGRhdGVTbGlkZXIoKTtcclxuXHJcbiAgICAgICAgLy9uZXcgXHJcblx0XHRCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6ICd3YW5kZXJCdXR0b24nLFxyXG5cdFx0XHR0ZXh0OiBfKCdXYW5kZXIgQXJvdW5kJyksXHJcblx0XHRcdGNsaWNrOiBSb2FkLndhbmRlckV2ZW50LFxyXG5cdFx0XHR3aWR0aDogJzgwcHgnLFxyXG5cdFx0XHRjb3N0OiB7fSAvLyBUT0RPOiBtYWtlIHRoZXJlIGJlIGEgY29zdCB0byBkb2luZyBzdHVmZj9cclxuXHRcdH0pLmFwcGVuZFRvKCdkaXYjcm9hZFBhbmVsJyk7XHJcblxyXG4gICAgICAgIFJvYWQudXBkYXRlQnV0dG9uKCk7XHJcblxyXG4gICAgICAgIC8vIHNldHRpbmcgdGhpcyBzZXBhcmF0ZWx5IHNvIHRoYXQgcXVlc3Qgc3RhdHVzIGNhbid0IGFjY2lkZW50YWxseSBicmVhayBpdCBsYXRlclxyXG4gICAgICAgICRTTS5zZXQoJ3JvYWQub3BlbicsIDEpOyBcclxuICAgIH0sXHJcblxyXG4gICAgYXZhaWxhYmxlV2VhdGhlcjoge1xyXG5cdFx0J3N1bm55JzogMC40LFxyXG5cdFx0J2Nsb3VkeSc6IDAuMyxcclxuXHRcdCdyYWlueSc6IDAuM1xyXG5cdH0sXHJcblxyXG4gICAgb25BcnJpdmFsOiBmdW5jdGlvbih0cmFuc2l0aW9uX2RpZmYpIHtcclxuICAgICAgICBSb2FkLnNldFRpdGxlKCk7XHJcblxyXG5cdFx0RW5naW5lLm1vdmVTdG9yZXNWaWV3KG51bGwsIHRyYW5zaXRpb25fZGlmZik7XHJcblxyXG4gICAgICAgIFdlYXRoZXIuaW5pdGlhdGVXZWF0aGVyKFJvYWQuYXZhaWxhYmxlV2VhdGhlciwgJ3JvYWQnKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0VGl0bGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRpdGxlID0gXyhcIlJvYWQgdG8gdGhlIE91dHBvc3RcIik7XHJcblx0XHRpZihFbmdpbmUuYWN0aXZlTW9kdWxlID09IHRoaXMpIHtcclxuXHRcdFx0ZG9jdW1lbnQudGl0bGUgPSB0aXRsZTtcclxuXHRcdH1cclxuXHRcdCQoJ2RpdiNsb2NhdGlvbl9yb2FkJykudGV4dCh0aXRsZSk7XHJcblx0fSxcclxuXHJcbiAgICB1cGRhdGVCdXR0b246IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gY29uZGl0aW9uYWxzIGZvciB1cGRhdGluZyBidXR0b25zXHJcblx0fSxcclxuXHJcblx0d2FuZGVyRXZlbnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnRyaWdnZXJMb2NhdGlvbkV2ZW50KCdSb2FkV2FuZGVyJyk7XHJcblx0XHQkU00uYWRkKCdSb2FkLmNvdW50ZXInLCAxKTtcclxuXHR9XHJcbn0iLCIvKipcclxuICogTW9kdWxlIHRoYXQgcmVnaXN0ZXJzIHRoZSBzaW1wbGUgcm9vbSBmdW5jdGlvbmFsaXR5XHJcbiAqL1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi4vZW5naW5lXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi9CdXR0b25cIjtcclxuaW1wb3J0IHsgTm90aWZpY2F0aW9ucyB9IGZyb20gXCIuLi9ub3RpZmljYXRpb25zXCI7XHJcbmltcG9ydCB7IFdlYXRoZXIgfSBmcm9tIFwiLi4vd2VhdGhlclwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgSGVhZGVyIH0gZnJvbSBcIi4uL2hlYWRlclwiO1xyXG5pbXBvcnQgeyBMaXogfSBmcm9tIFwiLi4vY2hhcmFjdGVycy9saXpcIjtcclxuaW1wb3J0IHsgTWF5b3IgfSBmcm9tIFwiLi4vY2hhcmFjdGVycy9tYXlvclwiO1xyXG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgUm9vbSA9IHtcclxuXHQvLyB0aW1lcyBpbiAobWludXRlcyAqIHNlY29uZHMgKiBtaWxsaXNlY29uZHMpXHJcblx0X0ZJUkVfQ09PTF9ERUxBWTogNSAqIDYwICogMTAwMCwgLy8gdGltZSBhZnRlciBhIHN0b2tlIGJlZm9yZSB0aGUgZmlyZSBjb29sc1xyXG5cdF9ST09NX1dBUk1fREVMQVk6IDMwICogMTAwMCwgLy8gdGltZSBiZXR3ZWVuIHJvb20gdGVtcGVyYXR1cmUgdXBkYXRlc1xyXG5cdF9CVUlMREVSX1NUQVRFX0RFTEFZOiAwLjUgKiA2MCAqIDEwMDAsIC8vIHRpbWUgYmV0d2VlbiBidWlsZGVyIHN0YXRlIHVwZGF0ZXNcclxuXHRfU1RPS0VfQ09PTERPV046IDEwLCAvLyBjb29sZG93biB0byBzdG9rZSB0aGUgZmlyZVxyXG5cdF9ORUVEX1dPT0RfREVMQVk6IDE1ICogMTAwMCwgLy8gZnJvbSB3aGVuIHRoZSBzdHJhbmdlciBzaG93cyB1cCwgdG8gd2hlbiB5b3UgbmVlZCB3b29kXHJcblx0XHJcblx0YnV0dG9uczp7fSxcclxuXHRcclxuXHRjaGFuZ2VkOiBmYWxzZSxcclxuXHRcclxuXHRuYW1lOiBfKFwiUm9vbVwiKSxcclxuXHRpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHRcdFxyXG5cdFx0aWYoRW5naW5lLl9kZWJ1Zykge1xyXG5cdFx0XHR0aGlzLl9ST09NX1dBUk1fREVMQVkgPSA1MDAwO1xyXG5cdFx0XHR0aGlzLl9CVUlMREVSX1NUQVRFX0RFTEFZID0gNTAwMDtcclxuXHRcdFx0dGhpcy5fU1RPS0VfQ09PTERPV04gPSAwO1xyXG5cdFx0XHR0aGlzLl9ORUVEX1dPT0RfREVMQVkgPSA1MDAwO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBDcmVhdGUgdGhlIHJvb20gdGFiXHJcblx0XHR0aGlzLnRhYiA9IEhlYWRlci5hZGRMb2NhdGlvbihfKFwiQSBDaGlsbCBWaWxsYWdlXCIpLCBcInJvb21cIiwgUm9vbSk7XHJcblx0XHRcclxuXHRcdC8vIENyZWF0ZSB0aGUgUm9vbSBwYW5lbFxyXG5cdFx0dGhpcy5wYW5lbCA9ICQoJzxkaXY+JylcclxuXHRcdFx0LmF0dHIoJ2lkJywgXCJyb29tUGFuZWxcIilcclxuXHRcdFx0LmFkZENsYXNzKCdsb2NhdGlvbicpXHJcblx0XHRcdC5hcHBlbmRUbygnZGl2I2xvY2F0aW9uU2xpZGVyJyk7XHJcblx0XHRcclxuXHRcdEVuZ2luZS51cGRhdGVTbGlkZXIoKTtcclxuXHJcblx0XHRCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6ICd0YWxrQnV0dG9uJyxcclxuXHRcdFx0dGV4dDogXygnVGFsayB0byB0aGUgTWF5b3InKSxcclxuXHRcdFx0Y2xpY2s6IE1heW9yLnRhbGtUb01heW9yLFxyXG5cdFx0XHR3aWR0aDogJzgwcHgnLFxyXG5cdFx0XHRjb3N0OiB7fVxyXG5cdFx0fSkuYXBwZW5kVG8oJ2RpdiNyb29tUGFuZWwnKTtcclxuXHJcblx0XHRCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6ICdsaXpCdXR0b24nLFxyXG5cdFx0XHR0ZXh0OiBfKCdUYWxrIHRvIExpeicpLFxyXG5cdFx0XHRjbGljazogTGl6LnRhbGtUb0xpeixcclxuXHRcdFx0d2lkdGg6ICc4MHB4JyxcclxuXHRcdFx0Y29zdDoge31cclxuXHRcdH0pLmFwcGVuZFRvKCdkaXYjcm9vbVBhbmVsJyk7XHJcblxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAnbmV3QnVpbGRpbmdCdXR0b24nLFxyXG5cdFx0XHR0ZXh0OiBfKCdDaGVjayBvdXQgdGhlIG5ldyBidWlsZGluZycpLFxyXG5cdFx0XHRjbGljazogUm9vbS50ZW1wQnVpbGRpbmdNZXNzYWdlLFxyXG5cdFx0XHR3aWR0aDogJzgwcHgnLFxyXG5cdFx0XHRjb3N0OiB7fVxyXG5cdFx0fSkuYXBwZW5kVG8oJ2RpdiNyb29tUGFuZWwnKTtcclxuXHJcblx0XHR2YXIgYnVpbGRpbmdCdXR0b24gPSAkKCcjbmV3QnVpbGRpbmdCdXR0b24uYnV0dG9uJyk7XHJcblx0XHRidWlsZGluZ0J1dHRvbi5oaWRlKCk7XHJcblxyXG5cdFx0dmFyIGxpekJ1dHRvbiA9ICQoJyNsaXpCdXR0b24uYnV0dG9uJyk7XHJcblx0XHRsaXpCdXR0b24uaGlkZSgpO1xyXG5cdFx0XHJcblx0XHQvLyBDcmVhdGUgdGhlIHN0b3JlcyBjb250YWluZXJcclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnc3RvcmVzQ29udGFpbmVyJykuYXBwZW5kVG8oJ2RpdiNyb29tUGFuZWwnKTtcclxuXHRcdFxyXG5cdFx0Ly9zdWJzY3JpYmUgdG8gc3RhdGVVcGRhdGVzXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHQkLkRpc3BhdGNoKCdzdGF0ZVVwZGF0ZScpLnN1YnNjcmliZShSb29tLmhhbmRsZVN0YXRlVXBkYXRlcyk7XHJcblx0XHRcclxuXHRcdFJvb20udXBkYXRlQnV0dG9uKCk7XHJcblx0fSxcclxuXHRcclxuXHRvcHRpb25zOiB7fSwgLy8gTm90aGluZyBmb3Igbm93XHJcblxyXG5cdGF2YWlsYWJsZVdlYXRoZXI6IHtcclxuXHRcdCdzdW5ueSc6IDAuNCxcclxuXHRcdCdjbG91ZHknOiAwLjMsXHJcblx0XHQncmFpbnknOiAwLjNcclxuXHR9LFxyXG5cdFxyXG5cdG9uQXJyaXZhbDogZnVuY3Rpb24odHJhbnNpdGlvbl9kaWZmKSB7XHJcblx0XHRSb29tLnNldFRpdGxlKCk7XHJcblx0XHRpZigkU00uZ2V0KCdnYW1lLmJ1aWxkZXIubGV2ZWwnKSA9PSAzKSB7XHJcblx0XHRcdCRTTS5hZGQoJ2dhbWUuYnVpbGRlci5sZXZlbCcsIDEpO1xyXG5cdFx0XHQkU00uc2V0SW5jb21lKCdidWlsZGVyJywge1xyXG5cdFx0XHRcdGRlbGF5OiAxMCxcclxuXHRcdFx0XHRzdG9yZXM6IHsnd29vZCcgOiAyIH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KFJvb20sIF8oXCJ0aGUgc3RyYW5nZXIgaXMgc3RhbmRpbmcgYnkgdGhlIGZpcmUuIHNoZSBzYXlzIHNoZSBjYW4gaGVscC4gc2F5cyBzaGUgYnVpbGRzIHRoaW5ncy5cIikpO1xyXG5cdFx0fVxyXG5cclxuXHRcdEVuZ2luZS5tb3ZlU3RvcmVzVmlldyhudWxsLCB0cmFuc2l0aW9uX2RpZmYpO1xyXG5cclxuXHRcdFdlYXRoZXIuaW5pdGlhdGVXZWF0aGVyKFJvb20uYXZhaWxhYmxlV2VhdGhlciwgJ3Jvb20nKTtcclxuXHR9LFxyXG5cdFxyXG5cdFRlbXBFbnVtOiB7XHJcblx0XHRmcm9tSW50OiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRmb3IodmFyIGsgaW4gdGhpcykge1xyXG5cdFx0XHRcdGlmKHR5cGVvZiB0aGlzW2tdLnZhbHVlICE9ICd1bmRlZmluZWQnICYmIHRoaXNba10udmFsdWUgPT0gdmFsdWUpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0aGlzW2tdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH0sXHJcblx0XHRGcmVlemluZzogeyB2YWx1ZTogMCwgdGV4dDogXygnZnJlZXppbmcnKSB9LFxyXG5cdFx0Q29sZDogeyB2YWx1ZTogMSwgdGV4dDogXygnY29sZCcpIH0sXHJcblx0XHRNaWxkOiB7IHZhbHVlOiAyLCB0ZXh0OiBfKCdtaWxkJykgfSxcclxuXHRcdFdhcm06IHsgdmFsdWU6IDMsIHRleHQ6IF8oJ3dhcm0nKSB9LFxyXG5cdFx0SG90OiB7IHZhbHVlOiA0LCB0ZXh0OiBfKCdob3QnKSB9XHJcblx0fSxcclxuXHRcclxuXHRGaXJlRW51bToge1xyXG5cdFx0ZnJvbUludDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdFx0Zm9yKHZhciBrIGluIHRoaXMpIHtcclxuXHRcdFx0XHRpZih0eXBlb2YgdGhpc1trXS52YWx1ZSAhPSAndW5kZWZpbmVkJyAmJiB0aGlzW2tdLnZhbHVlID09IHZhbHVlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpc1trXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9LFxyXG5cdFx0RGVhZDogeyB2YWx1ZTogMCwgdGV4dDogXygnZGVhZCcpIH0sXHJcblx0XHRTbW9sZGVyaW5nOiB7IHZhbHVlOiAxLCB0ZXh0OiBfKCdzbW9sZGVyaW5nJykgfSxcclxuXHRcdEZsaWNrZXJpbmc6IHsgdmFsdWU6IDIsIHRleHQ6IF8oJ2ZsaWNrZXJpbmcnKSB9LFxyXG5cdFx0QnVybmluZzogeyB2YWx1ZTogMywgdGV4dDogXygnYnVybmluZycpIH0sXHJcblx0XHRSb2FyaW5nOiB7IHZhbHVlOiA0LCB0ZXh0OiBfKCdyb2FyaW5nJykgfVxyXG5cdH0sXHJcblx0XHJcblx0c2V0VGl0bGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRpdGxlID0gXyhcIlRoZSBWaWxsYWdlXCIpO1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSB0aGlzKSB7XHJcblx0XHRcdGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XHJcblx0XHR9XHJcblx0XHQkKCdkaXYjbG9jYXRpb25fcm9vbScpLnRleHQodGl0bGUpO1xyXG5cdH0sXHJcblx0XHJcblx0dXBkYXRlQnV0dG9uOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBsaWdodCA9ICQoJyNsaWdodEJ1dHRvbi5idXR0b24nKTtcclxuXHRcdHZhciBzdG9rZSA9ICQoJyNzdG9rZUJ1dHRvbi5idXR0b24nKTtcclxuXHRcdGlmKCRTTS5nZXQoJ2dhbWUuZmlyZS52YWx1ZScpID09IFJvb20uRmlyZUVudW0uRGVhZC52YWx1ZSAmJiBzdG9rZS5jc3MoJ2Rpc3BsYXknKSAhPSAnbm9uZScpIHtcclxuXHRcdFx0c3Rva2UuaGlkZSgpO1xyXG5cdFx0XHRsaWdodC5zaG93KCk7XHJcblx0XHRcdGlmKHN0b2tlLmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XHJcblx0XHRcdFx0QnV0dG9uLmNvb2xkb3duKGxpZ2h0KTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmKGxpZ2h0LmNzcygnZGlzcGxheScpICE9ICdub25lJykge1xyXG5cdFx0XHRzdG9rZS5zaG93KCk7XHJcblx0XHRcdGxpZ2h0LmhpZGUoKTtcclxuXHRcdFx0aWYobGlnaHQuaGFzQ2xhc3MoJ2Rpc2FibGVkJykpIHtcclxuXHRcdFx0XHRCdXR0b24uY29vbGRvd24oc3Rva2UpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmKCEkU00uZ2V0KCdzdG9yZXMud29vZCcpKSB7XHJcblx0XHRcdGxpZ2h0LmFkZENsYXNzKCdmcmVlJyk7XHJcblx0XHRcdHN0b2tlLmFkZENsYXNzKCdmcmVlJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsaWdodC5yZW1vdmVDbGFzcygnZnJlZScpO1xyXG5cdFx0XHRzdG9rZS5yZW1vdmVDbGFzcygnZnJlZScpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBsaXpCdXR0b24gPSAkKCcjbGl6QnV0dG9uLmJ1dHRvbicpO1xyXG5cdFx0aWYoJFNNLmdldCgndmlsbGFnZS5saXpBY3RpdmUnKSkgbGl6QnV0dG9uLnNob3coKTtcclxuXHRcdHZhciBidWlsZGluZ0J1dHRvbiA9ICQoJyNuZXdCdWlsZGluZ0J1dHRvbi5idXR0b24nKTtcclxuXHRcdGlmKCRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnKSkgYnVpbGRpbmdCdXR0b24uc2hvdygpO1xyXG5cdH0sXHJcblx0XHJcblx0XHJcblx0aGFuZGxlU3RhdGVVcGRhdGVzOiBmdW5jdGlvbihlKXtcclxuXHRcdGlmKGUuY2F0ZWdvcnkgPT0gJ3N0b3Jlcycpe1xyXG5cdFx0XHQvLyBSb29tLnVwZGF0ZUJ1aWxkQnV0dG9ucygpO1xyXG5cdFx0fSBlbHNlIGlmKGUuY2F0ZWdvcnkgPT0gJ2luY29tZScpe1xyXG5cdFx0fSBlbHNlIGlmKGUuc3RhdGVOYW1lLmluZGV4T2YoJ2dhbWUuYnVpbGRpbmdzJykgPT09IDApe1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHRlbXBCdWlsZGluZ01lc3NhZ2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHRcdFx0dGl0bGU6IF8oJ0EgTmV3IEJ1aWxkaW5nJyksXHJcblx0XHRcdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRcdFx0c3RhcnQ6IHtcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdtYWluJyxcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdFx0XHRfKCdUaGlzIGlzIGEgbmV3IGJ1aWxkaW5nLiBUaGVyZSBzaG91bGQgYmUgc3R1ZmYgaW4gaXQsIGJ1dCB0aGlzIGlzIGEgcGxhY2Vob2xkZXIgZm9yIG5vdy4nKSxcclxuXHRcdFx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0XHRcdCdsZWF2ZSc6IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGV4dDogXygnTGFtZScpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxufTtcclxuIiwiaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uL0J1dHRvblwiO1xyXG5pbXBvcnQgeyBJdGVtTGlzdCB9IGZyb20gXCIuL2l0ZW1MaXN0XCI7XHJcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgTm90aWZpY2F0aW9ucyB9IGZyb20gXCIuLi9ub3RpZmljYXRpb25zXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyBRdWVzdExvZyB9IGZyb20gXCIuL3F1ZXN0TG9nXCI7XHJcblxyXG5leHBvcnQgY29uc3QgQ2hhcmFjdGVyID0ge1xyXG5cdGludmVudG9yeToge30sIC8vIGRpY3Rpb25hcnkgdXNpbmcgaXRlbSBuYW1lIGFzIGtleVxyXG5cdHF1ZXN0U3RhdHVzOiB7fSwgLy8gZGljdGlvbmFyeSB1c2luZyBxdWVzdCBuYW1lIGFzIGtleSwgYW5kIGludGVnZXIgcXVlc3QgcGhhc2UgYXMgdmFsdWVcclxuXHRlcXVpcHBlZEl0ZW1zOiB7XHJcblx0XHQvLyBzdGVhbGluZyB0aGUgS29MIHN0eWxlIGZvciBub3csIHdlJ2xsIHNlZSBpZiBJIG5lZWQgc29tZXRoaW5nXHJcblx0XHQvLyB0aGF0IGZpdHMgdGhlIGdhbWUgYmV0dGVyIGFzIHdlIGdvXHJcblx0XHRoZWFkOiBudWxsLFxyXG5cdFx0dG9yc286IG51bGwsXHJcblx0XHRwYW50czogbnVsbCxcclxuXHRcdC8vIG5vIHdlYXBvbiwgdHJ5IHRvIHNlZSBob3cgZmFyIHdlIGNhbiBnZXQgaW4gdGhpcyBnYW1lIHdpdGhvdXQgZm9jdXNpbmcgb24gY29tYmF0XHJcblx0XHRhY2Nlc3NvcnkxOiBudWxsLFxyXG5cdFx0YWNjZXNzb3J5MjogbnVsbCxcclxuXHRcdGFjY2Vzc29yeTM6IG51bGwsXHJcblx0fSxcclxuXHJcblx0Ly8gc3RhdHMgYmVmb3JlIGFueSBtb2RpZmllcnMgZnJvbSBnZWFyIG9yIHdoYXRldmVyIGVsc2UgYXJlIGFwcGxpZWRcclxuXHRyYXdTdGF0czoge1xyXG5cdFx0J1NwZWVkJzogNSxcclxuXHRcdCdQZXJjZXB0aW9uJzogNSxcclxuXHRcdCdSZXNpbGllbmNlJzogNSxcclxuXHRcdCdJbmdlbnVpdHknOiA1LFxyXG5cdFx0J1RvdWdobmVzcyc6IDVcclxuXHR9LFxyXG5cclxuXHQvLyBwZXJrcyBnaXZlbiBieSBpdGVtcywgY2hhcmFjdGVyIGNob2ljZXMsIGRpdmluZSBwcm92ZW5hbmNlLCBldGMuXHJcblx0cGVya3M6IHsgfSxcclxuXHRcclxuXHRpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHRcdFxyXG5cdFx0Ly8gY3JlYXRlIHRoZSBjaGFyYWN0ZXIgYm94XHJcblx0XHRjb25zdCBlbGVtID0gJCgnPGRpdj4nKS5hdHRyKHtcclxuXHRcdFx0aWQ6ICdjaGFyYWN0ZXInLFxyXG5cdFx0XHRjbGFzc05hbWU6ICdjaGFyYWN0ZXInXHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0ZWxlbS5hcHBlbmRUbygnZGl2I3dyYXBwZXInKTtcclxuXHJcblx0XHQvLyB3cml0ZSByYXdTdGF0cyB0byAkU01cclxuXHRcdC8vIE5PVEU6IG5ldmVyIHdyaXRlIGRlcml2ZWQgc3RhdHMgdG8gJFNNLCBhbmQgbmV2ZXIgYWNjZXNzIHJhdyBzdGF0cyBkaXJlY3RseSFcclxuXHRcdC8vIGRvaW5nIHNvIHdpbGwgaW50cm9kdWNlIG9wcG9ydHVuaXRpZXMgdG8gbWVzcyB1cCBzdGF0cyBQRVJNQU5FTlRMWVxyXG4gICAgICAgIGlmICghJFNNLmdldCgnY2hhcmFjdGVyLnJhd3N0YXRzJykpIHtcclxuICAgICAgICAgICAgJFNNLnNldCgnY2hhcmFjdGVyLnJhd3N0YXRzJywgQ2hhcmFjdGVyLnJhd1N0YXRzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cdFx0XHRDaGFyYWN0ZXIucmF3U3RhdHMgPSAkU00uZ2V0KCdjaGFyYWN0ZXIucmF3U3RhdHMnKSBhcyBhbnk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCEkU00uZ2V0KCdjaGFyYWN0ZXIucGVya3MnKSkge1xyXG4gICAgICAgICAgICAkU00uc2V0KCdjaGFyYWN0ZXIucGVya3MnLCBDaGFyYWN0ZXIucGVya3MpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5wZXJrcyA9ICRTTS5nZXQoJ2NoYXJhY3Rlci5wZXJrcycpIGFzIGFueTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoISRTTS5nZXQoJ2NoYXJhY3Rlci5pbnZlbnRvcnknKSkge1xyXG4gICAgICAgICAgICAkU00uc2V0KCdjaGFyYWN0ZXIuaW52ZW50b3J5JywgQ2hhcmFjdGVyLmludmVudG9yeSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHRcdFx0Q2hhcmFjdGVyLmludmVudG9yeSA9ICRTTS5nZXQoJ2NoYXJhY3Rlci5pbnZlbnRvcnknKSBhcyBhbnk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCEkU00uZ2V0KCdjaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcycpKSB7XHJcbiAgICAgICAgICAgICRTTS5zZXQoJ2NoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zJywgQ2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zID0gJFNNLmdldCgnY2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMnKSBhcyBhbnk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCEkU00uZ2V0KCdjaGFyYWN0ZXIucXVlc3RTdGF0dXMnKSkge1xyXG4gICAgICAgICAgICAkU00uc2V0KCdjaGFyYWN0ZXIucXVlc3RTdGF0dXMnLCBDaGFyYWN0ZXIucXVlc3RTdGF0dXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5xdWVzdFN0YXR1cyA9ICRTTS5nZXQoJ2NoYXJhY3Rlci5xdWVzdFN0YXR1cycpIGFzIGFueTtcclxuXHRcdH1cclxuXHJcbiAgICAgICAgJCgnPGRpdj4nKS50ZXh0KCdDaGFyYWN0ZXInKS5hdHRyKCdpZCcsICd0aXRsZScpLmFwcGVuZFRvKCdkaXYjY2hhcmFjdGVyJyk7XHJcblxyXG5cdFx0Ly8gVE9ETzogcmVwbGFjZSB0aGlzIHdpdGggZGVyaXZlZCBzdGF0c1xyXG4gICAgICAgIGZvcih2YXIgc3RhdCBpbiAkU00uZ2V0KCdjaGFyYWN0ZXIucmF3c3RhdHMnKSBhcyBhbnkpIHtcclxuICAgICAgICAgICAgJCgnPGRpdj4nKS50ZXh0KHN0YXQgKyAnOiAnICsgJFNNLmdldCgnY2hhcmFjdGVyLnJhd3N0YXRzLicgKyBzdGF0KSkuYXBwZW5kVG8oJ2RpdiNjaGFyYWN0ZXInKTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdidXR0b25zJykuY3NzKFwibWFyZ2luLXRvcFwiLCBcIjIwcHhcIikuYXBwZW5kVG8oJ2RpdiNjaGFyYWN0ZXInKTtcclxuXHRcdHZhciBpbnZlbnRvcnlCdXR0b24gPSBCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6IFwiaW52ZW50b3J5XCIsXHJcblx0XHRcdHRleHQ6IFwiSW52ZW50b3J5XCIsXHJcblx0XHRcdGNsaWNrOiBDaGFyYWN0ZXIub3BlbkludmVudG9yeVxyXG5cdFx0fSkuYXBwZW5kVG8oJCgnI2J1dHRvbnMnLCAnZGl2I2NoYXJhY3RlcicpKTtcclxuXHRcdFxyXG5cdFx0dmFyIHF1ZXN0TG9nQnV0dG9uID0gQnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiBcInF1ZXN0TG9nXCIsXHJcblx0XHRcdHRleHQ6IFwiUXVlc3QgTG9nXCIsXHJcblx0XHRcdGNsaWNrOiBDaGFyYWN0ZXIub3BlblF1ZXN0TG9nXHJcblx0XHR9KS5hcHBlbmRUbygkKCcjYnV0dG9ucycsICdkaXYjY2hhcmFjdGVyJykpO1xyXG5cclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdHdpbmRvdy5DaGFyYWN0ZXIgPSB0aGlzO1xyXG5cdH0sXHJcblx0XHJcblx0b3B0aW9uczoge30sIC8vIE5vdGhpbmcgZm9yIG5vd1xyXG5cdFxyXG5cdGVsZW06IG51bGwsXHJcblxyXG5cdGludmVudG9yeURpc3BsYXk6IG51bGwgYXMgYW55LFxyXG5cdHF1ZXN0TG9nRGlzcGxheTogbnVsbCBhcyBhbnksXHJcblxyXG5cdG9wZW5JbnZlbnRvcnk6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gY3JlYXRpbmcgYSBoYW5kbGUgZm9yIGxhdGVyIGFjY2Vzcywgc3VjaCBhcyBjbG9zaW5nIGludmVudG9yeVxyXG5cdFx0Q2hhcmFjdGVyLmludmVudG9yeURpc3BsYXkgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2ludmVudG9yeScpLmFkZENsYXNzKCdldmVudFBhbmVsJykuY3NzKCdvcGFjaXR5JywgJzAnKTtcclxuXHRcdHZhciBpbnZlbnRvcnlEaXNwbGF5ID0gQ2hhcmFjdGVyLmludmVudG9yeURpc3BsYXk7XHJcblx0XHRDaGFyYWN0ZXIuaW52ZW50b3J5RGlzcGxheVxyXG5cdFx0Ly8gc2V0IHVwIGNsaWNrIGFuZCBob3ZlciBoYW5kbGVycyBmb3IgaW52ZW50b3J5IGl0ZW1zXHJcblx0XHQub24oXCJjbGlja1wiLCBcIiNpdGVtXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRDaGFyYWN0ZXIudXNlSW52ZW50b3J5SXRlbSgkKHRoaXMpLmRhdGEoXCJuYW1lXCIpKTtcclxuXHRcdFx0Q2hhcmFjdGVyLmNsb3NlSW52ZW50b3J5KCk7XHJcblx0XHR9KS5vbihcIm1vdXNlZW50ZXJcIiwgXCIjaXRlbVwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHRvb2x0aXAgPSAkKFwiPGRpdiBpZD0ndG9vbHRpcCcgY2xhc3M9J3Rvb2x0aXAnPlwiICsgSXRlbUxpc3RbJCh0aGlzKS5kYXRhKFwibmFtZVwiKV0udGV4dCArIFwiPC9kaXY+XCIpXHJcblx0XHRcdC5hdHRyKCdkYXRhLW5hbWUnLCBpdGVtKTtcclxuXHRcdFx0dG9vbHRpcC5hcHBlbmRUbygkKHRoaXMpKTtcclxuXHRcdH0pLm9uKFwibW91c2VsZWF2ZVwiLCBcIiNpdGVtXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKFwiI3Rvb2x0aXBcIiwgXCIjXCIgKyAkKHRoaXMpLmRhdGEoXCJuYW1lXCIpKS5mYWRlT3V0KCkucmVtb3ZlKCk7XHJcblx0XHR9KTtcclxuXHRcdCQoJzxkaXY+JykuYWRkQ2xhc3MoJ2V2ZW50VGl0bGUnKS50ZXh0KCdJbnZlbnRvcnknKS5hcHBlbmRUbyhpbnZlbnRvcnlEaXNwbGF5KTtcclxuXHRcdHZhciBpbnZlbnRvcnlEZXNjID0gJCgnPGRpdj4nKS50ZXh0KFwiQ2xpY2sgdGhpbmdzIGluIHRoZSBsaXN0IHRvIHVzZSB0aGVtLlwiKVxyXG5cdFx0XHQuaG92ZXIoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIHRvb2x0aXAgPSAkKFwiPGRpdiBpZD0ndG9vbHRpcCcgY2xhc3M9J3Rvb2x0aXAnPlwiICsgXCJOb3QgdGhpcywgdGhvdWdoLlwiICsgXCI8L2Rpdj5cIik7XHJcbiAgICBcdFx0XHR0b29sdGlwLmFwcGVuZFRvKGludmVudG9yeURlc2MpO1xyXG5cdFx0XHR9LCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKFwiI3Rvb2x0aXBcIikuZmFkZU91dCgpLnJlbW92ZSgpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHROb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBfKFwiSSBiZXQgeW91IHRoaW5rIHlvdSdyZSBwcmV0dHkgZnVubnksIGh1aD8gQ2xpY2tpbmcgdGhlIHRoaW5nIEkgc2FpZCB3YXNuJ3QgY2xpY2thYmxlP1wiKSk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5jc3MoXCJtYXJnaW4tYm90dG9tXCIsIFwiMjBweFwiKVxyXG5cdFx0XHQuYXBwZW5kVG8oaW52ZW50b3J5RGlzcGxheSk7XHJcblx0XHRcclxuXHRcdGZvcih2YXIgaXRlbSBpbiBDaGFyYWN0ZXIuaW52ZW50b3J5KSB7XHJcblx0XHRcdC8vIG1ha2UgdGhlIGludmVudG9yeSBjb3VudCBsb29rIGEgYml0IG5pY2VyXHJcblx0XHRcdHZhciBpbnZlbnRvcnlFbGVtID0gJCgnPGRpdj4nKVxyXG5cdFx0XHQuYXR0cignaWQnLCAnaXRlbScpXHJcblx0XHRcdC5hdHRyKCdkYXRhLW5hbWUnLCBpdGVtKVxyXG5cdFx0XHQudGV4dChJdGVtTGlzdFtpdGVtXS5uYW1lICArICcgICh4JyArIENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0udG9TdHJpbmcoKSArICcpJylcclxuXHRcdFx0LmFwcGVuZFRvKGludmVudG9yeURpc3BsYXkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFRPRE86IG1ha2UgdGhpcyBDU1MgYW4gYWN0dWFsIGNsYXNzIHNvbWV3aGVyZSwgSSdtIHN1cmUgSSdsbCBuZWVkIGl0IGFnYWluXHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2J1dHRvbnMnKS5jc3MoXCJtYXJnaW4tdG9wXCIsIFwiMjBweFwiKS5hcHBlbmRUbyhpbnZlbnRvcnlEaXNwbGF5KTtcclxuXHRcdHZhciBiID0gXHJcblx0XHQvL25ldyBcclxuXHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogXCJjbG9zZUludmVudG9yeVwiLFxyXG5cdFx0XHR0ZXh0OiBcIkNsb3NlXCIsXHJcblx0XHRcdGNsaWNrOiBDaGFyYWN0ZXIuY2xvc2VJbnZlbnRvcnlcclxuXHRcdH0pLmFwcGVuZFRvKCQoJyNidXR0b25zJywgaW52ZW50b3J5RGlzcGxheSkpO1xyXG5cdFx0JCgnZGl2I3dyYXBwZXInKS5hcHBlbmQoaW52ZW50b3J5RGlzcGxheSk7XHJcblx0XHRpbnZlbnRvcnlEaXNwbGF5LmFuaW1hdGUoe29wYWNpdHk6IDF9LCBFdmVudHMuX1BBTkVMX0ZBREUsICdsaW5lYXInKTtcclxuXHR9LFxyXG5cclxuXHRjbG9zZUludmVudG9yeTogZnVuY3Rpb24oKSB7XHJcblx0XHRDaGFyYWN0ZXIuaW52ZW50b3J5RGlzcGxheS5lbXB0eSgpO1xyXG5cdFx0Q2hhcmFjdGVyLmludmVudG9yeURpc3BsYXkucmVtb3ZlKCk7XHJcblx0fSxcclxuXHJcblx0YWRkVG9JbnZlbnRvcnk6IGZ1bmN0aW9uKGl0ZW0sIGFtb3VudD0xKSB7XHJcblx0XHRpZiAoQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSkge1xyXG5cdFx0XHRDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dICs9IGFtb3VudDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0gPSBhbW91bnQ7XHJcblx0XHR9XHJcblxyXG5cdFx0JFNNLnNldCgnaW52ZW50b3J5JywgQ2hhcmFjdGVyLmludmVudG9yeSk7XHJcblx0fSxcclxuXHJcblxyXG5cdHJlbW92ZUZyb21JbnZlbnRvcnk6IGZ1bmN0aW9uKGl0ZW0sIGFtb3VudD0xKSB7XHJcblx0XHRpZiAoQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSkgQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSAtPSBhbW91bnQ7XHJcblx0XHRpZiAoQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSA8IDEpIHtcclxuXHRcdFx0ZGVsZXRlIENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV07XHJcblx0XHR9XHJcblxyXG5cdFx0JFNNLnNldCgnaW52ZW50b3J5JywgQ2hhcmFjdGVyLmludmVudG9yeSk7XHJcblx0fSxcclxuXHJcblx0dXNlSW52ZW50b3J5SXRlbTogZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0aWYgKENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0gJiYgQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSA+IDApIHtcclxuXHRcdFx0Ly8gdXNlIHRoZSBlZmZlY3QgaW4gdGhlIGludmVudG9yeTsganVzdCBpbiBjYXNlIGEgbmFtZSBtYXRjaGVzIGJ1dCB0aGUgZWZmZWN0XHJcblx0XHRcdC8vIGRvZXMgbm90LCBhc3N1bWUgdGhlIGludmVudG9yeSBpdGVtIGlzIHRoZSBzb3VyY2Ugb2YgdHJ1dGhcclxuXHRcdFx0SXRlbUxpc3RbaXRlbV0ub25Vc2UoKTtcclxuXHRcdFx0Ly8gcGxlYXNlIGRvbid0IG1ha2UgdGhpcyB1bnJlYWRhYmxlIG5vbnNlbnNlIGluIGEgZnV0dXJlIHJlZmFjdG9yLCBqdXN0XHJcblx0XHRcdC8vIGxldCBpdCBiZSB0aGlzIHdheVxyXG5cdFx0XHRpZiAodHlwZW9mKEl0ZW1MaXN0W2l0ZW1dLmRlc3Ryb3lPblVzZSkgPT0gXCJmdW5jdGlvblwiICYmIEl0ZW1MaXN0W2l0ZW1dLmRlc3Ryb3lPblVzZSgpKSB7XHJcblx0XHRcdFx0Q2hhcmFjdGVyLnJlbW92ZUZyb21JbnZlbnRvcnkoaXRlbSk7XHJcblx0XHRcdH0gZWxzZSBpZiAoSXRlbUxpc3RbaXRlbV0uZGVzdHJveU9uVXNlKSB7XHJcblx0XHRcdFx0Q2hhcmFjdGVyLnJlbW92ZUZyb21JbnZlbnRvcnkoaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBUT0RPOiB3cml0ZSB0byAkU01cclxuXHRcdCRTTS5zZXQoJ2ludmVudG9yeScsIENoYXJhY3Rlci5pbnZlbnRvcnkpO1xyXG5cdH0sXHJcblxyXG5cdGVxdWlwSXRlbTogZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0aWYgKEl0ZW1MaXN0W2l0ZW1dLnNsb3QgJiYgdHlwZW9mKENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zW0l0ZW1MaXN0W2l0ZW1dLnNsb3RdKSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG5cdFx0XHRDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoQ2hhcmFjdGVyLmVxdWlwcGVkSXRlbXNbSXRlbUxpc3RbaXRlbV0uc2xvdF0pO1xyXG5cdFx0XHRDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtc1tJdGVtTGlzdFtpdGVtXS5zbG90XSA9IGl0ZW07XHJcblx0XHRcdGlmIChJdGVtTGlzdFtpdGVtXS5vbkVxdWlwKSB7XHJcblx0XHRcdFx0SXRlbUxpc3RbaXRlbV0ub25FcXVpcCgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdENoYXJhY3Rlci5hcHBseUVxdWlwbWVudEVmZmVjdHMoKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBUT0RPOiB3cml0ZSB0byAkU01cclxuXHRcdCRTTS5zZXQoJ2VxdWlwcGVkSXRlbXMnLCBDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcyk7XHJcblx0XHQkU00uc2V0KCdpbnZlbnRvcnknLCBDaGFyYWN0ZXIuaW52ZW50b3J5KTtcclxuXHR9LFxyXG5cclxuXHRncmFudFBlcms6IGZ1bmN0aW9uKHBlcmspIHtcclxuXHRcdGlmIChDaGFyYWN0ZXIucGVya3NbcGVyay5uYW1lXSkge1xyXG5cdFx0XHRpZihwZXJrLnRpbWVMZWZ0ID4gMCkge1xyXG5cdFx0XHRcdENoYXJhY3Rlci5wZXJrc1twZXJrLm5hbWVdICs9IHBlcmsudGltZUxlZnQ7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5wZXJrc1twZXJrLm5hbWVdID0gcGVyaztcclxuXHRcdH1cclxuXHJcblx0XHQvLyBUT0RPOiB3cml0ZSB0byAkU01cclxuXHRcdCRTTS5zZXQoJ3BlcmtzJywgQ2hhcmFjdGVyLnBlcmtzKVxyXG5cdH0sXHJcblxyXG5cdG9wZW5RdWVzdExvZzogZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBjcmVhdGluZyBhIGhhbmRsZSBmb3IgbGF0ZXIgYWNjZXNzLCBzdWNoIGFzIGNsb3NpbmcgcXVlc3QgbG9nXHJcblx0XHRDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5ID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdxdWVzdCcpLmFkZENsYXNzKCdldmVudFBhbmVsJykuY3NzKCdvcGFjaXR5JywgJzAnKTtcclxuXHRcdHZhciBxdWVzdExvZ0Rpc3BsYXkgPSBDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5O1xyXG5cdFx0Q2hhcmFjdGVyLnF1ZXN0TG9nRGlzcGxheVxyXG5cdFx0Ly8gc2V0IHVwIGNsaWNrIGFuZCBob3ZlciBoYW5kbGVycyBmb3IgcXVlc3RzXHJcblx0XHQub24oXCJjbGlja1wiLCBcIiNxdWVzdFwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0Q2hhcmFjdGVyLmRpc3BsYXlRdWVzdCgkKHRoaXMpLmRhdGEoXCJuYW1lXCIpKTtcclxuXHRcdH0pLm9uKFwibW91c2VlbnRlclwiLCBcIiNxdWVzdFwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly8gZGVzY3JpcHRpb24gc2hvdWxkbid0IGJlIG9uIGEgdG9vbHRpcCwgb2J2cywgYnV0IGZpeCB0aGlzIGxhdGVyXHJcblx0XHRcdHZhciB0b29sdGlwID0gJChcIjxkaXYgaWQ9J3Rvb2x0aXAnIGNsYXNzPSd0b29sdGlwJz5cIiArIFF1ZXN0TG9nWyQodGhpcykuZGF0YShcIm5hbWVcIildLmxvZ0Rlc2NyaXB0aW9uICsgXCI8L2Rpdj5cIilcclxuXHRcdFx0LmF0dHIoJ2RhdGEtbmFtZScsIHF1ZXN0KTtcclxuXHRcdFx0dG9vbHRpcC5hcHBlbmRUbygkKHRoaXMpKTtcclxuXHRcdH0pLm9uKFwibW91c2VsZWF2ZVwiLCBcIiNxdWVzdFwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0JChcIiN0b29sdGlwXCIsIFwiI1wiICsgJCh0aGlzKS5kYXRhKFwibmFtZVwiKSkuZmFkZU91dCgpLnJlbW92ZSgpO1xyXG5cdFx0fSk7XHJcblx0XHQkKCc8ZGl2PicpLmFkZENsYXNzKCdldmVudFRpdGxlJykudGV4dCgnUXVlc3QgTG9nJykuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHRcdHZhciBxdWVzdExvZ0Rlc2MgPSAkKCc8ZGl2PicpLnRleHQoXCJDbGljayBxdWVzdCBuYW1lcyB0byBzZWUgbW9yZSBpbmZvLlwiKVxyXG5cdFx0XHQuY3NzKFwibWFyZ2luLWJvdHRvbVwiLCBcIjIwcHhcIilcclxuXHRcdFx0LmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHRcclxuXHRcdGZvcih2YXIgcXVlc3QgaW4gQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzKSB7XHJcblx0XHRcdHZhciBxdWVzdEVsZW0gPSAkKCc8ZGl2PicpXHJcblx0XHRcdC5hdHRyKCdpZCcsIFwicXVlc3RcIilcclxuXHRcdFx0LmF0dHIoJ2RhdGEtbmFtZScsIHF1ZXN0KVxyXG5cdFx0XHQudGV4dChRdWVzdExvZ1txdWVzdF0ubmFtZSlcclxuXHRcdFx0LmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHRcdGlmIChDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdID09IC0xKSB7XHJcblx0XHRcdFx0cXVlc3RFbGVtXHJcblx0XHRcdFx0Ly8gSSB3YW50IHRoaXMgdG8gYmUgbm90IHN0cnVjayB0aHJvdWdoLCBidXQgdGhhdCdzIHRvbyBhbm5veWluZyB0byB3b3JyeVxyXG5cdFx0XHRcdC8vIGFib3V0IHJpZ2h0IG5vd1xyXG5cdFx0XHRcdC8vIC5wcmVwZW5kKFwiRE9ORSBcIilcclxuXHRcdFx0XHQud3JhcChcIjxzdHJpa2U+XCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVE9ETzogbWFrZSB0aGlzIENTUyBhbiBhY3R1YWwgY2xhc3Mgc29tZXdoZXJlLCBJJ20gc3VyZSBJJ2xsIG5lZWQgaXQgYWdhaW5cclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnYnV0dG9ucycpLmNzcyhcIm1hcmdpbi10b3BcIiwgXCIyMHB4XCIpLmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHR2YXIgYiA9IEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogXCJjbG9zZVF1ZXN0TG9nXCIsXHJcblx0XHRcdHRleHQ6IFwiQ2xvc2VcIixcclxuXHRcdFx0Y2xpY2s6IENoYXJhY3Rlci5jbG9zZVF1ZXN0TG9nXHJcblx0XHR9KS5hcHBlbmRUbygkKCcjYnV0dG9ucycsIHF1ZXN0TG9nRGlzcGxheSkpO1xyXG5cdFx0JCgnZGl2I3dyYXBwZXInKS5hcHBlbmQocXVlc3RMb2dEaXNwbGF5KTtcclxuXHRcdHF1ZXN0TG9nRGlzcGxheS5hbmltYXRlKHtvcGFjaXR5OiAxfSwgRXZlbnRzLl9QQU5FTF9GQURFLCAnbGluZWFyJyk7XHJcblx0fSxcclxuXHJcblx0ZGlzcGxheVF1ZXN0OiBmdW5jdGlvbihxdWVzdDogc3RyaW5nKSB7XHJcblx0XHRjb25zdCBxdWVzdExvZ0Rpc3BsYXkgPSBDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5O1xyXG5cdFx0cXVlc3RMb2dEaXNwbGF5LmVtcHR5KCk7XHJcblx0XHRjb25zdCBjdXJyZW50UXVlc3QgPSBRdWVzdExvZ1txdWVzdF07XHJcblxyXG5cdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdxdWVzdCcpLmFkZENsYXNzKCdldmVudFBhbmVsJykuY3NzKCdvcGFjaXR5JywgJzAnKTtcclxuXHRcdCQoJzxkaXY+JykuYWRkQ2xhc3MoJ2V2ZW50VGl0bGUnKS50ZXh0KGN1cnJlbnRRdWVzdC5uYW1lKS5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cclxuXHRcdHZhciBxdWVzdExvZ0Rlc2MgPSAkKCc8ZGl2PicpLnRleHQoY3VycmVudFF1ZXN0LmxvZ0Rlc2NyaXB0aW9uKVxyXG5cdFx0XHQuY3NzKFwibWFyZ2luLWJvdHRvbVwiLCBcIjIwcHhcIilcclxuXHRcdFx0LmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblxyXG5cdFx0aWYgKENoYXJhY3Rlci5xdWVzdFN0YXR1c1txdWVzdF0gYXMgbnVtYmVyID09IC0xKSB7XHJcblx0XHRcdHZhciBwaGFzZURlc2MgPSAkKCc8ZGl2PicpLnRleHQoXCJUaGlzIHF1ZXN0IGlzIGNvbXBsZXRlIVwiKVxyXG5cdFx0XHQuY3NzKFwibWFyZ2luLWJvdHRvbVwiLCBcIjEwcHhcIilcclxuXHRcdFx0LmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPD0gKENoYXJhY3Rlci5xdWVzdFN0YXR1c1txdWVzdF0gYXMgbnVtYmVyKTsgaSsrKSB7XHJcblx0XHRcdHZhciBwaGFzZURlc2MgPSAkKCc8ZGl2PicpLnRleHQoY3VycmVudFF1ZXN0LnBoYXNlc1tpXS5kZXNjcmlwdGlvbilcclxuXHRcdFx0LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCIxMHB4XCIpXHJcblx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0XHR2YXIgY29tcGxldGUgPSB0cnVlO1xyXG5cdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IE9iamVjdC5rZXlzKGN1cnJlbnRRdWVzdC5waGFzZXNbaV0ucmVxdWlyZW1lbnRzKS5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdHZhciByZXF1aXJlbWVudHNEZXNjID0gJCgnPGRpdj4nKS50ZXh0KGN1cnJlbnRRdWVzdC5waGFzZXNbaV0ucmVxdWlyZW1lbnRzW2pdLnJlbmRlclJlcXVpcmVtZW50KCkpXHJcblx0XHRcdFx0XHQuY3NzKFwibWFyZ2luLWJvdHRvbVwiLCBcIjIwcHhcIilcclxuXHRcdFx0XHRcdC5jc3MoXCJtYXJnaW4tbGVmdFwiLCBcIjIwcHhcIilcclxuXHRcdFx0XHRcdC5jc3MoJ2ZvbnQtc3R5bGUnLCAnaXRhbGljJylcclxuXHRcdFx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0XHRcdGlmICghY3VycmVudFF1ZXN0LnBoYXNlc1tpXS5yZXF1aXJlbWVudHNbal0uaXNDb21wbGV0ZSgpKSBjb21wbGV0ZSA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChjb21wbGV0ZSkge1xyXG5cdFx0XHRcdHBoYXNlRGVzYy53cmFwKFwiPHN0cmlrZT5cIik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBUT0RPOiBtYWtlIHRoaXMgQ1NTIGFuIGFjdHVhbCBjbGFzcyBzb21ld2hlcmUsIEknbSBzdXJlIEknbGwgbmVlZCBpdCBhZ2FpblxyXG5cdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdidXR0b25zJykuY3NzKFwibWFyZ2luLXRvcFwiLCBcIjIwcHhcIikuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHJcblx0XHR2YXIgYiA9IEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogXCJiYWNrVG9RdWVzdExvZ1wiLFxyXG5cdFx0XHR0ZXh0OiBcIkJhY2sgdG8gUXVlc3QgTG9nXCIsXHJcblx0XHRcdGNsaWNrOiBDaGFyYWN0ZXIuYmFja1RvUXVlc3RMb2dcclxuXHRcdH0pLmFwcGVuZFRvKCQoJyNidXR0b25zJywgcXVlc3RMb2dEaXNwbGF5KSk7XHJcblxyXG5cdFx0dmFyIGIgPSBCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6IFwiY2xvc2VRdWVzdExvZ1wiLFxyXG5cdFx0XHR0ZXh0OiBcIkNsb3NlXCIsXHJcblx0XHRcdGNsaWNrOiBDaGFyYWN0ZXIuY2xvc2VRdWVzdExvZ1xyXG5cdFx0fSkuYXBwZW5kVG8oJCgnI2J1dHRvbnMnLCBxdWVzdExvZ0Rpc3BsYXkpKTtcclxuXHR9LFxyXG5cclxuXHRjbG9zZVF1ZXN0TG9nOiBmdW5jdGlvbigpIHtcclxuXHRcdENoYXJhY3Rlci5xdWVzdExvZ0Rpc3BsYXkuZW1wdHkoKTtcclxuXHRcdENoYXJhY3Rlci5xdWVzdExvZ0Rpc3BsYXkucmVtb3ZlKCk7XHJcblx0fSxcclxuXHJcblx0YmFja1RvUXVlc3RMb2c6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Q2hhcmFjdGVyLmNsb3NlUXVlc3RMb2coKTtcclxuXHRcdENoYXJhY3Rlci5vcGVuUXVlc3RMb2coKTtcclxuXHR9LFxyXG5cclxuXHRzZXRRdWVzdFN0YXR1czogZnVuY3Rpb24ocXVlc3QsIHBoYXNlKSB7XHJcblx0XHQvLyBtaWdodCBiZSBhIGdvb2QgaWRlYSB0byBjaGVjayBmb3IgbGluZWFyIHF1ZXN0IHByb2dyZXNzaW9uIGhlcmU/XHJcblx0XHRpZiAodHlwZW9mKFF1ZXN0TG9nW3F1ZXN0XSkgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuXHRcdFx0Q2hhcmFjdGVyLnF1ZXN0U3RhdHVzW3F1ZXN0XSA9IHBoYXNlO1xyXG5cclxuXHRcdFx0JFNNLnNldCgncXVlc3RTdGF0dXMnLCBDaGFyYWN0ZXIucXVlc3RTdGF0dXMpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdGNoZWNrUXVlc3RTdGF0dXM6IGZ1bmN0aW9uKHF1ZXN0KSB7XHJcblx0XHRjb25zdCBjdXJyZW50UGhhc2UgPSBRdWVzdExvZ1txdWVzdF0ucGhhc2VzW0NoYXJhY3Rlci5xdWVzdFN0YXR1c1txdWVzdF1dO1xyXG5cclxuXHRcdHZhciBjb21wbGV0ZSA9IHRydWU7XHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IE9iamVjdC5rZXlzKGN1cnJlbnRQaGFzZS5yZXF1aXJlbWVudHMpLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmICghY3VycmVudFBoYXNlLnJlcXVpcmVtZW50c1tpXS5pc0NvbXBsZXRlKCkpXHJcblx0XHRcdFx0Y29tcGxldGUgPSBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBpZiB0aGVyZSBpcyBhIG5leHQgcGhhc2UsIHNldCBxdWVzdFN0YXR1cyB0byBpdFxyXG5cdFx0aWYgKHR5cGVvZihRdWVzdExvZ1txdWVzdF0ucGhhc2VzW0NoYXJhY3Rlci5xdWVzdFN0YXR1c1txdWVzdF0gKyAxXSkgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuXHRcdFx0Q2hhcmFjdGVyLnF1ZXN0U3RhdHVzW3F1ZXN0XSArPSAxO1xyXG5cdFx0fSBlbHNlIHsgLy8gZWxzZSBzZXQgaXQgdG8gY29tcGxldGVcclxuXHRcdFx0Q2hhcmFjdGVyLnF1ZXN0U3RhdHVzW3F1ZXN0XSA9IC0xO1xyXG5cdFx0fVxyXG5cclxuXHRcdCRTTS5zZXQoJ3F1ZXN0U3RhdHVzJywgQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzKTtcclxuXHR9LFxyXG5cclxuXHQvLyBhcHBseSBlcXVpcG1lbnQgZWZmZWN0cywgd2hpY2ggc2hvdWxkIGFsbCBjaGVjayBhZ2FpbnN0ICRTTSBzdGF0ZSB2YXJpYWJsZXM7XHJcblx0Ly8gdGhpcyBzaG91bGQgYmUgY2FsbGVkIG9uIGJhc2ljYWxseSBldmVyeSBwbGF5ZXIgYWN0aW9uIHdoZXJlIGEgcGllY2Ugb2YgZ2VhclxyXG5cdC8vIHdvdWxkIGRvIHNvbWV0aGluZyBvciBjaGFuZ2UgYW4gb3V0Y29tZTsgZ2l2ZSBleHRyYVBhcmFtcyB0byB0aGUgZWZmZWN0IGJlaW5nIFxyXG5cdC8vIGFwcGxpZWQgZm9yIGFueXRoaW5nIHRoYXQncyByZWxldmFudCB0byB0aGUgZWZmZWN0IGJ1dCBub3QgaGFuZGxlZCBieSAkU01cclxuXHRhcHBseUVxdWlwbWVudEVmZmVjdHM6IGZ1bmN0aW9uKGV4dHJhUGFyYW1zPykge1xyXG5cdFx0Zm9yIChjb25zdCBpdGVtIGluIENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zKSB7XHJcblx0XHRcdGlmIChJdGVtTGlzdFtpdGVtXS5lZmZlY3RzKSB7XHJcblx0XHRcdFx0Zm9yIChjb25zdCBlZmZlY3QgaW4gSXRlbUxpc3RbaXRlbV0uZWZmZWN0cykge1xyXG5cdFx0XHRcdFx0Ly8gTk9URTogY3VycmVudGx5IHRoaXMgaXMgZ29vZCBmb3IgYXBwbHlpbmcgcGVya3MgYW5kIE5vdGlmeWluZztcclxuXHRcdFx0XHRcdC8vIGFyZSB0aGVyZSBvdGhlciBzaXR1YXRpb25zIHdoZXJlIHdlJ2Qgd2FudCB0byBhcHBseSBlZmZlY3RzLFxyXG5cdFx0XHRcdFx0Ly8gb3IgY2FuIHdlIGNvdmVyIGJhc2ljYWxseSBldmVyeSBjYXNlIHZpYSB0aG9zZSB0aGluZ3M/XHJcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0XHRpZiAoZWZmZWN0LmlzQWN0aXZlICYmIGVmZmVjdC5pc0FjdGl2ZShleHRyYVBhcmFtcykpIGVmZmVjdC5hcHBseShleHRyYVBhcmFtcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Ly8gZ2V0IHN0YXRzIGFmdGVyIGFwcGx5aW5nIGFsbCBlcXVpcG1lbnQgYm9udXNlcywgcGVya3MsIGV0Yy5cclxuXHRnZXREZXJpdmVkU3RhdHM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Y29uc3QgZGVyaXZlZFN0YXRzID0gc3RydWN0dXJlZENsb25lKENoYXJhY3Rlci5yYXdTdGF0cyk7XHJcblx0XHRmb3IgKGNvbnN0IGl0ZW0gaW4gQ2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMpIHtcclxuXHRcdFx0aWYgKEl0ZW1MaXN0W2l0ZW1dLnN0YXRCb251c2VzKSB7XHJcblx0XHRcdFx0Zm9yIChjb25zdCBzdGF0IGluIE9iamVjdC5rZXlzKEl0ZW1MaXN0W2l0ZW1dLnN0YXRCb251c2VzKSkge1xyXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiAoSXRlbUxpc3RbaXRlbV0uc3RhdEJvbnVzZXNbc3RhdF0gPT0gXCJmdW5jdGlvblwiKSkge1xyXG5cdFx0XHRcdFx0XHRkZXJpdmVkU3RhdHNbc3RhdF0gKz0gSXRlbUxpc3RbaXRlbV0uc3RhdEJvbnVzZXNbc3RhdF0oKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGRlcml2ZWRTdGF0c1tzdGF0XSArPSBJdGVtTGlzdFtpdGVtXS5zdGF0Qm9udXNlc1tzdGF0XTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGNvbnN0IHBlcmsgaW4gQ2hhcmFjdGVyLnBlcmtzKSB7XHJcblx0XHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdFx0aWYgKHBlcmsuc3RhdEJvbnVzZXMpIHtcclxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0Zm9yIChjb25zdCBzdGF0IGluIE9iamVjdC5rZXlzKHBlcmsuc3RhdEJvbnVzZXMpKSB7XHJcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0XHRpZiAodHlwZW9mIChwZXJrLnN0YXRCb251c2VzW3N0YXRdID09IFwiZnVuY3Rpb25cIikpIHtcclxuXHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdFx0XHRkZXJpdmVkU3RhdHNbc3RhdF0gKz0gcGVyay5zdGF0Qm9udXNlc1tzdGF0XSgpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdFx0XHRkZXJpdmVkU3RhdHNbc3RhdF0gKz0gcGVyay5zdGF0Qm9udXNlc1tzdGF0XTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZGVyaXZlZFN0YXRzO1xyXG5cdH1cclxufSIsIi8vIGFsbCBpdGVtcyBnbyBoZXJlLCBzbyB0aGF0IG5vdGhpbmcgc2lsbHkgaGFwcGVucyBpbiB0aGUgZXZlbnQgdGhhdCB0aGV5IGdldCBwdXQgaW4gTG9jYWwgU3RvcmFnZVxyXG4vLyBhcyBwYXJ0IG9mIHRoZSBzdGF0ZSBtYW5hZ2VtZW50IGNvZGU7IHBsZWFzZSBzYXZlIGl0ZW0gbmFtZXMgdG8gdGhlIGludmVudG9yeSwgYW5kIHRoZW4gcmVmZXIgdG8gXHJcbi8vIHRoZSBpdGVtIGxpc3QgdmlhIHRoZSBpdGVtIG5hbWVcclxuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tIFwiLi9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tIFwiLi4vbm90aWZpY2F0aW9uc1wiO1xyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSBcIi4vaXRlbVwiO1xyXG5cclxuLy8gRGV0YWlscyBmb3IgYWxsIGluLWdhbWUgaXRlbXM7IHRoZSBDaGFyYWN0ZXIgaW52ZW50b3J5IG9ubHkgaG9sZHMgaXRlbSBJRHNcclxuLy8gYW5kIGFtb3VudHNcclxuZXhwb3J0IGNvbnN0IEl0ZW1MaXN0OiB7W2lkOiBzdHJpbmddOiBJdGVtfSA9IHtcclxuICAgIFwiTGl6LndlaXJkQm9va1wiOiB7XHJcbiAgICAgICAgbmFtZTogJ1dlaXJkIEJvb2snLFxyXG4gICAgICAgIHRleHQ6IF8oJ0EgYm9vayB5b3UgZm91bmQgYXQgTGl6XFwncyBwbGFjZS4gU3VwcG9zZWRseSBoYXMgaW5mb3JtYXRpb24gYWJvdXQgQ2hhZHRvcGlhLicpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHsgXHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAgXyhcIkEgQnJpZWYgSGlzdG9yeSBvZiBDaGFkdG9waWFcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKCdUaGlzIGJvb2sgaXMgcHJldHR5IGJvcmluZywgYnV0IHlvdSBtYW5hZ2UgdG8gbGVhcm4gYSBiaXQgbW9yZSBpbiBzcGl0ZSBvZiB5b3VyIHBvb3IgYXR0ZW50aW9uIHNwYW4uJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKCdGb3IgZXhhbXBsZSwgeW91IGxlYXJuIHRoYXQgXCJDaGFkdG9waWFcIiBkb2VzblxcJ3QgaGF2ZSBhIGNhcGl0YWwgXFwnVFxcJy4gVGhhdFxcJ3MgcHJldHR5IGNvb2wsIGh1aD8nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oJy4uLiBXaGF0IHdlcmUgeW91IGRvaW5nIGFnYWluPycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1NvbWV0aGluZyBjb29sZXIgdGhhbiByZWFkaW5nLCBwcm9iYWJseScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiBDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoXCJMaXouYm9yaW5nQm9va1wiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IHRydWUsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG5cclxuICAgIFwiTGl6LmJvcmluZ0Jvb2tcIjoge1xyXG4gICAgICAgIG5hbWU6ICdBIEJyaWVmIEhpc3Rvcnkgb2YgQ2hhZHRvcGlhJyxcclxuICAgICAgICB0ZXh0OiBfKCdNYW4sIHRoaXMgYm9vayBpcyBib3JpbmcuJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEgQnJpZWYgU3VtbWFyeSBvZiBhIEJyaWVmIEhpc3Rvcnkgb2YgQ2hhZHRvcGlhXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW18oJ0l0XFwncyBzdGlsbCBqdXN0IGFzIGJvcmluZyBhcyB3aGVuIHlvdSBsYXN0IHRyaWVkIHRvIHJlYWQgaXQuJyldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdEYW5nLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogZmFsc2UsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgXCJTdHJhbmdlci5zbW9vdGhTdG9uZVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ0Egc21vb3RoIGJsYWNrIHN0b25lJyxcclxuICAgICAgICB0ZXh0OiBfKCdJdFxcJ3Mgd2VpcmRseSBlZXJpZScpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKCEkU00uZ2V0KCdrbm93bGVkZ2UuU3RyYW5nZXIuc21vb3RoU3RvbmUnKSkge1xyXG4gICAgICAgICAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgJ1lvdSBoYXZlIG5vIGlkZWEgd2hhdCB0byBkbyB3aXRoIHRoaXMgdGhpbmcuJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IF8oXCJBIHNtb290aCBibGFjayBzdG9uZVwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtfKFwiSSdtIGdlbnVpbmVseSBub3Qgc3VyZSBob3cgeW91IGdvdCB0byB0aGlzIGV2ZW50LCBidXQgcGxlYXNlIGxldCBtZSBrbm93IHZpYSBHaXRIdWIgaXNzdWUsIHlvdSBsaXR0bGUgc3Rpbmtlci5cIildLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdJIHN3ZWFyIHRvIGRvIHRoaXMsIGFzIGEgcmVzcG9uc2libGUgY2l0aXplbiBvZiBFYXJ0aCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogZmFsc2UsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgXCJTdHJhbmdlci53cmFwcGVkS25pZmVcIjoge1xyXG4gICAgICAgIG5hbWU6ICdBIGtuaWZlIHdyYXBwZWQgaW4gY2xvdGgnLFxyXG4gICAgICAgIHRleHQ6IF8oJ01hbiwgSSBob3BlIGl0XFwncyBub3QgYWxsIGxpa2UsIGJsb29keSBvbiB0aGUgYmxhZGUgYW5kIHN0dWZmLicpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IF8oXCJBIGtuaWZlIHdyYXBwZWQgaW4gY2xvdGhcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXyhcIllvdSB1bndyYXAgdGhlIGtuaWZlIGNhcmVmdWxseS4gSXQgc2VlbXMgdG8gYmUgaGlnaGx5IG9ybmFtZW50ZWQsIGFuZCB5b3UgY291bGQgcHJvYmFibHkgZG8gc29tZSBjcmltZXMgd2l0aCBpdC5cIildLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdIZWxsIHllYWgsIEFkb2xmIExvb3Mgc3R5bGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNob29zZTogQ2hhcmFjdGVyLmFkZFRvSW52ZW50b3J5KFwiU3RyYW5nZXIuc2lsdmVyS25pZmVcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveU9uVXNlOiB0cnVlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIFwiU3RyYW5nZXIuc2lsdmVyS25pZmVcIjoge1xyXG4gICAgICAgIG5hbWU6ICdBIHNpbHZlciBrbmlmZScsXHJcbiAgICAgICAgdGV4dDogXygnSGlnaGx5IG9ybmFtZW50ZWQnKSxcclxuICAgICAgICBvblVzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBfKFwiQSBzaWx2ZXIga25pZmVcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiT25lIGRheSB5b3UnbGwgYmUgYWJsZSB0byBlcXVpcCB0aGlzLCBidXQgcmlnaHQgbm93IHRoYXQgZnVuY3Rpb25hbGl0eSBpc24ndCBwcmVzZW50LlwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJQbGVhc2UgcG9saXRlbHkgbGVhdmUgdGhlIHByZW1pc2VzIHdpdGhvdXQgYWNrbm93bGVkZ2luZyB0aGlzIG1pc3NpbmcgZmVhdHVyZS5cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnWW91IGdvdCBpdCwgY2hpZWYnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIFwiU3RyYW5nZXIuY2xvdGhCdW5kbGVcIjoge1xyXG4gICAgICAgIG5hbWU6ICdBIGJ1bmRsZSBvZiBjbG90aCcsXHJcbiAgICAgICAgdGV4dDogXygnV2hhdCBsaWVzIHdpdGhpbj8nKSxcclxuICAgICAgICBvblVzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBfKFwiQSBidW5kbGUgb2YgY2xvdGhcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiT25lIGRheSB5b3UnbGwgYmUgYWJsZSB0byB1c2UgdGhpcyBpdGVtLCBidXQgcmlnaHQgbm93IHRoYXQgZnVuY3Rpb25hbGl0eSBpc24ndCBwcmVzZW50LlwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJQbGVhc2UgcG9saXRlbHkgbGVhdmUgdGhlIHByZW1pc2VzIHdpdGhvdXQgYWNrbm93bGVkZ2luZyB0aGlzIG1pc3NpbmcgZmVhdHVyZS5cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnWW91IGdvdCBpdCwgY2hpZWYnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIFwiU3RyYW5nZXIuY29pblwiOiB7XHJcbiAgICAgICAgbmFtZTogJ0Egc3RyYW5nZSBjb2luJyxcclxuICAgICAgICB0ZXh0OiBfKCdCb3RoIHNpZGVzIGRlcGljdCB0aGUgc2FtZSBpbWFnZScpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IF8oXCJBIHN0cmFuZ2UgY29pblwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJPbmUgZGF5IHlvdSdsbCBiZSBhYmxlIHRvIHVzZSB0aGlzIGl0ZW0sIGJ1dCByaWdodCBub3cgdGhhdCBmdW5jdGlvbmFsaXR5IGlzbid0IHByZXNlbnQuXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIlBsZWFzZSBwb2xpdGVseSBsZWF2ZSB0aGUgcHJlbWlzZXMgd2l0aG91dCBhY2tub3dsZWRnaW5nIHRoaXMgbWlzc2luZyBmZWF0dXJlLlwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdZb3UgZ290IGl0LCBjaGllZicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogZmFsc2UsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgXCJDYXB0YWluLnN1cHBsaWVzXCI6IHtcclxuICAgICAgICBuYW1lOiAnU3VwcGxpZXMgZm9yIHRoZSBNYXlvcicsXHJcbiAgICAgICAgdGV4dDogJ1RoZXlcXCdyZSBoZWF2eSwgYnV0IG5vdCBpbiBhIHdheSB0aGF0IGltcGFjdHMgZ2FtZXBsYXknLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IF8oXCJTdXBwbGllcyBmb3IgdGhlIE1heW9yXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIkEgYmlnIGJveCBvZiBzdHVmZiBmb3IgdGhlIHZpbGxhZ2UuIExvb2tzIGxpa2UgcmF3IG1hdGVyaWFscywgbW9zdGx5LlwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJJIHNob3VsZCByZWFsbHkgdGFrZSB0aGlzIGJhY2sgdG8gdGhlIE1heW9yLlwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdPa2F5JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveU9uVXNlOiBmYWxzZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tIFwiLi9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IHsgUXVlc3QgfSBmcm9tIFwiLi9xdWVzdFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IFF1ZXN0TG9nOiB7W2lkOiBzdHJpbmddOiBRdWVzdH0gPSB7XHJcbiAgICBcIm1heW9yU3VwcGxpZXNcIjoge1xyXG4gICAgICAgIG5hbWU6IFwiU3VwcGxpZXMgZm9yIHRoZSBNYXlvclwiLFxyXG4gICAgICAgIGxvZ0Rlc2NyaXB0aW9uOiBcIlRoZSBtYXlvciBoYXMgYXNrZWQgeW91IHRvIGdldCBzb21lIHN1cHBsaWVzIGZvciBoaW0gZnJvbSB0aGUgb3V0cG9zdC5cIixcclxuICAgICAgICBwaGFzZXM6IHtcclxuICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiR28gY2hlY2sgb3V0IHRoZSBSb2FkIHRvIHRoZSBPdXRwb3N0IHRvIHNlZSBpZiB5b3UgY2FuIGZpbmQgb3V0IG1vcmVcIixcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVtZW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyUmVxdWlyZW1lbnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRTTS5nZXQoJ3JvYWQub3BlbicpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHR5cGVvZigkU00uZ2V0KCdSb2FkLmNvdW50ZXInKSkgPT0gXCJ1bmRlZmluZWRcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJJIHNob3VsZCBnbyBjaGVjayBvdXQgdGhlIFJvYWQgdG8gdGhlIE91dHBvc3RcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCRTTS5nZXQoJ3JvYWQub3BlbicpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHR5cGVvZigkU00uZ2V0KCdSb2FkLmNvdW50ZXInKSkgIT09IFwidW5kZWZpbmVkXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0eXBlb2YoJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpKSA9PSBcInVuZGVmaW5lZFwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkkgc2hvdWxkIGtlZXAgZXhwbG9yaW5nIHRoZSBSb2FkIHRvIHRoZSBPdXRwb3N0XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgkU00uZ2V0KCdyb2FkLm9wZW4nKSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0eXBlb2YoJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpKSAhPT0gXCJ1bmRlZmluZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkkndmUgZm91bmQgdGhlIHdheSB0byB0aGUgT3V0cG9zdFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0NvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoJFNNLmdldCgncm9hZC5vcGVuJykgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0eXBlb2YoJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpKSAhPT0gXCJ1bmRlZmluZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpIGFzIG51bWJlciA+IDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgMToge1xyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiQXNrIHRoZSBDYXB0YWluIG9mIHRoZSBPdXRwb3N0IGFib3V0IHRoZSBzdXBwbGllc1wiLFxyXG4gICAgICAgICAgICAgICAgcmVxdWlyZW1lbnRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJSZXF1aXJlbWVudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpIGFzIG51bWJlciA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0eXBlb2YoJFNNLmdldCgnb3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnKSkgPT0gXCJ1bmRlZmluZWRcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJJIHNob3VsZCB0cnkgdGFsa2luZyB0byB0aGUgQ2FwdGFpbiBvZiB0aGUgT3V0cG9zdFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpIGFzIG51bWJlciA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0eXBlb2YoJFNNLmdldCgnb3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnKSkgIT09IFwidW5kZWZpbmVkXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdvdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcpIGFzIG51bWJlciA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0eXBlb2YoQ2hhcmFjdGVyLmludmVudG9yeVtcIkNhcHRhaW4uc3VwcGxpZXNcIl0pID09IFwidW5kZWZpbmVkXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiSSBzaG91bGQgYXNrIHRoZSBDYXB0YWluIGFib3V0IHRoZSBtaXNzaW5nIHN1cHBsaWVzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHR5cGVvZigkU00uZ2V0KCdvdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcpKSAhPT0gXCJ1bmRlZmluZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ291dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHR5cGVvZihDaGFyYWN0ZXIuaW52ZW50b3J5W1wiQ2FwdGFpbi5zdXBwbGllc1wiXSkgIT09IFwidW5kZWZpbmVkXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiSSd2ZSBnb3R0ZW4gdGhlIHN1cHBsaWVzIGZyb20gdGhlIENhcHRhaW5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0eXBlb2YoJFNNLmdldCgnb3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnKSAhPT0gXCJ1bmRlZmluZWRcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ291dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdHlwZW9mKENoYXJhY3Rlci5pbnZlbnRvcnlbXCJDYXB0YWluLnN1cHBsaWVzXCJdKSAhPT0gXCJ1bmRlZmluZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIDI6IHtcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlJldHVybiB0aGUgc3VwcGxpZXMgdG8gdGhlIE1heW9yXCIsXHJcbiAgICAgICAgICAgICAgICByZXF1aXJlbWVudHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlclJlcXVpcmVtZW50OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YoJFNNLmdldCgndmlsbGFnZS5tYXlvci5oYXZlR2l2ZW5TdXBwbGllcycpKSA9PSBcInVuZGVmaW5lZFwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAgXCJJIHNob3VsZCBoYW5kIHRoZXNlIHN1cHBsaWVzIG92ZXIgdG8gdGhlIE1heW9yXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YoJFNNLmdldCgndmlsbGFnZS5tYXlvci5oYXZlR2l2ZW5TdXBwbGllcycpKSA9PSBcInVuZGVmaW5lZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgndmlsbGFnZS5tYXlvci5oYXZlR2l2ZW5TdXBwbGllcycpIGFzIG51bWJlciA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiSSd2ZSBoYW5kZWQgb3ZlciB0aGUgc3VwcGxpZXMgdG8gdGhlIE1heW9yXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICh0eXBlb2YoJFNNLmdldCgndmlsbGFnZS5tYXlvci5oYXZlR2l2ZW5TdXBwbGllcycpKSA9PSBcInVuZGVmaW5lZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykgYXMgbnVtYmVyID4gMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvKlxyXG4gKiBNb2R1bGUgZm9yIGhhbmRsaW5nIFN0YXRlc1xyXG4gKiBcclxuICogQWxsIHN0YXRlcyBzaG91bGQgYmUgZ2V0IGFuZCBzZXQgdGhyb3VnaCB0aGUgU3RhdGVNYW5hZ2VyICgkU00pLlxyXG4gKiBcclxuICogVGhlIG1hbmFnZXIgaXMgaW50ZW5kZWQgdG8gaGFuZGxlIGFsbCBuZWVkZWQgY2hlY2tzIGFuZCBlcnJvciBjYXRjaGluZy5cclxuICogVGhpcyBpbmNsdWRlcyBjcmVhdGluZyB0aGUgcGFyZW50cyBvZiBsYXllcmVkL2RlZXAgc3RhdGVzIHNvIHVuZGVmaW5lZCBzdGF0ZXNcclxuICogZG8gbm90IG5lZWQgdG8gYmUgdGVzdGVkIGZvciBhbmQgY3JlYXRlZCBiZWZvcmVoYW5kLlxyXG4gKiBcclxuICogV2hlbiBhIHN0YXRlIGlzIGNoYW5nZWQsIGFuIHVwZGF0ZSBldmVudCBpcyBzZW50IG91dCBjb250YWluaW5nIHRoZSBuYW1lIG9mIHRoZSBzdGF0ZVxyXG4gKiBjaGFuZ2VkIG9yIGluIHRoZSBjYXNlIG9mIG11bHRpcGxlIGNoYW5nZXMgKC5zZXRNLCAuYWRkTSkgdGhlIHBhcmVudCBjbGFzcyBjaGFuZ2VkLlxyXG4gKiBFdmVudDogdHlwZTogJ3N0YXRlVXBkYXRlJywgc3RhdGVOYW1lOiA8cGF0aCBvZiBzdGF0ZSBvciBwYXJlbnQgc3RhdGU+XHJcbiAqIFxyXG4gKiBPcmlnaW5hbCBmaWxlIGNyZWF0ZWQgYnk6IE1pY2hhZWwgR2FsdXNoYVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyBOb3RpZmljYXRpb25zIH0gZnJvbSBcIi4vbm90aWZpY2F0aW9uc1wiO1xyXG5cclxudmFyIFN0YXRlTWFuYWdlciA9IHtcclxuXHRcdFxyXG5cdE1BWF9TVE9SRTogOTk5OTk5OTk5OTk5OTksXHJcblx0XHJcblx0b3B0aW9uczoge30sXHJcblx0XHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdFx0XHJcblx0XHQvL2NyZWF0ZSBjYXRlZ29yaWVzXHJcblx0XHR2YXIgY2F0cyA9IFtcclxuXHRcdFx0J2ZlYXR1cmVzJyxcdFx0Ly9iaWcgZmVhdHVyZXMgbGlrZSBidWlsZGluZ3MsIGxvY2F0aW9uIGF2YWlsYWJpbGl0eSwgdW5sb2NrcywgZXRjXHJcblx0XHRcdCdzdG9yZXMnLCBcdFx0Ly9saXR0bGUgc3R1ZmYsIGl0ZW1zLCB3ZWFwb25zLCBldGNcclxuXHRcdFx0J2NoYXJhY3RlcicsIFx0Ly90aGlzIGlzIGZvciBwbGF5ZXIncyBjaGFyYWN0ZXIgc3RhdHMgc3VjaCBhcyBwZXJrc1xyXG5cdFx0XHQnaW5jb21lJyxcclxuXHRcdFx0J3RpbWVycycsXHJcblx0XHRcdCdnYW1lJywgXHRcdC8vbW9zdGx5IGxvY2F0aW9uIHJlbGF0ZWQ6IGZpcmUgdGVtcCwgd29ya2VycywgcG9wdWxhdGlvbiwgd29ybGQgbWFwLCBldGNcclxuXHRcdFx0J3BsYXlTdGF0cycsXHQvL2FueXRoaW5nIHBsYXkgcmVsYXRlZDogcGxheSB0aW1lLCBsb2FkcywgZXRjXHJcblx0XHRcdCdwcmV2aW91cycsXHRcdC8vIHByZXN0aWdlLCBzY29yZSwgdHJvcGhpZXMgKGluIGZ1dHVyZSksIGFjaGlldmVtZW50cyAoYWdhaW4sIG5vdCB5ZXQpLCBldGNcclxuXHRcdFx0J291dGZpdCdcdFx0XHQvLyB1c2VkIHRvIHRlbXBvcmFyaWx5IHN0b3JlIHRoZSBpdGVtcyB0byBiZSB0YWtlbiBvbiB0aGUgcGF0aFxyXG5cdFx0XTtcclxuXHRcdFxyXG5cdFx0Zm9yKHZhciB3aGljaCBpbiBjYXRzKSB7XHJcblx0XHRcdGlmKCEkU00uZ2V0KGNhdHNbd2hpY2hdKSkgJFNNLnNldChjYXRzW3doaWNoXSwge30pOyBcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly9zdWJzY3JpYmUgdG8gc3RhdGVVcGRhdGVzXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHQkLkRpc3BhdGNoKCdzdGF0ZVVwZGF0ZScpLnN1YnNjcmliZSgkU00uaGFuZGxlU3RhdGVVcGRhdGVzKTtcclxuXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHR3aW5kb3cuJFNNID0gdGhpcztcclxuXHR9LFxyXG5cdFxyXG5cdC8vY3JlYXRlIGFsbCBwYXJlbnRzIGFuZCB0aGVuIHNldCBzdGF0ZVxyXG5cdGNyZWF0ZVN0YXRlOiBmdW5jdGlvbihzdGF0ZU5hbWUsIHZhbHVlKSB7XHJcblx0XHR2YXIgd29yZHMgPSBzdGF0ZU5hbWUuc3BsaXQoL1suXFxbXFxdJ1wiXSsvKTtcclxuXHRcdC8vZm9yIHNvbWUgcmVhc29uIHRoZXJlIGFyZSBzb21ldGltZXMgZW1wdHkgc3RyaW5nc1xyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB3b3Jkcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAod29yZHNbaV0gPT09ICcnKSB7XHJcblx0XHRcdFx0d29yZHMuc3BsaWNlKGksIDEpO1xyXG5cdFx0XHRcdGktLTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly8gSU1QT1JUQU5UOiBTdGF0ZSByZWZlcnMgdG8gd2luZG93LlN0YXRlLCB3aGljaCBJIGhhZCB0byBpbml0aWFsaXplIG1hbnVhbGx5XHJcblx0XHQvLyAgICBpbiBFbmdpbmUudHM7IHBsZWFzZSBkb24ndCBmb3JnZXQgdGhpcyBhbmQgbWVzcyB3aXRoIGFueXRoaW5nIG5hbWVkXHJcblx0XHQvLyAgICBcIlN0YXRlXCIgb3IgXCJ3aW5kb3cuU3RhdGVcIiwgdGhpcyBzdHVmZiBpcyB3ZWlyZGx5IHByZWNhcmlvdXMgYWZ0ZXIgdHlwZXNjcmlwdGluZ1xyXG5cdFx0Ly8gICAgdGhpcyBjb2RlYmFzZSwgYW5kIEkgZG9uJ3QgaGF2ZSB0aGUgc2FuaXR5IHBvaW50cyB0byBmaWd1cmUgb3V0IHdoeVxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0dmFyIG9iaiA9IFN0YXRlO1xyXG5cdFx0dmFyIHcgPSBudWxsO1xyXG5cdFx0Zm9yKHZhciBpPTAsIGxlbj13b3Jkcy5sZW5ndGgtMTtpPGxlbjtpKyspe1xyXG5cdFx0XHR3ID0gd29yZHNbaV07XHJcblx0XHRcdGlmKG9ialt3XSA9PT0gdW5kZWZpbmVkICkgb2JqW3ddID0ge307XHJcblx0XHRcdG9iaiA9IG9ialt3XTtcclxuXHRcdH1cclxuXHRcdG9ialt3b3Jkc1tpXV0gPSB2YWx1ZTtcclxuXHRcdHJldHVybiBvYmo7XHJcblx0fSxcclxuXHRcclxuXHQvL3NldCBzaW5nbGUgc3RhdGVcclxuXHQvL2lmIG5vRXZlbnQgaXMgdHJ1ZSwgdGhlIHVwZGF0ZSBldmVudCB3b24ndCB0cmlnZ2VyLCB1c2VmdWwgZm9yIHNldHRpbmcgbXVsdGlwbGUgc3RhdGVzIGZpcnN0XHJcblx0c2V0OiBmdW5jdGlvbihzdGF0ZU5hbWUsIHZhbHVlLCBub0V2ZW50Pykge1xyXG5cdFx0dmFyIGZ1bGxQYXRoID0gJFNNLmJ1aWxkUGF0aChzdGF0ZU5hbWUpO1xyXG5cdFx0XHJcblx0XHQvL21ha2Ugc3VyZSB0aGUgdmFsdWUgaXNuJ3Qgb3ZlciB0aGUgZW5naW5lIG1heGltdW1cclxuXHRcdGlmKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJiB2YWx1ZSA+ICRTTS5NQVhfU1RPUkUpIHZhbHVlID0gJFNNLk1BWF9TVE9SRTtcclxuXHRcdFxyXG5cdFx0dHJ5e1xyXG5cdFx0XHRldmFsKCcoJytmdWxsUGF0aCsnKSA9IHZhbHVlJyk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdC8vcGFyZW50IGRvZXNuJ3QgZXhpc3QsIHNvIG1ha2UgcGFyZW50XHJcblx0XHRcdCRTTS5jcmVhdGVTdGF0ZShzdGF0ZU5hbWUsIHZhbHVlKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly9zdG9yZXMgdmFsdWVzIGNhbiBub3QgYmUgbmVnYXRpdmVcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdGlmKHN0YXRlTmFtZS5pbmRleE9mKCdzdG9yZXMnKSA9PT0gMCAmJiAkU00uZ2V0KHN0YXRlTmFtZSwgdHJ1ZSkgPCAwKSB7XHJcblx0XHRcdGV2YWwoJygnK2Z1bGxQYXRoKycpID0gMCcpO1xyXG5cdFx0XHRFbmdpbmUubG9nKCdXQVJOSU5HOiBzdGF0ZTonICsgc3RhdGVOYW1lICsgJyBjYW4gbm90IGJlIGEgbmVnYXRpdmUgdmFsdWUuIFNldCB0byAwIGluc3RlYWQuJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0RW5naW5lLmxvZyhzdGF0ZU5hbWUgKyAnICcgKyB2YWx1ZSk7XHJcblx0XHRcclxuXHRcdGlmKCFub0V2ZW50KSB7XHJcblx0XHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0XHQkU00uZmlyZVVwZGF0ZShzdGF0ZU5hbWUpO1xyXG5cdFx0fVx0XHRcclxuXHR9LFxyXG5cdFxyXG5cdC8vc2V0cyBhIGxpc3Qgb2Ygc3RhdGVzXHJcblx0c2V0TTogZnVuY3Rpb24ocGFyZW50TmFtZSwgbGlzdCwgbm9FdmVudD8pIHtcclxuXHRcdCRTTS5idWlsZFBhdGgocGFyZW50TmFtZSk7XHJcblx0XHRcclxuXHRcdC8vbWFrZSBzdXJlIHRoZSBzdGF0ZSBleGlzdHMgdG8gYXZvaWQgZXJyb3JzLFxyXG5cdFx0aWYoJFNNLmdldChwYXJlbnROYW1lKSA9PT0gdW5kZWZpbmVkKSAkU00uc2V0KHBhcmVudE5hbWUsIHt9LCB0cnVlKTtcclxuXHRcdFxyXG5cdFx0Zm9yKHZhciBrIGluIGxpc3Qpe1xyXG5cdFx0XHQkU00uc2V0KHBhcmVudE5hbWUrJ1tcIicraysnXCJdJywgbGlzdFtrXSwgdHJ1ZSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmKCFub0V2ZW50KSB7XHJcblx0XHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0XHQkU00uZmlyZVVwZGF0ZShwYXJlbnROYW1lKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdC8vc2hvcnRjdXQgZm9yIGFsdGVyaW5nIG51bWJlciB2YWx1ZXMsIHJldHVybiAxIGlmIHN0YXRlIHdhc24ndCBhIG51bWJlclxyXG5cdGFkZDogZnVuY3Rpb24oc3RhdGVOYW1lLCB2YWx1ZSwgbm9FdmVudD8pIHtcclxuXHRcdHZhciBlcnIgPSAwO1xyXG5cdFx0Ly8wIGlmIHVuZGVmaW5lZCwgbnVsbCAoYnV0IG5vdCB7fSkgc2hvdWxkIGFsbG93IGFkZGluZyB0byBuZXcgb2JqZWN0c1xyXG5cdFx0Ly9jb3VsZCBhbHNvIGFkZCBpbiBhIHRydWUgPSAxIHRoaW5nLCB0byBoYXZlIHNvbWV0aGluZyBnbyBmcm9tIGV4aXN0aW5nICh0cnVlKVxyXG5cdFx0Ly90byBiZSBhIGNvdW50LCBidXQgdGhhdCBtaWdodCBiZSB1bndhbnRlZCBiZWhhdmlvciAoYWRkIHdpdGggbG9vc2UgZXZhbCBwcm9iYWJseSB3aWxsIGhhcHBlbiBhbnl3YXlzKVxyXG5cdFx0dmFyIG9sZCA9ICRTTS5nZXQoc3RhdGVOYW1lLCB0cnVlKTtcclxuXHRcdFxyXG5cdFx0Ly9jaGVjayBmb3IgTmFOIChvbGQgIT0gb2xkKSBhbmQgbm9uIG51bWJlciB2YWx1ZXNcclxuXHRcdGlmKG9sZCAhPSBvbGQpe1xyXG5cdFx0XHRFbmdpbmUubG9nKCdXQVJOSU5HOiAnK3N0YXRlTmFtZSsnIHdhcyBjb3JydXB0ZWQgKE5hTikuIFJlc2V0dGluZyB0byAwLicpO1xyXG5cdFx0XHRvbGQgPSAwO1xyXG5cdFx0XHQkU00uc2V0KHN0YXRlTmFtZSwgb2xkICsgdmFsdWUsIG5vRXZlbnQpO1xyXG5cdFx0fSBlbHNlIGlmKHR5cGVvZiBvbGQgIT0gJ251bWJlcicgfHwgdHlwZW9mIHZhbHVlICE9ICdudW1iZXInKXtcclxuXHRcdFx0RW5naW5lLmxvZygnV0FSTklORzogQ2FuIG5vdCBkbyBtYXRoIHdpdGggc3RhdGU6JytzdGF0ZU5hbWUrJyBvciB2YWx1ZTonK3ZhbHVlKycgYmVjYXVzZSBhdCBsZWFzdCBvbmUgaXMgbm90IGEgbnVtYmVyLicpO1xyXG5cdFx0XHRlcnIgPSAxO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JFNNLnNldChzdGF0ZU5hbWUsIG9sZCArIHZhbHVlLCBub0V2ZW50KTsgLy9zZXRTdGF0ZSBoYW5kbGVzIGV2ZW50IGFuZCBzYXZlXHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBlcnI7XHJcblx0fSxcclxuXHRcclxuXHQvL2FsdGVycyBtdWx0aXBsZSBudW1iZXIgdmFsdWVzLCByZXR1cm4gbnVtYmVyIG9mIGZhaWxzXHJcblx0YWRkTTogZnVuY3Rpb24ocGFyZW50TmFtZSwgbGlzdCwgbm9FdmVudD8pIHtcclxuXHRcdHZhciBlcnIgPSAwO1xyXG5cdFx0XHJcblx0XHQvL21ha2Ugc3VyZSB0aGUgcGFyZW50IGV4aXN0cyB0byBhdm9pZCBlcnJvcnNcclxuXHRcdGlmKCRTTS5nZXQocGFyZW50TmFtZSkgPT09IHVuZGVmaW5lZCkgJFNNLnNldChwYXJlbnROYW1lLCB7fSwgdHJ1ZSk7XHJcblx0XHRcclxuXHRcdGZvcih2YXIgayBpbiBsaXN0KXtcclxuXHRcdFx0aWYoJFNNLmFkZChwYXJlbnROYW1lKydbXCInK2srJ1wiXScsIGxpc3Rba10sIHRydWUpKSBlcnIrKztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYoIW5vRXZlbnQpIHtcclxuXHRcdFx0RW5naW5lLnNhdmVHYW1lKCk7XHJcblx0XHRcdCRTTS5maXJlVXBkYXRlKHBhcmVudE5hbWUpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGVycjtcclxuXHR9LFxyXG5cdFxyXG5cdC8vcmV0dXJuIHN0YXRlLCB1bmRlZmluZWQgb3IgMFxyXG5cdGdldDogZnVuY3Rpb24oc3RhdGVOYW1lLCByZXF1ZXN0WmVybz8pOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBOdW1iZXIgfCBudWxsIHwgQm9vbGVhbiB7XHJcblx0XHR2YXIgd2hpY2hTdGF0ZTogdW5kZWZpbmVkIHwgbnVsbCB8IE51bWJlciB8IHN0cmluZyA9IG51bGw7XHJcblx0XHR2YXIgZnVsbFBhdGggPSAkU00uYnVpbGRQYXRoKHN0YXRlTmFtZSk7XHJcblx0XHRcclxuXHRcdC8vY2F0Y2ggZXJyb3JzIGlmIHBhcmVudCBvZiBzdGF0ZSBkb2Vzbid0IGV4aXN0XHJcblx0XHR0cnl7XHJcblx0XHRcdGV2YWwoJ3doaWNoU3RhdGUgPSAoJytmdWxsUGF0aCsnKScpO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHR3aGljaFN0YXRlID0gdW5kZWZpbmVkO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvL3ByZXZlbnRzIHJlcGVhdGVkIGlmIHVuZGVmaW5lZCwgbnVsbCwgZmFsc2Ugb3Ige30sIHRoZW4geCA9IDAgc2l0dWF0aW9uc1xyXG5cdFx0aWYoKCF3aGljaFN0YXRlXHJcblx0XHRcdC8vICB8fCB3aGljaFN0YXRlID09IHt9XHJcblx0XHRcdCkgJiYgcmVxdWVzdFplcm8pIHJldHVybiAwO1xyXG5cdFx0ZWxzZSByZXR1cm4gd2hpY2hTdGF0ZTtcclxuXHR9LFxyXG5cdFxyXG5cdC8vbWFpbmx5IGZvciBsb2NhbCBjb3B5IHVzZSwgYWRkKE0pIGNhbiBmYWlsIHNvIHdlIGNhbid0IHNob3J0Y3V0IHRoZW1cclxuXHQvL3NpbmNlIHNldCBkb2VzIG5vdCBmYWlsLCB3ZSBrbm93IHN0YXRlIGV4aXN0cyBhbmQgY2FuIHNpbXBseSByZXR1cm4gdGhlIG9iamVjdFxyXG5cdHNldGdldDogZnVuY3Rpb24oc3RhdGVOYW1lLCB2YWx1ZSwgbm9FdmVudD8pe1xyXG5cdFx0JFNNLnNldChzdGF0ZU5hbWUsIHZhbHVlLCBub0V2ZW50KTtcclxuXHRcdHJldHVybiBldmFsKCcoJyskU00uYnVpbGRQYXRoKHN0YXRlTmFtZSkrJyknKTtcclxuXHR9LFxyXG5cdFxyXG5cdHJlbW92ZTogZnVuY3Rpb24oc3RhdGVOYW1lLCBub0V2ZW50Pykge1xyXG5cdFx0dmFyIHdoaWNoU3RhdGUgPSAkU00uYnVpbGRQYXRoKHN0YXRlTmFtZSk7XHJcblx0XHR0cnl7XHJcblx0XHRcdGV2YWwoJyhkZWxldGUgJyt3aGljaFN0YXRlKycpJyk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdC8vaXQgZGlkbid0IGV4aXN0IGluIHRoZSBmaXJzdCBwbGFjZVxyXG5cdFx0XHRFbmdpbmUubG9nKCdXQVJOSU5HOiBUcmllZCB0byByZW1vdmUgbm9uLWV4aXN0YW50IHN0YXRlIFxcJycrc3RhdGVOYW1lKydcXCcuJyk7XHJcblx0XHR9XHJcblx0XHRpZighbm9FdmVudCl7XHJcblx0XHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0XHQkU00uZmlyZVVwZGF0ZShzdGF0ZU5hbWUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0Ly9jcmVhdGVzIGZ1bGwgcmVmZXJlbmNlIGZyb20gaW5wdXRcclxuXHQvL2hvcGVmdWxseSB0aGlzIHdvbid0IGV2ZXIgbmVlZCB0byBiZSBtb3JlIGNvbXBsaWNhdGVkXHJcblx0YnVpbGRQYXRoOiBmdW5jdGlvbihpbnB1dCl7XHJcblx0XHR2YXIgZG90ID0gKGlucHV0LmNoYXJBdCgwKSA9PSAnWycpPyAnJyA6ICcuJzsgLy9pZiBpdCBzdGFydHMgd2l0aCBbZm9vXSBubyBkb3QgdG8gam9pblxyXG5cdFx0cmV0dXJuICdTdGF0ZScgKyBkb3QgKyBpbnB1dDtcclxuXHR9LFxyXG5cdFxyXG5cdGZpcmVVcGRhdGU6IGZ1bmN0aW9uKHN0YXRlTmFtZSwgc2F2ZT8pe1xyXG5cdFx0dmFyIGNhdGVnb3J5ID0gJFNNLmdldENhdGVnb3J5KHN0YXRlTmFtZSk7XHJcblx0XHRpZihzdGF0ZU5hbWUgPT0gdW5kZWZpbmVkKSBzdGF0ZU5hbWUgPSBjYXRlZ29yeSA9ICdhbGwnOyAvL2Jlc3QgaWYgdGhpcyBkb2Vzbid0IGhhcHBlbiBhcyBpdCB3aWxsIHRyaWdnZXIgbW9yZSBzdHVmZlxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5wdWJsaXNoKHsnY2F0ZWdvcnknOiBjYXRlZ29yeSwgJ3N0YXRlTmFtZSc6c3RhdGVOYW1lfSk7XHJcblx0XHRpZihzYXZlKSBFbmdpbmUuc2F2ZUdhbWUoKTtcclxuXHR9LFxyXG5cdFxyXG5cdGdldENhdGVnb3J5OiBmdW5jdGlvbihzdGF0ZU5hbWUpe1xyXG5cdFx0dmFyIGZpcnN0T0IgPSBzdGF0ZU5hbWUuaW5kZXhPZignWycpO1xyXG5cdFx0dmFyIGZpcnN0RG90ID0gc3RhdGVOYW1lLmluZGV4T2YoJy4nKTtcclxuXHRcdHZhciBjdXRvZmYgPSBudWxsO1xyXG5cdFx0aWYoZmlyc3RPQiA9PSAtMSB8fCBmaXJzdERvdCA9PSAtMSl7XHJcblx0XHRcdGN1dG9mZiA9IGZpcnN0T0IgPiBmaXJzdERvdCA/IGZpcnN0T0IgOiBmaXJzdERvdDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGN1dG9mZiA9IGZpcnN0T0IgPCBmaXJzdERvdCA/IGZpcnN0T0IgOiBmaXJzdERvdDtcclxuXHRcdH1cclxuXHRcdGlmIChjdXRvZmYgPT0gLTEpe1xyXG5cdFx0XHRyZXR1cm4gc3RhdGVOYW1lO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHN0YXRlTmFtZS5zdWJzdHIoMCxjdXRvZmYpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cdCAqIFN0YXJ0IG9mIHNwZWNpZmljIHN0YXRlIGZ1bmN0aW9uc1xyXG5cdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblx0Ly9QRVJLU1xyXG5cdGFkZFBlcms6IGZ1bmN0aW9uKG5hbWUpIHtcclxuXHRcdCRTTS5zZXQoJ2NoYXJhY3Rlci5wZXJrc1tcIicrbmFtZSsnXCJdJywgdHJ1ZSk7XHJcblx0XHROb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBFbmdpbmUuUGVya3NbbmFtZV0ubm90aWZ5KTtcclxuXHR9LFxyXG5cdFxyXG5cdGhhc1Blcms6IGZ1bmN0aW9uKG5hbWUpIHtcclxuXHRcdHJldHVybiAkU00uZ2V0KCdjaGFyYWN0ZXIucGVya3NbXCInK25hbWUrJ1wiXScpO1xyXG5cdH0sXHJcblx0XHJcblx0Ly9JTkNPTUVcclxuXHRzZXRJbmNvbWU6IGZ1bmN0aW9uKHNvdXJjZSwgb3B0aW9ucykge1xyXG5cdFx0dmFyIGV4aXN0aW5nID0gJFNNLmdldCgnaW5jb21lW1wiJytzb3VyY2UrJ1wiXScpO1xyXG5cdFx0aWYodHlwZW9mIGV4aXN0aW5nICE9ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdG9wdGlvbnMudGltZUxlZnQgPSAoZXhpc3RpbmcgYXMgYW55KT8udGltZUxlZnQ7XHJcblx0XHR9XHJcblx0XHQkU00uc2V0KCdpbmNvbWVbXCInK3NvdXJjZSsnXCJdJywgb3B0aW9ucyk7XHJcblx0fSxcclxuXHRcclxuXHRnZXRJbmNvbWU6IGZ1bmN0aW9uKHNvdXJjZSkge1xyXG5cdFx0dmFyIGV4aXN0aW5nID0gJFNNLmdldCgnaW5jb21lW1wiJytzb3VyY2UrJ1wiXScpO1xyXG5cdFx0aWYodHlwZW9mIGV4aXN0aW5nICE9ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdHJldHVybiBleGlzdGluZztcclxuXHRcdH1cclxuXHRcdHJldHVybiB7fTtcclxuXHR9LFx0XHJcblx0XHJcblx0Ly9NaXNjXHJcblx0bnVtOiBmdW5jdGlvbihuYW1lLCBjcmFmdGFibGUpIHtcclxuXHRcdHN3aXRjaChjcmFmdGFibGUudHlwZSkge1xyXG5cdFx0Y2FzZSAnZ29vZCc6XHJcblx0XHRjYXNlICd0b29sJzpcclxuXHRcdGNhc2UgJ3dlYXBvbic6XHJcblx0XHRjYXNlICd1cGdyYWRlJzpcclxuXHRcdFx0cmV0dXJuICRTTS5nZXQoJ3N0b3Jlc1tcIicrbmFtZSsnXCJdJywgdHJ1ZSk7XHJcblx0XHRjYXNlICdidWlsZGluZyc6XHJcblx0XHRcdHJldHVybiAkU00uZ2V0KCdnYW1lLmJ1aWxkaW5nc1tcIicrbmFtZSsnXCJdJywgdHJ1ZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRoYW5kbGVTdGF0ZVVwZGF0ZXM6IGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHJcblx0fVx0XHJcbn07XHJcblxyXG4vL2FsaWFzXHJcbmV4cG9ydCBjb25zdCAkU00gPSBTdGF0ZU1hbmFnZXI7XHJcbiIsImltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tICcuL25vdGlmaWNhdGlvbnMnO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tICcuL3N0YXRlX21hbmFnZXInO1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tICcuL2VuZ2luZSc7XHJcblxyXG5leHBvcnQgY29uc3QgV2VhdGhlciA9IHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHJcbiAgICAgICAgLy9zdWJzY3JpYmUgdG8gc3RhdGVVcGRhdGVzXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5zdWJzY3JpYmUoV2VhdGhlci5oYW5kbGVTdGF0ZVVwZGF0ZXMpO1xyXG4gICAgfSxcclxuXHJcbiAgICBoYW5kbGVTdGF0ZVVwZGF0ZXM6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBpZiAoZS5jYXRlZ29yeSA9PSAnd2VhdGhlcicpIHtcclxuICAgICAgICAgICAgc3dpdGNoICgkU00uZ2V0KCd3ZWF0aGVyJykpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3N1bm55JzogXHJcbiAgICAgICAgICAgICAgICAgICAgV2VhdGhlci5zdGFydFN1bm55KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdjbG91ZHknOlxyXG4gICAgICAgICAgICAgICAgICAgIFdlYXRoZXIuc3RhcnRDbG91ZHkoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3JhaW55JzpcclxuICAgICAgICAgICAgICAgICAgICBXZWF0aGVyLnN0YXJ0UmFpbnkoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9sYXN0V2VhdGhlcjogJ3N1bm55JyxcclxuXHJcbiAgICBzdGFydFN1bm55OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIlRoZSBzdW4gYmVnaW5zIHRvIHNoaW5lLlwiKTtcclxuICAgICAgICBXZWF0aGVyLl9sYXN0V2VhdGhlciA9ICdzdW5ueSc7XHJcbiAgICAgICAgJCgnYm9keScpLmFuaW1hdGUoe2JhY2tncm91bmRDb2xvcjogJyNGRkZGRkYnfSwgJ3Nsb3cnKTtcclxuICAgICAgICAkKCdkaXYjc3RvcmVzOjpiZWZvcmUnKS5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6ICcjRkZGRkZGJ30sICdzbG93Jyk7XHJcbiAgICAgICAgV2VhdGhlci5tYWtlUmFpblN0b3AoKTtcclxuICAgIH0sXHJcblxyXG4gICAgc3RhcnRDbG91ZHk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmIChXZWF0aGVyLl9sYXN0V2VhdGhlciA9PSAnc3VubnknKSB7XHJcbiAgICAgICAgICAgIE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiQ2xvdWRzIHJvbGwgaW4sIG9ic2N1cmluZyB0aGUgc3VuLlwiKTtcclxuICAgICAgICB9IGVsc2UgaWYgKFdlYXRoZXIuX2xhc3RXZWF0aGVyID09ICdyYWlueScpIHtcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJUaGUgcmFpbiBicmVha3MsIGJ1dCB0aGUgY2xvdWRzIHJlbWFpbi5cIilcclxuICAgICAgICB9XHJcbiAgICAgICAgJCgnYm9keScpLmFuaW1hdGUoe2JhY2tncm91bmRDb2xvcjogJyM4Qjg3ODYnfSwgJ3Nsb3cnKTtcclxuICAgICAgICAkKCdkaXYjc3RvcmVzOjpiZWZvcmUnKS5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6ICcjOEI4Nzg2J30sICdzbG93Jyk7XHJcbiAgICAgICAgV2VhdGhlci5fbGFzdFdlYXRoZXIgPSAnY2xvdWR5JztcclxuICAgICAgICBXZWF0aGVyLm1ha2VSYWluU3RvcCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzdGFydFJhaW55OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoV2VhdGhlci5fbGFzdFdlYXRoZXIgPT0gJ3N1bm55Jykge1xyXG4gICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIlRoZSB3aW5kIHN1ZGRlbmx5IHBpY2tzIHVwLiBDbG91ZHMgcm9sbCBpbiwgaGVhdnkgd2l0aCByYWluLCBhbmQgcmFpbmRyb3BzIGZhbGwgc29vbiBhZnRlci5cIik7XHJcbiAgICAgICAgfSBlbHNlIGlmIChXZWF0aGVyLl9sYXN0V2VhdGhlciA9PSAnY2xvdWR5Jykge1xyXG4gICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIlRoZSBjbG91ZHMgdGhhdCB3ZXJlIHByZXZpb3VzbHkgY29udGVudCB0byBoYW5nIG92ZXJoZWFkIGxldCBsb29zZSBhIG1vZGVyYXRlIGRvd25wb3VyLlwiKVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAkKCdib2R5JykuYW5pbWF0ZSh7YmFja2dyb3VuZENvbG9yOiAnIzZENjk2OCd9LCAnc2xvdycpO1xyXG4gICAgICAgICQoJ2RpdiNzdG9yZXM6OmJlZm9yZScpLmFuaW1hdGUoe2JhY2tncm91bmRDb2xvcjogJyM2RDY5NjgnfSwgJ3Nsb3cnKTtcclxuICAgICAgICBXZWF0aGVyLl9sYXN0V2VhdGhlciA9ICdyYWlueSc7XHJcbiAgICAgICAgV2VhdGhlci5tYWtlSXRSYWluKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIF9sb2NhdGlvbjogJycsXHJcblxyXG4gICAgaW5pdGlhdGVXZWF0aGVyOiBmdW5jdGlvbihhdmFpbGFibGVXZWF0aGVyLCBsb2NhdGlvbikge1xyXG4gICAgICAgIGlmIChXZWF0aGVyLl9sb2NhdGlvbiA9PSAnJykgV2VhdGhlci5fbG9jYXRpb24gPSBsb2NhdGlvbjtcclxuICAgICAgICAvLyBpZiBpbiBuZXcgbG9jYXRpb24sIGVuZCB3aXRob3V0IHRyaWdnZXJpbmcgYSBuZXcgd2VhdGhlciBpbml0aWF0aW9uLCBcclxuICAgICAgICAvLyBsZWF2aW5nIHRoZSBuZXcgbG9jYXRpb24ncyBpbml0aWF0ZVdlYXRoZXIgY2FsbGJhY2sgdG8gZG8gaXRzIHRoaW5nXHJcbiAgICAgICAgZWxzZSBpZiAoV2VhdGhlci5fbG9jYXRpb24gIT0gbG9jYXRpb24pIHJldHVybjsgXHJcblxyXG4gICAgICAgIHZhciBjaG9zZW5XZWF0aGVyID0gJ25vbmUnO1xyXG4gICAgICAgIC8vZ2V0IG91ciByYW5kb20gZnJvbSAwIHRvIDFcclxuICAgICAgICB2YXIgcm5kID0gTWF0aC5yYW5kb20oKTtcclxuICBcclxuICAgICAgICAvL2luaXRpYWxpc2Ugb3VyIGN1bXVsYXRpdmUgcGVyY2VudGFnZVxyXG4gICAgICAgIHZhciBjdW11bGF0aXZlQ2hhbmNlID0gMDtcclxuICAgICAgICBmb3IgKHZhciBpIGluIGF2YWlsYWJsZVdlYXRoZXIpIHtcclxuICAgICAgICAgICAgY3VtdWxhdGl2ZUNoYW5jZSArPSBhdmFpbGFibGVXZWF0aGVyW2ldO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHJuZCA8IGN1bXVsYXRpdmVDaGFuY2UpIHtcclxuICAgICAgICAgICAgICAgIGNob3NlbldlYXRoZXIgPSBpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjaG9zZW5XZWF0aGVyICE9ICRTTS5nZXQoJ3dlYXRoZXInKSkgJFNNLnNldCgnd2VhdGhlcicsIGNob3NlbldlYXRoZXIpO1xyXG4gICAgICAgIEVuZ2luZS5zZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pbml0aWF0ZVdlYXRoZXIoYXZhaWxhYmxlV2VhdGhlciwgbG9jYXRpb24pO1xyXG4gICAgICAgIH0sIDMgKiA2MCAqIDEwMDApO1xyXG4gICAgfSxcclxuXHJcbiAgICBtYWtlSXRSYWluOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBodHRwczovL2NvZGVwZW4uaW8vYXJpY2tsZS9wZW4vWEtqTVpZXHJcbiAgICAgICAgLy9jbGVhciBvdXQgZXZlcnl0aGluZ1xyXG4gICAgICAgICQoJy5yYWluJykuZW1wdHkoKTtcclxuICAgICAgXHJcbiAgICAgICAgdmFyIGluY3JlbWVudCA9IDA7XHJcbiAgICAgICAgdmFyIGRyb3BzID0gXCJcIjtcclxuICAgICAgICB2YXIgYmFja0Ryb3BzID0gXCJcIjtcclxuICAgICAgXHJcbiAgICAgICAgd2hpbGUgKGluY3JlbWVudCA8IDEwMCkge1xyXG4gICAgICAgICAgLy9jb3VwbGUgcmFuZG9tIG51bWJlcnMgdG8gdXNlIGZvciB2YXJpb3VzIHJhbmRvbWl6YXRpb25zXHJcbiAgICAgICAgICAvL3JhbmRvbSBudW1iZXIgYmV0d2VlbiA5OCBhbmQgMVxyXG4gICAgICAgICAgdmFyIHJhbmRvSHVuZG8gPSAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDk4IC0gMSArIDEpICsgMSkpO1xyXG4gICAgICAgICAgLy9yYW5kb20gbnVtYmVyIGJldHdlZW4gNSBhbmQgMlxyXG4gICAgICAgICAgdmFyIHJhbmRvRml2ZXIgPSAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDUgLSAyICsgMSkgKyAyKSk7XHJcbiAgICAgICAgICAvL2luY3JlbWVudFxyXG4gICAgICAgICAgaW5jcmVtZW50ICs9IHJhbmRvRml2ZXI7XHJcbiAgICAgICAgICAvL2FkZCBpbiBhIG5ldyByYWluZHJvcCB3aXRoIHZhcmlvdXMgcmFuZG9taXphdGlvbnMgdG8gY2VydGFpbiBDU1MgcHJvcGVydGllc1xyXG4gICAgICAgICAgZHJvcHMgKz0gJzxkaXYgY2xhc3M9XCJkcm9wXCIgc3R5bGU9XCJsZWZ0OiAnICsgaW5jcmVtZW50ICsgJyU7IGJvdHRvbTogJyArIChyYW5kb0ZpdmVyICsgcmFuZG9GaXZlciAtIDEgKyAxMDApICsgJyU7IGFuaW1hdGlvbi1kZWxheTogMC4nICsgcmFuZG9IdW5kbyArICdzOyBhbmltYXRpb24tZHVyYXRpb246IDAuNScgKyByYW5kb0h1bmRvICsgJ3M7XCI+PGRpdiBjbGFzcz1cInN0ZW1cIiBzdHlsZT1cImFuaW1hdGlvbi1kZWxheTogMC4nICsgcmFuZG9IdW5kbyArICdzOyBhbmltYXRpb24tZHVyYXRpb246IDAuNScgKyByYW5kb0h1bmRvICsgJ3M7XCI+PC9kaXY+PGRpdiBjbGFzcz1cInNwbGF0XCIgc3R5bGU9XCJhbmltYXRpb24tZGVsYXk6IDAuJyArIHJhbmRvSHVuZG8gKyAnczsgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjUnICsgcmFuZG9IdW5kbyArICdzO1wiPjwvZGl2PjwvZGl2Pic7XHJcbiAgICAgICAgICBiYWNrRHJvcHMgKz0gJzxkaXYgY2xhc3M9XCJkcm9wXCIgc3R5bGU9XCJyaWdodDogJyArIGluY3JlbWVudCArICclOyBib3R0b206ICcgKyAocmFuZG9GaXZlciArIHJhbmRvRml2ZXIgLSAxICsgMTAwKSArICclOyBhbmltYXRpb24tZGVsYXk6IDAuJyArIHJhbmRvSHVuZG8gKyAnczsgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjUnICsgcmFuZG9IdW5kbyArICdzO1wiPjxkaXYgY2xhc3M9XCJzdGVtXCIgc3R5bGU9XCJhbmltYXRpb24tZGVsYXk6IDAuJyArIHJhbmRvSHVuZG8gKyAnczsgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjUnICsgcmFuZG9IdW5kbyArICdzO1wiPjwvZGl2PjxkaXYgY2xhc3M9XCJzcGxhdFwiIHN0eWxlPVwiYW5pbWF0aW9uLWRlbGF5OiAwLicgKyByYW5kb0h1bmRvICsgJ3M7IGFuaW1hdGlvbi1kdXJhdGlvbjogMC41JyArIHJhbmRvSHVuZG8gKyAncztcIj48L2Rpdj48L2Rpdj4nO1xyXG4gICAgICAgIH1cclxuICAgICAgXHJcbiAgICAgICAgJCgnLnJhaW4uZnJvbnQtcm93JykuYXBwZW5kKGRyb3BzKTtcclxuICAgICAgICAkKCcucmFpbi5iYWNrLXJvdycpLmFwcGVuZChiYWNrRHJvcHMpO1xyXG4gICAgfSxcclxuXHJcbiAgICBtYWtlUmFpblN0b3A6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQoJy5yYWluJykuZW1wdHkoKTtcclxuICAgIH1cclxufSJdfQ==
