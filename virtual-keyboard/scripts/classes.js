class LetterKey {
  constructor(keyValue) {
    this.value = keyValue;
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    this._value = newValue; 
  }
}

class SymbolKey {
  constructor(primaryValue, secondaryValue) {
    this.primaryValue = primaryValue;
    this.secondaryValue = secondaryValue;
  }

  get primaryValue() {
    return this._primaryValue;
  }

  set primaryValue(newPrimary) {
    this._primaryValue = newPrimary; 
  }

  get secondaryValue() {
    return this._secondaryValue;
  }

  set secondaryValue(newSecondary) {
    this._secondaryValue = newSecondary; 
  }
}

class CommandKey {
  constructor(keyValue) {
    this.value = keyValue;
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    this._value = newValue; 
  }
}

export { LetterKey, SymbolKey, CommandKey };
