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
