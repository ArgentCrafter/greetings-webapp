let assert = require('assert');
let factory = require('../greetingsFactory');

describe('Tests:', () => {

    describe('Factory Function Tests:', () => {

        describe('Display String:', () => {

            it('function: English', () => {
                assert.equal(factory().displayString("jaden", "Hello, "), "Hello, Jaden!")
            })

            it('function: Afrikaans', () => {
                assert.equal(factory().displayString("stefan", "Hallo, "), "Hallo, Stefan!")
            })

            it('function: Xhosa', () => {
                assert.equal(factory().displayString("geoff", "Molo, "), "Molo, Geoff!")
            })

        });

        describe('Check Language:', () => {

            it('function: English', () => {
                assert.equal(factory().checkLang("Hello, "), "English")
            })

            it('function: Afrikaans', () => {
                assert.equal(factory().checkLang("Hallo, "), "Afrikaans")
            })

            it('function: Xhosa', () => {
                assert.equal(factory().checkLang("Molo, "), "Xhosa")
            })

        })

        describe('Style Names:', () => {

            it('function: Should capitalize first letter', () => {
                assert.deepEqual(factory().styleNames([{id: 1,name: 'jADeN'}, {id: 2,name: 'jEfFREy'}, {id: 3,name: 'StEVeN'}]), ['Jaden', 'Jeffrey', 'Steven'])
            })
        })
    })
})