"use strict";
/*
 FxKeyboard Locales
 Version: 3.0.0
 Author:  Marko Zabreznik
 Date:    23 July 2015
 Purpose: A virtual keyboard for Firefox
 */

if (typeof FxKeyboardLocales === 'undefined')
    var FxKeyboardLocales = {};

FxKeyboardLocales.en = {
    name: 'English',
    locale: 'en',
    defaultFlex: 10,
    main: [[
        [{
            'label': "\u21E5",
            special: 'tab',
            flex: 10,
            class: 'fxKeyboardActionKeys tab',
            'tooltiptext': 'Go to next input'
        }], // tab
        ['q', 'Q', '1', {label: 'Tab', string: '\t', flex: 10}],
        ['w', 'W', '2', ''],
        ['e', 'E', '3', ''],
        ['r', 'R', '4', ''],
        ['t', 'T', '5', ''],
        ['y', 'Y', '6', ''],
        ['u', 'U', '7', ''],
        ['i', 'I', '8', ''],
        ['o', 'O', '9', ''],
        ['p', 'P', '0', ''],
        [{'label': "\u232B", special: 8, flex: 10, type: 'repeat', class: 'fxKeyboardActionKeys backspace'}] // backspace
    ], [
        [{'label': "\u2325", flex: 15, special: 'alt', class: 'fxKeyboardActionKeys alt'}], // alt
        ['a', 'A', '#', '€'],
        ['s', 'S', '$', '£'],
        ['d', 'D', '|', '¥'],
        ['f', 'F', '^', '¤'],
        ['g', 'G', '&', '~'],
        ['h', 'H', '(', '`'],
        ['j', 'J', ')', ''],
        ['k', 'K', '*', '♥'],
        ['l', 'L', '%', '✮'],
        [{'label': "\u23ce", flex: 15, special: 13, class: 'fxKeyboardActionKeys enter'}] // enter
    ], [
        [{'label': "\u21E7", flex: 20, special: 'shift', class: 'fxKeyboardActionKeys shift'}], // shift / caps
        ['z', 'Z', '\'', ''],
        ['x', 'X', '"', ''],
        ['c', 'C', '/', '['],
        ['v', 'V', '\\', ']'],
        ['b', 'B', '<', '{'],
        ['n', 'N', '>', '}'],
        ['m', 'M', '+', ''],
        [',', ';', '-', ''],
        ['.', ':', '×', ''],
        ['?', '!', '÷', '¡'],
        ['@', '_', '=', '¿']
    ], [
        [{
            'label': "\uD83C\uDF10",
            special: 'toggleLocale',
            flex: 10,
            class: 'fxKeyboardActionKeys toggleLocale narrow',
            'tooltiptext': 'Toggle locale'
        }], // keep open
        [{'label': "", flex: 50, char: 32}], // space
        [{
            'label': "\uD83D\uDD12",
            special: 'keepOpen',
            flex: 10,
            class: 'fxKeyboardActionKeys keepOpen narrow',
            'tooltiptext': 'Keep open'
        }] // keep open
    ]]
};

FxKeyboardLocales.de = {
    name: 'Deutsch',
    locale: 'de',
    defaultFlex: 10,
    main: [[
        [{
            'label': "\u21E5",
            special: 'tab',
            flex: 10,
            class: 'fxKeyboardActionKeys tab',
            'tooltiptext': 'Go to next input'
        }], // tab
        ['q', 'Q', '1', {label: 'Tab', string: '\t', flex: 10}],
        ['w', 'W', '2', ''],
        ['e', 'E', '3', ''],
        ['r', 'R', '4', ''],
        ['t', 'T', '5', ''],
        ['z', 'Z', '6', ''],
        ['u', 'U', '7', ''],
        ['i', 'I', '8', ''],
        ['o', 'O', '9', ''],
        ['p', 'P', '0', ''],
        ['ü', 'Ü', '', ''],
        ['ß', 'ẞ', '', ''],
        [{'label': "\u232B", special: 8, flex: 10, type: 'repeat', class: 'fxKeyboardActionKeys backspace'}] // backspace
    ], [
        [{'label': "\u2325", flex: 15, special: 'alt', class: 'fxKeyboardActionKeys alt'}], // alt
        ['a', 'A', '#', '€'],
        ['s', 'S', '$', '£'],
        ['d', 'D', '|', '¥'],
        ['f', 'F', '^', '¤'],
        ['g', 'G', '&', '~'],
        ['h', 'H', '(', '`'],
        ['j', 'J', ')', ''],
        ['k', 'K', '*', '♥'],
        ['l', 'L', '%', '✮'],
        ['ö', 'Ö', '', ''],
        ['ä', 'Ä', '', ''],
        [{'label': "\u23ce", flex: 15, special: 13, class: 'fxKeyboardActionKeys enter'}] // enter
    ], [
        [{'label': "\u21E7", flex: 20, special: 'shift', class: 'fxKeyboardActionKeys shift'}], // shift / caps
        ['y', 'Y', '\'', ''],
        ['x', 'X', '"', ''],
        ['c', 'C', '/', '['],
        ['v', 'V', '\\', ']'],
        ['b', 'B', '<', '{'],
        ['n', 'N', '>', '}'],
        ['m', 'M', '+', ''],
        [',', ';', '-', ''],
        ['.', ':', '×', ''],
        ['?', '!', '÷', '¡'],
        ['@', '_', '=', '¿']
    ], FxKeyboardLocales.en.main[3]
    ]
};

