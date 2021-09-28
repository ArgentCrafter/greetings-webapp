module.exports = function greetFunctions() {

  const { Pool } = require('pg');
  const connectionString = 'postgres://rntohclcqqooug:6e4d677f68a42e8f11d37d49692c964ce319903d08edd57a1e6fbbb394139f1b@ec2-18-215-44-132.compute-1.amazonaws.com:5432/dbfr12j9n97iqk';

  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  pool.connect()

  function displayString(input, input2) {
    return `${input2}${input[0].toUpperCase() + input.slice(1).toLowerCase()}!`;
  }

  function checkLang(input) {
    switch (input) {
      case "Hello, ":
        return 'English';

      case "Hallo, ":
        return 'Afrikaans';

      case "Molo, ":
        return 'Xhosa';
    }
  }

  async function updateQuery(language, currGreetCounter, currLangCounter, inputName) {
    switch (language) {
      case 'English':
        await pool.query('UPDATE names SET counter = $1, english = $2 WHERE name = $3', [currGreetCounter, currLangCounter, inputName]);
        break;

      case 'Afrikaans':
        await pool.query('UPDATE names SET counter = $1, afrikaans = $2 WHERE name = $3', [currGreetCounter, currLangCounter, inputName]);
        break;

      case 'Xhosa':
        await pool.query('UPDATE names SET counter = $1, xhosa = $2 WHERE name = $3', [currGreetCounter, currLangCounter, inputName]);
        break;

      default:
        break;
    }
  }

  async function insertQuery(language, inputName) {
    switch (language) {
      case 'English':
        await pool.query('INSERT INTO names (name, counter, english, afrikaans, xhosa) VALUES ( $1, 1, 1, 0, 0)', [inputName])
        break;

      case 'Afrikaans':
        await pool.query('INSERT INTO names (name, counter, english, afrikaans, xhosa) VALUES ( $1, 1, 0, 1, 0)', [inputName])
        break;

      case 'Xhosa':
        await pool.query('INSERT INTO names (name, counter, english, afrikaans, xhosa) VALUES ( $1, 1, 0, 0, 1)', [inputName])
        break;

      default:
        break;
    }
  }

  async function distinctQuery() {
    return await pool.query('SELECT COUNT (DISTINCT name) FROM names');
  }

  async function reset() {
    await pool.query('DROP TABLE names');
    await pool.query('CREATE TABLE names (id serial primary key, name text not null, counter int not null, english int not null, afrikaans int not null, xhosa int not null)')
  }

  function styleNames(names) {
    let namesStyled = [];
    for (var i = 0; i < names.length; i++) {
      let nameTemp = names[i].name[0].toUpperCase() + names[i].name.slice(1).toLowerCase();
      namesStyled.push(nameTemp);
    }

    return namesStyled;
  }

  async function selectAll() {
    return await (await pool.query('SELECT * FROM names')).rows;
  }

  async function selectName(name) {
    return await (await pool.query('SELECT * FROM names WHERE name = $1', [name.toLowerCase()])).rows[0];
  }

  return {
    displayString,
    checkLang,
    updateQuery,
    insertQuery,
    distinctQuery,
    reset,
    styleNames,
    selectAll,
    selectName
  };
}
