import path from "path";
import { SymbolBean } from "./SymbolBean.svelte";
import { SYMBOL_PATTERN_GLOBAL } from "$lib/marked/marked-tunic.svelte";

/** Context of a token in a document */
export class TokenLocation {
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
  }

  get word() {
    return this._word;
  }

  get wordChars() {
    return this._wordChars;
  }

  toJSON() {
    let jsonObj = {
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
    let newObj = new TokenLocation();
    newObj.fileName = jsonObj['fileName'];
    newObj.token = jsonObj['token'];
    newObj.tokenStart = jsonObj['tokenStart'];
    newObj.word = jsonObj['word'];
    newObj.wordStart = jsonObj['wordStart'];
    return newObj;
  }
}

export class NotebookStatistics {

  /**
   * Image linked to this document
   * @type {Map<number, Map<string, TokenLocation[]>>}
   * @private
   */
  _items = new Map();

  get items() {
    return this._items;
  }

  /**
   * 
   * @param {SymbolBean} bean 
   * @param {TokenLocation} context 
   */
  add(bean, context) {
    context.fileName = path.basename(context.fileName);
    if (!this._items.has(bean.code)) {
      this._items.set(bean.code, new Map());
    }
    let fileContext = this._items.get(bean.code);
    if (!fileContext?.has(context.fileName)) {
      fileContext?.set(context.fileName, []);
    }
    let contextList = fileContext?.get(context.fileName);
    contextList?.push(context);
  }

  /**
   * @param {number} code
   */
  filesRef(code) {
    let fileMap = this.items.get(code)
    if (fileMap) {
      return [...fileMap.keys()];
    }
    return [];
  }

  /**
   * @param {number} code
   * @returns {TokenLocation[]}
   */
  wordsRef(code) {
    /** @type {TokenLocation[]} */
    let tokenRefs = [];
    this.items.get(code)?.forEach((v,_) => tokenRefs.push(...v));
    return tokenRefs;
  }

  /**
   * @param {Map<string, TokenLocation[]>} fileMap
   * @private
   */
  fileMapToJSON(fileMap) {
    return [...fileMap.entries()].map(([k,v]) => {
      return [k, v.map(tl => tl.toJSON())]
    })
  }

  /** @private */
  itemsMapToJSON() {
    return [...this._items.entries()].map(([k,v]) => {
      return [k, this.fileMapToJSON(v)]
    })
  }

  /**
   * @param {any[]} jsonObj 
   * @private
   */
  static fileMapFromJSON(jsonObj) {
    let map = new Map();
    jsonObj.forEach(entry => {
      map.set(entry[0], entry[1].map((/** @type {any} */ e) => TokenLocation.fromJSON(e)));
    });
    return map;
  }

  /**
   * @param {any[]} jsonObj 
   * @private
   */
  static itemsMapFromJSON(jsonObj) {
    let map = new Map();
    jsonObj.forEach(entry => {
      map.set(entry[0], this.fileMapFromJSON(entry[1]));
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
    let newObj = new NotebookStatistics();
    newObj._items = NotebookStatistics.itemsMapFromJSON(jsonObj["items"]);
    return newObj;
  }

  static async download () {
    const response = await fetch(`/api/statistics/alphabet/`);
    let newObj = new NotebookStatistics();
    if (response.ok) {
      let json = await response?.text();
      newObj = NotebookStatistics.fromJSON(JSON.parse(json));
    }
    return newObj;
  }
}
