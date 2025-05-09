<script>
	import {Navbar, NavBrand, NavLi, NavUl} from 'flowbite-svelte';
</script>

<header class="sticky top-0 z-40">
<Navbar class="w-full bg-gray-700">
	<NavBrand href="/">
		<img src="/favicon.png" class="me-3 h-6" alt="Logo" />
		<span class="self-center text-xl font-semibold">Notebook</span>
	</NavBrand>
	<NavUl>
		<NavLi class="text-white" href="/gallery">Notes</NavLi>
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
