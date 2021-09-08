let assert = require('assert');
const { Pool } = require('pg');
let factory = require('../greetingsFactory');
const connectionString = 'postgresql://jaden:codex123@localhost:5432/names_greeted';

const pool = new Pool({
    connectionString
});

describe('Tests:', () => {

    describe('Database Tests:', () => {

        beforeEach(async function () {
            await pool.query("DROP TABLE testing");
            await pool.query("CREATE TABLE testing (id serial primary key not null, value integer not null)")
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