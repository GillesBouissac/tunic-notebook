import { error, type RequestHandler } from "@sveltejs/kit";
import { completeAlphabet } from '$lib/server/utils.svelte.js';
import { SymbolDocument } from '$lib/model/model.svelte.js';

const DOCUMENTS_LOC = "./dist/documents";

/** Retrieve a document */
export const GET: RequestHandler = async ({ params }) => {
  const { fileName } = params;
  let document = SymbolDocument.fromFile(`${DOCUMENTS_LOC}/${fileName}`);
  if (!document) {
    return error(404, `File ${fileName} not found`);
  }
  return new Response(JSON.stringify(document));
};

/** Save a document */
export const POST: RequestHandler = async ({ params, request }) => {
  const { fileName } = params;

  if (fileName) {
    let body = await request.text();
    let document = SymbolDocument.parseJSON(body);
    document.toFile(`${DOCUMENTS_LOC}/${fileName}`);
    completeAlphabet();
  }

  return new Response();
};
