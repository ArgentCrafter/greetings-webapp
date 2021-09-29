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

  async function updateQuery(language, timesNameGreeted, timesLangGreeted, inputName) {
    await pool.query('UPDATE names SET counter = $1, ' + language.toLowerCase() + ' = $2 WHERE name = $3', [timesNameGreeted, timesLangGreeted, inputName]);
  }

  async function insertQuery(language, inputName) {
    await pool.query('INSERT INTO names (name, counter, ' + language.toLowerCase() + ') VALUES ( $1, 1, 1)', [inputName])
  }

  async function getDistinctNames() {
    return await (await pool.query('SELECT COUNT (DISTINCT name) FROM names')).rows[0].count;
  }

  async function selectAll() {
    return await (await pool.query('SELECT * FROM names')).rows;
  }

  async function selectName(name) {
    return await (await pool.query('SELECT * FROM names WHERE name = $1', [name.toLowerCase()])).rows[0];
  }

  function styleNames(names) {
    let namesStyled = [];
    for (var i = 0; i < names.length; i++) {
      let nameTemp = names[i].name[0].toUpperCase() + names[i].name.slice(1).toLowerCase();
      namesStyled.push(nameTemp);
    }

    return namesStyled;
  }

  async function createRender(inputName) {
    let nameCount = await getDistinctNames();
    if (inputName) {
      return { count: nameCount, displayMessage: "Please select a language", displayClass: "red" };
  } else {
      return { count: nameCount, displayMessage: "Please select a language and enter a name", displayClass: "black" };
  }
  }

  return {
    displayString,
    checkLang,
    updateQuery,
    insertQuery,
    getDistinctNames,
    styleNames,
    selectAll,
    createRender,
    selectName
  };
}
