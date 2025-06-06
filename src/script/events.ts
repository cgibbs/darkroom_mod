/**
 * Module that handles the random event system
 */
import { EventsRoadWander } from "./events/roadwander";
import { Engine } from "./engine";
import { _ } from "../lib/translate";
import { $SM } from "./state_manager";
import { Notifications } from "./notifications";
import { Button } from "./Button";

export interface ADREvent {
	title: string,
	isAvailable?: Function,
	isSuperLikely?: Function,
	scenes: {
		// type this out better using Index Signatures
		[id: string]: Scene
	},
	eventPanel?: any
}

export interface Scene {
	seenFlag?: Function,
	nextScene?: string,
	onLoad?: Function,
	text: Array<string> | Function,
	reward?: any,
	notification?: string,
	blink?: boolean,
	dice?: {
		amount: number,
		dieFaces?: { [id: number]: string }
		// do game engine stuff, then return text description
		handler: (vals) => Array<string>
	},
	buttons: {
		[id: string]: EventButton
	}
}

export interface EventButton {
	text: string | Function,
	nextScene: {
		[id: number]: string
	},
	available?: Function,
	visible?: Function,
	reward?: any,
	cost?: any,
	notification?: string,
	onChoose?: Function
}

export const Events = {
		
	_EVENT_TIME_RANGE: [3, 6], // range, in minutes
	_PANEL_FADE: 200,
	BLINK_INTERVAL: false,

	EventPool: <any>[],
	eventStack: <any>[],
	_eventTimeout: 0,

	Locations: {},

	init: function(options?) {
		this.options = $.extend(
			this.options,
			options
		);
		
		// Build the Event Pool
		Events.EventPool = [].concat(
			EventsRoadWander as any
		);

		this.Locations["RoadWander"] = EventsRoadWander;
		
		Events.eventStack = [];
		
		//subscribe to stateUpdates
		// @ts-ignore
		$.Dispatch('stateUpdate').subscribe(Events.handleStateUpdates);
	},
	
	options: {}, // Nothing for now
    
	activeScene: '',
    
	loadScene: function(name) {
		Engine.log('loading scene: ' + name);
		Events.activeScene = name;
		var scene = Events.activeEvent()?.scenes[name];
		
		// handles one-time scenes, such as introductions
		// maybe I can make a more explicit "introduction" logical flow to make this
		// a little more elegant, given that there will always be an "introduction" scene
		// that's only meant to be run a single time.
		if (scene.seenFlag && scene.seenFlag()) {
			Events.loadScene(scene.nextScene)
			return;
		}

		// Scene reward
		if(scene.reward) {
			$SM.addM('stores', scene.reward);
		}
		
		// onLoad
		if(scene.onLoad) {
			scene.onLoad();
		}
		
		// Notify the scene change
		if(scene.notification) {
			Notifications.notify(null, scene.notification);
		}
		
		$('#description', Events.eventPanel()).empty();
		$('#buttons', Events.eventPanel()).empty();
		Events.startStory(scene);
	},
	
	drawFloatText: function(text, parent) {
		$('<div>').text(text).addClass('damageText').appendTo(parent).animate({
			'bottom': '50px',
			'opacity': '0'
		},
		300,
		'linear',
		function() {
			$(this).remove();
		});
	},

	// for dice stuff
	getRandomInt:function (max) {
  		return Math.floor(Math.random() * max);
	},
	
	startStory: function(scene) {
		// Write the text
		var desc = $('#description', Events.eventPanel());
		var textBlock = [];
		if (typeof(scene.text) == 'function') {
			textBlock = scene.text();
		} else {
			textBlock = scene.text;
		}
		for(var i in textBlock) {
			$('<div>').text(textBlock[i]).appendTo(desc);
		}

		// this dice stuff could maybe be extracted to its own function,
		// but also we might just make it way more generic so you can
		// throw ANYTHING in the Event description dynamically
		const diceVals = [];
		if (scene.dice !== undefined) {
			for(var j = 0; j < scene.dice.amount; j++) {
				var dieVal = this.getRandomInt(6) + 1;
				diceVals.push(dieVal);
				if (scene.dice.dieFaces && scene.dice.dieFaces[dieVal] !== undefined) {
					dieVal = scene.dice.dieFaces[dieVal];
				}
				const tiltVal = this.getRandomInt(90) - 45;
				const marginVal = (this.getRandomInt(4) + 2) * 5;
				desc.append(
					$('<img>',{id:'die' + dieVal.toString() ,src:'assets/die/die' + dieVal.toString() + '.png'})
					.css('width', '5%')
					.css('height', 'auto')
					.css({
						"-webkit-transform": "rotate(" + tiltVal.toString() + "deg)",
						"-moz-transform": "rotate(" + tiltVal.toString() + "deg)",
						"transform": "rotate(" + tiltVal.toString() + "deg)"
						}
					)
					.css('margin-right', marginVal.toString() + 'px')
					.css('margin-bottom', '20px')
				);
			}

			const textVals: Array<string> = scene.dice.handler(diceVals);
			for (const text in textVals) {
				$('<div>').text(textVals[text]).appendTo(desc);
			}
		}
		
		if(scene.textarea != null) {
			var ta = $('<textarea>').val(scene.textarea).appendTo(desc);
			if(scene.readonly) {
				// @ts-ignore
				ta.attr('readonly', true);
			}
		}
		
		// Draw the buttons
		Events.drawButtons(scene);
	},
	
	drawButtons: function(scene) {
		var btns = $('#buttons', Events.eventPanel());
		for(var id in scene.buttons) {
			var info = scene.buttons[id];
			var text = '';
			if (typeof(info.text) == 'function') {
				text = info.text();
			} else {
				text = info.text;
			}
			var b = Button.Button({
				id: id,
				text: text,
				cost: info.cost,
				click: Events.buttonClick,
				cooldown: info.cooldown,
				image: info.image
			}).appendTo(btns);
			if(typeof info.available == 'function' && !info.available()) {
				Button.setDisabled(b, true);
			}
			if(typeof info.visible == 'function' && !info.visible()) {
				b.hide();
			}
			if(typeof info.cooldown == 'number') {
				Button.cooldown(b);
			}
		}
		
		Events.updateButtons();
	},
	
	updateButtons: function() {
		var btns = Events.activeEvent()?.scenes[Events.activeScene].buttons;
		for(var bId in btns) {
			var b = btns[bId];
			var btnEl = $('#'+bId, Events.eventPanel());
			if(typeof b.available == 'function' && !b.available()) {
				Button.setDisabled(btnEl, true);
			}
		}
	},
	
	buttonClick: function(btn) {
		var info = Events.activeEvent()?.scenes[Events.activeScene].buttons[btn.attr('id')];

		if(typeof info.onChoose == 'function') {
			var textarea = Events.eventPanel().find('textarea');
			info.onChoose(textarea.length > 0 ? textarea.val() : null);
		}
		
		// Reward
		if(info.reward) {
			$SM.addM('stores', info.reward);
		}
		
		Events.updateButtons();
		
		// Notification
		if(info.notification) {
			Notifications.notify(null, info.notification);
		}
		
		// Next Scene
		if(info.nextScene) {
			if(info.nextScene == 'end') {
				Events.endEvent();
			} else {
				var r = Math.random();
				var lowestMatch: null | string = null;
				for(var i in info.nextScene) {
					if(r < (i as unknown as number) && (lowestMatch == null || i < lowestMatch)) {
						lowestMatch = i;
					}
				}
				if(lowestMatch != null) {
					Events.loadScene(info.nextScene[lowestMatch]);
					return;
				}
				Engine.log('ERROR: no suitable scene found');
				Events.endEvent();
			}
		}
	},

	// blinks the browser window title
	blinkTitle: function() {
		var title = document.title;

		// every 3 seconds change title to '*** EVENT ***', then 1.5 seconds later, change it back to the original title.
		// @ts-ignore
		Events.BLINK_INTERVAL = setInterval(function() {
			document.title = _('*** EVENT ***');
			Engine.setTimeout(function() {document.title = title;}, 1500, true); 
		}, 3000);
	},

	stopTitleBlink: function() {
		// @ts-ignore
		clearInterval(Events.BLINK_INTERVAL);
		Events.BLINK_INTERVAL = false;
	},
	
	// Makes an event happen!
	triggerEvent: function() {
		if(Events.activeEvent() == null) {
			var possibleEvents = [];
			for(var i in Events.EventPool) {
				var event = Events.EventPool[i];
				if(event.isAvailable()) {
					// @ts-ignore
					possibleEvents.push(event);
				}
			}

			if(possibleEvents.length === 0) {
				Events.scheduleNextEvent(0.5);
				return;
			} else {
				var r = Math.floor(Math.random()*(possibleEvents.length));
				Events.startEvent(possibleEvents[r]);
			}
		}

		Events.scheduleNextEvent();
	},

	// not scheduled, this is for stuff like location-based random events on a button click
	triggerLocationEvent: function(location) {
		if (this.Locations[location]) {
			if(Events.activeEvent() == null) {
				var possibleEvents: Array<any> = [];
				for(var i in this.Locations[location]) {
					var event = this.Locations[location][i];
					if(event.isAvailable()) {
						if(typeof(event.isSuperLikely) == 'function' && event.isSuperLikely()) {
							// SuperLikely event, do this and skip the random choice
							Engine.log('superLikely detected');
							Events.startEvent(event);
							return;
						}
						possibleEvents.push(event);
					}
				}
	
				if(possibleEvents.length === 0) {
					// Events.scheduleNextEvent(0.5);
					return;
				} else {
					var r = Math.floor(Math.random()*(possibleEvents.length));
					Events.startEvent(possibleEvents[r]);
				}
			}
		}
	},
	
	activeEvent: function(): ADREvent | null {
		if(Events.eventStack && Events.eventStack.length > 0) {
			return Events.eventStack[0];
		}
		return null;
	},
	
	eventPanel: function() {
		return Events.activeEvent()?.eventPanel;
	},

	startEvent: function(event: ADREvent, options?) {
		if(event) {
			Events.eventStack.unshift(event);
			event.eventPanel = $('<div>').attr('id', 'event').addClass('eventPanel').css('opacity', '0');
			if(options != null && options.width != null) {
				Events.eventPanel().css('width', options.width);
			}
			$('<div>').addClass('eventTitle').text(Events.activeEvent()?.title as string).appendTo(Events.eventPanel());
			$('<div>').attr('id', 'description').appendTo(Events.eventPanel());
			$('<div>').attr('id', 'buttons').appendTo(Events.eventPanel());
			Events.loadScene('start');
			$('div#wrapper').append(Events.eventPanel());
			Events.eventPanel().animate({opacity: 1}, Events._PANEL_FADE, 'linear');
			var currentSceneInformation = Events.activeEvent()?.scenes[Events.activeScene];
			if (currentSceneInformation.blink) {
				Events.blinkTitle();
			}
		}
	},

	scheduleNextEvent: function(scale?) {
		var nextEvent = Math.floor(Math.random()*(Events._EVENT_TIME_RANGE[1] - Events._EVENT_TIME_RANGE[0])) + Events._EVENT_TIME_RANGE[0];
		if(scale > 0) { nextEvent *= scale; }
		Engine.log('next event scheduled in ' + nextEvent + ' minutes');
		Events._eventTimeout = Engine.setTimeout(Events.triggerEvent, nextEvent * 60 * 1000);
	},

	endEvent: function() {
		Events.eventPanel().animate({opacity:0}, Events._PANEL_FADE, 'linear', function() {
			Events.eventPanel().remove();
			const activeEvent = Events.activeEvent();
			if (activeEvent !== null) activeEvent.eventPanel = null;
			Events.eventStack.shift();
			Engine.log(Events.eventStack.length + ' events remaining');
			if (Events.BLINK_INTERVAL) {
				Events.stopTitleBlink();
			}
			// Force refocus on the body. I hate you, IE.
			$('body').focus();
		});
	},

	handleStateUpdates: function(e){
		if((e.category == 'stores' || e.category == 'income') && Events.activeEvent() != null){
			Events.updateButtons();
		}
	}
};
