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
                        (0, translate_1._)('The captain greets you warmly.'),
                        (0, translate_1._)('"Ahh, yes, welcome back. What can I do for you?"')
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
                'captainRamble': {
                    text: [
                        (0, translate_1._)('The captain\'s eyes gleam at the opportunity to run down his list of achievements.'),
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
                        (0, translate_1._)('The captain shuffles his papers in a somewhat performative way.'),
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
                        (0, translate_1._)('I still need to write this, check back later. -C')
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
    }
};

},{"../../lib/translate":1,"../events":7,"../state_manager":17}],4:[function(require,module,exports){
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

},{"../../lib/translate":1,"../events":7,"../places/room":14,"../player/character":15,"../state_manager":17}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mayor = void 0;
var events_1 = require("../events");
var state_manager_1 = require("../state_manager");
var translate_1 = require("../../lib/translate");
var liz_1 = require("./liz");
var road_1 = require("../places/road");
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
                }
            }
        });
    },
    startSuppliesQuest: function () {
        if (!state_manager_1.$SM.get('quest.supplies')) {
            // 1 = started, 2 = next step, etc. until completed
            state_manager_1.$SM.set('quest.supplies', 1);
            road_1.Road.init();
        }
    }
};

},{"../../lib/translate":1,"../events":7,"../places/road":13,"../state_manager":17,"./liz":4}],6:[function(require,module,exports){
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

},{"../lib/translate":1,"./events":7,"./notifications":11,"./places/outpost":12,"./places/road":13,"./places/room":14,"./player/character":15,"./state_manager":17,"./weather":18}],7:[function(require,module,exports){
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
                cooldown: info.cooldown
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

},{"../lib/translate":1,"./Button":2,"./engine":6,"./events/roadwander":8,"./events/room":9,"./notifications":11,"./state_manager":17}],8:[function(require,module,exports){
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
                        }
                    }
                }
            }
        }
    },
];

},{"../../lib/translate":1,"../engine":6,"../places/outpost":12,"../places/road":13,"../player/character":15,"../state_manager":17}],9:[function(require,module,exports){
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

},{"../../lib/translate":1,"../engine":6,"../places/room":14,"../state_manager":17}],10:[function(require,module,exports){
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

},{"../../lib/translate":1,"../Button":2,"../characters/captain":3,"../engine":6,"../header":10,"../state_manager":17,"../weather":18}],13:[function(require,module,exports){
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

},{"../../lib/translate":1,"../Button":2,"../engine":6,"../events":7,"../header":10,"../state_manager":17,"../weather":18}],14:[function(require,module,exports){
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
        //new 
        Button_1.Button.Button({
            id: 'talkButton',
            text: (0, translate_1._)('Talk to the Mayor'),
            click: mayor_1.Mayor.talkToMayor,
            width: '80px',
            cost: {}
        }).appendTo('div#roomPanel');
        //new 
        Button_1.Button.Button({
            id: 'lizButton',
            text: (0, translate_1._)('Talk to Liz'),
            click: liz_1.Liz.talkToLiz,
            width: '80px',
            cost: {}
        }).appendTo('div#roomPanel');
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
    },
    handleStateUpdates: function (e) {
        if (e.category == 'stores') {
            // Room.updateBuildButtons();
        }
        else if (e.category == 'income') {
        }
        else if (e.stateName.indexOf('game.buildings') === 0) {
        }
    }
};

},{"../../lib/translate":1,"../Button":2,"../characters/liz":4,"../characters/mayor":5,"../engine":6,"../header":10,"../notifications":11,"../state_manager":17,"../weather":18}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Character = void 0;
var state_manager_1 = require("../state_manager");
var Button_1 = require("../Button");
var itemList_1 = require("./itemList");
var events_1 = require("../events");
var notifications_1 = require("../notifications");
var translate_1 = require("../../lib/translate");
exports.Character = {
    inventory: {}, // dictionary using item name as key
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
        $('<div>').text('Character').attr('id', 'title').appendTo('div#character');
        // TODO: replace this with derived stats
        for (var stat in state_manager_1.$SM.get('character.rawstats')) {
            $('<div>').text(stat + ': ' + state_manager_1.$SM.get('character.rawstats.' + stat)).appendTo('div#character');
        }
        $('<div>').attr('id', 'buttons').css("margin-top", "20px").appendTo('div#character');
        var b = 
        //new 
        Button_1.Button.Button({
            id: "inventory",
            text: "Inventory",
            click: exports.Character.openInventory
        }).appendTo($('#buttons', 'div#character'));
    },
    options: {}, // Nothing for now
    elem: null,
    inventoryDisplay: null,
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
        // TODO: write to $SM
        state_manager_1.$SM.set('inventory', exports.Character.inventory);
    },
    removeFromInventory: function (item, amount) {
        if (amount === void 0) { amount = 1; }
        if (exports.Character.inventory[item])
            exports.Character.inventory[item] -= amount;
        if (exports.Character.inventory[item] < 1) {
            delete exports.Character.inventory[item];
        }
        // TODO: write to $SM
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

},{"../../lib/translate":1,"../Button":2,"../events":7,"../notifications":11,"../state_manager":17,"./itemList":16}],16:[function(require,module,exports){
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
        destroyOnUse: true
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
        destroyOnUse: false
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
        }
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
        destroyOnUse: true
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
        }
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
        }
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
        }
    }
};

},{"../../lib/translate":1,"../events":7,"../notifications":11,"../state_manager":17,"./character":15}],17:[function(require,module,exports){
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

},{"./engine":6,"./notifications":11}],18:[function(require,module,exports){
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

},{"./engine":6,"./notifications":11,"./state_manager":17}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL3RyYW5zbGF0ZS50cyIsInNyYy9zY3JpcHQvQnV0dG9uLnRzIiwic3JjL3NjcmlwdC9jaGFyYWN0ZXJzL2NhcHRhaW4udHMiLCJzcmMvc2NyaXB0L2NoYXJhY3RlcnMvbGl6LnRzIiwic3JjL3NjcmlwdC9jaGFyYWN0ZXJzL21heW9yLnRzIiwic3JjL3NjcmlwdC9lbmdpbmUudHMiLCJzcmMvc2NyaXB0L2V2ZW50cy50cyIsInNyYy9zY3JpcHQvZXZlbnRzL3JvYWR3YW5kZXIudHMiLCJzcmMvc2NyaXB0L2V2ZW50cy9yb29tLnRzIiwic3JjL3NjcmlwdC9oZWFkZXIudHMiLCJzcmMvc2NyaXB0L25vdGlmaWNhdGlvbnMudHMiLCJzcmMvc2NyaXB0L3BsYWNlcy9vdXRwb3N0LnRzIiwic3JjL3NjcmlwdC9wbGFjZXMvcm9hZC50cyIsInNyYy9zY3JpcHQvcGxhY2VzL3Jvb20udHMiLCJzcmMvc2NyaXB0L3BsYXllci9jaGFyYWN0ZXIudHMiLCJzcmMvc2NyaXB0L3BsYXllci9pdGVtTGlzdC50cyIsInNyYy9zY3JpcHQvc3RhdGVfbWFuYWdlci50cyIsInNyYy9zY3JpcHQvd2VhdGhlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQSxnQkFBZ0I7OztBQUVoQixrQ0FBa0M7QUFDbEMsS0FBSztBQUNMLHVDQUF1QztBQUV2QyxvQ0FBb0M7QUFDcEMsTUFBTTtBQUNOLDJDQUEyQztBQUMzQyxNQUFNO0FBQ04sbUNBQW1DO0FBQ25DLE1BQU07QUFDTixzQ0FBc0M7QUFDdEMsMENBQTBDO0FBRTFDLHFDQUFxQztBQUNyQyxNQUFNO0FBRU4sa0JBQWtCO0FBQ2xCLE1BQU07QUFFTiw4REFBOEQ7QUFDOUQsb0NBQW9DO0FBRXBDLHVIQUF1SDtBQUN2SCx3Q0FBd0M7QUFDeEMsNkJBQTZCO0FBQzdCLCtCQUErQjtBQUMvQixzRUFBc0U7QUFDdEUsT0FBTztBQUNQLFNBQVM7QUFDVCxxQ0FBcUM7QUFDckMsbURBQW1EO0FBQ25ELEtBQUs7QUFDTCw4QkFBOEI7QUFDOUIsTUFBTTtBQUVOLGlDQUFpQztBQUNqQyxLQUFLO0FBQ0wscUNBQXFDO0FBQ3JDLDBCQUEwQjtBQUMxQix5Q0FBeUM7QUFFekMsK0JBQStCO0FBQy9CLE1BQU07QUFFTix5QkFBeUI7QUFDekIsMkRBQTJEO0FBQzNELEtBQUs7QUFDTCw4QkFBOEI7QUFDOUIsTUFBTTtBQUVOLDJCQUEyQjtBQUMzQix1REFBdUQ7QUFDdkQsS0FBSztBQUNMLGtDQUFrQztBQUNsQyxNQUFNO0FBRU4sb0NBQW9DO0FBQ3BDLEtBQUs7QUFDTCwrQ0FBK0M7QUFDL0MsTUFBTTtBQUNOLG9CQUFvQjtBQUNwQixNQUFNO0FBRU4sd0NBQXdDO0FBQ3hDLE1BQU07QUFDTiw0QkFBNEI7QUFDNUIsT0FBTztBQUNQLGdDQUFnQztBQUNoQyxPQUFPO0FBQ1Asb0JBQW9CO0FBQ3BCLE1BQU07QUFFTixzQ0FBc0M7QUFDdEMsd0JBQXdCO0FBQ3hCLE1BQU07QUFDTixvQkFBb0I7QUFDcEIsTUFBTTtBQUVOLG1CQUFtQjtBQUNuQixNQUFNO0FBRU4seUJBQXlCO0FBRXpCLFFBQVE7QUFFUiw2QkFBNkI7QUFFdEIsSUFBTSxDQUFDLEdBQUcsVUFBUyxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFBN0IsUUFBQSxDQUFDLEtBQTRCOzs7Ozs7QUN6RjFDLG1DQUFrQztBQUNsQyw4Q0FBcUM7QUFFeEIsUUFBQSxNQUFNLEdBQUc7SUFDckIsTUFBTSxFQUFFLFVBQVMsT0FBTztRQUN2QixJQUFHLE9BQU8sT0FBTyxDQUFDLFFBQVEsSUFBSSxRQUFRLEVBQUUsQ0FBQztZQUN4QyxJQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7UUFDdkMsQ0FBQztRQUNELElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLElBQUcsT0FBTyxPQUFPLENBQUMsS0FBSyxJQUFJLFVBQVUsRUFBRSxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUNuQyxDQUFDO1FBRUQsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQzthQUNqQixJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsZUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQ3RGLFFBQVEsQ0FBQyxRQUFRLENBQUM7YUFDbEIsSUFBSSxDQUFDLE9BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7YUFDbkUsS0FBSyxDQUFDO1lBQ04sSUFBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztnQkFDbEMsY0FBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDekIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNsQyxDQUFDO1FBQ0YsQ0FBQyxDQUFDO2FBQ0QsSUFBSSxDQUFDLFNBQVMsRUFBRyxPQUFPLE9BQU8sQ0FBQyxLQUFLLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxjQUFhLGVBQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDMUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7YUFDcEIsSUFBSSxDQUFDLFVBQVUsRUFBRSxPQUFPLE9BQU8sQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUvRSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUUzQyxJQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNqQixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUM7WUFDM0QsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDMUQsS0FBSSxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzNCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUEsYUFBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNoRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzVFLENBQUM7WUFDRCxJQUFHLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQ3RDLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDMUIsQ0FBQztRQUNGLENBQUM7UUFFRCxJQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNsQixFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsQ0FBQztRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ1gsQ0FBQztJQUVELFdBQVcsRUFBRSxVQUFTLEdBQUcsRUFBRSxRQUFRO1FBQ2xDLElBQUcsR0FBRyxFQUFFLENBQUM7WUFDUixJQUFHLENBQUMsUUFBUSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDO2dCQUN6QyxHQUFHLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzdCLENBQUM7aUJBQU0sSUFBRyxRQUFRLEVBQUUsQ0FBQztnQkFDcEIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMxQixDQUFDO1lBQ0QsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDaEMsQ0FBQztJQUNGLENBQUM7SUFFRCxVQUFVLEVBQUUsVUFBUyxHQUFHO1FBQ3ZCLElBQUcsR0FBRyxFQUFFLENBQUM7WUFDUixPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssSUFBSSxDQUFDO1FBQ3RDLENBQUM7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNkLENBQUM7SUFFRCxRQUFRLEVBQUUsVUFBUyxHQUFHO1FBQ3JCLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDOUIsSUFBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDWCxDQUFDLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxFQUFFLFFBQVEsRUFBRTtnQkFDakcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDbkMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzVCLElBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7b0JBQ3hCLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQzNCLENBQUM7WUFDRixDQUFDLENBQUMsQ0FBQztZQUNILEdBQUcsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDekIsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDOUIsQ0FBQztJQUNGLENBQUM7SUFFRCxhQUFhLEVBQUUsVUFBUyxHQUFHO1FBQzFCLENBQUMsQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4QyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM5QixJQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO1lBQzFCLEdBQUcsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDN0IsQ0FBQztJQUNGLENBQUM7Q0FDRCxDQUFDOzs7Ozs7QUN4RkYsb0NBQWtDO0FBQ2xDLGtEQUFzQztBQUN0QyxpREFBdUM7QUFFMUIsUUFBQSxPQUFPLEdBQUc7SUFDdEIsYUFBYSxFQUFFO1FBQ2QsZUFBTSxDQUFDLFVBQVUsQ0FBQztZQUNqQixLQUFLLEVBQUUsSUFBQSxhQUFDLEVBQUMscUJBQXFCLENBQUM7WUFDL0IsTUFBTSxFQUFFO2dCQUNQLEtBQUssRUFBRTtvQkFDUyxRQUFRLEVBQUUsY0FBTSxPQUFBLG1CQUFHLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLEVBQWxDLENBQWtDO29CQUNqRSxTQUFTLEVBQUUsTUFBTTtvQkFDakIsTUFBTSxFQUFFLGNBQU0sT0FBQSxtQkFBRyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLENBQUMsRUFBckMsQ0FBcUM7b0JBQ25ELElBQUksRUFBRTt3QkFDYSxJQUFBLGFBQUMsRUFBQyx1SUFBdUksQ0FBQzt3QkFDMUksSUFBQSxhQUFDLEVBQUMsc0ZBQXNGLENBQUM7cUJBQzVGO29CQUNELE9BQU8sRUFBRTt3QkFDTCxrQkFBa0IsRUFBRTs0QkFDaEIsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLG9CQUFvQixDQUFDOzRCQUM3QixTQUFTLEVBQUUsRUFBQyxDQUFDLEVBQUUsa0JBQWtCLEVBQUM7eUJBQ3JDO3dCQUNELGlCQUFpQixFQUFFOzRCQUNmLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxtQkFBbUIsQ0FBQzs0QkFDNUIsU0FBUyxFQUFFLEVBQUMsQ0FBQyxFQUFFLGVBQWUsRUFBQzt5QkFDbEM7d0JBQ0QsT0FBTyxFQUFFOzRCQUNMLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxPQUFPLENBQUM7NEJBQ2hCLFNBQVMsRUFBRSxLQUFLO3lCQUNuQjtxQkFDSjtpQkFDSjtnQkFDRCxNQUFNLEVBQUU7b0JBQ0osSUFBSSxFQUFFO3dCQUNGLElBQUEsYUFBQyxFQUFDLGdDQUFnQyxDQUFDO3dCQUNuQyxJQUFBLGFBQUMsRUFBQyxrREFBa0QsQ0FBQztxQkFDeEQ7b0JBQ0QsT0FBTyxFQUFFO3dCQUNMLGtCQUFrQixFQUFFOzRCQUNoQixJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsb0JBQW9CLENBQUM7NEJBQzdCLFNBQVMsRUFBRSxFQUFDLENBQUMsRUFBQyxrQkFBa0IsRUFBQzs0QkFDakMsU0FBUyxFQUFFLGNBQU0sT0FBQSxDQUFDLG1CQUFHLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLEVBQTlDLENBQThDO3lCQUNsRTt3QkFDRCxpQkFBaUIsRUFBRTs0QkFDZixJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsbUJBQW1CLENBQUM7NEJBQzVCLFNBQVMsRUFBRSxFQUFDLENBQUMsRUFBQyxlQUFlLEVBQUM7eUJBQ2pDO3dCQUNELE9BQU8sRUFBRTs0QkFDTCxJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsT0FBTyxDQUFDOzRCQUNoQixTQUFTLEVBQUUsS0FBSzt5QkFDbkI7cUJBQ0o7aUJBQ0o7Z0JBQ0QsZUFBZSxFQUFFO29CQUNiLElBQUksRUFBRTt3QkFDRixJQUFBLGFBQUMsRUFBQyxvRkFBb0YsQ0FBQzt3QkFDdkYsSUFBQSxhQUFDLEVBQUMsOExBQThMLENBQUM7d0JBQ2pNLElBQUEsYUFBQyxFQUFDLCtEQUErRCxDQUFDO3dCQUNsRSxJQUFBLGFBQUMsRUFBQyx5TUFBeU0sQ0FBQzt3QkFDNU0sSUFBQSxhQUFDLEVBQUMsdUZBQXVGLENBQUM7d0JBQzFGLElBQUEsYUFBQyxFQUFDLG1XQUFtVyxDQUFDO3dCQUN0VyxJQUFBLGFBQUMsRUFBQyx3SkFBd0osQ0FBQzt3QkFDM0osSUFBQSxhQUFDLEVBQUMsK0VBQStFLENBQUM7cUJBQ3JGO29CQUNELE9BQU8sRUFBRTt3QkFDTCxhQUFhLEVBQUU7NEJBQ1gsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLGFBQWEsQ0FBQzs0QkFDdEIsU0FBUyxFQUFFLEVBQUMsQ0FBQyxFQUFDLGVBQWUsRUFBQzt5QkFDakM7cUJBQ0o7aUJBQ0o7Z0JBQ0QsZUFBZSxFQUFFO29CQUNiLElBQUksRUFBRTt3QkFDRixJQUFBLGFBQUMsRUFBQyxpRUFBaUUsQ0FBQzt3QkFDcEUsSUFBQSxhQUFDLEVBQUMsd0NBQXdDLENBQUM7cUJBQzlDO29CQUNELE9BQU8sRUFBRTt3QkFDTCxrQkFBa0IsRUFBRTs0QkFDaEIsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLG9CQUFvQixDQUFDOzRCQUM3QixTQUFTLEVBQUUsRUFBQyxDQUFDLEVBQUMsa0JBQWtCLEVBQUM7NEJBQ2pDLFNBQVMsRUFBRSxjQUFNLE9BQUEsQ0FBQyxtQkFBRyxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQyxFQUE5QyxDQUE4Qzt5QkFDbEU7d0JBQ0QsaUJBQWlCLEVBQUU7NEJBQ2YsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLG1CQUFtQixDQUFDOzRCQUM1QixTQUFTLEVBQUUsRUFBQyxDQUFDLEVBQUMsZUFBZSxFQUFDO3lCQUNqQzt3QkFDRCxPQUFPLEVBQUU7NEJBQ0wsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLE9BQU8sQ0FBQzs0QkFDaEIsU0FBUyxFQUFFLEtBQUs7eUJBQ25CO3FCQUNKO2lCQUNKO2dCQUNELGtCQUFrQixFQUFFO29CQUNoQixJQUFJLEVBQUU7d0JBQ0YsSUFBQSxhQUFDLEVBQUMsa0RBQWtELENBQUM7cUJBQ3hEO29CQUNELE9BQU8sRUFBRTt3QkFDTCxNQUFNLEVBQUU7NEJBQ0osSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLE1BQU0sQ0FBQzs0QkFDZixTQUFTLEVBQUUsS0FBSzt5QkFDbkI7cUJBQ0o7aUJBQ0o7YUFDSjtTQUNKLENBQUMsQ0FBQTtJQUNOLENBQUM7Q0FDSixDQUFBOzs7Ozs7QUMxR0Qsb0NBQW1DO0FBQ25DLGtEQUF1QztBQUN2QyxpREFBd0M7QUFDeEMsdUNBQXNDO0FBQ3RDLGlEQUFnRDtBQUVuQyxRQUFBLEdBQUcsR0FBRztJQUNmLFlBQVksRUFBRTtRQUNoQixtQkFBRyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoQyxtQkFBRyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN0QyxtQkFBRyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsQyxXQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVELFNBQVMsRUFBRTtRQUNWLGVBQU0sQ0FBQyxVQUFVLENBQUM7WUFDakIsS0FBSyxFQUFFLElBQUEsYUFBQyxFQUFDLG1DQUFtQyxDQUFDO1lBQzdDLE1BQU0sRUFBRTtnQkFDUCxLQUFLLEVBQUU7b0JBQ04sUUFBUSxFQUFFLGNBQU0sT0FBQSxtQkFBRyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxFQUE5QixDQUE4QjtvQkFDOUMsU0FBUyxFQUFFLE1BQU07b0JBQ2pCLE1BQU0sRUFBRSxjQUFNLE9BQUEsbUJBQUcsQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLEVBQWpDLENBQWlDO29CQUMvQyxJQUFJLEVBQUU7d0JBQ0wsSUFBQSxhQUFDLEVBQUMsMldBQTJXLENBQUM7d0JBQzlXLElBQUEsYUFBQyxFQUFDLHlCQUF5QixDQUFDO3FCQUM1QjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1IsY0FBYyxFQUFFOzRCQUNmLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxxQkFBcUIsQ0FBQzs0QkFDOUIsU0FBUyxFQUFFLEVBQUMsQ0FBQyxFQUFFLGlCQUFpQixFQUFDO3lCQUNqQzt3QkFDRCxPQUFPLEVBQUU7NEJBQ1IsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLGlCQUFpQixDQUFDOzRCQUMxQixTQUFTLEVBQUUsRUFBQyxDQUFDLEVBQUUsY0FBYyxFQUFDO3lCQUM5Qjt3QkFDRCxPQUFPLEVBQUU7NEJBQ1IsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLE9BQU8sQ0FBQzs0QkFDaEIsU0FBUyxFQUFFLEtBQUs7eUJBQ2hCO3FCQUNEO2lCQUNEO2dCQUNELGlCQUFpQixFQUFFO29CQUNsQixJQUFJLEVBQUU7d0JBQ0wsSUFBQSxhQUFDLEVBQUMsc0ZBQXNGLENBQUM7d0JBQ3pGLElBQUEsYUFBQyxFQUFDLHFIQUFxSCxDQUFDO3FCQUFDO29CQUMxSCxPQUFPLEVBQUU7d0JBQ1IsTUFBTSxFQUFFOzRCQUNQLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxhQUFhLENBQUM7NEJBQ3RCLFNBQVMsRUFBRSxFQUFDLENBQUMsRUFBRSxNQUFNLEVBQUM7NEJBQ3RCLFFBQVEsRUFBRSxjQUFNLE9BQUEsbUJBQUcsQ0FBQyxHQUFHLENBQUMseUJBQXlCLEVBQUUsSUFBSSxDQUFDLEVBQXhDLENBQXdDO3lCQUN4RDtxQkFDRDtpQkFDRDtnQkFFRCxNQUFNLEVBQUU7b0JBQ1AsSUFBSSxFQUFFLENBQUMsSUFBQSxhQUFDLEVBQUMsbURBQW1ELENBQUMsQ0FBQztvQkFDOUQsT0FBTyxFQUFFO3dCQUNSLGNBQWMsRUFBRTs0QkFDZixJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMscUJBQXFCLENBQUM7NEJBQzlCLFNBQVMsRUFBRSxFQUFDLENBQUMsRUFBRSxpQkFBaUIsRUFBQzs0QkFDakMsU0FBUyxFQUFFLGNBQU0sT0FBQSxDQUFDLG1CQUFHLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLEVBQW5DLENBQW1DO3lCQUNwRDt3QkFDRCxPQUFPLEVBQUU7NEJBQ1IsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLGlCQUFpQixDQUFDOzRCQUMxQixTQUFTLEVBQUUsRUFBQyxDQUFDLEVBQUUsY0FBYyxFQUFDO3lCQUM5Qjt3QkFDRCxVQUFVLEVBQUU7NEJBQ1gsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLHNCQUFzQixDQUFDOzRCQUMvQixTQUFTLEVBQUUsRUFBQyxDQUFDLEVBQUUsVUFBVSxFQUFDOzRCQUMxQiw0RUFBNEU7NEJBQzVFLGtDQUFrQzs0QkFDbEMsT0FBTyxFQUFFLGNBQU0sT0FBQSxtQkFBRyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxFQUFsQyxDQUFrQzs0QkFDakQsU0FBUyxFQUFFLGNBQU0sT0FBQSxDQUFDLG1CQUFHLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFXLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBRyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLEVBQXRGLENBQXNGO3lCQUN2Rzt3QkFDRCxPQUFPLEVBQUU7NEJBQ1IsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLE9BQU8sQ0FBQzs0QkFDaEIsU0FBUyxFQUFFLEtBQUs7eUJBQ2hCO3FCQUNEO2lCQUNEO2dCQUNELFVBQVUsRUFBRTtvQkFDWCxJQUFJLEVBQUU7d0JBQ0wsSUFBQSxhQUFDLEVBQUMsbUtBQW1LLENBQUM7d0JBQ3RLLElBQUEsYUFBQyxFQUFDLG9LQUFvSyxDQUFDO3FCQUN2SztvQkFDRCxPQUFPLEVBQUU7d0JBQ1IsTUFBTSxFQUFFOzRCQUNQLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxVQUFVLENBQUM7NEJBQ25CLFNBQVMsRUFBRSxLQUFLOzRCQUNoQixRQUFRLEVBQUU7Z0NBQ1QsbUNBQW1DO2dDQUNuQyxxQkFBUyxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQ0FDMUMsbUJBQUcsQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQ25DLENBQUM7eUJBQ0Q7cUJBQ0Q7aUJBQ0Q7Z0JBQ0QsY0FBYyxFQUFFO29CQUNmLElBQUksRUFBRTt3QkFDTCxJQUFBLGFBQUMsRUFBQywrQkFBK0IsQ0FBQzt3QkFDbEMsSUFBQSxhQUFDLEVBQUMsaUxBQWlMLENBQUM7cUJBQ3BMO29CQUNELE9BQU8sRUFBRTt3QkFDUixNQUFNLEVBQUU7NEJBQ1AsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLHNCQUFzQixDQUFDOzRCQUMvQixTQUFTLEVBQUUsRUFBQyxDQUFDLEVBQUUsTUFBTSxFQUFDO3lCQUN0QjtxQkFDRDtpQkFDRDthQUNEO1NBQ0QsQ0FBQyxDQUFDO0lBQ0osQ0FBQztDQUNELENBQUE7Ozs7OztBQ2hIRCxvQ0FBbUM7QUFDbkMsa0RBQXVDO0FBQ3ZDLGlEQUF3QztBQUN4Qyw2QkFBNEI7QUFDNUIsdUNBQXNDO0FBRXpCLFFBQUEsS0FBSyxHQUFHO0lBQ2pCLFdBQVcsRUFBRTtRQUNmLGVBQU0sQ0FBQyxVQUFVLENBQUM7WUFDakIsS0FBSyxFQUFFLElBQUEsYUFBQyxFQUFDLGdCQUFnQixDQUFDO1lBQzFCLE1BQU0sRUFBRTtnQkFDUCxLQUFLLEVBQUU7b0JBQ04sUUFBUSxFQUFFLGNBQU0sT0FBQSxtQkFBRyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxFQUFoQyxDQUFnQztvQkFDaEQsU0FBUyxFQUFFLE1BQU07b0JBQ2pCLE1BQU0sRUFBRSxjQUFNLE9BQUEsbUJBQUcsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxDQUFDLEVBQW5DLENBQW1DO29CQUNqRCxJQUFJLEVBQUU7d0JBQ0wsSUFBQSxhQUFDLEVBQUMsbUNBQW1DLENBQUM7d0JBQ3RDLElBQUEsYUFBQyxFQUFDLG9GQUFvRixDQUFDO3FCQUN2RjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1IsY0FBYyxFQUFFOzRCQUNmLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxxQkFBcUIsQ0FBQzs0QkFDOUIsU0FBUyxFQUFFLEVBQUMsQ0FBQyxFQUFFLGlCQUFpQixFQUFDO3lCQUNqQzt3QkFDRCxPQUFPLEVBQUU7NEJBQ1IsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLGlCQUFpQixDQUFDOzRCQUMxQixTQUFTLEVBQUUsRUFBQyxDQUFDLEVBQUUsT0FBTyxFQUFDO3lCQUN2Qjt3QkFDRCxPQUFPLEVBQUU7NEJBQ1IsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLE9BQU8sQ0FBQzs0QkFDaEIsU0FBUyxFQUFFLEtBQUs7eUJBQ2hCO3FCQUNEO2lCQUNEO2dCQUNELGlCQUFpQixFQUFFO29CQUNsQixJQUFJLEVBQUU7d0JBQ0wsSUFBQSxhQUFDLEVBQUMsMENBQTBDLENBQUM7d0JBQzdDLElBQUEsYUFBQyxFQUFDLHVMQUF1TCxDQUFDO3dCQUMxTCxJQUFBLGFBQUMsRUFBQywyR0FBMkcsQ0FBQzt3QkFDOUcsSUFBQSxhQUFDLEVBQUMsMEhBQTBILENBQUM7cUJBQzdIO29CQUNELE9BQU8sRUFBRTt3QkFDUixNQUFNLEVBQUU7NEJBQ1AsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLGFBQWEsQ0FBQzs0QkFDdEIsU0FBUyxFQUFFLEVBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBQzs0QkFDdEIsUUFBUSxFQUFFLFNBQUcsQ0FBQyxZQUFZO3lCQUMxQjtxQkFDRDtpQkFDRDtnQkFDRCxNQUFNLEVBQUU7b0JBQ1AsSUFBSSxFQUFFO3dCQUNMLElBQUEsYUFBQyxFQUFDLGlCQUFpQixDQUFDO3dCQUNwQixJQUFBLGFBQUMsRUFBQyx1Q0FBdUMsQ0FBQzt3QkFDMUMsSUFBQSxhQUFDLEVBQUMsNENBQTRDLENBQUM7cUJBQy9DO29CQUNELE9BQU8sRUFBRTt3QkFDUixjQUFjLEVBQUU7NEJBQ2YsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLHFCQUFxQixDQUFDOzRCQUM5QixTQUFTLEVBQUUsRUFBQyxDQUFDLEVBQUUsaUJBQWlCLEVBQUM7eUJBQ2pDO3dCQUNELE9BQU8sRUFBRTs0QkFDUixJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsaUJBQWlCLENBQUM7NEJBQzFCLFNBQVMsRUFBRSxFQUFDLENBQUMsRUFBRSxPQUFPLEVBQUM7eUJBQ3ZCO3dCQUNELE9BQU8sRUFBRTs0QkFDUixJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsT0FBTyxDQUFDOzRCQUNoQixTQUFTLEVBQUUsS0FBSzt5QkFDaEI7cUJBQ0Q7aUJBQ0Q7Z0JBQ0QsT0FBTyxFQUFFO29CQUNSLElBQUksRUFBRTt3QkFDTCxJQUFBLGFBQUMsRUFBQyxnQ0FBZ0MsQ0FBQzt3QkFDbkMsSUFBQSxhQUFDLEVBQUMsNkhBQTZILENBQUM7d0JBQ2hJLElBQUEsYUFBQyxFQUFDLDZKQUE2SixDQUFDO3FCQUNoSztvQkFDRCxPQUFPLEVBQUU7d0JBQ1IsVUFBVSxFQUFFOzRCQUNYLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxVQUFVLENBQUM7NEJBQ25CLFNBQVMsRUFBRSxFQUFDLENBQUMsRUFBRSxNQUFNLEVBQUM7NEJBQ3RCLFFBQVEsRUFBRSxhQUFLLENBQUMsa0JBQWtCO3lCQUNsQztxQkFDRDtpQkFDRDthQUNEO1NBQ0QsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUNELGtCQUFrQixFQUFFO1FBQ25CLElBQUksQ0FBQyxtQkFBRyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUM7WUFDaEMsbURBQW1EO1lBQ25ELG1CQUFHLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzdCLFdBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNiLENBQUM7SUFFRixDQUFDO0NBQ0QsQ0FBQTs7OztBQy9GRCxjQUFjOzs7QUFFZCw4Q0FBcUM7QUFDckMsaURBQXNDO0FBQ3RDLGlEQUFnRDtBQUNoRCxtQ0FBa0M7QUFDbEMsc0NBQXFDO0FBQ3JDLGdEQUErQztBQUMvQyxxQ0FBb0M7QUFDcEMsc0NBQXFDO0FBQ3JDLDRDQUEyQztBQUU5QixRQUFBLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHO0lBRXJDLFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyx1Q0FBdUMsQ0FBQztJQUNyRSxPQUFPLEVBQUUsR0FBRztJQUNaLFNBQVMsRUFBRSxjQUFjO0lBQ3pCLFlBQVksRUFBRSxFQUFFLEdBQUcsSUFBSTtJQUN2QixTQUFTLEVBQUUsS0FBSztJQUVoQixvQkFBb0I7SUFDcEIsTUFBTSxFQUFFLEVBQUU7SUFFVixLQUFLLEVBQUU7UUFDTixPQUFPLEVBQUU7WUFDUixJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsT0FBTyxDQUFDO1lBQ2hCLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyx3QkFBd0IsQ0FBQztZQUNqQyx3Q0FBd0M7WUFDeEMsTUFBTSxFQUFFLElBQUEsYUFBQyxFQUFDLHVDQUF1QyxDQUFDO1NBQ2xEO1FBQ0QsZ0JBQWdCLEVBQUU7WUFDakIsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLGdCQUFnQixDQUFDO1lBQ3pCLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyw4QkFBOEIsQ0FBQztZQUN2QyxNQUFNLEVBQUUsSUFBQSxhQUFDLEVBQUMsb0RBQW9ELENBQUM7U0FDL0Q7UUFDRCxnQkFBZ0IsRUFBRTtZQUNqQiwwQ0FBMEM7WUFDMUMsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLGdCQUFnQixDQUFDO1lBQ3pCLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQywrQ0FBK0MsQ0FBQztZQUN4RCxNQUFNLEVBQUUsSUFBQSxhQUFDLEVBQUMsMENBQTBDLENBQUM7U0FDckQ7UUFDRCxXQUFXLEVBQUU7WUFDWixJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsV0FBVyxDQUFDO1lBQ3BCLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxnQ0FBZ0MsQ0FBQztZQUN6QyxNQUFNLEVBQUUsSUFBQSxhQUFDLEVBQUMscUNBQXFDLENBQUM7U0FDaEQ7UUFDRCxpQkFBaUIsRUFBRTtZQUNsQixJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsaUJBQWlCLENBQUM7WUFDMUIsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLGdDQUFnQyxDQUFDO1lBQ3pDLE1BQU0sRUFBRSxJQUFBLGFBQUMsRUFBQyxrQ0FBa0MsQ0FBQztTQUM3QztRQUNELFlBQVksRUFBRTtZQUNiLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxZQUFZLENBQUM7WUFDckIsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLGtDQUFrQyxDQUFDO1lBQzNDLE1BQU0sRUFBRSxJQUFBLGFBQUMsRUFBQyw2QkFBNkIsQ0FBQztTQUN4QztRQUNELFNBQVMsRUFBRTtZQUNWLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxTQUFTLENBQUM7WUFDbEIsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLGdDQUFnQyxDQUFDO1lBQ3pDLE1BQU0sRUFBRSxJQUFBLGFBQUMsRUFBQyxpQ0FBaUMsQ0FBQztTQUM1QztRQUNELFNBQVMsRUFBRTtZQUNWLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxTQUFTLENBQUM7WUFDbEIsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLHVCQUF1QixDQUFDO1lBQ2hDLE1BQU0sRUFBRSxJQUFBLGFBQUMsRUFBQyxtQ0FBbUMsQ0FBQztTQUM5QztRQUNELE9BQU8sRUFBRTtZQUNSLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxPQUFPLENBQUM7WUFDaEIsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLGFBQWEsQ0FBQztZQUN0QixNQUFNLEVBQUUsSUFBQSxhQUFDLEVBQUMsdUJBQXVCLENBQUM7U0FDbEM7UUFDRCxVQUFVLEVBQUU7WUFDWCxJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsVUFBVSxDQUFDO1lBQ25CLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxtQ0FBbUMsQ0FBQztZQUM1QyxNQUFNLEVBQUUsSUFBQSxhQUFDLEVBQUMsNEJBQTRCLENBQUM7U0FDdkM7UUFDRCxZQUFZLEVBQUU7WUFDYixJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsWUFBWSxDQUFDO1lBQ3JCLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxpQ0FBaUMsQ0FBQztZQUMxQyxNQUFNLEVBQUUsSUFBQSxhQUFDLEVBQUMsa0NBQWtDLENBQUM7U0FDN0M7S0FDRDtJQUVELE9BQU8sRUFBRTtRQUNSLEtBQUssRUFBRSxJQUFJO1FBQ1gsS0FBSyxFQUFFLElBQUk7UUFDWCxHQUFHLEVBQUUsSUFBSTtRQUNULE9BQU8sRUFBRSxLQUFLO1FBQ2QsVUFBVSxFQUFFLEtBQUs7S0FDakI7SUFFRCxNQUFNLEVBQUUsS0FBSztJQUViLElBQUksRUFBRSxVQUFTLE9BQVE7UUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUN0QixJQUFJLENBQUMsT0FBTyxFQUNaLE9BQU8sQ0FDUCxDQUFDO1FBQ0YsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUNqQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO1FBRTdCLDBCQUEwQjtRQUMxQixJQUFHLENBQUMsY0FBTSxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUM7WUFDM0IsTUFBTSxDQUFDLFFBQVEsR0FBRyxxQkFBcUIsQ0FBQztRQUN6QyxDQUFDO1FBRUQsbUJBQW1CO1FBQ25CLElBQUcsY0FBTSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7WUFDdEIsTUFBTSxDQUFDLFFBQVEsR0FBRyxvQkFBb0IsQ0FBQztRQUN4QyxDQUFDO1FBRUQsY0FBTSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFFMUIsSUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUMvQixNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQ25DLENBQUM7YUFBTSxDQUFDO1lBQ1AsY0FBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ25CLENBQUM7UUFFRCxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUxRCxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO2FBQ25CLFFBQVEsQ0FBQyxNQUFNLENBQUM7YUFDaEIsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRW5CLElBQUcsT0FBTyxLQUFLLElBQUksV0FBVyxFQUFDLENBQUM7WUFDL0IsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztpQkFDNUIsUUFBUSxDQUFDLGNBQWMsQ0FBQztpQkFDeEIsUUFBUSxDQUFDLFNBQVMsQ0FBQztpQkFDbkIsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pCLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUM7aUJBQzdCLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQztpQkFDL0IsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3pCLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7aUJBQ3pCLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMxQixDQUFDLENBQUMsTUFBTSxDQUFDO2lCQUNQLElBQUksQ0FBQyxXQUFXLENBQUM7aUJBQ2pCLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUV4QixDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxVQUFTLElBQUksRUFBQyxPQUFPO2dCQUNsQyxDQUFDLENBQUMsTUFBTSxDQUFDO3FCQUNQLElBQUksQ0FBQyxPQUFPLENBQUM7cUJBQ2IsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUM7cUJBQzNCLEVBQUUsQ0FBQyxPQUFPLEVBQUUsY0FBYSxjQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN4RCxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDekIsQ0FBQyxDQUFDLENBQUM7UUFDSixDQUFDO1FBRUQsQ0FBQyxDQUFDLFFBQVEsQ0FBQzthQUNULFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQzthQUM3QixJQUFJLENBQUMsSUFBQSxhQUFDLEVBQUMsYUFBYSxDQUFDLENBQUM7YUFDdEIsS0FBSyxDQUFDLGNBQU0sQ0FBQyxhQUFhLENBQUM7YUFDM0IsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWpCLENBQUMsQ0FBQyxRQUFRLENBQUM7YUFDVCxRQUFRLENBQUMsU0FBUyxDQUFDO2FBQ25CLElBQUksQ0FBQyxJQUFBLGFBQUMsRUFBQyxRQUFRLENBQUMsQ0FBQzthQUNqQixLQUFLLENBQUM7WUFDTixjQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxDQUFDLGNBQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO1lBQ3ZELElBQUcsY0FBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVO2dCQUMzQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUEsYUFBQyxFQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7O2dCQUU1QixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUEsYUFBQyxFQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDO2FBQ0QsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWpCLENBQUMsQ0FBQyxRQUFRLENBQUM7YUFDVCxRQUFRLENBQUMsU0FBUyxDQUFDO2FBQ25CLElBQUksQ0FBQyxJQUFBLGFBQUMsRUFBQyxVQUFVLENBQUMsQ0FBQzthQUNuQixLQUFLLENBQUMsY0FBTSxDQUFDLGFBQWEsQ0FBQzthQUMzQixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFakIsQ0FBQyxDQUFDLFFBQVEsQ0FBQzthQUNULFFBQVEsQ0FBQyxTQUFTLENBQUM7YUFDbkIsSUFBSSxDQUFDLElBQUEsYUFBQyxFQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ2pCLEtBQUssQ0FBQyxjQUFNLENBQUMsS0FBSyxDQUFDO2FBQ25CLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVqQixDQUFDLENBQUMsUUFBUSxDQUFDO2FBQ1QsUUFBUSxDQUFDLFNBQVMsQ0FBQzthQUNuQixJQUFJLENBQUMsSUFBQSxhQUFDLEVBQUMsT0FBTyxDQUFDLENBQUM7YUFDaEIsS0FBSyxDQUFDLGNBQU0sQ0FBQyxZQUFZLENBQUM7YUFDMUIsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWpCLENBQUMsQ0FBQyxRQUFRLENBQUM7YUFDVCxRQUFRLENBQUMsU0FBUyxDQUFDO2FBQ25CLElBQUksQ0FBQyxJQUFBLGFBQUMsRUFBQyxZQUFZLENBQUMsQ0FBQzthQUNyQixLQUFLLENBQUMsY0FBYSxNQUFNLENBQUMsSUFBSSxDQUFDLHlEQUF5RCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDN0YsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWpCLENBQUMsQ0FBQyxRQUFRLENBQUM7YUFDVCxRQUFRLENBQUMsU0FBUyxDQUFDO2FBQ25CLElBQUksQ0FBQyxJQUFBLGFBQUMsRUFBQyxTQUFTLENBQUMsQ0FBQzthQUNsQixLQUFLLENBQUMsY0FBYSxNQUFNLENBQUMsSUFBSSxDQUFDLDJDQUEyQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDL0UsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWpCLDRCQUE0QjtRQUM1QixDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxjQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUUvRCxtQkFBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1gsNkJBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNyQixlQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDZCxXQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWixxQkFBUyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2pCLGlCQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDZixJQUFHLG1CQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7WUFDekIsV0FBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2IsQ0FBQztRQUNELElBQUcsbUJBQUcsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQztZQUM1QixpQkFBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2hCLENBQUM7UUFFRCxjQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDdEIsY0FBTSxDQUFDLFFBQVEsQ0FBQyxXQUFJLENBQUMsQ0FBQztJQUV2QixDQUFDO0lBRUQsWUFBWSxFQUFFO1FBQ2IsT0FBTyxDQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFFLG9CQUFvQixDQUFFLElBQUksQ0FBQyxJQUFJLENBQUUsT0FBTyxPQUFPLElBQUksV0FBVyxJQUFJLENBQUMsS0FBSyxDQUFFLENBQUUsQ0FBQztJQUNoSCxDQUFDO0lBRUQsUUFBUSxFQUFFO1FBQ1QsT0FBTyxDQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFFLG9CQUFvQixDQUFFLEdBQUcsQ0FBQyxJQUFJLDRDQUE0QyxDQUFDLElBQUksQ0FBRSxTQUFTLENBQUMsU0FBUyxDQUFFLENBQUUsQ0FBQztJQUM1SSxDQUFDO0lBRUQsUUFBUSxFQUFFO1FBQ1QsSUFBRyxPQUFPLE9BQU8sSUFBSSxXQUFXLElBQUksWUFBWSxFQUFFLENBQUM7WUFDbEQsSUFBRyxjQUFNLENBQUMsVUFBVSxJQUFJLElBQUksRUFBRSxDQUFDO2dCQUM5QixZQUFZLENBQUMsY0FBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2pDLENBQUM7WUFDRCxJQUFHLE9BQU8sY0FBTSxDQUFDLFdBQVcsSUFBSSxXQUFXLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLGNBQU0sQ0FBQyxXQUFXLEdBQUcsY0FBTSxDQUFDLFlBQVksRUFBQyxDQUFDO2dCQUNyRyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUN6RSxjQUFNLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNqQyxDQUFDO1lBQ0QsWUFBWSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hELENBQUM7SUFDRixDQUFDO0lBRUQsUUFBUSxFQUFFO1FBQ1QsSUFBSSxDQUFDO1lBQ0osSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEQsSUFBRyxVQUFVLEVBQUUsQ0FBQztnQkFDZixNQUFNLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQztnQkFDMUIsY0FBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUM1QixDQUFDO1FBQ0YsQ0FBQztRQUFDLE9BQU0sQ0FBQyxFQUFFLENBQUM7WUFDWCxjQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2QsTUFBTSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDbEIsbUJBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLGNBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNuQyxjQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN0QyxDQUFDO0lBQ0YsQ0FBQztJQUVELFlBQVksRUFBRTtRQUNiLGVBQU0sQ0FBQyxVQUFVLENBQUM7WUFDakIsS0FBSyxFQUFFLElBQUEsYUFBQyxFQUFDLGlCQUFpQixDQUFDO1lBQzNCLE1BQU0sRUFBRTtnQkFDUCxLQUFLLEVBQUU7b0JBQ04sSUFBSSxFQUFFO3dCQUNMLElBQUEsYUFBQyxFQUFDLDRDQUE0QyxDQUFDO3dCQUMvQyxJQUFBLGFBQUMsRUFBQyx3QkFBd0IsQ0FBQztxQkFDM0I7b0JBQ0QsT0FBTyxFQUFFO3dCQUNSLFFBQVEsRUFBRTs0QkFDVCxJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsUUFBUSxDQUFDOzRCQUNqQixRQUFRLEVBQUUsY0FBTSxDQUFDLFFBQVE7eUJBQ3pCO3dCQUNELFFBQVEsRUFBRTs0QkFDVCxJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsUUFBUSxDQUFDOzRCQUNqQixTQUFTLEVBQUUsRUFBQyxDQUFDLEVBQUUsU0FBUyxFQUFDO3lCQUN6Qjt3QkFDRCxRQUFRLEVBQUU7NEJBQ1QsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLFFBQVEsQ0FBQzs0QkFDakIsU0FBUyxFQUFFLEtBQUs7eUJBQ2hCO3FCQUNEO2lCQUNEO2dCQUNELFNBQVMsRUFBRTtvQkFDVixJQUFJLEVBQUU7d0JBQ0wsSUFBQSxhQUFDLEVBQUMsZUFBZSxDQUFDO3dCQUNsQixJQUFBLGFBQUMsRUFBQyxnREFBZ0QsQ0FBQzt3QkFDbkQsSUFBQSxhQUFDLEVBQUMsdUJBQXVCLENBQUM7cUJBQzFCO29CQUNELE9BQU8sRUFBRTt3QkFDUixLQUFLLEVBQUU7NEJBQ04sSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLEtBQUssQ0FBQzs0QkFDZCxTQUFTLEVBQUUsRUFBQyxDQUFDLEVBQUUsYUFBYSxFQUFDOzRCQUM3QixRQUFRLEVBQUUsY0FBTSxDQUFDLGVBQWU7eUJBQ2hDO3dCQUNELElBQUksRUFBRTs0QkFDTCxJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsSUFBSSxDQUFDOzRCQUNiLFNBQVMsRUFBRSxLQUFLO3lCQUNoQjtxQkFDRDtpQkFDRDtnQkFDRCxhQUFhLEVBQUU7b0JBQ2QsSUFBSSxFQUFFLENBQUMsSUFBQSxhQUFDLEVBQUMseUJBQXlCLENBQUMsQ0FBQztvQkFDcEMsUUFBUSxFQUFFLEVBQUU7b0JBQ1osT0FBTyxFQUFFO3dCQUNSLE1BQU0sRUFBRTs0QkFDUCxJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsUUFBUSxDQUFDOzRCQUNqQixTQUFTLEVBQUUsS0FBSzs0QkFDaEIsUUFBUSxFQUFFLGNBQU0sQ0FBQyxRQUFRO3lCQUN6Qjt3QkFDRCxRQUFRLEVBQUU7NEJBQ1QsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLFFBQVEsQ0FBQzs0QkFDakIsU0FBUyxFQUFFLEtBQUs7eUJBQ2hCO3FCQUNEO2lCQUNEO2FBQ0Q7U0FDRCxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsZ0JBQWdCLEVBQUU7UUFDakIsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDckQsUUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZDLFFBQVEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN2QyxRQUFRLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFdkMsT0FBTyxRQUFRLENBQUM7SUFDakIsQ0FBQztJQUVELFFBQVEsRUFBRTtRQUNULGNBQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNsQixJQUFJLFFBQVEsR0FBRyxjQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN6QyxjQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDekIsZUFBTSxDQUFDLFVBQVUsQ0FBQztZQUNqQixLQUFLLEVBQUUsSUFBQSxhQUFDLEVBQUMsUUFBUSxDQUFDO1lBQ2xCLE1BQU0sRUFBRTtnQkFDUCxLQUFLLEVBQUU7b0JBQ04sSUFBSSxFQUFFLENBQUMsSUFBQSxhQUFDLEVBQUMsWUFBWSxDQUFDLENBQUM7b0JBQ3ZCLFFBQVEsRUFBRSxRQUFRO29CQUNsQixRQUFRLEVBQUUsSUFBSTtvQkFDZCxPQUFPLEVBQUU7d0JBQ1IsTUFBTSxFQUFFOzRCQUNQLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxRQUFRLENBQUM7NEJBQ2pCLFNBQVMsRUFBRSxLQUFLOzRCQUNoQixRQUFRLEVBQUUsY0FBTSxDQUFDLGdCQUFnQjt5QkFDakM7cUJBQ0Q7aUJBQ0Q7YUFDRDtTQUNELENBQUMsQ0FBQztRQUNILGNBQU0sQ0FBQyxVQUFVLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsUUFBUSxFQUFFLFVBQVMsUUFBUTtRQUMxQixjQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUMxQixRQUFRLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDdkMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZDLFFBQVEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN2QyxJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFDO1FBQ3JDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBRUQsS0FBSyxFQUFFLFVBQVMsR0FBRyxFQUFFLEdBQUc7UUFDdkIsSUFBRyxPQUFPLEVBQUUsS0FBSyxVQUFVLEVBQUUsQ0FBQztZQUM3QixFQUFFLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDL0IsQ0FBQztJQUNGLENBQUM7SUFFRCxhQUFhLEVBQUU7UUFDZCxlQUFNLENBQUMsVUFBVSxDQUFDO1lBQ2pCLEtBQUssRUFBRSxJQUFBLGFBQUMsRUFBQyxVQUFVLENBQUM7WUFDcEIsTUFBTSxFQUFFO2dCQUNQLEtBQUssRUFBRTtvQkFDTixJQUFJLEVBQUUsQ0FBQyxJQUFBLGFBQUMsRUFBQyxtQkFBbUIsQ0FBQyxDQUFDO29CQUM5QixPQUFPLEVBQUU7d0JBQ1IsS0FBSyxFQUFFOzRCQUNOLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxLQUFLLENBQUM7NEJBQ2QsU0FBUyxFQUFFLEtBQUs7NEJBQ2hCLFFBQVEsRUFBRSxjQUFNLENBQUMsVUFBVTt5QkFDM0I7d0JBQ0QsSUFBSSxFQUFFOzRCQUNMLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxJQUFJLENBQUM7NEJBQ2IsU0FBUyxFQUFFLEtBQUs7eUJBQ2hCO3FCQUNEO2lCQUNEO2FBQ0Q7U0FDRCxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsVUFBVSxFQUFFLFVBQVMsUUFBUTtRQUM1QixJQUFHLE9BQU8sT0FBTyxJQUFJLFdBQVcsSUFBSSxZQUFZLEVBQUUsQ0FBQztZQUNsRCxNQUFNLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNsQixZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDdEIsQ0FBQztRQUNELElBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNkLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNuQixDQUFDO0lBQ0YsQ0FBQztJQUVELEtBQUssRUFBRTtRQUNOLGVBQU0sQ0FBQyxVQUFVLENBQUM7WUFDakIsS0FBSyxFQUFFLElBQUEsYUFBQyxFQUFDLE9BQU8sQ0FBQztZQUNqQixNQUFNLEVBQUU7Z0JBQ1AsS0FBSyxFQUFFO29CQUNOLElBQUksRUFBRSxDQUFDLElBQUEsYUFBQyxFQUFDLHFCQUFxQixDQUFDLENBQUM7b0JBQ2hDLE9BQU8sRUFBRTt3QkFDUixVQUFVLEVBQUU7NEJBQ1gsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLFVBQVUsQ0FBQzs0QkFDbkIsU0FBUyxFQUFFLEtBQUs7NEJBQ2hCLFFBQVEsRUFBRTtnQ0FDVCxNQUFNLENBQUMsSUFBSSxDQUFDLCtDQUErQyxHQUFHLGNBQU0sQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLDZGQUE2RixDQUFDLENBQUM7NEJBQ3pMLENBQUM7eUJBQ0Q7d0JBQ0QsUUFBUSxFQUFFOzRCQUNULElBQUksRUFBQyxJQUFBLGFBQUMsRUFBQyxTQUFTLENBQUM7NEJBQ2pCLFNBQVMsRUFBRSxLQUFLOzRCQUNoQixRQUFRLEVBQUU7Z0NBQ1QsTUFBTSxDQUFDLElBQUksQ0FBQyxvQ0FBb0MsR0FBRyxjQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSw2RkFBNkYsQ0FBQyxDQUFDOzRCQUM5SyxDQUFDO3lCQUNEO3dCQUNELFNBQVMsRUFBRTs0QkFDVixJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsU0FBUyxDQUFDOzRCQUNsQixTQUFTLEVBQUUsS0FBSzs0QkFDaEIsUUFBUSxFQUFFO2dDQUNULE1BQU0sQ0FBQyxJQUFJLENBQUMsNERBQTRELEdBQUcsY0FBTSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsOEZBQThGLENBQUMsQ0FBQzs0QkFDdk0sQ0FBQzt5QkFDRDt3QkFDRCxRQUFRLEVBQUU7NEJBQ1QsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLFFBQVEsQ0FBQzs0QkFDakIsU0FBUyxFQUFFLEtBQUs7NEJBQ2hCLFFBQVEsRUFBRTtnQ0FDVCxNQUFNLENBQUMsSUFBSSxDQUFDLG1DQUFtQyxHQUFHLGNBQU0sQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLDhGQUE4RixDQUFDLENBQUM7NEJBQzlLLENBQUM7eUJBQ0Q7d0JBQ0QsT0FBTyxFQUFFOzRCQUNSLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxPQUFPLENBQUM7NEJBQ2hCLFNBQVMsRUFBRSxLQUFLO3lCQUNoQjtxQkFDRDtpQkFDRDthQUNEO1NBQ0QsRUFDRDtZQUNDLEtBQUssRUFBRSxPQUFPO1NBQ2QsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELGNBQWMsRUFBRSxVQUFTLEtBQUs7UUFDN0IsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDakQsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxJQUFHLEtBQUssQ0FBQyxLQUFLLElBQUksS0FBSyxFQUFFLENBQUM7Z0JBQ3pCLE9BQU8sS0FBSyxDQUFDO1lBQ2QsQ0FBQztRQUNGLENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFFRCxXQUFXLEVBQUU7UUFDWixJQUFJLE9BQU8sR0FBRyxjQUFNLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3BELElBQUssT0FBTyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUcsQ0FBQztZQUM1QyxPQUFPLElBQUksQ0FBQztRQUNiLENBQUM7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNkLENBQUM7SUFFRCxhQUFhLEVBQUU7UUFDZCxJQUFJLE9BQU8sR0FBRyxjQUFNLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3BELElBQUksT0FBTyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ3JCLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsb0ZBQW9GLENBQUMsQ0FBQztZQUN2RyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUEsYUFBQyxFQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDdkMsQ0FBQzthQUFNLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQzdCLE9BQU8sQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBQSxhQUFDLEVBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUN2QyxDQUFDO2FBQU0sQ0FBQztZQUNQLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ2hELE9BQU8sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBQ3hCLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBQSxhQUFDLEVBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUN4QyxDQUFDO0lBQ0YsQ0FBQztJQUVELGNBQWM7SUFDZCxPQUFPLEVBQUU7UUFDUixPQUFPLHNDQUFzQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsVUFBUyxDQUFDO1lBQ3hFLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBQyxFQUFFLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFDLEdBQUcsR0FBQyxHQUFHLENBQUMsQ0FBQztZQUMzRCxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsWUFBWSxFQUFFLElBQUk7SUFFbEIsUUFBUSxFQUFFLFVBQVMsTUFBTTtRQUN4QixJQUFHLGNBQU0sQ0FBQyxZQUFZLElBQUksTUFBTSxFQUFFLENBQUM7WUFDbEMsSUFBSSxZQUFZLEdBQUcsY0FBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0YsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRWhDLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ2xDLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ25DLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLFlBQVksQ0FBQyxDQUFDO1lBQy9DLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLEVBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFFL0QsSUFBRyxtQkFBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxTQUFTLEVBQUUsQ0FBQztnQkFDMUMsNkRBQTZEO2dCQUM1RCxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxFQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQ2pFLENBQUM7WUFFRCxjQUFNLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQztZQUU3QixNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXZCLElBQUcsY0FBTSxDQUFDLFlBQVksSUFBSSxXQUFJO1lBQzdCLGtDQUFrQztjQUNoQyxDQUFDO2dCQUNILDREQUE0RDtnQkFDNUQsaURBQWlEO2dCQUNqRCxJQUFJLE1BQU0sSUFBSSxXQUFJO2dCQUNqQixvQkFBb0I7a0JBQ25CLENBQUM7b0JBQ0YsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDN0MsQ0FBQztZQUNGLENBQUM7WUFFRCxJQUFHLE1BQU0sSUFBSSxXQUFJO1lBQ2hCLHFCQUFxQjtjQUNuQixDQUFDO2dCQUNILENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDN0MsQ0FBQztZQUVELDZCQUFhLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWxDLENBQUM7SUFDRixDQUFDO0lBRUQ7OztVQUdHO0lBQ0gsY0FBYyxFQUFFLFVBQVMsYUFBYSxFQUFFLGVBQWU7UUFDdEQsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFbkMsaURBQWlEO1FBQ2pELElBQUcsT0FBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLFdBQVc7WUFBRSxPQUFPO1FBRTFDLElBQUcsT0FBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLFdBQVc7WUFBRSxlQUFlLEdBQUcsQ0FBQyxDQUFDO1FBRWhFLElBQUcsYUFBYSxLQUFLLElBQUksRUFBRSxDQUFDO1lBQzNCLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLEdBQUcsZUFBZSxFQUFDLENBQUMsQ0FBQztRQUMvRSxDQUFDO2FBQ0ksSUFBRyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUMvQixNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUMsR0FBRyxFQUFFLEtBQUssRUFBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsR0FBRyxHQUFHLGVBQWUsRUFBQyxDQUFDLENBQUM7UUFDL0UsQ0FBQzthQUNJLENBQUM7WUFDTCxNQUFNLENBQUMsT0FBTyxDQUFDO2dCQUNiLEdBQUcsRUFBRSxhQUFhLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUk7YUFDdkMsRUFDRDtnQkFDQyxLQUFLLEVBQUUsS0FBSztnQkFDWixRQUFRLEVBQUUsR0FBRyxHQUFHLGVBQWU7YUFDaEMsQ0FBQyxDQUFDO1FBQ0osQ0FBQztJQUNGLENBQUM7SUFFRCxHQUFHLEVBQUUsVUFBUyxHQUFHO1FBQ2hCLElBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsQixDQUFDO0lBQ0YsQ0FBQztJQUVELFlBQVksRUFBRTtRQUNiLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRCxpQkFBaUIsRUFBRTtRQUNsQixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELFlBQVksRUFBRSxVQUFTLEdBQUcsRUFBRSxLQUFLO1FBQ2hDLE9BQU8sSUFBQSxhQUFDLEVBQUMsY0FBYyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELFNBQVMsRUFBRSxVQUFTLENBQUM7UUFDcEIsSUFBRyxjQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2xDLGNBQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLENBQUM7SUFDRixDQUFDO0lBRUQsVUFBVSxFQUFFLFVBQVMsQ0FBQztRQUNyQixJQUFHLGNBQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDbkMsY0FBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkMsQ0FBQztJQUNGLENBQUM7SUFFRCxPQUFPLEVBQUUsVUFBUyxDQUFDO1FBQ2xCLElBQUcsY0FBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNoQyxjQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxDQUFDO0lBQ0YsQ0FBQztJQUVELFNBQVMsRUFBRSxVQUFTLENBQUM7UUFDcEIsSUFBRyxjQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2xDLGNBQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLENBQUM7SUFDRixDQUFDO0lBRUQsZ0JBQWdCLEVBQUU7UUFDakIsUUFBUSxDQUFDLGFBQWEsR0FBRyxjQUFjLENBQUMsQ0FBQyxpQkFBaUI7UUFDMUQsUUFBUSxDQUFDLFdBQVcsR0FBRyxjQUFjLENBQUMsQ0FBQyx1QkFBdUI7SUFDL0QsQ0FBQztJQUVELGVBQWUsRUFBRTtRQUNoQixRQUFRLENBQUMsYUFBYSxHQUFHLGdCQUFnQixDQUFDO1FBQzFDLFFBQVEsQ0FBQyxXQUFXLEdBQUcsZ0JBQWdCLENBQUM7SUFDekMsQ0FBQztJQUVELFVBQVUsRUFBRSxVQUFTLFFBQVE7UUFDNUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFRCxrQkFBa0IsRUFBRSxVQUFTLENBQUM7SUFFOUIsQ0FBQztJQUVELGNBQWMsRUFBRSxVQUFTLEdBQUc7UUFDM0IsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNuQyxJQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUM7WUFDN0QsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFFLDBCQUEwQixFQUFHLElBQUksR0FBQyxJQUFJLENBQUUsQ0FBQztRQUNuRyxDQUFDO2FBQUksQ0FBQztZQUNMLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLENBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUUsQ0FBQSxDQUFDLENBQUEsR0FBRyxDQUFBLENBQUMsQ0FBQSxHQUFHLENBQUMsR0FBRyxPQUFPLEdBQUMsSUFBSSxDQUFDO1FBQzFILENBQUM7SUFDRixDQUFDO0lBRUQsWUFBWSxFQUFFO1FBQ2IsSUFBSSxJQUFJLEdBQUcsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxZQUFZLEdBQUcsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFFLENBQUMsRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsSUFBRSxJQUFJLENBQUM7UUFDN0ksSUFBRyxJQUFJLElBQUksT0FBTyxPQUFPLElBQUksV0FBVyxJQUFJLFlBQVksRUFBRSxDQUFDO1lBQzFELFlBQVksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQzFCLENBQUM7SUFDRixDQUFDO0lBRUQsVUFBVSxFQUFFLFVBQVMsUUFBUSxFQUFFLE9BQU8sRUFBRSxVQUFXO1FBRWxELElBQUksY0FBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUM5QyxjQUFNLENBQUMsR0FBRyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7WUFDbkQsT0FBTyxJQUFJLENBQUMsQ0FBQztRQUNkLENBQUM7UUFFRCxPQUFPLFVBQVUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFFdEMsQ0FBQztDQUVELENBQUM7QUFFRixTQUFTLGNBQWMsQ0FBQyxDQUFDO0lBQ3hCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQUVELFNBQVMsZ0JBQWdCLENBQUMsQ0FBQztJQUMxQixPQUFPLElBQUksQ0FBQztBQUNiLENBQUM7QUFHRCxTQUFTLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSTtJQUVqQixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDO0lBQ3BDLElBQUksS0FBSyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7SUFFeEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQztJQUM5QixJQUFJLEtBQUssR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBRWxDLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ1Ysd0RBQXdEO1FBQ3hELE9BQU8sQ0FBRSxLQUFLLEdBQUcsS0FBSyxDQUFFLENBQUM7SUFDakMsQ0FBQztTQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO1FBQ2xCLE9BQU8sQ0FBRSxLQUFLLEdBQUcsS0FBSyxDQUFFLENBQUM7SUFDakMsQ0FBQztTQUFJLENBQUM7UUFDRSxPQUFPLENBQUUsQ0FBRSxLQUFLLElBQUksS0FBSyxDQUFFLElBQUksQ0FBRSxLQUFLLElBQUksS0FBSyxDQUFFLENBQUUsQ0FBQztJQUM1RCxDQUFDO0FBRVQsQ0FBQztBQUVELFNBQVMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO0lBRWxCLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBRSxDQUFDO0lBQzVDLElBQUksQ0FBQyxHQUFHLENBQUUsS0FBSyxFQUFFLENBQUUsS0FBSyxHQUFHLENBQUMsQ0FBRSxHQUFHLElBQUksQ0FBRSxDQUFDO0FBRWhELENBQUM7QUFHRCxvREFBb0Q7QUFDcEQsQ0FBQyxDQUFDLFFBQVEsR0FBRyxVQUFVLEVBQUU7SUFDeEIsSUFBSSxTQUFTLEVBQUUsS0FBSyxHQUFHLEVBQUUsSUFBSSxjQUFNLENBQUMsTUFBTSxDQUFFLEVBQUUsQ0FBRSxDQUFDO0lBQ2pELElBQUssQ0FBQyxLQUFLLEVBQUcsQ0FBQztRQUNkLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDL0IsS0FBSyxHQUFHO1lBQ04sT0FBTyxFQUFFLFNBQVMsQ0FBQyxJQUFJO1lBQ3ZCLFNBQVMsRUFBRSxTQUFTLENBQUMsR0FBRztZQUN4QixXQUFXLEVBQUUsU0FBUyxDQUFDLE1BQU07U0FDOUIsQ0FBQztRQUNGLElBQUssRUFBRSxFQUFHLENBQUM7WUFDVixjQUFNLENBQUMsTUFBTSxDQUFFLEVBQUUsQ0FBRSxHQUFHLEtBQUssQ0FBQztRQUM3QixDQUFDO0lBQ0YsQ0FBQztJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2QsQ0FBQyxDQUFDO0FBRUYsQ0FBQyxDQUFDO0lBQ0QsY0FBTSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2YsQ0FBQyxDQUFDLENBQUM7Ozs7OztBQ2pzQkg7O0dBRUc7QUFDSCxrREFBdUQ7QUFDdkQsc0NBQTJDO0FBQzNDLG1DQUFrQztBQUNsQyw4Q0FBcUM7QUFDckMsaURBQXNDO0FBQ3RDLGlEQUFnRDtBQUNoRCxtQ0FBa0M7QUFXckIsUUFBQSxNQUFNLEdBQUc7SUFFckIsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsb0JBQW9CO0lBQy9DLFdBQVcsRUFBRSxHQUFHO0lBQ2hCLFlBQVksRUFBRSxHQUFHO0lBQ2pCLGFBQWEsRUFBRSxDQUFDO0lBQ2hCLGNBQWMsRUFBRSxDQUFDO0lBQ2pCLGVBQWUsRUFBRSxDQUFDO0lBQ2xCLGFBQWEsRUFBRSxJQUFJO0lBQ25CLGNBQWMsRUFBRSxLQUFLO0lBRXJCLFNBQVMsRUFBTyxFQUFFO0lBQ2xCLFVBQVUsRUFBTyxFQUFFO0lBQ25CLGFBQWEsRUFBRSxDQUFDO0lBRWhCLFNBQVMsRUFBRSxFQUFFO0lBRWIsSUFBSSxFQUFFLFVBQVMsT0FBUTtRQUN0QixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQ3RCLElBQUksQ0FBQyxPQUFPLEVBQ1osT0FBTyxDQUNQLENBQUM7UUFFRix1QkFBdUI7UUFDdkIsY0FBTSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUMzQixpQkFBaUIsRUFDakIsNkJBQXVCLENBQ3ZCLENBQUM7UUFFRixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLGlCQUFVLENBQUM7UUFDcEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsR0FBRyw2QkFBZ0IsQ0FBQztRQUVoRCxjQUFNLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUV2QiwyQkFBMkI7UUFDM0IsYUFBYTtRQUNiLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsU0FBUyxDQUFDLGNBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCxPQUFPLEVBQUUsRUFBRSxFQUFFLGtCQUFrQjtJQUUvQixXQUFXLEVBQUUsRUFBRTtJQUVmLFNBQVMsRUFBRSxVQUFTLElBQUk7O1FBQ3ZCLGVBQU0sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDckMsY0FBTSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDMUIsSUFBSSxLQUFLLEdBQUcsTUFBQSxjQUFNLENBQUMsV0FBVyxFQUFFLDBDQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUvQyxpREFBaUQ7UUFDakQsNEVBQTRFO1FBQzVFLGlGQUFpRjtRQUNqRiw2Q0FBNkM7UUFDN0MsSUFBSSxLQUFLLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO1lBQ3hDLGNBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBQ2pDLE9BQU87UUFDUixDQUFDO1FBRUQsZUFBZTtRQUNmLElBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2pCLG1CQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUVELFNBQVM7UUFDVCxJQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNqQixLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDaEIsQ0FBQztRQUVELDBCQUEwQjtRQUMxQixJQUFHLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUN2Qiw2QkFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2hELENBQUM7UUFFRCxDQUFDLENBQUMsY0FBYyxFQUFFLGNBQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQy9DLENBQUMsQ0FBQyxVQUFVLEVBQUUsY0FBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDM0MsY0FBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQsYUFBYSxFQUFFLFVBQVMsSUFBSSxFQUFFLE1BQU07UUFDbkMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUNyRSxRQUFRLEVBQUUsTUFBTTtZQUNoQixTQUFTLEVBQUUsR0FBRztTQUNkLEVBQ0QsR0FBRyxFQUNILFFBQVEsRUFDUjtZQUNDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNsQixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCxVQUFVLEVBQUUsVUFBUyxLQUFLO1FBQ3pCLGlCQUFpQjtRQUNqQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsY0FBYyxFQUFFLGNBQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBQ2xELEtBQUksSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQyxDQUFDO1FBRUQsSUFBRyxLQUFLLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRSxDQUFDO1lBQzNCLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1RCxJQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDbkIsYUFBYTtnQkFDYixFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzQixDQUFDO1FBQ0YsQ0FBQztRQUVELG1CQUFtQjtRQUNuQixjQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRCxXQUFXLEVBQUUsVUFBUyxLQUFLO1FBQzFCLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxVQUFVLEVBQUUsY0FBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDOUMsS0FBSSxJQUFJLEVBQUUsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDN0IsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM1QixJQUFJLENBQUM7WUFDTCxNQUFNO1lBQ04sZUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDYixFQUFFLEVBQUUsRUFBRTtnQkFDTixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNmLEtBQUssRUFBRSxjQUFNLENBQUMsV0FBVztnQkFDekIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO2FBQ3ZCLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkIsSUFBRyxPQUFPLElBQUksQ0FBQyxTQUFTLElBQUksVUFBVSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUM7Z0JBQzdELGVBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzdCLENBQUM7WUFDRCxJQUFHLE9BQU8sSUFBSSxDQUFDLE9BQU8sSUFBSSxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztnQkFDekQsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ1YsQ0FBQztZQUNELElBQUcsT0FBTyxJQUFJLENBQUMsUUFBUSxJQUFJLFFBQVEsRUFBRSxDQUFDO2dCQUNyQyxlQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLENBQUM7UUFDRixDQUFDO1FBRUQsY0FBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxhQUFhLEVBQUU7O1FBQ2QsSUFBSSxJQUFJLEdBQUcsTUFBQSxjQUFNLENBQUMsV0FBVyxFQUFFLDBDQUFFLE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQztRQUNwRSxLQUFJLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNsQixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFDLEdBQUcsRUFBRSxjQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztZQUM1QyxJQUFHLE9BQU8sQ0FBQyxDQUFDLFNBQVMsSUFBSSxVQUFVLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQztnQkFDdkQsZUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDakMsQ0FBQztRQUNGLENBQUM7SUFDRixDQUFDO0lBRUQsV0FBVyxFQUFFLFVBQVMsR0FBRzs7UUFDeEIsSUFBSSxJQUFJLEdBQUcsTUFBQSxjQUFNLENBQUMsV0FBVyxFQUFFLDBDQUFFLE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFcEYsSUFBRyxPQUFPLElBQUksQ0FBQyxRQUFRLElBQUksVUFBVSxFQUFFLENBQUM7WUFDdkMsSUFBSSxRQUFRLEdBQUcsY0FBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVELENBQUM7UUFFRCxTQUFTO1FBQ1QsSUFBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDaEIsbUJBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqQyxDQUFDO1FBRUQsY0FBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBRXZCLGVBQWU7UUFDZixJQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUN0Qiw2QkFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQy9DLENBQUM7UUFFRCxhQUFhO1FBQ2IsSUFBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDbkIsSUFBRyxJQUFJLENBQUMsU0FBUyxJQUFJLEtBQUssRUFBRSxDQUFDO2dCQUM1QixjQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkIsQ0FBQztpQkFBTSxDQUFDO2dCQUNQLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDdEIsSUFBSSxXQUFXLEdBQWtCLElBQUksQ0FBQztnQkFDdEMsS0FBSSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQzdCLElBQUcsQ0FBQyxHQUFJLENBQXVCLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxJQUFJLENBQUMsR0FBRyxXQUFXLENBQUMsRUFBRSxDQUFDO3dCQUM3RSxXQUFXLEdBQUcsQ0FBQyxDQUFDO29CQUNqQixDQUFDO2dCQUNGLENBQUM7Z0JBQ0QsSUFBRyxXQUFXLElBQUksSUFBSSxFQUFFLENBQUM7b0JBQ3hCLGNBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO29CQUM5QyxPQUFPO2dCQUNSLENBQUM7Z0JBQ0QsZUFBTSxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO2dCQUM3QyxjQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkIsQ0FBQztRQUNGLENBQUM7SUFDRixDQUFDO0lBRUQsa0NBQWtDO0lBQ2xDLFVBQVUsRUFBRTtRQUNYLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7UUFFM0IsaUhBQWlIO1FBQ2pILGFBQWE7UUFDYixjQUFNLENBQUMsY0FBYyxHQUFHLFdBQVcsQ0FBQztZQUNuQyxRQUFRLENBQUMsS0FBSyxHQUFHLElBQUEsYUFBQyxFQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3BDLGVBQU0sQ0FBQyxVQUFVLENBQUMsY0FBWSxRQUFRLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFBLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ1YsQ0FBQztJQUVELGNBQWMsRUFBRTtRQUNmLGFBQWE7UUFDYixhQUFhLENBQUMsY0FBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3JDLGNBQU0sQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO0lBQy9CLENBQUM7SUFFRCx5QkFBeUI7SUFDekIsWUFBWSxFQUFFO1FBQ2IsSUFBRyxjQUFNLENBQUMsV0FBVyxFQUFFLElBQUksSUFBSSxFQUFFLENBQUM7WUFDakMsSUFBSSxjQUFjLEdBQUcsRUFBRSxDQUFDO1lBQ3hCLEtBQUksSUFBSSxDQUFDLElBQUksY0FBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUMvQixJQUFJLEtBQUssR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxJQUFHLEtBQUssQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDO29CQUN4QixhQUFhO29CQUNiLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzVCLENBQUM7WUFDRixDQUFDO1lBRUQsSUFBRyxjQUFjLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO2dCQUNoQyxjQUFNLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzlCLE9BQU87WUFDUixDQUFDO2lCQUFNLENBQUM7Z0JBQ1AsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDMUQsY0FBTSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QyxDQUFDO1FBQ0YsQ0FBQztRQUVELGNBQU0sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFFRCx1RkFBdUY7SUFDdkYsb0JBQW9CLEVBQUUsVUFBUyxRQUFRO1FBQ3RDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1lBQzlCLElBQUcsY0FBTSxDQUFDLFdBQVcsRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDO2dCQUNqQyxJQUFJLGNBQWMsR0FBZSxFQUFFLENBQUM7Z0JBQ3BDLEtBQUksSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO29CQUN2QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4QyxJQUFHLEtBQUssQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDO3dCQUN4QixJQUFHLE9BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksVUFBVSxJQUFJLEtBQUssQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDOzRCQUN2RSx3REFBd0Q7NEJBQ3hELGVBQU0sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQzs0QkFDbkMsY0FBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQzs0QkFDekIsT0FBTzt3QkFDUixDQUFDO3dCQUNELGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzVCLENBQUM7Z0JBQ0YsQ0FBQztnQkFFRCxJQUFHLGNBQWMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7b0JBQ2hDLGlDQUFpQztvQkFDakMsT0FBTztnQkFDUixDQUFDO3FCQUFNLENBQUM7b0JBQ1AsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDMUQsY0FBTSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsQ0FBQztZQUNGLENBQUM7UUFDRixDQUFDO0lBQ0YsQ0FBQztJQUVELFdBQVcsRUFBRTtRQUNaLElBQUcsY0FBTSxDQUFDLFVBQVUsSUFBSSxjQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUN0RCxPQUFPLGNBQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0IsQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVELFVBQVUsRUFBRTs7UUFDWCxPQUFPLE1BQUEsY0FBTSxDQUFDLFdBQVcsRUFBRSwwQ0FBRSxVQUFVLENBQUM7SUFDekMsQ0FBQztJQUVELFVBQVUsRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFROztRQUNuQyxJQUFHLEtBQUssRUFBRSxDQUFDO1lBQ1YsZUFBTSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDcEMsY0FBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDakMsS0FBSyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUM3RixJQUFHLE9BQU8sSUFBSSxJQUFJLElBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDN0MsY0FBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2pELENBQUM7WUFDRCxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFBLGNBQU0sQ0FBQyxXQUFXLEVBQUUsMENBQUUsS0FBZSxDQUFDLENBQUMsUUFBUSxDQUFDLGNBQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1lBQzVHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztZQUNuRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7WUFDL0QsY0FBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMxQixDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1lBQzdDLGNBQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDLEVBQUUsY0FBTSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN4RSxJQUFJLHVCQUF1QixHQUFHLE1BQUEsY0FBTSxDQUFDLFdBQVcsRUFBRSwwQ0FBRSxNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQy9FLElBQUksdUJBQXVCLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ25DLGNBQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNyQixDQUFDO1FBQ0YsQ0FBQztJQUNGLENBQUM7SUFFRCxpQkFBaUIsRUFBRSxVQUFTLEtBQU07UUFDakMsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUMsQ0FBQyxjQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEdBQUcsY0FBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxjQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEksSUFBRyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFBQyxTQUFTLElBQUksS0FBSyxDQUFDO1FBQUMsQ0FBQztRQUNyQyxlQUFNLENBQUMsR0FBRyxDQUFDLDBCQUEwQixHQUFHLFNBQVMsR0FBRyxVQUFVLENBQUMsQ0FBQztRQUNoRSxjQUFNLENBQUMsYUFBYSxHQUFHLGVBQU0sQ0FBQyxVQUFVLENBQUMsY0FBTSxDQUFDLFlBQVksRUFBRSxTQUFTLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ3RGLENBQUM7SUFFRCxRQUFRLEVBQUU7UUFDVCxjQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUMsT0FBTyxFQUFDLENBQUMsRUFBQyxFQUFFLGNBQU0sQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFO1lBQ3RFLGNBQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUM3QixJQUFNLFdBQVcsR0FBRyxjQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDekMsSUFBSSxXQUFXLEtBQUssSUFBSTtnQkFBRSxXQUFXLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN4RCxjQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzFCLGVBQU0sQ0FBQyxHQUFHLENBQUMsY0FBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsbUJBQW1CLENBQUMsQ0FBQztZQUMzRCxJQUFJLGNBQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDM0IsY0FBTSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3pCLENBQUM7WUFDRCw2Q0FBNkM7WUFDN0MsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ25CLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELGtCQUFrQixFQUFFLFVBQVMsQ0FBQztRQUM3QixJQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxRQUFRLElBQUksQ0FBQyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsSUFBSSxjQUFNLENBQUMsV0FBVyxFQUFFLElBQUksSUFBSSxFQUFDLENBQUM7WUFDdEYsY0FBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3hCLENBQUM7SUFDRixDQUFDO0NBQ0QsQ0FBQzs7Ozs7O0FDbFZGOztJQUVJO0FBQ0osb0NBQW1DO0FBQ25DLGtEQUF1QztBQUN2QyxpREFBd0M7QUFDeEMsaURBQWdEO0FBQ2hELDZDQUE0QztBQUM1Qyx1Q0FBc0M7QUFFekIsUUFBQSxnQkFBZ0IsR0FBRztJQUM1Qix5QkFBeUI7SUFDekI7UUFDSSxLQUFLLEVBQUUsSUFBQSxhQUFDLEVBQUMsb0JBQW9CLENBQUM7UUFDOUIsV0FBVyxFQUFFO1lBQ1QsT0FBTyxlQUFNLENBQUMsWUFBWSxJQUFJLFdBQUksQ0FBQztRQUN2QyxDQUFDO1FBQ0QsTUFBTSxFQUFFO1lBQ0osT0FBTyxFQUFFO2dCQUNMLElBQUksRUFBRTtvQkFDRixJQUFBLGFBQUMsRUFBQyw4R0FBOEcsQ0FBQztvQkFDakgsSUFBQSxhQUFDLEVBQUMsaUJBQWlCLENBQUM7aUJBQ3ZCO2dCQUNELE9BQU8sRUFBRTtvQkFDTCxRQUFRLEVBQUU7d0JBQ04sSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLGFBQWEsQ0FBQzt3QkFDdEIsU0FBUyxFQUFFLEVBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBQztxQkFDM0I7b0JBQ0QsT0FBTyxFQUFFO3dCQUNMLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxpQkFBaUIsQ0FBQzt3QkFDMUIsU0FBUyxFQUFFLEVBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBQztxQkFDMUI7aUJBQ0o7YUFDSjtZQUNELFFBQVEsRUFBRTtnQkFDTixJQUFJLEVBQUU7b0JBQ0YsSUFBQSxhQUFDLEVBQUMsNkRBQTZELENBQUM7b0JBQ2hFLElBQUEsYUFBQyxFQUFDLGlCQUFpQixDQUFDO2lCQUN2QjtnQkFDRCxPQUFPLEVBQUU7b0JBQ0wsWUFBWSxFQUFFO3dCQUNWLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxrQkFBa0IsQ0FBQzt3QkFDM0IsU0FBUyxFQUFFLEVBQUMsQ0FBQyxFQUFFLFlBQVksRUFBQztxQkFDL0I7b0JBQ0QsT0FBTyxFQUFFO3dCQUNMLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyx5QkFBeUIsQ0FBQzt3QkFDbEMsU0FBUyxFQUFFLEVBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBQztxQkFDMUI7aUJBQ0o7YUFDSjtZQUNELFlBQVksRUFBRTtnQkFDVixJQUFJLEVBQUU7b0JBQ0YsSUFBQSxhQUFDLEVBQUMsNkJBQTZCLENBQUM7b0JBQ2hDLElBQUEsYUFBQyxFQUFDLGlGQUFpRixDQUFDO29CQUNwRixJQUFBLGFBQUMsRUFBQyxtRUFBbUUsQ0FBQztpQkFDekU7Z0JBQ0QsTUFBTSxFQUFFO29CQUNKLGdEQUFnRDtvQkFDaEQsSUFBTSxhQUFhLEdBQUc7d0JBQ2xCLHNCQUFzQjt3QkFDdEIsdUJBQXVCO3dCQUN2QixzQkFBc0I7d0JBQ3RCLGVBQWU7cUJBQ2xCLENBQUM7b0JBQ0YsSUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUM3RSxxQkFBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztnQkFDRCxPQUFPLEVBQUU7b0JBQ0wsTUFBTSxFQUFFO3dCQUNKLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxrQkFBa0IsQ0FBQzt3QkFDM0IsU0FBUyxFQUFFLEtBQUs7cUJBQ25CO2lCQUNKO2FBQ0o7WUFDRCxPQUFPLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFO29CQUNGLElBQUEsYUFBQyxFQUFDLDJEQUEyRCxDQUFDO29CQUM5RCxJQUFBLGFBQUMsRUFBQyxrRUFBa0UsQ0FBQztpQkFDeEU7Z0JBQ0QsT0FBTyxFQUFFO29CQUNMLE1BQU0sRUFBRTt3QkFDSixJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsUUFBUSxDQUFDO3dCQUNqQixTQUFTLEVBQUUsS0FBSztxQkFDbkI7aUJBQ0o7YUFDSjtTQUNKO0tBQ0o7SUFDRCxpQkFBaUI7SUFDakI7UUFDSSxLQUFLLEVBQUUsSUFBQSxhQUFDLEVBQUMsa0NBQWtDLENBQUM7UUFDNUMsV0FBVyxFQUFFO1lBQ1QsT0FBTyxDQUNILENBQUMsZUFBTSxDQUFDLFlBQVksSUFBSSxXQUFJLENBQUM7bUJBQzFCLENBQUMsbUJBQUcsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMseUJBQXlCO21CQUNqRSxDQUFDLE9BQU0sQ0FBQyxtQkFBRyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLElBQUksV0FBVzt1QkFDeEQsbUJBQUcsQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxxQkFBcUI7YUFDbkYsQ0FBQztRQUNOLENBQUM7UUFDRCxhQUFhLEVBQUU7WUFDWCxPQUFPLENBQUMsbUJBQUcsQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQVcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLG1CQUFHLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBVyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzVHLENBQUM7UUFDRCxNQUFNLEVBQUU7WUFDSixPQUFPLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFO29CQUNGLElBQUEsYUFBQyxFQUFDLDBFQUEwRSxDQUFDO29CQUM3RSxJQUFBLGFBQUMsRUFBQyxnR0FBZ0csQ0FBQztvQkFDbkcsSUFBQSxhQUFDLEVBQUMsaUNBQWlDLENBQUM7aUJBQ3ZDO2dCQUNELE9BQU8sRUFBRTtvQkFDTCxNQUFNLEVBQUU7d0JBQ0osSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLDZCQUE2QixDQUFDO3dCQUN0QyxTQUFTLEVBQUUsS0FBSzt3QkFDaEIsUUFBUSxFQUFFOzRCQUNOLGlCQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7NEJBQ2YsbUJBQUcsQ0FBQyxHQUFHLENBQUMsMkJBQTJCLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQzVDLENBQUM7cUJBQ0o7aUJBQ0o7YUFDSjtTQUNKO0tBQ0o7Q0FDSixDQUFDOzs7Ozs7QUMxSEY7O0lBRUk7QUFDSixvQ0FBbUM7QUFDbkMsa0RBQXVDO0FBQ3ZDLHVDQUFzQztBQUN0QyxpREFBd0M7QUFFM0IsUUFBQSxVQUFVLEdBQUc7SUFDekI7UUFDQyxLQUFLLEVBQUUsSUFBQSxhQUFDLEVBQUMsV0FBVyxDQUFDO1FBQ3JCLFdBQVcsRUFBRTtZQUNaLE9BQU8sZUFBTSxDQUFDLFlBQVksSUFBSSxXQUFJLElBQUksbUJBQUcsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBVyxHQUFHLENBQUMsQ0FBQztRQUNqRixDQUFDO1FBQ0QsTUFBTSxFQUFFO1lBQ1AsT0FBTyxFQUFFO2dCQUNSLElBQUksRUFBRTtvQkFDTCxJQUFBLGFBQUMsRUFBQywrRUFBK0UsQ0FBQztvQkFDbEYsSUFBQSxhQUFDLEVBQUMscUVBQXFFLENBQUM7aUJBQ3hFO2dCQUNELFlBQVksRUFBRSxJQUFBLGFBQUMsRUFBQyxtQ0FBbUMsQ0FBQztnQkFDcEQsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsT0FBTyxFQUFFO29CQUNSLFdBQVcsRUFBRTt3QkFDWixJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsWUFBWSxDQUFDO3dCQUNyQixJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFO3dCQUNwQixNQUFNLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFO3FCQUN2QjtvQkFDRCxVQUFVLEVBQUU7d0JBQ1gsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLFdBQVcsQ0FBQzt3QkFDcEIsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRTt3QkFDcEIsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRTtxQkFDdEI7b0JBQ0QsU0FBUyxFQUFFO3dCQUNWLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxVQUFVLENBQUM7d0JBQ25CLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUU7d0JBQ2xCLE1BQU0sRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUU7d0JBQ3JCLFlBQVksRUFBRSxJQUFBLGFBQUMsRUFBQyxxQ0FBcUMsQ0FBQztxQkFDdEQ7b0JBQ0QsU0FBUyxFQUFFO3dCQUNWLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxhQUFhLENBQUM7d0JBQ3RCLFNBQVMsRUFBRSxLQUFLO3FCQUNoQjtpQkFDRDthQUNEO1NBQ0Q7S0FDRDtJQUNEO1FBQ0MsS0FBSyxFQUFFLElBQUEsYUFBQyxFQUFDLFFBQVEsQ0FBQztRQUNsQixXQUFXLEVBQUU7WUFDWixPQUFPLGVBQU0sQ0FBQyxZQUFZLElBQUksV0FBSSxJQUFJLG1CQUFHLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzlELENBQUM7UUFDRCxNQUFNLEVBQUU7WUFDUCxPQUFPLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFO29CQUNMLElBQUEsYUFBQyxFQUFDLG1EQUFtRCxDQUFDO29CQUN0RCxJQUFBLGFBQUMsRUFBQyxnQ0FBZ0MsQ0FBQztpQkFDbkM7Z0JBQ0QsWUFBWSxFQUFFLElBQUEsYUFBQyxFQUFDLCtDQUErQyxDQUFDO2dCQUNoRSxLQUFLLEVBQUUsSUFBSTtnQkFDWCxPQUFPLEVBQUU7b0JBQ1IsYUFBYSxFQUFFO3dCQUNkLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxhQUFhLENBQUM7d0JBQ3RCLFNBQVMsRUFBRSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtxQkFDekM7b0JBQ0QsUUFBUSxFQUFFO3dCQUNULElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxhQUFhLENBQUM7d0JBQ3RCLFNBQVMsRUFBRSxLQUFLO3FCQUNoQjtpQkFDRDthQUNEO1lBQ0QsU0FBUyxFQUFFO2dCQUNWLElBQUksRUFBRTtvQkFDTCxJQUFBLGFBQUMsRUFBQyx1Q0FBdUMsQ0FBQztvQkFDMUMsSUFBQSxhQUFDLEVBQUMsa0JBQWtCLENBQUM7aUJBQ3JCO2dCQUNELE9BQU8sRUFBRTtvQkFDUixZQUFZLEVBQUU7d0JBQ2IsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLGdCQUFnQixDQUFDO3dCQUN6QixTQUFTLEVBQUUsS0FBSztxQkFDaEI7aUJBQ0Q7YUFDRDtZQUNELE9BQU8sRUFBRTtnQkFDUixNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUU7Z0JBQzlCLElBQUksRUFBRTtvQkFDTCxJQUFBLGFBQUMsRUFBQyw0RUFBNEUsQ0FBQztvQkFDL0UsSUFBQSxhQUFDLEVBQUMsc0JBQXNCLENBQUM7aUJBQ3pCO2dCQUNELE9BQU8sRUFBRTtvQkFDUixZQUFZLEVBQUU7d0JBQ2IsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLGdCQUFnQixDQUFDO3dCQUN6QixTQUFTLEVBQUUsS0FBSztxQkFDaEI7aUJBQ0Q7YUFDRDtTQUNEO0tBQ0Q7SUFDRDtRQUNDLEtBQUssRUFBRSxJQUFBLGFBQUMsRUFBQyxZQUFZLENBQUM7UUFDdEIsV0FBVyxFQUFFO1lBQ1osT0FBTyxlQUFNLENBQUMsWUFBWSxJQUFJLFdBQUksSUFBSSxtQkFBRyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM3RCxDQUFDO1FBQ0QsTUFBTSxFQUFFO1lBQ1AsS0FBSyxFQUFFO2dCQUNOLElBQUksRUFBRTtvQkFDTCxJQUFBLGFBQUMsRUFBQyxtQkFBbUIsQ0FBQztvQkFDdEIsSUFBQSxhQUFDLEVBQUMsb0RBQW9ELENBQUM7aUJBQ3ZEO2dCQUNELFlBQVksRUFBRSxJQUFBLGFBQUMsRUFBQyxrQkFBa0IsQ0FBQztnQkFDbkMsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsT0FBTyxFQUFFO29CQUNSLFFBQVEsRUFBRTt3QkFDVCxJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsU0FBUyxDQUFDO3dCQUNsQixJQUFJLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBRSxFQUFDO3dCQUNmLFNBQVMsRUFBRSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFO3FCQUN0RDtvQkFDRCxTQUFTLEVBQUU7d0JBQ1YsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLFVBQVUsQ0FBQzt3QkFDbkIsSUFBSSxFQUFFLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBQzt3QkFDaEIsU0FBUyxFQUFFLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUU7cUJBQ3REO29CQUNELE1BQU0sRUFBRTt3QkFDUCxJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsZUFBZSxDQUFDO3dCQUN4QixTQUFTLEVBQUUsS0FBSztxQkFDaEI7aUJBQ0Q7YUFDRDtZQUNELE1BQU0sRUFBRTtnQkFDUCxNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFO2dCQUN0QixJQUFJLEVBQUU7b0JBQ0wsSUFBQSxhQUFDLEVBQUMsa0NBQWtDLENBQUM7b0JBQ3JDLElBQUEsYUFBQyxFQUFDLHVDQUF1QyxDQUFDO2lCQUMxQztnQkFDRCxPQUFPLEVBQUU7b0JBQ1IsT0FBTyxFQUFFO3dCQUNSLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxhQUFhLENBQUM7d0JBQ3RCLFNBQVMsRUFBRSxLQUFLO3FCQUNoQjtpQkFDRDthQUNEO1lBQ0QsS0FBSyxFQUFFO2dCQUNOLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUU7Z0JBQ3JCLElBQUksRUFBRTtvQkFDTCxJQUFBLGFBQUMsRUFBQyxrQ0FBa0MsQ0FBQztvQkFDckMsSUFBQSxhQUFDLEVBQUMsc0NBQXNDLENBQUM7aUJBQ3pDO2dCQUNELE9BQU8sRUFBRTtvQkFDUixPQUFPLEVBQUU7d0JBQ1IsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLGFBQWEsQ0FBQzt3QkFDdEIsU0FBUyxFQUFFLEtBQUs7cUJBQ2hCO2lCQUNEO2FBQ0Q7WUFDRCxLQUFLLEVBQUU7Z0JBQ04sTUFBTSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRTtnQkFDckIsSUFBSSxFQUFFO29CQUNMLElBQUEsYUFBQyxFQUFDLGtDQUFrQyxDQUFDO29CQUNyQyxJQUFBLGFBQUMsRUFBQyxxQ0FBcUMsQ0FBQztpQkFDeEM7Z0JBQ0QsT0FBTyxFQUFFO29CQUNSLE9BQU8sRUFBRTt3QkFDUixJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsYUFBYSxDQUFDO3dCQUN0QixTQUFTLEVBQUUsS0FBSztxQkFDaEI7aUJBQ0Q7YUFDRDtTQUNEO0tBQ0Q7SUFDRDtRQUNDLEtBQUssRUFBRSxJQUFBLGFBQUMsRUFBQyxXQUFXLENBQUM7UUFDckIsV0FBVyxFQUFFO1lBQ1osT0FBTyxlQUFNLENBQUMsWUFBWSxJQUFJLFdBQUksSUFBSSxtQkFBRyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQzFFLENBQUM7UUFDRCxNQUFNLEVBQUU7WUFDUCxPQUFPLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFO29CQUNMLElBQUEsYUFBQyxFQUFDLHFDQUFxQyxDQUFDO29CQUN4QyxJQUFBLGFBQUMsRUFBQyx3Q0FBd0MsQ0FBQztpQkFDM0M7Z0JBQ0QsWUFBWSxFQUFFLElBQUEsYUFBQyxFQUFDLDZCQUE2QixDQUFDO2dCQUM5QyxLQUFLLEVBQUUsSUFBSTtnQkFDWCxPQUFPLEVBQUU7b0JBQ1IsUUFBUSxFQUFFO3dCQUNULElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxTQUFTLENBQUM7d0JBQ2xCLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTt3QkFDbEMsWUFBWSxFQUFFLElBQUEsYUFBQyxFQUFDLHFDQUFxQyxDQUFDO3dCQUN0RCwyQkFBMkI7cUJBQzNCO29CQUNELE9BQU8sRUFBRTt3QkFDUixJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsZ0JBQWdCLENBQUM7d0JBQ3pCLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFO3dCQUNoRCxTQUFTLEVBQUU7NEJBQ1YsT0FBTyxDQUFDLG1CQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO3dCQUM5QixDQUFDO3dCQUNELFFBQVEsRUFBRTs0QkFDVCxtQkFBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFDdEIsQ0FBQztxQkFDRDtvQkFDRCxPQUFPLEVBQUU7d0JBQ1IsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLGFBQWEsQ0FBQzt3QkFDdEIsU0FBUyxFQUFFLEtBQUs7cUJBQ2hCO2lCQUNEO2FBQ0Q7U0FDRDtLQUNEO0lBRUQ7UUFDQyxLQUFLLEVBQUUsSUFBQSxhQUFDLEVBQUMsWUFBWSxDQUFDO1FBQ3RCLFdBQVcsRUFBRTtZQUNaLE9BQU8sZUFBTSxDQUFDLFlBQVksSUFBSSxXQUFJLElBQUksbUJBQUcsQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUMxRSxDQUFDO1FBQ0QsTUFBTSxFQUFFO1lBQ1AsT0FBTyxFQUFFO2dCQUNSLElBQUksRUFBRTtvQkFDTCxJQUFBLGFBQUMsRUFBQywwQkFBMEIsQ0FBQztvQkFDN0IsSUFBQSxhQUFDLEVBQUMsdURBQXVELENBQUM7aUJBQzFEO2dCQUNELFlBQVksRUFBRSxJQUFBLGFBQUMsRUFBQyx5QkFBeUIsQ0FBQztnQkFDMUMsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsT0FBTyxFQUFFO29CQUNSLE9BQU8sRUFBRTt3QkFDUixJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsT0FBTyxDQUFDO3dCQUNoQixJQUFJLEVBQUU7NEJBQ0wsWUFBWSxFQUFFLEdBQUc7NEJBQ2pCLEtBQUssRUFBRSxHQUFHOzRCQUNWLE9BQU8sRUFBRSxDQUFDO3lCQUNWO3dCQUNELFNBQVMsRUFBRSxFQUFDLENBQUMsRUFBRSxPQUFPLEVBQUM7cUJBQ3ZCO29CQUNELE1BQU0sRUFBRTt3QkFDUCxJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsZUFBZSxDQUFDO3dCQUN4QixTQUFTLEVBQUUsS0FBSztxQkFDaEI7aUJBQ0Q7YUFDRDtZQUNELE9BQU8sRUFBRTtnQkFDUixJQUFJLEVBQUU7b0JBQ0wsSUFBQSxhQUFDLEVBQUMsOENBQThDLENBQUM7aUJBQ2pEO2dCQUNELE9BQU8sRUFBRTtvQkFDUixTQUFTLEVBQUU7d0JBQ1YsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLFNBQVMsQ0FBQzt3QkFDbEIsU0FBUyxFQUFFOzRCQUNWLE9BQU8sQ0FBQyxtQkFBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzt3QkFDaEMsQ0FBQzt3QkFDRCxRQUFRLEVBQUU7NEJBQ1QsbUJBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQ3hCLENBQUM7d0JBQ0QsU0FBUyxFQUFFLEtBQUs7cUJBQ2hCO29CQUNELFdBQVcsRUFBRTt3QkFDWixJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsV0FBVyxDQUFDO3dCQUNwQixTQUFTLEVBQUU7NEJBQ1YsT0FBTyxDQUFDLG1CQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO3dCQUNoQyxDQUFDO3dCQUNELFFBQVEsRUFBRTs0QkFDVCxtQkFBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzt3QkFDeEIsQ0FBQzt3QkFDRCxTQUFTLEVBQUUsS0FBSztxQkFDaEI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNSLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxPQUFPLENBQUM7d0JBQ2hCLFNBQVMsRUFBRTs0QkFDVixPQUFPLENBQUMsbUJBQUcsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7d0JBQ2xDLENBQUM7d0JBQ0QsUUFBUSxFQUFFOzRCQUNULG1CQUFHLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO3dCQUMxQixDQUFDO3dCQUNELFNBQVMsRUFBRSxLQUFLO3FCQUNoQjtvQkFDRCxTQUFTLEVBQUU7d0JBQ1YsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLFNBQVMsQ0FBQzt3QkFDbEIsU0FBUyxFQUFFLEtBQUs7cUJBQ2hCO2lCQUNEO2FBQ0Q7U0FDRDtLQUNEO0NBQ0QsQ0FBQzs7Ozs7O0FDeFJGOztHQUVHO0FBQ0gsbUNBQWtDO0FBRXJCLFFBQUEsTUFBTSxHQUFHO0lBRXJCLElBQUksRUFBRSxVQUFTLE9BQU87UUFDckIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUN0QixJQUFJLENBQUMsT0FBTyxFQUNaLE9BQU8sQ0FDUCxDQUFDO0lBQ0gsQ0FBQztJQUVELE9BQU8sRUFBRSxFQUFFLEVBQUUsa0JBQWtCO0lBRS9CLFNBQVMsRUFBRTtRQUNWLE9BQU8sQ0FBQyxDQUFDLDZCQUE2QixDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQsV0FBVyxFQUFFLFVBQVMsSUFBSSxFQUFFLEVBQUUsRUFBRSxNQUFNO1FBQ3JDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsV0FBVyxHQUFHLEVBQUUsQ0FBQzthQUM1QyxRQUFRLENBQUMsY0FBYyxDQUFDO2FBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDakIsSUFBRyxjQUFNLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQztnQkFDdkIsZUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN6QixDQUFDO1FBQ0YsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQy9CLENBQUM7Q0FDRCxDQUFDOzs7Ozs7QUM3QkY7O0dBRUc7QUFDSCxtQ0FBa0M7QUFFckIsUUFBQSxhQUFhLEdBQUc7SUFFNUIsSUFBSSxFQUFFLFVBQVMsT0FBUTtRQUN0QixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQ3RCLElBQUksQ0FBQyxPQUFPLEVBQ1osT0FBTyxDQUNQLENBQUM7UUFFRiwrQkFBK0I7UUFDL0IsSUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQztZQUM1QixFQUFFLEVBQUUsZUFBZTtZQUNuQixTQUFTLEVBQUUsZUFBZTtTQUMxQixDQUFDLENBQUM7UUFDSCxtQ0FBbUM7UUFDbkMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFdkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsT0FBTyxFQUFFLEVBQUUsRUFBRSxrQkFBa0I7SUFFL0IsSUFBSSxFQUFFLElBQUk7SUFFVixXQUFXLEVBQUUsRUFBRTtJQUVmLG1DQUFtQztJQUNuQyxNQUFNLEVBQUUsVUFBUyxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQVE7UUFDdEMsSUFBRyxPQUFPLElBQUksSUFBSSxXQUFXO1lBQUUsT0FBTztRQUN0QyxpREFBaUQ7UUFDakQseUNBQXlDO1FBQ3pDLElBQUcsTUFBTSxJQUFJLElBQUksSUFBSSxlQUFNLENBQUMsWUFBWSxJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQ3BELElBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDYixJQUFHLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxXQUFXLEVBQUUsQ0FBQztvQkFDbkQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQy9CLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckMsQ0FBQztRQUNGLENBQUM7YUFBTSxDQUFDO1lBQ1AscUJBQWEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUNELGVBQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBRUQsV0FBVyxFQUFFO1FBRVosaUZBQWlGO1FBRWpGLGtIQUFrSDtRQUNsSCxhQUFhO1FBQ2IsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUxRixDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsSUFBSSxDQUFDO1lBRXZCLElBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsR0FBRyxNQUFNLEVBQUMsQ0FBQztnQkFDbkMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2xCLENBQUM7UUFFRixDQUFDLENBQUMsQ0FBQztJQUVKLENBQUM7SUFFRCxZQUFZLEVBQUUsVUFBUyxDQUFDO1FBQ3ZCLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDMUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUMsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFO1lBQ3pDLDJIQUEySDtZQUMzSCxxQkFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELFVBQVUsRUFBRSxVQUFTLE1BQU07UUFDMUIsSUFBRyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksV0FBVyxFQUFFLENBQUM7WUFDbkQsT0FBTSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFDM0MscUJBQWEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQzlELENBQUM7UUFDRixDQUFDO0lBQ0YsQ0FBQztDQUNELENBQUE7Ozs7OztBQ2pGRCxvQ0FBbUM7QUFDbkMsa0RBQXVDO0FBQ3ZDLHNDQUFxQztBQUNyQyxvQ0FBbUM7QUFDbkMsaURBQWdEO0FBQ2hELG9DQUFtQztBQUNuQyxpREFBd0M7QUFFM0IsUUFBQSxPQUFPLEdBQUc7SUFDbkIsSUFBSSxFQUFFLFVBQVMsT0FBUTtRQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQzVCLElBQUksQ0FBQyxPQUFPLEVBQ1osT0FBTyxDQUNQLENBQUM7UUFFSSx5QkFBeUI7UUFDekIsSUFBSSxDQUFDLEdBQUcsR0FBRyxlQUFNLENBQUMsV0FBVyxDQUFDLElBQUEsYUFBQyxFQUFDLGFBQWEsQ0FBQyxFQUFFLFNBQVMsRUFBRSxlQUFPLENBQUMsQ0FBQztRQUVwRSwyQkFBMkI7UUFDakMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO2FBQ2hCLElBQUksQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDO2FBQzFCLFFBQVEsQ0FBQyxVQUFVLENBQUM7YUFDcEIsUUFBUSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFFaEMsZUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRXRCLE9BQU87UUFDYixlQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2IsRUFBRSxFQUFFLGVBQWU7WUFDbkIsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLHdCQUF3QixDQUFDO1lBQ2pDLEtBQUssRUFBRSxpQkFBTyxDQUFDLGFBQWE7WUFDNUIsS0FBSyxFQUFFLE1BQU07U0FDYixDQUFDLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFMUIsZUFBTyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRXZCLGlGQUFpRjtRQUNqRixtQkFBRyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELGdCQUFnQixFQUFFO1FBQ3BCLE9BQU8sRUFBRSxHQUFHO1FBQ1osUUFBUSxFQUFFLEdBQUc7UUFDYixPQUFPLEVBQUUsR0FBRztLQUNaO0lBRUUsU0FBUyxFQUFFLFVBQVMsZUFBZTtRQUMvQixlQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFekIsZUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFFdkMsaUJBQU8sQ0FBQyxlQUFlLENBQUMsZUFBTyxDQUFDLGdCQUFnQixFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRCxRQUFRLEVBQUU7UUFDWixJQUFJLEtBQUssR0FBRyxJQUFBLGFBQUMsRUFBQyxhQUFhLENBQUMsQ0FBQztRQUM3QixJQUFHLGVBQU0sQ0FBQyxZQUFZLElBQUksSUFBSSxFQUFFLENBQUM7WUFDaEMsUUFBUSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDeEIsQ0FBQztRQUNELENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUUsWUFBWSxFQUFFO1FBQ2hCLG9DQUFvQztJQUNyQyxDQUFDO0lBRUUsc0NBQXNDO0lBQ3pDLDRCQUE0QjtJQUM1QixpREFBaUQ7SUFDakQsa0NBQWtDO0lBQ2xDLElBQUk7Q0FDSixDQUFBOzs7Ozs7QUN2RUQsb0NBQW1DO0FBQ25DLG9DQUFtQztBQUNuQyxvQ0FBbUM7QUFDbkMsa0RBQXVDO0FBQ3ZDLGlEQUF3QztBQUN4QyxzQ0FBcUM7QUFDckMsb0NBQW1DO0FBRXRCLFFBQUEsSUFBSSxHQUFHO0lBQ2hCLElBQUksRUFBRSxVQUFTLE9BQVE7UUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUM1QixJQUFJLENBQUMsT0FBTyxFQUNaLE9BQU8sQ0FDUCxDQUFDO1FBRUksc0JBQXNCO1FBQ3RCLElBQUksQ0FBQyxHQUFHLEdBQUcsZUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFBLGFBQUMsRUFBQyxxQkFBcUIsQ0FBQyxFQUFFLE1BQU0sRUFBRSxZQUFJLENBQUMsQ0FBQztRQUV0RSx3QkFBd0I7UUFDOUIsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO2FBQ2hCLElBQUksQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDO2FBQ3ZCLFFBQVEsQ0FBQyxVQUFVLENBQUM7YUFDcEIsUUFBUSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFFaEMsZUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRXRCLE1BQU07UUFDWixlQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2IsRUFBRSxFQUFFLGNBQWM7WUFDbEIsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLGVBQWUsQ0FBQztZQUN4QixLQUFLLEVBQUUsWUFBSSxDQUFDLFdBQVc7WUFDdkIsS0FBSyxFQUFFLE1BQU07WUFDYixJQUFJLEVBQUUsRUFBRSxDQUFDLDZDQUE2QztTQUN0RCxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRXZCLFlBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUVwQixpRkFBaUY7UUFDakYsbUJBQUcsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxnQkFBZ0IsRUFBRTtRQUNwQixPQUFPLEVBQUUsR0FBRztRQUNaLFFBQVEsRUFBRSxHQUFHO1FBQ2IsT0FBTyxFQUFFLEdBQUc7S0FDWjtJQUVFLFNBQVMsRUFBRSxVQUFTLGVBQWU7UUFDL0IsWUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRXRCLGVBQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBRXZDLGlCQUFPLENBQUMsZUFBZSxDQUFDLFlBQUksQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQsUUFBUSxFQUFFO1FBQ1osSUFBSSxLQUFLLEdBQUcsSUFBQSxhQUFDLEVBQUMscUJBQXFCLENBQUMsQ0FBQztRQUNyQyxJQUFHLGVBQU0sQ0FBQyxZQUFZLElBQUksSUFBSSxFQUFFLENBQUM7WUFDaEMsUUFBUSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDeEIsQ0FBQztRQUNELENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUUsWUFBWSxFQUFFO1FBQ2hCLG9DQUFvQztJQUNyQyxDQUFDO0lBRUQsV0FBVyxFQUFFO1FBQ1osZUFBTSxDQUFDLG9CQUFvQixDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzFDLG1CQUFHLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM1QixDQUFDO0NBQ0QsQ0FBQTs7Ozs7O0FDdkVEOztHQUVHO0FBQ0gsb0NBQW1DO0FBQ25DLGtEQUF1QztBQUN2QyxvQ0FBbUM7QUFDbkMsa0RBQWlEO0FBQ2pELHNDQUFxQztBQUNyQyxpREFBd0M7QUFDeEMsb0NBQW1DO0FBQ25DLHlDQUF3QztBQUN4Qyw2Q0FBNEM7QUFFL0IsUUFBQSxJQUFJLEdBQUc7SUFDbkIsOENBQThDO0lBQzlDLGdCQUFnQixFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxFQUFFLDJDQUEyQztJQUM1RSxnQkFBZ0IsRUFBRSxFQUFFLEdBQUcsSUFBSSxFQUFFLHdDQUF3QztJQUNyRSxvQkFBb0IsRUFBRSxHQUFHLEdBQUcsRUFBRSxHQUFHLElBQUksRUFBRSxxQ0FBcUM7SUFDNUUsZUFBZSxFQUFFLEVBQUUsRUFBRSw2QkFBNkI7SUFDbEQsZ0JBQWdCLEVBQUUsRUFBRSxHQUFHLElBQUksRUFBRSx5REFBeUQ7SUFFdEYsT0FBTyxFQUFDLEVBQUU7SUFFVixPQUFPLEVBQUUsS0FBSztJQUVkLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxNQUFNLENBQUM7SUFDZixJQUFJLEVBQUUsVUFBUyxPQUFRO1FBQ3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FDdEIsSUFBSSxDQUFDLE9BQU8sRUFDWixPQUFPLENBQ1AsQ0FBQztRQUVGLElBQUcsZUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7WUFDN0IsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztZQUNqQyxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1FBQzlCLENBQUM7UUFFRCxzQkFBc0I7UUFDdEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxlQUFNLENBQUMsV0FBVyxDQUFDLElBQUEsYUFBQyxFQUFDLGlCQUFpQixDQUFDLEVBQUUsTUFBTSxFQUFFLFlBQUksQ0FBQyxDQUFDO1FBRWxFLHdCQUF3QjtRQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7YUFDckIsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUM7YUFDdkIsUUFBUSxDQUFDLFVBQVUsQ0FBQzthQUNwQixRQUFRLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUVqQyxlQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFdEIsTUFBTTtRQUNOLGVBQU0sQ0FBQyxNQUFNLENBQUM7WUFDYixFQUFFLEVBQUUsWUFBWTtZQUNoQixJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsbUJBQW1CLENBQUM7WUFDNUIsS0FBSyxFQUFFLGFBQUssQ0FBQyxXQUFXO1lBQ3hCLEtBQUssRUFBRSxNQUFNO1lBQ2IsSUFBSSxFQUFFLEVBQUU7U0FDUixDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRTdCLE1BQU07UUFDTixlQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2IsRUFBRSxFQUFFLFdBQVc7WUFDZixJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsYUFBYSxDQUFDO1lBQ3RCLEtBQUssRUFBRSxTQUFHLENBQUMsU0FBUztZQUNwQixLQUFLLEVBQUUsTUFBTTtZQUNiLElBQUksRUFBRSxFQUFFO1NBQ1IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUU3QixJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUN2QyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFakIsOEJBQThCO1FBQzlCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGlCQUFpQixDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRW5FLDJCQUEyQjtRQUMzQixhQUFhO1FBQ2IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxTQUFTLENBQUMsWUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFN0QsWUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxPQUFPLEVBQUUsRUFBRSxFQUFFLGtCQUFrQjtJQUUvQixnQkFBZ0IsRUFBRTtRQUNqQixPQUFPLEVBQUUsR0FBRztRQUNaLFFBQVEsRUFBRSxHQUFHO1FBQ2IsT0FBTyxFQUFFLEdBQUc7S0FDWjtJQUVELFNBQVMsRUFBRSxVQUFTLGVBQWU7UUFDbEMsWUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2hCLElBQUcsbUJBQUcsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUN2QyxtQkFBRyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNqQyxtQkFBRyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUU7Z0JBQ3hCLEtBQUssRUFBRSxFQUFFO2dCQUNULE1BQU0sRUFBRSxFQUFDLE1BQU0sRUFBRyxDQUFDLEVBQUU7YUFDckIsQ0FBQyxDQUFDO1lBQ0gsNkJBQWEsQ0FBQyxNQUFNLENBQUMsWUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLHNGQUFzRixDQUFDLENBQUMsQ0FBQztRQUN2SCxDQUFDO1FBRUQsZUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFFN0MsaUJBQU8sQ0FBQyxlQUFlLENBQUMsWUFBSSxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCxRQUFRLEVBQUU7UUFDVCxPQUFPLEVBQUUsVUFBUyxLQUFLO1lBQ3RCLEtBQUksSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7Z0JBQ25CLElBQUcsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLFdBQVcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEtBQUssRUFBRSxDQUFDO29CQUNsRSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEIsQ0FBQztZQUNGLENBQUM7WUFDRCxPQUFPLElBQUksQ0FBQztRQUNiLENBQUM7UUFDRCxRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxVQUFVLENBQUMsRUFBRTtRQUMzQyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxNQUFNLENBQUMsRUFBRTtRQUNuQyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxNQUFNLENBQUMsRUFBRTtRQUNuQyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxNQUFNLENBQUMsRUFBRTtRQUNuQyxHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxLQUFLLENBQUMsRUFBRTtLQUNqQztJQUVELFFBQVEsRUFBRTtRQUNULE9BQU8sRUFBRSxVQUFTLEtBQUs7WUFDdEIsS0FBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDbkIsSUFBRyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksV0FBVyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksS0FBSyxFQUFFLENBQUM7b0JBQ2xFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixDQUFDO1lBQ0YsQ0FBQztZQUNELE9BQU8sSUFBSSxDQUFDO1FBQ2IsQ0FBQztRQUNELElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ25DLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLFlBQVksQ0FBQyxFQUFFO1FBQy9DLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLFlBQVksQ0FBQyxFQUFFO1FBQy9DLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQ3pDLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLFNBQVMsQ0FBQyxFQUFFO0tBQ3pDO0lBRUQsUUFBUSxFQUFFO1FBQ1QsSUFBSSxLQUFLLEdBQUcsSUFBQSxhQUFDLEVBQUMsYUFBYSxDQUFDLENBQUM7UUFDN0IsSUFBRyxlQUFNLENBQUMsWUFBWSxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ2hDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLENBQUM7UUFDRCxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELFlBQVksRUFBRTtRQUNiLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBQ3JDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBQ3JDLElBQUcsbUJBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxZQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUM3RixLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDYixLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDYixJQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztnQkFDL0IsZUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4QixDQUFDO1FBQ0YsQ0FBQzthQUFNLElBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUMxQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDYixLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDYixJQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztnQkFDL0IsZUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4QixDQUFDO1FBQ0YsQ0FBQztRQUVELElBQUcsQ0FBQyxtQkFBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDO1lBQzVCLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QixDQUFDO2FBQU0sQ0FBQztZQUNQLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUIsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMzQixDQUFDO1FBRUQsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDdkMsSUFBRyxtQkFBRyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQztZQUFFLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNuRCxDQUFDO0lBR0Qsa0JBQWtCLEVBQUUsVUFBUyxDQUFDO1FBQzdCLElBQUcsQ0FBQyxDQUFDLFFBQVEsSUFBSSxRQUFRLEVBQUMsQ0FBQztZQUMxQiw2QkFBNkI7UUFDOUIsQ0FBQzthQUFNLElBQUcsQ0FBQyxDQUFDLFFBQVEsSUFBSSxRQUFRLEVBQUMsQ0FBQztRQUNsQyxDQUFDO2FBQU0sSUFBRyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsRUFBQyxDQUFDO1FBQ3ZELENBQUM7SUFDRixDQUFDO0NBQ0QsQ0FBQzs7Ozs7O0FDdExGLGtEQUF1QztBQUN2QyxvQ0FBbUM7QUFDbkMsdUNBQXNDO0FBQ3RDLG9DQUFtQztBQUNuQyxrREFBaUQ7QUFDakQsaURBQXdDO0FBRTNCLFFBQUEsU0FBUyxHQUFHO0lBQ3hCLFNBQVMsRUFBRSxFQUFFLEVBQUUsb0NBQW9DO0lBQ25ELGFBQWEsRUFBRTtRQUNkLGdFQUFnRTtRQUNoRSxxQ0FBcUM7UUFDckMsSUFBSSxFQUFFLElBQUk7UUFDVixLQUFLLEVBQUUsSUFBSTtRQUNYLEtBQUssRUFBRSxJQUFJO1FBQ1gsbUZBQW1GO1FBQ25GLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLFVBQVUsRUFBRSxJQUFJO0tBQ2hCO0lBRUQsb0VBQW9FO0lBQ3BFLFFBQVEsRUFBRTtRQUNULE9BQU8sRUFBRSxDQUFDO1FBQ1YsWUFBWSxFQUFFLENBQUM7UUFDZixZQUFZLEVBQUUsQ0FBQztRQUNmLFdBQVcsRUFBRSxDQUFDO1FBQ2QsV0FBVyxFQUFFLENBQUM7S0FDZDtJQUVELG1FQUFtRTtJQUNuRSxLQUFLLEVBQUUsRUFBRztJQUVWLElBQUksRUFBRSxVQUFTLE9BQVE7UUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUN0QixJQUFJLENBQUMsT0FBTyxFQUNaLE9BQU8sQ0FDUCxDQUFDO1FBRUYsMkJBQTJCO1FBQzNCLElBQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDNUIsRUFBRSxFQUFFLFdBQVc7WUFDZixTQUFTLEVBQUUsV0FBVztTQUN0QixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRTdCLHdCQUF3QjtRQUN4QiwrRUFBK0U7UUFDL0UscUVBQXFFO1FBQy9ELElBQUksQ0FBQyxtQkFBRyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUM7WUFDakMsbUJBQUcsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsaUJBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0RCxDQUFDO2FBQU0sQ0FBQztZQUNiLGlCQUFTLENBQUMsUUFBUSxHQUFHLG1CQUFHLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFRLENBQUM7UUFDM0QsQ0FBQztRQUVELElBQUksQ0FBQyxtQkFBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUM7WUFDeEIsbUJBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsaUJBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRCxDQUFDO2FBQU0sQ0FBQztZQUNiLGlCQUFTLENBQUMsS0FBSyxHQUFHLG1CQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFRLENBQUM7UUFDckQsQ0FBQztRQUVELElBQUksQ0FBQyxtQkFBRyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLENBQUM7WUFDNUIsbUJBQUcsQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsaUJBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN4RCxDQUFDO2FBQU0sQ0FBQztZQUNiLGlCQUFTLENBQUMsU0FBUyxHQUFHLG1CQUFHLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFRLENBQUM7UUFDN0QsQ0FBQztRQUVELElBQUksQ0FBQyxtQkFBRyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxFQUFFLENBQUM7WUFDaEMsbUJBQUcsQ0FBQyxHQUFHLENBQUMseUJBQXlCLEVBQUUsaUJBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNoRSxDQUFDO2FBQU0sQ0FBQztZQUNiLGlCQUFTLENBQUMsYUFBYSxHQUFHLG1CQUFHLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFRLENBQUM7UUFDckUsQ0FBQztRQUVLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFakYsd0NBQXdDO1FBQ2xDLEtBQUksSUFBSSxJQUFJLElBQUksbUJBQUcsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQVEsRUFBRSxDQUFDO1lBQ25ELENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxtQkFBRyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNuRyxDQUFDO1FBRVAsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDckYsSUFBSSxDQUFDO1FBQ0wsTUFBTTtRQUNOLGVBQU0sQ0FBQyxNQUFNLENBQUM7WUFDYixFQUFFLEVBQUUsV0FBVztZQUNmLElBQUksRUFBRSxXQUFXO1lBQ2pCLEtBQUssRUFBRSxpQkFBUyxDQUFDLGFBQWE7U0FDOUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELE9BQU8sRUFBRSxFQUFFLEVBQUUsa0JBQWtCO0lBRS9CLElBQUksRUFBRSxJQUFJO0lBRVYsZ0JBQWdCLEVBQUUsSUFBVztJQUU3QixhQUFhLEVBQUU7UUFDZCxnRUFBZ0U7UUFDaEUsaUJBQVMsQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMzRyxJQUFJLGdCQUFnQixHQUFHLGlCQUFTLENBQUMsZ0JBQWdCLENBQUM7UUFDbEQsaUJBQVMsQ0FBQyxnQkFBZ0I7WUFDMUIsc0RBQXNEO2FBQ3JELEVBQUUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFO1lBQ3JCLGlCQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2pELGlCQUFTLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxPQUFPLEVBQUU7WUFDNUIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLG9DQUFvQyxHQUFHLG1CQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7aUJBQ3JHLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDekIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLE9BQU8sRUFBRTtZQUM1QixDQUFDLENBQUMsVUFBVSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDOUQsQ0FBQyxDQUFDLENBQUM7UUFDSCxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUMvRSxJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLHVDQUF1QyxDQUFDO2FBQzFFLEtBQUssQ0FBQztZQUNOLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxvQ0FBb0MsR0FBRyxtQkFBbUIsR0FBRyxRQUFRLENBQUMsQ0FBQztZQUNwRixPQUFPLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3BDLENBQUMsRUFBRTtZQUNGLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNsQyxDQUFDLENBQUM7YUFDRCxFQUFFLENBQUMsT0FBTyxFQUFFO1lBQ1osNkJBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLHVGQUF1RixDQUFDLENBQUMsQ0FBQztRQUN4SCxDQUFDLENBQUM7YUFDRCxHQUFHLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQzthQUM1QixRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUU3QixLQUFJLElBQUksSUFBSSxJQUFJLGlCQUFTLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDckMsNENBQTRDO1lBQzVDLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7aUJBQzdCLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO2lCQUNsQixJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQztpQkFDdkIsSUFBSSxDQUFDLG1CQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxHQUFJLE1BQU0sR0FBRyxpQkFBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsR0FBRyxHQUFHLENBQUM7aUJBQ2hGLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzdCLENBQUM7UUFFRCw2RUFBNkU7UUFDN0UsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUN0RixJQUFJLENBQUM7UUFDTCxNQUFNO1FBQ04sZUFBTSxDQUFDLE1BQU0sQ0FBQztZQUNiLEVBQUUsRUFBRSxnQkFBZ0I7WUFDcEIsSUFBSSxFQUFFLE9BQU87WUFDYixLQUFLLEVBQUUsaUJBQVMsQ0FBQyxjQUFjO1NBQy9CLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUMsRUFBRSxlQUFNLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFRCxjQUFjLEVBQUU7UUFDZixpQkFBUyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ25DLGlCQUFTLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDckMsQ0FBQztJQUVELGNBQWMsRUFBRSxVQUFTLElBQUksRUFBRSxNQUFRO1FBQVIsdUJBQUEsRUFBQSxVQUFRO1FBQ3RDLElBQUksaUJBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUMvQixpQkFBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUM7UUFDckMsQ0FBQzthQUFNLENBQUM7WUFDUCxpQkFBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDcEMsQ0FBQztRQUVELHFCQUFxQjtRQUNyQixtQkFBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsaUJBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBR0QsbUJBQW1CLEVBQUUsVUFBUyxJQUFJLEVBQUUsTUFBUTtRQUFSLHVCQUFBLEVBQUEsVUFBUTtRQUMzQyxJQUFJLGlCQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztZQUFFLGlCQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQztRQUNuRSxJQUFJLGlCQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ25DLE9BQU8saUJBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUVELHFCQUFxQjtRQUNyQixtQkFBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsaUJBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsZ0JBQWdCLEVBQUUsVUFBUyxJQUFJO1FBQzlCLElBQUksaUJBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDaEUsOEVBQThFO1lBQzlFLDZEQUE2RDtZQUM3RCxtQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3ZCLHdFQUF3RTtZQUN4RSxxQkFBcUI7WUFDckIsSUFBSSxPQUFNLENBQUMsbUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxVQUFVLElBQUksbUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDO2dCQUN4RixpQkFBUyxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JDLENBQUM7aUJBQU0sSUFBSSxtQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUN4QyxpQkFBUyxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JDLENBQUM7UUFDRixDQUFDO1FBRUQscUJBQXFCO1FBQ3JCLG1CQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxpQkFBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxTQUFTLEVBQUUsVUFBUyxJQUFJO1FBQ3ZCLElBQUksbUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksT0FBTSxDQUFDLGlCQUFTLENBQUMsYUFBYSxDQUFDLG1CQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxXQUFXLEVBQUUsQ0FBQztZQUNqRyxpQkFBUyxDQUFDLGNBQWMsQ0FBQyxpQkFBUyxDQUFDLGFBQWEsQ0FBQyxtQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDdkUsaUJBQVMsQ0FBQyxhQUFhLENBQUMsbUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDcEQsSUFBSSxtQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUM1QixtQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzFCLENBQUM7WUFDRCxpQkFBUyxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDbkMsQ0FBQztRQUVELHFCQUFxQjtRQUNyQixtQkFBRyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsaUJBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNsRCxtQkFBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsaUJBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsU0FBUyxFQUFFLFVBQVMsSUFBSTtRQUN2QixJQUFJLGlCQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ2hDLElBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFDdEIsaUJBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDN0MsQ0FBQztRQUNGLENBQUM7YUFBTSxDQUFDO1lBQ1AsaUJBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNuQyxDQUFDO1FBRUQscUJBQXFCO1FBQ3JCLG1CQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxpQkFBUyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2xDLENBQUM7SUFFRCwrRUFBK0U7SUFDL0UsK0VBQStFO0lBQy9FLGlGQUFpRjtJQUNqRiw0RUFBNEU7SUFDNUUscUJBQXFCLEVBQUUsVUFBUyxXQUFZO1FBQzNDLEtBQUssSUFBTSxJQUFJLElBQUksaUJBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUM1QyxJQUFJLG1CQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQzVCLEtBQUssSUFBTSxNQUFNLElBQUksbUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDN0MsaUVBQWlFO29CQUNqRSwrREFBK0Q7b0JBQy9ELHlEQUF5RDtvQkFDekQsYUFBYTtvQkFDYixJQUFJLE1BQU0sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7d0JBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDaEYsQ0FBQztZQUNGLENBQUM7UUFDRixDQUFDO0lBQ0YsQ0FBQztJQUVELDhEQUE4RDtJQUM5RCxlQUFlLEVBQUU7UUFDaEIsSUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFDLGlCQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDekQsS0FBSyxJQUFNLElBQUksSUFBSSxpQkFBUyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQzVDLElBQUksbUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDaEMsS0FBSyxJQUFNLElBQUksSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQztvQkFDNUQsSUFBSSxPQUFPLENBQUMsbUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksVUFBVSxDQUFDLEVBQUUsQ0FBQzt3QkFDN0QsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLG1CQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7b0JBQzFELENBQUM7eUJBQU0sQ0FBQzt3QkFDUCxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksbUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3hELENBQUM7Z0JBQ0YsQ0FBQztZQUNGLENBQUM7UUFDRixDQUFDO1FBRUQsS0FBSyxJQUFNLElBQUksSUFBSSxpQkFBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3BDLGFBQWE7WUFDYixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDdEIsYUFBYTtnQkFDYixLQUFLLElBQU0sSUFBSSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7b0JBQ2xELGFBQWE7b0JBQ2IsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDO3dCQUNuRCxhQUFhO3dCQUNiLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7b0JBQ2hELENBQUM7eUJBQU0sQ0FBQzt3QkFDUCxhQUFhO3dCQUNiLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUM5QyxDQUFDO2dCQUNGLENBQUM7WUFDRixDQUFDO1FBQ0YsQ0FBQztRQUVELE9BQU8sWUFBWSxDQUFDO0lBQ3JCLENBQUM7Q0FDRCxDQUFBOzs7Ozs7QUNsUkQsbUdBQW1HO0FBQ25HLG9HQUFvRztBQUNwRyxrQ0FBa0M7QUFDbEMsb0NBQW1DO0FBQ25DLHlDQUF3QztBQUN4QyxpREFBd0M7QUFDeEMsa0RBQXVDO0FBQ3ZDLGtEQUFpRDtBQUVwQyxRQUFBLFFBQVEsR0FBRztJQUNwQixlQUFlLEVBQUU7UUFDYixJQUFJLEVBQUUsWUFBWTtRQUNsQixJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsK0VBQStFLENBQUM7UUFDeEYsS0FBSyxFQUFFO1lBQ0gsZUFBTSxDQUFDLFVBQVUsQ0FBQztnQkFDZCxLQUFLLEVBQUcsSUFBQSxhQUFDLEVBQUMsOEJBQThCLENBQUM7Z0JBQ3pDLE1BQU0sRUFBRTtvQkFDSixLQUFLLEVBQUU7d0JBQ0gsSUFBSSxFQUFFOzRCQUNGLElBQUEsYUFBQyxFQUFDLHNHQUFzRyxDQUFDOzRCQUN6RyxJQUFBLGFBQUMsRUFBQyxrR0FBa0csQ0FBQzs0QkFDckcsSUFBQSxhQUFDLEVBQUMsZ0NBQWdDLENBQUM7eUJBQ3RDO3dCQUNELE9BQU8sRUFBRTs0QkFDTCxNQUFNLEVBQUU7Z0NBQ0osSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLHlDQUF5QyxDQUFDO2dDQUNsRCxRQUFRLEVBQUUscUJBQVMsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUM7Z0NBQ3BELFNBQVMsRUFBRSxLQUFLOzZCQUNuQjt5QkFDSjtxQkFDSjtpQkFDSjthQUNKLENBQUMsQ0FBQTtRQUNOLENBQUM7UUFDRCxZQUFZLEVBQUUsSUFBSTtLQUNyQjtJQUVELGdCQUFnQixFQUFFO1FBQ2QsSUFBSSxFQUFFLDhCQUE4QjtRQUNwQyxJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsMkJBQTJCLENBQUM7UUFDcEMsS0FBSyxFQUFFO1lBQ0gsZUFBTSxDQUFDLFVBQVUsQ0FBQztnQkFDZCxLQUFLLEVBQUUsSUFBQSxhQUFDLEVBQUMsaURBQWlELENBQUM7Z0JBQzNELE1BQU0sRUFBRTtvQkFDSixLQUFLLEVBQUU7d0JBQ0gsSUFBSSxFQUFFLENBQUMsSUFBQSxhQUFDLEVBQUMsK0RBQStELENBQUMsQ0FBQzt3QkFDMUUsT0FBTyxFQUFFOzRCQUNMLE1BQU0sRUFBRTtnQ0FDSixJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsT0FBTyxDQUFDO2dDQUNoQixTQUFTLEVBQUUsS0FBSzs2QkFDbkI7eUJBQ0o7cUJBQ0o7aUJBQ0o7YUFDSixDQUFDLENBQUE7UUFDTixDQUFDO1FBQ0QsWUFBWSxFQUFFLEtBQUs7S0FDdEI7SUFDRCxzQkFBc0IsRUFBRTtRQUNwQixJQUFJLEVBQUUsc0JBQXNCO1FBQzVCLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxxQkFBcUIsQ0FBQztRQUM5QixLQUFLLEVBQUU7WUFDSCxJQUFJLENBQUMsbUJBQUcsQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLENBQUMsRUFBRSxDQUFDO2dCQUM3Qyw2QkFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsOENBQThDLENBQUMsQ0FBQztnQkFDM0UsT0FBTztZQUNYLENBQUM7WUFDRCxlQUFNLENBQUMsVUFBVSxDQUFDO2dCQUNkLEtBQUssRUFBRSxJQUFBLGFBQUMsRUFBQyxzQkFBc0IsQ0FBQztnQkFDaEMsTUFBTSxFQUFFO29CQUNKLEtBQUssRUFBRTt3QkFDSCxJQUFJLEVBQUUsQ0FBQyxJQUFBLGFBQUMsRUFBQyxnSEFBZ0gsQ0FBQyxDQUFDO3dCQUMzSCxPQUFPLEVBQUU7NEJBQ0wsTUFBTSxFQUFFO2dDQUNKLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyx1REFBdUQsQ0FBQztnQ0FDaEUsU0FBUyxFQUFFLEtBQUs7NkJBQ25CO3lCQUNKO3FCQUNKO2lCQUNKO2FBQ0osQ0FBQyxDQUFBO1FBQ04sQ0FBQztLQUNKO0lBQ0QsdUJBQXVCLEVBQUU7UUFDckIsSUFBSSxFQUFFLDBCQUEwQjtRQUNoQyxJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsZ0VBQWdFLENBQUM7UUFDekUsS0FBSyxFQUFFO1lBQ0gsZUFBTSxDQUFDLFVBQVUsQ0FBQztnQkFDZCxLQUFLLEVBQUUsSUFBQSxhQUFDLEVBQUMsMEJBQTBCLENBQUM7Z0JBQ3BDLE1BQU0sRUFBRTtvQkFDSixLQUFLLEVBQUU7d0JBQ0gsSUFBSSxFQUFFLENBQUMsSUFBQSxhQUFDLEVBQUMsa0hBQWtILENBQUMsQ0FBQzt3QkFDN0gsT0FBTyxFQUFFOzRCQUNMLE1BQU0sRUFBRTtnQ0FDSixJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsNkJBQTZCLENBQUM7Z0NBQ3RDLFFBQVEsRUFBRSxxQkFBUyxDQUFDLGNBQWMsQ0FBQyxzQkFBc0IsQ0FBQztnQ0FDMUQsU0FBUyxFQUFFLEtBQUs7NkJBQ25CO3lCQUNKO3FCQUNKO2lCQUNKO2FBQ0osQ0FBQyxDQUFBO1FBQ04sQ0FBQztRQUNELFlBQVksRUFBRSxJQUFJO0tBQ3JCO0lBQ0Qsc0JBQXNCLEVBQUU7UUFDcEIsSUFBSSxFQUFFLGdCQUFnQjtRQUN0QixJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsbUJBQW1CLENBQUM7UUFDNUIsS0FBSyxFQUFFO1lBQ0gsZUFBTSxDQUFDLFVBQVUsQ0FBQztnQkFDZCxLQUFLLEVBQUUsSUFBQSxhQUFDLEVBQUMsZ0JBQWdCLENBQUM7Z0JBQzFCLE1BQU0sRUFBRTtvQkFDSixLQUFLLEVBQUU7d0JBQ0gsSUFBSSxFQUFFOzRCQUNGLElBQUEsYUFBQyxFQUFDLHVGQUF1RixDQUFDOzRCQUMxRixJQUFBLGFBQUMsRUFBQyxnRkFBZ0YsQ0FBQzt5QkFDdEY7d0JBQ0QsT0FBTyxFQUFFOzRCQUNMLE1BQU0sRUFBRTtnQ0FDSixJQUFJLEVBQUUsSUFBQSxhQUFDLEVBQUMsbUJBQW1CLENBQUM7Z0NBQzVCLFNBQVMsRUFBRSxLQUFLOzZCQUNuQjt5QkFDSjtxQkFDSjtpQkFDSjthQUNKLENBQUMsQ0FBQTtRQUNOLENBQUM7S0FDSjtJQUNELHNCQUFzQixFQUFFO1FBQ3BCLElBQUksRUFBRSxtQkFBbUI7UUFDekIsSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLG1CQUFtQixDQUFDO1FBQzVCLEtBQUssRUFBRTtZQUNILGVBQU0sQ0FBQyxVQUFVLENBQUM7Z0JBQ2QsS0FBSyxFQUFFLElBQUEsYUFBQyxFQUFDLG1CQUFtQixDQUFDO2dCQUM3QixNQUFNLEVBQUU7b0JBQ0osS0FBSyxFQUFFO3dCQUNILElBQUksRUFBRTs0QkFDRixJQUFBLGFBQUMsRUFBQywwRkFBMEYsQ0FBQzs0QkFDN0YsSUFBQSxhQUFDLEVBQUMsZ0ZBQWdGLENBQUM7eUJBQ3RGO3dCQUNELE9BQU8sRUFBRTs0QkFDTCxNQUFNLEVBQUU7Z0NBQ0osSUFBSSxFQUFFLElBQUEsYUFBQyxFQUFDLG1CQUFtQixDQUFDO2dDQUM1QixTQUFTLEVBQUUsS0FBSzs2QkFDbkI7eUJBQ0o7cUJBQ0o7aUJBQ0o7YUFDSixDQUFDLENBQUE7UUFDTixDQUFDO0tBQ0o7SUFDRCxlQUFlLEVBQUU7UUFDYixJQUFJLEVBQUUsZ0JBQWdCO1FBQ3RCLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxrQ0FBa0MsQ0FBQztRQUMzQyxLQUFLLEVBQUU7WUFDSCxlQUFNLENBQUMsVUFBVSxDQUFDO2dCQUNkLEtBQUssRUFBRSxJQUFBLGFBQUMsRUFBQyxnQkFBZ0IsQ0FBQztnQkFDMUIsTUFBTSxFQUFFO29CQUNKLEtBQUssRUFBRTt3QkFDSCxJQUFJLEVBQUU7NEJBQ0YsSUFBQSxhQUFDLEVBQUMsMEZBQTBGLENBQUM7NEJBQzdGLElBQUEsYUFBQyxFQUFDLGdGQUFnRixDQUFDO3lCQUN0Rjt3QkFDRCxPQUFPLEVBQUU7NEJBQ0wsTUFBTSxFQUFFO2dDQUNKLElBQUksRUFBRSxJQUFBLGFBQUMsRUFBQyxtQkFBbUIsQ0FBQztnQ0FDNUIsU0FBUyxFQUFFLEtBQUs7NkJBQ25CO3lCQUNKO3FCQUNKO2lCQUNKO2FBQ0osQ0FBQyxDQUFBO1FBQ04sQ0FBQztLQUNKO0NBQ0osQ0FBQTs7OztBQzdLRDs7Ozs7Ozs7Ozs7Ozs7R0FjRzs7O0FBRUgsbUNBQWtDO0FBQ2xDLGlEQUFnRDtBQUVoRCxJQUFJLFlBQVksR0FBRztJQUVsQixTQUFTLEVBQUUsY0FBYztJQUV6QixPQUFPLEVBQUUsRUFBRTtJQUVYLElBQUksRUFBRSxVQUFTLE9BQVE7UUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUNyQixJQUFJLENBQUMsT0FBTyxFQUNaLE9BQU8sQ0FDUixDQUFDO1FBRUYsbUJBQW1CO1FBQ25CLElBQUksSUFBSSxHQUFHO1lBQ1YsVUFBVSxFQUFHLGtFQUFrRTtZQUMvRSxRQUFRLEVBQUksbUNBQW1DO1lBQy9DLFdBQVcsRUFBRyxvREFBb0Q7WUFDbEUsUUFBUTtZQUNSLFFBQVE7WUFDUixNQUFNLEVBQUkseUVBQXlFO1lBQ25GLFdBQVcsRUFBRSw4Q0FBOEM7WUFDM0QsVUFBVSxFQUFHLDRFQUE0RTtZQUN6RixRQUFRLENBQUcsOERBQThEO1NBQ3pFLENBQUM7UUFFRixLQUFJLElBQUksS0FBSyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ3ZCLElBQUcsQ0FBQyxXQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFBRSxXQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNwRCxDQUFDO1FBRUQsMkJBQTJCO1FBQzNCLGFBQWE7UUFDYixDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUU1RCxhQUFhO1FBQ2IsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUVELHVDQUF1QztJQUN2QyxXQUFXLEVBQUUsVUFBUyxTQUFTLEVBQUUsS0FBSztRQUNyQyxJQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzFDLG1EQUFtRDtRQUNuRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3ZDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDO2dCQUNyQixLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDbkIsQ0FBQyxFQUFFLENBQUM7WUFDTCxDQUFDO1FBQ0YsQ0FBQztRQUNELDhFQUE4RTtRQUM5RSx5RUFBeUU7UUFDekUscUZBQXFGO1FBQ3JGLHlFQUF5RTtRQUN6RSxhQUFhO1FBQ2IsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNiLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBQyxLQUFLLENBQUMsTUFBTSxHQUFDLENBQUMsRUFBQyxDQUFDLEdBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFDLENBQUM7WUFDMUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNiLElBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVM7Z0JBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUN0QyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2QsQ0FBQztRQUNELEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDdEIsT0FBTyxHQUFHLENBQUM7SUFDWixDQUFDO0lBRUQsa0JBQWtCO0lBQ2xCLDhGQUE4RjtJQUM5RixHQUFHLEVBQUUsVUFBUyxTQUFTLEVBQUUsS0FBSyxFQUFFLE9BQVE7UUFDdkMsSUFBSSxRQUFRLEdBQUcsV0FBRyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUV4QyxtREFBbUQ7UUFDbkQsSUFBRyxPQUFPLEtBQUssSUFBSSxRQUFRLElBQUksS0FBSyxHQUFHLFdBQUcsQ0FBQyxTQUFTO1lBQUUsS0FBSyxHQUFHLFdBQUcsQ0FBQyxTQUFTLENBQUM7UUFFNUUsSUFBRyxDQUFDO1lBQ0gsSUFBSSxDQUFDLEdBQUcsR0FBQyxRQUFRLEdBQUMsV0FBVyxDQUFDLENBQUM7UUFDaEMsQ0FBQztRQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDWixzQ0FBc0M7WUFDdEMsV0FBRyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbkMsQ0FBQztRQUVELG1DQUFtQztRQUNuQyxhQUFhO1FBQ2IsSUFBRyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxXQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUN0RSxJQUFJLENBQUMsR0FBRyxHQUFDLFFBQVEsR0FBQyxPQUFPLENBQUMsQ0FBQztZQUMzQixlQUFNLENBQUMsR0FBRyxDQUFDLGlCQUFpQixHQUFHLFNBQVMsR0FBRyxpREFBaUQsQ0FBQyxDQUFDO1FBQy9GLENBQUM7UUFFRCxlQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFcEMsSUFBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2IsZUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2xCLFdBQUcsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDM0IsQ0FBQztJQUNGLENBQUM7SUFFRCx1QkFBdUI7SUFDdkIsSUFBSSxFQUFFLFVBQVMsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFRO1FBQ3hDLFdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFMUIsNkNBQTZDO1FBQzdDLElBQUcsV0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxTQUFTO1lBQUUsV0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXBFLEtBQUksSUFBSSxDQUFDLElBQUksSUFBSSxFQUFDLENBQUM7WUFDbEIsV0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUMsSUFBSSxHQUFDLENBQUMsR0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hELENBQUM7UUFFRCxJQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDYixlQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbEIsV0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM1QixDQUFDO0lBQ0YsQ0FBQztJQUVELHdFQUF3RTtJQUN4RSxHQUFHLEVBQUUsVUFBUyxTQUFTLEVBQUUsS0FBSyxFQUFFLE9BQVE7UUFDdkMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ1osc0VBQXNFO1FBQ3RFLCtFQUErRTtRQUMvRSx1R0FBdUc7UUFDdkcsSUFBSSxHQUFHLEdBQUcsV0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFbkMsa0RBQWtEO1FBQ2xELElBQUcsR0FBRyxJQUFJLEdBQUcsRUFBQyxDQUFDO1lBQ2QsZUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUMsU0FBUyxHQUFDLHVDQUF1QyxDQUFDLENBQUM7WUFDMUUsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNSLFdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEdBQUcsR0FBRyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDMUMsQ0FBQzthQUFNLElBQUcsT0FBTyxHQUFHLElBQUksUUFBUSxJQUFJLE9BQU8sS0FBSyxJQUFJLFFBQVEsRUFBQyxDQUFDO1lBQzdELGVBQU0sQ0FBQyxHQUFHLENBQUMsc0NBQXNDLEdBQUMsU0FBUyxHQUFDLFlBQVksR0FBQyxLQUFLLEdBQUMsd0NBQXdDLENBQUMsQ0FBQztZQUN6SCxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ1QsQ0FBQzthQUFNLENBQUM7WUFDUCxXQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLEdBQUcsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsaUNBQWlDO1FBQzVFLENBQUM7UUFFRCxPQUFPLEdBQUcsQ0FBQztJQUNaLENBQUM7SUFFRCx1REFBdUQ7SUFDdkQsSUFBSSxFQUFFLFVBQVMsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFRO1FBQ3hDLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztRQUVaLDZDQUE2QztRQUM3QyxJQUFHLFdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEtBQUssU0FBUztZQUFFLFdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVwRSxLQUFJLElBQUksQ0FBQyxJQUFJLElBQUksRUFBQyxDQUFDO1lBQ2xCLElBQUcsV0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUMsSUFBSSxHQUFDLENBQUMsR0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQztnQkFBRSxHQUFHLEVBQUUsQ0FBQztRQUMxRCxDQUFDO1FBRUQsSUFBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2IsZUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2xCLFdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUNELE9BQU8sR0FBRyxDQUFDO0lBQ1osQ0FBQztJQUVELDhCQUE4QjtJQUM5QixHQUFHLEVBQUUsVUFBUyxTQUFTLEVBQUUsV0FBWTtRQUNwQyxJQUFJLFVBQVUsR0FBdUMsSUFBSSxDQUFDO1FBQzFELElBQUksUUFBUSxHQUFHLFdBQUcsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFeEMsK0NBQStDO1FBQy9DLElBQUcsQ0FBQztZQUNILElBQUksQ0FBQyxnQkFBZ0IsR0FBQyxRQUFRLEdBQUMsR0FBRyxDQUFDLENBQUM7UUFDckMsQ0FBQztRQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDWixVQUFVLEdBQUcsU0FBUyxDQUFDO1FBQ3hCLENBQUM7UUFFRCwwRUFBMEU7UUFDMUUsSUFBRyxDQUFDLENBQUMsVUFBVTtRQUNkLHVCQUF1QjtTQUN0QixJQUFJLFdBQVc7WUFBRSxPQUFPLENBQUMsQ0FBQzs7WUFDdkIsT0FBTyxVQUFVLENBQUM7SUFDeEIsQ0FBQztJQUVELHNFQUFzRTtJQUN0RSxnRkFBZ0Y7SUFDaEYsTUFBTSxFQUFFLFVBQVMsU0FBUyxFQUFFLEtBQUssRUFBRSxPQUFRO1FBQzFDLFdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNuQyxPQUFPLElBQUksQ0FBQyxHQUFHLEdBQUMsV0FBRyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBQyxHQUFHLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsTUFBTSxFQUFFLFVBQVMsU0FBUyxFQUFFLE9BQVE7UUFDbkMsSUFBSSxVQUFVLEdBQUcsV0FBRyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMxQyxJQUFHLENBQUM7WUFDSCxJQUFJLENBQUMsVUFBVSxHQUFDLFVBQVUsR0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQyxDQUFDO1FBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUNaLG9DQUFvQztZQUNwQyxlQUFNLENBQUMsR0FBRyxDQUFDLGdEQUFnRCxHQUFDLFNBQVMsR0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5RSxDQUFDO1FBQ0QsSUFBRyxDQUFDLE9BQU8sRUFBQyxDQUFDO1lBQ1osZUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2xCLFdBQUcsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDM0IsQ0FBQztJQUNGLENBQUM7SUFFRCxtQ0FBbUM7SUFDbkMsdURBQXVEO0lBQ3ZELFNBQVMsRUFBRSxVQUFTLEtBQUs7UUFDeEIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFBLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLHdDQUF3QztRQUN0RixPQUFPLE9BQU8sR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDO0lBQzlCLENBQUM7SUFFRCxVQUFVLEVBQUUsVUFBUyxTQUFTLEVBQUUsSUFBSztRQUNwQyxJQUFJLFFBQVEsR0FBRyxXQUFHLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzFDLElBQUcsU0FBUyxJQUFJLFNBQVM7WUFBRSxTQUFTLEdBQUcsUUFBUSxHQUFHLEtBQUssQ0FBQyxDQUFDLDJEQUEyRDtRQUNwSCxhQUFhO1FBQ2IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBQyxTQUFTLEVBQUMsQ0FBQyxDQUFDO1FBQ2pGLElBQUcsSUFBSTtZQUFFLGVBQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRUQsV0FBVyxFQUFFLFVBQVMsU0FBUztRQUM5QixJQUFJLE9BQU8sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLElBQUksUUFBUSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUcsT0FBTyxJQUFJLENBQUMsQ0FBQyxJQUFJLFFBQVEsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDO1lBQ25DLE1BQU0sR0FBRyxPQUFPLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztRQUNsRCxDQUFDO2FBQU0sQ0FBQztZQUNQLE1BQU0sR0FBRyxPQUFPLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztRQUNsRCxDQUFDO1FBQ0QsSUFBSSxNQUFNLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQztZQUNqQixPQUFPLFNBQVMsQ0FBQztRQUNsQixDQUFDO2FBQU0sQ0FBQztZQUNQLE9BQU8sU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUMsTUFBTSxDQUFDLENBQUM7UUFDbkMsQ0FBQztJQUNGLENBQUM7SUFFRDs7d0VBRW9FO0lBQ3BFLE9BQU87SUFDUCxPQUFPLEVBQUUsVUFBUyxJQUFJO1FBQ3JCLFdBQUcsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEdBQUMsSUFBSSxHQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3Qyw2QkFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsZUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsT0FBTyxFQUFFLFVBQVMsSUFBSTtRQUNyQixPQUFPLFdBQUcsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEdBQUMsSUFBSSxHQUFDLElBQUksQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxRQUFRO0lBQ1IsU0FBUyxFQUFFLFVBQVMsTUFBTSxFQUFFLE9BQU87UUFDbEMsSUFBSSxRQUFRLEdBQUcsV0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUMsTUFBTSxHQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9DLElBQUcsT0FBTyxRQUFRLElBQUksV0FBVyxFQUFFLENBQUM7WUFDbkMsT0FBTyxDQUFDLFFBQVEsR0FBSSxRQUFnQixhQUFoQixRQUFRLHVCQUFSLFFBQVEsQ0FBVSxRQUFRLENBQUM7UUFDaEQsQ0FBQztRQUNELFdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFDLE1BQU0sR0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELFNBQVMsRUFBRSxVQUFTLE1BQU07UUFDekIsSUFBSSxRQUFRLEdBQUcsV0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUMsTUFBTSxHQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9DLElBQUcsT0FBTyxRQUFRLElBQUksV0FBVyxFQUFFLENBQUM7WUFDbkMsT0FBTyxRQUFRLENBQUM7UUFDakIsQ0FBQztRQUNELE9BQU8sRUFBRSxDQUFDO0lBQ1gsQ0FBQztJQUVELE1BQU07SUFDTixHQUFHLEVBQUUsVUFBUyxJQUFJLEVBQUUsU0FBUztRQUM1QixRQUFPLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN4QixLQUFLLE1BQU0sQ0FBQztZQUNaLEtBQUssTUFBTSxDQUFDO1lBQ1osS0FBSyxRQUFRLENBQUM7WUFDZCxLQUFLLFNBQVM7Z0JBQ2IsT0FBTyxXQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBQyxJQUFJLEdBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzVDLEtBQUssVUFBVTtnQkFDZCxPQUFPLFdBQUcsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEdBQUMsSUFBSSxHQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwRCxDQUFDO0lBQ0YsQ0FBQztJQUVELGtCQUFrQixFQUFFLFVBQVMsQ0FBQztJQUU5QixDQUFDO0NBQ0QsQ0FBQztBQUVGLE9BQU87QUFDTSxRQUFBLEdBQUcsR0FBRyxZQUFZLENBQUM7Ozs7OztBQ2xTaEMsaURBQWdEO0FBQ2hELGlEQUFzQztBQUN0QyxtQ0FBa0M7QUFFckIsUUFBQSxPQUFPLEdBQUc7SUFDbkIsSUFBSSxFQUFFLFVBQVMsT0FBUTtRQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQzVCLElBQUksQ0FBQyxPQUFPLEVBQ1osT0FBTyxDQUNQLENBQUM7UUFFSSwyQkFBMkI7UUFDM0IsYUFBYTtRQUNuQixDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxlQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQsa0JBQWtCLEVBQUUsVUFBUyxDQUFDO1FBQzFCLElBQUksQ0FBQyxDQUFDLFFBQVEsSUFBSSxTQUFTLEVBQUUsQ0FBQztZQUMxQixRQUFRLG1CQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7Z0JBQ3pCLEtBQUssT0FBTztvQkFDUixlQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7b0JBQ3JCLE1BQU07Z0JBQ1YsS0FBSyxRQUFRO29CQUNULGVBQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztvQkFDdEIsTUFBTTtnQkFDVixLQUFLLE9BQU87b0JBQ1IsZUFBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO29CQUNyQixNQUFNO2dCQUNWLFFBQVE7WUFDWixDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFFRCxZQUFZLEVBQUUsT0FBTztJQUVyQixVQUFVLEVBQUU7UUFDUiw2QkFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztRQUN2RCxlQUFPLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQztRQUMvQixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsZUFBZSxFQUFFLFNBQVMsRUFBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3hELENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLGVBQWUsRUFBRSxTQUFTLEVBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN0RSxlQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELFdBQVcsRUFBRTtRQUNULElBQUksZUFBTyxDQUFDLFlBQVksSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUNsQyw2QkFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsb0NBQW9DLENBQUMsQ0FBQztRQUNyRSxDQUFDO2FBQU0sSUFBSSxlQUFPLENBQUMsWUFBWSxJQUFJLE9BQU8sRUFBRSxDQUFDO1lBQ3pDLDZCQUFhLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSx5Q0FBeUMsQ0FBQyxDQUFBO1FBQ3pFLENBQUM7UUFDRCxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsZUFBZSxFQUFFLFNBQVMsRUFBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3hELENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLGVBQWUsRUFBRSxTQUFTLEVBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN0RSxlQUFPLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQztRQUNoQyxlQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELFVBQVUsRUFBRTtRQUNSLElBQUksZUFBTyxDQUFDLFlBQVksSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUNsQyw2QkFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsNkZBQTZGLENBQUMsQ0FBQztRQUM5SCxDQUFDO2FBQU0sSUFBSSxlQUFPLENBQUMsWUFBWSxJQUFJLFFBQVEsRUFBRSxDQUFDO1lBQzFDLDZCQUFhLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSx5RkFBeUYsQ0FBQyxDQUFBO1FBQ3pILENBQUM7UUFFRCxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsZUFBZSxFQUFFLFNBQVMsRUFBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3hELENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLGVBQWUsRUFBRSxTQUFTLEVBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN0RSxlQUFPLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQztRQUMvQixlQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVELFNBQVMsRUFBRSxFQUFFO0lBRWIsZUFBZSxFQUFFLFVBQVMsZ0JBQWdCLEVBQUUsUUFBUTtRQUFuQyxpQkF5QmhCO1FBeEJHLElBQUksZUFBTyxDQUFDLFNBQVMsSUFBSSxFQUFFO1lBQUUsZUFBTyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUQsd0VBQXdFO1FBQ3hFLHNFQUFzRTthQUNqRSxJQUFJLGVBQU8sQ0FBQyxTQUFTLElBQUksUUFBUTtZQUFFLE9BQU87UUFFL0MsSUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDO1FBQzNCLDRCQUE0QjtRQUM1QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFeEIsc0NBQXNDO1FBQ3RDLElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLEtBQUssSUFBSSxDQUFDLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztZQUM3QixnQkFBZ0IsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV4QyxJQUFJLEdBQUcsR0FBRyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUN6QixhQUFhLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQixNQUFNO1lBQ1YsQ0FBQztRQUNMLENBQUM7UUFFRCxJQUFJLGFBQWEsSUFBSSxtQkFBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUM7WUFBRSxtQkFBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDM0UsZUFBTSxDQUFDLFVBQVUsQ0FBQztZQUNkLEtBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDckQsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUVELFVBQVUsRUFBRTtRQUNSLHdDQUF3QztRQUN4QyxzQkFBc0I7UUFDdEIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRW5CLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNsQixJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDZixJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFFbkIsT0FBTyxTQUFTLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDdkIseURBQXlEO1lBQ3pELGdDQUFnQztZQUNoQyxJQUFJLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLCtCQUErQjtZQUMvQixJQUFJLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9ELFdBQVc7WUFDWCxTQUFTLElBQUksVUFBVSxDQUFDO1lBQ3hCLDZFQUE2RTtZQUM3RSxLQUFLLElBQUksaUNBQWlDLEdBQUcsU0FBUyxHQUFHLGFBQWEsR0FBRyxDQUFDLFVBQVUsR0FBRyxVQUFVLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLHdCQUF3QixHQUFHLFVBQVUsR0FBRyw0QkFBNEIsR0FBRyxVQUFVLEdBQUcsa0RBQWtELEdBQUcsVUFBVSxHQUFHLDRCQUE0QixHQUFHLFVBQVUsR0FBRyx5REFBeUQsR0FBRyxVQUFVLEdBQUcsNEJBQTRCLEdBQUcsVUFBVSxHQUFHLGtCQUFrQixDQUFDO1lBQ3piLFNBQVMsSUFBSSxrQ0FBa0MsR0FBRyxTQUFTLEdBQUcsYUFBYSxHQUFHLENBQUMsVUFBVSxHQUFHLFVBQVUsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsd0JBQXdCLEdBQUcsVUFBVSxHQUFHLDRCQUE0QixHQUFHLFVBQVUsR0FBRyxrREFBa0QsR0FBRyxVQUFVLEdBQUcsNEJBQTRCLEdBQUcsVUFBVSxHQUFHLHlEQUF5RCxHQUFHLFVBQVUsR0FBRyw0QkFBNEIsR0FBRyxVQUFVLEdBQUcsa0JBQWtCLENBQUM7UUFDaGMsQ0FBQztRQUVELENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELFlBQVksRUFBRTtRQUNWLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN2QixDQUFDO0NBQ0osQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIChmdW5jdGlvbigpIHtcclxuXHJcbi8vIFx0dmFyIHRyYW5zbGF0ZSA9IGZ1bmN0aW9uKHRleHQpXHJcbi8vIFx0e1xyXG4vLyBcdFx0dmFyIHhsYXRlID0gdHJhbnNsYXRlTG9va3VwKHRleHQpO1xyXG5cdFx0XHJcbi8vIFx0XHRpZiAodHlwZW9mIHhsYXRlID09IFwiZnVuY3Rpb25cIilcclxuLy8gXHRcdHtcclxuLy8gXHRcdFx0eGxhdGUgPSB4bGF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4vLyBcdFx0fVxyXG4vLyBcdFx0ZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpXHJcbi8vIFx0XHR7XHJcbi8vIFx0XHRcdHZhciBhcHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XHJcbi8vIFx0XHRcdHZhciBhcmdzID0gYXBzLmNhbGwoIGFyZ3VtZW50cywgMSApO1xyXG4gIFxyXG4vLyBcdFx0XHR4bGF0ZSA9IGZvcm1hdHRlcih4bGF0ZSwgYXJncyk7XHJcbi8vIFx0XHR9XHJcblx0XHRcclxuLy8gXHRcdHJldHVybiB4bGF0ZTtcclxuLy8gXHR9O1xyXG5cdFxyXG4vLyBcdC8vIEkgd2FudCBpdCBhdmFpbGFibGUgZXhwbGljaXR5IGFzIHdlbGwgYXMgdmlhIHRoZSBvYmplY3RcclxuLy8gXHR0cmFuc2xhdGUudHJhbnNsYXRlID0gdHJhbnNsYXRlO1xyXG5cdFxyXG4vLyBcdC8vZnJvbSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS83NzYxOTYgdmlhIGh0dHA6Ly9kYXZlZGFzaC5jb20vMjAxMC8xMS8xOS9weXRob25pYy1zdHJpbmctZm9ybWF0dGluZy1pbi1qYXZhc2NyaXB0LyBcclxuLy8gXHR2YXIgZGVmYXVsdEZvcm1hdHRlciA9IChmdW5jdGlvbigpIHtcclxuLy8gXHRcdHZhciByZSA9IC9cXHsoW159XSspXFx9L2c7XHJcbi8vIFx0XHRyZXR1cm4gZnVuY3Rpb24ocywgYXJncykge1xyXG4vLyBcdFx0XHRyZXR1cm4gcy5yZXBsYWNlKHJlLCBmdW5jdGlvbihfLCBtYXRjaCl7IHJldHVybiBhcmdzW21hdGNoXTsgfSk7XHJcbi8vIFx0XHR9O1xyXG4vLyBcdH0oKSk7XHJcbi8vIFx0dmFyIGZvcm1hdHRlciA9IGRlZmF1bHRGb3JtYXR0ZXI7XHJcbi8vIFx0dHJhbnNsYXRlLnNldEZvcm1hdHRlciA9IGZ1bmN0aW9uKG5ld0Zvcm1hdHRlcilcclxuLy8gXHR7XHJcbi8vIFx0XHRmb3JtYXR0ZXIgPSBuZXdGb3JtYXR0ZXI7XHJcbi8vIFx0fTtcclxuXHRcclxuLy8gXHR0cmFuc2xhdGUuZm9ybWF0ID0gZnVuY3Rpb24oKVxyXG4vLyBcdHtcclxuLy8gXHRcdHZhciBhcHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XHJcbi8vIFx0XHR2YXIgcyA9IGFyZ3VtZW50c1swXTtcclxuLy8gXHRcdHZhciBhcmdzID0gYXBzLmNhbGwoIGFyZ3VtZW50cywgMSApO1xyXG4gIFxyXG4vLyBcdFx0cmV0dXJuIGZvcm1hdHRlcihzLCBhcmdzKTtcclxuLy8gXHR9O1xyXG5cclxuLy8gXHR2YXIgZHlub1RyYW5zID0gbnVsbDtcclxuLy8gXHR0cmFuc2xhdGUuc2V0RHluYW1pY1RyYW5zbGF0b3IgPSBmdW5jdGlvbihuZXdEeW5vVHJhbnMpXHJcbi8vIFx0e1xyXG4vLyBcdFx0ZHlub1RyYW5zID0gbmV3RHlub1RyYW5zO1xyXG4vLyBcdH07XHJcblxyXG4vLyBcdHZhciB0cmFuc2xhdGlvbiA9IG51bGw7XHJcbi8vIFx0dHJhbnNsYXRlLnNldFRyYW5zbGF0aW9uID0gZnVuY3Rpb24obmV3VHJhbnNsYXRpb24pXHJcbi8vIFx0e1xyXG4vLyBcdFx0dHJhbnNsYXRpb24gPSBuZXdUcmFuc2xhdGlvbjtcclxuLy8gXHR9O1xyXG5cdFxyXG4vLyBcdGZ1bmN0aW9uIHRyYW5zbGF0ZUxvb2t1cCh0YXJnZXQpXHJcbi8vIFx0e1xyXG4vLyBcdFx0aWYgKHRyYW5zbGF0aW9uID09IG51bGwgfHwgdGFyZ2V0ID09IG51bGwpXHJcbi8vIFx0XHR7XHJcbi8vIFx0XHRcdHJldHVybiB0YXJnZXQ7XHJcbi8vIFx0XHR9XHJcblx0XHRcclxuLy8gXHRcdGlmICh0YXJnZXQgaW4gdHJhbnNsYXRpb24gPT0gZmFsc2UpXHJcbi8vIFx0XHR7XHJcbi8vIFx0XHRcdGlmIChkeW5vVHJhbnMgIT0gbnVsbClcclxuLy8gXHRcdFx0e1xyXG4vLyBcdFx0XHRcdHJldHVybiBkeW5vVHJhbnModGFyZ2V0KTtcclxuLy8gXHRcdFx0fVxyXG4vLyBcdFx0XHRyZXR1cm4gdGFyZ2V0O1xyXG4vLyBcdFx0fVxyXG5cdFx0XHJcbi8vIFx0XHR2YXIgcmVzdWx0ID0gdHJhbnNsYXRpb25bdGFyZ2V0XTtcclxuLy8gXHRcdGlmIChyZXN1bHQgPT0gbnVsbClcclxuLy8gXHRcdHtcclxuLy8gXHRcdFx0cmV0dXJuIHRhcmdldDtcclxuLy8gXHRcdH1cclxuXHRcdFxyXG4vLyBcdFx0cmV0dXJuIHJlc3VsdDtcclxuLy8gXHR9O1xyXG5cdFxyXG4vLyBcdHdpbmRvdy5fID0gdHJhbnNsYXRlO1xyXG5cclxuLy8gfSkoKTtcclxuXHJcbi8vIGV4cG9ydCBjb25zdCBfID0gd2luZG93Ll87XHJcblxyXG5leHBvcnQgY29uc3QgXyA9IGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHM7IH0iLCJpbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi9lbmdpbmVcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi9saWIvdHJhbnNsYXRlXCI7XHJcblxyXG5leHBvcnQgY29uc3QgQnV0dG9uID0ge1xyXG5cdEJ1dHRvbjogZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdFx0aWYodHlwZW9mIG9wdGlvbnMuY29vbGRvd24gPT0gJ251bWJlcicpIHtcclxuXHRcdFx0dGhpcy5kYXRhX2Nvb2xkb3duID0gb3B0aW9ucy5jb29sZG93bjtcclxuXHRcdH1cclxuXHRcdHRoaXMuZGF0YV9yZW1haW5pbmcgPSAwO1xyXG5cdFx0aWYodHlwZW9mIG9wdGlvbnMuY2xpY2sgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHR0aGlzLmRhdGFfaGFuZGxlciA9IG9wdGlvbnMuY2xpY2s7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHZhciBlbCA9ICQoJzxkaXY+JylcclxuXHRcdFx0LmF0dHIoJ2lkJywgdHlwZW9mKG9wdGlvbnMuaWQpICE9ICd1bmRlZmluZWQnID8gb3B0aW9ucy5pZCA6IFwiQlROX1wiICsgRW5naW5lLmdldEd1aWQoKSlcclxuXHRcdFx0LmFkZENsYXNzKCdidXR0b24nKVxyXG5cdFx0XHQudGV4dCh0eXBlb2Yob3B0aW9ucy50ZXh0KSAhPSAndW5kZWZpbmVkJyA/IG9wdGlvbnMudGV4dCA6IFwiYnV0dG9uXCIpXHJcblx0XHRcdC5jbGljayhmdW5jdGlvbigpIHsgXHJcblx0XHRcdFx0aWYoISQodGhpcykuaGFzQ2xhc3MoJ2Rpc2FibGVkJykpIHtcclxuXHRcdFx0XHRcdEJ1dHRvbi5jb29sZG93bigkKHRoaXMpKTtcclxuXHRcdFx0XHRcdCQodGhpcykuZGF0YShcImhhbmRsZXJcIikoJCh0aGlzKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0XHQuZGF0YShcImhhbmRsZXJcIiwgIHR5cGVvZiBvcHRpb25zLmNsaWNrID09ICdmdW5jdGlvbicgPyBvcHRpb25zLmNsaWNrIDogZnVuY3Rpb24oKSB7IEVuZ2luZS5sb2coXCJjbGlja1wiKTsgfSlcclxuXHRcdFx0LmRhdGEoXCJyZW1haW5pbmdcIiwgMClcclxuXHRcdFx0LmRhdGEoXCJjb29sZG93blwiLCB0eXBlb2Ygb3B0aW9ucy5jb29sZG93biA9PSAnbnVtYmVyJyA/IG9wdGlvbnMuY29vbGRvd24gOiAwKTtcclxuXHRcdFxyXG5cdFx0ZWwuYXBwZW5kKCQoXCI8ZGl2PlwiKS5hZGRDbGFzcygnY29vbGRvd24nKSk7XHJcblx0XHRcclxuXHRcdGlmKG9wdGlvbnMuY29zdCkge1xyXG5cdFx0XHR2YXIgdHRQb3MgPSBvcHRpb25zLnR0UG9zID8gb3B0aW9ucy50dFBvcyA6IFwiYm90dG9tIHJpZ2h0XCI7XHJcblx0XHRcdHZhciBjb3N0VG9vbHRpcCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ3Rvb2x0aXAgJyArIHR0UG9zKTtcclxuXHRcdFx0Zm9yKHZhciBrIGluIG9wdGlvbnMuY29zdCkge1xyXG5cdFx0XHRcdCQoXCI8ZGl2PlwiKS5hZGRDbGFzcygncm93X2tleScpLnRleHQoXyhrKSkuYXBwZW5kVG8oY29zdFRvb2x0aXApO1xyXG5cdFx0XHRcdCQoXCI8ZGl2PlwiKS5hZGRDbGFzcygncm93X3ZhbCcpLnRleHQob3B0aW9ucy5jb3N0W2tdKS5hcHBlbmRUbyhjb3N0VG9vbHRpcCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY29zdFRvb2x0aXAuY2hpbGRyZW4oKS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0Y29zdFRvb2x0aXAuYXBwZW5kVG8oZWwpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmKG9wdGlvbnMud2lkdGgpIHtcclxuXHRcdFx0ZWwuY3NzKCd3aWR0aCcsIG9wdGlvbnMud2lkdGgpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gZWw7XHJcblx0fSxcclxuXHRcclxuXHRzZXREaXNhYmxlZDogZnVuY3Rpb24oYnRuLCBkaXNhYmxlZCkge1xyXG5cdFx0aWYoYnRuKSB7XHJcblx0XHRcdGlmKCFkaXNhYmxlZCAmJiAhYnRuLmRhdGEoJ29uQ29vbGRvd24nKSkge1xyXG5cdFx0XHRcdGJ0bi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdFx0fSBlbHNlIGlmKGRpc2FibGVkKSB7XHJcblx0XHRcdFx0YnRuLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGJ0bi5kYXRhKCdkaXNhYmxlZCcsIGRpc2FibGVkKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGlzRGlzYWJsZWQ6IGZ1bmN0aW9uKGJ0bikge1xyXG5cdFx0aWYoYnRuKSB7XHJcblx0XHRcdHJldHVybiBidG4uZGF0YSgnZGlzYWJsZWQnKSA9PT0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cdFxyXG5cdGNvb2xkb3duOiBmdW5jdGlvbihidG4pIHtcclxuXHRcdHZhciBjZCA9IGJ0bi5kYXRhKFwiY29vbGRvd25cIik7XHJcblx0XHRpZihjZCA+IDApIHtcclxuXHRcdFx0JCgnZGl2LmNvb2xkb3duJywgYnRuKS5zdG9wKHRydWUsIHRydWUpLndpZHRoKFwiMTAwJVwiKS5hbmltYXRlKHt3aWR0aDogJzAlJ30sIGNkICogMTAwMCwgJ2xpbmVhcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBiID0gJCh0aGlzKS5jbG9zZXN0KCcuYnV0dG9uJyk7XHJcblx0XHRcdFx0Yi5kYXRhKCdvbkNvb2xkb3duJywgZmFsc2UpO1xyXG5cdFx0XHRcdGlmKCFiLmRhdGEoJ2Rpc2FibGVkJykpIHtcclxuXHRcdFx0XHRcdGIucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0YnRuLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHRidG4uZGF0YSgnb25Db29sZG93bicsIHRydWUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0Y2xlYXJDb29sZG93bjogZnVuY3Rpb24oYnRuKSB7XHJcblx0XHQkKCdkaXYuY29vbGRvd24nLCBidG4pLnN0b3AodHJ1ZSwgdHJ1ZSk7XHJcblx0XHRidG4uZGF0YSgnb25Db29sZG93bicsIGZhbHNlKTtcclxuXHRcdGlmKCFidG4uZGF0YSgnZGlzYWJsZWQnKSkge1xyXG5cdFx0XHRidG4ucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHR9XHJcblx0fVxyXG59OyIsImltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIlxyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiXHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiXHJcblxyXG5leHBvcnQgY29uc3QgQ2FwdGFpbiA9IHtcclxuXHR0YWxrVG9DYXB0YWluOiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ1RoZSBDYXB0YWluXFwncyBUZW50JyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VlbkZsYWc6ICgpID0+ICRTTS5nZXQoJ291dHBvc3QuY2FwdGFpbi5oYXZlTWV0JyksXHJcblx0XHRcdFx0XHRuZXh0U2NlbmU6ICdtYWluJyxcclxuXHRcdFx0XHRcdG9uTG9hZDogKCkgPT4gJFNNLnNldCgnb3V0cG9zdC5jYXB0YWluLmhhdmVNZXQnLCAxKSxcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnWW91IGVudGVyIHRoZSBmYW5jaWVzdC1sb29raW5nIHRlbnQgaW4gdGhlIE91dHBvc3QuIEEgbGFyZ2UgbWFuIHdpdGggYSB0b290aGJydXNoIG11c3RhY2hlIGFuZCBhIHNldmVyZSBmcm93biBsb29rcyB1cCBmcm9tIGhpcyBkZXNrLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIlNpciwgeW91IGhhdmUgZW50ZXJlZCB0aGUgdGVudCBvZiBDYXB0YWluIEZpbm5lYXMuIFdoYXQgYnVzaW5lc3MgZG8geW91IGhhdmUgaGVyZT9cIicpXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhc2tBYm91dFN1cHBsaWVzJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnQXNrIEFib3V0IFN1cHBsaWVzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOiAnYXNrQWJvdXRTdXBwbGllcyd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhc2tBYm91dENhcHRhaW4nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBc2sgQWJvdXQgQ2FwdGFpbicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTogJ2NhcHRhaW5SYW1ibGUnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnbGVhdmUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdMZWF2ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICdtYWluJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnVGhlIGNhcHRhaW4gZ3JlZXRzIHlvdSB3YXJtbHkuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiQWhoLCB5ZXMsIHdlbGNvbWUgYmFjay4gV2hhdCBjYW4gSSBkbyBmb3IgeW91P1wiJylcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Fza0Fib3V0U3VwcGxpZXMnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBc2sgQWJvdXQgU3VwcGxpZXMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6J2Fza0Fib3V0U3VwcGxpZXMnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZTogKCkgPT4gISRTTS5nZXQoJ291dHBvc3QuY2FwdGFpbi5hc2tlZEFib3V0U3VwcGxpZXMnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXNrQWJvdXRDYXB0YWluJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnQXNrIEFib3V0IENhcHRhaW4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6J2NhcHRhaW5SYW1ibGUnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnbGVhdmUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdMZWF2ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICdjYXB0YWluUmFtYmxlJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnVGhlIGNhcHRhaW5cXCdzIGV5ZXMgZ2xlYW0gYXQgdGhlIG9wcG9ydHVuaXR5IHRvIHJ1biBkb3duIGhpcyBsaXN0IG9mIGFjaGlldmVtZW50cy4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCJXaHksIElcXCdsbCBoYXZlIHlvdSBrbm93IHRoYXQgeW91IHN0YW5kIGluIHRoZSBwcmVzZW5jZSBvZiBub25lIG90aGVyIHRoYW4gRmlubmVhcyBKLiBGb2JzbGV5LCBDYXB0YWluIG9mIHRoZSBSb3lhbCBBcm15XFwncyBGaWZ0aCBEaXZpc2lvbiwgdGhlIGZpbmVzdCBEaXZpc2lvbiBpbiBIaXMgTWFqZXN0eVxcJ3Mgc2VydmljZS5cIicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdIZSBwdWZmcyBvdXQgaGlzIGNoZXN0LCBkcmF3aW5nIGF0dGVudGlvbiB0byBoaXMgbWFueSBtZWRhbHMuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiSSBoYXZlIGNhbXBhaWduZWQgb24gYmVoYWxmIG9mIE91ciBMb3Jkc2hpcCBhY3Jvc3MgbWFueSBsYW5kcywgaW5jbHVkaW5nIFRoZSBGYXIgV2VzdCwgdGhlIG5vcnRoZXJuIGJvcmRlcnMgb2YgVW1iZXJzaGlyZSBhbmQgUGVsaW5nYWwsIE5ldyBCZWxsaXNpYSwgYW5kIGVhY2ggb2YgdGhlIEZpdmUgSXNsZXMgb2YgdGhlIFBpcnJoaWFuIFNlYS5cIicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdIZSBwYXVzZXMgZm9yIGEgbW9tZW50LCBwZXJoYXBzIHRvIHNlZSBpZiB5b3UgYXJlIHN1aXRhYmx5IGltcHJlc3NlZCwgdGhlbiBjb250aW51ZXMuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiQXMgQ2FwdGFpbiBvZiB0aGUgRmlmdGggRGl2aXNpb24sIEkgaGFkIHRoZSBlc3RlZW1lZCBwcml2aWxlZ2Ugb2YgZW5zdXJpbmcgdGhlIHNhZmV0eSBvZiB0aGVzZSBsYW5kcyBmb3Igb3VyIGZhaXIgY2l0aXplbnMuIEkgaGF2ZSBiZWVuIGF3YXJkZWQgbWFueSB0aW1lcyBvdmVyIGZvciBteSBicmF2ZXJ5IGluIHRoZSBmYWNlIG9mIHV0bW9zdCBwZXJpbC4gRm9yIGluc3RhbmNlLCBkdXJpbmcgdGhlIFNlYSBDYW1wYWlnbiBvbiBUaHlwcGUsIFRoaXJkIG9mIHRoZSBGaXZlIElzbGVzLCB3ZSB3ZXJlIGFtYnVzaGVkIHdoaWxlIGRpc2VtYmFya2luZyBmcm9tIG91ciBzaGlwLiBUaGlua2luZyBxdWlja2x5LCBJLi4uXCInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnVGhlIGNhcHRhaW4gY29udGludWVzIHRvIHJhbWJsZSBsaWtlIHRoaXMgZm9yIHNldmVyYWwgbW9yZSBtaW51dGVzLCBnaXZpbmcgeW91IHRpbWUgdG8gYmVjb21lIG11Y2ggbW9yZSBmYW1pbGlhciB3aXRoIHRoZSBkaXJ0IHVuZGVyIHlvdXIgZmluZ2VybmFpbHMuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiLi4uIGFuZCBUSEFULCBteSBnb29kIGFkdmVudHVyZXIsIGlzIHdoeSBJIGFsd2F5cyBrZWVwIGZyZXNoIGJhc2lsIG9uIGhhbmQuXCInKVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnZmFzY2luYXRpbmcnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdGYXNjaW5hdGluZycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTonbWFpbkNvbnRpbnVlZCd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgJ21haW5Db250aW51ZWQnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdUaGUgY2FwdGFpbiBzaHVmZmxlcyBoaXMgcGFwZXJzIGluIGEgc29tZXdoYXQgcGVyZm9ybWF0aXZlIHdheS4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCJXYXMgdGhlcmUgc29tZXRoaW5nIGVsc2UgeW91IG5lZWRlZD9cIicpXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhc2tBYm91dFN1cHBsaWVzJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnQXNrIEFib3V0IFN1cHBsaWVzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOidhc2tBYm91dFN1cHBsaWVzJ30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGU6ICgpID0+ICEkU00uZ2V0KCdvdXRwb3N0LmNhcHRhaW4uYXNrZWRBYm91dFN1cHBsaWVzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Fza0Fib3V0Q2FwdGFpbic6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FzayBBYm91dCBDYXB0YWluJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOidjYXB0YWluUmFtYmxlJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnTGVhdmUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAnYXNrQWJvdXRTdXBwbGllcyc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ0kgc3RpbGwgbmVlZCB0byB3cml0ZSB0aGlzLCBjaGVjayBiYWNrIGxhdGVyLiAtQycpXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnQWl0ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IFJvb20gfSBmcm9tIFwiLi4vcGxhY2VzL3Jvb21cIjtcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4uL3BsYXllci9jaGFyYWN0ZXJcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBMaXogPSB7XHJcbiAgICBzZXRMaXpBY3RpdmU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0JFNNLnNldCgndmlsbGFnZS5saXpBY3RpdmUnLCAxKTtcclxuXHRcdCRTTS5zZXQoJ3ZpbGxhZ2UubGl6LmNhbkZpbmRCb29rJywgMCk7XHJcblx0XHQkU00uc2V0KCd2aWxsYWdlLmxpei5oYXNCb29rJywgMSk7XHJcblx0XHRSb29tLnVwZGF0ZUJ1dHRvbigpO1xyXG5cdH0sXHJcblxyXG5cdHRhbGtUb0xpejogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdMaXpcXCdzIGhvdXNlLCBhdCB0aGUgZWRnZSBvZiB0b3duJyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHRzZWVuRmxhZzogKCkgPT4gJFNNLmdldCgndmlsbGFnZS5saXouaGF2ZU1ldCcpLFxyXG5cdFx0XHRcdFx0bmV4dFNjZW5lOiAnbWFpbicsXHJcblx0XHRcdFx0XHRvbkxvYWQ6ICgpID0+ICRTTS5zZXQoJ3ZpbGxhZ2UubGl6LmhhdmVNZXQnLCAxKSxcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnWW91IGVudGVyIHRoZSBidWlsZGluZyBhbmQgYXJlIGltbWVkaWF0ZWx5IHBsdW5nZWQgaW50byBhIGxhYnlyaW50aCBvZiBzaGVsdmVzIGhhcGhhemFyZGx5IGZpbGxlZCB3aXRoIGJvb2tzIG9mIGFsbCBraW5kcy4gQWZ0ZXIgYSBiaXQgb2Ygc2VhcmNoaW5nLCB5b3UgZmluZCBhIHNpZGUgcm9vbSB3aGVyZSBhIHdvbWFuIHdpdGggbW91c3kgaGFpciBhbmQgZ2xhc3NlcyBpcyBzaXR0aW5nIGF0IGEgd3JpdGluZyBkZXNrLiBTaGVcXCdzIHJlYWRpbmcgYSBsYXJnZSBib29rIHRoYXQgYXBwZWFycyB0byBpbmNsdWRlIGRpYWdyYW1zIG9mIHNvbWUgc29ydCBvZiBwbGFudC4gU2hlIGxvb2tzIHVwIGFzIHlvdSBlbnRlciB0aGUgcm9vbS4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJXaG8gdGhlIGhlbGwgYXJlIHlvdT9cIicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnYXNrQWJvdXRUb3duJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBhYm91dCBDaGFkdG9waWEnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnY2hhZHRvcGlhUmFtYmxlJ31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J3F1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBmb3IgYSBxdWVzdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdxdWVzdFJlcXVlc3QnfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnbGVhdmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnTGVhdmUnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdjaGFkdG9waWFSYW1ibGUnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ0xpeiBsb29rcyBhdCB5b3UgZm9yIGEgbW9tZW50IGJlZm9yZSByZXR1cm5pbmcgaGVyIGdhemUgdG8gdGhlIGJvb2sgaW4gZnJvbnQgb2YgaGVyLicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIlRoZXJlXFwncyBhIGJvb2sgaW4gaGVyZSBzb21ld2hlcmUgYWJvdXQgdGhlIGZvdW5kaW5nIG9mIENoYWR0b3BpYS4gSWYgeW91IGNhbiBmaW5kIGl0LCB5b3VcXCdyZSBmcmVlIHRvIGJvcnJvdyBpdC5cIicpXSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J29rYXknOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnT2theSwgdGhlbi4nKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnbWFpbid9LFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiAoKSA9PiAkU00uc2V0KCd2aWxsYWdlLmxpei5jYW5GaW5kQm9vaycsIHRydWUpXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cclxuXHRcdFx0XHQnbWFpbic6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtfKCdMaXogc2VlbXMgZGV0ZXJtaW5lZCBub3QgdG8gcGF5IGF0dGVudGlvbiB0byB5b3UuJyldLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnYXNrQWJvdXRUb3duJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBhYm91dCBDaGFkdG9waWEnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnY2hhZHRvcGlhUmFtYmxlJ30sXHJcblx0XHRcdFx0XHRcdFx0YXZhaWxhYmxlOiAoKSA9PiAhJFNNLmdldCgndmlsbGFnZS5saXouY2FuRmluZEJvb2snKVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQncXVlc3QnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGZvciBhIHF1ZXN0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ3F1ZXN0UmVxdWVzdCd9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdmaW5kQm9vayc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdUcnkgdG8gZmluZCB0aGUgYm9vaycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdmaW5kQm9vayd9LFxyXG5cdFx0XHRcdFx0XHRcdC8vIFRPRE86IGEgXCJ2aXNpYmxlXCIgZmxhZyB3b3VsZCBiZSBnb29kIGhlcmUsIGZvciBzaXR1YXRpb25zIHdoZXJlIGFuIG9wdGlvblxyXG5cdFx0XHRcdFx0XHRcdC8vICAgaXNuJ3QgeWV0IGtub3duIHRvIHRoZSBwbGF5ZXJcclxuXHRcdFx0XHRcdFx0XHR2aXNpYmxlOiAoKSA9PiAkU00uZ2V0KCd2aWxsYWdlLmxpei5jYW5GaW5kQm9vaycpLFxyXG5cdFx0XHRcdFx0XHRcdGF2YWlsYWJsZTogKCkgPT4gKCRTTS5nZXQoJ3ZpbGxhZ2UubGl6LmNhbkZpbmRCb29rJykgYXMgbnVtYmVyID4gMCkgJiYgKCRTTS5nZXQoJ3ZpbGxhZ2UubGl6Lmhhc0Jvb2snKSlcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0xlYXZlJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnZmluZEJvb2snOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ0xlYXZpbmcgTGl6IHRvIGhlciBidXNpbmVzcywgeW91IHdhbmRlciBhcm91bmQgYW1pZHN0IHRoZSBib29rcywgd29uZGVyaW5nIGhvdyB5b3VcXCdsbCBldmVyIG1hbmFnZSB0byBmaW5kIHdoYXQgeW91XFwncmUgbG9va2luZyBmb3IgaW4gYWxsIHRoaXMgdW5vcmdhbml6ZWQgbWVzcy4nKSxcclxuXHRcdFx0XHRcdFx0XygnRm9ydHVuYXRlbHksIHRoZSBjcmVhdG9yIG9mIHRoaXMgZ2FtZSBkb2VzblxcJ3QgZmVlbCBsaWtlIGl0XFwnZCBiZSB2ZXJ5IGludGVyZXN0aW5nIHRvIG1ha2UgdGhpcyBpbnRvIGEgcHV6emxlLCBzbyB5b3Ugc3BvdCB0aGUgYm9vayBvbiBhIG5lYXJieSBzaGVsZiBhbmQgZ3JhYiBpdC4nKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J3NpY2snOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnT2gsIHNpY2snKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiAoKSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyAkU00uc2V0KCdzdG9yZXMuV2VpcmQgQm9vaycsIDEpO1xyXG5cdFx0XHRcdFx0XHRcdFx0Q2hhcmFjdGVyLmFkZFRvSW52ZW50b3J5KFwiTGl6LndlaXJkQm9va1wiKTtcclxuXHRcdFx0XHRcdFx0XHRcdCRTTS5zZXQoJ3ZpbGxhZ2UubGl6Lmhhc0Jvb2snLCAwKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdxdWVzdFJlcXVlc3QnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ0xpeiBsZXRzIG91dCBhbiBhbm5veWVkIHNpZ2guJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiT2ggYnJhdmUgYWR2ZW50dXJlciwgSSBzZWVtIHRvIGhhdmUgbG9zdCBteSBwYXRpZW5jZS4gV2hlbiBsYXN0IEkgc2F3IGl0LCBpdCB3YXMgc29tZXdoZXJlIG91dHNpZGUgb2YgdGhpcyBidWlsZGluZy4gV291bGRzdCB0aG91IHJlY292ZXIgdGhhdCB3aGljaCBoYXMgYmVlbiBzdG9sZW4gZnJvbSBtZT9cIicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnb2theSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdPa2F5LCBqZWV6LCBJIGdldCBpdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdtYWluJ31cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG59IiwiaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgTGl6IH0gZnJvbSBcIi4vbGl6XCI7XHJcbmltcG9ydCB7IFJvYWQgfSBmcm9tIFwiLi4vcGxhY2VzL3JvYWRcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBNYXlvciA9IHtcclxuICAgIHRhbGtUb01heW9yOiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ01lZXQgdGhlIE1heW9yJyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHRzZWVuRmxhZzogKCkgPT4gJFNNLmdldCgndmlsbGFnZS5tYXlvci5oYXZlTWV0JyksXHJcblx0XHRcdFx0XHRuZXh0U2NlbmU6ICdtYWluJyxcclxuXHRcdFx0XHRcdG9uTG9hZDogKCkgPT4gJFNNLnNldCgndmlsbGFnZS5tYXlvci5oYXZlTWV0JywgMSksXHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1RoZSBtYXlvciBzbWlsZXMgYXQgeW91IGFuZCBzYXlzOicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIldlbGNvbWUgdG8gQ2hhZHRvcGlhLCBJXFwnbSB0aGUgbWF5b3Igb2YgdGhlc2UgaGVyZSBwYXJ0cy4gV2hhdCBjYW4gSSBkbyB5b3UgZm9yP1wiJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdhc2tBYm91dFRvd24nOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGFib3V0IENoYWR0b3BpYScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdjaGFkdG9waWFSYW1ibGUnfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQncXVlc3QnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGZvciBhIHF1ZXN0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ3F1ZXN0J31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0xlYXZlJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnY2hhZHRvcGlhUmFtYmxlJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdUaGUgbWF5b3IgcHVzaGVzIHRoZSBicmltIG9mIGhpcyBoYXQgdXAuJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiV2VsbCwgd2VcXCd2ZSBhbHdheXMgYmVlbiBoZXJlLCBsb25nIGFzIEkgY2FuIHJlbWVtYmVyLiBJIHRvb2sgb3ZlciBhZnRlciB0aGUgbGFzdCBtYXlvciBkaWVkLCBidXQgaGUgd291bGQgaGF2ZSBiZWVuIHRoZSBvbmx5IHBlcnNvbiB3aXRoIGFueSBoaXN0b3JpY2FsIGtub3dsZWRnZSBvZiB0aGlzIHZpbGxhZ2UuXCInKSxcclxuXHRcdFx0XHRcdFx0XygnSGUgcGF1c2VzIGZvciBhIG1vbWVudCBhbmQgdG91c2xlcyBzb21lIG9mIHRoZSB3aXNweSBoYWlycyB0aGF0IGhhdmUgcG9rZWQgb3V0IGZyb20gdW5kZXIgdGhlIHJhaXNlZCBoYXQuJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiQWN0dWFsbHksIHlvdSBtaWdodCBhc2sgTGl6LCBzaGUgaGFzIGEgYnVuY2ggb2YgaGVyIG1vdGhlclxcJ3MgYm9va3MgZnJvbSB3YXkgYmFjayB3aGVuLiBTaGUgbGl2ZXMgYXQgdGhlIGVkZ2Ugb2YgdG93bi5cIicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnb2theSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdPa2F5LCB0aGVuLicpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdtYWluJ30sXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IExpei5zZXRMaXpBY3RpdmVcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J21haW4nOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1RoZSBtYXlvciBzYXlzOicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIkFueXdheSwgd2hhdCBFTFNFIGNhbiBJIGRvIHlvdSBmb3I/XCInKSxcclxuXHRcdFx0XHRcdFx0XygnSGUgY2h1Y2tsZXMgYXQgaGlzIGNsZXZlciB1c2Ugb2YgbGFuZ3VhZ2UuJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdhc2tBYm91dFRvd24nOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGFib3V0IENoYWR0b3BpYScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdjaGFkdG9waWFSYW1ibGUnfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQncXVlc3QnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnQXNrIGZvciBhIHF1ZXN0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ3F1ZXN0J31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0xlYXZlJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQncXVlc3QnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1RoZSBtYXlvciB0aGlua3MgZm9yIGEgbW9tZW50LicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIllvdSBrbm93LCBpdFxcJ3MgYmVlbiBhIHdoaWxlIHNpbmNlIG91ciBsYXN0IHNoaXBtZW50IG9mIHN1cHBsaWVzIGFycml2ZWQgZnJvbSB0aGUgb3V0cG9zdC4gTWluZCBsb29raW5nIGludG8gdGhhdCBmb3IgdXM/XCInKSxcclxuXHRcdFx0XHRcdFx0XygnXCJZb3UgY2FuIGFzayBhYm91dCBpdCBhdCB0aGUgb3V0cG9zdCwgb3IganVzdCB3YW5kZXIgYXJvdW5kIG9uIHRoZSByb2FkIGFuZCBzZWUgaWYgeW91IGZpbmQgYW55IGNsdWVzLiBFaXRoZXIgd2F5LCBpdFxcJ3MgdGltZSB0byBoaXQgdGhlIHJvYWQsIGFkdmVudHVyZXIhXCInKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2FscmlnaHR5Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FscmlnaHR5JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ21haW4nfSxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogTWF5b3Iuc3RhcnRTdXBwbGllc1F1ZXN0XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0c3RhcnRTdXBwbGllc1F1ZXN0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAoISRTTS5nZXQoJ3F1ZXN0LnN1cHBsaWVzJykpIHtcclxuXHRcdFx0Ly8gMSA9IHN0YXJ0ZWQsIDIgPSBuZXh0IHN0ZXAsIGV0Yy4gdW50aWwgY29tcGxldGVkXHJcblx0XHRcdCRTTS5zZXQoJ3F1ZXN0LnN1cHBsaWVzJywgMSk7XHJcblx0XHRcdFJvYWQuaW5pdCgpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0fVxyXG59IiwiLy8gQHRzLW5vY2hlY2tcclxuXHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tIFwiLi9ub3RpZmljYXRpb25zXCI7XHJcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuL2V2ZW50c1wiO1xyXG5pbXBvcnQgeyBSb29tIH0gZnJvbSBcIi4vcGxhY2VzL3Jvb21cIjtcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSBcIi4vcGxheWVyL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgeyBXZWF0aGVyIH0gZnJvbSBcIi4vd2VhdGhlclwiO1xyXG5pbXBvcnQgeyBSb2FkIH0gZnJvbSBcIi4vcGxhY2VzL3JvYWRcIjtcclxuaW1wb3J0IHsgT3V0cG9zdCB9IGZyb20gXCIuL3BsYWNlcy9vdXRwb3N0XCI7XHJcblxyXG5leHBvcnQgY29uc3QgRW5naW5lID0gd2luZG93LkVuZ2luZSA9IHtcclxuXHRcclxuXHRTSVRFX1VSTDogZW5jb2RlVVJJQ29tcG9uZW50KFwiaHR0cDovL2FkYXJrcm9vbS5kb3VibGVzcGVha2dhbWVzLmNvbVwiKSxcclxuXHRWRVJTSU9OOiAxLjMsXHJcblx0TUFYX1NUT1JFOiA5OTk5OTk5OTk5OTk5OSxcclxuXHRTQVZFX0RJU1BMQVk6IDMwICogMTAwMCxcclxuXHRHQU1FX09WRVI6IGZhbHNlLFxyXG5cdFxyXG5cdC8vb2JqZWN0IGV2ZW50IHR5cGVzXHJcblx0dG9waWNzOiB7fSxcclxuXHRcdFxyXG5cdFBlcmtzOiB7XHJcblx0XHQnYm94ZXInOiB7XHJcblx0XHRcdG5hbWU6IF8oJ2JveGVyJyksXHJcblx0XHRcdGRlc2M6IF8oJ3B1bmNoZXMgZG8gbW9yZSBkYW1hZ2UnKSxcclxuXHRcdFx0Ly8vIFRSQU5TTEFUT1JTIDogbWVhbnMgd2l0aCBtb3JlIGZvcmNlLlxyXG5cdFx0XHRub3RpZnk6IF8oJ2xlYXJuZWQgdG8gdGhyb3cgcHVuY2hlcyB3aXRoIHB1cnBvc2UnKVxyXG5cdFx0fSxcclxuXHRcdCdtYXJ0aWFsIGFydGlzdCc6IHtcclxuXHRcdFx0bmFtZTogXygnbWFydGlhbCBhcnRpc3QnKSxcclxuXHRcdFx0ZGVzYzogXygncHVuY2hlcyBkbyBldmVuIG1vcmUgZGFtYWdlLicpLFxyXG5cdFx0XHRub3RpZnk6IF8oJ2xlYXJuZWQgdG8gZmlnaHQgcXVpdGUgZWZmZWN0aXZlbHkgd2l0aG91dCB3ZWFwb25zJylcclxuXHRcdH0sXHJcblx0XHQndW5hcm1lZCBtYXN0ZXInOiB7XHJcblx0XHRcdC8vLyBUUkFOU0xBVE9SUyA6IG1hc3RlciBvZiB1bmFybWVkIGNvbWJhdFxyXG5cdFx0XHRuYW1lOiBfKCd1bmFybWVkIG1hc3RlcicpLFxyXG5cdFx0XHRkZXNjOiBfKCdwdW5jaCB0d2ljZSBhcyBmYXN0LCBhbmQgd2l0aCBldmVuIG1vcmUgZm9yY2UnKSxcclxuXHRcdFx0bm90aWZ5OiBfKCdsZWFybmVkIHRvIHN0cmlrZSBmYXN0ZXIgd2l0aG91dCB3ZWFwb25zJylcclxuXHRcdH0sXHJcblx0XHQnYmFyYmFyaWFuJzoge1xyXG5cdFx0XHRuYW1lOiBfKCdiYXJiYXJpYW4nKSxcclxuXHRcdFx0ZGVzYzogXygnbWVsZWUgd2VhcG9ucyBkZWFsIG1vcmUgZGFtYWdlJyksXHJcblx0XHRcdG5vdGlmeTogXygnbGVhcm5lZCB0byBzd2luZyB3ZWFwb25zIHdpdGggZm9yY2UnKVxyXG5cdFx0fSxcclxuXHRcdCdzbG93IG1ldGFib2xpc20nOiB7XHJcblx0XHRcdG5hbWU6IF8oJ3Nsb3cgbWV0YWJvbGlzbScpLFxyXG5cdFx0XHRkZXNjOiBfKCdnbyB0d2ljZSBhcyBmYXIgd2l0aG91dCBlYXRpbmcnKSxcclxuXHRcdFx0bm90aWZ5OiBfKCdsZWFybmVkIGhvdyB0byBpZ25vcmUgdGhlIGh1bmdlcicpXHJcblx0XHR9LFxyXG5cdFx0J2Rlc2VydCByYXQnOiB7XHJcblx0XHRcdG5hbWU6IF8oJ2Rlc2VydCByYXQnKSxcclxuXHRcdFx0ZGVzYzogXygnZ28gdHdpY2UgYXMgZmFyIHdpdGhvdXQgZHJpbmtpbmcnKSxcclxuXHRcdFx0bm90aWZ5OiBfKCdsZWFybmVkIHRvIGxvdmUgdGhlIGRyeSBhaXInKVxyXG5cdFx0fSxcclxuXHRcdCdldmFzaXZlJzoge1xyXG5cdFx0XHRuYW1lOiBfKCdldmFzaXZlJyksXHJcblx0XHRcdGRlc2M6IF8oJ2RvZGdlIGF0dGFja3MgbW9yZSBlZmZlY3RpdmVseScpLFxyXG5cdFx0XHRub3RpZnk6IF8oXCJsZWFybmVkIHRvIGJlIHdoZXJlIHRoZXkncmUgbm90XCIpXHJcblx0XHR9LFxyXG5cdFx0J3ByZWNpc2UnOiB7XHJcblx0XHRcdG5hbWU6IF8oJ3ByZWNpc2UnKSxcclxuXHRcdFx0ZGVzYzogXygnbGFuZCBibG93cyBtb3JlIG9mdGVuJyksXHJcblx0XHRcdG5vdGlmeTogXygnbGVhcm5lZCB0byBwcmVkaWN0IHRoZWlyIG1vdmVtZW50JylcclxuXHRcdH0sXHJcblx0XHQnc2NvdXQnOiB7XHJcblx0XHRcdG5hbWU6IF8oJ3Njb3V0JyksXHJcblx0XHRcdGRlc2M6IF8oJ3NlZSBmYXJ0aGVyJyksXHJcblx0XHRcdG5vdGlmeTogXygnbGVhcm5lZCB0byBsb29rIGFoZWFkJylcclxuXHRcdH0sXHJcblx0XHQnc3RlYWx0aHknOiB7XHJcblx0XHRcdG5hbWU6IF8oJ3N0ZWFsdGh5JyksXHJcblx0XHRcdGRlc2M6IF8oJ2JldHRlciBhdm9pZCBjb25mbGljdCBpbiB0aGUgd2lsZCcpLFxyXG5cdFx0XHRub3RpZnk6IF8oJ2xlYXJuZWQgaG93IG5vdCB0byBiZSBzZWVuJylcclxuXHRcdH0sXHJcblx0XHQnZ2FzdHJvbm9tZSc6IHtcclxuXHRcdFx0bmFtZTogXygnZ2FzdHJvbm9tZScpLFxyXG5cdFx0XHRkZXNjOiBfKCdyZXN0b3JlIG1vcmUgaGVhbHRoIHdoZW4gZWF0aW5nJyksXHJcblx0XHRcdG5vdGlmeTogXygnbGVhcm5lZCB0byBtYWtlIHRoZSBtb3N0IG9mIGZvb2QnKVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0b3B0aW9uczoge1xyXG5cdFx0c3RhdGU6IG51bGwsXHJcblx0XHRkZWJ1ZzogdHJ1ZSxcclxuXHRcdGxvZzogdHJ1ZSxcclxuXHRcdGRyb3Bib3g6IGZhbHNlLFxyXG5cdFx0ZG91YmxlVGltZTogZmFsc2VcclxuXHR9LFxyXG5cclxuXHRfZGVidWc6IGZhbHNlLFxyXG5cdFx0XHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblx0XHR0aGlzLl9kZWJ1ZyA9IHRoaXMub3B0aW9ucy5kZWJ1ZztcclxuXHRcdHRoaXMuX2xvZyA9IHRoaXMub3B0aW9ucy5sb2c7XHJcblx0XHRcclxuXHRcdC8vIENoZWNrIGZvciBIVE1MNSBzdXBwb3J0XHJcblx0XHRpZighRW5naW5lLmJyb3dzZXJWYWxpZCgpKSB7XHJcblx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9ICdicm93c2VyV2FybmluZy5odG1sJztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gQ2hlY2sgZm9yIG1vYmlsZVxyXG5cdFx0aWYoRW5naW5lLmlzTW9iaWxlKCkpIHtcclxuXHRcdFx0d2luZG93LmxvY2F0aW9uID0gJ21vYmlsZVdhcm5pbmcuaHRtbCc7XHJcblx0XHR9XHJcblxyXG5cdFx0RW5naW5lLmRpc2FibGVTZWxlY3Rpb24oKTtcclxuXHRcdFxyXG5cdFx0aWYodGhpcy5vcHRpb25zLnN0YXRlICE9IG51bGwpIHtcclxuXHRcdFx0d2luZG93LlN0YXRlID0gdGhpcy5vcHRpb25zLnN0YXRlO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0RW5naW5lLmxvYWRHYW1lKCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnbG9jYXRpb25TbGlkZXInKS5hcHBlbmRUbygnI21haW4nKTtcclxuXHJcblx0XHR2YXIgbWVudSA9ICQoJzxkaXY+JylcclxuXHRcdFx0LmFkZENsYXNzKCdtZW51JylcclxuXHRcdFx0LmFwcGVuZFRvKCdib2R5Jyk7XHJcblxyXG5cdFx0aWYodHlwZW9mIGxhbmdzICE9ICd1bmRlZmluZWQnKXtcclxuXHRcdFx0dmFyIGN1c3RvbVNlbGVjdCA9ICQoJzxzcGFuPicpXHJcblx0XHRcdFx0LmFkZENsYXNzKCdjdXN0b21TZWxlY3QnKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnbWVudUJ0bicpXHJcblx0XHRcdFx0LmFwcGVuZFRvKG1lbnUpO1xyXG5cdFx0XHR2YXIgc2VsZWN0T3B0aW9ucyA9ICQoJzxzcGFuPicpXHJcblx0XHRcdFx0LmFkZENsYXNzKCdjdXN0b21TZWxlY3RPcHRpb25zJylcclxuXHRcdFx0XHQuYXBwZW5kVG8oY3VzdG9tU2VsZWN0KTtcclxuXHRcdFx0dmFyIG9wdGlvbnNMaXN0ID0gJCgnPHVsPicpXHJcblx0XHRcdFx0LmFwcGVuZFRvKHNlbGVjdE9wdGlvbnMpO1xyXG5cdFx0XHQkKCc8bGk+JylcclxuXHRcdFx0XHQudGV4dChcImxhbmd1YWdlLlwiKVxyXG5cdFx0XHRcdC5hcHBlbmRUbyhvcHRpb25zTGlzdCk7XHJcblx0XHRcdFxyXG5cdFx0XHQkLmVhY2gobGFuZ3MsIGZ1bmN0aW9uKG5hbWUsZGlzcGxheSl7XHJcblx0XHRcdFx0JCgnPGxpPicpXHJcblx0XHRcdFx0XHQudGV4dChkaXNwbGF5KVxyXG5cdFx0XHRcdFx0LmF0dHIoJ2RhdGEtbGFuZ3VhZ2UnLCBuYW1lKVxyXG5cdFx0XHRcdFx0Lm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7IEVuZ2luZS5zd2l0Y2hMYW5ndWFnZSh0aGlzKTsgfSlcclxuXHRcdFx0XHRcdC5hcHBlbmRUbyhvcHRpb25zTGlzdCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdCQoJzxzcGFuPicpXHJcblx0XHRcdC5hZGRDbGFzcygnbGlnaHRzT2ZmIG1lbnVCdG4nKVxyXG5cdFx0XHQudGV4dChfKCdsaWdodHMgb2ZmLicpKVxyXG5cdFx0XHQuY2xpY2soRW5naW5lLnR1cm5MaWdodHNPZmYpXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHQudGV4dChfKCdoeXBlci4nKSlcclxuXHRcdFx0LmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0RW5naW5lLm9wdGlvbnMuZG91YmxlVGltZSA9ICFFbmdpbmUub3B0aW9ucy5kb3VibGVUaW1lO1xyXG5cdFx0XHRcdGlmKEVuZ2luZS5vcHRpb25zLmRvdWJsZVRpbWUpXHJcblx0XHRcdFx0XHQkKHRoaXMpLnRleHQoXygnY2xhc3NpYy4nKSk7XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0JCh0aGlzKS50ZXh0KF8oJ2h5cGVyLicpKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0LmFwcGVuZFRvKG1lbnUpO1xyXG5cclxuXHRcdCQoJzxzcGFuPicpXHJcblx0XHRcdC5hZGRDbGFzcygnbWVudUJ0bicpXHJcblx0XHRcdC50ZXh0KF8oJ3Jlc3RhcnQuJykpXHJcblx0XHRcdC5jbGljayhFbmdpbmUuY29uZmlybURlbGV0ZSlcclxuXHRcdFx0LmFwcGVuZFRvKG1lbnUpO1xyXG5cdFx0XHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHQudGV4dChfKCdzaGFyZS4nKSlcclxuXHRcdFx0LmNsaWNrKEVuZ2luZS5zaGFyZSlcclxuXHRcdFx0LmFwcGVuZFRvKG1lbnUpO1xyXG5cclxuXHRcdCQoJzxzcGFuPicpXHJcblx0XHRcdC5hZGRDbGFzcygnbWVudUJ0bicpXHJcblx0XHRcdC50ZXh0KF8oJ3NhdmUuJykpXHJcblx0XHRcdC5jbGljayhFbmdpbmUuZXhwb3J0SW1wb3J0KVxyXG5cdFx0XHQuYXBwZW5kVG8obWVudSk7XHJcblx0XHRcclxuXHRcdCQoJzxzcGFuPicpXHJcblx0XHRcdC5hZGRDbGFzcygnbWVudUJ0bicpXHJcblx0XHRcdC50ZXh0KF8oJ2FwcCBzdG9yZS4nKSlcclxuXHRcdFx0LmNsaWNrKGZ1bmN0aW9uKCkgeyB3aW5kb3cub3BlbignaHR0cHM6Ly9pdHVuZXMuYXBwbGUuY29tL3VzL2FwcC9hLWRhcmstcm9vbS9pZDczNjY4MzA2MScpOyB9KVxyXG5cdFx0XHQuYXBwZW5kVG8obWVudSk7XHJcblxyXG5cdFx0JCgnPHNwYW4+JylcclxuXHRcdFx0LmFkZENsYXNzKCdtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygnZ2l0aHViLicpKVxyXG5cdFx0XHQuY2xpY2soZnVuY3Rpb24oKSB7IHdpbmRvdy5vcGVuKCdodHRwczovL2dpdGh1Yi5jb20vQ29udGludWl0aWVzL2FkYXJrcm9vbScpOyB9KVxyXG5cdFx0XHQuYXBwZW5kVG8obWVudSk7XHJcblx0XHJcblx0XHQvLyBzdWJzY3JpYmUgdG8gc3RhdGVVcGRhdGVzXHJcblx0XHQkLkRpc3BhdGNoKCdzdGF0ZVVwZGF0ZScpLnN1YnNjcmliZShFbmdpbmUuaGFuZGxlU3RhdGVVcGRhdGVzKTtcclxuXHJcblx0XHQkU00uaW5pdCgpO1xyXG5cdFx0Tm90aWZpY2F0aW9ucy5pbml0KCk7XHJcblx0XHRFdmVudHMuaW5pdCgpO1xyXG5cdFx0Um9vbS5pbml0KCk7XHJcblx0XHRDaGFyYWN0ZXIuaW5pdCgpO1xyXG5cdFx0V2VhdGhlci5pbml0KCk7XHJcblx0XHRpZigkU00uZ2V0KCdyb2FkLm9wZW4nKSkge1xyXG5cdFx0XHRSb2FkLmluaXQoKTtcclxuXHRcdH1cclxuXHRcdGlmKCRTTS5nZXQoJ291dHBvc3Qub3BlbicpKSB7XHJcblx0XHRcdE91dHBvc3QuaW5pdCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdEVuZ2luZS5zYXZlTGFuZ3VhZ2UoKTtcclxuXHRcdEVuZ2luZS50cmF2ZWxUbyhSb29tKTtcclxuXHJcblx0fSxcclxuXHRcclxuXHRicm93c2VyVmFsaWQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuICggbG9jYXRpb24uc2VhcmNoLmluZGV4T2YoICdpZ25vcmVicm93c2VyPXRydWUnICkgPj0gMCB8fCAoIHR5cGVvZiBTdG9yYWdlICE9ICd1bmRlZmluZWQnICYmICFvbGRJRSApICk7XHJcblx0fSxcclxuXHRcclxuXHRpc01vYmlsZTogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKCBsb2NhdGlvbi5zZWFyY2guaW5kZXhPZiggJ2lnbm9yZWJyb3dzZXI9dHJ1ZScgKSA8IDAgJiYgL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5L2kudGVzdCggbmF2aWdhdG9yLnVzZXJBZ2VudCApICk7XHJcblx0fSxcclxuXHRcclxuXHRzYXZlR2FtZTogZnVuY3Rpb24oKSB7XHJcblx0XHRpZih0eXBlb2YgU3RvcmFnZSAhPSAndW5kZWZpbmVkJyAmJiBsb2NhbFN0b3JhZ2UpIHtcclxuXHRcdFx0aWYoRW5naW5lLl9zYXZlVGltZXIgIT0gbnVsbCkge1xyXG5cdFx0XHRcdGNsZWFyVGltZW91dChFbmdpbmUuX3NhdmVUaW1lcik7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYodHlwZW9mIEVuZ2luZS5fbGFzdE5vdGlmeSA9PSAndW5kZWZpbmVkJyB8fCBEYXRlLm5vdygpIC0gRW5naW5lLl9sYXN0Tm90aWZ5ID4gRW5naW5lLlNBVkVfRElTUExBWSl7XHJcblx0XHRcdFx0JCgnI3NhdmVOb3RpZnknKS5jc3MoJ29wYWNpdHknLCAxKS5hbmltYXRlKHtvcGFjaXR5OiAwfSwgMTAwMCwgJ2xpbmVhcicpO1xyXG5cdFx0XHRcdEVuZ2luZS5fbGFzdE5vdGlmeSA9IERhdGUubm93KCk7XHJcblx0XHRcdH1cclxuXHRcdFx0bG9jYWxTdG9yYWdlLmdhbWVTdGF0ZSA9IEpTT04uc3RyaW5naWZ5KFN0YXRlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGxvYWRHYW1lOiBmdW5jdGlvbigpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHZhciBzYXZlZFN0YXRlID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2FtZVN0YXRlKTtcclxuXHRcdFx0aWYoc2F2ZWRTdGF0ZSkge1xyXG5cdFx0XHRcdHdpbmRvdy5TdGF0ZSA9IHNhdmVkU3RhdGU7XHJcblx0XHRcdFx0RW5naW5lLmxvZyhcImxvYWRlZCBzYXZlIVwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBjYXRjaChlKSB7XHJcblx0XHRcdEVuZ2luZS5sb2coZSk7XHJcblx0XHRcdHdpbmRvdy5TdGF0ZSA9IHt9O1xyXG5cdFx0XHQkU00uc2V0KCd2ZXJzaW9uJywgRW5naW5lLlZFUlNJT04pO1xyXG5cdFx0XHRFbmdpbmUuZXZlbnQoJ3Byb2dyZXNzJywgJ25ldyBnYW1lJyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRleHBvcnRJbXBvcnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnRXhwb3J0IC8gSW1wb3J0JyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ2V4cG9ydCBvciBpbXBvcnQgc2F2ZSBkYXRhLCBmb3IgYmFja2luZyB1cCcpLFxyXG5cdFx0XHRcdFx0XHRfKCdvciBtaWdyYXRpbmcgY29tcHV0ZXJzJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdleHBvcnQnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnZXhwb3J0JyksXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IEVuZ2luZS5leHBvcnQ2NFxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnaW1wb3J0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2ltcG9ydCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdjb25maXJtJ31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2NhbmNlbCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdjYW5jZWwnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdjb25maXJtJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdhcmUgeW91IHN1cmU/JyksXHJcblx0XHRcdFx0XHRcdF8oJ2lmIHRoZSBjb2RlIGlzIGludmFsaWQsIGFsbCBkYXRhIHdpbGwgYmUgbG9zdC4nKSxcclxuXHRcdFx0XHRcdFx0XygndGhpcyBpcyBpcnJldmVyc2libGUuJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCd5ZXMnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygneWVzJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2lucHV0SW1wb3J0J30sXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IEVuZ2luZS5lbmFibGVTZWxlY3Rpb25cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J25vJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ25vJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnaW5wdXRJbXBvcnQnOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXygncHV0IHRoZSBzYXZlIGNvZGUgaGVyZS4nKV0sXHJcblx0XHRcdFx0XHR0ZXh0YXJlYTogJycsXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdva2F5Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2ltcG9ydCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IEVuZ2luZS5pbXBvcnQ2NFxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnY2FuY2VsJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2NhbmNlbCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0Z2VuZXJhdGVFeHBvcnQ2NDogZnVuY3Rpb24oKXtcclxuXHRcdHZhciBzdHJpbmc2NCA9IEJhc2U2NC5lbmNvZGUobG9jYWxTdG9yYWdlLmdhbWVTdGF0ZSk7XHJcblx0XHRzdHJpbmc2NCA9IHN0cmluZzY0LnJlcGxhY2UoL1xccy9nLCAnJyk7XHJcblx0XHRzdHJpbmc2NCA9IHN0cmluZzY0LnJlcGxhY2UoL1xcLi9nLCAnJyk7XHJcblx0XHRzdHJpbmc2NCA9IHN0cmluZzY0LnJlcGxhY2UoL1xcbi9nLCAnJyk7XHJcblxyXG5cdFx0cmV0dXJuIHN0cmluZzY0O1xyXG5cdH0sXHJcblxyXG5cdGV4cG9ydDY0OiBmdW5jdGlvbigpIHtcclxuXHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0dmFyIHN0cmluZzY0ID0gRW5naW5lLmdlbmVyYXRlRXhwb3J0NjQoKTtcclxuXHRcdEVuZ2luZS5lbmFibGVTZWxlY3Rpb24oKTtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ0V4cG9ydCcpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0dGV4dDogW18oJ3NhdmUgdGhpcy4nKV0sXHJcblx0XHRcdFx0XHR0ZXh0YXJlYTogc3RyaW5nNjQsXHJcblx0XHRcdFx0XHRyZWFkb25seTogdHJ1ZSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2RvbmUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnZ290IGl0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogRW5naW5lLmRpc2FibGVTZWxlY3Rpb25cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRFbmdpbmUuYXV0b1NlbGVjdCgnI2Rlc2NyaXB0aW9uIHRleHRhcmVhJyk7XHJcblx0fSxcclxuXHJcblx0aW1wb3J0NjQ6IGZ1bmN0aW9uKHN0cmluZzY0KSB7XHJcblx0XHRFbmdpbmUuZGlzYWJsZVNlbGVjdGlvbigpO1xyXG5cdFx0c3RyaW5nNjQgPSBzdHJpbmc2NC5yZXBsYWNlKC9cXHMvZywgJycpO1xyXG5cdFx0c3RyaW5nNjQgPSBzdHJpbmc2NC5yZXBsYWNlKC9cXC4vZywgJycpO1xyXG5cdFx0c3RyaW5nNjQgPSBzdHJpbmc2NC5yZXBsYWNlKC9cXG4vZywgJycpO1xyXG5cdFx0dmFyIGRlY29kZWRTYXZlID0gQmFzZTY0LmRlY29kZShzdHJpbmc2NCk7XHJcblx0XHRsb2NhbFN0b3JhZ2UuZ2FtZVN0YXRlID0gZGVjb2RlZFNhdmU7XHJcblx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcclxuXHR9LFxyXG5cclxuXHRldmVudDogZnVuY3Rpb24oY2F0LCBhY3QpIHtcclxuXHRcdGlmKHR5cGVvZiBnYSA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRnYSgnc2VuZCcsICdldmVudCcsIGNhdCwgYWN0KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRjb25maXJtRGVsZXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ1Jlc3RhcnQ/JyksXHJcblx0XHRcdHNjZW5lczoge1xyXG5cdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXygncmVzdGFydCB0aGUgZ2FtZT8nKV0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCd5ZXMnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygneWVzJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogRW5naW5lLmRlbGV0ZVNhdmVcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J25vJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ25vJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRkZWxldGVTYXZlOiBmdW5jdGlvbihub1JlbG9hZCkge1xyXG5cdFx0aWYodHlwZW9mIFN0b3JhZ2UgIT0gJ3VuZGVmaW5lZCcgJiYgbG9jYWxTdG9yYWdlKSB7XHJcblx0XHRcdHdpbmRvdy5TdGF0ZSA9IHt9O1xyXG5cdFx0XHRsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcclxuXHRcdH1cclxuXHRcdGlmKCFub1JlbG9hZCkge1xyXG5cdFx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRzaGFyZTogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdTaGFyZScpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0dGV4dDogW18oJ2JyaW5nIHlvdXIgZnJpZW5kcy4nKV0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdmYWNlYm9vayc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdmYWNlYm9vaycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0d2luZG93Lm9wZW4oJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9zaGFyZXIvc2hhcmVyLnBocD91PScgKyBFbmdpbmUuU0lURV9VUkwsICdzaGFyZXInLCAnd2lkdGg9NjI2LGhlaWdodD00MzYsbG9jYXRpb249bm8sbWVudWJhcj1ubyxyZXNpemFibGU9bm8sc2Nyb2xsYmFycz1ubyxzdGF0dXM9bm8sdG9vbGJhcj1ubycpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2dvb2dsZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0Ol8oJ2dvb2dsZSsnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5vcGVuKCdodHRwczovL3BsdXMuZ29vZ2xlLmNvbS9zaGFyZT91cmw9JyArIEVuZ2luZS5TSVRFX1VSTCwgJ3NoYXJlcicsICd3aWR0aD00ODAsaGVpZ2h0PTQzNixsb2NhdGlvbj1ubyxtZW51YmFyPW5vLHJlc2l6YWJsZT1ubyxzY3JvbGxiYXJzPW5vLHN0YXR1cz1ubyx0b29sYmFyPW5vJyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQndHdpdHRlcic6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCd0d2l0dGVyJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR3aW5kb3cub3BlbignaHR0cHM6Ly90d2l0dGVyLmNvbS9pbnRlbnQvdHdlZXQ/dGV4dD1BJTIwRGFyayUyMFJvb20mdXJsPScgKyBFbmdpbmUuU0lURV9VUkwsICdzaGFyZXInLCAnd2lkdGg9NjYwLGhlaWdodD0yNjAsbG9jYXRpb249bm8sbWVudWJhcj1ubyxyZXNpemFibGU9bm8sc2Nyb2xsYmFycz15ZXMsc3RhdHVzPW5vLHRvb2xiYXI9bm8nKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdyZWRkaXQnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygncmVkZGl0JyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR3aW5kb3cub3BlbignaHR0cDovL3d3dy5yZWRkaXQuY29tL3N1Ym1pdD91cmw9JyArIEVuZ2luZS5TSVRFX1VSTCwgJ3NoYXJlcicsICd3aWR0aD05NjAsaGVpZ2h0PTcwMCxsb2NhdGlvbj1ubyxtZW51YmFyPW5vLHJlc2l6YWJsZT1ubyxzY3JvbGxiYXJzPXllcyxzdGF0dXM9bm8sdG9vbGJhcj1ubycpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2Nsb3NlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2Nsb3NlJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHR3aWR0aDogJzQwMHB4J1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0ZmluZFN0eWxlc2hlZXQ6IGZ1bmN0aW9uKHRpdGxlKSB7XHJcblx0XHRmb3IodmFyIGk9MDsgaTxkb2N1bWVudC5zdHlsZVNoZWV0cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgc2hlZXQgPSBkb2N1bWVudC5zdHlsZVNoZWV0c1tpXTtcclxuXHRcdFx0aWYoc2hlZXQudGl0bGUgPT0gdGl0bGUpIHtcclxuXHRcdFx0XHRyZXR1cm4gc2hlZXQ7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH0sXHJcblxyXG5cdGlzTGlnaHRzT2ZmOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBkYXJrQ3NzID0gRW5naW5lLmZpbmRTdHlsZXNoZWV0KCdkYXJrZW5MaWdodHMnKTtcclxuXHRcdGlmICggZGFya0NzcyAhPSBudWxsICYmICFkYXJrQ3NzLmRpc2FibGVkICkge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cclxuXHR0dXJuTGlnaHRzT2ZmOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBkYXJrQ3NzID0gRW5naW5lLmZpbmRTdHlsZXNoZWV0KCdkYXJrZW5MaWdodHMnKTtcclxuXHRcdGlmIChkYXJrQ3NzID09IG51bGwpIHtcclxuXHRcdFx0JCgnaGVhZCcpLmFwcGVuZCgnPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCJjc3MvZGFyay5jc3NcIiB0eXBlPVwidGV4dC9jc3NcIiB0aXRsZT1cImRhcmtlbkxpZ2h0c1wiIC8+Jyk7XHJcblx0XHRcdCQoJy5saWdodHNPZmYnKS50ZXh0KF8oJ2xpZ2h0cyBvbi4nKSk7XHJcblx0XHR9IGVsc2UgaWYgKGRhcmtDc3MuZGlzYWJsZWQpIHtcclxuXHRcdFx0ZGFya0Nzcy5kaXNhYmxlZCA9IGZhbHNlO1xyXG5cdFx0XHQkKCcubGlnaHRzT2ZmJykudGV4dChfKCdsaWdodHMgb24uJykpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JChcIiNkYXJrZW5MaWdodHNcIikuYXR0cihcImRpc2FibGVkXCIsIFwiZGlzYWJsZWRcIik7XHJcblx0XHRcdGRhcmtDc3MuZGlzYWJsZWQgPSB0cnVlO1xyXG5cdFx0XHQkKCcubGlnaHRzT2ZmJykudGV4dChfKCdsaWdodHMgb2ZmLicpKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHQvLyBHZXRzIGEgZ3VpZFxyXG5cdGdldEd1aWQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24oYykge1xyXG5cdFx0XHR2YXIgciA9IE1hdGgucmFuZG9tKCkqMTZ8MCwgdiA9IGMgPT0gJ3gnID8gciA6IChyJjB4M3wweDgpO1xyXG5cdFx0XHRyZXR1cm4gdi50b1N0cmluZygxNik7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRhY3RpdmVNb2R1bGU6IG51bGwsXHJcblxyXG5cdHRyYXZlbFRvOiBmdW5jdGlvbihtb2R1bGUpIHtcclxuXHRcdGlmKEVuZ2luZS5hY3RpdmVNb2R1bGUgIT0gbW9kdWxlKSB7XHJcblx0XHRcdHZhciBjdXJyZW50SW5kZXggPSBFbmdpbmUuYWN0aXZlTW9kdWxlID8gJCgnLmxvY2F0aW9uJykuaW5kZXgoRW5naW5lLmFjdGl2ZU1vZHVsZS5wYW5lbCkgOiAxO1xyXG5cdFx0XHQkKCdkaXYuaGVhZGVyQnV0dG9uJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcblx0XHRcdG1vZHVsZS50YWIuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcblxyXG5cdFx0XHR2YXIgc2xpZGVyID0gJCgnI2xvY2F0aW9uU2xpZGVyJyk7XHJcblx0XHRcdHZhciBzdG9yZXMgPSAkKCcjc3RvcmVzQ29udGFpbmVyJyk7XHJcblx0XHRcdHZhciBwYW5lbEluZGV4ID0gJCgnLmxvY2F0aW9uJykuaW5kZXgobW9kdWxlLnBhbmVsKTtcclxuXHRcdFx0dmFyIGRpZmYgPSBNYXRoLmFicyhwYW5lbEluZGV4IC0gY3VycmVudEluZGV4KTtcclxuXHRcdFx0c2xpZGVyLmFuaW1hdGUoe2xlZnQ6IC0ocGFuZWxJbmRleCAqIDcwMCkgKyAncHgnfSwgMzAwICogZGlmZik7XHJcblxyXG5cdFx0XHRpZigkU00uZ2V0KCdzdG9yZXMud29vZCcpICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0Ly8gRklYTUUgV2h5IGRvZXMgdGhpcyB3b3JrIGlmIHRoZXJlJ3MgYW4gYW5pbWF0aW9uIHF1ZXVlLi4uP1xyXG5cdFx0XHRcdHN0b3Jlcy5hbmltYXRlKHtyaWdodDogLShwYW5lbEluZGV4ICogNzAwKSArICdweCd9LCAzMDAgKiBkaWZmKTtcclxuXHRcdFx0fVxyXG5cdFx0XHJcblx0XHRcdEVuZ2luZS5hY3RpdmVNb2R1bGUgPSBtb2R1bGU7XHJcblxyXG5cdFx0XHRtb2R1bGUub25BcnJpdmFsKGRpZmYpO1xyXG5cclxuXHRcdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSBSb29tXHJcblx0XHRcdFx0Ly8gIHx8IEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gUGF0aFxyXG5cdFx0XHRcdCkge1xyXG5cdFx0XHRcdC8vIERvbid0IGZhZGUgb3V0IHRoZSB3ZWFwb25zIGlmIHdlJ3JlIHN3aXRjaGluZyB0byBhIG1vZHVsZVxyXG5cdFx0XHRcdC8vIHdoZXJlIHdlJ3JlIGdvaW5nIHRvIGtlZXAgc2hvd2luZyB0aGVtIGFueXdheS5cclxuXHRcdFx0XHRpZiAobW9kdWxlICE9IFJvb20gXHJcblx0XHRcdFx0XHQvLyAmJiBtb2R1bGUgIT0gUGF0aFxyXG5cdFx0XHRcdCkge1xyXG5cdFx0XHRcdFx0JCgnZGl2I3dlYXBvbnMnKS5hbmltYXRlKHtvcGFjaXR5OiAwfSwgMzAwKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKG1vZHVsZSA9PSBSb29tXHJcblx0XHRcdFx0Ly8gIHx8IG1vZHVsZSA9PSBQYXRoXHJcblx0XHRcdFx0KSB7XHJcblx0XHRcdFx0JCgnZGl2I3dlYXBvbnMnKS5hbmltYXRlKHtvcGFjaXR5OiAxfSwgMzAwKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Tm90aWZpY2F0aW9ucy5wcmludFF1ZXVlKG1vZHVsZSk7XHJcblx0XHRcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHQvKiBNb3ZlIHRoZSBzdG9yZXMgcGFuZWwgYmVuZWF0aCB0b3BfY29udGFpbmVyIChvciB0byB0b3A6IDBweCBpZiB0b3BfY29udGFpbmVyXHJcblx0XHQqIGVpdGhlciBoYXNuJ3QgYmVlbiBmaWxsZWQgaW4gb3IgaXMgbnVsbCkgdXNpbmcgdHJhbnNpdGlvbl9kaWZmIHRvIHN5bmMgd2l0aFxyXG5cdFx0KiB0aGUgYW5pbWF0aW9uIGluIEVuZ2luZS50cmF2ZWxUbygpLlxyXG5cdFx0Ki9cclxuXHRtb3ZlU3RvcmVzVmlldzogZnVuY3Rpb24odG9wX2NvbnRhaW5lciwgdHJhbnNpdGlvbl9kaWZmKSB7XHJcblx0XHR2YXIgc3RvcmVzID0gJCgnI3N0b3Jlc0NvbnRhaW5lcicpO1xyXG5cclxuXHRcdC8vIElmIHdlIGRvbid0IGhhdmUgYSBzdG9yZXNDb250YWluZXIgeWV0LCBsZWF2ZS5cclxuXHRcdGlmKHR5cGVvZihzdG9yZXMpID09PSAndW5kZWZpbmVkJykgcmV0dXJuO1xyXG5cclxuXHRcdGlmKHR5cGVvZih0cmFuc2l0aW9uX2RpZmYpID09PSAndW5kZWZpbmVkJykgdHJhbnNpdGlvbl9kaWZmID0gMTtcclxuXHJcblx0XHRpZih0b3BfY29udGFpbmVyID09PSBudWxsKSB7XHJcblx0XHRcdHN0b3Jlcy5hbmltYXRlKHt0b3A6ICcwcHgnfSwge3F1ZXVlOiBmYWxzZSwgZHVyYXRpb246IDMwMCAqIHRyYW5zaXRpb25fZGlmZn0pO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZighdG9wX2NvbnRhaW5lci5sZW5ndGgpIHtcclxuXHRcdFx0c3RvcmVzLmFuaW1hdGUoe3RvcDogJzBweCd9LCB7cXVldWU6IGZhbHNlLCBkdXJhdGlvbjogMzAwICogdHJhbnNpdGlvbl9kaWZmfSk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0c3RvcmVzLmFuaW1hdGUoe1xyXG5cdFx0XHRcdFx0dG9wOiB0b3BfY29udGFpbmVyLmhlaWdodCgpICsgMjYgKyAncHgnXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRxdWV1ZTogZmFsc2UsIFxyXG5cdFx0XHRcdFx0ZHVyYXRpb246IDMwMCAqIHRyYW5zaXRpb25fZGlmZlxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRsb2c6IGZ1bmN0aW9uKG1zZykge1xyXG5cdFx0aWYodGhpcy5fbG9nKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKG1zZyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0dXBkYXRlU2xpZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBzbGlkZXIgPSAkKCcjbG9jYXRpb25TbGlkZXInKTtcclxuXHRcdHNsaWRlci53aWR0aCgoc2xpZGVyLmNoaWxkcmVuKCkubGVuZ3RoICogNzAwKSArICdweCcpO1xyXG5cdH0sXHJcblxyXG5cdHVwZGF0ZU91dGVyU2xpZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBzbGlkZXIgPSAkKCcjb3V0ZXJTbGlkZXInKTtcclxuXHRcdHNsaWRlci53aWR0aCgoc2xpZGVyLmNoaWxkcmVuKCkubGVuZ3RoICogNzAwKSArICdweCcpO1xyXG5cdH0sXHJcblxyXG5cdGdldEluY29tZU1zZzogZnVuY3Rpb24obnVtLCBkZWxheSkge1xyXG5cdFx0cmV0dXJuIF8oXCJ7MH0gcGVyIHsxfXNcIiwgKG51bSA+IDAgPyBcIitcIiA6IFwiXCIpICsgbnVtLCBkZWxheSk7XHJcblx0fSxcclxuXHJcblx0c3dpcGVMZWZ0OiBmdW5jdGlvbihlKSB7XHJcblx0XHRpZihFbmdpbmUuYWN0aXZlTW9kdWxlLnN3aXBlTGVmdCkge1xyXG5cdFx0XHRFbmdpbmUuYWN0aXZlTW9kdWxlLnN3aXBlTGVmdChlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRzd2lwZVJpZ2h0OiBmdW5jdGlvbihlKSB7XHJcblx0XHRpZihFbmdpbmUuYWN0aXZlTW9kdWxlLnN3aXBlUmlnaHQpIHtcclxuXHRcdFx0RW5naW5lLmFjdGl2ZU1vZHVsZS5zd2lwZVJpZ2h0KGUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHN3aXBlVXA6IGZ1bmN0aW9uKGUpIHtcclxuXHRcdGlmKEVuZ2luZS5hY3RpdmVNb2R1bGUuc3dpcGVVcCkge1xyXG5cdFx0XHRFbmdpbmUuYWN0aXZlTW9kdWxlLnN3aXBlVXAoZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0c3dpcGVEb3duOiBmdW5jdGlvbihlKSB7XHJcblx0XHRpZihFbmdpbmUuYWN0aXZlTW9kdWxlLnN3aXBlRG93bikge1xyXG5cdFx0XHRFbmdpbmUuYWN0aXZlTW9kdWxlLnN3aXBlRG93bihlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRkaXNhYmxlU2VsZWN0aW9uOiBmdW5jdGlvbigpIHtcclxuXHRcdGRvY3VtZW50Lm9uc2VsZWN0c3RhcnQgPSBldmVudE51bGxpZmllcjsgLy8gdGhpcyBpcyBmb3IgSUVcclxuXHRcdGRvY3VtZW50Lm9ubW91c2Vkb3duID0gZXZlbnROdWxsaWZpZXI7IC8vIHRoaXMgaXMgZm9yIHRoZSByZXN0XHJcblx0fSxcclxuXHJcblx0ZW5hYmxlU2VsZWN0aW9uOiBmdW5jdGlvbigpIHtcclxuXHRcdGRvY3VtZW50Lm9uc2VsZWN0c3RhcnQgPSBldmVudFBhc3N0aHJvdWdoO1xyXG5cdFx0ZG9jdW1lbnQub25tb3VzZWRvd24gPSBldmVudFBhc3N0aHJvdWdoO1xyXG5cdH0sXHJcblxyXG5cdGF1dG9TZWxlY3Q6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcblx0XHQkKHNlbGVjdG9yKS5mb2N1cygpLnNlbGVjdCgpO1xyXG5cdH0sXHJcblxyXG5cdGhhbmRsZVN0YXRlVXBkYXRlczogZnVuY3Rpb24oZSl7XHJcblx0XHJcblx0fSxcclxuXHJcblx0c3dpdGNoTGFuZ3VhZ2U6IGZ1bmN0aW9uKGRvbSl7XHJcblx0XHR2YXIgbGFuZyA9ICQoZG9tKS5kYXRhKFwibGFuZ3VhZ2VcIik7XHJcblx0XHRpZihkb2N1bWVudC5sb2NhdGlvbi5ocmVmLnNlYXJjaCgvW1xcP1xcJl1sYW5nPVthLXpfXSsvKSAhPSAtMSl7XHJcblx0XHRcdGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSBkb2N1bWVudC5sb2NhdGlvbi5ocmVmLnJlcGxhY2UoIC8oW1xcP1xcJl1sYW5nPSkoW2Etel9dKykvZ2kgLCBcIiQxXCIrbGFuZyApO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSBkb2N1bWVudC5sb2NhdGlvbi5ocmVmICsgKCAoZG9jdW1lbnQubG9jYXRpb24uaHJlZi5zZWFyY2goL1xcPy8pICE9IC0xICk/XCImXCI6XCI/XCIpICsgXCJsYW5nPVwiK2xhbmc7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0c2F2ZUxhbmd1YWdlOiBmdW5jdGlvbigpe1xyXG5cdFx0dmFyIGxhbmcgPSBkZWNvZGVVUklDb21wb25lbnQoKG5ldyBSZWdFeHAoJ1s/fCZdbGFuZz0nICsgJyhbXiY7XSs/KSgmfCN8O3wkKScpLmV4ZWMobG9jYXRpb24uc2VhcmNoKXx8WyxcIlwiXSlbMV0ucmVwbGFjZSgvXFwrL2csICclMjAnKSl8fG51bGw7XHRcclxuXHRcdGlmKGxhbmcgJiYgdHlwZW9mIFN0b3JhZ2UgIT0gJ3VuZGVmaW5lZCcgJiYgbG9jYWxTdG9yYWdlKSB7XHJcblx0XHRcdGxvY2FsU3RvcmFnZS5sYW5nID0gbGFuZztcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRzZXRUaW1lb3V0OiBmdW5jdGlvbihjYWxsYmFjaywgdGltZW91dCwgc2tpcERvdWJsZT8pe1xyXG5cclxuXHRcdGlmKCBFbmdpbmUub3B0aW9ucy5kb3VibGVUaW1lICYmICFza2lwRG91YmxlICl7XHJcblx0XHRcdEVuZ2luZS5sb2coJ0RvdWJsZSB0aW1lLCBjdXR0aW5nIHRpbWVvdXQgaW4gaGFsZicpO1xyXG5cdFx0XHR0aW1lb3V0IC89IDI7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHNldFRpbWVvdXQoY2FsbGJhY2ssIHRpbWVvdXQpO1xyXG5cclxuXHR9XHJcblxyXG59O1xyXG5cclxuZnVuY3Rpb24gZXZlbnROdWxsaWZpZXIoZSkge1xyXG5cdHJldHVybiAkKGUudGFyZ2V0KS5oYXNDbGFzcygnbWVudUJ0bicpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBldmVudFBhc3N0aHJvdWdoKGUpIHtcclxuXHRyZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGluVmlldyhkaXIsIGVsZW0pe1xyXG5cclxuICAgICAgICB2YXIgc2NUb3AgPSAkKCcjbWFpbicpLm9mZnNldCgpLnRvcDtcclxuICAgICAgICB2YXIgc2NCb3QgPSBzY1RvcCArICQoJyNtYWluJykuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIHZhciBlbFRvcCA9IGVsZW0ub2Zmc2V0KCkudG9wO1xyXG4gICAgICAgIHZhciBlbEJvdCA9IGVsVG9wICsgZWxlbS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgaWYoIGRpciA9PSAndXAnICl7XHJcbiAgICAgICAgICAgICAgICAvLyBTVE9QIE1PVklORyBJRiBCT1RUT00gT0YgRUxFTUVOVCBJUyBWSVNJQkxFIElOIFNDUkVFTlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICggZWxCb3QgPCBzY0JvdCApO1xyXG4gICAgICAgIH1lbHNlIGlmKCBkaXIgPT0gJ2Rvd24nICl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKCBlbFRvcCA+IHNjVG9wICk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKCAoIGVsQm90IDw9IHNjQm90ICkgJiYgKCBlbFRvcCA+PSBzY1RvcCApICk7XHJcbiAgICAgICAgfVxyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gc2Nyb2xsQnlYKGVsZW0sIHgpe1xyXG5cclxuICAgICAgICB2YXIgZWxUb3AgPSBwYXJzZUludCggZWxlbS5jc3MoJ3RvcCcpLCAxMCApO1xyXG4gICAgICAgIGVsZW0uY3NzKCAndG9wJywgKCBlbFRvcCArIHggKSArIFwicHhcIiApO1xyXG5cclxufVxyXG5cclxuXHJcbi8vY3JlYXRlIGpRdWVyeSBDYWxsYmFja3MoKSB0byBoYW5kbGUgb2JqZWN0IGV2ZW50cyBcclxuJC5EaXNwYXRjaCA9IGZ1bmN0aW9uKCBpZCApIHtcclxuXHR2YXIgY2FsbGJhY2tzLCB0b3BpYyA9IGlkICYmIEVuZ2luZS50b3BpY3NbIGlkIF07XHJcblx0aWYgKCAhdG9waWMgKSB7XHJcblx0XHRjYWxsYmFja3MgPSBqUXVlcnkuQ2FsbGJhY2tzKCk7XHJcblx0XHR0b3BpYyA9IHtcclxuXHRcdFx0XHRwdWJsaXNoOiBjYWxsYmFja3MuZmlyZSxcclxuXHRcdFx0XHRzdWJzY3JpYmU6IGNhbGxiYWNrcy5hZGQsXHJcblx0XHRcdFx0dW5zdWJzY3JpYmU6IGNhbGxiYWNrcy5yZW1vdmVcclxuXHRcdH07XHJcblx0XHRpZiAoIGlkICkge1xyXG5cdFx0XHRFbmdpbmUudG9waWNzWyBpZCBdID0gdG9waWM7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiB0b3BpYztcclxufTtcclxuXHJcbiQoZnVuY3Rpb24oKSB7XHJcblx0RW5naW5lLmluaXQoKTtcclxufSk7XHJcblxyXG4iLCIvKipcclxuICogTW9kdWxlIHRoYXQgaGFuZGxlcyB0aGUgcmFuZG9tIGV2ZW50IHN5c3RlbVxyXG4gKi9cclxuaW1wb3J0IHsgRXZlbnRzUm9hZFdhbmRlciB9IGZyb20gXCIuL2V2ZW50cy9yb2Fkd2FuZGVyXCI7XHJcbmltcG9ydCB7IEV2ZW50c1Jvb20gfSBmcm9tIFwiLi9ldmVudHMvcm9vbVwiO1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi9lbmdpbmVcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgTm90aWZpY2F0aW9ucyB9IGZyb20gXCIuL25vdGlmaWNhdGlvbnNcIjtcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4vQnV0dG9uXCI7XHJcblxyXG5pbnRlcmZhY2UgQURSRXZlbnQge1xyXG5cdHRpdGxlOiBzdHJpbmcsXHJcblx0aXNBdmFpbGFibGU/OiBGdW5jdGlvbixcclxuXHRzY2VuZXM6IHtcclxuXHRcdC8vIHR5cGUgdGhpcyBvdXQgYmV0dGVyIHVzaW5nIEluZGV4IFNpZ25hdHVyZXNcclxuXHR9LFxyXG5cdGV2ZW50UGFuZWw/OiBhbnlcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IEV2ZW50cyA9IHtcclxuXHRcdFxyXG5cdF9FVkVOVF9USU1FX1JBTkdFOiBbMywgNl0sIC8vIHJhbmdlLCBpbiBtaW51dGVzXHJcblx0X1BBTkVMX0ZBREU6IDIwMCxcclxuXHRfRklHSFRfU1BFRUQ6IDEwMCxcclxuXHRfRUFUX0NPT0xET1dOOiA1LFxyXG5cdF9NRURTX0NPT0xET1dOOiA3LFxyXG5cdF9MRUFWRV9DT09MRE9XTjogMSxcclxuXHRTVFVOX0RVUkFUSU9OOiA0MDAwLFxyXG5cdEJMSU5LX0lOVEVSVkFMOiBmYWxzZSxcclxuXHJcblx0RXZlbnRQb29sOiA8YW55PltdLFxyXG5cdGV2ZW50U3RhY2s6IDxhbnk+W10sXHJcblx0X2V2ZW50VGltZW91dDogMCxcclxuXHJcblx0TG9jYXRpb25zOiB7fSxcclxuXHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblx0XHRcclxuXHRcdC8vIEJ1aWxkIHRoZSBFdmVudCBQb29sXHJcblx0XHRFdmVudHMuRXZlbnRQb29sID0gW10uY29uY2F0KFxyXG5cdFx0XHRFdmVudHNSb29tIGFzIGFueSxcclxuXHRcdFx0RXZlbnRzUm9hZFdhbmRlciBhcyBhbnlcclxuXHRcdCk7XHJcblxyXG5cdFx0dGhpcy5Mb2NhdGlvbnNbXCJSb29tXCJdID0gRXZlbnRzUm9vbTtcclxuXHRcdHRoaXMuTG9jYXRpb25zW1wiUm9hZFdhbmRlclwiXSA9IEV2ZW50c1JvYWRXYW5kZXI7XHJcblx0XHRcclxuXHRcdEV2ZW50cy5ldmVudFN0YWNrID0gW107XHJcblx0XHRcclxuXHRcdC8vc3Vic2NyaWJlIHRvIHN0YXRlVXBkYXRlc1xyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5zdWJzY3JpYmUoRXZlbnRzLmhhbmRsZVN0YXRlVXBkYXRlcyk7XHJcblx0fSxcclxuXHRcclxuXHRvcHRpb25zOiB7fSwgLy8gTm90aGluZyBmb3Igbm93XHJcbiAgICBcclxuXHRhY3RpdmVTY2VuZTogJycsXHJcbiAgICBcclxuXHRsb2FkU2NlbmU6IGZ1bmN0aW9uKG5hbWUpIHtcclxuXHRcdEVuZ2luZS5sb2coJ2xvYWRpbmcgc2NlbmU6ICcgKyBuYW1lKTtcclxuXHRcdEV2ZW50cy5hY3RpdmVTY2VuZSA9IG5hbWU7XHJcblx0XHR2YXIgc2NlbmUgPSBFdmVudHMuYWN0aXZlRXZlbnQoKT8uc2NlbmVzW25hbWVdO1xyXG5cdFx0XHJcblx0XHQvLyBoYW5kbGVzIG9uZS10aW1lIHNjZW5lcywgc3VjaCBhcyBpbnRyb2R1Y3Rpb25zXHJcblx0XHQvLyBtYXliZSBJIGNhbiBtYWtlIGEgbW9yZSBleHBsaWNpdCBcImludHJvZHVjdGlvblwiIGxvZ2ljYWwgZmxvdyB0byBtYWtlIHRoaXNcclxuXHRcdC8vIGEgbGl0dGxlIG1vcmUgZWxlZ2FudCwgZ2l2ZW4gdGhhdCB0aGVyZSB3aWxsIGFsd2F5cyBiZSBhbiBcImludHJvZHVjdGlvblwiIHNjZW5lXHJcblx0XHQvLyB0aGF0J3Mgb25seSBtZWFudCB0byBiZSBydW4gYSBzaW5nbGUgdGltZS5cclxuXHRcdGlmIChzY2VuZS5zZWVuRmxhZyAmJiBzY2VuZS5zZWVuRmxhZygpKSB7XHJcblx0XHRcdEV2ZW50cy5sb2FkU2NlbmUoc2NlbmUubmV4dFNjZW5lKVxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU2NlbmUgcmV3YXJkXHJcblx0XHRpZihzY2VuZS5yZXdhcmQpIHtcclxuXHRcdFx0JFNNLmFkZE0oJ3N0b3JlcycsIHNjZW5lLnJld2FyZCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIG9uTG9hZFxyXG5cdFx0aWYoc2NlbmUub25Mb2FkKSB7XHJcblx0XHRcdHNjZW5lLm9uTG9hZCgpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBOb3RpZnkgdGhlIHNjZW5lIGNoYW5nZVxyXG5cdFx0aWYoc2NlbmUubm90aWZpY2F0aW9uKSB7XHJcblx0XHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIHNjZW5lLm5vdGlmaWNhdGlvbik7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdCQoJyNkZXNjcmlwdGlvbicsIEV2ZW50cy5ldmVudFBhbmVsKCkpLmVtcHR5KCk7XHJcblx0XHQkKCcjYnV0dG9ucycsIEV2ZW50cy5ldmVudFBhbmVsKCkpLmVtcHR5KCk7XHJcblx0XHRFdmVudHMuc3RhcnRTdG9yeShzY2VuZSk7XHJcblx0fSxcclxuXHRcclxuXHRkcmF3RmxvYXRUZXh0OiBmdW5jdGlvbih0ZXh0LCBwYXJlbnQpIHtcclxuXHRcdCQoJzxkaXY+JykudGV4dCh0ZXh0KS5hZGRDbGFzcygnZGFtYWdlVGV4dCcpLmFwcGVuZFRvKHBhcmVudCkuYW5pbWF0ZSh7XHJcblx0XHRcdCdib3R0b20nOiAnNTBweCcsXHJcblx0XHRcdCdvcGFjaXR5JzogJzAnXHJcblx0XHR9LFxyXG5cdFx0MzAwLFxyXG5cdFx0J2xpbmVhcicsXHJcblx0XHRmdW5jdGlvbigpIHtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmUoKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0XHJcblx0c3RhcnRTdG9yeTogZnVuY3Rpb24oc2NlbmUpIHtcclxuXHRcdC8vIFdyaXRlIHRoZSB0ZXh0XHJcblx0XHR2YXIgZGVzYyA9ICQoJyNkZXNjcmlwdGlvbicsIEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0Zm9yKHZhciBpIGluIHNjZW5lLnRleHQpIHtcclxuXHRcdFx0JCgnPGRpdj4nKS50ZXh0KHNjZW5lLnRleHRbaV0pLmFwcGVuZFRvKGRlc2MpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZihzY2VuZS50ZXh0YXJlYSAhPSBudWxsKSB7XHJcblx0XHRcdHZhciB0YSA9ICQoJzx0ZXh0YXJlYT4nKS52YWwoc2NlbmUudGV4dGFyZWEpLmFwcGVuZFRvKGRlc2MpO1xyXG5cdFx0XHRpZihzY2VuZS5yZWFkb25seSkge1xyXG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdFx0XHR0YS5hdHRyKCdyZWFkb25seScsIHRydWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIERyYXcgdGhlIGJ1dHRvbnNcclxuXHRcdEV2ZW50cy5kcmF3QnV0dG9ucyhzY2VuZSk7XHJcblx0fSxcclxuXHRcclxuXHRkcmF3QnV0dG9uczogZnVuY3Rpb24oc2NlbmUpIHtcclxuXHRcdHZhciBidG5zID0gJCgnI2J1dHRvbnMnLCBFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdGZvcih2YXIgaWQgaW4gc2NlbmUuYnV0dG9ucykge1xyXG5cdFx0XHR2YXIgaW5mbyA9IHNjZW5lLmJ1dHRvbnNbaWRdO1xyXG5cdFx0XHRcdHZhciBiID0gXHJcblx0XHRcdFx0Ly9uZXcgXHJcblx0XHRcdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdFx0XHRpZDogaWQsXHJcblx0XHRcdFx0XHR0ZXh0OiBpbmZvLnRleHQsXHJcblx0XHRcdFx0XHRjb3N0OiBpbmZvLmNvc3QsXHJcblx0XHRcdFx0XHRjbGljazogRXZlbnRzLmJ1dHRvbkNsaWNrLFxyXG5cdFx0XHRcdFx0Y29vbGRvd246IGluZm8uY29vbGRvd25cclxuXHRcdFx0XHR9KS5hcHBlbmRUbyhidG5zKTtcclxuXHRcdFx0aWYodHlwZW9mIGluZm8uYXZhaWxhYmxlID09ICdmdW5jdGlvbicgJiYgIWluZm8uYXZhaWxhYmxlKCkpIHtcclxuXHRcdFx0XHRCdXR0b24uc2V0RGlzYWJsZWQoYiwgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYodHlwZW9mIGluZm8udmlzaWJsZSA9PSAnZnVuY3Rpb24nICYmICFpbmZvLnZpc2libGUoKSkge1xyXG5cdFx0XHRcdGIuaGlkZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHR5cGVvZiBpbmZvLmNvb2xkb3duID09ICdudW1iZXInKSB7XHJcblx0XHRcdFx0QnV0dG9uLmNvb2xkb3duKGIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdEV2ZW50cy51cGRhdGVCdXR0b25zKCk7XHJcblx0fSxcclxuXHRcclxuXHR1cGRhdGVCdXR0b25zOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBidG5zID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnNjZW5lc1tFdmVudHMuYWN0aXZlU2NlbmVdLmJ1dHRvbnM7XHJcblx0XHRmb3IodmFyIGJJZCBpbiBidG5zKSB7XHJcblx0XHRcdHZhciBiID0gYnRuc1tiSWRdO1xyXG5cdFx0XHR2YXIgYnRuRWwgPSAkKCcjJytiSWQsIEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0XHRpZih0eXBlb2YgYi5hdmFpbGFibGUgPT0gJ2Z1bmN0aW9uJyAmJiAhYi5hdmFpbGFibGUoKSkge1xyXG5cdFx0XHRcdEJ1dHRvbi5zZXREaXNhYmxlZChidG5FbCwgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGJ1dHRvbkNsaWNrOiBmdW5jdGlvbihidG4pIHtcclxuXHRcdHZhciBpbmZvID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnNjZW5lc1tFdmVudHMuYWN0aXZlU2NlbmVdLmJ1dHRvbnNbYnRuLmF0dHIoJ2lkJyldO1xyXG5cclxuXHRcdGlmKHR5cGVvZiBpbmZvLm9uQ2hvb3NlID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0dmFyIHRleHRhcmVhID0gRXZlbnRzLmV2ZW50UGFuZWwoKS5maW5kKCd0ZXh0YXJlYScpO1xyXG5cdFx0XHRpbmZvLm9uQ2hvb3NlKHRleHRhcmVhLmxlbmd0aCA+IDAgPyB0ZXh0YXJlYS52YWwoKSA6IG51bGwpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBSZXdhcmRcclxuXHRcdGlmKGluZm8ucmV3YXJkKSB7XHJcblx0XHRcdCRTTS5hZGRNKCdzdG9yZXMnLCBpbmZvLnJld2FyZCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdEV2ZW50cy51cGRhdGVCdXR0b25zKCk7XHJcblx0XHRcclxuXHRcdC8vIE5vdGlmaWNhdGlvblxyXG5cdFx0aWYoaW5mby5ub3RpZmljYXRpb24pIHtcclxuXHRcdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgaW5mby5ub3RpZmljYXRpb24pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBOZXh0IFNjZW5lXHJcblx0XHRpZihpbmZvLm5leHRTY2VuZSkge1xyXG5cdFx0XHRpZihpbmZvLm5leHRTY2VuZSA9PSAnZW5kJykge1xyXG5cdFx0XHRcdEV2ZW50cy5lbmRFdmVudCgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHZhciByID0gTWF0aC5yYW5kb20oKTtcclxuXHRcdFx0XHR2YXIgbG93ZXN0TWF0Y2g6IG51bGwgfCBzdHJpbmcgPSBudWxsO1xyXG5cdFx0XHRcdGZvcih2YXIgaSBpbiBpbmZvLm5leHRTY2VuZSkge1xyXG5cdFx0XHRcdFx0aWYociA8IChpIGFzIHVua25vd24gYXMgbnVtYmVyKSAmJiAobG93ZXN0TWF0Y2ggPT0gbnVsbCB8fCBpIDwgbG93ZXN0TWF0Y2gpKSB7XHJcblx0XHRcdFx0XHRcdGxvd2VzdE1hdGNoID0gaTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYobG93ZXN0TWF0Y2ggIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0RXZlbnRzLmxvYWRTY2VuZShpbmZvLm5leHRTY2VuZVtsb3dlc3RNYXRjaF0pO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRFbmdpbmUubG9nKCdFUlJPUjogbm8gc3VpdGFibGUgc2NlbmUgZm91bmQnKTtcclxuXHRcdFx0XHRFdmVudHMuZW5kRXZlbnQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8vIGJsaW5rcyB0aGUgYnJvd3NlciB3aW5kb3cgdGl0bGVcclxuXHRibGlua1RpdGxlOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0aXRsZSA9IGRvY3VtZW50LnRpdGxlO1xyXG5cclxuXHRcdC8vIGV2ZXJ5IDMgc2Vjb25kcyBjaGFuZ2UgdGl0bGUgdG8gJyoqKiBFVkVOVCAqKionLCB0aGVuIDEuNSBzZWNvbmRzIGxhdGVyLCBjaGFuZ2UgaXQgYmFjayB0byB0aGUgb3JpZ2luYWwgdGl0bGUuXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRFdmVudHMuQkxJTktfSU5URVJWQUwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuXHRcdFx0ZG9jdW1lbnQudGl0bGUgPSBfKCcqKiogRVZFTlQgKioqJyk7XHJcblx0XHRcdEVuZ2luZS5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge2RvY3VtZW50LnRpdGxlID0gdGl0bGU7fSwgMTUwMCwgdHJ1ZSk7IFxyXG5cdFx0fSwgMzAwMCk7XHJcblx0fSxcclxuXHJcblx0c3RvcFRpdGxlQmxpbms6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0Y2xlYXJJbnRlcnZhbChFdmVudHMuQkxJTktfSU5URVJWQUwpO1xyXG5cdFx0RXZlbnRzLkJMSU5LX0lOVEVSVkFMID0gZmFsc2U7XHJcblx0fSxcclxuXHRcclxuXHQvLyBNYWtlcyBhbiBldmVudCBoYXBwZW4hXHJcblx0dHJpZ2dlckV2ZW50OiBmdW5jdGlvbigpIHtcclxuXHRcdGlmKEV2ZW50cy5hY3RpdmVFdmVudCgpID09IG51bGwpIHtcclxuXHRcdFx0dmFyIHBvc3NpYmxlRXZlbnRzID0gW107XHJcblx0XHRcdGZvcih2YXIgaSBpbiBFdmVudHMuRXZlbnRQb29sKSB7XHJcblx0XHRcdFx0dmFyIGV2ZW50ID0gRXZlbnRzLkV2ZW50UG9vbFtpXTtcclxuXHRcdFx0XHRpZihldmVudC5pc0F2YWlsYWJsZSgpKSB7XHJcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0XHRwb3NzaWJsZUV2ZW50cy5wdXNoKGV2ZW50KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKHBvc3NpYmxlRXZlbnRzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRcdEV2ZW50cy5zY2hlZHVsZU5leHRFdmVudCgwLjUpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR2YXIgciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoocG9zc2libGVFdmVudHMubGVuZ3RoKSk7XHJcblx0XHRcdFx0RXZlbnRzLnN0YXJ0RXZlbnQocG9zc2libGVFdmVudHNbcl0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0RXZlbnRzLnNjaGVkdWxlTmV4dEV2ZW50KCk7XHJcblx0fSxcclxuXHJcblx0Ly8gbm90IHNjaGVkdWxlZCwgdGhpcyBpcyBmb3Igc3R1ZmYgbGlrZSBsb2NhdGlvbi1iYXNlZCByYW5kb20gZXZlbnRzIG9uIGEgYnV0dG9uIGNsaWNrXHJcblx0dHJpZ2dlckxvY2F0aW9uRXZlbnQ6IGZ1bmN0aW9uKGxvY2F0aW9uKSB7XHJcblx0XHRpZiAodGhpcy5Mb2NhdGlvbnNbbG9jYXRpb25dKSB7XHJcblx0XHRcdGlmKEV2ZW50cy5hY3RpdmVFdmVudCgpID09IG51bGwpIHtcclxuXHRcdFx0XHR2YXIgcG9zc2libGVFdmVudHM6IEFycmF5PGFueT4gPSBbXTtcclxuXHRcdFx0XHRmb3IodmFyIGkgaW4gdGhpcy5Mb2NhdGlvbnNbbG9jYXRpb25dKSB7XHJcblx0XHRcdFx0XHR2YXIgZXZlbnQgPSB0aGlzLkxvY2F0aW9uc1tsb2NhdGlvbl1baV07XHJcblx0XHRcdFx0XHRpZihldmVudC5pc0F2YWlsYWJsZSgpKSB7XHJcblx0XHRcdFx0XHRcdGlmKHR5cGVvZihldmVudC5pc1N1cGVyTGlrZWx5KSA9PSAnZnVuY3Rpb24nICYmIGV2ZW50LmlzU3VwZXJMaWtlbHkoKSkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFN1cGVyTGlrZWx5IGV2ZW50LCBkbyB0aGlzIGFuZCBza2lwIHRoZSByYW5kb20gY2hvaWNlXHJcblx0XHRcdFx0XHRcdFx0RW5naW5lLmxvZygnc3VwZXJMaWtlbHkgZGV0ZWN0ZWQnKTtcclxuXHRcdFx0XHRcdFx0XHRFdmVudHMuc3RhcnRFdmVudChldmVudCk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHBvc3NpYmxlRXZlbnRzLnB1c2goZXZlbnQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcclxuXHRcdFx0XHRpZihwb3NzaWJsZUV2ZW50cy5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHRcdC8vIEV2ZW50cy5zY2hlZHVsZU5leHRFdmVudCgwLjUpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR2YXIgciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoocG9zc2libGVFdmVudHMubGVuZ3RoKSk7XHJcblx0XHRcdFx0XHRFdmVudHMuc3RhcnRFdmVudChwb3NzaWJsZUV2ZW50c1tyXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRhY3RpdmVFdmVudDogZnVuY3Rpb24oKTogQURSRXZlbnQgfCBudWxsIHtcclxuXHRcdGlmKEV2ZW50cy5ldmVudFN0YWNrICYmIEV2ZW50cy5ldmVudFN0YWNrLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0cmV0dXJuIEV2ZW50cy5ldmVudFN0YWNrWzBdO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fSxcclxuXHRcclxuXHRldmVudFBhbmVsOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBFdmVudHMuYWN0aXZlRXZlbnQoKT8uZXZlbnRQYW5lbDtcclxuXHR9LFxyXG5cclxuXHRzdGFydEV2ZW50OiBmdW5jdGlvbihldmVudCwgb3B0aW9ucz8pIHtcclxuXHRcdGlmKGV2ZW50KSB7XHJcblx0XHRcdEVuZ2luZS5ldmVudCgnZ2FtZSBldmVudCcsICdldmVudCcpO1xyXG5cdFx0XHRFdmVudHMuZXZlbnRTdGFjay51bnNoaWZ0KGV2ZW50KTtcclxuXHRcdFx0ZXZlbnQuZXZlbnRQYW5lbCA9ICQoJzxkaXY+JykuYXR0cignaWQnLCAnZXZlbnQnKS5hZGRDbGFzcygnZXZlbnRQYW5lbCcpLmNzcygnb3BhY2l0eScsICcwJyk7XHJcblx0XHRcdGlmKG9wdGlvbnMgIT0gbnVsbCAmJiBvcHRpb25zLndpZHRoICE9IG51bGwpIHtcclxuXHRcdFx0XHRFdmVudHMuZXZlbnRQYW5lbCgpLmNzcygnd2lkdGgnLCBvcHRpb25zLndpZHRoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKCc8ZGl2PicpLmFkZENsYXNzKCdldmVudFRpdGxlJykudGV4dChFdmVudHMuYWN0aXZlRXZlbnQoKT8udGl0bGUgYXMgc3RyaW5nKS5hcHBlbmRUbyhFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdkZXNjcmlwdGlvbicpLmFwcGVuZFRvKEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2J1dHRvbnMnKS5hcHBlbmRUbyhFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdFx0RXZlbnRzLmxvYWRTY2VuZSgnc3RhcnQnKTtcclxuXHRcdFx0JCgnZGl2I3dyYXBwZXInKS5hcHBlbmQoRXZlbnRzLmV2ZW50UGFuZWwoKSk7XHJcblx0XHRcdEV2ZW50cy5ldmVudFBhbmVsKCkuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIEV2ZW50cy5fUEFORUxfRkFERSwgJ2xpbmVhcicpO1xyXG5cdFx0XHR2YXIgY3VycmVudFNjZW5lSW5mb3JtYXRpb24gPSBFdmVudHMuYWN0aXZlRXZlbnQoKT8uc2NlbmVzW0V2ZW50cy5hY3RpdmVTY2VuZV07XHJcblx0XHRcdGlmIChjdXJyZW50U2NlbmVJbmZvcm1hdGlvbi5ibGluaykge1xyXG5cdFx0XHRcdEV2ZW50cy5ibGlua1RpdGxlKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRzY2hlZHVsZU5leHRFdmVudDogZnVuY3Rpb24oc2NhbGU/KSB7XHJcblx0XHR2YXIgbmV4dEV2ZW50ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKihFdmVudHMuX0VWRU5UX1RJTUVfUkFOR0VbMV0gLSBFdmVudHMuX0VWRU5UX1RJTUVfUkFOR0VbMF0pKSArIEV2ZW50cy5fRVZFTlRfVElNRV9SQU5HRVswXTtcclxuXHRcdGlmKHNjYWxlID4gMCkgeyBuZXh0RXZlbnQgKj0gc2NhbGU7IH1cclxuXHRcdEVuZ2luZS5sb2coJ25leHQgZXZlbnQgc2NoZWR1bGVkIGluICcgKyBuZXh0RXZlbnQgKyAnIG1pbnV0ZXMnKTtcclxuXHRcdEV2ZW50cy5fZXZlbnRUaW1lb3V0ID0gRW5naW5lLnNldFRpbWVvdXQoRXZlbnRzLnRyaWdnZXJFdmVudCwgbmV4dEV2ZW50ICogNjAgKiAxMDAwKTtcclxuXHR9LFxyXG5cclxuXHRlbmRFdmVudDogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuZXZlbnRQYW5lbCgpLmFuaW1hdGUoe29wYWNpdHk6MH0sIEV2ZW50cy5fUEFORUxfRkFERSwgJ2xpbmVhcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRFdmVudHMuZXZlbnRQYW5lbCgpLnJlbW92ZSgpO1xyXG5cdFx0XHRjb25zdCBhY3RpdmVFdmVudCA9IEV2ZW50cy5hY3RpdmVFdmVudCgpO1xyXG5cdFx0XHRpZiAoYWN0aXZlRXZlbnQgIT09IG51bGwpIGFjdGl2ZUV2ZW50LmV2ZW50UGFuZWwgPSBudWxsO1xyXG5cdFx0XHRFdmVudHMuZXZlbnRTdGFjay5zaGlmdCgpO1xyXG5cdFx0XHRFbmdpbmUubG9nKEV2ZW50cy5ldmVudFN0YWNrLmxlbmd0aCArICcgZXZlbnRzIHJlbWFpbmluZycpO1xyXG5cdFx0XHRpZiAoRXZlbnRzLkJMSU5LX0lOVEVSVkFMKSB7XHJcblx0XHRcdFx0RXZlbnRzLnN0b3BUaXRsZUJsaW5rKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gRm9yY2UgcmVmb2N1cyBvbiB0aGUgYm9keS4gSSBoYXRlIHlvdSwgSUUuXHJcblx0XHRcdCQoJ2JvZHknKS5mb2N1cygpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0aGFuZGxlU3RhdGVVcGRhdGVzOiBmdW5jdGlvbihlKXtcclxuXHRcdGlmKChlLmNhdGVnb3J5ID09ICdzdG9yZXMnIHx8IGUuY2F0ZWdvcnkgPT0gJ2luY29tZScpICYmIEV2ZW50cy5hY3RpdmVFdmVudCgpICE9IG51bGwpe1xyXG5cdFx0XHRFdmVudHMudXBkYXRlQnV0dG9ucygpO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuIiwiLyoqXHJcbiAqIEV2ZW50cyB0aGF0IGNhbiBvY2N1ciB3aGVuIHRoZSBSb2FkIG1vZHVsZSBpcyBhY3RpdmVcclxuICoqL1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi4vZW5naW5lXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tIFwiLi4vcGxheWVyL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgeyBPdXRwb3N0IH0gZnJvbSBcIi4uL3BsYWNlcy9vdXRwb3N0XCI7XHJcbmltcG9ydCB7IFJvYWQgfSBmcm9tIFwiLi4vcGxhY2VzL3JvYWRcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBFdmVudHNSb2FkV2FuZGVyID0gW1xyXG4gICAgLy8gU3RyYW5nZXIgYmVhcmluZyBnaWZ0c1xyXG4gICAge1xyXG4gICAgICAgIHRpdGxlOiBfKCdBIFN0cmFuZ2VyIEJlY2tvbnMnKSxcclxuICAgICAgICBpc0F2YWlsYWJsZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBFbmdpbmUuYWN0aXZlTW9kdWxlID09IFJvYWQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgJ3N0YXJ0Jzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0FzIHlvdSB3YW5kZXIgYWxvbmcgdGhlIHJvYWQsIGEgaG9vZGVkIHN0cmFuZ2VyIGdlc3R1cmVzIHRvIHlvdS4gSGUgZG9lc25cXCd0IHNlZW0gaW50ZXJlc3RlZCBpbiBodXJ0aW5nIHlvdS4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdXaGF0IGRvIHlvdSBkbz8nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnY2xvc2VyJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdEcmF3IENsb3NlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOiAnY2xvc2VyJ31cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnR2V0IE91dHRhIFRoZXJlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6ICdsZWF2ZSd9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnY2xvc2VyJzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1lvdSBtb3ZlIHRvd2FyZCBoaW0gYSBiaXQgYW5kIHN0b3AuIEhlIGNvbnRpbnVlcyB0byBiZWNrb24uJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnV2hhdCBkbyB5b3UgZG8/JylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2V2ZW5DbG9zZXInOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0RyYXcgRXZlbiBDbG9zZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTogJ2V2ZW5DbG9zZXInfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdOYWgsIFRoaXMgaXMgVG9vIFNwb29reScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOiAnbGVhdmUnfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2V2ZW5DbG9zZXInOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgXygnWW91IGhlc2l0YW50bHkgd2FsayBjbG9zZXIuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnQXMgc29vbiBhcyB5b3UgZ2V0IHdpdGhpbiBhcm1zXFwnIHJlYWNoLCBoZSBncmFicyB5b3VyIGhhbmQgd2l0aCBhbGFybWluZyBzcGVlZC4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdIZSBxdWlja2x5IHBsYWNlcyBhbiBvYmplY3QgaW4geW91ciBoYW5kLCB0aGVuIGxlYXZlcyB3b3JkbGVzc2x5LicpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgb25Mb2FkOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBtYXliZSBzb21lIGxvZ2ljIHRvIG1ha2UgcmVwZWF0cyBsZXNzIGxpa2VseT9cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb3NzaWJsZUl0ZW1zID0gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnU3RyYW5nZXIuc21vb3RoU3RvbmUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnU3RyYW5nZXIud3JhcHBlZEtuaWZlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ1N0cmFuZ2VyLmNsb3RoQnVuZGxlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ1N0cmFuZ2VyLmNvaW4nXHJcbiAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gcG9zc2libGVJdGVtc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwb3NzaWJsZUl0ZW1zLmxlbmd0aCldO1xyXG4gICAgICAgICAgICAgICAgICAgIENoYXJhY3Rlci5hZGRUb0ludmVudG9yeShpdGVtKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1RoYW5rcywgSSBndWVzcz8nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1lvdXIgZ3V0IGNsZW5jaGVzLCBhbmQgeW91IGZlZWwgdGhlIHN1ZGRlbiB1cmdlIHRvIGxlYXZlLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0FzIHlvdSB3YWxrIGF3YXksIHlvdSBjYW4gZmVlbCB0aGUgb2xkIG1hblxcJ3MgZ2F6ZSBvbiB5b3VyIGJhY2suJylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1dlaXJkLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIFVubG9jayBPdXRwb3N0XHJcbiAgICB7XHJcbiAgICAgICAgdGl0bGU6IF8oJ0EgV2F5IEZvcndhcmQgTWFrZXMgSXRzZWxmIEtub3duJyksXHJcbiAgICAgICAgaXNBdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgKEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gUm9hZClcclxuICAgICAgICAgICAgICAgICYmICgkU00uZ2V0KCdSb2FkLmNvdW50ZXInKSBhcyBudW1iZXIgPiA2KSAvLyBjYW4ndCBoYXBwZW4gVE9PIGVhcmx5XHJcbiAgICAgICAgICAgICAgICAmJiAodHlwZW9mKCRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSkgPT0gXCJ1bmRlZmluZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgIHx8ICRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPCAxKSAvLyBjYW4ndCBoYXBwZW4gdHdpY2VcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGlzU3VwZXJMaWtlbHk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gKCRTTS5nZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snKSBhcyBudW1iZXIgPCAxKSAmJiAoJFNNLmdldCgnUm9hZC5jb3VudGVyJykgYXMgbnVtYmVyID4gMTApO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICdzdGFydCc6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdTbW9rZSBjdXJscyB1cHdhcmRzIGZyb20gYmVoaW5kIGEgaGlsbC4gWW91IGNsaW1iIGhpZ2hlciB0byBpbnZlc3RpZ2F0ZS4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdGcm9tIHlvdXIgZWxldmF0ZWQgcG9zaXRpb24sIHlvdSBjYW4gc2VlIGRvd24gaW50byB0aGUgb3V0cG9zdCB0aGF0IHRoZSBtYXlvciBzcG9rZSBvZiBiZWZvcmUuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnVGhlIE91dHBvc3QgaXMgbm93IG9wZW4gdG8geW91LicpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBIGxpdHRsZSBkcmFtYXRpYywgYnV0IGNvb2wnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgT3V0cG9zdC5pbml0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkU00uc2V0KCdzdXBlcmxpa2VseS5vdXRwb3N0VW5sb2NrJywgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5dO1xyXG5cclxuIiwiLyoqXHJcbiAqIEV2ZW50cyB0aGF0IGNhbiBvY2N1ciB3aGVuIHRoZSBSb29tIG1vZHVsZSBpcyBhY3RpdmVcclxuICoqL1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi4vZW5naW5lXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IFJvb20gfSBmcm9tICcuLi9wbGFjZXMvcm9vbSc7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEV2ZW50c1Jvb20gPSBbXHJcblx0eyAvKiBUaGUgTm9tYWQgIC0tICBNZXJjaGFudCAqL1xyXG5cdFx0dGl0bGU6IF8oJ1RoZSBOb21hZCcpLFxyXG5cdFx0aXNBdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSBSb29tICYmICRTTS5nZXQoJ3N0b3Jlcy5mdXInLCB0cnVlKSBhcyBudW1iZXIgPiAwO1xyXG5cdFx0fSxcclxuXHRcdHNjZW5lczoge1xyXG5cdFx0XHQnc3RhcnQnOiB7XHJcblx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XygnYSBub21hZCBzaHVmZmxlcyBpbnRvIHZpZXcsIGxhZGVuIHdpdGggbWFrZXNoaWZ0IGJhZ3MgYm91bmQgd2l0aCByb3VnaCB0d2luZS4nKSxcclxuXHRcdFx0XHRcdF8oXCJ3b24ndCBzYXkgZnJvbSB3aGVyZSBoZSBjYW1lLCBidXQgaXQncyBjbGVhciB0aGF0IGhlJ3Mgbm90IHN0YXlpbmcuXCIpXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRub3RpZmljYXRpb246IF8oJ2Egbm9tYWQgYXJyaXZlcywgbG9va2luZyB0byB0cmFkZScpLFxyXG5cdFx0XHRcdGJsaW5rOiB0cnVlLFxyXG5cdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdCdidXlTY2FsZXMnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ2J1eSBzY2FsZXMnKSxcclxuXHRcdFx0XHRcdFx0Y29zdDogeyAnZnVyJzogMTAwIH0sXHJcblx0XHRcdFx0XHRcdHJld2FyZDogeyAnc2NhbGVzJzogMSB9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J2J1eVRlZXRoJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdidXkgdGVldGgnKSxcclxuXHRcdFx0XHRcdFx0Y29zdDogeyAnZnVyJzogMjAwIH0sXHJcblx0XHRcdFx0XHRcdHJld2FyZDogeyAndGVldGgnOiAxIH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnYnV5QmFpdCc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnYnV5IGJhaXQnKSxcclxuXHRcdFx0XHRcdFx0Y29zdDogeyAnZnVyJzogNSB9LFxyXG5cdFx0XHRcdFx0XHRyZXdhcmQ6IHsgJ2JhaXQnOiAxIH0sXHJcblx0XHRcdFx0XHRcdG5vdGlmaWNhdGlvbjogXygndHJhcHMgYXJlIG1vcmUgZWZmZWN0aXZlIHdpdGggYmFpdC4nKVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCdnb29kYnllJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdzYXkgZ29vZGJ5ZScpLFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSwgXHJcblx0eyAvKiBOb2lzZXMgT3V0c2lkZSAgLS0gIGdhaW4gd29vZC9mdXIgKi9cclxuXHRcdHRpdGxlOiBfKCdOb2lzZXMnKSxcclxuXHRcdGlzQXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gUm9vbSAmJiAkU00uZ2V0KCdzdG9yZXMud29vZCcpO1xyXG5cdFx0fSxcclxuXHRcdHNjZW5lczoge1xyXG5cdFx0XHQnc3RhcnQnOiB7XHJcblx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XygndGhyb3VnaCB0aGUgd2FsbHMsIHNodWZmbGluZyBub2lzZXMgY2FuIGJlIGhlYXJkLicpLFxyXG5cdFx0XHRcdFx0XyhcImNhbid0IHRlbGwgd2hhdCB0aGV5J3JlIHVwIHRvLlwiKVxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdFx0bm90aWZpY2F0aW9uOiBfKCdzdHJhbmdlIG5vaXNlcyBjYW4gYmUgaGVhcmQgdGhyb3VnaCB0aGUgd2FsbHMnKSxcclxuXHRcdFx0XHRibGluazogdHJ1ZSxcclxuXHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHQnaW52ZXN0aWdhdGUnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ2ludmVzdGlnYXRlJyksXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogeyAwLjM6ICdzdHVmZicsIDE6ICdub3RoaW5nJyB9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J2lnbm9yZSc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnaWdub3JlIHRoZW0nKSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0J25vdGhpbmcnOiB7XHJcblx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XygndmFndWUgc2hhcGVzIG1vdmUsIGp1c3Qgb3V0IG9mIHNpZ2h0LicpLFxyXG5cdFx0XHRcdFx0XygndGhlIHNvdW5kcyBzdG9wLicpXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHQnYmFja2luc2lkZSc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnZ28gYmFjayBpbnNpZGUnKSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0J3N0dWZmJzoge1xyXG5cdFx0XHRcdHJld2FyZDogeyB3b29kOiAxMDAsIGZ1cjogMTAgfSxcclxuXHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRfKCdhIGJ1bmRsZSBvZiBzdGlja3MgbGllcyBqdXN0IGJleW9uZCB0aGUgdGhyZXNob2xkLCB3cmFwcGVkIGluIGNvYXJzZSBmdXJzLicpLFxyXG5cdFx0XHRcdFx0XygndGhlIG5pZ2h0IGlzIHNpbGVudC4nKVxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0J2JhY2tpbnNpZGUnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ2dvIGJhY2sgaW5zaWRlJyksXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdHsgLyogVGhlIEJlZ2dhciAgLS0gIHRyYWRlIGZ1ciBmb3IgYmV0dGVyIGdvb2QgKi9cclxuXHRcdHRpdGxlOiBfKCdUaGUgQmVnZ2FyJyksXHJcblx0XHRpc0F2YWlsYWJsZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiBFbmdpbmUuYWN0aXZlTW9kdWxlID09IFJvb20gJiYgJFNNLmdldCgnc3RvcmVzLmZ1cicpO1xyXG5cdFx0fSxcclxuXHRcdHNjZW5lczoge1xyXG5cdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdF8oJ2EgYmVnZ2FyIGFycml2ZXMuJyksXHJcblx0XHRcdFx0XHRfKCdhc2tzIGZvciBhbnkgc3BhcmUgZnVycyB0byBrZWVwIGhpbSB3YXJtIGF0IG5pZ2h0LicpXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRub3RpZmljYXRpb246IF8oJ2EgYmVnZ2FyIGFycml2ZXMnKSxcclxuXHRcdFx0XHRibGluazogdHJ1ZSxcclxuXHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHQnNTBmdXJzJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdnaXZlIDUwJyksXHJcblx0XHRcdFx0XHRcdGNvc3Q6IHtmdXI6IDUwfSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7IDAuNTogJ3NjYWxlcycsIDAuODogJ3RlZXRoJywgMTogJ2Nsb3RoJyB9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0JzEwMGZ1cnMnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ2dpdmUgMTAwJyksXHJcblx0XHRcdFx0XHRcdGNvc3Q6IHtmdXI6IDEwMH0sXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogeyAwLjU6ICd0ZWV0aCcsIDAuODogJ3NjYWxlcycsIDE6ICdjbG90aCcgfVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCdkZW55Jzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCd0dXJuIGhpbSBhd2F5JyksXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHNjYWxlczoge1xyXG5cdFx0XHRcdHJld2FyZDogeyBzY2FsZXM6IDIwIH0sXHJcblx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XygndGhlIGJlZ2dhciBleHByZXNzZXMgaGlzIHRoYW5rcy4nKSxcclxuXHRcdFx0XHRcdF8oJ2xlYXZlcyBhIHBpbGUgb2Ygc21hbGwgc2NhbGVzIGJlaGluZC4nKVxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdzYXkgZ29vZGJ5ZScpLFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR0ZWV0aDoge1xyXG5cdFx0XHRcdHJld2FyZDogeyB0ZWV0aDogMjAgfSxcclxuXHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRfKCd0aGUgYmVnZ2FyIGV4cHJlc3NlcyBoaXMgdGhhbmtzLicpLFxyXG5cdFx0XHRcdFx0XygnbGVhdmVzIGEgcGlsZSBvZiBzbWFsbCB0ZWV0aCBiZWhpbmQuJylcclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdCdsZWF2ZSc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnc2F5IGdvb2RieWUnKSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0Y2xvdGg6IHtcclxuXHRcdFx0XHRyZXdhcmQ6IHsgY2xvdGg6IDIwIH0sXHJcblx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XygndGhlIGJlZ2dhciBleHByZXNzZXMgaGlzIHRoYW5rcy4nKSxcclxuXHRcdFx0XHRcdF8oJ2xlYXZlcyBzb21lIHNjcmFwcyBvZiBjbG90aCBiZWhpbmQuJylcclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdCdsZWF2ZSc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnc2F5IGdvb2RieWUnKSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0eyAvKiBUaGUgU2NvdXQgIC0tICBNYXAgTWVyY2hhbnQgKi9cclxuXHRcdHRpdGxlOiBfKCdUaGUgU2NvdXQnKSxcclxuXHRcdGlzQXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gUm9vbSAmJiAkU00uZ2V0KCdmZWF0dXJlcy5sb2NhdGlvbi53b3JsZCcpO1xyXG5cdFx0fSxcclxuXHRcdHNjZW5lczoge1xyXG5cdFx0XHQnc3RhcnQnOiB7XHJcblx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XyhcInRoZSBzY291dCBzYXlzIHNoZSdzIGJlZW4gYWxsIG92ZXIuXCIpLFxyXG5cdFx0XHRcdFx0XyhcIndpbGxpbmcgdG8gdGFsayBhYm91dCBpdCwgZm9yIGEgcHJpY2UuXCIpXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRub3RpZmljYXRpb246IF8oJ2Egc2NvdXQgc3RvcHMgZm9yIHRoZSBuaWdodCcpLFxyXG5cdFx0XHRcdGJsaW5rOiB0cnVlLFxyXG5cdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdCdidXlNYXAnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ2J1eSBtYXAnKSxcclxuXHRcdFx0XHRcdFx0Y29zdDogeyAnZnVyJzogMjAwLCAnc2NhbGVzJzogMTAgfSxcclxuXHRcdFx0XHRcdFx0bm90aWZpY2F0aW9uOiBfKCd0aGUgbWFwIHVuY292ZXJzIGEgYml0IG9mIHRoZSB3b3JsZCcpLFxyXG5cdFx0XHRcdFx0XHQvLyBvbkNob29zZTogV29ybGQuYXBwbHlNYXBcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnbGVhcm4nOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ2xlYXJuIHNjb3V0aW5nJyksXHJcblx0XHRcdFx0XHRcdGNvc3Q6IHsgJ2Z1cic6IDEwMDAsICdzY2FsZXMnOiA1MCwgJ3RlZXRoJzogMjAgfSxcclxuXHRcdFx0XHRcdFx0YXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gISRTTS5oYXNQZXJrKCdzY291dCcpO1xyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0JFNNLmFkZFBlcmsoJ3Njb3V0Jyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnbGVhdmUnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ3NheSBnb29kYnllJyksXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdHsgLyogVGhlIFdhbmRlcmluZyBNYXN0ZXIgKi9cclxuXHRcdHRpdGxlOiBfKCdUaGUgTWFzdGVyJyksXHJcblx0XHRpc0F2YWlsYWJsZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiBFbmdpbmUuYWN0aXZlTW9kdWxlID09IFJvb20gJiYgJFNNLmdldCgnZmVhdHVyZXMubG9jYXRpb24ud29ybGQnKTtcclxuXHRcdH0sXHJcblx0XHRzY2VuZXM6IHtcclxuXHRcdFx0J3N0YXJ0Jzoge1xyXG5cdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdF8oJ2FuIG9sZCB3YW5kZXJlciBhcnJpdmVzLicpLFxyXG5cdFx0XHRcdFx0XygnaGUgc21pbGVzIHdhcm1seSBhbmQgYXNrcyBmb3IgbG9kZ2luZ3MgZm9yIHRoZSBuaWdodC4nKVxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdFx0bm90aWZpY2F0aW9uOiBfKCdhbiBvbGQgd2FuZGVyZXIgYXJyaXZlcycpLFxyXG5cdFx0XHRcdGJsaW5rOiB0cnVlLFxyXG5cdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdCdhZ3JlZSc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnYWdyZWUnKSxcclxuXHRcdFx0XHRcdFx0Y29zdDoge1xyXG5cdFx0XHRcdFx0XHRcdCdjdXJlZCBtZWF0JzogMTAwLFxyXG5cdFx0XHRcdFx0XHRcdCdmdXInOiAxMDAsXHJcblx0XHRcdFx0XHRcdFx0J3RvcmNoJzogMVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnYWdyZWUnfVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCdkZW55Jzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCd0dXJuIGhpbSBhd2F5JyksXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdCdhZ3JlZSc6IHtcclxuXHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRfKCdpbiBleGNoYW5nZSwgdGhlIHdhbmRlcmVyIG9mZmVycyBoaXMgd2lzZG9tLicpXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHQnZXZhc2lvbic6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnZXZhc2lvbicpLFxyXG5cdFx0XHRcdFx0XHRhdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiAhJFNNLmhhc1BlcmsoJ2V2YXNpdmUnKTtcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0b25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdCRTTS5hZGRQZXJrKCdldmFzaXZlJyk7XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQncHJlY2lzaW9uJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdwcmVjaXNpb24nKSxcclxuXHRcdFx0XHRcdFx0YXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gISRTTS5oYXNQZXJrKCdwcmVjaXNlJyk7XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHQkU00uYWRkUGVyaygncHJlY2lzZScpO1xyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J2ZvcmNlJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdmb3JjZScpLFxyXG5cdFx0XHRcdFx0XHRhdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiAhJFNNLmhhc1BlcmsoJ2JhcmJhcmlhbicpO1xyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0JFNNLmFkZFBlcmsoJ2JhcmJhcmlhbicpO1xyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J25vdGhpbmcnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ25vdGhpbmcnKSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXTtcclxuIiwiLyoqXHJcbiAqIE1vZHVsZSB0aGF0IHRha2VzIGNhcmUgb2YgaGVhZGVyIGJ1dHRvbnNcclxuICovXHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuL2VuZ2luZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEhlYWRlciA9IHtcclxuXHRcclxuXHRpbml0OiBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdH0sXHJcblx0XHJcblx0b3B0aW9uczoge30sIC8vIE5vdGhpbmcgZm9yIG5vd1xyXG5cdFxyXG5cdGNhblRyYXZlbDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gJCgnZGl2I2hlYWRlciBkaXYuaGVhZGVyQnV0dG9uJykubGVuZ3RoID4gMTtcclxuXHR9LFxyXG5cdFxyXG5cdGFkZExvY2F0aW9uOiBmdW5jdGlvbih0ZXh0LCBpZCwgbW9kdWxlKSB7XHJcblx0XHRyZXR1cm4gJCgnPGRpdj4nKS5hdHRyKCdpZCcsIFwibG9jYXRpb25fXCIgKyBpZClcclxuXHRcdFx0LmFkZENsYXNzKCdoZWFkZXJCdXR0b24nKVxyXG5cdFx0XHQudGV4dCh0ZXh0KS5jbGljayhmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZihIZWFkZXIuY2FuVHJhdmVsKCkpIHtcclxuXHRcdFx0XHRcdEVuZ2luZS50cmF2ZWxUbyhtb2R1bGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSkuYXBwZW5kVG8oJCgnZGl2I2hlYWRlcicpKTtcclxuXHR9XHJcbn07IiwiLyoqXHJcbiAqIE1vZHVsZSB0aGF0IHJlZ2lzdGVycyB0aGUgbm90aWZpY2F0aW9uIGJveCBhbmQgaGFuZGxlcyBtZXNzYWdlc1xyXG4gKi9cclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4vZW5naW5lXCI7XHJcblxyXG5leHBvcnQgY29uc3QgTm90aWZpY2F0aW9ucyA9IHtcclxuXHRcdFxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdFx0XHJcblx0XHQvLyBDcmVhdGUgdGhlIG5vdGlmaWNhdGlvbnMgYm94XHJcblx0XHRjb25zdCBlbGVtID0gJCgnPGRpdj4nKS5hdHRyKHtcclxuXHRcdFx0aWQ6ICdub3RpZmljYXRpb25zJyxcclxuXHRcdFx0Y2xhc3NOYW1lOiAnbm90aWZpY2F0aW9ucydcclxuXHRcdH0pO1xyXG5cdFx0Ly8gQ3JlYXRlIHRoZSB0cmFuc3BhcmVuY3kgZ3JhZGllbnRcclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnbm90aWZ5R3JhZGllbnQnKS5hcHBlbmRUbyhlbGVtKTtcclxuXHRcdFxyXG5cdFx0ZWxlbS5hcHBlbmRUbygnZGl2I3dyYXBwZXInKTtcclxuXHR9LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHt9LCAvLyBOb3RoaW5nIGZvciBub3dcclxuXHRcclxuXHRlbGVtOiBudWxsLFxyXG5cdFxyXG5cdG5vdGlmeVF1ZXVlOiB7fSxcclxuXHRcclxuXHQvLyBBbGxvdyBub3RpZmljYXRpb24gdG8gdGhlIHBsYXllclxyXG5cdG5vdGlmeTogZnVuY3Rpb24obW9kdWxlLCB0ZXh0LCBub1F1ZXVlPykge1xyXG5cdFx0aWYodHlwZW9mIHRleHQgPT0gJ3VuZGVmaW5lZCcpIHJldHVybjtcclxuXHRcdC8vIEkgZG9uJ3QgbmVlZCB5b3UgcHVuY3R1YXRpbmcgZm9yIG1lLCBmdW5jdGlvbi5cclxuXHRcdC8vIGlmKHRleHQuc2xpY2UoLTEpICE9IFwiLlwiKSB0ZXh0ICs9IFwiLlwiO1xyXG5cdFx0aWYobW9kdWxlICE9IG51bGwgJiYgRW5naW5lLmFjdGl2ZU1vZHVsZSAhPSBtb2R1bGUpIHtcclxuXHRcdFx0aWYoIW5vUXVldWUpIHtcclxuXHRcdFx0XHRpZih0eXBlb2YgdGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdID09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0XHR0aGlzLm5vdGlmeVF1ZXVlW21vZHVsZV0gPSBbXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdLnB1c2godGV4dCk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdE5vdGlmaWNhdGlvbnMucHJpbnRNZXNzYWdlKHRleHQpO1xyXG5cdFx0fVxyXG5cdFx0RW5naW5lLnNhdmVHYW1lKCk7XHJcblx0fSxcclxuXHRcclxuXHRjbGVhckhpZGRlbjogZnVuY3Rpb24oKSB7XHJcblx0XHJcblx0XHQvLyBUbyBmaXggc29tZSBtZW1vcnkgdXNhZ2UgaXNzdWVzLCB3ZSBjbGVhciBub3RpZmljYXRpb25zIHRoYXQgaGF2ZSBiZWVuIGhpZGRlbi5cclxuXHRcdFxyXG5cdFx0Ly8gV2UgdXNlIHBvc2l0aW9uKCkudG9wIGhlcmUsIGJlY2F1c2Ugd2Uga25vdyB0aGF0IHRoZSBwYXJlbnQgd2lsbCBiZSB0aGUgc2FtZSwgc28gdGhlIHBvc2l0aW9uIHdpbGwgYmUgdGhlIHNhbWUuXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHR2YXIgYm90dG9tID0gJCgnI25vdGlmeUdyYWRpZW50JykucG9zaXRpb24oKS50b3AgKyAkKCcjbm90aWZ5R3JhZGllbnQnKS5vdXRlckhlaWdodCh0cnVlKTtcclxuXHRcdFxyXG5cdFx0JCgnLm5vdGlmaWNhdGlvbicpLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcclxuXHRcdFx0aWYoJCh0aGlzKS5wb3NpdGlvbigpLnRvcCA+IGJvdHRvbSl7XHJcblx0XHRcdFx0JCh0aGlzKS5yZW1vdmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdH0sXHJcblx0XHJcblx0cHJpbnRNZXNzYWdlOiBmdW5jdGlvbih0KSB7XHJcblx0XHR2YXIgdGV4dCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ25vdGlmaWNhdGlvbicpLmNzcygnb3BhY2l0eScsICcwJykudGV4dCh0KS5wcmVwZW5kVG8oJ2RpdiNub3RpZmljYXRpb25zJyk7XHJcblx0XHR0ZXh0LmFuaW1hdGUoe29wYWNpdHk6IDF9LCA1MDAsICdsaW5lYXInLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly8gRG8gdGhpcyBldmVyeSB0aW1lIHdlIGFkZCBhIG5ldyBtZXNzYWdlLCB0aGlzIHdheSB3ZSBuZXZlciBoYXZlIGEgbGFyZ2UgYmFja2xvZyB0byBpdGVyYXRlIHRocm91Z2guIEtlZXBzIHRoaW5ncyBmYXN0ZXIuXHJcblx0XHRcdE5vdGlmaWNhdGlvbnMuY2xlYXJIaWRkZW4oKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0XHJcblx0cHJpbnRRdWV1ZTogZnVuY3Rpb24obW9kdWxlKSB7XHJcblx0XHRpZih0eXBlb2YgdGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdICE9ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdHdoaWxlKHRoaXMubm90aWZ5UXVldWVbbW9kdWxlXS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9ucy5wcmludE1lc3NhZ2UodGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdLnNoaWZ0KCkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCB7IEVuZ2luZSB9IGZyb20gJy4uL2VuZ2luZSc7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gJy4uL3N0YXRlX21hbmFnZXInO1xyXG5pbXBvcnQgeyBXZWF0aGVyIH0gZnJvbSAnLi4vd2VhdGhlcic7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCB7IENhcHRhaW4gfSBmcm9tICcuLi9jaGFyYWN0ZXJzL2NhcHRhaW4nO1xyXG5pbXBvcnQgeyBIZWFkZXIgfSBmcm9tICcuLi9oZWFkZXInO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSAnLi4vLi4vbGliL3RyYW5zbGF0ZSc7XHJcblxyXG5leHBvcnQgY29uc3QgT3V0cG9zdCA9IHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBPdXRwb3N0IHRhYlxyXG4gICAgICAgIHRoaXMudGFiID0gSGVhZGVyLmFkZExvY2F0aW9uKF8oXCJUaGUgT3V0cG9zdFwiKSwgXCJvdXRwb3N0XCIsIE91dHBvc3QpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgdGhlIE91dHBvc3QgcGFuZWxcclxuXHRcdHRoaXMucGFuZWwgPSAkKCc8ZGl2PicpXHJcbiAgICAgICAgLmF0dHIoJ2lkJywgXCJvdXRwb3N0UGFuZWxcIilcclxuICAgICAgICAuYWRkQ2xhc3MoJ2xvY2F0aW9uJylcclxuICAgICAgICAuYXBwZW5kVG8oJ2RpdiNsb2NhdGlvblNsaWRlcicpO1xyXG5cclxuICAgICAgICBFbmdpbmUudXBkYXRlU2xpZGVyKCk7XHJcblxyXG4gICAgICAgIC8vIG5ldyBcclxuXHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogJ2NhcHRhaW5CdXR0b24nLFxyXG5cdFx0XHR0ZXh0OiBfKCdTcGVhayB3aXRoIFRoZSBDYXB0YWluJyksXHJcblx0XHRcdGNsaWNrOiBDYXB0YWluLnRhbGtUb0NhcHRhaW4sXHJcblx0XHRcdHdpZHRoOiAnODBweCdcclxuXHRcdH0pLmFwcGVuZFRvKCdkaXYjb3V0cG9zdFBhbmVsJyk7XHJcblxyXG4gICAgICAgIE91dHBvc3QudXBkYXRlQnV0dG9uKCk7XHJcblxyXG4gICAgICAgIC8vIHNldHRpbmcgdGhpcyBzZXBhcmF0ZWx5IHNvIHRoYXQgcXVlc3Qgc3RhdHVzIGNhbid0IGFjY2lkZW50YWxseSBicmVhayBpdCBsYXRlclxyXG4gICAgICAgICRTTS5zZXQoJ291dHBvc3Qub3BlbicsIDEpOyBcclxuICAgIH0sXHJcblxyXG4gICAgYXZhaWxhYmxlV2VhdGhlcjoge1xyXG5cdFx0J3N1bm55JzogMC40LFxyXG5cdFx0J2Nsb3VkeSc6IDAuMyxcclxuXHRcdCdyYWlueSc6IDAuM1xyXG5cdH0sXHJcblxyXG4gICAgb25BcnJpdmFsOiBmdW5jdGlvbih0cmFuc2l0aW9uX2RpZmYpIHtcclxuICAgICAgICBPdXRwb3N0LnNldFRpdGxlKCk7XHJcblxyXG5cdFx0RW5naW5lLm1vdmVTdG9yZXNWaWV3KG51bGwsIHRyYW5zaXRpb25fZGlmZik7XHJcblxyXG4gICAgICAgIFdlYXRoZXIuaW5pdGlhdGVXZWF0aGVyKE91dHBvc3QuYXZhaWxhYmxlV2VhdGhlciwgJ291dHBvc3QnKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0VGl0bGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRpdGxlID0gXyhcIlRoZSBPdXRwb3N0XCIpO1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSB0aGlzKSB7XHJcblx0XHRcdGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XHJcblx0XHR9XHJcblx0XHQkKCdkaXYjbG9jYXRpb25fb3V0cG9zdCcpLnRleHQodGl0bGUpO1xyXG5cdH0sXHJcblxyXG4gICAgdXBkYXRlQnV0dG9uOiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIGNvbmRpdGlvbmFscyBmb3IgdXBkYXRpbmcgYnV0dG9uc1xyXG5cdH0sXHJcblxyXG4gICAgLy8gZG9uJ3QgbmVlZCB0aGlzIHlldCAob3IgbWF5YmUgZXZlcilcclxuXHQvLyB3YW5kZXJFdmVudDogZnVuY3Rpb24oKSB7XHJcblx0Ly8gXHRFdmVudHMudHJpZ2dlckxvY2F0aW9uRXZlbnQoJ091dHBvc3RXYW5kZXInKTtcclxuXHQvLyBcdCRTTS5hZGQoJ091dHBvc3QuY291bnRlcicsIDEpO1xyXG5cdC8vIH1cclxufSIsImltcG9ydCB7IEhlYWRlciB9IGZyb20gXCIuLi9oZWFkZXJcIjtcclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4uL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi4vQnV0dG9uXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyBXZWF0aGVyIH0gZnJvbSBcIi4uL3dlYXRoZXJcIjtcclxuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IFJvYWQgPSB7XHJcbiAgICBpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgUm9hZCB0YWJcclxuICAgICAgICB0aGlzLnRhYiA9IEhlYWRlci5hZGRMb2NhdGlvbihfKFwiUm9hZCB0byB0aGUgT3V0cG9zdFwiKSwgXCJyb2FkXCIsIFJvYWQpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgdGhlIFJvYWQgcGFuZWxcclxuXHRcdHRoaXMucGFuZWwgPSAkKCc8ZGl2PicpXHJcbiAgICAgICAgLmF0dHIoJ2lkJywgXCJyb2FkUGFuZWxcIilcclxuICAgICAgICAuYWRkQ2xhc3MoJ2xvY2F0aW9uJylcclxuICAgICAgICAuYXBwZW5kVG8oJ2RpdiNsb2NhdGlvblNsaWRlcicpO1xyXG5cclxuICAgICAgICBFbmdpbmUudXBkYXRlU2xpZGVyKCk7XHJcblxyXG4gICAgICAgIC8vbmV3IFxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAnd2FuZGVyQnV0dG9uJyxcclxuXHRcdFx0dGV4dDogXygnV2FuZGVyIEFyb3VuZCcpLFxyXG5cdFx0XHRjbGljazogUm9hZC53YW5kZXJFdmVudCxcclxuXHRcdFx0d2lkdGg6ICc4MHB4JyxcclxuXHRcdFx0Y29zdDoge30gLy8gVE9ETzogbWFrZSB0aGVyZSBiZSBhIGNvc3QgdG8gZG9pbmcgc3R1ZmY/XHJcblx0XHR9KS5hcHBlbmRUbygnZGl2I3JvYWRQYW5lbCcpO1xyXG5cclxuICAgICAgICBSb2FkLnVwZGF0ZUJ1dHRvbigpO1xyXG5cclxuICAgICAgICAvLyBzZXR0aW5nIHRoaXMgc2VwYXJhdGVseSBzbyB0aGF0IHF1ZXN0IHN0YXR1cyBjYW4ndCBhY2NpZGVudGFsbHkgYnJlYWsgaXQgbGF0ZXJcclxuICAgICAgICAkU00uc2V0KCdyb2FkLm9wZW4nLCAxKTsgXHJcbiAgICB9LFxyXG5cclxuICAgIGF2YWlsYWJsZVdlYXRoZXI6IHtcclxuXHRcdCdzdW5ueSc6IDAuNCxcclxuXHRcdCdjbG91ZHknOiAwLjMsXHJcblx0XHQncmFpbnknOiAwLjNcclxuXHR9LFxyXG5cclxuICAgIG9uQXJyaXZhbDogZnVuY3Rpb24odHJhbnNpdGlvbl9kaWZmKSB7XHJcbiAgICAgICAgUm9hZC5zZXRUaXRsZSgpO1xyXG5cclxuXHRcdEVuZ2luZS5tb3ZlU3RvcmVzVmlldyhudWxsLCB0cmFuc2l0aW9uX2RpZmYpO1xyXG5cclxuICAgICAgICBXZWF0aGVyLmluaXRpYXRlV2VhdGhlcihSb2FkLmF2YWlsYWJsZVdlYXRoZXIsICdyb2FkJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldFRpdGxlOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0aXRsZSA9IF8oXCJSb2FkIHRvIHRoZSBPdXRwb3N0XCIpO1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSB0aGlzKSB7XHJcblx0XHRcdGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XHJcblx0XHR9XHJcblx0XHQkKCdkaXYjbG9jYXRpb25fcm9hZCcpLnRleHQodGl0bGUpO1xyXG5cdH0sXHJcblxyXG4gICAgdXBkYXRlQnV0dG9uOiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIGNvbmRpdGlvbmFscyBmb3IgdXBkYXRpbmcgYnV0dG9uc1xyXG5cdH0sXHJcblxyXG5cdHdhbmRlckV2ZW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy50cmlnZ2VyTG9jYXRpb25FdmVudCgnUm9hZFdhbmRlcicpO1xyXG5cdFx0JFNNLmFkZCgnUm9hZC5jb3VudGVyJywgMSk7XHJcblx0fVxyXG59IiwiLyoqXHJcbiAqIE1vZHVsZSB0aGF0IHJlZ2lzdGVycyB0aGUgc2ltcGxlIHJvb20gZnVuY3Rpb25hbGl0eVxyXG4gKi9cclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4uL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi4vQnV0dG9uXCI7XHJcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tIFwiLi4vbm90aWZpY2F0aW9uc1wiO1xyXG5pbXBvcnQgeyBXZWF0aGVyIH0gZnJvbSBcIi4uL3dlYXRoZXJcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IEhlYWRlciB9IGZyb20gXCIuLi9oZWFkZXJcIjtcclxuaW1wb3J0IHsgTGl6IH0gZnJvbSBcIi4uL2NoYXJhY3RlcnMvbGl6XCI7XHJcbmltcG9ydCB7IE1heW9yIH0gZnJvbSBcIi4uL2NoYXJhY3RlcnMvbWF5b3JcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBSb29tID0ge1xyXG5cdC8vIHRpbWVzIGluIChtaW51dGVzICogc2Vjb25kcyAqIG1pbGxpc2Vjb25kcylcclxuXHRfRklSRV9DT09MX0RFTEFZOiA1ICogNjAgKiAxMDAwLCAvLyB0aW1lIGFmdGVyIGEgc3Rva2UgYmVmb3JlIHRoZSBmaXJlIGNvb2xzXHJcblx0X1JPT01fV0FSTV9ERUxBWTogMzAgKiAxMDAwLCAvLyB0aW1lIGJldHdlZW4gcm9vbSB0ZW1wZXJhdHVyZSB1cGRhdGVzXHJcblx0X0JVSUxERVJfU1RBVEVfREVMQVk6IDAuNSAqIDYwICogMTAwMCwgLy8gdGltZSBiZXR3ZWVuIGJ1aWxkZXIgc3RhdGUgdXBkYXRlc1xyXG5cdF9TVE9LRV9DT09MRE9XTjogMTAsIC8vIGNvb2xkb3duIHRvIHN0b2tlIHRoZSBmaXJlXHJcblx0X05FRURfV09PRF9ERUxBWTogMTUgKiAxMDAwLCAvLyBmcm9tIHdoZW4gdGhlIHN0cmFuZ2VyIHNob3dzIHVwLCB0byB3aGVuIHlvdSBuZWVkIHdvb2RcclxuXHRcclxuXHRidXR0b25zOnt9LFxyXG5cdFxyXG5cdGNoYW5nZWQ6IGZhbHNlLFxyXG5cdFxyXG5cdG5hbWU6IF8oXCJSb29tXCIpLFxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdFx0XHJcblx0XHRpZihFbmdpbmUuX2RlYnVnKSB7XHJcblx0XHRcdHRoaXMuX1JPT01fV0FSTV9ERUxBWSA9IDUwMDA7XHJcblx0XHRcdHRoaXMuX0JVSUxERVJfU1RBVEVfREVMQVkgPSA1MDAwO1xyXG5cdFx0XHR0aGlzLl9TVE9LRV9DT09MRE9XTiA9IDA7XHJcblx0XHRcdHRoaXMuX05FRURfV09PRF9ERUxBWSA9IDUwMDA7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIENyZWF0ZSB0aGUgcm9vbSB0YWJcclxuXHRcdHRoaXMudGFiID0gSGVhZGVyLmFkZExvY2F0aW9uKF8oXCJBIENoaWxsIFZpbGxhZ2VcIiksIFwicm9vbVwiLCBSb29tKTtcclxuXHRcdFxyXG5cdFx0Ly8gQ3JlYXRlIHRoZSBSb29tIHBhbmVsXHJcblx0XHR0aGlzLnBhbmVsID0gJCgnPGRpdj4nKVxyXG5cdFx0XHQuYXR0cignaWQnLCBcInJvb21QYW5lbFwiKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2xvY2F0aW9uJylcclxuXHRcdFx0LmFwcGVuZFRvKCdkaXYjbG9jYXRpb25TbGlkZXInKTtcclxuXHRcdFxyXG5cdFx0RW5naW5lLnVwZGF0ZVNsaWRlcigpO1xyXG5cclxuXHRcdC8vbmV3IFxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAndGFsa0J1dHRvbicsXHJcblx0XHRcdHRleHQ6IF8oJ1RhbGsgdG8gdGhlIE1heW9yJyksXHJcblx0XHRcdGNsaWNrOiBNYXlvci50YWxrVG9NYXlvcixcclxuXHRcdFx0d2lkdGg6ICc4MHB4JyxcclxuXHRcdFx0Y29zdDoge31cclxuXHRcdH0pLmFwcGVuZFRvKCdkaXYjcm9vbVBhbmVsJyk7XHJcblxyXG5cdFx0Ly9uZXcgXHJcblx0XHRCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6ICdsaXpCdXR0b24nLFxyXG5cdFx0XHR0ZXh0OiBfKCdUYWxrIHRvIExpeicpLFxyXG5cdFx0XHRjbGljazogTGl6LnRhbGtUb0xpeixcclxuXHRcdFx0d2lkdGg6ICc4MHB4JyxcclxuXHRcdFx0Y29zdDoge31cclxuXHRcdH0pLmFwcGVuZFRvKCdkaXYjcm9vbVBhbmVsJyk7XHJcblxyXG5cdFx0dmFyIGxpekJ1dHRvbiA9ICQoJyNsaXpCdXR0b24uYnV0dG9uJyk7XHJcblx0XHRsaXpCdXR0b24uaGlkZSgpO1xyXG5cdFx0XHJcblx0XHQvLyBDcmVhdGUgdGhlIHN0b3JlcyBjb250YWluZXJcclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnc3RvcmVzQ29udGFpbmVyJykuYXBwZW5kVG8oJ2RpdiNyb29tUGFuZWwnKTtcclxuXHRcdFxyXG5cdFx0Ly9zdWJzY3JpYmUgdG8gc3RhdGVVcGRhdGVzXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHQkLkRpc3BhdGNoKCdzdGF0ZVVwZGF0ZScpLnN1YnNjcmliZShSb29tLmhhbmRsZVN0YXRlVXBkYXRlcyk7XHJcblx0XHRcclxuXHRcdFJvb20udXBkYXRlQnV0dG9uKCk7XHJcblx0fSxcclxuXHRcclxuXHRvcHRpb25zOiB7fSwgLy8gTm90aGluZyBmb3Igbm93XHJcblxyXG5cdGF2YWlsYWJsZVdlYXRoZXI6IHtcclxuXHRcdCdzdW5ueSc6IDAuNCxcclxuXHRcdCdjbG91ZHknOiAwLjMsXHJcblx0XHQncmFpbnknOiAwLjNcclxuXHR9LFxyXG5cdFxyXG5cdG9uQXJyaXZhbDogZnVuY3Rpb24odHJhbnNpdGlvbl9kaWZmKSB7XHJcblx0XHRSb29tLnNldFRpdGxlKCk7XHJcblx0XHRpZigkU00uZ2V0KCdnYW1lLmJ1aWxkZXIubGV2ZWwnKSA9PSAzKSB7XHJcblx0XHRcdCRTTS5hZGQoJ2dhbWUuYnVpbGRlci5sZXZlbCcsIDEpO1xyXG5cdFx0XHQkU00uc2V0SW5jb21lKCdidWlsZGVyJywge1xyXG5cdFx0XHRcdGRlbGF5OiAxMCxcclxuXHRcdFx0XHRzdG9yZXM6IHsnd29vZCcgOiAyIH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KFJvb20sIF8oXCJ0aGUgc3RyYW5nZXIgaXMgc3RhbmRpbmcgYnkgdGhlIGZpcmUuIHNoZSBzYXlzIHNoZSBjYW4gaGVscC4gc2F5cyBzaGUgYnVpbGRzIHRoaW5ncy5cIikpO1xyXG5cdFx0fVxyXG5cclxuXHRcdEVuZ2luZS5tb3ZlU3RvcmVzVmlldyhudWxsLCB0cmFuc2l0aW9uX2RpZmYpO1xyXG5cclxuXHRcdFdlYXRoZXIuaW5pdGlhdGVXZWF0aGVyKFJvb20uYXZhaWxhYmxlV2VhdGhlciwgJ3Jvb20nKTtcclxuXHR9LFxyXG5cdFxyXG5cdFRlbXBFbnVtOiB7XHJcblx0XHRmcm9tSW50OiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRmb3IodmFyIGsgaW4gdGhpcykge1xyXG5cdFx0XHRcdGlmKHR5cGVvZiB0aGlzW2tdLnZhbHVlICE9ICd1bmRlZmluZWQnICYmIHRoaXNba10udmFsdWUgPT0gdmFsdWUpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0aGlzW2tdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH0sXHJcblx0XHRGcmVlemluZzogeyB2YWx1ZTogMCwgdGV4dDogXygnZnJlZXppbmcnKSB9LFxyXG5cdFx0Q29sZDogeyB2YWx1ZTogMSwgdGV4dDogXygnY29sZCcpIH0sXHJcblx0XHRNaWxkOiB7IHZhbHVlOiAyLCB0ZXh0OiBfKCdtaWxkJykgfSxcclxuXHRcdFdhcm06IHsgdmFsdWU6IDMsIHRleHQ6IF8oJ3dhcm0nKSB9LFxyXG5cdFx0SG90OiB7IHZhbHVlOiA0LCB0ZXh0OiBfKCdob3QnKSB9XHJcblx0fSxcclxuXHRcclxuXHRGaXJlRW51bToge1xyXG5cdFx0ZnJvbUludDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdFx0Zm9yKHZhciBrIGluIHRoaXMpIHtcclxuXHRcdFx0XHRpZih0eXBlb2YgdGhpc1trXS52YWx1ZSAhPSAndW5kZWZpbmVkJyAmJiB0aGlzW2tdLnZhbHVlID09IHZhbHVlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpc1trXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9LFxyXG5cdFx0RGVhZDogeyB2YWx1ZTogMCwgdGV4dDogXygnZGVhZCcpIH0sXHJcblx0XHRTbW9sZGVyaW5nOiB7IHZhbHVlOiAxLCB0ZXh0OiBfKCdzbW9sZGVyaW5nJykgfSxcclxuXHRcdEZsaWNrZXJpbmc6IHsgdmFsdWU6IDIsIHRleHQ6IF8oJ2ZsaWNrZXJpbmcnKSB9LFxyXG5cdFx0QnVybmluZzogeyB2YWx1ZTogMywgdGV4dDogXygnYnVybmluZycpIH0sXHJcblx0XHRSb2FyaW5nOiB7IHZhbHVlOiA0LCB0ZXh0OiBfKCdyb2FyaW5nJykgfVxyXG5cdH0sXHJcblx0XHJcblx0c2V0VGl0bGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRpdGxlID0gXyhcIlRoZSBWaWxsYWdlXCIpO1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSB0aGlzKSB7XHJcblx0XHRcdGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XHJcblx0XHR9XHJcblx0XHQkKCdkaXYjbG9jYXRpb25fcm9vbScpLnRleHQodGl0bGUpO1xyXG5cdH0sXHJcblx0XHJcblx0dXBkYXRlQnV0dG9uOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBsaWdodCA9ICQoJyNsaWdodEJ1dHRvbi5idXR0b24nKTtcclxuXHRcdHZhciBzdG9rZSA9ICQoJyNzdG9rZUJ1dHRvbi5idXR0b24nKTtcclxuXHRcdGlmKCRTTS5nZXQoJ2dhbWUuZmlyZS52YWx1ZScpID09IFJvb20uRmlyZUVudW0uRGVhZC52YWx1ZSAmJiBzdG9rZS5jc3MoJ2Rpc3BsYXknKSAhPSAnbm9uZScpIHtcclxuXHRcdFx0c3Rva2UuaGlkZSgpO1xyXG5cdFx0XHRsaWdodC5zaG93KCk7XHJcblx0XHRcdGlmKHN0b2tlLmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XHJcblx0XHRcdFx0QnV0dG9uLmNvb2xkb3duKGxpZ2h0KTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmKGxpZ2h0LmNzcygnZGlzcGxheScpICE9ICdub25lJykge1xyXG5cdFx0XHRzdG9rZS5zaG93KCk7XHJcblx0XHRcdGxpZ2h0LmhpZGUoKTtcclxuXHRcdFx0aWYobGlnaHQuaGFzQ2xhc3MoJ2Rpc2FibGVkJykpIHtcclxuXHRcdFx0XHRCdXR0b24uY29vbGRvd24oc3Rva2UpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmKCEkU00uZ2V0KCdzdG9yZXMud29vZCcpKSB7XHJcblx0XHRcdGxpZ2h0LmFkZENsYXNzKCdmcmVlJyk7XHJcblx0XHRcdHN0b2tlLmFkZENsYXNzKCdmcmVlJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsaWdodC5yZW1vdmVDbGFzcygnZnJlZScpO1xyXG5cdFx0XHRzdG9rZS5yZW1vdmVDbGFzcygnZnJlZScpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBsaXpCdXR0b24gPSAkKCcjbGl6QnV0dG9uLmJ1dHRvbicpO1xyXG5cdFx0aWYoJFNNLmdldCgndmlsbGFnZS5saXpBY3RpdmUnKSkgbGl6QnV0dG9uLnNob3coKTtcclxuXHR9LFxyXG5cdFxyXG5cdFxyXG5cdGhhbmRsZVN0YXRlVXBkYXRlczogZnVuY3Rpb24oZSl7XHJcblx0XHRpZihlLmNhdGVnb3J5ID09ICdzdG9yZXMnKXtcclxuXHRcdFx0Ly8gUm9vbS51cGRhdGVCdWlsZEJ1dHRvbnMoKTtcclxuXHRcdH0gZWxzZSBpZihlLmNhdGVnb3J5ID09ICdpbmNvbWUnKXtcclxuXHRcdH0gZWxzZSBpZihlLnN0YXRlTmFtZS5pbmRleE9mKCdnYW1lLmJ1aWxkaW5ncycpID09PSAwKXtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcbiIsImltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi9CdXR0b25cIjtcclxuaW1wb3J0IHsgSXRlbUxpc3QgfSBmcm9tIFwiLi9pdGVtTGlzdFwiO1xyXG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tIFwiLi4vbm90aWZpY2F0aW9uc1wiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBDaGFyYWN0ZXIgPSB7XHJcblx0aW52ZW50b3J5OiB7fSwgLy8gZGljdGlvbmFyeSB1c2luZyBpdGVtIG5hbWUgYXMga2V5XHJcblx0ZXF1aXBwZWRJdGVtczoge1xyXG5cdFx0Ly8gc3RlYWxpbmcgdGhlIEtvTCBzdHlsZSBmb3Igbm93LCB3ZSdsbCBzZWUgaWYgSSBuZWVkIHNvbWV0aGluZ1xyXG5cdFx0Ly8gdGhhdCBmaXRzIHRoZSBnYW1lIGJldHRlciBhcyB3ZSBnb1xyXG5cdFx0aGVhZDogbnVsbCxcclxuXHRcdHRvcnNvOiBudWxsLFxyXG5cdFx0cGFudHM6IG51bGwsXHJcblx0XHQvLyBubyB3ZWFwb24sIHRyeSB0byBzZWUgaG93IGZhciB3ZSBjYW4gZ2V0IGluIHRoaXMgZ2FtZSB3aXRob3V0IGZvY3VzaW5nIG9uIGNvbWJhdFxyXG5cdFx0YWNjZXNzb3J5MTogbnVsbCxcclxuXHRcdGFjY2Vzc29yeTI6IG51bGwsXHJcblx0XHRhY2Nlc3NvcnkzOiBudWxsLFxyXG5cdH0sXHJcblxyXG5cdC8vIHN0YXRzIGJlZm9yZSBhbnkgbW9kaWZpZXJzIGZyb20gZ2VhciBvciB3aGF0ZXZlciBlbHNlIGFyZSBhcHBsaWVkXHJcblx0cmF3U3RhdHM6IHtcclxuXHRcdCdTcGVlZCc6IDUsXHJcblx0XHQnUGVyY2VwdGlvbic6IDUsXHJcblx0XHQnUmVzaWxpZW5jZSc6IDUsXHJcblx0XHQnSW5nZW51aXR5JzogNSxcclxuXHRcdCdUb3VnaG5lc3MnOiA1XHJcblx0fSxcclxuXHJcblx0Ly8gcGVya3MgZ2l2ZW4gYnkgaXRlbXMsIGNoYXJhY3RlciBjaG9pY2VzLCBkaXZpbmUgcHJvdmVuYW5jZSwgZXRjLlxyXG5cdHBlcmtzOiB7IH0sXHJcblx0XHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblx0XHRcclxuXHRcdC8vIGNyZWF0ZSB0aGUgY2hhcmFjdGVyIGJveFxyXG5cdFx0Y29uc3QgZWxlbSA9ICQoJzxkaXY+JykuYXR0cih7XHJcblx0XHRcdGlkOiAnY2hhcmFjdGVyJyxcclxuXHRcdFx0Y2xhc3NOYW1lOiAnY2hhcmFjdGVyJ1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdGVsZW0uYXBwZW5kVG8oJ2RpdiN3cmFwcGVyJyk7XHJcblxyXG5cdFx0Ly8gd3JpdGUgcmF3U3RhdHMgdG8gJFNNXHJcblx0XHQvLyBOT1RFOiBuZXZlciB3cml0ZSBkZXJpdmVkIHN0YXRzIHRvICRTTSwgYW5kIG5ldmVyIGFjY2VzcyByYXcgc3RhdHMgZGlyZWN0bHkhXHJcblx0XHQvLyBkb2luZyBzbyB3aWxsIGludHJvZHVjZSBvcHBvcnR1bml0aWVzIHRvIG1lc3MgdXAgc3RhdHMgUEVSTUFORU5UTFlcclxuICAgICAgICBpZiAoISRTTS5nZXQoJ2NoYXJhY3Rlci5yYXdzdGF0cycpKSB7XHJcbiAgICAgICAgICAgICRTTS5zZXQoJ2NoYXJhY3Rlci5yYXdzdGF0cycsIENoYXJhY3Rlci5yYXdTdGF0cyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHRcdFx0Q2hhcmFjdGVyLnJhd1N0YXRzID0gJFNNLmdldCgnY2hhcmFjdGVyLnJhd1N0YXRzJykgYXMgYW55O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghJFNNLmdldCgnY2hhcmFjdGVyLnBlcmtzJykpIHtcclxuICAgICAgICAgICAgJFNNLnNldCgnY2hhcmFjdGVyLnBlcmtzJywgQ2hhcmFjdGVyLnBlcmtzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cdFx0XHRDaGFyYWN0ZXIucGVya3MgPSAkU00uZ2V0KCdjaGFyYWN0ZXIucGVya3MnKSBhcyBhbnk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCEkU00uZ2V0KCdjaGFyYWN0ZXIuaW52ZW50b3J5JykpIHtcclxuICAgICAgICAgICAgJFNNLnNldCgnY2hhcmFjdGVyLmludmVudG9yeScsIENoYXJhY3Rlci5pbnZlbnRvcnkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5pbnZlbnRvcnkgPSAkU00uZ2V0KCdjaGFyYWN0ZXIuaW52ZW50b3J5JykgYXMgYW55O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghJFNNLmdldCgnY2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMnKSkge1xyXG4gICAgICAgICAgICAkU00uc2V0KCdjaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcycsIENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cdFx0XHRDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcyA9ICRTTS5nZXQoJ2NoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zJykgYXMgYW55O1xyXG5cdFx0fVxyXG5cclxuICAgICAgICAkKCc8ZGl2PicpLnRleHQoJ0NoYXJhY3RlcicpLmF0dHIoJ2lkJywgJ3RpdGxlJykuYXBwZW5kVG8oJ2RpdiNjaGFyYWN0ZXInKTtcclxuXHJcblx0XHQvLyBUT0RPOiByZXBsYWNlIHRoaXMgd2l0aCBkZXJpdmVkIHN0YXRzXHJcbiAgICAgICAgZm9yKHZhciBzdGF0IGluICRTTS5nZXQoJ2NoYXJhY3Rlci5yYXdzdGF0cycpIGFzIGFueSkge1xyXG4gICAgICAgICAgICAkKCc8ZGl2PicpLnRleHQoc3RhdCArICc6ICcgKyAkU00uZ2V0KCdjaGFyYWN0ZXIucmF3c3RhdHMuJyArIHN0YXQpKS5hcHBlbmRUbygnZGl2I2NoYXJhY3RlcicpO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2J1dHRvbnMnKS5jc3MoXCJtYXJnaW4tdG9wXCIsIFwiMjBweFwiKS5hcHBlbmRUbygnZGl2I2NoYXJhY3RlcicpO1xyXG5cdFx0dmFyIGIgPSBcclxuXHRcdC8vbmV3IFxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiBcImludmVudG9yeVwiLFxyXG5cdFx0XHR0ZXh0OiBcIkludmVudG9yeVwiLFxyXG5cdFx0XHRjbGljazogQ2hhcmFjdGVyLm9wZW5JbnZlbnRvcnlcclxuXHRcdH0pLmFwcGVuZFRvKCQoJyNidXR0b25zJywgJ2RpdiNjaGFyYWN0ZXInKSk7XHJcblx0fSxcclxuXHRcclxuXHRvcHRpb25zOiB7fSwgLy8gTm90aGluZyBmb3Igbm93XHJcblx0XHJcblx0ZWxlbTogbnVsbCxcclxuXHJcblx0aW52ZW50b3J5RGlzcGxheTogbnVsbCBhcyBhbnksXHJcblxyXG5cdG9wZW5JbnZlbnRvcnk6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gY3JlYXRpbmcgYSBoYW5kbGUgZm9yIGxhdGVyIGFjY2Vzcywgc3VjaCBhcyBjbG9zaW5nIGludmVudG9yeVxyXG5cdFx0Q2hhcmFjdGVyLmludmVudG9yeURpc3BsYXkgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2ludmVudG9yeScpLmFkZENsYXNzKCdldmVudFBhbmVsJykuY3NzKCdvcGFjaXR5JywgJzAnKTtcclxuXHRcdHZhciBpbnZlbnRvcnlEaXNwbGF5ID0gQ2hhcmFjdGVyLmludmVudG9yeURpc3BsYXk7XHJcblx0XHRDaGFyYWN0ZXIuaW52ZW50b3J5RGlzcGxheVxyXG5cdFx0Ly8gc2V0IHVwIGNsaWNrIGFuZCBob3ZlciBoYW5kbGVycyBmb3IgaW52ZW50b3J5IGl0ZW1zXHJcblx0XHQub24oXCJjbGlja1wiLCBcIiNpdGVtXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRDaGFyYWN0ZXIudXNlSW52ZW50b3J5SXRlbSgkKHRoaXMpLmRhdGEoXCJuYW1lXCIpKTtcclxuXHRcdFx0Q2hhcmFjdGVyLmNsb3NlSW52ZW50b3J5KCk7XHJcblx0XHR9KS5vbihcIm1vdXNlZW50ZXJcIiwgXCIjaXRlbVwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHRvb2x0aXAgPSAkKFwiPGRpdiBpZD0ndG9vbHRpcCcgY2xhc3M9J3Rvb2x0aXAnPlwiICsgSXRlbUxpc3RbJCh0aGlzKS5kYXRhKFwibmFtZVwiKV0udGV4dCArIFwiPC9kaXY+XCIpXHJcblx0XHRcdC5hdHRyKCdkYXRhLW5hbWUnLCBpdGVtKTtcclxuXHRcdFx0dG9vbHRpcC5hcHBlbmRUbygkKHRoaXMpKTtcclxuXHRcdH0pLm9uKFwibW91c2VsZWF2ZVwiLCBcIiNpdGVtXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKFwiI3Rvb2x0aXBcIiwgXCIjXCIgKyAkKHRoaXMpLmRhdGEoXCJuYW1lXCIpKS5mYWRlT3V0KCkucmVtb3ZlKCk7XHJcblx0XHR9KTtcclxuXHRcdCQoJzxkaXY+JykuYWRkQ2xhc3MoJ2V2ZW50VGl0bGUnKS50ZXh0KCdJbnZlbnRvcnknKS5hcHBlbmRUbyhpbnZlbnRvcnlEaXNwbGF5KTtcclxuXHRcdHZhciBpbnZlbnRvcnlEZXNjID0gJCgnPGRpdj4nKS50ZXh0KFwiQ2xpY2sgdGhpbmdzIGluIHRoZSBsaXN0IHRvIHVzZSB0aGVtLlwiKVxyXG5cdFx0XHQuaG92ZXIoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIHRvb2x0aXAgPSAkKFwiPGRpdiBpZD0ndG9vbHRpcCcgY2xhc3M9J3Rvb2x0aXAnPlwiICsgXCJOb3QgdGhpcywgdGhvdWdoLlwiICsgXCI8L2Rpdj5cIik7XHJcbiAgICBcdFx0XHR0b29sdGlwLmFwcGVuZFRvKGludmVudG9yeURlc2MpO1xyXG5cdFx0XHR9LCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKFwiI3Rvb2x0aXBcIikuZmFkZU91dCgpLnJlbW92ZSgpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHROb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBfKFwiSSBiZXQgeW91IHRoaW5rIHlvdSdyZSBwcmV0dHkgZnVubnksIGh1aD8gQ2xpY2tpbmcgdGhlIHRoaW5nIEkgc2FpZCB3YXNuJ3QgY2xpY2thYmxlP1wiKSk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5jc3MoXCJtYXJnaW4tYm90dG9tXCIsIFwiMjBweFwiKVxyXG5cdFx0XHQuYXBwZW5kVG8oaW52ZW50b3J5RGlzcGxheSk7XHJcblx0XHRcclxuXHRcdGZvcih2YXIgaXRlbSBpbiBDaGFyYWN0ZXIuaW52ZW50b3J5KSB7XHJcblx0XHRcdC8vIG1ha2UgdGhlIGludmVudG9yeSBjb3VudCBsb29rIGEgYml0IG5pY2VyXHJcblx0XHRcdHZhciBpbnZlbnRvcnlFbGVtID0gJCgnPGRpdj4nKVxyXG5cdFx0XHQuYXR0cignaWQnLCAnaXRlbScpXHJcblx0XHRcdC5hdHRyKCdkYXRhLW5hbWUnLCBpdGVtKVxyXG5cdFx0XHQudGV4dChJdGVtTGlzdFtpdGVtXS5uYW1lICArICcgICh4JyArIENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0udG9TdHJpbmcoKSArICcpJylcclxuXHRcdFx0LmFwcGVuZFRvKGludmVudG9yeURpc3BsYXkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFRPRE86IG1ha2UgdGhpcyBDU1MgYW4gYWN0dWFsIGNsYXNzIHNvbWV3aGVyZSwgSSdtIHN1cmUgSSdsbCBuZWVkIGl0IGFnYWluXHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2J1dHRvbnMnKS5jc3MoXCJtYXJnaW4tdG9wXCIsIFwiMjBweFwiKS5hcHBlbmRUbyhpbnZlbnRvcnlEaXNwbGF5KTtcclxuXHRcdHZhciBiID0gXHJcblx0XHQvL25ldyBcclxuXHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogXCJjbG9zZUludmVudG9yeVwiLFxyXG5cdFx0XHR0ZXh0OiBcIkNsb3NlXCIsXHJcblx0XHRcdGNsaWNrOiBDaGFyYWN0ZXIuY2xvc2VJbnZlbnRvcnlcclxuXHRcdH0pLmFwcGVuZFRvKCQoJyNidXR0b25zJywgaW52ZW50b3J5RGlzcGxheSkpO1xyXG5cdFx0JCgnZGl2I3dyYXBwZXInKS5hcHBlbmQoaW52ZW50b3J5RGlzcGxheSk7XHJcblx0XHRpbnZlbnRvcnlEaXNwbGF5LmFuaW1hdGUoe29wYWNpdHk6IDF9LCBFdmVudHMuX1BBTkVMX0ZBREUsICdsaW5lYXInKTtcclxuXHR9LFxyXG5cclxuXHRjbG9zZUludmVudG9yeTogZnVuY3Rpb24oKSB7XHJcblx0XHRDaGFyYWN0ZXIuaW52ZW50b3J5RGlzcGxheS5lbXB0eSgpO1xyXG5cdFx0Q2hhcmFjdGVyLmludmVudG9yeURpc3BsYXkucmVtb3ZlKCk7XHJcblx0fSxcclxuXHJcblx0YWRkVG9JbnZlbnRvcnk6IGZ1bmN0aW9uKGl0ZW0sIGFtb3VudD0xKSB7XHJcblx0XHRpZiAoQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSkge1xyXG5cdFx0XHRDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dICs9IGFtb3VudDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0gPSBhbW91bnQ7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVE9ETzogd3JpdGUgdG8gJFNNXHJcblx0XHQkU00uc2V0KCdpbnZlbnRvcnknLCBDaGFyYWN0ZXIuaW52ZW50b3J5KTtcclxuXHR9LFxyXG5cclxuXHJcblx0cmVtb3ZlRnJvbUludmVudG9yeTogZnVuY3Rpb24oaXRlbSwgYW1vdW50PTEpIHtcclxuXHRcdGlmIChDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dKSBDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dIC09IGFtb3VudDtcclxuXHRcdGlmIChDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dIDwgMSkge1xyXG5cdFx0XHRkZWxldGUgQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBUT0RPOiB3cml0ZSB0byAkU01cclxuXHRcdCRTTS5zZXQoJ2ludmVudG9yeScsIENoYXJhY3Rlci5pbnZlbnRvcnkpO1xyXG5cdH0sXHJcblxyXG5cdHVzZUludmVudG9yeUl0ZW06IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdGlmIChDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dICYmIENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0gPiAwKSB7XHJcblx0XHRcdC8vIHVzZSB0aGUgZWZmZWN0IGluIHRoZSBpbnZlbnRvcnk7IGp1c3QgaW4gY2FzZSBhIG5hbWUgbWF0Y2hlcyBidXQgdGhlIGVmZmVjdFxyXG5cdFx0XHQvLyBkb2VzIG5vdCwgYXNzdW1lIHRoZSBpbnZlbnRvcnkgaXRlbSBpcyB0aGUgc291cmNlIG9mIHRydXRoXHJcblx0XHRcdEl0ZW1MaXN0W2l0ZW1dLm9uVXNlKCk7XHJcblx0XHRcdC8vIHBsZWFzZSBkb24ndCBtYWtlIHRoaXMgdW5yZWFkYWJsZSBub25zZW5zZSBpbiBhIGZ1dHVyZSByZWZhY3RvciwganVzdFxyXG5cdFx0XHQvLyBsZXQgaXQgYmUgdGhpcyB3YXlcclxuXHRcdFx0aWYgKHR5cGVvZihJdGVtTGlzdFtpdGVtXS5kZXN0cm95T25Vc2UpID09IFwiZnVuY3Rpb25cIiAmJiBJdGVtTGlzdFtpdGVtXS5kZXN0cm95T25Vc2UoKSkge1xyXG5cdFx0XHRcdENoYXJhY3Rlci5yZW1vdmVGcm9tSW52ZW50b3J5KGl0ZW0pO1xyXG5cdFx0XHR9IGVsc2UgaWYgKEl0ZW1MaXN0W2l0ZW1dLmRlc3Ryb3lPblVzZSkge1xyXG5cdFx0XHRcdENoYXJhY3Rlci5yZW1vdmVGcm9tSW52ZW50b3J5KGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVE9ETzogd3JpdGUgdG8gJFNNXHJcblx0XHQkU00uc2V0KCdpbnZlbnRvcnknLCBDaGFyYWN0ZXIuaW52ZW50b3J5KTtcclxuXHR9LFxyXG5cclxuXHRlcXVpcEl0ZW06IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdGlmIChJdGVtTGlzdFtpdGVtXS5zbG90ICYmIHR5cGVvZihDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtc1tJdGVtTGlzdFtpdGVtXS5zbG90XSkgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuXHRcdFx0Q2hhcmFjdGVyLmFkZFRvSW52ZW50b3J5KENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zW0l0ZW1MaXN0W2l0ZW1dLnNsb3RdKTtcclxuXHRcdFx0Q2hhcmFjdGVyLmVxdWlwcGVkSXRlbXNbSXRlbUxpc3RbaXRlbV0uc2xvdF0gPSBpdGVtO1xyXG5cdFx0XHRpZiAoSXRlbUxpc3RbaXRlbV0ub25FcXVpcCkge1xyXG5cdFx0XHRcdEl0ZW1MaXN0W2l0ZW1dLm9uRXF1aXAoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRDaGFyYWN0ZXIuYXBwbHlFcXVpcG1lbnRFZmZlY3RzKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVE9ETzogd3JpdGUgdG8gJFNNXHJcblx0XHQkU00uc2V0KCdlcXVpcHBlZEl0ZW1zJywgQ2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMpO1xyXG5cdFx0JFNNLnNldCgnaW52ZW50b3J5JywgQ2hhcmFjdGVyLmludmVudG9yeSk7XHJcblx0fSxcclxuXHJcblx0Z3JhbnRQZXJrOiBmdW5jdGlvbihwZXJrKSB7XHJcblx0XHRpZiAoQ2hhcmFjdGVyLnBlcmtzW3BlcmsubmFtZV0pIHtcclxuXHRcdFx0aWYocGVyay50aW1lTGVmdCA+IDApIHtcclxuXHRcdFx0XHRDaGFyYWN0ZXIucGVya3NbcGVyay5uYW1lXSArPSBwZXJrLnRpbWVMZWZ0O1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRDaGFyYWN0ZXIucGVya3NbcGVyay5uYW1lXSA9IHBlcms7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVE9ETzogd3JpdGUgdG8gJFNNXHJcblx0XHQkU00uc2V0KCdwZXJrcycsIENoYXJhY3Rlci5wZXJrcylcclxuXHR9LFxyXG5cclxuXHQvLyBhcHBseSBlcXVpcG1lbnQgZWZmZWN0cywgd2hpY2ggc2hvdWxkIGFsbCBjaGVjayBhZ2FpbnN0ICRTTSBzdGF0ZSB2YXJpYWJsZXM7XHJcblx0Ly8gdGhpcyBzaG91bGQgYmUgY2FsbGVkIG9uIGJhc2ljYWxseSBldmVyeSBwbGF5ZXIgYWN0aW9uIHdoZXJlIGEgcGllY2Ugb2YgZ2VhclxyXG5cdC8vIHdvdWxkIGRvIHNvbWV0aGluZyBvciBjaGFuZ2UgYW4gb3V0Y29tZTsgZ2l2ZSBleHRyYVBhcmFtcyB0byB0aGUgZWZmZWN0IGJlaW5nIFxyXG5cdC8vIGFwcGxpZWQgZm9yIGFueXRoaW5nIHRoYXQncyByZWxldmFudCB0byB0aGUgZWZmZWN0IGJ1dCBub3QgaGFuZGxlZCBieSAkU01cclxuXHRhcHBseUVxdWlwbWVudEVmZmVjdHM6IGZ1bmN0aW9uKGV4dHJhUGFyYW1zPykge1xyXG5cdFx0Zm9yIChjb25zdCBpdGVtIGluIENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zKSB7XHJcblx0XHRcdGlmIChJdGVtTGlzdFtpdGVtXS5lZmZlY3RzKSB7XHJcblx0XHRcdFx0Zm9yIChjb25zdCBlZmZlY3QgaW4gSXRlbUxpc3RbaXRlbV0uZWZmZWN0cykge1xyXG5cdFx0XHRcdFx0Ly8gTk9URTogY3VycmVudGx5IHRoaXMgaXMgZ29vZCBmb3IgYXBwbHlpbmcgcGVya3MgYW5kIE5vdGlmeWluZztcclxuXHRcdFx0XHRcdC8vIGFyZSB0aGVyZSBvdGhlciBzaXR1YXRpb25zIHdoZXJlIHdlJ2Qgd2FudCB0byBhcHBseSBlZmZlY3RzLFxyXG5cdFx0XHRcdFx0Ly8gb3IgY2FuIHdlIGNvdmVyIGJhc2ljYWxseSBldmVyeSBjYXNlIHZpYSB0aG9zZSB0aGluZ3M/XHJcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0XHRpZiAoZWZmZWN0LmlzQWN0aXZlICYmIGVmZmVjdC5pc0FjdGl2ZShleHRyYVBhcmFtcykpIGVmZmVjdC5hcHBseShleHRyYVBhcmFtcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Ly8gZ2V0IHN0YXRzIGFmdGVyIGFwcGx5aW5nIGFsbCBlcXVpcG1lbnQgYm9udXNlcywgcGVya3MsIGV0Yy5cclxuXHRnZXREZXJpdmVkU3RhdHM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Y29uc3QgZGVyaXZlZFN0YXRzID0gc3RydWN0dXJlZENsb25lKENoYXJhY3Rlci5yYXdTdGF0cyk7XHJcblx0XHRmb3IgKGNvbnN0IGl0ZW0gaW4gQ2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMpIHtcclxuXHRcdFx0aWYgKEl0ZW1MaXN0W2l0ZW1dLnN0YXRCb251c2VzKSB7XHJcblx0XHRcdFx0Zm9yIChjb25zdCBzdGF0IGluIE9iamVjdC5rZXlzKEl0ZW1MaXN0W2l0ZW1dLnN0YXRCb251c2VzKSkge1xyXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiAoSXRlbUxpc3RbaXRlbV0uc3RhdEJvbnVzZXNbc3RhdF0gPT0gXCJmdW5jdGlvblwiKSkge1xyXG5cdFx0XHRcdFx0XHRkZXJpdmVkU3RhdHNbc3RhdF0gKz0gSXRlbUxpc3RbaXRlbV0uc3RhdEJvbnVzZXNbc3RhdF0oKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGRlcml2ZWRTdGF0c1tzdGF0XSArPSBJdGVtTGlzdFtpdGVtXS5zdGF0Qm9udXNlc1tzdGF0XTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGNvbnN0IHBlcmsgaW4gQ2hhcmFjdGVyLnBlcmtzKSB7XHJcblx0XHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdFx0aWYgKHBlcmsuc3RhdEJvbnVzZXMpIHtcclxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0Zm9yIChjb25zdCBzdGF0IGluIE9iamVjdC5rZXlzKHBlcmsuc3RhdEJvbnVzZXMpKSB7XHJcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0XHRpZiAodHlwZW9mIChwZXJrLnN0YXRCb251c2VzW3N0YXRdID09IFwiZnVuY3Rpb25cIikpIHtcclxuXHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdFx0XHRkZXJpdmVkU3RhdHNbc3RhdF0gKz0gcGVyay5zdGF0Qm9udXNlc1tzdGF0XSgpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdFx0XHRkZXJpdmVkU3RhdHNbc3RhdF0gKz0gcGVyay5zdGF0Qm9udXNlc1tzdGF0XTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZGVyaXZlZFN0YXRzO1xyXG5cdH1cclxufSIsIi8vIGFsbCBpdGVtcyBnbyBoZXJlLCBzbyB0aGF0IG5vdGhpbmcgc2lsbHkgaGFwcGVucyBpbiB0aGUgZXZlbnQgdGhhdCB0aGV5IGdldCBwdXQgaW4gTG9jYWwgU3RvcmFnZVxyXG4vLyBhcyBwYXJ0IG9mIHRoZSBzdGF0ZSBtYW5hZ2VtZW50IGNvZGU7IHBsZWFzZSBzYXZlIGl0ZW0gbmFtZXMgdG8gdGhlIGludmVudG9yeSwgYW5kIHRoZW4gcmVmZXIgdG8gXHJcbi8vIHRoZSBpdGVtIGxpc3QgdmlhIHRoZSBpdGVtIG5hbWVcclxuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tIFwiLi9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tIFwiLi4vbm90aWZpY2F0aW9uc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEl0ZW1MaXN0ID0ge1xyXG4gICAgXCJMaXoud2VpcmRCb29rXCI6IHtcclxuICAgICAgICBuYW1lOiAnV2VpcmQgQm9vaycsXHJcbiAgICAgICAgdGV4dDogXygnQSBib29rIHlvdSBmb3VuZCBhdCBMaXpcXCdzIHBsYWNlLiBTdXBwb3NlZGx5IGhhcyBpbmZvcm1hdGlvbiBhYm91dCBDaGFkdG9waWEuJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkgeyBcclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICBfKFwiQSBCcmllZiBIaXN0b3J5IG9mIENoYWR0b3BpYVwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1RoaXMgYm9vayBpcyBwcmV0dHkgYm9yaW5nLCBidXQgeW91IG1hbmFnZSB0byBsZWFybiBhIGJpdCBtb3JlIGluIHNwaXRlIG9mIHlvdXIgcG9vciBhdHRlbnRpb24gc3Bhbi4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oJ0ZvciBleGFtcGxlLCB5b3UgbGVhcm4gdGhhdCBcIkNoYWR0b3BpYVwiIGRvZXNuXFwndCBoYXZlIGEgY2FwaXRhbCBcXCdUXFwnLiBUaGF0XFwncyBwcmV0dHkgY29vbCwgaHVoPycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXygnLi4uIFdoYXQgd2VyZSB5b3UgZG9pbmcgYWdhaW4/JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnU29tZXRoaW5nIGNvb2xlciB0aGFuIHJlYWRpbmcsIHByb2JhYmx5JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6IENoYXJhY3Rlci5hZGRUb0ludmVudG9yeShcIkxpei5ib3JpbmdCb29rXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogdHJ1ZVxyXG4gICAgfSxcclxuXHJcbiAgICBcIkxpei5ib3JpbmdCb29rXCI6IHtcclxuICAgICAgICBuYW1lOiAnQSBCcmllZiBIaXN0b3J5IG9mIENoYWR0b3BpYScsXHJcbiAgICAgICAgdGV4dDogXygnTWFuLCB0aGlzIGJvb2sgaXMgYm9yaW5nLicpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IF8oXCJBIEJyaWVmIFN1bW1hcnkgb2YgYSBCcmllZiBIaXN0b3J5IG9mIENoYWR0b3BpYVwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtfKCdJdFxcJ3Mgc3RpbGwganVzdCBhcyBib3JpbmcgYXMgd2hlbiB5b3UgbGFzdCB0cmllZCB0byByZWFkIGl0LicpXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnRGFuZy4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgXCJTdHJhbmdlci5zbW9vdGhTdG9uZVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ0Egc21vb3RoIGJsYWNrIHN0b25lJyxcclxuICAgICAgICB0ZXh0OiBfKCdJdFxcJ3Mgd2VpcmRseSBlZXJpZScpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKCEkU00uZ2V0KCdrbm93bGVkZ2UuU3RyYW5nZXIuc21vb3RoU3RvbmUnKSkge1xyXG4gICAgICAgICAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgJ1lvdSBoYXZlIG5vIGlkZWEgd2hhdCB0byBkbyB3aXRoIHRoaXMgdGhpbmcuJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IF8oXCJBIHNtb290aCBibGFjayBzdG9uZVwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtfKFwiSSdtIGdlbnVpbmVseSBub3Qgc3VyZSBob3cgeW91IGdvdCB0byB0aGlzIGV2ZW50LCBidXQgcGxlYXNlIGxldCBtZSBrbm93IHZpYSBHaXRIdWIgaXNzdWUsIHlvdSBsaXR0bGUgc3Rpbmtlci5cIildLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdJIHN3ZWFyIHRvIGRvIHRoaXMsIGFzIGEgcmVzcG9uc2libGUgY2l0aXplbiBvZiBFYXJ0aCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJTdHJhbmdlci53cmFwcGVkS25pZmVcIjoge1xyXG4gICAgICAgIG5hbWU6ICdBIGtuaWZlIHdyYXBwZWQgaW4gY2xvdGgnLFxyXG4gICAgICAgIHRleHQ6IF8oJ01hbiwgSSBob3BlIGl0XFwncyBub3QgYWxsIGxpa2UsIGJsb29keSBvbiB0aGUgYmxhZGUgYW5kIHN0dWZmLicpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IF8oXCJBIGtuaWZlIHdyYXBwZWQgaW4gY2xvdGhcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXyhcIllvdSB1bndyYXAgdGhlIGtuaWZlIGNhcmVmdWxseS4gSXQgc2VlbXMgdG8gYmUgaGlnaGx5IG9ybmFtZW50ZWQsIGFuZCB5b3UgY291bGQgcHJvYmFibHkgZG8gc29tZSBjcmltZXMgd2l0aCBpdC5cIildLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdIZWxsIHllYWgsIEFkb2xmIExvb3Mgc3R5bGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNob29zZTogQ2hhcmFjdGVyLmFkZFRvSW52ZW50b3J5KFwiU3RyYW5nZXIuc2lsdmVyS25pZmVcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveU9uVXNlOiB0cnVlXHJcbiAgICB9LFxyXG4gICAgXCJTdHJhbmdlci5zaWx2ZXJLbmlmZVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ0Egc2lsdmVyIGtuaWZlJyxcclxuICAgICAgICB0ZXh0OiBfKCdIaWdobHkgb3JuYW1lbnRlZCcpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IF8oXCJBIHNpbHZlciBrbmlmZVwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJPbmUgZGF5IHlvdSdsbCBiZSBhYmxlIHRvIGVxdWlwIHRoaXMsIGJ1dCByaWdodCBub3cgdGhhdCBmdW5jdGlvbmFsaXR5IGlzbid0IHByZXNlbnQuXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIlBsZWFzZSBwb2xpdGVseSBsZWF2ZSB0aGUgcHJlbWlzZXMgd2l0aG91dCBhY2tub3dsZWRnaW5nIHRoaXMgbWlzc2luZyBmZWF0dXJlLlwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdZb3UgZ290IGl0LCBjaGllZicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJTdHJhbmdlci5jbG90aEJ1bmRsZVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ0EgYnVuZGxlIG9mIGNsb3RoJyxcclxuICAgICAgICB0ZXh0OiBfKCdXaGF0IGxpZXMgd2l0aGluPycpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IF8oXCJBIGJ1bmRsZSBvZiBjbG90aFwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJPbmUgZGF5IHlvdSdsbCBiZSBhYmxlIHRvIHVzZSB0aGlzIGl0ZW0sIGJ1dCByaWdodCBub3cgdGhhdCBmdW5jdGlvbmFsaXR5IGlzbid0IHByZXNlbnQuXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIlBsZWFzZSBwb2xpdGVseSBsZWF2ZSB0aGUgcHJlbWlzZXMgd2l0aG91dCBhY2tub3dsZWRnaW5nIHRoaXMgbWlzc2luZyBmZWF0dXJlLlwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdZb3UgZ290IGl0LCBjaGllZicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJTdHJhbmdlci5jb2luXCI6IHtcclxuICAgICAgICBuYW1lOiAnQSBzdHJhbmdlIGNvaW4nLFxyXG4gICAgICAgIHRleHQ6IF8oJ0JvdGggc2lkZXMgZGVwaWN0IHRoZSBzYW1lIGltYWdlJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEgc3RyYW5nZSBjb2luXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIk9uZSBkYXkgeW91J2xsIGJlIGFibGUgdG8gdXNlIHRoaXMgaXRlbSwgYnV0IHJpZ2h0IG5vdyB0aGF0IGZ1bmN0aW9uYWxpdHkgaXNuJ3QgcHJlc2VudC5cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiUGxlYXNlIHBvbGl0ZWx5IGxlYXZlIHRoZSBwcmVtaXNlcyB3aXRob3V0IGFja25vd2xlZGdpbmcgdGhpcyBtaXNzaW5nIGZlYXR1cmUuXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1lvdSBnb3QgaXQsIGNoaWVmJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvKlxyXG4gKiBNb2R1bGUgZm9yIGhhbmRsaW5nIFN0YXRlc1xyXG4gKiBcclxuICogQWxsIHN0YXRlcyBzaG91bGQgYmUgZ2V0IGFuZCBzZXQgdGhyb3VnaCB0aGUgU3RhdGVNYW5hZ2VyICgkU00pLlxyXG4gKiBcclxuICogVGhlIG1hbmFnZXIgaXMgaW50ZW5kZWQgdG8gaGFuZGxlIGFsbCBuZWVkZWQgY2hlY2tzIGFuZCBlcnJvciBjYXRjaGluZy5cclxuICogVGhpcyBpbmNsdWRlcyBjcmVhdGluZyB0aGUgcGFyZW50cyBvZiBsYXllcmVkL2RlZXAgc3RhdGVzIHNvIHVuZGVmaW5lZCBzdGF0ZXNcclxuICogZG8gbm90IG5lZWQgdG8gYmUgdGVzdGVkIGZvciBhbmQgY3JlYXRlZCBiZWZvcmVoYW5kLlxyXG4gKiBcclxuICogV2hlbiBhIHN0YXRlIGlzIGNoYW5nZWQsIGFuIHVwZGF0ZSBldmVudCBpcyBzZW50IG91dCBjb250YWluaW5nIHRoZSBuYW1lIG9mIHRoZSBzdGF0ZVxyXG4gKiBjaGFuZ2VkIG9yIGluIHRoZSBjYXNlIG9mIG11bHRpcGxlIGNoYW5nZXMgKC5zZXRNLCAuYWRkTSkgdGhlIHBhcmVudCBjbGFzcyBjaGFuZ2VkLlxyXG4gKiBFdmVudDogdHlwZTogJ3N0YXRlVXBkYXRlJywgc3RhdGVOYW1lOiA8cGF0aCBvZiBzdGF0ZSBvciBwYXJlbnQgc3RhdGU+XHJcbiAqIFxyXG4gKiBPcmlnaW5hbCBmaWxlIGNyZWF0ZWQgYnk6IE1pY2hhZWwgR2FsdXNoYVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyBOb3RpZmljYXRpb25zIH0gZnJvbSBcIi4vbm90aWZpY2F0aW9uc1wiO1xyXG5cclxudmFyIFN0YXRlTWFuYWdlciA9IHtcclxuXHRcdFxyXG5cdE1BWF9TVE9SRTogOTk5OTk5OTk5OTk5OTksXHJcblx0XHJcblx0b3B0aW9uczoge30sXHJcblx0XHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdFx0XHJcblx0XHQvL2NyZWF0ZSBjYXRlZ29yaWVzXHJcblx0XHR2YXIgY2F0cyA9IFtcclxuXHRcdFx0J2ZlYXR1cmVzJyxcdFx0Ly9iaWcgZmVhdHVyZXMgbGlrZSBidWlsZGluZ3MsIGxvY2F0aW9uIGF2YWlsYWJpbGl0eSwgdW5sb2NrcywgZXRjXHJcblx0XHRcdCdzdG9yZXMnLCBcdFx0Ly9saXR0bGUgc3R1ZmYsIGl0ZW1zLCB3ZWFwb25zLCBldGNcclxuXHRcdFx0J2NoYXJhY3RlcicsIFx0Ly90aGlzIGlzIGZvciBwbGF5ZXIncyBjaGFyYWN0ZXIgc3RhdHMgc3VjaCBhcyBwZXJrc1xyXG5cdFx0XHQnaW5jb21lJyxcclxuXHRcdFx0J3RpbWVycycsXHJcblx0XHRcdCdnYW1lJywgXHRcdC8vbW9zdGx5IGxvY2F0aW9uIHJlbGF0ZWQ6IGZpcmUgdGVtcCwgd29ya2VycywgcG9wdWxhdGlvbiwgd29ybGQgbWFwLCBldGNcclxuXHRcdFx0J3BsYXlTdGF0cycsXHQvL2FueXRoaW5nIHBsYXkgcmVsYXRlZDogcGxheSB0aW1lLCBsb2FkcywgZXRjXHJcblx0XHRcdCdwcmV2aW91cycsXHRcdC8vIHByZXN0aWdlLCBzY29yZSwgdHJvcGhpZXMgKGluIGZ1dHVyZSksIGFjaGlldmVtZW50cyAoYWdhaW4sIG5vdCB5ZXQpLCBldGNcclxuXHRcdFx0J291dGZpdCdcdFx0XHQvLyB1c2VkIHRvIHRlbXBvcmFyaWx5IHN0b3JlIHRoZSBpdGVtcyB0byBiZSB0YWtlbiBvbiB0aGUgcGF0aFxyXG5cdFx0XTtcclxuXHRcdFxyXG5cdFx0Zm9yKHZhciB3aGljaCBpbiBjYXRzKSB7XHJcblx0XHRcdGlmKCEkU00uZ2V0KGNhdHNbd2hpY2hdKSkgJFNNLnNldChjYXRzW3doaWNoXSwge30pOyBcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly9zdWJzY3JpYmUgdG8gc3RhdGVVcGRhdGVzXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHQkLkRpc3BhdGNoKCdzdGF0ZVVwZGF0ZScpLnN1YnNjcmliZSgkU00uaGFuZGxlU3RhdGVVcGRhdGVzKTtcclxuXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHR3aW5kb3cuJFNNID0gdGhpcztcclxuXHR9LFxyXG5cdFxyXG5cdC8vY3JlYXRlIGFsbCBwYXJlbnRzIGFuZCB0aGVuIHNldCBzdGF0ZVxyXG5cdGNyZWF0ZVN0YXRlOiBmdW5jdGlvbihzdGF0ZU5hbWUsIHZhbHVlKSB7XHJcblx0XHR2YXIgd29yZHMgPSBzdGF0ZU5hbWUuc3BsaXQoL1suXFxbXFxdJ1wiXSsvKTtcclxuXHRcdC8vZm9yIHNvbWUgcmVhc29uIHRoZXJlIGFyZSBzb21ldGltZXMgZW1wdHkgc3RyaW5nc1xyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB3b3Jkcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAod29yZHNbaV0gPT09ICcnKSB7XHJcblx0XHRcdFx0d29yZHMuc3BsaWNlKGksIDEpO1xyXG5cdFx0XHRcdGktLTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly8gSU1QT1JUQU5UOiBTdGF0ZSByZWZlcnMgdG8gd2luZG93LlN0YXRlLCB3aGljaCBJIGhhZCB0byBpbml0aWFsaXplIG1hbnVhbGx5XHJcblx0XHQvLyAgICBpbiBFbmdpbmUudHM7IHBsZWFzZSBkb24ndCBmb3JnZXQgdGhpcyBhbmQgbWVzcyB3aXRoIGFueXRoaW5nIG5hbWVkXHJcblx0XHQvLyAgICBcIlN0YXRlXCIgb3IgXCJ3aW5kb3cuU3RhdGVcIiwgdGhpcyBzdHVmZiBpcyB3ZWlyZGx5IHByZWNhcmlvdXMgYWZ0ZXIgdHlwZXNjcmlwdGluZ1xyXG5cdFx0Ly8gICAgdGhpcyBjb2RlYmFzZSwgYW5kIEkgZG9uJ3QgaGF2ZSB0aGUgc2FuaXR5IHBvaW50cyB0byBmaWd1cmUgb3V0IHdoeVxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0dmFyIG9iaiA9IFN0YXRlO1xyXG5cdFx0dmFyIHcgPSBudWxsO1xyXG5cdFx0Zm9yKHZhciBpPTAsIGxlbj13b3Jkcy5sZW5ndGgtMTtpPGxlbjtpKyspe1xyXG5cdFx0XHR3ID0gd29yZHNbaV07XHJcblx0XHRcdGlmKG9ialt3XSA9PT0gdW5kZWZpbmVkICkgb2JqW3ddID0ge307XHJcblx0XHRcdG9iaiA9IG9ialt3XTtcclxuXHRcdH1cclxuXHRcdG9ialt3b3Jkc1tpXV0gPSB2YWx1ZTtcclxuXHRcdHJldHVybiBvYmo7XHJcblx0fSxcclxuXHRcclxuXHQvL3NldCBzaW5nbGUgc3RhdGVcclxuXHQvL2lmIG5vRXZlbnQgaXMgdHJ1ZSwgdGhlIHVwZGF0ZSBldmVudCB3b24ndCB0cmlnZ2VyLCB1c2VmdWwgZm9yIHNldHRpbmcgbXVsdGlwbGUgc3RhdGVzIGZpcnN0XHJcblx0c2V0OiBmdW5jdGlvbihzdGF0ZU5hbWUsIHZhbHVlLCBub0V2ZW50Pykge1xyXG5cdFx0dmFyIGZ1bGxQYXRoID0gJFNNLmJ1aWxkUGF0aChzdGF0ZU5hbWUpO1xyXG5cdFx0XHJcblx0XHQvL21ha2Ugc3VyZSB0aGUgdmFsdWUgaXNuJ3Qgb3ZlciB0aGUgZW5naW5lIG1heGltdW1cclxuXHRcdGlmKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJiB2YWx1ZSA+ICRTTS5NQVhfU1RPUkUpIHZhbHVlID0gJFNNLk1BWF9TVE9SRTtcclxuXHRcdFxyXG5cdFx0dHJ5e1xyXG5cdFx0XHRldmFsKCcoJytmdWxsUGF0aCsnKSA9IHZhbHVlJyk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdC8vcGFyZW50IGRvZXNuJ3QgZXhpc3QsIHNvIG1ha2UgcGFyZW50XHJcblx0XHRcdCRTTS5jcmVhdGVTdGF0ZShzdGF0ZU5hbWUsIHZhbHVlKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly9zdG9yZXMgdmFsdWVzIGNhbiBub3QgYmUgbmVnYXRpdmVcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdGlmKHN0YXRlTmFtZS5pbmRleE9mKCdzdG9yZXMnKSA9PT0gMCAmJiAkU00uZ2V0KHN0YXRlTmFtZSwgdHJ1ZSkgPCAwKSB7XHJcblx0XHRcdGV2YWwoJygnK2Z1bGxQYXRoKycpID0gMCcpO1xyXG5cdFx0XHRFbmdpbmUubG9nKCdXQVJOSU5HOiBzdGF0ZTonICsgc3RhdGVOYW1lICsgJyBjYW4gbm90IGJlIGEgbmVnYXRpdmUgdmFsdWUuIFNldCB0byAwIGluc3RlYWQuJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0RW5naW5lLmxvZyhzdGF0ZU5hbWUgKyAnICcgKyB2YWx1ZSk7XHJcblx0XHRcclxuXHRcdGlmKCFub0V2ZW50KSB7XHJcblx0XHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0XHQkU00uZmlyZVVwZGF0ZShzdGF0ZU5hbWUpO1xyXG5cdFx0fVx0XHRcclxuXHR9LFxyXG5cdFxyXG5cdC8vc2V0cyBhIGxpc3Qgb2Ygc3RhdGVzXHJcblx0c2V0TTogZnVuY3Rpb24ocGFyZW50TmFtZSwgbGlzdCwgbm9FdmVudD8pIHtcclxuXHRcdCRTTS5idWlsZFBhdGgocGFyZW50TmFtZSk7XHJcblx0XHRcclxuXHRcdC8vbWFrZSBzdXJlIHRoZSBzdGF0ZSBleGlzdHMgdG8gYXZvaWQgZXJyb3JzLFxyXG5cdFx0aWYoJFNNLmdldChwYXJlbnROYW1lKSA9PT0gdW5kZWZpbmVkKSAkU00uc2V0KHBhcmVudE5hbWUsIHt9LCB0cnVlKTtcclxuXHRcdFxyXG5cdFx0Zm9yKHZhciBrIGluIGxpc3Qpe1xyXG5cdFx0XHQkU00uc2V0KHBhcmVudE5hbWUrJ1tcIicraysnXCJdJywgbGlzdFtrXSwgdHJ1ZSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmKCFub0V2ZW50KSB7XHJcblx0XHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0XHQkU00uZmlyZVVwZGF0ZShwYXJlbnROYW1lKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdC8vc2hvcnRjdXQgZm9yIGFsdGVyaW5nIG51bWJlciB2YWx1ZXMsIHJldHVybiAxIGlmIHN0YXRlIHdhc24ndCBhIG51bWJlclxyXG5cdGFkZDogZnVuY3Rpb24oc3RhdGVOYW1lLCB2YWx1ZSwgbm9FdmVudD8pIHtcclxuXHRcdHZhciBlcnIgPSAwO1xyXG5cdFx0Ly8wIGlmIHVuZGVmaW5lZCwgbnVsbCAoYnV0IG5vdCB7fSkgc2hvdWxkIGFsbG93IGFkZGluZyB0byBuZXcgb2JqZWN0c1xyXG5cdFx0Ly9jb3VsZCBhbHNvIGFkZCBpbiBhIHRydWUgPSAxIHRoaW5nLCB0byBoYXZlIHNvbWV0aGluZyBnbyBmcm9tIGV4aXN0aW5nICh0cnVlKVxyXG5cdFx0Ly90byBiZSBhIGNvdW50LCBidXQgdGhhdCBtaWdodCBiZSB1bndhbnRlZCBiZWhhdmlvciAoYWRkIHdpdGggbG9vc2UgZXZhbCBwcm9iYWJseSB3aWxsIGhhcHBlbiBhbnl3YXlzKVxyXG5cdFx0dmFyIG9sZCA9ICRTTS5nZXQoc3RhdGVOYW1lLCB0cnVlKTtcclxuXHRcdFxyXG5cdFx0Ly9jaGVjayBmb3IgTmFOIChvbGQgIT0gb2xkKSBhbmQgbm9uIG51bWJlciB2YWx1ZXNcclxuXHRcdGlmKG9sZCAhPSBvbGQpe1xyXG5cdFx0XHRFbmdpbmUubG9nKCdXQVJOSU5HOiAnK3N0YXRlTmFtZSsnIHdhcyBjb3JydXB0ZWQgKE5hTikuIFJlc2V0dGluZyB0byAwLicpO1xyXG5cdFx0XHRvbGQgPSAwO1xyXG5cdFx0XHQkU00uc2V0KHN0YXRlTmFtZSwgb2xkICsgdmFsdWUsIG5vRXZlbnQpO1xyXG5cdFx0fSBlbHNlIGlmKHR5cGVvZiBvbGQgIT0gJ251bWJlcicgfHwgdHlwZW9mIHZhbHVlICE9ICdudW1iZXInKXtcclxuXHRcdFx0RW5naW5lLmxvZygnV0FSTklORzogQ2FuIG5vdCBkbyBtYXRoIHdpdGggc3RhdGU6JytzdGF0ZU5hbWUrJyBvciB2YWx1ZTonK3ZhbHVlKycgYmVjYXVzZSBhdCBsZWFzdCBvbmUgaXMgbm90IGEgbnVtYmVyLicpO1xyXG5cdFx0XHRlcnIgPSAxO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JFNNLnNldChzdGF0ZU5hbWUsIG9sZCArIHZhbHVlLCBub0V2ZW50KTsgLy9zZXRTdGF0ZSBoYW5kbGVzIGV2ZW50IGFuZCBzYXZlXHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBlcnI7XHJcblx0fSxcclxuXHRcclxuXHQvL2FsdGVycyBtdWx0aXBsZSBudW1iZXIgdmFsdWVzLCByZXR1cm4gbnVtYmVyIG9mIGZhaWxzXHJcblx0YWRkTTogZnVuY3Rpb24ocGFyZW50TmFtZSwgbGlzdCwgbm9FdmVudD8pIHtcclxuXHRcdHZhciBlcnIgPSAwO1xyXG5cdFx0XHJcblx0XHQvL21ha2Ugc3VyZSB0aGUgcGFyZW50IGV4aXN0cyB0byBhdm9pZCBlcnJvcnNcclxuXHRcdGlmKCRTTS5nZXQocGFyZW50TmFtZSkgPT09IHVuZGVmaW5lZCkgJFNNLnNldChwYXJlbnROYW1lLCB7fSwgdHJ1ZSk7XHJcblx0XHRcclxuXHRcdGZvcih2YXIgayBpbiBsaXN0KXtcclxuXHRcdFx0aWYoJFNNLmFkZChwYXJlbnROYW1lKydbXCInK2srJ1wiXScsIGxpc3Rba10sIHRydWUpKSBlcnIrKztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYoIW5vRXZlbnQpIHtcclxuXHRcdFx0RW5naW5lLnNhdmVHYW1lKCk7XHJcblx0XHRcdCRTTS5maXJlVXBkYXRlKHBhcmVudE5hbWUpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGVycjtcclxuXHR9LFxyXG5cdFxyXG5cdC8vcmV0dXJuIHN0YXRlLCB1bmRlZmluZWQgb3IgMFxyXG5cdGdldDogZnVuY3Rpb24oc3RhdGVOYW1lLCByZXF1ZXN0WmVybz8pOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBOdW1iZXIgfCBudWxsIHtcclxuXHRcdHZhciB3aGljaFN0YXRlOiB1bmRlZmluZWQgfCBudWxsIHwgTnVtYmVyIHwgc3RyaW5nID0gbnVsbDtcclxuXHRcdHZhciBmdWxsUGF0aCA9ICRTTS5idWlsZFBhdGgoc3RhdGVOYW1lKTtcclxuXHRcdFxyXG5cdFx0Ly9jYXRjaCBlcnJvcnMgaWYgcGFyZW50IG9mIHN0YXRlIGRvZXNuJ3QgZXhpc3RcclxuXHRcdHRyeXtcclxuXHRcdFx0ZXZhbCgnd2hpY2hTdGF0ZSA9ICgnK2Z1bGxQYXRoKycpJyk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdHdoaWNoU3RhdGUgPSB1bmRlZmluZWQ7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vcHJldmVudHMgcmVwZWF0ZWQgaWYgdW5kZWZpbmVkLCBudWxsLCBmYWxzZSBvciB7fSwgdGhlbiB4ID0gMCBzaXR1YXRpb25zXHJcblx0XHRpZigoIXdoaWNoU3RhdGVcclxuXHRcdFx0Ly8gIHx8IHdoaWNoU3RhdGUgPT0ge31cclxuXHRcdFx0KSAmJiByZXF1ZXN0WmVybykgcmV0dXJuIDA7XHJcblx0XHRlbHNlIHJldHVybiB3aGljaFN0YXRlO1xyXG5cdH0sXHJcblx0XHJcblx0Ly9tYWlubHkgZm9yIGxvY2FsIGNvcHkgdXNlLCBhZGQoTSkgY2FuIGZhaWwgc28gd2UgY2FuJ3Qgc2hvcnRjdXQgdGhlbVxyXG5cdC8vc2luY2Ugc2V0IGRvZXMgbm90IGZhaWwsIHdlIGtub3cgc3RhdGUgZXhpc3RzIGFuZCBjYW4gc2ltcGx5IHJldHVybiB0aGUgb2JqZWN0XHJcblx0c2V0Z2V0OiBmdW5jdGlvbihzdGF0ZU5hbWUsIHZhbHVlLCBub0V2ZW50Pyl7XHJcblx0XHQkU00uc2V0KHN0YXRlTmFtZSwgdmFsdWUsIG5vRXZlbnQpO1xyXG5cdFx0cmV0dXJuIGV2YWwoJygnKyRTTS5idWlsZFBhdGgoc3RhdGVOYW1lKSsnKScpO1xyXG5cdH0sXHJcblx0XHJcblx0cmVtb3ZlOiBmdW5jdGlvbihzdGF0ZU5hbWUsIG5vRXZlbnQ/KSB7XHJcblx0XHR2YXIgd2hpY2hTdGF0ZSA9ICRTTS5idWlsZFBhdGgoc3RhdGVOYW1lKTtcclxuXHRcdHRyeXtcclxuXHRcdFx0ZXZhbCgnKGRlbGV0ZSAnK3doaWNoU3RhdGUrJyknKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Ly9pdCBkaWRuJ3QgZXhpc3QgaW4gdGhlIGZpcnN0IHBsYWNlXHJcblx0XHRcdEVuZ2luZS5sb2coJ1dBUk5JTkc6IFRyaWVkIHRvIHJlbW92ZSBub24tZXhpc3RhbnQgc3RhdGUgXFwnJytzdGF0ZU5hbWUrJ1xcJy4nKTtcclxuXHRcdH1cclxuXHRcdGlmKCFub0V2ZW50KXtcclxuXHRcdFx0RW5naW5lLnNhdmVHYW1lKCk7XHJcblx0XHRcdCRTTS5maXJlVXBkYXRlKHN0YXRlTmFtZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHQvL2NyZWF0ZXMgZnVsbCByZWZlcmVuY2UgZnJvbSBpbnB1dFxyXG5cdC8vaG9wZWZ1bGx5IHRoaXMgd29uJ3QgZXZlciBuZWVkIHRvIGJlIG1vcmUgY29tcGxpY2F0ZWRcclxuXHRidWlsZFBhdGg6IGZ1bmN0aW9uKGlucHV0KXtcclxuXHRcdHZhciBkb3QgPSAoaW5wdXQuY2hhckF0KDApID09ICdbJyk/ICcnIDogJy4nOyAvL2lmIGl0IHN0YXJ0cyB3aXRoIFtmb29dIG5vIGRvdCB0byBqb2luXHJcblx0XHRyZXR1cm4gJ1N0YXRlJyArIGRvdCArIGlucHV0O1xyXG5cdH0sXHJcblx0XHJcblx0ZmlyZVVwZGF0ZTogZnVuY3Rpb24oc3RhdGVOYW1lLCBzYXZlPyl7XHJcblx0XHR2YXIgY2F0ZWdvcnkgPSAkU00uZ2V0Q2F0ZWdvcnkoc3RhdGVOYW1lKTtcclxuXHRcdGlmKHN0YXRlTmFtZSA9PSB1bmRlZmluZWQpIHN0YXRlTmFtZSA9IGNhdGVnb3J5ID0gJ2FsbCc7IC8vYmVzdCBpZiB0aGlzIGRvZXNuJ3QgaGFwcGVuIGFzIGl0IHdpbGwgdHJpZ2dlciBtb3JlIHN0dWZmXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHQkLkRpc3BhdGNoKCdzdGF0ZVVwZGF0ZScpLnB1Ymxpc2goeydjYXRlZ29yeSc6IGNhdGVnb3J5LCAnc3RhdGVOYW1lJzpzdGF0ZU5hbWV9KTtcclxuXHRcdGlmKHNhdmUpIEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdH0sXHJcblx0XHJcblx0Z2V0Q2F0ZWdvcnk6IGZ1bmN0aW9uKHN0YXRlTmFtZSl7XHJcblx0XHR2YXIgZmlyc3RPQiA9IHN0YXRlTmFtZS5pbmRleE9mKCdbJyk7XHJcblx0XHR2YXIgZmlyc3REb3QgPSBzdGF0ZU5hbWUuaW5kZXhPZignLicpO1xyXG5cdFx0dmFyIGN1dG9mZiA9IG51bGw7XHJcblx0XHRpZihmaXJzdE9CID09IC0xIHx8IGZpcnN0RG90ID09IC0xKXtcclxuXHRcdFx0Y3V0b2ZmID0gZmlyc3RPQiA+IGZpcnN0RG90ID8gZmlyc3RPQiA6IGZpcnN0RG90O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y3V0b2ZmID0gZmlyc3RPQiA8IGZpcnN0RG90ID8gZmlyc3RPQiA6IGZpcnN0RG90O1xyXG5cdFx0fVxyXG5cdFx0aWYgKGN1dG9mZiA9PSAtMSl7XHJcblx0XHRcdHJldHVybiBzdGF0ZU5hbWU7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gc3RhdGVOYW1lLnN1YnN0cigwLGN1dG9mZik7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblx0ICogU3RhcnQgb2Ygc3BlY2lmaWMgc3RhdGUgZnVuY3Rpb25zXHJcblx0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHQvL1BFUktTXHJcblx0YWRkUGVyazogZnVuY3Rpb24obmFtZSkge1xyXG5cdFx0JFNNLnNldCgnY2hhcmFjdGVyLnBlcmtzW1wiJytuYW1lKydcIl0nLCB0cnVlKTtcclxuXHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIEVuZ2luZS5QZXJrc1tuYW1lXS5ub3RpZnkpO1xyXG5cdH0sXHJcblx0XHJcblx0aGFzUGVyazogZnVuY3Rpb24obmFtZSkge1xyXG5cdFx0cmV0dXJuICRTTS5nZXQoJ2NoYXJhY3Rlci5wZXJrc1tcIicrbmFtZSsnXCJdJyk7XHJcblx0fSxcclxuXHRcclxuXHQvL0lOQ09NRVxyXG5cdHNldEluY29tZTogZnVuY3Rpb24oc291cmNlLCBvcHRpb25zKSB7XHJcblx0XHR2YXIgZXhpc3RpbmcgPSAkU00uZ2V0KCdpbmNvbWVbXCInK3NvdXJjZSsnXCJdJyk7XHJcblx0XHRpZih0eXBlb2YgZXhpc3RpbmcgIT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0b3B0aW9ucy50aW1lTGVmdCA9IChleGlzdGluZyBhcyBhbnkpPy50aW1lTGVmdDtcclxuXHRcdH1cclxuXHRcdCRTTS5zZXQoJ2luY29tZVtcIicrc291cmNlKydcIl0nLCBvcHRpb25zKTtcclxuXHR9LFxyXG5cdFxyXG5cdGdldEluY29tZTogZnVuY3Rpb24oc291cmNlKSB7XHJcblx0XHR2YXIgZXhpc3RpbmcgPSAkU00uZ2V0KCdpbmNvbWVbXCInK3NvdXJjZSsnXCJdJyk7XHJcblx0XHRpZih0eXBlb2YgZXhpc3RpbmcgIT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0cmV0dXJuIGV4aXN0aW5nO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHt9O1xyXG5cdH0sXHRcclxuXHRcclxuXHQvL01pc2NcclxuXHRudW06IGZ1bmN0aW9uKG5hbWUsIGNyYWZ0YWJsZSkge1xyXG5cdFx0c3dpdGNoKGNyYWZ0YWJsZS50eXBlKSB7XHJcblx0XHRjYXNlICdnb29kJzpcclxuXHRcdGNhc2UgJ3Rvb2wnOlxyXG5cdFx0Y2FzZSAnd2VhcG9uJzpcclxuXHRcdGNhc2UgJ3VwZ3JhZGUnOlxyXG5cdFx0XHRyZXR1cm4gJFNNLmdldCgnc3RvcmVzW1wiJytuYW1lKydcIl0nLCB0cnVlKTtcclxuXHRcdGNhc2UgJ2J1aWxkaW5nJzpcclxuXHRcdFx0cmV0dXJuICRTTS5nZXQoJ2dhbWUuYnVpbGRpbmdzW1wiJytuYW1lKydcIl0nLCB0cnVlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGhhbmRsZVN0YXRlVXBkYXRlczogZnVuY3Rpb24oZSl7XHJcblx0XHRcclxuXHR9XHRcclxufTtcclxuXHJcbi8vYWxpYXNcclxuZXhwb3J0IGNvbnN0ICRTTSA9IFN0YXRlTWFuYWdlcjtcclxuIiwiaW1wb3J0IHsgTm90aWZpY2F0aW9ucyB9IGZyb20gJy4vbm90aWZpY2F0aW9ucyc7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gJy4vc3RhdGVfbWFuYWdlcic7XHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gJy4vZW5naW5lJztcclxuXHJcbmV4cG9ydCBjb25zdCBXZWF0aGVyID0ge1xyXG4gICAgaW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cclxuICAgICAgICAvL3N1YnNjcmliZSB0byBzdGF0ZVVwZGF0ZXNcclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcblx0XHQkLkRpc3BhdGNoKCdzdGF0ZVVwZGF0ZScpLnN1YnNjcmliZShXZWF0aGVyLmhhbmRsZVN0YXRlVXBkYXRlcyk7XHJcbiAgICB9LFxyXG5cclxuICAgIGhhbmRsZVN0YXRlVXBkYXRlczogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGlmIChlLmNhdGVnb3J5ID09ICd3ZWF0aGVyJykge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKCRTTS5nZXQoJ3dlYXRoZXInKSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnc3VubnknOiBcclxuICAgICAgICAgICAgICAgICAgICBXZWF0aGVyLnN0YXJ0U3VubnkoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2Nsb3VkeSc6XHJcbiAgICAgICAgICAgICAgICAgICAgV2VhdGhlci5zdGFydENsb3VkeSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAncmFpbnknOlxyXG4gICAgICAgICAgICAgICAgICAgIFdlYXRoZXIuc3RhcnRSYWlueSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX2xhc3RXZWF0aGVyOiAnc3VubnknLFxyXG5cclxuICAgIHN0YXJ0U3Vubnk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiVGhlIHN1biBiZWdpbnMgdG8gc2hpbmUuXCIpO1xyXG4gICAgICAgIFdlYXRoZXIuX2xhc3RXZWF0aGVyID0gJ3N1bm55JztcclxuICAgICAgICAkKCdib2R5JykuYW5pbWF0ZSh7YmFja2dyb3VuZENvbG9yOiAnI0ZGRkZGRid9LCAnc2xvdycpO1xyXG4gICAgICAgICQoJ2RpdiNzdG9yZXM6OmJlZm9yZScpLmFuaW1hdGUoe2JhY2tncm91bmRDb2xvcjogJyNGRkZGRkYnfSwgJ3Nsb3cnKTtcclxuICAgICAgICBXZWF0aGVyLm1ha2VSYWluU3RvcCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzdGFydENsb3VkeTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKFdlYXRoZXIuX2xhc3RXZWF0aGVyID09ICdzdW5ueScpIHtcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJDbG91ZHMgcm9sbCBpbiwgb2JzY3VyaW5nIHRoZSBzdW4uXCIpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoV2VhdGhlci5fbGFzdFdlYXRoZXIgPT0gJ3JhaW55Jykge1xyXG4gICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIlRoZSByYWluIGJyZWFrcywgYnV0IHRoZSBjbG91ZHMgcmVtYWluLlwiKVxyXG4gICAgICAgIH1cclxuICAgICAgICAkKCdib2R5JykuYW5pbWF0ZSh7YmFja2dyb3VuZENvbG9yOiAnIzhCODc4Nid9LCAnc2xvdycpO1xyXG4gICAgICAgICQoJ2RpdiNzdG9yZXM6OmJlZm9yZScpLmFuaW1hdGUoe2JhY2tncm91bmRDb2xvcjogJyM4Qjg3ODYnfSwgJ3Nsb3cnKTtcclxuICAgICAgICBXZWF0aGVyLl9sYXN0V2VhdGhlciA9ICdjbG91ZHknO1xyXG4gICAgICAgIFdlYXRoZXIubWFrZVJhaW5TdG9wKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHN0YXJ0UmFpbnk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmIChXZWF0aGVyLl9sYXN0V2VhdGhlciA9PSAnc3VubnknKSB7XHJcbiAgICAgICAgICAgIE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiVGhlIHdpbmQgc3VkZGVubHkgcGlja3MgdXAuIENsb3VkcyByb2xsIGluLCBoZWF2eSB3aXRoIHJhaW4sIGFuZCByYWluZHJvcHMgZmFsbCBzb29uIGFmdGVyLlwiKTtcclxuICAgICAgICB9IGVsc2UgaWYgKFdlYXRoZXIuX2xhc3RXZWF0aGVyID09ICdjbG91ZHknKSB7XHJcbiAgICAgICAgICAgIE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiVGhlIGNsb3VkcyB0aGF0IHdlcmUgcHJldmlvdXNseSBjb250ZW50IHRvIGhhbmcgb3ZlcmhlYWQgbGV0IGxvb3NlIGEgbW9kZXJhdGUgZG93bnBvdXIuXCIpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICQoJ2JvZHknKS5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6ICcjNkQ2OTY4J30sICdzbG93Jyk7XHJcbiAgICAgICAgJCgnZGl2I3N0b3Jlczo6YmVmb3JlJykuYW5pbWF0ZSh7YmFja2dyb3VuZENvbG9yOiAnIzZENjk2OCd9LCAnc2xvdycpO1xyXG4gICAgICAgIFdlYXRoZXIuX2xhc3RXZWF0aGVyID0gJ3JhaW55JztcclxuICAgICAgICBXZWF0aGVyLm1ha2VJdFJhaW4oKTtcclxuICAgIH0sXHJcblxyXG4gICAgX2xvY2F0aW9uOiAnJyxcclxuXHJcbiAgICBpbml0aWF0ZVdlYXRoZXI6IGZ1bmN0aW9uKGF2YWlsYWJsZVdlYXRoZXIsIGxvY2F0aW9uKSB7XHJcbiAgICAgICAgaWYgKFdlYXRoZXIuX2xvY2F0aW9uID09ICcnKSBXZWF0aGVyLl9sb2NhdGlvbiA9IGxvY2F0aW9uO1xyXG4gICAgICAgIC8vIGlmIGluIG5ldyBsb2NhdGlvbiwgZW5kIHdpdGhvdXQgdHJpZ2dlcmluZyBhIG5ldyB3ZWF0aGVyIGluaXRpYXRpb24sIFxyXG4gICAgICAgIC8vIGxlYXZpbmcgdGhlIG5ldyBsb2NhdGlvbidzIGluaXRpYXRlV2VhdGhlciBjYWxsYmFjayB0byBkbyBpdHMgdGhpbmdcclxuICAgICAgICBlbHNlIGlmIChXZWF0aGVyLl9sb2NhdGlvbiAhPSBsb2NhdGlvbikgcmV0dXJuOyBcclxuXHJcbiAgICAgICAgdmFyIGNob3NlbldlYXRoZXIgPSAnbm9uZSc7XHJcbiAgICAgICAgLy9nZXQgb3VyIHJhbmRvbSBmcm9tIDAgdG8gMVxyXG4gICAgICAgIHZhciBybmQgPSBNYXRoLnJhbmRvbSgpO1xyXG4gIFxyXG4gICAgICAgIC8vaW5pdGlhbGlzZSBvdXIgY3VtdWxhdGl2ZSBwZXJjZW50YWdlXHJcbiAgICAgICAgdmFyIGN1bXVsYXRpdmVDaGFuY2UgPSAwO1xyXG4gICAgICAgIGZvciAodmFyIGkgaW4gYXZhaWxhYmxlV2VhdGhlcikge1xyXG4gICAgICAgICAgICBjdW11bGF0aXZlQ2hhbmNlICs9IGF2YWlsYWJsZVdlYXRoZXJbaV07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAocm5kIDwgY3VtdWxhdGl2ZUNoYW5jZSkge1xyXG4gICAgICAgICAgICAgICAgY2hvc2VuV2VhdGhlciA9IGk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNob3NlbldlYXRoZXIgIT0gJFNNLmdldCgnd2VhdGhlcicpKSAkU00uc2V0KCd3ZWF0aGVyJywgY2hvc2VuV2VhdGhlcik7XHJcbiAgICAgICAgRW5naW5lLnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmluaXRpYXRlV2VhdGhlcihhdmFpbGFibGVXZWF0aGVyLCBsb2NhdGlvbik7XHJcbiAgICAgICAgfSwgMyAqIDYwICogMTAwMCk7XHJcbiAgICB9LFxyXG5cclxuICAgIG1ha2VJdFJhaW46IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIGh0dHBzOi8vY29kZXBlbi5pby9hcmlja2xlL3Blbi9YS2pNWllcclxuICAgICAgICAvL2NsZWFyIG91dCBldmVyeXRoaW5nXHJcbiAgICAgICAgJCgnLnJhaW4nKS5lbXB0eSgpO1xyXG4gICAgICBcclxuICAgICAgICB2YXIgaW5jcmVtZW50ID0gMDtcclxuICAgICAgICB2YXIgZHJvcHMgPSBcIlwiO1xyXG4gICAgICAgIHZhciBiYWNrRHJvcHMgPSBcIlwiO1xyXG4gICAgICBcclxuICAgICAgICB3aGlsZSAoaW5jcmVtZW50IDwgMTAwKSB7XHJcbiAgICAgICAgICAvL2NvdXBsZSByYW5kb20gbnVtYmVycyB0byB1c2UgZm9yIHZhcmlvdXMgcmFuZG9taXphdGlvbnNcclxuICAgICAgICAgIC8vcmFuZG9tIG51bWJlciBiZXR3ZWVuIDk4IGFuZCAxXHJcbiAgICAgICAgICB2YXIgcmFuZG9IdW5kbyA9IChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoOTggLSAxICsgMSkgKyAxKSk7XHJcbiAgICAgICAgICAvL3JhbmRvbSBudW1iZXIgYmV0d2VlbiA1IGFuZCAyXHJcbiAgICAgICAgICB2YXIgcmFuZG9GaXZlciA9IChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoNSAtIDIgKyAxKSArIDIpKTtcclxuICAgICAgICAgIC8vaW5jcmVtZW50XHJcbiAgICAgICAgICBpbmNyZW1lbnQgKz0gcmFuZG9GaXZlcjtcclxuICAgICAgICAgIC8vYWRkIGluIGEgbmV3IHJhaW5kcm9wIHdpdGggdmFyaW91cyByYW5kb21pemF0aW9ucyB0byBjZXJ0YWluIENTUyBwcm9wZXJ0aWVzXHJcbiAgICAgICAgICBkcm9wcyArPSAnPGRpdiBjbGFzcz1cImRyb3BcIiBzdHlsZT1cImxlZnQ6ICcgKyBpbmNyZW1lbnQgKyAnJTsgYm90dG9tOiAnICsgKHJhbmRvRml2ZXIgKyByYW5kb0ZpdmVyIC0gMSArIDEwMCkgKyAnJTsgYW5pbWF0aW9uLWRlbGF5OiAwLicgKyByYW5kb0h1bmRvICsgJ3M7IGFuaW1hdGlvbi1kdXJhdGlvbjogMC41JyArIHJhbmRvSHVuZG8gKyAncztcIj48ZGl2IGNsYXNzPVwic3RlbVwiIHN0eWxlPVwiYW5pbWF0aW9uLWRlbGF5OiAwLicgKyByYW5kb0h1bmRvICsgJ3M7IGFuaW1hdGlvbi1kdXJhdGlvbjogMC41JyArIHJhbmRvSHVuZG8gKyAncztcIj48L2Rpdj48ZGl2IGNsYXNzPVwic3BsYXRcIiBzdHlsZT1cImFuaW1hdGlvbi1kZWxheTogMC4nICsgcmFuZG9IdW5kbyArICdzOyBhbmltYXRpb24tZHVyYXRpb246IDAuNScgKyByYW5kb0h1bmRvICsgJ3M7XCI+PC9kaXY+PC9kaXY+JztcclxuICAgICAgICAgIGJhY2tEcm9wcyArPSAnPGRpdiBjbGFzcz1cImRyb3BcIiBzdHlsZT1cInJpZ2h0OiAnICsgaW5jcmVtZW50ICsgJyU7IGJvdHRvbTogJyArIChyYW5kb0ZpdmVyICsgcmFuZG9GaXZlciAtIDEgKyAxMDApICsgJyU7IGFuaW1hdGlvbi1kZWxheTogMC4nICsgcmFuZG9IdW5kbyArICdzOyBhbmltYXRpb24tZHVyYXRpb246IDAuNScgKyByYW5kb0h1bmRvICsgJ3M7XCI+PGRpdiBjbGFzcz1cInN0ZW1cIiBzdHlsZT1cImFuaW1hdGlvbi1kZWxheTogMC4nICsgcmFuZG9IdW5kbyArICdzOyBhbmltYXRpb24tZHVyYXRpb246IDAuNScgKyByYW5kb0h1bmRvICsgJ3M7XCI+PC9kaXY+PGRpdiBjbGFzcz1cInNwbGF0XCIgc3R5bGU9XCJhbmltYXRpb24tZGVsYXk6IDAuJyArIHJhbmRvSHVuZG8gKyAnczsgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjUnICsgcmFuZG9IdW5kbyArICdzO1wiPjwvZGl2PjwvZGl2Pic7XHJcbiAgICAgICAgfVxyXG4gICAgICBcclxuICAgICAgICAkKCcucmFpbi5mcm9udC1yb3cnKS5hcHBlbmQoZHJvcHMpO1xyXG4gICAgICAgICQoJy5yYWluLmJhY2stcm93JykuYXBwZW5kKGJhY2tEcm9wcyk7XHJcbiAgICB9LFxyXG5cclxuICAgIG1ha2VSYWluU3RvcDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCgnLnJhaW4nKS5lbXB0eSgpO1xyXG4gICAgfVxyXG59Il19
