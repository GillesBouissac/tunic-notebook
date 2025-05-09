import path from "path";
import { SymbolBean } from "./SymbolBean.svelte";
import { SYMBOL_PATTERN_GLOBAL } from "$lib/marked/marked-tunic.svelte";

/** Context of a token in a document */
export class TokenContext {
  /** @type {number} */
  code = 0;
  /** @type {string} */
  fileName = "";
  /** @type {string} */
  token = "";
  /** @type {number} */
  tokenStart = 0;
  /** @type {number} */
  wordStart = 0;
  /** @type {string} */
  _word = "";
  /** @type {number[]} */
  _wordChars = [];

  set word(value) {
    this._word = value;
    if (this._word) {
      let match = this._word.matchAll(SYMBOL_PATTERN_GLOBAL);
      this._wordChars = [...match].map(e => {
        let symbol = new SymbolBean(e[1]);
        return symbol.code;
      });
    }
    this._word = this._wordChars.map((e)=>`tunic(0x${e.toString(16).toUpperCase()})`).join("");
  }

  get word() {
    return this._word;
  }

  get wordChars() {
    return this._wordChars;
  }

  toJSON() {
    let jsonObj = {
      code:this.code,
      fileName: this.fileName,
      token:this.token,
      tokenStart:this.tokenStart,
      word:this.word,
      wordStart:this.wordStart,
    };
    return jsonObj;
  }

  /** @param {any} jsonObj */
  static fromJSON(jsonObj) {
    let newObj = new TokenContext();
    newObj.code = jsonObj['code'];
    newObj.fileName = jsonObj['fileName'];
    newObj.token = jsonObj['token'];
    newObj.tokenStart = jsonObj['tokenStart'];
    newObj.word = jsonObj['word'];
    newObj.wordStart = jsonObj['wordStart'];
    return newObj;
  }
}

export class Statistics {

  /**
   * Image linked to this document
   * @type {Map<number, TokenContext[]>}
   * @private
   */
  _items = new Map();

  get items() {
    return this._items;
  }

  /**
   * 
   * @param {SymbolBean} bean 
   * @param {TokenContext} context 
   */
  add(bean, context) {
    context.fileName = path.basename(context.fileName);
    if (!this._items.has(bean.code)) {
      this._items.set(bean.code, []);
    }
    let contextList = this._items.get(bean.code);
    contextList?.push(context);
  }

  /**
   * @param {number} code
   * @return {Partial<Record<string, TokenContext[]>>}
   */
  filesRef(code) {
    let contexts = this.items.get(code)
    /** @type {Partial<Record<string, TokenContext[]>>} */
    let result = {};
    if (contexts) {
      result = Object.groupBy(contexts, (context) => context.fileName);
    }
    return result;
  }

  /**
   * @param {number} code
   * @return {Partial<Record<string, TokenContext[]>>}
   */
  wordsRef(code) {
    let contexts = this.items.get(code)
    /** @type {Partial<Record<string, TokenContext[]>>} */
    let result = {};
    if (contexts) {
      result = Object.groupBy(contexts, (context) => context.word);
    }
    return result;
  }

  /** @private */
  itemsMapToJSON() {
    return [...this._items.entries()].map(([k,v]) => {
      return [k, v.map(tl => tl.toJSON())]
    })
  }

  /**
   * @param {any[]} jsonObj 
   * @private
   */
  static itemsMapFromJSON(jsonObj) {
    let map = new Map();
    jsonObj.forEach(entry => {
      map.set(entry[0], entry[1].map((/** @type {any} */ e) => TokenContext.fromJSON(e)));
    });
    return map;
  }

  toJSON() {
    let jsonObj = {
      items: this.itemsMapToJSON()
    };
    return jsonObj;
  }

  /** @param {any} jsonObj */
  static fromJSON(jsonObj) {
    let newObj = new Statistics();
    newObj._items = Statistics.itemsMapFromJSON(jsonObj["items"]);
    return newObj;
  }

  /**
   * @param {function(RequestInfo|URL): Promise<Response>=} fetchFn
   */
  static async download (fetchFn) {
    const url = `/api/statistics/`;
    const f = fetchFn ? fetchFn : fetch;
    const response = await f(url);
    let newObj = new Statistics();
    if (response.ok) {
      let json = await response?.text();
      newObj = Statistics.fromJSON(JSON.parse(json));
    }
    return newObj;
  }
}
