import { Alphabet, SymbolDocument, SymbolBean } from '$lib/model/model.svelte.js';
import { SYMBOL_PATTERN_GLOBAL } from '$lib/marked/marked-tunic.svelte';

const ALPHABET_LOC = "./dist/alphabet/alphabet.json";

/**
 * Completes the Alphabet with symbols discovereed from documents and missing
 */
export function completeAlphabet() {

  // Reads documents and collect symbols
  let symbols = new Set<number>();

  const files = import.meta.glob("/dist/documents/*.json", {
    query: "?raw",
    import: "default",
  });

  for (const file in files) {
    const document = SymbolDocument.fromFile(`.${file}`);
    const match = document?.text.matchAll(SYMBOL_PATTERN_GLOBAL);
    match?.forEach (m => {
      symbols.add(parseInt(m[1]));
    });
  }

  // Reads the old alphabet
  let alphabet = Alphabet.fromFile(ALPHABET_LOC);
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
    [...alphabet.items].filter(([k, v]) => symbols.has(k) || (v && v.meaning!=""))
  );

  // Save the new alphabet
  alphabet.toFile(ALPHABET_LOC);
};
