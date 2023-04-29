let section = document.createElement('section');
let textarea = document.createElement('textarea');
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

let keyboard = document.querySelector(".keyboard");

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

const availableKeyValues = [
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

let isLetterKey = (keyValue) => {
  const codeA = 65;
  const codeZ = 90;
  const keyCode = keyValue.codePointAt(0);
  const additionalLetterKey = additionalLetterKeys.includes(keyValue);
  return (keyCode >= codeA && keyCode <= codeZ) || additionalLetterKey;
};
let isDigitKey = (keyValue) => keyValue >= "0" && keyValue <= "9";
let isSpecialKey = (keyValue) => specialKeys.includes(keyValue);

const keyboardKeys = [];
for (let i = 0; i < availableKeyValues.length; i++) {
  let keyValue = availableKeyValues[i];
  let keyType = 
      isLetterKey(keyValue) ? keyTypes.letter :
      isDigitKey(keyValue) ? keyTypes.digit :
      keyTypes.special;
  let key = new Key(keyValue, keyType);
  keyboardKeys.push(key);
}

for (let i = 0; i < keyboardKeys.length; i++) {
  let keyValue = keyboardKeys[i].value;
  let key = document.createElement('button');
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
  keyboard.append(key);
}
