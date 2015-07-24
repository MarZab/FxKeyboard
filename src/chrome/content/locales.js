"use strict";
/*
 FxKeyboard Locales
 Version: 3.0.0
 Author:  Marko Zabreznik
 Date:    23 July 2015
 Purpose: A virtual keyboard for Firefox
 */

var FxKeyboardLocales = {

    'en-small': {
        name: 'English Small',
        locale: 'en',
        font: 'monospace',
        row1: [
            [{'label': "\u21E5", special: 'tab', flex:'1', class:'fxKeyboardActionKeys'}], // tab
            ['q',   'Q',    '1',   {label: 'Tab', string: '\t', flex:1}],
            ['w',   'W',    '2',   ''],
            ['e',   'E',    '3',   ''],
            ['r',   'R',    '4',   ''],
            ['t',   'T',    '5',   ''],
            ['y',   'Y',    '6',   ''],
            ['u',   'U',    '7',   ''],
            ['i',   'I',    '8',   ''],
            ['o',   'O',    '9',   ''],
            ['p',   'P',    '0',   ''],
            [{'label': "\u232B", special: 8, flex: '1', type:'repeat', class:'fxKeyboardActionKeys'}] // backspace
        ],
        row2: [
            [{'label': "\u2325", flex: '3', special: 'alt', class:'fxKeyboardActionKeys alt'}], // alt
            ['a',   'A',    '#',    '€'],
            ['s',   'S',    '$',    '£'],
            ['d',   'D',    '|',    '¥'],
            ['f',   'F',    '^' ,   '¤'],
            ['g',   'G',    '&',    '~'],
            ['h',   'H',    '(',    '`'],
            ['j',   'J',    ')',    ''],
            ['k',   'K',    '*',    '♥'],
            ['l',   'L',    '%',    '✮'],
            [{'label': "\u23ce", flex: '3', special: 13, class:'fxKeyboardActionKeys'}] // enter
        ],
        row3: [
            [{'label': "\u21E7", flex: '5', special: 'shift', class:'fxKeyboardActionKeys shift'}], // shift / caps
            ['z',   'Z',    '\'',   ''],
            ['x',   'X',    '"',    ''],
            ['c',   'C',    '/',     '['],
            ['v',   'V',    '\\',    ']'],
            ['b',   'B',    '<',    '{'],
            ['n',   'N',    '>',     '}'],
            ['m',   'M',    '+',    ''],
            [',',   ';',    '-',    ''],
            ['.',   ':',    '×',    ''],
            ['?',   '!',    '÷',    '¡'],
            ['@',   '_',    '=',    '¿']
        ],
        row4: [
            [{'label': " ", flex: '11', char: 32}] // space
        ]
    }

};