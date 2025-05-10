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

import { Engine } from "./engine";
import { Notifications } from "./notifications";

var StateManager = {
		
	MAX_STORE: 99999999999999,
	
	options: {},
	
	init: function(options?) {
		this.options = $.extend(
				this.options,
				options
		);
		
		//create categories
		var cats = [
			'features',		//big features like buildings, location availability, unlocks, etc
			'stores', 		//little stuff, items, weapons, etc
			'character', 	//this is for player's character stats such as perks
			'income',
			'timers',
			'game', 		//mostly location related: fire temp, workers, population, world map, etc
			'playStats',	//anything play related: play time, loads, etc
			'previous',		// prestige, score, trophies (in future), achievements (again, not yet), etc
			'outfit'			// used to temporarily store the items to be taken on the path
		];
		
		for(var which in cats) {
			if(!$SM.get(cats[which])) $SM.set(cats[which], {}); 
		}
		
		//subscribe to stateUpdates
		// @ts-ignore
		$.Dispatch('stateUpdate').subscribe($SM.handleStateUpdates);

		// @ts-ignore
		window.$SM = this;
	},
	
	//create all parents and then set state
	createState: function(stateName, value) {
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
		for(var i=0, len=words.length-1;i<len;i++){
			w = words[i];
			if(obj[w] === undefined ) obj[w] = {};
			obj = obj[w];
		}
		obj[words[i]] = value;
		return obj;
	},
	
	//set single state
	//if noEvent is true, the update event won't trigger, useful for setting multiple states first
	set: function(stateName, value, noEvent?) {
		var fullPath = $SM.buildPath(stateName);
		
		//make sure the value isn't over the engine maximum
		if(typeof value == 'number' && value > $SM.MAX_STORE) value = $SM.MAX_STORE;
		
		try{
			eval('('+fullPath+') = value');
		} catch (e) {
			//parent doesn't exist, so make parent
			$SM.createState(stateName, value);
		}
		
		//stores values can not be negative
		// @ts-ignore
		if(stateName.indexOf('stores') === 0 && $SM.get(stateName, true) < 0) {
			eval('('+fullPath+') = 0');
			Engine.log('WARNING: state:' + stateName + ' can not be a negative value. Set to 0 instead.');
		}

		Engine.log(stateName + ' ' + value);
		
		if (typeof(noEvent) == "undefined" || noEvent == true) {
			Engine.saveGame();
			$SM.fireUpdate(stateName);
		}		
	},
	
	//sets a list of states
	setM: function(parentName, list, noEvent?) {
		$SM.buildPath(parentName);
		
		//make sure the state exists to avoid errors,
		if($SM.get(parentName) === undefined) $SM.set(parentName, {}, true);
		
		for(var k in list){
			$SM.set(parentName+'["'+k+'"]', list[k], true);
		}
		
		if(!noEvent) {
			Engine.saveGame();
			$SM.fireUpdate(parentName);
		}
	},
	
	//shortcut for altering number values, return 1 if state wasn't a number
	add: function(stateName, value, noEvent?) {
		var err = 0;
		//0 if undefined, null (but not {}) should allow adding to new objects
		//could also add in a true = 1 thing, to have something go from existing (true)
		//to be a count, but that might be unwanted behavior (add with loose eval probably will happen anyways)
		var old = $SM.get(stateName, true);
		
		//check for NaN (old != old) and non number values
		if(old != old){
			Engine.log('WARNING: '+stateName+' was corrupted (NaN). Resetting to 0.');
			old = 0;
			$SM.set(stateName, old + value, noEvent);
		} else if(typeof old != 'number' || typeof value != 'number'){
			Engine.log('WARNING: Can not do math with state:'+stateName+' or value:'+value+' because at least one is not a number.');
			err = 1;
		} else {
			$SM.set(stateName, old + value, noEvent); //setState handles event and save
		}
		
		return err;
	},
	
	//alters multiple number values, return number of fails
	addM: function(parentName, list, noEvent?) {
		var err = 0;
		
		//make sure the parent exists to avoid errors
		if($SM.get(parentName) === undefined) $SM.set(parentName, {}, true);
		
		for(var k in list){
			if($SM.add(parentName+'["'+k+'"]', list[k], true)) err++;
		}
		
		if(!noEvent) {
			Engine.saveGame();
			$SM.fireUpdate(parentName);
		}
		return err;
	},
	
	//return state, undefined or 0
	get: function(stateName, requestZero?): string | undefined | Number | null | Boolean {
		var whichState: undefined | null | Number | string = null;
		var fullPath = $SM.buildPath(stateName);
		
		//catch errors if parent of state doesn't exist
		try{
			eval('whichState = ('+fullPath+')');
		} catch (e) {
			whichState = undefined;
		}
		
		//prevents repeated if undefined, null, false or {}, then x = 0 situations
		if((!whichState
			//  || whichState == {}
			) && requestZero) return 0;
		else return whichState;
	},
	
	//mainly for local copy use, add(M) can fail so we can't shortcut them
	//since set does not fail, we know state exists and can simply return the object
	setget: function(stateName, value, noEvent?){
		$SM.set(stateName, value, noEvent);
		return eval('('+$SM.buildPath(stateName)+')');
	},
	
	remove: function(stateName, noEvent?) {
		var whichState = $SM.buildPath(stateName);
		try{
			eval('(delete '+whichState+')');
		} catch (e) {
			//it didn't exist in the first place
			Engine.log('WARNING: Tried to remove non-existant state \''+stateName+'\'.');
		}
		if(!noEvent){
			Engine.saveGame();
			$SM.fireUpdate(stateName);
		}
	},
	
	//creates full reference from input
	//hopefully this won't ever need to be more complicated
	buildPath: function(input){
		var dot = (input.charAt(0) == '[')? '' : '.'; //if it starts with [foo] no dot to join
		return 'State' + dot + input;
	},
	
	fireUpdate: function(stateName, save?){
		var category = $SM.getCategory(stateName);
		if(stateName == undefined) stateName = category = 'all'; //best if this doesn't happen as it will trigger more stuff
		// @ts-ignore
		$.Dispatch('stateUpdate').publish({'category': category, 'stateName':stateName});
		if(save) Engine.saveGame();
	},
	
	getCategory: function(stateName){
		var firstOB = stateName.indexOf('[');
		var firstDot = stateName.indexOf('.');
		var cutoff = null;
		if(firstOB == -1 || firstDot == -1){
			cutoff = firstOB > firstDot ? firstOB : firstDot;
		} else {
			cutoff = firstOB < firstDot ? firstOB : firstDot;
		}
		if (cutoff == -1){
			return stateName;
		} else {
			return stateName.substr(0,cutoff);
		}
	},
	
	/******************************************************************
	 * Start of specific state functions
	 ******************************************************************/
	//PERKS
	addPerk: function(name) {
		$SM.set('character.perks["'+name+'"]', true);
		Notifications.notify(null, Engine.Perks[name].notify);
	},
	
	hasPerk: function(name) {
		return $SM.get('character.perks["'+name+'"]');
	},
	
	//INCOME
	setIncome: function(source, options) {
		var existing = $SM.get('income["'+source+'"]');
		if(typeof existing != 'undefined') {
			options.timeLeft = (existing as any)?.timeLeft;
		}
		$SM.set('income["'+source+'"]', options);
	},
	
	getIncome: function(source) {
		var existing = $SM.get('income["'+source+'"]');
		if(typeof existing != 'undefined') {
			return existing;
		}
		return {};
	},	
	
	//Misc
	num: function(name, craftable) {
		switch(craftable.type) {
		case 'good':
		case 'tool':
		case 'weapon':
		case 'upgrade':
			return $SM.get('stores["'+name+'"]', true);
		case 'building':
			return $SM.get('game.buildings["'+name+'"]', true);
		}
	},
	
	handleStateUpdates: function(e){
		
	}	
};

//alias
export const $SM = StateManager;
