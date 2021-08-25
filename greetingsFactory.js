module.exports = function greetFunctions() {
    let greetedNames = {};
  
    function setGreetedNames(input) {
      greetedNames = input;
    }
  
    function btnGreetClicked(input) {
      if (greetedNames[input.toLowerCase()] === undefined) {
        greetedNames[input.toLowerCase()] = 1;
      } else {
        greetedNames[input.toLowerCase()]++;
      }
    }
  
    function getGreetedNames() {
      return greetedNames;
    }
  
    function displayString(input, input2) {
      return `${input2}${input[0].toUpperCase() + input.slice(1).toLowerCase()}!`;
    }
  
    return {
      btnGreetClicked,
      getGreetedNames,
      displayString,
      setGreetedNames,
    };
  }
  