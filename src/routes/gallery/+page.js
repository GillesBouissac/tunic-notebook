import { loadAlphabet, Notebook } from '$lib/model/model.svelte';

// TODO: activate SSR, need to solve @html problem
// https://svelte.dev/docs/svelte/runtime-warnings#Client-warnings-hydration_html_changed
export const ssr = false;

export async function load ({ params, fetch }) {
	return { alphabet: await loadAlphabet(fetch), notebooks: await fetchNotebooks(fetch) };
};

/**
 * @param {function(RequestInfo|URL): Promise<Response>} fetch
 */
async function fetchNotebooks(fetch) {
	let documents = []
	let answer = await fetch("/api/screenshots/list");
	let images = await answer.json();
	for ( const imagefile of images ) {
		const basename = imagefile.replace(/\.[^/.]+$/, "");
		const jsonfile = `${basename}.json`;
		let document = await Notebook.download(jsonfile, fetch);
		if (!document) {
			document = Notebook.newDocument(jsonfile, imagefile);
			await document.upload(fetch);
		}
		documents.push({
			imagefile:imagefile,
			documentfile:jsonfile,
			documentcontent:document.text.length==0 ? "Use edit button to add notes" : document.text
		});
	}
	return documents;
}