FxKeyboardLocales.da = {
    name: 'Dansk',
    locale: 'da',
    defaultFlex: 10,
    main: [[
        [{
            'label': "\u21E5",
            special: 'tab',
            flex: 10,
            class: 'fxKeyboardActionKeys tab',
            'tooltiptext': 'Go to next input'
        }], // tab
        ['q', 'Q', '1', {label: 'Tab', string: '\t', flex: 10}],
        ['w', 'W', '2', ''],
        ['e', 'E', '3', ''],
        ['r', 'R', '4', ''],
        ['t', 'T', '5', ''],
        ['y', 'Y', '6', ''],
        ['u', 'U', '7', ''],
        ['i', 'I', '8', ''],
        ['o', 'O', '9', ''],
        ['p', 'P', '0', ''],
        ['å', 'Å', '', ''],
        [{'label': "\u232B", special: 8, flex: 10, type: 'repeat', class: 'fxKeyboardActionKeys backspace'}] // backspace
    ], [
        [{'label': "\u2325", flex: 15, special: 'alt', class: 'fxKeyboardActionKeys alt'}], // alt
        ['a', 'A', '#', '€'],
        ['s', 'S', '$', '£'],
        ['d', 'D', '|', '¥'],
        ['f', 'F', '^', '¤'],
        ['g', 'G', '&', '~'],
        ['h', 'H', '(', '`'],
        ['j', 'J', ')', ''],
        ['k', 'K', '*', '♥'],
        ['l', 'L', '%', '✮'],
        ['æ', 'Æ', '', ''],
        ['ø', 'Ø', '', ''],
        [{'label': "\u23ce", flex: 15, special: 13, class: 'fxKeyboardActionKeys enter'}] // enter
    ], [
        [{'label': "\u21E7", flex: 20, special: 'shift', class: 'fxKeyboardActionKeys shift'}], // shift / caps
        ['z', 'Z', '\'', ''],
        ['x', 'X', '"', ''],
        ['c', 'C', '/', '['],
        ['v', 'V', '\\', ']'],
        ['b', 'B', '<', '{'],
        ['n', 'N', '>', '}'],
        ['m', 'M', '+', ''],
        [',', ';', '-', ''],
        ['.', ':', '×', ''],
        ['?', '!', '÷', '¡'],
        ['@', '_', '=', '¿']
    ], [
        [{
            'label': "\uD83C\uDF10",
            special: 'toggleLocale',
            flex: 10,
            class: 'fxKeyboardActionKeys toggleLocale narrow',
            'tooltiptext': 'Toggle locale'
        }], // keep open
        [{'label': "", flex: 50, char: 32}], // space
        [{
            'label': "\uD83D\uDD12",
            special: 'keepOpen',
            flex: 10,
            class: 'fxKeyboardActionKeys keepOpen narrow',
            'tooltiptext': 'Keep open'
        }] // keep open
    ]]
};

