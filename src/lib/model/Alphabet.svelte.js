import { AbstractBean } from "$lib/model/AbstractBean.svelte.js";
import { SymbolBean } from "$lib/model/SymbolBean.svelte.js";
import fs from 'fs';
import path from 'path';

export class Alphabet extends AbstractBean {

  static ALPHABET_LOC = "./dist/alphabet/";
  static ALPHABET_NAME = "alphabet.json";

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

  /** @returns {Map<number, SymbolBean>} */
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
   * @param {string} fileName
   */
  static fromFile(fileName) {
    let fullPath = Alphabet.ALPHABET_LOC + path.basename(fileName);
    let document;
    try {
      let jsonText;
      if ( !fs.existsSync(fullPath) ) {
        jsonText = "[]";
      }
      else {
        jsonText = fs.readFileSync(fullPath, 'utf8');
      }
      document = Alphabet.parseJSON(jsonText);
    }
    catch (err) {
      console.log(`Error reading file ${fullPath}: ${err}`);
      return null;
    }
    return document;
  }

  /**
   * @param {string} fileName
   */
  toFile(fileName) {
    let fullPath = Alphabet.ALPHABET_LOC + path.basename(fileName);
    let serialized = JSON.stringify(this);
    try {
      fs.writeFileSync(fullPath, serialized);
    }
    catch (err) {
      console.log(`Error writing file ${fullPath}: ${err}`);
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
        let bean = SymbolBean.fromJSON(item[1])
        return [item[0], bean]
      })
    );
    return this;
  }

  /** @param {SymbolBean} bean */
  async addPersistent (bean) {
    this.add(bean);
    const response = await fetch(`/api/alphabet/bean`, {
      method: 'PUT',
      headers: { 'Content-type': 'application/json'},
      body: JSON.stringify(bean)
    });
  }

  /** @param {SymbolBean} bean */
  async deletePersistent (bean) {
    this.delete(bean);
    const response = await fetch(`/api/alphabet/bean`, {
      method: 'DELETE',
      headers: { 'Content-type': 'application/json'},
      body: JSON.stringify(bean)
    });
  }

  static async download () {
    const response = await fetch(`/api/alphabet`);
    let document;
    if (response.ok) {
      let json = await response?.text();
      document = Alphabet.parseJSON(json);
    }
    return document;
  }

  async upload() {
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
   * @param {SymbolBean|number} item
   * @return {boolean}
   */
  delete (item) {
    return (typeof item === 'number' ? this._items.delete(item) : this._items.delete(item.code));
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
