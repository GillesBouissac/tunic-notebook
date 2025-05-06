import { AbstractDocument } from "./AbstractDocument.svelte.js";
import fs from 'fs';

export class SymbolDocument extends AbstractDocument {

  /**
   * Image linked to this document
   * @type {string}
   * @private
   */
  _image = "";

  constructor() {
    super();
  }

  set image(value) {
    this._image = value;
  }

  get image() {
    return this._image;
  }

  /** @param {string} filePath */
  static fromFile(filePath) {
    let document;
    try {
      let jsonText = fs.readFileSync(filePath, 'utf8');
      document = SymbolDocument.parseJSON(jsonText);
    }
    catch (err) {
      // console.log(`Error reading file ${filePath}: ${err}`);
      return null;
    }
    return document;
  }

  /** @param {string} filePath */
  toFile(filePath) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(this));
    }
    catch (err) {
      console.error(`Error writing File ${filePath}:`, err);
    }
  }

  toJSON() {
    let jsonObj = {
      ...super.toJSON(),
      image:this._image
    };
    return jsonObj;
  }

  /** @param {any} jsonObj */
  fromJSON(jsonObj) {
    super.fromJSON(jsonObj);
    this._image = jsonObj['image'];
    return this;
  }

  /** @param {string} jsonText */
  static parseJSON(jsonText) {
    let raw = JSON.parse(jsonText);
    let newObj = new SymbolDocument();
    newObj.fromJSON(raw);
    return newObj;
  }

  /** @param {string} fileName */
  static async fetch (fileName) {
    const response = await fetch(`/api/documents/${fileName}`);
    let document = null;
    if (response.ok) {
      let json = await response?.text();
      document = SymbolDocument.parseJSON(json);
      document.fileName = fileName;
    }
    return document;
  }

  async save() {
    await fetch(`/api/documents/${this.fileName}`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json'},
      body: JSON.stringify(this)
    })
  }

}
