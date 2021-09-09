module.exports = function greetFunctions() {

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

  return {
    displayString,
    checkLang
  };
}
