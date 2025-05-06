
export class AbstractBean {

  toJSON() {
    return {};
  }

  /** @param {any} _jsonObj */
  fromJSON(_jsonObj) {
    return this;
  }

}
