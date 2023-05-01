import { CommandKey, LetterKey, SymbolKey } from './classes.js';
import { keysObj } from './keys-config-parser.js';
import { keyboardElements, textarea } from './build-layout.js';
import { keyCodes } from './key-codes.js';

const path_keys_en = "./keys-config/keys-config-en.json";
const path_keys_ru = "./keys-config/keys-config-ru.json";
const keysEn = keysObj(path_keys_en);
const keysRu = keysObj(path_keys_ru);
const keys = [keysEn, keysRu];
let keysMode = 0;
const changeKeysMode = () => { keysMode = (keysMode + 1) % keys.length };

const appStates = {
  "changingLang": false,
  "changingPrimaryValues": false
}

const keyType = (key) => {
  if (key instanceof LetterKey) {
    return "letter";
  }
  if (key instanceof SymbolKey) {
    return "symbol";
  }
  if (key instanceof CommandKey) {
    return "command";
  }
}

addEventListenersToMouse();
setKeys(keysEn);

function setKeys(keys) {
  for (let keyCode of keyCodes) {
    let key = keys[keyCode];
    switch(keyType(key)) {
      case "letter":
        keyboardElements.get(keyCode).innerText = keys[keyCode].value;
        break;
      case "symbol":
        if (key.primaryValue === "space") {
          keyboardElements.get(keyCode).innerHTML = "&ensp;";
        } else {
          keyboardElements.get(keyCode).innerText = keys[keyCode].primaryValue;
        }
        break;
      case "command":
        keyboardElements.get(keyCode).innerText = keys[keyCode].value;
        break;
    }
  }
}

function addUpperCase(keys) {
  for (let keyCode of keyCodes) {
    let key = keys[keyCode];
    if (keyType(key) === "letter") {
      keyboardElements.get(keyCode).classList.add('keyboard__key_uppercase');
    }
  }
}

function removeUpperCase(keys) {
  for (let keyCode of keyCodes) {
    let key = keys[keyCode];
    if (keyType(key) === "letter") {
      keyboardElements.get(keyCode).classList.remove('keyboard__key_uppercase');
    }
  }
}

function updateSymbolKeys(keys, valueType) {
  for (let keyCode of keyCodes) {
    let key = keys[keyCode];
    if (keyType(key) === "symbol") {
      if (key.primaryValue === "space") continue;
      keyboardElements.get(keyCode).innerText = 
        valueType === "primary" ?
        keys[keyCode].primaryValue :
        keys[keyCode].secondaryValue;
    }
  }
}

function addEventListenersToMouse() {
  for (let [keyCode, keyboardElement] of keyboardElements) {
    keyboardElement.addEventListener('mousedown', () => {
      keyboardElement.classList.add("keyboard__key_pressed");
      handleMouseUp(keyboardElement);
      handleTextarea(keyCode);
      textarea.focus();
    })
    keyboardElement.addEventListener('mouseup', () => {
      keyboardElement.classList.remove("keyboard__key_pressed");
    })
  }
}

document.addEventListener('keydown', function(event) {
  if (keyboardElements.has(event.code)) {
    keyboardElements.get(event.code).classList.add("keyboard__key_pressed");
    handleCommandKeysDown(event);
    handleKeyUp(keyboardElements.get(event.code), event);
    handleTextarea(event.code);
  }
});

document.addEventListener('keyup', function(event) {
  if (keyboardElements.has(event.code)) {
    keyboardElements.get(event.code).classList.remove("keyboard__key_pressed");
    handleCommandKeysUp(event);
  }
});

const handleTextarea = (keyCode) => {
  let key = keys[keysMode][keyCode];
  let text = keyboardElements.get(keyCode).innerText;
  let start = textarea.selectionStart;
  let end = textarea.selectionEnd;
  if (keyType(key) === "command") {
    if (keyCode === "Backspace") {
      textarea.setRangeText(
        "",
        start == end ? start - 1 : start,
        end,
        "end"
      );
    }
    return;
  }
  if (end !== textarea.textLength || start !== end) {
    textarea.setRangeText(text, start, end, "end");
  } else {
    textarea.value += text;
  }
}

const handleMouseUp = (keyElement) => {
  const mouseUpOutOfElement = () => {
    keyElement.classList.remove("keyboard__key_pressed");
    document.removeEventListener('mouseup', mouseUpOutOfElement);
    document.removeEventListener('visibilitychange', mouseUpOutOfElement);
  };
  document.addEventListener('mouseup', mouseUpOutOfElement);
  document.addEventListener('visibilitychange', mouseUpOutOfElement);
}

const handleKeyUp = (keyElement) => {
  const mouseUpOutOfElement = () => {
    keyElement.classList.remove("keyboard__key_pressed");
    document.removeEventListener('visibilitychange', mouseUpOutOfElement);
  };
  document.addEventListener('visibilitychange', mouseUpOutOfElement);
}

const handleCommandKeysDown = (event) => {
  event.preventDefault();
  if (event.altKey && event.ctrlKey && !appStates["changingLang"]) {
    appStates["changingLang"] = true;
    changeKeysMode();
    setKeys(keys[keysMode]);
  }
  if (event.shiftKey && !appStates["changingPrimaryValues"]) {
    appStates["changingPrimaryValues"] = true;
    addUpperCase(keys[keysMode]);
    updateSymbolKeys(keys[keysMode], "secondary");
  }
}

const handleCommandKeysUp = (event) => {
  if (event.altKey ^ event.ctrlKey) {
    appStates["changingLang"] = false;
  }
  if (!event.shiftKey) {
    appStates["changingPrimaryValues"] = false;
    removeUpperCase(keys[keysMode]);
    updateSymbolKeys(keys[keysMode], "primary");
  }
}