FxKeyboardLocales.sl = {
    name: 'South Slavic Latin',
    locale: 'sl',
    defaultFlex: 10,
    main: [[
        [{
            'label': "\u21E5",
            special: 'tab',
            flex: 10,
            class: 'fxKeyboardActionKeys tab',
            'tooltiptext': 'Go to next input'
        }], // tab
        ['q', 'Q', '1', {label: 'Tab', string: '\t', flex: 10}],
        ['w', 'W', '2', ''],
        ['e', 'E', '3', ''],
        ['r', 'R', '4', ''],
        ['t', 'T', '5', ''],
        ['z', 'Z', '6', ''],
        ['u', 'U', '7', ''],
        ['i', 'I', '8', ''],
        ['o', 'O', '9', ''],
        ['p', 'P', '0', ''],
        ['š', 'Š', '', ''],
        ['đ', 'Đ', '', ''],
        [{'label': "\u232B", special: 8, flex: 10, type: 'repeat', class: 'fxKeyboardActionKeys backspace'}] // backspace
    ], [
        [{'label': "\u2325", flex: 15, special: 'alt', class: 'fxKeyboardActionKeys alt'}], // alt
        ['a', 'A', '#', '€'],
        ['s', 'S', '$', '£'],
        ['d', 'D', '|', '¥'],
        ['f', 'F', '^', '¤'],
        ['g', 'G', '&', '~'],
        ['h', 'H', '(', '`'],
        ['j', 'J', ')', ''],
        ['k', 'K', '*', '♥'],
        ['l', 'L', '%', '✮'],
        ['č', 'Č', '', ''],
        ['ć', 'Ć', '', ''],
        ['ž', 'Ž', '', ''],
        [{'label': "\u23ce", flex: 15, special: 13, class: 'fxKeyboardActionKeys enter'}] // enter
    ], [
        [{'label': "\u21E7", flex: 20, special: 'shift', class: 'fxKeyboardActionKeys shift'}], // shift / caps
        ['y', 'Y', '\'', ''],
        ['x', 'X', '"', ''],
        ['c', 'C', '/', '['],
        ['v', 'V', '\\', ']'],
        ['b', 'B', '<', '{'],
        ['n', 'N', '>', '}'],
        ['m', 'M', '+', ''],
        [',', ';', '-', ''],
        ['.', ':', '×', ''],
        ['?', '!', '÷', '¡'],
        ['@', '_', '=', '¿']
    ],
        FxKeyboardLocales.en.main[3]
    ]
};


FxKeyboardLocales.ru = {
    name: 'Russian',
    locale: 'ru',
    defaultFlex: 10,
    main: [[
        [{
            'label': "\u21E5",
            special: 'tab',
            flex: 10,
            class: 'fxKeyboardActionKeys tab',
            'tooltiptext': 'Перейти к следующему'
        }], // tab
        ['й', 'Й', '1', {label: 'Tab', string: '\t', flex: 10}],
        ['ц', 'Ц', '2', ''],
        ['у', 'У', '3', ''],
        ['к', 'К', '4', ''],
        ['е', 'Е', '5', ''],
        ['н', 'Н', '6', ''],
        ['г', 'Г', '7', ''],
        ['ш', 'Ш', '8', ''],
        ['щ', 'Щ', '9', ''],
        ['з', 'З', '0', ''],
        ['х', 'Х', '', ''],
        ['ъ', 'Ъ', '', ''],
        [{'label': "\u232B", special: 8, flex: 10, type: 'repeat', class: 'fxKeyboardActionKeys backspace'}] // backspace
    ], [
        [{'label': "\u2325", flex: 15, special: 'alt', class: 'fxKeyboardActionKeys alt'}], // alt
        ['ф', 'Ф', '#', '€'],
        ['ы', 'Ы', '$', '£'],
        ['в', 'В', '|', '¥'],
        ['а', 'А', '^', '¤'],
        ['п', 'П', '&', '~'],
        ['р', 'Р', '(', '`'],
        ['о', 'О', ')', ''],
        ['л', 'Л', '*', '♥'],
        ['д', 'Д', '%', '✮'],
        ['ж', 'Ж', '', ''],
        ['э', 'Э', '', ''],
        [{'label': "\u23ce", flex: 15, special: 13, class: 'fxKeyboardActionKeys enter'}] // enter
    ], [
        [{'label': "\u21E7", flex: 20, special: 'shift', class: 'fxKeyboardActionKeys shift'}], // shift / caps
        ['я', 'Я', '\'', ''],
        ['ч', 'Ч', '"', ''],
        ['с', 'С', '/', '['],
        ['м', 'М', '\\', ']'],
        ['и', 'И', '<', '{'],
        ['т', 'Т', '>', '}'],
        ['ь', 'Ь', '+', ''],
        ['б', 'Б', '-', ''],
        ['ю', 'Ю', '×', ''],
        ['.', '.', '÷', '¡']
    ], [
        [{
            'label': "\uD83C\uDF10",
            special: 'toggleLocale',
            flex: 10,
            class: 'fxKeyboardActionKeys toggleLocale narrow',
            'tooltiptext': 'Переключить локаль'
        }], // keep open
        [{'label': "", flex: 50, char: 32}], // space
        [{
            'label': "\uD83D\uDD12",
            special: 'keepOpen',
            flex: 10,
            class: 'fxKeyboardActionKeys keepOpen narrow',
            'tooltiptext': 'Оставить открытым'
        }] // keep open
    ]]
};