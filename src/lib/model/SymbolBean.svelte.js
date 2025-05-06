import { AbstractBean } from "./AbstractBean.svelte.js";

export class SymbolBean extends AbstractBean {

    /**
     * @type {number}
     * @private
     */
    _code = $state(0);
    /**
     * @type {string}
     * @private
     */
    _meaning = $state("");

    /**
     * @param {number} code
     * @param {string} meaning
     */
    constructor(code = 0x7FFF, meaning = "") {
        super();
        this.code = code;
        this.meaning = meaning;
    }

    /**
     * @param {SymbolBean|undefined} copy
     */
    static clone(copy) {
        let newBean = new SymbolBean();
        if (copy) {
            newBean._code = copy._code;
            newBean._meaning = ""+copy._meaning;
        }
        return newBean;
    }

    toJSON() {
        let jsonObj = {
          ...super.toJSON(),
          class: "SymbolBean",
          code: this._code,
          meaning: this._meaning
        };
        return jsonObj;
    }

    /** @param {any} jsonObj */
    fromJSON(jsonObj) {
        super.fromJSON(jsonObj);
        this._code = jsonObj['code'];
        this._meaning = jsonObj['meaning'];
        return this;
    }

    /**
     * @param {number} value
     */
    set code(value) {
        this._code = value;
    }

    get code() {
        return this._code;
    }

    /** @return {string} */
    get codeString() {
        return `0x${this._code?.toString(16).toUpperCase()}`;
    }

    /**
     * @param {string} value
     */
    set meaning(value) {
        this._meaning = value;
    }

    get meaning() {
        return this._meaning;
    }

    /**
     * @param {string} value
     */
    set text(value) {
        this.meaning = value;
    }

    get text() {
        return this.meaning;
    }
}
