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
