import { json, type RequestHandler } from "@sveltejs/kit";
import path from 'path';

/** List of analyzed documents */
export const GET: RequestHandler = async () => {
  const documents = import.meta.glob("/dist/documents/*.json", {
    query: "?raw",
    import: "default",
  });

  return json(Object.keys(documents).map((p) => path.basename(p)));
};

