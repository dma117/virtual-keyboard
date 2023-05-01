import CommandKey from './classes/command-key.js';
import LetterKey from './classes/letter-key.js';
import SymbolKey from './classes/symbol-key.js';

const keysObj = (path) => {
  const request = new XMLHttpRequest();
  request.open('GET', path, false);
  request.send(null);
  return JSON.parse(request.responseText, (key, valueObj) => {
    if (valueObj.type === 'letter') {
      return new LetterKey(valueObj.value);
    }
    if (valueObj.type === 'symbol') {
      return new SymbolKey(valueObj.primaryValue, valueObj.secondaryValue);
    }
    if (valueObj.type === 'command') {
      return new CommandKey(valueObj.value);
    }
    return valueObj;
  });
};

export default keysObj;
