import { loadAlphabet } from '$lib/model/model.svelte';

export async function load ({ fetch }) {
	return { alphabet: await loadAlphabet(fetch) };
};
