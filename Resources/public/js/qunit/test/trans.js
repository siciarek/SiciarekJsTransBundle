/**
 * String.trans basic test data provider
 *
 * @returns {Array}
 */
function getTransBasic() {
    return [
        [ 'Dummy', 'Dummy', 'not existing phrase' ],
        [ 'Translated: Not Found', 'Not Found', 'phrase' ],
        [ 'Not Found', 'token.3', 'token' ]
    ];
}

/**
 * String.trans default domain data provider
 *
 * @returns {Array}
 */
function getDefaultDomain() {
    return [
        [ 'Dummy', 'Dummy', {}, 'not existing phrase' ],
        [ 'Translated: Not Found', 'Not Found', {}, 'phrase' ],
        [ 'Translated: Hello, John Doe!', "Hello, %username%!", {'%username%': 'John Doe'}, 'phrase with replacement' ],
        [ 'Translated: Hello, John Doe! Are you John Doe?', 'Hello, %username%! Are you %username%?', {'%username%': 'John Doe'}, 'phrase with mulitiple replacements' ],
        [ 'Hello, John Doe! You are not John Doe!?', 'Hello, %username%! You are not %username%!?', {'%username%': 'John Doe'}, 'replacements only' ],

        [ 'token.0', 'token.0', {}, 'not existing token' ],
        [ 'Not Found', 'token.3', {}, 'token' ],
        [ 'Hello, John Doe!', 'token.2', {'%username%': 'John Doe'}, 'token with replacement' ],
        [ 'Hello, John Doe! Are you John Doe?', 'token.1', {'%username%': 'John Doe'}, 'token with multiple replacements' ]
    ];
}

/**
 * String.trans given domain data provider
 *
 * @returns {Array}
 */
function getGivenDomain() {
    return [
        [ 'Dummy', 'Dummy', {}, 'TestDomainFirst', 'not existing phrase' ],
        [ 'Translated: Not Found', 'Not Found', {}, 'TestDomainFirst', 'phrase' ],
        [ 'Translated: Hello, John Doe!', "Hello, %username%!", {'%username%': 'John Doe'}, 'TestDomainFirst', 'phrase with replacement' ],
        [ 'Translated: Hello, John Doe! Are you John Doe?', 'Hello, %username%! Are you %username%?', {'%username%': 'John Doe'}, 'TestDomainFirst', 'phrase with mulitiple replacements' ],
        [ 'Hello, John Doe! You are not John Doe!?', 'Hello, %username%! You are not %username%!?', {'%username%': 'John Doe'}, 'TestDomainFirst', 'replacements only' ]
    ];
}

/**
 * String.trans given locale data provider
 *
 * @returns {Array}
 */
function getGivenLocale() {
    return [
        [ 'This value should be true.', 'This value should be true.', {}, 'validators', 'en' ],
        [ 'Cette valeur doit être vraie.', 'This value should be true.', {}, 'validators', 'fr' ],
        [ 'Ta wartość powinna być prawdą.', 'This value should be true.', {}, 'validators', 'pl' ]
    ];
}

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
