import { keyCodes } from "./key-codes.js"

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
  <p class="info__text">Для переключения языка используйте Alt + Ctrl</p>
  </section>`
);

const keyboard = document.querySelector(".keyboard");
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
  keyboardElements.set(keyCode, keyElement);
  keyboard.append(keyElement);
}

export { keyboardElements, textarea };