import { json, type RequestHandler } from "@sveltejs/kit";
import path from 'path';

/** List of screenshots to analyze */
export const GET: RequestHandler = async () => {
  const screenshots = import.meta.glob("/dist/screenshots/*.jpg", {
    query: "?raw",
    import: "default",
  });
  return json(Object.keys(screenshots).map((p) => path.basename(p)));
};
