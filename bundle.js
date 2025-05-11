(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._tb = void 0;
// text builder utility, used for handling conditional text in 
// descriptions and other text blurbs
var _tb = function (text) {
    var output = new Array;
    for (var i in text) {
        if (typeof (text[i]) === "string")
            output.push(text[i]);
        else {
            if (text[i].isVisible()) {
                output.push(text[i].text);
            }
        }
    }
    return output;
};
exports._tb = _tb;

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{"../lib/translate":2,"./engine":7}],4:[function(require,module,exports){
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
        state_manager_1.$SM.set('outpost.captain.askedAboutSupplies', 1);
        character_1.Character.addToInventory("Captain.supplies");
        character_1.Character.checkQuestStatus("mayorSupplies");
    }
};

},{"../../lib/translate":2,"../events":8,"../player/character":15,"../state_manager":19}],5:[function(require,module,exports){
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

},{"../../lib/translate":2,"../events":8,"../places/village":14,"../player/character":15,"../state_manager":19}],6:[function(require,module,exports){
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

},{"../../lib/translate":2,"../events":8,"../places/road":13,"../places/village":14,"../player/character":15,"../state_manager":19,"./liz":5}],7:[function(require,module,exports){
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

},{"../lib/translate":2,"./events":8,"./notifications":11,"./places/outpost":12,"./places/road":13,"./places/village":14,"./player/character":15,"./state_manager":19,"./weather":20}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
/**
 * Module that handles the random event system
 */
var roadwander_1 = require("./events/roadwander");
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
        exports.Events.EventPool = [].concat(roadwander_1.EventsRoadWander);
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

},{"../lib/translate":2,"./Button":3,"./engine":7,"./events/roadwander":9,"./notifications":11,"./state_manager":19}],9:[function(require,module,exports){
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
    // Old lady in carriage, shortcut to Outpost
    {
        title: (0, translate_1._)('The Stomping of Hooves and Creaking of Wood'),
        isAvailable: function () {
            return engine_1.Engine.activeModule == road_1.Road;
        },
        scenes: {
            'start': {
                text: [
                    (0, translate_1._)('A carriage pulls up alongside you, and the voice of an elderly woman croaks out from within.'),
                    (0, translate_1._)('"My, but you look tired from your journey. If it\'s the Outpost you seek, '
                        + 'I\'m on my way there now; would you like to join me?"'),
                    (0, translate_1._)('What do you do?')
                ],
                buttons: {
                    'accept': {
                        text: (0, translate_1._)('Accept her offer'),
                        nextScene: { 1: 'accept' }
                    },
                    'leave': {
                        text: (0, translate_1._)('Politely Decline'),
                        nextScene: { 1: 'leave' }
                    }
                }
            },
            'accept': {
                text: [
                    (0, translate_1._)('You hop in the carriage with the old woman.'),
                    (0, translate_1._)('She turns out to be pretty cool, and gives you one of those hard candies that '
                        + 'every grandparent seems to have on the end table next to their sofa.'),
                    (0, translate_1._)('Before long, you reach the Outpost. You hop out and thank the old woman for the ride.')
                ],
                buttons: {
                    'okay': {
                        text: (0, translate_1._)('What a nice old lady'),
                        nextScene: 'end',
                        onChoose: function () {
                            if (state_manager_1.$SM.get('outpost.open') === undefined) {
                                outpost_1.Outpost.init();
                                state_manager_1.$SM.set('superlikely.outpostUnlock', 1);
                                // Character.setQuestStatus("mayorSupplies", 1);
                                character_1.Character.checkQuestStatus("mayorSupplies");
                                engine_1.Engine.travelTo(outpost_1.Outpost);
                            }
                            character_1.Character.addToInventory('oldLady.Candy');
                        }
                    }
                }
            },
            'leave': {
                text: [
                    (0, translate_1._)('It\'s too early in the game to be trusting weird old people, man. You politely '
                        + 'decline, and the woman chuckles softly as the carriage rolls off into the distance.'),
                    (0, translate_1._)('That soft chuckle tells me everything I need to know about whether you made the '
                        + 'right call. That had "turned into gingerbread" written all over it.')
                ],
                buttons: {
                    'okay': {
                        text: (0, translate_1._)('Yeah it did'),
                        nextScene: 'end'
                    }
                }
            }
        }
    },
    // Organ trauma
    {
        title: (0, translate_1._)('This Guy Seems Friendly'),
        isAvailable: function () {
            return (engine_1.Engine.activeModule === road_1.Road
                && state_manager_1.$SM.get('Road.gotPunched') === undefined);
        },
        scenes: {
            'start': {
                text: [
                    (0, translate_1._)('A man walks up to you with a big grin on his face, and before you can greet him he swiftly socks you in the stomach.'),
                    (0, translate_1._)('He walks off whistling while you gasp for breath in the dirt.'),
                    (0, translate_1._)('... Man, what a dick.')
                ],
                buttons: {
                    'okay': {
                        text: (0, translate_1._)('Fuck me, I guess'),
                        nextScene: 'end',
                        onChoose: function () {
                            character_1.Character.grantPerk('tummyPain');
                            state_manager_1.$SM.set('Road.gotPunched', 1);
                        }
                    }
                }
            }
        }
    },
    // An apology for organ trauma
    {
        title: (0, translate_1._)('This Fucking Guy Again'),
        isAvailable: function () {
            return (engine_1.Engine.activeModule === road_1.Road
                && (state_manager_1.$SM.get('Road.gotPunched') !== undefined));
        },
        scenes: {
            'start': {
                text: [
                    (0, translate_1._)('A man walks up to you with a big grin on his face, and before you can greet him he swiftly... apologizes.'),
                    (0, translate_1._)('"Hey, I\'m really sorry about punching you in the stomach before. I thought you were someone else. I HATE that guy."'),
                    (0, translate_1._)('You\'re not sure this is a good enough reason to not kick this guy\'s ass. Seeing the look on your face, he hastily continues.'),
                    (0, translate_1._)('"Anyway, as a token of my apology, please accept this healing tonic, as well as a coupon for a secret item from the store in the village."'),
                    (0, translate_1._)('You somewhat awkwardly accept both of these items, though you don\'t think there\'s a store in the vi-'),
                    (0, translate_1._)('"Oh, and I\'m the owner of the store in the village. I opened it back up after punching you. You know, to celebrate."'),
                    (0, translate_1._)('The man walks off, still grinning.')
                ],
                buttons: {
                    'okay': {
                        text: (0, translate_1._)('... Alright'),
                        nextScene: 'end',
                        onChoose: function () {
                            // give healing tonic
                            // give coupon
                            // unlock store button
                            state_manager_1.$SM.set('Road.gotApologized', 1);
                        }
                    }
                }
            }
        }
    },
    // Unlock Outpost
    {
        title: (0, translate_1._)('A Way Forward Makes Itself Known'),
        isAvailable: function () {
            return ((engine_1.Engine.activeModule === road_1.Road)
                && (state_manager_1.$SM.get('Road.counter') > 3) // can't happen TOO early
                && (state_manager_1.$SM.get('superlikely.outpostUnlock') == undefined
                    || state_manager_1.$SM.get('superlikely.outpostUnlock') < 1) // can't happen twice
            );
        },
        isSuperLikely: function () {
            return (((state_manager_1.$SM.get('superlikely.outpostUnlock') === undefined)
                || state_manager_1.$SM.get('superlikely.outpostUnlock') < 1))
                && (state_manager_1.$SM.get('Road.counter') > 7);
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

},{"../../lib/translate":2,"../engine":7,"../places/outpost":12,"../places/road":13,"../player/character":15,"../state_manager":19}],10:[function(require,module,exports){
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

},{"./engine":7}],11:[function(require,module,exports){
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

},{"./engine":7}],12:[function(require,module,exports){
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
var textBuilder_1 = require("../../lib/textBuilder");
exports.Outpost = {
    description: [
        (0, translate_1._)("You're in a small but bustling military outpost. Various members "
            + "of the rank-and-file go about their business, paying you little mind."),
        (0, translate_1._)("One tent stands out from the rest; the finely-embroidered details and " +
            "golden icon above the entrance mark it as the commanding officer's quarters.")
    ],
    init: function (options) {
        this.options = $.extend(this.options, options);
        // Create the Outpost tab
        this.tab = header_1.Header.addLocation((0, translate_1._)("The Outpost"), "outpost", exports.Outpost);
        // Create the Outpost panel
        this.panel = $('<div>')
            .attr('id', "outpostPanel")
            .addClass('location')
            .appendTo('div#locationSlider');
        this.descriptionPanel = $('<div>').attr('id', 'description').appendTo(this.panel);
        this.updateDescription();
        engine_1.Engine.updateSlider();
        // new 
        Button_1.Button.Button({
            id: 'captainButton',
            text: (0, translate_1._)('Speak with The Captain'),
            click: captain_1.Captain.talkToCaptain,
            width: '80px'
        })
            .addClass('locationButton')
            .appendTo('div#outpostPanel');
        exports.Outpost.updateButton();
        // setting this separately so that quest status can't accidentally break it later
        state_manager_1.$SM.set('outpost.open', 1);
    },
    updateDescription: function () {
        this.descriptionPanel.empty();
        this.description = (0, textBuilder_1._tb)([
            (0, translate_1._)("You're on a dusty road between the Village and the Outpost. The road cuts through "
                + "tall grass, brush, and trees, limiting visibility and ensuring that you'll have "
                + "to deal with some nonsense."),
            (0, translate_1._)("The hair on the back of your neck prickles slightly in anticipation.")
        ]);
        for (var i in this.description) {
            $('<div>').text(this.description[i]).appendTo(this.descriptionPanel);
        }
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
        this.updateDescription();
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

},{"../../lib/textBuilder":1,"../../lib/translate":2,"../Button":3,"../characters/captain":4,"../engine":7,"../header":10,"../state_manager":19,"../weather":20}],13:[function(require,module,exports){
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
var textBuilder_1 = require("../../lib/textBuilder");
exports.Road = {
    description: null,
    descriptionPanel: null,
    init: function (options) {
        this.options = $.extend(this.options, options);
        // Create the Road tab
        this.tab = header_1.Header.addLocation((0, translate_1._)("Road to the Outpost"), "road", exports.Road);
        // Create the Road panel
        this.panel = $('<div>')
            .attr('id', "roadPanel")
            .addClass('location')
            .appendTo('div#locationSlider');
        this.descriptionPanel = $('<div>').attr('id', 'description').appendTo(this.panel);
        this.updateDescription();
        engine_1.Engine.updateSlider();
        Button_1.Button.Button({
            id: 'wanderButton',
            text: (0, translate_1._)('Wander Around'),
            click: exports.Road.wanderEvent,
            width: '80px',
            cost: {} // TODO: make there be a cost to doing stuff?
        })
            .addClass('locationButton')
            .appendTo('div#roadPanel');
        exports.Road.updateButton();
        // setting this separately so that quest status can't accidentally break it later
        state_manager_1.$SM.set('road.open', 1);
    },
    updateDescription: function () {
        this.descriptionPanel.empty();
        this.description = (0, textBuilder_1._tb)([
            (0, translate_1._)("You're on a dusty road between the Village and the Outpost. The road cuts through "
                + "tall grass, brush, and trees, limiting visibility and ensuring that you'll have "
                + "to deal with some nonsense."),
            (0, translate_1._)("The hair on the back of your neck prickles slightly in anticipation.")
        ]);
        for (var i in this.description) {
            $('<div>').text(this.description[i]).appendTo(this.descriptionPanel);
        }
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
        this.updateDescription();
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

},{"../../lib/textBuilder":1,"../../lib/translate":2,"../Button":3,"../engine":7,"../events":8,"../header":10,"../state_manager":19,"../weather":20}],14:[function(require,module,exports){
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
var textBuilder_1 = require("../../lib/textBuilder");
exports.Village = {
    // times in (minutes * seconds * milliseconds)
    _FIRE_COOL_DELAY: 5 * 60 * 1000, // time after a stoke before the fire cools
    _ROOM_WARM_DELAY: 30 * 1000, // time between room temperature updates
    _BUILDER_STATE_DELAY: 0.5 * 60 * 1000, // time between builder state updates
    _STOKE_COOLDOWN: 10, // cooldown to stoke the fire
    _NEED_WOOD_DELAY: 15 * 1000, // from when the stranger shows up, to when you need wood
    buttons: {},
    changed: false,
    description: [],
    descriptionPanel: null,
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
        this.descriptionPanel = $('<div>').attr('id', 'description').appendTo(this.panel);
        this.updateDescription();
        engine_1.Engine.updateSlider();
        Button_1.Button.Button({
            id: 'talkButton',
            text: (0, translate_1._)('Talk to the Mayor'),
            click: mayor_1.Mayor.talkToMayor,
            width: '80px',
            cost: {}
        })
            .addClass('locationButton')
            .appendTo('div#villagePanel');
        Button_1.Button.Button({
            id: 'lizButton',
            text: (0, translate_1._)('Talk to Liz'),
            click: liz_1.Liz.talkToLiz,
            width: '80px',
            cost: {}
        })
            .addClass('locationButton')
            .appendTo('div#villagePanel');
        Button_1.Button.Button({
            id: 'newBuildingButton',
            text: (0, translate_1._)('Check out the new building'),
            click: exports.Village.tempBuildingMessage,
            width: '80px',
            cost: {}
        })
            .addClass('locationButton')
            .appendTo('div#villagePanel');
        var buildingButton = $('#newBuildingButton.button');
        buildingButton.hide();
        Button_1.Button.Button({
            id: 'storeButton',
            text: (0, translate_1._)('Go to the Store'),
            click: exports.Village.openStore,
            width: '80px',
            cost: {}
        })
            .addClass('locationButton')
            .appendTo('div#villagePanel');
        var storeButton = $('#storeButton.button');
        storeButton.hide();
        var lizButton = $('#lizButton.button');
        lizButton.hide();
        // Create the stores container
        $('<div>').attr('id', 'storesContainer').appendTo('div#villagePanel');
        //subscribe to stateUpdates
        // @ts-ignore
        $.Dispatch('stateUpdate').subscribe(exports.Village.handleStateUpdates);
        exports.Village.updateButton();
    },
    updateDescription: function () {
        this.descriptionPanel.empty();
        this.description = (0, textBuilder_1._tb)([
            (0, translate_1._)("Nestled in the woods, this village is scarcely more than a hamlet, "
                + "despite you thinking those two words are synonyms. They're not, "
                + "go google 'hamlet' right now if you don't believe me."),
            (0, translate_1._)("The village is quiet at the moment; there aren't enough hands for anyone to remain idle for long."),
            {
                text: (0, translate_1._)("A storefront, staffed entirely by a single grinning jackass, stands proudly in the main square."),
                isVisible: function () {
                    return state_manager_1.$SM.get('Road.gotApologized') !== undefined;
                }
            }
        ]);
        for (var i in this.description) {
            $('<div>').text(this.description[i]).appendTo(this.descriptionPanel);
        }
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
        this.updateDescription();
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
        var storeButton = $('#storeButton.button');
        if (state_manager_1.$SM.get('Road.gotApologized'))
            storeButton.show();
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
    },
    openStore: function () {
        events_1.Events.startEvent({
            title: (0, translate_1._)('A New Building'),
            scenes: {
                start: {
                    text: [
                        (0, translate_1._)("This is the store. There's nothing here yet, though.")
                    ],
                    buttons: {
                        leave: {
                            text: (0, translate_1._)('Lame'),
                            nextScene: 'end'
                        }
                    }
                }
            }
        });
    }
};

},{"../../lib/textBuilder":1,"../../lib/translate":2,"../Button":3,"../characters/liz":5,"../characters/mayor":6,"../engine":7,"../events":8,"../header":10,"../notifications":11,"../state_manager":19,"../weather":20}],15:[function(require,module,exports){
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
var perkList_1 = require("./perkList");
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
    perkArea: null,
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
        $('<div>').text('Character')
            .css('text-decoration', 'underline')
            .attr('id', 'title')
            .appendTo('div#character');
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
        this.perkArea = $('<div>').attr({
            id: 'perks',
            className: 'perks'
        }).appendTo('div#character');
        // TODO: add Perks list below here
        this.updatePerks();
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
        if (exports.Character.perks[perk] !== undefined) {
            if (perk.timeLeft > 0) {
                exports.Character.perks[perk] += perk.timeLeft;
            }
        }
        else {
            exports.Character.perks[perk] = perk;
        }
        this.updatePerks();
        notifications_1.Notifications.notify('null', "Acquired effect: " + perkList_1.PerkList[perk].name);
        state_manager_1.$SM.set('perks', exports.Character.perks);
    },
    removePerk: function (perk) {
        if (exports.Character.perks[perk.name] !== undefined) {
            delete exports.Character.perks[perk.name];
        }
        this.updatePerks();
        notifications_1.Notifications.notify('null', "Lost effect: " + perkList_1.PerkList[perk].name);
        state_manager_1.$SM.set('perks', exports.Character.perks);
    },
    updatePerks: function () {
        this.perkArea.empty();
        if (Object.keys(this.perks).length > 0) {
            $('<div>').text('Perks')
                .css('text-decoration', 'underline')
                .css('margin-top', '10px')
                .attr('id', 'title')
                .appendTo('div#perks');
            // set up click and hover handlers for perks
            this.perkArea
                .on("click", "#perk", function () {
                // handle this when we have perk descriptions and stuff
            }).on("mouseenter", "#perk", function () {
                var tooltip = $("<div id='tooltip' class='tooltip'>" + perkList_1.PerkList[$(this).data("name")].text + "</div>")
                    .attr('data-name', perk);
                tooltip.appendTo($(this));
            }).on("mouseleave", "#perk", function () {
                $("#tooltip", "#" + $(this).data("name")).fadeOut().remove();
            });
            for (var perk in exports.Character.perks) {
                // add mouseover and click stuff
                var perkElem = $('<div>')
                    .attr('id', 'perk')
                    .attr('data-name', perk)
                    .text(perkList_1.PerkList[perk].name)
                    .appendTo('div#perks');
            }
        }
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
        if (currentPhase === undefined)
            return;
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

},{"../../lib/translate":2,"../Button":3,"../events":8,"../notifications":11,"../state_manager":19,"./itemList":16,"./perkList":17,"./questLog":18}],16:[function(require,module,exports){
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
                                onChoose: function () { return character_1.Character.addToInventory("Liz.boringBook"); },
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
                                onChoose: function () { return character_1.Character.addToInventory("Stranger.silverKnife"); },
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
    },
    "oldLady.Candy": {
        name: 'a piece of hard candy',
        pluralName: 'pieces of hard candy',
        text: 'Given to you by a nice old woman in a carriage',
        onUse: function () {
            notifications_1.Notifications.notify(null, 'You pop the hard candy into your mouth. A few minutes '
                + 'later, it\'s gone, leaving behind only a mild sense of guilt about not '
                + 'calling your grandma more often.');
        },
        destroyOnUse: true,
        destroyable: true
    }
};

},{"../../lib/translate":2,"../events":8,"../notifications":11,"../state_manager":19,"./character":15}],17:[function(require,module,exports){
"use strict";
// master list of perks
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerkList = void 0;
var translate_1 = require("../../lib/translate");
exports.PerkList = {
    'tummyPain': {
        name: 'Socked in the Stomach',
        text: 'This doesn\'t seem like a perk, tbh',
        fullText: [
            (0, translate_1._)("You got his in the stomach really hard."),
            (0, translate_1._)("Like, REALLY hard. By a grinning jerk.")
        ],
        isActive: function () { return true; },
        statBonuses: {},
        timeLeft: -1
    }
};

},{"../../lib/translate":2}],18:[function(require,module,exports){
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

},{"../state_manager":19,"./character":15}],19:[function(require,module,exports){
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

},{"./engine":7,"./notifications":11}],20:[function(require,module,exports){
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

},{"./engine":7,"./notifications":11,"./state_manager":19}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL3RleHRCdWlsZGVyLnRzIiwic3JjL2xpYi90cmFuc2xhdGUudHMiLCJzcmMvc2NyaXB0L0J1dHRvbi50cyIsInNyYy9zY3JpcHQvY2hhcmFjdGVycy9jYXB0YWluLnRzIiwic3JjL3NjcmlwdC9jaGFyYWN0ZXJzL2xpei50cyIsInNyYy9zY3JpcHQvY2hhcmFjdGVycy9tYXlvci50cyIsInNyYy9zY3JpcHQvZW5naW5lLnRzIiwic3JjL3NjcmlwdC9ldmVudHMudHMiLCJzcmMvc2NyaXB0L2V2ZW50cy9yb2Fkd2FuZGVyLnRzIiwic3JjL3NjcmlwdC9oZWFkZXIudHMiLCJzcmMvc2NyaXB0L25vdGlmaWNhdGlvbnMudHMiLCJzcmMvc2NyaXB0L3BsYWNlcy9vdXRwb3N0LnRzIiwic3JjL3NjcmlwdC9wbGFjZXMvcm9hZC50cyIsInNyYy9zY3JpcHQvcGxhY2VzL3ZpbGxhZ2UudHMiLCJzcmMvc2NyaXB0L3BsYXllci9jaGFyYWN0ZXIudHMiLCJzcmMvc2NyaXB0L3BsYXllci9pdGVtTGlzdC50cyIsInNyYy9zY3JpcHQvcGxheWVyL3BlcmtMaXN0LnRzIiwic3JjL3NjcmlwdC9wbGF5ZXIvcXVlc3RMb2cudHMiLCJzcmMvc2NyaXB0L3N0YXRlX21hbmFnZXIudHMiLCJzcmMvc2NyaXB0L3dlYXRoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQSwrREFBK0Q7QUFDL0QscUNBQXFDO0FBQzlCLElBQU0sR0FBRyxHQUFHLFVBQVMsSUFBMkQ7SUFDbkYsSUFBTSxNQUFNLEdBQUcsSUFBSSxLQUFhLENBQUM7SUFDakMsS0FBSyxJQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNuQixJQUFJLE9BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRO1lBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FB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Q0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsWUFBWSxFQUFFO1FBQ1YsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3ZCLENBQUM7Q0FDSixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gdGV4dCBidWlsZGVyIHV0aWxpdHksIHVzZWQgZm9yIGhhbmRsaW5nIGNvbmRpdGlvbmFsIHRleHQgaW4gXHJcbi8vIGRlc2NyaXB0aW9ucyBhbmQgb3RoZXIgdGV4dCBibHVyYnNcclxuZXhwb3J0IGNvbnN0IF90YiA9IGZ1bmN0aW9uKHRleHQ6IEFycmF5PHN0cmluZyB8IHsgdGV4dDogc3RyaW5nLCBpc1Zpc2libGU6IEZ1bmN0aW9uIH0+KSB7XHJcbiAgICBjb25zdCBvdXRwdXQgPSBuZXcgQXJyYXk8c3RyaW5nPjtcclxuICAgIGZvciAoY29uc3QgaSBpbiB0ZXh0KSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZih0ZXh0W2ldKSA9PT0gXCJzdHJpbmdcIikgb3V0cHV0LnB1c2godGV4dFtpXSk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICgodGV4dFtpXSBhcyB7dGV4dDogc3RyaW5nLCBpc1Zpc2libGU6IEZ1bmN0aW9ufSkuaXNWaXNpYmxlKCkpIHtcclxuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKCh0ZXh0W2ldIGFzIHt0ZXh0OiBzdHJpbmcsIGlzVmlzaWJsZTogRnVuY3Rpb259KS50ZXh0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBvdXRwdXQ7XHJcbn0iLCIvLyAoZnVuY3Rpb24oKSB7XHJcblxyXG4vLyBcdHZhciB0cmFuc2xhdGUgPSBmdW5jdGlvbih0ZXh0KVxyXG4vLyBcdHtcclxuLy8gXHRcdHZhciB4bGF0ZSA9IHRyYW5zbGF0ZUxvb2t1cCh0ZXh0KTtcclxuXHRcdFxyXG4vLyBcdFx0aWYgKHR5cGVvZiB4bGF0ZSA9PSBcImZ1bmN0aW9uXCIpXHJcbi8vIFx0XHR7XHJcbi8vIFx0XHRcdHhsYXRlID0geGxhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuLy8gXHRcdH1cclxuLy8gXHRcdGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKVxyXG4vLyBcdFx0e1xyXG4vLyBcdFx0XHR2YXIgYXBzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xyXG4vLyBcdFx0XHR2YXIgYXJncyA9IGFwcy5jYWxsKCBhcmd1bWVudHMsIDEgKTtcclxuICBcclxuLy8gXHRcdFx0eGxhdGUgPSBmb3JtYXR0ZXIoeGxhdGUsIGFyZ3MpO1xyXG4vLyBcdFx0fVxyXG5cdFx0XHJcbi8vIFx0XHRyZXR1cm4geGxhdGU7XHJcbi8vIFx0fTtcclxuXHRcclxuLy8gXHQvLyBJIHdhbnQgaXQgYXZhaWxhYmxlIGV4cGxpY2l0eSBhcyB3ZWxsIGFzIHZpYSB0aGUgb2JqZWN0XHJcbi8vIFx0dHJhbnNsYXRlLnRyYW5zbGF0ZSA9IHRyYW5zbGF0ZTtcclxuXHRcclxuLy8gXHQvL2Zyb20gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vNzc2MTk2IHZpYSBodHRwOi8vZGF2ZWRhc2guY29tLzIwMTAvMTEvMTkvcHl0aG9uaWMtc3RyaW5nLWZvcm1hdHRpbmctaW4tamF2YXNjcmlwdC8gXHJcbi8vIFx0dmFyIGRlZmF1bHRGb3JtYXR0ZXIgPSAoZnVuY3Rpb24oKSB7XHJcbi8vIFx0XHR2YXIgcmUgPSAvXFx7KFtefV0rKVxcfS9nO1xyXG4vLyBcdFx0cmV0dXJuIGZ1bmN0aW9uKHMsIGFyZ3MpIHtcclxuLy8gXHRcdFx0cmV0dXJuIHMucmVwbGFjZShyZSwgZnVuY3Rpb24oXywgbWF0Y2gpeyByZXR1cm4gYXJnc1ttYXRjaF07IH0pO1xyXG4vLyBcdFx0fTtcclxuLy8gXHR9KCkpO1xyXG4vLyBcdHZhciBmb3JtYXR0ZXIgPSBkZWZhdWx0Rm9ybWF0dGVyO1xyXG4vLyBcdHRyYW5zbGF0ZS5zZXRGb3JtYXR0ZXIgPSBmdW5jdGlvbihuZXdGb3JtYXR0ZXIpXHJcbi8vIFx0e1xyXG4vLyBcdFx0Zm9ybWF0dGVyID0gbmV3Rm9ybWF0dGVyO1xyXG4vLyBcdH07XHJcblx0XHJcbi8vIFx0dHJhbnNsYXRlLmZvcm1hdCA9IGZ1bmN0aW9uKClcclxuLy8gXHR7XHJcbi8vIFx0XHR2YXIgYXBzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xyXG4vLyBcdFx0dmFyIHMgPSBhcmd1bWVudHNbMF07XHJcbi8vIFx0XHR2YXIgYXJncyA9IGFwcy5jYWxsKCBhcmd1bWVudHMsIDEgKTtcclxuICBcclxuLy8gXHRcdHJldHVybiBmb3JtYXR0ZXIocywgYXJncyk7XHJcbi8vIFx0fTtcclxuXHJcbi8vIFx0dmFyIGR5bm9UcmFucyA9IG51bGw7XHJcbi8vIFx0dHJhbnNsYXRlLnNldER5bmFtaWNUcmFuc2xhdG9yID0gZnVuY3Rpb24obmV3RHlub1RyYW5zKVxyXG4vLyBcdHtcclxuLy8gXHRcdGR5bm9UcmFucyA9IG5ld0R5bm9UcmFucztcclxuLy8gXHR9O1xyXG5cclxuLy8gXHR2YXIgdHJhbnNsYXRpb24gPSBudWxsO1xyXG4vLyBcdHRyYW5zbGF0ZS5zZXRUcmFuc2xhdGlvbiA9IGZ1bmN0aW9uKG5ld1RyYW5zbGF0aW9uKVxyXG4vLyBcdHtcclxuLy8gXHRcdHRyYW5zbGF0aW9uID0gbmV3VHJhbnNsYXRpb247XHJcbi8vIFx0fTtcclxuXHRcclxuLy8gXHRmdW5jdGlvbiB0cmFuc2xhdGVMb29rdXAodGFyZ2V0KVxyXG4vLyBcdHtcclxuLy8gXHRcdGlmICh0cmFuc2xhdGlvbiA9PSBudWxsIHx8IHRhcmdldCA9PSBudWxsKVxyXG4vLyBcdFx0e1xyXG4vLyBcdFx0XHRyZXR1cm4gdGFyZ2V0O1xyXG4vLyBcdFx0fVxyXG5cdFx0XHJcbi8vIFx0XHRpZiAodGFyZ2V0IGluIHRyYW5zbGF0aW9uID09IGZhbHNlKVxyXG4vLyBcdFx0e1xyXG4vLyBcdFx0XHRpZiAoZHlub1RyYW5zICE9IG51bGwpXHJcbi8vIFx0XHRcdHtcclxuLy8gXHRcdFx0XHRyZXR1cm4gZHlub1RyYW5zKHRhcmdldCk7XHJcbi8vIFx0XHRcdH1cclxuLy8gXHRcdFx0cmV0dXJuIHRhcmdldDtcclxuLy8gXHRcdH1cclxuXHRcdFxyXG4vLyBcdFx0dmFyIHJlc3VsdCA9IHRyYW5zbGF0aW9uW3RhcmdldF07XHJcbi8vIFx0XHRpZiAocmVzdWx0ID09IG51bGwpXHJcbi8vIFx0XHR7XHJcbi8vIFx0XHRcdHJldHVybiB0YXJnZXQ7XHJcbi8vIFx0XHR9XHJcblx0XHRcclxuLy8gXHRcdHJldHVybiByZXN1bHQ7XHJcbi8vIFx0fTtcclxuXHRcclxuLy8gXHR3aW5kb3cuXyA9IHRyYW5zbGF0ZTtcclxuXHJcbi8vIH0pKCk7XHJcblxyXG4vLyBleHBvcnQgY29uc3QgXyA9IHdpbmRvdy5fO1xyXG5cclxuZXhwb3J0IGNvbnN0IF8gPSBmdW5jdGlvbihzKSB7IHJldHVybiBzOyB9IiwiaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4vZW5naW5lXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEJ1dHRvbiA9IHtcclxuXHRCdXR0b246IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHRcdGlmKHR5cGVvZiBvcHRpb25zLmNvb2xkb3duID09ICdudW1iZXInKSB7XHJcblx0XHRcdHRoaXMuZGF0YV9jb29sZG93biA9IG9wdGlvbnMuY29vbGRvd247XHJcblx0XHR9XHJcblx0XHR0aGlzLmRhdGFfcmVtYWluaW5nID0gMDtcclxuXHRcdGlmKHR5cGVvZiBvcHRpb25zLmNsaWNrID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0dGhpcy5kYXRhX2hhbmRsZXIgPSBvcHRpb25zLmNsaWNrO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR2YXIgZWwgPSAkKCc8ZGl2PicpXHJcblx0XHRcdC5hdHRyKCdpZCcsIHR5cGVvZihvcHRpb25zLmlkKSAhPSAndW5kZWZpbmVkJyA/IG9wdGlvbnMuaWQgOiBcIkJUTl9cIiArIEVuZ2luZS5nZXRHdWlkKCkpXHJcblx0XHRcdC5hZGRDbGFzcygnYnV0dG9uJylcclxuXHRcdFx0LnRleHQodHlwZW9mKG9wdGlvbnMudGV4dCkgIT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLnRleHQgOiBcImJ1dHRvblwiKVxyXG5cdFx0XHQuY2xpY2soZnVuY3Rpb24oKSB7IFxyXG5cdFx0XHRcdGlmKCEkKHRoaXMpLmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XHJcblx0XHRcdFx0XHRCdXR0b24uY29vbGRvd24oJCh0aGlzKSk7XHJcblx0XHRcdFx0XHQkKHRoaXMpLmRhdGEoXCJoYW5kbGVyXCIpKCQodGhpcykpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0LmRhdGEoXCJoYW5kbGVyXCIsICB0eXBlb2Ygb3B0aW9ucy5jbGljayA9PSAnZnVuY3Rpb24nID8gb3B0aW9ucy5jbGljayA6IGZ1bmN0aW9uKCkgeyBFbmdpbmUubG9nKFwiY2xpY2tcIik7IH0pXHJcblx0XHRcdC5kYXRhKFwicmVtYWluaW5nXCIsIDApXHJcblx0XHRcdC5kYXRhKFwiY29vbGRvd25cIiwgdHlwZW9mIG9wdGlvbnMuY29vbGRvd24gPT0gJ251bWJlcicgPyBvcHRpb25zLmNvb2xkb3duIDogMCk7XHJcblx0XHRpZiAob3B0aW9ucy5pbWFnZSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGVsLmF0dHIoXCJzdHlsZVwiLCBcImJhY2tncm91bmQtaW1hZ2U6IHVybChcXFwiXCIgKyBvcHRpb25zLmltYWdlICsgXCJcXFwiKTsgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDsgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjsgaGVpZ2h0OiAxNzBweDsgY29sb3I6IHdoaXRlO3RleHQtc2hhZG93OiAwcHggMHB4IDJweCBibGFja1wiKVxyXG5cdFx0fVxyXG5cdFx0ZWwuYXBwZW5kKCQoXCI8ZGl2PlwiKS5hZGRDbGFzcygnY29vbGRvd24nKSk7XHJcblx0XHRcclxuXHRcdGlmKG9wdGlvbnMuY29zdCkge1xyXG5cdFx0XHR2YXIgdHRQb3MgPSBvcHRpb25zLnR0UG9zID8gb3B0aW9ucy50dFBvcyA6IFwiYm90dG9tIHJpZ2h0XCI7XHJcblx0XHRcdHZhciBjb3N0VG9vbHRpcCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ3Rvb2x0aXAgJyArIHR0UG9zKTtcclxuXHRcdFx0Zm9yKHZhciBrIGluIG9wdGlvbnMuY29zdCkge1xyXG5cdFx0XHRcdCQoXCI8ZGl2PlwiKS5hZGRDbGFzcygncm93X2tleScpLnRleHQoXyhrKSkuYXBwZW5kVG8oY29zdFRvb2x0aXApO1xyXG5cdFx0XHRcdCQoXCI8ZGl2PlwiKS5hZGRDbGFzcygncm93X3ZhbCcpLnRleHQob3B0aW9ucy5jb3N0W2tdKS5hcHBlbmRUbyhjb3N0VG9vbHRpcCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY29zdFRvb2x0aXAuY2hpbGRyZW4oKS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0Y29zdFRvb2x0aXAuYXBwZW5kVG8oZWwpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmKG9wdGlvbnMud2lkdGgpIHtcclxuXHRcdFx0ZWwuY3NzKCd3aWR0aCcsIG9wdGlvbnMud2lkdGgpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gZWw7XHJcblx0fSxcclxuXHRcclxuXHRzZXREaXNhYmxlZDogZnVuY3Rpb24oYnRuLCBkaXNhYmxlZCkge1xyXG5cdFx0aWYoYnRuKSB7XHJcblx0XHRcdGlmKCFkaXNhYmxlZCAmJiAhYnRuLmRhdGEoJ29uQ29vbGRvd24nKSkge1xyXG5cdFx0XHRcdGJ0bi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdFx0fSBlbHNlIGlmKGRpc2FibGVkKSB7XHJcblx0XHRcdFx0YnRuLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGJ0bi5kYXRhKCdkaXNhYmxlZCcsIGRpc2FibGVkKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGlzRGlzYWJsZWQ6IGZ1bmN0aW9uKGJ0bikge1xyXG5cdFx0aWYoYnRuKSB7XHJcblx0XHRcdHJldHVybiBidG4uZGF0YSgnZGlzYWJsZWQnKSA9PT0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cdFxyXG5cdGNvb2xkb3duOiBmdW5jdGlvbihidG4pIHtcclxuXHRcdHZhciBjZCA9IGJ0bi5kYXRhKFwiY29vbGRvd25cIik7XHJcblx0XHRpZihjZCA+IDApIHtcclxuXHRcdFx0JCgnZGl2LmNvb2xkb3duJywgYnRuKS5zdG9wKHRydWUsIHRydWUpLndpZHRoKFwiMTAwJVwiKS5hbmltYXRlKHt3aWR0aDogJzAlJ30sIGNkICogMTAwMCwgJ2xpbmVhcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBiID0gJCh0aGlzKS5jbG9zZXN0KCcuYnV0dG9uJyk7XHJcblx0XHRcdFx0Yi5kYXRhKCdvbkNvb2xkb3duJywgZmFsc2UpO1xyXG5cdFx0XHRcdGlmKCFiLmRhdGEoJ2Rpc2FibGVkJykpIHtcclxuXHRcdFx0XHRcdGIucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0YnRuLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHRidG4uZGF0YSgnb25Db29sZG93bicsIHRydWUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0Y2xlYXJDb29sZG93bjogZnVuY3Rpb24oYnRuKSB7XHJcblx0XHQkKCdkaXYuY29vbGRvd24nLCBidG4pLnN0b3AodHJ1ZSwgdHJ1ZSk7XHJcblx0XHRidG4uZGF0YSgnb25Db29sZG93bicsIGZhbHNlKTtcclxuXHRcdGlmKCFidG4uZGF0YSgnZGlzYWJsZWQnKSkge1xyXG5cdFx0XHRidG4ucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHR9XHJcblx0fVxyXG59OyIsImltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIlxyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiXHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiXHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuLi9wbGF5ZXIvY2hhcmFjdGVyXCJcclxuXHJcbmV4cG9ydCBjb25zdCBDYXB0YWluID0ge1xyXG5cdHRhbGtUb0NhcHRhaW46IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnVGhlIENhcHRhaW5cXCdzIFRlbnQnKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICBzZWVuRmxhZzogKCkgPT4gJFNNLmdldCgnb3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnKSxcclxuXHRcdFx0XHRcdG5leHRTY2VuZTogJ21haW4nLFxyXG5cdFx0XHRcdFx0b25Mb2FkOiAoKSA9PiAkU00uc2V0KCdvdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcsIDEpLFxyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdZb3UgZW50ZXIgdGhlIGZhbmNpZXN0LWxvb2tpbmcgdGVudCBpbiB0aGUgT3V0cG9zdC4gQSBsYXJnZSBtYW4gd2l0aCBhIHRvb3RoYnJ1c2ggbXVzdGFjaGUgYW5kIGEgc2V2ZXJlIGZyb3duIGxvb2tzIHVwIGZyb20gaGlzIGRlc2suJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiU2lyLCB5b3UgaGF2ZSBlbnRlcmVkIHRoZSB0ZW50IG9mIENhcHRhaW4gRmlubmVhcy4gV2hhdCBidXNpbmVzcyBkbyB5b3UgaGF2ZSBoZXJlP1wiJylcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Fza0Fib3V0U3VwcGxpZXMnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBc2sgQWJvdXQgU3VwcGxpZXMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6J2Fza0Fib3V0U3VwcGxpZXMnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiBDYXB0YWluLmhhbmRsZVN1cHBsaWVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlOiAoKSA9PiAhJFNNLmdldCgnb3V0cG9zdC5jYXB0YWluLmFza2VkQWJvdXRTdXBwbGllcycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhc2tBYm91dENhcHRhaW4nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBc2sgQWJvdXQgQ2FwdGFpbicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTogJ2NhcHRhaW5SYW1ibGUnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnbGVhdmUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdMZWF2ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICdtYWluJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnVGhlIENhcHRhaW4gZ3JlZXRzIHlvdSB3YXJtbHkuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiQWhoLCB5ZXMsIHdlbGNvbWUgYmFjay4gV2hhdCBjYW4gSSBkbyBmb3IgeW91P1wiJylcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Fza0Fib3V0U3VwcGxpZXMnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBc2sgQWJvdXQgU3VwcGxpZXMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6J2Fza0Fib3V0U3VwcGxpZXMnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiBDYXB0YWluLmhhbmRsZVN1cHBsaWVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlOiAoKSA9PiAhJFNNLmdldCgnb3V0cG9zdC5jYXB0YWluLmFza2VkQWJvdXRTdXBwbGllcycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhc2tBYm91dENhcHRhaW4nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBc2sgQWJvdXQgQ2FwdGFpbicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTonY2FwdGFpblJhbWJsZSd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0xlYXZlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgJ2NhcHRhaW5SYW1ibGUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdUaGUgQ2FwdGFpblxcJ3MgZXllcyBnbGVhbSBhdCB0aGUgb3Bwb3J0dW5pdHkgdG8gcnVuIGRvd24gaGlzIGxpc3Qgb2YgYWNoaWV2ZW1lbnRzLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIldoeSwgSVxcJ2xsIGhhdmUgeW91IGtub3cgdGhhdCB5b3Ugc3RhbmQgaW4gdGhlIHByZXNlbmNlIG9mIG5vbmUgb3RoZXIgdGhhbiBGaW5uZWFzIEouIEZvYnNsZXksIENhcHRhaW4gb2YgdGhlIFJveWFsIEFybXlcXCdzIEZpZnRoIERpdmlzaW9uLCB0aGUgZmluZXN0IERpdmlzaW9uIGluIEhpcyBNYWplc3R5XFwncyBzZXJ2aWNlLlwiJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ0hlIHB1ZmZzIG91dCBoaXMgY2hlc3QsIGRyYXdpbmcgYXR0ZW50aW9uIHRvIGhpcyBtYW55IG1lZGFscy4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCJJIGhhdmUgY2FtcGFpZ25lZCBvbiBiZWhhbGYgb2YgT3VyIExvcmRzaGlwIGFjcm9zcyBtYW55IGxhbmRzLCBpbmNsdWRpbmcgVGhlIEZhciBXZXN0LCB0aGUgbm9ydGhlcm4gYm9yZGVycyBvZiBVbWJlcnNoaXJlIGFuZCBQZWxpbmdhbCwgTmV3IEJlbGxpc2lhLCBhbmQgZWFjaCBvZiB0aGUgRml2ZSBJc2xlcyBvZiB0aGUgUGlycmhpYW4gU2VhLlwiJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ0hlIHBhdXNlcyBmb3IgYSBtb21lbnQsIHBlcmhhcHMgdG8gc2VlIGlmIHlvdSBhcmUgc3VpdGFibHkgaW1wcmVzc2VkLCB0aGVuIGNvbnRpbnVlcy4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCJBcyBDYXB0YWluIG9mIHRoZSBGaWZ0aCBEaXZpc2lvbiwgSSBoYWQgdGhlIGVzdGVlbWVkIHByaXZpbGVnZSBvZiBlbnN1cmluZyB0aGUgc2FmZXR5IG9mIHRoZXNlIGxhbmRzIGZvciBvdXIgZmFpciBjaXRpemVucy4gSSBoYXZlIGJlZW4gYXdhcmRlZCBtYW55IHRpbWVzIG92ZXIgZm9yIG15IGJyYXZlcnkgaW4gdGhlIGZhY2Ugb2YgdXRtb3N0IHBlcmlsLiBGb3IgaW5zdGFuY2UsIGR1cmluZyB0aGUgU2VhIENhbXBhaWduIG9uIFRoeXBwZSwgVGhpcmQgb2YgdGhlIEZpdmUgSXNsZXMsIHdlIHdlcmUgYW1idXNoZWQgd2hpbGUgZGlzZW1iYXJraW5nIGZyb20gb3VyIHNoaXAuIFRoaW5raW5nIHF1aWNrbHksIEkuLi5cIicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdUaGUgY2FwdGFpbiBjb250aW51ZXMgdG8gcmFtYmxlIGxpa2UgdGhpcyBmb3Igc2V2ZXJhbCBtb3JlIG1pbnV0ZXMsIGdpdmluZyB5b3UgdGltZSB0byBiZWNvbWUgbXVjaCBtb3JlIGZhbWlsaWFyIHdpdGggdGhlIGRpcnQgdW5kZXIgeW91ciBmaW5nZXJuYWlscy4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCIuLi4gYW5kIFRIQVQsIG15IGdvb2QgYWR2ZW50dXJlciwgaXMgd2h5IEkgYWx3YXlzIGtlZXAgZnJlc2ggYmFzaWwgb24gaGFuZC5cIicpXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdmYXNjaW5hdGluZyc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0Zhc2NpbmF0aW5nJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOidtYWluQ29udGludWVkJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAnbWFpbkNvbnRpbnVlZCc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1RoZSBDYXB0YWluIHNodWZmbGVzIGhpcyBwYXBlcnMgaW4gYSBzb21ld2hhdCBwZXJmb3JtYXRpdmUgd2F5LicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIldhcyB0aGVyZSBzb21ldGhpbmcgZWxzZSB5b3UgbmVlZGVkP1wiJylcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Fza0Fib3V0U3VwcGxpZXMnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBc2sgQWJvdXQgU3VwcGxpZXMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6J2Fza0Fib3V0U3VwcGxpZXMnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiBDYXB0YWluLmhhbmRsZVN1cHBsaWVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlOiAoKSA9PiAhJFNNLmdldCgnb3V0cG9zdC5jYXB0YWluLmFza2VkQWJvdXRTdXBwbGllcycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhc2tBYm91dENhcHRhaW4nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBc2sgQWJvdXQgQ2FwdGFpbicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTonY2FwdGFpblJhbWJsZSd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0xlYXZlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgJ2Fza0Fib3V0U3VwcGxpZXMnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdUaGUgQ2FwdGFpblxcJ3MgZXllcyBnbGVhbSB3aXRoIGEgbWl4dHVyZSBvZiByZWFsaXphdGlvbiBhbmQgZ3VpbHQuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiQWhoLCB5ZXMsIHJpZ2h0LCB0aGUgc3VwcGxpZXMuIEkgc3VwcG9zZSB0aGUgTWF5b3IgaXMgc3RpbGwgd2FpdGluZyBmb3IgdGhvc2UuIEhhdmUgYSBsb29rIGluIHRoYXQgY2hlc3Qgb3ZlciB0aGVyZSwgaXQgc2hvdWxkIGhhdmUgZXZlcnl0aGluZyB5b3UgbmVlZC5cIicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdIZSBpbmRpY2F0ZXMgdG8gYSBjaGVzdCBhdCB0aGUgYmFjayBvZiB0aGUgcm9vbS4gWW91IG9wZW4gdGhlIGxpZCwgcmV2ZWFsaW5nIHRoZSBzdXBwbGllcyB3aXRoaW4uJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1lvdSB0YWtlIHRoZSBzdXBwbGllcy4nKVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0dvb2QgU3R1ZmYnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG5cclxuICAgIGhhbmRsZVN1cHBsaWVzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAkU00uc2V0KCdvdXRwb3N0LmNhcHRhaW4uYXNrZWRBYm91dFN1cHBsaWVzJywgMSk7XHJcbiAgICAgICAgQ2hhcmFjdGVyLmFkZFRvSW52ZW50b3J5KFwiQ2FwdGFpbi5zdXBwbGllc1wiKTtcclxuICAgICAgICBDaGFyYWN0ZXIuY2hlY2tRdWVzdFN0YXR1cyhcIm1heW9yU3VwcGxpZXNcIik7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyBWaWxsYWdlIH0gZnJvbSBcIi4uL3BsYWNlcy92aWxsYWdlXCI7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuLi9wbGF5ZXIvY2hhcmFjdGVyXCI7XHJcblxyXG5leHBvcnQgY29uc3QgTGl6ID0ge1xyXG4gICAgc2V0TGl6QWN0aXZlOiBmdW5jdGlvbigpIHtcclxuXHRcdCRTTS5zZXQoJ3ZpbGxhZ2UubGl6QWN0aXZlJywgMSk7XHJcblx0XHQkU00uc2V0KCd2aWxsYWdlLmxpei5jYW5GaW5kQm9vaycsIDApO1xyXG5cdFx0JFNNLnNldCgndmlsbGFnZS5saXouaGFzQm9vaycsIDEpO1xyXG5cdFx0VmlsbGFnZS51cGRhdGVCdXR0b24oKTtcclxuXHR9LFxyXG5cclxuXHR0YWxrVG9MaXo6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnTGl6XFwncyBob3VzZSwgYXQgdGhlIGVkZ2Ugb2YgdG93bicpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0c2VlbkZsYWc6ICgpID0+ICRTTS5nZXQoJ3ZpbGxhZ2UubGl6LmhhdmVNZXQnKSxcclxuXHRcdFx0XHRcdG5leHRTY2VuZTogJ21haW4nLFxyXG5cdFx0XHRcdFx0b25Mb2FkOiAoKSA9PiAkU00uc2V0KCd2aWxsYWdlLmxpei5oYXZlTWV0JywgMSksXHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1lvdSBlbnRlciB0aGUgYnVpbGRpbmcgYW5kIGFyZSBpbW1lZGlhdGVseSBwbHVuZ2VkIGludG8gYSBsYWJ5cmludGggb2Ygc2hlbHZlcyBoYXBoYXphcmRseSBmaWxsZWQgd2l0aCBib29rcyBvZiBhbGwga2luZHMuIEFmdGVyIGEgYml0IG9mIHNlYXJjaGluZywgeW91IGZpbmQgYSBzaWRlIHJvb20gd2hlcmUgYSB3b21hbiB3aXRoIG1vdXN5IGhhaXIgYW5kIGdsYXNzZXMgaXMgc2l0dGluZyBhdCBhIHdyaXRpbmcgZGVzay4gU2hlXFwncyByZWFkaW5nIGEgbGFyZ2UgYm9vayB0aGF0IGFwcGVhcnMgdG8gaW5jbHVkZSBkaWFncmFtcyBvZiBzb21lIHNvcnQgb2YgcGxhbnQuIFNoZSBsb29rcyB1cCBhcyB5b3UgZW50ZXIgdGhlIHJvb20uJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiV2hvIHRoZSBoZWxsIGFyZSB5b3U/XCInKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2Fza0Fib3V0VG93bic6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgYWJvdXQgQ2hhZHRvcGlhJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2NoYWR0b3BpYVJhbWJsZSd9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdxdWVzdCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgZm9yIGEgcXVlc3QnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAncXVlc3RSZXF1ZXN0J31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0xlYXZlJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnY2hhZHRvcGlhUmFtYmxlJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdMaXogbG9va3MgYXQgeW91IGZvciBhIG1vbWVudCBiZWZvcmUgcmV0dXJuaW5nIGhlciBnYXplIHRvIHRoZSBib29rIGluIGZyb250IG9mIGhlci4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJUaGVyZVxcJ3MgYSBib29rIGluIGhlcmUgc29tZXdoZXJlIGFib3V0IHRoZSBmb3VuZGluZyBvZiBDaGFkdG9waWEuIElmIHlvdSBjYW4gZmluZCBpdCwgeW91XFwncmUgZnJlZSB0byBib3Jyb3cgaXQuXCInKV0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdva2F5Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ09rYXksIHRoZW4uJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ21haW4nfSxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogKCkgPT4gJFNNLnNldCgndmlsbGFnZS5saXouY2FuRmluZEJvb2snLCB0cnVlKVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHJcblx0XHRcdFx0J21haW4nOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXygnTGl6IHNlZW1zIGRldGVybWluZWQgbm90IHRvIHBheSBhdHRlbnRpb24gdG8geW91LicpXSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2Fza0Fib3V0VG93bic6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgYWJvdXQgQ2hhZHRvcGlhJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2NoYWR0b3BpYVJhbWJsZSd9LFxyXG5cdFx0XHRcdFx0XHRcdGF2YWlsYWJsZTogKCkgPT4gISRTTS5nZXQoJ3ZpbGxhZ2UubGl6LmNhbkZpbmRCb29rJylcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J3F1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBmb3IgYSBxdWVzdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdxdWVzdFJlcXVlc3QnfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnZmluZEJvb2snOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnVHJ5IHRvIGZpbmQgdGhlIGJvb2snKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnZmluZEJvb2snfSxcclxuXHRcdFx0XHRcdFx0XHQvLyBUT0RPOiBhIFwidmlzaWJsZVwiIGZsYWcgd291bGQgYmUgZ29vZCBoZXJlLCBmb3Igc2l0dWF0aW9ucyB3aGVyZSBhbiBvcHRpb25cclxuXHRcdFx0XHRcdFx0XHQvLyAgIGlzbid0IHlldCBrbm93biB0byB0aGUgcGxheWVyXHJcblx0XHRcdFx0XHRcdFx0dmlzaWJsZTogKCkgPT4gJFNNLmdldCgndmlsbGFnZS5saXouY2FuRmluZEJvb2snKSxcclxuXHRcdFx0XHRcdFx0XHRhdmFpbGFibGU6ICgpID0+ICgkU00uZ2V0KCd2aWxsYWdlLmxpei5jYW5GaW5kQm9vaycpIGFzIG51bWJlciA+IDApICYmICgkU00uZ2V0KCd2aWxsYWdlLmxpei5oYXNCb29rJykpXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdsZWF2ZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdMZWF2ZScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J2ZpbmRCb29rJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdMZWF2aW5nIExpeiB0byBoZXIgYnVzaW5lc3MsIHlvdSB3YW5kZXIgYXJvdW5kIGFtaWRzdCB0aGUgYm9va3MsIHdvbmRlcmluZyBob3cgeW91XFwnbGwgZXZlciBtYW5hZ2UgdG8gZmluZCB3aGF0IHlvdVxcJ3JlIGxvb2tpbmcgZm9yIGluIGFsbCB0aGlzIHVub3JnYW5pemVkIG1lc3MuJyksXHJcblx0XHRcdFx0XHRcdF8oJ0ZvcnR1bmF0ZWx5LCB0aGUgY3JlYXRvciBvZiB0aGlzIGdhbWUgZG9lc25cXCd0IGZlZWwgbGlrZSBpdFxcJ2QgYmUgdmVyeSBpbnRlcmVzdGluZyB0byBtYWtlIHRoaXMgaW50byBhIHB1enpsZSwgc28geW91IHNwb3QgdGhlIGJvb2sgb24gYSBuZWFyYnkgc2hlbGYgYW5kIGdyYWIgaXQuJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdzaWNrJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ09oLCBzaWNrJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gJFNNLnNldCgnc3RvcmVzLldlaXJkIEJvb2snLCAxKTtcclxuXHRcdFx0XHRcdFx0XHRcdENoYXJhY3Rlci5hZGRUb0ludmVudG9yeShcIkxpei53ZWlyZEJvb2tcIik7XHJcblx0XHRcdFx0XHRcdFx0XHQkU00uc2V0KCd2aWxsYWdlLmxpei5oYXNCb29rJywgMCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQncXVlc3RSZXF1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdMaXogbGV0cyBvdXQgYW4gYW5ub3llZCBzaWdoLicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIk9oIGJyYXZlIGFkdmVudHVyZXIsIEkgc2VlbSB0byBoYXZlIGxvc3QgbXkgcGF0aWVuY2UuIFdoZW4gbGFzdCBJIHNhdyBpdCwgaXQgd2FzIHNvbWV3aGVyZSBvdXRzaWRlIG9mIHRoaXMgYnVpbGRpbmcuIFdvdWxkc3QgdGhvdSByZWNvdmVyIHRoYXQgd2hpY2ggaGFzIGJlZW4gc3RvbGVuIGZyb20gbWU/XCInKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J29rYXknOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnT2theSwgamVleiwgSSBnZXQgaXQnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnbWFpbid9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxufSIsImltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IExpeiB9IGZyb20gXCIuL2xpelwiO1xyXG5pbXBvcnQgeyBSb2FkIH0gZnJvbSBcIi4uL3BsYWNlcy9yb2FkXCI7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuLi9wbGF5ZXIvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCB7IFZpbGxhZ2UgfSBmcm9tIFwiLi4vcGxhY2VzL3ZpbGxhZ2VcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBNYXlvciA9IHtcclxuICAgIHRhbGtUb01heW9yOiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ01lZXQgdGhlIE1heW9yJyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHRzZWVuRmxhZzogKCkgPT4gJFNNLmdldCgndmlsbGFnZS5tYXlvci5oYXZlTWV0JyksXHJcblx0XHRcdFx0XHRuZXh0U2NlbmU6ICdtYWluJyxcclxuXHRcdFx0XHRcdG9uTG9hZDogKCkgPT4gJFNNLnNldCgndmlsbGFnZS5tYXlvci5oYXZlTWV0JywgMSksXHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1RoZSBtYXlvciBzbWlsZXMgYXQgeW91IGFuZCBzYXlzOicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIldlbGNvbWUgdG8gQ2hhZHRvcGlhLCBJXFwnbSB0aGUgbWF5b3Igb2YgdGhlc2UgaGVyZSBwYXJ0cy4gV2hhdCBjYW4gSSBkbyB5b3UgZm9yP1wiJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdhc2tBYm91dFRvd24nOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGFib3V0IENoYWR0b3BpYScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdjaGFkdG9waWFSYW1ibGUnfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQncXVlc3QnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGZvciBhIHF1ZXN0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ3F1ZXN0J31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0xlYXZlJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnY2hhZHRvcGlhUmFtYmxlJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdUaGUgbWF5b3IgcHVzaGVzIHRoZSBicmltIG9mIGhpcyBoYXQgdXAuJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiV2VsbCwgd2VcXCd2ZSBhbHdheXMgYmVlbiBoZXJlLCBsb25nIGFzIEkgY2FuIHJlbWVtYmVyLiBJIHRvb2sgb3ZlciBhZnRlciB0aGUgbGFzdCBtYXlvciBkaWVkLCBidXQgaGUgd291bGQgaGF2ZSBiZWVuIHRoZSBvbmx5IHBlcnNvbiB3aXRoIGFueSBoaXN0b3JpY2FsIGtub3dsZWRnZSBvZiB0aGlzIHZpbGxhZ2UuXCInKSxcclxuXHRcdFx0XHRcdFx0XygnSGUgcGF1c2VzIGZvciBhIG1vbWVudCBhbmQgdG91c2xlcyBzb21lIG9mIHRoZSB3aXNweSBoYWlycyB0aGF0IGhhdmUgcG9rZWQgb3V0IGZyb20gdW5kZXIgdGhlIHJhaXNlZCBoYXQuJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiQWN0dWFsbHksIHlvdSBtaWdodCBhc2sgTGl6LCBzaGUgaGFzIGEgYnVuY2ggb2YgaGVyIG1vdGhlclxcJ3MgYm9va3MgZnJvbSB3YXkgYmFjayB3aGVuLiBTaGUgbGl2ZXMgYXQgdGhlIGVkZ2Ugb2YgdG93bi5cIicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnb2theSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdPa2F5LCB0aGVuLicpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdtYWluJ30sXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IExpei5zZXRMaXpBY3RpdmVcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J21haW4nOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1RoZSBtYXlvciBzYXlzOicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIkFueXdheSwgd2hhdCBFTFNFIGNhbiBJIGRvIHlvdSBmb3I/XCInKSxcclxuXHRcdFx0XHRcdFx0XygnSGUgY2h1Y2tsZXMgYXQgaGlzIGNsZXZlciB1c2Ugb2YgbGFuZ3VhZ2UuJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdhc2tBYm91dFRvd24nOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGFib3V0IENoYWR0b3BpYScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdjaGFkdG9waWFSYW1ibGUnfSxcclxuXHRcdFx0XHRcdFx0XHQvLyBpbWFnZTogXCJhc3NldHMvY2FyZHMvbGl0dGxlX3dvbGYucG5nXCJcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J3F1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBmb3IgYSBxdWVzdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdxdWVzdCd9LFxyXG5cdFx0XHRcdFx0XHRcdGF2YWlsYWJsZTogKCkgPT5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIG5vdCBhdmFpbGFibGUgaWYgbWF5b3JTdXBwbGllcyBpcyBpbi1wcm9ncmVzc1xyXG5cdFx0XHRcdFx0XHRcdFx0KENoYXJhY3Rlci5xdWVzdFN0YXR1c1tcIm1heW9yU3VwcGxpZXNcIl0gPT09IHVuZGVmaW5lZClcclxuXHRcdFx0XHRcdFx0XHRcdC8vIHJlLWFkZCB0aGlzIGNvbmRpdGlvbiBsYXRlciwgd2UgbmVlZCB0byBzZW5kIHRoZW0gdG8gYSBkaWZmZXJlbnRcclxuXHRcdFx0XHRcdFx0XHRcdC8vICAgcXVlc3QgZGlhbG9nIGlmIHRoZXkgYWxyZWFkeSBkaWQgdGhlIGZpcnN0IHF1ZXN0XHJcblx0XHRcdFx0XHRcdFx0XHQvLyB8fCAoQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW1wibWF5b3JTdXBwbGllc1wiXSA9PSAtMSlcclxuXHRcdFx0XHRcdFx0XHQvLyBpbWFnZTogXCJhc3NldHMvY2FyZHMvam9rZXIucG5nXCJcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2dpdmVTdXBwbGllcyc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdIYW5kIG92ZXIgdGhlIHN1cHBsaWVzJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2dpdmVTdXBwbGllcyd9LFxyXG5cdFx0XHRcdFx0XHRcdGF2YWlsYWJsZTogKCkgPT4gXHJcblx0XHRcdFx0XHRcdFx0XHQoJFNNLmdldCgndmlsbGFnZS5tYXlvci5oYXZlR2l2ZW5TdXBwbGllcycpID09PSB1bmRlZmluZWQpIFxyXG5cdFx0XHRcdFx0XHRcdFx0JiYgKENoYXJhY3Rlci5xdWVzdFN0YXR1c1tcIm1heW9yU3VwcGxpZXNcIl0gIT09IHVuZGVmaW5lZClcclxuXHRcdFx0XHRcdFx0XHRcdCYmIENoYXJhY3Rlci5pbnZlbnRvcnlbXCJDYXB0YWluLnN1cHBsaWVzXCJdLFxyXG5cdFx0XHRcdFx0XHRcdHZpc2libGU6ICgpID0+XHJcblx0XHRcdFx0XHRcdFx0XHQoQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW1wibWF5b3JTdXBwbGllc1wiXSAhPT0gdW5kZWZpbmVkKSxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0Q2hhcmFjdGVyLnJlbW92ZUZyb21JbnZlbnRvcnkoXCJDYXB0YWluLnN1cHBsaWVzXCIpO1xyXG5cdFx0XHRcdFx0XHRcdFx0JFNNLnNldCgndmlsbGFnZS5tYXlvci5oYXZlR2l2ZW5TdXBwbGllcycsIDEpO1xyXG5cdFx0XHRcdFx0XHRcdFx0Q2hhcmFjdGVyLmNoZWNrUXVlc3RTdGF0dXMoXCJtYXlvclN1cHBsaWVzXCIpO1xyXG5cdFx0XHRcdFx0XHRcdFx0VmlsbGFnZS51cGRhdGVCdXR0b24oKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdsZWF2ZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdMZWF2ZScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0Ly8gaW1hZ2U6IFwiYXNzZXRzL2NhcmRzL3JhdmVuLnBuZ1wiXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdxdWVzdCc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnVGhlIG1heW9yIHRoaW5rcyBmb3IgYSBtb21lbnQuJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiWW91IGtub3csIGl0XFwncyBiZWVuIGEgd2hpbGUgc2luY2Ugb3VyIGxhc3Qgc2hpcG1lbnQgb2Ygc3VwcGxpZXMgYXJyaXZlZCBmcm9tIHRoZSBvdXRwb3N0LiBNaW5kIGxvb2tpbmcgaW50byB0aGF0IGZvciB1cz9cIicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIllvdSBjYW4gYXNrIGFib3V0IGl0IGF0IHRoZSBvdXRwb3N0LCBvciBqdXN0IHdhbmRlciBhcm91bmQgb24gdGhlIHJvYWQgYW5kIHNlZSBpZiB5b3UgZmluZCBhbnkgY2x1ZXMuIEVpdGhlciB3YXksIGl0XFwncyB0aW1lIHRvIGhpdCB0aGUgcm9hZCwgYWR2ZW50dXJlciFcIicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnYWxyaWdodHknOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQWxyaWdodHknKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnbWFpbid9LFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBNYXlvci5zdGFydFN1cHBsaWVzUXVlc3RcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J2dpdmVTdXBwbGllcyc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnVGhlIG1heW9yIHNtaWxlcywgYW5kIHRoZSBlZGdlcyBvZiBoaXMgZXllcyBjcmlua2xlLicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIlRoYW5rIHlvdSwgYnJhdmUgYWR2ZW50dXJlciEgV2l0aCB0aGVzZSBzdXBwbGllcywgdGhlIHZpbGxhZ2UgY2FuIG9uY2UgYWdhaW4gdGhyaXZlLlwiJyksXHJcblx0XHRcdFx0XHRcdF8oJ0hlIHRha2VzIHRoZW0gZnJvbSB5b3UgZ3JhY2lvdXNseSwgYW5kIHByb21wdGx5IGhhbmRzIHRoZW0gb2ZmIHRvIHNvbWUgd29ya2Vycywgd2hvIHF1aWNrbHkgZXJlY3QgYSBidWlsZGluZyB0aGF0IGdpdmVzIHlvdSBhIG5ldyBidXR0b24gdG8gY2xpY2snKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2ltcHJlc3NpdmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnSW1wcmVzc2l2ZSEnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0c3RhcnRTdXBwbGllc1F1ZXN0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHQvLyBpZiAoISRTTS5nZXQoJ3F1ZXN0LnN1cHBsaWVzJykpIHtcclxuXHRcdC8vIFx0Ly8gMSA9IHN0YXJ0ZWQsIDIgPSBuZXh0IHN0ZXAsIGV0Yy4gdW50aWwgY29tcGxldGVkXHJcblx0XHQvLyBcdCRTTS5zZXQoJ3F1ZXN0LnN1cHBsaWVzJywgMSk7XHJcblx0XHQvLyBcdFJvYWQuaW5pdCgpO1xyXG5cdFx0Ly8gfVxyXG5cdFx0aWYgKENoYXJhY3Rlci5xdWVzdFN0YXR1c1tcIm1heW9yU3VwcGxpZXNcIl0gPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRDaGFyYWN0ZXIuc2V0UXVlc3RTdGF0dXMoXCJtYXlvclN1cHBsaWVzXCIsIDApO1xyXG5cdFx0XHRSb2FkLmluaXQoKTtcclxuXHRcdH1cclxuXHR9XHJcbn0iLCIvLyBAdHMtbm9jaGVja1xyXG5cclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgTm90aWZpY2F0aW9ucyB9IGZyb20gXCIuL25vdGlmaWNhdGlvbnNcIjtcclxuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4vZXZlbnRzXCI7XHJcbmltcG9ydCB7IFZpbGxhZ2UgfSBmcm9tIFwiLi9wbGFjZXMvdmlsbGFnZVwiO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tIFwiLi9wbGF5ZXIvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCB7IFdlYXRoZXIgfSBmcm9tIFwiLi93ZWF0aGVyXCI7XHJcbmltcG9ydCB7IFJvYWQgfSBmcm9tIFwiLi9wbGFjZXMvcm9hZFwiO1xyXG5pbXBvcnQgeyBPdXRwb3N0IH0gZnJvbSBcIi4vcGxhY2VzL291dHBvc3RcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBFbmdpbmUgPSB3aW5kb3cuRW5naW5lID0ge1xyXG5cdFxyXG5cdFNJVEVfVVJMOiBlbmNvZGVVUklDb21wb25lbnQoXCJodHRwOi8vYWRhcmtyb29tLmRvdWJsZXNwZWFrZ2FtZXMuY29tXCIpLFxyXG5cdFZFUlNJT046IDEuMyxcclxuXHRNQVhfU1RPUkU6IDk5OTk5OTk5OTk5OTk5LFxyXG5cdFNBVkVfRElTUExBWTogMzAgKiAxMDAwLFxyXG5cdEdBTUVfT1ZFUjogZmFsc2UsXHJcblx0XHJcblx0Ly9vYmplY3QgZXZlbnQgdHlwZXNcclxuXHR0b3BpY3M6IHt9LFxyXG5cdFx0XHJcblx0UGVya3M6IHtcclxuXHRcdCdib3hlcic6IHtcclxuXHRcdFx0bmFtZTogXygnYm94ZXInKSxcclxuXHRcdFx0ZGVzYzogXygncHVuY2hlcyBkbyBtb3JlIGRhbWFnZScpLFxyXG5cdFx0XHQvLy8gVFJBTlNMQVRPUlMgOiBtZWFucyB3aXRoIG1vcmUgZm9yY2UuXHJcblx0XHRcdG5vdGlmeTogXygnbGVhcm5lZCB0byB0aHJvdyBwdW5jaGVzIHdpdGggcHVycG9zZScpXHJcblx0XHR9LFxyXG5cdFx0J21hcnRpYWwgYXJ0aXN0Jzoge1xyXG5cdFx0XHRuYW1lOiBfKCdtYXJ0aWFsIGFydGlzdCcpLFxyXG5cdFx0XHRkZXNjOiBfKCdwdW5jaGVzIGRvIGV2ZW4gbW9yZSBkYW1hZ2UuJyksXHJcblx0XHRcdG5vdGlmeTogXygnbGVhcm5lZCB0byBmaWdodCBxdWl0ZSBlZmZlY3RpdmVseSB3aXRob3V0IHdlYXBvbnMnKVxyXG5cdFx0fSxcclxuXHRcdCd1bmFybWVkIG1hc3Rlcic6IHtcclxuXHRcdFx0Ly8vIFRSQU5TTEFUT1JTIDogbWFzdGVyIG9mIHVuYXJtZWQgY29tYmF0XHJcblx0XHRcdG5hbWU6IF8oJ3VuYXJtZWQgbWFzdGVyJyksXHJcblx0XHRcdGRlc2M6IF8oJ3B1bmNoIHR3aWNlIGFzIGZhc3QsIGFuZCB3aXRoIGV2ZW4gbW9yZSBmb3JjZScpLFxyXG5cdFx0XHRub3RpZnk6IF8oJ2xlYXJuZWQgdG8gc3RyaWtlIGZhc3RlciB3aXRob3V0IHdlYXBvbnMnKVxyXG5cdFx0fSxcclxuXHRcdCdiYXJiYXJpYW4nOiB7XHJcblx0XHRcdG5hbWU6IF8oJ2JhcmJhcmlhbicpLFxyXG5cdFx0XHRkZXNjOiBfKCdtZWxlZSB3ZWFwb25zIGRlYWwgbW9yZSBkYW1hZ2UnKSxcclxuXHRcdFx0bm90aWZ5OiBfKCdsZWFybmVkIHRvIHN3aW5nIHdlYXBvbnMgd2l0aCBmb3JjZScpXHJcblx0XHR9LFxyXG5cdFx0J3Nsb3cgbWV0YWJvbGlzbSc6IHtcclxuXHRcdFx0bmFtZTogXygnc2xvdyBtZXRhYm9saXNtJyksXHJcblx0XHRcdGRlc2M6IF8oJ2dvIHR3aWNlIGFzIGZhciB3aXRob3V0IGVhdGluZycpLFxyXG5cdFx0XHRub3RpZnk6IF8oJ2xlYXJuZWQgaG93IHRvIGlnbm9yZSB0aGUgaHVuZ2VyJylcclxuXHRcdH0sXHJcblx0XHQnZGVzZXJ0IHJhdCc6IHtcclxuXHRcdFx0bmFtZTogXygnZGVzZXJ0IHJhdCcpLFxyXG5cdFx0XHRkZXNjOiBfKCdnbyB0d2ljZSBhcyBmYXIgd2l0aG91dCBkcmlua2luZycpLFxyXG5cdFx0XHRub3RpZnk6IF8oJ2xlYXJuZWQgdG8gbG92ZSB0aGUgZHJ5IGFpcicpXHJcblx0XHR9LFxyXG5cdFx0J2V2YXNpdmUnOiB7XHJcblx0XHRcdG5hbWU6IF8oJ2V2YXNpdmUnKSxcclxuXHRcdFx0ZGVzYzogXygnZG9kZ2UgYXR0YWNrcyBtb3JlIGVmZmVjdGl2ZWx5JyksXHJcblx0XHRcdG5vdGlmeTogXyhcImxlYXJuZWQgdG8gYmUgd2hlcmUgdGhleSdyZSBub3RcIilcclxuXHRcdH0sXHJcblx0XHQncHJlY2lzZSc6IHtcclxuXHRcdFx0bmFtZTogXygncHJlY2lzZScpLFxyXG5cdFx0XHRkZXNjOiBfKCdsYW5kIGJsb3dzIG1vcmUgb2Z0ZW4nKSxcclxuXHRcdFx0bm90aWZ5OiBfKCdsZWFybmVkIHRvIHByZWRpY3QgdGhlaXIgbW92ZW1lbnQnKVxyXG5cdFx0fSxcclxuXHRcdCdzY291dCc6IHtcclxuXHRcdFx0bmFtZTogXygnc2NvdXQnKSxcclxuXHRcdFx0ZGVzYzogXygnc2VlIGZhcnRoZXInKSxcclxuXHRcdFx0bm90aWZ5OiBfKCdsZWFybmVkIHRvIGxvb2sgYWhlYWQnKVxyXG5cdFx0fSxcclxuXHRcdCdzdGVhbHRoeSc6IHtcclxuXHRcdFx0bmFtZTogXygnc3RlYWx0aHknKSxcclxuXHRcdFx0ZGVzYzogXygnYmV0dGVyIGF2b2lkIGNvbmZsaWN0IGluIHRoZSB3aWxkJyksXHJcblx0XHRcdG5vdGlmeTogXygnbGVhcm5lZCBob3cgbm90IHRvIGJlIHNlZW4nKVxyXG5cdFx0fSxcclxuXHRcdCdnYXN0cm9ub21lJzoge1xyXG5cdFx0XHRuYW1lOiBfKCdnYXN0cm9ub21lJyksXHJcblx0XHRcdGRlc2M6IF8oJ3Jlc3RvcmUgbW9yZSBoZWFsdGggd2hlbiBlYXRpbmcnKSxcclxuXHRcdFx0bm90aWZ5OiBfKCdsZWFybmVkIHRvIG1ha2UgdGhlIG1vc3Qgb2YgZm9vZCcpXHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRvcHRpb25zOiB7XHJcblx0XHRzdGF0ZTogbnVsbCxcclxuXHRcdGRlYnVnOiB0cnVlLFxyXG5cdFx0bG9nOiB0cnVlLFxyXG5cdFx0ZHJvcGJveDogZmFsc2UsXHJcblx0XHRkb3VibGVUaW1lOiBmYWxzZVxyXG5cdH0sXHJcblxyXG5cdF9kZWJ1ZzogZmFsc2UsXHJcblx0XHRcclxuXHRpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHRcdHRoaXMuX2RlYnVnID0gdGhpcy5vcHRpb25zLmRlYnVnO1xyXG5cdFx0dGhpcy5fbG9nID0gdGhpcy5vcHRpb25zLmxvZztcclxuXHRcdFxyXG5cdFx0Ly8gQ2hlY2sgZm9yIEhUTUw1IHN1cHBvcnRcclxuXHRcdGlmKCFFbmdpbmUuYnJvd3NlclZhbGlkKCkpIHtcclxuXHRcdFx0d2luZG93LmxvY2F0aW9uID0gJ2Jyb3dzZXJXYXJuaW5nLmh0bWwnO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBDaGVjayBmb3IgbW9iaWxlXHJcblx0XHRpZihFbmdpbmUuaXNNb2JpbGUoKSkge1xyXG5cdFx0XHR3aW5kb3cubG9jYXRpb24gPSAnbW9iaWxlV2FybmluZy5odG1sJztcclxuXHRcdH1cclxuXHJcblx0XHRFbmdpbmUuZGlzYWJsZVNlbGVjdGlvbigpO1xyXG5cdFx0XHJcblx0XHRpZih0aGlzLm9wdGlvbnMuc3RhdGUgIT0gbnVsbCkge1xyXG5cdFx0XHR3aW5kb3cuU3RhdGUgPSB0aGlzLm9wdGlvbnMuc3RhdGU7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRFbmdpbmUubG9hZEdhbWUoKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdsb2NhdGlvblNsaWRlcicpLmFwcGVuZFRvKCcjbWFpbicpO1xyXG5cclxuXHRcdHZhciBtZW51ID0gJCgnPGRpdj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21lbnUnKVxyXG5cdFx0XHQuYXBwZW5kVG8oJ2JvZHknKTtcclxuXHJcblx0XHRpZih0eXBlb2YgbGFuZ3MgIT0gJ3VuZGVmaW5lZCcpe1xyXG5cdFx0XHR2YXIgY3VzdG9tU2VsZWN0ID0gJCgnPHNwYW4+JylcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ2N1c3RvbVNlbGVjdCcpXHJcblx0XHRcdFx0LmFkZENsYXNzKCdtZW51QnRuJylcclxuXHRcdFx0XHQuYXBwZW5kVG8obWVudSk7XHJcblx0XHRcdHZhciBzZWxlY3RPcHRpb25zID0gJCgnPHNwYW4+JylcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ2N1c3RvbVNlbGVjdE9wdGlvbnMnKVxyXG5cdFx0XHRcdC5hcHBlbmRUbyhjdXN0b21TZWxlY3QpO1xyXG5cdFx0XHR2YXIgb3B0aW9uc0xpc3QgPSAkKCc8dWw+JylcclxuXHRcdFx0XHQuYXBwZW5kVG8oc2VsZWN0T3B0aW9ucyk7XHJcblx0XHRcdCQoJzxsaT4nKVxyXG5cdFx0XHRcdC50ZXh0KFwibGFuZ3VhZ2UuXCIpXHJcblx0XHRcdFx0LmFwcGVuZFRvKG9wdGlvbnNMaXN0KTtcclxuXHRcdFx0XHJcblx0XHRcdCQuZWFjaChsYW5ncywgZnVuY3Rpb24obmFtZSxkaXNwbGF5KXtcclxuXHRcdFx0XHQkKCc8bGk+JylcclxuXHRcdFx0XHRcdC50ZXh0KGRpc3BsYXkpXHJcblx0XHRcdFx0XHQuYXR0cignZGF0YS1sYW5ndWFnZScsIG5hbWUpXHJcblx0XHRcdFx0XHQub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHsgRW5naW5lLnN3aXRjaExhbmd1YWdlKHRoaXMpOyB9KVxyXG5cdFx0XHRcdFx0LmFwcGVuZFRvKG9wdGlvbnNMaXN0KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0JCgnPHNwYW4+JylcclxuXHRcdFx0LmFkZENsYXNzKCdsaWdodHNPZmYgbWVudUJ0bicpXHJcblx0XHRcdC50ZXh0KF8oJ2xpZ2h0cyBvZmYuJykpXHJcblx0XHRcdC5jbGljayhFbmdpbmUudHVybkxpZ2h0c09mZilcclxuXHRcdFx0LmFwcGVuZFRvKG1lbnUpO1xyXG5cclxuXHRcdCQoJzxzcGFuPicpXHJcblx0XHRcdC5hZGRDbGFzcygnbWVudUJ0bicpXHJcblx0XHRcdC50ZXh0KF8oJ2h5cGVyLicpKVxyXG5cdFx0XHQuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRFbmdpbmUub3B0aW9ucy5kb3VibGVUaW1lID0gIUVuZ2luZS5vcHRpb25zLmRvdWJsZVRpbWU7XHJcblx0XHRcdFx0aWYoRW5naW5lLm9wdGlvbnMuZG91YmxlVGltZSlcclxuXHRcdFx0XHRcdCQodGhpcykudGV4dChfKCdjbGFzc2ljLicpKTtcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHQkKHRoaXMpLnRleHQoXygnaHlwZXIuJykpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQuYXBwZW5kVG8obWVudSk7XHJcblxyXG5cdFx0JCgnPHNwYW4+JylcclxuXHRcdFx0LmFkZENsYXNzKCdtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygncmVzdGFydC4nKSlcclxuXHRcdFx0LmNsaWNrKEVuZ2luZS5jb25maXJtRGVsZXRlKVxyXG5cdFx0XHQuYXBwZW5kVG8obWVudSk7XHJcblx0XHRcclxuXHRcdCQoJzxzcGFuPicpXHJcblx0XHRcdC5hZGRDbGFzcygnbWVudUJ0bicpXHJcblx0XHRcdC50ZXh0KF8oJ3NoYXJlLicpKVxyXG5cdFx0XHQuY2xpY2soRW5naW5lLnNoYXJlKVxyXG5cdFx0XHQuYXBwZW5kVG8obWVudSk7XHJcblxyXG5cdFx0JCgnPHNwYW4+JylcclxuXHRcdFx0LmFkZENsYXNzKCdtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygnc2F2ZS4nKSlcclxuXHRcdFx0LmNsaWNrKEVuZ2luZS5leHBvcnRJbXBvcnQpXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHRcclxuXHRcdC8vIHN1YnNjcmliZSB0byBzdGF0ZVVwZGF0ZXNcclxuXHRcdCQuRGlzcGF0Y2goJ3N0YXRlVXBkYXRlJykuc3Vic2NyaWJlKEVuZ2luZS5oYW5kbGVTdGF0ZVVwZGF0ZXMpO1xyXG5cclxuXHRcdCRTTS5pbml0KCk7XHJcblx0XHROb3RpZmljYXRpb25zLmluaXQoKTtcclxuXHRcdEV2ZW50cy5pbml0KCk7XHJcblx0XHRWaWxsYWdlLmluaXQoKTtcclxuXHRcdENoYXJhY3Rlci5pbml0KCk7XHJcblx0XHRXZWF0aGVyLmluaXQoKTtcclxuXHRcdGlmKCRTTS5nZXQoJ3JvYWQub3BlbicpKSB7XHJcblx0XHRcdFJvYWQuaW5pdCgpO1xyXG5cdFx0fVxyXG5cdFx0aWYoJFNNLmdldCgnb3V0cG9zdC5vcGVuJykpIHtcclxuXHRcdFx0T3V0cG9zdC5pbml0KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0RW5naW5lLnNhdmVMYW5ndWFnZSgpO1xyXG5cdFx0RW5naW5lLnRyYXZlbFRvKFZpbGxhZ2UpO1xyXG5cclxuXHR9LFxyXG5cdFxyXG5cdGJyb3dzZXJWYWxpZDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKCBsb2NhdGlvbi5zZWFyY2guaW5kZXhPZiggJ2lnbm9yZWJyb3dzZXI9dHJ1ZScgKSA+PSAwIHx8ICggdHlwZW9mIFN0b3JhZ2UgIT0gJ3VuZGVmaW5lZCcgJiYgIW9sZElFICkgKTtcclxuXHR9LFxyXG5cdFxyXG5cdGlzTW9iaWxlOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAoIGxvY2F0aW9uLnNlYXJjaC5pbmRleE9mKCAnaWdub3JlYnJvd3Nlcj10cnVlJyApIDwgMCAmJiAvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnkvaS50ZXN0KCBuYXZpZ2F0b3IudXNlckFnZW50ICkgKTtcclxuXHR9LFxyXG5cdFxyXG5cdHNhdmVHYW1lOiBmdW5jdGlvbigpIHtcclxuXHRcdGlmKHR5cGVvZiBTdG9yYWdlICE9ICd1bmRlZmluZWQnICYmIGxvY2FsU3RvcmFnZSkge1xyXG5cdFx0XHRpZihFbmdpbmUuX3NhdmVUaW1lciAhPSBudWxsKSB7XHJcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KEVuZ2luZS5fc2F2ZVRpbWVyKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih0eXBlb2YgRW5naW5lLl9sYXN0Tm90aWZ5ID09ICd1bmRlZmluZWQnIHx8IERhdGUubm93KCkgLSBFbmdpbmUuX2xhc3ROb3RpZnkgPiBFbmdpbmUuU0FWRV9ESVNQTEFZKXtcclxuXHRcdFx0XHQkKCcjc2F2ZU5vdGlmeScpLmNzcygnb3BhY2l0eScsIDEpLmFuaW1hdGUoe29wYWNpdHk6IDB9LCAxMDAwLCAnbGluZWFyJyk7XHJcblx0XHRcdFx0RW5naW5lLl9sYXN0Tm90aWZ5ID0gRGF0ZS5ub3coKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRsb2NhbFN0b3JhZ2UuZ2FtZVN0YXRlID0gSlNPTi5zdHJpbmdpZnkoU3RhdGUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0bG9hZEdhbWU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dmFyIHNhdmVkU3RhdGUgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nYW1lU3RhdGUpO1xyXG5cdFx0XHRpZihzYXZlZFN0YXRlKSB7XHJcblx0XHRcdFx0d2luZG93LlN0YXRlID0gc2F2ZWRTdGF0ZTtcclxuXHRcdFx0XHRFbmdpbmUubG9nKFwibG9hZGVkIHNhdmUhXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGNhdGNoKGUpIHtcclxuXHRcdFx0RW5naW5lLmxvZyhlKTtcclxuXHRcdFx0d2luZG93LlN0YXRlID0ge307XHJcblx0XHRcdCRTTS5zZXQoJ3ZlcnNpb24nLCBFbmdpbmUuVkVSU0lPTik7XHJcblx0XHRcdEVuZ2luZS5ldmVudCgncHJvZ3Jlc3MnLCAnbmV3IGdhbWUnKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGV4cG9ydEltcG9ydDogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdFeHBvcnQgLyBJbXBvcnQnKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnZXhwb3J0IG9yIGltcG9ydCBzYXZlIGRhdGEsIGZvciBiYWNraW5nIHVwJyksXHJcblx0XHRcdFx0XHRcdF8oJ29yIG1pZ3JhdGluZyBjb21wdXRlcnMnKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2V4cG9ydCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdleHBvcnQnKSxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogRW5naW5lLmV4cG9ydDY0XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdpbXBvcnQnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnaW1wb3J0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2NvbmZpcm0nfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnY2FuY2VsJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2NhbmNlbCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J2NvbmZpcm0nOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ2FyZSB5b3Ugc3VyZT8nKSxcclxuXHRcdFx0XHRcdFx0XygnaWYgdGhlIGNvZGUgaXMgaW52YWxpZCwgYWxsIGRhdGEgd2lsbCBiZSBsb3N0LicpLFxyXG5cdFx0XHRcdFx0XHRfKCd0aGlzIGlzIGlycmV2ZXJzaWJsZS4nKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J3llcyc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCd5ZXMnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnaW5wdXRJbXBvcnQnfSxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogRW5naW5lLmVuYWJsZVNlbGVjdGlvblxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnbm8nOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnbm8nKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdpbnB1dEltcG9ydCc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtfKCdwdXQgdGhlIHNhdmUgY29kZSBoZXJlLicpXSxcclxuXHRcdFx0XHRcdHRleHRhcmVhOiAnJyxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J29rYXknOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnaW1wb3J0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogRW5naW5lLmltcG9ydDY0XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdjYW5jZWwnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnY2FuY2VsJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRnZW5lcmF0ZUV4cG9ydDY0OiBmdW5jdGlvbigpe1xyXG5cdFx0dmFyIHN0cmluZzY0ID0gQmFzZTY0LmVuY29kZShsb2NhbFN0b3JhZ2UuZ2FtZVN0YXRlKTtcclxuXHRcdHN0cmluZzY0ID0gc3RyaW5nNjQucmVwbGFjZSgvXFxzL2csICcnKTtcclxuXHRcdHN0cmluZzY0ID0gc3RyaW5nNjQucmVwbGFjZSgvXFwuL2csICcnKTtcclxuXHRcdHN0cmluZzY0ID0gc3RyaW5nNjQucmVwbGFjZSgvXFxuL2csICcnKTtcclxuXHJcblx0XHRyZXR1cm4gc3RyaW5nNjQ7XHJcblx0fSxcclxuXHJcblx0ZXhwb3J0NjQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RW5naW5lLnNhdmVHYW1lKCk7XHJcblx0XHR2YXIgc3RyaW5nNjQgPSBFbmdpbmUuZ2VuZXJhdGVFeHBvcnQ2NCgpO1xyXG5cdFx0RW5naW5lLmVuYWJsZVNlbGVjdGlvbigpO1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnRXhwb3J0JyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXygnc2F2ZSB0aGlzLicpXSxcclxuXHRcdFx0XHRcdHRleHRhcmVhOiBzdHJpbmc2NCxcclxuXHRcdFx0XHRcdHJlYWRvbmx5OiB0cnVlLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnZG9uZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdnb3QgaXQnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBFbmdpbmUuZGlzYWJsZVNlbGVjdGlvblxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdEVuZ2luZS5hdXRvU2VsZWN0KCcjZGVzY3JpcHRpb24gdGV4dGFyZWEnKTtcclxuXHR9LFxyXG5cclxuXHRpbXBvcnQ2NDogZnVuY3Rpb24oc3RyaW5nNjQpIHtcclxuXHRcdEVuZ2luZS5kaXNhYmxlU2VsZWN0aW9uKCk7XHJcblx0XHRzdHJpbmc2NCA9IHN0cmluZzY0LnJlcGxhY2UoL1xccy9nLCAnJyk7XHJcblx0XHRzdHJpbmc2NCA9IHN0cmluZzY0LnJlcGxhY2UoL1xcLi9nLCAnJyk7XHJcblx0XHRzdHJpbmc2NCA9IHN0cmluZzY0LnJlcGxhY2UoL1xcbi9nLCAnJyk7XHJcblx0XHR2YXIgZGVjb2RlZFNhdmUgPSBCYXNlNjQuZGVjb2RlKHN0cmluZzY0KTtcclxuXHRcdGxvY2FsU3RvcmFnZS5nYW1lU3RhdGUgPSBkZWNvZGVkU2F2ZTtcclxuXHRcdGxvY2F0aW9uLnJlbG9hZCgpO1xyXG5cdH0sXHJcblxyXG5cdGV2ZW50OiBmdW5jdGlvbihjYXQsIGFjdCkge1xyXG5cdFx0aWYodHlwZW9mIGdhID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdGdhKCdzZW5kJywgJ2V2ZW50JywgY2F0LCBhY3QpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdGNvbmZpcm1EZWxldGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnUmVzdGFydD8nKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtfKCdyZXN0YXJ0IHRoZSBnYW1lPycpXSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J3llcyc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCd5ZXMnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBFbmdpbmUuZGVsZXRlU2F2ZVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnbm8nOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnbm8nKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGRlbGV0ZVNhdmU6IGZ1bmN0aW9uKG5vUmVsb2FkKSB7XHJcblx0XHRpZih0eXBlb2YgU3RvcmFnZSAhPSAndW5kZWZpbmVkJyAmJiBsb2NhbFN0b3JhZ2UpIHtcclxuXHRcdFx0d2luZG93LlN0YXRlID0ge307XHJcblx0XHRcdGxvY2FsU3RvcmFnZS5jbGVhcigpO1xyXG5cdFx0fVxyXG5cdFx0aWYoIW5vUmVsb2FkKSB7XHJcblx0XHRcdGxvY2F0aW9uLnJlbG9hZCgpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHNoYXJlOiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ1NoYXJlJyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXygnYnJpbmcgeW91ciBmcmllbmRzLicpXSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2ZhY2Vib29rJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2ZhY2Vib29rJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR3aW5kb3cub3BlbignaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL3NoYXJlci9zaGFyZXIucGhwP3U9JyArIEVuZ2luZS5TSVRFX1VSTCwgJ3NoYXJlcicsICd3aWR0aD02MjYsaGVpZ2h0PTQzNixsb2NhdGlvbj1ubyxtZW51YmFyPW5vLHJlc2l6YWJsZT1ubyxzY3JvbGxiYXJzPW5vLHN0YXR1cz1ubyx0b29sYmFyPW5vJyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnZ29vZ2xlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6XygnZ29vZ2xlKycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0d2luZG93Lm9wZW4oJ2h0dHBzOi8vcGx1cy5nb29nbGUuY29tL3NoYXJlP3VybD0nICsgRW5naW5lLlNJVEVfVVJMLCAnc2hhcmVyJywgJ3dpZHRoPTQ4MCxoZWlnaHQ9NDM2LGxvY2F0aW9uPW5vLG1lbnViYXI9bm8scmVzaXphYmxlPW5vLHNjcm9sbGJhcnM9bm8sc3RhdHVzPW5vLHRvb2xiYXI9bm8nKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCd0d2l0dGVyJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ3R3aXR0ZXInKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5vcGVuKCdodHRwczovL3R3aXR0ZXIuY29tL2ludGVudC90d2VldD90ZXh0PUElMjBEYXJrJTIwUm9vbSZ1cmw9JyArIEVuZ2luZS5TSVRFX1VSTCwgJ3NoYXJlcicsICd3aWR0aD02NjAsaGVpZ2h0PTI2MCxsb2NhdGlvbj1ubyxtZW51YmFyPW5vLHJlc2l6YWJsZT1ubyxzY3JvbGxiYXJzPXllcyxzdGF0dXM9bm8sdG9vbGJhcj1ubycpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J3JlZGRpdCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdyZWRkaXQnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5vcGVuKCdodHRwOi8vd3d3LnJlZGRpdC5jb20vc3VibWl0P3VybD0nICsgRW5naW5lLlNJVEVfVVJMLCAnc2hhcmVyJywgJ3dpZHRoPTk2MCxoZWlnaHQ9NzAwLGxvY2F0aW9uPW5vLG1lbnViYXI9bm8scmVzaXphYmxlPW5vLHNjcm9sbGJhcnM9eWVzLHN0YXR1cz1ubyx0b29sYmFyPW5vJyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnY2xvc2UnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnY2xvc2UnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdHdpZHRoOiAnNDAwcHgnXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRmaW5kU3R5bGVzaGVldDogZnVuY3Rpb24odGl0bGUpIHtcclxuXHRcdGZvcih2YXIgaT0wOyBpPGRvY3VtZW50LnN0eWxlU2hlZXRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBzaGVldCA9IGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldO1xyXG5cdFx0XHRpZihzaGVldC50aXRsZSA9PSB0aXRsZSkge1xyXG5cdFx0XHRcdHJldHVybiBzaGVldDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fSxcclxuXHJcblx0aXNMaWdodHNPZmY6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGRhcmtDc3MgPSBFbmdpbmUuZmluZFN0eWxlc2hlZXQoJ2RhcmtlbkxpZ2h0cycpO1xyXG5cdFx0aWYgKCBkYXJrQ3NzICE9IG51bGwgJiYgIWRhcmtDc3MuZGlzYWJsZWQgKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0sXHJcblxyXG5cdHR1cm5MaWdodHNPZmY6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGRhcmtDc3MgPSBFbmdpbmUuZmluZFN0eWxlc2hlZXQoJ2RhcmtlbkxpZ2h0cycpO1xyXG5cdFx0aWYgKGRhcmtDc3MgPT0gbnVsbCkge1xyXG5cdFx0XHQkKCdoZWFkJykuYXBwZW5kKCc8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cImNzcy9kYXJrLmNzc1wiIHR5cGU9XCJ0ZXh0L2Nzc1wiIHRpdGxlPVwiZGFya2VuTGlnaHRzXCIgLz4nKTtcclxuXHRcdFx0JCgnLmxpZ2h0c09mZicpLnRleHQoXygnbGlnaHRzIG9uLicpKTtcclxuXHRcdH0gZWxzZSBpZiAoZGFya0Nzcy5kaXNhYmxlZCkge1xyXG5cdFx0XHRkYXJrQ3NzLmRpc2FibGVkID0gZmFsc2U7XHJcblx0XHRcdCQoJy5saWdodHNPZmYnKS50ZXh0KF8oJ2xpZ2h0cyBvbi4nKSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKFwiI2RhcmtlbkxpZ2h0c1wiKS5hdHRyKFwiZGlzYWJsZWRcIiwgXCJkaXNhYmxlZFwiKTtcclxuXHRcdFx0ZGFya0Nzcy5kaXNhYmxlZCA9IHRydWU7XHJcblx0XHRcdCQoJy5saWdodHNPZmYnKS50ZXh0KF8oJ2xpZ2h0cyBvZmYuJykpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8vIEdldHMgYSBndWlkXHJcblx0Z2V0R3VpZDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbihjKSB7XHJcblx0XHRcdHZhciByID0gTWF0aC5yYW5kb20oKSoxNnwwLCB2ID0gYyA9PSAneCcgPyByIDogKHImMHgzfDB4OCk7XHJcblx0XHRcdHJldHVybiB2LnRvU3RyaW5nKDE2KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGFjdGl2ZU1vZHVsZTogbnVsbCxcclxuXHJcblx0dHJhdmVsVG86IGZ1bmN0aW9uKG1vZHVsZSkge1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZSAhPSBtb2R1bGUpIHtcclxuXHRcdFx0dmFyIGN1cnJlbnRJbmRleCA9IEVuZ2luZS5hY3RpdmVNb2R1bGUgPyAkKCcubG9jYXRpb24nKS5pbmRleChFbmdpbmUuYWN0aXZlTW9kdWxlLnBhbmVsKSA6IDE7XHJcblx0XHRcdCQoJ2Rpdi5oZWFkZXJCdXR0b24nKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcclxuXHRcdFx0bW9kdWxlLnRhYi5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcclxuXHJcblx0XHRcdHZhciBzbGlkZXIgPSAkKCcjbG9jYXRpb25TbGlkZXInKTtcclxuXHRcdFx0dmFyIHN0b3JlcyA9ICQoJyNzdG9yZXNDb250YWluZXInKTtcclxuXHRcdFx0dmFyIHBhbmVsSW5kZXggPSAkKCcubG9jYXRpb24nKS5pbmRleChtb2R1bGUucGFuZWwpO1xyXG5cdFx0XHR2YXIgZGlmZiA9IE1hdGguYWJzKHBhbmVsSW5kZXggLSBjdXJyZW50SW5kZXgpO1xyXG5cdFx0XHRzbGlkZXIuYW5pbWF0ZSh7bGVmdDogLShwYW5lbEluZGV4ICogNzAwKSArICdweCd9LCAzMDAgKiBkaWZmKTtcclxuXHJcblx0XHRcdGlmKCRTTS5nZXQoJ3N0b3Jlcy53b29kJykgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHQvLyBGSVhNRSBXaHkgZG9lcyB0aGlzIHdvcmsgaWYgdGhlcmUncyBhbiBhbmltYXRpb24gcXVldWUuLi4/XHJcblx0XHRcdFx0c3RvcmVzLmFuaW1hdGUoe3JpZ2h0OiAtKHBhbmVsSW5kZXggKiA3MDApICsgJ3B4J30sIDMwMCAqIGRpZmYpO1xyXG5cdFx0XHR9XHJcblx0XHRcclxuXHRcdFx0RW5naW5lLmFjdGl2ZU1vZHVsZSA9IG1vZHVsZTtcclxuXHJcblx0XHRcdG1vZHVsZS5vbkFycml2YWwoZGlmZik7XHJcblxyXG5cdFx0XHRpZihFbmdpbmUuYWN0aXZlTW9kdWxlID09IFZpbGxhZ2VcclxuXHRcdFx0XHQvLyAgfHwgRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSBQYXRoXHJcblx0XHRcdFx0KSB7XHJcblx0XHRcdFx0Ly8gRG9uJ3QgZmFkZSBvdXQgdGhlIHdlYXBvbnMgaWYgd2UncmUgc3dpdGNoaW5nIHRvIGEgbW9kdWxlXHJcblx0XHRcdFx0Ly8gd2hlcmUgd2UncmUgZ29pbmcgdG8ga2VlcCBzaG93aW5nIHRoZW0gYW55d2F5LlxyXG5cdFx0XHRcdGlmIChtb2R1bGUgIT0gVmlsbGFnZSBcclxuXHRcdFx0XHRcdC8vICYmIG1vZHVsZSAhPSBQYXRoXHJcblx0XHRcdFx0KSB7XHJcblx0XHRcdFx0XHQkKCdkaXYjd2VhcG9ucycpLmFuaW1hdGUoe29wYWNpdHk6IDB9LCAzMDApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYobW9kdWxlID09IFZpbGxhZ2VcclxuXHRcdFx0XHQvLyAgfHwgbW9kdWxlID09IFBhdGhcclxuXHRcdFx0XHQpIHtcclxuXHRcdFx0XHQkKCdkaXYjd2VhcG9ucycpLmFuaW1hdGUoe29wYWNpdHk6IDF9LCAzMDApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHROb3RpZmljYXRpb25zLnByaW50UXVldWUobW9kdWxlKTtcclxuXHRcdFxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8qIE1vdmUgdGhlIHN0b3JlcyBwYW5lbCBiZW5lYXRoIHRvcF9jb250YWluZXIgKG9yIHRvIHRvcDogMHB4IGlmIHRvcF9jb250YWluZXJcclxuXHRcdCogZWl0aGVyIGhhc24ndCBiZWVuIGZpbGxlZCBpbiBvciBpcyBudWxsKSB1c2luZyB0cmFuc2l0aW9uX2RpZmYgdG8gc3luYyB3aXRoXHJcblx0XHQqIHRoZSBhbmltYXRpb24gaW4gRW5naW5lLnRyYXZlbFRvKCkuXHJcblx0XHQqL1xyXG5cdG1vdmVTdG9yZXNWaWV3OiBmdW5jdGlvbih0b3BfY29udGFpbmVyLCB0cmFuc2l0aW9uX2RpZmYpIHtcclxuXHRcdHZhciBzdG9yZXMgPSAkKCcjc3RvcmVzQ29udGFpbmVyJyk7XHJcblxyXG5cdFx0Ly8gSWYgd2UgZG9uJ3QgaGF2ZSBhIHN0b3Jlc0NvbnRhaW5lciB5ZXQsIGxlYXZlLlxyXG5cdFx0aWYodHlwZW9mKHN0b3JlcykgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XHJcblxyXG5cdFx0aWYodHlwZW9mKHRyYW5zaXRpb25fZGlmZikgPT09ICd1bmRlZmluZWQnKSB0cmFuc2l0aW9uX2RpZmYgPSAxO1xyXG5cclxuXHRcdGlmKHRvcF9jb250YWluZXIgPT09IG51bGwpIHtcclxuXHRcdFx0c3RvcmVzLmFuaW1hdGUoe3RvcDogJzBweCd9LCB7cXVldWU6IGZhbHNlLCBkdXJhdGlvbjogMzAwICogdHJhbnNpdGlvbl9kaWZmfSk7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmKCF0b3BfY29udGFpbmVyLmxlbmd0aCkge1xyXG5cdFx0XHRzdG9yZXMuYW5pbWF0ZSh7dG9wOiAnMHB4J30sIHtxdWV1ZTogZmFsc2UsIGR1cmF0aW9uOiAzMDAgKiB0cmFuc2l0aW9uX2RpZmZ9KTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRzdG9yZXMuYW5pbWF0ZSh7XHJcblx0XHRcdFx0XHR0b3A6IHRvcF9jb250YWluZXIuaGVpZ2h0KCkgKyAyNiArICdweCdcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHF1ZXVlOiBmYWxzZSwgXHJcblx0XHRcdFx0XHRkdXJhdGlvbjogMzAwICogdHJhbnNpdGlvbl9kaWZmXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdGxvZzogZnVuY3Rpb24obXNnKSB7XHJcblx0XHRpZih0aGlzLl9sb2cpIHtcclxuXHRcdFx0Y29uc29sZS5sb2cobXNnKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHR1cGRhdGVTbGlkZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHNsaWRlciA9ICQoJyNsb2NhdGlvblNsaWRlcicpO1xyXG5cdFx0c2xpZGVyLndpZHRoKChzbGlkZXIuY2hpbGRyZW4oKS5sZW5ndGggKiA3MDApICsgJ3B4Jyk7XHJcblx0fSxcclxuXHJcblx0dXBkYXRlT3V0ZXJTbGlkZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHNsaWRlciA9ICQoJyNvdXRlclNsaWRlcicpO1xyXG5cdFx0c2xpZGVyLndpZHRoKChzbGlkZXIuY2hpbGRyZW4oKS5sZW5ndGggKiA3MDApICsgJ3B4Jyk7XHJcblx0fSxcclxuXHJcblx0Z2V0SW5jb21lTXNnOiBmdW5jdGlvbihudW0sIGRlbGF5KSB7XHJcblx0XHRyZXR1cm4gXyhcInswfSBwZXIgezF9c1wiLCAobnVtID4gMCA/IFwiK1wiIDogXCJcIikgKyBudW0sIGRlbGF5KTtcclxuXHR9LFxyXG5cclxuXHRzd2lwZUxlZnQ6IGZ1bmN0aW9uKGUpIHtcclxuXHRcdGlmKEVuZ2luZS5hY3RpdmVNb2R1bGUuc3dpcGVMZWZ0KSB7XHJcblx0XHRcdEVuZ2luZS5hY3RpdmVNb2R1bGUuc3dpcGVMZWZ0KGUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHN3aXBlUmlnaHQ6IGZ1bmN0aW9uKGUpIHtcclxuXHRcdGlmKEVuZ2luZS5hY3RpdmVNb2R1bGUuc3dpcGVSaWdodCkge1xyXG5cdFx0XHRFbmdpbmUuYWN0aXZlTW9kdWxlLnN3aXBlUmlnaHQoZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0c3dpcGVVcDogZnVuY3Rpb24oZSkge1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZS5zd2lwZVVwKSB7XHJcblx0XHRcdEVuZ2luZS5hY3RpdmVNb2R1bGUuc3dpcGVVcChlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRzd2lwZURvd246IGZ1bmN0aW9uKGUpIHtcclxuXHRcdGlmKEVuZ2luZS5hY3RpdmVNb2R1bGUuc3dpcGVEb3duKSB7XHJcblx0XHRcdEVuZ2luZS5hY3RpdmVNb2R1bGUuc3dpcGVEb3duKGUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdGRpc2FibGVTZWxlY3Rpb246IGZ1bmN0aW9uKCkge1xyXG5cdFx0ZG9jdW1lbnQub25zZWxlY3RzdGFydCA9IGV2ZW50TnVsbGlmaWVyOyAvLyB0aGlzIGlzIGZvciBJRVxyXG5cdFx0ZG9jdW1lbnQub25tb3VzZWRvd24gPSBldmVudE51bGxpZmllcjsgLy8gdGhpcyBpcyBmb3IgdGhlIHJlc3RcclxuXHR9LFxyXG5cclxuXHRlbmFibGVTZWxlY3Rpb246IGZ1bmN0aW9uKCkge1xyXG5cdFx0ZG9jdW1lbnQub25zZWxlY3RzdGFydCA9IGV2ZW50UGFzc3Rocm91Z2g7XHJcblx0XHRkb2N1bWVudC5vbm1vdXNlZG93biA9IGV2ZW50UGFzc3Rocm91Z2g7XHJcblx0fSxcclxuXHJcblx0YXV0b1NlbGVjdDogZnVuY3Rpb24oc2VsZWN0b3IpIHtcclxuXHRcdCQoc2VsZWN0b3IpLmZvY3VzKCkuc2VsZWN0KCk7XHJcblx0fSxcclxuXHJcblx0aGFuZGxlU3RhdGVVcGRhdGVzOiBmdW5jdGlvbihlKXtcclxuXHRcclxuXHR9LFxyXG5cclxuXHRzd2l0Y2hMYW5ndWFnZTogZnVuY3Rpb24oZG9tKXtcclxuXHRcdHZhciBsYW5nID0gJChkb20pLmRhdGEoXCJsYW5ndWFnZVwiKTtcclxuXHRcdGlmKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYuc2VhcmNoKC9bXFw/XFwmXWxhbmc9W2Etel9dKy8pICE9IC0xKXtcclxuXHRcdFx0ZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IGRvY3VtZW50LmxvY2F0aW9uLmhyZWYucmVwbGFjZSggLyhbXFw/XFwmXWxhbmc9KShbYS16X10rKS9naSAsIFwiJDFcIitsYW5nICk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0ZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgKyAoIChkb2N1bWVudC5sb2NhdGlvbi5ocmVmLnNlYXJjaCgvXFw/LykgIT0gLTEgKT9cIiZcIjpcIj9cIikgKyBcImxhbmc9XCIrbGFuZztcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRzYXZlTGFuZ3VhZ2U6IGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgbGFuZyA9IGRlY29kZVVSSUNvbXBvbmVudCgobmV3IFJlZ0V4cCgnWz98Jl1sYW5nPScgKyAnKFteJjtdKz8pKCZ8I3w7fCQpJykuZXhlYyhsb2NhdGlvbi5zZWFyY2gpfHxbLFwiXCJdKVsxXS5yZXBsYWNlKC9cXCsvZywgJyUyMCcpKXx8bnVsbDtcdFxyXG5cdFx0aWYobGFuZyAmJiB0eXBlb2YgU3RvcmFnZSAhPSAndW5kZWZpbmVkJyAmJiBsb2NhbFN0b3JhZ2UpIHtcclxuXHRcdFx0bG9jYWxTdG9yYWdlLmxhbmcgPSBsYW5nO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHNldFRpbWVvdXQ6IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aW1lb3V0LCBza2lwRG91YmxlPyl7XHJcblxyXG5cdFx0aWYoIEVuZ2luZS5vcHRpb25zLmRvdWJsZVRpbWUgJiYgIXNraXBEb3VibGUgKXtcclxuXHRcdFx0RW5naW5lLmxvZygnRG91YmxlIHRpbWUsIGN1dHRpbmcgdGltZW91dCBpbiBoYWxmJyk7XHJcblx0XHRcdHRpbWVvdXQgLz0gMjtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gc2V0VGltZW91dChjYWxsYmFjaywgdGltZW91dCk7XHJcblxyXG5cdH1cclxuXHJcbn07XHJcblxyXG5mdW5jdGlvbiBldmVudE51bGxpZmllcihlKSB7XHJcblx0cmV0dXJuICQoZS50YXJnZXQpLmhhc0NsYXNzKCdtZW51QnRuJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGV2ZW50UGFzc3Rocm91Z2goZSkge1xyXG5cdHJldHVybiB0cnVlO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gaW5WaWV3KGRpciwgZWxlbSl7XHJcblxyXG4gICAgICAgIHZhciBzY1RvcCA9ICQoJyNtYWluJykub2Zmc2V0KCkudG9wO1xyXG4gICAgICAgIHZhciBzY0JvdCA9IHNjVG9wICsgJCgnI21haW4nKS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgdmFyIGVsVG9wID0gZWxlbS5vZmZzZXQoKS50b3A7XHJcbiAgICAgICAgdmFyIGVsQm90ID0gZWxUb3AgKyBlbGVtLmhlaWdodCgpO1xyXG5cclxuICAgICAgICBpZiggZGlyID09ICd1cCcgKXtcclxuICAgICAgICAgICAgICAgIC8vIFNUT1AgTU9WSU5HIElGIEJPVFRPTSBPRiBFTEVNRU5UIElTIFZJU0lCTEUgSU4gU0NSRUVOXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKCBlbEJvdCA8IHNjQm90ICk7XHJcbiAgICAgICAgfWVsc2UgaWYoIGRpciA9PSAnZG93bicgKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoIGVsVG9wID4gc2NUb3AgKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoICggZWxCb3QgPD0gc2NCb3QgKSAmJiAoIGVsVG9wID49IHNjVG9wICkgKTtcclxuICAgICAgICB9XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBzY3JvbGxCeVgoZWxlbSwgeCl7XHJcblxyXG4gICAgICAgIHZhciBlbFRvcCA9IHBhcnNlSW50KCBlbGVtLmNzcygndG9wJyksIDEwICk7XHJcbiAgICAgICAgZWxlbS5jc3MoICd0b3AnLCAoIGVsVG9wICsgeCApICsgXCJweFwiICk7XHJcblxyXG59XHJcblxyXG5cclxuLy9jcmVhdGUgalF1ZXJ5IENhbGxiYWNrcygpIHRvIGhhbmRsZSBvYmplY3QgZXZlbnRzIFxyXG4kLkRpc3BhdGNoID0gZnVuY3Rpb24oIGlkICkge1xyXG5cdHZhciBjYWxsYmFja3MsIHRvcGljID0gaWQgJiYgRW5naW5lLnRvcGljc1sgaWQgXTtcclxuXHRpZiAoICF0b3BpYyApIHtcclxuXHRcdGNhbGxiYWNrcyA9IGpRdWVyeS5DYWxsYmFja3MoKTtcclxuXHRcdHRvcGljID0ge1xyXG5cdFx0XHRcdHB1Ymxpc2g6IGNhbGxiYWNrcy5maXJlLFxyXG5cdFx0XHRcdHN1YnNjcmliZTogY2FsbGJhY2tzLmFkZCxcclxuXHRcdFx0XHR1bnN1YnNjcmliZTogY2FsbGJhY2tzLnJlbW92ZVxyXG5cdFx0fTtcclxuXHRcdGlmICggaWQgKSB7XHJcblx0XHRcdEVuZ2luZS50b3BpY3NbIGlkIF0gPSB0b3BpYztcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIHRvcGljO1xyXG59O1xyXG5cclxuJChmdW5jdGlvbigpIHtcclxuXHRFbmdpbmUuaW5pdCgpO1xyXG59KTtcclxuXHJcbiIsIi8qKlxyXG4gKiBNb2R1bGUgdGhhdCBoYW5kbGVzIHRoZSByYW5kb20gZXZlbnQgc3lzdGVtXHJcbiAqL1xyXG5pbXBvcnQgeyBFdmVudHNSb2FkV2FuZGVyIH0gZnJvbSBcIi4vZXZlbnRzL3JvYWR3YW5kZXJcIjtcclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4vZW5naW5lXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tIFwiLi9ub3RpZmljYXRpb25zXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuL0J1dHRvblwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBRFJFdmVudCB7XHJcblx0dGl0bGU6IHN0cmluZyxcclxuXHRpc0F2YWlsYWJsZT86IEZ1bmN0aW9uLFxyXG5cdGlzU3VwZXJMaWtlbHk/OiBGdW5jdGlvbixcclxuXHRzY2VuZXM6IHtcclxuXHRcdC8vIHR5cGUgdGhpcyBvdXQgYmV0dGVyIHVzaW5nIEluZGV4IFNpZ25hdHVyZXNcclxuXHRcdFtpZDogc3RyaW5nXTogU2NlbmVcclxuXHR9LFxyXG5cdGV2ZW50UGFuZWw/OiBhbnlcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTY2VuZSB7XHJcblx0c2VlbkZsYWc/OiBGdW5jdGlvbixcclxuXHRuZXh0U2NlbmU/OiBzdHJpbmcsXHJcblx0b25Mb2FkPzogRnVuY3Rpb24sXHJcblx0dGV4dDogQXJyYXk8c3RyaW5nPixcclxuXHRyZXdhcmQ/OiBhbnksXHJcblx0bm90aWZpY2F0aW9uPzogc3RyaW5nLFxyXG5cdGJsaW5rPzogYm9vbGVhbixcclxuXHRidXR0b25zOiB7XHJcblx0XHRbaWQ6IHN0cmluZ106IEV2ZW50QnV0dG9uXHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50QnV0dG9uIHtcclxuXHR0ZXh0OiBzdHJpbmcsXHJcblx0bmV4dFNjZW5lOiB7XHJcblx0XHRbaWQ6IG51bWJlcl06IHN0cmluZ1xyXG5cdH0sXHJcblx0YXZhaWxhYmxlPzogRnVuY3Rpb24sXHJcblx0dmlzaWJsZT86IEZ1bmN0aW9uLFxyXG5cdHJld2FyZD86IGFueSxcclxuXHRjb3N0PzogYW55LFxyXG5cdG5vdGlmaWNhdGlvbj86IHN0cmluZyxcclxuXHRvbkNob29zZT86IEZ1bmN0aW9uXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBFdmVudHMgPSB7XHJcblx0XHRcclxuXHRfRVZFTlRfVElNRV9SQU5HRTogWzMsIDZdLCAvLyByYW5nZSwgaW4gbWludXRlc1xyXG5cdF9QQU5FTF9GQURFOiAyMDAsXHJcblx0X0ZJR0hUX1NQRUVEOiAxMDAsXHJcblx0X0VBVF9DT09MRE9XTjogNSxcclxuXHRfTUVEU19DT09MRE9XTjogNyxcclxuXHRfTEVBVkVfQ09PTERPV046IDEsXHJcblx0U1RVTl9EVVJBVElPTjogNDAwMCxcclxuXHRCTElOS19JTlRFUlZBTDogZmFsc2UsXHJcblxyXG5cdEV2ZW50UG9vbDogPGFueT5bXSxcclxuXHRldmVudFN0YWNrOiA8YW55PltdLFxyXG5cdF9ldmVudFRpbWVvdXQ6IDAsXHJcblxyXG5cdExvY2F0aW9uczoge30sXHJcblxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdFx0XHJcblx0XHQvLyBCdWlsZCB0aGUgRXZlbnQgUG9vbFxyXG5cdFx0RXZlbnRzLkV2ZW50UG9vbCA9IFtdLmNvbmNhdChcclxuXHRcdFx0RXZlbnRzUm9hZFdhbmRlciBhcyBhbnlcclxuXHRcdCk7XHJcblxyXG5cdFx0dGhpcy5Mb2NhdGlvbnNbXCJSb2FkV2FuZGVyXCJdID0gRXZlbnRzUm9hZFdhbmRlcjtcclxuXHRcdFxyXG5cdFx0RXZlbnRzLmV2ZW50U3RhY2sgPSBbXTtcclxuXHRcdFxyXG5cdFx0Ly9zdWJzY3JpYmUgdG8gc3RhdGVVcGRhdGVzXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHQkLkRpc3BhdGNoKCdzdGF0ZVVwZGF0ZScpLnN1YnNjcmliZShFdmVudHMuaGFuZGxlU3RhdGVVcGRhdGVzKTtcclxuXHR9LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHt9LCAvLyBOb3RoaW5nIGZvciBub3dcclxuICAgIFxyXG5cdGFjdGl2ZVNjZW5lOiAnJyxcclxuICAgIFxyXG5cdGxvYWRTY2VuZTogZnVuY3Rpb24obmFtZSkge1xyXG5cdFx0RW5naW5lLmxvZygnbG9hZGluZyBzY2VuZTogJyArIG5hbWUpO1xyXG5cdFx0RXZlbnRzLmFjdGl2ZVNjZW5lID0gbmFtZTtcclxuXHRcdHZhciBzY2VuZSA9IEV2ZW50cy5hY3RpdmVFdmVudCgpPy5zY2VuZXNbbmFtZV07XHJcblx0XHRcclxuXHRcdC8vIGhhbmRsZXMgb25lLXRpbWUgc2NlbmVzLCBzdWNoIGFzIGludHJvZHVjdGlvbnNcclxuXHRcdC8vIG1heWJlIEkgY2FuIG1ha2UgYSBtb3JlIGV4cGxpY2l0IFwiaW50cm9kdWN0aW9uXCIgbG9naWNhbCBmbG93IHRvIG1ha2UgdGhpc1xyXG5cdFx0Ly8gYSBsaXR0bGUgbW9yZSBlbGVnYW50LCBnaXZlbiB0aGF0IHRoZXJlIHdpbGwgYWx3YXlzIGJlIGFuIFwiaW50cm9kdWN0aW9uXCIgc2NlbmVcclxuXHRcdC8vIHRoYXQncyBvbmx5IG1lYW50IHRvIGJlIHJ1biBhIHNpbmdsZSB0aW1lLlxyXG5cdFx0aWYgKHNjZW5lLnNlZW5GbGFnICYmIHNjZW5lLnNlZW5GbGFnKCkpIHtcclxuXHRcdFx0RXZlbnRzLmxvYWRTY2VuZShzY2VuZS5uZXh0U2NlbmUpXHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBTY2VuZSByZXdhcmRcclxuXHRcdGlmKHNjZW5lLnJld2FyZCkge1xyXG5cdFx0XHQkU00uYWRkTSgnc3RvcmVzJywgc2NlbmUucmV3YXJkKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gb25Mb2FkXHJcblx0XHRpZihzY2VuZS5vbkxvYWQpIHtcclxuXHRcdFx0c2NlbmUub25Mb2FkKCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIE5vdGlmeSB0aGUgc2NlbmUgY2hhbmdlXHJcblx0XHRpZihzY2VuZS5ub3RpZmljYXRpb24pIHtcclxuXHRcdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgc2NlbmUubm90aWZpY2F0aW9uKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0JCgnI2Rlc2NyaXB0aW9uJywgRXZlbnRzLmV2ZW50UGFuZWwoKSkuZW1wdHkoKTtcclxuXHRcdCQoJyNidXR0b25zJywgRXZlbnRzLmV2ZW50UGFuZWwoKSkuZW1wdHkoKTtcclxuXHRcdEV2ZW50cy5zdGFydFN0b3J5KHNjZW5lKTtcclxuXHR9LFxyXG5cdFxyXG5cdGRyYXdGbG9hdFRleHQ6IGZ1bmN0aW9uKHRleHQsIHBhcmVudCkge1xyXG5cdFx0JCgnPGRpdj4nKS50ZXh0KHRleHQpLmFkZENsYXNzKCdkYW1hZ2VUZXh0JykuYXBwZW5kVG8ocGFyZW50KS5hbmltYXRlKHtcclxuXHRcdFx0J2JvdHRvbSc6ICc1MHB4JyxcclxuXHRcdFx0J29wYWNpdHknOiAnMCdcclxuXHRcdH0sXHJcblx0XHQzMDAsXHJcblx0XHQnbGluZWFyJyxcclxuXHRcdGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZSgpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRcclxuXHRzdGFydFN0b3J5OiBmdW5jdGlvbihzY2VuZSkge1xyXG5cdFx0Ly8gV3JpdGUgdGhlIHRleHRcclxuXHRcdHZhciBkZXNjID0gJCgnI2Rlc2NyaXB0aW9uJywgRXZlbnRzLmV2ZW50UGFuZWwoKSk7XHJcblx0XHRmb3IodmFyIGkgaW4gc2NlbmUudGV4dCkge1xyXG5cdFx0XHQkKCc8ZGl2PicpLnRleHQoc2NlbmUudGV4dFtpXSkuYXBwZW5kVG8oZGVzYyk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmKHNjZW5lLnRleHRhcmVhICE9IG51bGwpIHtcclxuXHRcdFx0dmFyIHRhID0gJCgnPHRleHRhcmVhPicpLnZhbChzY2VuZS50ZXh0YXJlYSkuYXBwZW5kVG8oZGVzYyk7XHJcblx0XHRcdGlmKHNjZW5lLnJlYWRvbmx5KSB7XHJcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdHRhLmF0dHIoJ3JlYWRvbmx5JywgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gRHJhdyB0aGUgYnV0dG9uc1xyXG5cdFx0RXZlbnRzLmRyYXdCdXR0b25zKHNjZW5lKTtcclxuXHR9LFxyXG5cdFxyXG5cdGRyYXdCdXR0b25zOiBmdW5jdGlvbihzY2VuZSkge1xyXG5cdFx0dmFyIGJ0bnMgPSAkKCcjYnV0dG9ucycsIEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0Zm9yKHZhciBpZCBpbiBzY2VuZS5idXR0b25zKSB7XHJcblx0XHRcdHZhciBpbmZvID0gc2NlbmUuYnV0dG9uc1tpZF07XHJcblx0XHRcdFx0dmFyIGIgPSBcclxuXHRcdFx0XHQvL25ldyBcclxuXHRcdFx0XHRCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0XHRcdGlkOiBpZCxcclxuXHRcdFx0XHRcdHRleHQ6IGluZm8udGV4dCxcclxuXHRcdFx0XHRcdGNvc3Q6IGluZm8uY29zdCxcclxuXHRcdFx0XHRcdGNsaWNrOiBFdmVudHMuYnV0dG9uQ2xpY2ssXHJcblx0XHRcdFx0XHRjb29sZG93bjogaW5mby5jb29sZG93bixcclxuXHRcdFx0XHRcdGltYWdlOiBpbmZvLmltYWdlXHJcblx0XHRcdFx0fSkuYXBwZW5kVG8oYnRucyk7XHJcblx0XHRcdGlmKHR5cGVvZiBpbmZvLmF2YWlsYWJsZSA9PSAnZnVuY3Rpb24nICYmICFpbmZvLmF2YWlsYWJsZSgpKSB7XHJcblx0XHRcdFx0QnV0dG9uLnNldERpc2FibGVkKGIsIHRydWUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHR5cGVvZiBpbmZvLnZpc2libGUgPT0gJ2Z1bmN0aW9uJyAmJiAhaW5mby52aXNpYmxlKCkpIHtcclxuXHRcdFx0XHRiLmhpZGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih0eXBlb2YgaW5mby5jb29sZG93biA9PSAnbnVtYmVyJykge1xyXG5cdFx0XHRcdEJ1dHRvbi5jb29sZG93bihiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRFdmVudHMudXBkYXRlQnV0dG9ucygpO1xyXG5cdH0sXHJcblx0XHJcblx0dXBkYXRlQnV0dG9uczogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgYnRucyA9IEV2ZW50cy5hY3RpdmVFdmVudCgpPy5zY2VuZXNbRXZlbnRzLmFjdGl2ZVNjZW5lXS5idXR0b25zO1xyXG5cdFx0Zm9yKHZhciBiSWQgaW4gYnRucykge1xyXG5cdFx0XHR2YXIgYiA9IGJ0bnNbYklkXTtcclxuXHRcdFx0dmFyIGJ0bkVsID0gJCgnIycrYklkLCBFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdFx0aWYodHlwZW9mIGIuYXZhaWxhYmxlID09ICdmdW5jdGlvbicgJiYgIWIuYXZhaWxhYmxlKCkpIHtcclxuXHRcdFx0XHRCdXR0b24uc2V0RGlzYWJsZWQoYnRuRWwsIHRydWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRidXR0b25DbGljazogZnVuY3Rpb24oYnRuKSB7XHJcblx0XHR2YXIgaW5mbyA9IEV2ZW50cy5hY3RpdmVFdmVudCgpPy5zY2VuZXNbRXZlbnRzLmFjdGl2ZVNjZW5lXS5idXR0b25zW2J0bi5hdHRyKCdpZCcpXTtcclxuXHJcblx0XHRpZih0eXBlb2YgaW5mby5vbkNob29zZSA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdHZhciB0ZXh0YXJlYSA9IEV2ZW50cy5ldmVudFBhbmVsKCkuZmluZCgndGV4dGFyZWEnKTtcclxuXHRcdFx0aW5mby5vbkNob29zZSh0ZXh0YXJlYS5sZW5ndGggPiAwID8gdGV4dGFyZWEudmFsKCkgOiBudWxsKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gUmV3YXJkXHJcblx0XHRpZihpbmZvLnJld2FyZCkge1xyXG5cdFx0XHQkU00uYWRkTSgnc3RvcmVzJywgaW5mby5yZXdhcmQpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRFdmVudHMudXBkYXRlQnV0dG9ucygpO1xyXG5cdFx0XHJcblx0XHQvLyBOb3RpZmljYXRpb25cclxuXHRcdGlmKGluZm8ubm90aWZpY2F0aW9uKSB7XHJcblx0XHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIGluZm8ubm90aWZpY2F0aW9uKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gTmV4dCBTY2VuZVxyXG5cdFx0aWYoaW5mby5uZXh0U2NlbmUpIHtcclxuXHRcdFx0aWYoaW5mby5uZXh0U2NlbmUgPT0gJ2VuZCcpIHtcclxuXHRcdFx0XHRFdmVudHMuZW5kRXZlbnQoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR2YXIgciA9IE1hdGgucmFuZG9tKCk7XHJcblx0XHRcdFx0dmFyIGxvd2VzdE1hdGNoOiBudWxsIHwgc3RyaW5nID0gbnVsbDtcclxuXHRcdFx0XHRmb3IodmFyIGkgaW4gaW5mby5uZXh0U2NlbmUpIHtcclxuXHRcdFx0XHRcdGlmKHIgPCAoaSBhcyB1bmtub3duIGFzIG51bWJlcikgJiYgKGxvd2VzdE1hdGNoID09IG51bGwgfHwgaSA8IGxvd2VzdE1hdGNoKSkge1xyXG5cdFx0XHRcdFx0XHRsb3dlc3RNYXRjaCA9IGk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGxvd2VzdE1hdGNoICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdEV2ZW50cy5sb2FkU2NlbmUoaW5mby5uZXh0U2NlbmVbbG93ZXN0TWF0Y2hdKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0RW5naW5lLmxvZygnRVJST1I6IG5vIHN1aXRhYmxlIHNjZW5lIGZvdW5kJyk7XHJcblx0XHRcdFx0RXZlbnRzLmVuZEV2ZW50KCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHQvLyBibGlua3MgdGhlIGJyb3dzZXIgd2luZG93IHRpdGxlXHJcblx0YmxpbmtUaXRsZTogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdGl0bGUgPSBkb2N1bWVudC50aXRsZTtcclxuXHJcblx0XHQvLyBldmVyeSAzIHNlY29uZHMgY2hhbmdlIHRpdGxlIHRvICcqKiogRVZFTlQgKioqJywgdGhlbiAxLjUgc2Vjb25kcyBsYXRlciwgY2hhbmdlIGl0IGJhY2sgdG8gdGhlIG9yaWdpbmFsIHRpdGxlLlxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0RXZlbnRzLkJMSU5LX0lOVEVSVkFMID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdGRvY3VtZW50LnRpdGxlID0gXygnKioqIEVWRU5UICoqKicpO1xyXG5cdFx0XHRFbmdpbmUuc2V0VGltZW91dChmdW5jdGlvbigpIHtkb2N1bWVudC50aXRsZSA9IHRpdGxlO30sIDE1MDAsIHRydWUpOyBcclxuXHRcdH0sIDMwMDApO1xyXG5cdH0sXHJcblxyXG5cdHN0b3BUaXRsZUJsaW5rOiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdGNsZWFySW50ZXJ2YWwoRXZlbnRzLkJMSU5LX0lOVEVSVkFMKTtcclxuXHRcdEV2ZW50cy5CTElOS19JTlRFUlZBTCA9IGZhbHNlO1xyXG5cdH0sXHJcblx0XHJcblx0Ly8gTWFrZXMgYW4gZXZlbnQgaGFwcGVuIVxyXG5cdHRyaWdnZXJFdmVudDogZnVuY3Rpb24oKSB7XHJcblx0XHRpZihFdmVudHMuYWN0aXZlRXZlbnQoKSA9PSBudWxsKSB7XHJcblx0XHRcdHZhciBwb3NzaWJsZUV2ZW50cyA9IFtdO1xyXG5cdFx0XHRmb3IodmFyIGkgaW4gRXZlbnRzLkV2ZW50UG9vbCkge1xyXG5cdFx0XHRcdHZhciBldmVudCA9IEV2ZW50cy5FdmVudFBvb2xbaV07XHJcblx0XHRcdFx0aWYoZXZlbnQuaXNBdmFpbGFibGUoKSkge1xyXG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdFx0cG9zc2libGVFdmVudHMucHVzaChldmVudCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZihwb3NzaWJsZUV2ZW50cy5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHRFdmVudHMuc2NoZWR1bGVOZXh0RXZlbnQoMC41KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFyIHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqKHBvc3NpYmxlRXZlbnRzLmxlbmd0aCkpO1xyXG5cdFx0XHRcdEV2ZW50cy5zdGFydEV2ZW50KHBvc3NpYmxlRXZlbnRzW3JdKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdEV2ZW50cy5zY2hlZHVsZU5leHRFdmVudCgpO1xyXG5cdH0sXHJcblxyXG5cdC8vIG5vdCBzY2hlZHVsZWQsIHRoaXMgaXMgZm9yIHN0dWZmIGxpa2UgbG9jYXRpb24tYmFzZWQgcmFuZG9tIGV2ZW50cyBvbiBhIGJ1dHRvbiBjbGlja1xyXG5cdHRyaWdnZXJMb2NhdGlvbkV2ZW50OiBmdW5jdGlvbihsb2NhdGlvbikge1xyXG5cdFx0aWYgKHRoaXMuTG9jYXRpb25zW2xvY2F0aW9uXSkge1xyXG5cdFx0XHRpZihFdmVudHMuYWN0aXZlRXZlbnQoKSA9PSBudWxsKSB7XHJcblx0XHRcdFx0dmFyIHBvc3NpYmxlRXZlbnRzOiBBcnJheTxhbnk+ID0gW107XHJcblx0XHRcdFx0Zm9yKHZhciBpIGluIHRoaXMuTG9jYXRpb25zW2xvY2F0aW9uXSkge1xyXG5cdFx0XHRcdFx0dmFyIGV2ZW50ID0gdGhpcy5Mb2NhdGlvbnNbbG9jYXRpb25dW2ldO1xyXG5cdFx0XHRcdFx0aWYoZXZlbnQuaXNBdmFpbGFibGUoKSkge1xyXG5cdFx0XHRcdFx0XHRpZih0eXBlb2YoZXZlbnQuaXNTdXBlckxpa2VseSkgPT0gJ2Z1bmN0aW9uJyAmJiBldmVudC5pc1N1cGVyTGlrZWx5KCkpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBTdXBlckxpa2VseSBldmVudCwgZG8gdGhpcyBhbmQgc2tpcCB0aGUgcmFuZG9tIGNob2ljZVxyXG5cdFx0XHRcdFx0XHRcdEVuZ2luZS5sb2coJ3N1cGVyTGlrZWx5IGRldGVjdGVkJyk7XHJcblx0XHRcdFx0XHRcdFx0RXZlbnRzLnN0YXJ0RXZlbnQoZXZlbnQpO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRwb3NzaWJsZUV2ZW50cy5wdXNoKGV2ZW50KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHJcblx0XHRcdFx0aWYocG9zc2libGVFdmVudHMubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdFx0XHQvLyBFdmVudHMuc2NoZWR1bGVOZXh0RXZlbnQoMC41KTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dmFyIHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqKHBvc3NpYmxlRXZlbnRzLmxlbmd0aCkpO1xyXG5cdFx0XHRcdFx0RXZlbnRzLnN0YXJ0RXZlbnQocG9zc2libGVFdmVudHNbcl0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0YWN0aXZlRXZlbnQ6IGZ1bmN0aW9uKCk6IEFEUkV2ZW50IHwgbnVsbCB7XHJcblx0XHRpZihFdmVudHMuZXZlbnRTdGFjayAmJiBFdmVudHMuZXZlbnRTdGFjay5sZW5ndGggPiAwKSB7XHJcblx0XHRcdHJldHVybiBFdmVudHMuZXZlbnRTdGFja1swXTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH0sXHJcblx0XHJcblx0ZXZlbnRQYW5lbDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LmV2ZW50UGFuZWw7XHJcblx0fSxcclxuXHJcblx0c3RhcnRFdmVudDogZnVuY3Rpb24oZXZlbnQ6IEFEUkV2ZW50LCBvcHRpb25zPykge1xyXG5cdFx0aWYoZXZlbnQpIHtcclxuXHRcdFx0RW5naW5lLmV2ZW50KCdnYW1lIGV2ZW50JywgJ2V2ZW50Jyk7XHJcblx0XHRcdEV2ZW50cy5ldmVudFN0YWNrLnVuc2hpZnQoZXZlbnQpO1xyXG5cdFx0XHRldmVudC5ldmVudFBhbmVsID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdldmVudCcpLmFkZENsYXNzKCdldmVudFBhbmVsJykuY3NzKCdvcGFjaXR5JywgJzAnKTtcclxuXHRcdFx0aWYob3B0aW9ucyAhPSBudWxsICYmIG9wdGlvbnMud2lkdGggIT0gbnVsbCkge1xyXG5cdFx0XHRcdEV2ZW50cy5ldmVudFBhbmVsKCkuY3NzKCd3aWR0aCcsIG9wdGlvbnMud2lkdGgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoJzxkaXY+JykuYWRkQ2xhc3MoJ2V2ZW50VGl0bGUnKS50ZXh0KEV2ZW50cy5hY3RpdmVFdmVudCgpPy50aXRsZSBhcyBzdHJpbmcpLmFwcGVuZFRvKEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2Rlc2NyaXB0aW9uJykuYXBwZW5kVG8oRXZlbnRzLmV2ZW50UGFuZWwoKSk7XHJcblx0XHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnYnV0dG9ucycpLmFwcGVuZFRvKEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0XHRFdmVudHMubG9hZFNjZW5lKCdzdGFydCcpO1xyXG5cdFx0XHQkKCdkaXYjd3JhcHBlcicpLmFwcGVuZChFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdFx0RXZlbnRzLmV2ZW50UGFuZWwoKS5hbmltYXRlKHtvcGFjaXR5OiAxfSwgRXZlbnRzLl9QQU5FTF9GQURFLCAnbGluZWFyJyk7XHJcblx0XHRcdHZhciBjdXJyZW50U2NlbmVJbmZvcm1hdGlvbiA9IEV2ZW50cy5hY3RpdmVFdmVudCgpPy5zY2VuZXNbRXZlbnRzLmFjdGl2ZVNjZW5lXTtcclxuXHRcdFx0aWYgKGN1cnJlbnRTY2VuZUluZm9ybWF0aW9uLmJsaW5rKSB7XHJcblx0XHRcdFx0RXZlbnRzLmJsaW5rVGl0bGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHNjaGVkdWxlTmV4dEV2ZW50OiBmdW5jdGlvbihzY2FsZT8pIHtcclxuXHRcdHZhciBuZXh0RXZlbnQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqKEV2ZW50cy5fRVZFTlRfVElNRV9SQU5HRVsxXSAtIEV2ZW50cy5fRVZFTlRfVElNRV9SQU5HRVswXSkpICsgRXZlbnRzLl9FVkVOVF9USU1FX1JBTkdFWzBdO1xyXG5cdFx0aWYoc2NhbGUgPiAwKSB7IG5leHRFdmVudCAqPSBzY2FsZTsgfVxyXG5cdFx0RW5naW5lLmxvZygnbmV4dCBldmVudCBzY2hlZHVsZWQgaW4gJyArIG5leHRFdmVudCArICcgbWludXRlcycpO1xyXG5cdFx0RXZlbnRzLl9ldmVudFRpbWVvdXQgPSBFbmdpbmUuc2V0VGltZW91dChFdmVudHMudHJpZ2dlckV2ZW50LCBuZXh0RXZlbnQgKiA2MCAqIDEwMDApO1xyXG5cdH0sXHJcblxyXG5cdGVuZEV2ZW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5ldmVudFBhbmVsKCkuYW5pbWF0ZSh7b3BhY2l0eTowfSwgRXZlbnRzLl9QQU5FTF9GQURFLCAnbGluZWFyJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdEV2ZW50cy5ldmVudFBhbmVsKCkucmVtb3ZlKCk7XHJcblx0XHRcdGNvbnN0IGFjdGl2ZUV2ZW50ID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk7XHJcblx0XHRcdGlmIChhY3RpdmVFdmVudCAhPT0gbnVsbCkgYWN0aXZlRXZlbnQuZXZlbnRQYW5lbCA9IG51bGw7XHJcblx0XHRcdEV2ZW50cy5ldmVudFN0YWNrLnNoaWZ0KCk7XHJcblx0XHRcdEVuZ2luZS5sb2coRXZlbnRzLmV2ZW50U3RhY2subGVuZ3RoICsgJyBldmVudHMgcmVtYWluaW5nJyk7XHJcblx0XHRcdGlmIChFdmVudHMuQkxJTktfSU5URVJWQUwpIHtcclxuXHRcdFx0XHRFdmVudHMuc3RvcFRpdGxlQmxpbmsoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBGb3JjZSByZWZvY3VzIG9uIHRoZSBib2R5LiBJIGhhdGUgeW91LCBJRS5cclxuXHRcdFx0JCgnYm9keScpLmZvY3VzKCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRoYW5kbGVTdGF0ZVVwZGF0ZXM6IGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYoKGUuY2F0ZWdvcnkgPT0gJ3N0b3JlcycgfHwgZS5jYXRlZ29yeSA9PSAnaW5jb21lJykgJiYgRXZlbnRzLmFjdGl2ZUV2ZW50KCkgIT0gbnVsbCl7XHJcblx0XHRcdEV2ZW50cy51cGRhdGVCdXR0b25zKCk7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG4iLCIvKipcclxuICogRXZlbnRzIHRoYXQgY2FuIG9jY3VyIHdoZW4gdGhlIFJvYWQgbW9kdWxlIGlzIGFjdGl2ZVxyXG4gKiovXHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuLi9lbmdpbmVcIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuLi9wbGF5ZXIvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCB7IE91dHBvc3QgfSBmcm9tIFwiLi4vcGxhY2VzL291dHBvc3RcIjtcclxuaW1wb3J0IHsgUm9hZCB9IGZyb20gXCIuLi9wbGFjZXMvcm9hZFwiO1xyXG5pbXBvcnQgeyBBRFJFdmVudCB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBFdmVudHNSb2FkV2FuZGVyOiBBcnJheTxBRFJFdmVudD4gPSBbXHJcbiAgICAvLyBTdHJhbmdlciBiZWFyaW5nIGdpZnRzXHJcbiAgICB7XHJcbiAgICAgICAgdGl0bGU6IF8oJ0EgU3RyYW5nZXIgQmVja29ucycpLFxyXG4gICAgICAgIGlzQXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gUm9hZDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAnc3RhcnQnOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgXygnQXMgeW91IHdhbmRlciBhbG9uZyB0aGUgcm9hZCwgYSBob29kZWQgc3RyYW5nZXIgZ2VzdHVyZXMgdG8geW91LiBIZSBkb2VzblxcJ3Qgc2VlbSBpbnRlcmVzdGVkIGluIGh1cnRpbmcgeW91LicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1doYXQgZG8geW91IGRvPycpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdjbG9zZXInOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0RyYXcgQ2xvc2VyJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6ICdjbG9zZXInfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdHZXQgT3V0dGEgVGhlcmUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTogJ2xlYXZlJ31cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdjbG9zZXInOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgXygnWW91IG1vdmUgdG93YXJkIGhpbSBhIGJpdCBhbmQgc3RvcC4gSGUgY29udGludWVzIHRvIGJlY2tvbi4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdXaGF0IGRvIHlvdSBkbz8nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnZXZlbkNsb3Nlcic6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnRHJhdyBFdmVuIENsb3NlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOiAnZXZlbkNsb3Nlcid9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAnbGVhdmUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ05haCwgVGhpcyBpcyBUb28gU3Bvb2t5JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6ICdsZWF2ZSd9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnZXZlbkNsb3Nlcic6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdZb3UgaGVzaXRhbnRseSB3YWxrIGNsb3Nlci4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdBcyBzb29uIGFzIHlvdSBnZXQgd2l0aGluIGFybXNcXCcgcmVhY2gsIGhlIGdyYWJzIHlvdXIgaGFuZCB3aXRoIGFsYXJtaW5nIHNwZWVkLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0hlIHF1aWNrbHkgcGxhY2VzIGFuIG9iamVjdCBpbiB5b3VyIGhhbmQsIHRoZW4gbGVhdmVzIHdvcmRsZXNzbHkuJylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBvbkxvYWQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG1heWJlIHNvbWUgbG9naWMgdG8gbWFrZSByZXBlYXRzIGxlc3MgbGlrZWx5P1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvc3NpYmxlSXRlbXMgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdTdHJhbmdlci5zbW9vdGhTdG9uZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdTdHJhbmdlci53cmFwcGVkS25pZmUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnU3RyYW5nZXIuY2xvdGhCdW5kbGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnU3RyYW5nZXIuY29pbidcclxuICAgICAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBwb3NzaWJsZUl0ZW1zW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBvc3NpYmxlSXRlbXMubGVuZ3RoKV07XHJcbiAgICAgICAgICAgICAgICAgICAgQ2hhcmFjdGVyLmFkZFRvSW52ZW50b3J5KGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnVGhhbmtzLCBJIGd1ZXNzPycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnbGVhdmUnOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgXygnWW91ciBndXQgY2xlbmNoZXMsIGFuZCB5b3UgZmVlbCB0aGUgc3VkZGVuIHVyZ2UgdG8gbGVhdmUuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnQXMgeW91IHdhbGsgYXdheSwgeW91IGNhbiBmZWVsIHRoZSBvbGQgbWFuXFwncyBnYXplIG9uIHlvdXIgYmFjay4nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnV2VpcmQuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gT2xkIGxhZHkgaW4gY2FycmlhZ2UsIHNob3J0Y3V0IHRvIE91dHBvc3RcclxuICAgIHtcclxuICAgICAgICB0aXRsZTogXygnVGhlIFN0b21waW5nIG9mIEhvb3ZlcyBhbmQgQ3JlYWtpbmcgb2YgV29vZCcpLFxyXG4gICAgICAgIGlzQXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gUm9hZDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAnc3RhcnQnOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgXygnQSBjYXJyaWFnZSBwdWxscyB1cCBhbG9uZ3NpZGUgeW91LCBhbmQgdGhlIHZvaWNlIG9mIGFuIGVsZGVybHkgd29tYW4gY3JvYWtzIG91dCBmcm9tIHdpdGhpbi4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdcIk15LCBidXQgeW91IGxvb2sgdGlyZWQgZnJvbSB5b3VyIGpvdXJuZXkuIElmIGl0XFwncyB0aGUgT3V0cG9zdCB5b3Ugc2VlaywgJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKyAnSVxcJ20gb24gbXkgd2F5IHRoZXJlIG5vdzsgd291bGQgeW91IGxpa2UgdG8gam9pbiBtZT9cIicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1doYXQgZG8geW91IGRvPycpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdhY2NlcHQnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FjY2VwdCBoZXIgb2ZmZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTogJ2FjY2VwdCd9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAnbGVhdmUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1BvbGl0ZWx5IERlY2xpbmUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTogJ2xlYXZlJ31cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdhY2NlcHQnOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgXygnWW91IGhvcCBpbiB0aGUgY2FycmlhZ2Ugd2l0aCB0aGUgb2xkIHdvbWFuLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1NoZSB0dXJucyBvdXQgdG8gYmUgcHJldHR5IGNvb2wsIGFuZCBnaXZlcyB5b3Ugb25lIG9mIHRob3NlIGhhcmQgY2FuZGllcyB0aGF0ICcgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJ2V2ZXJ5IGdyYW5kcGFyZW50IHNlZW1zIHRvIGhhdmUgb24gdGhlIGVuZCB0YWJsZSBuZXh0IHRvIHRoZWlyIHNvZmEuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnQmVmb3JlIGxvbmcsIHlvdSByZWFjaCB0aGUgT3V0cG9zdC4gWW91IGhvcCBvdXQgYW5kIHRoYW5rIHRoZSBvbGQgd29tYW4gZm9yIHRoZSByaWRlLicpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdXaGF0IGEgbmljZSBvbGQgbGFkeScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJFNNLmdldCgnb3V0cG9zdC5vcGVuJykgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE91dHBvc3QuaW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRTTS5zZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGFyYWN0ZXIuc2V0UXVlc3RTdGF0dXMoXCJtYXlvclN1cHBsaWVzXCIsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENoYXJhY3Rlci5jaGVja1F1ZXN0U3RhdHVzKFwibWF5b3JTdXBwbGllc1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFbmdpbmUudHJhdmVsVG8oT3V0cG9zdClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENoYXJhY3Rlci5hZGRUb0ludmVudG9yeSgnb2xkTGFkeS5DYW5keScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnbGVhdmUnOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgXygnSXRcXCdzIHRvbyBlYXJseSBpbiB0aGUgZ2FtZSB0byBiZSB0cnVzdGluZyB3ZWlyZCBvbGQgcGVvcGxlLCBtYW4uIFlvdSBwb2xpdGVseSAnIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICArICdkZWNsaW5lLCBhbmQgdGhlIHdvbWFuIGNodWNrbGVzIHNvZnRseSBhcyB0aGUgY2FycmlhZ2Ugcm9sbHMgb2ZmIGludG8gdGhlIGRpc3RhbmNlLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1RoYXQgc29mdCBjaHVja2xlIHRlbGxzIG1lIGV2ZXJ5dGhpbmcgSSBuZWVkIHRvIGtub3cgYWJvdXQgd2hldGhlciB5b3UgbWFkZSB0aGUgJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICArICdyaWdodCBjYWxsLiBUaGF0IGhhZCBcInR1cm5lZCBpbnRvIGdpbmdlcmJyZWFkXCIgd3JpdHRlbiBhbGwgb3ZlciBpdC4nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnWWVhaCBpdCBkaWQnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBPcmdhbiB0cmF1bWFcclxuICAgIHtcclxuICAgICAgICB0aXRsZTogXygnVGhpcyBHdXkgU2VlbXMgRnJpZW5kbHknKSxcclxuICAgICAgICBpc0F2YWlsYWJsZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoRW5naW5lLmFjdGl2ZU1vZHVsZSA9PT0gUm9hZFxyXG4gICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnUm9hZC5nb3RQdW5jaGVkJykgPT09IHVuZGVmaW5lZCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgJ3N0YXJ0Jzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0EgbWFuIHdhbGtzIHVwIHRvIHlvdSB3aXRoIGEgYmlnIGdyaW4gb24gaGlzIGZhY2UsIGFuZCBiZWZvcmUgeW91IGNhbiBncmVldCBoaW0gaGUgc3dpZnRseSBzb2NrcyB5b3UgaW4gdGhlIHN0b21hY2guJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnSGUgd2Fsa3Mgb2ZmIHdoaXN0bGluZyB3aGlsZSB5b3UgZ2FzcCBmb3IgYnJlYXRoIGluIHRoZSBkaXJ0LicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJy4uLiBNYW4sIHdoYXQgYSBkaWNrLicpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdGdWNrIG1lLCBJIGd1ZXNzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDaGFyYWN0ZXIuZ3JhbnRQZXJrKCd0dW1teVBhaW4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRTTS5zZXQoJ1JvYWQuZ290UHVuY2hlZCcsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIEFuIGFwb2xvZ3kgZm9yIG9yZ2FuIHRyYXVtYVxyXG4gICAge1xyXG4gICAgICAgIHRpdGxlOiBfKCdUaGlzIEZ1Y2tpbmcgR3V5IEFnYWluJyksXHJcbiAgICAgICAgaXNBdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gKEVuZ2luZS5hY3RpdmVNb2R1bGUgPT09IFJvYWRcclxuICAgICAgICAgICAgICAgICYmICgkU00uZ2V0KCdSb2FkLmdvdFB1bmNoZWQnKSAhPT0gdW5kZWZpbmVkKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgJ3N0YXJ0Jzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0EgbWFuIHdhbGtzIHVwIHRvIHlvdSB3aXRoIGEgYmlnIGdyaW4gb24gaGlzIGZhY2UsIGFuZCBiZWZvcmUgeW91IGNhbiBncmVldCBoaW0gaGUgc3dpZnRseS4uLiBhcG9sb2dpemVzLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1wiSGV5LCBJXFwnbSByZWFsbHkgc29ycnkgYWJvdXQgcHVuY2hpbmcgeW91IGluIHRoZSBzdG9tYWNoIGJlZm9yZS4gSSB0aG91Z2h0IHlvdSB3ZXJlIHNvbWVvbmUgZWxzZS4gSSBIQVRFIHRoYXQgZ3V5LlwiJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnWW91XFwncmUgbm90IHN1cmUgdGhpcyBpcyBhIGdvb2QgZW5vdWdoIHJlYXNvbiB0byBub3Qga2ljayB0aGlzIGd1eVxcJ3MgYXNzLiBTZWVpbmcgdGhlIGxvb2sgb24geW91ciBmYWNlLCBoZSBoYXN0aWx5IGNvbnRpbnVlcy4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdcIkFueXdheSwgYXMgYSB0b2tlbiBvZiBteSBhcG9sb2d5LCBwbGVhc2UgYWNjZXB0IHRoaXMgaGVhbGluZyB0b25pYywgYXMgd2VsbCBhcyBhIGNvdXBvbiBmb3IgYSBzZWNyZXQgaXRlbSBmcm9tIHRoZSBzdG9yZSBpbiB0aGUgdmlsbGFnZS5cIicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1lvdSBzb21ld2hhdCBhd2t3YXJkbHkgYWNjZXB0IGJvdGggb2YgdGhlc2UgaXRlbXMsIHRob3VnaCB5b3UgZG9uXFwndCB0aGluayB0aGVyZVxcJ3MgYSBzdG9yZSBpbiB0aGUgdmktJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnXCJPaCwgYW5kIElcXCdtIHRoZSBvd25lciBvZiB0aGUgc3RvcmUgaW4gdGhlIHZpbGxhZ2UuIEkgb3BlbmVkIGl0IGJhY2sgdXAgYWZ0ZXIgcHVuY2hpbmcgeW91LiBZb3Uga25vdywgdG8gY2VsZWJyYXRlLlwiJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnVGhlIG1hbiB3YWxrcyBvZmYsIHN0aWxsIGdyaW5uaW5nLicpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCcuLi4gQWxyaWdodCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNob29zZTogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2l2ZSBoZWFsaW5nIHRvbmljXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBnaXZlIGNvdXBvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdW5sb2NrIHN0b3JlIGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJFNNLnNldCgnUm9hZC5nb3RBcG9sb2dpemVkJywgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gVW5sb2NrIE91dHBvc3RcclxuICAgIHtcclxuICAgICAgICB0aXRsZTogXygnQSBXYXkgRm9yd2FyZCBNYWtlcyBJdHNlbGYgS25vd24nKSxcclxuICAgICAgICBpc0F2YWlsYWJsZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAoRW5naW5lLmFjdGl2ZU1vZHVsZSA9PT0gUm9hZClcclxuICAgICAgICAgICAgICAgICYmICgkU00uZ2V0KCdSb2FkLmNvdW50ZXInKSBhcyBudW1iZXIgPiAzKSAvLyBjYW4ndCBoYXBwZW4gVE9PIGVhcmx5XHJcbiAgICAgICAgICAgICAgICAmJiAoJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpID09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgIHx8ICRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPCAxKSAvLyBjYW4ndCBoYXBwZW4gdHdpY2VcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGlzU3VwZXJMaWtlbHk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gKCgoICRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB8fCAkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyIDwgMSkpIFxyXG4gICAgICAgICAgICAgICAgICAgICYmICgkU00uZ2V0KCdSb2FkLmNvdW50ZXInKSBhcyBudW1iZXIgPiA3KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAnc3RhcnQnOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgXygnU21va2UgY3VybHMgdXB3YXJkcyBmcm9tIGJlaGluZCBhIGhpbGwuIFlvdSBjbGltYiBoaWdoZXIgdG8gaW52ZXN0aWdhdGUuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnRnJvbSB5b3VyIGVsZXZhdGVkIHBvc2l0aW9uLCB5b3UgY2FuIHNlZSBkb3duIGludG8gdGhlIG91dHBvc3QgdGhhdCB0aGUgbWF5b3Igc3Bva2Ugb2YgYmVmb3JlLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1RoZSBPdXRwb3N0IGlzIG5vdyBvcGVuIHRvIHlvdS4nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnQSBsaXR0bGUgZHJhbWF0aWMsIGJ1dCBjb29sJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE91dHBvc3QuaW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJFNNLnNldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hhcmFjdGVyLnNldFF1ZXN0U3RhdHVzKFwibWF5b3JTdXBwbGllc1wiLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENoYXJhY3Rlci5jaGVja1F1ZXN0U3RhdHVzKFwibWF5b3JTdXBwbGllc1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbl07XHJcblxyXG4iLCIvKipcclxuICogTW9kdWxlIHRoYXQgdGFrZXMgY2FyZSBvZiBoZWFkZXIgYnV0dG9uc1xyXG4gKi9cclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4vZW5naW5lXCI7XHJcblxyXG5leHBvcnQgY29uc3QgSGVhZGVyID0ge1xyXG5cdFxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblx0fSxcclxuXHRcclxuXHRvcHRpb25zOiB7fSwgLy8gTm90aGluZyBmb3Igbm93XHJcblx0XHJcblx0Y2FuVHJhdmVsOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAkKCdkaXYjaGVhZGVyIGRpdi5oZWFkZXJCdXR0b24nKS5sZW5ndGggPiAxO1xyXG5cdH0sXHJcblx0XHJcblx0YWRkTG9jYXRpb246IGZ1bmN0aW9uKHRleHQsIGlkLCBtb2R1bGUpIHtcclxuXHRcdHJldHVybiAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgXCJsb2NhdGlvbl9cIiArIGlkKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2hlYWRlckJ1dHRvbicpXHJcblx0XHRcdC50ZXh0KHRleHQpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGlmKEhlYWRlci5jYW5UcmF2ZWwoKSkge1xyXG5cdFx0XHRcdFx0RW5naW5lLnRyYXZlbFRvKG1vZHVsZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KS5hcHBlbmRUbygkKCdkaXYjaGVhZGVyJykpO1xyXG5cdH1cclxufTsiLCIvKipcclxuICogTW9kdWxlIHRoYXQgcmVnaXN0ZXJzIHRoZSBub3RpZmljYXRpb24gYm94IGFuZCBoYW5kbGVzIG1lc3NhZ2VzXHJcbiAqL1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi9lbmdpbmVcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBOb3RpZmljYXRpb25zID0ge1xyXG5cdFx0XHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblx0XHRcclxuXHRcdC8vIENyZWF0ZSB0aGUgbm90aWZpY2F0aW9ucyBib3hcclxuXHRcdGNvbnN0IGVsZW0gPSAkKCc8ZGl2PicpLmF0dHIoe1xyXG5cdFx0XHRpZDogJ25vdGlmaWNhdGlvbnMnLFxyXG5cdFx0XHRjbGFzc05hbWU6ICdub3RpZmljYXRpb25zJ1xyXG5cdFx0fSk7XHJcblx0XHQvLyBDcmVhdGUgdGhlIHRyYW5zcGFyZW5jeSBncmFkaWVudFxyXG5cdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdub3RpZnlHcmFkaWVudCcpLmFwcGVuZFRvKGVsZW0pO1xyXG5cdFx0XHJcblx0XHRlbGVtLmFwcGVuZFRvKCdkaXYjd3JhcHBlcicpO1xyXG5cdH0sXHJcblx0XHJcblx0b3B0aW9uczoge30sIC8vIE5vdGhpbmcgZm9yIG5vd1xyXG5cdFxyXG5cdGVsZW06IG51bGwsXHJcblx0XHJcblx0bm90aWZ5UXVldWU6IHt9LFxyXG5cdFxyXG5cdC8vIEFsbG93IG5vdGlmaWNhdGlvbiB0byB0aGUgcGxheWVyXHJcblx0bm90aWZ5OiBmdW5jdGlvbihtb2R1bGUsIHRleHQsIG5vUXVldWU/KSB7XHJcblx0XHRpZih0eXBlb2YgdGV4dCA9PSAndW5kZWZpbmVkJykgcmV0dXJuO1xyXG5cdFx0Ly8gSSBkb24ndCBuZWVkIHlvdSBwdW5jdHVhdGluZyBmb3IgbWUsIGZ1bmN0aW9uLlxyXG5cdFx0Ly8gaWYodGV4dC5zbGljZSgtMSkgIT0gXCIuXCIpIHRleHQgKz0gXCIuXCI7XHJcblx0XHRpZihtb2R1bGUgIT0gbnVsbCAmJiBFbmdpbmUuYWN0aXZlTW9kdWxlICE9IG1vZHVsZSkge1xyXG5cdFx0XHRpZighbm9RdWV1ZSkge1xyXG5cdFx0XHRcdGlmKHR5cGVvZiB0aGlzLm5vdGlmeVF1ZXVlW21vZHVsZV0gPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0XHRcdHRoaXMubm90aWZ5UXVldWVbbW9kdWxlXSA9IFtdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLm5vdGlmeVF1ZXVlW21vZHVsZV0ucHVzaCh0ZXh0KTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Tm90aWZpY2F0aW9ucy5wcmludE1lc3NhZ2UodGV4dCk7XHJcblx0XHR9XHJcblx0XHRFbmdpbmUuc2F2ZUdhbWUoKTtcclxuXHR9LFxyXG5cdFxyXG5cdGNsZWFySGlkZGVuOiBmdW5jdGlvbigpIHtcclxuXHRcclxuXHRcdC8vIFRvIGZpeCBzb21lIG1lbW9yeSB1c2FnZSBpc3N1ZXMsIHdlIGNsZWFyIG5vdGlmaWNhdGlvbnMgdGhhdCBoYXZlIGJlZW4gaGlkZGVuLlxyXG5cdFx0XHJcblx0XHQvLyBXZSB1c2UgcG9zaXRpb24oKS50b3AgaGVyZSwgYmVjYXVzZSB3ZSBrbm93IHRoYXQgdGhlIHBhcmVudCB3aWxsIGJlIHRoZSBzYW1lLCBzbyB0aGUgcG9zaXRpb24gd2lsbCBiZSB0aGUgc2FtZS5cclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdHZhciBib3R0b20gPSAkKCcjbm90aWZ5R3JhZGllbnQnKS5wb3NpdGlvbigpLnRvcCArICQoJyNub3RpZnlHcmFkaWVudCcpLm91dGVySGVpZ2h0KHRydWUpO1xyXG5cdFx0XHJcblx0XHQkKCcubm90aWZpY2F0aW9uJykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFxyXG5cdFx0XHRpZigkKHRoaXMpLnBvc2l0aW9uKCkudG9wID4gYm90dG9tKXtcclxuXHRcdFx0XHQkKHRoaXMpLnJlbW92ZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0fSxcclxuXHRcclxuXHRwcmludE1lc3NhZ2U6IGZ1bmN0aW9uKHQpIHtcclxuXHRcdHZhciB0ZXh0ID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnbm90aWZpY2F0aW9uJykuY3NzKCdvcGFjaXR5JywgJzAnKS50ZXh0KHQpLnByZXBlbmRUbygnZGl2I25vdGlmaWNhdGlvbnMnKTtcclxuXHRcdHRleHQuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIDUwMCwgJ2xpbmVhcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQvLyBEbyB0aGlzIGV2ZXJ5IHRpbWUgd2UgYWRkIGEgbmV3IG1lc3NhZ2UsIHRoaXMgd2F5IHdlIG5ldmVyIGhhdmUgYSBsYXJnZSBiYWNrbG9nIHRvIGl0ZXJhdGUgdGhyb3VnaC4gS2VlcHMgdGhpbmdzIGZhc3Rlci5cclxuXHRcdFx0Tm90aWZpY2F0aW9ucy5jbGVhckhpZGRlbigpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRcclxuXHRwcmludFF1ZXVlOiBmdW5jdGlvbihtb2R1bGUpIHtcclxuXHRcdGlmKHR5cGVvZiB0aGlzLm5vdGlmeVF1ZXVlW21vZHVsZV0gIT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0d2hpbGUodGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHROb3RpZmljYXRpb25zLnByaW50TWVzc2FnZSh0aGlzLm5vdGlmeVF1ZXVlW21vZHVsZV0uc2hpZnQoKSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IHsgRW5naW5lIH0gZnJvbSAnLi4vZW5naW5lJztcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSAnLi4vc3RhdGVfbWFuYWdlcic7XHJcbmltcG9ydCB7IFdlYXRoZXIgfSBmcm9tICcuLi93ZWF0aGVyJztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vQnV0dG9uJztcclxuaW1wb3J0IHsgQ2FwdGFpbiB9IGZyb20gJy4uL2NoYXJhY3RlcnMvY2FwdGFpbic7XHJcbmltcG9ydCB7IEhlYWRlciB9IGZyb20gJy4uL2hlYWRlcic7XHJcbmltcG9ydCB7IF8gfSBmcm9tICcuLi8uLi9saWIvdHJhbnNsYXRlJztcclxuaW1wb3J0IHsgX3RiIH0gZnJvbSAnLi4vLi4vbGliL3RleHRCdWlsZGVyJztcclxuXHJcbmV4cG9ydCBjb25zdCBPdXRwb3N0ID0ge1xyXG5cdGRlc2NyaXB0aW9uOiBbXHJcblx0XHRfKFwiWW91J3JlIGluIGEgc21hbGwgYnV0IGJ1c3RsaW5nIG1pbGl0YXJ5IG91dHBvc3QuIFZhcmlvdXMgbWVtYmVycyBcIiBcclxuXHRcdFx0KyBcIm9mIHRoZSByYW5rLWFuZC1maWxlIGdvIGFib3V0IHRoZWlyIGJ1c2luZXNzLCBwYXlpbmcgeW91IGxpdHRsZSBtaW5kLlwiKSxcclxuXHRcdF8oXCJPbmUgdGVudCBzdGFuZHMgb3V0IGZyb20gdGhlIHJlc3Q7IHRoZSBmaW5lbHktZW1icm9pZGVyZWQgZGV0YWlscyBhbmQgXCIgKyBcclxuXHRcdFx0XCJnb2xkZW4gaWNvbiBhYm92ZSB0aGUgZW50cmFuY2UgbWFyayBpdCBhcyB0aGUgY29tbWFuZGluZyBvZmZpY2VyJ3MgcXVhcnRlcnMuXCIpXHJcblx0XSxcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgT3V0cG9zdCB0YWJcclxuICAgICAgICB0aGlzLnRhYiA9IEhlYWRlci5hZGRMb2NhdGlvbihfKFwiVGhlIE91dHBvc3RcIiksIFwib3V0cG9zdFwiLCBPdXRwb3N0KTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBPdXRwb3N0IHBhbmVsXHJcblx0XHR0aGlzLnBhbmVsID0gJCgnPGRpdj4nKVxyXG4gICAgICAgIC5hdHRyKCdpZCcsIFwib3V0cG9zdFBhbmVsXCIpXHJcbiAgICAgICAgLmFkZENsYXNzKCdsb2NhdGlvbicpXHJcbiAgICAgICAgLmFwcGVuZFRvKCdkaXYjbG9jYXRpb25TbGlkZXInKTtcclxuXHJcblx0XHR0aGlzLmRlc2NyaXB0aW9uUGFuZWwgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2Rlc2NyaXB0aW9uJykuYXBwZW5kVG8odGhpcy5wYW5lbCk7XHJcblx0XHR0aGlzLnVwZGF0ZURlc2NyaXB0aW9uKCk7XHJcblxyXG4gICAgICAgIEVuZ2luZS51cGRhdGVTbGlkZXIoKTtcclxuXHJcbiAgICAgICAgLy8gbmV3IFxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAnY2FwdGFpbkJ1dHRvbicsXHJcblx0XHRcdHRleHQ6IF8oJ1NwZWFrIHdpdGggVGhlIENhcHRhaW4nKSxcclxuXHRcdFx0Y2xpY2s6IENhcHRhaW4udGFsa1RvQ2FwdGFpbixcclxuXHRcdFx0d2lkdGg6ICc4MHB4J1xyXG5cdFx0fSlcclxuXHRcdC5hZGRDbGFzcygnbG9jYXRpb25CdXR0b24nKVxyXG5cdFx0LmFwcGVuZFRvKCdkaXYjb3V0cG9zdFBhbmVsJyk7XHJcblxyXG4gICAgICAgIE91dHBvc3QudXBkYXRlQnV0dG9uKCk7XHJcblxyXG4gICAgICAgIC8vIHNldHRpbmcgdGhpcyBzZXBhcmF0ZWx5IHNvIHRoYXQgcXVlc3Qgc3RhdHVzIGNhbid0IGFjY2lkZW50YWxseSBicmVhayBpdCBsYXRlclxyXG4gICAgICAgICRTTS5zZXQoJ291dHBvc3Qub3BlbicsIDEpOyBcclxuICAgIH0sXHJcblxyXG5cdHVwZGF0ZURlc2NyaXB0aW9uOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuZGVzY3JpcHRpb25QYW5lbC5lbXB0eSgpO1xyXG5cdFx0dGhpcy5kZXNjcmlwdGlvbiA9IF90YihbXHJcblx0XHRcdF8oXCJZb3UncmUgb24gYSBkdXN0eSByb2FkIGJldHdlZW4gdGhlIFZpbGxhZ2UgYW5kIHRoZSBPdXRwb3N0LiBUaGUgcm9hZCBjdXRzIHRocm91Z2ggXCIgXHJcblx0XHRcdFx0KyBcInRhbGwgZ3Jhc3MsIGJydXNoLCBhbmQgdHJlZXMsIGxpbWl0aW5nIHZpc2liaWxpdHkgYW5kIGVuc3VyaW5nIHRoYXQgeW91J2xsIGhhdmUgXCIgXHJcblx0XHRcdFx0KyBcInRvIGRlYWwgd2l0aCBzb21lIG5vbnNlbnNlLlwiKSxcclxuXHRcdFx0XyhcIlRoZSBoYWlyIG9uIHRoZSBiYWNrIG9mIHlvdXIgbmVjayBwcmlja2xlcyBzbGlnaHRseSBpbiBhbnRpY2lwYXRpb24uXCIpXHJcblx0XHRdKTtcclxuXHJcblx0XHRmb3IodmFyIGkgaW4gdGhpcy5kZXNjcmlwdGlvbikge1xyXG5cdFx0XHQkKCc8ZGl2PicpLnRleHQodGhpcy5kZXNjcmlwdGlvbltpXSkuYXBwZW5kVG8odGhpcy5kZXNjcmlwdGlvblBhbmVsKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuICAgIGF2YWlsYWJsZVdlYXRoZXI6IHtcclxuXHRcdCdzdW5ueSc6IDAuNCxcclxuXHRcdCdjbG91ZHknOiAwLjMsXHJcblx0XHQncmFpbnknOiAwLjNcclxuXHR9LFxyXG5cclxuICAgIG9uQXJyaXZhbDogZnVuY3Rpb24odHJhbnNpdGlvbl9kaWZmKSB7XHJcbiAgICAgICAgT3V0cG9zdC5zZXRUaXRsZSgpO1xyXG5cclxuXHRcdEVuZ2luZS5tb3ZlU3RvcmVzVmlldyhudWxsLCB0cmFuc2l0aW9uX2RpZmYpO1xyXG5cclxuICAgICAgICBXZWF0aGVyLmluaXRpYXRlV2VhdGhlcihPdXRwb3N0LmF2YWlsYWJsZVdlYXRoZXIsICdvdXRwb3N0Jyk7XHJcblxyXG5cdFx0dGhpcy51cGRhdGVEZXNjcmlwdGlvbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRUaXRsZTogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdGl0bGUgPSBfKFwiVGhlIE91dHBvc3RcIik7XHJcblx0XHRpZihFbmdpbmUuYWN0aXZlTW9kdWxlID09IHRoaXMpIHtcclxuXHRcdFx0ZG9jdW1lbnQudGl0bGUgPSB0aXRsZTtcclxuXHRcdH1cclxuXHRcdCQoJ2RpdiNsb2NhdGlvbl9vdXRwb3N0JykudGV4dCh0aXRsZSk7XHJcblx0fSxcclxuXHJcbiAgICB1cGRhdGVCdXR0b246IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gY29uZGl0aW9uYWxzIGZvciB1cGRhdGluZyBidXR0b25zXHJcblx0fSxcclxuXHJcbiAgICAvLyBkb24ndCBuZWVkIHRoaXMgeWV0IChvciBtYXliZSBldmVyKVxyXG5cdC8vIHdhbmRlckV2ZW50OiBmdW5jdGlvbigpIHtcclxuXHQvLyBcdEV2ZW50cy50cmlnZ2VyTG9jYXRpb25FdmVudCgnT3V0cG9zdFdhbmRlcicpO1xyXG5cdC8vIFx0JFNNLmFkZCgnT3V0cG9zdC5jb3VudGVyJywgMSk7XHJcblx0Ly8gfVxyXG59IiwiaW1wb3J0IHsgSGVhZGVyIH0gZnJvbSBcIi4uL2hlYWRlclwiO1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi4vZW5naW5lXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi9CdXR0b25cIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IFdlYXRoZXIgfSBmcm9tIFwiLi4vd2VhdGhlclwiO1xyXG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcbmltcG9ydCB7IF90YiB9IGZyb20gXCIuLi8uLi9saWIvdGV4dEJ1aWxkZXJcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBSb2FkID0ge1xyXG5cdGRlc2NyaXB0aW9uOiBudWxsLFxyXG5cdGRlc2NyaXB0aW9uUGFuZWw6IG51bGwsXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgdGhlIFJvYWQgdGFiXHJcbiAgICAgICAgdGhpcy50YWIgPSBIZWFkZXIuYWRkTG9jYXRpb24oXyhcIlJvYWQgdG8gdGhlIE91dHBvc3RcIiksIFwicm9hZFwiLCBSb2FkKTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBSb2FkIHBhbmVsXHJcblx0XHR0aGlzLnBhbmVsID0gJCgnPGRpdj4nKVxyXG4gICAgICAgIC5hdHRyKCdpZCcsIFwicm9hZFBhbmVsXCIpXHJcbiAgICAgICAgLmFkZENsYXNzKCdsb2NhdGlvbicpXHJcbiAgICAgICAgLmFwcGVuZFRvKCdkaXYjbG9jYXRpb25TbGlkZXInKTtcclxuXHJcblx0XHR0aGlzLmRlc2NyaXB0aW9uUGFuZWwgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2Rlc2NyaXB0aW9uJykuYXBwZW5kVG8odGhpcy5wYW5lbCk7XHJcblx0XHR0aGlzLnVwZGF0ZURlc2NyaXB0aW9uKCk7XHJcblxyXG4gICAgICAgIEVuZ2luZS51cGRhdGVTbGlkZXIoKTtcclxuXHJcblx0XHRCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6ICd3YW5kZXJCdXR0b24nLFxyXG5cdFx0XHR0ZXh0OiBfKCdXYW5kZXIgQXJvdW5kJyksXHJcblx0XHRcdGNsaWNrOiBSb2FkLndhbmRlckV2ZW50LFxyXG5cdFx0XHR3aWR0aDogJzgwcHgnLFxyXG5cdFx0XHRjb3N0OiB7fSAvLyBUT0RPOiBtYWtlIHRoZXJlIGJlIGEgY29zdCB0byBkb2luZyBzdHVmZj9cclxuXHRcdH0pXHJcblx0XHQuYWRkQ2xhc3MoJ2xvY2F0aW9uQnV0dG9uJylcclxuXHRcdC5hcHBlbmRUbygnZGl2I3JvYWRQYW5lbCcpO1xyXG5cclxuICAgICAgICBSb2FkLnVwZGF0ZUJ1dHRvbigpO1xyXG5cclxuICAgICAgICAvLyBzZXR0aW5nIHRoaXMgc2VwYXJhdGVseSBzbyB0aGF0IHF1ZXN0IHN0YXR1cyBjYW4ndCBhY2NpZGVudGFsbHkgYnJlYWsgaXQgbGF0ZXJcclxuICAgICAgICAkU00uc2V0KCdyb2FkLm9wZW4nLCAxKTsgXHJcbiAgICB9LFxyXG5cclxuXHR1cGRhdGVEZXNjcmlwdGlvbjogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLmRlc2NyaXB0aW9uUGFuZWwuZW1wdHkoKTtcclxuXHRcdHRoaXMuZGVzY3JpcHRpb24gPSBfdGIoW1xyXG5cdFx0XHRfKFwiWW91J3JlIG9uIGEgZHVzdHkgcm9hZCBiZXR3ZWVuIHRoZSBWaWxsYWdlIGFuZCB0aGUgT3V0cG9zdC4gVGhlIHJvYWQgY3V0cyB0aHJvdWdoIFwiIFxyXG5cdFx0XHRcdCsgXCJ0YWxsIGdyYXNzLCBicnVzaCwgYW5kIHRyZWVzLCBsaW1pdGluZyB2aXNpYmlsaXR5IGFuZCBlbnN1cmluZyB0aGF0IHlvdSdsbCBoYXZlIFwiIFxyXG5cdFx0XHRcdCsgXCJ0byBkZWFsIHdpdGggc29tZSBub25zZW5zZS5cIiksXHJcblx0XHRcdF8oXCJUaGUgaGFpciBvbiB0aGUgYmFjayBvZiB5b3VyIG5lY2sgcHJpY2tsZXMgc2xpZ2h0bHkgaW4gYW50aWNpcGF0aW9uLlwiKVxyXG5cdFx0XSk7XHJcblxyXG5cdFx0Zm9yKHZhciBpIGluIHRoaXMuZGVzY3JpcHRpb24pIHtcclxuXHRcdFx0JCgnPGRpdj4nKS50ZXh0KHRoaXMuZGVzY3JpcHRpb25baV0pLmFwcGVuZFRvKHRoaXMuZGVzY3JpcHRpb25QYW5lbCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcbiAgICBhdmFpbGFibGVXZWF0aGVyOiB7XHJcblx0XHQnc3VubnknOiAwLjQsXHJcblx0XHQnY2xvdWR5JzogMC4zLFxyXG5cdFx0J3JhaW55JzogMC4zXHJcblx0fSxcclxuXHJcbiAgICBvbkFycml2YWw6IGZ1bmN0aW9uKHRyYW5zaXRpb25fZGlmZikge1xyXG4gICAgICAgIFJvYWQuc2V0VGl0bGUoKTtcclxuXHJcblx0XHRFbmdpbmUubW92ZVN0b3Jlc1ZpZXcobnVsbCwgdHJhbnNpdGlvbl9kaWZmKTtcclxuXHJcbiAgICAgICAgV2VhdGhlci5pbml0aWF0ZVdlYXRoZXIoUm9hZC5hdmFpbGFibGVXZWF0aGVyLCAncm9hZCcpO1xyXG5cclxuXHRcdHRoaXMudXBkYXRlRGVzY3JpcHRpb24oKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0VGl0bGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRpdGxlID0gXyhcIlJvYWQgdG8gdGhlIE91dHBvc3RcIik7XHJcblx0XHRpZihFbmdpbmUuYWN0aXZlTW9kdWxlID09IHRoaXMpIHtcclxuXHRcdFx0ZG9jdW1lbnQudGl0bGUgPSB0aXRsZTtcclxuXHRcdH1cclxuXHRcdCQoJ2RpdiNsb2NhdGlvbl9yb2FkJykudGV4dCh0aXRsZSk7XHJcblx0fSxcclxuXHJcbiAgICB1cGRhdGVCdXR0b246IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gY29uZGl0aW9uYWxzIGZvciB1cGRhdGluZyBidXR0b25zXHJcblx0fSxcclxuXHJcblx0d2FuZGVyRXZlbnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnRyaWdnZXJMb2NhdGlvbkV2ZW50KCdSb2FkV2FuZGVyJyk7XHJcblx0XHQkU00uYWRkKCdSb2FkLmNvdW50ZXInLCAxKTtcclxuXHR9XHJcbn0iLCIvKipcclxuICogTW9kdWxlIHRoYXQgcmVnaXN0ZXJzIHRoZSBzaW1wbGUgcm9vbSBmdW5jdGlvbmFsaXR5XHJcbiAqL1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi4vZW5naW5lXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi9CdXR0b25cIjtcclxuaW1wb3J0IHsgTm90aWZpY2F0aW9ucyB9IGZyb20gXCIuLi9ub3RpZmljYXRpb25zXCI7XHJcbmltcG9ydCB7IFdlYXRoZXIgfSBmcm9tIFwiLi4vd2VhdGhlclwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgSGVhZGVyIH0gZnJvbSBcIi4uL2hlYWRlclwiO1xyXG5pbXBvcnQgeyBMaXogfSBmcm9tIFwiLi4vY2hhcmFjdGVycy9saXpcIjtcclxuaW1wb3J0IHsgTWF5b3IgfSBmcm9tIFwiLi4vY2hhcmFjdGVycy9tYXlvclwiO1xyXG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcbmltcG9ydCB7IF90YiB9IGZyb20gXCIuLi8uLi9saWIvdGV4dEJ1aWxkZXJcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBWaWxsYWdlID0ge1xyXG5cdC8vIHRpbWVzIGluIChtaW51dGVzICogc2Vjb25kcyAqIG1pbGxpc2Vjb25kcylcclxuXHRfRklSRV9DT09MX0RFTEFZOiA1ICogNjAgKiAxMDAwLCAvLyB0aW1lIGFmdGVyIGEgc3Rva2UgYmVmb3JlIHRoZSBmaXJlIGNvb2xzXHJcblx0X1JPT01fV0FSTV9ERUxBWTogMzAgKiAxMDAwLCAvLyB0aW1lIGJldHdlZW4gcm9vbSB0ZW1wZXJhdHVyZSB1cGRhdGVzXHJcblx0X0JVSUxERVJfU1RBVEVfREVMQVk6IDAuNSAqIDYwICogMTAwMCwgLy8gdGltZSBiZXR3ZWVuIGJ1aWxkZXIgc3RhdGUgdXBkYXRlc1xyXG5cdF9TVE9LRV9DT09MRE9XTjogMTAsIC8vIGNvb2xkb3duIHRvIHN0b2tlIHRoZSBmaXJlXHJcblx0X05FRURfV09PRF9ERUxBWTogMTUgKiAxMDAwLCAvLyBmcm9tIHdoZW4gdGhlIHN0cmFuZ2VyIHNob3dzIHVwLCB0byB3aGVuIHlvdSBuZWVkIHdvb2RcclxuXHRcclxuXHRidXR0b25zOnt9LFxyXG5cdFxyXG5cdGNoYW5nZWQ6IGZhbHNlLFxyXG5cclxuXHRkZXNjcmlwdGlvbjogW10sXHJcblx0ZGVzY3JpcHRpb25QYW5lbDogbnVsbCxcclxuXHRcclxuXHRuYW1lOiBfKFwiVmlsbGFnZVwiKSxcclxuXHRpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHRcdFxyXG5cdFx0aWYoRW5naW5lLl9kZWJ1Zykge1xyXG5cdFx0XHR0aGlzLl9ST09NX1dBUk1fREVMQVkgPSA1MDAwO1xyXG5cdFx0XHR0aGlzLl9CVUlMREVSX1NUQVRFX0RFTEFZID0gNTAwMDtcclxuXHRcdFx0dGhpcy5fU1RPS0VfQ09PTERPV04gPSAwO1xyXG5cdFx0XHR0aGlzLl9ORUVEX1dPT0RfREVMQVkgPSA1MDAwO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBDcmVhdGUgdGhlIFZpbGxhZ2UgdGFiXHJcblx0XHR0aGlzLnRhYiA9IEhlYWRlci5hZGRMb2NhdGlvbihfKFwiQSBDaGlsbCBWaWxsYWdlXCIpLCBcInZpbGxhZ2VcIiwgVmlsbGFnZSk7XHJcblx0XHRcclxuXHRcdC8vIENyZWF0ZSB0aGUgVmlsbGFnZSBwYW5lbFxyXG5cdFx0dGhpcy5wYW5lbCA9ICQoJzxkaXY+JylcclxuXHRcdFx0LmF0dHIoJ2lkJywgXCJ2aWxsYWdlUGFuZWxcIilcclxuXHRcdFx0LmFkZENsYXNzKCdsb2NhdGlvbicpXHJcblx0XHRcdC5hcHBlbmRUbygnZGl2I2xvY2F0aW9uU2xpZGVyJyk7XHJcblxyXG5cdFx0dGhpcy5kZXNjcmlwdGlvblBhbmVsID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdkZXNjcmlwdGlvbicpLmFwcGVuZFRvKHRoaXMucGFuZWwpO1xyXG5cdFx0dGhpcy51cGRhdGVEZXNjcmlwdGlvbigpO1xyXG5cclxuXHRcdEVuZ2luZS51cGRhdGVTbGlkZXIoKTtcclxuXHJcblx0XHRCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6ICd0YWxrQnV0dG9uJyxcclxuXHRcdFx0dGV4dDogXygnVGFsayB0byB0aGUgTWF5b3InKSxcclxuXHRcdFx0Y2xpY2s6IE1heW9yLnRhbGtUb01heW9yLFxyXG5cdFx0XHR3aWR0aDogJzgwcHgnLFxyXG5cdFx0XHRjb3N0OiB7fVxyXG5cdFx0fSlcclxuXHRcdC5hZGRDbGFzcygnbG9jYXRpb25CdXR0b24nKVxyXG5cdFx0LmFwcGVuZFRvKCdkaXYjdmlsbGFnZVBhbmVsJyk7XHJcblxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAnbGl6QnV0dG9uJyxcclxuXHRcdFx0dGV4dDogXygnVGFsayB0byBMaXonKSxcclxuXHRcdFx0Y2xpY2s6IExpei50YWxrVG9MaXosXHJcblx0XHRcdHdpZHRoOiAnODBweCcsXHJcblx0XHRcdGNvc3Q6IHt9XHJcblx0XHR9KVxyXG5cdFx0LmFkZENsYXNzKCdsb2NhdGlvbkJ1dHRvbicpXHJcblx0XHQuYXBwZW5kVG8oJ2RpdiN2aWxsYWdlUGFuZWwnKTtcclxuXHJcblx0XHRCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6ICduZXdCdWlsZGluZ0J1dHRvbicsXHJcblx0XHRcdHRleHQ6IF8oJ0NoZWNrIG91dCB0aGUgbmV3IGJ1aWxkaW5nJyksXHJcblx0XHRcdGNsaWNrOiBWaWxsYWdlLnRlbXBCdWlsZGluZ01lc3NhZ2UsXHJcblx0XHRcdHdpZHRoOiAnODBweCcsXHJcblx0XHRcdGNvc3Q6IHt9XHJcblx0XHR9KVxyXG5cdFx0LmFkZENsYXNzKCdsb2NhdGlvbkJ1dHRvbicpXHJcblx0XHQuYXBwZW5kVG8oJ2RpdiN2aWxsYWdlUGFuZWwnKTtcclxuXHJcblx0XHR2YXIgYnVpbGRpbmdCdXR0b24gPSAkKCcjbmV3QnVpbGRpbmdCdXR0b24uYnV0dG9uJyk7XHJcblx0XHRidWlsZGluZ0J1dHRvbi5oaWRlKCk7XHJcblxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAnc3RvcmVCdXR0b24nLFxyXG5cdFx0XHR0ZXh0OiBfKCdHbyB0byB0aGUgU3RvcmUnKSxcclxuXHRcdFx0Y2xpY2s6IFZpbGxhZ2Uub3BlblN0b3JlLFxyXG5cdFx0XHR3aWR0aDogJzgwcHgnLFxyXG5cdFx0XHRjb3N0OiB7fVxyXG5cdFx0fSlcclxuXHRcdC5hZGRDbGFzcygnbG9jYXRpb25CdXR0b24nKVxyXG5cdFx0LmFwcGVuZFRvKCdkaXYjdmlsbGFnZVBhbmVsJyk7XHJcblxyXG5cdFx0dmFyIHN0b3JlQnV0dG9uID0gJCgnI3N0b3JlQnV0dG9uLmJ1dHRvbicpO1xyXG5cdFx0c3RvcmVCdXR0b24uaGlkZSgpO1xyXG5cclxuXHRcdHZhciBsaXpCdXR0b24gPSAkKCcjbGl6QnV0dG9uLmJ1dHRvbicpO1xyXG5cdFx0bGl6QnV0dG9uLmhpZGUoKTtcclxuXHRcdFxyXG5cdFx0Ly8gQ3JlYXRlIHRoZSBzdG9yZXMgY29udGFpbmVyXHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ3N0b3Jlc0NvbnRhaW5lcicpLmFwcGVuZFRvKCdkaXYjdmlsbGFnZVBhbmVsJyk7XHJcblx0XHRcclxuXHRcdC8vc3Vic2NyaWJlIHRvIHN0YXRlVXBkYXRlc1xyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5zdWJzY3JpYmUoVmlsbGFnZS5oYW5kbGVTdGF0ZVVwZGF0ZXMpO1xyXG5cdFx0XHJcblx0XHRWaWxsYWdlLnVwZGF0ZUJ1dHRvbigpO1xyXG5cdH0sXHJcblxyXG5cdHVwZGF0ZURlc2NyaXB0aW9uOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuZGVzY3JpcHRpb25QYW5lbC5lbXB0eSgpO1xyXG5cdFx0dGhpcy5kZXNjcmlwdGlvbiA9IF90YihbXHJcblx0XHRcdF8oXCJOZXN0bGVkIGluIHRoZSB3b29kcywgdGhpcyB2aWxsYWdlIGlzIHNjYXJjZWx5IG1vcmUgdGhhbiBhIGhhbWxldCwgXCIgXHJcblx0XHRcdFx0KyBcImRlc3BpdGUgeW91IHRoaW5raW5nIHRob3NlIHR3byB3b3JkcyBhcmUgc3lub255bXMuIFRoZXkncmUgbm90LCBcIiBcclxuXHRcdFx0XHQrIFwiZ28gZ29vZ2xlICdoYW1sZXQnIHJpZ2h0IG5vdyBpZiB5b3UgZG9uJ3QgYmVsaWV2ZSBtZS5cIiksXHJcblx0XHRcdF8oXCJUaGUgdmlsbGFnZSBpcyBxdWlldCBhdCB0aGUgbW9tZW50OyB0aGVyZSBhcmVuJ3QgZW5vdWdoIGhhbmRzIGZvciBhbnlvbmUgdG8gcmVtYWluIGlkbGUgZm9yIGxvbmcuXCIpLFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dGV4dDogXyhcIkEgc3RvcmVmcm9udCwgc3RhZmZlZCBlbnRpcmVseSBieSBhIHNpbmdsZSBncmlubmluZyBqYWNrYXNzLCBzdGFuZHMgcHJvdWRseSBpbiB0aGUgbWFpbiBzcXVhcmUuXCIpLFxyXG5cdFx0XHRcdGlzVmlzaWJsZTogKCkgPT4ge1xyXG5cdFx0XHRcdFx0cmV0dXJuICRTTS5nZXQoJ1JvYWQuZ290QXBvbG9naXplZCcpICE9PSB1bmRlZmluZWQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRdKTtcclxuXHJcblx0XHRmb3IodmFyIGkgaW4gdGhpcy5kZXNjcmlwdGlvbikge1xyXG5cdFx0XHQkKCc8ZGl2PicpLnRleHQodGhpcy5kZXNjcmlwdGlvbltpXSkuYXBwZW5kVG8odGhpcy5kZXNjcmlwdGlvblBhbmVsKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHt9LCAvLyBOb3RoaW5nIGZvciBub3dcclxuXHJcblx0YXZhaWxhYmxlV2VhdGhlcjoge1xyXG5cdFx0J3N1bm55JzogMC40LFxyXG5cdFx0J2Nsb3VkeSc6IDAuMyxcclxuXHRcdCdyYWlueSc6IDAuM1xyXG5cdH0sXHJcblx0XHJcblx0b25BcnJpdmFsOiBmdW5jdGlvbih0cmFuc2l0aW9uX2RpZmYpIHtcclxuXHRcdFZpbGxhZ2Uuc2V0VGl0bGUoKTtcclxuXHRcdGlmKCRTTS5nZXQoJ2dhbWUuYnVpbGRlci5sZXZlbCcpID09IDMpIHtcclxuXHRcdFx0JFNNLmFkZCgnZ2FtZS5idWlsZGVyLmxldmVsJywgMSk7XHJcblx0XHRcdCRTTS5zZXRJbmNvbWUoJ2J1aWxkZXInLCB7XHJcblx0XHRcdFx0ZGVsYXk6IDEwLFxyXG5cdFx0XHRcdHN0b3Jlczogeyd3b29kJyA6IDIgfVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkoVmlsbGFnZSwgXyhcInRoZSBzdHJhbmdlciBpcyBzdGFuZGluZyBieSB0aGUgZmlyZS4gc2hlIHNheXMgc2hlIGNhbiBoZWxwLiBzYXlzIHNoZSBidWlsZHMgdGhpbmdzLlwiKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy51cGRhdGVEZXNjcmlwdGlvbigpO1xyXG5cdFx0RW5naW5lLm1vdmVTdG9yZXNWaWV3KG51bGwsIHRyYW5zaXRpb25fZGlmZik7XHJcblxyXG5cdFx0V2VhdGhlci5pbml0aWF0ZVdlYXRoZXIoVmlsbGFnZS5hdmFpbGFibGVXZWF0aGVyLCAndmlsbGFnZScpO1xyXG5cdH0sXHJcblx0XHJcblx0VGVtcEVudW06IHtcclxuXHRcdGZyb21JbnQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRcdGZvcih2YXIgayBpbiB0aGlzKSB7XHJcblx0XHRcdFx0aWYodHlwZW9mIHRoaXNba10udmFsdWUgIT0gJ3VuZGVmaW5lZCcgJiYgdGhpc1trXS52YWx1ZSA9PSB2YWx1ZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXNba107XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fSxcclxuXHRcdEZyZWV6aW5nOiB7IHZhbHVlOiAwLCB0ZXh0OiBfKCdmcmVlemluZycpIH0sXHJcblx0XHRDb2xkOiB7IHZhbHVlOiAxLCB0ZXh0OiBfKCdjb2xkJykgfSxcclxuXHRcdE1pbGQ6IHsgdmFsdWU6IDIsIHRleHQ6IF8oJ21pbGQnKSB9LFxyXG5cdFx0V2FybTogeyB2YWx1ZTogMywgdGV4dDogXygnd2FybScpIH0sXHJcblx0XHRIb3Q6IHsgdmFsdWU6IDQsIHRleHQ6IF8oJ2hvdCcpIH1cclxuXHR9LFxyXG5cdFxyXG5cdEZpcmVFbnVtOiB7XHJcblx0XHRmcm9tSW50OiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRmb3IodmFyIGsgaW4gdGhpcykge1xyXG5cdFx0XHRcdGlmKHR5cGVvZiB0aGlzW2tdLnZhbHVlICE9ICd1bmRlZmluZWQnICYmIHRoaXNba10udmFsdWUgPT0gdmFsdWUpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0aGlzW2tdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH0sXHJcblx0XHREZWFkOiB7IHZhbHVlOiAwLCB0ZXh0OiBfKCdkZWFkJykgfSxcclxuXHRcdFNtb2xkZXJpbmc6IHsgdmFsdWU6IDEsIHRleHQ6IF8oJ3Ntb2xkZXJpbmcnKSB9LFxyXG5cdFx0RmxpY2tlcmluZzogeyB2YWx1ZTogMiwgdGV4dDogXygnZmxpY2tlcmluZycpIH0sXHJcblx0XHRCdXJuaW5nOiB7IHZhbHVlOiAzLCB0ZXh0OiBfKCdidXJuaW5nJykgfSxcclxuXHRcdFJvYXJpbmc6IHsgdmFsdWU6IDQsIHRleHQ6IF8oJ3JvYXJpbmcnKSB9XHJcblx0fSxcclxuXHRcclxuXHRzZXRUaXRsZTogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdGl0bGUgPSBfKFwiVGhlIFZpbGxhZ2VcIik7XHJcblx0XHRpZihFbmdpbmUuYWN0aXZlTW9kdWxlID09IHRoaXMpIHtcclxuXHRcdFx0ZG9jdW1lbnQudGl0bGUgPSB0aXRsZTtcclxuXHRcdH1cclxuXHRcdCQoJ2RpdiNsb2NhdGlvbl92aWxsYWdlJykudGV4dCh0aXRsZSk7XHJcblx0fSxcclxuXHRcclxuXHR1cGRhdGVCdXR0b246IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGxpZ2h0ID0gJCgnI2xpZ2h0QnV0dG9uLmJ1dHRvbicpO1xyXG5cdFx0dmFyIHN0b2tlID0gJCgnI3N0b2tlQnV0dG9uLmJ1dHRvbicpO1xyXG5cdFx0aWYoJFNNLmdldCgnZ2FtZS5maXJlLnZhbHVlJykgPT0gVmlsbGFnZS5GaXJlRW51bS5EZWFkLnZhbHVlICYmIHN0b2tlLmNzcygnZGlzcGxheScpICE9ICdub25lJykge1xyXG5cdFx0XHRzdG9rZS5oaWRlKCk7XHJcblx0XHRcdGxpZ2h0LnNob3coKTtcclxuXHRcdFx0aWYoc3Rva2UuaGFzQ2xhc3MoJ2Rpc2FibGVkJykpIHtcclxuXHRcdFx0XHRCdXR0b24uY29vbGRvd24obGlnaHQpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2UgaWYobGlnaHQuY3NzKCdkaXNwbGF5JykgIT0gJ25vbmUnKSB7XHJcblx0XHRcdHN0b2tlLnNob3coKTtcclxuXHRcdFx0bGlnaHQuaGlkZSgpO1xyXG5cdFx0XHRpZihsaWdodC5oYXNDbGFzcygnZGlzYWJsZWQnKSkge1xyXG5cdFx0XHRcdEJ1dHRvbi5jb29sZG93bihzdG9rZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYoISRTTS5nZXQoJ3N0b3Jlcy53b29kJykpIHtcclxuXHRcdFx0bGlnaHQuYWRkQ2xhc3MoJ2ZyZWUnKTtcclxuXHRcdFx0c3Rva2UuYWRkQ2xhc3MoJ2ZyZWUnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxpZ2h0LnJlbW92ZUNsYXNzKCdmcmVlJyk7XHJcblx0XHRcdHN0b2tlLnJlbW92ZUNsYXNzKCdmcmVlJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGxpekJ1dHRvbiA9ICQoJyNsaXpCdXR0b24uYnV0dG9uJyk7XHJcblx0XHRpZigkU00uZ2V0KCd2aWxsYWdlLmxpekFjdGl2ZScpKSBsaXpCdXR0b24uc2hvdygpO1xyXG5cdFx0dmFyIGJ1aWxkaW5nQnV0dG9uID0gJCgnI25ld0J1aWxkaW5nQnV0dG9uLmJ1dHRvbicpO1xyXG5cdFx0aWYoJFNNLmdldCgndmlsbGFnZS5tYXlvci5oYXZlR2l2ZW5TdXBwbGllcycpKSBidWlsZGluZ0J1dHRvbi5zaG93KCk7XHJcblx0XHR2YXIgc3RvcmVCdXR0b24gPSAkKCcjc3RvcmVCdXR0b24uYnV0dG9uJyk7XHJcblx0XHRpZigkU00uZ2V0KCdSb2FkLmdvdEFwb2xvZ2l6ZWQnKSkgc3RvcmVCdXR0b24uc2hvdygpO1xyXG5cdH0sXHJcblx0XHJcblx0XHJcblx0aGFuZGxlU3RhdGVVcGRhdGVzOiBmdW5jdGlvbihlKXtcclxuXHRcdGlmKGUuY2F0ZWdvcnkgPT0gJ3N0b3Jlcycpe1xyXG5cdFx0XHQvLyBWaWxsYWdlLnVwZGF0ZUJ1aWxkQnV0dG9ucygpO1xyXG5cdFx0fSBlbHNlIGlmKGUuY2F0ZWdvcnkgPT0gJ2luY29tZScpe1xyXG5cdFx0fSBlbHNlIGlmKGUuc3RhdGVOYW1lLmluZGV4T2YoJ2dhbWUuYnVpbGRpbmdzJykgPT09IDApe1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHRlbXBCdWlsZGluZ01lc3NhZ2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnQSBOZXcgQnVpbGRpbmcnKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnVGhpcyBpcyBhIG5ldyBidWlsZGluZy4gVGhlcmUgc2hvdWxkIGJlIHN0dWZmIGluIGl0LCBidXQgdGhpcyBpcyBhIHBsYWNlaG9sZGVyIGZvciBub3cuJyksXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnbGVhdmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnTGFtZScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0b3BlblN0b3JlOiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ0EgTmV3IEJ1aWxkaW5nJyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oXCJUaGlzIGlzIHRoZSBzdG9yZS4gVGhlcmUncyBub3RoaW5nIGhlcmUgeWV0LCB0aG91Z2guXCIpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczogIHtcclxuXHRcdFx0XHRcdFx0bGVhdmU6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdMYW1lJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcbn07XHJcbiIsImltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi9CdXR0b25cIjtcclxuaW1wb3J0IHsgSXRlbUxpc3QgfSBmcm9tIFwiLi9pdGVtTGlzdFwiO1xyXG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tIFwiLi4vbm90aWZpY2F0aW9uc1wiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgUXVlc3RMb2cgfSBmcm9tIFwiLi9xdWVzdExvZ1wiO1xyXG5pbXBvcnQgeyBQZXJrTGlzdCB9IGZyb20gXCIuL3BlcmtMaXN0XCI7XHJcblxyXG5leHBvcnQgY29uc3QgQ2hhcmFjdGVyID0ge1xyXG5cdGludmVudG9yeToge30sIC8vIGRpY3Rpb25hcnkgdXNpbmcgaXRlbSBuYW1lIGFzIGtleVxyXG5cdHF1ZXN0U3RhdHVzOiB7fSwgLy8gZGljdGlvbmFyeSB1c2luZyBxdWVzdCBuYW1lIGFzIGtleSwgYW5kIGludGVnZXIgcXVlc3QgcGhhc2UgYXMgdmFsdWVcclxuXHRlcXVpcHBlZEl0ZW1zOiB7XHJcblx0XHQvLyBzdGVhbGluZyB0aGUgS29MIHN0eWxlIGZvciBub3csIHdlJ2xsIHNlZSBpZiBJIG5lZWQgc29tZXRoaW5nXHJcblx0XHQvLyB0aGF0IGZpdHMgdGhlIGdhbWUgYmV0dGVyIGFzIHdlIGdvXHJcblx0XHRoZWFkOiBudWxsLFxyXG5cdFx0dG9yc286IG51bGwsXHJcblx0XHRwYW50czogbnVsbCxcclxuXHRcdC8vIG5vIHdlYXBvbiwgdHJ5IHRvIHNlZSBob3cgZmFyIHdlIGNhbiBnZXQgaW4gdGhpcyBnYW1lIHdpdGhvdXQgZm9jdXNpbmcgb24gY29tYmF0XHJcblx0XHRhY2Nlc3NvcnkxOiBudWxsLFxyXG5cdFx0YWNjZXNzb3J5MjogbnVsbCxcclxuXHRcdGFjY2Vzc29yeTM6IG51bGwsXHJcblx0fSxcclxuXHJcblx0Ly8gc3RhdHMgYmVmb3JlIGFueSBtb2RpZmllcnMgZnJvbSBnZWFyIG9yIHdoYXRldmVyIGVsc2UgYXJlIGFwcGxpZWRcclxuXHRyYXdTdGF0czoge1xyXG5cdFx0J1NwZWVkJzogNSxcclxuXHRcdCdQZXJjZXB0aW9uJzogNSxcclxuXHRcdCdSZXNpbGllbmNlJzogNSxcclxuXHRcdCdJbmdlbnVpdHknOiA1LFxyXG5cdFx0J1RvdWdobmVzcyc6IDVcclxuXHR9LFxyXG5cclxuXHQvLyBwZXJrcyBnaXZlbiBieSBpdGVtcywgY2hhcmFjdGVyIGNob2ljZXMsIGRpdmluZSBwcm92ZW5hbmNlLCBldGMuXHJcblx0cGVya3M6IHsgfSxcclxuXHRwZXJrQXJlYTogbnVsbCxcclxuXHRcclxuXHRpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHRcdFxyXG5cdFx0Ly8gY3JlYXRlIHRoZSBjaGFyYWN0ZXIgYm94XHJcblx0XHRjb25zdCBlbGVtID0gJCgnPGRpdj4nKS5hdHRyKHtcclxuXHRcdFx0aWQ6ICdjaGFyYWN0ZXInLFxyXG5cdFx0XHRjbGFzc05hbWU6ICdjaGFyYWN0ZXInXHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0ZWxlbS5hcHBlbmRUbygnZGl2I3dyYXBwZXInKTtcclxuXHJcblx0XHQvLyB3cml0ZSByYXdTdGF0cyB0byAkU01cclxuXHRcdC8vIE5PVEU6IG5ldmVyIHdyaXRlIGRlcml2ZWQgc3RhdHMgdG8gJFNNLCBhbmQgbmV2ZXIgYWNjZXNzIHJhdyBzdGF0cyBkaXJlY3RseSFcclxuXHRcdC8vIGRvaW5nIHNvIHdpbGwgaW50cm9kdWNlIG9wcG9ydHVuaXRpZXMgdG8gbWVzcyB1cCBzdGF0cyBQRVJNQU5FTlRMWVxyXG4gICAgICAgIGlmICghJFNNLmdldCgnY2hhcmFjdGVyLnJhd3N0YXRzJykpIHtcclxuICAgICAgICAgICAgJFNNLnNldCgnY2hhcmFjdGVyLnJhd3N0YXRzJywgQ2hhcmFjdGVyLnJhd1N0YXRzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cdFx0XHRDaGFyYWN0ZXIucmF3U3RhdHMgPSAkU00uZ2V0KCdjaGFyYWN0ZXIucmF3U3RhdHMnKSBhcyBhbnk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCEkU00uZ2V0KCdjaGFyYWN0ZXIucGVya3MnKSkge1xyXG4gICAgICAgICAgICAkU00uc2V0KCdjaGFyYWN0ZXIucGVya3MnLCBDaGFyYWN0ZXIucGVya3MpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5wZXJrcyA9ICRTTS5nZXQoJ2NoYXJhY3Rlci5wZXJrcycpIGFzIGFueTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoISRTTS5nZXQoJ2NoYXJhY3Rlci5pbnZlbnRvcnknKSkge1xyXG4gICAgICAgICAgICAkU00uc2V0KCdjaGFyYWN0ZXIuaW52ZW50b3J5JywgQ2hhcmFjdGVyLmludmVudG9yeSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHRcdFx0Q2hhcmFjdGVyLmludmVudG9yeSA9ICRTTS5nZXQoJ2NoYXJhY3Rlci5pbnZlbnRvcnknKSBhcyBhbnk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCEkU00uZ2V0KCdjaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcycpKSB7XHJcbiAgICAgICAgICAgICRTTS5zZXQoJ2NoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zJywgQ2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zID0gJFNNLmdldCgnY2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMnKSBhcyBhbnk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCEkU00uZ2V0KCdjaGFyYWN0ZXIucXVlc3RTdGF0dXMnKSkge1xyXG4gICAgICAgICAgICAkU00uc2V0KCdjaGFyYWN0ZXIucXVlc3RTdGF0dXMnLCBDaGFyYWN0ZXIucXVlc3RTdGF0dXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5xdWVzdFN0YXR1cyA9ICRTTS5nZXQoJ2NoYXJhY3Rlci5xdWVzdFN0YXR1cycpIGFzIGFueTtcclxuXHRcdH1cclxuXHJcbiAgICAgICAgJCgnPGRpdj4nKS50ZXh0KCdDaGFyYWN0ZXInKVxyXG5cdFx0LmNzcygndGV4dC1kZWNvcmF0aW9uJywgJ3VuZGVybGluZScpXHJcblx0XHQuYXR0cignaWQnLCAndGl0bGUnKVxyXG5cdFx0LmFwcGVuZFRvKCdkaXYjY2hhcmFjdGVyJyk7XHJcblxyXG5cdFx0Ly8gVE9ETzogcmVwbGFjZSB0aGlzIHdpdGggZGVyaXZlZCBzdGF0c1xyXG4gICAgICAgIGZvcih2YXIgc3RhdCBpbiAkU00uZ2V0KCdjaGFyYWN0ZXIucmF3c3RhdHMnKSBhcyBhbnkpIHtcclxuICAgICAgICAgICAgJCgnPGRpdj4nKS50ZXh0KHN0YXQgKyAnOiAnICsgJFNNLmdldCgnY2hhcmFjdGVyLnJhd3N0YXRzLicgKyBzdGF0KSkuYXBwZW5kVG8oJ2RpdiNjaGFyYWN0ZXInKTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdidXR0b25zJykuY3NzKFwibWFyZ2luLXRvcFwiLCBcIjIwcHhcIikuYXBwZW5kVG8oJ2RpdiNjaGFyYWN0ZXInKTtcclxuXHRcdHZhciBpbnZlbnRvcnlCdXR0b24gPSBCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6IFwiaW52ZW50b3J5XCIsXHJcblx0XHRcdHRleHQ6IFwiSW52ZW50b3J5XCIsXHJcblx0XHRcdGNsaWNrOiBDaGFyYWN0ZXIub3BlbkludmVudG9yeVxyXG5cdFx0fSkuYXBwZW5kVG8oJCgnI2J1dHRvbnMnLCAnZGl2I2NoYXJhY3RlcicpKTtcclxuXHRcdFxyXG5cdFx0dmFyIHF1ZXN0TG9nQnV0dG9uID0gQnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiBcInF1ZXN0TG9nXCIsXHJcblx0XHRcdHRleHQ6IFwiUXVlc3QgTG9nXCIsXHJcblx0XHRcdGNsaWNrOiBDaGFyYWN0ZXIub3BlblF1ZXN0TG9nXHJcblx0XHR9KS5hcHBlbmRUbygkKCcjYnV0dG9ucycsICdkaXYjY2hhcmFjdGVyJykpO1xyXG5cclxuXHRcdHRoaXMucGVya0FyZWEgPSAkKCc8ZGl2PicpLmF0dHIoe1xyXG5cdFx0XHRpZDogJ3BlcmtzJyxcclxuXHRcdFx0Y2xhc3NOYW1lOiAncGVya3MnXHJcblx0XHRcdH0pLmFwcGVuZFRvKCdkaXYjY2hhcmFjdGVyJyk7XHJcblxyXG5cdFx0Ly8gVE9ETzogYWRkIFBlcmtzIGxpc3QgYmVsb3cgaGVyZVxyXG5cdFx0dGhpcy51cGRhdGVQZXJrcygpO1xyXG5cclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdHdpbmRvdy5DaGFyYWN0ZXIgPSB0aGlzO1xyXG5cdH0sXHJcblx0XHJcblx0b3B0aW9uczoge30sIC8vIE5vdGhpbmcgZm9yIG5vd1xyXG5cdFxyXG5cdGVsZW06IG51bGwsXHJcblxyXG5cdGludmVudG9yeURpc3BsYXk6IG51bGwgYXMgYW55LFxyXG5cdHF1ZXN0TG9nRGlzcGxheTogbnVsbCBhcyBhbnksXHJcblxyXG5cdG9wZW5JbnZlbnRvcnk6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gY3JlYXRpbmcgYSBoYW5kbGUgZm9yIGxhdGVyIGFjY2Vzcywgc3VjaCBhcyBjbG9zaW5nIGludmVudG9yeVxyXG5cdFx0Q2hhcmFjdGVyLmludmVudG9yeURpc3BsYXkgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2ludmVudG9yeScpLmFkZENsYXNzKCdldmVudFBhbmVsJykuY3NzKCdvcGFjaXR5JywgJzAnKTtcclxuXHRcdHZhciBpbnZlbnRvcnlEaXNwbGF5ID0gQ2hhcmFjdGVyLmludmVudG9yeURpc3BsYXk7XHJcblx0XHRDaGFyYWN0ZXIuaW52ZW50b3J5RGlzcGxheVxyXG5cdFx0Ly8gc2V0IHVwIGNsaWNrIGFuZCBob3ZlciBoYW5kbGVycyBmb3IgaW52ZW50b3J5IGl0ZW1zXHJcblx0XHQub24oXCJjbGlja1wiLCBcIiNpdGVtXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRDaGFyYWN0ZXIudXNlSW52ZW50b3J5SXRlbSgkKHRoaXMpLmRhdGEoXCJuYW1lXCIpKTtcclxuXHRcdFx0Q2hhcmFjdGVyLmNsb3NlSW52ZW50b3J5KCk7XHJcblx0XHR9KS5vbihcIm1vdXNlZW50ZXJcIiwgXCIjaXRlbVwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHRvb2x0aXAgPSAkKFwiPGRpdiBpZD0ndG9vbHRpcCcgY2xhc3M9J3Rvb2x0aXAnPlwiICsgSXRlbUxpc3RbJCh0aGlzKS5kYXRhKFwibmFtZVwiKV0udGV4dCArIFwiPC9kaXY+XCIpXHJcblx0XHRcdC5hdHRyKCdkYXRhLW5hbWUnLCBpdGVtKTtcclxuXHRcdFx0dG9vbHRpcC5hcHBlbmRUbygkKHRoaXMpKTtcclxuXHRcdH0pLm9uKFwibW91c2VsZWF2ZVwiLCBcIiNpdGVtXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKFwiI3Rvb2x0aXBcIiwgXCIjXCIgKyAkKHRoaXMpLmRhdGEoXCJuYW1lXCIpKS5mYWRlT3V0KCkucmVtb3ZlKCk7XHJcblx0XHR9KTtcclxuXHRcdCQoJzxkaXY+JykuYWRkQ2xhc3MoJ2V2ZW50VGl0bGUnKS50ZXh0KCdJbnZlbnRvcnknKS5hcHBlbmRUbyhpbnZlbnRvcnlEaXNwbGF5KTtcclxuXHRcdHZhciBpbnZlbnRvcnlEZXNjID0gJCgnPGRpdj4nKS50ZXh0KFwiQ2xpY2sgdGhpbmdzIGluIHRoZSBsaXN0IHRvIHVzZSB0aGVtLlwiKVxyXG5cdFx0XHQuaG92ZXIoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIHRvb2x0aXAgPSAkKFwiPGRpdiBpZD0ndG9vbHRpcCcgY2xhc3M9J3Rvb2x0aXAnPlwiICsgXCJOb3QgdGhpcywgdGhvdWdoLlwiICsgXCI8L2Rpdj5cIik7XHJcbiAgICBcdFx0XHR0b29sdGlwLmFwcGVuZFRvKGludmVudG9yeURlc2MpO1xyXG5cdFx0XHR9LCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKFwiI3Rvb2x0aXBcIikuZmFkZU91dCgpLnJlbW92ZSgpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHROb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBfKFwiSSBiZXQgeW91IHRoaW5rIHlvdSdyZSBwcmV0dHkgZnVubnksIGh1aD8gQ2xpY2tpbmcgdGhlIHRoaW5nIEkgc2FpZCB3YXNuJ3QgY2xpY2thYmxlP1wiKSk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5jc3MoXCJtYXJnaW4tYm90dG9tXCIsIFwiMjBweFwiKVxyXG5cdFx0XHQuYXBwZW5kVG8oaW52ZW50b3J5RGlzcGxheSk7XHJcblx0XHRcclxuXHRcdGZvcih2YXIgaXRlbSBpbiBDaGFyYWN0ZXIuaW52ZW50b3J5KSB7XHJcblx0XHRcdC8vIG1ha2UgdGhlIGludmVudG9yeSBjb3VudCBsb29rIGEgYml0IG5pY2VyXHJcblx0XHRcdHZhciBpbnZlbnRvcnlFbGVtID0gJCgnPGRpdj4nKVxyXG5cdFx0XHQuYXR0cignaWQnLCAnaXRlbScpXHJcblx0XHRcdC5hdHRyKCdkYXRhLW5hbWUnLCBpdGVtKVxyXG5cdFx0XHQudGV4dChJdGVtTGlzdFtpdGVtXS5uYW1lICArICcgICh4JyArIENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0udG9TdHJpbmcoKSArICcpJylcclxuXHRcdFx0LmFwcGVuZFRvKGludmVudG9yeURpc3BsYXkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFRPRE86IG1ha2UgdGhpcyBDU1MgYW4gYWN0dWFsIGNsYXNzIHNvbWV3aGVyZSwgSSdtIHN1cmUgSSdsbCBuZWVkIGl0IGFnYWluXHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2J1dHRvbnMnKS5jc3MoXCJtYXJnaW4tdG9wXCIsIFwiMjBweFwiKS5hcHBlbmRUbyhpbnZlbnRvcnlEaXNwbGF5KTtcclxuXHRcdHZhciBiID0gXHJcblx0XHQvL25ldyBcclxuXHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogXCJjbG9zZUludmVudG9yeVwiLFxyXG5cdFx0XHR0ZXh0OiBcIkNsb3NlXCIsXHJcblx0XHRcdGNsaWNrOiBDaGFyYWN0ZXIuY2xvc2VJbnZlbnRvcnlcclxuXHRcdH0pLmFwcGVuZFRvKCQoJyNidXR0b25zJywgaW52ZW50b3J5RGlzcGxheSkpO1xyXG5cdFx0JCgnZGl2I3dyYXBwZXInKS5hcHBlbmQoaW52ZW50b3J5RGlzcGxheSk7XHJcblx0XHRpbnZlbnRvcnlEaXNwbGF5LmFuaW1hdGUoe29wYWNpdHk6IDF9LCBFdmVudHMuX1BBTkVMX0ZBREUsICdsaW5lYXInKTtcclxuXHR9LFxyXG5cclxuXHRjbG9zZUludmVudG9yeTogZnVuY3Rpb24oKSB7XHJcblx0XHRDaGFyYWN0ZXIuaW52ZW50b3J5RGlzcGxheS5lbXB0eSgpO1xyXG5cdFx0Q2hhcmFjdGVyLmludmVudG9yeURpc3BsYXkucmVtb3ZlKCk7XHJcblx0fSxcclxuXHJcblx0YWRkVG9JbnZlbnRvcnk6IGZ1bmN0aW9uKGl0ZW0sIGFtb3VudD0xKSB7XHJcblx0XHRpZiAoQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSkge1xyXG5cdFx0XHRDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dICs9IGFtb3VudDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0gPSBhbW91bnQ7XHJcblx0XHR9XHJcblxyXG5cdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJBZGRlZCBcIiArIEl0ZW1MaXN0W2l0ZW1dLm5hbWUgKyBcIiB0byBpbnZlbnRvcnkuXCIpXHJcblx0XHQkU00uc2V0KCdpbnZlbnRvcnknLCBDaGFyYWN0ZXIuaW52ZW50b3J5KTtcclxuXHR9LFxyXG5cclxuXHJcblx0cmVtb3ZlRnJvbUludmVudG9yeTogZnVuY3Rpb24oaXRlbSwgYW1vdW50PTEpIHtcclxuXHRcdGlmIChDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dKSBDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dIC09IGFtb3VudDtcclxuXHRcdGlmIChDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dIDwgMSkge1xyXG5cdFx0XHRkZWxldGUgQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXTtcclxuXHRcdH1cclxuXHJcblx0XHROb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIlJlbW92ZWQgXCIgKyBJdGVtTGlzdFtpdGVtXS5uYW1lICsgXCIgZnJvbSBpbnZlbnRvcnkuXCIpXHJcblx0XHQkU00uc2V0KCdpbnZlbnRvcnknLCBDaGFyYWN0ZXIuaW52ZW50b3J5KTtcclxuXHR9LFxyXG5cclxuXHR1c2VJbnZlbnRvcnlJdGVtOiBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRpZiAoQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSAmJiBDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dID4gMCkge1xyXG5cdFx0XHQvLyB1c2UgdGhlIGVmZmVjdCBpbiB0aGUgaW52ZW50b3J5OyBqdXN0IGluIGNhc2UgYSBuYW1lIG1hdGNoZXMgYnV0IHRoZSBlZmZlY3RcclxuXHRcdFx0Ly8gZG9lcyBub3QsIGFzc3VtZSB0aGUgaW52ZW50b3J5IGl0ZW0gaXMgdGhlIHNvdXJjZSBvZiB0cnV0aFxyXG5cdFx0XHRJdGVtTGlzdFtpdGVtXS5vblVzZSgpO1xyXG5cdFx0XHRpZiAodHlwZW9mKEl0ZW1MaXN0W2l0ZW1dLmRlc3Ryb3lPblVzZSkgPT0gXCJmdW5jdGlvblwiICYmIEl0ZW1MaXN0W2l0ZW1dLmRlc3Ryb3lPblVzZSgpKSB7XHJcblx0XHRcdFx0Q2hhcmFjdGVyLnJlbW92ZUZyb21JbnZlbnRvcnkoaXRlbSk7XHJcblx0XHRcdH0gZWxzZSBpZiAoSXRlbUxpc3RbaXRlbV0uZGVzdHJveU9uVXNlKSB7XHJcblx0XHRcdFx0Q2hhcmFjdGVyLnJlbW92ZUZyb21JbnZlbnRvcnkoaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQkU00uc2V0KCdpbnZlbnRvcnknLCBDaGFyYWN0ZXIuaW52ZW50b3J5KTtcclxuXHR9LFxyXG5cclxuXHRlcXVpcEl0ZW06IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdGlmIChJdGVtTGlzdFtpdGVtXS5zbG90ICYmIENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zW0l0ZW1MaXN0W2l0ZW1dLnNsb3RdICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0Q2hhcmFjdGVyLmFkZFRvSW52ZW50b3J5KENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zW0l0ZW1MaXN0W2l0ZW1dLnNsb3RdKTtcclxuXHRcdFx0Q2hhcmFjdGVyLmVxdWlwcGVkSXRlbXNbSXRlbUxpc3RbaXRlbV0uc2xvdF0gPSBpdGVtO1xyXG5cdFx0XHRpZiAoSXRlbUxpc3RbaXRlbV0ub25FcXVpcCkge1xyXG5cdFx0XHRcdEl0ZW1MaXN0W2l0ZW1dLm9uRXF1aXAoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRDaGFyYWN0ZXIuYXBwbHlFcXVpcG1lbnRFZmZlY3RzKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0JFNNLnNldCgnZXF1aXBwZWRJdGVtcycsIENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zKTtcclxuXHRcdCRTTS5zZXQoJ2ludmVudG9yeScsIENoYXJhY3Rlci5pbnZlbnRvcnkpO1xyXG5cdH0sXHJcblxyXG5cdGdyYW50UGVyazogZnVuY3Rpb24ocGVyaykge1xyXG5cdFx0aWYgKENoYXJhY3Rlci5wZXJrc1twZXJrXSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGlmKHBlcmsudGltZUxlZnQgPiAwKSB7XHJcblx0XHRcdFx0Q2hhcmFjdGVyLnBlcmtzW3BlcmtdICs9IHBlcmsudGltZUxlZnQ7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5wZXJrc1twZXJrXSA9IHBlcms7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy51cGRhdGVQZXJrcygpO1xyXG5cclxuXHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KCdudWxsJywgXCJBY3F1aXJlZCBlZmZlY3Q6IFwiICsgUGVya0xpc3RbcGVya10ubmFtZSk7XHJcblx0XHRcclxuXHRcdCRTTS5zZXQoJ3BlcmtzJywgQ2hhcmFjdGVyLnBlcmtzKTtcclxuXHR9LFxyXG5cclxuXHRyZW1vdmVQZXJrOiBmdW5jdGlvbihwZXJrKSB7XHJcblx0XHRpZiAoQ2hhcmFjdGVyLnBlcmtzW3BlcmsubmFtZV0gIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRkZWxldGUgQ2hhcmFjdGVyLnBlcmtzW3BlcmsubmFtZV07XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy51cGRhdGVQZXJrcygpO1xyXG5cclxuXHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KCdudWxsJywgXCJMb3N0IGVmZmVjdDogXCIgKyBQZXJrTGlzdFtwZXJrXS5uYW1lKTtcclxuXHJcblx0XHQkU00uc2V0KCdwZXJrcycsIENoYXJhY3Rlci5wZXJrcyk7XHJcblx0fSxcclxuXHJcblx0dXBkYXRlUGVya3M6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5wZXJrQXJlYS5lbXB0eSgpO1xyXG5cdFx0aWYgKE9iamVjdC5rZXlzKHRoaXMucGVya3MpLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0JCgnPGRpdj4nKS50ZXh0KCdQZXJrcycpXHJcblx0XHRcdC5jc3MoJ3RleHQtZGVjb3JhdGlvbicsICd1bmRlcmxpbmUnKVxyXG5cdFx0XHQuY3NzKCdtYXJnaW4tdG9wJywgJzEwcHgnKVxyXG5cdFx0XHQuYXR0cignaWQnLCAndGl0bGUnKVxyXG5cdFx0XHQuYXBwZW5kVG8oJ2RpdiNwZXJrcycpO1xyXG5cdFx0XHQvLyBzZXQgdXAgY2xpY2sgYW5kIGhvdmVyIGhhbmRsZXJzIGZvciBwZXJrc1xyXG5cdFx0dGhpcy5wZXJrQXJlYVxyXG5cdFx0Lm9uKFwiY2xpY2tcIiwgXCIjcGVya1wiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly8gaGFuZGxlIHRoaXMgd2hlbiB3ZSBoYXZlIHBlcmsgZGVzY3JpcHRpb25zIGFuZCBzdHVmZlxyXG5cdFx0fSkub24oXCJtb3VzZWVudGVyXCIsIFwiI3BlcmtcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciB0b29sdGlwID0gJChcIjxkaXYgaWQ9J3Rvb2x0aXAnIGNsYXNzPSd0b29sdGlwJz5cIiArIFBlcmtMaXN0WyQodGhpcykuZGF0YShcIm5hbWVcIildLnRleHQgKyBcIjwvZGl2PlwiKVxyXG5cdFx0XHQuYXR0cignZGF0YS1uYW1lJywgcGVyayk7XHJcblx0XHRcdHRvb2x0aXAuYXBwZW5kVG8oJCh0aGlzKSk7XHJcblx0XHR9KS5vbihcIm1vdXNlbGVhdmVcIiwgXCIjcGVya1wiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0JChcIiN0b29sdGlwXCIsIFwiI1wiICsgJCh0aGlzKS5kYXRhKFwibmFtZVwiKSkuZmFkZU91dCgpLnJlbW92ZSgpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0XHRmb3IodmFyIHBlcmsgaW4gQ2hhcmFjdGVyLnBlcmtzKSB7XHJcblx0XHRcdFx0Ly8gYWRkIG1vdXNlb3ZlciBhbmQgY2xpY2sgc3R1ZmZcclxuXHRcdFx0XHR2YXIgcGVya0VsZW0gPSAkKCc8ZGl2PicpXHJcblx0XHRcdFx0LmF0dHIoJ2lkJywgJ3BlcmsnKVxyXG5cdFx0XHRcdC5hdHRyKCdkYXRhLW5hbWUnLCBwZXJrKVxyXG5cdFx0XHRcdC50ZXh0KFBlcmtMaXN0W3BlcmtdLm5hbWUpXHJcblx0XHRcdFx0LmFwcGVuZFRvKCdkaXYjcGVya3MnKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdG9wZW5RdWVzdExvZzogZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBjcmVhdGluZyBhIGhhbmRsZSBmb3IgbGF0ZXIgYWNjZXNzLCBzdWNoIGFzIGNsb3NpbmcgcXVlc3QgbG9nXHJcblx0XHRDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5ID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdxdWVzdCcpLmFkZENsYXNzKCdldmVudFBhbmVsJykuY3NzKCdvcGFjaXR5JywgJzAnKTtcclxuXHRcdHZhciBxdWVzdExvZ0Rpc3BsYXkgPSBDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5O1xyXG5cdFx0Q2hhcmFjdGVyLnF1ZXN0TG9nRGlzcGxheVxyXG5cdFx0Ly8gc2V0IHVwIGNsaWNrIGFuZCBob3ZlciBoYW5kbGVycyBmb3IgcXVlc3RzXHJcblx0XHQub24oXCJjbGlja1wiLCBcIiNxdWVzdFwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0Q2hhcmFjdGVyLmRpc3BsYXlRdWVzdCgkKHRoaXMpLmRhdGEoXCJuYW1lXCIpKTtcclxuXHRcdH0pO1xyXG5cdFx0JCgnPGRpdj4nKS5hZGRDbGFzcygnZXZlbnRUaXRsZScpLnRleHQoJ1F1ZXN0IExvZycpLmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHR2YXIgcXVlc3RMb2dEZXNjID0gJCgnPGRpdj4nKS50ZXh0KFwiQ2xpY2sgcXVlc3QgbmFtZXMgdG8gc2VlIG1vcmUgaW5mby5cIilcclxuXHRcdFx0LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCIyMHB4XCIpXHJcblx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0XHJcblx0XHRmb3IodmFyIHF1ZXN0IGluIENoYXJhY3Rlci5xdWVzdFN0YXR1cykge1xyXG5cdFx0XHR2YXIgcXVlc3RFbGVtID0gJCgnPGRpdj4nKVxyXG5cdFx0XHQuYXR0cignaWQnLCBcInF1ZXN0XCIpXHJcblx0XHRcdC5hdHRyKCdkYXRhLW5hbWUnLCBxdWVzdClcclxuXHRcdFx0LnRleHQoUXVlc3RMb2dbcXVlc3RdLm5hbWUpXHJcblx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0XHRpZiAoQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW3F1ZXN0XSA9PSAtMSkge1xyXG5cdFx0XHRcdHF1ZXN0RWxlbVxyXG5cdFx0XHRcdC8vIEkgd2FudCB0aGlzIHRvIGJlIG5vdCBzdHJ1Y2sgdGhyb3VnaCwgYnV0IHRoYXQncyB0b28gYW5ub3lpbmcgdG8gd29ycnlcclxuXHRcdFx0XHQvLyBhYm91dCByaWdodCBub3dcclxuXHRcdFx0XHQvLyAucHJlcGVuZChcIkRPTkUgXCIpXHJcblx0XHRcdFx0LndyYXAoXCI8c3RyaWtlPlwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFRPRE86IG1ha2UgdGhpcyBDU1MgYW4gYWN0dWFsIGNsYXNzIHNvbWV3aGVyZSwgSSdtIHN1cmUgSSdsbCBuZWVkIGl0IGFnYWluXHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2J1dHRvbnMnKS5jc3MoXCJtYXJnaW4tdG9wXCIsIFwiMjBweFwiKS5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0dmFyIGIgPSBCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6IFwiY2xvc2VRdWVzdExvZ1wiLFxyXG5cdFx0XHR0ZXh0OiBcIkNsb3NlXCIsXHJcblx0XHRcdGNsaWNrOiBDaGFyYWN0ZXIuY2xvc2VRdWVzdExvZ1xyXG5cdFx0fSkuYXBwZW5kVG8oJCgnI2J1dHRvbnMnLCBxdWVzdExvZ0Rpc3BsYXkpKTtcclxuXHRcdCQoJ2RpdiN3cmFwcGVyJykuYXBwZW5kKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHRxdWVzdExvZ0Rpc3BsYXkuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIEV2ZW50cy5fUEFORUxfRkFERSwgJ2xpbmVhcicpO1xyXG5cdH0sXHJcblxyXG5cdGRpc3BsYXlRdWVzdDogZnVuY3Rpb24ocXVlc3Q6IHN0cmluZykge1xyXG5cdFx0Y29uc3QgcXVlc3RMb2dEaXNwbGF5ID0gQ2hhcmFjdGVyLnF1ZXN0TG9nRGlzcGxheTtcclxuXHRcdHF1ZXN0TG9nRGlzcGxheS5lbXB0eSgpO1xyXG5cdFx0Y29uc3QgY3VycmVudFF1ZXN0ID0gUXVlc3RMb2dbcXVlc3RdO1xyXG5cclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAncXVlc3QnKS5hZGRDbGFzcygnZXZlbnRQYW5lbCcpLmNzcygnb3BhY2l0eScsICcwJyk7XHJcblx0XHQkKCc8ZGl2PicpLmFkZENsYXNzKCdldmVudFRpdGxlJykudGV4dChjdXJyZW50UXVlc3QubmFtZSkuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHJcblx0XHR2YXIgcXVlc3RMb2dEZXNjID0gJCgnPGRpdj4nKS50ZXh0KGN1cnJlbnRRdWVzdC5sb2dEZXNjcmlwdGlvbilcclxuXHRcdFx0LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCIyMHB4XCIpXHJcblx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cclxuXHRcdGlmIChDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdIGFzIG51bWJlciA9PSAtMSkge1xyXG5cdFx0XHR2YXIgcGhhc2VEZXNjID0gJCgnPGRpdj4nKS50ZXh0KFwiVGhpcyBxdWVzdCBpcyBjb21wbGV0ZSFcIilcclxuXHRcdFx0LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCIxMHB4XCIpXHJcblx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDw9IChDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdIGFzIG51bWJlcik7IGkrKykge1xyXG5cdFx0XHR2YXIgcGhhc2VEZXNjID0gJCgnPGRpdj4nKS50ZXh0KGN1cnJlbnRRdWVzdC5waGFzZXNbaV0uZGVzY3JpcHRpb24pXHJcblx0XHRcdC5jc3MoXCJtYXJnaW4tYm90dG9tXCIsIFwiMTBweFwiKVxyXG5cdFx0XHQuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHRcdFx0dmFyIGNvbXBsZXRlID0gdHJ1ZTtcclxuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBPYmplY3Qua2V5cyhjdXJyZW50UXVlc3QucGhhc2VzW2ldLnJlcXVpcmVtZW50cykubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHR2YXIgcmVxdWlyZW1lbnRzRGVzYyA9ICQoJzxkaXY+JykudGV4dChjdXJyZW50UXVlc3QucGhhc2VzW2ldLnJlcXVpcmVtZW50c1tqXS5yZW5kZXJSZXF1aXJlbWVudCgpKVxyXG5cdFx0XHRcdFx0LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCIyMHB4XCIpXHJcblx0XHRcdFx0XHQuY3NzKFwibWFyZ2luLWxlZnRcIiwgXCIyMHB4XCIpXHJcblx0XHRcdFx0XHQuY3NzKCdmb250LXN0eWxlJywgJ2l0YWxpYycpXHJcblx0XHRcdFx0XHQuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHRcdFx0XHRpZiAoIWN1cnJlbnRRdWVzdC5waGFzZXNbaV0ucmVxdWlyZW1lbnRzW2pdLmlzQ29tcGxldGUoKSkgY29tcGxldGUgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoY29tcGxldGUpIHtcclxuXHRcdFx0XHRwaGFzZURlc2Mud3JhcChcIjxzdHJpa2U+XCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVE9ETzogbWFrZSB0aGlzIENTUyBhbiBhY3R1YWwgY2xhc3Mgc29tZXdoZXJlLCBJJ20gc3VyZSBJJ2xsIG5lZWQgaXQgYWdhaW5cclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnYnV0dG9ucycpLmNzcyhcIm1hcmdpbi10b3BcIiwgXCIyMHB4XCIpLmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblxyXG5cdFx0dmFyIGIgPSBCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6IFwiYmFja1RvUXVlc3RMb2dcIixcclxuXHRcdFx0dGV4dDogXCJCYWNrIHRvIFF1ZXN0IExvZ1wiLFxyXG5cdFx0XHRjbGljazogQ2hhcmFjdGVyLmJhY2tUb1F1ZXN0TG9nXHJcblx0XHR9KS5hcHBlbmRUbygkKCcjYnV0dG9ucycsIHF1ZXN0TG9nRGlzcGxheSkpO1xyXG5cclxuXHRcdHZhciBiID0gQnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiBcImNsb3NlUXVlc3RMb2dcIixcclxuXHRcdFx0dGV4dDogXCJDbG9zZVwiLFxyXG5cdFx0XHRjbGljazogQ2hhcmFjdGVyLmNsb3NlUXVlc3RMb2dcclxuXHRcdH0pLmFwcGVuZFRvKCQoJyNidXR0b25zJywgcXVlc3RMb2dEaXNwbGF5KSk7XHJcblx0fSxcclxuXHJcblx0Y2xvc2VRdWVzdExvZzogZnVuY3Rpb24oKSB7XHJcblx0XHRDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5LmVtcHR5KCk7XHJcblx0XHRDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5LnJlbW92ZSgpO1xyXG5cdH0sXHJcblxyXG5cdGJhY2tUb1F1ZXN0TG9nOiBmdW5jdGlvbigpIHtcclxuXHRcdENoYXJhY3Rlci5jbG9zZVF1ZXN0TG9nKCk7XHJcblx0XHRDaGFyYWN0ZXIub3BlblF1ZXN0TG9nKCk7XHJcblx0fSxcclxuXHJcblx0c2V0UXVlc3RTdGF0dXM6IGZ1bmN0aW9uKHF1ZXN0LCBwaGFzZSkge1xyXG5cdFx0Ly8gbWlnaHQgYmUgYSBnb29kIGlkZWEgdG8gY2hlY2sgZm9yIGxpbmVhciBxdWVzdCBwcm9ncmVzc2lvbiBoZXJlP1xyXG5cdFx0aWYgKFF1ZXN0TG9nW3F1ZXN0XSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdENoYXJhY3Rlci5xdWVzdFN0YXR1c1txdWVzdF0gPSBwaGFzZTtcclxuXHJcblx0XHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiUXVlc3QgTG9nIHVwZGF0ZWQuXCIpO1xyXG5cdFx0XHQkU00uc2V0KCdxdWVzdFN0YXR1cycsIENoYXJhY3Rlci5xdWVzdFN0YXR1cyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Y2hlY2tRdWVzdFN0YXR1czogZnVuY3Rpb24ocXVlc3QpIHtcclxuXHRcdGNvbnN0IGN1cnJlbnRQaGFzZSA9IFF1ZXN0TG9nW3F1ZXN0XS5waGFzZXNbQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW3F1ZXN0XV07XHJcblxyXG5cdFx0aWYgKGN1cnJlbnRQaGFzZSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG5cdFx0dmFyIGNvbXBsZXRlID0gdHJ1ZTtcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgT2JqZWN0LmtleXMoY3VycmVudFBoYXNlLnJlcXVpcmVtZW50cykubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKCFjdXJyZW50UGhhc2UucmVxdWlyZW1lbnRzW2ldLmlzQ29tcGxldGUoKSlcclxuXHRcdFx0XHRjb21wbGV0ZSA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGlmIHRoZXJlIGlzIGEgbmV4dCBwaGFzZSwgc2V0IHF1ZXN0U3RhdHVzIHRvIGl0XHJcblx0XHRpZiAoUXVlc3RMb2dbcXVlc3RdLnBoYXNlc1tDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdICsgMV0gIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdICs9IDE7XHJcblx0XHR9IGVsc2UgeyAvLyBlbHNlIHNldCBpdCB0byBjb21wbGV0ZVxyXG5cdFx0XHRDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdID0gLTE7XHJcblx0XHR9XHJcblxyXG5cdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJRdWVzdCBMb2cgdXBkYXRlZC5cIik7XHJcblx0XHQkU00uc2V0KCdxdWVzdFN0YXR1cycsIENoYXJhY3Rlci5xdWVzdFN0YXR1cyk7XHJcblx0fSxcclxuXHJcblx0Ly8gYXBwbHkgZXF1aXBtZW50IGVmZmVjdHMsIHdoaWNoIHNob3VsZCBhbGwgY2hlY2sgYWdhaW5zdCAkU00gc3RhdGUgdmFyaWFibGVzO1xyXG5cdC8vIHRoaXMgc2hvdWxkIGJlIGNhbGxlZCBvbiBiYXNpY2FsbHkgZXZlcnkgcGxheWVyIGFjdGlvbiB3aGVyZSBhIHBpZWNlIG9mIGdlYXJcclxuXHQvLyB3b3VsZCBkbyBzb21ldGhpbmcgb3IgY2hhbmdlIGFuIG91dGNvbWU7IGdpdmUgZXh0cmFQYXJhbXMgdG8gdGhlIGVmZmVjdCBiZWluZyBcclxuXHQvLyBhcHBsaWVkIGZvciBhbnl0aGluZyB0aGF0J3MgcmVsZXZhbnQgdG8gdGhlIGVmZmVjdCBidXQgbm90IGhhbmRsZWQgYnkgJFNNXHJcblx0YXBwbHlFcXVpcG1lbnRFZmZlY3RzOiBmdW5jdGlvbihleHRyYVBhcmFtcz8pIHtcclxuXHRcdGZvciAoY29uc3QgaXRlbSBpbiBDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcykge1xyXG5cdFx0XHRpZiAoSXRlbUxpc3RbaXRlbV0uZWZmZWN0cykge1xyXG5cdFx0XHRcdGZvciAoY29uc3QgZWZmZWN0IGluIEl0ZW1MaXN0W2l0ZW1dLmVmZmVjdHMpIHtcclxuXHRcdFx0XHRcdC8vIE5PVEU6IGN1cnJlbnRseSB0aGlzIGlzIGdvb2QgZm9yIGFwcGx5aW5nIHBlcmtzIGFuZCBOb3RpZnlpbmc7XHJcblx0XHRcdFx0XHQvLyBhcmUgdGhlcmUgb3RoZXIgc2l0dWF0aW9ucyB3aGVyZSB3ZSdkIHdhbnQgdG8gYXBwbHkgZWZmZWN0cyxcclxuXHRcdFx0XHRcdC8vIG9yIGNhbiB3ZSBjb3ZlciBiYXNpY2FsbHkgZXZlcnkgY2FzZSB2aWEgdGhvc2UgdGhpbmdzP1xyXG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdFx0aWYgKGVmZmVjdC5pc0FjdGl2ZSAmJiBlZmZlY3QuaXNBY3RpdmUoZXh0cmFQYXJhbXMpKSBlZmZlY3QuYXBwbHkoZXh0cmFQYXJhbXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8vIGdldCBzdGF0cyBhZnRlciBhcHBseWluZyBhbGwgZXF1aXBtZW50IGJvbnVzZXMsIHBlcmtzLCBldGMuXHJcblx0Z2V0RGVyaXZlZFN0YXRzOiBmdW5jdGlvbigpIHtcclxuXHRcdGNvbnN0IGRlcml2ZWRTdGF0cyA9IHN0cnVjdHVyZWRDbG9uZShDaGFyYWN0ZXIucmF3U3RhdHMpO1xyXG5cdFx0Zm9yIChjb25zdCBpdGVtIGluIENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zKSB7XHJcblx0XHRcdGlmIChJdGVtTGlzdFtpdGVtXS5zdGF0Qm9udXNlcykge1xyXG5cdFx0XHRcdGZvciAoY29uc3Qgc3RhdCBpbiBPYmplY3Qua2V5cyhJdGVtTGlzdFtpdGVtXS5zdGF0Qm9udXNlcykpIHtcclxuXHRcdFx0XHRcdGlmICh0eXBlb2YgKEl0ZW1MaXN0W2l0ZW1dLnN0YXRCb251c2VzW3N0YXRdID09IFwiZnVuY3Rpb25cIikpIHtcclxuXHRcdFx0XHRcdFx0ZGVyaXZlZFN0YXRzW3N0YXRdICs9IEl0ZW1MaXN0W2l0ZW1dLnN0YXRCb251c2VzW3N0YXRdKCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRkZXJpdmVkU3RhdHNbc3RhdF0gKz0gSXRlbUxpc3RbaXRlbV0uc3RhdEJvbnVzZXNbc3RhdF07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yIChjb25zdCBwZXJrIGluIENoYXJhY3Rlci5wZXJrcykge1xyXG5cdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdGlmIChwZXJrLnN0YXRCb251c2VzKSB7XHJcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdGZvciAoY29uc3Qgc3RhdCBpbiBPYmplY3Qua2V5cyhwZXJrLnN0YXRCb251c2VzKSkge1xyXG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiAocGVyay5zdGF0Qm9udXNlc1tzdGF0XSA9PSBcImZ1bmN0aW9uXCIpKSB7XHJcblx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdFx0XHRcdFx0ZGVyaXZlZFN0YXRzW3N0YXRdICs9IHBlcmsuc3RhdEJvbnVzZXNbc3RhdF0oKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdFx0XHRcdFx0ZGVyaXZlZFN0YXRzW3N0YXRdICs9IHBlcmsuc3RhdEJvbnVzZXNbc3RhdF07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGRlcml2ZWRTdGF0cztcclxuXHR9XHJcbn0iLCIvLyBhbGwgaXRlbXMgZ28gaGVyZSwgc28gdGhhdCBub3RoaW5nIHNpbGx5IGhhcHBlbnMgaW4gdGhlIGV2ZW50IHRoYXQgdGhleSBnZXQgcHV0IGluIExvY2FsIFN0b3JhZ2VcclxuLy8gYXMgcGFydCBvZiB0aGUgc3RhdGUgbWFuYWdlbWVudCBjb2RlOyBwbGVhc2Ugc2F2ZSBpdGVtIG5hbWVzIHRvIHRoZSBpbnZlbnRvcnksIGFuZCB0aGVuIHJlZmVyIHRvIFxyXG4vLyB0aGUgaXRlbSBsaXN0IHZpYSB0aGUgaXRlbSBuYW1lXHJcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4vY2hhcmFjdGVyXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBOb3RpZmljYXRpb25zIH0gZnJvbSBcIi4uL25vdGlmaWNhdGlvbnNcIjtcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gXCIuL2l0ZW1cIjtcclxuXHJcbi8vIERldGFpbHMgZm9yIGFsbCBpbi1nYW1lIGl0ZW1zOyB0aGUgQ2hhcmFjdGVyIGludmVudG9yeSBvbmx5IGhvbGRzIGl0ZW0gSURzXHJcbi8vIGFuZCBhbW91bnRzXHJcbmV4cG9ydCBjb25zdCBJdGVtTGlzdDoge1tpZDogc3RyaW5nXTogSXRlbX0gPSB7XHJcbiAgICBcIkxpei53ZWlyZEJvb2tcIjoge1xyXG4gICAgICAgIG5hbWU6ICdXZWlyZCBCb29rJyxcclxuICAgICAgICBwbHVyYWxOYW1lOiAnV2VpcmQgQm9va3MnLFxyXG4gICAgICAgIHRleHQ6IF8oJ0EgYm9vayB5b3UgZm91bmQgYXQgTGl6XFwncyBwbGFjZS4gU3VwcG9zZWRseSBoYXMgaW5mb3JtYXRpb24gYWJvdXQgQ2hhZHRvcGlhLicpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHsgXHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAgXyhcIkEgQnJpZWYgSGlzdG9yeSBvZiBDaGFkdG9waWFcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKCdUaGlzIGJvb2sgaXMgcHJldHR5IGJvcmluZywgYnV0IHlvdSBtYW5hZ2UgdG8gbGVhcm4gYSBiaXQgbW9yZSBpbiBzcGl0ZSBvZiB5b3VyIHBvb3IgYXR0ZW50aW9uIHNwYW4uJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKCdGb3IgZXhhbXBsZSwgeW91IGxlYXJuIHRoYXQgXCJDaGFkdG9waWFcIiBkb2VzblxcJ3QgaGF2ZSBhIGNhcGl0YWwgXFwnVFxcJy4gVGhhdFxcJ3MgcHJldHR5IGNvb2wsIGh1aD8nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oJy4uLiBXaGF0IHdlcmUgeW91IGRvaW5nIGFnYWluPycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1NvbWV0aGluZyBjb29sZXIgdGhhbiByZWFkaW5nLCBwcm9iYWJseScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiAoKSA9PiBDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoXCJMaXouYm9yaW5nQm9va1wiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IHRydWUsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG5cclxuICAgIFwiTGl6LmJvcmluZ0Jvb2tcIjoge1xyXG4gICAgICAgIG5hbWU6ICdcIkEgQnJpZWYgSGlzdG9yeSBvZiBDaGFkdG9waWFcIicsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ011bHRpcGxlIGNvcGllcyBvZiBcIkEgQnJpZWYgSGlzdG9yeSBvZiBDaGFkdG9waWFcIicsXHJcbiAgICAgICAgdGV4dDogXygnTWFuLCB0aGlzIGJvb2sgaXMgYm9yaW5nLicpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IF8oXCJBIEJyaWVmIFN1bW1hcnkgb2YgYSBCcmllZiBIaXN0b3J5IG9mIENoYWR0b3BpYVwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtfKCdJdFxcJ3Mgc3RpbGwganVzdCBhcyBib3JpbmcgYXMgd2hlbiB5b3UgbGFzdCB0cmllZCB0byByZWFkIGl0LicpXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnRGFuZy4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIFwiU3RyYW5nZXIuc21vb3RoU3RvbmVcIjoge1xyXG4gICAgICAgIG5hbWU6ICdhIHNtb290aCBibGFjayBzdG9uZScsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ3Ntb290aCBibGFjayBzdG9uZXMnLFxyXG4gICAgICAgIHRleHQ6IF8oJ0l0XFwncyB3ZWlyZGx5IGVlcmllJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAoISRTTS5nZXQoJ2tub3dsZWRnZS5TdHJhbmdlci5zbW9vdGhTdG9uZScpKSB7XHJcbiAgICAgICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCAnWW91IGhhdmUgbm8gaWRlYSB3aGF0IHRvIGRvIHdpdGggdGhpcyB0aGluZy4nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEgc21vb3RoIGJsYWNrIHN0b25lXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW18oXCJJJ20gZ2VudWluZWx5IG5vdCBzdXJlIGhvdyB5b3UgZ290IHRvIHRoaXMgZXZlbnQsIGJ1dCBwbGVhc2UgbGV0IG1lIGtub3cgdmlhIEdpdEh1YiBpc3N1ZSwgeW91IGxpdHRsZSBzdGlua2VyLlwiKV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0kgc3dlYXIgdG8gZG8gdGhpcywgYXMgYSByZXNwb25zaWJsZSBjaXRpemVuIG9mIEVhcnRoJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveU9uVXNlOiBmYWxzZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH0sXHJcbiAgICBcIlN0cmFuZ2VyLndyYXBwZWRLbmlmZVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ2Ega25pZmUgd3JhcHBlZCBpbiBjbG90aCcsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ0tuaXZlcyB3cmFwcGVkIGluIHNlcGFyYXRlIGNsb3RocycsXHJcbiAgICAgICAgdGV4dDogXygnTWFuLCBJIGhvcGUgaXRcXCdzIG5vdCBhbGwgbGlrZSwgYmxvb2R5IG9uIHRoZSBibGFkZSBhbmQgc3R1ZmYuJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEga25pZmUgd3JhcHBlZCBpbiBjbG90aFwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtfKFwiWW91IHVud3JhcCB0aGUga25pZmUgY2FyZWZ1bGx5LiBJdCBzZWVtcyB0byBiZSBoaWdobHkgb3JuYW1lbnRlZCwgYW5kIHlvdSBjb3VsZCBwcm9iYWJseSBkbyBzb21lIGNyaW1lcyB3aXRoIGl0LlwiKV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0hlbGwgeWVhaCwgQWRvbGYgTG9vcyBzdHlsZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiAoKSA9PiBDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoXCJTdHJhbmdlci5zaWx2ZXJLbmlmZVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IHRydWUsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgXCJTdHJhbmdlci5zaWx2ZXJLbmlmZVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ2Egc2lsdmVyIGtuaWZlJyxcclxuICAgICAgICBwbHVyYWxOYW1lOiAnc2lsdmVyIGtuaXZlcycsXHJcbiAgICAgICAgdGV4dDogXygnSGlnaGx5IG9ybmFtZW50ZWQnKSxcclxuICAgICAgICBvblVzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBfKFwiQSBzaWx2ZXIga25pZmVcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiT25lIGRheSB5b3UnbGwgYmUgYWJsZSB0byBlcXVpcCB0aGlzLCBidXQgcmlnaHQgbm93IHRoYXQgZnVuY3Rpb25hbGl0eSBpc24ndCBwcmVzZW50LlwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJQbGVhc2UgcG9saXRlbHkgbGVhdmUgdGhlIHByZW1pc2VzIHdpdGhvdXQgYWNrbm93bGVkZ2luZyB0aGlzIG1pc3NpbmcgZmVhdHVyZS5cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnWW91IGdvdCBpdCwgY2hpZWYnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIFwiU3RyYW5nZXIuY2xvdGhCdW5kbGVcIjoge1xyXG4gICAgICAgIG5hbWU6ICdhIGJ1bmRsZSBvZiBjbG90aCcsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ2J1bmRsZXMgb2YgY2xvdGgnLFxyXG4gICAgICAgIHRleHQ6IF8oJ1doYXQgbGllcyB3aXRoaW4/JyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEgYnVuZGxlIG9mIGNsb3RoXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIk9uZSBkYXkgeW91J2xsIGJlIGFibGUgdG8gdXNlIHRoaXMgaXRlbSwgYnV0IHJpZ2h0IG5vdyB0aGF0IGZ1bmN0aW9uYWxpdHkgaXNuJ3QgcHJlc2VudC5cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiUGxlYXNlIHBvbGl0ZWx5IGxlYXZlIHRoZSBwcmVtaXNlcyB3aXRob3V0IGFja25vd2xlZGdpbmcgdGhpcyBtaXNzaW5nIGZlYXR1cmUuXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1lvdSBnb3QgaXQsIGNoaWVmJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveU9uVXNlOiBmYWxzZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH0sXHJcbiAgICBcIlN0cmFuZ2VyLmNvaW5cIjoge1xyXG4gICAgICAgIG5hbWU6ICdBIHN0cmFuZ2UgY29pbicsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ3N0cmFuZ2UgY29pbnMnLFxyXG4gICAgICAgIHRleHQ6IF8oJ0JvdGggc2lkZXMgZGVwaWN0IHRoZSBzYW1lIGltYWdlJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEgc3RyYW5nZSBjb2luXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIk9uZSBkYXkgeW91J2xsIGJlIGFibGUgdG8gdXNlIHRoaXMgaXRlbSwgYnV0IHJpZ2h0IG5vdyB0aGF0IGZ1bmN0aW9uYWxpdHkgaXNuJ3QgcHJlc2VudC5cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiUGxlYXNlIHBvbGl0ZWx5IGxlYXZlIHRoZSBwcmVtaXNlcyB3aXRob3V0IGFja25vd2xlZGdpbmcgdGhpcyBtaXNzaW5nIGZlYXR1cmUuXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1lvdSBnb3QgaXQsIGNoaWVmJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveU9uVXNlOiBmYWxzZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH0sXHJcbiAgICBcIkNhcHRhaW4uc3VwcGxpZXNcIjoge1xyXG4gICAgICAgIG5hbWU6ICdTdXBwbGllcyBmb3IgdGhlIE1heW9yJyxcclxuICAgICAgICB0ZXh0OiAnVGhleVxcJ3JlIGhlYXZ5LCBidXQgbm90IGluIGEgd2F5IHRoYXQgaW1wYWN0cyBnYW1lcGxheScsXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIlN1cHBsaWVzIGZvciB0aGUgTWF5b3JcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiQSBiaWcgYm94IG9mIHN0dWZmIGZvciB0aGUgdmlsbGFnZS4gTG9va3MgbGlrZSByYXcgbWF0ZXJpYWxzLCBtb3N0bHkuXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIkkgc2hvdWxkIHJlYWxseSB0YWtlIHRoaXMgYmFjayB0byB0aGUgTWF5b3IuXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ09rYXknKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIFwib2xkTGFkeS5DYW5keVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ2EgcGllY2Ugb2YgaGFyZCBjYW5keScsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ3BpZWNlcyBvZiBoYXJkIGNhbmR5JyxcclxuICAgICAgICB0ZXh0OiAnR2l2ZW4gdG8geW91IGJ5IGEgbmljZSBvbGQgd29tYW4gaW4gYSBjYXJyaWFnZScsXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCAnWW91IHBvcCB0aGUgaGFyZCBjYW5keSBpbnRvIHlvdXIgbW91dGguIEEgZmV3IG1pbnV0ZXMgJyBcclxuICAgICAgICAgICAgICAgICsgJ2xhdGVyLCBpdFxcJ3MgZ29uZSwgbGVhdmluZyBiZWhpbmQgb25seSBhIG1pbGQgc2Vuc2Ugb2YgZ3VpbHQgYWJvdXQgbm90ICcgXHJcbiAgICAgICAgICAgICAgICArICdjYWxsaW5nIHlvdXIgZ3JhbmRtYSBtb3JlIG9mdGVuLicpXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IHRydWUsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IHRydWVcclxuICAgIH1cclxufVxyXG4iLCIvLyBtYXN0ZXIgbGlzdCBvZiBwZXJrc1xyXG5cclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IFBlcmsgfSBmcm9tIFwiLi9wZXJrXCI7XHJcblxyXG5leHBvcnQgY29uc3QgUGVya0xpc3Q6IHtbaWQ6IHN0cmluZ106IFBlcmt9ID0ge1xyXG4gICAgJ3R1bW15UGFpbic6IHtcclxuICAgICAgICBuYW1lOiAnU29ja2VkIGluIHRoZSBTdG9tYWNoJyxcclxuICAgICAgICB0ZXh0OiAnVGhpcyBkb2VzblxcJ3Qgc2VlbSBsaWtlIGEgcGVyaywgdGJoJyxcclxuICAgICAgICBmdWxsVGV4dDogW1xyXG4gICAgICAgICAgICBfKFwiWW91IGdvdCBoaXMgaW4gdGhlIHN0b21hY2ggcmVhbGx5IGhhcmQuXCIpLFxyXG4gICAgICAgICAgICBfKFwiTGlrZSwgUkVBTExZIGhhcmQuIEJ5IGEgZ3Jpbm5pbmcgamVyay5cIilcclxuICAgICAgICBdLFxyXG4gICAgICAgIGlzQWN0aXZlOiAoKSA9PiB0cnVlLFxyXG4gICAgICAgIHN0YXRCb251c2VzOiB7IH0sXHJcbiAgICAgICAgdGltZUxlZnQ6IC0xXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tIFwiLi9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IHsgUXVlc3QgfSBmcm9tIFwiLi9xdWVzdFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IFF1ZXN0TG9nOiB7W2lkOiBzdHJpbmddOiBRdWVzdH0gPSB7XHJcbiAgICBcIm1heW9yU3VwcGxpZXNcIjoge1xyXG4gICAgICAgIG5hbWU6IFwiU3VwcGxpZXMgZm9yIHRoZSBNYXlvclwiLFxyXG4gICAgICAgIGxvZ0Rlc2NyaXB0aW9uOiBcIlRoZSBtYXlvciBoYXMgYXNrZWQgeW91IHRvIGdldCBzb21lIHN1cHBsaWVzIGZvciBoaW0gZnJvbSB0aGUgb3V0cG9zdC5cIixcclxuICAgICAgICBwaGFzZXM6IHtcclxuICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiR28gY2hlY2sgb3V0IHRoZSBSb2FkIHRvIHRoZSBPdXRwb3N0IHRvIHNlZSBpZiB5b3UgY2FuIGZpbmQgb3V0IG1vcmVcIixcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVtZW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyUmVxdWlyZW1lbnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRTTS5nZXQoJ3JvYWQub3BlbicpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ1JvYWQuY291bnRlcicpID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiSSBzaG91bGQgZ28gY2hlY2sgb3V0IHRoZSBSb2FkIHRvIHRoZSBPdXRwb3N0XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgkU00uZ2V0KCdyb2FkLm9wZW4nKSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdSb2FkLmNvdW50ZXInKSAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiSSBzaG91bGQga2VlcCBleHBsb3JpbmcgdGhlIFJvYWQgdG8gdGhlIE91dHBvc3RcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCRTTS5nZXQoJ3JvYWQub3BlbicpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpIGFzIG51bWJlciA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiSSd2ZSBmb3VuZCB0aGUgd2F5IHRvIHRoZSBPdXRwb3N0XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgkU00uZ2V0KCdyb2FkLm9wZW4nKSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyID4gMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAxOiB7XHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJBc2sgdGhlIENhcHRhaW4gb2YgdGhlIE91dHBvc3QgYWJvdXQgdGhlIHN1cHBsaWVzXCIsXHJcbiAgICAgICAgICAgICAgICByZXF1aXJlbWVudHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlclJlcXVpcmVtZW50OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ291dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJJIHNob3VsZCB0cnkgdGFsa2luZyB0byB0aGUgQ2FwdGFpbiBvZiB0aGUgT3V0cG9zdFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpIGFzIG51bWJlciA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdvdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcpICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdvdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcpIGFzIG51bWJlciA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBDaGFyYWN0ZXIuaW52ZW50b3J5W1wiQ2FwdGFpbi5zdXBwbGllc1wiXSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkkgc2hvdWxkIGFzayB0aGUgQ2FwdGFpbiBhYm91dCB0aGUgbWlzc2luZyBzdXBwbGllc1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpIGFzIG51bWJlciA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdvdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcpICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdvdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcpIGFzIG51bWJlciA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBDaGFyYWN0ZXIuaW52ZW50b3J5W1wiQ2FwdGFpbi5zdXBwbGllc1wiXSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkkndmUgZ290dGVuIHRoZSBzdXBwbGllcyBmcm9tIHRoZSBDYXB0YWluXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnb3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnKSAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdvdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcpIGFzIG51bWJlciA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIENoYXJhY3Rlci5pbnZlbnRvcnlbXCJDYXB0YWluLnN1cHBsaWVzXCJdICE9PSB1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAyOiB7XHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJSZXR1cm4gdGhlIHN1cHBsaWVzIHRvIHRoZSBNYXlvclwiLFxyXG4gICAgICAgICAgICAgICAgcmVxdWlyZW1lbnRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJSZXF1aXJlbWVudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJFNNLmdldCgndmlsbGFnZS5tYXlvci5oYXZlR2l2ZW5TdXBwbGllcycpID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICBcIkkgc2hvdWxkIGhhbmQgdGhlc2Ugc3VwcGxpZXMgb3ZlciB0byB0aGUgTWF5b3JcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnKSA9PT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgndmlsbGFnZS5tYXlvci5oYXZlR2l2ZW5TdXBwbGllcycpIGFzIG51bWJlciA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiSSd2ZSBoYW5kZWQgb3ZlciB0aGUgc3VwcGxpZXMgdG8gdGhlIE1heW9yXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykgPT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgndmlsbGFnZS5tYXlvci5oYXZlR2l2ZW5TdXBwbGllcycpIGFzIG51bWJlciA+IDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLypcclxuICogTW9kdWxlIGZvciBoYW5kbGluZyBTdGF0ZXNcclxuICogXHJcbiAqIEFsbCBzdGF0ZXMgc2hvdWxkIGJlIGdldCBhbmQgc2V0IHRocm91Z2ggdGhlIFN0YXRlTWFuYWdlciAoJFNNKS5cclxuICogXHJcbiAqIFRoZSBtYW5hZ2VyIGlzIGludGVuZGVkIHRvIGhhbmRsZSBhbGwgbmVlZGVkIGNoZWNrcyBhbmQgZXJyb3IgY2F0Y2hpbmcuXHJcbiAqIFRoaXMgaW5jbHVkZXMgY3JlYXRpbmcgdGhlIHBhcmVudHMgb2YgbGF5ZXJlZC9kZWVwIHN0YXRlcyBzbyB1bmRlZmluZWQgc3RhdGVzXHJcbiAqIGRvIG5vdCBuZWVkIHRvIGJlIHRlc3RlZCBmb3IgYW5kIGNyZWF0ZWQgYmVmb3JlaGFuZC5cclxuICogXHJcbiAqIFdoZW4gYSBzdGF0ZSBpcyBjaGFuZ2VkLCBhbiB1cGRhdGUgZXZlbnQgaXMgc2VudCBvdXQgY29udGFpbmluZyB0aGUgbmFtZSBvZiB0aGUgc3RhdGVcclxuICogY2hhbmdlZCBvciBpbiB0aGUgY2FzZSBvZiBtdWx0aXBsZSBjaGFuZ2VzICguc2V0TSwgLmFkZE0pIHRoZSBwYXJlbnQgY2xhc3MgY2hhbmdlZC5cclxuICogRXZlbnQ6IHR5cGU6ICdzdGF0ZVVwZGF0ZScsIHN0YXRlTmFtZTogPHBhdGggb2Ygc3RhdGUgb3IgcGFyZW50IHN0YXRlPlxyXG4gKiBcclxuICogT3JpZ2luYWwgZmlsZSBjcmVhdGVkIGJ5OiBNaWNoYWVsIEdhbHVzaGFcclxuICovXHJcblxyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi9lbmdpbmVcIjtcclxuaW1wb3J0IHsgTm90aWZpY2F0aW9ucyB9IGZyb20gXCIuL25vdGlmaWNhdGlvbnNcIjtcclxuXHJcbnZhciBTdGF0ZU1hbmFnZXIgPSB7XHJcblx0XHRcclxuXHRNQVhfU1RPUkU6IDk5OTk5OTk5OTk5OTk5LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHt9LFxyXG5cdFxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHRcdFxyXG5cdFx0Ly9jcmVhdGUgY2F0ZWdvcmllc1xyXG5cdFx0dmFyIGNhdHMgPSBbXHJcblx0XHRcdCdmZWF0dXJlcycsXHRcdC8vYmlnIGZlYXR1cmVzIGxpa2UgYnVpbGRpbmdzLCBsb2NhdGlvbiBhdmFpbGFiaWxpdHksIHVubG9ja3MsIGV0Y1xyXG5cdFx0XHQnc3RvcmVzJywgXHRcdC8vbGl0dGxlIHN0dWZmLCBpdGVtcywgd2VhcG9ucywgZXRjXHJcblx0XHRcdCdjaGFyYWN0ZXInLCBcdC8vdGhpcyBpcyBmb3IgcGxheWVyJ3MgY2hhcmFjdGVyIHN0YXRzIHN1Y2ggYXMgcGVya3NcclxuXHRcdFx0J2luY29tZScsXHJcblx0XHRcdCd0aW1lcnMnLFxyXG5cdFx0XHQnZ2FtZScsIFx0XHQvL21vc3RseSBsb2NhdGlvbiByZWxhdGVkOiBmaXJlIHRlbXAsIHdvcmtlcnMsIHBvcHVsYXRpb24sIHdvcmxkIG1hcCwgZXRjXHJcblx0XHRcdCdwbGF5U3RhdHMnLFx0Ly9hbnl0aGluZyBwbGF5IHJlbGF0ZWQ6IHBsYXkgdGltZSwgbG9hZHMsIGV0Y1xyXG5cdFx0XHQncHJldmlvdXMnLFx0XHQvLyBwcmVzdGlnZSwgc2NvcmUsIHRyb3BoaWVzIChpbiBmdXR1cmUpLCBhY2hpZXZlbWVudHMgKGFnYWluLCBub3QgeWV0KSwgZXRjXHJcblx0XHRcdCdvdXRmaXQnXHRcdFx0Ly8gdXNlZCB0byB0ZW1wb3JhcmlseSBzdG9yZSB0aGUgaXRlbXMgdG8gYmUgdGFrZW4gb24gdGhlIHBhdGhcclxuXHRcdF07XHJcblx0XHRcclxuXHRcdGZvcih2YXIgd2hpY2ggaW4gY2F0cykge1xyXG5cdFx0XHRpZighJFNNLmdldChjYXRzW3doaWNoXSkpICRTTS5zZXQoY2F0c1t3aGljaF0sIHt9KTsgXHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vc3Vic2NyaWJlIHRvIHN0YXRlVXBkYXRlc1xyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5zdWJzY3JpYmUoJFNNLmhhbmRsZVN0YXRlVXBkYXRlcyk7XHJcblxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0d2luZG93LiRTTSA9IHRoaXM7XHJcblx0fSxcclxuXHRcclxuXHQvL2NyZWF0ZSBhbGwgcGFyZW50cyBhbmQgdGhlbiBzZXQgc3RhdGVcclxuXHRjcmVhdGVTdGF0ZTogZnVuY3Rpb24oc3RhdGVOYW1lLCB2YWx1ZSkge1xyXG5cdFx0dmFyIHdvcmRzID0gc3RhdGVOYW1lLnNwbGl0KC9bLlxcW1xcXSdcIl0rLyk7XHJcblx0XHQvL2ZvciBzb21lIHJlYXNvbiB0aGVyZSBhcmUgc29tZXRpbWVzIGVtcHR5IHN0cmluZ3NcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgd29yZHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKHdvcmRzW2ldID09PSAnJykge1xyXG5cdFx0XHRcdHdvcmRzLnNwbGljZShpLCAxKTtcclxuXHRcdFx0XHRpLS07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vIElNUE9SVEFOVDogU3RhdGUgcmVmZXJzIHRvIHdpbmRvdy5TdGF0ZSwgd2hpY2ggSSBoYWQgdG8gaW5pdGlhbGl6ZSBtYW51YWxseVxyXG5cdFx0Ly8gICAgaW4gRW5naW5lLnRzOyBwbGVhc2UgZG9uJ3QgZm9yZ2V0IHRoaXMgYW5kIG1lc3Mgd2l0aCBhbnl0aGluZyBuYW1lZFxyXG5cdFx0Ly8gICAgXCJTdGF0ZVwiIG9yIFwid2luZG93LlN0YXRlXCIsIHRoaXMgc3R1ZmYgaXMgd2VpcmRseSBwcmVjYXJpb3VzIGFmdGVyIHR5cGVzY3JpcHRpbmdcclxuXHRcdC8vICAgIHRoaXMgY29kZWJhc2UsIGFuZCBJIGRvbid0IGhhdmUgdGhlIHNhbml0eSBwb2ludHMgdG8gZmlndXJlIG91dCB3aHlcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdHZhciBvYmogPSBTdGF0ZTtcclxuXHRcdHZhciB3ID0gbnVsbDtcclxuXHRcdGZvcih2YXIgaT0wLCBsZW49d29yZHMubGVuZ3RoLTE7aTxsZW47aSsrKXtcclxuXHRcdFx0dyA9IHdvcmRzW2ldO1xyXG5cdFx0XHRpZihvYmpbd10gPT09IHVuZGVmaW5lZCApIG9ialt3XSA9IHt9O1xyXG5cdFx0XHRvYmogPSBvYmpbd107XHJcblx0XHR9XHJcblx0XHRvYmpbd29yZHNbaV1dID0gdmFsdWU7XHJcblx0XHRyZXR1cm4gb2JqO1xyXG5cdH0sXHJcblx0XHJcblx0Ly9zZXQgc2luZ2xlIHN0YXRlXHJcblx0Ly9pZiBub0V2ZW50IGlzIHRydWUsIHRoZSB1cGRhdGUgZXZlbnQgd29uJ3QgdHJpZ2dlciwgdXNlZnVsIGZvciBzZXR0aW5nIG11bHRpcGxlIHN0YXRlcyBmaXJzdFxyXG5cdHNldDogZnVuY3Rpb24oc3RhdGVOYW1lLCB2YWx1ZSwgbm9FdmVudD8pIHtcclxuXHRcdHZhciBmdWxsUGF0aCA9ICRTTS5idWlsZFBhdGgoc3RhdGVOYW1lKTtcclxuXHRcdFxyXG5cdFx0Ly9tYWtlIHN1cmUgdGhlIHZhbHVlIGlzbid0IG92ZXIgdGhlIGVuZ2luZSBtYXhpbXVtXHJcblx0XHRpZih0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiYgdmFsdWUgPiAkU00uTUFYX1NUT1JFKSB2YWx1ZSA9ICRTTS5NQVhfU1RPUkU7XHJcblx0XHRcclxuXHRcdHRyeXtcclxuXHRcdFx0ZXZhbCgnKCcrZnVsbFBhdGgrJykgPSB2YWx1ZScpO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHQvL3BhcmVudCBkb2Vzbid0IGV4aXN0LCBzbyBtYWtlIHBhcmVudFxyXG5cdFx0XHQkU00uY3JlYXRlU3RhdGUoc3RhdGVOYW1lLCB2YWx1ZSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vc3RvcmVzIHZhbHVlcyBjYW4gbm90IGJlIG5lZ2F0aXZlXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRpZihzdGF0ZU5hbWUuaW5kZXhPZignc3RvcmVzJykgPT09IDAgJiYgJFNNLmdldChzdGF0ZU5hbWUsIHRydWUpIDwgMCkge1xyXG5cdFx0XHRldmFsKCcoJytmdWxsUGF0aCsnKSA9IDAnKTtcclxuXHRcdFx0RW5naW5lLmxvZygnV0FSTklORzogc3RhdGU6JyArIHN0YXRlTmFtZSArICcgY2FuIG5vdCBiZSBhIG5lZ2F0aXZlIHZhbHVlLiBTZXQgdG8gMCBpbnN0ZWFkLicpO1xyXG5cdFx0fVxyXG5cclxuXHRcdEVuZ2luZS5sb2coc3RhdGVOYW1lICsgJyAnICsgdmFsdWUpO1xyXG5cdFx0XHJcblx0XHRpZiAobm9FdmVudCA9PT0gdW5kZWZpbmVkIHx8IG5vRXZlbnQgPT0gdHJ1ZSkge1xyXG5cdFx0XHRFbmdpbmUuc2F2ZUdhbWUoKTtcclxuXHRcdFx0JFNNLmZpcmVVcGRhdGUoc3RhdGVOYW1lKTtcclxuXHRcdH1cdFx0XHJcblx0fSxcclxuXHRcclxuXHQvL3NldHMgYSBsaXN0IG9mIHN0YXRlc1xyXG5cdHNldE06IGZ1bmN0aW9uKHBhcmVudE5hbWUsIGxpc3QsIG5vRXZlbnQ/KSB7XHJcblx0XHQkU00uYnVpbGRQYXRoKHBhcmVudE5hbWUpO1xyXG5cdFx0XHJcblx0XHQvL21ha2Ugc3VyZSB0aGUgc3RhdGUgZXhpc3RzIHRvIGF2b2lkIGVycm9ycyxcclxuXHRcdGlmKCRTTS5nZXQocGFyZW50TmFtZSkgPT09IHVuZGVmaW5lZCkgJFNNLnNldChwYXJlbnROYW1lLCB7fSwgdHJ1ZSk7XHJcblx0XHRcclxuXHRcdGZvcih2YXIgayBpbiBsaXN0KXtcclxuXHRcdFx0JFNNLnNldChwYXJlbnROYW1lKydbXCInK2srJ1wiXScsIGxpc3Rba10sIHRydWUpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZighbm9FdmVudCkge1xyXG5cdFx0XHRFbmdpbmUuc2F2ZUdhbWUoKTtcclxuXHRcdFx0JFNNLmZpcmVVcGRhdGUocGFyZW50TmFtZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHQvL3Nob3J0Y3V0IGZvciBhbHRlcmluZyBudW1iZXIgdmFsdWVzLCByZXR1cm4gMSBpZiBzdGF0ZSB3YXNuJ3QgYSBudW1iZXJcclxuXHRhZGQ6IGZ1bmN0aW9uKHN0YXRlTmFtZSwgdmFsdWUsIG5vRXZlbnQ/KSB7XHJcblx0XHR2YXIgZXJyID0gMDtcclxuXHRcdC8vMCBpZiB1bmRlZmluZWQsIG51bGwgKGJ1dCBub3Qge30pIHNob3VsZCBhbGxvdyBhZGRpbmcgdG8gbmV3IG9iamVjdHNcclxuXHRcdC8vY291bGQgYWxzbyBhZGQgaW4gYSB0cnVlID0gMSB0aGluZywgdG8gaGF2ZSBzb21ldGhpbmcgZ28gZnJvbSBleGlzdGluZyAodHJ1ZSlcclxuXHRcdC8vdG8gYmUgYSBjb3VudCwgYnV0IHRoYXQgbWlnaHQgYmUgdW53YW50ZWQgYmVoYXZpb3IgKGFkZCB3aXRoIGxvb3NlIGV2YWwgcHJvYmFibHkgd2lsbCBoYXBwZW4gYW55d2F5cylcclxuXHRcdHZhciBvbGQgPSAkU00uZ2V0KHN0YXRlTmFtZSwgdHJ1ZSk7XHJcblx0XHRcclxuXHRcdC8vY2hlY2sgZm9yIE5hTiAob2xkICE9IG9sZCkgYW5kIG5vbiBudW1iZXIgdmFsdWVzXHJcblx0XHRpZihvbGQgIT0gb2xkKXtcclxuXHRcdFx0RW5naW5lLmxvZygnV0FSTklORzogJytzdGF0ZU5hbWUrJyB3YXMgY29ycnVwdGVkIChOYU4pLiBSZXNldHRpbmcgdG8gMC4nKTtcclxuXHRcdFx0b2xkID0gMDtcclxuXHRcdFx0JFNNLnNldChzdGF0ZU5hbWUsIG9sZCArIHZhbHVlLCBub0V2ZW50KTtcclxuXHRcdH0gZWxzZSBpZih0eXBlb2Ygb2xkICE9ICdudW1iZXInIHx8IHR5cGVvZiB2YWx1ZSAhPSAnbnVtYmVyJyl7XHJcblx0XHRcdEVuZ2luZS5sb2coJ1dBUk5JTkc6IENhbiBub3QgZG8gbWF0aCB3aXRoIHN0YXRlOicrc3RhdGVOYW1lKycgb3IgdmFsdWU6Jyt2YWx1ZSsnIGJlY2F1c2UgYXQgbGVhc3Qgb25lIGlzIG5vdCBhIG51bWJlci4nKTtcclxuXHRcdFx0ZXJyID0gMTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCRTTS5zZXQoc3RhdGVOYW1lLCBvbGQgKyB2YWx1ZSwgbm9FdmVudCk7IC8vc2V0U3RhdGUgaGFuZGxlcyBldmVudCBhbmQgc2F2ZVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gZXJyO1xyXG5cdH0sXHJcblx0XHJcblx0Ly9hbHRlcnMgbXVsdGlwbGUgbnVtYmVyIHZhbHVlcywgcmV0dXJuIG51bWJlciBvZiBmYWlsc1xyXG5cdGFkZE06IGZ1bmN0aW9uKHBhcmVudE5hbWUsIGxpc3QsIG5vRXZlbnQ/KSB7XHJcblx0XHR2YXIgZXJyID0gMDtcclxuXHRcdFxyXG5cdFx0Ly9tYWtlIHN1cmUgdGhlIHBhcmVudCBleGlzdHMgdG8gYXZvaWQgZXJyb3JzXHJcblx0XHRpZigkU00uZ2V0KHBhcmVudE5hbWUpID09PSB1bmRlZmluZWQpICRTTS5zZXQocGFyZW50TmFtZSwge30sIHRydWUpO1xyXG5cdFx0XHJcblx0XHRmb3IodmFyIGsgaW4gbGlzdCl7XHJcblx0XHRcdGlmKCRTTS5hZGQocGFyZW50TmFtZSsnW1wiJytrKydcIl0nLCBsaXN0W2tdLCB0cnVlKSkgZXJyKys7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmKCFub0V2ZW50KSB7XHJcblx0XHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0XHQkU00uZmlyZVVwZGF0ZShwYXJlbnROYW1lKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBlcnI7XHJcblx0fSxcclxuXHRcclxuXHQvL3JldHVybiBzdGF0ZSwgdW5kZWZpbmVkIG9yIDBcclxuXHRnZXQ6IGZ1bmN0aW9uKHN0YXRlTmFtZSwgcmVxdWVzdFplcm8/KTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgTnVtYmVyIHwgbnVsbCB8IEJvb2xlYW4ge1xyXG5cdFx0dmFyIHdoaWNoU3RhdGU6IHVuZGVmaW5lZCB8IG51bGwgfCBOdW1iZXIgfCBzdHJpbmcgPSBudWxsO1xyXG5cdFx0dmFyIGZ1bGxQYXRoID0gJFNNLmJ1aWxkUGF0aChzdGF0ZU5hbWUpO1xyXG5cdFx0XHJcblx0XHQvL2NhdGNoIGVycm9ycyBpZiBwYXJlbnQgb2Ygc3RhdGUgZG9lc24ndCBleGlzdFxyXG5cdFx0dHJ5e1xyXG5cdFx0XHRldmFsKCd3aGljaFN0YXRlID0gKCcrZnVsbFBhdGgrJyknKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0d2hpY2hTdGF0ZSA9IHVuZGVmaW5lZDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly9wcmV2ZW50cyByZXBlYXRlZCBpZiB1bmRlZmluZWQsIG51bGwsIGZhbHNlIG9yIHt9LCB0aGVuIHggPSAwIHNpdHVhdGlvbnNcclxuXHRcdGlmKCghd2hpY2hTdGF0ZVxyXG5cdFx0XHQvLyAgfHwgd2hpY2hTdGF0ZSA9PSB7fVxyXG5cdFx0XHQpICYmIHJlcXVlc3RaZXJvKSByZXR1cm4gMDtcclxuXHRcdGVsc2UgcmV0dXJuIHdoaWNoU3RhdGU7XHJcblx0fSxcclxuXHRcclxuXHQvL21haW5seSBmb3IgbG9jYWwgY29weSB1c2UsIGFkZChNKSBjYW4gZmFpbCBzbyB3ZSBjYW4ndCBzaG9ydGN1dCB0aGVtXHJcblx0Ly9zaW5jZSBzZXQgZG9lcyBub3QgZmFpbCwgd2Uga25vdyBzdGF0ZSBleGlzdHMgYW5kIGNhbiBzaW1wbHkgcmV0dXJuIHRoZSBvYmplY3RcclxuXHRzZXRnZXQ6IGZ1bmN0aW9uKHN0YXRlTmFtZSwgdmFsdWUsIG5vRXZlbnQ/KXtcclxuXHRcdCRTTS5zZXQoc3RhdGVOYW1lLCB2YWx1ZSwgbm9FdmVudCk7XHJcblx0XHRyZXR1cm4gZXZhbCgnKCcrJFNNLmJ1aWxkUGF0aChzdGF0ZU5hbWUpKycpJyk7XHJcblx0fSxcclxuXHRcclxuXHRyZW1vdmU6IGZ1bmN0aW9uKHN0YXRlTmFtZSwgbm9FdmVudD8pIHtcclxuXHRcdHZhciB3aGljaFN0YXRlID0gJFNNLmJ1aWxkUGF0aChzdGF0ZU5hbWUpO1xyXG5cdFx0dHJ5e1xyXG5cdFx0XHRldmFsKCcoZGVsZXRlICcrd2hpY2hTdGF0ZSsnKScpO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHQvL2l0IGRpZG4ndCBleGlzdCBpbiB0aGUgZmlyc3QgcGxhY2VcclxuXHRcdFx0RW5naW5lLmxvZygnV0FSTklORzogVHJpZWQgdG8gcmVtb3ZlIG5vbi1leGlzdGFudCBzdGF0ZSBcXCcnK3N0YXRlTmFtZSsnXFwnLicpO1xyXG5cdFx0fVxyXG5cdFx0aWYoIW5vRXZlbnQpe1xyXG5cdFx0XHRFbmdpbmUuc2F2ZUdhbWUoKTtcclxuXHRcdFx0JFNNLmZpcmVVcGRhdGUoc3RhdGVOYW1lKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdC8vY3JlYXRlcyBmdWxsIHJlZmVyZW5jZSBmcm9tIGlucHV0XHJcblx0Ly9ob3BlZnVsbHkgdGhpcyB3b24ndCBldmVyIG5lZWQgdG8gYmUgbW9yZSBjb21wbGljYXRlZFxyXG5cdGJ1aWxkUGF0aDogZnVuY3Rpb24oaW5wdXQpe1xyXG5cdFx0dmFyIGRvdCA9IChpbnB1dC5jaGFyQXQoMCkgPT0gJ1snKT8gJycgOiAnLic7IC8vaWYgaXQgc3RhcnRzIHdpdGggW2Zvb10gbm8gZG90IHRvIGpvaW5cclxuXHRcdHJldHVybiAnU3RhdGUnICsgZG90ICsgaW5wdXQ7XHJcblx0fSxcclxuXHRcclxuXHRmaXJlVXBkYXRlOiBmdW5jdGlvbihzdGF0ZU5hbWUsIHNhdmU/KXtcclxuXHRcdHZhciBjYXRlZ29yeSA9ICRTTS5nZXRDYXRlZ29yeShzdGF0ZU5hbWUpO1xyXG5cdFx0aWYoc3RhdGVOYW1lID09IHVuZGVmaW5lZCkgc3RhdGVOYW1lID0gY2F0ZWdvcnkgPSAnYWxsJzsgLy9iZXN0IGlmIHRoaXMgZG9lc24ndCBoYXBwZW4gYXMgaXQgd2lsbCB0cmlnZ2VyIG1vcmUgc3R1ZmZcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdCQuRGlzcGF0Y2goJ3N0YXRlVXBkYXRlJykucHVibGlzaCh7J2NhdGVnb3J5JzogY2F0ZWdvcnksICdzdGF0ZU5hbWUnOnN0YXRlTmFtZX0pO1xyXG5cdFx0aWYoc2F2ZSkgRW5naW5lLnNhdmVHYW1lKCk7XHJcblx0fSxcclxuXHRcclxuXHRnZXRDYXRlZ29yeTogZnVuY3Rpb24oc3RhdGVOYW1lKXtcclxuXHRcdHZhciBmaXJzdE9CID0gc3RhdGVOYW1lLmluZGV4T2YoJ1snKTtcclxuXHRcdHZhciBmaXJzdERvdCA9IHN0YXRlTmFtZS5pbmRleE9mKCcuJyk7XHJcblx0XHR2YXIgY3V0b2ZmID0gbnVsbDtcclxuXHRcdGlmKGZpcnN0T0IgPT0gLTEgfHwgZmlyc3REb3QgPT0gLTEpe1xyXG5cdFx0XHRjdXRvZmYgPSBmaXJzdE9CID4gZmlyc3REb3QgPyBmaXJzdE9CIDogZmlyc3REb3Q7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjdXRvZmYgPSBmaXJzdE9CIDwgZmlyc3REb3QgPyBmaXJzdE9CIDogZmlyc3REb3Q7XHJcblx0XHR9XHJcblx0XHRpZiAoY3V0b2ZmID09IC0xKXtcclxuXHRcdFx0cmV0dXJuIHN0YXRlTmFtZTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBzdGF0ZU5hbWUuc3Vic3RyKDAsY3V0b2ZmKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHQgKiBTdGFydCBvZiBzcGVjaWZpYyBzdGF0ZSBmdW5jdGlvbnNcclxuXHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cdC8vUEVSS1NcclxuXHRhZGRQZXJrOiBmdW5jdGlvbihuYW1lKSB7XHJcblx0XHQkU00uc2V0KCdjaGFyYWN0ZXIucGVya3NbXCInK25hbWUrJ1wiXScsIHRydWUpO1xyXG5cdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgRW5naW5lLlBlcmtzW25hbWVdLm5vdGlmeSk7XHJcblx0fSxcclxuXHRcclxuXHRoYXNQZXJrOiBmdW5jdGlvbihuYW1lKSB7XHJcblx0XHRyZXR1cm4gJFNNLmdldCgnY2hhcmFjdGVyLnBlcmtzW1wiJytuYW1lKydcIl0nKTtcclxuXHR9LFxyXG5cdFxyXG5cdC8vSU5DT01FXHJcblx0c2V0SW5jb21lOiBmdW5jdGlvbihzb3VyY2UsIG9wdGlvbnMpIHtcclxuXHRcdHZhciBleGlzdGluZyA9ICRTTS5nZXQoJ2luY29tZVtcIicrc291cmNlKydcIl0nKTtcclxuXHRcdGlmKHR5cGVvZiBleGlzdGluZyAhPSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRvcHRpb25zLnRpbWVMZWZ0ID0gKGV4aXN0aW5nIGFzIGFueSk/LnRpbWVMZWZ0O1xyXG5cdFx0fVxyXG5cdFx0JFNNLnNldCgnaW5jb21lW1wiJytzb3VyY2UrJ1wiXScsIG9wdGlvbnMpO1xyXG5cdH0sXHJcblx0XHJcblx0Z2V0SW5jb21lOiBmdW5jdGlvbihzb3VyY2UpIHtcclxuXHRcdHZhciBleGlzdGluZyA9ICRTTS5nZXQoJ2luY29tZVtcIicrc291cmNlKydcIl0nKTtcclxuXHRcdGlmKHR5cGVvZiBleGlzdGluZyAhPSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRyZXR1cm4gZXhpc3Rpbmc7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4ge307XHJcblx0fSxcdFxyXG5cdFxyXG5cdC8vTWlzY1xyXG5cdG51bTogZnVuY3Rpb24obmFtZSwgY3JhZnRhYmxlKSB7XHJcblx0XHRzd2l0Y2goY3JhZnRhYmxlLnR5cGUpIHtcclxuXHRcdGNhc2UgJ2dvb2QnOlxyXG5cdFx0Y2FzZSAndG9vbCc6XHJcblx0XHRjYXNlICd3ZWFwb24nOlxyXG5cdFx0Y2FzZSAndXBncmFkZSc6XHJcblx0XHRcdHJldHVybiAkU00uZ2V0KCdzdG9yZXNbXCInK25hbWUrJ1wiXScsIHRydWUpO1xyXG5cdFx0Y2FzZSAnYnVpbGRpbmcnOlxyXG5cdFx0XHRyZXR1cm4gJFNNLmdldCgnZ2FtZS5idWlsZGluZ3NbXCInK25hbWUrJ1wiXScsIHRydWUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0aGFuZGxlU3RhdGVVcGRhdGVzOiBmdW5jdGlvbihlKXtcclxuXHRcdFxyXG5cdH1cdFxyXG59O1xyXG5cclxuLy9hbGlhc1xyXG5leHBvcnQgY29uc3QgJFNNID0gU3RhdGVNYW5hZ2VyO1xyXG4iLCJpbXBvcnQgeyBOb3RpZmljYXRpb25zIH0gZnJvbSAnLi9ub3RpZmljYXRpb25zJztcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSAnLi9zdGF0ZV9tYW5hZ2VyJztcclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSAnLi9lbmdpbmUnO1xyXG5cclxuZXhwb3J0IGNvbnN0IFdlYXRoZXIgPSB7XHJcbiAgICBpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblxyXG4gICAgICAgIC8vc3Vic2NyaWJlIHRvIHN0YXRlVXBkYXRlc1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuXHRcdCQuRGlzcGF0Y2goJ3N0YXRlVXBkYXRlJykuc3Vic2NyaWJlKFdlYXRoZXIuaGFuZGxlU3RhdGVVcGRhdGVzKTtcclxuICAgIH0sXHJcblxyXG4gICAgaGFuZGxlU3RhdGVVcGRhdGVzOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgaWYgKGUuY2F0ZWdvcnkgPT0gJ3dlYXRoZXInKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoJFNNLmdldCgnd2VhdGhlcicpKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdzdW5ueSc6IFxyXG4gICAgICAgICAgICAgICAgICAgIFdlYXRoZXIuc3RhcnRTdW5ueSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnY2xvdWR5JzpcclxuICAgICAgICAgICAgICAgICAgICBXZWF0aGVyLnN0YXJ0Q2xvdWR5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdyYWlueSc6XHJcbiAgICAgICAgICAgICAgICAgICAgV2VhdGhlci5zdGFydFJhaW55KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfbGFzdFdlYXRoZXI6ICdzdW5ueScsXHJcblxyXG4gICAgc3RhcnRTdW5ueTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJUaGUgc3VuIGJlZ2lucyB0byBzaGluZS5cIik7XHJcbiAgICAgICAgV2VhdGhlci5fbGFzdFdlYXRoZXIgPSAnc3VubnknO1xyXG4gICAgICAgICQoJ2JvZHknKS5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6ICcjRkZGRkZGJ30sICdzbG93Jyk7XHJcbiAgICAgICAgJCgnZGl2I3N0b3Jlczo6YmVmb3JlJykuYW5pbWF0ZSh7YmFja2dyb3VuZENvbG9yOiAnI0ZGRkZGRid9LCAnc2xvdycpO1xyXG4gICAgICAgIFdlYXRoZXIubWFrZVJhaW5TdG9wKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHN0YXJ0Q2xvdWR5OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoV2VhdGhlci5fbGFzdFdlYXRoZXIgPT0gJ3N1bm55Jykge1xyXG4gICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIkNsb3VkcyByb2xsIGluLCBvYnNjdXJpbmcgdGhlIHN1bi5cIik7XHJcbiAgICAgICAgfSBlbHNlIGlmIChXZWF0aGVyLl9sYXN0V2VhdGhlciA9PSAncmFpbnknKSB7XHJcbiAgICAgICAgICAgIE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiVGhlIHJhaW4gYnJlYWtzLCBidXQgdGhlIGNsb3VkcyByZW1haW4uXCIpXHJcbiAgICAgICAgfVxyXG4gICAgICAgICQoJ2JvZHknKS5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6ICcjOEI4Nzg2J30sICdzbG93Jyk7XHJcbiAgICAgICAgJCgnZGl2I3N0b3Jlczo6YmVmb3JlJykuYW5pbWF0ZSh7YmFja2dyb3VuZENvbG9yOiAnIzhCODc4Nid9LCAnc2xvdycpO1xyXG4gICAgICAgIFdlYXRoZXIuX2xhc3RXZWF0aGVyID0gJ2Nsb3VkeSc7XHJcbiAgICAgICAgV2VhdGhlci5tYWtlUmFpblN0b3AoKTtcclxuICAgIH0sXHJcblxyXG4gICAgc3RhcnRSYWlueTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKFdlYXRoZXIuX2xhc3RXZWF0aGVyID09ICdzdW5ueScpIHtcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJUaGUgd2luZCBzdWRkZW5seSBwaWNrcyB1cC4gQ2xvdWRzIHJvbGwgaW4sIGhlYXZ5IHdpdGggcmFpbiwgYW5kIHJhaW5kcm9wcyBmYWxsIHNvb24gYWZ0ZXIuXCIpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoV2VhdGhlci5fbGFzdFdlYXRoZXIgPT0gJ2Nsb3VkeScpIHtcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJUaGUgY2xvdWRzIHRoYXQgd2VyZSBwcmV2aW91c2x5IGNvbnRlbnQgdG8gaGFuZyBvdmVyaGVhZCBsZXQgbG9vc2UgYSBtb2RlcmF0ZSBkb3ducG91ci5cIilcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgJCgnYm9keScpLmFuaW1hdGUoe2JhY2tncm91bmRDb2xvcjogJyM2RDY5NjgnfSwgJ3Nsb3cnKTtcclxuICAgICAgICAkKCdkaXYjc3RvcmVzOjpiZWZvcmUnKS5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6ICcjNkQ2OTY4J30sICdzbG93Jyk7XHJcbiAgICAgICAgV2VhdGhlci5fbGFzdFdlYXRoZXIgPSAncmFpbnknO1xyXG4gICAgICAgIFdlYXRoZXIubWFrZUl0UmFpbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICBfbG9jYXRpb246ICcnLFxyXG5cclxuICAgIGluaXRpYXRlV2VhdGhlcjogZnVuY3Rpb24oYXZhaWxhYmxlV2VhdGhlciwgbG9jYXRpb24pIHtcclxuICAgICAgICBpZiAoV2VhdGhlci5fbG9jYXRpb24gPT0gJycpIFdlYXRoZXIuX2xvY2F0aW9uID0gbG9jYXRpb247XHJcbiAgICAgICAgLy8gaWYgaW4gbmV3IGxvY2F0aW9uLCBlbmQgd2l0aG91dCB0cmlnZ2VyaW5nIGEgbmV3IHdlYXRoZXIgaW5pdGlhdGlvbiwgXHJcbiAgICAgICAgLy8gbGVhdmluZyB0aGUgbmV3IGxvY2F0aW9uJ3MgaW5pdGlhdGVXZWF0aGVyIGNhbGxiYWNrIHRvIGRvIGl0cyB0aGluZ1xyXG4gICAgICAgIGVsc2UgaWYgKFdlYXRoZXIuX2xvY2F0aW9uICE9IGxvY2F0aW9uKSByZXR1cm47IFxyXG5cclxuICAgICAgICB2YXIgY2hvc2VuV2VhdGhlciA9ICdub25lJztcclxuICAgICAgICAvL2dldCBvdXIgcmFuZG9tIGZyb20gMCB0byAxXHJcbiAgICAgICAgdmFyIHJuZCA9IE1hdGgucmFuZG9tKCk7XHJcbiAgXHJcbiAgICAgICAgLy9pbml0aWFsaXNlIG91ciBjdW11bGF0aXZlIHBlcmNlbnRhZ2VcclxuICAgICAgICB2YXIgY3VtdWxhdGl2ZUNoYW5jZSA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaSBpbiBhdmFpbGFibGVXZWF0aGVyKSB7XHJcbiAgICAgICAgICAgIGN1bXVsYXRpdmVDaGFuY2UgKz0gYXZhaWxhYmxlV2VhdGhlcltpXTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChybmQgPCBjdW11bGF0aXZlQ2hhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICBjaG9zZW5XZWF0aGVyID0gaTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY2hvc2VuV2VhdGhlciAhPSAkU00uZ2V0KCd3ZWF0aGVyJykpICRTTS5zZXQoJ3dlYXRoZXInLCBjaG9zZW5XZWF0aGVyKTtcclxuICAgICAgICBFbmdpbmUuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhdGVXZWF0aGVyKGF2YWlsYWJsZVdlYXRoZXIsIGxvY2F0aW9uKTtcclxuICAgICAgICB9LCAzICogNjAgKiAxMDAwKTtcclxuICAgIH0sXHJcblxyXG4gICAgbWFrZUl0UmFpbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gaHR0cHM6Ly9jb2RlcGVuLmlvL2FyaWNrbGUvcGVuL1hLak1aWVxyXG4gICAgICAgIC8vY2xlYXIgb3V0IGV2ZXJ5dGhpbmdcclxuICAgICAgICAkKCcucmFpbicpLmVtcHR5KCk7XHJcbiAgICAgIFxyXG4gICAgICAgIHZhciBpbmNyZW1lbnQgPSAwO1xyXG4gICAgICAgIHZhciBkcm9wcyA9IFwiXCI7XHJcbiAgICAgICAgdmFyIGJhY2tEcm9wcyA9IFwiXCI7XHJcbiAgICAgIFxyXG4gICAgICAgIHdoaWxlIChpbmNyZW1lbnQgPCAxMDApIHtcclxuICAgICAgICAgIC8vY291cGxlIHJhbmRvbSBudW1iZXJzIHRvIHVzZSBmb3IgdmFyaW91cyByYW5kb21pemF0aW9uc1xyXG4gICAgICAgICAgLy9yYW5kb20gbnVtYmVyIGJldHdlZW4gOTggYW5kIDFcclxuICAgICAgICAgIHZhciByYW5kb0h1bmRvID0gKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg5OCAtIDEgKyAxKSArIDEpKTtcclxuICAgICAgICAgIC8vcmFuZG9tIG51bWJlciBiZXR3ZWVuIDUgYW5kIDJcclxuICAgICAgICAgIHZhciByYW5kb0ZpdmVyID0gKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg1IC0gMiArIDEpICsgMikpO1xyXG4gICAgICAgICAgLy9pbmNyZW1lbnRcclxuICAgICAgICAgIGluY3JlbWVudCArPSByYW5kb0ZpdmVyO1xyXG4gICAgICAgICAgLy9hZGQgaW4gYSBuZXcgcmFpbmRyb3Agd2l0aCB2YXJpb3VzIHJhbmRvbWl6YXRpb25zIHRvIGNlcnRhaW4gQ1NTIHByb3BlcnRpZXNcclxuICAgICAgICAgIGRyb3BzICs9ICc8ZGl2IGNsYXNzPVwiZHJvcFwiIHN0eWxlPVwibGVmdDogJyArIGluY3JlbWVudCArICclOyBib3R0b206ICcgKyAocmFuZG9GaXZlciArIHJhbmRvRml2ZXIgLSAxICsgMTAwKSArICclOyBhbmltYXRpb24tZGVsYXk6IDAuJyArIHJhbmRvSHVuZG8gKyAnczsgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjUnICsgcmFuZG9IdW5kbyArICdzO1wiPjxkaXYgY2xhc3M9XCJzdGVtXCIgc3R5bGU9XCJhbmltYXRpb24tZGVsYXk6IDAuJyArIHJhbmRvSHVuZG8gKyAnczsgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjUnICsgcmFuZG9IdW5kbyArICdzO1wiPjwvZGl2PjxkaXYgY2xhc3M9XCJzcGxhdFwiIHN0eWxlPVwiYW5pbWF0aW9uLWRlbGF5OiAwLicgKyByYW5kb0h1bmRvICsgJ3M7IGFuaW1hdGlvbi1kdXJhdGlvbjogMC41JyArIHJhbmRvSHVuZG8gKyAncztcIj48L2Rpdj48L2Rpdj4nO1xyXG4gICAgICAgICAgYmFja0Ryb3BzICs9ICc8ZGl2IGNsYXNzPVwiZHJvcFwiIHN0eWxlPVwicmlnaHQ6ICcgKyBpbmNyZW1lbnQgKyAnJTsgYm90dG9tOiAnICsgKHJhbmRvRml2ZXIgKyByYW5kb0ZpdmVyIC0gMSArIDEwMCkgKyAnJTsgYW5pbWF0aW9uLWRlbGF5OiAwLicgKyByYW5kb0h1bmRvICsgJ3M7IGFuaW1hdGlvbi1kdXJhdGlvbjogMC41JyArIHJhbmRvSHVuZG8gKyAncztcIj48ZGl2IGNsYXNzPVwic3RlbVwiIHN0eWxlPVwiYW5pbWF0aW9uLWRlbGF5OiAwLicgKyByYW5kb0h1bmRvICsgJ3M7IGFuaW1hdGlvbi1kdXJhdGlvbjogMC41JyArIHJhbmRvSHVuZG8gKyAncztcIj48L2Rpdj48ZGl2IGNsYXNzPVwic3BsYXRcIiBzdHlsZT1cImFuaW1hdGlvbi1kZWxheTogMC4nICsgcmFuZG9IdW5kbyArICdzOyBhbmltYXRpb24tZHVyYXRpb246IDAuNScgKyByYW5kb0h1bmRvICsgJ3M7XCI+PC9kaXY+PC9kaXY+JztcclxuICAgICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAgICQoJy5yYWluLmZyb250LXJvdycpLmFwcGVuZChkcm9wcyk7XHJcbiAgICAgICAgJCgnLnJhaW4uYmFjay1yb3cnKS5hcHBlbmQoYmFja0Ryb3BzKTtcclxuICAgIH0sXHJcblxyXG4gICAgbWFrZVJhaW5TdG9wOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKCcucmFpbicpLmVtcHR5KCk7XHJcbiAgICB9XHJcbn0iXX0=
