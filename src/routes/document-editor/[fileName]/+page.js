import { loadAlphabet, Notebook } from '$lib/model/model.svelte';

// TODO: activate SSR, need to solve @html problem
// https://svelte.dev/docs/svelte/runtime-warnings#Client-warnings-hydration_html_changed
export const ssr = false;

export async function load ({ params, fetch }) {
	/** @type {string|null} */
	let documentName = params.fileName;
	const notebook = await Notebook.download(documentName, fetch);

	return { alphabet: await loadAlphabet(fetch), notebook: notebook };
};
