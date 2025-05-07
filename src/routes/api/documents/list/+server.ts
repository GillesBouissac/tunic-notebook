import { Notebook } from "$lib/model/Notebook.svelte";
import { json, type RequestHandler } from "@sveltejs/kit";
import path from 'path';

/** List of analyzed documents */
export const GET: RequestHandler = async () => {
  const documents = Notebook.getDocuments()
  return json(Object.keys(documents).map((p) => path.basename(p)));
};

