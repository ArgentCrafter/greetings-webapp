module.exports = function greetFunctions(pool) {
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
    await pool.query('UPDATE names SET counter = $1, ' + language.toLowerCase() + ' = $2 WHERE name = $3', [currGreetCounter, currLangCounter, inputName]);
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

  async function selectAll() {
    return await (await pool.query('SELECT * FROM names')).rows;
  }

  async function selectName(name) {
    return await (await pool.query('SELECT * FROM names WHERE name = $1', [name.toLowerCase()])).rows[0];
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
