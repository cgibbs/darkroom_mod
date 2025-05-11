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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL3RleHRCdWlsZGVyLnRzIiwic3JjL2xpYi90cmFuc2xhdGUudHMiLCJzcmMvc2NyaXB0L0J1dHRvbi50cyIsInNyYy9zY3JpcHQvY2hhcmFjdGVycy9jYXB0YWluLnRzIiwic3JjL3NjcmlwdC9jaGFyYWN0ZXJzL2xpei50cyIsInNyYy9zY3JpcHQvY2hhcmFjdGVycy9tYXlvci50cyIsInNyYy9zY3JpcHQvZW5naW5lLnRzIiwic3JjL3NjcmlwdC9ldmVudHMudHMiLCJzcmMvc2NyaXB0L2V2ZW50cy9yb2Fkd2FuZGVyLnRzIiwic3JjL3NjcmlwdC9oZWFkZXIudHMiLCJzcmMvc2NyaXB0L25vdGlmaWNhdGlvbnMudHMiLCJzcmMvc2NyaXB0L3BsYWNlcy9vdXRwb3N0LnRzIiwic3JjL3NjcmlwdC9wbGFjZXMvcm9hZC50cyIsInNyYy9zY3JpcHQvcGxhY2VzL3ZpbGxhZ2UudHMiLCJzcmMvc2NyaXB0L3BsYXllci9jaGFyYWN0ZXIudHMiLCJzcmMvc2NyaXB0L3BsYXllci9pdGVtTGlzdC50cyIsInNyYy9zY3JpcHQvcGxheWVyL3BlcmtMaXN0LnRzIiwic3JjL3NjcmlwdC9wbGF5ZXIvcXVlc3RMb2cudHMiLCJzcmMvc2NyaXB0L3N0YXRlX21hbmFnZXIudHMiLCJzcmMvc2NyaXB0L3dlYXRoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQSwrREFBK0Q7QUFDL0QscUNBQXFDO0FBQzlCLElBQU0sR0FBRyxHQUFHLFVBQVMsSUFBMkQ7SUFDbkYsSUFBTSxNQUFNLEdBQUcsSUFBSSxLQUFhLENBQUM7SUFDakMsS0FBSyxJQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNuQixJQUFJLE9BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRO1lBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FB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VUFBVSxHQUFHLHlEQUF5RCxHQUFHLFVBQVUsR0FBRyw0QkFBNEIsR0FBRyxVQUFVLEdBQUcsa0JBQWtCLENBQUM7WUFDemIsU0FBUyxJQUFJLGtDQUFrQyxHQUFHLFNBQVMsR0FBRyxhQUFhLEdBQUcsQ0FBQyxVQUFVLEdBQUcsVUFBVSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyx3QkFBd0IsR0FBRyxVQUFVLEdBQUcsNEJBQTRCLEdBQUcsVUFBVSxHQUFHLGtEQUFrRCxHQUFHLFVBQVUsR0FBRyw0QkFBNEIsR0FBRyxVQUFVLEdBQUcseURBQXlELEdBQUcsVUFBVSxHQUFHLDRCQUE0QixHQUFHLFVBQVUsR0FBRyxrQkFBa0IsQ0FBQztRQUNoYyxDQUFDO1FBRUQsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsWUFBWSxFQUFFO1FBQ1YsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3ZCLENBQUM7Q0FDSixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gdGV4dCBidWlsZGVyIHV0aWxpdHksIHVzZWQgZm9yIGhhbmRsaW5nIGNvbmRpdGlvbmFsIHRleHQgaW4gXHJcbi8vIGRlc2NyaXB0aW9ucyBhbmQgb3RoZXIgdGV4dCBibHVyYnNcclxuZXhwb3J0IGNvbnN0IF90YiA9IGZ1bmN0aW9uKHRleHQ6IEFycmF5PHN0cmluZyB8IHsgdGV4dDogc3RyaW5nLCBpc1Zpc2libGU6IEZ1bmN0aW9uIH0+KSB7XHJcbiAgICBjb25zdCBvdXRwdXQgPSBuZXcgQXJyYXk8c3RyaW5nPjtcclxuICAgIGZvciAoY29uc3QgaSBpbiB0ZXh0KSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZih0ZXh0W2ldKSA9PT0gXCJzdHJpbmdcIikgb3V0cHV0LnB1c2godGV4dFtpXSk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICgodGV4dFtpXSBhcyB7dGV4dDogc3RyaW5nLCBpc1Zpc2libGU6IEZ1bmN0aW9ufSkuaXNWaXNpYmxlKCkpIHtcclxuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKCh0ZXh0W2ldIGFzIHt0ZXh0OiBzdHJpbmcsIGlzVmlzaWJsZTogRnVuY3Rpb259KS50ZXh0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBvdXRwdXQ7XHJcbn0iLCIvLyAoZnVuY3Rpb24oKSB7XHJcblxyXG4vLyBcdHZhciB0cmFuc2xhdGUgPSBmdW5jdGlvbih0ZXh0KVxyXG4vLyBcdHtcclxuLy8gXHRcdHZhciB4bGF0ZSA9IHRyYW5zbGF0ZUxvb2t1cCh0ZXh0KTtcclxuXHRcdFxyXG4vLyBcdFx0aWYgKHR5cGVvZiB4bGF0ZSA9PSBcImZ1bmN0aW9uXCIpXHJcbi8vIFx0XHR7XHJcbi8vIFx0XHRcdHhsYXRlID0geGxhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuLy8gXHRcdH1cclxuLy8gXHRcdGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKVxyXG4vLyBcdFx0e1xyXG4vLyBcdFx0XHR2YXIgYXBzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xyXG4vLyBcdFx0XHR2YXIgYXJncyA9IGFwcy5jYWxsKCBhcmd1bWVudHMsIDEgKTtcclxuICBcclxuLy8gXHRcdFx0eGxhdGUgPSBmb3JtYXR0ZXIoeGxhdGUsIGFyZ3MpO1xyXG4vLyBcdFx0fVxyXG5cdFx0XHJcbi8vIFx0XHRyZXR1cm4geGxhdGU7XHJcbi8vIFx0fTtcclxuXHRcclxuLy8gXHQvLyBJIHdhbnQgaXQgYXZhaWxhYmxlIGV4cGxpY2l0eSBhcyB3ZWxsIGFzIHZpYSB0aGUgb2JqZWN0XHJcbi8vIFx0dHJhbnNsYXRlLnRyYW5zbGF0ZSA9IHRyYW5zbGF0ZTtcclxuXHRcclxuLy8gXHQvL2Zyb20gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vNzc2MTk2IHZpYSBodHRwOi8vZGF2ZWRhc2guY29tLzIwMTAvMTEvMTkvcHl0aG9uaWMtc3RyaW5nLWZvcm1hdHRpbmctaW4tamF2YXNjcmlwdC8gXHJcbi8vIFx0dmFyIGRlZmF1bHRGb3JtYXR0ZXIgPSAoZnVuY3Rpb24oKSB7XHJcbi8vIFx0XHR2YXIgcmUgPSAvXFx7KFtefV0rKVxcfS9nO1xyXG4vLyBcdFx0cmV0dXJuIGZ1bmN0aW9uKHMsIGFyZ3MpIHtcclxuLy8gXHRcdFx0cmV0dXJuIHMucmVwbGFjZShyZSwgZnVuY3Rpb24oXywgbWF0Y2gpeyByZXR1cm4gYXJnc1ttYXRjaF07IH0pO1xyXG4vLyBcdFx0fTtcclxuLy8gXHR9KCkpO1xyXG4vLyBcdHZhciBmb3JtYXR0ZXIgPSBkZWZhdWx0Rm9ybWF0dGVyO1xyXG4vLyBcdHRyYW5zbGF0ZS5zZXRGb3JtYXR0ZXIgPSBmdW5jdGlvbihuZXdGb3JtYXR0ZXIpXHJcbi8vIFx0e1xyXG4vLyBcdFx0Zm9ybWF0dGVyID0gbmV3Rm9ybWF0dGVyO1xyXG4vLyBcdH07XHJcblx0XHJcbi8vIFx0dHJhbnNsYXRlLmZvcm1hdCA9IGZ1bmN0aW9uKClcclxuLy8gXHR7XHJcbi8vIFx0XHR2YXIgYXBzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xyXG4vLyBcdFx0dmFyIHMgPSBhcmd1bWVudHNbMF07XHJcbi8vIFx0XHR2YXIgYXJncyA9IGFwcy5jYWxsKCBhcmd1bWVudHMsIDEgKTtcclxuICBcclxuLy8gXHRcdHJldHVybiBmb3JtYXR0ZXIocywgYXJncyk7XHJcbi8vIFx0fTtcclxuXHJcbi8vIFx0dmFyIGR5bm9UcmFucyA9IG51bGw7XHJcbi8vIFx0dHJhbnNsYXRlLnNldER5bmFtaWNUcmFuc2xhdG9yID0gZnVuY3Rpb24obmV3RHlub1RyYW5zKVxyXG4vLyBcdHtcclxuLy8gXHRcdGR5bm9UcmFucyA9IG5ld0R5bm9UcmFucztcclxuLy8gXHR9O1xyXG5cclxuLy8gXHR2YXIgdHJhbnNsYXRpb24gPSBudWxsO1xyXG4vLyBcdHRyYW5zbGF0ZS5zZXRUcmFuc2xhdGlvbiA9IGZ1bmN0aW9uKG5ld1RyYW5zbGF0aW9uKVxyXG4vLyBcdHtcclxuLy8gXHRcdHRyYW5zbGF0aW9uID0gbmV3VHJhbnNsYXRpb247XHJcbi8vIFx0fTtcclxuXHRcclxuLy8gXHRmdW5jdGlvbiB0cmFuc2xhdGVMb29rdXAodGFyZ2V0KVxyXG4vLyBcdHtcclxuLy8gXHRcdGlmICh0cmFuc2xhdGlvbiA9PSBudWxsIHx8IHRhcmdldCA9PSBudWxsKVxyXG4vLyBcdFx0e1xyXG4vLyBcdFx0XHRyZXR1cm4gdGFyZ2V0O1xyXG4vLyBcdFx0fVxyXG5cdFx0XHJcbi8vIFx0XHRpZiAodGFyZ2V0IGluIHRyYW5zbGF0aW9uID09IGZhbHNlKVxyXG4vLyBcdFx0e1xyXG4vLyBcdFx0XHRpZiAoZHlub1RyYW5zICE9IG51bGwpXHJcbi8vIFx0XHRcdHtcclxuLy8gXHRcdFx0XHRyZXR1cm4gZHlub1RyYW5zKHRhcmdldCk7XHJcbi8vIFx0XHRcdH1cclxuLy8gXHRcdFx0cmV0dXJuIHRhcmdldDtcclxuLy8gXHRcdH1cclxuXHRcdFxyXG4vLyBcdFx0dmFyIHJlc3VsdCA9IHRyYW5zbGF0aW9uW3RhcmdldF07XHJcbi8vIFx0XHRpZiAocmVzdWx0ID09IG51bGwpXHJcbi8vIFx0XHR7XHJcbi8vIFx0XHRcdHJldHVybiB0YXJnZXQ7XHJcbi8vIFx0XHR9XHJcblx0XHRcclxuLy8gXHRcdHJldHVybiByZXN1bHQ7XHJcbi8vIFx0fTtcclxuXHRcclxuLy8gXHR3aW5kb3cuXyA9IHRyYW5zbGF0ZTtcclxuXHJcbi8vIH0pKCk7XHJcblxyXG4vLyBleHBvcnQgY29uc3QgXyA9IHdpbmRvdy5fO1xyXG5cclxuZXhwb3J0IGNvbnN0IF8gPSBmdW5jdGlvbihzKSB7IHJldHVybiBzOyB9IiwiaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4vZW5naW5lXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEJ1dHRvbiA9IHtcclxuXHRCdXR0b246IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHRcdGlmKHR5cGVvZiBvcHRpb25zLmNvb2xkb3duID09ICdudW1iZXInKSB7XHJcblx0XHRcdHRoaXMuZGF0YV9jb29sZG93biA9IG9wdGlvbnMuY29vbGRvd247XHJcblx0XHR9XHJcblx0XHR0aGlzLmRhdGFfcmVtYWluaW5nID0gMDtcclxuXHRcdGlmKHR5cGVvZiBvcHRpb25zLmNsaWNrID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0dGhpcy5kYXRhX2hhbmRsZXIgPSBvcHRpb25zLmNsaWNrO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR2YXIgZWwgPSAkKCc8ZGl2PicpXHJcblx0XHRcdC5hdHRyKCdpZCcsIHR5cGVvZihvcHRpb25zLmlkKSAhPSAndW5kZWZpbmVkJyA/IG9wdGlvbnMuaWQgOiBcIkJUTl9cIiArIEVuZ2luZS5nZXRHdWlkKCkpXHJcblx0XHRcdC5hZGRDbGFzcygnYnV0dG9uJylcclxuXHRcdFx0LnRleHQodHlwZW9mKG9wdGlvbnMudGV4dCkgIT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLnRleHQgOiBcImJ1dHRvblwiKVxyXG5cdFx0XHQuY2xpY2soZnVuY3Rpb24oKSB7IFxyXG5cdFx0XHRcdGlmKCEkKHRoaXMpLmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XHJcblx0XHRcdFx0XHRCdXR0b24uY29vbGRvd24oJCh0aGlzKSk7XHJcblx0XHRcdFx0XHQkKHRoaXMpLmRhdGEoXCJoYW5kbGVyXCIpKCQodGhpcykpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0LmRhdGEoXCJoYW5kbGVyXCIsICB0eXBlb2Ygb3B0aW9ucy5jbGljayA9PSAnZnVuY3Rpb24nID8gb3B0aW9ucy5jbGljayA6IGZ1bmN0aW9uKCkgeyBFbmdpbmUubG9nKFwiY2xpY2tcIik7IH0pXHJcblx0XHRcdC5kYXRhKFwicmVtYWluaW5nXCIsIDApXHJcblx0XHRcdC5kYXRhKFwiY29vbGRvd25cIiwgdHlwZW9mIG9wdGlvbnMuY29vbGRvd24gPT0gJ251bWJlcicgPyBvcHRpb25zLmNvb2xkb3duIDogMCk7XHJcblx0XHRpZiAob3B0aW9ucy5pbWFnZSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGVsLmF0dHIoXCJzdHlsZVwiLCBcImJhY2tncm91bmQtaW1hZ2U6IHVybChcXFwiXCIgKyBvcHRpb25zLmltYWdlICsgXCJcXFwiKTsgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDsgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjsgaGVpZ2h0OiAxNzBweDsgY29sb3I6IHdoaXRlO3RleHQtc2hhZG93OiAwcHggMHB4IDJweCBibGFja1wiKVxyXG5cdFx0fVxyXG5cdFx0ZWwuYXBwZW5kKCQoXCI8ZGl2PlwiKS5hZGRDbGFzcygnY29vbGRvd24nKSk7XHJcblx0XHRcclxuXHRcdGlmKG9wdGlvbnMuY29zdCkge1xyXG5cdFx0XHR2YXIgdHRQb3MgPSBvcHRpb25zLnR0UG9zID8gb3B0aW9ucy50dFBvcyA6IFwiYm90dG9tIHJpZ2h0XCI7XHJcblx0XHRcdHZhciBjb3N0VG9vbHRpcCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ3Rvb2x0aXAgJyArIHR0UG9zKTtcclxuXHRcdFx0Zm9yKHZhciBrIGluIG9wdGlvbnMuY29zdCkge1xyXG5cdFx0XHRcdCQoXCI8ZGl2PlwiKS5hZGRDbGFzcygncm93X2tleScpLnRleHQoXyhrKSkuYXBwZW5kVG8oY29zdFRvb2x0aXApO1xyXG5cdFx0XHRcdCQoXCI8ZGl2PlwiKS5hZGRDbGFzcygncm93X3ZhbCcpLnRleHQob3B0aW9ucy5jb3N0W2tdKS5hcHBlbmRUbyhjb3N0VG9vbHRpcCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY29zdFRvb2x0aXAuY2hpbGRyZW4oKS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0Y29zdFRvb2x0aXAuYXBwZW5kVG8oZWwpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmKG9wdGlvbnMud2lkdGgpIHtcclxuXHRcdFx0ZWwuY3NzKCd3aWR0aCcsIG9wdGlvbnMud2lkdGgpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gZWw7XHJcblx0fSxcclxuXHRcclxuXHRzZXREaXNhYmxlZDogZnVuY3Rpb24oYnRuLCBkaXNhYmxlZCkge1xyXG5cdFx0aWYoYnRuKSB7XHJcblx0XHRcdGlmKCFkaXNhYmxlZCAmJiAhYnRuLmRhdGEoJ29uQ29vbGRvd24nKSkge1xyXG5cdFx0XHRcdGJ0bi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdFx0fSBlbHNlIGlmKGRpc2FibGVkKSB7XHJcblx0XHRcdFx0YnRuLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGJ0bi5kYXRhKCdkaXNhYmxlZCcsIGRpc2FibGVkKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGlzRGlzYWJsZWQ6IGZ1bmN0aW9uKGJ0bikge1xyXG5cdFx0aWYoYnRuKSB7XHJcblx0XHRcdHJldHVybiBidG4uZGF0YSgnZGlzYWJsZWQnKSA9PT0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cdFxyXG5cdGNvb2xkb3duOiBmdW5jdGlvbihidG4pIHtcclxuXHRcdHZhciBjZCA9IGJ0bi5kYXRhKFwiY29vbGRvd25cIik7XHJcblx0XHRpZihjZCA+IDApIHtcclxuXHRcdFx0JCgnZGl2LmNvb2xkb3duJywgYnRuKS5zdG9wKHRydWUsIHRydWUpLndpZHRoKFwiMTAwJVwiKS5hbmltYXRlKHt3aWR0aDogJzAlJ30sIGNkICogMTAwMCwgJ2xpbmVhcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBiID0gJCh0aGlzKS5jbG9zZXN0KCcuYnV0dG9uJyk7XHJcblx0XHRcdFx0Yi5kYXRhKCdvbkNvb2xkb3duJywgZmFsc2UpO1xyXG5cdFx0XHRcdGlmKCFiLmRhdGEoJ2Rpc2FibGVkJykpIHtcclxuXHRcdFx0XHRcdGIucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0YnRuLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHRidG4uZGF0YSgnb25Db29sZG93bicsIHRydWUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0Y2xlYXJDb29sZG93bjogZnVuY3Rpb24oYnRuKSB7XHJcblx0XHQkKCdkaXYuY29vbGRvd24nLCBidG4pLnN0b3AodHJ1ZSwgdHJ1ZSk7XHJcblx0XHRidG4uZGF0YSgnb25Db29sZG93bicsIGZhbHNlKTtcclxuXHRcdGlmKCFidG4uZGF0YSgnZGlzYWJsZWQnKSkge1xyXG5cdFx0XHRidG4ucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHR9XHJcblx0fVxyXG59OyIsImltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIlxyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiXHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiXHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuLi9wbGF5ZXIvY2hhcmFjdGVyXCJcclxuXHJcbmV4cG9ydCBjb25zdCBDYXB0YWluID0ge1xyXG5cdHRhbGtUb0NhcHRhaW46IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnVGhlIENhcHRhaW5cXCdzIFRlbnQnKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICBzZWVuRmxhZzogKCkgPT4gJFNNLmdldCgnT3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnKSxcclxuXHRcdFx0XHRcdG5leHRTY2VuZTogJ21haW4nLFxyXG5cdFx0XHRcdFx0b25Mb2FkOiAoKSA9PiAkU00uc2V0KCdPdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcsIDEpLFxyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdZb3UgZW50ZXIgdGhlIGZhbmNpZXN0LWxvb2tpbmcgdGVudCBpbiB0aGUgT3V0cG9zdC4gQSBsYXJnZSBtYW4gd2l0aCBhIHRvb3RoYnJ1c2ggbXVzdGFjaGUgYW5kIGEgc2V2ZXJlIGZyb3duIGxvb2tzIHVwIGZyb20gaGlzIGRlc2suJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiU2lyLCB5b3UgaGF2ZSBlbnRlcmVkIHRoZSB0ZW50IG9mIENhcHRhaW4gRmlubmVhcy4gV2hhdCBidXNpbmVzcyBkbyB5b3UgaGF2ZSBoZXJlP1wiJylcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Fza0Fib3V0U3VwcGxpZXMnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBc2sgQWJvdXQgU3VwcGxpZXMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6J2Fza0Fib3V0U3VwcGxpZXMnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiBDYXB0YWluLmhhbmRsZVN1cHBsaWVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlOiAoKSA9PiAhJFNNLmdldCgnT3V0cG9zdC5jYXB0YWluLmFza2VkQWJvdXRTdXBwbGllcycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhc2tBYm91dENhcHRhaW4nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBc2sgQWJvdXQgQ2FwdGFpbicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTogJ2NhcHRhaW5SYW1ibGUnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnbGVhdmUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdMZWF2ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICdtYWluJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnVGhlIENhcHRhaW4gZ3JlZXRzIHlvdSB3YXJtbHkuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiQWhoLCB5ZXMsIHdlbGNvbWUgYmFjay4gV2hhdCBjYW4gSSBkbyBmb3IgeW91P1wiJylcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Fza0Fib3V0U3VwcGxpZXMnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBc2sgQWJvdXQgU3VwcGxpZXMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6J2Fza0Fib3V0U3VwcGxpZXMnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiBDYXB0YWluLmhhbmRsZVN1cHBsaWVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlOiAoKSA9PiAhJFNNLmdldCgnT3V0cG9zdC5jYXB0YWluLmFza2VkQWJvdXRTdXBwbGllcycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhc2tBYm91dENhcHRhaW4nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBc2sgQWJvdXQgQ2FwdGFpbicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTonY2FwdGFpblJhbWJsZSd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0xlYXZlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgJ2NhcHRhaW5SYW1ibGUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdUaGUgQ2FwdGFpblxcJ3MgZXllcyBnbGVhbSBhdCB0aGUgb3Bwb3J0dW5pdHkgdG8gcnVuIGRvd24gaGlzIGxpc3Qgb2YgYWNoaWV2ZW1lbnRzLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIldoeSwgSVxcJ2xsIGhhdmUgeW91IGtub3cgdGhhdCB5b3Ugc3RhbmQgaW4gdGhlIHByZXNlbmNlIG9mIG5vbmUgb3RoZXIgdGhhbiBGaW5uZWFzIEouIEZvYnNsZXksIENhcHRhaW4gb2YgdGhlIFJveWFsIEFybXlcXCdzIEZpZnRoIERpdmlzaW9uLCB0aGUgZmluZXN0IERpdmlzaW9uIGluIEhpcyBNYWplc3R5XFwncyBzZXJ2aWNlLlwiJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ0hlIHB1ZmZzIG91dCBoaXMgY2hlc3QsIGRyYXdpbmcgYXR0ZW50aW9uIHRvIGhpcyBtYW55IG1lZGFscy4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCJJIGhhdmUgY2FtcGFpZ25lZCBvbiBiZWhhbGYgb2YgT3VyIExvcmRzaGlwIGFjcm9zcyBtYW55IGxhbmRzLCBpbmNsdWRpbmcgVGhlIEZhciBXZXN0LCB0aGUgbm9ydGhlcm4gYm9yZGVycyBvZiBVbWJlcnNoaXJlIGFuZCBQZWxpbmdhbCwgTmV3IEJlbGxpc2lhLCBhbmQgZWFjaCBvZiB0aGUgRml2ZSBJc2xlcyBvZiB0aGUgUGlycmhpYW4gU2VhLlwiJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ0hlIHBhdXNlcyBmb3IgYSBtb21lbnQsIHBlcmhhcHMgdG8gc2VlIGlmIHlvdSBhcmUgc3VpdGFibHkgaW1wcmVzc2VkLCB0aGVuIGNvbnRpbnVlcy4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCJBcyBDYXB0YWluIG9mIHRoZSBGaWZ0aCBEaXZpc2lvbiwgSSBoYWQgdGhlIGVzdGVlbWVkIHByaXZpbGVnZSBvZiBlbnN1cmluZyB0aGUgc2FmZXR5IG9mIHRoZXNlIGxhbmRzIGZvciBvdXIgZmFpciBjaXRpemVucy4gSSBoYXZlIGJlZW4gYXdhcmRlZCBtYW55IHRpbWVzIG92ZXIgZm9yIG15IGJyYXZlcnkgaW4gdGhlIGZhY2Ugb2YgdXRtb3N0IHBlcmlsLiBGb3IgaW5zdGFuY2UsIGR1cmluZyB0aGUgU2VhIENhbXBhaWduIG9uIFRoeXBwZSwgVGhpcmQgb2YgdGhlIEZpdmUgSXNsZXMsIHdlIHdlcmUgYW1idXNoZWQgd2hpbGUgZGlzZW1iYXJraW5nIGZyb20gb3VyIHNoaXAuIFRoaW5raW5nIHF1aWNrbHksIEkuLi5cIicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdUaGUgY2FwdGFpbiBjb250aW51ZXMgdG8gcmFtYmxlIGxpa2UgdGhpcyBmb3Igc2V2ZXJhbCBtb3JlIG1pbnV0ZXMsIGdpdmluZyB5b3UgdGltZSB0byBiZWNvbWUgbXVjaCBtb3JlIGZhbWlsaWFyIHdpdGggdGhlIGRpcnQgdW5kZXIgeW91ciBmaW5nZXJuYWlscy4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCIuLi4gYW5kIFRIQVQsIG15IGdvb2QgYWR2ZW50dXJlciwgaXMgd2h5IEkgYWx3YXlzIGtlZXAgZnJlc2ggYmFzaWwgb24gaGFuZC5cIicpXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdmYXNjaW5hdGluZyc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0Zhc2NpbmF0aW5nJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOidtYWluQ29udGludWVkJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAnbWFpbkNvbnRpbnVlZCc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1RoZSBDYXB0YWluIHNodWZmbGVzIGhpcyBwYXBlcnMgaW4gYSBzb21ld2hhdCBwZXJmb3JtYXRpdmUgd2F5LicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIldhcyB0aGVyZSBzb21ldGhpbmcgZWxzZSB5b3UgbmVlZGVkP1wiJylcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Fza0Fib3V0U3VwcGxpZXMnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBc2sgQWJvdXQgU3VwcGxpZXMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6J2Fza0Fib3V0U3VwcGxpZXMnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiBDYXB0YWluLmhhbmRsZVN1cHBsaWVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlOiAoKSA9PiAhJFNNLmdldCgnT3V0cG9zdC5jYXB0YWluLmFza2VkQWJvdXRTdXBwbGllcycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhc2tBYm91dENhcHRhaW4nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBc2sgQWJvdXQgQ2FwdGFpbicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTonY2FwdGFpblJhbWJsZSd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0xlYXZlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgJ2Fza0Fib3V0U3VwcGxpZXMnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdUaGUgQ2FwdGFpblxcJ3MgZXllcyBnbGVhbSB3aXRoIGEgbWl4dHVyZSBvZiByZWFsaXphdGlvbiBhbmQgZ3VpbHQuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiQWhoLCB5ZXMsIHJpZ2h0LCB0aGUgc3VwcGxpZXMuIEkgc3VwcG9zZSB0aGUgTWF5b3IgaXMgc3RpbGwgd2FpdGluZyBmb3IgdGhvc2UuIEhhdmUgYSBsb29rIGluIHRoYXQgY2hlc3Qgb3ZlciB0aGVyZSwgaXQgc2hvdWxkIGhhdmUgZXZlcnl0aGluZyB5b3UgbmVlZC5cIicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdIZSBpbmRpY2F0ZXMgdG8gYSBjaGVzdCBhdCB0aGUgYmFjayBvZiB0aGUgcm9vbS4gWW91IG9wZW4gdGhlIGxpZCwgcmV2ZWFsaW5nIHRoZSBzdXBwbGllcyB3aXRoaW4uJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1lvdSB0YWtlIHRoZSBzdXBwbGllcy4nKVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0dvb2QgU3R1ZmYnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG5cclxuICAgIGhhbmRsZVN1cHBsaWVzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAkU00uc2V0KCdPdXRwb3N0LmNhcHRhaW4uYXNrZWRBYm91dFN1cHBsaWVzJywgMSk7XHJcbiAgICAgICAgQ2hhcmFjdGVyLmFkZFRvSW52ZW50b3J5KFwiQ2FwdGFpbi5zdXBwbGllc1wiKTtcclxuICAgICAgICBDaGFyYWN0ZXIuY2hlY2tRdWVzdFN0YXR1cyhcIm1heW9yU3VwcGxpZXNcIik7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyBWaWxsYWdlIH0gZnJvbSBcIi4uL3BsYWNlcy92aWxsYWdlXCI7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuLi9wbGF5ZXIvY2hhcmFjdGVyXCI7XHJcblxyXG5leHBvcnQgY29uc3QgTGl6ID0ge1xyXG4gICAgc2V0TGl6QWN0aXZlOiBmdW5jdGlvbigpIHtcclxuXHRcdCRTTS5zZXQoJ3ZpbGxhZ2UubGl6QWN0aXZlJywgMSk7XHJcblx0XHQkU00uc2V0KCd2aWxsYWdlLmxpei5jYW5GaW5kQm9vaycsIDApO1xyXG5cdFx0JFNNLnNldCgndmlsbGFnZS5saXouaGFzQm9vaycsIDEpO1xyXG5cdFx0VmlsbGFnZS51cGRhdGVCdXR0b24oKTtcclxuXHR9LFxyXG5cclxuXHR0YWxrVG9MaXo6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnTGl6XFwncyBob3VzZSwgYXQgdGhlIGVkZ2Ugb2YgdG93bicpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0c2VlbkZsYWc6ICgpID0+ICRTTS5nZXQoJ3ZpbGxhZ2UubGl6LmhhdmVNZXQnKSxcclxuXHRcdFx0XHRcdG5leHRTY2VuZTogJ21haW4nLFxyXG5cdFx0XHRcdFx0b25Mb2FkOiAoKSA9PiAkU00uc2V0KCd2aWxsYWdlLmxpei5oYXZlTWV0JywgMSksXHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1lvdSBlbnRlciB0aGUgYnVpbGRpbmcgYW5kIGFyZSBpbW1lZGlhdGVseSBwbHVuZ2VkIGludG8gYSBsYWJ5cmludGggb2Ygc2hlbHZlcyBoYXBoYXphcmRseSBmaWxsZWQgd2l0aCBib29rcyBvZiBhbGwga2luZHMuIEFmdGVyIGEgYml0IG9mIHNlYXJjaGluZywgeW91IGZpbmQgYSBzaWRlIHJvb20gd2hlcmUgYSB3b21hbiB3aXRoIG1vdXN5IGhhaXIgYW5kIGdsYXNzZXMgaXMgc2l0dGluZyBhdCBhIHdyaXRpbmcgZGVzay4gU2hlXFwncyByZWFkaW5nIGEgbGFyZ2UgYm9vayB0aGF0IGFwcGVhcnMgdG8gaW5jbHVkZSBkaWFncmFtcyBvZiBzb21lIHNvcnQgb2YgcGxhbnQuIFNoZSBsb29rcyB1cCBhcyB5b3UgZW50ZXIgdGhlIHJvb20uJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiV2hvIHRoZSBoZWxsIGFyZSB5b3U/XCInKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2Fza0Fib3V0VG93bic6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgYWJvdXQgQ2hhZHRvcGlhJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2NoYWR0b3BpYVJhbWJsZSd9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdxdWVzdCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgZm9yIGEgcXVlc3QnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAncXVlc3RSZXF1ZXN0J31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0xlYXZlJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnY2hhZHRvcGlhUmFtYmxlJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdMaXogbG9va3MgYXQgeW91IGZvciBhIG1vbWVudCBiZWZvcmUgcmV0dXJuaW5nIGhlciBnYXplIHRvIHRoZSBib29rIGluIGZyb250IG9mIGhlci4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJUaGVyZVxcJ3MgYSBib29rIGluIGhlcmUgc29tZXdoZXJlIGFib3V0IHRoZSBmb3VuZGluZyBvZiBDaGFkdG9waWEuIElmIHlvdSBjYW4gZmluZCBpdCwgeW91XFwncmUgZnJlZSB0byBib3Jyb3cgaXQuXCInKV0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdva2F5Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ09rYXksIHRoZW4uJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ21haW4nfSxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogKCkgPT4gJFNNLnNldCgndmlsbGFnZS5saXouY2FuRmluZEJvb2snLCB0cnVlKVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHJcblx0XHRcdFx0J21haW4nOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXygnTGl6IHNlZW1zIGRldGVybWluZWQgbm90IHRvIHBheSBhdHRlbnRpb24gdG8geW91LicpXSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2Fza0Fib3V0VG93bic6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgYWJvdXQgQ2hhZHRvcGlhJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2NoYWR0b3BpYVJhbWJsZSd9LFxyXG5cdFx0XHRcdFx0XHRcdGF2YWlsYWJsZTogKCkgPT4gISRTTS5nZXQoJ3ZpbGxhZ2UubGl6LmNhbkZpbmRCb29rJylcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J3F1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBmb3IgYSBxdWVzdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdxdWVzdFJlcXVlc3QnfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnZmluZEJvb2snOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnVHJ5IHRvIGZpbmQgdGhlIGJvb2snKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnZmluZEJvb2snfSxcclxuXHRcdFx0XHRcdFx0XHQvLyBUT0RPOiBhIFwidmlzaWJsZVwiIGZsYWcgd291bGQgYmUgZ29vZCBoZXJlLCBmb3Igc2l0dWF0aW9ucyB3aGVyZSBhbiBvcHRpb25cclxuXHRcdFx0XHRcdFx0XHQvLyAgIGlzbid0IHlldCBrbm93biB0byB0aGUgcGxheWVyXHJcblx0XHRcdFx0XHRcdFx0dmlzaWJsZTogKCkgPT4gJFNNLmdldCgndmlsbGFnZS5saXouY2FuRmluZEJvb2snKSxcclxuXHRcdFx0XHRcdFx0XHRhdmFpbGFibGU6ICgpID0+ICgkU00uZ2V0KCd2aWxsYWdlLmxpei5jYW5GaW5kQm9vaycpIGFzIG51bWJlciA+IDApICYmICgkU00uZ2V0KCd2aWxsYWdlLmxpei5oYXNCb29rJykpXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdsZWF2ZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdMZWF2ZScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J2ZpbmRCb29rJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdMZWF2aW5nIExpeiB0byBoZXIgYnVzaW5lc3MsIHlvdSB3YW5kZXIgYXJvdW5kIGFtaWRzdCB0aGUgYm9va3MsIHdvbmRlcmluZyBob3cgeW91XFwnbGwgZXZlciBtYW5hZ2UgdG8gZmluZCB3aGF0IHlvdVxcJ3JlIGxvb2tpbmcgZm9yIGluIGFsbCB0aGlzIHVub3JnYW5pemVkIG1lc3MuJyksXHJcblx0XHRcdFx0XHRcdF8oJ0ZvcnR1bmF0ZWx5LCB0aGUgY3JlYXRvciBvZiB0aGlzIGdhbWUgZG9lc25cXCd0IGZlZWwgbGlrZSBpdFxcJ2QgYmUgdmVyeSBpbnRlcmVzdGluZyB0byBtYWtlIHRoaXMgaW50byBhIHB1enpsZSwgc28geW91IHNwb3QgdGhlIGJvb2sgb24gYSBuZWFyYnkgc2hlbGYgYW5kIGdyYWIgaXQuJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdzaWNrJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ09oLCBzaWNrJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gJFNNLnNldCgnc3RvcmVzLldlaXJkIEJvb2snLCAxKTtcclxuXHRcdFx0XHRcdFx0XHRcdENoYXJhY3Rlci5hZGRUb0ludmVudG9yeShcIkxpei53ZWlyZEJvb2tcIik7XHJcblx0XHRcdFx0XHRcdFx0XHQkU00uc2V0KCd2aWxsYWdlLmxpei5oYXNCb29rJywgMCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQncXVlc3RSZXF1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdMaXogbGV0cyBvdXQgYW4gYW5ub3llZCBzaWdoLicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIk9oIGJyYXZlIGFkdmVudHVyZXIsIEkgc2VlbSB0byBoYXZlIGxvc3QgbXkgcGF0aWVuY2UuIFdoZW4gbGFzdCBJIHNhdyBpdCwgaXQgd2FzIHNvbWV3aGVyZSBvdXRzaWRlIG9mIHRoaXMgYnVpbGRpbmcuIFdvdWxkc3QgdGhvdSByZWNvdmVyIHRoYXQgd2hpY2ggaGFzIGJlZW4gc3RvbGVuIGZyb20gbWU/XCInKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J29rYXknOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnT2theSwgamVleiwgSSBnZXQgaXQnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnbWFpbid9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxufSIsImltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IExpeiB9IGZyb20gXCIuL2xpelwiO1xyXG5pbXBvcnQgeyBSb2FkIH0gZnJvbSBcIi4uL3BsYWNlcy9yb2FkXCI7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuLi9wbGF5ZXIvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCB7IFZpbGxhZ2UgfSBmcm9tIFwiLi4vcGxhY2VzL3ZpbGxhZ2VcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBNYXlvciA9IHtcclxuICAgIHRhbGtUb01heW9yOiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ01lZXQgdGhlIE1heW9yJyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHRzZWVuRmxhZzogKCkgPT4gJFNNLmdldCgndmlsbGFnZS5tYXlvci5oYXZlTWV0JyksXHJcblx0XHRcdFx0XHRuZXh0U2NlbmU6ICdtYWluJyxcclxuXHRcdFx0XHRcdG9uTG9hZDogKCkgPT4gJFNNLnNldCgndmlsbGFnZS5tYXlvci5oYXZlTWV0JywgMSksXHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1RoZSBtYXlvciBzbWlsZXMgYXQgeW91IGFuZCBzYXlzOicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIldlbGNvbWUgdG8gQ2hhZHRvcGlhLCBJXFwnbSB0aGUgbWF5b3Igb2YgdGhlc2UgaGVyZSBwYXJ0cy4gV2hhdCBjYW4gSSBkbyB5b3UgZm9yP1wiJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdhc2tBYm91dFRvd24nOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGFib3V0IENoYWR0b3BpYScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdjaGFkdG9waWFSYW1ibGUnfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQncXVlc3QnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGZvciBhIHF1ZXN0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ3F1ZXN0J31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0xlYXZlJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnY2hhZHRvcGlhUmFtYmxlJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdUaGUgbWF5b3IgcHVzaGVzIHRoZSBicmltIG9mIGhpcyBoYXQgdXAuJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiV2VsbCwgd2VcXCd2ZSBhbHdheXMgYmVlbiBoZXJlLCBsb25nIGFzIEkgY2FuIHJlbWVtYmVyLiBJIHRvb2sgb3ZlciBhZnRlciB0aGUgbGFzdCBtYXlvciBkaWVkLCBidXQgaGUgd291bGQgaGF2ZSBiZWVuIHRoZSBvbmx5IHBlcnNvbiB3aXRoIGFueSBoaXN0b3JpY2FsIGtub3dsZWRnZSBvZiB0aGlzIHZpbGxhZ2UuXCInKSxcclxuXHRcdFx0XHRcdFx0XygnSGUgcGF1c2VzIGZvciBhIG1vbWVudCBhbmQgdG91c2xlcyBzb21lIG9mIHRoZSB3aXNweSBoYWlycyB0aGF0IGhhdmUgcG9rZWQgb3V0IGZyb20gdW5kZXIgdGhlIHJhaXNlZCBoYXQuJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiQWN0dWFsbHksIHlvdSBtaWdodCBhc2sgTGl6LCBzaGUgaGFzIGEgYnVuY2ggb2YgaGVyIG1vdGhlclxcJ3MgYm9va3MgZnJvbSB3YXkgYmFjayB3aGVuLiBTaGUgbGl2ZXMgYXQgdGhlIGVkZ2Ugb2YgdG93bi5cIicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnb2theSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdPa2F5LCB0aGVuLicpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdtYWluJ30sXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IExpei5zZXRMaXpBY3RpdmVcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J21haW4nOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1RoZSBtYXlvciBzYXlzOicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIkFueXdheSwgd2hhdCBFTFNFIGNhbiBJIGRvIHlvdSBmb3I/XCInKSxcclxuXHRcdFx0XHRcdFx0XygnSGUgY2h1Y2tsZXMgYXQgaGlzIGNsZXZlciB1c2Ugb2YgbGFuZ3VhZ2UuJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdhc2tBYm91dFRvd24nOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGFib3V0IENoYWR0b3BpYScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdjaGFkdG9waWFSYW1ibGUnfSxcclxuXHRcdFx0XHRcdFx0XHQvLyBpbWFnZTogXCJhc3NldHMvY2FyZHMvbGl0dGxlX3dvbGYucG5nXCJcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J3F1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBmb3IgYSBxdWVzdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdxdWVzdCd9LFxyXG5cdFx0XHRcdFx0XHRcdGF2YWlsYWJsZTogKCkgPT5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIG5vdCBhdmFpbGFibGUgaWYgbWF5b3JTdXBwbGllcyBpcyBpbi1wcm9ncmVzc1xyXG5cdFx0XHRcdFx0XHRcdFx0KENoYXJhY3Rlci5xdWVzdFN0YXR1c1tcIm1heW9yU3VwcGxpZXNcIl0gPT09IHVuZGVmaW5lZClcclxuXHRcdFx0XHRcdFx0XHRcdC8vIHJlLWFkZCB0aGlzIGNvbmRpdGlvbiBsYXRlciwgd2UgbmVlZCB0byBzZW5kIHRoZW0gdG8gYSBkaWZmZXJlbnRcclxuXHRcdFx0XHRcdFx0XHRcdC8vICAgcXVlc3QgZGlhbG9nIGlmIHRoZXkgYWxyZWFkeSBkaWQgdGhlIGZpcnN0IHF1ZXN0XHJcblx0XHRcdFx0XHRcdFx0XHQvLyB8fCAoQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW1wibWF5b3JTdXBwbGllc1wiXSA9PSAtMSlcclxuXHRcdFx0XHRcdFx0XHQvLyBpbWFnZTogXCJhc3NldHMvY2FyZHMvam9rZXIucG5nXCJcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2dpdmVTdXBwbGllcyc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdIYW5kIG92ZXIgdGhlIHN1cHBsaWVzJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2dpdmVTdXBwbGllcyd9LFxyXG5cdFx0XHRcdFx0XHRcdGF2YWlsYWJsZTogKCkgPT4gXHJcblx0XHRcdFx0XHRcdFx0XHQoJFNNLmdldCgndmlsbGFnZS5tYXlvci5oYXZlR2l2ZW5TdXBwbGllcycpID09PSB1bmRlZmluZWQpIFxyXG5cdFx0XHRcdFx0XHRcdFx0JiYgKENoYXJhY3Rlci5xdWVzdFN0YXR1c1tcIm1heW9yU3VwcGxpZXNcIl0gIT09IHVuZGVmaW5lZClcclxuXHRcdFx0XHRcdFx0XHRcdCYmIENoYXJhY3Rlci5pbnZlbnRvcnlbXCJDYXB0YWluLnN1cHBsaWVzXCJdLFxyXG5cdFx0XHRcdFx0XHRcdHZpc2libGU6ICgpID0+XHJcblx0XHRcdFx0XHRcdFx0XHQoQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW1wibWF5b3JTdXBwbGllc1wiXSAhPT0gdW5kZWZpbmVkKSxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0Q2hhcmFjdGVyLnJlbW92ZUZyb21JbnZlbnRvcnkoXCJDYXB0YWluLnN1cHBsaWVzXCIpO1xyXG5cdFx0XHRcdFx0XHRcdFx0JFNNLnNldCgndmlsbGFnZS5tYXlvci5oYXZlR2l2ZW5TdXBwbGllcycsIDEpO1xyXG5cdFx0XHRcdFx0XHRcdFx0Q2hhcmFjdGVyLmNoZWNrUXVlc3RTdGF0dXMoXCJtYXlvclN1cHBsaWVzXCIpO1xyXG5cdFx0XHRcdFx0XHRcdFx0VmlsbGFnZS51cGRhdGVCdXR0b24oKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdsZWF2ZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdMZWF2ZScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0Ly8gaW1hZ2U6IFwiYXNzZXRzL2NhcmRzL3JhdmVuLnBuZ1wiXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdxdWVzdCc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnVGhlIG1heW9yIHRoaW5rcyBmb3IgYSBtb21lbnQuJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiWW91IGtub3csIGl0XFwncyBiZWVuIGEgd2hpbGUgc2luY2Ugb3VyIGxhc3Qgc2hpcG1lbnQgb2Ygc3VwcGxpZXMgYXJyaXZlZCBmcm9tIHRoZSBPdXRwb3N0LiBNaW5kIGxvb2tpbmcgaW50byB0aGF0IGZvciB1cz9cIicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIllvdSBjYW4gYXNrIGFib3V0IGl0IGF0IHRoZSBvdXRwb3N0LCBvciBqdXN0IHdhbmRlciBhcm91bmQgb24gdGhlIHJvYWQgYW5kIHNlZSBpZiB5b3UgZmluZCBhbnkgY2x1ZXMuIEVpdGhlciB3YXksIGl0XFwncyB0aW1lIHRvIGhpdCB0aGUgcm9hZCwgYWR2ZW50dXJlciFcIicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnYWxyaWdodHknOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQWxyaWdodHknKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnbWFpbid9LFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBNYXlvci5zdGFydFN1cHBsaWVzUXVlc3RcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J2dpdmVTdXBwbGllcyc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnVGhlIG1heW9yIHNtaWxlcywgYW5kIHRoZSBlZGdlcyBvZiBoaXMgZXllcyBjcmlua2xlLicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIlRoYW5rIHlvdSwgYnJhdmUgYWR2ZW50dXJlciEgV2l0aCB0aGVzZSBzdXBwbGllcywgdGhlIHZpbGxhZ2UgY2FuIG9uY2UgYWdhaW4gdGhyaXZlLlwiJyksXHJcblx0XHRcdFx0XHRcdF8oJ0hlIHRha2VzIHRoZW0gZnJvbSB5b3UgZ3JhY2lvdXNseSwgYW5kIHByb21wdGx5IGhhbmRzIHRoZW0gb2ZmIHRvIHNvbWUgd29ya2Vycywgd2hvIHF1aWNrbHkgZXJlY3QgYSBidWlsZGluZyB0aGF0IGdpdmVzIHlvdSBhIG5ldyBidXR0b24gdG8gY2xpY2snKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2ltcHJlc3NpdmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnSW1wcmVzc2l2ZSEnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0c3RhcnRTdXBwbGllc1F1ZXN0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHQvLyBpZiAoISRTTS5nZXQoJ3F1ZXN0LnN1cHBsaWVzJykpIHtcclxuXHRcdC8vIFx0Ly8gMSA9IHN0YXJ0ZWQsIDIgPSBuZXh0IHN0ZXAsIGV0Yy4gdW50aWwgY29tcGxldGVkXHJcblx0XHQvLyBcdCRTTS5zZXQoJ3F1ZXN0LnN1cHBsaWVzJywgMSk7XHJcblx0XHQvLyBcdFJvYWQuaW5pdCgpO1xyXG5cdFx0Ly8gfVxyXG5cdFx0aWYgKENoYXJhY3Rlci5xdWVzdFN0YXR1c1tcIm1heW9yU3VwcGxpZXNcIl0gPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRDaGFyYWN0ZXIuc2V0UXVlc3RTdGF0dXMoXCJtYXlvclN1cHBsaWVzXCIsIDApO1xyXG5cdFx0XHRSb2FkLmluaXQoKTtcclxuXHRcdH1cclxuXHR9XHJcbn0iLCIvLyBAdHMtbm9jaGVja1xyXG5cclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgTm90aWZpY2F0aW9ucyB9IGZyb20gXCIuL25vdGlmaWNhdGlvbnNcIjtcclxuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4vZXZlbnRzXCI7XHJcbmltcG9ydCB7IFZpbGxhZ2UgfSBmcm9tIFwiLi9wbGFjZXMvdmlsbGFnZVwiO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tIFwiLi9wbGF5ZXIvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCB7IFdlYXRoZXIgfSBmcm9tIFwiLi93ZWF0aGVyXCI7XHJcbmltcG9ydCB7IFJvYWQgfSBmcm9tIFwiLi9wbGFjZXMvcm9hZFwiO1xyXG5pbXBvcnQgeyBPdXRwb3N0IH0gZnJvbSBcIi4vcGxhY2VzL291dHBvc3RcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBFbmdpbmUgPSB3aW5kb3cuRW5naW5lID0ge1xyXG5cdFxyXG5cdFNJVEVfVVJMOiBlbmNvZGVVUklDb21wb25lbnQoXCJodHRwczovL2NnaWJicy5naXRodWIuaW8vZGFya3Jvb21fbW9kL2luZGV4Lmh0bWxcIiksXHJcblx0VkVSU0lPTjogMS4zLFxyXG5cdE1BWF9TVE9SRTogOTk5OTk5OTk5OTk5OTksXHJcblx0U0FWRV9ESVNQTEFZOiAzMCAqIDEwMDAsXHJcblx0R0FNRV9PVkVSOiBmYWxzZSxcclxuXHRcclxuXHQvL29iamVjdCBldmVudCB0eXBlc1xyXG5cdHRvcGljczoge30sXHJcblx0XHJcblx0b3B0aW9uczoge1xyXG5cdFx0c3RhdGU6IG51bGwsXHJcblx0XHRkZWJ1ZzogdHJ1ZSxcclxuXHRcdGxvZzogdHJ1ZSxcclxuXHRcdGRyb3Bib3g6IGZhbHNlLFxyXG5cdFx0ZG91YmxlVGltZTogZmFsc2VcclxuXHR9LFxyXG5cclxuXHRfZGVidWc6IGZhbHNlLFxyXG5cdFx0XHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblx0XHR0aGlzLl9kZWJ1ZyA9IHRoaXMub3B0aW9ucy5kZWJ1ZztcclxuXHRcdHRoaXMuX2xvZyA9IHRoaXMub3B0aW9ucy5sb2c7XHJcblx0XHRcclxuXHRcdC8vIENoZWNrIGZvciBIVE1MNSBzdXBwb3J0XHJcblx0XHRpZighRW5naW5lLmJyb3dzZXJWYWxpZCgpKSB7XHJcblx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9ICdicm93c2VyV2FybmluZy5odG1sJztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gQ2hlY2sgZm9yIG1vYmlsZVxyXG5cdFx0aWYoRW5naW5lLmlzTW9iaWxlKCkpIHtcclxuXHRcdFx0d2luZG93LmxvY2F0aW9uID0gJ21vYmlsZVdhcm5pbmcuaHRtbCc7XHJcblx0XHR9XHJcblxyXG5cdFx0RW5naW5lLmRpc2FibGVTZWxlY3Rpb24oKTtcclxuXHRcdFxyXG5cdFx0aWYodGhpcy5vcHRpb25zLnN0YXRlICE9IG51bGwpIHtcclxuXHRcdFx0d2luZG93LlN0YXRlID0gdGhpcy5vcHRpb25zLnN0YXRlO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0RW5naW5lLmxvYWRHYW1lKCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnbG9jYXRpb25TbGlkZXInKS5hcHBlbmRUbygnI21haW4nKTtcclxuXHJcblx0XHR2YXIgbWVudSA9ICQoJzxkaXY+JylcclxuXHRcdFx0LmFkZENsYXNzKCdtZW51JylcclxuXHRcdFx0LmFwcGVuZFRvKCdib2R5Jyk7XHJcblxyXG5cdFx0aWYodHlwZW9mIGxhbmdzICE9ICd1bmRlZmluZWQnKXtcclxuXHRcdFx0dmFyIGN1c3RvbVNlbGVjdCA9ICQoJzxzcGFuPicpXHJcblx0XHRcdFx0LmFkZENsYXNzKCdjdXN0b21TZWxlY3QnKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnbWVudUJ0bicpXHJcblx0XHRcdFx0LmFwcGVuZFRvKG1lbnUpO1xyXG5cdFx0XHR2YXIgc2VsZWN0T3B0aW9ucyA9ICQoJzxzcGFuPicpXHJcblx0XHRcdFx0LmFkZENsYXNzKCdjdXN0b21TZWxlY3RPcHRpb25zJylcclxuXHRcdFx0XHQuYXBwZW5kVG8oY3VzdG9tU2VsZWN0KTtcclxuXHRcdFx0dmFyIG9wdGlvbnNMaXN0ID0gJCgnPHVsPicpXHJcblx0XHRcdFx0LmFwcGVuZFRvKHNlbGVjdE9wdGlvbnMpO1xyXG5cdFx0XHQkKCc8bGk+JylcclxuXHRcdFx0XHQudGV4dChcImxhbmd1YWdlLlwiKVxyXG5cdFx0XHRcdC5hcHBlbmRUbyhvcHRpb25zTGlzdCk7XHJcblx0XHRcdFxyXG5cdFx0XHQkLmVhY2gobGFuZ3MsIGZ1bmN0aW9uKG5hbWUsZGlzcGxheSl7XHJcblx0XHRcdFx0JCgnPGxpPicpXHJcblx0XHRcdFx0XHQudGV4dChkaXNwbGF5KVxyXG5cdFx0XHRcdFx0LmF0dHIoJ2RhdGEtbGFuZ3VhZ2UnLCBuYW1lKVxyXG5cdFx0XHRcdFx0Lm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7IEVuZ2luZS5zd2l0Y2hMYW5ndWFnZSh0aGlzKTsgfSlcclxuXHRcdFx0XHRcdC5hcHBlbmRUbyhvcHRpb25zTGlzdCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdCQoJzxzcGFuPicpXHJcblx0XHRcdC5hZGRDbGFzcygnbGlnaHRzT2ZmIG1lbnVCdG4nKVxyXG5cdFx0XHQudGV4dChfKCdsaWdodHMgb2ZmLicpKVxyXG5cdFx0XHQuY2xpY2soRW5naW5lLnR1cm5MaWdodHNPZmYpXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHQudGV4dChfKCdoeXBlci4nKSlcclxuXHRcdFx0LmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0RW5naW5lLm9wdGlvbnMuZG91YmxlVGltZSA9ICFFbmdpbmUub3B0aW9ucy5kb3VibGVUaW1lO1xyXG5cdFx0XHRcdGlmKEVuZ2luZS5vcHRpb25zLmRvdWJsZVRpbWUpXHJcblx0XHRcdFx0XHQkKHRoaXMpLnRleHQoXygnY2xhc3NpYy4nKSk7XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0JCh0aGlzKS50ZXh0KF8oJ2h5cGVyLicpKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0LmFwcGVuZFRvKG1lbnUpO1xyXG5cclxuXHRcdCQoJzxzcGFuPicpXHJcblx0XHRcdC5hZGRDbGFzcygnbWVudUJ0bicpXHJcblx0XHRcdC50ZXh0KF8oJ3Jlc3RhcnQuJykpXHJcblx0XHRcdC5jbGljayhFbmdpbmUuY29uZmlybURlbGV0ZSlcclxuXHRcdFx0LmFwcGVuZFRvKG1lbnUpO1xyXG5cdFx0XHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHQudGV4dChfKCdzaGFyZS4nKSlcclxuXHRcdFx0LmNsaWNrKEVuZ2luZS5zaGFyZSlcclxuXHRcdFx0LmFwcGVuZFRvKG1lbnUpO1xyXG5cclxuXHRcdCQoJzxzcGFuPicpXHJcblx0XHRcdC5hZGRDbGFzcygnbWVudUJ0bicpXHJcblx0XHRcdC50ZXh0KF8oJ3NhdmUuJykpXHJcblx0XHRcdC5jbGljayhFbmdpbmUuZXhwb3J0SW1wb3J0KVxyXG5cdFx0XHQuYXBwZW5kVG8obWVudSk7XHJcblx0XHJcblx0XHQvLyBzdWJzY3JpYmUgdG8gc3RhdGVVcGRhdGVzXHJcblx0XHQkLkRpc3BhdGNoKCdzdGF0ZVVwZGF0ZScpLnN1YnNjcmliZShFbmdpbmUuaGFuZGxlU3RhdGVVcGRhdGVzKTtcclxuXHJcblx0XHQkU00uaW5pdCgpO1xyXG5cdFx0Tm90aWZpY2F0aW9ucy5pbml0KCk7XHJcblx0XHRFdmVudHMuaW5pdCgpO1xyXG5cdFx0VmlsbGFnZS5pbml0KCk7XHJcblx0XHRDaGFyYWN0ZXIuaW5pdCgpO1xyXG5cdFx0V2VhdGhlci5pbml0KCk7XHJcblx0XHRpZigkU00uZ2V0KCdSb2FkLm9wZW4nKSkge1xyXG5cdFx0XHRSb2FkLmluaXQoKTtcclxuXHRcdH1cclxuXHRcdGlmKCRTTS5nZXQoJ091dHBvc3Qub3BlbicpKSB7XHJcblx0XHRcdE91dHBvc3QuaW5pdCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdEVuZ2luZS5zYXZlTGFuZ3VhZ2UoKTtcclxuXHRcdEVuZ2luZS50cmF2ZWxUbyhWaWxsYWdlKTtcclxuXHJcblx0fSxcclxuXHRcclxuXHRicm93c2VyVmFsaWQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuICggbG9jYXRpb24uc2VhcmNoLmluZGV4T2YoICdpZ25vcmVicm93c2VyPXRydWUnICkgPj0gMCB8fCAoIHR5cGVvZiBTdG9yYWdlICE9ICd1bmRlZmluZWQnICYmICFvbGRJRSApICk7XHJcblx0fSxcclxuXHRcclxuXHRpc01vYmlsZTogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKCBsb2NhdGlvbi5zZWFyY2guaW5kZXhPZiggJ2lnbm9yZWJyb3dzZXI9dHJ1ZScgKSA8IDAgJiYgL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5L2kudGVzdCggbmF2aWdhdG9yLnVzZXJBZ2VudCApICk7XHJcblx0fSxcclxuXHRcclxuXHRzYXZlR2FtZTogZnVuY3Rpb24oKSB7XHJcblx0XHRpZih0eXBlb2YgU3RvcmFnZSAhPSAndW5kZWZpbmVkJyAmJiBsb2NhbFN0b3JhZ2UpIHtcclxuXHRcdFx0aWYoRW5naW5lLl9zYXZlVGltZXIgIT0gbnVsbCkge1xyXG5cdFx0XHRcdGNsZWFyVGltZW91dChFbmdpbmUuX3NhdmVUaW1lcik7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYodHlwZW9mIEVuZ2luZS5fbGFzdE5vdGlmeSA9PSAndW5kZWZpbmVkJyB8fCBEYXRlLm5vdygpIC0gRW5naW5lLl9sYXN0Tm90aWZ5ID4gRW5naW5lLlNBVkVfRElTUExBWSl7XHJcblx0XHRcdFx0JCgnI3NhdmVOb3RpZnknKS5jc3MoJ29wYWNpdHknLCAxKS5hbmltYXRlKHtvcGFjaXR5OiAwfSwgMTAwMCwgJ2xpbmVhcicpO1xyXG5cdFx0XHRcdEVuZ2luZS5fbGFzdE5vdGlmeSA9IERhdGUubm93KCk7XHJcblx0XHRcdH1cclxuXHRcdFx0bG9jYWxTdG9yYWdlLmdhbWVTdGF0ZSA9IEpTT04uc3RyaW5naWZ5KFN0YXRlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGxvYWRHYW1lOiBmdW5jdGlvbigpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHZhciBzYXZlZFN0YXRlID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2FtZVN0YXRlKTtcclxuXHRcdFx0aWYoc2F2ZWRTdGF0ZSkge1xyXG5cdFx0XHRcdHdpbmRvdy5TdGF0ZSA9IHNhdmVkU3RhdGU7XHJcblx0XHRcdFx0RW5naW5lLmxvZyhcImxvYWRlZCBzYXZlIVwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBjYXRjaChlKSB7XHJcblx0XHRcdEVuZ2luZS5sb2coZSk7XHJcblx0XHRcdHdpbmRvdy5TdGF0ZSA9IHt9O1xyXG5cdFx0XHQkU00uc2V0KCd2ZXJzaW9uJywgRW5naW5lLlZFUlNJT04pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0ZXhwb3J0SW1wb3J0OiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ0V4cG9ydCAvIEltcG9ydCcpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdleHBvcnQgb3IgaW1wb3J0IHNhdmUgZGF0YSwgZm9yIGJhY2tpbmcgdXAnKSxcclxuXHRcdFx0XHRcdFx0Xygnb3IgbWlncmF0aW5nIGNvbXB1dGVycycpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnZXhwb3J0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2V4cG9ydCcpLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBFbmdpbmUuZXhwb3J0NjRcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2ltcG9ydCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdpbXBvcnQnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnY29uZmlybSd9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdjYW5jZWwnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnY2FuY2VsJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnY29uZmlybSc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnYXJlIHlvdSBzdXJlPycpLFxyXG5cdFx0XHRcdFx0XHRfKCdpZiB0aGUgY29kZSBpcyBpbnZhbGlkLCBhbGwgZGF0YSB3aWxsIGJlIGxvc3QuJyksXHJcblx0XHRcdFx0XHRcdF8oJ3RoaXMgaXMgaXJyZXZlcnNpYmxlLicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQneWVzJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ3llcycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdpbnB1dEltcG9ydCd9LFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBFbmdpbmUuZW5hYmxlU2VsZWN0aW9uXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdubyc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdubycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J2lucHV0SW1wb3J0Jzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW18oJ3B1dCB0aGUgc2F2ZSBjb2RlIGhlcmUuJyldLFxyXG5cdFx0XHRcdFx0dGV4dGFyZWE6ICcnLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnb2theSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdpbXBvcnQnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBFbmdpbmUuaW1wb3J0NjRcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2NhbmNlbCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdjYW5jZWwnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGdlbmVyYXRlRXhwb3J0NjQ6IGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgc3RyaW5nNjQgPSBCYXNlNjQuZW5jb2RlKGxvY2FsU3RvcmFnZS5nYW1lU3RhdGUpO1xyXG5cdFx0c3RyaW5nNjQgPSBzdHJpbmc2NC5yZXBsYWNlKC9cXHMvZywgJycpO1xyXG5cdFx0c3RyaW5nNjQgPSBzdHJpbmc2NC5yZXBsYWNlKC9cXC4vZywgJycpO1xyXG5cdFx0c3RyaW5nNjQgPSBzdHJpbmc2NC5yZXBsYWNlKC9cXG4vZywgJycpO1xyXG5cclxuXHRcdHJldHVybiBzdHJpbmc2NDtcclxuXHR9LFxyXG5cclxuXHRleHBvcnQ2NDogZnVuY3Rpb24oKSB7XHJcblx0XHRFbmdpbmUuc2F2ZUdhbWUoKTtcclxuXHRcdHZhciBzdHJpbmc2NCA9IEVuZ2luZS5nZW5lcmF0ZUV4cG9ydDY0KCk7XHJcblx0XHRFbmdpbmUuZW5hYmxlU2VsZWN0aW9uKCk7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdFeHBvcnQnKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtfKCdzYXZlIHRoaXMuJyldLFxyXG5cdFx0XHRcdFx0dGV4dGFyZWE6IHN0cmluZzY0LFxyXG5cdFx0XHRcdFx0cmVhZG9ubHk6IHRydWUsXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdkb25lJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2dvdCBpdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IEVuZ2luZS5kaXNhYmxlU2VsZWN0aW9uXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0RW5naW5lLmF1dG9TZWxlY3QoJyNkZXNjcmlwdGlvbiB0ZXh0YXJlYScpO1xyXG5cdH0sXHJcblxyXG5cdGltcG9ydDY0OiBmdW5jdGlvbihzdHJpbmc2NCkge1xyXG5cdFx0RW5naW5lLmRpc2FibGVTZWxlY3Rpb24oKTtcclxuXHRcdHN0cmluZzY0ID0gc3RyaW5nNjQucmVwbGFjZSgvXFxzL2csICcnKTtcclxuXHRcdHN0cmluZzY0ID0gc3RyaW5nNjQucmVwbGFjZSgvXFwuL2csICcnKTtcclxuXHRcdHN0cmluZzY0ID0gc3RyaW5nNjQucmVwbGFjZSgvXFxuL2csICcnKTtcclxuXHRcdHZhciBkZWNvZGVkU2F2ZSA9IEJhc2U2NC5kZWNvZGUoc3RyaW5nNjQpO1xyXG5cdFx0bG9jYWxTdG9yYWdlLmdhbWVTdGF0ZSA9IGRlY29kZWRTYXZlO1xyXG5cdFx0bG9jYXRpb24ucmVsb2FkKCk7XHJcblx0fSxcclxuXHJcblx0Y29uZmlybURlbGV0ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdSZXN0YXJ0PycpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0dGV4dDogW18oJ3Jlc3RhcnQgdGhlIGdhbWU/JyldLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQneWVzJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ3llcycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IEVuZ2luZS5kZWxldGVTYXZlXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdubyc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdubycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0ZGVsZXRlU2F2ZTogZnVuY3Rpb24obm9SZWxvYWQpIHtcclxuXHRcdGlmKHR5cGVvZiBTdG9yYWdlICE9ICd1bmRlZmluZWQnICYmIGxvY2FsU3RvcmFnZSkge1xyXG5cdFx0XHR3aW5kb3cuU3RhdGUgPSB7fTtcclxuXHRcdFx0bG9jYWxTdG9yYWdlLmNsZWFyKCk7XHJcblx0XHR9XHJcblx0XHRpZighbm9SZWxvYWQpIHtcclxuXHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0c2hhcmU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnU2hhcmUnKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtfKCdicmluZyB5b3VyIGZyaWVuZHMuJyldLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnZmFjZWJvb2snOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnZmFjZWJvb2snKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5vcGVuKCdodHRwczovL3d3dy5mYWNlYm9vay5jb20vc2hhcmVyL3NoYXJlci5waHA/dT0nICsgRW5naW5lLlNJVEVfVVJMLCAnc2hhcmVyJywgJ3dpZHRoPTYyNixoZWlnaHQ9NDM2LGxvY2F0aW9uPW5vLG1lbnViYXI9bm8scmVzaXphYmxlPW5vLHNjcm9sbGJhcnM9bm8sc3RhdHVzPW5vLHRvb2xiYXI9bm8nKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdnb29nbGUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDpfKCdnb29nbGUrJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR3aW5kb3cub3BlbignaHR0cHM6Ly9wbHVzLmdvb2dsZS5jb20vc2hhcmU/dXJsPScgKyBFbmdpbmUuU0lURV9VUkwsICdzaGFyZXInLCAnd2lkdGg9NDgwLGhlaWdodD00MzYsbG9jYXRpb249bm8sbWVudWJhcj1ubyxyZXNpemFibGU9bm8sc2Nyb2xsYmFycz1ubyxzdGF0dXM9bm8sdG9vbGJhcj1ubycpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J3R3aXR0ZXInOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygndHdpdHRlcicpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0d2luZG93Lm9wZW4oJ2h0dHBzOi8vdHdpdHRlci5jb20vaW50ZW50L3R3ZWV0P3RleHQ9QSUyMERhcmslMjBSb29tJnVybD0nICsgRW5naW5lLlNJVEVfVVJMLCAnc2hhcmVyJywgJ3dpZHRoPTY2MCxoZWlnaHQ9MjYwLGxvY2F0aW9uPW5vLG1lbnViYXI9bm8scmVzaXphYmxlPW5vLHNjcm9sbGJhcnM9eWVzLHN0YXR1cz1ubyx0b29sYmFyPW5vJyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQncmVkZGl0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ3JlZGRpdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0d2luZG93Lm9wZW4oJ2h0dHA6Ly93d3cucmVkZGl0LmNvbS9zdWJtaXQ/dXJsPScgKyBFbmdpbmUuU0lURV9VUkwsICdzaGFyZXInLCAnd2lkdGg9OTYwLGhlaWdodD03MDAsbG9jYXRpb249bm8sbWVudWJhcj1ubyxyZXNpemFibGU9bm8sc2Nyb2xsYmFycz15ZXMsc3RhdHVzPW5vLHRvb2xiYXI9bm8nKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdjbG9zZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdjbG9zZScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0d2lkdGg6ICc0MDBweCdcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGZpbmRTdHlsZXNoZWV0OiBmdW5jdGlvbih0aXRsZSkge1xyXG5cdFx0Zm9yKHZhciBpPTA7IGk8ZG9jdW1lbnQuc3R5bGVTaGVldHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIHNoZWV0ID0gZG9jdW1lbnQuc3R5bGVTaGVldHNbaV07XHJcblx0XHRcdGlmKHNoZWV0LnRpdGxlID09IHRpdGxlKSB7XHJcblx0XHRcdFx0cmV0dXJuIHNoZWV0O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9LFxyXG5cclxuXHRpc0xpZ2h0c09mZjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgZGFya0NzcyA9IEVuZ2luZS5maW5kU3R5bGVzaGVldCgnZGFya2VuTGlnaHRzJyk7XHJcblx0XHRpZiAoIGRhcmtDc3MgIT0gbnVsbCAmJiAhZGFya0Nzcy5kaXNhYmxlZCApIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHJcblx0dHVybkxpZ2h0c09mZjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgZGFya0NzcyA9IEVuZ2luZS5maW5kU3R5bGVzaGVldCgnZGFya2VuTGlnaHRzJyk7XHJcblx0XHRpZiAoZGFya0NzcyA9PSBudWxsKSB7XHJcblx0XHRcdCQoJ2hlYWQnKS5hcHBlbmQoJzxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiY3NzL2RhcmsuY3NzXCIgdHlwZT1cInRleHQvY3NzXCIgdGl0bGU9XCJkYXJrZW5MaWdodHNcIiAvPicpO1xyXG5cdFx0XHQkKCcubGlnaHRzT2ZmJykudGV4dChfKCdsaWdodHMgb24uJykpO1xyXG5cdFx0fSBlbHNlIGlmIChkYXJrQ3NzLmRpc2FibGVkKSB7XHJcblx0XHRcdGRhcmtDc3MuZGlzYWJsZWQgPSBmYWxzZTtcclxuXHRcdFx0JCgnLmxpZ2h0c09mZicpLnRleHQoXygnbGlnaHRzIG9uLicpKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQoXCIjZGFya2VuTGlnaHRzXCIpLmF0dHIoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpO1xyXG5cdFx0XHRkYXJrQ3NzLmRpc2FibGVkID0gdHJ1ZTtcclxuXHRcdFx0JCgnLmxpZ2h0c09mZicpLnRleHQoXygnbGlnaHRzIG9mZi4nKSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Ly8gR2V0cyBhIGd1aWRcclxuXHRnZXRHdWlkOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uKGMpIHtcclxuXHRcdFx0dmFyIHIgPSBNYXRoLnJhbmRvbSgpKjE2fDAsIHYgPSBjID09ICd4JyA/IHIgOiAociYweDN8MHg4KTtcclxuXHRcdFx0cmV0dXJuIHYudG9TdHJpbmcoMTYpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0YWN0aXZlTW9kdWxlOiBudWxsLFxyXG5cclxuXHR0cmF2ZWxUbzogZnVuY3Rpb24obW9kdWxlKSB7XHJcblx0XHRpZihFbmdpbmUuYWN0aXZlTW9kdWxlICE9IG1vZHVsZSkge1xyXG5cdFx0XHR2YXIgY3VycmVudEluZGV4ID0gRW5naW5lLmFjdGl2ZU1vZHVsZSA/ICQoJy5sb2NhdGlvbicpLmluZGV4KEVuZ2luZS5hY3RpdmVNb2R1bGUucGFuZWwpIDogMTtcclxuXHRcdFx0JCgnZGl2LmhlYWRlckJ1dHRvbicpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xyXG5cdFx0XHRtb2R1bGUudGFiLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xyXG5cclxuXHRcdFx0dmFyIHNsaWRlciA9ICQoJyNsb2NhdGlvblNsaWRlcicpO1xyXG5cdFx0XHR2YXIgc3RvcmVzID0gJCgnI3N0b3Jlc0NvbnRhaW5lcicpO1xyXG5cdFx0XHR2YXIgcGFuZWxJbmRleCA9ICQoJy5sb2NhdGlvbicpLmluZGV4KG1vZHVsZS5wYW5lbCk7XHJcblx0XHRcdHZhciBkaWZmID0gTWF0aC5hYnMocGFuZWxJbmRleCAtIGN1cnJlbnRJbmRleCk7XHJcblx0XHRcdHNsaWRlci5hbmltYXRlKHtsZWZ0OiAtKHBhbmVsSW5kZXggKiA3MDApICsgJ3B4J30sIDMwMCAqIGRpZmYpO1xyXG5cclxuXHRcdFx0aWYoJFNNLmdldCgnc3RvcmVzLndvb2QnKSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdC8vIEZJWE1FIFdoeSBkb2VzIHRoaXMgd29yayBpZiB0aGVyZSdzIGFuIGFuaW1hdGlvbiBxdWV1ZS4uLj9cclxuXHRcdFx0XHRzdG9yZXMuYW5pbWF0ZSh7cmlnaHQ6IC0ocGFuZWxJbmRleCAqIDcwMCkgKyAncHgnfSwgMzAwICogZGlmZik7XHJcblx0XHRcdH1cclxuXHRcdFxyXG5cdFx0XHRFbmdpbmUuYWN0aXZlTW9kdWxlID0gbW9kdWxlO1xyXG5cclxuXHRcdFx0bW9kdWxlLm9uQXJyaXZhbChkaWZmKTtcclxuXHJcblx0XHRcdGlmKEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gVmlsbGFnZVxyXG5cdFx0XHRcdC8vICB8fCBFbmdpbmUuYWN0aXZlTW9kdWxlID09IFBhdGhcclxuXHRcdFx0XHQpIHtcclxuXHRcdFx0XHQvLyBEb24ndCBmYWRlIG91dCB0aGUgd2VhcG9ucyBpZiB3ZSdyZSBzd2l0Y2hpbmcgdG8gYSBtb2R1bGVcclxuXHRcdFx0XHQvLyB3aGVyZSB3ZSdyZSBnb2luZyB0byBrZWVwIHNob3dpbmcgdGhlbSBhbnl3YXkuXHJcblx0XHRcdFx0aWYgKG1vZHVsZSAhPSBWaWxsYWdlIFxyXG5cdFx0XHRcdFx0Ly8gJiYgbW9kdWxlICE9IFBhdGhcclxuXHRcdFx0XHQpIHtcclxuXHRcdFx0XHRcdCQoJ2RpdiN3ZWFwb25zJykuYW5pbWF0ZSh7b3BhY2l0eTogMH0sIDMwMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZihtb2R1bGUgPT0gVmlsbGFnZVxyXG5cdFx0XHRcdC8vICB8fCBtb2R1bGUgPT0gUGF0aFxyXG5cdFx0XHRcdCkge1xyXG5cdFx0XHRcdCQoJ2RpdiN3ZWFwb25zJykuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIDMwMCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdE5vdGlmaWNhdGlvbnMucHJpbnRRdWV1ZShtb2R1bGUpO1xyXG5cdFx0XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0bG9nOiBmdW5jdGlvbihtc2cpIHtcclxuXHRcdGlmKHRoaXMuX2xvZykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhtc2cpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHVwZGF0ZVNsaWRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgc2xpZGVyID0gJCgnI2xvY2F0aW9uU2xpZGVyJyk7XHJcblx0XHRzbGlkZXIud2lkdGgoKHNsaWRlci5jaGlsZHJlbigpLmxlbmd0aCAqIDcwMCkgKyAncHgnKTtcclxuXHR9LFxyXG5cclxuXHR1cGRhdGVPdXRlclNsaWRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgc2xpZGVyID0gJCgnI291dGVyU2xpZGVyJyk7XHJcblx0XHRzbGlkZXIud2lkdGgoKHNsaWRlci5jaGlsZHJlbigpLmxlbmd0aCAqIDcwMCkgKyAncHgnKTtcclxuXHR9LFxyXG5cclxuXHRkaXNhYmxlU2VsZWN0aW9uOiBmdW5jdGlvbigpIHtcclxuXHRcdGRvY3VtZW50Lm9uc2VsZWN0c3RhcnQgPSBldmVudE51bGxpZmllcjsgLy8gdGhpcyBpcyBmb3IgSUVcclxuXHRcdGRvY3VtZW50Lm9ubW91c2Vkb3duID0gZXZlbnROdWxsaWZpZXI7IC8vIHRoaXMgaXMgZm9yIHRoZSByZXN0XHJcblx0fSxcclxuXHJcblx0ZW5hYmxlU2VsZWN0aW9uOiBmdW5jdGlvbigpIHtcclxuXHRcdGRvY3VtZW50Lm9uc2VsZWN0c3RhcnQgPSBldmVudFBhc3N0aHJvdWdoO1xyXG5cdFx0ZG9jdW1lbnQub25tb3VzZWRvd24gPSBldmVudFBhc3N0aHJvdWdoO1xyXG5cdH0sXHJcblxyXG5cdGF1dG9TZWxlY3Q6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcblx0XHQkKHNlbGVjdG9yKS5mb2N1cygpLnNlbGVjdCgpO1xyXG5cdH0sXHJcblxyXG5cdGhhbmRsZVN0YXRlVXBkYXRlczogZnVuY3Rpb24oZSl7XHJcblx0XHJcblx0fSxcclxuXHJcblx0c3dpdGNoTGFuZ3VhZ2U6IGZ1bmN0aW9uKGRvbSl7XHJcblx0XHR2YXIgbGFuZyA9ICQoZG9tKS5kYXRhKFwibGFuZ3VhZ2VcIik7XHJcblx0XHRpZihkb2N1bWVudC5sb2NhdGlvbi5ocmVmLnNlYXJjaCgvW1xcP1xcJl1sYW5nPVthLXpfXSsvKSAhPSAtMSl7XHJcblx0XHRcdGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSBkb2N1bWVudC5sb2NhdGlvbi5ocmVmLnJlcGxhY2UoIC8oW1xcP1xcJl1sYW5nPSkoW2Etel9dKykvZ2kgLCBcIiQxXCIrbGFuZyApO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSBkb2N1bWVudC5sb2NhdGlvbi5ocmVmICsgKCAoZG9jdW1lbnQubG9jYXRpb24uaHJlZi5zZWFyY2goL1xcPy8pICE9IC0xICk/XCImXCI6XCI/XCIpICsgXCJsYW5nPVwiK2xhbmc7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0c2F2ZUxhbmd1YWdlOiBmdW5jdGlvbigpe1xyXG5cdFx0dmFyIGxhbmcgPSBkZWNvZGVVUklDb21wb25lbnQoKG5ldyBSZWdFeHAoJ1s/fCZdbGFuZz0nICsgJyhbXiY7XSs/KSgmfCN8O3wkKScpLmV4ZWMobG9jYXRpb24uc2VhcmNoKXx8WyxcIlwiXSlbMV0ucmVwbGFjZSgvXFwrL2csICclMjAnKSl8fG51bGw7XHRcclxuXHRcdGlmKGxhbmcgJiYgdHlwZW9mIFN0b3JhZ2UgIT0gJ3VuZGVmaW5lZCcgJiYgbG9jYWxTdG9yYWdlKSB7XHJcblx0XHRcdGxvY2FsU3RvcmFnZS5sYW5nID0gbGFuZztcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRzZXRUaW1lb3V0OiBmdW5jdGlvbihjYWxsYmFjaywgdGltZW91dCwgc2tpcERvdWJsZT8pe1xyXG5cclxuXHRcdGlmKCBFbmdpbmUub3B0aW9ucy5kb3VibGVUaW1lICYmICFza2lwRG91YmxlICl7XHJcblx0XHRcdEVuZ2luZS5sb2coJ0RvdWJsZSB0aW1lLCBjdXR0aW5nIHRpbWVvdXQgaW4gaGFsZicpO1xyXG5cdFx0XHR0aW1lb3V0IC89IDI7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHNldFRpbWVvdXQoY2FsbGJhY2ssIHRpbWVvdXQpO1xyXG5cclxuXHR9XHJcblxyXG59O1xyXG5cclxuZnVuY3Rpb24gZXZlbnROdWxsaWZpZXIoZSkge1xyXG5cdHJldHVybiAkKGUudGFyZ2V0KS5oYXNDbGFzcygnbWVudUJ0bicpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBldmVudFBhc3N0aHJvdWdoKGUpIHtcclxuXHRyZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGluVmlldyhkaXIsIGVsZW0pe1xyXG5cclxuICAgICAgICB2YXIgc2NUb3AgPSAkKCcjbWFpbicpLm9mZnNldCgpLnRvcDtcclxuICAgICAgICB2YXIgc2NCb3QgPSBzY1RvcCArICQoJyNtYWluJykuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIHZhciBlbFRvcCA9IGVsZW0ub2Zmc2V0KCkudG9wO1xyXG4gICAgICAgIHZhciBlbEJvdCA9IGVsVG9wICsgZWxlbS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgaWYoIGRpciA9PSAndXAnICl7XHJcbiAgICAgICAgICAgICAgICAvLyBTVE9QIE1PVklORyBJRiBCT1RUT00gT0YgRUxFTUVOVCBJUyBWSVNJQkxFIElOIFNDUkVFTlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICggZWxCb3QgPCBzY0JvdCApO1xyXG4gICAgICAgIH1lbHNlIGlmKCBkaXIgPT0gJ2Rvd24nICl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKCBlbFRvcCA+IHNjVG9wICk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKCAoIGVsQm90IDw9IHNjQm90ICkgJiYgKCBlbFRvcCA+PSBzY1RvcCApICk7XHJcbiAgICAgICAgfVxyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gc2Nyb2xsQnlYKGVsZW0sIHgpe1xyXG5cclxuICAgICAgICB2YXIgZWxUb3AgPSBwYXJzZUludCggZWxlbS5jc3MoJ3RvcCcpLCAxMCApO1xyXG4gICAgICAgIGVsZW0uY3NzKCAndG9wJywgKCBlbFRvcCArIHggKSArIFwicHhcIiApO1xyXG5cclxufVxyXG5cclxuXHJcbi8vY3JlYXRlIGpRdWVyeSBDYWxsYmFja3MoKSB0byBoYW5kbGUgb2JqZWN0IGV2ZW50cyBcclxuJC5EaXNwYXRjaCA9IGZ1bmN0aW9uKCBpZCApIHtcclxuXHR2YXIgY2FsbGJhY2tzLCB0b3BpYyA9IGlkICYmIEVuZ2luZS50b3BpY3NbIGlkIF07XHJcblx0aWYgKCAhdG9waWMgKSB7XHJcblx0XHRjYWxsYmFja3MgPSBqUXVlcnkuQ2FsbGJhY2tzKCk7XHJcblx0XHR0b3BpYyA9IHtcclxuXHRcdFx0XHRwdWJsaXNoOiBjYWxsYmFja3MuZmlyZSxcclxuXHRcdFx0XHRzdWJzY3JpYmU6IGNhbGxiYWNrcy5hZGQsXHJcblx0XHRcdFx0dW5zdWJzY3JpYmU6IGNhbGxiYWNrcy5yZW1vdmVcclxuXHRcdH07XHJcblx0XHRpZiAoIGlkICkge1xyXG5cdFx0XHRFbmdpbmUudG9waWNzWyBpZCBdID0gdG9waWM7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiB0b3BpYztcclxufTtcclxuXHJcbiQoZnVuY3Rpb24oKSB7XHJcblx0RW5naW5lLmluaXQoKTtcclxufSk7XHJcblxyXG4iLCIvKipcclxuICogTW9kdWxlIHRoYXQgaGFuZGxlcyB0aGUgcmFuZG9tIGV2ZW50IHN5c3RlbVxyXG4gKi9cclxuaW1wb3J0IHsgRXZlbnRzUm9hZFdhbmRlciB9IGZyb20gXCIuL2V2ZW50cy9yb2Fkd2FuZGVyXCI7XHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBOb3RpZmljYXRpb25zIH0gZnJvbSBcIi4vbm90aWZpY2F0aW9uc1wiO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi9CdXR0b25cIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQURSRXZlbnQge1xyXG5cdHRpdGxlOiBzdHJpbmcsXHJcblx0aXNBdmFpbGFibGU/OiBGdW5jdGlvbixcclxuXHRpc1N1cGVyTGlrZWx5PzogRnVuY3Rpb24sXHJcblx0c2NlbmVzOiB7XHJcblx0XHQvLyB0eXBlIHRoaXMgb3V0IGJldHRlciB1c2luZyBJbmRleCBTaWduYXR1cmVzXHJcblx0XHRbaWQ6IHN0cmluZ106IFNjZW5lXHJcblx0fSxcclxuXHRldmVudFBhbmVsPzogYW55XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU2NlbmUge1xyXG5cdHNlZW5GbGFnPzogRnVuY3Rpb24sXHJcblx0bmV4dFNjZW5lPzogc3RyaW5nLFxyXG5cdG9uTG9hZD86IEZ1bmN0aW9uLFxyXG5cdHRleHQ6IEFycmF5PHN0cmluZz4sXHJcblx0cmV3YXJkPzogYW55LFxyXG5cdG5vdGlmaWNhdGlvbj86IHN0cmluZyxcclxuXHRibGluaz86IGJvb2xlYW4sXHJcblx0YnV0dG9uczoge1xyXG5cdFx0W2lkOiBzdHJpbmddOiBFdmVudEJ1dHRvblxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBFdmVudEJ1dHRvbiB7XHJcblx0dGV4dDogc3RyaW5nLFxyXG5cdG5leHRTY2VuZToge1xyXG5cdFx0W2lkOiBudW1iZXJdOiBzdHJpbmdcclxuXHR9LFxyXG5cdGF2YWlsYWJsZT86IEZ1bmN0aW9uLFxyXG5cdHZpc2libGU/OiBGdW5jdGlvbixcclxuXHRyZXdhcmQ/OiBhbnksXHJcblx0Y29zdD86IGFueSxcclxuXHRub3RpZmljYXRpb24/OiBzdHJpbmcsXHJcblx0b25DaG9vc2U/OiBGdW5jdGlvblxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgRXZlbnRzID0ge1xyXG5cdFx0XHJcblx0X0VWRU5UX1RJTUVfUkFOR0U6IFszLCA2XSwgLy8gcmFuZ2UsIGluIG1pbnV0ZXNcclxuXHRfUEFORUxfRkFERTogMjAwLFxyXG5cdEJMSU5LX0lOVEVSVkFMOiBmYWxzZSxcclxuXHJcblx0RXZlbnRQb29sOiA8YW55PltdLFxyXG5cdGV2ZW50U3RhY2s6IDxhbnk+W10sXHJcblx0X2V2ZW50VGltZW91dDogMCxcclxuXHJcblx0TG9jYXRpb25zOiB7fSxcclxuXHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblx0XHRcclxuXHRcdC8vIEJ1aWxkIHRoZSBFdmVudCBQb29sXHJcblx0XHRFdmVudHMuRXZlbnRQb29sID0gW10uY29uY2F0KFxyXG5cdFx0XHRFdmVudHNSb2FkV2FuZGVyIGFzIGFueVxyXG5cdFx0KTtcclxuXHJcblx0XHR0aGlzLkxvY2F0aW9uc1tcIlJvYWRXYW5kZXJcIl0gPSBFdmVudHNSb2FkV2FuZGVyO1xyXG5cdFx0XHJcblx0XHRFdmVudHMuZXZlbnRTdGFjayA9IFtdO1xyXG5cdFx0XHJcblx0XHQvL3N1YnNjcmliZSB0byBzdGF0ZVVwZGF0ZXNcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdCQuRGlzcGF0Y2goJ3N0YXRlVXBkYXRlJykuc3Vic2NyaWJlKEV2ZW50cy5oYW5kbGVTdGF0ZVVwZGF0ZXMpO1xyXG5cdH0sXHJcblx0XHJcblx0b3B0aW9uczoge30sIC8vIE5vdGhpbmcgZm9yIG5vd1xyXG4gICAgXHJcblx0YWN0aXZlU2NlbmU6ICcnLFxyXG4gICAgXHJcblx0bG9hZFNjZW5lOiBmdW5jdGlvbihuYW1lKSB7XHJcblx0XHRFbmdpbmUubG9nKCdsb2FkaW5nIHNjZW5lOiAnICsgbmFtZSk7XHJcblx0XHRFdmVudHMuYWN0aXZlU2NlbmUgPSBuYW1lO1xyXG5cdFx0dmFyIHNjZW5lID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnNjZW5lc1tuYW1lXTtcclxuXHRcdFxyXG5cdFx0Ly8gaGFuZGxlcyBvbmUtdGltZSBzY2VuZXMsIHN1Y2ggYXMgaW50cm9kdWN0aW9uc1xyXG5cdFx0Ly8gbWF5YmUgSSBjYW4gbWFrZSBhIG1vcmUgZXhwbGljaXQgXCJpbnRyb2R1Y3Rpb25cIiBsb2dpY2FsIGZsb3cgdG8gbWFrZSB0aGlzXHJcblx0XHQvLyBhIGxpdHRsZSBtb3JlIGVsZWdhbnQsIGdpdmVuIHRoYXQgdGhlcmUgd2lsbCBhbHdheXMgYmUgYW4gXCJpbnRyb2R1Y3Rpb25cIiBzY2VuZVxyXG5cdFx0Ly8gdGhhdCdzIG9ubHkgbWVhbnQgdG8gYmUgcnVuIGEgc2luZ2xlIHRpbWUuXHJcblx0XHRpZiAoc2NlbmUuc2VlbkZsYWcgJiYgc2NlbmUuc2VlbkZsYWcoKSkge1xyXG5cdFx0XHRFdmVudHMubG9hZFNjZW5lKHNjZW5lLm5leHRTY2VuZSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNjZW5lIHJld2FyZFxyXG5cdFx0aWYoc2NlbmUucmV3YXJkKSB7XHJcblx0XHRcdCRTTS5hZGRNKCdzdG9yZXMnLCBzY2VuZS5yZXdhcmQpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBvbkxvYWRcclxuXHRcdGlmKHNjZW5lLm9uTG9hZCkge1xyXG5cdFx0XHRzY2VuZS5vbkxvYWQoKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gTm90aWZ5IHRoZSBzY2VuZSBjaGFuZ2VcclxuXHRcdGlmKHNjZW5lLm5vdGlmaWNhdGlvbikge1xyXG5cdFx0XHROb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBzY2VuZS5ub3RpZmljYXRpb24pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQkKCcjZGVzY3JpcHRpb24nLCBFdmVudHMuZXZlbnRQYW5lbCgpKS5lbXB0eSgpO1xyXG5cdFx0JCgnI2J1dHRvbnMnLCBFdmVudHMuZXZlbnRQYW5lbCgpKS5lbXB0eSgpO1xyXG5cdFx0RXZlbnRzLnN0YXJ0U3Rvcnkoc2NlbmUpO1xyXG5cdH0sXHJcblx0XHJcblx0ZHJhd0Zsb2F0VGV4dDogZnVuY3Rpb24odGV4dCwgcGFyZW50KSB7XHJcblx0XHQkKCc8ZGl2PicpLnRleHQodGV4dCkuYWRkQ2xhc3MoJ2RhbWFnZVRleHQnKS5hcHBlbmRUbyhwYXJlbnQpLmFuaW1hdGUoe1xyXG5cdFx0XHQnYm90dG9tJzogJzUwcHgnLFxyXG5cdFx0XHQnb3BhY2l0eSc6ICcwJ1xyXG5cdFx0fSxcclxuXHRcdDMwMCxcclxuXHRcdCdsaW5lYXInLFxyXG5cdFx0ZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlKCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdFxyXG5cdHN0YXJ0U3Rvcnk6IGZ1bmN0aW9uKHNjZW5lKSB7XHJcblx0XHQvLyBXcml0ZSB0aGUgdGV4dFxyXG5cdFx0dmFyIGRlc2MgPSAkKCcjZGVzY3JpcHRpb24nLCBFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdGZvcih2YXIgaSBpbiBzY2VuZS50ZXh0KSB7XHJcblx0XHRcdCQoJzxkaXY+JykudGV4dChzY2VuZS50ZXh0W2ldKS5hcHBlbmRUbyhkZXNjKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYoc2NlbmUudGV4dGFyZWEgIT0gbnVsbCkge1xyXG5cdFx0XHR2YXIgdGEgPSAkKCc8dGV4dGFyZWE+JykudmFsKHNjZW5lLnRleHRhcmVhKS5hcHBlbmRUbyhkZXNjKTtcclxuXHRcdFx0aWYoc2NlbmUucmVhZG9ubHkpIHtcclxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0dGEuYXR0cigncmVhZG9ubHknLCB0cnVlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBEcmF3IHRoZSBidXR0b25zXHJcblx0XHRFdmVudHMuZHJhd0J1dHRvbnMoc2NlbmUpO1xyXG5cdH0sXHJcblx0XHJcblx0ZHJhd0J1dHRvbnM6IGZ1bmN0aW9uKHNjZW5lKSB7XHJcblx0XHR2YXIgYnRucyA9ICQoJyNidXR0b25zJywgRXZlbnRzLmV2ZW50UGFuZWwoKSk7XHJcblx0XHRmb3IodmFyIGlkIGluIHNjZW5lLmJ1dHRvbnMpIHtcclxuXHRcdFx0dmFyIGluZm8gPSBzY2VuZS5idXR0b25zW2lkXTtcclxuXHRcdFx0XHR2YXIgYiA9IFxyXG5cdFx0XHRcdC8vbmV3IFxyXG5cdFx0XHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRcdFx0aWQ6IGlkLFxyXG5cdFx0XHRcdFx0dGV4dDogaW5mby50ZXh0LFxyXG5cdFx0XHRcdFx0Y29zdDogaW5mby5jb3N0LFxyXG5cdFx0XHRcdFx0Y2xpY2s6IEV2ZW50cy5idXR0b25DbGljayxcclxuXHRcdFx0XHRcdGNvb2xkb3duOiBpbmZvLmNvb2xkb3duLFxyXG5cdFx0XHRcdFx0aW1hZ2U6IGluZm8uaW1hZ2VcclxuXHRcdFx0XHR9KS5hcHBlbmRUbyhidG5zKTtcclxuXHRcdFx0aWYodHlwZW9mIGluZm8uYXZhaWxhYmxlID09ICdmdW5jdGlvbicgJiYgIWluZm8uYXZhaWxhYmxlKCkpIHtcclxuXHRcdFx0XHRCdXR0b24uc2V0RGlzYWJsZWQoYiwgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYodHlwZW9mIGluZm8udmlzaWJsZSA9PSAnZnVuY3Rpb24nICYmICFpbmZvLnZpc2libGUoKSkge1xyXG5cdFx0XHRcdGIuaGlkZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHR5cGVvZiBpbmZvLmNvb2xkb3duID09ICdudW1iZXInKSB7XHJcblx0XHRcdFx0QnV0dG9uLmNvb2xkb3duKGIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdEV2ZW50cy51cGRhdGVCdXR0b25zKCk7XHJcblx0fSxcclxuXHRcclxuXHR1cGRhdGVCdXR0b25zOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBidG5zID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnNjZW5lc1tFdmVudHMuYWN0aXZlU2NlbmVdLmJ1dHRvbnM7XHJcblx0XHRmb3IodmFyIGJJZCBpbiBidG5zKSB7XHJcblx0XHRcdHZhciBiID0gYnRuc1tiSWRdO1xyXG5cdFx0XHR2YXIgYnRuRWwgPSAkKCcjJytiSWQsIEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0XHRpZih0eXBlb2YgYi5hdmFpbGFibGUgPT0gJ2Z1bmN0aW9uJyAmJiAhYi5hdmFpbGFibGUoKSkge1xyXG5cdFx0XHRcdEJ1dHRvbi5zZXREaXNhYmxlZChidG5FbCwgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGJ1dHRvbkNsaWNrOiBmdW5jdGlvbihidG4pIHtcclxuXHRcdHZhciBpbmZvID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnNjZW5lc1tFdmVudHMuYWN0aXZlU2NlbmVdLmJ1dHRvbnNbYnRuLmF0dHIoJ2lkJyldO1xyXG5cclxuXHRcdGlmKHR5cGVvZiBpbmZvLm9uQ2hvb3NlID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0dmFyIHRleHRhcmVhID0gRXZlbnRzLmV2ZW50UGFuZWwoKS5maW5kKCd0ZXh0YXJlYScpO1xyXG5cdFx0XHRpbmZvLm9uQ2hvb3NlKHRleHRhcmVhLmxlbmd0aCA+IDAgPyB0ZXh0YXJlYS52YWwoKSA6IG51bGwpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBSZXdhcmRcclxuXHRcdGlmKGluZm8ucmV3YXJkKSB7XHJcblx0XHRcdCRTTS5hZGRNKCdzdG9yZXMnLCBpbmZvLnJld2FyZCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdEV2ZW50cy51cGRhdGVCdXR0b25zKCk7XHJcblx0XHRcclxuXHRcdC8vIE5vdGlmaWNhdGlvblxyXG5cdFx0aWYoaW5mby5ub3RpZmljYXRpb24pIHtcclxuXHRcdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgaW5mby5ub3RpZmljYXRpb24pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBOZXh0IFNjZW5lXHJcblx0XHRpZihpbmZvLm5leHRTY2VuZSkge1xyXG5cdFx0XHRpZihpbmZvLm5leHRTY2VuZSA9PSAnZW5kJykge1xyXG5cdFx0XHRcdEV2ZW50cy5lbmRFdmVudCgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHZhciByID0gTWF0aC5yYW5kb20oKTtcclxuXHRcdFx0XHR2YXIgbG93ZXN0TWF0Y2g6IG51bGwgfCBzdHJpbmcgPSBudWxsO1xyXG5cdFx0XHRcdGZvcih2YXIgaSBpbiBpbmZvLm5leHRTY2VuZSkge1xyXG5cdFx0XHRcdFx0aWYociA8IChpIGFzIHVua25vd24gYXMgbnVtYmVyKSAmJiAobG93ZXN0TWF0Y2ggPT0gbnVsbCB8fCBpIDwgbG93ZXN0TWF0Y2gpKSB7XHJcblx0XHRcdFx0XHRcdGxvd2VzdE1hdGNoID0gaTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYobG93ZXN0TWF0Y2ggIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0RXZlbnRzLmxvYWRTY2VuZShpbmZvLm5leHRTY2VuZVtsb3dlc3RNYXRjaF0pO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRFbmdpbmUubG9nKCdFUlJPUjogbm8gc3VpdGFibGUgc2NlbmUgZm91bmQnKTtcclxuXHRcdFx0XHRFdmVudHMuZW5kRXZlbnQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8vIGJsaW5rcyB0aGUgYnJvd3NlciB3aW5kb3cgdGl0bGVcclxuXHRibGlua1RpdGxlOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0aXRsZSA9IGRvY3VtZW50LnRpdGxlO1xyXG5cclxuXHRcdC8vIGV2ZXJ5IDMgc2Vjb25kcyBjaGFuZ2UgdGl0bGUgdG8gJyoqKiBFVkVOVCAqKionLCB0aGVuIDEuNSBzZWNvbmRzIGxhdGVyLCBjaGFuZ2UgaXQgYmFjayB0byB0aGUgb3JpZ2luYWwgdGl0bGUuXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRFdmVudHMuQkxJTktfSU5URVJWQUwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuXHRcdFx0ZG9jdW1lbnQudGl0bGUgPSBfKCcqKiogRVZFTlQgKioqJyk7XHJcblx0XHRcdEVuZ2luZS5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge2RvY3VtZW50LnRpdGxlID0gdGl0bGU7fSwgMTUwMCwgdHJ1ZSk7IFxyXG5cdFx0fSwgMzAwMCk7XHJcblx0fSxcclxuXHJcblx0c3RvcFRpdGxlQmxpbms6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0Y2xlYXJJbnRlcnZhbChFdmVudHMuQkxJTktfSU5URVJWQUwpO1xyXG5cdFx0RXZlbnRzLkJMSU5LX0lOVEVSVkFMID0gZmFsc2U7XHJcblx0fSxcclxuXHRcclxuXHQvLyBNYWtlcyBhbiBldmVudCBoYXBwZW4hXHJcblx0dHJpZ2dlckV2ZW50OiBmdW5jdGlvbigpIHtcclxuXHRcdGlmKEV2ZW50cy5hY3RpdmVFdmVudCgpID09IG51bGwpIHtcclxuXHRcdFx0dmFyIHBvc3NpYmxlRXZlbnRzID0gW107XHJcblx0XHRcdGZvcih2YXIgaSBpbiBFdmVudHMuRXZlbnRQb29sKSB7XHJcblx0XHRcdFx0dmFyIGV2ZW50ID0gRXZlbnRzLkV2ZW50UG9vbFtpXTtcclxuXHRcdFx0XHRpZihldmVudC5pc0F2YWlsYWJsZSgpKSB7XHJcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0XHRwb3NzaWJsZUV2ZW50cy5wdXNoKGV2ZW50KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKHBvc3NpYmxlRXZlbnRzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRcdEV2ZW50cy5zY2hlZHVsZU5leHRFdmVudCgwLjUpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR2YXIgciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoocG9zc2libGVFdmVudHMubGVuZ3RoKSk7XHJcblx0XHRcdFx0RXZlbnRzLnN0YXJ0RXZlbnQocG9zc2libGVFdmVudHNbcl0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0RXZlbnRzLnNjaGVkdWxlTmV4dEV2ZW50KCk7XHJcblx0fSxcclxuXHJcblx0Ly8gbm90IHNjaGVkdWxlZCwgdGhpcyBpcyBmb3Igc3R1ZmYgbGlrZSBsb2NhdGlvbi1iYXNlZCByYW5kb20gZXZlbnRzIG9uIGEgYnV0dG9uIGNsaWNrXHJcblx0dHJpZ2dlckxvY2F0aW9uRXZlbnQ6IGZ1bmN0aW9uKGxvY2F0aW9uKSB7XHJcblx0XHRpZiAodGhpcy5Mb2NhdGlvbnNbbG9jYXRpb25dKSB7XHJcblx0XHRcdGlmKEV2ZW50cy5hY3RpdmVFdmVudCgpID09IG51bGwpIHtcclxuXHRcdFx0XHR2YXIgcG9zc2libGVFdmVudHM6IEFycmF5PGFueT4gPSBbXTtcclxuXHRcdFx0XHRmb3IodmFyIGkgaW4gdGhpcy5Mb2NhdGlvbnNbbG9jYXRpb25dKSB7XHJcblx0XHRcdFx0XHR2YXIgZXZlbnQgPSB0aGlzLkxvY2F0aW9uc1tsb2NhdGlvbl1baV07XHJcblx0XHRcdFx0XHRpZihldmVudC5pc0F2YWlsYWJsZSgpKSB7XHJcblx0XHRcdFx0XHRcdGlmKHR5cGVvZihldmVudC5pc1N1cGVyTGlrZWx5KSA9PSAnZnVuY3Rpb24nICYmIGV2ZW50LmlzU3VwZXJMaWtlbHkoKSkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFN1cGVyTGlrZWx5IGV2ZW50LCBkbyB0aGlzIGFuZCBza2lwIHRoZSByYW5kb20gY2hvaWNlXHJcblx0XHRcdFx0XHRcdFx0RW5naW5lLmxvZygnc3VwZXJMaWtlbHkgZGV0ZWN0ZWQnKTtcclxuXHRcdFx0XHRcdFx0XHRFdmVudHMuc3RhcnRFdmVudChldmVudCk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHBvc3NpYmxlRXZlbnRzLnB1c2goZXZlbnQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcclxuXHRcdFx0XHRpZihwb3NzaWJsZUV2ZW50cy5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHRcdC8vIEV2ZW50cy5zY2hlZHVsZU5leHRFdmVudCgwLjUpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR2YXIgciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoocG9zc2libGVFdmVudHMubGVuZ3RoKSk7XHJcblx0XHRcdFx0XHRFdmVudHMuc3RhcnRFdmVudChwb3NzaWJsZUV2ZW50c1tyXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRhY3RpdmVFdmVudDogZnVuY3Rpb24oKTogQURSRXZlbnQgfCBudWxsIHtcclxuXHRcdGlmKEV2ZW50cy5ldmVudFN0YWNrICYmIEV2ZW50cy5ldmVudFN0YWNrLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0cmV0dXJuIEV2ZW50cy5ldmVudFN0YWNrWzBdO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fSxcclxuXHRcclxuXHRldmVudFBhbmVsOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBFdmVudHMuYWN0aXZlRXZlbnQoKT8uZXZlbnRQYW5lbDtcclxuXHR9LFxyXG5cclxuXHRzdGFydEV2ZW50OiBmdW5jdGlvbihldmVudDogQURSRXZlbnQsIG9wdGlvbnM/KSB7XHJcblx0XHRpZihldmVudCkge1xyXG5cdFx0XHRFdmVudHMuZXZlbnRTdGFjay51bnNoaWZ0KGV2ZW50KTtcclxuXHRcdFx0ZXZlbnQuZXZlbnRQYW5lbCA9ICQoJzxkaXY+JykuYXR0cignaWQnLCAnZXZlbnQnKS5hZGRDbGFzcygnZXZlbnRQYW5lbCcpLmNzcygnb3BhY2l0eScsICcwJyk7XHJcblx0XHRcdGlmKG9wdGlvbnMgIT0gbnVsbCAmJiBvcHRpb25zLndpZHRoICE9IG51bGwpIHtcclxuXHRcdFx0XHRFdmVudHMuZXZlbnRQYW5lbCgpLmNzcygnd2lkdGgnLCBvcHRpb25zLndpZHRoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKCc8ZGl2PicpLmFkZENsYXNzKCdldmVudFRpdGxlJykudGV4dChFdmVudHMuYWN0aXZlRXZlbnQoKT8udGl0bGUgYXMgc3RyaW5nKS5hcHBlbmRUbyhFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdkZXNjcmlwdGlvbicpLmFwcGVuZFRvKEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2J1dHRvbnMnKS5hcHBlbmRUbyhFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdFx0RXZlbnRzLmxvYWRTY2VuZSgnc3RhcnQnKTtcclxuXHRcdFx0JCgnZGl2I3dyYXBwZXInKS5hcHBlbmQoRXZlbnRzLmV2ZW50UGFuZWwoKSk7XHJcblx0XHRcdEV2ZW50cy5ldmVudFBhbmVsKCkuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIEV2ZW50cy5fUEFORUxfRkFERSwgJ2xpbmVhcicpO1xyXG5cdFx0XHR2YXIgY3VycmVudFNjZW5lSW5mb3JtYXRpb24gPSBFdmVudHMuYWN0aXZlRXZlbnQoKT8uc2NlbmVzW0V2ZW50cy5hY3RpdmVTY2VuZV07XHJcblx0XHRcdGlmIChjdXJyZW50U2NlbmVJbmZvcm1hdGlvbi5ibGluaykge1xyXG5cdFx0XHRcdEV2ZW50cy5ibGlua1RpdGxlKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRzY2hlZHVsZU5leHRFdmVudDogZnVuY3Rpb24oc2NhbGU/KSB7XHJcblx0XHR2YXIgbmV4dEV2ZW50ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKihFdmVudHMuX0VWRU5UX1RJTUVfUkFOR0VbMV0gLSBFdmVudHMuX0VWRU5UX1RJTUVfUkFOR0VbMF0pKSArIEV2ZW50cy5fRVZFTlRfVElNRV9SQU5HRVswXTtcclxuXHRcdGlmKHNjYWxlID4gMCkgeyBuZXh0RXZlbnQgKj0gc2NhbGU7IH1cclxuXHRcdEVuZ2luZS5sb2coJ25leHQgZXZlbnQgc2NoZWR1bGVkIGluICcgKyBuZXh0RXZlbnQgKyAnIG1pbnV0ZXMnKTtcclxuXHRcdEV2ZW50cy5fZXZlbnRUaW1lb3V0ID0gRW5naW5lLnNldFRpbWVvdXQoRXZlbnRzLnRyaWdnZXJFdmVudCwgbmV4dEV2ZW50ICogNjAgKiAxMDAwKTtcclxuXHR9LFxyXG5cclxuXHRlbmRFdmVudDogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuZXZlbnRQYW5lbCgpLmFuaW1hdGUoe29wYWNpdHk6MH0sIEV2ZW50cy5fUEFORUxfRkFERSwgJ2xpbmVhcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRFdmVudHMuZXZlbnRQYW5lbCgpLnJlbW92ZSgpO1xyXG5cdFx0XHRjb25zdCBhY3RpdmVFdmVudCA9IEV2ZW50cy5hY3RpdmVFdmVudCgpO1xyXG5cdFx0XHRpZiAoYWN0aXZlRXZlbnQgIT09IG51bGwpIGFjdGl2ZUV2ZW50LmV2ZW50UGFuZWwgPSBudWxsO1xyXG5cdFx0XHRFdmVudHMuZXZlbnRTdGFjay5zaGlmdCgpO1xyXG5cdFx0XHRFbmdpbmUubG9nKEV2ZW50cy5ldmVudFN0YWNrLmxlbmd0aCArICcgZXZlbnRzIHJlbWFpbmluZycpO1xyXG5cdFx0XHRpZiAoRXZlbnRzLkJMSU5LX0lOVEVSVkFMKSB7XHJcblx0XHRcdFx0RXZlbnRzLnN0b3BUaXRsZUJsaW5rKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gRm9yY2UgcmVmb2N1cyBvbiB0aGUgYm9keS4gSSBoYXRlIHlvdSwgSUUuXHJcblx0XHRcdCQoJ2JvZHknKS5mb2N1cygpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0aGFuZGxlU3RhdGVVcGRhdGVzOiBmdW5jdGlvbihlKXtcclxuXHRcdGlmKChlLmNhdGVnb3J5ID09ICdzdG9yZXMnIHx8IGUuY2F0ZWdvcnkgPT0gJ2luY29tZScpICYmIEV2ZW50cy5hY3RpdmVFdmVudCgpICE9IG51bGwpe1xyXG5cdFx0XHRFdmVudHMudXBkYXRlQnV0dG9ucygpO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuIiwiLyoqXHJcbiAqIEV2ZW50cyB0aGF0IGNhbiBvY2N1ciB3aGVuIHRoZSBSb2FkIG1vZHVsZSBpcyBhY3RpdmVcclxuICoqL1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi4vZW5naW5lXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tIFwiLi4vcGxheWVyL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgeyBPdXRwb3N0IH0gZnJvbSBcIi4uL3BsYWNlcy9vdXRwb3N0XCI7XHJcbmltcG9ydCB7IFJvYWQgfSBmcm9tIFwiLi4vcGxhY2VzL3JvYWRcIjtcclxuaW1wb3J0IHsgQURSRXZlbnQgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgRXZlbnRzUm9hZFdhbmRlcjogQXJyYXk8QURSRXZlbnQ+ID0gW1xyXG4gICAgLy8gU3RyYW5nZXIgYmVhcmluZyBnaWZ0c1xyXG4gICAge1xyXG4gICAgICAgIHRpdGxlOiBfKCdBIFN0cmFuZ2VyIEJlY2tvbnMnKSxcclxuICAgICAgICBpc0F2YWlsYWJsZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBFbmdpbmUuYWN0aXZlTW9kdWxlID09IFJvYWQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgJ3N0YXJ0Jzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0FzIHlvdSB3YW5kZXIgYWxvbmcgdGhlIHJvYWQsIGEgaG9vZGVkIHN0cmFuZ2VyIGdlc3R1cmVzIHRvIHlvdS4gSGUgZG9lc25cXCd0IHNlZW0gaW50ZXJlc3RlZCBpbiBodXJ0aW5nIHlvdS4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdXaGF0IGRvIHlvdSBkbz8nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnY2xvc2VyJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdEcmF3IENsb3NlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOiAnY2xvc2VyJ31cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnR2V0IE91dHRhIFRoZXJlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6ICdsZWF2ZSd9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnY2xvc2VyJzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1lvdSBtb3ZlIHRvd2FyZCBoaW0gYSBiaXQgYW5kIHN0b3AuIEhlIGNvbnRpbnVlcyB0byBiZWNrb24uJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnV2hhdCBkbyB5b3UgZG8/JylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2V2ZW5DbG9zZXInOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0RyYXcgRXZlbiBDbG9zZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTogJ2V2ZW5DbG9zZXInfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdOYWgsIFRoaXMgaXMgVG9vIFNwb29reScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOiAnbGVhdmUnfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2V2ZW5DbG9zZXInOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgXygnWW91IGhlc2l0YW50bHkgd2FsayBjbG9zZXIuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnQXMgc29vbiBhcyB5b3UgZ2V0IHdpdGhpbiBhcm1zXFwnIHJlYWNoLCBoZSBncmFicyB5b3VyIGhhbmQgd2l0aCBhbGFybWluZyBzcGVlZC4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdIZSBxdWlja2x5IHBsYWNlcyBhbiBvYmplY3QgaW4geW91ciBoYW5kLCB0aGVuIGxlYXZlcyB3b3JkbGVzc2x5LicpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgb25Mb2FkOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBtYXliZSBzb21lIGxvZ2ljIHRvIG1ha2UgcmVwZWF0cyBsZXNzIGxpa2VseT9cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb3NzaWJsZUl0ZW1zID0gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnU3RyYW5nZXIuc21vb3RoU3RvbmUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnU3RyYW5nZXIud3JhcHBlZEtuaWZlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ1N0cmFuZ2VyLmNsb3RoQnVuZGxlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ1N0cmFuZ2VyLmNvaW4nXHJcbiAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gcG9zc2libGVJdGVtc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwb3NzaWJsZUl0ZW1zLmxlbmd0aCldO1xyXG4gICAgICAgICAgICAgICAgICAgIENoYXJhY3Rlci5hZGRUb0ludmVudG9yeShpdGVtKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1RoYW5rcywgSSBndWVzcz8nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1lvdXIgZ3V0IGNsZW5jaGVzLCBhbmQgeW91IGZlZWwgdGhlIHN1ZGRlbiB1cmdlIHRvIGxlYXZlLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0FzIHlvdSB3YWxrIGF3YXksIHlvdSBjYW4gZmVlbCB0aGUgb2xkIG1hblxcJ3MgZ2F6ZSBvbiB5b3VyIGJhY2suJylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1dlaXJkLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIE9sZCBsYWR5IGluIGNhcnJpYWdlLCBzaG9ydGN1dCB0byBPdXRwb3N0XHJcbiAgICB7XHJcbiAgICAgICAgdGl0bGU6IF8oJ1RoZSBTdG9tcGluZyBvZiBIb292ZXMgYW5kIENyZWFraW5nIG9mIFdvb2QnKSxcclxuICAgICAgICBpc0F2YWlsYWJsZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBFbmdpbmUuYWN0aXZlTW9kdWxlID09IFJvYWQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgJ3N0YXJ0Jzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0EgY2FycmlhZ2UgcHVsbHMgdXAgYWxvbmdzaWRlIHlvdSwgYW5kIHRoZSB2b2ljZSBvZiBhbiBlbGRlcmx5IHdvbWFuIGNyb2FrcyBvdXQgZnJvbSB3aXRoaW4uJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnXCJNeSwgYnV0IHlvdSBsb29rIHRpcmVkIGZyb20geW91ciBqb3VybmV5LiBJZiBpdFxcJ3MgdGhlIE91dHBvc3QgeW91IHNlZWssICdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICsgJ0lcXCdtIG9uIG15IHdheSB0aGVyZSBub3c7IHdvdWxkIHlvdSBsaWtlIHRvIGpvaW4gbWU/XCInKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdXaGF0IGRvIHlvdSBkbz8nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnYWNjZXB0Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBY2NlcHQgaGVyIG9mZmVyJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6ICdhY2NlcHQnfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdQb2xpdGVseSBEZWNsaW5lJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6ICdsZWF2ZSd9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnYWNjZXB0Jzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1lvdSBob3AgaW4gdGhlIGNhcnJpYWdlIHdpdGggdGhlIG9sZCB3b21hbi4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdTaGUgdHVybnMgb3V0IHRvIGJlIHByZXR0eSBjb29sLCBhbmQgZ2l2ZXMgeW91IG9uZSBvZiB0aG9zZSBoYXJkIGNhbmRpZXMgdGhhdCAnIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICArICdldmVyeSBncmFuZHBhcmVudCBzZWVtcyB0byBoYXZlIG9uIHRoZSBlbmQgdGFibGUgbmV4dCB0byB0aGVpciBzb2ZhLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0JlZm9yZSBsb25nLCB5b3UgcmVhY2ggdGhlIE91dHBvc3QuIFlvdSBob3Agb3V0IGFuZCB0aGFuayB0aGUgb2xkIHdvbWFuIGZvciB0aGUgcmlkZS4nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnV2hhdCBhIG5pY2Ugb2xkIGxhZHknKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRTTS5nZXQoJ091dHBvc3Qub3BlbicpID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPdXRwb3N0LmluaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkU00uc2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJywgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hhcmFjdGVyLnNldFF1ZXN0U3RhdHVzKFwibWF5b3JTdXBwbGllc1wiLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDaGFyYWN0ZXIuY2hlY2tRdWVzdFN0YXR1cyhcIm1heW9yU3VwcGxpZXNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRW5naW5lLnRyYXZlbFRvKE91dHBvc3QpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoJ29sZExhZHkuQ2FuZHknKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0l0XFwncyB0b28gZWFybHkgaW4gdGhlIGdhbWUgdG8gYmUgdHJ1c3Rpbmcgd2VpcmQgb2xkIHBlb3BsZSwgbWFuLiBZb3UgcG9saXRlbHkgJyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyAnZGVjbGluZSwgYW5kIHRoZSB3b21hbiBjaHVja2xlcyBzb2Z0bHkgYXMgdGhlIGNhcnJpYWdlIHJvbGxzIG9mZiBpbnRvIHRoZSBkaXN0YW5jZS4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdUaGF0IHNvZnQgY2h1Y2tsZSB0ZWxscyBtZSBldmVyeXRoaW5nIEkgbmVlZCB0byBrbm93IGFib3V0IHdoZXRoZXIgeW91IG1hZGUgdGhlICdcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyAncmlnaHQgY2FsbC4gVGhhdCBoYWQgXCJ0dXJuZWQgaW50byBnaW5nZXJicmVhZFwiIHdyaXR0ZW4gYWxsIG92ZXIgaXQuJylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1llYWggaXQgZGlkJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gT3JnYW4gdHJhdW1hXHJcbiAgICB7XHJcbiAgICAgICAgdGl0bGU6IF8oJ1RoaXMgR3V5IFNlZW1zIEZyaWVuZGx5JyksXHJcbiAgICAgICAgaXNBdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gKEVuZ2luZS5hY3RpdmVNb2R1bGUgPT09IFJvYWRcclxuICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ1JvYWQuZ290UHVuY2hlZCcpID09PSB1bmRlZmluZWQpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICdzdGFydCc6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdBIG1hbiB3YWxrcyB1cCB0byB5b3Ugd2l0aCBhIGJpZyBncmluIG9uIGhpcyBmYWNlLCBhbmQgYmVmb3JlIHlvdSBjYW4gZ3JlZXQgaGltIGhlIHN3aWZ0bHkgc29ja3MgeW91IGluIHRoZSBzdG9tYWNoLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0hlIHdhbGtzIG9mZiB3aGlzdGxpbmcgd2hpbGUgeW91IGdhc3AgZm9yIGJyZWF0aCBpbiB0aGUgZGlydC4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCcuLi4gTWFuLCB3aGF0IGEgZGljay4nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnRnVjayBtZSwgSSBndWVzcycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNob29zZTogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hhcmFjdGVyLmdyYW50UGVyaygndHVtbXlQYWluJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkU00uc2V0KCdSb2FkLmdvdFB1bmNoZWQnLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBBbiBhcG9sb2d5IGZvciBvcmdhbiB0cmF1bWFcclxuICAgIHtcclxuICAgICAgICB0aXRsZTogXygnVGhpcyBGdWNraW5nIEd1eSBBZ2FpbicpLFxyXG4gICAgICAgIGlzQXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChFbmdpbmUuYWN0aXZlTW9kdWxlID09PSBSb2FkXHJcbiAgICAgICAgICAgICAgICAmJiAoJFNNLmdldCgnUm9hZC5nb3RQdW5jaGVkJykgIT09IHVuZGVmaW5lZCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICdzdGFydCc6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdBIG1hbiB3YWxrcyB1cCB0byB5b3Ugd2l0aCBhIGJpZyBncmluIG9uIGhpcyBmYWNlLCBhbmQgYmVmb3JlIHlvdSBjYW4gZ3JlZXQgaGltIGhlIHN3aWZ0bHkuLi4gYXBvbG9naXplcy4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdcIkhleSwgSVxcJ20gcmVhbGx5IHNvcnJ5IGFib3V0IHB1bmNoaW5nIHlvdSBpbiB0aGUgc3RvbWFjaCBiZWZvcmUuIEkgdGhvdWdodCB5b3Ugd2VyZSBzb21lb25lIGVsc2UuIEkgSEFURSB0aGF0IGd1eS5cIicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1lvdVxcJ3JlIG5vdCBzdXJlIHRoaXMgaXMgYSBnb29kIGVub3VnaCByZWFzb24gdG8gbm90IGtpY2sgdGhpcyBndXlcXCdzIGFzcy4gU2VlaW5nIHRoZSBsb29rIG9uIHlvdXIgZmFjZSwgaGUgaGFzdGlseSBjb250aW51ZXMuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnXCJBbnl3YXksIGFzIGEgdG9rZW4gb2YgbXkgYXBvbG9neSwgcGxlYXNlIGFjY2VwdCB0aGlzIGhlYWxpbmcgdG9uaWMsIGFzIHdlbGwgYXMgYSBjb3Vwb24gZm9yIGEgc2VjcmV0IGl0ZW0gZnJvbSB0aGUgc3RvcmUgaW4gdGhlIHZpbGxhZ2UuXCInKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdZb3Ugc29tZXdoYXQgYXdrd2FyZGx5IGFjY2VwdCBib3RoIG9mIHRoZXNlIGl0ZW1zLCB0aG91Z2ggeW91IGRvblxcJ3QgdGhpbmsgdGhlcmVcXCdzIGEgc3RvcmUgaW4gdGhlIHZpLScpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1wiT2gsIGFuZCBJXFwnbSB0aGUgb3duZXIgb2YgdGhlIHN0b3JlIGluIHRoZSB2aWxsYWdlLiBJIG9wZW5lZCBpdCBiYWNrIHVwIGFmdGVyIHB1bmNoaW5nIHlvdS4gWW91IGtub3csIHRvIGNlbGVicmF0ZS5cIicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1RoZSBtYW4gd2Fsa3Mgb2ZmLCBzdGlsbCBncmlubmluZy4nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnLi4uIEFscmlnaHQnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdpdmUgaGVhbGluZyB0b25pY1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2l2ZSBjb3Vwb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVubG9jayBzdG9yZSBidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRTTS5zZXQoJ1JvYWQuZ290QXBvbG9naXplZCcsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIFVubG9jayBPdXRwb3N0XHJcbiAgICB7XHJcbiAgICAgICAgdGl0bGU6IF8oJ0EgV2F5IEZvcndhcmQgTWFrZXMgSXRzZWxmIEtub3duJyksXHJcbiAgICAgICAgaXNBdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgKEVuZ2luZS5hY3RpdmVNb2R1bGUgPT09IFJvYWQpXHJcbiAgICAgICAgICAgICAgICAmJiAoJFNNLmdldCgnUm9hZC5jb3VudGVyJykgYXMgbnVtYmVyID4gMykgLy8gY2FuJ3QgaGFwcGVuIFRPTyBlYXJseVxyXG4gICAgICAgICAgICAgICAgJiYgKCRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSA9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICB8fCAkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyIDwgMSkgLy8gY2FuJ3QgaGFwcGVuIHR3aWNlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpc1N1cGVyTGlrZWx5OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuICgoKCAkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfHwgJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpIGFzIG51bWJlciA8IDEpKSBcclxuICAgICAgICAgICAgICAgICAgICAmJiAoJFNNLmdldCgnUm9hZC5jb3VudGVyJykgYXMgbnVtYmVyID4gNyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgJ3N0YXJ0Jzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1Ntb2tlIGN1cmxzIHVwd2FyZHMgZnJvbSBiZWhpbmQgYSBoaWxsLiBZb3UgY2xpbWIgaGlnaGVyIHRvIGludmVzdGlnYXRlLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0Zyb20geW91ciBlbGV2YXRlZCBwb3NpdGlvbiwgeW91IGNhbiBzZWUgZG93biBpbnRvIHRoZSBvdXRwb3N0IHRoYXQgdGhlIG1heW9yIHNwb2tlIG9mIGJlZm9yZS4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdUaGUgT3V0cG9zdCBpcyBub3cgb3BlbiB0byB5b3UuJylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0EgbGl0dGxlIGRyYW1hdGljLCBidXQgY29vbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBPdXRwb3N0LmluaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRTTS5zZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENoYXJhY3Rlci5zZXRRdWVzdFN0YXR1cyhcIm1heW9yU3VwcGxpZXNcIiwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDaGFyYWN0ZXIuY2hlY2tRdWVzdFN0YXR1cyhcIm1heW9yU3VwcGxpZXNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5dO1xyXG5cclxuIiwiLyoqXHJcbiAqIE1vZHVsZSB0aGF0IHRha2VzIGNhcmUgb2YgaGVhZGVyIGJ1dHRvbnNcclxuICovXHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuL2VuZ2luZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEhlYWRlciA9IHtcclxuXHRcclxuXHRpbml0OiBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdH0sXHJcblx0XHJcblx0b3B0aW9uczoge30sIC8vIE5vdGhpbmcgZm9yIG5vd1xyXG5cdFxyXG5cdGNhblRyYXZlbDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gJCgnZGl2I2hlYWRlciBkaXYuaGVhZGVyQnV0dG9uJykubGVuZ3RoID4gMTtcclxuXHR9LFxyXG5cdFxyXG5cdGFkZExvY2F0aW9uOiBmdW5jdGlvbih0ZXh0LCBpZCwgbW9kdWxlKSB7XHJcblx0XHRyZXR1cm4gJCgnPGRpdj4nKS5hdHRyKCdpZCcsIFwibG9jYXRpb25fXCIgKyBpZClcclxuXHRcdFx0LmFkZENsYXNzKCdoZWFkZXJCdXR0b24nKVxyXG5cdFx0XHQudGV4dCh0ZXh0KS5jbGljayhmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZihIZWFkZXIuY2FuVHJhdmVsKCkpIHtcclxuXHRcdFx0XHRcdEVuZ2luZS50cmF2ZWxUbyhtb2R1bGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSkuYXBwZW5kVG8oJCgnZGl2I2hlYWRlcicpKTtcclxuXHR9XHJcbn07IiwiLyoqXHJcbiAqIE1vZHVsZSB0aGF0IHJlZ2lzdGVycyB0aGUgbm90aWZpY2F0aW9uIGJveCBhbmQgaGFuZGxlcyBtZXNzYWdlc1xyXG4gKi9cclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4vZW5naW5lXCI7XHJcblxyXG5leHBvcnQgY29uc3QgTm90aWZpY2F0aW9ucyA9IHtcclxuXHRcdFxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdFx0XHJcblx0XHQvLyBDcmVhdGUgdGhlIG5vdGlmaWNhdGlvbnMgYm94XHJcblx0XHRjb25zdCBlbGVtID0gJCgnPGRpdj4nKS5hdHRyKHtcclxuXHRcdFx0aWQ6ICdub3RpZmljYXRpb25zJyxcclxuXHRcdFx0Y2xhc3NOYW1lOiAnbm90aWZpY2F0aW9ucydcclxuXHRcdH0pO1xyXG5cdFx0Ly8gQ3JlYXRlIHRoZSB0cmFuc3BhcmVuY3kgZ3JhZGllbnRcclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnbm90aWZ5R3JhZGllbnQnKS5hcHBlbmRUbyhlbGVtKTtcclxuXHRcdFxyXG5cdFx0ZWxlbS5hcHBlbmRUbygnZGl2I3dyYXBwZXInKTtcclxuXHR9LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHt9LCAvLyBOb3RoaW5nIGZvciBub3dcclxuXHRcclxuXHRlbGVtOiBudWxsLFxyXG5cdFxyXG5cdG5vdGlmeVF1ZXVlOiB7fSxcclxuXHRcclxuXHQvLyBBbGxvdyBub3RpZmljYXRpb24gdG8gdGhlIHBsYXllclxyXG5cdG5vdGlmeTogZnVuY3Rpb24obW9kdWxlLCB0ZXh0LCBub1F1ZXVlPykge1xyXG5cdFx0aWYodHlwZW9mIHRleHQgPT0gJ3VuZGVmaW5lZCcpIHJldHVybjtcclxuXHRcdC8vIEkgZG9uJ3QgbmVlZCB5b3UgcHVuY3R1YXRpbmcgZm9yIG1lLCBmdW5jdGlvbi5cclxuXHRcdC8vIGlmKHRleHQuc2xpY2UoLTEpICE9IFwiLlwiKSB0ZXh0ICs9IFwiLlwiO1xyXG5cdFx0aWYobW9kdWxlICE9IG51bGwgJiYgRW5naW5lLmFjdGl2ZU1vZHVsZSAhPSBtb2R1bGUpIHtcclxuXHRcdFx0aWYoIW5vUXVldWUpIHtcclxuXHRcdFx0XHRpZih0eXBlb2YgdGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdID09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0XHR0aGlzLm5vdGlmeVF1ZXVlW21vZHVsZV0gPSBbXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdLnB1c2godGV4dCk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdE5vdGlmaWNhdGlvbnMucHJpbnRNZXNzYWdlKHRleHQpO1xyXG5cdFx0fVxyXG5cdFx0RW5naW5lLnNhdmVHYW1lKCk7XHJcblx0fSxcclxuXHRcclxuXHRjbGVhckhpZGRlbjogZnVuY3Rpb24oKSB7XHJcblx0XHJcblx0XHQvLyBUbyBmaXggc29tZSBtZW1vcnkgdXNhZ2UgaXNzdWVzLCB3ZSBjbGVhciBub3RpZmljYXRpb25zIHRoYXQgaGF2ZSBiZWVuIGhpZGRlbi5cclxuXHRcdFxyXG5cdFx0Ly8gV2UgdXNlIHBvc2l0aW9uKCkudG9wIGhlcmUsIGJlY2F1c2Ugd2Uga25vdyB0aGF0IHRoZSBwYXJlbnQgd2lsbCBiZSB0aGUgc2FtZSwgc28gdGhlIHBvc2l0aW9uIHdpbGwgYmUgdGhlIHNhbWUuXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHR2YXIgYm90dG9tID0gJCgnI25vdGlmeUdyYWRpZW50JykucG9zaXRpb24oKS50b3AgKyAkKCcjbm90aWZ5R3JhZGllbnQnKS5vdXRlckhlaWdodCh0cnVlKTtcclxuXHRcdFxyXG5cdFx0JCgnLm5vdGlmaWNhdGlvbicpLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcclxuXHRcdFx0aWYoJCh0aGlzKS5wb3NpdGlvbigpLnRvcCA+IGJvdHRvbSl7XHJcblx0XHRcdFx0JCh0aGlzKS5yZW1vdmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdH0sXHJcblx0XHJcblx0cHJpbnRNZXNzYWdlOiBmdW5jdGlvbih0KSB7XHJcblx0XHR2YXIgdGV4dCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ25vdGlmaWNhdGlvbicpLmNzcygnb3BhY2l0eScsICcwJykudGV4dCh0KS5wcmVwZW5kVG8oJ2RpdiNub3RpZmljYXRpb25zJyk7XHJcblx0XHR0ZXh0LmFuaW1hdGUoe29wYWNpdHk6IDF9LCA1MDAsICdsaW5lYXInLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly8gRG8gdGhpcyBldmVyeSB0aW1lIHdlIGFkZCBhIG5ldyBtZXNzYWdlLCB0aGlzIHdheSB3ZSBuZXZlciBoYXZlIGEgbGFyZ2UgYmFja2xvZyB0byBpdGVyYXRlIHRocm91Z2guIEtlZXBzIHRoaW5ncyBmYXN0ZXIuXHJcblx0XHRcdE5vdGlmaWNhdGlvbnMuY2xlYXJIaWRkZW4oKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0XHJcblx0cHJpbnRRdWV1ZTogZnVuY3Rpb24obW9kdWxlKSB7XHJcblx0XHRpZih0eXBlb2YgdGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdICE9ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdHdoaWxlKHRoaXMubm90aWZ5UXVldWVbbW9kdWxlXS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9ucy5wcmludE1lc3NhZ2UodGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdLnNoaWZ0KCkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCB7IEVuZ2luZSB9IGZyb20gJy4uL2VuZ2luZSc7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gJy4uL3N0YXRlX21hbmFnZXInO1xyXG5pbXBvcnQgeyBXZWF0aGVyIH0gZnJvbSAnLi4vd2VhdGhlcic7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCB7IENhcHRhaW4gfSBmcm9tICcuLi9jaGFyYWN0ZXJzL2NhcHRhaW4nO1xyXG5pbXBvcnQgeyBIZWFkZXIgfSBmcm9tICcuLi9oZWFkZXInO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSAnLi4vLi4vbGliL3RyYW5zbGF0ZSc7XHJcbmltcG9ydCB7IF90YiB9IGZyb20gJy4uLy4uL2xpYi90ZXh0QnVpbGRlcic7XHJcblxyXG5leHBvcnQgY29uc3QgT3V0cG9zdCA9IHtcclxuXHRkZXNjcmlwdGlvbjogW1xyXG5cdFx0XyhcIllvdSdyZSBpbiBhIHNtYWxsIGJ1dCBidXN0bGluZyBtaWxpdGFyeSBPdXRwb3N0LiBWYXJpb3VzIG1lbWJlcnMgXCIgXHJcblx0XHRcdCsgXCJvZiB0aGUgcmFuay1hbmQtZmlsZSBnbyBhYm91dCB0aGVpciBidXNpbmVzcywgcGF5aW5nIHlvdSBsaXR0bGUgbWluZC5cIiksXHJcblx0XHRfKFwiT25lIHRlbnQgc3RhbmRzIG91dCBmcm9tIHRoZSByZXN0OyB0aGUgZmluZWx5LWVtYnJvaWRlcmVkIGRldGFpbHMgYW5kIFwiICsgXHJcblx0XHRcdFwiZ29sZGVuIGljb24gYWJvdmUgdGhlIGVudHJhbmNlIG1hcmsgaXQgYXMgdGhlIGNvbW1hbmRpbmcgb2ZmaWNlcidzIHF1YXJ0ZXJzLlwiKVxyXG5cdF0sXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgdGhlIE91dHBvc3QgdGFiXHJcbiAgICAgICAgdGhpcy50YWIgPSBIZWFkZXIuYWRkTG9jYXRpb24oXyhcIlRoZSBPdXRwb3N0XCIpLCBcIm91dHBvc3RcIiwgT3V0cG9zdCk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgT3V0cG9zdCBwYW5lbFxyXG5cdFx0dGhpcy5wYW5lbCA9ICQoJzxkaXY+JylcclxuICAgICAgICAuYXR0cignaWQnLCBcIm91dHBvc3RQYW5lbFwiKVxyXG4gICAgICAgIC5hZGRDbGFzcygnbG9jYXRpb24nKVxyXG4gICAgICAgIC5hcHBlbmRUbygnZGl2I2xvY2F0aW9uU2xpZGVyJyk7XHJcblxyXG5cdFx0dGhpcy5kZXNjcmlwdGlvblBhbmVsID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdkZXNjcmlwdGlvbicpLmFwcGVuZFRvKHRoaXMucGFuZWwpO1xyXG5cdFx0dGhpcy51cGRhdGVEZXNjcmlwdGlvbigpO1xyXG5cclxuICAgICAgICBFbmdpbmUudXBkYXRlU2xpZGVyKCk7XHJcblxyXG4gICAgICAgIC8vIG5ldyBcclxuXHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogJ2NhcHRhaW5CdXR0b24nLFxyXG5cdFx0XHR0ZXh0OiBfKCdTcGVhayB3aXRoIFRoZSBDYXB0YWluJyksXHJcblx0XHRcdGNsaWNrOiBDYXB0YWluLnRhbGtUb0NhcHRhaW4sXHJcblx0XHRcdHdpZHRoOiAnODBweCdcclxuXHRcdH0pXHJcblx0XHQuYWRkQ2xhc3MoJ2xvY2F0aW9uQnV0dG9uJylcclxuXHRcdC5hcHBlbmRUbygnZGl2I291dHBvc3RQYW5lbCcpO1xyXG5cclxuICAgICAgICBPdXRwb3N0LnVwZGF0ZUJ1dHRvbigpO1xyXG5cclxuICAgICAgICAvLyBzZXR0aW5nIHRoaXMgc2VwYXJhdGVseSBzbyB0aGF0IHF1ZXN0IHN0YXR1cyBjYW4ndCBhY2NpZGVudGFsbHkgYnJlYWsgaXQgbGF0ZXJcclxuICAgICAgICAkU00uc2V0KCdPdXRwb3N0Lm9wZW4nLCAxKTsgXHJcbiAgICB9LFxyXG5cclxuXHR1cGRhdGVEZXNjcmlwdGlvbjogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLmRlc2NyaXB0aW9uUGFuZWwuZW1wdHkoKTtcclxuXHRcdHRoaXMuZGVzY3JpcHRpb24gPSBfdGIoW1xyXG5cdFx0XHRfKFwiWW91J3JlIG9uIGEgZHVzdHkgcm9hZCBiZXR3ZWVuIHRoZSBWaWxsYWdlIGFuZCB0aGUgT3V0cG9zdC4gVGhlIHJvYWQgY3V0cyB0aHJvdWdoIFwiIFxyXG5cdFx0XHRcdCsgXCJ0YWxsIGdyYXNzLCBicnVzaCwgYW5kIHRyZWVzLCBsaW1pdGluZyB2aXNpYmlsaXR5IGFuZCBlbnN1cmluZyB0aGF0IHlvdSdsbCBoYXZlIFwiIFxyXG5cdFx0XHRcdCsgXCJ0byBkZWFsIHdpdGggc29tZSBub25zZW5zZS5cIiksXHJcblx0XHRcdF8oXCJUaGUgaGFpciBvbiB0aGUgYmFjayBvZiB5b3VyIG5lY2sgcHJpY2tsZXMgc2xpZ2h0bHkgaW4gYW50aWNpcGF0aW9uLlwiKVxyXG5cdFx0XSk7XHJcblxyXG5cdFx0Zm9yKHZhciBpIGluIHRoaXMuZGVzY3JpcHRpb24pIHtcclxuXHRcdFx0JCgnPGRpdj4nKS50ZXh0KHRoaXMuZGVzY3JpcHRpb25baV0pLmFwcGVuZFRvKHRoaXMuZGVzY3JpcHRpb25QYW5lbCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcbiAgICBhdmFpbGFibGVXZWF0aGVyOiB7XHJcblx0XHQnc3VubnknOiAwLjQsXHJcblx0XHQnY2xvdWR5JzogMC4zLFxyXG5cdFx0J3JhaW55JzogMC4zXHJcblx0fSxcclxuXHJcbiAgICBvbkFycml2YWw6IGZ1bmN0aW9uKHRyYW5zaXRpb25fZGlmZikge1xyXG4gICAgICAgIE91dHBvc3Quc2V0VGl0bGUoKTtcclxuXHJcbiAgICAgICAgV2VhdGhlci5pbml0aWF0ZVdlYXRoZXIoT3V0cG9zdC5hdmFpbGFibGVXZWF0aGVyLCAnb3V0cG9zdCcpO1xyXG5cclxuXHRcdHRoaXMudXBkYXRlRGVzY3JpcHRpb24oKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0VGl0bGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRpdGxlID0gXyhcIlRoZSBPdXRwb3N0XCIpO1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSB0aGlzKSB7XHJcblx0XHRcdGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XHJcblx0XHR9XHJcblx0XHQkKCdkaXYjbG9jYXRpb25fb3V0cG9zdCcpLnRleHQodGl0bGUpO1xyXG5cdH0sXHJcblxyXG4gICAgdXBkYXRlQnV0dG9uOiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIGNvbmRpdGlvbmFscyBmb3IgdXBkYXRpbmcgYnV0dG9uc1xyXG5cdH1cclxufSIsImltcG9ydCB7IEhlYWRlciB9IGZyb20gXCIuLi9oZWFkZXJcIjtcclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4uL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi4vQnV0dG9uXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyBXZWF0aGVyIH0gZnJvbSBcIi4uL3dlYXRoZXJcIjtcclxuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5pbXBvcnQgeyBfdGIgfSBmcm9tIFwiLi4vLi4vbGliL3RleHRCdWlsZGVyXCI7XHJcblxyXG5leHBvcnQgY29uc3QgUm9hZCA9IHtcclxuXHRkZXNjcmlwdGlvbjogbnVsbCxcclxuXHRkZXNjcmlwdGlvblBhbmVsOiBudWxsLFxyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBSb2FkIHRhYlxyXG4gICAgICAgIHRoaXMudGFiID0gSGVhZGVyLmFkZExvY2F0aW9uKF8oXCJSb2FkIHRvIHRoZSBPdXRwb3N0XCIpLCBcInJvYWRcIiwgUm9hZCk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgUm9hZCBwYW5lbFxyXG5cdFx0dGhpcy5wYW5lbCA9ICQoJzxkaXY+JylcclxuICAgICAgICAuYXR0cignaWQnLCBcInJvYWRQYW5lbFwiKVxyXG4gICAgICAgIC5hZGRDbGFzcygnbG9jYXRpb24nKVxyXG4gICAgICAgIC5hcHBlbmRUbygnZGl2I2xvY2F0aW9uU2xpZGVyJyk7XHJcblxyXG5cdFx0dGhpcy5kZXNjcmlwdGlvblBhbmVsID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdkZXNjcmlwdGlvbicpLmFwcGVuZFRvKHRoaXMucGFuZWwpO1xyXG5cdFx0dGhpcy51cGRhdGVEZXNjcmlwdGlvbigpO1xyXG5cclxuICAgICAgICBFbmdpbmUudXBkYXRlU2xpZGVyKCk7XHJcblxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAnd2FuZGVyQnV0dG9uJyxcclxuXHRcdFx0dGV4dDogXygnV2FuZGVyIEFyb3VuZCcpLFxyXG5cdFx0XHRjbGljazogUm9hZC53YW5kZXJFdmVudCxcclxuXHRcdFx0d2lkdGg6ICc4MHB4JyxcclxuXHRcdFx0Y29zdDoge30gLy8gVE9ETzogbWFrZSB0aGVyZSBiZSBhIGNvc3QgdG8gZG9pbmcgc3R1ZmY/XHJcblx0XHR9KVxyXG5cdFx0LmFkZENsYXNzKCdsb2NhdGlvbkJ1dHRvbicpXHJcblx0XHQuYXBwZW5kVG8oJ2RpdiNyb2FkUGFuZWwnKTtcclxuXHJcbiAgICAgICAgUm9hZC51cGRhdGVCdXR0b24oKTtcclxuXHJcbiAgICAgICAgLy8gc2V0dGluZyB0aGlzIHNlcGFyYXRlbHkgc28gdGhhdCBxdWVzdCBzdGF0dXMgY2FuJ3QgYWNjaWRlbnRhbGx5IGJyZWFrIGl0IGxhdGVyXHJcbiAgICAgICAgJFNNLnNldCgnUm9hZC5vcGVuJywgMSk7IFxyXG4gICAgfSxcclxuXHJcblx0dXBkYXRlRGVzY3JpcHRpb246IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5kZXNjcmlwdGlvblBhbmVsLmVtcHR5KCk7XHJcblx0XHR0aGlzLmRlc2NyaXB0aW9uID0gX3RiKFtcclxuXHRcdFx0XyhcIllvdSdyZSBvbiBhIGR1c3R5IHJvYWQgYmV0d2VlbiB0aGUgVmlsbGFnZSBhbmQgdGhlIE91dHBvc3QuIFRoZSByb2FkIGN1dHMgdGhyb3VnaCBcIiBcclxuXHRcdFx0XHQrIFwidGFsbCBncmFzcywgYnJ1c2gsIGFuZCB0cmVlcywgbGltaXRpbmcgdmlzaWJpbGl0eSBhbmQgZW5zdXJpbmcgdGhhdCB5b3UnbGwgaGF2ZSBcIiBcclxuXHRcdFx0XHQrIFwidG8gZGVhbCB3aXRoIHNvbWUgbm9uc2Vuc2UuXCIpLFxyXG5cdFx0XHRfKFwiVGhlIGhhaXIgb24gdGhlIGJhY2sgb2YgeW91ciBuZWNrIHByaWNrbGVzIHNsaWdodGx5IGluIGFudGljaXBhdGlvbi5cIilcclxuXHRcdF0pO1xyXG5cclxuXHRcdGZvcih2YXIgaSBpbiB0aGlzLmRlc2NyaXB0aW9uKSB7XHJcblx0XHRcdCQoJzxkaXY+JykudGV4dCh0aGlzLmRlc2NyaXB0aW9uW2ldKS5hcHBlbmRUbyh0aGlzLmRlc2NyaXB0aW9uUGFuZWwpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG4gICAgYXZhaWxhYmxlV2VhdGhlcjoge1xyXG5cdFx0J3N1bm55JzogMC40LFxyXG5cdFx0J2Nsb3VkeSc6IDAuMyxcclxuXHRcdCdyYWlueSc6IDAuM1xyXG5cdH0sXHJcblxyXG4gICAgb25BcnJpdmFsOiBmdW5jdGlvbih0cmFuc2l0aW9uX2RpZmYpIHtcclxuICAgICAgICBSb2FkLnNldFRpdGxlKCk7XHJcblxyXG4gICAgICAgIFdlYXRoZXIuaW5pdGlhdGVXZWF0aGVyKFJvYWQuYXZhaWxhYmxlV2VhdGhlciwgJ3JvYWQnKTtcclxuXHJcblx0XHR0aGlzLnVwZGF0ZURlc2NyaXB0aW9uKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldFRpdGxlOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0aXRsZSA9IF8oXCJSb2FkIHRvIHRoZSBPdXRwb3N0XCIpO1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSB0aGlzKSB7XHJcblx0XHRcdGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XHJcblx0XHR9XHJcblx0XHQkKCdkaXYjbG9jYXRpb25fcm9hZCcpLnRleHQodGl0bGUpO1xyXG5cdH0sXHJcblxyXG4gICAgdXBkYXRlQnV0dG9uOiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIGNvbmRpdGlvbmFscyBmb3IgdXBkYXRpbmcgYnV0dG9uc1xyXG5cdH0sXHJcblxyXG5cdHdhbmRlckV2ZW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy50cmlnZ2VyTG9jYXRpb25FdmVudCgnUm9hZFdhbmRlcicpO1xyXG5cdFx0JFNNLmFkZCgnUm9hZC5jb3VudGVyJywgMSk7XHJcblx0fVxyXG59IiwiLyoqXHJcbiAqIE1vZHVsZSB0aGF0IHJlZ2lzdGVycyB0aGUgc2ltcGxlIHJvb20gZnVuY3Rpb25hbGl0eVxyXG4gKi9cclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4uL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi4vQnV0dG9uXCI7XHJcbmltcG9ydCB7IFdlYXRoZXIgfSBmcm9tIFwiLi4vd2VhdGhlclwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgSGVhZGVyIH0gZnJvbSBcIi4uL2hlYWRlclwiO1xyXG5pbXBvcnQgeyBMaXogfSBmcm9tIFwiLi4vY2hhcmFjdGVycy9saXpcIjtcclxuaW1wb3J0IHsgTWF5b3IgfSBmcm9tIFwiLi4vY2hhcmFjdGVycy9tYXlvclwiO1xyXG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcbmltcG9ydCB7IF90YiB9IGZyb20gXCIuLi8uLi9saWIvdGV4dEJ1aWxkZXJcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBWaWxsYWdlID0ge1xyXG5cclxuXHRidXR0b25zOnt9LFxyXG5cdFxyXG5cdGNoYW5nZWQ6IGZhbHNlLFxyXG5cclxuXHRkZXNjcmlwdGlvbjogW10sXHJcblx0ZGVzY3JpcHRpb25QYW5lbDogbnVsbCxcclxuXHRcclxuXHRuYW1lOiBfKFwiVmlsbGFnZVwiKSxcclxuXHRpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHRcdFxyXG5cdFx0aWYoRW5naW5lLl9kZWJ1Zykge1xyXG5cdFx0XHR0aGlzLl9ST09NX1dBUk1fREVMQVkgPSA1MDAwO1xyXG5cdFx0XHR0aGlzLl9CVUlMREVSX1NUQVRFX0RFTEFZID0gNTAwMDtcclxuXHRcdFx0dGhpcy5fU1RPS0VfQ09PTERPV04gPSAwO1xyXG5cdFx0XHR0aGlzLl9ORUVEX1dPT0RfREVMQVkgPSA1MDAwO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBDcmVhdGUgdGhlIFZpbGxhZ2UgdGFiXHJcblx0XHR0aGlzLnRhYiA9IEhlYWRlci5hZGRMb2NhdGlvbihfKFwiQSBDaGlsbCBWaWxsYWdlXCIpLCBcInZpbGxhZ2VcIiwgVmlsbGFnZSk7XHJcblx0XHRcclxuXHRcdC8vIENyZWF0ZSB0aGUgVmlsbGFnZSBwYW5lbFxyXG5cdFx0dGhpcy5wYW5lbCA9ICQoJzxkaXY+JylcclxuXHRcdFx0LmF0dHIoJ2lkJywgXCJ2aWxsYWdlUGFuZWxcIilcclxuXHRcdFx0LmFkZENsYXNzKCdsb2NhdGlvbicpXHJcblx0XHRcdC5hcHBlbmRUbygnZGl2I2xvY2F0aW9uU2xpZGVyJyk7XHJcblxyXG5cdFx0dGhpcy5kZXNjcmlwdGlvblBhbmVsID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdkZXNjcmlwdGlvbicpLmFwcGVuZFRvKHRoaXMucGFuZWwpO1xyXG5cdFx0dGhpcy51cGRhdGVEZXNjcmlwdGlvbigpO1xyXG5cclxuXHRcdEVuZ2luZS51cGRhdGVTbGlkZXIoKTtcclxuXHJcblx0XHRCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6ICd0YWxrQnV0dG9uJyxcclxuXHRcdFx0dGV4dDogXygnVGFsayB0byB0aGUgTWF5b3InKSxcclxuXHRcdFx0Y2xpY2s6IE1heW9yLnRhbGtUb01heW9yLFxyXG5cdFx0XHR3aWR0aDogJzgwcHgnLFxyXG5cdFx0XHRjb3N0OiB7fVxyXG5cdFx0fSlcclxuXHRcdC5hZGRDbGFzcygnbG9jYXRpb25CdXR0b24nKVxyXG5cdFx0LmFwcGVuZFRvKCdkaXYjdmlsbGFnZVBhbmVsJyk7XHJcblxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAnbGl6QnV0dG9uJyxcclxuXHRcdFx0dGV4dDogXygnVGFsayB0byBMaXonKSxcclxuXHRcdFx0Y2xpY2s6IExpei50YWxrVG9MaXosXHJcblx0XHRcdHdpZHRoOiAnODBweCcsXHJcblx0XHRcdGNvc3Q6IHt9XHJcblx0XHR9KVxyXG5cdFx0LmFkZENsYXNzKCdsb2NhdGlvbkJ1dHRvbicpXHJcblx0XHQuYXBwZW5kVG8oJ2RpdiN2aWxsYWdlUGFuZWwnKTtcclxuXHJcblx0XHRCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6ICduZXdCdWlsZGluZ0J1dHRvbicsXHJcblx0XHRcdHRleHQ6IF8oJ0NoZWNrIG91dCB0aGUgbmV3IGJ1aWxkaW5nJyksXHJcblx0XHRcdGNsaWNrOiBWaWxsYWdlLnRlbXBCdWlsZGluZ01lc3NhZ2UsXHJcblx0XHRcdHdpZHRoOiAnODBweCcsXHJcblx0XHRcdGNvc3Q6IHt9XHJcblx0XHR9KVxyXG5cdFx0LmFkZENsYXNzKCdsb2NhdGlvbkJ1dHRvbicpXHJcblx0XHQuYXBwZW5kVG8oJ2RpdiN2aWxsYWdlUGFuZWwnKTtcclxuXHJcblx0XHR2YXIgYnVpbGRpbmdCdXR0b24gPSAkKCcjbmV3QnVpbGRpbmdCdXR0b24uYnV0dG9uJyk7XHJcblx0XHRidWlsZGluZ0J1dHRvbi5oaWRlKCk7XHJcblxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAnc3RvcmVCdXR0b24nLFxyXG5cdFx0XHR0ZXh0OiBfKCdHbyB0byB0aGUgU3RvcmUnKSxcclxuXHRcdFx0Y2xpY2s6IFZpbGxhZ2Uub3BlblN0b3JlLFxyXG5cdFx0XHR3aWR0aDogJzgwcHgnLFxyXG5cdFx0XHRjb3N0OiB7fVxyXG5cdFx0fSlcclxuXHRcdC5hZGRDbGFzcygnbG9jYXRpb25CdXR0b24nKVxyXG5cdFx0LmFwcGVuZFRvKCdkaXYjdmlsbGFnZVBhbmVsJyk7XHJcblxyXG5cdFx0dmFyIHN0b3JlQnV0dG9uID0gJCgnI3N0b3JlQnV0dG9uLmJ1dHRvbicpO1xyXG5cdFx0c3RvcmVCdXR0b24uaGlkZSgpO1xyXG5cclxuXHRcdHZhciBsaXpCdXR0b24gPSAkKCcjbGl6QnV0dG9uLmJ1dHRvbicpO1xyXG5cdFx0bGl6QnV0dG9uLmhpZGUoKTtcclxuXHRcdFxyXG5cdFx0Ly8gQ3JlYXRlIHRoZSBzdG9yZXMgY29udGFpbmVyXHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ3N0b3Jlc0NvbnRhaW5lcicpLmFwcGVuZFRvKCdkaXYjdmlsbGFnZVBhbmVsJyk7XHJcblx0XHRcclxuXHRcdC8vc3Vic2NyaWJlIHRvIHN0YXRlVXBkYXRlc1xyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5zdWJzY3JpYmUoVmlsbGFnZS5oYW5kbGVTdGF0ZVVwZGF0ZXMpO1xyXG5cdFx0XHJcblx0XHRWaWxsYWdlLnVwZGF0ZUJ1dHRvbigpO1xyXG5cdH0sXHJcblxyXG5cdHVwZGF0ZURlc2NyaXB0aW9uOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuZGVzY3JpcHRpb25QYW5lbC5lbXB0eSgpO1xyXG5cdFx0dGhpcy5kZXNjcmlwdGlvbiA9IF90YihbXHJcblx0XHRcdF8oXCJOZXN0bGVkIGluIHRoZSB3b29kcywgdGhpcyB2aWxsYWdlIGlzIHNjYXJjZWx5IG1vcmUgdGhhbiBhIGhhbWxldCwgXCIgXHJcblx0XHRcdFx0KyBcImRlc3BpdGUgeW91IHRoaW5raW5nIHRob3NlIHR3byB3b3JkcyBhcmUgc3lub255bXMuIFRoZXkncmUgbm90LCBcIiBcclxuXHRcdFx0XHQrIFwiZ28gZ29vZ2xlICdoYW1sZXQnIHJpZ2h0IG5vdyBpZiB5b3UgZG9uJ3QgYmVsaWV2ZSBtZS5cIiksXHJcblx0XHRcdF8oXCJUaGUgdmlsbGFnZSBpcyBxdWlldCBhdCB0aGUgbW9tZW50OyB0aGVyZSBhcmVuJ3QgZW5vdWdoIGhhbmRzIGZvciBhbnlvbmUgdG8gcmVtYWluIGlkbGUgZm9yIGxvbmcuXCIpLFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dGV4dDogXyhcIkEgc3RvcmVmcm9udCwgc3RhZmZlZCBlbnRpcmVseSBieSBhIHNpbmdsZSBncmlubmluZyBqYWNrYXNzLCBzdGFuZHMgcHJvdWRseSBpbiB0aGUgbWFpbiBzcXVhcmUuXCIpLFxyXG5cdFx0XHRcdGlzVmlzaWJsZTogKCkgPT4ge1xyXG5cdFx0XHRcdFx0cmV0dXJuICRTTS5nZXQoJ1JvYWQuZ290QXBvbG9naXplZCcpICE9PSB1bmRlZmluZWQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRdKTtcclxuXHJcblx0XHRmb3IodmFyIGkgaW4gdGhpcy5kZXNjcmlwdGlvbikge1xyXG5cdFx0XHQkKCc8ZGl2PicpLnRleHQodGhpcy5kZXNjcmlwdGlvbltpXSkuYXBwZW5kVG8odGhpcy5kZXNjcmlwdGlvblBhbmVsKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHt9LCAvLyBOb3RoaW5nIGZvciBub3dcclxuXHJcblx0YXZhaWxhYmxlV2VhdGhlcjoge1xyXG5cdFx0J3N1bm55JzogMC40LFxyXG5cdFx0J2Nsb3VkeSc6IDAuMyxcclxuXHRcdCdyYWlueSc6IDAuM1xyXG5cdH0sXHJcblx0XHJcblx0b25BcnJpdmFsOiBmdW5jdGlvbih0cmFuc2l0aW9uX2RpZmYpIHtcclxuXHRcdFZpbGxhZ2Uuc2V0VGl0bGUoKTtcclxuXHJcblx0XHR0aGlzLnVwZGF0ZURlc2NyaXB0aW9uKCk7XHJcblxyXG5cdFx0V2VhdGhlci5pbml0aWF0ZVdlYXRoZXIoVmlsbGFnZS5hdmFpbGFibGVXZWF0aGVyLCAndmlsbGFnZScpO1xyXG5cdH0sXHJcblx0XHJcblx0c2V0VGl0bGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRpdGxlID0gXyhcIlRoZSBWaWxsYWdlXCIpO1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSB0aGlzKSB7XHJcblx0XHRcdGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XHJcblx0XHR9XHJcblx0XHQkKCdkaXYjbG9jYXRpb25fdmlsbGFnZScpLnRleHQodGl0bGUpO1xyXG5cdH0sXHJcblx0XHJcblx0dXBkYXRlQnV0dG9uOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBsaXpCdXR0b24gPSAkKCcjbGl6QnV0dG9uLmJ1dHRvbicpO1xyXG5cdFx0aWYoJFNNLmdldCgndmlsbGFnZS5saXpBY3RpdmUnKSkgbGl6QnV0dG9uLnNob3coKTtcclxuXHRcdHZhciBidWlsZGluZ0J1dHRvbiA9ICQoJyNuZXdCdWlsZGluZ0J1dHRvbi5idXR0b24nKTtcclxuXHRcdGlmKCRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnKSkgYnVpbGRpbmdCdXR0b24uc2hvdygpO1xyXG5cdFx0dmFyIHN0b3JlQnV0dG9uID0gJCgnI3N0b3JlQnV0dG9uLmJ1dHRvbicpO1xyXG5cdFx0aWYoJFNNLmdldCgnUm9hZC5nb3RBcG9sb2dpemVkJykpIHN0b3JlQnV0dG9uLnNob3coKTtcclxuXHR9LFxyXG5cdFxyXG5cdFxyXG5cdGhhbmRsZVN0YXRlVXBkYXRlczogZnVuY3Rpb24oZSl7XHJcblx0XHRpZihlLmNhdGVnb3J5ID09ICdzdG9yZXMnKXtcclxuXHRcdFx0Ly8gVmlsbGFnZS51cGRhdGVCdWlsZEJ1dHRvbnMoKTtcclxuXHRcdH0gZWxzZSBpZihlLmNhdGVnb3J5ID09ICdpbmNvbWUnKXtcclxuXHRcdH0gZWxzZSBpZihlLnN0YXRlTmFtZS5pbmRleE9mKCdnYW1lLmJ1aWxkaW5ncycpID09PSAwKXtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHR0ZW1wQnVpbGRpbmdNZXNzYWdlOiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ0EgTmV3IEJ1aWxkaW5nJyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1RoaXMgaXMgYSBuZXcgYnVpbGRpbmcuIFRoZXJlIHNob3VsZCBiZSBzdHVmZiBpbiBpdCwgYnV0IHRoaXMgaXMgYSBwbGFjZWhvbGRlciBmb3Igbm93LicpLFxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0xhbWUnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdG9wZW5TdG9yZTogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdBIE5ldyBCdWlsZGluZycpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKFwiVGhpcyBpcyB0aGUgc3RvcmUuIFRoZXJlJ3Mgbm90aGluZyBoZXJlIHlldCwgdGhvdWdoLlwiKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6ICB7XHJcblx0XHRcdFx0XHRcdGxlYXZlOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnTGFtZScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG59O1xyXG4iLCJpbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi4vQnV0dG9uXCI7XHJcbmltcG9ydCB7IEl0ZW1MaXN0IH0gZnJvbSBcIi4vaXRlbUxpc3RcIjtcclxuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5pbXBvcnQgeyBOb3RpZmljYXRpb25zIH0gZnJvbSBcIi4uL25vdGlmaWNhdGlvbnNcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IFF1ZXN0TG9nIH0gZnJvbSBcIi4vcXVlc3RMb2dcIjtcclxuaW1wb3J0IHsgUGVya0xpc3QgfSBmcm9tIFwiLi9wZXJrTGlzdFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IENoYXJhY3RlciA9IHtcclxuXHRpbnZlbnRvcnk6IHt9LCAvLyBkaWN0aW9uYXJ5IHVzaW5nIGl0ZW0gbmFtZSBhcyBrZXlcclxuXHRxdWVzdFN0YXR1czoge30sIC8vIGRpY3Rpb25hcnkgdXNpbmcgcXVlc3QgbmFtZSBhcyBrZXksIGFuZCBpbnRlZ2VyIHF1ZXN0IHBoYXNlIGFzIHZhbHVlXHJcblx0ZXF1aXBwZWRJdGVtczoge1xyXG5cdFx0Ly8gc3RlYWxpbmcgdGhlIEtvTCBzdHlsZSBmb3Igbm93LCB3ZSdsbCBzZWUgaWYgSSBuZWVkIHNvbWV0aGluZ1xyXG5cdFx0Ly8gdGhhdCBmaXRzIHRoZSBnYW1lIGJldHRlciBhcyB3ZSBnb1xyXG5cdFx0aGVhZDogbnVsbCxcclxuXHRcdHRvcnNvOiBudWxsLFxyXG5cdFx0cGFudHM6IG51bGwsXHJcblx0XHQvLyBubyB3ZWFwb24sIHRyeSB0byBzZWUgaG93IGZhciB3ZSBjYW4gZ2V0IGluIHRoaXMgZ2FtZSB3aXRob3V0IGZvY3VzaW5nIG9uIGNvbWJhdFxyXG5cdFx0YWNjZXNzb3J5MTogbnVsbCxcclxuXHRcdGFjY2Vzc29yeTI6IG51bGwsXHJcblx0XHRhY2Nlc3NvcnkzOiBudWxsLFxyXG5cdH0sXHJcblxyXG5cdC8vIHN0YXRzIGJlZm9yZSBhbnkgbW9kaWZpZXJzIGZyb20gZ2VhciBvciB3aGF0ZXZlciBlbHNlIGFyZSBhcHBsaWVkXHJcblx0cmF3U3RhdHM6IHtcclxuXHRcdCdTcGVlZCc6IDUsXHJcblx0XHQnUGVyY2VwdGlvbic6IDUsXHJcblx0XHQnUmVzaWxpZW5jZSc6IDUsXHJcblx0XHQnSW5nZW51aXR5JzogNSxcclxuXHRcdCdUb3VnaG5lc3MnOiA1XHJcblx0fSxcclxuXHJcblx0Ly8gcGVya3MgZ2l2ZW4gYnkgaXRlbXMsIGNoYXJhY3RlciBjaG9pY2VzLCBkaXZpbmUgcHJvdmVuYW5jZSwgZXRjLlxyXG5cdHBlcmtzOiB7IH0sXHJcblx0cGVya0FyZWE6IG51bGwsXHJcblx0XHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblx0XHRcclxuXHRcdC8vIGNyZWF0ZSB0aGUgY2hhcmFjdGVyIGJveFxyXG5cdFx0Y29uc3QgZWxlbSA9ICQoJzxkaXY+JykuYXR0cih7XHJcblx0XHRcdGlkOiAnY2hhcmFjdGVyJyxcclxuXHRcdFx0Y2xhc3NOYW1lOiAnY2hhcmFjdGVyJ1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdGVsZW0uYXBwZW5kVG8oJ2RpdiN3cmFwcGVyJyk7XHJcblxyXG5cdFx0Ly8gd3JpdGUgcmF3U3RhdHMgdG8gJFNNXHJcblx0XHQvLyBOT1RFOiBuZXZlciB3cml0ZSBkZXJpdmVkIHN0YXRzIHRvICRTTSwgYW5kIG5ldmVyIGFjY2VzcyByYXcgc3RhdHMgZGlyZWN0bHkhXHJcblx0XHQvLyBkb2luZyBzbyB3aWxsIGludHJvZHVjZSBvcHBvcnR1bml0aWVzIHRvIG1lc3MgdXAgc3RhdHMgUEVSTUFORU5UTFlcclxuICAgICAgICBpZiAoISRTTS5nZXQoJ2NoYXJhY3Rlci5yYXdzdGF0cycpKSB7XHJcbiAgICAgICAgICAgICRTTS5zZXQoJ2NoYXJhY3Rlci5yYXdzdGF0cycsIENoYXJhY3Rlci5yYXdTdGF0cyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHRcdFx0Q2hhcmFjdGVyLnJhd1N0YXRzID0gJFNNLmdldCgnY2hhcmFjdGVyLnJhd1N0YXRzJykgYXMgYW55O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghJFNNLmdldCgnY2hhcmFjdGVyLnBlcmtzJykpIHtcclxuICAgICAgICAgICAgJFNNLnNldCgnY2hhcmFjdGVyLnBlcmtzJywgQ2hhcmFjdGVyLnBlcmtzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cdFx0XHRDaGFyYWN0ZXIucGVya3MgPSAkU00uZ2V0KCdjaGFyYWN0ZXIucGVya3MnKSBhcyBhbnk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCEkU00uZ2V0KCdjaGFyYWN0ZXIuaW52ZW50b3J5JykpIHtcclxuICAgICAgICAgICAgJFNNLnNldCgnY2hhcmFjdGVyLmludmVudG9yeScsIENoYXJhY3Rlci5pbnZlbnRvcnkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5pbnZlbnRvcnkgPSAkU00uZ2V0KCdjaGFyYWN0ZXIuaW52ZW50b3J5JykgYXMgYW55O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghJFNNLmdldCgnY2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMnKSkge1xyXG4gICAgICAgICAgICAkU00uc2V0KCdjaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcycsIENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cdFx0XHRDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcyA9ICRTTS5nZXQoJ2NoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zJykgYXMgYW55O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghJFNNLmdldCgnY2hhcmFjdGVyLnF1ZXN0U3RhdHVzJykpIHtcclxuICAgICAgICAgICAgJFNNLnNldCgnY2hhcmFjdGVyLnF1ZXN0U3RhdHVzJywgQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cdFx0XHRDaGFyYWN0ZXIucXVlc3RTdGF0dXMgPSAkU00uZ2V0KCdjaGFyYWN0ZXIucXVlc3RTdGF0dXMnKSBhcyBhbnk7XHJcblx0XHR9XHJcblxyXG4gICAgICAgICQoJzxkaXY+JykudGV4dCgnQ2hhcmFjdGVyJylcclxuXHRcdC5jc3MoJ3RleHQtZGVjb3JhdGlvbicsICd1bmRlcmxpbmUnKVxyXG5cdFx0LmF0dHIoJ2lkJywgJ3RpdGxlJylcclxuXHRcdC5hcHBlbmRUbygnZGl2I2NoYXJhY3RlcicpO1xyXG5cclxuXHRcdC8vIFRPRE86IHJlcGxhY2UgdGhpcyB3aXRoIGRlcml2ZWQgc3RhdHNcclxuICAgICAgICBmb3IodmFyIHN0YXQgaW4gJFNNLmdldCgnY2hhcmFjdGVyLnJhd3N0YXRzJykgYXMgYW55KSB7XHJcbiAgICAgICAgICAgICQoJzxkaXY+JykudGV4dChzdGF0ICsgJzogJyArICRTTS5nZXQoJ2NoYXJhY3Rlci5yYXdzdGF0cy4nICsgc3RhdCkpLmFwcGVuZFRvKCdkaXYjY2hhcmFjdGVyJyk7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnYnV0dG9ucycpLmNzcyhcIm1hcmdpbi10b3BcIiwgXCIyMHB4XCIpLmFwcGVuZFRvKCdkaXYjY2hhcmFjdGVyJyk7XHJcblx0XHR2YXIgaW52ZW50b3J5QnV0dG9uID0gQnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiBcImludmVudG9yeVwiLFxyXG5cdFx0XHR0ZXh0OiBcIkludmVudG9yeVwiLFxyXG5cdFx0XHRjbGljazogQ2hhcmFjdGVyLm9wZW5JbnZlbnRvcnlcclxuXHRcdH0pLmFwcGVuZFRvKCQoJyNidXR0b25zJywgJ2RpdiNjaGFyYWN0ZXInKSk7XHJcblx0XHRcclxuXHRcdHZhciBxdWVzdExvZ0J1dHRvbiA9IEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogXCJxdWVzdExvZ1wiLFxyXG5cdFx0XHR0ZXh0OiBcIlF1ZXN0IExvZ1wiLFxyXG5cdFx0XHRjbGljazogQ2hhcmFjdGVyLm9wZW5RdWVzdExvZ1xyXG5cdFx0fSkuYXBwZW5kVG8oJCgnI2J1dHRvbnMnLCAnZGl2I2NoYXJhY3RlcicpKTtcclxuXHJcblx0XHR0aGlzLnBlcmtBcmVhID0gJCgnPGRpdj4nKS5hdHRyKHtcclxuXHRcdFx0aWQ6ICdwZXJrcycsXHJcblx0XHRcdGNsYXNzTmFtZTogJ3BlcmtzJ1xyXG5cdFx0XHR9KS5hcHBlbmRUbygnZGl2I2NoYXJhY3RlcicpO1xyXG5cclxuXHRcdC8vIFRPRE86IGFkZCBQZXJrcyBsaXN0IGJlbG93IGhlcmVcclxuXHRcdHRoaXMudXBkYXRlUGVya3MoKTtcclxuXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHR3aW5kb3cuQ2hhcmFjdGVyID0gdGhpcztcclxuXHR9LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHt9LCAvLyBOb3RoaW5nIGZvciBub3dcclxuXHRcclxuXHRlbGVtOiBudWxsLFxyXG5cclxuXHRpbnZlbnRvcnlEaXNwbGF5OiBudWxsIGFzIGFueSxcclxuXHRxdWVzdExvZ0Rpc3BsYXk6IG51bGwgYXMgYW55LFxyXG5cclxuXHRvcGVuSW52ZW50b3J5OiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIGNyZWF0aW5nIGEgaGFuZGxlIGZvciBsYXRlciBhY2Nlc3MsIHN1Y2ggYXMgY2xvc2luZyBpbnZlbnRvcnlcclxuXHRcdENoYXJhY3Rlci5pbnZlbnRvcnlEaXNwbGF5ID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdpbnZlbnRvcnknKS5hZGRDbGFzcygnZXZlbnRQYW5lbCcpLmNzcygnb3BhY2l0eScsICcwJyk7XHJcblx0XHR2YXIgaW52ZW50b3J5RGlzcGxheSA9IENoYXJhY3Rlci5pbnZlbnRvcnlEaXNwbGF5O1xyXG5cdFx0Q2hhcmFjdGVyLmludmVudG9yeURpc3BsYXlcclxuXHRcdC8vIHNldCB1cCBjbGljayBhbmQgaG92ZXIgaGFuZGxlcnMgZm9yIGludmVudG9yeSBpdGVtc1xyXG5cdFx0Lm9uKFwiY2xpY2tcIiwgXCIjaXRlbVwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0Q2hhcmFjdGVyLnVzZUludmVudG9yeUl0ZW0oJCh0aGlzKS5kYXRhKFwibmFtZVwiKSk7XHJcblx0XHRcdENoYXJhY3Rlci5jbG9zZUludmVudG9yeSgpO1xyXG5cdFx0fSkub24oXCJtb3VzZWVudGVyXCIsIFwiI2l0ZW1cIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciB0b29sdGlwID0gJChcIjxkaXYgaWQ9J3Rvb2x0aXAnIGNsYXNzPSd0b29sdGlwJz5cIiArIEl0ZW1MaXN0WyQodGhpcykuZGF0YShcIm5hbWVcIildLnRleHQgKyBcIjwvZGl2PlwiKVxyXG5cdFx0XHQuYXR0cignZGF0YS1uYW1lJywgaXRlbSk7XHJcblx0XHRcdHRvb2x0aXAuYXBwZW5kVG8oJCh0aGlzKSk7XHJcblx0XHR9KS5vbihcIm1vdXNlbGVhdmVcIiwgXCIjaXRlbVwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0JChcIiN0b29sdGlwXCIsIFwiI1wiICsgJCh0aGlzKS5kYXRhKFwibmFtZVwiKSkuZmFkZU91dCgpLnJlbW92ZSgpO1xyXG5cdFx0fSk7XHJcblx0XHQkKCc8ZGl2PicpLmFkZENsYXNzKCdldmVudFRpdGxlJykudGV4dCgnSW52ZW50b3J5JykuYXBwZW5kVG8oaW52ZW50b3J5RGlzcGxheSk7XHJcblx0XHR2YXIgaW52ZW50b3J5RGVzYyA9ICQoJzxkaXY+JykudGV4dChcIkNsaWNrIHRoaW5ncyBpbiB0aGUgbGlzdCB0byB1c2UgdGhlbS5cIilcclxuXHRcdFx0LmhvdmVyKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciB0b29sdGlwID0gJChcIjxkaXYgaWQ9J3Rvb2x0aXAnIGNsYXNzPSd0b29sdGlwJz5cIiArIFwiTm90IHRoaXMsIHRob3VnaC5cIiArIFwiPC9kaXY+XCIpO1xyXG4gICAgXHRcdFx0dG9vbHRpcC5hcHBlbmRUbyhpbnZlbnRvcnlEZXNjKTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JChcIiN0b29sdGlwXCIpLmZhZGVPdXQoKS5yZW1vdmUoKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0Lm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXyhcIkkgYmV0IHlvdSB0aGluayB5b3UncmUgcHJldHR5IGZ1bm55LCBodWg/IENsaWNraW5nIHRoZSB0aGluZyBJIHNhaWQgd2Fzbid0IGNsaWNrYWJsZT9cIikpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQuY3NzKFwibWFyZ2luLWJvdHRvbVwiLCBcIjIwcHhcIilcclxuXHRcdFx0LmFwcGVuZFRvKGludmVudG9yeURpc3BsYXkpO1xyXG5cdFx0XHJcblx0XHRmb3IodmFyIGl0ZW0gaW4gQ2hhcmFjdGVyLmludmVudG9yeSkge1xyXG5cdFx0XHQvLyBtYWtlIHRoZSBpbnZlbnRvcnkgY291bnQgbG9vayBhIGJpdCBuaWNlclxyXG5cdFx0XHR2YXIgaW52ZW50b3J5RWxlbSA9ICQoJzxkaXY+JylcclxuXHRcdFx0LmF0dHIoJ2lkJywgJ2l0ZW0nKVxyXG5cdFx0XHQuYXR0cignZGF0YS1uYW1lJywgaXRlbSlcclxuXHRcdFx0LnRleHQoSXRlbUxpc3RbaXRlbV0ubmFtZSAgKyAnICAoeCcgKyBDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dLnRvU3RyaW5nKCkgKyAnKScpXHJcblx0XHRcdC5hcHBlbmRUbyhpbnZlbnRvcnlEaXNwbGF5KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBUT0RPOiBtYWtlIHRoaXMgQ1NTIGFuIGFjdHVhbCBjbGFzcyBzb21ld2hlcmUsIEknbSBzdXJlIEknbGwgbmVlZCBpdCBhZ2FpblxyXG5cdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdidXR0b25zJykuY3NzKFwibWFyZ2luLXRvcFwiLCBcIjIwcHhcIikuYXBwZW5kVG8oaW52ZW50b3J5RGlzcGxheSk7XHJcblx0XHR2YXIgYiA9IFxyXG5cdFx0Ly9uZXcgXHJcblx0XHRCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6IFwiY2xvc2VJbnZlbnRvcnlcIixcclxuXHRcdFx0dGV4dDogXCJDbG9zZVwiLFxyXG5cdFx0XHRjbGljazogQ2hhcmFjdGVyLmNsb3NlSW52ZW50b3J5XHJcblx0XHR9KS5hcHBlbmRUbygkKCcjYnV0dG9ucycsIGludmVudG9yeURpc3BsYXkpKTtcclxuXHRcdCQoJ2RpdiN3cmFwcGVyJykuYXBwZW5kKGludmVudG9yeURpc3BsYXkpO1xyXG5cdFx0aW52ZW50b3J5RGlzcGxheS5hbmltYXRlKHtvcGFjaXR5OiAxfSwgRXZlbnRzLl9QQU5FTF9GQURFLCAnbGluZWFyJyk7XHJcblx0fSxcclxuXHJcblx0Y2xvc2VJbnZlbnRvcnk6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Q2hhcmFjdGVyLmludmVudG9yeURpc3BsYXkuZW1wdHkoKTtcclxuXHRcdENoYXJhY3Rlci5pbnZlbnRvcnlEaXNwbGF5LnJlbW92ZSgpO1xyXG5cdH0sXHJcblxyXG5cdGFkZFRvSW52ZW50b3J5OiBmdW5jdGlvbihpdGVtLCBhbW91bnQ9MSkge1xyXG5cdFx0aWYgKENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0pIHtcclxuXHRcdFx0Q2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSArPSBhbW91bnQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dID0gYW1vdW50O1xyXG5cdFx0fVxyXG5cclxuXHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiQWRkZWQgXCIgKyBJdGVtTGlzdFtpdGVtXS5uYW1lICsgXCIgdG8gaW52ZW50b3J5LlwiKVxyXG5cdFx0JFNNLnNldCgnaW52ZW50b3J5JywgQ2hhcmFjdGVyLmludmVudG9yeSk7XHJcblx0fSxcclxuXHJcblxyXG5cdHJlbW92ZUZyb21JbnZlbnRvcnk6IGZ1bmN0aW9uKGl0ZW0sIGFtb3VudD0xKSB7XHJcblx0XHRpZiAoQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSkgQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSAtPSBhbW91bnQ7XHJcblx0XHRpZiAoQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSA8IDEpIHtcclxuXHRcdFx0ZGVsZXRlIENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV07XHJcblx0XHR9XHJcblxyXG5cdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJSZW1vdmVkIFwiICsgSXRlbUxpc3RbaXRlbV0ubmFtZSArIFwiIGZyb20gaW52ZW50b3J5LlwiKVxyXG5cdFx0JFNNLnNldCgnaW52ZW50b3J5JywgQ2hhcmFjdGVyLmludmVudG9yeSk7XHJcblx0fSxcclxuXHJcblx0dXNlSW52ZW50b3J5SXRlbTogZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0aWYgKENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0gJiYgQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSA+IDApIHtcclxuXHRcdFx0Ly8gdXNlIHRoZSBlZmZlY3QgaW4gdGhlIGludmVudG9yeTsganVzdCBpbiBjYXNlIGEgbmFtZSBtYXRjaGVzIGJ1dCB0aGUgZWZmZWN0XHJcblx0XHRcdC8vIGRvZXMgbm90LCBhc3N1bWUgdGhlIGludmVudG9yeSBpdGVtIGlzIHRoZSBzb3VyY2Ugb2YgdHJ1dGhcclxuXHRcdFx0SXRlbUxpc3RbaXRlbV0ub25Vc2UoKTtcclxuXHRcdFx0aWYgKHR5cGVvZihJdGVtTGlzdFtpdGVtXS5kZXN0cm95T25Vc2UpID09IFwiZnVuY3Rpb25cIiAmJiBJdGVtTGlzdFtpdGVtXS5kZXN0cm95T25Vc2UoKSkge1xyXG5cdFx0XHRcdENoYXJhY3Rlci5yZW1vdmVGcm9tSW52ZW50b3J5KGl0ZW0pO1xyXG5cdFx0XHR9IGVsc2UgaWYgKEl0ZW1MaXN0W2l0ZW1dLmRlc3Ryb3lPblVzZSkge1xyXG5cdFx0XHRcdENoYXJhY3Rlci5yZW1vdmVGcm9tSW52ZW50b3J5KGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0JFNNLnNldCgnaW52ZW50b3J5JywgQ2hhcmFjdGVyLmludmVudG9yeSk7XHJcblx0fSxcclxuXHJcblx0ZXF1aXBJdGVtOiBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRpZiAoSXRlbUxpc3RbaXRlbV0uc2xvdCAmJiBDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtc1tJdGVtTGlzdFtpdGVtXS5zbG90XSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdENoYXJhY3Rlci5hZGRUb0ludmVudG9yeShDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtc1tJdGVtTGlzdFtpdGVtXS5zbG90XSk7XHJcblx0XHRcdENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zW0l0ZW1MaXN0W2l0ZW1dLnNsb3RdID0gaXRlbTtcclxuXHRcdFx0aWYgKEl0ZW1MaXN0W2l0ZW1dLm9uRXF1aXApIHtcclxuXHRcdFx0XHRJdGVtTGlzdFtpdGVtXS5vbkVxdWlwKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Q2hhcmFjdGVyLmFwcGx5RXF1aXBtZW50RWZmZWN0cygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdCRTTS5zZXQoJ2VxdWlwcGVkSXRlbXMnLCBDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcyk7XHJcblx0XHQkU00uc2V0KCdpbnZlbnRvcnknLCBDaGFyYWN0ZXIuaW52ZW50b3J5KTtcclxuXHR9LFxyXG5cclxuXHRncmFudFBlcms6IGZ1bmN0aW9uKHBlcmspIHtcclxuXHRcdGlmIChDaGFyYWN0ZXIucGVya3NbcGVya10gIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRpZihwZXJrLnRpbWVMZWZ0ID4gMCkge1xyXG5cdFx0XHRcdENoYXJhY3Rlci5wZXJrc1twZXJrXSArPSBwZXJrLnRpbWVMZWZ0O1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRDaGFyYWN0ZXIucGVya3NbcGVya10gPSBwZXJrO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMudXBkYXRlUGVya3MoKTtcclxuXHJcblx0XHROb3RpZmljYXRpb25zLm5vdGlmeSgnbnVsbCcsIFwiQWNxdWlyZWQgZWZmZWN0OiBcIiArIFBlcmtMaXN0W3BlcmtdLm5hbWUpO1xyXG5cdFx0XHJcblx0XHQkU00uc2V0KCdwZXJrcycsIENoYXJhY3Rlci5wZXJrcyk7XHJcblx0fSxcclxuXHJcblx0cmVtb3ZlUGVyazogZnVuY3Rpb24ocGVyaykge1xyXG5cdFx0aWYgKENoYXJhY3Rlci5wZXJrc1twZXJrLm5hbWVdICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0ZGVsZXRlIENoYXJhY3Rlci5wZXJrc1twZXJrLm5hbWVdO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMudXBkYXRlUGVya3MoKTtcclxuXHJcblx0XHROb3RpZmljYXRpb25zLm5vdGlmeSgnbnVsbCcsIFwiTG9zdCBlZmZlY3Q6IFwiICsgUGVya0xpc3RbcGVya10ubmFtZSk7XHJcblxyXG5cdFx0JFNNLnNldCgncGVya3MnLCBDaGFyYWN0ZXIucGVya3MpO1xyXG5cdH0sXHJcblxyXG5cdHVwZGF0ZVBlcmtzOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMucGVya0FyZWEuZW1wdHkoKTtcclxuXHRcdGlmIChPYmplY3Qua2V5cyh0aGlzLnBlcmtzKS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdCQoJzxkaXY+JykudGV4dCgnUGVya3MnKVxyXG5cdFx0XHQuY3NzKCd0ZXh0LWRlY29yYXRpb24nLCAndW5kZXJsaW5lJylcclxuXHRcdFx0LmNzcygnbWFyZ2luLXRvcCcsICcxMHB4JylcclxuXHRcdFx0LmF0dHIoJ2lkJywgJ3RpdGxlJylcclxuXHRcdFx0LmFwcGVuZFRvKCdkaXYjcGVya3MnKTtcclxuXHRcdFx0Ly8gc2V0IHVwIGNsaWNrIGFuZCBob3ZlciBoYW5kbGVycyBmb3IgcGVya3NcclxuXHRcdHRoaXMucGVya0FyZWFcclxuXHRcdC5vbihcImNsaWNrXCIsIFwiI3BlcmtcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdC8vIGhhbmRsZSB0aGlzIHdoZW4gd2UgaGF2ZSBwZXJrIGRlc2NyaXB0aW9ucyBhbmQgc3R1ZmZcclxuXHRcdH0pLm9uKFwibW91c2VlbnRlclwiLCBcIiNwZXJrXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgdG9vbHRpcCA9ICQoXCI8ZGl2IGlkPSd0b29sdGlwJyBjbGFzcz0ndG9vbHRpcCc+XCIgKyBQZXJrTGlzdFskKHRoaXMpLmRhdGEoXCJuYW1lXCIpXS50ZXh0ICsgXCI8L2Rpdj5cIilcclxuXHRcdFx0LmF0dHIoJ2RhdGEtbmFtZScsIHBlcmspO1xyXG5cdFx0XHR0b29sdGlwLmFwcGVuZFRvKCQodGhpcykpO1xyXG5cdFx0fSkub24oXCJtb3VzZWxlYXZlXCIsIFwiI3BlcmtcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQoXCIjdG9vbHRpcFwiLCBcIiNcIiArICQodGhpcykuZGF0YShcIm5hbWVcIikpLmZhZGVPdXQoKS5yZW1vdmUoKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdFx0Zm9yKHZhciBwZXJrIGluIENoYXJhY3Rlci5wZXJrcykge1xyXG5cdFx0XHRcdC8vIGFkZCBtb3VzZW92ZXIgYW5kIGNsaWNrIHN0dWZmXHJcblx0XHRcdFx0dmFyIHBlcmtFbGVtID0gJCgnPGRpdj4nKVxyXG5cdFx0XHRcdC5hdHRyKCdpZCcsICdwZXJrJylcclxuXHRcdFx0XHQuYXR0cignZGF0YS1uYW1lJywgcGVyaylcclxuXHRcdFx0XHQudGV4dChQZXJrTGlzdFtwZXJrXS5uYW1lKVxyXG5cdFx0XHRcdC5hcHBlbmRUbygnZGl2I3BlcmtzJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRvcGVuUXVlc3RMb2c6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gY3JlYXRpbmcgYSBoYW5kbGUgZm9yIGxhdGVyIGFjY2Vzcywgc3VjaCBhcyBjbG9zaW5nIHF1ZXN0IGxvZ1xyXG5cdFx0Q2hhcmFjdGVyLnF1ZXN0TG9nRGlzcGxheSA9ICQoJzxkaXY+JykuYXR0cignaWQnLCAncXVlc3QnKS5hZGRDbGFzcygnZXZlbnRQYW5lbCcpLmNzcygnb3BhY2l0eScsICcwJyk7XHJcblx0XHR2YXIgcXVlc3RMb2dEaXNwbGF5ID0gQ2hhcmFjdGVyLnF1ZXN0TG9nRGlzcGxheTtcclxuXHRcdENoYXJhY3Rlci5xdWVzdExvZ0Rpc3BsYXlcclxuXHRcdC8vIHNldCB1cCBjbGljayBhbmQgaG92ZXIgaGFuZGxlcnMgZm9yIHF1ZXN0c1xyXG5cdFx0Lm9uKFwiY2xpY2tcIiwgXCIjcXVlc3RcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdENoYXJhY3Rlci5kaXNwbGF5UXVlc3QoJCh0aGlzKS5kYXRhKFwibmFtZVwiKSk7XHJcblx0XHR9KTtcclxuXHRcdCQoJzxkaXY+JykuYWRkQ2xhc3MoJ2V2ZW50VGl0bGUnKS50ZXh0KCdRdWVzdCBMb2cnKS5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0dmFyIHF1ZXN0TG9nRGVzYyA9ICQoJzxkaXY+JykudGV4dChcIkNsaWNrIHF1ZXN0IG5hbWVzIHRvIHNlZSBtb3JlIGluZm8uXCIpXHJcblx0XHRcdC5jc3MoXCJtYXJnaW4tYm90dG9tXCIsIFwiMjBweFwiKVxyXG5cdFx0XHQuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHRcdFxyXG5cdFx0Zm9yKHZhciBxdWVzdCBpbiBDaGFyYWN0ZXIucXVlc3RTdGF0dXMpIHtcclxuXHRcdFx0dmFyIHF1ZXN0RWxlbSA9ICQoJzxkaXY+JylcclxuXHRcdFx0LmF0dHIoJ2lkJywgXCJxdWVzdFwiKVxyXG5cdFx0XHQuYXR0cignZGF0YS1uYW1lJywgcXVlc3QpXHJcblx0XHRcdC50ZXh0KFF1ZXN0TG9nW3F1ZXN0XS5uYW1lKVxyXG5cdFx0XHQuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHRcdFx0aWYgKENoYXJhY3Rlci5xdWVzdFN0YXR1c1txdWVzdF0gPT0gLTEpIHtcclxuXHRcdFx0XHRxdWVzdEVsZW1cclxuXHRcdFx0XHQvLyBJIHdhbnQgdGhpcyB0byBiZSBub3Qgc3RydWNrIHRocm91Z2gsIGJ1dCB0aGF0J3MgdG9vIGFubm95aW5nIHRvIHdvcnJ5XHJcblx0XHRcdFx0Ly8gYWJvdXQgcmlnaHQgbm93XHJcblx0XHRcdFx0Ly8gLnByZXBlbmQoXCJET05FIFwiKVxyXG5cdFx0XHRcdC53cmFwKFwiPHN0cmlrZT5cIik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBUT0RPOiBtYWtlIHRoaXMgQ1NTIGFuIGFjdHVhbCBjbGFzcyBzb21ld2hlcmUsIEknbSBzdXJlIEknbGwgbmVlZCBpdCBhZ2FpblxyXG5cdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdidXR0b25zJykuY3NzKFwibWFyZ2luLXRvcFwiLCBcIjIwcHhcIikuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHRcdHZhciBiID0gQnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiBcImNsb3NlUXVlc3RMb2dcIixcclxuXHRcdFx0dGV4dDogXCJDbG9zZVwiLFxyXG5cdFx0XHRjbGljazogQ2hhcmFjdGVyLmNsb3NlUXVlc3RMb2dcclxuXHRcdH0pLmFwcGVuZFRvKCQoJyNidXR0b25zJywgcXVlc3RMb2dEaXNwbGF5KSk7XHJcblx0XHQkKCdkaXYjd3JhcHBlcicpLmFwcGVuZChxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0cXVlc3RMb2dEaXNwbGF5LmFuaW1hdGUoe29wYWNpdHk6IDF9LCBFdmVudHMuX1BBTkVMX0ZBREUsICdsaW5lYXInKTtcclxuXHR9LFxyXG5cclxuXHRkaXNwbGF5UXVlc3Q6IGZ1bmN0aW9uKHF1ZXN0OiBzdHJpbmcpIHtcclxuXHRcdGNvbnN0IHF1ZXN0TG9nRGlzcGxheSA9IENoYXJhY3Rlci5xdWVzdExvZ0Rpc3BsYXk7XHJcblx0XHRxdWVzdExvZ0Rpc3BsYXkuZW1wdHkoKTtcclxuXHRcdGNvbnN0IGN1cnJlbnRRdWVzdCA9IFF1ZXN0TG9nW3F1ZXN0XTtcclxuXHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ3F1ZXN0JykuYWRkQ2xhc3MoJ2V2ZW50UGFuZWwnKS5jc3MoJ29wYWNpdHknLCAnMCcpO1xyXG5cdFx0JCgnPGRpdj4nKS5hZGRDbGFzcygnZXZlbnRUaXRsZScpLnRleHQoY3VycmVudFF1ZXN0Lm5hbWUpLmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblxyXG5cdFx0dmFyIHF1ZXN0TG9nRGVzYyA9ICQoJzxkaXY+JykudGV4dChjdXJyZW50UXVlc3QubG9nRGVzY3JpcHRpb24pXHJcblx0XHRcdC5jc3MoXCJtYXJnaW4tYm90dG9tXCIsIFwiMjBweFwiKVxyXG5cdFx0XHQuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHJcblx0XHRpZiAoQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW3F1ZXN0XSBhcyBudW1iZXIgPT0gLTEpIHtcclxuXHRcdFx0dmFyIHBoYXNlRGVzYyA9ICQoJzxkaXY+JykudGV4dChcIlRoaXMgcXVlc3QgaXMgY29tcGxldGUhXCIpXHJcblx0XHRcdC5jc3MoXCJtYXJnaW4tYm90dG9tXCIsIFwiMTBweFwiKVxyXG5cdFx0XHQuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8PSAoQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW3F1ZXN0XSBhcyBudW1iZXIpOyBpKyspIHtcclxuXHRcdFx0dmFyIHBoYXNlRGVzYyA9ICQoJzxkaXY+JykudGV4dChjdXJyZW50UXVlc3QucGhhc2VzW2ldLmRlc2NyaXB0aW9uKVxyXG5cdFx0XHQuY3NzKFwibWFyZ2luLWJvdHRvbVwiLCBcIjEwcHhcIilcclxuXHRcdFx0LmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHRcdHZhciBjb21wbGV0ZSA9IHRydWU7XHJcblx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgT2JqZWN0LmtleXMoY3VycmVudFF1ZXN0LnBoYXNlc1tpXS5yZXF1aXJlbWVudHMpLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0dmFyIHJlcXVpcmVtZW50c0Rlc2MgPSAkKCc8ZGl2PicpLnRleHQoY3VycmVudFF1ZXN0LnBoYXNlc1tpXS5yZXF1aXJlbWVudHNbal0ucmVuZGVyUmVxdWlyZW1lbnQoKSlcclxuXHRcdFx0XHRcdC5jc3MoXCJtYXJnaW4tYm90dG9tXCIsIFwiMjBweFwiKVxyXG5cdFx0XHRcdFx0LmNzcyhcIm1hcmdpbi1sZWZ0XCIsIFwiMjBweFwiKVxyXG5cdFx0XHRcdFx0LmNzcygnZm9udC1zdHlsZScsICdpdGFsaWMnKVxyXG5cdFx0XHRcdFx0LmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHRcdFx0aWYgKCFjdXJyZW50UXVlc3QucGhhc2VzW2ldLnJlcXVpcmVtZW50c1tqXS5pc0NvbXBsZXRlKCkpIGNvbXBsZXRlID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGNvbXBsZXRlKSB7XHJcblx0XHRcdFx0cGhhc2VEZXNjLndyYXAoXCI8c3RyaWtlPlwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFRPRE86IG1ha2UgdGhpcyBDU1MgYW4gYWN0dWFsIGNsYXNzIHNvbWV3aGVyZSwgSSdtIHN1cmUgSSdsbCBuZWVkIGl0IGFnYWluXHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2J1dHRvbnMnKS5jc3MoXCJtYXJnaW4tdG9wXCIsIFwiMjBweFwiKS5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cclxuXHRcdHZhciBiID0gQnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiBcImJhY2tUb1F1ZXN0TG9nXCIsXHJcblx0XHRcdHRleHQ6IFwiQmFjayB0byBRdWVzdCBMb2dcIixcclxuXHRcdFx0Y2xpY2s6IENoYXJhY3Rlci5iYWNrVG9RdWVzdExvZ1xyXG5cdFx0fSkuYXBwZW5kVG8oJCgnI2J1dHRvbnMnLCBxdWVzdExvZ0Rpc3BsYXkpKTtcclxuXHJcblx0XHR2YXIgYiA9IEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogXCJjbG9zZVF1ZXN0TG9nXCIsXHJcblx0XHRcdHRleHQ6IFwiQ2xvc2VcIixcclxuXHRcdFx0Y2xpY2s6IENoYXJhY3Rlci5jbG9zZVF1ZXN0TG9nXHJcblx0XHR9KS5hcHBlbmRUbygkKCcjYnV0dG9ucycsIHF1ZXN0TG9nRGlzcGxheSkpO1xyXG5cdH0sXHJcblxyXG5cdGNsb3NlUXVlc3RMb2c6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Q2hhcmFjdGVyLnF1ZXN0TG9nRGlzcGxheS5lbXB0eSgpO1xyXG5cdFx0Q2hhcmFjdGVyLnF1ZXN0TG9nRGlzcGxheS5yZW1vdmUoKTtcclxuXHR9LFxyXG5cclxuXHRiYWNrVG9RdWVzdExvZzogZnVuY3Rpb24oKSB7XHJcblx0XHRDaGFyYWN0ZXIuY2xvc2VRdWVzdExvZygpO1xyXG5cdFx0Q2hhcmFjdGVyLm9wZW5RdWVzdExvZygpO1xyXG5cdH0sXHJcblxyXG5cdHNldFF1ZXN0U3RhdHVzOiBmdW5jdGlvbihxdWVzdCwgcGhhc2UpIHtcclxuXHRcdC8vIG1pZ2h0IGJlIGEgZ29vZCBpZGVhIHRvIGNoZWNrIGZvciBsaW5lYXIgcXVlc3QgcHJvZ3Jlc3Npb24gaGVyZT9cclxuXHRcdGlmIChRdWVzdExvZ1txdWVzdF0gIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdID0gcGhhc2U7XHJcblxyXG5cdFx0XHROb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIlF1ZXN0IExvZyB1cGRhdGVkLlwiKTtcclxuXHRcdFx0JFNNLnNldCgncXVlc3RTdGF0dXMnLCBDaGFyYWN0ZXIucXVlc3RTdGF0dXMpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdGNoZWNrUXVlc3RTdGF0dXM6IGZ1bmN0aW9uKHF1ZXN0KSB7XHJcblx0XHRjb25zdCBjdXJyZW50UGhhc2UgPSBRdWVzdExvZ1txdWVzdF0ucGhhc2VzW0NoYXJhY3Rlci5xdWVzdFN0YXR1c1txdWVzdF1dO1xyXG5cclxuXHRcdGlmIChjdXJyZW50UGhhc2UgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuXHRcdHZhciBjb21wbGV0ZSA9IHRydWU7XHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IE9iamVjdC5rZXlzKGN1cnJlbnRQaGFzZS5yZXF1aXJlbWVudHMpLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmICghY3VycmVudFBoYXNlLnJlcXVpcmVtZW50c1tpXS5pc0NvbXBsZXRlKCkpXHJcblx0XHRcdFx0Y29tcGxldGUgPSBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoY29tcGxldGUpIHtcclxuXHRcdFx0Ly8gaWYgdGhlcmUgaXMgYSBuZXh0IHBoYXNlLCBzZXQgcXVlc3RTdGF0dXMgdG8gaXRcclxuXHRcdFx0aWYgKFF1ZXN0TG9nW3F1ZXN0XS5waGFzZXNbQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW3F1ZXN0XSArIDFdICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdICs9IDE7XHJcblx0XHRcdH0gZWxzZSB7IC8vIGVsc2Ugc2V0IGl0IHRvIGNvbXBsZXRlXHJcblx0XHRcdFx0Q2hhcmFjdGVyLnF1ZXN0U3RhdHVzW3F1ZXN0XSA9IC0xO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiUXVlc3QgTG9nIHVwZGF0ZWQuXCIpO1xyXG5cdFx0JFNNLnNldCgncXVlc3RTdGF0dXMnLCBDaGFyYWN0ZXIucXVlc3RTdGF0dXMpO1xyXG5cdH0sXHJcblxyXG5cdC8vIGFwcGx5IGVxdWlwbWVudCBlZmZlY3RzLCB3aGljaCBzaG91bGQgYWxsIGNoZWNrIGFnYWluc3QgJFNNIHN0YXRlIHZhcmlhYmxlcztcclxuXHQvLyB0aGlzIHNob3VsZCBiZSBjYWxsZWQgb24gYmFzaWNhbGx5IGV2ZXJ5IHBsYXllciBhY3Rpb24gd2hlcmUgYSBwaWVjZSBvZiBnZWFyXHJcblx0Ly8gd291bGQgZG8gc29tZXRoaW5nIG9yIGNoYW5nZSBhbiBvdXRjb21lOyBnaXZlIGV4dHJhUGFyYW1zIHRvIHRoZSBlZmZlY3QgYmVpbmcgXHJcblx0Ly8gYXBwbGllZCBmb3IgYW55dGhpbmcgdGhhdCdzIHJlbGV2YW50IHRvIHRoZSBlZmZlY3QgYnV0IG5vdCBoYW5kbGVkIGJ5ICRTTVxyXG5cdGFwcGx5RXF1aXBtZW50RWZmZWN0czogZnVuY3Rpb24oZXh0cmFQYXJhbXM/KSB7XHJcblx0XHRmb3IgKGNvbnN0IGl0ZW0gaW4gQ2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMpIHtcclxuXHRcdFx0aWYgKEl0ZW1MaXN0W2l0ZW1dLmVmZmVjdHMpIHtcclxuXHRcdFx0XHRmb3IgKGNvbnN0IGVmZmVjdCBpbiBJdGVtTGlzdFtpdGVtXS5lZmZlY3RzKSB7XHJcblx0XHRcdFx0XHQvLyBOT1RFOiBjdXJyZW50bHkgdGhpcyBpcyBnb29kIGZvciBhcHBseWluZyBwZXJrcyBhbmQgTm90aWZ5aW5nO1xyXG5cdFx0XHRcdFx0Ly8gYXJlIHRoZXJlIG90aGVyIHNpdHVhdGlvbnMgd2hlcmUgd2UnZCB3YW50IHRvIGFwcGx5IGVmZmVjdHMsXHJcblx0XHRcdFx0XHQvLyBvciBjYW4gd2UgY292ZXIgYmFzaWNhbGx5IGV2ZXJ5IGNhc2UgdmlhIHRob3NlIHRoaW5ncz9cclxuXHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdFx0XHRcdGlmIChlZmZlY3QuaXNBY3RpdmUgJiYgZWZmZWN0LmlzQWN0aXZlKGV4dHJhUGFyYW1zKSkgZWZmZWN0LmFwcGx5KGV4dHJhUGFyYW1zKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHQvLyBnZXQgc3RhdHMgYWZ0ZXIgYXBwbHlpbmcgYWxsIGVxdWlwbWVudCBib251c2VzLCBwZXJrcywgZXRjLlxyXG5cdGdldERlcml2ZWRTdGF0czogZnVuY3Rpb24oKSB7XHJcblx0XHRjb25zdCBkZXJpdmVkU3RhdHMgPSBzdHJ1Y3R1cmVkQ2xvbmUoQ2hhcmFjdGVyLnJhd1N0YXRzKTtcclxuXHRcdGZvciAoY29uc3QgaXRlbSBpbiBDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcykge1xyXG5cdFx0XHRpZiAoSXRlbUxpc3RbaXRlbV0uc3RhdEJvbnVzZXMpIHtcclxuXHRcdFx0XHRmb3IgKGNvbnN0IHN0YXQgaW4gT2JqZWN0LmtleXMoSXRlbUxpc3RbaXRlbV0uc3RhdEJvbnVzZXMpKSB7XHJcblx0XHRcdFx0XHRpZiAodHlwZW9mIChJdGVtTGlzdFtpdGVtXS5zdGF0Qm9udXNlc1tzdGF0XSA9PSBcImZ1bmN0aW9uXCIpKSB7XHJcblx0XHRcdFx0XHRcdGRlcml2ZWRTdGF0c1tzdGF0XSArPSBJdGVtTGlzdFtpdGVtXS5zdGF0Qm9udXNlc1tzdGF0XSgpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0ZGVyaXZlZFN0YXRzW3N0YXRdICs9IEl0ZW1MaXN0W2l0ZW1dLnN0YXRCb251c2VzW3N0YXRdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAoY29uc3QgcGVyayBpbiBDaGFyYWN0ZXIucGVya3MpIHtcclxuXHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRpZiAocGVyay5zdGF0Qm9udXNlcykge1xyXG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdFx0XHRmb3IgKGNvbnN0IHN0YXQgaW4gT2JqZWN0LmtleXMocGVyay5zdGF0Qm9udXNlcykpIHtcclxuXHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdFx0XHRcdGlmICh0eXBlb2YgKHBlcmsuc3RhdEJvbnVzZXNbc3RhdF0gPT0gXCJmdW5jdGlvblwiKSkge1xyXG5cdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0XHRcdGRlcml2ZWRTdGF0c1tzdGF0XSArPSBwZXJrLnN0YXRCb251c2VzW3N0YXRdKCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0XHRcdGRlcml2ZWRTdGF0c1tzdGF0XSArPSBwZXJrLnN0YXRCb251c2VzW3N0YXRdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBkZXJpdmVkU3RhdHM7XHJcblx0fVxyXG59IiwiLy8gYWxsIGl0ZW1zIGdvIGhlcmUsIHNvIHRoYXQgbm90aGluZyBzaWxseSBoYXBwZW5zIGluIHRoZSBldmVudCB0aGF0IHRoZXkgZ2V0IHB1dCBpbiBMb2NhbCBTdG9yYWdlXHJcbi8vIGFzIHBhcnQgb2YgdGhlIHN0YXRlIG1hbmFnZW1lbnQgY29kZTsgcGxlYXNlIHNhdmUgaXRlbSBuYW1lcyB0byB0aGUgaW52ZW50b3J5LCBhbmQgdGhlbiByZWZlciB0byBcclxuLy8gdGhlIGl0ZW0gbGlzdCB2aWEgdGhlIGl0ZW0gbmFtZVxyXG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgTm90aWZpY2F0aW9ucyB9IGZyb20gXCIuLi9ub3RpZmljYXRpb25zXCI7XHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tIFwiLi9pdGVtXCI7XHJcblxyXG4vLyBEZXRhaWxzIGZvciBhbGwgaW4tZ2FtZSBpdGVtczsgdGhlIENoYXJhY3RlciBpbnZlbnRvcnkgb25seSBob2xkcyBpdGVtIElEc1xyXG4vLyBhbmQgYW1vdW50c1xyXG5leHBvcnQgY29uc3QgSXRlbUxpc3Q6IHtbaWQ6IHN0cmluZ106IEl0ZW19ID0ge1xyXG4gICAgXCJMaXoud2VpcmRCb29rXCI6IHtcclxuICAgICAgICBuYW1lOiAnV2VpcmQgQm9vaycsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ1dlaXJkIEJvb2tzJyxcclxuICAgICAgICB0ZXh0OiBfKCdBIGJvb2sgeW91IGZvdW5kIGF0IExpelxcJ3MgcGxhY2UuIFN1cHBvc2VkbHkgaGFzIGluZm9ybWF0aW9uIGFib3V0IENoYWR0b3BpYS4nKSxcclxuICAgICAgICBvblVzZTogZnVuY3Rpb24oKSB7IFxyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogIF8oXCJBIEJyaWVmIEhpc3Rvcnkgb2YgQ2hhZHRvcGlhXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXygnVGhpcyBib29rIGlzIHByZXR0eSBib3JpbmcsIGJ1dCB5b3UgbWFuYWdlIHRvIGxlYXJuIGEgYml0IG1vcmUgaW4gc3BpdGUgb2YgeW91ciBwb29yIGF0dGVudGlvbiBzcGFuLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXygnRm9yIGV4YW1wbGUsIHlvdSBsZWFybiB0aGF0IFwiQ2hhZHRvcGlhXCIgZG9lc25cXCd0IGhhdmUgYSBjYXBpdGFsIFxcJ1RcXCcuIFRoYXRcXCdzIHByZXR0eSBjb29sLCBodWg/JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKCcuLi4gV2hhdCB3ZXJlIHlvdSBkb2luZyBhZ2Fpbj8nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdTb21ldGhpbmcgY29vbGVyIHRoYW4gcmVhZGluZywgcHJvYmFibHknKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNob29zZTogKCkgPT4gQ2hhcmFjdGVyLmFkZFRvSW52ZW50b3J5KFwiTGl6LmJvcmluZ0Jvb2tcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveU9uVXNlOiB0cnVlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuXHJcbiAgICBcIkxpei5ib3JpbmdCb29rXCI6IHtcclxuICAgICAgICBuYW1lOiAnXCJBIEJyaWVmIEhpc3Rvcnkgb2YgQ2hhZHRvcGlhXCInLFxyXG4gICAgICAgIHBsdXJhbE5hbWU6ICdNdWx0aXBsZSBjb3BpZXMgb2YgXCJBIEJyaWVmIEhpc3Rvcnkgb2YgQ2hhZHRvcGlhXCInLFxyXG4gICAgICAgIHRleHQ6IF8oJ01hbiwgdGhpcyBib29rIGlzIGJvcmluZy4nKSxcclxuICAgICAgICBvblVzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBfKFwiQSBCcmllZiBTdW1tYXJ5IG9mIGEgQnJpZWYgSGlzdG9yeSBvZiBDaGFkdG9waWFcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXygnSXRcXCdzIHN0aWxsIGp1c3QgYXMgYm9yaW5nIGFzIHdoZW4geW91IGxhc3QgdHJpZWQgdG8gcmVhZCBpdC4nKV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0RhbmcuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveU9uVXNlOiBmYWxzZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH0sXHJcbiAgICBcIlN0cmFuZ2VyLnNtb290aFN0b25lXCI6IHtcclxuICAgICAgICBuYW1lOiAnYSBzbW9vdGggYmxhY2sgc3RvbmUnLFxyXG4gICAgICAgIHBsdXJhbE5hbWU6ICdzbW9vdGggYmxhY2sgc3RvbmVzJyxcclxuICAgICAgICB0ZXh0OiBfKCdJdFxcJ3Mgd2VpcmRseSBlZXJpZScpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKCEkU00uZ2V0KCdrbm93bGVkZ2UuU3RyYW5nZXIuc21vb3RoU3RvbmUnKSkge1xyXG4gICAgICAgICAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgJ1lvdSBoYXZlIG5vIGlkZWEgd2hhdCB0byBkbyB3aXRoIHRoaXMgdGhpbmcuJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IF8oXCJBIHNtb290aCBibGFjayBzdG9uZVwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtfKFwiSSdtIGdlbnVpbmVseSBub3Qgc3VyZSBob3cgeW91IGdvdCB0byB0aGlzIGV2ZW50LCBidXQgcGxlYXNlIGxldCBtZSBrbm93IHZpYSBHaXRIdWIgaXNzdWUsIHlvdSBsaXR0bGUgc3Rpbmtlci5cIildLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdJIHN3ZWFyIHRvIGRvIHRoaXMsIGFzIGEgcmVzcG9uc2libGUgY2l0aXplbiBvZiBFYXJ0aCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogZmFsc2UsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgXCJTdHJhbmdlci53cmFwcGVkS25pZmVcIjoge1xyXG4gICAgICAgIG5hbWU6ICdhIGtuaWZlIHdyYXBwZWQgaW4gY2xvdGgnLFxyXG4gICAgICAgIHBsdXJhbE5hbWU6ICdLbml2ZXMgd3JhcHBlZCBpbiBzZXBhcmF0ZSBjbG90aHMnLFxyXG4gICAgICAgIHRleHQ6IF8oJ01hbiwgSSBob3BlIGl0XFwncyBub3QgYWxsIGxpa2UsIGJsb29keSBvbiB0aGUgYmxhZGUgYW5kIHN0dWZmLicpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IF8oXCJBIGtuaWZlIHdyYXBwZWQgaW4gY2xvdGhcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXyhcIllvdSB1bndyYXAgdGhlIGtuaWZlIGNhcmVmdWxseS4gSXQgc2VlbXMgdG8gYmUgaGlnaGx5IG9ybmFtZW50ZWQsIGFuZCB5b3UgY291bGQgcHJvYmFibHkgZG8gc29tZSBjcmltZXMgd2l0aCBpdC5cIildLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdIZWxsIHllYWgsIEFkb2xmIExvb3Mgc3R5bGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNob29zZTogKCkgPT4gQ2hhcmFjdGVyLmFkZFRvSW52ZW50b3J5KFwiU3RyYW5nZXIuc2lsdmVyS25pZmVcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveU9uVXNlOiB0cnVlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIFwiU3RyYW5nZXIuc2lsdmVyS25pZmVcIjoge1xyXG4gICAgICAgIG5hbWU6ICdhIHNpbHZlciBrbmlmZScsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ3NpbHZlciBrbml2ZXMnLFxyXG4gICAgICAgIHRleHQ6IF8oJ0hpZ2hseSBvcm5hbWVudGVkJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEgc2lsdmVyIGtuaWZlXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIk9uZSBkYXkgeW91J2xsIGJlIGFibGUgdG8gZXF1aXAgdGhpcywgYnV0IHJpZ2h0IG5vdyB0aGF0IGZ1bmN0aW9uYWxpdHkgaXNuJ3QgcHJlc2VudC5cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiUGxlYXNlIHBvbGl0ZWx5IGxlYXZlIHRoZSBwcmVtaXNlcyB3aXRob3V0IGFja25vd2xlZGdpbmcgdGhpcyBtaXNzaW5nIGZlYXR1cmUuXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1lvdSBnb3QgaXQsIGNoaWVmJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveU9uVXNlOiBmYWxzZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH0sXHJcbiAgICBcIlN0cmFuZ2VyLmNsb3RoQnVuZGxlXCI6IHtcclxuICAgICAgICBuYW1lOiAnYSBidW5kbGUgb2YgY2xvdGgnLFxyXG4gICAgICAgIHBsdXJhbE5hbWU6ICdidW5kbGVzIG9mIGNsb3RoJyxcclxuICAgICAgICB0ZXh0OiBfKCdXaGF0IGxpZXMgd2l0aGluPycpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IF8oXCJBIGJ1bmRsZSBvZiBjbG90aFwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJPbmUgZGF5IHlvdSdsbCBiZSBhYmxlIHRvIHVzZSB0aGlzIGl0ZW0sIGJ1dCByaWdodCBub3cgdGhhdCBmdW5jdGlvbmFsaXR5IGlzbid0IHByZXNlbnQuXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIlBsZWFzZSBwb2xpdGVseSBsZWF2ZSB0aGUgcHJlbWlzZXMgd2l0aG91dCBhY2tub3dsZWRnaW5nIHRoaXMgbWlzc2luZyBmZWF0dXJlLlwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdZb3UgZ290IGl0LCBjaGllZicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogZmFsc2UsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgXCJTdHJhbmdlci5jb2luXCI6IHtcclxuICAgICAgICBuYW1lOiAnQSBzdHJhbmdlIGNvaW4nLFxyXG4gICAgICAgIHBsdXJhbE5hbWU6ICdzdHJhbmdlIGNvaW5zJyxcclxuICAgICAgICB0ZXh0OiBfKCdCb3RoIHNpZGVzIGRlcGljdCB0aGUgc2FtZSBpbWFnZScpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IF8oXCJBIHN0cmFuZ2UgY29pblwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJPbmUgZGF5IHlvdSdsbCBiZSBhYmxlIHRvIHVzZSB0aGlzIGl0ZW0sIGJ1dCByaWdodCBub3cgdGhhdCBmdW5jdGlvbmFsaXR5IGlzbid0IHByZXNlbnQuXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIlBsZWFzZSBwb2xpdGVseSBsZWF2ZSB0aGUgcHJlbWlzZXMgd2l0aG91dCBhY2tub3dsZWRnaW5nIHRoaXMgbWlzc2luZyBmZWF0dXJlLlwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdZb3UgZ290IGl0LCBjaGllZicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogZmFsc2UsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgXCJDYXB0YWluLnN1cHBsaWVzXCI6IHtcclxuICAgICAgICBuYW1lOiAnU3VwcGxpZXMgZm9yIHRoZSBNYXlvcicsXHJcbiAgICAgICAgdGV4dDogJ1RoZXlcXCdyZSBoZWF2eSwgYnV0IG5vdCBpbiBhIHdheSB0aGF0IGltcGFjdHMgZ2FtZXBsYXknLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IF8oXCJTdXBwbGllcyBmb3IgdGhlIE1heW9yXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIkEgYmlnIGJveCBvZiBzdHVmZiBmb3IgdGhlIHZpbGxhZ2UuIExvb2tzIGxpa2UgcmF3IG1hdGVyaWFscywgbW9zdGx5LlwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJJIHNob3VsZCByZWFsbHkgdGFrZSB0aGlzIGJhY2sgdG8gdGhlIE1heW9yLlwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdPa2F5JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveU9uVXNlOiBmYWxzZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH0sXHJcbiAgICBcIm9sZExhZHkuQ2FuZHlcIjoge1xyXG4gICAgICAgIG5hbWU6ICdhIHBpZWNlIG9mIGhhcmQgY2FuZHknLFxyXG4gICAgICAgIHBsdXJhbE5hbWU6ICdwaWVjZXMgb2YgaGFyZCBjYW5keScsXHJcbiAgICAgICAgdGV4dDogJ0dpdmVuIHRvIHlvdSBieSBhIG5pY2Ugb2xkIHdvbWFuIGluIGEgY2FycmlhZ2UnLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgJ1lvdSBwb3AgdGhlIGhhcmQgY2FuZHkgaW50byB5b3VyIG1vdXRoLiBBIGZldyBtaW51dGVzICcgXHJcbiAgICAgICAgICAgICAgICArICdsYXRlciwgaXRcXCdzIGdvbmUsIGxlYXZpbmcgYmVoaW5kIG9ubHkgYSBtaWxkIHNlbnNlIG9mIGd1aWx0IGFib3V0IG5vdCAnIFxyXG4gICAgICAgICAgICAgICAgKyAnY2FsbGluZyB5b3VyIGdyYW5kbWEgbW9yZSBvZnRlbi4nKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveU9uVXNlOiB0cnVlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiB0cnVlXHJcbiAgICB9XHJcbn1cclxuIiwiLy8gbWFzdGVyIGxpc3Qgb2YgcGVya3NcclxuXHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyBQZXJrIH0gZnJvbSBcIi4vcGVya1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IFBlcmtMaXN0OiB7W2lkOiBzdHJpbmddOiBQZXJrfSA9IHtcclxuICAgICd0dW1teVBhaW4nOiB7XHJcbiAgICAgICAgbmFtZTogJ1NvY2tlZCBpbiB0aGUgU3RvbWFjaCcsXHJcbiAgICAgICAgdGV4dDogJ1RoaXMgZG9lc25cXCd0IHNlZW0gbGlrZSBhIHBlcmssIHRiaCcsXHJcbiAgICAgICAgZnVsbFRleHQ6IFtcclxuICAgICAgICAgICAgXyhcIllvdSBnb3QgaGlzIGluIHRoZSBzdG9tYWNoIHJlYWxseSBoYXJkLlwiKSxcclxuICAgICAgICAgICAgXyhcIkxpa2UsIFJFQUxMWSBoYXJkLiBCeSBhIGdyaW5uaW5nIGplcmsuXCIpXHJcbiAgICAgICAgXSxcclxuICAgICAgICBpc0FjdGl2ZTogKCkgPT4gdHJ1ZSxcclxuICAgICAgICBzdGF0Qm9udXNlczogeyB9LFxyXG4gICAgICAgIHRpbWVMZWZ0OiAtMVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4vY2hhcmFjdGVyXCI7XHJcbmltcG9ydCB7IFF1ZXN0IH0gZnJvbSBcIi4vcXVlc3RcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBRdWVzdExvZzoge1tpZDogc3RyaW5nXTogUXVlc3R9ID0ge1xyXG4gICAgXCJtYXlvclN1cHBsaWVzXCI6IHtcclxuICAgICAgICBuYW1lOiBcIlN1cHBsaWVzIGZvciB0aGUgTWF5b3JcIixcclxuICAgICAgICBsb2dEZXNjcmlwdGlvbjogXCJUaGUgbWF5b3IgaGFzIGFza2VkIHlvdSB0byBnZXQgc29tZSBzdXBwbGllcyBmb3IgaGltIGZyb20gdGhlIE91dHBvc3QuXCIsXHJcbiAgICAgICAgcGhhc2VzOiB7XHJcbiAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkdvIGNoZWNrIG91dCB0aGUgUm9hZCB0byB0aGUgT3V0cG9zdCB0byBzZWUgaWYgeW91IGNhbiBmaW5kIG91dCBtb3JlXCIsXHJcbiAgICAgICAgICAgICAgICByZXF1aXJlbWVudHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlclJlcXVpcmVtZW50OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkU00uZ2V0KCdSb2FkLm9wZW4nKSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdSb2FkLmNvdW50ZXInKSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkkgc2hvdWxkIGdvIGNoZWNrIG91dCB0aGUgUm9hZCB0byB0aGUgT3V0cG9zdFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoJFNNLmdldCgnUm9hZC5vcGVuJykgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnUm9hZC5jb3VudGVyJykgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkkgc2hvdWxkIGtlZXAgZXhwbG9yaW5nIHRoZSBSb2FkIHRvIHRoZSBPdXRwb3N0XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgkU00uZ2V0KCdSb2FkLm9wZW4nKSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkkndmUgZm91bmQgdGhlIHdheSB0byB0aGUgT3V0cG9zdFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0NvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoJFNNLmdldCgnUm9hZC5vcGVuJykgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpIGFzIG51bWJlciA+IDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgMToge1xyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiQXNrIHRoZSBDYXB0YWluIG9mIHRoZSBPdXRwb3N0IGFib3V0IHRoZSBzdXBwbGllc1wiLFxyXG4gICAgICAgICAgICAgICAgcmVxdWlyZW1lbnRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJSZXF1aXJlbWVudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpIGFzIG51bWJlciA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdPdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcpID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiSSBzaG91bGQgdHJ5IHRhbGtpbmcgdG8gdGhlIENhcHRhaW4gb2YgdGhlIE91dHBvc3RcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnT3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnKSAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnT3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnKSBhcyBudW1iZXIgPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgQ2hhcmFjdGVyLmludmVudG9yeVtcIkNhcHRhaW4uc3VwcGxpZXNcIl0gPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJJIHNob3VsZCBhc2sgdGhlIENhcHRhaW4gYWJvdXQgdGhlIG1pc3Npbmcgc3VwcGxpZXNcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnT3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnKSAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnT3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnKSBhcyBudW1iZXIgPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgQ2hhcmFjdGVyLmludmVudG9yeVtcIkNhcHRhaW4uc3VwcGxpZXNcIl0gIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJJJ3ZlIGdvdHRlbiB0aGUgc3VwcGxpZXMgZnJvbSB0aGUgQ2FwdGFpblwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0NvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpIGFzIG51bWJlciA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ091dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnT3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnKSBhcyBudW1iZXIgPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAoQ2hhcmFjdGVyLmludmVudG9yeVtcIkNhcHRhaW4uc3VwcGxpZXNcIl0gIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8ICRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnKSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgMjoge1xyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiUmV0dXJuIHRoZSBzdXBwbGllcyB0byB0aGUgTWF5b3JcIixcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVtZW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyUmVxdWlyZW1lbnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnKSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAgXCJJIHNob3VsZCBoYW5kIHRoZXNlIHN1cHBsaWVzIG92ZXIgdG8gdGhlIE1heW9yXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnKSBhcyBudW1iZXIgPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkkndmUgaGFuZGVkIG92ZXIgdGhlIHN1cHBsaWVzIHRvIHRoZSBNYXlvclwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0NvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoJFNNLmdldCgndmlsbGFnZS5tYXlvci5oYXZlR2l2ZW5TdXBwbGllcycpICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnKSBhcyBudW1iZXIgPiAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8qXHJcbiAqIE1vZHVsZSBmb3IgaGFuZGxpbmcgU3RhdGVzXHJcbiAqIFxyXG4gKiBBbGwgc3RhdGVzIHNob3VsZCBiZSBnZXQgYW5kIHNldCB0aHJvdWdoIHRoZSBTdGF0ZU1hbmFnZXIgKCRTTSkuXHJcbiAqIFxyXG4gKiBUaGUgbWFuYWdlciBpcyBpbnRlbmRlZCB0byBoYW5kbGUgYWxsIG5lZWRlZCBjaGVja3MgYW5kIGVycm9yIGNhdGNoaW5nLlxyXG4gKiBUaGlzIGluY2x1ZGVzIGNyZWF0aW5nIHRoZSBwYXJlbnRzIG9mIGxheWVyZWQvZGVlcCBzdGF0ZXMgc28gdW5kZWZpbmVkIHN0YXRlc1xyXG4gKiBkbyBub3QgbmVlZCB0byBiZSB0ZXN0ZWQgZm9yIGFuZCBjcmVhdGVkIGJlZm9yZWhhbmQuXHJcbiAqIFxyXG4gKiBXaGVuIGEgc3RhdGUgaXMgY2hhbmdlZCwgYW4gdXBkYXRlIGV2ZW50IGlzIHNlbnQgb3V0IGNvbnRhaW5pbmcgdGhlIG5hbWUgb2YgdGhlIHN0YXRlXHJcbiAqIGNoYW5nZWQgb3IgaW4gdGhlIGNhc2Ugb2YgbXVsdGlwbGUgY2hhbmdlcyAoLnNldE0sIC5hZGRNKSB0aGUgcGFyZW50IGNsYXNzIGNoYW5nZWQuXHJcbiAqIEV2ZW50OiB0eXBlOiAnc3RhdGVVcGRhdGUnLCBzdGF0ZU5hbWU6IDxwYXRoIG9mIHN0YXRlIG9yIHBhcmVudCBzdGF0ZT5cclxuICogXHJcbiAqIE9yaWdpbmFsIGZpbGUgY3JlYXRlZCBieTogTWljaGFlbCBHYWx1c2hhXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4vZW5naW5lXCI7XHJcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tIFwiLi9ub3RpZmljYXRpb25zXCI7XHJcblxyXG52YXIgU3RhdGVNYW5hZ2VyID0ge1xyXG5cdFx0XHJcblx0TUFYX1NUT1JFOiA5OTk5OTk5OTk5OTk5OSxcclxuXHRcclxuXHRvcHRpb25zOiB7fSxcclxuXHRcclxuXHRpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblx0XHRcclxuXHRcdC8vY3JlYXRlIGNhdGVnb3JpZXNcclxuXHRcdHZhciBjYXRzID0gW1xyXG5cdFx0XHQnZmVhdHVyZXMnLFx0XHQvL2JpZyBmZWF0dXJlcyBsaWtlIGJ1aWxkaW5ncywgbG9jYXRpb24gYXZhaWxhYmlsaXR5LCB1bmxvY2tzLCBldGNcclxuXHRcdFx0J3N0b3JlcycsIFx0XHQvL2xpdHRsZSBzdHVmZiwgaXRlbXMsIHdlYXBvbnMsIGV0Y1xyXG5cdFx0XHQnY2hhcmFjdGVyJywgXHQvL3RoaXMgaXMgZm9yIHBsYXllcidzIGNoYXJhY3RlciBzdGF0cyBzdWNoIGFzIHBlcmtzXHJcblx0XHRcdCdpbmNvbWUnLFxyXG5cdFx0XHQndGltZXJzJyxcclxuXHRcdFx0J2dhbWUnLCBcdFx0Ly9tb3N0bHkgbG9jYXRpb24gcmVsYXRlZDogZmlyZSB0ZW1wLCB3b3JrZXJzLCBwb3B1bGF0aW9uLCB3b3JsZCBtYXAsIGV0Y1xyXG5cdFx0XHQncGxheVN0YXRzJyxcdC8vYW55dGhpbmcgcGxheSByZWxhdGVkOiBwbGF5IHRpbWUsIGxvYWRzLCBldGNcclxuXHRcdFx0J3ByZXZpb3VzJyxcdFx0Ly8gcHJlc3RpZ2UsIHNjb3JlLCB0cm9waGllcyAoaW4gZnV0dXJlKSwgYWNoaWV2ZW1lbnRzIChhZ2Fpbiwgbm90IHlldCksIGV0Y1xyXG5cdFx0XHQnb3V0Zml0J1x0XHRcdC8vIHVzZWQgdG8gdGVtcG9yYXJpbHkgc3RvcmUgdGhlIGl0ZW1zIHRvIGJlIHRha2VuIG9uIHRoZSBwYXRoXHJcblx0XHRdO1xyXG5cdFx0XHJcblx0XHRmb3IodmFyIHdoaWNoIGluIGNhdHMpIHtcclxuXHRcdFx0aWYoISRTTS5nZXQoY2F0c1t3aGljaF0pKSAkU00uc2V0KGNhdHNbd2hpY2hdLCB7fSk7IFxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvL3N1YnNjcmliZSB0byBzdGF0ZVVwZGF0ZXNcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdCQuRGlzcGF0Y2goJ3N0YXRlVXBkYXRlJykuc3Vic2NyaWJlKCRTTS5oYW5kbGVTdGF0ZVVwZGF0ZXMpO1xyXG5cclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdHdpbmRvdy4kU00gPSB0aGlzO1xyXG5cdH0sXHJcblx0XHJcblx0Ly9jcmVhdGUgYWxsIHBhcmVudHMgYW5kIHRoZW4gc2V0IHN0YXRlXHJcblx0Y3JlYXRlU3RhdGU6IGZ1bmN0aW9uKHN0YXRlTmFtZSwgdmFsdWUpIHtcclxuXHRcdHZhciB3b3JkcyA9IHN0YXRlTmFtZS5zcGxpdCgvWy5cXFtcXF0nXCJdKy8pO1xyXG5cdFx0Ly9mb3Igc29tZSByZWFzb24gdGhlcmUgYXJlIHNvbWV0aW1lcyBlbXB0eSBzdHJpbmdzXHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHdvcmRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmICh3b3Jkc1tpXSA9PT0gJycpIHtcclxuXHRcdFx0XHR3b3Jkcy5zcGxpY2UoaSwgMSk7XHJcblx0XHRcdFx0aS0tO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvLyBJTVBPUlRBTlQ6IFN0YXRlIHJlZmVycyB0byB3aW5kb3cuU3RhdGUsIHdoaWNoIEkgaGFkIHRvIGluaXRpYWxpemUgbWFudWFsbHlcclxuXHRcdC8vICAgIGluIEVuZ2luZS50czsgcGxlYXNlIGRvbid0IGZvcmdldCB0aGlzIGFuZCBtZXNzIHdpdGggYW55dGhpbmcgbmFtZWRcclxuXHRcdC8vICAgIFwiU3RhdGVcIiBvciBcIndpbmRvdy5TdGF0ZVwiLCB0aGlzIHN0dWZmIGlzIHdlaXJkbHkgcHJlY2FyaW91cyBhZnRlciB0eXBlc2NyaXB0aW5nXHJcblx0XHQvLyAgICB0aGlzIGNvZGViYXNlLCBhbmQgSSBkb24ndCBoYXZlIHRoZSBzYW5pdHkgcG9pbnRzIHRvIGZpZ3VyZSBvdXQgd2h5XHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHR2YXIgb2JqID0gU3RhdGU7XHJcblx0XHR2YXIgdyA9IG51bGw7XHJcblx0XHRmb3IodmFyIGk9MCwgbGVuPXdvcmRzLmxlbmd0aC0xO2k8bGVuO2krKyl7XHJcblx0XHRcdHcgPSB3b3Jkc1tpXTtcclxuXHRcdFx0aWYob2JqW3ddID09PSB1bmRlZmluZWQgKSBvYmpbd10gPSB7fTtcclxuXHRcdFx0b2JqID0gb2JqW3ddO1xyXG5cdFx0fVxyXG5cdFx0b2JqW3dvcmRzW2ldXSA9IHZhbHVlO1xyXG5cdFx0cmV0dXJuIG9iajtcclxuXHR9LFxyXG5cdFxyXG5cdC8vc2V0IHNpbmdsZSBzdGF0ZVxyXG5cdC8vaWYgbm9FdmVudCBpcyB0cnVlLCB0aGUgdXBkYXRlIGV2ZW50IHdvbid0IHRyaWdnZXIsIHVzZWZ1bCBmb3Igc2V0dGluZyBtdWx0aXBsZSBzdGF0ZXMgZmlyc3RcclxuXHRzZXQ6IGZ1bmN0aW9uKHN0YXRlTmFtZSwgdmFsdWUsIG5vRXZlbnQ/KSB7XHJcblx0XHR2YXIgZnVsbFBhdGggPSAkU00uYnVpbGRQYXRoKHN0YXRlTmFtZSk7XHJcblx0XHRcclxuXHRcdC8vbWFrZSBzdXJlIHRoZSB2YWx1ZSBpc24ndCBvdmVyIHRoZSBlbmdpbmUgbWF4aW11bVxyXG5cdFx0aWYodHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmIHZhbHVlID4gJFNNLk1BWF9TVE9SRSkgdmFsdWUgPSAkU00uTUFYX1NUT1JFO1xyXG5cdFx0XHJcblx0XHR0cnl7XHJcblx0XHRcdGV2YWwoJygnK2Z1bGxQYXRoKycpID0gdmFsdWUnKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Ly9wYXJlbnQgZG9lc24ndCBleGlzdCwgc28gbWFrZSBwYXJlbnRcclxuXHRcdFx0JFNNLmNyZWF0ZVN0YXRlKHN0YXRlTmFtZSwgdmFsdWUpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvL3N0b3JlcyB2YWx1ZXMgY2FuIG5vdCBiZSBuZWdhdGl2ZVxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0aWYoc3RhdGVOYW1lLmluZGV4T2YoJ3N0b3JlcycpID09PSAwICYmICRTTS5nZXQoc3RhdGVOYW1lLCB0cnVlKSA8IDApIHtcclxuXHRcdFx0ZXZhbCgnKCcrZnVsbFBhdGgrJykgPSAwJyk7XHJcblx0XHRcdEVuZ2luZS5sb2coJ1dBUk5JTkc6IHN0YXRlOicgKyBzdGF0ZU5hbWUgKyAnIGNhbiBub3QgYmUgYSBuZWdhdGl2ZSB2YWx1ZS4gU2V0IHRvIDAgaW5zdGVhZC4nKTtcclxuXHRcdH1cclxuXHJcblx0XHRFbmdpbmUubG9nKHN0YXRlTmFtZSArICcgJyArIHZhbHVlKTtcclxuXHRcdFxyXG5cdFx0aWYgKG5vRXZlbnQgPT09IHVuZGVmaW5lZCB8fCBub0V2ZW50ID09IHRydWUpIHtcclxuXHRcdFx0RW5naW5lLnNhdmVHYW1lKCk7XHJcblx0XHRcdCRTTS5maXJlVXBkYXRlKHN0YXRlTmFtZSk7XHJcblx0XHR9XHRcdFxyXG5cdH0sXHJcblx0XHJcblx0Ly9zZXRzIGEgbGlzdCBvZiBzdGF0ZXNcclxuXHRzZXRNOiBmdW5jdGlvbihwYXJlbnROYW1lLCBsaXN0LCBub0V2ZW50Pykge1xyXG5cdFx0JFNNLmJ1aWxkUGF0aChwYXJlbnROYW1lKTtcclxuXHRcdFxyXG5cdFx0Ly9tYWtlIHN1cmUgdGhlIHN0YXRlIGV4aXN0cyB0byBhdm9pZCBlcnJvcnMsXHJcblx0XHRpZigkU00uZ2V0KHBhcmVudE5hbWUpID09PSB1bmRlZmluZWQpICRTTS5zZXQocGFyZW50TmFtZSwge30sIHRydWUpO1xyXG5cdFx0XHJcblx0XHRmb3IodmFyIGsgaW4gbGlzdCl7XHJcblx0XHRcdCRTTS5zZXQocGFyZW50TmFtZSsnW1wiJytrKydcIl0nLCBsaXN0W2tdLCB0cnVlKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYoIW5vRXZlbnQpIHtcclxuXHRcdFx0RW5naW5lLnNhdmVHYW1lKCk7XHJcblx0XHRcdCRTTS5maXJlVXBkYXRlKHBhcmVudE5hbWUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0Ly9zaG9ydGN1dCBmb3IgYWx0ZXJpbmcgbnVtYmVyIHZhbHVlcywgcmV0dXJuIDEgaWYgc3RhdGUgd2Fzbid0IGEgbnVtYmVyXHJcblx0YWRkOiBmdW5jdGlvbihzdGF0ZU5hbWUsIHZhbHVlLCBub0V2ZW50Pykge1xyXG5cdFx0dmFyIGVyciA9IDA7XHJcblx0XHQvLzAgaWYgdW5kZWZpbmVkLCBudWxsIChidXQgbm90IHt9KSBzaG91bGQgYWxsb3cgYWRkaW5nIHRvIG5ldyBvYmplY3RzXHJcblx0XHQvL2NvdWxkIGFsc28gYWRkIGluIGEgdHJ1ZSA9IDEgdGhpbmcsIHRvIGhhdmUgc29tZXRoaW5nIGdvIGZyb20gZXhpc3RpbmcgKHRydWUpXHJcblx0XHQvL3RvIGJlIGEgY291bnQsIGJ1dCB0aGF0IG1pZ2h0IGJlIHVud2FudGVkIGJlaGF2aW9yIChhZGQgd2l0aCBsb29zZSBldmFsIHByb2JhYmx5IHdpbGwgaGFwcGVuIGFueXdheXMpXHJcblx0XHR2YXIgb2xkID0gJFNNLmdldChzdGF0ZU5hbWUsIHRydWUpO1xyXG5cdFx0XHJcblx0XHQvL2NoZWNrIGZvciBOYU4gKG9sZCAhPSBvbGQpIGFuZCBub24gbnVtYmVyIHZhbHVlc1xyXG5cdFx0aWYob2xkICE9IG9sZCl7XHJcblx0XHRcdEVuZ2luZS5sb2coJ1dBUk5JTkc6ICcrc3RhdGVOYW1lKycgd2FzIGNvcnJ1cHRlZCAoTmFOKS4gUmVzZXR0aW5nIHRvIDAuJyk7XHJcblx0XHRcdG9sZCA9IDA7XHJcblx0XHRcdCRTTS5zZXQoc3RhdGVOYW1lLCBvbGQgKyB2YWx1ZSwgbm9FdmVudCk7XHJcblx0XHR9IGVsc2UgaWYodHlwZW9mIG9sZCAhPSAnbnVtYmVyJyB8fCB0eXBlb2YgdmFsdWUgIT0gJ251bWJlcicpe1xyXG5cdFx0XHRFbmdpbmUubG9nKCdXQVJOSU5HOiBDYW4gbm90IGRvIG1hdGggd2l0aCBzdGF0ZTonK3N0YXRlTmFtZSsnIG9yIHZhbHVlOicrdmFsdWUrJyBiZWNhdXNlIGF0IGxlYXN0IG9uZSBpcyBub3QgYSBudW1iZXIuJyk7XHJcblx0XHRcdGVyciA9IDE7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkU00uc2V0KHN0YXRlTmFtZSwgb2xkICsgdmFsdWUsIG5vRXZlbnQpOyAvL3NldFN0YXRlIGhhbmRsZXMgZXZlbnQgYW5kIHNhdmVcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGVycjtcclxuXHR9LFxyXG5cdFxyXG5cdC8vYWx0ZXJzIG11bHRpcGxlIG51bWJlciB2YWx1ZXMsIHJldHVybiBudW1iZXIgb2YgZmFpbHNcclxuXHRhZGRNOiBmdW5jdGlvbihwYXJlbnROYW1lLCBsaXN0LCBub0V2ZW50Pykge1xyXG5cdFx0dmFyIGVyciA9IDA7XHJcblx0XHRcclxuXHRcdC8vbWFrZSBzdXJlIHRoZSBwYXJlbnQgZXhpc3RzIHRvIGF2b2lkIGVycm9yc1xyXG5cdFx0aWYoJFNNLmdldChwYXJlbnROYW1lKSA9PT0gdW5kZWZpbmVkKSAkU00uc2V0KHBhcmVudE5hbWUsIHt9LCB0cnVlKTtcclxuXHRcdFxyXG5cdFx0Zm9yKHZhciBrIGluIGxpc3Qpe1xyXG5cdFx0XHRpZigkU00uYWRkKHBhcmVudE5hbWUrJ1tcIicraysnXCJdJywgbGlzdFtrXSwgdHJ1ZSkpIGVycisrO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZighbm9FdmVudCkge1xyXG5cdFx0XHRFbmdpbmUuc2F2ZUdhbWUoKTtcclxuXHRcdFx0JFNNLmZpcmVVcGRhdGUocGFyZW50TmFtZSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZXJyO1xyXG5cdH0sXHJcblx0XHJcblx0Ly9yZXR1cm4gc3RhdGUsIHVuZGVmaW5lZCBvciAwXHJcblx0Z2V0OiBmdW5jdGlvbihzdGF0ZU5hbWUsIHJlcXVlc3RaZXJvPyk6IHN0cmluZyB8IHVuZGVmaW5lZCB8IE51bWJlciB8IG51bGwgfCBCb29sZWFuIHtcclxuXHRcdHZhciB3aGljaFN0YXRlOiB1bmRlZmluZWQgfCBudWxsIHwgTnVtYmVyIHwgc3RyaW5nID0gbnVsbDtcclxuXHRcdHZhciBmdWxsUGF0aCA9ICRTTS5idWlsZFBhdGgoc3RhdGVOYW1lKTtcclxuXHRcdFxyXG5cdFx0Ly9jYXRjaCBlcnJvcnMgaWYgcGFyZW50IG9mIHN0YXRlIGRvZXNuJ3QgZXhpc3RcclxuXHRcdHRyeXtcclxuXHRcdFx0ZXZhbCgnd2hpY2hTdGF0ZSA9ICgnK2Z1bGxQYXRoKycpJyk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdHdoaWNoU3RhdGUgPSB1bmRlZmluZWQ7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vcHJldmVudHMgcmVwZWF0ZWQgaWYgdW5kZWZpbmVkLCBudWxsLCBmYWxzZSBvciB7fSwgdGhlbiB4ID0gMCBzaXR1YXRpb25zXHJcblx0XHRpZigoIXdoaWNoU3RhdGVcclxuXHRcdFx0Ly8gIHx8IHdoaWNoU3RhdGUgPT0ge31cclxuXHRcdFx0KSAmJiByZXF1ZXN0WmVybykgcmV0dXJuIDA7XHJcblx0XHRlbHNlIHJldHVybiB3aGljaFN0YXRlO1xyXG5cdH0sXHJcblx0XHJcblx0Ly9tYWlubHkgZm9yIGxvY2FsIGNvcHkgdXNlLCBhZGQoTSkgY2FuIGZhaWwgc28gd2UgY2FuJ3Qgc2hvcnRjdXQgdGhlbVxyXG5cdC8vc2luY2Ugc2V0IGRvZXMgbm90IGZhaWwsIHdlIGtub3cgc3RhdGUgZXhpc3RzIGFuZCBjYW4gc2ltcGx5IHJldHVybiB0aGUgb2JqZWN0XHJcblx0c2V0Z2V0OiBmdW5jdGlvbihzdGF0ZU5hbWUsIHZhbHVlLCBub0V2ZW50Pyl7XHJcblx0XHQkU00uc2V0KHN0YXRlTmFtZSwgdmFsdWUsIG5vRXZlbnQpO1xyXG5cdFx0cmV0dXJuIGV2YWwoJygnKyRTTS5idWlsZFBhdGgoc3RhdGVOYW1lKSsnKScpO1xyXG5cdH0sXHJcblx0XHJcblx0cmVtb3ZlOiBmdW5jdGlvbihzdGF0ZU5hbWUsIG5vRXZlbnQ/KSB7XHJcblx0XHR2YXIgd2hpY2hTdGF0ZSA9ICRTTS5idWlsZFBhdGgoc3RhdGVOYW1lKTtcclxuXHRcdHRyeXtcclxuXHRcdFx0ZXZhbCgnKGRlbGV0ZSAnK3doaWNoU3RhdGUrJyknKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Ly9pdCBkaWRuJ3QgZXhpc3QgaW4gdGhlIGZpcnN0IHBsYWNlXHJcblx0XHRcdEVuZ2luZS5sb2coJ1dBUk5JTkc6IFRyaWVkIHRvIHJlbW92ZSBub24tZXhpc3RhbnQgc3RhdGUgXFwnJytzdGF0ZU5hbWUrJ1xcJy4nKTtcclxuXHRcdH1cclxuXHRcdGlmKCFub0V2ZW50KXtcclxuXHRcdFx0RW5naW5lLnNhdmVHYW1lKCk7XHJcblx0XHRcdCRTTS5maXJlVXBkYXRlKHN0YXRlTmFtZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHQvL2NyZWF0ZXMgZnVsbCByZWZlcmVuY2UgZnJvbSBpbnB1dFxyXG5cdC8vaG9wZWZ1bGx5IHRoaXMgd29uJ3QgZXZlciBuZWVkIHRvIGJlIG1vcmUgY29tcGxpY2F0ZWRcclxuXHRidWlsZFBhdGg6IGZ1bmN0aW9uKGlucHV0KXtcclxuXHRcdHZhciBkb3QgPSAoaW5wdXQuY2hhckF0KDApID09ICdbJyk/ICcnIDogJy4nOyAvL2lmIGl0IHN0YXJ0cyB3aXRoIFtmb29dIG5vIGRvdCB0byBqb2luXHJcblx0XHRyZXR1cm4gJ1N0YXRlJyArIGRvdCArIGlucHV0O1xyXG5cdH0sXHJcblx0XHJcblx0ZmlyZVVwZGF0ZTogZnVuY3Rpb24oc3RhdGVOYW1lLCBzYXZlPyl7XHJcblx0XHR2YXIgY2F0ZWdvcnkgPSAkU00uZ2V0Q2F0ZWdvcnkoc3RhdGVOYW1lKTtcclxuXHRcdGlmKHN0YXRlTmFtZSA9PSB1bmRlZmluZWQpIHN0YXRlTmFtZSA9IGNhdGVnb3J5ID0gJ2FsbCc7IC8vYmVzdCBpZiB0aGlzIGRvZXNuJ3QgaGFwcGVuIGFzIGl0IHdpbGwgdHJpZ2dlciBtb3JlIHN0dWZmXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHQkLkRpc3BhdGNoKCdzdGF0ZVVwZGF0ZScpLnB1Ymxpc2goeydjYXRlZ29yeSc6IGNhdGVnb3J5LCAnc3RhdGVOYW1lJzpzdGF0ZU5hbWV9KTtcclxuXHRcdGlmKHNhdmUpIEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdH0sXHJcblx0XHJcblx0Z2V0Q2F0ZWdvcnk6IGZ1bmN0aW9uKHN0YXRlTmFtZSl7XHJcblx0XHR2YXIgZmlyc3RPQiA9IHN0YXRlTmFtZS5pbmRleE9mKCdbJyk7XHJcblx0XHR2YXIgZmlyc3REb3QgPSBzdGF0ZU5hbWUuaW5kZXhPZignLicpO1xyXG5cdFx0dmFyIGN1dG9mZiA9IG51bGw7XHJcblx0XHRpZihmaXJzdE9CID09IC0xIHx8IGZpcnN0RG90ID09IC0xKXtcclxuXHRcdFx0Y3V0b2ZmID0gZmlyc3RPQiA+IGZpcnN0RG90ID8gZmlyc3RPQiA6IGZpcnN0RG90O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y3V0b2ZmID0gZmlyc3RPQiA8IGZpcnN0RG90ID8gZmlyc3RPQiA6IGZpcnN0RG90O1xyXG5cdFx0fVxyXG5cdFx0aWYgKGN1dG9mZiA9PSAtMSl7XHJcblx0XHRcdHJldHVybiBzdGF0ZU5hbWU7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gc3RhdGVOYW1lLnN1YnN0cigwLGN1dG9mZik7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblx0ICogU3RhcnQgb2Ygc3BlY2lmaWMgc3RhdGUgZnVuY3Rpb25zXHJcblx0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHRcclxuXHRoYW5kbGVTdGF0ZVVwZGF0ZXM6IGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHJcblx0fVx0XHJcbn07XHJcblxyXG4vL2FsaWFzXHJcbmV4cG9ydCBjb25zdCAkU00gPSBTdGF0ZU1hbmFnZXI7XHJcbiIsImltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tICcuL25vdGlmaWNhdGlvbnMnO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tICcuL3N0YXRlX21hbmFnZXInO1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tICcuL2VuZ2luZSc7XHJcblxyXG5leHBvcnQgY29uc3QgV2VhdGhlciA9IHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHJcbiAgICAgICAgLy9zdWJzY3JpYmUgdG8gc3RhdGVVcGRhdGVzXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5zdWJzY3JpYmUoV2VhdGhlci5oYW5kbGVTdGF0ZVVwZGF0ZXMpO1xyXG4gICAgfSxcclxuXHJcbiAgICBoYW5kbGVTdGF0ZVVwZGF0ZXM6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBpZiAoZS5jYXRlZ29yeSA9PSAnd2VhdGhlcicpIHtcclxuICAgICAgICAgICAgc3dpdGNoICgkU00uZ2V0KCd3ZWF0aGVyJykpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3N1bm55JzogXHJcbiAgICAgICAgICAgICAgICAgICAgV2VhdGhlci5zdGFydFN1bm55KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdjbG91ZHknOlxyXG4gICAgICAgICAgICAgICAgICAgIFdlYXRoZXIuc3RhcnRDbG91ZHkoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3JhaW55JzpcclxuICAgICAgICAgICAgICAgICAgICBXZWF0aGVyLnN0YXJ0UmFpbnkoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9sYXN0V2VhdGhlcjogJ3N1bm55JyxcclxuXHJcbiAgICBzdGFydFN1bm55OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIlRoZSBzdW4gYmVnaW5zIHRvIHNoaW5lLlwiKTtcclxuICAgICAgICBXZWF0aGVyLl9sYXN0V2VhdGhlciA9ICdzdW5ueSc7XHJcbiAgICAgICAgJCgnYm9keScpLmFuaW1hdGUoe2JhY2tncm91bmRDb2xvcjogJyNGRkZGRkYnfSwgJ3Nsb3cnKTtcclxuICAgICAgICAkKCdkaXYjc3RvcmVzOjpiZWZvcmUnKS5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6ICcjRkZGRkZGJ30sICdzbG93Jyk7XHJcbiAgICAgICAgV2VhdGhlci5tYWtlUmFpblN0b3AoKTtcclxuICAgIH0sXHJcblxyXG4gICAgc3RhcnRDbG91ZHk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmIChXZWF0aGVyLl9sYXN0V2VhdGhlciA9PSAnc3VubnknKSB7XHJcbiAgICAgICAgICAgIE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiQ2xvdWRzIHJvbGwgaW4sIG9ic2N1cmluZyB0aGUgc3VuLlwiKTtcclxuICAgICAgICB9IGVsc2UgaWYgKFdlYXRoZXIuX2xhc3RXZWF0aGVyID09ICdyYWlueScpIHtcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJUaGUgcmFpbiBicmVha3MsIGJ1dCB0aGUgY2xvdWRzIHJlbWFpbi5cIilcclxuICAgICAgICB9XHJcbiAgICAgICAgJCgnYm9keScpLmFuaW1hdGUoe2JhY2tncm91bmRDb2xvcjogJyM4Qjg3ODYnfSwgJ3Nsb3cnKTtcclxuICAgICAgICAkKCdkaXYjc3RvcmVzOjpiZWZvcmUnKS5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6ICcjOEI4Nzg2J30sICdzbG93Jyk7XHJcbiAgICAgICAgV2VhdGhlci5fbGFzdFdlYXRoZXIgPSAnY2xvdWR5JztcclxuICAgICAgICBXZWF0aGVyLm1ha2VSYWluU3RvcCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzdGFydFJhaW55OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoV2VhdGhlci5fbGFzdFdlYXRoZXIgPT0gJ3N1bm55Jykge1xyXG4gICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIlRoZSB3aW5kIHN1ZGRlbmx5IHBpY2tzIHVwLiBDbG91ZHMgcm9sbCBpbiwgaGVhdnkgd2l0aCByYWluLCBhbmQgcmFpbmRyb3BzIGZhbGwgc29vbiBhZnRlci5cIik7XHJcbiAgICAgICAgfSBlbHNlIGlmIChXZWF0aGVyLl9sYXN0V2VhdGhlciA9PSAnY2xvdWR5Jykge1xyXG4gICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIlRoZSBjbG91ZHMgdGhhdCB3ZXJlIHByZXZpb3VzbHkgY29udGVudCB0byBoYW5nIG92ZXJoZWFkIGxldCBsb29zZSBhIG1vZGVyYXRlIGRvd25wb3VyLlwiKVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAkKCdib2R5JykuYW5pbWF0ZSh7YmFja2dyb3VuZENvbG9yOiAnIzZENjk2OCd9LCAnc2xvdycpO1xyXG4gICAgICAgICQoJ2RpdiNzdG9yZXM6OmJlZm9yZScpLmFuaW1hdGUoe2JhY2tncm91bmRDb2xvcjogJyM2RDY5NjgnfSwgJ3Nsb3cnKTtcclxuICAgICAgICBXZWF0aGVyLl9sYXN0V2VhdGhlciA9ICdyYWlueSc7XHJcbiAgICAgICAgV2VhdGhlci5tYWtlSXRSYWluKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIF9sb2NhdGlvbjogJycsXHJcblxyXG4gICAgaW5pdGlhdGVXZWF0aGVyOiBmdW5jdGlvbihhdmFpbGFibGVXZWF0aGVyLCBsb2NhdGlvbikge1xyXG4gICAgICAgIGlmIChXZWF0aGVyLl9sb2NhdGlvbiA9PSAnJykgV2VhdGhlci5fbG9jYXRpb24gPSBsb2NhdGlvbjtcclxuICAgICAgICAvLyBpZiBpbiBuZXcgbG9jYXRpb24sIGVuZCB3aXRob3V0IHRyaWdnZXJpbmcgYSBuZXcgd2VhdGhlciBpbml0aWF0aW9uLCBcclxuICAgICAgICAvLyBsZWF2aW5nIHRoZSBuZXcgbG9jYXRpb24ncyBpbml0aWF0ZVdlYXRoZXIgY2FsbGJhY2sgdG8gZG8gaXRzIHRoaW5nXHJcbiAgICAgICAgZWxzZSBpZiAoV2VhdGhlci5fbG9jYXRpb24gIT0gbG9jYXRpb24pIHJldHVybjsgXHJcblxyXG4gICAgICAgIHZhciBjaG9zZW5XZWF0aGVyID0gJ25vbmUnO1xyXG4gICAgICAgIC8vZ2V0IG91ciByYW5kb20gZnJvbSAwIHRvIDFcclxuICAgICAgICB2YXIgcm5kID0gTWF0aC5yYW5kb20oKTtcclxuICBcclxuICAgICAgICAvL2luaXRpYWxpc2Ugb3VyIGN1bXVsYXRpdmUgcGVyY2VudGFnZVxyXG4gICAgICAgIHZhciBjdW11bGF0aXZlQ2hhbmNlID0gMDtcclxuICAgICAgICBmb3IgKHZhciBpIGluIGF2YWlsYWJsZVdlYXRoZXIpIHtcclxuICAgICAgICAgICAgY3VtdWxhdGl2ZUNoYW5jZSArPSBhdmFpbGFibGVXZWF0aGVyW2ldO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHJuZCA8IGN1bXVsYXRpdmVDaGFuY2UpIHtcclxuICAgICAgICAgICAgICAgIGNob3NlbldlYXRoZXIgPSBpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjaG9zZW5XZWF0aGVyICE9ICRTTS5nZXQoJ3dlYXRoZXInKSkgJFNNLnNldCgnd2VhdGhlcicsIGNob3NlbldlYXRoZXIpO1xyXG4gICAgICAgIEVuZ2luZS5zZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pbml0aWF0ZVdlYXRoZXIoYXZhaWxhYmxlV2VhdGhlciwgbG9jYXRpb24pO1xyXG4gICAgICAgIH0sIDMgKiA2MCAqIDEwMDApO1xyXG4gICAgfSxcclxuXHJcbiAgICBtYWtlSXRSYWluOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBodHRwczovL2NvZGVwZW4uaW8vYXJpY2tsZS9wZW4vWEtqTVpZXHJcbiAgICAgICAgLy9jbGVhciBvdXQgZXZlcnl0aGluZ1xyXG4gICAgICAgICQoJy5yYWluJykuZW1wdHkoKTtcclxuICAgICAgXHJcbiAgICAgICAgdmFyIGluY3JlbWVudCA9IDA7XHJcbiAgICAgICAgdmFyIGRyb3BzID0gXCJcIjtcclxuICAgICAgICB2YXIgYmFja0Ryb3BzID0gXCJcIjtcclxuICAgICAgXHJcbiAgICAgICAgd2hpbGUgKGluY3JlbWVudCA8IDEwMCkge1xyXG4gICAgICAgICAgLy9jb3VwbGUgcmFuZG9tIG51bWJlcnMgdG8gdXNlIGZvciB2YXJpb3VzIHJhbmRvbWl6YXRpb25zXHJcbiAgICAgICAgICAvL3JhbmRvbSBudW1iZXIgYmV0d2VlbiA5OCBhbmQgMVxyXG4gICAgICAgICAgdmFyIHJhbmRvSHVuZG8gPSAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDk4IC0gMSArIDEpICsgMSkpO1xyXG4gICAgICAgICAgLy9yYW5kb20gbnVtYmVyIGJldHdlZW4gNSBhbmQgMlxyXG4gICAgICAgICAgdmFyIHJhbmRvRml2ZXIgPSAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDUgLSAyICsgMSkgKyAyKSk7XHJcbiAgICAgICAgICAvL2luY3JlbWVudFxyXG4gICAgICAgICAgaW5jcmVtZW50ICs9IHJhbmRvRml2ZXI7XHJcbiAgICAgICAgICAvL2FkZCBpbiBhIG5ldyByYWluZHJvcCB3aXRoIHZhcmlvdXMgcmFuZG9taXphdGlvbnMgdG8gY2VydGFpbiBDU1MgcHJvcGVydGllc1xyXG4gICAgICAgICAgZHJvcHMgKz0gJzxkaXYgY2xhc3M9XCJkcm9wXCIgc3R5bGU9XCJsZWZ0OiAnICsgaW5jcmVtZW50ICsgJyU7IGJvdHRvbTogJyArIChyYW5kb0ZpdmVyICsgcmFuZG9GaXZlciAtIDEgKyAxMDApICsgJyU7IGFuaW1hdGlvbi1kZWxheTogMC4nICsgcmFuZG9IdW5kbyArICdzOyBhbmltYXRpb24tZHVyYXRpb246IDAuNScgKyByYW5kb0h1bmRvICsgJ3M7XCI+PGRpdiBjbGFzcz1cInN0ZW1cIiBzdHlsZT1cImFuaW1hdGlvbi1kZWxheTogMC4nICsgcmFuZG9IdW5kbyArICdzOyBhbmltYXRpb24tZHVyYXRpb246IDAuNScgKyByYW5kb0h1bmRvICsgJ3M7XCI+PC9kaXY+PGRpdiBjbGFzcz1cInNwbGF0XCIgc3R5bGU9XCJhbmltYXRpb24tZGVsYXk6IDAuJyArIHJhbmRvSHVuZG8gKyAnczsgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjUnICsgcmFuZG9IdW5kbyArICdzO1wiPjwvZGl2PjwvZGl2Pic7XHJcbiAgICAgICAgICBiYWNrRHJvcHMgKz0gJzxkaXYgY2xhc3M9XCJkcm9wXCIgc3R5bGU9XCJyaWdodDogJyArIGluY3JlbWVudCArICclOyBib3R0b206ICcgKyAocmFuZG9GaXZlciArIHJhbmRvRml2ZXIgLSAxICsgMTAwKSArICclOyBhbmltYXRpb24tZGVsYXk6IDAuJyArIHJhbmRvSHVuZG8gKyAnczsgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjUnICsgcmFuZG9IdW5kbyArICdzO1wiPjxkaXYgY2xhc3M9XCJzdGVtXCIgc3R5bGU9XCJhbmltYXRpb24tZGVsYXk6IDAuJyArIHJhbmRvSHVuZG8gKyAnczsgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjUnICsgcmFuZG9IdW5kbyArICdzO1wiPjwvZGl2PjxkaXYgY2xhc3M9XCJzcGxhdFwiIHN0eWxlPVwiYW5pbWF0aW9uLWRlbGF5OiAwLicgKyByYW5kb0h1bmRvICsgJ3M7IGFuaW1hdGlvbi1kdXJhdGlvbjogMC41JyArIHJhbmRvSHVuZG8gKyAncztcIj48L2Rpdj48L2Rpdj4nO1xyXG4gICAgICAgIH1cclxuICAgICAgXHJcbiAgICAgICAgJCgnLnJhaW4uZnJvbnQtcm93JykuYXBwZW5kKGRyb3BzKTtcclxuICAgICAgICAkKCcucmFpbi5iYWNrLXJvdycpLmFwcGVuZChiYWNrRHJvcHMpO1xyXG4gICAgfSxcclxuXHJcbiAgICBtYWtlUmFpblN0b3A6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQoJy5yYWluJykuZW1wdHkoKTtcclxuICAgIH1cclxufSJdfQ==
