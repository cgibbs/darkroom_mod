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
        if (state_manager_1.$SM.get('Road.open')) {
            road_1.Road.init();
        }
        if (state_manager_1.$SM.get('Outpost.open')) {
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
        for (var i in scene.text) {
            $('<div>').text(scene.text[i]).appendTo(desc);
        }
        // this dice stuff could maybe be extracted to its own function,
        // but also we might just make it way more generic so you can
        // throw ANYTHING in the Event description dynamically
        var diceVals = [];
        if (scene.dice !== undefined) {
            for (var j = 0; j < scene.dice.amount; j++) {
                var dieVal = this.getRandomInt(6) + 1;
                diceVals.push(dieVal);
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
        }
        var textVals = scene.dice.handler(diceVals);
        for (var text in textVals) {
            $('<div>').text(textVals[text]).appendTo(desc);
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
                        (0, translate_1._)("This is the store. There's nothing here yet, though."),
                        (0, translate_1._)("You find a dusty pair of dice in the corner and throw them, just to see what happens.")
                    ],
                    dice: {
                        amount: 2,
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
    }
};

},{"../../lib/textBuilder":1,"../../lib/translate":2,"../Button":3,"../characters/liz":5,"../characters/mayor":6,"../engine":7,"../events":8,"../header":10,"../state_manager":19,"../weather":20}],15:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL3RleHRCdWlsZGVyLnRzIiwic3JjL2xpYi90cmFuc2xhdGUudHMiLCJzcmMvc2NyaXB0L0J1dHRvbi50cyIsInNyYy9zY3JpcHQvY2hhcmFjdGVycy9jYXB0YWluLnRzIiwic3JjL3NjcmlwdC9jaGFyYWN0ZXJzL2xpei50cyIsInNyYy9zY3JpcHQvY2hhcmFjdGVycy9tYXlvci50cyIsInNyYy9zY3JpcHQvZW5naW5lLnRzIiwic3JjL3NjcmlwdC9ldmVudHMudHMiLCJzcmMvc2NyaXB0L2V2ZW50cy9yb2Fkd2FuZGVyLnRzIiwic3JjL3NjcmlwdC9oZWFkZXIudHMiLCJzcmMvc2NyaXB0L25vdGlmaWNhdGlvbnMudHMiLCJzcmMvc2NyaXB0L3BsYWNlcy9vdXRwb3N0LnRzIiwic3JjL3NjcmlwdC9wbGFjZXMvcm9hZC50cyIsInNyYy9zY3JpcHQvcGxhY2VzL3ZpbGxhZ2UudHMiLCJzcmMvc2NyaXB0L3BsYXllci9jaGFyYWN0ZXIudHMiLCJzcmMvc2NyaXB0L3BsYXllci9pdGVtTGlzdC50cyIsInNyYy9zY3JpcHQvcGxheWVyL3BlcmtMaXN0LnRzIiwic3JjL3NjcmlwdC9wbGF5ZXIvcXVlc3RMb2cudHMiLCJzcmMvc2NyaXB0L3N0YXRlX21hbmFnZXIudHMiLCJzcmMvc2NyaXB0L3dlYXRoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQSwrREFBK0Q7QUFDL0QscUNBQXFDO0FBQzlCLElBQU0sR0FBRyxHQUFHLFVBQVMsSUFBMkQ7SUFDbkYsSUFBTSxNQUFNLEdBQUcsSUFBSSxLQUFhLENBQUM7SUFDakMsS0FBSyxJQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNuQixJQUFJLE9BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRO1lBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FB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LENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDdkIsQ0FBQztDQUNKLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyB0ZXh0IGJ1aWxkZXIgdXRpbGl0eSwgdXNlZCBmb3IgaGFuZGxpbmcgY29uZGl0aW9uYWwgdGV4dCBpbiBcclxuLy8gZGVzY3JpcHRpb25zIGFuZCBvdGhlciB0ZXh0IGJsdXJic1xyXG5leHBvcnQgY29uc3QgX3RiID0gZnVuY3Rpb24odGV4dDogQXJyYXk8c3RyaW5nIHwgeyB0ZXh0OiBzdHJpbmcsIGlzVmlzaWJsZTogRnVuY3Rpb24gfT4pIHtcclxuICAgIGNvbnN0IG91dHB1dCA9IG5ldyBBcnJheTxzdHJpbmc+O1xyXG4gICAgZm9yIChjb25zdCBpIGluIHRleHQpIHtcclxuICAgICAgICBpZiAodHlwZW9mKHRleHRbaV0pID09PSBcInN0cmluZ1wiKSBvdXRwdXQucHVzaCh0ZXh0W2ldKTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCh0ZXh0W2ldIGFzIHt0ZXh0OiBzdHJpbmcsIGlzVmlzaWJsZTogRnVuY3Rpb259KS5pc1Zpc2libGUoKSkge1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goKHRleHRbaV0gYXMge3RleHQ6IHN0cmluZywgaXNWaXNpYmxlOiBGdW5jdGlvbn0pLnRleHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG91dHB1dDtcclxufSIsIi8vIChmdW5jdGlvbigpIHtcclxuXHJcbi8vIFx0dmFyIHRyYW5zbGF0ZSA9IGZ1bmN0aW9uKHRleHQpXHJcbi8vIFx0e1xyXG4vLyBcdFx0dmFyIHhsYXRlID0gdHJhbnNsYXRlTG9va3VwKHRleHQpO1xyXG5cdFx0XHJcbi8vIFx0XHRpZiAodHlwZW9mIHhsYXRlID09IFwiZnVuY3Rpb25cIilcclxuLy8gXHRcdHtcclxuLy8gXHRcdFx0eGxhdGUgPSB4bGF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4vLyBcdFx0fVxyXG4vLyBcdFx0ZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpXHJcbi8vIFx0XHR7XHJcbi8vIFx0XHRcdHZhciBhcHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XHJcbi8vIFx0XHRcdHZhciBhcmdzID0gYXBzLmNhbGwoIGFyZ3VtZW50cywgMSApO1xyXG4gIFxyXG4vLyBcdFx0XHR4bGF0ZSA9IGZvcm1hdHRlcih4bGF0ZSwgYXJncyk7XHJcbi8vIFx0XHR9XHJcblx0XHRcclxuLy8gXHRcdHJldHVybiB4bGF0ZTtcclxuLy8gXHR9O1xyXG5cdFxyXG4vLyBcdC8vIEkgd2FudCBpdCBhdmFpbGFibGUgZXhwbGljaXR5IGFzIHdlbGwgYXMgdmlhIHRoZSBvYmplY3RcclxuLy8gXHR0cmFuc2xhdGUudHJhbnNsYXRlID0gdHJhbnNsYXRlO1xyXG5cdFxyXG4vLyBcdC8vZnJvbSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS83NzYxOTYgdmlhIGh0dHA6Ly9kYXZlZGFzaC5jb20vMjAxMC8xMS8xOS9weXRob25pYy1zdHJpbmctZm9ybWF0dGluZy1pbi1qYXZhc2NyaXB0LyBcclxuLy8gXHR2YXIgZGVmYXVsdEZvcm1hdHRlciA9IChmdW5jdGlvbigpIHtcclxuLy8gXHRcdHZhciByZSA9IC9cXHsoW159XSspXFx9L2c7XHJcbi8vIFx0XHRyZXR1cm4gZnVuY3Rpb24ocywgYXJncykge1xyXG4vLyBcdFx0XHRyZXR1cm4gcy5yZXBsYWNlKHJlLCBmdW5jdGlvbihfLCBtYXRjaCl7IHJldHVybiBhcmdzW21hdGNoXTsgfSk7XHJcbi8vIFx0XHR9O1xyXG4vLyBcdH0oKSk7XHJcbi8vIFx0dmFyIGZvcm1hdHRlciA9IGRlZmF1bHRGb3JtYXR0ZXI7XHJcbi8vIFx0dHJhbnNsYXRlLnNldEZvcm1hdHRlciA9IGZ1bmN0aW9uKG5ld0Zvcm1hdHRlcilcclxuLy8gXHR7XHJcbi8vIFx0XHRmb3JtYXR0ZXIgPSBuZXdGb3JtYXR0ZXI7XHJcbi8vIFx0fTtcclxuXHRcclxuLy8gXHR0cmFuc2xhdGUuZm9ybWF0ID0gZnVuY3Rpb24oKVxyXG4vLyBcdHtcclxuLy8gXHRcdHZhciBhcHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XHJcbi8vIFx0XHR2YXIgcyA9IGFyZ3VtZW50c1swXTtcclxuLy8gXHRcdHZhciBhcmdzID0gYXBzLmNhbGwoIGFyZ3VtZW50cywgMSApO1xyXG4gIFxyXG4vLyBcdFx0cmV0dXJuIGZvcm1hdHRlcihzLCBhcmdzKTtcclxuLy8gXHR9O1xyXG5cclxuLy8gXHR2YXIgZHlub1RyYW5zID0gbnVsbDtcclxuLy8gXHR0cmFuc2xhdGUuc2V0RHluYW1pY1RyYW5zbGF0b3IgPSBmdW5jdGlvbihuZXdEeW5vVHJhbnMpXHJcbi8vIFx0e1xyXG4vLyBcdFx0ZHlub1RyYW5zID0gbmV3RHlub1RyYW5zO1xyXG4vLyBcdH07XHJcblxyXG4vLyBcdHZhciB0cmFuc2xhdGlvbiA9IG51bGw7XHJcbi8vIFx0dHJhbnNsYXRlLnNldFRyYW5zbGF0aW9uID0gZnVuY3Rpb24obmV3VHJhbnNsYXRpb24pXHJcbi8vIFx0e1xyXG4vLyBcdFx0dHJhbnNsYXRpb24gPSBuZXdUcmFuc2xhdGlvbjtcclxuLy8gXHR9O1xyXG5cdFxyXG4vLyBcdGZ1bmN0aW9uIHRyYW5zbGF0ZUxvb2t1cCh0YXJnZXQpXHJcbi8vIFx0e1xyXG4vLyBcdFx0aWYgKHRyYW5zbGF0aW9uID09IG51bGwgfHwgdGFyZ2V0ID09IG51bGwpXHJcbi8vIFx0XHR7XHJcbi8vIFx0XHRcdHJldHVybiB0YXJnZXQ7XHJcbi8vIFx0XHR9XHJcblx0XHRcclxuLy8gXHRcdGlmICh0YXJnZXQgaW4gdHJhbnNsYXRpb24gPT0gZmFsc2UpXHJcbi8vIFx0XHR7XHJcbi8vIFx0XHRcdGlmIChkeW5vVHJhbnMgIT0gbnVsbClcclxuLy8gXHRcdFx0e1xyXG4vLyBcdFx0XHRcdHJldHVybiBkeW5vVHJhbnModGFyZ2V0KTtcclxuLy8gXHRcdFx0fVxyXG4vLyBcdFx0XHRyZXR1cm4gdGFyZ2V0O1xyXG4vLyBcdFx0fVxyXG5cdFx0XHJcbi8vIFx0XHR2YXIgcmVzdWx0ID0gdHJhbnNsYXRpb25bdGFyZ2V0XTtcclxuLy8gXHRcdGlmIChyZXN1bHQgPT0gbnVsbClcclxuLy8gXHRcdHtcclxuLy8gXHRcdFx0cmV0dXJuIHRhcmdldDtcclxuLy8gXHRcdH1cclxuXHRcdFxyXG4vLyBcdFx0cmV0dXJuIHJlc3VsdDtcclxuLy8gXHR9O1xyXG5cdFxyXG4vLyBcdHdpbmRvdy5fID0gdHJhbnNsYXRlO1xyXG5cclxuLy8gfSkoKTtcclxuXHJcbi8vIGV4cG9ydCBjb25zdCBfID0gd2luZG93Ll87XHJcblxyXG5leHBvcnQgY29uc3QgXyA9IGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHM7IH0iLCJpbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi9lbmdpbmVcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi9saWIvdHJhbnNsYXRlXCI7XHJcblxyXG5leHBvcnQgY29uc3QgQnV0dG9uID0ge1xyXG5cdEJ1dHRvbjogZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdFx0aWYodHlwZW9mIG9wdGlvbnMuY29vbGRvd24gPT0gJ251bWJlcicpIHtcclxuXHRcdFx0dGhpcy5kYXRhX2Nvb2xkb3duID0gb3B0aW9ucy5jb29sZG93bjtcclxuXHRcdH1cclxuXHRcdHRoaXMuZGF0YV9yZW1haW5pbmcgPSAwO1xyXG5cdFx0aWYodHlwZW9mIG9wdGlvbnMuY2xpY2sgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHR0aGlzLmRhdGFfaGFuZGxlciA9IG9wdGlvbnMuY2xpY2s7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHZhciBlbCA9ICQoJzxkaXY+JylcclxuXHRcdFx0LmF0dHIoJ2lkJywgdHlwZW9mKG9wdGlvbnMuaWQpICE9ICd1bmRlZmluZWQnID8gb3B0aW9ucy5pZCA6IFwiQlROX1wiICsgRW5naW5lLmdldEd1aWQoKSlcclxuXHRcdFx0LmFkZENsYXNzKCdidXR0b24nKVxyXG5cdFx0XHQudGV4dCh0eXBlb2Yob3B0aW9ucy50ZXh0KSAhPSAndW5kZWZpbmVkJyA/IG9wdGlvbnMudGV4dCA6IFwiYnV0dG9uXCIpXHJcblx0XHRcdC5jbGljayhmdW5jdGlvbigpIHsgXHJcblx0XHRcdFx0aWYoISQodGhpcykuaGFzQ2xhc3MoJ2Rpc2FibGVkJykpIHtcclxuXHRcdFx0XHRcdEJ1dHRvbi5jb29sZG93bigkKHRoaXMpKTtcclxuXHRcdFx0XHRcdCQodGhpcykuZGF0YShcImhhbmRsZXJcIikoJCh0aGlzKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0XHQuZGF0YShcImhhbmRsZXJcIiwgIHR5cGVvZiBvcHRpb25zLmNsaWNrID09ICdmdW5jdGlvbicgPyBvcHRpb25zLmNsaWNrIDogZnVuY3Rpb24oKSB7IEVuZ2luZS5sb2coXCJjbGlja1wiKTsgfSlcclxuXHRcdFx0LmRhdGEoXCJyZW1haW5pbmdcIiwgMClcclxuXHRcdFx0LmRhdGEoXCJjb29sZG93blwiLCB0eXBlb2Ygb3B0aW9ucy5jb29sZG93biA9PSAnbnVtYmVyJyA/IG9wdGlvbnMuY29vbGRvd24gOiAwKTtcclxuXHRcdGlmIChvcHRpb25zLmltYWdlICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0ZWwuYXR0cihcInN0eWxlXCIsIFwiYmFja2dyb3VuZC1pbWFnZTogdXJsKFxcXCJcIiArIG9wdGlvbnMuaW1hZ2UgKyBcIlxcXCIpOyBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0OyBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyOyBoZWlnaHQ6IDE3MHB4OyBjb2xvcjogd2hpdGU7dGV4dC1zaGFkb3c6IDBweCAwcHggMnB4IGJsYWNrXCIpXHJcblx0XHR9XHJcblx0XHRlbC5hcHBlbmQoJChcIjxkaXY+XCIpLmFkZENsYXNzKCdjb29sZG93bicpKTtcclxuXHRcdFxyXG5cdFx0aWYob3B0aW9ucy5jb3N0KSB7XHJcblx0XHRcdHZhciB0dFBvcyA9IG9wdGlvbnMudHRQb3MgPyBvcHRpb25zLnR0UG9zIDogXCJib3R0b20gcmlnaHRcIjtcclxuXHRcdFx0dmFyIGNvc3RUb29sdGlwID0gJCgnPGRpdj4nKS5hZGRDbGFzcygndG9vbHRpcCAnICsgdHRQb3MpO1xyXG5cdFx0XHRmb3IodmFyIGsgaW4gb3B0aW9ucy5jb3N0KSB7XHJcblx0XHRcdFx0JChcIjxkaXY+XCIpLmFkZENsYXNzKCdyb3dfa2V5JykudGV4dChfKGspKS5hcHBlbmRUbyhjb3N0VG9vbHRpcCk7XHJcblx0XHRcdFx0JChcIjxkaXY+XCIpLmFkZENsYXNzKCdyb3dfdmFsJykudGV4dChvcHRpb25zLmNvc3Rba10pLmFwcGVuZFRvKGNvc3RUb29sdGlwKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjb3N0VG9vbHRpcC5jaGlsZHJlbigpLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRjb3N0VG9vbHRpcC5hcHBlbmRUbyhlbCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYob3B0aW9ucy53aWR0aCkge1xyXG5cdFx0XHRlbC5jc3MoJ3dpZHRoJywgb3B0aW9ucy53aWR0aCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBlbDtcclxuXHR9LFxyXG5cdFxyXG5cdHNldERpc2FibGVkOiBmdW5jdGlvbihidG4sIGRpc2FibGVkKSB7XHJcblx0XHRpZihidG4pIHtcclxuXHRcdFx0aWYoIWRpc2FibGVkICYmICFidG4uZGF0YSgnb25Db29sZG93bicpKSB7XHJcblx0XHRcdFx0YnRuLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHR9IGVsc2UgaWYoZGlzYWJsZWQpIHtcclxuXHRcdFx0XHRidG4uYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0YnRuLmRhdGEoJ2Rpc2FibGVkJywgZGlzYWJsZWQpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0aXNEaXNhYmxlZDogZnVuY3Rpb24oYnRuKSB7XHJcblx0XHRpZihidG4pIHtcclxuXHRcdFx0cmV0dXJuIGJ0bi5kYXRhKCdkaXNhYmxlZCcpID09PSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0sXHJcblx0XHJcblx0Y29vbGRvd246IGZ1bmN0aW9uKGJ0bikge1xyXG5cdFx0dmFyIGNkID0gYnRuLmRhdGEoXCJjb29sZG93blwiKTtcclxuXHRcdGlmKGNkID4gMCkge1xyXG5cdFx0XHQkKCdkaXYuY29vbGRvd24nLCBidG4pLnN0b3AodHJ1ZSwgdHJ1ZSkud2lkdGgoXCIxMDAlXCIpLmFuaW1hdGUoe3dpZHRoOiAnMCUnfSwgY2QgKiAxMDAwLCAnbGluZWFyJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIGIgPSAkKHRoaXMpLmNsb3Nlc3QoJy5idXR0b24nKTtcclxuXHRcdFx0XHRiLmRhdGEoJ29uQ29vbGRvd24nLCBmYWxzZSk7XHJcblx0XHRcdFx0aWYoIWIuZGF0YSgnZGlzYWJsZWQnKSkge1xyXG5cdFx0XHRcdFx0Yi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRidG4uYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdGJ0bi5kYXRhKCdvbkNvb2xkb3duJywgdHJ1ZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRjbGVhckNvb2xkb3duOiBmdW5jdGlvbihidG4pIHtcclxuXHRcdCQoJ2Rpdi5jb29sZG93bicsIGJ0bikuc3RvcCh0cnVlLCB0cnVlKTtcclxuXHRcdGJ0bi5kYXRhKCdvbkNvb2xkb3duJywgZmFsc2UpO1xyXG5cdFx0aWYoIWJ0bi5kYXRhKCdkaXNhYmxlZCcpKSB7XHJcblx0XHRcdGJ0bi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdH1cclxuXHR9XHJcbn07IiwiaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4uL2V2ZW50c1wiXHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCJcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCJcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4uL3BsYXllci9jaGFyYWN0ZXJcIlxyXG5cclxuZXhwb3J0IGNvbnN0IENhcHRhaW4gPSB7XHJcblx0dGFsa1RvQ2FwdGFpbjogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdUaGUgQ2FwdGFpblxcJ3MgVGVudCcpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlZW5GbGFnOiAoKSA9PiAkU00uZ2V0KCdPdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcpLFxyXG5cdFx0XHRcdFx0bmV4dFNjZW5lOiAnbWFpbicsXHJcblx0XHRcdFx0XHRvbkxvYWQ6ICgpID0+ICRTTS5zZXQoJ091dHBvc3QuY2FwdGFpbi5oYXZlTWV0JywgMSksXHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1lvdSBlbnRlciB0aGUgZmFuY2llc3QtbG9va2luZyB0ZW50IGluIHRoZSBPdXRwb3N0LiBBIGxhcmdlIG1hbiB3aXRoIGEgdG9vdGhicnVzaCBtdXN0YWNoZSBhbmQgYSBzZXZlcmUgZnJvd24gbG9va3MgdXAgZnJvbSBoaXMgZGVzay4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCJTaXIsIHlvdSBoYXZlIGVudGVyZWQgdGhlIHRlbnQgb2YgQ2FwdGFpbiBGaW5uZWFzLiBXaGF0IGJ1c2luZXNzIGRvIHlvdSBoYXZlIGhlcmU/XCInKVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXNrQWJvdXRTdXBwbGllcyc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FzayBBYm91dCBTdXBwbGllcycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTonYXNrQWJvdXRTdXBwbGllcyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6IENhcHRhaW4uaGFuZGxlU3VwcGxpZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGU6ICgpID0+ICEkU00uZ2V0KCdPdXRwb3N0LmNhcHRhaW4uYXNrZWRBYm91dFN1cHBsaWVzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Fza0Fib3V0Q2FwdGFpbic6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FzayBBYm91dCBDYXB0YWluJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOiAnY2FwdGFpblJhbWJsZSd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0xlYXZlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgJ21haW4nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdUaGUgQ2FwdGFpbiBncmVldHMgeW91IHdhcm1seS4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCJBaGgsIHllcywgd2VsY29tZSBiYWNrLiBXaGF0IGNhbiBJIGRvIGZvciB5b3U/XCInKVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXNrQWJvdXRTdXBwbGllcyc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FzayBBYm91dCBTdXBwbGllcycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTonYXNrQWJvdXRTdXBwbGllcyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6IENhcHRhaW4uaGFuZGxlU3VwcGxpZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGU6ICgpID0+ICEkU00uZ2V0KCdPdXRwb3N0LmNhcHRhaW4uYXNrZWRBYm91dFN1cHBsaWVzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Fza0Fib3V0Q2FwdGFpbic6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FzayBBYm91dCBDYXB0YWluJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOidjYXB0YWluUmFtYmxlJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnTGVhdmUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAnY2FwdGFpblJhbWJsZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1RoZSBDYXB0YWluXFwncyBleWVzIGdsZWFtIGF0IHRoZSBvcHBvcnR1bml0eSB0byBydW4gZG93biBoaXMgbGlzdCBvZiBhY2hpZXZlbWVudHMuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiV2h5LCBJXFwnbGwgaGF2ZSB5b3Uga25vdyB0aGF0IHlvdSBzdGFuZCBpbiB0aGUgcHJlc2VuY2Ugb2Ygbm9uZSBvdGhlciB0aGFuIEZpbm5lYXMgSi4gRm9ic2xleSwgQ2FwdGFpbiBvZiB0aGUgUm95YWwgQXJteVxcJ3MgRmlmdGggRGl2aXNpb24sIHRoZSBmaW5lc3QgRGl2aXNpb24gaW4gSGlzIE1hamVzdHlcXCdzIHNlcnZpY2UuXCInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnSGUgcHVmZnMgb3V0IGhpcyBjaGVzdCwgZHJhd2luZyBhdHRlbnRpb24gdG8gaGlzIG1hbnkgbWVkYWxzLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIkkgaGF2ZSBjYW1wYWlnbmVkIG9uIGJlaGFsZiBvZiBPdXIgTG9yZHNoaXAgYWNyb3NzIG1hbnkgbGFuZHMsIGluY2x1ZGluZyBUaGUgRmFyIFdlc3QsIHRoZSBub3J0aGVybiBib3JkZXJzIG9mIFVtYmVyc2hpcmUgYW5kIFBlbGluZ2FsLCBOZXcgQmVsbGlzaWEsIGFuZCBlYWNoIG9mIHRoZSBGaXZlIElzbGVzIG9mIHRoZSBQaXJyaGlhbiBTZWEuXCInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnSGUgcGF1c2VzIGZvciBhIG1vbWVudCwgcGVyaGFwcyB0byBzZWUgaWYgeW91IGFyZSBzdWl0YWJseSBpbXByZXNzZWQsIHRoZW4gY29udGludWVzLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIkFzIENhcHRhaW4gb2YgdGhlIEZpZnRoIERpdmlzaW9uLCBJIGhhZCB0aGUgZXN0ZWVtZWQgcHJpdmlsZWdlIG9mIGVuc3VyaW5nIHRoZSBzYWZldHkgb2YgdGhlc2UgbGFuZHMgZm9yIG91ciBmYWlyIGNpdGl6ZW5zLiBJIGhhdmUgYmVlbiBhd2FyZGVkIG1hbnkgdGltZXMgb3ZlciBmb3IgbXkgYnJhdmVyeSBpbiB0aGUgZmFjZSBvZiB1dG1vc3QgcGVyaWwuIEZvciBpbnN0YW5jZSwgZHVyaW5nIHRoZSBTZWEgQ2FtcGFpZ24gb24gVGh5cHBlLCBUaGlyZCBvZiB0aGUgRml2ZSBJc2xlcywgd2Ugd2VyZSBhbWJ1c2hlZCB3aGlsZSBkaXNlbWJhcmtpbmcgZnJvbSBvdXIgc2hpcC4gVGhpbmtpbmcgcXVpY2tseSwgSS4uLlwiJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1RoZSBjYXB0YWluIGNvbnRpbnVlcyB0byByYW1ibGUgbGlrZSB0aGlzIGZvciBzZXZlcmFsIG1vcmUgbWludXRlcywgZ2l2aW5nIHlvdSB0aW1lIHRvIGJlY29tZSBtdWNoIG1vcmUgZmFtaWxpYXIgd2l0aCB0aGUgZGlydCB1bmRlciB5b3VyIGZpbmdlcm5haWxzLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIi4uLiBhbmQgVEhBVCwgbXkgZ29vZCBhZHZlbnR1cmVyLCBpcyB3aHkgSSBhbHdheXMga2VlcCBmcmVzaCBiYXNpbCBvbiBoYW5kLlwiJylcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Zhc2NpbmF0aW5nJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnRmFzY2luYXRpbmcnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6J21haW5Db250aW51ZWQnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICdtYWluQ29udGludWVkJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnVGhlIENhcHRhaW4gc2h1ZmZsZXMgaGlzIHBhcGVycyBpbiBhIHNvbWV3aGF0IHBlcmZvcm1hdGl2ZSB3YXkuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiV2FzIHRoZXJlIHNvbWV0aGluZyBlbHNlIHlvdSBuZWVkZWQ/XCInKVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXNrQWJvdXRTdXBwbGllcyc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FzayBBYm91dCBTdXBwbGllcycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTonYXNrQWJvdXRTdXBwbGllcyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6IENhcHRhaW4uaGFuZGxlU3VwcGxpZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGU6ICgpID0+ICEkU00uZ2V0KCdPdXRwb3N0LmNhcHRhaW4uYXNrZWRBYm91dFN1cHBsaWVzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Fza0Fib3V0Q2FwdGFpbic6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FzayBBYm91dCBDYXB0YWluJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOidjYXB0YWluUmFtYmxlJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnTGVhdmUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAnYXNrQWJvdXRTdXBwbGllcyc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1RoZSBDYXB0YWluXFwncyBleWVzIGdsZWFtIHdpdGggYSBtaXh0dXJlIG9mIHJlYWxpemF0aW9uIGFuZCBndWlsdC4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCJBaGgsIHllcywgcmlnaHQsIHRoZSBzdXBwbGllcy4gSSBzdXBwb3NlIHRoZSBNYXlvciBpcyBzdGlsbCB3YWl0aW5nIGZvciB0aG9zZS4gSGF2ZSBhIGxvb2sgaW4gdGhhdCBjaGVzdCBvdmVyIHRoZXJlLCBpdCBzaG91bGQgaGF2ZSBldmVyeXRoaW5nIHlvdSBuZWVkLlwiJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ0hlIGluZGljYXRlcyB0byBhIGNoZXN0IGF0IHRoZSBiYWNrIG9mIHRoZSByb29tLiBZb3Ugb3BlbiB0aGUgbGlkLCByZXZlYWxpbmcgdGhlIHN1cHBsaWVzIHdpdGhpbi4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnWW91IHRha2UgdGhlIHN1cHBsaWVzLicpXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnR29vZCBTdHVmZicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcblxyXG4gICAgaGFuZGxlU3VwcGxpZXM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICRTTS5zZXQoJ091dHBvc3QuY2FwdGFpbi5hc2tlZEFib3V0U3VwcGxpZXMnLCAxKTtcclxuICAgICAgICBDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoXCJDYXB0YWluLnN1cHBsaWVzXCIpO1xyXG4gICAgICAgIENoYXJhY3Rlci5jaGVja1F1ZXN0U3RhdHVzKFwibWF5b3JTdXBwbGllc1wiKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IFZpbGxhZ2UgfSBmcm9tIFwiLi4vcGxhY2VzL3ZpbGxhZ2VcIjtcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4uL3BsYXllci9jaGFyYWN0ZXJcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBMaXogPSB7XHJcbiAgICBzZXRMaXpBY3RpdmU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0JFNNLnNldCgndmlsbGFnZS5saXpBY3RpdmUnLCAxKTtcclxuXHRcdCRTTS5zZXQoJ3ZpbGxhZ2UubGl6LmNhbkZpbmRCb29rJywgMCk7XHJcblx0XHQkU00uc2V0KCd2aWxsYWdlLmxpei5oYXNCb29rJywgMSk7XHJcblx0XHRWaWxsYWdlLnVwZGF0ZUJ1dHRvbigpO1xyXG5cdH0sXHJcblxyXG5cdHRhbGtUb0xpejogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdMaXpcXCdzIGhvdXNlLCBhdCB0aGUgZWRnZSBvZiB0b3duJyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHRzZWVuRmxhZzogKCkgPT4gJFNNLmdldCgndmlsbGFnZS5saXouaGF2ZU1ldCcpLFxyXG5cdFx0XHRcdFx0bmV4dFNjZW5lOiAnbWFpbicsXHJcblx0XHRcdFx0XHRvbkxvYWQ6ICgpID0+ICRTTS5zZXQoJ3ZpbGxhZ2UubGl6LmhhdmVNZXQnLCAxKSxcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnWW91IGVudGVyIHRoZSBidWlsZGluZyBhbmQgYXJlIGltbWVkaWF0ZWx5IHBsdW5nZWQgaW50byBhIGxhYnlyaW50aCBvZiBzaGVsdmVzIGhhcGhhemFyZGx5IGZpbGxlZCB3aXRoIGJvb2tzIG9mIGFsbCBraW5kcy4gQWZ0ZXIgYSBiaXQgb2Ygc2VhcmNoaW5nLCB5b3UgZmluZCBhIHNpZGUgcm9vbSB3aGVyZSBhIHdvbWFuIHdpdGggbW91c3kgaGFpciBhbmQgZ2xhc3NlcyBpcyBzaXR0aW5nIGF0IGEgd3JpdGluZyBkZXNrLiBTaGVcXCdzIHJlYWRpbmcgYSBsYXJnZSBib29rIHRoYXQgYXBwZWFycyB0byBpbmNsdWRlIGRpYWdyYW1zIG9mIHNvbWUgc29ydCBvZiBwbGFudC4gU2hlIGxvb2tzIHVwIGFzIHlvdSBlbnRlciB0aGUgcm9vbS4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJXaG8gdGhlIGhlbGwgYXJlIHlvdT9cIicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnYXNrQWJvdXRUb3duJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBhYm91dCBDaGFkdG9waWEnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnY2hhZHRvcGlhUmFtYmxlJ31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J3F1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBmb3IgYSBxdWVzdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdxdWVzdFJlcXVlc3QnfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnbGVhdmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnTGVhdmUnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdjaGFkdG9waWFSYW1ibGUnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ0xpeiBsb29rcyBhdCB5b3UgZm9yIGEgbW9tZW50IGJlZm9yZSByZXR1cm5pbmcgaGVyIGdhemUgdG8gdGhlIGJvb2sgaW4gZnJvbnQgb2YgaGVyLicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIlRoZXJlXFwncyBhIGJvb2sgaW4gaGVyZSBzb21ld2hlcmUgYWJvdXQgdGhlIGZvdW5kaW5nIG9mIENoYWR0b3BpYS4gSWYgeW91IGNhbiBmaW5kIGl0LCB5b3VcXCdyZSBmcmVlIHRvIGJvcnJvdyBpdC5cIicpXSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J29rYXknOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnT2theSwgdGhlbi4nKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnbWFpbid9LFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiAoKSA9PiAkU00uc2V0KCd2aWxsYWdlLmxpei5jYW5GaW5kQm9vaycsIHRydWUpXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cclxuXHRcdFx0XHQnbWFpbic6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtfKCdMaXogc2VlbXMgZGV0ZXJtaW5lZCBub3QgdG8gcGF5IGF0dGVudGlvbiB0byB5b3UuJyldLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnYXNrQWJvdXRUb3duJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBhYm91dCBDaGFkdG9waWEnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnY2hhZHRvcGlhUmFtYmxlJ30sXHJcblx0XHRcdFx0XHRcdFx0YXZhaWxhYmxlOiAoKSA9PiAhJFNNLmdldCgndmlsbGFnZS5saXouY2FuRmluZEJvb2snKVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQncXVlc3QnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGZvciBhIHF1ZXN0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ3F1ZXN0UmVxdWVzdCd9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdmaW5kQm9vayc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdUcnkgdG8gZmluZCB0aGUgYm9vaycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdmaW5kQm9vayd9LFxyXG5cdFx0XHRcdFx0XHRcdC8vIFRPRE86IGEgXCJ2aXNpYmxlXCIgZmxhZyB3b3VsZCBiZSBnb29kIGhlcmUsIGZvciBzaXR1YXRpb25zIHdoZXJlIGFuIG9wdGlvblxyXG5cdFx0XHRcdFx0XHRcdC8vICAgaXNuJ3QgeWV0IGtub3duIHRvIHRoZSBwbGF5ZXJcclxuXHRcdFx0XHRcdFx0XHR2aXNpYmxlOiAoKSA9PiAkU00uZ2V0KCd2aWxsYWdlLmxpei5jYW5GaW5kQm9vaycpLFxyXG5cdFx0XHRcdFx0XHRcdGF2YWlsYWJsZTogKCkgPT4gKCRTTS5nZXQoJ3ZpbGxhZ2UubGl6LmNhbkZpbmRCb29rJykgYXMgbnVtYmVyID4gMCkgJiYgKCRTTS5nZXQoJ3ZpbGxhZ2UubGl6Lmhhc0Jvb2snKSlcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0xlYXZlJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnZmluZEJvb2snOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ0xlYXZpbmcgTGl6IHRvIGhlciBidXNpbmVzcywgeW91IHdhbmRlciBhcm91bmQgYW1pZHN0IHRoZSBib29rcywgd29uZGVyaW5nIGhvdyB5b3VcXCdsbCBldmVyIG1hbmFnZSB0byBmaW5kIHdoYXQgeW91XFwncmUgbG9va2luZyBmb3IgaW4gYWxsIHRoaXMgdW5vcmdhbml6ZWQgbWVzcy4nKSxcclxuXHRcdFx0XHRcdFx0XygnRm9ydHVuYXRlbHksIHRoZSBjcmVhdG9yIG9mIHRoaXMgZ2FtZSBkb2VzblxcJ3QgZmVlbCBsaWtlIGl0XFwnZCBiZSB2ZXJ5IGludGVyZXN0aW5nIHRvIG1ha2UgdGhpcyBpbnRvIGEgcHV6emxlLCBzbyB5b3Ugc3BvdCB0aGUgYm9vayBvbiBhIG5lYXJieSBzaGVsZiBhbmQgZ3JhYiBpdC4nKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J3NpY2snOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnT2gsIHNpY2snKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiAoKSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyAkU00uc2V0KCdzdG9yZXMuV2VpcmQgQm9vaycsIDEpO1xyXG5cdFx0XHRcdFx0XHRcdFx0Q2hhcmFjdGVyLmFkZFRvSW52ZW50b3J5KFwiTGl6LndlaXJkQm9va1wiKTtcclxuXHRcdFx0XHRcdFx0XHRcdCRTTS5zZXQoJ3ZpbGxhZ2UubGl6Lmhhc0Jvb2snLCAwKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdxdWVzdFJlcXVlc3QnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ0xpeiBsZXRzIG91dCBhbiBhbm5veWVkIHNpZ2guJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiT2ggYnJhdmUgYWR2ZW50dXJlciwgSSBzZWVtIHRvIGhhdmUgbG9zdCBteSBwYXRpZW5jZS4gV2hlbiBsYXN0IEkgc2F3IGl0LCBpdCB3YXMgc29tZXdoZXJlIG91dHNpZGUgb2YgdGhpcyBidWlsZGluZy4gV291bGRzdCB0aG91IHJlY292ZXIgdGhhdCB3aGljaCBoYXMgYmVlbiBzdG9sZW4gZnJvbSBtZT9cIicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnb2theSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdPa2F5LCBqZWV6LCBJIGdldCBpdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdtYWluJ31cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG59IiwiaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgTGl6IH0gZnJvbSBcIi4vbGl6XCI7XHJcbmltcG9ydCB7IFJvYWQgfSBmcm9tIFwiLi4vcGxhY2VzL3JvYWRcIjtcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4uL3BsYXllci9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IHsgVmlsbGFnZSB9IGZyb20gXCIuLi9wbGFjZXMvdmlsbGFnZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IE1heW9yID0ge1xyXG4gICAgdGFsa1RvTWF5b3I6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnTWVldCB0aGUgTWF5b3InKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuXHRcdFx0XHRcdHNlZW5GbGFnOiAoKSA9PiAkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVNZXQnKSxcclxuXHRcdFx0XHRcdG5leHRTY2VuZTogJ21haW4nLFxyXG5cdFx0XHRcdFx0b25Mb2FkOiAoKSA9PiAkU00uc2V0KCd2aWxsYWdlLm1heW9yLmhhdmVNZXQnLCAxKSxcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnVGhlIG1heW9yIHNtaWxlcyBhdCB5b3UgYW5kIHNheXM6JyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiV2VsY29tZSB0byBDaGFkdG9waWEsIElcXCdtIHRoZSBtYXlvciBvZiB0aGVzZSBoZXJlIHBhcnRzLiBXaGF0IGNhbiBJIGRvIHlvdSBmb3I/XCInKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2Fza0Fib3V0VG93bic6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgYWJvdXQgQ2hhZHRvcGlhJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2NoYWR0b3BpYVJhbWJsZSd9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdxdWVzdCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgZm9yIGEgcXVlc3QnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAncXVlc3QnfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnbGVhdmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnTGVhdmUnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdjaGFkdG9waWFSYW1ibGUnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1RoZSBtYXlvciBwdXNoZXMgdGhlIGJyaW0gb2YgaGlzIGhhdCB1cC4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJXZWxsLCB3ZVxcJ3ZlIGFsd2F5cyBiZWVuIGhlcmUsIGxvbmcgYXMgSSBjYW4gcmVtZW1iZXIuIEkgdG9vayBvdmVyIGFmdGVyIHRoZSBsYXN0IG1heW9yIGRpZWQsIGJ1dCBoZSB3b3VsZCBoYXZlIGJlZW4gdGhlIG9ubHkgcGVyc29uIHdpdGggYW55IGhpc3RvcmljYWwga25vd2xlZGdlIG9mIHRoaXMgdmlsbGFnZS5cIicpLFxyXG5cdFx0XHRcdFx0XHRfKCdIZSBwYXVzZXMgZm9yIGEgbW9tZW50IGFuZCB0b3VzbGVzIHNvbWUgb2YgdGhlIHdpc3B5IGhhaXJzIHRoYXQgaGF2ZSBwb2tlZCBvdXQgZnJvbSB1bmRlciB0aGUgcmFpc2VkIGhhdC4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJBY3R1YWxseSwgeW91IG1pZ2h0IGFzayBMaXosIHNoZSBoYXMgYSBidW5jaCBvZiBoZXIgbW90aGVyXFwncyBib29rcyBmcm9tIHdheSBiYWNrIHdoZW4uIFNoZSBsaXZlcyBhdCB0aGUgZWRnZSBvZiB0b3duLlwiJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdva2F5Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ09rYXksIHRoZW4uJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ21haW4nfSxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogTGl6LnNldExpekFjdGl2ZVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnbWFpbic6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnVGhlIG1heW9yIHNheXM6JyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiQW55d2F5LCB3aGF0IEVMU0UgY2FuIEkgZG8geW91IGZvcj9cIicpLFxyXG5cdFx0XHRcdFx0XHRfKCdIZSBjaHVja2xlcyBhdCBoaXMgY2xldmVyIHVzZSBvZiBsYW5ndWFnZS4nKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2Fza0Fib3V0VG93bic6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgYWJvdXQgQ2hhZHRvcGlhJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2NoYWR0b3BpYVJhbWJsZSd9LFxyXG5cdFx0XHRcdFx0XHRcdC8vIGltYWdlOiBcImFzc2V0cy9jYXJkcy9saXR0bGVfd29sZi5wbmdcIlxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQncXVlc3QnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGZvciBhIHF1ZXN0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ3F1ZXN0J30sXHJcblx0XHRcdFx0XHRcdFx0YXZhaWxhYmxlOiAoKSA9PlxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gbm90IGF2YWlsYWJsZSBpZiBtYXlvclN1cHBsaWVzIGlzIGluLXByb2dyZXNzXHJcblx0XHRcdFx0XHRcdFx0XHQoQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW1wibWF5b3JTdXBwbGllc1wiXSA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gcmUtYWRkIHRoaXMgY29uZGl0aW9uIGxhdGVyLCB3ZSBuZWVkIHRvIHNlbmQgdGhlbSB0byBhIGRpZmZlcmVudFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gICBxdWVzdCBkaWFsb2cgaWYgdGhleSBhbHJlYWR5IGRpZCB0aGUgZmlyc3QgcXVlc3RcclxuXHRcdFx0XHRcdFx0XHRcdC8vIHx8IChDaGFyYWN0ZXIucXVlc3RTdGF0dXNbXCJtYXlvclN1cHBsaWVzXCJdID09IC0xKVxyXG5cdFx0XHRcdFx0XHRcdC8vIGltYWdlOiBcImFzc2V0cy9jYXJkcy9qb2tlci5wbmdcIlxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnZ2l2ZVN1cHBsaWVzJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0hhbmQgb3ZlciB0aGUgc3VwcGxpZXMnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnZ2l2ZVN1cHBsaWVzJ30sXHJcblx0XHRcdFx0XHRcdFx0YXZhaWxhYmxlOiAoKSA9PiBcclxuXHRcdFx0XHRcdFx0XHRcdCgkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykgPT09IHVuZGVmaW5lZCkgXHJcblx0XHRcdFx0XHRcdFx0XHQmJiAoQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW1wibWF5b3JTdXBwbGllc1wiXSAhPT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRcdFx0XHRcdFx0JiYgQ2hhcmFjdGVyLmludmVudG9yeVtcIkNhcHRhaW4uc3VwcGxpZXNcIl0sXHJcblx0XHRcdFx0XHRcdFx0dmlzaWJsZTogKCkgPT5cclxuXHRcdFx0XHRcdFx0XHRcdChDaGFyYWN0ZXIucXVlc3RTdGF0dXNbXCJtYXlvclN1cHBsaWVzXCJdICE9PSB1bmRlZmluZWQpLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiAoKSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0XHRDaGFyYWN0ZXIucmVtb3ZlRnJvbUludmVudG9yeShcIkNhcHRhaW4uc3VwcGxpZXNcIik7XHJcblx0XHRcdFx0XHRcdFx0XHQkU00uc2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJywgMSk7XHJcblx0XHRcdFx0XHRcdFx0XHRDaGFyYWN0ZXIuY2hlY2tRdWVzdFN0YXR1cyhcIm1heW9yU3VwcGxpZXNcIik7XHJcblx0XHRcdFx0XHRcdFx0XHRWaWxsYWdlLnVwZGF0ZUJ1dHRvbigpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0xlYXZlJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHQvLyBpbWFnZTogXCJhc3NldHMvY2FyZHMvcmF2ZW4ucG5nXCJcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J3F1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdUaGUgbWF5b3IgdGhpbmtzIGZvciBhIG1vbWVudC4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJZb3Uga25vdywgaXRcXCdzIGJlZW4gYSB3aGlsZSBzaW5jZSBvdXIgbGFzdCBzaGlwbWVudCBvZiBzdXBwbGllcyBhcnJpdmVkIGZyb20gdGhlIE91dHBvc3QuIE1pbmQgbG9va2luZyBpbnRvIHRoYXQgZm9yIHVzP1wiJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiWW91IGNhbiBhc2sgYWJvdXQgaXQgYXQgdGhlIG91dHBvc3QsIG9yIGp1c3Qgd2FuZGVyIGFyb3VuZCBvbiB0aGUgcm9hZCBhbmQgc2VlIGlmIHlvdSBmaW5kIGFueSBjbHVlcy4gRWl0aGVyIHdheSwgaXRcXCdzIHRpbWUgdG8gaGl0IHRoZSByb2FkLCBhZHZlbnR1cmVyIVwiJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdhbHJpZ2h0eSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBbHJpZ2h0eScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdtYWluJ30sXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IE1heW9yLnN0YXJ0U3VwcGxpZXNRdWVzdFxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnZ2l2ZVN1cHBsaWVzJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdUaGUgbWF5b3Igc21pbGVzLCBhbmQgdGhlIGVkZ2VzIG9mIGhpcyBleWVzIGNyaW5rbGUuJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiVGhhbmsgeW91LCBicmF2ZSBhZHZlbnR1cmVyISBXaXRoIHRoZXNlIHN1cHBsaWVzLCB0aGUgdmlsbGFnZSBjYW4gb25jZSBhZ2FpbiB0aHJpdmUuXCInKSxcclxuXHRcdFx0XHRcdFx0XygnSGUgdGFrZXMgdGhlbSBmcm9tIHlvdSBncmFjaW91c2x5LCBhbmQgcHJvbXB0bHkgaGFuZHMgdGhlbSBvZmYgdG8gc29tZSB3b3JrZXJzLCB3aG8gcXVpY2tseSBlcmVjdCBhIGJ1aWxkaW5nIHRoYXQgZ2l2ZXMgeW91IGEgbmV3IGJ1dHRvbiB0byBjbGljaycpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnaW1wcmVzc2l2ZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdJbXByZXNzaXZlIScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRzdGFydFN1cHBsaWVzUXVlc3Q6IGZ1bmN0aW9uICgpIHtcclxuXHRcdC8vIGlmICghJFNNLmdldCgncXVlc3Quc3VwcGxpZXMnKSkge1xyXG5cdFx0Ly8gXHQvLyAxID0gc3RhcnRlZCwgMiA9IG5leHQgc3RlcCwgZXRjLiB1bnRpbCBjb21wbGV0ZWRcclxuXHRcdC8vIFx0JFNNLnNldCgncXVlc3Quc3VwcGxpZXMnLCAxKTtcclxuXHRcdC8vIFx0Um9hZC5pbml0KCk7XHJcblx0XHQvLyB9XHJcblx0XHRpZiAoQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW1wibWF5b3JTdXBwbGllc1wiXSA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdENoYXJhY3Rlci5zZXRRdWVzdFN0YXR1cyhcIm1heW9yU3VwcGxpZXNcIiwgMCk7XHJcblx0XHRcdFJvYWQuaW5pdCgpO1xyXG5cdFx0fVxyXG5cdH1cclxufSIsIi8vIEB0cy1ub2NoZWNrXHJcblxyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBOb3RpZmljYXRpb25zIH0gZnJvbSBcIi4vbm90aWZpY2F0aW9uc1wiO1xyXG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgVmlsbGFnZSB9IGZyb20gXCIuL3BsYWNlcy92aWxsYWdlXCI7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuL3BsYXllci9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IHsgV2VhdGhlciB9IGZyb20gXCIuL3dlYXRoZXJcIjtcclxuaW1wb3J0IHsgUm9hZCB9IGZyb20gXCIuL3BsYWNlcy9yb2FkXCI7XHJcbmltcG9ydCB7IE91dHBvc3QgfSBmcm9tIFwiLi9wbGFjZXMvb3V0cG9zdFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEVuZ2luZSA9IHdpbmRvdy5FbmdpbmUgPSB7XHJcblx0XHJcblx0U0lURV9VUkw6IGVuY29kZVVSSUNvbXBvbmVudChcImh0dHBzOi8vY2dpYmJzLmdpdGh1Yi5pby9kYXJrcm9vbV9tb2QvaW5kZXguaHRtbFwiKSxcclxuXHRWRVJTSU9OOiAxLjMsXHJcblx0TUFYX1NUT1JFOiA5OTk5OTk5OTk5OTk5OSxcclxuXHRTQVZFX0RJU1BMQVk6IDMwICogMTAwMCxcclxuXHRHQU1FX09WRVI6IGZhbHNlLFxyXG5cdFxyXG5cdC8vb2JqZWN0IGV2ZW50IHR5cGVzXHJcblx0dG9waWNzOiB7fSxcclxuXHRcclxuXHRvcHRpb25zOiB7XHJcblx0XHRzdGF0ZTogbnVsbCxcclxuXHRcdGRlYnVnOiB0cnVlLFxyXG5cdFx0bG9nOiB0cnVlLFxyXG5cdFx0ZHJvcGJveDogZmFsc2UsXHJcblx0XHRkb3VibGVUaW1lOiBmYWxzZVxyXG5cdH0sXHJcblxyXG5cdF9kZWJ1ZzogZmFsc2UsXHJcblx0XHRcclxuXHRpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHRcdHRoaXMuX2RlYnVnID0gdGhpcy5vcHRpb25zLmRlYnVnO1xyXG5cdFx0dGhpcy5fbG9nID0gdGhpcy5vcHRpb25zLmxvZztcclxuXHRcdFxyXG5cdFx0Ly8gQ2hlY2sgZm9yIEhUTUw1IHN1cHBvcnRcclxuXHRcdGlmKCFFbmdpbmUuYnJvd3NlclZhbGlkKCkpIHtcclxuXHRcdFx0d2luZG93LmxvY2F0aW9uID0gJ2Jyb3dzZXJXYXJuaW5nLmh0bWwnO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBDaGVjayBmb3IgbW9iaWxlXHJcblx0XHRpZihFbmdpbmUuaXNNb2JpbGUoKSkge1xyXG5cdFx0XHR3aW5kb3cubG9jYXRpb24gPSAnbW9iaWxlV2FybmluZy5odG1sJztcclxuXHRcdH1cclxuXHJcblx0XHRFbmdpbmUuZGlzYWJsZVNlbGVjdGlvbigpO1xyXG5cdFx0XHJcblx0XHRpZih0aGlzLm9wdGlvbnMuc3RhdGUgIT0gbnVsbCkge1xyXG5cdFx0XHR3aW5kb3cuU3RhdGUgPSB0aGlzLm9wdGlvbnMuc3RhdGU7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRFbmdpbmUubG9hZEdhbWUoKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdsb2NhdGlvblNsaWRlcicpLmFwcGVuZFRvKCcjbWFpbicpO1xyXG5cclxuXHRcdHZhciBtZW51ID0gJCgnPGRpdj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21lbnUnKVxyXG5cdFx0XHQuYXBwZW5kVG8oJ2JvZHknKTtcclxuXHJcblx0XHRpZih0eXBlb2YgbGFuZ3MgIT0gJ3VuZGVmaW5lZCcpe1xyXG5cdFx0XHR2YXIgY3VzdG9tU2VsZWN0ID0gJCgnPHNwYW4+JylcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ2N1c3RvbVNlbGVjdCcpXHJcblx0XHRcdFx0LmFkZENsYXNzKCdtZW51QnRuJylcclxuXHRcdFx0XHQuYXBwZW5kVG8obWVudSk7XHJcblx0XHRcdHZhciBzZWxlY3RPcHRpb25zID0gJCgnPHNwYW4+JylcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ2N1c3RvbVNlbGVjdE9wdGlvbnMnKVxyXG5cdFx0XHRcdC5hcHBlbmRUbyhjdXN0b21TZWxlY3QpO1xyXG5cdFx0XHR2YXIgb3B0aW9uc0xpc3QgPSAkKCc8dWw+JylcclxuXHRcdFx0XHQuYXBwZW5kVG8oc2VsZWN0T3B0aW9ucyk7XHJcblx0XHRcdCQoJzxsaT4nKVxyXG5cdFx0XHRcdC50ZXh0KFwibGFuZ3VhZ2UuXCIpXHJcblx0XHRcdFx0LmFwcGVuZFRvKG9wdGlvbnNMaXN0KTtcclxuXHRcdFx0XHJcblx0XHRcdCQuZWFjaChsYW5ncywgZnVuY3Rpb24obmFtZSxkaXNwbGF5KXtcclxuXHRcdFx0XHQkKCc8bGk+JylcclxuXHRcdFx0XHRcdC50ZXh0KGRpc3BsYXkpXHJcblx0XHRcdFx0XHQuYXR0cignZGF0YS1sYW5ndWFnZScsIG5hbWUpXHJcblx0XHRcdFx0XHQub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHsgRW5naW5lLnN3aXRjaExhbmd1YWdlKHRoaXMpOyB9KVxyXG5cdFx0XHRcdFx0LmFwcGVuZFRvKG9wdGlvbnNMaXN0KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0JCgnPHNwYW4+JylcclxuXHRcdFx0LmFkZENsYXNzKCdsaWdodHNPZmYgbWVudUJ0bicpXHJcblx0XHRcdC50ZXh0KF8oJ2xpZ2h0cyBvZmYuJykpXHJcblx0XHRcdC5jbGljayhFbmdpbmUudHVybkxpZ2h0c09mZilcclxuXHRcdFx0LmFwcGVuZFRvKG1lbnUpO1xyXG5cclxuXHRcdCQoJzxzcGFuPicpXHJcblx0XHRcdC5hZGRDbGFzcygnbWVudUJ0bicpXHJcblx0XHRcdC50ZXh0KF8oJ2h5cGVyLicpKVxyXG5cdFx0XHQuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRFbmdpbmUub3B0aW9ucy5kb3VibGVUaW1lID0gIUVuZ2luZS5vcHRpb25zLmRvdWJsZVRpbWU7XHJcblx0XHRcdFx0aWYoRW5naW5lLm9wdGlvbnMuZG91YmxlVGltZSlcclxuXHRcdFx0XHRcdCQodGhpcykudGV4dChfKCdjbGFzc2ljLicpKTtcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHQkKHRoaXMpLnRleHQoXygnaHlwZXIuJykpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQuYXBwZW5kVG8obWVudSk7XHJcblxyXG5cdFx0JCgnPHNwYW4+JylcclxuXHRcdFx0LmFkZENsYXNzKCdtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygncmVzdGFydC4nKSlcclxuXHRcdFx0LmNsaWNrKEVuZ2luZS5jb25maXJtRGVsZXRlKVxyXG5cdFx0XHQuYXBwZW5kVG8obWVudSk7XHJcblx0XHRcclxuXHRcdCQoJzxzcGFuPicpXHJcblx0XHRcdC5hZGRDbGFzcygnbWVudUJ0bicpXHJcblx0XHRcdC50ZXh0KF8oJ3NoYXJlLicpKVxyXG5cdFx0XHQuY2xpY2soRW5naW5lLnNoYXJlKVxyXG5cdFx0XHQuYXBwZW5kVG8obWVudSk7XHJcblxyXG5cdFx0JCgnPHNwYW4+JylcclxuXHRcdFx0LmFkZENsYXNzKCdtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygnc2F2ZS4nKSlcclxuXHRcdFx0LmNsaWNrKEVuZ2luZS5leHBvcnRJbXBvcnQpXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHRcclxuXHRcdC8vIHN1YnNjcmliZSB0byBzdGF0ZVVwZGF0ZXNcclxuXHRcdCQuRGlzcGF0Y2goJ3N0YXRlVXBkYXRlJykuc3Vic2NyaWJlKEVuZ2luZS5oYW5kbGVTdGF0ZVVwZGF0ZXMpO1xyXG5cclxuXHRcdCRTTS5pbml0KCk7XHJcblx0XHROb3RpZmljYXRpb25zLmluaXQoKTtcclxuXHRcdEV2ZW50cy5pbml0KCk7XHJcblx0XHRWaWxsYWdlLmluaXQoKTtcclxuXHRcdENoYXJhY3Rlci5pbml0KCk7XHJcblx0XHRXZWF0aGVyLmluaXQoKTtcclxuXHRcdGlmKCRTTS5nZXQoJ1JvYWQub3BlbicpKSB7XHJcblx0XHRcdFJvYWQuaW5pdCgpO1xyXG5cdFx0fVxyXG5cdFx0aWYoJFNNLmdldCgnT3V0cG9zdC5vcGVuJykpIHtcclxuXHRcdFx0T3V0cG9zdC5pbml0KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0RW5naW5lLnNhdmVMYW5ndWFnZSgpO1xyXG5cdFx0RW5naW5lLnRyYXZlbFRvKFZpbGxhZ2UpO1xyXG5cclxuXHR9LFxyXG5cdFxyXG5cdGJyb3dzZXJWYWxpZDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKCBsb2NhdGlvbi5zZWFyY2guaW5kZXhPZiggJ2lnbm9yZWJyb3dzZXI9dHJ1ZScgKSA+PSAwIHx8ICggdHlwZW9mIFN0b3JhZ2UgIT0gJ3VuZGVmaW5lZCcgJiYgIW9sZElFICkgKTtcclxuXHR9LFxyXG5cdFxyXG5cdGlzTW9iaWxlOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAoIGxvY2F0aW9uLnNlYXJjaC5pbmRleE9mKCAnaWdub3JlYnJvd3Nlcj10cnVlJyApIDwgMCAmJiAvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnkvaS50ZXN0KCBuYXZpZ2F0b3IudXNlckFnZW50ICkgKTtcclxuXHR9LFxyXG5cdFxyXG5cdHNhdmVHYW1lOiBmdW5jdGlvbigpIHtcclxuXHRcdGlmKHR5cGVvZiBTdG9yYWdlICE9ICd1bmRlZmluZWQnICYmIGxvY2FsU3RvcmFnZSkge1xyXG5cdFx0XHRpZihFbmdpbmUuX3NhdmVUaW1lciAhPSBudWxsKSB7XHJcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KEVuZ2luZS5fc2F2ZVRpbWVyKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih0eXBlb2YgRW5naW5lLl9sYXN0Tm90aWZ5ID09ICd1bmRlZmluZWQnIHx8IERhdGUubm93KCkgLSBFbmdpbmUuX2xhc3ROb3RpZnkgPiBFbmdpbmUuU0FWRV9ESVNQTEFZKXtcclxuXHRcdFx0XHQkKCcjc2F2ZU5vdGlmeScpLmNzcygnb3BhY2l0eScsIDEpLmFuaW1hdGUoe29wYWNpdHk6IDB9LCAxMDAwLCAnbGluZWFyJyk7XHJcblx0XHRcdFx0RW5naW5lLl9sYXN0Tm90aWZ5ID0gRGF0ZS5ub3coKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRsb2NhbFN0b3JhZ2UuZ2FtZVN0YXRlID0gSlNPTi5zdHJpbmdpZnkoU3RhdGUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0bG9hZEdhbWU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dmFyIHNhdmVkU3RhdGUgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nYW1lU3RhdGUpO1xyXG5cdFx0XHRpZihzYXZlZFN0YXRlKSB7XHJcblx0XHRcdFx0d2luZG93LlN0YXRlID0gc2F2ZWRTdGF0ZTtcclxuXHRcdFx0XHRFbmdpbmUubG9nKFwibG9hZGVkIHNhdmUhXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGNhdGNoKGUpIHtcclxuXHRcdFx0RW5naW5lLmxvZyhlKTtcclxuXHRcdFx0d2luZG93LlN0YXRlID0ge307XHJcblx0XHRcdCRTTS5zZXQoJ3ZlcnNpb24nLCBFbmdpbmUuVkVSU0lPTik7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRleHBvcnRJbXBvcnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnRXhwb3J0IC8gSW1wb3J0JyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ2V4cG9ydCBvciBpbXBvcnQgc2F2ZSBkYXRhLCBmb3IgYmFja2luZyB1cCcpLFxyXG5cdFx0XHRcdFx0XHRfKCdvciBtaWdyYXRpbmcgY29tcHV0ZXJzJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdleHBvcnQnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnZXhwb3J0JyksXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IEVuZ2luZS5leHBvcnQ2NFxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnaW1wb3J0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2ltcG9ydCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdjb25maXJtJ31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2NhbmNlbCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdjYW5jZWwnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdjb25maXJtJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdhcmUgeW91IHN1cmU/JyksXHJcblx0XHRcdFx0XHRcdF8oJ2lmIHRoZSBjb2RlIGlzIGludmFsaWQsIGFsbCBkYXRhIHdpbGwgYmUgbG9zdC4nKSxcclxuXHRcdFx0XHRcdFx0XygndGhpcyBpcyBpcnJldmVyc2libGUuJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCd5ZXMnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygneWVzJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2lucHV0SW1wb3J0J30sXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IEVuZ2luZS5lbmFibGVTZWxlY3Rpb25cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J25vJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ25vJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnaW5wdXRJbXBvcnQnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXygncHV0IHRoZSBzYXZlIGNvZGUgaGVyZS4nKV0sXHJcblx0XHRcdFx0XHR0ZXh0YXJlYTogJycsXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdva2F5Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2ltcG9ydCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IEVuZ2luZS5pbXBvcnQ2NFxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnY2FuY2VsJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2NhbmNlbCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0Z2VuZXJhdGVFeHBvcnQ2NDogZnVuY3Rpb24oKXtcclxuXHRcdHZhciBzdHJpbmc2NCA9IEJhc2U2NC5lbmNvZGUobG9jYWxTdG9yYWdlLmdhbWVTdGF0ZSk7XHJcblx0XHRzdHJpbmc2NCA9IHN0cmluZzY0LnJlcGxhY2UoL1xccy9nLCAnJyk7XHJcblx0XHRzdHJpbmc2NCA9IHN0cmluZzY0LnJlcGxhY2UoL1xcLi9nLCAnJyk7XHJcblx0XHRzdHJpbmc2NCA9IHN0cmluZzY0LnJlcGxhY2UoL1xcbi9nLCAnJyk7XHJcblxyXG5cdFx0cmV0dXJuIHN0cmluZzY0O1xyXG5cdH0sXHJcblxyXG5cdGV4cG9ydDY0OiBmdW5jdGlvbigpIHtcclxuXHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0dmFyIHN0cmluZzY0ID0gRW5naW5lLmdlbmVyYXRlRXhwb3J0NjQoKTtcclxuXHRcdEVuZ2luZS5lbmFibGVTZWxlY3Rpb24oKTtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ0V4cG9ydCcpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0dGV4dDogW18oJ3NhdmUgdGhpcy4nKV0sXHJcblx0XHRcdFx0XHR0ZXh0YXJlYTogc3RyaW5nNjQsXHJcblx0XHRcdFx0XHRyZWFkb25seTogdHJ1ZSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2RvbmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnZ290IGl0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogRW5naW5lLmRpc2FibGVTZWxlY3Rpb25cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRFbmdpbmUuYXV0b1NlbGVjdCgnI2Rlc2NyaXB0aW9uIHRleHRhcmVhJyk7XHJcblx0fSxcclxuXHJcblx0aW1wb3J0NjQ6IGZ1bmN0aW9uKHN0cmluZzY0KSB7XHJcblx0XHRFbmdpbmUuZGlzYWJsZVNlbGVjdGlvbigpO1xyXG5cdFx0c3RyaW5nNjQgPSBzdHJpbmc2NC5yZXBsYWNlKC9cXHMvZywgJycpO1xyXG5cdFx0c3RyaW5nNjQgPSBzdHJpbmc2NC5yZXBsYWNlKC9cXC4vZywgJycpO1xyXG5cdFx0c3RyaW5nNjQgPSBzdHJpbmc2NC5yZXBsYWNlKC9cXG4vZywgJycpO1xyXG5cdFx0dmFyIGRlY29kZWRTYXZlID0gQmFzZTY0LmRlY29kZShzdHJpbmc2NCk7XHJcblx0XHRsb2NhbFN0b3JhZ2UuZ2FtZVN0YXRlID0gZGVjb2RlZFNhdmU7XHJcblx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcclxuXHR9LFxyXG5cclxuXHRjb25maXJtRGVsZXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ1Jlc3RhcnQ/JyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXygncmVzdGFydCB0aGUgZ2FtZT8nKV0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCd5ZXMnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygneWVzJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogRW5naW5lLmRlbGV0ZVNhdmVcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J25vJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ25vJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRkZWxldGVTYXZlOiBmdW5jdGlvbihub1JlbG9hZCkge1xyXG5cdFx0aWYodHlwZW9mIFN0b3JhZ2UgIT0gJ3VuZGVmaW5lZCcgJiYgbG9jYWxTdG9yYWdlKSB7XHJcblx0XHRcdHdpbmRvdy5TdGF0ZSA9IHt9O1xyXG5cdFx0XHRsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcclxuXHRcdH1cclxuXHRcdGlmKCFub1JlbG9hZCkge1xyXG5cdFx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRzaGFyZTogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdTaGFyZScpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0dGV4dDogW18oJ2JyaW5nIHlvdXIgZnJpZW5kcy4nKV0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdmYWNlYm9vayc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdmYWNlYm9vaycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0d2luZG93Lm9wZW4oJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9zaGFyZXIvc2hhcmVyLnBocD91PScgKyBFbmdpbmUuU0lURV9VUkwsICdzaGFyZXInLCAnd2lkdGg9NjI2LGhlaWdodD00MzYsbG9jYXRpb249bm8sbWVudWJhcj1ubyxyZXNpemFibGU9bm8sc2Nyb2xsYmFycz1ubyxzdGF0dXM9bm8sdG9vbGJhcj1ubycpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2dvb2dsZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0Ol8oJ2dvb2dsZSsnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5vcGVuKCdodHRwczovL3BsdXMuZ29vZ2xlLmNvbS9zaGFyZT91cmw9JyArIEVuZ2luZS5TSVRFX1VSTCwgJ3NoYXJlcicsICd3aWR0aD00ODAsaGVpZ2h0PTQzNixsb2NhdGlvbj1ubyxtZW51YmFyPW5vLHJlc2l6YWJsZT1ubyxzY3JvbGxiYXJzPW5vLHN0YXR1cz1ubyx0b29sYmFyPW5vJyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQndHdpdHRlcic6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCd0d2l0dGVyJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR3aW5kb3cub3BlbignaHR0cHM6Ly90d2l0dGVyLmNvbS9pbnRlbnQvdHdlZXQ/dGV4dD1BJTIwRGFyayUyMFJvb20mdXJsPScgKyBFbmdpbmUuU0lURV9VUkwsICdzaGFyZXInLCAnd2lkdGg9NjYwLGhlaWdodD0yNjAsbG9jYXRpb249bm8sbWVudWJhcj1ubyxyZXNpemFibGU9bm8sc2Nyb2xsYmFycz15ZXMsc3RhdHVzPW5vLHRvb2xiYXI9bm8nKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdyZWRkaXQnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygncmVkZGl0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR3aW5kb3cub3BlbignaHR0cDovL3d3dy5yZWRkaXQuY29tL3N1Ym1pdD91cmw9JyArIEVuZ2luZS5TSVRFX1VSTCwgJ3NoYXJlcicsICd3aWR0aD05NjAsaGVpZ2h0PTcwMCxsb2NhdGlvbj1ubyxtZW51YmFyPW5vLHJlc2l6YWJsZT1ubyxzY3JvbGxiYXJzPXllcyxzdGF0dXM9bm8sdG9vbGJhcj1ubycpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2Nsb3NlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2Nsb3NlJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHR3aWR0aDogJzQwMHB4J1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0ZmluZFN0eWxlc2hlZXQ6IGZ1bmN0aW9uKHRpdGxlKSB7XHJcblx0XHRmb3IodmFyIGk9MDsgaTxkb2N1bWVudC5zdHlsZVNoZWV0cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgc2hlZXQgPSBkb2N1bWVudC5zdHlsZVNoZWV0c1tpXTtcclxuXHRcdFx0aWYoc2hlZXQudGl0bGUgPT0gdGl0bGUpIHtcclxuXHRcdFx0XHRyZXR1cm4gc2hlZXQ7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH0sXHJcblxyXG5cdGlzTGlnaHRzT2ZmOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBkYXJrQ3NzID0gRW5naW5lLmZpbmRTdHlsZXNoZWV0KCdkYXJrZW5MaWdodHMnKTtcclxuXHRcdGlmICggZGFya0NzcyAhPSBudWxsICYmICFkYXJrQ3NzLmRpc2FibGVkICkge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cclxuXHR0dXJuTGlnaHRzT2ZmOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBkYXJrQ3NzID0gRW5naW5lLmZpbmRTdHlsZXNoZWV0KCdkYXJrZW5MaWdodHMnKTtcclxuXHRcdGlmIChkYXJrQ3NzID09IG51bGwpIHtcclxuXHRcdFx0JCgnaGVhZCcpLmFwcGVuZCgnPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCJjc3MvZGFyay5jc3NcIiB0eXBlPVwidGV4dC9jc3NcIiB0aXRsZT1cImRhcmtlbkxpZ2h0c1wiIC8+Jyk7XHJcblx0XHRcdCQoJy5saWdodHNPZmYnKS50ZXh0KF8oJ2xpZ2h0cyBvbi4nKSk7XHJcblx0XHR9IGVsc2UgaWYgKGRhcmtDc3MuZGlzYWJsZWQpIHtcclxuXHRcdFx0ZGFya0Nzcy5kaXNhYmxlZCA9IGZhbHNlO1xyXG5cdFx0XHQkKCcubGlnaHRzT2ZmJykudGV4dChfKCdsaWdodHMgb24uJykpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JChcIiNkYXJrZW5MaWdodHNcIikuYXR0cihcImRpc2FibGVkXCIsIFwiZGlzYWJsZWRcIik7XHJcblx0XHRcdGRhcmtDc3MuZGlzYWJsZWQgPSB0cnVlO1xyXG5cdFx0XHQkKCcubGlnaHRzT2ZmJykudGV4dChfKCdsaWdodHMgb2ZmLicpKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHQvLyBHZXRzIGEgZ3VpZFxyXG5cdGdldEd1aWQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24oYykge1xyXG5cdFx0XHR2YXIgciA9IE1hdGgucmFuZG9tKCkqMTZ8MCwgdiA9IGMgPT0gJ3gnID8gciA6IChyJjB4M3wweDgpO1xyXG5cdFx0XHRyZXR1cm4gdi50b1N0cmluZygxNik7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRhY3RpdmVNb2R1bGU6IG51bGwsXHJcblxyXG5cdHRyYXZlbFRvOiBmdW5jdGlvbihtb2R1bGUpIHtcclxuXHRcdGlmKEVuZ2luZS5hY3RpdmVNb2R1bGUgIT0gbW9kdWxlKSB7XHJcblx0XHRcdHZhciBjdXJyZW50SW5kZXggPSBFbmdpbmUuYWN0aXZlTW9kdWxlID8gJCgnLmxvY2F0aW9uJykuaW5kZXgoRW5naW5lLmFjdGl2ZU1vZHVsZS5wYW5lbCkgOiAxO1xyXG5cdFx0XHQkKCdkaXYuaGVhZGVyQnV0dG9uJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcblx0XHRcdG1vZHVsZS50YWIuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcblxyXG5cdFx0XHR2YXIgc2xpZGVyID0gJCgnI2xvY2F0aW9uU2xpZGVyJyk7XHJcblx0XHRcdHZhciBzdG9yZXMgPSAkKCcjc3RvcmVzQ29udGFpbmVyJyk7XHJcblx0XHRcdHZhciBwYW5lbEluZGV4ID0gJCgnLmxvY2F0aW9uJykuaW5kZXgobW9kdWxlLnBhbmVsKTtcclxuXHRcdFx0dmFyIGRpZmYgPSBNYXRoLmFicyhwYW5lbEluZGV4IC0gY3VycmVudEluZGV4KTtcclxuXHRcdFx0c2xpZGVyLmFuaW1hdGUoe2xlZnQ6IC0ocGFuZWxJbmRleCAqIDcwMCkgKyAncHgnfSwgMzAwICogZGlmZik7XHJcblxyXG5cdFx0XHRpZigkU00uZ2V0KCdzdG9yZXMud29vZCcpICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0Ly8gRklYTUUgV2h5IGRvZXMgdGhpcyB3b3JrIGlmIHRoZXJlJ3MgYW4gYW5pbWF0aW9uIHF1ZXVlLi4uP1xyXG5cdFx0XHRcdHN0b3Jlcy5hbmltYXRlKHtyaWdodDogLShwYW5lbEluZGV4ICogNzAwKSArICdweCd9LCAzMDAgKiBkaWZmKTtcclxuXHRcdFx0fVxyXG5cdFx0XHJcblx0XHRcdEVuZ2luZS5hY3RpdmVNb2R1bGUgPSBtb2R1bGU7XHJcblxyXG5cdFx0XHRtb2R1bGUub25BcnJpdmFsKGRpZmYpO1xyXG5cclxuXHRcdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSBWaWxsYWdlXHJcblx0XHRcdFx0Ly8gIHx8IEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gUGF0aFxyXG5cdFx0XHRcdCkge1xyXG5cdFx0XHRcdC8vIERvbid0IGZhZGUgb3V0IHRoZSB3ZWFwb25zIGlmIHdlJ3JlIHN3aXRjaGluZyB0byBhIG1vZHVsZVxyXG5cdFx0XHRcdC8vIHdoZXJlIHdlJ3JlIGdvaW5nIHRvIGtlZXAgc2hvd2luZyB0aGVtIGFueXdheS5cclxuXHRcdFx0XHRpZiAobW9kdWxlICE9IFZpbGxhZ2UgXHJcblx0XHRcdFx0XHQvLyAmJiBtb2R1bGUgIT0gUGF0aFxyXG5cdFx0XHRcdCkge1xyXG5cdFx0XHRcdFx0JCgnZGl2I3dlYXBvbnMnKS5hbmltYXRlKHtvcGFjaXR5OiAwfSwgMzAwKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKG1vZHVsZSA9PSBWaWxsYWdlXHJcblx0XHRcdFx0Ly8gIHx8IG1vZHVsZSA9PSBQYXRoXHJcblx0XHRcdFx0KSB7XHJcblx0XHRcdFx0JCgnZGl2I3dlYXBvbnMnKS5hbmltYXRlKHtvcGFjaXR5OiAxfSwgMzAwKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Tm90aWZpY2F0aW9ucy5wcmludFF1ZXVlKG1vZHVsZSk7XHJcblx0XHRcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRsb2c6IGZ1bmN0aW9uKG1zZykge1xyXG5cdFx0aWYodGhpcy5fbG9nKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKG1zZyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0dXBkYXRlU2xpZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBzbGlkZXIgPSAkKCcjbG9jYXRpb25TbGlkZXInKTtcclxuXHRcdHNsaWRlci53aWR0aCgoc2xpZGVyLmNoaWxkcmVuKCkubGVuZ3RoICogNzAwKSArICdweCcpO1xyXG5cdH0sXHJcblxyXG5cdHVwZGF0ZU91dGVyU2xpZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBzbGlkZXIgPSAkKCcjb3V0ZXJTbGlkZXInKTtcclxuXHRcdHNsaWRlci53aWR0aCgoc2xpZGVyLmNoaWxkcmVuKCkubGVuZ3RoICogNzAwKSArICdweCcpO1xyXG5cdH0sXHJcblxyXG5cdGRpc2FibGVTZWxlY3Rpb246IGZ1bmN0aW9uKCkge1xyXG5cdFx0ZG9jdW1lbnQub25zZWxlY3RzdGFydCA9IGV2ZW50TnVsbGlmaWVyOyAvLyB0aGlzIGlzIGZvciBJRVxyXG5cdFx0ZG9jdW1lbnQub25tb3VzZWRvd24gPSBldmVudE51bGxpZmllcjsgLy8gdGhpcyBpcyBmb3IgdGhlIHJlc3RcclxuXHR9LFxyXG5cclxuXHRlbmFibGVTZWxlY3Rpb246IGZ1bmN0aW9uKCkge1xyXG5cdFx0ZG9jdW1lbnQub25zZWxlY3RzdGFydCA9IGV2ZW50UGFzc3Rocm91Z2g7XHJcblx0XHRkb2N1bWVudC5vbm1vdXNlZG93biA9IGV2ZW50UGFzc3Rocm91Z2g7XHJcblx0fSxcclxuXHJcblx0YXV0b1NlbGVjdDogZnVuY3Rpb24oc2VsZWN0b3IpIHtcclxuXHRcdCQoc2VsZWN0b3IpLmZvY3VzKCkuc2VsZWN0KCk7XHJcblx0fSxcclxuXHJcblx0aGFuZGxlU3RhdGVVcGRhdGVzOiBmdW5jdGlvbihlKXtcclxuXHRcclxuXHR9LFxyXG5cclxuXHRzd2l0Y2hMYW5ndWFnZTogZnVuY3Rpb24oZG9tKXtcclxuXHRcdHZhciBsYW5nID0gJChkb20pLmRhdGEoXCJsYW5ndWFnZVwiKTtcclxuXHRcdGlmKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYuc2VhcmNoKC9bXFw/XFwmXWxhbmc9W2Etel9dKy8pICE9IC0xKXtcclxuXHRcdFx0ZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IGRvY3VtZW50LmxvY2F0aW9uLmhyZWYucmVwbGFjZSggLyhbXFw/XFwmXWxhbmc9KShbYS16X10rKS9naSAsIFwiJDFcIitsYW5nICk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0ZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgKyAoIChkb2N1bWVudC5sb2NhdGlvbi5ocmVmLnNlYXJjaCgvXFw/LykgIT0gLTEgKT9cIiZcIjpcIj9cIikgKyBcImxhbmc9XCIrbGFuZztcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRzYXZlTGFuZ3VhZ2U6IGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgbGFuZyA9IGRlY29kZVVSSUNvbXBvbmVudCgobmV3IFJlZ0V4cCgnWz98Jl1sYW5nPScgKyAnKFteJjtdKz8pKCZ8I3w7fCQpJykuZXhlYyhsb2NhdGlvbi5zZWFyY2gpfHxbLFwiXCJdKVsxXS5yZXBsYWNlKC9cXCsvZywgJyUyMCcpKXx8bnVsbDtcdFxyXG5cdFx0aWYobGFuZyAmJiB0eXBlb2YgU3RvcmFnZSAhPSAndW5kZWZpbmVkJyAmJiBsb2NhbFN0b3JhZ2UpIHtcclxuXHRcdFx0bG9jYWxTdG9yYWdlLmxhbmcgPSBsYW5nO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHNldFRpbWVvdXQ6IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aW1lb3V0LCBza2lwRG91YmxlPyl7XHJcblxyXG5cdFx0aWYoIEVuZ2luZS5vcHRpb25zLmRvdWJsZVRpbWUgJiYgIXNraXBEb3VibGUgKXtcclxuXHRcdFx0RW5naW5lLmxvZygnRG91YmxlIHRpbWUsIGN1dHRpbmcgdGltZW91dCBpbiBoYWxmJyk7XHJcblx0XHRcdHRpbWVvdXQgLz0gMjtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gc2V0VGltZW91dChjYWxsYmFjaywgdGltZW91dCk7XHJcblxyXG5cdH1cclxuXHJcbn07XHJcblxyXG5mdW5jdGlvbiBldmVudE51bGxpZmllcihlKSB7XHJcblx0cmV0dXJuICQoZS50YXJnZXQpLmhhc0NsYXNzKCdtZW51QnRuJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGV2ZW50UGFzc3Rocm91Z2goZSkge1xyXG5cdHJldHVybiB0cnVlO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gaW5WaWV3KGRpciwgZWxlbSl7XHJcblxyXG4gICAgICAgIHZhciBzY1RvcCA9ICQoJyNtYWluJykub2Zmc2V0KCkudG9wO1xyXG4gICAgICAgIHZhciBzY0JvdCA9IHNjVG9wICsgJCgnI21haW4nKS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgdmFyIGVsVG9wID0gZWxlbS5vZmZzZXQoKS50b3A7XHJcbiAgICAgICAgdmFyIGVsQm90ID0gZWxUb3AgKyBlbGVtLmhlaWdodCgpO1xyXG5cclxuICAgICAgICBpZiggZGlyID09ICd1cCcgKXtcclxuICAgICAgICAgICAgICAgIC8vIFNUT1AgTU9WSU5HIElGIEJPVFRPTSBPRiBFTEVNRU5UIElTIFZJU0lCTEUgSU4gU0NSRUVOXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKCBlbEJvdCA8IHNjQm90ICk7XHJcbiAgICAgICAgfWVsc2UgaWYoIGRpciA9PSAnZG93bicgKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoIGVsVG9wID4gc2NUb3AgKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoICggZWxCb3QgPD0gc2NCb3QgKSAmJiAoIGVsVG9wID49IHNjVG9wICkgKTtcclxuICAgICAgICB9XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBzY3JvbGxCeVgoZWxlbSwgeCl7XHJcblxyXG4gICAgICAgIHZhciBlbFRvcCA9IHBhcnNlSW50KCBlbGVtLmNzcygndG9wJyksIDEwICk7XHJcbiAgICAgICAgZWxlbS5jc3MoICd0b3AnLCAoIGVsVG9wICsgeCApICsgXCJweFwiICk7XHJcblxyXG59XHJcblxyXG5cclxuLy9jcmVhdGUgalF1ZXJ5IENhbGxiYWNrcygpIHRvIGhhbmRsZSBvYmplY3QgZXZlbnRzIFxyXG4kLkRpc3BhdGNoID0gZnVuY3Rpb24oIGlkICkge1xyXG5cdHZhciBjYWxsYmFja3MsIHRvcGljID0gaWQgJiYgRW5naW5lLnRvcGljc1sgaWQgXTtcclxuXHRpZiAoICF0b3BpYyApIHtcclxuXHRcdGNhbGxiYWNrcyA9IGpRdWVyeS5DYWxsYmFja3MoKTtcclxuXHRcdHRvcGljID0ge1xyXG5cdFx0XHRcdHB1Ymxpc2g6IGNhbGxiYWNrcy5maXJlLFxyXG5cdFx0XHRcdHN1YnNjcmliZTogY2FsbGJhY2tzLmFkZCxcclxuXHRcdFx0XHR1bnN1YnNjcmliZTogY2FsbGJhY2tzLnJlbW92ZVxyXG5cdFx0fTtcclxuXHRcdGlmICggaWQgKSB7XHJcblx0XHRcdEVuZ2luZS50b3BpY3NbIGlkIF0gPSB0b3BpYztcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIHRvcGljO1xyXG59O1xyXG5cclxuJChmdW5jdGlvbigpIHtcclxuXHRFbmdpbmUuaW5pdCgpO1xyXG59KTtcclxuXHJcbiIsIi8qKlxyXG4gKiBNb2R1bGUgdGhhdCBoYW5kbGVzIHRoZSByYW5kb20gZXZlbnQgc3lzdGVtXHJcbiAqL1xyXG5pbXBvcnQgeyBFdmVudHNSb2FkV2FuZGVyIH0gZnJvbSBcIi4vZXZlbnRzL3JvYWR3YW5kZXJcIjtcclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4vZW5naW5lXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tIFwiLi9ub3RpZmljYXRpb25zXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuL0J1dHRvblwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBRFJFdmVudCB7XHJcblx0dGl0bGU6IHN0cmluZyxcclxuXHRpc0F2YWlsYWJsZT86IEZ1bmN0aW9uLFxyXG5cdGlzU3VwZXJMaWtlbHk/OiBGdW5jdGlvbixcclxuXHRzY2VuZXM6IHtcclxuXHRcdC8vIHR5cGUgdGhpcyBvdXQgYmV0dGVyIHVzaW5nIEluZGV4IFNpZ25hdHVyZXNcclxuXHRcdFtpZDogc3RyaW5nXTogU2NlbmVcclxuXHR9LFxyXG5cdGV2ZW50UGFuZWw/OiBhbnlcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTY2VuZSB7XHJcblx0c2VlbkZsYWc/OiBGdW5jdGlvbixcclxuXHRuZXh0U2NlbmU/OiBzdHJpbmcsXHJcblx0b25Mb2FkPzogRnVuY3Rpb24sXHJcblx0dGV4dDogQXJyYXk8c3RyaW5nPixcclxuXHRyZXdhcmQ/OiBhbnksXHJcblx0bm90aWZpY2F0aW9uPzogc3RyaW5nLFxyXG5cdGJsaW5rPzogYm9vbGVhbixcclxuXHRkaWNlPzoge1xyXG5cdFx0YW1vdW50OiBudW1iZXIsXHJcblx0XHQvLyBkbyBnYW1lIGVuZ2luZSBzdHVmZiwgdGhlbiByZXR1cm4gdGV4dCBkZXNjcmlwdGlvblxyXG5cdFx0aGFuZGxlcjogKHZhbHMpID0+IEFycmF5PHN0cmluZz5cclxuXHR9LFxyXG5cdGJ1dHRvbnM6IHtcclxuXHRcdFtpZDogc3RyaW5nXTogRXZlbnRCdXR0b25cclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRCdXR0b24ge1xyXG5cdHRleHQ6IHN0cmluZyxcclxuXHRuZXh0U2NlbmU6IHtcclxuXHRcdFtpZDogbnVtYmVyXTogc3RyaW5nXHJcblx0fSxcclxuXHRhdmFpbGFibGU/OiBGdW5jdGlvbixcclxuXHR2aXNpYmxlPzogRnVuY3Rpb24sXHJcblx0cmV3YXJkPzogYW55LFxyXG5cdGNvc3Q/OiBhbnksXHJcblx0bm90aWZpY2F0aW9uPzogc3RyaW5nLFxyXG5cdG9uQ2hvb3NlPzogRnVuY3Rpb25cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IEV2ZW50cyA9IHtcclxuXHRcdFxyXG5cdF9FVkVOVF9USU1FX1JBTkdFOiBbMywgNl0sIC8vIHJhbmdlLCBpbiBtaW51dGVzXHJcblx0X1BBTkVMX0ZBREU6IDIwMCxcclxuXHRCTElOS19JTlRFUlZBTDogZmFsc2UsXHJcblxyXG5cdEV2ZW50UG9vbDogPGFueT5bXSxcclxuXHRldmVudFN0YWNrOiA8YW55PltdLFxyXG5cdF9ldmVudFRpbWVvdXQ6IDAsXHJcblxyXG5cdExvY2F0aW9uczoge30sXHJcblxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdFx0XHJcblx0XHQvLyBCdWlsZCB0aGUgRXZlbnQgUG9vbFxyXG5cdFx0RXZlbnRzLkV2ZW50UG9vbCA9IFtdLmNvbmNhdChcclxuXHRcdFx0RXZlbnRzUm9hZFdhbmRlciBhcyBhbnlcclxuXHRcdCk7XHJcblxyXG5cdFx0dGhpcy5Mb2NhdGlvbnNbXCJSb2FkV2FuZGVyXCJdID0gRXZlbnRzUm9hZFdhbmRlcjtcclxuXHRcdFxyXG5cdFx0RXZlbnRzLmV2ZW50U3RhY2sgPSBbXTtcclxuXHRcdFxyXG5cdFx0Ly9zdWJzY3JpYmUgdG8gc3RhdGVVcGRhdGVzXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHQkLkRpc3BhdGNoKCdzdGF0ZVVwZGF0ZScpLnN1YnNjcmliZShFdmVudHMuaGFuZGxlU3RhdGVVcGRhdGVzKTtcclxuXHR9LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHt9LCAvLyBOb3RoaW5nIGZvciBub3dcclxuICAgIFxyXG5cdGFjdGl2ZVNjZW5lOiAnJyxcclxuICAgIFxyXG5cdGxvYWRTY2VuZTogZnVuY3Rpb24obmFtZSkge1xyXG5cdFx0RW5naW5lLmxvZygnbG9hZGluZyBzY2VuZTogJyArIG5hbWUpO1xyXG5cdFx0RXZlbnRzLmFjdGl2ZVNjZW5lID0gbmFtZTtcclxuXHRcdHZhciBzY2VuZSA9IEV2ZW50cy5hY3RpdmVFdmVudCgpPy5zY2VuZXNbbmFtZV07XHJcblx0XHRcclxuXHRcdC8vIGhhbmRsZXMgb25lLXRpbWUgc2NlbmVzLCBzdWNoIGFzIGludHJvZHVjdGlvbnNcclxuXHRcdC8vIG1heWJlIEkgY2FuIG1ha2UgYSBtb3JlIGV4cGxpY2l0IFwiaW50cm9kdWN0aW9uXCIgbG9naWNhbCBmbG93IHRvIG1ha2UgdGhpc1xyXG5cdFx0Ly8gYSBsaXR0bGUgbW9yZSBlbGVnYW50LCBnaXZlbiB0aGF0IHRoZXJlIHdpbGwgYWx3YXlzIGJlIGFuIFwiaW50cm9kdWN0aW9uXCIgc2NlbmVcclxuXHRcdC8vIHRoYXQncyBvbmx5IG1lYW50IHRvIGJlIHJ1biBhIHNpbmdsZSB0aW1lLlxyXG5cdFx0aWYgKHNjZW5lLnNlZW5GbGFnICYmIHNjZW5lLnNlZW5GbGFnKCkpIHtcclxuXHRcdFx0RXZlbnRzLmxvYWRTY2VuZShzY2VuZS5uZXh0U2NlbmUpXHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBTY2VuZSByZXdhcmRcclxuXHRcdGlmKHNjZW5lLnJld2FyZCkge1xyXG5cdFx0XHQkU00uYWRkTSgnc3RvcmVzJywgc2NlbmUucmV3YXJkKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gb25Mb2FkXHJcblx0XHRpZihzY2VuZS5vbkxvYWQpIHtcclxuXHRcdFx0c2NlbmUub25Mb2FkKCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIE5vdGlmeSB0aGUgc2NlbmUgY2hhbmdlXHJcblx0XHRpZihzY2VuZS5ub3RpZmljYXRpb24pIHtcclxuXHRcdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgc2NlbmUubm90aWZpY2F0aW9uKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0JCgnI2Rlc2NyaXB0aW9uJywgRXZlbnRzLmV2ZW50UGFuZWwoKSkuZW1wdHkoKTtcclxuXHRcdCQoJyNidXR0b25zJywgRXZlbnRzLmV2ZW50UGFuZWwoKSkuZW1wdHkoKTtcclxuXHRcdEV2ZW50cy5zdGFydFN0b3J5KHNjZW5lKTtcclxuXHR9LFxyXG5cdFxyXG5cdGRyYXdGbG9hdFRleHQ6IGZ1bmN0aW9uKHRleHQsIHBhcmVudCkge1xyXG5cdFx0JCgnPGRpdj4nKS50ZXh0KHRleHQpLmFkZENsYXNzKCdkYW1hZ2VUZXh0JykuYXBwZW5kVG8ocGFyZW50KS5hbmltYXRlKHtcclxuXHRcdFx0J2JvdHRvbSc6ICc1MHB4JyxcclxuXHRcdFx0J29wYWNpdHknOiAnMCdcclxuXHRcdH0sXHJcblx0XHQzMDAsXHJcblx0XHQnbGluZWFyJyxcclxuXHRcdGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZSgpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0Ly8gZm9yIGRpY2Ugc3R1ZmZcclxuXHRnZXRSYW5kb21JbnQ6ZnVuY3Rpb24gKG1heCkge1xyXG4gIFx0XHRyZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWF4KTtcclxuXHR9LFxyXG5cdFxyXG5cdHN0YXJ0U3Rvcnk6IGZ1bmN0aW9uKHNjZW5lKSB7XHJcblx0XHQvLyBXcml0ZSB0aGUgdGV4dFxyXG5cdFx0dmFyIGRlc2MgPSAkKCcjZGVzY3JpcHRpb24nLCBFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdGZvcih2YXIgaSBpbiBzY2VuZS50ZXh0KSB7XHJcblx0XHRcdCQoJzxkaXY+JykudGV4dChzY2VuZS50ZXh0W2ldKS5hcHBlbmRUbyhkZXNjKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyB0aGlzIGRpY2Ugc3R1ZmYgY291bGQgbWF5YmUgYmUgZXh0cmFjdGVkIHRvIGl0cyBvd24gZnVuY3Rpb24sXHJcblx0XHQvLyBidXQgYWxzbyB3ZSBtaWdodCBqdXN0IG1ha2UgaXQgd2F5IG1vcmUgZ2VuZXJpYyBzbyB5b3UgY2FuXHJcblx0XHQvLyB0aHJvdyBBTllUSElORyBpbiB0aGUgRXZlbnQgZGVzY3JpcHRpb24gZHluYW1pY2FsbHlcclxuXHRcdGNvbnN0IGRpY2VWYWxzID0gW107XHJcblx0XHRpZiAoc2NlbmUuZGljZSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBzY2VuZS5kaWNlLmFtb3VudDsgaisrKSB7XHJcblx0XHRcdFx0Y29uc3QgZGllVmFsID0gdGhpcy5nZXRSYW5kb21JbnQoNikgKyAxO1xyXG5cdFx0XHRcdGRpY2VWYWxzLnB1c2goZGllVmFsKTtcclxuXHRcdFx0XHRjb25zdCB0aWx0VmFsID0gdGhpcy5nZXRSYW5kb21JbnQoOTApIC0gNDU7XHJcblx0XHRcdFx0Y29uc3QgbWFyZ2luVmFsID0gKHRoaXMuZ2V0UmFuZG9tSW50KDQpICsgMikgKiA1O1xyXG5cdFx0XHRcdGRlc2MuYXBwZW5kKFxyXG5cdFx0XHRcdFx0JCgnPGltZz4nLHtpZDonZGllJyArIGRpZVZhbC50b1N0cmluZygpICxzcmM6J2Fzc2V0cy9kaWUvZGllJyArIGRpZVZhbC50b1N0cmluZygpICsgJy5wbmcnfSlcclxuXHRcdFx0XHRcdC5jc3MoJ3dpZHRoJywgJzUlJylcclxuXHRcdFx0XHRcdC5jc3MoJ2hlaWdodCcsICdhdXRvJylcclxuXHRcdFx0XHRcdC5jc3Moe1xyXG5cdFx0XHRcdFx0XHRcIi13ZWJraXQtdHJhbnNmb3JtXCI6IFwicm90YXRlKFwiICsgdGlsdFZhbC50b1N0cmluZygpICsgXCJkZWcpXCIsXHJcblx0XHRcdFx0XHRcdFwiLW1vei10cmFuc2Zvcm1cIjogXCJyb3RhdGUoXCIgKyB0aWx0VmFsLnRvU3RyaW5nKCkgKyBcImRlZylcIixcclxuXHRcdFx0XHRcdFx0XCJ0cmFuc2Zvcm1cIjogXCJyb3RhdGUoXCIgKyB0aWx0VmFsLnRvU3RyaW5nKCkgKyBcImRlZylcIlxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHQuY3NzKCdtYXJnaW4tcmlnaHQnLCBtYXJnaW5WYWwudG9TdHJpbmcoKSArICdweCcpXHJcblx0XHRcdFx0XHQuY3NzKCdtYXJnaW4tYm90dG9tJywgJzIwcHgnKVxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCB0ZXh0VmFsczogQXJyYXk8c3RyaW5nPiA9IHNjZW5lLmRpY2UuaGFuZGxlcihkaWNlVmFscyk7XHJcblx0XHRmb3IgKGNvbnN0IHRleHQgaW4gdGV4dFZhbHMpIHtcclxuXHRcdFx0JCgnPGRpdj4nKS50ZXh0KHRleHRWYWxzW3RleHRdKS5hcHBlbmRUbyhkZXNjKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYoc2NlbmUudGV4dGFyZWEgIT0gbnVsbCkge1xyXG5cdFx0XHR2YXIgdGEgPSAkKCc8dGV4dGFyZWE+JykudmFsKHNjZW5lLnRleHRhcmVhKS5hcHBlbmRUbyhkZXNjKTtcclxuXHRcdFx0aWYoc2NlbmUucmVhZG9ubHkpIHtcclxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0dGEuYXR0cigncmVhZG9ubHknLCB0cnVlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBEcmF3IHRoZSBidXR0b25zXHJcblx0XHRFdmVudHMuZHJhd0J1dHRvbnMoc2NlbmUpO1xyXG5cdH0sXHJcblx0XHJcblx0ZHJhd0J1dHRvbnM6IGZ1bmN0aW9uKHNjZW5lKSB7XHJcblx0XHR2YXIgYnRucyA9ICQoJyNidXR0b25zJywgRXZlbnRzLmV2ZW50UGFuZWwoKSk7XHJcblx0XHRmb3IodmFyIGlkIGluIHNjZW5lLmJ1dHRvbnMpIHtcclxuXHRcdFx0dmFyIGluZm8gPSBzY2VuZS5idXR0b25zW2lkXTtcclxuXHRcdFx0XHR2YXIgYiA9IFxyXG5cdFx0XHRcdC8vbmV3IFxyXG5cdFx0XHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRcdFx0aWQ6IGlkLFxyXG5cdFx0XHRcdFx0dGV4dDogaW5mby50ZXh0LFxyXG5cdFx0XHRcdFx0Y29zdDogaW5mby5jb3N0LFxyXG5cdFx0XHRcdFx0Y2xpY2s6IEV2ZW50cy5idXR0b25DbGljayxcclxuXHRcdFx0XHRcdGNvb2xkb3duOiBpbmZvLmNvb2xkb3duLFxyXG5cdFx0XHRcdFx0aW1hZ2U6IGluZm8uaW1hZ2VcclxuXHRcdFx0XHR9KS5hcHBlbmRUbyhidG5zKTtcclxuXHRcdFx0aWYodHlwZW9mIGluZm8uYXZhaWxhYmxlID09ICdmdW5jdGlvbicgJiYgIWluZm8uYXZhaWxhYmxlKCkpIHtcclxuXHRcdFx0XHRCdXR0b24uc2V0RGlzYWJsZWQoYiwgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYodHlwZW9mIGluZm8udmlzaWJsZSA9PSAnZnVuY3Rpb24nICYmICFpbmZvLnZpc2libGUoKSkge1xyXG5cdFx0XHRcdGIuaGlkZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHR5cGVvZiBpbmZvLmNvb2xkb3duID09ICdudW1iZXInKSB7XHJcblx0XHRcdFx0QnV0dG9uLmNvb2xkb3duKGIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdEV2ZW50cy51cGRhdGVCdXR0b25zKCk7XHJcblx0fSxcclxuXHRcclxuXHR1cGRhdGVCdXR0b25zOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBidG5zID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnNjZW5lc1tFdmVudHMuYWN0aXZlU2NlbmVdLmJ1dHRvbnM7XHJcblx0XHRmb3IodmFyIGJJZCBpbiBidG5zKSB7XHJcblx0XHRcdHZhciBiID0gYnRuc1tiSWRdO1xyXG5cdFx0XHR2YXIgYnRuRWwgPSAkKCcjJytiSWQsIEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0XHRpZih0eXBlb2YgYi5hdmFpbGFibGUgPT0gJ2Z1bmN0aW9uJyAmJiAhYi5hdmFpbGFibGUoKSkge1xyXG5cdFx0XHRcdEJ1dHRvbi5zZXREaXNhYmxlZChidG5FbCwgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGJ1dHRvbkNsaWNrOiBmdW5jdGlvbihidG4pIHtcclxuXHRcdHZhciBpbmZvID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnNjZW5lc1tFdmVudHMuYWN0aXZlU2NlbmVdLmJ1dHRvbnNbYnRuLmF0dHIoJ2lkJyldO1xyXG5cclxuXHRcdGlmKHR5cGVvZiBpbmZvLm9uQ2hvb3NlID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0dmFyIHRleHRhcmVhID0gRXZlbnRzLmV2ZW50UGFuZWwoKS5maW5kKCd0ZXh0YXJlYScpO1xyXG5cdFx0XHRpbmZvLm9uQ2hvb3NlKHRleHRhcmVhLmxlbmd0aCA+IDAgPyB0ZXh0YXJlYS52YWwoKSA6IG51bGwpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBSZXdhcmRcclxuXHRcdGlmKGluZm8ucmV3YXJkKSB7XHJcblx0XHRcdCRTTS5hZGRNKCdzdG9yZXMnLCBpbmZvLnJld2FyZCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdEV2ZW50cy51cGRhdGVCdXR0b25zKCk7XHJcblx0XHRcclxuXHRcdC8vIE5vdGlmaWNhdGlvblxyXG5cdFx0aWYoaW5mby5ub3RpZmljYXRpb24pIHtcclxuXHRcdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgaW5mby5ub3RpZmljYXRpb24pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBOZXh0IFNjZW5lXHJcblx0XHRpZihpbmZvLm5leHRTY2VuZSkge1xyXG5cdFx0XHRpZihpbmZvLm5leHRTY2VuZSA9PSAnZW5kJykge1xyXG5cdFx0XHRcdEV2ZW50cy5lbmRFdmVudCgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHZhciByID0gTWF0aC5yYW5kb20oKTtcclxuXHRcdFx0XHR2YXIgbG93ZXN0TWF0Y2g6IG51bGwgfCBzdHJpbmcgPSBudWxsO1xyXG5cdFx0XHRcdGZvcih2YXIgaSBpbiBpbmZvLm5leHRTY2VuZSkge1xyXG5cdFx0XHRcdFx0aWYociA8IChpIGFzIHVua25vd24gYXMgbnVtYmVyKSAmJiAobG93ZXN0TWF0Y2ggPT0gbnVsbCB8fCBpIDwgbG93ZXN0TWF0Y2gpKSB7XHJcblx0XHRcdFx0XHRcdGxvd2VzdE1hdGNoID0gaTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYobG93ZXN0TWF0Y2ggIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0RXZlbnRzLmxvYWRTY2VuZShpbmZvLm5leHRTY2VuZVtsb3dlc3RNYXRjaF0pO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRFbmdpbmUubG9nKCdFUlJPUjogbm8gc3VpdGFibGUgc2NlbmUgZm91bmQnKTtcclxuXHRcdFx0XHRFdmVudHMuZW5kRXZlbnQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8vIGJsaW5rcyB0aGUgYnJvd3NlciB3aW5kb3cgdGl0bGVcclxuXHRibGlua1RpdGxlOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0aXRsZSA9IGRvY3VtZW50LnRpdGxlO1xyXG5cclxuXHRcdC8vIGV2ZXJ5IDMgc2Vjb25kcyBjaGFuZ2UgdGl0bGUgdG8gJyoqKiBFVkVOVCAqKionLCB0aGVuIDEuNSBzZWNvbmRzIGxhdGVyLCBjaGFuZ2UgaXQgYmFjayB0byB0aGUgb3JpZ2luYWwgdGl0bGUuXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRFdmVudHMuQkxJTktfSU5URVJWQUwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuXHRcdFx0ZG9jdW1lbnQudGl0bGUgPSBfKCcqKiogRVZFTlQgKioqJyk7XHJcblx0XHRcdEVuZ2luZS5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge2RvY3VtZW50LnRpdGxlID0gdGl0bGU7fSwgMTUwMCwgdHJ1ZSk7IFxyXG5cdFx0fSwgMzAwMCk7XHJcblx0fSxcclxuXHJcblx0c3RvcFRpdGxlQmxpbms6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0Y2xlYXJJbnRlcnZhbChFdmVudHMuQkxJTktfSU5URVJWQUwpO1xyXG5cdFx0RXZlbnRzLkJMSU5LX0lOVEVSVkFMID0gZmFsc2U7XHJcblx0fSxcclxuXHRcclxuXHQvLyBNYWtlcyBhbiBldmVudCBoYXBwZW4hXHJcblx0dHJpZ2dlckV2ZW50OiBmdW5jdGlvbigpIHtcclxuXHRcdGlmKEV2ZW50cy5hY3RpdmVFdmVudCgpID09IG51bGwpIHtcclxuXHRcdFx0dmFyIHBvc3NpYmxlRXZlbnRzID0gW107XHJcblx0XHRcdGZvcih2YXIgaSBpbiBFdmVudHMuRXZlbnRQb29sKSB7XHJcblx0XHRcdFx0dmFyIGV2ZW50ID0gRXZlbnRzLkV2ZW50UG9vbFtpXTtcclxuXHRcdFx0XHRpZihldmVudC5pc0F2YWlsYWJsZSgpKSB7XHJcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0XHRwb3NzaWJsZUV2ZW50cy5wdXNoKGV2ZW50KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKHBvc3NpYmxlRXZlbnRzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRcdEV2ZW50cy5zY2hlZHVsZU5leHRFdmVudCgwLjUpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR2YXIgciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoocG9zc2libGVFdmVudHMubGVuZ3RoKSk7XHJcblx0XHRcdFx0RXZlbnRzLnN0YXJ0RXZlbnQocG9zc2libGVFdmVudHNbcl0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0RXZlbnRzLnNjaGVkdWxlTmV4dEV2ZW50KCk7XHJcblx0fSxcclxuXHJcblx0Ly8gbm90IHNjaGVkdWxlZCwgdGhpcyBpcyBmb3Igc3R1ZmYgbGlrZSBsb2NhdGlvbi1iYXNlZCByYW5kb20gZXZlbnRzIG9uIGEgYnV0dG9uIGNsaWNrXHJcblx0dHJpZ2dlckxvY2F0aW9uRXZlbnQ6IGZ1bmN0aW9uKGxvY2F0aW9uKSB7XHJcblx0XHRpZiAodGhpcy5Mb2NhdGlvbnNbbG9jYXRpb25dKSB7XHJcblx0XHRcdGlmKEV2ZW50cy5hY3RpdmVFdmVudCgpID09IG51bGwpIHtcclxuXHRcdFx0XHR2YXIgcG9zc2libGVFdmVudHM6IEFycmF5PGFueT4gPSBbXTtcclxuXHRcdFx0XHRmb3IodmFyIGkgaW4gdGhpcy5Mb2NhdGlvbnNbbG9jYXRpb25dKSB7XHJcblx0XHRcdFx0XHR2YXIgZXZlbnQgPSB0aGlzLkxvY2F0aW9uc1tsb2NhdGlvbl1baV07XHJcblx0XHRcdFx0XHRpZihldmVudC5pc0F2YWlsYWJsZSgpKSB7XHJcblx0XHRcdFx0XHRcdGlmKHR5cGVvZihldmVudC5pc1N1cGVyTGlrZWx5KSA9PSAnZnVuY3Rpb24nICYmIGV2ZW50LmlzU3VwZXJMaWtlbHkoKSkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFN1cGVyTGlrZWx5IGV2ZW50LCBkbyB0aGlzIGFuZCBza2lwIHRoZSByYW5kb20gY2hvaWNlXHJcblx0XHRcdFx0XHRcdFx0RW5naW5lLmxvZygnc3VwZXJMaWtlbHkgZGV0ZWN0ZWQnKTtcclxuXHRcdFx0XHRcdFx0XHRFdmVudHMuc3RhcnRFdmVudChldmVudCk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHBvc3NpYmxlRXZlbnRzLnB1c2goZXZlbnQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcclxuXHRcdFx0XHRpZihwb3NzaWJsZUV2ZW50cy5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHRcdC8vIEV2ZW50cy5zY2hlZHVsZU5leHRFdmVudCgwLjUpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR2YXIgciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoocG9zc2libGVFdmVudHMubGVuZ3RoKSk7XHJcblx0XHRcdFx0XHRFdmVudHMuc3RhcnRFdmVudChwb3NzaWJsZUV2ZW50c1tyXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRhY3RpdmVFdmVudDogZnVuY3Rpb24oKTogQURSRXZlbnQgfCBudWxsIHtcclxuXHRcdGlmKEV2ZW50cy5ldmVudFN0YWNrICYmIEV2ZW50cy5ldmVudFN0YWNrLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0cmV0dXJuIEV2ZW50cy5ldmVudFN0YWNrWzBdO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fSxcclxuXHRcclxuXHRldmVudFBhbmVsOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBFdmVudHMuYWN0aXZlRXZlbnQoKT8uZXZlbnRQYW5lbDtcclxuXHR9LFxyXG5cclxuXHRzdGFydEV2ZW50OiBmdW5jdGlvbihldmVudDogQURSRXZlbnQsIG9wdGlvbnM/KSB7XHJcblx0XHRpZihldmVudCkge1xyXG5cdFx0XHRFdmVudHMuZXZlbnRTdGFjay51bnNoaWZ0KGV2ZW50KTtcclxuXHRcdFx0ZXZlbnQuZXZlbnRQYW5lbCA9ICQoJzxkaXY+JykuYXR0cignaWQnLCAnZXZlbnQnKS5hZGRDbGFzcygnZXZlbnRQYW5lbCcpLmNzcygnb3BhY2l0eScsICcwJyk7XHJcblx0XHRcdGlmKG9wdGlvbnMgIT0gbnVsbCAmJiBvcHRpb25zLndpZHRoICE9IG51bGwpIHtcclxuXHRcdFx0XHRFdmVudHMuZXZlbnRQYW5lbCgpLmNzcygnd2lkdGgnLCBvcHRpb25zLndpZHRoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKCc8ZGl2PicpLmFkZENsYXNzKCdldmVudFRpdGxlJykudGV4dChFdmVudHMuYWN0aXZlRXZlbnQoKT8udGl0bGUgYXMgc3RyaW5nKS5hcHBlbmRUbyhFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdkZXNjcmlwdGlvbicpLmFwcGVuZFRvKEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2J1dHRvbnMnKS5hcHBlbmRUbyhFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdFx0RXZlbnRzLmxvYWRTY2VuZSgnc3RhcnQnKTtcclxuXHRcdFx0JCgnZGl2I3dyYXBwZXInKS5hcHBlbmQoRXZlbnRzLmV2ZW50UGFuZWwoKSk7XHJcblx0XHRcdEV2ZW50cy5ldmVudFBhbmVsKCkuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIEV2ZW50cy5fUEFORUxfRkFERSwgJ2xpbmVhcicpO1xyXG5cdFx0XHR2YXIgY3VycmVudFNjZW5lSW5mb3JtYXRpb24gPSBFdmVudHMuYWN0aXZlRXZlbnQoKT8uc2NlbmVzW0V2ZW50cy5hY3RpdmVTY2VuZV07XHJcblx0XHRcdGlmIChjdXJyZW50U2NlbmVJbmZvcm1hdGlvbi5ibGluaykge1xyXG5cdFx0XHRcdEV2ZW50cy5ibGlua1RpdGxlKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRzY2hlZHVsZU5leHRFdmVudDogZnVuY3Rpb24oc2NhbGU/KSB7XHJcblx0XHR2YXIgbmV4dEV2ZW50ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKihFdmVudHMuX0VWRU5UX1RJTUVfUkFOR0VbMV0gLSBFdmVudHMuX0VWRU5UX1RJTUVfUkFOR0VbMF0pKSArIEV2ZW50cy5fRVZFTlRfVElNRV9SQU5HRVswXTtcclxuXHRcdGlmKHNjYWxlID4gMCkgeyBuZXh0RXZlbnQgKj0gc2NhbGU7IH1cclxuXHRcdEVuZ2luZS5sb2coJ25leHQgZXZlbnQgc2NoZWR1bGVkIGluICcgKyBuZXh0RXZlbnQgKyAnIG1pbnV0ZXMnKTtcclxuXHRcdEV2ZW50cy5fZXZlbnRUaW1lb3V0ID0gRW5naW5lLnNldFRpbWVvdXQoRXZlbnRzLnRyaWdnZXJFdmVudCwgbmV4dEV2ZW50ICogNjAgKiAxMDAwKTtcclxuXHR9LFxyXG5cclxuXHRlbmRFdmVudDogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuZXZlbnRQYW5lbCgpLmFuaW1hdGUoe29wYWNpdHk6MH0sIEV2ZW50cy5fUEFORUxfRkFERSwgJ2xpbmVhcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRFdmVudHMuZXZlbnRQYW5lbCgpLnJlbW92ZSgpO1xyXG5cdFx0XHRjb25zdCBhY3RpdmVFdmVudCA9IEV2ZW50cy5hY3RpdmVFdmVudCgpO1xyXG5cdFx0XHRpZiAoYWN0aXZlRXZlbnQgIT09IG51bGwpIGFjdGl2ZUV2ZW50LmV2ZW50UGFuZWwgPSBudWxsO1xyXG5cdFx0XHRFdmVudHMuZXZlbnRTdGFjay5zaGlmdCgpO1xyXG5cdFx0XHRFbmdpbmUubG9nKEV2ZW50cy5ldmVudFN0YWNrLmxlbmd0aCArICcgZXZlbnRzIHJlbWFpbmluZycpO1xyXG5cdFx0XHRpZiAoRXZlbnRzLkJMSU5LX0lOVEVSVkFMKSB7XHJcblx0XHRcdFx0RXZlbnRzLnN0b3BUaXRsZUJsaW5rKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gRm9yY2UgcmVmb2N1cyBvbiB0aGUgYm9keS4gSSBoYXRlIHlvdSwgSUUuXHJcblx0XHRcdCQoJ2JvZHknKS5mb2N1cygpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0aGFuZGxlU3RhdGVVcGRhdGVzOiBmdW5jdGlvbihlKXtcclxuXHRcdGlmKChlLmNhdGVnb3J5ID09ICdzdG9yZXMnIHx8IGUuY2F0ZWdvcnkgPT0gJ2luY29tZScpICYmIEV2ZW50cy5hY3RpdmVFdmVudCgpICE9IG51bGwpe1xyXG5cdFx0XHRFdmVudHMudXBkYXRlQnV0dG9ucygpO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuIiwiLyoqXHJcbiAqIEV2ZW50cyB0aGF0IGNhbiBvY2N1ciB3aGVuIHRoZSBSb2FkIG1vZHVsZSBpcyBhY3RpdmVcclxuICoqL1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi4vZW5naW5lXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tIFwiLi4vcGxheWVyL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgeyBPdXRwb3N0IH0gZnJvbSBcIi4uL3BsYWNlcy9vdXRwb3N0XCI7XHJcbmltcG9ydCB7IFJvYWQgfSBmcm9tIFwiLi4vcGxhY2VzL3JvYWRcIjtcclxuaW1wb3J0IHsgQURSRXZlbnQgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgRXZlbnRzUm9hZFdhbmRlcjogQXJyYXk8QURSRXZlbnQ+ID0gW1xyXG4gICAgLy8gU3RyYW5nZXIgYmVhcmluZyBnaWZ0c1xyXG4gICAge1xyXG4gICAgICAgIHRpdGxlOiBfKCdBIFN0cmFuZ2VyIEJlY2tvbnMnKSxcclxuICAgICAgICBpc0F2YWlsYWJsZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBFbmdpbmUuYWN0aXZlTW9kdWxlID09IFJvYWQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgJ3N0YXJ0Jzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0FzIHlvdSB3YW5kZXIgYWxvbmcgdGhlIHJvYWQsIGEgaG9vZGVkIHN0cmFuZ2VyIGdlc3R1cmVzIHRvIHlvdS4gSGUgZG9lc25cXCd0IHNlZW0gaW50ZXJlc3RlZCBpbiBodXJ0aW5nIHlvdS4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdXaGF0IGRvIHlvdSBkbz8nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnY2xvc2VyJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdEcmF3IENsb3NlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOiAnY2xvc2VyJ31cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnR2V0IE91dHRhIFRoZXJlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6ICdsZWF2ZSd9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnY2xvc2VyJzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1lvdSBtb3ZlIHRvd2FyZCBoaW0gYSBiaXQgYW5kIHN0b3AuIEhlIGNvbnRpbnVlcyB0byBiZWNrb24uJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnV2hhdCBkbyB5b3UgZG8/JylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2V2ZW5DbG9zZXInOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0RyYXcgRXZlbiBDbG9zZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTogJ2V2ZW5DbG9zZXInfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdOYWgsIFRoaXMgaXMgVG9vIFNwb29reScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOiAnbGVhdmUnfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2V2ZW5DbG9zZXInOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgXygnWW91IGhlc2l0YW50bHkgd2FsayBjbG9zZXIuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnQXMgc29vbiBhcyB5b3UgZ2V0IHdpdGhpbiBhcm1zXFwnIHJlYWNoLCBoZSBncmFicyB5b3VyIGhhbmQgd2l0aCBhbGFybWluZyBzcGVlZC4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdIZSBxdWlja2x5IHBsYWNlcyBhbiBvYmplY3QgaW4geW91ciBoYW5kLCB0aGVuIGxlYXZlcyB3b3JkbGVzc2x5LicpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgb25Mb2FkOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBtYXliZSBzb21lIGxvZ2ljIHRvIG1ha2UgcmVwZWF0cyBsZXNzIGxpa2VseT9cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb3NzaWJsZUl0ZW1zID0gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnU3RyYW5nZXIuc21vb3RoU3RvbmUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnU3RyYW5nZXIud3JhcHBlZEtuaWZlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ1N0cmFuZ2VyLmNsb3RoQnVuZGxlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ1N0cmFuZ2VyLmNvaW4nXHJcbiAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gcG9zc2libGVJdGVtc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwb3NzaWJsZUl0ZW1zLmxlbmd0aCldO1xyXG4gICAgICAgICAgICAgICAgICAgIENoYXJhY3Rlci5hZGRUb0ludmVudG9yeShpdGVtKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1RoYW5rcywgSSBndWVzcz8nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1lvdXIgZ3V0IGNsZW5jaGVzLCBhbmQgeW91IGZlZWwgdGhlIHN1ZGRlbiB1cmdlIHRvIGxlYXZlLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0FzIHlvdSB3YWxrIGF3YXksIHlvdSBjYW4gZmVlbCB0aGUgb2xkIG1hblxcJ3MgZ2F6ZSBvbiB5b3VyIGJhY2suJylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1dlaXJkLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIE9sZCBsYWR5IGluIGNhcnJpYWdlLCBzaG9ydGN1dCB0byBPdXRwb3N0XHJcbiAgICB7XHJcbiAgICAgICAgdGl0bGU6IF8oJ1RoZSBTdG9tcGluZyBvZiBIb292ZXMgYW5kIENyZWFraW5nIG9mIFdvb2QnKSxcclxuICAgICAgICBpc0F2YWlsYWJsZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBFbmdpbmUuYWN0aXZlTW9kdWxlID09IFJvYWQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgJ3N0YXJ0Jzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0EgY2FycmlhZ2UgcHVsbHMgdXAgYWxvbmdzaWRlIHlvdSwgYW5kIHRoZSB2b2ljZSBvZiBhbiBlbGRlcmx5IHdvbWFuIGNyb2FrcyBvdXQgZnJvbSB3aXRoaW4uJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnXCJNeSwgYnV0IHlvdSBsb29rIHRpcmVkIGZyb20geW91ciBqb3VybmV5LiBJZiBpdFxcJ3MgdGhlIE91dHBvc3QgeW91IHNlZWssICdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICsgJ0lcXCdtIG9uIG15IHdheSB0aGVyZSBub3c7IHdvdWxkIHlvdSBsaWtlIHRvIGpvaW4gbWU/XCInKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdXaGF0IGRvIHlvdSBkbz8nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnYWNjZXB0Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBY2NlcHQgaGVyIG9mZmVyJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6ICdhY2NlcHQnfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdQb2xpdGVseSBEZWNsaW5lJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6ICdsZWF2ZSd9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnYWNjZXB0Jzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1lvdSBob3AgaW4gdGhlIGNhcnJpYWdlIHdpdGggdGhlIG9sZCB3b21hbi4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdTaGUgdHVybnMgb3V0IHRvIGJlIHByZXR0eSBjb29sLCBhbmQgZ2l2ZXMgeW91IG9uZSBvZiB0aG9zZSBoYXJkIGNhbmRpZXMgdGhhdCAnIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICArICdldmVyeSBncmFuZHBhcmVudCBzZWVtcyB0byBoYXZlIG9uIHRoZSBlbmQgdGFibGUgbmV4dCB0byB0aGVpciBzb2ZhLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0JlZm9yZSBsb25nLCB5b3UgcmVhY2ggdGhlIE91dHBvc3QuIFlvdSBob3Agb3V0IGFuZCB0aGFuayB0aGUgb2xkIHdvbWFuIGZvciB0aGUgcmlkZS4nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnV2hhdCBhIG5pY2Ugb2xkIGxhZHknKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRTTS5nZXQoJ091dHBvc3Qub3BlbicpID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPdXRwb3N0LmluaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkU00uc2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJywgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hhcmFjdGVyLnNldFF1ZXN0U3RhdHVzKFwibWF5b3JTdXBwbGllc1wiLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDaGFyYWN0ZXIuY2hlY2tRdWVzdFN0YXR1cyhcIm1heW9yU3VwcGxpZXNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRW5naW5lLnRyYXZlbFRvKE91dHBvc3QpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoJ29sZExhZHkuQ2FuZHknKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0l0XFwncyB0b28gZWFybHkgaW4gdGhlIGdhbWUgdG8gYmUgdHJ1c3Rpbmcgd2VpcmQgb2xkIHBlb3BsZSwgbWFuLiBZb3UgcG9saXRlbHkgJyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyAnZGVjbGluZSwgYW5kIHRoZSB3b21hbiBjaHVja2xlcyBzb2Z0bHkgYXMgdGhlIGNhcnJpYWdlIHJvbGxzIG9mZiBpbnRvIHRoZSBkaXN0YW5jZS4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdUaGF0IHNvZnQgY2h1Y2tsZSB0ZWxscyBtZSBldmVyeXRoaW5nIEkgbmVlZCB0byBrbm93IGFib3V0IHdoZXRoZXIgeW91IG1hZGUgdGhlICdcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyAncmlnaHQgY2FsbC4gVGhhdCBoYWQgXCJ0dXJuZWQgaW50byBnaW5nZXJicmVhZFwiIHdyaXR0ZW4gYWxsIG92ZXIgaXQuJylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1llYWggaXQgZGlkJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gT3JnYW4gdHJhdW1hXHJcbiAgICB7XHJcbiAgICAgICAgdGl0bGU6IF8oJ1RoaXMgR3V5IFNlZW1zIEZyaWVuZGx5JyksXHJcbiAgICAgICAgaXNBdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gKEVuZ2luZS5hY3RpdmVNb2R1bGUgPT09IFJvYWRcclxuICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ1JvYWQuZ290UHVuY2hlZCcpID09PSB1bmRlZmluZWQpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICdzdGFydCc6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdBIG1hbiB3YWxrcyB1cCB0byB5b3Ugd2l0aCBhIGJpZyBncmluIG9uIGhpcyBmYWNlLCBhbmQgYmVmb3JlIHlvdSBjYW4gZ3JlZXQgaGltIGhlIHN3aWZ0bHkgc29ja3MgeW91IGluIHRoZSBzdG9tYWNoLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0hlIHdhbGtzIG9mZiB3aGlzdGxpbmcgd2hpbGUgeW91IGdhc3AgZm9yIGJyZWF0aCBpbiB0aGUgZGlydC4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCcuLi4gTWFuLCB3aGF0IGEgZGljay4nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnRnVjayBtZSwgSSBndWVzcycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNob29zZTogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hhcmFjdGVyLmdyYW50UGVyaygndHVtbXlQYWluJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkU00uc2V0KCdSb2FkLmdvdFB1bmNoZWQnLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBBbiBhcG9sb2d5IGZvciBvcmdhbiB0cmF1bWFcclxuICAgIHtcclxuICAgICAgICB0aXRsZTogXygnVGhpcyBGdWNraW5nIEd1eSBBZ2FpbicpLFxyXG4gICAgICAgIGlzQXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChFbmdpbmUuYWN0aXZlTW9kdWxlID09PSBSb2FkXHJcbiAgICAgICAgICAgICAgICAmJiAoJFNNLmdldCgnUm9hZC5nb3RQdW5jaGVkJykgIT09IHVuZGVmaW5lZCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICdzdGFydCc6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdBIG1hbiB3YWxrcyB1cCB0byB5b3Ugd2l0aCBhIGJpZyBncmluIG9uIGhpcyBmYWNlLCBhbmQgYmVmb3JlIHlvdSBjYW4gZ3JlZXQgaGltIGhlIHN3aWZ0bHkuLi4gYXBvbG9naXplcy4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdcIkhleSwgSVxcJ20gcmVhbGx5IHNvcnJ5IGFib3V0IHB1bmNoaW5nIHlvdSBpbiB0aGUgc3RvbWFjaCBiZWZvcmUuIEkgdGhvdWdodCB5b3Ugd2VyZSBzb21lb25lIGVsc2UuIEkgSEFURSB0aGF0IGd1eS5cIicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1lvdVxcJ3JlIG5vdCBzdXJlIHRoaXMgaXMgYSBnb29kIGVub3VnaCByZWFzb24gdG8gbm90IGtpY2sgdGhpcyBndXlcXCdzIGFzcy4gU2VlaW5nIHRoZSBsb29rIG9uIHlvdXIgZmFjZSwgaGUgaGFzdGlseSBjb250aW51ZXMuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnXCJBbnl3YXksIGFzIGEgdG9rZW4gb2YgbXkgYXBvbG9neSwgcGxlYXNlIGFjY2VwdCB0aGlzIGhlYWxpbmcgdG9uaWMsIGFzIHdlbGwgYXMgYSBjb3Vwb24gZm9yIGEgc2VjcmV0IGl0ZW0gZnJvbSB0aGUgc3RvcmUgaW4gdGhlIHZpbGxhZ2UuXCInKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdZb3Ugc29tZXdoYXQgYXdrd2FyZGx5IGFjY2VwdCBib3RoIG9mIHRoZXNlIGl0ZW1zLCB0aG91Z2ggeW91IGRvblxcJ3QgdGhpbmsgdGhlcmVcXCdzIGEgc3RvcmUgaW4gdGhlIHZpLScpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1wiT2gsIGFuZCBJXFwnbSB0aGUgb3duZXIgb2YgdGhlIHN0b3JlIGluIHRoZSB2aWxsYWdlLiBJIG9wZW5lZCBpdCBiYWNrIHVwIGFmdGVyIHB1bmNoaW5nIHlvdS4gWW91IGtub3csIHRvIGNlbGVicmF0ZS5cIicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1RoZSBtYW4gd2Fsa3Mgb2ZmLCBzdGlsbCBncmlubmluZy4nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnLi4uIEFscmlnaHQnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdpdmUgaGVhbGluZyB0b25pY1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2l2ZSBjb3Vwb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVubG9jayBzdG9yZSBidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRTTS5zZXQoJ1JvYWQuZ290QXBvbG9naXplZCcsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIFVubG9jayBPdXRwb3N0XHJcbiAgICB7XHJcbiAgICAgICAgdGl0bGU6IF8oJ0EgV2F5IEZvcndhcmQgTWFrZXMgSXRzZWxmIEtub3duJyksXHJcbiAgICAgICAgaXNBdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgKEVuZ2luZS5hY3RpdmVNb2R1bGUgPT09IFJvYWQpXHJcbiAgICAgICAgICAgICAgICAmJiAoJFNNLmdldCgnUm9hZC5jb3VudGVyJykgYXMgbnVtYmVyID4gMykgLy8gY2FuJ3QgaGFwcGVuIFRPTyBlYXJseVxyXG4gICAgICAgICAgICAgICAgJiYgKCRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSA9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICB8fCAkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyIDwgMSkgLy8gY2FuJ3QgaGFwcGVuIHR3aWNlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpc1N1cGVyTGlrZWx5OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuICgoKCAkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfHwgJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpIGFzIG51bWJlciA8IDEpKSBcclxuICAgICAgICAgICAgICAgICAgICAmJiAoJFNNLmdldCgnUm9hZC5jb3VudGVyJykgYXMgbnVtYmVyID4gNyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgJ3N0YXJ0Jzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1Ntb2tlIGN1cmxzIHVwd2FyZHMgZnJvbSBiZWhpbmQgYSBoaWxsLiBZb3UgY2xpbWIgaGlnaGVyIHRvIGludmVzdGlnYXRlLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0Zyb20geW91ciBlbGV2YXRlZCBwb3NpdGlvbiwgeW91IGNhbiBzZWUgZG93biBpbnRvIHRoZSBvdXRwb3N0IHRoYXQgdGhlIG1heW9yIHNwb2tlIG9mIGJlZm9yZS4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdUaGUgT3V0cG9zdCBpcyBub3cgb3BlbiB0byB5b3UuJylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0EgbGl0dGxlIGRyYW1hdGljLCBidXQgY29vbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBPdXRwb3N0LmluaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRTTS5zZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENoYXJhY3Rlci5zZXRRdWVzdFN0YXR1cyhcIm1heW9yU3VwcGxpZXNcIiwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDaGFyYWN0ZXIuY2hlY2tRdWVzdFN0YXR1cyhcIm1heW9yU3VwcGxpZXNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5dO1xyXG5cclxuIiwiLyoqXHJcbiAqIE1vZHVsZSB0aGF0IHRha2VzIGNhcmUgb2YgaGVhZGVyIGJ1dHRvbnNcclxuICovXHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuL2VuZ2luZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEhlYWRlciA9IHtcclxuXHRcclxuXHRpbml0OiBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdH0sXHJcblx0XHJcblx0b3B0aW9uczoge30sIC8vIE5vdGhpbmcgZm9yIG5vd1xyXG5cdFxyXG5cdGNhblRyYXZlbDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gJCgnZGl2I2hlYWRlciBkaXYuaGVhZGVyQnV0dG9uJykubGVuZ3RoID4gMTtcclxuXHR9LFxyXG5cdFxyXG5cdGFkZExvY2F0aW9uOiBmdW5jdGlvbih0ZXh0LCBpZCwgbW9kdWxlKSB7XHJcblx0XHRyZXR1cm4gJCgnPGRpdj4nKS5hdHRyKCdpZCcsIFwibG9jYXRpb25fXCIgKyBpZClcclxuXHRcdFx0LmFkZENsYXNzKCdoZWFkZXJCdXR0b24nKVxyXG5cdFx0XHQudGV4dCh0ZXh0KS5jbGljayhmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZihIZWFkZXIuY2FuVHJhdmVsKCkpIHtcclxuXHRcdFx0XHRcdEVuZ2luZS50cmF2ZWxUbyhtb2R1bGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSkuYXBwZW5kVG8oJCgnZGl2I2hlYWRlcicpKTtcclxuXHR9XHJcbn07IiwiLyoqXHJcbiAqIE1vZHVsZSB0aGF0IHJlZ2lzdGVycyB0aGUgbm90aWZpY2F0aW9uIGJveCBhbmQgaGFuZGxlcyBtZXNzYWdlc1xyXG4gKi9cclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4vZW5naW5lXCI7XHJcblxyXG5leHBvcnQgY29uc3QgTm90aWZpY2F0aW9ucyA9IHtcclxuXHRcdFxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdFx0XHJcblx0XHQvLyBDcmVhdGUgdGhlIG5vdGlmaWNhdGlvbnMgYm94XHJcblx0XHRjb25zdCBlbGVtID0gJCgnPGRpdj4nKS5hdHRyKHtcclxuXHRcdFx0aWQ6ICdub3RpZmljYXRpb25zJyxcclxuXHRcdFx0Y2xhc3NOYW1lOiAnbm90aWZpY2F0aW9ucydcclxuXHRcdH0pO1xyXG5cdFx0Ly8gQ3JlYXRlIHRoZSB0cmFuc3BhcmVuY3kgZ3JhZGllbnRcclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnbm90aWZ5R3JhZGllbnQnKS5hcHBlbmRUbyhlbGVtKTtcclxuXHRcdFxyXG5cdFx0ZWxlbS5hcHBlbmRUbygnZGl2I3dyYXBwZXInKTtcclxuXHR9LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHt9LCAvLyBOb3RoaW5nIGZvciBub3dcclxuXHRcclxuXHRlbGVtOiBudWxsLFxyXG5cdFxyXG5cdG5vdGlmeVF1ZXVlOiB7fSxcclxuXHRcclxuXHQvLyBBbGxvdyBub3RpZmljYXRpb24gdG8gdGhlIHBsYXllclxyXG5cdG5vdGlmeTogZnVuY3Rpb24obW9kdWxlLCB0ZXh0LCBub1F1ZXVlPykge1xyXG5cdFx0aWYodHlwZW9mIHRleHQgPT0gJ3VuZGVmaW5lZCcpIHJldHVybjtcclxuXHRcdC8vIEkgZG9uJ3QgbmVlZCB5b3UgcHVuY3R1YXRpbmcgZm9yIG1lLCBmdW5jdGlvbi5cclxuXHRcdC8vIGlmKHRleHQuc2xpY2UoLTEpICE9IFwiLlwiKSB0ZXh0ICs9IFwiLlwiO1xyXG5cdFx0aWYobW9kdWxlICE9IG51bGwgJiYgRW5naW5lLmFjdGl2ZU1vZHVsZSAhPSBtb2R1bGUpIHtcclxuXHRcdFx0aWYoIW5vUXVldWUpIHtcclxuXHRcdFx0XHRpZih0eXBlb2YgdGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdID09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0XHR0aGlzLm5vdGlmeVF1ZXVlW21vZHVsZV0gPSBbXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdLnB1c2godGV4dCk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdE5vdGlmaWNhdGlvbnMucHJpbnRNZXNzYWdlKHRleHQpO1xyXG5cdFx0fVxyXG5cdFx0RW5naW5lLnNhdmVHYW1lKCk7XHJcblx0fSxcclxuXHRcclxuXHRjbGVhckhpZGRlbjogZnVuY3Rpb24oKSB7XHJcblx0XHJcblx0XHQvLyBUbyBmaXggc29tZSBtZW1vcnkgdXNhZ2UgaXNzdWVzLCB3ZSBjbGVhciBub3RpZmljYXRpb25zIHRoYXQgaGF2ZSBiZWVuIGhpZGRlbi5cclxuXHRcdFxyXG5cdFx0Ly8gV2UgdXNlIHBvc2l0aW9uKCkudG9wIGhlcmUsIGJlY2F1c2Ugd2Uga25vdyB0aGF0IHRoZSBwYXJlbnQgd2lsbCBiZSB0aGUgc2FtZSwgc28gdGhlIHBvc2l0aW9uIHdpbGwgYmUgdGhlIHNhbWUuXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHR2YXIgYm90dG9tID0gJCgnI25vdGlmeUdyYWRpZW50JykucG9zaXRpb24oKS50b3AgKyAkKCcjbm90aWZ5R3JhZGllbnQnKS5vdXRlckhlaWdodCh0cnVlKTtcclxuXHRcdFxyXG5cdFx0JCgnLm5vdGlmaWNhdGlvbicpLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcclxuXHRcdFx0aWYoJCh0aGlzKS5wb3NpdGlvbigpLnRvcCA+IGJvdHRvbSl7XHJcblx0XHRcdFx0JCh0aGlzKS5yZW1vdmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdH0sXHJcblx0XHJcblx0cHJpbnRNZXNzYWdlOiBmdW5jdGlvbih0KSB7XHJcblx0XHR2YXIgdGV4dCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ25vdGlmaWNhdGlvbicpLmNzcygnb3BhY2l0eScsICcwJykudGV4dCh0KS5wcmVwZW5kVG8oJ2RpdiNub3RpZmljYXRpb25zJyk7XHJcblx0XHR0ZXh0LmFuaW1hdGUoe29wYWNpdHk6IDF9LCA1MDAsICdsaW5lYXInLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly8gRG8gdGhpcyBldmVyeSB0aW1lIHdlIGFkZCBhIG5ldyBtZXNzYWdlLCB0aGlzIHdheSB3ZSBuZXZlciBoYXZlIGEgbGFyZ2UgYmFja2xvZyB0byBpdGVyYXRlIHRocm91Z2guIEtlZXBzIHRoaW5ncyBmYXN0ZXIuXHJcblx0XHRcdE5vdGlmaWNhdGlvbnMuY2xlYXJIaWRkZW4oKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0XHJcblx0cHJpbnRRdWV1ZTogZnVuY3Rpb24obW9kdWxlKSB7XHJcblx0XHRpZih0eXBlb2YgdGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdICE9ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdHdoaWxlKHRoaXMubm90aWZ5UXVldWVbbW9kdWxlXS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9ucy5wcmludE1lc3NhZ2UodGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdLnNoaWZ0KCkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCB7IEVuZ2luZSB9IGZyb20gJy4uL2VuZ2luZSc7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gJy4uL3N0YXRlX21hbmFnZXInO1xyXG5pbXBvcnQgeyBXZWF0aGVyIH0gZnJvbSAnLi4vd2VhdGhlcic7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCB7IENhcHRhaW4gfSBmcm9tICcuLi9jaGFyYWN0ZXJzL2NhcHRhaW4nO1xyXG5pbXBvcnQgeyBIZWFkZXIgfSBmcm9tICcuLi9oZWFkZXInO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSAnLi4vLi4vbGliL3RyYW5zbGF0ZSc7XHJcbmltcG9ydCB7IF90YiB9IGZyb20gJy4uLy4uL2xpYi90ZXh0QnVpbGRlcic7XHJcblxyXG5leHBvcnQgY29uc3QgT3V0cG9zdCA9IHtcclxuXHRkZXNjcmlwdGlvbjogW1xyXG5cdFx0XyhcIllvdSdyZSBpbiBhIHNtYWxsIGJ1dCBidXN0bGluZyBtaWxpdGFyeSBPdXRwb3N0LiBWYXJpb3VzIG1lbWJlcnMgXCIgXHJcblx0XHRcdCsgXCJvZiB0aGUgcmFuay1hbmQtZmlsZSBnbyBhYm91dCB0aGVpciBidXNpbmVzcywgcGF5aW5nIHlvdSBsaXR0bGUgbWluZC5cIiksXHJcblx0XHRfKFwiT25lIHRlbnQgc3RhbmRzIG91dCBmcm9tIHRoZSByZXN0OyB0aGUgZmluZWx5LWVtYnJvaWRlcmVkIGRldGFpbHMgYW5kIFwiICsgXHJcblx0XHRcdFwiZ29sZGVuIGljb24gYWJvdmUgdGhlIGVudHJhbmNlIG1hcmsgaXQgYXMgdGhlIGNvbW1hbmRpbmcgb2ZmaWNlcidzIHF1YXJ0ZXJzLlwiKVxyXG5cdF0sXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgdGhlIE91dHBvc3QgdGFiXHJcbiAgICAgICAgdGhpcy50YWIgPSBIZWFkZXIuYWRkTG9jYXRpb24oXyhcIlRoZSBPdXRwb3N0XCIpLCBcIm91dHBvc3RcIiwgT3V0cG9zdCk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgT3V0cG9zdCBwYW5lbFxyXG5cdFx0dGhpcy5wYW5lbCA9ICQoJzxkaXY+JylcclxuICAgICAgICAuYXR0cignaWQnLCBcIm91dHBvc3RQYW5lbFwiKVxyXG4gICAgICAgIC5hZGRDbGFzcygnbG9jYXRpb24nKVxyXG4gICAgICAgIC5hcHBlbmRUbygnZGl2I2xvY2F0aW9uU2xpZGVyJyk7XHJcblxyXG5cdFx0dGhpcy5kZXNjcmlwdGlvblBhbmVsID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdkZXNjcmlwdGlvbicpLmFwcGVuZFRvKHRoaXMucGFuZWwpO1xyXG5cdFx0dGhpcy51cGRhdGVEZXNjcmlwdGlvbigpO1xyXG5cclxuICAgICAgICBFbmdpbmUudXBkYXRlU2xpZGVyKCk7XHJcblxyXG4gICAgICAgIC8vIG5ldyBcclxuXHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogJ2NhcHRhaW5CdXR0b24nLFxyXG5cdFx0XHR0ZXh0OiBfKCdTcGVhayB3aXRoIFRoZSBDYXB0YWluJyksXHJcblx0XHRcdGNsaWNrOiBDYXB0YWluLnRhbGtUb0NhcHRhaW4sXHJcblx0XHRcdHdpZHRoOiAnODBweCdcclxuXHRcdH0pXHJcblx0XHQuYWRkQ2xhc3MoJ2xvY2F0aW9uQnV0dG9uJylcclxuXHRcdC5hcHBlbmRUbygnZGl2I291dHBvc3RQYW5lbCcpO1xyXG5cclxuICAgICAgICBPdXRwb3N0LnVwZGF0ZUJ1dHRvbigpO1xyXG5cclxuICAgICAgICAvLyBzZXR0aW5nIHRoaXMgc2VwYXJhdGVseSBzbyB0aGF0IHF1ZXN0IHN0YXR1cyBjYW4ndCBhY2NpZGVudGFsbHkgYnJlYWsgaXQgbGF0ZXJcclxuICAgICAgICAkU00uc2V0KCdPdXRwb3N0Lm9wZW4nLCAxKTsgXHJcbiAgICB9LFxyXG5cclxuXHR1cGRhdGVEZXNjcmlwdGlvbjogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLmRlc2NyaXB0aW9uUGFuZWwuZW1wdHkoKTtcclxuXHRcdHRoaXMuZGVzY3JpcHRpb24gPSBfdGIoW1xyXG5cdFx0XHRfKFwiWW91J3JlIG9uIGEgZHVzdHkgcm9hZCBiZXR3ZWVuIHRoZSBWaWxsYWdlIGFuZCB0aGUgT3V0cG9zdC4gVGhlIHJvYWQgY3V0cyB0aHJvdWdoIFwiIFxyXG5cdFx0XHRcdCsgXCJ0YWxsIGdyYXNzLCBicnVzaCwgYW5kIHRyZWVzLCBsaW1pdGluZyB2aXNpYmlsaXR5IGFuZCBlbnN1cmluZyB0aGF0IHlvdSdsbCBoYXZlIFwiIFxyXG5cdFx0XHRcdCsgXCJ0byBkZWFsIHdpdGggc29tZSBub25zZW5zZS5cIiksXHJcblx0XHRcdF8oXCJUaGUgaGFpciBvbiB0aGUgYmFjayBvZiB5b3VyIG5lY2sgcHJpY2tsZXMgc2xpZ2h0bHkgaW4gYW50aWNpcGF0aW9uLlwiKVxyXG5cdFx0XSk7XHJcblxyXG5cdFx0Zm9yKHZhciBpIGluIHRoaXMuZGVzY3JpcHRpb24pIHtcclxuXHRcdFx0JCgnPGRpdj4nKS50ZXh0KHRoaXMuZGVzY3JpcHRpb25baV0pLmFwcGVuZFRvKHRoaXMuZGVzY3JpcHRpb25QYW5lbCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcbiAgICBhdmFpbGFibGVXZWF0aGVyOiB7XHJcblx0XHQnc3VubnknOiAwLjQsXHJcblx0XHQnY2xvdWR5JzogMC4zLFxyXG5cdFx0J3JhaW55JzogMC4zXHJcblx0fSxcclxuXHJcbiAgICBvbkFycml2YWw6IGZ1bmN0aW9uKHRyYW5zaXRpb25fZGlmZikge1xyXG4gICAgICAgIE91dHBvc3Quc2V0VGl0bGUoKTtcclxuXHJcbiAgICAgICAgV2VhdGhlci5pbml0aWF0ZVdlYXRoZXIoT3V0cG9zdC5hdmFpbGFibGVXZWF0aGVyLCAnb3V0cG9zdCcpO1xyXG5cclxuXHRcdHRoaXMudXBkYXRlRGVzY3JpcHRpb24oKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0VGl0bGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRpdGxlID0gXyhcIlRoZSBPdXRwb3N0XCIpO1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSB0aGlzKSB7XHJcblx0XHRcdGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XHJcblx0XHR9XHJcblx0XHQkKCdkaXYjbG9jYXRpb25fb3V0cG9zdCcpLnRleHQodGl0bGUpO1xyXG5cdH0sXHJcblxyXG4gICAgdXBkYXRlQnV0dG9uOiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIGNvbmRpdGlvbmFscyBmb3IgdXBkYXRpbmcgYnV0dG9uc1xyXG5cdH1cclxufSIsImltcG9ydCB7IEhlYWRlciB9IGZyb20gXCIuLi9oZWFkZXJcIjtcclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4uL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi4vQnV0dG9uXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyBXZWF0aGVyIH0gZnJvbSBcIi4uL3dlYXRoZXJcIjtcclxuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5pbXBvcnQgeyBfdGIgfSBmcm9tIFwiLi4vLi4vbGliL3RleHRCdWlsZGVyXCI7XHJcblxyXG5leHBvcnQgY29uc3QgUm9hZCA9IHtcclxuXHRkZXNjcmlwdGlvbjogbnVsbCxcclxuXHRkZXNjcmlwdGlvblBhbmVsOiBudWxsLFxyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBSb2FkIHRhYlxyXG4gICAgICAgIHRoaXMudGFiID0gSGVhZGVyLmFkZExvY2F0aW9uKF8oXCJSb2FkIHRvIHRoZSBPdXRwb3N0XCIpLCBcInJvYWRcIiwgUm9hZCk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgUm9hZCBwYW5lbFxyXG5cdFx0dGhpcy5wYW5lbCA9ICQoJzxkaXY+JylcclxuICAgICAgICAuYXR0cignaWQnLCBcInJvYWRQYW5lbFwiKVxyXG4gICAgICAgIC5hZGRDbGFzcygnbG9jYXRpb24nKVxyXG4gICAgICAgIC5hcHBlbmRUbygnZGl2I2xvY2F0aW9uU2xpZGVyJyk7XHJcblxyXG5cdFx0dGhpcy5kZXNjcmlwdGlvblBhbmVsID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdkZXNjcmlwdGlvbicpLmFwcGVuZFRvKHRoaXMucGFuZWwpO1xyXG5cdFx0dGhpcy51cGRhdGVEZXNjcmlwdGlvbigpO1xyXG5cclxuICAgICAgICBFbmdpbmUudXBkYXRlU2xpZGVyKCk7XHJcblxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAnd2FuZGVyQnV0dG9uJyxcclxuXHRcdFx0dGV4dDogXygnV2FuZGVyIEFyb3VuZCcpLFxyXG5cdFx0XHRjbGljazogUm9hZC53YW5kZXJFdmVudCxcclxuXHRcdFx0d2lkdGg6ICc4MHB4JyxcclxuXHRcdFx0Y29zdDoge30gLy8gVE9ETzogbWFrZSB0aGVyZSBiZSBhIGNvc3QgdG8gZG9pbmcgc3R1ZmY/XHJcblx0XHR9KVxyXG5cdFx0LmFkZENsYXNzKCdsb2NhdGlvbkJ1dHRvbicpXHJcblx0XHQuYXBwZW5kVG8oJ2RpdiNyb2FkUGFuZWwnKTtcclxuXHJcbiAgICAgICAgUm9hZC51cGRhdGVCdXR0b24oKTtcclxuXHJcbiAgICAgICAgLy8gc2V0dGluZyB0aGlzIHNlcGFyYXRlbHkgc28gdGhhdCBxdWVzdCBzdGF0dXMgY2FuJ3QgYWNjaWRlbnRhbGx5IGJyZWFrIGl0IGxhdGVyXHJcbiAgICAgICAgJFNNLnNldCgnUm9hZC5vcGVuJywgMSk7IFxyXG4gICAgfSxcclxuXHJcblx0dXBkYXRlRGVzY3JpcHRpb246IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5kZXNjcmlwdGlvblBhbmVsLmVtcHR5KCk7XHJcblx0XHR0aGlzLmRlc2NyaXB0aW9uID0gX3RiKFtcclxuXHRcdFx0XyhcIllvdSdyZSBvbiBhIGR1c3R5IHJvYWQgYmV0d2VlbiB0aGUgVmlsbGFnZSBhbmQgdGhlIE91dHBvc3QuIFRoZSByb2FkIGN1dHMgdGhyb3VnaCBcIiBcclxuXHRcdFx0XHQrIFwidGFsbCBncmFzcywgYnJ1c2gsIGFuZCB0cmVlcywgbGltaXRpbmcgdmlzaWJpbGl0eSBhbmQgZW5zdXJpbmcgdGhhdCB5b3UnbGwgaGF2ZSBcIiBcclxuXHRcdFx0XHQrIFwidG8gZGVhbCB3aXRoIHNvbWUgbm9uc2Vuc2UuXCIpLFxyXG5cdFx0XHRfKFwiVGhlIGhhaXIgb24gdGhlIGJhY2sgb2YgeW91ciBuZWNrIHByaWNrbGVzIHNsaWdodGx5IGluIGFudGljaXBhdGlvbi5cIilcclxuXHRcdF0pO1xyXG5cclxuXHRcdGZvcih2YXIgaSBpbiB0aGlzLmRlc2NyaXB0aW9uKSB7XHJcblx0XHRcdCQoJzxkaXY+JykudGV4dCh0aGlzLmRlc2NyaXB0aW9uW2ldKS5hcHBlbmRUbyh0aGlzLmRlc2NyaXB0aW9uUGFuZWwpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG4gICAgYXZhaWxhYmxlV2VhdGhlcjoge1xyXG5cdFx0J3N1bm55JzogMC40LFxyXG5cdFx0J2Nsb3VkeSc6IDAuMyxcclxuXHRcdCdyYWlueSc6IDAuM1xyXG5cdH0sXHJcblxyXG4gICAgb25BcnJpdmFsOiBmdW5jdGlvbih0cmFuc2l0aW9uX2RpZmYpIHtcclxuICAgICAgICBSb2FkLnNldFRpdGxlKCk7XHJcblxyXG4gICAgICAgIFdlYXRoZXIuaW5pdGlhdGVXZWF0aGVyKFJvYWQuYXZhaWxhYmxlV2VhdGhlciwgJ3JvYWQnKTtcclxuXHJcblx0XHR0aGlzLnVwZGF0ZURlc2NyaXB0aW9uKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldFRpdGxlOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0aXRsZSA9IF8oXCJSb2FkIHRvIHRoZSBPdXRwb3N0XCIpO1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSB0aGlzKSB7XHJcblx0XHRcdGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XHJcblx0XHR9XHJcblx0XHQkKCdkaXYjbG9jYXRpb25fcm9hZCcpLnRleHQodGl0bGUpO1xyXG5cdH0sXHJcblxyXG4gICAgdXBkYXRlQnV0dG9uOiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIGNvbmRpdGlvbmFscyBmb3IgdXBkYXRpbmcgYnV0dG9uc1xyXG5cdH0sXHJcblxyXG5cdHdhbmRlckV2ZW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy50cmlnZ2VyTG9jYXRpb25FdmVudCgnUm9hZFdhbmRlcicpO1xyXG5cdFx0JFNNLmFkZCgnUm9hZC5jb3VudGVyJywgMSk7XHJcblx0fVxyXG59IiwiLyoqXHJcbiAqIE1vZHVsZSB0aGF0IHJlZ2lzdGVycyB0aGUgc2ltcGxlIHJvb20gZnVuY3Rpb25hbGl0eVxyXG4gKi9cclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4uL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi4vQnV0dG9uXCI7XHJcbmltcG9ydCB7IFdlYXRoZXIgfSBmcm9tIFwiLi4vd2VhdGhlclwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgSGVhZGVyIH0gZnJvbSBcIi4uL2hlYWRlclwiO1xyXG5pbXBvcnQgeyBMaXogfSBmcm9tIFwiLi4vY2hhcmFjdGVycy9saXpcIjtcclxuaW1wb3J0IHsgTWF5b3IgfSBmcm9tIFwiLi4vY2hhcmFjdGVycy9tYXlvclwiO1xyXG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcbmltcG9ydCB7IF90YiB9IGZyb20gXCIuLi8uLi9saWIvdGV4dEJ1aWxkZXJcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBWaWxsYWdlID0ge1xyXG5cclxuXHRidXR0b25zOnt9LFxyXG5cdFxyXG5cdGNoYW5nZWQ6IGZhbHNlLFxyXG5cclxuXHRkZXNjcmlwdGlvbjogW10sXHJcblx0ZGVzY3JpcHRpb25QYW5lbDogbnVsbCxcclxuXHRcclxuXHRuYW1lOiBfKFwiVmlsbGFnZVwiKSxcclxuXHRpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHRcdFxyXG5cdFx0aWYoRW5naW5lLl9kZWJ1Zykge1xyXG5cdFx0XHR0aGlzLl9ST09NX1dBUk1fREVMQVkgPSA1MDAwO1xyXG5cdFx0XHR0aGlzLl9CVUlMREVSX1NUQVRFX0RFTEFZID0gNTAwMDtcclxuXHRcdFx0dGhpcy5fU1RPS0VfQ09PTERPV04gPSAwO1xyXG5cdFx0XHR0aGlzLl9ORUVEX1dPT0RfREVMQVkgPSA1MDAwO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBDcmVhdGUgdGhlIFZpbGxhZ2UgdGFiXHJcblx0XHR0aGlzLnRhYiA9IEhlYWRlci5hZGRMb2NhdGlvbihfKFwiQSBDaGlsbCBWaWxsYWdlXCIpLCBcInZpbGxhZ2VcIiwgVmlsbGFnZSk7XHJcblx0XHRcclxuXHRcdC8vIENyZWF0ZSB0aGUgVmlsbGFnZSBwYW5lbFxyXG5cdFx0dGhpcy5wYW5lbCA9ICQoJzxkaXY+JylcclxuXHRcdFx0LmF0dHIoJ2lkJywgXCJ2aWxsYWdlUGFuZWxcIilcclxuXHRcdFx0LmFkZENsYXNzKCdsb2NhdGlvbicpXHJcblx0XHRcdC5hcHBlbmRUbygnZGl2I2xvY2F0aW9uU2xpZGVyJyk7XHJcblxyXG5cdFx0dGhpcy5kZXNjcmlwdGlvblBhbmVsID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdkZXNjcmlwdGlvbicpLmFwcGVuZFRvKHRoaXMucGFuZWwpO1xyXG5cdFx0dGhpcy51cGRhdGVEZXNjcmlwdGlvbigpO1xyXG5cclxuXHRcdEVuZ2luZS51cGRhdGVTbGlkZXIoKTtcclxuXHJcblx0XHRCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6ICd0YWxrQnV0dG9uJyxcclxuXHRcdFx0dGV4dDogXygnVGFsayB0byB0aGUgTWF5b3InKSxcclxuXHRcdFx0Y2xpY2s6IE1heW9yLnRhbGtUb01heW9yLFxyXG5cdFx0XHR3aWR0aDogJzgwcHgnLFxyXG5cdFx0XHRjb3N0OiB7fVxyXG5cdFx0fSlcclxuXHRcdC5hZGRDbGFzcygnbG9jYXRpb25CdXR0b24nKVxyXG5cdFx0LmFwcGVuZFRvKCdkaXYjdmlsbGFnZVBhbmVsJyk7XHJcblxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAnbGl6QnV0dG9uJyxcclxuXHRcdFx0dGV4dDogXygnVGFsayB0byBMaXonKSxcclxuXHRcdFx0Y2xpY2s6IExpei50YWxrVG9MaXosXHJcblx0XHRcdHdpZHRoOiAnODBweCcsXHJcblx0XHRcdGNvc3Q6IHt9XHJcblx0XHR9KVxyXG5cdFx0LmFkZENsYXNzKCdsb2NhdGlvbkJ1dHRvbicpXHJcblx0XHQuYXBwZW5kVG8oJ2RpdiN2aWxsYWdlUGFuZWwnKTtcclxuXHJcblx0XHRCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6ICduZXdCdWlsZGluZ0J1dHRvbicsXHJcblx0XHRcdHRleHQ6IF8oJ0NoZWNrIG91dCB0aGUgbmV3IGJ1aWxkaW5nJyksXHJcblx0XHRcdGNsaWNrOiBWaWxsYWdlLnRlbXBCdWlsZGluZ01lc3NhZ2UsXHJcblx0XHRcdHdpZHRoOiAnODBweCcsXHJcblx0XHRcdGNvc3Q6IHt9XHJcblx0XHR9KVxyXG5cdFx0LmFkZENsYXNzKCdsb2NhdGlvbkJ1dHRvbicpXHJcblx0XHQuYXBwZW5kVG8oJ2RpdiN2aWxsYWdlUGFuZWwnKTtcclxuXHJcblx0XHR2YXIgYnVpbGRpbmdCdXR0b24gPSAkKCcjbmV3QnVpbGRpbmdCdXR0b24uYnV0dG9uJyk7XHJcblx0XHRidWlsZGluZ0J1dHRvbi5oaWRlKCk7XHJcblxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAnc3RvcmVCdXR0b24nLFxyXG5cdFx0XHR0ZXh0OiBfKCdHbyB0byB0aGUgU3RvcmUnKSxcclxuXHRcdFx0Y2xpY2s6IFZpbGxhZ2Uub3BlblN0b3JlLFxyXG5cdFx0XHR3aWR0aDogJzgwcHgnLFxyXG5cdFx0XHRjb3N0OiB7fVxyXG5cdFx0fSlcclxuXHRcdC5hZGRDbGFzcygnbG9jYXRpb25CdXR0b24nKVxyXG5cdFx0LmFwcGVuZFRvKCdkaXYjdmlsbGFnZVBhbmVsJyk7XHJcblxyXG5cdFx0dmFyIHN0b3JlQnV0dG9uID0gJCgnI3N0b3JlQnV0dG9uLmJ1dHRvbicpO1xyXG5cdFx0c3RvcmVCdXR0b24uaGlkZSgpO1xyXG5cclxuXHRcdHZhciBsaXpCdXR0b24gPSAkKCcjbGl6QnV0dG9uLmJ1dHRvbicpO1xyXG5cdFx0bGl6QnV0dG9uLmhpZGUoKTtcclxuXHRcdFxyXG5cdFx0Ly8gQ3JlYXRlIHRoZSBzdG9yZXMgY29udGFpbmVyXHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ3N0b3Jlc0NvbnRhaW5lcicpLmFwcGVuZFRvKCdkaXYjdmlsbGFnZVBhbmVsJyk7XHJcblx0XHRcclxuXHRcdC8vc3Vic2NyaWJlIHRvIHN0YXRlVXBkYXRlc1xyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5zdWJzY3JpYmUoVmlsbGFnZS5oYW5kbGVTdGF0ZVVwZGF0ZXMpO1xyXG5cdFx0XHJcblx0XHRWaWxsYWdlLnVwZGF0ZUJ1dHRvbigpO1xyXG5cdH0sXHJcblxyXG5cdHVwZGF0ZURlc2NyaXB0aW9uOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuZGVzY3JpcHRpb25QYW5lbC5lbXB0eSgpO1xyXG5cdFx0dGhpcy5kZXNjcmlwdGlvbiA9IF90YihbXHJcblx0XHRcdF8oXCJOZXN0bGVkIGluIHRoZSB3b29kcywgdGhpcyB2aWxsYWdlIGlzIHNjYXJjZWx5IG1vcmUgdGhhbiBhIGhhbWxldCwgXCIgXHJcblx0XHRcdFx0KyBcImRlc3BpdGUgeW91IHRoaW5raW5nIHRob3NlIHR3byB3b3JkcyBhcmUgc3lub255bXMuIFRoZXkncmUgbm90LCBcIiBcclxuXHRcdFx0XHQrIFwiZ28gZ29vZ2xlICdoYW1sZXQnIHJpZ2h0IG5vdyBpZiB5b3UgZG9uJ3QgYmVsaWV2ZSBtZS5cIiksXHJcblx0XHRcdF8oXCJUaGUgdmlsbGFnZSBpcyBxdWlldCBhdCB0aGUgbW9tZW50OyB0aGVyZSBhcmVuJ3QgZW5vdWdoIGhhbmRzIGZvciBhbnlvbmUgdG8gcmVtYWluIGlkbGUgZm9yIGxvbmcuXCIpLFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dGV4dDogXyhcIkEgc3RvcmVmcm9udCwgc3RhZmZlZCBlbnRpcmVseSBieSBhIHNpbmdsZSBncmlubmluZyBqYWNrYXNzLCBzdGFuZHMgcHJvdWRseSBpbiB0aGUgbWFpbiBzcXVhcmUuXCIpLFxyXG5cdFx0XHRcdGlzVmlzaWJsZTogKCkgPT4ge1xyXG5cdFx0XHRcdFx0cmV0dXJuICRTTS5nZXQoJ1JvYWQuZ290QXBvbG9naXplZCcpICE9PSB1bmRlZmluZWQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRdKTtcclxuXHJcblx0XHRmb3IodmFyIGkgaW4gdGhpcy5kZXNjcmlwdGlvbikge1xyXG5cdFx0XHQkKCc8ZGl2PicpLnRleHQodGhpcy5kZXNjcmlwdGlvbltpXSkuYXBwZW5kVG8odGhpcy5kZXNjcmlwdGlvblBhbmVsKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHt9LCAvLyBOb3RoaW5nIGZvciBub3dcclxuXHJcblx0YXZhaWxhYmxlV2VhdGhlcjoge1xyXG5cdFx0J3N1bm55JzogMC40LFxyXG5cdFx0J2Nsb3VkeSc6IDAuMyxcclxuXHRcdCdyYWlueSc6IDAuM1xyXG5cdH0sXHJcblx0XHJcblx0b25BcnJpdmFsOiBmdW5jdGlvbih0cmFuc2l0aW9uX2RpZmYpIHtcclxuXHRcdFZpbGxhZ2Uuc2V0VGl0bGUoKTtcclxuXHJcblx0XHR0aGlzLnVwZGF0ZURlc2NyaXB0aW9uKCk7XHJcblxyXG5cdFx0V2VhdGhlci5pbml0aWF0ZVdlYXRoZXIoVmlsbGFnZS5hdmFpbGFibGVXZWF0aGVyLCAndmlsbGFnZScpO1xyXG5cdH0sXHJcblx0XHJcblx0c2V0VGl0bGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRpdGxlID0gXyhcIlRoZSBWaWxsYWdlXCIpO1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSB0aGlzKSB7XHJcblx0XHRcdGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XHJcblx0XHR9XHJcblx0XHQkKCdkaXYjbG9jYXRpb25fdmlsbGFnZScpLnRleHQodGl0bGUpO1xyXG5cdH0sXHJcblx0XHJcblx0dXBkYXRlQnV0dG9uOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBsaXpCdXR0b24gPSAkKCcjbGl6QnV0dG9uLmJ1dHRvbicpO1xyXG5cdFx0aWYoJFNNLmdldCgndmlsbGFnZS5saXpBY3RpdmUnKSkgbGl6QnV0dG9uLnNob3coKTtcclxuXHRcdHZhciBidWlsZGluZ0J1dHRvbiA9ICQoJyNuZXdCdWlsZGluZ0J1dHRvbi5idXR0b24nKTtcclxuXHRcdGlmKCRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnKSkgYnVpbGRpbmdCdXR0b24uc2hvdygpO1xyXG5cdFx0dmFyIHN0b3JlQnV0dG9uID0gJCgnI3N0b3JlQnV0dG9uLmJ1dHRvbicpO1xyXG5cdFx0aWYoJFNNLmdldCgnUm9hZC5nb3RBcG9sb2dpemVkJykpIHN0b3JlQnV0dG9uLnNob3coKTtcclxuXHR9LFxyXG5cdFxyXG5cdFxyXG5cdGhhbmRsZVN0YXRlVXBkYXRlczogZnVuY3Rpb24oZSl7XHJcblx0XHRpZihlLmNhdGVnb3J5ID09ICdzdG9yZXMnKXtcclxuXHRcdFx0Ly8gVmlsbGFnZS51cGRhdGVCdWlsZEJ1dHRvbnMoKTtcclxuXHRcdH0gZWxzZSBpZihlLmNhdGVnb3J5ID09ICdpbmNvbWUnKXtcclxuXHRcdH0gZWxzZSBpZihlLnN0YXRlTmFtZS5pbmRleE9mKCdnYW1lLmJ1aWxkaW5ncycpID09PSAwKXtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHR0ZW1wQnVpbGRpbmdNZXNzYWdlOiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ0EgTmV3IEJ1aWxkaW5nJyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1RoaXMgaXMgYSBuZXcgYnVpbGRpbmcuIFRoZXJlIHNob3VsZCBiZSBzdHVmZiBpbiBpdCwgYnV0IHRoaXMgaXMgYSBwbGFjZWhvbGRlciBmb3Igbm93LicpLFxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0xhbWUnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdG9wZW5TdG9yZTogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdBIE5ldyBCdWlsZGluZycpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKFwiVGhpcyBpcyB0aGUgc3RvcmUuIFRoZXJlJ3Mgbm90aGluZyBoZXJlIHlldCwgdGhvdWdoLlwiKSxcclxuXHRcdFx0XHRcdFx0XyhcIllvdSBmaW5kIGEgZHVzdHkgcGFpciBvZiBkaWNlIGluIHRoZSBjb3JuZXIgYW5kIHRocm93IHRoZW0sIGp1c3QgdG8gc2VlIHdoYXQgaGFwcGVucy5cIilcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRkaWNlOiB7XHJcblx0XHRcdFx0XHRcdGFtb3VudDogMixcclxuXHRcdFx0XHRcdFx0aGFuZGxlcjogKHZhbHMpID0+IHtcclxuXHRcdFx0XHRcdFx0XHRjb25zdCByZXR1cm5UZXh0ID0gW107XHJcblx0XHRcdFx0XHRcdFx0aWYgKCh2YWxzWzBdID09IHZhbHNbMV0pICYmIHZhbHNbMF0gPT0gMSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuVGV4dC5wdXNoKFwiU25ha2UgZXllcyEgSSBmZWVsIGEgbWlsZCBzZW5zZSBvZiBkcmVhZC5cIik7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICh2YWxzWzBdID09IHZhbHNbMV0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVyblRleHQucHVzaChcIldvdywgZG91Ymxlcy4gVGhhdCBzZWVtcyBsdWNreS5cIik7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICgodmFsc1swXSArIHZhbHNbMV0pID09IDcpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVyblRleHQucHVzaChcIk9oLCBuaWNlLiBEbyBJIHdpbiBzb21ldGhpbmc/XCIpO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm5UZXh0LnB1c2goXCJJIHJvbGxlZCBhIFwiICsgKHZhbHNbMF0gKyB2YWxzWzFdKS50b1N0cmluZygpICsgXCIuIFRoYXQgZG9lc24ndCBzZWVtIGVzcGVjaWFsbHkgbm90ZXdvcnRoeS5cIik7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdHJldHVybiByZXR1cm5UZXh0O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0YnV0dG9uczogIHtcclxuXHRcdFx0XHRcdFx0cm9sbDoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ1JvbGwgXFwnZW0gYWdhaW4nKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnc3RhcnQnfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRsZWF2ZToge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0xhbWUnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxufTtcclxuIiwiaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uL0J1dHRvblwiO1xyXG5pbXBvcnQgeyBJdGVtTGlzdCB9IGZyb20gXCIuL2l0ZW1MaXN0XCI7XHJcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgTm90aWZpY2F0aW9ucyB9IGZyb20gXCIuLi9ub3RpZmljYXRpb25zXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyBRdWVzdExvZyB9IGZyb20gXCIuL3F1ZXN0TG9nXCI7XHJcbmltcG9ydCB7IFBlcmtMaXN0IH0gZnJvbSBcIi4vcGVya0xpc3RcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBDaGFyYWN0ZXIgPSB7XHJcblx0aW52ZW50b3J5OiB7fSwgLy8gZGljdGlvbmFyeSB1c2luZyBpdGVtIG5hbWUgYXMga2V5XHJcblx0cXVlc3RTdGF0dXM6IHt9LCAvLyBkaWN0aW9uYXJ5IHVzaW5nIHF1ZXN0IG5hbWUgYXMga2V5LCBhbmQgaW50ZWdlciBxdWVzdCBwaGFzZSBhcyB2YWx1ZVxyXG5cdGVxdWlwcGVkSXRlbXM6IHtcclxuXHRcdC8vIHN0ZWFsaW5nIHRoZSBLb0wgc3R5bGUgZm9yIG5vdywgd2UnbGwgc2VlIGlmIEkgbmVlZCBzb21ldGhpbmdcclxuXHRcdC8vIHRoYXQgZml0cyB0aGUgZ2FtZSBiZXR0ZXIgYXMgd2UgZ29cclxuXHRcdGhlYWQ6IG51bGwsXHJcblx0XHR0b3JzbzogbnVsbCxcclxuXHRcdHBhbnRzOiBudWxsLFxyXG5cdFx0Ly8gbm8gd2VhcG9uLCB0cnkgdG8gc2VlIGhvdyBmYXIgd2UgY2FuIGdldCBpbiB0aGlzIGdhbWUgd2l0aG91dCBmb2N1c2luZyBvbiBjb21iYXRcclxuXHRcdGFjY2Vzc29yeTE6IG51bGwsXHJcblx0XHRhY2Nlc3NvcnkyOiBudWxsLFxyXG5cdFx0YWNjZXNzb3J5MzogbnVsbCxcclxuXHR9LFxyXG5cclxuXHQvLyBzdGF0cyBiZWZvcmUgYW55IG1vZGlmaWVycyBmcm9tIGdlYXIgb3Igd2hhdGV2ZXIgZWxzZSBhcmUgYXBwbGllZFxyXG5cdHJhd1N0YXRzOiB7XHJcblx0XHQnU3BlZWQnOiA1LFxyXG5cdFx0J1BlcmNlcHRpb24nOiA1LFxyXG5cdFx0J1Jlc2lsaWVuY2UnOiA1LFxyXG5cdFx0J0luZ2VudWl0eSc6IDUsXHJcblx0XHQnVG91Z2huZXNzJzogNVxyXG5cdH0sXHJcblxyXG5cdC8vIHBlcmtzIGdpdmVuIGJ5IGl0ZW1zLCBjaGFyYWN0ZXIgY2hvaWNlcywgZGl2aW5lIHByb3ZlbmFuY2UsIGV0Yy5cclxuXHRwZXJrczogeyB9LFxyXG5cdHBlcmtBcmVhOiBudWxsLFxyXG5cdFxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdFx0XHJcblx0XHQvLyBjcmVhdGUgdGhlIGNoYXJhY3RlciBib3hcclxuXHRcdGNvbnN0IGVsZW0gPSAkKCc8ZGl2PicpLmF0dHIoe1xyXG5cdFx0XHRpZDogJ2NoYXJhY3RlcicsXHJcblx0XHRcdGNsYXNzTmFtZTogJ2NoYXJhY3RlcidcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHRlbGVtLmFwcGVuZFRvKCdkaXYjd3JhcHBlcicpO1xyXG5cclxuXHRcdC8vIHdyaXRlIHJhd1N0YXRzIHRvICRTTVxyXG5cdFx0Ly8gTk9URTogbmV2ZXIgd3JpdGUgZGVyaXZlZCBzdGF0cyB0byAkU00sIGFuZCBuZXZlciBhY2Nlc3MgcmF3IHN0YXRzIGRpcmVjdGx5IVxyXG5cdFx0Ly8gZG9pbmcgc28gd2lsbCBpbnRyb2R1Y2Ugb3Bwb3J0dW5pdGllcyB0byBtZXNzIHVwIHN0YXRzIFBFUk1BTkVOVExZXHJcbiAgICAgICAgaWYgKCEkU00uZ2V0KCdjaGFyYWN0ZXIucmF3c3RhdHMnKSkge1xyXG4gICAgICAgICAgICAkU00uc2V0KCdjaGFyYWN0ZXIucmF3c3RhdHMnLCBDaGFyYWN0ZXIucmF3U3RhdHMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5yYXdTdGF0cyA9ICRTTS5nZXQoJ2NoYXJhY3Rlci5yYXdTdGF0cycpIGFzIGFueTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoISRTTS5nZXQoJ2NoYXJhY3Rlci5wZXJrcycpKSB7XHJcbiAgICAgICAgICAgICRTTS5zZXQoJ2NoYXJhY3Rlci5wZXJrcycsIENoYXJhY3Rlci5wZXJrcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHRcdFx0Q2hhcmFjdGVyLnBlcmtzID0gJFNNLmdldCgnY2hhcmFjdGVyLnBlcmtzJykgYXMgYW55O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghJFNNLmdldCgnY2hhcmFjdGVyLmludmVudG9yeScpKSB7XHJcbiAgICAgICAgICAgICRTTS5zZXQoJ2NoYXJhY3Rlci5pbnZlbnRvcnknLCBDaGFyYWN0ZXIuaW52ZW50b3J5KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cdFx0XHRDaGFyYWN0ZXIuaW52ZW50b3J5ID0gJFNNLmdldCgnY2hhcmFjdGVyLmludmVudG9yeScpIGFzIGFueTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoISRTTS5nZXQoJ2NoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zJykpIHtcclxuICAgICAgICAgICAgJFNNLnNldCgnY2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMnLCBDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHRcdFx0Q2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMgPSAkU00uZ2V0KCdjaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcycpIGFzIGFueTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoISRTTS5nZXQoJ2NoYXJhY3Rlci5xdWVzdFN0YXR1cycpKSB7XHJcbiAgICAgICAgICAgICRTTS5zZXQoJ2NoYXJhY3Rlci5xdWVzdFN0YXR1cycsIENoYXJhY3Rlci5xdWVzdFN0YXR1cyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHRcdFx0Q2hhcmFjdGVyLnF1ZXN0U3RhdHVzID0gJFNNLmdldCgnY2hhcmFjdGVyLnF1ZXN0U3RhdHVzJykgYXMgYW55O1xyXG5cdFx0fVxyXG5cclxuICAgICAgICAkKCc8ZGl2PicpLnRleHQoJ0NoYXJhY3RlcicpXHJcblx0XHQuY3NzKCd0ZXh0LWRlY29yYXRpb24nLCAndW5kZXJsaW5lJylcclxuXHRcdC5hdHRyKCdpZCcsICd0aXRsZScpXHJcblx0XHQuYXBwZW5kVG8oJ2RpdiNjaGFyYWN0ZXInKTtcclxuXHJcblx0XHQvLyBUT0RPOiByZXBsYWNlIHRoaXMgd2l0aCBkZXJpdmVkIHN0YXRzXHJcbiAgICAgICAgZm9yKHZhciBzdGF0IGluICRTTS5nZXQoJ2NoYXJhY3Rlci5yYXdzdGF0cycpIGFzIGFueSkge1xyXG4gICAgICAgICAgICAkKCc8ZGl2PicpLnRleHQoc3RhdCArICc6ICcgKyAkU00uZ2V0KCdjaGFyYWN0ZXIucmF3c3RhdHMuJyArIHN0YXQpKS5hcHBlbmRUbygnZGl2I2NoYXJhY3RlcicpO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2J1dHRvbnMnKS5jc3MoXCJtYXJnaW4tdG9wXCIsIFwiMjBweFwiKS5hcHBlbmRUbygnZGl2I2NoYXJhY3RlcicpO1xyXG5cdFx0dmFyIGludmVudG9yeUJ1dHRvbiA9IEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogXCJpbnZlbnRvcnlcIixcclxuXHRcdFx0dGV4dDogXCJJbnZlbnRvcnlcIixcclxuXHRcdFx0Y2xpY2s6IENoYXJhY3Rlci5vcGVuSW52ZW50b3J5XHJcblx0XHR9KS5hcHBlbmRUbygkKCcjYnV0dG9ucycsICdkaXYjY2hhcmFjdGVyJykpO1xyXG5cdFx0XHJcblx0XHR2YXIgcXVlc3RMb2dCdXR0b24gPSBCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6IFwicXVlc3RMb2dcIixcclxuXHRcdFx0dGV4dDogXCJRdWVzdCBMb2dcIixcclxuXHRcdFx0Y2xpY2s6IENoYXJhY3Rlci5vcGVuUXVlc3RMb2dcclxuXHRcdH0pLmFwcGVuZFRvKCQoJyNidXR0b25zJywgJ2RpdiNjaGFyYWN0ZXInKSk7XHJcblxyXG5cdFx0dGhpcy5wZXJrQXJlYSA9ICQoJzxkaXY+JykuYXR0cih7XHJcblx0XHRcdGlkOiAncGVya3MnLFxyXG5cdFx0XHRjbGFzc05hbWU6ICdwZXJrcydcclxuXHRcdFx0fSkuYXBwZW5kVG8oJ2RpdiNjaGFyYWN0ZXInKTtcclxuXHJcblx0XHQvLyBUT0RPOiBhZGQgUGVya3MgbGlzdCBiZWxvdyBoZXJlXHJcblx0XHR0aGlzLnVwZGF0ZVBlcmtzKCk7XHJcblxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0d2luZG93LkNoYXJhY3RlciA9IHRoaXM7XHJcblx0fSxcclxuXHRcclxuXHRvcHRpb25zOiB7fSwgLy8gTm90aGluZyBmb3Igbm93XHJcblx0XHJcblx0ZWxlbTogbnVsbCxcclxuXHJcblx0aW52ZW50b3J5RGlzcGxheTogbnVsbCBhcyBhbnksXHJcblx0cXVlc3RMb2dEaXNwbGF5OiBudWxsIGFzIGFueSxcclxuXHJcblx0b3BlbkludmVudG9yeTogZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBjcmVhdGluZyBhIGhhbmRsZSBmb3IgbGF0ZXIgYWNjZXNzLCBzdWNoIGFzIGNsb3NpbmcgaW52ZW50b3J5XHJcblx0XHRDaGFyYWN0ZXIuaW52ZW50b3J5RGlzcGxheSA9ICQoJzxkaXY+JykuYXR0cignaWQnLCAnaW52ZW50b3J5JykuYWRkQ2xhc3MoJ2V2ZW50UGFuZWwnKS5jc3MoJ29wYWNpdHknLCAnMCcpO1xyXG5cdFx0dmFyIGludmVudG9yeURpc3BsYXkgPSBDaGFyYWN0ZXIuaW52ZW50b3J5RGlzcGxheTtcclxuXHRcdENoYXJhY3Rlci5pbnZlbnRvcnlEaXNwbGF5XHJcblx0XHQvLyBzZXQgdXAgY2xpY2sgYW5kIGhvdmVyIGhhbmRsZXJzIGZvciBpbnZlbnRvcnkgaXRlbXNcclxuXHRcdC5vbihcImNsaWNrXCIsIFwiI2l0ZW1cIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdENoYXJhY3Rlci51c2VJbnZlbnRvcnlJdGVtKCQodGhpcykuZGF0YShcIm5hbWVcIikpO1xyXG5cdFx0XHRDaGFyYWN0ZXIuY2xvc2VJbnZlbnRvcnkoKTtcclxuXHRcdH0pLm9uKFwibW91c2VlbnRlclwiLCBcIiNpdGVtXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgdG9vbHRpcCA9ICQoXCI8ZGl2IGlkPSd0b29sdGlwJyBjbGFzcz0ndG9vbHRpcCc+XCIgKyBJdGVtTGlzdFskKHRoaXMpLmRhdGEoXCJuYW1lXCIpXS50ZXh0ICsgXCI8L2Rpdj5cIilcclxuXHRcdFx0LmF0dHIoJ2RhdGEtbmFtZScsIGl0ZW0pO1xyXG5cdFx0XHR0b29sdGlwLmFwcGVuZFRvKCQodGhpcykpO1xyXG5cdFx0fSkub24oXCJtb3VzZWxlYXZlXCIsIFwiI2l0ZW1cIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQoXCIjdG9vbHRpcFwiLCBcIiNcIiArICQodGhpcykuZGF0YShcIm5hbWVcIikpLmZhZGVPdXQoKS5yZW1vdmUoKTtcclxuXHRcdH0pO1xyXG5cdFx0JCgnPGRpdj4nKS5hZGRDbGFzcygnZXZlbnRUaXRsZScpLnRleHQoJ0ludmVudG9yeScpLmFwcGVuZFRvKGludmVudG9yeURpc3BsYXkpO1xyXG5cdFx0dmFyIGludmVudG9yeURlc2MgPSAkKCc8ZGl2PicpLnRleHQoXCJDbGljayB0aGluZ3MgaW4gdGhlIGxpc3QgdG8gdXNlIHRoZW0uXCIpXHJcblx0XHRcdC5ob3ZlcihmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgdG9vbHRpcCA9ICQoXCI8ZGl2IGlkPSd0b29sdGlwJyBjbGFzcz0ndG9vbHRpcCc+XCIgKyBcIk5vdCB0aGlzLCB0aG91Z2guXCIgKyBcIjwvZGl2PlwiKTtcclxuICAgIFx0XHRcdHRvb2x0aXAuYXBwZW5kVG8oaW52ZW50b3J5RGVzYyk7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdCQoXCIjdG9vbHRpcFwiKS5mYWRlT3V0KCkucmVtb3ZlKCk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIF8oXCJJIGJldCB5b3UgdGhpbmsgeW91J3JlIHByZXR0eSBmdW5ueSwgaHVoPyBDbGlja2luZyB0aGUgdGhpbmcgSSBzYWlkIHdhc24ndCBjbGlja2FibGU/XCIpKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCIyMHB4XCIpXHJcblx0XHRcdC5hcHBlbmRUbyhpbnZlbnRvcnlEaXNwbGF5KTtcclxuXHRcdFxyXG5cdFx0Zm9yKHZhciBpdGVtIGluIENoYXJhY3Rlci5pbnZlbnRvcnkpIHtcclxuXHRcdFx0Ly8gbWFrZSB0aGUgaW52ZW50b3J5IGNvdW50IGxvb2sgYSBiaXQgbmljZXJcclxuXHRcdFx0dmFyIGludmVudG9yeUVsZW0gPSAkKCc8ZGl2PicpXHJcblx0XHRcdC5hdHRyKCdpZCcsICdpdGVtJylcclxuXHRcdFx0LmF0dHIoJ2RhdGEtbmFtZScsIGl0ZW0pXHJcblx0XHRcdC50ZXh0KEl0ZW1MaXN0W2l0ZW1dLm5hbWUgICsgJyAgKHgnICsgQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXS50b1N0cmluZygpICsgJyknKVxyXG5cdFx0XHQuYXBwZW5kVG8oaW52ZW50b3J5RGlzcGxheSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVE9ETzogbWFrZSB0aGlzIENTUyBhbiBhY3R1YWwgY2xhc3Mgc29tZXdoZXJlLCBJJ20gc3VyZSBJJ2xsIG5lZWQgaXQgYWdhaW5cclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnYnV0dG9ucycpLmNzcyhcIm1hcmdpbi10b3BcIiwgXCIyMHB4XCIpLmFwcGVuZFRvKGludmVudG9yeURpc3BsYXkpO1xyXG5cdFx0dmFyIGIgPSBcclxuXHRcdC8vbmV3IFxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiBcImNsb3NlSW52ZW50b3J5XCIsXHJcblx0XHRcdHRleHQ6IFwiQ2xvc2VcIixcclxuXHRcdFx0Y2xpY2s6IENoYXJhY3Rlci5jbG9zZUludmVudG9yeVxyXG5cdFx0fSkuYXBwZW5kVG8oJCgnI2J1dHRvbnMnLCBpbnZlbnRvcnlEaXNwbGF5KSk7XHJcblx0XHQkKCdkaXYjd3JhcHBlcicpLmFwcGVuZChpbnZlbnRvcnlEaXNwbGF5KTtcclxuXHRcdGludmVudG9yeURpc3BsYXkuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIEV2ZW50cy5fUEFORUxfRkFERSwgJ2xpbmVhcicpO1xyXG5cdH0sXHJcblxyXG5cdGNsb3NlSW52ZW50b3J5OiBmdW5jdGlvbigpIHtcclxuXHRcdENoYXJhY3Rlci5pbnZlbnRvcnlEaXNwbGF5LmVtcHR5KCk7XHJcblx0XHRDaGFyYWN0ZXIuaW52ZW50b3J5RGlzcGxheS5yZW1vdmUoKTtcclxuXHR9LFxyXG5cclxuXHRhZGRUb0ludmVudG9yeTogZnVuY3Rpb24oaXRlbSwgYW1vdW50PTEpIHtcclxuXHRcdGlmIChDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dKSB7XHJcblx0XHRcdENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0gKz0gYW1vdW50O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Q2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSA9IGFtb3VudDtcclxuXHRcdH1cclxuXHJcblx0XHROb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIkFkZGVkIFwiICsgSXRlbUxpc3RbaXRlbV0ubmFtZSArIFwiIHRvIGludmVudG9yeS5cIilcclxuXHRcdCRTTS5zZXQoJ2ludmVudG9yeScsIENoYXJhY3Rlci5pbnZlbnRvcnkpO1xyXG5cdH0sXHJcblxyXG5cclxuXHRyZW1vdmVGcm9tSW52ZW50b3J5OiBmdW5jdGlvbihpdGVtLCBhbW91bnQ9MSkge1xyXG5cdFx0aWYgKENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0pIENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0gLT0gYW1vdW50O1xyXG5cdFx0aWYgKENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0gPCAxKSB7XHJcblx0XHRcdGRlbGV0ZSBDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dO1xyXG5cdFx0fVxyXG5cclxuXHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiUmVtb3ZlZCBcIiArIEl0ZW1MaXN0W2l0ZW1dLm5hbWUgKyBcIiBmcm9tIGludmVudG9yeS5cIilcclxuXHRcdCRTTS5zZXQoJ2ludmVudG9yeScsIENoYXJhY3Rlci5pbnZlbnRvcnkpO1xyXG5cdH0sXHJcblxyXG5cdHVzZUludmVudG9yeUl0ZW06IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdGlmIChDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dICYmIENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0gPiAwKSB7XHJcblx0XHRcdC8vIHVzZSB0aGUgZWZmZWN0IGluIHRoZSBpbnZlbnRvcnk7IGp1c3QgaW4gY2FzZSBhIG5hbWUgbWF0Y2hlcyBidXQgdGhlIGVmZmVjdFxyXG5cdFx0XHQvLyBkb2VzIG5vdCwgYXNzdW1lIHRoZSBpbnZlbnRvcnkgaXRlbSBpcyB0aGUgc291cmNlIG9mIHRydXRoXHJcblx0XHRcdEl0ZW1MaXN0W2l0ZW1dLm9uVXNlKCk7XHJcblx0XHRcdGlmICh0eXBlb2YoSXRlbUxpc3RbaXRlbV0uZGVzdHJveU9uVXNlKSA9PSBcImZ1bmN0aW9uXCIgJiYgSXRlbUxpc3RbaXRlbV0uZGVzdHJveU9uVXNlKCkpIHtcclxuXHRcdFx0XHRDaGFyYWN0ZXIucmVtb3ZlRnJvbUludmVudG9yeShpdGVtKTtcclxuXHRcdFx0fSBlbHNlIGlmIChJdGVtTGlzdFtpdGVtXS5kZXN0cm95T25Vc2UpIHtcclxuXHRcdFx0XHRDaGFyYWN0ZXIucmVtb3ZlRnJvbUludmVudG9yeShpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdCRTTS5zZXQoJ2ludmVudG9yeScsIENoYXJhY3Rlci5pbnZlbnRvcnkpO1xyXG5cdH0sXHJcblxyXG5cdGVxdWlwSXRlbTogZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0aWYgKEl0ZW1MaXN0W2l0ZW1dLnNsb3QgJiYgQ2hhcmFjdGVyLmVxdWlwcGVkSXRlbXNbSXRlbUxpc3RbaXRlbV0uc2xvdF0gIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoQ2hhcmFjdGVyLmVxdWlwcGVkSXRlbXNbSXRlbUxpc3RbaXRlbV0uc2xvdF0pO1xyXG5cdFx0XHRDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtc1tJdGVtTGlzdFtpdGVtXS5zbG90XSA9IGl0ZW07XHJcblx0XHRcdGlmIChJdGVtTGlzdFtpdGVtXS5vbkVxdWlwKSB7XHJcblx0XHRcdFx0SXRlbUxpc3RbaXRlbV0ub25FcXVpcCgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdENoYXJhY3Rlci5hcHBseUVxdWlwbWVudEVmZmVjdHMoKTtcclxuXHRcdH1cclxuXHJcblx0XHQkU00uc2V0KCdlcXVpcHBlZEl0ZW1zJywgQ2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMpO1xyXG5cdFx0JFNNLnNldCgnaW52ZW50b3J5JywgQ2hhcmFjdGVyLmludmVudG9yeSk7XHJcblx0fSxcclxuXHJcblx0Z3JhbnRQZXJrOiBmdW5jdGlvbihwZXJrKSB7XHJcblx0XHRpZiAoQ2hhcmFjdGVyLnBlcmtzW3BlcmtdICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0aWYocGVyay50aW1lTGVmdCA+IDApIHtcclxuXHRcdFx0XHRDaGFyYWN0ZXIucGVya3NbcGVya10gKz0gcGVyay50aW1lTGVmdDtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Q2hhcmFjdGVyLnBlcmtzW3BlcmtdID0gcGVyaztcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnVwZGF0ZVBlcmtzKCk7XHJcblxyXG5cdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkoJ251bGwnLCBcIkFjcXVpcmVkIGVmZmVjdDogXCIgKyBQZXJrTGlzdFtwZXJrXS5uYW1lKTtcclxuXHRcdFxyXG5cdFx0JFNNLnNldCgncGVya3MnLCBDaGFyYWN0ZXIucGVya3MpO1xyXG5cdH0sXHJcblxyXG5cdHJlbW92ZVBlcms6IGZ1bmN0aW9uKHBlcmspIHtcclxuXHRcdGlmIChDaGFyYWN0ZXIucGVya3NbcGVyay5uYW1lXSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGRlbGV0ZSBDaGFyYWN0ZXIucGVya3NbcGVyay5uYW1lXTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnVwZGF0ZVBlcmtzKCk7XHJcblxyXG5cdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkoJ251bGwnLCBcIkxvc3QgZWZmZWN0OiBcIiArIFBlcmtMaXN0W3BlcmtdLm5hbWUpO1xyXG5cclxuXHRcdCRTTS5zZXQoJ3BlcmtzJywgQ2hhcmFjdGVyLnBlcmtzKTtcclxuXHR9LFxyXG5cclxuXHR1cGRhdGVQZXJrczogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnBlcmtBcmVhLmVtcHR5KCk7XHJcblx0XHRpZiAoT2JqZWN0LmtleXModGhpcy5wZXJrcykubGVuZ3RoID4gMCkge1xyXG5cdFx0XHQkKCc8ZGl2PicpLnRleHQoJ1BlcmtzJylcclxuXHRcdFx0LmNzcygndGV4dC1kZWNvcmF0aW9uJywgJ3VuZGVybGluZScpXHJcblx0XHRcdC5jc3MoJ21hcmdpbi10b3AnLCAnMTBweCcpXHJcblx0XHRcdC5hdHRyKCdpZCcsICd0aXRsZScpXHJcblx0XHRcdC5hcHBlbmRUbygnZGl2I3BlcmtzJyk7XHJcblx0XHRcdC8vIHNldCB1cCBjbGljayBhbmQgaG92ZXIgaGFuZGxlcnMgZm9yIHBlcmtzXHJcblx0XHR0aGlzLnBlcmtBcmVhXHJcblx0XHQub24oXCJjbGlja1wiLCBcIiNwZXJrXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQvLyBoYW5kbGUgdGhpcyB3aGVuIHdlIGhhdmUgcGVyayBkZXNjcmlwdGlvbnMgYW5kIHN0dWZmXHJcblx0XHR9KS5vbihcIm1vdXNlZW50ZXJcIiwgXCIjcGVya1wiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHRvb2x0aXAgPSAkKFwiPGRpdiBpZD0ndG9vbHRpcCcgY2xhc3M9J3Rvb2x0aXAnPlwiICsgUGVya0xpc3RbJCh0aGlzKS5kYXRhKFwibmFtZVwiKV0udGV4dCArIFwiPC9kaXY+XCIpXHJcblx0XHRcdC5hdHRyKCdkYXRhLW5hbWUnLCBwZXJrKTtcclxuXHRcdFx0dG9vbHRpcC5hcHBlbmRUbygkKHRoaXMpKTtcclxuXHRcdH0pLm9uKFwibW91c2VsZWF2ZVwiLCBcIiNwZXJrXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKFwiI3Rvb2x0aXBcIiwgXCIjXCIgKyAkKHRoaXMpLmRhdGEoXCJuYW1lXCIpKS5mYWRlT3V0KCkucmVtb3ZlKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRcdGZvcih2YXIgcGVyayBpbiBDaGFyYWN0ZXIucGVya3MpIHtcclxuXHRcdFx0XHQvLyBhZGQgbW91c2VvdmVyIGFuZCBjbGljayBzdHVmZlxyXG5cdFx0XHRcdHZhciBwZXJrRWxlbSA9ICQoJzxkaXY+JylcclxuXHRcdFx0XHQuYXR0cignaWQnLCAncGVyaycpXHJcblx0XHRcdFx0LmF0dHIoJ2RhdGEtbmFtZScsIHBlcmspXHJcblx0XHRcdFx0LnRleHQoUGVya0xpc3RbcGVya10ubmFtZSlcclxuXHRcdFx0XHQuYXBwZW5kVG8oJ2RpdiNwZXJrcycpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0b3BlblF1ZXN0TG9nOiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIGNyZWF0aW5nIGEgaGFuZGxlIGZvciBsYXRlciBhY2Nlc3MsIHN1Y2ggYXMgY2xvc2luZyBxdWVzdCBsb2dcclxuXHRcdENoYXJhY3Rlci5xdWVzdExvZ0Rpc3BsYXkgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ3F1ZXN0JykuYWRkQ2xhc3MoJ2V2ZW50UGFuZWwnKS5jc3MoJ29wYWNpdHknLCAnMCcpO1xyXG5cdFx0dmFyIHF1ZXN0TG9nRGlzcGxheSA9IENoYXJhY3Rlci5xdWVzdExvZ0Rpc3BsYXk7XHJcblx0XHRDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5XHJcblx0XHQvLyBzZXQgdXAgY2xpY2sgYW5kIGhvdmVyIGhhbmRsZXJzIGZvciBxdWVzdHNcclxuXHRcdC5vbihcImNsaWNrXCIsIFwiI3F1ZXN0XCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRDaGFyYWN0ZXIuZGlzcGxheVF1ZXN0KCQodGhpcykuZGF0YShcIm5hbWVcIikpO1xyXG5cdFx0fSk7XHJcblx0XHQkKCc8ZGl2PicpLmFkZENsYXNzKCdldmVudFRpdGxlJykudGV4dCgnUXVlc3QgTG9nJykuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHRcdHZhciBxdWVzdExvZ0Rlc2MgPSAkKCc8ZGl2PicpLnRleHQoXCJDbGljayBxdWVzdCBuYW1lcyB0byBzZWUgbW9yZSBpbmZvLlwiKVxyXG5cdFx0XHQuY3NzKFwibWFyZ2luLWJvdHRvbVwiLCBcIjIwcHhcIilcclxuXHRcdFx0LmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHRcclxuXHRcdGZvcih2YXIgcXVlc3QgaW4gQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzKSB7XHJcblx0XHRcdHZhciBxdWVzdEVsZW0gPSAkKCc8ZGl2PicpXHJcblx0XHRcdC5hdHRyKCdpZCcsIFwicXVlc3RcIilcclxuXHRcdFx0LmF0dHIoJ2RhdGEtbmFtZScsIHF1ZXN0KVxyXG5cdFx0XHQudGV4dChRdWVzdExvZ1txdWVzdF0ubmFtZSlcclxuXHRcdFx0LmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHRcdGlmIChDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdID09IC0xKSB7XHJcblx0XHRcdFx0cXVlc3RFbGVtXHJcblx0XHRcdFx0Ly8gSSB3YW50IHRoaXMgdG8gYmUgbm90IHN0cnVjayB0aHJvdWdoLCBidXQgdGhhdCdzIHRvbyBhbm5veWluZyB0byB3b3JyeVxyXG5cdFx0XHRcdC8vIGFib3V0IHJpZ2h0IG5vd1xyXG5cdFx0XHRcdC8vIC5wcmVwZW5kKFwiRE9ORSBcIilcclxuXHRcdFx0XHQud3JhcChcIjxzdHJpa2U+XCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVE9ETzogbWFrZSB0aGlzIENTUyBhbiBhY3R1YWwgY2xhc3Mgc29tZXdoZXJlLCBJJ20gc3VyZSBJJ2xsIG5lZWQgaXQgYWdhaW5cclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnYnV0dG9ucycpLmNzcyhcIm1hcmdpbi10b3BcIiwgXCIyMHB4XCIpLmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHR2YXIgYiA9IEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogXCJjbG9zZVF1ZXN0TG9nXCIsXHJcblx0XHRcdHRleHQ6IFwiQ2xvc2VcIixcclxuXHRcdFx0Y2xpY2s6IENoYXJhY3Rlci5jbG9zZVF1ZXN0TG9nXHJcblx0XHR9KS5hcHBlbmRUbygkKCcjYnV0dG9ucycsIHF1ZXN0TG9nRGlzcGxheSkpO1xyXG5cdFx0JCgnZGl2I3dyYXBwZXInKS5hcHBlbmQocXVlc3RMb2dEaXNwbGF5KTtcclxuXHRcdHF1ZXN0TG9nRGlzcGxheS5hbmltYXRlKHtvcGFjaXR5OiAxfSwgRXZlbnRzLl9QQU5FTF9GQURFLCAnbGluZWFyJyk7XHJcblx0fSxcclxuXHJcblx0ZGlzcGxheVF1ZXN0OiBmdW5jdGlvbihxdWVzdDogc3RyaW5nKSB7XHJcblx0XHRjb25zdCBxdWVzdExvZ0Rpc3BsYXkgPSBDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5O1xyXG5cdFx0cXVlc3RMb2dEaXNwbGF5LmVtcHR5KCk7XHJcblx0XHRjb25zdCBjdXJyZW50UXVlc3QgPSBRdWVzdExvZ1txdWVzdF07XHJcblxyXG5cdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdxdWVzdCcpLmFkZENsYXNzKCdldmVudFBhbmVsJykuY3NzKCdvcGFjaXR5JywgJzAnKTtcclxuXHRcdCQoJzxkaXY+JykuYWRkQ2xhc3MoJ2V2ZW50VGl0bGUnKS50ZXh0KGN1cnJlbnRRdWVzdC5uYW1lKS5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cclxuXHRcdHZhciBxdWVzdExvZ0Rlc2MgPSAkKCc8ZGl2PicpLnRleHQoY3VycmVudFF1ZXN0LmxvZ0Rlc2NyaXB0aW9uKVxyXG5cdFx0XHQuY3NzKFwibWFyZ2luLWJvdHRvbVwiLCBcIjIwcHhcIilcclxuXHRcdFx0LmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblxyXG5cdFx0aWYgKENoYXJhY3Rlci5xdWVzdFN0YXR1c1txdWVzdF0gYXMgbnVtYmVyID09IC0xKSB7XHJcblx0XHRcdHZhciBwaGFzZURlc2MgPSAkKCc8ZGl2PicpLnRleHQoXCJUaGlzIHF1ZXN0IGlzIGNvbXBsZXRlIVwiKVxyXG5cdFx0XHQuY3NzKFwibWFyZ2luLWJvdHRvbVwiLCBcIjEwcHhcIilcclxuXHRcdFx0LmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPD0gKENoYXJhY3Rlci5xdWVzdFN0YXR1c1txdWVzdF0gYXMgbnVtYmVyKTsgaSsrKSB7XHJcblx0XHRcdHZhciBwaGFzZURlc2MgPSAkKCc8ZGl2PicpLnRleHQoY3VycmVudFF1ZXN0LnBoYXNlc1tpXS5kZXNjcmlwdGlvbilcclxuXHRcdFx0LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCIxMHB4XCIpXHJcblx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0XHR2YXIgY29tcGxldGUgPSB0cnVlO1xyXG5cdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IE9iamVjdC5rZXlzKGN1cnJlbnRRdWVzdC5waGFzZXNbaV0ucmVxdWlyZW1lbnRzKS5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdHZhciByZXF1aXJlbWVudHNEZXNjID0gJCgnPGRpdj4nKS50ZXh0KGN1cnJlbnRRdWVzdC5waGFzZXNbaV0ucmVxdWlyZW1lbnRzW2pdLnJlbmRlclJlcXVpcmVtZW50KCkpXHJcblx0XHRcdFx0XHQuY3NzKFwibWFyZ2luLWJvdHRvbVwiLCBcIjIwcHhcIilcclxuXHRcdFx0XHRcdC5jc3MoXCJtYXJnaW4tbGVmdFwiLCBcIjIwcHhcIilcclxuXHRcdFx0XHRcdC5jc3MoJ2ZvbnQtc3R5bGUnLCAnaXRhbGljJylcclxuXHRcdFx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0XHRcdGlmICghY3VycmVudFF1ZXN0LnBoYXNlc1tpXS5yZXF1aXJlbWVudHNbal0uaXNDb21wbGV0ZSgpKSBjb21wbGV0ZSA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChjb21wbGV0ZSkge1xyXG5cdFx0XHRcdHBoYXNlRGVzYy53cmFwKFwiPHN0cmlrZT5cIik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBUT0RPOiBtYWtlIHRoaXMgQ1NTIGFuIGFjdHVhbCBjbGFzcyBzb21ld2hlcmUsIEknbSBzdXJlIEknbGwgbmVlZCBpdCBhZ2FpblxyXG5cdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdidXR0b25zJykuY3NzKFwibWFyZ2luLXRvcFwiLCBcIjIwcHhcIikuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHJcblx0XHR2YXIgYiA9IEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogXCJiYWNrVG9RdWVzdExvZ1wiLFxyXG5cdFx0XHR0ZXh0OiBcIkJhY2sgdG8gUXVlc3QgTG9nXCIsXHJcblx0XHRcdGNsaWNrOiBDaGFyYWN0ZXIuYmFja1RvUXVlc3RMb2dcclxuXHRcdH0pLmFwcGVuZFRvKCQoJyNidXR0b25zJywgcXVlc3RMb2dEaXNwbGF5KSk7XHJcblxyXG5cdFx0dmFyIGIgPSBCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6IFwiY2xvc2VRdWVzdExvZ1wiLFxyXG5cdFx0XHR0ZXh0OiBcIkNsb3NlXCIsXHJcblx0XHRcdGNsaWNrOiBDaGFyYWN0ZXIuY2xvc2VRdWVzdExvZ1xyXG5cdFx0fSkuYXBwZW5kVG8oJCgnI2J1dHRvbnMnLCBxdWVzdExvZ0Rpc3BsYXkpKTtcclxuXHR9LFxyXG5cclxuXHRjbG9zZVF1ZXN0TG9nOiBmdW5jdGlvbigpIHtcclxuXHRcdENoYXJhY3Rlci5xdWVzdExvZ0Rpc3BsYXkuZW1wdHkoKTtcclxuXHRcdENoYXJhY3Rlci5xdWVzdExvZ0Rpc3BsYXkucmVtb3ZlKCk7XHJcblx0fSxcclxuXHJcblx0YmFja1RvUXVlc3RMb2c6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Q2hhcmFjdGVyLmNsb3NlUXVlc3RMb2coKTtcclxuXHRcdENoYXJhY3Rlci5vcGVuUXVlc3RMb2coKTtcclxuXHR9LFxyXG5cclxuXHRzZXRRdWVzdFN0YXR1czogZnVuY3Rpb24ocXVlc3QsIHBoYXNlKSB7XHJcblx0XHQvLyBtaWdodCBiZSBhIGdvb2QgaWRlYSB0byBjaGVjayBmb3IgbGluZWFyIHF1ZXN0IHByb2dyZXNzaW9uIGhlcmU/XHJcblx0XHRpZiAoUXVlc3RMb2dbcXVlc3RdICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0Q2hhcmFjdGVyLnF1ZXN0U3RhdHVzW3F1ZXN0XSA9IHBoYXNlO1xyXG5cclxuXHRcdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJRdWVzdCBMb2cgdXBkYXRlZC5cIik7XHJcblx0XHRcdCRTTS5zZXQoJ3F1ZXN0U3RhdHVzJywgQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRjaGVja1F1ZXN0U3RhdHVzOiBmdW5jdGlvbihxdWVzdCkge1xyXG5cdFx0Y29uc3QgY3VycmVudFBoYXNlID0gUXVlc3RMb2dbcXVlc3RdLnBoYXNlc1tDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdXTtcclxuXHJcblx0XHRpZiAoY3VycmVudFBoYXNlID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcblx0XHR2YXIgY29tcGxldGUgPSB0cnVlO1xyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBPYmplY3Qua2V5cyhjdXJyZW50UGhhc2UucmVxdWlyZW1lbnRzKS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAoIWN1cnJlbnRQaGFzZS5yZXF1aXJlbWVudHNbaV0uaXNDb21wbGV0ZSgpKVxyXG5cdFx0XHRcdGNvbXBsZXRlID0gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGNvbXBsZXRlKSB7XHJcblx0XHRcdC8vIGlmIHRoZXJlIGlzIGEgbmV4dCBwaGFzZSwgc2V0IHF1ZXN0U3RhdHVzIHRvIGl0XHJcblx0XHRcdGlmIChRdWVzdExvZ1txdWVzdF0ucGhhc2VzW0NoYXJhY3Rlci5xdWVzdFN0YXR1c1txdWVzdF0gKyAxXSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0Q2hhcmFjdGVyLnF1ZXN0U3RhdHVzW3F1ZXN0XSArPSAxO1xyXG5cdFx0XHR9IGVsc2UgeyAvLyBlbHNlIHNldCBpdCB0byBjb21wbGV0ZVxyXG5cdFx0XHRcdENoYXJhY3Rlci5xdWVzdFN0YXR1c1txdWVzdF0gPSAtMTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHROb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIlF1ZXN0IExvZyB1cGRhdGVkLlwiKTtcclxuXHRcdCRTTS5zZXQoJ3F1ZXN0U3RhdHVzJywgQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzKTtcclxuXHR9LFxyXG5cclxuXHQvLyBhcHBseSBlcXVpcG1lbnQgZWZmZWN0cywgd2hpY2ggc2hvdWxkIGFsbCBjaGVjayBhZ2FpbnN0ICRTTSBzdGF0ZSB2YXJpYWJsZXM7XHJcblx0Ly8gdGhpcyBzaG91bGQgYmUgY2FsbGVkIG9uIGJhc2ljYWxseSBldmVyeSBwbGF5ZXIgYWN0aW9uIHdoZXJlIGEgcGllY2Ugb2YgZ2VhclxyXG5cdC8vIHdvdWxkIGRvIHNvbWV0aGluZyBvciBjaGFuZ2UgYW4gb3V0Y29tZTsgZ2l2ZSBleHRyYVBhcmFtcyB0byB0aGUgZWZmZWN0IGJlaW5nIFxyXG5cdC8vIGFwcGxpZWQgZm9yIGFueXRoaW5nIHRoYXQncyByZWxldmFudCB0byB0aGUgZWZmZWN0IGJ1dCBub3QgaGFuZGxlZCBieSAkU01cclxuXHRhcHBseUVxdWlwbWVudEVmZmVjdHM6IGZ1bmN0aW9uKGV4dHJhUGFyYW1zPykge1xyXG5cdFx0Zm9yIChjb25zdCBpdGVtIGluIENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zKSB7XHJcblx0XHRcdGlmIChJdGVtTGlzdFtpdGVtXS5lZmZlY3RzKSB7XHJcblx0XHRcdFx0Zm9yIChjb25zdCBlZmZlY3QgaW4gSXRlbUxpc3RbaXRlbV0uZWZmZWN0cykge1xyXG5cdFx0XHRcdFx0Ly8gTk9URTogY3VycmVudGx5IHRoaXMgaXMgZ29vZCBmb3IgYXBwbHlpbmcgcGVya3MgYW5kIE5vdGlmeWluZztcclxuXHRcdFx0XHRcdC8vIGFyZSB0aGVyZSBvdGhlciBzaXR1YXRpb25zIHdoZXJlIHdlJ2Qgd2FudCB0byBhcHBseSBlZmZlY3RzLFxyXG5cdFx0XHRcdFx0Ly8gb3IgY2FuIHdlIGNvdmVyIGJhc2ljYWxseSBldmVyeSBjYXNlIHZpYSB0aG9zZSB0aGluZ3M/XHJcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0XHRpZiAoZWZmZWN0LmlzQWN0aXZlICYmIGVmZmVjdC5pc0FjdGl2ZShleHRyYVBhcmFtcykpIGVmZmVjdC5hcHBseShleHRyYVBhcmFtcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Ly8gZ2V0IHN0YXRzIGFmdGVyIGFwcGx5aW5nIGFsbCBlcXVpcG1lbnQgYm9udXNlcywgcGVya3MsIGV0Yy5cclxuXHRnZXREZXJpdmVkU3RhdHM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Y29uc3QgZGVyaXZlZFN0YXRzID0gc3RydWN0dXJlZENsb25lKENoYXJhY3Rlci5yYXdTdGF0cyk7XHJcblx0XHRmb3IgKGNvbnN0IGl0ZW0gaW4gQ2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMpIHtcclxuXHRcdFx0aWYgKEl0ZW1MaXN0W2l0ZW1dLnN0YXRCb251c2VzKSB7XHJcblx0XHRcdFx0Zm9yIChjb25zdCBzdGF0IGluIE9iamVjdC5rZXlzKEl0ZW1MaXN0W2l0ZW1dLnN0YXRCb251c2VzKSkge1xyXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiAoSXRlbUxpc3RbaXRlbV0uc3RhdEJvbnVzZXNbc3RhdF0gPT0gXCJmdW5jdGlvblwiKSkge1xyXG5cdFx0XHRcdFx0XHRkZXJpdmVkU3RhdHNbc3RhdF0gKz0gSXRlbUxpc3RbaXRlbV0uc3RhdEJvbnVzZXNbc3RhdF0oKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGRlcml2ZWRTdGF0c1tzdGF0XSArPSBJdGVtTGlzdFtpdGVtXS5zdGF0Qm9udXNlc1tzdGF0XTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGNvbnN0IHBlcmsgaW4gQ2hhcmFjdGVyLnBlcmtzKSB7XHJcblx0XHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdFx0aWYgKHBlcmsuc3RhdEJvbnVzZXMpIHtcclxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0Zm9yIChjb25zdCBzdGF0IGluIE9iamVjdC5rZXlzKHBlcmsuc3RhdEJvbnVzZXMpKSB7XHJcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0XHRpZiAodHlwZW9mIChwZXJrLnN0YXRCb251c2VzW3N0YXRdID09IFwiZnVuY3Rpb25cIikpIHtcclxuXHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdFx0XHRkZXJpdmVkU3RhdHNbc3RhdF0gKz0gcGVyay5zdGF0Qm9udXNlc1tzdGF0XSgpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdFx0XHRkZXJpdmVkU3RhdHNbc3RhdF0gKz0gcGVyay5zdGF0Qm9udXNlc1tzdGF0XTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZGVyaXZlZFN0YXRzO1xyXG5cdH1cclxufSIsIi8vIGFsbCBpdGVtcyBnbyBoZXJlLCBzbyB0aGF0IG5vdGhpbmcgc2lsbHkgaGFwcGVucyBpbiB0aGUgZXZlbnQgdGhhdCB0aGV5IGdldCBwdXQgaW4gTG9jYWwgU3RvcmFnZVxyXG4vLyBhcyBwYXJ0IG9mIHRoZSBzdGF0ZSBtYW5hZ2VtZW50IGNvZGU7IHBsZWFzZSBzYXZlIGl0ZW0gbmFtZXMgdG8gdGhlIGludmVudG9yeSwgYW5kIHRoZW4gcmVmZXIgdG8gXHJcbi8vIHRoZSBpdGVtIGxpc3QgdmlhIHRoZSBpdGVtIG5hbWVcclxuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tIFwiLi9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tIFwiLi4vbm90aWZpY2F0aW9uc1wiO1xyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSBcIi4vaXRlbVwiO1xyXG5cclxuLy8gRGV0YWlscyBmb3IgYWxsIGluLWdhbWUgaXRlbXM7IHRoZSBDaGFyYWN0ZXIgaW52ZW50b3J5IG9ubHkgaG9sZHMgaXRlbSBJRHNcclxuLy8gYW5kIGFtb3VudHNcclxuZXhwb3J0IGNvbnN0IEl0ZW1MaXN0OiB7W2lkOiBzdHJpbmddOiBJdGVtfSA9IHtcclxuICAgIFwiTGl6LndlaXJkQm9va1wiOiB7XHJcbiAgICAgICAgbmFtZTogJ1dlaXJkIEJvb2snLFxyXG4gICAgICAgIHBsdXJhbE5hbWU6ICdXZWlyZCBCb29rcycsXHJcbiAgICAgICAgdGV4dDogXygnQSBib29rIHlvdSBmb3VuZCBhdCBMaXpcXCdzIHBsYWNlLiBTdXBwb3NlZGx5IGhhcyBpbmZvcm1hdGlvbiBhYm91dCBDaGFkdG9waWEuJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkgeyBcclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICBfKFwiQSBCcmllZiBIaXN0b3J5IG9mIENoYWR0b3BpYVwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1RoaXMgYm9vayBpcyBwcmV0dHkgYm9yaW5nLCBidXQgeW91IG1hbmFnZSB0byBsZWFybiBhIGJpdCBtb3JlIGluIHNwaXRlIG9mIHlvdXIgcG9vciBhdHRlbnRpb24gc3Bhbi4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oJ0ZvciBleGFtcGxlLCB5b3UgbGVhcm4gdGhhdCBcIkNoYWR0b3BpYVwiIGRvZXNuXFwndCBoYXZlIGEgY2FwaXRhbCBcXCdUXFwnLiBUaGF0XFwncyBwcmV0dHkgY29vbCwgaHVoPycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXygnLi4uIFdoYXQgd2VyZSB5b3UgZG9pbmcgYWdhaW4/JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnU29tZXRoaW5nIGNvb2xlciB0aGFuIHJlYWRpbmcsIHByb2JhYmx5JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6ICgpID0+IENoYXJhY3Rlci5hZGRUb0ludmVudG9yeShcIkxpei5ib3JpbmdCb29rXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogdHJ1ZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH0sXHJcblxyXG4gICAgXCJMaXouYm9yaW5nQm9va1wiOiB7XHJcbiAgICAgICAgbmFtZTogJ1wiQSBCcmllZiBIaXN0b3J5IG9mIENoYWR0b3BpYVwiJyxcclxuICAgICAgICBwbHVyYWxOYW1lOiAnTXVsdGlwbGUgY29waWVzIG9mIFwiQSBCcmllZiBIaXN0b3J5IG9mIENoYWR0b3BpYVwiJyxcclxuICAgICAgICB0ZXh0OiBfKCdNYW4sIHRoaXMgYm9vayBpcyBib3JpbmcuJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEgQnJpZWYgU3VtbWFyeSBvZiBhIEJyaWVmIEhpc3Rvcnkgb2YgQ2hhZHRvcGlhXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW18oJ0l0XFwncyBzdGlsbCBqdXN0IGFzIGJvcmluZyBhcyB3aGVuIHlvdSBsYXN0IHRyaWVkIHRvIHJlYWQgaXQuJyldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdEYW5nLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogZmFsc2UsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgXCJTdHJhbmdlci5zbW9vdGhTdG9uZVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ2Egc21vb3RoIGJsYWNrIHN0b25lJyxcclxuICAgICAgICBwbHVyYWxOYW1lOiAnc21vb3RoIGJsYWNrIHN0b25lcycsXHJcbiAgICAgICAgdGV4dDogXygnSXRcXCdzIHdlaXJkbHkgZWVyaWUnKSxcclxuICAgICAgICBvblVzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmICghJFNNLmdldCgna25vd2xlZGdlLlN0cmFuZ2VyLnNtb290aFN0b25lJykpIHtcclxuICAgICAgICAgICAgICAgIE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsICdZb3UgaGF2ZSBubyBpZGVhIHdoYXQgdG8gZG8gd2l0aCB0aGlzIHRoaW5nLicpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBfKFwiQSBzbW9vdGggYmxhY2sgc3RvbmVcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXyhcIkknbSBnZW51aW5lbHkgbm90IHN1cmUgaG93IHlvdSBnb3QgdG8gdGhpcyBldmVudCwgYnV0IHBsZWFzZSBsZXQgbWUga25vdyB2aWEgR2l0SHViIGlzc3VlLCB5b3UgbGl0dGxlIHN0aW5rZXIuXCIpXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnSSBzd2VhciB0byBkbyB0aGlzLCBhcyBhIHJlc3BvbnNpYmxlIGNpdGl6ZW4gb2YgRWFydGgnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIFwiU3RyYW5nZXIud3JhcHBlZEtuaWZlXCI6IHtcclxuICAgICAgICBuYW1lOiAnYSBrbmlmZSB3cmFwcGVkIGluIGNsb3RoJyxcclxuICAgICAgICBwbHVyYWxOYW1lOiAnS25pdmVzIHdyYXBwZWQgaW4gc2VwYXJhdGUgY2xvdGhzJyxcclxuICAgICAgICB0ZXh0OiBfKCdNYW4sIEkgaG9wZSBpdFxcJ3Mgbm90IGFsbCBsaWtlLCBibG9vZHkgb24gdGhlIGJsYWRlIGFuZCBzdHVmZi4nKSxcclxuICAgICAgICBvblVzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBfKFwiQSBrbmlmZSB3cmFwcGVkIGluIGNsb3RoXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW18oXCJZb3UgdW53cmFwIHRoZSBrbmlmZSBjYXJlZnVsbHkuIEl0IHNlZW1zIHRvIGJlIGhpZ2hseSBvcm5hbWVudGVkLCBhbmQgeW91IGNvdWxkIHByb2JhYmx5IGRvIHNvbWUgY3JpbWVzIHdpdGggaXQuXCIpXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnSGVsbCB5ZWFoLCBBZG9sZiBMb29zIHN0eWxlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6ICgpID0+IENoYXJhY3Rlci5hZGRUb0ludmVudG9yeShcIlN0cmFuZ2VyLnNpbHZlcktuaWZlXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogdHJ1ZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH0sXHJcbiAgICBcIlN0cmFuZ2VyLnNpbHZlcktuaWZlXCI6IHtcclxuICAgICAgICBuYW1lOiAnYSBzaWx2ZXIga25pZmUnLFxyXG4gICAgICAgIHBsdXJhbE5hbWU6ICdzaWx2ZXIga25pdmVzJyxcclxuICAgICAgICB0ZXh0OiBfKCdIaWdobHkgb3JuYW1lbnRlZCcpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IF8oXCJBIHNpbHZlciBrbmlmZVwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJPbmUgZGF5IHlvdSdsbCBiZSBhYmxlIHRvIGVxdWlwIHRoaXMsIGJ1dCByaWdodCBub3cgdGhhdCBmdW5jdGlvbmFsaXR5IGlzbid0IHByZXNlbnQuXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIlBsZWFzZSBwb2xpdGVseSBsZWF2ZSB0aGUgcHJlbWlzZXMgd2l0aG91dCBhY2tub3dsZWRnaW5nIHRoaXMgbWlzc2luZyBmZWF0dXJlLlwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdZb3UgZ290IGl0LCBjaGllZicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogZmFsc2UsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgXCJTdHJhbmdlci5jbG90aEJ1bmRsZVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ2EgYnVuZGxlIG9mIGNsb3RoJyxcclxuICAgICAgICBwbHVyYWxOYW1lOiAnYnVuZGxlcyBvZiBjbG90aCcsXHJcbiAgICAgICAgdGV4dDogXygnV2hhdCBsaWVzIHdpdGhpbj8nKSxcclxuICAgICAgICBvblVzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBfKFwiQSBidW5kbGUgb2YgY2xvdGhcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiT25lIGRheSB5b3UnbGwgYmUgYWJsZSB0byB1c2UgdGhpcyBpdGVtLCBidXQgcmlnaHQgbm93IHRoYXQgZnVuY3Rpb25hbGl0eSBpc24ndCBwcmVzZW50LlwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJQbGVhc2UgcG9saXRlbHkgbGVhdmUgdGhlIHByZW1pc2VzIHdpdGhvdXQgYWNrbm93bGVkZ2luZyB0aGlzIG1pc3NpbmcgZmVhdHVyZS5cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnWW91IGdvdCBpdCwgY2hpZWYnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIFwiU3RyYW5nZXIuY29pblwiOiB7XHJcbiAgICAgICAgbmFtZTogJ0Egc3RyYW5nZSBjb2luJyxcclxuICAgICAgICBwbHVyYWxOYW1lOiAnc3RyYW5nZSBjb2lucycsXHJcbiAgICAgICAgdGV4dDogXygnQm90aCBzaWRlcyBkZXBpY3QgdGhlIHNhbWUgaW1hZ2UnKSxcclxuICAgICAgICBvblVzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBfKFwiQSBzdHJhbmdlIGNvaW5cIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiT25lIGRheSB5b3UnbGwgYmUgYWJsZSB0byB1c2UgdGhpcyBpdGVtLCBidXQgcmlnaHQgbm93IHRoYXQgZnVuY3Rpb25hbGl0eSBpc24ndCBwcmVzZW50LlwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJQbGVhc2UgcG9saXRlbHkgbGVhdmUgdGhlIHByZW1pc2VzIHdpdGhvdXQgYWNrbm93bGVkZ2luZyB0aGlzIG1pc3NpbmcgZmVhdHVyZS5cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnWW91IGdvdCBpdCwgY2hpZWYnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIFwiQ2FwdGFpbi5zdXBwbGllc1wiOiB7XHJcbiAgICAgICAgbmFtZTogJ1N1cHBsaWVzIGZvciB0aGUgTWF5b3InLFxyXG4gICAgICAgIHRleHQ6ICdUaGV5XFwncmUgaGVhdnksIGJ1dCBub3QgaW4gYSB3YXkgdGhhdCBpbXBhY3RzIGdhbWVwbGF5JyxcclxuICAgICAgICBvblVzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBfKFwiU3VwcGxpZXMgZm9yIHRoZSBNYXlvclwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJBIGJpZyBib3ggb2Ygc3R1ZmYgZm9yIHRoZSB2aWxsYWdlLiBMb29rcyBsaWtlIHJhdyBtYXRlcmlhbHMsIG1vc3RseS5cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiSSBzaG91bGQgcmVhbGx5IHRha2UgdGhpcyBiYWNrIHRvIHRoZSBNYXlvci5cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnT2theScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogZmFsc2UsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgXCJvbGRMYWR5LkNhbmR5XCI6IHtcclxuICAgICAgICBuYW1lOiAnYSBwaWVjZSBvZiBoYXJkIGNhbmR5JyxcclxuICAgICAgICBwbHVyYWxOYW1lOiAncGllY2VzIG9mIGhhcmQgY2FuZHknLFxyXG4gICAgICAgIHRleHQ6ICdHaXZlbiB0byB5b3UgYnkgYSBuaWNlIG9sZCB3b21hbiBpbiBhIGNhcnJpYWdlJyxcclxuICAgICAgICBvblVzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsICdZb3UgcG9wIHRoZSBoYXJkIGNhbmR5IGludG8geW91ciBtb3V0aC4gQSBmZXcgbWludXRlcyAnIFxyXG4gICAgICAgICAgICAgICAgKyAnbGF0ZXIsIGl0XFwncyBnb25lLCBsZWF2aW5nIGJlaGluZCBvbmx5IGEgbWlsZCBzZW5zZSBvZiBndWlsdCBhYm91dCBub3QgJyBcclxuICAgICAgICAgICAgICAgICsgJ2NhbGxpbmcgeW91ciBncmFuZG1hIG1vcmUgb2Z0ZW4uJylcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogdHJ1ZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogdHJ1ZVxyXG4gICAgfVxyXG59XHJcbiIsIi8vIG1hc3RlciBsaXN0IG9mIHBlcmtzXHJcblxyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgUGVyayB9IGZyb20gXCIuL3BlcmtcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBQZXJrTGlzdDoge1tpZDogc3RyaW5nXTogUGVya30gPSB7XHJcbiAgICAndHVtbXlQYWluJzoge1xyXG4gICAgICAgIG5hbWU6ICdTb2NrZWQgaW4gdGhlIFN0b21hY2gnLFxyXG4gICAgICAgIHRleHQ6ICdUaGlzIGRvZXNuXFwndCBzZWVtIGxpa2UgYSBwZXJrLCB0YmgnLFxyXG4gICAgICAgIGZ1bGxUZXh0OiBbXHJcbiAgICAgICAgICAgIF8oXCJZb3UgZ290IGhpcyBpbiB0aGUgc3RvbWFjaCByZWFsbHkgaGFyZC5cIiksXHJcbiAgICAgICAgICAgIF8oXCJMaWtlLCBSRUFMTFkgaGFyZC4gQnkgYSBncmlubmluZyBqZXJrLlwiKVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgaXNBY3RpdmU6ICgpID0+IHRydWUsXHJcbiAgICAgICAgc3RhdEJvbnVzZXM6IHsgfSxcclxuICAgICAgICB0aW1lTGVmdDogLTFcclxuICAgIH1cclxufSIsImltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgeyBRdWVzdCB9IGZyb20gXCIuL3F1ZXN0XCI7XHJcblxyXG5leHBvcnQgY29uc3QgUXVlc3RMb2c6IHtbaWQ6IHN0cmluZ106IFF1ZXN0fSA9IHtcclxuICAgIFwibWF5b3JTdXBwbGllc1wiOiB7XHJcbiAgICAgICAgbmFtZTogXCJTdXBwbGllcyBmb3IgdGhlIE1heW9yXCIsXHJcbiAgICAgICAgbG9nRGVzY3JpcHRpb246IFwiVGhlIG1heW9yIGhhcyBhc2tlZCB5b3UgdG8gZ2V0IHNvbWUgc3VwcGxpZXMgZm9yIGhpbSBmcm9tIHRoZSBPdXRwb3N0LlwiLFxyXG4gICAgICAgIHBoYXNlczoge1xyXG4gICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJHbyBjaGVjayBvdXQgdGhlIFJvYWQgdG8gdGhlIE91dHBvc3QgdG8gc2VlIGlmIHlvdSBjYW4gZmluZCBvdXQgbW9yZVwiLFxyXG4gICAgICAgICAgICAgICAgcmVxdWlyZW1lbnRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJSZXF1aXJlbWVudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJFNNLmdldCgnUm9hZC5vcGVuJykgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnUm9hZC5jb3VudGVyJykgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJJIHNob3VsZCBnbyBjaGVjayBvdXQgdGhlIFJvYWQgdG8gdGhlIE91dHBvc3RcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCRTTS5nZXQoJ1JvYWQub3BlbicpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ1JvYWQuY291bnRlcicpICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJJIHNob3VsZCBrZWVwIGV4cGxvcmluZyB0aGUgUm9hZCB0byB0aGUgT3V0cG9zdFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoJFNNLmdldCgnUm9hZC5vcGVuJykgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyID4gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJJJ3ZlIGZvdW5kIHRoZSB3YXkgdG8gdGhlIE91dHBvc3RcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCRTTS5nZXQoJ1JvYWQub3BlbicpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPiAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIDE6IHtcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkFzayB0aGUgQ2FwdGFpbiBvZiB0aGUgT3V0cG9zdCBhYm91dCB0aGUgc3VwcGxpZXNcIixcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVtZW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyUmVxdWlyZW1lbnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnT3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnKSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkkgc2hvdWxkIHRyeSB0YWxraW5nIHRvIHRoZSBDYXB0YWluIG9mIHRoZSBPdXRwb3N0XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ091dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ091dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIENoYXJhY3Rlci5pbnZlbnRvcnlbXCJDYXB0YWluLnN1cHBsaWVzXCJdID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiSSBzaG91bGQgYXNrIHRoZSBDYXB0YWluIGFib3V0IHRoZSBtaXNzaW5nIHN1cHBsaWVzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ091dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ091dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIENoYXJhY3Rlci5pbnZlbnRvcnlbXCJDYXB0YWluLnN1cHBsaWVzXCJdICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiSSd2ZSBnb3R0ZW4gdGhlIHN1cHBsaWVzIGZyb20gdGhlIENhcHRhaW5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdPdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcpICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ091dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgKENoYXJhY3Rlci5pbnZlbnRvcnlbXCJDYXB0YWluLnN1cHBsaWVzXCJdICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCAkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIDI6IHtcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlJldHVybiB0aGUgc3VwcGxpZXMgdG8gdGhlIE1heW9yXCIsXHJcbiAgICAgICAgICAgICAgICByZXF1aXJlbWVudHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlclJlcXVpcmVtZW50OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gIFwiSSBzaG91bGQgaGFuZCB0aGVzZSBzdXBwbGllcyBvdmVyIHRvIHRoZSBNYXlvclwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoJFNNLmdldCgndmlsbGFnZS5tYXlvci5oYXZlR2l2ZW5TdXBwbGllcycpICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykgYXMgbnVtYmVyID4gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJJJ3ZlIGhhbmRlZCBvdmVyIHRoZSBzdXBwbGllcyB0byB0aGUgTWF5b3JcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnKSAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykgYXMgbnVtYmVyID4gMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvKlxyXG4gKiBNb2R1bGUgZm9yIGhhbmRsaW5nIFN0YXRlc1xyXG4gKiBcclxuICogQWxsIHN0YXRlcyBzaG91bGQgYmUgZ2V0IGFuZCBzZXQgdGhyb3VnaCB0aGUgU3RhdGVNYW5hZ2VyICgkU00pLlxyXG4gKiBcclxuICogVGhlIG1hbmFnZXIgaXMgaW50ZW5kZWQgdG8gaGFuZGxlIGFsbCBuZWVkZWQgY2hlY2tzIGFuZCBlcnJvciBjYXRjaGluZy5cclxuICogVGhpcyBpbmNsdWRlcyBjcmVhdGluZyB0aGUgcGFyZW50cyBvZiBsYXllcmVkL2RlZXAgc3RhdGVzIHNvIHVuZGVmaW5lZCBzdGF0ZXNcclxuICogZG8gbm90IG5lZWQgdG8gYmUgdGVzdGVkIGZvciBhbmQgY3JlYXRlZCBiZWZvcmVoYW5kLlxyXG4gKiBcclxuICogV2hlbiBhIHN0YXRlIGlzIGNoYW5nZWQsIGFuIHVwZGF0ZSBldmVudCBpcyBzZW50IG91dCBjb250YWluaW5nIHRoZSBuYW1lIG9mIHRoZSBzdGF0ZVxyXG4gKiBjaGFuZ2VkIG9yIGluIHRoZSBjYXNlIG9mIG11bHRpcGxlIGNoYW5nZXMgKC5zZXRNLCAuYWRkTSkgdGhlIHBhcmVudCBjbGFzcyBjaGFuZ2VkLlxyXG4gKiBFdmVudDogdHlwZTogJ3N0YXRlVXBkYXRlJywgc3RhdGVOYW1lOiA8cGF0aCBvZiBzdGF0ZSBvciBwYXJlbnQgc3RhdGU+XHJcbiAqIFxyXG4gKiBPcmlnaW5hbCBmaWxlIGNyZWF0ZWQgYnk6IE1pY2hhZWwgR2FsdXNoYVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyBOb3RpZmljYXRpb25zIH0gZnJvbSBcIi4vbm90aWZpY2F0aW9uc1wiO1xyXG5cclxudmFyIFN0YXRlTWFuYWdlciA9IHtcclxuXHRcdFxyXG5cdE1BWF9TVE9SRTogOTk5OTk5OTk5OTk5OTksXHJcblx0XHJcblx0b3B0aW9uczoge30sXHJcblx0XHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdFx0XHJcblx0XHQvL2NyZWF0ZSBjYXRlZ29yaWVzXHJcblx0XHR2YXIgY2F0cyA9IFtcclxuXHRcdFx0J2ZlYXR1cmVzJyxcdFx0Ly9iaWcgZmVhdHVyZXMgbGlrZSBidWlsZGluZ3MsIGxvY2F0aW9uIGF2YWlsYWJpbGl0eSwgdW5sb2NrcywgZXRjXHJcblx0XHRcdCdzdG9yZXMnLCBcdFx0Ly9saXR0bGUgc3R1ZmYsIGl0ZW1zLCB3ZWFwb25zLCBldGNcclxuXHRcdFx0J2NoYXJhY3RlcicsIFx0Ly90aGlzIGlzIGZvciBwbGF5ZXIncyBjaGFyYWN0ZXIgc3RhdHMgc3VjaCBhcyBwZXJrc1xyXG5cdFx0XHQnaW5jb21lJyxcclxuXHRcdFx0J3RpbWVycycsXHJcblx0XHRcdCdnYW1lJywgXHRcdC8vbW9zdGx5IGxvY2F0aW9uIHJlbGF0ZWQ6IGZpcmUgdGVtcCwgd29ya2VycywgcG9wdWxhdGlvbiwgd29ybGQgbWFwLCBldGNcclxuXHRcdFx0J3BsYXlTdGF0cycsXHQvL2FueXRoaW5nIHBsYXkgcmVsYXRlZDogcGxheSB0aW1lLCBsb2FkcywgZXRjXHJcblx0XHRcdCdwcmV2aW91cycsXHRcdC8vIHByZXN0aWdlLCBzY29yZSwgdHJvcGhpZXMgKGluIGZ1dHVyZSksIGFjaGlldmVtZW50cyAoYWdhaW4sIG5vdCB5ZXQpLCBldGNcclxuXHRcdFx0J291dGZpdCdcdFx0XHQvLyB1c2VkIHRvIHRlbXBvcmFyaWx5IHN0b3JlIHRoZSBpdGVtcyB0byBiZSB0YWtlbiBvbiB0aGUgcGF0aFxyXG5cdFx0XTtcclxuXHRcdFxyXG5cdFx0Zm9yKHZhciB3aGljaCBpbiBjYXRzKSB7XHJcblx0XHRcdGlmKCEkU00uZ2V0KGNhdHNbd2hpY2hdKSkgJFNNLnNldChjYXRzW3doaWNoXSwge30pOyBcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly9zdWJzY3JpYmUgdG8gc3RhdGVVcGRhdGVzXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHQkLkRpc3BhdGNoKCdzdGF0ZVVwZGF0ZScpLnN1YnNjcmliZSgkU00uaGFuZGxlU3RhdGVVcGRhdGVzKTtcclxuXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHR3aW5kb3cuJFNNID0gdGhpcztcclxuXHR9LFxyXG5cdFxyXG5cdC8vY3JlYXRlIGFsbCBwYXJlbnRzIGFuZCB0aGVuIHNldCBzdGF0ZVxyXG5cdGNyZWF0ZVN0YXRlOiBmdW5jdGlvbihzdGF0ZU5hbWUsIHZhbHVlKSB7XHJcblx0XHR2YXIgd29yZHMgPSBzdGF0ZU5hbWUuc3BsaXQoL1suXFxbXFxdJ1wiXSsvKTtcclxuXHRcdC8vZm9yIHNvbWUgcmVhc29uIHRoZXJlIGFyZSBzb21ldGltZXMgZW1wdHkgc3RyaW5nc1xyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB3b3Jkcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAod29yZHNbaV0gPT09ICcnKSB7XHJcblx0XHRcdFx0d29yZHMuc3BsaWNlKGksIDEpO1xyXG5cdFx0XHRcdGktLTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly8gSU1QT1JUQU5UOiBTdGF0ZSByZWZlcnMgdG8gd2luZG93LlN0YXRlLCB3aGljaCBJIGhhZCB0byBpbml0aWFsaXplIG1hbnVhbGx5XHJcblx0XHQvLyAgICBpbiBFbmdpbmUudHM7IHBsZWFzZSBkb24ndCBmb3JnZXQgdGhpcyBhbmQgbWVzcyB3aXRoIGFueXRoaW5nIG5hbWVkXHJcblx0XHQvLyAgICBcIlN0YXRlXCIgb3IgXCJ3aW5kb3cuU3RhdGVcIiwgdGhpcyBzdHVmZiBpcyB3ZWlyZGx5IHByZWNhcmlvdXMgYWZ0ZXIgdHlwZXNjcmlwdGluZ1xyXG5cdFx0Ly8gICAgdGhpcyBjb2RlYmFzZSwgYW5kIEkgZG9uJ3QgaGF2ZSB0aGUgc2FuaXR5IHBvaW50cyB0byBmaWd1cmUgb3V0IHdoeVxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0dmFyIG9iaiA9IFN0YXRlO1xyXG5cdFx0dmFyIHcgPSBudWxsO1xyXG5cdFx0Zm9yKHZhciBpPTAsIGxlbj13b3Jkcy5sZW5ndGgtMTtpPGxlbjtpKyspe1xyXG5cdFx0XHR3ID0gd29yZHNbaV07XHJcblx0XHRcdGlmKG9ialt3XSA9PT0gdW5kZWZpbmVkICkgb2JqW3ddID0ge307XHJcblx0XHRcdG9iaiA9IG9ialt3XTtcclxuXHRcdH1cclxuXHRcdG9ialt3b3Jkc1tpXV0gPSB2YWx1ZTtcclxuXHRcdHJldHVybiBvYmo7XHJcblx0fSxcclxuXHRcclxuXHQvL3NldCBzaW5nbGUgc3RhdGVcclxuXHQvL2lmIG5vRXZlbnQgaXMgdHJ1ZSwgdGhlIHVwZGF0ZSBldmVudCB3b24ndCB0cmlnZ2VyLCB1c2VmdWwgZm9yIHNldHRpbmcgbXVsdGlwbGUgc3RhdGVzIGZpcnN0XHJcblx0c2V0OiBmdW5jdGlvbihzdGF0ZU5hbWUsIHZhbHVlLCBub0V2ZW50Pykge1xyXG5cdFx0dmFyIGZ1bGxQYXRoID0gJFNNLmJ1aWxkUGF0aChzdGF0ZU5hbWUpO1xyXG5cdFx0XHJcblx0XHQvL21ha2Ugc3VyZSB0aGUgdmFsdWUgaXNuJ3Qgb3ZlciB0aGUgZW5naW5lIG1heGltdW1cclxuXHRcdGlmKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJiB2YWx1ZSA+ICRTTS5NQVhfU1RPUkUpIHZhbHVlID0gJFNNLk1BWF9TVE9SRTtcclxuXHRcdFxyXG5cdFx0dHJ5e1xyXG5cdFx0XHRldmFsKCcoJytmdWxsUGF0aCsnKSA9IHZhbHVlJyk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdC8vcGFyZW50IGRvZXNuJ3QgZXhpc3QsIHNvIG1ha2UgcGFyZW50XHJcblx0XHRcdCRTTS5jcmVhdGVTdGF0ZShzdGF0ZU5hbWUsIHZhbHVlKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly9zdG9yZXMgdmFsdWVzIGNhbiBub3QgYmUgbmVnYXRpdmVcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdGlmKHN0YXRlTmFtZS5pbmRleE9mKCdzdG9yZXMnKSA9PT0gMCAmJiAkU00uZ2V0KHN0YXRlTmFtZSwgdHJ1ZSkgPCAwKSB7XHJcblx0XHRcdGV2YWwoJygnK2Z1bGxQYXRoKycpID0gMCcpO1xyXG5cdFx0XHRFbmdpbmUubG9nKCdXQVJOSU5HOiBzdGF0ZTonICsgc3RhdGVOYW1lICsgJyBjYW4gbm90IGJlIGEgbmVnYXRpdmUgdmFsdWUuIFNldCB0byAwIGluc3RlYWQuJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0RW5naW5lLmxvZyhzdGF0ZU5hbWUgKyAnICcgKyB2YWx1ZSk7XHJcblx0XHRcclxuXHRcdGlmIChub0V2ZW50ID09PSB1bmRlZmluZWQgfHwgbm9FdmVudCA9PSB0cnVlKSB7XHJcblx0XHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0XHQkU00uZmlyZVVwZGF0ZShzdGF0ZU5hbWUpO1xyXG5cdFx0fVx0XHRcclxuXHR9LFxyXG5cdFxyXG5cdC8vc2V0cyBhIGxpc3Qgb2Ygc3RhdGVzXHJcblx0c2V0TTogZnVuY3Rpb24ocGFyZW50TmFtZSwgbGlzdCwgbm9FdmVudD8pIHtcclxuXHRcdCRTTS5idWlsZFBhdGgocGFyZW50TmFtZSk7XHJcblx0XHRcclxuXHRcdC8vbWFrZSBzdXJlIHRoZSBzdGF0ZSBleGlzdHMgdG8gYXZvaWQgZXJyb3JzLFxyXG5cdFx0aWYoJFNNLmdldChwYXJlbnROYW1lKSA9PT0gdW5kZWZpbmVkKSAkU00uc2V0KHBhcmVudE5hbWUsIHt9LCB0cnVlKTtcclxuXHRcdFxyXG5cdFx0Zm9yKHZhciBrIGluIGxpc3Qpe1xyXG5cdFx0XHQkU00uc2V0KHBhcmVudE5hbWUrJ1tcIicraysnXCJdJywgbGlzdFtrXSwgdHJ1ZSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmKCFub0V2ZW50KSB7XHJcblx0XHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0XHQkU00uZmlyZVVwZGF0ZShwYXJlbnROYW1lKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdC8vc2hvcnRjdXQgZm9yIGFsdGVyaW5nIG51bWJlciB2YWx1ZXMsIHJldHVybiAxIGlmIHN0YXRlIHdhc24ndCBhIG51bWJlclxyXG5cdGFkZDogZnVuY3Rpb24oc3RhdGVOYW1lLCB2YWx1ZSwgbm9FdmVudD8pIHtcclxuXHRcdHZhciBlcnIgPSAwO1xyXG5cdFx0Ly8wIGlmIHVuZGVmaW5lZCwgbnVsbCAoYnV0IG5vdCB7fSkgc2hvdWxkIGFsbG93IGFkZGluZyB0byBuZXcgb2JqZWN0c1xyXG5cdFx0Ly9jb3VsZCBhbHNvIGFkZCBpbiBhIHRydWUgPSAxIHRoaW5nLCB0byBoYXZlIHNvbWV0aGluZyBnbyBmcm9tIGV4aXN0aW5nICh0cnVlKVxyXG5cdFx0Ly90byBiZSBhIGNvdW50LCBidXQgdGhhdCBtaWdodCBiZSB1bndhbnRlZCBiZWhhdmlvciAoYWRkIHdpdGggbG9vc2UgZXZhbCBwcm9iYWJseSB3aWxsIGhhcHBlbiBhbnl3YXlzKVxyXG5cdFx0dmFyIG9sZCA9ICRTTS5nZXQoc3RhdGVOYW1lLCB0cnVlKTtcclxuXHRcdFxyXG5cdFx0Ly9jaGVjayBmb3IgTmFOIChvbGQgIT0gb2xkKSBhbmQgbm9uIG51bWJlciB2YWx1ZXNcclxuXHRcdGlmKG9sZCAhPSBvbGQpe1xyXG5cdFx0XHRFbmdpbmUubG9nKCdXQVJOSU5HOiAnK3N0YXRlTmFtZSsnIHdhcyBjb3JydXB0ZWQgKE5hTikuIFJlc2V0dGluZyB0byAwLicpO1xyXG5cdFx0XHRvbGQgPSAwO1xyXG5cdFx0XHQkU00uc2V0KHN0YXRlTmFtZSwgb2xkICsgdmFsdWUsIG5vRXZlbnQpO1xyXG5cdFx0fSBlbHNlIGlmKHR5cGVvZiBvbGQgIT0gJ251bWJlcicgfHwgdHlwZW9mIHZhbHVlICE9ICdudW1iZXInKXtcclxuXHRcdFx0RW5naW5lLmxvZygnV0FSTklORzogQ2FuIG5vdCBkbyBtYXRoIHdpdGggc3RhdGU6JytzdGF0ZU5hbWUrJyBvciB2YWx1ZTonK3ZhbHVlKycgYmVjYXVzZSBhdCBsZWFzdCBvbmUgaXMgbm90IGEgbnVtYmVyLicpO1xyXG5cdFx0XHRlcnIgPSAxO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JFNNLnNldChzdGF0ZU5hbWUsIG9sZCArIHZhbHVlLCBub0V2ZW50KTsgLy9zZXRTdGF0ZSBoYW5kbGVzIGV2ZW50IGFuZCBzYXZlXHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBlcnI7XHJcblx0fSxcclxuXHRcclxuXHQvL2FsdGVycyBtdWx0aXBsZSBudW1iZXIgdmFsdWVzLCByZXR1cm4gbnVtYmVyIG9mIGZhaWxzXHJcblx0YWRkTTogZnVuY3Rpb24ocGFyZW50TmFtZSwgbGlzdCwgbm9FdmVudD8pIHtcclxuXHRcdHZhciBlcnIgPSAwO1xyXG5cdFx0XHJcblx0XHQvL21ha2Ugc3VyZSB0aGUgcGFyZW50IGV4aXN0cyB0byBhdm9pZCBlcnJvcnNcclxuXHRcdGlmKCRTTS5nZXQocGFyZW50TmFtZSkgPT09IHVuZGVmaW5lZCkgJFNNLnNldChwYXJlbnROYW1lLCB7fSwgdHJ1ZSk7XHJcblx0XHRcclxuXHRcdGZvcih2YXIgayBpbiBsaXN0KXtcclxuXHRcdFx0aWYoJFNNLmFkZChwYXJlbnROYW1lKydbXCInK2srJ1wiXScsIGxpc3Rba10sIHRydWUpKSBlcnIrKztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYoIW5vRXZlbnQpIHtcclxuXHRcdFx0RW5naW5lLnNhdmVHYW1lKCk7XHJcblx0XHRcdCRTTS5maXJlVXBkYXRlKHBhcmVudE5hbWUpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGVycjtcclxuXHR9LFxyXG5cdFxyXG5cdC8vcmV0dXJuIHN0YXRlLCB1bmRlZmluZWQgb3IgMFxyXG5cdGdldDogZnVuY3Rpb24oc3RhdGVOYW1lLCByZXF1ZXN0WmVybz8pOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBOdW1iZXIgfCBudWxsIHwgQm9vbGVhbiB7XHJcblx0XHR2YXIgd2hpY2hTdGF0ZTogdW5kZWZpbmVkIHwgbnVsbCB8IE51bWJlciB8IHN0cmluZyA9IG51bGw7XHJcblx0XHR2YXIgZnVsbFBhdGggPSAkU00uYnVpbGRQYXRoKHN0YXRlTmFtZSk7XHJcblx0XHRcclxuXHRcdC8vY2F0Y2ggZXJyb3JzIGlmIHBhcmVudCBvZiBzdGF0ZSBkb2Vzbid0IGV4aXN0XHJcblx0XHR0cnl7XHJcblx0XHRcdGV2YWwoJ3doaWNoU3RhdGUgPSAoJytmdWxsUGF0aCsnKScpO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHR3aGljaFN0YXRlID0gdW5kZWZpbmVkO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvL3ByZXZlbnRzIHJlcGVhdGVkIGlmIHVuZGVmaW5lZCwgbnVsbCwgZmFsc2Ugb3Ige30sIHRoZW4geCA9IDAgc2l0dWF0aW9uc1xyXG5cdFx0aWYoKCF3aGljaFN0YXRlXHJcblx0XHRcdC8vICB8fCB3aGljaFN0YXRlID09IHt9XHJcblx0XHRcdCkgJiYgcmVxdWVzdFplcm8pIHJldHVybiAwO1xyXG5cdFx0ZWxzZSByZXR1cm4gd2hpY2hTdGF0ZTtcclxuXHR9LFxyXG5cdFxyXG5cdC8vbWFpbmx5IGZvciBsb2NhbCBjb3B5IHVzZSwgYWRkKE0pIGNhbiBmYWlsIHNvIHdlIGNhbid0IHNob3J0Y3V0IHRoZW1cclxuXHQvL3NpbmNlIHNldCBkb2VzIG5vdCBmYWlsLCB3ZSBrbm93IHN0YXRlIGV4aXN0cyBhbmQgY2FuIHNpbXBseSByZXR1cm4gdGhlIG9iamVjdFxyXG5cdHNldGdldDogZnVuY3Rpb24oc3RhdGVOYW1lLCB2YWx1ZSwgbm9FdmVudD8pe1xyXG5cdFx0JFNNLnNldChzdGF0ZU5hbWUsIHZhbHVlLCBub0V2ZW50KTtcclxuXHRcdHJldHVybiBldmFsKCcoJyskU00uYnVpbGRQYXRoKHN0YXRlTmFtZSkrJyknKTtcclxuXHR9LFxyXG5cdFxyXG5cdHJlbW92ZTogZnVuY3Rpb24oc3RhdGVOYW1lLCBub0V2ZW50Pykge1xyXG5cdFx0dmFyIHdoaWNoU3RhdGUgPSAkU00uYnVpbGRQYXRoKHN0YXRlTmFtZSk7XHJcblx0XHR0cnl7XHJcblx0XHRcdGV2YWwoJyhkZWxldGUgJyt3aGljaFN0YXRlKycpJyk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdC8vaXQgZGlkbid0IGV4aXN0IGluIHRoZSBmaXJzdCBwbGFjZVxyXG5cdFx0XHRFbmdpbmUubG9nKCdXQVJOSU5HOiBUcmllZCB0byByZW1vdmUgbm9uLWV4aXN0YW50IHN0YXRlIFxcJycrc3RhdGVOYW1lKydcXCcuJyk7XHJcblx0XHR9XHJcblx0XHRpZighbm9FdmVudCl7XHJcblx0XHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0XHQkU00uZmlyZVVwZGF0ZShzdGF0ZU5hbWUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0Ly9jcmVhdGVzIGZ1bGwgcmVmZXJlbmNlIGZyb20gaW5wdXRcclxuXHQvL2hvcGVmdWxseSB0aGlzIHdvbid0IGV2ZXIgbmVlZCB0byBiZSBtb3JlIGNvbXBsaWNhdGVkXHJcblx0YnVpbGRQYXRoOiBmdW5jdGlvbihpbnB1dCl7XHJcblx0XHR2YXIgZG90ID0gKGlucHV0LmNoYXJBdCgwKSA9PSAnWycpPyAnJyA6ICcuJzsgLy9pZiBpdCBzdGFydHMgd2l0aCBbZm9vXSBubyBkb3QgdG8gam9pblxyXG5cdFx0cmV0dXJuICdTdGF0ZScgKyBkb3QgKyBpbnB1dDtcclxuXHR9LFxyXG5cdFxyXG5cdGZpcmVVcGRhdGU6IGZ1bmN0aW9uKHN0YXRlTmFtZSwgc2F2ZT8pe1xyXG5cdFx0dmFyIGNhdGVnb3J5ID0gJFNNLmdldENhdGVnb3J5KHN0YXRlTmFtZSk7XHJcblx0XHRpZihzdGF0ZU5hbWUgPT0gdW5kZWZpbmVkKSBzdGF0ZU5hbWUgPSBjYXRlZ29yeSA9ICdhbGwnOyAvL2Jlc3QgaWYgdGhpcyBkb2Vzbid0IGhhcHBlbiBhcyBpdCB3aWxsIHRyaWdnZXIgbW9yZSBzdHVmZlxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5wdWJsaXNoKHsnY2F0ZWdvcnknOiBjYXRlZ29yeSwgJ3N0YXRlTmFtZSc6c3RhdGVOYW1lfSk7XHJcblx0XHRpZihzYXZlKSBFbmdpbmUuc2F2ZUdhbWUoKTtcclxuXHR9LFxyXG5cdFxyXG5cdGdldENhdGVnb3J5OiBmdW5jdGlvbihzdGF0ZU5hbWUpe1xyXG5cdFx0dmFyIGZpcnN0T0IgPSBzdGF0ZU5hbWUuaW5kZXhPZignWycpO1xyXG5cdFx0dmFyIGZpcnN0RG90ID0gc3RhdGVOYW1lLmluZGV4T2YoJy4nKTtcclxuXHRcdHZhciBjdXRvZmYgPSBudWxsO1xyXG5cdFx0aWYoZmlyc3RPQiA9PSAtMSB8fCBmaXJzdERvdCA9PSAtMSl7XHJcblx0XHRcdGN1dG9mZiA9IGZpcnN0T0IgPiBmaXJzdERvdCA/IGZpcnN0T0IgOiBmaXJzdERvdDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGN1dG9mZiA9IGZpcnN0T0IgPCBmaXJzdERvdCA/IGZpcnN0T0IgOiBmaXJzdERvdDtcclxuXHRcdH1cclxuXHRcdGlmIChjdXRvZmYgPT0gLTEpe1xyXG5cdFx0XHRyZXR1cm4gc3RhdGVOYW1lO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHN0YXRlTmFtZS5zdWJzdHIoMCxjdXRvZmYpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cdCAqIFN0YXJ0IG9mIHNwZWNpZmljIHN0YXRlIGZ1bmN0aW9uc1xyXG5cdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblx0XHJcblx0aGFuZGxlU3RhdGVVcGRhdGVzOiBmdW5jdGlvbihlKXtcclxuXHRcdFxyXG5cdH1cdFxyXG59O1xyXG5cclxuLy9hbGlhc1xyXG5leHBvcnQgY29uc3QgJFNNID0gU3RhdGVNYW5hZ2VyO1xyXG4iLCJpbXBvcnQgeyBOb3RpZmljYXRpb25zIH0gZnJvbSAnLi9ub3RpZmljYXRpb25zJztcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSAnLi9zdGF0ZV9tYW5hZ2VyJztcclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSAnLi9lbmdpbmUnO1xyXG5cclxuZXhwb3J0IGNvbnN0IFdlYXRoZXIgPSB7XHJcbiAgICBpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblxyXG4gICAgICAgIC8vc3Vic2NyaWJlIHRvIHN0YXRlVXBkYXRlc1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuXHRcdCQuRGlzcGF0Y2goJ3N0YXRlVXBkYXRlJykuc3Vic2NyaWJlKFdlYXRoZXIuaGFuZGxlU3RhdGVVcGRhdGVzKTtcclxuICAgIH0sXHJcblxyXG4gICAgaGFuZGxlU3RhdGVVcGRhdGVzOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgaWYgKGUuY2F0ZWdvcnkgPT0gJ3dlYXRoZXInKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoJFNNLmdldCgnd2VhdGhlcicpKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdzdW5ueSc6IFxyXG4gICAgICAgICAgICAgICAgICAgIFdlYXRoZXIuc3RhcnRTdW5ueSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnY2xvdWR5JzpcclxuICAgICAgICAgICAgICAgICAgICBXZWF0aGVyLnN0YXJ0Q2xvdWR5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdyYWlueSc6XHJcbiAgICAgICAgICAgICAgICAgICAgV2VhdGhlci5zdGFydFJhaW55KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfbGFzdFdlYXRoZXI6ICdzdW5ueScsXHJcblxyXG4gICAgc3RhcnRTdW5ueTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJUaGUgc3VuIGJlZ2lucyB0byBzaGluZS5cIik7XHJcbiAgICAgICAgV2VhdGhlci5fbGFzdFdlYXRoZXIgPSAnc3VubnknO1xyXG4gICAgICAgICQoJ2JvZHknKS5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6ICcjRkZGRkZGJ30sICdzbG93Jyk7XHJcbiAgICAgICAgJCgnZGl2I3N0b3Jlczo6YmVmb3JlJykuYW5pbWF0ZSh7YmFja2dyb3VuZENvbG9yOiAnI0ZGRkZGRid9LCAnc2xvdycpO1xyXG4gICAgICAgIFdlYXRoZXIubWFrZVJhaW5TdG9wKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHN0YXJ0Q2xvdWR5OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoV2VhdGhlci5fbGFzdFdlYXRoZXIgPT0gJ3N1bm55Jykge1xyXG4gICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIkNsb3VkcyByb2xsIGluLCBvYnNjdXJpbmcgdGhlIHN1bi5cIik7XHJcbiAgICAgICAgfSBlbHNlIGlmIChXZWF0aGVyLl9sYXN0V2VhdGhlciA9PSAncmFpbnknKSB7XHJcbiAgICAgICAgICAgIE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiVGhlIHJhaW4gYnJlYWtzLCBidXQgdGhlIGNsb3VkcyByZW1haW4uXCIpXHJcbiAgICAgICAgfVxyXG4gICAgICAgICQoJ2JvZHknKS5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6ICcjOEI4Nzg2J30sICdzbG93Jyk7XHJcbiAgICAgICAgJCgnZGl2I3N0b3Jlczo6YmVmb3JlJykuYW5pbWF0ZSh7YmFja2dyb3VuZENvbG9yOiAnIzhCODc4Nid9LCAnc2xvdycpO1xyXG4gICAgICAgIFdlYXRoZXIuX2xhc3RXZWF0aGVyID0gJ2Nsb3VkeSc7XHJcbiAgICAgICAgV2VhdGhlci5tYWtlUmFpblN0b3AoKTtcclxuICAgIH0sXHJcblxyXG4gICAgc3RhcnRSYWlueTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKFdlYXRoZXIuX2xhc3RXZWF0aGVyID09ICdzdW5ueScpIHtcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJUaGUgd2luZCBzdWRkZW5seSBwaWNrcyB1cC4gQ2xvdWRzIHJvbGwgaW4sIGhlYXZ5IHdpdGggcmFpbiwgYW5kIHJhaW5kcm9wcyBmYWxsIHNvb24gYWZ0ZXIuXCIpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoV2VhdGhlci5fbGFzdFdlYXRoZXIgPT0gJ2Nsb3VkeScpIHtcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJUaGUgY2xvdWRzIHRoYXQgd2VyZSBwcmV2aW91c2x5IGNvbnRlbnQgdG8gaGFuZyBvdmVyaGVhZCBsZXQgbG9vc2UgYSBtb2RlcmF0ZSBkb3ducG91ci5cIilcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgJCgnYm9keScpLmFuaW1hdGUoe2JhY2tncm91bmRDb2xvcjogJyM2RDY5NjgnfSwgJ3Nsb3cnKTtcclxuICAgICAgICAkKCdkaXYjc3RvcmVzOjpiZWZvcmUnKS5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6ICcjNkQ2OTY4J30sICdzbG93Jyk7XHJcbiAgICAgICAgV2VhdGhlci5fbGFzdFdlYXRoZXIgPSAncmFpbnknO1xyXG4gICAgICAgIFdlYXRoZXIubWFrZUl0UmFpbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICBfbG9jYXRpb246ICcnLFxyXG5cclxuICAgIGluaXRpYXRlV2VhdGhlcjogZnVuY3Rpb24oYXZhaWxhYmxlV2VhdGhlciwgbG9jYXRpb24pIHtcclxuICAgICAgICBpZiAoV2VhdGhlci5fbG9jYXRpb24gPT0gJycpIFdlYXRoZXIuX2xvY2F0aW9uID0gbG9jYXRpb247XHJcbiAgICAgICAgLy8gaWYgaW4gbmV3IGxvY2F0aW9uLCBlbmQgd2l0aG91dCB0cmlnZ2VyaW5nIGEgbmV3IHdlYXRoZXIgaW5pdGlhdGlvbiwgXHJcbiAgICAgICAgLy8gbGVhdmluZyB0aGUgbmV3IGxvY2F0aW9uJ3MgaW5pdGlhdGVXZWF0aGVyIGNhbGxiYWNrIHRvIGRvIGl0cyB0aGluZ1xyXG4gICAgICAgIGVsc2UgaWYgKFdlYXRoZXIuX2xvY2F0aW9uICE9IGxvY2F0aW9uKSByZXR1cm47IFxyXG5cclxuICAgICAgICB2YXIgY2hvc2VuV2VhdGhlciA9ICdub25lJztcclxuICAgICAgICAvL2dldCBvdXIgcmFuZG9tIGZyb20gMCB0byAxXHJcbiAgICAgICAgdmFyIHJuZCA9IE1hdGgucmFuZG9tKCk7XHJcbiAgXHJcbiAgICAgICAgLy9pbml0aWFsaXNlIG91ciBjdW11bGF0aXZlIHBlcmNlbnRhZ2VcclxuICAgICAgICB2YXIgY3VtdWxhdGl2ZUNoYW5jZSA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaSBpbiBhdmFpbGFibGVXZWF0aGVyKSB7XHJcbiAgICAgICAgICAgIGN1bXVsYXRpdmVDaGFuY2UgKz0gYXZhaWxhYmxlV2VhdGhlcltpXTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChybmQgPCBjdW11bGF0aXZlQ2hhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICBjaG9zZW5XZWF0aGVyID0gaTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY2hvc2VuV2VhdGhlciAhPSAkU00uZ2V0KCd3ZWF0aGVyJykpICRTTS5zZXQoJ3dlYXRoZXInLCBjaG9zZW5XZWF0aGVyKTtcclxuICAgICAgICBFbmdpbmUuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhdGVXZWF0aGVyKGF2YWlsYWJsZVdlYXRoZXIsIGxvY2F0aW9uKTtcclxuICAgICAgICB9LCAzICogNjAgKiAxMDAwKTtcclxuICAgIH0sXHJcblxyXG4gICAgbWFrZUl0UmFpbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gaHR0cHM6Ly9jb2RlcGVuLmlvL2FyaWNrbGUvcGVuL1hLak1aWVxyXG4gICAgICAgIC8vY2xlYXIgb3V0IGV2ZXJ5dGhpbmdcclxuICAgICAgICAkKCcucmFpbicpLmVtcHR5KCk7XHJcbiAgICAgIFxyXG4gICAgICAgIHZhciBpbmNyZW1lbnQgPSAwO1xyXG4gICAgICAgIHZhciBkcm9wcyA9IFwiXCI7XHJcbiAgICAgICAgdmFyIGJhY2tEcm9wcyA9IFwiXCI7XHJcbiAgICAgIFxyXG4gICAgICAgIHdoaWxlIChpbmNyZW1lbnQgPCAxMDApIHtcclxuICAgICAgICAgIC8vY291cGxlIHJhbmRvbSBudW1iZXJzIHRvIHVzZSBmb3IgdmFyaW91cyByYW5kb21pemF0aW9uc1xyXG4gICAgICAgICAgLy9yYW5kb20gbnVtYmVyIGJldHdlZW4gOTggYW5kIDFcclxuICAgICAgICAgIHZhciByYW5kb0h1bmRvID0gKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg5OCAtIDEgKyAxKSArIDEpKTtcclxuICAgICAgICAgIC8vcmFuZG9tIG51bWJlciBiZXR3ZWVuIDUgYW5kIDJcclxuICAgICAgICAgIHZhciByYW5kb0ZpdmVyID0gKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg1IC0gMiArIDEpICsgMikpO1xyXG4gICAgICAgICAgLy9pbmNyZW1lbnRcclxuICAgICAgICAgIGluY3JlbWVudCArPSByYW5kb0ZpdmVyO1xyXG4gICAgICAgICAgLy9hZGQgaW4gYSBuZXcgcmFpbmRyb3Agd2l0aCB2YXJpb3VzIHJhbmRvbWl6YXRpb25zIHRvIGNlcnRhaW4gQ1NTIHByb3BlcnRpZXNcclxuICAgICAgICAgIGRyb3BzICs9ICc8ZGl2IGNsYXNzPVwiZHJvcFwiIHN0eWxlPVwibGVmdDogJyArIGluY3JlbWVudCArICclOyBib3R0b206ICcgKyAocmFuZG9GaXZlciArIHJhbmRvRml2ZXIgLSAxICsgMTAwKSArICclOyBhbmltYXRpb24tZGVsYXk6IDAuJyArIHJhbmRvSHVuZG8gKyAnczsgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjUnICsgcmFuZG9IdW5kbyArICdzO1wiPjxkaXYgY2xhc3M9XCJzdGVtXCIgc3R5bGU9XCJhbmltYXRpb24tZGVsYXk6IDAuJyArIHJhbmRvSHVuZG8gKyAnczsgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjUnICsgcmFuZG9IdW5kbyArICdzO1wiPjwvZGl2PjxkaXYgY2xhc3M9XCJzcGxhdFwiIHN0eWxlPVwiYW5pbWF0aW9uLWRlbGF5OiAwLicgKyByYW5kb0h1bmRvICsgJ3M7IGFuaW1hdGlvbi1kdXJhdGlvbjogMC41JyArIHJhbmRvSHVuZG8gKyAncztcIj48L2Rpdj48L2Rpdj4nO1xyXG4gICAgICAgICAgYmFja0Ryb3BzICs9ICc8ZGl2IGNsYXNzPVwiZHJvcFwiIHN0eWxlPVwicmlnaHQ6ICcgKyBpbmNyZW1lbnQgKyAnJTsgYm90dG9tOiAnICsgKHJhbmRvRml2ZXIgKyByYW5kb0ZpdmVyIC0gMSArIDEwMCkgKyAnJTsgYW5pbWF0aW9uLWRlbGF5OiAwLicgKyByYW5kb0h1bmRvICsgJ3M7IGFuaW1hdGlvbi1kdXJhdGlvbjogMC41JyArIHJhbmRvSHVuZG8gKyAncztcIj48ZGl2IGNsYXNzPVwic3RlbVwiIHN0eWxlPVwiYW5pbWF0aW9uLWRlbGF5OiAwLicgKyByYW5kb0h1bmRvICsgJ3M7IGFuaW1hdGlvbi1kdXJhdGlvbjogMC41JyArIHJhbmRvSHVuZG8gKyAncztcIj48L2Rpdj48ZGl2IGNsYXNzPVwic3BsYXRcIiBzdHlsZT1cImFuaW1hdGlvbi1kZWxheTogMC4nICsgcmFuZG9IdW5kbyArICdzOyBhbmltYXRpb24tZHVyYXRpb246IDAuNScgKyByYW5kb0h1bmRvICsgJ3M7XCI+PC9kaXY+PC9kaXY+JztcclxuICAgICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAgICQoJy5yYWluLmZyb250LXJvdycpLmFwcGVuZChkcm9wcyk7XHJcbiAgICAgICAgJCgnLnJhaW4uYmFjay1yb3cnKS5hcHBlbmQoYmFja0Ryb3BzKTtcclxuICAgIH0sXHJcblxyXG4gICAgbWFrZVJhaW5TdG9wOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKCcucmFpbicpLmVtcHR5KCk7XHJcbiAgICB9XHJcbn0iXX0=
