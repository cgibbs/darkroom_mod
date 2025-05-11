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
                    seenFlag: function () { return state_manager_1.$SM.get('Outpost.captain.haveMet'); },
                    nextScene: 'main',
                    onLoad: function () { return state_manager_1.$SM.set('Outpost.captain.haveMet', 1); },
                    text: [
                        (0, translate_1._)('You enter the fanciest-looking tent in the Outpost. A large man with a toothbrush mustache and a severe frown looks up from his desk.'),
                        (0, translate_1._)('"Sir, you have entered the tent of Captain Finneas. What business do you have here?"')
                    ],
                    buttons: {
                        'askAboutSupplies': {
                            text: (0, translate_1._)('Ask About Supplies'),
                            nextScene: { 1: 'askAboutSupplies' },
                            onChoose: exports.Captain.handleSupplies,
                            available: function () { return !state_manager_1.$SM.get('Outpost.captain.askedAboutSupplies'); }
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
                            available: function () { return !state_manager_1.$SM.get('Outpost.captain.askedAboutSupplies'); }
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
                            available: function () { return !state_manager_1.$SM.get('Outpost.captain.askedAboutSupplies'); }
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
        state_manager_1.$SM.set('Outpost.captain.askedAboutSupplies', 1);
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
                        (0, translate_1._)('"You know, it\'s been a while since our last shipment of supplies arrived from the Outpost. Mind looking into that for us?"'),
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
    SITE_URL: encodeURIComponent("https://cgibbs.github.io/darkroom_mod/index.html"),
    VERSION: 1.3,
    MAX_STORE: 99999999999999,
    SAVE_DISPLAY: 30 * 1000,
    GAME_OVER: false,
    //object event types
    topics: {},
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
        // if(Engine.isMobile()) {
        // 	window.location = 'mobileWarning.html';
        // }
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
        if (state_manager_1.$SM.get('Road.open') !== undefined) {
            road_1.Road.init();
        }
        if (state_manager_1.$SM.get('Outpost.open') !== undefined) {
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
    // for dice stuff
    getRandomInt: function (max) {
        return Math.floor(Math.random() * max);
    },
    startStory: function (scene) {
        // Write the text
        var desc = $('#description', exports.Events.eventPanel());
        var textBlock = [];
        if (typeof (scene.text) == 'function') {
            textBlock = scene.text();
        }
        else {
            textBlock = scene.text;
        }
        for (var i in textBlock) {
            $('<div>').text(textBlock[i]).appendTo(desc);
        }
        // this dice stuff could maybe be extracted to its own function,
        // but also we might just make it way more generic so you can
        // throw ANYTHING in the Event description dynamically
        var diceVals = [];
        if (scene.dice !== undefined) {
            for (var j = 0; j < scene.dice.amount; j++) {
                var dieVal = this.getRandomInt(6) + 1;
                diceVals.push(dieVal);
                if (scene.dice.dieFaces && scene.dice.dieFaces[dieVal] !== undefined) {
                    dieVal = scene.dice.dieFaces[dieVal];
                }
                var tiltVal = this.getRandomInt(90) - 45;
                var marginVal = (this.getRandomInt(4) + 2) * 5;
                desc.append($('<img>', { id: 'die' + dieVal.toString(), src: 'assets/die/die' + dieVal.toString() + '.png' })
                    .css('width', '5%')
                    .css('height', 'auto')
                    .css({
                    "-webkit-transform": "rotate(" + tiltVal.toString() + "deg)",
                    "-moz-transform": "rotate(" + tiltVal.toString() + "deg)",
                    "transform": "rotate(" + tiltVal.toString() + "deg)"
                })
                    .css('margin-right', marginVal.toString() + 'px')
                    .css('margin-bottom', '20px'));
            }
            var textVals = scene.dice.handler(diceVals);
            for (var text in textVals) {
                $('<div>').text(textVals[text]).appendTo(desc);
            }
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
            var text = '';
            if (typeof (info.text) == 'function') {
                text = info.text();
            }
            else {
                text = info.text;
            }
            var b = Button_1.Button.Button({
                id: id,
                text: text,
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
                            if (state_manager_1.$SM.get('Outpost.open') === undefined) {
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
        (0, translate_1._)("You're in a small but bustling military Outpost. Various members "
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
        state_manager_1.$SM.set('Outpost.open', 1);
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
    }
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
        state_manager_1.$SM.set('Road.open', 1);
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
var weather_1 = require("../weather");
var translate_1 = require("../../lib/translate");
var header_1 = require("../header");
var liz_1 = require("../characters/liz");
var mayor_1 = require("../characters/mayor");
var events_1 = require("../events");
var textBuilder_1 = require("../../lib/textBuilder");
var character_1 = require("../player/character");
exports.Village = {
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
        Button_1.Button.Button({
            id: 'diceButton',
            text: (0, translate_1._)('Play a Game'),
            click: exports.Village.playDiceGame,
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
        this.updateDescription();
        weather_1.Weather.initiateWeather(exports.Village.availableWeather, 'village');
    },
    setTitle: function () {
        var title = (0, translate_1._)("The Village");
        if (engine_1.Engine.activeModule == this) {
            document.title = title;
        }
        $('div#location_village').text(title);
    },
    updateButton: function () {
        var lizButton = $('#lizButton.button');
        if (state_manager_1.$SM.get('village.lizActive') !== undefined)
            lizButton.show();
        var buildingButton = $('#newBuildingButton.button');
        if (state_manager_1.$SM.get('village.mayor.haveGivenSupplies') !== undefined)
            buildingButton.show();
        var storeButton = $('#storeButton.button');
        if (state_manager_1.$SM.get('Road.gotApologized') !== undefined)
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
            title: (0, translate_1._)('The Store'),
            scenes: {
                start: {
                    text: [
                        (0, translate_1._)("This is the store. There's nothing here yet, though."),
                        (0, translate_1._)("You find a dusty pair of dice in the corner and throw them, just to see what happens.")
                    ],
                    dice: {
                        amount: 2,
                        dieFaces: {
                            1: 'skull'
                        },
                        handler: function (vals) {
                            var returnText = [];
                            if ((vals[0] == vals[1]) && vals[0] == 1) {
                                returnText.push("Snake eyes! I feel a mild sense of dread.");
                            }
                            else if (vals[0] == vals[1]) {
                                returnText.push("Wow, doubles. That seems lucky.");
                            }
                            else if ((vals[0] + vals[1]) == 7) {
                                returnText.push("Oh, nice. Do I win something?");
                            }
                            else {
                                returnText.push("I rolled a " + (vals[0] + vals[1]).toString() + ". That doesn't seem especially noteworthy.");
                            }
                            return returnText;
                        }
                    },
                    buttons: {
                        roll: {
                            text: (0, translate_1._)('Roll \'em again'),
                            nextScene: { 1: 'start' }
                        },
                        leave: {
                            text: (0, translate_1._)('Lame'),
                            nextScene: 'end'
                        }
                    }
                }
            }
        });
    },
    playDiceGame: function () {
        events_1.Events.startEvent({
            title: (0, translate_1._)('A Game of Chance'),
            scenes: {
                start: {
                    text: [
                        (0, translate_1._)('You walk into a shady alley, and a man in a wide-brimmed hat gestures to you with dice in his hand.'),
                        (0, translate_1._)('"Hey, buddy, wanna play a game? There\'s a prize if you win!"'),
                        (0, translate_1._)('What do you do?')
                    ],
                    buttons: {
                        'play': {
                            text: (0, translate_1._)('I like prizes'),
                            nextScene: { 1: 'gameStart' }
                        },
                        'leave': {
                            text: (0, translate_1._)('No thanks'),
                            nextScene: 'end'
                        }
                    }
                },
                'gameStart': {
                    text: [
                        (0, translate_1._)('The man reveals a toothy grin and begins to explain the rules.'),
                        (0, translate_1._)('"It\'s very simple, you just choose whether you want to try to roll '
                            + 'higher or lower than me, and then I roll, and then you roll. '
                            + 'If you call it right, you win."'),
                        (0, translate_1._)('"So, what\'ll it be?')
                    ],
                    buttons: {
                        'high': {
                            text: (0, translate_1._)('High'),
                            nextScene: { 1: 'heRolls' },
                            onChoose: function () { return state_manager_1.$SM.set('diceGame.high', 1); }
                        },
                        'low': {
                            text: (0, translate_1._)('Low'),
                            nextScene: { 1: 'heRolls' },
                            onChoose: function () { return state_manager_1.$SM.set('diceGame.low', 1); }
                        }
                    }
                },
                'heRolls': {
                    text: [
                        (0, translate_1._)('The mans hat tips low as he drops the dice to the ground.'),
                    ],
                    dice: {
                        amount: 2,
                        handler: function (vals) {
                            var returnText = [];
                            var diceVal = 0;
                            for (var i in vals) {
                                diceVal += vals[i];
                            }
                            state_manager_1.$SM.set('diceGame.hisRoll', diceVal);
                            if ((state_manager_1.$SM.get('diceGame.high') !== undefined) && diceVal < 5) {
                                returnText.push((0, translate_1._)('The stranger grimaces.'));
                            }
                            else if ((state_manager_1.$SM.get('diceGame.high') !== undefined) && diceVal > 8) {
                                returnText.push((0, translate_1._)('The stranger grins wickedly.'));
                            }
                            else if ((state_manager_1.$SM.get('diceGame.low') !== undefined) && diceVal > 8) {
                                returnText.push((0, translate_1._)('The stranger grimaces.'));
                            }
                            else if ((state_manager_1.$SM.get('diceGame.low') !== undefined) && diceVal < 5) {
                                returnText.push((0, translate_1._)('The stranger grins wickedly.'));
                            }
                            returnText.push((0, translate_1._)('He picks up the dice and holds them out to you.'));
                            returnText.push((0, translate_1._)('"Your roll."'));
                            return returnText;
                        }
                    },
                    buttons: {
                        'okay': {
                            text: (0, translate_1._)('Roll \'em'),
                            nextScene: { 1: 'youRoll' }
                        }
                    }
                },
                'youRoll': {
                    text: [
                        (0, translate_1._)('You briefly jostle the dice, then let them fall where they may.')
                    ],
                    dice: {
                        amount: 2,
                        handler: function (vals) {
                            var returnText = [];
                            var diceVal = 0;
                            for (var i in vals) {
                                diceVal += vals[i];
                            }
                            if (state_manager_1.$SM.get('diceGame.high') && diceVal < state_manager_1.$SM.get('diceGame.hisRoll')) {
                                returnText.push('Your feel a rush of disappointment.');
                            }
                            else if (state_manager_1.$SM.get('diceGame.high') && diceVal > state_manager_1.$SM.get('diceGame.hisRoll')) {
                                returnText.push('Your feel a rush of excitement.');
                                state_manager_1.$SM.set('diceGame.win', 1);
                            }
                            else if (state_manager_1.$SM.get('diceGame.low') && diceVal > state_manager_1.$SM.get('diceGame.hisRoll')) {
                                returnText.push('Your feel a rush of disappointment.');
                            }
                            else if (state_manager_1.$SM.get('diceGame.low') && diceVal < state_manager_1.$SM.get('diceGame.hisRoll')) {
                                returnText.push('Your feel a rush of excitement.');
                                state_manager_1.$SM.set('diceGame.win', 1);
                            }
                            return returnText;
                        }
                    },
                    buttons: {
                        'results': {
                            text: function () { return (state_manager_1.$SM.get('diceGame.win') !== undefined) ? (0, translate_1._)('Oh, nice') : (0, translate_1._)('Aww, shoot'); },
                            nextScene: { 1: 'results' }
                        }
                    }
                },
                'results': {
                    text: function () { return (state_manager_1.$SM.get('diceGame.win') !== undefined) ? [
                        (0, translate_1._)('The gambler curses under his breath, then hands you something and quickly walks away.')
                    ] : [(0, translate_1._)('The gambler\'s face splits into a wide grin before disappearing beneath the brim.'),
                        (0, translate_1._)('"Better luck next time stranger."'),
                        (0, translate_1._)('He sinks back into the shadows of the alley, and his words reverberate off of the parallel walls long after you lose sight of him.')
                    ]; },
                    onLoad: function () {
                        if (state_manager_1.$SM.get('diceGame.win') !== undefined) {
                            character_1.Character.addToInventory('gambler.Prize');
                        }
                    },
                    buttons: {
                        'okay': {
                            text: (0, translate_1._)('That was fun, I guess'),
                            nextScene: 'end',
                            onChoose: function () { return state_manager_1.$SM.remove('diceGame'); }
                        }
                    }
                }
            }
        });
    }
};

},{"../../lib/textBuilder":1,"../../lib/translate":2,"../Button":3,"../characters/liz":5,"../characters/mayor":6,"../engine":7,"../events":8,"../header":10,"../player/character":15,"../state_manager":19,"../weather":20}],15:[function(require,module,exports){
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
        if (complete) {
            // if there is a next phase, set questStatus to it
            if (questLog_1.QuestLog[quest].phases[exports.Character.questStatus[quest] + 1] !== undefined) {
                exports.Character.questStatus[quest] += 1;
            }
            else { // else set it to complete
                exports.Character.questStatus[quest] = -1;
            }
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
    },
    "gambler.Prize": {
        name: 'true name of the gambler',
        text: 'You won this in a dice game',
        onUse: function () {
            notifications_1.Notifications.notify(null, 'This item has great value, but not here and now.');
        },
        destroyOnUse: false,
        destroyable: false
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
        logDescription: "The mayor has asked you to get some supplies for him from the Outpost.",
        phases: {
            0: {
                description: "Go check out the Road to the Outpost to see if you can find out more",
                requirements: {
                    0: {
                        renderRequirement: function () {
                            if (state_manager_1.$SM.get('Road.open')
                                && state_manager_1.$SM.get('Road.counter') === undefined)
                                return "I should go check out the Road to the Outpost";
                            else if (state_manager_1.$SM.get('Road.open')
                                && state_manager_1.$SM.get('Road.counter') !== undefined
                                && state_manager_1.$SM.get('superlikely.outpostUnlock') === undefined)
                                return "I should keep exploring the Road to the Outpost";
                            else if (state_manager_1.$SM.get('Road.open')
                                && state_manager_1.$SM.get('superlikely.outpostUnlock') !== undefined
                                && state_manager_1.$SM.get('superlikely.outpostUnlock') > 0)
                                return "I've found the way to the Outpost";
                        },
                        isComplete: function () {
                            return (state_manager_1.$SM.get('Road.open')
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
                                && state_manager_1.$SM.get('Outpost.captain.haveMet') === undefined)
                                return "I should try talking to the Captain of the Outpost";
                            else if (state_manager_1.$SM.get('superlikely.outpostUnlock') > 0
                                && state_manager_1.$SM.get('Outpost.captain.haveMet') !== undefined
                                && state_manager_1.$SM.get('Outpost.captain.haveMet') > 0
                                && character_1.Character.inventory["Captain.supplies"] === undefined)
                                return "I should ask the Captain about the missing supplies";
                            else if (state_manager_1.$SM.get('superlikely.outpostUnlock') > 0
                                && state_manager_1.$SM.get('Outpost.captain.haveMet') !== undefined
                                && state_manager_1.$SM.get('Outpost.captain.haveMet') > 0
                                && character_1.Character.inventory["Captain.supplies"] !== undefined)
                                return "I've gotten the supplies from the Captain";
                        },
                        isComplete: function () {
                            return (state_manager_1.$SM.get('superlikely.outpostUnlock') > 0
                                && state_manager_1.$SM.get('Outpost.captain.haveMet') !== undefined
                                && state_manager_1.$SM.get('Outpost.captain.haveMet') > 0
                                && (character_1.Character.inventory["Captain.supplies"] !== undefined
                                    || state_manager_1.$SM.get('village.mayor.haveGivenSupplies') !== undefined));
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
                            else if (state_manager_1.$SM.get('village.mayor.haveGivenSupplies') !== undefined
                                && state_manager_1.$SM.get('village.mayor.haveGivenSupplies') > 0)
                                return "I've handed over the supplies to the Mayor";
                        },
                        isComplete: function () {
                            return (state_manager_1.$SM.get('village.mayor.haveGivenSupplies') !== undefined
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
    handleStateUpdates: function (e) {
    }
};
//alias
exports.$SM = StateManager;

},{"./engine":7}],20:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL3RleHRCdWlsZGVyLnRzIiwic3JjL2xpYi90cmFuc2xhdGUudHMiLCJzcmMvc2NyaXB0L0J1dHRvbi50cyIsInNyYy9zY3JpcHQvY2hhcmFjdGVycy9jYXB0YWluLnRzIiwic3JjL3NjcmlwdC9jaGFyYWN0ZXJzL2xpei50cyIsInNyYy9zY3JpcHQvY2hhcmFjdGVycy9tYXlvci50cyIsInNyYy9zY3JpcHQvZW5naW5lLnRzIiwic3JjL3NjcmlwdC9ldmVudHMudHMiLCJzcmMvc2NyaXB0L2V2ZW50cy9yb2Fkd2FuZGVyLnRzIiwic3JjL3NjcmlwdC9oZWFkZXIudHMiLCJzcmMvc2NyaXB0L25vdGlmaWNhdGlvbnMudHMiLCJzcmMvc2NyaXB0L3BsYWNlcy9vdXRwb3N0LnRzIiwic3JjL3NjcmlwdC9wbGFjZXMvcm9hZC50cyIsInNyYy9zY3JpcHQvcGxhY2VzL3ZpbGxhZ2UudHMiLCJzcmMvc2NyaXB0L3BsYXllci9jaGFyYWN0ZXIudHMiLCJzcmMvc2NyaXB0L3BsYXllci9pdGVtTGlzdC50cyIsInNyYy9zY3JpcHQvcGxheWVyL3BlcmtMaXN0LnRzIiwic3JjL3NjcmlwdC9wbGF5ZXIvcXVlc3RMb2cudHMiLCJzcmMvc2NyaXB0L3N0YXRlX21hbmFnZXIudHMiLCJzcmMvc2NyaXB0L3dlYXRoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQSwrREFBK0Q7QUFDL0QscUNBQXFDO0FBQzlCLElBQU0sR0FBRyxHQUFHLFVBQVMsSUFBMkQ7SUFDbkYsSUFBTSxNQUFNLEdBQUcsSUFBSSxLQUFhLENBQUM7SUFDakMsS0FBSyxJQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNuQixJQUFJLE9BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRO1lBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FB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Y2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIHRleHQgYnVpbGRlciB1dGlsaXR5LCB1c2VkIGZvciBoYW5kbGluZyBjb25kaXRpb25hbCB0ZXh0IGluIFxyXG4vLyBkZXNjcmlwdGlvbnMgYW5kIG90aGVyIHRleHQgYmx1cmJzXHJcbmV4cG9ydCBjb25zdCBfdGIgPSBmdW5jdGlvbih0ZXh0OiBBcnJheTxzdHJpbmcgfCB7IHRleHQ6IHN0cmluZywgaXNWaXNpYmxlOiBGdW5jdGlvbiB9Pikge1xyXG4gICAgY29uc3Qgb3V0cHV0ID0gbmV3IEFycmF5PHN0cmluZz47XHJcbiAgICBmb3IgKGNvbnN0IGkgaW4gdGV4dCkge1xyXG4gICAgICAgIGlmICh0eXBlb2YodGV4dFtpXSkgPT09IFwic3RyaW5nXCIpIG91dHB1dC5wdXNoKHRleHRbaV0pO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoKHRleHRbaV0gYXMge3RleHQ6IHN0cmluZywgaXNWaXNpYmxlOiBGdW5jdGlvbn0pLmlzVmlzaWJsZSgpKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCgodGV4dFtpXSBhcyB7dGV4dDogc3RyaW5nLCBpc1Zpc2libGU6IEZ1bmN0aW9ufSkudGV4dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3V0cHV0O1xyXG59IiwiLy8gKGZ1bmN0aW9uKCkge1xyXG5cclxuLy8gXHR2YXIgdHJhbnNsYXRlID0gZnVuY3Rpb24odGV4dClcclxuLy8gXHR7XHJcbi8vIFx0XHR2YXIgeGxhdGUgPSB0cmFuc2xhdGVMb29rdXAodGV4dCk7XHJcblx0XHRcclxuLy8gXHRcdGlmICh0eXBlb2YgeGxhdGUgPT0gXCJmdW5jdGlvblwiKVxyXG4vLyBcdFx0e1xyXG4vLyBcdFx0XHR4bGF0ZSA9IHhsYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbi8vIFx0XHR9XHJcbi8vIFx0XHRlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSlcclxuLy8gXHRcdHtcclxuLy8gXHRcdFx0dmFyIGFwcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcclxuLy8gXHRcdFx0dmFyIGFyZ3MgPSBhcHMuY2FsbCggYXJndW1lbnRzLCAxICk7XHJcbiAgXHJcbi8vIFx0XHRcdHhsYXRlID0gZm9ybWF0dGVyKHhsYXRlLCBhcmdzKTtcclxuLy8gXHRcdH1cclxuXHRcdFxyXG4vLyBcdFx0cmV0dXJuIHhsYXRlO1xyXG4vLyBcdH07XHJcblx0XHJcbi8vIFx0Ly8gSSB3YW50IGl0IGF2YWlsYWJsZSBleHBsaWNpdHkgYXMgd2VsbCBhcyB2aWEgdGhlIG9iamVjdFxyXG4vLyBcdHRyYW5zbGF0ZS50cmFuc2xhdGUgPSB0cmFuc2xhdGU7XHJcblx0XHJcbi8vIFx0Ly9mcm9tIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tLzc3NjE5NiB2aWEgaHR0cDovL2RhdmVkYXNoLmNvbS8yMDEwLzExLzE5L3B5dGhvbmljLXN0cmluZy1mb3JtYXR0aW5nLWluLWphdmFzY3JpcHQvIFxyXG4vLyBcdHZhciBkZWZhdWx0Rm9ybWF0dGVyID0gKGZ1bmN0aW9uKCkge1xyXG4vLyBcdFx0dmFyIHJlID0gL1xceyhbXn1dKylcXH0vZztcclxuLy8gXHRcdHJldHVybiBmdW5jdGlvbihzLCBhcmdzKSB7XHJcbi8vIFx0XHRcdHJldHVybiBzLnJlcGxhY2UocmUsIGZ1bmN0aW9uKF8sIG1hdGNoKXsgcmV0dXJuIGFyZ3NbbWF0Y2hdOyB9KTtcclxuLy8gXHRcdH07XHJcbi8vIFx0fSgpKTtcclxuLy8gXHR2YXIgZm9ybWF0dGVyID0gZGVmYXVsdEZvcm1hdHRlcjtcclxuLy8gXHR0cmFuc2xhdGUuc2V0Rm9ybWF0dGVyID0gZnVuY3Rpb24obmV3Rm9ybWF0dGVyKVxyXG4vLyBcdHtcclxuLy8gXHRcdGZvcm1hdHRlciA9IG5ld0Zvcm1hdHRlcjtcclxuLy8gXHR9O1xyXG5cdFxyXG4vLyBcdHRyYW5zbGF0ZS5mb3JtYXQgPSBmdW5jdGlvbigpXHJcbi8vIFx0e1xyXG4vLyBcdFx0dmFyIGFwcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcclxuLy8gXHRcdHZhciBzID0gYXJndW1lbnRzWzBdO1xyXG4vLyBcdFx0dmFyIGFyZ3MgPSBhcHMuY2FsbCggYXJndW1lbnRzLCAxICk7XHJcbiAgXHJcbi8vIFx0XHRyZXR1cm4gZm9ybWF0dGVyKHMsIGFyZ3MpO1xyXG4vLyBcdH07XHJcblxyXG4vLyBcdHZhciBkeW5vVHJhbnMgPSBudWxsO1xyXG4vLyBcdHRyYW5zbGF0ZS5zZXREeW5hbWljVHJhbnNsYXRvciA9IGZ1bmN0aW9uKG5ld0R5bm9UcmFucylcclxuLy8gXHR7XHJcbi8vIFx0XHRkeW5vVHJhbnMgPSBuZXdEeW5vVHJhbnM7XHJcbi8vIFx0fTtcclxuXHJcbi8vIFx0dmFyIHRyYW5zbGF0aW9uID0gbnVsbDtcclxuLy8gXHR0cmFuc2xhdGUuc2V0VHJhbnNsYXRpb24gPSBmdW5jdGlvbihuZXdUcmFuc2xhdGlvbilcclxuLy8gXHR7XHJcbi8vIFx0XHR0cmFuc2xhdGlvbiA9IG5ld1RyYW5zbGF0aW9uO1xyXG4vLyBcdH07XHJcblx0XHJcbi8vIFx0ZnVuY3Rpb24gdHJhbnNsYXRlTG9va3VwKHRhcmdldClcclxuLy8gXHR7XHJcbi8vIFx0XHRpZiAodHJhbnNsYXRpb24gPT0gbnVsbCB8fCB0YXJnZXQgPT0gbnVsbClcclxuLy8gXHRcdHtcclxuLy8gXHRcdFx0cmV0dXJuIHRhcmdldDtcclxuLy8gXHRcdH1cclxuXHRcdFxyXG4vLyBcdFx0aWYgKHRhcmdldCBpbiB0cmFuc2xhdGlvbiA9PSBmYWxzZSlcclxuLy8gXHRcdHtcclxuLy8gXHRcdFx0aWYgKGR5bm9UcmFucyAhPSBudWxsKVxyXG4vLyBcdFx0XHR7XHJcbi8vIFx0XHRcdFx0cmV0dXJuIGR5bm9UcmFucyh0YXJnZXQpO1xyXG4vLyBcdFx0XHR9XHJcbi8vIFx0XHRcdHJldHVybiB0YXJnZXQ7XHJcbi8vIFx0XHR9XHJcblx0XHRcclxuLy8gXHRcdHZhciByZXN1bHQgPSB0cmFuc2xhdGlvblt0YXJnZXRdO1xyXG4vLyBcdFx0aWYgKHJlc3VsdCA9PSBudWxsKVxyXG4vLyBcdFx0e1xyXG4vLyBcdFx0XHRyZXR1cm4gdGFyZ2V0O1xyXG4vLyBcdFx0fVxyXG5cdFx0XHJcbi8vIFx0XHRyZXR1cm4gcmVzdWx0O1xyXG4vLyBcdH07XHJcblx0XHJcbi8vIFx0d2luZG93Ll8gPSB0cmFuc2xhdGU7XHJcblxyXG4vLyB9KSgpO1xyXG5cclxuLy8gZXhwb3J0IGNvbnN0IF8gPSB3aW5kb3cuXztcclxuXHJcbmV4cG9ydCBjb25zdCBfID0gZnVuY3Rpb24ocykgeyByZXR1cm4gczsgfSIsImltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uL2xpYi90cmFuc2xhdGVcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBCdXR0b24gPSB7XHJcblx0QnV0dG9uOiBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0XHRpZih0eXBlb2Ygb3B0aW9ucy5jb29sZG93biA9PSAnbnVtYmVyJykge1xyXG5cdFx0XHR0aGlzLmRhdGFfY29vbGRvd24gPSBvcHRpb25zLmNvb2xkb3duO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5kYXRhX3JlbWFpbmluZyA9IDA7XHJcblx0XHRpZih0eXBlb2Ygb3B0aW9ucy5jbGljayA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdHRoaXMuZGF0YV9oYW5kbGVyID0gb3B0aW9ucy5jbGljaztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dmFyIGVsID0gJCgnPGRpdj4nKVxyXG5cdFx0XHQuYXR0cignaWQnLCB0eXBlb2Yob3B0aW9ucy5pZCkgIT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmlkIDogXCJCVE5fXCIgKyBFbmdpbmUuZ2V0R3VpZCgpKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2J1dHRvbicpXHJcblx0XHRcdC50ZXh0KHR5cGVvZihvcHRpb25zLnRleHQpICE9ICd1bmRlZmluZWQnID8gb3B0aW9ucy50ZXh0IDogXCJidXR0b25cIilcclxuXHRcdFx0LmNsaWNrKGZ1bmN0aW9uKCkgeyBcclxuXHRcdFx0XHRpZighJCh0aGlzKS5oYXNDbGFzcygnZGlzYWJsZWQnKSkge1xyXG5cdFx0XHRcdFx0QnV0dG9uLmNvb2xkb3duKCQodGhpcykpO1xyXG5cdFx0XHRcdFx0JCh0aGlzKS5kYXRhKFwiaGFuZGxlclwiKSgkKHRoaXMpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHRcdC5kYXRhKFwiaGFuZGxlclwiLCAgdHlwZW9mIG9wdGlvbnMuY2xpY2sgPT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnMuY2xpY2sgOiBmdW5jdGlvbigpIHsgRW5naW5lLmxvZyhcImNsaWNrXCIpOyB9KVxyXG5cdFx0XHQuZGF0YShcInJlbWFpbmluZ1wiLCAwKVxyXG5cdFx0XHQuZGF0YShcImNvb2xkb3duXCIsIHR5cGVvZiBvcHRpb25zLmNvb2xkb3duID09ICdudW1iZXInID8gb3B0aW9ucy5jb29sZG93biA6IDApO1xyXG5cdFx0aWYgKG9wdGlvbnMuaW1hZ2UgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRlbC5hdHRyKFwic3R5bGVcIiwgXCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXFxcIlwiICsgb3B0aW9ucy5pbWFnZSArIFwiXFxcIik7IGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7IGJhY2tncm91bmQtc2l6ZTogY292ZXI7IGhlaWdodDogMTcwcHg7IGNvbG9yOiB3aGl0ZTt0ZXh0LXNoYWRvdzogMHB4IDBweCAycHggYmxhY2tcIilcclxuXHRcdH1cclxuXHRcdGVsLmFwcGVuZCgkKFwiPGRpdj5cIikuYWRkQ2xhc3MoJ2Nvb2xkb3duJykpO1xyXG5cdFx0XHJcblx0XHRpZihvcHRpb25zLmNvc3QpIHtcclxuXHRcdFx0dmFyIHR0UG9zID0gb3B0aW9ucy50dFBvcyA/IG9wdGlvbnMudHRQb3MgOiBcImJvdHRvbSByaWdodFwiO1xyXG5cdFx0XHR2YXIgY29zdFRvb2x0aXAgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCd0b29sdGlwICcgKyB0dFBvcyk7XHJcblx0XHRcdGZvcih2YXIgayBpbiBvcHRpb25zLmNvc3QpIHtcclxuXHRcdFx0XHQkKFwiPGRpdj5cIikuYWRkQ2xhc3MoJ3Jvd19rZXknKS50ZXh0KF8oaykpLmFwcGVuZFRvKGNvc3RUb29sdGlwKTtcclxuXHRcdFx0XHQkKFwiPGRpdj5cIikuYWRkQ2xhc3MoJ3Jvd192YWwnKS50ZXh0KG9wdGlvbnMuY29zdFtrXSkuYXBwZW5kVG8oY29zdFRvb2x0aXApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNvc3RUb29sdGlwLmNoaWxkcmVuKCkubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdGNvc3RUb29sdGlwLmFwcGVuZFRvKGVsKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZihvcHRpb25zLndpZHRoKSB7XHJcblx0XHRcdGVsLmNzcygnd2lkdGgnLCBvcHRpb25zLndpZHRoKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGVsO1xyXG5cdH0sXHJcblx0XHJcblx0c2V0RGlzYWJsZWQ6IGZ1bmN0aW9uKGJ0biwgZGlzYWJsZWQpIHtcclxuXHRcdGlmKGJ0bikge1xyXG5cdFx0XHRpZighZGlzYWJsZWQgJiYgIWJ0bi5kYXRhKCdvbkNvb2xkb3duJykpIHtcclxuXHRcdFx0XHRidG4ucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdH0gZWxzZSBpZihkaXNhYmxlZCkge1xyXG5cdFx0XHRcdGJ0bi5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRidG4uZGF0YSgnZGlzYWJsZWQnLCBkaXNhYmxlZCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRpc0Rpc2FibGVkOiBmdW5jdGlvbihidG4pIHtcclxuXHRcdGlmKGJ0bikge1xyXG5cdFx0XHRyZXR1cm4gYnRuLmRhdGEoJ2Rpc2FibGVkJykgPT09IHRydWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHRcclxuXHRjb29sZG93bjogZnVuY3Rpb24oYnRuKSB7XHJcblx0XHR2YXIgY2QgPSBidG4uZGF0YShcImNvb2xkb3duXCIpO1xyXG5cdFx0aWYoY2QgPiAwKSB7XHJcblx0XHRcdCQoJ2Rpdi5jb29sZG93bicsIGJ0bikuc3RvcCh0cnVlLCB0cnVlKS53aWR0aChcIjEwMCVcIikuYW5pbWF0ZSh7d2lkdGg6ICcwJSd9LCBjZCAqIDEwMDAsICdsaW5lYXInLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgYiA9ICQodGhpcykuY2xvc2VzdCgnLmJ1dHRvbicpO1xyXG5cdFx0XHRcdGIuZGF0YSgnb25Db29sZG93bicsIGZhbHNlKTtcclxuXHRcdFx0XHRpZighYi5kYXRhKCdkaXNhYmxlZCcpKSB7XHJcblx0XHRcdFx0XHRiLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdGJ0bi5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdFx0YnRuLmRhdGEoJ29uQ29vbGRvd24nLCB0cnVlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGNsZWFyQ29vbGRvd246IGZ1bmN0aW9uKGJ0bikge1xyXG5cdFx0JCgnZGl2LmNvb2xkb3duJywgYnRuKS5zdG9wKHRydWUsIHRydWUpO1xyXG5cdFx0YnRuLmRhdGEoJ29uQ29vbGRvd24nLCBmYWxzZSk7XHJcblx0XHRpZighYnRuLmRhdGEoJ2Rpc2FibGVkJykpIHtcclxuXHRcdFx0YnRuLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0fVxyXG5cdH1cclxufTsiLCJpbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCJcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIlxyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIlxyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tIFwiLi4vcGxheWVyL2NoYXJhY3RlclwiXHJcblxyXG5leHBvcnQgY29uc3QgQ2FwdGFpbiA9IHtcclxuXHR0YWxrVG9DYXB0YWluOiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ1RoZSBDYXB0YWluXFwncyBUZW50JyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VlbkZsYWc6ICgpID0+ICRTTS5nZXQoJ091dHBvc3QuY2FwdGFpbi5oYXZlTWV0JyksXHJcblx0XHRcdFx0XHRuZXh0U2NlbmU6ICdtYWluJyxcclxuXHRcdFx0XHRcdG9uTG9hZDogKCkgPT4gJFNNLnNldCgnT3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnLCAxKSxcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnWW91IGVudGVyIHRoZSBmYW5jaWVzdC1sb29raW5nIHRlbnQgaW4gdGhlIE91dHBvc3QuIEEgbGFyZ2UgbWFuIHdpdGggYSB0b290aGJydXNoIG11c3RhY2hlIGFuZCBhIHNldmVyZSBmcm93biBsb29rcyB1cCBmcm9tIGhpcyBkZXNrLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIlNpciwgeW91IGhhdmUgZW50ZXJlZCB0aGUgdGVudCBvZiBDYXB0YWluIEZpbm5lYXMuIFdoYXQgYnVzaW5lc3MgZG8geW91IGhhdmUgaGVyZT9cIicpXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhc2tBYm91dFN1cHBsaWVzJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnQXNrIEFib3V0IFN1cHBsaWVzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOidhc2tBYm91dFN1cHBsaWVzJ30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNob29zZTogQ2FwdGFpbi5oYW5kbGVTdXBwbGllcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZTogKCkgPT4gISRTTS5nZXQoJ091dHBvc3QuY2FwdGFpbi5hc2tlZEFib3V0U3VwcGxpZXMnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXNrQWJvdXRDYXB0YWluJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnQXNrIEFib3V0IENhcHRhaW4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6ICdjYXB0YWluUmFtYmxlJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnTGVhdmUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAnbWFpbic6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1RoZSBDYXB0YWluIGdyZWV0cyB5b3Ugd2FybWx5LicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIkFoaCwgeWVzLCB3ZWxjb21lIGJhY2suIFdoYXQgY2FuIEkgZG8gZm9yIHlvdT9cIicpXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhc2tBYm91dFN1cHBsaWVzJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnQXNrIEFib3V0IFN1cHBsaWVzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOidhc2tBYm91dFN1cHBsaWVzJ30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNob29zZTogQ2FwdGFpbi5oYW5kbGVTdXBwbGllcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZTogKCkgPT4gISRTTS5nZXQoJ091dHBvc3QuY2FwdGFpbi5hc2tlZEFib3V0U3VwcGxpZXMnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXNrQWJvdXRDYXB0YWluJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnQXNrIEFib3V0IENhcHRhaW4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6J2NhcHRhaW5SYW1ibGUnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnbGVhdmUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdMZWF2ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICdjYXB0YWluUmFtYmxlJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnVGhlIENhcHRhaW5cXCdzIGV5ZXMgZ2xlYW0gYXQgdGhlIG9wcG9ydHVuaXR5IHRvIHJ1biBkb3duIGhpcyBsaXN0IG9mIGFjaGlldmVtZW50cy4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCJXaHksIElcXCdsbCBoYXZlIHlvdSBrbm93IHRoYXQgeW91IHN0YW5kIGluIHRoZSBwcmVzZW5jZSBvZiBub25lIG90aGVyIHRoYW4gRmlubmVhcyBKLiBGb2JzbGV5LCBDYXB0YWluIG9mIHRoZSBSb3lhbCBBcm15XFwncyBGaWZ0aCBEaXZpc2lvbiwgdGhlIGZpbmVzdCBEaXZpc2lvbiBpbiBIaXMgTWFqZXN0eVxcJ3Mgc2VydmljZS5cIicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdIZSBwdWZmcyBvdXQgaGlzIGNoZXN0LCBkcmF3aW5nIGF0dGVudGlvbiB0byBoaXMgbWFueSBtZWRhbHMuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiSSBoYXZlIGNhbXBhaWduZWQgb24gYmVoYWxmIG9mIE91ciBMb3Jkc2hpcCBhY3Jvc3MgbWFueSBsYW5kcywgaW5jbHVkaW5nIFRoZSBGYXIgV2VzdCwgdGhlIG5vcnRoZXJuIGJvcmRlcnMgb2YgVW1iZXJzaGlyZSBhbmQgUGVsaW5nYWwsIE5ldyBCZWxsaXNpYSwgYW5kIGVhY2ggb2YgdGhlIEZpdmUgSXNsZXMgb2YgdGhlIFBpcnJoaWFuIFNlYS5cIicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdIZSBwYXVzZXMgZm9yIGEgbW9tZW50LCBwZXJoYXBzIHRvIHNlZSBpZiB5b3UgYXJlIHN1aXRhYmx5IGltcHJlc3NlZCwgdGhlbiBjb250aW51ZXMuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiQXMgQ2FwdGFpbiBvZiB0aGUgRmlmdGggRGl2aXNpb24sIEkgaGFkIHRoZSBlc3RlZW1lZCBwcml2aWxlZ2Ugb2YgZW5zdXJpbmcgdGhlIHNhZmV0eSBvZiB0aGVzZSBsYW5kcyBmb3Igb3VyIGZhaXIgY2l0aXplbnMuIEkgaGF2ZSBiZWVuIGF3YXJkZWQgbWFueSB0aW1lcyBvdmVyIGZvciBteSBicmF2ZXJ5IGluIHRoZSBmYWNlIG9mIHV0bW9zdCBwZXJpbC4gRm9yIGluc3RhbmNlLCBkdXJpbmcgdGhlIFNlYSBDYW1wYWlnbiBvbiBUaHlwcGUsIFRoaXJkIG9mIHRoZSBGaXZlIElzbGVzLCB3ZSB3ZXJlIGFtYnVzaGVkIHdoaWxlIGRpc2VtYmFya2luZyBmcm9tIG91ciBzaGlwLiBUaGlua2luZyBxdWlja2x5LCBJLi4uXCInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnVGhlIGNhcHRhaW4gY29udGludWVzIHRvIHJhbWJsZSBsaWtlIHRoaXMgZm9yIHNldmVyYWwgbW9yZSBtaW51dGVzLCBnaXZpbmcgeW91IHRpbWUgdG8gYmVjb21lIG11Y2ggbW9yZSBmYW1pbGlhciB3aXRoIHRoZSBkaXJ0IHVuZGVyIHlvdXIgZmluZ2VybmFpbHMuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiLi4uIGFuZCBUSEFULCBteSBnb29kIGFkdmVudHVyZXIsIGlzIHdoeSBJIGFsd2F5cyBrZWVwIGZyZXNoIGJhc2lsIG9uIGhhbmQuXCInKVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnZmFzY2luYXRpbmcnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdGYXNjaW5hdGluZycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTonbWFpbkNvbnRpbnVlZCd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgJ21haW5Db250aW51ZWQnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdUaGUgQ2FwdGFpbiBzaHVmZmxlcyBoaXMgcGFwZXJzIGluIGEgc29tZXdoYXQgcGVyZm9ybWF0aXZlIHdheS4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCJXYXMgdGhlcmUgc29tZXRoaW5nIGVsc2UgeW91IG5lZWRlZD9cIicpXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhc2tBYm91dFN1cHBsaWVzJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnQXNrIEFib3V0IFN1cHBsaWVzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOidhc2tBYm91dFN1cHBsaWVzJ30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNob29zZTogQ2FwdGFpbi5oYW5kbGVTdXBwbGllcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZTogKCkgPT4gISRTTS5nZXQoJ091dHBvc3QuY2FwdGFpbi5hc2tlZEFib3V0U3VwcGxpZXMnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXNrQWJvdXRDYXB0YWluJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnQXNrIEFib3V0IENhcHRhaW4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6J2NhcHRhaW5SYW1ibGUnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnbGVhdmUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdMZWF2ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICdhc2tBYm91dFN1cHBsaWVzJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnVGhlIENhcHRhaW5cXCdzIGV5ZXMgZ2xlYW0gd2l0aCBhIG1peHR1cmUgb2YgcmVhbGl6YXRpb24gYW5kIGd1aWx0LicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIkFoaCwgeWVzLCByaWdodCwgdGhlIHN1cHBsaWVzLiBJIHN1cHBvc2UgdGhlIE1heW9yIGlzIHN0aWxsIHdhaXRpbmcgZm9yIHRob3NlLiBIYXZlIGEgbG9vayBpbiB0aGF0IGNoZXN0IG92ZXIgdGhlcmUsIGl0IHNob3VsZCBoYXZlIGV2ZXJ5dGhpbmcgeW91IG5lZWQuXCInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnSGUgaW5kaWNhdGVzIHRvIGEgY2hlc3QgYXQgdGhlIGJhY2sgb2YgdGhlIHJvb20uIFlvdSBvcGVuIHRoZSBsaWQsIHJldmVhbGluZyB0aGUgc3VwcGxpZXMgd2l0aGluLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdZb3UgdGFrZSB0aGUgc3VwcGxpZXMuJylcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdHb29kIFN0dWZmJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfSxcclxuXHJcbiAgICBoYW5kbGVTdXBwbGllczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJFNNLnNldCgnT3V0cG9zdC5jYXB0YWluLmFza2VkQWJvdXRTdXBwbGllcycsIDEpO1xyXG4gICAgICAgIENoYXJhY3Rlci5hZGRUb0ludmVudG9yeShcIkNhcHRhaW4uc3VwcGxpZXNcIik7XHJcbiAgICAgICAgQ2hhcmFjdGVyLmNoZWNrUXVlc3RTdGF0dXMoXCJtYXlvclN1cHBsaWVzXCIpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgVmlsbGFnZSB9IGZyb20gXCIuLi9wbGFjZXMvdmlsbGFnZVwiO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tIFwiLi4vcGxheWVyL2NoYXJhY3RlclwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IExpeiA9IHtcclxuICAgIHNldExpekFjdGl2ZTogZnVuY3Rpb24oKSB7XHJcblx0XHQkU00uc2V0KCd2aWxsYWdlLmxpekFjdGl2ZScsIDEpO1xyXG5cdFx0JFNNLnNldCgndmlsbGFnZS5saXouY2FuRmluZEJvb2snLCAwKTtcclxuXHRcdCRTTS5zZXQoJ3ZpbGxhZ2UubGl6Lmhhc0Jvb2snLCAxKTtcclxuXHRcdFZpbGxhZ2UudXBkYXRlQnV0dG9uKCk7XHJcblx0fSxcclxuXHJcblx0dGFsa1RvTGl6OiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ0xpelxcJ3MgaG91c2UsIGF0IHRoZSBlZGdlIG9mIHRvd24nKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuXHRcdFx0XHRcdHNlZW5GbGFnOiAoKSA9PiAkU00uZ2V0KCd2aWxsYWdlLmxpei5oYXZlTWV0JyksXHJcblx0XHRcdFx0XHRuZXh0U2NlbmU6ICdtYWluJyxcclxuXHRcdFx0XHRcdG9uTG9hZDogKCkgPT4gJFNNLnNldCgndmlsbGFnZS5saXouaGF2ZU1ldCcsIDEpLFxyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdZb3UgZW50ZXIgdGhlIGJ1aWxkaW5nIGFuZCBhcmUgaW1tZWRpYXRlbHkgcGx1bmdlZCBpbnRvIGEgbGFieXJpbnRoIG9mIHNoZWx2ZXMgaGFwaGF6YXJkbHkgZmlsbGVkIHdpdGggYm9va3Mgb2YgYWxsIGtpbmRzLiBBZnRlciBhIGJpdCBvZiBzZWFyY2hpbmcsIHlvdSBmaW5kIGEgc2lkZSByb29tIHdoZXJlIGEgd29tYW4gd2l0aCBtb3VzeSBoYWlyIGFuZCBnbGFzc2VzIGlzIHNpdHRpbmcgYXQgYSB3cml0aW5nIGRlc2suIFNoZVxcJ3MgcmVhZGluZyBhIGxhcmdlIGJvb2sgdGhhdCBhcHBlYXJzIHRvIGluY2x1ZGUgZGlhZ3JhbXMgb2Ygc29tZSBzb3J0IG9mIHBsYW50LiBTaGUgbG9va3MgdXAgYXMgeW91IGVudGVyIHRoZSByb29tLicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIldobyB0aGUgaGVsbCBhcmUgeW91P1wiJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdhc2tBYm91dFRvd24nOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGFib3V0IENoYWR0b3BpYScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdjaGFkdG9waWFSYW1ibGUnfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQncXVlc3QnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGZvciBhIHF1ZXN0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ3F1ZXN0UmVxdWVzdCd9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdsZWF2ZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdMZWF2ZScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J2NoYWR0b3BpYVJhbWJsZSc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnTGl6IGxvb2tzIGF0IHlvdSBmb3IgYSBtb21lbnQgYmVmb3JlIHJldHVybmluZyBoZXIgZ2F6ZSB0byB0aGUgYm9vayBpbiBmcm9udCBvZiBoZXIuJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiVGhlcmVcXCdzIGEgYm9vayBpbiBoZXJlIHNvbWV3aGVyZSBhYm91dCB0aGUgZm91bmRpbmcgb2YgQ2hhZHRvcGlhLiBJZiB5b3UgY2FuIGZpbmQgaXQsIHlvdVxcJ3JlIGZyZWUgdG8gYm9ycm93IGl0LlwiJyldLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnb2theSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdPa2F5LCB0aGVuLicpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdtYWluJ30sXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6ICgpID0+ICRTTS5zZXQoJ3ZpbGxhZ2UubGl6LmNhbkZpbmRCb29rJywgdHJ1ZSlcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblxyXG5cdFx0XHRcdCdtYWluJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW18oJ0xpeiBzZWVtcyBkZXRlcm1pbmVkIG5vdCB0byBwYXkgYXR0ZW50aW9uIHRvIHlvdS4nKV0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdhc2tBYm91dFRvd24nOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGFib3V0IENoYWR0b3BpYScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdjaGFkdG9waWFSYW1ibGUnfSxcclxuXHRcdFx0XHRcdFx0XHRhdmFpbGFibGU6ICgpID0+ICEkU00uZ2V0KCd2aWxsYWdlLmxpei5jYW5GaW5kQm9vaycpXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdxdWVzdCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgZm9yIGEgcXVlc3QnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAncXVlc3RSZXF1ZXN0J31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2ZpbmRCb29rJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ1RyeSB0byBmaW5kIHRoZSBib29rJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2ZpbmRCb29rJ30sXHJcblx0XHRcdFx0XHRcdFx0Ly8gVE9ETzogYSBcInZpc2libGVcIiBmbGFnIHdvdWxkIGJlIGdvb2QgaGVyZSwgZm9yIHNpdHVhdGlvbnMgd2hlcmUgYW4gb3B0aW9uXHJcblx0XHRcdFx0XHRcdFx0Ly8gICBpc24ndCB5ZXQga25vd24gdG8gdGhlIHBsYXllclxyXG5cdFx0XHRcdFx0XHRcdHZpc2libGU6ICgpID0+ICRTTS5nZXQoJ3ZpbGxhZ2UubGl6LmNhbkZpbmRCb29rJyksXHJcblx0XHRcdFx0XHRcdFx0YXZhaWxhYmxlOiAoKSA9PiAoJFNNLmdldCgndmlsbGFnZS5saXouY2FuRmluZEJvb2snKSBhcyBudW1iZXIgPiAwKSAmJiAoJFNNLmdldCgndmlsbGFnZS5saXouaGFzQm9vaycpKVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnbGVhdmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnTGVhdmUnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdmaW5kQm9vayc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnTGVhdmluZyBMaXogdG8gaGVyIGJ1c2luZXNzLCB5b3Ugd2FuZGVyIGFyb3VuZCBhbWlkc3QgdGhlIGJvb2tzLCB3b25kZXJpbmcgaG93IHlvdVxcJ2xsIGV2ZXIgbWFuYWdlIHRvIGZpbmQgd2hhdCB5b3VcXCdyZSBsb29raW5nIGZvciBpbiBhbGwgdGhpcyB1bm9yZ2FuaXplZCBtZXNzLicpLFxyXG5cdFx0XHRcdFx0XHRfKCdGb3J0dW5hdGVseSwgdGhlIGNyZWF0b3Igb2YgdGhpcyBnYW1lIGRvZXNuXFwndCBmZWVsIGxpa2UgaXRcXCdkIGJlIHZlcnkgaW50ZXJlc3RpbmcgdG8gbWFrZSB0aGlzIGludG8gYSBwdXp6bGUsIHNvIHlvdSBzcG90IHRoZSBib29rIG9uIGEgbmVhcmJ5IHNoZWxmIGFuZCBncmFiIGl0LicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnc2ljayc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdPaCwgc2ljaycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6ICgpID0+IHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vICRTTS5zZXQoJ3N0b3Jlcy5XZWlyZCBCb29rJywgMSk7XHJcblx0XHRcdFx0XHRcdFx0XHRDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoXCJMaXoud2VpcmRCb29rXCIpO1xyXG5cdFx0XHRcdFx0XHRcdFx0JFNNLnNldCgndmlsbGFnZS5saXouaGFzQm9vaycsIDApO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J3F1ZXN0UmVxdWVzdCc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnTGl6IGxldHMgb3V0IGFuIGFubm95ZWQgc2lnaC4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJPaCBicmF2ZSBhZHZlbnR1cmVyLCBJIHNlZW0gdG8gaGF2ZSBsb3N0IG15IHBhdGllbmNlLiBXaGVuIGxhc3QgSSBzYXcgaXQsIGl0IHdhcyBzb21ld2hlcmUgb3V0c2lkZSBvZiB0aGlzIGJ1aWxkaW5nLiBXb3VsZHN0IHRob3UgcmVjb3ZlciB0aGF0IHdoaWNoIGhhcyBiZWVuIHN0b2xlbiBmcm9tIG1lP1wiJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdva2F5Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ09rYXksIGplZXosIEkgZ2V0IGl0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ21haW4nfVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcbn0iLCJpbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyBMaXogfSBmcm9tIFwiLi9saXpcIjtcclxuaW1wb3J0IHsgUm9hZCB9IGZyb20gXCIuLi9wbGFjZXMvcm9hZFwiO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tIFwiLi4vcGxheWVyL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgeyBWaWxsYWdlIH0gZnJvbSBcIi4uL3BsYWNlcy92aWxsYWdlXCI7XHJcblxyXG5leHBvcnQgY29uc3QgTWF5b3IgPSB7XHJcbiAgICB0YWxrVG9NYXlvcjogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdNZWV0IHRoZSBNYXlvcicpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0c2VlbkZsYWc6ICgpID0+ICRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZU1ldCcpLFxyXG5cdFx0XHRcdFx0bmV4dFNjZW5lOiAnbWFpbicsXHJcblx0XHRcdFx0XHRvbkxvYWQ6ICgpID0+ICRTTS5zZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZU1ldCcsIDEpLFxyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdUaGUgbWF5b3Igc21pbGVzIGF0IHlvdSBhbmQgc2F5czonKSxcclxuXHRcdFx0XHRcdFx0XygnXCJXZWxjb21lIHRvIENoYWR0b3BpYSwgSVxcJ20gdGhlIG1heW9yIG9mIHRoZXNlIGhlcmUgcGFydHMuIFdoYXQgY2FuIEkgZG8geW91IGZvcj9cIicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnYXNrQWJvdXRUb3duJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBhYm91dCBDaGFkdG9waWEnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnY2hhZHRvcGlhUmFtYmxlJ31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J3F1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBmb3IgYSBxdWVzdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdxdWVzdCd9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdsZWF2ZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdMZWF2ZScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J2NoYWR0b3BpYVJhbWJsZSc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnVGhlIG1heW9yIHB1c2hlcyB0aGUgYnJpbSBvZiBoaXMgaGF0IHVwLicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIldlbGwsIHdlXFwndmUgYWx3YXlzIGJlZW4gaGVyZSwgbG9uZyBhcyBJIGNhbiByZW1lbWJlci4gSSB0b29rIG92ZXIgYWZ0ZXIgdGhlIGxhc3QgbWF5b3IgZGllZCwgYnV0IGhlIHdvdWxkIGhhdmUgYmVlbiB0aGUgb25seSBwZXJzb24gd2l0aCBhbnkgaGlzdG9yaWNhbCBrbm93bGVkZ2Ugb2YgdGhpcyB2aWxsYWdlLlwiJyksXHJcblx0XHRcdFx0XHRcdF8oJ0hlIHBhdXNlcyBmb3IgYSBtb21lbnQgYW5kIHRvdXNsZXMgc29tZSBvZiB0aGUgd2lzcHkgaGFpcnMgdGhhdCBoYXZlIHBva2VkIG91dCBmcm9tIHVuZGVyIHRoZSByYWlzZWQgaGF0LicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIkFjdHVhbGx5LCB5b3UgbWlnaHQgYXNrIExpeiwgc2hlIGhhcyBhIGJ1bmNoIG9mIGhlciBtb3RoZXJcXCdzIGJvb2tzIGZyb20gd2F5IGJhY2sgd2hlbi4gU2hlIGxpdmVzIGF0IHRoZSBlZGdlIG9mIHRvd24uXCInKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J29rYXknOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnT2theSwgdGhlbi4nKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnbWFpbid9LFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBMaXouc2V0TGl6QWN0aXZlXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdtYWluJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdUaGUgbWF5b3Igc2F5czonKSxcclxuXHRcdFx0XHRcdFx0XygnXCJBbnl3YXksIHdoYXQgRUxTRSBjYW4gSSBkbyB5b3UgZm9yP1wiJyksXHJcblx0XHRcdFx0XHRcdF8oJ0hlIGNodWNrbGVzIGF0IGhpcyBjbGV2ZXIgdXNlIG9mIGxhbmd1YWdlLicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnYXNrQWJvdXRUb3duJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBhYm91dCBDaGFkdG9waWEnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnY2hhZHRvcGlhUmFtYmxlJ30sXHJcblx0XHRcdFx0XHRcdFx0Ly8gaW1hZ2U6IFwiYXNzZXRzL2NhcmRzL2xpdHRsZV93b2xmLnBuZ1wiXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdxdWVzdCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgZm9yIGEgcXVlc3QnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAncXVlc3QnfSxcclxuXHRcdFx0XHRcdFx0XHRhdmFpbGFibGU6ICgpID0+XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBub3QgYXZhaWxhYmxlIGlmIG1heW9yU3VwcGxpZXMgaXMgaW4tcHJvZ3Jlc3NcclxuXHRcdFx0XHRcdFx0XHRcdChDaGFyYWN0ZXIucXVlc3RTdGF0dXNbXCJtYXlvclN1cHBsaWVzXCJdID09PSB1bmRlZmluZWQpXHJcblx0XHRcdFx0XHRcdFx0XHQvLyByZS1hZGQgdGhpcyBjb25kaXRpb24gbGF0ZXIsIHdlIG5lZWQgdG8gc2VuZCB0aGVtIHRvIGEgZGlmZmVyZW50XHJcblx0XHRcdFx0XHRcdFx0XHQvLyAgIHF1ZXN0IGRpYWxvZyBpZiB0aGV5IGFscmVhZHkgZGlkIHRoZSBmaXJzdCBxdWVzdFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gfHwgKENoYXJhY3Rlci5xdWVzdFN0YXR1c1tcIm1heW9yU3VwcGxpZXNcIl0gPT0gLTEpXHJcblx0XHRcdFx0XHRcdFx0Ly8gaW1hZ2U6IFwiYXNzZXRzL2NhcmRzL2pva2VyLnBuZ1wiXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdnaXZlU3VwcGxpZXMnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnSGFuZCBvdmVyIHRoZSBzdXBwbGllcycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdnaXZlU3VwcGxpZXMnfSxcclxuXHRcdFx0XHRcdFx0XHRhdmFpbGFibGU6ICgpID0+IFxyXG5cdFx0XHRcdFx0XHRcdFx0KCRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnKSA9PT0gdW5kZWZpbmVkKSBcclxuXHRcdFx0XHRcdFx0XHRcdCYmIChDaGFyYWN0ZXIucXVlc3RTdGF0dXNbXCJtYXlvclN1cHBsaWVzXCJdICE9PSB1bmRlZmluZWQpXHJcblx0XHRcdFx0XHRcdFx0XHQmJiBDaGFyYWN0ZXIuaW52ZW50b3J5W1wiQ2FwdGFpbi5zdXBwbGllc1wiXSxcclxuXHRcdFx0XHRcdFx0XHR2aXNpYmxlOiAoKSA9PlxyXG5cdFx0XHRcdFx0XHRcdFx0KENoYXJhY3Rlci5xdWVzdFN0YXR1c1tcIm1heW9yU3VwcGxpZXNcIl0gIT09IHVuZGVmaW5lZCksXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6ICgpID0+IHtcclxuXHRcdFx0XHRcdFx0XHRcdENoYXJhY3Rlci5yZW1vdmVGcm9tSW52ZW50b3J5KFwiQ2FwdGFpbi5zdXBwbGllc1wiKTtcclxuXHRcdFx0XHRcdFx0XHRcdCRTTS5zZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnLCAxKTtcclxuXHRcdFx0XHRcdFx0XHRcdENoYXJhY3Rlci5jaGVja1F1ZXN0U3RhdHVzKFwibWF5b3JTdXBwbGllc1wiKTtcclxuXHRcdFx0XHRcdFx0XHRcdFZpbGxhZ2UudXBkYXRlQnV0dG9uKCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnbGVhdmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnTGVhdmUnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdC8vIGltYWdlOiBcImFzc2V0cy9jYXJkcy9yYXZlbi5wbmdcIlxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQncXVlc3QnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1RoZSBtYXlvciB0aGlua3MgZm9yIGEgbW9tZW50LicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIllvdSBrbm93LCBpdFxcJ3MgYmVlbiBhIHdoaWxlIHNpbmNlIG91ciBsYXN0IHNoaXBtZW50IG9mIHN1cHBsaWVzIGFycml2ZWQgZnJvbSB0aGUgT3V0cG9zdC4gTWluZCBsb29raW5nIGludG8gdGhhdCBmb3IgdXM/XCInKSxcclxuXHRcdFx0XHRcdFx0XygnXCJZb3UgY2FuIGFzayBhYm91dCBpdCBhdCB0aGUgb3V0cG9zdCwgb3IganVzdCB3YW5kZXIgYXJvdW5kIG9uIHRoZSByb2FkIGFuZCBzZWUgaWYgeW91IGZpbmQgYW55IGNsdWVzLiBFaXRoZXIgd2F5LCBpdFxcJ3MgdGltZSB0byBoaXQgdGhlIHJvYWQsIGFkdmVudHVyZXIhXCInKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2FscmlnaHR5Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FscmlnaHR5JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ21haW4nfSxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogTWF5b3Iuc3RhcnRTdXBwbGllc1F1ZXN0XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdnaXZlU3VwcGxpZXMnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1RoZSBtYXlvciBzbWlsZXMsIGFuZCB0aGUgZWRnZXMgb2YgaGlzIGV5ZXMgY3JpbmtsZS4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJUaGFuayB5b3UsIGJyYXZlIGFkdmVudHVyZXIhIFdpdGggdGhlc2Ugc3VwcGxpZXMsIHRoZSB2aWxsYWdlIGNhbiBvbmNlIGFnYWluIHRocml2ZS5cIicpLFxyXG5cdFx0XHRcdFx0XHRfKCdIZSB0YWtlcyB0aGVtIGZyb20geW91IGdyYWNpb3VzbHksIGFuZCBwcm9tcHRseSBoYW5kcyB0aGVtIG9mZiB0byBzb21lIHdvcmtlcnMsIHdobyBxdWlja2x5IGVyZWN0IGEgYnVpbGRpbmcgdGhhdCBnaXZlcyB5b3UgYSBuZXcgYnV0dG9uIHRvIGNsaWNrJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdpbXByZXNzaXZlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0ltcHJlc3NpdmUhJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdHN0YXJ0U3VwcGxpZXNRdWVzdDogZnVuY3Rpb24gKCkge1xyXG5cdFx0Ly8gaWYgKCEkU00uZ2V0KCdxdWVzdC5zdXBwbGllcycpKSB7XHJcblx0XHQvLyBcdC8vIDEgPSBzdGFydGVkLCAyID0gbmV4dCBzdGVwLCBldGMuIHVudGlsIGNvbXBsZXRlZFxyXG5cdFx0Ly8gXHQkU00uc2V0KCdxdWVzdC5zdXBwbGllcycsIDEpO1xyXG5cdFx0Ly8gXHRSb2FkLmluaXQoKTtcclxuXHRcdC8vIH1cclxuXHRcdGlmIChDaGFyYWN0ZXIucXVlc3RTdGF0dXNbXCJtYXlvclN1cHBsaWVzXCJdID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0Q2hhcmFjdGVyLnNldFF1ZXN0U3RhdHVzKFwibWF5b3JTdXBwbGllc1wiLCAwKTtcclxuXHRcdFx0Um9hZC5pbml0KCk7XHJcblx0XHR9XHJcblx0fVxyXG59IiwiLy8gQHRzLW5vY2hlY2tcclxuXHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tIFwiLi9ub3RpZmljYXRpb25zXCI7XHJcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuL2V2ZW50c1wiO1xyXG5pbXBvcnQgeyBWaWxsYWdlIH0gZnJvbSBcIi4vcGxhY2VzL3ZpbGxhZ2VcIjtcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4vcGxheWVyL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgeyBXZWF0aGVyIH0gZnJvbSBcIi4vd2VhdGhlclwiO1xyXG5pbXBvcnQgeyBSb2FkIH0gZnJvbSBcIi4vcGxhY2VzL3JvYWRcIjtcclxuaW1wb3J0IHsgT3V0cG9zdCB9IGZyb20gXCIuL3BsYWNlcy9vdXRwb3N0XCI7XHJcblxyXG5leHBvcnQgY29uc3QgRW5naW5lID0gd2luZG93LkVuZ2luZSA9IHtcclxuXHRcclxuXHRTSVRFX1VSTDogZW5jb2RlVVJJQ29tcG9uZW50KFwiaHR0cHM6Ly9jZ2liYnMuZ2l0aHViLmlvL2Rhcmtyb29tX21vZC9pbmRleC5odG1sXCIpLFxyXG5cdFZFUlNJT046IDEuMyxcclxuXHRNQVhfU1RPUkU6IDk5OTk5OTk5OTk5OTk5LFxyXG5cdFNBVkVfRElTUExBWTogMzAgKiAxMDAwLFxyXG5cdEdBTUVfT1ZFUjogZmFsc2UsXHJcblx0XHJcblx0Ly9vYmplY3QgZXZlbnQgdHlwZXNcclxuXHR0b3BpY3M6IHt9LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHtcclxuXHRcdHN0YXRlOiBudWxsLFxyXG5cdFx0ZGVidWc6IHRydWUsXHJcblx0XHRsb2c6IHRydWUsXHJcblx0XHRkcm9wYm94OiBmYWxzZSxcclxuXHRcdGRvdWJsZVRpbWU6IGZhbHNlXHJcblx0fSxcclxuXHJcblx0X2RlYnVnOiBmYWxzZSxcclxuXHRcdFxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdFx0dGhpcy5fZGVidWcgPSB0aGlzLm9wdGlvbnMuZGVidWc7XHJcblx0XHR0aGlzLl9sb2cgPSB0aGlzLm9wdGlvbnMubG9nO1xyXG5cdFx0XHJcblx0XHQvLyBDaGVjayBmb3IgSFRNTDUgc3VwcG9ydFxyXG5cdFx0aWYoIUVuZ2luZS5icm93c2VyVmFsaWQoKSkge1xyXG5cdFx0XHR3aW5kb3cubG9jYXRpb24gPSAnYnJvd3Nlcldhcm5pbmcuaHRtbCc7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIENoZWNrIGZvciBtb2JpbGVcclxuXHRcdC8vIGlmKEVuZ2luZS5pc01vYmlsZSgpKSB7XHJcblx0XHQvLyBcdHdpbmRvdy5sb2NhdGlvbiA9ICdtb2JpbGVXYXJuaW5nLmh0bWwnO1xyXG5cdFx0Ly8gfVxyXG5cclxuXHRcdEVuZ2luZS5kaXNhYmxlU2VsZWN0aW9uKCk7XHJcblx0XHRcclxuXHRcdGlmKHRoaXMub3B0aW9ucy5zdGF0ZSAhPSBudWxsKSB7XHJcblx0XHRcdHdpbmRvdy5TdGF0ZSA9IHRoaXMub3B0aW9ucy5zdGF0ZTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEVuZ2luZS5sb2FkR2FtZSgpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2xvY2F0aW9uU2xpZGVyJykuYXBwZW5kVG8oJyNtYWluJyk7XHJcblxyXG5cdFx0dmFyIG1lbnUgPSAkKCc8ZGl2PicpXHJcblx0XHRcdC5hZGRDbGFzcygnbWVudScpXHJcblx0XHRcdC5hcHBlbmRUbygnYm9keScpO1xyXG5cclxuXHRcdGlmKHR5cGVvZiBsYW5ncyAhPSAndW5kZWZpbmVkJyl7XHJcblx0XHRcdHZhciBjdXN0b21TZWxlY3QgPSAkKCc8c3Bhbj4nKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnY3VzdG9tU2VsZWN0JylcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHRcdFx0dmFyIHNlbGVjdE9wdGlvbnMgPSAkKCc8c3Bhbj4nKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnY3VzdG9tU2VsZWN0T3B0aW9ucycpXHJcblx0XHRcdFx0LmFwcGVuZFRvKGN1c3RvbVNlbGVjdCk7XHJcblx0XHRcdHZhciBvcHRpb25zTGlzdCA9ICQoJzx1bD4nKVxyXG5cdFx0XHRcdC5hcHBlbmRUbyhzZWxlY3RPcHRpb25zKTtcclxuXHRcdFx0JCgnPGxpPicpXHJcblx0XHRcdFx0LnRleHQoXCJsYW5ndWFnZS5cIilcclxuXHRcdFx0XHQuYXBwZW5kVG8ob3B0aW9uc0xpc3QpO1xyXG5cdFx0XHRcclxuXHRcdFx0JC5lYWNoKGxhbmdzLCBmdW5jdGlvbihuYW1lLGRpc3BsYXkpe1xyXG5cdFx0XHRcdCQoJzxsaT4nKVxyXG5cdFx0XHRcdFx0LnRleHQoZGlzcGxheSlcclxuXHRcdFx0XHRcdC5hdHRyKCdkYXRhLWxhbmd1YWdlJywgbmFtZSlcclxuXHRcdFx0XHRcdC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkgeyBFbmdpbmUuc3dpdGNoTGFuZ3VhZ2UodGhpcyk7IH0pXHJcblx0XHRcdFx0XHQuYXBwZW5kVG8ob3B0aW9uc0xpc3QpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2xpZ2h0c09mZiBtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygnbGlnaHRzIG9mZi4nKSlcclxuXHRcdFx0LmNsaWNrKEVuZ2luZS50dXJuTGlnaHRzT2ZmKVxyXG5cdFx0XHQuYXBwZW5kVG8obWVudSk7XHJcblxyXG5cdFx0JCgnPHNwYW4+JylcclxuXHRcdFx0LmFkZENsYXNzKCdtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygnaHlwZXIuJykpXHJcblx0XHRcdC5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0XHRcdEVuZ2luZS5vcHRpb25zLmRvdWJsZVRpbWUgPSAhRW5naW5lLm9wdGlvbnMuZG91YmxlVGltZTtcclxuXHRcdFx0XHRpZihFbmdpbmUub3B0aW9ucy5kb3VibGVUaW1lKVxyXG5cdFx0XHRcdFx0JCh0aGlzKS50ZXh0KF8oJ2NsYXNzaWMuJykpO1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdCQodGhpcykudGV4dChfKCdoeXBlci4nKSk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHQudGV4dChfKCdyZXN0YXJ0LicpKVxyXG5cdFx0XHQuY2xpY2soRW5naW5lLmNvbmZpcm1EZWxldGUpXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHRcdFxyXG5cdFx0JCgnPHNwYW4+JylcclxuXHRcdFx0LmFkZENsYXNzKCdtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygnc2hhcmUuJykpXHJcblx0XHRcdC5jbGljayhFbmdpbmUuc2hhcmUpXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHQudGV4dChfKCdzYXZlLicpKVxyXG5cdFx0XHQuY2xpY2soRW5naW5lLmV4cG9ydEltcG9ydClcclxuXHRcdFx0LmFwcGVuZFRvKG1lbnUpO1xyXG5cdFxyXG5cdFx0Ly8gc3Vic2NyaWJlIHRvIHN0YXRlVXBkYXRlc1xyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5zdWJzY3JpYmUoRW5naW5lLmhhbmRsZVN0YXRlVXBkYXRlcyk7XHJcblxyXG5cdFx0JFNNLmluaXQoKTtcclxuXHRcdE5vdGlmaWNhdGlvbnMuaW5pdCgpO1xyXG5cdFx0RXZlbnRzLmluaXQoKTtcclxuXHRcdFZpbGxhZ2UuaW5pdCgpO1xyXG5cdFx0Q2hhcmFjdGVyLmluaXQoKTtcclxuXHRcdFdlYXRoZXIuaW5pdCgpO1xyXG5cdFx0aWYoJFNNLmdldCgnUm9hZC5vcGVuJykgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRSb2FkLmluaXQoKTtcclxuXHRcdH1cclxuXHRcdGlmKCRTTS5nZXQoJ091dHBvc3Qub3BlbicpICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0T3V0cG9zdC5pbml0KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0RW5naW5lLnNhdmVMYW5ndWFnZSgpO1xyXG5cdFx0RW5naW5lLnRyYXZlbFRvKFZpbGxhZ2UpO1xyXG5cclxuXHR9LFxyXG5cdFxyXG5cdGJyb3dzZXJWYWxpZDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKCBsb2NhdGlvbi5zZWFyY2guaW5kZXhPZiggJ2lnbm9yZWJyb3dzZXI9dHJ1ZScgKSA+PSAwIHx8ICggdHlwZW9mIFN0b3JhZ2UgIT0gJ3VuZGVmaW5lZCcgJiYgIW9sZElFICkgKTtcclxuXHR9LFxyXG5cdFxyXG5cdGlzTW9iaWxlOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAoIGxvY2F0aW9uLnNlYXJjaC5pbmRleE9mKCAnaWdub3JlYnJvd3Nlcj10cnVlJyApIDwgMCAmJiAvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnkvaS50ZXN0KCBuYXZpZ2F0b3IudXNlckFnZW50ICkgKTtcclxuXHR9LFxyXG5cdFxyXG5cdHNhdmVHYW1lOiBmdW5jdGlvbigpIHtcclxuXHRcdGlmKHR5cGVvZiBTdG9yYWdlICE9ICd1bmRlZmluZWQnICYmIGxvY2FsU3RvcmFnZSkge1xyXG5cdFx0XHRpZihFbmdpbmUuX3NhdmVUaW1lciAhPSBudWxsKSB7XHJcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KEVuZ2luZS5fc2F2ZVRpbWVyKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih0eXBlb2YgRW5naW5lLl9sYXN0Tm90aWZ5ID09ICd1bmRlZmluZWQnIHx8IERhdGUubm93KCkgLSBFbmdpbmUuX2xhc3ROb3RpZnkgPiBFbmdpbmUuU0FWRV9ESVNQTEFZKXtcclxuXHRcdFx0XHQkKCcjc2F2ZU5vdGlmeScpLmNzcygnb3BhY2l0eScsIDEpLmFuaW1hdGUoe29wYWNpdHk6IDB9LCAxMDAwLCAnbGluZWFyJyk7XHJcblx0XHRcdFx0RW5naW5lLl9sYXN0Tm90aWZ5ID0gRGF0ZS5ub3coKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRsb2NhbFN0b3JhZ2UuZ2FtZVN0YXRlID0gSlNPTi5zdHJpbmdpZnkoU3RhdGUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0bG9hZEdhbWU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dmFyIHNhdmVkU3RhdGUgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nYW1lU3RhdGUpO1xyXG5cdFx0XHRpZihzYXZlZFN0YXRlKSB7XHJcblx0XHRcdFx0d2luZG93LlN0YXRlID0gc2F2ZWRTdGF0ZTtcclxuXHRcdFx0XHRFbmdpbmUubG9nKFwibG9hZGVkIHNhdmUhXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGNhdGNoKGUpIHtcclxuXHRcdFx0RW5naW5lLmxvZyhlKTtcclxuXHRcdFx0d2luZG93LlN0YXRlID0ge307XHJcblx0XHRcdCRTTS5zZXQoJ3ZlcnNpb24nLCBFbmdpbmUuVkVSU0lPTik7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRleHBvcnRJbXBvcnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnRXhwb3J0IC8gSW1wb3J0JyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ2V4cG9ydCBvciBpbXBvcnQgc2F2ZSBkYXRhLCBmb3IgYmFja2luZyB1cCcpLFxyXG5cdFx0XHRcdFx0XHRfKCdvciBtaWdyYXRpbmcgY29tcHV0ZXJzJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdleHBvcnQnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnZXhwb3J0JyksXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IEVuZ2luZS5leHBvcnQ2NFxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnaW1wb3J0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2ltcG9ydCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdjb25maXJtJ31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2NhbmNlbCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdjYW5jZWwnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdjb25maXJtJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdhcmUgeW91IHN1cmU/JyksXHJcblx0XHRcdFx0XHRcdF8oJ2lmIHRoZSBjb2RlIGlzIGludmFsaWQsIGFsbCBkYXRhIHdpbGwgYmUgbG9zdC4nKSxcclxuXHRcdFx0XHRcdFx0XygndGhpcyBpcyBpcnJldmVyc2libGUuJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCd5ZXMnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygneWVzJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2lucHV0SW1wb3J0J30sXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IEVuZ2luZS5lbmFibGVTZWxlY3Rpb25cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J25vJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ25vJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnaW5wdXRJbXBvcnQnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXygncHV0IHRoZSBzYXZlIGNvZGUgaGVyZS4nKV0sXHJcblx0XHRcdFx0XHR0ZXh0YXJlYTogJycsXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdva2F5Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2ltcG9ydCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IEVuZ2luZS5pbXBvcnQ2NFxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnY2FuY2VsJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2NhbmNlbCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0Z2VuZXJhdGVFeHBvcnQ2NDogZnVuY3Rpb24oKXtcclxuXHRcdHZhciBzdHJpbmc2NCA9IEJhc2U2NC5lbmNvZGUobG9jYWxTdG9yYWdlLmdhbWVTdGF0ZSk7XHJcblx0XHRzdHJpbmc2NCA9IHN0cmluZzY0LnJlcGxhY2UoL1xccy9nLCAnJyk7XHJcblx0XHRzdHJpbmc2NCA9IHN0cmluZzY0LnJlcGxhY2UoL1xcLi9nLCAnJyk7XHJcblx0XHRzdHJpbmc2NCA9IHN0cmluZzY0LnJlcGxhY2UoL1xcbi9nLCAnJyk7XHJcblxyXG5cdFx0cmV0dXJuIHN0cmluZzY0O1xyXG5cdH0sXHJcblxyXG5cdGV4cG9ydDY0OiBmdW5jdGlvbigpIHtcclxuXHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0dmFyIHN0cmluZzY0ID0gRW5naW5lLmdlbmVyYXRlRXhwb3J0NjQoKTtcclxuXHRcdEVuZ2luZS5lbmFibGVTZWxlY3Rpb24oKTtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ0V4cG9ydCcpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0dGV4dDogW18oJ3NhdmUgdGhpcy4nKV0sXHJcblx0XHRcdFx0XHR0ZXh0YXJlYTogc3RyaW5nNjQsXHJcblx0XHRcdFx0XHRyZWFkb25seTogdHJ1ZSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2RvbmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnZ290IGl0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogRW5naW5lLmRpc2FibGVTZWxlY3Rpb25cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRFbmdpbmUuYXV0b1NlbGVjdCgnI2Rlc2NyaXB0aW9uIHRleHRhcmVhJyk7XHJcblx0fSxcclxuXHJcblx0aW1wb3J0NjQ6IGZ1bmN0aW9uKHN0cmluZzY0KSB7XHJcblx0XHRFbmdpbmUuZGlzYWJsZVNlbGVjdGlvbigpO1xyXG5cdFx0c3RyaW5nNjQgPSBzdHJpbmc2NC5yZXBsYWNlKC9cXHMvZywgJycpO1xyXG5cdFx0c3RyaW5nNjQgPSBzdHJpbmc2NC5yZXBsYWNlKC9cXC4vZywgJycpO1xyXG5cdFx0c3RyaW5nNjQgPSBzdHJpbmc2NC5yZXBsYWNlKC9cXG4vZywgJycpO1xyXG5cdFx0dmFyIGRlY29kZWRTYXZlID0gQmFzZTY0LmRlY29kZShzdHJpbmc2NCk7XHJcblx0XHRsb2NhbFN0b3JhZ2UuZ2FtZVN0YXRlID0gZGVjb2RlZFNhdmU7XHJcblx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcclxuXHR9LFxyXG5cclxuXHRjb25maXJtRGVsZXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ1Jlc3RhcnQ/JyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXygncmVzdGFydCB0aGUgZ2FtZT8nKV0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCd5ZXMnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygneWVzJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogRW5naW5lLmRlbGV0ZVNhdmVcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J25vJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ25vJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRkZWxldGVTYXZlOiBmdW5jdGlvbihub1JlbG9hZCkge1xyXG5cdFx0aWYodHlwZW9mIFN0b3JhZ2UgIT0gJ3VuZGVmaW5lZCcgJiYgbG9jYWxTdG9yYWdlKSB7XHJcblx0XHRcdHdpbmRvdy5TdGF0ZSA9IHt9O1xyXG5cdFx0XHRsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcclxuXHRcdH1cclxuXHRcdGlmKCFub1JlbG9hZCkge1xyXG5cdFx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRzaGFyZTogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdTaGFyZScpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0dGV4dDogW18oJ2JyaW5nIHlvdXIgZnJpZW5kcy4nKV0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdmYWNlYm9vayc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdmYWNlYm9vaycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0d2luZG93Lm9wZW4oJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9zaGFyZXIvc2hhcmVyLnBocD91PScgKyBFbmdpbmUuU0lURV9VUkwsICdzaGFyZXInLCAnd2lkdGg9NjI2LGhlaWdodD00MzYsbG9jYXRpb249bm8sbWVudWJhcj1ubyxyZXNpemFibGU9bm8sc2Nyb2xsYmFycz1ubyxzdGF0dXM9bm8sdG9vbGJhcj1ubycpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2dvb2dsZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0Ol8oJ2dvb2dsZSsnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5vcGVuKCdodHRwczovL3BsdXMuZ29vZ2xlLmNvbS9zaGFyZT91cmw9JyArIEVuZ2luZS5TSVRFX1VSTCwgJ3NoYXJlcicsICd3aWR0aD00ODAsaGVpZ2h0PTQzNixsb2NhdGlvbj1ubyxtZW51YmFyPW5vLHJlc2l6YWJsZT1ubyxzY3JvbGxiYXJzPW5vLHN0YXR1cz1ubyx0b29sYmFyPW5vJyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQndHdpdHRlcic6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCd0d2l0dGVyJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR3aW5kb3cub3BlbignaHR0cHM6Ly90d2l0dGVyLmNvbS9pbnRlbnQvdHdlZXQ/dGV4dD1BJTIwRGFyayUyMFJvb20mdXJsPScgKyBFbmdpbmUuU0lURV9VUkwsICdzaGFyZXInLCAnd2lkdGg9NjYwLGhlaWdodD0yNjAsbG9jYXRpb249bm8sbWVudWJhcj1ubyxyZXNpemFibGU9bm8sc2Nyb2xsYmFycz15ZXMsc3RhdHVzPW5vLHRvb2xiYXI9bm8nKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdyZWRkaXQnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygncmVkZGl0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR3aW5kb3cub3BlbignaHR0cDovL3d3dy5yZWRkaXQuY29tL3N1Ym1pdD91cmw9JyArIEVuZ2luZS5TSVRFX1VSTCwgJ3NoYXJlcicsICd3aWR0aD05NjAsaGVpZ2h0PTcwMCxsb2NhdGlvbj1ubyxtZW51YmFyPW5vLHJlc2l6YWJsZT1ubyxzY3JvbGxiYXJzPXllcyxzdGF0dXM9bm8sdG9vbGJhcj1ubycpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2Nsb3NlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2Nsb3NlJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHR3aWR0aDogJzQwMHB4J1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0ZmluZFN0eWxlc2hlZXQ6IGZ1bmN0aW9uKHRpdGxlKSB7XHJcblx0XHRmb3IodmFyIGk9MDsgaTxkb2N1bWVudC5zdHlsZVNoZWV0cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgc2hlZXQgPSBkb2N1bWVudC5zdHlsZVNoZWV0c1tpXTtcclxuXHRcdFx0aWYoc2hlZXQudGl0bGUgPT0gdGl0bGUpIHtcclxuXHRcdFx0XHRyZXR1cm4gc2hlZXQ7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH0sXHJcblxyXG5cdGlzTGlnaHRzT2ZmOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBkYXJrQ3NzID0gRW5naW5lLmZpbmRTdHlsZXNoZWV0KCdkYXJrZW5MaWdodHMnKTtcclxuXHRcdGlmICggZGFya0NzcyAhPSBudWxsICYmICFkYXJrQ3NzLmRpc2FibGVkICkge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cclxuXHR0dXJuTGlnaHRzT2ZmOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBkYXJrQ3NzID0gRW5naW5lLmZpbmRTdHlsZXNoZWV0KCdkYXJrZW5MaWdodHMnKTtcclxuXHRcdGlmIChkYXJrQ3NzID09IG51bGwpIHtcclxuXHRcdFx0JCgnaGVhZCcpLmFwcGVuZCgnPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCJjc3MvZGFyay5jc3NcIiB0eXBlPVwidGV4dC9jc3NcIiB0aXRsZT1cImRhcmtlbkxpZ2h0c1wiIC8+Jyk7XHJcblx0XHRcdCQoJy5saWdodHNPZmYnKS50ZXh0KF8oJ2xpZ2h0cyBvbi4nKSk7XHJcblx0XHR9IGVsc2UgaWYgKGRhcmtDc3MuZGlzYWJsZWQpIHtcclxuXHRcdFx0ZGFya0Nzcy5kaXNhYmxlZCA9IGZhbHNlO1xyXG5cdFx0XHQkKCcubGlnaHRzT2ZmJykudGV4dChfKCdsaWdodHMgb24uJykpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JChcIiNkYXJrZW5MaWdodHNcIikuYXR0cihcImRpc2FibGVkXCIsIFwiZGlzYWJsZWRcIik7XHJcblx0XHRcdGRhcmtDc3MuZGlzYWJsZWQgPSB0cnVlO1xyXG5cdFx0XHQkKCcubGlnaHRzT2ZmJykudGV4dChfKCdsaWdodHMgb2ZmLicpKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHQvLyBHZXRzIGEgZ3VpZFxyXG5cdGdldEd1aWQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24oYykge1xyXG5cdFx0XHR2YXIgciA9IE1hdGgucmFuZG9tKCkqMTZ8MCwgdiA9IGMgPT0gJ3gnID8gciA6IChyJjB4M3wweDgpO1xyXG5cdFx0XHRyZXR1cm4gdi50b1N0cmluZygxNik7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRhY3RpdmVNb2R1bGU6IG51bGwsXHJcblxyXG5cdHRyYXZlbFRvOiBmdW5jdGlvbihtb2R1bGUpIHtcclxuXHRcdGlmKEVuZ2luZS5hY3RpdmVNb2R1bGUgIT0gbW9kdWxlKSB7XHJcblx0XHRcdHZhciBjdXJyZW50SW5kZXggPSBFbmdpbmUuYWN0aXZlTW9kdWxlID8gJCgnLmxvY2F0aW9uJykuaW5kZXgoRW5naW5lLmFjdGl2ZU1vZHVsZS5wYW5lbCkgOiAxO1xyXG5cdFx0XHQkKCdkaXYuaGVhZGVyQnV0dG9uJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcblx0XHRcdG1vZHVsZS50YWIuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcblxyXG5cdFx0XHR2YXIgc2xpZGVyID0gJCgnI2xvY2F0aW9uU2xpZGVyJyk7XHJcblx0XHRcdHZhciBzdG9yZXMgPSAkKCcjc3RvcmVzQ29udGFpbmVyJyk7XHJcblx0XHRcdHZhciBwYW5lbEluZGV4ID0gJCgnLmxvY2F0aW9uJykuaW5kZXgobW9kdWxlLnBhbmVsKTtcclxuXHRcdFx0dmFyIGRpZmYgPSBNYXRoLmFicyhwYW5lbEluZGV4IC0gY3VycmVudEluZGV4KTtcclxuXHRcdFx0c2xpZGVyLmFuaW1hdGUoe2xlZnQ6IC0ocGFuZWxJbmRleCAqIDcwMCkgKyAncHgnfSwgMzAwICogZGlmZik7XHJcblxyXG5cdFx0XHRpZigkU00uZ2V0KCdzdG9yZXMud29vZCcpICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0Ly8gRklYTUUgV2h5IGRvZXMgdGhpcyB3b3JrIGlmIHRoZXJlJ3MgYW4gYW5pbWF0aW9uIHF1ZXVlLi4uP1xyXG5cdFx0XHRcdHN0b3Jlcy5hbmltYXRlKHtyaWdodDogLShwYW5lbEluZGV4ICogNzAwKSArICdweCd9LCAzMDAgKiBkaWZmKTtcclxuXHRcdFx0fVxyXG5cdFx0XHJcblx0XHRcdEVuZ2luZS5hY3RpdmVNb2R1bGUgPSBtb2R1bGU7XHJcblxyXG5cdFx0XHRtb2R1bGUub25BcnJpdmFsKGRpZmYpO1xyXG5cclxuXHRcdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSBWaWxsYWdlXHJcblx0XHRcdFx0Ly8gIHx8IEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gUGF0aFxyXG5cdFx0XHRcdCkge1xyXG5cdFx0XHRcdC8vIERvbid0IGZhZGUgb3V0IHRoZSB3ZWFwb25zIGlmIHdlJ3JlIHN3aXRjaGluZyB0byBhIG1vZHVsZVxyXG5cdFx0XHRcdC8vIHdoZXJlIHdlJ3JlIGdvaW5nIHRvIGtlZXAgc2hvd2luZyB0aGVtIGFueXdheS5cclxuXHRcdFx0XHRpZiAobW9kdWxlICE9IFZpbGxhZ2UgXHJcblx0XHRcdFx0XHQvLyAmJiBtb2R1bGUgIT0gUGF0aFxyXG5cdFx0XHRcdCkge1xyXG5cdFx0XHRcdFx0JCgnZGl2I3dlYXBvbnMnKS5hbmltYXRlKHtvcGFjaXR5OiAwfSwgMzAwKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKG1vZHVsZSA9PSBWaWxsYWdlXHJcblx0XHRcdFx0Ly8gIHx8IG1vZHVsZSA9PSBQYXRoXHJcblx0XHRcdFx0KSB7XHJcblx0XHRcdFx0JCgnZGl2I3dlYXBvbnMnKS5hbmltYXRlKHtvcGFjaXR5OiAxfSwgMzAwKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Tm90aWZpY2F0aW9ucy5wcmludFF1ZXVlKG1vZHVsZSk7XHJcblx0XHRcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRsb2c6IGZ1bmN0aW9uKG1zZykge1xyXG5cdFx0aWYodGhpcy5fbG9nKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKG1zZyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0dXBkYXRlU2xpZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBzbGlkZXIgPSAkKCcjbG9jYXRpb25TbGlkZXInKTtcclxuXHRcdHNsaWRlci53aWR0aCgoc2xpZGVyLmNoaWxkcmVuKCkubGVuZ3RoICogNzAwKSArICdweCcpO1xyXG5cdH0sXHJcblxyXG5cdHVwZGF0ZU91dGVyU2xpZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBzbGlkZXIgPSAkKCcjb3V0ZXJTbGlkZXInKTtcclxuXHRcdHNsaWRlci53aWR0aCgoc2xpZGVyLmNoaWxkcmVuKCkubGVuZ3RoICogNzAwKSArICdweCcpO1xyXG5cdH0sXHJcblxyXG5cdGRpc2FibGVTZWxlY3Rpb246IGZ1bmN0aW9uKCkge1xyXG5cdFx0ZG9jdW1lbnQub25zZWxlY3RzdGFydCA9IGV2ZW50TnVsbGlmaWVyOyAvLyB0aGlzIGlzIGZvciBJRVxyXG5cdFx0ZG9jdW1lbnQub25tb3VzZWRvd24gPSBldmVudE51bGxpZmllcjsgLy8gdGhpcyBpcyBmb3IgdGhlIHJlc3RcclxuXHR9LFxyXG5cclxuXHRlbmFibGVTZWxlY3Rpb246IGZ1bmN0aW9uKCkge1xyXG5cdFx0ZG9jdW1lbnQub25zZWxlY3RzdGFydCA9IGV2ZW50UGFzc3Rocm91Z2g7XHJcblx0XHRkb2N1bWVudC5vbm1vdXNlZG93biA9IGV2ZW50UGFzc3Rocm91Z2g7XHJcblx0fSxcclxuXHJcblx0YXV0b1NlbGVjdDogZnVuY3Rpb24oc2VsZWN0b3IpIHtcclxuXHRcdCQoc2VsZWN0b3IpLmZvY3VzKCkuc2VsZWN0KCk7XHJcblx0fSxcclxuXHJcblx0aGFuZGxlU3RhdGVVcGRhdGVzOiBmdW5jdGlvbihlKXtcclxuXHRcclxuXHR9LFxyXG5cclxuXHRzd2l0Y2hMYW5ndWFnZTogZnVuY3Rpb24oZG9tKXtcclxuXHRcdHZhciBsYW5nID0gJChkb20pLmRhdGEoXCJsYW5ndWFnZVwiKTtcclxuXHRcdGlmKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYuc2VhcmNoKC9bXFw/XFwmXWxhbmc9W2Etel9dKy8pICE9IC0xKXtcclxuXHRcdFx0ZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IGRvY3VtZW50LmxvY2F0aW9uLmhyZWYucmVwbGFjZSggLyhbXFw/XFwmXWxhbmc9KShbYS16X10rKS9naSAsIFwiJDFcIitsYW5nICk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0ZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgKyAoIChkb2N1bWVudC5sb2NhdGlvbi5ocmVmLnNlYXJjaCgvXFw/LykgIT0gLTEgKT9cIiZcIjpcIj9cIikgKyBcImxhbmc9XCIrbGFuZztcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRzYXZlTGFuZ3VhZ2U6IGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgbGFuZyA9IGRlY29kZVVSSUNvbXBvbmVudCgobmV3IFJlZ0V4cCgnWz98Jl1sYW5nPScgKyAnKFteJjtdKz8pKCZ8I3w7fCQpJykuZXhlYyhsb2NhdGlvbi5zZWFyY2gpfHxbLFwiXCJdKVsxXS5yZXBsYWNlKC9cXCsvZywgJyUyMCcpKXx8bnVsbDtcdFxyXG5cdFx0aWYobGFuZyAmJiB0eXBlb2YgU3RvcmFnZSAhPSAndW5kZWZpbmVkJyAmJiBsb2NhbFN0b3JhZ2UpIHtcclxuXHRcdFx0bG9jYWxTdG9yYWdlLmxhbmcgPSBsYW5nO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHNldFRpbWVvdXQ6IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aW1lb3V0LCBza2lwRG91YmxlPyl7XHJcblxyXG5cdFx0aWYoIEVuZ2luZS5vcHRpb25zLmRvdWJsZVRpbWUgJiYgIXNraXBEb3VibGUgKXtcclxuXHRcdFx0RW5naW5lLmxvZygnRG91YmxlIHRpbWUsIGN1dHRpbmcgdGltZW91dCBpbiBoYWxmJyk7XHJcblx0XHRcdHRpbWVvdXQgLz0gMjtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gc2V0VGltZW91dChjYWxsYmFjaywgdGltZW91dCk7XHJcblxyXG5cdH1cclxuXHJcbn07XHJcblxyXG5mdW5jdGlvbiBldmVudE51bGxpZmllcihlKSB7XHJcblx0cmV0dXJuICQoZS50YXJnZXQpLmhhc0NsYXNzKCdtZW51QnRuJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGV2ZW50UGFzc3Rocm91Z2goZSkge1xyXG5cdHJldHVybiB0cnVlO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gaW5WaWV3KGRpciwgZWxlbSl7XHJcblxyXG4gICAgICAgIHZhciBzY1RvcCA9ICQoJyNtYWluJykub2Zmc2V0KCkudG9wO1xyXG4gICAgICAgIHZhciBzY0JvdCA9IHNjVG9wICsgJCgnI21haW4nKS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgdmFyIGVsVG9wID0gZWxlbS5vZmZzZXQoKS50b3A7XHJcbiAgICAgICAgdmFyIGVsQm90ID0gZWxUb3AgKyBlbGVtLmhlaWdodCgpO1xyXG5cclxuICAgICAgICBpZiggZGlyID09ICd1cCcgKXtcclxuICAgICAgICAgICAgICAgIC8vIFNUT1AgTU9WSU5HIElGIEJPVFRPTSBPRiBFTEVNRU5UIElTIFZJU0lCTEUgSU4gU0NSRUVOXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKCBlbEJvdCA8IHNjQm90ICk7XHJcbiAgICAgICAgfWVsc2UgaWYoIGRpciA9PSAnZG93bicgKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoIGVsVG9wID4gc2NUb3AgKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoICggZWxCb3QgPD0gc2NCb3QgKSAmJiAoIGVsVG9wID49IHNjVG9wICkgKTtcclxuICAgICAgICB9XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBzY3JvbGxCeVgoZWxlbSwgeCl7XHJcblxyXG4gICAgICAgIHZhciBlbFRvcCA9IHBhcnNlSW50KCBlbGVtLmNzcygndG9wJyksIDEwICk7XHJcbiAgICAgICAgZWxlbS5jc3MoICd0b3AnLCAoIGVsVG9wICsgeCApICsgXCJweFwiICk7XHJcblxyXG59XHJcblxyXG5cclxuLy9jcmVhdGUgalF1ZXJ5IENhbGxiYWNrcygpIHRvIGhhbmRsZSBvYmplY3QgZXZlbnRzIFxyXG4kLkRpc3BhdGNoID0gZnVuY3Rpb24oIGlkICkge1xyXG5cdHZhciBjYWxsYmFja3MsIHRvcGljID0gaWQgJiYgRW5naW5lLnRvcGljc1sgaWQgXTtcclxuXHRpZiAoICF0b3BpYyApIHtcclxuXHRcdGNhbGxiYWNrcyA9IGpRdWVyeS5DYWxsYmFja3MoKTtcclxuXHRcdHRvcGljID0ge1xyXG5cdFx0XHRcdHB1Ymxpc2g6IGNhbGxiYWNrcy5maXJlLFxyXG5cdFx0XHRcdHN1YnNjcmliZTogY2FsbGJhY2tzLmFkZCxcclxuXHRcdFx0XHR1bnN1YnNjcmliZTogY2FsbGJhY2tzLnJlbW92ZVxyXG5cdFx0fTtcclxuXHRcdGlmICggaWQgKSB7XHJcblx0XHRcdEVuZ2luZS50b3BpY3NbIGlkIF0gPSB0b3BpYztcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIHRvcGljO1xyXG59O1xyXG5cclxuJChmdW5jdGlvbigpIHtcclxuXHRFbmdpbmUuaW5pdCgpO1xyXG59KTtcclxuXHJcbiIsIi8qKlxyXG4gKiBNb2R1bGUgdGhhdCBoYW5kbGVzIHRoZSByYW5kb20gZXZlbnQgc3lzdGVtXHJcbiAqL1xyXG5pbXBvcnQgeyBFdmVudHNSb2FkV2FuZGVyIH0gZnJvbSBcIi4vZXZlbnRzL3JvYWR3YW5kZXJcIjtcclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4vZW5naW5lXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tIFwiLi9ub3RpZmljYXRpb25zXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuL0J1dHRvblwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBRFJFdmVudCB7XHJcblx0dGl0bGU6IHN0cmluZyxcclxuXHRpc0F2YWlsYWJsZT86IEZ1bmN0aW9uLFxyXG5cdGlzU3VwZXJMaWtlbHk/OiBGdW5jdGlvbixcclxuXHRzY2VuZXM6IHtcclxuXHRcdC8vIHR5cGUgdGhpcyBvdXQgYmV0dGVyIHVzaW5nIEluZGV4IFNpZ25hdHVyZXNcclxuXHRcdFtpZDogc3RyaW5nXTogU2NlbmVcclxuXHR9LFxyXG5cdGV2ZW50UGFuZWw/OiBhbnlcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTY2VuZSB7XHJcblx0c2VlbkZsYWc/OiBGdW5jdGlvbixcclxuXHRuZXh0U2NlbmU/OiBzdHJpbmcsXHJcblx0b25Mb2FkPzogRnVuY3Rpb24sXHJcblx0dGV4dDogQXJyYXk8c3RyaW5nPiB8IEZ1bmN0aW9uLFxyXG5cdHJld2FyZD86IGFueSxcclxuXHRub3RpZmljYXRpb24/OiBzdHJpbmcsXHJcblx0Ymxpbms/OiBib29sZWFuLFxyXG5cdGRpY2U/OiB7XHJcblx0XHRhbW91bnQ6IG51bWJlcixcclxuXHRcdGRpZUZhY2VzPzogeyBbaWQ6IG51bWJlcl06IHN0cmluZyB9XHJcblx0XHQvLyBkbyBnYW1lIGVuZ2luZSBzdHVmZiwgdGhlbiByZXR1cm4gdGV4dCBkZXNjcmlwdGlvblxyXG5cdFx0aGFuZGxlcjogKHZhbHMpID0+IEFycmF5PHN0cmluZz5cclxuXHR9LFxyXG5cdGJ1dHRvbnM6IHtcclxuXHRcdFtpZDogc3RyaW5nXTogRXZlbnRCdXR0b25cclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRCdXR0b24ge1xyXG5cdHRleHQ6IHN0cmluZyB8IEZ1bmN0aW9uLFxyXG5cdG5leHRTY2VuZToge1xyXG5cdFx0W2lkOiBudW1iZXJdOiBzdHJpbmdcclxuXHR9LFxyXG5cdGF2YWlsYWJsZT86IEZ1bmN0aW9uLFxyXG5cdHZpc2libGU/OiBGdW5jdGlvbixcclxuXHRyZXdhcmQ/OiBhbnksXHJcblx0Y29zdD86IGFueSxcclxuXHRub3RpZmljYXRpb24/OiBzdHJpbmcsXHJcblx0b25DaG9vc2U/OiBGdW5jdGlvblxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgRXZlbnRzID0ge1xyXG5cdFx0XHJcblx0X0VWRU5UX1RJTUVfUkFOR0U6IFszLCA2XSwgLy8gcmFuZ2UsIGluIG1pbnV0ZXNcclxuXHRfUEFORUxfRkFERTogMjAwLFxyXG5cdEJMSU5LX0lOVEVSVkFMOiBmYWxzZSxcclxuXHJcblx0RXZlbnRQb29sOiA8YW55PltdLFxyXG5cdGV2ZW50U3RhY2s6IDxhbnk+W10sXHJcblx0X2V2ZW50VGltZW91dDogMCxcclxuXHJcblx0TG9jYXRpb25zOiB7fSxcclxuXHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblx0XHRcclxuXHRcdC8vIEJ1aWxkIHRoZSBFdmVudCBQb29sXHJcblx0XHRFdmVudHMuRXZlbnRQb29sID0gW10uY29uY2F0KFxyXG5cdFx0XHRFdmVudHNSb2FkV2FuZGVyIGFzIGFueVxyXG5cdFx0KTtcclxuXHJcblx0XHR0aGlzLkxvY2F0aW9uc1tcIlJvYWRXYW5kZXJcIl0gPSBFdmVudHNSb2FkV2FuZGVyO1xyXG5cdFx0XHJcblx0XHRFdmVudHMuZXZlbnRTdGFjayA9IFtdO1xyXG5cdFx0XHJcblx0XHQvL3N1YnNjcmliZSB0byBzdGF0ZVVwZGF0ZXNcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdCQuRGlzcGF0Y2goJ3N0YXRlVXBkYXRlJykuc3Vic2NyaWJlKEV2ZW50cy5oYW5kbGVTdGF0ZVVwZGF0ZXMpO1xyXG5cdH0sXHJcblx0XHJcblx0b3B0aW9uczoge30sIC8vIE5vdGhpbmcgZm9yIG5vd1xyXG4gICAgXHJcblx0YWN0aXZlU2NlbmU6ICcnLFxyXG4gICAgXHJcblx0bG9hZFNjZW5lOiBmdW5jdGlvbihuYW1lKSB7XHJcblx0XHRFbmdpbmUubG9nKCdsb2FkaW5nIHNjZW5lOiAnICsgbmFtZSk7XHJcblx0XHRFdmVudHMuYWN0aXZlU2NlbmUgPSBuYW1lO1xyXG5cdFx0dmFyIHNjZW5lID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnNjZW5lc1tuYW1lXTtcclxuXHRcdFxyXG5cdFx0Ly8gaGFuZGxlcyBvbmUtdGltZSBzY2VuZXMsIHN1Y2ggYXMgaW50cm9kdWN0aW9uc1xyXG5cdFx0Ly8gbWF5YmUgSSBjYW4gbWFrZSBhIG1vcmUgZXhwbGljaXQgXCJpbnRyb2R1Y3Rpb25cIiBsb2dpY2FsIGZsb3cgdG8gbWFrZSB0aGlzXHJcblx0XHQvLyBhIGxpdHRsZSBtb3JlIGVsZWdhbnQsIGdpdmVuIHRoYXQgdGhlcmUgd2lsbCBhbHdheXMgYmUgYW4gXCJpbnRyb2R1Y3Rpb25cIiBzY2VuZVxyXG5cdFx0Ly8gdGhhdCdzIG9ubHkgbWVhbnQgdG8gYmUgcnVuIGEgc2luZ2xlIHRpbWUuXHJcblx0XHRpZiAoc2NlbmUuc2VlbkZsYWcgJiYgc2NlbmUuc2VlbkZsYWcoKSkge1xyXG5cdFx0XHRFdmVudHMubG9hZFNjZW5lKHNjZW5lLm5leHRTY2VuZSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNjZW5lIHJld2FyZFxyXG5cdFx0aWYoc2NlbmUucmV3YXJkKSB7XHJcblx0XHRcdCRTTS5hZGRNKCdzdG9yZXMnLCBzY2VuZS5yZXdhcmQpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBvbkxvYWRcclxuXHRcdGlmKHNjZW5lLm9uTG9hZCkge1xyXG5cdFx0XHRzY2VuZS5vbkxvYWQoKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gTm90aWZ5IHRoZSBzY2VuZSBjaGFuZ2VcclxuXHRcdGlmKHNjZW5lLm5vdGlmaWNhdGlvbikge1xyXG5cdFx0XHROb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBzY2VuZS5ub3RpZmljYXRpb24pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQkKCcjZGVzY3JpcHRpb24nLCBFdmVudHMuZXZlbnRQYW5lbCgpKS5lbXB0eSgpO1xyXG5cdFx0JCgnI2J1dHRvbnMnLCBFdmVudHMuZXZlbnRQYW5lbCgpKS5lbXB0eSgpO1xyXG5cdFx0RXZlbnRzLnN0YXJ0U3Rvcnkoc2NlbmUpO1xyXG5cdH0sXHJcblx0XHJcblx0ZHJhd0Zsb2F0VGV4dDogZnVuY3Rpb24odGV4dCwgcGFyZW50KSB7XHJcblx0XHQkKCc8ZGl2PicpLnRleHQodGV4dCkuYWRkQ2xhc3MoJ2RhbWFnZVRleHQnKS5hcHBlbmRUbyhwYXJlbnQpLmFuaW1hdGUoe1xyXG5cdFx0XHQnYm90dG9tJzogJzUwcHgnLFxyXG5cdFx0XHQnb3BhY2l0eSc6ICcwJ1xyXG5cdFx0fSxcclxuXHRcdDMwMCxcclxuXHRcdCdsaW5lYXInLFxyXG5cdFx0ZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlKCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHQvLyBmb3IgZGljZSBzdHVmZlxyXG5cdGdldFJhbmRvbUludDpmdW5jdGlvbiAobWF4KSB7XHJcbiAgXHRcdHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xyXG5cdH0sXHJcblx0XHJcblx0c3RhcnRTdG9yeTogZnVuY3Rpb24oc2NlbmUpIHtcclxuXHRcdC8vIFdyaXRlIHRoZSB0ZXh0XHJcblx0XHR2YXIgZGVzYyA9ICQoJyNkZXNjcmlwdGlvbicsIEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0dmFyIHRleHRCbG9jayA9IFtdO1xyXG5cdFx0aWYgKHR5cGVvZihzY2VuZS50ZXh0KSA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdHRleHRCbG9jayA9IHNjZW5lLnRleHQoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRleHRCbG9jayA9IHNjZW5lLnRleHQ7XHJcblx0XHR9XHJcblx0XHRmb3IodmFyIGkgaW4gdGV4dEJsb2NrKSB7XHJcblx0XHRcdCQoJzxkaXY+JykudGV4dCh0ZXh0QmxvY2tbaV0pLmFwcGVuZFRvKGRlc2MpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRoaXMgZGljZSBzdHVmZiBjb3VsZCBtYXliZSBiZSBleHRyYWN0ZWQgdG8gaXRzIG93biBmdW5jdGlvbixcclxuXHRcdC8vIGJ1dCBhbHNvIHdlIG1pZ2h0IGp1c3QgbWFrZSBpdCB3YXkgbW9yZSBnZW5lcmljIHNvIHlvdSBjYW5cclxuXHRcdC8vIHRocm93IEFOWVRISU5HIGluIHRoZSBFdmVudCBkZXNjcmlwdGlvbiBkeW5hbWljYWxseVxyXG5cdFx0Y29uc3QgZGljZVZhbHMgPSBbXTtcclxuXHRcdGlmIChzY2VuZS5kaWNlICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IHNjZW5lLmRpY2UuYW1vdW50OyBqKyspIHtcclxuXHRcdFx0XHR2YXIgZGllVmFsID0gdGhpcy5nZXRSYW5kb21JbnQoNikgKyAxO1xyXG5cdFx0XHRcdGRpY2VWYWxzLnB1c2goZGllVmFsKTtcclxuXHRcdFx0XHRpZiAoc2NlbmUuZGljZS5kaWVGYWNlcyAmJiBzY2VuZS5kaWNlLmRpZUZhY2VzW2RpZVZhbF0gIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdFx0ZGllVmFsID0gc2NlbmUuZGljZS5kaWVGYWNlc1tkaWVWYWxdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjb25zdCB0aWx0VmFsID0gdGhpcy5nZXRSYW5kb21JbnQoOTApIC0gNDU7XHJcblx0XHRcdFx0Y29uc3QgbWFyZ2luVmFsID0gKHRoaXMuZ2V0UmFuZG9tSW50KDQpICsgMikgKiA1O1xyXG5cdFx0XHRcdGRlc2MuYXBwZW5kKFxyXG5cdFx0XHRcdFx0JCgnPGltZz4nLHtpZDonZGllJyArIGRpZVZhbC50b1N0cmluZygpICxzcmM6J2Fzc2V0cy9kaWUvZGllJyArIGRpZVZhbC50b1N0cmluZygpICsgJy5wbmcnfSlcclxuXHRcdFx0XHRcdC5jc3MoJ3dpZHRoJywgJzUlJylcclxuXHRcdFx0XHRcdC5jc3MoJ2hlaWdodCcsICdhdXRvJylcclxuXHRcdFx0XHRcdC5jc3Moe1xyXG5cdFx0XHRcdFx0XHRcIi13ZWJraXQtdHJhbnNmb3JtXCI6IFwicm90YXRlKFwiICsgdGlsdFZhbC50b1N0cmluZygpICsgXCJkZWcpXCIsXHJcblx0XHRcdFx0XHRcdFwiLW1vei10cmFuc2Zvcm1cIjogXCJyb3RhdGUoXCIgKyB0aWx0VmFsLnRvU3RyaW5nKCkgKyBcImRlZylcIixcclxuXHRcdFx0XHRcdFx0XCJ0cmFuc2Zvcm1cIjogXCJyb3RhdGUoXCIgKyB0aWx0VmFsLnRvU3RyaW5nKCkgKyBcImRlZylcIlxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHQuY3NzKCdtYXJnaW4tcmlnaHQnLCBtYXJnaW5WYWwudG9TdHJpbmcoKSArICdweCcpXHJcblx0XHRcdFx0XHQuY3NzKCdtYXJnaW4tYm90dG9tJywgJzIwcHgnKVxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IHRleHRWYWxzOiBBcnJheTxzdHJpbmc+ID0gc2NlbmUuZGljZS5oYW5kbGVyKGRpY2VWYWxzKTtcclxuXHRcdFx0Zm9yIChjb25zdCB0ZXh0IGluIHRleHRWYWxzKSB7XHJcblx0XHRcdFx0JCgnPGRpdj4nKS50ZXh0KHRleHRWYWxzW3RleHRdKS5hcHBlbmRUbyhkZXNjKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZihzY2VuZS50ZXh0YXJlYSAhPSBudWxsKSB7XHJcblx0XHRcdHZhciB0YSA9ICQoJzx0ZXh0YXJlYT4nKS52YWwoc2NlbmUudGV4dGFyZWEpLmFwcGVuZFRvKGRlc2MpO1xyXG5cdFx0XHRpZihzY2VuZS5yZWFkb25seSkge1xyXG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdFx0XHR0YS5hdHRyKCdyZWFkb25seScsIHRydWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIERyYXcgdGhlIGJ1dHRvbnNcclxuXHRcdEV2ZW50cy5kcmF3QnV0dG9ucyhzY2VuZSk7XHJcblx0fSxcclxuXHRcclxuXHRkcmF3QnV0dG9uczogZnVuY3Rpb24oc2NlbmUpIHtcclxuXHRcdHZhciBidG5zID0gJCgnI2J1dHRvbnMnLCBFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdGZvcih2YXIgaWQgaW4gc2NlbmUuYnV0dG9ucykge1xyXG5cdFx0XHR2YXIgaW5mbyA9IHNjZW5lLmJ1dHRvbnNbaWRdO1xyXG5cdFx0XHR2YXIgdGV4dCA9ICcnO1xyXG5cdFx0XHRpZiAodHlwZW9mKGluZm8udGV4dCkgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRcdHRleHQgPSBpbmZvLnRleHQoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0ZXh0ID0gaW5mby50ZXh0O1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBiID0gQnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdFx0aWQ6IGlkLFxyXG5cdFx0XHRcdHRleHQ6IHRleHQsXHJcblx0XHRcdFx0Y29zdDogaW5mby5jb3N0LFxyXG5cdFx0XHRcdGNsaWNrOiBFdmVudHMuYnV0dG9uQ2xpY2ssXHJcblx0XHRcdFx0Y29vbGRvd246IGluZm8uY29vbGRvd24sXHJcblx0XHRcdFx0aW1hZ2U6IGluZm8uaW1hZ2VcclxuXHRcdFx0fSkuYXBwZW5kVG8oYnRucyk7XHJcblx0XHRcdGlmKHR5cGVvZiBpbmZvLmF2YWlsYWJsZSA9PSAnZnVuY3Rpb24nICYmICFpbmZvLmF2YWlsYWJsZSgpKSB7XHJcblx0XHRcdFx0QnV0dG9uLnNldERpc2FibGVkKGIsIHRydWUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHR5cGVvZiBpbmZvLnZpc2libGUgPT0gJ2Z1bmN0aW9uJyAmJiAhaW5mby52aXNpYmxlKCkpIHtcclxuXHRcdFx0XHRiLmhpZGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih0eXBlb2YgaW5mby5jb29sZG93biA9PSAnbnVtYmVyJykge1xyXG5cdFx0XHRcdEJ1dHRvbi5jb29sZG93bihiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRFdmVudHMudXBkYXRlQnV0dG9ucygpO1xyXG5cdH0sXHJcblx0XHJcblx0dXBkYXRlQnV0dG9uczogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgYnRucyA9IEV2ZW50cy5hY3RpdmVFdmVudCgpPy5zY2VuZXNbRXZlbnRzLmFjdGl2ZVNjZW5lXS5idXR0b25zO1xyXG5cdFx0Zm9yKHZhciBiSWQgaW4gYnRucykge1xyXG5cdFx0XHR2YXIgYiA9IGJ0bnNbYklkXTtcclxuXHRcdFx0dmFyIGJ0bkVsID0gJCgnIycrYklkLCBFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdFx0aWYodHlwZW9mIGIuYXZhaWxhYmxlID09ICdmdW5jdGlvbicgJiYgIWIuYXZhaWxhYmxlKCkpIHtcclxuXHRcdFx0XHRCdXR0b24uc2V0RGlzYWJsZWQoYnRuRWwsIHRydWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRidXR0b25DbGljazogZnVuY3Rpb24oYnRuKSB7XHJcblx0XHR2YXIgaW5mbyA9IEV2ZW50cy5hY3RpdmVFdmVudCgpPy5zY2VuZXNbRXZlbnRzLmFjdGl2ZVNjZW5lXS5idXR0b25zW2J0bi5hdHRyKCdpZCcpXTtcclxuXHJcblx0XHRpZih0eXBlb2YgaW5mby5vbkNob29zZSA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdHZhciB0ZXh0YXJlYSA9IEV2ZW50cy5ldmVudFBhbmVsKCkuZmluZCgndGV4dGFyZWEnKTtcclxuXHRcdFx0aW5mby5vbkNob29zZSh0ZXh0YXJlYS5sZW5ndGggPiAwID8gdGV4dGFyZWEudmFsKCkgOiBudWxsKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gUmV3YXJkXHJcblx0XHRpZihpbmZvLnJld2FyZCkge1xyXG5cdFx0XHQkU00uYWRkTSgnc3RvcmVzJywgaW5mby5yZXdhcmQpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRFdmVudHMudXBkYXRlQnV0dG9ucygpO1xyXG5cdFx0XHJcblx0XHQvLyBOb3RpZmljYXRpb25cclxuXHRcdGlmKGluZm8ubm90aWZpY2F0aW9uKSB7XHJcblx0XHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIGluZm8ubm90aWZpY2F0aW9uKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gTmV4dCBTY2VuZVxyXG5cdFx0aWYoaW5mby5uZXh0U2NlbmUpIHtcclxuXHRcdFx0aWYoaW5mby5uZXh0U2NlbmUgPT0gJ2VuZCcpIHtcclxuXHRcdFx0XHRFdmVudHMuZW5kRXZlbnQoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR2YXIgciA9IE1hdGgucmFuZG9tKCk7XHJcblx0XHRcdFx0dmFyIGxvd2VzdE1hdGNoOiBudWxsIHwgc3RyaW5nID0gbnVsbDtcclxuXHRcdFx0XHRmb3IodmFyIGkgaW4gaW5mby5uZXh0U2NlbmUpIHtcclxuXHRcdFx0XHRcdGlmKHIgPCAoaSBhcyB1bmtub3duIGFzIG51bWJlcikgJiYgKGxvd2VzdE1hdGNoID09IG51bGwgfHwgaSA8IGxvd2VzdE1hdGNoKSkge1xyXG5cdFx0XHRcdFx0XHRsb3dlc3RNYXRjaCA9IGk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGxvd2VzdE1hdGNoICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdEV2ZW50cy5sb2FkU2NlbmUoaW5mby5uZXh0U2NlbmVbbG93ZXN0TWF0Y2hdKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0RW5naW5lLmxvZygnRVJST1I6IG5vIHN1aXRhYmxlIHNjZW5lIGZvdW5kJyk7XHJcblx0XHRcdFx0RXZlbnRzLmVuZEV2ZW50KCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHQvLyBibGlua3MgdGhlIGJyb3dzZXIgd2luZG93IHRpdGxlXHJcblx0YmxpbmtUaXRsZTogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdGl0bGUgPSBkb2N1bWVudC50aXRsZTtcclxuXHJcblx0XHQvLyBldmVyeSAzIHNlY29uZHMgY2hhbmdlIHRpdGxlIHRvICcqKiogRVZFTlQgKioqJywgdGhlbiAxLjUgc2Vjb25kcyBsYXRlciwgY2hhbmdlIGl0IGJhY2sgdG8gdGhlIG9yaWdpbmFsIHRpdGxlLlxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0RXZlbnRzLkJMSU5LX0lOVEVSVkFMID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdGRvY3VtZW50LnRpdGxlID0gXygnKioqIEVWRU5UICoqKicpO1xyXG5cdFx0XHRFbmdpbmUuc2V0VGltZW91dChmdW5jdGlvbigpIHtkb2N1bWVudC50aXRsZSA9IHRpdGxlO30sIDE1MDAsIHRydWUpOyBcclxuXHRcdH0sIDMwMDApO1xyXG5cdH0sXHJcblxyXG5cdHN0b3BUaXRsZUJsaW5rOiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdGNsZWFySW50ZXJ2YWwoRXZlbnRzLkJMSU5LX0lOVEVSVkFMKTtcclxuXHRcdEV2ZW50cy5CTElOS19JTlRFUlZBTCA9IGZhbHNlO1xyXG5cdH0sXHJcblx0XHJcblx0Ly8gTWFrZXMgYW4gZXZlbnQgaGFwcGVuIVxyXG5cdHRyaWdnZXJFdmVudDogZnVuY3Rpb24oKSB7XHJcblx0XHRpZihFdmVudHMuYWN0aXZlRXZlbnQoKSA9PSBudWxsKSB7XHJcblx0XHRcdHZhciBwb3NzaWJsZUV2ZW50cyA9IFtdO1xyXG5cdFx0XHRmb3IodmFyIGkgaW4gRXZlbnRzLkV2ZW50UG9vbCkge1xyXG5cdFx0XHRcdHZhciBldmVudCA9IEV2ZW50cy5FdmVudFBvb2xbaV07XHJcblx0XHRcdFx0aWYoZXZlbnQuaXNBdmFpbGFibGUoKSkge1xyXG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdFx0cG9zc2libGVFdmVudHMucHVzaChldmVudCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZihwb3NzaWJsZUV2ZW50cy5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHRFdmVudHMuc2NoZWR1bGVOZXh0RXZlbnQoMC41KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFyIHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqKHBvc3NpYmxlRXZlbnRzLmxlbmd0aCkpO1xyXG5cdFx0XHRcdEV2ZW50cy5zdGFydEV2ZW50KHBvc3NpYmxlRXZlbnRzW3JdKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdEV2ZW50cy5zY2hlZHVsZU5leHRFdmVudCgpO1xyXG5cdH0sXHJcblxyXG5cdC8vIG5vdCBzY2hlZHVsZWQsIHRoaXMgaXMgZm9yIHN0dWZmIGxpa2UgbG9jYXRpb24tYmFzZWQgcmFuZG9tIGV2ZW50cyBvbiBhIGJ1dHRvbiBjbGlja1xyXG5cdHRyaWdnZXJMb2NhdGlvbkV2ZW50OiBmdW5jdGlvbihsb2NhdGlvbikge1xyXG5cdFx0aWYgKHRoaXMuTG9jYXRpb25zW2xvY2F0aW9uXSkge1xyXG5cdFx0XHRpZihFdmVudHMuYWN0aXZlRXZlbnQoKSA9PSBudWxsKSB7XHJcblx0XHRcdFx0dmFyIHBvc3NpYmxlRXZlbnRzOiBBcnJheTxhbnk+ID0gW107XHJcblx0XHRcdFx0Zm9yKHZhciBpIGluIHRoaXMuTG9jYXRpb25zW2xvY2F0aW9uXSkge1xyXG5cdFx0XHRcdFx0dmFyIGV2ZW50ID0gdGhpcy5Mb2NhdGlvbnNbbG9jYXRpb25dW2ldO1xyXG5cdFx0XHRcdFx0aWYoZXZlbnQuaXNBdmFpbGFibGUoKSkge1xyXG5cdFx0XHRcdFx0XHRpZih0eXBlb2YoZXZlbnQuaXNTdXBlckxpa2VseSkgPT0gJ2Z1bmN0aW9uJyAmJiBldmVudC5pc1N1cGVyTGlrZWx5KCkpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBTdXBlckxpa2VseSBldmVudCwgZG8gdGhpcyBhbmQgc2tpcCB0aGUgcmFuZG9tIGNob2ljZVxyXG5cdFx0XHRcdFx0XHRcdEVuZ2luZS5sb2coJ3N1cGVyTGlrZWx5IGRldGVjdGVkJyk7XHJcblx0XHRcdFx0XHRcdFx0RXZlbnRzLnN0YXJ0RXZlbnQoZXZlbnQpO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRwb3NzaWJsZUV2ZW50cy5wdXNoKGV2ZW50KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHJcblx0XHRcdFx0aWYocG9zc2libGVFdmVudHMubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdFx0XHQvLyBFdmVudHMuc2NoZWR1bGVOZXh0RXZlbnQoMC41KTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dmFyIHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqKHBvc3NpYmxlRXZlbnRzLmxlbmd0aCkpO1xyXG5cdFx0XHRcdFx0RXZlbnRzLnN0YXJ0RXZlbnQocG9zc2libGVFdmVudHNbcl0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0YWN0aXZlRXZlbnQ6IGZ1bmN0aW9uKCk6IEFEUkV2ZW50IHwgbnVsbCB7XHJcblx0XHRpZihFdmVudHMuZXZlbnRTdGFjayAmJiBFdmVudHMuZXZlbnRTdGFjay5sZW5ndGggPiAwKSB7XHJcblx0XHRcdHJldHVybiBFdmVudHMuZXZlbnRTdGFja1swXTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH0sXHJcblx0XHJcblx0ZXZlbnRQYW5lbDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LmV2ZW50UGFuZWw7XHJcblx0fSxcclxuXHJcblx0c3RhcnRFdmVudDogZnVuY3Rpb24oZXZlbnQ6IEFEUkV2ZW50LCBvcHRpb25zPykge1xyXG5cdFx0aWYoZXZlbnQpIHtcclxuXHRcdFx0RXZlbnRzLmV2ZW50U3RhY2sudW5zaGlmdChldmVudCk7XHJcblx0XHRcdGV2ZW50LmV2ZW50UGFuZWwgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2V2ZW50JykuYWRkQ2xhc3MoJ2V2ZW50UGFuZWwnKS5jc3MoJ29wYWNpdHknLCAnMCcpO1xyXG5cdFx0XHRpZihvcHRpb25zICE9IG51bGwgJiYgb3B0aW9ucy53aWR0aCAhPSBudWxsKSB7XHJcblx0XHRcdFx0RXZlbnRzLmV2ZW50UGFuZWwoKS5jc3MoJ3dpZHRoJywgb3B0aW9ucy53aWR0aCk7XHJcblx0XHRcdH1cclxuXHRcdFx0JCgnPGRpdj4nKS5hZGRDbGFzcygnZXZlbnRUaXRsZScpLnRleHQoRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnRpdGxlIGFzIHN0cmluZykuYXBwZW5kVG8oRXZlbnRzLmV2ZW50UGFuZWwoKSk7XHJcblx0XHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnZGVzY3JpcHRpb24nKS5hcHBlbmRUbyhFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdidXR0b25zJykuYXBwZW5kVG8oRXZlbnRzLmV2ZW50UGFuZWwoKSk7XHJcblx0XHRcdEV2ZW50cy5sb2FkU2NlbmUoJ3N0YXJ0Jyk7XHJcblx0XHRcdCQoJ2RpdiN3cmFwcGVyJykuYXBwZW5kKEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0XHRFdmVudHMuZXZlbnRQYW5lbCgpLmFuaW1hdGUoe29wYWNpdHk6IDF9LCBFdmVudHMuX1BBTkVMX0ZBREUsICdsaW5lYXInKTtcclxuXHRcdFx0dmFyIGN1cnJlbnRTY2VuZUluZm9ybWF0aW9uID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnNjZW5lc1tFdmVudHMuYWN0aXZlU2NlbmVdO1xyXG5cdFx0XHRpZiAoY3VycmVudFNjZW5lSW5mb3JtYXRpb24uYmxpbmspIHtcclxuXHRcdFx0XHRFdmVudHMuYmxpbmtUaXRsZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0c2NoZWR1bGVOZXh0RXZlbnQ6IGZ1bmN0aW9uKHNjYWxlPykge1xyXG5cdFx0dmFyIG5leHRFdmVudCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSooRXZlbnRzLl9FVkVOVF9USU1FX1JBTkdFWzFdIC0gRXZlbnRzLl9FVkVOVF9USU1FX1JBTkdFWzBdKSkgKyBFdmVudHMuX0VWRU5UX1RJTUVfUkFOR0VbMF07XHJcblx0XHRpZihzY2FsZSA+IDApIHsgbmV4dEV2ZW50ICo9IHNjYWxlOyB9XHJcblx0XHRFbmdpbmUubG9nKCduZXh0IGV2ZW50IHNjaGVkdWxlZCBpbiAnICsgbmV4dEV2ZW50ICsgJyBtaW51dGVzJyk7XHJcblx0XHRFdmVudHMuX2V2ZW50VGltZW91dCA9IEVuZ2luZS5zZXRUaW1lb3V0KEV2ZW50cy50cmlnZ2VyRXZlbnQsIG5leHRFdmVudCAqIDYwICogMTAwMCk7XHJcblx0fSxcclxuXHJcblx0ZW5kRXZlbnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLmV2ZW50UGFuZWwoKS5hbmltYXRlKHtvcGFjaXR5OjB9LCBFdmVudHMuX1BBTkVMX0ZBREUsICdsaW5lYXInLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0RXZlbnRzLmV2ZW50UGFuZWwoKS5yZW1vdmUoKTtcclxuXHRcdFx0Y29uc3QgYWN0aXZlRXZlbnQgPSBFdmVudHMuYWN0aXZlRXZlbnQoKTtcclxuXHRcdFx0aWYgKGFjdGl2ZUV2ZW50ICE9PSBudWxsKSBhY3RpdmVFdmVudC5ldmVudFBhbmVsID0gbnVsbDtcclxuXHRcdFx0RXZlbnRzLmV2ZW50U3RhY2suc2hpZnQoKTtcclxuXHRcdFx0RW5naW5lLmxvZyhFdmVudHMuZXZlbnRTdGFjay5sZW5ndGggKyAnIGV2ZW50cyByZW1haW5pbmcnKTtcclxuXHRcdFx0aWYgKEV2ZW50cy5CTElOS19JTlRFUlZBTCkge1xyXG5cdFx0XHRcdEV2ZW50cy5zdG9wVGl0bGVCbGluaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIEZvcmNlIHJlZm9jdXMgb24gdGhlIGJvZHkuIEkgaGF0ZSB5b3UsIElFLlxyXG5cdFx0XHQkKCdib2R5JykuZm9jdXMoKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGhhbmRsZVN0YXRlVXBkYXRlczogZnVuY3Rpb24oZSl7XHJcblx0XHRpZigoZS5jYXRlZ29yeSA9PSAnc3RvcmVzJyB8fCBlLmNhdGVnb3J5ID09ICdpbmNvbWUnKSAmJiBFdmVudHMuYWN0aXZlRXZlbnQoKSAhPSBudWxsKXtcclxuXHRcdFx0RXZlbnRzLnVwZGF0ZUJ1dHRvbnMoKTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcbiIsIi8qKlxyXG4gKiBFdmVudHMgdGhhdCBjYW4gb2NjdXIgd2hlbiB0aGUgUm9hZCBtb2R1bGUgaXMgYWN0aXZlXHJcbiAqKi9cclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4uL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4uL3BsYXllci9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IHsgT3V0cG9zdCB9IGZyb20gXCIuLi9wbGFjZXMvb3V0cG9zdFwiO1xyXG5pbXBvcnQgeyBSb2FkIH0gZnJvbSBcIi4uL3BsYWNlcy9yb2FkXCI7XHJcbmltcG9ydCB7IEFEUkV2ZW50IH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEV2ZW50c1JvYWRXYW5kZXI6IEFycmF5PEFEUkV2ZW50PiA9IFtcclxuICAgIC8vIFN0cmFuZ2VyIGJlYXJpbmcgZ2lmdHNcclxuICAgIHtcclxuICAgICAgICB0aXRsZTogXygnQSBTdHJhbmdlciBCZWNrb25zJyksXHJcbiAgICAgICAgaXNBdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSBSb2FkO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICdzdGFydCc6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdBcyB5b3Ugd2FuZGVyIGFsb25nIHRoZSByb2FkLCBhIGhvb2RlZCBzdHJhbmdlciBnZXN0dXJlcyB0byB5b3UuIEhlIGRvZXNuXFwndCBzZWVtIGludGVyZXN0ZWQgaW4gaHVydGluZyB5b3UuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnV2hhdCBkbyB5b3UgZG8/JylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2Nsb3Nlcic6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnRHJhdyBDbG9zZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTogJ2Nsb3Nlcid9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAnbGVhdmUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0dldCBPdXR0YSBUaGVyZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOiAnbGVhdmUnfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2Nsb3Nlcic6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdZb3UgbW92ZSB0b3dhcmQgaGltIGEgYml0IGFuZCBzdG9wLiBIZSBjb250aW51ZXMgdG8gYmVja29uLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1doYXQgZG8geW91IGRvPycpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdldmVuQ2xvc2VyJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdEcmF3IEV2ZW4gQ2xvc2VyJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6ICdldmVuQ2xvc2VyJ31cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnTmFoLCBUaGlzIGlzIFRvbyBTcG9va3knKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTogJ2xlYXZlJ31cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdldmVuQ2xvc2VyJzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1lvdSBoZXNpdGFudGx5IHdhbGsgY2xvc2VyLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0FzIHNvb24gYXMgeW91IGdldCB3aXRoaW4gYXJtc1xcJyByZWFjaCwgaGUgZ3JhYnMgeW91ciBoYW5kIHdpdGggYWxhcm1pbmcgc3BlZWQuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnSGUgcXVpY2tseSBwbGFjZXMgYW4gb2JqZWN0IGluIHlvdXIgaGFuZCwgdGhlbiBsZWF2ZXMgd29yZGxlc3NseS4nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIG9uTG9hZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbWF5YmUgc29tZSBsb2dpYyB0byBtYWtlIHJlcGVhdHMgbGVzcyBsaWtlbHk/XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9zc2libGVJdGVtcyA9IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ1N0cmFuZ2VyLnNtb290aFN0b25lJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ1N0cmFuZ2VyLndyYXBwZWRLbmlmZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdTdHJhbmdlci5jbG90aEJ1bmRsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdTdHJhbmdlci5jb2luJ1xyXG4gICAgICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IHBvc3NpYmxlSXRlbXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcG9zc2libGVJdGVtcy5sZW5ndGgpXTtcclxuICAgICAgICAgICAgICAgICAgICBDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdUaGFua3MsIEkgZ3Vlc3M/JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdZb3VyIGd1dCBjbGVuY2hlcywgYW5kIHlvdSBmZWVsIHRoZSBzdWRkZW4gdXJnZSB0byBsZWF2ZS4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdBcyB5b3Ugd2FsayBhd2F5LCB5b3UgY2FuIGZlZWwgdGhlIG9sZCBtYW5cXCdzIGdhemUgb24geW91ciBiYWNrLicpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdXZWlyZC4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBPbGQgbGFkeSBpbiBjYXJyaWFnZSwgc2hvcnRjdXQgdG8gT3V0cG9zdFxyXG4gICAge1xyXG4gICAgICAgIHRpdGxlOiBfKCdUaGUgU3RvbXBpbmcgb2YgSG9vdmVzIGFuZCBDcmVha2luZyBvZiBXb29kJyksXHJcbiAgICAgICAgaXNBdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSBSb2FkO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICdzdGFydCc6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdBIGNhcnJpYWdlIHB1bGxzIHVwIGFsb25nc2lkZSB5b3UsIGFuZCB0aGUgdm9pY2Ugb2YgYW4gZWxkZXJseSB3b21hbiBjcm9ha3Mgb3V0IGZyb20gd2l0aGluLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1wiTXksIGJ1dCB5b3UgbG9vayB0aXJlZCBmcm9tIHlvdXIgam91cm5leS4gSWYgaXRcXCdzIHRoZSBPdXRwb3N0IHlvdSBzZWVrLCAnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICArICdJXFwnbSBvbiBteSB3YXkgdGhlcmUgbm93OyB3b3VsZCB5b3UgbGlrZSB0byBqb2luIG1lP1wiJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnV2hhdCBkbyB5b3UgZG8/JylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2FjY2VwdCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnQWNjZXB0IGhlciBvZmZlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOiAnYWNjZXB0J31cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnUG9saXRlbHkgRGVjbGluZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOiAnbGVhdmUnfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2FjY2VwdCc6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdZb3UgaG9wIGluIHRoZSBjYXJyaWFnZSB3aXRoIHRoZSBvbGQgd29tYW4uJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnU2hlIHR1cm5zIG91dCB0byBiZSBwcmV0dHkgY29vbCwgYW5kIGdpdmVzIHlvdSBvbmUgb2YgdGhvc2UgaGFyZCBjYW5kaWVzIHRoYXQgJyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyAnZXZlcnkgZ3JhbmRwYXJlbnQgc2VlbXMgdG8gaGF2ZSBvbiB0aGUgZW5kIHRhYmxlIG5leHQgdG8gdGhlaXIgc29mYS4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdCZWZvcmUgbG9uZywgeW91IHJlYWNoIHRoZSBPdXRwb3N0LiBZb3UgaG9wIG91dCBhbmQgdGhhbmsgdGhlIG9sZCB3b21hbiBmb3IgdGhlIHJpZGUuJylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1doYXQgYSBuaWNlIG9sZCBsYWR5JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkU00uZ2V0KCdPdXRwb3N0Lm9wZW4nKSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT3V0cG9zdC5pbml0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJFNNLnNldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENoYXJhY3Rlci5zZXRRdWVzdFN0YXR1cyhcIm1heW9yU3VwcGxpZXNcIiwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hhcmFjdGVyLmNoZWNrUXVlc3RTdGF0dXMoXCJtYXlvclN1cHBsaWVzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVuZ2luZS50cmF2ZWxUbyhPdXRwb3N0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hhcmFjdGVyLmFkZFRvSW52ZW50b3J5KCdvbGRMYWR5LkNhbmR5Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdJdFxcJ3MgdG9vIGVhcmx5IGluIHRoZSBnYW1lIHRvIGJlIHRydXN0aW5nIHdlaXJkIG9sZCBwZW9wbGUsIG1hbi4gWW91IHBvbGl0ZWx5ICcgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJ2RlY2xpbmUsIGFuZCB0aGUgd29tYW4gY2h1Y2tsZXMgc29mdGx5IGFzIHRoZSBjYXJyaWFnZSByb2xscyBvZmYgaW50byB0aGUgZGlzdGFuY2UuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnVGhhdCBzb2Z0IGNodWNrbGUgdGVsbHMgbWUgZXZlcnl0aGluZyBJIG5lZWQgdG8ga25vdyBhYm91dCB3aGV0aGVyIHlvdSBtYWRlIHRoZSAnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJ3JpZ2h0IGNhbGwuIFRoYXQgaGFkIFwidHVybmVkIGludG8gZ2luZ2VyYnJlYWRcIiB3cml0dGVuIGFsbCBvdmVyIGl0LicpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdZZWFoIGl0IGRpZCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIE9yZ2FuIHRyYXVtYVxyXG4gICAge1xyXG4gICAgICAgIHRpdGxlOiBfKCdUaGlzIEd1eSBTZWVtcyBGcmllbmRseScpLFxyXG4gICAgICAgIGlzQXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChFbmdpbmUuYWN0aXZlTW9kdWxlID09PSBSb2FkXHJcbiAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdSb2FkLmdvdFB1bmNoZWQnKSA9PT0gdW5kZWZpbmVkKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAnc3RhcnQnOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgXygnQSBtYW4gd2Fsa3MgdXAgdG8geW91IHdpdGggYSBiaWcgZ3JpbiBvbiBoaXMgZmFjZSwgYW5kIGJlZm9yZSB5b3UgY2FuIGdyZWV0IGhpbSBoZSBzd2lmdGx5IHNvY2tzIHlvdSBpbiB0aGUgc3RvbWFjaC4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdIZSB3YWxrcyBvZmYgd2hpc3RsaW5nIHdoaWxlIHlvdSBnYXNwIGZvciBicmVhdGggaW4gdGhlIGRpcnQuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnLi4uIE1hbiwgd2hhdCBhIGRpY2suJylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0Z1Y2sgbWUsIEkgZ3Vlc3MnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENoYXJhY3Rlci5ncmFudFBlcmsoJ3R1bW15UGFpbicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJFNNLnNldCgnUm9hZC5nb3RQdW5jaGVkJywgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gQW4gYXBvbG9neSBmb3Igb3JnYW4gdHJhdW1hXHJcbiAgICB7XHJcbiAgICAgICAgdGl0bGU6IF8oJ1RoaXMgRnVja2luZyBHdXkgQWdhaW4nKSxcclxuICAgICAgICBpc0F2YWlsYWJsZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoRW5naW5lLmFjdGl2ZU1vZHVsZSA9PT0gUm9hZFxyXG4gICAgICAgICAgICAgICAgJiYgKCRTTS5nZXQoJ1JvYWQuZ290UHVuY2hlZCcpICE9PSB1bmRlZmluZWQpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAnc3RhcnQnOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgXygnQSBtYW4gd2Fsa3MgdXAgdG8geW91IHdpdGggYSBiaWcgZ3JpbiBvbiBoaXMgZmFjZSwgYW5kIGJlZm9yZSB5b3UgY2FuIGdyZWV0IGhpbSBoZSBzd2lmdGx5Li4uIGFwb2xvZ2l6ZXMuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnXCJIZXksIElcXCdtIHJlYWxseSBzb3JyeSBhYm91dCBwdW5jaGluZyB5b3UgaW4gdGhlIHN0b21hY2ggYmVmb3JlLiBJIHRob3VnaHQgeW91IHdlcmUgc29tZW9uZSBlbHNlLiBJIEhBVEUgdGhhdCBndXkuXCInKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdZb3VcXCdyZSBub3Qgc3VyZSB0aGlzIGlzIGEgZ29vZCBlbm91Z2ggcmVhc29uIHRvIG5vdCBraWNrIHRoaXMgZ3V5XFwncyBhc3MuIFNlZWluZyB0aGUgbG9vayBvbiB5b3VyIGZhY2UsIGhlIGhhc3RpbHkgY29udGludWVzLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1wiQW55d2F5LCBhcyBhIHRva2VuIG9mIG15IGFwb2xvZ3ksIHBsZWFzZSBhY2NlcHQgdGhpcyBoZWFsaW5nIHRvbmljLCBhcyB3ZWxsIGFzIGEgY291cG9uIGZvciBhIHNlY3JldCBpdGVtIGZyb20gdGhlIHN0b3JlIGluIHRoZSB2aWxsYWdlLlwiJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnWW91IHNvbWV3aGF0IGF3a3dhcmRseSBhY2NlcHQgYm90aCBvZiB0aGVzZSBpdGVtcywgdGhvdWdoIHlvdSBkb25cXCd0IHRoaW5rIHRoZXJlXFwncyBhIHN0b3JlIGluIHRoZSB2aS0nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdcIk9oLCBhbmQgSVxcJ20gdGhlIG93bmVyIG9mIHRoZSBzdG9yZSBpbiB0aGUgdmlsbGFnZS4gSSBvcGVuZWQgaXQgYmFjayB1cCBhZnRlciBwdW5jaGluZyB5b3UuIFlvdSBrbm93LCB0byBjZWxlYnJhdGUuXCInKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdUaGUgbWFuIHdhbGtzIG9mZiwgc3RpbGwgZ3Jpbm5pbmcuJylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJy4uLiBBbHJpZ2h0JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBnaXZlIGhlYWxpbmcgdG9uaWNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdpdmUgY291cG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB1bmxvY2sgc3RvcmUgYnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkU00uc2V0KCdSb2FkLmdvdEFwb2xvZ2l6ZWQnLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBVbmxvY2sgT3V0cG9zdFxyXG4gICAge1xyXG4gICAgICAgIHRpdGxlOiBfKCdBIFdheSBGb3J3YXJkIE1ha2VzIEl0c2VsZiBLbm93bicpLFxyXG4gICAgICAgIGlzQXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIChFbmdpbmUuYWN0aXZlTW9kdWxlID09PSBSb2FkKVxyXG4gICAgICAgICAgICAgICAgJiYgKCRTTS5nZXQoJ1JvYWQuY291bnRlcicpIGFzIG51bWJlciA+IDMpIC8vIGNhbid0IGhhcHBlbiBUT08gZWFybHlcclxuICAgICAgICAgICAgICAgICYmICgkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgfHwgJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpIGFzIG51bWJlciA8IDEpIC8vIGNhbid0IGhhcHBlbiB0d2ljZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaXNTdXBlckxpa2VseTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoKCggJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHx8ICRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPCAxKSkgXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgKCRTTS5nZXQoJ1JvYWQuY291bnRlcicpIGFzIG51bWJlciA+IDcpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICdzdGFydCc6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdTbW9rZSBjdXJscyB1cHdhcmRzIGZyb20gYmVoaW5kIGEgaGlsbC4gWW91IGNsaW1iIGhpZ2hlciB0byBpbnZlc3RpZ2F0ZS4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdGcm9tIHlvdXIgZWxldmF0ZWQgcG9zaXRpb24sIHlvdSBjYW4gc2VlIGRvd24gaW50byB0aGUgb3V0cG9zdCB0aGF0IHRoZSBtYXlvciBzcG9rZSBvZiBiZWZvcmUuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnVGhlIE91dHBvc3QgaXMgbm93IG9wZW4gdG8geW91LicpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBIGxpdHRsZSBkcmFtYXRpYywgYnV0IGNvb2wnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgT3V0cG9zdC5pbml0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkU00uc2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJywgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGFyYWN0ZXIuc2V0UXVlc3RTdGF0dXMoXCJtYXlvclN1cHBsaWVzXCIsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hhcmFjdGVyLmNoZWNrUXVlc3RTdGF0dXMoXCJtYXlvclN1cHBsaWVzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXTtcclxuXHJcbiIsIi8qKlxyXG4gKiBNb2R1bGUgdGhhdCB0YWtlcyBjYXJlIG9mIGhlYWRlciBidXR0b25zXHJcbiAqL1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi9lbmdpbmVcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBIZWFkZXIgPSB7XHJcblx0XHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHR9LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHt9LCAvLyBOb3RoaW5nIGZvciBub3dcclxuXHRcclxuXHRjYW5UcmF2ZWw6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuICQoJ2RpdiNoZWFkZXIgZGl2LmhlYWRlckJ1dHRvbicpLmxlbmd0aCA+IDE7XHJcblx0fSxcclxuXHRcclxuXHRhZGRMb2NhdGlvbjogZnVuY3Rpb24odGV4dCwgaWQsIG1vZHVsZSkge1xyXG5cdFx0cmV0dXJuICQoJzxkaXY+JykuYXR0cignaWQnLCBcImxvY2F0aW9uX1wiICsgaWQpXHJcblx0XHRcdC5hZGRDbGFzcygnaGVhZGVyQnV0dG9uJylcclxuXHRcdFx0LnRleHQodGV4dCkuY2xpY2soZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYoSGVhZGVyLmNhblRyYXZlbCgpKSB7XHJcblx0XHRcdFx0XHRFbmdpbmUudHJhdmVsVG8obW9kdWxlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pLmFwcGVuZFRvKCQoJ2RpdiNoZWFkZXInKSk7XHJcblx0fVxyXG59OyIsIi8qKlxyXG4gKiBNb2R1bGUgdGhhdCByZWdpc3RlcnMgdGhlIG5vdGlmaWNhdGlvbiBib3ggYW5kIGhhbmRsZXMgbWVzc2FnZXNcclxuICovXHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuL2VuZ2luZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IE5vdGlmaWNhdGlvbnMgPSB7XHJcblx0XHRcclxuXHRpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHRcdFxyXG5cdFx0Ly8gQ3JlYXRlIHRoZSBub3RpZmljYXRpb25zIGJveFxyXG5cdFx0Y29uc3QgZWxlbSA9ICQoJzxkaXY+JykuYXR0cih7XHJcblx0XHRcdGlkOiAnbm90aWZpY2F0aW9ucycsXHJcblx0XHRcdGNsYXNzTmFtZTogJ25vdGlmaWNhdGlvbnMnXHJcblx0XHR9KTtcclxuXHRcdC8vIENyZWF0ZSB0aGUgdHJhbnNwYXJlbmN5IGdyYWRpZW50XHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ25vdGlmeUdyYWRpZW50JykuYXBwZW5kVG8oZWxlbSk7XHJcblx0XHRcclxuXHRcdGVsZW0uYXBwZW5kVG8oJ2RpdiN3cmFwcGVyJyk7XHJcblx0fSxcclxuXHRcclxuXHRvcHRpb25zOiB7fSwgLy8gTm90aGluZyBmb3Igbm93XHJcblx0XHJcblx0ZWxlbTogbnVsbCxcclxuXHRcclxuXHRub3RpZnlRdWV1ZToge30sXHJcblx0XHJcblx0Ly8gQWxsb3cgbm90aWZpY2F0aW9uIHRvIHRoZSBwbGF5ZXJcclxuXHRub3RpZnk6IGZ1bmN0aW9uKG1vZHVsZSwgdGV4dCwgbm9RdWV1ZT8pIHtcclxuXHRcdGlmKHR5cGVvZiB0ZXh0ID09ICd1bmRlZmluZWQnKSByZXR1cm47XHJcblx0XHQvLyBJIGRvbid0IG5lZWQgeW91IHB1bmN0dWF0aW5nIGZvciBtZSwgZnVuY3Rpb24uXHJcblx0XHQvLyBpZih0ZXh0LnNsaWNlKC0xKSAhPSBcIi5cIikgdGV4dCArPSBcIi5cIjtcclxuXHRcdGlmKG1vZHVsZSAhPSBudWxsICYmIEVuZ2luZS5hY3RpdmVNb2R1bGUgIT0gbW9kdWxlKSB7XHJcblx0XHRcdGlmKCFub1F1ZXVlKSB7XHJcblx0XHRcdFx0aWYodHlwZW9mIHRoaXMubm90aWZ5UXVldWVbbW9kdWxlXSA9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRcdFx0dGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdID0gW107XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMubm90aWZ5UXVldWVbbW9kdWxlXS5wdXNoKHRleHQpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHROb3RpZmljYXRpb25zLnByaW50TWVzc2FnZSh0ZXh0KTtcclxuXHRcdH1cclxuXHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdH0sXHJcblx0XHJcblx0Y2xlYXJIaWRkZW46IGZ1bmN0aW9uKCkge1xyXG5cdFxyXG5cdFx0Ly8gVG8gZml4IHNvbWUgbWVtb3J5IHVzYWdlIGlzc3Vlcywgd2UgY2xlYXIgbm90aWZpY2F0aW9ucyB0aGF0IGhhdmUgYmVlbiBoaWRkZW4uXHJcblx0XHRcclxuXHRcdC8vIFdlIHVzZSBwb3NpdGlvbigpLnRvcCBoZXJlLCBiZWNhdXNlIHdlIGtub3cgdGhhdCB0aGUgcGFyZW50IHdpbGwgYmUgdGhlIHNhbWUsIHNvIHRoZSBwb3NpdGlvbiB3aWxsIGJlIHRoZSBzYW1lLlxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0dmFyIGJvdHRvbSA9ICQoJyNub3RpZnlHcmFkaWVudCcpLnBvc2l0aW9uKCkudG9wICsgJCgnI25vdGlmeUdyYWRpZW50Jykub3V0ZXJIZWlnaHQodHJ1ZSk7XHJcblx0XHRcclxuXHRcdCQoJy5ub3RpZmljYXRpb24nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHJcblx0XHRcdGlmKCQodGhpcykucG9zaXRpb24oKS50b3AgPiBib3R0b20pe1xyXG5cdFx0XHRcdCQodGhpcykucmVtb3ZlKCk7XHJcblx0XHRcdH1cclxuXHRcdFxyXG5cdFx0fSk7XHJcblx0XHRcclxuXHR9LFxyXG5cdFxyXG5cdHByaW50TWVzc2FnZTogZnVuY3Rpb24odCkge1xyXG5cdFx0dmFyIHRleHQgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdub3RpZmljYXRpb24nKS5jc3MoJ29wYWNpdHknLCAnMCcpLnRleHQodCkucHJlcGVuZFRvKCdkaXYjbm90aWZpY2F0aW9ucycpO1xyXG5cdFx0dGV4dC5hbmltYXRlKHtvcGFjaXR5OiAxfSwgNTAwLCAnbGluZWFyJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdC8vIERvIHRoaXMgZXZlcnkgdGltZSB3ZSBhZGQgYSBuZXcgbWVzc2FnZSwgdGhpcyB3YXkgd2UgbmV2ZXIgaGF2ZSBhIGxhcmdlIGJhY2tsb2cgdG8gaXRlcmF0ZSB0aHJvdWdoLiBLZWVwcyB0aGluZ3MgZmFzdGVyLlxyXG5cdFx0XHROb3RpZmljYXRpb25zLmNsZWFySGlkZGVuKCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdFxyXG5cdHByaW50UXVldWU6IGZ1bmN0aW9uKG1vZHVsZSkge1xyXG5cdFx0aWYodHlwZW9mIHRoaXMubm90aWZ5UXVldWVbbW9kdWxlXSAhPSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHR3aGlsZSh0aGlzLm5vdGlmeVF1ZXVlW21vZHVsZV0ubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdE5vdGlmaWNhdGlvbnMucHJpbnRNZXNzYWdlKHRoaXMubm90aWZ5UXVldWVbbW9kdWxlXS5zaGlmdCgpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgeyBFbmdpbmUgfSBmcm9tICcuLi9lbmdpbmUnO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tICcuLi9zdGF0ZV9tYW5hZ2VyJztcclxuaW1wb3J0IHsgV2VhdGhlciB9IGZyb20gJy4uL3dlYXRoZXInO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi9CdXR0b24nO1xyXG5pbXBvcnQgeyBDYXB0YWluIH0gZnJvbSAnLi4vY2hhcmFjdGVycy9jYXB0YWluJztcclxuaW1wb3J0IHsgSGVhZGVyIH0gZnJvbSAnLi4vaGVhZGVyJztcclxuaW1wb3J0IHsgXyB9IGZyb20gJy4uLy4uL2xpYi90cmFuc2xhdGUnO1xyXG5pbXBvcnQgeyBfdGIgfSBmcm9tICcuLi8uLi9saWIvdGV4dEJ1aWxkZXInO1xyXG5cclxuZXhwb3J0IGNvbnN0IE91dHBvc3QgPSB7XHJcblx0ZGVzY3JpcHRpb246IFtcclxuXHRcdF8oXCJZb3UncmUgaW4gYSBzbWFsbCBidXQgYnVzdGxpbmcgbWlsaXRhcnkgT3V0cG9zdC4gVmFyaW91cyBtZW1iZXJzIFwiIFxyXG5cdFx0XHQrIFwib2YgdGhlIHJhbmstYW5kLWZpbGUgZ28gYWJvdXQgdGhlaXIgYnVzaW5lc3MsIHBheWluZyB5b3UgbGl0dGxlIG1pbmQuXCIpLFxyXG5cdFx0XyhcIk9uZSB0ZW50IHN0YW5kcyBvdXQgZnJvbSB0aGUgcmVzdDsgdGhlIGZpbmVseS1lbWJyb2lkZXJlZCBkZXRhaWxzIGFuZCBcIiArIFxyXG5cdFx0XHRcImdvbGRlbiBpY29uIGFib3ZlIHRoZSBlbnRyYW5jZSBtYXJrIGl0IGFzIHRoZSBjb21tYW5kaW5nIG9mZmljZXIncyBxdWFydGVycy5cIilcclxuXHRdLFxyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBPdXRwb3N0IHRhYlxyXG4gICAgICAgIHRoaXMudGFiID0gSGVhZGVyLmFkZExvY2F0aW9uKF8oXCJUaGUgT3V0cG9zdFwiKSwgXCJvdXRwb3N0XCIsIE91dHBvc3QpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgdGhlIE91dHBvc3QgcGFuZWxcclxuXHRcdHRoaXMucGFuZWwgPSAkKCc8ZGl2PicpXHJcbiAgICAgICAgLmF0dHIoJ2lkJywgXCJvdXRwb3N0UGFuZWxcIilcclxuICAgICAgICAuYWRkQ2xhc3MoJ2xvY2F0aW9uJylcclxuICAgICAgICAuYXBwZW5kVG8oJ2RpdiNsb2NhdGlvblNsaWRlcicpO1xyXG5cclxuXHRcdHRoaXMuZGVzY3JpcHRpb25QYW5lbCA9ICQoJzxkaXY+JykuYXR0cignaWQnLCAnZGVzY3JpcHRpb24nKS5hcHBlbmRUbyh0aGlzLnBhbmVsKTtcclxuXHRcdHRoaXMudXBkYXRlRGVzY3JpcHRpb24oKTtcclxuXHJcbiAgICAgICAgRW5naW5lLnVwZGF0ZVNsaWRlcigpO1xyXG5cclxuICAgICAgICAvLyBuZXcgXHJcblx0XHRCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6ICdjYXB0YWluQnV0dG9uJyxcclxuXHRcdFx0dGV4dDogXygnU3BlYWsgd2l0aCBUaGUgQ2FwdGFpbicpLFxyXG5cdFx0XHRjbGljazogQ2FwdGFpbi50YWxrVG9DYXB0YWluLFxyXG5cdFx0XHR3aWR0aDogJzgwcHgnXHJcblx0XHR9KVxyXG5cdFx0LmFkZENsYXNzKCdsb2NhdGlvbkJ1dHRvbicpXHJcblx0XHQuYXBwZW5kVG8oJ2RpdiNvdXRwb3N0UGFuZWwnKTtcclxuXHJcbiAgICAgICAgT3V0cG9zdC51cGRhdGVCdXR0b24oKTtcclxuXHJcbiAgICAgICAgLy8gc2V0dGluZyB0aGlzIHNlcGFyYXRlbHkgc28gdGhhdCBxdWVzdCBzdGF0dXMgY2FuJ3QgYWNjaWRlbnRhbGx5IGJyZWFrIGl0IGxhdGVyXHJcbiAgICAgICAgJFNNLnNldCgnT3V0cG9zdC5vcGVuJywgMSk7IFxyXG4gICAgfSxcclxuXHJcblx0dXBkYXRlRGVzY3JpcHRpb246IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5kZXNjcmlwdGlvblBhbmVsLmVtcHR5KCk7XHJcblx0XHR0aGlzLmRlc2NyaXB0aW9uID0gX3RiKFtcclxuXHRcdFx0XyhcIllvdSdyZSBvbiBhIGR1c3R5IHJvYWQgYmV0d2VlbiB0aGUgVmlsbGFnZSBhbmQgdGhlIE91dHBvc3QuIFRoZSByb2FkIGN1dHMgdGhyb3VnaCBcIiBcclxuXHRcdFx0XHQrIFwidGFsbCBncmFzcywgYnJ1c2gsIGFuZCB0cmVlcywgbGltaXRpbmcgdmlzaWJpbGl0eSBhbmQgZW5zdXJpbmcgdGhhdCB5b3UnbGwgaGF2ZSBcIiBcclxuXHRcdFx0XHQrIFwidG8gZGVhbCB3aXRoIHNvbWUgbm9uc2Vuc2UuXCIpLFxyXG5cdFx0XHRfKFwiVGhlIGhhaXIgb24gdGhlIGJhY2sgb2YgeW91ciBuZWNrIHByaWNrbGVzIHNsaWdodGx5IGluIGFudGljaXBhdGlvbi5cIilcclxuXHRcdF0pO1xyXG5cclxuXHRcdGZvcih2YXIgaSBpbiB0aGlzLmRlc2NyaXB0aW9uKSB7XHJcblx0XHRcdCQoJzxkaXY+JykudGV4dCh0aGlzLmRlc2NyaXB0aW9uW2ldKS5hcHBlbmRUbyh0aGlzLmRlc2NyaXB0aW9uUGFuZWwpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG4gICAgYXZhaWxhYmxlV2VhdGhlcjoge1xyXG5cdFx0J3N1bm55JzogMC40LFxyXG5cdFx0J2Nsb3VkeSc6IDAuMyxcclxuXHRcdCdyYWlueSc6IDAuM1xyXG5cdH0sXHJcblxyXG4gICAgb25BcnJpdmFsOiBmdW5jdGlvbih0cmFuc2l0aW9uX2RpZmYpIHtcclxuICAgICAgICBPdXRwb3N0LnNldFRpdGxlKCk7XHJcblxyXG4gICAgICAgIFdlYXRoZXIuaW5pdGlhdGVXZWF0aGVyKE91dHBvc3QuYXZhaWxhYmxlV2VhdGhlciwgJ291dHBvc3QnKTtcclxuXHJcblx0XHR0aGlzLnVwZGF0ZURlc2NyaXB0aW9uKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldFRpdGxlOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0aXRsZSA9IF8oXCJUaGUgT3V0cG9zdFwiKTtcclxuXHRcdGlmKEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gdGhpcykge1xyXG5cdFx0XHRkb2N1bWVudC50aXRsZSA9IHRpdGxlO1xyXG5cdFx0fVxyXG5cdFx0JCgnZGl2I2xvY2F0aW9uX291dHBvc3QnKS50ZXh0KHRpdGxlKTtcclxuXHR9LFxyXG5cclxuICAgIHVwZGF0ZUJ1dHRvbjogZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBjb25kaXRpb25hbHMgZm9yIHVwZGF0aW5nIGJ1dHRvbnNcclxuXHR9XHJcbn0iLCJpbXBvcnQgeyBIZWFkZXIgfSBmcm9tIFwiLi4vaGVhZGVyXCI7XHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuLi9lbmdpbmVcIjtcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uL0J1dHRvblwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgV2VhdGhlciB9IGZyb20gXCIuLi93ZWF0aGVyXCI7XHJcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgX3RiIH0gZnJvbSBcIi4uLy4uL2xpYi90ZXh0QnVpbGRlclwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IFJvYWQgPSB7XHJcblx0ZGVzY3JpcHRpb246IG51bGwsXHJcblx0ZGVzY3JpcHRpb25QYW5lbDogbnVsbCxcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgUm9hZCB0YWJcclxuICAgICAgICB0aGlzLnRhYiA9IEhlYWRlci5hZGRMb2NhdGlvbihfKFwiUm9hZCB0byB0aGUgT3V0cG9zdFwiKSwgXCJyb2FkXCIsIFJvYWQpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgdGhlIFJvYWQgcGFuZWxcclxuXHRcdHRoaXMucGFuZWwgPSAkKCc8ZGl2PicpXHJcbiAgICAgICAgLmF0dHIoJ2lkJywgXCJyb2FkUGFuZWxcIilcclxuICAgICAgICAuYWRkQ2xhc3MoJ2xvY2F0aW9uJylcclxuICAgICAgICAuYXBwZW5kVG8oJ2RpdiNsb2NhdGlvblNsaWRlcicpO1xyXG5cclxuXHRcdHRoaXMuZGVzY3JpcHRpb25QYW5lbCA9ICQoJzxkaXY+JykuYXR0cignaWQnLCAnZGVzY3JpcHRpb24nKS5hcHBlbmRUbyh0aGlzLnBhbmVsKTtcclxuXHRcdHRoaXMudXBkYXRlRGVzY3JpcHRpb24oKTtcclxuXHJcbiAgICAgICAgRW5naW5lLnVwZGF0ZVNsaWRlcigpO1xyXG5cclxuXHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogJ3dhbmRlckJ1dHRvbicsXHJcblx0XHRcdHRleHQ6IF8oJ1dhbmRlciBBcm91bmQnKSxcclxuXHRcdFx0Y2xpY2s6IFJvYWQud2FuZGVyRXZlbnQsXHJcblx0XHRcdHdpZHRoOiAnODBweCcsXHJcblx0XHRcdGNvc3Q6IHt9IC8vIFRPRE86IG1ha2UgdGhlcmUgYmUgYSBjb3N0IHRvIGRvaW5nIHN0dWZmP1xyXG5cdFx0fSlcclxuXHRcdC5hZGRDbGFzcygnbG9jYXRpb25CdXR0b24nKVxyXG5cdFx0LmFwcGVuZFRvKCdkaXYjcm9hZFBhbmVsJyk7XHJcblxyXG4gICAgICAgIFJvYWQudXBkYXRlQnV0dG9uKCk7XHJcblxyXG4gICAgICAgIC8vIHNldHRpbmcgdGhpcyBzZXBhcmF0ZWx5IHNvIHRoYXQgcXVlc3Qgc3RhdHVzIGNhbid0IGFjY2lkZW50YWxseSBicmVhayBpdCBsYXRlclxyXG4gICAgICAgICRTTS5zZXQoJ1JvYWQub3BlbicsIDEpOyBcclxuICAgIH0sXHJcblxyXG5cdHVwZGF0ZURlc2NyaXB0aW9uOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuZGVzY3JpcHRpb25QYW5lbC5lbXB0eSgpO1xyXG5cdFx0dGhpcy5kZXNjcmlwdGlvbiA9IF90YihbXHJcblx0XHRcdF8oXCJZb3UncmUgb24gYSBkdXN0eSByb2FkIGJldHdlZW4gdGhlIFZpbGxhZ2UgYW5kIHRoZSBPdXRwb3N0LiBUaGUgcm9hZCBjdXRzIHRocm91Z2ggXCIgXHJcblx0XHRcdFx0KyBcInRhbGwgZ3Jhc3MsIGJydXNoLCBhbmQgdHJlZXMsIGxpbWl0aW5nIHZpc2liaWxpdHkgYW5kIGVuc3VyaW5nIHRoYXQgeW91J2xsIGhhdmUgXCIgXHJcblx0XHRcdFx0KyBcInRvIGRlYWwgd2l0aCBzb21lIG5vbnNlbnNlLlwiKSxcclxuXHRcdFx0XyhcIlRoZSBoYWlyIG9uIHRoZSBiYWNrIG9mIHlvdXIgbmVjayBwcmlja2xlcyBzbGlnaHRseSBpbiBhbnRpY2lwYXRpb24uXCIpXHJcblx0XHRdKTtcclxuXHJcblx0XHRmb3IodmFyIGkgaW4gdGhpcy5kZXNjcmlwdGlvbikge1xyXG5cdFx0XHQkKCc8ZGl2PicpLnRleHQodGhpcy5kZXNjcmlwdGlvbltpXSkuYXBwZW5kVG8odGhpcy5kZXNjcmlwdGlvblBhbmVsKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuICAgIGF2YWlsYWJsZVdlYXRoZXI6IHtcclxuXHRcdCdzdW5ueSc6IDAuNCxcclxuXHRcdCdjbG91ZHknOiAwLjMsXHJcblx0XHQncmFpbnknOiAwLjNcclxuXHR9LFxyXG5cclxuICAgIG9uQXJyaXZhbDogZnVuY3Rpb24odHJhbnNpdGlvbl9kaWZmKSB7XHJcbiAgICAgICAgUm9hZC5zZXRUaXRsZSgpO1xyXG5cclxuICAgICAgICBXZWF0aGVyLmluaXRpYXRlV2VhdGhlcihSb2FkLmF2YWlsYWJsZVdlYXRoZXIsICdyb2FkJyk7XHJcblxyXG5cdFx0dGhpcy51cGRhdGVEZXNjcmlwdGlvbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRUaXRsZTogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdGl0bGUgPSBfKFwiUm9hZCB0byB0aGUgT3V0cG9zdFwiKTtcclxuXHRcdGlmKEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gdGhpcykge1xyXG5cdFx0XHRkb2N1bWVudC50aXRsZSA9IHRpdGxlO1xyXG5cdFx0fVxyXG5cdFx0JCgnZGl2I2xvY2F0aW9uX3JvYWQnKS50ZXh0KHRpdGxlKTtcclxuXHR9LFxyXG5cclxuICAgIHVwZGF0ZUJ1dHRvbjogZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBjb25kaXRpb25hbHMgZm9yIHVwZGF0aW5nIGJ1dHRvbnNcclxuXHR9LFxyXG5cclxuXHR3YW5kZXJFdmVudDogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMudHJpZ2dlckxvY2F0aW9uRXZlbnQoJ1JvYWRXYW5kZXInKTtcclxuXHRcdCRTTS5hZGQoJ1JvYWQuY291bnRlcicsIDEpO1xyXG5cdH1cclxufSIsIi8qKlxyXG4gKiBNb2R1bGUgdGhhdCByZWdpc3RlcnMgdGhlIHNpbXBsZSByb29tIGZ1bmN0aW9uYWxpdHlcclxuICovXHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuLi9lbmdpbmVcIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uL0J1dHRvblwiO1xyXG5pbXBvcnQgeyBXZWF0aGVyIH0gZnJvbSBcIi4uL3dlYXRoZXJcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IEhlYWRlciB9IGZyb20gXCIuLi9oZWFkZXJcIjtcclxuaW1wb3J0IHsgTGl6IH0gZnJvbSBcIi4uL2NoYXJhY3RlcnMvbGl6XCI7XHJcbmltcG9ydCB7IE1heW9yIH0gZnJvbSBcIi4uL2NoYXJhY3RlcnMvbWF5b3JcIjtcclxuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5pbXBvcnQgeyBfdGIgfSBmcm9tIFwiLi4vLi4vbGliL3RleHRCdWlsZGVyXCI7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuLi9wbGF5ZXIvY2hhcmFjdGVyXCI7XHJcblxyXG5leHBvcnQgY29uc3QgVmlsbGFnZSA9IHtcclxuXHJcblx0YnV0dG9uczp7fSxcclxuXHRcclxuXHRjaGFuZ2VkOiBmYWxzZSxcclxuXHJcblx0ZGVzY3JpcHRpb246IFtdLFxyXG5cdGRlc2NyaXB0aW9uUGFuZWw6IG51bGwsXHJcblx0XHJcblx0bmFtZTogXyhcIlZpbGxhZ2VcIiksXHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblx0XHRcclxuXHRcdGlmKEVuZ2luZS5fZGVidWcpIHtcclxuXHRcdFx0dGhpcy5fUk9PTV9XQVJNX0RFTEFZID0gNTAwMDtcclxuXHRcdFx0dGhpcy5fQlVJTERFUl9TVEFURV9ERUxBWSA9IDUwMDA7XHJcblx0XHRcdHRoaXMuX1NUT0tFX0NPT0xET1dOID0gMDtcclxuXHRcdFx0dGhpcy5fTkVFRF9XT09EX0RFTEFZID0gNTAwMDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gQ3JlYXRlIHRoZSBWaWxsYWdlIHRhYlxyXG5cdFx0dGhpcy50YWIgPSBIZWFkZXIuYWRkTG9jYXRpb24oXyhcIkEgQ2hpbGwgVmlsbGFnZVwiKSwgXCJ2aWxsYWdlXCIsIFZpbGxhZ2UpO1xyXG5cdFx0XHJcblx0XHQvLyBDcmVhdGUgdGhlIFZpbGxhZ2UgcGFuZWxcclxuXHRcdHRoaXMucGFuZWwgPSAkKCc8ZGl2PicpXHJcblx0XHRcdC5hdHRyKCdpZCcsIFwidmlsbGFnZVBhbmVsXCIpXHJcblx0XHRcdC5hZGRDbGFzcygnbG9jYXRpb24nKVxyXG5cdFx0XHQuYXBwZW5kVG8oJ2RpdiNsb2NhdGlvblNsaWRlcicpO1xyXG5cclxuXHRcdHRoaXMuZGVzY3JpcHRpb25QYW5lbCA9ICQoJzxkaXY+JykuYXR0cignaWQnLCAnZGVzY3JpcHRpb24nKS5hcHBlbmRUbyh0aGlzLnBhbmVsKTtcclxuXHRcdHRoaXMudXBkYXRlRGVzY3JpcHRpb24oKTtcclxuXHJcblx0XHRFbmdpbmUudXBkYXRlU2xpZGVyKCk7XHJcblxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAndGFsa0J1dHRvbicsXHJcblx0XHRcdHRleHQ6IF8oJ1RhbGsgdG8gdGhlIE1heW9yJyksXHJcblx0XHRcdGNsaWNrOiBNYXlvci50YWxrVG9NYXlvcixcclxuXHRcdFx0d2lkdGg6ICc4MHB4JyxcclxuXHRcdFx0Y29zdDoge31cclxuXHRcdH0pXHJcblx0XHQuYWRkQ2xhc3MoJ2xvY2F0aW9uQnV0dG9uJylcclxuXHRcdC5hcHBlbmRUbygnZGl2I3ZpbGxhZ2VQYW5lbCcpO1xyXG5cclxuXHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogJ2xpekJ1dHRvbicsXHJcblx0XHRcdHRleHQ6IF8oJ1RhbGsgdG8gTGl6JyksXHJcblx0XHRcdGNsaWNrOiBMaXoudGFsa1RvTGl6LFxyXG5cdFx0XHR3aWR0aDogJzgwcHgnLFxyXG5cdFx0XHRjb3N0OiB7fVxyXG5cdFx0fSlcclxuXHRcdC5hZGRDbGFzcygnbG9jYXRpb25CdXR0b24nKVxyXG5cdFx0LmFwcGVuZFRvKCdkaXYjdmlsbGFnZVBhbmVsJyk7XHJcblxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAnbmV3QnVpbGRpbmdCdXR0b24nLFxyXG5cdFx0XHR0ZXh0OiBfKCdDaGVjayBvdXQgdGhlIG5ldyBidWlsZGluZycpLFxyXG5cdFx0XHRjbGljazogVmlsbGFnZS50ZW1wQnVpbGRpbmdNZXNzYWdlLFxyXG5cdFx0XHR3aWR0aDogJzgwcHgnLFxyXG5cdFx0XHRjb3N0OiB7fVxyXG5cdFx0fSlcclxuXHRcdC5hZGRDbGFzcygnbG9jYXRpb25CdXR0b24nKVxyXG5cdFx0LmFwcGVuZFRvKCdkaXYjdmlsbGFnZVBhbmVsJyk7XHJcblxyXG5cdFx0dmFyIGJ1aWxkaW5nQnV0dG9uID0gJCgnI25ld0J1aWxkaW5nQnV0dG9uLmJ1dHRvbicpO1xyXG5cdFx0YnVpbGRpbmdCdXR0b24uaGlkZSgpO1xyXG5cclxuXHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogJ3N0b3JlQnV0dG9uJyxcclxuXHRcdFx0dGV4dDogXygnR28gdG8gdGhlIFN0b3JlJyksXHJcblx0XHRcdGNsaWNrOiBWaWxsYWdlLm9wZW5TdG9yZSxcclxuXHRcdFx0d2lkdGg6ICc4MHB4JyxcclxuXHRcdFx0Y29zdDoge31cclxuXHRcdH0pXHJcblx0XHQuYWRkQ2xhc3MoJ2xvY2F0aW9uQnV0dG9uJylcclxuXHRcdC5hcHBlbmRUbygnZGl2I3ZpbGxhZ2VQYW5lbCcpO1xyXG5cclxuXHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogJ2RpY2VCdXR0b24nLFxyXG5cdFx0XHR0ZXh0OiBfKCdQbGF5IGEgR2FtZScpLFxyXG5cdFx0XHRjbGljazogVmlsbGFnZS5wbGF5RGljZUdhbWUsXHJcblx0XHRcdHdpZHRoOiAnODBweCcsXHJcblx0XHRcdGNvc3Q6IHt9XHJcblx0XHR9KVxyXG5cdFx0LmFkZENsYXNzKCdsb2NhdGlvbkJ1dHRvbicpXHJcblx0XHQuYXBwZW5kVG8oJ2RpdiN2aWxsYWdlUGFuZWwnKTtcclxuXHJcblx0XHR2YXIgc3RvcmVCdXR0b24gPSAkKCcjc3RvcmVCdXR0b24uYnV0dG9uJyk7XHJcblx0XHRzdG9yZUJ1dHRvbi5oaWRlKCk7XHJcblxyXG5cdFx0dmFyIGxpekJ1dHRvbiA9ICQoJyNsaXpCdXR0b24uYnV0dG9uJyk7XHJcblx0XHRsaXpCdXR0b24uaGlkZSgpO1xyXG5cdFx0XHJcblx0XHQvLyBDcmVhdGUgdGhlIHN0b3JlcyBjb250YWluZXJcclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnc3RvcmVzQ29udGFpbmVyJykuYXBwZW5kVG8oJ2RpdiN2aWxsYWdlUGFuZWwnKTtcclxuXHRcdFxyXG5cdFx0Ly9zdWJzY3JpYmUgdG8gc3RhdGVVcGRhdGVzXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHQkLkRpc3BhdGNoKCdzdGF0ZVVwZGF0ZScpLnN1YnNjcmliZShWaWxsYWdlLmhhbmRsZVN0YXRlVXBkYXRlcyk7XHJcblx0XHRcclxuXHRcdFZpbGxhZ2UudXBkYXRlQnV0dG9uKCk7XHJcblx0fSxcclxuXHJcblx0dXBkYXRlRGVzY3JpcHRpb246IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5kZXNjcmlwdGlvblBhbmVsLmVtcHR5KCk7XHJcblx0XHR0aGlzLmRlc2NyaXB0aW9uID0gX3RiKFtcclxuXHRcdFx0XyhcIk5lc3RsZWQgaW4gdGhlIHdvb2RzLCB0aGlzIHZpbGxhZ2UgaXMgc2NhcmNlbHkgbW9yZSB0aGFuIGEgaGFtbGV0LCBcIiBcclxuXHRcdFx0XHQrIFwiZGVzcGl0ZSB5b3UgdGhpbmtpbmcgdGhvc2UgdHdvIHdvcmRzIGFyZSBzeW5vbnltcy4gVGhleSdyZSBub3QsIFwiIFxyXG5cdFx0XHRcdCsgXCJnbyBnb29nbGUgJ2hhbWxldCcgcmlnaHQgbm93IGlmIHlvdSBkb24ndCBiZWxpZXZlIG1lLlwiKSxcclxuXHRcdFx0XyhcIlRoZSB2aWxsYWdlIGlzIHF1aWV0IGF0IHRoZSBtb21lbnQ7IHRoZXJlIGFyZW4ndCBlbm91Z2ggaGFuZHMgZm9yIGFueW9uZSB0byByZW1haW4gaWRsZSBmb3IgbG9uZy5cIiksXHJcblx0XHRcdHtcclxuXHRcdFx0XHR0ZXh0OiBfKFwiQSBzdG9yZWZyb250LCBzdGFmZmVkIGVudGlyZWx5IGJ5IGEgc2luZ2xlIGdyaW5uaW5nIGphY2thc3MsIHN0YW5kcyBwcm91ZGx5IGluIHRoZSBtYWluIHNxdWFyZS5cIiksXHJcblx0XHRcdFx0aXNWaXNpYmxlOiAoKSA9PiB7XHJcblx0XHRcdFx0XHRyZXR1cm4gJFNNLmdldCgnUm9hZC5nb3RBcG9sb2dpemVkJykgIT09IHVuZGVmaW5lZDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdF0pO1xyXG5cclxuXHRcdGZvcih2YXIgaSBpbiB0aGlzLmRlc2NyaXB0aW9uKSB7XHJcblx0XHRcdCQoJzxkaXY+JykudGV4dCh0aGlzLmRlc2NyaXB0aW9uW2ldKS5hcHBlbmRUbyh0aGlzLmRlc2NyaXB0aW9uUGFuZWwpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0b3B0aW9uczoge30sIC8vIE5vdGhpbmcgZm9yIG5vd1xyXG5cclxuXHRhdmFpbGFibGVXZWF0aGVyOiB7XHJcblx0XHQnc3VubnknOiAwLjQsXHJcblx0XHQnY2xvdWR5JzogMC4zLFxyXG5cdFx0J3JhaW55JzogMC4zXHJcblx0fSxcclxuXHRcclxuXHRvbkFycml2YWw6IGZ1bmN0aW9uKHRyYW5zaXRpb25fZGlmZikge1xyXG5cdFx0VmlsbGFnZS5zZXRUaXRsZSgpO1xyXG5cclxuXHRcdHRoaXMudXBkYXRlRGVzY3JpcHRpb24oKTtcclxuXHJcblx0XHRXZWF0aGVyLmluaXRpYXRlV2VhdGhlcihWaWxsYWdlLmF2YWlsYWJsZVdlYXRoZXIsICd2aWxsYWdlJyk7XHJcblx0fSxcclxuXHRcclxuXHRzZXRUaXRsZTogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdGl0bGUgPSBfKFwiVGhlIFZpbGxhZ2VcIik7XHJcblx0XHRpZihFbmdpbmUuYWN0aXZlTW9kdWxlID09IHRoaXMpIHtcclxuXHRcdFx0ZG9jdW1lbnQudGl0bGUgPSB0aXRsZTtcclxuXHRcdH1cclxuXHRcdCQoJ2RpdiNsb2NhdGlvbl92aWxsYWdlJykudGV4dCh0aXRsZSk7XHJcblx0fSxcclxuXHRcclxuXHR1cGRhdGVCdXR0b246IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGxpekJ1dHRvbiA9ICQoJyNsaXpCdXR0b24uYnV0dG9uJyk7XHJcblx0XHRpZigkU00uZ2V0KCd2aWxsYWdlLmxpekFjdGl2ZScpICE9PSB1bmRlZmluZWQpIGxpekJ1dHRvbi5zaG93KCk7XHJcblx0XHR2YXIgYnVpbGRpbmdCdXR0b24gPSAkKCcjbmV3QnVpbGRpbmdCdXR0b24uYnV0dG9uJyk7XHJcblx0XHRpZigkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykgIT09IHVuZGVmaW5lZCkgYnVpbGRpbmdCdXR0b24uc2hvdygpO1xyXG5cdFx0dmFyIHN0b3JlQnV0dG9uID0gJCgnI3N0b3JlQnV0dG9uLmJ1dHRvbicpO1xyXG5cdFx0aWYoJFNNLmdldCgnUm9hZC5nb3RBcG9sb2dpemVkJykgIT09IHVuZGVmaW5lZCkgc3RvcmVCdXR0b24uc2hvdygpO1xyXG5cdH0sXHJcblx0XHJcblx0XHJcblx0aGFuZGxlU3RhdGVVcGRhdGVzOiBmdW5jdGlvbihlKXtcclxuXHRcdGlmKGUuY2F0ZWdvcnkgPT0gJ3N0b3Jlcycpe1xyXG5cdFx0XHQvLyBWaWxsYWdlLnVwZGF0ZUJ1aWxkQnV0dG9ucygpO1xyXG5cdFx0fSBlbHNlIGlmKGUuY2F0ZWdvcnkgPT0gJ2luY29tZScpe1xyXG5cdFx0fSBlbHNlIGlmKGUuc3RhdGVOYW1lLmluZGV4T2YoJ2dhbWUuYnVpbGRpbmdzJykgPT09IDApe1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHRlbXBCdWlsZGluZ01lc3NhZ2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnQSBOZXcgQnVpbGRpbmcnKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnVGhpcyBpcyBhIG5ldyBidWlsZGluZy4gVGhlcmUgc2hvdWxkIGJlIHN0dWZmIGluIGl0LCBidXQgdGhpcyBpcyBhIHBsYWNlaG9sZGVyIGZvciBub3cuJyksXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnbGVhdmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnTGFtZScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0b3BlblN0b3JlOiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ1RoZSBTdG9yZScpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKFwiVGhpcyBpcyB0aGUgc3RvcmUuIFRoZXJlJ3Mgbm90aGluZyBoZXJlIHlldCwgdGhvdWdoLlwiKSxcclxuXHRcdFx0XHRcdFx0XyhcIllvdSBmaW5kIGEgZHVzdHkgcGFpciBvZiBkaWNlIGluIHRoZSBjb3JuZXIgYW5kIHRocm93IHRoZW0sIGp1c3QgdG8gc2VlIHdoYXQgaGFwcGVucy5cIilcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRkaWNlOiB7XHJcblx0XHRcdFx0XHRcdGFtb3VudDogMixcclxuXHRcdFx0XHRcdFx0ZGllRmFjZXM6IHtcclxuXHRcdFx0XHRcdFx0XHQxOiAnc2t1bGwnXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdGhhbmRsZXI6ICh2YWxzKSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0Y29uc3QgcmV0dXJuVGV4dCA9IFtdO1xyXG5cdFx0XHRcdFx0XHRcdGlmICgodmFsc1swXSA9PSB2YWxzWzFdKSAmJiB2YWxzWzBdID09IDEpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVyblRleHQucHVzaChcIlNuYWtlIGV5ZXMhIEkgZmVlbCBhIG1pbGQgc2Vuc2Ugb2YgZHJlYWQuXCIpO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodmFsc1swXSA9PSB2YWxzWzFdKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm5UZXh0LnB1c2goXCJXb3csIGRvdWJsZXMuIFRoYXQgc2VlbXMgbHVja3kuXCIpO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoKHZhbHNbMF0gKyB2YWxzWzFdKSA9PSA3KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm5UZXh0LnB1c2goXCJPaCwgbmljZS4gRG8gSSB3aW4gc29tZXRoaW5nP1wiKTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuVGV4dC5wdXNoKFwiSSByb2xsZWQgYSBcIiArICh2YWxzWzBdICsgdmFsc1sxXSkudG9TdHJpbmcoKSArIFwiLiBUaGF0IGRvZXNuJ3Qgc2VlbSBlc3BlY2lhbGx5IG5vdGV3b3J0aHkuXCIpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcmV0dXJuVGV4dDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6ICB7XHJcblx0XHRcdFx0XHRcdHJvbGw6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdSb2xsIFxcJ2VtIGFnYWluJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ3N0YXJ0J31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0bGVhdmU6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdMYW1lJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRwbGF5RGljZUdhbWU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnQSBHYW1lIG9mIENoYW5jZScpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdZb3Ugd2FsayBpbnRvIGEgc2hhZHkgYWxsZXksIGFuZCBhIG1hbiBpbiBhIHdpZGUtYnJpbW1lZCBoYXQgZ2VzdHVyZXMgdG8geW91IHdpdGggZGljZSBpbiBoaXMgaGFuZC4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJIZXksIGJ1ZGR5LCB3YW5uYSBwbGF5IGEgZ2FtZT8gVGhlcmVcXCdzIGEgcHJpemUgaWYgeW91IHdpbiFcIicpLFxyXG5cdFx0XHRcdFx0XHRfKCdXaGF0IGRvIHlvdSBkbz8nKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J3BsYXknOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnSSBsaWtlIHByaXplcycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdnYW1lU3RhcnQnfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnbGVhdmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnTm8gdGhhbmtzJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnZ2FtZVN0YXJ0Jzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdUaGUgbWFuIHJldmVhbHMgYSB0b290aHkgZ3JpbiBhbmQgYmVnaW5zIHRvIGV4cGxhaW4gdGhlIHJ1bGVzLicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIkl0XFwncyB2ZXJ5IHNpbXBsZSwgeW91IGp1c3QgY2hvb3NlIHdoZXRoZXIgeW91IHdhbnQgdG8gdHJ5IHRvIHJvbGwgJ1xyXG5cdFx0XHRcdFx0XHRcdCArICdoaWdoZXIgb3IgbG93ZXIgdGhhbiBtZSwgYW5kIHRoZW4gSSByb2xsLCBhbmQgdGhlbiB5b3Ugcm9sbC4gJyBcclxuXHRcdFx0XHRcdFx0XHQgKyAnSWYgeW91IGNhbGwgaXQgcmlnaHQsIHlvdSB3aW4uXCInKSxcclxuXHRcdFx0XHRcdFx0XygnXCJTbywgd2hhdFxcJ2xsIGl0IGJlPycpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnaGlnaCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdIaWdoJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2hlUm9sbHMnfSxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogKCkgPT4gJFNNLnNldCgnZGljZUdhbWUuaGlnaCcsIDEpXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdsb3cnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnTG93JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2hlUm9sbHMnfSxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogKCkgPT4gJFNNLnNldCgnZGljZUdhbWUubG93JywgMSlcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J2hlUm9sbHMnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1RoZSBtYW5zIGhhdCB0aXBzIGxvdyBhcyBoZSBkcm9wcyB0aGUgZGljZSB0byB0aGUgZ3JvdW5kLicpLFxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGRpY2U6IHtcclxuXHRcdFx0XHRcdFx0YW1vdW50OiAyLFxyXG5cdFx0XHRcdFx0XHRoYW5kbGVyOiAodmFscykgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdGNvbnN0IHJldHVyblRleHQgPSBbXTtcclxuXHRcdFx0XHRcdFx0XHRsZXQgZGljZVZhbCA9IDA7XHJcblx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgaSBpbiB2YWxzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRkaWNlVmFsICs9IHZhbHNbaV1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdCRTTS5zZXQoJ2RpY2VHYW1lLmhpc1JvbGwnLCBkaWNlVmFsKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKCgkU00uZ2V0KCdkaWNlR2FtZS5oaWdoJykgIT09IHVuZGVmaW5lZCkgJiYgZGljZVZhbCA8IDUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVyblRleHQucHVzaChfKCdUaGUgc3RyYW5nZXIgZ3JpbWFjZXMuJykpO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoKCRTTS5nZXQoJ2RpY2VHYW1lLmhpZ2gnKSAhPT0gdW5kZWZpbmVkKSAmJiBkaWNlVmFsID4gOCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuVGV4dC5wdXNoKF8oJ1RoZSBzdHJhbmdlciBncmlucyB3aWNrZWRseS4nKSk7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICgoJFNNLmdldCgnZGljZUdhbWUubG93JykgIT09IHVuZGVmaW5lZCkgJiYgZGljZVZhbCA+IDgpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVyblRleHQucHVzaChfKCdUaGUgc3RyYW5nZXIgZ3JpbWFjZXMuJykpO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoKCRTTS5nZXQoJ2RpY2VHYW1lLmxvdycpICE9PSB1bmRlZmluZWQpICYmIGRpY2VWYWwgPCA1KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm5UZXh0LnB1c2goXygnVGhlIHN0cmFuZ2VyIGdyaW5zIHdpY2tlZGx5LicpKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdHJldHVyblRleHQucHVzaChfKCdIZSBwaWNrcyB1cCB0aGUgZGljZSBhbmQgaG9sZHMgdGhlbSBvdXQgdG8geW91LicpKVxyXG5cdFx0XHRcdFx0XHRcdHJldHVyblRleHQucHVzaChfKCdcIllvdXIgcm9sbC5cIicpKVxyXG5cdFx0XHRcdFx0XHRcdHJldHVybiByZXR1cm5UZXh0O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnb2theSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdSb2xsIFxcJ2VtJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ3lvdVJvbGwnfVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQneW91Um9sbCc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnWW91IGJyaWVmbHkgam9zdGxlIHRoZSBkaWNlLCB0aGVuIGxldCB0aGVtIGZhbGwgd2hlcmUgdGhleSBtYXkuJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRkaWNlOiB7XHJcblx0XHRcdFx0XHRcdGFtb3VudDogMixcclxuXHRcdFx0XHRcdFx0aGFuZGxlcjogKHZhbHMpID0+IHtcclxuXHRcdFx0XHRcdFx0XHRjb25zdCByZXR1cm5UZXh0ID0gW107XHJcblxyXG5cdFx0XHRcdFx0XHRcdGxldCBkaWNlVmFsID0gMDtcclxuXHRcdFx0XHRcdFx0XHRmb3IgKHZhciBpIGluIHZhbHMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGRpY2VWYWwgKz0gdmFsc1tpXVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKCRTTS5nZXQoJ2RpY2VHYW1lLmhpZ2gnKSAmJiBkaWNlVmFsIDwgKCRTTS5nZXQoJ2RpY2VHYW1lLmhpc1JvbGwnKSBhcyBudW1iZXIpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm5UZXh0LnB1c2goJ1lvdXIgZmVlbCBhIHJ1c2ggb2YgZGlzYXBwb2ludG1lbnQuJyk7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICgkU00uZ2V0KCdkaWNlR2FtZS5oaWdoJykgJiYgZGljZVZhbCA+ICgkU00uZ2V0KCdkaWNlR2FtZS5oaXNSb2xsJykgYXMgbnVtYmVyKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuVGV4dC5wdXNoKCdZb3VyIGZlZWwgYSBydXNoIG9mIGV4Y2l0ZW1lbnQuJyk7XHJcblx0XHRcdFx0XHRcdFx0XHQkU00uc2V0KCdkaWNlR2FtZS53aW4nLCAxKTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCRTTS5nZXQoJ2RpY2VHYW1lLmxvdycpICYmIGRpY2VWYWwgPiAoJFNNLmdldCgnZGljZUdhbWUuaGlzUm9sbCcpIGFzIG51bWJlcikpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVyblRleHQucHVzaCgnWW91ciBmZWVsIGEgcnVzaCBvZiBkaXNhcHBvaW50bWVudC4nKTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCRTTS5nZXQoJ2RpY2VHYW1lLmxvdycpICYmIGRpY2VWYWwgPCAoJFNNLmdldCgnZGljZUdhbWUuaGlzUm9sbCcpIGFzIG51bWJlcikpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVyblRleHQucHVzaCgnWW91ciBmZWVsIGEgcnVzaCBvZiBleGNpdGVtZW50LicpO1xyXG5cdFx0XHRcdFx0XHRcdFx0JFNNLnNldCgnZGljZUdhbWUud2luJywgMSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcmV0dXJuVGV4dDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J3Jlc3VsdHMnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogKCkgPT4gKCRTTS5nZXQoJ2RpY2VHYW1lLndpbicpICE9PSB1bmRlZmluZWQpID8gXygnT2gsIG5pY2UnKSA6IF8oJ0F3dywgc2hvb3QnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAncmVzdWx0cyd9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdyZXN1bHRzJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogKCkgPT4gKCRTTS5nZXQoJ2RpY2VHYW1lLndpbicpICE9PSB1bmRlZmluZWQpID8gW1xyXG5cdFx0XHRcdFx0XHRfKCdUaGUgZ2FtYmxlciBjdXJzZXMgdW5kZXIgaGlzIGJyZWF0aCwgdGhlbiBoYW5kcyB5b3Ugc29tZXRoaW5nIGFuZCBxdWlja2x5IHdhbGtzIGF3YXkuJylcclxuXHRcdFx0XHRcdF06IFtfKCdUaGUgZ2FtYmxlclxcJ3MgZmFjZSBzcGxpdHMgaW50byBhIHdpZGUgZ3JpbiBiZWZvcmUgZGlzYXBwZWFyaW5nIGJlbmVhdGggdGhlIGJyaW0uJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiQmV0dGVyIGx1Y2sgbmV4dCB0aW1lIHN0cmFuZ2VyLlwiJyksXHJcblx0XHRcdFx0XHRcdF8oJ0hlIHNpbmtzIGJhY2sgaW50byB0aGUgc2hhZG93cyBvZiB0aGUgYWxsZXksIGFuZCBoaXMgd29yZHMgcmV2ZXJiZXJhdGUgb2ZmIG9mIHRoZSBwYXJhbGxlbCB3YWxscyBsb25nIGFmdGVyIHlvdSBsb3NlIHNpZ2h0IG9mIGhpbS4nKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdG9uTG9hZDogKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRpZiAoJFNNLmdldCgnZGljZUdhbWUud2luJykgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdFx0XHRcdENoYXJhY3Rlci5hZGRUb0ludmVudG9yeSgnZ2FtYmxlci5Qcml6ZScpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnb2theSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdUaGF0IHdhcyBmdW4sIEkgZ3Vlc3MnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiAoKSA9PiAkU00ucmVtb3ZlKCdkaWNlR2FtZScpXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fVxyXG59XHJcbiIsImltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi9CdXR0b25cIjtcclxuaW1wb3J0IHsgSXRlbUxpc3QgfSBmcm9tIFwiLi9pdGVtTGlzdFwiO1xyXG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tIFwiLi4vbm90aWZpY2F0aW9uc1wiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgUXVlc3RMb2cgfSBmcm9tIFwiLi9xdWVzdExvZ1wiO1xyXG5pbXBvcnQgeyBQZXJrTGlzdCB9IGZyb20gXCIuL3BlcmtMaXN0XCI7XHJcblxyXG5leHBvcnQgY29uc3QgQ2hhcmFjdGVyID0ge1xyXG5cdGludmVudG9yeToge30sIC8vIGRpY3Rpb25hcnkgdXNpbmcgaXRlbSBuYW1lIGFzIGtleVxyXG5cdHF1ZXN0U3RhdHVzOiB7fSwgLy8gZGljdGlvbmFyeSB1c2luZyBxdWVzdCBuYW1lIGFzIGtleSwgYW5kIGludGVnZXIgcXVlc3QgcGhhc2UgYXMgdmFsdWVcclxuXHRlcXVpcHBlZEl0ZW1zOiB7XHJcblx0XHQvLyBzdGVhbGluZyB0aGUgS29MIHN0eWxlIGZvciBub3csIHdlJ2xsIHNlZSBpZiBJIG5lZWQgc29tZXRoaW5nXHJcblx0XHQvLyB0aGF0IGZpdHMgdGhlIGdhbWUgYmV0dGVyIGFzIHdlIGdvXHJcblx0XHRoZWFkOiBudWxsLFxyXG5cdFx0dG9yc286IG51bGwsXHJcblx0XHRwYW50czogbnVsbCxcclxuXHRcdC8vIG5vIHdlYXBvbiwgdHJ5IHRvIHNlZSBob3cgZmFyIHdlIGNhbiBnZXQgaW4gdGhpcyBnYW1lIHdpdGhvdXQgZm9jdXNpbmcgb24gY29tYmF0XHJcblx0XHRhY2Nlc3NvcnkxOiBudWxsLFxyXG5cdFx0YWNjZXNzb3J5MjogbnVsbCxcclxuXHRcdGFjY2Vzc29yeTM6IG51bGwsXHJcblx0fSxcclxuXHJcblx0Ly8gc3RhdHMgYmVmb3JlIGFueSBtb2RpZmllcnMgZnJvbSBnZWFyIG9yIHdoYXRldmVyIGVsc2UgYXJlIGFwcGxpZWRcclxuXHRyYXdTdGF0czoge1xyXG5cdFx0J1NwZWVkJzogNSxcclxuXHRcdCdQZXJjZXB0aW9uJzogNSxcclxuXHRcdCdSZXNpbGllbmNlJzogNSxcclxuXHRcdCdJbmdlbnVpdHknOiA1LFxyXG5cdFx0J1RvdWdobmVzcyc6IDVcclxuXHR9LFxyXG5cclxuXHQvLyBwZXJrcyBnaXZlbiBieSBpdGVtcywgY2hhcmFjdGVyIGNob2ljZXMsIGRpdmluZSBwcm92ZW5hbmNlLCBldGMuXHJcblx0cGVya3M6IHsgfSxcclxuXHRwZXJrQXJlYTogbnVsbCxcclxuXHRcclxuXHRpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHRcdFxyXG5cdFx0Ly8gY3JlYXRlIHRoZSBjaGFyYWN0ZXIgYm94XHJcblx0XHRjb25zdCBlbGVtID0gJCgnPGRpdj4nKS5hdHRyKHtcclxuXHRcdFx0aWQ6ICdjaGFyYWN0ZXInLFxyXG5cdFx0XHRjbGFzc05hbWU6ICdjaGFyYWN0ZXInXHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0ZWxlbS5hcHBlbmRUbygnZGl2I3dyYXBwZXInKTtcclxuXHJcblx0XHQvLyB3cml0ZSByYXdTdGF0cyB0byAkU01cclxuXHRcdC8vIE5PVEU6IG5ldmVyIHdyaXRlIGRlcml2ZWQgc3RhdHMgdG8gJFNNLCBhbmQgbmV2ZXIgYWNjZXNzIHJhdyBzdGF0cyBkaXJlY3RseSFcclxuXHRcdC8vIGRvaW5nIHNvIHdpbGwgaW50cm9kdWNlIG9wcG9ydHVuaXRpZXMgdG8gbWVzcyB1cCBzdGF0cyBQRVJNQU5FTlRMWVxyXG4gICAgICAgIGlmICghJFNNLmdldCgnY2hhcmFjdGVyLnJhd3N0YXRzJykpIHtcclxuICAgICAgICAgICAgJFNNLnNldCgnY2hhcmFjdGVyLnJhd3N0YXRzJywgQ2hhcmFjdGVyLnJhd1N0YXRzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cdFx0XHRDaGFyYWN0ZXIucmF3U3RhdHMgPSAkU00uZ2V0KCdjaGFyYWN0ZXIucmF3U3RhdHMnKSBhcyBhbnk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCEkU00uZ2V0KCdjaGFyYWN0ZXIucGVya3MnKSkge1xyXG4gICAgICAgICAgICAkU00uc2V0KCdjaGFyYWN0ZXIucGVya3MnLCBDaGFyYWN0ZXIucGVya3MpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5wZXJrcyA9ICRTTS5nZXQoJ2NoYXJhY3Rlci5wZXJrcycpIGFzIGFueTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoISRTTS5nZXQoJ2NoYXJhY3Rlci5pbnZlbnRvcnknKSkge1xyXG4gICAgICAgICAgICAkU00uc2V0KCdjaGFyYWN0ZXIuaW52ZW50b3J5JywgQ2hhcmFjdGVyLmludmVudG9yeSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHRcdFx0Q2hhcmFjdGVyLmludmVudG9yeSA9ICRTTS5nZXQoJ2NoYXJhY3Rlci5pbnZlbnRvcnknKSBhcyBhbnk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCEkU00uZ2V0KCdjaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcycpKSB7XHJcbiAgICAgICAgICAgICRTTS5zZXQoJ2NoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zJywgQ2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zID0gJFNNLmdldCgnY2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMnKSBhcyBhbnk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCEkU00uZ2V0KCdjaGFyYWN0ZXIucXVlc3RTdGF0dXMnKSkge1xyXG4gICAgICAgICAgICAkU00uc2V0KCdjaGFyYWN0ZXIucXVlc3RTdGF0dXMnLCBDaGFyYWN0ZXIucXVlc3RTdGF0dXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5xdWVzdFN0YXR1cyA9ICRTTS5nZXQoJ2NoYXJhY3Rlci5xdWVzdFN0YXR1cycpIGFzIGFueTtcclxuXHRcdH1cclxuXHJcbiAgICAgICAgJCgnPGRpdj4nKS50ZXh0KCdDaGFyYWN0ZXInKVxyXG5cdFx0LmNzcygndGV4dC1kZWNvcmF0aW9uJywgJ3VuZGVybGluZScpXHJcblx0XHQuYXR0cignaWQnLCAndGl0bGUnKVxyXG5cdFx0LmFwcGVuZFRvKCdkaXYjY2hhcmFjdGVyJyk7XHJcblxyXG5cdFx0Ly8gVE9ETzogcmVwbGFjZSB0aGlzIHdpdGggZGVyaXZlZCBzdGF0c1xyXG4gICAgICAgIGZvcih2YXIgc3RhdCBpbiAkU00uZ2V0KCdjaGFyYWN0ZXIucmF3c3RhdHMnKSBhcyBhbnkpIHtcclxuICAgICAgICAgICAgJCgnPGRpdj4nKS50ZXh0KHN0YXQgKyAnOiAnICsgJFNNLmdldCgnY2hhcmFjdGVyLnJhd3N0YXRzLicgKyBzdGF0KSkuYXBwZW5kVG8oJ2RpdiNjaGFyYWN0ZXInKTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdidXR0b25zJykuY3NzKFwibWFyZ2luLXRvcFwiLCBcIjIwcHhcIikuYXBwZW5kVG8oJ2RpdiNjaGFyYWN0ZXInKTtcclxuXHRcdHZhciBpbnZlbnRvcnlCdXR0b24gPSBCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6IFwiaW52ZW50b3J5XCIsXHJcblx0XHRcdHRleHQ6IFwiSW52ZW50b3J5XCIsXHJcblx0XHRcdGNsaWNrOiBDaGFyYWN0ZXIub3BlbkludmVudG9yeVxyXG5cdFx0fSkuYXBwZW5kVG8oJCgnI2J1dHRvbnMnLCAnZGl2I2NoYXJhY3RlcicpKTtcclxuXHRcdFxyXG5cdFx0dmFyIHF1ZXN0TG9nQnV0dG9uID0gQnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiBcInF1ZXN0TG9nXCIsXHJcblx0XHRcdHRleHQ6IFwiUXVlc3QgTG9nXCIsXHJcblx0XHRcdGNsaWNrOiBDaGFyYWN0ZXIub3BlblF1ZXN0TG9nXHJcblx0XHR9KS5hcHBlbmRUbygkKCcjYnV0dG9ucycsICdkaXYjY2hhcmFjdGVyJykpO1xyXG5cclxuXHRcdHRoaXMucGVya0FyZWEgPSAkKCc8ZGl2PicpLmF0dHIoe1xyXG5cdFx0XHRpZDogJ3BlcmtzJyxcclxuXHRcdFx0Y2xhc3NOYW1lOiAncGVya3MnXHJcblx0XHRcdH0pLmFwcGVuZFRvKCdkaXYjY2hhcmFjdGVyJyk7XHJcblxyXG5cdFx0Ly8gVE9ETzogYWRkIFBlcmtzIGxpc3QgYmVsb3cgaGVyZVxyXG5cdFx0dGhpcy51cGRhdGVQZXJrcygpO1xyXG5cclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdHdpbmRvdy5DaGFyYWN0ZXIgPSB0aGlzO1xyXG5cdH0sXHJcblx0XHJcblx0b3B0aW9uczoge30sIC8vIE5vdGhpbmcgZm9yIG5vd1xyXG5cdFxyXG5cdGVsZW06IG51bGwsXHJcblxyXG5cdGludmVudG9yeURpc3BsYXk6IG51bGwgYXMgYW55LFxyXG5cdHF1ZXN0TG9nRGlzcGxheTogbnVsbCBhcyBhbnksXHJcblxyXG5cdG9wZW5JbnZlbnRvcnk6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gY3JlYXRpbmcgYSBoYW5kbGUgZm9yIGxhdGVyIGFjY2Vzcywgc3VjaCBhcyBjbG9zaW5nIGludmVudG9yeVxyXG5cdFx0Q2hhcmFjdGVyLmludmVudG9yeURpc3BsYXkgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2ludmVudG9yeScpLmFkZENsYXNzKCdldmVudFBhbmVsJykuY3NzKCdvcGFjaXR5JywgJzAnKTtcclxuXHRcdHZhciBpbnZlbnRvcnlEaXNwbGF5ID0gQ2hhcmFjdGVyLmludmVudG9yeURpc3BsYXk7XHJcblx0XHRDaGFyYWN0ZXIuaW52ZW50b3J5RGlzcGxheVxyXG5cdFx0Ly8gc2V0IHVwIGNsaWNrIGFuZCBob3ZlciBoYW5kbGVycyBmb3IgaW52ZW50b3J5IGl0ZW1zXHJcblx0XHQub24oXCJjbGlja1wiLCBcIiNpdGVtXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRDaGFyYWN0ZXIudXNlSW52ZW50b3J5SXRlbSgkKHRoaXMpLmRhdGEoXCJuYW1lXCIpKTtcclxuXHRcdFx0Q2hhcmFjdGVyLmNsb3NlSW52ZW50b3J5KCk7XHJcblx0XHR9KS5vbihcIm1vdXNlZW50ZXJcIiwgXCIjaXRlbVwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHRvb2x0aXAgPSAkKFwiPGRpdiBpZD0ndG9vbHRpcCcgY2xhc3M9J3Rvb2x0aXAnPlwiICsgSXRlbUxpc3RbJCh0aGlzKS5kYXRhKFwibmFtZVwiKV0udGV4dCArIFwiPC9kaXY+XCIpXHJcblx0XHRcdC5hdHRyKCdkYXRhLW5hbWUnLCBpdGVtKTtcclxuXHRcdFx0dG9vbHRpcC5hcHBlbmRUbygkKHRoaXMpKTtcclxuXHRcdH0pLm9uKFwibW91c2VsZWF2ZVwiLCBcIiNpdGVtXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKFwiI3Rvb2x0aXBcIiwgXCIjXCIgKyAkKHRoaXMpLmRhdGEoXCJuYW1lXCIpKS5mYWRlT3V0KCkucmVtb3ZlKCk7XHJcblx0XHR9KTtcclxuXHRcdCQoJzxkaXY+JykuYWRkQ2xhc3MoJ2V2ZW50VGl0bGUnKS50ZXh0KCdJbnZlbnRvcnknKS5hcHBlbmRUbyhpbnZlbnRvcnlEaXNwbGF5KTtcclxuXHRcdHZhciBpbnZlbnRvcnlEZXNjID0gJCgnPGRpdj4nKS50ZXh0KFwiQ2xpY2sgdGhpbmdzIGluIHRoZSBsaXN0IHRvIHVzZSB0aGVtLlwiKVxyXG5cdFx0XHQuaG92ZXIoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIHRvb2x0aXAgPSAkKFwiPGRpdiBpZD0ndG9vbHRpcCcgY2xhc3M9J3Rvb2x0aXAnPlwiICsgXCJOb3QgdGhpcywgdGhvdWdoLlwiICsgXCI8L2Rpdj5cIik7XHJcbiAgICBcdFx0XHR0b29sdGlwLmFwcGVuZFRvKGludmVudG9yeURlc2MpO1xyXG5cdFx0XHR9LCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKFwiI3Rvb2x0aXBcIikuZmFkZU91dCgpLnJlbW92ZSgpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHROb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBfKFwiSSBiZXQgeW91IHRoaW5rIHlvdSdyZSBwcmV0dHkgZnVubnksIGh1aD8gQ2xpY2tpbmcgdGhlIHRoaW5nIEkgc2FpZCB3YXNuJ3QgY2xpY2thYmxlP1wiKSk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5jc3MoXCJtYXJnaW4tYm90dG9tXCIsIFwiMjBweFwiKVxyXG5cdFx0XHQuYXBwZW5kVG8oaW52ZW50b3J5RGlzcGxheSk7XHJcblx0XHRcclxuXHRcdGZvcih2YXIgaXRlbSBpbiBDaGFyYWN0ZXIuaW52ZW50b3J5KSB7XHJcblx0XHRcdC8vIG1ha2UgdGhlIGludmVudG9yeSBjb3VudCBsb29rIGEgYml0IG5pY2VyXHJcblx0XHRcdHZhciBpbnZlbnRvcnlFbGVtID0gJCgnPGRpdj4nKVxyXG5cdFx0XHQuYXR0cignaWQnLCAnaXRlbScpXHJcblx0XHRcdC5hdHRyKCdkYXRhLW5hbWUnLCBpdGVtKVxyXG5cdFx0XHQudGV4dChJdGVtTGlzdFtpdGVtXS5uYW1lICArICcgICh4JyArIENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0udG9TdHJpbmcoKSArICcpJylcclxuXHRcdFx0LmFwcGVuZFRvKGludmVudG9yeURpc3BsYXkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFRPRE86IG1ha2UgdGhpcyBDU1MgYW4gYWN0dWFsIGNsYXNzIHNvbWV3aGVyZSwgSSdtIHN1cmUgSSdsbCBuZWVkIGl0IGFnYWluXHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2J1dHRvbnMnKS5jc3MoXCJtYXJnaW4tdG9wXCIsIFwiMjBweFwiKS5hcHBlbmRUbyhpbnZlbnRvcnlEaXNwbGF5KTtcclxuXHRcdHZhciBiID0gXHJcblx0XHQvL25ldyBcclxuXHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogXCJjbG9zZUludmVudG9yeVwiLFxyXG5cdFx0XHR0ZXh0OiBcIkNsb3NlXCIsXHJcblx0XHRcdGNsaWNrOiBDaGFyYWN0ZXIuY2xvc2VJbnZlbnRvcnlcclxuXHRcdH0pLmFwcGVuZFRvKCQoJyNidXR0b25zJywgaW52ZW50b3J5RGlzcGxheSkpO1xyXG5cdFx0JCgnZGl2I3dyYXBwZXInKS5hcHBlbmQoaW52ZW50b3J5RGlzcGxheSk7XHJcblx0XHRpbnZlbnRvcnlEaXNwbGF5LmFuaW1hdGUoe29wYWNpdHk6IDF9LCBFdmVudHMuX1BBTkVMX0ZBREUsICdsaW5lYXInKTtcclxuXHR9LFxyXG5cclxuXHRjbG9zZUludmVudG9yeTogZnVuY3Rpb24oKSB7XHJcblx0XHRDaGFyYWN0ZXIuaW52ZW50b3J5RGlzcGxheS5lbXB0eSgpO1xyXG5cdFx0Q2hhcmFjdGVyLmludmVudG9yeURpc3BsYXkucmVtb3ZlKCk7XHJcblx0fSxcclxuXHJcblx0YWRkVG9JbnZlbnRvcnk6IGZ1bmN0aW9uKGl0ZW0sIGFtb3VudD0xKSB7XHJcblx0XHRpZiAoQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSkge1xyXG5cdFx0XHRDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dICs9IGFtb3VudDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0gPSBhbW91bnQ7XHJcblx0XHR9XHJcblxyXG5cdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJBZGRlZCBcIiArIEl0ZW1MaXN0W2l0ZW1dLm5hbWUgKyBcIiB0byBpbnZlbnRvcnkuXCIpXHJcblx0XHQkU00uc2V0KCdpbnZlbnRvcnknLCBDaGFyYWN0ZXIuaW52ZW50b3J5KTtcclxuXHR9LFxyXG5cclxuXHJcblx0cmVtb3ZlRnJvbUludmVudG9yeTogZnVuY3Rpb24oaXRlbSwgYW1vdW50PTEpIHtcclxuXHRcdGlmIChDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dKSBDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dIC09IGFtb3VudDtcclxuXHRcdGlmIChDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dIDwgMSkge1xyXG5cdFx0XHRkZWxldGUgQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXTtcclxuXHRcdH1cclxuXHJcblx0XHROb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIlJlbW92ZWQgXCIgKyBJdGVtTGlzdFtpdGVtXS5uYW1lICsgXCIgZnJvbSBpbnZlbnRvcnkuXCIpXHJcblx0XHQkU00uc2V0KCdpbnZlbnRvcnknLCBDaGFyYWN0ZXIuaW52ZW50b3J5KTtcclxuXHR9LFxyXG5cclxuXHR1c2VJbnZlbnRvcnlJdGVtOiBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRpZiAoQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSAmJiBDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dID4gMCkge1xyXG5cdFx0XHQvLyB1c2UgdGhlIGVmZmVjdCBpbiB0aGUgaW52ZW50b3J5OyBqdXN0IGluIGNhc2UgYSBuYW1lIG1hdGNoZXMgYnV0IHRoZSBlZmZlY3RcclxuXHRcdFx0Ly8gZG9lcyBub3QsIGFzc3VtZSB0aGUgaW52ZW50b3J5IGl0ZW0gaXMgdGhlIHNvdXJjZSBvZiB0cnV0aFxyXG5cdFx0XHRJdGVtTGlzdFtpdGVtXS5vblVzZSgpO1xyXG5cdFx0XHRpZiAodHlwZW9mKEl0ZW1MaXN0W2l0ZW1dLmRlc3Ryb3lPblVzZSkgPT0gXCJmdW5jdGlvblwiICYmIEl0ZW1MaXN0W2l0ZW1dLmRlc3Ryb3lPblVzZSgpKSB7XHJcblx0XHRcdFx0Q2hhcmFjdGVyLnJlbW92ZUZyb21JbnZlbnRvcnkoaXRlbSk7XHJcblx0XHRcdH0gZWxzZSBpZiAoSXRlbUxpc3RbaXRlbV0uZGVzdHJveU9uVXNlKSB7XHJcblx0XHRcdFx0Q2hhcmFjdGVyLnJlbW92ZUZyb21JbnZlbnRvcnkoaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQkU00uc2V0KCdpbnZlbnRvcnknLCBDaGFyYWN0ZXIuaW52ZW50b3J5KTtcclxuXHR9LFxyXG5cclxuXHRlcXVpcEl0ZW06IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdGlmIChJdGVtTGlzdFtpdGVtXS5zbG90ICYmIENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zW0l0ZW1MaXN0W2l0ZW1dLnNsb3RdICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0Q2hhcmFjdGVyLmFkZFRvSW52ZW50b3J5KENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zW0l0ZW1MaXN0W2l0ZW1dLnNsb3RdKTtcclxuXHRcdFx0Q2hhcmFjdGVyLmVxdWlwcGVkSXRlbXNbSXRlbUxpc3RbaXRlbV0uc2xvdF0gPSBpdGVtO1xyXG5cdFx0XHRpZiAoSXRlbUxpc3RbaXRlbV0ub25FcXVpcCkge1xyXG5cdFx0XHRcdEl0ZW1MaXN0W2l0ZW1dLm9uRXF1aXAoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRDaGFyYWN0ZXIuYXBwbHlFcXVpcG1lbnRFZmZlY3RzKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0JFNNLnNldCgnZXF1aXBwZWRJdGVtcycsIENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zKTtcclxuXHRcdCRTTS5zZXQoJ2ludmVudG9yeScsIENoYXJhY3Rlci5pbnZlbnRvcnkpO1xyXG5cdH0sXHJcblxyXG5cdGdyYW50UGVyazogZnVuY3Rpb24ocGVyaykge1xyXG5cdFx0aWYgKENoYXJhY3Rlci5wZXJrc1twZXJrXSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGlmKHBlcmsudGltZUxlZnQgPiAwKSB7XHJcblx0XHRcdFx0Q2hhcmFjdGVyLnBlcmtzW3BlcmtdICs9IHBlcmsudGltZUxlZnQ7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5wZXJrc1twZXJrXSA9IHBlcms7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy51cGRhdGVQZXJrcygpO1xyXG5cclxuXHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KCdudWxsJywgXCJBY3F1aXJlZCBlZmZlY3Q6IFwiICsgUGVya0xpc3RbcGVya10ubmFtZSk7XHJcblx0XHRcclxuXHRcdCRTTS5zZXQoJ3BlcmtzJywgQ2hhcmFjdGVyLnBlcmtzKTtcclxuXHR9LFxyXG5cclxuXHRyZW1vdmVQZXJrOiBmdW5jdGlvbihwZXJrKSB7XHJcblx0XHRpZiAoQ2hhcmFjdGVyLnBlcmtzW3BlcmsubmFtZV0gIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRkZWxldGUgQ2hhcmFjdGVyLnBlcmtzW3BlcmsubmFtZV07XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy51cGRhdGVQZXJrcygpO1xyXG5cclxuXHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KCdudWxsJywgXCJMb3N0IGVmZmVjdDogXCIgKyBQZXJrTGlzdFtwZXJrXS5uYW1lKTtcclxuXHJcblx0XHQkU00uc2V0KCdwZXJrcycsIENoYXJhY3Rlci5wZXJrcyk7XHJcblx0fSxcclxuXHJcblx0dXBkYXRlUGVya3M6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5wZXJrQXJlYS5lbXB0eSgpO1xyXG5cdFx0aWYgKE9iamVjdC5rZXlzKHRoaXMucGVya3MpLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0JCgnPGRpdj4nKS50ZXh0KCdQZXJrcycpXHJcblx0XHRcdC5jc3MoJ3RleHQtZGVjb3JhdGlvbicsICd1bmRlcmxpbmUnKVxyXG5cdFx0XHQuY3NzKCdtYXJnaW4tdG9wJywgJzEwcHgnKVxyXG5cdFx0XHQuYXR0cignaWQnLCAndGl0bGUnKVxyXG5cdFx0XHQuYXBwZW5kVG8oJ2RpdiNwZXJrcycpO1xyXG5cdFx0XHQvLyBzZXQgdXAgY2xpY2sgYW5kIGhvdmVyIGhhbmRsZXJzIGZvciBwZXJrc1xyXG5cdFx0dGhpcy5wZXJrQXJlYVxyXG5cdFx0Lm9uKFwiY2xpY2tcIiwgXCIjcGVya1wiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly8gaGFuZGxlIHRoaXMgd2hlbiB3ZSBoYXZlIHBlcmsgZGVzY3JpcHRpb25zIGFuZCBzdHVmZlxyXG5cdFx0fSkub24oXCJtb3VzZWVudGVyXCIsIFwiI3BlcmtcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciB0b29sdGlwID0gJChcIjxkaXYgaWQ9J3Rvb2x0aXAnIGNsYXNzPSd0b29sdGlwJz5cIiArIFBlcmtMaXN0WyQodGhpcykuZGF0YShcIm5hbWVcIildLnRleHQgKyBcIjwvZGl2PlwiKVxyXG5cdFx0XHQuYXR0cignZGF0YS1uYW1lJywgcGVyayk7XHJcblx0XHRcdHRvb2x0aXAuYXBwZW5kVG8oJCh0aGlzKSk7XHJcblx0XHR9KS5vbihcIm1vdXNlbGVhdmVcIiwgXCIjcGVya1wiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0JChcIiN0b29sdGlwXCIsIFwiI1wiICsgJCh0aGlzKS5kYXRhKFwibmFtZVwiKSkuZmFkZU91dCgpLnJlbW92ZSgpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0XHRmb3IodmFyIHBlcmsgaW4gQ2hhcmFjdGVyLnBlcmtzKSB7XHJcblx0XHRcdFx0Ly8gYWRkIG1vdXNlb3ZlciBhbmQgY2xpY2sgc3R1ZmZcclxuXHRcdFx0XHR2YXIgcGVya0VsZW0gPSAkKCc8ZGl2PicpXHJcblx0XHRcdFx0LmF0dHIoJ2lkJywgJ3BlcmsnKVxyXG5cdFx0XHRcdC5hdHRyKCdkYXRhLW5hbWUnLCBwZXJrKVxyXG5cdFx0XHRcdC50ZXh0KFBlcmtMaXN0W3BlcmtdLm5hbWUpXHJcblx0XHRcdFx0LmFwcGVuZFRvKCdkaXYjcGVya3MnKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdG9wZW5RdWVzdExvZzogZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBjcmVhdGluZyBhIGhhbmRsZSBmb3IgbGF0ZXIgYWNjZXNzLCBzdWNoIGFzIGNsb3NpbmcgcXVlc3QgbG9nXHJcblx0XHRDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5ID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdxdWVzdCcpLmFkZENsYXNzKCdldmVudFBhbmVsJykuY3NzKCdvcGFjaXR5JywgJzAnKTtcclxuXHRcdHZhciBxdWVzdExvZ0Rpc3BsYXkgPSBDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5O1xyXG5cdFx0Q2hhcmFjdGVyLnF1ZXN0TG9nRGlzcGxheVxyXG5cdFx0Ly8gc2V0IHVwIGNsaWNrIGFuZCBob3ZlciBoYW5kbGVycyBmb3IgcXVlc3RzXHJcblx0XHQub24oXCJjbGlja1wiLCBcIiNxdWVzdFwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0Q2hhcmFjdGVyLmRpc3BsYXlRdWVzdCgkKHRoaXMpLmRhdGEoXCJuYW1lXCIpKTtcclxuXHRcdH0pO1xyXG5cdFx0JCgnPGRpdj4nKS5hZGRDbGFzcygnZXZlbnRUaXRsZScpLnRleHQoJ1F1ZXN0IExvZycpLmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHR2YXIgcXVlc3RMb2dEZXNjID0gJCgnPGRpdj4nKS50ZXh0KFwiQ2xpY2sgcXVlc3QgbmFtZXMgdG8gc2VlIG1vcmUgaW5mby5cIilcclxuXHRcdFx0LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCIyMHB4XCIpXHJcblx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0XHJcblx0XHRmb3IodmFyIHF1ZXN0IGluIENoYXJhY3Rlci5xdWVzdFN0YXR1cykge1xyXG5cdFx0XHR2YXIgcXVlc3RFbGVtID0gJCgnPGRpdj4nKVxyXG5cdFx0XHQuYXR0cignaWQnLCBcInF1ZXN0XCIpXHJcblx0XHRcdC5hdHRyKCdkYXRhLW5hbWUnLCBxdWVzdClcclxuXHRcdFx0LnRleHQoUXVlc3RMb2dbcXVlc3RdLm5hbWUpXHJcblx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0XHRpZiAoQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW3F1ZXN0XSA9PSAtMSkge1xyXG5cdFx0XHRcdHF1ZXN0RWxlbVxyXG5cdFx0XHRcdC8vIEkgd2FudCB0aGlzIHRvIGJlIG5vdCBzdHJ1Y2sgdGhyb3VnaCwgYnV0IHRoYXQncyB0b28gYW5ub3lpbmcgdG8gd29ycnlcclxuXHRcdFx0XHQvLyBhYm91dCByaWdodCBub3dcclxuXHRcdFx0XHQvLyAucHJlcGVuZChcIkRPTkUgXCIpXHJcblx0XHRcdFx0LndyYXAoXCI8c3RyaWtlPlwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFRPRE86IG1ha2UgdGhpcyBDU1MgYW4gYWN0dWFsIGNsYXNzIHNvbWV3aGVyZSwgSSdtIHN1cmUgSSdsbCBuZWVkIGl0IGFnYWluXHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2J1dHRvbnMnKS5jc3MoXCJtYXJnaW4tdG9wXCIsIFwiMjBweFwiKS5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0dmFyIGIgPSBCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6IFwiY2xvc2VRdWVzdExvZ1wiLFxyXG5cdFx0XHR0ZXh0OiBcIkNsb3NlXCIsXHJcblx0XHRcdGNsaWNrOiBDaGFyYWN0ZXIuY2xvc2VRdWVzdExvZ1xyXG5cdFx0fSkuYXBwZW5kVG8oJCgnI2J1dHRvbnMnLCBxdWVzdExvZ0Rpc3BsYXkpKTtcclxuXHRcdCQoJ2RpdiN3cmFwcGVyJykuYXBwZW5kKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHRxdWVzdExvZ0Rpc3BsYXkuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIEV2ZW50cy5fUEFORUxfRkFERSwgJ2xpbmVhcicpO1xyXG5cdH0sXHJcblxyXG5cdGRpc3BsYXlRdWVzdDogZnVuY3Rpb24ocXVlc3Q6IHN0cmluZykge1xyXG5cdFx0Y29uc3QgcXVlc3RMb2dEaXNwbGF5ID0gQ2hhcmFjdGVyLnF1ZXN0TG9nRGlzcGxheTtcclxuXHRcdHF1ZXN0TG9nRGlzcGxheS5lbXB0eSgpO1xyXG5cdFx0Y29uc3QgY3VycmVudFF1ZXN0ID0gUXVlc3RMb2dbcXVlc3RdO1xyXG5cclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAncXVlc3QnKS5hZGRDbGFzcygnZXZlbnRQYW5lbCcpLmNzcygnb3BhY2l0eScsICcwJyk7XHJcblx0XHQkKCc8ZGl2PicpLmFkZENsYXNzKCdldmVudFRpdGxlJykudGV4dChjdXJyZW50UXVlc3QubmFtZSkuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHJcblx0XHR2YXIgcXVlc3RMb2dEZXNjID0gJCgnPGRpdj4nKS50ZXh0KGN1cnJlbnRRdWVzdC5sb2dEZXNjcmlwdGlvbilcclxuXHRcdFx0LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCIyMHB4XCIpXHJcblx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cclxuXHRcdGlmIChDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdIGFzIG51bWJlciA9PSAtMSkge1xyXG5cdFx0XHR2YXIgcGhhc2VEZXNjID0gJCgnPGRpdj4nKS50ZXh0KFwiVGhpcyBxdWVzdCBpcyBjb21wbGV0ZSFcIilcclxuXHRcdFx0LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCIxMHB4XCIpXHJcblx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDw9IChDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdIGFzIG51bWJlcik7IGkrKykge1xyXG5cdFx0XHR2YXIgcGhhc2VEZXNjID0gJCgnPGRpdj4nKS50ZXh0KGN1cnJlbnRRdWVzdC5waGFzZXNbaV0uZGVzY3JpcHRpb24pXHJcblx0XHRcdC5jc3MoXCJtYXJnaW4tYm90dG9tXCIsIFwiMTBweFwiKVxyXG5cdFx0XHQuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHRcdFx0dmFyIGNvbXBsZXRlID0gdHJ1ZTtcclxuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBPYmplY3Qua2V5cyhjdXJyZW50UXVlc3QucGhhc2VzW2ldLnJlcXVpcmVtZW50cykubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHR2YXIgcmVxdWlyZW1lbnRzRGVzYyA9ICQoJzxkaXY+JykudGV4dChjdXJyZW50UXVlc3QucGhhc2VzW2ldLnJlcXVpcmVtZW50c1tqXS5yZW5kZXJSZXF1aXJlbWVudCgpKVxyXG5cdFx0XHRcdFx0LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCIyMHB4XCIpXHJcblx0XHRcdFx0XHQuY3NzKFwibWFyZ2luLWxlZnRcIiwgXCIyMHB4XCIpXHJcblx0XHRcdFx0XHQuY3NzKCdmb250LXN0eWxlJywgJ2l0YWxpYycpXHJcblx0XHRcdFx0XHQuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHRcdFx0XHRpZiAoIWN1cnJlbnRRdWVzdC5waGFzZXNbaV0ucmVxdWlyZW1lbnRzW2pdLmlzQ29tcGxldGUoKSkgY29tcGxldGUgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoY29tcGxldGUpIHtcclxuXHRcdFx0XHRwaGFzZURlc2Mud3JhcChcIjxzdHJpa2U+XCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVE9ETzogbWFrZSB0aGlzIENTUyBhbiBhY3R1YWwgY2xhc3Mgc29tZXdoZXJlLCBJJ20gc3VyZSBJJ2xsIG5lZWQgaXQgYWdhaW5cclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnYnV0dG9ucycpLmNzcyhcIm1hcmdpbi10b3BcIiwgXCIyMHB4XCIpLmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblxyXG5cdFx0dmFyIGIgPSBCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6IFwiYmFja1RvUXVlc3RMb2dcIixcclxuXHRcdFx0dGV4dDogXCJCYWNrIHRvIFF1ZXN0IExvZ1wiLFxyXG5cdFx0XHRjbGljazogQ2hhcmFjdGVyLmJhY2tUb1F1ZXN0TG9nXHJcblx0XHR9KS5hcHBlbmRUbygkKCcjYnV0dG9ucycsIHF1ZXN0TG9nRGlzcGxheSkpO1xyXG5cclxuXHRcdHZhciBiID0gQnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiBcImNsb3NlUXVlc3RMb2dcIixcclxuXHRcdFx0dGV4dDogXCJDbG9zZVwiLFxyXG5cdFx0XHRjbGljazogQ2hhcmFjdGVyLmNsb3NlUXVlc3RMb2dcclxuXHRcdH0pLmFwcGVuZFRvKCQoJyNidXR0b25zJywgcXVlc3RMb2dEaXNwbGF5KSk7XHJcblx0fSxcclxuXHJcblx0Y2xvc2VRdWVzdExvZzogZnVuY3Rpb24oKSB7XHJcblx0XHRDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5LmVtcHR5KCk7XHJcblx0XHRDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5LnJlbW92ZSgpO1xyXG5cdH0sXHJcblxyXG5cdGJhY2tUb1F1ZXN0TG9nOiBmdW5jdGlvbigpIHtcclxuXHRcdENoYXJhY3Rlci5jbG9zZVF1ZXN0TG9nKCk7XHJcblx0XHRDaGFyYWN0ZXIub3BlblF1ZXN0TG9nKCk7XHJcblx0fSxcclxuXHJcblx0c2V0UXVlc3RTdGF0dXM6IGZ1bmN0aW9uKHF1ZXN0LCBwaGFzZSkge1xyXG5cdFx0Ly8gbWlnaHQgYmUgYSBnb29kIGlkZWEgdG8gY2hlY2sgZm9yIGxpbmVhciBxdWVzdCBwcm9ncmVzc2lvbiBoZXJlP1xyXG5cdFx0aWYgKFF1ZXN0TG9nW3F1ZXN0XSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdENoYXJhY3Rlci5xdWVzdFN0YXR1c1txdWVzdF0gPSBwaGFzZTtcclxuXHJcblx0XHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiUXVlc3QgTG9nIHVwZGF0ZWQuXCIpO1xyXG5cdFx0XHQkU00uc2V0KCdxdWVzdFN0YXR1cycsIENoYXJhY3Rlci5xdWVzdFN0YXR1cyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Y2hlY2tRdWVzdFN0YXR1czogZnVuY3Rpb24ocXVlc3QpIHtcclxuXHRcdGNvbnN0IGN1cnJlbnRQaGFzZSA9IFF1ZXN0TG9nW3F1ZXN0XS5waGFzZXNbQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW3F1ZXN0XV07XHJcblxyXG5cdFx0aWYgKGN1cnJlbnRQaGFzZSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG5cdFx0dmFyIGNvbXBsZXRlID0gdHJ1ZTtcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgT2JqZWN0LmtleXMoY3VycmVudFBoYXNlLnJlcXVpcmVtZW50cykubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKCFjdXJyZW50UGhhc2UucmVxdWlyZW1lbnRzW2ldLmlzQ29tcGxldGUoKSlcclxuXHRcdFx0XHRjb21wbGV0ZSA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChjb21wbGV0ZSkge1xyXG5cdFx0XHQvLyBpZiB0aGVyZSBpcyBhIG5leHQgcGhhc2UsIHNldCBxdWVzdFN0YXR1cyB0byBpdFxyXG5cdFx0XHRpZiAoUXVlc3RMb2dbcXVlc3RdLnBoYXNlc1tDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdICsgMV0gIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdENoYXJhY3Rlci5xdWVzdFN0YXR1c1txdWVzdF0gKz0gMTtcclxuXHRcdFx0fSBlbHNlIHsgLy8gZWxzZSBzZXQgaXQgdG8gY29tcGxldGVcclxuXHRcdFx0XHRDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdID0gLTE7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJRdWVzdCBMb2cgdXBkYXRlZC5cIik7XHJcblx0XHQkU00uc2V0KCdxdWVzdFN0YXR1cycsIENoYXJhY3Rlci5xdWVzdFN0YXR1cyk7XHJcblx0fSxcclxuXHJcblx0Ly8gYXBwbHkgZXF1aXBtZW50IGVmZmVjdHMsIHdoaWNoIHNob3VsZCBhbGwgY2hlY2sgYWdhaW5zdCAkU00gc3RhdGUgdmFyaWFibGVzO1xyXG5cdC8vIHRoaXMgc2hvdWxkIGJlIGNhbGxlZCBvbiBiYXNpY2FsbHkgZXZlcnkgcGxheWVyIGFjdGlvbiB3aGVyZSBhIHBpZWNlIG9mIGdlYXJcclxuXHQvLyB3b3VsZCBkbyBzb21ldGhpbmcgb3IgY2hhbmdlIGFuIG91dGNvbWU7IGdpdmUgZXh0cmFQYXJhbXMgdG8gdGhlIGVmZmVjdCBiZWluZyBcclxuXHQvLyBhcHBsaWVkIGZvciBhbnl0aGluZyB0aGF0J3MgcmVsZXZhbnQgdG8gdGhlIGVmZmVjdCBidXQgbm90IGhhbmRsZWQgYnkgJFNNXHJcblx0YXBwbHlFcXVpcG1lbnRFZmZlY3RzOiBmdW5jdGlvbihleHRyYVBhcmFtcz8pIHtcclxuXHRcdGZvciAoY29uc3QgaXRlbSBpbiBDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcykge1xyXG5cdFx0XHRpZiAoSXRlbUxpc3RbaXRlbV0uZWZmZWN0cykge1xyXG5cdFx0XHRcdGZvciAoY29uc3QgZWZmZWN0IGluIEl0ZW1MaXN0W2l0ZW1dLmVmZmVjdHMpIHtcclxuXHRcdFx0XHRcdC8vIE5PVEU6IGN1cnJlbnRseSB0aGlzIGlzIGdvb2QgZm9yIGFwcGx5aW5nIHBlcmtzIGFuZCBOb3RpZnlpbmc7XHJcblx0XHRcdFx0XHQvLyBhcmUgdGhlcmUgb3RoZXIgc2l0dWF0aW9ucyB3aGVyZSB3ZSdkIHdhbnQgdG8gYXBwbHkgZWZmZWN0cyxcclxuXHRcdFx0XHRcdC8vIG9yIGNhbiB3ZSBjb3ZlciBiYXNpY2FsbHkgZXZlcnkgY2FzZSB2aWEgdGhvc2UgdGhpbmdzP1xyXG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdFx0aWYgKGVmZmVjdC5pc0FjdGl2ZSAmJiBlZmZlY3QuaXNBY3RpdmUoZXh0cmFQYXJhbXMpKSBlZmZlY3QuYXBwbHkoZXh0cmFQYXJhbXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8vIGdldCBzdGF0cyBhZnRlciBhcHBseWluZyBhbGwgZXF1aXBtZW50IGJvbnVzZXMsIHBlcmtzLCBldGMuXHJcblx0Z2V0RGVyaXZlZFN0YXRzOiBmdW5jdGlvbigpIHtcclxuXHRcdGNvbnN0IGRlcml2ZWRTdGF0cyA9IHN0cnVjdHVyZWRDbG9uZShDaGFyYWN0ZXIucmF3U3RhdHMpO1xyXG5cdFx0Zm9yIChjb25zdCBpdGVtIGluIENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zKSB7XHJcblx0XHRcdGlmIChJdGVtTGlzdFtpdGVtXS5zdGF0Qm9udXNlcykge1xyXG5cdFx0XHRcdGZvciAoY29uc3Qgc3RhdCBpbiBPYmplY3Qua2V5cyhJdGVtTGlzdFtpdGVtXS5zdGF0Qm9udXNlcykpIHtcclxuXHRcdFx0XHRcdGlmICh0eXBlb2YgKEl0ZW1MaXN0W2l0ZW1dLnN0YXRCb251c2VzW3N0YXRdID09IFwiZnVuY3Rpb25cIikpIHtcclxuXHRcdFx0XHRcdFx0ZGVyaXZlZFN0YXRzW3N0YXRdICs9IEl0ZW1MaXN0W2l0ZW1dLnN0YXRCb251c2VzW3N0YXRdKCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRkZXJpdmVkU3RhdHNbc3RhdF0gKz0gSXRlbUxpc3RbaXRlbV0uc3RhdEJvbnVzZXNbc3RhdF07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yIChjb25zdCBwZXJrIGluIENoYXJhY3Rlci5wZXJrcykge1xyXG5cdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdGlmIChwZXJrLnN0YXRCb251c2VzKSB7XHJcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdGZvciAoY29uc3Qgc3RhdCBpbiBPYmplY3Qua2V5cyhwZXJrLnN0YXRCb251c2VzKSkge1xyXG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiAocGVyay5zdGF0Qm9udXNlc1tzdGF0XSA9PSBcImZ1bmN0aW9uXCIpKSB7XHJcblx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdFx0XHRcdFx0ZGVyaXZlZFN0YXRzW3N0YXRdICs9IHBlcmsuc3RhdEJvbnVzZXNbc3RhdF0oKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdFx0XHRcdFx0ZGVyaXZlZFN0YXRzW3N0YXRdICs9IHBlcmsuc3RhdEJvbnVzZXNbc3RhdF07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGRlcml2ZWRTdGF0cztcclxuXHR9XHJcbn0iLCIvLyBhbGwgaXRlbXMgZ28gaGVyZSwgc28gdGhhdCBub3RoaW5nIHNpbGx5IGhhcHBlbnMgaW4gdGhlIGV2ZW50IHRoYXQgdGhleSBnZXQgcHV0IGluIExvY2FsIFN0b3JhZ2VcclxuLy8gYXMgcGFydCBvZiB0aGUgc3RhdGUgbWFuYWdlbWVudCBjb2RlOyBwbGVhc2Ugc2F2ZSBpdGVtIG5hbWVzIHRvIHRoZSBpbnZlbnRvcnksIGFuZCB0aGVuIHJlZmVyIHRvIFxyXG4vLyB0aGUgaXRlbSBsaXN0IHZpYSB0aGUgaXRlbSBuYW1lXHJcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4vY2hhcmFjdGVyXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBOb3RpZmljYXRpb25zIH0gZnJvbSBcIi4uL25vdGlmaWNhdGlvbnNcIjtcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gXCIuL2l0ZW1cIjtcclxuXHJcbi8vIERldGFpbHMgZm9yIGFsbCBpbi1nYW1lIGl0ZW1zOyB0aGUgQ2hhcmFjdGVyIGludmVudG9yeSBvbmx5IGhvbGRzIGl0ZW0gSURzXHJcbi8vIGFuZCBhbW91bnRzXHJcbmV4cG9ydCBjb25zdCBJdGVtTGlzdDoge1tpZDogc3RyaW5nXTogSXRlbX0gPSB7XHJcbiAgICBcIkxpei53ZWlyZEJvb2tcIjoge1xyXG4gICAgICAgIG5hbWU6ICdXZWlyZCBCb29rJyxcclxuICAgICAgICBwbHVyYWxOYW1lOiAnV2VpcmQgQm9va3MnLFxyXG4gICAgICAgIHRleHQ6IF8oJ0EgYm9vayB5b3UgZm91bmQgYXQgTGl6XFwncyBwbGFjZS4gU3VwcG9zZWRseSBoYXMgaW5mb3JtYXRpb24gYWJvdXQgQ2hhZHRvcGlhLicpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHsgXHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAgXyhcIkEgQnJpZWYgSGlzdG9yeSBvZiBDaGFkdG9waWFcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKCdUaGlzIGJvb2sgaXMgcHJldHR5IGJvcmluZywgYnV0IHlvdSBtYW5hZ2UgdG8gbGVhcm4gYSBiaXQgbW9yZSBpbiBzcGl0ZSBvZiB5b3VyIHBvb3IgYXR0ZW50aW9uIHNwYW4uJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKCdGb3IgZXhhbXBsZSwgeW91IGxlYXJuIHRoYXQgXCJDaGFkdG9waWFcIiBkb2VzblxcJ3QgaGF2ZSBhIGNhcGl0YWwgXFwnVFxcJy4gVGhhdFxcJ3MgcHJldHR5IGNvb2wsIGh1aD8nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oJy4uLiBXaGF0IHdlcmUgeW91IGRvaW5nIGFnYWluPycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1NvbWV0aGluZyBjb29sZXIgdGhhbiByZWFkaW5nLCBwcm9iYWJseScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiAoKSA9PiBDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoXCJMaXouYm9yaW5nQm9va1wiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IHRydWUsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG5cclxuICAgIFwiTGl6LmJvcmluZ0Jvb2tcIjoge1xyXG4gICAgICAgIG5hbWU6ICdcIkEgQnJpZWYgSGlzdG9yeSBvZiBDaGFkdG9waWFcIicsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ011bHRpcGxlIGNvcGllcyBvZiBcIkEgQnJpZWYgSGlzdG9yeSBvZiBDaGFkdG9waWFcIicsXHJcbiAgICAgICAgdGV4dDogXygnTWFuLCB0aGlzIGJvb2sgaXMgYm9yaW5nLicpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IF8oXCJBIEJyaWVmIFN1bW1hcnkgb2YgYSBCcmllZiBIaXN0b3J5IG9mIENoYWR0b3BpYVwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtfKCdJdFxcJ3Mgc3RpbGwganVzdCBhcyBib3JpbmcgYXMgd2hlbiB5b3UgbGFzdCB0cmllZCB0byByZWFkIGl0LicpXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnRGFuZy4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIFwiU3RyYW5nZXIuc21vb3RoU3RvbmVcIjoge1xyXG4gICAgICAgIG5hbWU6ICdhIHNtb290aCBibGFjayBzdG9uZScsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ3Ntb290aCBibGFjayBzdG9uZXMnLFxyXG4gICAgICAgIHRleHQ6IF8oJ0l0XFwncyB3ZWlyZGx5IGVlcmllJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAoISRTTS5nZXQoJ2tub3dsZWRnZS5TdHJhbmdlci5zbW9vdGhTdG9uZScpKSB7XHJcbiAgICAgICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCAnWW91IGhhdmUgbm8gaWRlYSB3aGF0IHRvIGRvIHdpdGggdGhpcyB0aGluZy4nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEgc21vb3RoIGJsYWNrIHN0b25lXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW18oXCJJJ20gZ2VudWluZWx5IG5vdCBzdXJlIGhvdyB5b3UgZ290IHRvIHRoaXMgZXZlbnQsIGJ1dCBwbGVhc2UgbGV0IG1lIGtub3cgdmlhIEdpdEh1YiBpc3N1ZSwgeW91IGxpdHRsZSBzdGlua2VyLlwiKV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0kgc3dlYXIgdG8gZG8gdGhpcywgYXMgYSByZXNwb25zaWJsZSBjaXRpemVuIG9mIEVhcnRoJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveU9uVXNlOiBmYWxzZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH0sXHJcbiAgICBcIlN0cmFuZ2VyLndyYXBwZWRLbmlmZVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ2Ega25pZmUgd3JhcHBlZCBpbiBjbG90aCcsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ0tuaXZlcyB3cmFwcGVkIGluIHNlcGFyYXRlIGNsb3RocycsXHJcbiAgICAgICAgdGV4dDogXygnTWFuLCBJIGhvcGUgaXRcXCdzIG5vdCBhbGwgbGlrZSwgYmxvb2R5IG9uIHRoZSBibGFkZSBhbmQgc3R1ZmYuJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEga25pZmUgd3JhcHBlZCBpbiBjbG90aFwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtfKFwiWW91IHVud3JhcCB0aGUga25pZmUgY2FyZWZ1bGx5LiBJdCBzZWVtcyB0byBiZSBoaWdobHkgb3JuYW1lbnRlZCwgYW5kIHlvdSBjb3VsZCBwcm9iYWJseSBkbyBzb21lIGNyaW1lcyB3aXRoIGl0LlwiKV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0hlbGwgeWVhaCwgQWRvbGYgTG9vcyBzdHlsZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiAoKSA9PiBDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoXCJTdHJhbmdlci5zaWx2ZXJLbmlmZVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IHRydWUsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgXCJTdHJhbmdlci5zaWx2ZXJLbmlmZVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ2Egc2lsdmVyIGtuaWZlJyxcclxuICAgICAgICBwbHVyYWxOYW1lOiAnc2lsdmVyIGtuaXZlcycsXHJcbiAgICAgICAgdGV4dDogXygnSGlnaGx5IG9ybmFtZW50ZWQnKSxcclxuICAgICAgICBvblVzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBfKFwiQSBzaWx2ZXIga25pZmVcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiT25lIGRheSB5b3UnbGwgYmUgYWJsZSB0byBlcXVpcCB0aGlzLCBidXQgcmlnaHQgbm93IHRoYXQgZnVuY3Rpb25hbGl0eSBpc24ndCBwcmVzZW50LlwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJQbGVhc2UgcG9saXRlbHkgbGVhdmUgdGhlIHByZW1pc2VzIHdpdGhvdXQgYWNrbm93bGVkZ2luZyB0aGlzIG1pc3NpbmcgZmVhdHVyZS5cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnWW91IGdvdCBpdCwgY2hpZWYnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIFwiU3RyYW5nZXIuY2xvdGhCdW5kbGVcIjoge1xyXG4gICAgICAgIG5hbWU6ICdhIGJ1bmRsZSBvZiBjbG90aCcsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ2J1bmRsZXMgb2YgY2xvdGgnLFxyXG4gICAgICAgIHRleHQ6IF8oJ1doYXQgbGllcyB3aXRoaW4/JyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEgYnVuZGxlIG9mIGNsb3RoXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIk9uZSBkYXkgeW91J2xsIGJlIGFibGUgdG8gdXNlIHRoaXMgaXRlbSwgYnV0IHJpZ2h0IG5vdyB0aGF0IGZ1bmN0aW9uYWxpdHkgaXNuJ3QgcHJlc2VudC5cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiUGxlYXNlIHBvbGl0ZWx5IGxlYXZlIHRoZSBwcmVtaXNlcyB3aXRob3V0IGFja25vd2xlZGdpbmcgdGhpcyBtaXNzaW5nIGZlYXR1cmUuXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1lvdSBnb3QgaXQsIGNoaWVmJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveU9uVXNlOiBmYWxzZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH0sXHJcbiAgICBcIlN0cmFuZ2VyLmNvaW5cIjoge1xyXG4gICAgICAgIG5hbWU6ICdBIHN0cmFuZ2UgY29pbicsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ3N0cmFuZ2UgY29pbnMnLFxyXG4gICAgICAgIHRleHQ6IF8oJ0JvdGggc2lkZXMgZGVwaWN0IHRoZSBzYW1lIGltYWdlJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEgc3RyYW5nZSBjb2luXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIk9uZSBkYXkgeW91J2xsIGJlIGFibGUgdG8gdXNlIHRoaXMgaXRlbSwgYnV0IHJpZ2h0IG5vdyB0aGF0IGZ1bmN0aW9uYWxpdHkgaXNuJ3QgcHJlc2VudC5cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiUGxlYXNlIHBvbGl0ZWx5IGxlYXZlIHRoZSBwcmVtaXNlcyB3aXRob3V0IGFja25vd2xlZGdpbmcgdGhpcyBtaXNzaW5nIGZlYXR1cmUuXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1lvdSBnb3QgaXQsIGNoaWVmJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveU9uVXNlOiBmYWxzZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH0sXHJcbiAgICBcIkNhcHRhaW4uc3VwcGxpZXNcIjoge1xyXG4gICAgICAgIG5hbWU6ICdTdXBwbGllcyBmb3IgdGhlIE1heW9yJyxcclxuICAgICAgICB0ZXh0OiAnVGhleVxcJ3JlIGhlYXZ5LCBidXQgbm90IGluIGEgd2F5IHRoYXQgaW1wYWN0cyBnYW1lcGxheScsXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIlN1cHBsaWVzIGZvciB0aGUgTWF5b3JcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiQSBiaWcgYm94IG9mIHN0dWZmIGZvciB0aGUgdmlsbGFnZS4gTG9va3MgbGlrZSByYXcgbWF0ZXJpYWxzLCBtb3N0bHkuXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIkkgc2hvdWxkIHJlYWxseSB0YWtlIHRoaXMgYmFjayB0byB0aGUgTWF5b3IuXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ09rYXknKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIFwib2xkTGFkeS5DYW5keVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ2EgcGllY2Ugb2YgaGFyZCBjYW5keScsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ3BpZWNlcyBvZiBoYXJkIGNhbmR5JyxcclxuICAgICAgICB0ZXh0OiAnR2l2ZW4gdG8geW91IGJ5IGEgbmljZSBvbGQgd29tYW4gaW4gYSBjYXJyaWFnZScsXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCAnWW91IHBvcCB0aGUgaGFyZCBjYW5keSBpbnRvIHlvdXIgbW91dGguIEEgZmV3IG1pbnV0ZXMgJyBcclxuICAgICAgICAgICAgICAgICsgJ2xhdGVyLCBpdFxcJ3MgZ29uZSwgbGVhdmluZyBiZWhpbmQgb25seSBhIG1pbGQgc2Vuc2Ugb2YgZ3VpbHQgYWJvdXQgbm90ICcgXHJcbiAgICAgICAgICAgICAgICArICdjYWxsaW5nIHlvdXIgZ3JhbmRtYSBtb3JlIG9mdGVuLicpXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IHRydWUsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IHRydWVcclxuICAgIH0sXHJcbiAgICBcImdhbWJsZXIuUHJpemVcIjoge1xyXG4gICAgICAgIG5hbWU6ICd0cnVlIG5hbWUgb2YgdGhlIGdhbWJsZXInLFxyXG4gICAgICAgIHRleHQ6ICdZb3Ugd29uIHRoaXMgaW4gYSBkaWNlIGdhbWUnLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgJ1RoaXMgaXRlbSBoYXMgZ3JlYXQgdmFsdWUsIGJ1dCBub3QgaGVyZSBhbmQgbm93LicpXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfVxyXG59XHJcbiIsIi8vIG1hc3RlciBsaXN0IG9mIHBlcmtzXHJcblxyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgUGVyayB9IGZyb20gXCIuL3BlcmtcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBQZXJrTGlzdDoge1tpZDogc3RyaW5nXTogUGVya30gPSB7XHJcbiAgICAndHVtbXlQYWluJzoge1xyXG4gICAgICAgIG5hbWU6ICdTb2NrZWQgaW4gdGhlIFN0b21hY2gnLFxyXG4gICAgICAgIHRleHQ6ICdUaGlzIGRvZXNuXFwndCBzZWVtIGxpa2UgYSBwZXJrLCB0YmgnLFxyXG4gICAgICAgIGZ1bGxUZXh0OiBbXHJcbiAgICAgICAgICAgIF8oXCJZb3UgZ290IGhpcyBpbiB0aGUgc3RvbWFjaCByZWFsbHkgaGFyZC5cIiksXHJcbiAgICAgICAgICAgIF8oXCJMaWtlLCBSRUFMTFkgaGFyZC4gQnkgYSBncmlubmluZyBqZXJrLlwiKVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgaXNBY3RpdmU6ICgpID0+IHRydWUsXHJcbiAgICAgICAgc3RhdEJvbnVzZXM6IHsgfSxcclxuICAgICAgICB0aW1lTGVmdDogLTFcclxuICAgIH1cclxufSIsImltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgeyBRdWVzdCB9IGZyb20gXCIuL3F1ZXN0XCI7XHJcblxyXG5leHBvcnQgY29uc3QgUXVlc3RMb2c6IHtbaWQ6IHN0cmluZ106IFF1ZXN0fSA9IHtcclxuICAgIFwibWF5b3JTdXBwbGllc1wiOiB7XHJcbiAgICAgICAgbmFtZTogXCJTdXBwbGllcyBmb3IgdGhlIE1heW9yXCIsXHJcbiAgICAgICAgbG9nRGVzY3JpcHRpb246IFwiVGhlIG1heW9yIGhhcyBhc2tlZCB5b3UgdG8gZ2V0IHNvbWUgc3VwcGxpZXMgZm9yIGhpbSBmcm9tIHRoZSBPdXRwb3N0LlwiLFxyXG4gICAgICAgIHBoYXNlczoge1xyXG4gICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJHbyBjaGVjayBvdXQgdGhlIFJvYWQgdG8gdGhlIE91dHBvc3QgdG8gc2VlIGlmIHlvdSBjYW4gZmluZCBvdXQgbW9yZVwiLFxyXG4gICAgICAgICAgICAgICAgcmVxdWlyZW1lbnRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJSZXF1aXJlbWVudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJFNNLmdldCgnUm9hZC5vcGVuJykgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnUm9hZC5jb3VudGVyJykgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJJIHNob3VsZCBnbyBjaGVjayBvdXQgdGhlIFJvYWQgdG8gdGhlIE91dHBvc3RcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCRTTS5nZXQoJ1JvYWQub3BlbicpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ1JvYWQuY291bnRlcicpICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJJIHNob3VsZCBrZWVwIGV4cGxvcmluZyB0aGUgUm9hZCB0byB0aGUgT3V0cG9zdFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoJFNNLmdldCgnUm9hZC5vcGVuJykgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyID4gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJJJ3ZlIGZvdW5kIHRoZSB3YXkgdG8gdGhlIE91dHBvc3RcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCRTTS5nZXQoJ1JvYWQub3BlbicpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPiAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIDE6IHtcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkFzayB0aGUgQ2FwdGFpbiBvZiB0aGUgT3V0cG9zdCBhYm91dCB0aGUgc3VwcGxpZXNcIixcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVtZW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyUmVxdWlyZW1lbnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnT3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnKSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkkgc2hvdWxkIHRyeSB0YWxraW5nIHRvIHRoZSBDYXB0YWluIG9mIHRoZSBPdXRwb3N0XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ091dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ091dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIENoYXJhY3Rlci5pbnZlbnRvcnlbXCJDYXB0YWluLnN1cHBsaWVzXCJdID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiSSBzaG91bGQgYXNrIHRoZSBDYXB0YWluIGFib3V0IHRoZSBtaXNzaW5nIHN1cHBsaWVzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ091dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ091dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIENoYXJhY3Rlci5pbnZlbnRvcnlbXCJDYXB0YWluLnN1cHBsaWVzXCJdICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiSSd2ZSBnb3R0ZW4gdGhlIHN1cHBsaWVzIGZyb20gdGhlIENhcHRhaW5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdPdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcpICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ091dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgKENoYXJhY3Rlci5pbnZlbnRvcnlbXCJDYXB0YWluLnN1cHBsaWVzXCJdICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCAkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIDI6IHtcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlJldHVybiB0aGUgc3VwcGxpZXMgdG8gdGhlIE1heW9yXCIsXHJcbiAgICAgICAgICAgICAgICByZXF1aXJlbWVudHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlclJlcXVpcmVtZW50OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gIFwiSSBzaG91bGQgaGFuZCB0aGVzZSBzdXBwbGllcyBvdmVyIHRvIHRoZSBNYXlvclwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoJFNNLmdldCgndmlsbGFnZS5tYXlvci5oYXZlR2l2ZW5TdXBwbGllcycpICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykgYXMgbnVtYmVyID4gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJJJ3ZlIGhhbmRlZCBvdmVyIHRoZSBzdXBwbGllcyB0byB0aGUgTWF5b3JcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnKSAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykgYXMgbnVtYmVyID4gMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvKlxyXG4gKiBNb2R1bGUgZm9yIGhhbmRsaW5nIFN0YXRlc1xyXG4gKiBcclxuICogQWxsIHN0YXRlcyBzaG91bGQgYmUgZ2V0IGFuZCBzZXQgdGhyb3VnaCB0aGUgU3RhdGVNYW5hZ2VyICgkU00pLlxyXG4gKiBcclxuICogVGhlIG1hbmFnZXIgaXMgaW50ZW5kZWQgdG8gaGFuZGxlIGFsbCBuZWVkZWQgY2hlY2tzIGFuZCBlcnJvciBjYXRjaGluZy5cclxuICogVGhpcyBpbmNsdWRlcyBjcmVhdGluZyB0aGUgcGFyZW50cyBvZiBsYXllcmVkL2RlZXAgc3RhdGVzIHNvIHVuZGVmaW5lZCBzdGF0ZXNcclxuICogZG8gbm90IG5lZWQgdG8gYmUgdGVzdGVkIGZvciBhbmQgY3JlYXRlZCBiZWZvcmVoYW5kLlxyXG4gKiBcclxuICogV2hlbiBhIHN0YXRlIGlzIGNoYW5nZWQsIGFuIHVwZGF0ZSBldmVudCBpcyBzZW50IG91dCBjb250YWluaW5nIHRoZSBuYW1lIG9mIHRoZSBzdGF0ZVxyXG4gKiBjaGFuZ2VkIG9yIGluIHRoZSBjYXNlIG9mIG11bHRpcGxlIGNoYW5nZXMgKC5zZXRNLCAuYWRkTSkgdGhlIHBhcmVudCBjbGFzcyBjaGFuZ2VkLlxyXG4gKiBFdmVudDogdHlwZTogJ3N0YXRlVXBkYXRlJywgc3RhdGVOYW1lOiA8cGF0aCBvZiBzdGF0ZSBvciBwYXJlbnQgc3RhdGU+XHJcbiAqIFxyXG4gKiBPcmlnaW5hbCBmaWxlIGNyZWF0ZWQgYnk6IE1pY2hhZWwgR2FsdXNoYVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyBOb3RpZmljYXRpb25zIH0gZnJvbSBcIi4vbm90aWZpY2F0aW9uc1wiO1xyXG5cclxudmFyIFN0YXRlTWFuYWdlciA9IHtcclxuXHRcdFxyXG5cdE1BWF9TVE9SRTogOTk5OTk5OTk5OTk5OTksXHJcblx0XHJcblx0b3B0aW9uczoge30sXHJcblx0XHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdFx0XHJcblx0XHQvL2NyZWF0ZSBjYXRlZ29yaWVzXHJcblx0XHR2YXIgY2F0cyA9IFtcclxuXHRcdFx0J2ZlYXR1cmVzJyxcdFx0Ly9iaWcgZmVhdHVyZXMgbGlrZSBidWlsZGluZ3MsIGxvY2F0aW9uIGF2YWlsYWJpbGl0eSwgdW5sb2NrcywgZXRjXHJcblx0XHRcdCdzdG9yZXMnLCBcdFx0Ly9saXR0bGUgc3R1ZmYsIGl0ZW1zLCB3ZWFwb25zLCBldGNcclxuXHRcdFx0J2NoYXJhY3RlcicsIFx0Ly90aGlzIGlzIGZvciBwbGF5ZXIncyBjaGFyYWN0ZXIgc3RhdHMgc3VjaCBhcyBwZXJrc1xyXG5cdFx0XHQnaW5jb21lJyxcclxuXHRcdFx0J3RpbWVycycsXHJcblx0XHRcdCdnYW1lJywgXHRcdC8vbW9zdGx5IGxvY2F0aW9uIHJlbGF0ZWQ6IGZpcmUgdGVtcCwgd29ya2VycywgcG9wdWxhdGlvbiwgd29ybGQgbWFwLCBldGNcclxuXHRcdFx0J3BsYXlTdGF0cycsXHQvL2FueXRoaW5nIHBsYXkgcmVsYXRlZDogcGxheSB0aW1lLCBsb2FkcywgZXRjXHJcblx0XHRcdCdwcmV2aW91cycsXHRcdC8vIHByZXN0aWdlLCBzY29yZSwgdHJvcGhpZXMgKGluIGZ1dHVyZSksIGFjaGlldmVtZW50cyAoYWdhaW4sIG5vdCB5ZXQpLCBldGNcclxuXHRcdFx0J291dGZpdCdcdFx0XHQvLyB1c2VkIHRvIHRlbXBvcmFyaWx5IHN0b3JlIHRoZSBpdGVtcyB0byBiZSB0YWtlbiBvbiB0aGUgcGF0aFxyXG5cdFx0XTtcclxuXHRcdFxyXG5cdFx0Zm9yKHZhciB3aGljaCBpbiBjYXRzKSB7XHJcblx0XHRcdGlmKCEkU00uZ2V0KGNhdHNbd2hpY2hdKSkgJFNNLnNldChjYXRzW3doaWNoXSwge30pOyBcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly9zdWJzY3JpYmUgdG8gc3RhdGVVcGRhdGVzXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHQkLkRpc3BhdGNoKCdzdGF0ZVVwZGF0ZScpLnN1YnNjcmliZSgkU00uaGFuZGxlU3RhdGVVcGRhdGVzKTtcclxuXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHR3aW5kb3cuJFNNID0gdGhpcztcclxuXHR9LFxyXG5cdFxyXG5cdC8vY3JlYXRlIGFsbCBwYXJlbnRzIGFuZCB0aGVuIHNldCBzdGF0ZVxyXG5cdGNyZWF0ZVN0YXRlOiBmdW5jdGlvbihzdGF0ZU5hbWUsIHZhbHVlKSB7XHJcblx0XHR2YXIgd29yZHMgPSBzdGF0ZU5hbWUuc3BsaXQoL1suXFxbXFxdJ1wiXSsvKTtcclxuXHRcdC8vZm9yIHNvbWUgcmVhc29uIHRoZXJlIGFyZSBzb21ldGltZXMgZW1wdHkgc3RyaW5nc1xyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB3b3Jkcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAod29yZHNbaV0gPT09ICcnKSB7XHJcblx0XHRcdFx0d29yZHMuc3BsaWNlKGksIDEpO1xyXG5cdFx0XHRcdGktLTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly8gSU1QT1JUQU5UOiBTdGF0ZSByZWZlcnMgdG8gd2luZG93LlN0YXRlLCB3aGljaCBJIGhhZCB0byBpbml0aWFsaXplIG1hbnVhbGx5XHJcblx0XHQvLyAgICBpbiBFbmdpbmUudHM7IHBsZWFzZSBkb24ndCBmb3JnZXQgdGhpcyBhbmQgbWVzcyB3aXRoIGFueXRoaW5nIG5hbWVkXHJcblx0XHQvLyAgICBcIlN0YXRlXCIgb3IgXCJ3aW5kb3cuU3RhdGVcIiwgdGhpcyBzdHVmZiBpcyB3ZWlyZGx5IHByZWNhcmlvdXMgYWZ0ZXIgdHlwZXNjcmlwdGluZ1xyXG5cdFx0Ly8gICAgdGhpcyBjb2RlYmFzZSwgYW5kIEkgZG9uJ3QgaGF2ZSB0aGUgc2FuaXR5IHBvaW50cyB0byBmaWd1cmUgb3V0IHdoeVxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0dmFyIG9iaiA9IFN0YXRlO1xyXG5cdFx0dmFyIHcgPSBudWxsO1xyXG5cdFx0Zm9yKHZhciBpPTAsIGxlbj13b3Jkcy5sZW5ndGgtMTtpPGxlbjtpKyspe1xyXG5cdFx0XHR3ID0gd29yZHNbaV07XHJcblx0XHRcdGlmKG9ialt3XSA9PT0gdW5kZWZpbmVkICkgb2JqW3ddID0ge307XHJcblx0XHRcdG9iaiA9IG9ialt3XTtcclxuXHRcdH1cclxuXHRcdG9ialt3b3Jkc1tpXV0gPSB2YWx1ZTtcclxuXHRcdHJldHVybiBvYmo7XHJcblx0fSxcclxuXHRcclxuXHQvL3NldCBzaW5nbGUgc3RhdGVcclxuXHQvL2lmIG5vRXZlbnQgaXMgdHJ1ZSwgdGhlIHVwZGF0ZSBldmVudCB3b24ndCB0cmlnZ2VyLCB1c2VmdWwgZm9yIHNldHRpbmcgbXVsdGlwbGUgc3RhdGVzIGZpcnN0XHJcblx0c2V0OiBmdW5jdGlvbihzdGF0ZU5hbWUsIHZhbHVlLCBub0V2ZW50Pykge1xyXG5cdFx0dmFyIGZ1bGxQYXRoID0gJFNNLmJ1aWxkUGF0aChzdGF0ZU5hbWUpO1xyXG5cdFx0XHJcblx0XHQvL21ha2Ugc3VyZSB0aGUgdmFsdWUgaXNuJ3Qgb3ZlciB0aGUgZW5naW5lIG1heGltdW1cclxuXHRcdGlmKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJiB2YWx1ZSA+ICRTTS5NQVhfU1RPUkUpIHZhbHVlID0gJFNNLk1BWF9TVE9SRTtcclxuXHRcdFxyXG5cdFx0dHJ5e1xyXG5cdFx0XHRldmFsKCcoJytmdWxsUGF0aCsnKSA9IHZhbHVlJyk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdC8vcGFyZW50IGRvZXNuJ3QgZXhpc3QsIHNvIG1ha2UgcGFyZW50XHJcblx0XHRcdCRTTS5jcmVhdGVTdGF0ZShzdGF0ZU5hbWUsIHZhbHVlKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly9zdG9yZXMgdmFsdWVzIGNhbiBub3QgYmUgbmVnYXRpdmVcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdGlmKHN0YXRlTmFtZS5pbmRleE9mKCdzdG9yZXMnKSA9PT0gMCAmJiAkU00uZ2V0KHN0YXRlTmFtZSwgdHJ1ZSkgPCAwKSB7XHJcblx0XHRcdGV2YWwoJygnK2Z1bGxQYXRoKycpID0gMCcpO1xyXG5cdFx0XHRFbmdpbmUubG9nKCdXQVJOSU5HOiBzdGF0ZTonICsgc3RhdGVOYW1lICsgJyBjYW4gbm90IGJlIGEgbmVnYXRpdmUgdmFsdWUuIFNldCB0byAwIGluc3RlYWQuJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0RW5naW5lLmxvZyhzdGF0ZU5hbWUgKyAnICcgKyB2YWx1ZSk7XHJcblx0XHRcclxuXHRcdGlmIChub0V2ZW50ID09PSB1bmRlZmluZWQgfHwgbm9FdmVudCA9PSB0cnVlKSB7XHJcblx0XHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0XHQkU00uZmlyZVVwZGF0ZShzdGF0ZU5hbWUpO1xyXG5cdFx0fVx0XHRcclxuXHR9LFxyXG5cdFxyXG5cdC8vc2V0cyBhIGxpc3Qgb2Ygc3RhdGVzXHJcblx0c2V0TTogZnVuY3Rpb24ocGFyZW50TmFtZSwgbGlzdCwgbm9FdmVudD8pIHtcclxuXHRcdCRTTS5idWlsZFBhdGgocGFyZW50TmFtZSk7XHJcblx0XHRcclxuXHRcdC8vbWFrZSBzdXJlIHRoZSBzdGF0ZSBleGlzdHMgdG8gYXZvaWQgZXJyb3JzLFxyXG5cdFx0aWYoJFNNLmdldChwYXJlbnROYW1lKSA9PT0gdW5kZWZpbmVkKSAkU00uc2V0KHBhcmVudE5hbWUsIHt9LCB0cnVlKTtcclxuXHRcdFxyXG5cdFx0Zm9yKHZhciBrIGluIGxpc3Qpe1xyXG5cdFx0XHQkU00uc2V0KHBhcmVudE5hbWUrJ1tcIicraysnXCJdJywgbGlzdFtrXSwgdHJ1ZSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmKCFub0V2ZW50KSB7XHJcblx0XHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0XHQkU00uZmlyZVVwZGF0ZShwYXJlbnROYW1lKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdC8vc2hvcnRjdXQgZm9yIGFsdGVyaW5nIG51bWJlciB2YWx1ZXMsIHJldHVybiAxIGlmIHN0YXRlIHdhc24ndCBhIG51bWJlclxyXG5cdGFkZDogZnVuY3Rpb24oc3RhdGVOYW1lLCB2YWx1ZSwgbm9FdmVudD8pIHtcclxuXHRcdHZhciBlcnIgPSAwO1xyXG5cdFx0Ly8wIGlmIHVuZGVmaW5lZCwgbnVsbCAoYnV0IG5vdCB7fSkgc2hvdWxkIGFsbG93IGFkZGluZyB0byBuZXcgb2JqZWN0c1xyXG5cdFx0Ly9jb3VsZCBhbHNvIGFkZCBpbiBhIHRydWUgPSAxIHRoaW5nLCB0byBoYXZlIHNvbWV0aGluZyBnbyBmcm9tIGV4aXN0aW5nICh0cnVlKVxyXG5cdFx0Ly90byBiZSBhIGNvdW50LCBidXQgdGhhdCBtaWdodCBiZSB1bndhbnRlZCBiZWhhdmlvciAoYWRkIHdpdGggbG9vc2UgZXZhbCBwcm9iYWJseSB3aWxsIGhhcHBlbiBhbnl3YXlzKVxyXG5cdFx0dmFyIG9sZCA9ICRTTS5nZXQoc3RhdGVOYW1lLCB0cnVlKTtcclxuXHRcdFxyXG5cdFx0Ly9jaGVjayBmb3IgTmFOIChvbGQgIT0gb2xkKSBhbmQgbm9uIG51bWJlciB2YWx1ZXNcclxuXHRcdGlmKG9sZCAhPSBvbGQpe1xyXG5cdFx0XHRFbmdpbmUubG9nKCdXQVJOSU5HOiAnK3N0YXRlTmFtZSsnIHdhcyBjb3JydXB0ZWQgKE5hTikuIFJlc2V0dGluZyB0byAwLicpO1xyXG5cdFx0XHRvbGQgPSAwO1xyXG5cdFx0XHQkU00uc2V0KHN0YXRlTmFtZSwgb2xkICsgdmFsdWUsIG5vRXZlbnQpO1xyXG5cdFx0fSBlbHNlIGlmKHR5cGVvZiBvbGQgIT0gJ251bWJlcicgfHwgdHlwZW9mIHZhbHVlICE9ICdudW1iZXInKXtcclxuXHRcdFx0RW5naW5lLmxvZygnV0FSTklORzogQ2FuIG5vdCBkbyBtYXRoIHdpdGggc3RhdGU6JytzdGF0ZU5hbWUrJyBvciB2YWx1ZTonK3ZhbHVlKycgYmVjYXVzZSBhdCBsZWFzdCBvbmUgaXMgbm90IGEgbnVtYmVyLicpO1xyXG5cdFx0XHRlcnIgPSAxO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JFNNLnNldChzdGF0ZU5hbWUsIG9sZCArIHZhbHVlLCBub0V2ZW50KTsgLy9zZXRTdGF0ZSBoYW5kbGVzIGV2ZW50IGFuZCBzYXZlXHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBlcnI7XHJcblx0fSxcclxuXHRcclxuXHQvL2FsdGVycyBtdWx0aXBsZSBudW1iZXIgdmFsdWVzLCByZXR1cm4gbnVtYmVyIG9mIGZhaWxzXHJcblx0YWRkTTogZnVuY3Rpb24ocGFyZW50TmFtZSwgbGlzdCwgbm9FdmVudD8pIHtcclxuXHRcdHZhciBlcnIgPSAwO1xyXG5cdFx0XHJcblx0XHQvL21ha2Ugc3VyZSB0aGUgcGFyZW50IGV4aXN0cyB0byBhdm9pZCBlcnJvcnNcclxuXHRcdGlmKCRTTS5nZXQocGFyZW50TmFtZSkgPT09IHVuZGVmaW5lZCkgJFNNLnNldChwYXJlbnROYW1lLCB7fSwgdHJ1ZSk7XHJcblx0XHRcclxuXHRcdGZvcih2YXIgayBpbiBsaXN0KXtcclxuXHRcdFx0aWYoJFNNLmFkZChwYXJlbnROYW1lKydbXCInK2srJ1wiXScsIGxpc3Rba10sIHRydWUpKSBlcnIrKztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYoIW5vRXZlbnQpIHtcclxuXHRcdFx0RW5naW5lLnNhdmVHYW1lKCk7XHJcblx0XHRcdCRTTS5maXJlVXBkYXRlKHBhcmVudE5hbWUpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGVycjtcclxuXHR9LFxyXG5cdFxyXG5cdC8vcmV0dXJuIHN0YXRlLCB1bmRlZmluZWQgb3IgMFxyXG5cdGdldDogZnVuY3Rpb24oc3RhdGVOYW1lLCByZXF1ZXN0WmVybz8pOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBOdW1iZXIgfCBudWxsIHwgQm9vbGVhbiB7XHJcblx0XHR2YXIgd2hpY2hTdGF0ZTogdW5kZWZpbmVkIHwgbnVsbCB8IE51bWJlciB8IHN0cmluZyA9IG51bGw7XHJcblx0XHR2YXIgZnVsbFBhdGggPSAkU00uYnVpbGRQYXRoKHN0YXRlTmFtZSk7XHJcblx0XHRcclxuXHRcdC8vY2F0Y2ggZXJyb3JzIGlmIHBhcmVudCBvZiBzdGF0ZSBkb2Vzbid0IGV4aXN0XHJcblx0XHR0cnl7XHJcblx0XHRcdGV2YWwoJ3doaWNoU3RhdGUgPSAoJytmdWxsUGF0aCsnKScpO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHR3aGljaFN0YXRlID0gdW5kZWZpbmVkO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvL3ByZXZlbnRzIHJlcGVhdGVkIGlmIHVuZGVmaW5lZCwgbnVsbCwgZmFsc2Ugb3Ige30sIHRoZW4geCA9IDAgc2l0dWF0aW9uc1xyXG5cdFx0aWYoKCF3aGljaFN0YXRlXHJcblx0XHRcdC8vICB8fCB3aGljaFN0YXRlID09IHt9XHJcblx0XHRcdCkgJiYgcmVxdWVzdFplcm8pIHJldHVybiAwO1xyXG5cdFx0ZWxzZSByZXR1cm4gd2hpY2hTdGF0ZTtcclxuXHR9LFxyXG5cdFxyXG5cdC8vbWFpbmx5IGZvciBsb2NhbCBjb3B5IHVzZSwgYWRkKE0pIGNhbiBmYWlsIHNvIHdlIGNhbid0IHNob3J0Y3V0IHRoZW1cclxuXHQvL3NpbmNlIHNldCBkb2VzIG5vdCBmYWlsLCB3ZSBrbm93IHN0YXRlIGV4aXN0cyBhbmQgY2FuIHNpbXBseSByZXR1cm4gdGhlIG9iamVjdFxyXG5cdHNldGdldDogZnVuY3Rpb24oc3RhdGVOYW1lLCB2YWx1ZSwgbm9FdmVudD8pe1xyXG5cdFx0JFNNLnNldChzdGF0ZU5hbWUsIHZhbHVlLCBub0V2ZW50KTtcclxuXHRcdHJldHVybiBldmFsKCcoJyskU00uYnVpbGRQYXRoKHN0YXRlTmFtZSkrJyknKTtcclxuXHR9LFxyXG5cdFxyXG5cdHJlbW92ZTogZnVuY3Rpb24oc3RhdGVOYW1lLCBub0V2ZW50Pykge1xyXG5cdFx0dmFyIHdoaWNoU3RhdGUgPSAkU00uYnVpbGRQYXRoKHN0YXRlTmFtZSk7XHJcblx0XHR0cnl7XHJcblx0XHRcdGV2YWwoJyhkZWxldGUgJyt3aGljaFN0YXRlKycpJyk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdC8vaXQgZGlkbid0IGV4aXN0IGluIHRoZSBmaXJzdCBwbGFjZVxyXG5cdFx0XHRFbmdpbmUubG9nKCdXQVJOSU5HOiBUcmllZCB0byByZW1vdmUgbm9uLWV4aXN0YW50IHN0YXRlIFxcJycrc3RhdGVOYW1lKydcXCcuJyk7XHJcblx0XHR9XHJcblx0XHRpZighbm9FdmVudCl7XHJcblx0XHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0XHQkU00uZmlyZVVwZGF0ZShzdGF0ZU5hbWUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0Ly9jcmVhdGVzIGZ1bGwgcmVmZXJlbmNlIGZyb20gaW5wdXRcclxuXHQvL2hvcGVmdWxseSB0aGlzIHdvbid0IGV2ZXIgbmVlZCB0byBiZSBtb3JlIGNvbXBsaWNhdGVkXHJcblx0YnVpbGRQYXRoOiBmdW5jdGlvbihpbnB1dCl7XHJcblx0XHR2YXIgZG90ID0gKGlucHV0LmNoYXJBdCgwKSA9PSAnWycpPyAnJyA6ICcuJzsgLy9pZiBpdCBzdGFydHMgd2l0aCBbZm9vXSBubyBkb3QgdG8gam9pblxyXG5cdFx0cmV0dXJuICdTdGF0ZScgKyBkb3QgKyBpbnB1dDtcclxuXHR9LFxyXG5cdFxyXG5cdGZpcmVVcGRhdGU6IGZ1bmN0aW9uKHN0YXRlTmFtZSwgc2F2ZT8pe1xyXG5cdFx0dmFyIGNhdGVnb3J5ID0gJFNNLmdldENhdGVnb3J5KHN0YXRlTmFtZSk7XHJcblx0XHRpZihzdGF0ZU5hbWUgPT0gdW5kZWZpbmVkKSBzdGF0ZU5hbWUgPSBjYXRlZ29yeSA9ICdhbGwnOyAvL2Jlc3QgaWYgdGhpcyBkb2Vzbid0IGhhcHBlbiBhcyBpdCB3aWxsIHRyaWdnZXIgbW9yZSBzdHVmZlxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5wdWJsaXNoKHsnY2F0ZWdvcnknOiBjYXRlZ29yeSwgJ3N0YXRlTmFtZSc6c3RhdGVOYW1lfSk7XHJcblx0XHRpZihzYXZlKSBFbmdpbmUuc2F2ZUdhbWUoKTtcclxuXHR9LFxyXG5cdFxyXG5cdGdldENhdGVnb3J5OiBmdW5jdGlvbihzdGF0ZU5hbWUpe1xyXG5cdFx0dmFyIGZpcnN0T0IgPSBzdGF0ZU5hbWUuaW5kZXhPZignWycpO1xyXG5cdFx0dmFyIGZpcnN0RG90ID0gc3RhdGVOYW1lLmluZGV4T2YoJy4nKTtcclxuXHRcdHZhciBjdXRvZmYgPSBudWxsO1xyXG5cdFx0aWYoZmlyc3RPQiA9PSAtMSB8fCBmaXJzdERvdCA9PSAtMSl7XHJcblx0XHRcdGN1dG9mZiA9IGZpcnN0T0IgPiBmaXJzdERvdCA/IGZpcnN0T0IgOiBmaXJzdERvdDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGN1dG9mZiA9IGZpcnN0T0IgPCBmaXJzdERvdCA/IGZpcnN0T0IgOiBmaXJzdERvdDtcclxuXHRcdH1cclxuXHRcdGlmIChjdXRvZmYgPT0gLTEpe1xyXG5cdFx0XHRyZXR1cm4gc3RhdGVOYW1lO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHN0YXRlTmFtZS5zdWJzdHIoMCxjdXRvZmYpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cdCAqIFN0YXJ0IG9mIHNwZWNpZmljIHN0YXRlIGZ1bmN0aW9uc1xyXG5cdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblx0XHJcblx0aGFuZGxlU3RhdGVVcGRhdGVzOiBmdW5jdGlvbihlKXtcclxuXHRcdFxyXG5cdH1cdFxyXG59O1xyXG5cclxuLy9hbGlhc1xyXG5leHBvcnQgY29uc3QgJFNNID0gU3RhdGVNYW5hZ2VyO1xyXG4iLCJpbXBvcnQgeyBOb3RpZmljYXRpb25zIH0gZnJvbSAnLi9ub3RpZmljYXRpb25zJztcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSAnLi9zdGF0ZV9tYW5hZ2VyJztcclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSAnLi9lbmdpbmUnO1xyXG5cclxuZXhwb3J0IGNvbnN0IFdlYXRoZXIgPSB7XHJcbiAgICBpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblxyXG4gICAgICAgIC8vc3Vic2NyaWJlIHRvIHN0YXRlVXBkYXRlc1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuXHRcdCQuRGlzcGF0Y2goJ3N0YXRlVXBkYXRlJykuc3Vic2NyaWJlKFdlYXRoZXIuaGFuZGxlU3RhdGVVcGRhdGVzKTtcclxuICAgIH0sXHJcblxyXG4gICAgaGFuZGxlU3RhdGVVcGRhdGVzOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgaWYgKGUuY2F0ZWdvcnkgPT0gJ3dlYXRoZXInKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoJFNNLmdldCgnd2VhdGhlcicpKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdzdW5ueSc6IFxyXG4gICAgICAgICAgICAgICAgICAgIFdlYXRoZXIuc3RhcnRTdW5ueSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnY2xvdWR5JzpcclxuICAgICAgICAgICAgICAgICAgICBXZWF0aGVyLnN0YXJ0Q2xvdWR5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdyYWlueSc6XHJcbiAgICAgICAgICAgICAgICAgICAgV2VhdGhlci5zdGFydFJhaW55KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfbGFzdFdlYXRoZXI6ICdzdW5ueScsXHJcblxyXG4gICAgc3RhcnRTdW5ueTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJUaGUgc3VuIGJlZ2lucyB0byBzaGluZS5cIik7XHJcbiAgICAgICAgV2VhdGhlci5fbGFzdFdlYXRoZXIgPSAnc3VubnknO1xyXG4gICAgICAgICQoJ2JvZHknKS5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6ICcjRkZGRkZGJ30sICdzbG93Jyk7XHJcbiAgICAgICAgJCgnZGl2I3N0b3Jlczo6YmVmb3JlJykuYW5pbWF0ZSh7YmFja2dyb3VuZENvbG9yOiAnI0ZGRkZGRid9LCAnc2xvdycpO1xyXG4gICAgICAgIFdlYXRoZXIubWFrZVJhaW5TdG9wKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHN0YXJ0Q2xvdWR5OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoV2VhdGhlci5fbGFzdFdlYXRoZXIgPT0gJ3N1bm55Jykge1xyXG4gICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIkNsb3VkcyByb2xsIGluLCBvYnNjdXJpbmcgdGhlIHN1bi5cIik7XHJcbiAgICAgICAgfSBlbHNlIGlmIChXZWF0aGVyLl9sYXN0V2VhdGhlciA9PSAncmFpbnknKSB7XHJcbiAgICAgICAgICAgIE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiVGhlIHJhaW4gYnJlYWtzLCBidXQgdGhlIGNsb3VkcyByZW1haW4uXCIpXHJcbiAgICAgICAgfVxyXG4gICAgICAgICQoJ2JvZHknKS5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6ICcjOEI4Nzg2J30sICdzbG93Jyk7XHJcbiAgICAgICAgJCgnZGl2I3N0b3Jlczo6YmVmb3JlJykuYW5pbWF0ZSh7YmFja2dyb3VuZENvbG9yOiAnIzhCODc4Nid9LCAnc2xvdycpO1xyXG4gICAgICAgIFdlYXRoZXIuX2xhc3RXZWF0aGVyID0gJ2Nsb3VkeSc7XHJcbiAgICAgICAgV2VhdGhlci5tYWtlUmFpblN0b3AoKTtcclxuICAgIH0sXHJcblxyXG4gICAgc3RhcnRSYWlueTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKFdlYXRoZXIuX2xhc3RXZWF0aGVyID09ICdzdW5ueScpIHtcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJUaGUgd2luZCBzdWRkZW5seSBwaWNrcyB1cC4gQ2xvdWRzIHJvbGwgaW4sIGhlYXZ5IHdpdGggcmFpbiwgYW5kIHJhaW5kcm9wcyBmYWxsIHNvb24gYWZ0ZXIuXCIpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoV2VhdGhlci5fbGFzdFdlYXRoZXIgPT0gJ2Nsb3VkeScpIHtcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJUaGUgY2xvdWRzIHRoYXQgd2VyZSBwcmV2aW91c2x5IGNvbnRlbnQgdG8gaGFuZyBvdmVyaGVhZCBsZXQgbG9vc2UgYSBtb2RlcmF0ZSBkb3ducG91ci5cIilcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgJCgnYm9keScpLmFuaW1hdGUoe2JhY2tncm91bmRDb2xvcjogJyM2RDY5NjgnfSwgJ3Nsb3cnKTtcclxuICAgICAgICAkKCdkaXYjc3RvcmVzOjpiZWZvcmUnKS5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6ICcjNkQ2OTY4J30sICdzbG93Jyk7XHJcbiAgICAgICAgV2VhdGhlci5fbGFzdFdlYXRoZXIgPSAncmFpbnknO1xyXG4gICAgICAgIFdlYXRoZXIubWFrZUl0UmFpbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICBfbG9jYXRpb246ICcnLFxyXG5cclxuICAgIGluaXRpYXRlV2VhdGhlcjogZnVuY3Rpb24oYXZhaWxhYmxlV2VhdGhlciwgbG9jYXRpb24pIHtcclxuICAgICAgICBpZiAoV2VhdGhlci5fbG9jYXRpb24gPT0gJycpIFdlYXRoZXIuX2xvY2F0aW9uID0gbG9jYXRpb247XHJcbiAgICAgICAgLy8gaWYgaW4gbmV3IGxvY2F0aW9uLCBlbmQgd2l0aG91dCB0cmlnZ2VyaW5nIGEgbmV3IHdlYXRoZXIgaW5pdGlhdGlvbiwgXHJcbiAgICAgICAgLy8gbGVhdmluZyB0aGUgbmV3IGxvY2F0aW9uJ3MgaW5pdGlhdGVXZWF0aGVyIGNhbGxiYWNrIHRvIGRvIGl0cyB0aGluZ1xyXG4gICAgICAgIGVsc2UgaWYgKFdlYXRoZXIuX2xvY2F0aW9uICE9IGxvY2F0aW9uKSByZXR1cm47IFxyXG5cclxuICAgICAgICB2YXIgY2hvc2VuV2VhdGhlciA9ICdub25lJztcclxuICAgICAgICAvL2dldCBvdXIgcmFuZG9tIGZyb20gMCB0byAxXHJcbiAgICAgICAgdmFyIHJuZCA9IE1hdGgucmFuZG9tKCk7XHJcbiAgXHJcbiAgICAgICAgLy9pbml0aWFsaXNlIG91ciBjdW11bGF0aXZlIHBlcmNlbnRhZ2VcclxuICAgICAgICB2YXIgY3VtdWxhdGl2ZUNoYW5jZSA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaSBpbiBhdmFpbGFibGVXZWF0aGVyKSB7XHJcbiAgICAgICAgICAgIGN1bXVsYXRpdmVDaGFuY2UgKz0gYXZhaWxhYmxlV2VhdGhlcltpXTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChybmQgPCBjdW11bGF0aXZlQ2hhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICBjaG9zZW5XZWF0aGVyID0gaTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY2hvc2VuV2VhdGhlciAhPSAkU00uZ2V0KCd3ZWF0aGVyJykpICRTTS5zZXQoJ3dlYXRoZXInLCBjaG9zZW5XZWF0aGVyKTtcclxuICAgICAgICBFbmdpbmUuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhdGVXZWF0aGVyKGF2YWlsYWJsZVdlYXRoZXIsIGxvY2F0aW9uKTtcclxuICAgICAgICB9LCAzICogNjAgKiAxMDAwKTtcclxuICAgIH0sXHJcblxyXG4gICAgbWFrZUl0UmFpbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gaHR0cHM6Ly9jb2RlcGVuLmlvL2FyaWNrbGUvcGVuL1hLak1aWVxyXG4gICAgICAgIC8vY2xlYXIgb3V0IGV2ZXJ5dGhpbmdcclxuICAgICAgICAkKCcucmFpbicpLmVtcHR5KCk7XHJcbiAgICAgIFxyXG4gICAgICAgIHZhciBpbmNyZW1lbnQgPSAwO1xyXG4gICAgICAgIHZhciBkcm9wcyA9IFwiXCI7XHJcbiAgICAgICAgdmFyIGJhY2tEcm9wcyA9IFwiXCI7XHJcbiAgICAgIFxyXG4gICAgICAgIHdoaWxlIChpbmNyZW1lbnQgPCAxMDApIHtcclxuICAgICAgICAgIC8vY291cGxlIHJhbmRvbSBudW1iZXJzIHRvIHVzZSBmb3IgdmFyaW91cyByYW5kb21pemF0aW9uc1xyXG4gICAgICAgICAgLy9yYW5kb20gbnVtYmVyIGJldHdlZW4gOTggYW5kIDFcclxuICAgICAgICAgIHZhciByYW5kb0h1bmRvID0gKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg5OCAtIDEgKyAxKSArIDEpKTtcclxuICAgICAgICAgIC8vcmFuZG9tIG51bWJlciBiZXR3ZWVuIDUgYW5kIDJcclxuICAgICAgICAgIHZhciByYW5kb0ZpdmVyID0gKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg1IC0gMiArIDEpICsgMikpO1xyXG4gICAgICAgICAgLy9pbmNyZW1lbnRcclxuICAgICAgICAgIGluY3JlbWVudCArPSByYW5kb0ZpdmVyO1xyXG4gICAgICAgICAgLy9hZGQgaW4gYSBuZXcgcmFpbmRyb3Agd2l0aCB2YXJpb3VzIHJhbmRvbWl6YXRpb25zIHRvIGNlcnRhaW4gQ1NTIHByb3BlcnRpZXNcclxuICAgICAgICAgIGRyb3BzICs9ICc8ZGl2IGNsYXNzPVwiZHJvcFwiIHN0eWxlPVwibGVmdDogJyArIGluY3JlbWVudCArICclOyBib3R0b206ICcgKyAocmFuZG9GaXZlciArIHJhbmRvRml2ZXIgLSAxICsgMTAwKSArICclOyBhbmltYXRpb24tZGVsYXk6IDAuJyArIHJhbmRvSHVuZG8gKyAnczsgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjUnICsgcmFuZG9IdW5kbyArICdzO1wiPjxkaXYgY2xhc3M9XCJzdGVtXCIgc3R5bGU9XCJhbmltYXRpb24tZGVsYXk6IDAuJyArIHJhbmRvSHVuZG8gKyAnczsgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjUnICsgcmFuZG9IdW5kbyArICdzO1wiPjwvZGl2PjxkaXYgY2xhc3M9XCJzcGxhdFwiIHN0eWxlPVwiYW5pbWF0aW9uLWRlbGF5OiAwLicgKyByYW5kb0h1bmRvICsgJ3M7IGFuaW1hdGlvbi1kdXJhdGlvbjogMC41JyArIHJhbmRvSHVuZG8gKyAncztcIj48L2Rpdj48L2Rpdj4nO1xyXG4gICAgICAgICAgYmFja0Ryb3BzICs9ICc8ZGl2IGNsYXNzPVwiZHJvcFwiIHN0eWxlPVwicmlnaHQ6ICcgKyBpbmNyZW1lbnQgKyAnJTsgYm90dG9tOiAnICsgKHJhbmRvRml2ZXIgKyByYW5kb0ZpdmVyIC0gMSArIDEwMCkgKyAnJTsgYW5pbWF0aW9uLWRlbGF5OiAwLicgKyByYW5kb0h1bmRvICsgJ3M7IGFuaW1hdGlvbi1kdXJhdGlvbjogMC41JyArIHJhbmRvSHVuZG8gKyAncztcIj48ZGl2IGNsYXNzPVwic3RlbVwiIHN0eWxlPVwiYW5pbWF0aW9uLWRlbGF5OiAwLicgKyByYW5kb0h1bmRvICsgJ3M7IGFuaW1hdGlvbi1kdXJhdGlvbjogMC41JyArIHJhbmRvSHVuZG8gKyAncztcIj48L2Rpdj48ZGl2IGNsYXNzPVwic3BsYXRcIiBzdHlsZT1cImFuaW1hdGlvbi1kZWxheTogMC4nICsgcmFuZG9IdW5kbyArICdzOyBhbmltYXRpb24tZHVyYXRpb246IDAuNScgKyByYW5kb0h1bmRvICsgJ3M7XCI+PC9kaXY+PC9kaXY+JztcclxuICAgICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAgICQoJy5yYWluLmZyb250LXJvdycpLmFwcGVuZChkcm9wcyk7XHJcbiAgICAgICAgJCgnLnJhaW4uYmFjay1yb3cnKS5hcHBlbmQoYmFja0Ryb3BzKTtcclxuICAgIH0sXHJcblxyXG4gICAgbWFrZVJhaW5TdG9wOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKCcucmFpbicpLmVtcHR5KCk7XHJcbiAgICB9XHJcbn0iXX0=
