/**
 * String object translatable enhancement
 *
 * Implementation based on:
 * /vendor/symfony/symfony/src/Symfony/Bridge/Twig/Extension/TranslationExtension.php
 * /vendor/symfony/symfony/src/Symfony/Component/Translation/Translator.php
 */
if (typeof String.prototype.trans === 'undefined') {

    String.prototype.trans = function (args, domain, locale) {
        'use strict';

        args = args || {};
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

        // Optional partial args:
        for (var key in args) {
            if (args.hasOwnProperty(key)) {
                rx = new RegExp(key, 'g');
                message = message.replace(rx, args[key]);
            }
        }

        return message.toString();
    };

    String.prototype.transchoiceException = function () {
        'use strict';

        var message = 'Unable to choose a translation for "__PHRASE__" with locale "__LOCALE__". Double check that this translation has the correct plural options (e.g. "There is one apple|There are %count% apples").';
        message = message.replace(/__PHRASE__/, this.toString());
        message = message.replace(/__LOCALE__/, this.locale);

        return message;
    };

    String.prototype.transchoice = function (count, args, domain, locale) {
        'use strict';

        count = count || 0;
        args = args || {};
        args['%count%'] = count;
        domain = domain || null;
        locale = locale || this.locale;

        if (null === domain) {
            domain = 'messages';
        }

        var message = this.trans(args, domain, locale);

        return MessageSelector.choose(message, count, locale);
    };
}


// /vendor\symfony\symfony\src\Symfony\Component\Translation\PluralizationRules.php

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
 * Returns the plural rules for a given locale.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
