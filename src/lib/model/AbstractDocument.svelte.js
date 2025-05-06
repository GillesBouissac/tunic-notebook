import { AbstractBean } from "$lib/model/AbstractBean.svelte.js";
import { TextBean } from "$lib/model/TextBean.svelte.js";
import { SymbolBean } from "$lib/model/SymbolBean.svelte.js";

export class AbstractDocument extends AbstractBean {
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
   * @type {TextBean}
   * @private
   */
  _title = $state(new TextBean("doc"));

  constructor() {
    super();
  }

  toJSON() {
    let jsonObj = {
      ...super.toJSON(),
      fileName: this._fileName,
      title: this._title.toJSON(),
      text: this._text,
    };
    return jsonObj;
  }

  /** @param {any} jsonObj */
  fromJSON(jsonObj) {
    super.fromJSON(jsonObj);
    this._fileName = jsonObj['fileName'];
    this._text = jsonObj['text'];
    // @ts-ignore
    this._title = this.beanFromJSON(jsonObj['title']);
    return this;
  }

  /**
   * @param {{ [x: string]: any; }} item
   * @return {AbstractBean}
   */
  beanFromJSON(item) {
    let clss = item['class'];
    /** @type {AbstractBean} */
    let bean = new TextBean("");
    if (clss && clss == "TextBean") {
      bean = new TextBean();
    }
    if (clss && clss == "SymbolBean") {
      bean = new SymbolBean();
    }
    if (bean) {
      bean?.fromJSON(item);
    }
    return bean;
  }

  /** @param {TextBean|string} value */
  set title(value) {
    if (value instanceof TextBean) {
      this._title = value;
    }
    else {
      this._title.text = value;
    }
  }

  /** @return {TextBean} */
  get title() {
    return this._title;
  }

  /** @param {string} value */
  set fileName(value) {
    this._fileName = value;
  }

  /** @return {string} */
  get fileName() {
    return this._fileName;
  }

  get text() {
    return this._text;
  }

  /** @param {string} value */
  set text(value) {
    this._text = value;
  }

}
