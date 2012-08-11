# Mousetrap

Mousetrap is a simple library for handling keyboard shortcuts in Javascript.

It is around **1.7kb** minified and gzipped and **3kb** minified, has no external dependencies, and has been tested in the following browsers:

- Internet Explorer 6+
- Safari
- Firefox
- Chrome

It has support for ``keypress``, ``keydown``, and ``keyup`` events on specific keys, keyboard combinations, or key sequences.

If you would like to donate to help support Mousetrap development use [Gittip](https://www.gittip.com/ccampbell).

## Getting started

1.  Include mousetrap on your page before the closing ``</body>`` tag

    ```html
    <script src="/path/to/mousetrap.min.js"></script>
    ```

2.  Add some keyboard events to listen for

    ```html
    <script>
        // single keys
        Mousetrap.bind('4', function() { console.log('4'); });
        Mousetrap.bind("?", function() { console.log('show shortcuts!'); });
        Mousetrap.bind('esc', function() { console.log('escape'); }, 'keyup');

        // combinations
        Mousetrap.bind('command+shift+K', function() { console.log('command shift k'); });

        // map multiple combinations to the same callback
        Mousetrap.bind(['command+k', 'ctrl+k'], function() {
            console.log('command k or control k');

            // return false to prevent default browser behavior
            // and stop event from bubbling
            return false;
        });

        // gmail style sequences
        Mousetrap.bind('g i', function() { console.log('go to inbox'); });
        Mousetrap.bind('* a', function() { console.log('select all'); });

        // konami code!
        Mousetrap.bind('up up down down left right left right b a enter', function() {
            console.log('konami code');
        });
    </script>
    ```

## Why Mousetrap?

There are a number of other similar libraries out there so what makes this one different?

- There are no external dependencies, no framework is required
- You are not limited to ``keydown`` events (You can specify ``keypress``, ``keydown``, or ``keyup`` or let Mousetrap choose for you).
- You can bind key events directly to special keys such as ``?`` or ``*`` without having to specify ``shift+/`` or ``shift+8`` which are not consistent across all keyboards
- It works with international keyboard layouts
- You can bind Gmail like key sequences in addition to regular keys and key combinations
- You can programatically trigger key events with the ``trigger()`` method
- It works with the numeric keypad on your keyboard
- The code is well documented/commented

## Documentation

Full documentation can be found at http://craig.is/killing/mice


Mousetrap

A simple library for handling keyboard shortcuts in Javascript.
Try pressing some of the keys here:

// single keys
Mousetrap.bind('4', function() { highlight(2); });
Mousetrap.bind('x', function() { highlight(3); }, 'keyup');

// combinations
Mousetrap.bind('command+shift+k', function(e) {
    highlight([6, 7, 8, 9]);
    return false;
});

Mousetrap.bind(['command+k', 'ctrl+k'], function(e) {
    highlight([11, 12, 13, 14]);
    return false;
});

// gmail style sequences
Mousetrap.bind('g i', function() { highlight(17); });
Mousetrap.bind('* a', function() { highlight(18); });

// konami code!
Mousetrap.bind('up up down down left right left right b a enter', function() {
    highlight([21, 22, 23]);
});
INTRODUCTION

Mousetrap is a standalone library with no external dependencies. It weighs in at around 1.7kb minified and gzipped and 3kb minified.

What are you waiting for? Throw away your mouse and download it now.

If you like this and want to donate to help support development 

BROWSER SUPPORT

Mousetrap has been tested and should work in

Internet Explorer 6+
Safari
Firefox
Chrome
SUPPORTED KEYS

For modifier keys you can use shift, ctrl, alt, option, meta, and command.

Other special keys are backspace, tab, enter, return, capslock, esc, escape, space, pageup, pagedown, end, home, left, up, right, down, ins, and del.

Any other key you should be able to reference by name like a, /, $, *, or =.

API REFERENCE

I. Mousetrap.bind

The bind method is the main call you will be making. This will bind a specified keyboard command to a callback method.

Single key

Mousetrap.bind('/', _focusSearch);
There is a third argument you can use to specify the type of event to listen for. It can be keypress, keydown or keyup.

It is recommended that you leave this argument out if you are unsure. Mousetrap will look at the keys you are binding and determine whether it should default to keypress or keydown.

Combination of keys

Mousetrap.bind('ctrl+s', function(e) {
    _saveDraft();
});
If you want to bind multiple key commands to the same callback you can pass in an array for the first argument:

Mousetrap.bind(['ctrl+s', 'command+s'], function(e) {
    _saveDraft();
});
Note that modifier keys are not explicitly tracked but rather are referenced using e.shiftKey, e.metaKey, e.ctrlKey, and e.altKey.

This is more reliable than tracking because if you are holding one of the modifier keys down when you focus the window the browser won't get a keydown event for that key.

Sequence of keys

Mousetrap.bind('* a', _selectAll, 'keydown');
This feature was inspired by Gmail. Any keys separated by a space will be considered a sequence. If you type each key in order the final one in the sequence will trigger the callback. If you type a key not in the sequence or wait too long the sequence will reset.

You can also make a sequence that includes key combinations within it.

Mousetrap.bind('g o command+enter', function() { /* do something */ });
Any key events that would normally fire for keys within a sequence will not fire if they are pressed within the context of that sequence.

For example if you have a keydown listener for the o key and you press o as part of the sequence above, the event for o on its own will not fire. As soon as the sequence is broken it will fire again.

It is important to note that Mousetrap can get very confused if you have a single key handler that uses the same key that a sequence starts with. This is because it can't tell if you are starting the sequence or if you are pressing that key on its own.

Shift key

Mousetrap.bind('?', function() { alert('keyboard shortcuts'); });
Keys that require shift are handled magically for you. They should just work. With keypress events they will try to match the character and for keyup and keydown there is a mapping to allow them to work.

Note that keypress is the most reliable for non US keyboards

Text fields

By default all keyboard events will not fire if you are inside of a textarea, input, or select to prevent undesirable things from happening.

If for whatever reason you want them to you can add the class mousetrap to the element.

<textarea name="message" class="mousetrap"></textarea>
Overwriting a specific event

If you bind the same key event later on in your script it should overwrite the original callback you had specified.

Stopping the default behavior

This is not usually a good practice, but sometimes you may want to overwrite the default behavior of a keyboard combination in the browser.

For example let's say you want to focus a form input without typing that key into it or you have a text input that you want to save when the user presses ctrl+s. You have a couple ways you can achieve this.

You can explicitly prevent the default behavior:

Mousetrap.bind(['ctrl+s', 'meta+s'], function(e) {
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        // internet explorer
        e.returnValue = false;
    }
    _saveDraft();
});
You can see here that the callback function gets passed the original key event that triggered it.

As a convenience you can also return false in your callback:

Mousetrap.bind(['ctrl+s', 'meta+s'], function(e) {
    _saveDraft();
    return false;
});
Returning false here works the same way as jQuery's return false. It prevents the default action and stops the event from bubbling up.

II. Mousetrap.unbind

Mousetrap.unbind('?');
This method will unbind a single keyboard event. You should pass in the key combination exactly as it was passed in originally to bind.

III. Mousetrap.trigger

Mousetrap.trigger('esc');
Any keyboard event that has been bound can be triggered by passing in the string you used when you bound it originally.

Note that this is not actually triggering a key event in the browser. It is simply firing the event you bound to that key within mousetrap

This method also accepts an optional argument for what type of event to trigger

IV. Mousetrap.reset

Mousetrap.reset();
The reset method will remove anything you have bound to mousetrap. This can be useful if you want to change contexts in your application without refreshing the page in your browser. You can ajax in a new page, call reset, and then bind the key events needed for that page.

Internally mousetrap keeps an associative array of all the events to listen for so reset does not actually remove or add event listeners on the document. It just sets the array to be empty.

SUPPORT AND BUGS

If you are having trouble, have found a bug, or want to contribute don't be shy.
Open a ticket on Github.

created by Craig Campbell in 2012