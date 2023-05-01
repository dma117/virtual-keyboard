class SymbolKey {
  constructor(primaryValue, secondaryValue) {
    this.primaryValue = primaryValue;
    this.secondaryValue = secondaryValue;
  }

  get primaryValue() {
    return this.keyPrimaryValue;
  }

  set primaryValue(newPrimary) {
    this.keyPrimaryValue = newPrimary;
  }

  get secondaryValue() {
    return this.keySecondaryValue;
  }

  set secondaryValue(newSecondary) {
    this.keySecondaryValue = newSecondary;
  }
}

export default SymbolKey;
