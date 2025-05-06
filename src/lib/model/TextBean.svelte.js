import { AbstractBean } from "./AbstractBean.svelte.js";

export class TextBean extends AbstractBean {

    /** @type {string} */
    text = $state("");

    /** @param {string} text */
    constructor(text = "-") {
        super();
        /** @type {string} */
        this.text = text;
    }

    toJSON() {
        let jsonObj = {
          ...super.toJSON(),
          class: "TextBean",
          text: this.text
        };
        return jsonObj;
    }

    /** @param {any} jsonObj */
    fromJSON(jsonObj) {
        super.fromJSON(jsonObj);
        this.text = jsonObj['text'];
        return this;
    }

}
