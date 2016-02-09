"use strict";
/*
 FxKeyboard
 Version: 3.0.0
 Author:  Marko Zabreznik
 Date:    23 July 2015
 Purpose: A virtual keyboard for Firefox
 */

var fxKeyboard = {

    startUp: function () {

        // settings
        this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
            .getService(Components.interfaces.nsIPrefService)
            .getBranch("extensions.fxkeyboard.");
        this.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
        this.prefs.addObserver("", this, false);

        this._processSettings();

        // events
        document.addEventListener("focus", this.onFocus, true);
        document.addEventListener("blur", this.onFocus, true);

        document.addEventListener("keypress", function () {
            if (fxKeyboard.fromInside) {
                fxKeyboard.fromInside = false;
                return;
            }
            if (!fxKeyboard.keepOpen) {
                fxKeyboard._setOpen(false);
            }
        }, true);

        fxKeyboard.switchLocale(fxKeyboard.settings.locale_default);

        var appcontent = document.getElementById("appcontent");
        if(appcontent){
            appcontent.addEventListener("DOMContentLoaded", function (aEvent) {
                fxKeyboard.docSwitch(aEvent.originalTarget, 'dom');
            }, true);
        }

        gBrowser.tabContainer.addEventListener("TabSelect", function (aEvent) {
            fxKeyboard.docSwitch(gBrowser.selectedBrowser.contentDocument, 'tab');
        }, false);

    },

    // on page change/load
    docSwitch: function (doc, source) {

        if (!doc.hasFocus() && source != 'tab')
            // not a context switch after all
            return;

        fxKeyboard.tempOpen = false;
    },

    _processSettings: function () {

        fxKeyboard.settings.repeat_all = fxKeyboard.prefs.getBoolPref("repeat_all");
        fxKeyboard.settings.keep_closed = fxKeyboard.prefs.getBoolPref("keep_closed");
        fxKeyboard.settings.key_height = this.prefs.getCharPref("key_height");
        fxKeyboard.settings.main_max_width = this.prefs.getCharPref("main_max_width");

        fxKeyboard.settings.locale_picker = fxKeyboard.prefs.getCharPref("locale_picker")
            .split(' ')
            .filter(function(n){ return n != '' && n != null });

        var locale_default = fxKeyboard.prefs.getCharPref("locale_default");
        if (locale_default && fxKeyboard.settings.locale_picker.indexOf(locale_default)) {
            fxKeyboard.settings.locale_default = locale_default;
        } else {
            fxKeyboard.settings.locale_default = fxKeyboard.settings.locale_picker[0];
        }

    },

    settings: {
        repeat_all: true,
        keep_closed: false,
        locale_default: 'en',
        key_height: '40',
        main_max_width: '1600px',
        locale_picker: ['en', 'de', 'da', 'sl']
    },


    specialKeys: {
        'shift': function (e) {
            var state = fxKeyboard.state;

            if (fxKeyboard._shiftLock) {
                fxKeyboard._shiftLock = false;
                fxKeyboard._setKeyActive('shift', 0);
                state = (state === 3) ? 2 : 0;
            } else {
                switch (fxKeyboard.state) {
                    case 0:
                        // nothing is on, enable single use shift
                        state = 1;
                        fxKeyboard._setKeyActive('shift', 1);
                        break;
                    case 2:
                        // alt is on, turn on single use alt+shift
                        state = 3;
                        fxKeyboard._setKeyActive('shift', 1);
                        break;
                    case 1:
                    case 3:
                        // shift is on, lock it
                        fxKeyboard._shiftLock = true;
                        fxKeyboard._setKeyActive('shift', 2);
                        break;
                }
            }
            fxKeyboard.setState(state);
        },
        'alt': function (e) {
            var state = fxKeyboard.state;

            switch (state) {
                case 0:
                    // nothing is on, turn on alt
                    state = 2;
                    fxKeyboard._setKeyActive('alt', 1);
                    break;
                case 2:
                    // alt is on, turn it off
                    state = 0;
                    fxKeyboard._setKeyActive('alt', 0);
                    break;
                default:
                    // alt-shift is on or shift is on, turn off shift, turn on alt
                    state = 2;
                    fxKeyboard._shiftLock = false;
                    fxKeyboard._setKeyActive('shift', 0);
                    fxKeyboard._setKeyActive('alt', 1);
            }
            fxKeyboard.setState(state);
        },
        'tab': function (e) {
            // special kind of tab, emulates the real one but not quite,
            // ordering is just order in html, might break on hidden fields
            var inputs = ((fxKeyboard.focus || {}).ownerDocument || {}).querySelectorAll('input,textarea,select,option,textbox');
            if (inputs) for (var i = 0; i < inputs.length; i++) {
                if (inputs[i] === fxKeyboard.focus) {
                    // ok, focus next one
                    inputs[i + 1].focus();
                    break;
                }
            }
        },
        'clear': function (e) {
            // emulate select all and clear on field
            // select all text
            //fxKeyboard._dispatchKey(97);
            // backspace
            //fxKeyboard._dispatchAltKey(8);
            if (fxKeyboard.focus && fxKeyboard.focus.value) {
                fxKeyboard.focus.value = '';
            }
        },
        'keepOpen': function () {
            fxKeyboard.toggleKeepOpen();
        },
        'toggleLocale': function () {
            fxKeyboard.switchLocale();
        }
    },

    switchLocale: function (l) {

        if (!l) {
            // next one
            l = fxKeyboard.settings.locale_picker.indexOf(fxKeyboard.locale.locale);
            l++;
            if (l > fxKeyboard.settings.locale_picker.length -1) {
                l = 0;
            }
            l = fxKeyboard.settings.locale_picker[l];
        }

        var locale = FxKeyboardLocales[l];
        if (!locale  || locale === fxKeyboard.locale) return;

        fxKeyboard.locale = locale;
        fxKeyboard.makeButtons();
    },

    toggleKeepOpen: function (keepOpen) {
        if (keepOpen !== false && keepOpen !== true) {
            keepOpen = !fxKeyboard.keepOpen;
        }
        fxKeyboard.keepOpen = keepOpen;

        if (keepOpen) {
            fxKeyboard._setKeyActive('keepOpen', 1);
            fxKeyboard._setOpen(true);
            fxKeyboard.keepOpen = true;
        } else {
            fxKeyboard._setKeyActive('keepOpen', 0);
            fxKeyboard.keepOpen = false;
            fxKeyboard._setOpen(false);
        }
    },

    _setOpen: function (open) {
        var toolbars = document.querySelectorAll('.fxKeyboardToolbar');
        if (toolbars) for (var i = 0; i < toolbars.length; i++) {
            toolbars[i].collapsed = !open;
        }
    },

    // shift pressed once
    _shiftLock: false,
    // the current focused element
    focus: false,
    // all the current buttons
    buttons: [],
    /*
     states:
     0 - normal
     1 - shift on
     2 - alt
     3 - alt+shift
     */
    state: 0,
    keepOpen: false,
    // temporary open, or switch locales
    tempOpen: false,
    fromInside: false, // key event was from inside

    events: {
        onFocus: []
    },

    // when a HTML element gets focus
    onFocus: function () {
        var open = false;
        // focus on new element
        var focus = document.commandDispatcher.focusedElement ||
            document.commandDispatcher.focusedWindow.document.activeElement;
        if (focus) {

            var nodeName = focus.nodeName.toLowerCase();
            var nodeType = focus.type;

            // fxKB aware tag
            if (focus.getAttribute('data-fxkeyboard') === 'false') {
                // todo switch locale
            } else {

                if (focus.isContentEditable) {
                    open = true;
                }

                if (nodeName in {
                        'input': '', 'select': '',
                        'option': '', 'textarea': '', 'textbox': ''
                    }) {
                    open = true;
                } else {
                    if (nodeType && nodeType.toLowerCase() in {
                            'text':'','password':'','url':'','color':'','date':'','datetime':'',
                            'datetime-local':'','email':'','month':'','number':'','range':'',
                            'search':'','tel':'','time':'','week':''
                        }) {
                        open = true;
                    }
                }
            }
            fxKeyboard.events.onFocus.forEach(function (f) {
                open = f(open, focus, nodeName, nodeType);
            });
        }
        if (fxKeyboard.keepOpen == true) {
            // keep kb open regardless
            open = true;
        } else if (fxKeyboard.settings.keep_closed && !fxKeyboard.tempOpen) {
            open = false;
        }
        fxKeyboard.focus = focus;
        fxKeyboard._setOpen(open);
    },

    // destroy and render a new keyboard
    makeButtons: function () {

        var locale = fxKeyboard.locale;
        if (!locale) return;

        // remove current keyboard
        fxKeyboard.buttons = [];
        fxKeyboard.state = 0;

        const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
        function createButton(item){
            var button = document.createElementNS(XUL_NS, 'button');

            // style
            button.setAttribute('flex', locale.defaultFlex || '1');
            button.classList.add("fxKeyboardButton");

            if (fxKeyboard.settings.key_height) {
                button.setAttribute('height', fxKeyboard.settings.key_height);
            }

            button.fxkbdata = item;
            button.addEventListener("command", function (e) {
                fxKeyboard._processPress(item, e);
            });

            // register button
            fxKeyboard.buttons.push(button);

            return button;
        }

        // main keyboard
        var fxKeyboardMain = document.getElementById('fxKeyboardMain');
        if (fxKeyboard.settings.main_max_width) {
            // set width
            fxKeyboardMain.style.maxWidth = fxKeyboard.settings.main_max_width;
        }
        while (fxKeyboardMain.firstChild) {
            // truncate
            fxKeyboardMain.removeChild(fxKeyboardMain.firstChild);
        }
        if (locale.main) {
            fxKeyboardMain.collapsed = false;
            locale.main.forEach(function (rowitems) {

                // create row
                var row = document.createElementNS(XUL_NS, 'hbox');
                row.setAttribute('flex', '1');

                rowitems.forEach(function (item) {
                    // append to row
                    row.appendChild(createButton(item));
                });

                fxKeyboardMain.appendChild(row);
            });
        } else {
            fxKeyboardMain.collapsed = true;
        }

        // sidebar
        var fxKeyboardSide = document.getElementById('fxKeyboardSide');
        while (fxKeyboardSide.firstChild) {
            // truncate
            fxKeyboardSide.removeChild(fxKeyboardSide.firstChild);
        }
        if (locale.side) {
            fxKeyboardSide.collapsed = false;
            locale.side.forEach(function (rowitems) {
                var row = document.createElementNS(XUL_NS, 'hbox');
                row.setAttribute('flex', '1');
                row.classList.add('items'+rowitems.length);
                rowitems.forEach(function (item) {
                    row.appendChild(createButton(item));
                });
                fxKeyboardSide.appendChild(row);
            });
        } else {
            fxKeyboardSide.collapsed = true;
        }

        // redraw keyboard
        fxKeyboard.redrawButtons();
    },

    // redraw buttons based on the current state
    redrawButtons: function () {
        fxKeyboard.buttons.forEach(function (button) {
            var item = button.fxkbdata;
            var key, state = fxKeyboard.state;
            if (state > item.length -1) {
                if (state === 3 && item.length > 2) key = item[2];
                else key = item[0];
            } else key = item[state];

            // a simple key/string
            if (key === '') {
                button.label = '\u0020';
                return;
            }

            if (typeof key === 'string') {

                button.label = key.trim();
                if (fxKeyboard.settings.repeat_all) {
                    button.setAttribute('type', 'repeat');
                } else {
                    button.removeAttribute('type');
                }
                if (key.length > 1) {
                    button.classList.add('small');
                }

            } else {

                button.label = key.label;

                if (key.flex) {
                    button.setAttribute('flex', key.flex);
                }

                if (key.image) {
                    button.image = key.image;
                }

                if (key.type) {
                    button.setAttribute('type', key.type);
                }

                if (key.class) {
                    key.class.split(' ').forEach(function (c) {
                        button.classList.add(c);
                    });
                }

                if (key.tooltiptext){
                    button.setAttribute('tooltiptext', key.tooltiptext);
                }

            }
        });
    },

    _processPress: function (item, e) {
        // default first if none
        var key, state = fxKeyboard.state;
        if (state > item.length -1) {
            if (state === 3 && item.length > 2) key = item[2];
            else key = item[0];
        } else key = item[state];

        if (typeof key === 'string') {
            // just a simple key or string
            fxKeyboard._enterString(key, fxKeyboard.focus);
        } else {
            // special keys
            if (key.special) {
                if (fxKeyboard.specialKeys[key.special]) {
                    fxKeyboard.specialKeys[key.special](e);
                }
                else {
                    fxKeyboard._dispatchAltKey(key.special, fxKeyboard.focus);
                }
            } else if (key.char) {
                fxKeyboard._dispatchKey(key.char, fxKeyboard.focus);
            } else if (key.string) {
                fxKeyboard._enterString(key.string, fxKeyboard.focus);
            }
        }
    },

    // enter a series of letters into a focused element
    _enterString: function (str, target) {
        if (!target) return;
        for (var i = 0, len = str.length; i < len; i++) {
            var letter = str[i].charCodeAt(0);
            fxKeyboard._dispatchKey(letter, target);
        }
    },

    // enter a regular key into a focused element
    _dispatchKey: function (key, target) {
        if (!target) return;

        fxKeyboard.fromInside = true;

        var evt = gBrowser.selectedBrowser.contentDocument.createEvent("KeyboardEvent");
        evt.initKeyEvent("keypress", true, true, null, false, false, false, false, 0, key);
        target.dispatchEvent(evt);
        evt = gBrowser.selectedBrowser.contentDocument.createEvent("KeyboardEvent");
        evt.initKeyEvent("keyup", true, true, null, false, false, false, false, 0, key);
        target.dispatchEvent(evt);

        // unpress shift
        if (!fxKeyboard._shiftLock) {
            if (fxKeyboard.state === 1) {
                fxKeyboard.setState(0);
            } else if (fxKeyboard.state === 3) {
                fxKeyboard.setState(2);
            } else return;
            fxKeyboard._setKeyActive('shift', 0);
        }

    },

    // send a special event to a focused element
    _dispatchAltKey: function (key, target) {
        if (!target) return;

        fxKeyboard.fromInside = true;

        var evt = gBrowser.selectedBrowser.contentDocument.createEvent("KeyboardEvent");
        evt.initKeyEvent("keypress", true, true, null, false, false, false, false, key, 0);
        target.dispatchEvent(evt);
        evt = gBrowser.selectedBrowser.contentDocument.createEvent("KeyboardEvent");
        evt.initKeyEvent("keyup", true, true, null, false, false, false, false, key, 0);
        target.dispatchEvent(evt);
    },

    // switch state if needed
    setState: function (state) {
        if (state === fxKeyboard.state)
            return;

        fxKeyboard.state = state;
        fxKeyboard.redrawButtons();
    },


    // toggle button classes
    _setKeyActive: function (keyClass, state) {
        // 0 not active
        // 1 active
        // 2 locked
        var buttons = document.querySelectorAll('.fxKeyboardButton.'+keyClass+',.toolbarbutton-1.'+keyClass);
        if (buttons.length) {
            [].forEach.call(buttons, function (button) {
                if (state > 0) {
                    button.classList.add('active');
                    if (state > 1)
                        button.classList.add('locked');
                } else {
                    button.classList.remove('locked');
                    button.classList.remove('active');
                }
            });
        }
    },

    pressToolbarButton: function () {

        // open regardless
        fxKeyboard._setOpen(true);

        if (fxKeyboard.settings.keep_closed && !fxKeyboard.tempOpen) {
            // locked, unlock this time
            fxKeyboard.tempOpen = true;
        } else {
            fxKeyboard.switchLocale();
        }
    },


    // settings
    observe: function(subject, topic, data)
    {
        if (topic != "nsPref:changed")
            return;

        switch(data)
        {
            case "main_max_width":
                fxKeyboard.settings.main_max_width = this.prefs.getCharPref("main_max_width");
                fxKeyboard.makeButtons();
                break;
            case "repeat_all":
                fxKeyboard.settings.repeat_all = this.prefs.getBoolPref("repeat_all");
                fxKeyboard.redrawButtons();
                break;
            case "keep_closed":
                fxKeyboard.settings.keep_closed = this.prefs.getBoolPref("keep_closed");
                break;
            case "key_height":
                fxKeyboard.settings.key_height = this.prefs.getCharPref("key_height");
                fxKeyboard.makeButtons();
                break;
            default:
                fxKeyboard._processSettings();
                break;
        }
    },

    shutDown: function () {
        this.prefs.removeObserver("", this);
    }

};

window.addEventListener("load", function load() {
    window.removeEventListener("load", load, false);
    fxKeyboard.startUp();
}, false);
window.addEventListener("unload", fxKeyboard.shutDown, false);


// END fxKeyboard