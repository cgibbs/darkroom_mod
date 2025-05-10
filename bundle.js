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
        if (options.image !== undefined) {
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
                'askAboutSupplies': {
                    text: [
                        (0, translate_1._)('The Captain\'s eyes gleam with a mixture of realization and guilt.'),
                        (0, translate_1._)('"Ahh, yes, right, the supplies. I suppose the Mayor is still waiting for those. Have a look in that chest over there, it should have everything you need."'),
                        (0, translate_1._)('He indicates to a chest at the back of the room. You open the lid, revealing the supplies within.'),
                        (0, translate_1._)('You take the supplies.')
                    ],
                    buttons: {
                        'okay': {
                            text: (0, translate_1._)('Good Stuff'),
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
var village_1 = require("../places/village");
var character_1 = require("../player/character");
exports.Liz = {
    setLizActive: function () {
        state_manager_1.$SM.set('village.lizActive', 1);
        state_manager_1.$SM.set('village.liz.canFindBook', 0);
        state_manager_1.$SM.set('village.liz.hasBook', 1);
        village_1.Village.updateButton();
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

},{"../../lib/translate":1,"../events":7,"../places/village":14,"../player/character":15,"../state_manager":18}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mayor = void 0;
var events_1 = require("../events");
var state_manager_1 = require("../state_manager");
var translate_1 = require("../../lib/translate");
var liz_1 = require("./liz");
var road_1 = require("../places/road");
var character_1 = require("../player/character");
var village_1 = require("../places/village");
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
                                return (character_1.Character.questStatus["mayorSupplies"] === undefined);
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
                                return (state_manager_1.$SM.get('village.mayor.haveGivenSupplies') === undefined)
                                    && (character_1.Character.questStatus["mayorSupplies"] !== undefined)
                                    && character_1.Character.inventory["Captain.supplies"];
                            },
                            visible: function () {
                                return (character_1.Character.questStatus["mayorSupplies"] !== undefined);
                            },
                            onChoose: function () {
                                character_1.Character.removeFromInventory("Captain.supplies");
                                state_manager_1.$SM.set('village.mayor.haveGivenSupplies', 1);
                                character_1.Character.checkQuestStatus("mayorSupplies");
                                village_1.Village.updateButton();
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
        if (character_1.Character.questStatus["mayorSupplies"] === undefined) {
            character_1.Character.setQuestStatus("mayorSupplies", 0);
            road_1.Road.init();
        }
    }
};

},{"../../lib/translate":1,"../events":7,"../places/road":13,"../places/village":14,"../player/character":15,"../state_manager":18,"./liz":4}],6:[function(require,module,exports){
"use strict";
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = void 0;
var translate_1 = require("../lib/translate");
var state_manager_1 = require("./state_manager");
var notifications_1 = require("./notifications");
var events_1 = require("./events");
var village_1 = require("./places/village");
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
        // subscribe to stateUpdates
        $.Dispatch('stateUpdate').subscribe(exports.Engine.handleStateUpdates);
        state_manager_1.$SM.init();
        notifications_1.Notifications.init();
        events_1.Events.init();
        village_1.Village.init();
        character_1.Character.init();
        weather_1.Weather.init();
        if (state_manager_1.$SM.get('road.open')) {
            road_1.Road.init();
        }
        if (state_manager_1.$SM.get('outpost.open')) {
            outpost_1.Outpost.init();
        }
        exports.Engine.saveLanguage();
        exports.Engine.travelTo(village_1.Village);
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
            if (exports.Engine.activeModule == village_1.Village
            //  || Engine.activeModule == Path
            ) {
                // Don't fade out the weapons if we're switching to a module
                // where we're going to keep showing them anyway.
                if (module != village_1.Village
                // && module != Path
                ) {
                    $('div#weapons').animate({ opacity: 0 }, 300);
                }
            }
            if (module == village_1.Village
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

},{"../lib/translate":1,"./events":7,"./notifications":11,"./places/outpost":12,"./places/road":13,"./places/village":14,"./player/character":15,"./state_manager":18,"./weather":19}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
/**
 * Module that handles the random event system
 */
var roadwander_1 = require("./events/roadwander");
var village_1 = require("./events/village");
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
        exports.Events.EventPool = [].concat(village_1.EventsVillage, roadwander_1.EventsRoadWander);
        this.Locations["Village"] = village_1.EventsVillage;
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

},{"../lib/translate":1,"./Button":2,"./engine":6,"./events/roadwander":8,"./events/village":9,"./notifications":11,"./state_manager":18}],8:[function(require,module,exports){
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
                && (state_manager_1.$SM.get('superlikely.outpostUnlock') == undefined
                    || state_manager_1.$SM.get('superlikely.outpostUnlock') < 1) // can't happen twice
            );
        },
        isSuperLikely: function () {
            return (((state_manager_1.$SM.get('superlikely.outpostUnlock') === undefined)
                || state_manager_1.$SM.get('superlikely.outpostUnlock') < 1))
                && (state_manager_1.$SM.get('Road.counter') > 10);
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
exports.EventsVillage = void 0;
/**
 * Events that can occur when the Village module is active
 **/
var engine_1 = require("../engine");
var state_manager_1 = require("../state_manager");
var village_1 = require("../places/village");
var translate_1 = require("../../lib/translate");
exports.EventsVillage = [
    {
        title: (0, translate_1._)('The Nomad'),
        isAvailable: function () {
            return engine_1.Engine.activeModule == village_1.Village && state_manager_1.$SM.get('stores.fur', true) > 0;
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
            return engine_1.Engine.activeModule == village_1.Village && state_manager_1.$SM.get('stores.wood');
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
            return engine_1.Engine.activeModule == village_1.Village && state_manager_1.$SM.get('stores.fur');
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
            return engine_1.Engine.activeModule == village_1.Village && state_manager_1.$SM.get('features.location.world');
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
            return engine_1.Engine.activeModule == village_1.Village && state_manager_1.$SM.get('features.location.world');
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

},{"../../lib/translate":1,"../engine":6,"../places/village":14,"../state_manager":18}],10:[function(require,module,exports){
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
exports.Village = void 0;
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
exports.Village = {
    // times in (minutes * seconds * milliseconds)
    _FIRE_COOL_DELAY: 5 * 60 * 1000, // time after a stoke before the fire cools
    _ROOM_WARM_DELAY: 30 * 1000, // time between room temperature updates
    _BUILDER_STATE_DELAY: 0.5 * 60 * 1000, // time between builder state updates
    _STOKE_COOLDOWN: 10, // cooldown to stoke the fire
    _NEED_WOOD_DELAY: 15 * 1000, // from when the stranger shows up, to when you need wood
    buttons: {},
    changed: false,
    description: [
        (0, translate_1._)("Nestled in the woods, this village is scarcely more than a hamlet, despite you thinking those two words are synonyms. They're not, go google 'hamlet' right now if you don't believe me."),
        (0, translate_1._)("The village is quiet at the moment; there aren't enough hands for anyone to remain idle for long.")
    ],
    name: (0, translate_1._)("Village"),
    init: function (options) {
        this.options = $.extend(this.options, options);
        if (engine_1.Engine._debug) {
            this._ROOM_WARM_DELAY = 5000;
            this._BUILDER_STATE_DELAY = 5000;
            this._STOKE_COOLDOWN = 0;
            this._NEED_WOOD_DELAY = 5000;
        }
        // Create the Village tab
        this.tab = header_1.Header.addLocation((0, translate_1._)("A Chill Village"), "village", exports.Village);
        // Create the Village panel
        this.panel = $('<div>')
            .attr('id', "villagePanel")
            .addClass('location')
            .appendTo('div#locationSlider');
        engine_1.Engine.updateSlider();
        Button_1.Button.Button({
            id: 'talkButton',
            text: (0, translate_1._)('Talk to the Mayor'),
            click: mayor_1.Mayor.talkToMayor,
            width: '80px',
            cost: {}
        }).appendTo('div#villagePanel');
        Button_1.Button.Button({
            id: 'lizButton',
            text: (0, translate_1._)('Talk to Liz'),
            click: liz_1.Liz.talkToLiz,
            width: '80px',
            cost: {}
        }).appendTo('div#villagePanel');
        Button_1.Button.Button({
            id: 'newBuildingButton',
            text: (0, translate_1._)('Check out the new building'),
            click: exports.Village.tempBuildingMessage,
            width: '80px',
            cost: {}
        }).appendTo('div#villagePanel');
        var buildingButton = $('#newBuildingButton.button');
        buildingButton.hide();
        var lizButton = $('#lizButton.button');
        lizButton.hide();
        // Create the stores container
        $('<div>').attr('id', 'storesContainer').appendTo('div#villagePanel');
        //subscribe to stateUpdates
        // @ts-ignore
        $.Dispatch('stateUpdate').subscribe(exports.Village.handleStateUpdates);
        exports.Village.updateButton();
    },
    options: {}, // Nothing for now
    availableWeather: {
        'sunny': 0.4,
        'cloudy': 0.3,
        'rainy': 0.3
    },
    onArrival: function (transition_diff) {
        exports.Village.setTitle();
        if (state_manager_1.$SM.get('game.builder.level') == 3) {
            state_manager_1.$SM.add('game.builder.level', 1);
            state_manager_1.$SM.setIncome('builder', {
                delay: 10,
                stores: { 'wood': 2 }
            });
            notifications_1.Notifications.notify(exports.Village, (0, translate_1._)("the stranger is standing by the fire. she says she can help. says she builds things."));
        }
        engine_1.Engine.moveStoresView(null, transition_diff);
        weather_1.Weather.initiateWeather(exports.Village.availableWeather, 'village');
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
        $('div#location_village').text(title);
    },
    updateButton: function () {
        var light = $('#lightButton.button');
        var stoke = $('#stokeButton.button');
        if (state_manager_1.$SM.get('game.fire.value') == exports.Village.FireEnum.Dead.value && stoke.css('display') != 'none') {
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
            // Village.updateBuildButtons();
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
        if (itemList_1.ItemList[item].slot && exports.Character.equippedItems[itemList_1.ItemList[item].slot] !== undefined) {
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
        if (questLog_1.QuestLog[quest] !== undefined) {
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
        if (questLog_1.QuestLog[quest].phases[exports.Character.questStatus[quest] + 1] !== undefined) {
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
                                && state_manager_1.$SM.get('Road.counter') === undefined)
                                return "I should go check out the Road to the Outpost";
                            else if (state_manager_1.$SM.get('road.open')
                                && state_manager_1.$SM.get('Road.counter') !== undefined
                                && state_manager_1.$SM.get('superlikely.outpostUnlock') === undefined)
                                return "I should keep exploring the Road to the Outpost";
                            else if (state_manager_1.$SM.get('road.open')
                                && state_manager_1.$SM.get('superlikely.outpostUnlock') !== undefined
                                && state_manager_1.$SM.get('superlikely.outpostUnlock') > 0)
                                return "I've found the way to the Outpost";
                        },
                        isComplete: function () {
                            return (state_manager_1.$SM.get('road.open')
                                && state_manager_1.$SM.get('superlikely.outpostUnlock') !== undefined
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
                                && state_manager_1.$SM.get('outpost.captain.haveMet') === undefined)
                                return "I should try talking to the Captain of the Outpost";
                            else if (state_manager_1.$SM.get('superlikely.outpostUnlock') > 0
                                && state_manager_1.$SM.get('outpost.captain.haveMet') !== undefined
                                && state_manager_1.$SM.get('outpost.captain.haveMet') > 0
                                && character_1.Character.inventory["Captain.supplies"] === undefined)
                                return "I should ask the Captain about the missing supplies";
                            else if (state_manager_1.$SM.get('superlikely.outpostUnlock') > 0
                                && state_manager_1.$SM.get('outpost.captain.haveMet') !== undefined
                                && state_manager_1.$SM.get('outpost.captain.haveMet') > 0
                                && character_1.Character.inventory["Captain.supplies"] !== undefined)
                                return "I've gotten the supplies from the Captain";
                        },
                        isComplete: function () {
                            return (state_manager_1.$SM.get('superlikely.outpostUnlock') > 0
                                && state_manager_1.$SM.get('outpost.captain.haveMet') !== undefined
                                && state_manager_1.$SM.get('outpost.captain.haveMet') > 0
                                && character_1.Character.inventory["Captain.supplies"] !== undefined);
                        }
                    }
                }
            },
            2: {
                description: "Return the supplies to the Mayor",
                requirements: {
                    0: {
                        renderRequirement: function () {
                            if (state_manager_1.$SM.get('village.mayor.haveGivenSupplies') === undefined)
                                return "I should hand these supplies over to the Mayor";
                            else if (state_manager_1.$SM.get('village.mayor.haveGivenSupplies') === undefined
                                && state_manager_1.$SM.get('village.mayor.haveGivenSupplies') > 0)
                                return "I've handed over the supplies to the Mayor";
                        },
                        isComplete: function () {
                            return (state_manager_1.$SM.get('village.mayor.haveGivenSupplies') === undefined
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
        if (noEvent === undefined || noEvent == true) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL3RyYW5zbGF0ZS50cyIsInNyYy9zY3JpcHQvQnV0dG9uLnRzIiwic3JjL3NjcmlwdC9jaGFyYWN0ZXJzL2NhcHRhaW4udHMiLCJzcmMvc2NyaXB0L2NoYXJhY3RlcnMvbGl6LnRzIiwic3JjL3NjcmlwdC9jaGFyYWN0ZXJzL21heW9yLnRzIiwic3JjL3NjcmlwdC9lbmdpbmUudHMiLCJzcmMvc2NyaXB0L2V2ZW50cy50cyIsInNyYy9zY3JpcHQvZXZlbnRzL3JvYWR3YW5kZXIudHMiLCJzcmMvc2NyaXB0L2V2ZW50cy92aWxsYWdlLnRzIiwic3JjL3NjcmlwdC9oZWFkZXIudHMiLCJzcmMvc2NyaXB0L25vdGlmaWNhdGlvbnMudHMiLCJzcmMvc2NyaXB0L3BsYWNlcy9vdXRwb3N0LnRzIiwic3JjL3NjcmlwdC9wbGFjZXMvcm9hZC50cyIsInNyYy9zY3JpcHQvcGxhY2VzL3ZpbGxhZ2UudHMiLCJzcmMvc2NyaXB0L3BsYXllci9jaGFyYWN0ZXIudHMiLCJzcmMvc2NyaXB0L3BsYXllci9pdGVtTGlzdC50cyIsInNyYy9zY3JpcHQvcGxheWVyL3F1ZXN0TG9nLnRzIiwic3JjL3NjcmlwdC9zdGF0ZV9tYW5hZ2VyLnRzIiwic3JjL3NjcmlwdC93ZWF0aGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLGdCQUFnQjs7O0FBRWhCLGtDQUFrQztBQUNsQyxLQUFLO0FBQ0wsdUNBQXVDO0FBRXZDLG9DQUFvQztBQUNwQyxNQUFNO0FBQ04sMkNBQTJDO0FBQzNDLE1BQU07QUFDTixtQ0FBbUM7QUFDbkMsTUFBTTtBQUNOLHNDQUFzQztBQUN0QywwQ0FBMEM7QUFFMUMscUNBQXFDO0FBQ3JDLE1BQU07QUFFTixrQkFBa0I7QUFDbEIsTUFBTTtBQUVOLDhEQUE4RDtBQUM5RCxvQ0FBb0M7QUFFcEMsdUhBQXVIO0FBQ3ZILHdDQUF3QztBQUN4Qyw2QkFBNkI7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QUcsVUFBVSxHQUFHLDRCQUE0QixHQUFHLFVBQVUsR0FBRyx5REFBeUQsR0FBRyxVQUFVLEdBQUcsNEJBQTRCLEdBQUcsVUFBVSxHQUFHLGtCQUFrQixDQUFDO1lBQ3piLFNBQVMsSUFBSSxrQ0FBa0MsR0FBRyxTQUFTLEdBQUcsYUFBYSxHQUFHLENBQUMsVUFBVSxHQUFHLFVBQVUsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsd0JBQXdCLEdBQUcsVUFBVSxHQUFHLDRCQUE0QixHQUFHLFVBQVUsR0FBRyxrREFBa0QsR0FBRyxVQUFVLEdBQUcsNEJBQTRCLEdBQUcsVUFBVSxHQUFHLHlEQUF5RCxHQUFHLFVBQVUsR0FBRyw0QkFBNEIsR0FBRyxVQUFVLEdBQUcsa0JBQWtCLENBQUM7UUFDaGMsQ0FBQztRQUVELENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELFlBQVksRUFBRTtRQUNWLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN2QixDQUFDO0NBQ0osQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIChmdW5jdGlvbigpIHtcclxuXHJcbi8vIFx0dmFyIHRyYW5zbGF0ZSA9IGZ1bmN0aW9uKHRleHQpXHJcbi8vIFx0e1xyXG4vLyBcdFx0dmFyIHhsYXRlID0gdHJhbnNsYXRlTG9va3VwKHRleHQpO1xyXG5cdFx0XHJcbi8vIFx0XHRpZiAodHlwZW9mIHhsYXRlID09IFwiZnVuY3Rpb25cIilcclxuLy8gXHRcdHtcclxuLy8gXHRcdFx0eGxhdGUgPSB4bGF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4vLyBcdFx0fVxyXG4vLyBcdFx0ZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpXHJcbi8vIFx0XHR7XHJcbi8vIFx0XHRcdHZhciBhcHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XHJcbi8vIFx0XHRcdHZhciBhcmdzID0gYXBzLmNhbGwoIGFyZ3VtZW50cywgMSApO1xyXG4gIFxyXG4vLyBcdFx0XHR4bGF0ZSA9IGZvcm1hdHRlcih4bGF0ZSwgYXJncyk7XHJcbi8vIFx0XHR9XHJcblx0XHRcclxuLy8gXHRcdHJldHVybiB4bGF0ZTtcclxuLy8gXHR9O1xyXG5cdFxyXG4vLyBcdC8vIEkgd2FudCBpdCBhdmFpbGFibGUgZXhwbGljaXR5IGFzIHdlbGwgYXMgdmlhIHRoZSBvYmplY3RcclxuLy8gXHR0cmFuc2xhdGUudHJhbnNsYXRlID0gdHJhbnNsYXRlO1xyXG5cdFxyXG4vLyBcdC8vZnJvbSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS83NzYxOTYgdmlhIGh0dHA6Ly9kYXZlZGFzaC5jb20vMjAxMC8xMS8xOS9weXRob25pYy1zdHJpbmctZm9ybWF0dGluZy1pbi1qYXZhc2NyaXB0LyBcclxuLy8gXHR2YXIgZGVmYXVsdEZvcm1hdHRlciA9IChmdW5jdGlvbigpIHtcclxuLy8gXHRcdHZhciByZSA9IC9cXHsoW159XSspXFx9L2c7XHJcbi8vIFx0XHRyZXR1cm4gZnVuY3Rpb24ocywgYXJncykge1xyXG4vLyBcdFx0XHRyZXR1cm4gcy5yZXBsYWNlKHJlLCBmdW5jdGlvbihfLCBtYXRjaCl7IHJldHVybiBhcmdzW21hdGNoXTsgfSk7XHJcbi8vIFx0XHR9O1xyXG4vLyBcdH0oKSk7XHJcbi8vIFx0dmFyIGZvcm1hdHRlciA9IGRlZmF1bHRGb3JtYXR0ZXI7XHJcbi8vIFx0dHJhbnNsYXRlLnNldEZvcm1hdHRlciA9IGZ1bmN0aW9uKG5ld0Zvcm1hdHRlcilcclxuLy8gXHR7XHJcbi8vIFx0XHRmb3JtYXR0ZXIgPSBuZXdGb3JtYXR0ZXI7XHJcbi8vIFx0fTtcclxuXHRcclxuLy8gXHR0cmFuc2xhdGUuZm9ybWF0ID0gZnVuY3Rpb24oKVxyXG4vLyBcdHtcclxuLy8gXHRcdHZhciBhcHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XHJcbi8vIFx0XHR2YXIgcyA9IGFyZ3VtZW50c1swXTtcclxuLy8gXHRcdHZhciBhcmdzID0gYXBzLmNhbGwoIGFyZ3VtZW50cywgMSApO1xyXG4gIFxyXG4vLyBcdFx0cmV0dXJuIGZvcm1hdHRlcihzLCBhcmdzKTtcclxuLy8gXHR9O1xyXG5cclxuLy8gXHR2YXIgZHlub1RyYW5zID0gbnVsbDtcclxuLy8gXHR0cmFuc2xhdGUuc2V0RHluYW1pY1RyYW5zbGF0b3IgPSBmdW5jdGlvbihuZXdEeW5vVHJhbnMpXHJcbi8vIFx0e1xyXG4vLyBcdFx0ZHlub1RyYW5zID0gbmV3RHlub1RyYW5zO1xyXG4vLyBcdH07XHJcblxyXG4vLyBcdHZhciB0cmFuc2xhdGlvbiA9IG51bGw7XHJcbi8vIFx0dHJhbnNsYXRlLnNldFRyYW5zbGF0aW9uID0gZnVuY3Rpb24obmV3VHJhbnNsYXRpb24pXHJcbi8vIFx0e1xyXG4vLyBcdFx0dHJhbnNsYXRpb24gPSBuZXdUcmFuc2xhdGlvbjtcclxuLy8gXHR9O1xyXG5cdFxyXG4vLyBcdGZ1bmN0aW9uIHRyYW5zbGF0ZUxvb2t1cCh0YXJnZXQpXHJcbi8vIFx0e1xyXG4vLyBcdFx0aWYgKHRyYW5zbGF0aW9uID09IG51bGwgfHwgdGFyZ2V0ID09IG51bGwpXHJcbi8vIFx0XHR7XHJcbi8vIFx0XHRcdHJldHVybiB0YXJnZXQ7XHJcbi8vIFx0XHR9XHJcblx0XHRcclxuLy8gXHRcdGlmICh0YXJnZXQgaW4gdHJhbnNsYXRpb24gPT0gZmFsc2UpXHJcbi8vIFx0XHR7XHJcbi8vIFx0XHRcdGlmIChkeW5vVHJhbnMgIT0gbnVsbClcclxuLy8gXHRcdFx0e1xyXG4vLyBcdFx0XHRcdHJldHVybiBkeW5vVHJhbnModGFyZ2V0KTtcclxuLy8gXHRcdFx0fVxyXG4vLyBcdFx0XHRyZXR1cm4gdGFyZ2V0O1xyXG4vLyBcdFx0fVxyXG5cdFx0XHJcbi8vIFx0XHR2YXIgcmVzdWx0ID0gdHJhbnNsYXRpb25bdGFyZ2V0XTtcclxuLy8gXHRcdGlmIChyZXN1bHQgPT0gbnVsbClcclxuLy8gXHRcdHtcclxuLy8gXHRcdFx0cmV0dXJuIHRhcmdldDtcclxuLy8gXHRcdH1cclxuXHRcdFxyXG4vLyBcdFx0cmV0dXJuIHJlc3VsdDtcclxuLy8gXHR9O1xyXG5cdFxyXG4vLyBcdHdpbmRvdy5fID0gdHJhbnNsYXRlO1xyXG5cclxuLy8gfSkoKTtcclxuXHJcbi8vIGV4cG9ydCBjb25zdCBfID0gd2luZG93Ll87XHJcblxyXG5leHBvcnQgY29uc3QgXyA9IGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHM7IH0iLCJpbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi9lbmdpbmVcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi9saWIvdHJhbnNsYXRlXCI7XHJcblxyXG5leHBvcnQgY29uc3QgQnV0dG9uID0ge1xyXG5cdEJ1dHRvbjogZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdFx0aWYodHlwZW9mIG9wdGlvbnMuY29vbGRvd24gPT0gJ251bWJlcicpIHtcclxuXHRcdFx0dGhpcy5kYXRhX2Nvb2xkb3duID0gb3B0aW9ucy5jb29sZG93bjtcclxuXHRcdH1cclxuXHRcdHRoaXMuZGF0YV9yZW1haW5pbmcgPSAwO1xyXG5cdFx0aWYodHlwZW9mIG9wdGlvbnMuY2xpY2sgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHR0aGlzLmRhdGFfaGFuZGxlciA9IG9wdGlvbnMuY2xpY2s7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHZhciBlbCA9ICQoJzxkaXY+JylcclxuXHRcdFx0LmF0dHIoJ2lkJywgdHlwZW9mKG9wdGlvbnMuaWQpICE9ICd1bmRlZmluZWQnID8gb3B0aW9ucy5pZCA6IFwiQlROX1wiICsgRW5naW5lLmdldEd1aWQoKSlcclxuXHRcdFx0LmFkZENsYXNzKCdidXR0b24nKVxyXG5cdFx0XHQudGV4dCh0eXBlb2Yob3B0aW9ucy50ZXh0KSAhPSAndW5kZWZpbmVkJyA/IG9wdGlvbnMudGV4dCA6IFwiYnV0dG9uXCIpXHJcblx0XHRcdC5jbGljayhmdW5jdGlvbigpIHsgXHJcblx0XHRcdFx0aWYoISQodGhpcykuaGFzQ2xhc3MoJ2Rpc2FibGVkJykpIHtcclxuXHRcdFx0XHRcdEJ1dHRvbi5jb29sZG93bigkKHRoaXMpKTtcclxuXHRcdFx0XHRcdCQodGhpcykuZGF0YShcImhhbmRsZXJcIikoJCh0aGlzKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0XHQuZGF0YShcImhhbmRsZXJcIiwgIHR5cGVvZiBvcHRpb25zLmNsaWNrID09ICdmdW5jdGlvbicgPyBvcHRpb25zLmNsaWNrIDogZnVuY3Rpb24oKSB7IEVuZ2luZS5sb2coXCJjbGlja1wiKTsgfSlcclxuXHRcdFx0LmRhdGEoXCJyZW1haW5pbmdcIiwgMClcclxuXHRcdFx0LmRhdGEoXCJjb29sZG93blwiLCB0eXBlb2Ygb3B0aW9ucy5jb29sZG93biA9PSAnbnVtYmVyJyA/IG9wdGlvbnMuY29vbGRvd24gOiAwKTtcclxuXHRcdGlmIChvcHRpb25zLmltYWdlICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0ZWwuYXR0cihcInN0eWxlXCIsIFwiYmFja2dyb3VuZC1pbWFnZTogdXJsKFxcXCJcIiArIG9wdGlvbnMuaW1hZ2UgKyBcIlxcXCIpOyBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0OyBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyOyBoZWlnaHQ6IDE3MHB4OyBjb2xvcjogd2hpdGU7dGV4dC1zaGFkb3c6IDBweCAwcHggMnB4IGJsYWNrXCIpXHJcblx0XHR9XHJcblx0XHRlbC5hcHBlbmQoJChcIjxkaXY+XCIpLmFkZENsYXNzKCdjb29sZG93bicpKTtcclxuXHRcdFxyXG5cdFx0aWYob3B0aW9ucy5jb3N0KSB7XHJcblx0XHRcdHZhciB0dFBvcyA9IG9wdGlvbnMudHRQb3MgPyBvcHRpb25zLnR0UG9zIDogXCJib3R0b20gcmlnaHRcIjtcclxuXHRcdFx0dmFyIGNvc3RUb29sdGlwID0gJCgnPGRpdj4nKS5hZGRDbGFzcygndG9vbHRpcCAnICsgdHRQb3MpO1xyXG5cdFx0XHRmb3IodmFyIGsgaW4gb3B0aW9ucy5jb3N0KSB7XHJcblx0XHRcdFx0JChcIjxkaXY+XCIpLmFkZENsYXNzKCdyb3dfa2V5JykudGV4dChfKGspKS5hcHBlbmRUbyhjb3N0VG9vbHRpcCk7XHJcblx0XHRcdFx0JChcIjxkaXY+XCIpLmFkZENsYXNzKCdyb3dfdmFsJykudGV4dChvcHRpb25zLmNvc3Rba10pLmFwcGVuZFRvKGNvc3RUb29sdGlwKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjb3N0VG9vbHRpcC5jaGlsZHJlbigpLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRjb3N0VG9vbHRpcC5hcHBlbmRUbyhlbCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYob3B0aW9ucy53aWR0aCkge1xyXG5cdFx0XHRlbC5jc3MoJ3dpZHRoJywgb3B0aW9ucy53aWR0aCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBlbDtcclxuXHR9LFxyXG5cdFxyXG5cdHNldERpc2FibGVkOiBmdW5jdGlvbihidG4sIGRpc2FibGVkKSB7XHJcblx0XHRpZihidG4pIHtcclxuXHRcdFx0aWYoIWRpc2FibGVkICYmICFidG4uZGF0YSgnb25Db29sZG93bicpKSB7XHJcblx0XHRcdFx0YnRuLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHR9IGVsc2UgaWYoZGlzYWJsZWQpIHtcclxuXHRcdFx0XHRidG4uYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0YnRuLmRhdGEoJ2Rpc2FibGVkJywgZGlzYWJsZWQpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0aXNEaXNhYmxlZDogZnVuY3Rpb24oYnRuKSB7XHJcblx0XHRpZihidG4pIHtcclxuXHRcdFx0cmV0dXJuIGJ0bi5kYXRhKCdkaXNhYmxlZCcpID09PSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0sXHJcblx0XHJcblx0Y29vbGRvd246IGZ1bmN0aW9uKGJ0bikge1xyXG5cdFx0dmFyIGNkID0gYnRuLmRhdGEoXCJjb29sZG93blwiKTtcclxuXHRcdGlmKGNkID4gMCkge1xyXG5cdFx0XHQkKCdkaXYuY29vbGRvd24nLCBidG4pLnN0b3AodHJ1ZSwgdHJ1ZSkud2lkdGgoXCIxMDAlXCIpLmFuaW1hdGUoe3dpZHRoOiAnMCUnfSwgY2QgKiAxMDAwLCAnbGluZWFyJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIGIgPSAkKHRoaXMpLmNsb3Nlc3QoJy5idXR0b24nKTtcclxuXHRcdFx0XHRiLmRhdGEoJ29uQ29vbGRvd24nLCBmYWxzZSk7XHJcblx0XHRcdFx0aWYoIWIuZGF0YSgnZGlzYWJsZWQnKSkge1xyXG5cdFx0XHRcdFx0Yi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRidG4uYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdGJ0bi5kYXRhKCdvbkNvb2xkb3duJywgdHJ1ZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRjbGVhckNvb2xkb3duOiBmdW5jdGlvbihidG4pIHtcclxuXHRcdCQoJ2Rpdi5jb29sZG93bicsIGJ0bikuc3RvcCh0cnVlLCB0cnVlKTtcclxuXHRcdGJ0bi5kYXRhKCdvbkNvb2xkb3duJywgZmFsc2UpO1xyXG5cdFx0aWYoIWJ0bi5kYXRhKCdkaXNhYmxlZCcpKSB7XHJcblx0XHRcdGJ0bi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdH1cclxuXHR9XHJcbn07IiwiaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4uL2V2ZW50c1wiXHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCJcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCJcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4uL3BsYXllci9jaGFyYWN0ZXJcIlxyXG5cclxuZXhwb3J0IGNvbnN0IENhcHRhaW4gPSB7XHJcblx0dGFsa1RvQ2FwdGFpbjogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdUaGUgQ2FwdGFpblxcJ3MgVGVudCcpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlZW5GbGFnOiAoKSA9PiAkU00uZ2V0KCdvdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcpLFxyXG5cdFx0XHRcdFx0bmV4dFNjZW5lOiAnbWFpbicsXHJcblx0XHRcdFx0XHRvbkxvYWQ6ICgpID0+ICRTTS5zZXQoJ291dHBvc3QuY2FwdGFpbi5oYXZlTWV0JywgMSksXHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1lvdSBlbnRlciB0aGUgZmFuY2llc3QtbG9va2luZyB0ZW50IGluIHRoZSBPdXRwb3N0LiBBIGxhcmdlIG1hbiB3aXRoIGEgdG9vdGhicnVzaCBtdXN0YWNoZSBhbmQgYSBzZXZlcmUgZnJvd24gbG9va3MgdXAgZnJvbSBoaXMgZGVzay4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCJTaXIsIHlvdSBoYXZlIGVudGVyZWQgdGhlIHRlbnQgb2YgQ2FwdGFpbiBGaW5uZWFzLiBXaGF0IGJ1c2luZXNzIGRvIHlvdSBoYXZlIGhlcmU/XCInKVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXNrQWJvdXRTdXBwbGllcyc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FzayBBYm91dCBTdXBwbGllcycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTonYXNrQWJvdXRTdXBwbGllcyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6IENhcHRhaW4uaGFuZGxlU3VwcGxpZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGU6ICgpID0+ICEkU00uZ2V0KCdvdXRwb3N0LmNhcHRhaW4uYXNrZWRBYm91dFN1cHBsaWVzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Fza0Fib3V0Q2FwdGFpbic6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FzayBBYm91dCBDYXB0YWluJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOiAnY2FwdGFpblJhbWJsZSd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0xlYXZlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgJ21haW4nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdUaGUgQ2FwdGFpbiBncmVldHMgeW91IHdhcm1seS4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCJBaGgsIHllcywgd2VsY29tZSBiYWNrLiBXaGF0IGNhbiBJIGRvIGZvciB5b3U/XCInKVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXNrQWJvdXRTdXBwbGllcyc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FzayBBYm91dCBTdXBwbGllcycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTonYXNrQWJvdXRTdXBwbGllcyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6IENhcHRhaW4uaGFuZGxlU3VwcGxpZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGU6ICgpID0+ICEkU00uZ2V0KCdvdXRwb3N0LmNhcHRhaW4uYXNrZWRBYm91dFN1cHBsaWVzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Fza0Fib3V0Q2FwdGFpbic6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FzayBBYm91dCBDYXB0YWluJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOidjYXB0YWluUmFtYmxlJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnTGVhdmUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAnY2FwdGFpblJhbWJsZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1RoZSBDYXB0YWluXFwncyBleWVzIGdsZWFtIGF0IHRoZSBvcHBvcnR1bml0eSB0byBydW4gZG93biBoaXMgbGlzdCBvZiBhY2hpZXZlbWVudHMuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiV2h5LCBJXFwnbGwgaGF2ZSB5b3Uga25vdyB0aGF0IHlvdSBzdGFuZCBpbiB0aGUgcHJlc2VuY2Ugb2Ygbm9uZSBvdGhlciB0aGFuIEZpbm5lYXMgSi4gRm9ic2xleSwgQ2FwdGFpbiBvZiB0aGUgUm95YWwgQXJteVxcJ3MgRmlmdGggRGl2aXNpb24sIHRoZSBmaW5lc3QgRGl2aXNpb24gaW4gSGlzIE1hamVzdHlcXCdzIHNlcnZpY2UuXCInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnSGUgcHVmZnMgb3V0IGhpcyBjaGVzdCwgZHJhd2luZyBhdHRlbnRpb24gdG8gaGlzIG1hbnkgbWVkYWxzLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIkkgaGF2ZSBjYW1wYWlnbmVkIG9uIGJlaGFsZiBvZiBPdXIgTG9yZHNoaXAgYWNyb3NzIG1hbnkgbGFuZHMsIGluY2x1ZGluZyBUaGUgRmFyIFdlc3QsIHRoZSBub3J0aGVybiBib3JkZXJzIG9mIFVtYmVyc2hpcmUgYW5kIFBlbGluZ2FsLCBOZXcgQmVsbGlzaWEsIGFuZCBlYWNoIG9mIHRoZSBGaXZlIElzbGVzIG9mIHRoZSBQaXJyaGlhbiBTZWEuXCInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnSGUgcGF1c2VzIGZvciBhIG1vbWVudCwgcGVyaGFwcyB0byBzZWUgaWYgeW91IGFyZSBzdWl0YWJseSBpbXByZXNzZWQsIHRoZW4gY29udGludWVzLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIkFzIENhcHRhaW4gb2YgdGhlIEZpZnRoIERpdmlzaW9uLCBJIGhhZCB0aGUgZXN0ZWVtZWQgcHJpdmlsZWdlIG9mIGVuc3VyaW5nIHRoZSBzYWZldHkgb2YgdGhlc2UgbGFuZHMgZm9yIG91ciBmYWlyIGNpdGl6ZW5zLiBJIGhhdmUgYmVlbiBhd2FyZGVkIG1hbnkgdGltZXMgb3ZlciBmb3IgbXkgYnJhdmVyeSBpbiB0aGUgZmFjZSBvZiB1dG1vc3QgcGVyaWwuIEZvciBpbnN0YW5jZSwgZHVyaW5nIHRoZSBTZWEgQ2FtcGFpZ24gb24gVGh5cHBlLCBUaGlyZCBvZiB0aGUgRml2ZSBJc2xlcywgd2Ugd2VyZSBhbWJ1c2hlZCB3aGlsZSBkaXNlbWJhcmtpbmcgZnJvbSBvdXIgc2hpcC4gVGhpbmtpbmcgcXVpY2tseSwgSS4uLlwiJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1RoZSBjYXB0YWluIGNvbnRpbnVlcyB0byByYW1ibGUgbGlrZSB0aGlzIGZvciBzZXZlcmFsIG1vcmUgbWludXRlcywgZ2l2aW5nIHlvdSB0aW1lIHRvIGJlY29tZSBtdWNoIG1vcmUgZmFtaWxpYXIgd2l0aCB0aGUgZGlydCB1bmRlciB5b3VyIGZpbmdlcm5haWxzLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIi4uLiBhbmQgVEhBVCwgbXkgZ29vZCBhZHZlbnR1cmVyLCBpcyB3aHkgSSBhbHdheXMga2VlcCBmcmVzaCBiYXNpbCBvbiBoYW5kLlwiJylcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Zhc2NpbmF0aW5nJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnRmFzY2luYXRpbmcnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6J21haW5Db250aW51ZWQnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICdtYWluQ29udGludWVkJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnVGhlIENhcHRhaW4gc2h1ZmZsZXMgaGlzIHBhcGVycyBpbiBhIHNvbWV3aGF0IHBlcmZvcm1hdGl2ZSB3YXkuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiV2FzIHRoZXJlIHNvbWV0aGluZyBlbHNlIHlvdSBuZWVkZWQ/XCInKVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXNrQWJvdXRTdXBwbGllcyc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FzayBBYm91dCBTdXBwbGllcycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTonYXNrQWJvdXRTdXBwbGllcyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6IENhcHRhaW4uaGFuZGxlU3VwcGxpZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGU6ICgpID0+ICEkU00uZ2V0KCdvdXRwb3N0LmNhcHRhaW4uYXNrZWRBYm91dFN1cHBsaWVzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Fza0Fib3V0Q2FwdGFpbic6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FzayBBYm91dCBDYXB0YWluJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOidjYXB0YWluUmFtYmxlJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnTGVhdmUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAnYXNrQWJvdXRTdXBwbGllcyc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1RoZSBDYXB0YWluXFwncyBleWVzIGdsZWFtIHdpdGggYSBtaXh0dXJlIG9mIHJlYWxpemF0aW9uIGFuZCBndWlsdC4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCJBaGgsIHllcywgcmlnaHQsIHRoZSBzdXBwbGllcy4gSSBzdXBwb3NlIHRoZSBNYXlvciBpcyBzdGlsbCB3YWl0aW5nIGZvciB0aG9zZS4gSGF2ZSBhIGxvb2sgaW4gdGhhdCBjaGVzdCBvdmVyIHRoZXJlLCBpdCBzaG91bGQgaGF2ZSBldmVyeXRoaW5nIHlvdSBuZWVkLlwiJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ0hlIGluZGljYXRlcyB0byBhIGNoZXN0IGF0IHRoZSBiYWNrIG9mIHRoZSByb29tLiBZb3Ugb3BlbiB0aGUgbGlkLCByZXZlYWxpbmcgdGhlIHN1cHBsaWVzIHdpdGhpbi4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnWW91IHRha2UgdGhlIHN1cHBsaWVzLicpXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnR29vZCBTdHVmZicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcblxyXG4gICAgaGFuZGxlU3VwcGxpZXM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdoYW5kbGluZyBzdXBwbGllcycpO1xyXG4gICAgICAgICRTTS5zZXQoJ291dHBvc3QuY2FwdGFpbi5hc2tlZEFib3V0U3VwcGxpZXMnLCAxKTtcclxuICAgICAgICBDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoXCJDYXB0YWluLnN1cHBsaWVzXCIpO1xyXG4gICAgICAgIENoYXJhY3Rlci5jaGVja1F1ZXN0U3RhdHVzKFwibWF5b3JTdXBwbGllc1wiKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IFZpbGxhZ2UgfSBmcm9tIFwiLi4vcGxhY2VzL3ZpbGxhZ2VcIjtcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4uL3BsYXllci9jaGFyYWN0ZXJcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBMaXogPSB7XHJcbiAgICBzZXRMaXpBY3RpdmU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0JFNNLnNldCgndmlsbGFnZS5saXpBY3RpdmUnLCAxKTtcclxuXHRcdCRTTS5zZXQoJ3ZpbGxhZ2UubGl6LmNhbkZpbmRCb29rJywgMCk7XHJcblx0XHQkU00uc2V0KCd2aWxsYWdlLmxpei5oYXNCb29rJywgMSk7XHJcblx0XHRWaWxsYWdlLnVwZGF0ZUJ1dHRvbigpO1xyXG5cdH0sXHJcblxyXG5cdHRhbGtUb0xpejogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdMaXpcXCdzIGhvdXNlLCBhdCB0aGUgZWRnZSBvZiB0b3duJyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHRzZWVuRmxhZzogKCkgPT4gJFNNLmdldCgndmlsbGFnZS5saXouaGF2ZU1ldCcpLFxyXG5cdFx0XHRcdFx0bmV4dFNjZW5lOiAnbWFpbicsXHJcblx0XHRcdFx0XHRvbkxvYWQ6ICgpID0+ICRTTS5zZXQoJ3ZpbGxhZ2UubGl6LmhhdmVNZXQnLCAxKSxcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnWW91IGVudGVyIHRoZSBidWlsZGluZyBhbmQgYXJlIGltbWVkaWF0ZWx5IHBsdW5nZWQgaW50byBhIGxhYnlyaW50aCBvZiBzaGVsdmVzIGhhcGhhemFyZGx5IGZpbGxlZCB3aXRoIGJvb2tzIG9mIGFsbCBraW5kcy4gQWZ0ZXIgYSBiaXQgb2Ygc2VhcmNoaW5nLCB5b3UgZmluZCBhIHNpZGUgcm9vbSB3aGVyZSBhIHdvbWFuIHdpdGggbW91c3kgaGFpciBhbmQgZ2xhc3NlcyBpcyBzaXR0aW5nIGF0IGEgd3JpdGluZyBkZXNrLiBTaGVcXCdzIHJlYWRpbmcgYSBsYXJnZSBib29rIHRoYXQgYXBwZWFycyB0byBpbmNsdWRlIGRpYWdyYW1zIG9mIHNvbWUgc29ydCBvZiBwbGFudC4gU2hlIGxvb2tzIHVwIGFzIHlvdSBlbnRlciB0aGUgcm9vbS4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJXaG8gdGhlIGhlbGwgYXJlIHlvdT9cIicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnYXNrQWJvdXRUb3duJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBhYm91dCBDaGFkdG9waWEnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnY2hhZHRvcGlhUmFtYmxlJ31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J3F1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBmb3IgYSBxdWVzdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdxdWVzdFJlcXVlc3QnfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnbGVhdmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnTGVhdmUnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdjaGFkdG9waWFSYW1ibGUnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ0xpeiBsb29rcyBhdCB5b3UgZm9yIGEgbW9tZW50IGJlZm9yZSByZXR1cm5pbmcgaGVyIGdhemUgdG8gdGhlIGJvb2sgaW4gZnJvbnQgb2YgaGVyLicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIlRoZXJlXFwncyBhIGJvb2sgaW4gaGVyZSBzb21ld2hlcmUgYWJvdXQgdGhlIGZvdW5kaW5nIG9mIENoYWR0b3BpYS4gSWYgeW91IGNhbiBmaW5kIGl0LCB5b3VcXCdyZSBmcmVlIHRvIGJvcnJvdyBpdC5cIicpXSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J29rYXknOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnT2theSwgdGhlbi4nKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnbWFpbid9LFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiAoKSA9PiAkU00uc2V0KCd2aWxsYWdlLmxpei5jYW5GaW5kQm9vaycsIHRydWUpXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cclxuXHRcdFx0XHQnbWFpbic6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtfKCdMaXogc2VlbXMgZGV0ZXJtaW5lZCBub3QgdG8gcGF5IGF0dGVudGlvbiB0byB5b3UuJyldLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnYXNrQWJvdXRUb3duJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBhYm91dCBDaGFkdG9waWEnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnY2hhZHRvcGlhUmFtYmxlJ30sXHJcblx0XHRcdFx0XHRcdFx0YXZhaWxhYmxlOiAoKSA9PiAhJFNNLmdldCgndmlsbGFnZS5saXouY2FuRmluZEJvb2snKVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQncXVlc3QnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGZvciBhIHF1ZXN0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ3F1ZXN0UmVxdWVzdCd9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdmaW5kQm9vayc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdUcnkgdG8gZmluZCB0aGUgYm9vaycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdmaW5kQm9vayd9LFxyXG5cdFx0XHRcdFx0XHRcdC8vIFRPRE86IGEgXCJ2aXNpYmxlXCIgZmxhZyB3b3VsZCBiZSBnb29kIGhlcmUsIGZvciBzaXR1YXRpb25zIHdoZXJlIGFuIG9wdGlvblxyXG5cdFx0XHRcdFx0XHRcdC8vICAgaXNuJ3QgeWV0IGtub3duIHRvIHRoZSBwbGF5ZXJcclxuXHRcdFx0XHRcdFx0XHR2aXNpYmxlOiAoKSA9PiAkU00uZ2V0KCd2aWxsYWdlLmxpei5jYW5GaW5kQm9vaycpLFxyXG5cdFx0XHRcdFx0XHRcdGF2YWlsYWJsZTogKCkgPT4gKCRTTS5nZXQoJ3ZpbGxhZ2UubGl6LmNhbkZpbmRCb29rJykgYXMgbnVtYmVyID4gMCkgJiYgKCRTTS5nZXQoJ3ZpbGxhZ2UubGl6Lmhhc0Jvb2snKSlcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0xlYXZlJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnZmluZEJvb2snOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ0xlYXZpbmcgTGl6IHRvIGhlciBidXNpbmVzcywgeW91IHdhbmRlciBhcm91bmQgYW1pZHN0IHRoZSBib29rcywgd29uZGVyaW5nIGhvdyB5b3VcXCdsbCBldmVyIG1hbmFnZSB0byBmaW5kIHdoYXQgeW91XFwncmUgbG9va2luZyBmb3IgaW4gYWxsIHRoaXMgdW5vcmdhbml6ZWQgbWVzcy4nKSxcclxuXHRcdFx0XHRcdFx0XygnRm9ydHVuYXRlbHksIHRoZSBjcmVhdG9yIG9mIHRoaXMgZ2FtZSBkb2VzblxcJ3QgZmVlbCBsaWtlIGl0XFwnZCBiZSB2ZXJ5IGludGVyZXN0aW5nIHRvIG1ha2UgdGhpcyBpbnRvIGEgcHV6emxlLCBzbyB5b3Ugc3BvdCB0aGUgYm9vayBvbiBhIG5lYXJieSBzaGVsZiBhbmQgZ3JhYiBpdC4nKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J3NpY2snOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnT2gsIHNpY2snKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiAoKSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyAkU00uc2V0KCdzdG9yZXMuV2VpcmQgQm9vaycsIDEpO1xyXG5cdFx0XHRcdFx0XHRcdFx0Q2hhcmFjdGVyLmFkZFRvSW52ZW50b3J5KFwiTGl6LndlaXJkQm9va1wiKTtcclxuXHRcdFx0XHRcdFx0XHRcdCRTTS5zZXQoJ3ZpbGxhZ2UubGl6Lmhhc0Jvb2snLCAwKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdxdWVzdFJlcXVlc3QnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ0xpeiBsZXRzIG91dCBhbiBhbm5veWVkIHNpZ2guJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiT2ggYnJhdmUgYWR2ZW50dXJlciwgSSBzZWVtIHRvIGhhdmUgbG9zdCBteSBwYXRpZW5jZS4gV2hlbiBsYXN0IEkgc2F3IGl0LCBpdCB3YXMgc29tZXdoZXJlIG91dHNpZGUgb2YgdGhpcyBidWlsZGluZy4gV291bGRzdCB0aG91IHJlY292ZXIgdGhhdCB3aGljaCBoYXMgYmVlbiBzdG9sZW4gZnJvbSBtZT9cIicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnb2theSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdPa2F5LCBqZWV6LCBJIGdldCBpdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdtYWluJ31cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG59IiwiaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgTGl6IH0gZnJvbSBcIi4vbGl6XCI7XHJcbmltcG9ydCB7IFJvYWQgfSBmcm9tIFwiLi4vcGxhY2VzL3JvYWRcIjtcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4uL3BsYXllci9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IHsgVmlsbGFnZSB9IGZyb20gXCIuLi9wbGFjZXMvdmlsbGFnZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IE1heW9yID0ge1xyXG4gICAgdGFsa1RvTWF5b3I6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnTWVldCB0aGUgTWF5b3InKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuXHRcdFx0XHRcdHNlZW5GbGFnOiAoKSA9PiAkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVNZXQnKSxcclxuXHRcdFx0XHRcdG5leHRTY2VuZTogJ21haW4nLFxyXG5cdFx0XHRcdFx0b25Mb2FkOiAoKSA9PiAkU00uc2V0KCd2aWxsYWdlLm1heW9yLmhhdmVNZXQnLCAxKSxcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnVGhlIG1heW9yIHNtaWxlcyBhdCB5b3UgYW5kIHNheXM6JyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiV2VsY29tZSB0byBDaGFkdG9waWEsIElcXCdtIHRoZSBtYXlvciBvZiB0aGVzZSBoZXJlIHBhcnRzLiBXaGF0IGNhbiBJIGRvIHlvdSBmb3I/XCInKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2Fza0Fib3V0VG93bic6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgYWJvdXQgQ2hhZHRvcGlhJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2NoYWR0b3BpYVJhbWJsZSd9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdxdWVzdCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgZm9yIGEgcXVlc3QnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAncXVlc3QnfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnbGVhdmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnTGVhdmUnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdjaGFkdG9waWFSYW1ibGUnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1RoZSBtYXlvciBwdXNoZXMgdGhlIGJyaW0gb2YgaGlzIGhhdCB1cC4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJXZWxsLCB3ZVxcJ3ZlIGFsd2F5cyBiZWVuIGhlcmUsIGxvbmcgYXMgSSBjYW4gcmVtZW1iZXIuIEkgdG9vayBvdmVyIGFmdGVyIHRoZSBsYXN0IG1heW9yIGRpZWQsIGJ1dCBoZSB3b3VsZCBoYXZlIGJlZW4gdGhlIG9ubHkgcGVyc29uIHdpdGggYW55IGhpc3RvcmljYWwga25vd2xlZGdlIG9mIHRoaXMgdmlsbGFnZS5cIicpLFxyXG5cdFx0XHRcdFx0XHRfKCdIZSBwYXVzZXMgZm9yIGEgbW9tZW50IGFuZCB0b3VzbGVzIHNvbWUgb2YgdGhlIHdpc3B5IGhhaXJzIHRoYXQgaGF2ZSBwb2tlZCBvdXQgZnJvbSB1bmRlciB0aGUgcmFpc2VkIGhhdC4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJBY3R1YWxseSwgeW91IG1pZ2h0IGFzayBMaXosIHNoZSBoYXMgYSBidW5jaCBvZiBoZXIgbW90aGVyXFwncyBib29rcyBmcm9tIHdheSBiYWNrIHdoZW4uIFNoZSBsaXZlcyBhdCB0aGUgZWRnZSBvZiB0b3duLlwiJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdva2F5Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ09rYXksIHRoZW4uJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ21haW4nfSxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogTGl6LnNldExpekFjdGl2ZVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnbWFpbic6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnVGhlIG1heW9yIHNheXM6JyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiQW55d2F5LCB3aGF0IEVMU0UgY2FuIEkgZG8geW91IGZvcj9cIicpLFxyXG5cdFx0XHRcdFx0XHRfKCdIZSBjaHVja2xlcyBhdCBoaXMgY2xldmVyIHVzZSBvZiBsYW5ndWFnZS4nKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2Fza0Fib3V0VG93bic6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgYWJvdXQgQ2hhZHRvcGlhJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2NoYWR0b3BpYVJhbWJsZSd9LFxyXG5cdFx0XHRcdFx0XHRcdC8vIGltYWdlOiBcImFzc2V0cy9jYXJkcy9saXR0bGVfd29sZi5wbmdcIlxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQncXVlc3QnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGZvciBhIHF1ZXN0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ3F1ZXN0J30sXHJcblx0XHRcdFx0XHRcdFx0YXZhaWxhYmxlOiAoKSA9PlxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gbm90IGF2YWlsYWJsZSBpZiBtYXlvclN1cHBsaWVzIGlzIGluLXByb2dyZXNzXHJcblx0XHRcdFx0XHRcdFx0XHQoQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW1wibWF5b3JTdXBwbGllc1wiXSA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gcmUtYWRkIHRoaXMgY29uZGl0aW9uIGxhdGVyLCB3ZSBuZWVkIHRvIHNlbmQgdGhlbSB0byBhIGRpZmZlcmVudFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gICBxdWVzdCBkaWFsb2cgaWYgdGhleSBhbHJlYWR5IGRpZCB0aGUgZmlyc3QgcXVlc3RcclxuXHRcdFx0XHRcdFx0XHRcdC8vIHx8IChDaGFyYWN0ZXIucXVlc3RTdGF0dXNbXCJtYXlvclN1cHBsaWVzXCJdID09IC0xKVxyXG5cdFx0XHRcdFx0XHRcdC8vIGltYWdlOiBcImFzc2V0cy9jYXJkcy9qb2tlci5wbmdcIlxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnZ2l2ZVN1cHBsaWVzJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0hhbmQgb3ZlciB0aGUgc3VwcGxpZXMnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnZ2l2ZVN1cHBsaWVzJ30sXHJcblx0XHRcdFx0XHRcdFx0YXZhaWxhYmxlOiAoKSA9PiBcclxuXHRcdFx0XHRcdFx0XHRcdCgkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykgPT09IHVuZGVmaW5lZCkgXHJcblx0XHRcdFx0XHRcdFx0XHQmJiAoQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW1wibWF5b3JTdXBwbGllc1wiXSAhPT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRcdFx0XHRcdFx0JiYgQ2hhcmFjdGVyLmludmVudG9yeVtcIkNhcHRhaW4uc3VwcGxpZXNcIl0sXHJcblx0XHRcdFx0XHRcdFx0dmlzaWJsZTogKCkgPT5cclxuXHRcdFx0XHRcdFx0XHRcdChDaGFyYWN0ZXIucXVlc3RTdGF0dXNbXCJtYXlvclN1cHBsaWVzXCJdICE9PSB1bmRlZmluZWQpLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiAoKSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0XHRDaGFyYWN0ZXIucmVtb3ZlRnJvbUludmVudG9yeShcIkNhcHRhaW4uc3VwcGxpZXNcIik7XHJcblx0XHRcdFx0XHRcdFx0XHQkU00uc2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJywgMSk7XHJcblx0XHRcdFx0XHRcdFx0XHRDaGFyYWN0ZXIuY2hlY2tRdWVzdFN0YXR1cyhcIm1heW9yU3VwcGxpZXNcIik7XHJcblx0XHRcdFx0XHRcdFx0XHRWaWxsYWdlLnVwZGF0ZUJ1dHRvbigpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0xlYXZlJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHQvLyBpbWFnZTogXCJhc3NldHMvY2FyZHMvcmF2ZW4ucG5nXCJcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J3F1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdUaGUgbWF5b3IgdGhpbmtzIGZvciBhIG1vbWVudC4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJZb3Uga25vdywgaXRcXCdzIGJlZW4gYSB3aGlsZSBzaW5jZSBvdXIgbGFzdCBzaGlwbWVudCBvZiBzdXBwbGllcyBhcnJpdmVkIGZyb20gdGhlIG91dHBvc3QuIE1pbmQgbG9va2luZyBpbnRvIHRoYXQgZm9yIHVzP1wiJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiWW91IGNhbiBhc2sgYWJvdXQgaXQgYXQgdGhlIG91dHBvc3QsIG9yIGp1c3Qgd2FuZGVyIGFyb3VuZCBvbiB0aGUgcm9hZCBhbmQgc2VlIGlmIHlvdSBmaW5kIGFueSBjbHVlcy4gRWl0aGVyIHdheSwgaXRcXCdzIHRpbWUgdG8gaGl0IHRoZSByb2FkLCBhZHZlbnR1cmVyIVwiJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdhbHJpZ2h0eSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBbHJpZ2h0eScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdtYWluJ30sXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IE1heW9yLnN0YXJ0U3VwcGxpZXNRdWVzdFxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnZ2l2ZVN1cHBsaWVzJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdUaGUgbWF5b3Igc21pbGVzLCBhbmQgdGhlIGVkZ2VzIG9mIGhpcyBleWVzIGNyaW5rbGUuJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiVGhhbmsgeW91LCBicmF2ZSBhZHZlbnR1cmVyISBXaXRoIHRoZXNlIHN1cHBsaWVzLCB0aGUgdmlsbGFnZSBjYW4gb25jZSBhZ2FpbiB0aHJpdmUuXCInKSxcclxuXHRcdFx0XHRcdFx0XygnSGUgdGFrZXMgdGhlbSBmcm9tIHlvdSBncmFjaW91c2x5LCBhbmQgcHJvbXB0bHkgaGFuZHMgdGhlbSBvZmYgdG8gc29tZSB3b3JrZXJzLCB3aG8gcXVpY2tseSBlcmVjdCBhIGJ1aWxkaW5nIHRoYXQgZ2l2ZXMgeW91IGEgbmV3IGJ1dHRvbiB0byBjbGljaycpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnaW1wcmVzc2l2ZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdJbXByZXNzaXZlIScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRzdGFydFN1cHBsaWVzUXVlc3Q6IGZ1bmN0aW9uICgpIHtcclxuXHRcdC8vIGlmICghJFNNLmdldCgncXVlc3Quc3VwcGxpZXMnKSkge1xyXG5cdFx0Ly8gXHQvLyAxID0gc3RhcnRlZCwgMiA9IG5leHQgc3RlcCwgZXRjLiB1bnRpbCBjb21wbGV0ZWRcclxuXHRcdC8vIFx0JFNNLnNldCgncXVlc3Quc3VwcGxpZXMnLCAxKTtcclxuXHRcdC8vIFx0Um9hZC5pbml0KCk7XHJcblx0XHQvLyB9XHJcblx0XHRpZiAoQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW1wibWF5b3JTdXBwbGllc1wiXSA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdENoYXJhY3Rlci5zZXRRdWVzdFN0YXR1cyhcIm1heW9yU3VwcGxpZXNcIiwgMCk7XHJcblx0XHRcdFJvYWQuaW5pdCgpO1xyXG5cdFx0fVxyXG5cdH1cclxufSIsIi8vIEB0cy1ub2NoZWNrXHJcblxyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBOb3RpZmljYXRpb25zIH0gZnJvbSBcIi4vbm90aWZpY2F0aW9uc1wiO1xyXG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgVmlsbGFnZSB9IGZyb20gXCIuL3BsYWNlcy92aWxsYWdlXCI7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuL3BsYXllci9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IHsgV2VhdGhlciB9IGZyb20gXCIuL3dlYXRoZXJcIjtcclxuaW1wb3J0IHsgUm9hZCB9IGZyb20gXCIuL3BsYWNlcy9yb2FkXCI7XHJcbmltcG9ydCB7IE91dHBvc3QgfSBmcm9tIFwiLi9wbGFjZXMvb3V0cG9zdFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEVuZ2luZSA9IHdpbmRvdy5FbmdpbmUgPSB7XHJcblx0XHJcblx0U0lURV9VUkw6IGVuY29kZVVSSUNvbXBvbmVudChcImh0dHA6Ly9hZGFya3Jvb20uZG91Ymxlc3BlYWtnYW1lcy5jb21cIiksXHJcblx0VkVSU0lPTjogMS4zLFxyXG5cdE1BWF9TVE9SRTogOTk5OTk5OTk5OTk5OTksXHJcblx0U0FWRV9ESVNQTEFZOiAzMCAqIDEwMDAsXHJcblx0R0FNRV9PVkVSOiBmYWxzZSxcclxuXHRcclxuXHQvL29iamVjdCBldmVudCB0eXBlc1xyXG5cdHRvcGljczoge30sXHJcblx0XHRcclxuXHRQZXJrczoge1xyXG5cdFx0J2JveGVyJzoge1xyXG5cdFx0XHRuYW1lOiBfKCdib3hlcicpLFxyXG5cdFx0XHRkZXNjOiBfKCdwdW5jaGVzIGRvIG1vcmUgZGFtYWdlJyksXHJcblx0XHRcdC8vLyBUUkFOU0xBVE9SUyA6IG1lYW5zIHdpdGggbW9yZSBmb3JjZS5cclxuXHRcdFx0bm90aWZ5OiBfKCdsZWFybmVkIHRvIHRocm93IHB1bmNoZXMgd2l0aCBwdXJwb3NlJylcclxuXHRcdH0sXHJcblx0XHQnbWFydGlhbCBhcnRpc3QnOiB7XHJcblx0XHRcdG5hbWU6IF8oJ21hcnRpYWwgYXJ0aXN0JyksXHJcblx0XHRcdGRlc2M6IF8oJ3B1bmNoZXMgZG8gZXZlbiBtb3JlIGRhbWFnZS4nKSxcclxuXHRcdFx0bm90aWZ5OiBfKCdsZWFybmVkIHRvIGZpZ2h0IHF1aXRlIGVmZmVjdGl2ZWx5IHdpdGhvdXQgd2VhcG9ucycpXHJcblx0XHR9LFxyXG5cdFx0J3VuYXJtZWQgbWFzdGVyJzoge1xyXG5cdFx0XHQvLy8gVFJBTlNMQVRPUlMgOiBtYXN0ZXIgb2YgdW5hcm1lZCBjb21iYXRcclxuXHRcdFx0bmFtZTogXygndW5hcm1lZCBtYXN0ZXInKSxcclxuXHRcdFx0ZGVzYzogXygncHVuY2ggdHdpY2UgYXMgZmFzdCwgYW5kIHdpdGggZXZlbiBtb3JlIGZvcmNlJyksXHJcblx0XHRcdG5vdGlmeTogXygnbGVhcm5lZCB0byBzdHJpa2UgZmFzdGVyIHdpdGhvdXQgd2VhcG9ucycpXHJcblx0XHR9LFxyXG5cdFx0J2JhcmJhcmlhbic6IHtcclxuXHRcdFx0bmFtZTogXygnYmFyYmFyaWFuJyksXHJcblx0XHRcdGRlc2M6IF8oJ21lbGVlIHdlYXBvbnMgZGVhbCBtb3JlIGRhbWFnZScpLFxyXG5cdFx0XHRub3RpZnk6IF8oJ2xlYXJuZWQgdG8gc3dpbmcgd2VhcG9ucyB3aXRoIGZvcmNlJylcclxuXHRcdH0sXHJcblx0XHQnc2xvdyBtZXRhYm9saXNtJzoge1xyXG5cdFx0XHRuYW1lOiBfKCdzbG93IG1ldGFib2xpc20nKSxcclxuXHRcdFx0ZGVzYzogXygnZ28gdHdpY2UgYXMgZmFyIHdpdGhvdXQgZWF0aW5nJyksXHJcblx0XHRcdG5vdGlmeTogXygnbGVhcm5lZCBob3cgdG8gaWdub3JlIHRoZSBodW5nZXInKVxyXG5cdFx0fSxcclxuXHRcdCdkZXNlcnQgcmF0Jzoge1xyXG5cdFx0XHRuYW1lOiBfKCdkZXNlcnQgcmF0JyksXHJcblx0XHRcdGRlc2M6IF8oJ2dvIHR3aWNlIGFzIGZhciB3aXRob3V0IGRyaW5raW5nJyksXHJcblx0XHRcdG5vdGlmeTogXygnbGVhcm5lZCB0byBsb3ZlIHRoZSBkcnkgYWlyJylcclxuXHRcdH0sXHJcblx0XHQnZXZhc2l2ZSc6IHtcclxuXHRcdFx0bmFtZTogXygnZXZhc2l2ZScpLFxyXG5cdFx0XHRkZXNjOiBfKCdkb2RnZSBhdHRhY2tzIG1vcmUgZWZmZWN0aXZlbHknKSxcclxuXHRcdFx0bm90aWZ5OiBfKFwibGVhcm5lZCB0byBiZSB3aGVyZSB0aGV5J3JlIG5vdFwiKVxyXG5cdFx0fSxcclxuXHRcdCdwcmVjaXNlJzoge1xyXG5cdFx0XHRuYW1lOiBfKCdwcmVjaXNlJyksXHJcblx0XHRcdGRlc2M6IF8oJ2xhbmQgYmxvd3MgbW9yZSBvZnRlbicpLFxyXG5cdFx0XHRub3RpZnk6IF8oJ2xlYXJuZWQgdG8gcHJlZGljdCB0aGVpciBtb3ZlbWVudCcpXHJcblx0XHR9LFxyXG5cdFx0J3Njb3V0Jzoge1xyXG5cdFx0XHRuYW1lOiBfKCdzY291dCcpLFxyXG5cdFx0XHRkZXNjOiBfKCdzZWUgZmFydGhlcicpLFxyXG5cdFx0XHRub3RpZnk6IF8oJ2xlYXJuZWQgdG8gbG9vayBhaGVhZCcpXHJcblx0XHR9LFxyXG5cdFx0J3N0ZWFsdGh5Jzoge1xyXG5cdFx0XHRuYW1lOiBfKCdzdGVhbHRoeScpLFxyXG5cdFx0XHRkZXNjOiBfKCdiZXR0ZXIgYXZvaWQgY29uZmxpY3QgaW4gdGhlIHdpbGQnKSxcclxuXHRcdFx0bm90aWZ5OiBfKCdsZWFybmVkIGhvdyBub3QgdG8gYmUgc2VlbicpXHJcblx0XHR9LFxyXG5cdFx0J2dhc3Ryb25vbWUnOiB7XHJcblx0XHRcdG5hbWU6IF8oJ2dhc3Ryb25vbWUnKSxcclxuXHRcdFx0ZGVzYzogXygncmVzdG9yZSBtb3JlIGhlYWx0aCB3aGVuIGVhdGluZycpLFxyXG5cdFx0XHRub3RpZnk6IF8oJ2xlYXJuZWQgdG8gbWFrZSB0aGUgbW9zdCBvZiBmb29kJylcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHtcclxuXHRcdHN0YXRlOiBudWxsLFxyXG5cdFx0ZGVidWc6IHRydWUsXHJcblx0XHRsb2c6IHRydWUsXHJcblx0XHRkcm9wYm94OiBmYWxzZSxcclxuXHRcdGRvdWJsZVRpbWU6IGZhbHNlXHJcblx0fSxcclxuXHJcblx0X2RlYnVnOiBmYWxzZSxcclxuXHRcdFxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdFx0dGhpcy5fZGVidWcgPSB0aGlzLm9wdGlvbnMuZGVidWc7XHJcblx0XHR0aGlzLl9sb2cgPSB0aGlzLm9wdGlvbnMubG9nO1xyXG5cdFx0XHJcblx0XHQvLyBDaGVjayBmb3IgSFRNTDUgc3VwcG9ydFxyXG5cdFx0aWYoIUVuZ2luZS5icm93c2VyVmFsaWQoKSkge1xyXG5cdFx0XHR3aW5kb3cubG9jYXRpb24gPSAnYnJvd3Nlcldhcm5pbmcuaHRtbCc7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIENoZWNrIGZvciBtb2JpbGVcclxuXHRcdGlmKEVuZ2luZS5pc01vYmlsZSgpKSB7XHJcblx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9ICdtb2JpbGVXYXJuaW5nLmh0bWwnO1xyXG5cdFx0fVxyXG5cclxuXHRcdEVuZ2luZS5kaXNhYmxlU2VsZWN0aW9uKCk7XHJcblx0XHRcclxuXHRcdGlmKHRoaXMub3B0aW9ucy5zdGF0ZSAhPSBudWxsKSB7XHJcblx0XHRcdHdpbmRvdy5TdGF0ZSA9IHRoaXMub3B0aW9ucy5zdGF0ZTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEVuZ2luZS5sb2FkR2FtZSgpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2xvY2F0aW9uU2xpZGVyJykuYXBwZW5kVG8oJyNtYWluJyk7XHJcblxyXG5cdFx0dmFyIG1lbnUgPSAkKCc8ZGl2PicpXHJcblx0XHRcdC5hZGRDbGFzcygnbWVudScpXHJcblx0XHRcdC5hcHBlbmRUbygnYm9keScpO1xyXG5cclxuXHRcdGlmKHR5cGVvZiBsYW5ncyAhPSAndW5kZWZpbmVkJyl7XHJcblx0XHRcdHZhciBjdXN0b21TZWxlY3QgPSAkKCc8c3Bhbj4nKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnY3VzdG9tU2VsZWN0JylcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHRcdFx0dmFyIHNlbGVjdE9wdGlvbnMgPSAkKCc8c3Bhbj4nKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnY3VzdG9tU2VsZWN0T3B0aW9ucycpXHJcblx0XHRcdFx0LmFwcGVuZFRvKGN1c3RvbVNlbGVjdCk7XHJcblx0XHRcdHZhciBvcHRpb25zTGlzdCA9ICQoJzx1bD4nKVxyXG5cdFx0XHRcdC5hcHBlbmRUbyhzZWxlY3RPcHRpb25zKTtcclxuXHRcdFx0JCgnPGxpPicpXHJcblx0XHRcdFx0LnRleHQoXCJsYW5ndWFnZS5cIilcclxuXHRcdFx0XHQuYXBwZW5kVG8ob3B0aW9uc0xpc3QpO1xyXG5cdFx0XHRcclxuXHRcdFx0JC5lYWNoKGxhbmdzLCBmdW5jdGlvbihuYW1lLGRpc3BsYXkpe1xyXG5cdFx0XHRcdCQoJzxsaT4nKVxyXG5cdFx0XHRcdFx0LnRleHQoZGlzcGxheSlcclxuXHRcdFx0XHRcdC5hdHRyKCdkYXRhLWxhbmd1YWdlJywgbmFtZSlcclxuXHRcdFx0XHRcdC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkgeyBFbmdpbmUuc3dpdGNoTGFuZ3VhZ2UodGhpcyk7IH0pXHJcblx0XHRcdFx0XHQuYXBwZW5kVG8ob3B0aW9uc0xpc3QpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2xpZ2h0c09mZiBtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygnbGlnaHRzIG9mZi4nKSlcclxuXHRcdFx0LmNsaWNrKEVuZ2luZS50dXJuTGlnaHRzT2ZmKVxyXG5cdFx0XHQuYXBwZW5kVG8obWVudSk7XHJcblxyXG5cdFx0JCgnPHNwYW4+JylcclxuXHRcdFx0LmFkZENsYXNzKCdtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygnaHlwZXIuJykpXHJcblx0XHRcdC5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0XHRcdEVuZ2luZS5vcHRpb25zLmRvdWJsZVRpbWUgPSAhRW5naW5lLm9wdGlvbnMuZG91YmxlVGltZTtcclxuXHRcdFx0XHRpZihFbmdpbmUub3B0aW9ucy5kb3VibGVUaW1lKVxyXG5cdFx0XHRcdFx0JCh0aGlzKS50ZXh0KF8oJ2NsYXNzaWMuJykpO1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdCQodGhpcykudGV4dChfKCdoeXBlci4nKSk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHQudGV4dChfKCdyZXN0YXJ0LicpKVxyXG5cdFx0XHQuY2xpY2soRW5naW5lLmNvbmZpcm1EZWxldGUpXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHRcdFxyXG5cdFx0JCgnPHNwYW4+JylcclxuXHRcdFx0LmFkZENsYXNzKCdtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygnc2hhcmUuJykpXHJcblx0XHRcdC5jbGljayhFbmdpbmUuc2hhcmUpXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHQudGV4dChfKCdzYXZlLicpKVxyXG5cdFx0XHQuY2xpY2soRW5naW5lLmV4cG9ydEltcG9ydClcclxuXHRcdFx0LmFwcGVuZFRvKG1lbnUpO1xyXG5cdFxyXG5cdFx0Ly8gc3Vic2NyaWJlIHRvIHN0YXRlVXBkYXRlc1xyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5zdWJzY3JpYmUoRW5naW5lLmhhbmRsZVN0YXRlVXBkYXRlcyk7XHJcblxyXG5cdFx0JFNNLmluaXQoKTtcclxuXHRcdE5vdGlmaWNhdGlvbnMuaW5pdCgpO1xyXG5cdFx0RXZlbnRzLmluaXQoKTtcclxuXHRcdFZpbGxhZ2UuaW5pdCgpO1xyXG5cdFx0Q2hhcmFjdGVyLmluaXQoKTtcclxuXHRcdFdlYXRoZXIuaW5pdCgpO1xyXG5cdFx0aWYoJFNNLmdldCgncm9hZC5vcGVuJykpIHtcclxuXHRcdFx0Um9hZC5pbml0KCk7XHJcblx0XHR9XHJcblx0XHRpZigkU00uZ2V0KCdvdXRwb3N0Lm9wZW4nKSkge1xyXG5cdFx0XHRPdXRwb3N0LmluaXQoKTtcclxuXHRcdH1cclxuXHJcblx0XHRFbmdpbmUuc2F2ZUxhbmd1YWdlKCk7XHJcblx0XHRFbmdpbmUudHJhdmVsVG8oVmlsbGFnZSk7XHJcblxyXG5cdH0sXHJcblx0XHJcblx0YnJvd3NlclZhbGlkOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAoIGxvY2F0aW9uLnNlYXJjaC5pbmRleE9mKCAnaWdub3JlYnJvd3Nlcj10cnVlJyApID49IDAgfHwgKCB0eXBlb2YgU3RvcmFnZSAhPSAndW5kZWZpbmVkJyAmJiAhb2xkSUUgKSApO1xyXG5cdH0sXHJcblx0XHJcblx0aXNNb2JpbGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuICggbG9jYXRpb24uc2VhcmNoLmluZGV4T2YoICdpZ25vcmVicm93c2VyPXRydWUnICkgPCAwICYmIC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeS9pLnRlc3QoIG5hdmlnYXRvci51c2VyQWdlbnQgKSApO1xyXG5cdH0sXHJcblx0XHJcblx0c2F2ZUdhbWU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYodHlwZW9mIFN0b3JhZ2UgIT0gJ3VuZGVmaW5lZCcgJiYgbG9jYWxTdG9yYWdlKSB7XHJcblx0XHRcdGlmKEVuZ2luZS5fc2F2ZVRpbWVyICE9IG51bGwpIHtcclxuXHRcdFx0XHRjbGVhclRpbWVvdXQoRW5naW5lLl9zYXZlVGltZXIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHR5cGVvZiBFbmdpbmUuX2xhc3ROb3RpZnkgPT0gJ3VuZGVmaW5lZCcgfHwgRGF0ZS5ub3coKSAtIEVuZ2luZS5fbGFzdE5vdGlmeSA+IEVuZ2luZS5TQVZFX0RJU1BMQVkpe1xyXG5cdFx0XHRcdCQoJyNzYXZlTm90aWZ5JykuY3NzKCdvcGFjaXR5JywgMSkuYW5pbWF0ZSh7b3BhY2l0eTogMH0sIDEwMDAsICdsaW5lYXInKTtcclxuXHRcdFx0XHRFbmdpbmUuX2xhc3ROb3RpZnkgPSBEYXRlLm5vdygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxvY2FsU3RvcmFnZS5nYW1lU3RhdGUgPSBKU09OLnN0cmluZ2lmeShTdGF0ZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRsb2FkR2FtZTogZnVuY3Rpb24oKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR2YXIgc2F2ZWRTdGF0ZSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdhbWVTdGF0ZSk7XHJcblx0XHRcdGlmKHNhdmVkU3RhdGUpIHtcclxuXHRcdFx0XHR3aW5kb3cuU3RhdGUgPSBzYXZlZFN0YXRlO1xyXG5cdFx0XHRcdEVuZ2luZS5sb2coXCJsb2FkZWQgc2F2ZSFcIik7XHJcblx0XHRcdH1cclxuXHRcdH0gY2F0Y2goZSkge1xyXG5cdFx0XHRFbmdpbmUubG9nKGUpO1xyXG5cdFx0XHR3aW5kb3cuU3RhdGUgPSB7fTtcclxuXHRcdFx0JFNNLnNldCgndmVyc2lvbicsIEVuZ2luZS5WRVJTSU9OKTtcclxuXHRcdFx0RW5naW5lLmV2ZW50KCdwcm9ncmVzcycsICduZXcgZ2FtZScpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0ZXhwb3J0SW1wb3J0OiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ0V4cG9ydCAvIEltcG9ydCcpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdleHBvcnQgb3IgaW1wb3J0IHNhdmUgZGF0YSwgZm9yIGJhY2tpbmcgdXAnKSxcclxuXHRcdFx0XHRcdFx0Xygnb3IgbWlncmF0aW5nIGNvbXB1dGVycycpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnZXhwb3J0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2V4cG9ydCcpLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBFbmdpbmUuZXhwb3J0NjRcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2ltcG9ydCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdpbXBvcnQnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnY29uZmlybSd9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdjYW5jZWwnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnY2FuY2VsJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnY29uZmlybSc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnYXJlIHlvdSBzdXJlPycpLFxyXG5cdFx0XHRcdFx0XHRfKCdpZiB0aGUgY29kZSBpcyBpbnZhbGlkLCBhbGwgZGF0YSB3aWxsIGJlIGxvc3QuJyksXHJcblx0XHRcdFx0XHRcdF8oJ3RoaXMgaXMgaXJyZXZlcnNpYmxlLicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQneWVzJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ3llcycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdpbnB1dEltcG9ydCd9LFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBFbmdpbmUuZW5hYmxlU2VsZWN0aW9uXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdubyc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdubycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J2lucHV0SW1wb3J0Jzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW18oJ3B1dCB0aGUgc2F2ZSBjb2RlIGhlcmUuJyldLFxyXG5cdFx0XHRcdFx0dGV4dGFyZWE6ICcnLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnb2theSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdpbXBvcnQnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBFbmdpbmUuaW1wb3J0NjRcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2NhbmNlbCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdjYW5jZWwnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGdlbmVyYXRlRXhwb3J0NjQ6IGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgc3RyaW5nNjQgPSBCYXNlNjQuZW5jb2RlKGxvY2FsU3RvcmFnZS5nYW1lU3RhdGUpO1xyXG5cdFx0c3RyaW5nNjQgPSBzdHJpbmc2NC5yZXBsYWNlKC9cXHMvZywgJycpO1xyXG5cdFx0c3RyaW5nNjQgPSBzdHJpbmc2NC5yZXBsYWNlKC9cXC4vZywgJycpO1xyXG5cdFx0c3RyaW5nNjQgPSBzdHJpbmc2NC5yZXBsYWNlKC9cXG4vZywgJycpO1xyXG5cclxuXHRcdHJldHVybiBzdHJpbmc2NDtcclxuXHR9LFxyXG5cclxuXHRleHBvcnQ2NDogZnVuY3Rpb24oKSB7XHJcblx0XHRFbmdpbmUuc2F2ZUdhbWUoKTtcclxuXHRcdHZhciBzdHJpbmc2NCA9IEVuZ2luZS5nZW5lcmF0ZUV4cG9ydDY0KCk7XHJcblx0XHRFbmdpbmUuZW5hYmxlU2VsZWN0aW9uKCk7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdFeHBvcnQnKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtfKCdzYXZlIHRoaXMuJyldLFxyXG5cdFx0XHRcdFx0dGV4dGFyZWE6IHN0cmluZzY0LFxyXG5cdFx0XHRcdFx0cmVhZG9ubHk6IHRydWUsXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdkb25lJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2dvdCBpdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IEVuZ2luZS5kaXNhYmxlU2VsZWN0aW9uXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0RW5naW5lLmF1dG9TZWxlY3QoJyNkZXNjcmlwdGlvbiB0ZXh0YXJlYScpO1xyXG5cdH0sXHJcblxyXG5cdGltcG9ydDY0OiBmdW5jdGlvbihzdHJpbmc2NCkge1xyXG5cdFx0RW5naW5lLmRpc2FibGVTZWxlY3Rpb24oKTtcclxuXHRcdHN0cmluZzY0ID0gc3RyaW5nNjQucmVwbGFjZSgvXFxzL2csICcnKTtcclxuXHRcdHN0cmluZzY0ID0gc3RyaW5nNjQucmVwbGFjZSgvXFwuL2csICcnKTtcclxuXHRcdHN0cmluZzY0ID0gc3RyaW5nNjQucmVwbGFjZSgvXFxuL2csICcnKTtcclxuXHRcdHZhciBkZWNvZGVkU2F2ZSA9IEJhc2U2NC5kZWNvZGUoc3RyaW5nNjQpO1xyXG5cdFx0bG9jYWxTdG9yYWdlLmdhbWVTdGF0ZSA9IGRlY29kZWRTYXZlO1xyXG5cdFx0bG9jYXRpb24ucmVsb2FkKCk7XHJcblx0fSxcclxuXHJcblx0ZXZlbnQ6IGZ1bmN0aW9uKGNhdCwgYWN0KSB7XHJcblx0XHRpZih0eXBlb2YgZ2EgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCBjYXQsIGFjdCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Y29uZmlybURlbGV0ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdSZXN0YXJ0PycpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0dGV4dDogW18oJ3Jlc3RhcnQgdGhlIGdhbWU/JyldLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQneWVzJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ3llcycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IEVuZ2luZS5kZWxldGVTYXZlXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdubyc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdubycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0ZGVsZXRlU2F2ZTogZnVuY3Rpb24obm9SZWxvYWQpIHtcclxuXHRcdGlmKHR5cGVvZiBTdG9yYWdlICE9ICd1bmRlZmluZWQnICYmIGxvY2FsU3RvcmFnZSkge1xyXG5cdFx0XHR3aW5kb3cuU3RhdGUgPSB7fTtcclxuXHRcdFx0bG9jYWxTdG9yYWdlLmNsZWFyKCk7XHJcblx0XHR9XHJcblx0XHRpZighbm9SZWxvYWQpIHtcclxuXHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0c2hhcmU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnU2hhcmUnKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtfKCdicmluZyB5b3VyIGZyaWVuZHMuJyldLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnZmFjZWJvb2snOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnZmFjZWJvb2snKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5vcGVuKCdodHRwczovL3d3dy5mYWNlYm9vay5jb20vc2hhcmVyL3NoYXJlci5waHA/dT0nICsgRW5naW5lLlNJVEVfVVJMLCAnc2hhcmVyJywgJ3dpZHRoPTYyNixoZWlnaHQ9NDM2LGxvY2F0aW9uPW5vLG1lbnViYXI9bm8scmVzaXphYmxlPW5vLHNjcm9sbGJhcnM9bm8sc3RhdHVzPW5vLHRvb2xiYXI9bm8nKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdnb29nbGUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDpfKCdnb29nbGUrJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR3aW5kb3cub3BlbignaHR0cHM6Ly9wbHVzLmdvb2dsZS5jb20vc2hhcmU/dXJsPScgKyBFbmdpbmUuU0lURV9VUkwsICdzaGFyZXInLCAnd2lkdGg9NDgwLGhlaWdodD00MzYsbG9jYXRpb249bm8sbWVudWJhcj1ubyxyZXNpemFibGU9bm8sc2Nyb2xsYmFycz1ubyxzdGF0dXM9bm8sdG9vbGJhcj1ubycpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J3R3aXR0ZXInOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygndHdpdHRlcicpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0d2luZG93Lm9wZW4oJ2h0dHBzOi8vdHdpdHRlci5jb20vaW50ZW50L3R3ZWV0P3RleHQ9QSUyMERhcmslMjBSb29tJnVybD0nICsgRW5naW5lLlNJVEVfVVJMLCAnc2hhcmVyJywgJ3dpZHRoPTY2MCxoZWlnaHQ9MjYwLGxvY2F0aW9uPW5vLG1lbnViYXI9bm8scmVzaXphYmxlPW5vLHNjcm9sbGJhcnM9eWVzLHN0YXR1cz1ubyx0b29sYmFyPW5vJyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQncmVkZGl0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ3JlZGRpdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0d2luZG93Lm9wZW4oJ2h0dHA6Ly93d3cucmVkZGl0LmNvbS9zdWJtaXQ/dXJsPScgKyBFbmdpbmUuU0lURV9VUkwsICdzaGFyZXInLCAnd2lkdGg9OTYwLGhlaWdodD03MDAsbG9jYXRpb249bm8sbWVudWJhcj1ubyxyZXNpemFibGU9bm8sc2Nyb2xsYmFycz15ZXMsc3RhdHVzPW5vLHRvb2xiYXI9bm8nKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdjbG9zZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdjbG9zZScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0d2lkdGg6ICc0MDBweCdcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGZpbmRTdHlsZXNoZWV0OiBmdW5jdGlvbih0aXRsZSkge1xyXG5cdFx0Zm9yKHZhciBpPTA7IGk8ZG9jdW1lbnQuc3R5bGVTaGVldHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIHNoZWV0ID0gZG9jdW1lbnQuc3R5bGVTaGVldHNbaV07XHJcblx0XHRcdGlmKHNoZWV0LnRpdGxlID09IHRpdGxlKSB7XHJcblx0XHRcdFx0cmV0dXJuIHNoZWV0O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9LFxyXG5cclxuXHRpc0xpZ2h0c09mZjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgZGFya0NzcyA9IEVuZ2luZS5maW5kU3R5bGVzaGVldCgnZGFya2VuTGlnaHRzJyk7XHJcblx0XHRpZiAoIGRhcmtDc3MgIT0gbnVsbCAmJiAhZGFya0Nzcy5kaXNhYmxlZCApIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHJcblx0dHVybkxpZ2h0c09mZjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgZGFya0NzcyA9IEVuZ2luZS5maW5kU3R5bGVzaGVldCgnZGFya2VuTGlnaHRzJyk7XHJcblx0XHRpZiAoZGFya0NzcyA9PSBudWxsKSB7XHJcblx0XHRcdCQoJ2hlYWQnKS5hcHBlbmQoJzxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiY3NzL2RhcmsuY3NzXCIgdHlwZT1cInRleHQvY3NzXCIgdGl0bGU9XCJkYXJrZW5MaWdodHNcIiAvPicpO1xyXG5cdFx0XHQkKCcubGlnaHRzT2ZmJykudGV4dChfKCdsaWdodHMgb24uJykpO1xyXG5cdFx0fSBlbHNlIGlmIChkYXJrQ3NzLmRpc2FibGVkKSB7XHJcblx0XHRcdGRhcmtDc3MuZGlzYWJsZWQgPSBmYWxzZTtcclxuXHRcdFx0JCgnLmxpZ2h0c09mZicpLnRleHQoXygnbGlnaHRzIG9uLicpKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQoXCIjZGFya2VuTGlnaHRzXCIpLmF0dHIoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpO1xyXG5cdFx0XHRkYXJrQ3NzLmRpc2FibGVkID0gdHJ1ZTtcclxuXHRcdFx0JCgnLmxpZ2h0c09mZicpLnRleHQoXygnbGlnaHRzIG9mZi4nKSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Ly8gR2V0cyBhIGd1aWRcclxuXHRnZXRHdWlkOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uKGMpIHtcclxuXHRcdFx0dmFyIHIgPSBNYXRoLnJhbmRvbSgpKjE2fDAsIHYgPSBjID09ICd4JyA/IHIgOiAociYweDN8MHg4KTtcclxuXHRcdFx0cmV0dXJuIHYudG9TdHJpbmcoMTYpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0YWN0aXZlTW9kdWxlOiBudWxsLFxyXG5cclxuXHR0cmF2ZWxUbzogZnVuY3Rpb24obW9kdWxlKSB7XHJcblx0XHRpZihFbmdpbmUuYWN0aXZlTW9kdWxlICE9IG1vZHVsZSkge1xyXG5cdFx0XHR2YXIgY3VycmVudEluZGV4ID0gRW5naW5lLmFjdGl2ZU1vZHVsZSA/ICQoJy5sb2NhdGlvbicpLmluZGV4KEVuZ2luZS5hY3RpdmVNb2R1bGUucGFuZWwpIDogMTtcclxuXHRcdFx0JCgnZGl2LmhlYWRlckJ1dHRvbicpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xyXG5cdFx0XHRtb2R1bGUudGFiLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xyXG5cclxuXHRcdFx0dmFyIHNsaWRlciA9ICQoJyNsb2NhdGlvblNsaWRlcicpO1xyXG5cdFx0XHR2YXIgc3RvcmVzID0gJCgnI3N0b3Jlc0NvbnRhaW5lcicpO1xyXG5cdFx0XHR2YXIgcGFuZWxJbmRleCA9ICQoJy5sb2NhdGlvbicpLmluZGV4KG1vZHVsZS5wYW5lbCk7XHJcblx0XHRcdHZhciBkaWZmID0gTWF0aC5hYnMocGFuZWxJbmRleCAtIGN1cnJlbnRJbmRleCk7XHJcblx0XHRcdHNsaWRlci5hbmltYXRlKHtsZWZ0OiAtKHBhbmVsSW5kZXggKiA3MDApICsgJ3B4J30sIDMwMCAqIGRpZmYpO1xyXG5cclxuXHRcdFx0aWYoJFNNLmdldCgnc3RvcmVzLndvb2QnKSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdC8vIEZJWE1FIFdoeSBkb2VzIHRoaXMgd29yayBpZiB0aGVyZSdzIGFuIGFuaW1hdGlvbiBxdWV1ZS4uLj9cclxuXHRcdFx0XHRzdG9yZXMuYW5pbWF0ZSh7cmlnaHQ6IC0ocGFuZWxJbmRleCAqIDcwMCkgKyAncHgnfSwgMzAwICogZGlmZik7XHJcblx0XHRcdH1cclxuXHRcdFxyXG5cdFx0XHRFbmdpbmUuYWN0aXZlTW9kdWxlID0gbW9kdWxlO1xyXG5cclxuXHRcdFx0bW9kdWxlLm9uQXJyaXZhbChkaWZmKTtcclxuXHJcblx0XHRcdGlmKEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gVmlsbGFnZVxyXG5cdFx0XHRcdC8vICB8fCBFbmdpbmUuYWN0aXZlTW9kdWxlID09IFBhdGhcclxuXHRcdFx0XHQpIHtcclxuXHRcdFx0XHQvLyBEb24ndCBmYWRlIG91dCB0aGUgd2VhcG9ucyBpZiB3ZSdyZSBzd2l0Y2hpbmcgdG8gYSBtb2R1bGVcclxuXHRcdFx0XHQvLyB3aGVyZSB3ZSdyZSBnb2luZyB0byBrZWVwIHNob3dpbmcgdGhlbSBhbnl3YXkuXHJcblx0XHRcdFx0aWYgKG1vZHVsZSAhPSBWaWxsYWdlIFxyXG5cdFx0XHRcdFx0Ly8gJiYgbW9kdWxlICE9IFBhdGhcclxuXHRcdFx0XHQpIHtcclxuXHRcdFx0XHRcdCQoJ2RpdiN3ZWFwb25zJykuYW5pbWF0ZSh7b3BhY2l0eTogMH0sIDMwMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZihtb2R1bGUgPT0gVmlsbGFnZVxyXG5cdFx0XHRcdC8vICB8fCBtb2R1bGUgPT0gUGF0aFxyXG5cdFx0XHRcdCkge1xyXG5cdFx0XHRcdCQoJ2RpdiN3ZWFwb25zJykuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIDMwMCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdE5vdGlmaWNhdGlvbnMucHJpbnRRdWV1ZShtb2R1bGUpO1xyXG5cdFx0XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0LyogTW92ZSB0aGUgc3RvcmVzIHBhbmVsIGJlbmVhdGggdG9wX2NvbnRhaW5lciAob3IgdG8gdG9wOiAwcHggaWYgdG9wX2NvbnRhaW5lclxyXG5cdFx0KiBlaXRoZXIgaGFzbid0IGJlZW4gZmlsbGVkIGluIG9yIGlzIG51bGwpIHVzaW5nIHRyYW5zaXRpb25fZGlmZiB0byBzeW5jIHdpdGhcclxuXHRcdCogdGhlIGFuaW1hdGlvbiBpbiBFbmdpbmUudHJhdmVsVG8oKS5cclxuXHRcdCovXHJcblx0bW92ZVN0b3Jlc1ZpZXc6IGZ1bmN0aW9uKHRvcF9jb250YWluZXIsIHRyYW5zaXRpb25fZGlmZikge1xyXG5cdFx0dmFyIHN0b3JlcyA9ICQoJyNzdG9yZXNDb250YWluZXInKTtcclxuXHJcblx0XHQvLyBJZiB3ZSBkb24ndCBoYXZlIGEgc3RvcmVzQ29udGFpbmVyIHlldCwgbGVhdmUuXHJcblx0XHRpZih0eXBlb2Yoc3RvcmVzKSA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybjtcclxuXHJcblx0XHRpZih0eXBlb2YodHJhbnNpdGlvbl9kaWZmKSA9PT0gJ3VuZGVmaW5lZCcpIHRyYW5zaXRpb25fZGlmZiA9IDE7XHJcblxyXG5cdFx0aWYodG9wX2NvbnRhaW5lciA9PT0gbnVsbCkge1xyXG5cdFx0XHRzdG9yZXMuYW5pbWF0ZSh7dG9wOiAnMHB4J30sIHtxdWV1ZTogZmFsc2UsIGR1cmF0aW9uOiAzMDAgKiB0cmFuc2l0aW9uX2RpZmZ9KTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYoIXRvcF9jb250YWluZXIubGVuZ3RoKSB7XHJcblx0XHRcdHN0b3Jlcy5hbmltYXRlKHt0b3A6ICcwcHgnfSwge3F1ZXVlOiBmYWxzZSwgZHVyYXRpb246IDMwMCAqIHRyYW5zaXRpb25fZGlmZn0pO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHN0b3Jlcy5hbmltYXRlKHtcclxuXHRcdFx0XHRcdHRvcDogdG9wX2NvbnRhaW5lci5oZWlnaHQoKSArIDI2ICsgJ3B4J1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0cXVldWU6IGZhbHNlLCBcclxuXHRcdFx0XHRcdGR1cmF0aW9uOiAzMDAgKiB0cmFuc2l0aW9uX2RpZmZcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0bG9nOiBmdW5jdGlvbihtc2cpIHtcclxuXHRcdGlmKHRoaXMuX2xvZykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhtc2cpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHVwZGF0ZVNsaWRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgc2xpZGVyID0gJCgnI2xvY2F0aW9uU2xpZGVyJyk7XHJcblx0XHRzbGlkZXIud2lkdGgoKHNsaWRlci5jaGlsZHJlbigpLmxlbmd0aCAqIDcwMCkgKyAncHgnKTtcclxuXHR9LFxyXG5cclxuXHR1cGRhdGVPdXRlclNsaWRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgc2xpZGVyID0gJCgnI291dGVyU2xpZGVyJyk7XHJcblx0XHRzbGlkZXIud2lkdGgoKHNsaWRlci5jaGlsZHJlbigpLmxlbmd0aCAqIDcwMCkgKyAncHgnKTtcclxuXHR9LFxyXG5cclxuXHRnZXRJbmNvbWVNc2c6IGZ1bmN0aW9uKG51bSwgZGVsYXkpIHtcclxuXHRcdHJldHVybiBfKFwiezB9IHBlciB7MX1zXCIsIChudW0gPiAwID8gXCIrXCIgOiBcIlwiKSArIG51bSwgZGVsYXkpO1xyXG5cdH0sXHJcblxyXG5cdHN3aXBlTGVmdDogZnVuY3Rpb24oZSkge1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZS5zd2lwZUxlZnQpIHtcclxuXHRcdFx0RW5naW5lLmFjdGl2ZU1vZHVsZS5zd2lwZUxlZnQoZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0c3dpcGVSaWdodDogZnVuY3Rpb24oZSkge1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZS5zd2lwZVJpZ2h0KSB7XHJcblx0XHRcdEVuZ2luZS5hY3RpdmVNb2R1bGUuc3dpcGVSaWdodChlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRzd2lwZVVwOiBmdW5jdGlvbihlKSB7XHJcblx0XHRpZihFbmdpbmUuYWN0aXZlTW9kdWxlLnN3aXBlVXApIHtcclxuXHRcdFx0RW5naW5lLmFjdGl2ZU1vZHVsZS5zd2lwZVVwKGUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHN3aXBlRG93bjogZnVuY3Rpb24oZSkge1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZS5zd2lwZURvd24pIHtcclxuXHRcdFx0RW5naW5lLmFjdGl2ZU1vZHVsZS5zd2lwZURvd24oZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0ZGlzYWJsZVNlbGVjdGlvbjogZnVuY3Rpb24oKSB7XHJcblx0XHRkb2N1bWVudC5vbnNlbGVjdHN0YXJ0ID0gZXZlbnROdWxsaWZpZXI7IC8vIHRoaXMgaXMgZm9yIElFXHJcblx0XHRkb2N1bWVudC5vbm1vdXNlZG93biA9IGV2ZW50TnVsbGlmaWVyOyAvLyB0aGlzIGlzIGZvciB0aGUgcmVzdFxyXG5cdH0sXHJcblxyXG5cdGVuYWJsZVNlbGVjdGlvbjogZnVuY3Rpb24oKSB7XHJcblx0XHRkb2N1bWVudC5vbnNlbGVjdHN0YXJ0ID0gZXZlbnRQYXNzdGhyb3VnaDtcclxuXHRcdGRvY3VtZW50Lm9ubW91c2Vkb3duID0gZXZlbnRQYXNzdGhyb3VnaDtcclxuXHR9LFxyXG5cclxuXHRhdXRvU2VsZWN0OiBmdW5jdGlvbihzZWxlY3Rvcikge1xyXG5cdFx0JChzZWxlY3RvcikuZm9jdXMoKS5zZWxlY3QoKTtcclxuXHR9LFxyXG5cclxuXHRoYW5kbGVTdGF0ZVVwZGF0ZXM6IGZ1bmN0aW9uKGUpe1xyXG5cdFxyXG5cdH0sXHJcblxyXG5cdHN3aXRjaExhbmd1YWdlOiBmdW5jdGlvbihkb20pe1xyXG5cdFx0dmFyIGxhbmcgPSAkKGRvbSkuZGF0YShcImxhbmd1YWdlXCIpO1xyXG5cdFx0aWYoZG9jdW1lbnQubG9jYXRpb24uaHJlZi5zZWFyY2goL1tcXD9cXCZdbGFuZz1bYS16X10rLykgIT0gLTEpe1xyXG5cdFx0XHRkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gZG9jdW1lbnQubG9jYXRpb24uaHJlZi5yZXBsYWNlKCAvKFtcXD9cXCZdbGFuZz0pKFthLXpfXSspL2dpICwgXCIkMVwiK2xhbmcgKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gZG9jdW1lbnQubG9jYXRpb24uaHJlZiArICggKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYuc2VhcmNoKC9cXD8vKSAhPSAtMSApP1wiJlwiOlwiP1wiKSArIFwibGFuZz1cIitsYW5nO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHNhdmVMYW5ndWFnZTogZnVuY3Rpb24oKXtcclxuXHRcdHZhciBsYW5nID0gZGVjb2RlVVJJQ29tcG9uZW50KChuZXcgUmVnRXhwKCdbP3wmXWxhbmc9JyArICcoW14mO10rPykoJnwjfDt8JCknKS5leGVjKGxvY2F0aW9uLnNlYXJjaCl8fFssXCJcIl0pWzFdLnJlcGxhY2UoL1xcKy9nLCAnJTIwJykpfHxudWxsO1x0XHJcblx0XHRpZihsYW5nICYmIHR5cGVvZiBTdG9yYWdlICE9ICd1bmRlZmluZWQnICYmIGxvY2FsU3RvcmFnZSkge1xyXG5cdFx0XHRsb2NhbFN0b3JhZ2UubGFuZyA9IGxhbmc7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0c2V0VGltZW91dDogZnVuY3Rpb24oY2FsbGJhY2ssIHRpbWVvdXQsIHNraXBEb3VibGU/KXtcclxuXHJcblx0XHRpZiggRW5naW5lLm9wdGlvbnMuZG91YmxlVGltZSAmJiAhc2tpcERvdWJsZSApe1xyXG5cdFx0XHRFbmdpbmUubG9nKCdEb3VibGUgdGltZSwgY3V0dGluZyB0aW1lb3V0IGluIGhhbGYnKTtcclxuXHRcdFx0dGltZW91dCAvPSAyO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBzZXRUaW1lb3V0KGNhbGxiYWNrLCB0aW1lb3V0KTtcclxuXHJcblx0fVxyXG5cclxufTtcclxuXHJcbmZ1bmN0aW9uIGV2ZW50TnVsbGlmaWVyKGUpIHtcclxuXHRyZXR1cm4gJChlLnRhcmdldCkuaGFzQ2xhc3MoJ21lbnVCdG4nKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZXZlbnRQYXNzdGhyb3VnaChlKSB7XHJcblx0cmV0dXJuIHRydWU7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBpblZpZXcoZGlyLCBlbGVtKXtcclxuXHJcbiAgICAgICAgdmFyIHNjVG9wID0gJCgnI21haW4nKS5vZmZzZXQoKS50b3A7XHJcbiAgICAgICAgdmFyIHNjQm90ID0gc2NUb3AgKyAkKCcjbWFpbicpLmhlaWdodCgpO1xyXG5cclxuICAgICAgICB2YXIgZWxUb3AgPSBlbGVtLm9mZnNldCgpLnRvcDtcclxuICAgICAgICB2YXIgZWxCb3QgPSBlbFRvcCArIGVsZW0uaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIGlmKCBkaXIgPT0gJ3VwJyApe1xyXG4gICAgICAgICAgICAgICAgLy8gU1RPUCBNT1ZJTkcgSUYgQk9UVE9NIE9GIEVMRU1FTlQgSVMgVklTSUJMRSBJTiBTQ1JFRU5cclxuICAgICAgICAgICAgICAgIHJldHVybiAoIGVsQm90IDwgc2NCb3QgKTtcclxuICAgICAgICB9ZWxzZSBpZiggZGlyID09ICdkb3duJyApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICggZWxUb3AgPiBzY1RvcCApO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICggKCBlbEJvdCA8PSBzY0JvdCApICYmICggZWxUb3AgPj0gc2NUb3AgKSApO1xyXG4gICAgICAgIH1cclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNjcm9sbEJ5WChlbGVtLCB4KXtcclxuXHJcbiAgICAgICAgdmFyIGVsVG9wID0gcGFyc2VJbnQoIGVsZW0uY3NzKCd0b3AnKSwgMTAgKTtcclxuICAgICAgICBlbGVtLmNzcyggJ3RvcCcsICggZWxUb3AgKyB4ICkgKyBcInB4XCIgKTtcclxuXHJcbn1cclxuXHJcblxyXG4vL2NyZWF0ZSBqUXVlcnkgQ2FsbGJhY2tzKCkgdG8gaGFuZGxlIG9iamVjdCBldmVudHMgXHJcbiQuRGlzcGF0Y2ggPSBmdW5jdGlvbiggaWQgKSB7XHJcblx0dmFyIGNhbGxiYWNrcywgdG9waWMgPSBpZCAmJiBFbmdpbmUudG9waWNzWyBpZCBdO1xyXG5cdGlmICggIXRvcGljICkge1xyXG5cdFx0Y2FsbGJhY2tzID0galF1ZXJ5LkNhbGxiYWNrcygpO1xyXG5cdFx0dG9waWMgPSB7XHJcblx0XHRcdFx0cHVibGlzaDogY2FsbGJhY2tzLmZpcmUsXHJcblx0XHRcdFx0c3Vic2NyaWJlOiBjYWxsYmFja3MuYWRkLFxyXG5cdFx0XHRcdHVuc3Vic2NyaWJlOiBjYWxsYmFja3MucmVtb3ZlXHJcblx0XHR9O1xyXG5cdFx0aWYgKCBpZCApIHtcclxuXHRcdFx0RW5naW5lLnRvcGljc1sgaWQgXSA9IHRvcGljO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gdG9waWM7XHJcbn07XHJcblxyXG4kKGZ1bmN0aW9uKCkge1xyXG5cdEVuZ2luZS5pbml0KCk7XHJcbn0pO1xyXG5cclxuIiwiLyoqXHJcbiAqIE1vZHVsZSB0aGF0IGhhbmRsZXMgdGhlIHJhbmRvbSBldmVudCBzeXN0ZW1cclxuICovXHJcbmltcG9ydCB7IEV2ZW50c1JvYWRXYW5kZXIgfSBmcm9tIFwiLi9ldmVudHMvcm9hZHdhbmRlclwiO1xyXG5pbXBvcnQgeyBFdmVudHNWaWxsYWdlIH0gZnJvbSBcIi4vZXZlbnRzL3ZpbGxhZ2VcIjtcclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4vZW5naW5lXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tIFwiLi9ub3RpZmljYXRpb25zXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuL0J1dHRvblwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBRFJFdmVudCB7XHJcblx0dGl0bGU6IHN0cmluZyxcclxuXHRpc0F2YWlsYWJsZT86IEZ1bmN0aW9uLFxyXG5cdGlzU3VwZXJMaWtlbHk/OiBGdW5jdGlvbixcclxuXHRzY2VuZXM6IHtcclxuXHRcdC8vIHR5cGUgdGhpcyBvdXQgYmV0dGVyIHVzaW5nIEluZGV4IFNpZ25hdHVyZXNcclxuXHR9LFxyXG5cdGV2ZW50UGFuZWw/OiBhbnlcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTY2VuZSB7XHJcblx0c2VlbkZsYWc6IEZ1bmN0aW9uLFxyXG5cdG5leHRTY2VuZTogc3RyaW5nLFxyXG5cdG9uTG9hZDogRnVuY3Rpb24sXHJcblx0dGV4dDogQXJyYXk8c3RyaW5nPixcclxuXHRidXR0b25zOiB7XHJcblx0XHRbaWQ6IHN0cmluZ106IEV2ZW50QnV0dG9uXHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50QnV0dG9uIHtcclxuXHR0ZXh0OiBzdHJpbmcsXHJcblx0bmV4dFNjZW5lOiB7XHJcblx0XHRbaWQ6IG51bWJlcl06IHN0cmluZ1xyXG5cdH0sXHJcblx0b25DaG9vc2U6IEZ1bmN0aW9uXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBFdmVudHMgPSB7XHJcblx0XHRcclxuXHRfRVZFTlRfVElNRV9SQU5HRTogWzMsIDZdLCAvLyByYW5nZSwgaW4gbWludXRlc1xyXG5cdF9QQU5FTF9GQURFOiAyMDAsXHJcblx0X0ZJR0hUX1NQRUVEOiAxMDAsXHJcblx0X0VBVF9DT09MRE9XTjogNSxcclxuXHRfTUVEU19DT09MRE9XTjogNyxcclxuXHRfTEVBVkVfQ09PTERPV046IDEsXHJcblx0U1RVTl9EVVJBVElPTjogNDAwMCxcclxuXHRCTElOS19JTlRFUlZBTDogZmFsc2UsXHJcblxyXG5cdEV2ZW50UG9vbDogPGFueT5bXSxcclxuXHRldmVudFN0YWNrOiA8YW55PltdLFxyXG5cdF9ldmVudFRpbWVvdXQ6IDAsXHJcblxyXG5cdExvY2F0aW9uczoge30sXHJcblxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdFx0XHJcblx0XHQvLyBCdWlsZCB0aGUgRXZlbnQgUG9vbFxyXG5cdFx0RXZlbnRzLkV2ZW50UG9vbCA9IFtdLmNvbmNhdChcclxuXHRcdFx0RXZlbnRzVmlsbGFnZSBhcyBhbnksXHJcblx0XHRcdEV2ZW50c1JvYWRXYW5kZXIgYXMgYW55XHJcblx0XHQpO1xyXG5cclxuXHRcdHRoaXMuTG9jYXRpb25zW1wiVmlsbGFnZVwiXSA9IEV2ZW50c1ZpbGxhZ2U7XHJcblx0XHR0aGlzLkxvY2F0aW9uc1tcIlJvYWRXYW5kZXJcIl0gPSBFdmVudHNSb2FkV2FuZGVyO1xyXG5cdFx0XHJcblx0XHRFdmVudHMuZXZlbnRTdGFjayA9IFtdO1xyXG5cdFx0XHJcblx0XHQvL3N1YnNjcmliZSB0byBzdGF0ZVVwZGF0ZXNcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdCQuRGlzcGF0Y2goJ3N0YXRlVXBkYXRlJykuc3Vic2NyaWJlKEV2ZW50cy5oYW5kbGVTdGF0ZVVwZGF0ZXMpO1xyXG5cdH0sXHJcblx0XHJcblx0b3B0aW9uczoge30sIC8vIE5vdGhpbmcgZm9yIG5vd1xyXG4gICAgXHJcblx0YWN0aXZlU2NlbmU6ICcnLFxyXG4gICAgXHJcblx0bG9hZFNjZW5lOiBmdW5jdGlvbihuYW1lKSB7XHJcblx0XHRFbmdpbmUubG9nKCdsb2FkaW5nIHNjZW5lOiAnICsgbmFtZSk7XHJcblx0XHRFdmVudHMuYWN0aXZlU2NlbmUgPSBuYW1lO1xyXG5cdFx0dmFyIHNjZW5lID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnNjZW5lc1tuYW1lXTtcclxuXHRcdFxyXG5cdFx0Ly8gaGFuZGxlcyBvbmUtdGltZSBzY2VuZXMsIHN1Y2ggYXMgaW50cm9kdWN0aW9uc1xyXG5cdFx0Ly8gbWF5YmUgSSBjYW4gbWFrZSBhIG1vcmUgZXhwbGljaXQgXCJpbnRyb2R1Y3Rpb25cIiBsb2dpY2FsIGZsb3cgdG8gbWFrZSB0aGlzXHJcblx0XHQvLyBhIGxpdHRsZSBtb3JlIGVsZWdhbnQsIGdpdmVuIHRoYXQgdGhlcmUgd2lsbCBhbHdheXMgYmUgYW4gXCJpbnRyb2R1Y3Rpb25cIiBzY2VuZVxyXG5cdFx0Ly8gdGhhdCdzIG9ubHkgbWVhbnQgdG8gYmUgcnVuIGEgc2luZ2xlIHRpbWUuXHJcblx0XHRpZiAoc2NlbmUuc2VlbkZsYWcgJiYgc2NlbmUuc2VlbkZsYWcoKSkge1xyXG5cdFx0XHRFdmVudHMubG9hZFNjZW5lKHNjZW5lLm5leHRTY2VuZSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNjZW5lIHJld2FyZFxyXG5cdFx0aWYoc2NlbmUucmV3YXJkKSB7XHJcblx0XHRcdCRTTS5hZGRNKCdzdG9yZXMnLCBzY2VuZS5yZXdhcmQpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBvbkxvYWRcclxuXHRcdGlmKHNjZW5lLm9uTG9hZCkge1xyXG5cdFx0XHRzY2VuZS5vbkxvYWQoKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gTm90aWZ5IHRoZSBzY2VuZSBjaGFuZ2VcclxuXHRcdGlmKHNjZW5lLm5vdGlmaWNhdGlvbikge1xyXG5cdFx0XHROb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBzY2VuZS5ub3RpZmljYXRpb24pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQkKCcjZGVzY3JpcHRpb24nLCBFdmVudHMuZXZlbnRQYW5lbCgpKS5lbXB0eSgpO1xyXG5cdFx0JCgnI2J1dHRvbnMnLCBFdmVudHMuZXZlbnRQYW5lbCgpKS5lbXB0eSgpO1xyXG5cdFx0RXZlbnRzLnN0YXJ0U3Rvcnkoc2NlbmUpO1xyXG5cdH0sXHJcblx0XHJcblx0ZHJhd0Zsb2F0VGV4dDogZnVuY3Rpb24odGV4dCwgcGFyZW50KSB7XHJcblx0XHQkKCc8ZGl2PicpLnRleHQodGV4dCkuYWRkQ2xhc3MoJ2RhbWFnZVRleHQnKS5hcHBlbmRUbyhwYXJlbnQpLmFuaW1hdGUoe1xyXG5cdFx0XHQnYm90dG9tJzogJzUwcHgnLFxyXG5cdFx0XHQnb3BhY2l0eSc6ICcwJ1xyXG5cdFx0fSxcclxuXHRcdDMwMCxcclxuXHRcdCdsaW5lYXInLFxyXG5cdFx0ZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlKCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdFxyXG5cdHN0YXJ0U3Rvcnk6IGZ1bmN0aW9uKHNjZW5lKSB7XHJcblx0XHQvLyBXcml0ZSB0aGUgdGV4dFxyXG5cdFx0dmFyIGRlc2MgPSAkKCcjZGVzY3JpcHRpb24nLCBFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdGZvcih2YXIgaSBpbiBzY2VuZS50ZXh0KSB7XHJcblx0XHRcdCQoJzxkaXY+JykudGV4dChzY2VuZS50ZXh0W2ldKS5hcHBlbmRUbyhkZXNjKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYoc2NlbmUudGV4dGFyZWEgIT0gbnVsbCkge1xyXG5cdFx0XHR2YXIgdGEgPSAkKCc8dGV4dGFyZWE+JykudmFsKHNjZW5lLnRleHRhcmVhKS5hcHBlbmRUbyhkZXNjKTtcclxuXHRcdFx0aWYoc2NlbmUucmVhZG9ubHkpIHtcclxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0dGEuYXR0cigncmVhZG9ubHknLCB0cnVlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBEcmF3IHRoZSBidXR0b25zXHJcblx0XHRFdmVudHMuZHJhd0J1dHRvbnMoc2NlbmUpO1xyXG5cdH0sXHJcblx0XHJcblx0ZHJhd0J1dHRvbnM6IGZ1bmN0aW9uKHNjZW5lKSB7XHJcblx0XHR2YXIgYnRucyA9ICQoJyNidXR0b25zJywgRXZlbnRzLmV2ZW50UGFuZWwoKSk7XHJcblx0XHRmb3IodmFyIGlkIGluIHNjZW5lLmJ1dHRvbnMpIHtcclxuXHRcdFx0dmFyIGluZm8gPSBzY2VuZS5idXR0b25zW2lkXTtcclxuXHRcdFx0XHR2YXIgYiA9IFxyXG5cdFx0XHRcdC8vbmV3IFxyXG5cdFx0XHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRcdFx0aWQ6IGlkLFxyXG5cdFx0XHRcdFx0dGV4dDogaW5mby50ZXh0LFxyXG5cdFx0XHRcdFx0Y29zdDogaW5mby5jb3N0LFxyXG5cdFx0XHRcdFx0Y2xpY2s6IEV2ZW50cy5idXR0b25DbGljayxcclxuXHRcdFx0XHRcdGNvb2xkb3duOiBpbmZvLmNvb2xkb3duLFxyXG5cdFx0XHRcdFx0aW1hZ2U6IGluZm8uaW1hZ2VcclxuXHRcdFx0XHR9KS5hcHBlbmRUbyhidG5zKTtcclxuXHRcdFx0aWYodHlwZW9mIGluZm8uYXZhaWxhYmxlID09ICdmdW5jdGlvbicgJiYgIWluZm8uYXZhaWxhYmxlKCkpIHtcclxuXHRcdFx0XHRCdXR0b24uc2V0RGlzYWJsZWQoYiwgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYodHlwZW9mIGluZm8udmlzaWJsZSA9PSAnZnVuY3Rpb24nICYmICFpbmZvLnZpc2libGUoKSkge1xyXG5cdFx0XHRcdGIuaGlkZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHR5cGVvZiBpbmZvLmNvb2xkb3duID09ICdudW1iZXInKSB7XHJcblx0XHRcdFx0QnV0dG9uLmNvb2xkb3duKGIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdEV2ZW50cy51cGRhdGVCdXR0b25zKCk7XHJcblx0fSxcclxuXHRcclxuXHR1cGRhdGVCdXR0b25zOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBidG5zID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnNjZW5lc1tFdmVudHMuYWN0aXZlU2NlbmVdLmJ1dHRvbnM7XHJcblx0XHRmb3IodmFyIGJJZCBpbiBidG5zKSB7XHJcblx0XHRcdHZhciBiID0gYnRuc1tiSWRdO1xyXG5cdFx0XHR2YXIgYnRuRWwgPSAkKCcjJytiSWQsIEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0XHRpZih0eXBlb2YgYi5hdmFpbGFibGUgPT0gJ2Z1bmN0aW9uJyAmJiAhYi5hdmFpbGFibGUoKSkge1xyXG5cdFx0XHRcdEJ1dHRvbi5zZXREaXNhYmxlZChidG5FbCwgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGJ1dHRvbkNsaWNrOiBmdW5jdGlvbihidG4pIHtcclxuXHRcdHZhciBpbmZvID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnNjZW5lc1tFdmVudHMuYWN0aXZlU2NlbmVdLmJ1dHRvbnNbYnRuLmF0dHIoJ2lkJyldO1xyXG5cclxuXHRcdGlmKHR5cGVvZiBpbmZvLm9uQ2hvb3NlID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0dmFyIHRleHRhcmVhID0gRXZlbnRzLmV2ZW50UGFuZWwoKS5maW5kKCd0ZXh0YXJlYScpO1xyXG5cdFx0XHRpbmZvLm9uQ2hvb3NlKHRleHRhcmVhLmxlbmd0aCA+IDAgPyB0ZXh0YXJlYS52YWwoKSA6IG51bGwpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBSZXdhcmRcclxuXHRcdGlmKGluZm8ucmV3YXJkKSB7XHJcblx0XHRcdCRTTS5hZGRNKCdzdG9yZXMnLCBpbmZvLnJld2FyZCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdEV2ZW50cy51cGRhdGVCdXR0b25zKCk7XHJcblx0XHRcclxuXHRcdC8vIE5vdGlmaWNhdGlvblxyXG5cdFx0aWYoaW5mby5ub3RpZmljYXRpb24pIHtcclxuXHRcdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgaW5mby5ub3RpZmljYXRpb24pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBOZXh0IFNjZW5lXHJcblx0XHRpZihpbmZvLm5leHRTY2VuZSkge1xyXG5cdFx0XHRpZihpbmZvLm5leHRTY2VuZSA9PSAnZW5kJykge1xyXG5cdFx0XHRcdEV2ZW50cy5lbmRFdmVudCgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHZhciByID0gTWF0aC5yYW5kb20oKTtcclxuXHRcdFx0XHR2YXIgbG93ZXN0TWF0Y2g6IG51bGwgfCBzdHJpbmcgPSBudWxsO1xyXG5cdFx0XHRcdGZvcih2YXIgaSBpbiBpbmZvLm5leHRTY2VuZSkge1xyXG5cdFx0XHRcdFx0aWYociA8IChpIGFzIHVua25vd24gYXMgbnVtYmVyKSAmJiAobG93ZXN0TWF0Y2ggPT0gbnVsbCB8fCBpIDwgbG93ZXN0TWF0Y2gpKSB7XHJcblx0XHRcdFx0XHRcdGxvd2VzdE1hdGNoID0gaTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYobG93ZXN0TWF0Y2ggIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0RXZlbnRzLmxvYWRTY2VuZShpbmZvLm5leHRTY2VuZVtsb3dlc3RNYXRjaF0pO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRFbmdpbmUubG9nKCdFUlJPUjogbm8gc3VpdGFibGUgc2NlbmUgZm91bmQnKTtcclxuXHRcdFx0XHRFdmVudHMuZW5kRXZlbnQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8vIGJsaW5rcyB0aGUgYnJvd3NlciB3aW5kb3cgdGl0bGVcclxuXHRibGlua1RpdGxlOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0aXRsZSA9IGRvY3VtZW50LnRpdGxlO1xyXG5cclxuXHRcdC8vIGV2ZXJ5IDMgc2Vjb25kcyBjaGFuZ2UgdGl0bGUgdG8gJyoqKiBFVkVOVCAqKionLCB0aGVuIDEuNSBzZWNvbmRzIGxhdGVyLCBjaGFuZ2UgaXQgYmFjayB0byB0aGUgb3JpZ2luYWwgdGl0bGUuXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRFdmVudHMuQkxJTktfSU5URVJWQUwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuXHRcdFx0ZG9jdW1lbnQudGl0bGUgPSBfKCcqKiogRVZFTlQgKioqJyk7XHJcblx0XHRcdEVuZ2luZS5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge2RvY3VtZW50LnRpdGxlID0gdGl0bGU7fSwgMTUwMCwgdHJ1ZSk7IFxyXG5cdFx0fSwgMzAwMCk7XHJcblx0fSxcclxuXHJcblx0c3RvcFRpdGxlQmxpbms6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0Y2xlYXJJbnRlcnZhbChFdmVudHMuQkxJTktfSU5URVJWQUwpO1xyXG5cdFx0RXZlbnRzLkJMSU5LX0lOVEVSVkFMID0gZmFsc2U7XHJcblx0fSxcclxuXHRcclxuXHQvLyBNYWtlcyBhbiBldmVudCBoYXBwZW4hXHJcblx0dHJpZ2dlckV2ZW50OiBmdW5jdGlvbigpIHtcclxuXHRcdGlmKEV2ZW50cy5hY3RpdmVFdmVudCgpID09IG51bGwpIHtcclxuXHRcdFx0dmFyIHBvc3NpYmxlRXZlbnRzID0gW107XHJcblx0XHRcdGZvcih2YXIgaSBpbiBFdmVudHMuRXZlbnRQb29sKSB7XHJcblx0XHRcdFx0dmFyIGV2ZW50ID0gRXZlbnRzLkV2ZW50UG9vbFtpXTtcclxuXHRcdFx0XHRpZihldmVudC5pc0F2YWlsYWJsZSgpKSB7XHJcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0XHRwb3NzaWJsZUV2ZW50cy5wdXNoKGV2ZW50KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKHBvc3NpYmxlRXZlbnRzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRcdEV2ZW50cy5zY2hlZHVsZU5leHRFdmVudCgwLjUpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR2YXIgciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoocG9zc2libGVFdmVudHMubGVuZ3RoKSk7XHJcblx0XHRcdFx0RXZlbnRzLnN0YXJ0RXZlbnQocG9zc2libGVFdmVudHNbcl0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0RXZlbnRzLnNjaGVkdWxlTmV4dEV2ZW50KCk7XHJcblx0fSxcclxuXHJcblx0Ly8gbm90IHNjaGVkdWxlZCwgdGhpcyBpcyBmb3Igc3R1ZmYgbGlrZSBsb2NhdGlvbi1iYXNlZCByYW5kb20gZXZlbnRzIG9uIGEgYnV0dG9uIGNsaWNrXHJcblx0dHJpZ2dlckxvY2F0aW9uRXZlbnQ6IGZ1bmN0aW9uKGxvY2F0aW9uKSB7XHJcblx0XHRpZiAodGhpcy5Mb2NhdGlvbnNbbG9jYXRpb25dKSB7XHJcblx0XHRcdGlmKEV2ZW50cy5hY3RpdmVFdmVudCgpID09IG51bGwpIHtcclxuXHRcdFx0XHR2YXIgcG9zc2libGVFdmVudHM6IEFycmF5PGFueT4gPSBbXTtcclxuXHRcdFx0XHRmb3IodmFyIGkgaW4gdGhpcy5Mb2NhdGlvbnNbbG9jYXRpb25dKSB7XHJcblx0XHRcdFx0XHR2YXIgZXZlbnQgPSB0aGlzLkxvY2F0aW9uc1tsb2NhdGlvbl1baV07XHJcblx0XHRcdFx0XHRpZihldmVudC5pc0F2YWlsYWJsZSgpKSB7XHJcblx0XHRcdFx0XHRcdGlmKHR5cGVvZihldmVudC5pc1N1cGVyTGlrZWx5KSA9PSAnZnVuY3Rpb24nICYmIGV2ZW50LmlzU3VwZXJMaWtlbHkoKSkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFN1cGVyTGlrZWx5IGV2ZW50LCBkbyB0aGlzIGFuZCBza2lwIHRoZSByYW5kb20gY2hvaWNlXHJcblx0XHRcdFx0XHRcdFx0RW5naW5lLmxvZygnc3VwZXJMaWtlbHkgZGV0ZWN0ZWQnKTtcclxuXHRcdFx0XHRcdFx0XHRFdmVudHMuc3RhcnRFdmVudChldmVudCk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHBvc3NpYmxlRXZlbnRzLnB1c2goZXZlbnQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcclxuXHRcdFx0XHRpZihwb3NzaWJsZUV2ZW50cy5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHRcdC8vIEV2ZW50cy5zY2hlZHVsZU5leHRFdmVudCgwLjUpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR2YXIgciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoocG9zc2libGVFdmVudHMubGVuZ3RoKSk7XHJcblx0XHRcdFx0XHRFdmVudHMuc3RhcnRFdmVudChwb3NzaWJsZUV2ZW50c1tyXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRhY3RpdmVFdmVudDogZnVuY3Rpb24oKTogQURSRXZlbnQgfCBudWxsIHtcclxuXHRcdGlmKEV2ZW50cy5ldmVudFN0YWNrICYmIEV2ZW50cy5ldmVudFN0YWNrLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0cmV0dXJuIEV2ZW50cy5ldmVudFN0YWNrWzBdO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fSxcclxuXHRcclxuXHRldmVudFBhbmVsOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBFdmVudHMuYWN0aXZlRXZlbnQoKT8uZXZlbnRQYW5lbDtcclxuXHR9LFxyXG5cclxuXHRzdGFydEV2ZW50OiBmdW5jdGlvbihldmVudDogQURSRXZlbnQsIG9wdGlvbnM/KSB7XHJcblx0XHRpZihldmVudCkge1xyXG5cdFx0XHRFbmdpbmUuZXZlbnQoJ2dhbWUgZXZlbnQnLCAnZXZlbnQnKTtcclxuXHRcdFx0RXZlbnRzLmV2ZW50U3RhY2sudW5zaGlmdChldmVudCk7XHJcblx0XHRcdGV2ZW50LmV2ZW50UGFuZWwgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2V2ZW50JykuYWRkQ2xhc3MoJ2V2ZW50UGFuZWwnKS5jc3MoJ29wYWNpdHknLCAnMCcpO1xyXG5cdFx0XHRpZihvcHRpb25zICE9IG51bGwgJiYgb3B0aW9ucy53aWR0aCAhPSBudWxsKSB7XHJcblx0XHRcdFx0RXZlbnRzLmV2ZW50UGFuZWwoKS5jc3MoJ3dpZHRoJywgb3B0aW9ucy53aWR0aCk7XHJcblx0XHRcdH1cclxuXHRcdFx0JCgnPGRpdj4nKS5hZGRDbGFzcygnZXZlbnRUaXRsZScpLnRleHQoRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnRpdGxlIGFzIHN0cmluZykuYXBwZW5kVG8oRXZlbnRzLmV2ZW50UGFuZWwoKSk7XHJcblx0XHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnZGVzY3JpcHRpb24nKS5hcHBlbmRUbyhFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdidXR0b25zJykuYXBwZW5kVG8oRXZlbnRzLmV2ZW50UGFuZWwoKSk7XHJcblx0XHRcdEV2ZW50cy5sb2FkU2NlbmUoJ3N0YXJ0Jyk7XHJcblx0XHRcdCQoJ2RpdiN3cmFwcGVyJykuYXBwZW5kKEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0XHRFdmVudHMuZXZlbnRQYW5lbCgpLmFuaW1hdGUoe29wYWNpdHk6IDF9LCBFdmVudHMuX1BBTkVMX0ZBREUsICdsaW5lYXInKTtcclxuXHRcdFx0dmFyIGN1cnJlbnRTY2VuZUluZm9ybWF0aW9uID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnNjZW5lc1tFdmVudHMuYWN0aXZlU2NlbmVdO1xyXG5cdFx0XHRpZiAoY3VycmVudFNjZW5lSW5mb3JtYXRpb24uYmxpbmspIHtcclxuXHRcdFx0XHRFdmVudHMuYmxpbmtUaXRsZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0c2NoZWR1bGVOZXh0RXZlbnQ6IGZ1bmN0aW9uKHNjYWxlPykge1xyXG5cdFx0dmFyIG5leHRFdmVudCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSooRXZlbnRzLl9FVkVOVF9USU1FX1JBTkdFWzFdIC0gRXZlbnRzLl9FVkVOVF9USU1FX1JBTkdFWzBdKSkgKyBFdmVudHMuX0VWRU5UX1RJTUVfUkFOR0VbMF07XHJcblx0XHRpZihzY2FsZSA+IDApIHsgbmV4dEV2ZW50ICo9IHNjYWxlOyB9XHJcblx0XHRFbmdpbmUubG9nKCduZXh0IGV2ZW50IHNjaGVkdWxlZCBpbiAnICsgbmV4dEV2ZW50ICsgJyBtaW51dGVzJyk7XHJcblx0XHRFdmVudHMuX2V2ZW50VGltZW91dCA9IEVuZ2luZS5zZXRUaW1lb3V0KEV2ZW50cy50cmlnZ2VyRXZlbnQsIG5leHRFdmVudCAqIDYwICogMTAwMCk7XHJcblx0fSxcclxuXHJcblx0ZW5kRXZlbnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLmV2ZW50UGFuZWwoKS5hbmltYXRlKHtvcGFjaXR5OjB9LCBFdmVudHMuX1BBTkVMX0ZBREUsICdsaW5lYXInLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0RXZlbnRzLmV2ZW50UGFuZWwoKS5yZW1vdmUoKTtcclxuXHRcdFx0Y29uc3QgYWN0aXZlRXZlbnQgPSBFdmVudHMuYWN0aXZlRXZlbnQoKTtcclxuXHRcdFx0aWYgKGFjdGl2ZUV2ZW50ICE9PSBudWxsKSBhY3RpdmVFdmVudC5ldmVudFBhbmVsID0gbnVsbDtcclxuXHRcdFx0RXZlbnRzLmV2ZW50U3RhY2suc2hpZnQoKTtcclxuXHRcdFx0RW5naW5lLmxvZyhFdmVudHMuZXZlbnRTdGFjay5sZW5ndGggKyAnIGV2ZW50cyByZW1haW5pbmcnKTtcclxuXHRcdFx0aWYgKEV2ZW50cy5CTElOS19JTlRFUlZBTCkge1xyXG5cdFx0XHRcdEV2ZW50cy5zdG9wVGl0bGVCbGluaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIEZvcmNlIHJlZm9jdXMgb24gdGhlIGJvZHkuIEkgaGF0ZSB5b3UsIElFLlxyXG5cdFx0XHQkKCdib2R5JykuZm9jdXMoKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGhhbmRsZVN0YXRlVXBkYXRlczogZnVuY3Rpb24oZSl7XHJcblx0XHRpZigoZS5jYXRlZ29yeSA9PSAnc3RvcmVzJyB8fCBlLmNhdGVnb3J5ID09ICdpbmNvbWUnKSAmJiBFdmVudHMuYWN0aXZlRXZlbnQoKSAhPSBudWxsKXtcclxuXHRcdFx0RXZlbnRzLnVwZGF0ZUJ1dHRvbnMoKTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcbiIsIi8qKlxyXG4gKiBFdmVudHMgdGhhdCBjYW4gb2NjdXIgd2hlbiB0aGUgUm9hZCBtb2R1bGUgaXMgYWN0aXZlXHJcbiAqKi9cclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4uL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4uL3BsYXllci9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IHsgT3V0cG9zdCB9IGZyb20gXCIuLi9wbGFjZXMvb3V0cG9zdFwiO1xyXG5pbXBvcnQgeyBSb2FkIH0gZnJvbSBcIi4uL3BsYWNlcy9yb2FkXCI7XHJcbmltcG9ydCB7IEFEUkV2ZW50IH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEV2ZW50c1JvYWRXYW5kZXI6IEFycmF5PEFEUkV2ZW50PiA9IFtcclxuICAgIC8vIFN0cmFuZ2VyIGJlYXJpbmcgZ2lmdHNcclxuICAgIHtcclxuICAgICAgICB0aXRsZTogXygnQSBTdHJhbmdlciBCZWNrb25zJyksXHJcbiAgICAgICAgaXNBdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSBSb2FkO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICdzdGFydCc6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdBcyB5b3Ugd2FuZGVyIGFsb25nIHRoZSByb2FkLCBhIGhvb2RlZCBzdHJhbmdlciBnZXN0dXJlcyB0byB5b3UuIEhlIGRvZXNuXFwndCBzZWVtIGludGVyZXN0ZWQgaW4gaHVydGluZyB5b3UuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnV2hhdCBkbyB5b3UgZG8/JylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2Nsb3Nlcic6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnRHJhdyBDbG9zZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTogJ2Nsb3Nlcid9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAnbGVhdmUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0dldCBPdXR0YSBUaGVyZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOiAnbGVhdmUnfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2Nsb3Nlcic6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdZb3UgbW92ZSB0b3dhcmQgaGltIGEgYml0IGFuZCBzdG9wLiBIZSBjb250aW51ZXMgdG8gYmVja29uLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1doYXQgZG8geW91IGRvPycpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdldmVuQ2xvc2VyJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdEcmF3IEV2ZW4gQ2xvc2VyJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6ICdldmVuQ2xvc2VyJ31cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnTmFoLCBUaGlzIGlzIFRvbyBTcG9va3knKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTogJ2xlYXZlJ31cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdldmVuQ2xvc2VyJzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1lvdSBoZXNpdGFudGx5IHdhbGsgY2xvc2VyLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0FzIHNvb24gYXMgeW91IGdldCB3aXRoaW4gYXJtc1xcJyByZWFjaCwgaGUgZ3JhYnMgeW91ciBoYW5kIHdpdGggYWxhcm1pbmcgc3BlZWQuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnSGUgcXVpY2tseSBwbGFjZXMgYW4gb2JqZWN0IGluIHlvdXIgaGFuZCwgdGhlbiBsZWF2ZXMgd29yZGxlc3NseS4nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIG9uTG9hZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbWF5YmUgc29tZSBsb2dpYyB0byBtYWtlIHJlcGVhdHMgbGVzcyBsaWtlbHk/XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9zc2libGVJdGVtcyA9IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ1N0cmFuZ2VyLnNtb290aFN0b25lJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ1N0cmFuZ2VyLndyYXBwZWRLbmlmZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdTdHJhbmdlci5jbG90aEJ1bmRsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdTdHJhbmdlci5jb2luJ1xyXG4gICAgICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IHBvc3NpYmxlSXRlbXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcG9zc2libGVJdGVtcy5sZW5ndGgpXTtcclxuICAgICAgICAgICAgICAgICAgICBDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdUaGFua3MsIEkgZ3Vlc3M/JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdZb3VyIGd1dCBjbGVuY2hlcywgYW5kIHlvdSBmZWVsIHRoZSBzdWRkZW4gdXJnZSB0byBsZWF2ZS4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdBcyB5b3Ugd2FsayBhd2F5LCB5b3UgY2FuIGZlZWwgdGhlIG9sZCBtYW5cXCdzIGdhemUgb24geW91ciBiYWNrLicpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdXZWlyZC4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBVbmxvY2sgT3V0cG9zdFxyXG4gICAge1xyXG4gICAgICAgIHRpdGxlOiBfKCdBIFdheSBGb3J3YXJkIE1ha2VzIEl0c2VsZiBLbm93bicpLFxyXG4gICAgICAgIGlzQXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIChFbmdpbmUuYWN0aXZlTW9kdWxlID09IFJvYWQpXHJcbiAgICAgICAgICAgICAgICAmJiAoJFNNLmdldCgnUm9hZC5jb3VudGVyJykgYXMgbnVtYmVyID4gNikgLy8gY2FuJ3QgaGFwcGVuIFRPTyBlYXJseVxyXG4gICAgICAgICAgICAgICAgJiYgKCRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSA9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICB8fCAkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyIDwgMSkgLy8gY2FuJ3QgaGFwcGVuIHR3aWNlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpc1N1cGVyTGlrZWx5OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuICgoKCAkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfHwgJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpIGFzIG51bWJlciA8IDEpKSBcclxuICAgICAgICAgICAgICAgICAgICAmJiAoJFNNLmdldCgnUm9hZC5jb3VudGVyJykgYXMgbnVtYmVyID4gMTApO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICdzdGFydCc6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdTbW9rZSBjdXJscyB1cHdhcmRzIGZyb20gYmVoaW5kIGEgaGlsbC4gWW91IGNsaW1iIGhpZ2hlciB0byBpbnZlc3RpZ2F0ZS4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdGcm9tIHlvdXIgZWxldmF0ZWQgcG9zaXRpb24sIHlvdSBjYW4gc2VlIGRvd24gaW50byB0aGUgb3V0cG9zdCB0aGF0IHRoZSBtYXlvciBzcG9rZSBvZiBiZWZvcmUuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnVGhlIE91dHBvc3QgaXMgbm93IG9wZW4gdG8geW91LicpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBIGxpdHRsZSBkcmFtYXRpYywgYnV0IGNvb2wnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgT3V0cG9zdC5pbml0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkU00uc2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJywgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGFyYWN0ZXIuc2V0UXVlc3RTdGF0dXMoXCJtYXlvclN1cHBsaWVzXCIsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hhcmFjdGVyLmNoZWNrUXVlc3RTdGF0dXMoXCJtYXlvclN1cHBsaWVzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXTtcclxuXHJcbiIsIi8qKlxyXG4gKiBFdmVudHMgdGhhdCBjYW4gb2NjdXIgd2hlbiB0aGUgVmlsbGFnZSBtb2R1bGUgaXMgYWN0aXZlXHJcbiAqKi9cclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4uL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBWaWxsYWdlIH0gZnJvbSAnLi4vcGxhY2VzL3ZpbGxhZ2UnO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgQURSRXZlbnQgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgRXZlbnRzVmlsbGFnZTogQXJyYXk8QURSRXZlbnQ+ID0gW1xyXG5cdHsgLyogVGhlIE5vbWFkICAtLSAgTWVyY2hhbnQgKi9cclxuXHRcdHRpdGxlOiBfKCdUaGUgTm9tYWQnKSxcclxuXHRcdGlzQXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gVmlsbGFnZSAmJiAkU00uZ2V0KCdzdG9yZXMuZnVyJywgdHJ1ZSkgYXMgbnVtYmVyID4gMDtcclxuXHRcdH0sXHJcblx0XHRzY2VuZXM6IHtcclxuXHRcdFx0J3N0YXJ0Jzoge1xyXG5cdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdF8oJ2Egbm9tYWQgc2h1ZmZsZXMgaW50byB2aWV3LCBsYWRlbiB3aXRoIG1ha2VzaGlmdCBiYWdzIGJvdW5kIHdpdGggcm91Z2ggdHdpbmUuJyksXHJcblx0XHRcdFx0XHRfKFwid29uJ3Qgc2F5IGZyb20gd2hlcmUgaGUgY2FtZSwgYnV0IGl0J3MgY2xlYXIgdGhhdCBoZSdzIG5vdCBzdGF5aW5nLlwiKVxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdFx0bm90aWZpY2F0aW9uOiBfKCdhIG5vbWFkIGFycml2ZXMsIGxvb2tpbmcgdG8gdHJhZGUnKSxcclxuXHRcdFx0XHRibGluazogdHJ1ZSxcclxuXHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHQnYnV5U2NhbGVzJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdidXkgc2NhbGVzJyksXHJcblx0XHRcdFx0XHRcdGNvc3Q6IHsgJ2Z1cic6IDEwMCB9LFxyXG5cdFx0XHRcdFx0XHRyZXdhcmQ6IHsgJ3NjYWxlcyc6IDEgfVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCdidXlUZWV0aCc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnYnV5IHRlZXRoJyksXHJcblx0XHRcdFx0XHRcdGNvc3Q6IHsgJ2Z1cic6IDIwMCB9LFxyXG5cdFx0XHRcdFx0XHRyZXdhcmQ6IHsgJ3RlZXRoJzogMSB9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J2J1eUJhaXQnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ2J1eSBiYWl0JyksXHJcblx0XHRcdFx0XHRcdGNvc3Q6IHsgJ2Z1cic6IDUgfSxcclxuXHRcdFx0XHRcdFx0cmV3YXJkOiB7ICdiYWl0JzogMSB9LFxyXG5cdFx0XHRcdFx0XHRub3RpZmljYXRpb246IF8oJ3RyYXBzIGFyZSBtb3JlIGVmZmVjdGl2ZSB3aXRoIGJhaXQuJylcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnZ29vZGJ5ZSc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnc2F5IGdvb2RieWUnKSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sIFxyXG5cdHsgLyogTm9pc2VzIE91dHNpZGUgIC0tICBnYWluIHdvb2QvZnVyICovXHJcblx0XHR0aXRsZTogXygnTm9pc2VzJyksXHJcblx0XHRpc0F2YWlsYWJsZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiBFbmdpbmUuYWN0aXZlTW9kdWxlID09IFZpbGxhZ2UgJiYgJFNNLmdldCgnc3RvcmVzLndvb2QnKTtcclxuXHRcdH0sXHJcblx0XHRzY2VuZXM6IHtcclxuXHRcdFx0J3N0YXJ0Jzoge1xyXG5cdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdF8oJ3Rocm91Z2ggdGhlIHdhbGxzLCBzaHVmZmxpbmcgbm9pc2VzIGNhbiBiZSBoZWFyZC4nKSxcclxuXHRcdFx0XHRcdF8oXCJjYW4ndCB0ZWxsIHdoYXQgdGhleSdyZSB1cCB0by5cIilcclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdG5vdGlmaWNhdGlvbjogXygnc3RyYW5nZSBub2lzZXMgY2FuIGJlIGhlYXJkIHRocm91Z2ggdGhlIHdhbGxzJyksXHJcblx0XHRcdFx0Ymxpbms6IHRydWUsXHJcblx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0J2ludmVzdGlnYXRlJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdpbnZlc3RpZ2F0ZScpLFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsgMC4zOiAnc3R1ZmYnLCAxOiAnbm90aGluZycgfVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCdpZ25vcmUnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ2lnbm9yZSB0aGVtJyksXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdCdub3RoaW5nJzoge1xyXG5cdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdF8oJ3ZhZ3VlIHNoYXBlcyBtb3ZlLCBqdXN0IG91dCBvZiBzaWdodC4nKSxcclxuXHRcdFx0XHRcdF8oJ3RoZSBzb3VuZHMgc3RvcC4nKVxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0J2JhY2tpbnNpZGUnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ2dvIGJhY2sgaW5zaWRlJyksXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdCdzdHVmZic6IHtcclxuXHRcdFx0XHRyZXdhcmQ6IHsgd29vZDogMTAwLCBmdXI6IDEwIH0sXHJcblx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XygnYSBidW5kbGUgb2Ygc3RpY2tzIGxpZXMganVzdCBiZXlvbmQgdGhlIHRocmVzaG9sZCwgd3JhcHBlZCBpbiBjb2Fyc2UgZnVycy4nKSxcclxuXHRcdFx0XHRcdF8oJ3RoZSBuaWdodCBpcyBzaWxlbnQuJylcclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdCdiYWNraW5zaWRlJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdnbyBiYWNrIGluc2lkZScpLFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHR7IC8qIFRoZSBCZWdnYXIgIC0tICB0cmFkZSBmdXIgZm9yIGJldHRlciBnb29kICovXHJcblx0XHR0aXRsZTogXygnVGhlIEJlZ2dhcicpLFxyXG5cdFx0aXNBdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSBWaWxsYWdlICYmICRTTS5nZXQoJ3N0b3Jlcy5mdXInKTtcclxuXHRcdH0sXHJcblx0XHRzY2VuZXM6IHtcclxuXHRcdFx0c3RhcnQ6IHtcclxuXHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRfKCdhIGJlZ2dhciBhcnJpdmVzLicpLFxyXG5cdFx0XHRcdFx0XygnYXNrcyBmb3IgYW55IHNwYXJlIGZ1cnMgdG8ga2VlcCBoaW0gd2FybSBhdCBuaWdodC4nKVxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdFx0bm90aWZpY2F0aW9uOiBfKCdhIGJlZ2dhciBhcnJpdmVzJyksXHJcblx0XHRcdFx0Ymxpbms6IHRydWUsXHJcblx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0JzUwZnVycyc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnZ2l2ZSA1MCcpLFxyXG5cdFx0XHRcdFx0XHRjb3N0OiB7ZnVyOiA1MH0sXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogeyAwLjU6ICdzY2FsZXMnLCAwLjg6ICd0ZWV0aCcsIDE6ICdjbG90aCcgfVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCcxMDBmdXJzJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdnaXZlIDEwMCcpLFxyXG5cdFx0XHRcdFx0XHRjb3N0OiB7ZnVyOiAxMDB9LFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsgMC41OiAndGVldGgnLCAwLjg6ICdzY2FsZXMnLCAxOiAnY2xvdGgnIH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnZGVueSc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygndHVybiBoaW0gYXdheScpLFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRzY2FsZXM6IHtcclxuXHRcdFx0XHRyZXdhcmQ6IHsgc2NhbGVzOiAyMCB9LFxyXG5cdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdF8oJ3RoZSBiZWdnYXIgZXhwcmVzc2VzIGhpcyB0aGFua3MuJyksXHJcblx0XHRcdFx0XHRfKCdsZWF2ZXMgYSBwaWxlIG9mIHNtYWxsIHNjYWxlcyBiZWhpbmQuJylcclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdCdsZWF2ZSc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnc2F5IGdvb2RieWUnKSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0dGVldGg6IHtcclxuXHRcdFx0XHRyZXdhcmQ6IHsgdGVldGg6IDIwIH0sXHJcblx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XygndGhlIGJlZ2dhciBleHByZXNzZXMgaGlzIHRoYW5rcy4nKSxcclxuXHRcdFx0XHRcdF8oJ2xlYXZlcyBhIHBpbGUgb2Ygc21hbGwgdGVldGggYmVoaW5kLicpXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHQnbGVhdmUnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ3NheSBnb29kYnllJyksXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdGNsb3RoOiB7XHJcblx0XHRcdFx0cmV3YXJkOiB7IGNsb3RoOiAyMCB9LFxyXG5cdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdF8oJ3RoZSBiZWdnYXIgZXhwcmVzc2VzIGhpcyB0aGFua3MuJyksXHJcblx0XHRcdFx0XHRfKCdsZWF2ZXMgc29tZSBzY3JhcHMgb2YgY2xvdGggYmVoaW5kLicpXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHQnbGVhdmUnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ3NheSBnb29kYnllJyksXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdHsgLyogVGhlIFNjb3V0ICAtLSAgTWFwIE1lcmNoYW50ICovXHJcblx0XHR0aXRsZTogXygnVGhlIFNjb3V0JyksXHJcblx0XHRpc0F2YWlsYWJsZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiBFbmdpbmUuYWN0aXZlTW9kdWxlID09IFZpbGxhZ2UgJiYgJFNNLmdldCgnZmVhdHVyZXMubG9jYXRpb24ud29ybGQnKTtcclxuXHRcdH0sXHJcblx0XHRzY2VuZXM6IHtcclxuXHRcdFx0J3N0YXJ0Jzoge1xyXG5cdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdF8oXCJ0aGUgc2NvdXQgc2F5cyBzaGUncyBiZWVuIGFsbCBvdmVyLlwiKSxcclxuXHRcdFx0XHRcdF8oXCJ3aWxsaW5nIHRvIHRhbGsgYWJvdXQgaXQsIGZvciBhIHByaWNlLlwiKVxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdFx0bm90aWZpY2F0aW9uOiBfKCdhIHNjb3V0IHN0b3BzIGZvciB0aGUgbmlnaHQnKSxcclxuXHRcdFx0XHRibGluazogdHJ1ZSxcclxuXHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHQnYnV5TWFwJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdidXkgbWFwJyksXHJcblx0XHRcdFx0XHRcdGNvc3Q6IHsgJ2Z1cic6IDIwMCwgJ3NjYWxlcyc6IDEwIH0sXHJcblx0XHRcdFx0XHRcdG5vdGlmaWNhdGlvbjogXygndGhlIG1hcCB1bmNvdmVycyBhIGJpdCBvZiB0aGUgd29ybGQnKSxcclxuXHRcdFx0XHRcdFx0Ly8gb25DaG9vc2U6IFdvcmxkLmFwcGx5TWFwXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J2xlYXJuJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdsZWFybiBzY291dGluZycpLFxyXG5cdFx0XHRcdFx0XHRjb3N0OiB7ICdmdXInOiAxMDAwLCAnc2NhbGVzJzogNTAsICd0ZWV0aCc6IDIwIH0sXHJcblx0XHRcdFx0XHRcdGF2YWlsYWJsZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuICEkU00uaGFzUGVyaygnc2NvdXQnKTtcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0b25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdCRTTS5hZGRQZXJrKCdzY291dCcpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdzYXkgZ29vZGJ5ZScpLFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHR7IC8qIFRoZSBXYW5kZXJpbmcgTWFzdGVyICovXHJcblx0XHR0aXRsZTogXygnVGhlIE1hc3RlcicpLFxyXG5cdFx0aXNBdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSBWaWxsYWdlICYmICRTTS5nZXQoJ2ZlYXR1cmVzLmxvY2F0aW9uLndvcmxkJyk7XHJcblx0XHR9LFxyXG5cdFx0c2NlbmVzOiB7XHJcblx0XHRcdCdzdGFydCc6IHtcclxuXHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRfKCdhbiBvbGQgd2FuZGVyZXIgYXJyaXZlcy4nKSxcclxuXHRcdFx0XHRcdF8oJ2hlIHNtaWxlcyB3YXJtbHkgYW5kIGFza3MgZm9yIGxvZGdpbmdzIGZvciB0aGUgbmlnaHQuJylcclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdG5vdGlmaWNhdGlvbjogXygnYW4gb2xkIHdhbmRlcmVyIGFycml2ZXMnKSxcclxuXHRcdFx0XHRibGluazogdHJ1ZSxcclxuXHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHQnYWdyZWUnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ2FncmVlJyksXHJcblx0XHRcdFx0XHRcdGNvc3Q6IHtcclxuXHRcdFx0XHRcdFx0XHQnY3VyZWQgbWVhdCc6IDEwMCxcclxuXHRcdFx0XHRcdFx0XHQnZnVyJzogMTAwLFxyXG5cdFx0XHRcdFx0XHRcdCd0b3JjaCc6IDFcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2FncmVlJ31cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnZGVueSc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygndHVybiBoaW0gYXdheScpLFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHQnYWdyZWUnOiB7XHJcblx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XygnaW4gZXhjaGFuZ2UsIHRoZSB3YW5kZXJlciBvZmZlcnMgaGlzIHdpc2RvbS4nKVxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0J2V2YXNpb24nOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ2V2YXNpb24nKSxcclxuXHRcdFx0XHRcdFx0YXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gISRTTS5oYXNQZXJrKCdldmFzaXZlJyk7XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHQkU00uYWRkUGVyaygnZXZhc2l2ZScpO1xyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J3ByZWNpc2lvbic6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygncHJlY2lzaW9uJyksXHJcblx0XHRcdFx0XHRcdGF2YWlsYWJsZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuICEkU00uaGFzUGVyaygncHJlY2lzZScpO1xyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0JFNNLmFkZFBlcmsoJ3ByZWNpc2UnKTtcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCdmb3JjZSc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnZm9yY2UnKSxcclxuXHRcdFx0XHRcdFx0YXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gISRTTS5oYXNQZXJrKCdiYXJiYXJpYW4nKTtcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0b25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdCRTTS5hZGRQZXJrKCdiYXJiYXJpYW4nKTtcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCdub3RoaW5nJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdub3RoaW5nJyksXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbl07XHJcbiIsIi8qKlxyXG4gKiBNb2R1bGUgdGhhdCB0YWtlcyBjYXJlIG9mIGhlYWRlciBidXR0b25zXHJcbiAqL1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi9lbmdpbmVcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBIZWFkZXIgPSB7XHJcblx0XHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHR9LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHt9LCAvLyBOb3RoaW5nIGZvciBub3dcclxuXHRcclxuXHRjYW5UcmF2ZWw6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuICQoJ2RpdiNoZWFkZXIgZGl2LmhlYWRlckJ1dHRvbicpLmxlbmd0aCA+IDE7XHJcblx0fSxcclxuXHRcclxuXHRhZGRMb2NhdGlvbjogZnVuY3Rpb24odGV4dCwgaWQsIG1vZHVsZSkge1xyXG5cdFx0cmV0dXJuICQoJzxkaXY+JykuYXR0cignaWQnLCBcImxvY2F0aW9uX1wiICsgaWQpXHJcblx0XHRcdC5hZGRDbGFzcygnaGVhZGVyQnV0dG9uJylcclxuXHRcdFx0LnRleHQodGV4dCkuY2xpY2soZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYoSGVhZGVyLmNhblRyYXZlbCgpKSB7XHJcblx0XHRcdFx0XHRFbmdpbmUudHJhdmVsVG8obW9kdWxlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pLmFwcGVuZFRvKCQoJ2RpdiNoZWFkZXInKSk7XHJcblx0fVxyXG59OyIsIi8qKlxyXG4gKiBNb2R1bGUgdGhhdCByZWdpc3RlcnMgdGhlIG5vdGlmaWNhdGlvbiBib3ggYW5kIGhhbmRsZXMgbWVzc2FnZXNcclxuICovXHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuL2VuZ2luZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IE5vdGlmaWNhdGlvbnMgPSB7XHJcblx0XHRcclxuXHRpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHRcdFxyXG5cdFx0Ly8gQ3JlYXRlIHRoZSBub3RpZmljYXRpb25zIGJveFxyXG5cdFx0Y29uc3QgZWxlbSA9ICQoJzxkaXY+JykuYXR0cih7XHJcblx0XHRcdGlkOiAnbm90aWZpY2F0aW9ucycsXHJcblx0XHRcdGNsYXNzTmFtZTogJ25vdGlmaWNhdGlvbnMnXHJcblx0XHR9KTtcclxuXHRcdC8vIENyZWF0ZSB0aGUgdHJhbnNwYXJlbmN5IGdyYWRpZW50XHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ25vdGlmeUdyYWRpZW50JykuYXBwZW5kVG8oZWxlbSk7XHJcblx0XHRcclxuXHRcdGVsZW0uYXBwZW5kVG8oJ2RpdiN3cmFwcGVyJyk7XHJcblx0fSxcclxuXHRcclxuXHRvcHRpb25zOiB7fSwgLy8gTm90aGluZyBmb3Igbm93XHJcblx0XHJcblx0ZWxlbTogbnVsbCxcclxuXHRcclxuXHRub3RpZnlRdWV1ZToge30sXHJcblx0XHJcblx0Ly8gQWxsb3cgbm90aWZpY2F0aW9uIHRvIHRoZSBwbGF5ZXJcclxuXHRub3RpZnk6IGZ1bmN0aW9uKG1vZHVsZSwgdGV4dCwgbm9RdWV1ZT8pIHtcclxuXHRcdGlmKHR5cGVvZiB0ZXh0ID09ICd1bmRlZmluZWQnKSByZXR1cm47XHJcblx0XHQvLyBJIGRvbid0IG5lZWQgeW91IHB1bmN0dWF0aW5nIGZvciBtZSwgZnVuY3Rpb24uXHJcblx0XHQvLyBpZih0ZXh0LnNsaWNlKC0xKSAhPSBcIi5cIikgdGV4dCArPSBcIi5cIjtcclxuXHRcdGlmKG1vZHVsZSAhPSBudWxsICYmIEVuZ2luZS5hY3RpdmVNb2R1bGUgIT0gbW9kdWxlKSB7XHJcblx0XHRcdGlmKCFub1F1ZXVlKSB7XHJcblx0XHRcdFx0aWYodHlwZW9mIHRoaXMubm90aWZ5UXVldWVbbW9kdWxlXSA9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRcdFx0dGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdID0gW107XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMubm90aWZ5UXVldWVbbW9kdWxlXS5wdXNoKHRleHQpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHROb3RpZmljYXRpb25zLnByaW50TWVzc2FnZSh0ZXh0KTtcclxuXHRcdH1cclxuXHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdH0sXHJcblx0XHJcblx0Y2xlYXJIaWRkZW46IGZ1bmN0aW9uKCkge1xyXG5cdFxyXG5cdFx0Ly8gVG8gZml4IHNvbWUgbWVtb3J5IHVzYWdlIGlzc3Vlcywgd2UgY2xlYXIgbm90aWZpY2F0aW9ucyB0aGF0IGhhdmUgYmVlbiBoaWRkZW4uXHJcblx0XHRcclxuXHRcdC8vIFdlIHVzZSBwb3NpdGlvbigpLnRvcCBoZXJlLCBiZWNhdXNlIHdlIGtub3cgdGhhdCB0aGUgcGFyZW50IHdpbGwgYmUgdGhlIHNhbWUsIHNvIHRoZSBwb3NpdGlvbiB3aWxsIGJlIHRoZSBzYW1lLlxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0dmFyIGJvdHRvbSA9ICQoJyNub3RpZnlHcmFkaWVudCcpLnBvc2l0aW9uKCkudG9wICsgJCgnI25vdGlmeUdyYWRpZW50Jykub3V0ZXJIZWlnaHQodHJ1ZSk7XHJcblx0XHRcclxuXHRcdCQoJy5ub3RpZmljYXRpb24nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHJcblx0XHRcdGlmKCQodGhpcykucG9zaXRpb24oKS50b3AgPiBib3R0b20pe1xyXG5cdFx0XHRcdCQodGhpcykucmVtb3ZlKCk7XHJcblx0XHRcdH1cclxuXHRcdFxyXG5cdFx0fSk7XHJcblx0XHRcclxuXHR9LFxyXG5cdFxyXG5cdHByaW50TWVzc2FnZTogZnVuY3Rpb24odCkge1xyXG5cdFx0dmFyIHRleHQgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdub3RpZmljYXRpb24nKS5jc3MoJ29wYWNpdHknLCAnMCcpLnRleHQodCkucHJlcGVuZFRvKCdkaXYjbm90aWZpY2F0aW9ucycpO1xyXG5cdFx0dGV4dC5hbmltYXRlKHtvcGFjaXR5OiAxfSwgNTAwLCAnbGluZWFyJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdC8vIERvIHRoaXMgZXZlcnkgdGltZSB3ZSBhZGQgYSBuZXcgbWVzc2FnZSwgdGhpcyB3YXkgd2UgbmV2ZXIgaGF2ZSBhIGxhcmdlIGJhY2tsb2cgdG8gaXRlcmF0ZSB0aHJvdWdoLiBLZWVwcyB0aGluZ3MgZmFzdGVyLlxyXG5cdFx0XHROb3RpZmljYXRpb25zLmNsZWFySGlkZGVuKCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdFxyXG5cdHByaW50UXVldWU6IGZ1bmN0aW9uKG1vZHVsZSkge1xyXG5cdFx0aWYodHlwZW9mIHRoaXMubm90aWZ5UXVldWVbbW9kdWxlXSAhPSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHR3aGlsZSh0aGlzLm5vdGlmeVF1ZXVlW21vZHVsZV0ubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdE5vdGlmaWNhdGlvbnMucHJpbnRNZXNzYWdlKHRoaXMubm90aWZ5UXVldWVbbW9kdWxlXS5zaGlmdCgpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgeyBFbmdpbmUgfSBmcm9tICcuLi9lbmdpbmUnO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tICcuLi9zdGF0ZV9tYW5hZ2VyJztcclxuaW1wb3J0IHsgV2VhdGhlciB9IGZyb20gJy4uL3dlYXRoZXInO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi9CdXR0b24nO1xyXG5pbXBvcnQgeyBDYXB0YWluIH0gZnJvbSAnLi4vY2hhcmFjdGVycy9jYXB0YWluJztcclxuaW1wb3J0IHsgSGVhZGVyIH0gZnJvbSAnLi4vaGVhZGVyJztcclxuaW1wb3J0IHsgXyB9IGZyb20gJy4uLy4uL2xpYi90cmFuc2xhdGUnO1xyXG5cclxuZXhwb3J0IGNvbnN0IE91dHBvc3QgPSB7XHJcbiAgICBpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgT3V0cG9zdCB0YWJcclxuICAgICAgICB0aGlzLnRhYiA9IEhlYWRlci5hZGRMb2NhdGlvbihfKFwiVGhlIE91dHBvc3RcIiksIFwib3V0cG9zdFwiLCBPdXRwb3N0KTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBPdXRwb3N0IHBhbmVsXHJcblx0XHR0aGlzLnBhbmVsID0gJCgnPGRpdj4nKVxyXG4gICAgICAgIC5hdHRyKCdpZCcsIFwib3V0cG9zdFBhbmVsXCIpXHJcbiAgICAgICAgLmFkZENsYXNzKCdsb2NhdGlvbicpXHJcbiAgICAgICAgLmFwcGVuZFRvKCdkaXYjbG9jYXRpb25TbGlkZXInKTtcclxuXHJcbiAgICAgICAgRW5naW5lLnVwZGF0ZVNsaWRlcigpO1xyXG5cclxuICAgICAgICAvLyBuZXcgXHJcblx0XHRCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6ICdjYXB0YWluQnV0dG9uJyxcclxuXHRcdFx0dGV4dDogXygnU3BlYWsgd2l0aCBUaGUgQ2FwdGFpbicpLFxyXG5cdFx0XHRjbGljazogQ2FwdGFpbi50YWxrVG9DYXB0YWluLFxyXG5cdFx0XHR3aWR0aDogJzgwcHgnXHJcblx0XHR9KS5hcHBlbmRUbygnZGl2I291dHBvc3RQYW5lbCcpO1xyXG5cclxuICAgICAgICBPdXRwb3N0LnVwZGF0ZUJ1dHRvbigpO1xyXG5cclxuICAgICAgICAvLyBzZXR0aW5nIHRoaXMgc2VwYXJhdGVseSBzbyB0aGF0IHF1ZXN0IHN0YXR1cyBjYW4ndCBhY2NpZGVudGFsbHkgYnJlYWsgaXQgbGF0ZXJcclxuICAgICAgICAkU00uc2V0KCdvdXRwb3N0Lm9wZW4nLCAxKTsgXHJcbiAgICB9LFxyXG5cclxuICAgIGF2YWlsYWJsZVdlYXRoZXI6IHtcclxuXHRcdCdzdW5ueSc6IDAuNCxcclxuXHRcdCdjbG91ZHknOiAwLjMsXHJcblx0XHQncmFpbnknOiAwLjNcclxuXHR9LFxyXG5cclxuICAgIG9uQXJyaXZhbDogZnVuY3Rpb24odHJhbnNpdGlvbl9kaWZmKSB7XHJcbiAgICAgICAgT3V0cG9zdC5zZXRUaXRsZSgpO1xyXG5cclxuXHRcdEVuZ2luZS5tb3ZlU3RvcmVzVmlldyhudWxsLCB0cmFuc2l0aW9uX2RpZmYpO1xyXG5cclxuICAgICAgICBXZWF0aGVyLmluaXRpYXRlV2VhdGhlcihPdXRwb3N0LmF2YWlsYWJsZVdlYXRoZXIsICdvdXRwb3N0Jyk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldFRpdGxlOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0aXRsZSA9IF8oXCJUaGUgT3V0cG9zdFwiKTtcclxuXHRcdGlmKEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gdGhpcykge1xyXG5cdFx0XHRkb2N1bWVudC50aXRsZSA9IHRpdGxlO1xyXG5cdFx0fVxyXG5cdFx0JCgnZGl2I2xvY2F0aW9uX291dHBvc3QnKS50ZXh0KHRpdGxlKTtcclxuXHR9LFxyXG5cclxuICAgIHVwZGF0ZUJ1dHRvbjogZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBjb25kaXRpb25hbHMgZm9yIHVwZGF0aW5nIGJ1dHRvbnNcclxuXHR9LFxyXG5cclxuICAgIC8vIGRvbid0IG5lZWQgdGhpcyB5ZXQgKG9yIG1heWJlIGV2ZXIpXHJcblx0Ly8gd2FuZGVyRXZlbnQ6IGZ1bmN0aW9uKCkge1xyXG5cdC8vIFx0RXZlbnRzLnRyaWdnZXJMb2NhdGlvbkV2ZW50KCdPdXRwb3N0V2FuZGVyJyk7XHJcblx0Ly8gXHQkU00uYWRkKCdPdXRwb3N0LmNvdW50ZXInLCAxKTtcclxuXHQvLyB9XHJcbn0iLCJpbXBvcnQgeyBIZWFkZXIgfSBmcm9tIFwiLi4vaGVhZGVyXCI7XHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuLi9lbmdpbmVcIjtcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uL0J1dHRvblwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgV2VhdGhlciB9IGZyb20gXCIuLi93ZWF0aGVyXCI7XHJcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBSb2FkID0ge1xyXG4gICAgaW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgdGhlIFJvYWQgdGFiXHJcbiAgICAgICAgdGhpcy50YWIgPSBIZWFkZXIuYWRkTG9jYXRpb24oXyhcIlJvYWQgdG8gdGhlIE91dHBvc3RcIiksIFwicm9hZFwiLCBSb2FkKTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBSb2FkIHBhbmVsXHJcblx0XHR0aGlzLnBhbmVsID0gJCgnPGRpdj4nKVxyXG4gICAgICAgIC5hdHRyKCdpZCcsIFwicm9hZFBhbmVsXCIpXHJcbiAgICAgICAgLmFkZENsYXNzKCdsb2NhdGlvbicpXHJcbiAgICAgICAgLmFwcGVuZFRvKCdkaXYjbG9jYXRpb25TbGlkZXInKTtcclxuXHJcbiAgICAgICAgRW5naW5lLnVwZGF0ZVNsaWRlcigpO1xyXG5cclxuICAgICAgICAvL25ldyBcclxuXHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogJ3dhbmRlckJ1dHRvbicsXHJcblx0XHRcdHRleHQ6IF8oJ1dhbmRlciBBcm91bmQnKSxcclxuXHRcdFx0Y2xpY2s6IFJvYWQud2FuZGVyRXZlbnQsXHJcblx0XHRcdHdpZHRoOiAnODBweCcsXHJcblx0XHRcdGNvc3Q6IHt9IC8vIFRPRE86IG1ha2UgdGhlcmUgYmUgYSBjb3N0IHRvIGRvaW5nIHN0dWZmP1xyXG5cdFx0fSkuYXBwZW5kVG8oJ2RpdiNyb2FkUGFuZWwnKTtcclxuXHJcbiAgICAgICAgUm9hZC51cGRhdGVCdXR0b24oKTtcclxuXHJcbiAgICAgICAgLy8gc2V0dGluZyB0aGlzIHNlcGFyYXRlbHkgc28gdGhhdCBxdWVzdCBzdGF0dXMgY2FuJ3QgYWNjaWRlbnRhbGx5IGJyZWFrIGl0IGxhdGVyXHJcbiAgICAgICAgJFNNLnNldCgncm9hZC5vcGVuJywgMSk7IFxyXG4gICAgfSxcclxuXHJcbiAgICBhdmFpbGFibGVXZWF0aGVyOiB7XHJcblx0XHQnc3VubnknOiAwLjQsXHJcblx0XHQnY2xvdWR5JzogMC4zLFxyXG5cdFx0J3JhaW55JzogMC4zXHJcblx0fSxcclxuXHJcbiAgICBvbkFycml2YWw6IGZ1bmN0aW9uKHRyYW5zaXRpb25fZGlmZikge1xyXG4gICAgICAgIFJvYWQuc2V0VGl0bGUoKTtcclxuXHJcblx0XHRFbmdpbmUubW92ZVN0b3Jlc1ZpZXcobnVsbCwgdHJhbnNpdGlvbl9kaWZmKTtcclxuXHJcbiAgICAgICAgV2VhdGhlci5pbml0aWF0ZVdlYXRoZXIoUm9hZC5hdmFpbGFibGVXZWF0aGVyLCAncm9hZCcpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRUaXRsZTogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdGl0bGUgPSBfKFwiUm9hZCB0byB0aGUgT3V0cG9zdFwiKTtcclxuXHRcdGlmKEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gdGhpcykge1xyXG5cdFx0XHRkb2N1bWVudC50aXRsZSA9IHRpdGxlO1xyXG5cdFx0fVxyXG5cdFx0JCgnZGl2I2xvY2F0aW9uX3JvYWQnKS50ZXh0KHRpdGxlKTtcclxuXHR9LFxyXG5cclxuICAgIHVwZGF0ZUJ1dHRvbjogZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBjb25kaXRpb25hbHMgZm9yIHVwZGF0aW5nIGJ1dHRvbnNcclxuXHR9LFxyXG5cclxuXHR3YW5kZXJFdmVudDogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMudHJpZ2dlckxvY2F0aW9uRXZlbnQoJ1JvYWRXYW5kZXInKTtcclxuXHRcdCRTTS5hZGQoJ1JvYWQuY291bnRlcicsIDEpO1xyXG5cdH1cclxufSIsIi8qKlxyXG4gKiBNb2R1bGUgdGhhdCByZWdpc3RlcnMgdGhlIHNpbXBsZSByb29tIGZ1bmN0aW9uYWxpdHlcclxuICovXHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuLi9lbmdpbmVcIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uL0J1dHRvblwiO1xyXG5pbXBvcnQgeyBOb3RpZmljYXRpb25zIH0gZnJvbSBcIi4uL25vdGlmaWNhdGlvbnNcIjtcclxuaW1wb3J0IHsgV2VhdGhlciB9IGZyb20gXCIuLi93ZWF0aGVyXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyBIZWFkZXIgfSBmcm9tIFwiLi4vaGVhZGVyXCI7XHJcbmltcG9ydCB7IExpeiB9IGZyb20gXCIuLi9jaGFyYWN0ZXJzL2xpelwiO1xyXG5pbXBvcnQgeyBNYXlvciB9IGZyb20gXCIuLi9jaGFyYWN0ZXJzL21heW9yXCI7XHJcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBWaWxsYWdlID0ge1xyXG5cdC8vIHRpbWVzIGluIChtaW51dGVzICogc2Vjb25kcyAqIG1pbGxpc2Vjb25kcylcclxuXHRfRklSRV9DT09MX0RFTEFZOiA1ICogNjAgKiAxMDAwLCAvLyB0aW1lIGFmdGVyIGEgc3Rva2UgYmVmb3JlIHRoZSBmaXJlIGNvb2xzXHJcblx0X1JPT01fV0FSTV9ERUxBWTogMzAgKiAxMDAwLCAvLyB0aW1lIGJldHdlZW4gcm9vbSB0ZW1wZXJhdHVyZSB1cGRhdGVzXHJcblx0X0JVSUxERVJfU1RBVEVfREVMQVk6IDAuNSAqIDYwICogMTAwMCwgLy8gdGltZSBiZXR3ZWVuIGJ1aWxkZXIgc3RhdGUgdXBkYXRlc1xyXG5cdF9TVE9LRV9DT09MRE9XTjogMTAsIC8vIGNvb2xkb3duIHRvIHN0b2tlIHRoZSBmaXJlXHJcblx0X05FRURfV09PRF9ERUxBWTogMTUgKiAxMDAwLCAvLyBmcm9tIHdoZW4gdGhlIHN0cmFuZ2VyIHNob3dzIHVwLCB0byB3aGVuIHlvdSBuZWVkIHdvb2RcclxuXHRcclxuXHRidXR0b25zOnt9LFxyXG5cdFxyXG5cdGNoYW5nZWQ6IGZhbHNlLFxyXG5cclxuXHRkZXNjcmlwdGlvbjogW1xyXG5cdFx0XyhcIk5lc3RsZWQgaW4gdGhlIHdvb2RzLCB0aGlzIHZpbGxhZ2UgaXMgc2NhcmNlbHkgbW9yZSB0aGFuIGEgaGFtbGV0LCBkZXNwaXRlIHlvdSB0aGlua2luZyB0aG9zZSB0d28gd29yZHMgYXJlIHN5bm9ueW1zLiBUaGV5J3JlIG5vdCwgZ28gZ29vZ2xlICdoYW1sZXQnIHJpZ2h0IG5vdyBpZiB5b3UgZG9uJ3QgYmVsaWV2ZSBtZS5cIiksXHJcblx0XHRfKFwiVGhlIHZpbGxhZ2UgaXMgcXVpZXQgYXQgdGhlIG1vbWVudDsgdGhlcmUgYXJlbid0IGVub3VnaCBoYW5kcyBmb3IgYW55b25lIHRvIHJlbWFpbiBpZGxlIGZvciBsb25nLlwiKVxyXG5cdF0sXHJcblx0XHJcblx0bmFtZTogXyhcIlZpbGxhZ2VcIiksXHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblx0XHRcclxuXHRcdGlmKEVuZ2luZS5fZGVidWcpIHtcclxuXHRcdFx0dGhpcy5fUk9PTV9XQVJNX0RFTEFZID0gNTAwMDtcclxuXHRcdFx0dGhpcy5fQlVJTERFUl9TVEFURV9ERUxBWSA9IDUwMDA7XHJcblx0XHRcdHRoaXMuX1NUT0tFX0NPT0xET1dOID0gMDtcclxuXHRcdFx0dGhpcy5fTkVFRF9XT09EX0RFTEFZID0gNTAwMDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gQ3JlYXRlIHRoZSBWaWxsYWdlIHRhYlxyXG5cdFx0dGhpcy50YWIgPSBIZWFkZXIuYWRkTG9jYXRpb24oXyhcIkEgQ2hpbGwgVmlsbGFnZVwiKSwgXCJ2aWxsYWdlXCIsIFZpbGxhZ2UpO1xyXG5cdFx0XHJcblx0XHQvLyBDcmVhdGUgdGhlIFZpbGxhZ2UgcGFuZWxcclxuXHRcdHRoaXMucGFuZWwgPSAkKCc8ZGl2PicpXHJcblx0XHRcdC5hdHRyKCdpZCcsIFwidmlsbGFnZVBhbmVsXCIpXHJcblx0XHRcdC5hZGRDbGFzcygnbG9jYXRpb24nKVxyXG5cdFx0XHQuYXBwZW5kVG8oJ2RpdiNsb2NhdGlvblNsaWRlcicpO1xyXG5cdFx0XHJcblx0XHRFbmdpbmUudXBkYXRlU2xpZGVyKCk7XHJcblxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAndGFsa0J1dHRvbicsXHJcblx0XHRcdHRleHQ6IF8oJ1RhbGsgdG8gdGhlIE1heW9yJyksXHJcblx0XHRcdGNsaWNrOiBNYXlvci50YWxrVG9NYXlvcixcclxuXHRcdFx0d2lkdGg6ICc4MHB4JyxcclxuXHRcdFx0Y29zdDoge31cclxuXHRcdH0pLmFwcGVuZFRvKCdkaXYjdmlsbGFnZVBhbmVsJyk7XHJcblxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAnbGl6QnV0dG9uJyxcclxuXHRcdFx0dGV4dDogXygnVGFsayB0byBMaXonKSxcclxuXHRcdFx0Y2xpY2s6IExpei50YWxrVG9MaXosXHJcblx0XHRcdHdpZHRoOiAnODBweCcsXHJcblx0XHRcdGNvc3Q6IHt9XHJcblx0XHR9KS5hcHBlbmRUbygnZGl2I3ZpbGxhZ2VQYW5lbCcpO1xyXG5cclxuXHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogJ25ld0J1aWxkaW5nQnV0dG9uJyxcclxuXHRcdFx0dGV4dDogXygnQ2hlY2sgb3V0IHRoZSBuZXcgYnVpbGRpbmcnKSxcclxuXHRcdFx0Y2xpY2s6IFZpbGxhZ2UudGVtcEJ1aWxkaW5nTWVzc2FnZSxcclxuXHRcdFx0d2lkdGg6ICc4MHB4JyxcclxuXHRcdFx0Y29zdDoge31cclxuXHRcdH0pLmFwcGVuZFRvKCdkaXYjdmlsbGFnZVBhbmVsJyk7XHJcblxyXG5cdFx0dmFyIGJ1aWxkaW5nQnV0dG9uID0gJCgnI25ld0J1aWxkaW5nQnV0dG9uLmJ1dHRvbicpO1xyXG5cdFx0YnVpbGRpbmdCdXR0b24uaGlkZSgpO1xyXG5cclxuXHRcdHZhciBsaXpCdXR0b24gPSAkKCcjbGl6QnV0dG9uLmJ1dHRvbicpO1xyXG5cdFx0bGl6QnV0dG9uLmhpZGUoKTtcclxuXHRcdFxyXG5cdFx0Ly8gQ3JlYXRlIHRoZSBzdG9yZXMgY29udGFpbmVyXHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ3N0b3Jlc0NvbnRhaW5lcicpLmFwcGVuZFRvKCdkaXYjdmlsbGFnZVBhbmVsJyk7XHJcblx0XHRcclxuXHRcdC8vc3Vic2NyaWJlIHRvIHN0YXRlVXBkYXRlc1xyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5zdWJzY3JpYmUoVmlsbGFnZS5oYW5kbGVTdGF0ZVVwZGF0ZXMpO1xyXG5cdFx0XHJcblx0XHRWaWxsYWdlLnVwZGF0ZUJ1dHRvbigpO1xyXG5cdH0sXHJcblx0XHJcblx0b3B0aW9uczoge30sIC8vIE5vdGhpbmcgZm9yIG5vd1xyXG5cclxuXHRhdmFpbGFibGVXZWF0aGVyOiB7XHJcblx0XHQnc3VubnknOiAwLjQsXHJcblx0XHQnY2xvdWR5JzogMC4zLFxyXG5cdFx0J3JhaW55JzogMC4zXHJcblx0fSxcclxuXHRcclxuXHRvbkFycml2YWw6IGZ1bmN0aW9uKHRyYW5zaXRpb25fZGlmZikge1xyXG5cdFx0VmlsbGFnZS5zZXRUaXRsZSgpO1xyXG5cdFx0aWYoJFNNLmdldCgnZ2FtZS5idWlsZGVyLmxldmVsJykgPT0gMykge1xyXG5cdFx0XHQkU00uYWRkKCdnYW1lLmJ1aWxkZXIubGV2ZWwnLCAxKTtcclxuXHRcdFx0JFNNLnNldEluY29tZSgnYnVpbGRlcicsIHtcclxuXHRcdFx0XHRkZWxheTogMTAsXHJcblx0XHRcdFx0c3RvcmVzOiB7J3dvb2QnIDogMiB9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHROb3RpZmljYXRpb25zLm5vdGlmeShWaWxsYWdlLCBfKFwidGhlIHN0cmFuZ2VyIGlzIHN0YW5kaW5nIGJ5IHRoZSBmaXJlLiBzaGUgc2F5cyBzaGUgY2FuIGhlbHAuIHNheXMgc2hlIGJ1aWxkcyB0aGluZ3MuXCIpKTtcclxuXHRcdH1cclxuXHJcblx0XHRFbmdpbmUubW92ZVN0b3Jlc1ZpZXcobnVsbCwgdHJhbnNpdGlvbl9kaWZmKTtcclxuXHJcblx0XHRXZWF0aGVyLmluaXRpYXRlV2VhdGhlcihWaWxsYWdlLmF2YWlsYWJsZVdlYXRoZXIsICd2aWxsYWdlJyk7XHJcblx0fSxcclxuXHRcclxuXHRUZW1wRW51bToge1xyXG5cdFx0ZnJvbUludDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdFx0Zm9yKHZhciBrIGluIHRoaXMpIHtcclxuXHRcdFx0XHRpZih0eXBlb2YgdGhpc1trXS52YWx1ZSAhPSAndW5kZWZpbmVkJyAmJiB0aGlzW2tdLnZhbHVlID09IHZhbHVlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpc1trXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9LFxyXG5cdFx0RnJlZXppbmc6IHsgdmFsdWU6IDAsIHRleHQ6IF8oJ2ZyZWV6aW5nJykgfSxcclxuXHRcdENvbGQ6IHsgdmFsdWU6IDEsIHRleHQ6IF8oJ2NvbGQnKSB9LFxyXG5cdFx0TWlsZDogeyB2YWx1ZTogMiwgdGV4dDogXygnbWlsZCcpIH0sXHJcblx0XHRXYXJtOiB7IHZhbHVlOiAzLCB0ZXh0OiBfKCd3YXJtJykgfSxcclxuXHRcdEhvdDogeyB2YWx1ZTogNCwgdGV4dDogXygnaG90JykgfVxyXG5cdH0sXHJcblx0XHJcblx0RmlyZUVudW06IHtcclxuXHRcdGZyb21JbnQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRcdGZvcih2YXIgayBpbiB0aGlzKSB7XHJcblx0XHRcdFx0aWYodHlwZW9mIHRoaXNba10udmFsdWUgIT0gJ3VuZGVmaW5lZCcgJiYgdGhpc1trXS52YWx1ZSA9PSB2YWx1ZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXNba107XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fSxcclxuXHRcdERlYWQ6IHsgdmFsdWU6IDAsIHRleHQ6IF8oJ2RlYWQnKSB9LFxyXG5cdFx0U21vbGRlcmluZzogeyB2YWx1ZTogMSwgdGV4dDogXygnc21vbGRlcmluZycpIH0sXHJcblx0XHRGbGlja2VyaW5nOiB7IHZhbHVlOiAyLCB0ZXh0OiBfKCdmbGlja2VyaW5nJykgfSxcclxuXHRcdEJ1cm5pbmc6IHsgdmFsdWU6IDMsIHRleHQ6IF8oJ2J1cm5pbmcnKSB9LFxyXG5cdFx0Um9hcmluZzogeyB2YWx1ZTogNCwgdGV4dDogXygncm9hcmluZycpIH1cclxuXHR9LFxyXG5cdFxyXG5cdHNldFRpdGxlOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0aXRsZSA9IF8oXCJUaGUgVmlsbGFnZVwiKTtcclxuXHRcdGlmKEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gdGhpcykge1xyXG5cdFx0XHRkb2N1bWVudC50aXRsZSA9IHRpdGxlO1xyXG5cdFx0fVxyXG5cdFx0JCgnZGl2I2xvY2F0aW9uX3ZpbGxhZ2UnKS50ZXh0KHRpdGxlKTtcclxuXHR9LFxyXG5cdFxyXG5cdHVwZGF0ZUJ1dHRvbjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgbGlnaHQgPSAkKCcjbGlnaHRCdXR0b24uYnV0dG9uJyk7XHJcblx0XHR2YXIgc3Rva2UgPSAkKCcjc3Rva2VCdXR0b24uYnV0dG9uJyk7XHJcblx0XHRpZigkU00uZ2V0KCdnYW1lLmZpcmUudmFsdWUnKSA9PSBWaWxsYWdlLkZpcmVFbnVtLkRlYWQudmFsdWUgJiYgc3Rva2UuY3NzKCdkaXNwbGF5JykgIT0gJ25vbmUnKSB7XHJcblx0XHRcdHN0b2tlLmhpZGUoKTtcclxuXHRcdFx0bGlnaHQuc2hvdygpO1xyXG5cdFx0XHRpZihzdG9rZS5oYXNDbGFzcygnZGlzYWJsZWQnKSkge1xyXG5cdFx0XHRcdEJ1dHRvbi5jb29sZG93bihsaWdodCk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZihsaWdodC5jc3MoJ2Rpc3BsYXknKSAhPSAnbm9uZScpIHtcclxuXHRcdFx0c3Rva2Uuc2hvdygpO1xyXG5cdFx0XHRsaWdodC5oaWRlKCk7XHJcblx0XHRcdGlmKGxpZ2h0Lmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XHJcblx0XHRcdFx0QnV0dG9uLmNvb2xkb3duKHN0b2tlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZighJFNNLmdldCgnc3RvcmVzLndvb2QnKSkge1xyXG5cdFx0XHRsaWdodC5hZGRDbGFzcygnZnJlZScpO1xyXG5cdFx0XHRzdG9rZS5hZGRDbGFzcygnZnJlZScpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bGlnaHQucmVtb3ZlQ2xhc3MoJ2ZyZWUnKTtcclxuXHRcdFx0c3Rva2UucmVtb3ZlQ2xhc3MoJ2ZyZWUnKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgbGl6QnV0dG9uID0gJCgnI2xpekJ1dHRvbi5idXR0b24nKTtcclxuXHRcdGlmKCRTTS5nZXQoJ3ZpbGxhZ2UubGl6QWN0aXZlJykpIGxpekJ1dHRvbi5zaG93KCk7XHJcblx0XHR2YXIgYnVpbGRpbmdCdXR0b24gPSAkKCcjbmV3QnVpbGRpbmdCdXR0b24uYnV0dG9uJyk7XHJcblx0XHRpZigkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykpIGJ1aWxkaW5nQnV0dG9uLnNob3coKTtcclxuXHR9LFxyXG5cdFxyXG5cdFxyXG5cdGhhbmRsZVN0YXRlVXBkYXRlczogZnVuY3Rpb24oZSl7XHJcblx0XHRpZihlLmNhdGVnb3J5ID09ICdzdG9yZXMnKXtcclxuXHRcdFx0Ly8gVmlsbGFnZS51cGRhdGVCdWlsZEJ1dHRvbnMoKTtcclxuXHRcdH0gZWxzZSBpZihlLmNhdGVnb3J5ID09ICdpbmNvbWUnKXtcclxuXHRcdH0gZWxzZSBpZihlLnN0YXRlTmFtZS5pbmRleE9mKCdnYW1lLmJ1aWxkaW5ncycpID09PSAwKXtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHR0ZW1wQnVpbGRpbmdNZXNzYWdlOiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0XHRcdHRpdGxlOiBfKCdBIE5ldyBCdWlsZGluZycpLFxyXG5cdFx0XHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnbWFpbicsXHJcblx0XHRcdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRcdFx0XygnVGhpcyBpcyBhIG5ldyBidWlsZGluZy4gVGhlcmUgc2hvdWxkIGJlIHN0dWZmIGluIGl0LCBidXQgdGhpcyBpcyBhIHBsYWNlaG9sZGVyIGZvciBub3cuJyksXHJcblx0XHRcdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdFx0XHQnbGVhdmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0xhbWUnKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcbn07XHJcbiIsImltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi9CdXR0b25cIjtcclxuaW1wb3J0IHsgSXRlbUxpc3QgfSBmcm9tIFwiLi9pdGVtTGlzdFwiO1xyXG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tIFwiLi4vbm90aWZpY2F0aW9uc1wiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgUXVlc3RMb2cgfSBmcm9tIFwiLi9xdWVzdExvZ1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IENoYXJhY3RlciA9IHtcclxuXHRpbnZlbnRvcnk6IHt9LCAvLyBkaWN0aW9uYXJ5IHVzaW5nIGl0ZW0gbmFtZSBhcyBrZXlcclxuXHRxdWVzdFN0YXR1czoge30sIC8vIGRpY3Rpb25hcnkgdXNpbmcgcXVlc3QgbmFtZSBhcyBrZXksIGFuZCBpbnRlZ2VyIHF1ZXN0IHBoYXNlIGFzIHZhbHVlXHJcblx0ZXF1aXBwZWRJdGVtczoge1xyXG5cdFx0Ly8gc3RlYWxpbmcgdGhlIEtvTCBzdHlsZSBmb3Igbm93LCB3ZSdsbCBzZWUgaWYgSSBuZWVkIHNvbWV0aGluZ1xyXG5cdFx0Ly8gdGhhdCBmaXRzIHRoZSBnYW1lIGJldHRlciBhcyB3ZSBnb1xyXG5cdFx0aGVhZDogbnVsbCxcclxuXHRcdHRvcnNvOiBudWxsLFxyXG5cdFx0cGFudHM6IG51bGwsXHJcblx0XHQvLyBubyB3ZWFwb24sIHRyeSB0byBzZWUgaG93IGZhciB3ZSBjYW4gZ2V0IGluIHRoaXMgZ2FtZSB3aXRob3V0IGZvY3VzaW5nIG9uIGNvbWJhdFxyXG5cdFx0YWNjZXNzb3J5MTogbnVsbCxcclxuXHRcdGFjY2Vzc29yeTI6IG51bGwsXHJcblx0XHRhY2Nlc3NvcnkzOiBudWxsLFxyXG5cdH0sXHJcblxyXG5cdC8vIHN0YXRzIGJlZm9yZSBhbnkgbW9kaWZpZXJzIGZyb20gZ2VhciBvciB3aGF0ZXZlciBlbHNlIGFyZSBhcHBsaWVkXHJcblx0cmF3U3RhdHM6IHtcclxuXHRcdCdTcGVlZCc6IDUsXHJcblx0XHQnUGVyY2VwdGlvbic6IDUsXHJcblx0XHQnUmVzaWxpZW5jZSc6IDUsXHJcblx0XHQnSW5nZW51aXR5JzogNSxcclxuXHRcdCdUb3VnaG5lc3MnOiA1XHJcblx0fSxcclxuXHJcblx0Ly8gcGVya3MgZ2l2ZW4gYnkgaXRlbXMsIGNoYXJhY3RlciBjaG9pY2VzLCBkaXZpbmUgcHJvdmVuYW5jZSwgZXRjLlxyXG5cdHBlcmtzOiB7IH0sXHJcblx0XHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblx0XHRcclxuXHRcdC8vIGNyZWF0ZSB0aGUgY2hhcmFjdGVyIGJveFxyXG5cdFx0Y29uc3QgZWxlbSA9ICQoJzxkaXY+JykuYXR0cih7XHJcblx0XHRcdGlkOiAnY2hhcmFjdGVyJyxcclxuXHRcdFx0Y2xhc3NOYW1lOiAnY2hhcmFjdGVyJ1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdGVsZW0uYXBwZW5kVG8oJ2RpdiN3cmFwcGVyJyk7XHJcblxyXG5cdFx0Ly8gd3JpdGUgcmF3U3RhdHMgdG8gJFNNXHJcblx0XHQvLyBOT1RFOiBuZXZlciB3cml0ZSBkZXJpdmVkIHN0YXRzIHRvICRTTSwgYW5kIG5ldmVyIGFjY2VzcyByYXcgc3RhdHMgZGlyZWN0bHkhXHJcblx0XHQvLyBkb2luZyBzbyB3aWxsIGludHJvZHVjZSBvcHBvcnR1bml0aWVzIHRvIG1lc3MgdXAgc3RhdHMgUEVSTUFORU5UTFlcclxuICAgICAgICBpZiAoISRTTS5nZXQoJ2NoYXJhY3Rlci5yYXdzdGF0cycpKSB7XHJcbiAgICAgICAgICAgICRTTS5zZXQoJ2NoYXJhY3Rlci5yYXdzdGF0cycsIENoYXJhY3Rlci5yYXdTdGF0cyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHRcdFx0Q2hhcmFjdGVyLnJhd1N0YXRzID0gJFNNLmdldCgnY2hhcmFjdGVyLnJhd1N0YXRzJykgYXMgYW55O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghJFNNLmdldCgnY2hhcmFjdGVyLnBlcmtzJykpIHtcclxuICAgICAgICAgICAgJFNNLnNldCgnY2hhcmFjdGVyLnBlcmtzJywgQ2hhcmFjdGVyLnBlcmtzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cdFx0XHRDaGFyYWN0ZXIucGVya3MgPSAkU00uZ2V0KCdjaGFyYWN0ZXIucGVya3MnKSBhcyBhbnk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCEkU00uZ2V0KCdjaGFyYWN0ZXIuaW52ZW50b3J5JykpIHtcclxuICAgICAgICAgICAgJFNNLnNldCgnY2hhcmFjdGVyLmludmVudG9yeScsIENoYXJhY3Rlci5pbnZlbnRvcnkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5pbnZlbnRvcnkgPSAkU00uZ2V0KCdjaGFyYWN0ZXIuaW52ZW50b3J5JykgYXMgYW55O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghJFNNLmdldCgnY2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMnKSkge1xyXG4gICAgICAgICAgICAkU00uc2V0KCdjaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcycsIENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cdFx0XHRDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcyA9ICRTTS5nZXQoJ2NoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zJykgYXMgYW55O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghJFNNLmdldCgnY2hhcmFjdGVyLnF1ZXN0U3RhdHVzJykpIHtcclxuICAgICAgICAgICAgJFNNLnNldCgnY2hhcmFjdGVyLnF1ZXN0U3RhdHVzJywgQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cdFx0XHRDaGFyYWN0ZXIucXVlc3RTdGF0dXMgPSAkU00uZ2V0KCdjaGFyYWN0ZXIucXVlc3RTdGF0dXMnKSBhcyBhbnk7XHJcblx0XHR9XHJcblxyXG4gICAgICAgICQoJzxkaXY+JykudGV4dCgnQ2hhcmFjdGVyJykuYXR0cignaWQnLCAndGl0bGUnKS5hcHBlbmRUbygnZGl2I2NoYXJhY3RlcicpO1xyXG5cclxuXHRcdC8vIFRPRE86IHJlcGxhY2UgdGhpcyB3aXRoIGRlcml2ZWQgc3RhdHNcclxuICAgICAgICBmb3IodmFyIHN0YXQgaW4gJFNNLmdldCgnY2hhcmFjdGVyLnJhd3N0YXRzJykgYXMgYW55KSB7XHJcbiAgICAgICAgICAgICQoJzxkaXY+JykudGV4dChzdGF0ICsgJzogJyArICRTTS5nZXQoJ2NoYXJhY3Rlci5yYXdzdGF0cy4nICsgc3RhdCkpLmFwcGVuZFRvKCdkaXYjY2hhcmFjdGVyJyk7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnYnV0dG9ucycpLmNzcyhcIm1hcmdpbi10b3BcIiwgXCIyMHB4XCIpLmFwcGVuZFRvKCdkaXYjY2hhcmFjdGVyJyk7XHJcblx0XHR2YXIgaW52ZW50b3J5QnV0dG9uID0gQnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiBcImludmVudG9yeVwiLFxyXG5cdFx0XHR0ZXh0OiBcIkludmVudG9yeVwiLFxyXG5cdFx0XHRjbGljazogQ2hhcmFjdGVyLm9wZW5JbnZlbnRvcnlcclxuXHRcdH0pLmFwcGVuZFRvKCQoJyNidXR0b25zJywgJ2RpdiNjaGFyYWN0ZXInKSk7XHJcblx0XHRcclxuXHRcdHZhciBxdWVzdExvZ0J1dHRvbiA9IEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogXCJxdWVzdExvZ1wiLFxyXG5cdFx0XHR0ZXh0OiBcIlF1ZXN0IExvZ1wiLFxyXG5cdFx0XHRjbGljazogQ2hhcmFjdGVyLm9wZW5RdWVzdExvZ1xyXG5cdFx0fSkuYXBwZW5kVG8oJCgnI2J1dHRvbnMnLCAnZGl2I2NoYXJhY3RlcicpKTtcclxuXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHR3aW5kb3cuQ2hhcmFjdGVyID0gdGhpcztcclxuXHR9LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHt9LCAvLyBOb3RoaW5nIGZvciBub3dcclxuXHRcclxuXHRlbGVtOiBudWxsLFxyXG5cclxuXHRpbnZlbnRvcnlEaXNwbGF5OiBudWxsIGFzIGFueSxcclxuXHRxdWVzdExvZ0Rpc3BsYXk6IG51bGwgYXMgYW55LFxyXG5cclxuXHRvcGVuSW52ZW50b3J5OiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIGNyZWF0aW5nIGEgaGFuZGxlIGZvciBsYXRlciBhY2Nlc3MsIHN1Y2ggYXMgY2xvc2luZyBpbnZlbnRvcnlcclxuXHRcdENoYXJhY3Rlci5pbnZlbnRvcnlEaXNwbGF5ID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdpbnZlbnRvcnknKS5hZGRDbGFzcygnZXZlbnRQYW5lbCcpLmNzcygnb3BhY2l0eScsICcwJyk7XHJcblx0XHR2YXIgaW52ZW50b3J5RGlzcGxheSA9IENoYXJhY3Rlci5pbnZlbnRvcnlEaXNwbGF5O1xyXG5cdFx0Q2hhcmFjdGVyLmludmVudG9yeURpc3BsYXlcclxuXHRcdC8vIHNldCB1cCBjbGljayBhbmQgaG92ZXIgaGFuZGxlcnMgZm9yIGludmVudG9yeSBpdGVtc1xyXG5cdFx0Lm9uKFwiY2xpY2tcIiwgXCIjaXRlbVwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0Q2hhcmFjdGVyLnVzZUludmVudG9yeUl0ZW0oJCh0aGlzKS5kYXRhKFwibmFtZVwiKSk7XHJcblx0XHRcdENoYXJhY3Rlci5jbG9zZUludmVudG9yeSgpO1xyXG5cdFx0fSkub24oXCJtb3VzZWVudGVyXCIsIFwiI2l0ZW1cIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciB0b29sdGlwID0gJChcIjxkaXYgaWQ9J3Rvb2x0aXAnIGNsYXNzPSd0b29sdGlwJz5cIiArIEl0ZW1MaXN0WyQodGhpcykuZGF0YShcIm5hbWVcIildLnRleHQgKyBcIjwvZGl2PlwiKVxyXG5cdFx0XHQuYXR0cignZGF0YS1uYW1lJywgaXRlbSk7XHJcblx0XHRcdHRvb2x0aXAuYXBwZW5kVG8oJCh0aGlzKSk7XHJcblx0XHR9KS5vbihcIm1vdXNlbGVhdmVcIiwgXCIjaXRlbVwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0JChcIiN0b29sdGlwXCIsIFwiI1wiICsgJCh0aGlzKS5kYXRhKFwibmFtZVwiKSkuZmFkZU91dCgpLnJlbW92ZSgpO1xyXG5cdFx0fSk7XHJcblx0XHQkKCc8ZGl2PicpLmFkZENsYXNzKCdldmVudFRpdGxlJykudGV4dCgnSW52ZW50b3J5JykuYXBwZW5kVG8oaW52ZW50b3J5RGlzcGxheSk7XHJcblx0XHR2YXIgaW52ZW50b3J5RGVzYyA9ICQoJzxkaXY+JykudGV4dChcIkNsaWNrIHRoaW5ncyBpbiB0aGUgbGlzdCB0byB1c2UgdGhlbS5cIilcclxuXHRcdFx0LmhvdmVyKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciB0b29sdGlwID0gJChcIjxkaXYgaWQ9J3Rvb2x0aXAnIGNsYXNzPSd0b29sdGlwJz5cIiArIFwiTm90IHRoaXMsIHRob3VnaC5cIiArIFwiPC9kaXY+XCIpO1xyXG4gICAgXHRcdFx0dG9vbHRpcC5hcHBlbmRUbyhpbnZlbnRvcnlEZXNjKTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JChcIiN0b29sdGlwXCIpLmZhZGVPdXQoKS5yZW1vdmUoKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0Lm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXyhcIkkgYmV0IHlvdSB0aGluayB5b3UncmUgcHJldHR5IGZ1bm55LCBodWg/IENsaWNraW5nIHRoZSB0aGluZyBJIHNhaWQgd2Fzbid0IGNsaWNrYWJsZT9cIikpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQuY3NzKFwibWFyZ2luLWJvdHRvbVwiLCBcIjIwcHhcIilcclxuXHRcdFx0LmFwcGVuZFRvKGludmVudG9yeURpc3BsYXkpO1xyXG5cdFx0XHJcblx0XHRmb3IodmFyIGl0ZW0gaW4gQ2hhcmFjdGVyLmludmVudG9yeSkge1xyXG5cdFx0XHQvLyBtYWtlIHRoZSBpbnZlbnRvcnkgY291bnQgbG9vayBhIGJpdCBuaWNlclxyXG5cdFx0XHR2YXIgaW52ZW50b3J5RWxlbSA9ICQoJzxkaXY+JylcclxuXHRcdFx0LmF0dHIoJ2lkJywgJ2l0ZW0nKVxyXG5cdFx0XHQuYXR0cignZGF0YS1uYW1lJywgaXRlbSlcclxuXHRcdFx0LnRleHQoSXRlbUxpc3RbaXRlbV0ubmFtZSAgKyAnICAoeCcgKyBDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dLnRvU3RyaW5nKCkgKyAnKScpXHJcblx0XHRcdC5hcHBlbmRUbyhpbnZlbnRvcnlEaXNwbGF5KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBUT0RPOiBtYWtlIHRoaXMgQ1NTIGFuIGFjdHVhbCBjbGFzcyBzb21ld2hlcmUsIEknbSBzdXJlIEknbGwgbmVlZCBpdCBhZ2FpblxyXG5cdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdidXR0b25zJykuY3NzKFwibWFyZ2luLXRvcFwiLCBcIjIwcHhcIikuYXBwZW5kVG8oaW52ZW50b3J5RGlzcGxheSk7XHJcblx0XHR2YXIgYiA9IFxyXG5cdFx0Ly9uZXcgXHJcblx0XHRCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6IFwiY2xvc2VJbnZlbnRvcnlcIixcclxuXHRcdFx0dGV4dDogXCJDbG9zZVwiLFxyXG5cdFx0XHRjbGljazogQ2hhcmFjdGVyLmNsb3NlSW52ZW50b3J5XHJcblx0XHR9KS5hcHBlbmRUbygkKCcjYnV0dG9ucycsIGludmVudG9yeURpc3BsYXkpKTtcclxuXHRcdCQoJ2RpdiN3cmFwcGVyJykuYXBwZW5kKGludmVudG9yeURpc3BsYXkpO1xyXG5cdFx0aW52ZW50b3J5RGlzcGxheS5hbmltYXRlKHtvcGFjaXR5OiAxfSwgRXZlbnRzLl9QQU5FTF9GQURFLCAnbGluZWFyJyk7XHJcblx0fSxcclxuXHJcblx0Y2xvc2VJbnZlbnRvcnk6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Q2hhcmFjdGVyLmludmVudG9yeURpc3BsYXkuZW1wdHkoKTtcclxuXHRcdENoYXJhY3Rlci5pbnZlbnRvcnlEaXNwbGF5LnJlbW92ZSgpO1xyXG5cdH0sXHJcblxyXG5cdGFkZFRvSW52ZW50b3J5OiBmdW5jdGlvbihpdGVtLCBhbW91bnQ9MSkge1xyXG5cdFx0aWYgKENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0pIHtcclxuXHRcdFx0Q2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSArPSBhbW91bnQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dID0gYW1vdW50O1xyXG5cdFx0fVxyXG5cclxuXHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiQWRkZWQgXCIgKyBJdGVtTGlzdFtpdGVtXS5uYW1lICsgXCIgdG8gaW52ZW50b3J5LlwiKVxyXG5cdFx0JFNNLnNldCgnaW52ZW50b3J5JywgQ2hhcmFjdGVyLmludmVudG9yeSk7XHJcblx0fSxcclxuXHJcblxyXG5cdHJlbW92ZUZyb21JbnZlbnRvcnk6IGZ1bmN0aW9uKGl0ZW0sIGFtb3VudD0xKSB7XHJcblx0XHRpZiAoQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSkgQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSAtPSBhbW91bnQ7XHJcblx0XHRpZiAoQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSA8IDEpIHtcclxuXHRcdFx0ZGVsZXRlIENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV07XHJcblx0XHR9XHJcblxyXG5cdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJSZW1vdmVkIFwiICsgSXRlbUxpc3RbaXRlbV0ubmFtZSArIFwiIGZyb20gaW52ZW50b3J5LlwiKVxyXG5cdFx0JFNNLnNldCgnaW52ZW50b3J5JywgQ2hhcmFjdGVyLmludmVudG9yeSk7XHJcblx0fSxcclxuXHJcblx0dXNlSW52ZW50b3J5SXRlbTogZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0aWYgKENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0gJiYgQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSA+IDApIHtcclxuXHRcdFx0Ly8gdXNlIHRoZSBlZmZlY3QgaW4gdGhlIGludmVudG9yeTsganVzdCBpbiBjYXNlIGEgbmFtZSBtYXRjaGVzIGJ1dCB0aGUgZWZmZWN0XHJcblx0XHRcdC8vIGRvZXMgbm90LCBhc3N1bWUgdGhlIGludmVudG9yeSBpdGVtIGlzIHRoZSBzb3VyY2Ugb2YgdHJ1dGhcclxuXHRcdFx0SXRlbUxpc3RbaXRlbV0ub25Vc2UoKTtcclxuXHRcdFx0aWYgKHR5cGVvZihJdGVtTGlzdFtpdGVtXS5kZXN0cm95T25Vc2UpID09IFwiZnVuY3Rpb25cIiAmJiBJdGVtTGlzdFtpdGVtXS5kZXN0cm95T25Vc2UoKSkge1xyXG5cdFx0XHRcdENoYXJhY3Rlci5yZW1vdmVGcm9tSW52ZW50b3J5KGl0ZW0pO1xyXG5cdFx0XHR9IGVsc2UgaWYgKEl0ZW1MaXN0W2l0ZW1dLmRlc3Ryb3lPblVzZSkge1xyXG5cdFx0XHRcdENoYXJhY3Rlci5yZW1vdmVGcm9tSW52ZW50b3J5KGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0JFNNLnNldCgnaW52ZW50b3J5JywgQ2hhcmFjdGVyLmludmVudG9yeSk7XHJcblx0fSxcclxuXHJcblx0ZXF1aXBJdGVtOiBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRpZiAoSXRlbUxpc3RbaXRlbV0uc2xvdCAmJiBDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtc1tJdGVtTGlzdFtpdGVtXS5zbG90XSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdENoYXJhY3Rlci5hZGRUb0ludmVudG9yeShDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtc1tJdGVtTGlzdFtpdGVtXS5zbG90XSk7XHJcblx0XHRcdENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zW0l0ZW1MaXN0W2l0ZW1dLnNsb3RdID0gaXRlbTtcclxuXHRcdFx0aWYgKEl0ZW1MaXN0W2l0ZW1dLm9uRXF1aXApIHtcclxuXHRcdFx0XHRJdGVtTGlzdFtpdGVtXS5vbkVxdWlwKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Q2hhcmFjdGVyLmFwcGx5RXF1aXBtZW50RWZmZWN0cygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdCRTTS5zZXQoJ2VxdWlwcGVkSXRlbXMnLCBDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcyk7XHJcblx0XHQkU00uc2V0KCdpbnZlbnRvcnknLCBDaGFyYWN0ZXIuaW52ZW50b3J5KTtcclxuXHR9LFxyXG5cclxuXHRncmFudFBlcms6IGZ1bmN0aW9uKHBlcmspIHtcclxuXHRcdGlmIChDaGFyYWN0ZXIucGVya3NbcGVyay5uYW1lXSkge1xyXG5cdFx0XHRpZihwZXJrLnRpbWVMZWZ0ID4gMCkge1xyXG5cdFx0XHRcdENoYXJhY3Rlci5wZXJrc1twZXJrLm5hbWVdICs9IHBlcmsudGltZUxlZnQ7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5wZXJrc1twZXJrLm5hbWVdID0gcGVyaztcclxuXHRcdH1cclxuXHJcblx0XHRcclxuXHRcdCRTTS5zZXQoJ3BlcmtzJywgQ2hhcmFjdGVyLnBlcmtzKVxyXG5cdH0sXHJcblxyXG5cdG9wZW5RdWVzdExvZzogZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBjcmVhdGluZyBhIGhhbmRsZSBmb3IgbGF0ZXIgYWNjZXNzLCBzdWNoIGFzIGNsb3NpbmcgcXVlc3QgbG9nXHJcblx0XHRDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5ID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdxdWVzdCcpLmFkZENsYXNzKCdldmVudFBhbmVsJykuY3NzKCdvcGFjaXR5JywgJzAnKTtcclxuXHRcdHZhciBxdWVzdExvZ0Rpc3BsYXkgPSBDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5O1xyXG5cdFx0Q2hhcmFjdGVyLnF1ZXN0TG9nRGlzcGxheVxyXG5cdFx0Ly8gc2V0IHVwIGNsaWNrIGFuZCBob3ZlciBoYW5kbGVycyBmb3IgcXVlc3RzXHJcblx0XHQub24oXCJjbGlja1wiLCBcIiNxdWVzdFwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0Q2hhcmFjdGVyLmRpc3BsYXlRdWVzdCgkKHRoaXMpLmRhdGEoXCJuYW1lXCIpKTtcclxuXHRcdH0pO1xyXG5cdFx0JCgnPGRpdj4nKS5hZGRDbGFzcygnZXZlbnRUaXRsZScpLnRleHQoJ1F1ZXN0IExvZycpLmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHR2YXIgcXVlc3RMb2dEZXNjID0gJCgnPGRpdj4nKS50ZXh0KFwiQ2xpY2sgcXVlc3QgbmFtZXMgdG8gc2VlIG1vcmUgaW5mby5cIilcclxuXHRcdFx0LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCIyMHB4XCIpXHJcblx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0XHJcblx0XHRmb3IodmFyIHF1ZXN0IGluIENoYXJhY3Rlci5xdWVzdFN0YXR1cykge1xyXG5cdFx0XHR2YXIgcXVlc3RFbGVtID0gJCgnPGRpdj4nKVxyXG5cdFx0XHQuYXR0cignaWQnLCBcInF1ZXN0XCIpXHJcblx0XHRcdC5hdHRyKCdkYXRhLW5hbWUnLCBxdWVzdClcclxuXHRcdFx0LnRleHQoUXVlc3RMb2dbcXVlc3RdLm5hbWUpXHJcblx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0XHRpZiAoQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW3F1ZXN0XSA9PSAtMSkge1xyXG5cdFx0XHRcdHF1ZXN0RWxlbVxyXG5cdFx0XHRcdC8vIEkgd2FudCB0aGlzIHRvIGJlIG5vdCBzdHJ1Y2sgdGhyb3VnaCwgYnV0IHRoYXQncyB0b28gYW5ub3lpbmcgdG8gd29ycnlcclxuXHRcdFx0XHQvLyBhYm91dCByaWdodCBub3dcclxuXHRcdFx0XHQvLyAucHJlcGVuZChcIkRPTkUgXCIpXHJcblx0XHRcdFx0LndyYXAoXCI8c3RyaWtlPlwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFRPRE86IG1ha2UgdGhpcyBDU1MgYW4gYWN0dWFsIGNsYXNzIHNvbWV3aGVyZSwgSSdtIHN1cmUgSSdsbCBuZWVkIGl0IGFnYWluXHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2J1dHRvbnMnKS5jc3MoXCJtYXJnaW4tdG9wXCIsIFwiMjBweFwiKS5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0dmFyIGIgPSBCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6IFwiY2xvc2VRdWVzdExvZ1wiLFxyXG5cdFx0XHR0ZXh0OiBcIkNsb3NlXCIsXHJcblx0XHRcdGNsaWNrOiBDaGFyYWN0ZXIuY2xvc2VRdWVzdExvZ1xyXG5cdFx0fSkuYXBwZW5kVG8oJCgnI2J1dHRvbnMnLCBxdWVzdExvZ0Rpc3BsYXkpKTtcclxuXHRcdCQoJ2RpdiN3cmFwcGVyJykuYXBwZW5kKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHRxdWVzdExvZ0Rpc3BsYXkuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIEV2ZW50cy5fUEFORUxfRkFERSwgJ2xpbmVhcicpO1xyXG5cdH0sXHJcblxyXG5cdGRpc3BsYXlRdWVzdDogZnVuY3Rpb24ocXVlc3Q6IHN0cmluZykge1xyXG5cdFx0Y29uc3QgcXVlc3RMb2dEaXNwbGF5ID0gQ2hhcmFjdGVyLnF1ZXN0TG9nRGlzcGxheTtcclxuXHRcdHF1ZXN0TG9nRGlzcGxheS5lbXB0eSgpO1xyXG5cdFx0Y29uc3QgY3VycmVudFF1ZXN0ID0gUXVlc3RMb2dbcXVlc3RdO1xyXG5cclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAncXVlc3QnKS5hZGRDbGFzcygnZXZlbnRQYW5lbCcpLmNzcygnb3BhY2l0eScsICcwJyk7XHJcblx0XHQkKCc8ZGl2PicpLmFkZENsYXNzKCdldmVudFRpdGxlJykudGV4dChjdXJyZW50UXVlc3QubmFtZSkuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHJcblx0XHR2YXIgcXVlc3RMb2dEZXNjID0gJCgnPGRpdj4nKS50ZXh0KGN1cnJlbnRRdWVzdC5sb2dEZXNjcmlwdGlvbilcclxuXHRcdFx0LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCIyMHB4XCIpXHJcblx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cclxuXHRcdGlmIChDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdIGFzIG51bWJlciA9PSAtMSkge1xyXG5cdFx0XHR2YXIgcGhhc2VEZXNjID0gJCgnPGRpdj4nKS50ZXh0KFwiVGhpcyBxdWVzdCBpcyBjb21wbGV0ZSFcIilcclxuXHRcdFx0LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCIxMHB4XCIpXHJcblx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDw9IChDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdIGFzIG51bWJlcik7IGkrKykge1xyXG5cdFx0XHR2YXIgcGhhc2VEZXNjID0gJCgnPGRpdj4nKS50ZXh0KGN1cnJlbnRRdWVzdC5waGFzZXNbaV0uZGVzY3JpcHRpb24pXHJcblx0XHRcdC5jc3MoXCJtYXJnaW4tYm90dG9tXCIsIFwiMTBweFwiKVxyXG5cdFx0XHQuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHRcdFx0dmFyIGNvbXBsZXRlID0gdHJ1ZTtcclxuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBPYmplY3Qua2V5cyhjdXJyZW50UXVlc3QucGhhc2VzW2ldLnJlcXVpcmVtZW50cykubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHR2YXIgcmVxdWlyZW1lbnRzRGVzYyA9ICQoJzxkaXY+JykudGV4dChjdXJyZW50UXVlc3QucGhhc2VzW2ldLnJlcXVpcmVtZW50c1tqXS5yZW5kZXJSZXF1aXJlbWVudCgpKVxyXG5cdFx0XHRcdFx0LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCIyMHB4XCIpXHJcblx0XHRcdFx0XHQuY3NzKFwibWFyZ2luLWxlZnRcIiwgXCIyMHB4XCIpXHJcblx0XHRcdFx0XHQuY3NzKCdmb250LXN0eWxlJywgJ2l0YWxpYycpXHJcblx0XHRcdFx0XHQuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHRcdFx0XHRpZiAoIWN1cnJlbnRRdWVzdC5waGFzZXNbaV0ucmVxdWlyZW1lbnRzW2pdLmlzQ29tcGxldGUoKSkgY29tcGxldGUgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoY29tcGxldGUpIHtcclxuXHRcdFx0XHRwaGFzZURlc2Mud3JhcChcIjxzdHJpa2U+XCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVE9ETzogbWFrZSB0aGlzIENTUyBhbiBhY3R1YWwgY2xhc3Mgc29tZXdoZXJlLCBJJ20gc3VyZSBJJ2xsIG5lZWQgaXQgYWdhaW5cclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnYnV0dG9ucycpLmNzcyhcIm1hcmdpbi10b3BcIiwgXCIyMHB4XCIpLmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblxyXG5cdFx0dmFyIGIgPSBCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6IFwiYmFja1RvUXVlc3RMb2dcIixcclxuXHRcdFx0dGV4dDogXCJCYWNrIHRvIFF1ZXN0IExvZ1wiLFxyXG5cdFx0XHRjbGljazogQ2hhcmFjdGVyLmJhY2tUb1F1ZXN0TG9nXHJcblx0XHR9KS5hcHBlbmRUbygkKCcjYnV0dG9ucycsIHF1ZXN0TG9nRGlzcGxheSkpO1xyXG5cclxuXHRcdHZhciBiID0gQnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiBcImNsb3NlUXVlc3RMb2dcIixcclxuXHRcdFx0dGV4dDogXCJDbG9zZVwiLFxyXG5cdFx0XHRjbGljazogQ2hhcmFjdGVyLmNsb3NlUXVlc3RMb2dcclxuXHRcdH0pLmFwcGVuZFRvKCQoJyNidXR0b25zJywgcXVlc3RMb2dEaXNwbGF5KSk7XHJcblx0fSxcclxuXHJcblx0Y2xvc2VRdWVzdExvZzogZnVuY3Rpb24oKSB7XHJcblx0XHRDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5LmVtcHR5KCk7XHJcblx0XHRDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5LnJlbW92ZSgpO1xyXG5cdH0sXHJcblxyXG5cdGJhY2tUb1F1ZXN0TG9nOiBmdW5jdGlvbigpIHtcclxuXHRcdENoYXJhY3Rlci5jbG9zZVF1ZXN0TG9nKCk7XHJcblx0XHRDaGFyYWN0ZXIub3BlblF1ZXN0TG9nKCk7XHJcblx0fSxcclxuXHJcblx0c2V0UXVlc3RTdGF0dXM6IGZ1bmN0aW9uKHF1ZXN0LCBwaGFzZSkge1xyXG5cdFx0Ly8gbWlnaHQgYmUgYSBnb29kIGlkZWEgdG8gY2hlY2sgZm9yIGxpbmVhciBxdWVzdCBwcm9ncmVzc2lvbiBoZXJlP1xyXG5cdFx0aWYgKFF1ZXN0TG9nW3F1ZXN0XSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdENoYXJhY3Rlci5xdWVzdFN0YXR1c1txdWVzdF0gPSBwaGFzZTtcclxuXHJcblx0XHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiUXVlc3QgTG9nIHVwZGF0ZWQuXCIpO1xyXG5cdFx0XHQkU00uc2V0KCdxdWVzdFN0YXR1cycsIENoYXJhY3Rlci5xdWVzdFN0YXR1cyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Y2hlY2tRdWVzdFN0YXR1czogZnVuY3Rpb24ocXVlc3QpIHtcclxuXHRcdGNvbnN0IGN1cnJlbnRQaGFzZSA9IFF1ZXN0TG9nW3F1ZXN0XS5waGFzZXNbQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW3F1ZXN0XV07XHJcblxyXG5cdFx0dmFyIGNvbXBsZXRlID0gdHJ1ZTtcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgT2JqZWN0LmtleXMoY3VycmVudFBoYXNlLnJlcXVpcmVtZW50cykubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKCFjdXJyZW50UGhhc2UucmVxdWlyZW1lbnRzW2ldLmlzQ29tcGxldGUoKSlcclxuXHRcdFx0XHRjb21wbGV0ZSA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGlmIHRoZXJlIGlzIGEgbmV4dCBwaGFzZSwgc2V0IHF1ZXN0U3RhdHVzIHRvIGl0XHJcblx0XHRpZiAoUXVlc3RMb2dbcXVlc3RdLnBoYXNlc1tDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdICsgMV0gIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdICs9IDE7XHJcblx0XHR9IGVsc2UgeyAvLyBlbHNlIHNldCBpdCB0byBjb21wbGV0ZVxyXG5cdFx0XHRDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdID0gLTE7XHJcblx0XHR9XHJcblxyXG5cdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJRdWVzdCBMb2cgdXBkYXRlZC5cIik7XHJcblx0XHQkU00uc2V0KCdxdWVzdFN0YXR1cycsIENoYXJhY3Rlci5xdWVzdFN0YXR1cyk7XHJcblx0fSxcclxuXHJcblx0Ly8gYXBwbHkgZXF1aXBtZW50IGVmZmVjdHMsIHdoaWNoIHNob3VsZCBhbGwgY2hlY2sgYWdhaW5zdCAkU00gc3RhdGUgdmFyaWFibGVzO1xyXG5cdC8vIHRoaXMgc2hvdWxkIGJlIGNhbGxlZCBvbiBiYXNpY2FsbHkgZXZlcnkgcGxheWVyIGFjdGlvbiB3aGVyZSBhIHBpZWNlIG9mIGdlYXJcclxuXHQvLyB3b3VsZCBkbyBzb21ldGhpbmcgb3IgY2hhbmdlIGFuIG91dGNvbWU7IGdpdmUgZXh0cmFQYXJhbXMgdG8gdGhlIGVmZmVjdCBiZWluZyBcclxuXHQvLyBhcHBsaWVkIGZvciBhbnl0aGluZyB0aGF0J3MgcmVsZXZhbnQgdG8gdGhlIGVmZmVjdCBidXQgbm90IGhhbmRsZWQgYnkgJFNNXHJcblx0YXBwbHlFcXVpcG1lbnRFZmZlY3RzOiBmdW5jdGlvbihleHRyYVBhcmFtcz8pIHtcclxuXHRcdGZvciAoY29uc3QgaXRlbSBpbiBDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcykge1xyXG5cdFx0XHRpZiAoSXRlbUxpc3RbaXRlbV0uZWZmZWN0cykge1xyXG5cdFx0XHRcdGZvciAoY29uc3QgZWZmZWN0IGluIEl0ZW1MaXN0W2l0ZW1dLmVmZmVjdHMpIHtcclxuXHRcdFx0XHRcdC8vIE5PVEU6IGN1cnJlbnRseSB0aGlzIGlzIGdvb2QgZm9yIGFwcGx5aW5nIHBlcmtzIGFuZCBOb3RpZnlpbmc7XHJcblx0XHRcdFx0XHQvLyBhcmUgdGhlcmUgb3RoZXIgc2l0dWF0aW9ucyB3aGVyZSB3ZSdkIHdhbnQgdG8gYXBwbHkgZWZmZWN0cyxcclxuXHRcdFx0XHRcdC8vIG9yIGNhbiB3ZSBjb3ZlciBiYXNpY2FsbHkgZXZlcnkgY2FzZSB2aWEgdGhvc2UgdGhpbmdzP1xyXG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdFx0aWYgKGVmZmVjdC5pc0FjdGl2ZSAmJiBlZmZlY3QuaXNBY3RpdmUoZXh0cmFQYXJhbXMpKSBlZmZlY3QuYXBwbHkoZXh0cmFQYXJhbXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8vIGdldCBzdGF0cyBhZnRlciBhcHBseWluZyBhbGwgZXF1aXBtZW50IGJvbnVzZXMsIHBlcmtzLCBldGMuXHJcblx0Z2V0RGVyaXZlZFN0YXRzOiBmdW5jdGlvbigpIHtcclxuXHRcdGNvbnN0IGRlcml2ZWRTdGF0cyA9IHN0cnVjdHVyZWRDbG9uZShDaGFyYWN0ZXIucmF3U3RhdHMpO1xyXG5cdFx0Zm9yIChjb25zdCBpdGVtIGluIENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zKSB7XHJcblx0XHRcdGlmIChJdGVtTGlzdFtpdGVtXS5zdGF0Qm9udXNlcykge1xyXG5cdFx0XHRcdGZvciAoY29uc3Qgc3RhdCBpbiBPYmplY3Qua2V5cyhJdGVtTGlzdFtpdGVtXS5zdGF0Qm9udXNlcykpIHtcclxuXHRcdFx0XHRcdGlmICh0eXBlb2YgKEl0ZW1MaXN0W2l0ZW1dLnN0YXRCb251c2VzW3N0YXRdID09IFwiZnVuY3Rpb25cIikpIHtcclxuXHRcdFx0XHRcdFx0ZGVyaXZlZFN0YXRzW3N0YXRdICs9IEl0ZW1MaXN0W2l0ZW1dLnN0YXRCb251c2VzW3N0YXRdKCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRkZXJpdmVkU3RhdHNbc3RhdF0gKz0gSXRlbUxpc3RbaXRlbV0uc3RhdEJvbnVzZXNbc3RhdF07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yIChjb25zdCBwZXJrIGluIENoYXJhY3Rlci5wZXJrcykge1xyXG5cdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdGlmIChwZXJrLnN0YXRCb251c2VzKSB7XHJcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdGZvciAoY29uc3Qgc3RhdCBpbiBPYmplY3Qua2V5cyhwZXJrLnN0YXRCb251c2VzKSkge1xyXG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiAocGVyay5zdGF0Qm9udXNlc1tzdGF0XSA9PSBcImZ1bmN0aW9uXCIpKSB7XHJcblx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdFx0XHRcdFx0ZGVyaXZlZFN0YXRzW3N0YXRdICs9IHBlcmsuc3RhdEJvbnVzZXNbc3RhdF0oKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdFx0XHRcdFx0ZGVyaXZlZFN0YXRzW3N0YXRdICs9IHBlcmsuc3RhdEJvbnVzZXNbc3RhdF07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGRlcml2ZWRTdGF0cztcclxuXHR9XHJcbn0iLCIvLyBhbGwgaXRlbXMgZ28gaGVyZSwgc28gdGhhdCBub3RoaW5nIHNpbGx5IGhhcHBlbnMgaW4gdGhlIGV2ZW50IHRoYXQgdGhleSBnZXQgcHV0IGluIExvY2FsIFN0b3JhZ2VcclxuLy8gYXMgcGFydCBvZiB0aGUgc3RhdGUgbWFuYWdlbWVudCBjb2RlOyBwbGVhc2Ugc2F2ZSBpdGVtIG5hbWVzIHRvIHRoZSBpbnZlbnRvcnksIGFuZCB0aGVuIHJlZmVyIHRvIFxyXG4vLyB0aGUgaXRlbSBsaXN0IHZpYSB0aGUgaXRlbSBuYW1lXHJcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4vY2hhcmFjdGVyXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBOb3RpZmljYXRpb25zIH0gZnJvbSBcIi4uL25vdGlmaWNhdGlvbnNcIjtcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gXCIuL2l0ZW1cIjtcclxuXHJcbi8vIERldGFpbHMgZm9yIGFsbCBpbi1nYW1lIGl0ZW1zOyB0aGUgQ2hhcmFjdGVyIGludmVudG9yeSBvbmx5IGhvbGRzIGl0ZW0gSURzXHJcbi8vIGFuZCBhbW91bnRzXHJcbmV4cG9ydCBjb25zdCBJdGVtTGlzdDoge1tpZDogc3RyaW5nXTogSXRlbX0gPSB7XHJcbiAgICBcIkxpei53ZWlyZEJvb2tcIjoge1xyXG4gICAgICAgIG5hbWU6ICdXZWlyZCBCb29rJyxcclxuICAgICAgICBwbHVyYWxOYW1lOiAnV2VpcmQgQm9va3MnLFxyXG4gICAgICAgIHRleHQ6IF8oJ0EgYm9vayB5b3UgZm91bmQgYXQgTGl6XFwncyBwbGFjZS4gU3VwcG9zZWRseSBoYXMgaW5mb3JtYXRpb24gYWJvdXQgQ2hhZHRvcGlhLicpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHsgXHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAgXyhcIkEgQnJpZWYgSGlzdG9yeSBvZiBDaGFkdG9waWFcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKCdUaGlzIGJvb2sgaXMgcHJldHR5IGJvcmluZywgYnV0IHlvdSBtYW5hZ2UgdG8gbGVhcm4gYSBiaXQgbW9yZSBpbiBzcGl0ZSBvZiB5b3VyIHBvb3IgYXR0ZW50aW9uIHNwYW4uJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKCdGb3IgZXhhbXBsZSwgeW91IGxlYXJuIHRoYXQgXCJDaGFkdG9waWFcIiBkb2VzblxcJ3QgaGF2ZSBhIGNhcGl0YWwgXFwnVFxcJy4gVGhhdFxcJ3MgcHJldHR5IGNvb2wsIGh1aD8nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oJy4uLiBXaGF0IHdlcmUgeW91IGRvaW5nIGFnYWluPycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1NvbWV0aGluZyBjb29sZXIgdGhhbiByZWFkaW5nLCBwcm9iYWJseScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiBDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoXCJMaXouYm9yaW5nQm9va1wiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IHRydWUsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG5cclxuICAgIFwiTGl6LmJvcmluZ0Jvb2tcIjoge1xyXG4gICAgICAgIG5hbWU6ICdcIkEgQnJpZWYgSGlzdG9yeSBvZiBDaGFkdG9waWFcIicsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ011bHRpcGxlIGNvcGllcyBvZiBcIkEgQnJpZWYgSGlzdG9yeSBvZiBDaGFkdG9waWFcIicsXHJcbiAgICAgICAgdGV4dDogXygnTWFuLCB0aGlzIGJvb2sgaXMgYm9yaW5nLicpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IF8oXCJBIEJyaWVmIFN1bW1hcnkgb2YgYSBCcmllZiBIaXN0b3J5IG9mIENoYWR0b3BpYVwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtfKCdJdFxcJ3Mgc3RpbGwganVzdCBhcyBib3JpbmcgYXMgd2hlbiB5b3UgbGFzdCB0cmllZCB0byByZWFkIGl0LicpXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnRGFuZy4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIFwiU3RyYW5nZXIuc21vb3RoU3RvbmVcIjoge1xyXG4gICAgICAgIG5hbWU6ICdhIHNtb290aCBibGFjayBzdG9uZScsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ3Ntb290aCBibGFjayBzdG9uZXMnLFxyXG4gICAgICAgIHRleHQ6IF8oJ0l0XFwncyB3ZWlyZGx5IGVlcmllJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAoISRTTS5nZXQoJ2tub3dsZWRnZS5TdHJhbmdlci5zbW9vdGhTdG9uZScpKSB7XHJcbiAgICAgICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCAnWW91IGhhdmUgbm8gaWRlYSB3aGF0IHRvIGRvIHdpdGggdGhpcyB0aGluZy4nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEgc21vb3RoIGJsYWNrIHN0b25lXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW18oXCJJJ20gZ2VudWluZWx5IG5vdCBzdXJlIGhvdyB5b3UgZ290IHRvIHRoaXMgZXZlbnQsIGJ1dCBwbGVhc2UgbGV0IG1lIGtub3cgdmlhIEdpdEh1YiBpc3N1ZSwgeW91IGxpdHRsZSBzdGlua2VyLlwiKV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0kgc3dlYXIgdG8gZG8gdGhpcywgYXMgYSByZXNwb25zaWJsZSBjaXRpemVuIG9mIEVhcnRoJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveU9uVXNlOiBmYWxzZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH0sXHJcbiAgICBcIlN0cmFuZ2VyLndyYXBwZWRLbmlmZVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ2Ega25pZmUgd3JhcHBlZCBpbiBjbG90aCcsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ0tuaXZlcyB3cmFwcGVkIGluIHNlcGFyYXRlIGNsb3RocycsXHJcbiAgICAgICAgdGV4dDogXygnTWFuLCBJIGhvcGUgaXRcXCdzIG5vdCBhbGwgbGlrZSwgYmxvb2R5IG9uIHRoZSBibGFkZSBhbmQgc3R1ZmYuJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEga25pZmUgd3JhcHBlZCBpbiBjbG90aFwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtfKFwiWW91IHVud3JhcCB0aGUga25pZmUgY2FyZWZ1bGx5LiBJdCBzZWVtcyB0byBiZSBoaWdobHkgb3JuYW1lbnRlZCwgYW5kIHlvdSBjb3VsZCBwcm9iYWJseSBkbyBzb21lIGNyaW1lcyB3aXRoIGl0LlwiKV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0hlbGwgeWVhaCwgQWRvbGYgTG9vcyBzdHlsZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiBDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoXCJTdHJhbmdlci5zaWx2ZXJLbmlmZVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IHRydWUsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgXCJTdHJhbmdlci5zaWx2ZXJLbmlmZVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ2Egc2lsdmVyIGtuaWZlJyxcclxuICAgICAgICBwbHVyYWxOYW1lOiAnc2lsdmVyIGtuaXZlcycsXHJcbiAgICAgICAgdGV4dDogXygnSGlnaGx5IG9ybmFtZW50ZWQnKSxcclxuICAgICAgICBvblVzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBfKFwiQSBzaWx2ZXIga25pZmVcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiT25lIGRheSB5b3UnbGwgYmUgYWJsZSB0byBlcXVpcCB0aGlzLCBidXQgcmlnaHQgbm93IHRoYXQgZnVuY3Rpb25hbGl0eSBpc24ndCBwcmVzZW50LlwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJQbGVhc2UgcG9saXRlbHkgbGVhdmUgdGhlIHByZW1pc2VzIHdpdGhvdXQgYWNrbm93bGVkZ2luZyB0aGlzIG1pc3NpbmcgZmVhdHVyZS5cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnWW91IGdvdCBpdCwgY2hpZWYnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIFwiU3RyYW5nZXIuY2xvdGhCdW5kbGVcIjoge1xyXG4gICAgICAgIG5hbWU6ICdhIGJ1bmRsZSBvZiBjbG90aCcsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ2J1bmRsZXMgb2YgY2xvdGgnLFxyXG4gICAgICAgIHRleHQ6IF8oJ1doYXQgbGllcyB3aXRoaW4/JyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEgYnVuZGxlIG9mIGNsb3RoXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIk9uZSBkYXkgeW91J2xsIGJlIGFibGUgdG8gdXNlIHRoaXMgaXRlbSwgYnV0IHJpZ2h0IG5vdyB0aGF0IGZ1bmN0aW9uYWxpdHkgaXNuJ3QgcHJlc2VudC5cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiUGxlYXNlIHBvbGl0ZWx5IGxlYXZlIHRoZSBwcmVtaXNlcyB3aXRob3V0IGFja25vd2xlZGdpbmcgdGhpcyBtaXNzaW5nIGZlYXR1cmUuXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1lvdSBnb3QgaXQsIGNoaWVmJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveU9uVXNlOiBmYWxzZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH0sXHJcbiAgICBcIlN0cmFuZ2VyLmNvaW5cIjoge1xyXG4gICAgICAgIG5hbWU6ICdBIHN0cmFuZ2UgY29pbicsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ3N0cmFuZ2UgY29pbnMnLFxyXG4gICAgICAgIHRleHQ6IF8oJ0JvdGggc2lkZXMgZGVwaWN0IHRoZSBzYW1lIGltYWdlJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEgc3RyYW5nZSBjb2luXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIk9uZSBkYXkgeW91J2xsIGJlIGFibGUgdG8gdXNlIHRoaXMgaXRlbSwgYnV0IHJpZ2h0IG5vdyB0aGF0IGZ1bmN0aW9uYWxpdHkgaXNuJ3QgcHJlc2VudC5cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiUGxlYXNlIHBvbGl0ZWx5IGxlYXZlIHRoZSBwcmVtaXNlcyB3aXRob3V0IGFja25vd2xlZGdpbmcgdGhpcyBtaXNzaW5nIGZlYXR1cmUuXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1lvdSBnb3QgaXQsIGNoaWVmJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveU9uVXNlOiBmYWxzZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH0sXHJcbiAgICBcIkNhcHRhaW4uc3VwcGxpZXNcIjoge1xyXG4gICAgICAgIG5hbWU6ICdTdXBwbGllcyBmb3IgdGhlIE1heW9yJyxcclxuICAgICAgICB0ZXh0OiAnVGhleVxcJ3JlIGhlYXZ5LCBidXQgbm90IGluIGEgd2F5IHRoYXQgaW1wYWN0cyBnYW1lcGxheScsXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIlN1cHBsaWVzIGZvciB0aGUgTWF5b3JcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiQSBiaWcgYm94IG9mIHN0dWZmIGZvciB0aGUgdmlsbGFnZS4gTG9va3MgbGlrZSByYXcgbWF0ZXJpYWxzLCBtb3N0bHkuXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIkkgc2hvdWxkIHJlYWxseSB0YWtlIHRoaXMgYmFjayB0byB0aGUgTWF5b3IuXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ09rYXknKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgeyBRdWVzdCB9IGZyb20gXCIuL3F1ZXN0XCI7XHJcblxyXG5leHBvcnQgY29uc3QgUXVlc3RMb2c6IHtbaWQ6IHN0cmluZ106IFF1ZXN0fSA9IHtcclxuICAgIFwibWF5b3JTdXBwbGllc1wiOiB7XHJcbiAgICAgICAgbmFtZTogXCJTdXBwbGllcyBmb3IgdGhlIE1heW9yXCIsXHJcbiAgICAgICAgbG9nRGVzY3JpcHRpb246IFwiVGhlIG1heW9yIGhhcyBhc2tlZCB5b3UgdG8gZ2V0IHNvbWUgc3VwcGxpZXMgZm9yIGhpbSBmcm9tIHRoZSBvdXRwb3N0LlwiLFxyXG4gICAgICAgIHBoYXNlczoge1xyXG4gICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJHbyBjaGVjayBvdXQgdGhlIFJvYWQgdG8gdGhlIE91dHBvc3QgdG8gc2VlIGlmIHlvdSBjYW4gZmluZCBvdXQgbW9yZVwiLFxyXG4gICAgICAgICAgICAgICAgcmVxdWlyZW1lbnRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJSZXF1aXJlbWVudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJFNNLmdldCgncm9hZC5vcGVuJykgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnUm9hZC5jb3VudGVyJykgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJJIHNob3VsZCBnbyBjaGVjayBvdXQgdGhlIFJvYWQgdG8gdGhlIE91dHBvc3RcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCRTTS5nZXQoJ3JvYWQub3BlbicpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ1JvYWQuY291bnRlcicpICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJJIHNob3VsZCBrZWVwIGV4cGxvcmluZyB0aGUgUm9hZCB0byB0aGUgT3V0cG9zdFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoJFNNLmdldCgncm9hZC5vcGVuJykgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyID4gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJJJ3ZlIGZvdW5kIHRoZSB3YXkgdG8gdGhlIE91dHBvc3RcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCRTTS5nZXQoJ3JvYWQub3BlbicpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPiAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIDE6IHtcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkFzayB0aGUgQ2FwdGFpbiBvZiB0aGUgT3V0cG9zdCBhYm91dCB0aGUgc3VwcGxpZXNcIixcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVtZW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyUmVxdWlyZW1lbnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnb3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnKSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkkgc2hvdWxkIHRyeSB0YWxraW5nIHRvIHRoZSBDYXB0YWluIG9mIHRoZSBPdXRwb3N0XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ291dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ291dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIENoYXJhY3Rlci5pbnZlbnRvcnlbXCJDYXB0YWluLnN1cHBsaWVzXCJdID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiSSBzaG91bGQgYXNrIHRoZSBDYXB0YWluIGFib3V0IHRoZSBtaXNzaW5nIHN1cHBsaWVzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ291dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ291dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIENoYXJhY3Rlci5pbnZlbnRvcnlbXCJDYXB0YWluLnN1cHBsaWVzXCJdICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiSSd2ZSBnb3R0ZW4gdGhlIHN1cHBsaWVzIGZyb20gdGhlIENhcHRhaW5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdvdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcpICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ291dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgQ2hhcmFjdGVyLmludmVudG9yeVtcIkNhcHRhaW4uc3VwcGxpZXNcIl0gIT09IHVuZGVmaW5lZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIDI6IHtcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlJldHVybiB0aGUgc3VwcGxpZXMgdG8gdGhlIE1heW9yXCIsXHJcbiAgICAgICAgICAgICAgICByZXF1aXJlbWVudHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlclJlcXVpcmVtZW50OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gIFwiSSBzaG91bGQgaGFuZCB0aGVzZSBzdXBwbGllcyBvdmVyIHRvIHRoZSBNYXlvclwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoJFNNLmdldCgndmlsbGFnZS5tYXlvci5oYXZlR2l2ZW5TdXBwbGllcycpID09PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykgYXMgbnVtYmVyID4gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJJJ3ZlIGhhbmRlZCBvdmVyIHRoZSBzdXBwbGllcyB0byB0aGUgTWF5b3JcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnKSA9PT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykgYXMgbnVtYmVyID4gMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvKlxyXG4gKiBNb2R1bGUgZm9yIGhhbmRsaW5nIFN0YXRlc1xyXG4gKiBcclxuICogQWxsIHN0YXRlcyBzaG91bGQgYmUgZ2V0IGFuZCBzZXQgdGhyb3VnaCB0aGUgU3RhdGVNYW5hZ2VyICgkU00pLlxyXG4gKiBcclxuICogVGhlIG1hbmFnZXIgaXMgaW50ZW5kZWQgdG8gaGFuZGxlIGFsbCBuZWVkZWQgY2hlY2tzIGFuZCBlcnJvciBjYXRjaGluZy5cclxuICogVGhpcyBpbmNsdWRlcyBjcmVhdGluZyB0aGUgcGFyZW50cyBvZiBsYXllcmVkL2RlZXAgc3RhdGVzIHNvIHVuZGVmaW5lZCBzdGF0ZXNcclxuICogZG8gbm90IG5lZWQgdG8gYmUgdGVzdGVkIGZvciBhbmQgY3JlYXRlZCBiZWZvcmVoYW5kLlxyXG4gKiBcclxuICogV2hlbiBhIHN0YXRlIGlzIGNoYW5nZWQsIGFuIHVwZGF0ZSBldmVudCBpcyBzZW50IG91dCBjb250YWluaW5nIHRoZSBuYW1lIG9mIHRoZSBzdGF0ZVxyXG4gKiBjaGFuZ2VkIG9yIGluIHRoZSBjYXNlIG9mIG11bHRpcGxlIGNoYW5nZXMgKC5zZXRNLCAuYWRkTSkgdGhlIHBhcmVudCBjbGFzcyBjaGFuZ2VkLlxyXG4gKiBFdmVudDogdHlwZTogJ3N0YXRlVXBkYXRlJywgc3RhdGVOYW1lOiA8cGF0aCBvZiBzdGF0ZSBvciBwYXJlbnQgc3RhdGU+XHJcbiAqIFxyXG4gKiBPcmlnaW5hbCBmaWxlIGNyZWF0ZWQgYnk6IE1pY2hhZWwgR2FsdXNoYVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyBOb3RpZmljYXRpb25zIH0gZnJvbSBcIi4vbm90aWZpY2F0aW9uc1wiO1xyXG5cclxudmFyIFN0YXRlTWFuYWdlciA9IHtcclxuXHRcdFxyXG5cdE1BWF9TVE9SRTogOTk5OTk5OTk5OTk5OTksXHJcblx0XHJcblx0b3B0aW9uczoge30sXHJcblx0XHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdFx0XHJcblx0XHQvL2NyZWF0ZSBjYXRlZ29yaWVzXHJcblx0XHR2YXIgY2F0cyA9IFtcclxuXHRcdFx0J2ZlYXR1cmVzJyxcdFx0Ly9iaWcgZmVhdHVyZXMgbGlrZSBidWlsZGluZ3MsIGxvY2F0aW9uIGF2YWlsYWJpbGl0eSwgdW5sb2NrcywgZXRjXHJcblx0XHRcdCdzdG9yZXMnLCBcdFx0Ly9saXR0bGUgc3R1ZmYsIGl0ZW1zLCB3ZWFwb25zLCBldGNcclxuXHRcdFx0J2NoYXJhY3RlcicsIFx0Ly90aGlzIGlzIGZvciBwbGF5ZXIncyBjaGFyYWN0ZXIgc3RhdHMgc3VjaCBhcyBwZXJrc1xyXG5cdFx0XHQnaW5jb21lJyxcclxuXHRcdFx0J3RpbWVycycsXHJcblx0XHRcdCdnYW1lJywgXHRcdC8vbW9zdGx5IGxvY2F0aW9uIHJlbGF0ZWQ6IGZpcmUgdGVtcCwgd29ya2VycywgcG9wdWxhdGlvbiwgd29ybGQgbWFwLCBldGNcclxuXHRcdFx0J3BsYXlTdGF0cycsXHQvL2FueXRoaW5nIHBsYXkgcmVsYXRlZDogcGxheSB0aW1lLCBsb2FkcywgZXRjXHJcblx0XHRcdCdwcmV2aW91cycsXHRcdC8vIHByZXN0aWdlLCBzY29yZSwgdHJvcGhpZXMgKGluIGZ1dHVyZSksIGFjaGlldmVtZW50cyAoYWdhaW4sIG5vdCB5ZXQpLCBldGNcclxuXHRcdFx0J291dGZpdCdcdFx0XHQvLyB1c2VkIHRvIHRlbXBvcmFyaWx5IHN0b3JlIHRoZSBpdGVtcyB0byBiZSB0YWtlbiBvbiB0aGUgcGF0aFxyXG5cdFx0XTtcclxuXHRcdFxyXG5cdFx0Zm9yKHZhciB3aGljaCBpbiBjYXRzKSB7XHJcblx0XHRcdGlmKCEkU00uZ2V0KGNhdHNbd2hpY2hdKSkgJFNNLnNldChjYXRzW3doaWNoXSwge30pOyBcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly9zdWJzY3JpYmUgdG8gc3RhdGVVcGRhdGVzXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHQkLkRpc3BhdGNoKCdzdGF0ZVVwZGF0ZScpLnN1YnNjcmliZSgkU00uaGFuZGxlU3RhdGVVcGRhdGVzKTtcclxuXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHR3aW5kb3cuJFNNID0gdGhpcztcclxuXHR9LFxyXG5cdFxyXG5cdC8vY3JlYXRlIGFsbCBwYXJlbnRzIGFuZCB0aGVuIHNldCBzdGF0ZVxyXG5cdGNyZWF0ZVN0YXRlOiBmdW5jdGlvbihzdGF0ZU5hbWUsIHZhbHVlKSB7XHJcblx0XHR2YXIgd29yZHMgPSBzdGF0ZU5hbWUuc3BsaXQoL1suXFxbXFxdJ1wiXSsvKTtcclxuXHRcdC8vZm9yIHNvbWUgcmVhc29uIHRoZXJlIGFyZSBzb21ldGltZXMgZW1wdHkgc3RyaW5nc1xyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB3b3Jkcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAod29yZHNbaV0gPT09ICcnKSB7XHJcblx0XHRcdFx0d29yZHMuc3BsaWNlKGksIDEpO1xyXG5cdFx0XHRcdGktLTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly8gSU1QT1JUQU5UOiBTdGF0ZSByZWZlcnMgdG8gd2luZG93LlN0YXRlLCB3aGljaCBJIGhhZCB0byBpbml0aWFsaXplIG1hbnVhbGx5XHJcblx0XHQvLyAgICBpbiBFbmdpbmUudHM7IHBsZWFzZSBkb24ndCBmb3JnZXQgdGhpcyBhbmQgbWVzcyB3aXRoIGFueXRoaW5nIG5hbWVkXHJcblx0XHQvLyAgICBcIlN0YXRlXCIgb3IgXCJ3aW5kb3cuU3RhdGVcIiwgdGhpcyBzdHVmZiBpcyB3ZWlyZGx5IHByZWNhcmlvdXMgYWZ0ZXIgdHlwZXNjcmlwdGluZ1xyXG5cdFx0Ly8gICAgdGhpcyBjb2RlYmFzZSwgYW5kIEkgZG9uJ3QgaGF2ZSB0aGUgc2FuaXR5IHBvaW50cyB0byBmaWd1cmUgb3V0IHdoeVxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0dmFyIG9iaiA9IFN0YXRlO1xyXG5cdFx0dmFyIHcgPSBudWxsO1xyXG5cdFx0Zm9yKHZhciBpPTAsIGxlbj13b3Jkcy5sZW5ndGgtMTtpPGxlbjtpKyspe1xyXG5cdFx0XHR3ID0gd29yZHNbaV07XHJcblx0XHRcdGlmKG9ialt3XSA9PT0gdW5kZWZpbmVkICkgb2JqW3ddID0ge307XHJcblx0XHRcdG9iaiA9IG9ialt3XTtcclxuXHRcdH1cclxuXHRcdG9ialt3b3Jkc1tpXV0gPSB2YWx1ZTtcclxuXHRcdHJldHVybiBvYmo7XHJcblx0fSxcclxuXHRcclxuXHQvL3NldCBzaW5nbGUgc3RhdGVcclxuXHQvL2lmIG5vRXZlbnQgaXMgdHJ1ZSwgdGhlIHVwZGF0ZSBldmVudCB3b24ndCB0cmlnZ2VyLCB1c2VmdWwgZm9yIHNldHRpbmcgbXVsdGlwbGUgc3RhdGVzIGZpcnN0XHJcblx0c2V0OiBmdW5jdGlvbihzdGF0ZU5hbWUsIHZhbHVlLCBub0V2ZW50Pykge1xyXG5cdFx0dmFyIGZ1bGxQYXRoID0gJFNNLmJ1aWxkUGF0aChzdGF0ZU5hbWUpO1xyXG5cdFx0XHJcblx0XHQvL21ha2Ugc3VyZSB0aGUgdmFsdWUgaXNuJ3Qgb3ZlciB0aGUgZW5naW5lIG1heGltdW1cclxuXHRcdGlmKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJiB2YWx1ZSA+ICRTTS5NQVhfU1RPUkUpIHZhbHVlID0gJFNNLk1BWF9TVE9SRTtcclxuXHRcdFxyXG5cdFx0dHJ5e1xyXG5cdFx0XHRldmFsKCcoJytmdWxsUGF0aCsnKSA9IHZhbHVlJyk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdC8vcGFyZW50IGRvZXNuJ3QgZXhpc3QsIHNvIG1ha2UgcGFyZW50XHJcblx0XHRcdCRTTS5jcmVhdGVTdGF0ZShzdGF0ZU5hbWUsIHZhbHVlKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly9zdG9yZXMgdmFsdWVzIGNhbiBub3QgYmUgbmVnYXRpdmVcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdGlmKHN0YXRlTmFtZS5pbmRleE9mKCdzdG9yZXMnKSA9PT0gMCAmJiAkU00uZ2V0KHN0YXRlTmFtZSwgdHJ1ZSkgPCAwKSB7XHJcblx0XHRcdGV2YWwoJygnK2Z1bGxQYXRoKycpID0gMCcpO1xyXG5cdFx0XHRFbmdpbmUubG9nKCdXQVJOSU5HOiBzdGF0ZTonICsgc3RhdGVOYW1lICsgJyBjYW4gbm90IGJlIGEgbmVnYXRpdmUgdmFsdWUuIFNldCB0byAwIGluc3RlYWQuJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0RW5naW5lLmxvZyhzdGF0ZU5hbWUgKyAnICcgKyB2YWx1ZSk7XHJcblx0XHRcclxuXHRcdGlmIChub0V2ZW50ID09PSB1bmRlZmluZWQgfHwgbm9FdmVudCA9PSB0cnVlKSB7XHJcblx0XHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0XHQkU00uZmlyZVVwZGF0ZShzdGF0ZU5hbWUpO1xyXG5cdFx0fVx0XHRcclxuXHR9LFxyXG5cdFxyXG5cdC8vc2V0cyBhIGxpc3Qgb2Ygc3RhdGVzXHJcblx0c2V0TTogZnVuY3Rpb24ocGFyZW50TmFtZSwgbGlzdCwgbm9FdmVudD8pIHtcclxuXHRcdCRTTS5idWlsZFBhdGgocGFyZW50TmFtZSk7XHJcblx0XHRcclxuXHRcdC8vbWFrZSBzdXJlIHRoZSBzdGF0ZSBleGlzdHMgdG8gYXZvaWQgZXJyb3JzLFxyXG5cdFx0aWYoJFNNLmdldChwYXJlbnROYW1lKSA9PT0gdW5kZWZpbmVkKSAkU00uc2V0KHBhcmVudE5hbWUsIHt9LCB0cnVlKTtcclxuXHRcdFxyXG5cdFx0Zm9yKHZhciBrIGluIGxpc3Qpe1xyXG5cdFx0XHQkU00uc2V0KHBhcmVudE5hbWUrJ1tcIicraysnXCJdJywgbGlzdFtrXSwgdHJ1ZSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmKCFub0V2ZW50KSB7XHJcblx0XHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0XHQkU00uZmlyZVVwZGF0ZShwYXJlbnROYW1lKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdC8vc2hvcnRjdXQgZm9yIGFsdGVyaW5nIG51bWJlciB2YWx1ZXMsIHJldHVybiAxIGlmIHN0YXRlIHdhc24ndCBhIG51bWJlclxyXG5cdGFkZDogZnVuY3Rpb24oc3RhdGVOYW1lLCB2YWx1ZSwgbm9FdmVudD8pIHtcclxuXHRcdHZhciBlcnIgPSAwO1xyXG5cdFx0Ly8wIGlmIHVuZGVmaW5lZCwgbnVsbCAoYnV0IG5vdCB7fSkgc2hvdWxkIGFsbG93IGFkZGluZyB0byBuZXcgb2JqZWN0c1xyXG5cdFx0Ly9jb3VsZCBhbHNvIGFkZCBpbiBhIHRydWUgPSAxIHRoaW5nLCB0byBoYXZlIHNvbWV0aGluZyBnbyBmcm9tIGV4aXN0aW5nICh0cnVlKVxyXG5cdFx0Ly90byBiZSBhIGNvdW50LCBidXQgdGhhdCBtaWdodCBiZSB1bndhbnRlZCBiZWhhdmlvciAoYWRkIHdpdGggbG9vc2UgZXZhbCBwcm9iYWJseSB3aWxsIGhhcHBlbiBhbnl3YXlzKVxyXG5cdFx0dmFyIG9sZCA9ICRTTS5nZXQoc3RhdGVOYW1lLCB0cnVlKTtcclxuXHRcdFxyXG5cdFx0Ly9jaGVjayBmb3IgTmFOIChvbGQgIT0gb2xkKSBhbmQgbm9uIG51bWJlciB2YWx1ZXNcclxuXHRcdGlmKG9sZCAhPSBvbGQpe1xyXG5cdFx0XHRFbmdpbmUubG9nKCdXQVJOSU5HOiAnK3N0YXRlTmFtZSsnIHdhcyBjb3JydXB0ZWQgKE5hTikuIFJlc2V0dGluZyB0byAwLicpO1xyXG5cdFx0XHRvbGQgPSAwO1xyXG5cdFx0XHQkU00uc2V0KHN0YXRlTmFtZSwgb2xkICsgdmFsdWUsIG5vRXZlbnQpO1xyXG5cdFx0fSBlbHNlIGlmKHR5cGVvZiBvbGQgIT0gJ251bWJlcicgfHwgdHlwZW9mIHZhbHVlICE9ICdudW1iZXInKXtcclxuXHRcdFx0RW5naW5lLmxvZygnV0FSTklORzogQ2FuIG5vdCBkbyBtYXRoIHdpdGggc3RhdGU6JytzdGF0ZU5hbWUrJyBvciB2YWx1ZTonK3ZhbHVlKycgYmVjYXVzZSBhdCBsZWFzdCBvbmUgaXMgbm90IGEgbnVtYmVyLicpO1xyXG5cdFx0XHRlcnIgPSAxO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JFNNLnNldChzdGF0ZU5hbWUsIG9sZCArIHZhbHVlLCBub0V2ZW50KTsgLy9zZXRTdGF0ZSBoYW5kbGVzIGV2ZW50IGFuZCBzYXZlXHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBlcnI7XHJcblx0fSxcclxuXHRcclxuXHQvL2FsdGVycyBtdWx0aXBsZSBudW1iZXIgdmFsdWVzLCByZXR1cm4gbnVtYmVyIG9mIGZhaWxzXHJcblx0YWRkTTogZnVuY3Rpb24ocGFyZW50TmFtZSwgbGlzdCwgbm9FdmVudD8pIHtcclxuXHRcdHZhciBlcnIgPSAwO1xyXG5cdFx0XHJcblx0XHQvL21ha2Ugc3VyZSB0aGUgcGFyZW50IGV4aXN0cyB0byBhdm9pZCBlcnJvcnNcclxuXHRcdGlmKCRTTS5nZXQocGFyZW50TmFtZSkgPT09IHVuZGVmaW5lZCkgJFNNLnNldChwYXJlbnROYW1lLCB7fSwgdHJ1ZSk7XHJcblx0XHRcclxuXHRcdGZvcih2YXIgayBpbiBsaXN0KXtcclxuXHRcdFx0aWYoJFNNLmFkZChwYXJlbnROYW1lKydbXCInK2srJ1wiXScsIGxpc3Rba10sIHRydWUpKSBlcnIrKztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYoIW5vRXZlbnQpIHtcclxuXHRcdFx0RW5naW5lLnNhdmVHYW1lKCk7XHJcblx0XHRcdCRTTS5maXJlVXBkYXRlKHBhcmVudE5hbWUpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGVycjtcclxuXHR9LFxyXG5cdFxyXG5cdC8vcmV0dXJuIHN0YXRlLCB1bmRlZmluZWQgb3IgMFxyXG5cdGdldDogZnVuY3Rpb24oc3RhdGVOYW1lLCByZXF1ZXN0WmVybz8pOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBOdW1iZXIgfCBudWxsIHwgQm9vbGVhbiB7XHJcblx0XHR2YXIgd2hpY2hTdGF0ZTogdW5kZWZpbmVkIHwgbnVsbCB8IE51bWJlciB8IHN0cmluZyA9IG51bGw7XHJcblx0XHR2YXIgZnVsbFBhdGggPSAkU00uYnVpbGRQYXRoKHN0YXRlTmFtZSk7XHJcblx0XHRcclxuXHRcdC8vY2F0Y2ggZXJyb3JzIGlmIHBhcmVudCBvZiBzdGF0ZSBkb2Vzbid0IGV4aXN0XHJcblx0XHR0cnl7XHJcblx0XHRcdGV2YWwoJ3doaWNoU3RhdGUgPSAoJytmdWxsUGF0aCsnKScpO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHR3aGljaFN0YXRlID0gdW5kZWZpbmVkO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvL3ByZXZlbnRzIHJlcGVhdGVkIGlmIHVuZGVmaW5lZCwgbnVsbCwgZmFsc2Ugb3Ige30sIHRoZW4geCA9IDAgc2l0dWF0aW9uc1xyXG5cdFx0aWYoKCF3aGljaFN0YXRlXHJcblx0XHRcdC8vICB8fCB3aGljaFN0YXRlID09IHt9XHJcblx0XHRcdCkgJiYgcmVxdWVzdFplcm8pIHJldHVybiAwO1xyXG5cdFx0ZWxzZSByZXR1cm4gd2hpY2hTdGF0ZTtcclxuXHR9LFxyXG5cdFxyXG5cdC8vbWFpbmx5IGZvciBsb2NhbCBjb3B5IHVzZSwgYWRkKE0pIGNhbiBmYWlsIHNvIHdlIGNhbid0IHNob3J0Y3V0IHRoZW1cclxuXHQvL3NpbmNlIHNldCBkb2VzIG5vdCBmYWlsLCB3ZSBrbm93IHN0YXRlIGV4aXN0cyBhbmQgY2FuIHNpbXBseSByZXR1cm4gdGhlIG9iamVjdFxyXG5cdHNldGdldDogZnVuY3Rpb24oc3RhdGVOYW1lLCB2YWx1ZSwgbm9FdmVudD8pe1xyXG5cdFx0JFNNLnNldChzdGF0ZU5hbWUsIHZhbHVlLCBub0V2ZW50KTtcclxuXHRcdHJldHVybiBldmFsKCcoJyskU00uYnVpbGRQYXRoKHN0YXRlTmFtZSkrJyknKTtcclxuXHR9LFxyXG5cdFxyXG5cdHJlbW92ZTogZnVuY3Rpb24oc3RhdGVOYW1lLCBub0V2ZW50Pykge1xyXG5cdFx0dmFyIHdoaWNoU3RhdGUgPSAkU00uYnVpbGRQYXRoKHN0YXRlTmFtZSk7XHJcblx0XHR0cnl7XHJcblx0XHRcdGV2YWwoJyhkZWxldGUgJyt3aGljaFN0YXRlKycpJyk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdC8vaXQgZGlkbid0IGV4aXN0IGluIHRoZSBmaXJzdCBwbGFjZVxyXG5cdFx0XHRFbmdpbmUubG9nKCdXQVJOSU5HOiBUcmllZCB0byByZW1vdmUgbm9uLWV4aXN0YW50IHN0YXRlIFxcJycrc3RhdGVOYW1lKydcXCcuJyk7XHJcblx0XHR9XHJcblx0XHRpZighbm9FdmVudCl7XHJcblx0XHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0XHQkU00uZmlyZVVwZGF0ZShzdGF0ZU5hbWUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0Ly9jcmVhdGVzIGZ1bGwgcmVmZXJlbmNlIGZyb20gaW5wdXRcclxuXHQvL2hvcGVmdWxseSB0aGlzIHdvbid0IGV2ZXIgbmVlZCB0byBiZSBtb3JlIGNvbXBsaWNhdGVkXHJcblx0YnVpbGRQYXRoOiBmdW5jdGlvbihpbnB1dCl7XHJcblx0XHR2YXIgZG90ID0gKGlucHV0LmNoYXJBdCgwKSA9PSAnWycpPyAnJyA6ICcuJzsgLy9pZiBpdCBzdGFydHMgd2l0aCBbZm9vXSBubyBkb3QgdG8gam9pblxyXG5cdFx0cmV0dXJuICdTdGF0ZScgKyBkb3QgKyBpbnB1dDtcclxuXHR9LFxyXG5cdFxyXG5cdGZpcmVVcGRhdGU6IGZ1bmN0aW9uKHN0YXRlTmFtZSwgc2F2ZT8pe1xyXG5cdFx0dmFyIGNhdGVnb3J5ID0gJFNNLmdldENhdGVnb3J5KHN0YXRlTmFtZSk7XHJcblx0XHRpZihzdGF0ZU5hbWUgPT0gdW5kZWZpbmVkKSBzdGF0ZU5hbWUgPSBjYXRlZ29yeSA9ICdhbGwnOyAvL2Jlc3QgaWYgdGhpcyBkb2Vzbid0IGhhcHBlbiBhcyBpdCB3aWxsIHRyaWdnZXIgbW9yZSBzdHVmZlxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5wdWJsaXNoKHsnY2F0ZWdvcnknOiBjYXRlZ29yeSwgJ3N0YXRlTmFtZSc6c3RhdGVOYW1lfSk7XHJcblx0XHRpZihzYXZlKSBFbmdpbmUuc2F2ZUdhbWUoKTtcclxuXHR9LFxyXG5cdFxyXG5cdGdldENhdGVnb3J5OiBmdW5jdGlvbihzdGF0ZU5hbWUpe1xyXG5cdFx0dmFyIGZpcnN0T0IgPSBzdGF0ZU5hbWUuaW5kZXhPZignWycpO1xyXG5cdFx0dmFyIGZpcnN0RG90ID0gc3RhdGVOYW1lLmluZGV4T2YoJy4nKTtcclxuXHRcdHZhciBjdXRvZmYgPSBudWxsO1xyXG5cdFx0aWYoZmlyc3RPQiA9PSAtMSB8fCBmaXJzdERvdCA9PSAtMSl7XHJcblx0XHRcdGN1dG9mZiA9IGZpcnN0T0IgPiBmaXJzdERvdCA/IGZpcnN0T0IgOiBmaXJzdERvdDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGN1dG9mZiA9IGZpcnN0T0IgPCBmaXJzdERvdCA/IGZpcnN0T0IgOiBmaXJzdERvdDtcclxuXHRcdH1cclxuXHRcdGlmIChjdXRvZmYgPT0gLTEpe1xyXG5cdFx0XHRyZXR1cm4gc3RhdGVOYW1lO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHN0YXRlTmFtZS5zdWJzdHIoMCxjdXRvZmYpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cdCAqIFN0YXJ0IG9mIHNwZWNpZmljIHN0YXRlIGZ1bmN0aW9uc1xyXG5cdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblx0Ly9QRVJLU1xyXG5cdGFkZFBlcms6IGZ1bmN0aW9uKG5hbWUpIHtcclxuXHRcdCRTTS5zZXQoJ2NoYXJhY3Rlci5wZXJrc1tcIicrbmFtZSsnXCJdJywgdHJ1ZSk7XHJcblx0XHROb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBFbmdpbmUuUGVya3NbbmFtZV0ubm90aWZ5KTtcclxuXHR9LFxyXG5cdFxyXG5cdGhhc1Blcms6IGZ1bmN0aW9uKG5hbWUpIHtcclxuXHRcdHJldHVybiAkU00uZ2V0KCdjaGFyYWN0ZXIucGVya3NbXCInK25hbWUrJ1wiXScpO1xyXG5cdH0sXHJcblx0XHJcblx0Ly9JTkNPTUVcclxuXHRzZXRJbmNvbWU6IGZ1bmN0aW9uKHNvdXJjZSwgb3B0aW9ucykge1xyXG5cdFx0dmFyIGV4aXN0aW5nID0gJFNNLmdldCgnaW5jb21lW1wiJytzb3VyY2UrJ1wiXScpO1xyXG5cdFx0aWYodHlwZW9mIGV4aXN0aW5nICE9ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdG9wdGlvbnMudGltZUxlZnQgPSAoZXhpc3RpbmcgYXMgYW55KT8udGltZUxlZnQ7XHJcblx0XHR9XHJcblx0XHQkU00uc2V0KCdpbmNvbWVbXCInK3NvdXJjZSsnXCJdJywgb3B0aW9ucyk7XHJcblx0fSxcclxuXHRcclxuXHRnZXRJbmNvbWU6IGZ1bmN0aW9uKHNvdXJjZSkge1xyXG5cdFx0dmFyIGV4aXN0aW5nID0gJFNNLmdldCgnaW5jb21lW1wiJytzb3VyY2UrJ1wiXScpO1xyXG5cdFx0aWYodHlwZW9mIGV4aXN0aW5nICE9ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdHJldHVybiBleGlzdGluZztcclxuXHRcdH1cclxuXHRcdHJldHVybiB7fTtcclxuXHR9LFx0XHJcblx0XHJcblx0Ly9NaXNjXHJcblx0bnVtOiBmdW5jdGlvbihuYW1lLCBjcmFmdGFibGUpIHtcclxuXHRcdHN3aXRjaChjcmFmdGFibGUudHlwZSkge1xyXG5cdFx0Y2FzZSAnZ29vZCc6XHJcblx0XHRjYXNlICd0b29sJzpcclxuXHRcdGNhc2UgJ3dlYXBvbic6XHJcblx0XHRjYXNlICd1cGdyYWRlJzpcclxuXHRcdFx0cmV0dXJuICRTTS5nZXQoJ3N0b3Jlc1tcIicrbmFtZSsnXCJdJywgdHJ1ZSk7XHJcblx0XHRjYXNlICdidWlsZGluZyc6XHJcblx0XHRcdHJldHVybiAkU00uZ2V0KCdnYW1lLmJ1aWxkaW5nc1tcIicrbmFtZSsnXCJdJywgdHJ1ZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRoYW5kbGVTdGF0ZVVwZGF0ZXM6IGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHJcblx0fVx0XHJcbn07XHJcblxyXG4vL2FsaWFzXHJcbmV4cG9ydCBjb25zdCAkU00gPSBTdGF0ZU1hbmFnZXI7XHJcbiIsImltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tICcuL25vdGlmaWNhdGlvbnMnO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tICcuL3N0YXRlX21hbmFnZXInO1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tICcuL2VuZ2luZSc7XHJcblxyXG5leHBvcnQgY29uc3QgV2VhdGhlciA9IHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHJcbiAgICAgICAgLy9zdWJzY3JpYmUgdG8gc3RhdGVVcGRhdGVzXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5zdWJzY3JpYmUoV2VhdGhlci5oYW5kbGVTdGF0ZVVwZGF0ZXMpO1xyXG4gICAgfSxcclxuXHJcbiAgICBoYW5kbGVTdGF0ZVVwZGF0ZXM6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBpZiAoZS5jYXRlZ29yeSA9PSAnd2VhdGhlcicpIHtcclxuICAgICAgICAgICAgc3dpdGNoICgkU00uZ2V0KCd3ZWF0aGVyJykpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3N1bm55JzogXHJcbiAgICAgICAgICAgICAgICAgICAgV2VhdGhlci5zdGFydFN1bm55KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdjbG91ZHknOlxyXG4gICAgICAgICAgICAgICAgICAgIFdlYXRoZXIuc3RhcnRDbG91ZHkoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3JhaW55JzpcclxuICAgICAgICAgICAgICAgICAgICBXZWF0aGVyLnN0YXJ0UmFpbnkoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9sYXN0V2VhdGhlcjogJ3N1bm55JyxcclxuXHJcbiAgICBzdGFydFN1bm55OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIlRoZSBzdW4gYmVnaW5zIHRvIHNoaW5lLlwiKTtcclxuICAgICAgICBXZWF0aGVyLl9sYXN0V2VhdGhlciA9ICdzdW5ueSc7XHJcbiAgICAgICAgJCgnYm9keScpLmFuaW1hdGUoe2JhY2tncm91bmRDb2xvcjogJyNGRkZGRkYnfSwgJ3Nsb3cnKTtcclxuICAgICAgICAkKCdkaXYjc3RvcmVzOjpiZWZvcmUnKS5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6ICcjRkZGRkZGJ30sICdzbG93Jyk7XHJcbiAgICAgICAgV2VhdGhlci5tYWtlUmFpblN0b3AoKTtcclxuICAgIH0sXHJcblxyXG4gICAgc3RhcnRDbG91ZHk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmIChXZWF0aGVyLl9sYXN0V2VhdGhlciA9PSAnc3VubnknKSB7XHJcbiAgICAgICAgICAgIE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiQ2xvdWRzIHJvbGwgaW4sIG9ic2N1cmluZyB0aGUgc3VuLlwiKTtcclxuICAgICAgICB9IGVsc2UgaWYgKFdlYXRoZXIuX2xhc3RXZWF0aGVyID09ICdyYWlueScpIHtcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJUaGUgcmFpbiBicmVha3MsIGJ1dCB0aGUgY2xvdWRzIHJlbWFpbi5cIilcclxuICAgICAgICB9XHJcbiAgICAgICAgJCgnYm9keScpLmFuaW1hdGUoe2JhY2tncm91bmRDb2xvcjogJyM4Qjg3ODYnfSwgJ3Nsb3cnKTtcclxuICAgICAgICAkKCdkaXYjc3RvcmVzOjpiZWZvcmUnKS5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6ICcjOEI4Nzg2J30sICdzbG93Jyk7XHJcbiAgICAgICAgV2VhdGhlci5fbGFzdFdlYXRoZXIgPSAnY2xvdWR5JztcclxuICAgICAgICBXZWF0aGVyLm1ha2VSYWluU3RvcCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzdGFydFJhaW55OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoV2VhdGhlci5fbGFzdFdlYXRoZXIgPT0gJ3N1bm55Jykge1xyXG4gICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIlRoZSB3aW5kIHN1ZGRlbmx5IHBpY2tzIHVwLiBDbG91ZHMgcm9sbCBpbiwgaGVhdnkgd2l0aCByYWluLCBhbmQgcmFpbmRyb3BzIGZhbGwgc29vbiBhZnRlci5cIik7XHJcbiAgICAgICAgfSBlbHNlIGlmIChXZWF0aGVyLl9sYXN0V2VhdGhlciA9PSAnY2xvdWR5Jykge1xyXG4gICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIlRoZSBjbG91ZHMgdGhhdCB3ZXJlIHByZXZpb3VzbHkgY29udGVudCB0byBoYW5nIG92ZXJoZWFkIGxldCBsb29zZSBhIG1vZGVyYXRlIGRvd25wb3VyLlwiKVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAkKCdib2R5JykuYW5pbWF0ZSh7YmFja2dyb3VuZENvbG9yOiAnIzZENjk2OCd9LCAnc2xvdycpO1xyXG4gICAgICAgICQoJ2RpdiNzdG9yZXM6OmJlZm9yZScpLmFuaW1hdGUoe2JhY2tncm91bmRDb2xvcjogJyM2RDY5NjgnfSwgJ3Nsb3cnKTtcclxuICAgICAgICBXZWF0aGVyLl9sYXN0V2VhdGhlciA9ICdyYWlueSc7XHJcbiAgICAgICAgV2VhdGhlci5tYWtlSXRSYWluKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIF9sb2NhdGlvbjogJycsXHJcblxyXG4gICAgaW5pdGlhdGVXZWF0aGVyOiBmdW5jdGlvbihhdmFpbGFibGVXZWF0aGVyLCBsb2NhdGlvbikge1xyXG4gICAgICAgIGlmIChXZWF0aGVyLl9sb2NhdGlvbiA9PSAnJykgV2VhdGhlci5fbG9jYXRpb24gPSBsb2NhdGlvbjtcclxuICAgICAgICAvLyBpZiBpbiBuZXcgbG9jYXRpb24sIGVuZCB3aXRob3V0IHRyaWdnZXJpbmcgYSBuZXcgd2VhdGhlciBpbml0aWF0aW9uLCBcclxuICAgICAgICAvLyBsZWF2aW5nIHRoZSBuZXcgbG9jYXRpb24ncyBpbml0aWF0ZVdlYXRoZXIgY2FsbGJhY2sgdG8gZG8gaXRzIHRoaW5nXHJcbiAgICAgICAgZWxzZSBpZiAoV2VhdGhlci5fbG9jYXRpb24gIT0gbG9jYXRpb24pIHJldHVybjsgXHJcblxyXG4gICAgICAgIHZhciBjaG9zZW5XZWF0aGVyID0gJ25vbmUnO1xyXG4gICAgICAgIC8vZ2V0IG91ciByYW5kb20gZnJvbSAwIHRvIDFcclxuICAgICAgICB2YXIgcm5kID0gTWF0aC5yYW5kb20oKTtcclxuICBcclxuICAgICAgICAvL2luaXRpYWxpc2Ugb3VyIGN1bXVsYXRpdmUgcGVyY2VudGFnZVxyXG4gICAgICAgIHZhciBjdW11bGF0aXZlQ2hhbmNlID0gMDtcclxuICAgICAgICBmb3IgKHZhciBpIGluIGF2YWlsYWJsZVdlYXRoZXIpIHtcclxuICAgICAgICAgICAgY3VtdWxhdGl2ZUNoYW5jZSArPSBhdmFpbGFibGVXZWF0aGVyW2ldO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHJuZCA8IGN1bXVsYXRpdmVDaGFuY2UpIHtcclxuICAgICAgICAgICAgICAgIGNob3NlbldlYXRoZXIgPSBpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjaG9zZW5XZWF0aGVyICE9ICRTTS5nZXQoJ3dlYXRoZXInKSkgJFNNLnNldCgnd2VhdGhlcicsIGNob3NlbldlYXRoZXIpO1xyXG4gICAgICAgIEVuZ2luZS5zZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pbml0aWF0ZVdlYXRoZXIoYXZhaWxhYmxlV2VhdGhlciwgbG9jYXRpb24pO1xyXG4gICAgICAgIH0sIDMgKiA2MCAqIDEwMDApO1xyXG4gICAgfSxcclxuXHJcbiAgICBtYWtlSXRSYWluOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBodHRwczovL2NvZGVwZW4uaW8vYXJpY2tsZS9wZW4vWEtqTVpZXHJcbiAgICAgICAgLy9jbGVhciBvdXQgZXZlcnl0aGluZ1xyXG4gICAgICAgICQoJy5yYWluJykuZW1wdHkoKTtcclxuICAgICAgXHJcbiAgICAgICAgdmFyIGluY3JlbWVudCA9IDA7XHJcbiAgICAgICAgdmFyIGRyb3BzID0gXCJcIjtcclxuICAgICAgICB2YXIgYmFja0Ryb3BzID0gXCJcIjtcclxuICAgICAgXHJcbiAgICAgICAgd2hpbGUgKGluY3JlbWVudCA8IDEwMCkge1xyXG4gICAgICAgICAgLy9jb3VwbGUgcmFuZG9tIG51bWJlcnMgdG8gdXNlIGZvciB2YXJpb3VzIHJhbmRvbWl6YXRpb25zXHJcbiAgICAgICAgICAvL3JhbmRvbSBudW1iZXIgYmV0d2VlbiA5OCBhbmQgMVxyXG4gICAgICAgICAgdmFyIHJhbmRvSHVuZG8gPSAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDk4IC0gMSArIDEpICsgMSkpO1xyXG4gICAgICAgICAgLy9yYW5kb20gbnVtYmVyIGJldHdlZW4gNSBhbmQgMlxyXG4gICAgICAgICAgdmFyIHJhbmRvRml2ZXIgPSAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDUgLSAyICsgMSkgKyAyKSk7XHJcbiAgICAgICAgICAvL2luY3JlbWVudFxyXG4gICAgICAgICAgaW5jcmVtZW50ICs9IHJhbmRvRml2ZXI7XHJcbiAgICAgICAgICAvL2FkZCBpbiBhIG5ldyByYWluZHJvcCB3aXRoIHZhcmlvdXMgcmFuZG9taXphdGlvbnMgdG8gY2VydGFpbiBDU1MgcHJvcGVydGllc1xyXG4gICAgICAgICAgZHJvcHMgKz0gJzxkaXYgY2xhc3M9XCJkcm9wXCIgc3R5bGU9XCJsZWZ0OiAnICsgaW5jcmVtZW50ICsgJyU7IGJvdHRvbTogJyArIChyYW5kb0ZpdmVyICsgcmFuZG9GaXZlciAtIDEgKyAxMDApICsgJyU7IGFuaW1hdGlvbi1kZWxheTogMC4nICsgcmFuZG9IdW5kbyArICdzOyBhbmltYXRpb24tZHVyYXRpb246IDAuNScgKyByYW5kb0h1bmRvICsgJ3M7XCI+PGRpdiBjbGFzcz1cInN0ZW1cIiBzdHlsZT1cImFuaW1hdGlvbi1kZWxheTogMC4nICsgcmFuZG9IdW5kbyArICdzOyBhbmltYXRpb24tZHVyYXRpb246IDAuNScgKyByYW5kb0h1bmRvICsgJ3M7XCI+PC9kaXY+PGRpdiBjbGFzcz1cInNwbGF0XCIgc3R5bGU9XCJhbmltYXRpb24tZGVsYXk6IDAuJyArIHJhbmRvSHVuZG8gKyAnczsgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjUnICsgcmFuZG9IdW5kbyArICdzO1wiPjwvZGl2PjwvZGl2Pic7XHJcbiAgICAgICAgICBiYWNrRHJvcHMgKz0gJzxkaXYgY2xhc3M9XCJkcm9wXCIgc3R5bGU9XCJyaWdodDogJyArIGluY3JlbWVudCArICclOyBib3R0b206ICcgKyAocmFuZG9GaXZlciArIHJhbmRvRml2ZXIgLSAxICsgMTAwKSArICclOyBhbmltYXRpb24tZGVsYXk6IDAuJyArIHJhbmRvSHVuZG8gKyAnczsgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjUnICsgcmFuZG9IdW5kbyArICdzO1wiPjxkaXYgY2xhc3M9XCJzdGVtXCIgc3R5bGU9XCJhbmltYXRpb24tZGVsYXk6IDAuJyArIHJhbmRvSHVuZG8gKyAnczsgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjUnICsgcmFuZG9IdW5kbyArICdzO1wiPjwvZGl2PjxkaXYgY2xhc3M9XCJzcGxhdFwiIHN0eWxlPVwiYW5pbWF0aW9uLWRlbGF5OiAwLicgKyByYW5kb0h1bmRvICsgJ3M7IGFuaW1hdGlvbi1kdXJhdGlvbjogMC41JyArIHJhbmRvSHVuZG8gKyAncztcIj48L2Rpdj48L2Rpdj4nO1xyXG4gICAgICAgIH1cclxuICAgICAgXHJcbiAgICAgICAgJCgnLnJhaW4uZnJvbnQtcm93JykuYXBwZW5kKGRyb3BzKTtcclxuICAgICAgICAkKCcucmFpbi5iYWNrLXJvdycpLmFwcGVuZChiYWNrRHJvcHMpO1xyXG4gICAgfSxcclxuXHJcbiAgICBtYWtlUmFpblN0b3A6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQoJy5yYWluJykuZW1wdHkoKTtcclxuICAgIH1cclxufSJdfQ==
