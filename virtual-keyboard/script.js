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

class Key {
  constructor(keyValue, keyType) {
    this.value = keyValue;
    this.type = keyType;
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    this._value = newValue; 
  }

  get type() {
    return this._type;
  }

  set type(newType) {
    this._type = newType;
  }
}

const keyTypes = {
  letter: 'letter',
  digit: 'digit',
  special: 'special',
}

const availableKeyValuesDefault = [
  '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
  'tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', 'del',
  'caps lock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\'', 'enter',
  'shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'up', 'shift',
  'ctrl', 'win', 'alt', 'space', 'alt', 'left', 'down', 'right', 'ctrl'
]
const specialKeys = [
  'backspace', 
  'tab', 'del', 
  'caps lock', 'enter', 
  'shift', 'up', 
  'ctrl', 'win', 'alt', 'left', 'down', 'right'
];
const additionalLetterKeys = [
  '`', '-', '=', '[', ']', '\\', ';', '\'', '.', '/', 'space'
];
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

let isLetterKey = (keyValue) => {
  const codeA = 65;
  const codeZ = 90;
  const keyCode = keyValue.codePointAt(0);
  const additionalLetterKey = additionalLetterKeys.includes(keyValue);
  return (keyCode >= codeA && keyCode <= codeZ) || additionalLetterKey;
};
let isDigitKey = (keyValue) => keyValue >= "0" && keyValue <= "9";
let isSpecialKey = (keyValue) => specialKeys.includes(keyValue);

const keyboardKeys = {};
const keyboardElements = new Map();

for (let i = 0; i < availableKeyValuesDefault.length; i++) {
  let keyCode = keyCodes[i];
  let keyValue = availableKeyValuesDefault[i];
  let keyType = 
      isLetterKey(keyValue) ? keyTypes.letter :
      isDigitKey(keyValue) ? keyTypes.digit :
      keyTypes.special;
  let key = new Key(keyValue, keyType);
  keyboardKeys[keyCode] = key;
}

for (let keyCode in keyboardKeys) {
  let keyValue = keyboardKeys[keyCode].value;
  let key = document.createElement('div');
  key.innerText = keyValue;
  key.classList.add("keyboard__key");
  switch(keyValue) {
    case 'backspace':
      key.classList.add("keyboard__key_backspace");
      break;
    case 'tab':
      key.classList.add("keyboard__key_tab");
      break;
    case 'del':
      key.classList.add("keyboard__key_del");
      break;
    case 'caps lock':
      key.classList.add("keyboard__key_caps-lock");
      break;
    case 'enter':
      key.classList.add("keyboard__key_enter");
      break;
    case 'shift':
      key.classList.add("keyboard__key_shift");
      break;
    case 'space':
      key.classList.add("keyboard__key_space");
      key.innerText = '';
      break;
  }
  key.addEventListener('mousedown', () => {
    key.classList.add("keyboard__key_pressed");
    handleMouseUp(key);
    handleTextarea(keyCode);
    textarea.focus();
  })
  key.addEventListener('mouseup', () => {
    key.classList.remove("keyboard__key_pressed");
  })
  keyboardElements.set(keyCode, key);
  keyboard.append(key);
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

const handleMouseUp = (key) => {
  const mouseUpOutOfElement = () => {
    key.classList.remove("keyboard__key_pressed");
    document.removeEventListener('mouseup', mouseUpOutOfElement);
    document.removeEventListener('visibilitychange', mouseUpOutOfElement);
  };
  document.addEventListener('mouseup', mouseUpOutOfElement);
  document.addEventListener('visibilitychange', mouseUpOutOfElement);
}

const handleKeyUp = (key) => {
  const mouseUpOutOfElement = () => {
    key.classList.remove("keyboard__key_pressed");
    document.removeEventListener('visibilitychange', mouseUpOutOfElement);
  };
  document.addEventListener('visibilitychange', mouseUpOutOfElement);
}
