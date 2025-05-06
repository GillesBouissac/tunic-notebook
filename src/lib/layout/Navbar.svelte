<script>
	import {
		Navbar,
		NavBrand
	} from 'flowbite-svelte';
</script>

<header class="flex-none w-full">
	<Navbar let:hidden>
		<NavBrand href="/">
			<span class="self-center text-xl font-semibold">Tunic</span>
		</NavBrand>
	</Navbar>
</header>
