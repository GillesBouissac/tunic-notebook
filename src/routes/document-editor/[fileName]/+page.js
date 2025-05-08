import { loadAlphabet, Notebook } from '$lib/model/model.svelte';

export async function load ({ params, fetch }) {
	/** @type {string|null} */
	let documentName = params.fileName;
	const text = await Notebook.download(documentName);

	return { alphabet: await loadAlphabet(fetch), text: text };
};
