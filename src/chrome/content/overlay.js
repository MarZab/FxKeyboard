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

        this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
            .getService(Components.interfaces.nsIPrefBranch);

        fxKeyboard.locale = 'en-small';


        // set button styles
        //var buttonHeight = this.prefs.getCharPref("extensions.fxkeyboard.button_height");
        //var buttonFont = this.prefs.getCharPref("extensions.fxkeyboard.button_font");
        //var repeatAll = this.prefs.getBoolPref("extensions.fxkeyboard.repeat_all");
        //var buttons = document.getElementById('fxKeyboardToolbar').getElementsByTagName('button');

        fxKeyboard.toolbar = document.getElementById('fxKeyboardToolbar');

        // events
        document.addEventListener("focus", this.onFocus, true);
        document.addEventListener("blur", this.onFocus, true);

        //
        fxKeyboard.makeKeyboard(fxKeyboard.locale);
    },

    specialKeys: {
        'shift': function (e) {
            fxKeyboard.pressShift(e);
        },
        'alt': function (e) {
            fxKeyboard.pressAlt(e);
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
            fxKeyboard._dispatchKey(97);
            // backspace
            fxKeyboard._dispatchAltKey(8);
        }
    },

    focus: false,
    // when a HTML element gets focus
    onFocus: function () {
        var open = false;
        // focus on new element
        var focus = document.commandDispatcher.focusedElement ||
            document.commandDispatcher.focusedWindow.document.activeElement;
        if (focus) {
            // fxKB aware tag
            if (focus.getAttribute('data-fxkeyboard') === 'false') {
                // todo switch locale
            } else {
                var nodeName = focus.nodeName.toLowerCase();
                if (nodeName in {
                        'input': '', 'select': '',
                        'option': '', 'textarea': '', 'textbox': ''
                    }) {
                    open = true;
                } else {
                    var nodeType = focus.type;
                    if (nodeType && nodeType.toLowerCase() in {
                            'text':'','password':'','url':'','color':'','date':'','datetime':'',
                            'datetime-local':'','email':'','month':'','number':'','range':'',
                            'search':'','tel':'','time':'','week':''
                        }) {
                        open = true;
                    }
                }
            }
        }
        if (fxKeyboard.keepOpen == true) {
            // keep kb open regardless
            open = true;
        }
        fxKeyboard.focus = focus;
        fxKeyboard.toolbar.collapsed = !open;
    },

    // destroy and render a new keyboard
    makeKeyboard: function (l) {
        if (!FxKeyboardLocales[l]) return;
        var locale = FxKeyboardLocales[l];
        fxKeyboard.keys = [];
        fxKeyboard._makeKeyboardRow('fxKeyboardKeysRow1', locale.row1);
        fxKeyboard._makeKeyboardRow('fxKeyboardKeysRow2', locale.row2);
        fxKeyboard._makeKeyboardRow('fxKeyboardKeysRow3', locale.row3);
        fxKeyboard._makeKeyboardRow('fxKeyboardKeysRow4', locale.row4);
        fxKeyboard._makeKeyboardRow('fxKeyboardKeysRow5', locale.row5);
    },

    buttons: [],
    // destroy and render a new row
    _makeKeyboardRow: function (rowId, items) {

        if (!items) return;

        var row = document.getElementById(rowId);
        const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

        items.forEach(function (item) {
            var button = document.createElementNS(XUL_NS, 'button');

            // style
            button.setAttribute('flex', items[0].flex || '1');
            button.classList.add("fxKeyboardButton");

            button.fxkbdata = item;
            button.addEventListener("command", function (e) {
                fxKeyboard._processPress(item, e);
            });

            // register button
            fxKeyboard.buttons.push(button);

            // append to row
            row.appendChild(button);

            fxKeyboard._renderButton(button, fxKeyboard.state);
        });

    },

    // redraw every keyboard key
    _renderKeyboard: function () {
        fxKeyboard.buttons.forEach(function (button) {
            fxKeyboard._renderButton(button, fxKeyboard.state);
        });
    },

    // redraw button
    _renderButton: function (button, state) {
        var item = button.fxkbdata;
        var key;
        if (state > item.length -1) {
            if (state === 3 && item.length > 2) key = item[2];
            else key = item[0];
        } else key = item[state];

        if (key === '') {
            button.label = '\u0020';
            return;
        }

        if (typeof key === 'string') {
            button.label = key;
            button.setAttribute('type', 'repeat');
        } else {
            button.label = key.label;
            if (key.type) {
                button.setAttribute('type', key.type);
            }
            // class
            if (key.class) {
                key.class.split(' ').forEach(function (c) {
                    button.classList.add(c);
                });
            }
        }
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
        var evt = gBrowser.selectedBrowser.contentDocument.createEvent("KeyboardEvent");
        evt.initKeyEvent("keypress", true, true, null, false, false, false, false, 0, key);
        target.dispatchEvent(evt);
        evt = gBrowser.selectedBrowser.contentDocument.createEvent("KeyboardEvent");
        evt.initKeyEvent("keyup", true, true, null, false, false, false, false, 0, key);
        target.dispatchEvent(evt);

        fxKeyboard._shiftUnpress();

    },

    // send a special event to a focused element
    _dispatchAltKey: function (key, target) {
        if (!target) return;
        var evt = gBrowser.selectedBrowser.contentDocument.createEvent("KeyboardEvent");
        evt.initKeyEvent("keypress", true, true, null, false, false, false, false, key, 0);
        target.dispatchEvent(evt);
        evt = gBrowser.selectedBrowser.contentDocument.createEvent("KeyboardEvent");
        evt.initKeyEvent("keyup", true, true, null, false, false, false, false, key, 0);
        target.dispatchEvent(evt);
    },

    state: 0,
    // switch state if needed
    setState: function (state, keep) {
        /*
            states:
            0 - normal
            1 - shift on
            2 - alt
            3 - alt+shift
         */
        if (state === fxKeyboard.state)
            return;

        fxKeyboard.state = state;
        fxKeyboard._renderKeyboard();
    },

    _shiftLock: false,
    pressShift: function () {
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

    // shift may be just single use - unpress it if needed
    _shiftUnpress: function () {
        if (!fxKeyboard._shiftLock) {
            if (fxKeyboard.state === 1) {
                fxKeyboard.setState(0);
            } else if (fxKeyboard.state === 3) {
                fxKeyboard.setState(2);
            } else return;
            fxKeyboard._setKeyActive('shift', 0);
        }
    },

    pressAlt: function () {
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

    // toggle button classes, we dont need a redraw for this
    _setKeyActive: function (keyClass, state) {
        // 0 not active
        // 1 active
        // 2 locked
        var buttons = document.querySelectorAll('.fxKeyboardButton.'+keyClass);
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
    }


};

window.addEventListener("load", function () {
    fxKeyboard.startUp();
}, false);

// END fxKeyboard