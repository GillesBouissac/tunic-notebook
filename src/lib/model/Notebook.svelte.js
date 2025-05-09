import fs from 'fs';
import path from 'path';

export class Notebook {

  static NOTEBOOK_LOC = "./dist/documents/";
  static getDocuments() {
    return import.meta.glob("/dist/documents/*.json", {
      query: "?raw",
      import: "default",
    });
  }

  /**
   * @type {string}
   * @protected
   */
  _text = $state("");

  /**
   * @type {string}
   * @protected
   */
  _fileName = $state("");

  /**
   * Document name
   * @type {string}
   * @protected
   */
  _title = $state("");

  /**
   * Image linked to this document
   * @type {string}
   * @private
   */
  _image = "";

  /**
   * @param {string=} documentName
   * @param {string=} image
   * @private
   */
  constructor(documentName, image) {
    if (documentName) {
      this.fileName = documentName;
      this.title = documentName ? documentName : "New Document";
      this.image = image ? image : "";
      this.text = "";
    }
  }

  /**
   * @param {string} documentName
   * @param {string} image
   */
  static newDocument(documentName, image) {
    return new Notebook(documentName, image);
  }

  get text() {
    return this._text;
  }

  /** @param {string} value */
  set text(value) {
    this._text = value;
  }

  /** @return {string} */
  get title() {
    return this._title;
  }

  /** @param {string} value */
  set title(value) {
    this._title = value;
  }

  /** @return {string} */
  get fileName() {
    return this._fileName;
  }

  /** @param {string} value */
  set fileName(value) {
    this._fileName = value;
  }

  set image(value) {
    this._image = value;
  }

  get image() {
    return this._image;
  }

  /** @param {string} fileName */
  static fromFile(fileName) {
    let fullPath = Notebook.NOTEBOOK_LOC + path.basename(fileName);
    let document;
    try {
      let jsonText = fs.readFileSync(fullPath, 'utf8');
      document = Notebook.parseJSON(jsonText);
    }
    catch (err) {
      return null;
    }
    return document;
  }

  /** @param {string} fileName */
  toFile(fileName) {
    let fullPath = Notebook.NOTEBOOK_LOC + path.basename(fileName);
    try {
      fs.writeFileSync(fullPath, JSON.stringify(this));
    }
    catch (err) {
      console.error(`Error writing File ${fullPath}:`, err);
    }
  }

  toJSON() {
    let jsonObj = {
      text: this._text,
      title: this._title,
      fileName: this._fileName,
      image:this._image
    };
    return jsonObj;
  }

  /** @param {any} jsonObj */
  fromJSON(jsonObj) {
    this._text = jsonObj['text'];
    this._title = jsonObj['title'];
    this._fileName = jsonObj['fileName'];
    this._image = jsonObj['image'];
    return this;
  }

  /** @param {string} jsonText */
  static parseJSON(jsonText) {
    let raw = JSON.parse(jsonText);
    let newObj = new Notebook();
    newObj.fromJSON(raw);
    return newObj;
  }

  /**
   * @param {string} fileName
   * @param {function(RequestInfo|URL): Promise<Response>=} fetchFn
   */
  static async download (fileName, fetchFn) {
    const url = `/api/documents/${fileName}`;
    const f = fetchFn ? fetchFn : fetch;
    const response = await f(url);
    let document = null;
    if (response.ok) {
      let json = await response?.text();
      document = Notebook.parseJSON(json);
      document.fileName = fileName;
    }
    return document;
  }

  /**
   * @param {function(RequestInfo|URL): Promise<Response>=} fetchFn
   */
  async upload(fetchFn) {
    const url = `/api/documents/${this.fileName}`;
    const f = fetchFn ? fetchFn : fetch;
    await f(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json'},
      body: JSON.stringify(this)
    })
  }

}
