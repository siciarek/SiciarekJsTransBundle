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

        if (domain === null) {
            domain = 'messages';
        }

        var phrase = null;

        // Search for phrase match:
        if (this.translations.hasOwnProperty(locale) && this.translations[locale].hasOwnProperty(domain) && this.translations[locale][domain].hasOwnProperty(this.toString())) {
            phrase = this.translations[locale][domain][this.toString()];
        }

        // No translation found:
        if (phrase === null) {
            phrase = this.toString();
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

        var exception = 'Unable to choose a translation for "__PHRASE__" with locale "__LOCALE__". Double check that this translation has the correct plural options (e.g. "There is one apple|There are %count% apples").';
        exception.replace(/__PHRASE__/, this.toString());
        exception.replace(/__LOCALE__/, this.locale);

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

        var temp = mainphrase.split('|');

        if (temp.length === 1) {
            return mainphrase;
        }

        var wordmap = {
            'none:': '{0}',
            'one:': '{1}',
            'more:': ']1,Inf]'
        };

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
