'use strict';

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Mention = function () {
    /**
     * @class Mention
     * @classdesc Allows using a symbol to display options
     *
     * @param {Object} settings - Options to initialize the component with
     * @param {HTMLElement} settings.input - The textarea to watch {@link Component#input}
     * @param {HTMLElement} settings.optionList - Element to display options when matched {@link Component#optionList}
     * @param {Array} settings.options - Array of options. Options can have properties {@link Component#options}
     * @param {String} [settings.symbol="@"] - The symbol that initials the option list {@link Component#symbol}
     * @param {Function} [settings.match] - The function used to match options {@link Component#match}
     * @param {Function} [settings.template] - The template function outputs the innerHTML of the optionlist {@link Component#template}
     */
    function Mention(settings) {
        _classCallCheck(this, Mention);

        this.options = settings.options || [];
        this.input = settings.input;
        this.reverse = settings.reverse;

        this.symbol = settings.symbol || '@';
        this.cursorPosition = 0;
        this.hover = 0;
        this.showingOptions = false;
        this.upDownStay = 0;
        this.wordAtCursor = {};
        this.update = settings.update || function () {};
        this.match = settings.match || this.match;
        this.template = settings.template || this.template;
        this.startsWith = settings.startsWith || this.startsWith;
        this.html = {
            input: undefined,
            display: undefined,
            wrapper: undefined,
            optionsList: undefined,
            options: [],
            spans: []
        };
        this.setupHTML();
        this.listen();
    }

    /**
     * Function used to match options based on the word
     * @param {String} [word] - The current word ex. @test
     * @param {String} [option] - The options being looped
     * @return {boolean} - If the word matches the option
     */


    _createClass(Mention, [{
        key: 'match',
        value: function match(word, option) {
            var optionText = option.name || option;
            return optionText.toLowerCase() == word.toLowerCase();
        }

        /**
         * Called to see if option starts with the word
         * @param {String} [word] - The current word ex. @test
         * @param {String} [option] - The options being looped
         * @return {boolean} - If the word starts with the option
         */

    }, {
        key: 'startsWith',
        value: function startsWith(word, option) {
            var optionText = option.name || option;
            return optionText.toLowerCase().startsWith(word.toLowerCase());
        }

        /**
         * Function returns the template (innerHTML) that will be used for each option
         * @param {String} [option] - The options being looped
         * @return {String} - The innerHTM
         */

    }, {
        key: 'template',
        value: function template(option) {
            return option.name || option;
        }

        /**
         * Sets up the HTML. Wrapper, Display, OptionsList, Options
         */

    }, {
        key: 'setupHTML',
        value: function setupHTML() {
            this.html.input = this.input;

            // Global wrapper
            this.html.wrapper = document.createElement('div');
            this.html.wrapper.classList.add('mention-wrapper');
            if(this.html.input) {
                this.html.input.parentElement.insertBefore(this.html.wrapper, this.html.input);
                this.html.wrapper.appendChild(this.html.input);
            }

            // Options
            this.html.optionsList = document.createElement('div');
            this.html.optionsList.classList.add('mention-options');
            this.html.optionsList.classList.add('x-shadow');
            this.html.optionsList.classList.add('border-radius');
            this.html.wrapper.appendChild(this.html.optionsList);
            if (this.reverse) {
                this.html.optionsList.classList.add('mention-options-reverse');
                this.html.wrapper.insertBefore(this.html.optionsList, this.html.wrapper.firstChild);
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var option = _step.value;

                    var optionElement = document.createElement('div');
                    optionElement.classList.add('mention-option');
                    optionElement.innerHTML = this.template(option);
                    optionElement.setAttribute('mentiondata', JSON.stringify(option));
                    this.html.options.push(optionElement);
                    this.html.optionsList.appendChild(optionElement);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        /**
         * Begins listening for events on the input and options
         */

    }, {
        key: 'listen',
        value: function listen() {
            var _this = this;

            this.html.input.addEventListener('input', function () {
                _this.onEventInput();
            });
            this.html.input.addEventListener('keydown', function (e) {
                _this.onEventKeyDown(e);
            });
            this.html.input.addEventListener('keyup', function (e) {
                _this.onEventKeyUp(e);
            });
            this.html.options.forEach(function (o) {
                o.addEventListener('click', function (e) {
                    _this.onEventOptionClick(e.target);
                });
            });
        }

        /**
         * Called when  on input.addEventListener('input')
         * @param {Event} e - the event passed
         */

    }, {
        key: 'getCaretPosition',
        value: function getCaretPosition(element) {
            var caretOffset = 0;
            var doc = element.ownerDocument || element.document;
            var win = doc.defaultView || doc.parentWindow;
            var sel;
            if (typeof win.getSelection != "undefined") {
                sel = win.getSelection();
                if (sel.rangeCount > 0) {
                    var range = win.getSelection().getRangeAt(0);
                    var preCaretRange = range.cloneRange();
                    preCaretRange.selectNodeContents(element);
                    preCaretRange.setEnd(range.endContainer, range.endOffset);
                    caretOffset = preCaretRange.toString().length;
                }
            } else if ((sel = doc.selection) && sel.type != "Control") {
                var textRange = sel.createRange();
                var preCaretTextRange = doc.body.createTextRange();
                preCaretTextRange.moveToElementText(element);
                preCaretTextRange.setEndPoint("EndToEnd", textRange);
                caretOffset = preCaretTextRange.text.length;
            }
            return caretOffset;
        }
    }, {
        key: 'onEventInput',
        value: function onEventInput() {
            this.update();
        }

        /**
         * Called when  on input.addEventListener('keyup')
         * @param {Event} e - the keyboard event passed
         */

    }, {
        key: 'onEventKeyDown',
        value: function onEventKeyDown(e) {
            this.upDownStay = e.keyCode == 40 ? 1 : e.keyCode == 38 ? -1 : 0;
            if (this.reverse) this.upDownStay *= -1;
            if (this.upDownStay && this.showingOptions) e.preventDefault();
            if (e.keyCode == 13 && this.showingOptions) {
                e.preventDefault();
                var option = this.html.options.find(function (e) {
                    return e.classList.contains('hover');
                });
                if (option) this.onEventOptionClick(option);
            }
        }

        /**
         * Called when  on input.addEventListener('keydown')
         * @param {Event} e - the event passed
         */

    }, {
        key: 'onEventKeyUp',
        value: function onEventKeyUp() {
            this.cursorPositionChanged();
            this.setHoverOption();
        }

        /**
         * Called when option input.addEventListener('click')
         */

    }, {
        key: 'onEventOptionClick',
        value: function onEventOptionClick(optionEle) {
            var _this2 = this;
            var word = this.symbol + JSON.parse(optionEle.getAttribute('mentiondata')).name + ' ';
            // console.log(word);
            var splitInputValue = this.input.innerText.split('');
            splitInputValue.splice(this.wordAtCursor.index, this.wordAtCursor.word.length, word);
            var text = splitInputValue.join('');
            var tags = text.match(/@[^\s\\]+/gm);
            text = text.replace(/@[^\s\\]+/gm, function (value) {
                return _this2.parseOption(value);
            });
            this.input.innerHTML = text;
            this.input.focus();
            this.setCursorPosition(this.wordAtCursor.index + this.input.innerText.length);
            this.toggleOptionList(false);
            this.update();
        }

        /**
         * Cursor position changed. Check for input data and toggle options
         */

    }, {
        key: 'cursorPositionChanged',
        value: function cursorPositionChanged() {
            this.cursorPosition = this.getCaretPosition(this.input);
            this.wordAtCursor = this.readWordAtCursor({
                cursorPosition: this.cursorPosition,
                value: this.input.innerText
            });
            // var toggle = this.wordAtCursor.word.length && this.wordAtCursor.word[0] == this.symbol;
            // console.log(this.wordAtCursor.word.length);
            this.toggleOptionList(this.wordAtCursor.word.length && this.wordAtCursor.word[0] == this.symbol);
            this.showHideOptions();
        }

        /**
         * Show/Hide the options list
         * @param {Boolean} toggle - show or hide
         */

    }, {
        key: 'toggleOptionList',
        value: function toggleOptionList(toggle) {
            this.html.optionsList.classList.remove('show');
            if (toggle) this.html.optionsList.classList.add('show');
            this.showingOptions = toggle;
        }

        /**
         * Loop the options and show/hide options based on match function
         */

    }, {
        key: 'showHideOptions',
        value: function showHideOptions() {
            for (var option in this.options) {
                var word = this.wordAtCursor.word.replace(this.symbol, '');
                this.html.options[option].classList.remove('show');
                if (this.startsWith(word, this.options[option])) this.html.options[option].classList.add('show');
            }
        }

        /**
         * Using up/down arrow selects the next option
         */

    }, {
        key: 'setHoverOption',
        value: function setHoverOption() {
            var viewableOptions = this.html.options.filter(function (e) {
                e.classList.remove('hover');
                return e.classList.contains('show');
            });
            if (!viewableOptions.length) {
                this.toggleOptionList(false);
                return;
            }

            this.hover = this.upDownStay ? this.hover + this.upDownStay : 0;
            if (this.hover < 0) {
                this.hover = viewableOptions.length - 1;
            }
            if (this.hover == viewableOptions.length) {
                this.hover = 0;
            }
            viewableOptions[this.hover].classList.add('hover');
        }

        /**
         * Sets the cursor position in the text area
         * @param {Number} position - the position
         */

    }, {
        key: 'createRange',
        value: function createRange(node, chars, range) {
            // if (!range) {
            range = document.createRange()
            range.selectNode(node);
            range.setStart(node, 0);
            // }

            if (chars.count === 0) {
                range.setEnd(node, chars.count);
            } else if (node && chars.count > 0) {
                if (node.nodeType === Node.TEXT_NODE) {
                    if (node.textContent.length < chars.count) {
                        chars.count -= node.textContent.length;
                    } else {
                        range.setEnd(node, chars.count);
                        chars.count = 0;
                    }
                } else {
                    for (var lp = 0; lp < node.childNodes.length; lp++) {
                        range = createRange(node.childNodes[lp], chars, range);

                        if (chars.count === 0) {
                            break;
                        }
                    }
                }
            }

            return range;
        }
    }, {
        key: 'setCursorPosition',
        value: function setCursorPosition(position) {
            if (position >= 0) {
                var selection = window.getSelection();
                var range = this.createRange(this.input, {
                    count: position
                });
                if (range) {
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        }

        /**
         * From the cursor positoin looks back to match the work and start/end position
         * @param {Object} data - Options to initialize the component with
         * @param {String} [data.value] - the string to search through
         * @param {Number} [data.cursorPosition] - The position of the cursor in the string
         */

    }, {
        key: 'readWordAtCursor',
        value: function readWordAtCursor(data) {
            var word = '',
                index = data.cursorPosition;
            var valueWithReplacedSpecial = data.value.replace(/\n/g, ' ');

            while (index--) {
                var previousCharacter = valueWithReplacedSpecial[index];
                if (previousCharacter == ' ' || index < 0) break;
            }

            while (index++ < valueWithReplacedSpecial.length - 1) {
                var nextCharacter = valueWithReplacedSpecial[index];
                if (nextCharacter == ' ') break;
                word += nextCharacter;
            }
            return {
                index: Math.max(index - word.length, 0),
                word: word
            };
        }

        /**
         * Loops over the input value.
         * @return {matches[]} - Array of matches { word: word, index: index word is at}
         */

    }, {
        key: 'findMatches',
        value: function findMatches() {
            var inputValue = this.html.input.innerText.split('').concat([' ']);
            var words = [];

            var currentWord = '';
            for (var index in inputValue) {
                var letter = inputValue[index];
                var lastLetter = inputValue[index - 1] || ' ';
                var lastLetterIsSpace = [' ', '\\n'].indexOf(lastLetter) > -1 || lastLetter.charCodeAt(0) == 10;
                var canStartWord = letter == this.symbol && lastLetterIsSpace;

                if ((canStartWord || currentWord.length) && letter != ' ') currentWord += letter;

                if (currentWord.length && letter == ' ') {
                    words.push({
                        word: currentWord,
                        index: Math.max(index - currentWord.length, 0)
                    });
                    currentWord = '';
                }
            }

            return words;
        }

        /**
         * Collects all the real matches
         */

    }, {
        key: 'collect',
        value: function collect() {
            var _this2 = this;

            return this.findMatches().filter(function (word) {
                return _this2.options.some(function (option) {
                    return _this2.match(word.word.replace(_this2.symbol, ''), option);
                });
            });
        }
    }, {
        key: 'parseOption',
        value: function parseOption(word) {
            var _this2 = this;
            for (var i = 0; i < this.options.length; i++) {
                if (this.options[i].name === word.substr(1)) {
                    var option = this.options[i];
                    switch (option.type) {
                        case 'user':
                            // var qtip = '<span>' + option.company_data.name + '</span><br><strong>' + option.full_name + '</strong>';
                            return '<a class="user_mention cursor-pointer" href="javascript:void(0);" data-object-id="' + option.id + '" data-object-type="' + option.type + '">' + this.symbol + option.name + "</a>"
                            // case 'cargo':
                            //     var qtip = '<strong>' + option.description + ' - ' + option.function+'</strong>';
                            //     return '<a class="cargo_mention cursor-pointer" data-qtip="' + qtip + '" href="javascript:void(0);" data-object-id="' + option.commodity_id + '" data-object-type="' + option.type + '">' + this.symbol + option.name + "</a>"
                            //     // code block

                            // case 'file':
                            //     return '<a class="cargo_mention cursor-pointer" href="javascript: void(0)" data-object-id="' + option.adocs_files_id + '" data-file-id="' + option.id + '" data-object-type="' + option.type + '">' + this.symbol + option.name + "</a>"

                            // case 'berth':
                            //     var qtip = '<span>' + option.description + '</span>';
                            //     return '<a class="cargo_mention cursor-pointer" href="javascript:void(0);" data-qtip="' + qtip + '" data-object-id="' + option.da_berth_id + '" data-object-type="' + option.type + '">' + this.symbol + option.name + "</a>"

                            // case 'supply':
                            //     var qtip = '<span>' + option.description + '</span>';
                            //     return '<a class="cargo_mention cursor-pointer" href="javascript:void(0);" data-qtip="' + qtip + '">' + this.symbol + option.name + "</a>"
                    }
                }
            }
        }
    }]);

    return Mention;
}();

export default Mention;