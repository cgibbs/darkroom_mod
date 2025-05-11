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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL3RleHRCdWlsZGVyLnRzIiwic3JjL2xpYi90cmFuc2xhdGUudHMiLCJzcmMvc2NyaXB0L0J1dHRvbi50cyIsInNyYy9zY3JpcHQvY2hhcmFjdGVycy9jYXB0YWluLnRzIiwic3JjL3NjcmlwdC9jaGFyYWN0ZXJzL2xpei50cyIsInNyYy9zY3JpcHQvY2hhcmFjdGVycy9tYXlvci50cyIsInNyYy9zY3JpcHQvZW5naW5lLnRzIiwic3JjL3NjcmlwdC9ldmVudHMudHMiLCJzcmMvc2NyaXB0L2V2ZW50cy9yb2Fkd2FuZGVyLnRzIiwic3JjL3NjcmlwdC9oZWFkZXIudHMiLCJzcmMvc2NyaXB0L25vdGlmaWNhdGlvbnMudHMiLCJzcmMvc2NyaXB0L3BsYWNlcy9vdXRwb3N0LnRzIiwic3JjL3NjcmlwdC9wbGFjZXMvcm9hZC50cyIsInNyYy9zY3JpcHQvcGxhY2VzL3ZpbGxhZ2UudHMiLCJzcmMvc2NyaXB0L3BsYXllci9jaGFyYWN0ZXIudHMiLCJzcmMvc2NyaXB0L3BsYXllci9pdGVtTGlzdC50cyIsInNyYy9zY3JpcHQvcGxheWVyL3BlcmtMaXN0LnRzIiwic3JjL3NjcmlwdC9wbGF5ZXIvcXVlc3RMb2cudHMiLCJzcmMvc2NyaXB0L3N0YXRlX21hbmFnZXIudHMiLCJzcmMvc2NyaXB0L3dlYXRoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQSwrREFBK0Q7QUFDL0QscUNBQXFDO0FBQzlCLElBQU0sR0FBRyxHQUFHLFVBQVMsSUFBMkQ7SUFDbkYsSUFBTSxNQUFNLEdBQUcsSUFBSSxLQUFhLENBQUM7SUFDakMsS0FBSyxJQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNuQixJQUFJLE9BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRO1lBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FB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Q0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIHRleHQgYnVpbGRlciB1dGlsaXR5LCB1c2VkIGZvciBoYW5kbGluZyBjb25kaXRpb25hbCB0ZXh0IGluIFxyXG4vLyBkZXNjcmlwdGlvbnMgYW5kIG90aGVyIHRleHQgYmx1cmJzXHJcbmV4cG9ydCBjb25zdCBfdGIgPSBmdW5jdGlvbih0ZXh0OiBBcnJheTxzdHJpbmcgfCB7IHRleHQ6IHN0cmluZywgaXNWaXNpYmxlOiBGdW5jdGlvbiB9Pikge1xyXG4gICAgY29uc3Qgb3V0cHV0ID0gbmV3IEFycmF5PHN0cmluZz47XHJcbiAgICBmb3IgKGNvbnN0IGkgaW4gdGV4dCkge1xyXG4gICAgICAgIGlmICh0eXBlb2YodGV4dFtpXSkgPT09IFwic3RyaW5nXCIpIG91dHB1dC5wdXNoKHRleHRbaV0pO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoKHRleHRbaV0gYXMge3RleHQ6IHN0cmluZywgaXNWaXNpYmxlOiBGdW5jdGlvbn0pLmlzVmlzaWJsZSgpKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCgodGV4dFtpXSBhcyB7dGV4dDogc3RyaW5nLCBpc1Zpc2libGU6IEZ1bmN0aW9ufSkudGV4dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3V0cHV0O1xyXG59IiwiLy8gKGZ1bmN0aW9uKCkge1xyXG5cclxuLy8gXHR2YXIgdHJhbnNsYXRlID0gZnVuY3Rpb24odGV4dClcclxuLy8gXHR7XHJcbi8vIFx0XHR2YXIgeGxhdGUgPSB0cmFuc2xhdGVMb29rdXAodGV4dCk7XHJcblx0XHRcclxuLy8gXHRcdGlmICh0eXBlb2YgeGxhdGUgPT0gXCJmdW5jdGlvblwiKVxyXG4vLyBcdFx0e1xyXG4vLyBcdFx0XHR4bGF0ZSA9IHhsYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbi8vIFx0XHR9XHJcbi8vIFx0XHRlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSlcclxuLy8gXHRcdHtcclxuLy8gXHRcdFx0dmFyIGFwcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcclxuLy8gXHRcdFx0dmFyIGFyZ3MgPSBhcHMuY2FsbCggYXJndW1lbnRzLCAxICk7XHJcbiAgXHJcbi8vIFx0XHRcdHhsYXRlID0gZm9ybWF0dGVyKHhsYXRlLCBhcmdzKTtcclxuLy8gXHRcdH1cclxuXHRcdFxyXG4vLyBcdFx0cmV0dXJuIHhsYXRlO1xyXG4vLyBcdH07XHJcblx0XHJcbi8vIFx0Ly8gSSB3YW50IGl0IGF2YWlsYWJsZSBleHBsaWNpdHkgYXMgd2VsbCBhcyB2aWEgdGhlIG9iamVjdFxyXG4vLyBcdHRyYW5zbGF0ZS50cmFuc2xhdGUgPSB0cmFuc2xhdGU7XHJcblx0XHJcbi8vIFx0Ly9mcm9tIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tLzc3NjE5NiB2aWEgaHR0cDovL2RhdmVkYXNoLmNvbS8yMDEwLzExLzE5L3B5dGhvbmljLXN0cmluZy1mb3JtYXR0aW5nLWluLWphdmFzY3JpcHQvIFxyXG4vLyBcdHZhciBkZWZhdWx0Rm9ybWF0dGVyID0gKGZ1bmN0aW9uKCkge1xyXG4vLyBcdFx0dmFyIHJlID0gL1xceyhbXn1dKylcXH0vZztcclxuLy8gXHRcdHJldHVybiBmdW5jdGlvbihzLCBhcmdzKSB7XHJcbi8vIFx0XHRcdHJldHVybiBzLnJlcGxhY2UocmUsIGZ1bmN0aW9uKF8sIG1hdGNoKXsgcmV0dXJuIGFyZ3NbbWF0Y2hdOyB9KTtcclxuLy8gXHRcdH07XHJcbi8vIFx0fSgpKTtcclxuLy8gXHR2YXIgZm9ybWF0dGVyID0gZGVmYXVsdEZvcm1hdHRlcjtcclxuLy8gXHR0cmFuc2xhdGUuc2V0Rm9ybWF0dGVyID0gZnVuY3Rpb24obmV3Rm9ybWF0dGVyKVxyXG4vLyBcdHtcclxuLy8gXHRcdGZvcm1hdHRlciA9IG5ld0Zvcm1hdHRlcjtcclxuLy8gXHR9O1xyXG5cdFxyXG4vLyBcdHRyYW5zbGF0ZS5mb3JtYXQgPSBmdW5jdGlvbigpXHJcbi8vIFx0e1xyXG4vLyBcdFx0dmFyIGFwcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcclxuLy8gXHRcdHZhciBzID0gYXJndW1lbnRzWzBdO1xyXG4vLyBcdFx0dmFyIGFyZ3MgPSBhcHMuY2FsbCggYXJndW1lbnRzLCAxICk7XHJcbiAgXHJcbi8vIFx0XHRyZXR1cm4gZm9ybWF0dGVyKHMsIGFyZ3MpO1xyXG4vLyBcdH07XHJcblxyXG4vLyBcdHZhciBkeW5vVHJhbnMgPSBudWxsO1xyXG4vLyBcdHRyYW5zbGF0ZS5zZXREeW5hbWljVHJhbnNsYXRvciA9IGZ1bmN0aW9uKG5ld0R5bm9UcmFucylcclxuLy8gXHR7XHJcbi8vIFx0XHRkeW5vVHJhbnMgPSBuZXdEeW5vVHJhbnM7XHJcbi8vIFx0fTtcclxuXHJcbi8vIFx0dmFyIHRyYW5zbGF0aW9uID0gbnVsbDtcclxuLy8gXHR0cmFuc2xhdGUuc2V0VHJhbnNsYXRpb24gPSBmdW5jdGlvbihuZXdUcmFuc2xhdGlvbilcclxuLy8gXHR7XHJcbi8vIFx0XHR0cmFuc2xhdGlvbiA9IG5ld1RyYW5zbGF0aW9uO1xyXG4vLyBcdH07XHJcblx0XHJcbi8vIFx0ZnVuY3Rpb24gdHJhbnNsYXRlTG9va3VwKHRhcmdldClcclxuLy8gXHR7XHJcbi8vIFx0XHRpZiAodHJhbnNsYXRpb24gPT0gbnVsbCB8fCB0YXJnZXQgPT0gbnVsbClcclxuLy8gXHRcdHtcclxuLy8gXHRcdFx0cmV0dXJuIHRhcmdldDtcclxuLy8gXHRcdH1cclxuXHRcdFxyXG4vLyBcdFx0aWYgKHRhcmdldCBpbiB0cmFuc2xhdGlvbiA9PSBmYWxzZSlcclxuLy8gXHRcdHtcclxuLy8gXHRcdFx0aWYgKGR5bm9UcmFucyAhPSBudWxsKVxyXG4vLyBcdFx0XHR7XHJcbi8vIFx0XHRcdFx0cmV0dXJuIGR5bm9UcmFucyh0YXJnZXQpO1xyXG4vLyBcdFx0XHR9XHJcbi8vIFx0XHRcdHJldHVybiB0YXJnZXQ7XHJcbi8vIFx0XHR9XHJcblx0XHRcclxuLy8gXHRcdHZhciByZXN1bHQgPSB0cmFuc2xhdGlvblt0YXJnZXRdO1xyXG4vLyBcdFx0aWYgKHJlc3VsdCA9PSBudWxsKVxyXG4vLyBcdFx0e1xyXG4vLyBcdFx0XHRyZXR1cm4gdGFyZ2V0O1xyXG4vLyBcdFx0fVxyXG5cdFx0XHJcbi8vIFx0XHRyZXR1cm4gcmVzdWx0O1xyXG4vLyBcdH07XHJcblx0XHJcbi8vIFx0d2luZG93Ll8gPSB0cmFuc2xhdGU7XHJcblxyXG4vLyB9KSgpO1xyXG5cclxuLy8gZXhwb3J0IGNvbnN0IF8gPSB3aW5kb3cuXztcclxuXHJcbmV4cG9ydCBjb25zdCBfID0gZnVuY3Rpb24ocykgeyByZXR1cm4gczsgfSIsImltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uL2xpYi90cmFuc2xhdGVcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBCdXR0b24gPSB7XHJcblx0QnV0dG9uOiBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0XHRpZih0eXBlb2Ygb3B0aW9ucy5jb29sZG93biA9PSAnbnVtYmVyJykge1xyXG5cdFx0XHR0aGlzLmRhdGFfY29vbGRvd24gPSBvcHRpb25zLmNvb2xkb3duO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5kYXRhX3JlbWFpbmluZyA9IDA7XHJcblx0XHRpZih0eXBlb2Ygb3B0aW9ucy5jbGljayA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdHRoaXMuZGF0YV9oYW5kbGVyID0gb3B0aW9ucy5jbGljaztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dmFyIGVsID0gJCgnPGRpdj4nKVxyXG5cdFx0XHQuYXR0cignaWQnLCB0eXBlb2Yob3B0aW9ucy5pZCkgIT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmlkIDogXCJCVE5fXCIgKyBFbmdpbmUuZ2V0R3VpZCgpKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2J1dHRvbicpXHJcblx0XHRcdC50ZXh0KHR5cGVvZihvcHRpb25zLnRleHQpICE9ICd1bmRlZmluZWQnID8gb3B0aW9ucy50ZXh0IDogXCJidXR0b25cIilcclxuXHRcdFx0LmNsaWNrKGZ1bmN0aW9uKCkgeyBcclxuXHRcdFx0XHRpZighJCh0aGlzKS5oYXNDbGFzcygnZGlzYWJsZWQnKSkge1xyXG5cdFx0XHRcdFx0QnV0dG9uLmNvb2xkb3duKCQodGhpcykpO1xyXG5cdFx0XHRcdFx0JCh0aGlzKS5kYXRhKFwiaGFuZGxlclwiKSgkKHRoaXMpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHRcdC5kYXRhKFwiaGFuZGxlclwiLCAgdHlwZW9mIG9wdGlvbnMuY2xpY2sgPT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnMuY2xpY2sgOiBmdW5jdGlvbigpIHsgRW5naW5lLmxvZyhcImNsaWNrXCIpOyB9KVxyXG5cdFx0XHQuZGF0YShcInJlbWFpbmluZ1wiLCAwKVxyXG5cdFx0XHQuZGF0YShcImNvb2xkb3duXCIsIHR5cGVvZiBvcHRpb25zLmNvb2xkb3duID09ICdudW1iZXInID8gb3B0aW9ucy5jb29sZG93biA6IDApO1xyXG5cdFx0aWYgKG9wdGlvbnMuaW1hZ2UgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRlbC5hdHRyKFwic3R5bGVcIiwgXCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXFxcIlwiICsgb3B0aW9ucy5pbWFnZSArIFwiXFxcIik7IGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7IGJhY2tncm91bmQtc2l6ZTogY292ZXI7IGhlaWdodDogMTcwcHg7IGNvbG9yOiB3aGl0ZTt0ZXh0LXNoYWRvdzogMHB4IDBweCAycHggYmxhY2tcIilcclxuXHRcdH1cclxuXHRcdGVsLmFwcGVuZCgkKFwiPGRpdj5cIikuYWRkQ2xhc3MoJ2Nvb2xkb3duJykpO1xyXG5cdFx0XHJcblx0XHRpZihvcHRpb25zLmNvc3QpIHtcclxuXHRcdFx0dmFyIHR0UG9zID0gb3B0aW9ucy50dFBvcyA/IG9wdGlvbnMudHRQb3MgOiBcImJvdHRvbSByaWdodFwiO1xyXG5cdFx0XHR2YXIgY29zdFRvb2x0aXAgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCd0b29sdGlwICcgKyB0dFBvcyk7XHJcblx0XHRcdGZvcih2YXIgayBpbiBvcHRpb25zLmNvc3QpIHtcclxuXHRcdFx0XHQkKFwiPGRpdj5cIikuYWRkQ2xhc3MoJ3Jvd19rZXknKS50ZXh0KF8oaykpLmFwcGVuZFRvKGNvc3RUb29sdGlwKTtcclxuXHRcdFx0XHQkKFwiPGRpdj5cIikuYWRkQ2xhc3MoJ3Jvd192YWwnKS50ZXh0KG9wdGlvbnMuY29zdFtrXSkuYXBwZW5kVG8oY29zdFRvb2x0aXApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNvc3RUb29sdGlwLmNoaWxkcmVuKCkubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdGNvc3RUb29sdGlwLmFwcGVuZFRvKGVsKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZihvcHRpb25zLndpZHRoKSB7XHJcblx0XHRcdGVsLmNzcygnd2lkdGgnLCBvcHRpb25zLndpZHRoKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGVsO1xyXG5cdH0sXHJcblx0XHJcblx0c2V0RGlzYWJsZWQ6IGZ1bmN0aW9uKGJ0biwgZGlzYWJsZWQpIHtcclxuXHRcdGlmKGJ0bikge1xyXG5cdFx0XHRpZighZGlzYWJsZWQgJiYgIWJ0bi5kYXRhKCdvbkNvb2xkb3duJykpIHtcclxuXHRcdFx0XHRidG4ucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdH0gZWxzZSBpZihkaXNhYmxlZCkge1xyXG5cdFx0XHRcdGJ0bi5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRidG4uZGF0YSgnZGlzYWJsZWQnLCBkaXNhYmxlZCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRpc0Rpc2FibGVkOiBmdW5jdGlvbihidG4pIHtcclxuXHRcdGlmKGJ0bikge1xyXG5cdFx0XHRyZXR1cm4gYnRuLmRhdGEoJ2Rpc2FibGVkJykgPT09IHRydWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHRcclxuXHRjb29sZG93bjogZnVuY3Rpb24oYnRuKSB7XHJcblx0XHR2YXIgY2QgPSBidG4uZGF0YShcImNvb2xkb3duXCIpO1xyXG5cdFx0aWYoY2QgPiAwKSB7XHJcblx0XHRcdCQoJ2Rpdi5jb29sZG93bicsIGJ0bikuc3RvcCh0cnVlLCB0cnVlKS53aWR0aChcIjEwMCVcIikuYW5pbWF0ZSh7d2lkdGg6ICcwJSd9LCBjZCAqIDEwMDAsICdsaW5lYXInLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgYiA9ICQodGhpcykuY2xvc2VzdCgnLmJ1dHRvbicpO1xyXG5cdFx0XHRcdGIuZGF0YSgnb25Db29sZG93bicsIGZhbHNlKTtcclxuXHRcdFx0XHRpZighYi5kYXRhKCdkaXNhYmxlZCcpKSB7XHJcblx0XHRcdFx0XHRiLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdGJ0bi5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdFx0YnRuLmRhdGEoJ29uQ29vbGRvd24nLCB0cnVlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGNsZWFyQ29vbGRvd246IGZ1bmN0aW9uKGJ0bikge1xyXG5cdFx0JCgnZGl2LmNvb2xkb3duJywgYnRuKS5zdG9wKHRydWUsIHRydWUpO1xyXG5cdFx0YnRuLmRhdGEoJ29uQ29vbGRvd24nLCBmYWxzZSk7XHJcblx0XHRpZighYnRuLmRhdGEoJ2Rpc2FibGVkJykpIHtcclxuXHRcdFx0YnRuLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0fVxyXG5cdH1cclxufTsiLCJpbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCJcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIlxyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIlxyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tIFwiLi4vcGxheWVyL2NoYXJhY3RlclwiXHJcblxyXG5leHBvcnQgY29uc3QgQ2FwdGFpbiA9IHtcclxuXHR0YWxrVG9DYXB0YWluOiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ1RoZSBDYXB0YWluXFwncyBUZW50JyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VlbkZsYWc6ICgpID0+ICRTTS5nZXQoJ091dHBvc3QuY2FwdGFpbi5oYXZlTWV0JyksXHJcblx0XHRcdFx0XHRuZXh0U2NlbmU6ICdtYWluJyxcclxuXHRcdFx0XHRcdG9uTG9hZDogKCkgPT4gJFNNLnNldCgnT3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnLCAxKSxcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnWW91IGVudGVyIHRoZSBmYW5jaWVzdC1sb29raW5nIHRlbnQgaW4gdGhlIE91dHBvc3QuIEEgbGFyZ2UgbWFuIHdpdGggYSB0b290aGJydXNoIG11c3RhY2hlIGFuZCBhIHNldmVyZSBmcm93biBsb29rcyB1cCBmcm9tIGhpcyBkZXNrLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIlNpciwgeW91IGhhdmUgZW50ZXJlZCB0aGUgdGVudCBvZiBDYXB0YWluIEZpbm5lYXMuIFdoYXQgYnVzaW5lc3MgZG8geW91IGhhdmUgaGVyZT9cIicpXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhc2tBYm91dFN1cHBsaWVzJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnQXNrIEFib3V0IFN1cHBsaWVzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOidhc2tBYm91dFN1cHBsaWVzJ30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNob29zZTogQ2FwdGFpbi5oYW5kbGVTdXBwbGllcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZTogKCkgPT4gISRTTS5nZXQoJ091dHBvc3QuY2FwdGFpbi5hc2tlZEFib3V0U3VwcGxpZXMnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXNrQWJvdXRDYXB0YWluJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnQXNrIEFib3V0IENhcHRhaW4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6ICdjYXB0YWluUmFtYmxlJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnTGVhdmUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAnbWFpbic6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1RoZSBDYXB0YWluIGdyZWV0cyB5b3Ugd2FybWx5LicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIkFoaCwgeWVzLCB3ZWxjb21lIGJhY2suIFdoYXQgY2FuIEkgZG8gZm9yIHlvdT9cIicpXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhc2tBYm91dFN1cHBsaWVzJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnQXNrIEFib3V0IFN1cHBsaWVzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOidhc2tBYm91dFN1cHBsaWVzJ30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNob29zZTogQ2FwdGFpbi5oYW5kbGVTdXBwbGllcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZTogKCkgPT4gISRTTS5nZXQoJ091dHBvc3QuY2FwdGFpbi5hc2tlZEFib3V0U3VwcGxpZXMnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXNrQWJvdXRDYXB0YWluJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnQXNrIEFib3V0IENhcHRhaW4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6J2NhcHRhaW5SYW1ibGUnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnbGVhdmUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdMZWF2ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICdjYXB0YWluUmFtYmxlJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnVGhlIENhcHRhaW5cXCdzIGV5ZXMgZ2xlYW0gYXQgdGhlIG9wcG9ydHVuaXR5IHRvIHJ1biBkb3duIGhpcyBsaXN0IG9mIGFjaGlldmVtZW50cy4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCJXaHksIElcXCdsbCBoYXZlIHlvdSBrbm93IHRoYXQgeW91IHN0YW5kIGluIHRoZSBwcmVzZW5jZSBvZiBub25lIG90aGVyIHRoYW4gRmlubmVhcyBKLiBGb2JzbGV5LCBDYXB0YWluIG9mIHRoZSBSb3lhbCBBcm15XFwncyBGaWZ0aCBEaXZpc2lvbiwgdGhlIGZpbmVzdCBEaXZpc2lvbiBpbiBIaXMgTWFqZXN0eVxcJ3Mgc2VydmljZS5cIicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdIZSBwdWZmcyBvdXQgaGlzIGNoZXN0LCBkcmF3aW5nIGF0dGVudGlvbiB0byBoaXMgbWFueSBtZWRhbHMuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiSSBoYXZlIGNhbXBhaWduZWQgb24gYmVoYWxmIG9mIE91ciBMb3Jkc2hpcCBhY3Jvc3MgbWFueSBsYW5kcywgaW5jbHVkaW5nIFRoZSBGYXIgV2VzdCwgdGhlIG5vcnRoZXJuIGJvcmRlcnMgb2YgVW1iZXJzaGlyZSBhbmQgUGVsaW5nYWwsIE5ldyBCZWxsaXNpYSwgYW5kIGVhY2ggb2YgdGhlIEZpdmUgSXNsZXMgb2YgdGhlIFBpcnJoaWFuIFNlYS5cIicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdIZSBwYXVzZXMgZm9yIGEgbW9tZW50LCBwZXJoYXBzIHRvIHNlZSBpZiB5b3UgYXJlIHN1aXRhYmx5IGltcHJlc3NlZCwgdGhlbiBjb250aW51ZXMuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiQXMgQ2FwdGFpbiBvZiB0aGUgRmlmdGggRGl2aXNpb24sIEkgaGFkIHRoZSBlc3RlZW1lZCBwcml2aWxlZ2Ugb2YgZW5zdXJpbmcgdGhlIHNhZmV0eSBvZiB0aGVzZSBsYW5kcyBmb3Igb3VyIGZhaXIgY2l0aXplbnMuIEkgaGF2ZSBiZWVuIGF3YXJkZWQgbWFueSB0aW1lcyBvdmVyIGZvciBteSBicmF2ZXJ5IGluIHRoZSBmYWNlIG9mIHV0bW9zdCBwZXJpbC4gRm9yIGluc3RhbmNlLCBkdXJpbmcgdGhlIFNlYSBDYW1wYWlnbiBvbiBUaHlwcGUsIFRoaXJkIG9mIHRoZSBGaXZlIElzbGVzLCB3ZSB3ZXJlIGFtYnVzaGVkIHdoaWxlIGRpc2VtYmFya2luZyBmcm9tIG91ciBzaGlwLiBUaGlua2luZyBxdWlja2x5LCBJLi4uXCInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnVGhlIGNhcHRhaW4gY29udGludWVzIHRvIHJhbWJsZSBsaWtlIHRoaXMgZm9yIHNldmVyYWwgbW9yZSBtaW51dGVzLCBnaXZpbmcgeW91IHRpbWUgdG8gYmVjb21lIG11Y2ggbW9yZSBmYW1pbGlhciB3aXRoIHRoZSBkaXJ0IHVuZGVyIHlvdXIgZmluZ2VybmFpbHMuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiLi4uIGFuZCBUSEFULCBteSBnb29kIGFkdmVudHVyZXIsIGlzIHdoeSBJIGFsd2F5cyBrZWVwIGZyZXNoIGJhc2lsIG9uIGhhbmQuXCInKVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnZmFzY2luYXRpbmcnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdGYXNjaW5hdGluZycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTonbWFpbkNvbnRpbnVlZCd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgJ21haW5Db250aW51ZWQnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdUaGUgQ2FwdGFpbiBzaHVmZmxlcyBoaXMgcGFwZXJzIGluIGEgc29tZXdoYXQgcGVyZm9ybWF0aXZlIHdheS4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCJXYXMgdGhlcmUgc29tZXRoaW5nIGVsc2UgeW91IG5lZWRlZD9cIicpXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhc2tBYm91dFN1cHBsaWVzJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnQXNrIEFib3V0IFN1cHBsaWVzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOidhc2tBYm91dFN1cHBsaWVzJ30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNob29zZTogQ2FwdGFpbi5oYW5kbGVTdXBwbGllcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZTogKCkgPT4gISRTTS5nZXQoJ091dHBvc3QuY2FwdGFpbi5hc2tlZEFib3V0U3VwcGxpZXMnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXNrQWJvdXRDYXB0YWluJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnQXNrIEFib3V0IENhcHRhaW4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6J2NhcHRhaW5SYW1ibGUnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnbGVhdmUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdMZWF2ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICdhc2tBYm91dFN1cHBsaWVzJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnVGhlIENhcHRhaW5cXCdzIGV5ZXMgZ2xlYW0gd2l0aCBhIG1peHR1cmUgb2YgcmVhbGl6YXRpb24gYW5kIGd1aWx0LicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIkFoaCwgeWVzLCByaWdodCwgdGhlIHN1cHBsaWVzLiBJIHN1cHBvc2UgdGhlIE1heW9yIGlzIHN0aWxsIHdhaXRpbmcgZm9yIHRob3NlLiBIYXZlIGEgbG9vayBpbiB0aGF0IGNoZXN0IG92ZXIgdGhlcmUsIGl0IHNob3VsZCBoYXZlIGV2ZXJ5dGhpbmcgeW91IG5lZWQuXCInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnSGUgaW5kaWNhdGVzIHRvIGEgY2hlc3QgYXQgdGhlIGJhY2sgb2YgdGhlIHJvb20uIFlvdSBvcGVuIHRoZSBsaWQsIHJldmVhbGluZyB0aGUgc3VwcGxpZXMgd2l0aGluLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdZb3UgdGFrZSB0aGUgc3VwcGxpZXMuJylcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdHb29kIFN0dWZmJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfSxcclxuXHJcbiAgICBoYW5kbGVTdXBwbGllczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJFNNLnNldCgnT3V0cG9zdC5jYXB0YWluLmFza2VkQWJvdXRTdXBwbGllcycsIDEpO1xyXG4gICAgICAgIENoYXJhY3Rlci5hZGRUb0ludmVudG9yeShcIkNhcHRhaW4uc3VwcGxpZXNcIik7XHJcbiAgICAgICAgQ2hhcmFjdGVyLmNoZWNrUXVlc3RTdGF0dXMoXCJtYXlvclN1cHBsaWVzXCIpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgVmlsbGFnZSB9IGZyb20gXCIuLi9wbGFjZXMvdmlsbGFnZVwiO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tIFwiLi4vcGxheWVyL2NoYXJhY3RlclwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IExpeiA9IHtcclxuICAgIHNldExpekFjdGl2ZTogZnVuY3Rpb24oKSB7XHJcblx0XHQkU00uc2V0KCd2aWxsYWdlLmxpekFjdGl2ZScsIDEpO1xyXG5cdFx0JFNNLnNldCgndmlsbGFnZS5saXouY2FuRmluZEJvb2snLCAwKTtcclxuXHRcdCRTTS5zZXQoJ3ZpbGxhZ2UubGl6Lmhhc0Jvb2snLCAxKTtcclxuXHRcdFZpbGxhZ2UudXBkYXRlQnV0dG9uKCk7XHJcblx0fSxcclxuXHJcblx0dGFsa1RvTGl6OiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ0xpelxcJ3MgaG91c2UsIGF0IHRoZSBlZGdlIG9mIHRvd24nKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuXHRcdFx0XHRcdHNlZW5GbGFnOiAoKSA9PiAkU00uZ2V0KCd2aWxsYWdlLmxpei5oYXZlTWV0JyksXHJcblx0XHRcdFx0XHRuZXh0U2NlbmU6ICdtYWluJyxcclxuXHRcdFx0XHRcdG9uTG9hZDogKCkgPT4gJFNNLnNldCgndmlsbGFnZS5saXouaGF2ZU1ldCcsIDEpLFxyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdZb3UgZW50ZXIgdGhlIGJ1aWxkaW5nIGFuZCBhcmUgaW1tZWRpYXRlbHkgcGx1bmdlZCBpbnRvIGEgbGFieXJpbnRoIG9mIHNoZWx2ZXMgaGFwaGF6YXJkbHkgZmlsbGVkIHdpdGggYm9va3Mgb2YgYWxsIGtpbmRzLiBBZnRlciBhIGJpdCBvZiBzZWFyY2hpbmcsIHlvdSBmaW5kIGEgc2lkZSByb29tIHdoZXJlIGEgd29tYW4gd2l0aCBtb3VzeSBoYWlyIGFuZCBnbGFzc2VzIGlzIHNpdHRpbmcgYXQgYSB3cml0aW5nIGRlc2suIFNoZVxcJ3MgcmVhZGluZyBhIGxhcmdlIGJvb2sgdGhhdCBhcHBlYXJzIHRvIGluY2x1ZGUgZGlhZ3JhbXMgb2Ygc29tZSBzb3J0IG9mIHBsYW50LiBTaGUgbG9va3MgdXAgYXMgeW91IGVudGVyIHRoZSByb29tLicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIldobyB0aGUgaGVsbCBhcmUgeW91P1wiJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdhc2tBYm91dFRvd24nOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGFib3V0IENoYWR0b3BpYScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdjaGFkdG9waWFSYW1ibGUnfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQncXVlc3QnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGZvciBhIHF1ZXN0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ3F1ZXN0UmVxdWVzdCd9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdsZWF2ZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdMZWF2ZScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J2NoYWR0b3BpYVJhbWJsZSc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnTGl6IGxvb2tzIGF0IHlvdSBmb3IgYSBtb21lbnQgYmVmb3JlIHJldHVybmluZyBoZXIgZ2F6ZSB0byB0aGUgYm9vayBpbiBmcm9udCBvZiBoZXIuJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiVGhlcmVcXCdzIGEgYm9vayBpbiBoZXJlIHNvbWV3aGVyZSBhYm91dCB0aGUgZm91bmRpbmcgb2YgQ2hhZHRvcGlhLiBJZiB5b3UgY2FuIGZpbmQgaXQsIHlvdVxcJ3JlIGZyZWUgdG8gYm9ycm93IGl0LlwiJyldLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnb2theSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdPa2F5LCB0aGVuLicpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdtYWluJ30sXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6ICgpID0+ICRTTS5zZXQoJ3ZpbGxhZ2UubGl6LmNhbkZpbmRCb29rJywgdHJ1ZSlcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblxyXG5cdFx0XHRcdCdtYWluJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW18oJ0xpeiBzZWVtcyBkZXRlcm1pbmVkIG5vdCB0byBwYXkgYXR0ZW50aW9uIHRvIHlvdS4nKV0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdhc2tBYm91dFRvd24nOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGFib3V0IENoYWR0b3BpYScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdjaGFkdG9waWFSYW1ibGUnfSxcclxuXHRcdFx0XHRcdFx0XHRhdmFpbGFibGU6ICgpID0+ICEkU00uZ2V0KCd2aWxsYWdlLmxpei5jYW5GaW5kQm9vaycpXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdxdWVzdCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgZm9yIGEgcXVlc3QnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAncXVlc3RSZXF1ZXN0J31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2ZpbmRCb29rJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ1RyeSB0byBmaW5kIHRoZSBib29rJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2ZpbmRCb29rJ30sXHJcblx0XHRcdFx0XHRcdFx0Ly8gVE9ETzogYSBcInZpc2libGVcIiBmbGFnIHdvdWxkIGJlIGdvb2QgaGVyZSwgZm9yIHNpdHVhdGlvbnMgd2hlcmUgYW4gb3B0aW9uXHJcblx0XHRcdFx0XHRcdFx0Ly8gICBpc24ndCB5ZXQga25vd24gdG8gdGhlIHBsYXllclxyXG5cdFx0XHRcdFx0XHRcdHZpc2libGU6ICgpID0+ICRTTS5nZXQoJ3ZpbGxhZ2UubGl6LmNhbkZpbmRCb29rJyksXHJcblx0XHRcdFx0XHRcdFx0YXZhaWxhYmxlOiAoKSA9PiAoJFNNLmdldCgndmlsbGFnZS5saXouY2FuRmluZEJvb2snKSBhcyBudW1iZXIgPiAwKSAmJiAoJFNNLmdldCgndmlsbGFnZS5saXouaGFzQm9vaycpKVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnbGVhdmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnTGVhdmUnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdmaW5kQm9vayc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnTGVhdmluZyBMaXogdG8gaGVyIGJ1c2luZXNzLCB5b3Ugd2FuZGVyIGFyb3VuZCBhbWlkc3QgdGhlIGJvb2tzLCB3b25kZXJpbmcgaG93IHlvdVxcJ2xsIGV2ZXIgbWFuYWdlIHRvIGZpbmQgd2hhdCB5b3VcXCdyZSBsb29raW5nIGZvciBpbiBhbGwgdGhpcyB1bm9yZ2FuaXplZCBtZXNzLicpLFxyXG5cdFx0XHRcdFx0XHRfKCdGb3J0dW5hdGVseSwgdGhlIGNyZWF0b3Igb2YgdGhpcyBnYW1lIGRvZXNuXFwndCBmZWVsIGxpa2UgaXRcXCdkIGJlIHZlcnkgaW50ZXJlc3RpbmcgdG8gbWFrZSB0aGlzIGludG8gYSBwdXp6bGUsIHNvIHlvdSBzcG90IHRoZSBib29rIG9uIGEgbmVhcmJ5IHNoZWxmIGFuZCBncmFiIGl0LicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnc2ljayc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdPaCwgc2ljaycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6ICgpID0+IHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vICRTTS5zZXQoJ3N0b3Jlcy5XZWlyZCBCb29rJywgMSk7XHJcblx0XHRcdFx0XHRcdFx0XHRDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoXCJMaXoud2VpcmRCb29rXCIpO1xyXG5cdFx0XHRcdFx0XHRcdFx0JFNNLnNldCgndmlsbGFnZS5saXouaGFzQm9vaycsIDApO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J3F1ZXN0UmVxdWVzdCc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnTGl6IGxldHMgb3V0IGFuIGFubm95ZWQgc2lnaC4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJPaCBicmF2ZSBhZHZlbnR1cmVyLCBJIHNlZW0gdG8gaGF2ZSBsb3N0IG15IHBhdGllbmNlLiBXaGVuIGxhc3QgSSBzYXcgaXQsIGl0IHdhcyBzb21ld2hlcmUgb3V0c2lkZSBvZiB0aGlzIGJ1aWxkaW5nLiBXb3VsZHN0IHRob3UgcmVjb3ZlciB0aGF0IHdoaWNoIGhhcyBiZWVuIHN0b2xlbiBmcm9tIG1lP1wiJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdva2F5Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ09rYXksIGplZXosIEkgZ2V0IGl0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ21haW4nfVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcbn0iLCJpbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyBMaXogfSBmcm9tIFwiLi9saXpcIjtcclxuaW1wb3J0IHsgUm9hZCB9IGZyb20gXCIuLi9wbGFjZXMvcm9hZFwiO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tIFwiLi4vcGxheWVyL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgeyBWaWxsYWdlIH0gZnJvbSBcIi4uL3BsYWNlcy92aWxsYWdlXCI7XHJcblxyXG5leHBvcnQgY29uc3QgTWF5b3IgPSB7XHJcbiAgICB0YWxrVG9NYXlvcjogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdNZWV0IHRoZSBNYXlvcicpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0c2VlbkZsYWc6ICgpID0+ICRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZU1ldCcpLFxyXG5cdFx0XHRcdFx0bmV4dFNjZW5lOiAnbWFpbicsXHJcblx0XHRcdFx0XHRvbkxvYWQ6ICgpID0+ICRTTS5zZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZU1ldCcsIDEpLFxyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdUaGUgbWF5b3Igc21pbGVzIGF0IHlvdSBhbmQgc2F5czonKSxcclxuXHRcdFx0XHRcdFx0XygnXCJXZWxjb21lIHRvIENoYWR0b3BpYSwgSVxcJ20gdGhlIG1heW9yIG9mIHRoZXNlIGhlcmUgcGFydHMuIFdoYXQgY2FuIEkgZG8geW91IGZvcj9cIicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnYXNrQWJvdXRUb3duJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBhYm91dCBDaGFkdG9waWEnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnY2hhZHRvcGlhUmFtYmxlJ31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J3F1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBmb3IgYSBxdWVzdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdxdWVzdCd9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdsZWF2ZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdMZWF2ZScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J2NoYWR0b3BpYVJhbWJsZSc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnVGhlIG1heW9yIHB1c2hlcyB0aGUgYnJpbSBvZiBoaXMgaGF0IHVwLicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIldlbGwsIHdlXFwndmUgYWx3YXlzIGJlZW4gaGVyZSwgbG9uZyBhcyBJIGNhbiByZW1lbWJlci4gSSB0b29rIG92ZXIgYWZ0ZXIgdGhlIGxhc3QgbWF5b3IgZGllZCwgYnV0IGhlIHdvdWxkIGhhdmUgYmVlbiB0aGUgb25seSBwZXJzb24gd2l0aCBhbnkgaGlzdG9yaWNhbCBrbm93bGVkZ2Ugb2YgdGhpcyB2aWxsYWdlLlwiJyksXHJcblx0XHRcdFx0XHRcdF8oJ0hlIHBhdXNlcyBmb3IgYSBtb21lbnQgYW5kIHRvdXNsZXMgc29tZSBvZiB0aGUgd2lzcHkgaGFpcnMgdGhhdCBoYXZlIHBva2VkIG91dCBmcm9tIHVuZGVyIHRoZSByYWlzZWQgaGF0LicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIkFjdHVhbGx5LCB5b3UgbWlnaHQgYXNrIExpeiwgc2hlIGhhcyBhIGJ1bmNoIG9mIGhlciBtb3RoZXJcXCdzIGJvb2tzIGZyb20gd2F5IGJhY2sgd2hlbi4gU2hlIGxpdmVzIGF0IHRoZSBlZGdlIG9mIHRvd24uXCInKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J29rYXknOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnT2theSwgdGhlbi4nKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnbWFpbid9LFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBMaXouc2V0TGl6QWN0aXZlXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdtYWluJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdUaGUgbWF5b3Igc2F5czonKSxcclxuXHRcdFx0XHRcdFx0XygnXCJBbnl3YXksIHdoYXQgRUxTRSBjYW4gSSBkbyB5b3UgZm9yP1wiJyksXHJcblx0XHRcdFx0XHRcdF8oJ0hlIGNodWNrbGVzIGF0IGhpcyBjbGV2ZXIgdXNlIG9mIGxhbmd1YWdlLicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnYXNrQWJvdXRUb3duJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBhYm91dCBDaGFkdG9waWEnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnY2hhZHRvcGlhUmFtYmxlJ30sXHJcblx0XHRcdFx0XHRcdFx0Ly8gaW1hZ2U6IFwiYXNzZXRzL2NhcmRzL2xpdHRsZV93b2xmLnBuZ1wiXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdxdWVzdCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgZm9yIGEgcXVlc3QnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAncXVlc3QnfSxcclxuXHRcdFx0XHRcdFx0XHRhdmFpbGFibGU6ICgpID0+XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBub3QgYXZhaWxhYmxlIGlmIG1heW9yU3VwcGxpZXMgaXMgaW4tcHJvZ3Jlc3NcclxuXHRcdFx0XHRcdFx0XHRcdChDaGFyYWN0ZXIucXVlc3RTdGF0dXNbXCJtYXlvclN1cHBsaWVzXCJdID09PSB1bmRlZmluZWQpXHJcblx0XHRcdFx0XHRcdFx0XHQvLyByZS1hZGQgdGhpcyBjb25kaXRpb24gbGF0ZXIsIHdlIG5lZWQgdG8gc2VuZCB0aGVtIHRvIGEgZGlmZmVyZW50XHJcblx0XHRcdFx0XHRcdFx0XHQvLyAgIHF1ZXN0IGRpYWxvZyBpZiB0aGV5IGFscmVhZHkgZGlkIHRoZSBmaXJzdCBxdWVzdFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gfHwgKENoYXJhY3Rlci5xdWVzdFN0YXR1c1tcIm1heW9yU3VwcGxpZXNcIl0gPT0gLTEpXHJcblx0XHRcdFx0XHRcdFx0Ly8gaW1hZ2U6IFwiYXNzZXRzL2NhcmRzL2pva2VyLnBuZ1wiXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdnaXZlU3VwcGxpZXMnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnSGFuZCBvdmVyIHRoZSBzdXBwbGllcycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdnaXZlU3VwcGxpZXMnfSxcclxuXHRcdFx0XHRcdFx0XHRhdmFpbGFibGU6ICgpID0+IFxyXG5cdFx0XHRcdFx0XHRcdFx0KCRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnKSA9PT0gdW5kZWZpbmVkKSBcclxuXHRcdFx0XHRcdFx0XHRcdCYmIChDaGFyYWN0ZXIucXVlc3RTdGF0dXNbXCJtYXlvclN1cHBsaWVzXCJdICE9PSB1bmRlZmluZWQpXHJcblx0XHRcdFx0XHRcdFx0XHQmJiBDaGFyYWN0ZXIuaW52ZW50b3J5W1wiQ2FwdGFpbi5zdXBwbGllc1wiXSxcclxuXHRcdFx0XHRcdFx0XHR2aXNpYmxlOiAoKSA9PlxyXG5cdFx0XHRcdFx0XHRcdFx0KENoYXJhY3Rlci5xdWVzdFN0YXR1c1tcIm1heW9yU3VwcGxpZXNcIl0gIT09IHVuZGVmaW5lZCksXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6ICgpID0+IHtcclxuXHRcdFx0XHRcdFx0XHRcdENoYXJhY3Rlci5yZW1vdmVGcm9tSW52ZW50b3J5KFwiQ2FwdGFpbi5zdXBwbGllc1wiKTtcclxuXHRcdFx0XHRcdFx0XHRcdCRTTS5zZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnLCAxKTtcclxuXHRcdFx0XHRcdFx0XHRcdENoYXJhY3Rlci5jaGVja1F1ZXN0U3RhdHVzKFwibWF5b3JTdXBwbGllc1wiKTtcclxuXHRcdFx0XHRcdFx0XHRcdFZpbGxhZ2UudXBkYXRlQnV0dG9uKCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnbGVhdmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnTGVhdmUnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdC8vIGltYWdlOiBcImFzc2V0cy9jYXJkcy9yYXZlbi5wbmdcIlxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQncXVlc3QnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1RoZSBtYXlvciB0aGlua3MgZm9yIGEgbW9tZW50LicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIllvdSBrbm93LCBpdFxcJ3MgYmVlbiBhIHdoaWxlIHNpbmNlIG91ciBsYXN0IHNoaXBtZW50IG9mIHN1cHBsaWVzIGFycml2ZWQgZnJvbSB0aGUgT3V0cG9zdC4gTWluZCBsb29raW5nIGludG8gdGhhdCBmb3IgdXM/XCInKSxcclxuXHRcdFx0XHRcdFx0XygnXCJZb3UgY2FuIGFzayBhYm91dCBpdCBhdCB0aGUgb3V0cG9zdCwgb3IganVzdCB3YW5kZXIgYXJvdW5kIG9uIHRoZSByb2FkIGFuZCBzZWUgaWYgeW91IGZpbmQgYW55IGNsdWVzLiBFaXRoZXIgd2F5LCBpdFxcJ3MgdGltZSB0byBoaXQgdGhlIHJvYWQsIGFkdmVudHVyZXIhXCInKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2FscmlnaHR5Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FscmlnaHR5JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ21haW4nfSxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogTWF5b3Iuc3RhcnRTdXBwbGllc1F1ZXN0XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdnaXZlU3VwcGxpZXMnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1RoZSBtYXlvciBzbWlsZXMsIGFuZCB0aGUgZWRnZXMgb2YgaGlzIGV5ZXMgY3JpbmtsZS4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJUaGFuayB5b3UsIGJyYXZlIGFkdmVudHVyZXIhIFdpdGggdGhlc2Ugc3VwcGxpZXMsIHRoZSB2aWxsYWdlIGNhbiBvbmNlIGFnYWluIHRocml2ZS5cIicpLFxyXG5cdFx0XHRcdFx0XHRfKCdIZSB0YWtlcyB0aGVtIGZyb20geW91IGdyYWNpb3VzbHksIGFuZCBwcm9tcHRseSBoYW5kcyB0aGVtIG9mZiB0byBzb21lIHdvcmtlcnMsIHdobyBxdWlja2x5IGVyZWN0IGEgYnVpbGRpbmcgdGhhdCBnaXZlcyB5b3UgYSBuZXcgYnV0dG9uIHRvIGNsaWNrJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdpbXByZXNzaXZlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0ltcHJlc3NpdmUhJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdHN0YXJ0U3VwcGxpZXNRdWVzdDogZnVuY3Rpb24gKCkge1xyXG5cdFx0Ly8gaWYgKCEkU00uZ2V0KCdxdWVzdC5zdXBwbGllcycpKSB7XHJcblx0XHQvLyBcdC8vIDEgPSBzdGFydGVkLCAyID0gbmV4dCBzdGVwLCBldGMuIHVudGlsIGNvbXBsZXRlZFxyXG5cdFx0Ly8gXHQkU00uc2V0KCdxdWVzdC5zdXBwbGllcycsIDEpO1xyXG5cdFx0Ly8gXHRSb2FkLmluaXQoKTtcclxuXHRcdC8vIH1cclxuXHRcdGlmIChDaGFyYWN0ZXIucXVlc3RTdGF0dXNbXCJtYXlvclN1cHBsaWVzXCJdID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0Q2hhcmFjdGVyLnNldFF1ZXN0U3RhdHVzKFwibWF5b3JTdXBwbGllc1wiLCAwKTtcclxuXHRcdFx0Um9hZC5pbml0KCk7XHJcblx0XHR9XHJcblx0fVxyXG59IiwiLy8gQHRzLW5vY2hlY2tcclxuXHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tIFwiLi9ub3RpZmljYXRpb25zXCI7XHJcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuL2V2ZW50c1wiO1xyXG5pbXBvcnQgeyBWaWxsYWdlIH0gZnJvbSBcIi4vcGxhY2VzL3ZpbGxhZ2VcIjtcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4vcGxheWVyL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgeyBXZWF0aGVyIH0gZnJvbSBcIi4vd2VhdGhlclwiO1xyXG5pbXBvcnQgeyBSb2FkIH0gZnJvbSBcIi4vcGxhY2VzL3JvYWRcIjtcclxuaW1wb3J0IHsgT3V0cG9zdCB9IGZyb20gXCIuL3BsYWNlcy9vdXRwb3N0XCI7XHJcblxyXG5leHBvcnQgY29uc3QgRW5naW5lID0gd2luZG93LkVuZ2luZSA9IHtcclxuXHRcclxuXHRTSVRFX1VSTDogZW5jb2RlVVJJQ29tcG9uZW50KFwiaHR0cHM6Ly9jZ2liYnMuZ2l0aHViLmlvL2Rhcmtyb29tX21vZC9pbmRleC5odG1sXCIpLFxyXG5cdFZFUlNJT046IDEuMyxcclxuXHRNQVhfU1RPUkU6IDk5OTk5OTk5OTk5OTk5LFxyXG5cdFNBVkVfRElTUExBWTogMzAgKiAxMDAwLFxyXG5cdEdBTUVfT1ZFUjogZmFsc2UsXHJcblx0XHJcblx0Ly9vYmplY3QgZXZlbnQgdHlwZXNcclxuXHR0b3BpY3M6IHt9LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHtcclxuXHRcdHN0YXRlOiBudWxsLFxyXG5cdFx0ZGVidWc6IHRydWUsXHJcblx0XHRsb2c6IHRydWUsXHJcblx0XHRkcm9wYm94OiBmYWxzZSxcclxuXHRcdGRvdWJsZVRpbWU6IGZhbHNlXHJcblx0fSxcclxuXHJcblx0X2RlYnVnOiBmYWxzZSxcclxuXHRcdFxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdFx0dGhpcy5fZGVidWcgPSB0aGlzLm9wdGlvbnMuZGVidWc7XHJcblx0XHR0aGlzLl9sb2cgPSB0aGlzLm9wdGlvbnMubG9nO1xyXG5cdFx0XHJcblx0XHQvLyBDaGVjayBmb3IgSFRNTDUgc3VwcG9ydFxyXG5cdFx0aWYoIUVuZ2luZS5icm93c2VyVmFsaWQoKSkge1xyXG5cdFx0XHR3aW5kb3cubG9jYXRpb24gPSAnYnJvd3Nlcldhcm5pbmcuaHRtbCc7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIENoZWNrIGZvciBtb2JpbGVcclxuXHRcdGlmKEVuZ2luZS5pc01vYmlsZSgpKSB7XHJcblx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9ICdtb2JpbGVXYXJuaW5nLmh0bWwnO1xyXG5cdFx0fVxyXG5cclxuXHRcdEVuZ2luZS5kaXNhYmxlU2VsZWN0aW9uKCk7XHJcblx0XHRcclxuXHRcdGlmKHRoaXMub3B0aW9ucy5zdGF0ZSAhPSBudWxsKSB7XHJcblx0XHRcdHdpbmRvdy5TdGF0ZSA9IHRoaXMub3B0aW9ucy5zdGF0ZTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEVuZ2luZS5sb2FkR2FtZSgpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2xvY2F0aW9uU2xpZGVyJykuYXBwZW5kVG8oJyNtYWluJyk7XHJcblxyXG5cdFx0dmFyIG1lbnUgPSAkKCc8ZGl2PicpXHJcblx0XHRcdC5hZGRDbGFzcygnbWVudScpXHJcblx0XHRcdC5hcHBlbmRUbygnYm9keScpO1xyXG5cclxuXHRcdGlmKHR5cGVvZiBsYW5ncyAhPSAndW5kZWZpbmVkJyl7XHJcblx0XHRcdHZhciBjdXN0b21TZWxlY3QgPSAkKCc8c3Bhbj4nKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnY3VzdG9tU2VsZWN0JylcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHRcdFx0dmFyIHNlbGVjdE9wdGlvbnMgPSAkKCc8c3Bhbj4nKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnY3VzdG9tU2VsZWN0T3B0aW9ucycpXHJcblx0XHRcdFx0LmFwcGVuZFRvKGN1c3RvbVNlbGVjdCk7XHJcblx0XHRcdHZhciBvcHRpb25zTGlzdCA9ICQoJzx1bD4nKVxyXG5cdFx0XHRcdC5hcHBlbmRUbyhzZWxlY3RPcHRpb25zKTtcclxuXHRcdFx0JCgnPGxpPicpXHJcblx0XHRcdFx0LnRleHQoXCJsYW5ndWFnZS5cIilcclxuXHRcdFx0XHQuYXBwZW5kVG8ob3B0aW9uc0xpc3QpO1xyXG5cdFx0XHRcclxuXHRcdFx0JC5lYWNoKGxhbmdzLCBmdW5jdGlvbihuYW1lLGRpc3BsYXkpe1xyXG5cdFx0XHRcdCQoJzxsaT4nKVxyXG5cdFx0XHRcdFx0LnRleHQoZGlzcGxheSlcclxuXHRcdFx0XHRcdC5hdHRyKCdkYXRhLWxhbmd1YWdlJywgbmFtZSlcclxuXHRcdFx0XHRcdC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkgeyBFbmdpbmUuc3dpdGNoTGFuZ3VhZ2UodGhpcyk7IH0pXHJcblx0XHRcdFx0XHQuYXBwZW5kVG8ob3B0aW9uc0xpc3QpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2xpZ2h0c09mZiBtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygnbGlnaHRzIG9mZi4nKSlcclxuXHRcdFx0LmNsaWNrKEVuZ2luZS50dXJuTGlnaHRzT2ZmKVxyXG5cdFx0XHQuYXBwZW5kVG8obWVudSk7XHJcblxyXG5cdFx0JCgnPHNwYW4+JylcclxuXHRcdFx0LmFkZENsYXNzKCdtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygnaHlwZXIuJykpXHJcblx0XHRcdC5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0XHRcdEVuZ2luZS5vcHRpb25zLmRvdWJsZVRpbWUgPSAhRW5naW5lLm9wdGlvbnMuZG91YmxlVGltZTtcclxuXHRcdFx0XHRpZihFbmdpbmUub3B0aW9ucy5kb3VibGVUaW1lKVxyXG5cdFx0XHRcdFx0JCh0aGlzKS50ZXh0KF8oJ2NsYXNzaWMuJykpO1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdCQodGhpcykudGV4dChfKCdoeXBlci4nKSk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHQudGV4dChfKCdyZXN0YXJ0LicpKVxyXG5cdFx0XHQuY2xpY2soRW5naW5lLmNvbmZpcm1EZWxldGUpXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHRcdFxyXG5cdFx0JCgnPHNwYW4+JylcclxuXHRcdFx0LmFkZENsYXNzKCdtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygnc2hhcmUuJykpXHJcblx0XHRcdC5jbGljayhFbmdpbmUuc2hhcmUpXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHQudGV4dChfKCdzYXZlLicpKVxyXG5cdFx0XHQuY2xpY2soRW5naW5lLmV4cG9ydEltcG9ydClcclxuXHRcdFx0LmFwcGVuZFRvKG1lbnUpO1xyXG5cdFxyXG5cdFx0Ly8gc3Vic2NyaWJlIHRvIHN0YXRlVXBkYXRlc1xyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5zdWJzY3JpYmUoRW5naW5lLmhhbmRsZVN0YXRlVXBkYXRlcyk7XHJcblxyXG5cdFx0JFNNLmluaXQoKTtcclxuXHRcdE5vdGlmaWNhdGlvbnMuaW5pdCgpO1xyXG5cdFx0RXZlbnRzLmluaXQoKTtcclxuXHRcdFZpbGxhZ2UuaW5pdCgpO1xyXG5cdFx0Q2hhcmFjdGVyLmluaXQoKTtcclxuXHRcdFdlYXRoZXIuaW5pdCgpO1xyXG5cdFx0aWYoJFNNLmdldCgnUm9hZC5vcGVuJykpIHtcclxuXHRcdFx0Um9hZC5pbml0KCk7XHJcblx0XHR9XHJcblx0XHRpZigkU00uZ2V0KCdPdXRwb3N0Lm9wZW4nKSkge1xyXG5cdFx0XHRPdXRwb3N0LmluaXQoKTtcclxuXHRcdH1cclxuXHJcblx0XHRFbmdpbmUuc2F2ZUxhbmd1YWdlKCk7XHJcblx0XHRFbmdpbmUudHJhdmVsVG8oVmlsbGFnZSk7XHJcblxyXG5cdH0sXHJcblx0XHJcblx0YnJvd3NlclZhbGlkOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAoIGxvY2F0aW9uLnNlYXJjaC5pbmRleE9mKCAnaWdub3JlYnJvd3Nlcj10cnVlJyApID49IDAgfHwgKCB0eXBlb2YgU3RvcmFnZSAhPSAndW5kZWZpbmVkJyAmJiAhb2xkSUUgKSApO1xyXG5cdH0sXHJcblx0XHJcblx0aXNNb2JpbGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuICggbG9jYXRpb24uc2VhcmNoLmluZGV4T2YoICdpZ25vcmVicm93c2VyPXRydWUnICkgPCAwICYmIC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeS9pLnRlc3QoIG5hdmlnYXRvci51c2VyQWdlbnQgKSApO1xyXG5cdH0sXHJcblx0XHJcblx0c2F2ZUdhbWU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYodHlwZW9mIFN0b3JhZ2UgIT0gJ3VuZGVmaW5lZCcgJiYgbG9jYWxTdG9yYWdlKSB7XHJcblx0XHRcdGlmKEVuZ2luZS5fc2F2ZVRpbWVyICE9IG51bGwpIHtcclxuXHRcdFx0XHRjbGVhclRpbWVvdXQoRW5naW5lLl9zYXZlVGltZXIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHR5cGVvZiBFbmdpbmUuX2xhc3ROb3RpZnkgPT0gJ3VuZGVmaW5lZCcgfHwgRGF0ZS5ub3coKSAtIEVuZ2luZS5fbGFzdE5vdGlmeSA+IEVuZ2luZS5TQVZFX0RJU1BMQVkpe1xyXG5cdFx0XHRcdCQoJyNzYXZlTm90aWZ5JykuY3NzKCdvcGFjaXR5JywgMSkuYW5pbWF0ZSh7b3BhY2l0eTogMH0sIDEwMDAsICdsaW5lYXInKTtcclxuXHRcdFx0XHRFbmdpbmUuX2xhc3ROb3RpZnkgPSBEYXRlLm5vdygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxvY2FsU3RvcmFnZS5nYW1lU3RhdGUgPSBKU09OLnN0cmluZ2lmeShTdGF0ZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRsb2FkR2FtZTogZnVuY3Rpb24oKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR2YXIgc2F2ZWRTdGF0ZSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdhbWVTdGF0ZSk7XHJcblx0XHRcdGlmKHNhdmVkU3RhdGUpIHtcclxuXHRcdFx0XHR3aW5kb3cuU3RhdGUgPSBzYXZlZFN0YXRlO1xyXG5cdFx0XHRcdEVuZ2luZS5sb2coXCJsb2FkZWQgc2F2ZSFcIik7XHJcblx0XHRcdH1cclxuXHRcdH0gY2F0Y2goZSkge1xyXG5cdFx0XHRFbmdpbmUubG9nKGUpO1xyXG5cdFx0XHR3aW5kb3cuU3RhdGUgPSB7fTtcclxuXHRcdFx0JFNNLnNldCgndmVyc2lvbicsIEVuZ2luZS5WRVJTSU9OKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGV4cG9ydEltcG9ydDogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdFeHBvcnQgLyBJbXBvcnQnKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnZXhwb3J0IG9yIGltcG9ydCBzYXZlIGRhdGEsIGZvciBiYWNraW5nIHVwJyksXHJcblx0XHRcdFx0XHRcdF8oJ29yIG1pZ3JhdGluZyBjb21wdXRlcnMnKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2V4cG9ydCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdleHBvcnQnKSxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogRW5naW5lLmV4cG9ydDY0XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdpbXBvcnQnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnaW1wb3J0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2NvbmZpcm0nfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnY2FuY2VsJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2NhbmNlbCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J2NvbmZpcm0nOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ2FyZSB5b3Ugc3VyZT8nKSxcclxuXHRcdFx0XHRcdFx0XygnaWYgdGhlIGNvZGUgaXMgaW52YWxpZCwgYWxsIGRhdGEgd2lsbCBiZSBsb3N0LicpLFxyXG5cdFx0XHRcdFx0XHRfKCd0aGlzIGlzIGlycmV2ZXJzaWJsZS4nKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J3llcyc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCd5ZXMnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnaW5wdXRJbXBvcnQnfSxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogRW5naW5lLmVuYWJsZVNlbGVjdGlvblxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnbm8nOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnbm8nKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdpbnB1dEltcG9ydCc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtfKCdwdXQgdGhlIHNhdmUgY29kZSBoZXJlLicpXSxcclxuXHRcdFx0XHRcdHRleHRhcmVhOiAnJyxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J29rYXknOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnaW1wb3J0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogRW5naW5lLmltcG9ydDY0XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdjYW5jZWwnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnY2FuY2VsJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRnZW5lcmF0ZUV4cG9ydDY0OiBmdW5jdGlvbigpe1xyXG5cdFx0dmFyIHN0cmluZzY0ID0gQmFzZTY0LmVuY29kZShsb2NhbFN0b3JhZ2UuZ2FtZVN0YXRlKTtcclxuXHRcdHN0cmluZzY0ID0gc3RyaW5nNjQucmVwbGFjZSgvXFxzL2csICcnKTtcclxuXHRcdHN0cmluZzY0ID0gc3RyaW5nNjQucmVwbGFjZSgvXFwuL2csICcnKTtcclxuXHRcdHN0cmluZzY0ID0gc3RyaW5nNjQucmVwbGFjZSgvXFxuL2csICcnKTtcclxuXHJcblx0XHRyZXR1cm4gc3RyaW5nNjQ7XHJcblx0fSxcclxuXHJcblx0ZXhwb3J0NjQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RW5naW5lLnNhdmVHYW1lKCk7XHJcblx0XHR2YXIgc3RyaW5nNjQgPSBFbmdpbmUuZ2VuZXJhdGVFeHBvcnQ2NCgpO1xyXG5cdFx0RW5naW5lLmVuYWJsZVNlbGVjdGlvbigpO1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnRXhwb3J0JyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXygnc2F2ZSB0aGlzLicpXSxcclxuXHRcdFx0XHRcdHRleHRhcmVhOiBzdHJpbmc2NCxcclxuXHRcdFx0XHRcdHJlYWRvbmx5OiB0cnVlLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnZG9uZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdnb3QgaXQnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBFbmdpbmUuZGlzYWJsZVNlbGVjdGlvblxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdEVuZ2luZS5hdXRvU2VsZWN0KCcjZGVzY3JpcHRpb24gdGV4dGFyZWEnKTtcclxuXHR9LFxyXG5cclxuXHRpbXBvcnQ2NDogZnVuY3Rpb24oc3RyaW5nNjQpIHtcclxuXHRcdEVuZ2luZS5kaXNhYmxlU2VsZWN0aW9uKCk7XHJcblx0XHRzdHJpbmc2NCA9IHN0cmluZzY0LnJlcGxhY2UoL1xccy9nLCAnJyk7XHJcblx0XHRzdHJpbmc2NCA9IHN0cmluZzY0LnJlcGxhY2UoL1xcLi9nLCAnJyk7XHJcblx0XHRzdHJpbmc2NCA9IHN0cmluZzY0LnJlcGxhY2UoL1xcbi9nLCAnJyk7XHJcblx0XHR2YXIgZGVjb2RlZFNhdmUgPSBCYXNlNjQuZGVjb2RlKHN0cmluZzY0KTtcclxuXHRcdGxvY2FsU3RvcmFnZS5nYW1lU3RhdGUgPSBkZWNvZGVkU2F2ZTtcclxuXHRcdGxvY2F0aW9uLnJlbG9hZCgpO1xyXG5cdH0sXHJcblxyXG5cdGNvbmZpcm1EZWxldGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnUmVzdGFydD8nKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtfKCdyZXN0YXJ0IHRoZSBnYW1lPycpXSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J3llcyc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCd5ZXMnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBFbmdpbmUuZGVsZXRlU2F2ZVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnbm8nOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnbm8nKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGRlbGV0ZVNhdmU6IGZ1bmN0aW9uKG5vUmVsb2FkKSB7XHJcblx0XHRpZih0eXBlb2YgU3RvcmFnZSAhPSAndW5kZWZpbmVkJyAmJiBsb2NhbFN0b3JhZ2UpIHtcclxuXHRcdFx0d2luZG93LlN0YXRlID0ge307XHJcblx0XHRcdGxvY2FsU3RvcmFnZS5jbGVhcigpO1xyXG5cdFx0fVxyXG5cdFx0aWYoIW5vUmVsb2FkKSB7XHJcblx0XHRcdGxvY2F0aW9uLnJlbG9hZCgpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHNoYXJlOiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ1NoYXJlJyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXygnYnJpbmcgeW91ciBmcmllbmRzLicpXSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2ZhY2Vib29rJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2ZhY2Vib29rJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR3aW5kb3cub3BlbignaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL3NoYXJlci9zaGFyZXIucGhwP3U9JyArIEVuZ2luZS5TSVRFX1VSTCwgJ3NoYXJlcicsICd3aWR0aD02MjYsaGVpZ2h0PTQzNixsb2NhdGlvbj1ubyxtZW51YmFyPW5vLHJlc2l6YWJsZT1ubyxzY3JvbGxiYXJzPW5vLHN0YXR1cz1ubyx0b29sYmFyPW5vJyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnZ29vZ2xlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6XygnZ29vZ2xlKycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0d2luZG93Lm9wZW4oJ2h0dHBzOi8vcGx1cy5nb29nbGUuY29tL3NoYXJlP3VybD0nICsgRW5naW5lLlNJVEVfVVJMLCAnc2hhcmVyJywgJ3dpZHRoPTQ4MCxoZWlnaHQ9NDM2LGxvY2F0aW9uPW5vLG1lbnViYXI9bm8scmVzaXphYmxlPW5vLHNjcm9sbGJhcnM9bm8sc3RhdHVzPW5vLHRvb2xiYXI9bm8nKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCd0d2l0dGVyJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ3R3aXR0ZXInKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5vcGVuKCdodHRwczovL3R3aXR0ZXIuY29tL2ludGVudC90d2VldD90ZXh0PUElMjBEYXJrJTIwUm9vbSZ1cmw9JyArIEVuZ2luZS5TSVRFX1VSTCwgJ3NoYXJlcicsICd3aWR0aD02NjAsaGVpZ2h0PTI2MCxsb2NhdGlvbj1ubyxtZW51YmFyPW5vLHJlc2l6YWJsZT1ubyxzY3JvbGxiYXJzPXllcyxzdGF0dXM9bm8sdG9vbGJhcj1ubycpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J3JlZGRpdCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdyZWRkaXQnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5vcGVuKCdodHRwOi8vd3d3LnJlZGRpdC5jb20vc3VibWl0P3VybD0nICsgRW5naW5lLlNJVEVfVVJMLCAnc2hhcmVyJywgJ3dpZHRoPTk2MCxoZWlnaHQ9NzAwLGxvY2F0aW9uPW5vLG1lbnViYXI9bm8scmVzaXphYmxlPW5vLHNjcm9sbGJhcnM9eWVzLHN0YXR1cz1ubyx0b29sYmFyPW5vJyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnY2xvc2UnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnY2xvc2UnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdHdpZHRoOiAnNDAwcHgnXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRmaW5kU3R5bGVzaGVldDogZnVuY3Rpb24odGl0bGUpIHtcclxuXHRcdGZvcih2YXIgaT0wOyBpPGRvY3VtZW50LnN0eWxlU2hlZXRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBzaGVldCA9IGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldO1xyXG5cdFx0XHRpZihzaGVldC50aXRsZSA9PSB0aXRsZSkge1xyXG5cdFx0XHRcdHJldHVybiBzaGVldDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fSxcclxuXHJcblx0aXNMaWdodHNPZmY6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGRhcmtDc3MgPSBFbmdpbmUuZmluZFN0eWxlc2hlZXQoJ2RhcmtlbkxpZ2h0cycpO1xyXG5cdFx0aWYgKCBkYXJrQ3NzICE9IG51bGwgJiYgIWRhcmtDc3MuZGlzYWJsZWQgKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0sXHJcblxyXG5cdHR1cm5MaWdodHNPZmY6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGRhcmtDc3MgPSBFbmdpbmUuZmluZFN0eWxlc2hlZXQoJ2RhcmtlbkxpZ2h0cycpO1xyXG5cdFx0aWYgKGRhcmtDc3MgPT0gbnVsbCkge1xyXG5cdFx0XHQkKCdoZWFkJykuYXBwZW5kKCc8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cImNzcy9kYXJrLmNzc1wiIHR5cGU9XCJ0ZXh0L2Nzc1wiIHRpdGxlPVwiZGFya2VuTGlnaHRzXCIgLz4nKTtcclxuXHRcdFx0JCgnLmxpZ2h0c09mZicpLnRleHQoXygnbGlnaHRzIG9uLicpKTtcclxuXHRcdH0gZWxzZSBpZiAoZGFya0Nzcy5kaXNhYmxlZCkge1xyXG5cdFx0XHRkYXJrQ3NzLmRpc2FibGVkID0gZmFsc2U7XHJcblx0XHRcdCQoJy5saWdodHNPZmYnKS50ZXh0KF8oJ2xpZ2h0cyBvbi4nKSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKFwiI2RhcmtlbkxpZ2h0c1wiKS5hdHRyKFwiZGlzYWJsZWRcIiwgXCJkaXNhYmxlZFwiKTtcclxuXHRcdFx0ZGFya0Nzcy5kaXNhYmxlZCA9IHRydWU7XHJcblx0XHRcdCQoJy5saWdodHNPZmYnKS50ZXh0KF8oJ2xpZ2h0cyBvZmYuJykpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8vIEdldHMgYSBndWlkXHJcblx0Z2V0R3VpZDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbihjKSB7XHJcblx0XHRcdHZhciByID0gTWF0aC5yYW5kb20oKSoxNnwwLCB2ID0gYyA9PSAneCcgPyByIDogKHImMHgzfDB4OCk7XHJcblx0XHRcdHJldHVybiB2LnRvU3RyaW5nKDE2KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGFjdGl2ZU1vZHVsZTogbnVsbCxcclxuXHJcblx0dHJhdmVsVG86IGZ1bmN0aW9uKG1vZHVsZSkge1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZSAhPSBtb2R1bGUpIHtcclxuXHRcdFx0dmFyIGN1cnJlbnRJbmRleCA9IEVuZ2luZS5hY3RpdmVNb2R1bGUgPyAkKCcubG9jYXRpb24nKS5pbmRleChFbmdpbmUuYWN0aXZlTW9kdWxlLnBhbmVsKSA6IDE7XHJcblx0XHRcdCQoJ2Rpdi5oZWFkZXJCdXR0b24nKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcclxuXHRcdFx0bW9kdWxlLnRhYi5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcclxuXHJcblx0XHRcdHZhciBzbGlkZXIgPSAkKCcjbG9jYXRpb25TbGlkZXInKTtcclxuXHRcdFx0dmFyIHN0b3JlcyA9ICQoJyNzdG9yZXNDb250YWluZXInKTtcclxuXHRcdFx0dmFyIHBhbmVsSW5kZXggPSAkKCcubG9jYXRpb24nKS5pbmRleChtb2R1bGUucGFuZWwpO1xyXG5cdFx0XHR2YXIgZGlmZiA9IE1hdGguYWJzKHBhbmVsSW5kZXggLSBjdXJyZW50SW5kZXgpO1xyXG5cdFx0XHRzbGlkZXIuYW5pbWF0ZSh7bGVmdDogLShwYW5lbEluZGV4ICogNzAwKSArICdweCd9LCAzMDAgKiBkaWZmKTtcclxuXHJcblx0XHRcdGlmKCRTTS5nZXQoJ3N0b3Jlcy53b29kJykgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHQvLyBGSVhNRSBXaHkgZG9lcyB0aGlzIHdvcmsgaWYgdGhlcmUncyBhbiBhbmltYXRpb24gcXVldWUuLi4/XHJcblx0XHRcdFx0c3RvcmVzLmFuaW1hdGUoe3JpZ2h0OiAtKHBhbmVsSW5kZXggKiA3MDApICsgJ3B4J30sIDMwMCAqIGRpZmYpO1xyXG5cdFx0XHR9XHJcblx0XHRcclxuXHRcdFx0RW5naW5lLmFjdGl2ZU1vZHVsZSA9IG1vZHVsZTtcclxuXHJcblx0XHRcdG1vZHVsZS5vbkFycml2YWwoZGlmZik7XHJcblxyXG5cdFx0XHRpZihFbmdpbmUuYWN0aXZlTW9kdWxlID09IFZpbGxhZ2VcclxuXHRcdFx0XHQvLyAgfHwgRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSBQYXRoXHJcblx0XHRcdFx0KSB7XHJcblx0XHRcdFx0Ly8gRG9uJ3QgZmFkZSBvdXQgdGhlIHdlYXBvbnMgaWYgd2UncmUgc3dpdGNoaW5nIHRvIGEgbW9kdWxlXHJcblx0XHRcdFx0Ly8gd2hlcmUgd2UncmUgZ29pbmcgdG8ga2VlcCBzaG93aW5nIHRoZW0gYW55d2F5LlxyXG5cdFx0XHRcdGlmIChtb2R1bGUgIT0gVmlsbGFnZSBcclxuXHRcdFx0XHRcdC8vICYmIG1vZHVsZSAhPSBQYXRoXHJcblx0XHRcdFx0KSB7XHJcblx0XHRcdFx0XHQkKCdkaXYjd2VhcG9ucycpLmFuaW1hdGUoe29wYWNpdHk6IDB9LCAzMDApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYobW9kdWxlID09IFZpbGxhZ2VcclxuXHRcdFx0XHQvLyAgfHwgbW9kdWxlID09IFBhdGhcclxuXHRcdFx0XHQpIHtcclxuXHRcdFx0XHQkKCdkaXYjd2VhcG9ucycpLmFuaW1hdGUoe29wYWNpdHk6IDF9LCAzMDApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHROb3RpZmljYXRpb25zLnByaW50UXVldWUobW9kdWxlKTtcclxuXHRcdFxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdGxvZzogZnVuY3Rpb24obXNnKSB7XHJcblx0XHRpZih0aGlzLl9sb2cpIHtcclxuXHRcdFx0Y29uc29sZS5sb2cobXNnKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHR1cGRhdGVTbGlkZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHNsaWRlciA9ICQoJyNsb2NhdGlvblNsaWRlcicpO1xyXG5cdFx0c2xpZGVyLndpZHRoKChzbGlkZXIuY2hpbGRyZW4oKS5sZW5ndGggKiA3MDApICsgJ3B4Jyk7XHJcblx0fSxcclxuXHJcblx0dXBkYXRlT3V0ZXJTbGlkZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHNsaWRlciA9ICQoJyNvdXRlclNsaWRlcicpO1xyXG5cdFx0c2xpZGVyLndpZHRoKChzbGlkZXIuY2hpbGRyZW4oKS5sZW5ndGggKiA3MDApICsgJ3B4Jyk7XHJcblx0fSxcclxuXHJcblx0ZGlzYWJsZVNlbGVjdGlvbjogZnVuY3Rpb24oKSB7XHJcblx0XHRkb2N1bWVudC5vbnNlbGVjdHN0YXJ0ID0gZXZlbnROdWxsaWZpZXI7IC8vIHRoaXMgaXMgZm9yIElFXHJcblx0XHRkb2N1bWVudC5vbm1vdXNlZG93biA9IGV2ZW50TnVsbGlmaWVyOyAvLyB0aGlzIGlzIGZvciB0aGUgcmVzdFxyXG5cdH0sXHJcblxyXG5cdGVuYWJsZVNlbGVjdGlvbjogZnVuY3Rpb24oKSB7XHJcblx0XHRkb2N1bWVudC5vbnNlbGVjdHN0YXJ0ID0gZXZlbnRQYXNzdGhyb3VnaDtcclxuXHRcdGRvY3VtZW50Lm9ubW91c2Vkb3duID0gZXZlbnRQYXNzdGhyb3VnaDtcclxuXHR9LFxyXG5cclxuXHRhdXRvU2VsZWN0OiBmdW5jdGlvbihzZWxlY3Rvcikge1xyXG5cdFx0JChzZWxlY3RvcikuZm9jdXMoKS5zZWxlY3QoKTtcclxuXHR9LFxyXG5cclxuXHRoYW5kbGVTdGF0ZVVwZGF0ZXM6IGZ1bmN0aW9uKGUpe1xyXG5cdFxyXG5cdH0sXHJcblxyXG5cdHN3aXRjaExhbmd1YWdlOiBmdW5jdGlvbihkb20pe1xyXG5cdFx0dmFyIGxhbmcgPSAkKGRvbSkuZGF0YShcImxhbmd1YWdlXCIpO1xyXG5cdFx0aWYoZG9jdW1lbnQubG9jYXRpb24uaHJlZi5zZWFyY2goL1tcXD9cXCZdbGFuZz1bYS16X10rLykgIT0gLTEpe1xyXG5cdFx0XHRkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gZG9jdW1lbnQubG9jYXRpb24uaHJlZi5yZXBsYWNlKCAvKFtcXD9cXCZdbGFuZz0pKFthLXpfXSspL2dpICwgXCIkMVwiK2xhbmcgKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gZG9jdW1lbnQubG9jYXRpb24uaHJlZiArICggKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYuc2VhcmNoKC9cXD8vKSAhPSAtMSApP1wiJlwiOlwiP1wiKSArIFwibGFuZz1cIitsYW5nO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHNhdmVMYW5ndWFnZTogZnVuY3Rpb24oKXtcclxuXHRcdHZhciBsYW5nID0gZGVjb2RlVVJJQ29tcG9uZW50KChuZXcgUmVnRXhwKCdbP3wmXWxhbmc9JyArICcoW14mO10rPykoJnwjfDt8JCknKS5leGVjKGxvY2F0aW9uLnNlYXJjaCl8fFssXCJcIl0pWzFdLnJlcGxhY2UoL1xcKy9nLCAnJTIwJykpfHxudWxsO1x0XHJcblx0XHRpZihsYW5nICYmIHR5cGVvZiBTdG9yYWdlICE9ICd1bmRlZmluZWQnICYmIGxvY2FsU3RvcmFnZSkge1xyXG5cdFx0XHRsb2NhbFN0b3JhZ2UubGFuZyA9IGxhbmc7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0c2V0VGltZW91dDogZnVuY3Rpb24oY2FsbGJhY2ssIHRpbWVvdXQsIHNraXBEb3VibGU/KXtcclxuXHJcblx0XHRpZiggRW5naW5lLm9wdGlvbnMuZG91YmxlVGltZSAmJiAhc2tpcERvdWJsZSApe1xyXG5cdFx0XHRFbmdpbmUubG9nKCdEb3VibGUgdGltZSwgY3V0dGluZyB0aW1lb3V0IGluIGhhbGYnKTtcclxuXHRcdFx0dGltZW91dCAvPSAyO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBzZXRUaW1lb3V0KGNhbGxiYWNrLCB0aW1lb3V0KTtcclxuXHJcblx0fVxyXG5cclxufTtcclxuXHJcbmZ1bmN0aW9uIGV2ZW50TnVsbGlmaWVyKGUpIHtcclxuXHRyZXR1cm4gJChlLnRhcmdldCkuaGFzQ2xhc3MoJ21lbnVCdG4nKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZXZlbnRQYXNzdGhyb3VnaChlKSB7XHJcblx0cmV0dXJuIHRydWU7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBpblZpZXcoZGlyLCBlbGVtKXtcclxuXHJcbiAgICAgICAgdmFyIHNjVG9wID0gJCgnI21haW4nKS5vZmZzZXQoKS50b3A7XHJcbiAgICAgICAgdmFyIHNjQm90ID0gc2NUb3AgKyAkKCcjbWFpbicpLmhlaWdodCgpO1xyXG5cclxuICAgICAgICB2YXIgZWxUb3AgPSBlbGVtLm9mZnNldCgpLnRvcDtcclxuICAgICAgICB2YXIgZWxCb3QgPSBlbFRvcCArIGVsZW0uaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIGlmKCBkaXIgPT0gJ3VwJyApe1xyXG4gICAgICAgICAgICAgICAgLy8gU1RPUCBNT1ZJTkcgSUYgQk9UVE9NIE9GIEVMRU1FTlQgSVMgVklTSUJMRSBJTiBTQ1JFRU5cclxuICAgICAgICAgICAgICAgIHJldHVybiAoIGVsQm90IDwgc2NCb3QgKTtcclxuICAgICAgICB9ZWxzZSBpZiggZGlyID09ICdkb3duJyApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICggZWxUb3AgPiBzY1RvcCApO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICggKCBlbEJvdCA8PSBzY0JvdCApICYmICggZWxUb3AgPj0gc2NUb3AgKSApO1xyXG4gICAgICAgIH1cclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNjcm9sbEJ5WChlbGVtLCB4KXtcclxuXHJcbiAgICAgICAgdmFyIGVsVG9wID0gcGFyc2VJbnQoIGVsZW0uY3NzKCd0b3AnKSwgMTAgKTtcclxuICAgICAgICBlbGVtLmNzcyggJ3RvcCcsICggZWxUb3AgKyB4ICkgKyBcInB4XCIgKTtcclxuXHJcbn1cclxuXHJcblxyXG4vL2NyZWF0ZSBqUXVlcnkgQ2FsbGJhY2tzKCkgdG8gaGFuZGxlIG9iamVjdCBldmVudHMgXHJcbiQuRGlzcGF0Y2ggPSBmdW5jdGlvbiggaWQgKSB7XHJcblx0dmFyIGNhbGxiYWNrcywgdG9waWMgPSBpZCAmJiBFbmdpbmUudG9waWNzWyBpZCBdO1xyXG5cdGlmICggIXRvcGljICkge1xyXG5cdFx0Y2FsbGJhY2tzID0galF1ZXJ5LkNhbGxiYWNrcygpO1xyXG5cdFx0dG9waWMgPSB7XHJcblx0XHRcdFx0cHVibGlzaDogY2FsbGJhY2tzLmZpcmUsXHJcblx0XHRcdFx0c3Vic2NyaWJlOiBjYWxsYmFja3MuYWRkLFxyXG5cdFx0XHRcdHVuc3Vic2NyaWJlOiBjYWxsYmFja3MucmVtb3ZlXHJcblx0XHR9O1xyXG5cdFx0aWYgKCBpZCApIHtcclxuXHRcdFx0RW5naW5lLnRvcGljc1sgaWQgXSA9IHRvcGljO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gdG9waWM7XHJcbn07XHJcblxyXG4kKGZ1bmN0aW9uKCkge1xyXG5cdEVuZ2luZS5pbml0KCk7XHJcbn0pO1xyXG5cclxuIiwiLyoqXHJcbiAqIE1vZHVsZSB0aGF0IGhhbmRsZXMgdGhlIHJhbmRvbSBldmVudCBzeXN0ZW1cclxuICovXHJcbmltcG9ydCB7IEV2ZW50c1JvYWRXYW5kZXIgfSBmcm9tIFwiLi9ldmVudHMvcm9hZHdhbmRlclwiO1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi9lbmdpbmVcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgTm90aWZpY2F0aW9ucyB9IGZyb20gXCIuL25vdGlmaWNhdGlvbnNcIjtcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4vQnV0dG9uXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEFEUkV2ZW50IHtcclxuXHR0aXRsZTogc3RyaW5nLFxyXG5cdGlzQXZhaWxhYmxlPzogRnVuY3Rpb24sXHJcblx0aXNTdXBlckxpa2VseT86IEZ1bmN0aW9uLFxyXG5cdHNjZW5lczoge1xyXG5cdFx0Ly8gdHlwZSB0aGlzIG91dCBiZXR0ZXIgdXNpbmcgSW5kZXggU2lnbmF0dXJlc1xyXG5cdFx0W2lkOiBzdHJpbmddOiBTY2VuZVxyXG5cdH0sXHJcblx0ZXZlbnRQYW5lbD86IGFueVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNjZW5lIHtcclxuXHRzZWVuRmxhZz86IEZ1bmN0aW9uLFxyXG5cdG5leHRTY2VuZT86IHN0cmluZyxcclxuXHRvbkxvYWQ/OiBGdW5jdGlvbixcclxuXHR0ZXh0OiBBcnJheTxzdHJpbmc+IHwgRnVuY3Rpb24sXHJcblx0cmV3YXJkPzogYW55LFxyXG5cdG5vdGlmaWNhdGlvbj86IHN0cmluZyxcclxuXHRibGluaz86IGJvb2xlYW4sXHJcblx0ZGljZT86IHtcclxuXHRcdGFtb3VudDogbnVtYmVyLFxyXG5cdFx0ZGllRmFjZXM/OiB7IFtpZDogbnVtYmVyXTogc3RyaW5nIH1cclxuXHRcdC8vIGRvIGdhbWUgZW5naW5lIHN0dWZmLCB0aGVuIHJldHVybiB0ZXh0IGRlc2NyaXB0aW9uXHJcblx0XHRoYW5kbGVyOiAodmFscykgPT4gQXJyYXk8c3RyaW5nPlxyXG5cdH0sXHJcblx0YnV0dG9uczoge1xyXG5cdFx0W2lkOiBzdHJpbmddOiBFdmVudEJ1dHRvblxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBFdmVudEJ1dHRvbiB7XHJcblx0dGV4dDogc3RyaW5nIHwgRnVuY3Rpb24sXHJcblx0bmV4dFNjZW5lOiB7XHJcblx0XHRbaWQ6IG51bWJlcl06IHN0cmluZ1xyXG5cdH0sXHJcblx0YXZhaWxhYmxlPzogRnVuY3Rpb24sXHJcblx0dmlzaWJsZT86IEZ1bmN0aW9uLFxyXG5cdHJld2FyZD86IGFueSxcclxuXHRjb3N0PzogYW55LFxyXG5cdG5vdGlmaWNhdGlvbj86IHN0cmluZyxcclxuXHRvbkNob29zZT86IEZ1bmN0aW9uXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBFdmVudHMgPSB7XHJcblx0XHRcclxuXHRfRVZFTlRfVElNRV9SQU5HRTogWzMsIDZdLCAvLyByYW5nZSwgaW4gbWludXRlc1xyXG5cdF9QQU5FTF9GQURFOiAyMDAsXHJcblx0QkxJTktfSU5URVJWQUw6IGZhbHNlLFxyXG5cclxuXHRFdmVudFBvb2w6IDxhbnk+W10sXHJcblx0ZXZlbnRTdGFjazogPGFueT5bXSxcclxuXHRfZXZlbnRUaW1lb3V0OiAwLFxyXG5cclxuXHRMb2NhdGlvbnM6IHt9LFxyXG5cclxuXHRpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHRcdFxyXG5cdFx0Ly8gQnVpbGQgdGhlIEV2ZW50IFBvb2xcclxuXHRcdEV2ZW50cy5FdmVudFBvb2wgPSBbXS5jb25jYXQoXHJcblx0XHRcdEV2ZW50c1JvYWRXYW5kZXIgYXMgYW55XHJcblx0XHQpO1xyXG5cclxuXHRcdHRoaXMuTG9jYXRpb25zW1wiUm9hZFdhbmRlclwiXSA9IEV2ZW50c1JvYWRXYW5kZXI7XHJcblx0XHRcclxuXHRcdEV2ZW50cy5ldmVudFN0YWNrID0gW107XHJcblx0XHRcclxuXHRcdC8vc3Vic2NyaWJlIHRvIHN0YXRlVXBkYXRlc1xyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5zdWJzY3JpYmUoRXZlbnRzLmhhbmRsZVN0YXRlVXBkYXRlcyk7XHJcblx0fSxcclxuXHRcclxuXHRvcHRpb25zOiB7fSwgLy8gTm90aGluZyBmb3Igbm93XHJcbiAgICBcclxuXHRhY3RpdmVTY2VuZTogJycsXHJcbiAgICBcclxuXHRsb2FkU2NlbmU6IGZ1bmN0aW9uKG5hbWUpIHtcclxuXHRcdEVuZ2luZS5sb2coJ2xvYWRpbmcgc2NlbmU6ICcgKyBuYW1lKTtcclxuXHRcdEV2ZW50cy5hY3RpdmVTY2VuZSA9IG5hbWU7XHJcblx0XHR2YXIgc2NlbmUgPSBFdmVudHMuYWN0aXZlRXZlbnQoKT8uc2NlbmVzW25hbWVdO1xyXG5cdFx0XHJcblx0XHQvLyBoYW5kbGVzIG9uZS10aW1lIHNjZW5lcywgc3VjaCBhcyBpbnRyb2R1Y3Rpb25zXHJcblx0XHQvLyBtYXliZSBJIGNhbiBtYWtlIGEgbW9yZSBleHBsaWNpdCBcImludHJvZHVjdGlvblwiIGxvZ2ljYWwgZmxvdyB0byBtYWtlIHRoaXNcclxuXHRcdC8vIGEgbGl0dGxlIG1vcmUgZWxlZ2FudCwgZ2l2ZW4gdGhhdCB0aGVyZSB3aWxsIGFsd2F5cyBiZSBhbiBcImludHJvZHVjdGlvblwiIHNjZW5lXHJcblx0XHQvLyB0aGF0J3Mgb25seSBtZWFudCB0byBiZSBydW4gYSBzaW5nbGUgdGltZS5cclxuXHRcdGlmIChzY2VuZS5zZWVuRmxhZyAmJiBzY2VuZS5zZWVuRmxhZygpKSB7XHJcblx0XHRcdEV2ZW50cy5sb2FkU2NlbmUoc2NlbmUubmV4dFNjZW5lKVxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU2NlbmUgcmV3YXJkXHJcblx0XHRpZihzY2VuZS5yZXdhcmQpIHtcclxuXHRcdFx0JFNNLmFkZE0oJ3N0b3JlcycsIHNjZW5lLnJld2FyZCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIG9uTG9hZFxyXG5cdFx0aWYoc2NlbmUub25Mb2FkKSB7XHJcblx0XHRcdHNjZW5lLm9uTG9hZCgpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBOb3RpZnkgdGhlIHNjZW5lIGNoYW5nZVxyXG5cdFx0aWYoc2NlbmUubm90aWZpY2F0aW9uKSB7XHJcblx0XHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIHNjZW5lLm5vdGlmaWNhdGlvbik7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdCQoJyNkZXNjcmlwdGlvbicsIEV2ZW50cy5ldmVudFBhbmVsKCkpLmVtcHR5KCk7XHJcblx0XHQkKCcjYnV0dG9ucycsIEV2ZW50cy5ldmVudFBhbmVsKCkpLmVtcHR5KCk7XHJcblx0XHRFdmVudHMuc3RhcnRTdG9yeShzY2VuZSk7XHJcblx0fSxcclxuXHRcclxuXHRkcmF3RmxvYXRUZXh0OiBmdW5jdGlvbih0ZXh0LCBwYXJlbnQpIHtcclxuXHRcdCQoJzxkaXY+JykudGV4dCh0ZXh0KS5hZGRDbGFzcygnZGFtYWdlVGV4dCcpLmFwcGVuZFRvKHBhcmVudCkuYW5pbWF0ZSh7XHJcblx0XHRcdCdib3R0b20nOiAnNTBweCcsXHJcblx0XHRcdCdvcGFjaXR5JzogJzAnXHJcblx0XHR9LFxyXG5cdFx0MzAwLFxyXG5cdFx0J2xpbmVhcicsXHJcblx0XHRmdW5jdGlvbigpIHtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmUoKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdC8vIGZvciBkaWNlIHN0dWZmXHJcblx0Z2V0UmFuZG9tSW50OmZ1bmN0aW9uIChtYXgpIHtcclxuICBcdFx0cmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1heCk7XHJcblx0fSxcclxuXHRcclxuXHRzdGFydFN0b3J5OiBmdW5jdGlvbihzY2VuZSkge1xyXG5cdFx0Ly8gV3JpdGUgdGhlIHRleHRcclxuXHRcdHZhciBkZXNjID0gJCgnI2Rlc2NyaXB0aW9uJywgRXZlbnRzLmV2ZW50UGFuZWwoKSk7XHJcblx0XHR2YXIgdGV4dEJsb2NrID0gW107XHJcblx0XHRpZiAodHlwZW9mKHNjZW5lLnRleHQpID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0dGV4dEJsb2NrID0gc2NlbmUudGV4dCgpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGV4dEJsb2NrID0gc2NlbmUudGV4dDtcclxuXHRcdH1cclxuXHRcdGZvcih2YXIgaSBpbiB0ZXh0QmxvY2spIHtcclxuXHRcdFx0JCgnPGRpdj4nKS50ZXh0KHRleHRCbG9ja1tpXSkuYXBwZW5kVG8oZGVzYyk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdGhpcyBkaWNlIHN0dWZmIGNvdWxkIG1heWJlIGJlIGV4dHJhY3RlZCB0byBpdHMgb3duIGZ1bmN0aW9uLFxyXG5cdFx0Ly8gYnV0IGFsc28gd2UgbWlnaHQganVzdCBtYWtlIGl0IHdheSBtb3JlIGdlbmVyaWMgc28geW91IGNhblxyXG5cdFx0Ly8gdGhyb3cgQU5ZVEhJTkcgaW4gdGhlIEV2ZW50IGRlc2NyaXB0aW9uIGR5bmFtaWNhbGx5XHJcblx0XHRjb25zdCBkaWNlVmFscyA9IFtdO1xyXG5cdFx0aWYgKHNjZW5lLmRpY2UgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgc2NlbmUuZGljZS5hbW91bnQ7IGorKykge1xyXG5cdFx0XHRcdHZhciBkaWVWYWwgPSB0aGlzLmdldFJhbmRvbUludCg2KSArIDE7XHJcblx0XHRcdFx0ZGljZVZhbHMucHVzaChkaWVWYWwpO1xyXG5cdFx0XHRcdGlmIChzY2VuZS5kaWNlLmRpZUZhY2VzICYmIHNjZW5lLmRpY2UuZGllRmFjZXNbZGllVmFsXSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHRkaWVWYWwgPSBzY2VuZS5kaWNlLmRpZUZhY2VzW2RpZVZhbF07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNvbnN0IHRpbHRWYWwgPSB0aGlzLmdldFJhbmRvbUludCg5MCkgLSA0NTtcclxuXHRcdFx0XHRjb25zdCBtYXJnaW5WYWwgPSAodGhpcy5nZXRSYW5kb21JbnQoNCkgKyAyKSAqIDU7XHJcblx0XHRcdFx0ZGVzYy5hcHBlbmQoXHJcblx0XHRcdFx0XHQkKCc8aW1nPicse2lkOidkaWUnICsgZGllVmFsLnRvU3RyaW5nKCkgLHNyYzonYXNzZXRzL2RpZS9kaWUnICsgZGllVmFsLnRvU3RyaW5nKCkgKyAnLnBuZyd9KVxyXG5cdFx0XHRcdFx0LmNzcygnd2lkdGgnLCAnNSUnKVxyXG5cdFx0XHRcdFx0LmNzcygnaGVpZ2h0JywgJ2F1dG8nKVxyXG5cdFx0XHRcdFx0LmNzcyh7XHJcblx0XHRcdFx0XHRcdFwiLXdlYmtpdC10cmFuc2Zvcm1cIjogXCJyb3RhdGUoXCIgKyB0aWx0VmFsLnRvU3RyaW5nKCkgKyBcImRlZylcIixcclxuXHRcdFx0XHRcdFx0XCItbW96LXRyYW5zZm9ybVwiOiBcInJvdGF0ZShcIiArIHRpbHRWYWwudG9TdHJpbmcoKSArIFwiZGVnKVwiLFxyXG5cdFx0XHRcdFx0XHRcInRyYW5zZm9ybVwiOiBcInJvdGF0ZShcIiArIHRpbHRWYWwudG9TdHJpbmcoKSArIFwiZGVnKVwiXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdC5jc3MoJ21hcmdpbi1yaWdodCcsIG1hcmdpblZhbC50b1N0cmluZygpICsgJ3B4JylcclxuXHRcdFx0XHRcdC5jc3MoJ21hcmdpbi1ib3R0b20nLCAnMjBweCcpXHJcblx0XHRcdFx0KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3QgdGV4dFZhbHM6IEFycmF5PHN0cmluZz4gPSBzY2VuZS5kaWNlLmhhbmRsZXIoZGljZVZhbHMpO1xyXG5cdFx0XHRmb3IgKGNvbnN0IHRleHQgaW4gdGV4dFZhbHMpIHtcclxuXHRcdFx0XHQkKCc8ZGl2PicpLnRleHQodGV4dFZhbHNbdGV4dF0pLmFwcGVuZFRvKGRlc2MpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmKHNjZW5lLnRleHRhcmVhICE9IG51bGwpIHtcclxuXHRcdFx0dmFyIHRhID0gJCgnPHRleHRhcmVhPicpLnZhbChzY2VuZS50ZXh0YXJlYSkuYXBwZW5kVG8oZGVzYyk7XHJcblx0XHRcdGlmKHNjZW5lLnJlYWRvbmx5KSB7XHJcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdHRhLmF0dHIoJ3JlYWRvbmx5JywgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gRHJhdyB0aGUgYnV0dG9uc1xyXG5cdFx0RXZlbnRzLmRyYXdCdXR0b25zKHNjZW5lKTtcclxuXHR9LFxyXG5cdFxyXG5cdGRyYXdCdXR0b25zOiBmdW5jdGlvbihzY2VuZSkge1xyXG5cdFx0dmFyIGJ0bnMgPSAkKCcjYnV0dG9ucycsIEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0Zm9yKHZhciBpZCBpbiBzY2VuZS5idXR0b25zKSB7XHJcblx0XHRcdHZhciBpbmZvID0gc2NlbmUuYnV0dG9uc1tpZF07XHJcblx0XHRcdHZhciB0ZXh0ID0gJyc7XHJcblx0XHRcdGlmICh0eXBlb2YoaW5mby50ZXh0KSA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdFx0dGV4dCA9IGluZm8udGV4dCgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRleHQgPSBpbmZvLnRleHQ7XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIGIgPSBCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0XHRpZDogaWQsXHJcblx0XHRcdFx0dGV4dDogdGV4dCxcclxuXHRcdFx0XHRjb3N0OiBpbmZvLmNvc3QsXHJcblx0XHRcdFx0Y2xpY2s6IEV2ZW50cy5idXR0b25DbGljayxcclxuXHRcdFx0XHRjb29sZG93bjogaW5mby5jb29sZG93bixcclxuXHRcdFx0XHRpbWFnZTogaW5mby5pbWFnZVxyXG5cdFx0XHR9KS5hcHBlbmRUbyhidG5zKTtcclxuXHRcdFx0aWYodHlwZW9mIGluZm8uYXZhaWxhYmxlID09ICdmdW5jdGlvbicgJiYgIWluZm8uYXZhaWxhYmxlKCkpIHtcclxuXHRcdFx0XHRCdXR0b24uc2V0RGlzYWJsZWQoYiwgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYodHlwZW9mIGluZm8udmlzaWJsZSA9PSAnZnVuY3Rpb24nICYmICFpbmZvLnZpc2libGUoKSkge1xyXG5cdFx0XHRcdGIuaGlkZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHR5cGVvZiBpbmZvLmNvb2xkb3duID09ICdudW1iZXInKSB7XHJcblx0XHRcdFx0QnV0dG9uLmNvb2xkb3duKGIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdEV2ZW50cy51cGRhdGVCdXR0b25zKCk7XHJcblx0fSxcclxuXHRcclxuXHR1cGRhdGVCdXR0b25zOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBidG5zID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnNjZW5lc1tFdmVudHMuYWN0aXZlU2NlbmVdLmJ1dHRvbnM7XHJcblx0XHRmb3IodmFyIGJJZCBpbiBidG5zKSB7XHJcblx0XHRcdHZhciBiID0gYnRuc1tiSWRdO1xyXG5cdFx0XHR2YXIgYnRuRWwgPSAkKCcjJytiSWQsIEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0XHRpZih0eXBlb2YgYi5hdmFpbGFibGUgPT0gJ2Z1bmN0aW9uJyAmJiAhYi5hdmFpbGFibGUoKSkge1xyXG5cdFx0XHRcdEJ1dHRvbi5zZXREaXNhYmxlZChidG5FbCwgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGJ1dHRvbkNsaWNrOiBmdW5jdGlvbihidG4pIHtcclxuXHRcdHZhciBpbmZvID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnNjZW5lc1tFdmVudHMuYWN0aXZlU2NlbmVdLmJ1dHRvbnNbYnRuLmF0dHIoJ2lkJyldO1xyXG5cclxuXHRcdGlmKHR5cGVvZiBpbmZvLm9uQ2hvb3NlID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0dmFyIHRleHRhcmVhID0gRXZlbnRzLmV2ZW50UGFuZWwoKS5maW5kKCd0ZXh0YXJlYScpO1xyXG5cdFx0XHRpbmZvLm9uQ2hvb3NlKHRleHRhcmVhLmxlbmd0aCA+IDAgPyB0ZXh0YXJlYS52YWwoKSA6IG51bGwpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBSZXdhcmRcclxuXHRcdGlmKGluZm8ucmV3YXJkKSB7XHJcblx0XHRcdCRTTS5hZGRNKCdzdG9yZXMnLCBpbmZvLnJld2FyZCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdEV2ZW50cy51cGRhdGVCdXR0b25zKCk7XHJcblx0XHRcclxuXHRcdC8vIE5vdGlmaWNhdGlvblxyXG5cdFx0aWYoaW5mby5ub3RpZmljYXRpb24pIHtcclxuXHRcdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgaW5mby5ub3RpZmljYXRpb24pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBOZXh0IFNjZW5lXHJcblx0XHRpZihpbmZvLm5leHRTY2VuZSkge1xyXG5cdFx0XHRpZihpbmZvLm5leHRTY2VuZSA9PSAnZW5kJykge1xyXG5cdFx0XHRcdEV2ZW50cy5lbmRFdmVudCgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHZhciByID0gTWF0aC5yYW5kb20oKTtcclxuXHRcdFx0XHR2YXIgbG93ZXN0TWF0Y2g6IG51bGwgfCBzdHJpbmcgPSBudWxsO1xyXG5cdFx0XHRcdGZvcih2YXIgaSBpbiBpbmZvLm5leHRTY2VuZSkge1xyXG5cdFx0XHRcdFx0aWYociA8IChpIGFzIHVua25vd24gYXMgbnVtYmVyKSAmJiAobG93ZXN0TWF0Y2ggPT0gbnVsbCB8fCBpIDwgbG93ZXN0TWF0Y2gpKSB7XHJcblx0XHRcdFx0XHRcdGxvd2VzdE1hdGNoID0gaTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYobG93ZXN0TWF0Y2ggIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0RXZlbnRzLmxvYWRTY2VuZShpbmZvLm5leHRTY2VuZVtsb3dlc3RNYXRjaF0pO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRFbmdpbmUubG9nKCdFUlJPUjogbm8gc3VpdGFibGUgc2NlbmUgZm91bmQnKTtcclxuXHRcdFx0XHRFdmVudHMuZW5kRXZlbnQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8vIGJsaW5rcyB0aGUgYnJvd3NlciB3aW5kb3cgdGl0bGVcclxuXHRibGlua1RpdGxlOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0aXRsZSA9IGRvY3VtZW50LnRpdGxlO1xyXG5cclxuXHRcdC8vIGV2ZXJ5IDMgc2Vjb25kcyBjaGFuZ2UgdGl0bGUgdG8gJyoqKiBFVkVOVCAqKionLCB0aGVuIDEuNSBzZWNvbmRzIGxhdGVyLCBjaGFuZ2UgaXQgYmFjayB0byB0aGUgb3JpZ2luYWwgdGl0bGUuXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRFdmVudHMuQkxJTktfSU5URVJWQUwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuXHRcdFx0ZG9jdW1lbnQudGl0bGUgPSBfKCcqKiogRVZFTlQgKioqJyk7XHJcblx0XHRcdEVuZ2luZS5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge2RvY3VtZW50LnRpdGxlID0gdGl0bGU7fSwgMTUwMCwgdHJ1ZSk7IFxyXG5cdFx0fSwgMzAwMCk7XHJcblx0fSxcclxuXHJcblx0c3RvcFRpdGxlQmxpbms6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0Y2xlYXJJbnRlcnZhbChFdmVudHMuQkxJTktfSU5URVJWQUwpO1xyXG5cdFx0RXZlbnRzLkJMSU5LX0lOVEVSVkFMID0gZmFsc2U7XHJcblx0fSxcclxuXHRcclxuXHQvLyBNYWtlcyBhbiBldmVudCBoYXBwZW4hXHJcblx0dHJpZ2dlckV2ZW50OiBmdW5jdGlvbigpIHtcclxuXHRcdGlmKEV2ZW50cy5hY3RpdmVFdmVudCgpID09IG51bGwpIHtcclxuXHRcdFx0dmFyIHBvc3NpYmxlRXZlbnRzID0gW107XHJcblx0XHRcdGZvcih2YXIgaSBpbiBFdmVudHMuRXZlbnRQb29sKSB7XHJcblx0XHRcdFx0dmFyIGV2ZW50ID0gRXZlbnRzLkV2ZW50UG9vbFtpXTtcclxuXHRcdFx0XHRpZihldmVudC5pc0F2YWlsYWJsZSgpKSB7XHJcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0XHRwb3NzaWJsZUV2ZW50cy5wdXNoKGV2ZW50KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKHBvc3NpYmxlRXZlbnRzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRcdEV2ZW50cy5zY2hlZHVsZU5leHRFdmVudCgwLjUpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR2YXIgciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoocG9zc2libGVFdmVudHMubGVuZ3RoKSk7XHJcblx0XHRcdFx0RXZlbnRzLnN0YXJ0RXZlbnQocG9zc2libGVFdmVudHNbcl0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0RXZlbnRzLnNjaGVkdWxlTmV4dEV2ZW50KCk7XHJcblx0fSxcclxuXHJcblx0Ly8gbm90IHNjaGVkdWxlZCwgdGhpcyBpcyBmb3Igc3R1ZmYgbGlrZSBsb2NhdGlvbi1iYXNlZCByYW5kb20gZXZlbnRzIG9uIGEgYnV0dG9uIGNsaWNrXHJcblx0dHJpZ2dlckxvY2F0aW9uRXZlbnQ6IGZ1bmN0aW9uKGxvY2F0aW9uKSB7XHJcblx0XHRpZiAodGhpcy5Mb2NhdGlvbnNbbG9jYXRpb25dKSB7XHJcblx0XHRcdGlmKEV2ZW50cy5hY3RpdmVFdmVudCgpID09IG51bGwpIHtcclxuXHRcdFx0XHR2YXIgcG9zc2libGVFdmVudHM6IEFycmF5PGFueT4gPSBbXTtcclxuXHRcdFx0XHRmb3IodmFyIGkgaW4gdGhpcy5Mb2NhdGlvbnNbbG9jYXRpb25dKSB7XHJcblx0XHRcdFx0XHR2YXIgZXZlbnQgPSB0aGlzLkxvY2F0aW9uc1tsb2NhdGlvbl1baV07XHJcblx0XHRcdFx0XHRpZihldmVudC5pc0F2YWlsYWJsZSgpKSB7XHJcblx0XHRcdFx0XHRcdGlmKHR5cGVvZihldmVudC5pc1N1cGVyTGlrZWx5KSA9PSAnZnVuY3Rpb24nICYmIGV2ZW50LmlzU3VwZXJMaWtlbHkoKSkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFN1cGVyTGlrZWx5IGV2ZW50LCBkbyB0aGlzIGFuZCBza2lwIHRoZSByYW5kb20gY2hvaWNlXHJcblx0XHRcdFx0XHRcdFx0RW5naW5lLmxvZygnc3VwZXJMaWtlbHkgZGV0ZWN0ZWQnKTtcclxuXHRcdFx0XHRcdFx0XHRFdmVudHMuc3RhcnRFdmVudChldmVudCk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHBvc3NpYmxlRXZlbnRzLnB1c2goZXZlbnQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcclxuXHRcdFx0XHRpZihwb3NzaWJsZUV2ZW50cy5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHRcdC8vIEV2ZW50cy5zY2hlZHVsZU5leHRFdmVudCgwLjUpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR2YXIgciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoocG9zc2libGVFdmVudHMubGVuZ3RoKSk7XHJcblx0XHRcdFx0XHRFdmVudHMuc3RhcnRFdmVudChwb3NzaWJsZUV2ZW50c1tyXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRhY3RpdmVFdmVudDogZnVuY3Rpb24oKTogQURSRXZlbnQgfCBudWxsIHtcclxuXHRcdGlmKEV2ZW50cy5ldmVudFN0YWNrICYmIEV2ZW50cy5ldmVudFN0YWNrLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0cmV0dXJuIEV2ZW50cy5ldmVudFN0YWNrWzBdO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fSxcclxuXHRcclxuXHRldmVudFBhbmVsOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBFdmVudHMuYWN0aXZlRXZlbnQoKT8uZXZlbnRQYW5lbDtcclxuXHR9LFxyXG5cclxuXHRzdGFydEV2ZW50OiBmdW5jdGlvbihldmVudDogQURSRXZlbnQsIG9wdGlvbnM/KSB7XHJcblx0XHRpZihldmVudCkge1xyXG5cdFx0XHRFdmVudHMuZXZlbnRTdGFjay51bnNoaWZ0KGV2ZW50KTtcclxuXHRcdFx0ZXZlbnQuZXZlbnRQYW5lbCA9ICQoJzxkaXY+JykuYXR0cignaWQnLCAnZXZlbnQnKS5hZGRDbGFzcygnZXZlbnRQYW5lbCcpLmNzcygnb3BhY2l0eScsICcwJyk7XHJcblx0XHRcdGlmKG9wdGlvbnMgIT0gbnVsbCAmJiBvcHRpb25zLndpZHRoICE9IG51bGwpIHtcclxuXHRcdFx0XHRFdmVudHMuZXZlbnRQYW5lbCgpLmNzcygnd2lkdGgnLCBvcHRpb25zLndpZHRoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKCc8ZGl2PicpLmFkZENsYXNzKCdldmVudFRpdGxlJykudGV4dChFdmVudHMuYWN0aXZlRXZlbnQoKT8udGl0bGUgYXMgc3RyaW5nKS5hcHBlbmRUbyhFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdkZXNjcmlwdGlvbicpLmFwcGVuZFRvKEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2J1dHRvbnMnKS5hcHBlbmRUbyhFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdFx0RXZlbnRzLmxvYWRTY2VuZSgnc3RhcnQnKTtcclxuXHRcdFx0JCgnZGl2I3dyYXBwZXInKS5hcHBlbmQoRXZlbnRzLmV2ZW50UGFuZWwoKSk7XHJcblx0XHRcdEV2ZW50cy5ldmVudFBhbmVsKCkuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIEV2ZW50cy5fUEFORUxfRkFERSwgJ2xpbmVhcicpO1xyXG5cdFx0XHR2YXIgY3VycmVudFNjZW5lSW5mb3JtYXRpb24gPSBFdmVudHMuYWN0aXZlRXZlbnQoKT8uc2NlbmVzW0V2ZW50cy5hY3RpdmVTY2VuZV07XHJcblx0XHRcdGlmIChjdXJyZW50U2NlbmVJbmZvcm1hdGlvbi5ibGluaykge1xyXG5cdFx0XHRcdEV2ZW50cy5ibGlua1RpdGxlKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRzY2hlZHVsZU5leHRFdmVudDogZnVuY3Rpb24oc2NhbGU/KSB7XHJcblx0XHR2YXIgbmV4dEV2ZW50ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKihFdmVudHMuX0VWRU5UX1RJTUVfUkFOR0VbMV0gLSBFdmVudHMuX0VWRU5UX1RJTUVfUkFOR0VbMF0pKSArIEV2ZW50cy5fRVZFTlRfVElNRV9SQU5HRVswXTtcclxuXHRcdGlmKHNjYWxlID4gMCkgeyBuZXh0RXZlbnQgKj0gc2NhbGU7IH1cclxuXHRcdEVuZ2luZS5sb2coJ25leHQgZXZlbnQgc2NoZWR1bGVkIGluICcgKyBuZXh0RXZlbnQgKyAnIG1pbnV0ZXMnKTtcclxuXHRcdEV2ZW50cy5fZXZlbnRUaW1lb3V0ID0gRW5naW5lLnNldFRpbWVvdXQoRXZlbnRzLnRyaWdnZXJFdmVudCwgbmV4dEV2ZW50ICogNjAgKiAxMDAwKTtcclxuXHR9LFxyXG5cclxuXHRlbmRFdmVudDogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuZXZlbnRQYW5lbCgpLmFuaW1hdGUoe29wYWNpdHk6MH0sIEV2ZW50cy5fUEFORUxfRkFERSwgJ2xpbmVhcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRFdmVudHMuZXZlbnRQYW5lbCgpLnJlbW92ZSgpO1xyXG5cdFx0XHRjb25zdCBhY3RpdmVFdmVudCA9IEV2ZW50cy5hY3RpdmVFdmVudCgpO1xyXG5cdFx0XHRpZiAoYWN0aXZlRXZlbnQgIT09IG51bGwpIGFjdGl2ZUV2ZW50LmV2ZW50UGFuZWwgPSBudWxsO1xyXG5cdFx0XHRFdmVudHMuZXZlbnRTdGFjay5zaGlmdCgpO1xyXG5cdFx0XHRFbmdpbmUubG9nKEV2ZW50cy5ldmVudFN0YWNrLmxlbmd0aCArICcgZXZlbnRzIHJlbWFpbmluZycpO1xyXG5cdFx0XHRpZiAoRXZlbnRzLkJMSU5LX0lOVEVSVkFMKSB7XHJcblx0XHRcdFx0RXZlbnRzLnN0b3BUaXRsZUJsaW5rKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gRm9yY2UgcmVmb2N1cyBvbiB0aGUgYm9keS4gSSBoYXRlIHlvdSwgSUUuXHJcblx0XHRcdCQoJ2JvZHknKS5mb2N1cygpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0aGFuZGxlU3RhdGVVcGRhdGVzOiBmdW5jdGlvbihlKXtcclxuXHRcdGlmKChlLmNhdGVnb3J5ID09ICdzdG9yZXMnIHx8IGUuY2F0ZWdvcnkgPT0gJ2luY29tZScpICYmIEV2ZW50cy5hY3RpdmVFdmVudCgpICE9IG51bGwpe1xyXG5cdFx0XHRFdmVudHMudXBkYXRlQnV0dG9ucygpO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuIiwiLyoqXHJcbiAqIEV2ZW50cyB0aGF0IGNhbiBvY2N1ciB3aGVuIHRoZSBSb2FkIG1vZHVsZSBpcyBhY3RpdmVcclxuICoqL1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi4vZW5naW5lXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tIFwiLi4vcGxheWVyL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgeyBPdXRwb3N0IH0gZnJvbSBcIi4uL3BsYWNlcy9vdXRwb3N0XCI7XHJcbmltcG9ydCB7IFJvYWQgfSBmcm9tIFwiLi4vcGxhY2VzL3JvYWRcIjtcclxuaW1wb3J0IHsgQURSRXZlbnQgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgRXZlbnRzUm9hZFdhbmRlcjogQXJyYXk8QURSRXZlbnQ+ID0gW1xyXG4gICAgLy8gU3RyYW5nZXIgYmVhcmluZyBnaWZ0c1xyXG4gICAge1xyXG4gICAgICAgIHRpdGxlOiBfKCdBIFN0cmFuZ2VyIEJlY2tvbnMnKSxcclxuICAgICAgICBpc0F2YWlsYWJsZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBFbmdpbmUuYWN0aXZlTW9kdWxlID09IFJvYWQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgJ3N0YXJ0Jzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0FzIHlvdSB3YW5kZXIgYWxvbmcgdGhlIHJvYWQsIGEgaG9vZGVkIHN0cmFuZ2VyIGdlc3R1cmVzIHRvIHlvdS4gSGUgZG9lc25cXCd0IHNlZW0gaW50ZXJlc3RlZCBpbiBodXJ0aW5nIHlvdS4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdXaGF0IGRvIHlvdSBkbz8nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnY2xvc2VyJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdEcmF3IENsb3NlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOiAnY2xvc2VyJ31cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnR2V0IE91dHRhIFRoZXJlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6ICdsZWF2ZSd9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnY2xvc2VyJzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1lvdSBtb3ZlIHRvd2FyZCBoaW0gYSBiaXQgYW5kIHN0b3AuIEhlIGNvbnRpbnVlcyB0byBiZWNrb24uJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnV2hhdCBkbyB5b3UgZG8/JylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2V2ZW5DbG9zZXInOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0RyYXcgRXZlbiBDbG9zZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTogJ2V2ZW5DbG9zZXInfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdOYWgsIFRoaXMgaXMgVG9vIFNwb29reScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOiAnbGVhdmUnfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2V2ZW5DbG9zZXInOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgXygnWW91IGhlc2l0YW50bHkgd2FsayBjbG9zZXIuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnQXMgc29vbiBhcyB5b3UgZ2V0IHdpdGhpbiBhcm1zXFwnIHJlYWNoLCBoZSBncmFicyB5b3VyIGhhbmQgd2l0aCBhbGFybWluZyBzcGVlZC4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdIZSBxdWlja2x5IHBsYWNlcyBhbiBvYmplY3QgaW4geW91ciBoYW5kLCB0aGVuIGxlYXZlcyB3b3JkbGVzc2x5LicpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgb25Mb2FkOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBtYXliZSBzb21lIGxvZ2ljIHRvIG1ha2UgcmVwZWF0cyBsZXNzIGxpa2VseT9cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb3NzaWJsZUl0ZW1zID0gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnU3RyYW5nZXIuc21vb3RoU3RvbmUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnU3RyYW5nZXIud3JhcHBlZEtuaWZlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ1N0cmFuZ2VyLmNsb3RoQnVuZGxlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ1N0cmFuZ2VyLmNvaW4nXHJcbiAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gcG9zc2libGVJdGVtc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwb3NzaWJsZUl0ZW1zLmxlbmd0aCldO1xyXG4gICAgICAgICAgICAgICAgICAgIENoYXJhY3Rlci5hZGRUb0ludmVudG9yeShpdGVtKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1RoYW5rcywgSSBndWVzcz8nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1lvdXIgZ3V0IGNsZW5jaGVzLCBhbmQgeW91IGZlZWwgdGhlIHN1ZGRlbiB1cmdlIHRvIGxlYXZlLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0FzIHlvdSB3YWxrIGF3YXksIHlvdSBjYW4gZmVlbCB0aGUgb2xkIG1hblxcJ3MgZ2F6ZSBvbiB5b3VyIGJhY2suJylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1dlaXJkLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIE9sZCBsYWR5IGluIGNhcnJpYWdlLCBzaG9ydGN1dCB0byBPdXRwb3N0XHJcbiAgICB7XHJcbiAgICAgICAgdGl0bGU6IF8oJ1RoZSBTdG9tcGluZyBvZiBIb292ZXMgYW5kIENyZWFraW5nIG9mIFdvb2QnKSxcclxuICAgICAgICBpc0F2YWlsYWJsZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBFbmdpbmUuYWN0aXZlTW9kdWxlID09IFJvYWQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgJ3N0YXJ0Jzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0EgY2FycmlhZ2UgcHVsbHMgdXAgYWxvbmdzaWRlIHlvdSwgYW5kIHRoZSB2b2ljZSBvZiBhbiBlbGRlcmx5IHdvbWFuIGNyb2FrcyBvdXQgZnJvbSB3aXRoaW4uJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnXCJNeSwgYnV0IHlvdSBsb29rIHRpcmVkIGZyb20geW91ciBqb3VybmV5LiBJZiBpdFxcJ3MgdGhlIE91dHBvc3QgeW91IHNlZWssICdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICsgJ0lcXCdtIG9uIG15IHdheSB0aGVyZSBub3c7IHdvdWxkIHlvdSBsaWtlIHRvIGpvaW4gbWU/XCInKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdXaGF0IGRvIHlvdSBkbz8nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnYWNjZXB0Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBY2NlcHQgaGVyIG9mZmVyJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6ICdhY2NlcHQnfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdQb2xpdGVseSBEZWNsaW5lJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6ICdsZWF2ZSd9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnYWNjZXB0Jzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1lvdSBob3AgaW4gdGhlIGNhcnJpYWdlIHdpdGggdGhlIG9sZCB3b21hbi4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdTaGUgdHVybnMgb3V0IHRvIGJlIHByZXR0eSBjb29sLCBhbmQgZ2l2ZXMgeW91IG9uZSBvZiB0aG9zZSBoYXJkIGNhbmRpZXMgdGhhdCAnIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICArICdldmVyeSBncmFuZHBhcmVudCBzZWVtcyB0byBoYXZlIG9uIHRoZSBlbmQgdGFibGUgbmV4dCB0byB0aGVpciBzb2ZhLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0JlZm9yZSBsb25nLCB5b3UgcmVhY2ggdGhlIE91dHBvc3QuIFlvdSBob3Agb3V0IGFuZCB0aGFuayB0aGUgb2xkIHdvbWFuIGZvciB0aGUgcmlkZS4nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnV2hhdCBhIG5pY2Ugb2xkIGxhZHknKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRTTS5nZXQoJ091dHBvc3Qub3BlbicpID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPdXRwb3N0LmluaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkU00uc2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJywgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hhcmFjdGVyLnNldFF1ZXN0U3RhdHVzKFwibWF5b3JTdXBwbGllc1wiLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDaGFyYWN0ZXIuY2hlY2tRdWVzdFN0YXR1cyhcIm1heW9yU3VwcGxpZXNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRW5naW5lLnRyYXZlbFRvKE91dHBvc3QpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoJ29sZExhZHkuQ2FuZHknKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0l0XFwncyB0b28gZWFybHkgaW4gdGhlIGdhbWUgdG8gYmUgdHJ1c3Rpbmcgd2VpcmQgb2xkIHBlb3BsZSwgbWFuLiBZb3UgcG9saXRlbHkgJyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyAnZGVjbGluZSwgYW5kIHRoZSB3b21hbiBjaHVja2xlcyBzb2Z0bHkgYXMgdGhlIGNhcnJpYWdlIHJvbGxzIG9mZiBpbnRvIHRoZSBkaXN0YW5jZS4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdUaGF0IHNvZnQgY2h1Y2tsZSB0ZWxscyBtZSBldmVyeXRoaW5nIEkgbmVlZCB0byBrbm93IGFib3V0IHdoZXRoZXIgeW91IG1hZGUgdGhlICdcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyAncmlnaHQgY2FsbC4gVGhhdCBoYWQgXCJ0dXJuZWQgaW50byBnaW5nZXJicmVhZFwiIHdyaXR0ZW4gYWxsIG92ZXIgaXQuJylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1llYWggaXQgZGlkJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gT3JnYW4gdHJhdW1hXHJcbiAgICB7XHJcbiAgICAgICAgdGl0bGU6IF8oJ1RoaXMgR3V5IFNlZW1zIEZyaWVuZGx5JyksXHJcbiAgICAgICAgaXNBdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gKEVuZ2luZS5hY3RpdmVNb2R1bGUgPT09IFJvYWRcclxuICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ1JvYWQuZ290UHVuY2hlZCcpID09PSB1bmRlZmluZWQpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICdzdGFydCc6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdBIG1hbiB3YWxrcyB1cCB0byB5b3Ugd2l0aCBhIGJpZyBncmluIG9uIGhpcyBmYWNlLCBhbmQgYmVmb3JlIHlvdSBjYW4gZ3JlZXQgaGltIGhlIHN3aWZ0bHkgc29ja3MgeW91IGluIHRoZSBzdG9tYWNoLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0hlIHdhbGtzIG9mZiB3aGlzdGxpbmcgd2hpbGUgeW91IGdhc3AgZm9yIGJyZWF0aCBpbiB0aGUgZGlydC4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCcuLi4gTWFuLCB3aGF0IGEgZGljay4nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnRnVjayBtZSwgSSBndWVzcycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNob29zZTogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hhcmFjdGVyLmdyYW50UGVyaygndHVtbXlQYWluJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkU00uc2V0KCdSb2FkLmdvdFB1bmNoZWQnLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBBbiBhcG9sb2d5IGZvciBvcmdhbiB0cmF1bWFcclxuICAgIHtcclxuICAgICAgICB0aXRsZTogXygnVGhpcyBGdWNraW5nIEd1eSBBZ2FpbicpLFxyXG4gICAgICAgIGlzQXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChFbmdpbmUuYWN0aXZlTW9kdWxlID09PSBSb2FkXHJcbiAgICAgICAgICAgICAgICAmJiAoJFNNLmdldCgnUm9hZC5nb3RQdW5jaGVkJykgIT09IHVuZGVmaW5lZCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICdzdGFydCc6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdBIG1hbiB3YWxrcyB1cCB0byB5b3Ugd2l0aCBhIGJpZyBncmluIG9uIGhpcyBmYWNlLCBhbmQgYmVmb3JlIHlvdSBjYW4gZ3JlZXQgaGltIGhlIHN3aWZ0bHkuLi4gYXBvbG9naXplcy4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdcIkhleSwgSVxcJ20gcmVhbGx5IHNvcnJ5IGFib3V0IHB1bmNoaW5nIHlvdSBpbiB0aGUgc3RvbWFjaCBiZWZvcmUuIEkgdGhvdWdodCB5b3Ugd2VyZSBzb21lb25lIGVsc2UuIEkgSEFURSB0aGF0IGd1eS5cIicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1lvdVxcJ3JlIG5vdCBzdXJlIHRoaXMgaXMgYSBnb29kIGVub3VnaCByZWFzb24gdG8gbm90IGtpY2sgdGhpcyBndXlcXCdzIGFzcy4gU2VlaW5nIHRoZSBsb29rIG9uIHlvdXIgZmFjZSwgaGUgaGFzdGlseSBjb250aW51ZXMuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnXCJBbnl3YXksIGFzIGEgdG9rZW4gb2YgbXkgYXBvbG9neSwgcGxlYXNlIGFjY2VwdCB0aGlzIGhlYWxpbmcgdG9uaWMsIGFzIHdlbGwgYXMgYSBjb3Vwb24gZm9yIGEgc2VjcmV0IGl0ZW0gZnJvbSB0aGUgc3RvcmUgaW4gdGhlIHZpbGxhZ2UuXCInKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdZb3Ugc29tZXdoYXQgYXdrd2FyZGx5IGFjY2VwdCBib3RoIG9mIHRoZXNlIGl0ZW1zLCB0aG91Z2ggeW91IGRvblxcJ3QgdGhpbmsgdGhlcmVcXCdzIGEgc3RvcmUgaW4gdGhlIHZpLScpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1wiT2gsIGFuZCBJXFwnbSB0aGUgb3duZXIgb2YgdGhlIHN0b3JlIGluIHRoZSB2aWxsYWdlLiBJIG9wZW5lZCBpdCBiYWNrIHVwIGFmdGVyIHB1bmNoaW5nIHlvdS4gWW91IGtub3csIHRvIGNlbGVicmF0ZS5cIicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1RoZSBtYW4gd2Fsa3Mgb2ZmLCBzdGlsbCBncmlubmluZy4nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnLi4uIEFscmlnaHQnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdpdmUgaGVhbGluZyB0b25pY1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2l2ZSBjb3Vwb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVubG9jayBzdG9yZSBidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRTTS5zZXQoJ1JvYWQuZ290QXBvbG9naXplZCcsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIFVubG9jayBPdXRwb3N0XHJcbiAgICB7XHJcbiAgICAgICAgdGl0bGU6IF8oJ0EgV2F5IEZvcndhcmQgTWFrZXMgSXRzZWxmIEtub3duJyksXHJcbiAgICAgICAgaXNBdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgKEVuZ2luZS5hY3RpdmVNb2R1bGUgPT09IFJvYWQpXHJcbiAgICAgICAgICAgICAgICAmJiAoJFNNLmdldCgnUm9hZC5jb3VudGVyJykgYXMgbnVtYmVyID4gMykgLy8gY2FuJ3QgaGFwcGVuIFRPTyBlYXJseVxyXG4gICAgICAgICAgICAgICAgJiYgKCRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSA9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICB8fCAkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyIDwgMSkgLy8gY2FuJ3QgaGFwcGVuIHR3aWNlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpc1N1cGVyTGlrZWx5OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuICgoKCAkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfHwgJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpIGFzIG51bWJlciA8IDEpKSBcclxuICAgICAgICAgICAgICAgICAgICAmJiAoJFNNLmdldCgnUm9hZC5jb3VudGVyJykgYXMgbnVtYmVyID4gNyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgJ3N0YXJ0Jzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1Ntb2tlIGN1cmxzIHVwd2FyZHMgZnJvbSBiZWhpbmQgYSBoaWxsLiBZb3UgY2xpbWIgaGlnaGVyIHRvIGludmVzdGlnYXRlLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0Zyb20geW91ciBlbGV2YXRlZCBwb3NpdGlvbiwgeW91IGNhbiBzZWUgZG93biBpbnRvIHRoZSBvdXRwb3N0IHRoYXQgdGhlIG1heW9yIHNwb2tlIG9mIGJlZm9yZS4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdUaGUgT3V0cG9zdCBpcyBub3cgb3BlbiB0byB5b3UuJylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0EgbGl0dGxlIGRyYW1hdGljLCBidXQgY29vbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBPdXRwb3N0LmluaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRTTS5zZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENoYXJhY3Rlci5zZXRRdWVzdFN0YXR1cyhcIm1heW9yU3VwcGxpZXNcIiwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDaGFyYWN0ZXIuY2hlY2tRdWVzdFN0YXR1cyhcIm1heW9yU3VwcGxpZXNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5dO1xyXG5cclxuIiwiLyoqXHJcbiAqIE1vZHVsZSB0aGF0IHRha2VzIGNhcmUgb2YgaGVhZGVyIGJ1dHRvbnNcclxuICovXHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuL2VuZ2luZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEhlYWRlciA9IHtcclxuXHRcclxuXHRpbml0OiBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdH0sXHJcblx0XHJcblx0b3B0aW9uczoge30sIC8vIE5vdGhpbmcgZm9yIG5vd1xyXG5cdFxyXG5cdGNhblRyYXZlbDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gJCgnZGl2I2hlYWRlciBkaXYuaGVhZGVyQnV0dG9uJykubGVuZ3RoID4gMTtcclxuXHR9LFxyXG5cdFxyXG5cdGFkZExvY2F0aW9uOiBmdW5jdGlvbih0ZXh0LCBpZCwgbW9kdWxlKSB7XHJcblx0XHRyZXR1cm4gJCgnPGRpdj4nKS5hdHRyKCdpZCcsIFwibG9jYXRpb25fXCIgKyBpZClcclxuXHRcdFx0LmFkZENsYXNzKCdoZWFkZXJCdXR0b24nKVxyXG5cdFx0XHQudGV4dCh0ZXh0KS5jbGljayhmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZihIZWFkZXIuY2FuVHJhdmVsKCkpIHtcclxuXHRcdFx0XHRcdEVuZ2luZS50cmF2ZWxUbyhtb2R1bGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSkuYXBwZW5kVG8oJCgnZGl2I2hlYWRlcicpKTtcclxuXHR9XHJcbn07IiwiLyoqXHJcbiAqIE1vZHVsZSB0aGF0IHJlZ2lzdGVycyB0aGUgbm90aWZpY2F0aW9uIGJveCBhbmQgaGFuZGxlcyBtZXNzYWdlc1xyXG4gKi9cclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4vZW5naW5lXCI7XHJcblxyXG5leHBvcnQgY29uc3QgTm90aWZpY2F0aW9ucyA9IHtcclxuXHRcdFxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdFx0XHJcblx0XHQvLyBDcmVhdGUgdGhlIG5vdGlmaWNhdGlvbnMgYm94XHJcblx0XHRjb25zdCBlbGVtID0gJCgnPGRpdj4nKS5hdHRyKHtcclxuXHRcdFx0aWQ6ICdub3RpZmljYXRpb25zJyxcclxuXHRcdFx0Y2xhc3NOYW1lOiAnbm90aWZpY2F0aW9ucydcclxuXHRcdH0pO1xyXG5cdFx0Ly8gQ3JlYXRlIHRoZSB0cmFuc3BhcmVuY3kgZ3JhZGllbnRcclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnbm90aWZ5R3JhZGllbnQnKS5hcHBlbmRUbyhlbGVtKTtcclxuXHRcdFxyXG5cdFx0ZWxlbS5hcHBlbmRUbygnZGl2I3dyYXBwZXInKTtcclxuXHR9LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHt9LCAvLyBOb3RoaW5nIGZvciBub3dcclxuXHRcclxuXHRlbGVtOiBudWxsLFxyXG5cdFxyXG5cdG5vdGlmeVF1ZXVlOiB7fSxcclxuXHRcclxuXHQvLyBBbGxvdyBub3RpZmljYXRpb24gdG8gdGhlIHBsYXllclxyXG5cdG5vdGlmeTogZnVuY3Rpb24obW9kdWxlLCB0ZXh0LCBub1F1ZXVlPykge1xyXG5cdFx0aWYodHlwZW9mIHRleHQgPT0gJ3VuZGVmaW5lZCcpIHJldHVybjtcclxuXHRcdC8vIEkgZG9uJ3QgbmVlZCB5b3UgcHVuY3R1YXRpbmcgZm9yIG1lLCBmdW5jdGlvbi5cclxuXHRcdC8vIGlmKHRleHQuc2xpY2UoLTEpICE9IFwiLlwiKSB0ZXh0ICs9IFwiLlwiO1xyXG5cdFx0aWYobW9kdWxlICE9IG51bGwgJiYgRW5naW5lLmFjdGl2ZU1vZHVsZSAhPSBtb2R1bGUpIHtcclxuXHRcdFx0aWYoIW5vUXVldWUpIHtcclxuXHRcdFx0XHRpZih0eXBlb2YgdGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdID09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0XHR0aGlzLm5vdGlmeVF1ZXVlW21vZHVsZV0gPSBbXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdLnB1c2godGV4dCk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdE5vdGlmaWNhdGlvbnMucHJpbnRNZXNzYWdlKHRleHQpO1xyXG5cdFx0fVxyXG5cdFx0RW5naW5lLnNhdmVHYW1lKCk7XHJcblx0fSxcclxuXHRcclxuXHRjbGVhckhpZGRlbjogZnVuY3Rpb24oKSB7XHJcblx0XHJcblx0XHQvLyBUbyBmaXggc29tZSBtZW1vcnkgdXNhZ2UgaXNzdWVzLCB3ZSBjbGVhciBub3RpZmljYXRpb25zIHRoYXQgaGF2ZSBiZWVuIGhpZGRlbi5cclxuXHRcdFxyXG5cdFx0Ly8gV2UgdXNlIHBvc2l0aW9uKCkudG9wIGhlcmUsIGJlY2F1c2Ugd2Uga25vdyB0aGF0IHRoZSBwYXJlbnQgd2lsbCBiZSB0aGUgc2FtZSwgc28gdGhlIHBvc2l0aW9uIHdpbGwgYmUgdGhlIHNhbWUuXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHR2YXIgYm90dG9tID0gJCgnI25vdGlmeUdyYWRpZW50JykucG9zaXRpb24oKS50b3AgKyAkKCcjbm90aWZ5R3JhZGllbnQnKS5vdXRlckhlaWdodCh0cnVlKTtcclxuXHRcdFxyXG5cdFx0JCgnLm5vdGlmaWNhdGlvbicpLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcclxuXHRcdFx0aWYoJCh0aGlzKS5wb3NpdGlvbigpLnRvcCA+IGJvdHRvbSl7XHJcblx0XHRcdFx0JCh0aGlzKS5yZW1vdmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdH0sXHJcblx0XHJcblx0cHJpbnRNZXNzYWdlOiBmdW5jdGlvbih0KSB7XHJcblx0XHR2YXIgdGV4dCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ25vdGlmaWNhdGlvbicpLmNzcygnb3BhY2l0eScsICcwJykudGV4dCh0KS5wcmVwZW5kVG8oJ2RpdiNub3RpZmljYXRpb25zJyk7XHJcblx0XHR0ZXh0LmFuaW1hdGUoe29wYWNpdHk6IDF9LCA1MDAsICdsaW5lYXInLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly8gRG8gdGhpcyBldmVyeSB0aW1lIHdlIGFkZCBhIG5ldyBtZXNzYWdlLCB0aGlzIHdheSB3ZSBuZXZlciBoYXZlIGEgbGFyZ2UgYmFja2xvZyB0byBpdGVyYXRlIHRocm91Z2guIEtlZXBzIHRoaW5ncyBmYXN0ZXIuXHJcblx0XHRcdE5vdGlmaWNhdGlvbnMuY2xlYXJIaWRkZW4oKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0XHJcblx0cHJpbnRRdWV1ZTogZnVuY3Rpb24obW9kdWxlKSB7XHJcblx0XHRpZih0eXBlb2YgdGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdICE9ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdHdoaWxlKHRoaXMubm90aWZ5UXVldWVbbW9kdWxlXS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9ucy5wcmludE1lc3NhZ2UodGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdLnNoaWZ0KCkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCB7IEVuZ2luZSB9IGZyb20gJy4uL2VuZ2luZSc7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gJy4uL3N0YXRlX21hbmFnZXInO1xyXG5pbXBvcnQgeyBXZWF0aGVyIH0gZnJvbSAnLi4vd2VhdGhlcic7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCB7IENhcHRhaW4gfSBmcm9tICcuLi9jaGFyYWN0ZXJzL2NhcHRhaW4nO1xyXG5pbXBvcnQgeyBIZWFkZXIgfSBmcm9tICcuLi9oZWFkZXInO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSAnLi4vLi4vbGliL3RyYW5zbGF0ZSc7XHJcbmltcG9ydCB7IF90YiB9IGZyb20gJy4uLy4uL2xpYi90ZXh0QnVpbGRlcic7XHJcblxyXG5leHBvcnQgY29uc3QgT3V0cG9zdCA9IHtcclxuXHRkZXNjcmlwdGlvbjogW1xyXG5cdFx0XyhcIllvdSdyZSBpbiBhIHNtYWxsIGJ1dCBidXN0bGluZyBtaWxpdGFyeSBPdXRwb3N0LiBWYXJpb3VzIG1lbWJlcnMgXCIgXHJcblx0XHRcdCsgXCJvZiB0aGUgcmFuay1hbmQtZmlsZSBnbyBhYm91dCB0aGVpciBidXNpbmVzcywgcGF5aW5nIHlvdSBsaXR0bGUgbWluZC5cIiksXHJcblx0XHRfKFwiT25lIHRlbnQgc3RhbmRzIG91dCBmcm9tIHRoZSByZXN0OyB0aGUgZmluZWx5LWVtYnJvaWRlcmVkIGRldGFpbHMgYW5kIFwiICsgXHJcblx0XHRcdFwiZ29sZGVuIGljb24gYWJvdmUgdGhlIGVudHJhbmNlIG1hcmsgaXQgYXMgdGhlIGNvbW1hbmRpbmcgb2ZmaWNlcidzIHF1YXJ0ZXJzLlwiKVxyXG5cdF0sXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgdGhlIE91dHBvc3QgdGFiXHJcbiAgICAgICAgdGhpcy50YWIgPSBIZWFkZXIuYWRkTG9jYXRpb24oXyhcIlRoZSBPdXRwb3N0XCIpLCBcIm91dHBvc3RcIiwgT3V0cG9zdCk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgT3V0cG9zdCBwYW5lbFxyXG5cdFx0dGhpcy5wYW5lbCA9ICQoJzxkaXY+JylcclxuICAgICAgICAuYXR0cignaWQnLCBcIm91dHBvc3RQYW5lbFwiKVxyXG4gICAgICAgIC5hZGRDbGFzcygnbG9jYXRpb24nKVxyXG4gICAgICAgIC5hcHBlbmRUbygnZGl2I2xvY2F0aW9uU2xpZGVyJyk7XHJcblxyXG5cdFx0dGhpcy5kZXNjcmlwdGlvblBhbmVsID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdkZXNjcmlwdGlvbicpLmFwcGVuZFRvKHRoaXMucGFuZWwpO1xyXG5cdFx0dGhpcy51cGRhdGVEZXNjcmlwdGlvbigpO1xyXG5cclxuICAgICAgICBFbmdpbmUudXBkYXRlU2xpZGVyKCk7XHJcblxyXG4gICAgICAgIC8vIG5ldyBcclxuXHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogJ2NhcHRhaW5CdXR0b24nLFxyXG5cdFx0XHR0ZXh0OiBfKCdTcGVhayB3aXRoIFRoZSBDYXB0YWluJyksXHJcblx0XHRcdGNsaWNrOiBDYXB0YWluLnRhbGtUb0NhcHRhaW4sXHJcblx0XHRcdHdpZHRoOiAnODBweCdcclxuXHRcdH0pXHJcblx0XHQuYWRkQ2xhc3MoJ2xvY2F0aW9uQnV0dG9uJylcclxuXHRcdC5hcHBlbmRUbygnZGl2I291dHBvc3RQYW5lbCcpO1xyXG5cclxuICAgICAgICBPdXRwb3N0LnVwZGF0ZUJ1dHRvbigpO1xyXG5cclxuICAgICAgICAvLyBzZXR0aW5nIHRoaXMgc2VwYXJhdGVseSBzbyB0aGF0IHF1ZXN0IHN0YXR1cyBjYW4ndCBhY2NpZGVudGFsbHkgYnJlYWsgaXQgbGF0ZXJcclxuICAgICAgICAkU00uc2V0KCdPdXRwb3N0Lm9wZW4nLCAxKTsgXHJcbiAgICB9LFxyXG5cclxuXHR1cGRhdGVEZXNjcmlwdGlvbjogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLmRlc2NyaXB0aW9uUGFuZWwuZW1wdHkoKTtcclxuXHRcdHRoaXMuZGVzY3JpcHRpb24gPSBfdGIoW1xyXG5cdFx0XHRfKFwiWW91J3JlIG9uIGEgZHVzdHkgcm9hZCBiZXR3ZWVuIHRoZSBWaWxsYWdlIGFuZCB0aGUgT3V0cG9zdC4gVGhlIHJvYWQgY3V0cyB0aHJvdWdoIFwiIFxyXG5cdFx0XHRcdCsgXCJ0YWxsIGdyYXNzLCBicnVzaCwgYW5kIHRyZWVzLCBsaW1pdGluZyB2aXNpYmlsaXR5IGFuZCBlbnN1cmluZyB0aGF0IHlvdSdsbCBoYXZlIFwiIFxyXG5cdFx0XHRcdCsgXCJ0byBkZWFsIHdpdGggc29tZSBub25zZW5zZS5cIiksXHJcblx0XHRcdF8oXCJUaGUgaGFpciBvbiB0aGUgYmFjayBvZiB5b3VyIG5lY2sgcHJpY2tsZXMgc2xpZ2h0bHkgaW4gYW50aWNpcGF0aW9uLlwiKVxyXG5cdFx0XSk7XHJcblxyXG5cdFx0Zm9yKHZhciBpIGluIHRoaXMuZGVzY3JpcHRpb24pIHtcclxuXHRcdFx0JCgnPGRpdj4nKS50ZXh0KHRoaXMuZGVzY3JpcHRpb25baV0pLmFwcGVuZFRvKHRoaXMuZGVzY3JpcHRpb25QYW5lbCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcbiAgICBhdmFpbGFibGVXZWF0aGVyOiB7XHJcblx0XHQnc3VubnknOiAwLjQsXHJcblx0XHQnY2xvdWR5JzogMC4zLFxyXG5cdFx0J3JhaW55JzogMC4zXHJcblx0fSxcclxuXHJcbiAgICBvbkFycml2YWw6IGZ1bmN0aW9uKHRyYW5zaXRpb25fZGlmZikge1xyXG4gICAgICAgIE91dHBvc3Quc2V0VGl0bGUoKTtcclxuXHJcbiAgICAgICAgV2VhdGhlci5pbml0aWF0ZVdlYXRoZXIoT3V0cG9zdC5hdmFpbGFibGVXZWF0aGVyLCAnb3V0cG9zdCcpO1xyXG5cclxuXHRcdHRoaXMudXBkYXRlRGVzY3JpcHRpb24oKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0VGl0bGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRpdGxlID0gXyhcIlRoZSBPdXRwb3N0XCIpO1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSB0aGlzKSB7XHJcblx0XHRcdGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XHJcblx0XHR9XHJcblx0XHQkKCdkaXYjbG9jYXRpb25fb3V0cG9zdCcpLnRleHQodGl0bGUpO1xyXG5cdH0sXHJcblxyXG4gICAgdXBkYXRlQnV0dG9uOiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIGNvbmRpdGlvbmFscyBmb3IgdXBkYXRpbmcgYnV0dG9uc1xyXG5cdH1cclxufSIsImltcG9ydCB7IEhlYWRlciB9IGZyb20gXCIuLi9oZWFkZXJcIjtcclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4uL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi4vQnV0dG9uXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyBXZWF0aGVyIH0gZnJvbSBcIi4uL3dlYXRoZXJcIjtcclxuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5pbXBvcnQgeyBfdGIgfSBmcm9tIFwiLi4vLi4vbGliL3RleHRCdWlsZGVyXCI7XHJcblxyXG5leHBvcnQgY29uc3QgUm9hZCA9IHtcclxuXHRkZXNjcmlwdGlvbjogbnVsbCxcclxuXHRkZXNjcmlwdGlvblBhbmVsOiBudWxsLFxyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBSb2FkIHRhYlxyXG4gICAgICAgIHRoaXMudGFiID0gSGVhZGVyLmFkZExvY2F0aW9uKF8oXCJSb2FkIHRvIHRoZSBPdXRwb3N0XCIpLCBcInJvYWRcIiwgUm9hZCk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgUm9hZCBwYW5lbFxyXG5cdFx0dGhpcy5wYW5lbCA9ICQoJzxkaXY+JylcclxuICAgICAgICAuYXR0cignaWQnLCBcInJvYWRQYW5lbFwiKVxyXG4gICAgICAgIC5hZGRDbGFzcygnbG9jYXRpb24nKVxyXG4gICAgICAgIC5hcHBlbmRUbygnZGl2I2xvY2F0aW9uU2xpZGVyJyk7XHJcblxyXG5cdFx0dGhpcy5kZXNjcmlwdGlvblBhbmVsID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdkZXNjcmlwdGlvbicpLmFwcGVuZFRvKHRoaXMucGFuZWwpO1xyXG5cdFx0dGhpcy51cGRhdGVEZXNjcmlwdGlvbigpO1xyXG5cclxuICAgICAgICBFbmdpbmUudXBkYXRlU2xpZGVyKCk7XHJcblxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAnd2FuZGVyQnV0dG9uJyxcclxuXHRcdFx0dGV4dDogXygnV2FuZGVyIEFyb3VuZCcpLFxyXG5cdFx0XHRjbGljazogUm9hZC53YW5kZXJFdmVudCxcclxuXHRcdFx0d2lkdGg6ICc4MHB4JyxcclxuXHRcdFx0Y29zdDoge30gLy8gVE9ETzogbWFrZSB0aGVyZSBiZSBhIGNvc3QgdG8gZG9pbmcgc3R1ZmY/XHJcblx0XHR9KVxyXG5cdFx0LmFkZENsYXNzKCdsb2NhdGlvbkJ1dHRvbicpXHJcblx0XHQuYXBwZW5kVG8oJ2RpdiNyb2FkUGFuZWwnKTtcclxuXHJcbiAgICAgICAgUm9hZC51cGRhdGVCdXR0b24oKTtcclxuXHJcbiAgICAgICAgLy8gc2V0dGluZyB0aGlzIHNlcGFyYXRlbHkgc28gdGhhdCBxdWVzdCBzdGF0dXMgY2FuJ3QgYWNjaWRlbnRhbGx5IGJyZWFrIGl0IGxhdGVyXHJcbiAgICAgICAgJFNNLnNldCgnUm9hZC5vcGVuJywgMSk7IFxyXG4gICAgfSxcclxuXHJcblx0dXBkYXRlRGVzY3JpcHRpb246IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5kZXNjcmlwdGlvblBhbmVsLmVtcHR5KCk7XHJcblx0XHR0aGlzLmRlc2NyaXB0aW9uID0gX3RiKFtcclxuXHRcdFx0XyhcIllvdSdyZSBvbiBhIGR1c3R5IHJvYWQgYmV0d2VlbiB0aGUgVmlsbGFnZSBhbmQgdGhlIE91dHBvc3QuIFRoZSByb2FkIGN1dHMgdGhyb3VnaCBcIiBcclxuXHRcdFx0XHQrIFwidGFsbCBncmFzcywgYnJ1c2gsIGFuZCB0cmVlcywgbGltaXRpbmcgdmlzaWJpbGl0eSBhbmQgZW5zdXJpbmcgdGhhdCB5b3UnbGwgaGF2ZSBcIiBcclxuXHRcdFx0XHQrIFwidG8gZGVhbCB3aXRoIHNvbWUgbm9uc2Vuc2UuXCIpLFxyXG5cdFx0XHRfKFwiVGhlIGhhaXIgb24gdGhlIGJhY2sgb2YgeW91ciBuZWNrIHByaWNrbGVzIHNsaWdodGx5IGluIGFudGljaXBhdGlvbi5cIilcclxuXHRcdF0pO1xyXG5cclxuXHRcdGZvcih2YXIgaSBpbiB0aGlzLmRlc2NyaXB0aW9uKSB7XHJcblx0XHRcdCQoJzxkaXY+JykudGV4dCh0aGlzLmRlc2NyaXB0aW9uW2ldKS5hcHBlbmRUbyh0aGlzLmRlc2NyaXB0aW9uUGFuZWwpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG4gICAgYXZhaWxhYmxlV2VhdGhlcjoge1xyXG5cdFx0J3N1bm55JzogMC40LFxyXG5cdFx0J2Nsb3VkeSc6IDAuMyxcclxuXHRcdCdyYWlueSc6IDAuM1xyXG5cdH0sXHJcblxyXG4gICAgb25BcnJpdmFsOiBmdW5jdGlvbih0cmFuc2l0aW9uX2RpZmYpIHtcclxuICAgICAgICBSb2FkLnNldFRpdGxlKCk7XHJcblxyXG4gICAgICAgIFdlYXRoZXIuaW5pdGlhdGVXZWF0aGVyKFJvYWQuYXZhaWxhYmxlV2VhdGhlciwgJ3JvYWQnKTtcclxuXHJcblx0XHR0aGlzLnVwZGF0ZURlc2NyaXB0aW9uKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldFRpdGxlOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0aXRsZSA9IF8oXCJSb2FkIHRvIHRoZSBPdXRwb3N0XCIpO1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSB0aGlzKSB7XHJcblx0XHRcdGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XHJcblx0XHR9XHJcblx0XHQkKCdkaXYjbG9jYXRpb25fcm9hZCcpLnRleHQodGl0bGUpO1xyXG5cdH0sXHJcblxyXG4gICAgdXBkYXRlQnV0dG9uOiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIGNvbmRpdGlvbmFscyBmb3IgdXBkYXRpbmcgYnV0dG9uc1xyXG5cdH0sXHJcblxyXG5cdHdhbmRlckV2ZW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy50cmlnZ2VyTG9jYXRpb25FdmVudCgnUm9hZFdhbmRlcicpO1xyXG5cdFx0JFNNLmFkZCgnUm9hZC5jb3VudGVyJywgMSk7XHJcblx0fVxyXG59IiwiLyoqXHJcbiAqIE1vZHVsZSB0aGF0IHJlZ2lzdGVycyB0aGUgc2ltcGxlIHJvb20gZnVuY3Rpb25hbGl0eVxyXG4gKi9cclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4uL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi4vQnV0dG9uXCI7XHJcbmltcG9ydCB7IFdlYXRoZXIgfSBmcm9tIFwiLi4vd2VhdGhlclwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgSGVhZGVyIH0gZnJvbSBcIi4uL2hlYWRlclwiO1xyXG5pbXBvcnQgeyBMaXogfSBmcm9tIFwiLi4vY2hhcmFjdGVycy9saXpcIjtcclxuaW1wb3J0IHsgTWF5b3IgfSBmcm9tIFwiLi4vY2hhcmFjdGVycy9tYXlvclwiO1xyXG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcbmltcG9ydCB7IF90YiB9IGZyb20gXCIuLi8uLi9saWIvdGV4dEJ1aWxkZXJcIjtcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4uL3BsYXllci9jaGFyYWN0ZXJcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBWaWxsYWdlID0ge1xyXG5cclxuXHRidXR0b25zOnt9LFxyXG5cdFxyXG5cdGNoYW5nZWQ6IGZhbHNlLFxyXG5cclxuXHRkZXNjcmlwdGlvbjogW10sXHJcblx0ZGVzY3JpcHRpb25QYW5lbDogbnVsbCxcclxuXHRcclxuXHRuYW1lOiBfKFwiVmlsbGFnZVwiKSxcclxuXHRpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHRcdFxyXG5cdFx0aWYoRW5naW5lLl9kZWJ1Zykge1xyXG5cdFx0XHR0aGlzLl9ST09NX1dBUk1fREVMQVkgPSA1MDAwO1xyXG5cdFx0XHR0aGlzLl9CVUlMREVSX1NUQVRFX0RFTEFZID0gNTAwMDtcclxuXHRcdFx0dGhpcy5fU1RPS0VfQ09PTERPV04gPSAwO1xyXG5cdFx0XHR0aGlzLl9ORUVEX1dPT0RfREVMQVkgPSA1MDAwO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBDcmVhdGUgdGhlIFZpbGxhZ2UgdGFiXHJcblx0XHR0aGlzLnRhYiA9IEhlYWRlci5hZGRMb2NhdGlvbihfKFwiQSBDaGlsbCBWaWxsYWdlXCIpLCBcInZpbGxhZ2VcIiwgVmlsbGFnZSk7XHJcblx0XHRcclxuXHRcdC8vIENyZWF0ZSB0aGUgVmlsbGFnZSBwYW5lbFxyXG5cdFx0dGhpcy5wYW5lbCA9ICQoJzxkaXY+JylcclxuXHRcdFx0LmF0dHIoJ2lkJywgXCJ2aWxsYWdlUGFuZWxcIilcclxuXHRcdFx0LmFkZENsYXNzKCdsb2NhdGlvbicpXHJcblx0XHRcdC5hcHBlbmRUbygnZGl2I2xvY2F0aW9uU2xpZGVyJyk7XHJcblxyXG5cdFx0dGhpcy5kZXNjcmlwdGlvblBhbmVsID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdkZXNjcmlwdGlvbicpLmFwcGVuZFRvKHRoaXMucGFuZWwpO1xyXG5cdFx0dGhpcy51cGRhdGVEZXNjcmlwdGlvbigpO1xyXG5cclxuXHRcdEVuZ2luZS51cGRhdGVTbGlkZXIoKTtcclxuXHJcblx0XHRCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6ICd0YWxrQnV0dG9uJyxcclxuXHRcdFx0dGV4dDogXygnVGFsayB0byB0aGUgTWF5b3InKSxcclxuXHRcdFx0Y2xpY2s6IE1heW9yLnRhbGtUb01heW9yLFxyXG5cdFx0XHR3aWR0aDogJzgwcHgnLFxyXG5cdFx0XHRjb3N0OiB7fVxyXG5cdFx0fSlcclxuXHRcdC5hZGRDbGFzcygnbG9jYXRpb25CdXR0b24nKVxyXG5cdFx0LmFwcGVuZFRvKCdkaXYjdmlsbGFnZVBhbmVsJyk7XHJcblxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAnbGl6QnV0dG9uJyxcclxuXHRcdFx0dGV4dDogXygnVGFsayB0byBMaXonKSxcclxuXHRcdFx0Y2xpY2s6IExpei50YWxrVG9MaXosXHJcblx0XHRcdHdpZHRoOiAnODBweCcsXHJcblx0XHRcdGNvc3Q6IHt9XHJcblx0XHR9KVxyXG5cdFx0LmFkZENsYXNzKCdsb2NhdGlvbkJ1dHRvbicpXHJcblx0XHQuYXBwZW5kVG8oJ2RpdiN2aWxsYWdlUGFuZWwnKTtcclxuXHJcblx0XHRCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6ICduZXdCdWlsZGluZ0J1dHRvbicsXHJcblx0XHRcdHRleHQ6IF8oJ0NoZWNrIG91dCB0aGUgbmV3IGJ1aWxkaW5nJyksXHJcblx0XHRcdGNsaWNrOiBWaWxsYWdlLnRlbXBCdWlsZGluZ01lc3NhZ2UsXHJcblx0XHRcdHdpZHRoOiAnODBweCcsXHJcblx0XHRcdGNvc3Q6IHt9XHJcblx0XHR9KVxyXG5cdFx0LmFkZENsYXNzKCdsb2NhdGlvbkJ1dHRvbicpXHJcblx0XHQuYXBwZW5kVG8oJ2RpdiN2aWxsYWdlUGFuZWwnKTtcclxuXHJcblx0XHR2YXIgYnVpbGRpbmdCdXR0b24gPSAkKCcjbmV3QnVpbGRpbmdCdXR0b24uYnV0dG9uJyk7XHJcblx0XHRidWlsZGluZ0J1dHRvbi5oaWRlKCk7XHJcblxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAnc3RvcmVCdXR0b24nLFxyXG5cdFx0XHR0ZXh0OiBfKCdHbyB0byB0aGUgU3RvcmUnKSxcclxuXHRcdFx0Y2xpY2s6IFZpbGxhZ2Uub3BlblN0b3JlLFxyXG5cdFx0XHR3aWR0aDogJzgwcHgnLFxyXG5cdFx0XHRjb3N0OiB7fVxyXG5cdFx0fSlcclxuXHRcdC5hZGRDbGFzcygnbG9jYXRpb25CdXR0b24nKVxyXG5cdFx0LmFwcGVuZFRvKCdkaXYjdmlsbGFnZVBhbmVsJyk7XHJcblxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAnZGljZUJ1dHRvbicsXHJcblx0XHRcdHRleHQ6IF8oJ1BsYXkgYSBHYW1lJyksXHJcblx0XHRcdGNsaWNrOiBWaWxsYWdlLnBsYXlEaWNlR2FtZSxcclxuXHRcdFx0d2lkdGg6ICc4MHB4JyxcclxuXHRcdFx0Y29zdDoge31cclxuXHRcdH0pXHJcblx0XHQuYWRkQ2xhc3MoJ2xvY2F0aW9uQnV0dG9uJylcclxuXHRcdC5hcHBlbmRUbygnZGl2I3ZpbGxhZ2VQYW5lbCcpO1xyXG5cclxuXHRcdHZhciBzdG9yZUJ1dHRvbiA9ICQoJyNzdG9yZUJ1dHRvbi5idXR0b24nKTtcclxuXHRcdHN0b3JlQnV0dG9uLmhpZGUoKTtcclxuXHJcblx0XHR2YXIgbGl6QnV0dG9uID0gJCgnI2xpekJ1dHRvbi5idXR0b24nKTtcclxuXHRcdGxpekJ1dHRvbi5oaWRlKCk7XHJcblx0XHRcclxuXHRcdC8vIENyZWF0ZSB0aGUgc3RvcmVzIGNvbnRhaW5lclxyXG5cdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdzdG9yZXNDb250YWluZXInKS5hcHBlbmRUbygnZGl2I3ZpbGxhZ2VQYW5lbCcpO1xyXG5cdFx0XHJcblx0XHQvL3N1YnNjcmliZSB0byBzdGF0ZVVwZGF0ZXNcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdCQuRGlzcGF0Y2goJ3N0YXRlVXBkYXRlJykuc3Vic2NyaWJlKFZpbGxhZ2UuaGFuZGxlU3RhdGVVcGRhdGVzKTtcclxuXHRcdFxyXG5cdFx0VmlsbGFnZS51cGRhdGVCdXR0b24oKTtcclxuXHR9LFxyXG5cclxuXHR1cGRhdGVEZXNjcmlwdGlvbjogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLmRlc2NyaXB0aW9uUGFuZWwuZW1wdHkoKTtcclxuXHRcdHRoaXMuZGVzY3JpcHRpb24gPSBfdGIoW1xyXG5cdFx0XHRfKFwiTmVzdGxlZCBpbiB0aGUgd29vZHMsIHRoaXMgdmlsbGFnZSBpcyBzY2FyY2VseSBtb3JlIHRoYW4gYSBoYW1sZXQsIFwiIFxyXG5cdFx0XHRcdCsgXCJkZXNwaXRlIHlvdSB0aGlua2luZyB0aG9zZSB0d28gd29yZHMgYXJlIHN5bm9ueW1zLiBUaGV5J3JlIG5vdCwgXCIgXHJcblx0XHRcdFx0KyBcImdvIGdvb2dsZSAnaGFtbGV0JyByaWdodCBub3cgaWYgeW91IGRvbid0IGJlbGlldmUgbWUuXCIpLFxyXG5cdFx0XHRfKFwiVGhlIHZpbGxhZ2UgaXMgcXVpZXQgYXQgdGhlIG1vbWVudDsgdGhlcmUgYXJlbid0IGVub3VnaCBoYW5kcyBmb3IgYW55b25lIHRvIHJlbWFpbiBpZGxlIGZvciBsb25nLlwiKSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHRleHQ6IF8oXCJBIHN0b3JlZnJvbnQsIHN0YWZmZWQgZW50aXJlbHkgYnkgYSBzaW5nbGUgZ3Jpbm5pbmcgamFja2Fzcywgc3RhbmRzIHByb3VkbHkgaW4gdGhlIG1haW4gc3F1YXJlLlwiKSxcclxuXHRcdFx0XHRpc1Zpc2libGU6ICgpID0+IHtcclxuXHRcdFx0XHRcdHJldHVybiAkU00uZ2V0KCdSb2FkLmdvdEFwb2xvZ2l6ZWQnKSAhPT0gdW5kZWZpbmVkO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XSk7XHJcblxyXG5cdFx0Zm9yKHZhciBpIGluIHRoaXMuZGVzY3JpcHRpb24pIHtcclxuXHRcdFx0JCgnPGRpdj4nKS50ZXh0KHRoaXMuZGVzY3JpcHRpb25baV0pLmFwcGVuZFRvKHRoaXMuZGVzY3JpcHRpb25QYW5lbCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRvcHRpb25zOiB7fSwgLy8gTm90aGluZyBmb3Igbm93XHJcblxyXG5cdGF2YWlsYWJsZVdlYXRoZXI6IHtcclxuXHRcdCdzdW5ueSc6IDAuNCxcclxuXHRcdCdjbG91ZHknOiAwLjMsXHJcblx0XHQncmFpbnknOiAwLjNcclxuXHR9LFxyXG5cdFxyXG5cdG9uQXJyaXZhbDogZnVuY3Rpb24odHJhbnNpdGlvbl9kaWZmKSB7XHJcblx0XHRWaWxsYWdlLnNldFRpdGxlKCk7XHJcblxyXG5cdFx0dGhpcy51cGRhdGVEZXNjcmlwdGlvbigpO1xyXG5cclxuXHRcdFdlYXRoZXIuaW5pdGlhdGVXZWF0aGVyKFZpbGxhZ2UuYXZhaWxhYmxlV2VhdGhlciwgJ3ZpbGxhZ2UnKTtcclxuXHR9LFxyXG5cdFxyXG5cdHNldFRpdGxlOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0aXRsZSA9IF8oXCJUaGUgVmlsbGFnZVwiKTtcclxuXHRcdGlmKEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gdGhpcykge1xyXG5cdFx0XHRkb2N1bWVudC50aXRsZSA9IHRpdGxlO1xyXG5cdFx0fVxyXG5cdFx0JCgnZGl2I2xvY2F0aW9uX3ZpbGxhZ2UnKS50ZXh0KHRpdGxlKTtcclxuXHR9LFxyXG5cdFxyXG5cdHVwZGF0ZUJ1dHRvbjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgbGl6QnV0dG9uID0gJCgnI2xpekJ1dHRvbi5idXR0b24nKTtcclxuXHRcdGlmKCRTTS5nZXQoJ3ZpbGxhZ2UubGl6QWN0aXZlJykgIT09IHVuZGVmaW5lZCkgbGl6QnV0dG9uLnNob3coKTtcclxuXHRcdHZhciBidWlsZGluZ0J1dHRvbiA9ICQoJyNuZXdCdWlsZGluZ0J1dHRvbi5idXR0b24nKTtcclxuXHRcdGlmKCRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnKSAhPT0gdW5kZWZpbmVkKSBidWlsZGluZ0J1dHRvbi5zaG93KCk7XHJcblx0XHR2YXIgc3RvcmVCdXR0b24gPSAkKCcjc3RvcmVCdXR0b24uYnV0dG9uJyk7XHJcblx0XHRpZigkU00uZ2V0KCdSb2FkLmdvdEFwb2xvZ2l6ZWQnKSAhPT0gdW5kZWZpbmVkKSBzdG9yZUJ1dHRvbi5zaG93KCk7XHJcblx0fSxcclxuXHRcclxuXHRcclxuXHRoYW5kbGVTdGF0ZVVwZGF0ZXM6IGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYoZS5jYXRlZ29yeSA9PSAnc3RvcmVzJyl7XHJcblx0XHRcdC8vIFZpbGxhZ2UudXBkYXRlQnVpbGRCdXR0b25zKCk7XHJcblx0XHR9IGVsc2UgaWYoZS5jYXRlZ29yeSA9PSAnaW5jb21lJyl7XHJcblx0XHR9IGVsc2UgaWYoZS5zdGF0ZU5hbWUuaW5kZXhPZignZ2FtZS5idWlsZGluZ3MnKSA9PT0gMCl7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0dGVtcEJ1aWxkaW5nTWVzc2FnZTogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdBIE5ldyBCdWlsZGluZycpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdUaGlzIGlzIGEgbmV3IGJ1aWxkaW5nLiBUaGVyZSBzaG91bGQgYmUgc3R1ZmYgaW4gaXQsIGJ1dCB0aGlzIGlzIGEgcGxhY2Vob2xkZXIgZm9yIG5vdy4nKSxcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdsZWF2ZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdMYW1lJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRvcGVuU3RvcmU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnVGhlIFN0b3JlJyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oXCJUaGlzIGlzIHRoZSBzdG9yZS4gVGhlcmUncyBub3RoaW5nIGhlcmUgeWV0LCB0aG91Z2guXCIpLFxyXG5cdFx0XHRcdFx0XHRfKFwiWW91IGZpbmQgYSBkdXN0eSBwYWlyIG9mIGRpY2UgaW4gdGhlIGNvcm5lciBhbmQgdGhyb3cgdGhlbSwganVzdCB0byBzZWUgd2hhdCBoYXBwZW5zLlwiKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGRpY2U6IHtcclxuXHRcdFx0XHRcdFx0YW1vdW50OiAyLFxyXG5cdFx0XHRcdFx0XHRkaWVGYWNlczoge1xyXG5cdFx0XHRcdFx0XHRcdDE6ICdza3VsbCdcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0aGFuZGxlcjogKHZhbHMpID0+IHtcclxuXHRcdFx0XHRcdFx0XHRjb25zdCByZXR1cm5UZXh0ID0gW107XHJcblx0XHRcdFx0XHRcdFx0aWYgKCh2YWxzWzBdID09IHZhbHNbMV0pICYmIHZhbHNbMF0gPT0gMSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuVGV4dC5wdXNoKFwiU25ha2UgZXllcyEgSSBmZWVsIGEgbWlsZCBzZW5zZSBvZiBkcmVhZC5cIik7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICh2YWxzWzBdID09IHZhbHNbMV0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVyblRleHQucHVzaChcIldvdywgZG91Ymxlcy4gVGhhdCBzZWVtcyBsdWNreS5cIik7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICgodmFsc1swXSArIHZhbHNbMV0pID09IDcpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVyblRleHQucHVzaChcIk9oLCBuaWNlLiBEbyBJIHdpbiBzb21ldGhpbmc/XCIpO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm5UZXh0LnB1c2goXCJJIHJvbGxlZCBhIFwiICsgKHZhbHNbMF0gKyB2YWxzWzFdKS50b1N0cmluZygpICsgXCIuIFRoYXQgZG9lc24ndCBzZWVtIGVzcGVjaWFsbHkgbm90ZXdvcnRoeS5cIik7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdHJldHVybiByZXR1cm5UZXh0O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0YnV0dG9uczogIHtcclxuXHRcdFx0XHRcdFx0cm9sbDoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ1JvbGwgXFwnZW0gYWdhaW4nKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnc3RhcnQnfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRsZWF2ZToge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0xhbWUnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdHBsYXlEaWNlR2FtZTogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdBIEdhbWUgb2YgQ2hhbmNlJyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1lvdSB3YWxrIGludG8gYSBzaGFkeSBhbGxleSwgYW5kIGEgbWFuIGluIGEgd2lkZS1icmltbWVkIGhhdCBnZXN0dXJlcyB0byB5b3Ugd2l0aCBkaWNlIGluIGhpcyBoYW5kLicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIkhleSwgYnVkZHksIHdhbm5hIHBsYXkgYSBnYW1lPyBUaGVyZVxcJ3MgYSBwcml6ZSBpZiB5b3Ugd2luIVwiJyksXHJcblx0XHRcdFx0XHRcdF8oJ1doYXQgZG8geW91IGRvPycpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQncGxheSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdJIGxpa2UgcHJpemVzJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2dhbWVTdGFydCd9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdsZWF2ZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdObyB0aGFua3MnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdnYW1lU3RhcnQnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1RoZSBtYW4gcmV2ZWFscyBhIHRvb3RoeSBncmluIGFuZCBiZWdpbnMgdG8gZXhwbGFpbiB0aGUgcnVsZXMuJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiSXRcXCdzIHZlcnkgc2ltcGxlLCB5b3UganVzdCBjaG9vc2Ugd2hldGhlciB5b3Ugd2FudCB0byB0cnkgdG8gcm9sbCAnXHJcblx0XHRcdFx0XHRcdFx0ICsgJ2hpZ2hlciBvciBsb3dlciB0aGFuIG1lLCBhbmQgdGhlbiBJIHJvbGwsIGFuZCB0aGVuIHlvdSByb2xsLiAnIFxyXG5cdFx0XHRcdFx0XHRcdCArICdJZiB5b3UgY2FsbCBpdCByaWdodCwgeW91IHdpbi5cIicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIlNvLCB3aGF0XFwnbGwgaXQgYmU/JylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdoaWdoJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0hpZ2gnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnaGVSb2xscyd9LFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiAoKSA9PiAkU00uc2V0KCdkaWNlR2FtZS5oaWdoJywgMSlcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2xvdyc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdMb3cnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnaGVSb2xscyd9LFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiAoKSA9PiAkU00uc2V0KCdkaWNlR2FtZS5sb3cnLCAxKVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnaGVSb2xscyc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnVGhlIG1hbnMgaGF0IHRpcHMgbG93IGFzIGhlIGRyb3BzIHRoZSBkaWNlIHRvIHRoZSBncm91bmQuJyksXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0ZGljZToge1xyXG5cdFx0XHRcdFx0XHRhbW91bnQ6IDIsXHJcblx0XHRcdFx0XHRcdGhhbmRsZXI6ICh2YWxzKSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0Y29uc3QgcmV0dXJuVGV4dCA9IFtdO1xyXG5cdFx0XHRcdFx0XHRcdGxldCBkaWNlVmFsID0gMDtcclxuXHRcdFx0XHRcdFx0XHRmb3IgKHZhciBpIGluIHZhbHMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGRpY2VWYWwgKz0gdmFsc1tpXVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0JFNNLnNldCgnZGljZUdhbWUuaGlzUm9sbCcsIGRpY2VWYWwpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAoKCRTTS5nZXQoJ2RpY2VHYW1lLmhpZ2gnKSAhPT0gdW5kZWZpbmVkKSAmJiBkaWNlVmFsIDwgNSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuVGV4dC5wdXNoKF8oJ1RoZSBzdHJhbmdlciBncmltYWNlcy4nKSk7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICgoJFNNLmdldCgnZGljZUdhbWUuaGlnaCcpICE9PSB1bmRlZmluZWQpICYmIGRpY2VWYWwgPiA4KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm5UZXh0LnB1c2goXygnVGhlIHN0cmFuZ2VyIGdyaW5zIHdpY2tlZGx5LicpKTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCgkU00uZ2V0KCdkaWNlR2FtZS5sb3cnKSAhPT0gdW5kZWZpbmVkKSAmJiBkaWNlVmFsID4gOCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuVGV4dC5wdXNoKF8oJ1RoZSBzdHJhbmdlciBncmltYWNlcy4nKSk7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICgoJFNNLmdldCgnZGljZUdhbWUubG93JykgIT09IHVuZGVmaW5lZCkgJiYgZGljZVZhbCA8IDUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVyblRleHQucHVzaChfKCdUaGUgc3RyYW5nZXIgZ3JpbnMgd2lja2VkbHkuJykpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuVGV4dC5wdXNoKF8oJ0hlIHBpY2tzIHVwIHRoZSBkaWNlIGFuZCBob2xkcyB0aGVtIG91dCB0byB5b3UuJykpXHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuVGV4dC5wdXNoKF8oJ1wiWW91ciByb2xsLlwiJykpXHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJldHVyblRleHQ7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdva2F5Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ1JvbGwgXFwnZW0nKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAneW91Um9sbCd9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCd5b3VSb2xsJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdZb3UgYnJpZWZseSBqb3N0bGUgdGhlIGRpY2UsIHRoZW4gbGV0IHRoZW0gZmFsbCB3aGVyZSB0aGV5IG1heS4nKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGRpY2U6IHtcclxuXHRcdFx0XHRcdFx0YW1vdW50OiAyLFxyXG5cdFx0XHRcdFx0XHRoYW5kbGVyOiAodmFscykgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdGNvbnN0IHJldHVyblRleHQgPSBbXTtcclxuXHJcblx0XHRcdFx0XHRcdFx0bGV0IGRpY2VWYWwgPSAwO1xyXG5cdFx0XHRcdFx0XHRcdGZvciAodmFyIGkgaW4gdmFscykge1xyXG5cdFx0XHRcdFx0XHRcdFx0ZGljZVZhbCArPSB2YWxzW2ldXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAoJFNNLmdldCgnZGljZUdhbWUuaGlnaCcpICYmIGRpY2VWYWwgPCAoJFNNLmdldCgnZGljZUdhbWUuaGlzUm9sbCcpIGFzIG51bWJlcikpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVyblRleHQucHVzaCgnWW91ciBmZWVsIGEgcnVzaCBvZiBkaXNhcHBvaW50bWVudC4nKTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCRTTS5nZXQoJ2RpY2VHYW1lLmhpZ2gnKSAmJiBkaWNlVmFsID4gKCRTTS5nZXQoJ2RpY2VHYW1lLmhpc1JvbGwnKSBhcyBudW1iZXIpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm5UZXh0LnB1c2goJ1lvdXIgZmVlbCBhIHJ1c2ggb2YgZXhjaXRlbWVudC4nKTtcclxuXHRcdFx0XHRcdFx0XHRcdCRTTS5zZXQoJ2RpY2VHYW1lLndpbicsIDEpO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoJFNNLmdldCgnZGljZUdhbWUubG93JykgJiYgZGljZVZhbCA+ICgkU00uZ2V0KCdkaWNlR2FtZS5oaXNSb2xsJykgYXMgbnVtYmVyKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuVGV4dC5wdXNoKCdZb3VyIGZlZWwgYSBydXNoIG9mIGRpc2FwcG9pbnRtZW50LicpO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoJFNNLmdldCgnZGljZUdhbWUubG93JykgJiYgZGljZVZhbCA8ICgkU00uZ2V0KCdkaWNlR2FtZS5oaXNSb2xsJykgYXMgbnVtYmVyKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuVGV4dC5wdXNoKCdZb3VyIGZlZWwgYSBydXNoIG9mIGV4Y2l0ZW1lbnQuJyk7XHJcblx0XHRcdFx0XHRcdFx0XHQkU00uc2V0KCdkaWNlR2FtZS53aW4nLCAxKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdHJldHVybiByZXR1cm5UZXh0O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQncmVzdWx0cyc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiAoKSA9PiAoJFNNLmdldCgnZGljZUdhbWUud2luJykgIT09IHVuZGVmaW5lZCkgPyBfKCdPaCwgbmljZScpIDogXygnQXd3LCBzaG9vdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdyZXN1bHRzJ31cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J3Jlc3VsdHMnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiAoKSA9PiAoJFNNLmdldCgnZGljZUdhbWUud2luJykgIT09IHVuZGVmaW5lZCkgPyBbXHJcblx0XHRcdFx0XHRcdF8oJ1RoZSBnYW1ibGVyIGN1cnNlcyB1bmRlciBoaXMgYnJlYXRoLCB0aGVuIGhhbmRzIHlvdSBzb21ldGhpbmcgYW5kIHF1aWNrbHkgd2Fsa3MgYXdheS4nKVxyXG5cdFx0XHRcdFx0XTogW18oJ1RoZSBnYW1ibGVyXFwncyBmYWNlIHNwbGl0cyBpbnRvIGEgd2lkZSBncmluIGJlZm9yZSBkaXNhcHBlYXJpbmcgYmVuZWF0aCB0aGUgYnJpbS4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJCZXR0ZXIgbHVjayBuZXh0IHRpbWUgc3RyYW5nZXIuXCInKSxcclxuXHRcdFx0XHRcdFx0XygnSGUgc2lua3MgYmFjayBpbnRvIHRoZSBzaGFkb3dzIG9mIHRoZSBhbGxleSwgYW5kIGhpcyB3b3JkcyByZXZlcmJlcmF0ZSBvZmYgb2YgdGhlIHBhcmFsbGVsIHdhbGxzIGxvbmcgYWZ0ZXIgeW91IGxvc2Ugc2lnaHQgb2YgaGltLicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0b25Mb2FkOiAoKSA9PiB7XHJcblx0XHRcdFx0XHRcdGlmICgkU00uZ2V0KCdkaWNlR2FtZS53aW4nKSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHRcdFx0Q2hhcmFjdGVyLmFkZFRvSW52ZW50b3J5KCdnYW1ibGVyLlByaXplJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdva2F5Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ1RoYXQgd2FzIGZ1biwgSSBndWVzcycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6ICgpID0+ICRTTS5yZW1vdmUoJ2RpY2VHYW1lJylcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uL0J1dHRvblwiO1xyXG5pbXBvcnQgeyBJdGVtTGlzdCB9IGZyb20gXCIuL2l0ZW1MaXN0XCI7XHJcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgTm90aWZpY2F0aW9ucyB9IGZyb20gXCIuLi9ub3RpZmljYXRpb25zXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyBRdWVzdExvZyB9IGZyb20gXCIuL3F1ZXN0TG9nXCI7XHJcbmltcG9ydCB7IFBlcmtMaXN0IH0gZnJvbSBcIi4vcGVya0xpc3RcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBDaGFyYWN0ZXIgPSB7XHJcblx0aW52ZW50b3J5OiB7fSwgLy8gZGljdGlvbmFyeSB1c2luZyBpdGVtIG5hbWUgYXMga2V5XHJcblx0cXVlc3RTdGF0dXM6IHt9LCAvLyBkaWN0aW9uYXJ5IHVzaW5nIHF1ZXN0IG5hbWUgYXMga2V5LCBhbmQgaW50ZWdlciBxdWVzdCBwaGFzZSBhcyB2YWx1ZVxyXG5cdGVxdWlwcGVkSXRlbXM6IHtcclxuXHRcdC8vIHN0ZWFsaW5nIHRoZSBLb0wgc3R5bGUgZm9yIG5vdywgd2UnbGwgc2VlIGlmIEkgbmVlZCBzb21ldGhpbmdcclxuXHRcdC8vIHRoYXQgZml0cyB0aGUgZ2FtZSBiZXR0ZXIgYXMgd2UgZ29cclxuXHRcdGhlYWQ6IG51bGwsXHJcblx0XHR0b3JzbzogbnVsbCxcclxuXHRcdHBhbnRzOiBudWxsLFxyXG5cdFx0Ly8gbm8gd2VhcG9uLCB0cnkgdG8gc2VlIGhvdyBmYXIgd2UgY2FuIGdldCBpbiB0aGlzIGdhbWUgd2l0aG91dCBmb2N1c2luZyBvbiBjb21iYXRcclxuXHRcdGFjY2Vzc29yeTE6IG51bGwsXHJcblx0XHRhY2Nlc3NvcnkyOiBudWxsLFxyXG5cdFx0YWNjZXNzb3J5MzogbnVsbCxcclxuXHR9LFxyXG5cclxuXHQvLyBzdGF0cyBiZWZvcmUgYW55IG1vZGlmaWVycyBmcm9tIGdlYXIgb3Igd2hhdGV2ZXIgZWxzZSBhcmUgYXBwbGllZFxyXG5cdHJhd1N0YXRzOiB7XHJcblx0XHQnU3BlZWQnOiA1LFxyXG5cdFx0J1BlcmNlcHRpb24nOiA1LFxyXG5cdFx0J1Jlc2lsaWVuY2UnOiA1LFxyXG5cdFx0J0luZ2VudWl0eSc6IDUsXHJcblx0XHQnVG91Z2huZXNzJzogNVxyXG5cdH0sXHJcblxyXG5cdC8vIHBlcmtzIGdpdmVuIGJ5IGl0ZW1zLCBjaGFyYWN0ZXIgY2hvaWNlcywgZGl2aW5lIHByb3ZlbmFuY2UsIGV0Yy5cclxuXHRwZXJrczogeyB9LFxyXG5cdHBlcmtBcmVhOiBudWxsLFxyXG5cdFxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdFx0XHJcblx0XHQvLyBjcmVhdGUgdGhlIGNoYXJhY3RlciBib3hcclxuXHRcdGNvbnN0IGVsZW0gPSAkKCc8ZGl2PicpLmF0dHIoe1xyXG5cdFx0XHRpZDogJ2NoYXJhY3RlcicsXHJcblx0XHRcdGNsYXNzTmFtZTogJ2NoYXJhY3RlcidcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHRlbGVtLmFwcGVuZFRvKCdkaXYjd3JhcHBlcicpO1xyXG5cclxuXHRcdC8vIHdyaXRlIHJhd1N0YXRzIHRvICRTTVxyXG5cdFx0Ly8gTk9URTogbmV2ZXIgd3JpdGUgZGVyaXZlZCBzdGF0cyB0byAkU00sIGFuZCBuZXZlciBhY2Nlc3MgcmF3IHN0YXRzIGRpcmVjdGx5IVxyXG5cdFx0Ly8gZG9pbmcgc28gd2lsbCBpbnRyb2R1Y2Ugb3Bwb3J0dW5pdGllcyB0byBtZXNzIHVwIHN0YXRzIFBFUk1BTkVOVExZXHJcbiAgICAgICAgaWYgKCEkU00uZ2V0KCdjaGFyYWN0ZXIucmF3c3RhdHMnKSkge1xyXG4gICAgICAgICAgICAkU00uc2V0KCdjaGFyYWN0ZXIucmF3c3RhdHMnLCBDaGFyYWN0ZXIucmF3U3RhdHMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5yYXdTdGF0cyA9ICRTTS5nZXQoJ2NoYXJhY3Rlci5yYXdTdGF0cycpIGFzIGFueTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoISRTTS5nZXQoJ2NoYXJhY3Rlci5wZXJrcycpKSB7XHJcbiAgICAgICAgICAgICRTTS5zZXQoJ2NoYXJhY3Rlci5wZXJrcycsIENoYXJhY3Rlci5wZXJrcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHRcdFx0Q2hhcmFjdGVyLnBlcmtzID0gJFNNLmdldCgnY2hhcmFjdGVyLnBlcmtzJykgYXMgYW55O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghJFNNLmdldCgnY2hhcmFjdGVyLmludmVudG9yeScpKSB7XHJcbiAgICAgICAgICAgICRTTS5zZXQoJ2NoYXJhY3Rlci5pbnZlbnRvcnknLCBDaGFyYWN0ZXIuaW52ZW50b3J5KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cdFx0XHRDaGFyYWN0ZXIuaW52ZW50b3J5ID0gJFNNLmdldCgnY2hhcmFjdGVyLmludmVudG9yeScpIGFzIGFueTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoISRTTS5nZXQoJ2NoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zJykpIHtcclxuICAgICAgICAgICAgJFNNLnNldCgnY2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMnLCBDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHRcdFx0Q2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMgPSAkU00uZ2V0KCdjaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcycpIGFzIGFueTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoISRTTS5nZXQoJ2NoYXJhY3Rlci5xdWVzdFN0YXR1cycpKSB7XHJcbiAgICAgICAgICAgICRTTS5zZXQoJ2NoYXJhY3Rlci5xdWVzdFN0YXR1cycsIENoYXJhY3Rlci5xdWVzdFN0YXR1cyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHRcdFx0Q2hhcmFjdGVyLnF1ZXN0U3RhdHVzID0gJFNNLmdldCgnY2hhcmFjdGVyLnF1ZXN0U3RhdHVzJykgYXMgYW55O1xyXG5cdFx0fVxyXG5cclxuICAgICAgICAkKCc8ZGl2PicpLnRleHQoJ0NoYXJhY3RlcicpXHJcblx0XHQuY3NzKCd0ZXh0LWRlY29yYXRpb24nLCAndW5kZXJsaW5lJylcclxuXHRcdC5hdHRyKCdpZCcsICd0aXRsZScpXHJcblx0XHQuYXBwZW5kVG8oJ2RpdiNjaGFyYWN0ZXInKTtcclxuXHJcblx0XHQvLyBUT0RPOiByZXBsYWNlIHRoaXMgd2l0aCBkZXJpdmVkIHN0YXRzXHJcbiAgICAgICAgZm9yKHZhciBzdGF0IGluICRTTS5nZXQoJ2NoYXJhY3Rlci5yYXdzdGF0cycpIGFzIGFueSkge1xyXG4gICAgICAgICAgICAkKCc8ZGl2PicpLnRleHQoc3RhdCArICc6ICcgKyAkU00uZ2V0KCdjaGFyYWN0ZXIucmF3c3RhdHMuJyArIHN0YXQpKS5hcHBlbmRUbygnZGl2I2NoYXJhY3RlcicpO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2J1dHRvbnMnKS5jc3MoXCJtYXJnaW4tdG9wXCIsIFwiMjBweFwiKS5hcHBlbmRUbygnZGl2I2NoYXJhY3RlcicpO1xyXG5cdFx0dmFyIGludmVudG9yeUJ1dHRvbiA9IEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogXCJpbnZlbnRvcnlcIixcclxuXHRcdFx0dGV4dDogXCJJbnZlbnRvcnlcIixcclxuXHRcdFx0Y2xpY2s6IENoYXJhY3Rlci5vcGVuSW52ZW50b3J5XHJcblx0XHR9KS5hcHBlbmRUbygkKCcjYnV0dG9ucycsICdkaXYjY2hhcmFjdGVyJykpO1xyXG5cdFx0XHJcblx0XHR2YXIgcXVlc3RMb2dCdXR0b24gPSBCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6IFwicXVlc3RMb2dcIixcclxuXHRcdFx0dGV4dDogXCJRdWVzdCBMb2dcIixcclxuXHRcdFx0Y2xpY2s6IENoYXJhY3Rlci5vcGVuUXVlc3RMb2dcclxuXHRcdH0pLmFwcGVuZFRvKCQoJyNidXR0b25zJywgJ2RpdiNjaGFyYWN0ZXInKSk7XHJcblxyXG5cdFx0dGhpcy5wZXJrQXJlYSA9ICQoJzxkaXY+JykuYXR0cih7XHJcblx0XHRcdGlkOiAncGVya3MnLFxyXG5cdFx0XHRjbGFzc05hbWU6ICdwZXJrcydcclxuXHRcdFx0fSkuYXBwZW5kVG8oJ2RpdiNjaGFyYWN0ZXInKTtcclxuXHJcblx0XHQvLyBUT0RPOiBhZGQgUGVya3MgbGlzdCBiZWxvdyBoZXJlXHJcblx0XHR0aGlzLnVwZGF0ZVBlcmtzKCk7XHJcblxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0d2luZG93LkNoYXJhY3RlciA9IHRoaXM7XHJcblx0fSxcclxuXHRcclxuXHRvcHRpb25zOiB7fSwgLy8gTm90aGluZyBmb3Igbm93XHJcblx0XHJcblx0ZWxlbTogbnVsbCxcclxuXHJcblx0aW52ZW50b3J5RGlzcGxheTogbnVsbCBhcyBhbnksXHJcblx0cXVlc3RMb2dEaXNwbGF5OiBudWxsIGFzIGFueSxcclxuXHJcblx0b3BlbkludmVudG9yeTogZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBjcmVhdGluZyBhIGhhbmRsZSBmb3IgbGF0ZXIgYWNjZXNzLCBzdWNoIGFzIGNsb3NpbmcgaW52ZW50b3J5XHJcblx0XHRDaGFyYWN0ZXIuaW52ZW50b3J5RGlzcGxheSA9ICQoJzxkaXY+JykuYXR0cignaWQnLCAnaW52ZW50b3J5JykuYWRkQ2xhc3MoJ2V2ZW50UGFuZWwnKS5jc3MoJ29wYWNpdHknLCAnMCcpO1xyXG5cdFx0dmFyIGludmVudG9yeURpc3BsYXkgPSBDaGFyYWN0ZXIuaW52ZW50b3J5RGlzcGxheTtcclxuXHRcdENoYXJhY3Rlci5pbnZlbnRvcnlEaXNwbGF5XHJcblx0XHQvLyBzZXQgdXAgY2xpY2sgYW5kIGhvdmVyIGhhbmRsZXJzIGZvciBpbnZlbnRvcnkgaXRlbXNcclxuXHRcdC5vbihcImNsaWNrXCIsIFwiI2l0ZW1cIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdENoYXJhY3Rlci51c2VJbnZlbnRvcnlJdGVtKCQodGhpcykuZGF0YShcIm5hbWVcIikpO1xyXG5cdFx0XHRDaGFyYWN0ZXIuY2xvc2VJbnZlbnRvcnkoKTtcclxuXHRcdH0pLm9uKFwibW91c2VlbnRlclwiLCBcIiNpdGVtXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgdG9vbHRpcCA9ICQoXCI8ZGl2IGlkPSd0b29sdGlwJyBjbGFzcz0ndG9vbHRpcCc+XCIgKyBJdGVtTGlzdFskKHRoaXMpLmRhdGEoXCJuYW1lXCIpXS50ZXh0ICsgXCI8L2Rpdj5cIilcclxuXHRcdFx0LmF0dHIoJ2RhdGEtbmFtZScsIGl0ZW0pO1xyXG5cdFx0XHR0b29sdGlwLmFwcGVuZFRvKCQodGhpcykpO1xyXG5cdFx0fSkub24oXCJtb3VzZWxlYXZlXCIsIFwiI2l0ZW1cIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQoXCIjdG9vbHRpcFwiLCBcIiNcIiArICQodGhpcykuZGF0YShcIm5hbWVcIikpLmZhZGVPdXQoKS5yZW1vdmUoKTtcclxuXHRcdH0pO1xyXG5cdFx0JCgnPGRpdj4nKS5hZGRDbGFzcygnZXZlbnRUaXRsZScpLnRleHQoJ0ludmVudG9yeScpLmFwcGVuZFRvKGludmVudG9yeURpc3BsYXkpO1xyXG5cdFx0dmFyIGludmVudG9yeURlc2MgPSAkKCc8ZGl2PicpLnRleHQoXCJDbGljayB0aGluZ3MgaW4gdGhlIGxpc3QgdG8gdXNlIHRoZW0uXCIpXHJcblx0XHRcdC5ob3ZlcihmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgdG9vbHRpcCA9ICQoXCI8ZGl2IGlkPSd0b29sdGlwJyBjbGFzcz0ndG9vbHRpcCc+XCIgKyBcIk5vdCB0aGlzLCB0aG91Z2guXCIgKyBcIjwvZGl2PlwiKTtcclxuICAgIFx0XHRcdHRvb2x0aXAuYXBwZW5kVG8oaW52ZW50b3J5RGVzYyk7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdCQoXCIjdG9vbHRpcFwiKS5mYWRlT3V0KCkucmVtb3ZlKCk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIF8oXCJJIGJldCB5b3UgdGhpbmsgeW91J3JlIHByZXR0eSBmdW5ueSwgaHVoPyBDbGlja2luZyB0aGUgdGhpbmcgSSBzYWlkIHdhc24ndCBjbGlja2FibGU/XCIpKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCIyMHB4XCIpXHJcblx0XHRcdC5hcHBlbmRUbyhpbnZlbnRvcnlEaXNwbGF5KTtcclxuXHRcdFxyXG5cdFx0Zm9yKHZhciBpdGVtIGluIENoYXJhY3Rlci5pbnZlbnRvcnkpIHtcclxuXHRcdFx0Ly8gbWFrZSB0aGUgaW52ZW50b3J5IGNvdW50IGxvb2sgYSBiaXQgbmljZXJcclxuXHRcdFx0dmFyIGludmVudG9yeUVsZW0gPSAkKCc8ZGl2PicpXHJcblx0XHRcdC5hdHRyKCdpZCcsICdpdGVtJylcclxuXHRcdFx0LmF0dHIoJ2RhdGEtbmFtZScsIGl0ZW0pXHJcblx0XHRcdC50ZXh0KEl0ZW1MaXN0W2l0ZW1dLm5hbWUgICsgJyAgKHgnICsgQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXS50b1N0cmluZygpICsgJyknKVxyXG5cdFx0XHQuYXBwZW5kVG8oaW52ZW50b3J5RGlzcGxheSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVE9ETzogbWFrZSB0aGlzIENTUyBhbiBhY3R1YWwgY2xhc3Mgc29tZXdoZXJlLCBJJ20gc3VyZSBJJ2xsIG5lZWQgaXQgYWdhaW5cclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnYnV0dG9ucycpLmNzcyhcIm1hcmdpbi10b3BcIiwgXCIyMHB4XCIpLmFwcGVuZFRvKGludmVudG9yeURpc3BsYXkpO1xyXG5cdFx0dmFyIGIgPSBcclxuXHRcdC8vbmV3IFxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiBcImNsb3NlSW52ZW50b3J5XCIsXHJcblx0XHRcdHRleHQ6IFwiQ2xvc2VcIixcclxuXHRcdFx0Y2xpY2s6IENoYXJhY3Rlci5jbG9zZUludmVudG9yeVxyXG5cdFx0fSkuYXBwZW5kVG8oJCgnI2J1dHRvbnMnLCBpbnZlbnRvcnlEaXNwbGF5KSk7XHJcblx0XHQkKCdkaXYjd3JhcHBlcicpLmFwcGVuZChpbnZlbnRvcnlEaXNwbGF5KTtcclxuXHRcdGludmVudG9yeURpc3BsYXkuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIEV2ZW50cy5fUEFORUxfRkFERSwgJ2xpbmVhcicpO1xyXG5cdH0sXHJcblxyXG5cdGNsb3NlSW52ZW50b3J5OiBmdW5jdGlvbigpIHtcclxuXHRcdENoYXJhY3Rlci5pbnZlbnRvcnlEaXNwbGF5LmVtcHR5KCk7XHJcblx0XHRDaGFyYWN0ZXIuaW52ZW50b3J5RGlzcGxheS5yZW1vdmUoKTtcclxuXHR9LFxyXG5cclxuXHRhZGRUb0ludmVudG9yeTogZnVuY3Rpb24oaXRlbSwgYW1vdW50PTEpIHtcclxuXHRcdGlmIChDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dKSB7XHJcblx0XHRcdENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0gKz0gYW1vdW50O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Q2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSA9IGFtb3VudDtcclxuXHRcdH1cclxuXHJcblx0XHROb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIkFkZGVkIFwiICsgSXRlbUxpc3RbaXRlbV0ubmFtZSArIFwiIHRvIGludmVudG9yeS5cIilcclxuXHRcdCRTTS5zZXQoJ2ludmVudG9yeScsIENoYXJhY3Rlci5pbnZlbnRvcnkpO1xyXG5cdH0sXHJcblxyXG5cclxuXHRyZW1vdmVGcm9tSW52ZW50b3J5OiBmdW5jdGlvbihpdGVtLCBhbW91bnQ9MSkge1xyXG5cdFx0aWYgKENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0pIENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0gLT0gYW1vdW50O1xyXG5cdFx0aWYgKENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0gPCAxKSB7XHJcblx0XHRcdGRlbGV0ZSBDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dO1xyXG5cdFx0fVxyXG5cclxuXHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiUmVtb3ZlZCBcIiArIEl0ZW1MaXN0W2l0ZW1dLm5hbWUgKyBcIiBmcm9tIGludmVudG9yeS5cIilcclxuXHRcdCRTTS5zZXQoJ2ludmVudG9yeScsIENoYXJhY3Rlci5pbnZlbnRvcnkpO1xyXG5cdH0sXHJcblxyXG5cdHVzZUludmVudG9yeUl0ZW06IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdGlmIChDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dICYmIENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0gPiAwKSB7XHJcblx0XHRcdC8vIHVzZSB0aGUgZWZmZWN0IGluIHRoZSBpbnZlbnRvcnk7IGp1c3QgaW4gY2FzZSBhIG5hbWUgbWF0Y2hlcyBidXQgdGhlIGVmZmVjdFxyXG5cdFx0XHQvLyBkb2VzIG5vdCwgYXNzdW1lIHRoZSBpbnZlbnRvcnkgaXRlbSBpcyB0aGUgc291cmNlIG9mIHRydXRoXHJcblx0XHRcdEl0ZW1MaXN0W2l0ZW1dLm9uVXNlKCk7XHJcblx0XHRcdGlmICh0eXBlb2YoSXRlbUxpc3RbaXRlbV0uZGVzdHJveU9uVXNlKSA9PSBcImZ1bmN0aW9uXCIgJiYgSXRlbUxpc3RbaXRlbV0uZGVzdHJveU9uVXNlKCkpIHtcclxuXHRcdFx0XHRDaGFyYWN0ZXIucmVtb3ZlRnJvbUludmVudG9yeShpdGVtKTtcclxuXHRcdFx0fSBlbHNlIGlmIChJdGVtTGlzdFtpdGVtXS5kZXN0cm95T25Vc2UpIHtcclxuXHRcdFx0XHRDaGFyYWN0ZXIucmVtb3ZlRnJvbUludmVudG9yeShpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdCRTTS5zZXQoJ2ludmVudG9yeScsIENoYXJhY3Rlci5pbnZlbnRvcnkpO1xyXG5cdH0sXHJcblxyXG5cdGVxdWlwSXRlbTogZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0aWYgKEl0ZW1MaXN0W2l0ZW1dLnNsb3QgJiYgQ2hhcmFjdGVyLmVxdWlwcGVkSXRlbXNbSXRlbUxpc3RbaXRlbV0uc2xvdF0gIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoQ2hhcmFjdGVyLmVxdWlwcGVkSXRlbXNbSXRlbUxpc3RbaXRlbV0uc2xvdF0pO1xyXG5cdFx0XHRDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtc1tJdGVtTGlzdFtpdGVtXS5zbG90XSA9IGl0ZW07XHJcblx0XHRcdGlmIChJdGVtTGlzdFtpdGVtXS5vbkVxdWlwKSB7XHJcblx0XHRcdFx0SXRlbUxpc3RbaXRlbV0ub25FcXVpcCgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdENoYXJhY3Rlci5hcHBseUVxdWlwbWVudEVmZmVjdHMoKTtcclxuXHRcdH1cclxuXHJcblx0XHQkU00uc2V0KCdlcXVpcHBlZEl0ZW1zJywgQ2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMpO1xyXG5cdFx0JFNNLnNldCgnaW52ZW50b3J5JywgQ2hhcmFjdGVyLmludmVudG9yeSk7XHJcblx0fSxcclxuXHJcblx0Z3JhbnRQZXJrOiBmdW5jdGlvbihwZXJrKSB7XHJcblx0XHRpZiAoQ2hhcmFjdGVyLnBlcmtzW3BlcmtdICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0aWYocGVyay50aW1lTGVmdCA+IDApIHtcclxuXHRcdFx0XHRDaGFyYWN0ZXIucGVya3NbcGVya10gKz0gcGVyay50aW1lTGVmdDtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Q2hhcmFjdGVyLnBlcmtzW3BlcmtdID0gcGVyaztcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnVwZGF0ZVBlcmtzKCk7XHJcblxyXG5cdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkoJ251bGwnLCBcIkFjcXVpcmVkIGVmZmVjdDogXCIgKyBQZXJrTGlzdFtwZXJrXS5uYW1lKTtcclxuXHRcdFxyXG5cdFx0JFNNLnNldCgncGVya3MnLCBDaGFyYWN0ZXIucGVya3MpO1xyXG5cdH0sXHJcblxyXG5cdHJlbW92ZVBlcms6IGZ1bmN0aW9uKHBlcmspIHtcclxuXHRcdGlmIChDaGFyYWN0ZXIucGVya3NbcGVyay5uYW1lXSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGRlbGV0ZSBDaGFyYWN0ZXIucGVya3NbcGVyay5uYW1lXTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnVwZGF0ZVBlcmtzKCk7XHJcblxyXG5cdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkoJ251bGwnLCBcIkxvc3QgZWZmZWN0OiBcIiArIFBlcmtMaXN0W3BlcmtdLm5hbWUpO1xyXG5cclxuXHRcdCRTTS5zZXQoJ3BlcmtzJywgQ2hhcmFjdGVyLnBlcmtzKTtcclxuXHR9LFxyXG5cclxuXHR1cGRhdGVQZXJrczogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnBlcmtBcmVhLmVtcHR5KCk7XHJcblx0XHRpZiAoT2JqZWN0LmtleXModGhpcy5wZXJrcykubGVuZ3RoID4gMCkge1xyXG5cdFx0XHQkKCc8ZGl2PicpLnRleHQoJ1BlcmtzJylcclxuXHRcdFx0LmNzcygndGV4dC1kZWNvcmF0aW9uJywgJ3VuZGVybGluZScpXHJcblx0XHRcdC5jc3MoJ21hcmdpbi10b3AnLCAnMTBweCcpXHJcblx0XHRcdC5hdHRyKCdpZCcsICd0aXRsZScpXHJcblx0XHRcdC5hcHBlbmRUbygnZGl2I3BlcmtzJyk7XHJcblx0XHRcdC8vIHNldCB1cCBjbGljayBhbmQgaG92ZXIgaGFuZGxlcnMgZm9yIHBlcmtzXHJcblx0XHR0aGlzLnBlcmtBcmVhXHJcblx0XHQub24oXCJjbGlja1wiLCBcIiNwZXJrXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQvLyBoYW5kbGUgdGhpcyB3aGVuIHdlIGhhdmUgcGVyayBkZXNjcmlwdGlvbnMgYW5kIHN0dWZmXHJcblx0XHR9KS5vbihcIm1vdXNlZW50ZXJcIiwgXCIjcGVya1wiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHRvb2x0aXAgPSAkKFwiPGRpdiBpZD0ndG9vbHRpcCcgY2xhc3M9J3Rvb2x0aXAnPlwiICsgUGVya0xpc3RbJCh0aGlzKS5kYXRhKFwibmFtZVwiKV0udGV4dCArIFwiPC9kaXY+XCIpXHJcblx0XHRcdC5hdHRyKCdkYXRhLW5hbWUnLCBwZXJrKTtcclxuXHRcdFx0dG9vbHRpcC5hcHBlbmRUbygkKHRoaXMpKTtcclxuXHRcdH0pLm9uKFwibW91c2VsZWF2ZVwiLCBcIiNwZXJrXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKFwiI3Rvb2x0aXBcIiwgXCIjXCIgKyAkKHRoaXMpLmRhdGEoXCJuYW1lXCIpKS5mYWRlT3V0KCkucmVtb3ZlKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRcdGZvcih2YXIgcGVyayBpbiBDaGFyYWN0ZXIucGVya3MpIHtcclxuXHRcdFx0XHQvLyBhZGQgbW91c2VvdmVyIGFuZCBjbGljayBzdHVmZlxyXG5cdFx0XHRcdHZhciBwZXJrRWxlbSA9ICQoJzxkaXY+JylcclxuXHRcdFx0XHQuYXR0cignaWQnLCAncGVyaycpXHJcblx0XHRcdFx0LmF0dHIoJ2RhdGEtbmFtZScsIHBlcmspXHJcblx0XHRcdFx0LnRleHQoUGVya0xpc3RbcGVya10ubmFtZSlcclxuXHRcdFx0XHQuYXBwZW5kVG8oJ2RpdiNwZXJrcycpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0b3BlblF1ZXN0TG9nOiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIGNyZWF0aW5nIGEgaGFuZGxlIGZvciBsYXRlciBhY2Nlc3MsIHN1Y2ggYXMgY2xvc2luZyBxdWVzdCBsb2dcclxuXHRcdENoYXJhY3Rlci5xdWVzdExvZ0Rpc3BsYXkgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ3F1ZXN0JykuYWRkQ2xhc3MoJ2V2ZW50UGFuZWwnKS5jc3MoJ29wYWNpdHknLCAnMCcpO1xyXG5cdFx0dmFyIHF1ZXN0TG9nRGlzcGxheSA9IENoYXJhY3Rlci5xdWVzdExvZ0Rpc3BsYXk7XHJcblx0XHRDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5XHJcblx0XHQvLyBzZXQgdXAgY2xpY2sgYW5kIGhvdmVyIGhhbmRsZXJzIGZvciBxdWVzdHNcclxuXHRcdC5vbihcImNsaWNrXCIsIFwiI3F1ZXN0XCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRDaGFyYWN0ZXIuZGlzcGxheVF1ZXN0KCQodGhpcykuZGF0YShcIm5hbWVcIikpO1xyXG5cdFx0fSk7XHJcblx0XHQkKCc8ZGl2PicpLmFkZENsYXNzKCdldmVudFRpdGxlJykudGV4dCgnUXVlc3QgTG9nJykuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHRcdHZhciBxdWVzdExvZ0Rlc2MgPSAkKCc8ZGl2PicpLnRleHQoXCJDbGljayBxdWVzdCBuYW1lcyB0byBzZWUgbW9yZSBpbmZvLlwiKVxyXG5cdFx0XHQuY3NzKFwibWFyZ2luLWJvdHRvbVwiLCBcIjIwcHhcIilcclxuXHRcdFx0LmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHRcclxuXHRcdGZvcih2YXIgcXVlc3QgaW4gQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzKSB7XHJcblx0XHRcdHZhciBxdWVzdEVsZW0gPSAkKCc8ZGl2PicpXHJcblx0XHRcdC5hdHRyKCdpZCcsIFwicXVlc3RcIilcclxuXHRcdFx0LmF0dHIoJ2RhdGEtbmFtZScsIHF1ZXN0KVxyXG5cdFx0XHQudGV4dChRdWVzdExvZ1txdWVzdF0ubmFtZSlcclxuXHRcdFx0LmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHRcdGlmIChDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdID09IC0xKSB7XHJcblx0XHRcdFx0cXVlc3RFbGVtXHJcblx0XHRcdFx0Ly8gSSB3YW50IHRoaXMgdG8gYmUgbm90IHN0cnVjayB0aHJvdWdoLCBidXQgdGhhdCdzIHRvbyBhbm5veWluZyB0byB3b3JyeVxyXG5cdFx0XHRcdC8vIGFib3V0IHJpZ2h0IG5vd1xyXG5cdFx0XHRcdC8vIC5wcmVwZW5kKFwiRE9ORSBcIilcclxuXHRcdFx0XHQud3JhcChcIjxzdHJpa2U+XCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVE9ETzogbWFrZSB0aGlzIENTUyBhbiBhY3R1YWwgY2xhc3Mgc29tZXdoZXJlLCBJJ20gc3VyZSBJJ2xsIG5lZWQgaXQgYWdhaW5cclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnYnV0dG9ucycpLmNzcyhcIm1hcmdpbi10b3BcIiwgXCIyMHB4XCIpLmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHR2YXIgYiA9IEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogXCJjbG9zZVF1ZXN0TG9nXCIsXHJcblx0XHRcdHRleHQ6IFwiQ2xvc2VcIixcclxuXHRcdFx0Y2xpY2s6IENoYXJhY3Rlci5jbG9zZVF1ZXN0TG9nXHJcblx0XHR9KS5hcHBlbmRUbygkKCcjYnV0dG9ucycsIHF1ZXN0TG9nRGlzcGxheSkpO1xyXG5cdFx0JCgnZGl2I3dyYXBwZXInKS5hcHBlbmQocXVlc3RMb2dEaXNwbGF5KTtcclxuXHRcdHF1ZXN0TG9nRGlzcGxheS5hbmltYXRlKHtvcGFjaXR5OiAxfSwgRXZlbnRzLl9QQU5FTF9GQURFLCAnbGluZWFyJyk7XHJcblx0fSxcclxuXHJcblx0ZGlzcGxheVF1ZXN0OiBmdW5jdGlvbihxdWVzdDogc3RyaW5nKSB7XHJcblx0XHRjb25zdCBxdWVzdExvZ0Rpc3BsYXkgPSBDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5O1xyXG5cdFx0cXVlc3RMb2dEaXNwbGF5LmVtcHR5KCk7XHJcblx0XHRjb25zdCBjdXJyZW50UXVlc3QgPSBRdWVzdExvZ1txdWVzdF07XHJcblxyXG5cdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdxdWVzdCcpLmFkZENsYXNzKCdldmVudFBhbmVsJykuY3NzKCdvcGFjaXR5JywgJzAnKTtcclxuXHRcdCQoJzxkaXY+JykuYWRkQ2xhc3MoJ2V2ZW50VGl0bGUnKS50ZXh0KGN1cnJlbnRRdWVzdC5uYW1lKS5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cclxuXHRcdHZhciBxdWVzdExvZ0Rlc2MgPSAkKCc8ZGl2PicpLnRleHQoY3VycmVudFF1ZXN0LmxvZ0Rlc2NyaXB0aW9uKVxyXG5cdFx0XHQuY3NzKFwibWFyZ2luLWJvdHRvbVwiLCBcIjIwcHhcIilcclxuXHRcdFx0LmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblxyXG5cdFx0aWYgKENoYXJhY3Rlci5xdWVzdFN0YXR1c1txdWVzdF0gYXMgbnVtYmVyID09IC0xKSB7XHJcblx0XHRcdHZhciBwaGFzZURlc2MgPSAkKCc8ZGl2PicpLnRleHQoXCJUaGlzIHF1ZXN0IGlzIGNvbXBsZXRlIVwiKVxyXG5cdFx0XHQuY3NzKFwibWFyZ2luLWJvdHRvbVwiLCBcIjEwcHhcIilcclxuXHRcdFx0LmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPD0gKENoYXJhY3Rlci5xdWVzdFN0YXR1c1txdWVzdF0gYXMgbnVtYmVyKTsgaSsrKSB7XHJcblx0XHRcdHZhciBwaGFzZURlc2MgPSAkKCc8ZGl2PicpLnRleHQoY3VycmVudFF1ZXN0LnBoYXNlc1tpXS5kZXNjcmlwdGlvbilcclxuXHRcdFx0LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCIxMHB4XCIpXHJcblx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0XHR2YXIgY29tcGxldGUgPSB0cnVlO1xyXG5cdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IE9iamVjdC5rZXlzKGN1cnJlbnRRdWVzdC5waGFzZXNbaV0ucmVxdWlyZW1lbnRzKS5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdHZhciByZXF1aXJlbWVudHNEZXNjID0gJCgnPGRpdj4nKS50ZXh0KGN1cnJlbnRRdWVzdC5waGFzZXNbaV0ucmVxdWlyZW1lbnRzW2pdLnJlbmRlclJlcXVpcmVtZW50KCkpXHJcblx0XHRcdFx0XHQuY3NzKFwibWFyZ2luLWJvdHRvbVwiLCBcIjIwcHhcIilcclxuXHRcdFx0XHRcdC5jc3MoXCJtYXJnaW4tbGVmdFwiLCBcIjIwcHhcIilcclxuXHRcdFx0XHRcdC5jc3MoJ2ZvbnQtc3R5bGUnLCAnaXRhbGljJylcclxuXHRcdFx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0XHRcdGlmICghY3VycmVudFF1ZXN0LnBoYXNlc1tpXS5yZXF1aXJlbWVudHNbal0uaXNDb21wbGV0ZSgpKSBjb21wbGV0ZSA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChjb21wbGV0ZSkge1xyXG5cdFx0XHRcdHBoYXNlRGVzYy53cmFwKFwiPHN0cmlrZT5cIik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBUT0RPOiBtYWtlIHRoaXMgQ1NTIGFuIGFjdHVhbCBjbGFzcyBzb21ld2hlcmUsIEknbSBzdXJlIEknbGwgbmVlZCBpdCBhZ2FpblxyXG5cdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdidXR0b25zJykuY3NzKFwibWFyZ2luLXRvcFwiLCBcIjIwcHhcIikuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHJcblx0XHR2YXIgYiA9IEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogXCJiYWNrVG9RdWVzdExvZ1wiLFxyXG5cdFx0XHR0ZXh0OiBcIkJhY2sgdG8gUXVlc3QgTG9nXCIsXHJcblx0XHRcdGNsaWNrOiBDaGFyYWN0ZXIuYmFja1RvUXVlc3RMb2dcclxuXHRcdH0pLmFwcGVuZFRvKCQoJyNidXR0b25zJywgcXVlc3RMb2dEaXNwbGF5KSk7XHJcblxyXG5cdFx0dmFyIGIgPSBCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6IFwiY2xvc2VRdWVzdExvZ1wiLFxyXG5cdFx0XHR0ZXh0OiBcIkNsb3NlXCIsXHJcblx0XHRcdGNsaWNrOiBDaGFyYWN0ZXIuY2xvc2VRdWVzdExvZ1xyXG5cdFx0fSkuYXBwZW5kVG8oJCgnI2J1dHRvbnMnLCBxdWVzdExvZ0Rpc3BsYXkpKTtcclxuXHR9LFxyXG5cclxuXHRjbG9zZVF1ZXN0TG9nOiBmdW5jdGlvbigpIHtcclxuXHRcdENoYXJhY3Rlci5xdWVzdExvZ0Rpc3BsYXkuZW1wdHkoKTtcclxuXHRcdENoYXJhY3Rlci5xdWVzdExvZ0Rpc3BsYXkucmVtb3ZlKCk7XHJcblx0fSxcclxuXHJcblx0YmFja1RvUXVlc3RMb2c6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Q2hhcmFjdGVyLmNsb3NlUXVlc3RMb2coKTtcclxuXHRcdENoYXJhY3Rlci5vcGVuUXVlc3RMb2coKTtcclxuXHR9LFxyXG5cclxuXHRzZXRRdWVzdFN0YXR1czogZnVuY3Rpb24ocXVlc3QsIHBoYXNlKSB7XHJcblx0XHQvLyBtaWdodCBiZSBhIGdvb2QgaWRlYSB0byBjaGVjayBmb3IgbGluZWFyIHF1ZXN0IHByb2dyZXNzaW9uIGhlcmU/XHJcblx0XHRpZiAoUXVlc3RMb2dbcXVlc3RdICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0Q2hhcmFjdGVyLnF1ZXN0U3RhdHVzW3F1ZXN0XSA9IHBoYXNlO1xyXG5cclxuXHRcdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJRdWVzdCBMb2cgdXBkYXRlZC5cIik7XHJcblx0XHRcdCRTTS5zZXQoJ3F1ZXN0U3RhdHVzJywgQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRjaGVja1F1ZXN0U3RhdHVzOiBmdW5jdGlvbihxdWVzdCkge1xyXG5cdFx0Y29uc3QgY3VycmVudFBoYXNlID0gUXVlc3RMb2dbcXVlc3RdLnBoYXNlc1tDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdXTtcclxuXHJcblx0XHRpZiAoY3VycmVudFBoYXNlID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcblx0XHR2YXIgY29tcGxldGUgPSB0cnVlO1xyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBPYmplY3Qua2V5cyhjdXJyZW50UGhhc2UucmVxdWlyZW1lbnRzKS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAoIWN1cnJlbnRQaGFzZS5yZXF1aXJlbWVudHNbaV0uaXNDb21wbGV0ZSgpKVxyXG5cdFx0XHRcdGNvbXBsZXRlID0gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGNvbXBsZXRlKSB7XHJcblx0XHRcdC8vIGlmIHRoZXJlIGlzIGEgbmV4dCBwaGFzZSwgc2V0IHF1ZXN0U3RhdHVzIHRvIGl0XHJcblx0XHRcdGlmIChRdWVzdExvZ1txdWVzdF0ucGhhc2VzW0NoYXJhY3Rlci5xdWVzdFN0YXR1c1txdWVzdF0gKyAxXSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0Q2hhcmFjdGVyLnF1ZXN0U3RhdHVzW3F1ZXN0XSArPSAxO1xyXG5cdFx0XHR9IGVsc2UgeyAvLyBlbHNlIHNldCBpdCB0byBjb21wbGV0ZVxyXG5cdFx0XHRcdENoYXJhY3Rlci5xdWVzdFN0YXR1c1txdWVzdF0gPSAtMTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHROb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIlF1ZXN0IExvZyB1cGRhdGVkLlwiKTtcclxuXHRcdCRTTS5zZXQoJ3F1ZXN0U3RhdHVzJywgQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzKTtcclxuXHR9LFxyXG5cclxuXHQvLyBhcHBseSBlcXVpcG1lbnQgZWZmZWN0cywgd2hpY2ggc2hvdWxkIGFsbCBjaGVjayBhZ2FpbnN0ICRTTSBzdGF0ZSB2YXJpYWJsZXM7XHJcblx0Ly8gdGhpcyBzaG91bGQgYmUgY2FsbGVkIG9uIGJhc2ljYWxseSBldmVyeSBwbGF5ZXIgYWN0aW9uIHdoZXJlIGEgcGllY2Ugb2YgZ2VhclxyXG5cdC8vIHdvdWxkIGRvIHNvbWV0aGluZyBvciBjaGFuZ2UgYW4gb3V0Y29tZTsgZ2l2ZSBleHRyYVBhcmFtcyB0byB0aGUgZWZmZWN0IGJlaW5nIFxyXG5cdC8vIGFwcGxpZWQgZm9yIGFueXRoaW5nIHRoYXQncyByZWxldmFudCB0byB0aGUgZWZmZWN0IGJ1dCBub3QgaGFuZGxlZCBieSAkU01cclxuXHRhcHBseUVxdWlwbWVudEVmZmVjdHM6IGZ1bmN0aW9uKGV4dHJhUGFyYW1zPykge1xyXG5cdFx0Zm9yIChjb25zdCBpdGVtIGluIENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zKSB7XHJcblx0XHRcdGlmIChJdGVtTGlzdFtpdGVtXS5lZmZlY3RzKSB7XHJcblx0XHRcdFx0Zm9yIChjb25zdCBlZmZlY3QgaW4gSXRlbUxpc3RbaXRlbV0uZWZmZWN0cykge1xyXG5cdFx0XHRcdFx0Ly8gTk9URTogY3VycmVudGx5IHRoaXMgaXMgZ29vZCBmb3IgYXBwbHlpbmcgcGVya3MgYW5kIE5vdGlmeWluZztcclxuXHRcdFx0XHRcdC8vIGFyZSB0aGVyZSBvdGhlciBzaXR1YXRpb25zIHdoZXJlIHdlJ2Qgd2FudCB0byBhcHBseSBlZmZlY3RzLFxyXG5cdFx0XHRcdFx0Ly8gb3IgY2FuIHdlIGNvdmVyIGJhc2ljYWxseSBldmVyeSBjYXNlIHZpYSB0aG9zZSB0aGluZ3M/XHJcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0XHRpZiAoZWZmZWN0LmlzQWN0aXZlICYmIGVmZmVjdC5pc0FjdGl2ZShleHRyYVBhcmFtcykpIGVmZmVjdC5hcHBseShleHRyYVBhcmFtcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Ly8gZ2V0IHN0YXRzIGFmdGVyIGFwcGx5aW5nIGFsbCBlcXVpcG1lbnQgYm9udXNlcywgcGVya3MsIGV0Yy5cclxuXHRnZXREZXJpdmVkU3RhdHM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Y29uc3QgZGVyaXZlZFN0YXRzID0gc3RydWN0dXJlZENsb25lKENoYXJhY3Rlci5yYXdTdGF0cyk7XHJcblx0XHRmb3IgKGNvbnN0IGl0ZW0gaW4gQ2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMpIHtcclxuXHRcdFx0aWYgKEl0ZW1MaXN0W2l0ZW1dLnN0YXRCb251c2VzKSB7XHJcblx0XHRcdFx0Zm9yIChjb25zdCBzdGF0IGluIE9iamVjdC5rZXlzKEl0ZW1MaXN0W2l0ZW1dLnN0YXRCb251c2VzKSkge1xyXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiAoSXRlbUxpc3RbaXRlbV0uc3RhdEJvbnVzZXNbc3RhdF0gPT0gXCJmdW5jdGlvblwiKSkge1xyXG5cdFx0XHRcdFx0XHRkZXJpdmVkU3RhdHNbc3RhdF0gKz0gSXRlbUxpc3RbaXRlbV0uc3RhdEJvbnVzZXNbc3RhdF0oKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGRlcml2ZWRTdGF0c1tzdGF0XSArPSBJdGVtTGlzdFtpdGVtXS5zdGF0Qm9udXNlc1tzdGF0XTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGNvbnN0IHBlcmsgaW4gQ2hhcmFjdGVyLnBlcmtzKSB7XHJcblx0XHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdFx0aWYgKHBlcmsuc3RhdEJvbnVzZXMpIHtcclxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0Zm9yIChjb25zdCBzdGF0IGluIE9iamVjdC5rZXlzKHBlcmsuc3RhdEJvbnVzZXMpKSB7XHJcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0XHRpZiAodHlwZW9mIChwZXJrLnN0YXRCb251c2VzW3N0YXRdID09IFwiZnVuY3Rpb25cIikpIHtcclxuXHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdFx0XHRkZXJpdmVkU3RhdHNbc3RhdF0gKz0gcGVyay5zdGF0Qm9udXNlc1tzdGF0XSgpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdFx0XHRkZXJpdmVkU3RhdHNbc3RhdF0gKz0gcGVyay5zdGF0Qm9udXNlc1tzdGF0XTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZGVyaXZlZFN0YXRzO1xyXG5cdH1cclxufSIsIi8vIGFsbCBpdGVtcyBnbyBoZXJlLCBzbyB0aGF0IG5vdGhpbmcgc2lsbHkgaGFwcGVucyBpbiB0aGUgZXZlbnQgdGhhdCB0aGV5IGdldCBwdXQgaW4gTG9jYWwgU3RvcmFnZVxyXG4vLyBhcyBwYXJ0IG9mIHRoZSBzdGF0ZSBtYW5hZ2VtZW50IGNvZGU7IHBsZWFzZSBzYXZlIGl0ZW0gbmFtZXMgdG8gdGhlIGludmVudG9yeSwgYW5kIHRoZW4gcmVmZXIgdG8gXHJcbi8vIHRoZSBpdGVtIGxpc3QgdmlhIHRoZSBpdGVtIG5hbWVcclxuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tIFwiLi9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tIFwiLi4vbm90aWZpY2F0aW9uc1wiO1xyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSBcIi4vaXRlbVwiO1xyXG5cclxuLy8gRGV0YWlscyBmb3IgYWxsIGluLWdhbWUgaXRlbXM7IHRoZSBDaGFyYWN0ZXIgaW52ZW50b3J5IG9ubHkgaG9sZHMgaXRlbSBJRHNcclxuLy8gYW5kIGFtb3VudHNcclxuZXhwb3J0IGNvbnN0IEl0ZW1MaXN0OiB7W2lkOiBzdHJpbmddOiBJdGVtfSA9IHtcclxuICAgIFwiTGl6LndlaXJkQm9va1wiOiB7XHJcbiAgICAgICAgbmFtZTogJ1dlaXJkIEJvb2snLFxyXG4gICAgICAgIHBsdXJhbE5hbWU6ICdXZWlyZCBCb29rcycsXHJcbiAgICAgICAgdGV4dDogXygnQSBib29rIHlvdSBmb3VuZCBhdCBMaXpcXCdzIHBsYWNlLiBTdXBwb3NlZGx5IGhhcyBpbmZvcm1hdGlvbiBhYm91dCBDaGFkdG9waWEuJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkgeyBcclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICBfKFwiQSBCcmllZiBIaXN0b3J5IG9mIENoYWR0b3BpYVwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1RoaXMgYm9vayBpcyBwcmV0dHkgYm9yaW5nLCBidXQgeW91IG1hbmFnZSB0byBsZWFybiBhIGJpdCBtb3JlIGluIHNwaXRlIG9mIHlvdXIgcG9vciBhdHRlbnRpb24gc3Bhbi4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oJ0ZvciBleGFtcGxlLCB5b3UgbGVhcm4gdGhhdCBcIkNoYWR0b3BpYVwiIGRvZXNuXFwndCBoYXZlIGEgY2FwaXRhbCBcXCdUXFwnLiBUaGF0XFwncyBwcmV0dHkgY29vbCwgaHVoPycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXygnLi4uIFdoYXQgd2VyZSB5b3UgZG9pbmcgYWdhaW4/JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnU29tZXRoaW5nIGNvb2xlciB0aGFuIHJlYWRpbmcsIHByb2JhYmx5JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6ICgpID0+IENoYXJhY3Rlci5hZGRUb0ludmVudG9yeShcIkxpei5ib3JpbmdCb29rXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogdHJ1ZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH0sXHJcblxyXG4gICAgXCJMaXouYm9yaW5nQm9va1wiOiB7XHJcbiAgICAgICAgbmFtZTogJ1wiQSBCcmllZiBIaXN0b3J5IG9mIENoYWR0b3BpYVwiJyxcclxuICAgICAgICBwbHVyYWxOYW1lOiAnTXVsdGlwbGUgY29waWVzIG9mIFwiQSBCcmllZiBIaXN0b3J5IG9mIENoYWR0b3BpYVwiJyxcclxuICAgICAgICB0ZXh0OiBfKCdNYW4sIHRoaXMgYm9vayBpcyBib3JpbmcuJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEgQnJpZWYgU3VtbWFyeSBvZiBhIEJyaWVmIEhpc3Rvcnkgb2YgQ2hhZHRvcGlhXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW18oJ0l0XFwncyBzdGlsbCBqdXN0IGFzIGJvcmluZyBhcyB3aGVuIHlvdSBsYXN0IHRyaWVkIHRvIHJlYWQgaXQuJyldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdEYW5nLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogZmFsc2UsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgXCJTdHJhbmdlci5zbW9vdGhTdG9uZVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ2Egc21vb3RoIGJsYWNrIHN0b25lJyxcclxuICAgICAgICBwbHVyYWxOYW1lOiAnc21vb3RoIGJsYWNrIHN0b25lcycsXHJcbiAgICAgICAgdGV4dDogXygnSXRcXCdzIHdlaXJkbHkgZWVyaWUnKSxcclxuICAgICAgICBvblVzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmICghJFNNLmdldCgna25vd2xlZGdlLlN0cmFuZ2VyLnNtb290aFN0b25lJykpIHtcclxuICAgICAgICAgICAgICAgIE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsICdZb3UgaGF2ZSBubyBpZGVhIHdoYXQgdG8gZG8gd2l0aCB0aGlzIHRoaW5nLicpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBfKFwiQSBzbW9vdGggYmxhY2sgc3RvbmVcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXyhcIkknbSBnZW51aW5lbHkgbm90IHN1cmUgaG93IHlvdSBnb3QgdG8gdGhpcyBldmVudCwgYnV0IHBsZWFzZSBsZXQgbWUga25vdyB2aWEgR2l0SHViIGlzc3VlLCB5b3UgbGl0dGxlIHN0aW5rZXIuXCIpXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnSSBzd2VhciB0byBkbyB0aGlzLCBhcyBhIHJlc3BvbnNpYmxlIGNpdGl6ZW4gb2YgRWFydGgnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIFwiU3RyYW5nZXIud3JhcHBlZEtuaWZlXCI6IHtcclxuICAgICAgICBuYW1lOiAnYSBrbmlmZSB3cmFwcGVkIGluIGNsb3RoJyxcclxuICAgICAgICBwbHVyYWxOYW1lOiAnS25pdmVzIHdyYXBwZWQgaW4gc2VwYXJhdGUgY2xvdGhzJyxcclxuICAgICAgICB0ZXh0OiBfKCdNYW4sIEkgaG9wZSBpdFxcJ3Mgbm90IGFsbCBsaWtlLCBibG9vZHkgb24gdGhlIGJsYWRlIGFuZCBzdHVmZi4nKSxcclxuICAgICAgICBvblVzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBfKFwiQSBrbmlmZSB3cmFwcGVkIGluIGNsb3RoXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW18oXCJZb3UgdW53cmFwIHRoZSBrbmlmZSBjYXJlZnVsbHkuIEl0IHNlZW1zIHRvIGJlIGhpZ2hseSBvcm5hbWVudGVkLCBhbmQgeW91IGNvdWxkIHByb2JhYmx5IGRvIHNvbWUgY3JpbWVzIHdpdGggaXQuXCIpXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnSGVsbCB5ZWFoLCBBZG9sZiBMb29zIHN0eWxlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6ICgpID0+IENoYXJhY3Rlci5hZGRUb0ludmVudG9yeShcIlN0cmFuZ2VyLnNpbHZlcktuaWZlXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogdHJ1ZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH0sXHJcbiAgICBcIlN0cmFuZ2VyLnNpbHZlcktuaWZlXCI6IHtcclxuICAgICAgICBuYW1lOiAnYSBzaWx2ZXIga25pZmUnLFxyXG4gICAgICAgIHBsdXJhbE5hbWU6ICdzaWx2ZXIga25pdmVzJyxcclxuICAgICAgICB0ZXh0OiBfKCdIaWdobHkgb3JuYW1lbnRlZCcpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IF8oXCJBIHNpbHZlciBrbmlmZVwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJPbmUgZGF5IHlvdSdsbCBiZSBhYmxlIHRvIGVxdWlwIHRoaXMsIGJ1dCByaWdodCBub3cgdGhhdCBmdW5jdGlvbmFsaXR5IGlzbid0IHByZXNlbnQuXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIlBsZWFzZSBwb2xpdGVseSBsZWF2ZSB0aGUgcHJlbWlzZXMgd2l0aG91dCBhY2tub3dsZWRnaW5nIHRoaXMgbWlzc2luZyBmZWF0dXJlLlwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdZb3UgZ290IGl0LCBjaGllZicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogZmFsc2UsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgXCJTdHJhbmdlci5jbG90aEJ1bmRsZVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ2EgYnVuZGxlIG9mIGNsb3RoJyxcclxuICAgICAgICBwbHVyYWxOYW1lOiAnYnVuZGxlcyBvZiBjbG90aCcsXHJcbiAgICAgICAgdGV4dDogXygnV2hhdCBsaWVzIHdpdGhpbj8nKSxcclxuICAgICAgICBvblVzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBfKFwiQSBidW5kbGUgb2YgY2xvdGhcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiT25lIGRheSB5b3UnbGwgYmUgYWJsZSB0byB1c2UgdGhpcyBpdGVtLCBidXQgcmlnaHQgbm93IHRoYXQgZnVuY3Rpb25hbGl0eSBpc24ndCBwcmVzZW50LlwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJQbGVhc2UgcG9saXRlbHkgbGVhdmUgdGhlIHByZW1pc2VzIHdpdGhvdXQgYWNrbm93bGVkZ2luZyB0aGlzIG1pc3NpbmcgZmVhdHVyZS5cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnWW91IGdvdCBpdCwgY2hpZWYnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIFwiU3RyYW5nZXIuY29pblwiOiB7XHJcbiAgICAgICAgbmFtZTogJ0Egc3RyYW5nZSBjb2luJyxcclxuICAgICAgICBwbHVyYWxOYW1lOiAnc3RyYW5nZSBjb2lucycsXHJcbiAgICAgICAgdGV4dDogXygnQm90aCBzaWRlcyBkZXBpY3QgdGhlIHNhbWUgaW1hZ2UnKSxcclxuICAgICAgICBvblVzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBfKFwiQSBzdHJhbmdlIGNvaW5cIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiT25lIGRheSB5b3UnbGwgYmUgYWJsZSB0byB1c2UgdGhpcyBpdGVtLCBidXQgcmlnaHQgbm93IHRoYXQgZnVuY3Rpb25hbGl0eSBpc24ndCBwcmVzZW50LlwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJQbGVhc2UgcG9saXRlbHkgbGVhdmUgdGhlIHByZW1pc2VzIHdpdGhvdXQgYWNrbm93bGVkZ2luZyB0aGlzIG1pc3NpbmcgZmVhdHVyZS5cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnWW91IGdvdCBpdCwgY2hpZWYnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIFwiQ2FwdGFpbi5zdXBwbGllc1wiOiB7XHJcbiAgICAgICAgbmFtZTogJ1N1cHBsaWVzIGZvciB0aGUgTWF5b3InLFxyXG4gICAgICAgIHRleHQ6ICdUaGV5XFwncmUgaGVhdnksIGJ1dCBub3QgaW4gYSB3YXkgdGhhdCBpbXBhY3RzIGdhbWVwbGF5JyxcclxuICAgICAgICBvblVzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBfKFwiU3VwcGxpZXMgZm9yIHRoZSBNYXlvclwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJBIGJpZyBib3ggb2Ygc3R1ZmYgZm9yIHRoZSB2aWxsYWdlLiBMb29rcyBsaWtlIHJhdyBtYXRlcmlhbHMsIG1vc3RseS5cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiSSBzaG91bGQgcmVhbGx5IHRha2UgdGhpcyBiYWNrIHRvIHRoZSBNYXlvci5cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnT2theScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogZmFsc2UsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgXCJvbGRMYWR5LkNhbmR5XCI6IHtcclxuICAgICAgICBuYW1lOiAnYSBwaWVjZSBvZiBoYXJkIGNhbmR5JyxcclxuICAgICAgICBwbHVyYWxOYW1lOiAncGllY2VzIG9mIGhhcmQgY2FuZHknLFxyXG4gICAgICAgIHRleHQ6ICdHaXZlbiB0byB5b3UgYnkgYSBuaWNlIG9sZCB3b21hbiBpbiBhIGNhcnJpYWdlJyxcclxuICAgICAgICBvblVzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsICdZb3UgcG9wIHRoZSBoYXJkIGNhbmR5IGludG8geW91ciBtb3V0aC4gQSBmZXcgbWludXRlcyAnIFxyXG4gICAgICAgICAgICAgICAgKyAnbGF0ZXIsIGl0XFwncyBnb25lLCBsZWF2aW5nIGJlaGluZCBvbmx5IGEgbWlsZCBzZW5zZSBvZiBndWlsdCBhYm91dCBub3QgJyBcclxuICAgICAgICAgICAgICAgICsgJ2NhbGxpbmcgeW91ciBncmFuZG1hIG1vcmUgb2Z0ZW4uJylcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogdHJ1ZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogdHJ1ZVxyXG4gICAgfSxcclxuICAgIFwiZ2FtYmxlci5Qcml6ZVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ3RydWUgbmFtZSBvZiB0aGUgZ2FtYmxlcicsXHJcbiAgICAgICAgdGV4dDogJ1lvdSB3b24gdGhpcyBpbiBhIGRpY2UgZ2FtZScsXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCAnVGhpcyBpdGVtIGhhcyBncmVhdCB2YWx1ZSwgYnV0IG5vdCBoZXJlIGFuZCBub3cuJylcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogZmFsc2UsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9XHJcbn1cclxuIiwiLy8gbWFzdGVyIGxpc3Qgb2YgcGVya3NcclxuXHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyBQZXJrIH0gZnJvbSBcIi4vcGVya1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IFBlcmtMaXN0OiB7W2lkOiBzdHJpbmddOiBQZXJrfSA9IHtcclxuICAgICd0dW1teVBhaW4nOiB7XHJcbiAgICAgICAgbmFtZTogJ1NvY2tlZCBpbiB0aGUgU3RvbWFjaCcsXHJcbiAgICAgICAgdGV4dDogJ1RoaXMgZG9lc25cXCd0IHNlZW0gbGlrZSBhIHBlcmssIHRiaCcsXHJcbiAgICAgICAgZnVsbFRleHQ6IFtcclxuICAgICAgICAgICAgXyhcIllvdSBnb3QgaGlzIGluIHRoZSBzdG9tYWNoIHJlYWxseSBoYXJkLlwiKSxcclxuICAgICAgICAgICAgXyhcIkxpa2UsIFJFQUxMWSBoYXJkLiBCeSBhIGdyaW5uaW5nIGplcmsuXCIpXHJcbiAgICAgICAgXSxcclxuICAgICAgICBpc0FjdGl2ZTogKCkgPT4gdHJ1ZSxcclxuICAgICAgICBzdGF0Qm9udXNlczogeyB9LFxyXG4gICAgICAgIHRpbWVMZWZ0OiAtMVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4vY2hhcmFjdGVyXCI7XHJcbmltcG9ydCB7IFF1ZXN0IH0gZnJvbSBcIi4vcXVlc3RcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBRdWVzdExvZzoge1tpZDogc3RyaW5nXTogUXVlc3R9ID0ge1xyXG4gICAgXCJtYXlvclN1cHBsaWVzXCI6IHtcclxuICAgICAgICBuYW1lOiBcIlN1cHBsaWVzIGZvciB0aGUgTWF5b3JcIixcclxuICAgICAgICBsb2dEZXNjcmlwdGlvbjogXCJUaGUgbWF5b3IgaGFzIGFza2VkIHlvdSB0byBnZXQgc29tZSBzdXBwbGllcyBmb3IgaGltIGZyb20gdGhlIE91dHBvc3QuXCIsXHJcbiAgICAgICAgcGhhc2VzOiB7XHJcbiAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkdvIGNoZWNrIG91dCB0aGUgUm9hZCB0byB0aGUgT3V0cG9zdCB0byBzZWUgaWYgeW91IGNhbiBmaW5kIG91dCBtb3JlXCIsXHJcbiAgICAgICAgICAgICAgICByZXF1aXJlbWVudHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlclJlcXVpcmVtZW50OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkU00uZ2V0KCdSb2FkLm9wZW4nKSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdSb2FkLmNvdW50ZXInKSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkkgc2hvdWxkIGdvIGNoZWNrIG91dCB0aGUgUm9hZCB0byB0aGUgT3V0cG9zdFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoJFNNLmdldCgnUm9hZC5vcGVuJykgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnUm9hZC5jb3VudGVyJykgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkkgc2hvdWxkIGtlZXAgZXhwbG9yaW5nIHRoZSBSb2FkIHRvIHRoZSBPdXRwb3N0XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgkU00uZ2V0KCdSb2FkLm9wZW4nKSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkkndmUgZm91bmQgdGhlIHdheSB0byB0aGUgT3V0cG9zdFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0NvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoJFNNLmdldCgnUm9hZC5vcGVuJykgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpIGFzIG51bWJlciA+IDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgMToge1xyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiQXNrIHRoZSBDYXB0YWluIG9mIHRoZSBPdXRwb3N0IGFib3V0IHRoZSBzdXBwbGllc1wiLFxyXG4gICAgICAgICAgICAgICAgcmVxdWlyZW1lbnRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJSZXF1aXJlbWVudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpIGFzIG51bWJlciA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdPdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcpID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiSSBzaG91bGQgdHJ5IHRhbGtpbmcgdG8gdGhlIENhcHRhaW4gb2YgdGhlIE91dHBvc3RcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnT3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnKSAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnT3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnKSBhcyBudW1iZXIgPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgQ2hhcmFjdGVyLmludmVudG9yeVtcIkNhcHRhaW4uc3VwcGxpZXNcIl0gPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJJIHNob3VsZCBhc2sgdGhlIENhcHRhaW4gYWJvdXQgdGhlIG1pc3Npbmcgc3VwcGxpZXNcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnT3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnKSAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnT3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnKSBhcyBudW1iZXIgPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgQ2hhcmFjdGVyLmludmVudG9yeVtcIkNhcHRhaW4uc3VwcGxpZXNcIl0gIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJJJ3ZlIGdvdHRlbiB0aGUgc3VwcGxpZXMgZnJvbSB0aGUgQ2FwdGFpblwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0NvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpIGFzIG51bWJlciA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ091dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnT3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnKSBhcyBudW1iZXIgPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAoQ2hhcmFjdGVyLmludmVudG9yeVtcIkNhcHRhaW4uc3VwcGxpZXNcIl0gIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8ICRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnKSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgMjoge1xyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiUmV0dXJuIHRoZSBzdXBwbGllcyB0byB0aGUgTWF5b3JcIixcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVtZW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyUmVxdWlyZW1lbnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnKSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAgXCJJIHNob3VsZCBoYW5kIHRoZXNlIHN1cHBsaWVzIG92ZXIgdG8gdGhlIE1heW9yXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnKSBhcyBudW1iZXIgPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkkndmUgaGFuZGVkIG92ZXIgdGhlIHN1cHBsaWVzIHRvIHRoZSBNYXlvclwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0NvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoJFNNLmdldCgndmlsbGFnZS5tYXlvci5oYXZlR2l2ZW5TdXBwbGllcycpICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnKSBhcyBudW1iZXIgPiAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8qXHJcbiAqIE1vZHVsZSBmb3IgaGFuZGxpbmcgU3RhdGVzXHJcbiAqIFxyXG4gKiBBbGwgc3RhdGVzIHNob3VsZCBiZSBnZXQgYW5kIHNldCB0aHJvdWdoIHRoZSBTdGF0ZU1hbmFnZXIgKCRTTSkuXHJcbiAqIFxyXG4gKiBUaGUgbWFuYWdlciBpcyBpbnRlbmRlZCB0byBoYW5kbGUgYWxsIG5lZWRlZCBjaGVja3MgYW5kIGVycm9yIGNhdGNoaW5nLlxyXG4gKiBUaGlzIGluY2x1ZGVzIGNyZWF0aW5nIHRoZSBwYXJlbnRzIG9mIGxheWVyZWQvZGVlcCBzdGF0ZXMgc28gdW5kZWZpbmVkIHN0YXRlc1xyXG4gKiBkbyBub3QgbmVlZCB0byBiZSB0ZXN0ZWQgZm9yIGFuZCBjcmVhdGVkIGJlZm9yZWhhbmQuXHJcbiAqIFxyXG4gKiBXaGVuIGEgc3RhdGUgaXMgY2hhbmdlZCwgYW4gdXBkYXRlIGV2ZW50IGlzIHNlbnQgb3V0IGNvbnRhaW5pbmcgdGhlIG5hbWUgb2YgdGhlIHN0YXRlXHJcbiAqIGNoYW5nZWQgb3IgaW4gdGhlIGNhc2Ugb2YgbXVsdGlwbGUgY2hhbmdlcyAoLnNldE0sIC5hZGRNKSB0aGUgcGFyZW50IGNsYXNzIGNoYW5nZWQuXHJcbiAqIEV2ZW50OiB0eXBlOiAnc3RhdGVVcGRhdGUnLCBzdGF0ZU5hbWU6IDxwYXRoIG9mIHN0YXRlIG9yIHBhcmVudCBzdGF0ZT5cclxuICogXHJcbiAqIE9yaWdpbmFsIGZpbGUgY3JlYXRlZCBieTogTWljaGFlbCBHYWx1c2hhXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4vZW5naW5lXCI7XHJcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tIFwiLi9ub3RpZmljYXRpb25zXCI7XHJcblxyXG52YXIgU3RhdGVNYW5hZ2VyID0ge1xyXG5cdFx0XHJcblx0TUFYX1NUT1JFOiA5OTk5OTk5OTk5OTk5OSxcclxuXHRcclxuXHRvcHRpb25zOiB7fSxcclxuXHRcclxuXHRpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblx0XHRcclxuXHRcdC8vY3JlYXRlIGNhdGVnb3JpZXNcclxuXHRcdHZhciBjYXRzID0gW1xyXG5cdFx0XHQnZmVhdHVyZXMnLFx0XHQvL2JpZyBmZWF0dXJlcyBsaWtlIGJ1aWxkaW5ncywgbG9jYXRpb24gYXZhaWxhYmlsaXR5LCB1bmxvY2tzLCBldGNcclxuXHRcdFx0J3N0b3JlcycsIFx0XHQvL2xpdHRsZSBzdHVmZiwgaXRlbXMsIHdlYXBvbnMsIGV0Y1xyXG5cdFx0XHQnY2hhcmFjdGVyJywgXHQvL3RoaXMgaXMgZm9yIHBsYXllcidzIGNoYXJhY3RlciBzdGF0cyBzdWNoIGFzIHBlcmtzXHJcblx0XHRcdCdpbmNvbWUnLFxyXG5cdFx0XHQndGltZXJzJyxcclxuXHRcdFx0J2dhbWUnLCBcdFx0Ly9tb3N0bHkgbG9jYXRpb24gcmVsYXRlZDogZmlyZSB0ZW1wLCB3b3JrZXJzLCBwb3B1bGF0aW9uLCB3b3JsZCBtYXAsIGV0Y1xyXG5cdFx0XHQncGxheVN0YXRzJyxcdC8vYW55dGhpbmcgcGxheSByZWxhdGVkOiBwbGF5IHRpbWUsIGxvYWRzLCBldGNcclxuXHRcdFx0J3ByZXZpb3VzJyxcdFx0Ly8gcHJlc3RpZ2UsIHNjb3JlLCB0cm9waGllcyAoaW4gZnV0dXJlKSwgYWNoaWV2ZW1lbnRzIChhZ2Fpbiwgbm90IHlldCksIGV0Y1xyXG5cdFx0XHQnb3V0Zml0J1x0XHRcdC8vIHVzZWQgdG8gdGVtcG9yYXJpbHkgc3RvcmUgdGhlIGl0ZW1zIHRvIGJlIHRha2VuIG9uIHRoZSBwYXRoXHJcblx0XHRdO1xyXG5cdFx0XHJcblx0XHRmb3IodmFyIHdoaWNoIGluIGNhdHMpIHtcclxuXHRcdFx0aWYoISRTTS5nZXQoY2F0c1t3aGljaF0pKSAkU00uc2V0KGNhdHNbd2hpY2hdLCB7fSk7IFxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvL3N1YnNjcmliZSB0byBzdGF0ZVVwZGF0ZXNcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdCQuRGlzcGF0Y2goJ3N0YXRlVXBkYXRlJykuc3Vic2NyaWJlKCRTTS5oYW5kbGVTdGF0ZVVwZGF0ZXMpO1xyXG5cclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdHdpbmRvdy4kU00gPSB0aGlzO1xyXG5cdH0sXHJcblx0XHJcblx0Ly9jcmVhdGUgYWxsIHBhcmVudHMgYW5kIHRoZW4gc2V0IHN0YXRlXHJcblx0Y3JlYXRlU3RhdGU6IGZ1bmN0aW9uKHN0YXRlTmFtZSwgdmFsdWUpIHtcclxuXHRcdHZhciB3b3JkcyA9IHN0YXRlTmFtZS5zcGxpdCgvWy5cXFtcXF0nXCJdKy8pO1xyXG5cdFx0Ly9mb3Igc29tZSByZWFzb24gdGhlcmUgYXJlIHNvbWV0aW1lcyBlbXB0eSBzdHJpbmdzXHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHdvcmRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmICh3b3Jkc1tpXSA9PT0gJycpIHtcclxuXHRcdFx0XHR3b3Jkcy5zcGxpY2UoaSwgMSk7XHJcblx0XHRcdFx0aS0tO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvLyBJTVBPUlRBTlQ6IFN0YXRlIHJlZmVycyB0byB3aW5kb3cuU3RhdGUsIHdoaWNoIEkgaGFkIHRvIGluaXRpYWxpemUgbWFudWFsbHlcclxuXHRcdC8vICAgIGluIEVuZ2luZS50czsgcGxlYXNlIGRvbid0IGZvcmdldCB0aGlzIGFuZCBtZXNzIHdpdGggYW55dGhpbmcgbmFtZWRcclxuXHRcdC8vICAgIFwiU3RhdGVcIiBvciBcIndpbmRvdy5TdGF0ZVwiLCB0aGlzIHN0dWZmIGlzIHdlaXJkbHkgcHJlY2FyaW91cyBhZnRlciB0eXBlc2NyaXB0aW5nXHJcblx0XHQvLyAgICB0aGlzIGNvZGViYXNlLCBhbmQgSSBkb24ndCBoYXZlIHRoZSBzYW5pdHkgcG9pbnRzIHRvIGZpZ3VyZSBvdXQgd2h5XHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHR2YXIgb2JqID0gU3RhdGU7XHJcblx0XHR2YXIgdyA9IG51bGw7XHJcblx0XHRmb3IodmFyIGk9MCwgbGVuPXdvcmRzLmxlbmd0aC0xO2k8bGVuO2krKyl7XHJcblx0XHRcdHcgPSB3b3Jkc1tpXTtcclxuXHRcdFx0aWYob2JqW3ddID09PSB1bmRlZmluZWQgKSBvYmpbd10gPSB7fTtcclxuXHRcdFx0b2JqID0gb2JqW3ddO1xyXG5cdFx0fVxyXG5cdFx0b2JqW3dvcmRzW2ldXSA9IHZhbHVlO1xyXG5cdFx0cmV0dXJuIG9iajtcclxuXHR9LFxyXG5cdFxyXG5cdC8vc2V0IHNpbmdsZSBzdGF0ZVxyXG5cdC8vaWYgbm9FdmVudCBpcyB0cnVlLCB0aGUgdXBkYXRlIGV2ZW50IHdvbid0IHRyaWdnZXIsIHVzZWZ1bCBmb3Igc2V0dGluZyBtdWx0aXBsZSBzdGF0ZXMgZmlyc3RcclxuXHRzZXQ6IGZ1bmN0aW9uKHN0YXRlTmFtZSwgdmFsdWUsIG5vRXZlbnQ/KSB7XHJcblx0XHR2YXIgZnVsbFBhdGggPSAkU00uYnVpbGRQYXRoKHN0YXRlTmFtZSk7XHJcblx0XHRcclxuXHRcdC8vbWFrZSBzdXJlIHRoZSB2YWx1ZSBpc24ndCBvdmVyIHRoZSBlbmdpbmUgbWF4aW11bVxyXG5cdFx0aWYodHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmIHZhbHVlID4gJFNNLk1BWF9TVE9SRSkgdmFsdWUgPSAkU00uTUFYX1NUT1JFO1xyXG5cdFx0XHJcblx0XHR0cnl7XHJcblx0XHRcdGV2YWwoJygnK2Z1bGxQYXRoKycpID0gdmFsdWUnKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Ly9wYXJlbnQgZG9lc24ndCBleGlzdCwgc28gbWFrZSBwYXJlbnRcclxuXHRcdFx0JFNNLmNyZWF0ZVN0YXRlKHN0YXRlTmFtZSwgdmFsdWUpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvL3N0b3JlcyB2YWx1ZXMgY2FuIG5vdCBiZSBuZWdhdGl2ZVxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0aWYoc3RhdGVOYW1lLmluZGV4T2YoJ3N0b3JlcycpID09PSAwICYmICRTTS5nZXQoc3RhdGVOYW1lLCB0cnVlKSA8IDApIHtcclxuXHRcdFx0ZXZhbCgnKCcrZnVsbFBhdGgrJykgPSAwJyk7XHJcblx0XHRcdEVuZ2luZS5sb2coJ1dBUk5JTkc6IHN0YXRlOicgKyBzdGF0ZU5hbWUgKyAnIGNhbiBub3QgYmUgYSBuZWdhdGl2ZSB2YWx1ZS4gU2V0IHRvIDAgaW5zdGVhZC4nKTtcclxuXHRcdH1cclxuXHJcblx0XHRFbmdpbmUubG9nKHN0YXRlTmFtZSArICcgJyArIHZhbHVlKTtcclxuXHRcdFxyXG5cdFx0aWYgKG5vRXZlbnQgPT09IHVuZGVmaW5lZCB8fCBub0V2ZW50ID09IHRydWUpIHtcclxuXHRcdFx0RW5naW5lLnNhdmVHYW1lKCk7XHJcblx0XHRcdCRTTS5maXJlVXBkYXRlKHN0YXRlTmFtZSk7XHJcblx0XHR9XHRcdFxyXG5cdH0sXHJcblx0XHJcblx0Ly9zZXRzIGEgbGlzdCBvZiBzdGF0ZXNcclxuXHRzZXRNOiBmdW5jdGlvbihwYXJlbnROYW1lLCBsaXN0LCBub0V2ZW50Pykge1xyXG5cdFx0JFNNLmJ1aWxkUGF0aChwYXJlbnROYW1lKTtcclxuXHRcdFxyXG5cdFx0Ly9tYWtlIHN1cmUgdGhlIHN0YXRlIGV4aXN0cyB0byBhdm9pZCBlcnJvcnMsXHJcblx0XHRpZigkU00uZ2V0KHBhcmVudE5hbWUpID09PSB1bmRlZmluZWQpICRTTS5zZXQocGFyZW50TmFtZSwge30sIHRydWUpO1xyXG5cdFx0XHJcblx0XHRmb3IodmFyIGsgaW4gbGlzdCl7XHJcblx0XHRcdCRTTS5zZXQocGFyZW50TmFtZSsnW1wiJytrKydcIl0nLCBsaXN0W2tdLCB0cnVlKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYoIW5vRXZlbnQpIHtcclxuXHRcdFx0RW5naW5lLnNhdmVHYW1lKCk7XHJcblx0XHRcdCRTTS5maXJlVXBkYXRlKHBhcmVudE5hbWUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0Ly9zaG9ydGN1dCBmb3IgYWx0ZXJpbmcgbnVtYmVyIHZhbHVlcywgcmV0dXJuIDEgaWYgc3RhdGUgd2Fzbid0IGEgbnVtYmVyXHJcblx0YWRkOiBmdW5jdGlvbihzdGF0ZU5hbWUsIHZhbHVlLCBub0V2ZW50Pykge1xyXG5cdFx0dmFyIGVyciA9IDA7XHJcblx0XHQvLzAgaWYgdW5kZWZpbmVkLCBudWxsIChidXQgbm90IHt9KSBzaG91bGQgYWxsb3cgYWRkaW5nIHRvIG5ldyBvYmplY3RzXHJcblx0XHQvL2NvdWxkIGFsc28gYWRkIGluIGEgdHJ1ZSA9IDEgdGhpbmcsIHRvIGhhdmUgc29tZXRoaW5nIGdvIGZyb20gZXhpc3RpbmcgKHRydWUpXHJcblx0XHQvL3RvIGJlIGEgY291bnQsIGJ1dCB0aGF0IG1pZ2h0IGJlIHVud2FudGVkIGJlaGF2aW9yIChhZGQgd2l0aCBsb29zZSBldmFsIHByb2JhYmx5IHdpbGwgaGFwcGVuIGFueXdheXMpXHJcblx0XHR2YXIgb2xkID0gJFNNLmdldChzdGF0ZU5hbWUsIHRydWUpO1xyXG5cdFx0XHJcblx0XHQvL2NoZWNrIGZvciBOYU4gKG9sZCAhPSBvbGQpIGFuZCBub24gbnVtYmVyIHZhbHVlc1xyXG5cdFx0aWYob2xkICE9IG9sZCl7XHJcblx0XHRcdEVuZ2luZS5sb2coJ1dBUk5JTkc6ICcrc3RhdGVOYW1lKycgd2FzIGNvcnJ1cHRlZCAoTmFOKS4gUmVzZXR0aW5nIHRvIDAuJyk7XHJcblx0XHRcdG9sZCA9IDA7XHJcblx0XHRcdCRTTS5zZXQoc3RhdGVOYW1lLCBvbGQgKyB2YWx1ZSwgbm9FdmVudCk7XHJcblx0XHR9IGVsc2UgaWYodHlwZW9mIG9sZCAhPSAnbnVtYmVyJyB8fCB0eXBlb2YgdmFsdWUgIT0gJ251bWJlcicpe1xyXG5cdFx0XHRFbmdpbmUubG9nKCdXQVJOSU5HOiBDYW4gbm90IGRvIG1hdGggd2l0aCBzdGF0ZTonK3N0YXRlTmFtZSsnIG9yIHZhbHVlOicrdmFsdWUrJyBiZWNhdXNlIGF0IGxlYXN0IG9uZSBpcyBub3QgYSBudW1iZXIuJyk7XHJcblx0XHRcdGVyciA9IDE7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkU00uc2V0KHN0YXRlTmFtZSwgb2xkICsgdmFsdWUsIG5vRXZlbnQpOyAvL3NldFN0YXRlIGhhbmRsZXMgZXZlbnQgYW5kIHNhdmVcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGVycjtcclxuXHR9LFxyXG5cdFxyXG5cdC8vYWx0ZXJzIG11bHRpcGxlIG51bWJlciB2YWx1ZXMsIHJldHVybiBudW1iZXIgb2YgZmFpbHNcclxuXHRhZGRNOiBmdW5jdGlvbihwYXJlbnROYW1lLCBsaXN0LCBub0V2ZW50Pykge1xyXG5cdFx0dmFyIGVyciA9IDA7XHJcblx0XHRcclxuXHRcdC8vbWFrZSBzdXJlIHRoZSBwYXJlbnQgZXhpc3RzIHRvIGF2b2lkIGVycm9yc1xyXG5cdFx0aWYoJFNNLmdldChwYXJlbnROYW1lKSA9PT0gdW5kZWZpbmVkKSAkU00uc2V0KHBhcmVudE5hbWUsIHt9LCB0cnVlKTtcclxuXHRcdFxyXG5cdFx0Zm9yKHZhciBrIGluIGxpc3Qpe1xyXG5cdFx0XHRpZigkU00uYWRkKHBhcmVudE5hbWUrJ1tcIicraysnXCJdJywgbGlzdFtrXSwgdHJ1ZSkpIGVycisrO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZighbm9FdmVudCkge1xyXG5cdFx0XHRFbmdpbmUuc2F2ZUdhbWUoKTtcclxuXHRcdFx0JFNNLmZpcmVVcGRhdGUocGFyZW50TmFtZSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZXJyO1xyXG5cdH0sXHJcblx0XHJcblx0Ly9yZXR1cm4gc3RhdGUsIHVuZGVmaW5lZCBvciAwXHJcblx0Z2V0OiBmdW5jdGlvbihzdGF0ZU5hbWUsIHJlcXVlc3RaZXJvPyk6IHN0cmluZyB8IHVuZGVmaW5lZCB8IE51bWJlciB8IG51bGwgfCBCb29sZWFuIHtcclxuXHRcdHZhciB3aGljaFN0YXRlOiB1bmRlZmluZWQgfCBudWxsIHwgTnVtYmVyIHwgc3RyaW5nID0gbnVsbDtcclxuXHRcdHZhciBmdWxsUGF0aCA9ICRTTS5idWlsZFBhdGgoc3RhdGVOYW1lKTtcclxuXHRcdFxyXG5cdFx0Ly9jYXRjaCBlcnJvcnMgaWYgcGFyZW50IG9mIHN0YXRlIGRvZXNuJ3QgZXhpc3RcclxuXHRcdHRyeXtcclxuXHRcdFx0ZXZhbCgnd2hpY2hTdGF0ZSA9ICgnK2Z1bGxQYXRoKycpJyk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdHdoaWNoU3RhdGUgPSB1bmRlZmluZWQ7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vcHJldmVudHMgcmVwZWF0ZWQgaWYgdW5kZWZpbmVkLCBudWxsLCBmYWxzZSBvciB7fSwgdGhlbiB4ID0gMCBzaXR1YXRpb25zXHJcblx0XHRpZigoIXdoaWNoU3RhdGVcclxuXHRcdFx0Ly8gIHx8IHdoaWNoU3RhdGUgPT0ge31cclxuXHRcdFx0KSAmJiByZXF1ZXN0WmVybykgcmV0dXJuIDA7XHJcblx0XHRlbHNlIHJldHVybiB3aGljaFN0YXRlO1xyXG5cdH0sXHJcblx0XHJcblx0Ly9tYWlubHkgZm9yIGxvY2FsIGNvcHkgdXNlLCBhZGQoTSkgY2FuIGZhaWwgc28gd2UgY2FuJ3Qgc2hvcnRjdXQgdGhlbVxyXG5cdC8vc2luY2Ugc2V0IGRvZXMgbm90IGZhaWwsIHdlIGtub3cgc3RhdGUgZXhpc3RzIGFuZCBjYW4gc2ltcGx5IHJldHVybiB0aGUgb2JqZWN0XHJcblx0c2V0Z2V0OiBmdW5jdGlvbihzdGF0ZU5hbWUsIHZhbHVlLCBub0V2ZW50Pyl7XHJcblx0XHQkU00uc2V0KHN0YXRlTmFtZSwgdmFsdWUsIG5vRXZlbnQpO1xyXG5cdFx0cmV0dXJuIGV2YWwoJygnKyRTTS5idWlsZFBhdGgoc3RhdGVOYW1lKSsnKScpO1xyXG5cdH0sXHJcblx0XHJcblx0cmVtb3ZlOiBmdW5jdGlvbihzdGF0ZU5hbWUsIG5vRXZlbnQ/KSB7XHJcblx0XHR2YXIgd2hpY2hTdGF0ZSA9ICRTTS5idWlsZFBhdGgoc3RhdGVOYW1lKTtcclxuXHRcdHRyeXtcclxuXHRcdFx0ZXZhbCgnKGRlbGV0ZSAnK3doaWNoU3RhdGUrJyknKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Ly9pdCBkaWRuJ3QgZXhpc3QgaW4gdGhlIGZpcnN0IHBsYWNlXHJcblx0XHRcdEVuZ2luZS5sb2coJ1dBUk5JTkc6IFRyaWVkIHRvIHJlbW92ZSBub24tZXhpc3RhbnQgc3RhdGUgXFwnJytzdGF0ZU5hbWUrJ1xcJy4nKTtcclxuXHRcdH1cclxuXHRcdGlmKCFub0V2ZW50KXtcclxuXHRcdFx0RW5naW5lLnNhdmVHYW1lKCk7XHJcblx0XHRcdCRTTS5maXJlVXBkYXRlKHN0YXRlTmFtZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHQvL2NyZWF0ZXMgZnVsbCByZWZlcmVuY2UgZnJvbSBpbnB1dFxyXG5cdC8vaG9wZWZ1bGx5IHRoaXMgd29uJ3QgZXZlciBuZWVkIHRvIGJlIG1vcmUgY29tcGxpY2F0ZWRcclxuXHRidWlsZFBhdGg6IGZ1bmN0aW9uKGlucHV0KXtcclxuXHRcdHZhciBkb3QgPSAoaW5wdXQuY2hhckF0KDApID09ICdbJyk/ICcnIDogJy4nOyAvL2lmIGl0IHN0YXJ0cyB3aXRoIFtmb29dIG5vIGRvdCB0byBqb2luXHJcblx0XHRyZXR1cm4gJ1N0YXRlJyArIGRvdCArIGlucHV0O1xyXG5cdH0sXHJcblx0XHJcblx0ZmlyZVVwZGF0ZTogZnVuY3Rpb24oc3RhdGVOYW1lLCBzYXZlPyl7XHJcblx0XHR2YXIgY2F0ZWdvcnkgPSAkU00uZ2V0Q2F0ZWdvcnkoc3RhdGVOYW1lKTtcclxuXHRcdGlmKHN0YXRlTmFtZSA9PSB1bmRlZmluZWQpIHN0YXRlTmFtZSA9IGNhdGVnb3J5ID0gJ2FsbCc7IC8vYmVzdCBpZiB0aGlzIGRvZXNuJ3QgaGFwcGVuIGFzIGl0IHdpbGwgdHJpZ2dlciBtb3JlIHN0dWZmXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHQkLkRpc3BhdGNoKCdzdGF0ZVVwZGF0ZScpLnB1Ymxpc2goeydjYXRlZ29yeSc6IGNhdGVnb3J5LCAnc3RhdGVOYW1lJzpzdGF0ZU5hbWV9KTtcclxuXHRcdGlmKHNhdmUpIEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdH0sXHJcblx0XHJcblx0Z2V0Q2F0ZWdvcnk6IGZ1bmN0aW9uKHN0YXRlTmFtZSl7XHJcblx0XHR2YXIgZmlyc3RPQiA9IHN0YXRlTmFtZS5pbmRleE9mKCdbJyk7XHJcblx0XHR2YXIgZmlyc3REb3QgPSBzdGF0ZU5hbWUuaW5kZXhPZignLicpO1xyXG5cdFx0dmFyIGN1dG9mZiA9IG51bGw7XHJcblx0XHRpZihmaXJzdE9CID09IC0xIHx8IGZpcnN0RG90ID09IC0xKXtcclxuXHRcdFx0Y3V0b2ZmID0gZmlyc3RPQiA+IGZpcnN0RG90ID8gZmlyc3RPQiA6IGZpcnN0RG90O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y3V0b2ZmID0gZmlyc3RPQiA8IGZpcnN0RG90ID8gZmlyc3RPQiA6IGZpcnN0RG90O1xyXG5cdFx0fVxyXG5cdFx0aWYgKGN1dG9mZiA9PSAtMSl7XHJcblx0XHRcdHJldHVybiBzdGF0ZU5hbWU7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gc3RhdGVOYW1lLnN1YnN0cigwLGN1dG9mZik7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblx0ICogU3RhcnQgb2Ygc3BlY2lmaWMgc3RhdGUgZnVuY3Rpb25zXHJcblx0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHRcclxuXHRoYW5kbGVTdGF0ZVVwZGF0ZXM6IGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHJcblx0fVx0XHJcbn07XHJcblxyXG4vL2FsaWFzXHJcbmV4cG9ydCBjb25zdCAkU00gPSBTdGF0ZU1hbmFnZXI7XHJcbiIsImltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tICcuL25vdGlmaWNhdGlvbnMnO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tICcuL3N0YXRlX21hbmFnZXInO1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tICcuL2VuZ2luZSc7XHJcblxyXG5leHBvcnQgY29uc3QgV2VhdGhlciA9IHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHJcbiAgICAgICAgLy9zdWJzY3JpYmUgdG8gc3RhdGVVcGRhdGVzXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5zdWJzY3JpYmUoV2VhdGhlci5oYW5kbGVTdGF0ZVVwZGF0ZXMpO1xyXG4gICAgfSxcclxuXHJcbiAgICBoYW5kbGVTdGF0ZVVwZGF0ZXM6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBpZiAoZS5jYXRlZ29yeSA9PSAnd2VhdGhlcicpIHtcclxuICAgICAgICAgICAgc3dpdGNoICgkU00uZ2V0KCd3ZWF0aGVyJykpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3N1bm55JzogXHJcbiAgICAgICAgICAgICAgICAgICAgV2VhdGhlci5zdGFydFN1bm55KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdjbG91ZHknOlxyXG4gICAgICAgICAgICAgICAgICAgIFdlYXRoZXIuc3RhcnRDbG91ZHkoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3JhaW55JzpcclxuICAgICAgICAgICAgICAgICAgICBXZWF0aGVyLnN0YXJ0UmFpbnkoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9sYXN0V2VhdGhlcjogJ3N1bm55JyxcclxuXHJcbiAgICBzdGFydFN1bm55OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIlRoZSBzdW4gYmVnaW5zIHRvIHNoaW5lLlwiKTtcclxuICAgICAgICBXZWF0aGVyLl9sYXN0V2VhdGhlciA9ICdzdW5ueSc7XHJcbiAgICAgICAgJCgnYm9keScpLmFuaW1hdGUoe2JhY2tncm91bmRDb2xvcjogJyNGRkZGRkYnfSwgJ3Nsb3cnKTtcclxuICAgICAgICAkKCdkaXYjc3RvcmVzOjpiZWZvcmUnKS5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6ICcjRkZGRkZGJ30sICdzbG93Jyk7XHJcbiAgICAgICAgV2VhdGhlci5tYWtlUmFpblN0b3AoKTtcclxuICAgIH0sXHJcblxyXG4gICAgc3RhcnRDbG91ZHk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmIChXZWF0aGVyLl9sYXN0V2VhdGhlciA9PSAnc3VubnknKSB7XHJcbiAgICAgICAgICAgIE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiQ2xvdWRzIHJvbGwgaW4sIG9ic2N1cmluZyB0aGUgc3VuLlwiKTtcclxuICAgICAgICB9IGVsc2UgaWYgKFdlYXRoZXIuX2xhc3RXZWF0aGVyID09ICdyYWlueScpIHtcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJUaGUgcmFpbiBicmVha3MsIGJ1dCB0aGUgY2xvdWRzIHJlbWFpbi5cIilcclxuICAgICAgICB9XHJcbiAgICAgICAgJCgnYm9keScpLmFuaW1hdGUoe2JhY2tncm91bmRDb2xvcjogJyM4Qjg3ODYnfSwgJ3Nsb3cnKTtcclxuICAgICAgICAkKCdkaXYjc3RvcmVzOjpiZWZvcmUnKS5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6ICcjOEI4Nzg2J30sICdzbG93Jyk7XHJcbiAgICAgICAgV2VhdGhlci5fbGFzdFdlYXRoZXIgPSAnY2xvdWR5JztcclxuICAgICAgICBXZWF0aGVyLm1ha2VSYWluU3RvcCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzdGFydFJhaW55OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoV2VhdGhlci5fbGFzdFdlYXRoZXIgPT0gJ3N1bm55Jykge1xyXG4gICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIlRoZSB3aW5kIHN1ZGRlbmx5IHBpY2tzIHVwLiBDbG91ZHMgcm9sbCBpbiwgaGVhdnkgd2l0aCByYWluLCBhbmQgcmFpbmRyb3BzIGZhbGwgc29vbiBhZnRlci5cIik7XHJcbiAgICAgICAgfSBlbHNlIGlmIChXZWF0aGVyLl9sYXN0V2VhdGhlciA9PSAnY2xvdWR5Jykge1xyXG4gICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIlRoZSBjbG91ZHMgdGhhdCB3ZXJlIHByZXZpb3VzbHkgY29udGVudCB0byBoYW5nIG92ZXJoZWFkIGxldCBsb29zZSBhIG1vZGVyYXRlIGRvd25wb3VyLlwiKVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAkKCdib2R5JykuYW5pbWF0ZSh7YmFja2dyb3VuZENvbG9yOiAnIzZENjk2OCd9LCAnc2xvdycpO1xyXG4gICAgICAgICQoJ2RpdiNzdG9yZXM6OmJlZm9yZScpLmFuaW1hdGUoe2JhY2tncm91bmRDb2xvcjogJyM2RDY5NjgnfSwgJ3Nsb3cnKTtcclxuICAgICAgICBXZWF0aGVyLl9sYXN0V2VhdGhlciA9ICdyYWlueSc7XHJcbiAgICAgICAgV2VhdGhlci5tYWtlSXRSYWluKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIF9sb2NhdGlvbjogJycsXHJcblxyXG4gICAgaW5pdGlhdGVXZWF0aGVyOiBmdW5jdGlvbihhdmFpbGFibGVXZWF0aGVyLCBsb2NhdGlvbikge1xyXG4gICAgICAgIGlmIChXZWF0aGVyLl9sb2NhdGlvbiA9PSAnJykgV2VhdGhlci5fbG9jYXRpb24gPSBsb2NhdGlvbjtcclxuICAgICAgICAvLyBpZiBpbiBuZXcgbG9jYXRpb24sIGVuZCB3aXRob3V0IHRyaWdnZXJpbmcgYSBuZXcgd2VhdGhlciBpbml0aWF0aW9uLCBcclxuICAgICAgICAvLyBsZWF2aW5nIHRoZSBuZXcgbG9jYXRpb24ncyBpbml0aWF0ZVdlYXRoZXIgY2FsbGJhY2sgdG8gZG8gaXRzIHRoaW5nXHJcbiAgICAgICAgZWxzZSBpZiAoV2VhdGhlci5fbG9jYXRpb24gIT0gbG9jYXRpb24pIHJldHVybjsgXHJcblxyXG4gICAgICAgIHZhciBjaG9zZW5XZWF0aGVyID0gJ25vbmUnO1xyXG4gICAgICAgIC8vZ2V0IG91ciByYW5kb20gZnJvbSAwIHRvIDFcclxuICAgICAgICB2YXIgcm5kID0gTWF0aC5yYW5kb20oKTtcclxuICBcclxuICAgICAgICAvL2luaXRpYWxpc2Ugb3VyIGN1bXVsYXRpdmUgcGVyY2VudGFnZVxyXG4gICAgICAgIHZhciBjdW11bGF0aXZlQ2hhbmNlID0gMDtcclxuICAgICAgICBmb3IgKHZhciBpIGluIGF2YWlsYWJsZVdlYXRoZXIpIHtcclxuICAgICAgICAgICAgY3VtdWxhdGl2ZUNoYW5jZSArPSBhdmFpbGFibGVXZWF0aGVyW2ldO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHJuZCA8IGN1bXVsYXRpdmVDaGFuY2UpIHtcclxuICAgICAgICAgICAgICAgIGNob3NlbldlYXRoZXIgPSBpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjaG9zZW5XZWF0aGVyICE9ICRTTS5nZXQoJ3dlYXRoZXInKSkgJFNNLnNldCgnd2VhdGhlcicsIGNob3NlbldlYXRoZXIpO1xyXG4gICAgICAgIEVuZ2luZS5zZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pbml0aWF0ZVdlYXRoZXIoYXZhaWxhYmxlV2VhdGhlciwgbG9jYXRpb24pO1xyXG4gICAgICAgIH0sIDMgKiA2MCAqIDEwMDApO1xyXG4gICAgfSxcclxuXHJcbiAgICBtYWtlSXRSYWluOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBodHRwczovL2NvZGVwZW4uaW8vYXJpY2tsZS9wZW4vWEtqTVpZXHJcbiAgICAgICAgLy9jbGVhciBvdXQgZXZlcnl0aGluZ1xyXG4gICAgICAgICQoJy5yYWluJykuZW1wdHkoKTtcclxuICAgICAgXHJcbiAgICAgICAgdmFyIGluY3JlbWVudCA9IDA7XHJcbiAgICAgICAgdmFyIGRyb3BzID0gXCJcIjtcclxuICAgICAgICB2YXIgYmFja0Ryb3BzID0gXCJcIjtcclxuICAgICAgXHJcbiAgICAgICAgd2hpbGUgKGluY3JlbWVudCA8IDEwMCkge1xyXG4gICAgICAgICAgLy9jb3VwbGUgcmFuZG9tIG51bWJlcnMgdG8gdXNlIGZvciB2YXJpb3VzIHJhbmRvbWl6YXRpb25zXHJcbiAgICAgICAgICAvL3JhbmRvbSBudW1iZXIgYmV0d2VlbiA5OCBhbmQgMVxyXG4gICAgICAgICAgdmFyIHJhbmRvSHVuZG8gPSAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDk4IC0gMSArIDEpICsgMSkpO1xyXG4gICAgICAgICAgLy9yYW5kb20gbnVtYmVyIGJldHdlZW4gNSBhbmQgMlxyXG4gICAgICAgICAgdmFyIHJhbmRvRml2ZXIgPSAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDUgLSAyICsgMSkgKyAyKSk7XHJcbiAgICAgICAgICAvL2luY3JlbWVudFxyXG4gICAgICAgICAgaW5jcmVtZW50ICs9IHJhbmRvRml2ZXI7XHJcbiAgICAgICAgICAvL2FkZCBpbiBhIG5ldyByYWluZHJvcCB3aXRoIHZhcmlvdXMgcmFuZG9taXphdGlvbnMgdG8gY2VydGFpbiBDU1MgcHJvcGVydGllc1xyXG4gICAgICAgICAgZHJvcHMgKz0gJzxkaXYgY2xhc3M9XCJkcm9wXCIgc3R5bGU9XCJsZWZ0OiAnICsgaW5jcmVtZW50ICsgJyU7IGJvdHRvbTogJyArIChyYW5kb0ZpdmVyICsgcmFuZG9GaXZlciAtIDEgKyAxMDApICsgJyU7IGFuaW1hdGlvbi1kZWxheTogMC4nICsgcmFuZG9IdW5kbyArICdzOyBhbmltYXRpb24tZHVyYXRpb246IDAuNScgKyByYW5kb0h1bmRvICsgJ3M7XCI+PGRpdiBjbGFzcz1cInN0ZW1cIiBzdHlsZT1cImFuaW1hdGlvbi1kZWxheTogMC4nICsgcmFuZG9IdW5kbyArICdzOyBhbmltYXRpb24tZHVyYXRpb246IDAuNScgKyByYW5kb0h1bmRvICsgJ3M7XCI+PC9kaXY+PGRpdiBjbGFzcz1cInNwbGF0XCIgc3R5bGU9XCJhbmltYXRpb24tZGVsYXk6IDAuJyArIHJhbmRvSHVuZG8gKyAnczsgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjUnICsgcmFuZG9IdW5kbyArICdzO1wiPjwvZGl2PjwvZGl2Pic7XHJcbiAgICAgICAgICBiYWNrRHJvcHMgKz0gJzxkaXYgY2xhc3M9XCJkcm9wXCIgc3R5bGU9XCJyaWdodDogJyArIGluY3JlbWVudCArICclOyBib3R0b206ICcgKyAocmFuZG9GaXZlciArIHJhbmRvRml2ZXIgLSAxICsgMTAwKSArICclOyBhbmltYXRpb24tZGVsYXk6IDAuJyArIHJhbmRvSHVuZG8gKyAnczsgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjUnICsgcmFuZG9IdW5kbyArICdzO1wiPjxkaXYgY2xhc3M9XCJzdGVtXCIgc3R5bGU9XCJhbmltYXRpb24tZGVsYXk6IDAuJyArIHJhbmRvSHVuZG8gKyAnczsgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjUnICsgcmFuZG9IdW5kbyArICdzO1wiPjwvZGl2PjxkaXYgY2xhc3M9XCJzcGxhdFwiIHN0eWxlPVwiYW5pbWF0aW9uLWRlbGF5OiAwLicgKyByYW5kb0h1bmRvICsgJ3M7IGFuaW1hdGlvbi1kdXJhdGlvbjogMC41JyArIHJhbmRvSHVuZG8gKyAncztcIj48L2Rpdj48L2Rpdj4nO1xyXG4gICAgICAgIH1cclxuICAgICAgXHJcbiAgICAgICAgJCgnLnJhaW4uZnJvbnQtcm93JykuYXBwZW5kKGRyb3BzKTtcclxuICAgICAgICAkKCcucmFpbi5iYWNrLXJvdycpLmFwcGVuZChiYWNrRHJvcHMpO1xyXG4gICAgfSxcclxuXHJcbiAgICBtYWtlUmFpblN0b3A6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQoJy5yYWluJykuZW1wdHkoKTtcclxuICAgIH1cclxufSJdfQ==
