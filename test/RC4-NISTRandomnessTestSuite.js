process.env.NODE_ENV = 'test';

var assert = require('assert');

var TestSuite = require('nist-randomness-test-suite');

const CipherSuite = require('../RC4')

const plainText = "Quantum cryptography is the science of exploiting quantum mechanical properties to perform cryptographic tasks. The best known example of quantum cryptography is quantum key distribution which offers an information-theoretically secure solution to the key exchange problem. Except for post-quantum cryptography (see below), as of 2017, currently used popular public-key encryption and signature schemes (e.g., elliptic-curve cryptography (ECC) and RSA) can be broken by quantum adversaries.[citation needed] The advantage of quantum cryptography lies in the fact that it allows the completion of various cryptographic tasks that are proven or conjectured to be impossible using only classical (i.e. non-quantum) communication (see below for examples). For example, it is impossible to copy data encoded in a quantum state and the very act of reading data encoded in a quantum state changes the state. This is used[citation needed] to detect eavesdropping in quantum key distribution."
const cipherText = CipherSuite.RC4Encrypt(plainText, plainText.length, "quantumIsTheKey", "quantumIsTheKey".length)
var RC4BitArray = ""
for(var i = 0 ; i < cipherText.length; i++){
    RC4BitArray += cipherText[i].toString(2)
}

const NUMBER_OF_BIT = Math.pow(10, 5);

getTestSubjects = (generator) => {
    var bitsArray = TestSuite.range(NUMBER_OF_BIT).map(generator);
    return {
        "generator": generator,
        "bit array": bitsArray,
        "bit string": bitsArray.join('')
    };
};

var generators = [
    {
        name: "Our RC4 algorithm",
        bitArray: RC4BitArray, // here we have provided bitstring
        expect: "pass",
        skip: [],
        isOurCase: true
    },
    {
        name: "perfect generator",
        next: () => Math.round(Math.random()),
        expect: "pass",
        skip: [],
        isOurCase: false,
    },
    {
        name: "zero biased generator",
        next: () => Math.random() > 0.65 ? 1 : 0,
        expect: "fail",
        skip: ['nonOverlappingTemplateMatchingTest', 'binaryMatrixRankTest'],
        isOurCase: false
    },
    {
        name: "faulty generator",
        next: () => 0,
        expect: "fail",
        skip: ['nonOverlappingTemplateMatchingTest'],
        isOurCase: false
    },
];

describe('NIST test suite', function () {
    // allow 10s to complete the test
    this.timeout(10000);

    var testSuite = new TestSuite(0.001);

    // tests using generator
    TestSuite.testNames.forEach(testName => {

        describe(testName + '(bits)', function () {


            generators.forEach(generator => {
                if (generator.skip.includes(testName)) return;
                it(`# ${generator.name} should ${generator.expect} ${testName}`, function () {

                    if (generator.isOurCase) {
                        assert(testSuite[testName](generator.bitArray))
                    } else {
                        if (generator.expect === "pass") assert(testSuite[testName](generator.next));
                        else assert(!testSuite[testName](generator.next));

                        var bit_arr = TestSuite.range(NUMBER_OF_BIT).map(generator.next);
                        if (generator.expect === "pass") assert(testSuite[testName](bit_arr));
                        else assert(!testSuite[testName](bit_arr));

                        var bit_string = bit_arr.join('');
                        if (generator.expect === "pass") assert(testSuite[testName](bit_string));
                        else assert(!testSuite[testName](bit_string));
                    }
                });
            });
        });
    });

});