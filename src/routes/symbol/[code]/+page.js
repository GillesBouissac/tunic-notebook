import { loadAlphabet } from '$lib/model/model.svelte';
import { Statistics } from '$lib/model/Statistics.svelte.js';

// TODO: activate SSR, need to solve @html problem
// https://svelte.dev/docs/svelte/runtime-warnings#Client-warnings-hydration_html_changed
export const ssr = false;

export async function load ({ params, fetch }) {
	let stats = await Statistics.download(fetch);
	return { alphabet: await loadAlphabet(fetch), stats: stats, code: params.code };
};
