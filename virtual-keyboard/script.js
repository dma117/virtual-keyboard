import { CommandKey, LetterKey, SymbolKey } from './classes.js';
import { keysObj } from './keys-config-parser.js';

const path_keys_en = "./keys-config/keys-config-en.json";
const path_keys_ru = "./keys-config/keys-config-ru.json";
const keysEn = keysObj(path_keys_en);
const keysRu = keysObj(path_keys_ru);
console.log(keysEn);
console.log(keysEn["Backquote"].primaryValue)

const section = document.createElement('section');
const textarea = document.createElement('textarea');
textarea.classList.add("textarea", "textarea_centered-h");
textarea.setAttribute("name", "text");
textarea.setAttribute("id", "text");
textarea.setAttribute("cols", "100");
textarea.setAttribute("rows", "15");
section.append(textarea);
document.body.append(section);
document.body.insertAdjacentHTML(
  "beforeend",
  `<section class="keyboard keyboard_centered-h keyboard_under">
  </section>`
);
document.body.insertAdjacentHTML(
  "beforeend",
  `<section class="info info_centered-h info_under">
  <p class="info__text">Клавиатура создана в ОС Windows</p>
  <p class="info__text">Для переключения языка</p>
  </section>`
);

const keyboard = document.querySelector(".keyboard");

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

const keyCodes = [
  "Backquote", "Digit1", "Digit2", "Digit3", "Digit4",  "Digit5",
  "Digit6",  "Digit7",  "Digit8",  "Digit9", "Digit0", "Minus",
  "Equal", "Backspace", "Tab", "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU",
  "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", "Delete", "CapsLock",
  "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL",
  "Semicolon", "Quote", "Enter", "ShiftLeft", "KeyZ", "KeyX", "KeyC", "KeyV",
  "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash", "ArrowUp", "ShiftRight",
  "ControlLeft", "MetaLeft", "AltLeft", "Space", "AltRight", "ArrowLeft",
  "ArrowDown", "ArrowRight", "ControlRight",
]

const keyboardElements = new Map();

for (let keyCode of keyCodes) {
  let keyElement = document.createElement('div');
  keyElement.classList.add("keyboard__key");
  switch(keyCode) {
    case 'Backspace':
      keyElement.classList.add("keyboard__key_backspace");
      break;
    case 'Tab':
      keyElement.classList.add("keyboard__key_tab");
      break;
    case 'Delete':
      keyElement.classList.add("keyboard__key_del");
      break;
    case 'CapsLock':
      keyElement.classList.add("keyboard__key_caps-lock");
      break;
    case 'Enter':
      keyElement.classList.add("keyboard__key_enter");
      break;
    case 'ShiftLeft':
    case 'ShiftRight':
      keyElement.classList.add("keyboard__key_shift");
      break;
    case 'Space':
      keyElement.classList.add("keyboard__key_space");
      break;
  }
  keyElement.addEventListener('mousedown', () => {
    keyElement.classList.add("keyboard__key_pressed");
    handleMouseUp(keyElement);
    handleTextarea(keyCode);
    textarea.focus();
  })
  keyElement.addEventListener('mouseup', () => {
    keyElement.classList.remove("keyboard__key_pressed");
  })
  keyboardElements.set(keyCode, keyElement);
  keyboard.append(keyElement);
}

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

document.addEventListener('keydown', function(event) {
  if (keyboardElements.has(event.code)) {
    keyboardElements.get(event.code).classList.add("keyboard__key_pressed");
    handleKeyUp(keyboardElements.get(event.code));
    handleTextarea(event.code);
  }
});

document.addEventListener('keyup', function(event) {
  if (keyboardElements.has(event.code)) {
    keyboardElements.get(event.code).classList.remove("keyboard__key_pressed");
  }
});

const handleTextarea = (keyCode) => {
  textarea.blur();
  let text = keyboardElements.get(keyCode).innerText;
  let start = textarea.selectionStart;
  let end = textarea.selectionEnd;
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
