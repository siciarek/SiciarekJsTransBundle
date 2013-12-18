var transTest = {
    basic: function (t) {

        var tests = getTransBasic();
        t.expect(tests.length);

        while (tests.length) {
            var test = tests.shift();
            var message = test[1];

            var actual = message.trans();
            var expected = test[0];
            t.deepEqual(actual, expected, test[2]);
        }
        t.done();
    },
    'default domain': function (t) {
        var tests = getDefaultDomain();
        t.expect(tests.length);

        while (tests.length) {
            var test = tests.shift();
            var message = test[1];
            var attributes = test[2];

            var actual = message.trans(attributes);
            var expected = test[0];
            t.deepEqual(actual, expected, test[3]);
        }

        t.done();
    },
    'given domain': function (t) {
        var tests = getGivenDomain();
        t.expect(tests.length);

        while (tests.length) {
            var test = tests.shift();
            var message = test[1];
            var attributes = test[2];
            var domain = test[3];

            var actual = message.trans(attributes, domain);
            var expected = test[0];
            t.deepEqual(actual, expected, test[4]);
        }
        t.done();
    },
    'given locale': function (t) {
        var tests = getGivenLocale();
        t.expect(tests.length);

        while (tests.length) {
            var test = tests.shift();

            var message = test[1];
            var attributes = test[2];
            var domain = test[3];
            var locale = test[4];
            var info = test[4];

            var actual = message.trans(attributes, domain, locale);
            var expected = test[0];

            t.deepEqual(actual, expected, info);
        }
        t.done();
    }
};

module.exports = transTest;