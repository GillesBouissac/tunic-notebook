import { Alphabet, Notebook, SymbolBean } from '$lib/model/model.svelte.js';
import { SYMBOL_PATTERN_GLOBAL } from '$lib/marked/marked-tunic.svelte';


/**
 * Completes the Alphabet with symbols discovereed from documents and missing
export function completeAlphabet() {

  // Reads documents and collect symbols
  let symbols = new Set<number>();

  const files = Notebook.getDocuments();
  for (const file in files) {
    const document = Notebook.fromFile(`.${file}`);
    const match = document?.text.matchAll(SYMBOL_PATTERN_GLOBAL);
    match?.forEach (m => {
      let symbol = new SymbolBean(m[1]);
      symbols.add(symbol.code);
    });
  }

  // Reads the old alphabet
  let alphabet = Alphabet.fromFile(Alphabet.ALPHABET_NAME);
  if (!alphabet) {
    alphabet = new Alphabet();
  }

  // Complete the alphabet
  symbols.forEach(code => {
    if (!alphabet.has(code)) {
      alphabet.add(new SymbolBean(code, ""));
    }
  });

  // Clean alphabet from unused, not translated, symbols
  alphabet.items = new Map<number, SymbolBean>(
    [...alphabet.items].filter(([k, v]) => (v && v.meaning!=""))
  );

  // Save the new alphabet
  alphabet.toFile(Alphabet.ALPHABET_NAME);
};
 */
