
module("String.trans()", {
    setup: function() {
    // prepare something for all following tests
    },
    teardown: function() {
// clean up after each test
    }
});

test("basic", function () {
    var tests = getTransBasic();
    expect(tests.length);

    while (tests.length) {
        var test = tests.shift();
        var message = test[1];

        var actual = message.trans();
        var expected = test[0];
        strictEqual(actual, expected, test[2]);
    }
});

test("default domain", function () {
    var tests = getDefaultDomain();
    expect(tests.length);

    while (tests.length) {
        var test = tests.shift();
        var message = test[1];
        var attributes = test[2];

        var actual = message.trans(attributes);
        var expected = test[0];
        strictEqual(actual, expected, test[3]);
    }
});

test("given domain", function () {
    var tests = getGivenDomain();
    expect(tests.length);

    while (tests.length) {
        var test = tests.shift();
        var message = test[1];
        var attributes = test[2];
        var domain = test[3];

        var actual = message.trans(attributes, domain);
        var expected = test[0];
        strictEqual(actual, expected, test[4]);
    }
});


test("given locale", function () {
    var tests = getGivenLocale();
    expect(tests.length);

    while (tests.length) {
        var test = tests.shift();

        var message = test[1];
        var attributes = test[2];
        var domain = test[3];
        var locale = test[4];
        var info = test[4];

        var actual = message.trans(attributes, domain, locale);
        var expected = test[0];

        strictEqual(actual, expected, info);
    }
});
