// @ts-nocheck

import { _ } from "../lib/translate";
import { $SM } from "./state_manager";
import { Notifications } from "./notifications";
import { Events } from "./events";
import { Village } from "./places/village";
import { Character } from "./player/character";
import { Weather } from "./weather";
import { Road } from "./places/road";
import { Outpost } from "./places/outpost";

export const Engine = window.Engine = {
	
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
		
	init: function(options?) {
		this.options = $.extend(
			this.options,
			options
		);
		this._debug = this.options.debug;
		this._log = this.options.log;
		
		// Check for HTML5 support
		if(!Engine.browserValid()) {
			window.location = 'browserWarning.html';
		}
		
		// Check for mobile
		// if(Engine.isMobile()) {
		// 	window.location = 'mobileWarning.html';
		// }

		Engine.disableSelection();
		
		if(this.options.state != null) {
			window.State = this.options.state;
		} else {
			Engine.loadGame();
		}

		if(Engine.isMobile()) {
			$('<div>').text('WARNING: this might look bad on mobile. Just a heads-up.').appendTo('#main');
		}
		
		$('<div>').attr('id', 'locationSlider').appendTo('#main');

		var menu = $('<div>')
			.addClass('menu')
			.appendTo('body');

		if(typeof langs != 'undefined'){
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
			
			$.each(langs, function(name,display){
				$('<li>')
					.text(display)
					.attr('data-language', name)
					.on("click", function() { Engine.switchLanguage(this); })
					.appendTo(optionsList);
			});
		}

		$('<span>')
			.addClass('lightsOff menuBtn')
			.text(_('lights off.'))
			.click(Engine.turnLightsOff)
			.appendTo(menu);

		$('<span>')
			.addClass('menuBtn')
			.text(_('hyper.'))
			.click(function(){
				Engine.options.doubleTime = !Engine.options.doubleTime;
				if(Engine.options.doubleTime)
					$(this).text(_('classic.'));
				else
					$(this).text(_('hyper.'));
			})
			.appendTo(menu);

		$('<span>')
			.addClass('menuBtn')
			.text(_('restart.'))
			.click(Engine.confirmDelete)
			.appendTo(menu);
		
		$('<span>')
			.addClass('menuBtn')
			.text(_('share.'))
			.click(Engine.share)
			.appendTo(menu);

		$('<span>')
			.addClass('menuBtn')
			.text(_('save.'))
			.click(Engine.exportImport)
			.appendTo(menu);
	
		// subscribe to stateUpdates
		$.Dispatch('stateUpdate').subscribe(Engine.handleStateUpdates);

		$SM.init();
		Notifications.init();
		Events.init();
		Village.init();
		Character.init();
		Weather.init();
		if($SM.get('Road.open') !== undefined) {
			Road.init();
		}
		if($SM.get('Outpost.open') !== undefined) {
			Outpost.init();
		}

		Engine.saveLanguage();
		Engine.travelTo(Village);

	},
	
	browserValid: function() {
		return ( location.search.indexOf( 'ignorebrowser=true' ) >= 0 || ( typeof Storage != 'undefined' && !oldIE ) );
	},
	
	isMobile: function() {
		return ( location.search.indexOf( 'ignorebrowser=true' ) < 0 && /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test( navigator.userAgent ) );
	},
	
	saveGame: function() {
		if(typeof Storage != 'undefined' && localStorage) {
			if(Engine._saveTimer != null) {
				clearTimeout(Engine._saveTimer);
			}
			if(typeof Engine._lastNotify == 'undefined' || Date.now() - Engine._lastNotify > Engine.SAVE_DISPLAY){
				$('#saveNotify').css('opacity', 1).animate({opacity: 0}, 1000, 'linear');
				Engine._lastNotify = Date.now();
			}
			localStorage.gameState = JSON.stringify(State);
		}
	},
	
	loadGame: function() {
		try {
			var savedState = JSON.parse(localStorage.gameState);
			if(savedState) {
				window.State = savedState;
				Engine.log("loaded save!");
			}
		} catch(e) {
			Engine.log(e);
			window.State = {};
			$SM.set('version', Engine.VERSION);
		}
	},
	
	exportImport: function() {
		Events.startEvent({
			title: _('Export / Import'),
			scenes: {
				start: {
					text: [
						_('export or import save data, for backing up'),
						_('or migrating computers')
					],
					buttons: {
						'export': {
							text: _('export'),
							onChoose: Engine.export64
						},
						'import': {
							text: _('import'),
							nextScene: {1: 'confirm'}
						},
						'cancel': {
							text: _('cancel'),
							nextScene: 'end'
						}
					}
				},
				'confirm': {
					text: [
						_('are you sure?'),
						_('if the code is invalid, all data will be lost.'),
						_('this is irreversible.')
					],
					buttons: {
						'yes': {
							text: _('yes'),
							nextScene: {1: 'inputImport'},
							onChoose: Engine.enableSelection
						},
						'no': {
							text: _('no'),
							nextScene: 'end'
						}
					}
				},
				'inputImport': {
					text: [_('put the save code here.')],
					textarea: '',
					buttons: {
						'okay': {
							text: _('import'),
							nextScene: 'end',
							onChoose: Engine.import64
						},
						'cancel': {
							text: _('cancel'),
							nextScene: 'end'
						}
					}
				}
			}
		});
	},

	generateExport64: function(){
		var string64 = Base64.encode(localStorage.gameState);
		string64 = string64.replace(/\s/g, '');
		string64 = string64.replace(/\./g, '');
		string64 = string64.replace(/\n/g, '');

		return string64;
	},

	export64: function() {
		Engine.saveGame();
		var string64 = Engine.generateExport64();
		Engine.enableSelection();
		Events.startEvent({
			title: _('Export'),
			scenes: {
				start: {
					text: [_('save this.')],
					textarea: string64,
					readonly: true,
					buttons: {
						'done': {
							text: _('got it'),
							nextScene: 'end',
							onChoose: Engine.disableSelection
						}
					}
				}
			}
		});
		Engine.autoSelect('#description textarea');
	},

	import64: function(string64) {
		Engine.disableSelection();
		string64 = string64.replace(/\s/g, '');
		string64 = string64.replace(/\./g, '');
		string64 = string64.replace(/\n/g, '');
		var decodedSave = Base64.decode(string64);
		localStorage.gameState = decodedSave;
		location.reload();
	},

	confirmDelete: function() {
		Events.startEvent({
			title: _('Restart?'),
			scenes: {
				start: {
					text: [_('restart the game?')],
					buttons: {
						'yes': {
							text: _('yes'),
							nextScene: 'end',
							onChoose: Engine.deleteSave
						},
						'no': {
							text: _('no'),
							nextScene: 'end'
						}
					}
				}
			}
		});
	},

	deleteSave: function(noReload) {
		if(typeof Storage != 'undefined' && localStorage) {
			window.State = {};
			localStorage.clear();
		}
		if(!noReload) {
			location.reload();
		}
	},

	share: function() {
		Events.startEvent({
			title: _('Share'),
			scenes: {
				start: {
					text: [_('bring your friends.')],
					buttons: {
						'facebook': {
							text: _('facebook'),
							nextScene: 'end',
							onChoose: function() {
								window.open('https://www.facebook.com/sharer/sharer.php?u=' + Engine.SITE_URL, 'sharer', 'width=626,height=436,location=no,menubar=no,resizable=no,scrollbars=no,status=no,toolbar=no');
							}
						},
						'google': {
							text:_('google+'),
							nextScene: 'end',
							onChoose: function() {
								window.open('https://plus.google.com/share?url=' + Engine.SITE_URL, 'sharer', 'width=480,height=436,location=no,menubar=no,resizable=no,scrollbars=no,status=no,toolbar=no');
							}
						},
						'twitter': {
							text: _('twitter'),
							nextScene: 'end',
							onChoose: function() {
								window.open('https://twitter.com/intent/tweet?text=A%20Dark%20Room&url=' + Engine.SITE_URL, 'sharer', 'width=660,height=260,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');
							}
						},
						'reddit': {
							text: _('reddit'),
							nextScene: 'end',
							onChoose: function() {
								window.open('http://www.reddit.com/submit?url=' + Engine.SITE_URL, 'sharer', 'width=960,height=700,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');
							}
						},
						'close': {
							text: _('close'),
							nextScene: 'end'
						}
					}
				}
			}
		},
		{
			width: '400px'
		});
	},

	findStylesheet: function(title) {
		for(var i=0; i<document.styleSheets.length; i++) {
			var sheet = document.styleSheets[i];
			if(sheet.title == title) {
				return sheet;
			}
		}
		return null;
	},

	isLightsOff: function() {
		var darkCss = Engine.findStylesheet('darkenLights');
		if ( darkCss != null && !darkCss.disabled ) {
			return true;
		}
		return false;
	},

	turnLightsOff: function() {
		var darkCss = Engine.findStylesheet('darkenLights');
		if (darkCss == null) {
			$('head').append('<link rel="stylesheet" href="css/dark.css" type="text/css" title="darkenLights" />');
			$('.lightsOff').text(_('lights on.'));
		} else if (darkCss.disabled) {
			darkCss.disabled = false;
			$('.lightsOff').text(_('lights on.'));
		} else {
			$("#darkenLights").attr("disabled", "disabled");
			darkCss.disabled = true;
			$('.lightsOff').text(_('lights off.'));
		}
	},

	// Gets a guid
	getGuid: function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	},

	activeModule: null,

	travelTo: function(module) {
		if(Engine.activeModule != module) {
			var currentIndex = Engine.activeModule ? $('.location').index(Engine.activeModule.panel) : 1;
			$('div.headerButton').removeClass('selected');
			module.tab.addClass('selected');

			var slider = $('#locationSlider');
			var stores = $('#storesContainer');
			var panelIndex = $('.location').index(module.panel);
			var diff = Math.abs(panelIndex - currentIndex);
			slider.animate({left: -(panelIndex * 700) + 'px'}, 300 * diff);

			if($SM.get('stores.wood') !== undefined) {
			// FIXME Why does this work if there's an animation queue...?
				stores.animate({right: -(panelIndex * 700) + 'px'}, 300 * diff);
			}
		
			Engine.activeModule = module;

			module.onArrival(diff);

			if(Engine.activeModule == Village
				//  || Engine.activeModule == Path
				) {
				// Don't fade out the weapons if we're switching to a module
				// where we're going to keep showing them anyway.
				if (module != Village 
					// && module != Path
				) {
					$('div#weapons').animate({opacity: 0}, 300);
				}
			}

			if(module == Village
				//  || module == Path
				) {
				$('div#weapons').animate({opacity: 1}, 300);
			}

			Notifications.printQueue(module);
		
		}
	},

	log: function(msg) {
		if(this._log) {
			console.log(msg);
		}
	},

	updateSlider: function() {
		var slider = $('#locationSlider');
		slider.width((slider.children().length * 700) + 'px');
	},

	updateOuterSlider: function() {
		var slider = $('#outerSlider');
		slider.width((slider.children().length * 700) + 'px');
	},

	disableSelection: function() {
		document.onselectstart = eventNullifier; // this is for IE
		document.onmousedown = eventNullifier; // this is for the rest
	},

	enableSelection: function() {
		document.onselectstart = eventPassthrough;
		document.onmousedown = eventPassthrough;
	},

	autoSelect: function(selector) {
		$(selector).focus().select();
	},

	handleStateUpdates: function(e){
	
	},

	switchLanguage: function(dom){
		var lang = $(dom).data("language");
		if(document.location.href.search(/[\?\&]lang=[a-z_]+/) != -1){
			document.location.href = document.location.href.replace( /([\?\&]lang=)([a-z_]+)/gi , "$1"+lang );
		}else{
			document.location.href = document.location.href + ( (document.location.href.search(/\?/) != -1 )?"&":"?") + "lang="+lang;
		}
	},

	saveLanguage: function(){
		var lang = decodeURIComponent((new RegExp('[?|&]lang=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;	
		if(lang && typeof Storage != 'undefined' && localStorage) {
			localStorage.lang = lang;
		}
	},

	setTimeout: function(callback, timeout, skipDouble?){

		if( Engine.options.doubleTime && !skipDouble ){
			Engine.log('Double time, cutting timeout in half');
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


function inView(dir, elem){

        var scTop = $('#main').offset().top;
        var scBot = scTop + $('#main').height();

        var elTop = elem.offset().top;
        var elBot = elTop + elem.height();

        if( dir == 'up' ){
                // STOP MOVING IF BOTTOM OF ELEMENT IS VISIBLE IN SCREEN
                return ( elBot < scBot );
        }else if( dir == 'down' ){
                return ( elTop > scTop );
        }else{
                return ( ( elBot <= scBot ) && ( elTop >= scTop ) );
        }

}

function scrollByX(elem, x){

        var elTop = parseInt( elem.css('top'), 10 );
        elem.css( 'top', ( elTop + x ) + "px" );

}


//create jQuery Callbacks() to handle object events 
$.Dispatch = function( id ) {
	var callbacks, topic = id && Engine.topics[ id ];
	if ( !topic ) {
		callbacks = jQuery.Callbacks();
		topic = {
				publish: callbacks.fire,
				subscribe: callbacks.add,
				unsubscribe: callbacks.remove
		};
		if ( id ) {
			Engine.topics[ id ] = topic;
		}
	}
	return topic;
};

$(function() {
	Engine.init();
});

