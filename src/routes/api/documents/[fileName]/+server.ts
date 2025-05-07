import { error, type RequestHandler } from "@sveltejs/kit";
import { Notebook } from '$lib/model/model.svelte.js';

/** Retrieve a document */
export const GET: RequestHandler = async ({ params }) => {
  const { fileName } = params;
  if (!fileName) {
    return error(404, `File '${fileName}' not found`);
  }
  let document = Notebook.fromFile(fileName);
  if (!document) {
    return error(404, `File'${fileName}' not found`);
  }
  return new Response(JSON.stringify(document));
};

/** Save a document */
export const POST: RequestHandler = async ({ params, request }) => {
  const { fileName } = params;

  if (fileName) {
    let body = await request.text();
    let document = Notebook.parseJSON(body);
    document.toFile(fileName);
  }

  return new Response();
};
