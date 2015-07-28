FxKeyboard - A virtual keyboard for Firefox
==================================================

A handy Firefox virtual keyboard for touchscreen use.

By Marko Zabreznik © since 2008, GPL 3

Version 3 in Alpha!
=========

![Screnshot](/Screenshot.jpg?raw=true "Screenshot")

Firefox Addon url: https://addons.mozilla.org/firefox/addon/fxkeyboard/

Features
--------------------------------------
- Auto-Close, Lock button
- Works on XUL (url, search field, etc..)
- Numbers and Special symbols with capslock
- Locales, switching
- Works on fullscreen
- DOES NOT WORK WITH PLUGINS (Flash etc.)


Settings (via about:config)
--------------------------------------
pref("extensions.fxkeyboard.repeat_all", true);
pref("extensions.fxkeyboard.locale_default", '');
pref("extensions.fxkeyboard.locale_picker", '');

Locales
--------------------------------------
Currently supported locales (check hisory for credits)
- en-US
- de-DE
- da-DA
- Eastern slavic

For missing locales, edit src/chrome/content/locales.js and open a Issue.


