import { error, type RequestHandler } from "@sveltejs/kit";
import { completeAlphabet } from '$lib/server/utils.svelte.js';
import { Alphabet } from '$lib/model/model.svelte.js';

const ALPHABET_LOC = "./dist/alphabet/alphabet.json";

/** Retrieve a document */
export const GET: RequestHandler = async ({}) => {
  let document = Alphabet.fromFile(ALPHABET_LOC);
  if (!document) {
    return error(404, `File ${ALPHABET_LOC} not found`);
  }
  return new Response(JSON.stringify(document));
};

/** Save a document */
export const POST: RequestHandler = async ({ params, request }) => {
  let body = await request.text();
  let document = Alphabet.parseJSON(body);
  document.toFile(ALPHABET_LOC);
  completeAlphabet();
  return new Response();
};
