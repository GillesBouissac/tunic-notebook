<script>
  	import Fa from 'svelte-fa';
  	import { faKey } from '@fortawesome/free-solid-svg-icons';
	import { Navbar, NavBrand, NavLi, NavUl, Toggle } from 'flowbite-svelte';
	import { NoteTooltip } from '$lib/graphics/graphics.svelte';
  	import { decodeSymbols } from '$lib/model/stores.svelte';
</script>

<header class="sticky top-0 z-40">
<Navbar class="w-full bg-gray-700">
	<NavBrand href="/">
		<img src="/favicon.png" class="me-3 h-6" alt="Logo" />
		<span class="self-center text-xl font-semibold">Notebook</span>
	</NavBrand>
	<div class="flex md:order-2">
		<Toggle class="px-4" color="blue" bind:checked={decodeSymbols.value}><Fa class="text-white" icon={faKey} /></Toggle>
		<NoteTooltip placement="bottom">{decodeSymbols.value ? "Click to disable symbol decoding" : "Click to enable symbol decoding"}</NoteTooltip>
	</div>
	<NavUl>
		<NavLi class="text-white" href="/gallery">Notebooks</NavLi>
		<NavLi class="text-white" href="/alphabet">Alphabet</NavLi>
	</NavUl>
</Navbar>
</header>

<style>
	:global(nav > div) {
		padding-block: 0;
	}
	:global(nav > div > div) {
		height: 4rem;
		width: 100%;
		max-width: 100%;
		margin-inline-start: 0;
		margin-inline-end: 0;
		color: white;
	}
</style>
