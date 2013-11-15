/**
 * String object translatable enhancement
 *
 * Implementation based on:
 * /vendor/symfony/symfony/src/Symfony/Bridge/Twig/Extension/TranslationExtension.php
 * /vendor/symfony/symfony/src/Symfony/Component/Translation/Translator.php
 * /vendor/symfony/symfony/src/Symfony/Component/Translation/MessageSelector.php
 */
if (typeof String.prototype.trans === 'undefined') {

    String.prototype.trans = function (arguments, domain, locale) {

        arguments = arguments || {};
        domain = domain || null;
        locale = locale || this.locale;

        if (null === domain) {
            domain = 'messages';
        }

        var phrase = this.toString();

        // Search for phrase match:
        if (this.translations.hasOwnProperty(domain) && typeof this.translations[domain].hasOwnProperty(phrase)) {
            phrase = this.translations[domain][phrase];
        }

        // No translation found:
        if (phrase === this.toString()) {
            return this.toString();
        }

        // Optional partial arguments:
        for (var key in arguments) {
            if (arguments.hasOwnProperty(key)) {
                var rx = new RegExp(key, 'g');
                phrase = phrase.replace(rx, arguments[key]);
            }
        }

        return phrase.toString();
    };

    String.prototype.transchoice = function (count, arguments, domain, locale) {

        count = count || 0;
        arguments = arguments || {};
        arguments['%count%'] = count;
        domain = domain || null;
        locale = locale || this.locale;

        var rx = null;

        if (null === domain) {
            domain = 'messages';
        }

        var mainphrase = this.toString();

        // Search for phrase match:
        if (this.translations.hasOwnProperty(domain) && this.translations[domain].hasOwnProperty(mainphrase)) {
            mainphrase = this.translations[domain][mainphrase];
        }

        // Optional partial arguments:
        for (var key in arguments) {
            if (arguments.hasOwnProperty(key)) {
                rx = new RegExp(key, 'g');
                mainphrase = mainphrase.toString().replace(rx, arguments[key]);
            }
        }

        var wordmap = {
            'none:': '{0}',
            'one:': '{1}',
            'more:': ']1,Inf]'
        };

        var temp = mainphrase.split('|');

        var parts = {};
        var counter = 0;

        for (var i = 0; i < temp.length; i++) {
            var chunk = temp[i].trim();
            rx = new RegExp('^((?:one:)|(?:more:)|(?:{[^}]+})|(?:(?:])(?:.*?)(?:])))(.*?)$', 'mg');
            var range = chunk.replace(rx, '$1');
            chunk = chunk.replace(rx, '$2');

            if (range === chunk) {
                range = counter > 0 ? '{' + count + '}' : '{1}';
                counter++;
            }

            chunk = chunk.trim();
            range = range.replace(/\s*/g, '');
            range = wordmap.hasOwnProperty(range) ? wordmap[range] : range;
            range = range.replace(/{(\d+)}/, '$1');

            parts[range] = chunk;
        }

        var phrase = null;

        // Simple numeric value:
        if (parts.hasOwnProperty(count)) {
            return parts[count].toString();
        }

        function parseValue(value) {
            switch (value) {
                case '-Inf':
                    return -Infinity;
                case '+Inf':
                    return Infinity;
                case 'Inf':
                    return Infinity;
            }

            return parseFloat(value);
        }

        // Range match:
        for (var index in parts) {
            if (parts.hasOwnProperty(index) && isNaN(index)) {
                var r = index.split(',');

                var left = {
                    operator: parseLeftOperator(r[0].replace(/^(.)(.*?)$/, '$1')),
                    value: parseValue(r[0].replace(/^(.)(.*?)$/, '$2'))
                };

                var right = {
                    operator: parseRightOperator(r[1].replace(/^(.*?)(.)$/, '$2')),
                    value: parseValue(r[1].replace(/^(.*?)(.)$/, '$1'))
                };

                if (left.operator(count) && right.operator(count)) {
                    phrase = parts[index];
                    break;
                }
            }
        }

        console.log([this.toString(), mainphrase, count, phrase]);

        function parseLeftOperator(operator) {
            switch (operator) {
                case ']':
                    return function (val) {
                        return this.value !== -Infinity && this.value !== Infinity ? val > this.value : false;
                    };
                case '[':
                    return function (val) {
                        return val >= this.value;
                    };
            }

            return function () {
                return false;
            }
        }

        function parseRightOperator(operator) {
            switch (operator) {
                case ']':
                    return function (val) {
                        return val <= this.value;
                    };
                case '[':
                    return function (val) {
                        return this.value !== -Infinity && this.value !== Infinity ? val > this.value : false;
                    };
            }

            return function () {
                return false;
            }
        }

        return phrase;
    }
}
