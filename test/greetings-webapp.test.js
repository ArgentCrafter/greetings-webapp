let assert = require('assert');
let factory = require('../greetingsFactory');

describe('Tests:', () => {

    describe('Factory Function Tests:', () => {

        describe('Display String:', () => {

            it('Display message in English', () => {
                assert.equal(factory().displayString("jaden", "Hello, "), "Hello, Jaden!")
            })

            it('Display message in Afrikaans', () => {
                assert.equal(factory().displayString("stefan", "Hallo, "), "Hallo, Stefan!")
            })

            it('Display message in Xhosa', () => {
                assert.equal(factory().displayString("geoff", "Molo, "), "Molo, Geoff!")
            })

        });

        describe('Check Language:', () => {

            it('Detect language: English', () => {
                assert.equal(factory().checkLang("Hello, "), "English")
            })

            it('Detect language: Afrikaans', () => {
                assert.equal(factory().checkLang("Hallo, "), "Afrikaans")
            })

            it('Detect language: Xhosa', () => {
                assert.equal(factory().checkLang("Molo, "), "Xhosa")
            })

        })

        describe('Style Names:', () => {

            it('Should capitalize first letter and lower case all rest', () => {
                assert.deepEqual(factory().styleNames([{id: 1,name: 'jADeN'}, {id: 2,name: 'jEfFREy'}, {id: 3,name: 'StEVeN'}]), ['Jaden', 'Jeffrey', 'Steven'])
            })
        })
    })
})