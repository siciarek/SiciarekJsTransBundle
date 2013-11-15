if (typeof String.prototype.trans === 'undefined') {

    String.prototype.trans = function (replacements, namespace) {

        replacements = replacements || {};
        namespace = namespace || 'messages';

        var phrase = this;

        for (var root in this.translations) {
            if (this.translations.hasOwnProperty(root)) {

                var dict = this.translations[root];

                // No namespace defined:
                if (typeof dict[namespace] === 'undefined') {
                    continue;
                }

                // Simple phrase match:
                if(typeof dict[namespace][phrase] !== 'undefined') {
                    phrase = dict[namespace][phrase];
                    break;
                }

                // Tokenized translation:
                var chunks = phrase.split('.');

                if(chunks === phrase) {
                    continue;
                }

                var x = dict[namespace];

                for(var i = 0; i < chunks.length; i++) {
                    if(typeof x[chunks[i]] === 'undefined') {
                        break;
                    }

                    x = x[chunks[i]];

                    if(i === chunks.length - 1) {
                        phrase = x.toString();
                        break;
                    }
                }
            }
        }

        // No translation found:
        if(phrase === this) {
            return this.toString();
        }

        // Optional partial replacements:
        for (var key in replacements) {
            if (replacements.hasOwnProperty(key)) {
                var rx = new RegExp(key, 'g');
                phrase = phrase.replace(rx, replacements[key]);
            }
        }

        return phrase.toString();
    };
}