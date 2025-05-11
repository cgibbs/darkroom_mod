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
        if (exports.Engine.isMobile()) {
            $('<div>').text('WARNING: this might look bad on mobile. Just a heads-up.').appendTo('#main');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL3RleHRCdWlsZGVyLnRzIiwic3JjL2xpYi90cmFuc2xhdGUudHMiLCJzcmMvc2NyaXB0L0J1dHRvbi50cyIsInNyYy9zY3JpcHQvY2hhcmFjdGVycy9jYXB0YWluLnRzIiwic3JjL3NjcmlwdC9jaGFyYWN0ZXJzL2xpei50cyIsInNyYy9zY3JpcHQvY2hhcmFjdGVycy9tYXlvci50cyIsInNyYy9zY3JpcHQvZW5naW5lLnRzIiwic3JjL3NjcmlwdC9ldmVudHMudHMiLCJzcmMvc2NyaXB0L2V2ZW50cy9yb2Fkd2FuZGVyLnRzIiwic3JjL3NjcmlwdC9oZWFkZXIudHMiLCJzcmMvc2NyaXB0L25vdGlmaWNhdGlvbnMudHMiLCJzcmMvc2NyaXB0L3BsYWNlcy9vdXRwb3N0LnRzIiwic3JjL3NjcmlwdC9wbGFjZXMvcm9hZC50cyIsInNyYy9zY3JpcHQvcGxhY2VzL3ZpbGxhZ2UudHMiLCJzcmMvc2NyaXB0L3BsYXllci9jaGFyYWN0ZXIudHMiLCJzcmMvc2NyaXB0L3BsYXllci9pdGVtTGlzdC50cyIsInNyYy9zY3JpcHQvcGxheWVyL3BlcmtMaXN0LnRzIiwic3JjL3NjcmlwdC9wbGF5ZXIvcXVlc3RMb2cudHMiLCJzcmMvc2NyaXB0L3N0YXRlX21hbmFnZXIudHMiLCJzcmMvc2NyaXB0L3dlYXRoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQSwrREFBK0Q7QUFDL0QscUNBQXFDO0FBQzlCLElBQU0sR0FBRyxHQUFHLFVBQVMsSUFBMkQ7SUFDbkYsSUFBTSxNQUFNLEdBQUcsSUFBSSxLQUFhLENBQUM7SUFDakMsS0FBSyxJQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNuQixJQUFJLE9BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRO1lBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FB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QUFTLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsWUFBWSxFQUFFO1FBQ1YsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3ZCLENBQUM7Q0FDSixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gdGV4dCBidWlsZGVyIHV0aWxpdHksIHVzZWQgZm9yIGhhbmRsaW5nIGNvbmRpdGlvbmFsIHRleHQgaW4gXHJcbi8vIGRlc2NyaXB0aW9ucyBhbmQgb3RoZXIgdGV4dCBibHVyYnNcclxuZXhwb3J0IGNvbnN0IF90YiA9IGZ1bmN0aW9uKHRleHQ6IEFycmF5PHN0cmluZyB8IHsgdGV4dDogc3RyaW5nLCBpc1Zpc2libGU6IEZ1bmN0aW9uIH0+KSB7XHJcbiAgICBjb25zdCBvdXRwdXQgPSBuZXcgQXJyYXk8c3RyaW5nPjtcclxuICAgIGZvciAoY29uc3QgaSBpbiB0ZXh0KSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZih0ZXh0W2ldKSA9PT0gXCJzdHJpbmdcIikgb3V0cHV0LnB1c2godGV4dFtpXSk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICgodGV4dFtpXSBhcyB7dGV4dDogc3RyaW5nLCBpc1Zpc2libGU6IEZ1bmN0aW9ufSkuaXNWaXNpYmxlKCkpIHtcclxuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKCh0ZXh0W2ldIGFzIHt0ZXh0OiBzdHJpbmcsIGlzVmlzaWJsZTogRnVuY3Rpb259KS50ZXh0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBvdXRwdXQ7XHJcbn0iLCIvLyAoZnVuY3Rpb24oKSB7XHJcblxyXG4vLyBcdHZhciB0cmFuc2xhdGUgPSBmdW5jdGlvbih0ZXh0KVxyXG4vLyBcdHtcclxuLy8gXHRcdHZhciB4bGF0ZSA9IHRyYW5zbGF0ZUxvb2t1cCh0ZXh0KTtcclxuXHRcdFxyXG4vLyBcdFx0aWYgKHR5cGVvZiB4bGF0ZSA9PSBcImZ1bmN0aW9uXCIpXHJcbi8vIFx0XHR7XHJcbi8vIFx0XHRcdHhsYXRlID0geGxhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuLy8gXHRcdH1cclxuLy8gXHRcdGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKVxyXG4vLyBcdFx0e1xyXG4vLyBcdFx0XHR2YXIgYXBzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xyXG4vLyBcdFx0XHR2YXIgYXJncyA9IGFwcy5jYWxsKCBhcmd1bWVudHMsIDEgKTtcclxuICBcclxuLy8gXHRcdFx0eGxhdGUgPSBmb3JtYXR0ZXIoeGxhdGUsIGFyZ3MpO1xyXG4vLyBcdFx0fVxyXG5cdFx0XHJcbi8vIFx0XHRyZXR1cm4geGxhdGU7XHJcbi8vIFx0fTtcclxuXHRcclxuLy8gXHQvLyBJIHdhbnQgaXQgYXZhaWxhYmxlIGV4cGxpY2l0eSBhcyB3ZWxsIGFzIHZpYSB0aGUgb2JqZWN0XHJcbi8vIFx0dHJhbnNsYXRlLnRyYW5zbGF0ZSA9IHRyYW5zbGF0ZTtcclxuXHRcclxuLy8gXHQvL2Zyb20gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vNzc2MTk2IHZpYSBodHRwOi8vZGF2ZWRhc2guY29tLzIwMTAvMTEvMTkvcHl0aG9uaWMtc3RyaW5nLWZvcm1hdHRpbmctaW4tamF2YXNjcmlwdC8gXHJcbi8vIFx0dmFyIGRlZmF1bHRGb3JtYXR0ZXIgPSAoZnVuY3Rpb24oKSB7XHJcbi8vIFx0XHR2YXIgcmUgPSAvXFx7KFtefV0rKVxcfS9nO1xyXG4vLyBcdFx0cmV0dXJuIGZ1bmN0aW9uKHMsIGFyZ3MpIHtcclxuLy8gXHRcdFx0cmV0dXJuIHMucmVwbGFjZShyZSwgZnVuY3Rpb24oXywgbWF0Y2gpeyByZXR1cm4gYXJnc1ttYXRjaF07IH0pO1xyXG4vLyBcdFx0fTtcclxuLy8gXHR9KCkpO1xyXG4vLyBcdHZhciBmb3JtYXR0ZXIgPSBkZWZhdWx0Rm9ybWF0dGVyO1xyXG4vLyBcdHRyYW5zbGF0ZS5zZXRGb3JtYXR0ZXIgPSBmdW5jdGlvbihuZXdGb3JtYXR0ZXIpXHJcbi8vIFx0e1xyXG4vLyBcdFx0Zm9ybWF0dGVyID0gbmV3Rm9ybWF0dGVyO1xyXG4vLyBcdH07XHJcblx0XHJcbi8vIFx0dHJhbnNsYXRlLmZvcm1hdCA9IGZ1bmN0aW9uKClcclxuLy8gXHR7XHJcbi8vIFx0XHR2YXIgYXBzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xyXG4vLyBcdFx0dmFyIHMgPSBhcmd1bWVudHNbMF07XHJcbi8vIFx0XHR2YXIgYXJncyA9IGFwcy5jYWxsKCBhcmd1bWVudHMsIDEgKTtcclxuICBcclxuLy8gXHRcdHJldHVybiBmb3JtYXR0ZXIocywgYXJncyk7XHJcbi8vIFx0fTtcclxuXHJcbi8vIFx0dmFyIGR5bm9UcmFucyA9IG51bGw7XHJcbi8vIFx0dHJhbnNsYXRlLnNldER5bmFtaWNUcmFuc2xhdG9yID0gZnVuY3Rpb24obmV3RHlub1RyYW5zKVxyXG4vLyBcdHtcclxuLy8gXHRcdGR5bm9UcmFucyA9IG5ld0R5bm9UcmFucztcclxuLy8gXHR9O1xyXG5cclxuLy8gXHR2YXIgdHJhbnNsYXRpb24gPSBudWxsO1xyXG4vLyBcdHRyYW5zbGF0ZS5zZXRUcmFuc2xhdGlvbiA9IGZ1bmN0aW9uKG5ld1RyYW5zbGF0aW9uKVxyXG4vLyBcdHtcclxuLy8gXHRcdHRyYW5zbGF0aW9uID0gbmV3VHJhbnNsYXRpb247XHJcbi8vIFx0fTtcclxuXHRcclxuLy8gXHRmdW5jdGlvbiB0cmFuc2xhdGVMb29rdXAodGFyZ2V0KVxyXG4vLyBcdHtcclxuLy8gXHRcdGlmICh0cmFuc2xhdGlvbiA9PSBudWxsIHx8IHRhcmdldCA9PSBudWxsKVxyXG4vLyBcdFx0e1xyXG4vLyBcdFx0XHRyZXR1cm4gdGFyZ2V0O1xyXG4vLyBcdFx0fVxyXG5cdFx0XHJcbi8vIFx0XHRpZiAodGFyZ2V0IGluIHRyYW5zbGF0aW9uID09IGZhbHNlKVxyXG4vLyBcdFx0e1xyXG4vLyBcdFx0XHRpZiAoZHlub1RyYW5zICE9IG51bGwpXHJcbi8vIFx0XHRcdHtcclxuLy8gXHRcdFx0XHRyZXR1cm4gZHlub1RyYW5zKHRhcmdldCk7XHJcbi8vIFx0XHRcdH1cclxuLy8gXHRcdFx0cmV0dXJuIHRhcmdldDtcclxuLy8gXHRcdH1cclxuXHRcdFxyXG4vLyBcdFx0dmFyIHJlc3VsdCA9IHRyYW5zbGF0aW9uW3RhcmdldF07XHJcbi8vIFx0XHRpZiAocmVzdWx0ID09IG51bGwpXHJcbi8vIFx0XHR7XHJcbi8vIFx0XHRcdHJldHVybiB0YXJnZXQ7XHJcbi8vIFx0XHR9XHJcblx0XHRcclxuLy8gXHRcdHJldHVybiByZXN1bHQ7XHJcbi8vIFx0fTtcclxuXHRcclxuLy8gXHR3aW5kb3cuXyA9IHRyYW5zbGF0ZTtcclxuXHJcbi8vIH0pKCk7XHJcblxyXG4vLyBleHBvcnQgY29uc3QgXyA9IHdpbmRvdy5fO1xyXG5cclxuZXhwb3J0IGNvbnN0IF8gPSBmdW5jdGlvbihzKSB7IHJldHVybiBzOyB9IiwiaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4vZW5naW5lXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEJ1dHRvbiA9IHtcclxuXHRCdXR0b246IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHRcdGlmKHR5cGVvZiBvcHRpb25zLmNvb2xkb3duID09ICdudW1iZXInKSB7XHJcblx0XHRcdHRoaXMuZGF0YV9jb29sZG93biA9IG9wdGlvbnMuY29vbGRvd247XHJcblx0XHR9XHJcblx0XHR0aGlzLmRhdGFfcmVtYWluaW5nID0gMDtcclxuXHRcdGlmKHR5cGVvZiBvcHRpb25zLmNsaWNrID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0dGhpcy5kYXRhX2hhbmRsZXIgPSBvcHRpb25zLmNsaWNrO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR2YXIgZWwgPSAkKCc8ZGl2PicpXHJcblx0XHRcdC5hdHRyKCdpZCcsIHR5cGVvZihvcHRpb25zLmlkKSAhPSAndW5kZWZpbmVkJyA/IG9wdGlvbnMuaWQgOiBcIkJUTl9cIiArIEVuZ2luZS5nZXRHdWlkKCkpXHJcblx0XHRcdC5hZGRDbGFzcygnYnV0dG9uJylcclxuXHRcdFx0LnRleHQodHlwZW9mKG9wdGlvbnMudGV4dCkgIT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLnRleHQgOiBcImJ1dHRvblwiKVxyXG5cdFx0XHQuY2xpY2soZnVuY3Rpb24oKSB7IFxyXG5cdFx0XHRcdGlmKCEkKHRoaXMpLmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XHJcblx0XHRcdFx0XHRCdXR0b24uY29vbGRvd24oJCh0aGlzKSk7XHJcblx0XHRcdFx0XHQkKHRoaXMpLmRhdGEoXCJoYW5kbGVyXCIpKCQodGhpcykpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0LmRhdGEoXCJoYW5kbGVyXCIsICB0eXBlb2Ygb3B0aW9ucy5jbGljayA9PSAnZnVuY3Rpb24nID8gb3B0aW9ucy5jbGljayA6IGZ1bmN0aW9uKCkgeyBFbmdpbmUubG9nKFwiY2xpY2tcIik7IH0pXHJcblx0XHRcdC5kYXRhKFwicmVtYWluaW5nXCIsIDApXHJcblx0XHRcdC5kYXRhKFwiY29vbGRvd25cIiwgdHlwZW9mIG9wdGlvbnMuY29vbGRvd24gPT0gJ251bWJlcicgPyBvcHRpb25zLmNvb2xkb3duIDogMCk7XHJcblx0XHRpZiAob3B0aW9ucy5pbWFnZSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGVsLmF0dHIoXCJzdHlsZVwiLCBcImJhY2tncm91bmQtaW1hZ2U6IHVybChcXFwiXCIgKyBvcHRpb25zLmltYWdlICsgXCJcXFwiKTsgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDsgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjsgaGVpZ2h0OiAxNzBweDsgY29sb3I6IHdoaXRlO3RleHQtc2hhZG93OiAwcHggMHB4IDJweCBibGFja1wiKVxyXG5cdFx0fVxyXG5cdFx0ZWwuYXBwZW5kKCQoXCI8ZGl2PlwiKS5hZGRDbGFzcygnY29vbGRvd24nKSk7XHJcblx0XHRcclxuXHRcdGlmKG9wdGlvbnMuY29zdCkge1xyXG5cdFx0XHR2YXIgdHRQb3MgPSBvcHRpb25zLnR0UG9zID8gb3B0aW9ucy50dFBvcyA6IFwiYm90dG9tIHJpZ2h0XCI7XHJcblx0XHRcdHZhciBjb3N0VG9vbHRpcCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ3Rvb2x0aXAgJyArIHR0UG9zKTtcclxuXHRcdFx0Zm9yKHZhciBrIGluIG9wdGlvbnMuY29zdCkge1xyXG5cdFx0XHRcdCQoXCI8ZGl2PlwiKS5hZGRDbGFzcygncm93X2tleScpLnRleHQoXyhrKSkuYXBwZW5kVG8oY29zdFRvb2x0aXApO1xyXG5cdFx0XHRcdCQoXCI8ZGl2PlwiKS5hZGRDbGFzcygncm93X3ZhbCcpLnRleHQob3B0aW9ucy5jb3N0W2tdKS5hcHBlbmRUbyhjb3N0VG9vbHRpcCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY29zdFRvb2x0aXAuY2hpbGRyZW4oKS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0Y29zdFRvb2x0aXAuYXBwZW5kVG8oZWwpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmKG9wdGlvbnMud2lkdGgpIHtcclxuXHRcdFx0ZWwuY3NzKCd3aWR0aCcsIG9wdGlvbnMud2lkdGgpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gZWw7XHJcblx0fSxcclxuXHRcclxuXHRzZXREaXNhYmxlZDogZnVuY3Rpb24oYnRuLCBkaXNhYmxlZCkge1xyXG5cdFx0aWYoYnRuKSB7XHJcblx0XHRcdGlmKCFkaXNhYmxlZCAmJiAhYnRuLmRhdGEoJ29uQ29vbGRvd24nKSkge1xyXG5cdFx0XHRcdGJ0bi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdFx0fSBlbHNlIGlmKGRpc2FibGVkKSB7XHJcblx0XHRcdFx0YnRuLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGJ0bi5kYXRhKCdkaXNhYmxlZCcsIGRpc2FibGVkKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGlzRGlzYWJsZWQ6IGZ1bmN0aW9uKGJ0bikge1xyXG5cdFx0aWYoYnRuKSB7XHJcblx0XHRcdHJldHVybiBidG4uZGF0YSgnZGlzYWJsZWQnKSA9PT0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cdFxyXG5cdGNvb2xkb3duOiBmdW5jdGlvbihidG4pIHtcclxuXHRcdHZhciBjZCA9IGJ0bi5kYXRhKFwiY29vbGRvd25cIik7XHJcblx0XHRpZihjZCA+IDApIHtcclxuXHRcdFx0JCgnZGl2LmNvb2xkb3duJywgYnRuKS5zdG9wKHRydWUsIHRydWUpLndpZHRoKFwiMTAwJVwiKS5hbmltYXRlKHt3aWR0aDogJzAlJ30sIGNkICogMTAwMCwgJ2xpbmVhcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBiID0gJCh0aGlzKS5jbG9zZXN0KCcuYnV0dG9uJyk7XHJcblx0XHRcdFx0Yi5kYXRhKCdvbkNvb2xkb3duJywgZmFsc2UpO1xyXG5cdFx0XHRcdGlmKCFiLmRhdGEoJ2Rpc2FibGVkJykpIHtcclxuXHRcdFx0XHRcdGIucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0YnRuLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHRidG4uZGF0YSgnb25Db29sZG93bicsIHRydWUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0Y2xlYXJDb29sZG93bjogZnVuY3Rpb24oYnRuKSB7XHJcblx0XHQkKCdkaXYuY29vbGRvd24nLCBidG4pLnN0b3AodHJ1ZSwgdHJ1ZSk7XHJcblx0XHRidG4uZGF0YSgnb25Db29sZG93bicsIGZhbHNlKTtcclxuXHRcdGlmKCFidG4uZGF0YSgnZGlzYWJsZWQnKSkge1xyXG5cdFx0XHRidG4ucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHR9XHJcblx0fVxyXG59OyIsImltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIlxyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiXHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiXHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuLi9wbGF5ZXIvY2hhcmFjdGVyXCJcclxuXHJcbmV4cG9ydCBjb25zdCBDYXB0YWluID0ge1xyXG5cdHRhbGtUb0NhcHRhaW46IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnVGhlIENhcHRhaW5cXCdzIFRlbnQnKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICBzZWVuRmxhZzogKCkgPT4gJFNNLmdldCgnT3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnKSxcclxuXHRcdFx0XHRcdG5leHRTY2VuZTogJ21haW4nLFxyXG5cdFx0XHRcdFx0b25Mb2FkOiAoKSA9PiAkU00uc2V0KCdPdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcsIDEpLFxyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdZb3UgZW50ZXIgdGhlIGZhbmNpZXN0LWxvb2tpbmcgdGVudCBpbiB0aGUgT3V0cG9zdC4gQSBsYXJnZSBtYW4gd2l0aCBhIHRvb3RoYnJ1c2ggbXVzdGFjaGUgYW5kIGEgc2V2ZXJlIGZyb3duIGxvb2tzIHVwIGZyb20gaGlzIGRlc2suJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiU2lyLCB5b3UgaGF2ZSBlbnRlcmVkIHRoZSB0ZW50IG9mIENhcHRhaW4gRmlubmVhcy4gV2hhdCBidXNpbmVzcyBkbyB5b3UgaGF2ZSBoZXJlP1wiJylcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Fza0Fib3V0U3VwcGxpZXMnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBc2sgQWJvdXQgU3VwcGxpZXMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6J2Fza0Fib3V0U3VwcGxpZXMnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiBDYXB0YWluLmhhbmRsZVN1cHBsaWVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlOiAoKSA9PiAhJFNNLmdldCgnT3V0cG9zdC5jYXB0YWluLmFza2VkQWJvdXRTdXBwbGllcycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhc2tBYm91dENhcHRhaW4nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBc2sgQWJvdXQgQ2FwdGFpbicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTogJ2NhcHRhaW5SYW1ibGUnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnbGVhdmUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdMZWF2ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICdtYWluJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnVGhlIENhcHRhaW4gZ3JlZXRzIHlvdSB3YXJtbHkuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiQWhoLCB5ZXMsIHdlbGNvbWUgYmFjay4gV2hhdCBjYW4gSSBkbyBmb3IgeW91P1wiJylcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Fza0Fib3V0U3VwcGxpZXMnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBc2sgQWJvdXQgU3VwcGxpZXMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6J2Fza0Fib3V0U3VwcGxpZXMnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiBDYXB0YWluLmhhbmRsZVN1cHBsaWVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlOiAoKSA9PiAhJFNNLmdldCgnT3V0cG9zdC5jYXB0YWluLmFza2VkQWJvdXRTdXBwbGllcycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhc2tBYm91dENhcHRhaW4nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBc2sgQWJvdXQgQ2FwdGFpbicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTonY2FwdGFpblJhbWJsZSd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0xlYXZlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgJ2NhcHRhaW5SYW1ibGUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdUaGUgQ2FwdGFpblxcJ3MgZXllcyBnbGVhbSBhdCB0aGUgb3Bwb3J0dW5pdHkgdG8gcnVuIGRvd24gaGlzIGxpc3Qgb2YgYWNoaWV2ZW1lbnRzLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIldoeSwgSVxcJ2xsIGhhdmUgeW91IGtub3cgdGhhdCB5b3Ugc3RhbmQgaW4gdGhlIHByZXNlbmNlIG9mIG5vbmUgb3RoZXIgdGhhbiBGaW5uZWFzIEouIEZvYnNsZXksIENhcHRhaW4gb2YgdGhlIFJveWFsIEFybXlcXCdzIEZpZnRoIERpdmlzaW9uLCB0aGUgZmluZXN0IERpdmlzaW9uIGluIEhpcyBNYWplc3R5XFwncyBzZXJ2aWNlLlwiJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ0hlIHB1ZmZzIG91dCBoaXMgY2hlc3QsIGRyYXdpbmcgYXR0ZW50aW9uIHRvIGhpcyBtYW55IG1lZGFscy4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCJJIGhhdmUgY2FtcGFpZ25lZCBvbiBiZWhhbGYgb2YgT3VyIExvcmRzaGlwIGFjcm9zcyBtYW55IGxhbmRzLCBpbmNsdWRpbmcgVGhlIEZhciBXZXN0LCB0aGUgbm9ydGhlcm4gYm9yZGVycyBvZiBVbWJlcnNoaXJlIGFuZCBQZWxpbmdhbCwgTmV3IEJlbGxpc2lhLCBhbmQgZWFjaCBvZiB0aGUgRml2ZSBJc2xlcyBvZiB0aGUgUGlycmhpYW4gU2VhLlwiJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ0hlIHBhdXNlcyBmb3IgYSBtb21lbnQsIHBlcmhhcHMgdG8gc2VlIGlmIHlvdSBhcmUgc3VpdGFibHkgaW1wcmVzc2VkLCB0aGVuIGNvbnRpbnVlcy4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCJBcyBDYXB0YWluIG9mIHRoZSBGaWZ0aCBEaXZpc2lvbiwgSSBoYWQgdGhlIGVzdGVlbWVkIHByaXZpbGVnZSBvZiBlbnN1cmluZyB0aGUgc2FmZXR5IG9mIHRoZXNlIGxhbmRzIGZvciBvdXIgZmFpciBjaXRpemVucy4gSSBoYXZlIGJlZW4gYXdhcmRlZCBtYW55IHRpbWVzIG92ZXIgZm9yIG15IGJyYXZlcnkgaW4gdGhlIGZhY2Ugb2YgdXRtb3N0IHBlcmlsLiBGb3IgaW5zdGFuY2UsIGR1cmluZyB0aGUgU2VhIENhbXBhaWduIG9uIFRoeXBwZSwgVGhpcmQgb2YgdGhlIEZpdmUgSXNsZXMsIHdlIHdlcmUgYW1idXNoZWQgd2hpbGUgZGlzZW1iYXJraW5nIGZyb20gb3VyIHNoaXAuIFRoaW5raW5nIHF1aWNrbHksIEkuLi5cIicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdUaGUgY2FwdGFpbiBjb250aW51ZXMgdG8gcmFtYmxlIGxpa2UgdGhpcyBmb3Igc2V2ZXJhbCBtb3JlIG1pbnV0ZXMsIGdpdmluZyB5b3UgdGltZSB0byBiZWNvbWUgbXVjaCBtb3JlIGZhbWlsaWFyIHdpdGggdGhlIGRpcnQgdW5kZXIgeW91ciBmaW5nZXJuYWlscy4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCIuLi4gYW5kIFRIQVQsIG15IGdvb2QgYWR2ZW50dXJlciwgaXMgd2h5IEkgYWx3YXlzIGtlZXAgZnJlc2ggYmFzaWwgb24gaGFuZC5cIicpXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdmYXNjaW5hdGluZyc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0Zhc2NpbmF0aW5nJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOidtYWluQ29udGludWVkJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAnbWFpbkNvbnRpbnVlZCc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1RoZSBDYXB0YWluIHNodWZmbGVzIGhpcyBwYXBlcnMgaW4gYSBzb21ld2hhdCBwZXJmb3JtYXRpdmUgd2F5LicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIldhcyB0aGVyZSBzb21ldGhpbmcgZWxzZSB5b3UgbmVlZGVkP1wiJylcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Fza0Fib3V0U3VwcGxpZXMnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBc2sgQWJvdXQgU3VwcGxpZXMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6J2Fza0Fib3V0U3VwcGxpZXMnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiBDYXB0YWluLmhhbmRsZVN1cHBsaWVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlOiAoKSA9PiAhJFNNLmdldCgnT3V0cG9zdC5jYXB0YWluLmFza2VkQWJvdXRTdXBwbGllcycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhc2tBYm91dENhcHRhaW4nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBc2sgQWJvdXQgQ2FwdGFpbicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTonY2FwdGFpblJhbWJsZSd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0xlYXZlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgJ2Fza0Fib3V0U3VwcGxpZXMnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdUaGUgQ2FwdGFpblxcJ3MgZXllcyBnbGVhbSB3aXRoIGEgbWl4dHVyZSBvZiByZWFsaXphdGlvbiBhbmQgZ3VpbHQuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiQWhoLCB5ZXMsIHJpZ2h0LCB0aGUgc3VwcGxpZXMuIEkgc3VwcG9zZSB0aGUgTWF5b3IgaXMgc3RpbGwgd2FpdGluZyBmb3IgdGhvc2UuIEhhdmUgYSBsb29rIGluIHRoYXQgY2hlc3Qgb3ZlciB0aGVyZSwgaXQgc2hvdWxkIGhhdmUgZXZlcnl0aGluZyB5b3UgbmVlZC5cIicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdIZSBpbmRpY2F0ZXMgdG8gYSBjaGVzdCBhdCB0aGUgYmFjayBvZiB0aGUgcm9vbS4gWW91IG9wZW4gdGhlIGxpZCwgcmV2ZWFsaW5nIHRoZSBzdXBwbGllcyB3aXRoaW4uJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1lvdSB0YWtlIHRoZSBzdXBwbGllcy4nKVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0dvb2QgU3R1ZmYnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG5cclxuICAgIGhhbmRsZVN1cHBsaWVzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAkU00uc2V0KCdPdXRwb3N0LmNhcHRhaW4uYXNrZWRBYm91dFN1cHBsaWVzJywgMSk7XHJcbiAgICAgICAgQ2hhcmFjdGVyLmFkZFRvSW52ZW50b3J5KFwiQ2FwdGFpbi5zdXBwbGllc1wiKTtcclxuICAgICAgICBDaGFyYWN0ZXIuY2hlY2tRdWVzdFN0YXR1cyhcIm1heW9yU3VwcGxpZXNcIik7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyBWaWxsYWdlIH0gZnJvbSBcIi4uL3BsYWNlcy92aWxsYWdlXCI7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuLi9wbGF5ZXIvY2hhcmFjdGVyXCI7XHJcblxyXG5leHBvcnQgY29uc3QgTGl6ID0ge1xyXG4gICAgc2V0TGl6QWN0aXZlOiBmdW5jdGlvbigpIHtcclxuXHRcdCRTTS5zZXQoJ3ZpbGxhZ2UubGl6QWN0aXZlJywgMSk7XHJcblx0XHQkU00uc2V0KCd2aWxsYWdlLmxpei5jYW5GaW5kQm9vaycsIDApO1xyXG5cdFx0JFNNLnNldCgndmlsbGFnZS5saXouaGFzQm9vaycsIDEpO1xyXG5cdFx0VmlsbGFnZS51cGRhdGVCdXR0b24oKTtcclxuXHR9LFxyXG5cclxuXHR0YWxrVG9MaXo6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnTGl6XFwncyBob3VzZSwgYXQgdGhlIGVkZ2Ugb2YgdG93bicpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0c2VlbkZsYWc6ICgpID0+ICRTTS5nZXQoJ3ZpbGxhZ2UubGl6LmhhdmVNZXQnKSxcclxuXHRcdFx0XHRcdG5leHRTY2VuZTogJ21haW4nLFxyXG5cdFx0XHRcdFx0b25Mb2FkOiAoKSA9PiAkU00uc2V0KCd2aWxsYWdlLmxpei5oYXZlTWV0JywgMSksXHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1lvdSBlbnRlciB0aGUgYnVpbGRpbmcgYW5kIGFyZSBpbW1lZGlhdGVseSBwbHVuZ2VkIGludG8gYSBsYWJ5cmludGggb2Ygc2hlbHZlcyBoYXBoYXphcmRseSBmaWxsZWQgd2l0aCBib29rcyBvZiBhbGwga2luZHMuIEFmdGVyIGEgYml0IG9mIHNlYXJjaGluZywgeW91IGZpbmQgYSBzaWRlIHJvb20gd2hlcmUgYSB3b21hbiB3aXRoIG1vdXN5IGhhaXIgYW5kIGdsYXNzZXMgaXMgc2l0dGluZyBhdCBhIHdyaXRpbmcgZGVzay4gU2hlXFwncyByZWFkaW5nIGEgbGFyZ2UgYm9vayB0aGF0IGFwcGVhcnMgdG8gaW5jbHVkZSBkaWFncmFtcyBvZiBzb21lIHNvcnQgb2YgcGxhbnQuIFNoZSBsb29rcyB1cCBhcyB5b3UgZW50ZXIgdGhlIHJvb20uJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiV2hvIHRoZSBoZWxsIGFyZSB5b3U/XCInKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2Fza0Fib3V0VG93bic6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgYWJvdXQgQ2hhZHRvcGlhJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2NoYWR0b3BpYVJhbWJsZSd9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdxdWVzdCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgZm9yIGEgcXVlc3QnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAncXVlc3RSZXF1ZXN0J31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0xlYXZlJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnY2hhZHRvcGlhUmFtYmxlJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdMaXogbG9va3MgYXQgeW91IGZvciBhIG1vbWVudCBiZWZvcmUgcmV0dXJuaW5nIGhlciBnYXplIHRvIHRoZSBib29rIGluIGZyb250IG9mIGhlci4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJUaGVyZVxcJ3MgYSBib29rIGluIGhlcmUgc29tZXdoZXJlIGFib3V0IHRoZSBmb3VuZGluZyBvZiBDaGFkdG9waWEuIElmIHlvdSBjYW4gZmluZCBpdCwgeW91XFwncmUgZnJlZSB0byBib3Jyb3cgaXQuXCInKV0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdva2F5Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ09rYXksIHRoZW4uJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ21haW4nfSxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogKCkgPT4gJFNNLnNldCgndmlsbGFnZS5saXouY2FuRmluZEJvb2snLCB0cnVlKVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHJcblx0XHRcdFx0J21haW4nOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXygnTGl6IHNlZW1zIGRldGVybWluZWQgbm90IHRvIHBheSBhdHRlbnRpb24gdG8geW91LicpXSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2Fza0Fib3V0VG93bic6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgYWJvdXQgQ2hhZHRvcGlhJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2NoYWR0b3BpYVJhbWJsZSd9LFxyXG5cdFx0XHRcdFx0XHRcdGF2YWlsYWJsZTogKCkgPT4gISRTTS5nZXQoJ3ZpbGxhZ2UubGl6LmNhbkZpbmRCb29rJylcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J3F1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBmb3IgYSBxdWVzdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdxdWVzdFJlcXVlc3QnfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnZmluZEJvb2snOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnVHJ5IHRvIGZpbmQgdGhlIGJvb2snKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnZmluZEJvb2snfSxcclxuXHRcdFx0XHRcdFx0XHQvLyBUT0RPOiBhIFwidmlzaWJsZVwiIGZsYWcgd291bGQgYmUgZ29vZCBoZXJlLCBmb3Igc2l0dWF0aW9ucyB3aGVyZSBhbiBvcHRpb25cclxuXHRcdFx0XHRcdFx0XHQvLyAgIGlzbid0IHlldCBrbm93biB0byB0aGUgcGxheWVyXHJcblx0XHRcdFx0XHRcdFx0dmlzaWJsZTogKCkgPT4gJFNNLmdldCgndmlsbGFnZS5saXouY2FuRmluZEJvb2snKSxcclxuXHRcdFx0XHRcdFx0XHRhdmFpbGFibGU6ICgpID0+ICgkU00uZ2V0KCd2aWxsYWdlLmxpei5jYW5GaW5kQm9vaycpIGFzIG51bWJlciA+IDApICYmICgkU00uZ2V0KCd2aWxsYWdlLmxpei5oYXNCb29rJykpXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdsZWF2ZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdMZWF2ZScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J2ZpbmRCb29rJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdMZWF2aW5nIExpeiB0byBoZXIgYnVzaW5lc3MsIHlvdSB3YW5kZXIgYXJvdW5kIGFtaWRzdCB0aGUgYm9va3MsIHdvbmRlcmluZyBob3cgeW91XFwnbGwgZXZlciBtYW5hZ2UgdG8gZmluZCB3aGF0IHlvdVxcJ3JlIGxvb2tpbmcgZm9yIGluIGFsbCB0aGlzIHVub3JnYW5pemVkIG1lc3MuJyksXHJcblx0XHRcdFx0XHRcdF8oJ0ZvcnR1bmF0ZWx5LCB0aGUgY3JlYXRvciBvZiB0aGlzIGdhbWUgZG9lc25cXCd0IGZlZWwgbGlrZSBpdFxcJ2QgYmUgdmVyeSBpbnRlcmVzdGluZyB0byBtYWtlIHRoaXMgaW50byBhIHB1enpsZSwgc28geW91IHNwb3QgdGhlIGJvb2sgb24gYSBuZWFyYnkgc2hlbGYgYW5kIGdyYWIgaXQuJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdzaWNrJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ09oLCBzaWNrJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gJFNNLnNldCgnc3RvcmVzLldlaXJkIEJvb2snLCAxKTtcclxuXHRcdFx0XHRcdFx0XHRcdENoYXJhY3Rlci5hZGRUb0ludmVudG9yeShcIkxpei53ZWlyZEJvb2tcIik7XHJcblx0XHRcdFx0XHRcdFx0XHQkU00uc2V0KCd2aWxsYWdlLmxpei5oYXNCb29rJywgMCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQncXVlc3RSZXF1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdMaXogbGV0cyBvdXQgYW4gYW5ub3llZCBzaWdoLicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIk9oIGJyYXZlIGFkdmVudHVyZXIsIEkgc2VlbSB0byBoYXZlIGxvc3QgbXkgcGF0aWVuY2UuIFdoZW4gbGFzdCBJIHNhdyBpdCwgaXQgd2FzIHNvbWV3aGVyZSBvdXRzaWRlIG9mIHRoaXMgYnVpbGRpbmcuIFdvdWxkc3QgdGhvdSByZWNvdmVyIHRoYXQgd2hpY2ggaGFzIGJlZW4gc3RvbGVuIGZyb20gbWU/XCInKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J29rYXknOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnT2theSwgamVleiwgSSBnZXQgaXQnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnbWFpbid9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxufSIsImltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IExpeiB9IGZyb20gXCIuL2xpelwiO1xyXG5pbXBvcnQgeyBSb2FkIH0gZnJvbSBcIi4uL3BsYWNlcy9yb2FkXCI7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuLi9wbGF5ZXIvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCB7IFZpbGxhZ2UgfSBmcm9tIFwiLi4vcGxhY2VzL3ZpbGxhZ2VcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBNYXlvciA9IHtcclxuICAgIHRhbGtUb01heW9yOiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ01lZXQgdGhlIE1heW9yJyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHRzZWVuRmxhZzogKCkgPT4gJFNNLmdldCgndmlsbGFnZS5tYXlvci5oYXZlTWV0JyksXHJcblx0XHRcdFx0XHRuZXh0U2NlbmU6ICdtYWluJyxcclxuXHRcdFx0XHRcdG9uTG9hZDogKCkgPT4gJFNNLnNldCgndmlsbGFnZS5tYXlvci5oYXZlTWV0JywgMSksXHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1RoZSBtYXlvciBzbWlsZXMgYXQgeW91IGFuZCBzYXlzOicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIldlbGNvbWUgdG8gQ2hhZHRvcGlhLCBJXFwnbSB0aGUgbWF5b3Igb2YgdGhlc2UgaGVyZSBwYXJ0cy4gV2hhdCBjYW4gSSBkbyB5b3UgZm9yP1wiJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdhc2tBYm91dFRvd24nOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGFib3V0IENoYWR0b3BpYScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdjaGFkdG9waWFSYW1ibGUnfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQncXVlc3QnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGZvciBhIHF1ZXN0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ3F1ZXN0J31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0xlYXZlJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnY2hhZHRvcGlhUmFtYmxlJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdUaGUgbWF5b3IgcHVzaGVzIHRoZSBicmltIG9mIGhpcyBoYXQgdXAuJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiV2VsbCwgd2VcXCd2ZSBhbHdheXMgYmVlbiBoZXJlLCBsb25nIGFzIEkgY2FuIHJlbWVtYmVyLiBJIHRvb2sgb3ZlciBhZnRlciB0aGUgbGFzdCBtYXlvciBkaWVkLCBidXQgaGUgd291bGQgaGF2ZSBiZWVuIHRoZSBvbmx5IHBlcnNvbiB3aXRoIGFueSBoaXN0b3JpY2FsIGtub3dsZWRnZSBvZiB0aGlzIHZpbGxhZ2UuXCInKSxcclxuXHRcdFx0XHRcdFx0XygnSGUgcGF1c2VzIGZvciBhIG1vbWVudCBhbmQgdG91c2xlcyBzb21lIG9mIHRoZSB3aXNweSBoYWlycyB0aGF0IGhhdmUgcG9rZWQgb3V0IGZyb20gdW5kZXIgdGhlIHJhaXNlZCBoYXQuJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiQWN0dWFsbHksIHlvdSBtaWdodCBhc2sgTGl6LCBzaGUgaGFzIGEgYnVuY2ggb2YgaGVyIG1vdGhlclxcJ3MgYm9va3MgZnJvbSB3YXkgYmFjayB3aGVuLiBTaGUgbGl2ZXMgYXQgdGhlIGVkZ2Ugb2YgdG93bi5cIicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnb2theSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdPa2F5LCB0aGVuLicpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdtYWluJ30sXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IExpei5zZXRMaXpBY3RpdmVcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J21haW4nOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1RoZSBtYXlvciBzYXlzOicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIkFueXdheSwgd2hhdCBFTFNFIGNhbiBJIGRvIHlvdSBmb3I/XCInKSxcclxuXHRcdFx0XHRcdFx0XygnSGUgY2h1Y2tsZXMgYXQgaGlzIGNsZXZlciB1c2Ugb2YgbGFuZ3VhZ2UuJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdhc2tBYm91dFRvd24nOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGFib3V0IENoYWR0b3BpYScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdjaGFkdG9waWFSYW1ibGUnfSxcclxuXHRcdFx0XHRcdFx0XHQvLyBpbWFnZTogXCJhc3NldHMvY2FyZHMvbGl0dGxlX3dvbGYucG5nXCJcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J3F1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBmb3IgYSBxdWVzdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdxdWVzdCd9LFxyXG5cdFx0XHRcdFx0XHRcdGF2YWlsYWJsZTogKCkgPT5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIG5vdCBhdmFpbGFibGUgaWYgbWF5b3JTdXBwbGllcyBpcyBpbi1wcm9ncmVzc1xyXG5cdFx0XHRcdFx0XHRcdFx0KENoYXJhY3Rlci5xdWVzdFN0YXR1c1tcIm1heW9yU3VwcGxpZXNcIl0gPT09IHVuZGVmaW5lZClcclxuXHRcdFx0XHRcdFx0XHRcdC8vIHJlLWFkZCB0aGlzIGNvbmRpdGlvbiBsYXRlciwgd2UgbmVlZCB0byBzZW5kIHRoZW0gdG8gYSBkaWZmZXJlbnRcclxuXHRcdFx0XHRcdFx0XHRcdC8vICAgcXVlc3QgZGlhbG9nIGlmIHRoZXkgYWxyZWFkeSBkaWQgdGhlIGZpcnN0IHF1ZXN0XHJcblx0XHRcdFx0XHRcdFx0XHQvLyB8fCAoQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW1wibWF5b3JTdXBwbGllc1wiXSA9PSAtMSlcclxuXHRcdFx0XHRcdFx0XHQvLyBpbWFnZTogXCJhc3NldHMvY2FyZHMvam9rZXIucG5nXCJcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2dpdmVTdXBwbGllcyc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdIYW5kIG92ZXIgdGhlIHN1cHBsaWVzJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2dpdmVTdXBwbGllcyd9LFxyXG5cdFx0XHRcdFx0XHRcdGF2YWlsYWJsZTogKCkgPT4gXHJcblx0XHRcdFx0XHRcdFx0XHQoJFNNLmdldCgndmlsbGFnZS5tYXlvci5oYXZlR2l2ZW5TdXBwbGllcycpID09PSB1bmRlZmluZWQpIFxyXG5cdFx0XHRcdFx0XHRcdFx0JiYgKENoYXJhY3Rlci5xdWVzdFN0YXR1c1tcIm1heW9yU3VwcGxpZXNcIl0gIT09IHVuZGVmaW5lZClcclxuXHRcdFx0XHRcdFx0XHRcdCYmIENoYXJhY3Rlci5pbnZlbnRvcnlbXCJDYXB0YWluLnN1cHBsaWVzXCJdLFxyXG5cdFx0XHRcdFx0XHRcdHZpc2libGU6ICgpID0+XHJcblx0XHRcdFx0XHRcdFx0XHQoQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW1wibWF5b3JTdXBwbGllc1wiXSAhPT0gdW5kZWZpbmVkKSxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0Q2hhcmFjdGVyLnJlbW92ZUZyb21JbnZlbnRvcnkoXCJDYXB0YWluLnN1cHBsaWVzXCIpO1xyXG5cdFx0XHRcdFx0XHRcdFx0JFNNLnNldCgndmlsbGFnZS5tYXlvci5oYXZlR2l2ZW5TdXBwbGllcycsIDEpO1xyXG5cdFx0XHRcdFx0XHRcdFx0Q2hhcmFjdGVyLmNoZWNrUXVlc3RTdGF0dXMoXCJtYXlvclN1cHBsaWVzXCIpO1xyXG5cdFx0XHRcdFx0XHRcdFx0VmlsbGFnZS51cGRhdGVCdXR0b24oKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdsZWF2ZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdMZWF2ZScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0Ly8gaW1hZ2U6IFwiYXNzZXRzL2NhcmRzL3JhdmVuLnBuZ1wiXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdxdWVzdCc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnVGhlIG1heW9yIHRoaW5rcyBmb3IgYSBtb21lbnQuJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiWW91IGtub3csIGl0XFwncyBiZWVuIGEgd2hpbGUgc2luY2Ugb3VyIGxhc3Qgc2hpcG1lbnQgb2Ygc3VwcGxpZXMgYXJyaXZlZCBmcm9tIHRoZSBPdXRwb3N0LiBNaW5kIGxvb2tpbmcgaW50byB0aGF0IGZvciB1cz9cIicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIllvdSBjYW4gYXNrIGFib3V0IGl0IGF0IHRoZSBvdXRwb3N0LCBvciBqdXN0IHdhbmRlciBhcm91bmQgb24gdGhlIHJvYWQgYW5kIHNlZSBpZiB5b3UgZmluZCBhbnkgY2x1ZXMuIEVpdGhlciB3YXksIGl0XFwncyB0aW1lIHRvIGhpdCB0aGUgcm9hZCwgYWR2ZW50dXJlciFcIicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnYWxyaWdodHknOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQWxyaWdodHknKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnbWFpbid9LFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBNYXlvci5zdGFydFN1cHBsaWVzUXVlc3RcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J2dpdmVTdXBwbGllcyc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnVGhlIG1heW9yIHNtaWxlcywgYW5kIHRoZSBlZGdlcyBvZiBoaXMgZXllcyBjcmlua2xlLicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIlRoYW5rIHlvdSwgYnJhdmUgYWR2ZW50dXJlciEgV2l0aCB0aGVzZSBzdXBwbGllcywgdGhlIHZpbGxhZ2UgY2FuIG9uY2UgYWdhaW4gdGhyaXZlLlwiJyksXHJcblx0XHRcdFx0XHRcdF8oJ0hlIHRha2VzIHRoZW0gZnJvbSB5b3UgZ3JhY2lvdXNseSwgYW5kIHByb21wdGx5IGhhbmRzIHRoZW0gb2ZmIHRvIHNvbWUgd29ya2Vycywgd2hvIHF1aWNrbHkgZXJlY3QgYSBidWlsZGluZyB0aGF0IGdpdmVzIHlvdSBhIG5ldyBidXR0b24gdG8gY2xpY2snKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2ltcHJlc3NpdmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnSW1wcmVzc2l2ZSEnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0c3RhcnRTdXBwbGllc1F1ZXN0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHQvLyBpZiAoISRTTS5nZXQoJ3F1ZXN0LnN1cHBsaWVzJykpIHtcclxuXHRcdC8vIFx0Ly8gMSA9IHN0YXJ0ZWQsIDIgPSBuZXh0IHN0ZXAsIGV0Yy4gdW50aWwgY29tcGxldGVkXHJcblx0XHQvLyBcdCRTTS5zZXQoJ3F1ZXN0LnN1cHBsaWVzJywgMSk7XHJcblx0XHQvLyBcdFJvYWQuaW5pdCgpO1xyXG5cdFx0Ly8gfVxyXG5cdFx0aWYgKENoYXJhY3Rlci5xdWVzdFN0YXR1c1tcIm1heW9yU3VwcGxpZXNcIl0gPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRDaGFyYWN0ZXIuc2V0UXVlc3RTdGF0dXMoXCJtYXlvclN1cHBsaWVzXCIsIDApO1xyXG5cdFx0XHRSb2FkLmluaXQoKTtcclxuXHRcdH1cclxuXHR9XHJcbn0iLCIvLyBAdHMtbm9jaGVja1xyXG5cclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgTm90aWZpY2F0aW9ucyB9IGZyb20gXCIuL25vdGlmaWNhdGlvbnNcIjtcclxuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4vZXZlbnRzXCI7XHJcbmltcG9ydCB7IFZpbGxhZ2UgfSBmcm9tIFwiLi9wbGFjZXMvdmlsbGFnZVwiO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tIFwiLi9wbGF5ZXIvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCB7IFdlYXRoZXIgfSBmcm9tIFwiLi93ZWF0aGVyXCI7XHJcbmltcG9ydCB7IFJvYWQgfSBmcm9tIFwiLi9wbGFjZXMvcm9hZFwiO1xyXG5pbXBvcnQgeyBPdXRwb3N0IH0gZnJvbSBcIi4vcGxhY2VzL291dHBvc3RcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBFbmdpbmUgPSB3aW5kb3cuRW5naW5lID0ge1xyXG5cdFxyXG5cdFNJVEVfVVJMOiBlbmNvZGVVUklDb21wb25lbnQoXCJodHRwczovL2NnaWJicy5naXRodWIuaW8vZGFya3Jvb21fbW9kL2luZGV4Lmh0bWxcIiksXHJcblx0VkVSU0lPTjogMS4zLFxyXG5cdE1BWF9TVE9SRTogOTk5OTk5OTk5OTk5OTksXHJcblx0U0FWRV9ESVNQTEFZOiAzMCAqIDEwMDAsXHJcblx0R0FNRV9PVkVSOiBmYWxzZSxcclxuXHRcclxuXHQvL29iamVjdCBldmVudCB0eXBlc1xyXG5cdHRvcGljczoge30sXHJcblx0XHJcblx0b3B0aW9uczoge1xyXG5cdFx0c3RhdGU6IG51bGwsXHJcblx0XHRkZWJ1ZzogdHJ1ZSxcclxuXHRcdGxvZzogdHJ1ZSxcclxuXHRcdGRyb3Bib3g6IGZhbHNlLFxyXG5cdFx0ZG91YmxlVGltZTogZmFsc2VcclxuXHR9LFxyXG5cclxuXHRfZGVidWc6IGZhbHNlLFxyXG5cdFx0XHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblx0XHR0aGlzLl9kZWJ1ZyA9IHRoaXMub3B0aW9ucy5kZWJ1ZztcclxuXHRcdHRoaXMuX2xvZyA9IHRoaXMub3B0aW9ucy5sb2c7XHJcblx0XHRcclxuXHRcdC8vIENoZWNrIGZvciBIVE1MNSBzdXBwb3J0XHJcblx0XHRpZighRW5naW5lLmJyb3dzZXJWYWxpZCgpKSB7XHJcblx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9ICdicm93c2VyV2FybmluZy5odG1sJztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gQ2hlY2sgZm9yIG1vYmlsZVxyXG5cdFx0Ly8gaWYoRW5naW5lLmlzTW9iaWxlKCkpIHtcclxuXHRcdC8vIFx0d2luZG93LmxvY2F0aW9uID0gJ21vYmlsZVdhcm5pbmcuaHRtbCc7XHJcblx0XHQvLyB9XHJcblxyXG5cdFx0RW5naW5lLmRpc2FibGVTZWxlY3Rpb24oKTtcclxuXHRcdFxyXG5cdFx0aWYodGhpcy5vcHRpb25zLnN0YXRlICE9IG51bGwpIHtcclxuXHRcdFx0d2luZG93LlN0YXRlID0gdGhpcy5vcHRpb25zLnN0YXRlO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0RW5naW5lLmxvYWRHYW1lKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoRW5naW5lLmlzTW9iaWxlKCkpIHtcclxuXHRcdFx0JCgnPGRpdj4nKS50ZXh0KCdXQVJOSU5HOiB0aGlzIG1pZ2h0IGxvb2sgYmFkIG9uIG1vYmlsZS4gSnVzdCBhIGhlYWRzLXVwLicpLmFwcGVuZFRvKCcjbWFpbicpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2xvY2F0aW9uU2xpZGVyJykuYXBwZW5kVG8oJyNtYWluJyk7XHJcblxyXG5cdFx0dmFyIG1lbnUgPSAkKCc8ZGl2PicpXHJcblx0XHRcdC5hZGRDbGFzcygnbWVudScpXHJcblx0XHRcdC5hcHBlbmRUbygnYm9keScpO1xyXG5cclxuXHRcdGlmKHR5cGVvZiBsYW5ncyAhPSAndW5kZWZpbmVkJyl7XHJcblx0XHRcdHZhciBjdXN0b21TZWxlY3QgPSAkKCc8c3Bhbj4nKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnY3VzdG9tU2VsZWN0JylcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHRcdFx0dmFyIHNlbGVjdE9wdGlvbnMgPSAkKCc8c3Bhbj4nKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnY3VzdG9tU2VsZWN0T3B0aW9ucycpXHJcblx0XHRcdFx0LmFwcGVuZFRvKGN1c3RvbVNlbGVjdCk7XHJcblx0XHRcdHZhciBvcHRpb25zTGlzdCA9ICQoJzx1bD4nKVxyXG5cdFx0XHRcdC5hcHBlbmRUbyhzZWxlY3RPcHRpb25zKTtcclxuXHRcdFx0JCgnPGxpPicpXHJcblx0XHRcdFx0LnRleHQoXCJsYW5ndWFnZS5cIilcclxuXHRcdFx0XHQuYXBwZW5kVG8ob3B0aW9uc0xpc3QpO1xyXG5cdFx0XHRcclxuXHRcdFx0JC5lYWNoKGxhbmdzLCBmdW5jdGlvbihuYW1lLGRpc3BsYXkpe1xyXG5cdFx0XHRcdCQoJzxsaT4nKVxyXG5cdFx0XHRcdFx0LnRleHQoZGlzcGxheSlcclxuXHRcdFx0XHRcdC5hdHRyKCdkYXRhLWxhbmd1YWdlJywgbmFtZSlcclxuXHRcdFx0XHRcdC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkgeyBFbmdpbmUuc3dpdGNoTGFuZ3VhZ2UodGhpcyk7IH0pXHJcblx0XHRcdFx0XHQuYXBwZW5kVG8ob3B0aW9uc0xpc3QpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2xpZ2h0c09mZiBtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygnbGlnaHRzIG9mZi4nKSlcclxuXHRcdFx0LmNsaWNrKEVuZ2luZS50dXJuTGlnaHRzT2ZmKVxyXG5cdFx0XHQuYXBwZW5kVG8obWVudSk7XHJcblxyXG5cdFx0JCgnPHNwYW4+JylcclxuXHRcdFx0LmFkZENsYXNzKCdtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygnaHlwZXIuJykpXHJcblx0XHRcdC5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0XHRcdEVuZ2luZS5vcHRpb25zLmRvdWJsZVRpbWUgPSAhRW5naW5lLm9wdGlvbnMuZG91YmxlVGltZTtcclxuXHRcdFx0XHRpZihFbmdpbmUub3B0aW9ucy5kb3VibGVUaW1lKVxyXG5cdFx0XHRcdFx0JCh0aGlzKS50ZXh0KF8oJ2NsYXNzaWMuJykpO1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdCQodGhpcykudGV4dChfKCdoeXBlci4nKSk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHQudGV4dChfKCdyZXN0YXJ0LicpKVxyXG5cdFx0XHQuY2xpY2soRW5naW5lLmNvbmZpcm1EZWxldGUpXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHRcdFxyXG5cdFx0JCgnPHNwYW4+JylcclxuXHRcdFx0LmFkZENsYXNzKCdtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygnc2hhcmUuJykpXHJcblx0XHRcdC5jbGljayhFbmdpbmUuc2hhcmUpXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHQudGV4dChfKCdzYXZlLicpKVxyXG5cdFx0XHQuY2xpY2soRW5naW5lLmV4cG9ydEltcG9ydClcclxuXHRcdFx0LmFwcGVuZFRvKG1lbnUpO1xyXG5cdFxyXG5cdFx0Ly8gc3Vic2NyaWJlIHRvIHN0YXRlVXBkYXRlc1xyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5zdWJzY3JpYmUoRW5naW5lLmhhbmRsZVN0YXRlVXBkYXRlcyk7XHJcblxyXG5cdFx0JFNNLmluaXQoKTtcclxuXHRcdE5vdGlmaWNhdGlvbnMuaW5pdCgpO1xyXG5cdFx0RXZlbnRzLmluaXQoKTtcclxuXHRcdFZpbGxhZ2UuaW5pdCgpO1xyXG5cdFx0Q2hhcmFjdGVyLmluaXQoKTtcclxuXHRcdFdlYXRoZXIuaW5pdCgpO1xyXG5cdFx0aWYoJFNNLmdldCgnUm9hZC5vcGVuJykgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRSb2FkLmluaXQoKTtcclxuXHRcdH1cclxuXHRcdGlmKCRTTS5nZXQoJ091dHBvc3Qub3BlbicpICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0T3V0cG9zdC5pbml0KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0RW5naW5lLnNhdmVMYW5ndWFnZSgpO1xyXG5cdFx0RW5naW5lLnRyYXZlbFRvKFZpbGxhZ2UpO1xyXG5cclxuXHR9LFxyXG5cdFxyXG5cdGJyb3dzZXJWYWxpZDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKCBsb2NhdGlvbi5zZWFyY2guaW5kZXhPZiggJ2lnbm9yZWJyb3dzZXI9dHJ1ZScgKSA+PSAwIHx8ICggdHlwZW9mIFN0b3JhZ2UgIT0gJ3VuZGVmaW5lZCcgJiYgIW9sZElFICkgKTtcclxuXHR9LFxyXG5cdFxyXG5cdGlzTW9iaWxlOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAoIGxvY2F0aW9uLnNlYXJjaC5pbmRleE9mKCAnaWdub3JlYnJvd3Nlcj10cnVlJyApIDwgMCAmJiAvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnkvaS50ZXN0KCBuYXZpZ2F0b3IudXNlckFnZW50ICkgKTtcclxuXHR9LFxyXG5cdFxyXG5cdHNhdmVHYW1lOiBmdW5jdGlvbigpIHtcclxuXHRcdGlmKHR5cGVvZiBTdG9yYWdlICE9ICd1bmRlZmluZWQnICYmIGxvY2FsU3RvcmFnZSkge1xyXG5cdFx0XHRpZihFbmdpbmUuX3NhdmVUaW1lciAhPSBudWxsKSB7XHJcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KEVuZ2luZS5fc2F2ZVRpbWVyKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih0eXBlb2YgRW5naW5lLl9sYXN0Tm90aWZ5ID09ICd1bmRlZmluZWQnIHx8IERhdGUubm93KCkgLSBFbmdpbmUuX2xhc3ROb3RpZnkgPiBFbmdpbmUuU0FWRV9ESVNQTEFZKXtcclxuXHRcdFx0XHQkKCcjc2F2ZU5vdGlmeScpLmNzcygnb3BhY2l0eScsIDEpLmFuaW1hdGUoe29wYWNpdHk6IDB9LCAxMDAwLCAnbGluZWFyJyk7XHJcblx0XHRcdFx0RW5naW5lLl9sYXN0Tm90aWZ5ID0gRGF0ZS5ub3coKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRsb2NhbFN0b3JhZ2UuZ2FtZVN0YXRlID0gSlNPTi5zdHJpbmdpZnkoU3RhdGUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0bG9hZEdhbWU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dmFyIHNhdmVkU3RhdGUgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nYW1lU3RhdGUpO1xyXG5cdFx0XHRpZihzYXZlZFN0YXRlKSB7XHJcblx0XHRcdFx0d2luZG93LlN0YXRlID0gc2F2ZWRTdGF0ZTtcclxuXHRcdFx0XHRFbmdpbmUubG9nKFwibG9hZGVkIHNhdmUhXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGNhdGNoKGUpIHtcclxuXHRcdFx0RW5naW5lLmxvZyhlKTtcclxuXHRcdFx0d2luZG93LlN0YXRlID0ge307XHJcblx0XHRcdCRTTS5zZXQoJ3ZlcnNpb24nLCBFbmdpbmUuVkVSU0lPTik7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRleHBvcnRJbXBvcnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnRXhwb3J0IC8gSW1wb3J0JyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ2V4cG9ydCBvciBpbXBvcnQgc2F2ZSBkYXRhLCBmb3IgYmFja2luZyB1cCcpLFxyXG5cdFx0XHRcdFx0XHRfKCdvciBtaWdyYXRpbmcgY29tcHV0ZXJzJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdleHBvcnQnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnZXhwb3J0JyksXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IEVuZ2luZS5leHBvcnQ2NFxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnaW1wb3J0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2ltcG9ydCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdjb25maXJtJ31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2NhbmNlbCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdjYW5jZWwnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdjb25maXJtJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdhcmUgeW91IHN1cmU/JyksXHJcblx0XHRcdFx0XHRcdF8oJ2lmIHRoZSBjb2RlIGlzIGludmFsaWQsIGFsbCBkYXRhIHdpbGwgYmUgbG9zdC4nKSxcclxuXHRcdFx0XHRcdFx0XygndGhpcyBpcyBpcnJldmVyc2libGUuJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCd5ZXMnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygneWVzJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2lucHV0SW1wb3J0J30sXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IEVuZ2luZS5lbmFibGVTZWxlY3Rpb25cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J25vJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ25vJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnaW5wdXRJbXBvcnQnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXygncHV0IHRoZSBzYXZlIGNvZGUgaGVyZS4nKV0sXHJcblx0XHRcdFx0XHR0ZXh0YXJlYTogJycsXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdva2F5Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2ltcG9ydCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IEVuZ2luZS5pbXBvcnQ2NFxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnY2FuY2VsJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2NhbmNlbCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0Z2VuZXJhdGVFeHBvcnQ2NDogZnVuY3Rpb24oKXtcclxuXHRcdHZhciBzdHJpbmc2NCA9IEJhc2U2NC5lbmNvZGUobG9jYWxTdG9yYWdlLmdhbWVTdGF0ZSk7XHJcblx0XHRzdHJpbmc2NCA9IHN0cmluZzY0LnJlcGxhY2UoL1xccy9nLCAnJyk7XHJcblx0XHRzdHJpbmc2NCA9IHN0cmluZzY0LnJlcGxhY2UoL1xcLi9nLCAnJyk7XHJcblx0XHRzdHJpbmc2NCA9IHN0cmluZzY0LnJlcGxhY2UoL1xcbi9nLCAnJyk7XHJcblxyXG5cdFx0cmV0dXJuIHN0cmluZzY0O1xyXG5cdH0sXHJcblxyXG5cdGV4cG9ydDY0OiBmdW5jdGlvbigpIHtcclxuXHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0dmFyIHN0cmluZzY0ID0gRW5naW5lLmdlbmVyYXRlRXhwb3J0NjQoKTtcclxuXHRcdEVuZ2luZS5lbmFibGVTZWxlY3Rpb24oKTtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ0V4cG9ydCcpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0dGV4dDogW18oJ3NhdmUgdGhpcy4nKV0sXHJcblx0XHRcdFx0XHR0ZXh0YXJlYTogc3RyaW5nNjQsXHJcblx0XHRcdFx0XHRyZWFkb25seTogdHJ1ZSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2RvbmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnZ290IGl0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogRW5naW5lLmRpc2FibGVTZWxlY3Rpb25cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRFbmdpbmUuYXV0b1NlbGVjdCgnI2Rlc2NyaXB0aW9uIHRleHRhcmVhJyk7XHJcblx0fSxcclxuXHJcblx0aW1wb3J0NjQ6IGZ1bmN0aW9uKHN0cmluZzY0KSB7XHJcblx0XHRFbmdpbmUuZGlzYWJsZVNlbGVjdGlvbigpO1xyXG5cdFx0c3RyaW5nNjQgPSBzdHJpbmc2NC5yZXBsYWNlKC9cXHMvZywgJycpO1xyXG5cdFx0c3RyaW5nNjQgPSBzdHJpbmc2NC5yZXBsYWNlKC9cXC4vZywgJycpO1xyXG5cdFx0c3RyaW5nNjQgPSBzdHJpbmc2NC5yZXBsYWNlKC9cXG4vZywgJycpO1xyXG5cdFx0dmFyIGRlY29kZWRTYXZlID0gQmFzZTY0LmRlY29kZShzdHJpbmc2NCk7XHJcblx0XHRsb2NhbFN0b3JhZ2UuZ2FtZVN0YXRlID0gZGVjb2RlZFNhdmU7XHJcblx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcclxuXHR9LFxyXG5cclxuXHRjb25maXJtRGVsZXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ1Jlc3RhcnQ/JyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXygncmVzdGFydCB0aGUgZ2FtZT8nKV0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCd5ZXMnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygneWVzJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogRW5naW5lLmRlbGV0ZVNhdmVcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J25vJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ25vJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRkZWxldGVTYXZlOiBmdW5jdGlvbihub1JlbG9hZCkge1xyXG5cdFx0aWYodHlwZW9mIFN0b3JhZ2UgIT0gJ3VuZGVmaW5lZCcgJiYgbG9jYWxTdG9yYWdlKSB7XHJcblx0XHRcdHdpbmRvdy5TdGF0ZSA9IHt9O1xyXG5cdFx0XHRsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcclxuXHRcdH1cclxuXHRcdGlmKCFub1JlbG9hZCkge1xyXG5cdFx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRzaGFyZTogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdTaGFyZScpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0dGV4dDogW18oJ2JyaW5nIHlvdXIgZnJpZW5kcy4nKV0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdmYWNlYm9vayc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdmYWNlYm9vaycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0d2luZG93Lm9wZW4oJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9zaGFyZXIvc2hhcmVyLnBocD91PScgKyBFbmdpbmUuU0lURV9VUkwsICdzaGFyZXInLCAnd2lkdGg9NjI2LGhlaWdodD00MzYsbG9jYXRpb249bm8sbWVudWJhcj1ubyxyZXNpemFibGU9bm8sc2Nyb2xsYmFycz1ubyxzdGF0dXM9bm8sdG9vbGJhcj1ubycpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2dvb2dsZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0Ol8oJ2dvb2dsZSsnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5vcGVuKCdodHRwczovL3BsdXMuZ29vZ2xlLmNvbS9zaGFyZT91cmw9JyArIEVuZ2luZS5TSVRFX1VSTCwgJ3NoYXJlcicsICd3aWR0aD00ODAsaGVpZ2h0PTQzNixsb2NhdGlvbj1ubyxtZW51YmFyPW5vLHJlc2l6YWJsZT1ubyxzY3JvbGxiYXJzPW5vLHN0YXR1cz1ubyx0b29sYmFyPW5vJyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQndHdpdHRlcic6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCd0d2l0dGVyJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR3aW5kb3cub3BlbignaHR0cHM6Ly90d2l0dGVyLmNvbS9pbnRlbnQvdHdlZXQ/dGV4dD1BJTIwRGFyayUyMFJvb20mdXJsPScgKyBFbmdpbmUuU0lURV9VUkwsICdzaGFyZXInLCAnd2lkdGg9NjYwLGhlaWdodD0yNjAsbG9jYXRpb249bm8sbWVudWJhcj1ubyxyZXNpemFibGU9bm8sc2Nyb2xsYmFycz15ZXMsc3RhdHVzPW5vLHRvb2xiYXI9bm8nKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdyZWRkaXQnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygncmVkZGl0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR3aW5kb3cub3BlbignaHR0cDovL3d3dy5yZWRkaXQuY29tL3N1Ym1pdD91cmw9JyArIEVuZ2luZS5TSVRFX1VSTCwgJ3NoYXJlcicsICd3aWR0aD05NjAsaGVpZ2h0PTcwMCxsb2NhdGlvbj1ubyxtZW51YmFyPW5vLHJlc2l6YWJsZT1ubyxzY3JvbGxiYXJzPXllcyxzdGF0dXM9bm8sdG9vbGJhcj1ubycpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2Nsb3NlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2Nsb3NlJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHR3aWR0aDogJzQwMHB4J1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0ZmluZFN0eWxlc2hlZXQ6IGZ1bmN0aW9uKHRpdGxlKSB7XHJcblx0XHRmb3IodmFyIGk9MDsgaTxkb2N1bWVudC5zdHlsZVNoZWV0cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgc2hlZXQgPSBkb2N1bWVudC5zdHlsZVNoZWV0c1tpXTtcclxuXHRcdFx0aWYoc2hlZXQudGl0bGUgPT0gdGl0bGUpIHtcclxuXHRcdFx0XHRyZXR1cm4gc2hlZXQ7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH0sXHJcblxyXG5cdGlzTGlnaHRzT2ZmOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBkYXJrQ3NzID0gRW5naW5lLmZpbmRTdHlsZXNoZWV0KCdkYXJrZW5MaWdodHMnKTtcclxuXHRcdGlmICggZGFya0NzcyAhPSBudWxsICYmICFkYXJrQ3NzLmRpc2FibGVkICkge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cclxuXHR0dXJuTGlnaHRzT2ZmOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBkYXJrQ3NzID0gRW5naW5lLmZpbmRTdHlsZXNoZWV0KCdkYXJrZW5MaWdodHMnKTtcclxuXHRcdGlmIChkYXJrQ3NzID09IG51bGwpIHtcclxuXHRcdFx0JCgnaGVhZCcpLmFwcGVuZCgnPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCJjc3MvZGFyay5jc3NcIiB0eXBlPVwidGV4dC9jc3NcIiB0aXRsZT1cImRhcmtlbkxpZ2h0c1wiIC8+Jyk7XHJcblx0XHRcdCQoJy5saWdodHNPZmYnKS50ZXh0KF8oJ2xpZ2h0cyBvbi4nKSk7XHJcblx0XHR9IGVsc2UgaWYgKGRhcmtDc3MuZGlzYWJsZWQpIHtcclxuXHRcdFx0ZGFya0Nzcy5kaXNhYmxlZCA9IGZhbHNlO1xyXG5cdFx0XHQkKCcubGlnaHRzT2ZmJykudGV4dChfKCdsaWdodHMgb24uJykpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JChcIiNkYXJrZW5MaWdodHNcIikuYXR0cihcImRpc2FibGVkXCIsIFwiZGlzYWJsZWRcIik7XHJcblx0XHRcdGRhcmtDc3MuZGlzYWJsZWQgPSB0cnVlO1xyXG5cdFx0XHQkKCcubGlnaHRzT2ZmJykudGV4dChfKCdsaWdodHMgb2ZmLicpKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHQvLyBHZXRzIGEgZ3VpZFxyXG5cdGdldEd1aWQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24oYykge1xyXG5cdFx0XHR2YXIgciA9IE1hdGgucmFuZG9tKCkqMTZ8MCwgdiA9IGMgPT0gJ3gnID8gciA6IChyJjB4M3wweDgpO1xyXG5cdFx0XHRyZXR1cm4gdi50b1N0cmluZygxNik7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRhY3RpdmVNb2R1bGU6IG51bGwsXHJcblxyXG5cdHRyYXZlbFRvOiBmdW5jdGlvbihtb2R1bGUpIHtcclxuXHRcdGlmKEVuZ2luZS5hY3RpdmVNb2R1bGUgIT0gbW9kdWxlKSB7XHJcblx0XHRcdHZhciBjdXJyZW50SW5kZXggPSBFbmdpbmUuYWN0aXZlTW9kdWxlID8gJCgnLmxvY2F0aW9uJykuaW5kZXgoRW5naW5lLmFjdGl2ZU1vZHVsZS5wYW5lbCkgOiAxO1xyXG5cdFx0XHQkKCdkaXYuaGVhZGVyQnV0dG9uJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcblx0XHRcdG1vZHVsZS50YWIuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcblxyXG5cdFx0XHR2YXIgc2xpZGVyID0gJCgnI2xvY2F0aW9uU2xpZGVyJyk7XHJcblx0XHRcdHZhciBzdG9yZXMgPSAkKCcjc3RvcmVzQ29udGFpbmVyJyk7XHJcblx0XHRcdHZhciBwYW5lbEluZGV4ID0gJCgnLmxvY2F0aW9uJykuaW5kZXgobW9kdWxlLnBhbmVsKTtcclxuXHRcdFx0dmFyIGRpZmYgPSBNYXRoLmFicyhwYW5lbEluZGV4IC0gY3VycmVudEluZGV4KTtcclxuXHRcdFx0c2xpZGVyLmFuaW1hdGUoe2xlZnQ6IC0ocGFuZWxJbmRleCAqIDcwMCkgKyAncHgnfSwgMzAwICogZGlmZik7XHJcblxyXG5cdFx0XHRpZigkU00uZ2V0KCdzdG9yZXMud29vZCcpICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0Ly8gRklYTUUgV2h5IGRvZXMgdGhpcyB3b3JrIGlmIHRoZXJlJ3MgYW4gYW5pbWF0aW9uIHF1ZXVlLi4uP1xyXG5cdFx0XHRcdHN0b3Jlcy5hbmltYXRlKHtyaWdodDogLShwYW5lbEluZGV4ICogNzAwKSArICdweCd9LCAzMDAgKiBkaWZmKTtcclxuXHRcdFx0fVxyXG5cdFx0XHJcblx0XHRcdEVuZ2luZS5hY3RpdmVNb2R1bGUgPSBtb2R1bGU7XHJcblxyXG5cdFx0XHRtb2R1bGUub25BcnJpdmFsKGRpZmYpO1xyXG5cclxuXHRcdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSBWaWxsYWdlXHJcblx0XHRcdFx0Ly8gIHx8IEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gUGF0aFxyXG5cdFx0XHRcdCkge1xyXG5cdFx0XHRcdC8vIERvbid0IGZhZGUgb3V0IHRoZSB3ZWFwb25zIGlmIHdlJ3JlIHN3aXRjaGluZyB0byBhIG1vZHVsZVxyXG5cdFx0XHRcdC8vIHdoZXJlIHdlJ3JlIGdvaW5nIHRvIGtlZXAgc2hvd2luZyB0aGVtIGFueXdheS5cclxuXHRcdFx0XHRpZiAobW9kdWxlICE9IFZpbGxhZ2UgXHJcblx0XHRcdFx0XHQvLyAmJiBtb2R1bGUgIT0gUGF0aFxyXG5cdFx0XHRcdCkge1xyXG5cdFx0XHRcdFx0JCgnZGl2I3dlYXBvbnMnKS5hbmltYXRlKHtvcGFjaXR5OiAwfSwgMzAwKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKG1vZHVsZSA9PSBWaWxsYWdlXHJcblx0XHRcdFx0Ly8gIHx8IG1vZHVsZSA9PSBQYXRoXHJcblx0XHRcdFx0KSB7XHJcblx0XHRcdFx0JCgnZGl2I3dlYXBvbnMnKS5hbmltYXRlKHtvcGFjaXR5OiAxfSwgMzAwKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Tm90aWZpY2F0aW9ucy5wcmludFF1ZXVlKG1vZHVsZSk7XHJcblx0XHRcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRsb2c6IGZ1bmN0aW9uKG1zZykge1xyXG5cdFx0aWYodGhpcy5fbG9nKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKG1zZyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0dXBkYXRlU2xpZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBzbGlkZXIgPSAkKCcjbG9jYXRpb25TbGlkZXInKTtcclxuXHRcdHNsaWRlci53aWR0aCgoc2xpZGVyLmNoaWxkcmVuKCkubGVuZ3RoICogNzAwKSArICdweCcpO1xyXG5cdH0sXHJcblxyXG5cdHVwZGF0ZU91dGVyU2xpZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBzbGlkZXIgPSAkKCcjb3V0ZXJTbGlkZXInKTtcclxuXHRcdHNsaWRlci53aWR0aCgoc2xpZGVyLmNoaWxkcmVuKCkubGVuZ3RoICogNzAwKSArICdweCcpO1xyXG5cdH0sXHJcblxyXG5cdGRpc2FibGVTZWxlY3Rpb246IGZ1bmN0aW9uKCkge1xyXG5cdFx0ZG9jdW1lbnQub25zZWxlY3RzdGFydCA9IGV2ZW50TnVsbGlmaWVyOyAvLyB0aGlzIGlzIGZvciBJRVxyXG5cdFx0ZG9jdW1lbnQub25tb3VzZWRvd24gPSBldmVudE51bGxpZmllcjsgLy8gdGhpcyBpcyBmb3IgdGhlIHJlc3RcclxuXHR9LFxyXG5cclxuXHRlbmFibGVTZWxlY3Rpb246IGZ1bmN0aW9uKCkge1xyXG5cdFx0ZG9jdW1lbnQub25zZWxlY3RzdGFydCA9IGV2ZW50UGFzc3Rocm91Z2g7XHJcblx0XHRkb2N1bWVudC5vbm1vdXNlZG93biA9IGV2ZW50UGFzc3Rocm91Z2g7XHJcblx0fSxcclxuXHJcblx0YXV0b1NlbGVjdDogZnVuY3Rpb24oc2VsZWN0b3IpIHtcclxuXHRcdCQoc2VsZWN0b3IpLmZvY3VzKCkuc2VsZWN0KCk7XHJcblx0fSxcclxuXHJcblx0aGFuZGxlU3RhdGVVcGRhdGVzOiBmdW5jdGlvbihlKXtcclxuXHRcclxuXHR9LFxyXG5cclxuXHRzd2l0Y2hMYW5ndWFnZTogZnVuY3Rpb24oZG9tKXtcclxuXHRcdHZhciBsYW5nID0gJChkb20pLmRhdGEoXCJsYW5ndWFnZVwiKTtcclxuXHRcdGlmKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYuc2VhcmNoKC9bXFw/XFwmXWxhbmc9W2Etel9dKy8pICE9IC0xKXtcclxuXHRcdFx0ZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IGRvY3VtZW50LmxvY2F0aW9uLmhyZWYucmVwbGFjZSggLyhbXFw/XFwmXWxhbmc9KShbYS16X10rKS9naSAsIFwiJDFcIitsYW5nICk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0ZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgKyAoIChkb2N1bWVudC5sb2NhdGlvbi5ocmVmLnNlYXJjaCgvXFw/LykgIT0gLTEgKT9cIiZcIjpcIj9cIikgKyBcImxhbmc9XCIrbGFuZztcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRzYXZlTGFuZ3VhZ2U6IGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgbGFuZyA9IGRlY29kZVVSSUNvbXBvbmVudCgobmV3IFJlZ0V4cCgnWz98Jl1sYW5nPScgKyAnKFteJjtdKz8pKCZ8I3w7fCQpJykuZXhlYyhsb2NhdGlvbi5zZWFyY2gpfHxbLFwiXCJdKVsxXS5yZXBsYWNlKC9cXCsvZywgJyUyMCcpKXx8bnVsbDtcdFxyXG5cdFx0aWYobGFuZyAmJiB0eXBlb2YgU3RvcmFnZSAhPSAndW5kZWZpbmVkJyAmJiBsb2NhbFN0b3JhZ2UpIHtcclxuXHRcdFx0bG9jYWxTdG9yYWdlLmxhbmcgPSBsYW5nO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHNldFRpbWVvdXQ6IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aW1lb3V0LCBza2lwRG91YmxlPyl7XHJcblxyXG5cdFx0aWYoIEVuZ2luZS5vcHRpb25zLmRvdWJsZVRpbWUgJiYgIXNraXBEb3VibGUgKXtcclxuXHRcdFx0RW5naW5lLmxvZygnRG91YmxlIHRpbWUsIGN1dHRpbmcgdGltZW91dCBpbiBoYWxmJyk7XHJcblx0XHRcdHRpbWVvdXQgLz0gMjtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gc2V0VGltZW91dChjYWxsYmFjaywgdGltZW91dCk7XHJcblxyXG5cdH1cclxuXHJcbn07XHJcblxyXG5mdW5jdGlvbiBldmVudE51bGxpZmllcihlKSB7XHJcblx0cmV0dXJuICQoZS50YXJnZXQpLmhhc0NsYXNzKCdtZW51QnRuJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGV2ZW50UGFzc3Rocm91Z2goZSkge1xyXG5cdHJldHVybiB0cnVlO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gaW5WaWV3KGRpciwgZWxlbSl7XHJcblxyXG4gICAgICAgIHZhciBzY1RvcCA9ICQoJyNtYWluJykub2Zmc2V0KCkudG9wO1xyXG4gICAgICAgIHZhciBzY0JvdCA9IHNjVG9wICsgJCgnI21haW4nKS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgdmFyIGVsVG9wID0gZWxlbS5vZmZzZXQoKS50b3A7XHJcbiAgICAgICAgdmFyIGVsQm90ID0gZWxUb3AgKyBlbGVtLmhlaWdodCgpO1xyXG5cclxuICAgICAgICBpZiggZGlyID09ICd1cCcgKXtcclxuICAgICAgICAgICAgICAgIC8vIFNUT1AgTU9WSU5HIElGIEJPVFRPTSBPRiBFTEVNRU5UIElTIFZJU0lCTEUgSU4gU0NSRUVOXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKCBlbEJvdCA8IHNjQm90ICk7XHJcbiAgICAgICAgfWVsc2UgaWYoIGRpciA9PSAnZG93bicgKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoIGVsVG9wID4gc2NUb3AgKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoICggZWxCb3QgPD0gc2NCb3QgKSAmJiAoIGVsVG9wID49IHNjVG9wICkgKTtcclxuICAgICAgICB9XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBzY3JvbGxCeVgoZWxlbSwgeCl7XHJcblxyXG4gICAgICAgIHZhciBlbFRvcCA9IHBhcnNlSW50KCBlbGVtLmNzcygndG9wJyksIDEwICk7XHJcbiAgICAgICAgZWxlbS5jc3MoICd0b3AnLCAoIGVsVG9wICsgeCApICsgXCJweFwiICk7XHJcblxyXG59XHJcblxyXG5cclxuLy9jcmVhdGUgalF1ZXJ5IENhbGxiYWNrcygpIHRvIGhhbmRsZSBvYmplY3QgZXZlbnRzIFxyXG4kLkRpc3BhdGNoID0gZnVuY3Rpb24oIGlkICkge1xyXG5cdHZhciBjYWxsYmFja3MsIHRvcGljID0gaWQgJiYgRW5naW5lLnRvcGljc1sgaWQgXTtcclxuXHRpZiAoICF0b3BpYyApIHtcclxuXHRcdGNhbGxiYWNrcyA9IGpRdWVyeS5DYWxsYmFja3MoKTtcclxuXHRcdHRvcGljID0ge1xyXG5cdFx0XHRcdHB1Ymxpc2g6IGNhbGxiYWNrcy5maXJlLFxyXG5cdFx0XHRcdHN1YnNjcmliZTogY2FsbGJhY2tzLmFkZCxcclxuXHRcdFx0XHR1bnN1YnNjcmliZTogY2FsbGJhY2tzLnJlbW92ZVxyXG5cdFx0fTtcclxuXHRcdGlmICggaWQgKSB7XHJcblx0XHRcdEVuZ2luZS50b3BpY3NbIGlkIF0gPSB0b3BpYztcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIHRvcGljO1xyXG59O1xyXG5cclxuJChmdW5jdGlvbigpIHtcclxuXHRFbmdpbmUuaW5pdCgpO1xyXG59KTtcclxuXHJcbiIsIi8qKlxyXG4gKiBNb2R1bGUgdGhhdCBoYW5kbGVzIHRoZSByYW5kb20gZXZlbnQgc3lzdGVtXHJcbiAqL1xyXG5pbXBvcnQgeyBFdmVudHNSb2FkV2FuZGVyIH0gZnJvbSBcIi4vZXZlbnRzL3JvYWR3YW5kZXJcIjtcclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4vZW5naW5lXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tIFwiLi9ub3RpZmljYXRpb25zXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuL0J1dHRvblwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBRFJFdmVudCB7XHJcblx0dGl0bGU6IHN0cmluZyxcclxuXHRpc0F2YWlsYWJsZT86IEZ1bmN0aW9uLFxyXG5cdGlzU3VwZXJMaWtlbHk/OiBGdW5jdGlvbixcclxuXHRzY2VuZXM6IHtcclxuXHRcdC8vIHR5cGUgdGhpcyBvdXQgYmV0dGVyIHVzaW5nIEluZGV4IFNpZ25hdHVyZXNcclxuXHRcdFtpZDogc3RyaW5nXTogU2NlbmVcclxuXHR9LFxyXG5cdGV2ZW50UGFuZWw/OiBhbnlcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTY2VuZSB7XHJcblx0c2VlbkZsYWc/OiBGdW5jdGlvbixcclxuXHRuZXh0U2NlbmU/OiBzdHJpbmcsXHJcblx0b25Mb2FkPzogRnVuY3Rpb24sXHJcblx0dGV4dDogQXJyYXk8c3RyaW5nPiB8IEZ1bmN0aW9uLFxyXG5cdHJld2FyZD86IGFueSxcclxuXHRub3RpZmljYXRpb24/OiBzdHJpbmcsXHJcblx0Ymxpbms/OiBib29sZWFuLFxyXG5cdGRpY2U/OiB7XHJcblx0XHRhbW91bnQ6IG51bWJlcixcclxuXHRcdGRpZUZhY2VzPzogeyBbaWQ6IG51bWJlcl06IHN0cmluZyB9XHJcblx0XHQvLyBkbyBnYW1lIGVuZ2luZSBzdHVmZiwgdGhlbiByZXR1cm4gdGV4dCBkZXNjcmlwdGlvblxyXG5cdFx0aGFuZGxlcjogKHZhbHMpID0+IEFycmF5PHN0cmluZz5cclxuXHR9LFxyXG5cdGJ1dHRvbnM6IHtcclxuXHRcdFtpZDogc3RyaW5nXTogRXZlbnRCdXR0b25cclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRCdXR0b24ge1xyXG5cdHRleHQ6IHN0cmluZyB8IEZ1bmN0aW9uLFxyXG5cdG5leHRTY2VuZToge1xyXG5cdFx0W2lkOiBudW1iZXJdOiBzdHJpbmdcclxuXHR9LFxyXG5cdGF2YWlsYWJsZT86IEZ1bmN0aW9uLFxyXG5cdHZpc2libGU/OiBGdW5jdGlvbixcclxuXHRyZXdhcmQ/OiBhbnksXHJcblx0Y29zdD86IGFueSxcclxuXHRub3RpZmljYXRpb24/OiBzdHJpbmcsXHJcblx0b25DaG9vc2U/OiBGdW5jdGlvblxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgRXZlbnRzID0ge1xyXG5cdFx0XHJcblx0X0VWRU5UX1RJTUVfUkFOR0U6IFszLCA2XSwgLy8gcmFuZ2UsIGluIG1pbnV0ZXNcclxuXHRfUEFORUxfRkFERTogMjAwLFxyXG5cdEJMSU5LX0lOVEVSVkFMOiBmYWxzZSxcclxuXHJcblx0RXZlbnRQb29sOiA8YW55PltdLFxyXG5cdGV2ZW50U3RhY2s6IDxhbnk+W10sXHJcblx0X2V2ZW50VGltZW91dDogMCxcclxuXHJcblx0TG9jYXRpb25zOiB7fSxcclxuXHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblx0XHRcclxuXHRcdC8vIEJ1aWxkIHRoZSBFdmVudCBQb29sXHJcblx0XHRFdmVudHMuRXZlbnRQb29sID0gW10uY29uY2F0KFxyXG5cdFx0XHRFdmVudHNSb2FkV2FuZGVyIGFzIGFueVxyXG5cdFx0KTtcclxuXHJcblx0XHR0aGlzLkxvY2F0aW9uc1tcIlJvYWRXYW5kZXJcIl0gPSBFdmVudHNSb2FkV2FuZGVyO1xyXG5cdFx0XHJcblx0XHRFdmVudHMuZXZlbnRTdGFjayA9IFtdO1xyXG5cdFx0XHJcblx0XHQvL3N1YnNjcmliZSB0byBzdGF0ZVVwZGF0ZXNcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdCQuRGlzcGF0Y2goJ3N0YXRlVXBkYXRlJykuc3Vic2NyaWJlKEV2ZW50cy5oYW5kbGVTdGF0ZVVwZGF0ZXMpO1xyXG5cdH0sXHJcblx0XHJcblx0b3B0aW9uczoge30sIC8vIE5vdGhpbmcgZm9yIG5vd1xyXG4gICAgXHJcblx0YWN0aXZlU2NlbmU6ICcnLFxyXG4gICAgXHJcblx0bG9hZFNjZW5lOiBmdW5jdGlvbihuYW1lKSB7XHJcblx0XHRFbmdpbmUubG9nKCdsb2FkaW5nIHNjZW5lOiAnICsgbmFtZSk7XHJcblx0XHRFdmVudHMuYWN0aXZlU2NlbmUgPSBuYW1lO1xyXG5cdFx0dmFyIHNjZW5lID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnNjZW5lc1tuYW1lXTtcclxuXHRcdFxyXG5cdFx0Ly8gaGFuZGxlcyBvbmUtdGltZSBzY2VuZXMsIHN1Y2ggYXMgaW50cm9kdWN0aW9uc1xyXG5cdFx0Ly8gbWF5YmUgSSBjYW4gbWFrZSBhIG1vcmUgZXhwbGljaXQgXCJpbnRyb2R1Y3Rpb25cIiBsb2dpY2FsIGZsb3cgdG8gbWFrZSB0aGlzXHJcblx0XHQvLyBhIGxpdHRsZSBtb3JlIGVsZWdhbnQsIGdpdmVuIHRoYXQgdGhlcmUgd2lsbCBhbHdheXMgYmUgYW4gXCJpbnRyb2R1Y3Rpb25cIiBzY2VuZVxyXG5cdFx0Ly8gdGhhdCdzIG9ubHkgbWVhbnQgdG8gYmUgcnVuIGEgc2luZ2xlIHRpbWUuXHJcblx0XHRpZiAoc2NlbmUuc2VlbkZsYWcgJiYgc2NlbmUuc2VlbkZsYWcoKSkge1xyXG5cdFx0XHRFdmVudHMubG9hZFNjZW5lKHNjZW5lLm5leHRTY2VuZSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNjZW5lIHJld2FyZFxyXG5cdFx0aWYoc2NlbmUucmV3YXJkKSB7XHJcblx0XHRcdCRTTS5hZGRNKCdzdG9yZXMnLCBzY2VuZS5yZXdhcmQpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBvbkxvYWRcclxuXHRcdGlmKHNjZW5lLm9uTG9hZCkge1xyXG5cdFx0XHRzY2VuZS5vbkxvYWQoKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gTm90aWZ5IHRoZSBzY2VuZSBjaGFuZ2VcclxuXHRcdGlmKHNjZW5lLm5vdGlmaWNhdGlvbikge1xyXG5cdFx0XHROb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBzY2VuZS5ub3RpZmljYXRpb24pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQkKCcjZGVzY3JpcHRpb24nLCBFdmVudHMuZXZlbnRQYW5lbCgpKS5lbXB0eSgpO1xyXG5cdFx0JCgnI2J1dHRvbnMnLCBFdmVudHMuZXZlbnRQYW5lbCgpKS5lbXB0eSgpO1xyXG5cdFx0RXZlbnRzLnN0YXJ0U3Rvcnkoc2NlbmUpO1xyXG5cdH0sXHJcblx0XHJcblx0ZHJhd0Zsb2F0VGV4dDogZnVuY3Rpb24odGV4dCwgcGFyZW50KSB7XHJcblx0XHQkKCc8ZGl2PicpLnRleHQodGV4dCkuYWRkQ2xhc3MoJ2RhbWFnZVRleHQnKS5hcHBlbmRUbyhwYXJlbnQpLmFuaW1hdGUoe1xyXG5cdFx0XHQnYm90dG9tJzogJzUwcHgnLFxyXG5cdFx0XHQnb3BhY2l0eSc6ICcwJ1xyXG5cdFx0fSxcclxuXHRcdDMwMCxcclxuXHRcdCdsaW5lYXInLFxyXG5cdFx0ZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlKCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHQvLyBmb3IgZGljZSBzdHVmZlxyXG5cdGdldFJhbmRvbUludDpmdW5jdGlvbiAobWF4KSB7XHJcbiAgXHRcdHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xyXG5cdH0sXHJcblx0XHJcblx0c3RhcnRTdG9yeTogZnVuY3Rpb24oc2NlbmUpIHtcclxuXHRcdC8vIFdyaXRlIHRoZSB0ZXh0XHJcblx0XHR2YXIgZGVzYyA9ICQoJyNkZXNjcmlwdGlvbicsIEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0dmFyIHRleHRCbG9jayA9IFtdO1xyXG5cdFx0aWYgKHR5cGVvZihzY2VuZS50ZXh0KSA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdHRleHRCbG9jayA9IHNjZW5lLnRleHQoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRleHRCbG9jayA9IHNjZW5lLnRleHQ7XHJcblx0XHR9XHJcblx0XHRmb3IodmFyIGkgaW4gdGV4dEJsb2NrKSB7XHJcblx0XHRcdCQoJzxkaXY+JykudGV4dCh0ZXh0QmxvY2tbaV0pLmFwcGVuZFRvKGRlc2MpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRoaXMgZGljZSBzdHVmZiBjb3VsZCBtYXliZSBiZSBleHRyYWN0ZWQgdG8gaXRzIG93biBmdW5jdGlvbixcclxuXHRcdC8vIGJ1dCBhbHNvIHdlIG1pZ2h0IGp1c3QgbWFrZSBpdCB3YXkgbW9yZSBnZW5lcmljIHNvIHlvdSBjYW5cclxuXHRcdC8vIHRocm93IEFOWVRISU5HIGluIHRoZSBFdmVudCBkZXNjcmlwdGlvbiBkeW5hbWljYWxseVxyXG5cdFx0Y29uc3QgZGljZVZhbHMgPSBbXTtcclxuXHRcdGlmIChzY2VuZS5kaWNlICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IHNjZW5lLmRpY2UuYW1vdW50OyBqKyspIHtcclxuXHRcdFx0XHR2YXIgZGllVmFsID0gdGhpcy5nZXRSYW5kb21JbnQoNikgKyAxO1xyXG5cdFx0XHRcdGRpY2VWYWxzLnB1c2goZGllVmFsKTtcclxuXHRcdFx0XHRpZiAoc2NlbmUuZGljZS5kaWVGYWNlcyAmJiBzY2VuZS5kaWNlLmRpZUZhY2VzW2RpZVZhbF0gIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdFx0ZGllVmFsID0gc2NlbmUuZGljZS5kaWVGYWNlc1tkaWVWYWxdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjb25zdCB0aWx0VmFsID0gdGhpcy5nZXRSYW5kb21JbnQoOTApIC0gNDU7XHJcblx0XHRcdFx0Y29uc3QgbWFyZ2luVmFsID0gKHRoaXMuZ2V0UmFuZG9tSW50KDQpICsgMikgKiA1O1xyXG5cdFx0XHRcdGRlc2MuYXBwZW5kKFxyXG5cdFx0XHRcdFx0JCgnPGltZz4nLHtpZDonZGllJyArIGRpZVZhbC50b1N0cmluZygpICxzcmM6J2Fzc2V0cy9kaWUvZGllJyArIGRpZVZhbC50b1N0cmluZygpICsgJy5wbmcnfSlcclxuXHRcdFx0XHRcdC5jc3MoJ3dpZHRoJywgJzUlJylcclxuXHRcdFx0XHRcdC5jc3MoJ2hlaWdodCcsICdhdXRvJylcclxuXHRcdFx0XHRcdC5jc3Moe1xyXG5cdFx0XHRcdFx0XHRcIi13ZWJraXQtdHJhbnNmb3JtXCI6IFwicm90YXRlKFwiICsgdGlsdFZhbC50b1N0cmluZygpICsgXCJkZWcpXCIsXHJcblx0XHRcdFx0XHRcdFwiLW1vei10cmFuc2Zvcm1cIjogXCJyb3RhdGUoXCIgKyB0aWx0VmFsLnRvU3RyaW5nKCkgKyBcImRlZylcIixcclxuXHRcdFx0XHRcdFx0XCJ0cmFuc2Zvcm1cIjogXCJyb3RhdGUoXCIgKyB0aWx0VmFsLnRvU3RyaW5nKCkgKyBcImRlZylcIlxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHQuY3NzKCdtYXJnaW4tcmlnaHQnLCBtYXJnaW5WYWwudG9TdHJpbmcoKSArICdweCcpXHJcblx0XHRcdFx0XHQuY3NzKCdtYXJnaW4tYm90dG9tJywgJzIwcHgnKVxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IHRleHRWYWxzOiBBcnJheTxzdHJpbmc+ID0gc2NlbmUuZGljZS5oYW5kbGVyKGRpY2VWYWxzKTtcclxuXHRcdFx0Zm9yIChjb25zdCB0ZXh0IGluIHRleHRWYWxzKSB7XHJcblx0XHRcdFx0JCgnPGRpdj4nKS50ZXh0KHRleHRWYWxzW3RleHRdKS5hcHBlbmRUbyhkZXNjKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZihzY2VuZS50ZXh0YXJlYSAhPSBudWxsKSB7XHJcblx0XHRcdHZhciB0YSA9ICQoJzx0ZXh0YXJlYT4nKS52YWwoc2NlbmUudGV4dGFyZWEpLmFwcGVuZFRvKGRlc2MpO1xyXG5cdFx0XHRpZihzY2VuZS5yZWFkb25seSkge1xyXG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdFx0XHR0YS5hdHRyKCdyZWFkb25seScsIHRydWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIERyYXcgdGhlIGJ1dHRvbnNcclxuXHRcdEV2ZW50cy5kcmF3QnV0dG9ucyhzY2VuZSk7XHJcblx0fSxcclxuXHRcclxuXHRkcmF3QnV0dG9uczogZnVuY3Rpb24oc2NlbmUpIHtcclxuXHRcdHZhciBidG5zID0gJCgnI2J1dHRvbnMnLCBFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdGZvcih2YXIgaWQgaW4gc2NlbmUuYnV0dG9ucykge1xyXG5cdFx0XHR2YXIgaW5mbyA9IHNjZW5lLmJ1dHRvbnNbaWRdO1xyXG5cdFx0XHR2YXIgdGV4dCA9ICcnO1xyXG5cdFx0XHRpZiAodHlwZW9mKGluZm8udGV4dCkgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRcdHRleHQgPSBpbmZvLnRleHQoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0ZXh0ID0gaW5mby50ZXh0O1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBiID0gQnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdFx0aWQ6IGlkLFxyXG5cdFx0XHRcdHRleHQ6IHRleHQsXHJcblx0XHRcdFx0Y29zdDogaW5mby5jb3N0LFxyXG5cdFx0XHRcdGNsaWNrOiBFdmVudHMuYnV0dG9uQ2xpY2ssXHJcblx0XHRcdFx0Y29vbGRvd246IGluZm8uY29vbGRvd24sXHJcblx0XHRcdFx0aW1hZ2U6IGluZm8uaW1hZ2VcclxuXHRcdFx0fSkuYXBwZW5kVG8oYnRucyk7XHJcblx0XHRcdGlmKHR5cGVvZiBpbmZvLmF2YWlsYWJsZSA9PSAnZnVuY3Rpb24nICYmICFpbmZvLmF2YWlsYWJsZSgpKSB7XHJcblx0XHRcdFx0QnV0dG9uLnNldERpc2FibGVkKGIsIHRydWUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHR5cGVvZiBpbmZvLnZpc2libGUgPT0gJ2Z1bmN0aW9uJyAmJiAhaW5mby52aXNpYmxlKCkpIHtcclxuXHRcdFx0XHRiLmhpZGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih0eXBlb2YgaW5mby5jb29sZG93biA9PSAnbnVtYmVyJykge1xyXG5cdFx0XHRcdEJ1dHRvbi5jb29sZG93bihiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRFdmVudHMudXBkYXRlQnV0dG9ucygpO1xyXG5cdH0sXHJcblx0XHJcblx0dXBkYXRlQnV0dG9uczogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgYnRucyA9IEV2ZW50cy5hY3RpdmVFdmVudCgpPy5zY2VuZXNbRXZlbnRzLmFjdGl2ZVNjZW5lXS5idXR0b25zO1xyXG5cdFx0Zm9yKHZhciBiSWQgaW4gYnRucykge1xyXG5cdFx0XHR2YXIgYiA9IGJ0bnNbYklkXTtcclxuXHRcdFx0dmFyIGJ0bkVsID0gJCgnIycrYklkLCBFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdFx0aWYodHlwZW9mIGIuYXZhaWxhYmxlID09ICdmdW5jdGlvbicgJiYgIWIuYXZhaWxhYmxlKCkpIHtcclxuXHRcdFx0XHRCdXR0b24uc2V0RGlzYWJsZWQoYnRuRWwsIHRydWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRidXR0b25DbGljazogZnVuY3Rpb24oYnRuKSB7XHJcblx0XHR2YXIgaW5mbyA9IEV2ZW50cy5hY3RpdmVFdmVudCgpPy5zY2VuZXNbRXZlbnRzLmFjdGl2ZVNjZW5lXS5idXR0b25zW2J0bi5hdHRyKCdpZCcpXTtcclxuXHJcblx0XHRpZih0eXBlb2YgaW5mby5vbkNob29zZSA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdHZhciB0ZXh0YXJlYSA9IEV2ZW50cy5ldmVudFBhbmVsKCkuZmluZCgndGV4dGFyZWEnKTtcclxuXHRcdFx0aW5mby5vbkNob29zZSh0ZXh0YXJlYS5sZW5ndGggPiAwID8gdGV4dGFyZWEudmFsKCkgOiBudWxsKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gUmV3YXJkXHJcblx0XHRpZihpbmZvLnJld2FyZCkge1xyXG5cdFx0XHQkU00uYWRkTSgnc3RvcmVzJywgaW5mby5yZXdhcmQpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRFdmVudHMudXBkYXRlQnV0dG9ucygpO1xyXG5cdFx0XHJcblx0XHQvLyBOb3RpZmljYXRpb25cclxuXHRcdGlmKGluZm8ubm90aWZpY2F0aW9uKSB7XHJcblx0XHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIGluZm8ubm90aWZpY2F0aW9uKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gTmV4dCBTY2VuZVxyXG5cdFx0aWYoaW5mby5uZXh0U2NlbmUpIHtcclxuXHRcdFx0aWYoaW5mby5uZXh0U2NlbmUgPT0gJ2VuZCcpIHtcclxuXHRcdFx0XHRFdmVudHMuZW5kRXZlbnQoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR2YXIgciA9IE1hdGgucmFuZG9tKCk7XHJcblx0XHRcdFx0dmFyIGxvd2VzdE1hdGNoOiBudWxsIHwgc3RyaW5nID0gbnVsbDtcclxuXHRcdFx0XHRmb3IodmFyIGkgaW4gaW5mby5uZXh0U2NlbmUpIHtcclxuXHRcdFx0XHRcdGlmKHIgPCAoaSBhcyB1bmtub3duIGFzIG51bWJlcikgJiYgKGxvd2VzdE1hdGNoID09IG51bGwgfHwgaSA8IGxvd2VzdE1hdGNoKSkge1xyXG5cdFx0XHRcdFx0XHRsb3dlc3RNYXRjaCA9IGk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGxvd2VzdE1hdGNoICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdEV2ZW50cy5sb2FkU2NlbmUoaW5mby5uZXh0U2NlbmVbbG93ZXN0TWF0Y2hdKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0RW5naW5lLmxvZygnRVJST1I6IG5vIHN1aXRhYmxlIHNjZW5lIGZvdW5kJyk7XHJcblx0XHRcdFx0RXZlbnRzLmVuZEV2ZW50KCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHQvLyBibGlua3MgdGhlIGJyb3dzZXIgd2luZG93IHRpdGxlXHJcblx0YmxpbmtUaXRsZTogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdGl0bGUgPSBkb2N1bWVudC50aXRsZTtcclxuXHJcblx0XHQvLyBldmVyeSAzIHNlY29uZHMgY2hhbmdlIHRpdGxlIHRvICcqKiogRVZFTlQgKioqJywgdGhlbiAxLjUgc2Vjb25kcyBsYXRlciwgY2hhbmdlIGl0IGJhY2sgdG8gdGhlIG9yaWdpbmFsIHRpdGxlLlxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0RXZlbnRzLkJMSU5LX0lOVEVSVkFMID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdGRvY3VtZW50LnRpdGxlID0gXygnKioqIEVWRU5UICoqKicpO1xyXG5cdFx0XHRFbmdpbmUuc2V0VGltZW91dChmdW5jdGlvbigpIHtkb2N1bWVudC50aXRsZSA9IHRpdGxlO30sIDE1MDAsIHRydWUpOyBcclxuXHRcdH0sIDMwMDApO1xyXG5cdH0sXHJcblxyXG5cdHN0b3BUaXRsZUJsaW5rOiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdGNsZWFySW50ZXJ2YWwoRXZlbnRzLkJMSU5LX0lOVEVSVkFMKTtcclxuXHRcdEV2ZW50cy5CTElOS19JTlRFUlZBTCA9IGZhbHNlO1xyXG5cdH0sXHJcblx0XHJcblx0Ly8gTWFrZXMgYW4gZXZlbnQgaGFwcGVuIVxyXG5cdHRyaWdnZXJFdmVudDogZnVuY3Rpb24oKSB7XHJcblx0XHRpZihFdmVudHMuYWN0aXZlRXZlbnQoKSA9PSBudWxsKSB7XHJcblx0XHRcdHZhciBwb3NzaWJsZUV2ZW50cyA9IFtdO1xyXG5cdFx0XHRmb3IodmFyIGkgaW4gRXZlbnRzLkV2ZW50UG9vbCkge1xyXG5cdFx0XHRcdHZhciBldmVudCA9IEV2ZW50cy5FdmVudFBvb2xbaV07XHJcblx0XHRcdFx0aWYoZXZlbnQuaXNBdmFpbGFibGUoKSkge1xyXG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdFx0cG9zc2libGVFdmVudHMucHVzaChldmVudCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZihwb3NzaWJsZUV2ZW50cy5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHRFdmVudHMuc2NoZWR1bGVOZXh0RXZlbnQoMC41KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFyIHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqKHBvc3NpYmxlRXZlbnRzLmxlbmd0aCkpO1xyXG5cdFx0XHRcdEV2ZW50cy5zdGFydEV2ZW50KHBvc3NpYmxlRXZlbnRzW3JdKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdEV2ZW50cy5zY2hlZHVsZU5leHRFdmVudCgpO1xyXG5cdH0sXHJcblxyXG5cdC8vIG5vdCBzY2hlZHVsZWQsIHRoaXMgaXMgZm9yIHN0dWZmIGxpa2UgbG9jYXRpb24tYmFzZWQgcmFuZG9tIGV2ZW50cyBvbiBhIGJ1dHRvbiBjbGlja1xyXG5cdHRyaWdnZXJMb2NhdGlvbkV2ZW50OiBmdW5jdGlvbihsb2NhdGlvbikge1xyXG5cdFx0aWYgKHRoaXMuTG9jYXRpb25zW2xvY2F0aW9uXSkge1xyXG5cdFx0XHRpZihFdmVudHMuYWN0aXZlRXZlbnQoKSA9PSBudWxsKSB7XHJcblx0XHRcdFx0dmFyIHBvc3NpYmxlRXZlbnRzOiBBcnJheTxhbnk+ID0gW107XHJcblx0XHRcdFx0Zm9yKHZhciBpIGluIHRoaXMuTG9jYXRpb25zW2xvY2F0aW9uXSkge1xyXG5cdFx0XHRcdFx0dmFyIGV2ZW50ID0gdGhpcy5Mb2NhdGlvbnNbbG9jYXRpb25dW2ldO1xyXG5cdFx0XHRcdFx0aWYoZXZlbnQuaXNBdmFpbGFibGUoKSkge1xyXG5cdFx0XHRcdFx0XHRpZih0eXBlb2YoZXZlbnQuaXNTdXBlckxpa2VseSkgPT0gJ2Z1bmN0aW9uJyAmJiBldmVudC5pc1N1cGVyTGlrZWx5KCkpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBTdXBlckxpa2VseSBldmVudCwgZG8gdGhpcyBhbmQgc2tpcCB0aGUgcmFuZG9tIGNob2ljZVxyXG5cdFx0XHRcdFx0XHRcdEVuZ2luZS5sb2coJ3N1cGVyTGlrZWx5IGRldGVjdGVkJyk7XHJcblx0XHRcdFx0XHRcdFx0RXZlbnRzLnN0YXJ0RXZlbnQoZXZlbnQpO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRwb3NzaWJsZUV2ZW50cy5wdXNoKGV2ZW50KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHJcblx0XHRcdFx0aWYocG9zc2libGVFdmVudHMubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdFx0XHQvLyBFdmVudHMuc2NoZWR1bGVOZXh0RXZlbnQoMC41KTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dmFyIHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqKHBvc3NpYmxlRXZlbnRzLmxlbmd0aCkpO1xyXG5cdFx0XHRcdFx0RXZlbnRzLnN0YXJ0RXZlbnQocG9zc2libGVFdmVudHNbcl0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0YWN0aXZlRXZlbnQ6IGZ1bmN0aW9uKCk6IEFEUkV2ZW50IHwgbnVsbCB7XHJcblx0XHRpZihFdmVudHMuZXZlbnRTdGFjayAmJiBFdmVudHMuZXZlbnRTdGFjay5sZW5ndGggPiAwKSB7XHJcblx0XHRcdHJldHVybiBFdmVudHMuZXZlbnRTdGFja1swXTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH0sXHJcblx0XHJcblx0ZXZlbnRQYW5lbDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LmV2ZW50UGFuZWw7XHJcblx0fSxcclxuXHJcblx0c3RhcnRFdmVudDogZnVuY3Rpb24oZXZlbnQ6IEFEUkV2ZW50LCBvcHRpb25zPykge1xyXG5cdFx0aWYoZXZlbnQpIHtcclxuXHRcdFx0RXZlbnRzLmV2ZW50U3RhY2sudW5zaGlmdChldmVudCk7XHJcblx0XHRcdGV2ZW50LmV2ZW50UGFuZWwgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2V2ZW50JykuYWRkQ2xhc3MoJ2V2ZW50UGFuZWwnKS5jc3MoJ29wYWNpdHknLCAnMCcpO1xyXG5cdFx0XHRpZihvcHRpb25zICE9IG51bGwgJiYgb3B0aW9ucy53aWR0aCAhPSBudWxsKSB7XHJcblx0XHRcdFx0RXZlbnRzLmV2ZW50UGFuZWwoKS5jc3MoJ3dpZHRoJywgb3B0aW9ucy53aWR0aCk7XHJcblx0XHRcdH1cclxuXHRcdFx0JCgnPGRpdj4nKS5hZGRDbGFzcygnZXZlbnRUaXRsZScpLnRleHQoRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnRpdGxlIGFzIHN0cmluZykuYXBwZW5kVG8oRXZlbnRzLmV2ZW50UGFuZWwoKSk7XHJcblx0XHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnZGVzY3JpcHRpb24nKS5hcHBlbmRUbyhFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdidXR0b25zJykuYXBwZW5kVG8oRXZlbnRzLmV2ZW50UGFuZWwoKSk7XHJcblx0XHRcdEV2ZW50cy5sb2FkU2NlbmUoJ3N0YXJ0Jyk7XHJcblx0XHRcdCQoJ2RpdiN3cmFwcGVyJykuYXBwZW5kKEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0XHRFdmVudHMuZXZlbnRQYW5lbCgpLmFuaW1hdGUoe29wYWNpdHk6IDF9LCBFdmVudHMuX1BBTkVMX0ZBREUsICdsaW5lYXInKTtcclxuXHRcdFx0dmFyIGN1cnJlbnRTY2VuZUluZm9ybWF0aW9uID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnNjZW5lc1tFdmVudHMuYWN0aXZlU2NlbmVdO1xyXG5cdFx0XHRpZiAoY3VycmVudFNjZW5lSW5mb3JtYXRpb24uYmxpbmspIHtcclxuXHRcdFx0XHRFdmVudHMuYmxpbmtUaXRsZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0c2NoZWR1bGVOZXh0RXZlbnQ6IGZ1bmN0aW9uKHNjYWxlPykge1xyXG5cdFx0dmFyIG5leHRFdmVudCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSooRXZlbnRzLl9FVkVOVF9USU1FX1JBTkdFWzFdIC0gRXZlbnRzLl9FVkVOVF9USU1FX1JBTkdFWzBdKSkgKyBFdmVudHMuX0VWRU5UX1RJTUVfUkFOR0VbMF07XHJcblx0XHRpZihzY2FsZSA+IDApIHsgbmV4dEV2ZW50ICo9IHNjYWxlOyB9XHJcblx0XHRFbmdpbmUubG9nKCduZXh0IGV2ZW50IHNjaGVkdWxlZCBpbiAnICsgbmV4dEV2ZW50ICsgJyBtaW51dGVzJyk7XHJcblx0XHRFdmVudHMuX2V2ZW50VGltZW91dCA9IEVuZ2luZS5zZXRUaW1lb3V0KEV2ZW50cy50cmlnZ2VyRXZlbnQsIG5leHRFdmVudCAqIDYwICogMTAwMCk7XHJcblx0fSxcclxuXHJcblx0ZW5kRXZlbnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLmV2ZW50UGFuZWwoKS5hbmltYXRlKHtvcGFjaXR5OjB9LCBFdmVudHMuX1BBTkVMX0ZBREUsICdsaW5lYXInLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0RXZlbnRzLmV2ZW50UGFuZWwoKS5yZW1vdmUoKTtcclxuXHRcdFx0Y29uc3QgYWN0aXZlRXZlbnQgPSBFdmVudHMuYWN0aXZlRXZlbnQoKTtcclxuXHRcdFx0aWYgKGFjdGl2ZUV2ZW50ICE9PSBudWxsKSBhY3RpdmVFdmVudC5ldmVudFBhbmVsID0gbnVsbDtcclxuXHRcdFx0RXZlbnRzLmV2ZW50U3RhY2suc2hpZnQoKTtcclxuXHRcdFx0RW5naW5lLmxvZyhFdmVudHMuZXZlbnRTdGFjay5sZW5ndGggKyAnIGV2ZW50cyByZW1haW5pbmcnKTtcclxuXHRcdFx0aWYgKEV2ZW50cy5CTElOS19JTlRFUlZBTCkge1xyXG5cdFx0XHRcdEV2ZW50cy5zdG9wVGl0bGVCbGluaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIEZvcmNlIHJlZm9jdXMgb24gdGhlIGJvZHkuIEkgaGF0ZSB5b3UsIElFLlxyXG5cdFx0XHQkKCdib2R5JykuZm9jdXMoKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGhhbmRsZVN0YXRlVXBkYXRlczogZnVuY3Rpb24oZSl7XHJcblx0XHRpZigoZS5jYXRlZ29yeSA9PSAnc3RvcmVzJyB8fCBlLmNhdGVnb3J5ID09ICdpbmNvbWUnKSAmJiBFdmVudHMuYWN0aXZlRXZlbnQoKSAhPSBudWxsKXtcclxuXHRcdFx0RXZlbnRzLnVwZGF0ZUJ1dHRvbnMoKTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcbiIsIi8qKlxyXG4gKiBFdmVudHMgdGhhdCBjYW4gb2NjdXIgd2hlbiB0aGUgUm9hZCBtb2R1bGUgaXMgYWN0aXZlXHJcbiAqKi9cclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4uL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4uL3BsYXllci9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IHsgT3V0cG9zdCB9IGZyb20gXCIuLi9wbGFjZXMvb3V0cG9zdFwiO1xyXG5pbXBvcnQgeyBSb2FkIH0gZnJvbSBcIi4uL3BsYWNlcy9yb2FkXCI7XHJcbmltcG9ydCB7IEFEUkV2ZW50IH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEV2ZW50c1JvYWRXYW5kZXI6IEFycmF5PEFEUkV2ZW50PiA9IFtcclxuICAgIC8vIFN0cmFuZ2VyIGJlYXJpbmcgZ2lmdHNcclxuICAgIHtcclxuICAgICAgICB0aXRsZTogXygnQSBTdHJhbmdlciBCZWNrb25zJyksXHJcbiAgICAgICAgaXNBdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSBSb2FkO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICdzdGFydCc6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdBcyB5b3Ugd2FuZGVyIGFsb25nIHRoZSByb2FkLCBhIGhvb2RlZCBzdHJhbmdlciBnZXN0dXJlcyB0byB5b3UuIEhlIGRvZXNuXFwndCBzZWVtIGludGVyZXN0ZWQgaW4gaHVydGluZyB5b3UuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnV2hhdCBkbyB5b3UgZG8/JylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2Nsb3Nlcic6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnRHJhdyBDbG9zZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTogJ2Nsb3Nlcid9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAnbGVhdmUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0dldCBPdXR0YSBUaGVyZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOiAnbGVhdmUnfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2Nsb3Nlcic6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdZb3UgbW92ZSB0b3dhcmQgaGltIGEgYml0IGFuZCBzdG9wLiBIZSBjb250aW51ZXMgdG8gYmVja29uLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1doYXQgZG8geW91IGRvPycpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdldmVuQ2xvc2VyJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdEcmF3IEV2ZW4gQ2xvc2VyJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6ICdldmVuQ2xvc2VyJ31cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnTmFoLCBUaGlzIGlzIFRvbyBTcG9va3knKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTogJ2xlYXZlJ31cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdldmVuQ2xvc2VyJzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1lvdSBoZXNpdGFudGx5IHdhbGsgY2xvc2VyLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0FzIHNvb24gYXMgeW91IGdldCB3aXRoaW4gYXJtc1xcJyByZWFjaCwgaGUgZ3JhYnMgeW91ciBoYW5kIHdpdGggYWxhcm1pbmcgc3BlZWQuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnSGUgcXVpY2tseSBwbGFjZXMgYW4gb2JqZWN0IGluIHlvdXIgaGFuZCwgdGhlbiBsZWF2ZXMgd29yZGxlc3NseS4nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIG9uTG9hZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbWF5YmUgc29tZSBsb2dpYyB0byBtYWtlIHJlcGVhdHMgbGVzcyBsaWtlbHk/XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9zc2libGVJdGVtcyA9IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ1N0cmFuZ2VyLnNtb290aFN0b25lJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ1N0cmFuZ2VyLndyYXBwZWRLbmlmZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdTdHJhbmdlci5jbG90aEJ1bmRsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdTdHJhbmdlci5jb2luJ1xyXG4gICAgICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IHBvc3NpYmxlSXRlbXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcG9zc2libGVJdGVtcy5sZW5ndGgpXTtcclxuICAgICAgICAgICAgICAgICAgICBDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdUaGFua3MsIEkgZ3Vlc3M/JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdZb3VyIGd1dCBjbGVuY2hlcywgYW5kIHlvdSBmZWVsIHRoZSBzdWRkZW4gdXJnZSB0byBsZWF2ZS4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdBcyB5b3Ugd2FsayBhd2F5LCB5b3UgY2FuIGZlZWwgdGhlIG9sZCBtYW5cXCdzIGdhemUgb24geW91ciBiYWNrLicpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdXZWlyZC4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBPbGQgbGFkeSBpbiBjYXJyaWFnZSwgc2hvcnRjdXQgdG8gT3V0cG9zdFxyXG4gICAge1xyXG4gICAgICAgIHRpdGxlOiBfKCdUaGUgU3RvbXBpbmcgb2YgSG9vdmVzIGFuZCBDcmVha2luZyBvZiBXb29kJyksXHJcbiAgICAgICAgaXNBdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSBSb2FkO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICdzdGFydCc6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdBIGNhcnJpYWdlIHB1bGxzIHVwIGFsb25nc2lkZSB5b3UsIGFuZCB0aGUgdm9pY2Ugb2YgYW4gZWxkZXJseSB3b21hbiBjcm9ha3Mgb3V0IGZyb20gd2l0aGluLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1wiTXksIGJ1dCB5b3UgbG9vayB0aXJlZCBmcm9tIHlvdXIgam91cm5leS4gSWYgaXRcXCdzIHRoZSBPdXRwb3N0IHlvdSBzZWVrLCAnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICArICdJXFwnbSBvbiBteSB3YXkgdGhlcmUgbm93OyB3b3VsZCB5b3UgbGlrZSB0byBqb2luIG1lP1wiJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnV2hhdCBkbyB5b3UgZG8/JylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2FjY2VwdCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnQWNjZXB0IGhlciBvZmZlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOiAnYWNjZXB0J31cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnUG9saXRlbHkgRGVjbGluZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOiAnbGVhdmUnfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2FjY2VwdCc6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdZb3UgaG9wIGluIHRoZSBjYXJyaWFnZSB3aXRoIHRoZSBvbGQgd29tYW4uJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnU2hlIHR1cm5zIG91dCB0byBiZSBwcmV0dHkgY29vbCwgYW5kIGdpdmVzIHlvdSBvbmUgb2YgdGhvc2UgaGFyZCBjYW5kaWVzIHRoYXQgJyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyAnZXZlcnkgZ3JhbmRwYXJlbnQgc2VlbXMgdG8gaGF2ZSBvbiB0aGUgZW5kIHRhYmxlIG5leHQgdG8gdGhlaXIgc29mYS4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdCZWZvcmUgbG9uZywgeW91IHJlYWNoIHRoZSBPdXRwb3N0LiBZb3UgaG9wIG91dCBhbmQgdGhhbmsgdGhlIG9sZCB3b21hbiBmb3IgdGhlIHJpZGUuJylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1doYXQgYSBuaWNlIG9sZCBsYWR5JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkU00uZ2V0KCdPdXRwb3N0Lm9wZW4nKSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT3V0cG9zdC5pbml0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJFNNLnNldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENoYXJhY3Rlci5zZXRRdWVzdFN0YXR1cyhcIm1heW9yU3VwcGxpZXNcIiwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hhcmFjdGVyLmNoZWNrUXVlc3RTdGF0dXMoXCJtYXlvclN1cHBsaWVzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVuZ2luZS50cmF2ZWxUbyhPdXRwb3N0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hhcmFjdGVyLmFkZFRvSW52ZW50b3J5KCdvbGRMYWR5LkNhbmR5Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdJdFxcJ3MgdG9vIGVhcmx5IGluIHRoZSBnYW1lIHRvIGJlIHRydXN0aW5nIHdlaXJkIG9sZCBwZW9wbGUsIG1hbi4gWW91IHBvbGl0ZWx5ICcgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJ2RlY2xpbmUsIGFuZCB0aGUgd29tYW4gY2h1Y2tsZXMgc29mdGx5IGFzIHRoZSBjYXJyaWFnZSByb2xscyBvZmYgaW50byB0aGUgZGlzdGFuY2UuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnVGhhdCBzb2Z0IGNodWNrbGUgdGVsbHMgbWUgZXZlcnl0aGluZyBJIG5lZWQgdG8ga25vdyBhYm91dCB3aGV0aGVyIHlvdSBtYWRlIHRoZSAnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJ3JpZ2h0IGNhbGwuIFRoYXQgaGFkIFwidHVybmVkIGludG8gZ2luZ2VyYnJlYWRcIiB3cml0dGVuIGFsbCBvdmVyIGl0LicpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdZZWFoIGl0IGRpZCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIE9yZ2FuIHRyYXVtYVxyXG4gICAge1xyXG4gICAgICAgIHRpdGxlOiBfKCdUaGlzIEd1eSBTZWVtcyBGcmllbmRseScpLFxyXG4gICAgICAgIGlzQXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChFbmdpbmUuYWN0aXZlTW9kdWxlID09PSBSb2FkXHJcbiAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdSb2FkLmdvdFB1bmNoZWQnKSA9PT0gdW5kZWZpbmVkKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAnc3RhcnQnOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgXygnQSBtYW4gd2Fsa3MgdXAgdG8geW91IHdpdGggYSBiaWcgZ3JpbiBvbiBoaXMgZmFjZSwgYW5kIGJlZm9yZSB5b3UgY2FuIGdyZWV0IGhpbSBoZSBzd2lmdGx5IHNvY2tzIHlvdSBpbiB0aGUgc3RvbWFjaC4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdIZSB3YWxrcyBvZmYgd2hpc3RsaW5nIHdoaWxlIHlvdSBnYXNwIGZvciBicmVhdGggaW4gdGhlIGRpcnQuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnLi4uIE1hbiwgd2hhdCBhIGRpY2suJylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0Z1Y2sgbWUsIEkgZ3Vlc3MnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENoYXJhY3Rlci5ncmFudFBlcmsoJ3R1bW15UGFpbicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJFNNLnNldCgnUm9hZC5nb3RQdW5jaGVkJywgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gQW4gYXBvbG9neSBmb3Igb3JnYW4gdHJhdW1hXHJcbiAgICB7XHJcbiAgICAgICAgdGl0bGU6IF8oJ1RoaXMgRnVja2luZyBHdXkgQWdhaW4nKSxcclxuICAgICAgICBpc0F2YWlsYWJsZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoRW5naW5lLmFjdGl2ZU1vZHVsZSA9PT0gUm9hZFxyXG4gICAgICAgICAgICAgICAgJiYgKCRTTS5nZXQoJ1JvYWQuZ290UHVuY2hlZCcpICE9PSB1bmRlZmluZWQpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAnc3RhcnQnOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgXygnQSBtYW4gd2Fsa3MgdXAgdG8geW91IHdpdGggYSBiaWcgZ3JpbiBvbiBoaXMgZmFjZSwgYW5kIGJlZm9yZSB5b3UgY2FuIGdyZWV0IGhpbSBoZSBzd2lmdGx5Li4uIGFwb2xvZ2l6ZXMuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnXCJIZXksIElcXCdtIHJlYWxseSBzb3JyeSBhYm91dCBwdW5jaGluZyB5b3UgaW4gdGhlIHN0b21hY2ggYmVmb3JlLiBJIHRob3VnaHQgeW91IHdlcmUgc29tZW9uZSBlbHNlLiBJIEhBVEUgdGhhdCBndXkuXCInKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdZb3VcXCdyZSBub3Qgc3VyZSB0aGlzIGlzIGEgZ29vZCBlbm91Z2ggcmVhc29uIHRvIG5vdCBraWNrIHRoaXMgZ3V5XFwncyBhc3MuIFNlZWluZyB0aGUgbG9vayBvbiB5b3VyIGZhY2UsIGhlIGhhc3RpbHkgY29udGludWVzLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1wiQW55d2F5LCBhcyBhIHRva2VuIG9mIG15IGFwb2xvZ3ksIHBsZWFzZSBhY2NlcHQgdGhpcyBoZWFsaW5nIHRvbmljLCBhcyB3ZWxsIGFzIGEgY291cG9uIGZvciBhIHNlY3JldCBpdGVtIGZyb20gdGhlIHN0b3JlIGluIHRoZSB2aWxsYWdlLlwiJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnWW91IHNvbWV3aGF0IGF3a3dhcmRseSBhY2NlcHQgYm90aCBvZiB0aGVzZSBpdGVtcywgdGhvdWdoIHlvdSBkb25cXCd0IHRoaW5rIHRoZXJlXFwncyBhIHN0b3JlIGluIHRoZSB2aS0nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdcIk9oLCBhbmQgSVxcJ20gdGhlIG93bmVyIG9mIHRoZSBzdG9yZSBpbiB0aGUgdmlsbGFnZS4gSSBvcGVuZWQgaXQgYmFjayB1cCBhZnRlciBwdW5jaGluZyB5b3UuIFlvdSBrbm93LCB0byBjZWxlYnJhdGUuXCInKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdUaGUgbWFuIHdhbGtzIG9mZiwgc3RpbGwgZ3Jpbm5pbmcuJylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJy4uLiBBbHJpZ2h0JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBnaXZlIGhlYWxpbmcgdG9uaWNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdpdmUgY291cG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB1bmxvY2sgc3RvcmUgYnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkU00uc2V0KCdSb2FkLmdvdEFwb2xvZ2l6ZWQnLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBVbmxvY2sgT3V0cG9zdFxyXG4gICAge1xyXG4gICAgICAgIHRpdGxlOiBfKCdBIFdheSBGb3J3YXJkIE1ha2VzIEl0c2VsZiBLbm93bicpLFxyXG4gICAgICAgIGlzQXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIChFbmdpbmUuYWN0aXZlTW9kdWxlID09PSBSb2FkKVxyXG4gICAgICAgICAgICAgICAgJiYgKCRTTS5nZXQoJ1JvYWQuY291bnRlcicpIGFzIG51bWJlciA+IDMpIC8vIGNhbid0IGhhcHBlbiBUT08gZWFybHlcclxuICAgICAgICAgICAgICAgICYmICgkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgfHwgJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpIGFzIG51bWJlciA8IDEpIC8vIGNhbid0IGhhcHBlbiB0d2ljZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaXNTdXBlckxpa2VseTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoKCggJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHx8ICRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPCAxKSkgXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgKCRTTS5nZXQoJ1JvYWQuY291bnRlcicpIGFzIG51bWJlciA+IDcpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICdzdGFydCc6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdTbW9rZSBjdXJscyB1cHdhcmRzIGZyb20gYmVoaW5kIGEgaGlsbC4gWW91IGNsaW1iIGhpZ2hlciB0byBpbnZlc3RpZ2F0ZS4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdGcm9tIHlvdXIgZWxldmF0ZWQgcG9zaXRpb24sIHlvdSBjYW4gc2VlIGRvd24gaW50byB0aGUgb3V0cG9zdCB0aGF0IHRoZSBtYXlvciBzcG9rZSBvZiBiZWZvcmUuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnVGhlIE91dHBvc3QgaXMgbm93IG9wZW4gdG8geW91LicpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBIGxpdHRsZSBkcmFtYXRpYywgYnV0IGNvb2wnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgT3V0cG9zdC5pbml0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkU00uc2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJywgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGFyYWN0ZXIuc2V0UXVlc3RTdGF0dXMoXCJtYXlvclN1cHBsaWVzXCIsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hhcmFjdGVyLmNoZWNrUXVlc3RTdGF0dXMoXCJtYXlvclN1cHBsaWVzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXTtcclxuXHJcbiIsIi8qKlxyXG4gKiBNb2R1bGUgdGhhdCB0YWtlcyBjYXJlIG9mIGhlYWRlciBidXR0b25zXHJcbiAqL1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi9lbmdpbmVcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBIZWFkZXIgPSB7XHJcblx0XHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHR9LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHt9LCAvLyBOb3RoaW5nIGZvciBub3dcclxuXHRcclxuXHRjYW5UcmF2ZWw6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuICQoJ2RpdiNoZWFkZXIgZGl2LmhlYWRlckJ1dHRvbicpLmxlbmd0aCA+IDE7XHJcblx0fSxcclxuXHRcclxuXHRhZGRMb2NhdGlvbjogZnVuY3Rpb24odGV4dCwgaWQsIG1vZHVsZSkge1xyXG5cdFx0cmV0dXJuICQoJzxkaXY+JykuYXR0cignaWQnLCBcImxvY2F0aW9uX1wiICsgaWQpXHJcblx0XHRcdC5hZGRDbGFzcygnaGVhZGVyQnV0dG9uJylcclxuXHRcdFx0LnRleHQodGV4dCkuY2xpY2soZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYoSGVhZGVyLmNhblRyYXZlbCgpKSB7XHJcblx0XHRcdFx0XHRFbmdpbmUudHJhdmVsVG8obW9kdWxlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pLmFwcGVuZFRvKCQoJ2RpdiNoZWFkZXInKSk7XHJcblx0fVxyXG59OyIsIi8qKlxyXG4gKiBNb2R1bGUgdGhhdCByZWdpc3RlcnMgdGhlIG5vdGlmaWNhdGlvbiBib3ggYW5kIGhhbmRsZXMgbWVzc2FnZXNcclxuICovXHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuL2VuZ2luZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IE5vdGlmaWNhdGlvbnMgPSB7XHJcblx0XHRcclxuXHRpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHRcdFxyXG5cdFx0Ly8gQ3JlYXRlIHRoZSBub3RpZmljYXRpb25zIGJveFxyXG5cdFx0Y29uc3QgZWxlbSA9ICQoJzxkaXY+JykuYXR0cih7XHJcblx0XHRcdGlkOiAnbm90aWZpY2F0aW9ucycsXHJcblx0XHRcdGNsYXNzTmFtZTogJ25vdGlmaWNhdGlvbnMnXHJcblx0XHR9KTtcclxuXHRcdC8vIENyZWF0ZSB0aGUgdHJhbnNwYXJlbmN5IGdyYWRpZW50XHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ25vdGlmeUdyYWRpZW50JykuYXBwZW5kVG8oZWxlbSk7XHJcblx0XHRcclxuXHRcdGVsZW0uYXBwZW5kVG8oJ2RpdiN3cmFwcGVyJyk7XHJcblx0fSxcclxuXHRcclxuXHRvcHRpb25zOiB7fSwgLy8gTm90aGluZyBmb3Igbm93XHJcblx0XHJcblx0ZWxlbTogbnVsbCxcclxuXHRcclxuXHRub3RpZnlRdWV1ZToge30sXHJcblx0XHJcblx0Ly8gQWxsb3cgbm90aWZpY2F0aW9uIHRvIHRoZSBwbGF5ZXJcclxuXHRub3RpZnk6IGZ1bmN0aW9uKG1vZHVsZSwgdGV4dCwgbm9RdWV1ZT8pIHtcclxuXHRcdGlmKHR5cGVvZiB0ZXh0ID09ICd1bmRlZmluZWQnKSByZXR1cm47XHJcblx0XHQvLyBJIGRvbid0IG5lZWQgeW91IHB1bmN0dWF0aW5nIGZvciBtZSwgZnVuY3Rpb24uXHJcblx0XHQvLyBpZih0ZXh0LnNsaWNlKC0xKSAhPSBcIi5cIikgdGV4dCArPSBcIi5cIjtcclxuXHRcdGlmKG1vZHVsZSAhPSBudWxsICYmIEVuZ2luZS5hY3RpdmVNb2R1bGUgIT0gbW9kdWxlKSB7XHJcblx0XHRcdGlmKCFub1F1ZXVlKSB7XHJcblx0XHRcdFx0aWYodHlwZW9mIHRoaXMubm90aWZ5UXVldWVbbW9kdWxlXSA9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRcdFx0dGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdID0gW107XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMubm90aWZ5UXVldWVbbW9kdWxlXS5wdXNoKHRleHQpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHROb3RpZmljYXRpb25zLnByaW50TWVzc2FnZSh0ZXh0KTtcclxuXHRcdH1cclxuXHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdH0sXHJcblx0XHJcblx0Y2xlYXJIaWRkZW46IGZ1bmN0aW9uKCkge1xyXG5cdFxyXG5cdFx0Ly8gVG8gZml4IHNvbWUgbWVtb3J5IHVzYWdlIGlzc3Vlcywgd2UgY2xlYXIgbm90aWZpY2F0aW9ucyB0aGF0IGhhdmUgYmVlbiBoaWRkZW4uXHJcblx0XHRcclxuXHRcdC8vIFdlIHVzZSBwb3NpdGlvbigpLnRvcCBoZXJlLCBiZWNhdXNlIHdlIGtub3cgdGhhdCB0aGUgcGFyZW50IHdpbGwgYmUgdGhlIHNhbWUsIHNvIHRoZSBwb3NpdGlvbiB3aWxsIGJlIHRoZSBzYW1lLlxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0dmFyIGJvdHRvbSA9ICQoJyNub3RpZnlHcmFkaWVudCcpLnBvc2l0aW9uKCkudG9wICsgJCgnI25vdGlmeUdyYWRpZW50Jykub3V0ZXJIZWlnaHQodHJ1ZSk7XHJcblx0XHRcclxuXHRcdCQoJy5ub3RpZmljYXRpb24nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHJcblx0XHRcdGlmKCQodGhpcykucG9zaXRpb24oKS50b3AgPiBib3R0b20pe1xyXG5cdFx0XHRcdCQodGhpcykucmVtb3ZlKCk7XHJcblx0XHRcdH1cclxuXHRcdFxyXG5cdFx0fSk7XHJcblx0XHRcclxuXHR9LFxyXG5cdFxyXG5cdHByaW50TWVzc2FnZTogZnVuY3Rpb24odCkge1xyXG5cdFx0dmFyIHRleHQgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdub3RpZmljYXRpb24nKS5jc3MoJ29wYWNpdHknLCAnMCcpLnRleHQodCkucHJlcGVuZFRvKCdkaXYjbm90aWZpY2F0aW9ucycpO1xyXG5cdFx0dGV4dC5hbmltYXRlKHtvcGFjaXR5OiAxfSwgNTAwLCAnbGluZWFyJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdC8vIERvIHRoaXMgZXZlcnkgdGltZSB3ZSBhZGQgYSBuZXcgbWVzc2FnZSwgdGhpcyB3YXkgd2UgbmV2ZXIgaGF2ZSBhIGxhcmdlIGJhY2tsb2cgdG8gaXRlcmF0ZSB0aHJvdWdoLiBLZWVwcyB0aGluZ3MgZmFzdGVyLlxyXG5cdFx0XHROb3RpZmljYXRpb25zLmNsZWFySGlkZGVuKCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdFxyXG5cdHByaW50UXVldWU6IGZ1bmN0aW9uKG1vZHVsZSkge1xyXG5cdFx0aWYodHlwZW9mIHRoaXMubm90aWZ5UXVldWVbbW9kdWxlXSAhPSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHR3aGlsZSh0aGlzLm5vdGlmeVF1ZXVlW21vZHVsZV0ubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdE5vdGlmaWNhdGlvbnMucHJpbnRNZXNzYWdlKHRoaXMubm90aWZ5UXVldWVbbW9kdWxlXS5zaGlmdCgpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgeyBFbmdpbmUgfSBmcm9tICcuLi9lbmdpbmUnO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tICcuLi9zdGF0ZV9tYW5hZ2VyJztcclxuaW1wb3J0IHsgV2VhdGhlciB9IGZyb20gJy4uL3dlYXRoZXInO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi9CdXR0b24nO1xyXG5pbXBvcnQgeyBDYXB0YWluIH0gZnJvbSAnLi4vY2hhcmFjdGVycy9jYXB0YWluJztcclxuaW1wb3J0IHsgSGVhZGVyIH0gZnJvbSAnLi4vaGVhZGVyJztcclxuaW1wb3J0IHsgXyB9IGZyb20gJy4uLy4uL2xpYi90cmFuc2xhdGUnO1xyXG5pbXBvcnQgeyBfdGIgfSBmcm9tICcuLi8uLi9saWIvdGV4dEJ1aWxkZXInO1xyXG5cclxuZXhwb3J0IGNvbnN0IE91dHBvc3QgPSB7XHJcblx0ZGVzY3JpcHRpb246IFtcclxuXHRcdF8oXCJZb3UncmUgaW4gYSBzbWFsbCBidXQgYnVzdGxpbmcgbWlsaXRhcnkgT3V0cG9zdC4gVmFyaW91cyBtZW1iZXJzIFwiIFxyXG5cdFx0XHQrIFwib2YgdGhlIHJhbmstYW5kLWZpbGUgZ28gYWJvdXQgdGhlaXIgYnVzaW5lc3MsIHBheWluZyB5b3UgbGl0dGxlIG1pbmQuXCIpLFxyXG5cdFx0XyhcIk9uZSB0ZW50IHN0YW5kcyBvdXQgZnJvbSB0aGUgcmVzdDsgdGhlIGZpbmVseS1lbWJyb2lkZXJlZCBkZXRhaWxzIGFuZCBcIiArIFxyXG5cdFx0XHRcImdvbGRlbiBpY29uIGFib3ZlIHRoZSBlbnRyYW5jZSBtYXJrIGl0IGFzIHRoZSBjb21tYW5kaW5nIG9mZmljZXIncyBxdWFydGVycy5cIilcclxuXHRdLFxyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBPdXRwb3N0IHRhYlxyXG4gICAgICAgIHRoaXMudGFiID0gSGVhZGVyLmFkZExvY2F0aW9uKF8oXCJUaGUgT3V0cG9zdFwiKSwgXCJvdXRwb3N0XCIsIE91dHBvc3QpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgdGhlIE91dHBvc3QgcGFuZWxcclxuXHRcdHRoaXMucGFuZWwgPSAkKCc8ZGl2PicpXHJcbiAgICAgICAgLmF0dHIoJ2lkJywgXCJvdXRwb3N0UGFuZWxcIilcclxuICAgICAgICAuYWRkQ2xhc3MoJ2xvY2F0aW9uJylcclxuICAgICAgICAuYXBwZW5kVG8oJ2RpdiNsb2NhdGlvblNsaWRlcicpO1xyXG5cclxuXHRcdHRoaXMuZGVzY3JpcHRpb25QYW5lbCA9ICQoJzxkaXY+JykuYXR0cignaWQnLCAnZGVzY3JpcHRpb24nKS5hcHBlbmRUbyh0aGlzLnBhbmVsKTtcclxuXHRcdHRoaXMudXBkYXRlRGVzY3JpcHRpb24oKTtcclxuXHJcbiAgICAgICAgRW5naW5lLnVwZGF0ZVNsaWRlcigpO1xyXG5cclxuICAgICAgICAvLyBuZXcgXHJcblx0XHRCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6ICdjYXB0YWluQnV0dG9uJyxcclxuXHRcdFx0dGV4dDogXygnU3BlYWsgd2l0aCBUaGUgQ2FwdGFpbicpLFxyXG5cdFx0XHRjbGljazogQ2FwdGFpbi50YWxrVG9DYXB0YWluLFxyXG5cdFx0XHR3aWR0aDogJzgwcHgnXHJcblx0XHR9KVxyXG5cdFx0LmFkZENsYXNzKCdsb2NhdGlvbkJ1dHRvbicpXHJcblx0XHQuYXBwZW5kVG8oJ2RpdiNvdXRwb3N0UGFuZWwnKTtcclxuXHJcbiAgICAgICAgT3V0cG9zdC51cGRhdGVCdXR0b24oKTtcclxuXHJcbiAgICAgICAgLy8gc2V0dGluZyB0aGlzIHNlcGFyYXRlbHkgc28gdGhhdCBxdWVzdCBzdGF0dXMgY2FuJ3QgYWNjaWRlbnRhbGx5IGJyZWFrIGl0IGxhdGVyXHJcbiAgICAgICAgJFNNLnNldCgnT3V0cG9zdC5vcGVuJywgMSk7IFxyXG4gICAgfSxcclxuXHJcblx0dXBkYXRlRGVzY3JpcHRpb246IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5kZXNjcmlwdGlvblBhbmVsLmVtcHR5KCk7XHJcblx0XHR0aGlzLmRlc2NyaXB0aW9uID0gX3RiKFtcclxuXHRcdFx0XyhcIllvdSdyZSBvbiBhIGR1c3R5IHJvYWQgYmV0d2VlbiB0aGUgVmlsbGFnZSBhbmQgdGhlIE91dHBvc3QuIFRoZSByb2FkIGN1dHMgdGhyb3VnaCBcIiBcclxuXHRcdFx0XHQrIFwidGFsbCBncmFzcywgYnJ1c2gsIGFuZCB0cmVlcywgbGltaXRpbmcgdmlzaWJpbGl0eSBhbmQgZW5zdXJpbmcgdGhhdCB5b3UnbGwgaGF2ZSBcIiBcclxuXHRcdFx0XHQrIFwidG8gZGVhbCB3aXRoIHNvbWUgbm9uc2Vuc2UuXCIpLFxyXG5cdFx0XHRfKFwiVGhlIGhhaXIgb24gdGhlIGJhY2sgb2YgeW91ciBuZWNrIHByaWNrbGVzIHNsaWdodGx5IGluIGFudGljaXBhdGlvbi5cIilcclxuXHRcdF0pO1xyXG5cclxuXHRcdGZvcih2YXIgaSBpbiB0aGlzLmRlc2NyaXB0aW9uKSB7XHJcblx0XHRcdCQoJzxkaXY+JykudGV4dCh0aGlzLmRlc2NyaXB0aW9uW2ldKS5hcHBlbmRUbyh0aGlzLmRlc2NyaXB0aW9uUGFuZWwpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG4gICAgYXZhaWxhYmxlV2VhdGhlcjoge1xyXG5cdFx0J3N1bm55JzogMC40LFxyXG5cdFx0J2Nsb3VkeSc6IDAuMyxcclxuXHRcdCdyYWlueSc6IDAuM1xyXG5cdH0sXHJcblxyXG4gICAgb25BcnJpdmFsOiBmdW5jdGlvbih0cmFuc2l0aW9uX2RpZmYpIHtcclxuICAgICAgICBPdXRwb3N0LnNldFRpdGxlKCk7XHJcblxyXG4gICAgICAgIFdlYXRoZXIuaW5pdGlhdGVXZWF0aGVyKE91dHBvc3QuYXZhaWxhYmxlV2VhdGhlciwgJ291dHBvc3QnKTtcclxuXHJcblx0XHR0aGlzLnVwZGF0ZURlc2NyaXB0aW9uKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldFRpdGxlOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0aXRsZSA9IF8oXCJUaGUgT3V0cG9zdFwiKTtcclxuXHRcdGlmKEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gdGhpcykge1xyXG5cdFx0XHRkb2N1bWVudC50aXRsZSA9IHRpdGxlO1xyXG5cdFx0fVxyXG5cdFx0JCgnZGl2I2xvY2F0aW9uX291dHBvc3QnKS50ZXh0KHRpdGxlKTtcclxuXHR9LFxyXG5cclxuICAgIHVwZGF0ZUJ1dHRvbjogZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBjb25kaXRpb25hbHMgZm9yIHVwZGF0aW5nIGJ1dHRvbnNcclxuXHR9XHJcbn0iLCJpbXBvcnQgeyBIZWFkZXIgfSBmcm9tIFwiLi4vaGVhZGVyXCI7XHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuLi9lbmdpbmVcIjtcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uL0J1dHRvblwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgV2VhdGhlciB9IGZyb20gXCIuLi93ZWF0aGVyXCI7XHJcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgX3RiIH0gZnJvbSBcIi4uLy4uL2xpYi90ZXh0QnVpbGRlclwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IFJvYWQgPSB7XHJcblx0ZGVzY3JpcHRpb246IG51bGwsXHJcblx0ZGVzY3JpcHRpb25QYW5lbDogbnVsbCxcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgUm9hZCB0YWJcclxuICAgICAgICB0aGlzLnRhYiA9IEhlYWRlci5hZGRMb2NhdGlvbihfKFwiUm9hZCB0byB0aGUgT3V0cG9zdFwiKSwgXCJyb2FkXCIsIFJvYWQpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgdGhlIFJvYWQgcGFuZWxcclxuXHRcdHRoaXMucGFuZWwgPSAkKCc8ZGl2PicpXHJcbiAgICAgICAgLmF0dHIoJ2lkJywgXCJyb2FkUGFuZWxcIilcclxuICAgICAgICAuYWRkQ2xhc3MoJ2xvY2F0aW9uJylcclxuICAgICAgICAuYXBwZW5kVG8oJ2RpdiNsb2NhdGlvblNsaWRlcicpO1xyXG5cclxuXHRcdHRoaXMuZGVzY3JpcHRpb25QYW5lbCA9ICQoJzxkaXY+JykuYXR0cignaWQnLCAnZGVzY3JpcHRpb24nKS5hcHBlbmRUbyh0aGlzLnBhbmVsKTtcclxuXHRcdHRoaXMudXBkYXRlRGVzY3JpcHRpb24oKTtcclxuXHJcbiAgICAgICAgRW5naW5lLnVwZGF0ZVNsaWRlcigpO1xyXG5cclxuXHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogJ3dhbmRlckJ1dHRvbicsXHJcblx0XHRcdHRleHQ6IF8oJ1dhbmRlciBBcm91bmQnKSxcclxuXHRcdFx0Y2xpY2s6IFJvYWQud2FuZGVyRXZlbnQsXHJcblx0XHRcdHdpZHRoOiAnODBweCcsXHJcblx0XHRcdGNvc3Q6IHt9IC8vIFRPRE86IG1ha2UgdGhlcmUgYmUgYSBjb3N0IHRvIGRvaW5nIHN0dWZmP1xyXG5cdFx0fSlcclxuXHRcdC5hZGRDbGFzcygnbG9jYXRpb25CdXR0b24nKVxyXG5cdFx0LmFwcGVuZFRvKCdkaXYjcm9hZFBhbmVsJyk7XHJcblxyXG4gICAgICAgIFJvYWQudXBkYXRlQnV0dG9uKCk7XHJcblxyXG4gICAgICAgIC8vIHNldHRpbmcgdGhpcyBzZXBhcmF0ZWx5IHNvIHRoYXQgcXVlc3Qgc3RhdHVzIGNhbid0IGFjY2lkZW50YWxseSBicmVhayBpdCBsYXRlclxyXG4gICAgICAgICRTTS5zZXQoJ1JvYWQub3BlbicsIDEpOyBcclxuICAgIH0sXHJcblxyXG5cdHVwZGF0ZURlc2NyaXB0aW9uOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuZGVzY3JpcHRpb25QYW5lbC5lbXB0eSgpO1xyXG5cdFx0dGhpcy5kZXNjcmlwdGlvbiA9IF90YihbXHJcblx0XHRcdF8oXCJZb3UncmUgb24gYSBkdXN0eSByb2FkIGJldHdlZW4gdGhlIFZpbGxhZ2UgYW5kIHRoZSBPdXRwb3N0LiBUaGUgcm9hZCBjdXRzIHRocm91Z2ggXCIgXHJcblx0XHRcdFx0KyBcInRhbGwgZ3Jhc3MsIGJydXNoLCBhbmQgdHJlZXMsIGxpbWl0aW5nIHZpc2liaWxpdHkgYW5kIGVuc3VyaW5nIHRoYXQgeW91J2xsIGhhdmUgXCIgXHJcblx0XHRcdFx0KyBcInRvIGRlYWwgd2l0aCBzb21lIG5vbnNlbnNlLlwiKSxcclxuXHRcdFx0XyhcIlRoZSBoYWlyIG9uIHRoZSBiYWNrIG9mIHlvdXIgbmVjayBwcmlja2xlcyBzbGlnaHRseSBpbiBhbnRpY2lwYXRpb24uXCIpXHJcblx0XHRdKTtcclxuXHJcblx0XHRmb3IodmFyIGkgaW4gdGhpcy5kZXNjcmlwdGlvbikge1xyXG5cdFx0XHQkKCc8ZGl2PicpLnRleHQodGhpcy5kZXNjcmlwdGlvbltpXSkuYXBwZW5kVG8odGhpcy5kZXNjcmlwdGlvblBhbmVsKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuICAgIGF2YWlsYWJsZVdlYXRoZXI6IHtcclxuXHRcdCdzdW5ueSc6IDAuNCxcclxuXHRcdCdjbG91ZHknOiAwLjMsXHJcblx0XHQncmFpbnknOiAwLjNcclxuXHR9LFxyXG5cclxuICAgIG9uQXJyaXZhbDogZnVuY3Rpb24odHJhbnNpdGlvbl9kaWZmKSB7XHJcbiAgICAgICAgUm9hZC5zZXRUaXRsZSgpO1xyXG5cclxuICAgICAgICBXZWF0aGVyLmluaXRpYXRlV2VhdGhlcihSb2FkLmF2YWlsYWJsZVdlYXRoZXIsICdyb2FkJyk7XHJcblxyXG5cdFx0dGhpcy51cGRhdGVEZXNjcmlwdGlvbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRUaXRsZTogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdGl0bGUgPSBfKFwiUm9hZCB0byB0aGUgT3V0cG9zdFwiKTtcclxuXHRcdGlmKEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gdGhpcykge1xyXG5cdFx0XHRkb2N1bWVudC50aXRsZSA9IHRpdGxlO1xyXG5cdFx0fVxyXG5cdFx0JCgnZGl2I2xvY2F0aW9uX3JvYWQnKS50ZXh0KHRpdGxlKTtcclxuXHR9LFxyXG5cclxuICAgIHVwZGF0ZUJ1dHRvbjogZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBjb25kaXRpb25hbHMgZm9yIHVwZGF0aW5nIGJ1dHRvbnNcclxuXHR9LFxyXG5cclxuXHR3YW5kZXJFdmVudDogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMudHJpZ2dlckxvY2F0aW9uRXZlbnQoJ1JvYWRXYW5kZXInKTtcclxuXHRcdCRTTS5hZGQoJ1JvYWQuY291bnRlcicsIDEpO1xyXG5cdH1cclxufSIsIi8qKlxyXG4gKiBNb2R1bGUgdGhhdCByZWdpc3RlcnMgdGhlIHNpbXBsZSByb29tIGZ1bmN0aW9uYWxpdHlcclxuICovXHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuLi9lbmdpbmVcIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uL0J1dHRvblwiO1xyXG5pbXBvcnQgeyBXZWF0aGVyIH0gZnJvbSBcIi4uL3dlYXRoZXJcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IEhlYWRlciB9IGZyb20gXCIuLi9oZWFkZXJcIjtcclxuaW1wb3J0IHsgTGl6IH0gZnJvbSBcIi4uL2NoYXJhY3RlcnMvbGl6XCI7XHJcbmltcG9ydCB7IE1heW9yIH0gZnJvbSBcIi4uL2NoYXJhY3RlcnMvbWF5b3JcIjtcclxuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5pbXBvcnQgeyBfdGIgfSBmcm9tIFwiLi4vLi4vbGliL3RleHRCdWlsZGVyXCI7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuLi9wbGF5ZXIvY2hhcmFjdGVyXCI7XHJcblxyXG5leHBvcnQgY29uc3QgVmlsbGFnZSA9IHtcclxuXHJcblx0YnV0dG9uczp7fSxcclxuXHRcclxuXHRjaGFuZ2VkOiBmYWxzZSxcclxuXHJcblx0ZGVzY3JpcHRpb246IFtdLFxyXG5cdGRlc2NyaXB0aW9uUGFuZWw6IG51bGwsXHJcblx0XHJcblx0bmFtZTogXyhcIlZpbGxhZ2VcIiksXHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblx0XHRcclxuXHRcdGlmKEVuZ2luZS5fZGVidWcpIHtcclxuXHRcdFx0dGhpcy5fUk9PTV9XQVJNX0RFTEFZID0gNTAwMDtcclxuXHRcdFx0dGhpcy5fQlVJTERFUl9TVEFURV9ERUxBWSA9IDUwMDA7XHJcblx0XHRcdHRoaXMuX1NUT0tFX0NPT0xET1dOID0gMDtcclxuXHRcdFx0dGhpcy5fTkVFRF9XT09EX0RFTEFZID0gNTAwMDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gQ3JlYXRlIHRoZSBWaWxsYWdlIHRhYlxyXG5cdFx0dGhpcy50YWIgPSBIZWFkZXIuYWRkTG9jYXRpb24oXyhcIkEgQ2hpbGwgVmlsbGFnZVwiKSwgXCJ2aWxsYWdlXCIsIFZpbGxhZ2UpO1xyXG5cdFx0XHJcblx0XHQvLyBDcmVhdGUgdGhlIFZpbGxhZ2UgcGFuZWxcclxuXHRcdHRoaXMucGFuZWwgPSAkKCc8ZGl2PicpXHJcblx0XHRcdC5hdHRyKCdpZCcsIFwidmlsbGFnZVBhbmVsXCIpXHJcblx0XHRcdC5hZGRDbGFzcygnbG9jYXRpb24nKVxyXG5cdFx0XHQuYXBwZW5kVG8oJ2RpdiNsb2NhdGlvblNsaWRlcicpO1xyXG5cclxuXHRcdHRoaXMuZGVzY3JpcHRpb25QYW5lbCA9ICQoJzxkaXY+JykuYXR0cignaWQnLCAnZGVzY3JpcHRpb24nKS5hcHBlbmRUbyh0aGlzLnBhbmVsKTtcclxuXHRcdHRoaXMudXBkYXRlRGVzY3JpcHRpb24oKTtcclxuXHJcblx0XHRFbmdpbmUudXBkYXRlU2xpZGVyKCk7XHJcblxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAndGFsa0J1dHRvbicsXHJcblx0XHRcdHRleHQ6IF8oJ1RhbGsgdG8gdGhlIE1heW9yJyksXHJcblx0XHRcdGNsaWNrOiBNYXlvci50YWxrVG9NYXlvcixcclxuXHRcdFx0d2lkdGg6ICc4MHB4JyxcclxuXHRcdFx0Y29zdDoge31cclxuXHRcdH0pXHJcblx0XHQuYWRkQ2xhc3MoJ2xvY2F0aW9uQnV0dG9uJylcclxuXHRcdC5hcHBlbmRUbygnZGl2I3ZpbGxhZ2VQYW5lbCcpO1xyXG5cclxuXHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogJ2xpekJ1dHRvbicsXHJcblx0XHRcdHRleHQ6IF8oJ1RhbGsgdG8gTGl6JyksXHJcblx0XHRcdGNsaWNrOiBMaXoudGFsa1RvTGl6LFxyXG5cdFx0XHR3aWR0aDogJzgwcHgnLFxyXG5cdFx0XHRjb3N0OiB7fVxyXG5cdFx0fSlcclxuXHRcdC5hZGRDbGFzcygnbG9jYXRpb25CdXR0b24nKVxyXG5cdFx0LmFwcGVuZFRvKCdkaXYjdmlsbGFnZVBhbmVsJyk7XHJcblxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAnbmV3QnVpbGRpbmdCdXR0b24nLFxyXG5cdFx0XHR0ZXh0OiBfKCdDaGVjayBvdXQgdGhlIG5ldyBidWlsZGluZycpLFxyXG5cdFx0XHRjbGljazogVmlsbGFnZS50ZW1wQnVpbGRpbmdNZXNzYWdlLFxyXG5cdFx0XHR3aWR0aDogJzgwcHgnLFxyXG5cdFx0XHRjb3N0OiB7fVxyXG5cdFx0fSlcclxuXHRcdC5hZGRDbGFzcygnbG9jYXRpb25CdXR0b24nKVxyXG5cdFx0LmFwcGVuZFRvKCdkaXYjdmlsbGFnZVBhbmVsJyk7XHJcblxyXG5cdFx0dmFyIGJ1aWxkaW5nQnV0dG9uID0gJCgnI25ld0J1aWxkaW5nQnV0dG9uLmJ1dHRvbicpO1xyXG5cdFx0YnVpbGRpbmdCdXR0b24uaGlkZSgpO1xyXG5cclxuXHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogJ3N0b3JlQnV0dG9uJyxcclxuXHRcdFx0dGV4dDogXygnR28gdG8gdGhlIFN0b3JlJyksXHJcblx0XHRcdGNsaWNrOiBWaWxsYWdlLm9wZW5TdG9yZSxcclxuXHRcdFx0d2lkdGg6ICc4MHB4JyxcclxuXHRcdFx0Y29zdDoge31cclxuXHRcdH0pXHJcblx0XHQuYWRkQ2xhc3MoJ2xvY2F0aW9uQnV0dG9uJylcclxuXHRcdC5hcHBlbmRUbygnZGl2I3ZpbGxhZ2VQYW5lbCcpO1xyXG5cclxuXHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogJ2RpY2VCdXR0b24nLFxyXG5cdFx0XHR0ZXh0OiBfKCdQbGF5IGEgR2FtZScpLFxyXG5cdFx0XHRjbGljazogVmlsbGFnZS5wbGF5RGljZUdhbWUsXHJcblx0XHRcdHdpZHRoOiAnODBweCcsXHJcblx0XHRcdGNvc3Q6IHt9XHJcblx0XHR9KVxyXG5cdFx0LmFkZENsYXNzKCdsb2NhdGlvbkJ1dHRvbicpXHJcblx0XHQuYXBwZW5kVG8oJ2RpdiN2aWxsYWdlUGFuZWwnKTtcclxuXHJcblx0XHR2YXIgc3RvcmVCdXR0b24gPSAkKCcjc3RvcmVCdXR0b24uYnV0dG9uJyk7XHJcblx0XHRzdG9yZUJ1dHRvbi5oaWRlKCk7XHJcblxyXG5cdFx0dmFyIGxpekJ1dHRvbiA9ICQoJyNsaXpCdXR0b24uYnV0dG9uJyk7XHJcblx0XHRsaXpCdXR0b24uaGlkZSgpO1xyXG5cdFx0XHJcblx0XHQvLyBDcmVhdGUgdGhlIHN0b3JlcyBjb250YWluZXJcclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnc3RvcmVzQ29udGFpbmVyJykuYXBwZW5kVG8oJ2RpdiN2aWxsYWdlUGFuZWwnKTtcclxuXHRcdFxyXG5cdFx0Ly9zdWJzY3JpYmUgdG8gc3RhdGVVcGRhdGVzXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHQkLkRpc3BhdGNoKCdzdGF0ZVVwZGF0ZScpLnN1YnNjcmliZShWaWxsYWdlLmhhbmRsZVN0YXRlVXBkYXRlcyk7XHJcblx0XHRcclxuXHRcdFZpbGxhZ2UudXBkYXRlQnV0dG9uKCk7XHJcblx0fSxcclxuXHJcblx0dXBkYXRlRGVzY3JpcHRpb246IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5kZXNjcmlwdGlvblBhbmVsLmVtcHR5KCk7XHJcblx0XHR0aGlzLmRlc2NyaXB0aW9uID0gX3RiKFtcclxuXHRcdFx0XyhcIk5lc3RsZWQgaW4gdGhlIHdvb2RzLCB0aGlzIHZpbGxhZ2UgaXMgc2NhcmNlbHkgbW9yZSB0aGFuIGEgaGFtbGV0LCBcIiBcclxuXHRcdFx0XHQrIFwiZGVzcGl0ZSB5b3UgdGhpbmtpbmcgdGhvc2UgdHdvIHdvcmRzIGFyZSBzeW5vbnltcy4gVGhleSdyZSBub3QsIFwiIFxyXG5cdFx0XHRcdCsgXCJnbyBnb29nbGUgJ2hhbWxldCcgcmlnaHQgbm93IGlmIHlvdSBkb24ndCBiZWxpZXZlIG1lLlwiKSxcclxuXHRcdFx0XyhcIlRoZSB2aWxsYWdlIGlzIHF1aWV0IGF0IHRoZSBtb21lbnQ7IHRoZXJlIGFyZW4ndCBlbm91Z2ggaGFuZHMgZm9yIGFueW9uZSB0byByZW1haW4gaWRsZSBmb3IgbG9uZy5cIiksXHJcblx0XHRcdHtcclxuXHRcdFx0XHR0ZXh0OiBfKFwiQSBzdG9yZWZyb250LCBzdGFmZmVkIGVudGlyZWx5IGJ5IGEgc2luZ2xlIGdyaW5uaW5nIGphY2thc3MsIHN0YW5kcyBwcm91ZGx5IGluIHRoZSBtYWluIHNxdWFyZS5cIiksXHJcblx0XHRcdFx0aXNWaXNpYmxlOiAoKSA9PiB7XHJcblx0XHRcdFx0XHRyZXR1cm4gJFNNLmdldCgnUm9hZC5nb3RBcG9sb2dpemVkJykgIT09IHVuZGVmaW5lZDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdF0pO1xyXG5cclxuXHRcdGZvcih2YXIgaSBpbiB0aGlzLmRlc2NyaXB0aW9uKSB7XHJcblx0XHRcdCQoJzxkaXY+JykudGV4dCh0aGlzLmRlc2NyaXB0aW9uW2ldKS5hcHBlbmRUbyh0aGlzLmRlc2NyaXB0aW9uUGFuZWwpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0b3B0aW9uczoge30sIC8vIE5vdGhpbmcgZm9yIG5vd1xyXG5cclxuXHRhdmFpbGFibGVXZWF0aGVyOiB7XHJcblx0XHQnc3VubnknOiAwLjQsXHJcblx0XHQnY2xvdWR5JzogMC4zLFxyXG5cdFx0J3JhaW55JzogMC4zXHJcblx0fSxcclxuXHRcclxuXHRvbkFycml2YWw6IGZ1bmN0aW9uKHRyYW5zaXRpb25fZGlmZikge1xyXG5cdFx0VmlsbGFnZS5zZXRUaXRsZSgpO1xyXG5cclxuXHRcdHRoaXMudXBkYXRlRGVzY3JpcHRpb24oKTtcclxuXHJcblx0XHRXZWF0aGVyLmluaXRpYXRlV2VhdGhlcihWaWxsYWdlLmF2YWlsYWJsZVdlYXRoZXIsICd2aWxsYWdlJyk7XHJcblx0fSxcclxuXHRcclxuXHRzZXRUaXRsZTogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdGl0bGUgPSBfKFwiVGhlIFZpbGxhZ2VcIik7XHJcblx0XHRpZihFbmdpbmUuYWN0aXZlTW9kdWxlID09IHRoaXMpIHtcclxuXHRcdFx0ZG9jdW1lbnQudGl0bGUgPSB0aXRsZTtcclxuXHRcdH1cclxuXHRcdCQoJ2RpdiNsb2NhdGlvbl92aWxsYWdlJykudGV4dCh0aXRsZSk7XHJcblx0fSxcclxuXHRcclxuXHR1cGRhdGVCdXR0b246IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGxpekJ1dHRvbiA9ICQoJyNsaXpCdXR0b24uYnV0dG9uJyk7XHJcblx0XHRpZigkU00uZ2V0KCd2aWxsYWdlLmxpekFjdGl2ZScpICE9PSB1bmRlZmluZWQpIGxpekJ1dHRvbi5zaG93KCk7XHJcblx0XHR2YXIgYnVpbGRpbmdCdXR0b24gPSAkKCcjbmV3QnVpbGRpbmdCdXR0b24uYnV0dG9uJyk7XHJcblx0XHRpZigkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykgIT09IHVuZGVmaW5lZCkgYnVpbGRpbmdCdXR0b24uc2hvdygpO1xyXG5cdFx0dmFyIHN0b3JlQnV0dG9uID0gJCgnI3N0b3JlQnV0dG9uLmJ1dHRvbicpO1xyXG5cdFx0aWYoJFNNLmdldCgnUm9hZC5nb3RBcG9sb2dpemVkJykgIT09IHVuZGVmaW5lZCkgc3RvcmVCdXR0b24uc2hvdygpO1xyXG5cdH0sXHJcblx0XHJcblx0XHJcblx0aGFuZGxlU3RhdGVVcGRhdGVzOiBmdW5jdGlvbihlKXtcclxuXHRcdGlmKGUuY2F0ZWdvcnkgPT0gJ3N0b3Jlcycpe1xyXG5cdFx0XHQvLyBWaWxsYWdlLnVwZGF0ZUJ1aWxkQnV0dG9ucygpO1xyXG5cdFx0fSBlbHNlIGlmKGUuY2F0ZWdvcnkgPT0gJ2luY29tZScpe1xyXG5cdFx0fSBlbHNlIGlmKGUuc3RhdGVOYW1lLmluZGV4T2YoJ2dhbWUuYnVpbGRpbmdzJykgPT09IDApe1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHRlbXBCdWlsZGluZ01lc3NhZ2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnQSBOZXcgQnVpbGRpbmcnKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnVGhpcyBpcyBhIG5ldyBidWlsZGluZy4gVGhlcmUgc2hvdWxkIGJlIHN0dWZmIGluIGl0LCBidXQgdGhpcyBpcyBhIHBsYWNlaG9sZGVyIGZvciBub3cuJyksXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnbGVhdmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnTGFtZScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0b3BlblN0b3JlOiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ1RoZSBTdG9yZScpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKFwiVGhpcyBpcyB0aGUgc3RvcmUuIFRoZXJlJ3Mgbm90aGluZyBoZXJlIHlldCwgdGhvdWdoLlwiKSxcclxuXHRcdFx0XHRcdFx0XyhcIllvdSBmaW5kIGEgZHVzdHkgcGFpciBvZiBkaWNlIGluIHRoZSBjb3JuZXIgYW5kIHRocm93IHRoZW0sIGp1c3QgdG8gc2VlIHdoYXQgaGFwcGVucy5cIilcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRkaWNlOiB7XHJcblx0XHRcdFx0XHRcdGFtb3VudDogMixcclxuXHRcdFx0XHRcdFx0ZGllRmFjZXM6IHtcclxuXHRcdFx0XHRcdFx0XHQxOiAnc2t1bGwnXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdGhhbmRsZXI6ICh2YWxzKSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0Y29uc3QgcmV0dXJuVGV4dCA9IFtdO1xyXG5cdFx0XHRcdFx0XHRcdGlmICgodmFsc1swXSA9PSB2YWxzWzFdKSAmJiB2YWxzWzBdID09IDEpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVyblRleHQucHVzaChcIlNuYWtlIGV5ZXMhIEkgZmVlbCBhIG1pbGQgc2Vuc2Ugb2YgZHJlYWQuXCIpO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodmFsc1swXSA9PSB2YWxzWzFdKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm5UZXh0LnB1c2goXCJXb3csIGRvdWJsZXMuIFRoYXQgc2VlbXMgbHVja3kuXCIpO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoKHZhbHNbMF0gKyB2YWxzWzFdKSA9PSA3KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm5UZXh0LnB1c2goXCJPaCwgbmljZS4gRG8gSSB3aW4gc29tZXRoaW5nP1wiKTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuVGV4dC5wdXNoKFwiSSByb2xsZWQgYSBcIiArICh2YWxzWzBdICsgdmFsc1sxXSkudG9TdHJpbmcoKSArIFwiLiBUaGF0IGRvZXNuJ3Qgc2VlbSBlc3BlY2lhbGx5IG5vdGV3b3J0aHkuXCIpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcmV0dXJuVGV4dDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6ICB7XHJcblx0XHRcdFx0XHRcdHJvbGw6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdSb2xsIFxcJ2VtIGFnYWluJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ3N0YXJ0J31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0bGVhdmU6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdMYW1lJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRwbGF5RGljZUdhbWU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnQSBHYW1lIG9mIENoYW5jZScpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdZb3Ugd2FsayBpbnRvIGEgc2hhZHkgYWxsZXksIGFuZCBhIG1hbiBpbiBhIHdpZGUtYnJpbW1lZCBoYXQgZ2VzdHVyZXMgdG8geW91IHdpdGggZGljZSBpbiBoaXMgaGFuZC4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJIZXksIGJ1ZGR5LCB3YW5uYSBwbGF5IGEgZ2FtZT8gVGhlcmVcXCdzIGEgcHJpemUgaWYgeW91IHdpbiFcIicpLFxyXG5cdFx0XHRcdFx0XHRfKCdXaGF0IGRvIHlvdSBkbz8nKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J3BsYXknOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnSSBsaWtlIHByaXplcycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdnYW1lU3RhcnQnfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnbGVhdmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnTm8gdGhhbmtzJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnZ2FtZVN0YXJ0Jzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdUaGUgbWFuIHJldmVhbHMgYSB0b290aHkgZ3JpbiBhbmQgYmVnaW5zIHRvIGV4cGxhaW4gdGhlIHJ1bGVzLicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIkl0XFwncyB2ZXJ5IHNpbXBsZSwgeW91IGp1c3QgY2hvb3NlIHdoZXRoZXIgeW91IHdhbnQgdG8gdHJ5IHRvIHJvbGwgJ1xyXG5cdFx0XHRcdFx0XHRcdCArICdoaWdoZXIgb3IgbG93ZXIgdGhhbiBtZSwgYW5kIHRoZW4gSSByb2xsLCBhbmQgdGhlbiB5b3Ugcm9sbC4gJyBcclxuXHRcdFx0XHRcdFx0XHQgKyAnSWYgeW91IGNhbGwgaXQgcmlnaHQsIHlvdSB3aW4uXCInKSxcclxuXHRcdFx0XHRcdFx0XygnXCJTbywgd2hhdFxcJ2xsIGl0IGJlPycpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnaGlnaCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdIaWdoJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2hlUm9sbHMnfSxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogKCkgPT4gJFNNLnNldCgnZGljZUdhbWUuaGlnaCcsIDEpXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdsb3cnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnTG93JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2hlUm9sbHMnfSxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogKCkgPT4gJFNNLnNldCgnZGljZUdhbWUubG93JywgMSlcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J2hlUm9sbHMnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1RoZSBtYW5zIGhhdCB0aXBzIGxvdyBhcyBoZSBkcm9wcyB0aGUgZGljZSB0byB0aGUgZ3JvdW5kLicpLFxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGRpY2U6IHtcclxuXHRcdFx0XHRcdFx0YW1vdW50OiAyLFxyXG5cdFx0XHRcdFx0XHRoYW5kbGVyOiAodmFscykgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdGNvbnN0IHJldHVyblRleHQgPSBbXTtcclxuXHRcdFx0XHRcdFx0XHRsZXQgZGljZVZhbCA9IDA7XHJcblx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgaSBpbiB2YWxzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRkaWNlVmFsICs9IHZhbHNbaV1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdCRTTS5zZXQoJ2RpY2VHYW1lLmhpc1JvbGwnLCBkaWNlVmFsKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKCgkU00uZ2V0KCdkaWNlR2FtZS5oaWdoJykgIT09IHVuZGVmaW5lZCkgJiYgZGljZVZhbCA8IDUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVyblRleHQucHVzaChfKCdUaGUgc3RyYW5nZXIgZ3JpbWFjZXMuJykpO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoKCRTTS5nZXQoJ2RpY2VHYW1lLmhpZ2gnKSAhPT0gdW5kZWZpbmVkKSAmJiBkaWNlVmFsID4gOCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuVGV4dC5wdXNoKF8oJ1RoZSBzdHJhbmdlciBncmlucyB3aWNrZWRseS4nKSk7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICgoJFNNLmdldCgnZGljZUdhbWUubG93JykgIT09IHVuZGVmaW5lZCkgJiYgZGljZVZhbCA+IDgpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVyblRleHQucHVzaChfKCdUaGUgc3RyYW5nZXIgZ3JpbWFjZXMuJykpO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoKCRTTS5nZXQoJ2RpY2VHYW1lLmxvdycpICE9PSB1bmRlZmluZWQpICYmIGRpY2VWYWwgPCA1KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm5UZXh0LnB1c2goXygnVGhlIHN0cmFuZ2VyIGdyaW5zIHdpY2tlZGx5LicpKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdHJldHVyblRleHQucHVzaChfKCdIZSBwaWNrcyB1cCB0aGUgZGljZSBhbmQgaG9sZHMgdGhlbSBvdXQgdG8geW91LicpKVxyXG5cdFx0XHRcdFx0XHRcdHJldHVyblRleHQucHVzaChfKCdcIllvdXIgcm9sbC5cIicpKVxyXG5cdFx0XHRcdFx0XHRcdHJldHVybiByZXR1cm5UZXh0O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnb2theSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdSb2xsIFxcJ2VtJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ3lvdVJvbGwnfVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQneW91Um9sbCc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnWW91IGJyaWVmbHkgam9zdGxlIHRoZSBkaWNlLCB0aGVuIGxldCB0aGVtIGZhbGwgd2hlcmUgdGhleSBtYXkuJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRkaWNlOiB7XHJcblx0XHRcdFx0XHRcdGFtb3VudDogMixcclxuXHRcdFx0XHRcdFx0aGFuZGxlcjogKHZhbHMpID0+IHtcclxuXHRcdFx0XHRcdFx0XHRjb25zdCByZXR1cm5UZXh0ID0gW107XHJcblxyXG5cdFx0XHRcdFx0XHRcdGxldCBkaWNlVmFsID0gMDtcclxuXHRcdFx0XHRcdFx0XHRmb3IgKHZhciBpIGluIHZhbHMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGRpY2VWYWwgKz0gdmFsc1tpXVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKCRTTS5nZXQoJ2RpY2VHYW1lLmhpZ2gnKSAmJiBkaWNlVmFsIDwgKCRTTS5nZXQoJ2RpY2VHYW1lLmhpc1JvbGwnKSBhcyBudW1iZXIpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm5UZXh0LnB1c2goJ1lvdXIgZmVlbCBhIHJ1c2ggb2YgZGlzYXBwb2ludG1lbnQuJyk7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICgkU00uZ2V0KCdkaWNlR2FtZS5oaWdoJykgJiYgZGljZVZhbCA+ICgkU00uZ2V0KCdkaWNlR2FtZS5oaXNSb2xsJykgYXMgbnVtYmVyKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuVGV4dC5wdXNoKCdZb3VyIGZlZWwgYSBydXNoIG9mIGV4Y2l0ZW1lbnQuJyk7XHJcblx0XHRcdFx0XHRcdFx0XHQkU00uc2V0KCdkaWNlR2FtZS53aW4nLCAxKTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCRTTS5nZXQoJ2RpY2VHYW1lLmxvdycpICYmIGRpY2VWYWwgPiAoJFNNLmdldCgnZGljZUdhbWUuaGlzUm9sbCcpIGFzIG51bWJlcikpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVyblRleHQucHVzaCgnWW91ciBmZWVsIGEgcnVzaCBvZiBkaXNhcHBvaW50bWVudC4nKTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCRTTS5nZXQoJ2RpY2VHYW1lLmxvdycpICYmIGRpY2VWYWwgPCAoJFNNLmdldCgnZGljZUdhbWUuaGlzUm9sbCcpIGFzIG51bWJlcikpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVyblRleHQucHVzaCgnWW91ciBmZWVsIGEgcnVzaCBvZiBleGNpdGVtZW50LicpO1xyXG5cdFx0XHRcdFx0XHRcdFx0JFNNLnNldCgnZGljZUdhbWUud2luJywgMSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcmV0dXJuVGV4dDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J3Jlc3VsdHMnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogKCkgPT4gKCRTTS5nZXQoJ2RpY2VHYW1lLndpbicpICE9PSB1bmRlZmluZWQpID8gXygnT2gsIG5pY2UnKSA6IF8oJ0F3dywgc2hvb3QnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAncmVzdWx0cyd9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdyZXN1bHRzJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogKCkgPT4gKCRTTS5nZXQoJ2RpY2VHYW1lLndpbicpICE9PSB1bmRlZmluZWQpID8gW1xyXG5cdFx0XHRcdFx0XHRfKCdUaGUgZ2FtYmxlciBjdXJzZXMgdW5kZXIgaGlzIGJyZWF0aCwgdGhlbiBoYW5kcyB5b3Ugc29tZXRoaW5nIGFuZCBxdWlja2x5IHdhbGtzIGF3YXkuJylcclxuXHRcdFx0XHRcdF06IFtfKCdUaGUgZ2FtYmxlclxcJ3MgZmFjZSBzcGxpdHMgaW50byBhIHdpZGUgZ3JpbiBiZWZvcmUgZGlzYXBwZWFyaW5nIGJlbmVhdGggdGhlIGJyaW0uJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiQmV0dGVyIGx1Y2sgbmV4dCB0aW1lIHN0cmFuZ2VyLlwiJyksXHJcblx0XHRcdFx0XHRcdF8oJ0hlIHNpbmtzIGJhY2sgaW50byB0aGUgc2hhZG93cyBvZiB0aGUgYWxsZXksIGFuZCBoaXMgd29yZHMgcmV2ZXJiZXJhdGUgb2ZmIG9mIHRoZSBwYXJhbGxlbCB3YWxscyBsb25nIGFmdGVyIHlvdSBsb3NlIHNpZ2h0IG9mIGhpbS4nKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdG9uTG9hZDogKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRpZiAoJFNNLmdldCgnZGljZUdhbWUud2luJykgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdFx0XHRcdENoYXJhY3Rlci5hZGRUb0ludmVudG9yeSgnZ2FtYmxlci5Qcml6ZScpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnb2theSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdUaGF0IHdhcyBmdW4sIEkgZ3Vlc3MnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiAoKSA9PiAkU00ucmVtb3ZlKCdkaWNlR2FtZScpXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fVxyXG59XHJcbiIsImltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi9CdXR0b25cIjtcclxuaW1wb3J0IHsgSXRlbUxpc3QgfSBmcm9tIFwiLi9pdGVtTGlzdFwiO1xyXG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tIFwiLi4vbm90aWZpY2F0aW9uc1wiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgUXVlc3RMb2cgfSBmcm9tIFwiLi9xdWVzdExvZ1wiO1xyXG5pbXBvcnQgeyBQZXJrTGlzdCB9IGZyb20gXCIuL3BlcmtMaXN0XCI7XHJcblxyXG5leHBvcnQgY29uc3QgQ2hhcmFjdGVyID0ge1xyXG5cdGludmVudG9yeToge30sIC8vIGRpY3Rpb25hcnkgdXNpbmcgaXRlbSBuYW1lIGFzIGtleVxyXG5cdHF1ZXN0U3RhdHVzOiB7fSwgLy8gZGljdGlvbmFyeSB1c2luZyBxdWVzdCBuYW1lIGFzIGtleSwgYW5kIGludGVnZXIgcXVlc3QgcGhhc2UgYXMgdmFsdWVcclxuXHRlcXVpcHBlZEl0ZW1zOiB7XHJcblx0XHQvLyBzdGVhbGluZyB0aGUgS29MIHN0eWxlIGZvciBub3csIHdlJ2xsIHNlZSBpZiBJIG5lZWQgc29tZXRoaW5nXHJcblx0XHQvLyB0aGF0IGZpdHMgdGhlIGdhbWUgYmV0dGVyIGFzIHdlIGdvXHJcblx0XHRoZWFkOiBudWxsLFxyXG5cdFx0dG9yc286IG51bGwsXHJcblx0XHRwYW50czogbnVsbCxcclxuXHRcdC8vIG5vIHdlYXBvbiwgdHJ5IHRvIHNlZSBob3cgZmFyIHdlIGNhbiBnZXQgaW4gdGhpcyBnYW1lIHdpdGhvdXQgZm9jdXNpbmcgb24gY29tYmF0XHJcblx0XHRhY2Nlc3NvcnkxOiBudWxsLFxyXG5cdFx0YWNjZXNzb3J5MjogbnVsbCxcclxuXHRcdGFjY2Vzc29yeTM6IG51bGwsXHJcblx0fSxcclxuXHJcblx0Ly8gc3RhdHMgYmVmb3JlIGFueSBtb2RpZmllcnMgZnJvbSBnZWFyIG9yIHdoYXRldmVyIGVsc2UgYXJlIGFwcGxpZWRcclxuXHRyYXdTdGF0czoge1xyXG5cdFx0J1NwZWVkJzogNSxcclxuXHRcdCdQZXJjZXB0aW9uJzogNSxcclxuXHRcdCdSZXNpbGllbmNlJzogNSxcclxuXHRcdCdJbmdlbnVpdHknOiA1LFxyXG5cdFx0J1RvdWdobmVzcyc6IDVcclxuXHR9LFxyXG5cclxuXHQvLyBwZXJrcyBnaXZlbiBieSBpdGVtcywgY2hhcmFjdGVyIGNob2ljZXMsIGRpdmluZSBwcm92ZW5hbmNlLCBldGMuXHJcblx0cGVya3M6IHsgfSxcclxuXHRwZXJrQXJlYTogbnVsbCxcclxuXHRcclxuXHRpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHRcdFxyXG5cdFx0Ly8gY3JlYXRlIHRoZSBjaGFyYWN0ZXIgYm94XHJcblx0XHRjb25zdCBlbGVtID0gJCgnPGRpdj4nKS5hdHRyKHtcclxuXHRcdFx0aWQ6ICdjaGFyYWN0ZXInLFxyXG5cdFx0XHRjbGFzc05hbWU6ICdjaGFyYWN0ZXInXHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0ZWxlbS5hcHBlbmRUbygnZGl2I3dyYXBwZXInKTtcclxuXHJcblx0XHQvLyB3cml0ZSByYXdTdGF0cyB0byAkU01cclxuXHRcdC8vIE5PVEU6IG5ldmVyIHdyaXRlIGRlcml2ZWQgc3RhdHMgdG8gJFNNLCBhbmQgbmV2ZXIgYWNjZXNzIHJhdyBzdGF0cyBkaXJlY3RseSFcclxuXHRcdC8vIGRvaW5nIHNvIHdpbGwgaW50cm9kdWNlIG9wcG9ydHVuaXRpZXMgdG8gbWVzcyB1cCBzdGF0cyBQRVJNQU5FTlRMWVxyXG4gICAgICAgIGlmICghJFNNLmdldCgnY2hhcmFjdGVyLnJhd3N0YXRzJykpIHtcclxuICAgICAgICAgICAgJFNNLnNldCgnY2hhcmFjdGVyLnJhd3N0YXRzJywgQ2hhcmFjdGVyLnJhd1N0YXRzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cdFx0XHRDaGFyYWN0ZXIucmF3U3RhdHMgPSAkU00uZ2V0KCdjaGFyYWN0ZXIucmF3U3RhdHMnKSBhcyBhbnk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCEkU00uZ2V0KCdjaGFyYWN0ZXIucGVya3MnKSkge1xyXG4gICAgICAgICAgICAkU00uc2V0KCdjaGFyYWN0ZXIucGVya3MnLCBDaGFyYWN0ZXIucGVya3MpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5wZXJrcyA9ICRTTS5nZXQoJ2NoYXJhY3Rlci5wZXJrcycpIGFzIGFueTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoISRTTS5nZXQoJ2NoYXJhY3Rlci5pbnZlbnRvcnknKSkge1xyXG4gICAgICAgICAgICAkU00uc2V0KCdjaGFyYWN0ZXIuaW52ZW50b3J5JywgQ2hhcmFjdGVyLmludmVudG9yeSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHRcdFx0Q2hhcmFjdGVyLmludmVudG9yeSA9ICRTTS5nZXQoJ2NoYXJhY3Rlci5pbnZlbnRvcnknKSBhcyBhbnk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCEkU00uZ2V0KCdjaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcycpKSB7XHJcbiAgICAgICAgICAgICRTTS5zZXQoJ2NoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zJywgQ2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zID0gJFNNLmdldCgnY2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMnKSBhcyBhbnk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCEkU00uZ2V0KCdjaGFyYWN0ZXIucXVlc3RTdGF0dXMnKSkge1xyXG4gICAgICAgICAgICAkU00uc2V0KCdjaGFyYWN0ZXIucXVlc3RTdGF0dXMnLCBDaGFyYWN0ZXIucXVlc3RTdGF0dXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5xdWVzdFN0YXR1cyA9ICRTTS5nZXQoJ2NoYXJhY3Rlci5xdWVzdFN0YXR1cycpIGFzIGFueTtcclxuXHRcdH1cclxuXHJcbiAgICAgICAgJCgnPGRpdj4nKS50ZXh0KCdDaGFyYWN0ZXInKVxyXG5cdFx0LmNzcygndGV4dC1kZWNvcmF0aW9uJywgJ3VuZGVybGluZScpXHJcblx0XHQuYXR0cignaWQnLCAndGl0bGUnKVxyXG5cdFx0LmFwcGVuZFRvKCdkaXYjY2hhcmFjdGVyJyk7XHJcblxyXG5cdFx0Ly8gVE9ETzogcmVwbGFjZSB0aGlzIHdpdGggZGVyaXZlZCBzdGF0c1xyXG4gICAgICAgIGZvcih2YXIgc3RhdCBpbiAkU00uZ2V0KCdjaGFyYWN0ZXIucmF3c3RhdHMnKSBhcyBhbnkpIHtcclxuICAgICAgICAgICAgJCgnPGRpdj4nKS50ZXh0KHN0YXQgKyAnOiAnICsgJFNNLmdldCgnY2hhcmFjdGVyLnJhd3N0YXRzLicgKyBzdGF0KSkuYXBwZW5kVG8oJ2RpdiNjaGFyYWN0ZXInKTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdidXR0b25zJykuY3NzKFwibWFyZ2luLXRvcFwiLCBcIjIwcHhcIikuYXBwZW5kVG8oJ2RpdiNjaGFyYWN0ZXInKTtcclxuXHRcdHZhciBpbnZlbnRvcnlCdXR0b24gPSBCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6IFwiaW52ZW50b3J5XCIsXHJcblx0XHRcdHRleHQ6IFwiSW52ZW50b3J5XCIsXHJcblx0XHRcdGNsaWNrOiBDaGFyYWN0ZXIub3BlbkludmVudG9yeVxyXG5cdFx0fSkuYXBwZW5kVG8oJCgnI2J1dHRvbnMnLCAnZGl2I2NoYXJhY3RlcicpKTtcclxuXHRcdFxyXG5cdFx0dmFyIHF1ZXN0TG9nQnV0dG9uID0gQnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiBcInF1ZXN0TG9nXCIsXHJcblx0XHRcdHRleHQ6IFwiUXVlc3QgTG9nXCIsXHJcblx0XHRcdGNsaWNrOiBDaGFyYWN0ZXIub3BlblF1ZXN0TG9nXHJcblx0XHR9KS5hcHBlbmRUbygkKCcjYnV0dG9ucycsICdkaXYjY2hhcmFjdGVyJykpO1xyXG5cclxuXHRcdHRoaXMucGVya0FyZWEgPSAkKCc8ZGl2PicpLmF0dHIoe1xyXG5cdFx0XHRpZDogJ3BlcmtzJyxcclxuXHRcdFx0Y2xhc3NOYW1lOiAncGVya3MnXHJcblx0XHRcdH0pLmFwcGVuZFRvKCdkaXYjY2hhcmFjdGVyJyk7XHJcblxyXG5cdFx0Ly8gVE9ETzogYWRkIFBlcmtzIGxpc3QgYmVsb3cgaGVyZVxyXG5cdFx0dGhpcy51cGRhdGVQZXJrcygpO1xyXG5cclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdHdpbmRvdy5DaGFyYWN0ZXIgPSB0aGlzO1xyXG5cdH0sXHJcblx0XHJcblx0b3B0aW9uczoge30sIC8vIE5vdGhpbmcgZm9yIG5vd1xyXG5cdFxyXG5cdGVsZW06IG51bGwsXHJcblxyXG5cdGludmVudG9yeURpc3BsYXk6IG51bGwgYXMgYW55LFxyXG5cdHF1ZXN0TG9nRGlzcGxheTogbnVsbCBhcyBhbnksXHJcblxyXG5cdG9wZW5JbnZlbnRvcnk6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gY3JlYXRpbmcgYSBoYW5kbGUgZm9yIGxhdGVyIGFjY2Vzcywgc3VjaCBhcyBjbG9zaW5nIGludmVudG9yeVxyXG5cdFx0Q2hhcmFjdGVyLmludmVudG9yeURpc3BsYXkgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2ludmVudG9yeScpLmFkZENsYXNzKCdldmVudFBhbmVsJykuY3NzKCdvcGFjaXR5JywgJzAnKTtcclxuXHRcdHZhciBpbnZlbnRvcnlEaXNwbGF5ID0gQ2hhcmFjdGVyLmludmVudG9yeURpc3BsYXk7XHJcblx0XHRDaGFyYWN0ZXIuaW52ZW50b3J5RGlzcGxheVxyXG5cdFx0Ly8gc2V0IHVwIGNsaWNrIGFuZCBob3ZlciBoYW5kbGVycyBmb3IgaW52ZW50b3J5IGl0ZW1zXHJcblx0XHQub24oXCJjbGlja1wiLCBcIiNpdGVtXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRDaGFyYWN0ZXIudXNlSW52ZW50b3J5SXRlbSgkKHRoaXMpLmRhdGEoXCJuYW1lXCIpKTtcclxuXHRcdFx0Q2hhcmFjdGVyLmNsb3NlSW52ZW50b3J5KCk7XHJcblx0XHR9KS5vbihcIm1vdXNlZW50ZXJcIiwgXCIjaXRlbVwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHRvb2x0aXAgPSAkKFwiPGRpdiBpZD0ndG9vbHRpcCcgY2xhc3M9J3Rvb2x0aXAnPlwiICsgSXRlbUxpc3RbJCh0aGlzKS5kYXRhKFwibmFtZVwiKV0udGV4dCArIFwiPC9kaXY+XCIpXHJcblx0XHRcdC5hdHRyKCdkYXRhLW5hbWUnLCBpdGVtKTtcclxuXHRcdFx0dG9vbHRpcC5hcHBlbmRUbygkKHRoaXMpKTtcclxuXHRcdH0pLm9uKFwibW91c2VsZWF2ZVwiLCBcIiNpdGVtXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKFwiI3Rvb2x0aXBcIiwgXCIjXCIgKyAkKHRoaXMpLmRhdGEoXCJuYW1lXCIpKS5mYWRlT3V0KCkucmVtb3ZlKCk7XHJcblx0XHR9KTtcclxuXHRcdCQoJzxkaXY+JykuYWRkQ2xhc3MoJ2V2ZW50VGl0bGUnKS50ZXh0KCdJbnZlbnRvcnknKS5hcHBlbmRUbyhpbnZlbnRvcnlEaXNwbGF5KTtcclxuXHRcdHZhciBpbnZlbnRvcnlEZXNjID0gJCgnPGRpdj4nKS50ZXh0KFwiQ2xpY2sgdGhpbmdzIGluIHRoZSBsaXN0IHRvIHVzZSB0aGVtLlwiKVxyXG5cdFx0XHQuaG92ZXIoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIHRvb2x0aXAgPSAkKFwiPGRpdiBpZD0ndG9vbHRpcCcgY2xhc3M9J3Rvb2x0aXAnPlwiICsgXCJOb3QgdGhpcywgdGhvdWdoLlwiICsgXCI8L2Rpdj5cIik7XHJcbiAgICBcdFx0XHR0b29sdGlwLmFwcGVuZFRvKGludmVudG9yeURlc2MpO1xyXG5cdFx0XHR9LCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKFwiI3Rvb2x0aXBcIikuZmFkZU91dCgpLnJlbW92ZSgpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHROb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBfKFwiSSBiZXQgeW91IHRoaW5rIHlvdSdyZSBwcmV0dHkgZnVubnksIGh1aD8gQ2xpY2tpbmcgdGhlIHRoaW5nIEkgc2FpZCB3YXNuJ3QgY2xpY2thYmxlP1wiKSk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5jc3MoXCJtYXJnaW4tYm90dG9tXCIsIFwiMjBweFwiKVxyXG5cdFx0XHQuYXBwZW5kVG8oaW52ZW50b3J5RGlzcGxheSk7XHJcblx0XHRcclxuXHRcdGZvcih2YXIgaXRlbSBpbiBDaGFyYWN0ZXIuaW52ZW50b3J5KSB7XHJcblx0XHRcdC8vIG1ha2UgdGhlIGludmVudG9yeSBjb3VudCBsb29rIGEgYml0IG5pY2VyXHJcblx0XHRcdHZhciBpbnZlbnRvcnlFbGVtID0gJCgnPGRpdj4nKVxyXG5cdFx0XHQuYXR0cignaWQnLCAnaXRlbScpXHJcblx0XHRcdC5hdHRyKCdkYXRhLW5hbWUnLCBpdGVtKVxyXG5cdFx0XHQudGV4dChJdGVtTGlzdFtpdGVtXS5uYW1lICArICcgICh4JyArIENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0udG9TdHJpbmcoKSArICcpJylcclxuXHRcdFx0LmFwcGVuZFRvKGludmVudG9yeURpc3BsYXkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFRPRE86IG1ha2UgdGhpcyBDU1MgYW4gYWN0dWFsIGNsYXNzIHNvbWV3aGVyZSwgSSdtIHN1cmUgSSdsbCBuZWVkIGl0IGFnYWluXHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2J1dHRvbnMnKS5jc3MoXCJtYXJnaW4tdG9wXCIsIFwiMjBweFwiKS5hcHBlbmRUbyhpbnZlbnRvcnlEaXNwbGF5KTtcclxuXHRcdHZhciBiID0gXHJcblx0XHQvL25ldyBcclxuXHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogXCJjbG9zZUludmVudG9yeVwiLFxyXG5cdFx0XHR0ZXh0OiBcIkNsb3NlXCIsXHJcblx0XHRcdGNsaWNrOiBDaGFyYWN0ZXIuY2xvc2VJbnZlbnRvcnlcclxuXHRcdH0pLmFwcGVuZFRvKCQoJyNidXR0b25zJywgaW52ZW50b3J5RGlzcGxheSkpO1xyXG5cdFx0JCgnZGl2I3dyYXBwZXInKS5hcHBlbmQoaW52ZW50b3J5RGlzcGxheSk7XHJcblx0XHRpbnZlbnRvcnlEaXNwbGF5LmFuaW1hdGUoe29wYWNpdHk6IDF9LCBFdmVudHMuX1BBTkVMX0ZBREUsICdsaW5lYXInKTtcclxuXHR9LFxyXG5cclxuXHRjbG9zZUludmVudG9yeTogZnVuY3Rpb24oKSB7XHJcblx0XHRDaGFyYWN0ZXIuaW52ZW50b3J5RGlzcGxheS5lbXB0eSgpO1xyXG5cdFx0Q2hhcmFjdGVyLmludmVudG9yeURpc3BsYXkucmVtb3ZlKCk7XHJcblx0fSxcclxuXHJcblx0YWRkVG9JbnZlbnRvcnk6IGZ1bmN0aW9uKGl0ZW0sIGFtb3VudD0xKSB7XHJcblx0XHRpZiAoQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSkge1xyXG5cdFx0XHRDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dICs9IGFtb3VudDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0gPSBhbW91bnQ7XHJcblx0XHR9XHJcblxyXG5cdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJBZGRlZCBcIiArIEl0ZW1MaXN0W2l0ZW1dLm5hbWUgKyBcIiB0byBpbnZlbnRvcnkuXCIpXHJcblx0XHQkU00uc2V0KCdpbnZlbnRvcnknLCBDaGFyYWN0ZXIuaW52ZW50b3J5KTtcclxuXHR9LFxyXG5cclxuXHJcblx0cmVtb3ZlRnJvbUludmVudG9yeTogZnVuY3Rpb24oaXRlbSwgYW1vdW50PTEpIHtcclxuXHRcdGlmIChDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dKSBDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dIC09IGFtb3VudDtcclxuXHRcdGlmIChDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dIDwgMSkge1xyXG5cdFx0XHRkZWxldGUgQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXTtcclxuXHRcdH1cclxuXHJcblx0XHROb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIlJlbW92ZWQgXCIgKyBJdGVtTGlzdFtpdGVtXS5uYW1lICsgXCIgZnJvbSBpbnZlbnRvcnkuXCIpXHJcblx0XHQkU00uc2V0KCdpbnZlbnRvcnknLCBDaGFyYWN0ZXIuaW52ZW50b3J5KTtcclxuXHR9LFxyXG5cclxuXHR1c2VJbnZlbnRvcnlJdGVtOiBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRpZiAoQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSAmJiBDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dID4gMCkge1xyXG5cdFx0XHQvLyB1c2UgdGhlIGVmZmVjdCBpbiB0aGUgaW52ZW50b3J5OyBqdXN0IGluIGNhc2UgYSBuYW1lIG1hdGNoZXMgYnV0IHRoZSBlZmZlY3RcclxuXHRcdFx0Ly8gZG9lcyBub3QsIGFzc3VtZSB0aGUgaW52ZW50b3J5IGl0ZW0gaXMgdGhlIHNvdXJjZSBvZiB0cnV0aFxyXG5cdFx0XHRJdGVtTGlzdFtpdGVtXS5vblVzZSgpO1xyXG5cdFx0XHRpZiAodHlwZW9mKEl0ZW1MaXN0W2l0ZW1dLmRlc3Ryb3lPblVzZSkgPT0gXCJmdW5jdGlvblwiICYmIEl0ZW1MaXN0W2l0ZW1dLmRlc3Ryb3lPblVzZSgpKSB7XHJcblx0XHRcdFx0Q2hhcmFjdGVyLnJlbW92ZUZyb21JbnZlbnRvcnkoaXRlbSk7XHJcblx0XHRcdH0gZWxzZSBpZiAoSXRlbUxpc3RbaXRlbV0uZGVzdHJveU9uVXNlKSB7XHJcblx0XHRcdFx0Q2hhcmFjdGVyLnJlbW92ZUZyb21JbnZlbnRvcnkoaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQkU00uc2V0KCdpbnZlbnRvcnknLCBDaGFyYWN0ZXIuaW52ZW50b3J5KTtcclxuXHR9LFxyXG5cclxuXHRlcXVpcEl0ZW06IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdGlmIChJdGVtTGlzdFtpdGVtXS5zbG90ICYmIENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zW0l0ZW1MaXN0W2l0ZW1dLnNsb3RdICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0Q2hhcmFjdGVyLmFkZFRvSW52ZW50b3J5KENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zW0l0ZW1MaXN0W2l0ZW1dLnNsb3RdKTtcclxuXHRcdFx0Q2hhcmFjdGVyLmVxdWlwcGVkSXRlbXNbSXRlbUxpc3RbaXRlbV0uc2xvdF0gPSBpdGVtO1xyXG5cdFx0XHRpZiAoSXRlbUxpc3RbaXRlbV0ub25FcXVpcCkge1xyXG5cdFx0XHRcdEl0ZW1MaXN0W2l0ZW1dLm9uRXF1aXAoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRDaGFyYWN0ZXIuYXBwbHlFcXVpcG1lbnRFZmZlY3RzKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0JFNNLnNldCgnZXF1aXBwZWRJdGVtcycsIENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zKTtcclxuXHRcdCRTTS5zZXQoJ2ludmVudG9yeScsIENoYXJhY3Rlci5pbnZlbnRvcnkpO1xyXG5cdH0sXHJcblxyXG5cdGdyYW50UGVyazogZnVuY3Rpb24ocGVyaykge1xyXG5cdFx0aWYgKENoYXJhY3Rlci5wZXJrc1twZXJrXSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGlmKHBlcmsudGltZUxlZnQgPiAwKSB7XHJcblx0XHRcdFx0Q2hhcmFjdGVyLnBlcmtzW3BlcmtdICs9IHBlcmsudGltZUxlZnQ7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5wZXJrc1twZXJrXSA9IHBlcms7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy51cGRhdGVQZXJrcygpO1xyXG5cclxuXHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KCdudWxsJywgXCJBY3F1aXJlZCBlZmZlY3Q6IFwiICsgUGVya0xpc3RbcGVya10ubmFtZSk7XHJcblx0XHRcclxuXHRcdCRTTS5zZXQoJ3BlcmtzJywgQ2hhcmFjdGVyLnBlcmtzKTtcclxuXHR9LFxyXG5cclxuXHRyZW1vdmVQZXJrOiBmdW5jdGlvbihwZXJrKSB7XHJcblx0XHRpZiAoQ2hhcmFjdGVyLnBlcmtzW3BlcmsubmFtZV0gIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRkZWxldGUgQ2hhcmFjdGVyLnBlcmtzW3BlcmsubmFtZV07XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy51cGRhdGVQZXJrcygpO1xyXG5cclxuXHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KCdudWxsJywgXCJMb3N0IGVmZmVjdDogXCIgKyBQZXJrTGlzdFtwZXJrXS5uYW1lKTtcclxuXHJcblx0XHQkU00uc2V0KCdwZXJrcycsIENoYXJhY3Rlci5wZXJrcyk7XHJcblx0fSxcclxuXHJcblx0dXBkYXRlUGVya3M6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5wZXJrQXJlYS5lbXB0eSgpO1xyXG5cdFx0aWYgKE9iamVjdC5rZXlzKHRoaXMucGVya3MpLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0JCgnPGRpdj4nKS50ZXh0KCdQZXJrcycpXHJcblx0XHRcdC5jc3MoJ3RleHQtZGVjb3JhdGlvbicsICd1bmRlcmxpbmUnKVxyXG5cdFx0XHQuY3NzKCdtYXJnaW4tdG9wJywgJzEwcHgnKVxyXG5cdFx0XHQuYXR0cignaWQnLCAndGl0bGUnKVxyXG5cdFx0XHQuYXBwZW5kVG8oJ2RpdiNwZXJrcycpO1xyXG5cdFx0XHQvLyBzZXQgdXAgY2xpY2sgYW5kIGhvdmVyIGhhbmRsZXJzIGZvciBwZXJrc1xyXG5cdFx0dGhpcy5wZXJrQXJlYVxyXG5cdFx0Lm9uKFwiY2xpY2tcIiwgXCIjcGVya1wiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly8gaGFuZGxlIHRoaXMgd2hlbiB3ZSBoYXZlIHBlcmsgZGVzY3JpcHRpb25zIGFuZCBzdHVmZlxyXG5cdFx0fSkub24oXCJtb3VzZWVudGVyXCIsIFwiI3BlcmtcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciB0b29sdGlwID0gJChcIjxkaXYgaWQ9J3Rvb2x0aXAnIGNsYXNzPSd0b29sdGlwJz5cIiArIFBlcmtMaXN0WyQodGhpcykuZGF0YShcIm5hbWVcIildLnRleHQgKyBcIjwvZGl2PlwiKVxyXG5cdFx0XHQuYXR0cignZGF0YS1uYW1lJywgcGVyayk7XHJcblx0XHRcdHRvb2x0aXAuYXBwZW5kVG8oJCh0aGlzKSk7XHJcblx0XHR9KS5vbihcIm1vdXNlbGVhdmVcIiwgXCIjcGVya1wiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0JChcIiN0b29sdGlwXCIsIFwiI1wiICsgJCh0aGlzKS5kYXRhKFwibmFtZVwiKSkuZmFkZU91dCgpLnJlbW92ZSgpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0XHRmb3IodmFyIHBlcmsgaW4gQ2hhcmFjdGVyLnBlcmtzKSB7XHJcblx0XHRcdFx0Ly8gYWRkIG1vdXNlb3ZlciBhbmQgY2xpY2sgc3R1ZmZcclxuXHRcdFx0XHR2YXIgcGVya0VsZW0gPSAkKCc8ZGl2PicpXHJcblx0XHRcdFx0LmF0dHIoJ2lkJywgJ3BlcmsnKVxyXG5cdFx0XHRcdC5hdHRyKCdkYXRhLW5hbWUnLCBwZXJrKVxyXG5cdFx0XHRcdC50ZXh0KFBlcmtMaXN0W3BlcmtdLm5hbWUpXHJcblx0XHRcdFx0LmFwcGVuZFRvKCdkaXYjcGVya3MnKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdG9wZW5RdWVzdExvZzogZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBjcmVhdGluZyBhIGhhbmRsZSBmb3IgbGF0ZXIgYWNjZXNzLCBzdWNoIGFzIGNsb3NpbmcgcXVlc3QgbG9nXHJcblx0XHRDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5ID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdxdWVzdCcpLmFkZENsYXNzKCdldmVudFBhbmVsJykuY3NzKCdvcGFjaXR5JywgJzAnKTtcclxuXHRcdHZhciBxdWVzdExvZ0Rpc3BsYXkgPSBDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5O1xyXG5cdFx0Q2hhcmFjdGVyLnF1ZXN0TG9nRGlzcGxheVxyXG5cdFx0Ly8gc2V0IHVwIGNsaWNrIGFuZCBob3ZlciBoYW5kbGVycyBmb3IgcXVlc3RzXHJcblx0XHQub24oXCJjbGlja1wiLCBcIiNxdWVzdFwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0Q2hhcmFjdGVyLmRpc3BsYXlRdWVzdCgkKHRoaXMpLmRhdGEoXCJuYW1lXCIpKTtcclxuXHRcdH0pO1xyXG5cdFx0JCgnPGRpdj4nKS5hZGRDbGFzcygnZXZlbnRUaXRsZScpLnRleHQoJ1F1ZXN0IExvZycpLmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHR2YXIgcXVlc3RMb2dEZXNjID0gJCgnPGRpdj4nKS50ZXh0KFwiQ2xpY2sgcXVlc3QgbmFtZXMgdG8gc2VlIG1vcmUgaW5mby5cIilcclxuXHRcdFx0LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCIyMHB4XCIpXHJcblx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0XHJcblx0XHRmb3IodmFyIHF1ZXN0IGluIENoYXJhY3Rlci5xdWVzdFN0YXR1cykge1xyXG5cdFx0XHR2YXIgcXVlc3RFbGVtID0gJCgnPGRpdj4nKVxyXG5cdFx0XHQuYXR0cignaWQnLCBcInF1ZXN0XCIpXHJcblx0XHRcdC5hdHRyKCdkYXRhLW5hbWUnLCBxdWVzdClcclxuXHRcdFx0LnRleHQoUXVlc3RMb2dbcXVlc3RdLm5hbWUpXHJcblx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0XHRpZiAoQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW3F1ZXN0XSA9PSAtMSkge1xyXG5cdFx0XHRcdHF1ZXN0RWxlbVxyXG5cdFx0XHRcdC8vIEkgd2FudCB0aGlzIHRvIGJlIG5vdCBzdHJ1Y2sgdGhyb3VnaCwgYnV0IHRoYXQncyB0b28gYW5ub3lpbmcgdG8gd29ycnlcclxuXHRcdFx0XHQvLyBhYm91dCByaWdodCBub3dcclxuXHRcdFx0XHQvLyAucHJlcGVuZChcIkRPTkUgXCIpXHJcblx0XHRcdFx0LndyYXAoXCI8c3RyaWtlPlwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFRPRE86IG1ha2UgdGhpcyBDU1MgYW4gYWN0dWFsIGNsYXNzIHNvbWV3aGVyZSwgSSdtIHN1cmUgSSdsbCBuZWVkIGl0IGFnYWluXHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2J1dHRvbnMnKS5jc3MoXCJtYXJnaW4tdG9wXCIsIFwiMjBweFwiKS5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0dmFyIGIgPSBCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6IFwiY2xvc2VRdWVzdExvZ1wiLFxyXG5cdFx0XHR0ZXh0OiBcIkNsb3NlXCIsXHJcblx0XHRcdGNsaWNrOiBDaGFyYWN0ZXIuY2xvc2VRdWVzdExvZ1xyXG5cdFx0fSkuYXBwZW5kVG8oJCgnI2J1dHRvbnMnLCBxdWVzdExvZ0Rpc3BsYXkpKTtcclxuXHRcdCQoJ2RpdiN3cmFwcGVyJykuYXBwZW5kKHF1ZXN0TG9nRGlzcGxheSk7XHJcblx0XHRxdWVzdExvZ0Rpc3BsYXkuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIEV2ZW50cy5fUEFORUxfRkFERSwgJ2xpbmVhcicpO1xyXG5cdH0sXHJcblxyXG5cdGRpc3BsYXlRdWVzdDogZnVuY3Rpb24ocXVlc3Q6IHN0cmluZykge1xyXG5cdFx0Y29uc3QgcXVlc3RMb2dEaXNwbGF5ID0gQ2hhcmFjdGVyLnF1ZXN0TG9nRGlzcGxheTtcclxuXHRcdHF1ZXN0TG9nRGlzcGxheS5lbXB0eSgpO1xyXG5cdFx0Y29uc3QgY3VycmVudFF1ZXN0ID0gUXVlc3RMb2dbcXVlc3RdO1xyXG5cclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAncXVlc3QnKS5hZGRDbGFzcygnZXZlbnRQYW5lbCcpLmNzcygnb3BhY2l0eScsICcwJyk7XHJcblx0XHQkKCc8ZGl2PicpLmFkZENsYXNzKCdldmVudFRpdGxlJykudGV4dChjdXJyZW50UXVlc3QubmFtZSkuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHJcblx0XHR2YXIgcXVlc3RMb2dEZXNjID0gJCgnPGRpdj4nKS50ZXh0KGN1cnJlbnRRdWVzdC5sb2dEZXNjcmlwdGlvbilcclxuXHRcdFx0LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCIyMHB4XCIpXHJcblx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cclxuXHRcdGlmIChDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdIGFzIG51bWJlciA9PSAtMSkge1xyXG5cdFx0XHR2YXIgcGhhc2VEZXNjID0gJCgnPGRpdj4nKS50ZXh0KFwiVGhpcyBxdWVzdCBpcyBjb21wbGV0ZSFcIilcclxuXHRcdFx0LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCIxMHB4XCIpXHJcblx0XHRcdC5hcHBlbmRUbyhxdWVzdExvZ0Rpc3BsYXkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDw9IChDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdIGFzIG51bWJlcik7IGkrKykge1xyXG5cdFx0XHR2YXIgcGhhc2VEZXNjID0gJCgnPGRpdj4nKS50ZXh0KGN1cnJlbnRRdWVzdC5waGFzZXNbaV0uZGVzY3JpcHRpb24pXHJcblx0XHRcdC5jc3MoXCJtYXJnaW4tYm90dG9tXCIsIFwiMTBweFwiKVxyXG5cdFx0XHQuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHRcdFx0dmFyIGNvbXBsZXRlID0gdHJ1ZTtcclxuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBPYmplY3Qua2V5cyhjdXJyZW50UXVlc3QucGhhc2VzW2ldLnJlcXVpcmVtZW50cykubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHR2YXIgcmVxdWlyZW1lbnRzRGVzYyA9ICQoJzxkaXY+JykudGV4dChjdXJyZW50UXVlc3QucGhhc2VzW2ldLnJlcXVpcmVtZW50c1tqXS5yZW5kZXJSZXF1aXJlbWVudCgpKVxyXG5cdFx0XHRcdFx0LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCIyMHB4XCIpXHJcblx0XHRcdFx0XHQuY3NzKFwibWFyZ2luLWxlZnRcIiwgXCIyMHB4XCIpXHJcblx0XHRcdFx0XHQuY3NzKCdmb250LXN0eWxlJywgJ2l0YWxpYycpXHJcblx0XHRcdFx0XHQuYXBwZW5kVG8ocXVlc3RMb2dEaXNwbGF5KTtcclxuXHRcdFx0XHRpZiAoIWN1cnJlbnRRdWVzdC5waGFzZXNbaV0ucmVxdWlyZW1lbnRzW2pdLmlzQ29tcGxldGUoKSkgY29tcGxldGUgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoY29tcGxldGUpIHtcclxuXHRcdFx0XHRwaGFzZURlc2Mud3JhcChcIjxzdHJpa2U+XCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVE9ETzogbWFrZSB0aGlzIENTUyBhbiBhY3R1YWwgY2xhc3Mgc29tZXdoZXJlLCBJJ20gc3VyZSBJJ2xsIG5lZWQgaXQgYWdhaW5cclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnYnV0dG9ucycpLmNzcyhcIm1hcmdpbi10b3BcIiwgXCIyMHB4XCIpLmFwcGVuZFRvKHF1ZXN0TG9nRGlzcGxheSk7XHJcblxyXG5cdFx0dmFyIGIgPSBCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6IFwiYmFja1RvUXVlc3RMb2dcIixcclxuXHRcdFx0dGV4dDogXCJCYWNrIHRvIFF1ZXN0IExvZ1wiLFxyXG5cdFx0XHRjbGljazogQ2hhcmFjdGVyLmJhY2tUb1F1ZXN0TG9nXHJcblx0XHR9KS5hcHBlbmRUbygkKCcjYnV0dG9ucycsIHF1ZXN0TG9nRGlzcGxheSkpO1xyXG5cclxuXHRcdHZhciBiID0gQnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiBcImNsb3NlUXVlc3RMb2dcIixcclxuXHRcdFx0dGV4dDogXCJDbG9zZVwiLFxyXG5cdFx0XHRjbGljazogQ2hhcmFjdGVyLmNsb3NlUXVlc3RMb2dcclxuXHRcdH0pLmFwcGVuZFRvKCQoJyNidXR0b25zJywgcXVlc3RMb2dEaXNwbGF5KSk7XHJcblx0fSxcclxuXHJcblx0Y2xvc2VRdWVzdExvZzogZnVuY3Rpb24oKSB7XHJcblx0XHRDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5LmVtcHR5KCk7XHJcblx0XHRDaGFyYWN0ZXIucXVlc3RMb2dEaXNwbGF5LnJlbW92ZSgpO1xyXG5cdH0sXHJcblxyXG5cdGJhY2tUb1F1ZXN0TG9nOiBmdW5jdGlvbigpIHtcclxuXHRcdENoYXJhY3Rlci5jbG9zZVF1ZXN0TG9nKCk7XHJcblx0XHRDaGFyYWN0ZXIub3BlblF1ZXN0TG9nKCk7XHJcblx0fSxcclxuXHJcblx0c2V0UXVlc3RTdGF0dXM6IGZ1bmN0aW9uKHF1ZXN0LCBwaGFzZSkge1xyXG5cdFx0Ly8gbWlnaHQgYmUgYSBnb29kIGlkZWEgdG8gY2hlY2sgZm9yIGxpbmVhciBxdWVzdCBwcm9ncmVzc2lvbiBoZXJlP1xyXG5cdFx0aWYgKFF1ZXN0TG9nW3F1ZXN0XSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdENoYXJhY3Rlci5xdWVzdFN0YXR1c1txdWVzdF0gPSBwaGFzZTtcclxuXHJcblx0XHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiUXVlc3QgTG9nIHVwZGF0ZWQuXCIpO1xyXG5cdFx0XHQkU00uc2V0KCdxdWVzdFN0YXR1cycsIENoYXJhY3Rlci5xdWVzdFN0YXR1cyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Y2hlY2tRdWVzdFN0YXR1czogZnVuY3Rpb24ocXVlc3QpIHtcclxuXHRcdGNvbnN0IGN1cnJlbnRQaGFzZSA9IFF1ZXN0TG9nW3F1ZXN0XS5waGFzZXNbQ2hhcmFjdGVyLnF1ZXN0U3RhdHVzW3F1ZXN0XV07XHJcblxyXG5cdFx0aWYgKGN1cnJlbnRQaGFzZSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG5cdFx0dmFyIGNvbXBsZXRlID0gdHJ1ZTtcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgT2JqZWN0LmtleXMoY3VycmVudFBoYXNlLnJlcXVpcmVtZW50cykubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKCFjdXJyZW50UGhhc2UucmVxdWlyZW1lbnRzW2ldLmlzQ29tcGxldGUoKSlcclxuXHRcdFx0XHRjb21wbGV0ZSA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChjb21wbGV0ZSkge1xyXG5cdFx0XHQvLyBpZiB0aGVyZSBpcyBhIG5leHQgcGhhc2UsIHNldCBxdWVzdFN0YXR1cyB0byBpdFxyXG5cdFx0XHRpZiAoUXVlc3RMb2dbcXVlc3RdLnBoYXNlc1tDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdICsgMV0gIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdENoYXJhY3Rlci5xdWVzdFN0YXR1c1txdWVzdF0gKz0gMTtcclxuXHRcdFx0fSBlbHNlIHsgLy8gZWxzZSBzZXQgaXQgdG8gY29tcGxldGVcclxuXHRcdFx0XHRDaGFyYWN0ZXIucXVlc3RTdGF0dXNbcXVlc3RdID0gLTE7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJRdWVzdCBMb2cgdXBkYXRlZC5cIik7XHJcblx0XHQkU00uc2V0KCdxdWVzdFN0YXR1cycsIENoYXJhY3Rlci5xdWVzdFN0YXR1cyk7XHJcblx0fSxcclxuXHJcblx0Ly8gYXBwbHkgZXF1aXBtZW50IGVmZmVjdHMsIHdoaWNoIHNob3VsZCBhbGwgY2hlY2sgYWdhaW5zdCAkU00gc3RhdGUgdmFyaWFibGVzO1xyXG5cdC8vIHRoaXMgc2hvdWxkIGJlIGNhbGxlZCBvbiBiYXNpY2FsbHkgZXZlcnkgcGxheWVyIGFjdGlvbiB3aGVyZSBhIHBpZWNlIG9mIGdlYXJcclxuXHQvLyB3b3VsZCBkbyBzb21ldGhpbmcgb3IgY2hhbmdlIGFuIG91dGNvbWU7IGdpdmUgZXh0cmFQYXJhbXMgdG8gdGhlIGVmZmVjdCBiZWluZyBcclxuXHQvLyBhcHBsaWVkIGZvciBhbnl0aGluZyB0aGF0J3MgcmVsZXZhbnQgdG8gdGhlIGVmZmVjdCBidXQgbm90IGhhbmRsZWQgYnkgJFNNXHJcblx0YXBwbHlFcXVpcG1lbnRFZmZlY3RzOiBmdW5jdGlvbihleHRyYVBhcmFtcz8pIHtcclxuXHRcdGZvciAoY29uc3QgaXRlbSBpbiBDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcykge1xyXG5cdFx0XHRpZiAoSXRlbUxpc3RbaXRlbV0uZWZmZWN0cykge1xyXG5cdFx0XHRcdGZvciAoY29uc3QgZWZmZWN0IGluIEl0ZW1MaXN0W2l0ZW1dLmVmZmVjdHMpIHtcclxuXHRcdFx0XHRcdC8vIE5PVEU6IGN1cnJlbnRseSB0aGlzIGlzIGdvb2QgZm9yIGFwcGx5aW5nIHBlcmtzIGFuZCBOb3RpZnlpbmc7XHJcblx0XHRcdFx0XHQvLyBhcmUgdGhlcmUgb3RoZXIgc2l0dWF0aW9ucyB3aGVyZSB3ZSdkIHdhbnQgdG8gYXBwbHkgZWZmZWN0cyxcclxuXHRcdFx0XHRcdC8vIG9yIGNhbiB3ZSBjb3ZlciBiYXNpY2FsbHkgZXZlcnkgY2FzZSB2aWEgdGhvc2UgdGhpbmdzP1xyXG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdFx0aWYgKGVmZmVjdC5pc0FjdGl2ZSAmJiBlZmZlY3QuaXNBY3RpdmUoZXh0cmFQYXJhbXMpKSBlZmZlY3QuYXBwbHkoZXh0cmFQYXJhbXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8vIGdldCBzdGF0cyBhZnRlciBhcHBseWluZyBhbGwgZXF1aXBtZW50IGJvbnVzZXMsIHBlcmtzLCBldGMuXHJcblx0Z2V0RGVyaXZlZFN0YXRzOiBmdW5jdGlvbigpIHtcclxuXHRcdGNvbnN0IGRlcml2ZWRTdGF0cyA9IHN0cnVjdHVyZWRDbG9uZShDaGFyYWN0ZXIucmF3U3RhdHMpO1xyXG5cdFx0Zm9yIChjb25zdCBpdGVtIGluIENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zKSB7XHJcblx0XHRcdGlmIChJdGVtTGlzdFtpdGVtXS5zdGF0Qm9udXNlcykge1xyXG5cdFx0XHRcdGZvciAoY29uc3Qgc3RhdCBpbiBPYmplY3Qua2V5cyhJdGVtTGlzdFtpdGVtXS5zdGF0Qm9udXNlcykpIHtcclxuXHRcdFx0XHRcdGlmICh0eXBlb2YgKEl0ZW1MaXN0W2l0ZW1dLnN0YXRCb251c2VzW3N0YXRdID09IFwiZnVuY3Rpb25cIikpIHtcclxuXHRcdFx0XHRcdFx0ZGVyaXZlZFN0YXRzW3N0YXRdICs9IEl0ZW1MaXN0W2l0ZW1dLnN0YXRCb251c2VzW3N0YXRdKCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRkZXJpdmVkU3RhdHNbc3RhdF0gKz0gSXRlbUxpc3RbaXRlbV0uc3RhdEJvbnVzZXNbc3RhdF07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yIChjb25zdCBwZXJrIGluIENoYXJhY3Rlci5wZXJrcykge1xyXG5cdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdGlmIChwZXJrLnN0YXRCb251c2VzKSB7XHJcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdGZvciAoY29uc3Qgc3RhdCBpbiBPYmplY3Qua2V5cyhwZXJrLnN0YXRCb251c2VzKSkge1xyXG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiAocGVyay5zdGF0Qm9udXNlc1tzdGF0XSA9PSBcImZ1bmN0aW9uXCIpKSB7XHJcblx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdFx0XHRcdFx0ZGVyaXZlZFN0YXRzW3N0YXRdICs9IHBlcmsuc3RhdEJvbnVzZXNbc3RhdF0oKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdFx0XHRcdFx0ZGVyaXZlZFN0YXRzW3N0YXRdICs9IHBlcmsuc3RhdEJvbnVzZXNbc3RhdF07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGRlcml2ZWRTdGF0cztcclxuXHR9XHJcbn0iLCIvLyBhbGwgaXRlbXMgZ28gaGVyZSwgc28gdGhhdCBub3RoaW5nIHNpbGx5IGhhcHBlbnMgaW4gdGhlIGV2ZW50IHRoYXQgdGhleSBnZXQgcHV0IGluIExvY2FsIFN0b3JhZ2VcclxuLy8gYXMgcGFydCBvZiB0aGUgc3RhdGUgbWFuYWdlbWVudCBjb2RlOyBwbGVhc2Ugc2F2ZSBpdGVtIG5hbWVzIHRvIHRoZSBpbnZlbnRvcnksIGFuZCB0aGVuIHJlZmVyIHRvIFxyXG4vLyB0aGUgaXRlbSBsaXN0IHZpYSB0aGUgaXRlbSBuYW1lXHJcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4vY2hhcmFjdGVyXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBOb3RpZmljYXRpb25zIH0gZnJvbSBcIi4uL25vdGlmaWNhdGlvbnNcIjtcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gXCIuL2l0ZW1cIjtcclxuXHJcbi8vIERldGFpbHMgZm9yIGFsbCBpbi1nYW1lIGl0ZW1zOyB0aGUgQ2hhcmFjdGVyIGludmVudG9yeSBvbmx5IGhvbGRzIGl0ZW0gSURzXHJcbi8vIGFuZCBhbW91bnRzXHJcbmV4cG9ydCBjb25zdCBJdGVtTGlzdDoge1tpZDogc3RyaW5nXTogSXRlbX0gPSB7XHJcbiAgICBcIkxpei53ZWlyZEJvb2tcIjoge1xyXG4gICAgICAgIG5hbWU6ICdXZWlyZCBCb29rJyxcclxuICAgICAgICBwbHVyYWxOYW1lOiAnV2VpcmQgQm9va3MnLFxyXG4gICAgICAgIHRleHQ6IF8oJ0EgYm9vayB5b3UgZm91bmQgYXQgTGl6XFwncyBwbGFjZS4gU3VwcG9zZWRseSBoYXMgaW5mb3JtYXRpb24gYWJvdXQgQ2hhZHRvcGlhLicpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHsgXHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAgXyhcIkEgQnJpZWYgSGlzdG9yeSBvZiBDaGFkdG9waWFcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKCdUaGlzIGJvb2sgaXMgcHJldHR5IGJvcmluZywgYnV0IHlvdSBtYW5hZ2UgdG8gbGVhcm4gYSBiaXQgbW9yZSBpbiBzcGl0ZSBvZiB5b3VyIHBvb3IgYXR0ZW50aW9uIHNwYW4uJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKCdGb3IgZXhhbXBsZSwgeW91IGxlYXJuIHRoYXQgXCJDaGFkdG9waWFcIiBkb2VzblxcJ3QgaGF2ZSBhIGNhcGl0YWwgXFwnVFxcJy4gVGhhdFxcJ3MgcHJldHR5IGNvb2wsIGh1aD8nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oJy4uLiBXaGF0IHdlcmUgeW91IGRvaW5nIGFnYWluPycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1NvbWV0aGluZyBjb29sZXIgdGhhbiByZWFkaW5nLCBwcm9iYWJseScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiAoKSA9PiBDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoXCJMaXouYm9yaW5nQm9va1wiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IHRydWUsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG5cclxuICAgIFwiTGl6LmJvcmluZ0Jvb2tcIjoge1xyXG4gICAgICAgIG5hbWU6ICdcIkEgQnJpZWYgSGlzdG9yeSBvZiBDaGFkdG9waWFcIicsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ011bHRpcGxlIGNvcGllcyBvZiBcIkEgQnJpZWYgSGlzdG9yeSBvZiBDaGFkdG9waWFcIicsXHJcbiAgICAgICAgdGV4dDogXygnTWFuLCB0aGlzIGJvb2sgaXMgYm9yaW5nLicpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IF8oXCJBIEJyaWVmIFN1bW1hcnkgb2YgYSBCcmllZiBIaXN0b3J5IG9mIENoYWR0b3BpYVwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtfKCdJdFxcJ3Mgc3RpbGwganVzdCBhcyBib3JpbmcgYXMgd2hlbiB5b3UgbGFzdCB0cmllZCB0byByZWFkIGl0LicpXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnRGFuZy4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIFwiU3RyYW5nZXIuc21vb3RoU3RvbmVcIjoge1xyXG4gICAgICAgIG5hbWU6ICdhIHNtb290aCBibGFjayBzdG9uZScsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ3Ntb290aCBibGFjayBzdG9uZXMnLFxyXG4gICAgICAgIHRleHQ6IF8oJ0l0XFwncyB3ZWlyZGx5IGVlcmllJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAoISRTTS5nZXQoJ2tub3dsZWRnZS5TdHJhbmdlci5zbW9vdGhTdG9uZScpKSB7XHJcbiAgICAgICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCAnWW91IGhhdmUgbm8gaWRlYSB3aGF0IHRvIGRvIHdpdGggdGhpcyB0aGluZy4nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEgc21vb3RoIGJsYWNrIHN0b25lXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW18oXCJJJ20gZ2VudWluZWx5IG5vdCBzdXJlIGhvdyB5b3UgZ290IHRvIHRoaXMgZXZlbnQsIGJ1dCBwbGVhc2UgbGV0IG1lIGtub3cgdmlhIEdpdEh1YiBpc3N1ZSwgeW91IGxpdHRsZSBzdGlua2VyLlwiKV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0kgc3dlYXIgdG8gZG8gdGhpcywgYXMgYSByZXNwb25zaWJsZSBjaXRpemVuIG9mIEVhcnRoJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveU9uVXNlOiBmYWxzZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH0sXHJcbiAgICBcIlN0cmFuZ2VyLndyYXBwZWRLbmlmZVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ2Ega25pZmUgd3JhcHBlZCBpbiBjbG90aCcsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ0tuaXZlcyB3cmFwcGVkIGluIHNlcGFyYXRlIGNsb3RocycsXHJcbiAgICAgICAgdGV4dDogXygnTWFuLCBJIGhvcGUgaXRcXCdzIG5vdCBhbGwgbGlrZSwgYmxvb2R5IG9uIHRoZSBibGFkZSBhbmQgc3R1ZmYuJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEga25pZmUgd3JhcHBlZCBpbiBjbG90aFwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtfKFwiWW91IHVud3JhcCB0aGUga25pZmUgY2FyZWZ1bGx5LiBJdCBzZWVtcyB0byBiZSBoaWdobHkgb3JuYW1lbnRlZCwgYW5kIHlvdSBjb3VsZCBwcm9iYWJseSBkbyBzb21lIGNyaW1lcyB3aXRoIGl0LlwiKV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0hlbGwgeWVhaCwgQWRvbGYgTG9vcyBzdHlsZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiAoKSA9PiBDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoXCJTdHJhbmdlci5zaWx2ZXJLbmlmZVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IHRydWUsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgXCJTdHJhbmdlci5zaWx2ZXJLbmlmZVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ2Egc2lsdmVyIGtuaWZlJyxcclxuICAgICAgICBwbHVyYWxOYW1lOiAnc2lsdmVyIGtuaXZlcycsXHJcbiAgICAgICAgdGV4dDogXygnSGlnaGx5IG9ybmFtZW50ZWQnKSxcclxuICAgICAgICBvblVzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBfKFwiQSBzaWx2ZXIga25pZmVcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiT25lIGRheSB5b3UnbGwgYmUgYWJsZSB0byBlcXVpcCB0aGlzLCBidXQgcmlnaHQgbm93IHRoYXQgZnVuY3Rpb25hbGl0eSBpc24ndCBwcmVzZW50LlwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJQbGVhc2UgcG9saXRlbHkgbGVhdmUgdGhlIHByZW1pc2VzIHdpdGhvdXQgYWNrbm93bGVkZ2luZyB0aGlzIG1pc3NpbmcgZmVhdHVyZS5cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnWW91IGdvdCBpdCwgY2hpZWYnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIFwiU3RyYW5nZXIuY2xvdGhCdW5kbGVcIjoge1xyXG4gICAgICAgIG5hbWU6ICdhIGJ1bmRsZSBvZiBjbG90aCcsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ2J1bmRsZXMgb2YgY2xvdGgnLFxyXG4gICAgICAgIHRleHQ6IF8oJ1doYXQgbGllcyB3aXRoaW4/JyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEgYnVuZGxlIG9mIGNsb3RoXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIk9uZSBkYXkgeW91J2xsIGJlIGFibGUgdG8gdXNlIHRoaXMgaXRlbSwgYnV0IHJpZ2h0IG5vdyB0aGF0IGZ1bmN0aW9uYWxpdHkgaXNuJ3QgcHJlc2VudC5cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiUGxlYXNlIHBvbGl0ZWx5IGxlYXZlIHRoZSBwcmVtaXNlcyB3aXRob3V0IGFja25vd2xlZGdpbmcgdGhpcyBtaXNzaW5nIGZlYXR1cmUuXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1lvdSBnb3QgaXQsIGNoaWVmJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveU9uVXNlOiBmYWxzZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH0sXHJcbiAgICBcIlN0cmFuZ2VyLmNvaW5cIjoge1xyXG4gICAgICAgIG5hbWU6ICdBIHN0cmFuZ2UgY29pbicsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ3N0cmFuZ2UgY29pbnMnLFxyXG4gICAgICAgIHRleHQ6IF8oJ0JvdGggc2lkZXMgZGVwaWN0IHRoZSBzYW1lIGltYWdlJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEgc3RyYW5nZSBjb2luXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIk9uZSBkYXkgeW91J2xsIGJlIGFibGUgdG8gdXNlIHRoaXMgaXRlbSwgYnV0IHJpZ2h0IG5vdyB0aGF0IGZ1bmN0aW9uYWxpdHkgaXNuJ3QgcHJlc2VudC5cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiUGxlYXNlIHBvbGl0ZWx5IGxlYXZlIHRoZSBwcmVtaXNlcyB3aXRob3V0IGFja25vd2xlZGdpbmcgdGhpcyBtaXNzaW5nIGZlYXR1cmUuXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1lvdSBnb3QgaXQsIGNoaWVmJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveU9uVXNlOiBmYWxzZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH0sXHJcbiAgICBcIkNhcHRhaW4uc3VwcGxpZXNcIjoge1xyXG4gICAgICAgIG5hbWU6ICdTdXBwbGllcyBmb3IgdGhlIE1heW9yJyxcclxuICAgICAgICB0ZXh0OiAnVGhleVxcJ3JlIGhlYXZ5LCBidXQgbm90IGluIGEgd2F5IHRoYXQgaW1wYWN0cyBnYW1lcGxheScsXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIlN1cHBsaWVzIGZvciB0aGUgTWF5b3JcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiQSBiaWcgYm94IG9mIHN0dWZmIGZvciB0aGUgdmlsbGFnZS4gTG9va3MgbGlrZSByYXcgbWF0ZXJpYWxzLCBtb3N0bHkuXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIkkgc2hvdWxkIHJlYWxseSB0YWtlIHRoaXMgYmFjayB0byB0aGUgTWF5b3IuXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ09rYXknKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIFwib2xkTGFkeS5DYW5keVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ2EgcGllY2Ugb2YgaGFyZCBjYW5keScsXHJcbiAgICAgICAgcGx1cmFsTmFtZTogJ3BpZWNlcyBvZiBoYXJkIGNhbmR5JyxcclxuICAgICAgICB0ZXh0OiAnR2l2ZW4gdG8geW91IGJ5IGEgbmljZSBvbGQgd29tYW4gaW4gYSBjYXJyaWFnZScsXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCAnWW91IHBvcCB0aGUgaGFyZCBjYW5keSBpbnRvIHlvdXIgbW91dGguIEEgZmV3IG1pbnV0ZXMgJyBcclxuICAgICAgICAgICAgICAgICsgJ2xhdGVyLCBpdFxcJ3MgZ29uZSwgbGVhdmluZyBiZWhpbmQgb25seSBhIG1pbGQgc2Vuc2Ugb2YgZ3VpbHQgYWJvdXQgbm90ICcgXHJcbiAgICAgICAgICAgICAgICArICdjYWxsaW5nIHlvdXIgZ3JhbmRtYSBtb3JlIG9mdGVuLicpXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IHRydWUsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IHRydWVcclxuICAgIH0sXHJcbiAgICBcImdhbWJsZXIuUHJpemVcIjoge1xyXG4gICAgICAgIG5hbWU6ICd0cnVlIG5hbWUgb2YgdGhlIGdhbWJsZXInLFxyXG4gICAgICAgIHRleHQ6ICdZb3Ugd29uIHRoaXMgaW4gYSBkaWNlIGdhbWUnLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgJ1RoaXMgaXRlbSBoYXMgZ3JlYXQgdmFsdWUsIGJ1dCBub3QgaGVyZSBhbmQgbm93LicpXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlLFxyXG4gICAgICAgIGRlc3Ryb3lhYmxlOiBmYWxzZVxyXG4gICAgfVxyXG59XHJcbiIsIi8vIG1hc3RlciBsaXN0IG9mIHBlcmtzXHJcblxyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgUGVyayB9IGZyb20gXCIuL3BlcmtcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBQZXJrTGlzdDoge1tpZDogc3RyaW5nXTogUGVya30gPSB7XHJcbiAgICAndHVtbXlQYWluJzoge1xyXG4gICAgICAgIG5hbWU6ICdTb2NrZWQgaW4gdGhlIFN0b21hY2gnLFxyXG4gICAgICAgIHRleHQ6ICdUaGlzIGRvZXNuXFwndCBzZWVtIGxpa2UgYSBwZXJrLCB0YmgnLFxyXG4gICAgICAgIGZ1bGxUZXh0OiBbXHJcbiAgICAgICAgICAgIF8oXCJZb3UgZ290IGhpcyBpbiB0aGUgc3RvbWFjaCByZWFsbHkgaGFyZC5cIiksXHJcbiAgICAgICAgICAgIF8oXCJMaWtlLCBSRUFMTFkgaGFyZC4gQnkgYSBncmlubmluZyBqZXJrLlwiKVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgaXNBY3RpdmU6ICgpID0+IHRydWUsXHJcbiAgICAgICAgc3RhdEJvbnVzZXM6IHsgfSxcclxuICAgICAgICB0aW1lTGVmdDogLTFcclxuICAgIH1cclxufSIsImltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgeyBRdWVzdCB9IGZyb20gXCIuL3F1ZXN0XCI7XHJcblxyXG5leHBvcnQgY29uc3QgUXVlc3RMb2c6IHtbaWQ6IHN0cmluZ106IFF1ZXN0fSA9IHtcclxuICAgIFwibWF5b3JTdXBwbGllc1wiOiB7XHJcbiAgICAgICAgbmFtZTogXCJTdXBwbGllcyBmb3IgdGhlIE1heW9yXCIsXHJcbiAgICAgICAgbG9nRGVzY3JpcHRpb246IFwiVGhlIG1heW9yIGhhcyBhc2tlZCB5b3UgdG8gZ2V0IHNvbWUgc3VwcGxpZXMgZm9yIGhpbSBmcm9tIHRoZSBPdXRwb3N0LlwiLFxyXG4gICAgICAgIHBoYXNlczoge1xyXG4gICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJHbyBjaGVjayBvdXQgdGhlIFJvYWQgdG8gdGhlIE91dHBvc3QgdG8gc2VlIGlmIHlvdSBjYW4gZmluZCBvdXQgbW9yZVwiLFxyXG4gICAgICAgICAgICAgICAgcmVxdWlyZW1lbnRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJSZXF1aXJlbWVudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJFNNLmdldCgnUm9hZC5vcGVuJykgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnUm9hZC5jb3VudGVyJykgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJJIHNob3VsZCBnbyBjaGVjayBvdXQgdGhlIFJvYWQgdG8gdGhlIE91dHBvc3RcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCRTTS5nZXQoJ1JvYWQub3BlbicpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ1JvYWQuY291bnRlcicpICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJJIHNob3VsZCBrZWVwIGV4cGxvcmluZyB0aGUgUm9hZCB0byB0aGUgT3V0cG9zdFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoJFNNLmdldCgnUm9hZC5vcGVuJykgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyID4gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJJJ3ZlIGZvdW5kIHRoZSB3YXkgdG8gdGhlIE91dHBvc3RcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCRTTS5nZXQoJ1JvYWQub3BlbicpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPiAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIDE6IHtcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkFzayB0aGUgQ2FwdGFpbiBvZiB0aGUgT3V0cG9zdCBhYm91dCB0aGUgc3VwcGxpZXNcIixcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVtZW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyUmVxdWlyZW1lbnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgJFNNLmdldCgnT3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnKSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkkgc2hvdWxkIHRyeSB0YWxraW5nIHRvIHRoZSBDYXB0YWluIG9mIHRoZSBPdXRwb3N0XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ091dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ091dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIENoYXJhY3Rlci5pbnZlbnRvcnlbXCJDYXB0YWluLnN1cHBsaWVzXCJdID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiSSBzaG91bGQgYXNrIHRoZSBDYXB0YWluIGFib3V0IHRoZSBtaXNzaW5nIHN1cHBsaWVzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgkU00uZ2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ091dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ091dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIENoYXJhY3Rlci5pbnZlbnRvcnlbXCJDYXB0YWluLnN1cHBsaWVzXCJdICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiSSd2ZSBnb3R0ZW4gdGhlIHN1cHBsaWVzIGZyb20gdGhlIENhcHRhaW5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCdPdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcpICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICRTTS5nZXQoJ091dHBvc3QuY2FwdGFpbi5oYXZlTWV0JykgYXMgbnVtYmVyID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgKENoYXJhY3Rlci5pbnZlbnRvcnlbXCJDYXB0YWluLnN1cHBsaWVzXCJdICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCAkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIDI6IHtcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlJldHVybiB0aGUgc3VwcGxpZXMgdG8gdGhlIE1heW9yXCIsXHJcbiAgICAgICAgICAgICAgICByZXF1aXJlbWVudHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlclJlcXVpcmVtZW50OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gIFwiSSBzaG91bGQgaGFuZCB0aGVzZSBzdXBwbGllcyBvdmVyIHRvIHRoZSBNYXlvclwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoJFNNLmdldCgndmlsbGFnZS5tYXlvci5oYXZlR2l2ZW5TdXBwbGllcycpICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykgYXMgbnVtYmVyID4gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJJJ3ZlIGhhbmRlZCBvdmVyIHRoZSBzdXBwbGllcyB0byB0aGUgTWF5b3JcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZUdpdmVuU3VwcGxpZXMnKSAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkU00uZ2V0KCd2aWxsYWdlLm1heW9yLmhhdmVHaXZlblN1cHBsaWVzJykgYXMgbnVtYmVyID4gMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvKlxyXG4gKiBNb2R1bGUgZm9yIGhhbmRsaW5nIFN0YXRlc1xyXG4gKiBcclxuICogQWxsIHN0YXRlcyBzaG91bGQgYmUgZ2V0IGFuZCBzZXQgdGhyb3VnaCB0aGUgU3RhdGVNYW5hZ2VyICgkU00pLlxyXG4gKiBcclxuICogVGhlIG1hbmFnZXIgaXMgaW50ZW5kZWQgdG8gaGFuZGxlIGFsbCBuZWVkZWQgY2hlY2tzIGFuZCBlcnJvciBjYXRjaGluZy5cclxuICogVGhpcyBpbmNsdWRlcyBjcmVhdGluZyB0aGUgcGFyZW50cyBvZiBsYXllcmVkL2RlZXAgc3RhdGVzIHNvIHVuZGVmaW5lZCBzdGF0ZXNcclxuICogZG8gbm90IG5lZWQgdG8gYmUgdGVzdGVkIGZvciBhbmQgY3JlYXRlZCBiZWZvcmVoYW5kLlxyXG4gKiBcclxuICogV2hlbiBhIHN0YXRlIGlzIGNoYW5nZWQsIGFuIHVwZGF0ZSBldmVudCBpcyBzZW50IG91dCBjb250YWluaW5nIHRoZSBuYW1lIG9mIHRoZSBzdGF0ZVxyXG4gKiBjaGFuZ2VkIG9yIGluIHRoZSBjYXNlIG9mIG11bHRpcGxlIGNoYW5nZXMgKC5zZXRNLCAuYWRkTSkgdGhlIHBhcmVudCBjbGFzcyBjaGFuZ2VkLlxyXG4gKiBFdmVudDogdHlwZTogJ3N0YXRlVXBkYXRlJywgc3RhdGVOYW1lOiA8cGF0aCBvZiBzdGF0ZSBvciBwYXJlbnQgc3RhdGU+XHJcbiAqIFxyXG4gKiBPcmlnaW5hbCBmaWxlIGNyZWF0ZWQgYnk6IE1pY2hhZWwgR2FsdXNoYVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyBOb3RpZmljYXRpb25zIH0gZnJvbSBcIi4vbm90aWZpY2F0aW9uc1wiO1xyXG5cclxudmFyIFN0YXRlTWFuYWdlciA9IHtcclxuXHRcdFxyXG5cdE1BWF9TVE9SRTogOTk5OTk5OTk5OTk5OTksXHJcblx0XHJcblx0b3B0aW9uczoge30sXHJcblx0XHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdFx0XHJcblx0XHQvL2NyZWF0ZSBjYXRlZ29yaWVzXHJcblx0XHR2YXIgY2F0cyA9IFtcclxuXHRcdFx0J2ZlYXR1cmVzJyxcdFx0Ly9iaWcgZmVhdHVyZXMgbGlrZSBidWlsZGluZ3MsIGxvY2F0aW9uIGF2YWlsYWJpbGl0eSwgdW5sb2NrcywgZXRjXHJcblx0XHRcdCdzdG9yZXMnLCBcdFx0Ly9saXR0bGUgc3R1ZmYsIGl0ZW1zLCB3ZWFwb25zLCBldGNcclxuXHRcdFx0J2NoYXJhY3RlcicsIFx0Ly90aGlzIGlzIGZvciBwbGF5ZXIncyBjaGFyYWN0ZXIgc3RhdHMgc3VjaCBhcyBwZXJrc1xyXG5cdFx0XHQnaW5jb21lJyxcclxuXHRcdFx0J3RpbWVycycsXHJcblx0XHRcdCdnYW1lJywgXHRcdC8vbW9zdGx5IGxvY2F0aW9uIHJlbGF0ZWQ6IGZpcmUgdGVtcCwgd29ya2VycywgcG9wdWxhdGlvbiwgd29ybGQgbWFwLCBldGNcclxuXHRcdFx0J3BsYXlTdGF0cycsXHQvL2FueXRoaW5nIHBsYXkgcmVsYXRlZDogcGxheSB0aW1lLCBsb2FkcywgZXRjXHJcblx0XHRcdCdwcmV2aW91cycsXHRcdC8vIHByZXN0aWdlLCBzY29yZSwgdHJvcGhpZXMgKGluIGZ1dHVyZSksIGFjaGlldmVtZW50cyAoYWdhaW4sIG5vdCB5ZXQpLCBldGNcclxuXHRcdFx0J291dGZpdCdcdFx0XHQvLyB1c2VkIHRvIHRlbXBvcmFyaWx5IHN0b3JlIHRoZSBpdGVtcyB0byBiZSB0YWtlbiBvbiB0aGUgcGF0aFxyXG5cdFx0XTtcclxuXHRcdFxyXG5cdFx0Zm9yKHZhciB3aGljaCBpbiBjYXRzKSB7XHJcblx0XHRcdGlmKCEkU00uZ2V0KGNhdHNbd2hpY2hdKSkgJFNNLnNldChjYXRzW3doaWNoXSwge30pOyBcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly9zdWJzY3JpYmUgdG8gc3RhdGVVcGRhdGVzXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHQkLkRpc3BhdGNoKCdzdGF0ZVVwZGF0ZScpLnN1YnNjcmliZSgkU00uaGFuZGxlU3RhdGVVcGRhdGVzKTtcclxuXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHR3aW5kb3cuJFNNID0gdGhpcztcclxuXHR9LFxyXG5cdFxyXG5cdC8vY3JlYXRlIGFsbCBwYXJlbnRzIGFuZCB0aGVuIHNldCBzdGF0ZVxyXG5cdGNyZWF0ZVN0YXRlOiBmdW5jdGlvbihzdGF0ZU5hbWUsIHZhbHVlKSB7XHJcblx0XHR2YXIgd29yZHMgPSBzdGF0ZU5hbWUuc3BsaXQoL1suXFxbXFxdJ1wiXSsvKTtcclxuXHRcdC8vZm9yIHNvbWUgcmVhc29uIHRoZXJlIGFyZSBzb21ldGltZXMgZW1wdHkgc3RyaW5nc1xyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB3b3Jkcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAod29yZHNbaV0gPT09ICcnKSB7XHJcblx0XHRcdFx0d29yZHMuc3BsaWNlKGksIDEpO1xyXG5cdFx0XHRcdGktLTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly8gSU1QT1JUQU5UOiBTdGF0ZSByZWZlcnMgdG8gd2luZG93LlN0YXRlLCB3aGljaCBJIGhhZCB0byBpbml0aWFsaXplIG1hbnVhbGx5XHJcblx0XHQvLyAgICBpbiBFbmdpbmUudHM7IHBsZWFzZSBkb24ndCBmb3JnZXQgdGhpcyBhbmQgbWVzcyB3aXRoIGFueXRoaW5nIG5hbWVkXHJcblx0XHQvLyAgICBcIlN0YXRlXCIgb3IgXCJ3aW5kb3cuU3RhdGVcIiwgdGhpcyBzdHVmZiBpcyB3ZWlyZGx5IHByZWNhcmlvdXMgYWZ0ZXIgdHlwZXNjcmlwdGluZ1xyXG5cdFx0Ly8gICAgdGhpcyBjb2RlYmFzZSwgYW5kIEkgZG9uJ3QgaGF2ZSB0aGUgc2FuaXR5IHBvaW50cyB0byBmaWd1cmUgb3V0IHdoeVxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0dmFyIG9iaiA9IFN0YXRlO1xyXG5cdFx0dmFyIHcgPSBudWxsO1xyXG5cdFx0Zm9yKHZhciBpPTAsIGxlbj13b3Jkcy5sZW5ndGgtMTtpPGxlbjtpKyspe1xyXG5cdFx0XHR3ID0gd29yZHNbaV07XHJcblx0XHRcdGlmKG9ialt3XSA9PT0gdW5kZWZpbmVkICkgb2JqW3ddID0ge307XHJcblx0XHRcdG9iaiA9IG9ialt3XTtcclxuXHRcdH1cclxuXHRcdG9ialt3b3Jkc1tpXV0gPSB2YWx1ZTtcclxuXHRcdHJldHVybiBvYmo7XHJcblx0fSxcclxuXHRcclxuXHQvL3NldCBzaW5nbGUgc3RhdGVcclxuXHQvL2lmIG5vRXZlbnQgaXMgdHJ1ZSwgdGhlIHVwZGF0ZSBldmVudCB3b24ndCB0cmlnZ2VyLCB1c2VmdWwgZm9yIHNldHRpbmcgbXVsdGlwbGUgc3RhdGVzIGZpcnN0XHJcblx0c2V0OiBmdW5jdGlvbihzdGF0ZU5hbWUsIHZhbHVlLCBub0V2ZW50Pykge1xyXG5cdFx0dmFyIGZ1bGxQYXRoID0gJFNNLmJ1aWxkUGF0aChzdGF0ZU5hbWUpO1xyXG5cdFx0XHJcblx0XHQvL21ha2Ugc3VyZSB0aGUgdmFsdWUgaXNuJ3Qgb3ZlciB0aGUgZW5naW5lIG1heGltdW1cclxuXHRcdGlmKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJiB2YWx1ZSA+ICRTTS5NQVhfU1RPUkUpIHZhbHVlID0gJFNNLk1BWF9TVE9SRTtcclxuXHRcdFxyXG5cdFx0dHJ5e1xyXG5cdFx0XHRldmFsKCcoJytmdWxsUGF0aCsnKSA9IHZhbHVlJyk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdC8vcGFyZW50IGRvZXNuJ3QgZXhpc3QsIHNvIG1ha2UgcGFyZW50XHJcblx0XHRcdCRTTS5jcmVhdGVTdGF0ZShzdGF0ZU5hbWUsIHZhbHVlKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly9zdG9yZXMgdmFsdWVzIGNhbiBub3QgYmUgbmVnYXRpdmVcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdGlmKHN0YXRlTmFtZS5pbmRleE9mKCdzdG9yZXMnKSA9PT0gMCAmJiAkU00uZ2V0KHN0YXRlTmFtZSwgdHJ1ZSkgPCAwKSB7XHJcblx0XHRcdGV2YWwoJygnK2Z1bGxQYXRoKycpID0gMCcpO1xyXG5cdFx0XHRFbmdpbmUubG9nKCdXQVJOSU5HOiBzdGF0ZTonICsgc3RhdGVOYW1lICsgJyBjYW4gbm90IGJlIGEgbmVnYXRpdmUgdmFsdWUuIFNldCB0byAwIGluc3RlYWQuJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0RW5naW5lLmxvZyhzdGF0ZU5hbWUgKyAnICcgKyB2YWx1ZSk7XHJcblx0XHRcclxuXHRcdGlmIChub0V2ZW50ID09PSB1bmRlZmluZWQgfHwgbm9FdmVudCA9PSB0cnVlKSB7XHJcblx0XHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0XHQkU00uZmlyZVVwZGF0ZShzdGF0ZU5hbWUpO1xyXG5cdFx0fVx0XHRcclxuXHR9LFxyXG5cdFxyXG5cdC8vc2V0cyBhIGxpc3Qgb2Ygc3RhdGVzXHJcblx0c2V0TTogZnVuY3Rpb24ocGFyZW50TmFtZSwgbGlzdCwgbm9FdmVudD8pIHtcclxuXHRcdCRTTS5idWlsZFBhdGgocGFyZW50TmFtZSk7XHJcblx0XHRcclxuXHRcdC8vbWFrZSBzdXJlIHRoZSBzdGF0ZSBleGlzdHMgdG8gYXZvaWQgZXJyb3JzLFxyXG5cdFx0aWYoJFNNLmdldChwYXJlbnROYW1lKSA9PT0gdW5kZWZpbmVkKSAkU00uc2V0KHBhcmVudE5hbWUsIHt9LCB0cnVlKTtcclxuXHRcdFxyXG5cdFx0Zm9yKHZhciBrIGluIGxpc3Qpe1xyXG5cdFx0XHQkU00uc2V0KHBhcmVudE5hbWUrJ1tcIicraysnXCJdJywgbGlzdFtrXSwgdHJ1ZSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmKCFub0V2ZW50KSB7XHJcblx0XHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0XHQkU00uZmlyZVVwZGF0ZShwYXJlbnROYW1lKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdC8vc2hvcnRjdXQgZm9yIGFsdGVyaW5nIG51bWJlciB2YWx1ZXMsIHJldHVybiAxIGlmIHN0YXRlIHdhc24ndCBhIG51bWJlclxyXG5cdGFkZDogZnVuY3Rpb24oc3RhdGVOYW1lLCB2YWx1ZSwgbm9FdmVudD8pIHtcclxuXHRcdHZhciBlcnIgPSAwO1xyXG5cdFx0Ly8wIGlmIHVuZGVmaW5lZCwgbnVsbCAoYnV0IG5vdCB7fSkgc2hvdWxkIGFsbG93IGFkZGluZyB0byBuZXcgb2JqZWN0c1xyXG5cdFx0Ly9jb3VsZCBhbHNvIGFkZCBpbiBhIHRydWUgPSAxIHRoaW5nLCB0byBoYXZlIHNvbWV0aGluZyBnbyBmcm9tIGV4aXN0aW5nICh0cnVlKVxyXG5cdFx0Ly90byBiZSBhIGNvdW50LCBidXQgdGhhdCBtaWdodCBiZSB1bndhbnRlZCBiZWhhdmlvciAoYWRkIHdpdGggbG9vc2UgZXZhbCBwcm9iYWJseSB3aWxsIGhhcHBlbiBhbnl3YXlzKVxyXG5cdFx0dmFyIG9sZCA9ICRTTS5nZXQoc3RhdGVOYW1lLCB0cnVlKTtcclxuXHRcdFxyXG5cdFx0Ly9jaGVjayBmb3IgTmFOIChvbGQgIT0gb2xkKSBhbmQgbm9uIG51bWJlciB2YWx1ZXNcclxuXHRcdGlmKG9sZCAhPSBvbGQpe1xyXG5cdFx0XHRFbmdpbmUubG9nKCdXQVJOSU5HOiAnK3N0YXRlTmFtZSsnIHdhcyBjb3JydXB0ZWQgKE5hTikuIFJlc2V0dGluZyB0byAwLicpO1xyXG5cdFx0XHRvbGQgPSAwO1xyXG5cdFx0XHQkU00uc2V0KHN0YXRlTmFtZSwgb2xkICsgdmFsdWUsIG5vRXZlbnQpO1xyXG5cdFx0fSBlbHNlIGlmKHR5cGVvZiBvbGQgIT0gJ251bWJlcicgfHwgdHlwZW9mIHZhbHVlICE9ICdudW1iZXInKXtcclxuXHRcdFx0RW5naW5lLmxvZygnV0FSTklORzogQ2FuIG5vdCBkbyBtYXRoIHdpdGggc3RhdGU6JytzdGF0ZU5hbWUrJyBvciB2YWx1ZTonK3ZhbHVlKycgYmVjYXVzZSBhdCBsZWFzdCBvbmUgaXMgbm90IGEgbnVtYmVyLicpO1xyXG5cdFx0XHRlcnIgPSAxO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JFNNLnNldChzdGF0ZU5hbWUsIG9sZCArIHZhbHVlLCBub0V2ZW50KTsgLy9zZXRTdGF0ZSBoYW5kbGVzIGV2ZW50IGFuZCBzYXZlXHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBlcnI7XHJcblx0fSxcclxuXHRcclxuXHQvL2FsdGVycyBtdWx0aXBsZSBudW1iZXIgdmFsdWVzLCByZXR1cm4gbnVtYmVyIG9mIGZhaWxzXHJcblx0YWRkTTogZnVuY3Rpb24ocGFyZW50TmFtZSwgbGlzdCwgbm9FdmVudD8pIHtcclxuXHRcdHZhciBlcnIgPSAwO1xyXG5cdFx0XHJcblx0XHQvL21ha2Ugc3VyZSB0aGUgcGFyZW50IGV4aXN0cyB0byBhdm9pZCBlcnJvcnNcclxuXHRcdGlmKCRTTS5nZXQocGFyZW50TmFtZSkgPT09IHVuZGVmaW5lZCkgJFNNLnNldChwYXJlbnROYW1lLCB7fSwgdHJ1ZSk7XHJcblx0XHRcclxuXHRcdGZvcih2YXIgayBpbiBsaXN0KXtcclxuXHRcdFx0aWYoJFNNLmFkZChwYXJlbnROYW1lKydbXCInK2srJ1wiXScsIGxpc3Rba10sIHRydWUpKSBlcnIrKztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYoIW5vRXZlbnQpIHtcclxuXHRcdFx0RW5naW5lLnNhdmVHYW1lKCk7XHJcblx0XHRcdCRTTS5maXJlVXBkYXRlKHBhcmVudE5hbWUpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGVycjtcclxuXHR9LFxyXG5cdFxyXG5cdC8vcmV0dXJuIHN0YXRlLCB1bmRlZmluZWQgb3IgMFxyXG5cdGdldDogZnVuY3Rpb24oc3RhdGVOYW1lLCByZXF1ZXN0WmVybz8pOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBOdW1iZXIgfCBudWxsIHwgQm9vbGVhbiB7XHJcblx0XHR2YXIgd2hpY2hTdGF0ZTogdW5kZWZpbmVkIHwgbnVsbCB8IE51bWJlciB8IHN0cmluZyA9IG51bGw7XHJcblx0XHR2YXIgZnVsbFBhdGggPSAkU00uYnVpbGRQYXRoKHN0YXRlTmFtZSk7XHJcblx0XHRcclxuXHRcdC8vY2F0Y2ggZXJyb3JzIGlmIHBhcmVudCBvZiBzdGF0ZSBkb2Vzbid0IGV4aXN0XHJcblx0XHR0cnl7XHJcblx0XHRcdGV2YWwoJ3doaWNoU3RhdGUgPSAoJytmdWxsUGF0aCsnKScpO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHR3aGljaFN0YXRlID0gdW5kZWZpbmVkO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvL3ByZXZlbnRzIHJlcGVhdGVkIGlmIHVuZGVmaW5lZCwgbnVsbCwgZmFsc2Ugb3Ige30sIHRoZW4geCA9IDAgc2l0dWF0aW9uc1xyXG5cdFx0aWYoKCF3aGljaFN0YXRlXHJcblx0XHRcdC8vICB8fCB3aGljaFN0YXRlID09IHt9XHJcblx0XHRcdCkgJiYgcmVxdWVzdFplcm8pIHJldHVybiAwO1xyXG5cdFx0ZWxzZSByZXR1cm4gd2hpY2hTdGF0ZTtcclxuXHR9LFxyXG5cdFxyXG5cdC8vbWFpbmx5IGZvciBsb2NhbCBjb3B5IHVzZSwgYWRkKE0pIGNhbiBmYWlsIHNvIHdlIGNhbid0IHNob3J0Y3V0IHRoZW1cclxuXHQvL3NpbmNlIHNldCBkb2VzIG5vdCBmYWlsLCB3ZSBrbm93IHN0YXRlIGV4aXN0cyBhbmQgY2FuIHNpbXBseSByZXR1cm4gdGhlIG9iamVjdFxyXG5cdHNldGdldDogZnVuY3Rpb24oc3RhdGVOYW1lLCB2YWx1ZSwgbm9FdmVudD8pe1xyXG5cdFx0JFNNLnNldChzdGF0ZU5hbWUsIHZhbHVlLCBub0V2ZW50KTtcclxuXHRcdHJldHVybiBldmFsKCcoJyskU00uYnVpbGRQYXRoKHN0YXRlTmFtZSkrJyknKTtcclxuXHR9LFxyXG5cdFxyXG5cdHJlbW92ZTogZnVuY3Rpb24oc3RhdGVOYW1lLCBub0V2ZW50Pykge1xyXG5cdFx0dmFyIHdoaWNoU3RhdGUgPSAkU00uYnVpbGRQYXRoKHN0YXRlTmFtZSk7XHJcblx0XHR0cnl7XHJcblx0XHRcdGV2YWwoJyhkZWxldGUgJyt3aGljaFN0YXRlKycpJyk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdC8vaXQgZGlkbid0IGV4aXN0IGluIHRoZSBmaXJzdCBwbGFjZVxyXG5cdFx0XHRFbmdpbmUubG9nKCdXQVJOSU5HOiBUcmllZCB0byByZW1vdmUgbm9uLWV4aXN0YW50IHN0YXRlIFxcJycrc3RhdGVOYW1lKydcXCcuJyk7XHJcblx0XHR9XHJcblx0XHRpZighbm9FdmVudCl7XHJcblx0XHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0XHQkU00uZmlyZVVwZGF0ZShzdGF0ZU5hbWUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0Ly9jcmVhdGVzIGZ1bGwgcmVmZXJlbmNlIGZyb20gaW5wdXRcclxuXHQvL2hvcGVmdWxseSB0aGlzIHdvbid0IGV2ZXIgbmVlZCB0byBiZSBtb3JlIGNvbXBsaWNhdGVkXHJcblx0YnVpbGRQYXRoOiBmdW5jdGlvbihpbnB1dCl7XHJcblx0XHR2YXIgZG90ID0gKGlucHV0LmNoYXJBdCgwKSA9PSAnWycpPyAnJyA6ICcuJzsgLy9pZiBpdCBzdGFydHMgd2l0aCBbZm9vXSBubyBkb3QgdG8gam9pblxyXG5cdFx0cmV0dXJuICdTdGF0ZScgKyBkb3QgKyBpbnB1dDtcclxuXHR9LFxyXG5cdFxyXG5cdGZpcmVVcGRhdGU6IGZ1bmN0aW9uKHN0YXRlTmFtZSwgc2F2ZT8pe1xyXG5cdFx0dmFyIGNhdGVnb3J5ID0gJFNNLmdldENhdGVnb3J5KHN0YXRlTmFtZSk7XHJcblx0XHRpZihzdGF0ZU5hbWUgPT0gdW5kZWZpbmVkKSBzdGF0ZU5hbWUgPSBjYXRlZ29yeSA9ICdhbGwnOyAvL2Jlc3QgaWYgdGhpcyBkb2Vzbid0IGhhcHBlbiBhcyBpdCB3aWxsIHRyaWdnZXIgbW9yZSBzdHVmZlxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5wdWJsaXNoKHsnY2F0ZWdvcnknOiBjYXRlZ29yeSwgJ3N0YXRlTmFtZSc6c3RhdGVOYW1lfSk7XHJcblx0XHRpZihzYXZlKSBFbmdpbmUuc2F2ZUdhbWUoKTtcclxuXHR9LFxyXG5cdFxyXG5cdGdldENhdGVnb3J5OiBmdW5jdGlvbihzdGF0ZU5hbWUpe1xyXG5cdFx0dmFyIGZpcnN0T0IgPSBzdGF0ZU5hbWUuaW5kZXhPZignWycpO1xyXG5cdFx0dmFyIGZpcnN0RG90ID0gc3RhdGVOYW1lLmluZGV4T2YoJy4nKTtcclxuXHRcdHZhciBjdXRvZmYgPSBudWxsO1xyXG5cdFx0aWYoZmlyc3RPQiA9PSAtMSB8fCBmaXJzdERvdCA9PSAtMSl7XHJcblx0XHRcdGN1dG9mZiA9IGZpcnN0T0IgPiBmaXJzdERvdCA/IGZpcnN0T0IgOiBmaXJzdERvdDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGN1dG9mZiA9IGZpcnN0T0IgPCBmaXJzdERvdCA/IGZpcnN0T0IgOiBmaXJzdERvdDtcclxuXHRcdH1cclxuXHRcdGlmIChjdXRvZmYgPT0gLTEpe1xyXG5cdFx0XHRyZXR1cm4gc3RhdGVOYW1lO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHN0YXRlTmFtZS5zdWJzdHIoMCxjdXRvZmYpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cdCAqIFN0YXJ0IG9mIHNwZWNpZmljIHN0YXRlIGZ1bmN0aW9uc1xyXG5cdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblx0XHJcblx0aGFuZGxlU3RhdGVVcGRhdGVzOiBmdW5jdGlvbihlKXtcclxuXHRcdFxyXG5cdH1cdFxyXG59O1xyXG5cclxuLy9hbGlhc1xyXG5leHBvcnQgY29uc3QgJFNNID0gU3RhdGVNYW5hZ2VyO1xyXG4iLCJpbXBvcnQgeyBOb3RpZmljYXRpb25zIH0gZnJvbSAnLi9ub3RpZmljYXRpb25zJztcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSAnLi9zdGF0ZV9tYW5hZ2VyJztcclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSAnLi9lbmdpbmUnO1xyXG5cclxuZXhwb3J0IGNvbnN0IFdlYXRoZXIgPSB7XHJcbiAgICBpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblxyXG4gICAgICAgIC8vc3Vic2NyaWJlIHRvIHN0YXRlVXBkYXRlc1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuXHRcdCQuRGlzcGF0Y2goJ3N0YXRlVXBkYXRlJykuc3Vic2NyaWJlKFdlYXRoZXIuaGFuZGxlU3RhdGVVcGRhdGVzKTtcclxuICAgIH0sXHJcblxyXG4gICAgaGFuZGxlU3RhdGVVcGRhdGVzOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgaWYgKGUuY2F0ZWdvcnkgPT0gJ3dlYXRoZXInKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoJFNNLmdldCgnd2VhdGhlcicpKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdzdW5ueSc6IFxyXG4gICAgICAgICAgICAgICAgICAgIFdlYXRoZXIuc3RhcnRTdW5ueSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnY2xvdWR5JzpcclxuICAgICAgICAgICAgICAgICAgICBXZWF0aGVyLnN0YXJ0Q2xvdWR5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdyYWlueSc6XHJcbiAgICAgICAgICAgICAgICAgICAgV2VhdGhlci5zdGFydFJhaW55KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfbGFzdFdlYXRoZXI6ICdzdW5ueScsXHJcblxyXG4gICAgc3RhcnRTdW5ueTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJUaGUgc3VuIGJlZ2lucyB0byBzaGluZS5cIik7XHJcbiAgICAgICAgV2VhdGhlci5fbGFzdFdlYXRoZXIgPSAnc3VubnknO1xyXG4gICAgICAgICQoJ2JvZHknKS5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6ICcjRkZGRkZGJ30sICdzbG93Jyk7XHJcbiAgICAgICAgJCgnZGl2I3N0b3Jlczo6YmVmb3JlJykuYW5pbWF0ZSh7YmFja2dyb3VuZENvbG9yOiAnI0ZGRkZGRid9LCAnc2xvdycpO1xyXG4gICAgICAgIFdlYXRoZXIubWFrZVJhaW5TdG9wKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHN0YXJ0Q2xvdWR5OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoV2VhdGhlci5fbGFzdFdlYXRoZXIgPT0gJ3N1bm55Jykge1xyXG4gICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIkNsb3VkcyByb2xsIGluLCBvYnNjdXJpbmcgdGhlIHN1bi5cIik7XHJcbiAgICAgICAgfSBlbHNlIGlmIChXZWF0aGVyLl9sYXN0V2VhdGhlciA9PSAncmFpbnknKSB7XHJcbiAgICAgICAgICAgIE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiVGhlIHJhaW4gYnJlYWtzLCBidXQgdGhlIGNsb3VkcyByZW1haW4uXCIpXHJcbiAgICAgICAgfVxyXG4gICAgICAgICQoJ2JvZHknKS5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6ICcjOEI4Nzg2J30sICdzbG93Jyk7XHJcbiAgICAgICAgJCgnZGl2I3N0b3Jlczo6YmVmb3JlJykuYW5pbWF0ZSh7YmFja2dyb3VuZENvbG9yOiAnIzhCODc4Nid9LCAnc2xvdycpO1xyXG4gICAgICAgIFdlYXRoZXIuX2xhc3RXZWF0aGVyID0gJ2Nsb3VkeSc7XHJcbiAgICAgICAgV2VhdGhlci5tYWtlUmFpblN0b3AoKTtcclxuICAgIH0sXHJcblxyXG4gICAgc3RhcnRSYWlueTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKFdlYXRoZXIuX2xhc3RXZWF0aGVyID09ICdzdW5ueScpIHtcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJUaGUgd2luZCBzdWRkZW5seSBwaWNrcyB1cC4gQ2xvdWRzIHJvbGwgaW4sIGhlYXZ5IHdpdGggcmFpbiwgYW5kIHJhaW5kcm9wcyBmYWxsIHNvb24gYWZ0ZXIuXCIpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoV2VhdGhlci5fbGFzdFdlYXRoZXIgPT0gJ2Nsb3VkeScpIHtcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJUaGUgY2xvdWRzIHRoYXQgd2VyZSBwcmV2aW91c2x5IGNvbnRlbnQgdG8gaGFuZyBvdmVyaGVhZCBsZXQgbG9vc2UgYSBtb2RlcmF0ZSBkb3ducG91ci5cIilcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgJCgnYm9keScpLmFuaW1hdGUoe2JhY2tncm91bmRDb2xvcjogJyM2RDY5NjgnfSwgJ3Nsb3cnKTtcclxuICAgICAgICAkKCdkaXYjc3RvcmVzOjpiZWZvcmUnKS5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6ICcjNkQ2OTY4J30sICdzbG93Jyk7XHJcbiAgICAgICAgV2VhdGhlci5fbGFzdFdlYXRoZXIgPSAncmFpbnknO1xyXG4gICAgICAgIFdlYXRoZXIubWFrZUl0UmFpbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICBfbG9jYXRpb246ICcnLFxyXG5cclxuICAgIGluaXRpYXRlV2VhdGhlcjogZnVuY3Rpb24oYXZhaWxhYmxlV2VhdGhlciwgbG9jYXRpb24pIHtcclxuICAgICAgICBpZiAoV2VhdGhlci5fbG9jYXRpb24gPT0gJycpIFdlYXRoZXIuX2xvY2F0aW9uID0gbG9jYXRpb247XHJcbiAgICAgICAgLy8gaWYgaW4gbmV3IGxvY2F0aW9uLCBlbmQgd2l0aG91dCB0cmlnZ2VyaW5nIGEgbmV3IHdlYXRoZXIgaW5pdGlhdGlvbiwgXHJcbiAgICAgICAgLy8gbGVhdmluZyB0aGUgbmV3IGxvY2F0aW9uJ3MgaW5pdGlhdGVXZWF0aGVyIGNhbGxiYWNrIHRvIGRvIGl0cyB0aGluZ1xyXG4gICAgICAgIGVsc2UgaWYgKFdlYXRoZXIuX2xvY2F0aW9uICE9IGxvY2F0aW9uKSByZXR1cm47IFxyXG5cclxuICAgICAgICB2YXIgY2hvc2VuV2VhdGhlciA9ICdub25lJztcclxuICAgICAgICAvL2dldCBvdXIgcmFuZG9tIGZyb20gMCB0byAxXHJcbiAgICAgICAgdmFyIHJuZCA9IE1hdGgucmFuZG9tKCk7XHJcbiAgXHJcbiAgICAgICAgLy9pbml0aWFsaXNlIG91ciBjdW11bGF0aXZlIHBlcmNlbnRhZ2VcclxuICAgICAgICB2YXIgY3VtdWxhdGl2ZUNoYW5jZSA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaSBpbiBhdmFpbGFibGVXZWF0aGVyKSB7XHJcbiAgICAgICAgICAgIGN1bXVsYXRpdmVDaGFuY2UgKz0gYXZhaWxhYmxlV2VhdGhlcltpXTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChybmQgPCBjdW11bGF0aXZlQ2hhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICBjaG9zZW5XZWF0aGVyID0gaTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY2hvc2VuV2VhdGhlciAhPSAkU00uZ2V0KCd3ZWF0aGVyJykpICRTTS5zZXQoJ3dlYXRoZXInLCBjaG9zZW5XZWF0aGVyKTtcclxuICAgICAgICBFbmdpbmUuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhdGVXZWF0aGVyKGF2YWlsYWJsZVdlYXRoZXIsIGxvY2F0aW9uKTtcclxuICAgICAgICB9LCAzICogNjAgKiAxMDAwKTtcclxuICAgIH0sXHJcblxyXG4gICAgbWFrZUl0UmFpbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gaHR0cHM6Ly9jb2RlcGVuLmlvL2FyaWNrbGUvcGVuL1hLak1aWVxyXG4gICAgICAgIC8vY2xlYXIgb3V0IGV2ZXJ5dGhpbmdcclxuICAgICAgICAkKCcucmFpbicpLmVtcHR5KCk7XHJcbiAgICAgIFxyXG4gICAgICAgIHZhciBpbmNyZW1lbnQgPSAwO1xyXG4gICAgICAgIHZhciBkcm9wcyA9IFwiXCI7XHJcbiAgICAgICAgdmFyIGJhY2tEcm9wcyA9IFwiXCI7XHJcbiAgICAgIFxyXG4gICAgICAgIHdoaWxlIChpbmNyZW1lbnQgPCAxMDApIHtcclxuICAgICAgICAgIC8vY291cGxlIHJhbmRvbSBudW1iZXJzIHRvIHVzZSBmb3IgdmFyaW91cyByYW5kb21pemF0aW9uc1xyXG4gICAgICAgICAgLy9yYW5kb20gbnVtYmVyIGJldHdlZW4gOTggYW5kIDFcclxuICAgICAgICAgIHZhciByYW5kb0h1bmRvID0gKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg5OCAtIDEgKyAxKSArIDEpKTtcclxuICAgICAgICAgIC8vcmFuZG9tIG51bWJlciBiZXR3ZWVuIDUgYW5kIDJcclxuICAgICAgICAgIHZhciByYW5kb0ZpdmVyID0gKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg1IC0gMiArIDEpICsgMikpO1xyXG4gICAgICAgICAgLy9pbmNyZW1lbnRcclxuICAgICAgICAgIGluY3JlbWVudCArPSByYW5kb0ZpdmVyO1xyXG4gICAgICAgICAgLy9hZGQgaW4gYSBuZXcgcmFpbmRyb3Agd2l0aCB2YXJpb3VzIHJhbmRvbWl6YXRpb25zIHRvIGNlcnRhaW4gQ1NTIHByb3BlcnRpZXNcclxuICAgICAgICAgIGRyb3BzICs9ICc8ZGl2IGNsYXNzPVwiZHJvcFwiIHN0eWxlPVwibGVmdDogJyArIGluY3JlbWVudCArICclOyBib3R0b206ICcgKyAocmFuZG9GaXZlciArIHJhbmRvRml2ZXIgLSAxICsgMTAwKSArICclOyBhbmltYXRpb24tZGVsYXk6IDAuJyArIHJhbmRvSHVuZG8gKyAnczsgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjUnICsgcmFuZG9IdW5kbyArICdzO1wiPjxkaXYgY2xhc3M9XCJzdGVtXCIgc3R5bGU9XCJhbmltYXRpb24tZGVsYXk6IDAuJyArIHJhbmRvSHVuZG8gKyAnczsgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjUnICsgcmFuZG9IdW5kbyArICdzO1wiPjwvZGl2PjxkaXYgY2xhc3M9XCJzcGxhdFwiIHN0eWxlPVwiYW5pbWF0aW9uLWRlbGF5OiAwLicgKyByYW5kb0h1bmRvICsgJ3M7IGFuaW1hdGlvbi1kdXJhdGlvbjogMC41JyArIHJhbmRvSHVuZG8gKyAncztcIj48L2Rpdj48L2Rpdj4nO1xyXG4gICAgICAgICAgYmFja0Ryb3BzICs9ICc8ZGl2IGNsYXNzPVwiZHJvcFwiIHN0eWxlPVwicmlnaHQ6ICcgKyBpbmNyZW1lbnQgKyAnJTsgYm90dG9tOiAnICsgKHJhbmRvRml2ZXIgKyByYW5kb0ZpdmVyIC0gMSArIDEwMCkgKyAnJTsgYW5pbWF0aW9uLWRlbGF5OiAwLicgKyByYW5kb0h1bmRvICsgJ3M7IGFuaW1hdGlvbi1kdXJhdGlvbjogMC41JyArIHJhbmRvSHVuZG8gKyAncztcIj48ZGl2IGNsYXNzPVwic3RlbVwiIHN0eWxlPVwiYW5pbWF0aW9uLWRlbGF5OiAwLicgKyByYW5kb0h1bmRvICsgJ3M7IGFuaW1hdGlvbi1kdXJhdGlvbjogMC41JyArIHJhbmRvSHVuZG8gKyAncztcIj48L2Rpdj48ZGl2IGNsYXNzPVwic3BsYXRcIiBzdHlsZT1cImFuaW1hdGlvbi1kZWxheTogMC4nICsgcmFuZG9IdW5kbyArICdzOyBhbmltYXRpb24tZHVyYXRpb246IDAuNScgKyByYW5kb0h1bmRvICsgJ3M7XCI+PC9kaXY+PC9kaXY+JztcclxuICAgICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAgICQoJy5yYWluLmZyb250LXJvdycpLmFwcGVuZChkcm9wcyk7XHJcbiAgICAgICAgJCgnLnJhaW4uYmFjay1yb3cnKS5hcHBlbmQoYmFja0Ryb3BzKTtcclxuICAgIH0sXHJcblxyXG4gICAgbWFrZVJhaW5TdG9wOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKCcucmFpbicpLmVtcHR5KCk7XHJcbiAgICB9XHJcbn0iXX0=
