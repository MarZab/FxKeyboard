"use strict";
/*
FxKeyboard
Version: 2.4.2~alternate-en-ar
Author:  Marko Zabreznik
Date:    15 Jul 2014
Purpose: A virtual keyboard for Firefox
*/

window.addEventListener("load", function() { fxKeyboard.startUp(); }, false);
var fxKeyboard = {
	startUp: function()
	{
		this.prefs = Components.classes["@mozilla.org/preferences-service;1"]  
			.getService(Components.interfaces.nsIPrefBranch);
		
		// set button styles
		var buttonHeight = this.prefs.getCharPref("extensions.fxkeyboard.button_height");
		var buttonFont = this.prefs.getCharPref("extensions.fxkeyboard.button_font");
		var repeatAll = this.prefs.getBoolPref("extensions.fxkeyboard.repeat_all");
		var buttons = document.getElementById('fxKeyboardToolbar').getElementsByTagName('button');
		
		for( var b in buttons) {
			if (buttons[b].style) {
				buttons[b].style.height = buttonHeight;
				buttons[b].style.cssText += ';'+ buttonFont
			}
			else continue;
			if (repeatAll)
				buttons[b].type = 'repeat';
			if (!buttons[b].flex)
				buttons[b].flex = 1;
		}
	
		//this.shift = 0; // 0 closed, 1 open, 2 persistent
		this.toolbar = document.getElementById('fxKeyboardToolbar');
		this.alt = 0;
		
		this.locale = 'en';
		this.locales = {
			'en': 'ع',
			'ar': 'ENG'
		};
		
		this.focus; // current focused element
		
		document.addEventListener("focus", this.onFocus,true);
		document.addEventListener("blur", this.onFocus,true);
		
		this.toogleKeepOpen(
			this.prefs.getBoolPref("extensions.fxkeyboard.keep_open")
		); // keep open
		
		this.drawKeyboard();
	},
	onFocus: function() {
		fxKeyboard.focus = document.commandDispatcher.focusedElement;
		if(!fxKeyboard.focus) fxKeyboard.focus = document.commandDispatcher.focusedWindow.document.activeElement;
		
		if (fxKeyboard.keepOpen) {
			fxKeyboard.toolbar.collapsed = false;
			return;
		}
		
		// auto open/close
		if (fxKeyboard.focus && fxKeyboard.focus.getAttribute('data-fxkeyboard')!=='false' && (	
				fxKeyboard.focus.nodeName && fxKeyboard.focus.nodeName.toLowerCase() in {
					'input':'','select':'',
					'option':'','textarea':''
				}
			||	fxKeyboard.focus.type && fxKeyboard.focus.type.toLowerCase() in {
					'text':'','password':'','url':'','color':'','date':'','datetime':'',
					'datetime-local':'','email':'','month':'','number':'','range':'',
					'search':'','tel':'','time':'','week':''
				}
			)
		)	fxKeyboard.toolbar.collapsed = false;
		else fxKeyboard.toolbar.collapsed = true;
	},
	toogleKeepOpen: function ( keepopened )
	{
		if (!keepopened) {
			// close keyboard
			this.keepOpen = false;
			this.toolbar.collapsed = true;
		} else {
			// force open keyboard
			this.keepOpen = true;
			this.toolbar.collapsed = false;
		}
	},
	doKey: function ( key )
	{
		if (typeof(key)=='string') {
			key = key.charCodeAt(0);
		} 
		
		// alt keys
		if (this.alt == 1) {
			this.alt = 2;
			this.switchAltKeys();
		}
		var evt = document.createEvent("KeyboardEvent");
		evt.initKeyEvent("keypress", true, true, null, false, false, false, false, 0, key);
		this.focus.dispatchEvent(evt);
	},
	doSpecialKey: function ( key ) {
		var evt = document.createEvent("KeyboardEvent");
		evt.initKeyEvent("keypress", true, true, null, false, false, false, false, key, 0);
		this.focus.dispatchEvent(evt);
	},
	
	switchAltKeys: function ( keep ) {
	
		if (this.alt > 0) {
		
			this.eachClass('fxKeyboardAlt', function(e){
				e.style.backgroundColor = 'black';
			})
			this.alt = 0;
			this.drawKeyboard()
		} else {
			this.alt = 1;
			if (keep) {
				this.eachClass('fxKeyboardAlt', function(e){
					e.style.backgroundColor = '#302f37';
				})
				this.alt = 2;
			}
			this.drawKeyboard()
		}
	},	
	
	switchLocale: function () {
		if (this.locale == 'en') {
			this.locale='ar';
			
		} else {
			this.locale='en';
		}
		this.eachClass('fxKeyboardAlt', function(e){
			e.style.backgroundColor = 'black';
		})
		this.alt = 0;
		this.drawKeyboard();
	},
	
	drawKeyboard: function () {
		var locale = this.locale;
		var locales = this.locales;
		this.eachClass('fxKeyboardKeys', function(e){
			e.collapsed = true;
		});
		// show the right keyboard for locale and alt
		if (this.alt) {
			document.getElementById('alt_' + locale).collapsed = false;
		} else {
			document.getElementById('main_' + locale).collapsed = false;
		}
		
		this.eachClass('fxKeyboardLocaleButton', function(e){
			e.label = locales[locale];
		});
	
	},
	
	eachClass: function (c, f) {
		var elems = document.getElementsByClassName(c);
		for(var i = 0; i < elems.length; i++) {
			f(elems[i]);
		}
	},
	
	doClear: function() {
		// select all text
		var evt = document.createEvent("KeyboardEvent");
        evt.initKeyEvent("keypress", true, true, null, true, false, false, false, 0, 97);
        this.focus.dispatchEvent(evt);
		// backspace
		this.doSpecialKey(8);
	},
}
// END fxKeyboard