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

},{"../../lib/translate":1,"../events":7,"../player/character":14,"../state_manager":17}],4:[function(require,module,exports){
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

},{"../../lib/translate":1,"../events":7,"../places/village":13,"../player/character":14,"../state_manager":17}],5:[function(require,module,exports){
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

},{"../../lib/translate":1,"../events":7,"../places/road":12,"../places/village":13,"../player/character":14,"../state_manager":17,"./liz":4}],6:[function(require,module,exports){
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

},{"../lib/translate":1,"./events":7,"./notifications":10,"./places/outpost":11,"./places/road":12,"./places/village":13,"./player/character":14,"./state_manager":17,"./weather":18}],7:[function(require,module,exports){
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

},{"../lib/translate":1,"./Button":2,"./engine":6,"./events/roadwander":8,"./notifications":10,"./state_manager":17}],8:[function(require,module,exports){
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
    {
        title: (0, translate_1._)('A Rare Opportunity'),
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
    // Unlock Outpost
    {
        title: (0, translate_1._)('A Way Forward Makes Itself Known'),
        isAvailable: function () {
            return ((engine_1.Engine.activeModule == road_1.Road)
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

},{"../../lib/translate":1,"../engine":6,"../places/outpost":11,"../places/road":12,"../player/character":14,"../state_manager":17}],9:[function(require,module,exports){
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

},{"./engine":6}],10:[function(require,module,exports){
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

},{"./engine":6}],11:[function(require,module,exports){
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
        // Create the description text
        var desc = $('<div>').attr('id', 'description').appendTo(this.panel);
        for (var i in this.description) {
            $('<div>').text(this.description[i]).appendTo(desc);
        }
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

},{"../../lib/translate":1,"../Button":2,"../characters/captain":3,"../engine":6,"../header":9,"../state_manager":17,"../weather":18}],12:[function(require,module,exports){
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
    description: [
        (0, translate_1._)("You're on a dusty road between the Village and the Outpost. The road cuts through "
            + "tall grass, brush, and trees, limiting visibility and ensuring that you'll have "
            + "to deal with some nonsense."),
        (0, translate_1._)("The hair on the back of your neck prickles slightly in anticipation.")
    ],
    init: function (options) {
        this.options = $.extend(this.options, options);
        // Create the Road tab
        this.tab = header_1.Header.addLocation((0, translate_1._)("Road to the Outpost"), "road", exports.Road);
        // Create the Road panel
        this.panel = $('<div>')
            .attr('id', "roadPanel")
            .addClass('location')
            .appendTo('div#locationSlider');
        var desc = $('<div>').attr('id', 'description').appendTo(this.panel);
        for (var i in this.description) {
            $('<div>').text(this.description[i]).appendTo(desc);
        }
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

},{"../../lib/translate":1,"../Button":2,"../engine":6,"../events":7,"../header":9,"../state_manager":17,"../weather":18}],13:[function(require,module,exports){
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
        (0, translate_1._)("Nestled in the woods, this village is scarcely more than a hamlet, "
            + "despite you thinking those two words are synonyms. They're not, "
            + "go google 'hamlet' right now if you don't believe me."),
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
        var desc = $('<div>').attr('id', 'description').appendTo(this.panel);
        for (var i in this.description) {
            $('<div>').text(this.description[i]).appendTo(desc);
        }
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

},{"../../lib/translate":1,"../Button":2,"../characters/liz":4,"../characters/mayor":5,"../engine":6,"../events":7,"../header":9,"../notifications":10,"../state_manager":17,"../weather":18}],14:[function(require,module,exports){
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

},{"../../lib/translate":1,"../Button":2,"../events":7,"../notifications":10,"../state_manager":17,"./itemList":15,"./questLog":16}],15:[function(require,module,exports){
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

},{"../../lib/translate":1,"../events":7,"../notifications":10,"../state_manager":17,"./character":14}],16:[function(require,module,exports){
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

},{"../state_manager":17,"./character":14}],17:[function(require,module,exports){
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

},{"./engine":6,"./notifications":10}],18:[function(require,module,exports){
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

},{"./engine":6,"./notifications":10,"./state_manager":17}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL3RyYW5zbGF0ZS50cyIsInNyYy9zY3JpcHQvQnV0dG9uLnRzIiwic3JjL3NjcmlwdC9jaGFyYWN0ZXJzL2NhcHRhaW4udHMiLCJzcmMvc2NyaXB0L2NoYXJhY3RlcnMvbGl6LnRzIiwic3JjL3NjcmlwdC9jaGFyYWN0ZXJzL21heW9yLnRzIiwic3JjL3NjcmlwdC9lbmdpbmUudHMiLCJzcmMvc2NyaXB0L2V2ZW50cy50cyIsInNyYy9zY3JpcHQvZXZlbnRzL3JvYWR3YW5kZXIudHMiLCJzcmMvc2NyaXB0L2hlYWRlci50cyIsInNyYy9zY3JpcHQvbm90aWZpY2F0aW9ucy50cyIsInNyYy9zY3JpcHQvcGxhY2VzL291dHBvc3QudHMiLCJzcmMvc2NyaXB0L3BsYWNlcy9yb2FkLnRzIiwic3JjL3NjcmlwdC9wbGFjZXMvdmlsbGFnZS50cyIsInNyYy9zY3JpcHQvcGxheWVyL2NoYXJhY3Rlci50cyIsInNyYy9zY3JpcHQvcGxheWVyL2l0ZW1MaXN0LnRzIiwic3JjL3NjcmlwdC9wbGF5ZXIvcXVlc3RMb2cudHMiLCJzcmMvc2NyaXB0L3N0YXRlX21hbmFnZXIudHMiLCJzcmMvc2NyaXB0L3dlYXRoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUEsZ0JBQWdCOzs7QUFFaEIsa0NBQWtDO0FBQ2xDLEtBQUs7QUFDTCx1Q0FBdUM7QUFFdkMsb0NBQW9DO0FBQ3BDLE1BQU07QUFDTiwyQ0FBMkM7QUFDM0MsTUFBTTtBQUNOLG1DQUFtQztBQUNuQyxNQUFNO0FBQ04sc0NBQXNDO0FBQ3RDLDBDQUEwQztBQUUxQyxxQ0FBcUM7QUFDckMsTUFBTTtBQUVOLGtCQUFrQjtBQUNsQixNQUFNO0FBRU4sOERBQThEO0FBQzlELG9DQUFvQztBQUVwQyx1SEFBdUg7QUFDdkgsd0NBQXdDO0FBQ3hDLDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFDL0Isc0VBQXNFO0FBQ3RF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WCxTQUFTLElBQUksVUFBVSxDQUFDO1lBQ3hCLDZFQUE2RTtZQUM3RSxLQUFLLElBQUksaUNBQWlDLEdBQUcsU0FBUyxHQUFHLGFBQWEsR0FBRyxDQUFDLFVBQVUsR0FBRyxVQUFVLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLHdCQUF3QixHQUFHLFVBQVUsR0FBRyw0QkFBNEIsR0FBRyxVQUFVLEdBQUcsa0RBQWtELEdBQUcsVUFBVSxHQUFHLDRCQUE0QixHQUFHLFVBQVUsR0FBRyx5REFBeUQsR0FBRyxVQUFVLEdBQUcsNEJBQTRCLEdBQUcsVUFBVSxHQUFHLGtCQUFrQixDQUFDO1lBQ3piLFNBQVMsSUFBSSxrQ0FBa0MsR0FBRyxTQUFTLEdBQUcsYUFBYSxHQUFHLENBQUMsVUFBVSxHQUFHLFVBQVUsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsd0JBQXdCLEdBQUcsVUFBVSxHQUFHLDRCQUE0QixHQUFHLFVBQVUsR0FBRyxrREFBa0QsR0FBRyxVQUFVLEdBQUcsNEJBQTRCLEdBQUcsVUFBVSxHQUFHLHlEQUF5RCxHQUFHLFVBQVUsR0FBRyw0QkFBNEIsR0FBRyxVQUFVLEdBQUcsa0JBQWtCLENBQUM7UUFDaGMsQ0FBQztRQUVELENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELFlBQVksRUFBRTtRQUNWLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN2QixDQUFDO0NBQ0osQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIChmdW5jdGlvbigpIHtcclxuXHJcbi8vIFx0dmFyIHRyYW5zbGF0ZSA9IGZ1bmN0aW9uKHRleHQpXHJcbi8vIFx0e1xyXG4vLyBcdFx0dmFyIHhsYXRlID0gdHJhbnNsYXRlTG9va3VwKHRleHQpO1xyXG5cdFx0XHJcbi8vIFx0XHRpZiAodHlwZW9mIHhsYXRlID09IFwiZnVuY3Rpb25cIilcclxuLy8gXHRcdHtcclxuLy8gXHRcdFx0eGxhdGUgPSB4bGF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4vLyBcdFx0fVxyXG4vLyBcdFx0ZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpXHJcbi8vIFx0XHR7XHJcbi8vIFx0XHRcdHZhciBhcHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XHJcbi8vIFx0XHRcdHZhciBhcmdzID0gYXBzLmNhbGwoIGFyZ3VtZW50cywgMSApO1xyXG4gIFxyXG4vLyBcdFx0XHR4bGF0ZSA9IGZvcm1hdHRlcih4bGF0ZSwgYXJncyk7XHJcbi8vIFx0XHR9XHJcblx0XHRcclxuLy8gXHRcdHJldHVybiB4bGF0ZTtcclxuLy8gXHR9O1xyXG5cdFxyXG4vLyBcdC8vIEkgd2FudCBpdCBhdmFpbGFibGUgZXhwbGljaXR5IGFzIHdlbGwgYXMgdmlhIHRoZSBvYmplY3RcclxuLy8gXHR0cmFuc2xhdGUudHJhbnNsYXRlID0gdHJhbnNsYXRlO1xyXG5cdFxyXG4vLyBcdC8vZnJvbSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS83NzYxOTYgdmlhIGh0dHA6Ly9kYXZlZGFzaC5jb20vMjAxMC8xMS8xOS9weXRob25pYy1zdHJpbmctZm9ybWF0dGluZy1pbi1qYXZhc2NyaXB0LyBcclxuLy8gXHR2YXIgZGVmYXVsdEZvcm1hdHRlciA9IChmdW5jdGlvbigpIHtcclxuLy8gXHRcdHZhciByZSA9IC9cXHsoW159XSspXFx9L2c7XHJcbi8vIFx0XHRyZXR1cm4gZnVuY3Rpb24ocywgYXJncykge1xyXG4vLyBcdFx0XHRyZXR1cm4gcy5yZXBsYWNlKHJlLCBmdW5jdGlvbihfLCBtYXRjaCl7IHJldHVybiBhcmdzW21hdGNoXTsgfSk7XHJcbi8vIFx0XHR9O1xyXG4vLyBcdH0oKSk7XHJcbi8vIFx0dmFyIGZvcm1hdHRlciA9IGRlZmF1bHRGb3JtYXR0ZXI7XHJcbi8vIFx0dHJhbnNsYXRlLnNldEZvcm1hdHRlciA9IGZ1bmN0aW9uKG5ld0Zvcm1hdHRlcilcclxuLy8gXHR7XHJcbi8vIFx0XHRmb3JtYXR0ZXIgPSBuZXdGb3JtYXR0ZXI7XHJcbi8vIFx0fTtcclxuXHRcclxuLy8gXHR0cmFuc2xhdGUuZm9ybWF0ID0gZnVuY3Rpb24oKVxyXG4vLyBcdHtcclxuLy8gXHRcdHZhciBhcHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XHJcbi8vIFx0XHR2YXIgcyA9IGFyZ3VtZW50c1swXTtcclxuLy8gXHRcdHZhciBhcmdzID0gYXBzLmNhbGwoIGFyZ3VtZW50cywgMSApO1xyXG4gIFxyXG4vLyBcdFx0cmV0dXJuIGZvcm1hdHRlcihzLCBhcmdzKTtcclxuLy8gXHR9O1xyXG5cclxuLy8gXHR2YXIgZHlub1RyYW5zID0gbnVsbDtcclxuLy8gXHR0cmFuc2xhdGUuc2V0RHluYW1pY1RyYW5zbGF0b3IgPSBmdW5jdGlvbihuZXdEeW5vVHJhbnMpXHJcbi8vIFx0e1xyXG4vLyBcdFx0ZHlub1RyYW5zID0gbmV3RHlub1RyYW5zO1xyXG4vLyBcdH07XHJcblxyXG4vLyBcdHZhciB0cmFuc2xhdGlvbiA9IG51bGw7XHJcbi8vIFx0dHJhbnNsYXRlLnNldFRyYW5zbGF0aW9uID0gZnVuY3Rpb24obmV3VHJhbnNsYXRpb24pXHJcbi8vIFx0e1xyXG4vLyBcdFx0dHJhbnNsYXRpb24gPSBuZXdUcmFuc2xhdGlvbjtcclxuLy8gXHR9O1xyXG5cdFxyXG4vLyBcdGZ1bmN0aW9uIHRyYW5zbGF0ZUxvb2t1cCh0YXJnZXQpXHJcbi8vIFx0e1xyXG4vLyBcdFx0aWYgKHRyYW5zbGF0aW9uID09IG51bGwgfHwgdGFyZ2V0ID09IG51bGwpXHJcbi8vIFx0XHR7XHJcbi8vIFx0XHRcdHJldHVybiB0YXJnZXQ7XHJcbi8vIFx0XHR9XHJcblx0XHRcclxuLy8gXHRcdGlmICh0YXJnZXQgaW4gdHJhbnNsYXRpb24gPT0gZmFsc2UpXHJcbi8vIFx0XHR7XHJcbi8vIFx0XHRcdGlmIChkeW5vVHJhbnMgIT0gbnVsbClcclxuLy8gXHRcdFx0e1xyXG4vLyBcdFx0XHRcdHJldHVybiBkeW5vVHJhbnModGFyZ2V0KTtcclxuLy8gXHRcdFx0fVxyXG4vLyBcdFx0XHRyZXR1cm4gdGFyZ2V0O1xyXG4vLyBcdFx0fVxyXG5cdFx0XHJcbi8vIFx0XHR2YXIgcmVzdWx0ID0gdHJhbnNsYXRpb25bdGFyZ2V0XTtcclxuLy8gXHRcdGlmIChyZXN1bHQgPT0gbnVsbClcclxuLy8gXHRcdHtcclxuLy8gXHRcdFx0cmV0dXJuIHRhcmdldDtcclxuLy8gXHRcdH1cclxuXHRcdFxyXG4vLyBcdFx0cmV0dXJuIHJlc3VsdDtcclxuLy8gXHR9O1xyXG5cdFxyXG4vLyBcdHdpbmRvdy5fID0gdHJhbnNsYXRlO1xyXG5cclxuLy8gfSkoKTtcclxuXHJcbi8vIGV4cG9ydCBjb25zdCBfID0gd2luZG93Ll87XHJcblxyXG5leHBvcnQgY29uc3QgXyA9IGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHM7IH0iLCJpbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi9lbmdpbmVcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi9saWIvdHJhbnNsYXRlXCI7XHJcblxyXG5leHBvcnQgY29uc3QgQnV0dG9uID0ge1xyXG5cdEJ1dHRvbjogZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdFx0aWYodHlwZW9mIG9wdGlvbnMuY29vbGRvd24gPT0gJ251bWJlcicpIHtcclxuXHRcdFx0dGhpcy5kYXRhX2Nvb2xkb3duID0gb3B0aW9ucy5jb29sZG93bjtcclxuXHRcdH1cclxuXHRcdHRoaXMuZGF0YV9yZW1haW5pbmcgPSAwO1xyXG5cdFx0aWYodHlwZW9mIG9wdGlvbnMuY2xpY2sgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHR0aGlzLmRhdGFfaGFuZGxlciA9IG9wdGlvbnMuY2xpY2s7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHZhciBlbCA9ICQoJzxkaXY+JylcclxuXHRcdFx0LmF0dHIoJ2lkJywgdHlwZW9mKG9wdGlvbnMuaWQpICE9ICd1bmRlZmluZWQnID8gb3B0aW9ucy5pZCA6IFwiQlROX1wiICsgRW5naW5lLmdldEd1aWQoKSlcclxuXHRcdFx0LmFkZENsYXNzKCdidXR0b24nKVxyXG5cdFx0XHQudGV4dCh0eXBlb2Yob3B0aW9ucy50ZXh0KSAhPSAndW5kZWZpbmVkJyA/IG9wdGlvbnMudGV4dCA6IFwiYnV0dG9uXCIpXHJcblx0XHRcdC5jbGljayhmdW5jdGlvbigpIHsgXHJcblx0XHRcdFx0aWYoISQodGhpcykuaGFzQ2xhc3MoJ2Rpc2FibGVkJykpIHtcclxuXHRcdFx0XHRcdEJ1dHRvbi5jb29sZG93bigkKHRoaXMpKTtcclxuXHRcdFx0XHRcdCQodGhpcykuZGF0YShcImhhbmRsZXJcIikoJCh0aGlzKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0XHQuZGF0YShcImhhbmRsZXJcIiwgIHR5cGVvZiBvcHRpb25zLmNsaWNrID09ICdmdW5jdGlvbicgPyBvcHRpb25zLmNsaWNrIDogZnVuY3Rpb24oKSB7IEVuZ2luZS5sb2coXCJjbGlja1wiKTsgfSlcclxuXHRcdFx0LmRhdGEoXCJyZW1haW5pbmdcIiwgMClcclxuXHRcdFx0LmRhdGEoXCJjb29sZG93blwiLCB0eXBlb2Ygb3B0aW9ucy5jb29sZG93biA9PSAnbnVtYmVyJyA/IG9wdGlvbnMuY29vbGRvd24gOiAwKTtcclxuXHRcdGlmIChvcHRpb25zLmltYWdlICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0ZWwuYXR0cihcInN0eWxlXCIsIFwiYmFja2dyb3VuZC1pbWFnZTogdXJsKFxcXCJcIiArIG9wdGlvbnMuaW1hZ2UgKyBcIlxcXCIpOyBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0OyBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyOyBoZWlnaHQ6IDE3MHB4OyBjb2xvcjogd2hpdGU7dGV4dC1zaGFkb3c6IDBweCAwcHggMnB4IGJsYWNrXCIpXHJcblx0XHR9XHJcblx0XHRlbC5hcHBlbmQoJChcIjxkaXY+XCIpLmFkZENsYXNzKCdjb29sZG93bicpKTtcclxuXHRcdFxyXG5cdFx0aWYob3B0aW9ucy5jb3N0KSB7XHJcblx0XHRcdHZhciB0dFBvcyA9IG9wdGlvbnMudHRQb3MgPyBvcHRpb25zLnR0UG9zIDogXCJib3R0b20gcmlnaHRcIjtcclxuXHRcdFx0dmFyIGNvc3RUb29sdGlwID0gJCgnPGRpdj4nKS5hZGRDbGFzcygndG9vbHRpcCAnICsgdHRQb3MpO1xyXG5cdFx0XHRmb3IodmFyIGsgaW4gb3B0aW9ucy5jb3N0KSB7XHJcblx0XHRcdFx0JChcIjxkaXY+XCIpLmFkZENsYXNzKCdyb3dfa2V5JykudGV4dChfKGspKS5hcHBlbmRUbyhjb3N0VG9vbHRpcCk7XHJcblx0XHRcdFx0JChcIjxkaXY+XCIpLmFkZENsYXNzKCdyb3dfdmFsJykudGV4dChvcHRpb25zLmNvc3Rba10pLmFwcGVuZFRvKGNvc3RUb29sdGlwKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjb3N0VG9vbHRpcC5jaGlsZHJlbigpLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRjb3N0VG9vbHRpcC5hcHBlbmRUbyhlbCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYob3B0aW9ucy53aWR0aCkge1xyXG5cdFx0XHRlbC5jc3MoJ3dpZHRoJywgb3B0aW9ucy53aWR0aCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBlbDtcclxuXHR9LFxyXG5cdFxyXG5cdHNldERpc2FibGVkOiBmdW5jdGlvbihidG4sIGRpc2FibGVkKSB7XHJcblx0XHRpZihidG4pIHtcclxuXHRcdFx0aWYoIWRpc2FibGVkICYmICFidG4uZGF0YSgnb25Db29sZG93bicpKSB7XHJcblx0XHRcdFx0YnRuLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHR9IGVsc2UgaWYoZGlzYWJsZWQpIHtcclxuXHRcdFx0XHRidG4uYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0YnRuLmRhdGEoJ2Rpc2FibGVkJywgZGlzYWJsZWQpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0aXNEaXNhYmxlZDogZnVuY3Rpb24oYnRuKSB7XHJcblx0XHRpZihidG4pIHtcclxuXHRcdFx0cmV0dXJuIGJ0bi5kYXRhKCdkaXNhYmxlZCcpID09PSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0sXHJcblx0XHJcblx0Y29vbGRvd246IGZ1bmN0aW9uKGJ0bikge1xyXG5cdFx0dmFyIGNkID0gYnRuLmRhdGEoXCJjb29sZG93blwiKTtcclxuXHRcdGlmKGNkID4gMCkge1xyXG5cdFx0XHQkKCdkaXYuY29vbGRvd24nLCBidG4pLnN0b3AodHJ1ZSwgdHJ1ZSkud2lkdGgoXCIxMDAlXCIpLmFuaW1hdGUoe3dpZHRoOiAnMCUnfSwgY2QgKiAxMDAwLCAnbGluZWFyJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIGIgPSAkKHRoaXMpLmNsb3Nlc3QoJy5idXR0b24nKTtcclxuXHRcdFx0XHRiLmRhdGEoJ29uQ29vbGRvd24nLCBmYWxzZSk7XHJcblx0XHRcdFx0aWYoIWIuZGF0YSgnZGlzYWJsZWQnKSkge1xyXG5cdFx0XHRcdFx0Yi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRidG4uYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdGJ0bi5kYXRhKCdvbkNvb2xkb3duJywgdHJ1ZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRjbGVhckNvb2xkb3duOiBmdW5jdGlvbihidG4pIHtcclxuXHRcdCQoJ2Rpdi5jb29sZG93bicsIGJ0bikuc3RvcCh0cnVlLCB0cnVlKTtcclxuXHRcdGJ0bi5kYXRhKCdvbkNvb2xkb3duJywgZmFsc2UpO1xyXG5cdFx0aWYoIWJ0bi5kYXRhKCdkaXNhYmxlZCcpKSB7XHJcblx0XHRcdGJ0bi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdH1cclxuXHR9XHJcbn07IiwiaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4uL2V2ZW50c1wiXHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCJcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCJcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4uL3BsYXllci9jaGFyYWN0ZXJcIlxyXG5cclxuZXhwb3J0IGNvbnN0IENhcHRhaW4gPSB7XHJcblx0dGFsa1RvQ2FwdGFpbjogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdUaGUgQ2FwdGFpblxcJ3MgVGVudCcpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlZW5GbGFnOiAoKSA9PiAkU00uZ2V0KCdvdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcpLFxyXG5cdFx0XHRcdFx0bmV4dFNjZW5lOiAnbWFpbicsXHJcblx0XHRcdFx0XHRvbkxvYWQ6ICgpID0+ICRTTS5zZXQoJ291dHBvc3QuY2FwdGFpbi5oYXZlTWV0JywgMSksXHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1lvdSBlbnRlciB0aGUgZmFuY2llc3QtbG9va2luZyB0ZW50IGluIHRoZSBPdXRwb3N0LiBBIGxhcmdlIG1hbiB3aXRoIGEgdG9vdGhicnVzaCBtdXN0YWNoZSBhbmQgYSBzZXZlcmUgZnJvd24gbG9va3MgdXAgZnJvbSBoaXMgZGVzay4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCJTaXIsIHlvdSBoYXZlIGVudGVyZWQgdGhlIHRlbnQgb2YgQ2FwdGFpbiBGaW5uZWFzLiBXaGF0IGJ1c2luZXNzIGRvIHlvdSBoYXZlIGhlcmU/XCInKVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXNrQWJvdXRTdXBwbGllcyc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FzayBBYm91dCBTdXBwbGllcycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTonYXNrQWJvdXRTdXBwbGllcyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6IENhcHRhaW4uaGFuZGxlU3VwcGxpZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGU6ICgpID0+ICEkU00uZ2V0KCdvdXRwb3N0LmNhcHRhaW4uYXNrZWRBYm91dFN1cHBsaWVzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Fza0Fib3V0Q2FwdGFpbic6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FzayBBYm91dCBDYXB0YWluJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOiAnY2FwdGFpblJhbWJsZSd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0xlYXZlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgJ21haW4nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdUaGUgQ2FwdGFpbiBncmVldHMgeW91IHdhcm1seS4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCJBaGgsIHllcywgd2VsY29tZSBiYWNrLiBXaGF0IGNhbiBJIGRvIGZvciB5b3U/XCInKVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXNrQWJvdXRTdXBwbGllcyc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FzayBBYm91dCBTdXBwbGllcycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTonYXNrQWJvdXRTdXBwbGllcyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6IENhcHRhaW4uaGFuZGxlU3VwcGxpZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGU6ICgpID0+ICEkU00uZ2V0KCdvdXRwb3N0LmNhcHRhaW4uYXNrZWRBYm91dFN1cHBsaWVzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Fza0Fib3V0Q2FwdGFpbic6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FzayBBYm91dCBDYXB0YWluJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOidjYXB0YWluUmFtYmxlJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnTGVhdmUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAnY2FwdGFpblJhbWJsZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1RoZSBDYXB0YWluXFwncyBleWVzIGdsZWFtIGF0IHRoZSBvcHBvcnR1bml0eSB0byBydW4gZG93biBoaXMgbGlzdCBvZiBhY2hpZXZlbWVudHMuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiV2h5LCBJXFwnbGwgaGF2ZSB5b3Uga25vdyB0aGF0IHlvdSBzdGFuZCBpbiB0aGUgcHJlc2VuY2Ugb2Ygbm9uZSBvdGhlciB0aGFuIEZpbm5lYXMgSi4gRm9ic2xleSwgQ2FwdGFpbiBvZiB0aGUgUm95YWwgQXJteVxcJ3MgRmlmdGggRGl2aXNpb24sIHRoZSBmaW5lc3QgRGl2aXNpb24gaW4gSGlzIE1hamVzdHlcXCdzIHNlcnZpY2UuXCInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnSGUgcHVmZnMgb3V0IGhpcyBjaGVzdCwgZHJhd2luZyBhdHRlbnRpb24gdG8gaGlzIG1hbnkgbWVkYWxzLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIkkgaGF2ZSBjYW1wYWlnbmVkIG9uIGJlaGFsZiBvZiBPdXIgTG9yZHNoaXAgYWNyb3NzIG1hbnkgbGFuZHMsIGluY2x1ZGluZyBUaGUgRmFyIFdlc3QsIHRoZSBub3J0aGVybiBib3JkZXJzIG9mIFVtYmVyc2hpcmUgYW5kIFBlbGluZ2FsLCBOZXcgQmVsbGlzaWEsIGFuZCBlYWNoIG9mIHRoZSBGaXZlIElzbGVzIG9mIHRoZSBQaXJyaGlhbiBTZWEuXCInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnSGUgcGF1c2VzIGZvciBhIG1vbWVudCwgcGVyaGFwcyB0byBzZWUgaWYgeW91IGFyZSBzdWl0YWJseSBpbXByZXNzZWQsIHRoZW4gY29udGludWVzLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIkFzIENhcHRhaW4gb2YgdGhlIEZpZnRoIERpdmlzaW9uLCBJIGhhZCB0aGUgZXN0ZWVtZWQgcHJpdmlsZWdlIG9mIGVuc3VyaW5nIHRoZSBzYWZldHkgb2YgdGhlc2UgbGFuZHMgZm9yIG91ciBmYWlyIGNpdGl6ZW5zLiBJIGhhdmUgYmVlbiBhd2FyZGVkIG1hbnkgdGltZXMgb3ZlciBmb3IgbXkgYnJhdmVyeSBpbiB0aGUgZmFjZSBvZiB1dG1vc3QgcGVyaWwuIEZvciBpbnN0YW5jZSwgZHVyaW5nIHRoZSBTZWEgQ2FtcGFpZ24gb24gVGh5cHBlLCBUaGlyZCBvZiB0aGUgRml2ZSBJc2xlcywgd2Ugd2VyZSBhbWJ1c2hlZCB3aGlsZSBkaXNlbWJhcmtpbmcgZnJvbSBvdXIgc2hpcC4gVGhpbmtpbmcgcXVpY2tseSwgSS4uLlwiJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1RoZSBjYXB0YWluIGNvbnRpbnVlcyB0byByYW1ibGUgbGlrZSB0aGlzIGZvciBzZXZlcmFsIG1vcmUgbWludXRlcywgZ2l2aW5nIHlvdSB0aW1lIHRvIGJlY29tZSBtdWNoIG1vcmUgZmFtaWxpYXIgd2l0aCB0aGUgZGlydCB1bmRlciB5b3VyIGZpbmdlcm5haWxzLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIi4uLiBhbmQgVEhBVCwgbXkgZ29vZCBhZHZlbnR1cmVyLCBpcyB3aHkgSSBhbHdheXMga2VlcCBmcmVzaCBiYXNpbCBvbiBoYW5kLlwiJylcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Zhc2NpbmF0aW5nJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnRmFzY2luYXRpbmcnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6J21haW5Db250aW51ZWQnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICdtYWluQ29udGludWVkJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnVGhlIENhcHRhaW4gc2h1ZmZsZXMgaGlzIHBhcGVycyBpbiBhIHNvbWV3aGF0IHBlcmZvcm1hdGl2ZSB3YXkuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiV2FzIHRoZXJlIHNvbWV0aGluZyBlbHNlIHlvdSBuZWVkZWQ/XCInKVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXNrQWJvdXRTdXBwbGllcyc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FzayBBYm91dCBTdXBwbGllcycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTonYXNrQWJvdXRTdXBwbGllcyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6IENhcHRhaW4uaGFuZGxlU3VwcGxpZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGU6ICgpID0+ICEkU00uZ2V0KCdvdXRwb3N0LmNhcHRhaW4uYXNrZWRBYm91dFN1cHBsaWVzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Fza0Fib3V0Q2FwdGFpbic6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FzayBBYm91dCBDYXB0YWluJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOidjYXB0YWluUmFtYmxlJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnTGVhdmUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAnYXNrQWJvdXRTdXBwbGllcyc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1RoZSBDYXB0YWluXFwncyBleWVzIGdsZWFtIHdpdGggYSBtaXh0dXJlIG9mIHJlYWxpemF0aW9uIGFuZCBndWlsdC4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCJBaGgsIHllcywgcmlnaHQsIHRoZSBzdXBwbGllcy4gSSBzdXBwb3NlIHRoZSBNYXlvciBpcyBzdGlsbCB3YWl0aW5nIGZvciB0aG9zZS4gSGF2ZSBhIGxvb2sgaW4gdGhhdCBjaGVzdCBvdmVyIHRoZXJlLCBpdCBzaG91bGQgaGF2ZSBldmVyeXRoaW5nIHlvdSBuZWVkLlwiJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ0hlIGluZGljYXRlcyB0byBhIGNoZXN0IGF0IHRoZSBiYWNrIG9mIHRoZSByb29tLiBZb3Ugb3BlbiB0aGUgbGlkLCByZXZlYWxpbmcgdGhlIHN1cHBsaWVzIHdpdGhpbi4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnWW91IHRha2UgdGhlIHN1cHBsaWVzLicpXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnR29vZCBTdHVmZicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcblxyXG4gICAgaGFuZGxlU3VwcGxpZXM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdoYW5kbGluZyBzdXBwbGllcycpO1xyXG4gICAgICAgICRTTS5zZXQoJ291dHBvc3QuY2FwdGFpbi5hc2tlZEFib3V0U3VwcGxpZXMnLCAxKTtcclxuICAgICAgICBDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoXCJDYXB0YWluLnN1cHBsaWVzXCIpO1xyXG4gICAgICAgIENoYXJhY3Rlci5jaGVja1F1ZXN0U3RhdHVzKFwibWF5b3JTdXBwbGllc1wiKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IFZpbGxhZ2UgfSBmcm9tIFwiLi4vcGxhY2VzL3ZpbGxhZ2VcIjtcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4uL3BsYXllci9jaGFyYWN0ZXJcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBMaXogPSB7XHJcbiAgICBzZXRMaXpBY3RpdmU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0JFNNLnNldCgndmlsbGFnZS5saXpBY3RpdmUnLCAxKTtcclxuXHRcdCRTTS5zZXQoJ3ZpbGxhZ2UubGl6LmNhbkZpbmRCb29rJywgMCk7XHJcblx0XHQkU00uc2V0KCd2aWxsYWdlLmxpei5oYXNCb29rJywgMSk7XHJcblx0XHRWaWxsYWdlLnVwZGF0ZUJ1dHRvbigpO1xyXG5cdH0sXHJcblxyXG5cdHRhbGtUb0xpejogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdMaXpcXCdzIGhvdXNlLCBhdCB0aGUgZWRnZSBvZiB0b3duJyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHRzZWVuRmxhZzogKCkgPT4gJFNNLmdldCgndmlsbGFnZS5saXouaGF2ZU1ldCcpLFxyXG5cdFx0XHRcdFx0bmV4dFNjZW5lOiAnbWFpbicsXHJcblx0XHRcdFx0XHRvbkxvYWQ6ICgpID0+ICRTTS5zZXQoJ3ZpbGxhZ2UubGl6LmhhdmVNZXQnLCAxKSxcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnWW91IGVudGVyIHRoZSBidWlsZGluZyBhbmQgYXJlIGltbWVkaWF0ZWx5IHBsdW5nZWQgaW50byBhIGxhYnlyaW50aCBvZiBzaGVsdmVzIGhhcGhhemFyZGx5IGZpbGxlZCB3aXRoIGJvb2tzIG9mIGFsbCBraW5kcy4gQWZ0ZXIgYSBiaXQgb2Ygc2VhcmNoaW5nLCB5b3UgZmluZCBhIHNpZGUgcm9vbSB3aGVyZSBhIHdvbWFuIHdpdGggbW91c3kgaGFpciBhbmQgZ2xhc3NlcyBpcyBzaXR0aW5nIGF0IGEgd3JpdGluZyBkZXNrLiBTaGVcXCdzIHJlYWRpbmcgYSBsYXJnZSBib29rIHRoYXQgYXBwZWFycyB0byBpbmNsdWRlIGRpYWdyYW1zIG9mIHNvbWUgc29ydCBvZiBwbGFudC4gU2hlIGxvb2tzIHVwIGFzIHlvdSBlbnRlciB0aGUgcm9vbS4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJXaG8gdGhlIGhlbGwgYXJlIHlvdT9cIicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnYXNrQWJvdXRUb3duJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBhYm91dCBDaGFkdG9waWEnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnY2hhZHRvcGlhUmFtYmxlJ31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J3F1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBmb3IgYSBxdWVzdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdxdWVzdFJlcXVlc3QnfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnbGVhdmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnTGVhdmUnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdjaGFkdG9waWFSYW1ibGUnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ0xpeiBsb29rcyBhdCB5b3UgZm9yIGEgbW9tZW50IGJlZm9yZSByZXR1cm5pbmcgaGVyIGdhemUgdG8gdGhlIGJvb2sgaW4gZnJvbnQgb2YgaGVyLicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIlRoZXJlXFwncyBhIGJvb2sgaW4gaGVyZSBzb21ld2hlcmUgYWJvdXQgdGhlIGZvdW5kaW5nIG9mIENoYWR0b3BpYS4gSWYgeW91IGNhbiBmaW5kIGl0LCB5b3VcXCdyZSBmcmVlIHRvIGJvcnJvdyBpdC5cIicpXSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J29rYXknOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnT2theSwgdGhlbi4nKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnbWFpbid9LFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiAoKSA9PiAkU00uc2V0KCd2aWxsYWdlLmxpei5jYW5GaW5kQm9vaycsIHRydWUpXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cclxuXHRcdFx0XHQnbWFpbic6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtfKCdMaXogc2VlbXMgZGV0ZXJtaW5lZCBub3QgdG8gcGF5IGF0dGVudGlvbiB0byB5b3UuJyldLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnYXNrQWJvdXRUb3duJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBhYm91dCBDaGFkdG9waWEnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnY2hhZHRvcGlhUmFtYmxlJ30sXHJcblx0XHRcdFx0XHRcdFx0YXZhaWxhYmxlOiAoKSA9PiAhJFNNLmdldCgndmlsbGFnZS5saXouY2FuRmluZEJvb2snKVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQncXVlc3QnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGZvciBhIHF1ZXN0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ3F1ZXN0UmVxdWVzdCd9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdmaW5kQm9vayc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdUcnkgdG8gZmluZCB0aGUgYm9vaycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdmaW5kQm9vayd9LFxyXG5cdFx0XHRcdFx0XHRcdC8vIFRPRE86IGEgXCJ2aXNpYmxlXCIgZmxhZyB3b3VsZCBiZSBnb29kIGhlcmUsIGZvciBzaXR1YXRpb25zIHdoZXJlIGFuIG9wdGlvblxyXG5cdFx0XHRcdFx0XHRcdC8vICAgaXNuJ3QgeWV0IGtub3duIHRvIHRoZSBwbGF5ZXJcclxuXHRcdFx0XHRcdFx0XHR2aXNpYmxlOiAoKSA9PiAkU00uZ2V0KCd2aWxsYWdlLmxpei5jYW5GaW5kQm9vaycpLFxyXG5cdFx0XHRcdFx0XHRcdGF2YWlsYWJsZTogKCkgPT4gKCRTTS5nZXQoJ3ZpbGxhZ2UubGl6LmNhbkZpbmRCb29rJykgYXMgbnVtYmVyID4gMCkgJiYgKCRTTS5nZXQoJ3ZpbGxhZ2UubGl6Lmhhc0Jvb2snKSlcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0xlYXZlJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnZmluZEJvb2snOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ0xlYXZpbmcgTGl6IHRvIGhlciBidXNpbmVzcywgeW91IHdhbmRlciBhcm91bmQgYW1pZHN0IHRoZSBib29rcywgd29uZGVyaW5nIGhvdyB5b3VcXCdsbCBldmVyIG1hbmFnZSB0byBmaW5kIHdoYXQgeW91XFwncmUgbG9va2luZyBmb3IgaW4gYWxsIHRoaXMgdW5vcmdhbml6ZWQgbWVzcy4nKSxcclxuXHRcdFx0XHRcdFx0XygnRm9ydHVuYXRlbHksIHRoZSBjcmVhdG9yIG9mIHRoaXMgZ2FtZSBkb2VzblxcJ3QgZmVlbCBsaWtlIGl0XFwnZCBiZSB2ZXJ5IGludGVyZXN0aW5nIHRvIG1ha2UgdGhpcyBpbnRvIGEgcHV6emxlLCBzbyB5b3Ugc3BvdCB0aGUgYm9vayBvbiBhIG5lYXJieSBzaGVsZiBhbmQgZ3JhYiBpdC4nKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J3NpY2snOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnT2gsIHNpY2snKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiAoKSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyAkU00uc2V0KCdzdG9yZXMuV2VpcmQgQm9vaycsIDEpO1xyXG5cdFx0XHRcdFx0XHRcdFx0Q2hhcmFjdGVyLmFkZFRvSW52ZW50b3J5KFwiTGl6LndlaXJkQm9va1wiKTtcclxuXHRcdFx0XHRcdFx0XHRcdCRTTS5zZXQoJ3ZpbGxhZ2UubGl6Lmhhc0Jvb2snLCAwKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdxdWVzdFJlcXVlc3QnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ0xpeiBsZXRzIG91dCBhbiBhbm5veWVkIHNpZ2guJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiT2ggYnJhdmUgYWR2ZW50dXJlciwgSSBzZWVtIHRvIGhhdmUgbG9zdCBteSBwYXRpZW5jZS4gV2hlbiBsYXN0IEkgc2F3IGl0LCBpdCB3YXMgc29tZXdoZXJlIG91dHNpZGUgb2YgdGhpcyBidWlsZGluZy4gV291bGRzdCB0aG91IHJlY292ZXIgdGhhdCB3aGljaCBoYXMgYmVlbiBzdG9sZW4gZnJvbSBtZT9cIicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnb2theSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdPa2F5LCBqZWV6LCBJIGdldCBpdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdtYWluJ31cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG59IiwiaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgTGl6IH0gZnJvbSBcIi4vbGl6XCI7XHJcbmltcG9ydCB7IFJvYWQgfSBmcm9tIFwiLi4vcGxhY2VzL3JvYWRcIjtcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4uL3BsYXllci9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IHsgVmlsbGFnZSB9IGZyb20gXCIuLi9wbGFjZXMvdmlsbGFnZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IE1heW9yID0ge1xyXG4gICAgdGFsa1RvTWF5b3I6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnTWVldCB0aGUgTWF5b3InKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuXHRcdFx0XHRcdHNlZW5GbGFnOiAoKSA9PiAkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVNZXQnKSxcclxuXHRcdFx0XHRcdG5leHRTY2VuZTogJ21haW4nLFxyXG5cdFx0XHRcdFx0b25Mb2FkOiAoKSA9PiAkU00uc2V0KCd2aWxsYWdlLm1heW9yLmhhdmVNZXQnLCAxKSxcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnVGhlIG1heW9yIHNtaWxlcyBhdCB5b3UgYW5kIHNheXM6JyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiV2VsY29tZSB0byBDaGFkdG9waWEsIElcXCdtIHRoZSBtYXlvciBvZiB0aGVzZSBoZXJlIHBhcnRzLiBXaGF0IGNhbiBJIGRvIHlvdSBmb3I/XCInKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2Fza0Fib3V0VG93bic6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgYWJvdXQgQ2hhZHRvcGlhJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2NoYWR0b3BpYVJhbWJsZSd9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdxdWVzdCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgZm9yIGEgcXVlc3QnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAncXVlc3QnfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnbGVhdmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnTGVhdmUnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdjaGFkdG9waWFSYW1ibGUnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1RoZSBtYXlvciBwdXNoZXMgdGhlIGJyaW0gb2YgaGlzIGhhdCB1cC4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJXZWxsLCB3ZVxcJ3ZlIGFsd2F5cyBiZWVuIGhlcmUsIGxvbmcgYXMgSSBjYW4gcmVtZW1iZXIuIEkgdG9vayBvdmVyIGFmdGVyIHRoZSBsYXN0IG1heW9yIGRpZWQsIGJ1dCBoZSB3b3VsZCBoYXZlIGJlZW4gdGhlIG9ubHkgcGVyc29uIHdpdGggYW55IGhpc3RvcmljYWwga25vd2xlZGdlIG9mIHRoaXMgdmlsbGFnZS5cIicpLFxyXG5cdFx0XHRcdFx0XHRfKCdIZSBwYXVzZXMgZm9yIGEgbW9tZW50IGFuZCB0b3VzbGVzIHNvbWUgb2YgdGhlIHdpc3B5IGhhaXJzIHRoYXQgaGF2ZSBwb2tlZCBvdXQgZnJvbSB1bmRlciB0aGUgcmFpc2VkIGhhdC4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJBY3R1YWxseSwgeW91IG1pZ2h0IGFzayBMaXosIHNoZSBoYXMgYSBidW5jaCBvZiBoZXIgbW90aGVyXFwncyBib29rcyBmcm9tIHdheSBiYWNrIHdoZW4uIFNoZSBsaXZlcyBhdCB0aGUgZWRnZSBvZiB0b3duLlwiJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdva2F5Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ09rYXksIHRoZW4uJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ21haW4nfSxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogTGl6LnNldExpekFjdGl2ZVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnbWFpbic6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnVGhlIG1heW9yIHNheXM6JyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiQW55d2F5LCB3aGF0IEVMU0UgY2FuIEkgZG8geW91IGZvcj9cIicpLFxyXG5cdFx0XHRcdFx0XHRfKCdIZSBjaHVja2xlcyBhdCBoaXMgY2xldmVyIHVzZSBvZiBsYW5ndWFnZS4nKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2Fza0Fib3V0VG93bic6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgYWJvdXQgQ2hhZHRvcGlhJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2NoYWR0b3BpYVJhbWJsZSd9LFxyXG5cdFx0XHRcdFx0XHRcdC8vIGltYWdlOiBcImFzc2V0cy9jYXJkcy9saXR0bGVfd29sZi5wbmdcIlxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQncXVlc3QnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGZvciBhIHF1ZXN0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ3F1ZXN0J30sXHJcblx0XHRcdFx0XHRcdFx0YXZhaWxhYmxlOiAoKSA9PlxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gbm90IGF2YWlsYWJsZSBpZiBtYXlvclN1cHBsaWVzIGlzIGluLXByb2dyZXNzXHJcblx0XHRcdFx0XHRcdFx0XHQoQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW1wibWF5b3JTdXBwbGllc1wiXSA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gcmUtYWRkIHRoaXMgY29uZGl0aW9uIGxhdGVyLCB3ZSBuZWVkIHRvIHNlbmQgdGhlbSB0byBhIGRpZmZlcmVudFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gICBxdWVzdCBkaWFsb2cgaWYgdGhleSBhbHJlYWR5IGRpZCB0aGUgZmlyc3QgcXVlc3RcclxuXHRcdFx0XHRcdFx0XHRcdC8vIHx8IChDaGFyYWN0ZXIucXVlc3RTdGF0dXNbXCJtYXlvclN1cHBsaWVzXCJdID09IC0xKVxyXG5cdFx0XHRcdFx0XHRcdC8vIGltYWdlOiBcImFzc2V0cy9jYXJkcy9qb2tlci5wbmdcIlxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnZ2l2ZVN1cHBsaWVzJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0hhbmQgb3ZlciB0aGUgc3VwcGxpZXMnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnZ2l2ZVN1cHBsaWVzJ30sXHJcblx0XHRcdFx0XHRcdFx0YXZhaWxhYmxlOiAoKSA9PiBcclxuXHRcdFx0XHRcdFx0XHRcdCgkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykgPT09IHVuZGVmaW5lZCkgXHJcblx0XHRcdFx0XHRcdFx0XHQmJiAoQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW1wibWF5b3JTdXBwbGllc1wiXSAhPT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRcdFx0XHRcdFx0JiYgQ2hhcmFjdGVyLmludmVudG9yeVtcIkNhcHRhaW4uc3VwcGxpZXNcIl0sXHJcblx0XHRcdFx0XHRcdFx0dmlzaWJsZTogKCkgPT5cclxuXHRcdFx0XHRcdFx0XHRcdChDaGFyYWN0ZXIucXVlc3RTdGF0dXNbXCJtYXlvclN1cHBsaWVzXCJdICE9PSB1bmRlZmluZWQpLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiAoKSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0XHRDaGFyYWN0ZXIucmVtb3ZlRnJvbUludmVudG9yeShcIkNhcHRhaW4uc3VwcGxpZXNcIik7XHJcblx0XHRcdFx0XHRcdFx0XHQkU00uc2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJywgMSk7XHJcblx0XHRcdFx0XHRcdFx0XHRDaGFyYWN0ZXIuY2hlY2tRdWVzdFN0YXR1cyhcIm1heW9yU3VwcGxpZXNcIik7XHJcblx0XHRcdFx0XHRcdFx0XHRWaWxsYWdlLnVwZGF0ZUJ1dHRvbigpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0xlYXZlJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHQvLyBpbWFnZTogXCJhc3NldHMvY2FyZHMvcmF2ZW4ucG5nXCJcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J3F1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdUaGUgbWF5b3IgdGhpbmtzIGZvciBhIG1vbWVudC4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJZb3Uga25vdywgaXRcXCdzIGJlZW4gYSB3aGlsZSBzaW5jZSBvdXIgbGFzdCBzaGlwbWVudCBvZiBzdXBwbGllcyBhcnJpdmVkIGZyb20gdGhlIG91dHBvc3QuIE1pbmQgbG9va2luZyBpbnRvIHRoYXQgZm9yIHVzP1wiJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiWW91IGNhbiBhc2sgYWJvdXQgaXQgYXQgdGhlIG91dHBvc3QsIG9yIGp1c3Qgd2FuZGVyIGFyb3VuZCBvbiB0aGUgcm9hZCBhbmQgc2VlIGlmIHlvdSBmaW5kIGFueSBjbHVlcy4gRWl0aGVyIHdheSwgaXRcXCdzIHRpbWUgdG8gaGl0IHRoZSByb2FkLCBhZHZlbnR1cmVyIVwiJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdhbHJpZ2h0eSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBbHJpZ2h0eScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdtYWluJ30sXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IE1heW9yLnN0YXJ0U3VwcGxpZXNRdWVzdFxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnZ2l2ZVN1cHBsaWVzJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdUaGUgbWF5b3Igc21pbGVzLCBhbmQgdGhlIGVkZ2VzIG9mIGhpcyBleWVzIGNyaW5rbGUuJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiVGhhbmsgeW91LCBicmF2ZSBhZHZlbnR1cmVyISBXaXRoIHRoZXNlIHN1cHBsaWVzLCB0aGUgdmlsbGFnZSBjYW4gb25jZSBhZ2FpbiB0aHJpdmUuXCInKSxcclxuXHRcdFx0XHRcdFx0XygnSGUgdGFrZXMgdGhlbSBmcm9tIHlvdSBncmFjaW91c2x5LCBhbmQgcHJvbXB0bHkgaGFuZHMgdGhlbSBvZmYgdG8gc29tZSB3b3JrZXJzLCB3aG8gcXVpY2tseSBlcmVjdCBhIGJ1aWxkaW5nIHRoYXQgZ2l2ZXMgeW91IGEgbmV3IGJ1dHRvbiB0byBjbGljaycpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnaW1wcmVzc2l2ZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdJbXByZXNzaXZlIScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRzdGFydFN1cHBsaWVzUXVlc3Q6IGZ1bmN0aW9uICgpIHtcclxuXHRcdC8vIGlmICghJFNNLmdldCgncXVlc3Quc3VwcGxpZXMnKSkge1xyXG5cdFx0Ly8gXHQvLyAxID0gc3RhcnRlZCwgMiA9IG5leHQgc3RlcCwgZXRjLiB1bnRpbCBjb21wbGV0ZWRcclxuXHRcdC8vIFx0JFNNLnNldCgncXVlc3Quc3VwcGxpZXMnLCAxKTtcclxuXHRcdC8vIFx0Um9hZC5pbml0KCk7XHJcblx0XHQvLyB9XHJcblx0XHRpZiAoQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW1wibWF5b3JTdXBwbGllc1wiXSA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdENoYXJhY3Rlci5zZXRRdWVzdFN0YXR1cyhcIm1heW9yU3VwcGxpZXNcIiwgMCk7XHJcblx0XHRcdFJvYWQuaW5pdCgpO1xyXG5cdFx0fVxyXG5cdH1cclxufSIsIi8vIEB0cy1ub2NoZWNrXHJcblxyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBOb3RpZmljYXRpb25zIH0gZnJvbSBcIi4vbm90aWZpY2F0aW9uc1wiO1xyXG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgVmlsbGFnZSB9IGZyb20gXCIuL3BsYWNlcy92aWxsYWdlXCI7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuL3BsYXllci9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IHsgV2VhdGhlciB9IGZyb20gXCIuL3dlYXRoZXJcIjtcclxuaW1wb3J0IHsgUm9hZCB9IGZyb20gXCIuL3BsYWNlcy9yb2FkXCI7XHJcbmltcG9ydCB7IE91dHBvc3QgfSBmcm9tIFwiLi9wbGFjZXMvb3V0cG9zdFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEVuZ2luZSA9IHdpbmRvdy5FbmdpbmUgPSB7XHJcblx0XHJcblx0U0lURV9VUkw6IGVuY29kZVVSSUNvbXBvbmVudChcImh0dHA6Ly9hZGFya3Jvb20uZG91Ymxlc3BlYWtnYW1lcy5jb21cIiksXHJcblx0VkVSU0lPTjogMS4zLFxyXG5cdE1BWF9TVE9SRTogOTk5OTk5OTk5OTk5OTksXHJcblx0U0FWRV9ESVNQTEFZOiAzMCAqIDEwMDAsXHJcblx0R0FNRV9PVkVSOiBmYWxzZSxcclxuXHRcclxuXHQvL29iamVjdCBldmVudCB0eXBlc1xyXG5cdHRvcGljczoge30sXHJcblx0XHRcclxuXHRQZXJrczoge1xyXG5cdFx0J2JveGVyJzoge1xyXG5cdFx0XHRuYW1lOiBfKCdib3hlcicpLFxyXG5cdFx0XHRkZXNjOiBfKCdwdW5jaGVzIGRvIG1vcmUgZGFtYWdlJyksXHJcblx0XHRcdC8vLyBUUkFOU0xBVE9SUyA6IG1lYW5zIHdpdGggbW9yZSBmb3JjZS5cclxuXHRcdFx0bm90aWZ5OiBfKCdsZWFybmVkIHRvIHRocm93IHB1bmNoZXMgd2l0aCBwdXJwb3NlJylcclxuXHRcdH0sXHJcblx0XHQnbWFydGlhbCBhcnRpc3QnOiB7XHJcblx0XHRcdG5hbWU6IF8oJ21hcnRpYWwgYXJ0aXN0JyksXHJcblx0XHRcdGRlc2M6IF8oJ3B1bmNoZXMgZG8gZXZlbiBtb3JlIGRhbWFnZS4nKSxcclxuXHRcdFx0bm90aWZ5OiBfKCdsZWFybmVkIHRvIGZpZ2h0IHF1aXRlIGVmZmVjdGl2ZWx5IHdpdGhvdXQgd2VhcG9ucycpXHJcblx0XHR9LFxyXG5cdFx0J3VuYXJtZWQgbWFzdGVyJzoge1xyXG5cdFx0XHQvLy8gVFJBTlNMQVRPUlMgOiBtYXN0ZXIgb2YgdW5hcm1lZCBjb21iYXRcclxuXHRcdFx0bmFtZTogXygndW5hcm1lZCBtYXN0ZXInKSxcclxuXHRcdFx0ZGVzYzogXygncHVuY2ggdHdpY2UgYXMgZmFzdCwgYW5kIHdpdGggZXZlbiBtb3JlIGZvcmNlJyksXHJcblx0XHRcdG5vdGlmeTogXygnbGVhcm5lZCB0byBzdHJpa2UgZmFzdGVyIHdpdGhvdXQgd2VhcG9ucycpXHJcblx0XHR9LFxyXG5cdFx0J2JhcmJhcmlhbic6IHtcclxuXHRcdFx0bmFtZTogXygnYmFyYmFyaWFuJyksXHJcblx0XHRcdGRlc2M6IF8oJ21lbGVlIHdlYXBvbnMgZGVhbCBtb3JlIGRhbWFnZScpLFxyXG5cdFx0XHRub3RpZnk6IF8oJ2xlYXJuZWQgdG8gc3dpbmcgd2VhcG9ucyB3aXRoIGZvcmNlJylcclxuXHRcdH0sXHJcblx0XHQnc2xvdyBtZXRhYm9saXNtJzoge1xyXG5cdFx0XHRuYW1lOiBfKCdzbG93IG1ldGFib2xpc20nKSxcclxuXHRcdFx0ZGVzYzogXygnZ28gdHdpY2UgYXMgZmFyIHdpdGhvdXQgZWF0aW5nJyksXHJcblx0XHRcdG5vdGlmeTogXygnbGVhcm5lZCBob3cgdG8gaWdub3JlIHRoZSBodW5nZXInKVxyXG5cdFx0fSxcclxuXHRcdCdkZXNlcnQgcmF0Jzoge1xyXG5cdFx0XHRuYW1lOiBfKCdkZXNlcnQgcmF0JyksXHJcblx0XHRcdGRlc2M6IF8oJ2dvIHR3aWNlIGFzIGZhciB3aXRob3V0IGRyaW5raW5nJyksXHJcblx0XHRcdG5vdGlmeTogXygnbGVhcm5lZCB0byBsb3ZlIHRoZSBkcnkgYWlyJylcclxuXHRcdH0sXHJcblx0XHQnZXZhc2l2ZSc6IHtcclxuXHRcdFx0bmFtZTogXygnZXZhc2l2ZScpLFxyXG5cdFx0XHRkZXNjOiBfKCdkb2RnZSBhdHRhY2tzIG1vcmUgZWZmZWN0aXZlbHknKSxcclxuXHRcdFx0bm90aWZ5OiBfKFwibGVhcm5lZCB0byBiZSB3aGVyZSB0aGV5J3JlIG5vdFwiKVxyXG5cdFx0fSxcclxuXHRcdCdwcmVjaXNlJzoge1xyXG5cdFx0XHRuYW1lOiBfKCdwcmVjaXNlJyksXHJcblx0XHRcdGRlc2M6IF8oJ2xhbmQgYmxvd3MgbW9yZSBvZnRlbicpLFxyXG5cdFx0XHRub3RpZnk6IF8oJ2xlYXJuZWQgdG8gcHJlZGljdCB0aGVpciBtb3ZlbWVudCcpXHJcblx0XHR9LFxyXG5cdFx0J3Njb3V0Jzoge1xyXG5cdFx0XHRuYW1lOiBfKCdzY291dCcpLFxyXG5cdFx0XHRkZXNjOiBfKCdzZWUgZmFydGhlcicpLFxyXG5cdFx0XHRub3RpZnk6IF8oJ2xlYXJuZWQgdG8gbG9vayBhaGVhZCcpXHJcblx0XHR9LFxyXG5cdFx0J3N0ZWFsdGh5Jzoge1xyXG5cdFx0XHRuYW1lOiBfKCdzdGVhbHRoeScpLFxyXG5cdFx0XHRkZXNjOiBfKCdiZXR0ZXIgYXZvaWQgY29uZmxpY3QgaW4gdGhlIHdpbGQnKSxcclxuXHRcdFx0bm90aWZ5OiBfKCdsZWFybmVkIGhvdyBub3QgdG8gYmUgc2VlbicpXHJcblx0XHR9LFxyXG5cdFx0J2dhc3Ryb25vbWUnOiB7XHJcblx0XHRcdG5hbWU6IF8oJ2dhc3Ryb25vbWUnKSxcclxuXHRcdFx0ZGVzYzogXygncmVzdG9yZSBtb3JlIGhlYWx0aCB3aGVuIGVhdGluZycpLFxyXG5cdFx0XHRub3RpZnk6IF8oJ2xlYXJuZWQgdG8gbWFrZSB0aGUgbW9zdCBvZiBmb29kJylcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHtcclxuXHRcdHN0YXRlOiBudWxsLFxyXG5cdFx0ZGVidWc6IHRydWUsXHJcblx0XHRsb2c6IHRydWUsXHJcblx0XHRkcm9wYm94OiBmYWxzZSxcclxuXHRcdGRvdWJsZVRpbWU6IGZhbHNlXHJcblx0fSxcclxuXHJcblx0X2RlYnVnOiBmYWxzZSxcclxuXHRcdFxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdFx0dGhpcy5fZGVidWcgPSB0aGlzLm9wdGlvbnMuZGVidWc7XHJcblx0XHR0aGlzLl9sb2cgPSB0aGlzLm9wdGlvbnMubG9nO1xyXG5cdFx0XHJcblx0XHQvLyBDaGVjayBmb3IgSFRNTDUgc3VwcG9ydFxyXG5cdFx0aWYoIUVuZ2luZS5icm93c2VyVmFsaWQoKSkge1xyXG5cdFx0XHR3aW5kb3cubG9jYXRpb24gPSAnYnJvd3Nlcldhcm5pbmcuaHRtbCc7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIENoZWNrIGZvciBtb2JpbGVcclxuXHRcdGlmKEVuZ2luZS5pc01vYmlsZSgpKSB7XHJcblx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9ICdtb2JpbGVXYXJuaW5nLmh0bWwnO1xyXG5cdFx0fVxyXG5cclxuXHRcdEVuZ2luZS5kaXNhYmxlU2VsZWN0aW9uKCk7XHJcblx0XHRcclxuXHRcdGlmKHRoaXMub3B0aW9ucy5zdGF0ZSAhPSBudWxsKSB7XHJcblx0XHRcdHdpbmRvdy5TdGF0ZSA9IHRoaXMub3B0aW9ucy5zdGF0ZTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEVuZ2luZS5sb2FkR2FtZSgpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2xvY2F0aW9uU2xpZGVyJykuYXBwZW5kVG8oJyNtYWluJyk7XHJcblxyXG5cdFx0dmFyIG1lbnUgPSAkKCc8ZGl2PicpXHJcblx0XHRcdC5hZGRDbGFzcygnbWVudScpXHJcblx0XHRcdC5hcHBlbmRUbygnYm9keScpO1xyXG5cclxuXHRcdGlmKHR5cGVvZiBsYW5ncyAhPSAndW5kZWZpbmVkJyl7XHJcblx0XHRcdHZhciBjdXN0b21TZWxlY3QgPSAkKCc8c3Bhbj4nKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnY3VzdG9tU2VsZWN0JylcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHRcdFx0dmFyIHNlbGVjdE9wdGlvbnMgPSAkKCc8c3Bhbj4nKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnY3VzdG9tU2VsZWN0T3B0aW9ucycpXHJcblx0XHRcdFx0LmFwcGVuZFRvKGN1c3RvbVNlbGVjdCk7XHJcblx0XHRcdHZhciBvcHRpb25zTGlzdCA9ICQoJzx1bD4nKVxyXG5cdFx0XHRcdC5hcHBlbmRUbyhzZWxlY3RPcHRpb25zKTtcclxuXHRcdFx0JCgnPGxpPicpXHJcblx0XHRcdFx0LnRleHQoXCJsYW5ndWFnZS5cIilcclxuXHRcdFx0XHQuYXBwZW5kVG8ob3B0aW9uc0xpc3QpO1xyXG5cdFx0XHRcclxuXHRcdFx0JC5lYWNoKGxhbmdzLCBmdW5jdGlvbihuYW1lLGRpc3BsYXkpe1xyXG5cdFx0XHRcdCQoJzxsaT4nKVxyXG5cdFx0XHRcdFx0LnRleHQoZGlzcGxheSlcclxuXHRcdFx0XHRcdC5hdHRyKCdkYXRhLWxhbmd1YWdlJywgbmFtZSlcclxuXHRcdFx0XHRcdC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkgeyBFbmdpbmUuc3dpdGNoTGFuZ3VhZ2UodGhpcyk7IH0pXHJcblx0XHRcdFx0XHQuYXBwZW5kVG8ob3B0aW9uc0xpc3QpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2xpZ2h0c09mZiBtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygnbGlnaHRzIG9mZi4nKSlcclxuXHRcdFx0LmNsaWNrKEVuZ2luZS50dXJuTGlnaHRzT2ZmKVxyXG5cdFx0XHQuYXBwZW5kVG8obWVudSk7XHJcblxyXG5cdFx0JCgnPHNwYW4+JylcclxuXHRcdFx0LmFkZENsYXNzKCdtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygnaHlwZXIuJykpXHJcblx0XHRcdC5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0XHRcdEVuZ2luZS5vcHRpb25zLmRvdWJsZVRpbWUgPSAhRW5naW5lLm9wdGlvbnMuZG91YmxlVGltZTtcclxuXHRcdFx0XHRpZihFbmdpbmUub3B0aW9ucy5kb3VibGVUaW1lKVxyXG5cdFx0XHRcdFx0JCh0aGlzKS50ZXh0KF8oJ2NsYXNzaWMuJykpO1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdCQodGhpcykudGV4dChfKCdoeXBlci4nKSk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHQudGV4dChfKCdyZXN0YXJ0LicpKVxyXG5cdFx0XHQuY2xpY2soRW5naW5lLmNvbmZpcm1EZWxldGUpXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHRcdFxyXG5cdFx0JCgnPHNwYW4+JylcclxuXHRcdFx0LmFkZENsYXNzKCdtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygnc2hhcmUuJykpXHJcblx0XHRcdC5jbGljayhFbmdpbmUuc2hhcmUpXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHQudGV4dChfKCdzYXZlLicpKVxyXG5cdFx0XHQuY2xpY2soRW5naW5lLmV4cG9ydEltcG9ydClcclxuXHRcdFx0LmFwcGVuZFRvKG1lbnUpO1xyXG5cdFxyXG5cdFx0Ly8gc3Vic2NyaWJlIHRvIHN0YXRlVXBkYXRlc1xyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5zdWJzY3JpYmUoRW5naW5lLmhhbmRsZVN0YXRlVXBkYXRlcyk7XHJcblxyXG5cdFx0JFNNLmluaXQoKTtcclxuXHRcdE5vdGlmaWNhdGlvbnMuaW5pdCgpO1xyXG5cdFx0RXZlbnRzLmluaXQoKTtcclxuXHRcdFZpbGxhZ2UuaW5pdCgpO1xyXG5cdFx0Q2hhcmFjdGVyLmluaXQoKTtcclxuXHRcdFdlYXRoZXIuaW5pdCgpO1xyXG5cdFx0aWYoJFNNLmdldCgncm9hZC5vcGVuJykpIHtcclxuXHRcdFx0Um9hZC5pbml0KCk7XHJcblx0XHR9XHJcblx0XHRpZigkU00uZ2V0KCdvdXRwb3N0Lm9wZW4nKSkge1xyXG5cdFx0XHRPdXRwb3N0LmluaXQoKTtcclxuXHRcdH1cclxuXHJcblx0XHRFbmdpbmUuc2F2ZUxhbmd1YWdlKCk7XHJcblx0XHRFbmdpbmUudHJhdmVsVG8oVmlsbGFnZSk7XHJcblxyXG5cdH0sXHJcblx0XHJcblx0YnJvd3NlclZhbGlkOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAoIGxvY2F0aW9uLnNlYXJjaC5pbmRleE9mKCAnaWdub3JlYnJvd3Nlcj10cnVlJyApID49IDAgfHwgKCB0eXBlb2YgU3RvcmFnZSAhPSAndW5kZWZpbmVkJyAmJiAhb2xkSUUgKSApO1xyXG5cdH0sXHJcblx0XHJcblx0aXNNb2JpbGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuICggbG9jYXRpb24uc2VhcmNoLmluZGV4T2YoICdpZ25vcmVicm93c2VyPXRydWUnICkgPCAwICYmIC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeS9pLnRlc3QoIG5hdmlnYXRvci51c2VyQWdlbnQgKSApO1xyXG5cdH0sXHJcblx0XHJcblx0c2F2ZUdhbWU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYodHlwZW9mIFN0b3JhZ2UgIT0gJ3VuZGVmaW5lZCcgJiYgbG9jYWxTdG9yYWdlKSB7XHJcblx0XHRcdGlmKEVuZ2luZS5fc2F2ZVRpbWVyICE9IG51bGwpIHtcclxuXHRcdFx0XHRjbGVhclRpbWVvdXQoRW5naW5lLl9zYXZlVGltZXIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHR5cGVvZiBFbmdpbmUuX2xhc3ROb3RpZnkgPT0gJ3VuZGVmaW5lZCcgfHwgRGF0ZS5ub3coKSAtIEVuZ2luZS5fbGFzdE5vdGlmeSA+IEVuZ2luZS5TQVZFX0RJU1BMQVkpe1xyXG5cdFx0XHRcdCQoJyNzYXZlTm90aWZ5JykuY3NzKCdvcGFjaXR5JywgMSkuYW5pbWF0ZSh7b3BhY2l0eTogMH0sIDEwMDAsICdsaW5lYXInKTtcclxuXHRcdFx0XHRFbmdpbmUuX2xhc3ROb3RpZnkgPSBEYXRlLm5vdygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxvY2FsU3RvcmFnZS5nYW1lU3RhdGUgPSBKU09OLnN0cmluZ2lmeShTdGF0ZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRsb2FkR2FtZTogZnVuY3Rpb24oKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR2YXIgc2F2ZWRTdGF0ZSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdhbWVTdGF0ZSk7XHJcblx0XHRcdGlmKHNhdmVkU3RhdGUpIHtcclxuXHRcdFx0XHR3aW5kb3cuU3RhdGUgPSBzYXZlZFN0YXRlO1xyXG5cdFx0XHRcdEVuZ2luZS5sb2coXCJsb2FkZWQgc2F2ZSFcIik7XHJcblx0XHRcdH1cclxuXHRcdH0gY2F0Y2goZSkge1xyXG5cdFx0XHRFbmdpbmUubG9nKGUpO1xyXG5cdFx0XHR3aW5kb3cuU3RhdGUgPSB7fTtcclxuXHRcdFx0JFNNLnNldCgndmVyc2lvbicsIEVuZ2luZS5WRVJTSU9OKTtcclxuXHRcdFx0RW5naW5lLmV2ZW50KCdwcm9ncmVzcycsICduZXcgZ2FtZScpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0ZXhwb3J0SW1wb3J0OiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ0V4cG9ydCAvIEltcG9ydCcpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdleHBvcnQgb3IgaW1wb3J0IHNhdmUgZGF0YSwgZm9yIGJhY2tpbmcgdXAnKSxcclxuXHRcdFx0XHRcdFx0Xygnb3IgbWlncmF0aW5nIGNvbXB1dGVycycpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnZXhwb3J0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2V4cG9ydCcpLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBFbmdpbmUuZXhwb3J0NjRcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2ltcG9ydCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdpbXBvcnQnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnY29uZmlybSd9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdjYW5jZWwnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnY2FuY2VsJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnY29uZmlybSc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnYXJlIHlvdSBzdXJlPycpLFxyXG5cdFx0XHRcdFx0XHRfKCdpZiB0aGUgY29kZSBpcyBpbnZhbGlkLCBhbGwgZGF0YSB3aWxsIGJlIGxvc3QuJyksXHJcblx0XHRcdFx0XHRcdF8oJ3RoaXMgaXMgaXJyZXZlcnNpYmxlLicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQneWVzJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ3llcycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdpbnB1dEltcG9ydCd9LFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBFbmdpbmUuZW5hYmxlU2VsZWN0aW9uXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdubyc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdubycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J2lucHV0SW1wb3J0Jzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW18oJ3B1dCB0aGUgc2F2ZSBjb2RlIGhlcmUuJyldLFxyXG5cdFx0XHRcdFx0dGV4dGFyZWE6ICcnLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnb2theSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdpbXBvcnQnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBFbmdpbmUuaW1wb3J0NjRcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2NhbmNlbCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdjYW5jZWwnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGdlbmVyYXRlRXhwb3J0NjQ6IGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgc3RyaW5nNjQgPSBCYXNlNjQuZW5jb2RlKGxvY2FsU3RvcmFnZS5nYW1lU3RhdGUpO1xyXG5cdFx0c3RyaW5nNjQgPSBzdHJpbmc2NC5yZXBsYWNlKC9cXHMvZywgJycpO1xyXG5cdFx0c3RyaW5nNjQgPSBzdHJpbmc2NC5yZXBsYWNlKC9cXC4vZywgJycpO1xyXG5cdFx0c3RyaW5nNjQgPSBzdHJpbmc2NC5yZXBsYWNlKC9cXG4vZywgJycpO1xyXG5cclxuXHRcdHJldHVybiBzdHJpbmc2NDtcclxuXHR9LFxyXG5cclxuXHRleHBvcnQ2NDogZnVuY3Rpb24oKSB7XHJcblx0XHRFbmdpbmUuc2F2ZUdhbWUoKTtcclxuXHRcdHZhciBzdHJpbmc2NCA9IEVuZ2luZS5nZW5lcmF0ZUV4cG9ydDY0KCk7XHJcblx0XHRFbmdpbmUuZW5hYmxlU2VsZWN0aW9uKCk7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdFeHBvcnQnKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtfKCdzYXZlIHRoaXMuJyldLFxyXG5cdFx0XHRcdFx0dGV4dGFyZWE6IHN0cmluZzY0LFxyXG5cdFx0XHRcdFx0cmVhZG9ubHk6IHRydWUsXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdkb25lJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2dvdCBpdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IEVuZ2luZS5kaXNhYmxlU2VsZWN0aW9uXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0RW5naW5lLmF1dG9TZWxlY3QoJyNkZXNjcmlwdGlvbiB0ZXh0YXJlYScpO1xyXG5cdH0sXHJcblxyXG5cdGltcG9ydDY0OiBmdW5jdGlvbihzdHJpbmc2NCkge1xyXG5cdFx0RW5naW5lLmRpc2FibGVTZWxlY3Rpb24oKTtcclxuXHRcdHN0cmluZzY0ID0gc3RyaW5nNjQucmVwbGFjZSgvXFxzL2csICcnKTtcclxuXHRcdHN0cmluZzY0ID0gc3RyaW5nNjQucmVwbGFjZSgvXFwuL2csICcnKTtcclxuXHRcdHN0cmluZzY0ID0gc3RyaW5nNjQucmVwbGFjZSgvXFxuL2csICcnKTtcclxuXHRcdHZhciBkZWNvZGVkU2F2ZSA9IEJhc2U2NC5kZWNvZGUoc3RyaW5nNjQpO1xyXG5cdFx0bG9jYWxTdG9yYWdlLmdhbWVTdGF0ZSA9IGRlY29kZWRTYXZlO1xyXG5cdFx0bG9jYXRpb24ucmVsb2FkKCk7XHJcblx0fSxcclxuXHJcblx0ZXZlbnQ6IGZ1bmN0aW9uKGNhdCwgYWN0KSB7XHJcblx0XHRpZih0eXBlb2YgZ2EgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCBjYXQsIGFjdCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Y29uZmlybURlbGV0ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdSZXN0YXJ0PycpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0dGV4dDogW18oJ3Jlc3RhcnQgdGhlIGdhbWU/JyldLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQneWVzJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ3llcycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IEVuZ2luZS5kZWxldGVTYXZlXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdubyc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdubycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0ZGVsZXRlU2F2ZTogZnVuY3Rpb24obm9SZWxvYWQpIHtcclxuXHRcdGlmKHR5cGVvZiBTdG9yYWdlICE9ICd1bmRlZmluZWQnICYmIGxvY2FsU3RvcmFnZSkge1xyXG5cdFx0XHR3aW5kb3cuU3RhdGUgPSB7fTtcclxuXHRcdFx0bG9jYWxTdG9yYWdlLmNsZWFyKCk7XHJcblx0XHR9XHJcblx0XHRpZighbm9SZWxvYWQpIHtcclxuXHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0c2hhcmU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnU2hhcmUnKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtfKCdicmluZyB5b3VyIGZyaWVuZHMuJyldLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnZmFjZWJvb2snOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnZmFjZWJvb2snKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5vcGVuKCdodHRwczovL3d3dy5mYWNlYm9vay5jb20vc2hhcmVyL3NoYXJlci5waHA/dT0nICsgRW5naW5lLlNJVEVfVVJMLCAnc2hhcmVyJywgJ3dpZHRoPTYyNixoZWlnaHQ9NDM2LGxvY2F0aW9uPW5vLG1lbnViYXI9bm8scmVzaXphYmxlPW5vLHNjcm9sbGJhcnM9bm8sc3RhdHVzPW5vLHRvb2xiYXI9bm8nKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdnb29nbGUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDpfKCdnb29nbGUrJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR3aW5kb3cub3BlbignaHR0cHM6Ly9wbHVzLmdvb2dsZS5jb20vc2hhcmU/dXJsPScgKyBFbmdpbmUuU0lURV9VUkwsICdzaGFyZXInLCAnd2lkdGg9NDgwLGhlaWdodD00MzYsbG9jYXRpb249bm8sbWVudWJhcj1ubyxyZXNpemFibGU9bm8sc2Nyb2xsYmFycz1ubyxzdGF0dXM9bm8sdG9vbGJhcj1ubycpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J3R3aXR0ZXInOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygndHdpdHRlcicpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0d2luZG93Lm9wZW4oJ2h0dHBzOi8vdHdpdHRlci5jb20vaW50ZW50L3R3ZWV0P3RleHQ9QSUyMERhcmslMjBSb29tJnVybD0nICsgRW5naW5lLlNJVEVfVVJMLCAnc2hhcmVyJywgJ3dpZHRoPTY2MCxoZWlnaHQ9MjYwLGxvY2F0aW9uPW5vLG1lbnViYXI9bm8scmVzaXphYmxlPW5vLHNjcm9sbGJhcnM9eWVzLHN0YXR1cz1ubyx0b29sYmFyPW5vJyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQncmVkZGl0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ3JlZGRpdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0d2luZG93Lm9wZW4oJ2h0dHA6Ly93d3cucmVkZGl0LmNvbS9zdWJtaXQ/dXJsPScgKyBFbmdpbmUuU0lURV9VUkwsICdzaGFyZXInLCAnd2lkdGg9OTYwLGhlaWdodD03MDAsbG9jYXRpb249bm8sbWVudWJhcj1ubyxyZXNpemFibGU9bm8sc2Nyb2xsYmFycz15ZXMsc3RhdHVzPW5vLHRvb2xiYXI9bm8nKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdjbG9zZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdjbG9zZScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0d2lkdGg6ICc0MDBweCdcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGZpbmRTdHlsZXNoZWV0OiBmdW5jdGlvbih0aXRsZSkge1xyXG5cdFx0Zm9yKHZhciBpPTA7IGk8ZG9jdW1lbnQuc3R5bGVTaGVldHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIHNoZWV0ID0gZG9jdW1lbnQuc3R5bGVTaGVldHNbaV07XHJcblx0XHRcdGlmKHNoZWV0LnRpdGxlID09IHRpdGxlKSB7XHJcblx0XHRcdFx0cmV0dXJuIHNoZWV0O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9LFxyXG5cclxuXHRpc0xpZ2h0c09mZjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgZGFya0NzcyA9IEVuZ2luZS5maW5kU3R5bGVzaGVldCgnZGFya2VuTGlnaHRzJyk7XHJcblx0XHRpZiAoIGRhcmtDc3MgIT0gbnVsbCAmJiAhZGFya0Nzcy5kaXNhYmxlZCApIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHJcblx0dHVybkxpZ2h0c09mZjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgZGFya0NzcyA9IEVuZ2luZS5maW5kU3R5bGVzaGVldCgnZGFya2VuTGlnaHRzJyk7XHJcblx0XHRpZiAoZGFya0NzcyA9PSBudWxsKSB7XHJcblx0XHRcdCQoJ2hlYWQnKS5hcHBlbmQoJzxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiY3NzL2RhcmsuY3NzXCIgdHlwZT1cInRleHQvY3NzXCIgdGl0bGU9XCJkYXJrZW5MaWdodHNcIiAvPicpO1xyXG5cdFx0XHQkKCcubGlnaHRzT2ZmJykudGV4dChfKCdsaWdodHMgb24uJykpO1xyXG5cdFx0fSBlbHNlIGlmIChkYXJrQ3NzLmRpc2FibGVkKSB7XHJcblx0XHRcdGRhcmtDc3MuZGlzYWJsZWQgPSBmYWxzZTtcclxuXHRcdFx0JCgnLmxpZ2h0c09mZicpLnRleHQoXygnbGlnaHRzIG9uLicpKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQoXCIjZGFya2VuTGlnaHRzXCIpLmF0dHIoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpO1xyXG5cdFx0XHRkYXJrQ3NzLmRpc2FibGVkID0gdHJ1ZTtcclxuXHRcdFx0JCgnLmxpZ2h0c09mZicpLnRleHQoXygnbGlnaHRzIG9mZi4nKSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Ly8gR2V0cyBhIGd1aWRcclxuXHRnZXRHdWlkOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uKGMpIHtcclxuXHRcdFx0dmFyIHIgPSBNYXRoLnJhbmRvbSgpKjE2fDAsIHYgPSBjID09ICd4JyA/IHIgOiAociYweDN8MHg4KTtcclxuXHRcdFx0cmV0dXJuIHYudG9TdHJpbmcoMTYpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0YWN0aXZlTW9kdWxlOiBudWxsLFxyXG5cclxuXHR0cmF2ZWxUbzogZnVuY3Rpb24obW9kdWxlKSB7XHJcblx0XHRpZihFbmdpbmUuYWN0aXZlTW9kdWxlICE9IG1vZHVsZSkge1xyXG5cdFx0XHR2YXIgY3VycmVudEluZGV4ID0gRW5naW5lLmFjdGl2ZU1vZHVsZSA/ICQoJy5sb2NhdGlvbicpLmluZGV4KEVuZ2luZS5hY3RpdmVNb2R1bGUucGFuZWwpIDogMTtcclxuXHRcdFx0JCgnZGl2LmhlYWRlckJ1dHRvbicpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xyXG5cdFx0XHRtb2R1bGUudGFiLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xyXG5cclxuXHRcdFx0dmFyIHNsaWRlciA9ICQoJyNsb2NhdGlvblNsaWRlcicpO1xyXG5cdFx0XHR2YXIgc3RvcmVzID0gJCgnI3N0b3Jlc0NvbnRhaW5lcicpO1xyXG5cdFx0XHR2YXIgcGFuZWxJbmRleCA9ICQoJy5sb2NhdGlvbicpLmluZGV4KG1vZHVsZS5wYW5lbCk7XHJcblx0XHRcdHZhciBkaWZmID0gTWF0aC5hYnMocGFuZWxJbmRleCAtIGN1cnJlbnRJbmRleCk7XHJcblx0XHRcdHNsaWRlci5hbmltYXRlKHtsZWZ0OiAtKHBhbmVsSW5kZXggKiA3MDApICsgJ3B4J30sIDMwMCAqIGRpZmYpO1xyXG5cclxuXHRcdFx0aWYoJFNNLmdldCgnc3RvcmVzLndvb2QnKSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdC8vIEZJWE1FIFdoeSBkb2VzIHRoaXMgd29yayBpZiB0aGVyZSdzIGFuIGFuaW1hdGlvbiBxdWV1ZS4uLj9cclxuXHRcdFx0XHRzdG9yZXMuYW5pbWF0ZSh7cmlnaHQ6IC0ocGFuZWxJbmRleCAqIDcwMCkgKyAncHgnfSwgMzAwICogZGlmZik7XHJcblx0XHRcdH1cclxuXHRcdFxyXG5cdFx0XHRFbmdpbmUuYWN0aXZlTW9kdWxlID0gbW9kdWxlO1xyXG5cclxuXHRcdFx0bW9kdWxlLm9uQXJyaXZhbChkaWZmKTtcclxuXHJcblx0XHRcdGlmKEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gVmlsbGFnZVxyXG5cdFx0XHRcdC8vICB8fCBFbmdpbmUuYWN0aXZlTW9kdWxlID09IFBhdGhcclxuXHRcdFx0XHQpIHtcclxuXHRcdFx0XHQvLyBEb24ndCBmYWRlIG91dCB0aGUgd2VhcG9ucyBpZiB3ZSdyZSBzd2l0Y2hpbmcgdG8gYSBtb2R1bGVcclxuXHRcdFx0XHQvLyB3aGVyZSB3ZSdyZSBnb2luZyB0byBrZWVwIHNob3dpbmcgdGhlbSBhbnl3YXkuXHJcblx0XHRcdFx0aWYgKG1vZHVsZSAhPSBWaWxsYWdlIFxyXG5cdFx0XHRcdFx0Ly8gJiYgbW9kdWxlICE9IFBhdGhcclxuXHRcdFx0XHQpIHtcclxuXHRcdFx0XHRcdCQoJ2RpdiN3ZWFwb25zJykuYW5pbWF0ZSh7b3BhY2l0eTogMH0sIDMwMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZihtb2R1bGUgPT0gVmlsbGFnZVxyXG5cdFx0XHRcdC8vICB8fCBtb2R1bGUgPT0gUGF0aFxyXG5cdFx0XHRcdCkge1xyXG5cdFx0XHRcdCQoJ2RpdiN3ZWFwb25zJykuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIDMwMCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdE5vdGlmaWNhdGlvbnMucHJpbnRRdWV1ZShtb2R1bGUpO1xyXG5cdFx0XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0LyogTW92ZSB0aGUgc3RvcmVzIHBhbmVsIGJlbmVhdGggdG9wX2NvbnRhaW5lciAob3IgdG8gdG9wOiAwcHggaWYgdG9wX2NvbnRhaW5lclxyXG5cdFx0KiBlaXRoZXIgaGFzbid0IGJlZW4gZmlsbGVkIGluIG9yIGlzIG51bGwpIHVzaW5nIHRyYW5zaXRpb25fZGlmZiB0byBzeW5jIHdpdGhcclxuXHRcdCogdGhlIGFuaW1hdGlvbiBpbiBFbmdpbmUudHJhdmVsVG8oKS5cclxuXHRcdCovXHJcblx0bW92ZVN0b3Jlc1ZpZXc6IGZ1bmN0aW9uKHRvcF9jb250YWluZXIsIHRyYW5zaXRpb25fZGlmZikge1xyXG5cdFx0dmFyIHN0b3JlcyA9ICQoJyNzdG9yZXNDb250YWluZXInKTtcclxuXHJcblx0XHQvLyBJZiB3ZSBkb24ndCBoYXZlIGEgc3RvcmVzQ29udGFpbmVyIHlldCwgbGVhdmUuXHJcblx0XHRpZih0eXBlb2Yoc3RvcmVzKSA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybjtcclxuXHJcblx0XHRpZih0eXBlb2YodHJhbnNpdGlvbl9kaWZmKSA9PT0gJ3VuZGVmaW5lZCcpIHRyYW5zaXRpb25fZGlmZiA9IDE7XHJcblxyXG5cdFx0aWYodG9wX2NvbnRhaW5lciA9PT0gbnVsbCkge1xyXG5cdFx0XHRzdG9yZXMuYW5pbWF0ZSh7dG9wOiAnMHB4J30sIHtxdWV1ZTogZmFsc2UsIGR1cmF0aW9uOiAzMDAgKiB0cmFuc2l0aW9uX2RpZmZ9KTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYoIXRvcF9jb250YWluZXIubGVuZ3RoKSB7XHJcblx0XHRcdHN0b3Jlcy5hbmltYXRlKHt0b3A6ICcwcHgnfSwge3F1ZXVlOiBmYWxzZSwgZHVyYXRpb246IDMwMCAqIHRyYW5zaXRpb25fZGlmZn0pO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHN0b3Jlcy5hbmltYXRlKHtcclxuXHRcdFx0XHRcdHRvcDogdG9wX2NvbnRhaW5lci5oZWlnaHQoKSArIDI2ICsgJ3B4J1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0cXVldWU6IGZhbHNlLCBcclxuXHRcdFx0XHRcdGR1cmF0aW9uOiAzMDAgKiB0cmFuc2l0aW9uX2RpZmZcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0bG9nOiBmdW5jdGlvbihtc2cpIHtcclxuXHRcdGlmKHRoaXMuX2xvZykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhtc2cpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHVwZGF0ZVNsaWRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgc2xpZGVyID0gJCgnI2xvY2F0aW9uU2xpZGVyJyk7XHJcblx0XHRzbGlkZXIud2lkdGgoKHNsaWRlci5jaGlsZHJlbigpLmxlbmd0aCAqIDcwMCkgKyAncHgnKTtcclxuXHR9LFxyXG5cclxuXHR1cGRhdGVPdXRlclNsaWRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgc2xpZGVyID0gJCgnI291dGVyU2xpZGVyJyk7XHJcblx0XHRzbGlkZXIud2lkdGgoKHNsaWRlci5jaGlsZHJlbigpLmxlbmd0aCAqIDcwMCkgKyAncHgnKTtcclxuXHR9LFxyXG5cclxuXHRnZXRJbmNvbWVNc2c6IGZ1bmN0aW9uKG51bSwgZGVsYXkpIHtcclxuXHRcdHJldHVybiBfKFwiezB9IHBlciB7MX1zXCIsIChudW0gPiAwID8gXCIrXCIgOiBcIlwiKSArIG51bSwgZGVsYXkpO1xyXG5cdH0sXHJcblxyXG5cdHN3aXBlTGVmdDogZnVuY3Rpb24oZSkge1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZS5zd2lwZUxlZnQpIHtcclxuXHRcdFx0RW5naW5lLmFjdGl2ZU1vZHVsZS5zd2lwZUxlZnQoZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0c3dpcGVSaWdodDogZnVuY3Rpb24oZSkge1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZS5zd2lwZVJpZ2h0KSB7XHJcblx0XHRcdEVuZ2luZS5hY3RpdmVNb2R1bGUuc3dpcGVSaWdodChlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRzd2lwZVVwOiBmdW5jdGlvbihlKSB7XHJcblx0XHRpZihFbmdpbmUuYWN0aXZlTW9kdWxlLnN3aXBlVXApIHtcclxuXHRcdFx0RW5naW5lLmFjdGl2ZU1vZHVsZS5zd2lwZVVwKGUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHN3aXBlRG93bjogZnVuY3Rpb24oZSkge1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZS5zd2lwZURvd24pIHtcclxuXHRcdFx0RW5naW5lLmFjdGl2ZU1vZHVsZS5zd2lwZURvd24oZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0ZGlzYWJsZVNlbGVjdGlvbjogZnVuY3Rpb24oKSB7XHJcblx0XHRkb2N1bWVudC5vbnNlbGVjdHN0YXJ0ID0gZXZlbnROdWxsaWZpZXI7IC8vIHRoaXMgaXMgZm9yIElFXHJcblx0XHRkb2N1bWVudC5vbm1vdXNlZG93biA9IGV2ZW50TnVsbGlmaWVyOyAvLyB0aGlzIGlzIGZvciB0aGUgcmVzdFxyXG5cdH0sXHJcblxyXG5cdGVuYWJsZVNlbGVjdGlvbjogZnVuY3Rpb24oKSB7XHJcblx0XHRkb2N1bWVudC5vbnNlbGVjdHN0YXJ0ID0gZXZlbnRQYXNzdGhyb3VnaDtcclxuXHRcdGRvY3VtZW50Lm9ubW91c2Vkb3duID0gZXZlbnRQYXNzdGhyb3VnaDtcclxuXHR9LFxyXG5cclxuXHRhdXRvU2VsZWN0OiBmdW5jdGlvbihzZWxlY3Rvcikge1xyXG5cdFx0JChzZWxlY3RvcikuZm9jdXMoKS5zZWxlY3QoKTtcclxuXHR9LFxyXG5cclxuXHRoYW5kbGVTdGF0ZVVwZGF0ZXM6IGZ1bmN0aW9uKGUpe1xyXG5cdFxyXG5cdH0sXHJcblxyXG5cdHN3aXRjaExhbmd1YWdlOiBmdW5jdGlvbihkb20pe1xyXG5cdFx0dmFyIGxhbmcgPSAkKGRvbSkuZGF0YShcImxhbmd1YWdlXCIpO1xyXG5cdFx0aWYoZG9jdW1lbnQubG9jYXRpb24uaHJlZi5zZWFyY2goL1tcXD9cXCZdbGFuZz1bYS16X10rLykgIT0gLTEpe1xyXG5cdFx0XHRkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gZG9jdW1lbnQubG9jYXRpb24uaHJlZi5yZXBsYWNlKCAvKFtcXD9cXCZdbGFuZz0pKFthLXpfXSspL2dpICwgXCIkMVwiK2xhbmcgKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gZG9jdW1lbnQubG9jYXRpb24uaHJlZiArICggKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYuc2VhcmNoKC9cXD8vKSAhPSAtMSApP1wiJlwiOlwiP1wiKSArIFwibGFuZz1cIitsYW5nO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHNhdmVMYW5ndWFnZTogZnVuY3Rpb24oKXtcclxuXHRcdHZhciBsYW5nID0gZGVjb2RlVVJJQ29tcG9uZW50KChuZXcgUmVnRXhwKCdbP3wmXWxhbmc9JyArICcoW14mO10rPykoJnwjfDt8JCknKS5leGVjKGxvY2F0aW9uLnNlYXJjaCl8fFssXCJcIl0pWzFdLnJlcGxhY2UoL1xcKy9nLCAnJTIwJykpfHxudWxsO1x0XHJcblx0XHRpZihsYW5nICYmIHR5cGVvZiBTdG9yYWdlICE9ICd1bmRlZmluZWQnICYmIGxvY2FsU3RvcmFnZSkge1xyXG5cdFx0XHRsb2NhbFN0b3JhZ2UubGFuZyA9IGxhbmc7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0c2V0VGltZW91dDogZnVuY3Rpb24oY2FsbGJhY2ssIHRpbWVvdXQsIHNraXBEb3VibGU/KXtcclxuXHJcblx0XHRpZiggRW5naW5lLm9wdGlvbnMuZG91YmxlVGltZSAmJiAhc2tpcERvdWJsZSApe1xyXG5cdFx0XHRFbmdpbmUubG9nKCdEb3VibGUgdGltZSwgY3V0dGluZyB0aW1lb3V0IGluIGhhbGYnKTtcclxuXHRcdFx0dGltZW91dCAvPSAyO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBzZXRUaW1lb3V0KGNhbGxiYWNrLCB0aW1lb3V0KTtcclxuXHJcblx0fVxyXG5cclxufTtcclxuXHJcbmZ1bmN0aW9uIGV2ZW50TnVsbGlmaWVyKGUpIHtcclxuXHRyZXR1cm4gJChlLnRhcmdldCkuaGFzQ2xhc3MoJ21lbnVCdG4nKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZXZlbnRQYXNzdGhyb3VnaChlKSB7XHJcblx0cmV0dXJuIHRydWU7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBpblZpZXcoZGlyLCBlbGVtKXtcclxuXHJcbiAgICAgICAgdmFyIHNjVG9wID0gJCgnI21haW4nKS5vZmZzZXQoKS50b3A7XHJcbiAgICAgICAgdmFyIHNjQm90ID0gc2NUb3AgKyAkKCcjbWFpbicpLmhlaWdodCgpO1xyXG5cclxuICAgICAgICB2YXIgZWxUb3AgPSBlbGVtLm9mZnNldCgpLnRvcDtcclxuICAgICAgICB2YXIgZWxCb3QgPSBlbFRvcCArIGVsZW0uaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIGlmKCBkaXIgPT0gJ3VwJyApe1xyXG4gICAgICAgICAgICAgICAgLy8gU1RPUCBNT1ZJTkcgSUYgQk9UVE9NIE9GIEVMRU1FTlQgSVMgVklTSUJMRSBJTiBTQ1JFRU5cclxuICAgICAgICAgICAgICAgIHJldHVybiAoIGVsQm90IDwgc2NCb3QgKTtcclxuICAgICAgICB9ZWxzZSBpZiggZGlyID09ICdkb3duJyApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICggZWxUb3AgPiBzY1RvcCApO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICggKCBlbEJvdCA8PSBzY0JvdCApICYmICggZWxUb3AgPj0gc2NUb3AgKSApO1xyXG4gICAgICAgIH1cclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNjcm9sbEJ5WChlbGVtLCB4KXtcclxuXHJcbiAgICAgICAgdmFyIGVsVG9wID0gcGFyc2VJbnQoIGVsZW0uY3NzKCd0b3AnKSwgMTAgKTtcclxuICAgICAgICBlbGVtLmNzcyggJ3RvcCcsICggZWxUb3AgKyB4ICkgKyBcInB4XCIgKTtcclxuXHJcbn1cclxuXHJcblxyXG4vL2NyZWF0ZSBqUXVlcnkgQ2FsbGJhY2tzKCkgdG8gaGFuZGxlIG9iamVjdCBldmVudHMgXHJcbiQuRGlzcGF0Y2ggPSBmdW5jdGlvbiggaWQgKSB7XHJcblx0dmFyIGNhbGxiYWNrcywgdG9waWMgPSBpZCAmJiBFbmdpbmUudG9waWNzWyBpZCBdO1xyXG5cdGlmICggIXRvcGljICkge1xyXG5cdFx0Y2FsbGJhY2tzID0galF1ZXJ5LkNhbGxiYWNrcygpO1xyXG5cdFx0dG9waWMgPSB7XHJcblx0XHRcdFx0cHVibGlzaDogY2FsbGJhY2tzLmZpcmUsXHJcblx0XHRcdFx0c3Vic2NyaWJlOiBjYWxsYmFja3MuYWRkLFxyXG5cdFx0XHRcdHVuc3Vic2NyaWJlOiBjYWxsYmFja3MucmVtb3ZlXHJcblx0XHR9O1xyXG5cdFx0aWYgKCBpZCApIHtcclxuXHRcdFx0RW5naW5lLnRvcGljc1sgaWQgXSA9IHRvcGljO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gdG9waWM7XHJcbn07XHJcblxyXG4kKGZ1bmN0aW9uKCkge1xyXG5cdEVuZ2luZS5pbml0KCk7XHJcbn0pO1xyXG5cclxuIiwiLyoqXHJcbiAqIE1vZHVsZSB0aGF0IGhhbmRsZXMgdGhlIHJhbmRvbSBldmVudCBzeXN0ZW1cclxuICovXHJcbmltcG9ydCB7IEV2ZW50c1JvYWRXYW5kZXIgfSBmcm9tIFwiLi9ldmVudHMvcm9hZHdhbmRlclwiO1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi9lbmdpbmVcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgTm90aWZpY2F0aW9ucyB9IGZyb20gXCIuL25vdGlmaWNhdGlvbnNcIjtcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4vQnV0dG9uXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEFEUkV2ZW50IHtcclxuXHR0aXRsZTogc3RyaW5nLFxyXG5cdGlzQXZhaWxhYmxlPzogRnVuY3Rpb24sXHJcblx0aXNTdXBlckxpa2VseT86IEZ1bmN0aW9uLFxyXG5cdHNjZW5lczoge1xyXG5cdFx0Ly8gdHlwZSB0aGlzIG91dCBiZXR0ZXIgdXNpbmcgSW5kZXggU2lnbmF0dXJlc1xyXG5cdFx0W2lkOiBzdHJpbmddOiBTY2VuZVxyXG5cdH0sXHJcblx0ZXZlbnRQYW5lbD86IGFueVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNjZW5lIHtcclxuXHRzZWVuRmxhZz86IEZ1bmN0aW9uLFxyXG5cdG5leHRTY2VuZT86IHN0cmluZyxcclxuXHRvbkxvYWQ/OiBGdW5jdGlvbixcclxuXHR0ZXh0OiBBcnJheTxzdHJpbmc+LFxyXG5cdHJld2FyZD86IGFueSxcclxuXHRub3RpZmljYXRpb24/OiBzdHJpbmcsXHJcblx0Ymxpbms/OiBib29sZWFuLFxyXG5cdGJ1dHRvbnM6IHtcclxuXHRcdFtpZDogc3RyaW5nXTogRXZlbnRCdXR0b25cclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRCdXR0b24ge1xyXG5cdHRleHQ6IHN0cmluZyxcclxuXHRuZXh0U2NlbmU6IHtcclxuXHRcdFtpZDogbnVtYmVyXTogc3RyaW5nXHJcblx0fSxcclxuXHRhdmFpbGFibGU/OiBGdW5jdGlvbixcclxuXHR2aXNpYmxlPzogRnVuY3Rpb24sXHJcblx0cmV3YXJkPzogYW55LFxyXG5cdGNvc3Q/OiBhbnksXHJcblx0bm90aWZpY2F0aW9uPzogc3RyaW5nLFxyXG5cdG9uQ2hvb3NlPzogRnVuY3Rpb25cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IEV2ZW50cyA9IHtcclxuXHRcdFxyXG5cdF9FVkVOVF9USU1FX1JBTkdFOiBbMywgNl0sIC8vIHJhbmdlLCBpbiBtaW51dGVzXHJcblx0X1BBTkVMX0ZBREU6IDIwMCxcclxuXHRfRklHSFRfU1BFRUQ6IDEwMCxcclxuXHRfRUFUX0NPT0xET1dOOiA1LFxyXG5cdF9NRURTX0NPT0xET1dOOiA3LFxyXG5cdF9MRUFWRV9DT09MRE9XTjogMSxcclxuXHRTVFVOX0RVUkFUSU9OOiA0MDAwLFxyXG5cdEJMSU5LX0lOVEVSVkFMOiBmYWxzZSxcclxuXHJcblx0RXZlbnRQb29sOiA8YW55PltdLFxyXG5cdGV2ZW50U3RhY2s6IDxhbnk+W10sXHJcblx0X2V2ZW50VGltZW91dDogMCxcclxuXHJcblx0TG9jYXRpb25zOiB7fSxcclxuXHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblx0XHRcclxuXHRcdC8vIEJ1aWxkIHRoZSBFdmVudCBQb29sXHJcblx0XHRFdmVudHMuRXZlbnRQb29sID0gW10uY29uY2F0KFxyXG5cdFx0XHRFdmVudHNSb2FkV2FuZGVyIGFzIGFueVxyXG5cdFx0KTtcclxuXHJcblx0XHR0aGlzLkxvY2F0aW9uc1tcIlJvYWRXYW5kZXJcIl0gPSBFdmVudHNSb2FkV2FuZGVyO1xyXG5cdFx0XHJcblx0XHRFdmVudHMuZXZlbnRTdGFjayA9IFtdO1xyXG5cdFx0XHJcblx0XHQvL3N1YnNjcmliZSB0byBzdGF0ZVVwZGF0ZXNcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdCQuRGlzcGF0Y2goJ3N0YXRlVXBkYXRlJykuc3Vic2NyaWJlKEV2ZW50cy5oYW5kbGVTdGF0ZVVwZGF0ZXMpO1xyXG5cdH0sXHJcblx0XHJcblx0b3B0aW9uczoge30sIC8vIE5vdGhpbmcgZm9yIG5vd1xyXG4gICAgXHJcblx0YWN0aXZlU2NlbmU6ICcnLFxyXG4gICAgXHJcblx0bG9hZFNjZW5lOiBmdW5jdGlvbihuYW1lKSB7XHJcblx0XHRFbmdpbmUubG9nKCdsb2FkaW5nIHNjZW5lOiAnICsgbmFtZSk7XHJcblx0XHRFdmVudHMuYWN0aXZlU2NlbmUgPSBuYW1lO1xyXG5cdFx0dmFyIHNjZW5lID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnNjZW5lc1tuYW1lXTtcclxuXHRcdFxyXG5cdFx0Ly8gaGFuZGxlcyBvbmUtdGltZSBzY2VuZXMsIHN1Y2ggYXMgaW50cm9kdWN0aW9uc1xyXG5cdFx0Ly8gbWF5YmUgSSBjYW4gbWFrZSBhIG1vcmUgZXhwbGljaXQgXCJpbnRyb2R1Y3Rpb25cIiBsb2dpY2FsIGZsb3cgdG8gbWFrZSB0aGlzXHJcblx0XHQvLyBhIGxpdHRsZSBtb3JlIGVsZWdhbnQsIGdpdmVuIHRoYXQgdGhlcmUgd2lsbCBhbHdheXMgYmUgYW4gXCJpbnRyb2R1Y3Rpb25cIiBzY2VuZVxyXG5cdFx0Ly8gdGhhdCdzIG9ubHkgbWVhbnQgdG8gYmUgcnVuIGEgc2luZ2xlIHRpbWUuXHJcblx0XHRpZiAoc2NlbmUuc2VlbkZsYWcgJiYgc2NlbmUuc2VlbkZsYWcoKSkge1xyXG5cdFx0XHRFdmVudHMubG9hZFNjZW5lKHNjZW5lLm5leHRTY2VuZSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNjZW5lIHJld2FyZFxyXG5cdFx0aWYoc2NlbmUucmV3YXJkKSB7XHJcblx0XHRcdCRTTS5hZGRNKCdzdG9yZXMnLCBzY2VuZS5yZXdhcmQpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBvbkxvYWRcclxuXHRcdGlmKHNjZW5lLm9uTG9hZCkge1xyXG5cdFx0XHRzY2VuZS5vbkxvYWQoKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gTm90aWZ5IHRoZSBzY2VuZSBjaGFuZ2VcclxuXHRcdGlmKHNjZW5lLm5vdGlmaWNhdGlvbikge1xyXG5cdFx0XHROb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBzY2VuZS5ub3RpZmljYXRpb24pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQkKCcjZGVzY3JpcHRpb24nLCBFdmVudHMuZXZlbnRQYW5lbCgpKS5lbXB0eSgpO1xyXG5cdFx0JCgnI2J1dHRvbnMnLCBFdmVudHMuZXZlbnRQYW5lbCgpKS5lbXB0eSgpO1xyXG5cdFx0RXZlbnRzLnN0YXJ0U3Rvcnkoc2NlbmUpO1xyXG5cdH0sXHJcblx0XHJcblx0ZHJhd0Zsb2F0VGV4dDogZnVuY3Rpb24odGV4dCwgcGFyZW50KSB7XHJcblx0XHQkKCc8ZGl2PicpLnRleHQodGV4dCkuYWRkQ2xhc3MoJ2RhbWFnZVRleHQnKS5hcHBlbmRUbyhwYXJlbnQpLmFuaW1hdGUoe1xyXG5cdFx0XHQnYm90dG9tJzogJzUwcHgnLFxyXG5cdFx0XHQnb3BhY2l0eSc6ICcwJ1xyXG5cdFx0fSxcclxuXHRcdDMwMCxcclxuXHRcdCdsaW5lYXInLFxyXG5cdFx0ZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlKCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdFxyXG5cdHN0YXJ0U3Rvcnk6IGZ1bmN0aW9uKHNjZW5lKSB7XHJcblx0XHQvLyBXcml0ZSB0aGUgdGV4dFxyXG5cdFx0dmFyIGRlc2MgPSAkKCcjZGVzY3JpcHRpb24nLCBFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdGZvcih2YXIgaSBpbiBzY2VuZS50ZXh0KSB7XHJcblx0XHRcdCQoJzxkaXY+JykudGV4dChzY2VuZS50ZXh0W2ldKS5hcHBlbmRUbyhkZXNjKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYoc2NlbmUudGV4dGFyZWEgIT0gbnVsbCkge1xyXG5cdFx0XHR2YXIgdGEgPSAkKCc8dGV4dGFyZWE+JykudmFsKHNjZW5lLnRleHRhcmVhKS5hcHBlbmRUbyhkZXNjKTtcclxuXHRcdFx0aWYoc2NlbmUucmVhZG9ubHkpIHtcclxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0dGEuYXR0cigncmVhZG9ubHknLCB0cnVlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBEcmF3IHRoZSBidXR0b25zXHJcblx0XHRFdmVudHMuZHJhd0J1dHRvbnMoc2NlbmUpO1xyXG5cdH0sXHJcblx0XHJcblx0ZHJhd0J1dHRvbnM6IGZ1bmN0aW9uKHNjZW5lKSB7XHJcblx0XHR2YXIgYnRucyA9ICQoJyNidXR0b25zJywgRXZlbnRzLmV2ZW50UGFuZWwoKSk7XHJcblx0XHRmb3IodmFyIGlkIGluIHNjZW5lLmJ1dHRvbnMpIHtcclxuXHRcdFx0dmFyIGluZm8gPSBzY2VuZS5idXR0b25zW2lkXTtcclxuXHRcdFx0XHR2YXIgYiA9IFxyXG5cdFx0XHRcdC8vbmV3IFxyXG5cdFx0XHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRcdFx0aWQ6IGlkLFxyXG5cdFx0XHRcdFx0dGV4dDogaW5mby50ZXh0LFxyXG5cdFx0XHRcdFx0Y29zdDogaW5mby5jb3N0LFxyXG5cdFx0XHRcdFx0Y2xpY2s6IEV2ZW50cy5idXR0b25DbGljayxcclxuXHRcdFx0XHRcdGNvb2xkb3duOiBpbmZvLmNvb2xkb3duLFxyXG5cdFx0XHRcdFx0aW1hZ2U6IGluZm8uaW1hZ2VcclxuXHRcdFx0XHR9KS5hcHBlbmRUbyhidG5zKTtcclxuXHRcdFx0aWYodHlwZW9mIGluZm8uYXZhaWxhYmxlID09ICdmdW5jdGlvbicgJiYgIWluZm8uYXZhaWxhYmxlKCkpIHtcclxuXHRcdFx0XHRCdXR0b24uc2V0RGlzYWJsZWQoYiwgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYodHlwZW9mIGluZm8udmlzaWJsZSA9PSAnZnVuY3Rpb24nICYmICFpbmZvLnZpc2libGUoKSkge1xyXG5cdFx0XHRcdGIuaGlkZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHR5cGVvZiBpbmZvLmNvb2xkb3duID09ICdudW1iZXInKSB7XHJcblx0XHRcdFx0QnV0dG9uLmNvb2xkb3duKGIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdEV2ZW50cy51cGRhdGVCdXR0b25zKCk7XHJcblx0fSxcclxuXHRcclxuXHR1cGRhdGVCdXR0b25zOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBidG5zID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnNjZW5lc1tFdmVudHMuYWN0aXZlU2NlbmVdLmJ1dHRvbnM7XHJcblx0XHRmb3IodmFyIGJJZCBpbiBidG5zKSB7XHJcblx0XHRcdHZhciBiID0gYnRuc1tiSWRdO1xyXG5cdFx0XHR2YXIgYnRuRWwgPSAkKCcjJytiSWQsIEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0XHRpZih0eXBlb2YgYi5hdmFpbGFibGUgPT0gJ2Z1bmN0aW9uJyAmJiAhYi5hdmFpbGFibGUoKSkge1xyXG5cdFx0XHRcdEJ1dHRvbi5zZXREaXNhYmxlZChidG5FbCwgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGJ1dHRvbkNsaWNrOiBmdW5jdGlvbihidG4pIHtcclxuXHRcdHZhciBpbmZvID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnNjZW5lc1tFdmVudHMuYWN0aXZlU2NlbmVdLmJ1dHRvbnNbYnRuLmF0dHIoJ2lkJyldO1xyXG5cclxuXHRcdGlmKHR5cGVvZiBpbmZvLm9uQ2hvb3NlID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0dmFyIHRleHRhcmVhID0gRXZlbnRzLmV2ZW50UGFuZWwoKS5maW5kKCd0ZXh0YXJlYScpO1xyXG5cdFx0XHRpbmZvLm9uQ2hvb3NlKHRleHRhcmVhLmxlbmd0aCA+IDAgPyB0ZXh0YXJlYS52YWwoKSA6IG51bGwpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBSZXdhcmRcclxuXHRcdGlmKGluZm8ucmV3YXJkKSB7XHJcblx0XHRcdCRTTS5hZGRNKCdzdG9yZXMnLCBpbmZvLnJld2FyZCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdEV2ZW50cy51cGRhdGVCdXR0b25zKCk7XHJcblx0XHRcclxuXHRcdC8vIE5vdGlmaWNhdGlvblxyXG5cdFx0aWYoaW5mby5ub3RpZmljYXRpb24pIHtcclxuXHRcdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgaW5mby5ub3RpZmljYXRpb24pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBOZXh0IFNjZW5lXHJcblx0XHRpZihpbmZvLm5leHRTY2VuZSkge1xyXG5cdFx0XHRpZihpbmZvLm5leHRTY2VuZSA9PSAnZW5kJykge1xyXG5cdFx0XHRcdEV2ZW50cy5lbmRFdmVudCgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHZhciByID0gTWF0aC5yYW5kb20oKTtcclxuXHRcdFx0XHR2YXIgbG93ZXN0TWF0Y2g6IG51bGwgfCBzdHJpbmcgPSBudWxsO1xyXG5cdFx0XHRcdGZvcih2YXIgaSBpbiBpbmZvLm5leHRTY2VuZSkge1xyXG5cdFx0XHRcdFx0aWYociA8IChpIGFzIHVua25vd24gYXMgbnVtYmVyKSAmJiAobG93ZXN0TWF0Y2ggPT0gbnVsbCB8fCBpIDwgbG93ZXN0TWF0Y2gpKSB7XHJcblx0XHRcdFx0XHRcdGxvd2VzdE1hdGNoID0gaTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYobG93ZXN0TWF0Y2ggIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0RXZlbnRzLmxvYWRTY2VuZShpbmZvLm5leHRTY2VuZVtsb3dlc3RNYXRjaF0pO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRFbmdpbmUubG9nKCdFUlJPUjogbm8gc3VpdGFibGUgc2NlbmUgZm91bmQnKTtcclxuXHRcdFx0XHRFdmVudHMuZW5kRXZlbnQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8vIGJsaW5rcyB0aGUgYnJvd3NlciB3aW5kb3cgdGl0bGVcclxuXHRibGlua1RpdGxlOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0aXRsZSA9IGRvY3VtZW50LnRpdGxlO1xyXG5cclxuXHRcdC8vIGV2ZXJ5IDMgc2Vjb25kcyBjaGFuZ2UgdGl0bGUgdG8gJyoqKiBFVkVOVCAqKionLCB0aGVuIDEuNSBzZWNvbmRzIGxhdGVyLCBjaGFuZ2UgaXQgYmFjayB0byB0aGUgb3JpZ2luYWwgdGl0bGUuXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRFdmVudHMuQkxJTktfSU5URVJWQUwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuXHRcdFx0ZG9jdW1lbnQudGl0bGUgPSBfKCcqKiogRVZFTlQgKioqJyk7XHJcblx0XHRcdEVuZ2luZS5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge2RvY3VtZW50LnRpdGxlID0gdGl0bGU7fSwgMTUwMCwgdHJ1ZSk7IFxyXG5cdFx0fSwgMzAwMCk7XHJcblx0fSxcclxuXHJcblx0c3RvcFRpdGxlQmxpbms6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0Y2xlYXJJbnRlcnZhbChFdmVudHMuQkxJTktfSU5URVJWQUwpO1xyXG5cdFx0RXZlbnRzLkJMSU5LX0lOVEVSVkFMID0gZmFsc2U7XHJcblx0fSxcclxuXHRcclxuXHQvLyBNYWtlcyBhbiBldmVudCBoYXBwZW4hXHJcblx0dHJpZ2dlckV2ZW50OiBmdW5jdGlvbigpIHtcclxuXHRcdGlmKEV2ZW50cy5hY3RpdmVFdmVudCgpID09IG51bGwpIHtcclxuXHRcdFx0dmFyIHBvc3NpYmxlRXZlbnRzID0gW107XHJcblx0XHRcdGZvcih2YXIgaSBpbiBFdmVudHMuRXZlbnRQb29sKSB7XHJcblx0XHRcdFx0dmFyIGV2ZW50ID0gRXZlbnRzLkV2ZW50UG9vbFtpXTtcclxuXHRcdFx0XHRpZihldmVudC5pc0F2YWlsYWJsZSgpKSB7XHJcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0XHRwb3NzaWJsZUV2ZW50cy5wdXNoKGV2ZW50KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKHBvc3NpYmxlRXZlbnRzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRcdEV2ZW50cy5zY2hlZHVsZU5leHRFdmVudCgwLjUpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR2YXIgciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoocG9zc2libGVFdmVudHMubGVuZ3RoKSk7XHJcblx0XHRcdFx0RXZlbnRzLnN0YXJ0RXZlbnQocG9zc2libGVFdmVudHNbcl0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0RXZlbnRzLnNjaGVkdWxlTmV4dEV2ZW50KCk7XHJcblx0fSxcclxuXHJcblx0Ly8gbm90IHNjaGVkdWxlZCwgdGhpcyBpcyBmb3Igc3R1ZmYgbGlrZSBsb2NhdGlvbi1iYXNlZCByYW5kb20gZXZlbnRzIG9uIGEgYnV0dG9uIGNsaWNrXHJcblx0dHJpZ2dlckxvY2F0aW9uRXZlbnQ6IGZ1bmN0aW9uKGxvY2F0aW9uKSB7XHJcblx0XHRpZiAodGhpcy5Mb2NhdGlvbnNbbG9jYXRpb25dKSB7XHJcblx0XHRcdGlmKEV2ZW50cy5hY3RpdmVFdmVudCgpID09IG51bGwpIHtcclxuXHRcdFx0XHR2YXIgcG9zc2libGVFdmVudHM6IEFycmF5PGFueT4gPSBbXTtcclxuXHRcdFx0XHRmb3IodmFyIGkgaW4gdGhpcy5Mb2NhdGlvbnNbbG9jYXRpb25dKSB7XHJcblx0XHRcdFx0XHR2YXIgZXZlbnQgPSB0aGlzLkxvY2F0aW9uc1tsb2NhdGlvbl1baV07XHJcblx0XHRcdFx0XHRpZihldmVudC5pc0F2YWlsYWJsZSgpKSB7XHJcblx0XHRcdFx0XHRcdGlmKHR5cGVvZihldmVudC5pc1N1cGVyTGlrZWx5KSA9PSAnZnVuY3Rpb24nICYmIGV2ZW50LmlzU3VwZXJMaWtlbHkoKSkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFN1cGVyTGlrZWx5IGV2ZW50LCBkbyB0aGlzIGFuZCBza2lwIHRoZSByYW5kb20gY2hvaWNlXHJcblx0XHRcdFx0XHRcdFx0RW5naW5lLmxvZygnc3VwZXJMaWtlbHkgZGV0ZWN0ZWQnKTtcclxuXHRcdFx0XHRcdFx0XHRFdmVudHMuc3RhcnRFdmVudChldmVudCk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHBvc3NpYmxlRXZlbnRzLnB1c2goZXZlbnQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcclxuXHRcdFx0XHRpZihwb3NzaWJsZUV2ZW50cy5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHRcdC8vIEV2ZW50cy5zY2hlZHVsZU5leHRFdmVudCgwLjUpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR2YXIgciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoocG9zc2libGVFdmVudHMubGVuZ3RoKSk7XHJcblx0XHRcdFx0XHRFdmVudHMuc3RhcnRFdmVudChwb3NzaWJsZUV2ZW50c1tyXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRhY3RpdmVFdmVudDogZnVuY3Rpb24oKTogQURSRXZlbnQgfCBudWxsIHtcclxuXHRcdGlmKEV2ZW50cy5ldmVudFN0YWNrICYmIEV2ZW50cy5ldmVudFN0YWNrLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0cmV0dXJuIEV2ZW50cy5ldmVudFN0YWNrWzBdO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fSxcclxuXHRcclxuXHRldmVudFBhbmVsOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBFdmVudHMuYWN0aXZlRXZlbnQoKT8uZXZlbnRQYW5lbDtcclxuXHR9LFxyXG5cclxuXHRzdGFydEV2ZW50OiBmdW5jdGlvbihldmVudDogQURSRXZlbnQsIG9wdGlvbnM/KSB7XHJcblx0XHRpZihldmVudCkge1xyXG5cdFx0XHRFbmdpbmUuZXZlbnQoJ2dhbWUgZXZlbnQnLCAnZXZlbnQnKTtcclxuXHRcdFx0RXZlbnRzLmV2ZW50U3RhY2sudW5zaGlmdChldmVudCk7XHJcblx0XHRcdGV2ZW50LmV2ZW50UGFuZWwgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2V2ZW50JykuYWRkQ2xhc3MoJ2V2ZW50UGFuZWwnKS5jc3MoJ29wYWNpdHknLCAnMCcpO1xyXG5cdFx0XHRpZihvcHRpb25zICE9IG51bGwgJiYgb3B0aW9ucy53aWR0aCAhPSBudWxsKSB7XHJcblx0XHRcdFx0RXZlbnRzLmV2ZW50UGFuZWwoKS5jc3MoJ3dpZHRoJywgb3B0aW9ucy53aWR0aCk7XHJcblx0XHRcdH1cclxuXHRcdFx0JCgnPGRpdj4nKS5hZGRDbGFzcygnZXZlbnRUaXRsZScpLnRleHQoRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnRpdGxlIGFzIHN0cmluZykuYXBwZW5kVG8oRXZlbnRzLmV2ZW50UGFuZWwoKSk7XHJcblx0XHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnZGVzY3JpcHRpb24nKS5hcHBlbmRUbyhFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdidXR0b25zJykuYXBwZW5kVG8oRXZlbnRzLmV2ZW50UGFuZWwoKSk7XHJcblx0XHRcdEV2ZW50cy5sb2FkU2NlbmUoJ3N0YXJ0Jyk7XHJcblx0XHRcdCQoJ2RpdiN3cmFwcGVyJykuYXBwZW5kKEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0XHRFdmVudHMuZXZlbnRQYW5lbCgpLmFuaW1hdGUoe29wYWNpdHk6IDF9LCBFdmVudHMuX1BBTkVMX0ZBREUsICdsaW5lYXInKTtcclxuXHRcdFx0dmFyIGN1cnJlbnRTY2VuZUluZm9ybWF0aW9uID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnNjZW5lc1tFdmVudHMuYWN0aXZlU2NlbmVdO1xyXG5cdFx0XHRpZiAoY3VycmVudFNjZW5lSW5mb3JtYXRpb24uYmxpbmspIHtcclxuXHRcdFx0XHRFdmVudHMuYmxpbmtUaXRsZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0c2NoZWR1bGVOZXh0RXZlbnQ6IGZ1bmN0aW9uKHNjYWxlPykge1xyXG5cdFx0dmFyIG5leHRFdmVudCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSooRXZlbnRzLl9FVkVOVF9USU1FX1JBTkdFWzFdIC0gRXZlbnRzLl9FVkVOVF9USU1FX1JBTkdFWzBdKSkgKyBFdmVudHMuX0VWRU5UX1RJTUVfUkFOR0VbMF07XHJcblx0XHRpZihzY2FsZSA+IDApIHsgbmV4dEV2ZW50ICo9IHNjYWxlOyB9XHJcblx0XHRFbmdpbmUubG9nKCduZXh0IGV2ZW50IHNjaGVkdWxlZCBpbiAnICsgbmV4dEV2ZW50ICsgJyBtaW51dGVzJyk7XHJcblx0XHRFdmVudHMuX2V2ZW50VGltZW91dCA9IEVuZ2luZS5zZXRUaW1lb3V0KEV2ZW50cy50cmlnZ2VyRXZlbnQsIG5leHRFdmVudCAqIDYwICogMTAwMCk7XHJcblx0fSxcclxuXHJcblx0ZW5kRXZlbnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLmV2ZW50UGFuZWwoKS5hbmltYXRlKHtvcGFjaXR5OjB9LCBFdmVudHMuX1BBTkVMX0ZBREUsICdsaW5lYXInLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0RXZlbnRzLmV2ZW50UGFuZWwoKS5yZW1vdmUoKTtcclxuXHRcdFx0Y29uc3QgYWN0aXZlRXZlbnQgPSBFdmVudHMuYWN0aXZlRXZlbnQoKTtcclxuXHRcdFx0aWYgKGFjdGl2ZUV2ZW50ICE9PSBudWxsKSBhY3RpdmVFdmVudC5ldmVudFBhbmVsID0gbnVsbDtcclxuXHRcdFx0RXZlbnRzLmV2ZW50U3RhY2suc2hpZnQoKTtcclxuXHRcdFx0RW5naW5lLmxvZyhFdmVudHMuZXZlbnRTdGFjay5sZW5ndGggKyAnIGV2ZW50cyByZW1haW5pbmcnKTtcclxuXHRcdFx0aWYgKEV2ZW50cy5CTElOS19JTlRFUlZBTCkge1xyXG5cdFx0XHRcdEV2ZW50cy5zdG9wVGl0bGVCbGluaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIEZvcmNlIHJlZm9jdXMgb24gdGhlIGJvZHkuIEkgaGF0ZSB5b3UsIElFLlxyXG5cdFx0XHQkKCdib2R5JykuZm9jdXMoKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGhhbmRsZVN0YXRlVXBkYXRlczogZnVuY3Rpb24oZSl7XHJcblx0XHRpZigoZS5jYXRlZ29yeSA9PSAnc3RvcmVzJyB8fCBlLmNhdGVnb3J5ID09ICdpbmNvbWUnKSAmJiBFdmVudHMuYWN0aXZlRXZlbnQoKSAhPSBudWxsKXtcclxuXHRcdFx0RXZlbnRzLnVwZGF0ZUJ1dHRvbnMoKTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcbiIsIi8qKlxyXG4gKiBFdmVudHMgdGhhdCBjYW4gb2NjdXIgd2hlbiB0aGUgUm9hZCBtb2R1bGUgaXMgYWN0aXZlXHJcbiAqKi9cclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4uL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4uL3BsYXllci9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IHsgT3V0cG9zdCB9IGZyb20gXCIuLi9wbGFjZXMvb3V0cG9zdFwiO1xyXG5pbXBvcnQgeyBSb2FkIH0gZnJvbSBcIi4uL3BsYWNlcy9yb2FkXCI7XHJcbmltcG9ydCB7IEFEUkV2ZW50IH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEV2ZW50c1JvYWRXYW5kZXI6IEFycmF5PEFEUkV2ZW50PiA9IFtcclxuICAgIC8vIFN0cmFuZ2VyIGJlYXJpbmcgZ2lmdHNcclxuICAgIHtcclxuICAgICAgICB0aXRsZTogXygnQSBTdHJhbmdlciBCZWNrb25zJyksXHJcbiAgICAgICAgaXNBdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSBSb2FkO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICdzdGFydCc6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdBcyB5b3Ugd2FuZGVyIGFsb25nIHRoZSByb2FkLCBhIGhvb2RlZCBzdHJhbmdlciBnZXN0dXJlcyB0byB5b3UuIEhlIGRvZXNuXFwndCBzZWVtIGludGVyZXN0ZWQgaW4gaHVydGluZyB5b3UuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnV2hhdCBkbyB5b3UgZG8/JylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2Nsb3Nlcic6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnRHJhdyBDbG9zZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTogJ2Nsb3Nlcid9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAnbGVhdmUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0dldCBPdXR0YSBUaGVyZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOiAnbGVhdmUnfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2Nsb3Nlcic6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdZb3UgbW92ZSB0b3dhcmQgaGltIGEgYml0IGFuZCBzdG9wLiBIZSBjb250aW51ZXMgdG8gYmVja29uLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1doYXQgZG8geW91IGRvPycpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdldmVuQ2xvc2VyJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdEcmF3IEV2ZW4gQ2xvc2VyJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6ICdldmVuQ2xvc2VyJ31cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnTmFoLCBUaGlzIGlzIFRvbyBTcG9va3knKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTogJ2xlYXZlJ31cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdldmVuQ2xvc2VyJzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1lvdSBoZXNpdGFudGx5IHdhbGsgY2xvc2VyLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0FzIHNvb24gYXMgeW91IGdldCB3aXRoaW4gYXJtc1xcJyByZWFjaCwgaGUgZ3JhYnMgeW91ciBoYW5kIHdpdGggYWxhcm1pbmcgc3BlZWQuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnSGUgcXVpY2tseSBwbGFjZXMgYW4gb2JqZWN0IGluIHlvdXIgaGFuZCwgdGhlbiBsZWF2ZXMgd29yZGxlc3NseS4nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIG9uTG9hZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbWF5YmUgc29tZSBsb2dpYyB0byBtYWtlIHJlcGVhdHMgbGVzcyBsaWtlbHk/XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9zc2libGVJdGVtcyA9IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ1N0cmFuZ2VyLnNtb290aFN0b25lJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ1N0cmFuZ2VyLndyYXBwZWRLbmlmZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdTdHJhbmdlci5jbG90aEJ1bmRsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdTdHJhbmdlci5jb2luJ1xyXG4gICAgICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IHBvc3NpYmxlSXRlbXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcG9zc2libGVJdGVtcy5sZW5ndGgpXTtcclxuICAgICAgICAgICAgICAgICAgICBDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdUaGFua3MsIEkgZ3Vlc3M/JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdZb3VyIGd1dCBjbGVuY2hlcywgYW5kIHlvdSBmZWVsIHRoZSBzdWRkZW4gdXJnZSB0byBsZWF2ZS4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdBcyB5b3Ugd2FsayBhd2F5LCB5b3UgY2FuIGZlZWwgdGhlIG9sZCBtYW5cXCdzIGdhemUgb24geW91ciBiYWNrLicpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdXZWlyZC4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgdGl0bGU6IF8oJ0EgUmFyZSBPcHBvcnR1bml0eScpLFxyXG4gICAgICAgIGlzQXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gUm9hZDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAnc3RhcnQnOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgXygnQSBjYXJyaWFnZSBwdWxscyB1cCBhbG9uZ3NpZGUgeW91LCBhbmQgdGhlIHZvaWNlIG9mIGFuIGVsZGVybHkgd29tYW4gY3JvYWtzIG91dCBmcm9tIHdpdGhpbi4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdcIk15LCBidXQgeW91IGxvb2sgdGlyZWQgZnJvbSB5b3VyIGpvdXJuZXkuIElmIGl0XFwncyB0aGUgT3V0cG9zdCB5b3Ugc2VlaywgJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKyAnSVxcJ20gb24gbXkgd2F5IHRoZXJlIG5vdzsgd291bGQgeW91IGxpa2UgdG8gam9pbiBtZT9cIicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1doYXQgZG8geW91IGRvPycpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdhY2NlcHQnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FjY2VwdCBoZXIgb2ZmZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTogJ2FjY2VwdCd9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAnbGVhdmUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1BvbGl0ZWx5IERlY2xpbmUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTogJ2xlYXZlJ31cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdhY2NlcHQnOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgXygnWW91IGhvcCBpbiB0aGUgY2FycmlhZ2Ugd2l0aCB0aGUgb2xkIHdvbWFuLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1NoZSB0dXJucyBvdXQgdG8gYmUgcHJldHR5IGNvb2wsIGFuZCBnaXZlcyB5b3Ugb25lIG9mIHRob3NlIGhhcmQgY2FuZGllcyB0aGF0ICcgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJ2V2ZXJ5IGdyYW5kcGFyZW50IHNlZW1zIHRvIGhhdmUgb24gdGhlIGVuZCB0YWJsZSBuZXh0IHRvIHRoZWlyIHNvZmEuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnQmVmb3JlIGxvbmcsIHlvdSByZWFjaCB0aGUgT3V0cG9zdC4gWW91IGhvcCBvdXQgYW5kIHRoYW5rIHRoZSBvbGQgd29tYW4gZm9yIHRoZSByaWRlLicpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdXaGF0IGEgbmljZSBvbGQgbGFkeScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJFNNLmdldCgnb3V0cG9zdC5vcGVuJykgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE91dHBvc3QuaW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRTTS5zZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGFyYWN0ZXIuc2V0UXVlc3RTdGF0dXMoXCJtYXlvclN1cHBsaWVzXCIsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENoYXJhY3Rlci5jaGVja1F1ZXN0U3RhdHVzKFwibWF5b3JTdXBwbGllc1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFbmdpbmUudHJhdmVsVG8oT3V0cG9zdClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENoYXJhY3Rlci5hZGRUb0ludmVudG9yeSgnb2xkTGFkeS5DYW5keScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnbGVhdmUnOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgXygnSXRcXCdzIHRvbyBlYXJseSBpbiB0aGUgZ2FtZSB0byBiZSB0cnVzdGluZyB3ZWlyZCBvbGQgcGVvcGxlLCBtYW4uIFlvdSBwb2xpdGVseSAnIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICArICdkZWNsaW5lLCBhbmQgdGhlIHdvbWFuIGNodWNrbGVzIHNvZnRseSBhcyB0aGUgY2FycmlhZ2Ugcm9sbHMgb2ZmIGludG8gdGhlIGRpc3RhbmNlLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1RoYXQgc29mdCBjaHVja2xlIHRlbGxzIG1lIGV2ZXJ5dGhpbmcgSSBuZWVkIHRvIGtub3cgYWJvdXQgd2hldGhlciB5b3UgbWFkZSB0aGUgJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICArICdyaWdodCBjYWxsLiBUaGF0IGhhZCBcInR1cm5lZCBpbnRvIGdpbmdlcmJyZWFkXCIgd3JpdHRlbiBhbGwgb3ZlciBpdC4nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnWWVhaCBpdCBkaWQnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBVbmxvY2sgT3V0cG9zdFxyXG4gICAge1xyXG4gICAgICAgIHRpdGxlOiBfKCdBIFdheSBGb3J3YXJkIE1ha2VzIEl0c2VsZiBLbm93bicpLFxyXG4gICAgICAgIGlzQXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIChFbmdpbmUuYWN0aXZlTW9kdWxlID09IFJvYWQpXHJcbiAgICAgICAgICAgICAgICAmJiAoJFNNLmdldCgnUm9hZC5jb3VudGVyJykgYXMgbnVtYmVyID4gMykgLy8gY2FuJ3QgaGFwcGVuIFRPTyBlYXJseVxyXG4gICAgICAgICAgICAgICAgJiYgKCRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSA9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICB8fCAkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyIDwgMSkgLy8gY2FuJ3QgaGFwcGVuIHR3aWNlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpc1N1cGVyTGlrZWx5OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuICgoKCAkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfHwgJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpIGFzIG51bWJlciA8IDEpKSBcclxuICAgICAgICAgICAgICAgICAgICAmJiAoJFNNLmdldCgnUm9hZC5jb3VudGVyJykgYXMgbnVtYmVyID4gNyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgJ3N0YXJ0Jzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1Ntb2tlIGN1cmxzIHVwd2FyZHMgZnJvbSBiZWhpbmQgYSBoaWxsLiBZb3UgY2xpbWIgaGlnaGVyIHRvIGludmVzdGlnYXRlLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0Zyb20geW91ciBlbGV2YXRlZCBwb3NpdGlvbiwgeW91IGNhbiBzZWUgZG93biBpbnRvIHRoZSBvdXRwb3N0IHRoYXQgdGhlIG1heW9yIHNwb2tlIG9mIGJlZm9yZS4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdUaGUgT3V0cG9zdCBpcyBub3cgb3BlbiB0byB5b3UuJylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0EgbGl0dGxlIGRyYW1hdGljLCBidXQgY29vbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBPdXRwb3N0LmluaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRTTS5zZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENoYXJhY3Rlci5zZXRRdWVzdFN0YXR1cyhcIm1heW9yU3VwcGxpZXNcIiwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDaGFyYWN0ZXIuY2hlY2tRdWVzdFN0YXR1cyhcIm1heW9yU3VwcGxpZXNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5dO1xyXG5cclxuIiwiLyoqXHJcbiAqIE1vZHVsZSB0aGF0IHRha2VzIGNhcmUgb2YgaGVhZGVyIGJ1dHRvbnNcclxuICovXHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuL2VuZ2luZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEhlYWRlciA9IHtcclxuXHRcclxuXHRpbml0OiBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdH0sXHJcblx0XHJcblx0b3B0aW9uczoge30sIC8vIE5vdGhpbmcgZm9yIG5vd1xyXG5cdFxyXG5cdGNhblRyYXZlbDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gJCgnZGl2I2hlYWRlciBkaXYuaGVhZGVyQnV0dG9uJykubGVuZ3RoID4gMTtcclxuXHR9LFxyXG5cdFxyXG5cdGFkZExvY2F0aW9uOiBmdW5jdGlvbih0ZXh0LCBpZCwgbW9kdWxlKSB7XHJcblx0XHRyZXR1cm4gJCgnPGRpdj4nKS5hdHRyKCdpZCcsIFwibG9jYXRpb25fXCIgKyBpZClcclxuXHRcdFx0LmFkZENsYXNzKCdoZWFkZXJCdXR0b24nKVxyXG5cdFx0XHQudGV4dCh0ZXh0KS5jbGljayhmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZihIZWFkZXIuY2FuVHJhdmVsKCkpIHtcclxuXHRcdFx0XHRcdEVuZ2luZS50cmF2ZWxUbyhtb2R1bGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSkuYXBwZW5kVG8oJCgnZGl2I2hlYWRlcicpKTtcclxuXHR9XHJcbn07IiwiLyoqXHJcbiAqIE1vZHVsZSB0aGF0IHJlZ2lzdGVycyB0aGUgbm90aWZpY2F0aW9uIGJveCBhbmQgaGFuZGxlcyBtZXNzYWdlc1xyXG4gKi9cclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4vZW5naW5lXCI7XHJcblxyXG5leHBvcnQgY29uc3QgTm90aWZpY2F0aW9ucyA9IHtcclxuXHRcdFxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdFx0XHJcblx0XHQvLyBDcmVhdGUgdGhlIG5vdGlmaWNhdGlvbnMgYm94XHJcblx0XHRjb25zdCBlbGVtID0gJCgnPGRpdj4nKS5hdHRyKHtcclxuXHRcdFx0aWQ6ICdub3RpZmljYXRpb25zJyxcclxuXHRcdFx0Y2xhc3NOYW1lOiAnbm90aWZpY2F0aW9ucydcclxuXHRcdH0pO1xyXG5cdFx0Ly8gQ3JlYXRlIHRoZSB0cmFuc3BhcmVuY3kgZ3JhZGllbnRcclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnbm90aWZ5R3JhZGllbnQnKS5hcHBlbmRUbyhlbGVtKTtcclxuXHRcdFxyXG5cdFx0ZWxlbS5hcHBlbmRUbygnZGl2I3dyYXBwZXInKTtcclxuXHR9LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHt9LCAvLyBOb3RoaW5nIGZvciBub3dcclxuXHRcclxuXHRlbGVtOiBudWxsLFxyXG5cdFxyXG5cdG5vdGlmeVF1ZXVlOiB7fSxcclxuXHRcclxuXHQvLyBBbGxvdyBub3RpZmljYXRpb24gdG8gdGhlIHBsYXllclxyXG5cdG5vdGlmeTogZnVuY3Rpb24obW9kdWxlLCB0ZXh0LCBub1F1ZXVlPykge1xyXG5cdFx0aWYodHlwZW9mIHRleHQgPT0gJ3VuZGVmaW5lZCcpIHJldHVybjtcclxuXHRcdC8vIEkgZG9uJ3QgbmVlZCB5b3UgcHVuY3R1YXRpbmcgZm9yIG1lLCBmdW5jdGlvbi5cclxuXHRcdC8vIGlmKHRleHQuc2xpY2UoLTEpICE9IFwiLlwiKSB0ZXh0ICs9IFwiLlwiO1xyXG5cdFx0aWYobW9kdWxlICE9IG51bGwgJiYgRW5naW5lLmFjdGl2ZU1vZHVsZSAhPSBtb2R1bGUpIHtcclxuXHRcdFx0aWYoIW5vUXVldWUpIHtcclxuXHRcdFx0XHRpZih0eXBlb2YgdGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdID09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0XHR0aGlzLm5vdGlmeVF1ZXVlW21vZHVsZV0gPSBbXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdLnB1c2godGV4dCk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdE5vdGlmaWNhdGlvbnMucHJpbnRNZXNzYWdlKHRleHQpO1xyXG5cdFx0fVxyXG5cdFx0RW5naW5lLnNhdmVHYW1lKCk7XHJcblx0fSxcclxuXHRcclxuXHRjbGVhckhpZGRlbjogZnVuY3Rpb24oKSB7XHJcblx0XHJcblx0XHQvLyBUbyBmaXggc29tZSBtZW1vcnkgdXNhZ2UgaXNzdWVzLCB3ZSBjbGVhciBub3RpZmljYXRpb25zIHRoYXQgaGF2ZSBiZWVuIGhpZGRlbi5cclxuXHRcdFxyXG5cdFx0Ly8gV2UgdXNlIHBvc2l0aW9uKCkudG9wIGhlcmUsIGJlY2F1c2Ugd2Uga25vdyB0aGF0IHRoZSBwYXJlbnQgd2lsbCBiZSB0aGUgc2FtZSwgc28gdGhlIHBvc2l0aW9uIHdpbGwgYmUgdGhlIHNhbWUuXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHR2YXIgYm90dG9tID0gJCgnI25vdGlmeUdyYWRpZW50JykucG9zaXRpb24oKS50b3AgKyAkKCcjbm90aWZ5R3JhZGllbnQnKS5vdXRlckhlaWdodCh0cnVlKTtcclxuXHRcdFxyXG5cdFx0JCgnLm5vdGlmaWNhdGlvbicpLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcclxuXHRcdFx0aWYoJCh0aGlzKS5wb3NpdGlvbigpLnRvcCA+IGJvdHRvbSl7XHJcblx0XHRcdFx0JCh0aGlzKS5yZW1vdmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdH0sXHJcblx0XHJcblx0cHJpbnRNZXNzYWdlOiBmdW5jdGlvbih0KSB7XHJcblx0XHR2YXIgdGV4dCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ25vdGlmaWNhdGlvbicpLmNzcygnb3BhY2l0eScsICcwJykudGV4dCh0KS5wcmVwZW5kVG8oJ2RpdiNub3RpZmljYXRpb25zJyk7XHJcblx0XHR0ZXh0LmFuaW1hdGUoe29wYWNpdHk6IDF9LCA1MDAsICdsaW5lYXInLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly8gRG8gdGhpcyBldmVyeSB0aW1lIHdlIGFkZCBhIG5ldyBtZXNzYWdlLCB0aGlzIHdheSB3ZSBuZXZlciBoYXZlIGEgbGFyZ2UgYmFja2xvZyB0byBpdGVyYXRlIHRocm91Z2guIEtlZXBzIHRoaW5ncyBmYXN0ZXIuXHJcblx0XHRcdE5vdGlmaWNhdGlvbnMuY2xlYXJIaWRkZW4oKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0XHJcblx0cHJpbnRRdWV1ZTogZnVuY3Rpb24obW9kdWxlKSB7XHJcblx0XHRpZih0eXBlb2YgdGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdICE9ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdHdoaWxlKHRoaXMubm90aWZ5UXVldWVbbW9kdWxlXS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9ucy5wcmludE1lc3NhZ2UodGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdLnNoaWZ0KCkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCB7IEVuZ2luZSB9IGZyb20gJy4uL2VuZ2luZSc7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gJy4uL3N0YXRlX21hbmFnZXInO1xyXG5pbXBvcnQgeyBXZWF0aGVyIH0gZnJvbSAnLi4vd2VhdGhlcic7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCB7IENhcHRhaW4gfSBmcm9tICcuLi9jaGFyYWN0ZXJzL2NhcHRhaW4nO1xyXG5pbXBvcnQgeyBIZWFkZXIgfSBmcm9tICcuLi9oZWFkZXInO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSAnLi4vLi4vbGliL3RyYW5zbGF0ZSc7XHJcblxyXG5leHBvcnQgY29uc3QgT3V0cG9zdCA9IHtcclxuXHRkZXNjcmlwdGlvbjogW1xyXG5cdFx0XyhcIllvdSdyZSBpbiBhIHNtYWxsIGJ1dCBidXN0bGluZyBtaWxpdGFyeSBvdXRwb3N0LiBWYXJpb3VzIG1lbWJlcnMgXCIgXHJcblx0XHRcdCsgXCJvZiB0aGUgcmFuay1hbmQtZmlsZSBnbyBhYm91dCB0aGVpciBidXNpbmVzcywgcGF5aW5nIHlvdSBsaXR0bGUgbWluZC5cIiksXHJcblx0XHRfKFwiT25lIHRlbnQgc3RhbmRzIG91dCBmcm9tIHRoZSByZXN0OyB0aGUgZmluZWx5LWVtYnJvaWRlcmVkIGRldGFpbHMgYW5kIFwiICsgXHJcblx0XHRcdFwiZ29sZGVuIGljb24gYWJvdmUgdGhlIGVudHJhbmNlIG1hcmsgaXQgYXMgdGhlIGNvbW1hbmRpbmcgb2ZmaWNlcidzIHF1YXJ0ZXJzLlwiKVxyXG5cdF0sXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgdGhlIE91dHBvc3QgdGFiXHJcbiAgICAgICAgdGhpcy50YWIgPSBIZWFkZXIuYWRkTG9jYXRpb24oXyhcIlRoZSBPdXRwb3N0XCIpLCBcIm91dHBvc3RcIiwgT3V0cG9zdCk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgT3V0cG9zdCBwYW5lbFxyXG5cdFx0dGhpcy5wYW5lbCA9ICQoJzxkaXY+JylcclxuICAgICAgICAuYXR0cignaWQnLCBcIm91dHBvc3RQYW5lbFwiKVxyXG4gICAgICAgIC5hZGRDbGFzcygnbG9jYXRpb24nKVxyXG4gICAgICAgIC5hcHBlbmRUbygnZGl2I2xvY2F0aW9uU2xpZGVyJyk7XHJcblxyXG5cdFx0Ly8gQ3JlYXRlIHRoZSBkZXNjcmlwdGlvbiB0ZXh0XHJcblx0XHR2YXIgZGVzYyA9ICQoJzxkaXY+JykuYXR0cignaWQnLCAnZGVzY3JpcHRpb24nKS5hcHBlbmRUbyh0aGlzLnBhbmVsKTtcclxuXHJcblx0XHRmb3IodmFyIGkgaW4gdGhpcy5kZXNjcmlwdGlvbikge1xyXG5cdFx0XHQkKCc8ZGl2PicpLnRleHQodGhpcy5kZXNjcmlwdGlvbltpXSkuYXBwZW5kVG8oZGVzYyk7XHJcblx0XHR9XHJcblxyXG4gICAgICAgIEVuZ2luZS51cGRhdGVTbGlkZXIoKTtcclxuXHJcbiAgICAgICAgLy8gbmV3IFxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAnY2FwdGFpbkJ1dHRvbicsXHJcblx0XHRcdHRleHQ6IF8oJ1NwZWFrIHdpdGggVGhlIENhcHRhaW4nKSxcclxuXHRcdFx0Y2xpY2s6IENhcHRhaW4udGFsa1RvQ2FwdGFpbixcclxuXHRcdFx0d2lkdGg6ICc4MHB4J1xyXG5cdFx0fSlcclxuXHRcdC5hZGRDbGFzcygnbG9jYXRpb25CdXR0b24nKVxyXG5cdFx0LmFwcGVuZFRvKCdkaXYjb3V0cG9zdFBhbmVsJyk7XHJcblxyXG4gICAgICAgIE91dHBvc3QudXBkYXRlQnV0dG9uKCk7XHJcblxyXG4gICAgICAgIC8vIHNldHRpbmcgdGhpcyBzZXBhcmF0ZWx5IHNvIHRoYXQgcXVlc3Qgc3RhdHVzIGNhbid0IGFjY2lkZW50YWxseSBicmVhayBpdCBsYXRlclxyXG4gICAgICAgICRTTS5zZXQoJ291dHBvc3Qub3BlbicsIDEpOyBcclxuICAgIH0sXHJcblxyXG4gICAgYXZhaWxhYmxlV2VhdGhlcjoge1xyXG5cdFx0J3N1bm55JzogMC40LFxyXG5cdFx0J2Nsb3VkeSc6IDAuMyxcclxuXHRcdCdyYWlueSc6IDAuM1xyXG5cdH0sXHJcblxyXG4gICAgb25BcnJpdmFsOiBmdW5jdGlvbih0cmFuc2l0aW9uX2RpZmYpIHtcclxuICAgICAgICBPdXRwb3N0LnNldFRpdGxlKCk7XHJcblxyXG5cdFx0RW5naW5lLm1vdmVTdG9yZXNWaWV3KG51bGwsIHRyYW5zaXRpb25fZGlmZik7XHJcblxyXG4gICAgICAgIFdlYXRoZXIuaW5pdGlhdGVXZWF0aGVyKE91dHBvc3QuYXZhaWxhYmxlV2VhdGhlciwgJ291dHBvc3QnKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0VGl0bGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRpdGxlID0gXyhcIlRoZSBPdXRwb3N0XCIpO1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSB0aGlzKSB7XHJcblx0XHRcdGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XHJcblx0XHR9XHJcblx0XHQkKCdkaXYjbG9jYXRpb25fb3V0cG9zdCcpLnRleHQodGl0bGUpO1xyXG5cdH0sXHJcblxyXG4gICAgdXBkYXRlQnV0dG9uOiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIGNvbmRpdGlvbmFscyBmb3IgdXBkYXRpbmcgYnV0dG9uc1xyXG5cdH0sXHJcblxyXG4gICAgLy8gZG9uJ3QgbmVlZCB0aGlzIHlldCAob3IgbWF5YmUgZXZlcilcclxuXHQvLyB3YW5kZXJFdmVudDogZnVuY3Rpb24oKSB7XHJcblx0Ly8gXHRFdmVudHMudHJpZ2dlckxvY2F0aW9uRXZlbnQoJ091dHBvc3RXYW5kZXInKTtcclxuXHQvLyBcdCRTTS5hZGQoJ091dHBvc3QuY291bnRlcicsIDEpO1xyXG5cdC8vIH1cclxufSIsImltcG9ydCB7IEhlYWRlciB9IGZyb20gXCIuLi9oZWFkZXJcIjtcclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4uL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi4vQnV0dG9uXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyBXZWF0aGVyIH0gZnJvbSBcIi4uL3dlYXRoZXJcIjtcclxuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IFJvYWQgPSB7XHJcblx0ZGVzY3JpcHRpb246IFtcclxuXHRcdF8oXCJZb3UncmUgb24gYSBkdXN0eSByb2FkIGJldHdlZW4gdGhlIFZpbGxhZ2UgYW5kIHRoZSBPdXRwb3N0LiBUaGUgcm9hZCBjdXRzIHRocm91Z2ggXCIgXHJcblx0XHRcdCsgXCJ0YWxsIGdyYXNzLCBicnVzaCwgYW5kIHRyZWVzLCBsaW1pdGluZyB2aXNpYmlsaXR5IGFuZCBlbnN1cmluZyB0aGF0IHlvdSdsbCBoYXZlIFwiIFxyXG5cdFx0XHQrIFwidG8gZGVhbCB3aXRoIHNvbWUgbm9uc2Vuc2UuXCIpLFxyXG5cdFx0XyhcIlRoZSBoYWlyIG9uIHRoZSBiYWNrIG9mIHlvdXIgbmVjayBwcmlja2xlcyBzbGlnaHRseSBpbiBhbnRpY2lwYXRpb24uXCIpXHJcblx0XSxcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgUm9hZCB0YWJcclxuICAgICAgICB0aGlzLnRhYiA9IEhlYWRlci5hZGRMb2NhdGlvbihfKFwiUm9hZCB0byB0aGUgT3V0cG9zdFwiKSwgXCJyb2FkXCIsIFJvYWQpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgdGhlIFJvYWQgcGFuZWxcclxuXHRcdHRoaXMucGFuZWwgPSAkKCc8ZGl2PicpXHJcbiAgICAgICAgLmF0dHIoJ2lkJywgXCJyb2FkUGFuZWxcIilcclxuICAgICAgICAuYWRkQ2xhc3MoJ2xvY2F0aW9uJylcclxuICAgICAgICAuYXBwZW5kVG8oJ2RpdiNsb2NhdGlvblNsaWRlcicpO1xyXG5cclxuXHRcdHZhciBkZXNjID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdkZXNjcmlwdGlvbicpLmFwcGVuZFRvKHRoaXMucGFuZWwpO1xyXG5cclxuXHRcdGZvcih2YXIgaSBpbiB0aGlzLmRlc2NyaXB0aW9uKSB7XHJcblx0XHRcdCQoJzxkaXY+JykudGV4dCh0aGlzLmRlc2NyaXB0aW9uW2ldKS5hcHBlbmRUbyhkZXNjKTtcclxuXHRcdH1cclxuXHJcbiAgICAgICAgRW5naW5lLnVwZGF0ZVNsaWRlcigpO1xyXG5cclxuXHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogJ3dhbmRlckJ1dHRvbicsXHJcblx0XHRcdHRleHQ6IF8oJ1dhbmRlciBBcm91bmQnKSxcclxuXHRcdFx0Y2xpY2s6IFJvYWQud2FuZGVyRXZlbnQsXHJcblx0XHRcdHdpZHRoOiAnODBweCcsXHJcblx0XHRcdGNvc3Q6IHt9IC8vIFRPRE86IG1ha2UgdGhlcmUgYmUgYSBjb3N0IHRvIGRvaW5nIHN0dWZmP1xyXG5cdFx0fSlcclxuXHRcdC5hZGRDbGFzcygnbG9jYXRpb25CdXR0b24nKVxyXG5cdFx0LmFwcGVuZFRvKCdkaXYjcm9hZFBhbmVsJyk7XHJcblxyXG4gICAgICAgIFJvYWQudXBkYXRlQnV0dG9uKCk7XHJcblxyXG4gICAgICAgIC8vIHNldHRpbmcgdGhpcyBzZXBhcmF0ZWx5IHNvIHRoYXQgcXVlc3Qgc3RhdHVzIGNhbid0IGFjY2lkZW50YWxseSBicmVhayBpdCBsYXRlclxyXG4gICAgICAgICRTTS5zZXQoJ3JvYWQub3BlbicsIDEpOyBcclxuICAgIH0sXHJcblxyXG4gICAgYXZhaWxhYmxlV2VhdGhlcjoge1xyXG5cdFx0J3N1bm55JzogMC40LFxyXG5cdFx0J2Nsb3VkeSc6IDAuMyxcclxuXHRcdCdyYWlueSc6IDAuM1xyXG5cdH0sXHJcblxyXG4gICAgb25BcnJpdmFsOiBmdW5jdGlvbih0cmFuc2l0aW9uX2RpZmYpIHtcclxuICAgICAgICBSb2FkLnNldFRpdGxlKCk7XHJcblxyXG5cdFx0RW5naW5lLm1vdmVTdG9yZXNWaWV3KG51bGwsIHRyYW5zaXRpb25fZGlmZik7XHJcblxyXG4gICAgICAgIFdlYXRoZXIuaW5pdGlhdGVXZWF0aGVyKFJvYWQuYXZhaWxhYmxlV2VhdGhlciwgJ3JvYWQnKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0VGl0bGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRpdGxlID0gXyhcIlJvYWQgdG8gdGhlIE91dHBvc3RcIik7XHJcblx0XHRpZihFbmdpbmUuYWN0aXZlTW9kdWxlID09IHRoaXMpIHtcclxuXHRcdFx0ZG9jdW1lbnQudGl0bGUgPSB0aXRsZTtcclxuXHRcdH1cclxuXHRcdCQoJ2RpdiNsb2NhdGlvbl9yb2FkJykudGV4dCh0aXRsZSk7XHJcblx0fSxcclxuXHJcbiAgICB1cGRhdGVCdXR0b246IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gY29uZGl0aW9uYWxzIGZvciB1cGRhdGluZyBidXR0b25zXHJcblx0fSxcclxuXHJcblx0d2FuZGVyRXZlbnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnRyaWdnZXJMb2NhdGlvbkV2ZW50KCdSb2FkV2FuZGVyJyk7XHJcblx0XHQkU00uYWRkKCdSb2FkLmNvdW50ZXInLCAxKTtcclxuXHR9XHJcbn0iLCIvKipcclxuICogTW9kdWxlIHRoYXQgcmVnaXN0ZXJzIHRoZSBzaW1wbGUgcm9vbSBmdW5jdGlvbmFsaXR5XHJcbiAqL1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi4vZW5naW5lXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi9CdXR0b25cIjtcclxuaW1wb3J0IHsgTm90aWZpY2F0aW9ucyB9IGZyb20gXCIuLi9ub3RpZmljYXRpb25zXCI7XHJcbmltcG9ydCB7IFdlYXRoZXIgfSBmcm9tIFwiLi4vd2VhdGhlclwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgSGVhZGVyIH0gZnJvbSBcIi4uL2hlYWRlclwiO1xyXG5pbXBvcnQgeyBMaXogfSBmcm9tIFwiLi4vY2hhcmFjdGVycy9saXpcIjtcclxuaW1wb3J0IHsgTWF5b3IgfSBmcm9tIFwiLi4vY2hhcmFjdGVycy9tYXlvclwiO1xyXG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgVmlsbGFnZSA9IHtcclxuXHQvLyB0aW1lcyBpbiAobWludXRlcyAqIHNlY29uZHMgKiBtaWxsaXNlY29uZHMpXHJcblx0X0ZJUkVfQ09PTF9ERUxBWTogNSAqIDYwICogMTAwMCwgLy8gdGltZSBhZnRlciBhIHN0b2tlIGJlZm9yZSB0aGUgZmlyZSBjb29sc1xyXG5cdF9ST09NX1dBUk1fREVMQVk6IDMwICogMTAwMCwgLy8gdGltZSBiZXR3ZWVuIHJvb20gdGVtcGVyYXR1cmUgdXBkYXRlc1xyXG5cdF9CVUlMREVSX1NUQVRFX0RFTEFZOiAwLjUgKiA2MCAqIDEwMDAsIC8vIHRpbWUgYmV0d2VlbiBidWlsZGVyIHN0YXRlIHVwZGF0ZXNcclxuXHRfU1RPS0VfQ09PTERPV046IDEwLCAvLyBjb29sZG93biB0byBzdG9rZSB0aGUgZmlyZVxyXG5cdF9ORUVEX1dPT0RfREVMQVk6IDE1ICogMTAwMCwgLy8gZnJvbSB3aGVuIHRoZSBzdHJhbmdlciBzaG93cyB1cCwgdG8gd2hlbiB5b3UgbmVlZCB3b29kXHJcblx0XHJcblx0YnV0dG9uczp7fSxcclxuXHRcclxuXHRjaGFuZ2VkOiBmYWxzZSxcclxuXHJcblx0ZGVzY3JpcHRpb246IFtcclxuXHRcdF8oXCJOZXN0bGVkIGluIHRoZSB3b29kcywgdGhpcyB2aWxsYWdlIGlzIHNjYXJjZWx5IG1vcmUgdGhhbiBhIGhhbWxldCwgXCIgXHJcblx0XHRcdCsgXCJkZXNwaXRlIHlvdSB0aGlua2luZyB0aG9zZSB0d28gd29yZHMgYXJlIHN5bm9ueW1zLiBUaGV5J3JlIG5vdCwgXCIgXHJcblx0XHRcdCsgXCJnbyBnb29nbGUgJ2hhbWxldCcgcmlnaHQgbm93IGlmIHlvdSBkb24ndCBiZWxpZXZlIG1lLlwiKSxcclxuXHRcdF8oXCJUaGUgdmlsbGFnZSBpcyBxdWlldCBhdCB0aGUgbW9tZW50OyB0aGVyZSBhcmVuJ3QgZW5vdWdoIGhhbmRzIGZvciBhbnlvbmUgdG8gcmVtYWluIGlkbGUgZm9yIGxvbmcuXCIpXHJcblx0XSxcclxuXHRcclxuXHRuYW1lOiBfKFwiVmlsbGFnZVwiKSxcclxuXHRpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHRcdFxyXG5cdFx0aWYoRW5naW5lLl9kZWJ1Zykge1xyXG5cdFx0XHR0aGlzLl9ST09NX1dBUk1fREVMQVkgPSA1MDAwO1xyXG5cdFx0XHR0aGlzLl9CVUlMREVSX1NUQVRFX0RFTEFZID0gNTAwMDtcclxuXHRcdFx0dGhpcy5fU1RPS0VfQ09PTERPV04gPSAwO1xyXG5cdFx0XHR0aGlzLl9ORUVEX1dPT0RfREVMQVkgPSA1MDAwO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBDcmVhdGUgdGhlIFZpbGxhZ2UgdGFiXHJcblx0XHR0aGlzLnRhYiA9IEhlYWRlci5hZGRMb2NhdGlvbihfKFwiQSBDaGlsbCBWaWxsYWdlXCIpLCBcInZpbGxhZ2VcIiwgVmlsbGFnZSk7XHJcblx0XHRcclxuXHRcdC8vIENyZWF0ZSB0aGUgVmlsbGFnZSBwYW5lbFxyXG5cdFx0dGhpcy5wYW5lbCA9ICQoJzxkaXY+JylcclxuXHRcdFx0LmF0dHIoJ2lkJywgXCJ2aWxsYWdlUGFuZWxcIilcclxuXHRcdFx0LmFkZENsYXNzKCdsb2NhdGlvbicpXHJcblx0XHRcdC5hcHBlbmRUbygnZGl2I2xvY2F0aW9uU2xpZGVyJyk7XHJcblxyXG5cdFx0dmFyIGRlc2MgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2Rlc2NyaXB0aW9uJykuYXBwZW5kVG8odGhpcy5wYW5lbCk7XHJcblxyXG5cdFx0Zm9yKHZhciBpIGluIHRoaXMuZGVzY3JpcHRpb24pIHtcclxuXHRcdFx0JCgnPGRpdj4nKS50ZXh0KHRoaXMuZGVzY3JpcHRpb25baV0pLmFwcGVuZFRvKGRlc2MpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRFbmdpbmUudXBkYXRlU2xpZGVyKCk7XHJcblxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAndGFsa0J1dHRvbicsXHJcblx0XHRcdHRleHQ6IF8oJ1RhbGsgdG8gdGhlIE1heW9yJyksXHJcblx0XHRcdGNsaWNrOiBNYXlvci50YWxrVG9NYXlvcixcclxuXHRcdFx0d2lkdGg6ICc4MHB4JyxcclxuXHRcdFx0Y29zdDoge31cclxuXHRcdH0pXHJcblx0XHQuYWRkQ2xhc3MoJ2xvY2F0aW9uQnV0dG9uJylcclxuXHRcdC5hcHBlbmRUbygnZGl2I3ZpbGxhZ2VQYW5lbCcpO1xyXG5cclxuXHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogJ2xpekJ1dHRvbicsXHJcblx0XHRcdHRleHQ6IF8oJ1RhbGsgdG8gTGl6JyksXHJcblx0XHRcdGNsaWNrOiBMaXoudGFsa1RvTGl6LFxyXG5cdFx0XHR3aWR0aDogJzgwcHgnLFxyXG5cdFx0XHRjb3N0OiB7fVxyXG5cdFx0fSlcclxuXHRcdC5hZGRDbGFzcygnbG9jYXRpb25CdXR0b24nKVxyXG5cdFx0LmFwcGVuZFRvKCdkaXYjdmlsbGFnZVBhbmVsJyk7XHJcblxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAnbmV3QnVpbGRpbmdCdXR0b24nLFxyXG5cdFx0XHR0ZXh0OiBfKCdDaGVjayBvdXQgdGhlIG5ldyBidWlsZGluZycpLFxyXG5cdFx0XHRjbGljazogVmlsbGFnZS50ZW1wQnVpbGRpbmdNZXNzYWdlLFxyXG5cdFx0XHR3aWR0aDogJzgwcHgnLFxyXG5cdFx0XHRjb3N0OiB7fVxyXG5cdFx0fSlcclxuXHRcdC5hZGRDbGFzcygnbG9jYXRpb25CdXR0b24nKVxyXG5cdFx0LmFwcGVuZFRvKCdkaXYjdmlsbGFnZVBhbmVsJyk7XHJcblxyXG5cdFx0dmFyIGJ1aWxkaW5nQnV0dG9uID0gJCgnI25ld0J1aWxkaW5nQnV0dG9uLmJ1dHRvbicpO1xyXG5cdFx0YnVpbGRpbmdCdXR0b24uaGlkZSgpO1xyXG5cclxuXHRcdHZhciBsaXpCdXR0b24gPSAkKCcjbGl6QnV0dG9uLmJ1dHRvbicpO1xyXG5cdFx0bGl6QnV0dG9uLmhpZGUoKTtcclxuXHRcdFxyXG5cdFx0Ly8gQ3JlYXRlIHRoZSBzdG9yZXMgY29udGFpbmVyXHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ3N0b3Jlc0NvbnRhaW5lcicpLmFwcGVuZFRvKCdkaXYjdmlsbGFnZVBhbmVsJyk7XHJcblx0XHRcclxuXHRcdC8vc3Vic2NyaWJlIHRvIHN0YXRlVXBkYXRlc1xyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5zdWJzY3JpYmUoVmlsbGFnZS5oYW5kbGVTdGF0ZVVwZGF0ZXMpO1xyXG5cdFx0XHJcblx0XHRWaWxsYWdlLnVwZGF0ZUJ1dHRvbigpO1xyXG5cdH0sXHJcblx0XHJcblx0b3B0aW9uczoge30sIC8vIE5vdGhpbmcgZm9yIG5vd1xyXG5cclxuXHRhdmFpbGFibGVXZWF0aGVyOiB7XHJcblx0XHQnc3VubnknOiAwLjQsXHJcblx0XHQnY2xvdWR5JzogMC4zLFxyXG5cdFx0J3JhaW55JzogMC4zXHJcblx0fSxcclxuXHRcclxuXHRvbkFycml2YWw6IGZ1bmN0aW9uKHRyYW5zaXRpb25fZGlmZikge1xyXG5cdFx0VmlsbGFnZS5zZXRUaXRsZSgpO1xyXG5cdFx0aWYoJFNNLmdldCgnZ2FtZS5idWlsZGVyLmxldmVsJykgPT0gMykge1xyXG5cdFx0XHQkU00uYWRkKCdnYW1lLmJ1aWxkZXIubGV2ZWwnLCAxKTtcclxuXHRcdFx0JFNNLnNldEluY29tZSgnYnVpbGRlcicsIHtcclxuXHRcdFx0XHRkZWxheTogMTAsXHJcblx0XHRcdFx0c3RvcmVzOiB7J3dvb2QnIDogMiB9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHROb3RpZmljYXRpb25zLm5vdGlmeShWaWxsYWdlLCBfKFwidGhlIHN0cmFuZ2VyIGlzIHN0YW5kaW5nIGJ5IHRoZSBmaXJlLiBzaGUgc2F5cyBzaGUgY2FuIGhlbHAuIHNheXMgc2hlIGJ1aWxkcyB0aGluZ3MuXCIpKTtcclxuXHRcdH1cclxuXHJcblx0XHRFbmdpbmUubW92ZVN0b3Jlc1ZpZXcobnVsbCwgdHJhbnNpdGlvbl9kaWZmKTtcclxuXHJcblx0XHRXZWF0aGVyLmluaXRpYXRlV2VhdGhlcihWaWxsYWdlLmF2YWlsYWJsZVdlYXRoZXIsICd2aWxsYWdlJyk7XHJcblx0fSxcclxuXHRcclxuXHRUZW1wRW51bToge1xyXG5cdFx0ZnJvbUludDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdFx0Zm9yKHZhciBrIGluIHRoaXMpIHtcclxuXHRcdFx0XHRpZih0eXBlb2YgdGhpc1trXS52YWx1ZSAhPSAndW5kZWZpbmVkJyAmJiB0aGlzW2tdLnZhbHVlID09IHZhbHVlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpc1trXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9LFxyXG5cdFx0RnJlZXppbmc6IHsgdmFsdWU6IDAsIHRleHQ6IF8oJ2ZyZWV6aW5nJykgfSxcclxuXHRcdENvbGQ6IHsgdmFsdWU6IDEsIHRleHQ6IF8oJ2NvbGQnKSB9LFxyXG5cdFx0TWlsZDogeyB2YWx1ZTogMiwgdGV4dDogXygnbWlsZCcpIH0sXHJcblx0XHRXYXJtOiB7IHZhbHVlOiAzLCB0ZXh0OiBfKCd3YXJtJykgfSxcclxuXHRcdEhvdDogeyB2YWx1ZTogNCwgdGV4dDogXygnaG90JykgfVxyXG5cdH0sXHJcblx0XHJcblx0RmlyZUVudW06IHtcclxuXHRcdGZyb21JbnQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRcdGZvcih2YXIgayBpbiB0aGlzKSB7XHJcblx0XHRcdFx0aWYodHlwZW9mIHRoaXNba10udmFsdWUgIT0gJ3VuZGVmaW5lZCcgJiYgdGhpc1trXS52YWx1ZSA9PSB2YWx1ZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXNba107XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fSxcclxuXHRcdERlYWQ6IHsgdmFsdWU6IDAsIHRleHQ6IF8oJ2RlYWQnKSB9LFxyXG5cdFx0U21vbGRlcmluZzogeyB2YWx1ZTogMSwgdGV4dDogXygnc21vbGRlcmluZycpIH0sXHJcblx0XHRGbGlja2VyaW5nOiB7IHZhbHVlOiAyLCB0ZXh0OiBfKCdmbGlja2VyaW5nJykgfSxcclxuXHRcdEJ1cm5pbmc6IHsgdmFsdWU6IDMsIHRleHQ6IF8oJ2J1cm5pbmcnKSB9LFxyXG5cdFx0Um9hcmluZzogeyB2YWx1ZTogNCwgdGV4dDogXygncm9hcmluZycpIH1cclxuXHR9LFxyXG5cdFxyXG5cdHNldFRpdGxlOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0aXRsZSA9IF8oXCJUaGUgVmlsbGFnZVwiKTtcclxuXHRcdGlmKEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gdGhpcykge1xyXG5cdFx0XHRkb2N1bWVudC50aXRsZSA9IHRpdGxlO1xyXG5cdFx0fVxyXG5cdFx0JCgnZGl2I2xvY2F0aW9uX3ZpbGxhZ2UnKS50ZXh0KHRpdGxlKTtcclxuXHR9LFxyXG5cdFxyXG5cdHVwZGF0ZUJ1dHRvbjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgbGlnaHQgPSAkKCcjbGlnaHRCdXR0b24uYnV0dG9uJyk7XHJcblx0XHR2YXIgc3Rva2UgPSAkKCcjc3Rva2VCdXR0b24uYnV0dG9uJyk7XHJcblx0XHRpZigkU00uZ2V0KCdnYW1lLmZpcmUudmFsdWUnKSA9PSBWaWxsYWdlLkZpcmVFbnVtLkRlYWQudmFsdWUgJiYgc3Rva2UuY3NzKCdkaXNwbGF5JykgIT0gJ25vbmUnKSB7XHJcblx0XHRcdHN0b2tlLmhpZGUoKTtcclxuXHRcdFx0bGlnaHQuc2hvdygpO1xyXG5cdFx0XHRpZihzdG9rZS5oYXNDbGFzcygnZGlzYWJsZWQnKSkge1xyXG5cdFx0XHRcdEJ1dHRvbi5jb29sZG93bihsaWdodCk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZihsaWdodC5jc3MoJ2Rpc3BsYXknKSAhPSAnbm9uZScpIHtcclxuXHRcdFx0c3Rva2Uuc2hvdygpO1xyXG5cdFx0XHRsaWdodC5oaWRlKCk7XHJcblx0XHRcdGlmKGxpZ2h0Lmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XHJcblx0XHRcdFx0QnV0dG9uLmNvb2xkb3duKHN0b2tlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZighJFNNLmdldCgnc3RvcmVzLndvb2QnKSkge1xyXG5cdFx0XHRsaWdodC5hZGRDbGFzcygnZnJlZScpO1xyXG5cdFx0XHRzdG9rZS5hZGRDbGFzcygnZnJlZScpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bGlnaHQucmVtb3ZlQ2xhc3MoJ2ZyZWUnKTtcclxuXHRcdFx0c3Rva2UucmVtb3ZlQ2xhc3MoJ2ZyZWUnKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgbGl6QnV0dG9uID0gJCgnI2xpekJ1dHRvbi5idXR0b24nKTtcclxuXHRcdGlmKCRTTS5nZXQoJ3ZpbGxhZ2UubGl6QWN0aXZlJykpIGxpekJ1dHRvbi5zaG93KCk7XHJcblx0XHR2YXIgYnVpbGRpbmdCdXR0b24gPSAkKCcjbmV3QnVpbGRpbmdCdXR0b24uYnV0dG9uJyk7XHJcblx0XHRpZigkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykpIGJ1aWxkaW5nQnV0dG9uLnNob3coKTtcclxuXHR9LFxyXG5cdFxyXG5cdFxyXG5cdGhhbmRsZVN0YXRlVXBkYXRlczogZnVuY3Rpb24oZSl7XHJcblx0XHRpZihlLmNhdGVnb3J5ID09ICdzdG9yZXMnKXtcclxuXHRcdFx0Ly8gVmlsbGFnZS51cGRhdGVCdWlsZEJ1dHRvbnMoKTtcclxuXHRcdH0gZWxzZSBpZihlLmNhdGVnb3J5ID09ICdpbmNvbWUnKXtcclxuXHRcdH0gZWxzZSBpZihlLnN0YXRlTmFtZS5pbmRleE9mKCdnYW1lLmJ1aWxkaW5ncycpID09PSAwKXtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHR0ZW1wQnVpbGRpbmdNZXNzYWdlOiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0XHRcdHRpdGxlOiBfKCdBIE5ldyBCdWlsZGluZycpLFxyXG5cdFx0XHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnbWFpbicsXHJcblx0XHRcdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRcdFx0XygnVGhpcyBpcyBhIG5ldyBidWlsZGluZy4gVGhlcmUgc2hvdWxkIGJlIHN0dWZmIGluIGl0LCBidXQgdGhpcyBpcyBhIHBsYWNlaG9sZGVyIGZvciBub3cuJyksXHJcblx0XHRcdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdFx0XHQnbGVhdmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0xhbWUnKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcbn07XHJcbiIsImltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi9CdXR0b25cIjtcclxuaW1wb3J0IHsgSXRlbUxpc3QgfSBmcm9tIFwiLi9pdGVtTGlzdFwiO1xyXG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tIFwiLi4vbm90aWZpY2F0aW9uc1wiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgUXVlc3RMb2cgfSBmcm9tIFwiLi9xdWVzdExvZ1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IENoYXJhY3RlciA9IHtcclxuXHRpbnZlbnRvcnk6IHt9LCAvLyBkaWN0aW9uYXJ5IHVzaW5nIGl0ZW0gbmFtZSBhcyBrZXlcclxuXHRxdWVzdFN0YXR1czoge30sIC8vIGRpY3Rpb25hcnkgdXNpbmcgcXVlc3QgbmFtZSBhcyBrZXksIGFuZCBpbnRlZ2VyIHF1ZXN0IHBoYXNlIGFzIHZhbHVlXHJcblx0ZXF1aXBwZWRJdGVtczoge1xyXG5cdFx0Ly8gc3RlYWxpbmcgdGhlIEtvTCBzdHlsZSBmb3Igbm93LCB3ZSdsbCBzZWUgaWYgSSBuZWVkIHNvbWV0aGluZ1xyXG5cdFx0Ly8gdGhhdCBmaXRzIHRoZSBnYW1lIGJldHRlciBhcyB3ZSBnb1xyXG5cdFx0aGVhZDogbnVsbCxcclxuXHRcdHRvcnNvOiBudWxsLFxyXG5cdFx0cGFudHM6IG51bGwsXHJcblx0XHQvLyBubyB3ZWFwb24sIHRyeSB0byBzZWUgaG93IGZhciB3ZSBjYW4gZ2V0IGluIHRoaXMgZ2FtZSB3aXRob3V0IGZvY3VzaW5nIG9uIGNvbWJhdFxyXG5cdFx0YWNjZXNzb3J5MTogbnVsbCxcclxuXHRcdGFjY2Vzc29yeTI6IG51bGwsXHJcblx0XHRhY2Nlc3NvcnkzOiBudWxsLFxyXG5cdH0sXHJcblxyXG5cdC8vIHN0YXRzIGJlZm9yZSBhbnkgbW9kaWZpZXJzIGZyb20gZ2VhciBvciB3aGF0ZXZlciBlbHNlIGFyZSBhcHBsaWVkXHJcblx0cmF3U3RhdHM6IHtcclxuXHRcdCdTcGVlZCc6IDUsXHJcblx0XHQnUGVyY2VwdGlvbic6IDUsXHJcblx0XHQnUmVzaWxpZW5jZSc6IDUsXHJcblx0XHQnSW5nZW51aXR5JzogNSxcclxuXHRcdCdUb3VnaG5lc3MnOiA1XHJcblx0fSxcclxuXHJcblx0Ly8gcGVya3MgZ2l2ZW4gYnkgaXRlbXMsIGNoYXJhY3RlciBjaG9pY2VzLCBkaXZpbmUgcHJvdmVuYW5jZSwgZXRjLlxyXG5cdHBlcmtzOiB7IH0sXHJcblx0XHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblx0XHRcclxuXHRcdC8vIGNyZWF0ZSB0aGUgY2hhcmFjdGVyIGJveFxyXG5cdFx0Y29uc3QgZWxlbSA9ICQoJzxkaXY+JykuYXR0cih7XHJcblx0XHRcdGlkOiAnY2hhcmFjdGVyJyxcclxuXHRcdFx0Y2xhc3NOYW1lOiAnY2hhcmFjdGVyJ1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdGVsZW0uYXBwZW5kVG8oJ2RpdiN3cmFwcGVyJyk7XHJcblxyXG5cdFx0Ly8gd3JpdGUgcmF3U3RhdHMgdG8gJFNNXHJcblx0XHQvLyBOT1RFOiBuZXZlciB3cml0ZSBkZXJpdmVkIHN0YXRzIHRvICRTTSwgYW5kIG5ldmVyIGFjY2VzcyByYXcgc3RhdHMgZGlyZWN0bHkhXHJcblx0XHQvLyBkb2luZyBzbyB3aWxsIGludHJvZHVjZSBvcHBvcnR1bml0aWVzIHRvIG1lc3MgdXAgc3RhdHMgUEVSTUFORU5UTFlcclxuICAgICAgICBpZiAoISRTTS5nZXQoJ2NoYXJhY3Rlci5yYXdzdGF0cycpKSB7XHJcbiAgICAgICAgICAgICRTTS5zZXQoJ2NoYXJhY3Rlci5yYXdzdGF0cycsIENoYXJhY3Rlci5yYXdTdGF0cyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHRcdFx0Q2hhcmFjdGVyLnJhd1N0YXRzID0gJFNNLmdldCgnY2hhcmFjdGVyLnJhd1N0YXRzJykgYXMgYW55O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghJFNNLmdldCgnY2hhcmFjdGVyLnBlcmtzJykpIHtcclxuICAgICAgICAgICAgJFNNLnNldCgnY2hhcmFjdGVyLnBlcmtzJywgQ2hhcmFjdGVyLnBlcmtzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cdFx0XHRDaGFyYWN0ZXIucGVya3MgPSAkU00uZ2V0KCdjaGFyYWN0ZXIucGVya3MnKSBhcyBhbnk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCEkU00uZ2V0KCdjaGFyYWN0ZXIuaW52ZW50b3J5JykpIHtcclxuICAgICAgICAgICAgJFNNLnNldCgnY2hhcmFjdGVyLmludmVudG9yeScsIENoYXJhY3Rlci5pbnZlbnRvcnkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5pbnZlbnRvcnkgPSAkU00uZ2V0KCdjaGFyYWN0ZXIuaW52ZW50b3J5JykgYXMgYW55O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghJFNNLmdldCgnY2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMnKSkge1xyXG4gICAgICAgICAgICAkU00uc2V0KCdjaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcycsIENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cdFx0XHRDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcyA9ICRTTS5nZXQoJ2NoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zJykgYXMgYW55O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghJFNNLmdldCgnY2hhcmFjdGVyLnF1ZXN0U3RhdHVzJykpIHtcclxuICAgICAgICAgICAgJFNNLnNldCgnY2hhcmFjdGVyLnF1ZXN0U3RhdHVzJywgQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cdFx0XHRDaGFyYWN0ZXIucXVlc3RTdGF0dXMgPSAkU00uZ2V0KCdjaGFyYWN0ZXIucXVlc3RTdGF0dXMnKSBhcyBhbnk7XHJcblx0XHR9XHJcblxyXG4gICAgICAgICQoJzxkaXY+JykudGV4dCgnQ2hhcmFjdGVyJykuYXR0cignaWQnLCAndGl0bGUnKS5hcHBlbmRUbygnZGl2I2NoYXJhY3RlcicpO1xyXG5cclxuXHRcdC8vIFRPRE86IHJlcGxhY2UgdGhpcyB3aXRoIGRlcml2ZWQgc3RhdHNcclxuICAgICAgICBmb3IodmFyIHN0YXQgaW4gJFNNLmdldCgnY2hhcmFjdGVyLnJhd3N0YXRzJykgYXMgYW55KSB7XHJcbiAgICAgICAgICAgICQoJzxkaXY+JykudGV4dChzdGF0ICsgJzogJyArICRTTS5nZXQoJ2NoYXJhY3Rlci5yYXdzdGF0cy4nICsgc3RhdCkpLmFwcGVuZFRvKCdkaXYjY2hhcmFjdGVyJyk7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnYnV0dG9ucycpLmNzcyhcIm1hcmdpbi10b3BcIiwgXCIyMHB4XCIpLmFwcGVuZFRvKCdkaXYjY2hhcmFjdGVyJyk7XHJcblx0XHR2YXIgaW52ZW50b3J5QnV0dG9uID0gQnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiBcImludmVudG9yeVwiLFxyXG5cdFx0XHR0ZXh0OiBcIkludmVudG9yeVwiLFxyXG5cdFx0XHRjbGljazogQ2hhcmFjdGVyLm9wZW5JbnZlbnRvcnlcclxuXHRcdH0pLmFwcGVuZFRvKCQoJyNidXR0b25zJywgJ2RpdiNjaGFyYWN0ZXInKSk7XHJcblx0XHRcclxuXHRcdHZhciBxdWVzdExvZ0J1dHRvbiA9IEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogXCJxdWVzdExvZ1wiLFxyXG5cdFx0XHR0ZXh0OiBcIlF1ZXN0IExvZ1wiLFxyXG5cdFx0XHRjbGljazogQ2hhcmFjdGVyLm9wZW5RdWVzdExvZ1xyXG5cdFx0fSkuYXBwZW5kVG8oJCgnI2J1dHRvbnMnLCAnZGl2I2NoYXJhY3RlcicpKTtcclxuXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHR3aW5kb3cuQ2hhcmFjdGVyID0gdGhpcztcclxuXHR9LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHt9LCAvLyBOb3RoaW5nIGZvciBub3dcclxuXHRcclxuXHRlbGVtOiBudWxsLFxyXG5cclxuXHRpbnZlbnRvcnlEaXNwbGF5OiBudWxsIGFzIGFueSxcclxuXHRxdWVzdExvZ0Rpc3BsYXk6IG51bGwgYXMgYW55LFxyXG5cclxuXHRvcGVuSW52ZW50b3J5OiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIGNyZWF0aW5nIGEgaGFuZGxlIGZvciBsYXRlciBhY2Nlc3MsIHN1Y2ggYXMgY2xvc2luZyBpbnZlbnRvcnlcclxuXHRcdENoYXJhY3Rlci5pbnZlbnRvcnlEaXNwbGF5ID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdpbnZlbnRvcnknKS5hZGRDbGFzcygnZXZlbnRQYW5lbCcpLmNzcygnb3BhY2l0eScsICcwJyk7XHJcblx0XHR2YXIgaW52ZW50b3J5RGlzcGxheSA9IENoYXJhY3Rlci5pbnZlbnRvcnlEaXNwbGF5O1xyXG5cdFx0Q2hhcmFjdGVyLmludmVudG9yeURpc3BsYXlcclxuXHRcdC8vIHNldCB1cCBjbGljayBhbmQgaG92ZXIgaGFuZGxlcnMgZm9yIGludmVudG9yeSBpdGVtc1xyXG5cdFx0Lm9uKFwiY2xpY2tcIiwgXCIjaXRlbVwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0Q2hhcmFjdGVyLnVzZUludmVudG9yeUl0ZW0oJCh0aGlzKS5kYXRhKFwibmFtZVwiKSk7XHJcblx0XHRcdENoYXJhY3Rlci5jbG9zZUludmVudG9yeSgpO1xyXG5cdFx0fSkub24oXCJtb3VzZWVudGVyXCIsIFwiI2l0ZW1cIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciB0b29sdGlwID0gJChcIjxkaXYgaWQ9J3Rvb2x0aXAnIGNsYXNzPSd0b29sdGlwJz5cIiArIEl0ZW1MaXN0WyQodGhpcykuZGF0YShcIm5hbWVcIildLnRleHQgKyBcIjwvZGl2PlwiKVxyXG5cdFx0XHQuYXR0cignZGF0YS1uYW1lJywgaXRlbSk7XHJcblx0XHRcdHRvb2x0aXAuYXBwZW5kVG8oJCh0aGlzKSk7XHJcblx0XHR9KS5vbihcIm1vdXNlbGVhdmVcIiwgXCIjaXRlbVwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0JChcIiN0b29sdGlwXCIsIFwiI1wiICsgJCh0aGlzKS5kYXRhKFwibmFtZVwiKSkuZmFkZU91dCgpLnJlbW92ZSgpO1xyXG5cdFx0fSk7XHJcblx0XHQkKCc8ZGl2PicpLmFkZENsYXNzKCdldmVudFRpdGxlJykudGV4dCgnSW52ZW50b3J5JykuYXBwZW5kVG8oaW52ZW50b3J5RGlzcGxheSk7XHJcblx0XHR2YXIgaW52ZW50b3J5RGVzYyA9ICQoJzxkaXY+JykudGV4dChcIkNsaWNrIHRoaW5ncyBpbiB0aGUgbGlzdCB0byB1c2UgdGhlbS5cIilcclxuXHRcdFx0LmhvdmVyKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciB0b29sdGlwID0gJChcIjxkaXYgaWQ9J3Rvb2x0aXAnIGNsYXNzPSd0b29sdGlwJz5cIiArIFwiTm90IHRoaXMsIHRob3VnaC5cIiArIFwiPC9kaXY+XCIpO1xyXG4gICAgXHRcdFx0dG9vbHRpcC5hcHBlbmRUbyhpbnZlbnRvcnlEZXNjKTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JChcIiN0b29sdGlwXCIpLmZhZGVPdXQoKS5yZW1vdmUoKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0Lm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXyhcIkkgYmV0IHlvdSB0aGluayB5b3UncmUgcHJldHR5IGZ1bm55LCBodWg/IENsaWNraW5nIHRoZSB0aGluZyBJIHNhaWQgd2Fzbid0IGNsaWNrYWJsZT9cIikpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQuY3NzKFwibWFyZ2luLWJvdHRvbVwiLCBcIjIwcHhcIilcclxuXHRcdFx0LmFwcGVuZFRvKGludmVudG9yeURpc3BsYXkpO1xyXG5cdFx0XHJcblx0XHRmb3IodmFyIGl0ZW0gaW4gQ2hhcmFjdGVyLmludmVudG9yeSkge1xyXG5cdFx0XHQvLyBtYWtlIHRoZSBpbnZlbnRvcnkgY291bnQgbG9vayBhIGJpdCBuaWNlclxyXG5cdFx0XHR2YXIgaW52ZW50b3J5RWxlbSA9ICQoJzxkaXY+JylcclxuXHRcdFx0LmF0dHIoJ2lkJywgJ2l0ZW0nKVxyXG5cdFx0XHQuYXR0cignZGF0YS1uYW1lJywgaXRlbSlcclxuXHRcdFx0LnRleHQoSXRlbUxpc3RbaXRlbV0ubmFtZSAgKyAnICAoeCcgKyBDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dLnRvU3RyaW5nKCkgKyAnKScpXHJcblx0XHRcdC5hcHBlbmRUbyhpbnZlbnRvcnlEaXNwbGF5KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBUT0RPOiBtYWtlIHRoaXMgQ1NTIGFuIGFjdHVhbCBjbGFzcyBzb21ld2hlcmUsIEknbSBzdXJlIEknbGwgbmVlZCBpdCBhZ2FpblxyXG5cdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdidXR0b25zJykuY3NzKFwibWFyZ2luLXRvcFwiLCBcIjIwcHhcIikuYXBwZW5kVG8oaW52ZW50b3J5RGlzcGxheSk7XHJcblx0XHR2YXIgYiA9IFxyXG5cdFx0Ly9uZXcgXHJcblx0XHRCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6IFwiY2xvc2VJbnZlbnRvcnlcIixcclxuXHRcdFx0dGV4dDogXCJDbG9zZVwiLFxyXG5cdFx0XHRjbGljazogQ2hhcmFjdGVyLmNsb3NlSW52ZW50b3J5XHJcblx0XHR9KS5hcHBlbmRUbygkKCcjYnV0dG9ucycsIGludmVudG9yeURpc3BsYXkpKTtcclxuXHRcdCQoJ2RpdiN3cmFwcGVyJykuYXBwZW5kKGludmVudG9yeURpc3BsYXkpO1xyXG5cdFx0aW52ZW50b3J5RGlzcGxheS5hbmltYXRlKHtvcGFjaXR5OiAxfSwgRXZlbnRzLl9QQU5FTF9GQURFLCAnbGluZWFyJyk7XHJcblx0fSxcclxuXHJcblx0Y2xvc2VJbnZlbnRvcnk6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Q2hhcmFjdGVyLmludmVudG9yeURpc3BsYXkuZW1wdHkoKTtcclxuXHRcdENoYXJhY3Rlci5pbnZlbnRvcnlEaXNwbGF5LnJlbW92ZSgpO1xyXG5cdH0sXHJcblxyXG5cdGFkZFRvSW52ZW50b3J5OiBmdW5jdGlvbihpdGVtLCBhbW91bnQ9MSkge1xyXG5cdFx0aWYgKENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0pIHtcclxuXHRcdFx0Q2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSArPSBhbW91bnQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dID0gYW1vdW50O1xyXG5cdFx0fVxyXG5cclxuXHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiQWRkZWQgXCIgKyBJdGVtTGlzdFtpdGVtXS5uYW1lICsgXCIgdG8gaW52ZW50b3J5LlwiKVxyXG5cdFx0JFNNLnNldCgnaW52ZW50b3J5JywgQ2hhcmFjdGVyLmludmVudG9yeSk7XHJcblx0fSxcclxuXHJcblxyXG5cdHJlbW92ZUZyb21JbnZlbnRvcnk6IGZ1bmN0aW9uKGl0ZW0sIGFtb3VudD0xKSB7XHJcblx0XHRpZiAoQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSkgQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSAtPSBhbW91bnQ7XHJcblx0XHRpZiAoQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSA8IDEpIHtcclxuXHRcdFx0ZGVsZXRlIENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV07XHJcblx0XHR9XHJcblxyXG5cdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJSZW1vdmVkIFwiICsgSXRlbUxpc3RbaXRlbV0ubmFtZSArIFwiIGZyb20gaW52ZW50b3J5LlwiKVxyXG5cdFx0JFNNLnNldCgnaW52ZW50b3J5JywgQ2hhcmFjdGVyLmludmVudG9yeSk7XHJcblx0fSxcclxuXHJcblx0dXNlSW52ZW50b3J5SXRlbTogZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0aWYgKENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0gJiYgQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSA+IDApIHtcclxuXHRcdFx0Ly8gdXNlIHRoZSBlZmZlY3QgaW4gdGhlIGludmVudG9yeTsganVzdCBpbiBjYXNlIGEgbmFtZSBtYXRjaGVzIGJ1dCB0aGUgZWZmZWN0XHJcblx0XHRcdC8vIGRvZXMgbm90LCBhc3N1bWUgdGhlIGludmVudG9yeSBpdGVtIGlzIHRoZSBzb3VyY2Ugb2YgdHJ1dGhcclxuXHRcdFx0SXRlbUxpc3RbaXRlbV0ub25Vc2UoKTtcclxuXHRcdFx0aWYgKHR5cGVvZihJdGVtTGlzdFtpdGVtXS5kZXN0cm95T25Vc2UpID09IFwiZnVuY3Rpb25cIiAmJiBJdGVtTGlzdFtpdGVtXS5kZXN0cm95T25Vc2UoKSkge1xyXG5cdFx0XHRcdENoYXJhY3Rlci5yZW1vdmVGcm9tSW52ZW50b3J5KGl0ZW0pO1xyXG5cdFx0XHR9IGVsc2UgaWYgKEl0ZW1MaXN0W2l0ZW1dLmRlc3Ryb3lPblVzZSkge1xyXG5cdFx0XHRcdENoYXJhY3Rlci5yZW1vdmVGcm9tSW52ZW50b3J5KGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0JFNNLnNldCgnaW52ZW50b3J5JywgQ2hhcmFjdGVyLmludmVudG9yeSk7XHJcblx0fSxcclxuXHJcblx0ZXF1aXBJdGVtOiBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRpZiAoSXRlbUxpc3RbaXRlbV0uc2xvdCAmJiBDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtc1tJdGVtTGlzdFtpdGVtXS5zbG90XSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdENoYXJhY3Rlci5hZGRUb0ludmVudG9yeShDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtc1tJdGVtTGlzdFtpdGVtXS5zbG90XSk7XHJcblx0XHRcdENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zW0l0ZW1MaXN0W2l0ZW1dLnNsb3RdID0gaXRlbTtcclxuXHRcdFx0aWYgKEl0ZW1MaXN0W2l0ZW1dLm9uRXF1aXApIHtcclxuXHRcdFx0XHRJdGVtTGlzdFtpdGVtXS5vbkVxdWlwKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Q2hhcmFjdGVyLmFwcGx5RXF1aXBtZW50RWZmZWN0cygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdCRTTS5zZXQoJ2VxdWlwcGVkSXRlbXMnLCBDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcyk7XHJcblx0XHQkU00uc2V0KCdpbnZlbnRvcnknLCBDaGFyYWN0ZXIuaW52ZW50b3J5KTtcclxuXHR9LFxyXG5cclxuXHRncmFudFBlcms6IGZ1bmN0aW9uKHBlcmspIHtcclxuXHRcdGlmIChDaGFyYWN0ZXIucGVya3NbcGVyay5uYW1lXSkge1xyXG5cdFx0XHRpZihwZXJrLnRpbWVMZWZ0ID4gMCkge1xyXG5cdFx0XHRcdENoYXJhY3Rlci5wZXJrc1twZXJrLm5hbWVdICs9IHBlcmsudGltZUxlZnQ7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5wZXJrc1twZXJrLm5hbWVdID0gcGVyaztcclxuXHRcdH1cclxuXHJcblx0XHRcclxuXHRcdCRTTS5zZXQoJ3BlcmtzJywgQ2hhcmFjdGVyLnBlcmtzKVxyXG5cdH0sXHJcblxyXG5cdG9wZW5RdWVzdExvZzogZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBjcmVhdGluZyBhIGhhbmRsZSBmb3IgbGF0ZXIgYWNjZXNzLCBzdWNoIGFzIGNsb3NpbmcgcXVlc3QgbG9nXHJcblx0XHRDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5ID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdxdWVzdCcpLmFkZENsYXNzKCdldmVudFBhbmVsJykuY3NzKCdvcGFjaXR5JywgJzAnKTtcclxuXHRcdHZhciBxdWVzdExvZ0Rpc3BsYXkgPSBDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5O1xyXG5cdFx0Q2hhcmFjdGVyLnF1ZXN0TG9nRGlzcGxheVxyXG5cdFx0Ly8gc2V0IHVwIGNsaWNrIGFuZCBob3ZlciBoYW5kbGVycyBmb3IgcXVlc3RzXHJcblx0XHQub24oXCJjbGlja1wiLCBcIiNxdWVzdFwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0Q2hhcmFjdGVyLmRpc3BsYXlRdWVzdCgkKHRoaXMpLmRhdGEoXCJuYW1lXCIpKTtcclxuXHRcdH0pO1xyXG5cdFx0JCgnPGRpdj4nKS5hZGRDbGFzcygnZXZlbnRUaXRsZScpLnRleHQoJ1F1ZXN0IExvZycpLmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHR2YXIgcXVlc3RMb2dEZXNjID0gJCgnPGRpdj4nKS50ZXh0KFwiQ2xpY2sgcXVlc3QgbmFtZXMgdG8gc2VlIG1vcmUgaW5mby5cIilcclxuXHRcdFx0LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCIyMHB4XCIpXHJcblx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0XHJcblx0XHRmb3IodmFyIHF1ZXN0IGluIENoYXJhY3Rlci5xdWVzdFN0YXR1cykge1xyXG5cdFx0XHR2YXIgcXVlc3RFbGVtID0gJCgnPGRpdj4nKVxyXG5cdFx0XHQuYXR0cignaWQnLCBcInF1ZXN0XCIpXHJcblx0XHRcdC5hdHRyKCdkYXRhLW5hbWUnLCBxdWVzdClcclxuXHRcdFx0LnRleHQoUXVlc3RMb2dbcXVlc3RdLm5hbWUpXHJcblx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0XHRpZiAoQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW3F1ZXN0XSA9PSAtMSkge1xyXG5cdFx0XHRcdHF1ZXN0RWxlbVxyXG5cdFx0XHRcdC8vIEkgd2FudCB0aGlzIHRvIGJlIG5vdCBzdHJ1Y2sgdGhyb3VnaCwgYnV0IHRoYXQncyB0b28gYW5ub3lpbmcgdG8gd29ycnlcclxuXHRcdFx0XHQvLyBhYm91dCByaWdodCBub3dcclxuXHRcdFx0XHQvLyAucHJlcGVuZChcIkRPTkUgXCIpXHJcblx0XHRcdFx0LndyYXAoXCI8c3RyaWtlPlwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFRPRE86IG1ha2UgdGhpcyBDU1MgYW4gYWN0dWFsIGNsYXNzIHNvbWV3aGVyZSwgSSdtIHN1cmUgSSdsbCBuZWVkIGl0IGFnYWluXHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2J1dHRvbnMnKS5jc3MoXCJtYXJnaW4tdG9wXCIsIFwiMjBweFwiKS5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0dmFyIGIgPSBCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6IFwiY2xvc2VRdWVzdExvZ1wiLFxyXG5cdFx0XHR0ZXh0OiBcIkNsb3NlXCIsXHJcblx0XHRcdGNsaWNrOiBDaGFyYWN0ZXIuY2xvc2VRdWVzdExvZ1xyXG5cdFx0fSkuYXBwZW5kVG8oJCgnI2J1dHRvbnMnLCBxdWVzdExvZ0Rpc3BsYXkpKTtcclxuXHRcdCQoJ2RpdiN3cmFwcGVyJykuYXBwZW5kKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHRxdWVzdExvZ0Rpc3BsYXkuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIEV2ZW50cy5fUEFORUxfRkFERSwgJ2xpbmVhcicpO1xyXG5cdH0sXHJcblxyXG5cdGRpc3BsYXlRdWVzdDogZnVuY3Rpb24ocXVlc3Q6IHN0cmluZykge1xyXG5cdFx0Y29uc3QgcXVlc3RMb2dEaXNwbGF5ID0gQ2hhcmFjdGVyLnF1ZXN0TG9nRGlzcGxheTtcclxuXHRcdHF1ZXN0TG9nRGlzcGxheS5lbXB0eSgpO1xyXG5cdFx0Y29uc3QgY3VycmVudFF1ZXN0ID0gUXVlc3RMb2dbcXVlc3RdO1xyXG5cclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAncXVlc3QnKS5hZGRDbGFzcygnZXZlbnRQYW5lbCcpLmNzcygnb3BhY2l0eScsICcwJyk7XHJcblx0XHQkKCc8ZGl2PicpLmFkZENsYXNzKCdldmVudFRpdGxlJykudGV4dChjdXJyZW50UXVlc3QubmFtZSkuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHJcblx0XHR2YXIgcXVlc3RMb2dEZXNjID0gJCgnPGRpdj4nKS50ZXh0KGN1cnJlbnRRdWVzdC5sb2dEZXNjcmlwdGlvbilcclxuXHRcdFx0LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCIyMHB4XCIpXHJcblx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cclxuXHRcdGlmIChDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdIGFzIG51bWJlciA9PSAtMSkge1xyXG5cdFx0XHR2YXIgcGhhc2VEZXNjID0gJCgnPGRpdj4nKS50ZXh0KFwiVGhpcyBxdWVzdCBpcyBjb21wbGV0ZSFcIilcclxuXHRcdFx0LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCIxMHB4XCIpXHJcblx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDw9IChDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdIGFzIG51bWJlcik7IGkrKykge1xyXG5cdFx0XHR2YXIgcGhhc2VEZXNjID0gJCgnPGRpdj4nKS50ZXh0KGN1cnJlbnRRdWVzdC5waGFzZXNbaV0uZGVzY3JpcHRpb24pXHJcblx0XHRcdC5jc3MoXCJtYXJnaW4tYm90dG9tXCIsIFwiMTBweFwiKVxyXG5cdFx0XHQuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHRcdFx0dmFyIGNvbXBsZXRlID0gdHJ1ZTtcclxuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBPYmplY3Qua2V5cyhjdXJyZW50UXVlc3QucGhhc2VzW2ldLnJlcXVpcmVtZW50cykubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHR2YXIgcmVxdWlyZW1lbnRzRGVzYyA9ICQoJzxkaXY+JykudGV4dChjdXJyZW50UXVlc3QucGhhc2VzW2ldLnJlcXVpcmVtZW50c1tqXS5yZW5kZXJSZXF1aXJlbWVudCgpKVxyXG5cdFx0XHRcdFx0LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCIyMHB4XCIpXHJcblx0XHRcdFx0XHQuY3NzKFwibWFyZ2luLWxlZnRcIiwgXCIyMHB4XCIpXHJcblx0XHRcdFx0XHQuY3NzKCdmb250LXN0eWxlJywgJ2l0YWxpYycpXHJcblx0XHRcdFx0XHQuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHRcdFx0XHRpZiAoIWN1cnJlbnRRdWVzdC5waGFzZXNbaV0ucmVxdWlyZW1lbnRzW2pdLmlzQ29tcGxldGUoKSkgY29tcGxldGUgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoY29tcGxldGUpIHtcclxuXHRcdFx0XHRwaGFzZURlc2Mud3JhcChcIjxzdHJpa2U+XCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVE9ETzogbWFrZSB0aGlzIENTUyBhbiBhY3R1YWwgY2xhc3Mgc29tZXdoZXJlLCBJJ20gc3VyZSBJJ2xsIG5lZWQgaXQgYWdhaW5cclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnYnV0dG9ucycpLmNzcyhcIm1hcmdpbi10b3BcIiwgXCIyMHB4XCIpLmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblxyXG5cdFx0dmFyIGIgPSBCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6IFwiYmFja1RvUXVlc3RMb2dcIixcclxuXHRcdFx0dGV4dDogXCJCYWNrIHRvIFF1ZXN0IExvZ1wiLFxyXG5cdFx0XHRjbGljazogQ2hhcmFjdGVyLmJhY2tUb1F1ZXN0TG9nXHJcblx0XHR9KS5hcHBlbmRUbygkKCcjYnV0dG9ucycsIHF1ZXN0TG9nRGlzcGxheSkpO1xyXG5cclxuXHRcdHZhciBiID0gQnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiBcImNsb3NlUXVlc3RMb2dcIixcclxuXHRcdFx0dGV4dDogXCJDbG9zZVwiLFxyXG5cdFx0XHRjbGljazogQ2hhcmFjdGVyLmNsb3NlUXVlc3RMb2dcclxuXHRcdH0pLmFwcGVuZFRvKCQoJyNidXR0b25zJywgcXVlc3RMb2dEaXNwbGF5KSk7XHJcblx0fSxcclxuXHJcblx0Y2xvc2VRdWVzdExvZzogZnVuY3Rpb24oKSB7XHJcblx0XHRDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5LmVtcHR5KCk7XHJcblx0XHRDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5LnJlbW92ZSgpO1xyXG5cdH0sXHJcblxyXG5cdGJhY2tUb1F1ZXN0TG9nOiBmdW5jdGlvbigpIHtcclxuXHRcdENoYXJhY3Rlci5jbG9zZVF1ZXN0TG9nKCk7XHJcblx0XHRDaGFyYWN0ZXIub3BlblF1ZXN0TG9nKCk7XHJcblx0fSxcclxuXHJcblx0c2V0UXVlc3RTdGF0dXM6IGZ1bmN0aW9uKHF1ZXN0LCBwaGFzZSkge1xyXG5cdFx0Ly8gbWlnaHQgYmUgYSBnb29kIGlkZWEgdG8gY2hlY2sgZm9yIGxpbmVhciBxdWVzdCBwcm9ncmVzc2lvbiBoZXJlP1xyXG5cdFx0aWYgKFF1ZXN0TG9nW3F1ZXN0XSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdENoYXJhY3Rlci5xdWVzdFN0YXR1c1txdWVzdF0gPSBwaGFzZTtcclxuXHJcblx0XHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiUXVlc3QgTG9nIHVwZGF0ZWQuXCIpO1xyXG5cdFx0XHQkU00uc2V0KCdxdWVzdFN0YXR1cycsIENoYXJhY3Rlci5xdWVzdFN0YXR1cyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Y2hlY2tRdWVzdFN0YXR1czogZnVuY3Rpb24ocXVlc3QpIHtcclxuXHRcdGNvbnN0IGN1cnJlbnRQaGFzZSA9IFF1ZXN0TG9nW3F1ZXN0XS5waGFzZXNbQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW3F1ZXN0XV07XHJcblxyXG5cdFx0aWYgKGN1cnJlbnRQaGFzZSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG5cdFx0dmFyIGNvbXBsZXRlID0gdHJ1ZTtcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgT2JqZWN0LmtleXMoY3VycmVudFBoYXNlLnJlcXVpcmVtZW50cykubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKCFjdXJyZW50UGhhc2UucmVxdWlyZW1lbnRzW2ldLmlzQ29tcGxldGUoKSlcclxuXHRcdFx0XHRjb21wbGV0ZSA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGlmIHRoZXJlIGlzIGEgbmV4dCBwaGFzZSwgc2V0IHF1ZXN0U3RhdHVzIHRvIGl0XHJcblx0XHRpZiAoUXVlc3RMb2dbcXVlc3RdLnBoYXNlc1tDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdICsgMV0gIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdICs9IDE7XHJcblx0XHR9IGVsc2UgeyAvLyBlbHNlIHNldCBpdCB0byBjb21wbGV0ZVxyXG5cdFx0XHRDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdID0gLTE7XHJcblx0XHR9XHJcblxyXG5cdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJRdWVzdCBMb2cgdXBkYXRlZC5cIik7XHJcblx0XHQkU00uc2V0KCdxdWVzdFN0YXR1cycsIENoYXJhY3Rlci5xdWVzdFN0YXR1cyk7XHJcblx0fSxcclxuXHJcblx0Ly8gYXBwbHkgZXF1aXBtZW50IGVmZmVjdHMsIHdoaWNoIHNob3VsZCBhbGwgY2hlY2sgYWdhaW5zdCAkU00gc3RhdGUgdmFyaWFibGVzO1xyXG5cdC8vIHRoaXMgc2hvdWxkIGJlIGNhbGxlZCBvbiBiYXNpY2FsbHkgZXZlcnkgcGxheWVyIGFjdGlvbiB3aGVyZSBhIHBpZWNlIG9mIGdlYXJcclxuXHQvLyB3b3VsZCBkbyBzb21ldGhpbmcgb3IgY2hhbmdlIGFuIG91dGNvbWU7IGdpdmUgZXh0cmFQYXJhbXMgdG8gdGhlIGVmZmVjdCBiZWluZyBcclxuXHQvLyBhcHBsaWVkIGZvciBhbnl0aGluZyB0aGF0J3MgcmVsZXZhbnQgdG8gdGhlIGVmZmVjdCBidXQgbm90IGhhbmRsZWQgYnkgJFNNXHJcblx0YXBwbHlFcXVpcG1lbnRFZmZlY3RzOiBmdW5jdGlvbihleHRyYVBhcmFtcz8pIHtcclxuXHRcdGZvciAoY29uc3QgaXRlbSBpbiBDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcykge1xyXG5cdFx0XHRpZiAoSXRlbUxpc3RbaXRlbV0uZWZmZWN0cykge1xyXG5cdFx0XHRcdGZvciAoY29uc3QgZWZmZWN0IGluIEl0ZW1MaXN0W2l0ZW1dLmVmZmVjdHMpIHtcclxuXHRcdFx0XHRcdC8vIE5PVEU6IGN1cnJlbnRseSB0aGlzIGlzIGdvb2QgZm9yIGFwcGx5aW5nIHBlcmtzIGFuZCBOb3RpZnlpbmc7XHJcblx0XHRcdFx0XHQvLyBhcmUgdGhlcmUgb3RoZXIgc2l0dWF0aW9ucyB3aGVyZSB3ZSdkIHdhbnQgdG8gYXBwbHkgZWZmZWN0cyxcclxuXHRcdFx0XHRcdC8vIG9yIGNhbiB3ZSBjb3ZlciBiYXNpY2FsbHkgZXZlcnkgY2FzZSB2aWEgdGhvc2UgdGhpbmdzP1xyXG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdFx0aWYgKGVmZmVjdC5pc0FjdGl2ZSAmJiBlZmZlY3QuaXNBY3RpdmUoZXh0cmFQYXJhbXMpKSBlZmZlY3QuYXBwbHkoZXh0cmFQYXJhbXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8vIGdldCBzdGF0cyBhZnRlciBhcHBseWluZyBhbGwgZXF1aXBtZW50IGJvbnVzZXMsIHBlcmtzLCBldGMuXHJcblx0Z2V0RGVyaXZlZFN0YXRzOiBmdW5jdGlvbigpIHtcclxuXHRcdGNvbnN0IGRlcml2ZWRTdGF0cyA9IHN0cnVjdHVyZWRDbG9uZShDaGFyYWN0ZXIucmF3U3RhdHMpO1xyXG5cdFx0Zm9yIChjb25zdCBpdGVtIGluIENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zKSB7XHJcblx0XHRcdGlmIChJdGVtTGlzdFtpdGVtXS5zdGF0Qm9udXNlcykge1xyXG5cdFx0XHRcdGZvciAoY29uc3Qgc3RhdCBpbiBPYmplY3Qua2V5cyhJdGVtTGlzdFtpdGVtXS5zdGF0Qm9udXNlcykpIHtcclxuXHRcdFx0XHRcdGlmICh0eXBlb2YgKEl0ZW1MaXN0W2l0ZW1dLnN0YXRCb251c2VzW3N0YXRdID09IFwiZnVuY3Rpb25cIikpIHtcclxuXHRcdFx0XHRcdFx0ZGVyaXZlZFN0YXRzW3N0YXRdICs9IEl0ZW1MaXN0W2l0ZW1dLnN0YXRCb251c2VzW3N0YXRdKCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRkZXJpdmVkU3RhdHNbc3RhdF0gKz0gSXRlbUxpc3RbaXRlbV0uc3RhdEJvbnVzZXNbc3RhdF07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yIChjb25zdCBwZXJrIGluIENoYXJhY3Rlci5wZXJrcykge1xyXG5cdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdGlmIChwZXJrLnN0YXRCb251c2VzKSB7XHJcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdGZvciAoY29uc3Qgc3RhdCBpbiBPYmplY3Qua2V5cyhwZXJrLnN0YXRCb251c2VzKSkge1xyXG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiAocGVyay5zdGF0Qm9udXNlc1tzdGF0XSA9PSBcImZ1bmN0aW9uXCIpKSB7XHJcblx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdFx0XHRcdFx0ZGVyaXZlZFN0YXRzW3N0YXRdICs9IHBlcmsuc3RhdEJvbnVzZXNbc3RhdF0oKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdFx0XHRcdFx0ZGVyaXZlZFN0YXRzW3N0YXRdICs9IHBlcmsuc3RhdEJvbnVzZXNbc3RhdF07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGRlcml2ZWRTdGF0cztcclxuXHR9XHJcbn0iLCIvLyBhbGwgaXRlbXMgZ28gaGVyZSwgc28gdGhhdCBub3RoaW5nIHNpbGx5IGhhcHBlbnMgaW4gdGhlIGV2ZW50IHRoYXQgdGhleSBnZXQgcHV0IGluIExvY2FsIFN0b3JhZ2VcclxuLy8gYXMgcGFydCBvZiB0aGUgc3RhdGUgbWFuYWdlbWVudCBjb2RlOyBwbGVhc2Ugc2F2ZSBpdGVtIG5hbWVzIHRvIHRoZSBpbnZlbnRvcnksIGFuZCB0aGVuIHJlZmVyIHRvIFxyXG4vLyB0aGUgaXRlbSBsaXN0IHZpYSB0aGUgaXRlbSBuYW1lXHJcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4vY2hhcmFjdGVyXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBOb3RpZmljYXRpb25zIH0gZnJvbSBcIi4uL25vdGlmaWNhdGlvbnNcIjtcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gXCIuL2l0ZW1cIjtcclxuXHJcbi8vIERldGFpbHMgZm9yIGFsbCBpbi1nYW1lIGl0ZW1zOyB0aGUgQ2hhcmFjdGVyIGludmVudG9yeSBvbmx5IGhvbGRzIGl0ZW0gSURzXHJcbi8vIGFuZCBhbW91bnRzXHJcbmV4cG9ydCBjb25zdCBJdGVtTGlzdDoge1tpZDogc3RyaW5nXTogSXRlbX0gPSB7XHJcbiAgICBcIkxpei53ZWlyZEJvb2tcIjoge1xyXG4gICAgICAgIG5hbWU6ICdXZWlyZCBCb29rJyxcclxuICAgICAgICBwbHVyYWxOYW1lOiAnV2VpcmQgQm9va3MnLFxyXG4gICAgICAgIHRleHQ6IF8oJ0EgYm9vayB5b3UgZm91bmQgYXQgTGl6XFwncyBwbGFjZS4gU3VwcG9zZWRseSBoYXMgaW5mb3JtYXRpb24gYWJvdXQgQ2hhZHRvcGlhLicpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHsgXHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAgXyhcIkEgQnJpZWYgSGlzdG9yeSBvZiBDaGFkdG9waWFcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKCdUaGlzIGJvb2sgaXMgcHJldHR5IGJvcmluZywgYnV0IHlvdSBtYW5hZ2UgdG8gbGVhcm4gYSBiaXQgbW9yZSBpbiBzcGl0ZSBvZiB5b3VyIHBvb3IgYXR0ZW50aW9uIHNwYW4uJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKCdGb3IgZXhhbXBsZSwgeW91IGxlYXJuIHRoYXQgXCJDaGFkdG9waWFcIiBkb2VzblxcJ3QgaGF2ZSBhIGNhcGl0YWwgXFwnVFxcJy4gVGhhdFxcJ3MgcHJldHR5IGNvb2wsIGh1aD8nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oJy4uLiBXaGF0IHdlcmUgeW91IGRvaW5nIGFnYWluPycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1NvbWV0aGluZyBjb29sZXIgdGhhbiByZWFkaW5nLCBwcm9iYWJseScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiAoKSA9PiBDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoXCJMaXouYm9yaW5nQm9va1wiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IHRydWUsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG5cclxuICAgIFwiTGl6LmJvcmluZ0Jvb2tcIjoge1xyXG4gICAgICAgIG5hbWU6ICdcIkEgQnJpZWYgSGlzdG9yeSBvZiBDaGFkdG9waWFcIicsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ011bHRpcGxlIGNvcGllcyBvZiBcIkEgQnJpZWYgSGlzdG9yeSBvZiBDaGFkdG9waWFcIicsXHJcbiAgICAgICAgdGV4dDogXygnTWFuLCB0aGlzIGJvb2sgaXMgYm9yaW5nLicpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IF8oXCJBIEJyaWVmIFN1bW1hcnkgb2YgYSBCcmllZiBIaXN0b3J5IG9mIENoYWR0b3BpYVwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtfKCdJdFxcJ3Mgc3RpbGwganVzdCBhcyBib3JpbmcgYXMgd2hlbiB5b3UgbGFzdCB0cmllZCB0byByZWFkIGl0LicpXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnRGFuZy4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIFwiU3RyYW5nZXIuc21vb3RoU3RvbmVcIjoge1xyXG4gICAgICAgIG5hbWU6ICdhIHNtb290aCBibGFjayBzdG9uZScsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ3Ntb290aCBibGFjayBzdG9uZXMnLFxyXG4gICAgICAgIHRleHQ6IF8oJ0l0XFwncyB3ZWlyZGx5IGVlcmllJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAoISRTTS5nZXQoJ2tub3dsZWRnZS5TdHJhbmdlci5zbW9vdGhTdG9uZScpKSB7XHJcbiAgICAgICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCAnWW91IGhhdmUgbm8gaWRlYSB3aGF0IHRvIGRvIHdpdGggdGhpcyB0aGluZy4nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEgc21vb3RoIGJsYWNrIHN0b25lXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW18oXCJJJ20gZ2VudWluZWx5IG5vdCBzdXJlIGhvdyB5b3UgZ290IHRvIHRoaXMgZXZlbnQsIGJ1dCBwbGVhc2UgbGV0IG1lIGtub3cgdmlhIEdpdEh1YiBpc3N1ZSwgeW91IGxpdHRsZSBzdGlua2VyLlwiKV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0kgc3dlYXIgdG8gZG8gdGhpcywgYXMgYSByZXNwb25zaWJsZSBjaXRpemVuIG9mIEVhcnRoJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveU9uVXNlOiBmYWxzZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH0sXHJcbiAgICBcIlN0cmFuZ2VyLndyYXBwZWRLbmlmZVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ2Ega25pZmUgd3JhcHBlZCBpbiBjbG90aCcsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ0tuaXZlcyB3cmFwcGVkIGluIHNlcGFyYXRlIGNsb3RocycsXHJcbiAgICAgICAgdGV4dDogXygnTWFuLCBJIGhvcGUgaXRcXCdzIG5vdCBhbGwgbGlrZSwgYmxvb2R5IG9uIHRoZSBibGFkZSBhbmQgc3R1ZmYuJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEga25pZmUgd3JhcHBlZCBpbiBjbG90aFwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtfKFwiWW91IHVud3JhcCB0aGUga25pZmUgY2FyZWZ1bGx5LiBJdCBzZWVtcyB0byBiZSBoaWdobHkgb3JuYW1lbnRlZCwgYW5kIHlvdSBjb3VsZCBwcm9iYWJseSBkbyBzb21lIGNyaW1lcyB3aXRoIGl0LlwiKV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0hlbGwgeWVhaCwgQWRvbGYgTG9vcyBzdHlsZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiAoKSA9PiBDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoXCJTdHJhbmdlci5zaWx2ZXJLbmlmZVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IHRydWUsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgXCJTdHJhbmdlci5zaWx2ZXJLbmlmZVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ2Egc2lsdmVyIGtuaWZlJyxcclxuICAgICAgICBwbHVyYWxOYW1lOiAnc2lsdmVyIGtuaXZlcycsXHJcbiAgICAgICAgdGV4dDogXygnSGlnaGx5IG9ybmFtZW50ZWQnKSxcclxuICAgICAgICBvblVzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBfKFwiQSBzaWx2ZXIga25pZmVcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiT25lIGRheSB5b3UnbGwgYmUgYWJsZSB0byBlcXVpcCB0aGlzLCBidXQgcmlnaHQgbm93IHRoYXQgZnVuY3Rpb25hbGl0eSBpc24ndCBwcmVzZW50LlwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJQbGVhc2UgcG9saXRlbHkgbGVhdmUgdGhlIHByZW1pc2VzIHdpdGhvdXQgYWNrbm93bGVkZ2luZyB0aGlzIG1pc3NpbmcgZmVhdHVyZS5cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnWW91IGdvdCBpdCwgY2hpZWYnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIFwiU3RyYW5nZXIuY2xvdGhCdW5kbGVcIjoge1xyXG4gICAgICAgIG5hbWU6ICdhIGJ1bmRsZSBvZiBjbG90aCcsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ2J1bmRsZXMgb2YgY2xvdGgnLFxyXG4gICAgICAgIHRleHQ6IF8oJ1doYXQgbGllcyB3aXRoaW4/JyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEgYnVuZGxlIG9mIGNsb3RoXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIk9uZSBkYXkgeW91J2xsIGJlIGFibGUgdG8gdXNlIHRoaXMgaXRlbSwgYnV0IHJpZ2h0IG5vdyB0aGF0IGZ1bmN0aW9uYWxpdHkgaXNuJ3QgcHJlc2VudC5cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiUGxlYXNlIHBvbGl0ZWx5IGxlYXZlIHRoZSBwcmVtaXNlcyB3aXRob3V0IGFja25vd2xlZGdpbmcgdGhpcyBtaXNzaW5nIGZlYXR1cmUuXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1lvdSBnb3QgaXQsIGNoaWVmJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveU9uVXNlOiBmYWxzZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH0sXHJcbiAgICBcIlN0cmFuZ2VyLmNvaW5cIjoge1xyXG4gICAgICAgIG5hbWU6ICdBIHN0cmFuZ2UgY29pbicsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ3N0cmFuZ2UgY29pbnMnLFxyXG4gICAgICAgIHRleHQ6IF8oJ0JvdGggc2lkZXMgZGVwaWN0IHRoZSBzYW1lIGltYWdlJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEgc3RyYW5nZSBjb2luXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIk9uZSBkYXkgeW91J2xsIGJlIGFibGUgdG8gdXNlIHRoaXMgaXRlbSwgYnV0IHJpZ2h0IG5vdyB0aGF0IGZ1bmN0aW9uYWxpdHkgaXNuJ3QgcHJlc2VudC5cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiUGxlYXNlIHBvbGl0ZWx5IGxlYXZlIHRoZSBwcmVtaXNlcyB3aXRob3V0IGFja25vd2xlZGdpbmcgdGhpcyBtaXNzaW5nIGZlYXR1cmUuXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1lvdSBnb3QgaXQsIGNoaWVmJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveU9uVXNlOiBmYWxzZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH0sXHJcbiAgICBcIkNhcHRhaW4uc3VwcGxpZXNcIjoge1xyXG4gICAgICAgIG5hbWU6ICdTdXBwbGllcyBmb3IgdGhlIE1heW9yJyxcclxuICAgICAgICB0ZXh0OiAnVGhleVxcJ3JlIGhlYXZ5LCBidXQgbm90IGluIGEgd2F5IHRoYXQgaW1wYWN0cyBnYW1lcGxheScsXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIlN1cHBsaWVzIGZvciB0aGUgTWF5b3JcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiQSBiaWcgYm94IG9mIHN0dWZmIGZvciB0aGUgdmlsbGFnZS4gTG9va3MgbGlrZSByYXcgbWF0ZXJpYWxzLCBtb3N0bHkuXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIkkgc2hvdWxkIHJlYWxseSB0YWtlIHRoaXMgYmFjayB0byB0aGUgTWF5b3IuXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ09rYXknKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIFwib2xkTGFkeS5DYW5keVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ2EgcGllY2Ugb2YgaGFyZCBjYW5keScsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ3BpZWNlcyBvZiBoYXJkIGNhbmR5JyxcclxuICAgICAgICB0ZXh0OiAnR2l2ZW4gdG8geW91IGJ5IGEgbmljZSBvbGQgd29tYW4gaW4gYSBjYXJyaWFnZScsXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCAnWW91IHBvcCB0aGUgaGFyZCBjYW5keSBpbnRvIHlvdXIgbW91dGguIEEgZmV3IG1pbnV0ZXMgJyBcclxuICAgICAgICAgICAgICAgICsgJ2xhdGVyLCBpdFxcJ3MgZ29uZSwgbGVhdmluZyBiZWhpbmQgb25seSBhIG1pbGQgc2Vuc2Ugb2YgZ3VpbHQgYWJvdXQgbm90ICcgXHJcbiAgICAgICAgICAgICAgICArICdjYWxsaW5nIHlvdXIgZ3JhbmRtYSBtb3JlIG9mdGVuLicpXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IHRydWUsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IHRydWVcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tIFwiLi9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IHsgUXVlc3QgfSBmcm9tIFwiLi9xdWVzdFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IFF1ZXN0TG9nOiB7W2lkOiBzdHJpbmddOiBRdWVzdH0gPSB7XHJcbiAgICBcIm1heW9yU3VwcGxpZXNcIjoge1xyXG4gICAgICAgIG5hbWU6IFwiU3VwcGxpZXMgZm9yIHRoZSBNYXlvclwiLFxyXG4gICAgICAgIGxvZ0Rlc2NyaXB0aW9uOiBcIlRoZSBtYXlvciBoYXMgYXNrZWQgeW91IHRvIGdldCBzb21lIHN1cHBsaWVzIGZvciBoaW0gZnJvbSB0aGUgb3V0cG9zdC5cIixcclxuICAgICAgICBwaGFzZXM6IHtcclxuICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiR28gY2hlY2sgb3V0IHRoZSBSb2FkIHRvIHRoZSBPdXRwb3N0IHRvIHNlZSBpZiB5b3UgY2FuIGZpbmQgb3V0IG1vcmVcIixcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVtZW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyUmVxdWlyZW1lbnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRTTS5nZXQoJ3JvYWQub3BlbicpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ1JvYWQuY291bnRlcicpID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiSSBzaG91bGQgZ28gY2hlY2sgb3V0IHRoZSBSb2FkIHRvIHRoZSBPdXRwb3N0XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgkU00uZ2V0KCdyb2FkLm9wZW4nKSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdSb2FkLmNvdW50ZXInKSAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiSSBzaG91bGQga2VlcCBleHBsb3JpbmcgdGhlIFJvYWQgdG8gdGhlIE91dHBvc3RcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCRTTS5nZXQoJ3JvYWQub3BlbicpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpIGFzIG51bWJlciA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiSSd2ZSBmb3VuZCB0aGUgd2F5IHRvIHRoZSBPdXRwb3N0XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgkU00uZ2V0KCdyb2FkLm9wZW4nKSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyID4gMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAxOiB7XHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJBc2sgdGhlIENhcHRhaW4gb2YgdGhlIE91dHBvc3QgYWJvdXQgdGhlIHN1cHBsaWVzXCIsXHJcbiAgICAgICAgICAgICAgICByZXF1aXJlbWVudHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlclJlcXVpcmVtZW50OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ291dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJJIHNob3VsZCB0cnkgdGFsa2luZyB0byB0aGUgQ2FwdGFpbiBvZiB0aGUgT3V0cG9zdFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpIGFzIG51bWJlciA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdvdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcpICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdvdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcpIGFzIG51bWJlciA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBDaGFyYWN0ZXIuaW52ZW50b3J5W1wiQ2FwdGFpbi5zdXBwbGllc1wiXSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkkgc2hvdWxkIGFzayB0aGUgQ2FwdGFpbiBhYm91dCB0aGUgbWlzc2luZyBzdXBwbGllc1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpIGFzIG51bWJlciA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdvdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcpICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdvdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcpIGFzIG51bWJlciA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBDaGFyYWN0ZXIuaW52ZW50b3J5W1wiQ2FwdGFpbi5zdXBwbGllc1wiXSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkkndmUgZ290dGVuIHRoZSBzdXBwbGllcyBmcm9tIHRoZSBDYXB0YWluXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnb3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnKSAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdvdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcpIGFzIG51bWJlciA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIENoYXJhY3Rlci5pbnZlbnRvcnlbXCJDYXB0YWluLnN1cHBsaWVzXCJdICE9PSB1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAyOiB7XHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJSZXR1cm4gdGhlIHN1cHBsaWVzIHRvIHRoZSBNYXlvclwiLFxyXG4gICAgICAgICAgICAgICAgcmVxdWlyZW1lbnRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJSZXF1aXJlbWVudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJFNNLmdldCgndmlsbGFnZS5tYXlvci5oYXZlR2l2ZW5TdXBwbGllcycpID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICBcIkkgc2hvdWxkIGhhbmQgdGhlc2Ugc3VwcGxpZXMgb3ZlciB0byB0aGUgTWF5b3JcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnKSA9PT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgndmlsbGFnZS5tYXlvci5oYXZlR2l2ZW5TdXBwbGllcycpIGFzIG51bWJlciA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiSSd2ZSBoYW5kZWQgb3ZlciB0aGUgc3VwcGxpZXMgdG8gdGhlIE1heW9yXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykgPT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgndmlsbGFnZS5tYXlvci5oYXZlR2l2ZW5TdXBwbGllcycpIGFzIG51bWJlciA+IDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLypcclxuICogTW9kdWxlIGZvciBoYW5kbGluZyBTdGF0ZXNcclxuICogXHJcbiAqIEFsbCBzdGF0ZXMgc2hvdWxkIGJlIGdldCBhbmQgc2V0IHRocm91Z2ggdGhlIFN0YXRlTWFuYWdlciAoJFNNKS5cclxuICogXHJcbiAqIFRoZSBtYW5hZ2VyIGlzIGludGVuZGVkIHRvIGhhbmRsZSBhbGwgbmVlZGVkIGNoZWNrcyBhbmQgZXJyb3IgY2F0Y2hpbmcuXHJcbiAqIFRoaXMgaW5jbHVkZXMgY3JlYXRpbmcgdGhlIHBhcmVudHMgb2YgbGF5ZXJlZC9kZWVwIHN0YXRlcyBzbyB1bmRlZmluZWQgc3RhdGVzXHJcbiAqIGRvIG5vdCBuZWVkIHRvIGJlIHRlc3RlZCBmb3IgYW5kIGNyZWF0ZWQgYmVmb3JlaGFuZC5cclxuICogXHJcbiAqIFdoZW4gYSBzdGF0ZSBpcyBjaGFuZ2VkLCBhbiB1cGRhdGUgZXZlbnQgaXMgc2VudCBvdXQgY29udGFpbmluZyB0aGUgbmFtZSBvZiB0aGUgc3RhdGVcclxuICogY2hhbmdlZCBvciBpbiB0aGUgY2FzZSBvZiBtdWx0aXBsZSBjaGFuZ2VzICguc2V0TSwgLmFkZE0pIHRoZSBwYXJlbnQgY2xhc3MgY2hhbmdlZC5cclxuICogRXZlbnQ6IHR5cGU6ICdzdGF0ZVVwZGF0ZScsIHN0YXRlTmFtZTogPHBhdGggb2Ygc3RhdGUgb3IgcGFyZW50IHN0YXRlPlxyXG4gKiBcclxuICogT3JpZ2luYWwgZmlsZSBjcmVhdGVkIGJ5OiBNaWNoYWVsIEdhbHVzaGFcclxuICovXHJcblxyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi9lbmdpbmVcIjtcclxuaW1wb3J0IHsgTm90aWZpY2F0aW9ucyB9IGZyb20gXCIuL25vdGlmaWNhdGlvbnNcIjtcclxuXHJcbnZhciBTdGF0ZU1hbmFnZXIgPSB7XHJcblx0XHRcclxuXHRNQVhfU1RPUkU6IDk5OTk5OTk5OTk5OTk5LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHt9LFxyXG5cdFxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHRcdFxyXG5cdFx0Ly9jcmVhdGUgY2F0ZWdvcmllc1xyXG5cdFx0dmFyIGNhdHMgPSBbXHJcblx0XHRcdCdmZWF0dXJlcycsXHRcdC8vYmlnIGZlYXR1cmVzIGxpa2UgYnVpbGRpbmdzLCBsb2NhdGlvbiBhdmFpbGFiaWxpdHksIHVubG9ja3MsIGV0Y1xyXG5cdFx0XHQnc3RvcmVzJywgXHRcdC8vbGl0dGxlIHN0dWZmLCBpdGVtcywgd2VhcG9ucywgZXRjXHJcblx0XHRcdCdjaGFyYWN0ZXInLCBcdC8vdGhpcyBpcyBmb3IgcGxheWVyJ3MgY2hhcmFjdGVyIHN0YXRzIHN1Y2ggYXMgcGVya3NcclxuXHRcdFx0J2luY29tZScsXHJcblx0XHRcdCd0aW1lcnMnLFxyXG5cdFx0XHQnZ2FtZScsIFx0XHQvL21vc3RseSBsb2NhdGlvbiByZWxhdGVkOiBmaXJlIHRlbXAsIHdvcmtlcnMsIHBvcHVsYXRpb24sIHdvcmxkIG1hcCwgZXRjXHJcblx0XHRcdCdwbGF5U3RhdHMnLFx0Ly9hbnl0aGluZyBwbGF5IHJlbGF0ZWQ6IHBsYXkgdGltZSwgbG9hZHMsIGV0Y1xyXG5cdFx0XHQncHJldmlvdXMnLFx0XHQvLyBwcmVzdGlnZSwgc2NvcmUsIHRyb3BoaWVzIChpbiBmdXR1cmUpLCBhY2hpZXZlbWVudHMgKGFnYWluLCBub3QgeWV0KSwgZXRjXHJcblx0XHRcdCdvdXRmaXQnXHRcdFx0Ly8gdXNlZCB0byB0ZW1wb3JhcmlseSBzdG9yZSB0aGUgaXRlbXMgdG8gYmUgdGFrZW4gb24gdGhlIHBhdGhcclxuXHRcdF07XHJcblx0XHRcclxuXHRcdGZvcih2YXIgd2hpY2ggaW4gY2F0cykge1xyXG5cdFx0XHRpZighJFNNLmdldChjYXRzW3doaWNoXSkpICRTTS5zZXQoY2F0c1t3aGljaF0sIHt9KTsgXHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vc3Vic2NyaWJlIHRvIHN0YXRlVXBkYXRlc1xyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5zdWJzY3JpYmUoJFNNLmhhbmRsZVN0YXRlVXBkYXRlcyk7XHJcblxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0d2luZG93LiRTTSA9IHRoaXM7XHJcblx0fSxcclxuXHRcclxuXHQvL2NyZWF0ZSBhbGwgcGFyZW50cyBhbmQgdGhlbiBzZXQgc3RhdGVcclxuXHRjcmVhdGVTdGF0ZTogZnVuY3Rpb24oc3RhdGVOYW1lLCB2YWx1ZSkge1xyXG5cdFx0dmFyIHdvcmRzID0gc3RhdGVOYW1lLnNwbGl0KC9bLlxcW1xcXSdcIl0rLyk7XHJcblx0XHQvL2ZvciBzb21lIHJlYXNvbiB0aGVyZSBhcmUgc29tZXRpbWVzIGVtcHR5IHN0cmluZ3NcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgd29yZHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKHdvcmRzW2ldID09PSAnJykge1xyXG5cdFx0XHRcdHdvcmRzLnNwbGljZShpLCAxKTtcclxuXHRcdFx0XHRpLS07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vIElNUE9SVEFOVDogU3RhdGUgcmVmZXJzIHRvIHdpbmRvdy5TdGF0ZSwgd2hpY2ggSSBoYWQgdG8gaW5pdGlhbGl6ZSBtYW51YWxseVxyXG5cdFx0Ly8gICAgaW4gRW5naW5lLnRzOyBwbGVhc2UgZG9uJ3QgZm9yZ2V0IHRoaXMgYW5kIG1lc3Mgd2l0aCBhbnl0aGluZyBuYW1lZFxyXG5cdFx0Ly8gICAgXCJTdGF0ZVwiIG9yIFwid2luZG93LlN0YXRlXCIsIHRoaXMgc3R1ZmYgaXMgd2VpcmRseSBwcmVjYXJpb3VzIGFmdGVyIHR5cGVzY3JpcHRpbmdcclxuXHRcdC8vICAgIHRoaXMgY29kZWJhc2UsIGFuZCBJIGRvbid0IGhhdmUgdGhlIHNhbml0eSBwb2ludHMgdG8gZmlndXJlIG91dCB3aHlcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdHZhciBvYmogPSBTdGF0ZTtcclxuXHRcdHZhciB3ID0gbnVsbDtcclxuXHRcdGZvcih2YXIgaT0wLCBsZW49d29yZHMubGVuZ3RoLTE7aTxsZW47aSsrKXtcclxuXHRcdFx0dyA9IHdvcmRzW2ldO1xyXG5cdFx0XHRpZihvYmpbd10gPT09IHVuZGVmaW5lZCApIG9ialt3XSA9IHt9O1xyXG5cdFx0XHRvYmogPSBvYmpbd107XHJcblx0XHR9XHJcblx0XHRvYmpbd29yZHNbaV1dID0gdmFsdWU7XHJcblx0XHRyZXR1cm4gb2JqO1xyXG5cdH0sXHJcblx0XHJcblx0Ly9zZXQgc2luZ2xlIHN0YXRlXHJcblx0Ly9pZiBub0V2ZW50IGlzIHRydWUsIHRoZSB1cGRhdGUgZXZlbnQgd29uJ3QgdHJpZ2dlciwgdXNlZnVsIGZvciBzZXR0aW5nIG11bHRpcGxlIHN0YXRlcyBmaXJzdFxyXG5cdHNldDogZnVuY3Rpb24oc3RhdGVOYW1lLCB2YWx1ZSwgbm9FdmVudD8pIHtcclxuXHRcdHZhciBmdWxsUGF0aCA9ICRTTS5idWlsZFBhdGgoc3RhdGVOYW1lKTtcclxuXHRcdFxyXG5cdFx0Ly9tYWtlIHN1cmUgdGhlIHZhbHVlIGlzbid0IG92ZXIgdGhlIGVuZ2luZSBtYXhpbXVtXHJcblx0XHRpZih0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiYgdmFsdWUgPiAkU00uTUFYX1NUT1JFKSB2YWx1ZSA9ICRTTS5NQVhfU1RPUkU7XHJcblx0XHRcclxuXHRcdHRyeXtcclxuXHRcdFx0ZXZhbCgnKCcrZnVsbFBhdGgrJykgPSB2YWx1ZScpO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHQvL3BhcmVudCBkb2Vzbid0IGV4aXN0LCBzbyBtYWtlIHBhcmVudFxyXG5cdFx0XHQkU00uY3JlYXRlU3RhdGUoc3RhdGVOYW1lLCB2YWx1ZSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vc3RvcmVzIHZhbHVlcyBjYW4gbm90IGJlIG5lZ2F0aXZlXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRpZihzdGF0ZU5hbWUuaW5kZXhPZignc3RvcmVzJykgPT09IDAgJiYgJFNNLmdldChzdGF0ZU5hbWUsIHRydWUpIDwgMCkge1xyXG5cdFx0XHRldmFsKCcoJytmdWxsUGF0aCsnKSA9IDAnKTtcclxuXHRcdFx0RW5naW5lLmxvZygnV0FSTklORzogc3RhdGU6JyArIHN0YXRlTmFtZSArICcgY2FuIG5vdCBiZSBhIG5lZ2F0aXZlIHZhbHVlLiBTZXQgdG8gMCBpbnN0ZWFkLicpO1xyXG5cdFx0fVxyXG5cclxuXHRcdEVuZ2luZS5sb2coc3RhdGVOYW1lICsgJyAnICsgdmFsdWUpO1xyXG5cdFx0XHJcblx0XHRpZiAobm9FdmVudCA9PT0gdW5kZWZpbmVkIHx8IG5vRXZlbnQgPT0gdHJ1ZSkge1xyXG5cdFx0XHRFbmdpbmUuc2F2ZUdhbWUoKTtcclxuXHRcdFx0JFNNLmZpcmVVcGRhdGUoc3RhdGVOYW1lKTtcclxuXHRcdH1cdFx0XHJcblx0fSxcclxuXHRcclxuXHQvL3NldHMgYSBsaXN0IG9mIHN0YXRlc1xyXG5cdHNldE06IGZ1bmN0aW9uKHBhcmVudE5hbWUsIGxpc3QsIG5vRXZlbnQ/KSB7XHJcblx0XHQkU00uYnVpbGRQYXRoKHBhcmVudE5hbWUpO1xyXG5cdFx0XHJcblx0XHQvL21ha2Ugc3VyZSB0aGUgc3RhdGUgZXhpc3RzIHRvIGF2b2lkIGVycm9ycyxcclxuXHRcdGlmKCRTTS5nZXQocGFyZW50TmFtZSkgPT09IHVuZGVmaW5lZCkgJFNNLnNldChwYXJlbnROYW1lLCB7fSwgdHJ1ZSk7XHJcblx0XHRcclxuXHRcdGZvcih2YXIgayBpbiBsaXN0KXtcclxuXHRcdFx0JFNNLnNldChwYXJlbnROYW1lKydbXCInK2srJ1wiXScsIGxpc3Rba10sIHRydWUpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZighbm9FdmVudCkge1xyXG5cdFx0XHRFbmdpbmUuc2F2ZUdhbWUoKTtcclxuXHRcdFx0JFNNLmZpcmVVcGRhdGUocGFyZW50TmFtZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHQvL3Nob3J0Y3V0IGZvciBhbHRlcmluZyBudW1iZXIgdmFsdWVzLCByZXR1cm4gMSBpZiBzdGF0ZSB3YXNuJ3QgYSBudW1iZXJcclxuXHRhZGQ6IGZ1bmN0aW9uKHN0YXRlTmFtZSwgdmFsdWUsIG5vRXZlbnQ/KSB7XHJcblx0XHR2YXIgZXJyID0gMDtcclxuXHRcdC8vMCBpZiB1bmRlZmluZWQsIG51bGwgKGJ1dCBub3Qge30pIHNob3VsZCBhbGxvdyBhZGRpbmcgdG8gbmV3IG9iamVjdHNcclxuXHRcdC8vY291bGQgYWxzbyBhZGQgaW4gYSB0cnVlID0gMSB0aGluZywgdG8gaGF2ZSBzb21ldGhpbmcgZ28gZnJvbSBleGlzdGluZyAodHJ1ZSlcclxuXHRcdC8vdG8gYmUgYSBjb3VudCwgYnV0IHRoYXQgbWlnaHQgYmUgdW53YW50ZWQgYmVoYXZpb3IgKGFkZCB3aXRoIGxvb3NlIGV2YWwgcHJvYmFibHkgd2lsbCBoYXBwZW4gYW55d2F5cylcclxuXHRcdHZhciBvbGQgPSAkU00uZ2V0KHN0YXRlTmFtZSwgdHJ1ZSk7XHJcblx0XHRcclxuXHRcdC8vY2hlY2sgZm9yIE5hTiAob2xkICE9IG9sZCkgYW5kIG5vbiBudW1iZXIgdmFsdWVzXHJcblx0XHRpZihvbGQgIT0gb2xkKXtcclxuXHRcdFx0RW5naW5lLmxvZygnV0FSTklORzogJytzdGF0ZU5hbWUrJyB3YXMgY29ycnVwdGVkIChOYU4pLiBSZXNldHRpbmcgdG8gMC4nKTtcclxuXHRcdFx0b2xkID0gMDtcclxuXHRcdFx0JFNNLnNldChzdGF0ZU5hbWUsIG9sZCArIHZhbHVlLCBub0V2ZW50KTtcclxuXHRcdH0gZWxzZSBpZih0eXBlb2Ygb2xkICE9ICdudW1iZXInIHx8IHR5cGVvZiB2YWx1ZSAhPSAnbnVtYmVyJyl7XHJcblx0XHRcdEVuZ2luZS5sb2coJ1dBUk5JTkc6IENhbiBub3QgZG8gbWF0aCB3aXRoIHN0YXRlOicrc3RhdGVOYW1lKycgb3IgdmFsdWU6Jyt2YWx1ZSsnIGJlY2F1c2UgYXQgbGVhc3Qgb25lIGlzIG5vdCBhIG51bWJlci4nKTtcclxuXHRcdFx0ZXJyID0gMTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCRTTS5zZXQoc3RhdGVOYW1lLCBvbGQgKyB2YWx1ZSwgbm9FdmVudCk7IC8vc2V0U3RhdGUgaGFuZGxlcyBldmVudCBhbmQgc2F2ZVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gZXJyO1xyXG5cdH0sXHJcblx0XHJcblx0Ly9hbHRlcnMgbXVsdGlwbGUgbnVtYmVyIHZhbHVlcywgcmV0dXJuIG51bWJlciBvZiBmYWlsc1xyXG5cdGFkZE06IGZ1bmN0aW9uKHBhcmVudE5hbWUsIGxpc3QsIG5vRXZlbnQ/KSB7XHJcblx0XHR2YXIgZXJyID0gMDtcclxuXHRcdFxyXG5cdFx0Ly9tYWtlIHN1cmUgdGhlIHBhcmVudCBleGlzdHMgdG8gYXZvaWQgZXJyb3JzXHJcblx0XHRpZigkU00uZ2V0KHBhcmVudE5hbWUpID09PSB1bmRlZmluZWQpICRTTS5zZXQocGFyZW50TmFtZSwge30sIHRydWUpO1xyXG5cdFx0XHJcblx0XHRmb3IodmFyIGsgaW4gbGlzdCl7XHJcblx0XHRcdGlmKCRTTS5hZGQocGFyZW50TmFtZSsnW1wiJytrKydcIl0nLCBsaXN0W2tdLCB0cnVlKSkgZXJyKys7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmKCFub0V2ZW50KSB7XHJcblx0XHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0XHQkU00uZmlyZVVwZGF0ZShwYXJlbnROYW1lKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBlcnI7XHJcblx0fSxcclxuXHRcclxuXHQvL3JldHVybiBzdGF0ZSwgdW5kZWZpbmVkIG9yIDBcclxuXHRnZXQ6IGZ1bmN0aW9uKHN0YXRlTmFtZSwgcmVxdWVzdFplcm8/KTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgTnVtYmVyIHwgbnVsbCB8IEJvb2xlYW4ge1xyXG5cdFx0dmFyIHdoaWNoU3RhdGU6IHVuZGVmaW5lZCB8IG51bGwgfCBOdW1iZXIgfCBzdHJpbmcgPSBudWxsO1xyXG5cdFx0dmFyIGZ1bGxQYXRoID0gJFNNLmJ1aWxkUGF0aChzdGF0ZU5hbWUpO1xyXG5cdFx0XHJcblx0XHQvL2NhdGNoIGVycm9ycyBpZiBwYXJlbnQgb2Ygc3RhdGUgZG9lc24ndCBleGlzdFxyXG5cdFx0dHJ5e1xyXG5cdFx0XHRldmFsKCd3aGljaFN0YXRlID0gKCcrZnVsbFBhdGgrJyknKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0d2hpY2hTdGF0ZSA9IHVuZGVmaW5lZDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly9wcmV2ZW50cyByZXBlYXRlZCBpZiB1bmRlZmluZWQsIG51bGwsIGZhbHNlIG9yIHt9LCB0aGVuIHggPSAwIHNpdHVhdGlvbnNcclxuXHRcdGlmKCghd2hpY2hTdGF0ZVxyXG5cdFx0XHQvLyAgfHwgd2hpY2hTdGF0ZSA9PSB7fVxyXG5cdFx0XHQpICYmIHJlcXVlc3RaZXJvKSByZXR1cm4gMDtcclxuXHRcdGVsc2UgcmV0dXJuIHdoaWNoU3RhdGU7XHJcblx0fSxcclxuXHRcclxuXHQvL21haW5seSBmb3IgbG9jYWwgY29weSB1c2UsIGFkZChNKSBjYW4gZmFpbCBzbyB3ZSBjYW4ndCBzaG9ydGN1dCB0aGVtXHJcblx0Ly9zaW5jZSBzZXQgZG9lcyBub3QgZmFpbCwgd2Uga25vdyBzdGF0ZSBleGlzdHMgYW5kIGNhbiBzaW1wbHkgcmV0dXJuIHRoZSBvYmplY3RcclxuXHRzZXRnZXQ6IGZ1bmN0aW9uKHN0YXRlTmFtZSwgdmFsdWUsIG5vRXZlbnQ/KXtcclxuXHRcdCRTTS5zZXQoc3RhdGVOYW1lLCB2YWx1ZSwgbm9FdmVudCk7XHJcblx0XHRyZXR1cm4gZXZhbCgnKCcrJFNNLmJ1aWxkUGF0aChzdGF0ZU5hbWUpKycpJyk7XHJcblx0fSxcclxuXHRcclxuXHRyZW1vdmU6IGZ1bmN0aW9uKHN0YXRlTmFtZSwgbm9FdmVudD8pIHtcclxuXHRcdHZhciB3aGljaFN0YXRlID0gJFNNLmJ1aWxkUGF0aChzdGF0ZU5hbWUpO1xyXG5cdFx0dHJ5e1xyXG5cdFx0XHRldmFsKCcoZGVsZXRlICcrd2hpY2hTdGF0ZSsnKScpO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHQvL2l0IGRpZG4ndCBleGlzdCBpbiB0aGUgZmlyc3QgcGxhY2VcclxuXHRcdFx0RW5naW5lLmxvZygnV0FSTklORzogVHJpZWQgdG8gcmVtb3ZlIG5vbi1leGlzdGFudCBzdGF0ZSBcXCcnK3N0YXRlTmFtZSsnXFwnLicpO1xyXG5cdFx0fVxyXG5cdFx0aWYoIW5vRXZlbnQpe1xyXG5cdFx0XHRFbmdpbmUuc2F2ZUdhbWUoKTtcclxuXHRcdFx0JFNNLmZpcmVVcGRhdGUoc3RhdGVOYW1lKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdC8vY3JlYXRlcyBmdWxsIHJlZmVyZW5jZSBmcm9tIGlucHV0XHJcblx0Ly9ob3BlZnVsbHkgdGhpcyB3b24ndCBldmVyIG5lZWQgdG8gYmUgbW9yZSBjb21wbGljYXRlZFxyXG5cdGJ1aWxkUGF0aDogZnVuY3Rpb24oaW5wdXQpe1xyXG5cdFx0dmFyIGRvdCA9IChpbnB1dC5jaGFyQXQoMCkgPT0gJ1snKT8gJycgOiAnLic7IC8vaWYgaXQgc3RhcnRzIHdpdGggW2Zvb10gbm8gZG90IHRvIGpvaW5cclxuXHRcdHJldHVybiAnU3RhdGUnICsgZG90ICsgaW5wdXQ7XHJcblx0fSxcclxuXHRcclxuXHRmaXJlVXBkYXRlOiBmdW5jdGlvbihzdGF0ZU5hbWUsIHNhdmU/KXtcclxuXHRcdHZhciBjYXRlZ29yeSA9ICRTTS5nZXRDYXRlZ29yeShzdGF0ZU5hbWUpO1xyXG5cdFx0aWYoc3RhdGVOYW1lID09IHVuZGVmaW5lZCkgc3RhdGVOYW1lID0gY2F0ZWdvcnkgPSAnYWxsJzsgLy9iZXN0IGlmIHRoaXMgZG9lc24ndCBoYXBwZW4gYXMgaXQgd2lsbCB0cmlnZ2VyIG1vcmUgc3R1ZmZcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdCQuRGlzcGF0Y2goJ3N0YXRlVXBkYXRlJykucHVibGlzaCh7J2NhdGVnb3J5JzogY2F0ZWdvcnksICdzdGF0ZU5hbWUnOnN0YXRlTmFtZX0pO1xyXG5cdFx0aWYoc2F2ZSkgRW5naW5lLnNhdmVHYW1lKCk7XHJcblx0fSxcclxuXHRcclxuXHRnZXRDYXRlZ29yeTogZnVuY3Rpb24oc3RhdGVOYW1lKXtcclxuXHRcdHZhciBmaXJzdE9CID0gc3RhdGVOYW1lLmluZGV4T2YoJ1snKTtcclxuXHRcdHZhciBmaXJzdERvdCA9IHN0YXRlTmFtZS5pbmRleE9mKCcuJyk7XHJcblx0XHR2YXIgY3V0b2ZmID0gbnVsbDtcclxuXHRcdGlmKGZpcnN0T0IgPT0gLTEgfHwgZmlyc3REb3QgPT0gLTEpe1xyXG5cdFx0XHRjdXRvZmYgPSBmaXJzdE9CID4gZmlyc3REb3QgPyBmaXJzdE9CIDogZmlyc3REb3Q7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjdXRvZmYgPSBmaXJzdE9CIDwgZmlyc3REb3QgPyBmaXJzdE9CIDogZmlyc3REb3Q7XHJcblx0XHR9XHJcblx0XHRpZiAoY3V0b2ZmID09IC0xKXtcclxuXHRcdFx0cmV0dXJuIHN0YXRlTmFtZTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBzdGF0ZU5hbWUuc3Vic3RyKDAsY3V0b2ZmKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHQgKiBTdGFydCBvZiBzcGVjaWZpYyBzdGF0ZSBmdW5jdGlvbnNcclxuXHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cdC8vUEVSS1NcclxuXHRhZGRQZXJrOiBmdW5jdGlvbihuYW1lKSB7XHJcblx0XHQkU00uc2V0KCdjaGFyYWN0ZXIucGVya3NbXCInK25hbWUrJ1wiXScsIHRydWUpO1xyXG5cdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgRW5naW5lLlBlcmtzW25hbWVdLm5vdGlmeSk7XHJcblx0fSxcclxuXHRcclxuXHRoYXNQZXJrOiBmdW5jdGlvbihuYW1lKSB7XHJcblx0XHRyZXR1cm4gJFNNLmdldCgnY2hhcmFjdGVyLnBlcmtzW1wiJytuYW1lKydcIl0nKTtcclxuXHR9LFxyXG5cdFxyXG5cdC8vSU5DT01FXHJcblx0c2V0SW5jb21lOiBmdW5jdGlvbihzb3VyY2UsIG9wdGlvbnMpIHtcclxuXHRcdHZhciBleGlzdGluZyA9ICRTTS5nZXQoJ2luY29tZVtcIicrc291cmNlKydcIl0nKTtcclxuXHRcdGlmKHR5cGVvZiBleGlzdGluZyAhPSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRvcHRpb25zLnRpbWVMZWZ0ID0gKGV4aXN0aW5nIGFzIGFueSk/LnRpbWVMZWZ0O1xyXG5cdFx0fVxyXG5cdFx0JFNNLnNldCgnaW5jb21lW1wiJytzb3VyY2UrJ1wiXScsIG9wdGlvbnMpO1xyXG5cdH0sXHJcblx0XHJcblx0Z2V0SW5jb21lOiBmdW5jdGlvbihzb3VyY2UpIHtcclxuXHRcdHZhciBleGlzdGluZyA9ICRTTS5nZXQoJ2luY29tZVtcIicrc291cmNlKydcIl0nKTtcclxuXHRcdGlmKHR5cGVvZiBleGlzdGluZyAhPSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRyZXR1cm4gZXhpc3Rpbmc7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4ge307XHJcblx0fSxcdFxyXG5cdFxyXG5cdC8vTWlzY1xyXG5cdG51bTogZnVuY3Rpb24obmFtZSwgY3JhZnRhYmxlKSB7XHJcblx0XHRzd2l0Y2goY3JhZnRhYmxlLnR5cGUpIHtcclxuXHRcdGNhc2UgJ2dvb2QnOlxyXG5cdFx0Y2FzZSAndG9vbCc6XHJcblx0XHRjYXNlICd3ZWFwb24nOlxyXG5cdFx0Y2FzZSAndXBncmFkZSc6XHJcblx0XHRcdHJldHVybiAkU00uZ2V0KCdzdG9yZXNbXCInK25hbWUrJ1wiXScsIHRydWUpO1xyXG5cdFx0Y2FzZSAnYnVpbGRpbmcnOlxyXG5cdFx0XHRyZXR1cm4gJFNNLmdldCgnZ2FtZS5idWlsZGluZ3NbXCInK25hbWUrJ1wiXScsIHRydWUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0aGFuZGxlU3RhdGVVcGRhdGVzOiBmdW5jdGlvbihlKXtcclxuXHRcdFxyXG5cdH1cdFxyXG59O1xyXG5cclxuLy9hbGlhc1xyXG5leHBvcnQgY29uc3QgJFNNID0gU3RhdGVNYW5hZ2VyO1xyXG4iLCJpbXBvcnQgeyBOb3RpZmljYXRpb25zIH0gZnJvbSAnLi9ub3RpZmljYXRpb25zJztcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSAnLi9zdGF0ZV9tYW5hZ2VyJztcclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSAnLi9lbmdpbmUnO1xyXG5cclxuZXhwb3J0IGNvbnN0IFdlYXRoZXIgPSB7XHJcbiAgICBpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblxyXG4gICAgICAgIC8vc3Vic2NyaWJlIHRvIHN0YXRlVXBkYXRlc1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuXHRcdCQuRGlzcGF0Y2goJ3N0YXRlVXBkYXRlJykuc3Vic2NyaWJlKFdlYXRoZXIuaGFuZGxlU3RhdGVVcGRhdGVzKTtcclxuICAgIH0sXHJcblxyXG4gICAgaGFuZGxlU3RhdGVVcGRhdGVzOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgaWYgKGUuY2F0ZWdvcnkgPT0gJ3dlYXRoZXInKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoJFNNLmdldCgnd2VhdGhlcicpKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdzdW5ueSc6IFxyXG4gICAgICAgICAgICAgICAgICAgIFdlYXRoZXIuc3RhcnRTdW5ueSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnY2xvdWR5JzpcclxuICAgICAgICAgICAgICAgICAgICBXZWF0aGVyLnN0YXJ0Q2xvdWR5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdyYWlueSc6XHJcbiAgICAgICAgICAgICAgICAgICAgV2VhdGhlci5zdGFydFJhaW55KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfbGFzdFdlYXRoZXI6ICdzdW5ueScsXHJcblxyXG4gICAgc3RhcnRTdW5ueTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJUaGUgc3VuIGJlZ2lucyB0byBzaGluZS5cIik7XHJcbiAgICAgICAgV2VhdGhlci5fbGFzdFdlYXRoZXIgPSAnc3VubnknO1xyXG4gICAgICAgICQoJ2JvZHknKS5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6ICcjRkZGRkZGJ30sICdzbG93Jyk7XHJcbiAgICAgICAgJCgnZGl2I3N0b3Jlczo6YmVmb3JlJykuYW5pbWF0ZSh7YmFja2dyb3VuZENvbG9yOiAnI0ZGRkZGRid9LCAnc2xvdycpO1xyXG4gICAgICAgIFdlYXRoZXIubWFrZVJhaW5TdG9wKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHN0YXJ0Q2xvdWR5OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoV2VhdGhlci5fbGFzdFdlYXRoZXIgPT0gJ3N1bm55Jykge1xyXG4gICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIkNsb3VkcyByb2xsIGluLCBvYnNjdXJpbmcgdGhlIHN1bi5cIik7XHJcbiAgICAgICAgfSBlbHNlIGlmIChXZWF0aGVyLl9sYXN0V2VhdGhlciA9PSAncmFpbnknKSB7XHJcbiAgICAgICAgICAgIE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiVGhlIHJhaW4gYnJlYWtzLCBidXQgdGhlIGNsb3VkcyByZW1haW4uXCIpXHJcbiAgICAgICAgfVxyXG4gICAgICAgICQoJ2JvZHknKS5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6ICcjOEI4Nzg2J30sICdzbG93Jyk7XHJcbiAgICAgICAgJCgnZGl2I3N0b3Jlczo6YmVmb3JlJykuYW5pbWF0ZSh7YmFja2dyb3VuZENvbG9yOiAnIzhCODc4Nid9LCAnc2xvdycpO1xyXG4gICAgICAgIFdlYXRoZXIuX2xhc3RXZWF0aGVyID0gJ2Nsb3VkeSc7XHJcbiAgICAgICAgV2VhdGhlci5tYWtlUmFpblN0b3AoKTtcclxuICAgIH0sXHJcblxyXG4gICAgc3RhcnRSYWlueTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKFdlYXRoZXIuX2xhc3RXZWF0aGVyID09ICdzdW5ueScpIHtcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJUaGUgd2luZCBzdWRkZW5seSBwaWNrcyB1cC4gQ2xvdWRzIHJvbGwgaW4sIGhlYXZ5IHdpdGggcmFpbiwgYW5kIHJhaW5kcm9wcyBmYWxsIHNvb24gYWZ0ZXIuXCIpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoV2VhdGhlci5fbGFzdFdlYXRoZXIgPT0gJ2Nsb3VkeScpIHtcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJUaGUgY2xvdWRzIHRoYXQgd2VyZSBwcmV2aW91c2x5IGNvbnRlbnQgdG8gaGFuZyBvdmVyaGVhZCBsZXQgbG9vc2UgYSBtb2RlcmF0ZSBkb3ducG91ci5cIilcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgJCgnYm9keScpLmFuaW1hdGUoe2JhY2tncm91bmRDb2xvcjogJyM2RDY5NjgnfSwgJ3Nsb3cnKTtcclxuICAgICAgICAkKCdkaXYjc3RvcmVzOjpiZWZvcmUnKS5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6ICcjNkQ2OTY4J30sICdzbG93Jyk7XHJcbiAgICAgICAgV2VhdGhlci5fbGFzdFdlYXRoZXIgPSAncmFpbnknO1xyXG4gICAgICAgIFdlYXRoZXIubWFrZUl0UmFpbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICBfbG9jYXRpb246ICcnLFxyXG5cclxuICAgIGluaXRpYXRlV2VhdGhlcjogZnVuY3Rpb24oYXZhaWxhYmxlV2VhdGhlciwgbG9jYXRpb24pIHtcclxuICAgICAgICBpZiAoV2VhdGhlci5fbG9jYXRpb24gPT0gJycpIFdlYXRoZXIuX2xvY2F0aW9uID0gbG9jYXRpb247XHJcbiAgICAgICAgLy8gaWYgaW4gbmV3IGxvY2F0aW9uLCBlbmQgd2l0aG91dCB0cmlnZ2VyaW5nIGEgbmV3IHdlYXRoZXIgaW5pdGlhdGlvbiwgXHJcbiAgICAgICAgLy8gbGVhdmluZyB0aGUgbmV3IGxvY2F0aW9uJ3MgaW5pdGlhdGVXZWF0aGVyIGNhbGxiYWNrIHRvIGRvIGl0cyB0aGluZ1xyXG4gICAgICAgIGVsc2UgaWYgKFdlYXRoZXIuX2xvY2F0aW9uICE9IGxvY2F0aW9uKSByZXR1cm47IFxyXG5cclxuICAgICAgICB2YXIgY2hvc2VuV2VhdGhlciA9ICdub25lJztcclxuICAgICAgICAvL2dldCBvdXIgcmFuZG9tIGZyb20gMCB0byAxXHJcbiAgICAgICAgdmFyIHJuZCA9IE1hdGgucmFuZG9tKCk7XHJcbiAgXHJcbiAgICAgICAgLy9pbml0aWFsaXNlIG91ciBjdW11bGF0aXZlIHBlcmNlbnRhZ2VcclxuICAgICAgICB2YXIgY3VtdWxhdGl2ZUNoYW5jZSA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaSBpbiBhdmFpbGFibGVXZWF0aGVyKSB7XHJcbiAgICAgICAgICAgIGN1bXVsYXRpdmVDaGFuY2UgKz0gYXZhaWxhYmxlV2VhdGhlcltpXTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChybmQgPCBjdW11bGF0aXZlQ2hhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICBjaG9zZW5XZWF0aGVyID0gaTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY2hvc2VuV2VhdGhlciAhPSAkU00uZ2V0KCd3ZWF0aGVyJykpICRTTS5zZXQoJ3dlYXRoZXInLCBjaG9zZW5XZWF0aGVyKTtcclxuICAgICAgICBFbmdpbmUuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhdGVXZWF0aGVyKGF2YWlsYWJsZVdlYXRoZXIsIGxvY2F0aW9uKTtcclxuICAgICAgICB9LCAzICogNjAgKiAxMDAwKTtcclxuICAgIH0sXHJcblxyXG4gICAgbWFrZUl0UmFpbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gaHR0cHM6Ly9jb2RlcGVuLmlvL2FyaWNrbGUvcGVuL1hLak1aWVxyXG4gICAgICAgIC8vY2xlYXIgb3V0IGV2ZXJ5dGhpbmdcclxuICAgICAgICAkKCcucmFpbicpLmVtcHR5KCk7XHJcbiAgICAgIFxyXG4gICAgICAgIHZhciBpbmNyZW1lbnQgPSAwO1xyXG4gICAgICAgIHZhciBkcm9wcyA9IFwiXCI7XHJcbiAgICAgICAgdmFyIGJhY2tEcm9wcyA9IFwiXCI7XHJcbiAgICAgIFxyXG4gICAgICAgIHdoaWxlIChpbmNyZW1lbnQgPCAxMDApIHtcclxuICAgICAgICAgIC8vY291cGxlIHJhbmRvbSBudW1iZXJzIHRvIHVzZSBmb3IgdmFyaW91cyByYW5kb21pemF0aW9uc1xyXG4gICAgICAgICAgLy9yYW5kb20gbnVtYmVyIGJldHdlZW4gOTggYW5kIDFcclxuICAgICAgICAgIHZhciByYW5kb0h1bmRvID0gKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg5OCAtIDEgKyAxKSArIDEpKTtcclxuICAgICAgICAgIC8vcmFuZG9tIG51bWJlciBiZXR3ZWVuIDUgYW5kIDJcclxuICAgICAgICAgIHZhciByYW5kb0ZpdmVyID0gKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg1IC0gMiArIDEpICsgMikpO1xyXG4gICAgICAgICAgLy9pbmNyZW1lbnRcclxuICAgICAgICAgIGluY3JlbWVudCArPSByYW5kb0ZpdmVyO1xyXG4gICAgICAgICAgLy9hZGQgaW4gYSBuZXcgcmFpbmRyb3Agd2l0aCB2YXJpb3VzIHJhbmRvbWl6YXRpb25zIHRvIGNlcnRhaW4gQ1NTIHByb3BlcnRpZXNcclxuICAgICAgICAgIGRyb3BzICs9ICc8ZGl2IGNsYXNzPVwiZHJvcFwiIHN0eWxlPVwibGVmdDogJyArIGluY3JlbWVudCArICclOyBib3R0b206ICcgKyAocmFuZG9GaXZlciArIHJhbmRvRml2ZXIgLSAxICsgMTAwKSArICclOyBhbmltYXRpb24tZGVsYXk6IDAuJyArIHJhbmRvSHVuZG8gKyAnczsgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjUnICsgcmFuZG9IdW5kbyArICdzO1wiPjxkaXYgY2xhc3M9XCJzdGVtXCIgc3R5bGU9XCJhbmltYXRpb24tZGVsYXk6IDAuJyArIHJhbmRvSHVuZG8gKyAnczsgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjUnICsgcmFuZG9IdW5kbyArICdzO1wiPjwvZGl2PjxkaXYgY2xhc3M9XCJzcGxhdFwiIHN0eWxlPVwiYW5pbWF0aW9uLWRlbGF5OiAwLicgKyByYW5kb0h1bmRvICsgJ3M7IGFuaW1hdGlvbi1kdXJhdGlvbjogMC41JyArIHJhbmRvSHVuZG8gKyAncztcIj48L2Rpdj48L2Rpdj4nO1xyXG4gICAgICAgICAgYmFja0Ryb3BzICs9ICc8ZGl2IGNsYXNzPVwiZHJvcFwiIHN0eWxlPVwicmlnaHQ6ICcgKyBpbmNyZW1lbnQgKyAnJTsgYm90dG9tOiAnICsgKHJhbmRvRml2ZXIgKyByYW5kb0ZpdmVyIC0gMSArIDEwMCkgKyAnJTsgYW5pbWF0aW9uLWRlbGF5OiAwLicgKyByYW5kb0h1bmRvICsgJ3M7IGFuaW1hdGlvbi1kdXJhdGlvbjogMC41JyArIHJhbmRvSHVuZG8gKyAncztcIj48ZGl2IGNsYXNzPVwic3RlbVwiIHN0eWxlPVwiYW5pbWF0aW9uLWRlbGF5OiAwLicgKyByYW5kb0h1bmRvICsgJ3M7IGFuaW1hdGlvbi1kdXJhdGlvbjogMC41JyArIHJhbmRvSHVuZG8gKyAncztcIj48L2Rpdj48ZGl2IGNsYXNzPVwic3BsYXRcIiBzdHlsZT1cImFuaW1hdGlvbi1kZWxheTogMC4nICsgcmFuZG9IdW5kbyArICdzOyBhbmltYXRpb24tZHVyYXRpb246IDAuNScgKyByYW5kb0h1bmRvICsgJ3M7XCI+PC9kaXY+PC9kaXY+JztcclxuICAgICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAgICQoJy5yYWluLmZyb250LXJvdycpLmFwcGVuZChkcm9wcyk7XHJcbiAgICAgICAgJCgnLnJhaW4uYmFjay1yb3cnKS5hcHBlbmQoYmFja0Ryb3BzKTtcclxuICAgIH0sXHJcblxyXG4gICAgbWFrZVJhaW5TdG9wOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKCcucmFpbicpLmVtcHR5KCk7XHJcbiAgICB9XHJcbn0iXX0=
