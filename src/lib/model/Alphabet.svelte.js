import { AbstractBean } from "$lib/model/AbstractBean.svelte.js";
import { SymbolBean } from "$lib/model/SymbolBean.svelte.js";
import fs from 'fs';

export class Alphabet extends AbstractBean {

  /**
   * @type {Map<number, SymbolBean>}
   * @protected
   */
  _items = $state(new Map());

  /**
   * @type {string}
   * @protected
   */
  _fileName = $state("");

  constructor() {
    super();
  }

  set items(value) {
    this._items = value;
  }

  get items() {
    return this._items;
  }

  /** @param {string} value */
  set fileName(value) {
    this._fileName = value;
  }

  /** @return {string} */
  get fileName() {
    return this._fileName;
  }

  /**
   * @param {string} filePath
   */
  static fromFile(filePath) {
    let document;
    try {
      let jsonText;
      if ( !fs.existsSync(filePath) ) {
        jsonText = "[]";
      }
      else {
        jsonText = fs.readFileSync(filePath, 'utf8');
      }
      document = Alphabet.parseJSON(jsonText);
    }
    catch (err) {
      console.log(`Error reading file ${filePath}: ${err}`);
      return null;
    }
    return document;
  }

  /**
   * @param {string} filePath
   */
  toFile(filePath) {
    let serialized = JSON.stringify(this);
    try {
      fs.writeFileSync(filePath, serialized);
    }
    catch (err) {
      console.log(`Error writing file ${filePath}: ${err}`);
    }
  }

  toJSON() {
    let jsonObj = {
      ...super.toJSON(),
      fileName: this._fileName,
      items: Array.from(this._items.entries())
    };
    return jsonObj;
  }

  /** @param {{fileName: string, items: Array.<[number, SymbolBean]>}} jsonObj */
  fromJSON(jsonObj) {
    super.fromJSON(jsonObj);
    this._fileName = jsonObj["fileName"];
    this._items = new Map(
      jsonObj["items"].map ( item => {
        let bean = new SymbolBean();
        bean.fromJSON(item[1]);
        return [item[0], bean]
      })
    );
    return this;
  }

  /** @param {string} fileName */
  static async fetch (fileName) {
    const response = await fetch(`/api/alphabet`);
    let document;
    if (response.ok) {
      let json = await response?.text();
      document = Alphabet.parseJSON(json);
      document.fileName = fileName;
    }
    return document;
  }

  async save() {
    await fetch(`/api/alphabet`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json'},
      body: JSON.stringify(this)
    })
  }

  /** @param {string} jsonText */
  static parseJSON(jsonText) {
    let raw = JSON.parse(jsonText);
    let newObj = new Alphabet();
    newObj.fromJSON(raw);
    return newObj;
  }

  /**
   * @param {SymbolBean} bean
   * @return {Alphabet}
   */
  add (bean) {
    this._items.set(bean.code, bean);
    return this;
  }

  /**
   * @param {number} code
   * @return {boolean}
   */
  delete (code) {
    return this._items.delete(code);
  }

  /**
   * @param {number} code
   * @return {SymbolBean|undefined}
   */
  get (code) {
    return this._items.get(code);
  }

  /**
   * @param {number} code
   * @return {boolean}
   */
  has (code) {
    return this._items.has(code);
  }

}
