import { error, type RequestHandler } from "@sveltejs/kit";
import { Alphabet, TokenLocation, NotebookStatistics } from '$lib/model/model.svelte.js';
import { Notebook } from "$lib/model/Notebook.svelte";
import { SYMBOL_PATTERN_GLOBAL, SYMBOL_WORD_PATTERN } from "$lib/marked/marked-tunic.svelte";
import { SymbolBean } from "$lib/model/SymbolBean.svelte";

/** Builds statistics from documents */
function buildDocumentsStatistics(): NotebookStatistics {
  // Reads documents and collect symbols
  let stats = new NotebookStatistics();

  const files = Notebook.getDocuments();
  for (const file in files) {
    const document = Notebook.fromFile(`.${file}`);
    const matchWords = document?.text.matchAll(SYMBOL_WORD_PATTERN);
    matchWords?.forEach (word => {
      const matchChar = word[0].matchAll(SYMBOL_PATTERN_GLOBAL)
      matchChar?.forEach (token => {
        let symbol = new SymbolBean(token[1]);
        let context = new TokenLocation();
        context.fileName = file;
        context.token = token[0];
        context.tokenStart = token.index;
        context.word = word[0];
        context.wordStart = word.index;
        stats.add(symbol, context);
      });
    });
  }

  return stats;
}

/** Retrieve a document */
export const GET: RequestHandler = async ({}) => {
  let alphabet = Alphabet.fromFile(Alphabet.ALPHABET_NAME);
  if (!alphabet) {
    return error(404, `File ${Alphabet.ALPHABET_NAME} not found`);
  }

  // Reads documents and collect symbols
  let stats = buildDocumentsStatistics();
//console.log("stats", stats.toJSON());
  return new Response(JSON.stringify(stats));
};
