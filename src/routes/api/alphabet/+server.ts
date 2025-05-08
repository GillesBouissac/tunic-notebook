import { error, type RequestHandler } from "@sveltejs/kit";
import { Alphabet } from '$lib/model/model.svelte.js';

/** Retrieve a document */
export const GET: RequestHandler = async ({}) => {
  let document = Alphabet.fromFile();
  if (!document) {
    return error(404, `File ${Alphabet.ALPHABET_NAME} not found`);
  }
  return new Response(JSON.stringify(document));
};

/** Save a document */
export const POST: RequestHandler = async ({ params, request }) => {
  let body = await request.text();
  let document = Alphabet.parseJSON(body);
  document.toFile();
  return new Response();
};
