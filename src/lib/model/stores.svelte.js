import { Alphabet } from './Alphabet.svelte';

/**
 * The shared alphabet store
 * @type {Alphabet}
 */
let alphabet = $derived(new Alphabet());

/**
 * Global activation of symbol decoding in UI
 * @type {{value:boolean}}
 */
export let decodeSymbols = $state({value:true});

/**
 * Fetch the store from server if not already done
 * @param {function(RequestInfo|URL): Promise<Response>} fetchFn
 */
export async function loadAlphabet (fetchFn) {
    if (alphabet.fileName=="") {
        console.log("Loading alphabet");
        let doc = await Alphabet.download(fetchFn);
        if (doc) {
            alphabet.items = doc.items;
            alphabet.fileName = Alphabet.ALPHABET_NAME;
        }
    }
    return alphabet;
}

