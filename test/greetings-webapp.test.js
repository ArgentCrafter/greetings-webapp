let assert = require('assert');
let Factory = require('../greetingsFactory');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://rntohclcqqooug:6e4d677f68a42e8f11d37d49692c964ce319903d08edd57a1e6fbbb394139f1b@ec2-18-215-44-132.compute-1.amazonaws.com:5432/dbfr12j9n97iqk';

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    }
});

pool.connect();

let factory = Factory(pool);

describe('Tests:', () => {
    describe('Factory Function Tests:', () => {

        describe('Display String:', () => {

            it('Display greeting message in English', () => {
                assert.equal(factory.displayString("jaden", "Hello, "), "Hello, Jaden!")
            })

            it('Display greeting message in Afrikaans', () => {
                assert.equal(factory.displayString("stefan", "Hallo, "), "Hallo, Stefan!")
            })

            it('Display greeting message in Xhosa', () => {
                assert.equal(factory.displayString("geoff", "Molo, "), "Molo, Geoff!")
            })

        });

        describe('Check Language Selected:', () => {

            it('Detect language: English', () => {
                assert.equal(factory.checkLang("Hello, "), "English")
            })

            it('Detect language: Afrikaans', () => {
                assert.equal(factory.checkLang("Hallo, "), "Afrikaans")
            })

            it('Detect language: Xhosa', () => {
                assert.equal(factory.checkLang("Molo, "), "Xhosa")
            })

        })

        describe('Style Names:', () => {

            it('Should capitalize first letter and lower case all rest', () => {
                assert.deepEqual(factory.styleNames([{ id: 1, name: 'jADeN' }, { id: 2, name: 'jEfFREy' }, { id: 3, name: 'StEVeN' }]), ['Jaden', 'Jeffrey', 'Steven'])
            })
        })
    })
})