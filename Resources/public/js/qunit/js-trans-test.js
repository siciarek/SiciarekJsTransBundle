// from /vendor/symfony/symfony/src/Symfony/Component/Translation/Tests/MessageSelectorTest.php

function getNonMatchingMessages()
{
    return [
        ['{0} There are no apples|{1} There is one apple', 2],
        ['{1} There is one apple|]1,Inf] There are %count% apples', 0],
        ['{1} There is one apple|]2,Inf] There are %count% apples', 2],
        ['{0} There are no apples|There is one apple', 2]
    ];
}

function getChooseTests()
{
    return [
        ['There are no apples', '{0} There are no apples|{1} There is one apple|]1,Inf] There are %count% apples', 0],
        ['There are no apples', '{0}     There are no apples|{1} There is one apple|]1,Inf] There are %count% apples', 0],
        ['There are no apples', '{0}There are no apples|{1} There is one apple|]1,Inf] There are %count% apples', 0],

        ['There is one apple', '{0} There are no apples|{1} There is one apple|]1,Inf] There are %count% apples', 1],

        ['There are %count% apples', '{0} There are no apples|{1} There is one apple|]1,Inf] There are %count% apples', 10],
        ['There are %count% apples', '{0} There are no apples|{1} There is one apple|]1,Inf]There are %count% apples', 10],
        ['There are %count% apples', '{0} There are no apples|{1} There is one apple|]1,Inf]     There are %count% apples', 10],

        ['There are %count% apples', 'There is one apple|There are %count% apples', 0],
        ['There is one apple', 'There is one apple|There are %count% apples', 1],
        ['There are %count% apples', 'There is one apple|There are %count% apples', 10],

        ['There are %count% apples', 'one: There is one apple|more: There are %count% apples', 0],
        ['There is one apple', 'one: There is one apple|more: There are %count% apples', 1],
        ['There are %count% apples', 'one: There is one apple|more: There are %count% apples', 10],

        ['There are no apples', '{0} There are no apples|one: There is one apple|more: There are %count% apples', 0],
        ['There is one apple', '{0} There are no apples|one: There is one apple|more: There are %count% apples', 1],
        ['There are %count% apples', '{0} There are no apples|one: There is one apple|more: There are %count% apples', 10],

        ['', '{0}|{1} There is one apple|]1,Inf] There are %count% apples', 0],
        ['', '{0} There are no apples|{1}|]1,Inf] There are %count% apples', 1],

        // Indexed only tests which are Gettext PoFile* compatible strings.
        ['There are %count% apples', 'There is one apple|There are %count% apples', 0],
        ['There is one apple', 'There is one apple|There are %count% apples', 1],
        ['There are %count% apples', 'There is one apple|There are %count% apples', 2],

        // Tests for float numbers
//        ['There is almost one apple', '{0} There are no apples|]0,1[ There is almost one apple|{1} There is one apple|[1,Inf] There is more than one apple', 0.7],
//        ['There is one apple', '{0} There are no apples|]0,1[There are %count% apples|{1} There is one apple|[1,Inf] There is more than one apple', 1],
//        ['There is more than one apple', '{0} There are no apples|]0,1[There are %count% apples|{1} There is one apple|[1,Inf] There is more than one apple', 1.7],
//        ['There are no apples', '{0} There are no apples|]0,1[There are %count% apples|{1} There is one apple|[1,Inf] There is more than one apple', 0],
//        ['There are no apples', '{0} There are no apples|]0,1[There are %count% apples|{1} There is one apple|[1,Inf] There is more than one apple', 0.0],
//        ['There are no apples', '{0.0} There are no apples|]0,1[There are %count% apples|{1} There is one apple|[1,Inf] There is more than one apple', 0]
    ];
}

test("transchoice choose test", function() {
    var tests = getChooseTests();

    while(tests.length) {
        var test = tests.shift();
        var count = test[2];
        var actual = test[1].transchoice(count, {}, 'TranschoiceChooseTest');
        var expected = test[0].replace(new RegExp('%count%', 'mg'), count);
        strictEqual(actual, expected, test[1] + ' | ' + count);
    }
});