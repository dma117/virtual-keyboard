class LetterKey {
  constructor(keyValue) {
    this.value = keyValue;
  }

  get value() {
    return this.keyValue;
  }

  set value(newValue) {
    this.keyValue = newValue;
  }
}

export default LetterKey;
