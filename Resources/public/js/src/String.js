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