PluralizationRules =
{
// @codeCoverageIgnoreStart
    $rules: {},

    /**
     * Returns the plural position to use for the given locale and number.
     *
     * @param {number} $number The number
     * @param {string}  $locale The locale
     *
     * @return {number} The plural position
     */
    get: function ($number, $locale) {
        'use strict';

        if ("pt_BR" === $locale) {
// temporary set a locale for brazilian
            $locale = "xbr";
        }

        if ($locale.length > 3) {
            $locale = $locale.substr(0, -$locale.indexOf('_').length);
        }

        if (typeof this.$rules[$locale] !== 'undefined') {
            var temp = this.$rules[$locale];
            var $return = temp($number);

            if ($return.match(/^\d+$/) || $return < 0) {
                return 0;
            }

            return $return;
        }

        /*
         * The plural rules are derived from code of the Zend Framework (2010-09-25),
         * which is subject to the new BSD license (http://framework.zend.com/license/new-bsd).
         * Copyright (c) 2005-2010 Zend Technologies USA Inc. (http://www.zend.com)
         */
        switch ($locale) {
            case 'bo':
            case 'dz':
            case 'id':
            case 'ja':
            case 'jv':
            case 'ka':
            case 'km':
            case 'kn':
            case 'ko':
            case 'ms':
            case 'th':
            case 'tr':
            case 'vi':
            case 'zh':
                return 0;

            case 'af':
            case 'az':
            case 'bn':
            case 'bg':
            case 'ca':
            case 'da':
            case 'de':
            case 'el':
            case 'en':
            case 'eo':
            case 'es':
            case 'et':
            case 'eu':
            case 'fa':
            case 'fi':
            case 'fo':
            case 'fur':
            case 'fy':
            case 'gl':
            case 'gu':
            case 'ha':
            case 'he':
            case 'hu':
            case 'is':
            case 'it':
            case 'ku':
            case 'lb':
            case 'ml':
            case 'mn':
            case 'mr':
            case 'nah':
            case 'nb':
            case 'ne':
            case 'nl':
            case 'nn':
            case 'no':
            case 'om':
            case 'or':
            case 'pa':
            case 'pap':
            case 'ps':
            case 'pt':
            case 'so':
            case 'sq':
            case 'sv':
            case 'sw':
            case 'ta':
            case 'te':
            case 'tk':
            case 'ur':
            case 'zu':
                return ($number === 1) ? 0 : 1;

            case 'am':
            case 'bh':
            case 'fil':
            case 'fr':
            case 'gun':
            case 'hi':
            case 'ln':
            case 'mg':
            case 'nso':
            case 'xbr':
            case 'ti':
            case 'wa':
                return (($number === 0) || ($number === 1)) ? 0 : 1;

            case 'be':
            case 'bs':
            case 'hr':
            case 'ru':
            case 'sr':
            case 'uk':
                return (($number % 10 === 1) && ($number % 100 !== 11)) ? 0 : ((($number % 10 >= 2) && ($number % 10 <= 4) && (($number % 100 < 10) || ($number % 100 >= 20))) ? 1 : 2);

            case 'cs':
            case 'sk':
                return ($number === 1) ? 0 : ((($number >= 2) && ($number <= 4)) ? 1 : 2);

            case 'ga':
                return ($number === 1) ? 0 : (($number === 2) ? 1 : 2);

            case 'lt':
                return (($number % 10 === 1) && ($number % 100 !== 11)) ? 0 : ((($number % 10 >= 2) && (($number % 100 < 10) || ($number % 100 >= 20))) ? 1 : 2);

            case 'sl':
                return ($number % 100 === 1) ? 0 : (($number % 100 === 2) ? 1 : ((($number % 100 === 3) || ($number % 100 === 4)) ? 2 : 3));

            case 'mk':
                return ($number % 10 === 1) ? 0 : 1;

            case 'mt':
                return ($number === 1) ? 0 : ((($number === 0) || (($number % 100 > 1) && ($number % 100 < 11))) ? 1 : ((($number % 100 > 10) && ($number % 100 < 20)) ? 2 : 3));

            case 'lv':
                return ($number === 0) ? 0 : ((($number % 10 === 1) && ($number % 100 !== 11)) ? 1 : 2);

            case 'pl':
                return ($number === 1) ? 0 : ((($number % 10 >= 2) && ($number % 10 <= 4) && (($number % 100 < 12) || ($number % 100 > 14))) ? 1 : 2);

            case 'cy':
                return ($number === 1) ? 0 : (($number === 2) ? 1 : ((($number === 8) || ($number === 11)) ? 2 : 3));

            case 'ro':
                return ($number === 1) ? 0 : ((($number === 0) || (($number % 100 > 0) && ($number % 100 < 20))) ? 1 : 2);

            case 'ar':
                return ($number === 0) ? 0 : (($number === 1) ? 1 : (($number === 2) ? 2 : ((($number >= 3) && ($number <= 10)) ? 3 : ((($number >= 11) && ($number <= 99)) ? 4 : 5))));

            default:
                return 0;
        }
    },

    /**
     * Overrides the default plural rule for a given locale.
     *
     * @param {string} $rule   A PHP callable
     * @param {string} $locale The locale
     *
     * @throws {string}
     */
    set: function ($rule, $locale) {
        'use strict';

        if ("pt_BR" === $locale) {
// temporary set a locale for brazilian
            $locale = "xbr";
        }

        if ($locale.length > 3) {
            $locale = $locale.substr(0, -$locale.indexOf('_').length);
        }

        if (typeof $rule !== 'function') {
            throw 'The given rule can not be called';
        }

        this.$rules[$locale] = $rule;
    }

// @codeCoverageIgnoreEnd
};

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
     * @param {number} $number   A number
     * @param {string}  $interval An interval
     *
     * @return {boolean}
     *
     * @throws {string}
     */
    test: function ($number, $interval) {
        'use strict';

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
                if ($number === parseInt($n)) {
                    return true;
                }
            }
        } else {
            var $leftNumber = this.convertNumber($matches.left);
            var $rightNumber = this.convertNumber($matches.right);

            return ('[' === $matches.left_delimiter ? $number >= $leftNumber : $number > $leftNumber) && (']' === $matches.right_delimiter ? $number <= $rightNumber : $number < $rightNumber);
        }

        return false;
    },

    /**
     * Returns a Regexp that matches valid intervals.
     *
     * @return string A Regexp (without the delimiters)
     */
    getIntervalRegexp: function () {
        'use strict';

        /* jshint multistr:true */
        var $ret = "                                           \
        ({\\s*                                                 \
            (\\-?\\d+(\\.\\d+)?[\\s*,\\s*\\-?\\d+(\\.\\d+)?]*) \
        \\s*})                                                 \
                                                               \
            |                                                  \
                                                               \
        (?P<left_delimiter>[\\[\\]])                           \
            \\s*                                               \
            (?P<left>-Inf|\\-?\\d+(\\.\\d+)?)                  \
            \\s*,\\s*                                          \
            (?P<right>\\+?Inf|\\-?\\d+(\\.\\d+)?)              \
            \\s*                                               \
        (?P<right_delimiter>[\\[\\]])                          ";

        return $ret;
        /* jshint multistr:false */
    },

    /**
     * Converts string to number or Infinity
     *
     * @param {string} $number
     * @returns {number|Infinity}
     */
    convertNumber: function ($number) {
        'use strict';

        if ('-Inf' === $number) {
            return Math.log(0);
        } else if ('+Inf' === $number || 'Inf' === $number) {
            return -Math.log(0);
        }

        return parseFloat($number);
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
MessageSelector =
{
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
        'use strict';

        var $parts = $message.split('|');
        var $explicitRules = {};
        var $standardRules = [];

        for (var $i = 0; $i < $parts.length; $i += 1) {
            var $part = $parts[$i];
            $part = $part.trim();

            var $rx = new XRegExp('^(?P<interval>' + Interval.getIntervalRegexp() + ')\\s*(?P<message>.*?)$', 'x');
            var $matches = XRegExp.exec($part, $rx);

            if ($matches !== null) {
                $explicitRules[$matches.interval] = $matches.message;
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
            if ($explicitRules.hasOwnProperty($interval)) {
                var $m = $explicitRules[$interval];

                if (Interval.test($number, $interval)) {
                    return $m;
                }
            }
        }

        var $position = PluralizationRules.get($number, $locale);

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
