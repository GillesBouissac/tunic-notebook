<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/layout/Navbar.svelte'
	let { children } = $props();
</script>

<svelte:head>
    <title>Tunic notebook</title> 
	<link rel="icon" href="http://localhost:5173/favicon.ico">
</svelte:head>

<Navbar />
<div class="flex px-4 mx-auto w-full">
	<main class="w-full mx-auto">
		{@render children()}
	</main>
</div>
