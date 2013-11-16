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

        var rx = null;

        if (null === domain) {
            domain = 'messages';
        }

        var message = null;

        // Search for phrase match:
        if (this.translations.hasOwnProperty(locale) && this.translations[locale].hasOwnProperty(domain) && this.translations[locale][domain].hasOwnProperty(this.toString())) {
            message = this.translations[locale][domain][this.toString()];
        }

        // No translation found:
        if (message === null) {
            message = this.toString();
        }

        // Optional partial arguments:
        for (var key in arguments) {
            if (arguments.hasOwnProperty(key)) {
                rx = new RegExp(key, 'g');
                message = message.replace(rx, arguments[key]);
            }
        }

        return message.toString();
    };

    String.prototype.transchoiceException = function () {
        var message = 'Unable to choose a translation for "__PHRASE__" with locale "__LOCALE__". Double check that this translation has the correct plural options (e.g. "There is one apple|There are %count% apples").';
        message = message.replace(/__PHRASE__/, this.toString());
        message = message.replace(/__LOCALE__/, this.locale);

        return message;
    };

    String.prototype.transchoice = function (count, arguments, domain, locale) {

        count = count || 0;
        arguments = arguments || {};
        arguments['%count%'] = count;
        domain = domain || null;
        locale = locale || this.locale;

        if (null === domain) {
            domain = 'messages';
        }

        var message = this.trans(arguments, domain, locale);

        return MessageSelector.choose(message, count, locale);
    }
}


// /vendor/symfony/symfony/src/Symfony/Component/Translation/Interval.php

/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// namespace Symfony\Component\Translation;

/**
 * Tests if a given number belongs to a given math interval.
 *
 * An interval can represent a finite set of numbers:
 *
 *  {1,2,3,4}
 *
 * An interval can represent numbers between two numbers:
 *
 *  [1, +Inf]
 *  ]-1,2[
 *
 * The left delimiter can be [ (inclusive) or ] (exclusive).
 * The right delimiter can be [ (exclusive) or ] (inclusive).
 * Beside numbers, you can use -Inf and +Inf for the infinite.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 *
 * @see    http://en.wikipedia.org/wiki/Interval_%28mathematics%29#The_ISO_notation
 */
Interval = {
    /**
     * Tests if the given number is in the math interval.
     *
     * @param {integer} $number   A number
     * @param {string}  $interval An interval
     *
     * @return {Boolean}
     *
     * @throws {string}
     */
    test: function ($number, $interval) {
        $interval = $interval.trim();

        var $rx = new XRegExp(Interval.getIntervalRegexp(), 'x');
        var $matches = XRegExp.exec($interval, $rx);

        if ($matches === null) {
            throw '"%s" is not a valid interval.'.replace(/%s/, $interval);
        }

        if ($matches[1]) {
            var temp = $matches[2].split(',');
            while (temp.length) {
                var $n = temp.shift();
                if ($number == $n) {
                    return true;
                }
            }
        } else {
            var $leftNumber = this.convertNumber($matches['left']);
            var $rightNumber = this.convertNumber($matches['right']);

            return ('[' === $matches['left_delimiter'] ? $number >= $leftNumber : $number > $leftNumber)
                && (']' === $matches['right_delimiter'] ? $number <= $rightNumber : $number < $rightNumber)
                ;
        }

        return false;
    },

    /**
     * Returns a Regexp that matches valid intervals.
     *
     * @return string A Regexp (without the delimiters)
     */
    getIntervalRegexp: function () {
        var rx = ''
            + '({\\s*(\\-?\\d+(\\.\\d+)?[\\s*,\\s*\\-?\\d+(\\.\\d+)?]*)\\s*})'
            + '|'
            + '(?<left_delimiter>[\\[\\]])\\s*(?<left>-Inf|\\-?\\d+(\\.\\d+)?)\\s*,\\s*(?<right>\\+?Inf|\\-?\\d+(\\.\\d+)?)\\s*(?<right_delimiter>[\\[\\]])'
            + '';

        return rx;
    },

    convertNumber: function ($number) {
        if ('-Inf' === $number) {
            return -Infinity;
        } else if ('+Inf' === $number || 'Inf' === $number) {
            return Infinity;
        }

        return parseFloat($number);
    }
};

PluralizationRules = {
    get: function ($number, $locale) {
        return ($number == 1) ? 0 : 1;
    }
};

// /vendor/symfony/symfony/src/Symfony/Component/Translation/MessageSelector.php

/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// namespace Symfony\Component\Translation;

/**
 * MessageSelector.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 * @author Bernhard Schussek <bschussek@gmail.com>
 *
 * @api
 */
MessageSelector = {
    /**
     * Given a message with different plural translations separated by a
     * pipe (|), this method returns the correct portion of the message based
     * on the given number, locale and the pluralization rules in the message
     * itself.
     *
     * The message supports two different types of pluralization rules:
     *
     * interval: {0} There are no apples|{1} There is one apple|]1,Inf] There are %count% apples
     * indexed:  There is one apple|There are %count% apples
     *
     * The indexed solution can also contain labels (e.g. one: There is one apple).
     * This is purely for making the translations more clear - it does not
     * affect the functionality.
     *
     * The two methods can also be mixed:
     *     {0} There are no apples|one: There is one apple|more: There are %count% apples
     *
     * @param {string}  $message The message being translated
     * @param {integer} $number  The number of items represented for the message
     * @param {string}  $locale  The locale to use for choosing
     *
     * @return {string}
     *
     * @throws {string}
     *
     * @api
     */
    choose: function ($message, $number, $locale) {
        $parts = $message.split('|');
        $explicitRules = {};
        $standardRules = [];

        for (var $i = 0; $i < $parts.length; $i++) {
            var $part = $parts[$i];
            $part = $part.trim();

            var $rx = new XRegExp('^(?<interval>' + Interval.getIntervalRegexp() + ')\\s*(?<message>.*?)$', 'x');
            var $matches = XRegExp.exec($part, $rx);


            if ($matches !== null) {
                $explicitRules[$matches['interval']] = $matches['message'];
            } else {
                $rx = new XRegExp('^\\w+\\:\\s*(.*?)$', 'x');
                $matches = XRegExp.exec($part, $rx);

                if ($matches !== null) {
                    $standardRules.push($matches[1]);
                } else {
                    $standardRules.push($part);
                }
            }
        }

        // try to match an explicit rule, then fallback to the standard ones
        for (var $interval in $explicitRules) {
            var $m = $explicitRules[$interval];

            if (Interval.test($number, $interval)) {
                return $m;
            }
        }

        $position = PluralizationRules.get($number, $locale);

        if (typeof $standardRules[$position] === 'undefined') {
            // when there's exactly one rule given, and that rule is a standard
            // rule, use this rule
            if (1 === $parts.length && typeof $standardRules[0] !== 'undefined') {
                return $standardRules[0];
            }

            throw $message.transchoiceException();
        }

        return $standardRules[$position];
    }
};
