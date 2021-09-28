let assert = require('assert');
const { Pool } = require('pg');
let factory = require('../greetingsFactory');
const connectionString = 'postgres://rntohclcqqooug:6e4d677f68a42e8f11d37d49692c964ce319903d08edd57a1e6fbbb394139f1b@ec2-18-215-44-132.compute-1.amazonaws.com:5432/dbfr12j9n97iqk';

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

describe('Tests:', () => {

    describe('Database Tests:', () => {

        beforeEach(async function () {
            await pool.query("CREATE TABLE testing (id serial primary key not null, value integer not null)");
        })

        it('Should pass the insert db test', async function () {
            await pool.query('INSERT INTO testing (value) values (1)');
            assert.equal(await (await pool.query('SELECT * FROM testing')).rows[0].value, 1);
        })

        it('Should pass the update db test', async function () {
            await pool.query('INSERT INTO testing (value) values (1)');
            await pool.query('UPDATE testing SET value = 2');
            assert.equal(await (await pool.query('SELECT * FROM testing')).rows[0].value, 2);
        })

        afterEach(async function() {
            await pool.query("DROP TABLE testing");
        })
    })

    describe('Factory Function Tests:', () => {
        
        it('Display string function: English', () => {
            assert.equal(factory().displayString( "jaden", "Hello, "), "Hello, Jaden!")
        })

        it('Display string function: Afrikaans', () => {
            assert.equal(factory().displayString( "stefan", "Hallo, "), "Hallo, Stefan!")
        })

        it('Display string function: Xhosa', () => {
            assert.equal(factory().displayString( "geoff", "Molo, "), "Molo, Geoff!")
        })

        it('Check language function: English', () => {
            assert.equal(factory().checkLang("Hello, "), "English")
        })

        it('Check language function: Afrikaans', () => {
            assert.equal(factory().checkLang("Hallo, "), "Afrikaans")
        })

        it('Check language function: Xhosa', () => {
            assert.equal(factory().checkLang("Molo, "), "Xhosa")
        })
    })
})