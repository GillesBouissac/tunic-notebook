import { loadAlphabet, NotebookStatistics } from '$lib/model/model.svelte';

export async function load ({ fetch }) {
	let stats = await NotebookStatistics.download(fetch);
	return { alphabet: await loadAlphabet(fetch), stats: stats };
};
