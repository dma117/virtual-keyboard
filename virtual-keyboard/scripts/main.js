import keysObj from './keys-config-parser.js';
import { keyboardElements, textarea } from './build-layout.js';
import keyCodes from './key-codes.js';
import LetterKey from './classes/letter-key.js';
import SymbolKey from './classes/symbol-key.js';
import CommandKey from './classes/command-key.js';

const pathKeysEn = './keys-config/keys-config-en.json';
const pathKeysRu = './keys-config/keys-config-ru.json';
const keysEn = keysObj(pathKeysEn);
const keysRu = keysObj(pathKeysRu);
const keys = [keysEn, keysRu];
let keysMode = 0;
const changeKeysMode = () => { keysMode = (keysMode + 1) % keys.length; };

const appStates = {
  changingLang: false,
  changingPrimaryValues: false,
};

const keyType = (key) => {
  if (key instanceof LetterKey) {
    return 'letter';
  }
  if (key instanceof SymbolKey) {
    return 'symbol';
  }
  if (key instanceof CommandKey) {
    return 'command';
  }
  return 'unknown';
};

function setKeys(currentKeys) {
  for (let i = 0; i < keyCodes.length; i += 1) {
    const keyCode = keyCodes[i];
    const key = currentKeys[keyCode];
    switch (keyType(key)) {
      case 'letter':
        keyboardElements.get(keyCode).innerText = currentKeys[keyCode].value;
        break;
      case 'symbol':
        if (key.primaryValue === 'space') {
          keyboardElements.get(keyCode).innerHTML = '&ensp;';
        } else {
          keyboardElements.get(keyCode).innerText = currentKeys[keyCode].primaryValue;
        }
        break;
      case 'command':
        keyboardElements.get(keyCode).innerText = currentKeys[keyCode].value;
        break;
      default:
        break;
    }
  }
}

function addUpperCase(currentKeys) {
  for (let i = 0; i < keyCodes.length; i += 1) {
    const keyCode = keyCodes[i];
    const key = currentKeys[keyCode];
    if (keyType(key) === 'letter') {
      keyboardElements.get(keyCode).classList.add('keyboard__key_uppercase');
    }
  }
}

function removeUpperCase(currentKeys) {
  for (let i = 0; i < keyCodes.length; i += 1) {
    const keyCode = keyCodes[i];
    const key = currentKeys[keyCode];
    if (keyType(key) === 'letter') {
      keyboardElements.get(keyCode).classList.remove('keyboard__key_uppercase');
    }
  }
}

function updateSymbolKeys(currentKeys, valueType) {
  for (let i = 0; i < keyCodes.length; i += 1) {
    const keyCode = keyCodes[i];
    const key = currentKeys[keyCode];
    if (keyType(key) === 'symbol') {
      if (key.primaryValue !== 'space') {
        keyboardElements.get(keyCode).innerText = valueType === 'primary'
          ? currentKeys[keyCode].primaryValue
          : currentKeys[keyCode].secondaryValue;
      }
    }
  }
}

const handleTextarea = (keyCode) => {
  const key = keys[keysMode][keyCode];
  const text = keyboardElements.get(keyCode).innerText;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  if (keyType(key) === 'command') {
    if (keyCode === 'Backspace') {
      textarea.setRangeText(
        '',
        start === end ? start - 1 : start,
        end,
        'end',
      );
    }
    if (keyCode === 'Delete') {
      textarea.setRangeText(
        '',
        start,
        start === end ? end + 1 : end,
        'end',
      );
    }
    if (keyCode === 'Enter') {
      textarea.setRangeText('\n', start, end, 'end');
    }
    if (keyCode === 'Tab') {
      textarea.setRangeText('    ', start, end, 'end');
    }
    if (keyCode === 'ArrowRight') {
      textarea.setSelectionRange(start + 1, end + 1);
    }
    if (keyCode === 'ArrowLeft') {
      textarea.setSelectionRange(start - 1, end - 1);
    }
    return;
  }
  if (end !== textarea.textLength || start !== end) {
    textarea.setRangeText(text, start, end, 'end');
  } else {
    textarea.value += text;
  }
};

const handleMouseUp = (keyElement) => {
  const mouseUpOutOfElement = () => {
    keyElement.classList.remove('keyboard__key_pressed');
    document.removeEventListener('mouseup', mouseUpOutOfElement);
    document.removeEventListener('visibilitychange', mouseUpOutOfElement);
  };
  document.addEventListener('mouseup', mouseUpOutOfElement);
  document.addEventListener('visibilitychange', mouseUpOutOfElement);
};

const handleKeyUp = (keyElement) => {
  const mouseUpOutOfElement = () => {
    keyElement.classList.remove('keyboard__key_pressed');
    document.removeEventListener('visibilitychange', mouseUpOutOfElement);
  };
  document.addEventListener('visibilitychange', mouseUpOutOfElement);
};

const handleCommandKeysDown = (event) => {
  event.preventDefault();
  if (event.altKey && event.ctrlKey && !appStates.changingLang) {
    appStates.changingLang = true;
    changeKeysMode();
    setKeys(keys[keysMode]);
  }
  if (event.shiftKey && !appStates.changingPrimaryValues) {
    appStates.changingPrimaryValues = true;
    addUpperCase(keys[keysMode]);
    updateSymbolKeys(keys[keysMode], 'secondary');
  }
};

const handleCommandKeysUp = (event) => {
  if ((!event.altKey && event.ctrlKey)
      || (event.altKey && !event.ctrlKey)) {
    appStates.changingLang = false;
  }
  if (!event.shiftKey) {
    appStates.changingPrimaryValues = false;
    removeUpperCase(keys[keysMode]);
    updateSymbolKeys(keys[keysMode], 'primary');
  }
};

function addEventListenersToMouse() {
  for (let i = 0; i < keyCodes.length; i += 1) {
    const keyCode = keyCodes[i];
    const keyboardElement = keyboardElements.get(keyCode);
    keyboardElement.addEventListener('mousedown', () => {
      keyboardElement.classList.add('keyboard__key_pressed');
      handleMouseUp(keyboardElement);
      handleTextarea(keyCode);
      textarea.focus();
    });
    keyboardElement.addEventListener('mouseup', () => {
      keyboardElement.classList.remove('keyboard__key_pressed');
    });
  }
}

document.addEventListener('keydown', (event) => {
  if (keyboardElements.has(event.code)) {
    keyboardElements.get(event.code).classList.add('keyboard__key_pressed');
    handleCommandKeysDown(event);
    handleKeyUp(keyboardElements.get(event.code), event);
    handleTextarea(event.code);
  }
});

document.addEventListener('keyup', (event) => {
  if (keyboardElements.has(event.code)) {
    keyboardElements.get(event.code).classList.remove('keyboard__key_pressed');
    handleCommandKeysUp(event);
  }
});

addEventListenersToMouse();
setKeys(keysEn);
