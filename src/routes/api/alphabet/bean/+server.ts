import { error, type RequestHandler } from "@sveltejs/kit";
import { Alphabet, SymbolBean } from '$lib/model/model.svelte.js';

/** Add a bean to the alphabet */
export const PUT: RequestHandler = async ({ params, request }) => {
  let body = await request.text();
  let raw = JSON.parse(body);
  let bean = SymbolBean.fromJSON(raw);
  let alphabet = Alphabet.fromFile();
  if (!alphabet || !bean) {
    return error(404, `File ${Alphabet.ALPHABET_NAME} not found`);
  }
  alphabet.add(bean);
  alphabet.toFile();
  return new Response();
};

/** Removes a bean from the alphabet */
export const DELETE: RequestHandler = async ({ params, request }) => {
  let body = await request.text();
  let raw = JSON.parse(body);
  let bean = SymbolBean.fromJSON(raw);
  let alphabet = Alphabet.fromFile();
  if (!alphabet || !bean) {
    return error(404, `File ${Alphabet.ALPHABET_NAME} not found`);
  }
  alphabet.delete(bean);
  alphabet.toFile();
  return new Response();
};
