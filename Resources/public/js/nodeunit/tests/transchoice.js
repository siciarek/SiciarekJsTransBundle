var transchoiceTest = {

    testTranschoiceBasic: function (test) {
        test.expect(1);
        test.deepEqual(2, 2, '2 should be equal to 2');
        test.done();
    }
};

module.exports = transchoiceTest;