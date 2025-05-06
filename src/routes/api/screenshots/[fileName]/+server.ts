import { error, type RequestHandler } from "@sveltejs/kit";
import fs from 'fs';

const DOCUMENTS_LOC = "./dist/screenshots";

/** Retrieve a document */
export const GET: RequestHandler = async ({ params }) => {
  const { fileName } = params;
  let document;
  try {
    document = fs.readFileSync(`${DOCUMENTS_LOC}/${fileName}`);
  }
  catch (err) {
    return error(404, `File ${fileName} doesn't exist yet`);
  }

  let rsp = new Response(document);
  rsp.headers.set("Cache-Control", "public, max-age=31536000");
  return rsp;
};
