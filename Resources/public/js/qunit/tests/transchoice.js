
module("String.transchoice()", {
    setup: function () {
// prepare something for all following tests
    },
    teardown: function () {
// clean up after each test
    }
});

test("not matching messages", function () {
    var tests = getNonMatchingMessages();
    expect(tests.length);

    while (tests.length) {
        var test = tests.shift();
        var message = test[0];
        var count = test[1];

        throws(
            function() {
                message.transchoice(count, {}, 'TranschoiceChooseTest');
            },
            /^Unable to choose a translation for/,
            'raised error message starts with "Unable to choose a translation for".'
        );
    }
});

test("choose", function () {
    var tests = getChooseTests();
    expect(tests.length);

    while (tests.length) {
        var test = tests.shift();
        var count = test[2];
        var actual = test[1].transchoice(count, {}, 'TranschoiceChooseTest');
        var expected = test[0].replace(new RegExp('%count%', 'mg'), count);
        strictEqual(actual, expected, actual + ' | ' + count);
    }
});
