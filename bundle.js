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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL3RyYW5zbGF0ZS50cyIsInNyYy9zY3JpcHQvQnV0dG9uLnRzIiwic3JjL3NjcmlwdC9jaGFyYWN0ZXJzL2NhcHRhaW4udHMiLCJzcmMvc2NyaXB0L2NoYXJhY3RlcnMvbGl6LnRzIiwic3JjL3NjcmlwdC9jaGFyYWN0ZXJzL21heW9yLnRzIiwic3JjL3NjcmlwdC9lbmdpbmUudHMiLCJzcmMvc2NyaXB0L2V2ZW50cy50cyIsInNyYy9zY3JpcHQvZXZlbnRzL3JvYWR3YW5kZXIudHMiLCJzcmMvc2NyaXB0L2V2ZW50cy9yb29tLnRzIiwic3JjL3NjcmlwdC9oZWFkZXIudHMiLCJzcmMvc2NyaXB0L25vdGlmaWNhdGlvbnMudHMiLCJzcmMvc2NyaXB0L3BsYWNlcy9vdXRwb3N0LnRzIiwic3JjL3NjcmlwdC9wbGFjZXMvcm9hZC50cyIsInNyYy9zY3JpcHQvcGxhY2VzL3Jvb20udHMiLCJzcmMvc2NyaXB0L3BsYXllci9jaGFyYWN0ZXIudHMiLCJzcmMvc2NyaXB0L3BsYXllci9pdGVtTGlzdC50cyIsInNyYy9zY3JpcHQvc3RhdGVfbWFuYWdlci50cyIsInNyYy9zY3JpcHQvd2VhdGhlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQSxnQkFBZ0I7OztBQUVoQixrQ0FBa0M7QUFDbEMsS0FBSztBQUNMLHVDQUF1QztBQUV2QyxvQ0FBb0M7QUFDcEMsTUFBTTtBQUNOLDJDQUEyQztBQUMzQyxNQUFNO0FBQ04sbUNBQW1DO0FBQ25DLE1BQU07QUFDTixzQ0FBc0M7QUFDdEMsMENBQTBDO0FBRTFDLHFDQUFxQztBQUNyQyxNQUFNO0FBRU4sa0JBQWtCO0FBQ2xCLE1BQU07QUFFTiw4REFBOEQ7QUFDOUQsb0NBQW9DO0FBRXBDLHVIQUF1SDtBQUN2SCx3Q0FBd0M7QUFDeEMsNkJBQTZCO0FBQzdCLCtCQUErQjtBQUMvQixzRUFBc0U7QUFDdEUsT0FBTztB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QyxHQUFHLEdBQUcsQ0FBQyxHQUFHLHdCQUF3QixHQUFHLFVBQVUsR0FBRyw0QkFBNEIsR0FBRyxVQUFVLEdBQUcsa0RBQWtELEdBQUcsVUFBVSxHQUFHLDRCQUE0QixHQUFHLFVBQVUsR0FBRyx5REFBeUQsR0FBRyxVQUFVLEdBQUcsNEJBQTRCLEdBQUcsVUFBVSxHQUFHLGtCQUFrQixDQUFDO1FBQ2hjLENBQUM7UUFFRCxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRCxZQUFZLEVBQUU7UUFDVixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDdkIsQ0FBQztDQUNKLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyAoZnVuY3Rpb24oKSB7XHJcblxyXG4vLyBcdHZhciB0cmFuc2xhdGUgPSBmdW5jdGlvbih0ZXh0KVxyXG4vLyBcdHtcclxuLy8gXHRcdHZhciB4bGF0ZSA9IHRyYW5zbGF0ZUxvb2t1cCh0ZXh0KTtcclxuXHRcdFxyXG4vLyBcdFx0aWYgKHR5cGVvZiB4bGF0ZSA9PSBcImZ1bmN0aW9uXCIpXHJcbi8vIFx0XHR7XHJcbi8vIFx0XHRcdHhsYXRlID0geGxhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuLy8gXHRcdH1cclxuLy8gXHRcdGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKVxyXG4vLyBcdFx0e1xyXG4vLyBcdFx0XHR2YXIgYXBzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xyXG4vLyBcdFx0XHR2YXIgYXJncyA9IGFwcy5jYWxsKCBhcmd1bWVudHMsIDEgKTtcclxuICBcclxuLy8gXHRcdFx0eGxhdGUgPSBmb3JtYXR0ZXIoeGxhdGUsIGFyZ3MpO1xyXG4vLyBcdFx0fVxyXG5cdFx0XHJcbi8vIFx0XHRyZXR1cm4geGxhdGU7XHJcbi8vIFx0fTtcclxuXHRcclxuLy8gXHQvLyBJIHdhbnQgaXQgYXZhaWxhYmxlIGV4cGxpY2l0eSBhcyB3ZWxsIGFzIHZpYSB0aGUgb2JqZWN0XHJcbi8vIFx0dHJhbnNsYXRlLnRyYW5zbGF0ZSA9IHRyYW5zbGF0ZTtcclxuXHRcclxuLy8gXHQvL2Zyb20gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vNzc2MTk2IHZpYSBodHRwOi8vZGF2ZWRhc2guY29tLzIwMTAvMTEvMTkvcHl0aG9uaWMtc3RyaW5nLWZvcm1hdHRpbmctaW4tamF2YXNjcmlwdC8gXHJcbi8vIFx0dmFyIGRlZmF1bHRGb3JtYXR0ZXIgPSAoZnVuY3Rpb24oKSB7XHJcbi8vIFx0XHR2YXIgcmUgPSAvXFx7KFtefV0rKVxcfS9nO1xyXG4vLyBcdFx0cmV0dXJuIGZ1bmN0aW9uKHMsIGFyZ3MpIHtcclxuLy8gXHRcdFx0cmV0dXJuIHMucmVwbGFjZShyZSwgZnVuY3Rpb24oXywgbWF0Y2gpeyByZXR1cm4gYXJnc1ttYXRjaF07IH0pO1xyXG4vLyBcdFx0fTtcclxuLy8gXHR9KCkpO1xyXG4vLyBcdHZhciBmb3JtYXR0ZXIgPSBkZWZhdWx0Rm9ybWF0dGVyO1xyXG4vLyBcdHRyYW5zbGF0ZS5zZXRGb3JtYXR0ZXIgPSBmdW5jdGlvbihuZXdGb3JtYXR0ZXIpXHJcbi8vIFx0e1xyXG4vLyBcdFx0Zm9ybWF0dGVyID0gbmV3Rm9ybWF0dGVyO1xyXG4vLyBcdH07XHJcblx0XHJcbi8vIFx0dHJhbnNsYXRlLmZvcm1hdCA9IGZ1bmN0aW9uKClcclxuLy8gXHR7XHJcbi8vIFx0XHR2YXIgYXBzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xyXG4vLyBcdFx0dmFyIHMgPSBhcmd1bWVudHNbMF07XHJcbi8vIFx0XHR2YXIgYXJncyA9IGFwcy5jYWxsKCBhcmd1bWVudHMsIDEgKTtcclxuICBcclxuLy8gXHRcdHJldHVybiBmb3JtYXR0ZXIocywgYXJncyk7XHJcbi8vIFx0fTtcclxuXHJcbi8vIFx0dmFyIGR5bm9UcmFucyA9IG51bGw7XHJcbi8vIFx0dHJhbnNsYXRlLnNldER5bmFtaWNUcmFuc2xhdG9yID0gZnVuY3Rpb24obmV3RHlub1RyYW5zKVxyXG4vLyBcdHtcclxuLy8gXHRcdGR5bm9UcmFucyA9IG5ld0R5bm9UcmFucztcclxuLy8gXHR9O1xyXG5cclxuLy8gXHR2YXIgdHJhbnNsYXRpb24gPSBudWxsO1xyXG4vLyBcdHRyYW5zbGF0ZS5zZXRUcmFuc2xhdGlvbiA9IGZ1bmN0aW9uKG5ld1RyYW5zbGF0aW9uKVxyXG4vLyBcdHtcclxuLy8gXHRcdHRyYW5zbGF0aW9uID0gbmV3VHJhbnNsYXRpb247XHJcbi8vIFx0fTtcclxuXHRcclxuLy8gXHRmdW5jdGlvbiB0cmFuc2xhdGVMb29rdXAodGFyZ2V0KVxyXG4vLyBcdHtcclxuLy8gXHRcdGlmICh0cmFuc2xhdGlvbiA9PSBudWxsIHx8IHRhcmdldCA9PSBudWxsKVxyXG4vLyBcdFx0e1xyXG4vLyBcdFx0XHRyZXR1cm4gdGFyZ2V0O1xyXG4vLyBcdFx0fVxyXG5cdFx0XHJcbi8vIFx0XHRpZiAodGFyZ2V0IGluIHRyYW5zbGF0aW9uID09IGZhbHNlKVxyXG4vLyBcdFx0e1xyXG4vLyBcdFx0XHRpZiAoZHlub1RyYW5zICE9IG51bGwpXHJcbi8vIFx0XHRcdHtcclxuLy8gXHRcdFx0XHRyZXR1cm4gZHlub1RyYW5zKHRhcmdldCk7XHJcbi8vIFx0XHRcdH1cclxuLy8gXHRcdFx0cmV0dXJuIHRhcmdldDtcclxuLy8gXHRcdH1cclxuXHRcdFxyXG4vLyBcdFx0dmFyIHJlc3VsdCA9IHRyYW5zbGF0aW9uW3RhcmdldF07XHJcbi8vIFx0XHRpZiAocmVzdWx0ID09IG51bGwpXHJcbi8vIFx0XHR7XHJcbi8vIFx0XHRcdHJldHVybiB0YXJnZXQ7XHJcbi8vIFx0XHR9XHJcblx0XHRcclxuLy8gXHRcdHJldHVybiByZXN1bHQ7XHJcbi8vIFx0fTtcclxuXHRcclxuLy8gXHR3aW5kb3cuXyA9IHRyYW5zbGF0ZTtcclxuXHJcbi8vIH0pKCk7XHJcblxyXG4vLyBleHBvcnQgY29uc3QgXyA9IHdpbmRvdy5fO1xyXG5cclxuZXhwb3J0IGNvbnN0IF8gPSBmdW5jdGlvbihzKSB7IHJldHVybiBzOyB9IiwiaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4vZW5naW5lXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEJ1dHRvbiA9IHtcclxuXHRCdXR0b246IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHRcdGlmKHR5cGVvZiBvcHRpb25zLmNvb2xkb3duID09ICdudW1iZXInKSB7XHJcblx0XHRcdHRoaXMuZGF0YV9jb29sZG93biA9IG9wdGlvbnMuY29vbGRvd247XHJcblx0XHR9XHJcblx0XHR0aGlzLmRhdGFfcmVtYWluaW5nID0gMDtcclxuXHRcdGlmKHR5cGVvZiBvcHRpb25zLmNsaWNrID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0dGhpcy5kYXRhX2hhbmRsZXIgPSBvcHRpb25zLmNsaWNrO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR2YXIgZWwgPSAkKCc8ZGl2PicpXHJcblx0XHRcdC5hdHRyKCdpZCcsIHR5cGVvZihvcHRpb25zLmlkKSAhPSAndW5kZWZpbmVkJyA/IG9wdGlvbnMuaWQgOiBcIkJUTl9cIiArIEVuZ2luZS5nZXRHdWlkKCkpXHJcblx0XHRcdC5hZGRDbGFzcygnYnV0dG9uJylcclxuXHRcdFx0LnRleHQodHlwZW9mKG9wdGlvbnMudGV4dCkgIT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLnRleHQgOiBcImJ1dHRvblwiKVxyXG5cdFx0XHQuY2xpY2soZnVuY3Rpb24oKSB7IFxyXG5cdFx0XHRcdGlmKCEkKHRoaXMpLmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XHJcblx0XHRcdFx0XHRCdXR0b24uY29vbGRvd24oJCh0aGlzKSk7XHJcblx0XHRcdFx0XHQkKHRoaXMpLmRhdGEoXCJoYW5kbGVyXCIpKCQodGhpcykpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0LmRhdGEoXCJoYW5kbGVyXCIsICB0eXBlb2Ygb3B0aW9ucy5jbGljayA9PSAnZnVuY3Rpb24nID8gb3B0aW9ucy5jbGljayA6IGZ1bmN0aW9uKCkgeyBFbmdpbmUubG9nKFwiY2xpY2tcIik7IH0pXHJcblx0XHRcdC5kYXRhKFwicmVtYWluaW5nXCIsIDApXHJcblx0XHRcdC5kYXRhKFwiY29vbGRvd25cIiwgdHlwZW9mIG9wdGlvbnMuY29vbGRvd24gPT0gJ251bWJlcicgPyBvcHRpb25zLmNvb2xkb3duIDogMCk7XHJcblx0XHRcclxuXHRcdGVsLmFwcGVuZCgkKFwiPGRpdj5cIikuYWRkQ2xhc3MoJ2Nvb2xkb3duJykpO1xyXG5cdFx0XHJcblx0XHRpZihvcHRpb25zLmNvc3QpIHtcclxuXHRcdFx0dmFyIHR0UG9zID0gb3B0aW9ucy50dFBvcyA/IG9wdGlvbnMudHRQb3MgOiBcImJvdHRvbSByaWdodFwiO1xyXG5cdFx0XHR2YXIgY29zdFRvb2x0aXAgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCd0b29sdGlwICcgKyB0dFBvcyk7XHJcblx0XHRcdGZvcih2YXIgayBpbiBvcHRpb25zLmNvc3QpIHtcclxuXHRcdFx0XHQkKFwiPGRpdj5cIikuYWRkQ2xhc3MoJ3Jvd19rZXknKS50ZXh0KF8oaykpLmFwcGVuZFRvKGNvc3RUb29sdGlwKTtcclxuXHRcdFx0XHQkKFwiPGRpdj5cIikuYWRkQ2xhc3MoJ3Jvd192YWwnKS50ZXh0KG9wdGlvbnMuY29zdFtrXSkuYXBwZW5kVG8oY29zdFRvb2x0aXApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNvc3RUb29sdGlwLmNoaWxkcmVuKCkubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdGNvc3RUb29sdGlwLmFwcGVuZFRvKGVsKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZihvcHRpb25zLndpZHRoKSB7XHJcblx0XHRcdGVsLmNzcygnd2lkdGgnLCBvcHRpb25zLndpZHRoKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGVsO1xyXG5cdH0sXHJcblx0XHJcblx0c2V0RGlzYWJsZWQ6IGZ1bmN0aW9uKGJ0biwgZGlzYWJsZWQpIHtcclxuXHRcdGlmKGJ0bikge1xyXG5cdFx0XHRpZighZGlzYWJsZWQgJiYgIWJ0bi5kYXRhKCdvbkNvb2xkb3duJykpIHtcclxuXHRcdFx0XHRidG4ucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdH0gZWxzZSBpZihkaXNhYmxlZCkge1xyXG5cdFx0XHRcdGJ0bi5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRidG4uZGF0YSgnZGlzYWJsZWQnLCBkaXNhYmxlZCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRpc0Rpc2FibGVkOiBmdW5jdGlvbihidG4pIHtcclxuXHRcdGlmKGJ0bikge1xyXG5cdFx0XHRyZXR1cm4gYnRuLmRhdGEoJ2Rpc2FibGVkJykgPT09IHRydWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHRcclxuXHRjb29sZG93bjogZnVuY3Rpb24oYnRuKSB7XHJcblx0XHR2YXIgY2QgPSBidG4uZGF0YShcImNvb2xkb3duXCIpO1xyXG5cdFx0aWYoY2QgPiAwKSB7XHJcblx0XHRcdCQoJ2Rpdi5jb29sZG93bicsIGJ0bikuc3RvcCh0cnVlLCB0cnVlKS53aWR0aChcIjEwMCVcIikuYW5pbWF0ZSh7d2lkdGg6ICcwJSd9LCBjZCAqIDEwMDAsICdsaW5lYXInLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgYiA9ICQodGhpcykuY2xvc2VzdCgnLmJ1dHRvbicpO1xyXG5cdFx0XHRcdGIuZGF0YSgnb25Db29sZG93bicsIGZhbHNlKTtcclxuXHRcdFx0XHRpZighYi5kYXRhKCdkaXNhYmxlZCcpKSB7XHJcblx0XHRcdFx0XHRiLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdGJ0bi5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdFx0YnRuLmRhdGEoJ29uQ29vbGRvd24nLCB0cnVlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGNsZWFyQ29vbGRvd246IGZ1bmN0aW9uKGJ0bikge1xyXG5cdFx0JCgnZGl2LmNvb2xkb3duJywgYnRuKS5zdG9wKHRydWUsIHRydWUpO1xyXG5cdFx0YnRuLmRhdGEoJ29uQ29vbGRvd24nLCBmYWxzZSk7XHJcblx0XHRpZighYnRuLmRhdGEoJ2Rpc2FibGVkJykpIHtcclxuXHRcdFx0YnRuLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0fVxyXG5cdH1cclxufTsiLCJpbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCJcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIlxyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIlxyXG5cclxuZXhwb3J0IGNvbnN0IENhcHRhaW4gPSB7XHJcblx0dGFsa1RvQ2FwdGFpbjogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdUaGUgQ2FwdGFpblxcJ3MgVGVudCcpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlZW5GbGFnOiAoKSA9PiAkU00uZ2V0KCdvdXRwb3N0LmNhcHRhaW4uaGF2ZU1ldCcpLFxyXG5cdFx0XHRcdFx0bmV4dFNjZW5lOiAnbWFpbicsXHJcblx0XHRcdFx0XHRvbkxvYWQ6ICgpID0+ICRTTS5zZXQoJ291dHBvc3QuY2FwdGFpbi5oYXZlTWV0JywgMSksXHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1lvdSBlbnRlciB0aGUgZmFuY2llc3QtbG9va2luZyB0ZW50IGluIHRoZSBPdXRwb3N0LiBBIGxhcmdlIG1hbiB3aXRoIGEgdG9vdGhicnVzaCBtdXN0YWNoZSBhbmQgYSBzZXZlcmUgZnJvd24gbG9va3MgdXAgZnJvbSBoaXMgZGVzay4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnXCJTaXIsIHlvdSBoYXZlIGVudGVyZWQgdGhlIHRlbnQgb2YgQ2FwdGFpbiBGaW5uZWFzLiBXaGF0IGJ1c2luZXNzIGRvIHlvdSBoYXZlIGhlcmU/XCInKVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXNrQWJvdXRTdXBwbGllcyc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FzayBBYm91dCBTdXBwbGllcycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTogJ2Fza0Fib3V0U3VwcGxpZXMnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXNrQWJvdXRDYXB0YWluJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnQXNrIEFib3V0IENhcHRhaW4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6ICdjYXB0YWluUmFtYmxlJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnTGVhdmUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAnbWFpbic6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1RoZSBjYXB0YWluIGdyZWV0cyB5b3Ugd2FybWx5LicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIkFoaCwgeWVzLCB3ZWxjb21lIGJhY2suIFdoYXQgY2FuIEkgZG8gZm9yIHlvdT9cIicpXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhc2tBYm91dFN1cHBsaWVzJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnQXNrIEFib3V0IFN1cHBsaWVzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOidhc2tBYm91dFN1cHBsaWVzJ30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGU6ICgpID0+ICEkU00uZ2V0KCdvdXRwb3N0LmNhcHRhaW4uYXNrZWRBYm91dFN1cHBsaWVzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Fza0Fib3V0Q2FwdGFpbic6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FzayBBYm91dCBDYXB0YWluJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOidjYXB0YWluUmFtYmxlJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnTGVhdmUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAnY2FwdGFpblJhbWJsZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1RoZSBjYXB0YWluXFwncyBleWVzIGdsZWFtIGF0IHRoZSBvcHBvcnR1bml0eSB0byBydW4gZG93biBoaXMgbGlzdCBvZiBhY2hpZXZlbWVudHMuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiV2h5LCBJXFwnbGwgaGF2ZSB5b3Uga25vdyB0aGF0IHlvdSBzdGFuZCBpbiB0aGUgcHJlc2VuY2Ugb2Ygbm9uZSBvdGhlciB0aGFuIEZpbm5lYXMgSi4gRm9ic2xleSwgQ2FwdGFpbiBvZiB0aGUgUm95YWwgQXJteVxcJ3MgRmlmdGggRGl2aXNpb24sIHRoZSBmaW5lc3QgRGl2aXNpb24gaW4gSGlzIE1hamVzdHlcXCdzIHNlcnZpY2UuXCInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnSGUgcHVmZnMgb3V0IGhpcyBjaGVzdCwgZHJhd2luZyBhdHRlbnRpb24gdG8gaGlzIG1hbnkgbWVkYWxzLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIkkgaGF2ZSBjYW1wYWlnbmVkIG9uIGJlaGFsZiBvZiBPdXIgTG9yZHNoaXAgYWNyb3NzIG1hbnkgbGFuZHMsIGluY2x1ZGluZyBUaGUgRmFyIFdlc3QsIHRoZSBub3J0aGVybiBib3JkZXJzIG9mIFVtYmVyc2hpcmUgYW5kIFBlbGluZ2FsLCBOZXcgQmVsbGlzaWEsIGFuZCBlYWNoIG9mIHRoZSBGaXZlIElzbGVzIG9mIHRoZSBQaXJyaGlhbiBTZWEuXCInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnSGUgcGF1c2VzIGZvciBhIG1vbWVudCwgcGVyaGFwcyB0byBzZWUgaWYgeW91IGFyZSBzdWl0YWJseSBpbXByZXNzZWQsIHRoZW4gY29udGludWVzLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIkFzIENhcHRhaW4gb2YgdGhlIEZpZnRoIERpdmlzaW9uLCBJIGhhZCB0aGUgZXN0ZWVtZWQgcHJpdmlsZWdlIG9mIGVuc3VyaW5nIHRoZSBzYWZldHkgb2YgdGhlc2UgbGFuZHMgZm9yIG91ciBmYWlyIGNpdGl6ZW5zLiBJIGhhdmUgYmVlbiBhd2FyZGVkIG1hbnkgdGltZXMgb3ZlciBmb3IgbXkgYnJhdmVyeSBpbiB0aGUgZmFjZSBvZiB1dG1vc3QgcGVyaWwuIEZvciBpbnN0YW5jZSwgZHVyaW5nIHRoZSBTZWEgQ2FtcGFpZ24gb24gVGh5cHBlLCBUaGlyZCBvZiB0aGUgRml2ZSBJc2xlcywgd2Ugd2VyZSBhbWJ1c2hlZCB3aGlsZSBkaXNlbWJhcmtpbmcgZnJvbSBvdXIgc2hpcC4gVGhpbmtpbmcgcXVpY2tseSwgSS4uLlwiJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1RoZSBjYXB0YWluIGNvbnRpbnVlcyB0byByYW1ibGUgbGlrZSB0aGlzIGZvciBzZXZlcmFsIG1vcmUgbWludXRlcywgZ2l2aW5nIHlvdSB0aW1lIHRvIGJlY29tZSBtdWNoIG1vcmUgZmFtaWxpYXIgd2l0aCB0aGUgZGlydCB1bmRlciB5b3VyIGZpbmdlcm5haWxzLicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdcIi4uLiBhbmQgVEhBVCwgbXkgZ29vZCBhZHZlbnR1cmVyLCBpcyB3aHkgSSBhbHdheXMga2VlcCBmcmVzaCBiYXNpbCBvbiBoYW5kLlwiJylcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Zhc2NpbmF0aW5nJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnRmFzY2luYXRpbmcnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6J21haW5Db250aW51ZWQnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICdtYWluQ29udGludWVkJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXygnVGhlIGNhcHRhaW4gc2h1ZmZsZXMgaGlzIHBhcGVycyBpbiBhIHNvbWV3aGF0IHBlcmZvcm1hdGl2ZSB3YXkuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1wiV2FzIHRoZXJlIHNvbWV0aGluZyBlbHNlIHlvdSBuZWVkZWQ/XCInKVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXNrQWJvdXRTdXBwbGllcyc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FzayBBYm91dCBTdXBwbGllcycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTonYXNrQWJvdXRTdXBwbGllcyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlOiAoKSA9PiAhJFNNLmdldCgnb3V0cG9zdC5jYXB0YWluLmFza2VkQWJvdXRTdXBwbGllcycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhc2tBYm91dENhcHRhaW4nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdBc2sgQWJvdXQgQ2FwdGFpbicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTonY2FwdGFpblJhbWJsZSd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdsZWF2ZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0xlYXZlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgJ2Fza0Fib3V0U3VwcGxpZXMnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfKCdJIHN0aWxsIG5lZWQgdG8gd3JpdGUgdGhpcywgY2hlY2sgYmFjayBsYXRlci4gLUMnKVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0FpdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyBSb29tIH0gZnJvbSBcIi4uL3BsYWNlcy9yb29tXCI7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuLi9wbGF5ZXIvY2hhcmFjdGVyXCI7XHJcblxyXG5leHBvcnQgY29uc3QgTGl6ID0ge1xyXG4gICAgc2V0TGl6QWN0aXZlOiBmdW5jdGlvbigpIHtcclxuXHRcdCRTTS5zZXQoJ3ZpbGxhZ2UubGl6QWN0aXZlJywgMSk7XHJcblx0XHQkU00uc2V0KCd2aWxsYWdlLmxpei5jYW5GaW5kQm9vaycsIDApO1xyXG5cdFx0JFNNLnNldCgndmlsbGFnZS5saXouaGFzQm9vaycsIDEpO1xyXG5cdFx0Um9vbS51cGRhdGVCdXR0b24oKTtcclxuXHR9LFxyXG5cclxuXHR0YWxrVG9MaXo6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnTGl6XFwncyBob3VzZSwgYXQgdGhlIGVkZ2Ugb2YgdG93bicpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0c2VlbkZsYWc6ICgpID0+ICRTTS5nZXQoJ3ZpbGxhZ2UubGl6LmhhdmVNZXQnKSxcclxuXHRcdFx0XHRcdG5leHRTY2VuZTogJ21haW4nLFxyXG5cdFx0XHRcdFx0b25Mb2FkOiAoKSA9PiAkU00uc2V0KCd2aWxsYWdlLmxpei5oYXZlTWV0JywgMSksXHJcblx0XHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRcdF8oJ1lvdSBlbnRlciB0aGUgYnVpbGRpbmcgYW5kIGFyZSBpbW1lZGlhdGVseSBwbHVuZ2VkIGludG8gYSBsYWJ5cmludGggb2Ygc2hlbHZlcyBoYXBoYXphcmRseSBmaWxsZWQgd2l0aCBib29rcyBvZiBhbGwga2luZHMuIEFmdGVyIGEgYml0IG9mIHNlYXJjaGluZywgeW91IGZpbmQgYSBzaWRlIHJvb20gd2hlcmUgYSB3b21hbiB3aXRoIG1vdXN5IGhhaXIgYW5kIGdsYXNzZXMgaXMgc2l0dGluZyBhdCBhIHdyaXRpbmcgZGVzay4gU2hlXFwncyByZWFkaW5nIGEgbGFyZ2UgYm9vayB0aGF0IGFwcGVhcnMgdG8gaW5jbHVkZSBkaWFncmFtcyBvZiBzb21lIHNvcnQgb2YgcGxhbnQuIFNoZSBsb29rcyB1cCBhcyB5b3UgZW50ZXIgdGhlIHJvb20uJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiV2hvIHRoZSBoZWxsIGFyZSB5b3U/XCInKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2Fza0Fib3V0VG93bic6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgYWJvdXQgQ2hhZHRvcGlhJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2NoYWR0b3BpYVJhbWJsZSd9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdxdWVzdCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgZm9yIGEgcXVlc3QnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAncXVlc3RSZXF1ZXN0J31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0xlYXZlJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnY2hhZHRvcGlhUmFtYmxlJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdMaXogbG9va3MgYXQgeW91IGZvciBhIG1vbWVudCBiZWZvcmUgcmV0dXJuaW5nIGhlciBnYXplIHRvIHRoZSBib29rIGluIGZyb250IG9mIGhlci4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJUaGVyZVxcJ3MgYSBib29rIGluIGhlcmUgc29tZXdoZXJlIGFib3V0IHRoZSBmb3VuZGluZyBvZiBDaGFkdG9waWEuIElmIHlvdSBjYW4gZmluZCBpdCwgeW91XFwncmUgZnJlZSB0byBib3Jyb3cgaXQuXCInKV0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdva2F5Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ09rYXksIHRoZW4uJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ21haW4nfSxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogKCkgPT4gJFNNLnNldCgndmlsbGFnZS5saXouY2FuRmluZEJvb2snLCB0cnVlKVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHJcblx0XHRcdFx0J21haW4nOiB7XHJcblx0XHRcdFx0XHR0ZXh0OiBbXygnTGl6IHNlZW1zIGRldGVybWluZWQgbm90IHRvIHBheSBhdHRlbnRpb24gdG8geW91LicpXSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J2Fza0Fib3V0VG93bic6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBc2sgYWJvdXQgQ2hhZHRvcGlhJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7MTogJ2NoYWR0b3BpYVJhbWJsZSd9LFxyXG5cdFx0XHRcdFx0XHRcdGF2YWlsYWJsZTogKCkgPT4gISRTTS5nZXQoJ3ZpbGxhZ2UubGl6LmNhbkZpbmRCb29rJylcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J3F1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBmb3IgYSBxdWVzdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdxdWVzdFJlcXVlc3QnfVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnZmluZEJvb2snOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnVHJ5IHRvIGZpbmQgdGhlIGJvb2snKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnZmluZEJvb2snfSxcclxuXHRcdFx0XHRcdFx0XHQvLyBUT0RPOiBhIFwidmlzaWJsZVwiIGZsYWcgd291bGQgYmUgZ29vZCBoZXJlLCBmb3Igc2l0dWF0aW9ucyB3aGVyZSBhbiBvcHRpb25cclxuXHRcdFx0XHRcdFx0XHQvLyAgIGlzbid0IHlldCBrbm93biB0byB0aGUgcGxheWVyXHJcblx0XHRcdFx0XHRcdFx0dmlzaWJsZTogKCkgPT4gJFNNLmdldCgndmlsbGFnZS5saXouY2FuRmluZEJvb2snKSxcclxuXHRcdFx0XHRcdFx0XHRhdmFpbGFibGU6ICgpID0+ICgkU00uZ2V0KCd2aWxsYWdlLmxpei5jYW5GaW5kQm9vaycpIGFzIG51bWJlciA+IDApICYmICgkU00uZ2V0KCd2aWxsYWdlLmxpei5oYXNCb29rJykpXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdsZWF2ZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdMZWF2ZScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J2ZpbmRCb29rJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdMZWF2aW5nIExpeiB0byBoZXIgYnVzaW5lc3MsIHlvdSB3YW5kZXIgYXJvdW5kIGFtaWRzdCB0aGUgYm9va3MsIHdvbmRlcmluZyBob3cgeW91XFwnbGwgZXZlciBtYW5hZ2UgdG8gZmluZCB3aGF0IHlvdVxcJ3JlIGxvb2tpbmcgZm9yIGluIGFsbCB0aGlzIHVub3JnYW5pemVkIG1lc3MuJyksXHJcblx0XHRcdFx0XHRcdF8oJ0ZvcnR1bmF0ZWx5LCB0aGUgY3JlYXRvciBvZiB0aGlzIGdhbWUgZG9lc25cXCd0IGZlZWwgbGlrZSBpdFxcJ2QgYmUgdmVyeSBpbnRlcmVzdGluZyB0byBtYWtlIHRoaXMgaW50byBhIHB1enpsZSwgc28geW91IHNwb3QgdGhlIGJvb2sgb24gYSBuZWFyYnkgc2hlbGYgYW5kIGdyYWIgaXQuJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdzaWNrJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ09oLCBzaWNrJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gJFNNLnNldCgnc3RvcmVzLldlaXJkIEJvb2snLCAxKTtcclxuXHRcdFx0XHRcdFx0XHRcdENoYXJhY3Rlci5hZGRUb0ludmVudG9yeShcIkxpei53ZWlyZEJvb2tcIik7XHJcblx0XHRcdFx0XHRcdFx0XHQkU00uc2V0KCd2aWxsYWdlLmxpei5oYXNCb29rJywgMCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQncXVlc3RSZXF1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdMaXogbGV0cyBvdXQgYW4gYW5ub3llZCBzaWdoLicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIk9oIGJyYXZlIGFkdmVudHVyZXIsIEkgc2VlbSB0byBoYXZlIGxvc3QgbXkgcGF0aWVuY2UuIFdoZW4gbGFzdCBJIHNhdyBpdCwgaXQgd2FzIHNvbWV3aGVyZSBvdXRzaWRlIG9mIHRoaXMgYnVpbGRpbmcuIFdvdWxkc3QgdGhvdSByZWNvdmVyIHRoYXQgd2hpY2ggaGFzIGJlZW4gc3RvbGVuIGZyb20gbWU/XCInKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J29rYXknOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnT2theSwgamVleiwgSSBnZXQgaXQnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnbWFpbid9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxufSIsImltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IExpeiB9IGZyb20gXCIuL2xpelwiO1xyXG5pbXBvcnQgeyBSb2FkIH0gZnJvbSBcIi4uL3BsYWNlcy9yb2FkXCI7XHJcblxyXG5leHBvcnQgY29uc3QgTWF5b3IgPSB7XHJcbiAgICB0YWxrVG9NYXlvcjogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdNZWV0IHRoZSBNYXlvcicpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0c2VlbkZsYWc6ICgpID0+ICRTTS5nZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZU1ldCcpLFxyXG5cdFx0XHRcdFx0bmV4dFNjZW5lOiAnbWFpbicsXHJcblx0XHRcdFx0XHRvbkxvYWQ6ICgpID0+ICRTTS5zZXQoJ3ZpbGxhZ2UubWF5b3IuaGF2ZU1ldCcsIDEpLFxyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdUaGUgbWF5b3Igc21pbGVzIGF0IHlvdSBhbmQgc2F5czonKSxcclxuXHRcdFx0XHRcdFx0XygnXCJXZWxjb21lIHRvIENoYWR0b3BpYSwgSVxcJ20gdGhlIG1heW9yIG9mIHRoZXNlIGhlcmUgcGFydHMuIFdoYXQgY2FuIEkgZG8geW91IGZvcj9cIicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnYXNrQWJvdXRUb3duJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBhYm91dCBDaGFkdG9waWEnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnY2hhZHRvcGlhUmFtYmxlJ31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J3F1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBmb3IgYSBxdWVzdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdxdWVzdCd9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdsZWF2ZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdMZWF2ZScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J2NoYWR0b3BpYVJhbWJsZSc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnVGhlIG1heW9yIHB1c2hlcyB0aGUgYnJpbSBvZiBoaXMgaGF0IHVwLicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIldlbGwsIHdlXFwndmUgYWx3YXlzIGJlZW4gaGVyZSwgbG9uZyBhcyBJIGNhbiByZW1lbWJlci4gSSB0b29rIG92ZXIgYWZ0ZXIgdGhlIGxhc3QgbWF5b3IgZGllZCwgYnV0IGhlIHdvdWxkIGhhdmUgYmVlbiB0aGUgb25seSBwZXJzb24gd2l0aCBhbnkgaGlzdG9yaWNhbCBrbm93bGVkZ2Ugb2YgdGhpcyB2aWxsYWdlLlwiJyksXHJcblx0XHRcdFx0XHRcdF8oJ0hlIHBhdXNlcyBmb3IgYSBtb21lbnQgYW5kIHRvdXNsZXMgc29tZSBvZiB0aGUgd2lzcHkgaGFpcnMgdGhhdCBoYXZlIHBva2VkIG91dCBmcm9tIHVuZGVyIHRoZSByYWlzZWQgaGF0LicpLFxyXG5cdFx0XHRcdFx0XHRfKCdcIkFjdHVhbGx5LCB5b3UgbWlnaHQgYXNrIExpeiwgc2hlIGhhcyBhIGJ1bmNoIG9mIGhlciBtb3RoZXJcXCdzIGJvb2tzIGZyb20gd2F5IGJhY2sgd2hlbi4gU2hlIGxpdmVzIGF0IHRoZSBlZGdlIG9mIHRvd24uXCInKVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdFx0J29rYXknOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnT2theSwgdGhlbi4nKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnbWFpbid9LFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBMaXouc2V0TGl6QWN0aXZlXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdtYWluJzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdUaGUgbWF5b3Igc2F5czonKSxcclxuXHRcdFx0XHRcdFx0XygnXCJBbnl3YXksIHdoYXQgRUxTRSBjYW4gSSBkbyB5b3UgZm9yP1wiJyksXHJcblx0XHRcdFx0XHRcdF8oJ0hlIGNodWNrbGVzIGF0IGhpcyBjbGV2ZXIgdXNlIG9mIGxhbmd1YWdlLicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnYXNrQWJvdXRUb3duJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBhYm91dCBDaGFkdG9waWEnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnY2hhZHRvcGlhUmFtYmxlJ31cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J3F1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ0FzayBmb3IgYSBxdWVzdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdxdWVzdCd9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdsZWF2ZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdMZWF2ZScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J3F1ZXN0Jzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdUaGUgbWF5b3IgdGhpbmtzIGZvciBhIG1vbWVudC4nKSxcclxuXHRcdFx0XHRcdFx0XygnXCJZb3Uga25vdywgaXRcXCdzIGJlZW4gYSB3aGlsZSBzaW5jZSBvdXIgbGFzdCBzaGlwbWVudCBvZiBzdXBwbGllcyBhcnJpdmVkIGZyb20gdGhlIG91dHBvc3QuIE1pbmQgbG9va2luZyBpbnRvIHRoYXQgZm9yIHVzP1wiJyksXHJcblx0XHRcdFx0XHRcdF8oJ1wiWW91IGNhbiBhc2sgYWJvdXQgaXQgYXQgdGhlIG91dHBvc3QsIG9yIGp1c3Qgd2FuZGVyIGFyb3VuZCBvbiB0aGUgcm9hZCBhbmQgc2VlIGlmIHlvdSBmaW5kIGFueSBjbHVlcy4gRWl0aGVyIHdheSwgaXRcXCdzIHRpbWUgdG8gaGl0IHRoZSByb2FkLCBhZHZlbnR1cmVyIVwiJylcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdhbHJpZ2h0eSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdBbHJpZ2h0eScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdtYWluJ30sXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IE1heW9yLnN0YXJ0U3VwcGxpZXNRdWVzdFxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdHN0YXJ0U3VwcGxpZXNRdWVzdDogZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKCEkU00uZ2V0KCdxdWVzdC5zdXBwbGllcycpKSB7XHJcblx0XHRcdC8vIDEgPSBzdGFydGVkLCAyID0gbmV4dCBzdGVwLCBldGMuIHVudGlsIGNvbXBsZXRlZFxyXG5cdFx0XHQkU00uc2V0KCdxdWVzdC5zdXBwbGllcycsIDEpO1xyXG5cdFx0XHRSb2FkLmluaXQoKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdH1cclxufSIsIi8vIEB0cy1ub2NoZWNrXHJcblxyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4vc3RhdGVfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBOb3RpZmljYXRpb25zIH0gZnJvbSBcIi4vbm90aWZpY2F0aW9uc1wiO1xyXG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgUm9vbSB9IGZyb20gXCIuL3BsYWNlcy9yb29tXCI7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuL3BsYXllci9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IHsgV2VhdGhlciB9IGZyb20gXCIuL3dlYXRoZXJcIjtcclxuaW1wb3J0IHsgUm9hZCB9IGZyb20gXCIuL3BsYWNlcy9yb2FkXCI7XHJcbmltcG9ydCB7IE91dHBvc3QgfSBmcm9tIFwiLi9wbGFjZXMvb3V0cG9zdFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEVuZ2luZSA9IHdpbmRvdy5FbmdpbmUgPSB7XHJcblx0XHJcblx0U0lURV9VUkw6IGVuY29kZVVSSUNvbXBvbmVudChcImh0dHA6Ly9hZGFya3Jvb20uZG91Ymxlc3BlYWtnYW1lcy5jb21cIiksXHJcblx0VkVSU0lPTjogMS4zLFxyXG5cdE1BWF9TVE9SRTogOTk5OTk5OTk5OTk5OTksXHJcblx0U0FWRV9ESVNQTEFZOiAzMCAqIDEwMDAsXHJcblx0R0FNRV9PVkVSOiBmYWxzZSxcclxuXHRcclxuXHQvL29iamVjdCBldmVudCB0eXBlc1xyXG5cdHRvcGljczoge30sXHJcblx0XHRcclxuXHRQZXJrczoge1xyXG5cdFx0J2JveGVyJzoge1xyXG5cdFx0XHRuYW1lOiBfKCdib3hlcicpLFxyXG5cdFx0XHRkZXNjOiBfKCdwdW5jaGVzIGRvIG1vcmUgZGFtYWdlJyksXHJcblx0XHRcdC8vLyBUUkFOU0xBVE9SUyA6IG1lYW5zIHdpdGggbW9yZSBmb3JjZS5cclxuXHRcdFx0bm90aWZ5OiBfKCdsZWFybmVkIHRvIHRocm93IHB1bmNoZXMgd2l0aCBwdXJwb3NlJylcclxuXHRcdH0sXHJcblx0XHQnbWFydGlhbCBhcnRpc3QnOiB7XHJcblx0XHRcdG5hbWU6IF8oJ21hcnRpYWwgYXJ0aXN0JyksXHJcblx0XHRcdGRlc2M6IF8oJ3B1bmNoZXMgZG8gZXZlbiBtb3JlIGRhbWFnZS4nKSxcclxuXHRcdFx0bm90aWZ5OiBfKCdsZWFybmVkIHRvIGZpZ2h0IHF1aXRlIGVmZmVjdGl2ZWx5IHdpdGhvdXQgd2VhcG9ucycpXHJcblx0XHR9LFxyXG5cdFx0J3VuYXJtZWQgbWFzdGVyJzoge1xyXG5cdFx0XHQvLy8gVFJBTlNMQVRPUlMgOiBtYXN0ZXIgb2YgdW5hcm1lZCBjb21iYXRcclxuXHRcdFx0bmFtZTogXygndW5hcm1lZCBtYXN0ZXInKSxcclxuXHRcdFx0ZGVzYzogXygncHVuY2ggdHdpY2UgYXMgZmFzdCwgYW5kIHdpdGggZXZlbiBtb3JlIGZvcmNlJyksXHJcblx0XHRcdG5vdGlmeTogXygnbGVhcm5lZCB0byBzdHJpa2UgZmFzdGVyIHdpdGhvdXQgd2VhcG9ucycpXHJcblx0XHR9LFxyXG5cdFx0J2JhcmJhcmlhbic6IHtcclxuXHRcdFx0bmFtZTogXygnYmFyYmFyaWFuJyksXHJcblx0XHRcdGRlc2M6IF8oJ21lbGVlIHdlYXBvbnMgZGVhbCBtb3JlIGRhbWFnZScpLFxyXG5cdFx0XHRub3RpZnk6IF8oJ2xlYXJuZWQgdG8gc3dpbmcgd2VhcG9ucyB3aXRoIGZvcmNlJylcclxuXHRcdH0sXHJcblx0XHQnc2xvdyBtZXRhYm9saXNtJzoge1xyXG5cdFx0XHRuYW1lOiBfKCdzbG93IG1ldGFib2xpc20nKSxcclxuXHRcdFx0ZGVzYzogXygnZ28gdHdpY2UgYXMgZmFyIHdpdGhvdXQgZWF0aW5nJyksXHJcblx0XHRcdG5vdGlmeTogXygnbGVhcm5lZCBob3cgdG8gaWdub3JlIHRoZSBodW5nZXInKVxyXG5cdFx0fSxcclxuXHRcdCdkZXNlcnQgcmF0Jzoge1xyXG5cdFx0XHRuYW1lOiBfKCdkZXNlcnQgcmF0JyksXHJcblx0XHRcdGRlc2M6IF8oJ2dvIHR3aWNlIGFzIGZhciB3aXRob3V0IGRyaW5raW5nJyksXHJcblx0XHRcdG5vdGlmeTogXygnbGVhcm5lZCB0byBsb3ZlIHRoZSBkcnkgYWlyJylcclxuXHRcdH0sXHJcblx0XHQnZXZhc2l2ZSc6IHtcclxuXHRcdFx0bmFtZTogXygnZXZhc2l2ZScpLFxyXG5cdFx0XHRkZXNjOiBfKCdkb2RnZSBhdHRhY2tzIG1vcmUgZWZmZWN0aXZlbHknKSxcclxuXHRcdFx0bm90aWZ5OiBfKFwibGVhcm5lZCB0byBiZSB3aGVyZSB0aGV5J3JlIG5vdFwiKVxyXG5cdFx0fSxcclxuXHRcdCdwcmVjaXNlJzoge1xyXG5cdFx0XHRuYW1lOiBfKCdwcmVjaXNlJyksXHJcblx0XHRcdGRlc2M6IF8oJ2xhbmQgYmxvd3MgbW9yZSBvZnRlbicpLFxyXG5cdFx0XHRub3RpZnk6IF8oJ2xlYXJuZWQgdG8gcHJlZGljdCB0aGVpciBtb3ZlbWVudCcpXHJcblx0XHR9LFxyXG5cdFx0J3Njb3V0Jzoge1xyXG5cdFx0XHRuYW1lOiBfKCdzY291dCcpLFxyXG5cdFx0XHRkZXNjOiBfKCdzZWUgZmFydGhlcicpLFxyXG5cdFx0XHRub3RpZnk6IF8oJ2xlYXJuZWQgdG8gbG9vayBhaGVhZCcpXHJcblx0XHR9LFxyXG5cdFx0J3N0ZWFsdGh5Jzoge1xyXG5cdFx0XHRuYW1lOiBfKCdzdGVhbHRoeScpLFxyXG5cdFx0XHRkZXNjOiBfKCdiZXR0ZXIgYXZvaWQgY29uZmxpY3QgaW4gdGhlIHdpbGQnKSxcclxuXHRcdFx0bm90aWZ5OiBfKCdsZWFybmVkIGhvdyBub3QgdG8gYmUgc2VlbicpXHJcblx0XHR9LFxyXG5cdFx0J2dhc3Ryb25vbWUnOiB7XHJcblx0XHRcdG5hbWU6IF8oJ2dhc3Ryb25vbWUnKSxcclxuXHRcdFx0ZGVzYzogXygncmVzdG9yZSBtb3JlIGhlYWx0aCB3aGVuIGVhdGluZycpLFxyXG5cdFx0XHRub3RpZnk6IF8oJ2xlYXJuZWQgdG8gbWFrZSB0aGUgbW9zdCBvZiBmb29kJylcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHtcclxuXHRcdHN0YXRlOiBudWxsLFxyXG5cdFx0ZGVidWc6IHRydWUsXHJcblx0XHRsb2c6IHRydWUsXHJcblx0XHRkcm9wYm94OiBmYWxzZSxcclxuXHRcdGRvdWJsZVRpbWU6IGZhbHNlXHJcblx0fSxcclxuXHJcblx0X2RlYnVnOiBmYWxzZSxcclxuXHRcdFxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdFx0dGhpcy5fZGVidWcgPSB0aGlzLm9wdGlvbnMuZGVidWc7XHJcblx0XHR0aGlzLl9sb2cgPSB0aGlzLm9wdGlvbnMubG9nO1xyXG5cdFx0XHJcblx0XHQvLyBDaGVjayBmb3IgSFRNTDUgc3VwcG9ydFxyXG5cdFx0aWYoIUVuZ2luZS5icm93c2VyVmFsaWQoKSkge1xyXG5cdFx0XHR3aW5kb3cubG9jYXRpb24gPSAnYnJvd3Nlcldhcm5pbmcuaHRtbCc7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIENoZWNrIGZvciBtb2JpbGVcclxuXHRcdGlmKEVuZ2luZS5pc01vYmlsZSgpKSB7XHJcblx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9ICdtb2JpbGVXYXJuaW5nLmh0bWwnO1xyXG5cdFx0fVxyXG5cclxuXHRcdEVuZ2luZS5kaXNhYmxlU2VsZWN0aW9uKCk7XHJcblx0XHRcclxuXHRcdGlmKHRoaXMub3B0aW9ucy5zdGF0ZSAhPSBudWxsKSB7XHJcblx0XHRcdHdpbmRvdy5TdGF0ZSA9IHRoaXMub3B0aW9ucy5zdGF0ZTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEVuZ2luZS5sb2FkR2FtZSgpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2xvY2F0aW9uU2xpZGVyJykuYXBwZW5kVG8oJyNtYWluJyk7XHJcblxyXG5cdFx0dmFyIG1lbnUgPSAkKCc8ZGl2PicpXHJcblx0XHRcdC5hZGRDbGFzcygnbWVudScpXHJcblx0XHRcdC5hcHBlbmRUbygnYm9keScpO1xyXG5cclxuXHRcdGlmKHR5cGVvZiBsYW5ncyAhPSAndW5kZWZpbmVkJyl7XHJcblx0XHRcdHZhciBjdXN0b21TZWxlY3QgPSAkKCc8c3Bhbj4nKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnY3VzdG9tU2VsZWN0JylcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHRcdFx0dmFyIHNlbGVjdE9wdGlvbnMgPSAkKCc8c3Bhbj4nKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnY3VzdG9tU2VsZWN0T3B0aW9ucycpXHJcblx0XHRcdFx0LmFwcGVuZFRvKGN1c3RvbVNlbGVjdCk7XHJcblx0XHRcdHZhciBvcHRpb25zTGlzdCA9ICQoJzx1bD4nKVxyXG5cdFx0XHRcdC5hcHBlbmRUbyhzZWxlY3RPcHRpb25zKTtcclxuXHRcdFx0JCgnPGxpPicpXHJcblx0XHRcdFx0LnRleHQoXCJsYW5ndWFnZS5cIilcclxuXHRcdFx0XHQuYXBwZW5kVG8ob3B0aW9uc0xpc3QpO1xyXG5cdFx0XHRcclxuXHRcdFx0JC5lYWNoKGxhbmdzLCBmdW5jdGlvbihuYW1lLGRpc3BsYXkpe1xyXG5cdFx0XHRcdCQoJzxsaT4nKVxyXG5cdFx0XHRcdFx0LnRleHQoZGlzcGxheSlcclxuXHRcdFx0XHRcdC5hdHRyKCdkYXRhLWxhbmd1YWdlJywgbmFtZSlcclxuXHRcdFx0XHRcdC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkgeyBFbmdpbmUuc3dpdGNoTGFuZ3VhZ2UodGhpcyk7IH0pXHJcblx0XHRcdFx0XHQuYXBwZW5kVG8ob3B0aW9uc0xpc3QpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2xpZ2h0c09mZiBtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygnbGlnaHRzIG9mZi4nKSlcclxuXHRcdFx0LmNsaWNrKEVuZ2luZS50dXJuTGlnaHRzT2ZmKVxyXG5cdFx0XHQuYXBwZW5kVG8obWVudSk7XHJcblxyXG5cdFx0JCgnPHNwYW4+JylcclxuXHRcdFx0LmFkZENsYXNzKCdtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygnaHlwZXIuJykpXHJcblx0XHRcdC5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0XHRcdEVuZ2luZS5vcHRpb25zLmRvdWJsZVRpbWUgPSAhRW5naW5lLm9wdGlvbnMuZG91YmxlVGltZTtcclxuXHRcdFx0XHRpZihFbmdpbmUub3B0aW9ucy5kb3VibGVUaW1lKVxyXG5cdFx0XHRcdFx0JCh0aGlzKS50ZXh0KF8oJ2NsYXNzaWMuJykpO1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdCQodGhpcykudGV4dChfKCdoeXBlci4nKSk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHQudGV4dChfKCdyZXN0YXJ0LicpKVxyXG5cdFx0XHQuY2xpY2soRW5naW5lLmNvbmZpcm1EZWxldGUpXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHRcdFxyXG5cdFx0JCgnPHNwYW4+JylcclxuXHRcdFx0LmFkZENsYXNzKCdtZW51QnRuJylcclxuXHRcdFx0LnRleHQoXygnc2hhcmUuJykpXHJcblx0XHRcdC5jbGljayhFbmdpbmUuc2hhcmUpXHJcblx0XHRcdC5hcHBlbmRUbyhtZW51KTtcclxuXHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHQudGV4dChfKCdzYXZlLicpKVxyXG5cdFx0XHQuY2xpY2soRW5naW5lLmV4cG9ydEltcG9ydClcclxuXHRcdFx0LmFwcGVuZFRvKG1lbnUpO1xyXG5cdFx0XHJcblx0XHQkKCc8c3Bhbj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21lbnVCdG4nKVxyXG5cdFx0XHQudGV4dChfKCdhcHAgc3RvcmUuJykpXHJcblx0XHRcdC5jbGljayhmdW5jdGlvbigpIHsgd2luZG93Lm9wZW4oJ2h0dHBzOi8vaXR1bmVzLmFwcGxlLmNvbS91cy9hcHAvYS1kYXJrLXJvb20vaWQ3MzY2ODMwNjEnKTsgfSlcclxuXHRcdFx0LmFwcGVuZFRvKG1lbnUpO1xyXG5cclxuXHRcdCQoJzxzcGFuPicpXHJcblx0XHRcdC5hZGRDbGFzcygnbWVudUJ0bicpXHJcblx0XHRcdC50ZXh0KF8oJ2dpdGh1Yi4nKSlcclxuXHRcdFx0LmNsaWNrKGZ1bmN0aW9uKCkgeyB3aW5kb3cub3BlbignaHR0cHM6Ly9naXRodWIuY29tL0NvbnRpbnVpdGllcy9hZGFya3Jvb20nKTsgfSlcclxuXHRcdFx0LmFwcGVuZFRvKG1lbnUpO1xyXG5cdFxyXG5cdFx0Ly8gc3Vic2NyaWJlIHRvIHN0YXRlVXBkYXRlc1xyXG5cdFx0JC5EaXNwYXRjaCgnc3RhdGVVcGRhdGUnKS5zdWJzY3JpYmUoRW5naW5lLmhhbmRsZVN0YXRlVXBkYXRlcyk7XHJcblxyXG5cdFx0JFNNLmluaXQoKTtcclxuXHRcdE5vdGlmaWNhdGlvbnMuaW5pdCgpO1xyXG5cdFx0RXZlbnRzLmluaXQoKTtcclxuXHRcdFJvb20uaW5pdCgpO1xyXG5cdFx0Q2hhcmFjdGVyLmluaXQoKTtcclxuXHRcdFdlYXRoZXIuaW5pdCgpO1xyXG5cdFx0aWYoJFNNLmdldCgncm9hZC5vcGVuJykpIHtcclxuXHRcdFx0Um9hZC5pbml0KCk7XHJcblx0XHR9XHJcblx0XHRpZigkU00uZ2V0KCdvdXRwb3N0Lm9wZW4nKSkge1xyXG5cdFx0XHRPdXRwb3N0LmluaXQoKTtcclxuXHRcdH1cclxuXHJcblx0XHRFbmdpbmUuc2F2ZUxhbmd1YWdlKCk7XHJcblx0XHRFbmdpbmUudHJhdmVsVG8oUm9vbSk7XHJcblxyXG5cdH0sXHJcblx0XHJcblx0YnJvd3NlclZhbGlkOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAoIGxvY2F0aW9uLnNlYXJjaC5pbmRleE9mKCAnaWdub3JlYnJvd3Nlcj10cnVlJyApID49IDAgfHwgKCB0eXBlb2YgU3RvcmFnZSAhPSAndW5kZWZpbmVkJyAmJiAhb2xkSUUgKSApO1xyXG5cdH0sXHJcblx0XHJcblx0aXNNb2JpbGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuICggbG9jYXRpb24uc2VhcmNoLmluZGV4T2YoICdpZ25vcmVicm93c2VyPXRydWUnICkgPCAwICYmIC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeS9pLnRlc3QoIG5hdmlnYXRvci51c2VyQWdlbnQgKSApO1xyXG5cdH0sXHJcblx0XHJcblx0c2F2ZUdhbWU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYodHlwZW9mIFN0b3JhZ2UgIT0gJ3VuZGVmaW5lZCcgJiYgbG9jYWxTdG9yYWdlKSB7XHJcblx0XHRcdGlmKEVuZ2luZS5fc2F2ZVRpbWVyICE9IG51bGwpIHtcclxuXHRcdFx0XHRjbGVhclRpbWVvdXQoRW5naW5lLl9zYXZlVGltZXIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHR5cGVvZiBFbmdpbmUuX2xhc3ROb3RpZnkgPT0gJ3VuZGVmaW5lZCcgfHwgRGF0ZS5ub3coKSAtIEVuZ2luZS5fbGFzdE5vdGlmeSA+IEVuZ2luZS5TQVZFX0RJU1BMQVkpe1xyXG5cdFx0XHRcdCQoJyNzYXZlTm90aWZ5JykuY3NzKCdvcGFjaXR5JywgMSkuYW5pbWF0ZSh7b3BhY2l0eTogMH0sIDEwMDAsICdsaW5lYXInKTtcclxuXHRcdFx0XHRFbmdpbmUuX2xhc3ROb3RpZnkgPSBEYXRlLm5vdygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxvY2FsU3RvcmFnZS5nYW1lU3RhdGUgPSBKU09OLnN0cmluZ2lmeShTdGF0ZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRsb2FkR2FtZTogZnVuY3Rpb24oKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR2YXIgc2F2ZWRTdGF0ZSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdhbWVTdGF0ZSk7XHJcblx0XHRcdGlmKHNhdmVkU3RhdGUpIHtcclxuXHRcdFx0XHR3aW5kb3cuU3RhdGUgPSBzYXZlZFN0YXRlO1xyXG5cdFx0XHRcdEVuZ2luZS5sb2coXCJsb2FkZWQgc2F2ZSFcIik7XHJcblx0XHRcdH1cclxuXHRcdH0gY2F0Y2goZSkge1xyXG5cdFx0XHRFbmdpbmUubG9nKGUpO1xyXG5cdFx0XHR3aW5kb3cuU3RhdGUgPSB7fTtcclxuXHRcdFx0JFNNLnNldCgndmVyc2lvbicsIEVuZ2luZS5WRVJTSU9OKTtcclxuXHRcdFx0RW5naW5lLmV2ZW50KCdwcm9ncmVzcycsICduZXcgZ2FtZScpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0ZXhwb3J0SW1wb3J0OiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5zdGFydEV2ZW50KHtcclxuXHRcdFx0dGl0bGU6IF8oJ0V4cG9ydCAvIEltcG9ydCcpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHRfKCdleHBvcnQgb3IgaW1wb3J0IHNhdmUgZGF0YSwgZm9yIGJhY2tpbmcgdXAnKSxcclxuXHRcdFx0XHRcdFx0Xygnb3IgbWlncmF0aW5nIGNvbXB1dGVycycpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnZXhwb3J0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2V4cG9ydCcpLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBFbmdpbmUuZXhwb3J0NjRcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2ltcG9ydCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdpbXBvcnQnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsxOiAnY29uZmlybSd9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdjYW5jZWwnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnY2FuY2VsJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnY29uZmlybSc6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdFx0XygnYXJlIHlvdSBzdXJlPycpLFxyXG5cdFx0XHRcdFx0XHRfKCdpZiB0aGUgY29kZSBpcyBpbnZhbGlkLCBhbGwgZGF0YSB3aWxsIGJlIGxvc3QuJyksXHJcblx0XHRcdFx0XHRcdF8oJ3RoaXMgaXMgaXJyZXZlcnNpYmxlLicpXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQneWVzJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ3llcycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdpbnB1dEltcG9ydCd9LFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBFbmdpbmUuZW5hYmxlU2VsZWN0aW9uXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdubyc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdubycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J2lucHV0SW1wb3J0Jzoge1xyXG5cdFx0XHRcdFx0dGV4dDogW18oJ3B1dCB0aGUgc2F2ZSBjb2RlIGhlcmUuJyldLFxyXG5cdFx0XHRcdFx0dGV4dGFyZWE6ICcnLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnb2theSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdpbXBvcnQnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBFbmdpbmUuaW1wb3J0NjRcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2NhbmNlbCc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdjYW5jZWwnKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGdlbmVyYXRlRXhwb3J0NjQ6IGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgc3RyaW5nNjQgPSBCYXNlNjQuZW5jb2RlKGxvY2FsU3RvcmFnZS5nYW1lU3RhdGUpO1xyXG5cdFx0c3RyaW5nNjQgPSBzdHJpbmc2NC5yZXBsYWNlKC9cXHMvZywgJycpO1xyXG5cdFx0c3RyaW5nNjQgPSBzdHJpbmc2NC5yZXBsYWNlKC9cXC4vZywgJycpO1xyXG5cdFx0c3RyaW5nNjQgPSBzdHJpbmc2NC5yZXBsYWNlKC9cXG4vZywgJycpO1xyXG5cclxuXHRcdHJldHVybiBzdHJpbmc2NDtcclxuXHR9LFxyXG5cclxuXHRleHBvcnQ2NDogZnVuY3Rpb24oKSB7XHJcblx0XHRFbmdpbmUuc2F2ZUdhbWUoKTtcclxuXHRcdHZhciBzdHJpbmc2NCA9IEVuZ2luZS5nZW5lcmF0ZUV4cG9ydDY0KCk7XHJcblx0XHRFbmdpbmUuZW5hYmxlU2VsZWN0aW9uKCk7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdFeHBvcnQnKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtfKCdzYXZlIHRoaXMuJyldLFxyXG5cdFx0XHRcdFx0dGV4dGFyZWE6IHN0cmluZzY0LFxyXG5cdFx0XHRcdFx0cmVhZG9ubHk6IHRydWUsXHJcblx0XHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHRcdCdkb25lJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ2dvdCBpdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IEVuZ2luZS5kaXNhYmxlU2VsZWN0aW9uXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0RW5naW5lLmF1dG9TZWxlY3QoJyNkZXNjcmlwdGlvbiB0ZXh0YXJlYScpO1xyXG5cdH0sXHJcblxyXG5cdGltcG9ydDY0OiBmdW5jdGlvbihzdHJpbmc2NCkge1xyXG5cdFx0RW5naW5lLmRpc2FibGVTZWxlY3Rpb24oKTtcclxuXHRcdHN0cmluZzY0ID0gc3RyaW5nNjQucmVwbGFjZSgvXFxzL2csICcnKTtcclxuXHRcdHN0cmluZzY0ID0gc3RyaW5nNjQucmVwbGFjZSgvXFwuL2csICcnKTtcclxuXHRcdHN0cmluZzY0ID0gc3RyaW5nNjQucmVwbGFjZSgvXFxuL2csICcnKTtcclxuXHRcdHZhciBkZWNvZGVkU2F2ZSA9IEJhc2U2NC5kZWNvZGUoc3RyaW5nNjQpO1xyXG5cdFx0bG9jYWxTdG9yYWdlLmdhbWVTdGF0ZSA9IGRlY29kZWRTYXZlO1xyXG5cdFx0bG9jYXRpb24ucmVsb2FkKCk7XHJcblx0fSxcclxuXHJcblx0ZXZlbnQ6IGZ1bmN0aW9uKGNhdCwgYWN0KSB7XHJcblx0XHRpZih0eXBlb2YgZ2EgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCBjYXQsIGFjdCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Y29uZmlybURlbGV0ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRFdmVudHMuc3RhcnRFdmVudCh7XHJcblx0XHRcdHRpdGxlOiBfKCdSZXN0YXJ0PycpLFxyXG5cdFx0XHRzY2VuZXM6IHtcclxuXHRcdFx0XHRzdGFydDoge1xyXG5cdFx0XHRcdFx0dGV4dDogW18oJ3Jlc3RhcnQgdGhlIGdhbWU/JyldLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQneWVzJzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ3llcycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IEVuZ2luZS5kZWxldGVTYXZlXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdubyc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdubycpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0ZGVsZXRlU2F2ZTogZnVuY3Rpb24obm9SZWxvYWQpIHtcclxuXHRcdGlmKHR5cGVvZiBTdG9yYWdlICE9ICd1bmRlZmluZWQnICYmIGxvY2FsU3RvcmFnZSkge1xyXG5cdFx0XHR3aW5kb3cuU3RhdGUgPSB7fTtcclxuXHRcdFx0bG9jYWxTdG9yYWdlLmNsZWFyKCk7XHJcblx0XHR9XHJcblx0XHRpZighbm9SZWxvYWQpIHtcclxuXHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0c2hhcmU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG5cdFx0XHR0aXRsZTogXygnU2hhcmUnKSxcclxuXHRcdFx0c2NlbmVzOiB7XHJcblx0XHRcdFx0c3RhcnQ6IHtcclxuXHRcdFx0XHRcdHRleHQ6IFtfKCdicmluZyB5b3VyIGZyaWVuZHMuJyldLFxyXG5cdFx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0XHQnZmFjZWJvb2snOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygnZmFjZWJvb2snKSxcclxuXHRcdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnLFxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5vcGVuKCdodHRwczovL3d3dy5mYWNlYm9vay5jb20vc2hhcmVyL3NoYXJlci5waHA/dT0nICsgRW5naW5lLlNJVEVfVVJMLCAnc2hhcmVyJywgJ3dpZHRoPTYyNixoZWlnaHQ9NDM2LGxvY2F0aW9uPW5vLG1lbnViYXI9bm8scmVzaXphYmxlPW5vLHNjcm9sbGJhcnM9bm8sc3RhdHVzPW5vLHRvb2xiYXI9bm8nKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdnb29nbGUnOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDpfKCdnb29nbGUrJyksXHJcblx0XHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJyxcclxuXHRcdFx0XHRcdFx0XHRvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR3aW5kb3cub3BlbignaHR0cHM6Ly9wbHVzLmdvb2dsZS5jb20vc2hhcmU/dXJsPScgKyBFbmdpbmUuU0lURV9VUkwsICdzaGFyZXInLCAnd2lkdGg9NDgwLGhlaWdodD00MzYsbG9jYXRpb249bm8sbWVudWJhcj1ubyxyZXNpemFibGU9bm8sc2Nyb2xsYmFycz1ubyxzdGF0dXM9bm8sdG9vbGJhcj1ubycpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J3R3aXR0ZXInOiB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dDogXygndHdpdHRlcicpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0d2luZG93Lm9wZW4oJ2h0dHBzOi8vdHdpdHRlci5jb20vaW50ZW50L3R3ZWV0P3RleHQ9QSUyMERhcmslMjBSb29tJnVybD0nICsgRW5naW5lLlNJVEVfVVJMLCAnc2hhcmVyJywgJ3dpZHRoPTY2MCxoZWlnaHQ9MjYwLGxvY2F0aW9uPW5vLG1lbnViYXI9bm8scmVzaXphYmxlPW5vLHNjcm9sbGJhcnM9eWVzLHN0YXR1cz1ubyx0b29sYmFyPW5vJyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQncmVkZGl0Jzoge1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF8oJ3JlZGRpdCcpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCcsXHJcblx0XHRcdFx0XHRcdFx0b25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0d2luZG93Lm9wZW4oJ2h0dHA6Ly93d3cucmVkZGl0LmNvbS9zdWJtaXQ/dXJsPScgKyBFbmdpbmUuU0lURV9VUkwsICdzaGFyZXInLCAnd2lkdGg9OTYwLGhlaWdodD03MDAsbG9jYXRpb249bm8sbWVudWJhcj1ubyxyZXNpemFibGU9bm8sc2Nyb2xsYmFycz15ZXMsc3RhdHVzPW5vLHRvb2xiYXI9bm8nKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCdjbG9zZSc6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBfKCdjbG9zZScpLFxyXG5cdFx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0d2lkdGg6ICc0MDBweCdcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGZpbmRTdHlsZXNoZWV0OiBmdW5jdGlvbih0aXRsZSkge1xyXG5cdFx0Zm9yKHZhciBpPTA7IGk8ZG9jdW1lbnQuc3R5bGVTaGVldHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIHNoZWV0ID0gZG9jdW1lbnQuc3R5bGVTaGVldHNbaV07XHJcblx0XHRcdGlmKHNoZWV0LnRpdGxlID09IHRpdGxlKSB7XHJcblx0XHRcdFx0cmV0dXJuIHNoZWV0O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9LFxyXG5cclxuXHRpc0xpZ2h0c09mZjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgZGFya0NzcyA9IEVuZ2luZS5maW5kU3R5bGVzaGVldCgnZGFya2VuTGlnaHRzJyk7XHJcblx0XHRpZiAoIGRhcmtDc3MgIT0gbnVsbCAmJiAhZGFya0Nzcy5kaXNhYmxlZCApIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHJcblx0dHVybkxpZ2h0c09mZjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgZGFya0NzcyA9IEVuZ2luZS5maW5kU3R5bGVzaGVldCgnZGFya2VuTGlnaHRzJyk7XHJcblx0XHRpZiAoZGFya0NzcyA9PSBudWxsKSB7XHJcblx0XHRcdCQoJ2hlYWQnKS5hcHBlbmQoJzxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiY3NzL2RhcmsuY3NzXCIgdHlwZT1cInRleHQvY3NzXCIgdGl0bGU9XCJkYXJrZW5MaWdodHNcIiAvPicpO1xyXG5cdFx0XHQkKCcubGlnaHRzT2ZmJykudGV4dChfKCdsaWdodHMgb24uJykpO1xyXG5cdFx0fSBlbHNlIGlmIChkYXJrQ3NzLmRpc2FibGVkKSB7XHJcblx0XHRcdGRhcmtDc3MuZGlzYWJsZWQgPSBmYWxzZTtcclxuXHRcdFx0JCgnLmxpZ2h0c09mZicpLnRleHQoXygnbGlnaHRzIG9uLicpKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQoXCIjZGFya2VuTGlnaHRzXCIpLmF0dHIoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpO1xyXG5cdFx0XHRkYXJrQ3NzLmRpc2FibGVkID0gdHJ1ZTtcclxuXHRcdFx0JCgnLmxpZ2h0c09mZicpLnRleHQoXygnbGlnaHRzIG9mZi4nKSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Ly8gR2V0cyBhIGd1aWRcclxuXHRnZXRHdWlkOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uKGMpIHtcclxuXHRcdFx0dmFyIHIgPSBNYXRoLnJhbmRvbSgpKjE2fDAsIHYgPSBjID09ICd4JyA/IHIgOiAociYweDN8MHg4KTtcclxuXHRcdFx0cmV0dXJuIHYudG9TdHJpbmcoMTYpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0YWN0aXZlTW9kdWxlOiBudWxsLFxyXG5cclxuXHR0cmF2ZWxUbzogZnVuY3Rpb24obW9kdWxlKSB7XHJcblx0XHRpZihFbmdpbmUuYWN0aXZlTW9kdWxlICE9IG1vZHVsZSkge1xyXG5cdFx0XHR2YXIgY3VycmVudEluZGV4ID0gRW5naW5lLmFjdGl2ZU1vZHVsZSA/ICQoJy5sb2NhdGlvbicpLmluZGV4KEVuZ2luZS5hY3RpdmVNb2R1bGUucGFuZWwpIDogMTtcclxuXHRcdFx0JCgnZGl2LmhlYWRlckJ1dHRvbicpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xyXG5cdFx0XHRtb2R1bGUudGFiLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xyXG5cclxuXHRcdFx0dmFyIHNsaWRlciA9ICQoJyNsb2NhdGlvblNsaWRlcicpO1xyXG5cdFx0XHR2YXIgc3RvcmVzID0gJCgnI3N0b3Jlc0NvbnRhaW5lcicpO1xyXG5cdFx0XHR2YXIgcGFuZWxJbmRleCA9ICQoJy5sb2NhdGlvbicpLmluZGV4KG1vZHVsZS5wYW5lbCk7XHJcblx0XHRcdHZhciBkaWZmID0gTWF0aC5hYnMocGFuZWxJbmRleCAtIGN1cnJlbnRJbmRleCk7XHJcblx0XHRcdHNsaWRlci5hbmltYXRlKHtsZWZ0OiAtKHBhbmVsSW5kZXggKiA3MDApICsgJ3B4J30sIDMwMCAqIGRpZmYpO1xyXG5cclxuXHRcdFx0aWYoJFNNLmdldCgnc3RvcmVzLndvb2QnKSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdC8vIEZJWE1FIFdoeSBkb2VzIHRoaXMgd29yayBpZiB0aGVyZSdzIGFuIGFuaW1hdGlvbiBxdWV1ZS4uLj9cclxuXHRcdFx0XHRzdG9yZXMuYW5pbWF0ZSh7cmlnaHQ6IC0ocGFuZWxJbmRleCAqIDcwMCkgKyAncHgnfSwgMzAwICogZGlmZik7XHJcblx0XHRcdH1cclxuXHRcdFxyXG5cdFx0XHRFbmdpbmUuYWN0aXZlTW9kdWxlID0gbW9kdWxlO1xyXG5cclxuXHRcdFx0bW9kdWxlLm9uQXJyaXZhbChkaWZmKTtcclxuXHJcblx0XHRcdGlmKEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gUm9vbVxyXG5cdFx0XHRcdC8vICB8fCBFbmdpbmUuYWN0aXZlTW9kdWxlID09IFBhdGhcclxuXHRcdFx0XHQpIHtcclxuXHRcdFx0XHQvLyBEb24ndCBmYWRlIG91dCB0aGUgd2VhcG9ucyBpZiB3ZSdyZSBzd2l0Y2hpbmcgdG8gYSBtb2R1bGVcclxuXHRcdFx0XHQvLyB3aGVyZSB3ZSdyZSBnb2luZyB0byBrZWVwIHNob3dpbmcgdGhlbSBhbnl3YXkuXHJcblx0XHRcdFx0aWYgKG1vZHVsZSAhPSBSb29tIFxyXG5cdFx0XHRcdFx0Ly8gJiYgbW9kdWxlICE9IFBhdGhcclxuXHRcdFx0XHQpIHtcclxuXHRcdFx0XHRcdCQoJ2RpdiN3ZWFwb25zJykuYW5pbWF0ZSh7b3BhY2l0eTogMH0sIDMwMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZihtb2R1bGUgPT0gUm9vbVxyXG5cdFx0XHRcdC8vICB8fCBtb2R1bGUgPT0gUGF0aFxyXG5cdFx0XHRcdCkge1xyXG5cdFx0XHRcdCQoJ2RpdiN3ZWFwb25zJykuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIDMwMCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdE5vdGlmaWNhdGlvbnMucHJpbnRRdWV1ZShtb2R1bGUpO1xyXG5cdFx0XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0LyogTW92ZSB0aGUgc3RvcmVzIHBhbmVsIGJlbmVhdGggdG9wX2NvbnRhaW5lciAob3IgdG8gdG9wOiAwcHggaWYgdG9wX2NvbnRhaW5lclxyXG5cdFx0KiBlaXRoZXIgaGFzbid0IGJlZW4gZmlsbGVkIGluIG9yIGlzIG51bGwpIHVzaW5nIHRyYW5zaXRpb25fZGlmZiB0byBzeW5jIHdpdGhcclxuXHRcdCogdGhlIGFuaW1hdGlvbiBpbiBFbmdpbmUudHJhdmVsVG8oKS5cclxuXHRcdCovXHJcblx0bW92ZVN0b3Jlc1ZpZXc6IGZ1bmN0aW9uKHRvcF9jb250YWluZXIsIHRyYW5zaXRpb25fZGlmZikge1xyXG5cdFx0dmFyIHN0b3JlcyA9ICQoJyNzdG9yZXNDb250YWluZXInKTtcclxuXHJcblx0XHQvLyBJZiB3ZSBkb24ndCBoYXZlIGEgc3RvcmVzQ29udGFpbmVyIHlldCwgbGVhdmUuXHJcblx0XHRpZih0eXBlb2Yoc3RvcmVzKSA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybjtcclxuXHJcblx0XHRpZih0eXBlb2YodHJhbnNpdGlvbl9kaWZmKSA9PT0gJ3VuZGVmaW5lZCcpIHRyYW5zaXRpb25fZGlmZiA9IDE7XHJcblxyXG5cdFx0aWYodG9wX2NvbnRhaW5lciA9PT0gbnVsbCkge1xyXG5cdFx0XHRzdG9yZXMuYW5pbWF0ZSh7dG9wOiAnMHB4J30sIHtxdWV1ZTogZmFsc2UsIGR1cmF0aW9uOiAzMDAgKiB0cmFuc2l0aW9uX2RpZmZ9KTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYoIXRvcF9jb250YWluZXIubGVuZ3RoKSB7XHJcblx0XHRcdHN0b3Jlcy5hbmltYXRlKHt0b3A6ICcwcHgnfSwge3F1ZXVlOiBmYWxzZSwgZHVyYXRpb246IDMwMCAqIHRyYW5zaXRpb25fZGlmZn0pO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHN0b3Jlcy5hbmltYXRlKHtcclxuXHRcdFx0XHRcdHRvcDogdG9wX2NvbnRhaW5lci5oZWlnaHQoKSArIDI2ICsgJ3B4J1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0cXVldWU6IGZhbHNlLCBcclxuXHRcdFx0XHRcdGR1cmF0aW9uOiAzMDAgKiB0cmFuc2l0aW9uX2RpZmZcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0bG9nOiBmdW5jdGlvbihtc2cpIHtcclxuXHRcdGlmKHRoaXMuX2xvZykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhtc2cpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHVwZGF0ZVNsaWRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgc2xpZGVyID0gJCgnI2xvY2F0aW9uU2xpZGVyJyk7XHJcblx0XHRzbGlkZXIud2lkdGgoKHNsaWRlci5jaGlsZHJlbigpLmxlbmd0aCAqIDcwMCkgKyAncHgnKTtcclxuXHR9LFxyXG5cclxuXHR1cGRhdGVPdXRlclNsaWRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgc2xpZGVyID0gJCgnI291dGVyU2xpZGVyJyk7XHJcblx0XHRzbGlkZXIud2lkdGgoKHNsaWRlci5jaGlsZHJlbigpLmxlbmd0aCAqIDcwMCkgKyAncHgnKTtcclxuXHR9LFxyXG5cclxuXHRnZXRJbmNvbWVNc2c6IGZ1bmN0aW9uKG51bSwgZGVsYXkpIHtcclxuXHRcdHJldHVybiBfKFwiezB9IHBlciB7MX1zXCIsIChudW0gPiAwID8gXCIrXCIgOiBcIlwiKSArIG51bSwgZGVsYXkpO1xyXG5cdH0sXHJcblxyXG5cdHN3aXBlTGVmdDogZnVuY3Rpb24oZSkge1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZS5zd2lwZUxlZnQpIHtcclxuXHRcdFx0RW5naW5lLmFjdGl2ZU1vZHVsZS5zd2lwZUxlZnQoZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0c3dpcGVSaWdodDogZnVuY3Rpb24oZSkge1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZS5zd2lwZVJpZ2h0KSB7XHJcblx0XHRcdEVuZ2luZS5hY3RpdmVNb2R1bGUuc3dpcGVSaWdodChlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRzd2lwZVVwOiBmdW5jdGlvbihlKSB7XHJcblx0XHRpZihFbmdpbmUuYWN0aXZlTW9kdWxlLnN3aXBlVXApIHtcclxuXHRcdFx0RW5naW5lLmFjdGl2ZU1vZHVsZS5zd2lwZVVwKGUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHN3aXBlRG93bjogZnVuY3Rpb24oZSkge1xyXG5cdFx0aWYoRW5naW5lLmFjdGl2ZU1vZHVsZS5zd2lwZURvd24pIHtcclxuXHRcdFx0RW5naW5lLmFjdGl2ZU1vZHVsZS5zd2lwZURvd24oZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0ZGlzYWJsZVNlbGVjdGlvbjogZnVuY3Rpb24oKSB7XHJcblx0XHRkb2N1bWVudC5vbnNlbGVjdHN0YXJ0ID0gZXZlbnROdWxsaWZpZXI7IC8vIHRoaXMgaXMgZm9yIElFXHJcblx0XHRkb2N1bWVudC5vbm1vdXNlZG93biA9IGV2ZW50TnVsbGlmaWVyOyAvLyB0aGlzIGlzIGZvciB0aGUgcmVzdFxyXG5cdH0sXHJcblxyXG5cdGVuYWJsZVNlbGVjdGlvbjogZnVuY3Rpb24oKSB7XHJcblx0XHRkb2N1bWVudC5vbnNlbGVjdHN0YXJ0ID0gZXZlbnRQYXNzdGhyb3VnaDtcclxuXHRcdGRvY3VtZW50Lm9ubW91c2Vkb3duID0gZXZlbnRQYXNzdGhyb3VnaDtcclxuXHR9LFxyXG5cclxuXHRhdXRvU2VsZWN0OiBmdW5jdGlvbihzZWxlY3Rvcikge1xyXG5cdFx0JChzZWxlY3RvcikuZm9jdXMoKS5zZWxlY3QoKTtcclxuXHR9LFxyXG5cclxuXHRoYW5kbGVTdGF0ZVVwZGF0ZXM6IGZ1bmN0aW9uKGUpe1xyXG5cdFxyXG5cdH0sXHJcblxyXG5cdHN3aXRjaExhbmd1YWdlOiBmdW5jdGlvbihkb20pe1xyXG5cdFx0dmFyIGxhbmcgPSAkKGRvbSkuZGF0YShcImxhbmd1YWdlXCIpO1xyXG5cdFx0aWYoZG9jdW1lbnQubG9jYXRpb24uaHJlZi5zZWFyY2goL1tcXD9cXCZdbGFuZz1bYS16X10rLykgIT0gLTEpe1xyXG5cdFx0XHRkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gZG9jdW1lbnQubG9jYXRpb24uaHJlZi5yZXBsYWNlKCAvKFtcXD9cXCZdbGFuZz0pKFthLXpfXSspL2dpICwgXCIkMVwiK2xhbmcgKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gZG9jdW1lbnQubG9jYXRpb24uaHJlZiArICggKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYuc2VhcmNoKC9cXD8vKSAhPSAtMSApP1wiJlwiOlwiP1wiKSArIFwibGFuZz1cIitsYW5nO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHNhdmVMYW5ndWFnZTogZnVuY3Rpb24oKXtcclxuXHRcdHZhciBsYW5nID0gZGVjb2RlVVJJQ29tcG9uZW50KChuZXcgUmVnRXhwKCdbP3wmXWxhbmc9JyArICcoW14mO10rPykoJnwjfDt8JCknKS5leGVjKGxvY2F0aW9uLnNlYXJjaCl8fFssXCJcIl0pWzFdLnJlcGxhY2UoL1xcKy9nLCAnJTIwJykpfHxudWxsO1x0XHJcblx0XHRpZihsYW5nICYmIHR5cGVvZiBTdG9yYWdlICE9ICd1bmRlZmluZWQnICYmIGxvY2FsU3RvcmFnZSkge1xyXG5cdFx0XHRsb2NhbFN0b3JhZ2UubGFuZyA9IGxhbmc7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0c2V0VGltZW91dDogZnVuY3Rpb24oY2FsbGJhY2ssIHRpbWVvdXQsIHNraXBEb3VibGU/KXtcclxuXHJcblx0XHRpZiggRW5naW5lLm9wdGlvbnMuZG91YmxlVGltZSAmJiAhc2tpcERvdWJsZSApe1xyXG5cdFx0XHRFbmdpbmUubG9nKCdEb3VibGUgdGltZSwgY3V0dGluZyB0aW1lb3V0IGluIGhhbGYnKTtcclxuXHRcdFx0dGltZW91dCAvPSAyO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBzZXRUaW1lb3V0KGNhbGxiYWNrLCB0aW1lb3V0KTtcclxuXHJcblx0fVxyXG5cclxufTtcclxuXHJcbmZ1bmN0aW9uIGV2ZW50TnVsbGlmaWVyKGUpIHtcclxuXHRyZXR1cm4gJChlLnRhcmdldCkuaGFzQ2xhc3MoJ21lbnVCdG4nKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZXZlbnRQYXNzdGhyb3VnaChlKSB7XHJcblx0cmV0dXJuIHRydWU7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBpblZpZXcoZGlyLCBlbGVtKXtcclxuXHJcbiAgICAgICAgdmFyIHNjVG9wID0gJCgnI21haW4nKS5vZmZzZXQoKS50b3A7XHJcbiAgICAgICAgdmFyIHNjQm90ID0gc2NUb3AgKyAkKCcjbWFpbicpLmhlaWdodCgpO1xyXG5cclxuICAgICAgICB2YXIgZWxUb3AgPSBlbGVtLm9mZnNldCgpLnRvcDtcclxuICAgICAgICB2YXIgZWxCb3QgPSBlbFRvcCArIGVsZW0uaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIGlmKCBkaXIgPT0gJ3VwJyApe1xyXG4gICAgICAgICAgICAgICAgLy8gU1RPUCBNT1ZJTkcgSUYgQk9UVE9NIE9GIEVMRU1FTlQgSVMgVklTSUJMRSBJTiBTQ1JFRU5cclxuICAgICAgICAgICAgICAgIHJldHVybiAoIGVsQm90IDwgc2NCb3QgKTtcclxuICAgICAgICB9ZWxzZSBpZiggZGlyID09ICdkb3duJyApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICggZWxUb3AgPiBzY1RvcCApO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICggKCBlbEJvdCA8PSBzY0JvdCApICYmICggZWxUb3AgPj0gc2NUb3AgKSApO1xyXG4gICAgICAgIH1cclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNjcm9sbEJ5WChlbGVtLCB4KXtcclxuXHJcbiAgICAgICAgdmFyIGVsVG9wID0gcGFyc2VJbnQoIGVsZW0uY3NzKCd0b3AnKSwgMTAgKTtcclxuICAgICAgICBlbGVtLmNzcyggJ3RvcCcsICggZWxUb3AgKyB4ICkgKyBcInB4XCIgKTtcclxuXHJcbn1cclxuXHJcblxyXG4vL2NyZWF0ZSBqUXVlcnkgQ2FsbGJhY2tzKCkgdG8gaGFuZGxlIG9iamVjdCBldmVudHMgXHJcbiQuRGlzcGF0Y2ggPSBmdW5jdGlvbiggaWQgKSB7XHJcblx0dmFyIGNhbGxiYWNrcywgdG9waWMgPSBpZCAmJiBFbmdpbmUudG9waWNzWyBpZCBdO1xyXG5cdGlmICggIXRvcGljICkge1xyXG5cdFx0Y2FsbGJhY2tzID0galF1ZXJ5LkNhbGxiYWNrcygpO1xyXG5cdFx0dG9waWMgPSB7XHJcblx0XHRcdFx0cHVibGlzaDogY2FsbGJhY2tzLmZpcmUsXHJcblx0XHRcdFx0c3Vic2NyaWJlOiBjYWxsYmFja3MuYWRkLFxyXG5cdFx0XHRcdHVuc3Vic2NyaWJlOiBjYWxsYmFja3MucmVtb3ZlXHJcblx0XHR9O1xyXG5cdFx0aWYgKCBpZCApIHtcclxuXHRcdFx0RW5naW5lLnRvcGljc1sgaWQgXSA9IHRvcGljO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gdG9waWM7XHJcbn07XHJcblxyXG4kKGZ1bmN0aW9uKCkge1xyXG5cdEVuZ2luZS5pbml0KCk7XHJcbn0pO1xyXG5cclxuIiwiLyoqXHJcbiAqIE1vZHVsZSB0aGF0IGhhbmRsZXMgdGhlIHJhbmRvbSBldmVudCBzeXN0ZW1cclxuICovXHJcbmltcG9ydCB7IEV2ZW50c1JvYWRXYW5kZXIgfSBmcm9tIFwiLi9ldmVudHMvcm9hZHdhbmRlclwiO1xyXG5pbXBvcnQgeyBFdmVudHNSb29tIH0gZnJvbSBcIi4vZXZlbnRzL3Jvb21cIjtcclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4vZW5naW5lXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyAkU00gfSBmcm9tIFwiLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tIFwiLi9ub3RpZmljYXRpb25zXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuL0J1dHRvblwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBRFJFdmVudCB7XHJcblx0dGl0bGU6IHN0cmluZyxcclxuXHRpc0F2YWlsYWJsZT86IEZ1bmN0aW9uLFxyXG5cdGlzU3VwZXJMaWtlbHk/OiBGdW5jdGlvbixcclxuXHRzY2VuZXM6IHtcclxuXHRcdC8vIHR5cGUgdGhpcyBvdXQgYmV0dGVyIHVzaW5nIEluZGV4IFNpZ25hdHVyZXNcclxuXHR9LFxyXG5cdGV2ZW50UGFuZWw/OiBhbnlcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTY2VuZSB7XHJcblx0c2VlbkZsYWc6IEZ1bmN0aW9uLFxyXG5cdG5leHRTY2VuZTogc3RyaW5nLFxyXG5cdG9uTG9hZDogRnVuY3Rpb24sXHJcblx0dGV4dDogQXJyYXk8c3RyaW5nPixcclxuXHRidXR0b25zOiB7XHJcblx0XHRbaWQ6IHN0cmluZ106IEV2ZW50QnV0dG9uXHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50QnV0dG9uIHtcclxuXHR0ZXh0OiBzdHJpbmcsXHJcblx0bmV4dFNjZW5lOiB7XHJcblx0XHRbaWQ6IG51bWJlcl06IHN0cmluZ1xyXG5cdH0sXHJcblx0b25DaG9vc2U6IEZ1bmN0aW9uXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBFdmVudHMgPSB7XHJcblx0XHRcclxuXHRfRVZFTlRfVElNRV9SQU5HRTogWzMsIDZdLCAvLyByYW5nZSwgaW4gbWludXRlc1xyXG5cdF9QQU5FTF9GQURFOiAyMDAsXHJcblx0X0ZJR0hUX1NQRUVEOiAxMDAsXHJcblx0X0VBVF9DT09MRE9XTjogNSxcclxuXHRfTUVEU19DT09MRE9XTjogNyxcclxuXHRfTEVBVkVfQ09PTERPV046IDEsXHJcblx0U1RVTl9EVVJBVElPTjogNDAwMCxcclxuXHRCTElOS19JTlRFUlZBTDogZmFsc2UsXHJcblxyXG5cdEV2ZW50UG9vbDogPGFueT5bXSxcclxuXHRldmVudFN0YWNrOiA8YW55PltdLFxyXG5cdF9ldmVudFRpbWVvdXQ6IDAsXHJcblxyXG5cdExvY2F0aW9uczoge30sXHJcblxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdFx0XHJcblx0XHQvLyBCdWlsZCB0aGUgRXZlbnQgUG9vbFxyXG5cdFx0RXZlbnRzLkV2ZW50UG9vbCA9IFtdLmNvbmNhdChcclxuXHRcdFx0RXZlbnRzUm9vbSBhcyBhbnksXHJcblx0XHRcdEV2ZW50c1JvYWRXYW5kZXIgYXMgYW55XHJcblx0XHQpO1xyXG5cclxuXHRcdHRoaXMuTG9jYXRpb25zW1wiUm9vbVwiXSA9IEV2ZW50c1Jvb207XHJcblx0XHR0aGlzLkxvY2F0aW9uc1tcIlJvYWRXYW5kZXJcIl0gPSBFdmVudHNSb2FkV2FuZGVyO1xyXG5cdFx0XHJcblx0XHRFdmVudHMuZXZlbnRTdGFjayA9IFtdO1xyXG5cdFx0XHJcblx0XHQvL3N1YnNjcmliZSB0byBzdGF0ZVVwZGF0ZXNcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdCQuRGlzcGF0Y2goJ3N0YXRlVXBkYXRlJykuc3Vic2NyaWJlKEV2ZW50cy5oYW5kbGVTdGF0ZVVwZGF0ZXMpO1xyXG5cdH0sXHJcblx0XHJcblx0b3B0aW9uczoge30sIC8vIE5vdGhpbmcgZm9yIG5vd1xyXG4gICAgXHJcblx0YWN0aXZlU2NlbmU6ICcnLFxyXG4gICAgXHJcblx0bG9hZFNjZW5lOiBmdW5jdGlvbihuYW1lKSB7XHJcblx0XHRFbmdpbmUubG9nKCdsb2FkaW5nIHNjZW5lOiAnICsgbmFtZSk7XHJcblx0XHRFdmVudHMuYWN0aXZlU2NlbmUgPSBuYW1lO1xyXG5cdFx0dmFyIHNjZW5lID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LnNjZW5lc1tuYW1lXTtcclxuXHRcdFxyXG5cdFx0Ly8gaGFuZGxlcyBvbmUtdGltZSBzY2VuZXMsIHN1Y2ggYXMgaW50cm9kdWN0aW9uc1xyXG5cdFx0Ly8gbWF5YmUgSSBjYW4gbWFrZSBhIG1vcmUgZXhwbGljaXQgXCJpbnRyb2R1Y3Rpb25cIiBsb2dpY2FsIGZsb3cgdG8gbWFrZSB0aGlzXHJcblx0XHQvLyBhIGxpdHRsZSBtb3JlIGVsZWdhbnQsIGdpdmVuIHRoYXQgdGhlcmUgd2lsbCBhbHdheXMgYmUgYW4gXCJpbnRyb2R1Y3Rpb25cIiBzY2VuZVxyXG5cdFx0Ly8gdGhhdCdzIG9ubHkgbWVhbnQgdG8gYmUgcnVuIGEgc2luZ2xlIHRpbWUuXHJcblx0XHRpZiAoc2NlbmUuc2VlbkZsYWcgJiYgc2NlbmUuc2VlbkZsYWcoKSkge1xyXG5cdFx0XHRFdmVudHMubG9hZFNjZW5lKHNjZW5lLm5leHRTY2VuZSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNjZW5lIHJld2FyZFxyXG5cdFx0aWYoc2NlbmUucmV3YXJkKSB7XHJcblx0XHRcdCRTTS5hZGRNKCdzdG9yZXMnLCBzY2VuZS5yZXdhcmQpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBvbkxvYWRcclxuXHRcdGlmKHNjZW5lLm9uTG9hZCkge1xyXG5cdFx0XHRzY2VuZS5vbkxvYWQoKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gTm90aWZ5IHRoZSBzY2VuZSBjaGFuZ2VcclxuXHRcdGlmKHNjZW5lLm5vdGlmaWNhdGlvbikge1xyXG5cdFx0XHROb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBzY2VuZS5ub3RpZmljYXRpb24pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQkKCcjZGVzY3JpcHRpb24nLCBFdmVudHMuZXZlbnRQYW5lbCgpKS5lbXB0eSgpO1xyXG5cdFx0JCgnI2J1dHRvbnMnLCBFdmVudHMuZXZlbnRQYW5lbCgpKS5lbXB0eSgpO1xyXG5cdFx0RXZlbnRzLnN0YXJ0U3Rvcnkoc2NlbmUpO1xyXG5cdH0sXHJcblx0XHJcblx0ZHJhd0Zsb2F0VGV4dDogZnVuY3Rpb24odGV4dCwgcGFyZW50KSB7XHJcblx0XHQkKCc8ZGl2PicpLnRleHQodGV4dCkuYWRkQ2xhc3MoJ2RhbWFnZVRleHQnKS5hcHBlbmRUbyhwYXJlbnQpLmFuaW1hdGUoe1xyXG5cdFx0XHQnYm90dG9tJzogJzUwcHgnLFxyXG5cdFx0XHQnb3BhY2l0eSc6ICcwJ1xyXG5cdFx0fSxcclxuXHRcdDMwMCxcclxuXHRcdCdsaW5lYXInLFxyXG5cdFx0ZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlKCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdFxyXG5cdHN0YXJ0U3Rvcnk6IGZ1bmN0aW9uKHNjZW5lKSB7XHJcblx0XHQvLyBXcml0ZSB0aGUgdGV4dFxyXG5cdFx0dmFyIGRlc2MgPSAkKCcjZGVzY3JpcHRpb24nLCBFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdGZvcih2YXIgaSBpbiBzY2VuZS50ZXh0KSB7XHJcblx0XHRcdCQoJzxkaXY+JykudGV4dChzY2VuZS50ZXh0W2ldKS5hcHBlbmRUbyhkZXNjKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYoc2NlbmUudGV4dGFyZWEgIT0gbnVsbCkge1xyXG5cdFx0XHR2YXIgdGEgPSAkKCc8dGV4dGFyZWE+JykudmFsKHNjZW5lLnRleHRhcmVhKS5hcHBlbmRUbyhkZXNjKTtcclxuXHRcdFx0aWYoc2NlbmUucmVhZG9ubHkpIHtcclxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0dGEuYXR0cigncmVhZG9ubHknLCB0cnVlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBEcmF3IHRoZSBidXR0b25zXHJcblx0XHRFdmVudHMuZHJhd0J1dHRvbnMoc2NlbmUpO1xyXG5cdH0sXHJcblx0XHJcblx0ZHJhd0J1dHRvbnM6IGZ1bmN0aW9uKHNjZW5lKSB7XHJcblx0XHR2YXIgYnRucyA9ICQoJyNidXR0b25zJywgRXZlbnRzLmV2ZW50UGFuZWwoKSk7XHJcblx0XHRmb3IodmFyIGlkIGluIHNjZW5lLmJ1dHRvbnMpIHtcclxuXHRcdFx0dmFyIGluZm8gPSBzY2VuZS5idXR0b25zW2lkXTtcclxuXHRcdFx0XHR2YXIgYiA9IFxyXG5cdFx0XHRcdC8vbmV3IFxyXG5cdFx0XHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRcdFx0aWQ6IGlkLFxyXG5cdFx0XHRcdFx0dGV4dDogaW5mby50ZXh0LFxyXG5cdFx0XHRcdFx0Y29zdDogaW5mby5jb3N0LFxyXG5cdFx0XHRcdFx0Y2xpY2s6IEV2ZW50cy5idXR0b25DbGljayxcclxuXHRcdFx0XHRcdGNvb2xkb3duOiBpbmZvLmNvb2xkb3duXHJcblx0XHRcdFx0fSkuYXBwZW5kVG8oYnRucyk7XHJcblx0XHRcdGlmKHR5cGVvZiBpbmZvLmF2YWlsYWJsZSA9PSAnZnVuY3Rpb24nICYmICFpbmZvLmF2YWlsYWJsZSgpKSB7XHJcblx0XHRcdFx0QnV0dG9uLnNldERpc2FibGVkKGIsIHRydWUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHR5cGVvZiBpbmZvLnZpc2libGUgPT0gJ2Z1bmN0aW9uJyAmJiAhaW5mby52aXNpYmxlKCkpIHtcclxuXHRcdFx0XHRiLmhpZGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih0eXBlb2YgaW5mby5jb29sZG93biA9PSAnbnVtYmVyJykge1xyXG5cdFx0XHRcdEJ1dHRvbi5jb29sZG93bihiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRFdmVudHMudXBkYXRlQnV0dG9ucygpO1xyXG5cdH0sXHJcblx0XHJcblx0dXBkYXRlQnV0dG9uczogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgYnRucyA9IEV2ZW50cy5hY3RpdmVFdmVudCgpPy5zY2VuZXNbRXZlbnRzLmFjdGl2ZVNjZW5lXS5idXR0b25zO1xyXG5cdFx0Zm9yKHZhciBiSWQgaW4gYnRucykge1xyXG5cdFx0XHR2YXIgYiA9IGJ0bnNbYklkXTtcclxuXHRcdFx0dmFyIGJ0bkVsID0gJCgnIycrYklkLCBFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdFx0aWYodHlwZW9mIGIuYXZhaWxhYmxlID09ICdmdW5jdGlvbicgJiYgIWIuYXZhaWxhYmxlKCkpIHtcclxuXHRcdFx0XHRCdXR0b24uc2V0RGlzYWJsZWQoYnRuRWwsIHRydWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRidXR0b25DbGljazogZnVuY3Rpb24oYnRuKSB7XHJcblx0XHR2YXIgaW5mbyA9IEV2ZW50cy5hY3RpdmVFdmVudCgpPy5zY2VuZXNbRXZlbnRzLmFjdGl2ZVNjZW5lXS5idXR0b25zW2J0bi5hdHRyKCdpZCcpXTtcclxuXHJcblx0XHRpZih0eXBlb2YgaW5mby5vbkNob29zZSA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdHZhciB0ZXh0YXJlYSA9IEV2ZW50cy5ldmVudFBhbmVsKCkuZmluZCgndGV4dGFyZWEnKTtcclxuXHRcdFx0aW5mby5vbkNob29zZSh0ZXh0YXJlYS5sZW5ndGggPiAwID8gdGV4dGFyZWEudmFsKCkgOiBudWxsKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gUmV3YXJkXHJcblx0XHRpZihpbmZvLnJld2FyZCkge1xyXG5cdFx0XHQkU00uYWRkTSgnc3RvcmVzJywgaW5mby5yZXdhcmQpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRFdmVudHMudXBkYXRlQnV0dG9ucygpO1xyXG5cdFx0XHJcblx0XHQvLyBOb3RpZmljYXRpb25cclxuXHRcdGlmKGluZm8ubm90aWZpY2F0aW9uKSB7XHJcblx0XHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIGluZm8ubm90aWZpY2F0aW9uKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gTmV4dCBTY2VuZVxyXG5cdFx0aWYoaW5mby5uZXh0U2NlbmUpIHtcclxuXHRcdFx0aWYoaW5mby5uZXh0U2NlbmUgPT0gJ2VuZCcpIHtcclxuXHRcdFx0XHRFdmVudHMuZW5kRXZlbnQoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR2YXIgciA9IE1hdGgucmFuZG9tKCk7XHJcblx0XHRcdFx0dmFyIGxvd2VzdE1hdGNoOiBudWxsIHwgc3RyaW5nID0gbnVsbDtcclxuXHRcdFx0XHRmb3IodmFyIGkgaW4gaW5mby5uZXh0U2NlbmUpIHtcclxuXHRcdFx0XHRcdGlmKHIgPCAoaSBhcyB1bmtub3duIGFzIG51bWJlcikgJiYgKGxvd2VzdE1hdGNoID09IG51bGwgfHwgaSA8IGxvd2VzdE1hdGNoKSkge1xyXG5cdFx0XHRcdFx0XHRsb3dlc3RNYXRjaCA9IGk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGxvd2VzdE1hdGNoICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdEV2ZW50cy5sb2FkU2NlbmUoaW5mby5uZXh0U2NlbmVbbG93ZXN0TWF0Y2hdKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0RW5naW5lLmxvZygnRVJST1I6IG5vIHN1aXRhYmxlIHNjZW5lIGZvdW5kJyk7XHJcblx0XHRcdFx0RXZlbnRzLmVuZEV2ZW50KCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHQvLyBibGlua3MgdGhlIGJyb3dzZXIgd2luZG93IHRpdGxlXHJcblx0YmxpbmtUaXRsZTogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdGl0bGUgPSBkb2N1bWVudC50aXRsZTtcclxuXHJcblx0XHQvLyBldmVyeSAzIHNlY29uZHMgY2hhbmdlIHRpdGxlIHRvICcqKiogRVZFTlQgKioqJywgdGhlbiAxLjUgc2Vjb25kcyBsYXRlciwgY2hhbmdlIGl0IGJhY2sgdG8gdGhlIG9yaWdpbmFsIHRpdGxlLlxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0RXZlbnRzLkJMSU5LX0lOVEVSVkFMID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdGRvY3VtZW50LnRpdGxlID0gXygnKioqIEVWRU5UICoqKicpO1xyXG5cdFx0XHRFbmdpbmUuc2V0VGltZW91dChmdW5jdGlvbigpIHtkb2N1bWVudC50aXRsZSA9IHRpdGxlO30sIDE1MDAsIHRydWUpOyBcclxuXHRcdH0sIDMwMDApO1xyXG5cdH0sXHJcblxyXG5cdHN0b3BUaXRsZUJsaW5rOiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdGNsZWFySW50ZXJ2YWwoRXZlbnRzLkJMSU5LX0lOVEVSVkFMKTtcclxuXHRcdEV2ZW50cy5CTElOS19JTlRFUlZBTCA9IGZhbHNlO1xyXG5cdH0sXHJcblx0XHJcblx0Ly8gTWFrZXMgYW4gZXZlbnQgaGFwcGVuIVxyXG5cdHRyaWdnZXJFdmVudDogZnVuY3Rpb24oKSB7XHJcblx0XHRpZihFdmVudHMuYWN0aXZlRXZlbnQoKSA9PSBudWxsKSB7XHJcblx0XHRcdHZhciBwb3NzaWJsZUV2ZW50cyA9IFtdO1xyXG5cdFx0XHRmb3IodmFyIGkgaW4gRXZlbnRzLkV2ZW50UG9vbCkge1xyXG5cdFx0XHRcdHZhciBldmVudCA9IEV2ZW50cy5FdmVudFBvb2xbaV07XHJcblx0XHRcdFx0aWYoZXZlbnQuaXNBdmFpbGFibGUoKSkge1xyXG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRcdFx0cG9zc2libGVFdmVudHMucHVzaChldmVudCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZihwb3NzaWJsZUV2ZW50cy5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHRFdmVudHMuc2NoZWR1bGVOZXh0RXZlbnQoMC41KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFyIHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqKHBvc3NpYmxlRXZlbnRzLmxlbmd0aCkpO1xyXG5cdFx0XHRcdEV2ZW50cy5zdGFydEV2ZW50KHBvc3NpYmxlRXZlbnRzW3JdKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdEV2ZW50cy5zY2hlZHVsZU5leHRFdmVudCgpO1xyXG5cdH0sXHJcblxyXG5cdC8vIG5vdCBzY2hlZHVsZWQsIHRoaXMgaXMgZm9yIHN0dWZmIGxpa2UgbG9jYXRpb24tYmFzZWQgcmFuZG9tIGV2ZW50cyBvbiBhIGJ1dHRvbiBjbGlja1xyXG5cdHRyaWdnZXJMb2NhdGlvbkV2ZW50OiBmdW5jdGlvbihsb2NhdGlvbikge1xyXG5cdFx0aWYgKHRoaXMuTG9jYXRpb25zW2xvY2F0aW9uXSkge1xyXG5cdFx0XHRpZihFdmVudHMuYWN0aXZlRXZlbnQoKSA9PSBudWxsKSB7XHJcblx0XHRcdFx0dmFyIHBvc3NpYmxlRXZlbnRzOiBBcnJheTxhbnk+ID0gW107XHJcblx0XHRcdFx0Zm9yKHZhciBpIGluIHRoaXMuTG9jYXRpb25zW2xvY2F0aW9uXSkge1xyXG5cdFx0XHRcdFx0dmFyIGV2ZW50ID0gdGhpcy5Mb2NhdGlvbnNbbG9jYXRpb25dW2ldO1xyXG5cdFx0XHRcdFx0aWYoZXZlbnQuaXNBdmFpbGFibGUoKSkge1xyXG5cdFx0XHRcdFx0XHRpZih0eXBlb2YoZXZlbnQuaXNTdXBlckxpa2VseSkgPT0gJ2Z1bmN0aW9uJyAmJiBldmVudC5pc1N1cGVyTGlrZWx5KCkpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBTdXBlckxpa2VseSBldmVudCwgZG8gdGhpcyBhbmQgc2tpcCB0aGUgcmFuZG9tIGNob2ljZVxyXG5cdFx0XHRcdFx0XHRcdEVuZ2luZS5sb2coJ3N1cGVyTGlrZWx5IGRldGVjdGVkJyk7XHJcblx0XHRcdFx0XHRcdFx0RXZlbnRzLnN0YXJ0RXZlbnQoZXZlbnQpO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRwb3NzaWJsZUV2ZW50cy5wdXNoKGV2ZW50KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHJcblx0XHRcdFx0aWYocG9zc2libGVFdmVudHMubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdFx0XHQvLyBFdmVudHMuc2NoZWR1bGVOZXh0RXZlbnQoMC41KTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dmFyIHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqKHBvc3NpYmxlRXZlbnRzLmxlbmd0aCkpO1xyXG5cdFx0XHRcdFx0RXZlbnRzLnN0YXJ0RXZlbnQocG9zc2libGVFdmVudHNbcl0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0YWN0aXZlRXZlbnQ6IGZ1bmN0aW9uKCk6IEFEUkV2ZW50IHwgbnVsbCB7XHJcblx0XHRpZihFdmVudHMuZXZlbnRTdGFjayAmJiBFdmVudHMuZXZlbnRTdGFjay5sZW5ndGggPiAwKSB7XHJcblx0XHRcdHJldHVybiBFdmVudHMuZXZlbnRTdGFja1swXTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH0sXHJcblx0XHJcblx0ZXZlbnRQYW5lbDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gRXZlbnRzLmFjdGl2ZUV2ZW50KCk/LmV2ZW50UGFuZWw7XHJcblx0fSxcclxuXHJcblx0c3RhcnRFdmVudDogZnVuY3Rpb24oZXZlbnQ6IEFEUkV2ZW50LCBvcHRpb25zPykge1xyXG5cdFx0aWYoZXZlbnQpIHtcclxuXHRcdFx0RW5naW5lLmV2ZW50KCdnYW1lIGV2ZW50JywgJ2V2ZW50Jyk7XHJcblx0XHRcdEV2ZW50cy5ldmVudFN0YWNrLnVuc2hpZnQoZXZlbnQpO1xyXG5cdFx0XHRldmVudC5ldmVudFBhbmVsID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdldmVudCcpLmFkZENsYXNzKCdldmVudFBhbmVsJykuY3NzKCdvcGFjaXR5JywgJzAnKTtcclxuXHRcdFx0aWYob3B0aW9ucyAhPSBudWxsICYmIG9wdGlvbnMud2lkdGggIT0gbnVsbCkge1xyXG5cdFx0XHRcdEV2ZW50cy5ldmVudFBhbmVsKCkuY3NzKCd3aWR0aCcsIG9wdGlvbnMud2lkdGgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoJzxkaXY+JykuYWRkQ2xhc3MoJ2V2ZW50VGl0bGUnKS50ZXh0KEV2ZW50cy5hY3RpdmVFdmVudCgpPy50aXRsZSBhcyBzdHJpbmcpLmFwcGVuZFRvKEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0XHQkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2Rlc2NyaXB0aW9uJykuYXBwZW5kVG8oRXZlbnRzLmV2ZW50UGFuZWwoKSk7XHJcblx0XHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnYnV0dG9ucycpLmFwcGVuZFRvKEV2ZW50cy5ldmVudFBhbmVsKCkpO1xyXG5cdFx0XHRFdmVudHMubG9hZFNjZW5lKCdzdGFydCcpO1xyXG5cdFx0XHQkKCdkaXYjd3JhcHBlcicpLmFwcGVuZChFdmVudHMuZXZlbnRQYW5lbCgpKTtcclxuXHRcdFx0RXZlbnRzLmV2ZW50UGFuZWwoKS5hbmltYXRlKHtvcGFjaXR5OiAxfSwgRXZlbnRzLl9QQU5FTF9GQURFLCAnbGluZWFyJyk7XHJcblx0XHRcdHZhciBjdXJyZW50U2NlbmVJbmZvcm1hdGlvbiA9IEV2ZW50cy5hY3RpdmVFdmVudCgpPy5zY2VuZXNbRXZlbnRzLmFjdGl2ZVNjZW5lXTtcclxuXHRcdFx0aWYgKGN1cnJlbnRTY2VuZUluZm9ybWF0aW9uLmJsaW5rKSB7XHJcblx0XHRcdFx0RXZlbnRzLmJsaW5rVGl0bGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHNjaGVkdWxlTmV4dEV2ZW50OiBmdW5jdGlvbihzY2FsZT8pIHtcclxuXHRcdHZhciBuZXh0RXZlbnQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqKEV2ZW50cy5fRVZFTlRfVElNRV9SQU5HRVsxXSAtIEV2ZW50cy5fRVZFTlRfVElNRV9SQU5HRVswXSkpICsgRXZlbnRzLl9FVkVOVF9USU1FX1JBTkdFWzBdO1xyXG5cdFx0aWYoc2NhbGUgPiAwKSB7IG5leHRFdmVudCAqPSBzY2FsZTsgfVxyXG5cdFx0RW5naW5lLmxvZygnbmV4dCBldmVudCBzY2hlZHVsZWQgaW4gJyArIG5leHRFdmVudCArICcgbWludXRlcycpO1xyXG5cdFx0RXZlbnRzLl9ldmVudFRpbWVvdXQgPSBFbmdpbmUuc2V0VGltZW91dChFdmVudHMudHJpZ2dlckV2ZW50LCBuZXh0RXZlbnQgKiA2MCAqIDEwMDApO1xyXG5cdH0sXHJcblxyXG5cdGVuZEV2ZW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEV2ZW50cy5ldmVudFBhbmVsKCkuYW5pbWF0ZSh7b3BhY2l0eTowfSwgRXZlbnRzLl9QQU5FTF9GQURFLCAnbGluZWFyJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdEV2ZW50cy5ldmVudFBhbmVsKCkucmVtb3ZlKCk7XHJcblx0XHRcdGNvbnN0IGFjdGl2ZUV2ZW50ID0gRXZlbnRzLmFjdGl2ZUV2ZW50KCk7XHJcblx0XHRcdGlmIChhY3RpdmVFdmVudCAhPT0gbnVsbCkgYWN0aXZlRXZlbnQuZXZlbnRQYW5lbCA9IG51bGw7XHJcblx0XHRcdEV2ZW50cy5ldmVudFN0YWNrLnNoaWZ0KCk7XHJcblx0XHRcdEVuZ2luZS5sb2coRXZlbnRzLmV2ZW50U3RhY2subGVuZ3RoICsgJyBldmVudHMgcmVtYWluaW5nJyk7XHJcblx0XHRcdGlmIChFdmVudHMuQkxJTktfSU5URVJWQUwpIHtcclxuXHRcdFx0XHRFdmVudHMuc3RvcFRpdGxlQmxpbmsoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBGb3JjZSByZWZvY3VzIG9uIHRoZSBib2R5LiBJIGhhdGUgeW91LCBJRS5cclxuXHRcdFx0JCgnYm9keScpLmZvY3VzKCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRoYW5kbGVTdGF0ZVVwZGF0ZXM6IGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYoKGUuY2F0ZWdvcnkgPT0gJ3N0b3JlcycgfHwgZS5jYXRlZ29yeSA9PSAnaW5jb21lJykgJiYgRXZlbnRzLmFjdGl2ZUV2ZW50KCkgIT0gbnVsbCl7XHJcblx0XHRcdEV2ZW50cy51cGRhdGVCdXR0b25zKCk7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG4iLCIvKipcclxuICogRXZlbnRzIHRoYXQgY2FuIG9jY3VyIHdoZW4gdGhlIFJvYWQgbW9kdWxlIGlzIGFjdGl2ZVxyXG4gKiovXHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuLi9lbmdpbmVcIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuLi9wbGF5ZXIvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCB7IE91dHBvc3QgfSBmcm9tIFwiLi4vcGxhY2VzL291dHBvc3RcIjtcclxuaW1wb3J0IHsgUm9hZCB9IGZyb20gXCIuLi9wbGFjZXMvcm9hZFwiO1xyXG5pbXBvcnQgeyBBRFJFdmVudCB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBFdmVudHNSb2FkV2FuZGVyOiBBcnJheTxBRFJFdmVudD4gPSBbXHJcbiAgICAvLyBTdHJhbmdlciBiZWFyaW5nIGdpZnRzXHJcbiAgICB7XHJcbiAgICAgICAgdGl0bGU6IF8oJ0EgU3RyYW5nZXIgQmVja29ucycpLFxyXG4gICAgICAgIGlzQXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gUm9hZDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAnc3RhcnQnOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgXygnQXMgeW91IHdhbmRlciBhbG9uZyB0aGUgcm9hZCwgYSBob29kZWQgc3RyYW5nZXIgZ2VzdHVyZXMgdG8geW91LiBIZSBkb2VzblxcJ3Qgc2VlbSBpbnRlcmVzdGVkIGluIGh1cnRpbmcgeW91LicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1doYXQgZG8geW91IGRvPycpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdjbG9zZXInOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0RyYXcgQ2xvc2VyJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6ICdjbG9zZXInfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgJ2xlYXZlJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdHZXQgT3V0dGEgVGhlcmUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiB7MTogJ2xlYXZlJ31cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdjbG9zZXInOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgXygnWW91IG1vdmUgdG93YXJkIGhpbSBhIGJpdCBhbmQgc3RvcC4gSGUgY29udGludWVzIHRvIGJlY2tvbi4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdXaGF0IGRvIHlvdSBkbz8nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnZXZlbkNsb3Nlcic6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnRHJhdyBFdmVuIENsb3NlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6IHsxOiAnZXZlbkNsb3Nlcid9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAnbGVhdmUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ05haCwgVGhpcyBpcyBUb28gU3Bvb2t5JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogezE6ICdsZWF2ZSd9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnZXZlbkNsb3Nlcic6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICBfKCdZb3UgaGVzaXRhbnRseSB3YWxrIGNsb3Nlci4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdBcyBzb29uIGFzIHlvdSBnZXQgd2l0aGluIGFybXNcXCcgcmVhY2gsIGhlIGdyYWJzIHlvdXIgaGFuZCB3aXRoIGFsYXJtaW5nIHNwZWVkLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0hlIHF1aWNrbHkgcGxhY2VzIGFuIG9iamVjdCBpbiB5b3VyIGhhbmQsIHRoZW4gbGVhdmVzIHdvcmRsZXNzbHkuJylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBvbkxvYWQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG1heWJlIHNvbWUgbG9naWMgdG8gbWFrZSByZXBlYXRzIGxlc3MgbGlrZWx5P1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvc3NpYmxlSXRlbXMgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdTdHJhbmdlci5zbW9vdGhTdG9uZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdTdHJhbmdlci53cmFwcGVkS25pZmUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnU3RyYW5nZXIuY2xvdGhCdW5kbGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnU3RyYW5nZXIuY29pbidcclxuICAgICAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBwb3NzaWJsZUl0ZW1zW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBvc3NpYmxlSXRlbXMubGVuZ3RoKV07XHJcbiAgICAgICAgICAgICAgICAgICAgQ2hhcmFjdGVyLmFkZFRvSW52ZW50b3J5KGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnVGhhbmtzLCBJIGd1ZXNzPycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnbGVhdmUnOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgXygnWW91ciBndXQgY2xlbmNoZXMsIGFuZCB5b3UgZmVlbCB0aGUgc3VkZGVuIHVyZ2UgdG8gbGVhdmUuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXygnQXMgeW91IHdhbGsgYXdheSwgeW91IGNhbiBmZWVsIHRoZSBvbGQgbWFuXFwncyBnYXplIG9uIHlvdXIgYmFjay4nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnV2VpcmQuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gVW5sb2NrIE91dHBvc3RcclxuICAgIHtcclxuICAgICAgICB0aXRsZTogXygnQSBXYXkgRm9yd2FyZCBNYWtlcyBJdHNlbGYgS25vd24nKSxcclxuICAgICAgICBpc0F2YWlsYWJsZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAoRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSBSb2FkKVxyXG4gICAgICAgICAgICAgICAgJiYgKCRTTS5nZXQoJ1JvYWQuY291bnRlcicpIGFzIG51bWJlciA+IDYpIC8vIGNhbid0IGhhcHBlbiBUT08gZWFybHlcclxuICAgICAgICAgICAgICAgICYmICh0eXBlb2YoJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpKSA9PSBcInVuZGVmaW5lZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgfHwgJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpIGFzIG51bWJlciA8IDEpIC8vIGNhbid0IGhhcHBlbiB0d2ljZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaXNTdXBlckxpa2VseTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoJFNNLmdldCgnc3VwZXJsaWtlbHkub3V0cG9zdFVubG9jaycpIGFzIG51bWJlciA8IDEpICYmICgkU00uZ2V0KCdSb2FkLmNvdW50ZXInKSBhcyBudW1iZXIgPiAxMCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgJ3N0YXJ0Jzoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgIF8oJ1Ntb2tlIGN1cmxzIHVwd2FyZHMgZnJvbSBiZWhpbmQgYSBoaWxsLiBZb3UgY2xpbWIgaGlnaGVyIHRvIGludmVzdGlnYXRlLicpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8oJ0Zyb20geW91ciBlbGV2YXRlZCBwb3NpdGlvbiwgeW91IGNhbiBzZWUgZG93biBpbnRvIHRoZSBvdXRwb3N0IHRoYXQgdGhlIG1heW9yIHNwb2tlIG9mIGJlZm9yZS4nKSxcclxuICAgICAgICAgICAgICAgICAgICBfKCdUaGUgT3V0cG9zdCBpcyBub3cgb3BlbiB0byB5b3UuJylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0EgbGl0dGxlIGRyYW1hdGljLCBidXQgY29vbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBPdXRwb3N0LmluaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRTTS5zZXQoJ3N1cGVybGlrZWx5Lm91dHBvc3RVbmxvY2snLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbl07XHJcblxyXG4iLCIvKipcclxuICogRXZlbnRzIHRoYXQgY2FuIG9jY3VyIHdoZW4gdGhlIFJvb20gbW9kdWxlIGlzIGFjdGl2ZVxyXG4gKiovXHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuLi9lbmdpbmVcIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgUm9vbSB9IGZyb20gJy4uL3BsYWNlcy9yb29tJztcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IEFEUkV2ZW50IH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEV2ZW50c1Jvb206IEFycmF5PEFEUkV2ZW50PiA9IFtcclxuXHR7IC8qIFRoZSBOb21hZCAgLS0gIE1lcmNoYW50ICovXHJcblx0XHR0aXRsZTogXygnVGhlIE5vbWFkJyksXHJcblx0XHRpc0F2YWlsYWJsZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiBFbmdpbmUuYWN0aXZlTW9kdWxlID09IFJvb20gJiYgJFNNLmdldCgnc3RvcmVzLmZ1cicsIHRydWUpIGFzIG51bWJlciA+IDA7XHJcblx0XHR9LFxyXG5cdFx0c2NlbmVzOiB7XHJcblx0XHRcdCdzdGFydCc6IHtcclxuXHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRfKCdhIG5vbWFkIHNodWZmbGVzIGludG8gdmlldywgbGFkZW4gd2l0aCBtYWtlc2hpZnQgYmFncyBib3VuZCB3aXRoIHJvdWdoIHR3aW5lLicpLFxyXG5cdFx0XHRcdFx0XyhcIndvbid0IHNheSBmcm9tIHdoZXJlIGhlIGNhbWUsIGJ1dCBpdCdzIGNsZWFyIHRoYXQgaGUncyBub3Qgc3RheWluZy5cIilcclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdG5vdGlmaWNhdGlvbjogXygnYSBub21hZCBhcnJpdmVzLCBsb29raW5nIHRvIHRyYWRlJyksXHJcblx0XHRcdFx0Ymxpbms6IHRydWUsXHJcblx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0J2J1eVNjYWxlcyc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnYnV5IHNjYWxlcycpLFxyXG5cdFx0XHRcdFx0XHRjb3N0OiB7ICdmdXInOiAxMDAgfSxcclxuXHRcdFx0XHRcdFx0cmV3YXJkOiB7ICdzY2FsZXMnOiAxIH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnYnV5VGVldGgnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ2J1eSB0ZWV0aCcpLFxyXG5cdFx0XHRcdFx0XHRjb3N0OiB7ICdmdXInOiAyMDAgfSxcclxuXHRcdFx0XHRcdFx0cmV3YXJkOiB7ICd0ZWV0aCc6IDEgfVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCdidXlCYWl0Jzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdidXkgYmFpdCcpLFxyXG5cdFx0XHRcdFx0XHRjb3N0OiB7ICdmdXInOiA1IH0sXHJcblx0XHRcdFx0XHRcdHJld2FyZDogeyAnYmFpdCc6IDEgfSxcclxuXHRcdFx0XHRcdFx0bm90aWZpY2F0aW9uOiBfKCd0cmFwcyBhcmUgbW9yZSBlZmZlY3RpdmUgd2l0aCBiYWl0LicpXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J2dvb2RieWUnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ3NheSBnb29kYnllJyksXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LCBcclxuXHR7IC8qIE5vaXNlcyBPdXRzaWRlICAtLSAgZ2FpbiB3b29kL2Z1ciAqL1xyXG5cdFx0dGl0bGU6IF8oJ05vaXNlcycpLFxyXG5cdFx0aXNBdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSBSb29tICYmICRTTS5nZXQoJ3N0b3Jlcy53b29kJyk7XHJcblx0XHR9LFxyXG5cdFx0c2NlbmVzOiB7XHJcblx0XHRcdCdzdGFydCc6IHtcclxuXHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRfKCd0aHJvdWdoIHRoZSB3YWxscywgc2h1ZmZsaW5nIG5vaXNlcyBjYW4gYmUgaGVhcmQuJyksXHJcblx0XHRcdFx0XHRfKFwiY2FuJ3QgdGVsbCB3aGF0IHRoZXkncmUgdXAgdG8uXCIpXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRub3RpZmljYXRpb246IF8oJ3N0cmFuZ2Ugbm9pc2VzIGNhbiBiZSBoZWFyZCB0aHJvdWdoIHRoZSB3YWxscycpLFxyXG5cdFx0XHRcdGJsaW5rOiB0cnVlLFxyXG5cdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdCdpbnZlc3RpZ2F0ZSc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnaW52ZXN0aWdhdGUnKSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7IDAuMzogJ3N0dWZmJywgMTogJ25vdGhpbmcnIH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnaWdub3JlJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdpZ25vcmUgdGhlbScpLFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHQnbm90aGluZyc6IHtcclxuXHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRfKCd2YWd1ZSBzaGFwZXMgbW92ZSwganVzdCBvdXQgb2Ygc2lnaHQuJyksXHJcblx0XHRcdFx0XHRfKCd0aGUgc291bmRzIHN0b3AuJylcclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdCdiYWNraW5zaWRlJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdnbyBiYWNrIGluc2lkZScpLFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHQnc3R1ZmYnOiB7XHJcblx0XHRcdFx0cmV3YXJkOiB7IHdvb2Q6IDEwMCwgZnVyOiAxMCB9LFxyXG5cdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdF8oJ2EgYnVuZGxlIG9mIHN0aWNrcyBsaWVzIGp1c3QgYmV5b25kIHRoZSB0aHJlc2hvbGQsIHdyYXBwZWQgaW4gY29hcnNlIGZ1cnMuJyksXHJcblx0XHRcdFx0XHRfKCd0aGUgbmlnaHQgaXMgc2lsZW50LicpXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHQnYmFja2luc2lkZSc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnZ28gYmFjayBpbnNpZGUnKSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0eyAvKiBUaGUgQmVnZ2FyICAtLSAgdHJhZGUgZnVyIGZvciBiZXR0ZXIgZ29vZCAqL1xyXG5cdFx0dGl0bGU6IF8oJ1RoZSBCZWdnYXInKSxcclxuXHRcdGlzQXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gUm9vbSAmJiAkU00uZ2V0KCdzdG9yZXMuZnVyJyk7XHJcblx0XHR9LFxyXG5cdFx0c2NlbmVzOiB7XHJcblx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XygnYSBiZWdnYXIgYXJyaXZlcy4nKSxcclxuXHRcdFx0XHRcdF8oJ2Fza3MgZm9yIGFueSBzcGFyZSBmdXJzIHRvIGtlZXAgaGltIHdhcm0gYXQgbmlnaHQuJylcclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdG5vdGlmaWNhdGlvbjogXygnYSBiZWdnYXIgYXJyaXZlcycpLFxyXG5cdFx0XHRcdGJsaW5rOiB0cnVlLFxyXG5cdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdCc1MGZ1cnMnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ2dpdmUgNTAnKSxcclxuXHRcdFx0XHRcdFx0Y29zdDoge2Z1cjogNTB9LFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6IHsgMC41OiAnc2NhbGVzJywgMC44OiAndGVldGgnLCAxOiAnY2xvdGgnIH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnMTAwZnVycyc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnZ2l2ZSAxMDAnKSxcclxuXHRcdFx0XHRcdFx0Y29zdDoge2Z1cjogMTAwfSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiB7IDAuNTogJ3RlZXRoJywgMC44OiAnc2NhbGVzJywgMTogJ2Nsb3RoJyB9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J2RlbnknOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ3R1cm4gaGltIGF3YXknKSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0c2NhbGVzOiB7XHJcblx0XHRcdFx0cmV3YXJkOiB7IHNjYWxlczogMjAgfSxcclxuXHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRfKCd0aGUgYmVnZ2FyIGV4cHJlc3NlcyBoaXMgdGhhbmtzLicpLFxyXG5cdFx0XHRcdFx0XygnbGVhdmVzIGEgcGlsZSBvZiBzbWFsbCBzY2FsZXMgYmVoaW5kLicpXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0XHQnbGVhdmUnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ3NheSBnb29kYnllJyksXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHRlZXRoOiB7XHJcblx0XHRcdFx0cmV3YXJkOiB7IHRlZXRoOiAyMCB9LFxyXG5cdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdF8oJ3RoZSBiZWdnYXIgZXhwcmVzc2VzIGhpcyB0aGFua3MuJyksXHJcblx0XHRcdFx0XHRfKCdsZWF2ZXMgYSBwaWxlIG9mIHNtYWxsIHRlZXRoIGJlaGluZC4nKVxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdzYXkgZ29vZGJ5ZScpLFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRjbG90aDoge1xyXG5cdFx0XHRcdHJld2FyZDogeyBjbG90aDogMjAgfSxcclxuXHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRfKCd0aGUgYmVnZ2FyIGV4cHJlc3NlcyBoaXMgdGhhbmtzLicpLFxyXG5cdFx0XHRcdFx0XygnbGVhdmVzIHNvbWUgc2NyYXBzIG9mIGNsb3RoIGJlaGluZC4nKVxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0J2xlYXZlJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdzYXkgZ29vZGJ5ZScpLFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHR7IC8qIFRoZSBTY291dCAgLS0gIE1hcCBNZXJjaGFudCAqL1xyXG5cdFx0dGl0bGU6IF8oJ1RoZSBTY291dCcpLFxyXG5cdFx0aXNBdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gRW5naW5lLmFjdGl2ZU1vZHVsZSA9PSBSb29tICYmICRTTS5nZXQoJ2ZlYXR1cmVzLmxvY2F0aW9uLndvcmxkJyk7XHJcblx0XHR9LFxyXG5cdFx0c2NlbmVzOiB7XHJcblx0XHRcdCdzdGFydCc6IHtcclxuXHRcdFx0XHR0ZXh0OiBbXHJcblx0XHRcdFx0XHRfKFwidGhlIHNjb3V0IHNheXMgc2hlJ3MgYmVlbiBhbGwgb3Zlci5cIiksXHJcblx0XHRcdFx0XHRfKFwid2lsbGluZyB0byB0YWxrIGFib3V0IGl0LCBmb3IgYSBwcmljZS5cIilcclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdG5vdGlmaWNhdGlvbjogXygnYSBzY291dCBzdG9wcyBmb3IgdGhlIG5pZ2h0JyksXHJcblx0XHRcdFx0Ymxpbms6IHRydWUsXHJcblx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0J2J1eU1hcCc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnYnV5IG1hcCcpLFxyXG5cdFx0XHRcdFx0XHRjb3N0OiB7ICdmdXInOiAyMDAsICdzY2FsZXMnOiAxMCB9LFxyXG5cdFx0XHRcdFx0XHRub3RpZmljYXRpb246IF8oJ3RoZSBtYXAgdW5jb3ZlcnMgYSBiaXQgb2YgdGhlIHdvcmxkJyksXHJcblx0XHRcdFx0XHRcdC8vIG9uQ2hvb3NlOiBXb3JsZC5hcHBseU1hcFxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCdsZWFybic6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnbGVhcm4gc2NvdXRpbmcnKSxcclxuXHRcdFx0XHRcdFx0Y29zdDogeyAnZnVyJzogMTAwMCwgJ3NjYWxlcyc6IDUwLCAndGVldGgnOiAyMCB9LFxyXG5cdFx0XHRcdFx0XHRhdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiAhJFNNLmhhc1BlcmsoJ3Njb3V0Jyk7XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHQkU00uYWRkUGVyaygnc2NvdXQnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCdsZWF2ZSc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnc2F5IGdvb2RieWUnKSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0eyAvKiBUaGUgV2FuZGVyaW5nIE1hc3RlciAqL1xyXG5cdFx0dGl0bGU6IF8oJ1RoZSBNYXN0ZXInKSxcclxuXHRcdGlzQXZhaWxhYmxlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIEVuZ2luZS5hY3RpdmVNb2R1bGUgPT0gUm9vbSAmJiAkU00uZ2V0KCdmZWF0dXJlcy5sb2NhdGlvbi53b3JsZCcpO1xyXG5cdFx0fSxcclxuXHRcdHNjZW5lczoge1xyXG5cdFx0XHQnc3RhcnQnOiB7XHJcblx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XygnYW4gb2xkIHdhbmRlcmVyIGFycml2ZXMuJyksXHJcblx0XHRcdFx0XHRfKCdoZSBzbWlsZXMgd2FybWx5IGFuZCBhc2tzIGZvciBsb2RnaW5ncyBmb3IgdGhlIG5pZ2h0LicpXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRub3RpZmljYXRpb246IF8oJ2FuIG9sZCB3YW5kZXJlciBhcnJpdmVzJyksXHJcblx0XHRcdFx0Ymxpbms6IHRydWUsXHJcblx0XHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdFx0J2FncmVlJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdhZ3JlZScpLFxyXG5cdFx0XHRcdFx0XHRjb3N0OiB7XHJcblx0XHRcdFx0XHRcdFx0J2N1cmVkIG1lYXQnOiAxMDAsXHJcblx0XHRcdFx0XHRcdFx0J2Z1cic6IDEwMCxcclxuXHRcdFx0XHRcdFx0XHQndG9yY2gnOiAxXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogezE6ICdhZ3JlZSd9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J2RlbnknOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ3R1cm4gaGltIGF3YXknKSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0J2FncmVlJzoge1xyXG5cdFx0XHRcdHRleHQ6IFtcclxuXHRcdFx0XHRcdF8oJ2luIGV4Y2hhbmdlLCB0aGUgd2FuZGVyZXIgb2ZmZXJzIGhpcyB3aXNkb20uJylcclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdCdldmFzaW9uJzoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBfKCdldmFzaW9uJyksXHJcblx0XHRcdFx0XHRcdGF2YWlsYWJsZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuICEkU00uaGFzUGVyaygnZXZhc2l2ZScpO1xyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRvbkNob29zZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0JFNNLmFkZFBlcmsoJ2V2YXNpdmUnKTtcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0bmV4dFNjZW5lOiAnZW5kJ1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCdwcmVjaXNpb24nOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ3ByZWNpc2lvbicpLFxyXG5cdFx0XHRcdFx0XHRhdmFpbGFibGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiAhJFNNLmhhc1BlcmsoJ3ByZWNpc2UnKTtcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0b25DaG9vc2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdCRTTS5hZGRQZXJrKCdwcmVjaXNlJyk7XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnZm9yY2UnOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IF8oJ2ZvcmNlJyksXHJcblx0XHRcdFx0XHRcdGF2YWlsYWJsZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuICEkU00uaGFzUGVyaygnYmFyYmFyaWFuJyk7XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdG9uQ2hvb3NlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHQkU00uYWRkUGVyaygnYmFyYmFyaWFuJyk7XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdG5leHRTY2VuZTogJ2VuZCdcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnbm90aGluZyc6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXygnbm90aGluZycpLFxyXG5cdFx0XHRcdFx0XHRuZXh0U2NlbmU6ICdlbmQnXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5dO1xyXG4iLCIvKipcclxuICogTW9kdWxlIHRoYXQgdGFrZXMgY2FyZSBvZiBoZWFkZXIgYnV0dG9uc1xyXG4gKi9cclxuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4vZW5naW5lXCI7XHJcblxyXG5leHBvcnQgY29uc3QgSGVhZGVyID0ge1xyXG5cdFxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblx0fSxcclxuXHRcclxuXHRvcHRpb25zOiB7fSwgLy8gTm90aGluZyBmb3Igbm93XHJcblx0XHJcblx0Y2FuVHJhdmVsOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAkKCdkaXYjaGVhZGVyIGRpdi5oZWFkZXJCdXR0b24nKS5sZW5ndGggPiAxO1xyXG5cdH0sXHJcblx0XHJcblx0YWRkTG9jYXRpb246IGZ1bmN0aW9uKHRleHQsIGlkLCBtb2R1bGUpIHtcclxuXHRcdHJldHVybiAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgXCJsb2NhdGlvbl9cIiArIGlkKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2hlYWRlckJ1dHRvbicpXHJcblx0XHRcdC50ZXh0KHRleHQpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGlmKEhlYWRlci5jYW5UcmF2ZWwoKSkge1xyXG5cdFx0XHRcdFx0RW5naW5lLnRyYXZlbFRvKG1vZHVsZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KS5hcHBlbmRUbygkKCdkaXYjaGVhZGVyJykpO1xyXG5cdH1cclxufTsiLCIvKipcclxuICogTW9kdWxlIHRoYXQgcmVnaXN0ZXJzIHRoZSBub3RpZmljYXRpb24gYm94IGFuZCBoYW5kbGVzIG1lc3NhZ2VzXHJcbiAqL1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi9lbmdpbmVcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBOb3RpZmljYXRpb25zID0ge1xyXG5cdFx0XHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblx0XHRcclxuXHRcdC8vIENyZWF0ZSB0aGUgbm90aWZpY2F0aW9ucyBib3hcclxuXHRcdGNvbnN0IGVsZW0gPSAkKCc8ZGl2PicpLmF0dHIoe1xyXG5cdFx0XHRpZDogJ25vdGlmaWNhdGlvbnMnLFxyXG5cdFx0XHRjbGFzc05hbWU6ICdub3RpZmljYXRpb25zJ1xyXG5cdFx0fSk7XHJcblx0XHQvLyBDcmVhdGUgdGhlIHRyYW5zcGFyZW5jeSBncmFkaWVudFxyXG5cdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdub3RpZnlHcmFkaWVudCcpLmFwcGVuZFRvKGVsZW0pO1xyXG5cdFx0XHJcblx0XHRlbGVtLmFwcGVuZFRvKCdkaXYjd3JhcHBlcicpO1xyXG5cdH0sXHJcblx0XHJcblx0b3B0aW9uczoge30sIC8vIE5vdGhpbmcgZm9yIG5vd1xyXG5cdFxyXG5cdGVsZW06IG51bGwsXHJcblx0XHJcblx0bm90aWZ5UXVldWU6IHt9LFxyXG5cdFxyXG5cdC8vIEFsbG93IG5vdGlmaWNhdGlvbiB0byB0aGUgcGxheWVyXHJcblx0bm90aWZ5OiBmdW5jdGlvbihtb2R1bGUsIHRleHQsIG5vUXVldWU/KSB7XHJcblx0XHRpZih0eXBlb2YgdGV4dCA9PSAndW5kZWZpbmVkJykgcmV0dXJuO1xyXG5cdFx0Ly8gSSBkb24ndCBuZWVkIHlvdSBwdW5jdHVhdGluZyBmb3IgbWUsIGZ1bmN0aW9uLlxyXG5cdFx0Ly8gaWYodGV4dC5zbGljZSgtMSkgIT0gXCIuXCIpIHRleHQgKz0gXCIuXCI7XHJcblx0XHRpZihtb2R1bGUgIT0gbnVsbCAmJiBFbmdpbmUuYWN0aXZlTW9kdWxlICE9IG1vZHVsZSkge1xyXG5cdFx0XHRpZighbm9RdWV1ZSkge1xyXG5cdFx0XHRcdGlmKHR5cGVvZiB0aGlzLm5vdGlmeVF1ZXVlW21vZHVsZV0gPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0XHRcdHRoaXMubm90aWZ5UXVldWVbbW9kdWxlXSA9IFtdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLm5vdGlmeVF1ZXVlW21vZHVsZV0ucHVzaCh0ZXh0KTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Tm90aWZpY2F0aW9ucy5wcmludE1lc3NhZ2UodGV4dCk7XHJcblx0XHR9XHJcblx0XHRFbmdpbmUuc2F2ZUdhbWUoKTtcclxuXHR9LFxyXG5cdFxyXG5cdGNsZWFySGlkZGVuOiBmdW5jdGlvbigpIHtcclxuXHRcclxuXHRcdC8vIFRvIGZpeCBzb21lIG1lbW9yeSB1c2FnZSBpc3N1ZXMsIHdlIGNsZWFyIG5vdGlmaWNhdGlvbnMgdGhhdCBoYXZlIGJlZW4gaGlkZGVuLlxyXG5cdFx0XHJcblx0XHQvLyBXZSB1c2UgcG9zaXRpb24oKS50b3AgaGVyZSwgYmVjYXVzZSB3ZSBrbm93IHRoYXQgdGhlIHBhcmVudCB3aWxsIGJlIHRoZSBzYW1lLCBzbyB0aGUgcG9zaXRpb24gd2lsbCBiZSB0aGUgc2FtZS5cclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdHZhciBib3R0b20gPSAkKCcjbm90aWZ5R3JhZGllbnQnKS5wb3NpdGlvbigpLnRvcCArICQoJyNub3RpZnlHcmFkaWVudCcpLm91dGVySGVpZ2h0KHRydWUpO1xyXG5cdFx0XHJcblx0XHQkKCcubm90aWZpY2F0aW9uJykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFxyXG5cdFx0XHRpZigkKHRoaXMpLnBvc2l0aW9uKCkudG9wID4gYm90dG9tKXtcclxuXHRcdFx0XHQkKHRoaXMpLnJlbW92ZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0fSxcclxuXHRcclxuXHRwcmludE1lc3NhZ2U6IGZ1bmN0aW9uKHQpIHtcclxuXHRcdHZhciB0ZXh0ID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnbm90aWZpY2F0aW9uJykuY3NzKCdvcGFjaXR5JywgJzAnKS50ZXh0KHQpLnByZXBlbmRUbygnZGl2I25vdGlmaWNhdGlvbnMnKTtcclxuXHRcdHRleHQuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIDUwMCwgJ2xpbmVhcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQvLyBEbyB0aGlzIGV2ZXJ5IHRpbWUgd2UgYWRkIGEgbmV3IG1lc3NhZ2UsIHRoaXMgd2F5IHdlIG5ldmVyIGhhdmUgYSBsYXJnZSBiYWNrbG9nIHRvIGl0ZXJhdGUgdGhyb3VnaC4gS2VlcHMgdGhpbmdzIGZhc3Rlci5cclxuXHRcdFx0Tm90aWZpY2F0aW9ucy5jbGVhckhpZGRlbigpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRcclxuXHRwcmludFF1ZXVlOiBmdW5jdGlvbihtb2R1bGUpIHtcclxuXHRcdGlmKHR5cGVvZiB0aGlzLm5vdGlmeVF1ZXVlW21vZHVsZV0gIT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0d2hpbGUodGhpcy5ub3RpZnlRdWV1ZVttb2R1bGVdLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHROb3RpZmljYXRpb25zLnByaW50TWVzc2FnZSh0aGlzLm5vdGlmeVF1ZXVlW21vZHVsZV0uc2hpZnQoKSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IHsgRW5naW5lIH0gZnJvbSAnLi4vZW5naW5lJztcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSAnLi4vc3RhdGVfbWFuYWdlcic7XHJcbmltcG9ydCB7IFdlYXRoZXIgfSBmcm9tICcuLi93ZWF0aGVyJztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vQnV0dG9uJztcclxuaW1wb3J0IHsgQ2FwdGFpbiB9IGZyb20gJy4uL2NoYXJhY3RlcnMvY2FwdGFpbic7XHJcbmltcG9ydCB7IEhlYWRlciB9IGZyb20gJy4uL2hlYWRlcic7XHJcbmltcG9ydCB7IF8gfSBmcm9tICcuLi8uLi9saWIvdHJhbnNsYXRlJztcclxuXHJcbmV4cG9ydCBjb25zdCBPdXRwb3N0ID0ge1xyXG4gICAgaW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgdGhlIE91dHBvc3QgdGFiXHJcbiAgICAgICAgdGhpcy50YWIgPSBIZWFkZXIuYWRkTG9jYXRpb24oXyhcIlRoZSBPdXRwb3N0XCIpLCBcIm91dHBvc3RcIiwgT3V0cG9zdCk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgT3V0cG9zdCBwYW5lbFxyXG5cdFx0dGhpcy5wYW5lbCA9ICQoJzxkaXY+JylcclxuICAgICAgICAuYXR0cignaWQnLCBcIm91dHBvc3RQYW5lbFwiKVxyXG4gICAgICAgIC5hZGRDbGFzcygnbG9jYXRpb24nKVxyXG4gICAgICAgIC5hcHBlbmRUbygnZGl2I2xvY2F0aW9uU2xpZGVyJyk7XHJcblxyXG4gICAgICAgIEVuZ2luZS51cGRhdGVTbGlkZXIoKTtcclxuXHJcbiAgICAgICAgLy8gbmV3IFxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiAnY2FwdGFpbkJ1dHRvbicsXHJcblx0XHRcdHRleHQ6IF8oJ1NwZWFrIHdpdGggVGhlIENhcHRhaW4nKSxcclxuXHRcdFx0Y2xpY2s6IENhcHRhaW4udGFsa1RvQ2FwdGFpbixcclxuXHRcdFx0d2lkdGg6ICc4MHB4J1xyXG5cdFx0fSkuYXBwZW5kVG8oJ2RpdiNvdXRwb3N0UGFuZWwnKTtcclxuXHJcbiAgICAgICAgT3V0cG9zdC51cGRhdGVCdXR0b24oKTtcclxuXHJcbiAgICAgICAgLy8gc2V0dGluZyB0aGlzIHNlcGFyYXRlbHkgc28gdGhhdCBxdWVzdCBzdGF0dXMgY2FuJ3QgYWNjaWRlbnRhbGx5IGJyZWFrIGl0IGxhdGVyXHJcbiAgICAgICAgJFNNLnNldCgnb3V0cG9zdC5vcGVuJywgMSk7IFxyXG4gICAgfSxcclxuXHJcbiAgICBhdmFpbGFibGVXZWF0aGVyOiB7XHJcblx0XHQnc3VubnknOiAwLjQsXHJcblx0XHQnY2xvdWR5JzogMC4zLFxyXG5cdFx0J3JhaW55JzogMC4zXHJcblx0fSxcclxuXHJcbiAgICBvbkFycml2YWw6IGZ1bmN0aW9uKHRyYW5zaXRpb25fZGlmZikge1xyXG4gICAgICAgIE91dHBvc3Quc2V0VGl0bGUoKTtcclxuXHJcblx0XHRFbmdpbmUubW92ZVN0b3Jlc1ZpZXcobnVsbCwgdHJhbnNpdGlvbl9kaWZmKTtcclxuXHJcbiAgICAgICAgV2VhdGhlci5pbml0aWF0ZVdlYXRoZXIoT3V0cG9zdC5hdmFpbGFibGVXZWF0aGVyLCAnb3V0cG9zdCcpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRUaXRsZTogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdGl0bGUgPSBfKFwiVGhlIE91dHBvc3RcIik7XHJcblx0XHRpZihFbmdpbmUuYWN0aXZlTW9kdWxlID09IHRoaXMpIHtcclxuXHRcdFx0ZG9jdW1lbnQudGl0bGUgPSB0aXRsZTtcclxuXHRcdH1cclxuXHRcdCQoJ2RpdiNsb2NhdGlvbl9vdXRwb3N0JykudGV4dCh0aXRsZSk7XHJcblx0fSxcclxuXHJcbiAgICB1cGRhdGVCdXR0b246IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gY29uZGl0aW9uYWxzIGZvciB1cGRhdGluZyBidXR0b25zXHJcblx0fSxcclxuXHJcbiAgICAvLyBkb24ndCBuZWVkIHRoaXMgeWV0IChvciBtYXliZSBldmVyKVxyXG5cdC8vIHdhbmRlckV2ZW50OiBmdW5jdGlvbigpIHtcclxuXHQvLyBcdEV2ZW50cy50cmlnZ2VyTG9jYXRpb25FdmVudCgnT3V0cG9zdFdhbmRlcicpO1xyXG5cdC8vIFx0JFNNLmFkZCgnT3V0cG9zdC5jb3VudGVyJywgMSk7XHJcblx0Ly8gfVxyXG59IiwiaW1wb3J0IHsgSGVhZGVyIH0gZnJvbSBcIi4uL2hlYWRlclwiO1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi4vZW5naW5lXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi9CdXR0b25cIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgXyB9IGZyb20gXCIuLi8uLi9saWIvdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IFdlYXRoZXIgfSBmcm9tIFwiLi4vd2VhdGhlclwiO1xyXG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgUm9hZCA9IHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnM/KSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBSb2FkIHRhYlxyXG4gICAgICAgIHRoaXMudGFiID0gSGVhZGVyLmFkZExvY2F0aW9uKF8oXCJSb2FkIHRvIHRoZSBPdXRwb3N0XCIpLCBcInJvYWRcIiwgUm9hZCk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgUm9hZCBwYW5lbFxyXG5cdFx0dGhpcy5wYW5lbCA9ICQoJzxkaXY+JylcclxuICAgICAgICAuYXR0cignaWQnLCBcInJvYWRQYW5lbFwiKVxyXG4gICAgICAgIC5hZGRDbGFzcygnbG9jYXRpb24nKVxyXG4gICAgICAgIC5hcHBlbmRUbygnZGl2I2xvY2F0aW9uU2xpZGVyJyk7XHJcblxyXG4gICAgICAgIEVuZ2luZS51cGRhdGVTbGlkZXIoKTtcclxuXHJcbiAgICAgICAgLy9uZXcgXHJcblx0XHRCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6ICd3YW5kZXJCdXR0b24nLFxyXG5cdFx0XHR0ZXh0OiBfKCdXYW5kZXIgQXJvdW5kJyksXHJcblx0XHRcdGNsaWNrOiBSb2FkLndhbmRlckV2ZW50LFxyXG5cdFx0XHR3aWR0aDogJzgwcHgnLFxyXG5cdFx0XHRjb3N0OiB7fSAvLyBUT0RPOiBtYWtlIHRoZXJlIGJlIGEgY29zdCB0byBkb2luZyBzdHVmZj9cclxuXHRcdH0pLmFwcGVuZFRvKCdkaXYjcm9hZFBhbmVsJyk7XHJcblxyXG4gICAgICAgIFJvYWQudXBkYXRlQnV0dG9uKCk7XHJcblxyXG4gICAgICAgIC8vIHNldHRpbmcgdGhpcyBzZXBhcmF0ZWx5IHNvIHRoYXQgcXVlc3Qgc3RhdHVzIGNhbid0IGFjY2lkZW50YWxseSBicmVhayBpdCBsYXRlclxyXG4gICAgICAgICRTTS5zZXQoJ3JvYWQub3BlbicsIDEpOyBcclxuICAgIH0sXHJcblxyXG4gICAgYXZhaWxhYmxlV2VhdGhlcjoge1xyXG5cdFx0J3N1bm55JzogMC40LFxyXG5cdFx0J2Nsb3VkeSc6IDAuMyxcclxuXHRcdCdyYWlueSc6IDAuM1xyXG5cdH0sXHJcblxyXG4gICAgb25BcnJpdmFsOiBmdW5jdGlvbih0cmFuc2l0aW9uX2RpZmYpIHtcclxuICAgICAgICBSb2FkLnNldFRpdGxlKCk7XHJcblxyXG5cdFx0RW5naW5lLm1vdmVTdG9yZXNWaWV3KG51bGwsIHRyYW5zaXRpb25fZGlmZik7XHJcblxyXG4gICAgICAgIFdlYXRoZXIuaW5pdGlhdGVXZWF0aGVyKFJvYWQuYXZhaWxhYmxlV2VhdGhlciwgJ3JvYWQnKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0VGl0bGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRpdGxlID0gXyhcIlJvYWQgdG8gdGhlIE91dHBvc3RcIik7XHJcblx0XHRpZihFbmdpbmUuYWN0aXZlTW9kdWxlID09IHRoaXMpIHtcclxuXHRcdFx0ZG9jdW1lbnQudGl0bGUgPSB0aXRsZTtcclxuXHRcdH1cclxuXHRcdCQoJ2RpdiNsb2NhdGlvbl9yb2FkJykudGV4dCh0aXRsZSk7XHJcblx0fSxcclxuXHJcbiAgICB1cGRhdGVCdXR0b246IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gY29uZGl0aW9uYWxzIGZvciB1cGRhdGluZyBidXR0b25zXHJcblx0fSxcclxuXHJcblx0d2FuZGVyRXZlbnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0RXZlbnRzLnRyaWdnZXJMb2NhdGlvbkV2ZW50KCdSb2FkV2FuZGVyJyk7XHJcblx0XHQkU00uYWRkKCdSb2FkLmNvdW50ZXInLCAxKTtcclxuXHR9XHJcbn0iLCIvKipcclxuICogTW9kdWxlIHRoYXQgcmVnaXN0ZXJzIHRoZSBzaW1wbGUgcm9vbSBmdW5jdGlvbmFsaXR5XHJcbiAqL1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi4vZW5naW5lXCI7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gXCIuLi9zdGF0ZV9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi9CdXR0b25cIjtcclxuaW1wb3J0IHsgTm90aWZpY2F0aW9ucyB9IGZyb20gXCIuLi9ub3RpZmljYXRpb25zXCI7XHJcbmltcG9ydCB7IFdlYXRoZXIgfSBmcm9tIFwiLi4vd2VhdGhlclwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgSGVhZGVyIH0gZnJvbSBcIi4uL2hlYWRlclwiO1xyXG5pbXBvcnQgeyBMaXogfSBmcm9tIFwiLi4vY2hhcmFjdGVycy9saXpcIjtcclxuaW1wb3J0IHsgTWF5b3IgfSBmcm9tIFwiLi4vY2hhcmFjdGVycy9tYXlvclwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IFJvb20gPSB7XHJcblx0Ly8gdGltZXMgaW4gKG1pbnV0ZXMgKiBzZWNvbmRzICogbWlsbGlzZWNvbmRzKVxyXG5cdF9GSVJFX0NPT0xfREVMQVk6IDUgKiA2MCAqIDEwMDAsIC8vIHRpbWUgYWZ0ZXIgYSBzdG9rZSBiZWZvcmUgdGhlIGZpcmUgY29vbHNcclxuXHRfUk9PTV9XQVJNX0RFTEFZOiAzMCAqIDEwMDAsIC8vIHRpbWUgYmV0d2VlbiByb29tIHRlbXBlcmF0dXJlIHVwZGF0ZXNcclxuXHRfQlVJTERFUl9TVEFURV9ERUxBWTogMC41ICogNjAgKiAxMDAwLCAvLyB0aW1lIGJldHdlZW4gYnVpbGRlciBzdGF0ZSB1cGRhdGVzXHJcblx0X1NUT0tFX0NPT0xET1dOOiAxMCwgLy8gY29vbGRvd24gdG8gc3Rva2UgdGhlIGZpcmVcclxuXHRfTkVFRF9XT09EX0RFTEFZOiAxNSAqIDEwMDAsIC8vIGZyb20gd2hlbiB0aGUgc3RyYW5nZXIgc2hvd3MgdXAsIHRvIHdoZW4geW91IG5lZWQgd29vZFxyXG5cdFxyXG5cdGJ1dHRvbnM6e30sXHJcblx0XHJcblx0Y2hhbmdlZDogZmFsc2UsXHJcblx0XHJcblx0bmFtZTogXyhcIlJvb21cIiksXHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHR0aGlzLm9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnNcclxuXHRcdCk7XHJcblx0XHRcclxuXHRcdGlmKEVuZ2luZS5fZGVidWcpIHtcclxuXHRcdFx0dGhpcy5fUk9PTV9XQVJNX0RFTEFZID0gNTAwMDtcclxuXHRcdFx0dGhpcy5fQlVJTERFUl9TVEFURV9ERUxBWSA9IDUwMDA7XHJcblx0XHRcdHRoaXMuX1NUT0tFX0NPT0xET1dOID0gMDtcclxuXHRcdFx0dGhpcy5fTkVFRF9XT09EX0RFTEFZID0gNTAwMDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gQ3JlYXRlIHRoZSByb29tIHRhYlxyXG5cdFx0dGhpcy50YWIgPSBIZWFkZXIuYWRkTG9jYXRpb24oXyhcIkEgQ2hpbGwgVmlsbGFnZVwiKSwgXCJyb29tXCIsIFJvb20pO1xyXG5cdFx0XHJcblx0XHQvLyBDcmVhdGUgdGhlIFJvb20gcGFuZWxcclxuXHRcdHRoaXMucGFuZWwgPSAkKCc8ZGl2PicpXHJcblx0XHRcdC5hdHRyKCdpZCcsIFwicm9vbVBhbmVsXCIpXHJcblx0XHRcdC5hZGRDbGFzcygnbG9jYXRpb24nKVxyXG5cdFx0XHQuYXBwZW5kVG8oJ2RpdiNsb2NhdGlvblNsaWRlcicpO1xyXG5cdFx0XHJcblx0XHRFbmdpbmUudXBkYXRlU2xpZGVyKCk7XHJcblxyXG5cdFx0Ly9uZXcgXHJcblx0XHRCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6ICd0YWxrQnV0dG9uJyxcclxuXHRcdFx0dGV4dDogXygnVGFsayB0byB0aGUgTWF5b3InKSxcclxuXHRcdFx0Y2xpY2s6IE1heW9yLnRhbGtUb01heW9yLFxyXG5cdFx0XHR3aWR0aDogJzgwcHgnLFxyXG5cdFx0XHRjb3N0OiB7fVxyXG5cdFx0fSkuYXBwZW5kVG8oJ2RpdiNyb29tUGFuZWwnKTtcclxuXHJcblx0XHQvL25ldyBcclxuXHRcdEJ1dHRvbi5CdXR0b24oe1xyXG5cdFx0XHRpZDogJ2xpekJ1dHRvbicsXHJcblx0XHRcdHRleHQ6IF8oJ1RhbGsgdG8gTGl6JyksXHJcblx0XHRcdGNsaWNrOiBMaXoudGFsa1RvTGl6LFxyXG5cdFx0XHR3aWR0aDogJzgwcHgnLFxyXG5cdFx0XHRjb3N0OiB7fVxyXG5cdFx0fSkuYXBwZW5kVG8oJ2RpdiNyb29tUGFuZWwnKTtcclxuXHJcblx0XHR2YXIgbGl6QnV0dG9uID0gJCgnI2xpekJ1dHRvbi5idXR0b24nKTtcclxuXHRcdGxpekJ1dHRvbi5oaWRlKCk7XHJcblx0XHRcclxuXHRcdC8vIENyZWF0ZSB0aGUgc3RvcmVzIGNvbnRhaW5lclxyXG5cdFx0JCgnPGRpdj4nKS5hdHRyKCdpZCcsICdzdG9yZXNDb250YWluZXInKS5hcHBlbmRUbygnZGl2I3Jvb21QYW5lbCcpO1xyXG5cdFx0XHJcblx0XHQvL3N1YnNjcmliZSB0byBzdGF0ZVVwZGF0ZXNcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdCQuRGlzcGF0Y2goJ3N0YXRlVXBkYXRlJykuc3Vic2NyaWJlKFJvb20uaGFuZGxlU3RhdGVVcGRhdGVzKTtcclxuXHRcdFxyXG5cdFx0Um9vbS51cGRhdGVCdXR0b24oKTtcclxuXHR9LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHt9LCAvLyBOb3RoaW5nIGZvciBub3dcclxuXHJcblx0YXZhaWxhYmxlV2VhdGhlcjoge1xyXG5cdFx0J3N1bm55JzogMC40LFxyXG5cdFx0J2Nsb3VkeSc6IDAuMyxcclxuXHRcdCdyYWlueSc6IDAuM1xyXG5cdH0sXHJcblx0XHJcblx0b25BcnJpdmFsOiBmdW5jdGlvbih0cmFuc2l0aW9uX2RpZmYpIHtcclxuXHRcdFJvb20uc2V0VGl0bGUoKTtcclxuXHRcdGlmKCRTTS5nZXQoJ2dhbWUuYnVpbGRlci5sZXZlbCcpID09IDMpIHtcclxuXHRcdFx0JFNNLmFkZCgnZ2FtZS5idWlsZGVyLmxldmVsJywgMSk7XHJcblx0XHRcdCRTTS5zZXRJbmNvbWUoJ2J1aWxkZXInLCB7XHJcblx0XHRcdFx0ZGVsYXk6IDEwLFxyXG5cdFx0XHRcdHN0b3Jlczogeyd3b29kJyA6IDIgfVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0Tm90aWZpY2F0aW9ucy5ub3RpZnkoUm9vbSwgXyhcInRoZSBzdHJhbmdlciBpcyBzdGFuZGluZyBieSB0aGUgZmlyZS4gc2hlIHNheXMgc2hlIGNhbiBoZWxwLiBzYXlzIHNoZSBidWlsZHMgdGhpbmdzLlwiKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0RW5naW5lLm1vdmVTdG9yZXNWaWV3KG51bGwsIHRyYW5zaXRpb25fZGlmZik7XHJcblxyXG5cdFx0V2VhdGhlci5pbml0aWF0ZVdlYXRoZXIoUm9vbS5hdmFpbGFibGVXZWF0aGVyLCAncm9vbScpO1xyXG5cdH0sXHJcblx0XHJcblx0VGVtcEVudW06IHtcclxuXHRcdGZyb21JbnQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRcdGZvcih2YXIgayBpbiB0aGlzKSB7XHJcblx0XHRcdFx0aWYodHlwZW9mIHRoaXNba10udmFsdWUgIT0gJ3VuZGVmaW5lZCcgJiYgdGhpc1trXS52YWx1ZSA9PSB2YWx1ZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXNba107XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fSxcclxuXHRcdEZyZWV6aW5nOiB7IHZhbHVlOiAwLCB0ZXh0OiBfKCdmcmVlemluZycpIH0sXHJcblx0XHRDb2xkOiB7IHZhbHVlOiAxLCB0ZXh0OiBfKCdjb2xkJykgfSxcclxuXHRcdE1pbGQ6IHsgdmFsdWU6IDIsIHRleHQ6IF8oJ21pbGQnKSB9LFxyXG5cdFx0V2FybTogeyB2YWx1ZTogMywgdGV4dDogXygnd2FybScpIH0sXHJcblx0XHRIb3Q6IHsgdmFsdWU6IDQsIHRleHQ6IF8oJ2hvdCcpIH1cclxuXHR9LFxyXG5cdFxyXG5cdEZpcmVFbnVtOiB7XHJcblx0XHRmcm9tSW50OiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRmb3IodmFyIGsgaW4gdGhpcykge1xyXG5cdFx0XHRcdGlmKHR5cGVvZiB0aGlzW2tdLnZhbHVlICE9ICd1bmRlZmluZWQnICYmIHRoaXNba10udmFsdWUgPT0gdmFsdWUpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0aGlzW2tdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH0sXHJcblx0XHREZWFkOiB7IHZhbHVlOiAwLCB0ZXh0OiBfKCdkZWFkJykgfSxcclxuXHRcdFNtb2xkZXJpbmc6IHsgdmFsdWU6IDEsIHRleHQ6IF8oJ3Ntb2xkZXJpbmcnKSB9LFxyXG5cdFx0RmxpY2tlcmluZzogeyB2YWx1ZTogMiwgdGV4dDogXygnZmxpY2tlcmluZycpIH0sXHJcblx0XHRCdXJuaW5nOiB7IHZhbHVlOiAzLCB0ZXh0OiBfKCdidXJuaW5nJykgfSxcclxuXHRcdFJvYXJpbmc6IHsgdmFsdWU6IDQsIHRleHQ6IF8oJ3JvYXJpbmcnKSB9XHJcblx0fSxcclxuXHRcclxuXHRzZXRUaXRsZTogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdGl0bGUgPSBfKFwiVGhlIFZpbGxhZ2VcIik7XHJcblx0XHRpZihFbmdpbmUuYWN0aXZlTW9kdWxlID09IHRoaXMpIHtcclxuXHRcdFx0ZG9jdW1lbnQudGl0bGUgPSB0aXRsZTtcclxuXHRcdH1cclxuXHRcdCQoJ2RpdiNsb2NhdGlvbl9yb29tJykudGV4dCh0aXRsZSk7XHJcblx0fSxcclxuXHRcclxuXHR1cGRhdGVCdXR0b246IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGxpZ2h0ID0gJCgnI2xpZ2h0QnV0dG9uLmJ1dHRvbicpO1xyXG5cdFx0dmFyIHN0b2tlID0gJCgnI3N0b2tlQnV0dG9uLmJ1dHRvbicpO1xyXG5cdFx0aWYoJFNNLmdldCgnZ2FtZS5maXJlLnZhbHVlJykgPT0gUm9vbS5GaXJlRW51bS5EZWFkLnZhbHVlICYmIHN0b2tlLmNzcygnZGlzcGxheScpICE9ICdub25lJykge1xyXG5cdFx0XHRzdG9rZS5oaWRlKCk7XHJcblx0XHRcdGxpZ2h0LnNob3coKTtcclxuXHRcdFx0aWYoc3Rva2UuaGFzQ2xhc3MoJ2Rpc2FibGVkJykpIHtcclxuXHRcdFx0XHRCdXR0b24uY29vbGRvd24obGlnaHQpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2UgaWYobGlnaHQuY3NzKCdkaXNwbGF5JykgIT0gJ25vbmUnKSB7XHJcblx0XHRcdHN0b2tlLnNob3coKTtcclxuXHRcdFx0bGlnaHQuaGlkZSgpO1xyXG5cdFx0XHRpZihsaWdodC5oYXNDbGFzcygnZGlzYWJsZWQnKSkge1xyXG5cdFx0XHRcdEJ1dHRvbi5jb29sZG93bihzdG9rZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYoISRTTS5nZXQoJ3N0b3Jlcy53b29kJykpIHtcclxuXHRcdFx0bGlnaHQuYWRkQ2xhc3MoJ2ZyZWUnKTtcclxuXHRcdFx0c3Rva2UuYWRkQ2xhc3MoJ2ZyZWUnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxpZ2h0LnJlbW92ZUNsYXNzKCdmcmVlJyk7XHJcblx0XHRcdHN0b2tlLnJlbW92ZUNsYXNzKCdmcmVlJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGxpekJ1dHRvbiA9ICQoJyNsaXpCdXR0b24uYnV0dG9uJyk7XHJcblx0XHRpZigkU00uZ2V0KCd2aWxsYWdlLmxpekFjdGl2ZScpKSBsaXpCdXR0b24uc2hvdygpO1xyXG5cdH0sXHJcblx0XHJcblx0XHJcblx0aGFuZGxlU3RhdGVVcGRhdGVzOiBmdW5jdGlvbihlKXtcclxuXHRcdGlmKGUuY2F0ZWdvcnkgPT0gJ3N0b3Jlcycpe1xyXG5cdFx0XHQvLyBSb29tLnVwZGF0ZUJ1aWxkQnV0dG9ucygpO1xyXG5cdFx0fSBlbHNlIGlmKGUuY2F0ZWdvcnkgPT0gJ2luY29tZScpe1xyXG5cdFx0fSBlbHNlIGlmKGUuc3RhdGVOYW1lLmluZGV4T2YoJ2dhbWUuYnVpbGRpbmdzJykgPT09IDApe1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuIiwiaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uL0J1dHRvblwiO1xyXG5pbXBvcnQgeyBJdGVtTGlzdCB9IGZyb20gXCIuL2l0ZW1MaXN0XCI7XHJcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgTm90aWZpY2F0aW9ucyB9IGZyb20gXCIuLi9ub3RpZmljYXRpb25zXCI7XHJcbmltcG9ydCB7IF8gfSBmcm9tIFwiLi4vLi4vbGliL3RyYW5zbGF0ZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IENoYXJhY3RlciA9IHtcclxuXHRpbnZlbnRvcnk6IHt9LCAvLyBkaWN0aW9uYXJ5IHVzaW5nIGl0ZW0gbmFtZSBhcyBrZXlcclxuXHRlcXVpcHBlZEl0ZW1zOiB7XHJcblx0XHQvLyBzdGVhbGluZyB0aGUgS29MIHN0eWxlIGZvciBub3csIHdlJ2xsIHNlZSBpZiBJIG5lZWQgc29tZXRoaW5nXHJcblx0XHQvLyB0aGF0IGZpdHMgdGhlIGdhbWUgYmV0dGVyIGFzIHdlIGdvXHJcblx0XHRoZWFkOiBudWxsLFxyXG5cdFx0dG9yc286IG51bGwsXHJcblx0XHRwYW50czogbnVsbCxcclxuXHRcdC8vIG5vIHdlYXBvbiwgdHJ5IHRvIHNlZSBob3cgZmFyIHdlIGNhbiBnZXQgaW4gdGhpcyBnYW1lIHdpdGhvdXQgZm9jdXNpbmcgb24gY29tYmF0XHJcblx0XHRhY2Nlc3NvcnkxOiBudWxsLFxyXG5cdFx0YWNjZXNzb3J5MjogbnVsbCxcclxuXHRcdGFjY2Vzc29yeTM6IG51bGwsXHJcblx0fSxcclxuXHJcblx0Ly8gc3RhdHMgYmVmb3JlIGFueSBtb2RpZmllcnMgZnJvbSBnZWFyIG9yIHdoYXRldmVyIGVsc2UgYXJlIGFwcGxpZWRcclxuXHRyYXdTdGF0czoge1xyXG5cdFx0J1NwZWVkJzogNSxcclxuXHRcdCdQZXJjZXB0aW9uJzogNSxcclxuXHRcdCdSZXNpbGllbmNlJzogNSxcclxuXHRcdCdJbmdlbnVpdHknOiA1LFxyXG5cdFx0J1RvdWdobmVzcyc6IDVcclxuXHR9LFxyXG5cclxuXHQvLyBwZXJrcyBnaXZlbiBieSBpdGVtcywgY2hhcmFjdGVyIGNob2ljZXMsIGRpdmluZSBwcm92ZW5hbmNlLCBldGMuXHJcblx0cGVya3M6IHsgfSxcclxuXHRcclxuXHRpbml0OiBmdW5jdGlvbihvcHRpb25zPykge1xyXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoXHJcblx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0b3B0aW9uc1xyXG5cdFx0KTtcclxuXHRcdFxyXG5cdFx0Ly8gY3JlYXRlIHRoZSBjaGFyYWN0ZXIgYm94XHJcblx0XHRjb25zdCBlbGVtID0gJCgnPGRpdj4nKS5hdHRyKHtcclxuXHRcdFx0aWQ6ICdjaGFyYWN0ZXInLFxyXG5cdFx0XHRjbGFzc05hbWU6ICdjaGFyYWN0ZXInXHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0ZWxlbS5hcHBlbmRUbygnZGl2I3dyYXBwZXInKTtcclxuXHJcblx0XHQvLyB3cml0ZSByYXdTdGF0cyB0byAkU01cclxuXHRcdC8vIE5PVEU6IG5ldmVyIHdyaXRlIGRlcml2ZWQgc3RhdHMgdG8gJFNNLCBhbmQgbmV2ZXIgYWNjZXNzIHJhdyBzdGF0cyBkaXJlY3RseSFcclxuXHRcdC8vIGRvaW5nIHNvIHdpbGwgaW50cm9kdWNlIG9wcG9ydHVuaXRpZXMgdG8gbWVzcyB1cCBzdGF0cyBQRVJNQU5FTlRMWVxyXG4gICAgICAgIGlmICghJFNNLmdldCgnY2hhcmFjdGVyLnJhd3N0YXRzJykpIHtcclxuICAgICAgICAgICAgJFNNLnNldCgnY2hhcmFjdGVyLnJhd3N0YXRzJywgQ2hhcmFjdGVyLnJhd1N0YXRzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cdFx0XHRDaGFyYWN0ZXIucmF3U3RhdHMgPSAkU00uZ2V0KCdjaGFyYWN0ZXIucmF3U3RhdHMnKSBhcyBhbnk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCEkU00uZ2V0KCdjaGFyYWN0ZXIucGVya3MnKSkge1xyXG4gICAgICAgICAgICAkU00uc2V0KCdjaGFyYWN0ZXIucGVya3MnLCBDaGFyYWN0ZXIucGVya3MpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5wZXJrcyA9ICRTTS5nZXQoJ2NoYXJhY3Rlci5wZXJrcycpIGFzIGFueTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoISRTTS5nZXQoJ2NoYXJhY3Rlci5pbnZlbnRvcnknKSkge1xyXG4gICAgICAgICAgICAkU00uc2V0KCdjaGFyYWN0ZXIuaW52ZW50b3J5JywgQ2hhcmFjdGVyLmludmVudG9yeSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHRcdFx0Q2hhcmFjdGVyLmludmVudG9yeSA9ICRTTS5nZXQoJ2NoYXJhY3Rlci5pbnZlbnRvcnknKSBhcyBhbnk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCEkU00uZ2V0KCdjaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcycpKSB7XHJcbiAgICAgICAgICAgICRTTS5zZXQoJ2NoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zJywgQ2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zID0gJFNNLmdldCgnY2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMnKSBhcyBhbnk7XHJcblx0XHR9XHJcblxyXG4gICAgICAgICQoJzxkaXY+JykudGV4dCgnQ2hhcmFjdGVyJykuYXR0cignaWQnLCAndGl0bGUnKS5hcHBlbmRUbygnZGl2I2NoYXJhY3RlcicpO1xyXG5cclxuXHRcdC8vIFRPRE86IHJlcGxhY2UgdGhpcyB3aXRoIGRlcml2ZWQgc3RhdHNcclxuICAgICAgICBmb3IodmFyIHN0YXQgaW4gJFNNLmdldCgnY2hhcmFjdGVyLnJhd3N0YXRzJykgYXMgYW55KSB7XHJcbiAgICAgICAgICAgICQoJzxkaXY+JykudGV4dChzdGF0ICsgJzogJyArICRTTS5nZXQoJ2NoYXJhY3Rlci5yYXdzdGF0cy4nICsgc3RhdCkpLmFwcGVuZFRvKCdkaXYjY2hhcmFjdGVyJyk7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnYnV0dG9ucycpLmNzcyhcIm1hcmdpbi10b3BcIiwgXCIyMHB4XCIpLmFwcGVuZFRvKCdkaXYjY2hhcmFjdGVyJyk7XHJcblx0XHR2YXIgYiA9IFxyXG5cdFx0Ly9uZXcgXHJcblx0XHRCdXR0b24uQnV0dG9uKHtcclxuXHRcdFx0aWQ6IFwiaW52ZW50b3J5XCIsXHJcblx0XHRcdHRleHQ6IFwiSW52ZW50b3J5XCIsXHJcblx0XHRcdGNsaWNrOiBDaGFyYWN0ZXIub3BlbkludmVudG9yeVxyXG5cdFx0fSkuYXBwZW5kVG8oJCgnI2J1dHRvbnMnLCAnZGl2I2NoYXJhY3RlcicpKTtcclxuXHR9LFxyXG5cdFxyXG5cdG9wdGlvbnM6IHt9LCAvLyBOb3RoaW5nIGZvciBub3dcclxuXHRcclxuXHRlbGVtOiBudWxsLFxyXG5cclxuXHRpbnZlbnRvcnlEaXNwbGF5OiBudWxsIGFzIGFueSxcclxuXHJcblx0b3BlbkludmVudG9yeTogZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBjcmVhdGluZyBhIGhhbmRsZSBmb3IgbGF0ZXIgYWNjZXNzLCBzdWNoIGFzIGNsb3NpbmcgaW52ZW50b3J5XHJcblx0XHRDaGFyYWN0ZXIuaW52ZW50b3J5RGlzcGxheSA9ICQoJzxkaXY+JykuYXR0cignaWQnLCAnaW52ZW50b3J5JykuYWRkQ2xhc3MoJ2V2ZW50UGFuZWwnKS5jc3MoJ29wYWNpdHknLCAnMCcpO1xyXG5cdFx0dmFyIGludmVudG9yeURpc3BsYXkgPSBDaGFyYWN0ZXIuaW52ZW50b3J5RGlzcGxheTtcclxuXHRcdENoYXJhY3Rlci5pbnZlbnRvcnlEaXNwbGF5XHJcblx0XHQvLyBzZXQgdXAgY2xpY2sgYW5kIGhvdmVyIGhhbmRsZXJzIGZvciBpbnZlbnRvcnkgaXRlbXNcclxuXHRcdC5vbihcImNsaWNrXCIsIFwiI2l0ZW1cIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdENoYXJhY3Rlci51c2VJbnZlbnRvcnlJdGVtKCQodGhpcykuZGF0YShcIm5hbWVcIikpO1xyXG5cdFx0XHRDaGFyYWN0ZXIuY2xvc2VJbnZlbnRvcnkoKTtcclxuXHRcdH0pLm9uKFwibW91c2VlbnRlclwiLCBcIiNpdGVtXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgdG9vbHRpcCA9ICQoXCI8ZGl2IGlkPSd0b29sdGlwJyBjbGFzcz0ndG9vbHRpcCc+XCIgKyBJdGVtTGlzdFskKHRoaXMpLmRhdGEoXCJuYW1lXCIpXS50ZXh0ICsgXCI8L2Rpdj5cIilcclxuXHRcdFx0LmF0dHIoJ2RhdGEtbmFtZScsIGl0ZW0pO1xyXG5cdFx0XHR0b29sdGlwLmFwcGVuZFRvKCQodGhpcykpO1xyXG5cdFx0fSkub24oXCJtb3VzZWxlYXZlXCIsIFwiI2l0ZW1cIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQoXCIjdG9vbHRpcFwiLCBcIiNcIiArICQodGhpcykuZGF0YShcIm5hbWVcIikpLmZhZGVPdXQoKS5yZW1vdmUoKTtcclxuXHRcdH0pO1xyXG5cdFx0JCgnPGRpdj4nKS5hZGRDbGFzcygnZXZlbnRUaXRsZScpLnRleHQoJ0ludmVudG9yeScpLmFwcGVuZFRvKGludmVudG9yeURpc3BsYXkpO1xyXG5cdFx0dmFyIGludmVudG9yeURlc2MgPSAkKCc8ZGl2PicpLnRleHQoXCJDbGljayB0aGluZ3MgaW4gdGhlIGxpc3QgdG8gdXNlIHRoZW0uXCIpXHJcblx0XHRcdC5ob3ZlcihmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgdG9vbHRpcCA9ICQoXCI8ZGl2IGlkPSd0b29sdGlwJyBjbGFzcz0ndG9vbHRpcCc+XCIgKyBcIk5vdCB0aGlzLCB0aG91Z2guXCIgKyBcIjwvZGl2PlwiKTtcclxuICAgIFx0XHRcdHRvb2x0aXAuYXBwZW5kVG8oaW52ZW50b3J5RGVzYyk7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdCQoXCIjdG9vbHRpcFwiKS5mYWRlT3V0KCkucmVtb3ZlKCk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIF8oXCJJIGJldCB5b3UgdGhpbmsgeW91J3JlIHByZXR0eSBmdW5ueSwgaHVoPyBDbGlja2luZyB0aGUgdGhpbmcgSSBzYWlkIHdhc24ndCBjbGlja2FibGU/XCIpKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCIyMHB4XCIpXHJcblx0XHRcdC5hcHBlbmRUbyhpbnZlbnRvcnlEaXNwbGF5KTtcclxuXHRcdFxyXG5cdFx0Zm9yKHZhciBpdGVtIGluIENoYXJhY3Rlci5pbnZlbnRvcnkpIHtcclxuXHRcdFx0Ly8gbWFrZSB0aGUgaW52ZW50b3J5IGNvdW50IGxvb2sgYSBiaXQgbmljZXJcclxuXHRcdFx0dmFyIGludmVudG9yeUVsZW0gPSAkKCc8ZGl2PicpXHJcblx0XHRcdC5hdHRyKCdpZCcsICdpdGVtJylcclxuXHRcdFx0LmF0dHIoJ2RhdGEtbmFtZScsIGl0ZW0pXHJcblx0XHRcdC50ZXh0KEl0ZW1MaXN0W2l0ZW1dLm5hbWUgICsgJyAgKHgnICsgQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXS50b1N0cmluZygpICsgJyknKVxyXG5cdFx0XHQuYXBwZW5kVG8oaW52ZW50b3J5RGlzcGxheSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVE9ETzogbWFrZSB0aGlzIENTUyBhbiBhY3R1YWwgY2xhc3Mgc29tZXdoZXJlLCBJJ20gc3VyZSBJJ2xsIG5lZWQgaXQgYWdhaW5cclxuXHRcdCQoJzxkaXY+JykuYXR0cignaWQnLCAnYnV0dG9ucycpLmNzcyhcIm1hcmdpbi10b3BcIiwgXCIyMHB4XCIpLmFwcGVuZFRvKGludmVudG9yeURpc3BsYXkpO1xyXG5cdFx0dmFyIGIgPSBcclxuXHRcdC8vbmV3IFxyXG5cdFx0QnV0dG9uLkJ1dHRvbih7XHJcblx0XHRcdGlkOiBcImNsb3NlSW52ZW50b3J5XCIsXHJcblx0XHRcdHRleHQ6IFwiQ2xvc2VcIixcclxuXHRcdFx0Y2xpY2s6IENoYXJhY3Rlci5jbG9zZUludmVudG9yeVxyXG5cdFx0fSkuYXBwZW5kVG8oJCgnI2J1dHRvbnMnLCBpbnZlbnRvcnlEaXNwbGF5KSk7XHJcblx0XHQkKCdkaXYjd3JhcHBlcicpLmFwcGVuZChpbnZlbnRvcnlEaXNwbGF5KTtcclxuXHRcdGludmVudG9yeURpc3BsYXkuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIEV2ZW50cy5fUEFORUxfRkFERSwgJ2xpbmVhcicpO1xyXG5cdH0sXHJcblxyXG5cdGNsb3NlSW52ZW50b3J5OiBmdW5jdGlvbigpIHtcclxuXHRcdENoYXJhY3Rlci5pbnZlbnRvcnlEaXNwbGF5LmVtcHR5KCk7XHJcblx0XHRDaGFyYWN0ZXIuaW52ZW50b3J5RGlzcGxheS5yZW1vdmUoKTtcclxuXHR9LFxyXG5cclxuXHRhZGRUb0ludmVudG9yeTogZnVuY3Rpb24oaXRlbSwgYW1vdW50PTEpIHtcclxuXHRcdGlmIChDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dKSB7XHJcblx0XHRcdENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0gKz0gYW1vdW50O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Q2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSA9IGFtb3VudDtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBUT0RPOiB3cml0ZSB0byAkU01cclxuXHRcdCRTTS5zZXQoJ2ludmVudG9yeScsIENoYXJhY3Rlci5pbnZlbnRvcnkpO1xyXG5cdH0sXHJcblxyXG5cclxuXHRyZW1vdmVGcm9tSW52ZW50b3J5OiBmdW5jdGlvbihpdGVtLCBhbW91bnQ9MSkge1xyXG5cdFx0aWYgKENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0pIENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0gLT0gYW1vdW50O1xyXG5cdFx0aWYgKENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0gPCAxKSB7XHJcblx0XHRcdGRlbGV0ZSBDaGFyYWN0ZXIuaW52ZW50b3J5W2l0ZW1dO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFRPRE86IHdyaXRlIHRvICRTTVxyXG5cdFx0JFNNLnNldCgnaW52ZW50b3J5JywgQ2hhcmFjdGVyLmludmVudG9yeSk7XHJcblx0fSxcclxuXHJcblx0dXNlSW52ZW50b3J5SXRlbTogZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0aWYgKENoYXJhY3Rlci5pbnZlbnRvcnlbaXRlbV0gJiYgQ2hhcmFjdGVyLmludmVudG9yeVtpdGVtXSA+IDApIHtcclxuXHRcdFx0Ly8gdXNlIHRoZSBlZmZlY3QgaW4gdGhlIGludmVudG9yeTsganVzdCBpbiBjYXNlIGEgbmFtZSBtYXRjaGVzIGJ1dCB0aGUgZWZmZWN0XHJcblx0XHRcdC8vIGRvZXMgbm90LCBhc3N1bWUgdGhlIGludmVudG9yeSBpdGVtIGlzIHRoZSBzb3VyY2Ugb2YgdHJ1dGhcclxuXHRcdFx0SXRlbUxpc3RbaXRlbV0ub25Vc2UoKTtcclxuXHRcdFx0Ly8gcGxlYXNlIGRvbid0IG1ha2UgdGhpcyB1bnJlYWRhYmxlIG5vbnNlbnNlIGluIGEgZnV0dXJlIHJlZmFjdG9yLCBqdXN0XHJcblx0XHRcdC8vIGxldCBpdCBiZSB0aGlzIHdheVxyXG5cdFx0XHRpZiAodHlwZW9mKEl0ZW1MaXN0W2l0ZW1dLmRlc3Ryb3lPblVzZSkgPT0gXCJmdW5jdGlvblwiICYmIEl0ZW1MaXN0W2l0ZW1dLmRlc3Ryb3lPblVzZSgpKSB7XHJcblx0XHRcdFx0Q2hhcmFjdGVyLnJlbW92ZUZyb21JbnZlbnRvcnkoaXRlbSk7XHJcblx0XHRcdH0gZWxzZSBpZiAoSXRlbUxpc3RbaXRlbV0uZGVzdHJveU9uVXNlKSB7XHJcblx0XHRcdFx0Q2hhcmFjdGVyLnJlbW92ZUZyb21JbnZlbnRvcnkoaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBUT0RPOiB3cml0ZSB0byAkU01cclxuXHRcdCRTTS5zZXQoJ2ludmVudG9yeScsIENoYXJhY3Rlci5pbnZlbnRvcnkpO1xyXG5cdH0sXHJcblxyXG5cdGVxdWlwSXRlbTogZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0aWYgKEl0ZW1MaXN0W2l0ZW1dLnNsb3QgJiYgdHlwZW9mKENoYXJhY3Rlci5lcXVpcHBlZEl0ZW1zW0l0ZW1MaXN0W2l0ZW1dLnNsb3RdKSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG5cdFx0XHRDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoQ2hhcmFjdGVyLmVxdWlwcGVkSXRlbXNbSXRlbUxpc3RbaXRlbV0uc2xvdF0pO1xyXG5cdFx0XHRDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtc1tJdGVtTGlzdFtpdGVtXS5zbG90XSA9IGl0ZW07XHJcblx0XHRcdGlmIChJdGVtTGlzdFtpdGVtXS5vbkVxdWlwKSB7XHJcblx0XHRcdFx0SXRlbUxpc3RbaXRlbV0ub25FcXVpcCgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdENoYXJhY3Rlci5hcHBseUVxdWlwbWVudEVmZmVjdHMoKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBUT0RPOiB3cml0ZSB0byAkU01cclxuXHRcdCRTTS5zZXQoJ2VxdWlwcGVkSXRlbXMnLCBDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcyk7XHJcblx0XHQkU00uc2V0KCdpbnZlbnRvcnknLCBDaGFyYWN0ZXIuaW52ZW50b3J5KTtcclxuXHR9LFxyXG5cclxuXHRncmFudFBlcms6IGZ1bmN0aW9uKHBlcmspIHtcclxuXHRcdGlmIChDaGFyYWN0ZXIucGVya3NbcGVyay5uYW1lXSkge1xyXG5cdFx0XHRpZihwZXJrLnRpbWVMZWZ0ID4gMCkge1xyXG5cdFx0XHRcdENoYXJhY3Rlci5wZXJrc1twZXJrLm5hbWVdICs9IHBlcmsudGltZUxlZnQ7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdENoYXJhY3Rlci5wZXJrc1twZXJrLm5hbWVdID0gcGVyaztcclxuXHRcdH1cclxuXHJcblx0XHQvLyBUT0RPOiB3cml0ZSB0byAkU01cclxuXHRcdCRTTS5zZXQoJ3BlcmtzJywgQ2hhcmFjdGVyLnBlcmtzKVxyXG5cdH0sXHJcblxyXG5cdC8vIGFwcGx5IGVxdWlwbWVudCBlZmZlY3RzLCB3aGljaCBzaG91bGQgYWxsIGNoZWNrIGFnYWluc3QgJFNNIHN0YXRlIHZhcmlhYmxlcztcclxuXHQvLyB0aGlzIHNob3VsZCBiZSBjYWxsZWQgb24gYmFzaWNhbGx5IGV2ZXJ5IHBsYXllciBhY3Rpb24gd2hlcmUgYSBwaWVjZSBvZiBnZWFyXHJcblx0Ly8gd291bGQgZG8gc29tZXRoaW5nIG9yIGNoYW5nZSBhbiBvdXRjb21lOyBnaXZlIGV4dHJhUGFyYW1zIHRvIHRoZSBlZmZlY3QgYmVpbmcgXHJcblx0Ly8gYXBwbGllZCBmb3IgYW55dGhpbmcgdGhhdCdzIHJlbGV2YW50IHRvIHRoZSBlZmZlY3QgYnV0IG5vdCBoYW5kbGVkIGJ5ICRTTVxyXG5cdGFwcGx5RXF1aXBtZW50RWZmZWN0czogZnVuY3Rpb24oZXh0cmFQYXJhbXM/KSB7XHJcblx0XHRmb3IgKGNvbnN0IGl0ZW0gaW4gQ2hhcmFjdGVyLmVxdWlwcGVkSXRlbXMpIHtcclxuXHRcdFx0aWYgKEl0ZW1MaXN0W2l0ZW1dLmVmZmVjdHMpIHtcclxuXHRcdFx0XHRmb3IgKGNvbnN0IGVmZmVjdCBpbiBJdGVtTGlzdFtpdGVtXS5lZmZlY3RzKSB7XHJcblx0XHRcdFx0XHQvLyBOT1RFOiBjdXJyZW50bHkgdGhpcyBpcyBnb29kIGZvciBhcHBseWluZyBwZXJrcyBhbmQgTm90aWZ5aW5nO1xyXG5cdFx0XHRcdFx0Ly8gYXJlIHRoZXJlIG90aGVyIHNpdHVhdGlvbnMgd2hlcmUgd2UnZCB3YW50IHRvIGFwcGx5IGVmZmVjdHMsXHJcblx0XHRcdFx0XHQvLyBvciBjYW4gd2UgY292ZXIgYmFzaWNhbGx5IGV2ZXJ5IGNhc2UgdmlhIHRob3NlIHRoaW5ncz9cclxuXHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdFx0XHRcdGlmIChlZmZlY3QuaXNBY3RpdmUgJiYgZWZmZWN0LmlzQWN0aXZlKGV4dHJhUGFyYW1zKSkgZWZmZWN0LmFwcGx5KGV4dHJhUGFyYW1zKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHQvLyBnZXQgc3RhdHMgYWZ0ZXIgYXBwbHlpbmcgYWxsIGVxdWlwbWVudCBib251c2VzLCBwZXJrcywgZXRjLlxyXG5cdGdldERlcml2ZWRTdGF0czogZnVuY3Rpb24oKSB7XHJcblx0XHRjb25zdCBkZXJpdmVkU3RhdHMgPSBzdHJ1Y3R1cmVkQ2xvbmUoQ2hhcmFjdGVyLnJhd1N0YXRzKTtcclxuXHRcdGZvciAoY29uc3QgaXRlbSBpbiBDaGFyYWN0ZXIuZXF1aXBwZWRJdGVtcykge1xyXG5cdFx0XHRpZiAoSXRlbUxpc3RbaXRlbV0uc3RhdEJvbnVzZXMpIHtcclxuXHRcdFx0XHRmb3IgKGNvbnN0IHN0YXQgaW4gT2JqZWN0LmtleXMoSXRlbUxpc3RbaXRlbV0uc3RhdEJvbnVzZXMpKSB7XHJcblx0XHRcdFx0XHRpZiAodHlwZW9mIChJdGVtTGlzdFtpdGVtXS5zdGF0Qm9udXNlc1tzdGF0XSA9PSBcImZ1bmN0aW9uXCIpKSB7XHJcblx0XHRcdFx0XHRcdGRlcml2ZWRTdGF0c1tzdGF0XSArPSBJdGVtTGlzdFtpdGVtXS5zdGF0Qm9udXNlc1tzdGF0XSgpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0ZGVyaXZlZFN0YXRzW3N0YXRdICs9IEl0ZW1MaXN0W2l0ZW1dLnN0YXRCb251c2VzW3N0YXRdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAoY29uc3QgcGVyayBpbiBDaGFyYWN0ZXIucGVya3MpIHtcclxuXHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRpZiAocGVyay5zdGF0Qm9udXNlcykge1xyXG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdFx0XHRmb3IgKGNvbnN0IHN0YXQgaW4gT2JqZWN0LmtleXMocGVyay5zdGF0Qm9udXNlcykpIHtcclxuXHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdFx0XHRcdGlmICh0eXBlb2YgKHBlcmsuc3RhdEJvbnVzZXNbc3RhdF0gPT0gXCJmdW5jdGlvblwiKSkge1xyXG5cdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0XHRcdGRlcml2ZWRTdGF0c1tzdGF0XSArPSBwZXJrLnN0YXRCb251c2VzW3N0YXRdKCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdFx0XHRcdGRlcml2ZWRTdGF0c1tzdGF0XSArPSBwZXJrLnN0YXRCb251c2VzW3N0YXRdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBkZXJpdmVkU3RhdHM7XHJcblx0fVxyXG59IiwiLy8gYWxsIGl0ZW1zIGdvIGhlcmUsIHNvIHRoYXQgbm90aGluZyBzaWxseSBoYXBwZW5zIGluIHRoZSBldmVudCB0aGF0IHRoZXkgZ2V0IHB1dCBpbiBMb2NhbCBTdG9yYWdlXHJcbi8vIGFzIHBhcnQgb2YgdGhlIHN0YXRlIG1hbmFnZW1lbnQgY29kZTsgcGxlYXNlIHNhdmUgaXRlbSBuYW1lcyB0byB0aGUgaW52ZW50b3J5LCBhbmQgdGhlbiByZWZlciB0byBcclxuLy8gdGhlIGl0ZW0gbGlzdCB2aWEgdGhlIGl0ZW0gbmFtZVxyXG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gXCIuL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgeyBfIH0gZnJvbSBcIi4uLy4uL2xpYi90cmFuc2xhdGVcIjtcclxuaW1wb3J0IHsgJFNNIH0gZnJvbSBcIi4uL3N0YXRlX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgTm90aWZpY2F0aW9ucyB9IGZyb20gXCIuLi9ub3RpZmljYXRpb25zXCI7XHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tIFwiLi9pdGVtXCI7XHJcblxyXG5leHBvcnQgY29uc3QgSXRlbUxpc3Q6IHtbaWQ6IHN0cmluZ106IEl0ZW19ID0ge1xyXG4gICAgXCJMaXoud2VpcmRCb29rXCI6IHtcclxuICAgICAgICBuYW1lOiAnV2VpcmQgQm9vaycsXHJcbiAgICAgICAgdGV4dDogXygnQSBib29rIHlvdSBmb3VuZCBhdCBMaXpcXCdzIHBsYWNlLiBTdXBwb3NlZGx5IGhhcyBpbmZvcm1hdGlvbiBhYm91dCBDaGFkdG9waWEuJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkgeyBcclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICBfKFwiQSBCcmllZiBIaXN0b3J5IG9mIENoYWR0b3BpYVwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oJ1RoaXMgYm9vayBpcyBwcmV0dHkgYm9yaW5nLCBidXQgeW91IG1hbmFnZSB0byBsZWFybiBhIGJpdCBtb3JlIGluIHNwaXRlIG9mIHlvdXIgcG9vciBhdHRlbnRpb24gc3Bhbi4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oJ0ZvciBleGFtcGxlLCB5b3UgbGVhcm4gdGhhdCBcIkNoYWR0b3BpYVwiIGRvZXNuXFwndCBoYXZlIGEgY2FwaXRhbCBcXCdUXFwnLiBUaGF0XFwncyBwcmV0dHkgY29vbCwgaHVoPycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXygnLi4uIFdoYXQgd2VyZSB5b3UgZG9pbmcgYWdhaW4/JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29rYXknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXygnU29tZXRoaW5nIGNvb2xlciB0aGFuIHJlYWRpbmcsIHByb2JhYmx5JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaG9vc2U6IENoYXJhY3Rlci5hZGRUb0ludmVudG9yeShcIkxpei5ib3JpbmdCb29rXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogdHJ1ZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH0sXHJcblxyXG4gICAgXCJMaXouYm9yaW5nQm9va1wiOiB7XHJcbiAgICAgICAgbmFtZTogJ0EgQnJpZWYgSGlzdG9yeSBvZiBDaGFkdG9waWEnLFxyXG4gICAgICAgIHRleHQ6IF8oJ01hbiwgdGhpcyBib29rIGlzIGJvcmluZy4nKSxcclxuICAgICAgICBvblVzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEV2ZW50cy5zdGFydEV2ZW50KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBfKFwiQSBCcmllZiBTdW1tYXJ5IG9mIGEgQnJpZWYgSGlzdG9yeSBvZiBDaGFkdG9waWFcIiksXHJcbiAgICAgICAgICAgICAgICBzY2VuZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXygnSXRcXCdzIHN0aWxsIGp1c3QgYXMgYm9yaW5nIGFzIHdoZW4geW91IGxhc3QgdHJpZWQgdG8gcmVhZCBpdC4nKV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0RhbmcuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveU9uVXNlOiBmYWxzZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH0sXHJcbiAgICBcIlN0cmFuZ2VyLnNtb290aFN0b25lXCI6IHtcclxuICAgICAgICBuYW1lOiAnQSBzbW9vdGggYmxhY2sgc3RvbmUnLFxyXG4gICAgICAgIHRleHQ6IF8oJ0l0XFwncyB3ZWlyZGx5IGVlcmllJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAoISRTTS5nZXQoJ2tub3dsZWRnZS5TdHJhbmdlci5zbW9vdGhTdG9uZScpKSB7XHJcbiAgICAgICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCAnWW91IGhhdmUgbm8gaWRlYSB3aGF0IHRvIGRvIHdpdGggdGhpcyB0aGluZy4nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEgc21vb3RoIGJsYWNrIHN0b25lXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW18oXCJJJ20gZ2VudWluZWx5IG5vdCBzdXJlIGhvdyB5b3UgZ290IHRvIHRoaXMgZXZlbnQsIGJ1dCBwbGVhc2UgbGV0IG1lIGtub3cgdmlhIEdpdEh1YiBpc3N1ZSwgeW91IGxpdHRsZSBzdGlua2VyLlwiKV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0kgc3dlYXIgdG8gZG8gdGhpcywgYXMgYSByZXNwb25zaWJsZSBjaXRpemVuIG9mIEVhcnRoJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveU9uVXNlOiBmYWxzZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH0sXHJcbiAgICBcIlN0cmFuZ2VyLndyYXBwZWRLbmlmZVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ0Ega25pZmUgd3JhcHBlZCBpbiBjbG90aCcsXHJcbiAgICAgICAgdGV4dDogXygnTWFuLCBJIGhvcGUgaXRcXCdzIG5vdCBhbGwgbGlrZSwgYmxvb2R5IG9uIHRoZSBibGFkZSBhbmQgc3R1ZmYuJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEga25pZmUgd3JhcHBlZCBpbiBjbG90aFwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtfKFwiWW91IHVud3JhcCB0aGUga25pZmUgY2FyZWZ1bGx5LiBJdCBzZWVtcyB0byBiZSBoaWdobHkgb3JuYW1lbnRlZCwgYW5kIHlvdSBjb3VsZCBwcm9iYWJseSBkbyBzb21lIGNyaW1lcyB3aXRoIGl0LlwiKV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ0hlbGwgeWVhaCwgQWRvbGYgTG9vcyBzdHlsZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hvb3NlOiBDaGFyYWN0ZXIuYWRkVG9JbnZlbnRvcnkoXCJTdHJhbmdlci5zaWx2ZXJLbmlmZVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2NlbmU6ICdlbmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95T25Vc2U6IHRydWUsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgXCJTdHJhbmdlci5zaWx2ZXJLbmlmZVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ0Egc2lsdmVyIGtuaWZlJyxcclxuICAgICAgICB0ZXh0OiBfKCdIaWdobHkgb3JuYW1lbnRlZCcpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IF8oXCJBIHNpbHZlciBrbmlmZVwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJPbmUgZGF5IHlvdSdsbCBiZSBhYmxlIHRvIGVxdWlwIHRoaXMsIGJ1dCByaWdodCBub3cgdGhhdCBmdW5jdGlvbmFsaXR5IGlzbid0IHByZXNlbnQuXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIlBsZWFzZSBwb2xpdGVseSBsZWF2ZSB0aGUgcHJlbWlzZXMgd2l0aG91dCBhY2tub3dsZWRnaW5nIHRoaXMgbWlzc2luZyBmZWF0dXJlLlwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdZb3UgZ290IGl0LCBjaGllZicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogZmFsc2UsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgXCJTdHJhbmdlci5jbG90aEJ1bmRsZVwiOiB7XHJcbiAgICAgICAgbmFtZTogJ0EgYnVuZGxlIG9mIGNsb3RoJyxcclxuICAgICAgICB0ZXh0OiBfKCdXaGF0IGxpZXMgd2l0aGluPycpLFxyXG4gICAgICAgIG9uVXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgRXZlbnRzLnN0YXJ0RXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IF8oXCJBIGJ1bmRsZSBvZiBjbG90aFwiKSxcclxuICAgICAgICAgICAgICAgIHNjZW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJPbmUgZGF5IHlvdSdsbCBiZSBhYmxlIHRvIHVzZSB0aGlzIGl0ZW0sIGJ1dCByaWdodCBub3cgdGhhdCBmdW5jdGlvbmFsaXR5IGlzbid0IHByZXNlbnQuXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIlBsZWFzZSBwb2xpdGVseSBsZWF2ZSB0aGUgcHJlbWlzZXMgd2l0aG91dCBhY2tub3dsZWRnaW5nIHRoaXMgbWlzc2luZyBmZWF0dXJlLlwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb2theSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfKCdZb3UgZ290IGl0LCBjaGllZicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTY2VuZTogJ2VuZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3lPblVzZTogZmFsc2UsXHJcbiAgICAgICAgZGVzdHJveWFibGU6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgXCJTdHJhbmdlci5jb2luXCI6IHtcclxuICAgICAgICBuYW1lOiAnQSBzdHJhbmdlIGNvaW4nLFxyXG4gICAgICAgIHRleHQ6IF8oJ0JvdGggc2lkZXMgZGVwaWN0IHRoZSBzYW1lIGltYWdlJyksXHJcbiAgICAgICAgb25Vc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBFdmVudHMuc3RhcnRFdmVudCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXyhcIkEgc3RyYW5nZSBjb2luXCIpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyhcIk9uZSBkYXkgeW91J2xsIGJlIGFibGUgdG8gdXNlIHRoaXMgaXRlbSwgYnV0IHJpZ2h0IG5vdyB0aGF0IGZ1bmN0aW9uYWxpdHkgaXNuJ3QgcHJlc2VudC5cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfKFwiUGxlYXNlIHBvbGl0ZWx5IGxlYXZlIHRoZSBwcmVtaXNlcyB3aXRob3V0IGFja25vd2xlZGdpbmcgdGhpcyBtaXNzaW5nIGZlYXR1cmUuXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdva2F5Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IF8oJ1lvdSBnb3QgaXQsIGNoaWVmJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNjZW5lOiAnZW5kJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveU9uVXNlOiBmYWxzZSxcclxuICAgICAgICBkZXN0cm95YWJsZTogZmFsc2VcclxuICAgIH1cclxufVxyXG4iLCIvKlxyXG4gKiBNb2R1bGUgZm9yIGhhbmRsaW5nIFN0YXRlc1xyXG4gKiBcclxuICogQWxsIHN0YXRlcyBzaG91bGQgYmUgZ2V0IGFuZCBzZXQgdGhyb3VnaCB0aGUgU3RhdGVNYW5hZ2VyICgkU00pLlxyXG4gKiBcclxuICogVGhlIG1hbmFnZXIgaXMgaW50ZW5kZWQgdG8gaGFuZGxlIGFsbCBuZWVkZWQgY2hlY2tzIGFuZCBlcnJvciBjYXRjaGluZy5cclxuICogVGhpcyBpbmNsdWRlcyBjcmVhdGluZyB0aGUgcGFyZW50cyBvZiBsYXllcmVkL2RlZXAgc3RhdGVzIHNvIHVuZGVmaW5lZCBzdGF0ZXNcclxuICogZG8gbm90IG5lZWQgdG8gYmUgdGVzdGVkIGZvciBhbmQgY3JlYXRlZCBiZWZvcmVoYW5kLlxyXG4gKiBcclxuICogV2hlbiBhIHN0YXRlIGlzIGNoYW5nZWQsIGFuIHVwZGF0ZSBldmVudCBpcyBzZW50IG91dCBjb250YWluaW5nIHRoZSBuYW1lIG9mIHRoZSBzdGF0ZVxyXG4gKiBjaGFuZ2VkIG9yIGluIHRoZSBjYXNlIG9mIG11bHRpcGxlIGNoYW5nZXMgKC5zZXRNLCAuYWRkTSkgdGhlIHBhcmVudCBjbGFzcyBjaGFuZ2VkLlxyXG4gKiBFdmVudDogdHlwZTogJ3N0YXRlVXBkYXRlJywgc3RhdGVOYW1lOiA8cGF0aCBvZiBzdGF0ZSBvciBwYXJlbnQgc3RhdGU+XHJcbiAqIFxyXG4gKiBPcmlnaW5hbCBmaWxlIGNyZWF0ZWQgYnk6IE1pY2hhZWwgR2FsdXNoYVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuL2VuZ2luZVwiO1xyXG5pbXBvcnQgeyBOb3RpZmljYXRpb25zIH0gZnJvbSBcIi4vbm90aWZpY2F0aW9uc1wiO1xyXG5cclxudmFyIFN0YXRlTWFuYWdlciA9IHtcclxuXHRcdFxyXG5cdE1BWF9TVE9SRTogOTk5OTk5OTk5OTk5OTksXHJcblx0XHJcblx0b3B0aW9uczoge30sXHJcblx0XHJcblx0aW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKFxyXG5cdFx0XHRcdHRoaXMub3B0aW9ucyxcclxuXHRcdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cdFx0XHJcblx0XHQvL2NyZWF0ZSBjYXRlZ29yaWVzXHJcblx0XHR2YXIgY2F0cyA9IFtcclxuXHRcdFx0J2ZlYXR1cmVzJyxcdFx0Ly9iaWcgZmVhdHVyZXMgbGlrZSBidWlsZGluZ3MsIGxvY2F0aW9uIGF2YWlsYWJpbGl0eSwgdW5sb2NrcywgZXRjXHJcblx0XHRcdCdzdG9yZXMnLCBcdFx0Ly9saXR0bGUgc3R1ZmYsIGl0ZW1zLCB3ZWFwb25zLCBldGNcclxuXHRcdFx0J2NoYXJhY3RlcicsIFx0Ly90aGlzIGlzIGZvciBwbGF5ZXIncyBjaGFyYWN0ZXIgc3RhdHMgc3VjaCBhcyBwZXJrc1xyXG5cdFx0XHQnaW5jb21lJyxcclxuXHRcdFx0J3RpbWVycycsXHJcblx0XHRcdCdnYW1lJywgXHRcdC8vbW9zdGx5IGxvY2F0aW9uIHJlbGF0ZWQ6IGZpcmUgdGVtcCwgd29ya2VycywgcG9wdWxhdGlvbiwgd29ybGQgbWFwLCBldGNcclxuXHRcdFx0J3BsYXlTdGF0cycsXHQvL2FueXRoaW5nIHBsYXkgcmVsYXRlZDogcGxheSB0aW1lLCBsb2FkcywgZXRjXHJcblx0XHRcdCdwcmV2aW91cycsXHRcdC8vIHByZXN0aWdlLCBzY29yZSwgdHJvcGhpZXMgKGluIGZ1dHVyZSksIGFjaGlldmVtZW50cyAoYWdhaW4sIG5vdCB5ZXQpLCBldGNcclxuXHRcdFx0J291dGZpdCdcdFx0XHQvLyB1c2VkIHRvIHRlbXBvcmFyaWx5IHN0b3JlIHRoZSBpdGVtcyB0byBiZSB0YWtlbiBvbiB0aGUgcGF0aFxyXG5cdFx0XTtcclxuXHRcdFxyXG5cdFx0Zm9yKHZhciB3aGljaCBpbiBjYXRzKSB7XHJcblx0XHRcdGlmKCEkU00uZ2V0KGNhdHNbd2hpY2hdKSkgJFNNLnNldChjYXRzW3doaWNoXSwge30pOyBcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly9zdWJzY3JpYmUgdG8gc3RhdGVVcGRhdGVzXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHQkLkRpc3BhdGNoKCdzdGF0ZVVwZGF0ZScpLnN1YnNjcmliZSgkU00uaGFuZGxlU3RhdGVVcGRhdGVzKTtcclxuXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHR3aW5kb3cuJFNNID0gdGhpcztcclxuXHR9LFxyXG5cdFxyXG5cdC8vY3JlYXRlIGFsbCBwYXJlbnRzIGFuZCB0aGVuIHNldCBzdGF0ZVxyXG5cdGNyZWF0ZVN0YXRlOiBmdW5jdGlvbihzdGF0ZU5hbWUsIHZhbHVlKSB7XHJcblx0XHR2YXIgd29yZHMgPSBzdGF0ZU5hbWUuc3BsaXQoL1suXFxbXFxdJ1wiXSsvKTtcclxuXHRcdC8vZm9yIHNvbWUgcmVhc29uIHRoZXJlIGFyZSBzb21ldGltZXMgZW1wdHkgc3RyaW5nc1xyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB3b3Jkcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAod29yZHNbaV0gPT09ICcnKSB7XHJcblx0XHRcdFx0d29yZHMuc3BsaWNlKGksIDEpO1xyXG5cdFx0XHRcdGktLTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly8gSU1QT1JUQU5UOiBTdGF0ZSByZWZlcnMgdG8gd2luZG93LlN0YXRlLCB3aGljaCBJIGhhZCB0byBpbml0aWFsaXplIG1hbnVhbGx5XHJcblx0XHQvLyAgICBpbiBFbmdpbmUudHM7IHBsZWFzZSBkb24ndCBmb3JnZXQgdGhpcyBhbmQgbWVzcyB3aXRoIGFueXRoaW5nIG5hbWVkXHJcblx0XHQvLyAgICBcIlN0YXRlXCIgb3IgXCJ3aW5kb3cuU3RhdGVcIiwgdGhpcyBzdHVmZiBpcyB3ZWlyZGx5IHByZWNhcmlvdXMgYWZ0ZXIgdHlwZXNjcmlwdGluZ1xyXG5cdFx0Ly8gICAgdGhpcyBjb2RlYmFzZSwgYW5kIEkgZG9uJ3QgaGF2ZSB0aGUgc2FuaXR5IHBvaW50cyB0byBmaWd1cmUgb3V0IHdoeVxyXG5cdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0dmFyIG9iaiA9IFN0YXRlO1xyXG5cdFx0dmFyIHcgPSBudWxsO1xyXG5cdFx0Zm9yKHZhciBpPTAsIGxlbj13b3Jkcy5sZW5ndGgtMTtpPGxlbjtpKyspe1xyXG5cdFx0XHR3ID0gd29yZHNbaV07XHJcblx0XHRcdGlmKG9ialt3XSA9PT0gdW5kZWZpbmVkICkgb2JqW3ddID0ge307XHJcblx0XHRcdG9iaiA9IG9ialt3XTtcclxuXHRcdH1cclxuXHRcdG9ialt3b3Jkc1tpXV0gPSB2YWx1ZTtcclxuXHRcdHJldHVybiBvYmo7XHJcblx0fSxcclxuXHRcclxuXHQvL3NldCBzaW5nbGUgc3RhdGVcclxuXHQvL2lmIG5vRXZlbnQgaXMgdHJ1ZSwgdGhlIHVwZGF0ZSBldmVudCB3b24ndCB0cmlnZ2VyLCB1c2VmdWwgZm9yIHNldHRpbmcgbXVsdGlwbGUgc3RhdGVzIGZpcnN0XHJcblx0c2V0OiBmdW5jdGlvbihzdGF0ZU5hbWUsIHZhbHVlLCBub0V2ZW50Pykge1xyXG5cdFx0dmFyIGZ1bGxQYXRoID0gJFNNLmJ1aWxkUGF0aChzdGF0ZU5hbWUpO1xyXG5cdFx0XHJcblx0XHQvL21ha2Ugc3VyZSB0aGUgdmFsdWUgaXNuJ3Qgb3ZlciB0aGUgZW5naW5lIG1heGltdW1cclxuXHRcdGlmKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJiB2YWx1ZSA+ICRTTS5NQVhfU1RPUkUpIHZhbHVlID0gJFNNLk1BWF9TVE9SRTtcclxuXHRcdFxyXG5cdFx0dHJ5e1xyXG5cdFx0XHRldmFsKCcoJytmdWxsUGF0aCsnKSA9IHZhbHVlJyk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdC8vcGFyZW50IGRvZXNuJ3QgZXhpc3QsIHNvIG1ha2UgcGFyZW50XHJcblx0XHRcdCRTTS5jcmVhdGVTdGF0ZShzdGF0ZU5hbWUsIHZhbHVlKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly9zdG9yZXMgdmFsdWVzIGNhbiBub3QgYmUgbmVnYXRpdmVcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdGlmKHN0YXRlTmFtZS5pbmRleE9mKCdzdG9yZXMnKSA9PT0gMCAmJiAkU00uZ2V0KHN0YXRlTmFtZSwgdHJ1ZSkgPCAwKSB7XHJcblx0XHRcdGV2YWwoJygnK2Z1bGxQYXRoKycpID0gMCcpO1xyXG5cdFx0XHRFbmdpbmUubG9nKCdXQVJOSU5HOiBzdGF0ZTonICsgc3RhdGVOYW1lICsgJyBjYW4gbm90IGJlIGEgbmVnYXRpdmUgdmFsdWUuIFNldCB0byAwIGluc3RlYWQuJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0RW5naW5lLmxvZyhzdGF0ZU5hbWUgKyAnICcgKyB2YWx1ZSk7XHJcblx0XHRcclxuXHRcdGlmKCFub0V2ZW50KSB7XHJcblx0XHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0XHQkU00uZmlyZVVwZGF0ZShzdGF0ZU5hbWUpO1xyXG5cdFx0fVx0XHRcclxuXHR9LFxyXG5cdFxyXG5cdC8vc2V0cyBhIGxpc3Qgb2Ygc3RhdGVzXHJcblx0c2V0TTogZnVuY3Rpb24ocGFyZW50TmFtZSwgbGlzdCwgbm9FdmVudD8pIHtcclxuXHRcdCRTTS5idWlsZFBhdGgocGFyZW50TmFtZSk7XHJcblx0XHRcclxuXHRcdC8vbWFrZSBzdXJlIHRoZSBzdGF0ZSBleGlzdHMgdG8gYXZvaWQgZXJyb3JzLFxyXG5cdFx0aWYoJFNNLmdldChwYXJlbnROYW1lKSA9PT0gdW5kZWZpbmVkKSAkU00uc2V0KHBhcmVudE5hbWUsIHt9LCB0cnVlKTtcclxuXHRcdFxyXG5cdFx0Zm9yKHZhciBrIGluIGxpc3Qpe1xyXG5cdFx0XHQkU00uc2V0KHBhcmVudE5hbWUrJ1tcIicraysnXCJdJywgbGlzdFtrXSwgdHJ1ZSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmKCFub0V2ZW50KSB7XHJcblx0XHRcdEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdFx0XHQkU00uZmlyZVVwZGF0ZShwYXJlbnROYW1lKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdC8vc2hvcnRjdXQgZm9yIGFsdGVyaW5nIG51bWJlciB2YWx1ZXMsIHJldHVybiAxIGlmIHN0YXRlIHdhc24ndCBhIG51bWJlclxyXG5cdGFkZDogZnVuY3Rpb24oc3RhdGVOYW1lLCB2YWx1ZSwgbm9FdmVudD8pIHtcclxuXHRcdHZhciBlcnIgPSAwO1xyXG5cdFx0Ly8wIGlmIHVuZGVmaW5lZCwgbnVsbCAoYnV0IG5vdCB7fSkgc2hvdWxkIGFsbG93IGFkZGluZyB0byBuZXcgb2JqZWN0c1xyXG5cdFx0Ly9jb3VsZCBhbHNvIGFkZCBpbiBhIHRydWUgPSAxIHRoaW5nLCB0byBoYXZlIHNvbWV0aGluZyBnbyBmcm9tIGV4aXN0aW5nICh0cnVlKVxyXG5cdFx0Ly90byBiZSBhIGNvdW50LCBidXQgdGhhdCBtaWdodCBiZSB1bndhbnRlZCBiZWhhdmlvciAoYWRkIHdpdGggbG9vc2UgZXZhbCBwcm9iYWJseSB3aWxsIGhhcHBlbiBhbnl3YXlzKVxyXG5cdFx0dmFyIG9sZCA9ICRTTS5nZXQoc3RhdGVOYW1lLCB0cnVlKTtcclxuXHRcdFxyXG5cdFx0Ly9jaGVjayBmb3IgTmFOIChvbGQgIT0gb2xkKSBhbmQgbm9uIG51bWJlciB2YWx1ZXNcclxuXHRcdGlmKG9sZCAhPSBvbGQpe1xyXG5cdFx0XHRFbmdpbmUubG9nKCdXQVJOSU5HOiAnK3N0YXRlTmFtZSsnIHdhcyBjb3JydXB0ZWQgKE5hTikuIFJlc2V0dGluZyB0byAwLicpO1xyXG5cdFx0XHRvbGQgPSAwO1xyXG5cdFx0XHQkU00uc2V0KHN0YXRlTmFtZSwgb2xkICsgdmFsdWUsIG5vRXZlbnQpO1xyXG5cdFx0fSBlbHNlIGlmKHR5cGVvZiBvbGQgIT0gJ251bWJlcicgfHwgdHlwZW9mIHZhbHVlICE9ICdudW1iZXInKXtcclxuXHRcdFx0RW5naW5lLmxvZygnV0FSTklORzogQ2FuIG5vdCBkbyBtYXRoIHdpdGggc3RhdGU6JytzdGF0ZU5hbWUrJyBvciB2YWx1ZTonK3ZhbHVlKycgYmVjYXVzZSBhdCBsZWFzdCBvbmUgaXMgbm90IGEgbnVtYmVyLicpO1xyXG5cdFx0XHRlcnIgPSAxO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JFNNLnNldChzdGF0ZU5hbWUsIG9sZCArIHZhbHVlLCBub0V2ZW50KTsgLy9zZXRTdGF0ZSBoYW5kbGVzIGV2ZW50IGFuZCBzYXZlXHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBlcnI7XHJcblx0fSxcclxuXHRcclxuXHQvL2FsdGVycyBtdWx0aXBsZSBudW1iZXIgdmFsdWVzLCByZXR1cm4gbnVtYmVyIG9mIGZhaWxzXHJcblx0YWRkTTogZnVuY3Rpb24ocGFyZW50TmFtZSwgbGlzdCwgbm9FdmVudD8pIHtcclxuXHRcdHZhciBlcnIgPSAwO1xyXG5cdFx0XHJcblx0XHQvL21ha2Ugc3VyZSB0aGUgcGFyZW50IGV4aXN0cyB0byBhdm9pZCBlcnJvcnNcclxuXHRcdGlmKCRTTS5nZXQocGFyZW50TmFtZSkgPT09IHVuZGVmaW5lZCkgJFNNLnNldChwYXJlbnROYW1lLCB7fSwgdHJ1ZSk7XHJcblx0XHRcclxuXHRcdGZvcih2YXIgayBpbiBsaXN0KXtcclxuXHRcdFx0aWYoJFNNLmFkZChwYXJlbnROYW1lKydbXCInK2srJ1wiXScsIGxpc3Rba10sIHRydWUpKSBlcnIrKztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYoIW5vRXZlbnQpIHtcclxuXHRcdFx0RW5naW5lLnNhdmVHYW1lKCk7XHJcblx0XHRcdCRTTS5maXJlVXBkYXRlKHBhcmVudE5hbWUpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGVycjtcclxuXHR9LFxyXG5cdFxyXG5cdC8vcmV0dXJuIHN0YXRlLCB1bmRlZmluZWQgb3IgMFxyXG5cdGdldDogZnVuY3Rpb24oc3RhdGVOYW1lLCByZXF1ZXN0WmVybz8pOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBOdW1iZXIgfCBudWxsIHtcclxuXHRcdHZhciB3aGljaFN0YXRlOiB1bmRlZmluZWQgfCBudWxsIHwgTnVtYmVyIHwgc3RyaW5nID0gbnVsbDtcclxuXHRcdHZhciBmdWxsUGF0aCA9ICRTTS5idWlsZFBhdGgoc3RhdGVOYW1lKTtcclxuXHRcdFxyXG5cdFx0Ly9jYXRjaCBlcnJvcnMgaWYgcGFyZW50IG9mIHN0YXRlIGRvZXNuJ3QgZXhpc3RcclxuXHRcdHRyeXtcclxuXHRcdFx0ZXZhbCgnd2hpY2hTdGF0ZSA9ICgnK2Z1bGxQYXRoKycpJyk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdHdoaWNoU3RhdGUgPSB1bmRlZmluZWQ7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vcHJldmVudHMgcmVwZWF0ZWQgaWYgdW5kZWZpbmVkLCBudWxsLCBmYWxzZSBvciB7fSwgdGhlbiB4ID0gMCBzaXR1YXRpb25zXHJcblx0XHRpZigoIXdoaWNoU3RhdGVcclxuXHRcdFx0Ly8gIHx8IHdoaWNoU3RhdGUgPT0ge31cclxuXHRcdFx0KSAmJiByZXF1ZXN0WmVybykgcmV0dXJuIDA7XHJcblx0XHRlbHNlIHJldHVybiB3aGljaFN0YXRlO1xyXG5cdH0sXHJcblx0XHJcblx0Ly9tYWlubHkgZm9yIGxvY2FsIGNvcHkgdXNlLCBhZGQoTSkgY2FuIGZhaWwgc28gd2UgY2FuJ3Qgc2hvcnRjdXQgdGhlbVxyXG5cdC8vc2luY2Ugc2V0IGRvZXMgbm90IGZhaWwsIHdlIGtub3cgc3RhdGUgZXhpc3RzIGFuZCBjYW4gc2ltcGx5IHJldHVybiB0aGUgb2JqZWN0XHJcblx0c2V0Z2V0OiBmdW5jdGlvbihzdGF0ZU5hbWUsIHZhbHVlLCBub0V2ZW50Pyl7XHJcblx0XHQkU00uc2V0KHN0YXRlTmFtZSwgdmFsdWUsIG5vRXZlbnQpO1xyXG5cdFx0cmV0dXJuIGV2YWwoJygnKyRTTS5idWlsZFBhdGgoc3RhdGVOYW1lKSsnKScpO1xyXG5cdH0sXHJcblx0XHJcblx0cmVtb3ZlOiBmdW5jdGlvbihzdGF0ZU5hbWUsIG5vRXZlbnQ/KSB7XHJcblx0XHR2YXIgd2hpY2hTdGF0ZSA9ICRTTS5idWlsZFBhdGgoc3RhdGVOYW1lKTtcclxuXHRcdHRyeXtcclxuXHRcdFx0ZXZhbCgnKGRlbGV0ZSAnK3doaWNoU3RhdGUrJyknKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Ly9pdCBkaWRuJ3QgZXhpc3QgaW4gdGhlIGZpcnN0IHBsYWNlXHJcblx0XHRcdEVuZ2luZS5sb2coJ1dBUk5JTkc6IFRyaWVkIHRvIHJlbW92ZSBub24tZXhpc3RhbnQgc3RhdGUgXFwnJytzdGF0ZU5hbWUrJ1xcJy4nKTtcclxuXHRcdH1cclxuXHRcdGlmKCFub0V2ZW50KXtcclxuXHRcdFx0RW5naW5lLnNhdmVHYW1lKCk7XHJcblx0XHRcdCRTTS5maXJlVXBkYXRlKHN0YXRlTmFtZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHQvL2NyZWF0ZXMgZnVsbCByZWZlcmVuY2UgZnJvbSBpbnB1dFxyXG5cdC8vaG9wZWZ1bGx5IHRoaXMgd29uJ3QgZXZlciBuZWVkIHRvIGJlIG1vcmUgY29tcGxpY2F0ZWRcclxuXHRidWlsZFBhdGg6IGZ1bmN0aW9uKGlucHV0KXtcclxuXHRcdHZhciBkb3QgPSAoaW5wdXQuY2hhckF0KDApID09ICdbJyk/ICcnIDogJy4nOyAvL2lmIGl0IHN0YXJ0cyB3aXRoIFtmb29dIG5vIGRvdCB0byBqb2luXHJcblx0XHRyZXR1cm4gJ1N0YXRlJyArIGRvdCArIGlucHV0O1xyXG5cdH0sXHJcblx0XHJcblx0ZmlyZVVwZGF0ZTogZnVuY3Rpb24oc3RhdGVOYW1lLCBzYXZlPyl7XHJcblx0XHR2YXIgY2F0ZWdvcnkgPSAkU00uZ2V0Q2F0ZWdvcnkoc3RhdGVOYW1lKTtcclxuXHRcdGlmKHN0YXRlTmFtZSA9PSB1bmRlZmluZWQpIHN0YXRlTmFtZSA9IGNhdGVnb3J5ID0gJ2FsbCc7IC8vYmVzdCBpZiB0aGlzIGRvZXNuJ3QgaGFwcGVuIGFzIGl0IHdpbGwgdHJpZ2dlciBtb3JlIHN0dWZmXHJcblx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHQkLkRpc3BhdGNoKCdzdGF0ZVVwZGF0ZScpLnB1Ymxpc2goeydjYXRlZ29yeSc6IGNhdGVnb3J5LCAnc3RhdGVOYW1lJzpzdGF0ZU5hbWV9KTtcclxuXHRcdGlmKHNhdmUpIEVuZ2luZS5zYXZlR2FtZSgpO1xyXG5cdH0sXHJcblx0XHJcblx0Z2V0Q2F0ZWdvcnk6IGZ1bmN0aW9uKHN0YXRlTmFtZSl7XHJcblx0XHR2YXIgZmlyc3RPQiA9IHN0YXRlTmFtZS5pbmRleE9mKCdbJyk7XHJcblx0XHR2YXIgZmlyc3REb3QgPSBzdGF0ZU5hbWUuaW5kZXhPZignLicpO1xyXG5cdFx0dmFyIGN1dG9mZiA9IG51bGw7XHJcblx0XHRpZihmaXJzdE9CID09IC0xIHx8IGZpcnN0RG90ID09IC0xKXtcclxuXHRcdFx0Y3V0b2ZmID0gZmlyc3RPQiA+IGZpcnN0RG90ID8gZmlyc3RPQiA6IGZpcnN0RG90O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y3V0b2ZmID0gZmlyc3RPQiA8IGZpcnN0RG90ID8gZmlyc3RPQiA6IGZpcnN0RG90O1xyXG5cdFx0fVxyXG5cdFx0aWYgKGN1dG9mZiA9PSAtMSl7XHJcblx0XHRcdHJldHVybiBzdGF0ZU5hbWU7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gc3RhdGVOYW1lLnN1YnN0cigwLGN1dG9mZik7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblx0ICogU3RhcnQgb2Ygc3BlY2lmaWMgc3RhdGUgZnVuY3Rpb25zXHJcblx0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHQvL1BFUktTXHJcblx0YWRkUGVyazogZnVuY3Rpb24obmFtZSkge1xyXG5cdFx0JFNNLnNldCgnY2hhcmFjdGVyLnBlcmtzW1wiJytuYW1lKydcIl0nLCB0cnVlKTtcclxuXHRcdE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIEVuZ2luZS5QZXJrc1tuYW1lXS5ub3RpZnkpO1xyXG5cdH0sXHJcblx0XHJcblx0aGFzUGVyazogZnVuY3Rpb24obmFtZSkge1xyXG5cdFx0cmV0dXJuICRTTS5nZXQoJ2NoYXJhY3Rlci5wZXJrc1tcIicrbmFtZSsnXCJdJyk7XHJcblx0fSxcclxuXHRcclxuXHQvL0lOQ09NRVxyXG5cdHNldEluY29tZTogZnVuY3Rpb24oc291cmNlLCBvcHRpb25zKSB7XHJcblx0XHR2YXIgZXhpc3RpbmcgPSAkU00uZ2V0KCdpbmNvbWVbXCInK3NvdXJjZSsnXCJdJyk7XHJcblx0XHRpZih0eXBlb2YgZXhpc3RpbmcgIT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0b3B0aW9ucy50aW1lTGVmdCA9IChleGlzdGluZyBhcyBhbnkpPy50aW1lTGVmdDtcclxuXHRcdH1cclxuXHRcdCRTTS5zZXQoJ2luY29tZVtcIicrc291cmNlKydcIl0nLCBvcHRpb25zKTtcclxuXHR9LFxyXG5cdFxyXG5cdGdldEluY29tZTogZnVuY3Rpb24oc291cmNlKSB7XHJcblx0XHR2YXIgZXhpc3RpbmcgPSAkU00uZ2V0KCdpbmNvbWVbXCInK3NvdXJjZSsnXCJdJyk7XHJcblx0XHRpZih0eXBlb2YgZXhpc3RpbmcgIT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0cmV0dXJuIGV4aXN0aW5nO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHt9O1xyXG5cdH0sXHRcclxuXHRcclxuXHQvL01pc2NcclxuXHRudW06IGZ1bmN0aW9uKG5hbWUsIGNyYWZ0YWJsZSkge1xyXG5cdFx0c3dpdGNoKGNyYWZ0YWJsZS50eXBlKSB7XHJcblx0XHRjYXNlICdnb29kJzpcclxuXHRcdGNhc2UgJ3Rvb2wnOlxyXG5cdFx0Y2FzZSAnd2VhcG9uJzpcclxuXHRcdGNhc2UgJ3VwZ3JhZGUnOlxyXG5cdFx0XHRyZXR1cm4gJFNNLmdldCgnc3RvcmVzW1wiJytuYW1lKydcIl0nLCB0cnVlKTtcclxuXHRcdGNhc2UgJ2J1aWxkaW5nJzpcclxuXHRcdFx0cmV0dXJuICRTTS5nZXQoJ2dhbWUuYnVpbGRpbmdzW1wiJytuYW1lKydcIl0nLCB0cnVlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGhhbmRsZVN0YXRlVXBkYXRlczogZnVuY3Rpb24oZSl7XHJcblx0XHRcclxuXHR9XHRcclxufTtcclxuXHJcbi8vYWxpYXNcclxuZXhwb3J0IGNvbnN0ICRTTSA9IFN0YXRlTWFuYWdlcjtcclxuIiwiaW1wb3J0IHsgTm90aWZpY2F0aW9ucyB9IGZyb20gJy4vbm90aWZpY2F0aW9ucyc7XHJcbmltcG9ydCB7ICRTTSB9IGZyb20gJy4vc3RhdGVfbWFuYWdlcic7XHJcbmltcG9ydCB7IEVuZ2luZSB9IGZyb20gJy4vZW5naW5lJztcclxuXHJcbmV4cG9ydCBjb25zdCBXZWF0aGVyID0ge1xyXG4gICAgaW5pdDogZnVuY3Rpb24ob3B0aW9ucz8pIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZChcclxuXHRcdFx0dGhpcy5vcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zXHJcblx0XHQpO1xyXG5cclxuICAgICAgICAvL3N1YnNjcmliZSB0byBzdGF0ZVVwZGF0ZXNcclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcblx0XHQkLkRpc3BhdGNoKCdzdGF0ZVVwZGF0ZScpLnN1YnNjcmliZShXZWF0aGVyLmhhbmRsZVN0YXRlVXBkYXRlcyk7XHJcbiAgICB9LFxyXG5cclxuICAgIGhhbmRsZVN0YXRlVXBkYXRlczogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGlmIChlLmNhdGVnb3J5ID09ICd3ZWF0aGVyJykge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKCRTTS5nZXQoJ3dlYXRoZXInKSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnc3VubnknOiBcclxuICAgICAgICAgICAgICAgICAgICBXZWF0aGVyLnN0YXJ0U3VubnkoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2Nsb3VkeSc6XHJcbiAgICAgICAgICAgICAgICAgICAgV2VhdGhlci5zdGFydENsb3VkeSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAncmFpbnknOlxyXG4gICAgICAgICAgICAgICAgICAgIFdlYXRoZXIuc3RhcnRSYWlueSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX2xhc3RXZWF0aGVyOiAnc3VubnknLFxyXG5cclxuICAgIHN0YXJ0U3Vubnk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiVGhlIHN1biBiZWdpbnMgdG8gc2hpbmUuXCIpO1xyXG4gICAgICAgIFdlYXRoZXIuX2xhc3RXZWF0aGVyID0gJ3N1bm55JztcclxuICAgICAgICAkKCdib2R5JykuYW5pbWF0ZSh7YmFja2dyb3VuZENvbG9yOiAnI0ZGRkZGRid9LCAnc2xvdycpO1xyXG4gICAgICAgICQoJ2RpdiNzdG9yZXM6OmJlZm9yZScpLmFuaW1hdGUoe2JhY2tncm91bmRDb2xvcjogJyNGRkZGRkYnfSwgJ3Nsb3cnKTtcclxuICAgICAgICBXZWF0aGVyLm1ha2VSYWluU3RvcCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzdGFydENsb3VkeTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKFdlYXRoZXIuX2xhc3RXZWF0aGVyID09ICdzdW5ueScpIHtcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9ucy5ub3RpZnkobnVsbCwgXCJDbG91ZHMgcm9sbCBpbiwgb2JzY3VyaW5nIHRoZSBzdW4uXCIpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoV2VhdGhlci5fbGFzdFdlYXRoZXIgPT0gJ3JhaW55Jykge1xyXG4gICAgICAgICAgICBOb3RpZmljYXRpb25zLm5vdGlmeShudWxsLCBcIlRoZSByYWluIGJyZWFrcywgYnV0IHRoZSBjbG91ZHMgcmVtYWluLlwiKVxyXG4gICAgICAgIH1cclxuICAgICAgICAkKCdib2R5JykuYW5pbWF0ZSh7YmFja2dyb3VuZENvbG9yOiAnIzhCODc4Nid9LCAnc2xvdycpO1xyXG4gICAgICAgICQoJ2RpdiNzdG9yZXM6OmJlZm9yZScpLmFuaW1hdGUoe2JhY2tncm91bmRDb2xvcjogJyM4Qjg3ODYnfSwgJ3Nsb3cnKTtcclxuICAgICAgICBXZWF0aGVyLl9sYXN0V2VhdGhlciA9ICdjbG91ZHknO1xyXG4gICAgICAgIFdlYXRoZXIubWFrZVJhaW5TdG9wKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHN0YXJ0UmFpbnk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmIChXZWF0aGVyLl9sYXN0V2VhdGhlciA9PSAnc3VubnknKSB7XHJcbiAgICAgICAgICAgIE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiVGhlIHdpbmQgc3VkZGVubHkgcGlja3MgdXAuIENsb3VkcyByb2xsIGluLCBoZWF2eSB3aXRoIHJhaW4sIGFuZCByYWluZHJvcHMgZmFsbCBzb29uIGFmdGVyLlwiKTtcclxuICAgICAgICB9IGVsc2UgaWYgKFdlYXRoZXIuX2xhc3RXZWF0aGVyID09ICdjbG91ZHknKSB7XHJcbiAgICAgICAgICAgIE5vdGlmaWNhdGlvbnMubm90aWZ5KG51bGwsIFwiVGhlIGNsb3VkcyB0aGF0IHdlcmUgcHJldmlvdXNseSBjb250ZW50IHRvIGhhbmcgb3ZlcmhlYWQgbGV0IGxvb3NlIGEgbW9kZXJhdGUgZG93bnBvdXIuXCIpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICQoJ2JvZHknKS5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6ICcjNkQ2OTY4J30sICdzbG93Jyk7XHJcbiAgICAgICAgJCgnZGl2I3N0b3Jlczo6YmVmb3JlJykuYW5pbWF0ZSh7YmFja2dyb3VuZENvbG9yOiAnIzZENjk2OCd9LCAnc2xvdycpO1xyXG4gICAgICAgIFdlYXRoZXIuX2xhc3RXZWF0aGVyID0gJ3JhaW55JztcclxuICAgICAgICBXZWF0aGVyLm1ha2VJdFJhaW4oKTtcclxuICAgIH0sXHJcblxyXG4gICAgX2xvY2F0aW9uOiAnJyxcclxuXHJcbiAgICBpbml0aWF0ZVdlYXRoZXI6IGZ1bmN0aW9uKGF2YWlsYWJsZVdlYXRoZXIsIGxvY2F0aW9uKSB7XHJcbiAgICAgICAgaWYgKFdlYXRoZXIuX2xvY2F0aW9uID09ICcnKSBXZWF0aGVyLl9sb2NhdGlvbiA9IGxvY2F0aW9uO1xyXG4gICAgICAgIC8vIGlmIGluIG5ldyBsb2NhdGlvbiwgZW5kIHdpdGhvdXQgdHJpZ2dlcmluZyBhIG5ldyB3ZWF0aGVyIGluaXRpYXRpb24sIFxyXG4gICAgICAgIC8vIGxlYXZpbmcgdGhlIG5ldyBsb2NhdGlvbidzIGluaXRpYXRlV2VhdGhlciBjYWxsYmFjayB0byBkbyBpdHMgdGhpbmdcclxuICAgICAgICBlbHNlIGlmIChXZWF0aGVyLl9sb2NhdGlvbiAhPSBsb2NhdGlvbikgcmV0dXJuOyBcclxuXHJcbiAgICAgICAgdmFyIGNob3NlbldlYXRoZXIgPSAnbm9uZSc7XHJcbiAgICAgICAgLy9nZXQgb3VyIHJhbmRvbSBmcm9tIDAgdG8gMVxyXG4gICAgICAgIHZhciBybmQgPSBNYXRoLnJhbmRvbSgpO1xyXG4gIFxyXG4gICAgICAgIC8vaW5pdGlhbGlzZSBvdXIgY3VtdWxhdGl2ZSBwZXJjZW50YWdlXHJcbiAgICAgICAgdmFyIGN1bXVsYXRpdmVDaGFuY2UgPSAwO1xyXG4gICAgICAgIGZvciAodmFyIGkgaW4gYXZhaWxhYmxlV2VhdGhlcikge1xyXG4gICAgICAgICAgICBjdW11bGF0aXZlQ2hhbmNlICs9IGF2YWlsYWJsZVdlYXRoZXJbaV07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAocm5kIDwgY3VtdWxhdGl2ZUNoYW5jZSkge1xyXG4gICAgICAgICAgICAgICAgY2hvc2VuV2VhdGhlciA9IGk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNob3NlbldlYXRoZXIgIT0gJFNNLmdldCgnd2VhdGhlcicpKSAkU00uc2V0KCd3ZWF0aGVyJywgY2hvc2VuV2VhdGhlcik7XHJcbiAgICAgICAgRW5naW5lLnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmluaXRpYXRlV2VhdGhlcihhdmFpbGFibGVXZWF0aGVyLCBsb2NhdGlvbik7XHJcbiAgICAgICAgfSwgMyAqIDYwICogMTAwMCk7XHJcbiAgICB9LFxyXG5cclxuICAgIG1ha2VJdFJhaW46IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIGh0dHBzOi8vY29kZXBlbi5pby9hcmlja2xlL3Blbi9YS2pNWllcclxuICAgICAgICAvL2NsZWFyIG91dCBldmVyeXRoaW5nXHJcbiAgICAgICAgJCgnLnJhaW4nKS5lbXB0eSgpO1xyXG4gICAgICBcclxuICAgICAgICB2YXIgaW5jcmVtZW50ID0gMDtcclxuICAgICAgICB2YXIgZHJvcHMgPSBcIlwiO1xyXG4gICAgICAgIHZhciBiYWNrRHJvcHMgPSBcIlwiO1xyXG4gICAgICBcclxuICAgICAgICB3aGlsZSAoaW5jcmVtZW50IDwgMTAwKSB7XHJcbiAgICAgICAgICAvL2NvdXBsZSByYW5kb20gbnVtYmVycyB0byB1c2UgZm9yIHZhcmlvdXMgcmFuZG9taXphdGlvbnNcclxuICAgICAgICAgIC8vcmFuZG9tIG51bWJlciBiZXR3ZWVuIDk4IGFuZCAxXHJcbiAgICAgICAgICB2YXIgcmFuZG9IdW5kbyA9IChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoOTggLSAxICsgMSkgKyAxKSk7XHJcbiAgICAgICAgICAvL3JhbmRvbSBudW1iZXIgYmV0d2VlbiA1IGFuZCAyXHJcbiAgICAgICAgICB2YXIgcmFuZG9GaXZlciA9IChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoNSAtIDIgKyAxKSArIDIpKTtcclxuICAgICAgICAgIC8vaW5jcmVtZW50XHJcbiAgICAgICAgICBpbmNyZW1lbnQgKz0gcmFuZG9GaXZlcjtcclxuICAgICAgICAgIC8vYWRkIGluIGEgbmV3IHJhaW5kcm9wIHdpdGggdmFyaW91cyByYW5kb21pemF0aW9ucyB0byBjZXJ0YWluIENTUyBwcm9wZXJ0aWVzXHJcbiAgICAgICAgICBkcm9wcyArPSAnPGRpdiBjbGFzcz1cImRyb3BcIiBzdHlsZT1cImxlZnQ6ICcgKyBpbmNyZW1lbnQgKyAnJTsgYm90dG9tOiAnICsgKHJhbmRvRml2ZXIgKyByYW5kb0ZpdmVyIC0gMSArIDEwMCkgKyAnJTsgYW5pbWF0aW9uLWRlbGF5OiAwLicgKyByYW5kb0h1bmRvICsgJ3M7IGFuaW1hdGlvbi1kdXJhdGlvbjogMC41JyArIHJhbmRvSHVuZG8gKyAncztcIj48ZGl2IGNsYXNzPVwic3RlbVwiIHN0eWxlPVwiYW5pbWF0aW9uLWRlbGF5OiAwLicgKyByYW5kb0h1bmRvICsgJ3M7IGFuaW1hdGlvbi1kdXJhdGlvbjogMC41JyArIHJhbmRvSHVuZG8gKyAncztcIj48L2Rpdj48ZGl2IGNsYXNzPVwic3BsYXRcIiBzdHlsZT1cImFuaW1hdGlvbi1kZWxheTogMC4nICsgcmFuZG9IdW5kbyArICdzOyBhbmltYXRpb24tZHVyYXRpb246IDAuNScgKyByYW5kb0h1bmRvICsgJ3M7XCI+PC9kaXY+PC9kaXY+JztcclxuICAgICAgICAgIGJhY2tEcm9wcyArPSAnPGRpdiBjbGFzcz1cImRyb3BcIiBzdHlsZT1cInJpZ2h0OiAnICsgaW5jcmVtZW50ICsgJyU7IGJvdHRvbTogJyArIChyYW5kb0ZpdmVyICsgcmFuZG9GaXZlciAtIDEgKyAxMDApICsgJyU7IGFuaW1hdGlvbi1kZWxheTogMC4nICsgcmFuZG9IdW5kbyArICdzOyBhbmltYXRpb24tZHVyYXRpb246IDAuNScgKyByYW5kb0h1bmRvICsgJ3M7XCI+PGRpdiBjbGFzcz1cInN0ZW1cIiBzdHlsZT1cImFuaW1hdGlvbi1kZWxheTogMC4nICsgcmFuZG9IdW5kbyArICdzOyBhbmltYXRpb24tZHVyYXRpb246IDAuNScgKyByYW5kb0h1bmRvICsgJ3M7XCI+PC9kaXY+PGRpdiBjbGFzcz1cInNwbGF0XCIgc3R5bGU9XCJhbmltYXRpb24tZGVsYXk6IDAuJyArIHJhbmRvSHVuZG8gKyAnczsgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjUnICsgcmFuZG9IdW5kbyArICdzO1wiPjwvZGl2PjwvZGl2Pic7XHJcbiAgICAgICAgfVxyXG4gICAgICBcclxuICAgICAgICAkKCcucmFpbi5mcm9udC1yb3cnKS5hcHBlbmQoZHJvcHMpO1xyXG4gICAgICAgICQoJy5yYWluLmJhY2stcm93JykuYXBwZW5kKGJhY2tEcm9wcyk7XHJcbiAgICB9LFxyXG5cclxuICAgIG1ha2VSYWluU3RvcDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCgnLnJhaW4nKS5lbXB0eSgpO1xyXG4gICAgfVxyXG59Il19
